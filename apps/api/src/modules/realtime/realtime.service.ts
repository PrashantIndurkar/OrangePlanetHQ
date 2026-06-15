import type { Response } from "express";
import crypto from "crypto";

interface Client {
	id: string;
	userId: string;
	role: string;
	res: Response;
}

class RealtimeService {
	private clients = new Map<string, Client>();
	private nextEventId = 1;
	private heartbeatInterval: NodeJS.Timeout | null = null;

	constructor() {
		this.startHeartbeat();
	}

	/**
	 * Registers a client for SSE updates.
	 */
	registerClient(userId: string, role: string, res: Response): string {
		const clientId = crypto.randomUUID();
		
		const client: Client = {
			id: clientId,
			userId,
			role,
			res,
		};

		this.clients.set(clientId, client);
		console.log(`[Realtime] Client connected. Active clients: ${this.clients.size}`);

		// Send initial handshake event
		this.sendEventToClient(client, "connected", { status: "connected" }, "0");

		return clientId;
	}

	/**
	 * Unregisters a client on disconnection.
	 */
	unregisterClient(clientId: string): void {
		if (this.clients.has(clientId)) {
			this.clients.delete(clientId);
			console.log(`[Realtime] Client disconnected. Active clients: ${this.clients.size}`);
		}
	}

	/**
	 * Broadcasts an event to authenticated clients based on user scoping or admin role.
	 */
	broadcast(
		event: "task.created" | "task.updated" | "task.deleted",
		data: { id: string; userId: string; [key: string]: any },
	): void {
		const eventId = String(this.nextEventId++);
		
		for (const client of this.clients.values()) {
			// Delivery scopes:
			// 1. The client is the owner of the task (task owner's userId matches client's userId).
			// 2. The client is an admin.
			const isOwner = client.userId === data.userId;
			const isAdmin = client.role === "admin";

			if (isOwner || isAdmin) {
				this.sendEventToClient(client, event, data, eventId);
			}
		}
	}

	/**
	 * Sends a structured SSE message to a specific client.
	 */
	private sendEventToClient(
		client: Client,
		event: string,
		data: any,
		id?: string,
	): void {
		try {
			if (id) {
				client.res.write(`id: ${id}\n`);
			}
			client.res.write(`event: ${event}\n`);
			client.res.write(`data: ${JSON.stringify(data)}\n\n`);
		} catch (error) {
			console.error(`[Realtime] Error writing to client ${client.id}:`, error);
			this.unregisterClient(client.id);
		}
	}

	/**
	 * Starts the heartbeat timer to keep TCP connections alive.
	 */
	private startHeartbeat(): void {
		if (this.heartbeatInterval) return;

		this.heartbeatInterval = setInterval(() => {
			if (this.clients.size === 0) return;

			for (const client of this.clients.values()) {
				try {
					// SSE Keep-Alive heartbeat comment
					client.res.write(":\n\n");
				} catch (error) {
					console.error(`[Realtime] Heartbeat failed for client ${client.id}:`, error);
					this.unregisterClient(client.id);
				}
			}
		}, 25000); // 25 seconds heartbeat interval
	}
}

export const realtimeService = new RealtimeService();

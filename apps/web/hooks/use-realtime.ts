import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { mapBackendTaskToFrontend } from "@/features/tasks/utils";
import { API_BASE_URL } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";

export function useRealtime() {
	const queryClient = useQueryClient();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isAuthenticated) return;

		console.log("[Realtime] Connecting to Server-Sent Events...");
		const eventSource = new EventSource(`${API_BASE_URL}/realtime/events`, {
			withCredentials: true,
		});

		eventSource.onopen = () => {
			console.log("[Realtime] SSE Connection established");
		};

		eventSource.onerror = (error) => {
			console.error("[Realtime] SSE Connection error:", error);
		};

		// Initial connection handshake
		eventSource.addEventListener("connected", (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("[Realtime] Connected status:", data.status);
			} catch (err) {
				console.error("[Realtime] Error parsing connected handshake:", err);
			}
		});

		// Task Created
		eventSource.addEventListener("task.created", (event) => {
			try {
				console.log("[Realtime] task.created event received");
				const data = JSON.parse(event.data);
				const mapped = mapBackendTaskToFrontend(data);

				// Insert newly created task into all matching task list caches immediately
				queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
					if (!old?.tasks) return { tasks: [mapped], total: 1 };
					if (old.tasks.some((t: any) => t.uuid === mapped.uuid)) return old;
					return {
						...old,
						tasks: [mapped, ...old.tasks],
						total: old.total + 1,
					};
				});

				// Background refetch to ensure correct sorting/filtering
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
			} catch (err) {
				console.error("[Realtime] Error processing task.created event:", err);
			}
		});

		// Task Updated
		eventSource.addEventListener("task.updated", (event) => {
			try {
				console.log("[Realtime] task.updated event received");
				const data = JSON.parse(event.data);
				const mapped = mapBackendTaskToFrontend(data);

				// Update cache for specific task details
				queryClient.setQueryData(["task", mapped.uuid], mapped);
				queryClient.setQueryData(["task", mapped.id], mapped);

				// Synchronously update task item in all list queries for instant re-render
				queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
					if (!old?.tasks) return old;
					return {
						...old,
						tasks: old.tasks.map((t: any) =>
							t.uuid === mapped.uuid || t.id === mapped.id ? mapped : t,
						),
					};
				});

				// Trigger background invalidation to keep pagination and custom sorts consistent
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
			} catch (err) {
				console.error("[Realtime] Error processing task.updated event:", err);
			}
		});

		// Task Deleted
		eventSource.addEventListener("task.deleted", (event) => {
			try {
				console.log("[Realtime] task.deleted event received");
				const data = JSON.parse(event.data);
				const mapped = mapBackendTaskToFrontend(data);

				// Remove queries for this specific task
				queryClient.removeQueries({ queryKey: ["task", mapped.uuid] });
				queryClient.removeQueries({ queryKey: ["task", mapped.id] });

				// Synchronously remove item from lists queries cache
				queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
					if (!old?.tasks) return old;
					return {
						...old,
						tasks: old.tasks.filter(
							(t: any) => t.uuid !== mapped.uuid && t.id !== mapped.id,
						),
						total: Math.max(0, old.total - 1),
					};
				});

				// Trigger background list invalidation
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
			} catch (err) {
				console.error("[Realtime] Error processing task.deleted event:", err);
			}
		});

		return () => {
			console.log("[Realtime] Disconnecting SSE event source...");
			eventSource.close();
		};
	}, [isAuthenticated, queryClient]);
}

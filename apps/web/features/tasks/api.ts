import { apiFetch } from "@/lib/api/client";
import type {
	CreateTaskInput,
	ListTasksResponse,
	TaskResponse,
	UpdateTaskInput,
} from "./types";

export async function listTasksApi(filters: {
	status?: string[];
	priority?: string[];
	search?: string;
	sortBy?: string;
	sortOrder?: string;
	page?: number;
	limit?: number;
}): Promise<ListTasksResponse> {
	const params: Record<string, string> = {};
	if (filters.status && filters.status.length > 0) {
		params.status = filters.status.join(",");
	}
	if (filters.priority && filters.priority.length > 0) {
		params.priority = filters.priority.join(",");
	}
	if (filters.search) {
		params.search = filters.search;
	}
	if (filters.sortBy) {
		params.sortBy = filters.sortBy === "created" ? "createdAt" : filters.sortBy;
	}
	if (filters.sortOrder) {
		params.sortOrder = filters.sortOrder;
	}
	if (filters.page) {
		params.page = String(filters.page);
	}
	if (filters.limit) {
		params.limit = String(filters.limit);
	}

	return apiFetch<ListTasksResponse>("/tasks", {
		method: "GET",
		params,
	});
}

export async function getTaskApi(idOrCode: string): Promise<TaskResponse> {
	return apiFetch<TaskResponse>(`/tasks/${idOrCode}`, {
		method: "GET",
	});
}

export async function createTaskApi(
	data: CreateTaskInput,
): Promise<TaskResponse> {
	return apiFetch<TaskResponse>("/tasks", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateTaskApi(
	idOrCode: string,
	data: UpdateTaskInput,
): Promise<TaskResponse> {
	return apiFetch<TaskResponse>(`/tasks/${idOrCode}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteTaskApi(idOrCode: string): Promise<void> {
	return apiFetch<void>(`/tasks/${idOrCode}`, {
		method: "DELETE",
	});
}

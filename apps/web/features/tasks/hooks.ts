import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { Task } from "@/components/workspace/types";
import {
	createTaskApi,
	deleteTaskApi,
	getTaskApi,
	listTasksApi,
	updateTaskApi,
} from "./api";
import type { CreateTaskInput, UpdateTaskInput } from "./types";
import { mapBackendTaskToFrontend } from "./utils";

export function useTasksQuery(filters: {
	status?: string[];
	priority?: string[];
	dueDate?: string[];
	search?: string;
	sortBy?: string;
	sortOrder?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["tasks", filters],
		queryFn: async () => {
			const res = await listTasksApi(filters);
			return {
				tasks: res.tasks.map(mapBackendTaskToFrontend),
				total: res.total,
			};
		},
		placeholderData: keepPreviousData,
	});
}

export function useTaskQuery(idOrCode: string) {
	return useQuery({
		queryKey: ["task", idOrCode],
		queryFn: async () => {
			const res = await getTaskApi(idOrCode);
			return mapBackendTaskToFrontend(res.task);
		},
		enabled: !!idOrCode,
	});
}

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTaskInput) => createTaskApi(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
}

export function useUpdateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
			updateTaskApi(id, data),
		onMutate: async ({ id, data }) => {
			// Cancel any outgoing refetches so they don't overwrite our optimistic update
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			await queryClient.cancelQueries({ queryKey: ["task", id] });

			// Snapshot the previous values
			const previousTasks = queryClient.getQueryData<{
				tasks: Task[];
				total: number;
			}>(["tasks"]);
			const previousTask = queryClient.getQueryData<Task>(["task", id]);

			// Optimistically update single task query cache
			if (previousTask) {
				queryClient.setQueryData(["task", id], (old: Task | undefined) => {
					if (!old) return old;
					return { ...old, ...data };
				});
			}

			// Optimistically update lists query cache
			queryClient.setQueriesData(
				{ queryKey: ["tasks"] },
				(old: { tasks: Task[]; total: number } | undefined) => {
					if (!old?.tasks) return old;
					return {
						...old,
						tasks: old.tasks.map((t: Task) =>
							t.id === id || t.uuid === id ? { ...t, ...data } : t,
						),
					};
				},
			);

			return { previousTasks, previousTask, id };
		},
		onError: (
			_err,
			_variables,
			context:
				| {
						previousTasks: { tasks: Task[]; total: number } | undefined;
						previousTask: Task | undefined;
						id: string;
				  }
				| undefined,
		) => {
			// Rollback
			if (context?.previousTask) {
				queryClient.setQueryData(["task", context.id], context.previousTask);
			}
			if (context?.previousTasks) {
				queryClient.setQueryData(["tasks"], context.previousTasks);
			}
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
			if (data.task?.issueNumber) {
				const strId = `STR-${data.task.issueNumber}`;
				queryClient.invalidateQueries({ queryKey: ["task", strId] });
			}
		},
	});
}

export function useDeleteTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (idOrCode: string) => deleteTaskApi(idOrCode),
		onSuccess: (_, idOrCode) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", idOrCode] });
		},
	});
}

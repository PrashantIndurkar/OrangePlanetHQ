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
	allUsers?: boolean;
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
		retry: (failureCount) => {
			if (failureCount < 5) return true;
			return false;
		},
		retryDelay: 1000,
	});
}

import {
	Cancel01Icon,
	CheckmarkCircle02Icon,
	GitBranchIcon,
	HashIcon,
	Link01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { toast } from "sonner";

const TaskCreatedToast = ({
	task,
	toastId,
}: {
	task: { id: string; uuid?: string; title: string };
	toastId: string | number;
}) => {
	const [copiedText, setCopiedText] = React.useState<string | null>(null);

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		setCopiedText(label);
		setTimeout(() => setCopiedText(null), 2000);
	};

	return (
		<div className="flex w-[350px] flex-col border border-border bg-popover p-3 text-popover-foreground rounded-none shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
			{/* Top row: Success header & Close button */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<HugeiconsIcon
						icon={CheckmarkCircle02Icon}
						className="size-4 text-emerald-500"
						strokeWidth={2}
					/>
					<span className="text-xs font-semibold text-foreground">
						Issue created
					</span>
				</div>
				<button
					type="button"
					onClick={() => toast.dismiss(toastId)}
					className="text-muted-foreground hover:text-foreground outline-none transition-colors cursor-pointer"
				>
					<HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
				</button>
			</div>

			{/* Middle row: Task details */}
			<div className="mt-2 flex items-center gap-1.5 pl-6">
				<div className="size-1.5 rounded-full bg-zinc-400 shrink-0" />
				<span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
					{task.id}
				</span>
				<span className="truncate text-xs font-medium text-foreground">
					{task.title}
				</span>
			</div>

			{/* Bottom row: Action items */}
			<div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 pl-6 text-[11px]">
				<a
					href={`/tasks/${task.uuid || ""}`}
					className="font-semibold text-[#5e6ad2] dark:text-[#8b9bf5] hover:underline"
				>
					View issue
				</a>

				<div className="flex items-center gap-2 relative">
					{copiedText && (
						<span className="absolute -top-7 right-0 z-50 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 px-1.5 py-0.5 text-[9px] font-semibold rounded-none whitespace-nowrap shadow-md">
							Copied {copiedText}!
						</span>
					)}
					<button
						type="button"
						onClick={() =>
							handleCopy(
								`${window.location.origin}/tasks/${task.uuid || ""}`,
								"link",
							)
						}
						className="p-1 border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/55 transition-colors cursor-pointer outline-none rounded-none"
						title="Copy link"
					>
						<HugeiconsIcon icon={Link01Icon} className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() => handleCopy(task.uuid || "", "ID")}
						className="p-1 border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/55 transition-colors cursor-pointer outline-none rounded-none"
						title="Copy ID"
					>
						<HugeiconsIcon icon={HashIcon} className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() =>
							handleCopy(
								`git checkout -b feature/${task.id.toLowerCase()}`,
								"branch",
							)
						}
						className="p-1 border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/55 transition-colors cursor-pointer outline-none rounded-none"
						title="Copy branch command"
					>
						<HugeiconsIcon icon={GitBranchIcon} className="size-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
};

export const lastMutation = {
	type: null as "create" | "delete" | null,
	timestamp: 0,
};

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTaskInput) => createTaskApi(data),
		onMutate: async (newTask) => {
			lastMutation.type = "create";
			lastMutation.timestamp = Date.now();

			await queryClient.cancelQueries({ queryKey: ["tasks"] });

			const previousTasksQueries = queryClient.getQueriesData<{
				tasks: Task[];
				total: number;
			}>({ queryKey: ["tasks"] });

			// Generate a client-side UUID and assign it to the request payload
			const clientUuid =
				typeof crypto !== "undefined" && crypto.randomUUID
					? crypto.randomUUID()
					: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
							const r = (Math.random() * 16) | 0;
							const v = c === "x" ? r : (r & 0x3) | 0x8;
							return v.toString(16);
						});
			newTask.id = clientUuid;

			const optimisticId = `STR-${clientUuid.slice(0, 8).toUpperCase()}`;
			const toastId = `create-task-${clientUuid}`;

			let dueDateStr: string | undefined;
			if (newTask.dueDate) {
				const date = new Date(newTask.dueDate);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);
				const compareDate = new Date(date);
				compareDate.setHours(0, 0, 0, 0);

				if (compareDate.getTime() === today.getTime()) {
					dueDateStr = "Today";
				} else if (compareDate.getTime() === tomorrow.getTime()) {
					dueDateStr = "Tomorrow";
				} else if (compareDate.getTime() < today.getTime()) {
					dueDateStr = "Overdue";
				} else {
					dueDateStr = date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					});
				}
			}

			const optimisticTask: Task = {
				id: optimisticId,
				uuid: clientUuid,
				title: newTask.title,
				status: (newTask.status as Task["status"]) || "todo",
				priority: (newTask.priority as Task["priority"]) || "no-priority",
				dueDate: dueDateStr,
				createdDate: `Created ${new Date().toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				})}`,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				assigneeName: "You",
				assigneeEmail: "",
				description: newTask.description || "",
				activities: [],
			};

			const queries = queryClient
				.getQueryCache()
				.findAll({ queryKey: ["tasks"] });
			for (const query of queries) {
				const queryKey = query.queryKey;
				const filters = queryKey[1] as any;
				const limit = filters?.limit || 10;
				queryClient.setQueryData(
					queryKey,
					(old: { tasks: Task[]; total: number } | undefined) => {
						if (!old) return { tasks: [optimisticTask], total: 1 };
						return {
							...old,
							tasks: [optimisticTask, ...old.tasks].slice(0, limit),
							total: old.total + 1,
						};
					},
				);
			}

			// Write individual task optimistic cache
			queryClient.setQueryData(["task", clientUuid], optimisticTask);
			queryClient.setQueryData(["task", optimisticId], optimisticTask);

			// Trigger optimistic toast
			toast.custom(
				(t) => (
					<TaskCreatedToast
						task={{ id: optimisticId, uuid: clientUuid, title: newTask.title }}
						toastId={t}
					/>
				),
				{ id: toastId, duration: 12000 },
			);

			return { previousTasksQueries, tempUuid: clientUuid, toastId };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousTasksQueries) {
				for (const [queryKey, value] of context.previousTasksQueries) {
					queryClient.setQueryData(queryKey, value);
				}
			}
			if (context?.toastId) {
				toast.error("Failed to create task", { id: context.toastId });
			}
		},
		onSuccess: (data, _variables, context) => {
			const realTask = mapBackendTaskToFrontend(data.task);

			queryClient.setQueriesData(
				{ queryKey: ["tasks"] },
				(old: { tasks: Task[]; total: number } | undefined) => {
					if (!old) return old;
					const exists = old.tasks.some(
						(t) => t.uuid === realTask.uuid || t.id === realTask.id,
					);
					const updatedTasks = exists
						? old.tasks.map((t) =>
								t.uuid === realTask.uuid || t.id === realTask.id ? realTask : t,
							)
						: [realTask, ...old.tasks];

					return {
						...old,
						tasks: updatedTasks,
					};
				},
			);

			// Write real task to cache
			if (context?.tempUuid) {
				queryClient.setQueryData(["task", context.tempUuid], realTask);
			}
			queryClient.setQueryData(["task", realTask.uuid], realTask);
			queryClient.setQueryData(["task", realTask.id], realTask);

			// Invalidate to ensure everything is in perfect sync
			queryClient.invalidateQueries({ queryKey: ["tasks"] });

			// Update the optimistic toast with real details
			if (context?.toastId) {
				toast.custom((t) => <TaskCreatedToast task={realTask} toastId={t} />, {
					id: context.toastId,
					duration: 6000,
				});
			}
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
			const previousTasksQueries = queryClient.getQueriesData<{
				tasks: Task[];
				total: number;
			}>({ queryKey: ["tasks"] });
			const previousTask = queryClient.getQueryData<Task>(["task", id]);

			// Format dueDate to relative friendly string for optimistic UI updates
			const optimisticData = { ...data };
			if (optimisticData.dueDate === null) {
				delete (optimisticData as any).dueDate;
				(optimisticData as any).dueDate = undefined;
			} else if (optimisticData.dueDate) {
				const date = new Date(optimisticData.dueDate);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);
				const compareDate = new Date(date);
				compareDate.setHours(0, 0, 0, 0);

				if (compareDate.getTime() === today.getTime()) {
					optimisticData.dueDate = "Today";
				} else if (compareDate.getTime() === tomorrow.getTime()) {
					optimisticData.dueDate = "Tomorrow";
				} else if (compareDate.getTime() < today.getTime()) {
					optimisticData.dueDate = "Overdue";
				} else {
					optimisticData.dueDate = date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					});
				}
			}

			// Optimistically update single task query cache
			if (previousTask) {
				queryClient.setQueryData(["task", id], (old: Task | undefined) => {
					if (!old) return old;
					return { ...old, ...optimisticData };
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
							t.id === id || t.uuid === id ? { ...t, ...optimisticData } : t,
						),
					};
				},
			);

			return { previousTasksQueries, previousTask, id };
		},
		onError: (_err, _variables, context) => {
			// Rollback
			if (context?.previousTask) {
				queryClient.setQueryData(["task", context.id], context.previousTask);
			}
			if (context?.previousTasksQueries) {
				for (const [queryKey, value] of context.previousTasksQueries) {
					queryClient.setQueryData(queryKey, value);
				}
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
		onMutate: async (idOrCode) => {
			lastMutation.type = "delete";
			lastMutation.timestamp = Date.now();

			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			await queryClient.cancelQueries({ queryKey: ["task", idOrCode] });

			const previousTasksQueries = queryClient.getQueriesData<{
				tasks: Task[];
				total: number;
			}>({ queryKey: ["tasks"] });

			let readableId = idOrCode;
			for (const [, data] of previousTasksQueries) {
				const found = data?.tasks?.find(
					(t) => t.uuid === idOrCode || t.id === idOrCode,
				);
				if (found) {
					readableId = found.id;
					break;
				}
			}

			// Show the toast success notification optimistically
			toast.success(`Task "${readableId}" has been successfully deleted.`, {
				position: "bottom-right",
			});

			queryClient.setQueriesData(
				{ queryKey: ["tasks"] },
				(old: { tasks: Task[]; total: number } | undefined) => {
					if (!old?.tasks) return old;
					const updatedTasks = old.tasks.filter(
						(t) => t.id !== idOrCode && t.uuid !== idOrCode,
					);
					const difference = old.tasks.length - updatedTasks.length;
					return {
						...old,
						tasks: updatedTasks,
						total: Math.max(0, old.total - difference),
					};
				},
			);

			return { previousTasksQueries, idOrCode, readableId };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousTasksQueries) {
				for (const [queryKey, value] of context.previousTasksQueries) {
					queryClient.setQueryData(queryKey, value);
				}
			}
		},
		onSuccess: (_, idOrCode) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", idOrCode] });
		},
	});
}

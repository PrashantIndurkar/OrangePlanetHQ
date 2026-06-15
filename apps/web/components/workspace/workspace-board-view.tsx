import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useDeleteTaskMutation,
	useUpdateTaskMutation,
} from "../../features/tasks/hooks";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	InProgressIcon,
	TodoIcon,
} from "../icons";
import { TaskCard } from "../tasks/task-card";
import type { TaskPriority, TaskStatus } from "../tasks/task-context-menu";
import type { Task } from "./types";
import { filterAndSortTasks, getNormalizedFilters } from "./types";

interface WorkspaceBoardViewProps {
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	onAddTaskClick?: (status: TaskStatus) => void;
}

export function WorkspaceBoardView({
	tasks,
	setTasks,
	onAddTaskClick,
}: WorkspaceBoardViewProps) {
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let isMouseDown = false;
		let startX = 0;
		let scrollLeftStart = 0;
		let hasDragged = false;

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;

			const target = e.target as HTMLElement;
			if (target.closest("button, input, select, textarea, a")) {
				return;
			}

			isMouseDown = true;
			startX = e.pageX - container.offsetLeft;
			scrollLeftStart = container.scrollLeft;
			hasDragged = false;
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isMouseDown) return;

			const x = e.pageX - container.offsetLeft;
			const walk = (x - startX) * 1.5;
			if (Math.abs(walk) > 3) {
				hasDragged = true;
				container.style.userSelect = "none";
				document.body.style.userSelect = "none";
			}
			container.scrollLeft = scrollLeftStart - walk;
		};

		const handleMouseUpOrLeave = () => {
			isMouseDown = false;
			container.style.userSelect = "";
			document.body.style.userSelect = "";
		};

		const handleClick = (e: MouseEvent) => {
			if (hasDragged) {
				e.preventDefault();
				e.stopPropagation();
				hasDragged = false;
			}
		};

		container.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUpOrLeave);
		container.addEventListener("click", handleClick, true);

		return () => {
			container.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUpOrLeave);
			container.removeEventListener("click", handleClick, true);
		};
	}, []);

	const {
		activeStatuses,
		activePriorities,
		activeDueDates,
		sortBy,
		sortOrder,
	} = getNormalizedFilters(searchParams);
	const searchQuery = searchParams.get("q") || "";

	const processedTasks = filterAndSortTasks(
		tasks,
		activeStatuses,
		activePriorities,
		activeDueDates,
		sortBy,
		sortOrder,
		searchQuery,
	);

	const columns = [
		{
			id: "backlog" as const,
			title: "Backlog",
			icon: <BacklogIcon className="size-4 shrink-0 text-zinc-400" />,
		},
		{
			id: "todo" as const,
			title: "Todo",
			icon: <TodoIcon className="size-4 shrink-0 text-zinc-500" />,
		},
		{
			id: "in-progress" as const,
			title: "In Progress",
			icon: <InProgressIcon className="size-4 shrink-0 text-amber-500" />,
		},
		{
			id: "done" as const,
			title: "Done",
			icon: <DoneIcon className="size-4 shrink-0 text-indigo-500" />,
		},
		{
			id: "canceled" as const,
			title: "Cancel/Delete",
			icon: <CanceledIcon className="size-4 shrink-0 text-zinc-400" />,
		},
	];

	const handleAddTask = (
		status: "backlog" | "todo" | "in-progress" | "done" | "canceled",
	) => {
		if (onAddTaskClick) {
			onAddTaskClick(status);
		} else {
			const newId = `STR-${tasks.length + 50}`;
			const newTask: Task = {
				id: newId,
				title: `New task ${newId}`,
				status,
				priority: "no-priority",
				createdDate: "Created Jun 12",
				// eslint-disable-next-line react-hooks/purity
				createdAt: Date.now(),
			};
			setTasks((prev) => [...prev, newTask]);
		}
	};

	const updateMutation = useUpdateTaskMutation();
	const deleteMutation = useDeleteTaskMutation();

	const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
		updateMutation.mutate({ id: taskId, data: { status: newStatus } });
	};

	const handleUpdatePriority = (taskId: string, newPriority: TaskPriority) => {
		updateMutation.mutate({ id: taskId, data: { priority: newPriority } });
	};

	const handleDeleteTask = (taskId: string) => {
		deleteMutation.mutate(taskId);
	};
	return (
		<div
			ref={containerRef}
			className="flex h-full w-full gap-3 overflow-x-auto bg-[#fcfcfc] px-4 pt-2.5 pb-4 select-none dark:bg-[#1e2024]"
		>
			{columns.map((column) => {
				const columnTasks = processedTasks.filter(
					(t) => t.status === column.id,
				);
				return (
					<div
						key={column.id}
						className="group flex h-full w-[344px] shrink-0 flex-col overflow-hidden rounded-none border border-zinc-200 bg-[#f9f9f9] dark:border-zinc-800 dark:bg-[#1d1d1f]"
					>
						{/* Column Header */}
						<div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/10 p-3">
							<div className="flex items-center gap-1.5">
								<span className="flex size-4 shrink-0 items-center justify-center">
									{column.icon}
								</span>
								<div className="flex items-center gap-1.5">
									<span className="text-sm font-semibold text-foreground">
										{column.title}
									</span>
									<span className="flex h-4 items-center justify-center text-xs font-normal text-zinc-400 dark:text-zinc-500">
										{columnTasks.length}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											render={
												<button
													type="button"
													aria-label="Column actions"
													className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent/10 hover:text-foreground"
												/>
											}
										>
											<svg
												className="h-3.5 w-3.5"
												viewBox="0 0 24 24"
												fill="currentColor"
												role="img"
												aria-label="Actions"
											>
												<title>Actions</title>
												<circle cx="12" cy="12" r="1.5" />
												<circle cx="6" cy="12" r="1.5" />
												<circle cx="18" cy="12" r="1.5" />
											</svg>
										</TooltipTrigger>
										<TooltipContent>Column actions</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											render={
												<button
													type="button"
													onClick={() => handleAddTask(column.id)}
													aria-label="Add task"
													className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-none border border-dotted border-zinc-300 bg-transparent transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent/10 hover:text-foreground dark:border-zinc-800"
												/>
											}
										>
											<svg
												className="h-3.5 w-3.5"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
												role="img"
												aria-label="Add Task"
											>
												<title>Add Task</title>
												<path d="M12 5v14M5 12h14" />
											</svg>
										</TooltipTrigger>
										<TooltipContent>
											Create task in {column.title}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						{/* Column Scrollable Content Area */}
						<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden bg-muted/5 p-3 pb-4">
							{columnTasks.map((task) => (
								<TaskCard
									key={task.id}
									id={task.id}
									title={task.title}
									status={task.status}
									priority={task.priority}
									dueDate={task.dueDate}
									createdDate={task.createdDate}
									assigneeName={task.assigneeName}
									assigneeAvatarUrl={task.assigneeAvatarUrl}
									onUpdateStatus={(newStatus) =>
										handleUpdateStatus(task.id, newStatus)
									}
									onUpdatePriority={(newPriority) =>
										handleUpdatePriority(task.id, newPriority)
									}
									onDeleteTask={() => handleDeleteTask(task.uuid || task.id)}
								/>
							))}

							{/* Add Task Pill at bottom of list */}
							<button
								type="button"
								onClick={() => handleAddTask(column.id)}
								className="mt-1 flex h-[32px] w-full shrink-0 cursor-pointer items-center justify-center rounded-none border border-zinc-200/50 bg-white text-sm font-normal text-muted-foreground/80 opacity-0 transition-all duration-200 outline-none group-hover:opacity-100 hover:bg-zinc-50 hover:text-foreground dark:border-zinc-800/50 dark:bg-[#25272b] dark:hover:bg-zinc-800"
							>
								+
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}

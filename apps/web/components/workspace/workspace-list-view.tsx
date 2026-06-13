"use client";

import { Calendar04Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	HighPriorityIcon,
	InProgressIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	TodoIcon,
	UrgentPriorityIcon,
} from "../icons";
import {
	TaskContextMenu,
	type TaskPriority,
	type TaskStatus,
} from "../tasks/task-context-menu";
import type { Task } from "./types";
import { filterAndSortTasks, getNormalizedFilters } from "./types";

interface WorkspaceListViewProps {
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	onAddTaskClick?: (status: TaskStatus) => void;
}

export function WorkspaceListView({
	tasks,
	setTasks,
	onAddTaskClick,
}: WorkspaceListViewProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

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

	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
		backlog: true,
		todo: false,
		"in-progress": false,
		done: false,
		canceled: false,
	});

	const toggleSection = (status: string) => {
		setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
	};

	const handleToggleTask = (taskId: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
	};

	const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
		);
	};

	const handleUpdatePriority = (taskId: string, newPriority: TaskPriority) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t)),
		);
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
	};

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

	const handleRowClick = (taskId: string, e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (
			target.closest("button") ||
			target.closest(".avatar") ||
			target.closest("[role='menuitem']")
		) {
			return;
		}
		router.push(`/tasks/${taskId}`);
	};

	const statusGroups = [
		{ id: "in-progress" as const, title: "In Progress" },
		{ id: "todo" as const, title: "Todo" },
		{ id: "backlog" as const, title: "Backlog" },
		{ id: "done" as const, title: "Done" },
		{ id: "canceled" as const, title: "Cancel/Delete" },
	];

	const getStatusTheme = (status: string) => {
		switch (status) {
			case "backlog":
				return {
					bg: "bg-zinc-400/[0.04]",
					text: "text-zinc-500",
					iconColor: "text-zinc-400",
					icon: BacklogIcon,
				};
			case "todo":
				return {
					bg: "bg-zinc-500/[0.04]",
					text: "text-zinc-500",
					iconColor: "text-zinc-500",
					icon: TodoIcon,
				};
			case "in-progress":
				return {
					bg: "bg-amber-500/[0.04]",
					text: "text-amber-600 dark:text-amber-400",
					iconColor: "text-amber-500",
					icon: InProgressIcon,
				};
			case "done":
				return {
					bg: "bg-indigo-500/[0.04]",
					text: "text-indigo-600 dark:text-indigo-400",
					iconColor: "text-indigo-500",
					icon: DoneIcon,
				};
			case "canceled":
				return {
					bg: "bg-zinc-500/[0.04]",
					text: "text-zinc-400",
					iconColor: "text-zinc-400",
					icon: CanceledIcon,
				};
			default:
				return {
					bg: "bg-muted/10",
					text: "text-muted-foreground",
					iconColor: "text-muted-foreground",
					icon: TodoIcon,
				};
		}
	};

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "urgent":
				return UrgentPriorityIcon;
			case "high":
				return HighPriorityIcon;
			case "medium":
				return MediumPriorityIcon;
			case "low":
				return LowPriorityIcon;
			default:
				return NoPriorityIcon;
		}
	};

	return (
		<div className="h-full w-full overflow-y-auto bg-background px-4 pt-4 pb-4 select-none">
			<div className="flex w-full flex-col gap-[2px]">
				{statusGroups.map((group) => {
					const groupTasks = processedTasks.filter(
						(t) => t.status === group.id,
					);
					const isCollapsed = collapsed[group.id];
					const theme = getStatusTheme(group.id);

					return (
						<React.Fragment key={group.id}>
							{/* Collapsible Status Group Header (36px / h-9) */}
							<div
								role="button"
								tabIndex={0}
								onClick={() => toggleSection(group.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggleSection(group.id);
									}
								}}
								className={cn(
									"flex h-9 cursor-pointer items-center justify-between rounded-none px-3 transition-colors select-none",
									theme.bg,
								)}
							>
								<div className="flex items-center gap-2">
									{/* Triangle Disclosure Icon Wrapper */}
									<div className="flex w-5 shrink-0 items-center justify-center">
										<svg
											className={cn(
												"size-2.5 fill-current transition-all duration-200",
												isCollapsed
													? "rotate-0 opacity-100"
													: "rotate-90 opacity-30",
												theme.iconColor,
											)}
											viewBox="0 0 24 24"
											role="img"
											aria-label="Disclosure"
										>
											<title>Disclosure</title>
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>

									{/* Status Icon Wrapper */}
									<div className="flex w-6 shrink-0 items-center justify-center">
										<theme.icon
											className={cn("size-4 shrink-0", theme.iconColor)}
										/>
									</div>

									{/* Status name */}
									<span className="text-[13px] font-medium text-foreground">
										{group.title}
									</span>

									{/* Status count */}
									<span className="ml-1.5 text-[14px] font-[450] text-zinc-500 dark:text-zinc-400">
										{groupTasks.length}
									</span>
								</div>

								{/* Add Button */}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleAddTask(group.id);
									}}
									className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-none border border-dashed border-border font-mono text-[10px] text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground"
								>
									+
								</button>
							</div>

							{/* Task rows / Empty State (44px / h-11 each when open) */}
							{!isCollapsed &&
								groupTasks.length > 0 &&
								groupTasks.map((task) => {
									const PriorityComp = getPriorityIcon(task.priority);
									const StatusIcon = theme.icon;

									return (
										<TaskContextMenu
											key={task.id}
											currentStatus={task.status as TaskStatus}
											currentPriority={task.priority as TaskPriority}
											onUpdateStatus={(newStatus) =>
												handleUpdateStatus(task.id, newStatus)
											}
											onUpdatePriority={(newPriority) =>
												handleUpdatePriority(task.id, newPriority)
											}
											onDeleteTask={() => handleDeleteTask(task.id)}
										>
											<div
												role="button"
												onClick={(e) => handleRowClick(task.id, e)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														router.push(`/tasks/${task.id}`);
													}
												}}
												tabIndex={0}
												className="group flex h-9 cursor-pointer items-center justify-between rounded-none border-b border-border/40 bg-transparent px-3 text-xs text-foreground transition-colors last:border-b-0 hover:bg-muted/40 data-[context-menu-open=true]:bg-muted/50 outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
											>
												{/* Left Section: Checkbox, Priority, ID, Status, Title */}
												<div className="flex min-w-0 flex-1 items-center gap-2">
													{/* Checkbox (opacity-0 by default, opacity-100 on hover of the row) */}
													<div className="flex w-5 shrink-0 items-center justify-center">
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																handleToggleTask(task.id);
															}}
															className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-none border border-zinc-300 bg-card text-muted-foreground opacity-0 transition-all duration-150 group-hover:opacity-100 group-data-[context-menu-open=true]:opacity-100 hover:border-zinc-400 hover:text-foreground dark:border-zinc-700 dark:hover:border-zinc-500"
														>
															<svg
																className="h-2.5 w-2.5 opacity-0 transition-opacity hover:opacity-100"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="3"
																role="img"
																aria-label="Action"
															>
																<title>Action</title>
																<path
																	d="M20 6L9 17l-5-5"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
														</button>
													</div>

													{/* Priority Icon Wrapper */}
													<div className="flex w-6 shrink-0 items-center justify-center">
														<PriorityComp className="h-[22px] w-[22px] shrink-0" />
													</div>

													{/* Task Identifier (e.g. STR-40) */}
													<span className="shrink-0 font-mono text-[13px] font-[450] text-zinc-500 select-text dark:text-zinc-400">
														{task.id}
													</span>

													{/* Status Icon */}
													<StatusIcon
														className={cn("size-3.5 shrink-0", theme.iconColor)}
													/>

													{/* Task Title */}
													<span className="truncate text-[13px] font-medium text-zinc-900 select-text dark:text-zinc-100">
														{task.title}
													</span>
												</div>

												{/* Right Section: Due Date Badge, Assignee Avatar & Date Group */}
												<div className="ml-4 flex shrink-0 items-center gap-3">
													{/* Due Date Badge */}
													{task.dueDate && (
														<div className="flex items-center gap-1.5 rounded-[3px] border border-zinc-200 bg-zinc-50/50 px-2 py-0.5 text-[12px] leading-none font-[450] text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-400">
															<HugeiconsIcon
																icon={Calendar04Icon}
																className="h-[14px] w-[14px] shrink-0 text-[#f25f4c]"
															/>
															<span>{task.dueDate}</span>
														</div>
													)}

													{/* Avatar and Date Group */}
													<div className="flex shrink-0 items-center gap-1.5 select-none">
														{task.assigneeAvatarUrl ? (
															<Avatar className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-0 bg-transparent">
																<AvatarImage
																	src={task.assigneeAvatarUrl}
																	alt={task.assigneeName || "Assignee"}
																	className="h-full w-full rounded-full object-cover"
																/>
															</Avatar>
														) : (
															<HugeiconsIcon
																icon={UserCircleIcon}
																className="h-[18px] w-[18px] shrink-0 text-zinc-400 dark:text-zinc-500"
															/>
														)}

														<span className="min-w-[38px] text-right text-[12px] font-[450] text-zinc-500 dark:text-zinc-400">
															{task.createdDate
																? task.createdDate.replace("Created ", "")
																: "Jun 12"}
														</span>
													</div>
												</div>
											</div>
										</TaskContextMenu>
									);
								})}

							{!isCollapsed && groupTasks.length === 0 && (
								<div className="flex h-11 items-center justify-center rounded-none bg-muted/[0.02] text-[10px] text-muted-foreground italic">
									No tasks in this status
								</div>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
}

"use client";

import { Calendar04Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

interface Task {
	id: string;
	title: string;
	status: "backlog" | "todo" | "in-progress" | "done" | "canceled";
	priority: string;
	dueDate?: string;
	createdDate?: string;
	assigneeName?: string;
	assigneeAvatarUrl?: string;
}

export function WorkspaceListView() {
	const [tasks, setTasks] = useState<Task[]>([
		...Array.from({ length: 25 }, (_, i) => ({
			id: `PLO-${25 - i}`,
			title: `Backlog issue placeholder ${i + 1}`,
			status: "backlog" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		})),
		{
			id: "PLO-41",
			title: "Issue title Urgent",
			status: "in-progress" as const,
			priority: "urgent",
			createdDate: "Created Jun 12",
		},
		{
			id: "PLO-35",
			title: "Issue title High",
			status: "in-progress" as const,
			priority: "high",
			createdDate: "Created Jun 12",
		},
		{
			id: "PLO-33",
			title: "Issue title medium",
			status: "in-progress" as const,
			priority: "medium",
			createdDate: "Created Jun 12",
		},
		{
			id: "PLO-36",
			title: "Issue title Low",
			status: "in-progress" as const,
			priority: "low",
			dueDate: "Tomorrow",
			createdDate: "Created Jun 12",
		},
		{
			id: "PLO-40",
			title: "test",
			status: "todo" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
			assigneeName: "Prashant Indurkar",
			assigneeAvatarUrl:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
		},
		{
			id: "PLO-38",
			title: "test",
			status: "done" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		},
		{
			id: "PLO-39",
			title: "test",
			status: "canceled" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		},
	]);

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

	const handleAddTask = (
		status: "backlog" | "todo" | "in-progress" | "done" | "canceled",
	) => {
		const newId = `PLO-${tasks.length + 50}`;
		const newTask: Task = {
			id: newId,
			title: `New task ${newId}`,
			status,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		};
		setTasks((prev) => [...prev, newTask]);
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
		<div className="w-full h-full overflow-y-auto pt-4 px-4 pb-4 select-none bg-background">
			<div className="flex flex-col gap-[2px] w-full">
				{statusGroups.map((group) => {
					const groupTasks = tasks.filter((t) => t.status === group.id);
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
									"flex h-9 items-center justify-between px-3 select-none cursor-pointer rounded-none transition-colors",
									theme.bg,
								)}
							>
								<div className="flex items-center gap-2">
									{/* Triangle Disclosure Icon Wrapper */}
									<div className="w-5 shrink-0 flex items-center justify-center">
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
									<div className="w-6 shrink-0 flex items-center justify-center">
										<theme.icon
											className={cn("size-4 shrink-0", theme.iconColor)}
										/>
									</div>

									{/* Status name */}
									<span className="text-[13px] font-medium text-foreground">
										{group.title}
									</span>

									{/* Status count */}
									<span className="text-[14px] font-[450] text-zinc-500 dark:text-zinc-400 ml-1.5">
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
									className="h-5 w-5 border border-dashed border-border flex items-center justify-center text-muted-foreground text-[10px] font-mono hover:bg-muted hover:text-foreground transition-colors outline-none cursor-pointer rounded-none"
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
										>
											<div
												className="group flex h-9 items-center justify-between text-xs text-foreground px-3 bg-transparent hover:bg-muted/40 transition-colors border-b border-border/40 last:border-b-0 rounded-none cursor-pointer"
											>
												{/* Left Section: Checkbox, Priority, ID, Status, Title */}
												<div className="flex-1 flex items-center gap-2 min-w-0">
													{/* Checkbox (opacity-0 by default, opacity-100 on hover of the row) */}
													<div className="w-5 shrink-0 flex items-center justify-center">
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																handleToggleTask(task.id);
															}}
															className="h-3.5 w-3.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-card rounded-none transition-all duration-150 opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
														>
															<svg
																className="w-2.5 h-2.5 opacity-0 hover:opacity-100 transition-opacity"
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
													<div className="w-6 shrink-0 flex items-center justify-center">
														<PriorityComp className="h-[22px] w-[22px] shrink-0" />
													</div>

													{/* Task Identifier (e.g. PLO-40) */}
													<span className="text-[13px] font-[450] text-zinc-500 dark:text-zinc-400 font-mono shrink-0 select-text">
														{task.id}
													</span>

													{/* Status Icon */}
													<StatusIcon
														className={cn("size-3.5 shrink-0", theme.iconColor)}
													/>

													{/* Task Title */}
													<span className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100 select-text">
														{task.title}
													</span>
												</div>

												{/* Right Section: Due Date Badge, Assignee Avatar & Date Group */}
												<div className="flex items-center gap-3 shrink-0 ml-4">
													{/* Due Date Badge */}
													{task.dueDate && (
														<div className="flex items-center gap-1.5 rounded-[3px] border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 px-2 py-0.5 text-[12px] font-[450] text-zinc-600 dark:text-zinc-400 leading-none">
															<HugeiconsIcon
																icon={Calendar04Icon}
																className="h-[14px] w-[14px] text-[#f25f4c] shrink-0"
															/>
															<span>{task.dueDate}</span>
														</div>
													)}

													{/* Avatar and Date Group */}
													<div className="flex items-center gap-1.5 shrink-0 select-none">
														{task.assigneeAvatarUrl ? (
															<Avatar className="h-[18px] w-[18px] border-0 bg-transparent rounded-full shrink-0 flex items-center justify-center">
																<AvatarImage
																	src={task.assigneeAvatarUrl}
																	alt={task.assigneeName || "Assignee"}
																	className="rounded-full h-full w-full object-cover"
																/>
															</Avatar>
														) : (
															<HugeiconsIcon
																icon={UserCircleIcon}
																className="h-[18px] w-[18px] text-zinc-400 dark:text-zinc-500 shrink-0"
															/>
														)}

														<span className="text-[12px] font-[450] text-zinc-500 dark:text-zinc-400 min-w-[38px] text-right">
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
								<div className="flex h-11 items-center justify-center text-[10px] text-muted-foreground bg-muted/[0.02] rounded-none italic">
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

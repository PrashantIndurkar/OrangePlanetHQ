"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	InProgressIcon,
	InReviewIcon,
	PriorityIcon,
	TodoIcon,
} from "../icons";

interface Task {
	id: string;
	title: string;
	status:
		| "backlog"
		| "todo"
		| "in-progress"
		| "in-review"
		| "done"
		| "canceled";
}

export function WorkspaceListView() {
	const [tasks, setTasks] = useState<Task[]>([
		...Array.from({ length: 28 }, (_, i) => ({
			id: `PLO-${28 - i}`,
			title: `Backlog issue placeholder ${i + 1}`,
			status: "backlog" as const,
		})),
		{ id: "PLO-40", title: "test", status: "todo" as const },
		{ id: "PLO-41", title: "test", status: "in-progress" as const },
		{ id: "PLO-42", title: "test", status: "in-review" as const },
		{ id: "PLO-38", title: "test", status: "done" as const },
	]);

	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
		backlog: true,
		todo: false,
		"in-progress": false,
		"in-review": false,
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
		status:
			| "backlog"
			| "todo"
			| "in-progress"
			| "in-review"
			| "done"
			| "canceled",
	) => {
		const newId = `PLO-${tasks.length + 50}`;
		const newTask: Task = {
			id: newId,
			title: `New task ${newId}`,
			status,
		};
		setTasks((prev) => [...prev, newTask]);
	};

	const statusGroups = [
		{ id: "in-review" as const, title: "In Review" },
		{ id: "in-progress" as const, title: "In Progress" },
		{ id: "todo" as const, title: "Todo" },
		{ id: "backlog" as const, title: "Backlog" },
		{ id: "done" as const, title: "Done" },
		{ id: "canceled" as const, title: "Canceled" },
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
			case "in-review":
				return {
					bg: "bg-emerald-500/[0.04]",
					text: "text-emerald-600 dark:text-emerald-400",
					iconColor: "text-emerald-500",
					icon: InReviewIcon,
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
									{/* Triangle Disclosure Icon: themed color, full opacity when closed, 30% when open */}
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

									{/* Status Icon */}
									<theme.icon
										className={cn("size-4 shrink-0", theme.iconColor)}
									/>

									{/* Status name */}
									<span className="text-xs font-semibold text-foreground">
										{group.title}
									</span>

									{/* Status count */}
									<span className="text-[10px] text-muted-foreground ml-1">
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
								groupTasks.map((task) => (
									<div
										key={task.id}
										className="group flex h-11 items-center text-xs text-foreground px-3 bg-transparent hover:bg-muted/40 transition-colors rounded-none"
									>
										<div className="flex-1 flex items-center gap-3 min-w-0">
											{/* Checkbox (opacity-0 by default, opacity-100 on hover of the row) */}
											<div className="w-5 h-5 flex items-center justify-center shrink-0">
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

											{/* Priority placeholder dashes icon --- */}
											<PriorityIcon className="size-4 text-zinc-400 shrink-0" />

											{/* Task Identifier (e.g. PLO-40) */}
											<span className="text-[11px] font-mono text-zinc-500 shrink-0 select-text font-medium">
												{task.id}
											</span>

											{/* Status Icon */}
											<theme.icon
												className={cn("size-3.5 shrink-0", theme.iconColor)}
											/>

											{/* Task Title */}
											<span className="truncate font-normal text-foreground select-text">
												{task.title}
											</span>
										</div>
									</div>
								))}

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

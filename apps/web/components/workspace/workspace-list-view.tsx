"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	InProgressIcon,
	TodoIcon,
} from "../icons";
import { TaskCard } from "../tasks/task-card";

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
		...Array.from({ length: 28 }, (_, i) => ({
			id: `PLO-${28 - i}`,
			title: `Backlog issue placeholder ${i + 1}`,
			status: "backlog" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		})),
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

	return (
		<div className="w-full h-full overflow-y-auto pt-4 px-4 pb-4 select-none bg-[#fcfcfc] dark:bg-[#1e2024]">
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
									<div key={task.id} className="mb-2 px-3">
										<TaskCard
											id={task.id}
											title={task.title}
											status={task.status}
											priority={task.priority}
											dueDate={task.dueDate}
											createdDate={task.createdDate}
											assigneeName={task.assigneeName}
											assigneeAvatarUrl={task.assigneeAvatarUrl}
										/>
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

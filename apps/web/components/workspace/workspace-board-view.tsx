"use client";

import { useState } from "react";
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

export function WorkspaceBoardView() {
	const [tasks, setTasks] = useState<Task[]>([
		// Backlog issues
		...Array.from({ length: 28 }, (_, i) => ({
			id: `PLO-${28 - i}`,
			title: `Backlog issue placeholder ${i + 1}`,
			status: "backlog" as const,
			priority: "no-priority",
			createdDate: "Created Jun 12",
		})),
		// Todo issue
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
		// In Progress issues
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

	const columns = [
		{
			id: "backlog" as const,
			title: "Backlog",
			icon: <BacklogIcon className="size-4 text-zinc-400 shrink-0" />,
		},
		{
			id: "todo" as const,
			title: "Todo",
			icon: <TodoIcon className="size-4 text-zinc-500 shrink-0" />,
		},
		{
			id: "in-progress" as const,
			title: "In Progress",
			icon: <InProgressIcon className="size-4 text-amber-500 shrink-0" />,
		},
		{
			id: "done" as const,
			title: "Done",
			icon: <DoneIcon className="size-4 text-indigo-500 shrink-0" />,
		},
		{
			id: "canceled" as const,
			title: "Cancel/Delete",
			icon: <CanceledIcon className="size-4 text-zinc-400 shrink-0" />,
		},
	];

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

	return (
		<div className="w-full h-full flex overflow-x-auto gap-3 pt-2.5 px-4 pb-4 select-none bg-[#fcfcfc] dark:bg-[#1e2024]">
			{columns.map((column) => {
				const columnTasks = tasks.filter((t) => t.status === column.id);
				return (
					<div
						key={column.id}
						className="group flex flex-col w-[344px] shrink-0 h-full bg-[#f9f9f9] dark:bg-[#1d1d1f] rounded-none overflow-hidden border border-zinc-200 dark:border-zinc-800"
					>
						{/* Column Header */}
						<div className="flex items-center justify-between p-3 border-b border-border bg-muted/10 shrink-0">
							<div className="flex items-center gap-1.5">
								<span className="flex items-center justify-center size-4 shrink-0">
									{column.icon}
								</span>
								<div className="flex items-center gap-1.5">
									<span className="text-sm font-semibold text-foreground">
										{column.title}
									</span>
									<span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 flex items-center justify-center h-4">
										{columnTasks.length}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
								<button
									type="button"
									className="h-6 w-6 flex items-center justify-center rounded-none hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer outline-none"
									title="Actions"
								>
									<svg
										className="w-3.5 h-3.5"
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
								</button>
								<button
									type="button"
									onClick={() => handleAddTask(column.id)}
									className="h-6 w-6 flex items-center justify-center rounded-none border border-dotted border-zinc-300 dark:border-zinc-800 bg-transparent hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer outline-none"
									title="Add Task"
								>
									<svg
										className="w-3.5 h-3.5"
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
								</button>
							</div>
						</div>

						{/* Column Scrollable Content Area */}
						<div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 min-h-0 bg-muted/5 pb-4">
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
								/>
							))}

							{/* Add Task Pill at bottom of list */}
							<button
								type="button"
								onClick={() => handleAddTask(column.id)}
								className="mt-1 w-full h-[32px] shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#25272b] hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center rounded-none transition-all duration-200 text-muted-foreground/80 hover:text-foreground text-sm cursor-pointer outline-none font-normal opacity-0 group-hover:opacity-100"
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

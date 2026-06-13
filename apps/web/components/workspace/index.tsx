"use client";

import { useEffect, useState } from "react";
import { issuesStore } from "@/lib/issues-store";
import type { TaskStatus } from "../tasks/task-context-menu";
import { IssueCreateDialog } from "./issue-create-dialog";
import type { Task } from "./types";
import { WorkspaceBoardView } from "./workspace-board-view";
import { WorkspaceFilters } from "./workspace-filters";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceListView } from "./workspace-list-view";

export function WorkspaceLayout() {
	const [activeTab, setActiveTab] = useState<string>("tasks");
	const [view, setView] = useState<"board" | "list">("list");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [createDialogDefaultStatus, setCreateDialogDefaultStatus] =
		useState<TaskStatus>("todo");
	const [tasks, setTasksState] = useState<Task[]>(() => issuesStore.getTasks());

	useEffect(() => {
		return issuesStore.subscribe(() => {
			setTasksState(issuesStore.getTasks());
		});
	}, []);

	const setTasks = (
		newTasksOrUpdater: Task[] | React.SetStateAction<Task[]>,
	) => {
		if (typeof newTasksOrUpdater === "function") {
			const current = issuesStore.getTasks();
			const next = (newTasksOrUpdater as (prev: Task[]) => Task[])(current);
			issuesStore.setTasks(next);
		} else {
			issuesStore.setTasks(newTasksOrUpdater);
		}
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			{/* Top Workspace Header */}
			<WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Render dynamic tab content */}
			{activeTab === "tasks" && (
				<>
					{/* Sub-header filters and toggles */}
					<WorkspaceFilters view={view} onViewChange={setView} />

					{/* Workspace Main content scrollable viewport */}
					<main className="relative min-h-0 flex-1 overflow-hidden">
						{view === "board" ? (
							<WorkspaceBoardView
								tasks={tasks}
								setTasks={setTasks}
								onAddTaskClick={(status) => {
									setCreateDialogDefaultStatus(status);
									setIsCreateOpen(true);
								}}
							/>
						) : (
							<WorkspaceListView
								tasks={tasks}
								setTasks={setTasks}
								onAddTaskClick={(status) => {
									setCreateDialogDefaultStatus(status);
									setIsCreateOpen(true);
								}}
							/>
						)}
					</main>
				</>
			)}

			{activeTab === "backlog" && (
				<main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-4">
					<div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/5 p-8">
						{/* Background visual element */}
						<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
						<div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

						{/* Badge */}
						<span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:bg-blue-500/20 dark:text-blue-400">
							✨ Beta Roadmap
						</span>

						<h2 className="max-w-md text-center text-lg font-bold tracking-tight text-foreground">
							Backlog manager is currently in progress
						</h2>
						<p className="mt-2 max-w-md text-center text-xs text-muted-foreground">
							We are designing a lightweight issue inbox and grooming interface
							to plan your milestones and organize unassigned tasks.
						</p>

						{/* Feature list preview cards */}
						<div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									1. Quick Triage
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Instantly capture and categorize tasks without interrupting
									your active workflow.
								</span>
							</div>
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									2. Drag & Drop Plan
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Organize backlogs into sprints and assign them to developers
									with visual ease.
								</span>
							</div>
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									3. Custom Views
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Save custom filters to quickly navigate complex issue backlogs
									and boards.
								</span>
							</div>
						</div>

						{/* Active Status indicator */}
						<div className="mt-8 flex items-center gap-4">
							<div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
								<span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
								<span>Under Active Development (Est. release next week)</span>
							</div>
						</div>
					</div>
				</main>
			)}

			{activeTab === "gantt" && (
				<main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-4">
					<div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/5 p-8">
						{/* Background visual element */}
						<div className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
						<div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

						{/* Badge */}
						<span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-600 uppercase dark:bg-indigo-500/20 dark:text-indigo-400">
							🚀 Beta Roadmap
						</span>

						<h2 className="max-w-md text-center text-lg font-bold tracking-tight text-foreground">
							Interactive Gantt Timeline
						</h2>
						<p className="mt-2 max-w-md text-center text-xs text-muted-foreground">
							Visualize team capacity, track sprint schedules, and manage
							complex cross-functional project timelines in real-time.
						</p>

						{/* Feature list preview cards */}
						<div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									1. Dependencies
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Link blocking issues to automatically adjust child task dates.
								</span>
							</div>
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									2. Team Capacity
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Map schedules and workload limits to balance tasks across
									creators.
								</span>
							</div>
							<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
								<span className="text-xs font-semibold text-foreground">
									3. Real-Time Zoom
								</span>
								<span className="text-[10px] leading-relaxed text-muted-foreground">
									Toggle effortlessly between days, weeks, months, or year
									ranges.
								</span>
							</div>
						</div>

						{/* Active Status indicator */}
						<div className="mt-8 flex items-center gap-4">
							<div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
								<span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
								<span>In Alpha Testing (Sign up for early access)</span>
							</div>
						</div>
					</div>
				</main>
			)}

			<IssueCreateDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				defaultStatus={createDialogDefaultStatus}
				onSubmit={(issue) => {
					const newId = `STR-${tasks.length + 50}`;
					const newTask: Task = {
						id: newId,
						title: issue.title,
						status: issue.status,
						priority: issue.priority,
						createdDate: "Created Jun 12",
						createdAt: Date.now(),
					};
					setTasks((prev) => [...prev, newTask]);
				}}
			/>
		</div>
	);
}

export default WorkspaceLayout;

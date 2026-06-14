"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
	useCreateTaskMutation,
	useTasksQuery,
} from "../../features/tasks/hooks";
import type { TaskPriority, TaskStatus } from "../tasks/task-context-menu";
import { IssueCreateDialog } from "./issue-create-dialog";
import { getNormalizedFilters } from "./types";
import { WorkspaceBoardView } from "./workspace-board-view";
import { WorkspaceFilters } from "./workspace-filters";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceListView } from "./workspace-list-view";

export function WorkspaceLayout() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { user } = useAuth();

	const [activeTab, setActiveTab] = useState<string>("tasks");
	const [view, setView] = useState<"board" | "list">("list");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [createDialogDefaultStatus, setCreateDialogDefaultStatus] =
		useState<TaskStatus>("todo");

	// Pagination settings
	const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
	const limit = 10; // 10 tasks per page for clean pagination

	const {
		activeStatuses,
		activePriorities,
		activeDueDates,
		sortBy,
		sortOrder,
	} = getNormalizedFilters(searchParams);

	const searchQuery = searchParams.get("q") || "";
	const showAllUsers =
		user?.role === "admin" && searchParams.get("allUsers") === "true";

	// Fetch server-side tasks
	const { data, isLoading, isError } = useTasksQuery({
		status: activeStatuses,
		priority: activePriorities,
		dueDate: activeDueDates,
		search: searchQuery,
		sortBy,
		sortOrder,
		page,
		limit,
		allUsers: showAllUsers,
	});

	const createTaskMutation = useCreateTaskMutation();

	const tasks = data?.tasks || [];
	const total = data?.total || 0;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("page", String(newPage));
		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	const handleCreateTaskSubmit = (issue: {
		title: string;
		description: string;
		status: TaskStatus;
		priority: TaskPriority;
		dueDate?: string;
	}) => {
		let isoDueDate: string | null = null;
		if (issue.dueDate) {
			const lower = issue.dueDate.toLowerCase();
			const d = new Date();
			d.setHours(12, 0, 0, 0);
			if (lower === "today") {
				isoDueDate = d.toISOString();
			} else if (lower === "tomorrow") {
				d.setDate(d.getDate() + 1);
				isoDueDate = d.toISOString();
			} else if (lower === "overdue") {
				d.setDate(d.getDate() - 1);
				isoDueDate = d.toISOString();
			} else {
				isoDueDate = new Date(issue.dueDate).toISOString();
			}
		}

		createTaskMutation.mutate({
			title: issue.title,
			description: issue.description,
			status: issue.status,
			priority: issue.priority,
			dueDate: isoDueDate,
		});
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			{/* Top Workspace Header */}
			<WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Render dynamic tab content */}
			{activeTab === "tasks" && (
				<>
					{/* Sub-header filters and toggles */}
					<WorkspaceFilters
						view={view}
						onViewChange={setView}
						showAllUsers={showAllUsers}
						onShowAllUsersChange={
							user?.role === "admin"
								? (show) => {
										const newParams = new URLSearchParams(
											searchParams.toString(),
										);
										if (show) {
											newParams.set("allUsers", "true");
										} else {
											newParams.delete("allUsers");
										}
										router.replace(`${pathname}?${newParams.toString()}`, {
											scroll: false,
										});
									}
								: undefined
						}
					/>

					{/* Workspace Main content scrollable viewport */}
					<main className="relative min-h-0 flex-1 overflow-hidden">
						{isLoading ? (
							<div className="flex flex-col gap-3 p-4">
								{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((key) => (
									<div
										key={key}
										className="flex h-9 w-full items-center justify-between border-b border-border/40 bg-muted/10 px-3"
									>
										<div className="flex items-center gap-3">
											<div className="h-4 w-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
											<div className="h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
											<div className="h-4 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
										</div>
										<div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
									</div>
								))}
							</div>
						) : isError ? (
							<div className="flex h-full w-full items-center justify-center p-4">
								<div className="flex flex-col items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
									<span className="text-sm font-semibold text-red-500">
										Failed to load tasks
									</span>
									<p className="text-xs text-muted-foreground">
										An error occurred while fetching your tasks from the server.
									</p>
									<button
										type="button"
										onClick={() => window.location.reload()}
										className="mt-2 h-7 px-3 border border-border bg-card text-xs font-semibold hover:bg-muted outline-none transition-colors cursor-pointer"
									>
										Retry
									</button>
								</div>
							</div>
						) : view === "board" ? (
							<WorkspaceBoardView
								tasks={tasks}
								setTasks={() => {}}
								onAddTaskClick={(status) => {
									setCreateDialogDefaultStatus(status);
									setIsCreateOpen(true);
								}}
							/>
						) : (
							<WorkspaceListView
								tasks={tasks}
								setTasks={() => {}}
								onAddTaskClick={(status) => {
									setCreateDialogDefaultStatus(status);
									setIsCreateOpen(true);
								}}
							/>
						)}
					</main>

					{/* Pagination Footer */}
					<footer className="flex h-12 shrink-0 items-center justify-between border-t border-border bg-card px-4 text-[12px] select-none">
						<div className="text-muted-foreground font-medium">
							Showing {total > 0 ? (page - 1) * limit + 1 : 0}-
							{Math.min(page * limit, total)} of {total} tasks
						</div>
						<div className="flex items-center gap-4">
							<button
								type="button"
								disabled={page <= 1 || isLoading}
								onClick={() => handlePageChange(page - 1)}
								className="flex h-7 items-center justify-center border border-border px-3 font-semibold text-foreground/80 hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors outline-none cursor-pointer"
							>
								Previous
							</button>
							<span className="text-muted-foreground font-medium">
								Page {page} of {totalPages}
							</span>
							<button
								type="button"
								disabled={page >= totalPages || isLoading}
								onClick={() => handlePageChange(page + 1)}
								className="flex h-7 items-center justify-center border border-border px-3 font-semibold text-foreground/80 hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors outline-none cursor-pointer"
							>
								Next
							</button>
						</div>
					</footer>
				</>
			)}

			{activeTab === "backlog" && (
				<main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-4">
					<div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/5 p-8">
						<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
						<div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

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
						<div className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
						<div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

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
				onSubmit={handleCreateTaskSubmit}
			/>
		</div>
	);
}

export default WorkspaceLayout;

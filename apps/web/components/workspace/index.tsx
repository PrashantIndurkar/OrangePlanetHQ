"use client";

import { useState } from "react";
import { WorkspaceBoardView } from "./workspace-board-view";
import { WorkspaceFilters } from "./workspace-filters";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceListView } from "./workspace-list-view";

export function WorkspaceLayout() {
	const [activeTab, setActiveTab] = useState<string>("tasks");
	const [view, setView] = useState<"board" | "list">("board");

	return (
		<div className="flex flex-col h-full w-full overflow-hidden bg-background">
			{/* Top Workspace Header */}
			<WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Render dynamic tab content */}
			{activeTab === "tasks" && (
				<>
					{/* Sub-header filters and toggles */}
					<WorkspaceFilters view={view} onViewChange={setView} />

					{/* Workspace Main content scrollable viewport */}
					<main className="flex-1 min-h-0 relative overflow-hidden">
						{view === "board" ? <WorkspaceBoardView /> : <WorkspaceListView />}
					</main>
				</>
			)}

			{activeTab === "backlog" && (
				<main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-background">
					<div className="border border-border h-full flex flex-col items-center justify-center p-8 bg-muted/5 relative overflow-hidden rounded-lg">
						{/* Background visual element */}
						<div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

						{/* Badge */}
						<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 mb-4 uppercase">
							✨ Beta Roadmap
						</span>

						<h2 className="text-lg font-bold text-foreground tracking-tight text-center max-w-md">
							Backlog manager is currently in progress
						</h2>
						<p className="text-xs text-muted-foreground mt-2 text-center max-w-md">
							We are designing a lightweight issue inbox and grooming interface
							to plan your milestones and organize unassigned tasks.
						</p>

						{/* Feature list preview cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 w-full max-w-2xl">
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									1. Quick Triage
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Instantly capture and categorize tasks without interrupting
									your active workflow.
								</span>
							</div>
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									2. Drag & Drop Plan
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Organize backlogs into sprints and assign them to developers
									with visual ease.
								</span>
							</div>
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									3. Custom Views
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Save custom filters to quickly navigate complex issue backlogs
									and boards.
								</span>
							</div>
						</div>

						{/* Active Status indicator */}
						<div className="mt-8 flex items-center gap-4">
							<div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 border border-border rounded-full">
								<span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
								<span>Under Active Development (Est. release next week)</span>
							</div>
						</div>
					</div>
				</main>
			)}

			{activeTab === "gantt" && (
				<main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-background">
					<div className="border border-border h-full flex flex-col items-center justify-center p-8 bg-muted/5 relative overflow-hidden rounded-lg">
						{/* Background visual element */}
						<div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
						<div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

						{/* Badge */}
						<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-4 uppercase">
							🚀 Beta Roadmap
						</span>

						<h2 className="text-lg font-bold text-foreground tracking-tight text-center max-w-md">
							Interactive Gantt Timeline
						</h2>
						<p className="text-xs text-muted-foreground mt-2 text-center max-w-md">
							Visualize team capacity, track sprint schedules, and manage
							complex cross-functional project timelines in real-time.
						</p>

						{/* Feature list preview cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 w-full max-w-2xl">
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									1. Dependencies
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Link blocking issues to automatically adjust child task dates.
								</span>
							</div>
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									2. Team Capacity
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Map schedules and workload limits to balance tasks across
									creators.
								</span>
							</div>
							<div className="bg-card border border-border/60 p-3.5 rounded-md flex flex-col gap-1.5">
								<span className="text-xs font-semibold text-foreground">
									3. Real-Time Zoom
								</span>
								<span className="text-[10px] text-muted-foreground leading-relaxed">
									Toggle effortlessly between days, weeks, months, or year
									ranges.
								</span>
							</div>
						</div>

						{/* Active Status indicator */}
						<div className="mt-8 flex items-center gap-4">
							<div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 border border-border rounded-full">
								<span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
								<span>In Alpha Testing (Sign up for early access)</span>
							</div>
						</div>
					</div>
				</main>
			)}
		</div>
	);
}

export default WorkspaceLayout;

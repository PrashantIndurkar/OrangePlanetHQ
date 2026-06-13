"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";

interface WorkspaceHeaderProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function WorkspaceHeader({
	activeTab,
	onTabChange,
}: WorkspaceHeaderProps) {
	const { isOpen, toggle } = useSidebar();

	const tabs = [
		{
			id: "backlog",
			label: "Backlog",
			icon: (
				<svg
					className="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Backlog</title>
					<circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
				</svg>
			),
		},
		{
			id: "tasks",
			label: "Tasks",
			icon: (
				<svg
					className="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Tasks</title>
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			),
		},
		{
			id: "gantt",
			label: "Gantt",
			icon: (
				<svg
					className="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Gantt</title>
					<path d="M3 3v18h18" />
					<path d="M7 6h10" />
					<path d="M9 11h8" />
					<path d="M6 16h6" />
				</svg>
			),
		},
	];

	return (
		<header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-background px-4 select-none">
			{/* Left side: Breadcrumb path & Navigation tabs */}
			<div className="flex items-center gap-4">
				{/* Sidebar Toggle Trigger when collapsed */}
				{!isOpen && (
					<button
						type="button"
						onClick={toggle}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none text-muted-foreground transition-colors outline-none hover:bg-muted/50 hover:text-foreground"
						title="Expand Sidebar"
					>
						<svg
							className="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							role="img"
							aria-label="Expand Sidebar"
						>
							<title>Expand Sidebar</title>
							<rect x="3" y="3" width="18" height="18" rx="2.5" />
							<path d="M9 3v18" />
						</svg>
					</button>
				)}

				{/* Breadcrumb section */}
				<div className="flex items-center gap-1.5 text-xs">
					<div className="flex items-center gap-1.5 font-semibold text-foreground">
						{/* Premium Workspace Dashboard Grid Icon */}
						<svg
							className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Workspace</title>
							<rect x="3" y="3" width="7" height="9" rx="1.5" />
							<rect x="14" y="3" width="7" height="5" rx="1.5" />
							<rect x="14" y="12" width="7" height="9" rx="1.5" />
							<rect x="3" y="16" width="7" height="5" rx="1.5" />
						</svg>
						<span>Workspace</span>
					</div>
				</div>

				{/* Decorative separator line */}
				<div className="hidden h-4 w-px bg-border sm:block" />

				{/* Navigation tabs grouped inside one toggle area with a border but completely boxy (rounded-none) */}
				<nav className="hidden items-center gap-0.5 rounded-none border border-border bg-muted/10 p-0.5 sm:flex">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => onTabChange(tab.id)}
								className={cn(
									"flex cursor-pointer items-center gap-1.5 rounded-none border-none px-2.5 py-1 text-xs transition-colors outline-none",
									isActive
										? "bg-muted font-semibold text-foreground"
										: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
								)}
							>
								{tab.icon}
								<span>{tab.label}</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Right side: empty slot for future action extensions */}
			<div className="flex items-center gap-2" />
		</header>
	);
}

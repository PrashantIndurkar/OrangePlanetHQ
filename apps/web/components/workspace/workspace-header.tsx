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
					className="w-3.5 h-3.5"
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
					className="w-3.5 h-3.5"
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
					className="w-3.5 h-3.5"
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
		<header className="flex h-14 w-full items-center justify-between border-b border-border bg-background px-4 shrink-0 select-none">
			{/* Left side: Breadcrumb path & Navigation tabs */}
			<div className="flex items-center gap-4">
				{/* Sidebar Toggle Trigger when collapsed */}
				{!isOpen && (
					<button
						type="button"
						onClick={toggle}
						className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-none cursor-pointer rounded-none"
						title="Expand Sidebar"
					>
						<svg
							className="w-4 h-4"
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
							className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
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
				<div className="h-4 w-px bg-border hidden sm:block" />

				{/* Navigation tabs grouped inside one toggle area with a border but completely boxy (rounded-none) */}
				<nav className="hidden sm:flex items-center border border-border bg-muted/10 p-0.5 rounded-none gap-0.5">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => onTabChange(tab.id)}
								className={cn(
									"flex items-center gap-1.5 px-2.5 py-1 text-xs transition-colors rounded-none outline-none cursor-pointer border-none",
									isActive
										? "bg-muted text-foreground font-semibold"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/40",
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

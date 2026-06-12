"use client";

import { cn } from "@/lib/utils";

interface WorkspaceFiltersProps {
	view: "board" | "list";
	onViewChange: (view: "board" | "list") => void;
}

export function WorkspaceFilters({
	view,
	onViewChange,
}: WorkspaceFiltersProps) {
	return (
		<div className="flex h-11 w-full items-center justify-between border-b border-border bg-background px-4 shrink-0 select-none">
			{/* Left side: Filter and Sort buttons */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 outline-none cursor-pointer rounded-none font-medium"
				>
					{/* Custom Filter Icon */}
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Filter</title>
						<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
					</svg>
					<span>Filter</span>
				</button>

				<button
					type="button"
					className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 outline-none cursor-pointer rounded-none font-medium"
				>
					{/* Custom Sort Icon */}
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Sort</title>
						<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16" />
					</svg>
					<span>Sort</span>
				</button>
			</div>

			{/* Right side: View Switcher (Board vs List) */}
			<div className="flex items-center border border-border rounded-none overflow-hidden bg-muted/20">
				<button
					type="button"
					onClick={() => onViewChange("board")}
					className={cn(
						"flex items-center gap-1.5 px-2.5 py-1 text-xs transition-all duration-200 outline-none cursor-pointer font-medium border-r border-border",
						view === "board"
							? "bg-card text-foreground font-semibold shadow-sm"
							: "text-muted-foreground hover:bg-muted hover:text-foreground",
					)}
				>
					{/* Board (Kanban Columns) Icon */}
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Board View</title>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<path d="M9 3v18M15 3v18" />
					</svg>
					<span>Board</span>
				</button>

				<button
					type="button"
					onClick={() => onViewChange("list")}
					className={cn(
						"flex items-center gap-1.5 px-2.5 py-1 text-xs transition-all duration-200 outline-none cursor-pointer font-medium",
						view === "list"
							? "bg-card text-foreground font-semibold shadow-sm"
							: "text-muted-foreground hover:bg-muted hover:text-foreground",
					)}
				>
					{/* List View Icon */}
					<svg
						className="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>List View</title>
						<line x1="8" y1="6" x2="21" y2="6" />
						<line x1="8" y1="12" x2="21" y2="12" />
						<line x1="8" y1="18" x2="21" y2="18" />
						<line x1="3" y1="6" x2="3.01" y2="6" />
						<line x1="3" y1="12" x2="3.01" y2="12" />
						<line x1="3" y1="18" x2="3.01" y2="18" />
					</svg>
					<span>List</span>
				</button>
			</div>
		</div>
	);
}

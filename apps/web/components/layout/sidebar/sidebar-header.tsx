"use client";

import {
	ArrowDown01Icon,
	Settings01Icon,
	Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function SidebarHeader() {
	const [isOpen, setIsOpen] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative flex h-14 items-center justify-between border-b border-border px-4 py-3 select-none">
			{/* Workspace Switcher */}
			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="flex cursor-pointer items-center gap-2 rounded-none text-foreground transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ring/50 hover:opacity-90"
				>
					{/* Blue Brand Mark */}
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 shadow-sm shadow-blue-500/10 dark:bg-blue-500">
						<svg
							className="h-3.5 w-3.5 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							role="img"
							aria-label="Brand Logo"
						>
							<title>Brand Logo</title>
							<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
						</svg>
					</div>
					{/* Brand Name Typography */}
					<span className="text-sm font-bold tracking-tight text-blue-600 dark:text-blue-500">
						stride
					</span>
					<HugeiconsIcon
						icon={ArrowDown01Icon}
						size={12}
						className={cn(
							"ml-0.5 text-blue-600/70 transition-transform duration-200 dark:text-blue-500/70",
							isOpen && "rotate-180 transform",
						)}
					/>
				</button>

				{/* Boxy Dropdown */}
				{isOpen && (
					<div className="absolute left-0 z-50 mt-2 w-48 animate-in rounded-none border border-border bg-card shadow-md duration-150 fade-in-50 slide-in-from-top-1">
						<div className="border-b border-border px-3 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
							Workspaces
						</div>
						<div className="py-1">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="flex w-full cursor-pointer items-center justify-between rounded-none bg-muted/30 px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring/50 hover:bg-muted"
							>
								<span>stride</span>
								<HugeiconsIcon
									icon={Tick01Icon}
									size={12}
									className="text-primary"
								/>
							</button>
						</div>
						<div className="border-t border-border" />
						<div className="py-1">
							<button
								type="button"
								onClick={() => {
									setIsOpen(false);
									// In future settings will hook here
									console.log("Settings clicked");
								}}
								className="flex w-full cursor-pointer items-center gap-2 rounded-none px-3 py-2 text-left text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring/50 hover:bg-muted"
							>
								<HugeiconsIcon
									icon={Settings01Icon}
									size={12}
									className="text-muted-foreground"
								/>
								<span>Settings</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Profile Avatar */}
			<div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-muted to-muted-foreground/20 text-[10px] font-medium text-muted-foreground select-none">
					ST
				</div>
			</div>
		</div>
	);
}

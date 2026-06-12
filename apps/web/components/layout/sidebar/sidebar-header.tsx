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
		<div className="relative flex items-center justify-between px-4 py-3 border-b border-border h-14 select-none">
			{/* Workspace Switcher */}
			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity outline-none cursor-pointer"
				>
					{/* Blue Brand Mark */}
					<div className="h-6 w-6 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-sm shadow-blue-500/10">
						<svg
							className="w-3.5 h-3.5 text-white"
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
							"transition-transform text-blue-600/70 dark:text-blue-500/70 duration-200 ml-0.5",
							isOpen && "transform rotate-180",
						)}
					/>
				</button>

				{/* Boxy Dropdown */}
				{isOpen && (
					<div className="absolute left-0 mt-2 w-48 bg-card border border-border shadow-md z-50 rounded-none animate-in fade-in-50 slide-in-from-top-1 duration-150">
						<div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
							Workspaces
						</div>
						<div className="py-1">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="flex w-full items-center justify-between px-3 py-2 text-xs text-foreground bg-muted/30 font-medium hover:bg-muted outline-none cursor-pointer"
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
								className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted outline-none cursor-pointer text-left"
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
			<div className="h-7 w-7 rounded-full bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
				<div className="h-full w-full flex items-center justify-center text-[10px] font-medium text-muted-foreground bg-gradient-to-tr from-muted to-muted-foreground/20 select-none">
					ST
				</div>
			</div>
		</div>
	);
}

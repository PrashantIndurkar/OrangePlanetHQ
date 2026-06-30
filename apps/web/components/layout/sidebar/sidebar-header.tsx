"use client";

import {
	ArrowDown01Icon,
	Logout01Icon,
	Settings01Icon,
	Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

function getInitials(name: string | null | undefined): string {
	if (!name) return "U";
	return name.trim().charAt(0).toUpperCase();
}

export function SidebarHeader({
	sidebarWidth = 280,
}: {
	sidebarWidth?: number;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);
	const { user, logout } = useAuth();

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
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<button
									type="button"
									onClick={() => setIsOpen(!isOpen)}
									className="flex cursor-pointer items-center gap-1.5 rounded-none text-foreground transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ring/50 hover:opacity-90"
								>
									{/* Orange Brand Mark */}
									<img
										src="/brand/icon.png"
										alt="OrangePlanet Logo"
										className="h-6 w-auto object-contain shrink-0"
									/>
									{/* Brand Name Typography */}
									{sidebarWidth >= 270 && (
										<span className="text-[16px] font-bold tracking-tight text-primary">
											OrangePlanet
										</span>
									)}
									<HugeiconsIcon
										icon={ArrowDown01Icon}
										size={12}
										className={cn(
											"ml-0.5 text-primary/70 transition-transform duration-200",
											isOpen && "rotate-180 transform",
										)}
									/>
								</button>
							}
						/>
						<TooltipContent side="right" className="gap-1.5">
							<span>Toggle sidebar</span>
							<kbd data-slot="kbd">[</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

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
								<span>OrangePlanet</span>
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
							<button
								type="button"
								onClick={() => {
									setIsOpen(false);
									logout();
								}}
								className="flex w-full cursor-pointer items-center gap-2 rounded-none px-3 py-2 text-left text-xs text-destructive outline-none focus-visible:ring-1 focus-visible:ring-ring/50 hover:bg-muted"
							>
								<HugeiconsIcon
									icon={Logout01Icon}
									size={12}
									className="text-destructive"
								/>
								<span>Log out</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Profile Avatar */}
			<div
				className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
				title={user?.name || user?.email || "User"}
			>
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-muted to-muted-foreground/20 text-[10px] font-bold text-muted-foreground select-none">
					{getInitials(user?.name || user?.email)}
				</div>
			</div>
		</div>
	);
}

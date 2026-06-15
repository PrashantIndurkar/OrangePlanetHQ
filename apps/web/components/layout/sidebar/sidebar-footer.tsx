"use client";

import * as React from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { version } from "@/package.json";
import { ShortcutsDialog } from "./shortcuts-dialog";

export function SidebarFooter() {
	const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

	return (
		<div className="flex h-12 items-center justify-between border-t border-border bg-sidebar px-4 py-3 select-none">
			<div className="flex items-center gap-2">
				<span className="font-mono text-[10px] font-semibold text-muted-foreground">
					v{version}
				</span>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<button
									type="button"
									onClick={() => setShortcutsOpen(true)}
									className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-none text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring/50 border border-transparent"
								>
									<svg
										className="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Keyboard Shortcuts</title>
										<circle cx="12" cy="12" r="10" />
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
										<line x1="12" y1="17" x2="12.01" y2="17" />
									</svg>
								</button>
							}
						/>
						<TooltipContent className="gap-1.5">
							<span>Keyboard shortcuts</span>
							<kbd data-slot="kbd">?</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
			</div>
			<div className="w-24 shrink-0">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<div>
									<ThemeSwitcher />
								</div>
							}
						/>
						<TooltipContent side="top" className="gap-1.5">
							<span>Cycle theme</span>
							<kbd data-slot="kbd">d</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}

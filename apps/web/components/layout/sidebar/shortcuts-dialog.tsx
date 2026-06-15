"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";

interface ShortcutsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
	React.useEffect(() => {
		const handleOpen = () => onOpenChange(true);
		window.addEventListener("open-shortcuts", handleOpen);
		return () => window.removeEventListener("open-shortcuts", handleOpen);
	}, [onOpenChange]);

	const shortcuts: {
		category: string;
		items: {
			description: string;
			keys: string[];
			winKeys?: string[];
		}[];
	}[] = [
		{
			category: "Navigation & Layout",
			items: [
				{
					description: "Toggle Sidebar",
					keys: ["["],
				},
				{
					description: "Focus Search",
					keys: ["/"],
				},
			],
		},
		{
			category: "Views & Actions",
			items: [
				{
					description: "Create Task",
					keys: ["c"],
				},
				{
					description: "Toggle View (List/Board)",
					keys: ["⌥", "V"],
					winKeys: ["Alt", "V"],
				},
				{
					description: "Open Filters",
					keys: ["⌥", "F"],
					winKeys: ["Alt", "F"],
				},
				{
					description: "Open Sorting",
					keys: ["⌥", "S"],
					winKeys: ["Alt", "S"],
				},
			],
		},
		{
			category: "Preferences",
			items: [
				{
					description: "Cycle Theme (Dark/Light)",
					keys: ["d"],
				},
			],
		},
	];

	const [isMac, setIsMac] = React.useState(true);

	React.useEffect(() => {
		if (typeof window !== "undefined") {
			setIsMac(window.navigator.platform.toUpperCase().indexOf("MAC") >= 0);
		}
	}, []);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[360px] rounded-none border border-border bg-card shadow-2xl p-5 select-none">
				<DialogHeader className="gap-1 border-b border-border/60 pb-3 mb-4">
					<DialogTitle className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
						Keyboard Shortcuts
					</DialogTitle>
					<DialogDescription className="text-[11px] text-muted-foreground">
						Speed up your workflow using hotkeys.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					{shortcuts.map((group) => (
						<div key={group.category} className="flex flex-col gap-2">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								{group.category}
							</span>
							<div className="flex flex-col gap-1.5">
								{group.items.map((item) => {
									const keysToUse = isMac
										? item.keys
										: item.winKeys || item.keys;
									return (
										<div
											key={item.description}
											className="flex items-center justify-between py-0.5"
										>
											<span className="text-xs text-foreground/80 font-medium">
												{item.description}
											</span>
											<div className="flex items-center gap-1">
												{keysToUse.map((k: string, idx: number) => (
													<React.Fragment key={k}>
														{idx > 0 && (
															<span className="text-[10px] text-muted-foreground/60">
																+
															</span>
														)}
														<Kbd className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-none border border-border bg-muted/50 font-sans text-[10px] font-medium text-foreground/90 shadow-sm">
															{k}
														</Kbd>
													</React.Fragment>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

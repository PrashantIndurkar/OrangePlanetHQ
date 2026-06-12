"use client";

import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	InProgressIcon,
	InReviewIcon,
	TodoIcon,
} from "../icons";

export function WorkspaceBoardView() {
	const columns = [
		{
			id: "backlog",
			title: "Backlog",
			count: 28,
			icon: <BacklogIcon className="size-4 text-zinc-400 shrink-0" />,
		},
		{
			id: "todo",
			title: "Todo",
			count: 1,
			icon: <TodoIcon className="size-4 text-zinc-500 shrink-0" />,
		},
		{
			id: "in-progress",
			title: "In Progress",
			count: 1,
			icon: <InProgressIcon className="size-4 text-amber-500 shrink-0" />,
		},
		{
			id: "in-review",
			title: "In Review",
			count: 1,
			icon: <InReviewIcon className="size-4 text-emerald-500 shrink-0" />,
		},
		{
			id: "done",
			title: "Done",
			count: 1,
			icon: <DoneIcon className="size-4 text-indigo-500 shrink-0" />,
		},
		{
			id: "canceled",
			title: "Canceled",
			count: 1,
			icon: <CanceledIcon className="size-4 text-zinc-400 shrink-0" />,
		},
	];

	return (
		<div className="w-full h-full flex overflow-x-auto gap-5 pt-4 px-4 pb-4 select-none bg-background/50">
			{columns.map((column) => (
				<div
					key={column.id}
					className="flex flex-col w-72 shrink-0 h-full border border-border bg-card/40 rounded-none overflow-hidden"
				>
					{/* Column Header */}
					<div className="flex items-center justify-between p-3 border-b border-border bg-muted/10 shrink-0">
						<div className="flex items-center gap-2">
							{column.icon}
							<span className="text-xs font-semibold text-foreground">
								{column.title}
							</span>
							<span className="flex h-5 min-w-5 px-1.5 items-center justify-center text-[10px] font-semibold text-muted-foreground bg-muted border border-border">
								{column.count}
							</span>
						</div>
						{/* Column Header Add Task Action Indicator */}
						<div className="h-5 w-5 border border-dashed border-border flex items-center justify-center text-muted-foreground text-[10px] font-mono cursor-pointer hover:bg-muted transition-colors">
							+
						</div>
					</div>

					{/* Column Scrollable Content Area */}
					<div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-0 bg-muted/5">
						{/* Clean Status Card */}
						<div className="border border-dashed border-border p-3 flex flex-col items-center justify-center bg-card text-center gap-1 min-h-[120px]">
							<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
								{column.title} Content
							</span>
							<span className="text-[10px] text-muted-foreground">
								Drag or create tasks here
							</span>
						</div>

						{/* Interactive Mock Slots to show vertical scrolling behavior */}
						<div className="border border-dashed border-border/60 p-4 flex items-center justify-center bg-card/30 text-[10px] font-mono text-muted-foreground/60 h-24 shrink-0">
							Card Placeholder 1
						</div>
						<div className="border border-dashed border-border/60 p-4 flex items-center justify-center bg-card/30 text-[10px] font-mono text-muted-foreground/60 h-24 shrink-0">
							Card Placeholder 2
						</div>
						<div className="border border-dashed border-border/60 p-4 flex items-center justify-center bg-card/30 text-[10px] font-mono text-muted-foreground/60 h-24 shrink-0">
							Card Placeholder 3
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

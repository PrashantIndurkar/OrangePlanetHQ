import {
	FilterIcon,
	InboxIcon,
	Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function InboxPage() {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			{/* Top Header */}
			<header className="flex h-14 items-center justify-between border-b border-border px-6 select-none shrink-0">
				<div className="flex items-center gap-2">
					<h1 className="text-sm font-semibold text-foreground">Inbox</h1>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						className="flex items-center justify-center rounded-none p-1 text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring hover:text-foreground"
					>
						<HugeiconsIcon icon={FilterIcon} size={14} />
					</button>
					<button
						type="button"
						className="flex items-center justify-center rounded-none p-1 text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring hover:text-foreground"
					>
						<HugeiconsIcon icon={Settings01Icon} size={14} />
					</button>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex flex-1 flex-col items-center justify-center p-8 select-none">
				<div className="flex flex-col items-center justify-center text-center">
					{/* Inbox Icon Container */}
					<div className="mb-4 text-zinc-400 dark:text-zinc-500">
						<HugeiconsIcon icon={InboxIcon} size={48} strokeWidth={1.2} />
					</div>
					<h2 className="text-sm font-semibold text-foreground">
						No notifications
					</h2>
					<p className="mt-1 text-xs text-muted-foreground">
						Need a break?
					</p>
				</div>
			</main>
		</div>
	);
}

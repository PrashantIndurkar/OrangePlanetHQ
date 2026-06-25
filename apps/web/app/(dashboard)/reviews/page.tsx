"use client";

export default function ReviewsPage() {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			{/* Top Header */}
			<header className="flex h-14 items-center border-b border-border px-6 select-none shrink-0">
				<h1 className="text-sm font-semibold text-foreground">Reviews</h1>
			</header>

			{/* Main Content Area */}
			<main className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-6">
				<div className="relative flex min-h-[500px] h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/5 p-8 select-none">
					{/* Background visual element */}
					<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
					<div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

					{/* Cone with rings custom premium SVG */}
					<div className="mb-6 h-20 w-20 relative flex items-center justify-center text-zinc-400 dark:text-zinc-500">
						<svg
							className="h-full w-full"
							viewBox="0 0 100 100"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<title>Review Diffs Graphic</title>
							<ellipse cx="50" cy="70" rx="30" ry="12" strokeDasharray="3 3" />
							<ellipse cx="50" cy="70" rx="24" ry="9.6" strokeDasharray="3 3" />
							<ellipse cx="50" cy="70" rx="18" ry="7.2" strokeDasharray="3 3" />
							<ellipse cx="50" cy="40" rx="12" ry="5.5" />
							<path d="M38 40 L20 70" />
							<path d="M62 40 L80 70" />
							<path d="M20 70 A30 12 0 0 0 80 70" />
						</svg>
					</div>

					{/* Badge */}
					<span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:bg-blue-500/20 dark:text-blue-400">
						🚀 OrangePlanet Labs
					</span>

					<h2 className="max-w-md text-center text-lg font-bold tracking-tight text-foreground">
						Code reviews & pull requests are coming soon
					</h2>
					<p className="mt-2 max-w-md text-center text-xs text-muted-foreground">
						We are building a native code review experience inside OrangePlanet to
						connect your pull requests directly to your issue boards, enabling
						seamless tracking and automatic task updates.
					</p>

					{/* Feature list preview cards */}
					<div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
						<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
							<span className="text-xs font-semibold text-foreground">
								1. Direct PR Linking
							</span>
							<span className="text-[10px] leading-relaxed text-muted-foreground">
								Automatically match GitHub pull requests with OrangePlanet issues
								using branch names or commit messages.
							</span>
						</div>
						<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
							<span className="text-xs font-semibold text-foreground">
								2. Automated Statuses
							</span>
							<span className="text-[10px] leading-relaxed text-muted-foreground">
								Move tasks to &quot;In Review&quot; or &quot;Done&quot; based on
								PR reviews and merge events automatically.
							</span>
						</div>
						<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3.5">
							<span className="text-xs font-semibold text-foreground">
								3. Diff Previews
							</span>
							<span className="text-[10px] leading-relaxed text-muted-foreground">
								Inspect changed files and review progress directly from within
								the OrangePlanet issue details pane.
							</span>
						</div>
					</div>

					{/* Active Status indicator */}
					<div className="mt-8 flex items-center gap-4">
						<div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
							<span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
							<span>Under Active Development (Est. release next week)</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

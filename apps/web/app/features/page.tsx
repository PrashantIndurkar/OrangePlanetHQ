import Link from "next/link";

export default function FeaturesPage() {
	const featureCategories = [
		{
			title: "Speed & Input",
			badge: "Keyboard-First",
			features: [
				{
					title: "Command Palette",
					description:
						"Access everything instantly. Use Cmd+K (or Ctrl+K) to search tasks, toggle themes, switch workspaces, and execute quick commands.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					),
				},
				{
					title: "Quick Task Capture",
					description:
						"Create and log tasks or ideas in seconds. No complex configuration or unnecessary form fields required to keep moving.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					),
				},
			],
		},
		{
			title: "Workspace & Organization",
			badge: "Clean Layout",
			features: [
				{
					title: "Lightweight Task Board",
					description:
						"Simple, highly focused board view showing Todo, In Progress, and Completed statuses. Keep tabs on what needs to be shipped next.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
							/>
						</svg>
					),
				},
				{
					title: "Multi-Workspace Contexts",
					description:
						"Keep separate contexts for work client projects, open-source ventures, and weekend side projects. Switch workspace instantly.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					),
				},
			],
		},
		{
			title: "Integrations & Customization",
			badge: "Connected",
			features: [
				{
					title: "GitHub Auto-Sync",
					description:
						"Link branches, commits, and PR events automatically by including the task ID (e.g. OPH-12) in branch names or commit messages.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
					),
				},
				{
					title: "Public Roadmap Sharing",
					description:
						"Engage users and stakeholders by showing features currently Planned, In Progress, or Completed in a public board.",
					icon: (
						<svg
							className="h-5 w-5 text-[#5e6ad2]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
							/>
						</svg>
					),
				},
			],
		},
	];

	return (
		<div className="relative flex min-h-screen flex-col bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 select-none font-sans">
			{/* Architectural Grid Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
					style={{
						backgroundImage: `
							linear-gradient(to right, #5e6ad2 1px, transparent 1px),
							linear-gradient(to bottom, #5e6ad2 1px, transparent 1px)
						`,
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute top-[54px] left-0 right-0 h-[1px] bg-zinc-200/60 dark:bg-zinc-800/40" />
			</div>

			{/* Top Navigation */}
			<nav className="relative z-20 flex h-[54px] w-full items-center justify-between px-6 lg:px-[8%] border-b border-zinc-200/40 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2 outline-none">
						<div className="flex h-6 w-6 items-center justify-center border-2 border-[#5e6ad2] bg-[#5e6ad2]/5">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<title>Logo Icon</title>
								<path
									d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
									stroke="#5e6ad2"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-zinc-100">
							OrangePlanet
						</span>
					</Link>
					<span className="text-zinc-300 dark:text-zinc-700">/</span>
					<span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">
						Features
					</span>
				</div>

				<div className="flex items-center gap-4">
					<Link
						href="/tasks"
						className="flex h-7 items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
					>
						Go to App
					</Link>
				</div>
			</nav>

			{/* Main Layout */}
			<main className="relative z-10 flex flex-1 flex-col items-center px-6 pt-16 pb-24 lg:px-[8%]">
				{/* Page Header */}
				<div className="w-full max-w-6xl text-center mb-16">
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
						Features designed for momentum
					</h1>
					<p className="mt-4 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
						Plan, track, and ship projects without the overhead. OrangePlanet
						gives solo developers and agile teams a clean space to capture
						features and issues.
					</p>
				</div>

				{/* Columns Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
					{featureCategories.map((category) => (
						<div key={category.title} className="flex flex-col gap-4">
							{/* Column Title */}
							<div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/40 pb-2">
								<h3 className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
									{category.title}
								</h3>
								<span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#5e6ad2]/10 text-[#5e6ad2] font-semibold">
									{category.badge}
								</span>
							</div>

							{/* Column Cards */}
							<div className="flex flex-col gap-4">
								{category.features.map((feature) => (
									<div
										key={feature.title}
										className="group relative border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 rounded-none"
									>
										{/* Accent indicator */}
										<div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#5e6ad2]" />

										<div className="flex items-start gap-3.5">
											<div className="shrink-0 mt-0.5">{feature.icon}</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#5e6ad2] transition-colors leading-tight">
													{feature.title}
												</h4>
												<p className="mt-2 text-[11px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
													{feature.description}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Roadmap Banner Card */}
				<div className="w-full max-w-6xl mt-16 p-6 border border-[#5e6ad2]/20 bg-[#5e6ad2]/5 dark:bg-[#5e6ad2]/5 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="text-center md:text-left">
						<h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
							Looking for what we are building next?
						</h3>
						<p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-light">
							We maintain a live, community-visible product roadmap containing
							our future direction.
						</p>
					</div>
					<Link
						href="/roadmap"
						className="flex h-9 px-6 items-center justify-center bg-[#5e6ad2] text-white text-xs font-semibold hover:bg-[#5e6ad2]/90 transition-all shrink-0"
					>
						Check out our Roadmap ↗
					</Link>
				</div>
			</main>
		</div>
	);
}

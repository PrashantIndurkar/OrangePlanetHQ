import Link from "next/link";

const CheckIcon = () => (
	<svg
		className="h-3.5 w-3.5 shrink-0 text-[#5e6ad2]"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth="3"
		aria-hidden="true"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
	</svg>
);

const CrossIcon = () => (
	<svg
		className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-700"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth="3"
		aria-hidden="true"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
);

export default function PricingPage() {
	const hobbyFeatures = [
		{ text: "Up to 3 workspaces", enabled: true },
		{ text: "Up to 3 members", enabled: true },
		{ text: "Roadmap", enabled: true },
		{ text: "Bug Tracker", enabled: true },
		{ text: "Basic Github Integration", enabled: true },
		{ text: "Auto Sync Tasks Github Integration", enabled: false },
		{ text: "Priority Support", enabled: false },
	];

	const proFeatures = [
		{ text: "Unlimited Workspaces", enabled: true },
		{ text: "Unlimited Members", enabled: true },
		{ text: "Roadmap", enabled: true },
		{ text: "Bug Tracker", enabled: true },
		{ text: "Advanced Github Integration", enabled: true },
		{ text: "Auto Sync Tasks Github Integration", enabled: true },
		{ text: "Priority Support", enabled: true },
	];

	const enterpriseFeatures = [
		{ text: "Unlimited Workspaces", enabled: true },
		{ text: "Unlimited Members", enabled: true },
		{ text: "Role-Based Access Control (RBAC)", enabled: true },
		{ text: "Workspace & Project Permissions", enabled: true },
		{ text: "Audit Logs", enabled: true },
		{ text: "Compliance-Ready Data Handling", enabled: true },
		{ text: "Advanced Feature & Issue Tracking", enabled: true },
		{ text: "Advanced GitHub Integration", enabled: true },
		{ text: "Automatic Task Sync with GitHub", enabled: true },
		{ text: "Priority Support", enabled: true },
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
						Pricing
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
						Simple pricing that grows with your project
					</h1>
					<p className="mt-4 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
						Start free, upgrade when you&apos;re ready. No credit card required,
						cancel anytime.
					</p>
				</div>

				{/* Pricing Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
					{/* Hobby Plan */}
					<div className="group relative border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 rounded-none">
						<div className="absolute top-0 left-0 bottom-0 w-[3px] bg-zinc-300 dark:bg-zinc-700" />
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
									Hobby
								</h3>
							</div>

							<div className="flex items-baseline gap-1 mb-4">
								<span className="text-3xl font-extrabold text-zinc-950 dark:text-white">
									$0
								</span>
								<span className="text-xs text-zinc-400 dark:text-zinc-500 font-light">
									/ seat / month
								</span>
							</div>

							<p className="text-xs font-light text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed min-h-[48px]">
								Just getting started? The Hobby plan lets you plan, track, and
								ship your first project with zero risk and zero cost
							</p>

							<Link
								href="/signup"
								className="flex h-9 w-full items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all text-center mb-8"
							>
								Get Started For Free
							</Link>

							{/* Features list */}
							<div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
								<ul className="space-y-3">
									{hobbyFeatures.map((feat) => (
										<li
											key={feat.text}
											className="flex items-start gap-2.5 text-[11px]"
										>
											{feat.enabled ? <CheckIcon /> : <CrossIcon />}
											<span
												className={`${feat.enabled ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-600 line-through"}`}
											>
												{feat.text}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Pro Plan */}
					<div className="group relative border-2 border-[#5e6ad2] bg-white dark:bg-zinc-900/50 p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(94,106,210,0.06)] transition-all duration-200 rounded-none">
						<div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#5e6ad2]" />
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
									Pro
								</h3>
								<span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#5e6ad2] text-white">
									Popular
								</span>
							</div>

							<div className="flex items-baseline gap-1 mb-4">
								<span className="text-3xl font-extrabold text-zinc-950 dark:text-white">
									$10
								</span>
								<span className="text-xs text-zinc-400 dark:text-zinc-500 font-light">
									/ seat / month
								</span>
							</div>

							<p className="text-xs font-light text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed min-h-[48px]">
								When your project picks up momentum. Stay organized, move
								faster, and keep features and issues in sync as you ship.
							</p>

							<Link
								href="/signup"
								className="flex h-9 w-full items-center justify-center bg-[#5e6ad2] text-white text-xs font-semibold hover:bg-[#5e6ad2]/90 transition-all text-center mb-8"
							>
								Get Started For Free
							</Link>

							{/* Features list */}
							<div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
								<ul className="space-y-3">
									{proFeatures.map((feat) => (
										<li
											key={feat.text}
											className="flex items-start gap-2.5 text-[11px]"
										>
											{feat.enabled ? <CheckIcon /> : <CrossIcon />}
											<span className="text-zinc-700 dark:text-zinc-300">
												{feat.text}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Enterprise Plan */}
					<div className="group relative border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 rounded-none">
						<div className="absolute top-0 left-0 bottom-0 w-[3px] bg-zinc-300 dark:bg-zinc-700" />
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
									Enterprise
								</h3>
							</div>

							<div className="flex items-baseline gap-1 mb-4">
								<span className="text-2xl font-extrabold text-zinc-950 dark:text-white">
									Contact Us
								</span>
							</div>

							<p className="text-xs font-light text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed min-h-[48px]">
								For teams that need advanced security, access control, and
								compliance. Built for organizations running critical projects at
								scale.
							</p>

							<Link
								href="/signup"
								className="flex h-9 w-full items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all text-center mb-8"
							>
								Get Started For Free
							</Link>

							{/* Features list */}
							<div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
								<ul className="space-y-3">
									{enterpriseFeatures.map((feat) => (
										<li
											key={feat.text}
											className="flex items-start gap-2.5 text-[11px]"
										>
											{feat.enabled ? <CheckIcon /> : <CrossIcon />}
											<span className="text-zinc-700 dark:text-zinc-300">
												{feat.text}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Features Banner */}
				<div className="w-full max-w-6xl mt-20 border-t border-zinc-200/60 dark:border-zinc-800/40 pt-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
						{/* Feature 1 */}
						<div className="flex flex-col gap-2.5 p-4 border border-zinc-200/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/20">
							<div className="flex items-center gap-2">
								<svg
									className="h-4 w-4 text-[#5e6ad2]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
									aria-hidden="true"
								>
									<title>Lightning Bolt Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								<h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
									From idea to launch, fully yours.
								</h4>
							</div>
							<p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-light">
								Run your projects with a system built for tracking features and
								bugs at every stage.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="flex flex-col gap-2.5 p-4 border border-zinc-200/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/20">
							<div className="flex items-center gap-2">
								<svg
									className="h-4 w-4 text-[#5e6ad2]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
									aria-hidden="true"
								>
									<title>Users Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								<h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
									Grows with you
								</h4>
							</div>
							<p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-light">
								Start small, scale effortlessly as your projects and teams
								expand.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="flex flex-col gap-2.5 p-4 border border-zinc-200/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/20">
							<div className="flex items-center gap-2">
								<svg
									className="h-4 w-4 text-[#5e6ad2]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
									aria-hidden="true"
								>
									<title>Shield Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
								<h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
									Full ownership
								</h4>
							</div>
							<p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-light">
								Your data, your decisions, your workflow — all under your
								control.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

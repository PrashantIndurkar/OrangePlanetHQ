import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getRoadmapData } from "@/lib/roadmap";

export const revalidate = 0; // Disable caching so edits to roadmap.md are immediately visible

export default function RoadmapPage() {
	const data = getRoadmapData();

	// Read raw markdown content for the "Raw Markdown View" feature
	const filePath = path.join(process.cwd(), "content/roadmap.md");
	const rawMarkdown = fs.readFileSync(filePath, "utf-8");

	const statusColors: {
		[key: string]: { border: string; bg: string; text: string; dot: string };
	} = {
		"In Progress": {
			border: "border-indigo-200 dark:border-indigo-900/30",
			bg: "bg-indigo-50/50 dark:bg-indigo-950/10",
			text: "text-indigo-600 dark:text-indigo-400",
			dot: "bg-indigo-500",
		},
		Planned: {
			border: "border-amber-200 dark:border-amber-900/30",
			bg: "bg-amber-50/50 dark:bg-amber-950/10",
			text: "text-amber-600 dark:text-amber-400",
			dot: "bg-amber-500",
		},
		Completed: {
			border: "border-emerald-200 dark:border-emerald-900/30",
			bg: "bg-emerald-50/50 dark:bg-emerald-950/10",
			text: "text-emerald-600 dark:text-emerald-400",
			dot: "bg-emerald-500",
		},
	};

	const priorityColors: { [key: string]: string } = {
		High: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-100 dark:border-red-950/30",
		Medium:
			"bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
		Low: "bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800",
	};

	return (
		<div className="relative flex min-h-screen flex-col bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 select-none">
			{/* Architectural Grid Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
					style={{
						backgroundImage: `
							linear-gradient(to right, #FF591E 1px, transparent 1px),
							linear-gradient(to bottom, #FF591E 1px, transparent 1px)
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
						<div className="flex h-6 w-6 items-center justify-center border-2 border-[#FF591E] bg-[#FF591E]/5">
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
									stroke="#FF591E"
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
						Roadmap
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
			<main className="relative z-10 flex flex-1 flex-col items-center px-6 pt-12 pb-24 lg:px-[8%]">
				{/* Page Header */}
				<div className="w-full max-w-6xl text-center md:text-left mb-12">
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
						{data.title}
					</h1>
					<p className="mt-4 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-2xl">
						{data.description}
					</p>
				</div>

				{/* Columns Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
					{Object.entries(data.categories).map(([status, items]) => {
						const colors = statusColors[status] || statusColors.Planned;

						return (
							<div key={status} className="flex flex-col gap-4">
								{/* Column Title */}
								<div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/40 pb-2">
									<div className="flex items-center gap-2">
										<span className={`h-2 w-2 rounded-full ${colors.dot}`} />
										<span className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
											{status}
										</span>
									</div>
									<span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
										{items.length}
									</span>
								</div>

								{/* Column Cards */}
								<div className="flex flex-col gap-3">
									{items.length === 0 ? (
										<div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-8 rounded text-center text-xs text-zinc-400">
											No items in this stage
										</div>
									) : (
										items.map((item) => (
											<div
												key={item.title}
												className="group relative border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200"
											>
												{/* Accent indicator */}
												<div
													className={`absolute top-0 left-0 bottom-0 w-[3px] ${colors.dot}`}
												/>

												<div className="flex items-start gap-2.5">
													<span
														className="text-lg shrink-0 mt-0.5"
														role="img"
														aria-label="Icon"
													>
														{item.icon}
													</span>
													<div className="flex-1 min-w-0">
														<h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF591E] transition-colors leading-tight">
															{item.title}
														</h3>
														<p className="mt-2 text-[11px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400 whitespace-pre-line">
															{item.description}
														</p>

														{/* Badges */}
														<div className="mt-4 flex items-center gap-1.5 flex-wrap">
															<span
																className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-none uppercase font-bold tracking-wider ${priorityColors[item.priority] || priorityColors.Medium}`}
															>
																{item.priority}
															</span>
														</div>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Raw Markdown Accordion */}
				<div className="w-full max-w-6xl mt-16 border-t border-zinc-200/60 dark:border-zinc-800/40 pt-8">
					<details className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4">
						<summary className="flex cursor-pointer items-center justify-between text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 outline-none select-none">
							<span>📄 View Raw Markdown Source File (roadmap.md)</span>
							<span className="transition-transform group-open:rotate-180">
								▼
							</span>
						</summary>
						<div className="mt-4 overflow-x-auto border-t border-zinc-100 dark:border-zinc-800/60 pt-4 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-96 overflow-y-auto">
							<pre className="whitespace-pre-wrap">{rawMarkdown}</pre>
						</div>
					</details>
				</div>
			</main>
		</div>
	);
}

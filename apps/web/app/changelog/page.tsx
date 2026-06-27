import Link from "next/link";
import { getChangelogData, getRawMarkdown } from "@/lib/changelog";

export const revalidate = 0; // Disable caching so updates to CHANGELOG.md are immediately visible

export default function ChangelogPage() {
	const releases = getChangelogData();
	const rawMarkdown = getRawMarkdown();

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
						Changelog
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
				<div className="w-full max-w-4xl text-center md:text-left mb-16">
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
						Changelog
					</h1>
					<p className="mt-4 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl">
						Keep up to date with the latest features, bug fixes, and
						improvements shipped to OrangePlanet.
					</p>
				</div>

				{/* Timeline layout */}
				<div className="relative w-full max-w-4xl border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-0 md:border-l-0">
					{releases.map((release) => (
						<div
							key={release.version}
							className="relative md:grid md:grid-cols-4 md:gap-8 mb-16 last:mb-0 pl-6 md:pl-0"
						>
							{/* Left Column (Timeline marker, Version & Date) */}
							<div className="md:col-span-1 md:text-right relative pb-4 md:pb-0 md:pr-6">
								{/* Visual bullet indicator */}
								<div className="absolute top-1 -left-[31px] md:left-auto md:-right-[9px] h-4 w-4 rounded-full border-2 border-[#FF591E] bg-white dark:bg-zinc-950 z-10 flex items-center justify-center">
									<div className="h-1.5 w-1.5 rounded-full bg-[#FF591E]" />
								</div>

								{/* Version details */}
								<div className="flex flex-row md:flex-col items-baseline md:items-end gap-2 md:gap-1">
									<span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 md:px-0 md:py-0 md:bg-transparent">
										v{release.version}
									</span>
									<span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
										{release.date}
									</span>
								</div>

								{/* Compare Link */}
								{release.compareUrl && (
									<a
										href={release.compareUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block mt-2 text-[9px] font-mono text-zinc-400 hover:text-[#FF591E] transition-colors"
									>
										view diff ↗
									</a>
								)}
							</div>

							{/* Right Column (Release notes card) */}
							<div className="md:col-span-3 border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200">
								{/* Markdown HTML Render container */}
								<div
									className="changelog-prose text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering parsed markdown HTML safe content
									dangerouslySetInnerHTML={{ __html: release.contentHtml }}
								/>
							</div>
						</div>
					))}
				</div>

				{/* Raw Markdown Accordion */}
				{rawMarkdown && (
					<div className="w-full max-w-4xl mt-16 border-t border-zinc-200/60 dark:border-zinc-800/40 pt-8">
						<details className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4">
							<summary className="flex cursor-pointer items-center justify-between text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 outline-none select-none">
								<span>📄 View Raw CHANGELOG.md Source File</span>
								<span className="transition-transform group-open:rotate-180">
									▼
								</span>
							</summary>
							<div className="mt-4 overflow-x-auto border-t border-zinc-100 dark:border-zinc-800/60 pt-4 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-96 overflow-y-auto">
								<pre className="whitespace-pre-wrap">{rawMarkdown}</pre>
							</div>
						</details>
					</div>
				)}
			</main>
		</div>
	);
}

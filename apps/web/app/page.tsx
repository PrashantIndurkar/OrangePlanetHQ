"use client";

import {
	ArrowRight02Icon,
	ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: cosmetic mouse-movement visual glow effect */}
			<div
				onMouseMove={handleMouseMove}
				className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#fafafa] font-sans antialiased text-zinc-900 select-none"
			>
				{/* Architectural Grid Background (Light Mode) */}
				<div className="absolute inset-0 pointer-events-none">
					{/* Layered grid pattern using thin lines */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage: `
							linear-gradient(to right, #5e6ad2 1px, transparent 1px),
							linear-gradient(to bottom, #5e6ad2 1px, transparent 1px)
						`,
							backgroundSize: "40px 40px",
						}}
					/>
					<div
						className="absolute inset-0 opacity-[0.06]"
						style={{
							backgroundImage: `
							linear-gradient(to right, #5e6ad2 1px, transparent 1px),
							linear-gradient(to bottom, #5e6ad2 1px, transparent 1px)
						`,
							backgroundSize: "200px 200px",
						}}
					/>
					{/* Dynamic cursor spotlight glow */}
					<div
						className="absolute inset-0 transition-opacity duration-300"
						style={{
							background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(94, 106, 210, 0.05), transparent 80%)`,
						}}
					/>
					{/* Structural layout blueprints lines */}
					<div className="absolute top-[54px] left-0 right-0 h-[1px] bg-zinc-200/60" />
					<div className="absolute top-[450px] left-0 right-0 h-[1px] bg-zinc-200/40" />
					<div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-zinc-200/40 hidden lg:block" />
					<div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-zinc-200/40 hidden lg:block" />
				</div>

				{/* Minimalist Navigation Header (Height: 54px) */}
				<nav className="relative z-20 flex h-[54px] w-full items-center justify-between px-6 lg:px-[8%] border-b border-zinc-200/40 bg-white/70 backdrop-blur-md">
					{/* Left Logo */}
					<div className="flex items-center gap-2">
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
						<span className="font-semibold text-xs tracking-tight text-zinc-900">
							OrangePlanet
						</span>
					</div>

					{/* Center Navigation items */}
					<div className="hidden md:flex items-center gap-8 text-[11px] font-medium text-zinc-500">
						<Link
							href="/features"
							className="cursor-pointer hover:text-zinc-900 transition-colors"
						>
							Features
						</Link>

						<Link
							href="/pricing"
							className="cursor-pointer hover:text-zinc-900 transition-colors"
						>
							Pricing
						</Link>

						<Link
							href="/roadmap"
							className="cursor-pointer hover:text-zinc-900 transition-colors"
						>
							Roadmap
						</Link>
						<Link
							href="/changelog"
							className="cursor-pointer hover:text-zinc-900 transition-colors"
						>
							Changelog
						</Link>
					</div>

					{/* Right CTA */}
					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="flex h-7 items-center justify-center border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
						>
							Get Started
						</Link>
					</div>
				</nav>

				{/* Main Content Area */}
				<main className="relative z-10 flex flex-1 flex-col items-center px-6 pt-16 lg:px-[8%]">
					{/* Hero Badge - Boxy style with double-border and checkbox */}
					<div className="p-[2px] border border-[#5e6ad2] bg-[#5e6ad2]/5 mb-6 select-none rounded-none animate-in fade-in zoom-in-95 duration-500">
						<div className="border border-[#5e6ad2]/20 bg-[#5e6ad2]/10 px-3 py-1 flex items-center gap-2.5 rounded-none">
							<div className="flex h-4 w-4 shrink-0 items-center justify-center bg-white border border-[#5e6ad2] text-[#5e6ad2] text-[10px] font-bold rounded-none">
								✓
							</div>
							<span className="text-xs font-semibold text-[#5e6ad2] tracking-tight">
								No bloat. On purpose.
							</span>
						</div>
					</div>

					{/* Hero Title */}
					<h2
						style={{ maxWidth: "800px" }}
						className="text-center font-bold tracking-tight text-zinc-900 
						text-3xl leading-[44px] 
						sm:text-4xl sm:leading-[56px] 
						md:text-5xl md:leading-[64px] 
						lg:text-[60px] lg:leading-[72px]"
					>
						The workspace for fast moving side projects
					</h2>

					{/* Description */}
					<p
						style={{ maxWidth: "640px" }}
						className="mt-6 text-center text-sm md:text-base font-light leading-relaxed text-zinc-500"
					>
						Plan, track, and ship projects without the overhead of enterprise
						software. OrangePlanet gives solo engineers and small teams a focused
						workspace designed for momentum, not management.
					</p>

					{/* Hero CTA Buttons */}
					<div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
						<Link
							href="/signup"
							className="flex h-10 w-full sm:w-48 items-center justify-center gap-2 bg-[#5e6ad2] text-white text-xs font-semibold hover:bg-[#5e6ad2]/95 transition-all text-center"
						>
							<span>Get Started for Free</span>
							<HugeiconsIcon
								icon={ArrowRight02Icon}
								size={14}
								className="shrink-0 animate-in slide-in-from-left-1 duration-300"
							/>
						</Link>
						<Link
							href="/demo"
							target="_blank"
							rel="noopener noreferrer"
							className="flex h-10 w-full sm:w-48 items-center justify-center gap-2 border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all text-center"
						>
							<span>Live Demo</span>
							<HugeiconsIcon
								icon={ArrowUpRight01Icon}
								size={14}
								className="shrink-0"
							/>
						</Link>
					</div>

					{/* Key Value Checklist */}
					<div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] font-mono text-zinc-400">
						<span>✓ Keyboard first</span>
						<span>✓ Lightweight</span>
						<span>✓ No setup required</span>
					</div>

					{/* Geometric marker lines for Hero section */}
					<div className="w-full max-w-[960px] flex items-center justify-between mt-16 px-4">
						<span className="text-[#5e6ad2]/20 font-mono text-[9px]">
							+ GRID-INTERSECT-01
						</span>
						<div className="h-[1px] flex-1 bg-zinc-200/50 mx-4" />
						<span className="text-[#5e6ad2]/20 font-mono text-[9px]">
							+ PREVIEW-ANCHOR
						</span>
					</div>

					{/* Hero Preview Area Container */}
					<div className="relative w-full max-w-[960px] mt-4 mb-24 rounded-lg border border-zinc-200 bg-white p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
						{/* Outer layout coordinates */}
						<div className="absolute -top-3 left-4 text-[9px] font-mono text-zinc-400">
							W: 960px H: auto
						</div>
						<div className="absolute -bottom-5 right-4 text-[9px] font-mono text-zinc-400">
							ORANGEPLANET_V0.8
						</div>

						{/* Blueprint aspect-video placeholder containing HTML styled mock */}
						<div className="relative overflow-hidden border border-zinc-100 bg-[#fafafa] rounded-md aspect-video w-full flex flex-col text-left">
							{/* Mock App Header */}
							<div className="flex h-8 items-center justify-between border-b border-zinc-200/60 bg-white px-3 text-[10px] text-zinc-500 font-mono select-none">
								<div className="flex items-center gap-2">
									<div className="flex gap-1">
										<div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
										<div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
										<div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
									</div>
									<div className="h-3 w-[1px] bg-zinc-200" />
									<span>OPH-12 / Complete Authentication Setup</span>
								</div>
								<div className="flex items-center gap-3">
									<span>v0.8.0</span>
									<div className="h-2 w-2 rounded-full bg-emerald-500" />
								</div>
							</div>

							{/* Mock App Body */}
							<div className="flex flex-1 min-h-0">
								{/* Mock Sidebar blueprint */}
								<div className="w-40 border-r border-zinc-200/60 bg-white p-3 hidden md:flex flex-col gap-4 text-[10px] font-medium text-zinc-400">
									<div className="flex flex-col gap-2">
										<div className="h-4 w-12 rounded bg-zinc-100" />
										<div className="h-4 w-20 rounded bg-zinc-100/60" />
									</div>
									<div className="flex flex-col gap-2">
										<div className="h-1.5 w-16 bg-zinc-100 rounded" />
										<div className="h-1.5 w-10 bg-zinc-100 rounded" />
										<div className="h-1.5 w-12 bg-zinc-100 rounded" />
									</div>
								</div>

								{/* Mock Task Board Area */}
								<div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
									<div className="flex items-center justify-between">
										<div className="h-4 w-24 bg-zinc-200/50 rounded" />
										<div className="flex gap-1.5">
											<div className="h-4 w-12 border border-zinc-200 rounded bg-white" />
											<div className="h-4 w-16 bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 rounded text-[9px] text-[#5e6ad2] flex items-center justify-center font-semibold">
												+ Add Task
											</div>
										</div>
									</div>

									{/* Mock Columns */}
									<div className="grid grid-cols-3 gap-3 flex-1 overflow-hidden">
										{/* Todo Column */}
										<div className="border border-dashed border-zinc-200 p-2.5 flex flex-col gap-2 rounded bg-white/40">
											<div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 tracking-wider uppercase">
												<span>Todo</span>
												<span className="px-1 bg-zinc-100 text-zinc-500">
													3
												</span>
											</div>
											<div className="border border-zinc-200/80 bg-white p-2.5 flex flex-col gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
												<div className="h-2 w-2/3 bg-zinc-200 rounded" />
												<div className="h-1.5 w-full bg-zinc-100 rounded" />
												<div className="flex justify-between items-center mt-1">
													<div className="h-3 w-8 bg-zinc-100 rounded" />
													<div className="h-3 w-3 bg-[#5e6ad2]/10 rounded" />
												</div>
											</div>
											<div className="border border-zinc-200/80 bg-white p-2.5 flex flex-col gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
												<div className="h-2 w-1/2 bg-zinc-200 rounded" />
												<div className="h-1.5 w-full bg-zinc-100 rounded" />
											</div>
										</div>

										{/* In Progress Column */}
										<div className="border border-dashed border-zinc-200 p-2.5 flex flex-col gap-2 rounded bg-white/40">
											<div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 tracking-wider uppercase">
												<span>In Progress</span>
												<span className="px-1 bg-zinc-100 text-zinc-500">
													1
												</span>
											</div>
											<div className="border border-[#5e6ad2]/20 bg-white p-2.5 flex flex-col gap-2 shadow-[0_2px_8px_rgba(94,106,210,0.03)] relative">
												<div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
												<div className="h-2 w-5/6 bg-[#5e6ad2]/20 rounded" />
												<div className="h-1.5 w-full bg-zinc-100 rounded" />
												<div className="flex justify-between items-center mt-1">
													<div className="h-3.5 w-12 border border-[#5e6ad2]/10 bg-[#5e6ad2]/5 text-[8px] text-[#5e6ad2] flex items-center justify-center font-bold">
														Active
													</div>
													<div className="h-3 w-3 bg-zinc-200 rounded-full" />
												</div>
											</div>
										</div>

										{/* Done Column */}
										<div className="border border-dashed border-zinc-200 p-2.5 flex flex-col gap-2 rounded bg-white/40">
											<div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 tracking-wider uppercase">
												<span>Done</span>
												<span className="px-1 bg-zinc-100 text-zinc-500">
													8
												</span>
											</div>
											<div className="border border-zinc-200/80 bg-white p-2.5 flex flex-col gap-2 opacity-60">
												<div className="h-2 w-3/4 bg-zinc-200 rounded line-through" />
												<div className="h-1.5 w-full bg-zinc-100 rounded" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

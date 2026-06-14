"use client";

import Link from "next/link";
import { useState } from "react";

export default function DemoPage() {
	const [copiedField, setCopiedField] = useState<string | null>(null);

	const handleCopy = (field: string, value: string) => {
		navigator.clipboard.writeText(value);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 1500);
	};

	const credentials = {
		email: "test@example.com",
		password: "password123",
	};

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] font-sans antialiased text-zinc-900 select-none">
			{/* Architectural Grid Background (Light Mode) */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Layered grid pattern using thin lines */}
				<div
					className="absolute inset-0 opacity-[0.04]"
					style={{
						backgroundImage: `
							linear-gradient(to right, #5e6ad2 1px, transparent 1px),
							linear-gradient(to bottom, #5e6ad2 1px, transparent 1px)
						`,
						backgroundSize: "40px 40px",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage: `
							linear-gradient(to right, #5e6ad2 1px, transparent 1px),
							linear-gradient(to bottom, #5e6ad2 1px, transparent 1px)
						`,
						backgroundSize: "200px 200px",
					}}
				/>
				{/* Soft light blueprint gradient */}
				<div
					className="absolute inset-0 opacity-[0.4]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 50% 50%, rgba(94, 106, 210, 0.04) 0%, transparent 70%)",
					}}
				/>
				{/* Structural border coordinate lines */}
				<div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#5e6ad2]/10" />
				<div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#5e6ad2]/10" />
			</div>

			{/* Center Card */}
			<div className="relative z-10 w-full max-w-[420px] px-6">
				{/* Corner Alignment Markers for Blueprint Feel */}
				<div className="absolute -top-3 -left-3 text-[#5e6ad2]/30 font-mono text-[10px] pointer-events-none select-none">
					+ STR-L1
				</div>
				<div className="absolute -top-3 -right-3 text-[#5e6ad2]/30 font-mono text-[10px] pointer-events-none select-none">
					+ STR-R1
				</div>
				<div className="absolute -bottom-3 -left-3 text-[#5e6ad2]/30 font-mono text-[10px] pointer-events-none select-none">
					+ STR-L2
				</div>
				<div className="absolute -bottom-3 -right-3 text-[#5e6ad2]/30 font-mono text-[10px] pointer-events-none select-none">
					+ STR-R2
				</div>

				<div className="bg-white border border-zinc-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative">
					{/* Logo header */}
					<div className="flex flex-col items-center text-center mb-8">
						<div className="flex h-10 w-10 items-center justify-center border-2 border-[#5e6ad2] bg-[#5e6ad2]/5 mb-3">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
									stroke="#5e6ad2"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h1 className="text-xl font-medium tracking-tight text-zinc-900">
							Stride Demo Access
						</h1>
						<p className="text-xs text-zinc-500 mt-1.5 max-w-[280px]">
							Copy these credentials to explore the interactive task manager
							workspace.
						</p>
					</div>

					{/* Credentials Fields */}
					<div className="space-y-4 mb-8">
						{/* Email */}
						<div className="flex flex-col gap-1.5">
							<span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
								Email Address
							</span>
							<div className="flex h-10 w-full items-center justify-between border border-zinc-200 bg-zinc-50/50 px-3 py-1 font-mono text-xs select-all text-zinc-700">
								<span>{credentials.email}</span>
								<button
									type="button"
									onClick={() => handleCopy("email", credentials.email)}
									className="text-[#5e6ad2] hover:text-[#5e6ad2]/80 transition-colors p-1 cursor-pointer"
									title="Copy email address"
								>
									{copiedField === "email" ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="2.5"
											stroke="currentColor"
											className="w-3.5 h-3.5 animate-in zoom-in-50"
										>
											<title>Copied</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											className="w-3.5 h-3.5"
										>
											<title>Copy</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Password */}
						<div className="flex flex-col gap-1.5">
							<span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
								Password
							</span>
							<div className="flex h-10 w-full items-center justify-between border border-zinc-200 bg-zinc-50/50 px-3 py-1 font-mono text-xs select-all text-zinc-700">
								<span>{credentials.password}</span>
								<button
									type="button"
									onClick={() => handleCopy("password", credentials.password)}
									className="text-[#5e6ad2] hover:text-[#5e6ad2]/80 transition-colors p-1 cursor-pointer"
									title="Copy password"
								>
									{copiedField === "password" ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="2.5"
											stroke="currentColor"
											className="w-3.5 h-3.5 animate-in zoom-in-50"
										>
											<title>Copied</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											className="w-3.5 h-3.5"
										>
											<title>Copy</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-2">
						<Link
							href="/login"
							className="flex h-10 w-full items-center justify-center bg-[#5e6ad2] text-white text-xs font-semibold hover:bg-[#5e6ad2]/95 transition-all text-center select-none"
						>
							Go to Login Page
						</Link>
						<button
							type="button"
							onClick={() => window.close()}
							className="flex h-9 w-full items-center justify-center border border-zinc-200 text-zinc-500 text-[11px] font-medium hover:bg-zinc-50 transition-all cursor-pointer text-center select-none"
						>
							Close Tab
						</button>
					</div>
				</div>

				{/* Copy Banner Notification */}
				{copiedField && (
					<div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-semibold px-3 py-1.5 shadow-md border border-zinc-800 animate-in fade-in slide-in-from-bottom-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="3"
							stroke="currentColor"
							className="w-3 h-3 text-emerald-400"
						>
							<title>Success</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 12.75l6 6 9-13.5"
							/>
						</svg>
						<span>
							Copied {copiedField === "email" ? "Email" : "Password"} to
							clipboard!
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

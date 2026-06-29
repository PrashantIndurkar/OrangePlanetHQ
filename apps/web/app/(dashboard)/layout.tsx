"use client";

import { useTheme } from "next-themes";
import type React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";

function DashboardContent({ children }: { children: React.ReactNode }) {
	const { toggle } = useSidebar();
	const { theme, setTheme } = useTheme();

	useHotkeys(
		"[, bracketleft",
		(e) => {
			e.preventDefault();
			toggle();
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[toggle],
	);

	useHotkeys(
		"d",
		(e) => {
			e.preventDefault();
			const themeCycle: Record<string, string> = {
				system: "dark",
				dark: "light",
				light: "system",
			};
			setTheme(themeCycle[theme || "system"] || "system");
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[theme, setTheme],
	);

	useHotkeys(
		"?, shift+/",
		(e) => {
			e.preventDefault();
			window.dispatchEvent(new CustomEvent("open-shortcuts"));
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[],
	);

	return (
		<div className="flex min-h-screen bg-background">
			{/* Sidebar Layout */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
				{/* Inner Page Content */}
				<main className="relative min-h-0 w-full flex-1 overflow-hidden">
					{children}
				</main>
			</div>
		</div>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardContent>{children}</DashboardContent>
		</SidebarProvider>
	);
}

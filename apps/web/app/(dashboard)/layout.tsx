"use client";

import type React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Sidebar } from "@/components/layout/sidebar";
import { useRealtime } from "@/hooks/use-realtime";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";

function DashboardContent({ children }: { children: React.ReactNode }) {
	const { toggle } = useSidebar();

	// Start listening to real-time events via Server-Sent Events (SSE)
	useRealtime();

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

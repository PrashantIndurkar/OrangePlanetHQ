"use client";

import type React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";

function DashboardContent({ children }: { children: React.ReactNode }) {
	const { toggle } = useSidebar();

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
			<div className="relative flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
				{/* Inner Page Content */}
				<main className="flex-1 w-full min-h-0 relative overflow-hidden">
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

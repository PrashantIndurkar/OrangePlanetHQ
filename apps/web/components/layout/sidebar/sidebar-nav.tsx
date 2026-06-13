"use client";

import {
	CenterFocusIcon,
	GitPullRequestIcon,
	InboxIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

interface NavItem {
	id: string;
	name: string;
	href: string;
	icon: IconSvgElement;
	isDummy?: boolean;
}

export function SidebarNav() {
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{
			id: "inbox",
			name: "Inbox",
			href: "/inbox",
			icon: InboxIcon,
		},
		{
			id: "my-issues",
			name: "My issues",
			href: "/",
			icon: CenterFocusIcon,
		},
		{
			id: "reviews",
			name: "Reviews",
			href: "/reviews",
			icon: GitPullRequestIcon,
		},
	];

	return (
		<div className="flex flex-1 flex-col gap-4 px-3 py-4 select-none">
			{/* Global Navigation Links */}
			<div className="flex flex-col gap-0.5">
				{navItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href === "/" &&
							(pathname === "/" ||
								pathname.startsWith("/tasks") ||
								(/^\/[a-zA-Z0-9_-]+$/.test(pathname) &&
									pathname !== "/" &&
									!pathname.startsWith("/inbox") &&
									!pathname.startsWith("/reviews"))));

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex w-full items-center gap-2 rounded-none px-2.5 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
								isActive
									? "bg-muted text-foreground font-medium"
									: "text-foreground/70 hover:bg-muted/40 hover:text-foreground"
							)}
						>
							<HugeiconsIcon icon={item.icon} size={14} className="shrink-0" />
							<span>{item.name}</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}


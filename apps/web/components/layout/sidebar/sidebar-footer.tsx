"use client";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { version } from "@/package.json";

export function SidebarFooter() {
	return (
		<div className="flex items-center justify-between px-4 py-3 border-t border-border bg-sidebar h-12 select-none">
			<span className="text-[10px] font-mono text-muted-foreground font-semibold">
				v{version}
			</span>
			<div className="w-24 shrink-0">
				<ThemeSwitcher />
			</div>
		</div>
	);
}

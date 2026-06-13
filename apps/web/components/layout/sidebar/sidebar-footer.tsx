"use client";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { version } from "@/package.json";

export function SidebarFooter() {
	return (
		<div className="flex h-12 items-center justify-between border-t border-border bg-sidebar px-4 py-3 select-none">
			<span className="font-mono text-[10px] font-semibold text-muted-foreground">
				v{version}
			</span>
			<div className="w-24 shrink-0">
				<ThemeSwitcher />
			</div>
		</div>
	);
}

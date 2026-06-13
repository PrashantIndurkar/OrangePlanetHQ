"use client";

import {
	ComputerIcon,
	Moon01Icon,
	Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Ensure theme is mounted to avoid hydration mismatch
	React.useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div
				className={cn(
					"flex h-7 w-full items-center justify-between rounded-none border border-border bg-muted/20",
					className,
				)}
			/>
		);
	}

	const activeTheme = theme || "system";

	const options = [
		{ id: "system", label: "System", icon: ComputerIcon },
		{ id: "dark", label: "Dark", icon: Moon01Icon },
		{ id: "light", label: "Light", icon: Sun01Icon },
	];

	return (
		<div
			className={cn(
				"relative flex h-7 w-full rounded-none border border-border bg-muted/10 p-0.5 select-none",
				className,
			)}
		>
			{/* Sliding active background indicator */}
			<div
				className="absolute top-0.5 bottom-0.5 left-0.5 border border-border/20 bg-muted transition-transform duration-200 ease-out"
				style={{
					width: "calc(33.333% - 1.33px)",
					transform: `translateX(${
						activeTheme === "system"
							? "0%"
							: activeTheme === "dark"
								? "100%"
								: "200%"
					})`,
				}}
			/>

			{options.map((opt) => {
				const Icon = opt.icon;
				const isActive = activeTheme === opt.id;
				return (
					<button
						key={opt.id}
						type="button"
						onClick={() => setTheme(opt.id)}
						className={cn(
							"relative z-10 flex h-full flex-1 cursor-pointer items-center justify-center text-[10px] font-medium transition-colors outline-none",
							isActive
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
						title={`${opt.label} Mode`}
					>
						<HugeiconsIcon icon={Icon} size={14} className="shrink-0" />
					</button>
				);
			})}
		</div>
	);
}

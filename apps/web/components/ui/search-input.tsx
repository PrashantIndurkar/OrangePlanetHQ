"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import * as React from "react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface SearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	icon?: IconSvgElement | null;
	showShortcut?: boolean;
	shortcutKey?: string;
	size?: "default" | "sm" | "lg";
	containerClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			className,
			icon: Icon = Search01Icon,
			showShortcut = true,
			shortcutKey = "/",
			size = "default",
			containerClassName,
			type = "text",
			...props
		},
		ref,
	) => {
		const localRef = React.useRef<HTMLInputElement>(null);
		React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

		React.useEffect(() => {
			if (!showShortcut) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (
					e.key === shortcutKey &&
					document.activeElement?.tagName !== "INPUT" &&
					document.activeElement?.tagName !== "TEXTAREA" &&
					!(document.activeElement as HTMLElement)?.isContentEditable
				) {
					e.preventDefault();
					localRef.current?.focus();
				}
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}, [showShortcut, shortcutKey]);

		const sizeClasses = {
			sm: "h-8 text-xs px-2.5 gap-1.5",
			default: "h-9 text-xs px-3 gap-2",
			lg: "h-11 text-sm px-4 gap-2.5",
		};

		const iconSizes = {
			sm: 14,
			default: 16,
			lg: 18,
		};

		return (
			<div
				className={cn(
					"relative flex items-center border border-input bg-muted/10 text-foreground transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/40 rounded-none w-full",
					sizeClasses[size],
					containerClassName,
				)}
			>
				{Icon && (
					<HugeiconsIcon
						icon={Icon}
						size={iconSizes[size]}
						className="text-muted-foreground shrink-0"
					/>
				)}
				<input
					type={type}
					ref={localRef}
					className={cn(
						"flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground w-full border-none focus:ring-0 focus:outline-none text-xs",
						className,
					)}
					{...props}
				/>
				{showShortcut && (
					<Kbd className="shrink-0 font-sans font-normal border-none bg-muted/60 text-muted-foreground/80 px-1.5 py-0.5 text-[9px] h-4 min-w-4 flex items-center justify-center">
						{shortcutKey}
					</Kbd>
				)}
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";

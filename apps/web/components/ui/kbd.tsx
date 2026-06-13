import * as React from "react";
import { cn } from "@/lib/utils";

export type KbdProps = React.ComponentPropsWithoutRef<"kbd">;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
	({ className, ...props }, ref) => {
		return (
			<kbd
				ref={ref}
				className={cn(
					"pointer-events-none inline-flex h-5 items-center gap-1 rounded-none border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground uppercase opacity-100 select-none",
					className,
				)}
				{...props}
			/>
		);
	},
);
Kbd.displayName = "Kbd";

export { Kbd };

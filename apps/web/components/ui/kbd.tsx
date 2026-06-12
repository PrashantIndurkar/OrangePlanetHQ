import * as React from "react";
import { cn } from "@/lib/utils";

export type KbdProps = React.ComponentPropsWithoutRef<"kbd">;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
	({ className, ...props }, ref) => {
		return (
			<kbd
				ref={ref}
				className={cn(
					"pointer-events-none inline-flex h-5 select-none items-center gap-1 border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 uppercase select-none rounded-none",
					className,
				)}
				{...props}
			/>
		);
	},
);
Kbd.displayName = "Kbd";

export { Kbd };

import React from "react";
import { cn } from "@/lib/utils";

interface AuthCheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export const AuthCheckbox = React.forwardRef<
	HTMLInputElement,
	AuthCheckboxProps
>(({ label, className, ...props }, ref) => {
	return (
		<label className="group flex cursor-pointer items-center gap-2 select-none">
			<input
				type="checkbox"
				ref={ref}
				className={cn(
					"flex size-4 cursor-pointer appearance-none items-center justify-center rounded-none border border-input bg-muted/30 transition-all outline-none",
					"checked:border-primary checked:bg-primary checked:after:text-[10px] checked:after:font-bold checked:after:text-primary-foreground checked:after:content-['✓']",
					"focus-visible:ring-1 focus-visible:ring-ring/40",
					className,
				)}
				{...props}
			/>
			<span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
				{label}
			</span>
		</label>
	);
});

AuthCheckbox.displayName = "AuthCheckbox";

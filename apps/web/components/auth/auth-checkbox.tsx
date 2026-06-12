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
		<label className="flex items-center gap-2 cursor-pointer select-none group">
			<input
				type="checkbox"
				ref={ref}
				className={cn(
					"appearance-none size-4 border border-input rounded-none bg-muted/30 outline-none transition-all flex items-center justify-center cursor-pointer",
					"checked:bg-primary checked:border-primary checked:after:content-['✓'] checked:after:text-primary-foreground checked:after:text-[10px] checked:after:font-bold",
					"focus-visible:ring-1 focus-visible:ring-ring/40",
					className,
				)}
				{...props}
			/>
			<span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
				{label}
			</span>
		</label>
	);
});

AuthCheckbox.displayName = "AuthCheckbox";

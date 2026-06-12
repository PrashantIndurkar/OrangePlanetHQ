import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
	({ label, error, className, type = "text", ...props }, ref) => {
		const generatedId = useId();
		const id = props.id || generatedId;

		return (
			<div className="w-full flex flex-col items-start">
				<label
					htmlFor={id}
					className="text-sm font-medium text-foreground mb-1.5 select-none"
				>
					{label}
				</label>
				<input
					id={id}
					type={type}
					ref={ref}
					className={cn(
						"w-full h-10 px-3 text-xs bg-muted/30 border border-input rounded-none outline-none transition-colors",
						"focus:border-ring focus:ring-1 focus:ring-ring/40",
						error &&
							"border-destructive focus:border-destructive focus:ring-destructive/30",
						className,
					)}
					{...props}
				/>
				{error && (
					<span className="text-[11px] text-destructive mt-1 font-medium select-none animate-in fade-in-50 duration-200">
						{error}
					</span>
				)}
			</div>
		);
	},
);

AuthInput.displayName = "AuthInput";

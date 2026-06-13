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
			<div className="flex w-full flex-col items-start">
				<label
					htmlFor={id}
					className="mb-1.5 text-sm font-medium text-foreground select-none"
				>
					{label}
				</label>
				<input
					id={id}
					type={type}
					ref={ref}
					className={cn(
						"h-10 w-full rounded-none border border-input bg-muted/30 px-3 text-xs transition-colors outline-none",
						"focus:border-ring focus:ring-1 focus:ring-ring/40",
						error &&
							"border-destructive focus:border-destructive focus:ring-destructive/30",
						className,
					)}
					{...props}
				/>
				{error && (
					<span className="mt-1 animate-in text-[11px] font-medium text-destructive duration-200 fade-in-50 select-none">
						{error}
					</span>
				)}
			</div>
		);
	},
);

AuthInput.displayName = "AuthInput";

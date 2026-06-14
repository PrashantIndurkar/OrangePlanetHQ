import React, { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
	({ label, error, className, type = "text", ...props }, ref) => {
		const generatedId = useId();
		const id = props.id || generatedId;
		const [showPassword, setShowPassword] = useState(false);

		const isPasswordField = type === "password";
		const inputType = isPasswordField && showPassword ? "text" : type;

		return (
			<div className="flex w-full flex-col items-start">
				<label
					htmlFor={id}
					className="mb-1.5 text-sm font-medium text-foreground select-none"
				>
					{label}
				</label>
				<div className="relative w-full">
					<input
						id={id}
						type={inputType}
						ref={ref}
						className={cn(
							"h-10 w-full rounded-none border border-input bg-muted/30 px-3 text-xs transition-colors outline-none",
							"focus:border-ring focus:ring-1 focus:ring-ring/40",
							isPasswordField && "pr-10",
							error &&
								"border-destructive focus:border-destructive focus:ring-destructive/30",
							className,
						)}
						{...props}
					/>
					{isPasswordField && (
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground hover:text-foreground outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-ring/40"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							<HugeiconsIcon
								icon={showPassword ? ViewOffSlashIcon : ViewIcon}
								size={16}
							/>
						</button>
					)}
				</div>
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


import type React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.ComponentProps<"div"> {
	children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
	return (
		<div
			className={cn(
				"flex w-full max-w-[446px] flex-col gap-6 rounded-none border border-border bg-card px-6 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

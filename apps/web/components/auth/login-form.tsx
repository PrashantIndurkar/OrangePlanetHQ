"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/hooks";
import { createResolver, loginSchema } from "@/features/auth/schema";
import type { LoginInput } from "@/features/auth/types";
import { AuthCheckbox } from "./auth-checkbox";
import { AuthInput } from "./auth-input";

export function LoginForm() {
	const { handleLogin, isLoading, error: apiError } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: createResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginInput) => {
		await handleLogin(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-4"
		>
			{apiError && (
				<div className="animate-in border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive duration-200 fade-in-50 select-none">
					{apiError}
				</div>
			)}

			<AuthInput
				label="Email"
				type="email"
				placeholder="name@example.com"
				error={errors.email?.message}
				disabled={isLoading}
				{...register("email")}
			/>

			<AuthInput
				label="Password"
				type="password"
				placeholder="••••••••"
				error={errors.password?.message}
				disabled={isLoading}
				{...register("password")}
			/>

			<div className="flex items-center justify-between py-1">
				<AuthCheckbox
					label="Remember me"
					disabled={isLoading}
					{...register("rememberMe")}
				/>
			</div>

			<Button
				type="submit"
				disabled={isLoading}
				className="mt-2 h-10 w-full cursor-pointer rounded-none bg-primary text-xs font-bold text-primary-foreground uppercase hover:bg-primary/95"
			>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<svg
							className="h-3.5 w-3.5 animate-spin text-primary-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							role="img"
							aria-label="Loading"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<span>Logging in...</span>
					</span>
				) : (
					"Log in"
				)}
			</Button>

			{/* Center-aligned links underneath the button with good space */}
			<div className="mt-4 flex flex-col items-center gap-2 text-xs select-none">
				<span className="text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="font-semibold text-primary transition-colors hover:underline"
					>
						Register
					</Link>
				</span>
			</div>
		</form>
	);
}

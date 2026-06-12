"use client";

import Link from "next/link";
import React from "react";
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
			className="flex flex-col gap-4 w-full"
		>
			{apiError && (
				<div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 select-none animate-in fade-in-50 duration-200">
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
				className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase rounded-none cursor-pointer mt-2"
			>
				{isLoading ? "Logging in..." : "Log in"}
			</Button>

			{/* Center-aligned links underneath the button with good space */}
			<div className="flex flex-col items-center gap-2 mt-4 text-xs select-none">
				<span className="text-muted-foreground">
					Don't have an account?{" "}
					<Link
						href="/signup"
						className="text-primary font-semibold hover:underline transition-colors"
					>
						Register
					</Link>
				</span>
			</div>
		</form>
	);
}

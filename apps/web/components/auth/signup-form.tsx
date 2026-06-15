"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useSignup } from "@/features/auth/hooks";
import { createResolver, signupSchema } from "@/features/auth/schema";
import type { SignupInput } from "@/features/auth/types";
import { AuthInput } from "./auth-input";

export function SignupForm() {
	const { handleSignup, isLoading, error: apiError } = useSignup();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupInput>({
		resolver: createResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignupInput) => {
		await handleSignup(data);
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
				label="Name"
				placeholder="Your Name"
				error={errors.name?.message}
				disabled={isLoading}
				{...register("name")}
			/>

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

			<AuthInput
				label="Confirm Password"
				type="password"
				placeholder="••••••••"
				error={errors.confirmPassword?.message}
				disabled={isLoading}
				{...register("confirmPassword")}
			/>

			<Button
				type="submit"
				disabled={isLoading}
				className="mt-2 h-10 w-full cursor-pointer rounded-none bg-primary text-xs font-bold text-primary-foreground uppercase hover:bg-primary/95"
			>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<HugeiconsIcon
							icon={Loading03Icon}
							strokeWidth={2}
							className="h-3.5 w-3.5 animate-spin"
						/>
						<span>Registering...</span>
					</span>
				) : (
					"Register"
				)}
			</Button>

			{/* Center-aligned links underneath the button with good space */}
			<div className="mt-4 flex flex-col items-center gap-2 text-xs select-none">
				<span className="text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-semibold text-primary transition-colors hover:underline"
					>
						Log in
					</Link>
				</span>
			</div>
		</form>
	);
}

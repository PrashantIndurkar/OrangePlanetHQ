"use client";

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
			className="flex flex-col gap-4 w-full"
		>
			{apiError && (
				<div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 select-none animate-in fade-in-50 duration-200">
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
				className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase rounded-none cursor-pointer mt-2"
			>
				{isLoading ? "Registering..." : "Register"}
			</Button>

			{/* Center-aligned links underneath the button with good space */}
			<div className="flex flex-col items-center gap-2 mt-4 text-xs select-none">
				<span className="text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary font-semibold hover:underline transition-colors"
					>
						Log in
					</Link>
				</span>
			</div>
		</form>
	);
}

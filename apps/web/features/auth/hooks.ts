"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import type { LoginInput, SignupInput } from "./types";

export function useLogin() {
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (data: LoginInput) => {
		setIsLoading(true);
		setError(null);

		const toastId = toast.loading("Authenticating credentials...", {
			position: "top-center",
		});

		const timeouts: NodeJS.Timeout[] = [];

		// Queue up step-by-step progress updates
		timeouts.push(
			setTimeout(() => {
				toast.loading("Loading user profile...", { id: toastId });
			}, 1200),
		);
		timeouts.push(
			setTimeout(() => {
				toast.loading("Preparing your workspace...", { id: toastId });
			}, 2400),
		);

		try {
			await login(data);
			// Clear timeouts before updating the final toast state
			for (const t of timeouts) clearTimeout(t);
			toast.success("Welcome back!", { id: toastId });
			return true;
		} catch (err: unknown) {
			for (const t of timeouts) clearTimeout(t);
			toast.error("Failed to log in", { id: toastId });
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong during login",
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleLogin,
		isLoading,
		error,
	};
}

export function useSignup() {
	const { signup } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSignup = async (data: SignupInput) => {
		setIsLoading(true);
		setError(null);

		const toastId = toast.loading("Preparing workspace...", {
			position: "top-center",
		});

		const timeouts: NodeJS.Timeout[] = [];

		// Queue up step-by-step progress updates
		timeouts.push(
			setTimeout(() => {
				toast.loading("Creating database tables...", { id: toastId });
			}, 1500),
		);
		timeouts.push(
			setTimeout(() => {
				toast.loading("Seeding demo data...", { id: toastId });
			}, 3000),
		);

		try {
			await signup(data);
			// Clear timeouts before updating the final toast state
			for (const t of timeouts) clearTimeout(t);
			toast.success("Account created and seeded successfully!", {
				id: toastId,
			});
			return true;
		} catch (err: unknown) {
			for (const t of timeouts) clearTimeout(t);
			toast.error("Registration failed", { id: toastId });
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong during registration",
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleSignup,
		isLoading,
		error,
	};
}

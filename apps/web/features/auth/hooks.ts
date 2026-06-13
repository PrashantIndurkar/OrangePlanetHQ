"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { LoginInput, SignupInput } from "./types";

export function useLogin() {
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (data: LoginInput) => {
		setIsLoading(true);
		setError(null);
		try {
			await login(data);
			return true;
		} catch (err: unknown) {
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
		try {
			await signup(data);
			return true;
		} catch (err: unknown) {
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

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginApi, signupApi } from "./api";
import type { LoginInput, SignupInput } from "./types";

export function useLogin() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (data: LoginInput) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await loginApi(data);
			console.log("Login success:", response);
			// In a real app, you would set state / cookies here
			router.push("/tasks");
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
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSignup = async (data: SignupInput) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await signupApi(data);
			console.log("Signup success:", response);
			// In a real app, you would set state / cookies here
			router.push("/login");
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

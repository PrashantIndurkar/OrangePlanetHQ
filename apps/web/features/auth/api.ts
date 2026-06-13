import { apiFetch } from "@/lib/api/client";
import type { AuthResponse, LoginInput, SignupInput } from "./types";

export async function loginApi(data: LoginInput): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: data.email,
			password: data.password,
		}),
	});
}

export async function signupApi(data: SignupInput): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/signup", {
		method: "POST",
		body: JSON.stringify({
			email: data.email,
			password: data.password,
			name: data.name,
		}),
	});
}

export async function getMeApi(): Promise<{ user: AuthResponse["user"] }> {
	return apiFetch<{ user: AuthResponse["user"] }>("/auth/me", {
		method: "GET",
	});
}

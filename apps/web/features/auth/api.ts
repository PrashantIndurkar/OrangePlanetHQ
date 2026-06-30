import type { AuthResponse, LoginInput, SignupInput } from "./types";

const AUTH_USER_KEY = "orangeplanet_mock_user";

export async function loginApi(data: LoginInput): Promise<AuthResponse> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	const mockUser = {
		id: "mock-user-1",
		name: data.email.split("@")[0] || "Mock User",
		email: data.email,
		role: "member",
	};
	const token = "mock-jwt-token-12345";

	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
	}

	return {
		user: mockUser,
		token,
	};
}

export async function signupApi(data: SignupInput): Promise<AuthResponse> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	const mockUser = {
		id: `mock-user-${Math.random().toString(36).slice(2, 11)}`,
		name: data.name,
		email: data.email,
		role: "member",
	};
	const token = "mock-jwt-token-12345";

	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
	}

	return {
		user: mockUser,
		token,
	};
}

export async function getMeApi(): Promise<{ user: AuthResponse["user"] }> {
	await new Promise((resolve) => setTimeout(resolve, 100));

	if (typeof window !== "undefined") {
		const userStr = localStorage.getItem(AUTH_USER_KEY);
		if (userStr) {
			return { user: JSON.parse(userStr) };
		}
	}

	const defaultUser = {
		id: "mock-user-1",
		name: "Mock User",
		email: "mock@example.com",
		role: "member",
	};
	return { user: defaultUser };
}

"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { getMeApi, loginApi, signupApi } from "@/features/auth/api";
import type { AuthUser, LoginInput, SignupInput } from "@/features/auth/types";
import { getToken, removeToken, setToken } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/errors";

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (data: LoginInput) => Promise<boolean>;
	signup: (data: SignupInput) => Promise<boolean>;
	logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const router = useRouter();

	const fetchUser = React.useCallback(async () => {
		const token = getToken();
		if (!token) {
			setIsLoading(false);
			return;
		}

		try {
			const { user: userData } = await getMeApi();
			// Ensure name is a string, even if null
			setUser({
				id: userData.id,
				email: userData.email,
				name: userData.name || "",
				role: userData.role,
			});
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				console.log("No active session found (unauthenticated).");
			} else {
				console.error("Failed to restore session:", error);
			}
			removeToken();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchUser();
	}, [fetchUser]);

	const login = React.useCallback(
		async (data: LoginInput): Promise<boolean> => {
			const response = await loginApi(data);
			setToken(response.token, !!data.rememberMe);
			setUser({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name || "",
				role: response.user.role,
			});
			router.push("/tasks");
			return true;
		},
		[router],
	);

	const signup = React.useCallback(
		async (data: SignupInput): Promise<boolean> => {
			const response = await signupApi(data);
			// Save token to session (default rememberMe false for signup)
			setToken(response.token, false);
			setUser({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name || "",
				role: response.user.role,
			});
			router.push("/tasks");
			return true;
		},
		[router],
	);

	const logout = React.useCallback(() => {
		removeToken();
		setUser(null);
		router.push("/");
	}, [router]);

	const value = React.useMemo(
		() => ({
			user,
			isAuthenticated: !!user,
			isLoading,
			login,
			signup,
			logout,
		}),
		[user, isLoading, signup, logout, login],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

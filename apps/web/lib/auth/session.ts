export function getToken(): string | null {
	if (typeof window === "undefined") return null;
	const match = document.cookie.match(/(^|;)\s*token\s*=\s*([^;]+)/);
	return match ? decodeURIComponent(match[2]) : null;
}

export function setToken(token: string, rememberMe = false) {
	if (typeof window === "undefined") return;
	const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day
	// biome-ignore lint/suspicious/noDocumentCookie: cookie writing is required for server-side redirection context
	document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function removeToken() {
	if (typeof window === "undefined") return;
	// biome-ignore lint/suspicious/noDocumentCookie: cookie removing is required for logging out
	document.cookie = "token=; path=/; max-age=0; SameSite=Lax; Secure";
}

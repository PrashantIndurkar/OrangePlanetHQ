import { getToken } from "../auth/session";
import { ApiError } from "./errors";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1";

interface FetchOptions extends RequestInit {
	params?: Record<string, string>;
}

export async function apiFetch<T>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> {
	const { params, headers, ...restOptions } = options;

	let url = `${API_BASE_URL}${endpoint}`;
	if (params) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const reqHeaders = new Headers(headers);
	if (
		!reqHeaders.has("Content-Type") &&
		!(restOptions.body instanceof FormData)
	) {
		reqHeaders.set("Content-Type", "application/json");
	}

	const token = getToken();
	if (token) {
		reqHeaders.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(url, {
		...restOptions,
		headers: reqHeaders,
	});

	if (!response.ok) {
		let message = "An error occurred";
		try {
			const data = await response.json();
			message = data.message || message;
		} catch {
			// Fallback to text status
			message = response.statusText || message;
		}
		throw new ApiError(response.status, message);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return response.json() as Promise<T>;
}

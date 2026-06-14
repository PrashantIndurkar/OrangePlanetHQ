import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	const { pathname } = req.nextUrl;

	// Define route conditions
	const isAuthRoute =
		pathname.startsWith("/login") || pathname.startsWith("/signup");
	const isPrivateRoute =
		pathname.startsWith("/tasks") ||
		pathname.startsWith("/inbox") ||
		pathname.startsWith("/reviews");

	// If trying to access protected route without token, redirect to login
	if (isPrivateRoute && !token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// If trying to access login/signup or root "/" with token, redirect to tasks
	if ((isAuthRoute || pathname === "/") && token) {
		return NextResponse.redirect(new URL("/tasks", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Match dashboard paths, root, and authentication pages
		"/",
		"/tasks/:path*",
		"/inbox/:path*",
		"/reviews/:path*",
		"/login",
		"/signup",
	],
};

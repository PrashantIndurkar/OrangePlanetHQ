import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	const { pathname } = req.nextUrl;

	// Define route conditions
	const isAuthRoute =
		pathname.startsWith("/login") || pathname.startsWith("/signup");
	const isPrivateRoute = pathname === "/" || pathname.startsWith("/tasks");

	// If trying to access protected route without token, redirect to login
	if (isPrivateRoute && !token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// If trying to access login/signup with token, redirect to dashboard
	if (isAuthRoute && token) {
		return NextResponse.redirect(new URL("/tasks", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Match dashboard paths and authentication pages
		"/",
		"/tasks/:path*",
		"/login",
		"/signup",
	],
};

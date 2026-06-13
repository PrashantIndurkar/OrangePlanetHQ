import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
			<h1 className="text-4xl font-extrabold tracking-tight">404</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				This page could not be found.
			</p>
			<Link
				href="/login"
				className="mt-6 text-xs font-semibold text-primary hover:underline"
			>
				Go back to Login
			</Link>
		</div>
	);
}

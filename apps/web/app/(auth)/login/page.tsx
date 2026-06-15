import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/auth/logo";

export const metadata: Metadata = {
	title: "Login | Stride",
	description: "Log in to your Stride account to manage tasks.",
};

export default function LoginPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 px-4 py-12 transition-colors">
			<div className="flex w-full max-w-[420px] flex-col gap-2">
				<Logo />
				<AuthCard>
					<LoginForm />
				</AuthCard>
			</div>
		</div>
	);
}

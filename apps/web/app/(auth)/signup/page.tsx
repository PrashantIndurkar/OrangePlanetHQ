import type { Metadata } from "next";
import React from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
	title: "Register | Stried",
	description: "Create your Stried account to manage tasks.",
};

export default function SignupPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 px-4 py-12 transition-colors">
			<div className="flex w-full max-w-[420px] flex-col gap-2">
				<Logo />
				<AuthCard>
					<SignupForm />
				</AuthCard>
			</div>
		</div>
	);
}

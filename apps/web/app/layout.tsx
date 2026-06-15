import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
	title: "Stride | The workspace for fast moving side projects",
	description: "Plan, track, and ship projects without the overhead of enterprise software. Stride gives solo engineers and small teams a focused workspace.",
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
		],
	},
};

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				"antialiased",
				fontMono.variable,
				"font-sans",
				plusJakartaSans.variable,
			)}
		>
			<body suppressHydrationWarning>
				<QueryProvider>
					<AuthProvider>
						<ThemeProvider>
							{children}
							<Toaster />
						</ThemeProvider>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

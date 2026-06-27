import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
	title: "OrangePlanet | The workspace for fast moving side projects",
	description:
		"Plan, track, and ship projects without the overhead of enterprise software. OrangePlanet gives solo engineers and small teams a focused workspace.",
	icons: {
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🪐</text></svg>',
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

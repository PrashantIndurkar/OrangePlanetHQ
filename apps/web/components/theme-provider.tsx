"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			{...props}
		>
			<ThemeHotkey />
			{children}
		</NextThemesProvider>
	);
}

function ThemeHotkey() {
	const { theme, setTheme } = useTheme();

	useHotkeys("d", () => {
		const currentTheme = theme || "system";
		if (currentTheme === "system") {
			setTheme("dark");
		} else if (currentTheme === "dark") {
			setTheme("light");
		} else {
			setTheme("system");
		}
	}, [theme, setTheme]);

	return null;
}

export { ThemeProvider };

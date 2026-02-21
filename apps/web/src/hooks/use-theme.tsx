import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "arch-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

	// On mount, read persisted preference
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (stored === "light" || stored === "dark" || stored === "system") {
			setThemeState(stored);
		}
	}, []);

	// Sync class on documentElement when theme changes
	useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				matchMedia("(prefers-color-scheme: dark)").matches);
		const next = isDark ? "dark" : "light";
		document.documentElement.classList.toggle("dark", isDark);
		setResolvedTheme(next);
	}, [theme]);

	// Listen to OS preference changes when theme is "system"
	useEffect(() => {
		if (theme !== "system") return;

		const mq = matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) => {
			const isDark = e.matches;
			document.documentElement.classList.toggle("dark", isDark);
			setResolvedTheme(isDark ? "dark" : "light");
		};

		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme]);

	const setTheme = (next: Theme) => {
		localStorage.setItem(STORAGE_KEY, next);
		setThemeState(next);
	};

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}

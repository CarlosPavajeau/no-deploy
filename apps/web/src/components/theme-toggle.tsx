import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggle = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<button
			type="button"
			aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
			onClick={toggle}
			className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
		>
			{resolvedTheme === "dark" ? (
				<Moon className="size-4" />
			) : (
				<Sun className="size-4" />
			)}
		</button>
	);
}

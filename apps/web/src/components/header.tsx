import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/use-cart";

import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu";

const NAV_LINKS = [
	{ label: "Shop", to: "/products" as const },
	{ label: "Features" },
	{ label: "About" },
] as const;

export default function Header() {
	const { itemCount } = useCart();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
				<Link className="flex items-center gap-2" to="/">
					<div className="size-5 rounded-sm bg-foreground" />
					<span className="font-mono text-sm font-bold tracking-wider">
						ARCH.
					</span>
				</Link>

				<nav className="hidden items-center gap-0.5 sm:flex">
					{NAV_LINKS.map(({ label, ...rest }) =>
						"to" in rest ? (
							<Link
								key={label}
								to={rest.to}
								className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								{label}
							</Link>
						) : (
							<button
								key={label}
								type="button"
								className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								{label}
							</button>
						),
					)}
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Link
						to="/cart"
						aria-label={`Cart (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
						className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<ShoppingCart className="size-4" />
						{itemCount > 0 && (
							<span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-foreground font-mono text-[9px] font-bold text-background">
								{itemCount > 99 ? "99+" : itemCount}
							</span>
						)}
					</Link>
					<UserMenu />
				</div>
			</div>
		</header>
	);
}

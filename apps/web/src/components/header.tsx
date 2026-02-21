import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import UserMenu from "./user-menu";

const navLinks = [
	{ to: "/", label: "Shop" },
	{ to: "/", label: "Features" },
	{ to: "/", label: "About" },
	{ to: "/dashboard", label: "Dashboard" },
] as const;

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<div className="flex items-center gap-8">
					<Link to="/" className="text-lg font-bold tracking-wider text-white">
						MIDNIGHT
					</Link>
					<nav className="hidden items-center gap-1 md:flex">
						{navLinks.map(({ to, label }) => (
							<Link key={label} to={to}>
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-foreground"
								>
									{label}
								</Button>
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingCart className="size-4" />
						<Badge className="absolute -right-1 -top-1 size-4 justify-center p-0 text-[10px]">
							0
						</Badge>
					</Button>
					<UserMenu />
				</div>
			</div>
		</header>
	);
}

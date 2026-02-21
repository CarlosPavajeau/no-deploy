import { ArrowRight, Mail } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const productLinks = [
	{ label: "New Arrivals", href: "#" },
	{ label: "Best Sellers", href: "#" },
	{ label: "Collections", href: "#" },
	{ label: "Sale", href: "#" },
];

const companyLinks = [
	{ label: "About", href: "#" },
	{ label: "Careers", href: "#" },
	{ label: "Press", href: "#" },
	{ label: "Contact", href: "#" },
];

const legalLinks = [
	{ label: "Privacy", href: "#" },
	{ label: "Terms", href: "#" },
	{ label: "Shipping", href: "#" },
	{ label: "Returns", href: "#" },
];

export function SiteFooter() {
	return (
		<footer className="border-t border-white/10">
			<div className="mx-auto max-w-7xl px-4 py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
					<div className="space-y-4">
						<p className="text-lg font-bold tracking-wider text-white">
							MIDNIGHT
						</p>
						<p className="max-w-xs text-sm text-muted-foreground">
							Subscribe to our newsletter for early access, exclusive offers,
							and design inspiration.
						</p>
						<InputGroup className="max-w-sm border-white/10 bg-white/[0.02]">
							<InputGroupAddon align="inline-start">
								<Mail className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								type="email"
								placeholder="Enter your email"
								aria-label="Email for newsletter"
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton size="xs" variant="ghost">
									<ArrowRight className="size-4" />
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>

					<div className="space-y-4">
						<p className="text-sm font-medium text-white">Product</p>
						<ul className="space-y-2">
							{productLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<p className="text-sm font-medium text-white">Company</p>
						<ul className="space-y-2">
							{companyLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<p className="text-sm font-medium text-white">Legal</p>
						<ul className="space-y-2">
							{legalLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="my-8 bg-white/10" />

				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						&copy; 2026 Midnight. All rights reserved.
					</p>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span className="relative flex size-2">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
							<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
						</span>
						All systems operational
					</div>
				</div>
			</div>
		</footer>
	);
}

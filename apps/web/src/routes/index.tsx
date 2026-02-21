import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Cpu,
	Globe,
	Package,
	Shield,
	Star,
	Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const SHOP_LINKS = [
	"All Products",
	"New Arrivals",
	"Keyboards",
	"Peripherals",
	"Bundles",
];
const COMPANY_LINKS = ["About", "Blog", "Careers", "Press", "Partners"];
const LEGAL_LINKS = ["Privacy", "Terms", "Returns", "Shipping", "Contact"];

const BENTO_SMALL = [
	{
		tag: "Category",
		title: "Peripherals",
		sub: "12 products",
		desc: "Mechanical keyboards, precision mice.",
		Icon: Zap,
		glow: "from-blue-500/10",
	},
	{
		tag: "Bestseller",
		title: "Developer Kit",
		sub: "Bundle",
		desc: "Everything you need to build faster.",
		Icon: Package,
		glow: "from-emerald-500/10",
	},
	{
		tag: "Members",
		title: "Priority Access",
		sub: "Early drops",
		desc: "Exclusive pricing for members.",
		Icon: Star,
		glow: "from-amber-500/10",
	},
	{
		tag: "Shipping",
		title: "Global Delivery",
		sub: "190+ countries",
		desc: "Free on orders over $100.",
		Icon: Globe,
		glow: "from-rose-500/10",
	},
	{
		tag: "Policy",
		title: "Secure Checkout",
		sub: "256-bit SSL",
		desc: "Your data, always protected.",
		Icon: Shield,
		glow: "from-cyan-500/10",
	},
] as const;


function HomeComponent() {
	return (
		<div className="h-full overflow-x-hidden overflow-y-auto">
			{/* ── Hero ── */}
			<section className="relative flex min-h-[calc(100svh-3.25rem)] items-center border-b border-border">
				{/* Dot-grid background */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-[0.025]"
					style={{
						backgroundImage:
							"radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
						backgroundSize: "32px 32px",
					}}
				/>
				{/* Ambient glow */}
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[160px]"
				/>

				<div className="relative mx-auto w-full max-w-4xl px-6 py-24 lg:py-32">
					<div className="flex flex-col items-center gap-8 text-center">
						<Badge
							variant="outline"
							className="rounded-full border-white/15 px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground"
						>
							v2.0 — Now shipping worldwide
						</Badge>

						<h1 className="text-[clamp(3rem,10vw,6.5rem)] font-bold leading-none tracking-tighter">
							SHOP THE
							<br />
							<span className="text-muted-foreground">COLLECTION.</span>
						</h1>

						<p className="max-w-lg text-base leading-relaxed text-muted-foreground">
							Precision-crafted hardware for engineers who care about the
							details. Each product selected for performance, longevity, and
							aesthetic.
						</p>

						<div className="flex items-center gap-3">
							<Link
								to="/products"
								className={cn(
									buttonVariants({ size: "lg" }),
									"group h-11 overflow-hidden rounded-xl px-6 text-sm font-semibold",
								)}
							>
								<span className="flex items-center gap-2">
									Shop Collection
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
								</span>
							</Link>
							<Button
								variant="ghost"
								size="lg"
								className="h-11 rounded-xl px-6 text-sm font-medium text-muted-foreground hover:text-foreground"
							>
								View Features
							</Button>
						</div>

						<div className="flex items-center gap-8 border-t border-border pt-8">
							{[
								{ value: "2,400+", label: "Products" },
								{ value: "98%", label: "Satisfaction" },
								{ value: "190+", label: "Countries" },
							].map(({ value, label }, i) => (
								<div key={label} className="flex items-center gap-8">
									{i > 0 && <div className="h-8 w-px bg-border" />}
									<div className="flex flex-col gap-0.5">
										<span className="text-xl font-bold tracking-tight">
											{value}
										</span>
										<span className="text-xs text-muted-foreground">
											{label}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── Bento Grid ── */}
			<section className="border-b border-border py-24">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-12 flex items-end justify-between">
						<div>
							<p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
								Products &amp; Features
							</p>
							<h2 className="text-4xl font-bold tracking-tighter lg:text-5xl">
								Built for builders.
							</h2>
						</div>
						<Link
							to="/products"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"hidden rounded-xl sm:flex",
							)}
						>
							View all
							<ArrowRight className="ml-1.5 size-4" />
						</Link>
					</div>

					<div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* Featured large card */}
						<div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl border border-border bg-card p-6 sm:col-span-2">
							<div
								aria-hidden
								className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent"
							/>
							<div className="relative flex h-full flex-col justify-between">
								<div className="flex items-start justify-between">
									<Badge
										variant="outline"
										className="rounded-full border-white/10 text-xs"
									>
										New Arrival
									</Badge>
									<Cpu className="size-5 text-muted-foreground" />
								</div>
								<div>
									<p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
										Featured
									</p>
									<h3 className="text-2xl font-bold tracking-tight">
										Precision Engineered
									</h3>
									<p className="mt-1 text-base text-muted-foreground">
										Hardware Collection
									</p>
									<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
										Crafted for developers who demand perfection. Every
										component selected for performance and aesthetics.
									</p>
									<Button
										variant="outline"
										size="sm"
										className="mt-4 rounded-xl"
									>
										Explore Collection
										<ArrowRight className="ml-1.5 size-3.5" />
									</Button>
								</div>
							</div>
						</div>

						{/* Small cards */}
						{BENTO_SMALL.map(({ tag, title, sub, desc, Icon, glow }) => (
							<div
								key={title}
								className="relative overflow-hidden rounded-2xl border border-border bg-card p-5"
							>
								<div
									aria-hidden
									className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent`}
								/>
								<div className="relative flex h-full flex-col justify-between">
									<div className="flex items-start justify-between">
										<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
											{tag}
										</p>
										<Icon className="size-4 text-muted-foreground" />
									</div>
									<div>
										<h3 className="text-base font-bold tracking-tight">
											{title}
										</h3>
										<p className="text-xs text-muted-foreground">{sub}</p>
										<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
											{desc}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="py-16">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid gap-12 lg:grid-cols-5">
						{/* Brand + newsletter */}
						<div className="lg:col-span-2">
							<div className="mb-4 flex items-center gap-2">
								<div className="size-5 rounded-sm bg-foreground" />
								<span className="font-mono text-sm font-bold tracking-wider">
									ARCH.
								</span>
							</div>
							<p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
								Precision hardware for the modern developer. Curated, tested,
								and shipped worldwide.
							</p>
							<div className="flex gap-2">
								<Input
									type="email"
									placeholder="your@email.com"
									className="h-9 rounded-xl border-border bg-card text-sm"
									aria-label="Email for newsletter"
								/>
								<Button size="sm" className="h-9 shrink-0 rounded-xl px-4">
									Subscribe
								</Button>
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								No spam. Unsubscribe anytime.
							</p>
						</div>

						{/* Link columns */}
						<div className="grid grid-cols-3 gap-8 lg:col-span-3">
							{[
								{ heading: "Shop", links: SHOP_LINKS },
								{ heading: "Company", links: COMPANY_LINKS },
								{ heading: "Legal", links: LEGAL_LINKS },
							].map(({ heading, links }) => (
								<div key={heading}>
									<p className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
										{heading}
									</p>
									<ul className="space-y-2.5 text-sm">
										{links.map((item) => (
											<li key={item}>
												<button
													type="button"
													className="text-muted-foreground transition-colors hover:text-foreground"
												>
													{item}
												</button>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>

					{/* Bottom bar */}
					<div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
						<p className="font-mono text-xs text-muted-foreground">
							&copy; 2026 ARCH. All rights reserved.
						</p>
						<output className="flex items-center gap-2">
							<div
								aria-hidden
								className="size-1.5 animate-pulse rounded-full bg-emerald-500"
							/>
							<span className="font-mono text-xs text-muted-foreground">
								All systems operational
							</span>
						</output>
					</div>
				</div>
			</footer>
		</div>
	);
}

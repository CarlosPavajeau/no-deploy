import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { LucideIcon } from "lucide-react";
import { Headphones, Keyboard, Monitor, Mouse, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Category, Product } from "@/functions/get-products";
import { cn } from "@/lib/utils";

export const PRODUCT_IMAGE_URL =
	"https://cetus-cdn.b-cdn.net/c2943cc4-667e-42eb-934a-f5fd7f5cf4d9.webp";

export const CATEGORY_LABELS: Record<Category, string> = {
	keyboard: "Keyboards",
	peripheral: "Peripherals",
	audio: "Audio",
	monitor: "Monitors",
};

export const CATEGORY_GRADIENTS: Record<Category, string> = {
	keyboard: "from-violet-500/25 via-purple-500/10",
	peripheral: "from-blue-500/25 via-sky-500/10",
	audio: "from-rose-500/25 via-pink-500/10",
	monitor: "from-emerald-500/25 via-teal-500/10",
};

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
	keyboard: Keyboard,
	peripheral: Mouse,
	audio: Headphones,
	monitor: Monitor,
};

const BADGE_VARIANTS = {
	New: "default",
	Sale: "destructive",
	Bestseller: "secondary",
} as const satisfies Record<
	NonNullable<Product["badge"]>,
	"default" | "destructive" | "secondary"
>;

export function ProductCard({ product }: { product: Product }) {
	const label = CATEGORY_LABELS[product.category];

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-white/20">
			{/* Product image */}
			<div className="relative h-48 shrink-0 overflow-hidden bg-muted">
				<Image
					src={PRODUCT_IMAGE_URL}
					alt={product.name}
					layout="fullWidth"
					height={192}
					className="object-cover"
				/>
				{/* Badge */}
				{product.badge && (
					<div className="absolute left-3 top-3">
						<Badge variant={BADGE_VARIANTS[product.badge]}>
							{product.badge}
						</Badge>
					</div>
				)}
				{/* Out-of-stock overlay */}
				{!product.inStock && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/60">
						<span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
							Out of Stock
						</span>
					</div>
				)}
			</div>

			{/* Card content */}
			<div className="flex flex-1 flex-col p-4">
				<p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
					{label}
				</p>
				<h3 className="font-bold leading-snug tracking-tight">
					{product.name}
				</h3>
				<p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
					{product.description}
				</p>
				<div className="mt-2 flex items-center gap-1">
					<Star className="size-3 fill-amber-400 text-amber-400" />
					<span className="text-xs font-medium">{product.rating}</span>
					<span className="text-xs text-muted-foreground">
						({product.reviewCount.toLocaleString()})
					</span>
				</div>
				<div className="mt-3 flex items-center justify-between">
					<span className="text-lg font-bold tracking-tight">
						${product.price}
					</span>
					<Link
						to="/products/$productId"
						params={{ productId: product.id }}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-xl",
						)}
					>
						View →
					</Link>
				</div>
			</div>
		</div>
	);
}

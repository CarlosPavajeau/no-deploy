import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	CATEGORY_LABELS,
	PRODUCT_IMAGE_URL,
	ProductCard,
} from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProduct, getProducts } from "@/functions/get-products";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/products/$productId")({
	loader: async ({ params, context }) => {
		const [product] = await Promise.all([
			context.queryClient.ensureQueryData({
				queryKey: ["product", params.productId],
				queryFn: () => getProduct({ data: params.productId }),
			}),
			context.queryClient.ensureQueryData({
				queryKey: ["products"],
				queryFn: getProducts,
			}),
		]);
		if (!product) throw notFound();
		return product;
	},
	component: ProductDetailPage,
});

const STAR_INDICES = [1, 2, 3, 4, 5] as const;
const GALLERY_IMAGES = [
	PRODUCT_IMAGE_URL,
	PRODUCT_IMAGE_URL,
	PRODUCT_IMAGE_URL,
	PRODUCT_IMAGE_URL,
] as const;

function ProductDetailPage() {
	const { productId } = Route.useParams();

	const { data: product } = useSuspenseQuery({
		queryKey: ["product", productId],
		queryFn: () => getProduct({ data: productId }),
	});

	const { data: allProducts } = useSuspenseQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	const [qty, setQty] = useState(1);
	const [activeImg, setActiveImg] = useState(0);
	const { addItem, updateQuantity, items } = useCart();

	const handleAddToCart = () => {
		const existing = items.find((i) => i.productId === product.id);
		if (existing) {
			updateQuantity(product.id, existing.quantity + qty);
		} else {
			addItem({
				productId: product.id,
				name: product.name,
				price: product.price,
				category: product.category,
			});
			if (qty > 1) updateQuantity(product.id, qty);
		}
		toast.success(`${qty > 1 ? `${qty}× ` : ""}${product.name} added to cart`);
		setQty(1);
	};

	const related = allProducts
		.filter((p) => p.category === product.category && p.id !== product.id)
		.slice(0, 3);

	const categoryLabel = CATEGORY_LABELS[product.category];

	return (
		<div className="h-full overflow-y-auto">
			{/* ── Breadcrumb ── */}
			<div className="border-b border-border">
				<div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3">
					<Link
						to="/"
						className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						Home
					</Link>
					<span className="font-mono text-xs text-muted-foreground">/</span>
					<Link
						to="/products"
						className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						Products
					</Link>
					<span className="font-mono text-xs text-muted-foreground">/</span>
					<span className="font-mono text-xs text-foreground">
						{product.name}
					</span>
				</div>
			</div>

			{/* ── Main content ── */}
			<div className="mx-auto max-w-7xl px-6 py-12">
				<div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
					{/* ── Left: Gallery ── */}
					<div className="flex flex-col gap-4">
						{/* Main image */}
						<div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
							<Image
								src={GALLERY_IMAGES[activeImg]}
								alt={product.name}
								layout="fullWidth"
								height={400}
								className="object-cover"
							/>
							{/* Out-of-stock banner */}
							{!product.inStock && (
								<div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-background/70 py-3 backdrop-blur-sm">
									<span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
										Out of Stock
									</span>
								</div>
							)}
						</div>

						{/* Thumbnail row */}
						<div className="flex gap-2">
							{GALLERY_IMAGES.map((src, i) => (
								<button
									key={src + String(i)}
									type="button"
									aria-label={`View image ${i + 1}`}
									onClick={() => setActiveImg(i)}
									className={`relative overflow-hidden rounded-xl border transition-colors ${
										activeImg === i
											? "border-foreground"
											: "border-border hover:border-white/30"
									}`}
								>
									<Image
										src={src}
										alt={`${product.name} view ${i + 1}`}
										layout="fixed"
										width={80}
										height={60}
										className="object-cover"
									/>
								</button>
							))}
						</div>

						{/* Quick-spec pills */}
						<div className="flex flex-wrap gap-2">
							{product.specs.slice(0, 4).map(({ label, value }) => (
								<div
									key={label}
									className="rounded-lg border border-border bg-card px-3 py-1.5"
								>
									<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
										{label}
									</span>
									<p className="text-xs font-medium">{value}</p>
								</div>
							))}
						</div>
					</div>

					{/* ── Right: Product info ── */}
					<div className="flex flex-col gap-6">
						{/* Category + stock */}
						<div className="flex items-center justify-between">
							<Badge
								variant="outline"
								className="rounded-full border-white/15 font-mono text-xs"
							>
								{categoryLabel}
							</Badge>
							{product.inStock ? (
								<span className="flex items-center gap-1.5 font-mono text-xs text-emerald-500">
									<span className="inline-block size-1.5 rounded-full bg-emerald-500" />
									In Stock
								</span>
							) : (
								<span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
									<span className="inline-block size-1.5 rounded-full bg-muted-foreground" />
									Out of Stock
								</span>
							)}
						</div>

						{/* Name */}
						<div>
							<h1 className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl">
								{product.name}
							</h1>
							{product.badge && (
								<Badge className="mt-3" variant="secondary">
									{product.badge}
								</Badge>
							)}
						</div>

						{/* Rating */}
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-0.5">
								{STAR_INDICES.map((n) => (
									<Star
										key={n}
										className={`size-4 ${
											n <= Math.round(product.rating)
												? "fill-amber-400 text-amber-400"
												: "fill-muted text-muted"
										}`}
									/>
								))}
							</div>
							<span className="text-sm font-medium">{product.rating}</span>
							<span className="text-sm text-muted-foreground">
								({product.reviewCount.toLocaleString()} reviews)
							</span>
						</div>

						{/* Price */}
						<div className="flex items-baseline gap-2">
							<span className="text-4xl font-bold tracking-tight">
								${product.price}
							</span>
							<span className="text-sm text-muted-foreground">USD</span>
						</div>

						<div className="h-px bg-border" />

						{/* Description */}
						<p className="text-sm leading-relaxed text-muted-foreground">
							{product.longDescription}
						</p>

						{/* Specs table */}
						<div>
							<p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
								Specifications
							</p>
							<div className="overflow-hidden rounded-xl border border-border">
								{product.specs.map(({ label, value }, i) => (
									<div
										key={label}
										className={`flex items-center justify-between px-4 py-2.5 text-sm ${
											i !== product.specs.length - 1
												? "border-b border-border"
												: ""
										}`}
									>
										<span className="font-mono text-xs text-muted-foreground">
											{label}
										</span>
										<span className="text-right font-medium">{value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Quantity + Add to Cart */}
						<div className="flex items-center gap-3">
							{/* Quantity selector */}
							<div className="flex items-center rounded-xl border border-border bg-card">
								<button
									type="button"
									aria-label="Decrease quantity"
									disabled={qty <= 1}
									onClick={() => setQty((q) => Math.max(1, q - 1))}
									className="flex h-9 w-9 items-center justify-center rounded-l-xl transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
								>
									<Minus className="size-3.5" />
								</button>
								<span className="w-8 text-center font-mono text-sm font-medium tabular-nums">
									{qty}
								</span>
								<button
									type="button"
									aria-label="Increase quantity"
									onClick={() => setQty((q) => q + 1)}
									className="flex h-9 w-9 items-center justify-center rounded-r-xl transition-colors hover:bg-muted"
								>
									<Plus className="size-3.5" />
								</button>
							</div>

							{/* Add to Cart */}
							<Button
								disabled={!product.inStock}
								onClick={handleAddToCart}
								className="h-9 flex-1 rounded-xl text-sm font-semibold"
							>
								<ShoppingCart className="size-4" />
								{product.inStock ? "Add to Cart" : "Out of Stock"}
							</Button>
						</div>

						{/* Back link */}
						<Link
							to="/products"
							className="flex w-fit items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="size-3.5" />
							Back to Products
						</Link>
					</div>
				</div>

				{/* ── Related Products ── */}
				{related.length > 0 && (
					<div className="mt-20 border-t border-border pt-12">
						<p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
							More in {categoryLabel}
						</p>
						<h2 className="mb-8 text-2xl font-bold tracking-tighter">
							Related Products
						</h2>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{related.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

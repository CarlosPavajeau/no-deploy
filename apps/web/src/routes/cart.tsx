import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { CATEGORY_LABELS, PRODUCT_IMAGE_URL } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
	component: CartPage,
});

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

function CartPage() {
	const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();

	const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
	const tax = subtotal * TAX_RATE;
	const total = subtotal + shipping + tax;

	if (items.length === 0) {
		return (
			<div className="h-full overflow-x-hidden overflow-y-auto">
				<div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
					<div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-card">
						<ShoppingBag className="size-8 text-muted-foreground" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Your cart is empty
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Add some products to get started.
						</p>
					</div>
					<Link to="/products" className={cn(buttonVariants(), "rounded-xl")}>
						Browse Products
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full overflow-x-hidden overflow-y-auto">
			{/* ── Page header ── */}
			<div className="border-b border-border">
				<div className="mx-auto flex max-w-7xl items-baseline gap-3 px-6 py-8">
					<h1 className="text-3xl font-bold tracking-tighter">Cart</h1>
					<Badge
						variant="outline"
						className="rounded-full border-white/15 font-mono text-xs"
					>
						{itemCount} {itemCount === 1 ? "item" : "items"}
					</Badge>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid gap-10 lg:grid-cols-[1fr_360px]">
					{/* ── Items list ── */}
					<div className="flex flex-col divide-y divide-border">
						{items.map((item) => {
							const label = CATEGORY_LABELS[item.category];

							return (
								<div
									key={item.productId}
									className="flex items-center gap-4 py-5 first:pt-0"
								>
									{/* Thumbnail */}
									<div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
										<Image
											src={PRODUCT_IMAGE_URL}
											alt={item.name}
											layout="fixed"
											width={80}
											height={80}
											className="object-cover"
										/>
									</div>

									{/* Info */}
									<div className="flex min-w-0 flex-1 flex-col gap-0.5">
										<Link
											to="/products/$productId"
											params={{ productId: item.productId }}
											className="truncate font-medium tracking-tight hover:underline"
										>
											{item.name}
										</Link>
										<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
											{label}
										</p>
										<p className="mt-0.5 font-bold">
											${(item.price * item.quantity).toFixed(2)}
										</p>
										{item.quantity > 1 && (
											<p className="text-xs text-muted-foreground">
												${item.price} each
											</p>
										)}
									</div>

									{/* Quantity + remove */}
									<div className="flex shrink-0 items-center gap-2">
										<div className="flex items-center rounded-xl border border-border bg-card">
											<button
												type="button"
												aria-label="Decrease quantity"
												onClick={() =>
													updateQuantity(item.productId, item.quantity - 1)
												}
												className="flex h-8 w-8 items-center justify-center rounded-l-xl transition-colors hover:bg-muted"
											>
												<Minus className="size-3" />
											</button>
											<span className="w-7 text-center font-mono text-sm tabular-nums">
												{item.quantity}
											</span>
											<button
												type="button"
												aria-label="Increase quantity"
												onClick={() =>
													updateQuantity(item.productId, item.quantity + 1)
												}
												className="flex h-8 w-8 items-center justify-center rounded-r-xl transition-colors hover:bg-muted"
											>
												<Plus className="size-3" />
											</button>
										</div>
										<button
											type="button"
											aria-label={`Remove ${item.name} from cart`}
											onClick={() => removeItem(item.productId)}
											className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										>
											<X className="size-4" />
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{/* ── Order summary ── */}
					<div className="h-fit lg:sticky lg:top-4">
						<div className="rounded-2xl border border-border bg-card p-6">
							<p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
								Order Summary
							</p>

							{/* Line items */}
							<div className="flex flex-col gap-2 text-sm">
								{items.map((item) => (
									<div
										key={item.productId}
										className="flex items-start justify-between gap-3"
									>
										<span className="truncate text-muted-foreground">
											{item.name}
											{item.quantity > 1 && (
												<span className="ml-1 font-mono text-xs">
													×{item.quantity}
												</span>
											)}
										</span>
										<span className="shrink-0 font-medium tabular-nums">
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								))}
							</div>

							<div className="my-4 h-px bg-border" />

							{/* Totals */}
							<div className="flex flex-col gap-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span className="font-medium tabular-nums">
										${subtotal.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Shipping</span>
									<span className="font-medium tabular-nums">
										{shipping === 0 ? (
											<span className="text-emerald-500">Free</span>
										) : (
											`$${shipping.toFixed(2)}`
										)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Tax (8%)</span>
									<span className="font-medium tabular-nums">
										${tax.toFixed(2)}
									</span>
								</div>
								<div className="my-1 h-px bg-border" />
								<div className="flex justify-between text-base font-bold">
									<span>Total</span>
									<span className="tabular-nums">${total.toFixed(2)}</span>
								</div>
							</div>

							<Link
								to="/checkout"
								className={cn(
									buttonVariants(),
									"mt-5 h-10 w-full rounded-xl text-sm font-semibold",
								)}
							>
								Proceed to Checkout →
							</Link>

							{subtotal < SHIPPING_THRESHOLD && (
								<p className="mt-3 text-center text-xs text-muted-foreground">
									Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for
									free shipping
								</p>
							)}

							<Link
								to="/products"
								className="mt-3 block text-center font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
							>
								← Continue shopping
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, CheckCircle2, ShoppingBag } from "lucide-react";

import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from "@/components/product-card";
import { loadOrder } from "@/lib/order";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$orderId")({
	component: OrderPage,
	loader: ({ params }) => {
		const order = loadOrder(params.orderId);
		if (!order) throw notFound();
		return { order };
	},
});

// ── Timeline ──────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
	{ id: "placed", label: "Order Placed", sublabel: "Confirmed", done: true },
	{
		id: "payment",
		label: "Payment Confirmed",
		sublabel: "Processed",
		done: true,
	},
	{
		id: "processing",
		label: "In Process",
		sublabel: "Preparing your order",
		done: false,
	},
] as const;

function OrderTimeline() {
	return (
		<div className="flex items-start">
			{TIMELINE_STEPS.map((step, i) => (
				<div key={step.id} className="flex flex-1 flex-col items-center">
					<div className="flex w-full items-center">
						{i > 0 ? (
							<div className="h-0.5 flex-1 bg-emerald-500" />
						) : (
							<div className="flex-1" />
						)}

						{step.done ? (
							<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500">
								<Check className="size-3.5 text-white" />
							</div>
						) : (
							<div className="relative flex size-7 shrink-0 items-center justify-center">
								<div className="absolute size-7 animate-ping rounded-full bg-amber-500/30" />
								<div className="size-4 rounded-full bg-amber-500" />
							</div>
						)}

						{i < TIMELINE_STEPS.length - 1 ? (
							<div
								className={cn(
									"h-0.5 flex-1",
									step.done ? "bg-emerald-500" : "bg-border",
								)}
							/>
						) : (
							<div className="flex-1" />
						)}
					</div>

					<div className="mt-2.5 px-1 text-center">
						<p
							className={cn(
								"text-xs font-semibold leading-tight",
								step.done ? "text-foreground" : "text-amber-500",
							)}
						>
							{step.label}
						</p>
						<p className="mt-0.5 text-[10px] text-muted-foreground">
							{step.sublabel}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────

function OrderPage() {
	const { order } = Route.useLoaderData();

	return (
		<div className="h-full overflow-y-auto">
			<div className="mx-auto max-w-2xl px-6 py-12">
				{/* Confirmation header */}
				<div className="mb-10 flex flex-col items-center gap-5 text-center">
					<div className="flex size-20 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
						<CheckCircle2 className="size-10 text-emerald-500" />
					</div>
					<div>
						<p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
							Order confirmed
						</p>
						<h1 className="text-3xl font-bold tracking-tight">
							{order.number}
						</h1>
						<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
							A confirmation email has been sent to{" "}
							<span className="font-medium text-foreground">{order.email}</span>
							. Estimated delivery: <strong>3–5 business days</strong>.
						</p>
					</div>
				</div>

				{/* Status timeline */}
				<section aria-label="Order status" className="mb-10">
					<p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
						Order Status
					</p>
					<div className="rounded-2xl border border-border bg-card p-6">
						<OrderTimeline />
					</div>
				</section>

				{/* Items ordered */}
				<section aria-label="Items ordered" className="mb-10">
					<p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
						Items Ordered
					</p>
					<div className="flex flex-col gap-2">
						{order.items.map((item) => {
							const Icon = CATEGORY_ICONS[item.category];
							const gradient = CATEGORY_GRADIENTS[item.category];
							return (
								<div
									key={item.productId}
									className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
								>
									<div
										className={`relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient} to-transparent`}
									>
										<span className="font-mono text-sm font-black text-white/[0.06]">
											{item.name[0]}
										</span>
										<Icon
											aria-hidden
											className="absolute bottom-1 right-1 size-3.5 text-white/20"
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">{item.name}</p>
										<p className="mt-0.5 text-xs text-muted-foreground">
											Qty {item.quantity} × ${item.price.toFixed(2)}
										</p>
									</div>
									<span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
										${(item.price * item.quantity).toFixed(2)}
									</span>
								</div>
							);
						})}
					</div>
				</section>

				{/* Order totals */}
				<section aria-label="Order totals" className="mb-10">
					<div className="rounded-2xl border border-border bg-card p-5">
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="tabular-nums">
									${order.subtotal.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Shipping</span>
								<span className="tabular-nums">
									{order.shipping === 0 ? (
										<span className="text-emerald-500">Free</span>
									) : (
										`$${order.shipping.toFixed(2)}`
									)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Tax (8%)</span>
								<span className="tabular-nums">${order.tax.toFixed(2)}</span>
							</div>
							<div className="my-1 h-px bg-border" />
							<div className="flex justify-between text-base font-bold">
								<span>Total</span>
								<span className="tabular-nums">${order.total.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</section>

				{/* Actions */}
				<div className="flex justify-center">
					<Link
						to="/products"
						className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ShoppingBag className="size-3.5" />
						Continue shopping
					</Link>
				</div>
			</div>
		</div>
	);
}

import type { CartItem } from "@/hooks/use-cart";

export type OrderSnapshot = {
	number: string;
	email: string;
	items: CartItem[];
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
};

const ORDER_KEY_PREFIX = "arch-order-";

export function saveOrder(order: OrderSnapshot): void {
	localStorage.setItem(
		`${ORDER_KEY_PREFIX}${order.number}`,
		JSON.stringify(order),
	);
}

export function loadOrder(orderId: string): OrderSnapshot | null {
	try {
		const raw = localStorage.getItem(`${ORDER_KEY_PREFIX}${orderId}`);
		if (!raw) return null;
		return JSON.parse(raw) as OrderSnapshot;
	} catch {
		return null;
	}
}

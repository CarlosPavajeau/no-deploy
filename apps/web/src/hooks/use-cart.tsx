import type { ReactNode } from "react";
import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from "react";

import type { Category } from "@/functions/get-products";

export type CartItem = {
	productId: string;
	name: string;
	price: number;
	category: Category;
	quantity: number;
};

type CartState = { items: CartItem[] };

type CartAction =
	| { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
	| { type: "REMOVE_ITEM"; payload: string }
	| { type: "UPDATE_QTY"; payload: { productId: string; quantity: number } }
	| { type: "CLEAR" }
	| { type: "HYDRATE"; payload: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const idx = state.items.findIndex(
				(i) => i.productId === action.payload.productId,
			);
			if (idx >= 0) {
				const items = [...state.items];
				const existing = items[idx];
				items[idx] = { ...existing, quantity: existing.quantity + 1 };
				return { items };
			}
			return { items: [...state.items, { ...action.payload, quantity: 1 }] };
		}
		case "REMOVE_ITEM":
			return {
				items: state.items.filter((i) => i.productId !== action.payload),
			};
		case "UPDATE_QTY": {
			const { productId, quantity } = action.payload;
			if (quantity <= 0) {
				return { items: state.items.filter((i) => i.productId !== productId) };
			}
			return {
				items: state.items.map((i) =>
					i.productId === productId ? { ...i, quantity } : i,
				),
			};
		}
		case "CLEAR":
			return { items: [] };
		case "HYDRATE":
			return action.payload;
	}
}

type CartContextValue = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	itemCount: number;
	subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "arch-cart";

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });
	// Track whether we've done the initial localStorage write, so we don't
	// overwrite stored data with the empty initial state on first render.
	const initializedRef = useRef(false);

	// Hydrate from localStorage on mount
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw)
				dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as CartState });
		} catch {
			// ignore parse errors
		}
	}, []);

	// Persist after every state change, but skip the very first run so we
	// don't clobber localStorage before hydration has a chance to run.
	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			return;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}, [state]);

	const addItem = (item: Omit<CartItem, "quantity">) =>
		dispatch({ type: "ADD_ITEM", payload: item });

	const removeItem = (productId: string) =>
		dispatch({ type: "REMOVE_ITEM", payload: productId });

	const updateQuantity = (productId: string, quantity: number) =>
		dispatch({ type: "UPDATE_QTY", payload: { productId, quantity } });

	const clearCart = () => dispatch({ type: "CLEAR" });

	const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
	const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				items: state.items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				itemCount,
				subtotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}

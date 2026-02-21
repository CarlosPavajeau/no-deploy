import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CATEGORY_LABELS, ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select";
import type { Category, Product } from "@/functions/get-products";
import { getProducts } from "@/functions/get-products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData({
			queryKey: ["products"],
			queryFn: getProducts,
		}),
	component: ProductsPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "featured", label: "Featured" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
	{ value: "rating", label: "Highest Rated" },
];

const CATEGORIES: { value: Category | "all"; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "keyboard", label: CATEGORY_LABELS.keyboard },
	{ value: "peripheral", label: CATEGORY_LABELS.peripheral },
	{ value: "audio", label: CATEGORY_LABELS.audio },
	{ value: "monitor", label: CATEGORY_LABELS.monitor },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
	const copy = [...products];
	if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
	if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
	if (sort === "rating") return copy.sort((a, b) => b.rating - a.rating);
	return copy;
}

function ProductsPage() {
	const { data: products } = useSuspenseQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<Category | "all">("all");
	const [sort, setSort] = useState<SortKey>("featured");

	const filtered = useMemo(() => {
		let list = products;
		if (category !== "all") list = list.filter((p) => p.category === category);
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.description.toLowerCase().includes(q) ||
					p.category.includes(q),
			);
		}
		return sortProducts(list, sort);
	}, [products, category, search, sort]);

	return (
		<div className="h-full overflow-y-auto">
			{/* ── Page header ── */}
			<div className="border-b border-border bg-background/80 backdrop-blur-xl">
				<div className="mx-auto max-w-7xl px-6 py-8">
					<div className="flex items-end justify-between gap-4">
						<div>
							<p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
								Catalogue
							</p>
							<h1 className="text-3xl font-bold tracking-tighter">
								Products{" "}
								<Badge
									variant="outline"
									className="ml-1 rounded-full border-white/15 font-mono text-xs"
								>
									{filtered.length}
								</Badge>
							</h1>
						</div>
						<NativeSelect
							value={sort}
							onChange={(e) => setSort(e.target.value as SortKey)}
							aria-label="Sort products"
						>
							{SORT_OPTIONS.map((opt) => (
								<NativeSelectOption key={opt.value} value={opt.value}>
									{opt.label}
								</NativeSelectOption>
							))}
						</NativeSelect>
					</div>

					{/* ── Filter bar ── */}
					<div className="mt-5 flex flex-wrap items-center gap-2">
						{/* Category pills */}
						<div className="flex flex-wrap gap-1.5">
							{CATEGORIES.map(({ value, label }) => (
								<button
									key={value}
									type="button"
									onClick={() => setCategory(value)}
									className={cn(
										"rounded-full border px-3 py-1 font-mono text-xs transition-colors",
										category === value
											? "border-foreground/30 bg-foreground/10 text-foreground"
											: "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
									)}
								>
									{label}
								</button>
							))}
						</div>

						{/* Search */}
						<div className="relative ml-auto">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search products…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="h-8 w-52 rounded-xl pl-8 text-sm"
								aria-label="Search products"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* ── Product grid ── */}
			<div className="mx-auto max-w-7xl px-6 py-10">
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center gap-3 py-24 text-center">
						<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
							No results
						</p>
						<p className="text-sm text-muted-foreground">
							Try adjusting your search or filters.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filtered.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

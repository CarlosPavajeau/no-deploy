import { Package, Shield, Sparkles, Zap } from "lucide-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
	{
		icon: Zap,
		title: "Precision Engineering",
		description:
			"Every component is meticulously crafted with tolerances measured in microns. Built to last, designed to impress.",
		className: "md:col-span-2 md:row-span-2",
	},
	{
		icon: Package,
		title: "Sustainable Materials",
		description:
			"Responsibly sourced materials that minimize environmental impact without compromising quality.",
		className: "md:col-span-1",
	},
	{
		icon: Shield,
		title: "Lifetime Warranty",
		description:
			"We stand behind every product with a comprehensive lifetime warranty.",
		className: "md:col-span-1",
	},
	{
		icon: Sparkles,
		title: "Minimal by Design",
		description:
			"Stripped to the essentials. No excess, no waste — just pure, purposeful design that speaks for itself.",
		className: "md:col-span-2",
	},
] as const;

export function BentoGrid() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-24">
			<h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
				Why Midnight
			</h2>

			<div className="grid grid-cols-1 gap-4 md:auto-rows-[180px] md:grid-cols-4">
				{features.map((feature) => (
					<Card
						key={feature.title}
						className={cn(
							"border-white/10 bg-white/[0.02] ring-0 transition-colors hover:bg-white/[0.04]",
							feature.className,
						)}
					>
						<CardHeader className="h-full">
							<div className="flex size-10 items-center justify-center rounded-lg border border-white/10">
								<feature.icon className="size-5 text-white/70" />
							</div>
							<CardTitle className="text-white">{feature.title}</CardTitle>
							<CardDescription>{feature.description}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</section>
	);
}

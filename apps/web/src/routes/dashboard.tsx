import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import { getForecast } from "@/functions/get-forecast";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
			});
		}

		const forecasts = await context.queryClient.ensureQueryData({
			queryKey: ["forecasts"],
			queryFn: getForecast,
		});

		return { forecasts };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const { data: forecasts, dataUpdatedAt } = useSuspenseQuery({
		queryKey: ["forecasts"],
		queryFn: getForecast,
	});

	return (
		<div className="flex flex-col gap-4">
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<p>Last updated {new Date(dataUpdatedAt).toISOString()}</p>

			<div className="grid grid-cols-3 gap-4">
				{forecasts.map((forecast) => (
					<Item variant="outline" key={forecast.id}>
						<ItemContent>
							<ItemTitle>
								#{forecast.id} {forecast.temperature_c}°C
							</ItemTitle>
							<ItemDescription>{forecast.summary}</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button variant="outline" size="sm">
								Action
							</Button>
						</ItemActions>
					</Item>
				))}
			</div>
		</div>
	);
}

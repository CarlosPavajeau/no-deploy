import { GitBranchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Image } from "@unpic/react";

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

    const forecasts = await getForecast();
    return { forecasts };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  const { forecasts } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-4">
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={GitBranchIcon} /> New Branch
        </Button>
        <Button size="sm">
          <HugeiconsIcon icon={GitBranchIcon} /> New Branch
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline">
          <HugeiconsIcon icon={GitBranchIcon} /> New Branch
        </Button>
        <Button>
          <HugeiconsIcon icon={GitBranchIcon} /> New Branch
        </Button>
      </div>

      <div>
        <Image
          alt={"image"}
          className="rounded-sm object-cover"
          height={400}
          layout="constrained"
          priority
          src="https://cetus-cdn.b-cdn.net/e69d388e-3368-41d3-9f41-46a5dc3859d8.webp"
          width={400}
        />
      </div>

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

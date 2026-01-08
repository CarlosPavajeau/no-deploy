import { db } from "@no-deploy/db";
import { forecasts } from "@no-deploy/db/schema/forecast";
import { createServerFn } from "@tanstack/react-start";

export const getForecast = createServerFn({ method: "GET" }).handler(
  async () => {
    const fr = await db.select().from(forecasts);
    return fr;
  }
);

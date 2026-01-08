import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

export const forecasts = pgTable("forecasts", {
  id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  temperature_c: integer("temperature_c").notNull(),
  summary: text("summary"),
});

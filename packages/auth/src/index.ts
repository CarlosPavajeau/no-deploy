import { db } from "@no-deploy/db";
import * as schema from "@no-deploy/db/schema/auth";
import { env } from "@no-deploy/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const maxSessionCacheAge = 300;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: maxSessionCacheAge,
    },
  },
  plugins: [tanstackStartCookies()],
});

import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { type } from "arktype";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: type("string"),
    BETTER_AUTH_SECRET: type("string"),
    BETTER_AUTH_URL: type("string"),
    CORS_ORIGIN: type("string"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    SERVER_APP_URL: type("string"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

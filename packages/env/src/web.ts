import { createEnv } from "@t3-oss/env-core";
import { type } from "arktype";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: type("string"),
  },
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables:", issues);
    throw new Error("Invalid environment variables");
  },
});

import { env } from "@no-deploy/env/server";
import { createServerOnlyFn } from "@tanstack/react-start";

export const getServerUrl = createServerOnlyFn(async () => {
  return env.SERVER_APP_URL;
});

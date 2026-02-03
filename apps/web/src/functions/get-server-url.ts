import { env } from "@no-deploy/env/server";
import { createServerFn } from "@tanstack/react-start";

export const getServerUrl = createServerFn({ method: "GET" }).handler(
	async () => {
		return env.SERVER_APP_URL;
	},
);

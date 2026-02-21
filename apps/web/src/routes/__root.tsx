import type { QueryClient } from "@tanstack/react-query";

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/hooks/use-cart";
import { ThemeProvider } from "@/hooks/use-theme";

import Header from "../components/header";
import appCss from "../index.css?url";

export type RouterAppContext = {
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My App",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Anti-flash: set correct theme class before CSS/React hydrate */}
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: intentional anti-flash inline script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('arch-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
					}}
				/>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<CartProvider>
						<div className="grid h-svh grid-rows-[auto_1fr]">
							<Header />
							<Outlet />
						</div>
						<Toaster richColors />
					</CartProvider>
				</ThemeProvider>
				<TanStackRouterDevtools position="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}

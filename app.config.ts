import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";

export default defineConfig({
	vite: {
		plugins: [tailwindcss(), devtools({ autoname: true })],
	},
	server: {
		preset: "vercel",
	},
});

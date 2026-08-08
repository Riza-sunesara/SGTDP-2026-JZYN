import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    tailwind(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

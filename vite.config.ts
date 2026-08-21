// @lovable.dev/vite-tanstack-config includes: TanStack devtools, tanstackStart,
// viteReact, tailwindcss, tsConfigPaths, nitro, VITE_* env injection, @ path alias,
// React/TanStack dedupe, error logger plugins, and sandbox detection.
// Do NOT add these plugins manually or the app will break with duplicates.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

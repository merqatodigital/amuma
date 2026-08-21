import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves images/videos stored in the private "site-media" bucket to visitors.
 * Read-only: the path is a single file name inside the bucket.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = (params as { _splat?: string })._splat ?? "";
        const path = decodeURIComponent(raw);
        if (!path || path.includes("..") || path.startsWith("/")) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage.from("site-media").download(path);
          if (error || !data) return new Response("Not found", { status: 404 });

          const ext = path.split(".").pop()?.toLowerCase() ?? "";
          const guessed =
            ext === "mp4"
              ? "video/mp4"
              : ext === "webm"
                ? "video/webm"
                : ext === "mov"
                  ? "video/quicktime"
                  : "application/octet-stream";

          return new Response(await data.arrayBuffer(), {
            headers: {
              "Content-Type": data.type || guessed,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});

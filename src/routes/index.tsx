import { createFileRoute } from "@tanstack/react-router";
import Site from "@/components/Site";

export const Route = createFileRoute("/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    site: (search.site as string) || "main",
  }),
  head: () => ({
    meta: [
      { title: "AMUMA · Barefoot Boutique Resorts" },
      {
        name: "description",
        content:
          "AMUMA is a circle of intimate boutique retreats in the hidden corners of the Philippines and Southeast Asia — created with care, discovered slowly.",
      },
      { property: "og:title", content: "AMUMA · Barefoot Boutique Resorts" },
      {
        property: "og:description",
        content:
          "A circle of intimate retreats in the hidden corners of the Philippines and Southeast Asia. Join the Founding Circle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { site } = Route.useSearch();
  return <Site siteId={site} />;
}

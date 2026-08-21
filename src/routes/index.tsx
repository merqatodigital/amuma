import { createFileRoute } from "@tanstack/react-router";
import Site from "@/components/Site";
import PlatformLanding from "@/components/PlatformLanding";

export const Route = createFileRoute("/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    site: (search.site as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Merqato Digital — Build Your Website in Minutes" },
      {
        name: "description",
        content:
          "Pick a template, add your content, and publish — all in minutes. No coding. No hosting headaches.",
      },
      { property: "og:title", content: "Merqato Digital — Build Your Website in Minutes" },
      {
        property: "og:description",
        content:
          "Pick a template, add your content, and publish — all in minutes. No coding. No hosting headaches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { site } = Route.useSearch();

  // No ?site param → show the platform landing page
  if (!site) return <PlatformLanding />;

  // ?site=main or ?site=<id> → show the site builder
  return <Site siteId={site} />;
}

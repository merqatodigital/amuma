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
        content: "Pick a template, add your content, and publish — all in minutes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { site } = Route.useSearch();
  if (!site) return <PlatformLanding />;
  return <Site siteId={site} />;
}

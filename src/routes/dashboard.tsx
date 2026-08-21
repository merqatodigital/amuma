import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Site = {
  id: string;
  slug: string;
  template: string;
  plan: string;
  site_name: string;
  tagline: string;
  onboarding_done: boolean;
  created_at: string;
};

function Dashboard() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const { data } = await supabase
        .from("sites")
        .select("id, slug, template, plan, site_name, tagline, onboarding_done, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (alive) {
        setSites(data ?? []);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <Link
          to="/onboard"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
        >
          Create New Site
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Your Sites
          </h2>
          {sites.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You haven't created any sites yet.
              </p>
              <Link
                to="/onboard"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition"
              >
                Create your first site
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between rounded-lg border border-border px-5 py-4 hover:bg-accent/30 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{site.site_name || site.slug}</p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          site.onboarding_done
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {site.onboarding_done ? "Active" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {site.slug}.merqato.digital
                      {site.tagline ? ` · ${site.tagline}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase">
                      {site.plan}
                    </span>
                    <Link
                      to="/admin"
                      search={{ site: site.id }}
                      className="px-3 py-1.5 rounded border border-border text-xs font-medium hover:bg-accent transition"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-accent/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-sm">Upgrade your plan</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Unlock custom domains, priority support, more sites, and advanced analytics.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition shrink-0 ml-4">
              View plans
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

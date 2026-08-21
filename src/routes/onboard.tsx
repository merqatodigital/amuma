import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent } from "@/content";

export const Route = createFileRoute("/onboard")({
  component: OnboardingWizard,
});

type StepProps = {
  data: FormData;
  update: (fields: Partial<FormData>) => void;
  errors: Record<string, string>;
};

type FormData = {
  template: string;
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  heroUrl: string;
  sections: string[];
  subdomain: string;
  customDomain: string;
};

const TEMPLATES = [
  { id: "resort", name: "Resort", desc: "Boutique hospitality & retreats" },
  { id: "restaurant", name: "Restaurant", desc: "Dining & culinary experiences" },
  { id: "portfolio", name: "Portfolio", desc: "Personal or creative showcase" },
  { id: "agency", name: "Agency", desc: "Studio or service business" },
  { id: "blog", name: "Blog", desc: "Articles & storytelling" },
];

const SECTION_OPTIONS = [
  { id: "story", label: "Our Story" },
  { id: "places", label: "Places" },
  { id: "model", label: "Business Model" },
  { id: "community", label: "Community" },
  { id: "custom", label: "Custom Section" },
];

function StepTemplate({ data, update, errors }: StepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Choose a template</h2>
      <p className="text-sm text-muted-foreground mb-6">Pick a starting point for your site.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => update({ template: t.id })}
            className={`rounded-lg border p-4 text-left transition ${
              data.template === t.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="h-24 rounded bg-muted mb-3 flex items-center justify-center text-xs text-muted-foreground">
              {t.name}
            </div>
            <p className="font-medium text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
      {errors.template && <p className="text-destructive text-xs mt-2">{errors.template}</p>}
    </div>
  );
}

function StepInfo({ data, update, errors }: StepProps) {
  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Site information</h2>
        <p className="text-sm text-muted-foreground">Tell us about your business.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Business name *</label>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.siteName}
          onChange={(e) => update({ siteName: e.target.value })}
          placeholder="Acme Co"
        />
        {errors.siteName && <p className="text-destructive text-xs mt-1">{errors.siteName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          placeholder="We build things"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="A short description of your business"
        />
      </div>
    </div>
  );
}

function StepMedia({ data, update }: StepProps) {
  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Logo & hero</h2>
        <p className="text-sm text-muted-foreground">Upload your branding assets.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Logo URL</label>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.logoUrl}
          onChange={(e) => update({ logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hero image / video URL</label>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.heroUrl}
          onChange={(e) => update({ heroUrl: e.target.value })}
          placeholder="https://example.com/hero.jpg"
        />
      </div>
    </div>
  );
}

function StepSections({ data, update }: StepProps) {
  const toggle = (id: string) => {
    const next = data.sections.includes(id)
      ? data.sections.filter((s) => s !== id)
      : [...data.sections, id];
    update({ sections: next });
  };

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Sections</h2>
        <p className="text-sm text-muted-foreground">Toggle which sections to include.</p>
      </div>
      <div className="space-y-2">
        {SECTION_OPTIONS.map((s) => (
          <label
            key={s.id}
            className="flex items-center gap-3 rounded-md border border-border px-4 py-3 cursor-pointer hover:bg-accent/50"
          >
            <input
              type="checkbox"
              checked={data.sections.includes(s.id)}
              onChange={() => toggle(s.id)}
              className="rounded"
            />
            <span className="text-sm font-medium">{s.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepDomain({ data, update, errors }: StepProps) {
  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Choose your domain</h2>
        <p className="text-sm text-muted-foreground">Use a free subdomain or connect your own.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subdomain</label>
        <div className="flex items-center gap-0">
          <input
            className="rounded-l-md border border-r-0 border-input bg-background px-3 py-2 text-sm flex-1"
            value={data.subdomain}
            onChange={(e) =>
              update({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })
            }
            placeholder="yoursite"
          />
          <span className="rounded-r-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">
            .merqato.digital
          </span>
        </div>
        {errors.subdomain && <p className="text-destructive text-xs mt-1">{errors.subdomain}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Custom domain (optional)</label>
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.customDomain}
          onChange={(e) => update({ customDomain: e.target.value })}
          placeholder="www.example.com"
        />
      </div>
    </div>
  );
}

const STEPS = [
  { key: "template", label: "Template" },
  { key: "info", label: "Info" },
  { key: "media", label: "Media" },
  { key: "sections", label: "Sections" },
  { key: "domain", label: "Domain" },
];

function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<FormData>({
    template: "",
    siteName: "",
    tagline: "",
    description: "",
    logoUrl: "",
    heroUrl: "",
    sections: ["story", "places", "community"],
    subdomain: "",
    customDomain: "",
  });

  const update = useCallback((fields: Partial<FormData>) => {
    setData((d) => ({ ...d, ...fields }));
    setErrors({});
  }, []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.template) e.template = "Select a template";
    if (step === 1) {
      if (!data.siteName.trim()) e.siteName = "Business name is required";
    }
    if (step === 4) {
      if (!data.subdomain.trim()) e.subdomain = "Subdomain is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    const { data: siteId, error: fnError } = await supabase.rpc("create_site_from_template", {
      p_slug: data.subdomain,
      p_template_id: data.template,
      p_site_name: data.siteName,
      p_tagline: data.tagline,
    });

    if (fnError || !siteId) {
      setErrors({ submit: fnError?.message || "Failed to create site" });
      setSubmitting(false);
      return;
    }

    const siteContent = {
      ...defaultContent,
      nav: {
        ...defaultContent.nav,
        brand: data.siteName,
        tagline: data.tagline,
      },
      hero: {
        ...defaultContent.hero,
        title: data.siteName,
        tagline: data.tagline,
        headline: data.tagline || data.siteName,
        subline: data.description || defaultContent.hero.subline,
        media: {
          ...defaultContent.hero.media,
          image: data.heroUrl || defaultContent.hero.media.image,
        },
      },
      sections: defaultContent.sections.map((s) => ({
        ...s,
        enabled: data.sections.includes(s.id) || s.enabled,
      })),
    };

    await supabase
      .from("site_content")
      .update({ data: siteContent as never })
      .eq("site_id", siteId);

    await supabase
      .from("sites")
      .update({ custom_domain: data.customDomain || null })
      .eq("id", siteId);

    navigate({ to: `/admin`, search: { site: siteId } });
  };

  const StepComponent = [StepTemplate, StepInfo, StepMedia, StepSections, StepDomain][step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Create your site</h1>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:inline ${i === step ? "font-medium" : "text-muted-foreground"}`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-border hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="w-full max-w-2xl">
          <StepComponent data={data} update={update} errors={errors} />
        </div>

        {errors.submit && <p className="text-destructive text-sm mt-4">{errors.submit}</p>}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={back}
              className="px-4 py-2 rounded-md border border-input text-sm font-medium hover:bg-accent transition"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create site"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";

const FEATURES = [
  {
    title: "5 Industry Templates",
    desc: "Resort, restaurant, portfolio, agency, or blog — pick the one that fits your business.",
  },
  {
    title: "Free Subdomain",
    desc: "Get yoursitename.merqato.digital instantly. No hosting setup needed.",
  },
  {
    title: "Visual Editor",
    desc: "Edit your site live with our inline admin panel. No code required.",
  },
  {
    title: "Custom Domain",
    desc: "Upgrade to Pro and connect your own domain with one click.",
  },
];

const TEMPLATES = [
  { name: "Resort & Hospitality", emoji: "🏝️" },
  { name: "Restaurant & Cafe", emoji: "🍽️" },
  { name: "Portfolio & Personal", emoji: "🎨" },
  { name: "Agency & Business", emoji: "💼" },
  { name: "Blog & Magazine", emoji: "✍️" },
];

export default function PlatformLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="text-xl font-semibold tracking-tight">Merqato Digital</span>
        <div className="flex items-center gap-4 text-sm">
          <a href="#templates" className="hover:text-gray-600">
            Templates
          </a>
          <a href="#features" className="hover:text-gray-600">
            Features
          </a>
          <Link
            to="/dashboard"
            className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center md:px-12 md:py-36">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-400">
          Website Builder
        </p>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Your business deserves a{" "}
          <span className="text-gray-400">beautiful website</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
          Pick a template, add your content, and publish — all in minutes. No coding. No hosting headaches.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/onboard"
            className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
          >
            Get Started Free
          </Link>
          <a
            href="#templates"
            className="rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Templates
          </a>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="bg-gray-50 px-6 py-20 md:px-12">
        <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-gray-400">
          Templates
        </p>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Start with a proven design
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{t.emoji}</div>
              <h3 className="text-sm font-medium">{t.name}</h3>
            </div>
          ))}
          <Link
            to="/onboard"
            className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-sm font-medium text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
          >
            Choose a template →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 md:px-12">
        <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-gray-400">
          Features
        </p>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Everything you need
        </h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white md:px-12">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to build your site?</h2>
        <p className="mx-auto mt-4 max-w-md text-gray-400">
          Free to start. Upgrade when you're ready for a custom domain.
        </p>
        <Link
          to="/onboard"
          className="mt-8 inline-block rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Merqato Digital. All rights reserved.
      </footer>
    </div>
  );
}

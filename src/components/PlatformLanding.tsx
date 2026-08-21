import { Link } from "@tanstack/react-router";

export default function PlatformLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="text-xl font-semibold tracking-tight">Merqato Digital</span>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" search={{ site: "main" }} className="hover:text-gray-600">
            Demo Site
          </Link>
          <Link
            to="/"
            search={{ site: "main" }}
            className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Start Building
          </Link>
        </div>
      </nav>

      <section className="px-6 py-24 text-center md:px-12 md:py-36">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-400">
          Website Builder
        </p>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Your business deserves a{" "}
          <span className="text-gray-400">beautiful website</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
          Pick a template, edit your content live, and publish. No coding needed.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            search={{ site: "main" }}
            className="rounded-md bg-gray-900 px-8 py-4 text-lg font-medium text-white hover:bg-gray-800"
          >
            Start Building Free
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20 text-center md:px-12">
        <h2 className="mb-8 text-3xl font-bold">How it works</h2>
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 text-3xl">1</div>
            <h3 className="font-semibold">Pick a Template</h3>
            <p className="mt-2 text-sm text-gray-500">Resort, restaurant, portfolio, agency, or blog.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 text-3xl">2</div>
            <h3 className="font-semibold">Edit Your Content</h3>
            <p className="mt-2 text-sm text-gray-500">Click any text or image to change it. Upload from your device.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 text-3xl">3</div>
            <h3 className="font-semibold">Publish</h3>
            <p className="mt-2 text-sm text-gray-500">Your site is live. Share your link or connect a custom domain.</p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Merqato Digital
      </footer>
    </div>
  );
}

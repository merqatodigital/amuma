import { useEffect, useState } from "react";
import { useContent, useSite } from "../store";
import { AddItem, ItemTools, T } from "../admin/Editable";

export default function Nav() {
  const { nav } = useContent();
  const { editMode } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || editMode
            ? "border-b border-bark-900/10 bg-sand-50/85 py-3 text-bark-800 backdrop-blur-xl"
            : "border-b border-transparent py-6 text-sand-50"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
            <T path="nav.brand" className="t-brand font-display text-[22px] leading-none" />
            <T
              path="nav.tagline"
              className={`mt-1.5 text-[7px] tracking-[0.34em] indent-[0.34em] uppercase transition-opacity duration-500 ${
                scrolled || editMode ? "opacity-55" : "opacity-70"
              }`}
            />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.links.map((l, i) => (
              <span key={i} className="group/item relative">
                <ItemTools path="nav.links" index={i} className="-top-4 -right-2" />
                <a
                  href={editMode ? undefined : l.href}
                  className="t-nav group relative opacity-80 transition-opacity hover:opacity-100"
                >
                  <T path={`nav.links.${i}.label`} />
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                </a>
              </span>
            ))}
            {editMode && <AddItem path="nav.links" label="link" className="w-auto! px-3 py-1.5" />}
            <a
              href={editMode ? undefined : nav.ctaHref}
              className={`t-btn border px-6 py-2.5 transition-colors duration-300 ${
                scrolled || editMode
                  ? "border-bark-800 hover:bg-bark-800 hover:text-sand-50"
                  : "border-sand-50/70 hover:bg-sand-50 hover:text-bark-900"
              }`}
            >
              <T path="nav.ctaLabel" />
            </a>
          </nav>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-bark-900 text-sand-100 transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-10">
          {[...nav.links, { label: nav.ctaLabel, href: nav.ctaHref }].map((l, i) => (
            <a
              key={l.label + i}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 45}ms` }}
              className={`font-display text-4xl font-light tracking-wide transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

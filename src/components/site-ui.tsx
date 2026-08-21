import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------- Wordmark */

export function Logo({
  className = "",
  tagline = true,
  align = "center",
}: {
  className?: string;
  tagline?: boolean;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center" : "items-start"
      } ${className}`}
    >
      <div className="font-display text-[2.6em] leading-[0.95] font-normal tracking-[0.2em] indent-[0.2em]">
        AMUMA
      </div>
      {tagline && (
        <div className="mt-[0.7em] text-[0.48em] font-light tracking-[0.42em] indent-[0.42em] opacity-70">
          BAREFOOT BOUTIQUE RESORTS
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "tr" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref as React.Ref<HTMLElement>}
      style={{ animationDelay: `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}

/* ---------------------------------------------------------------- Typography */

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`t-eyebrow flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-current opacity-40" />
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`t-heading font-display leading-[1.05] ${className}`}
      style={{
        fontSize:
          "clamp(calc(2.1rem * var(--heading-scale)), calc(5vw * var(--heading-scale)), calc(3.9rem * var(--heading-scale)))",
      }}
    >
      {children}
    </h2>
  );
}

export function Section({
  id,
  children,
  className = "",
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative px-6 py-24 sm:px-10 md:py-32 lg:px-16 ${
        dark ? "bg-bark-900 text-sand-100" : ""
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-current opacity-10 ${className}`} />;
}

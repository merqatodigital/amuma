import { useEffect, useState } from "react";
import { MediaLayer, useContent, useSite } from "../store";
import { EImg, T } from "../admin/Editable";

export default function Hero() {
  const { hero } = useContent();
  const { editMode } = useSite();
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hero.enabled) return null;
  const isMotion = hero.media.type !== "image";
  const showEditableImage = editMode && hero.media.type === "image";

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-bark-900"
    >
      {showEditableImage ? (
        <EImg
          path="hero.media.image"
          alt="AMUMA"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <MediaLayer
          block={hero.media}
          alt="AMUMA"
          className="absolute inset-0 h-[115%] w-full object-cover"
          style={
            isMotion
              ? undefined
              : { transform: `translateY(${Math.min(y * 0.28, 260)}px) scale(1.03)` }
          }
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bark-900 via-bark-900/55 to-bark-900"
        style={{ opacity: (hero.overlay ?? 45) / 100 }}
      />

      <div className="pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-6 text-sand-50 [&_a]:pointer-events-auto [&_h1]:pointer-events-auto [&_p]:pointer-events-auto [&_span]:pointer-events-auto">
        <div
          style={{ opacity: editMode ? 1 : Math.max(0, 1 - y / 520) }}
          className="flex flex-col items-center"
        >
          <T
            path="hero.title"
            as="h1"
            className="t-brand text-center font-display leading-[0.9]"
            style={{
              fontSize:
                "clamp(calc(3.4rem * var(--heading-scale)), calc(13vw * var(--heading-scale)), calc(8.5rem * var(--heading-scale)))",
            }}
          />
          <div className="mt-7 h-px w-16 bg-sand-100/40" />
          <T path="hero.tagline" className="t-eyebrow mt-6 text-center text-sand-100/75" />

          <T
            path="hero.headline"
            as="p"
            className="mt-12 max-w-xl text-center font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-snug font-light text-sand-100/95 italic"
          />
          <T
            path="hero.subline"
            as="p"
            className="mt-5 max-w-md text-center text-[13px] leading-relaxed tracking-wide text-sand-100/75"
          />

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={editMode ? undefined : hero.primaryHref}
              className="t-btn border border-sand-50 bg-sand-50 px-9 py-3.5 text-bark-900 transition-colors duration-300 hover:bg-transparent hover:text-sand-50"
            >
              <T path="hero.primaryLabel" />
            </a>
            <a
              href={editMode ? undefined : hero.secondaryHref}
              className="t-btn border border-sand-50/50 px-9 py-3.5 transition-colors duration-300 hover:border-sand-50"
            >
              <T path="hero.secondaryLabel" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-3 text-sand-100/70">
          <T path="hero.scrollLabel" className="text-[9px] tracking-[0.35em] uppercase" />
          <svg width="14" height="26" viewBox="0 0 14 26" className="scroll-hint">
            <path d="M7 0v22M1 16l6 6 6-6" stroke="currentColor" fill="none" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}

import { useContent, useSite } from "../store";
import { Eyebrow, Reveal, Section, SectionTitle } from "../components/ui";
import { AddItem, EImg, ItemTools, T } from "../admin/Editable";

/**
 * A client-created section. Five layouts, three tones — all switchable
 * from Admin → Sections without touching code.
 */
export default function CustomSection({ id }: { id: string }) {
  const { custom } = useContent();
  const { editMode } = useSite();
  const c = custom?.[id];
  if (!c || !c.enabled) return null;

  const p = `custom.${id}`;
  const dark = c.tone === "dark";
  const bg = dark ? "" : c.tone === "muted" ? "bg-sand-100" : "bg-sand-50";
  const bodyTone = dark ? "text-sand-200/85" : "text-bark-700";

  const cta =
    (c.ctaLabel || editMode) && (
      <a
        href={editMode ? undefined : c.ctaHref}
        className={`t-btn mt-9 inline-block border px-9 py-3.5 transition-colors duration-300 ${
          dark
            ? "border-sand-100/60 hover:bg-sand-50 hover:text-bark-900"
            : "border-bark-800 hover:bg-bark-800 hover:text-sand-50"
        }`}
      >
        <T path={`${p}.ctaLabel`} placeholder="Button…" />
      </a>
    );

  /* ---------------------------------------------------------- banner */
  if (c.layout === "banner")
    return (
      <Reveal className="relative h-[62vh] min-h-[400px] w-full overflow-hidden">
        <EImg path={`${p}.image`} alt="" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-bark-900/45" />
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-sand-50 [&_*]:pointer-events-auto">
          <Eyebrow className="justify-center text-sand-200">
            <T path={`${p}.eyebrow`} />
          </Eyebrow>
          <SectionTitle className="mt-6">
            <T path={`${p}.title`} className="block whitespace-pre-line" />
          </SectionTitle>
          <T
            path={`${p}.body`}
            as="p"
            className="t-body mt-6 max-w-xl text-[15px] text-sand-100/85"
          />
          {cta}
        </div>
      </Reveal>
    );

  /* ----------------------------------------------------------- cards */
  if (c.layout === "cards")
    return (
      <Section id={id} dark={dark} className={bg}>
        <Reveal className="max-w-2xl">
          <Eyebrow className={dark ? "text-sand-300" : "text-clay-600"}>
            <T path={`${p}.eyebrow`} />
          </Eyebrow>
          <SectionTitle className="mt-7">
            <T path={`${p}.title`} className="block whitespace-pre-line" />
          </SectionTitle>
          <T path={`${p}.body`} as="p" className={`t-body mt-7 text-[15px] ${bodyTone}`} />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.cards.map((_, i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className={`group/item relative ${dark ? "bg-bark-800/60" : "bg-sand-100"}`}
            >
              <ItemTools path={`${p}.cards`} index={i} className="top-2! right-2!" />
              <div className="relative aspect-[4/3] overflow-hidden">
                <EImg path={`${p}.cards.${i}.image`} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-7">
                <T
                  path={`${p}.cards.${i}.title`}
                  as="div"
                  className="t-heading font-display text-2xl"
                />
                <T
                  path={`${p}.cards.${i}.body`}
                  as="p"
                  className={`t-body mt-3 text-[13.5px] ${bodyTone}`}
                />
              </div>
            </Reveal>
          ))}
        </div>
        <AddItem path={`${p}.cards`} label="card" className="mt-4" />
        {cta}
      </Section>
    );

  /* -------------------------------------------------- text / split */
  const imageFirst = c.layout === "imageLeft";
  const hasImage = c.layout === "imageLeft" || c.layout === "imageRight";

  return (
    <Section id={id} dark={dark} className={bg}>
      <div className={`grid items-center gap-14 ${hasImage ? "lg:grid-cols-2" : ""}`}>
        {hasImage && (
          <Reveal
            className={`relative aspect-[4/3] overflow-hidden ${imageFirst ? "" : "lg:order-2"}`}
          >
            <EImg path={`${p}.image`} alt="" className="h-full w-full object-cover" />
          </Reveal>
        )}
        <Reveal delay={80} className={hasImage ? "" : "max-w-3xl"}>
          <Eyebrow className={dark ? "text-sand-300" : "text-clay-600"}>
            <T path={`${p}.eyebrow`} />
          </Eyebrow>
          <SectionTitle className="mt-7">
            <T path={`${p}.title`} className="block whitespace-pre-line" />
          </SectionTitle>
          <T path={`${p}.body`} as="p" className={`t-body mt-7 text-[15px] ${bodyTone}`} />
          {cta}
        </Reveal>
      </div>
    </Section>
  );
}

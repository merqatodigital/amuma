import { useContent } from "../store";
import { Eyebrow, Reveal, Section, SectionTitle } from "../components/ui";
import { AddItem, EImg, ItemTools, T } from "../admin/Editable";

export function Hidden() {
  const c = useContent().hidden;
  if (!c.enabled) return null;
  return (
    <Section id="destinations" className="bg-sand-50">
      <div className="grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Eyebrow className="text-clay-600">
            <T path="hidden.eyebrow" />
          </Eyebrow>
          <SectionTitle className="mt-7">
            <T path="hidden.title" className="block whitespace-pre-line" />
          </SectionTitle>
        </Reveal>
        <div className="space-y-6 text-[15px] leading-[1.9] text-bark-700 md:col-span-6 md:col-start-7">
          <Reveal delay={80}>
            <T path="hidden.p1" as="p" />
          </Reveal>
          <Reveal delay={140}>
            <T path="hidden.p2" as="p" />
          </Reveal>
          <Reveal delay={200}>
            <T path="hidden.quote" as="p" className="font-display text-xl text-bark-800 italic" />
          </Reveal>
        </div>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {c.cards.map((_, i) => (
          <Reveal
            key={i}
            delay={i * 100}
            className="group/item group relative aspect-[4/5] overflow-hidden"
          >
            <ItemTools path="hidden.cards" index={i} className="top-2! right-2!" />
            <EImg
              path={`hidden.cards.${i}.image`}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark-900/75 via-bark-900/10 to-transparent" />
            <div className="absolute bottom-0 left-0 z-20 p-7 text-sand-50">
              <T
                path={`hidden.cards.${i}.title`}
                as="div"
                className="font-display text-3xl font-light"
              />
              <T
                path={`hidden.cards.${i}.caption`}
                as="div"
                className="mt-1.5 text-[10px] tracking-[0.2em] uppercase opacity-75"
              />
            </div>
          </Reveal>
        ))}
      </div>
      <AddItem path="hidden.cards" label="destination card" className="mt-4" />
    </Section>
  );
}

export function Palawan() {
  const c = useContent().palawan;
  if (!c.enabled) return null;
  return (
    <>
      <Reveal className="relative h-[65vh] min-h-[420px] w-full overflow-hidden">
        <EImg path="palawan.image" alt="" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-bark-900/40" />
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-sand-50 [&_*]:pointer-events-auto">
          <Eyebrow className="justify-center text-sand-200">
            <T path="palawan.eyebrow" />
          </Eyebrow>
          <T
            path="palawan.bannerTitle"
            as="h2"
            className="mt-6 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-none font-light tracking-wide"
          />
          <T
            path="palawan.bannerSub"
            as="p"
            className="mt-5 text-[11px] tracking-[0.3em] text-sand-100/80 uppercase"
          />
        </div>
      </Reveal>

      <Section className="bg-sand-50">
        <div className="grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <SectionTitle>
              <T path="palawan.title" className="block whitespace-pre-line" />
            </SectionTitle>
          </Reveal>
          <div className="space-y-6 text-[15px] leading-[1.9] text-bark-700 md:col-span-6 md:col-start-7">
            <Reveal delay={80}>
              <T path="palawan.p1" as="p" />
            </Reveal>
            <Reveal delay={140}>
              <T path="palawan.p2" as="p" />
            </Reveal>
            <Reveal delay={200}>
              <T path="palawan.p3" as="p" />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

export function SanVicente() {
  const c = useContent().sanVicente;
  if (!c.enabled) return null;
  return (
    <Section className="bg-sand-100">
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28">
          <EImg path="sanVicente.image" alt="" className="h-full w-full object-cover" />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow className="text-clay-600">
              <T path="sanVicente.eyebrow" />
            </Eyebrow>
            <SectionTitle className="mt-7">
              <T path="sanVicente.title" className="block whitespace-pre-line" />
            </SectionTitle>
          </Reveal>
          <div className="mt-8 space-y-6 text-[15px] leading-[1.9] text-bark-700">
            <Reveal delay={80}>
              <T path="sanVicente.p1" as="p" />
            </Reveal>
            <Reveal delay={140}>
              <T path="sanVicente.p2" as="p" />
            </Reveal>
            <Reveal delay={200}>
              <T path="sanVicente.p3" as="p" />
            </Reveal>
          </div>

          <Reveal delay={120} className="mt-10 grid grid-cols-2 gap-px bg-bark-900/10">
            <div className="bg-sand-100 py-7 text-center">
              <T
                path="sanVicente.suiteCount"
                as="div"
                className="font-display text-4xl font-light"
              />
              <T
                path="sanVicente.suiteLabel"
                as="div"
                className="mt-1 text-[10px] tracking-[0.2em] text-clay-600 uppercase"
              />
            </div>
            <div className="bg-sand-100 py-7 text-center">
              <T
                path="sanVicente.villaCount"
                as="div"
                className="font-display text-4xl font-light"
              />
              <T
                path="sanVicente.villaLabel"
                as="div"
                className="mt-1 text-[10px] tracking-[0.2em] text-clay-600 uppercase"
              />
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-12">
            <T
              path="sanVicente.unlockTitle"
              as="h3"
              className="font-display text-2xl font-light"
            />
            <T
              path="sanVicente.unlockBody"
              as="p"
              className="mt-4 text-[14px] leading-[1.85] text-bark-700"
            />
            <div className="mt-7 divide-y divide-bark-900/10 border-y border-bark-900/15 text-[13.5px]">
              {c.unlockRows.map((_, i) => (
                <div
                  key={i}
                  className="group/item relative flex items-center justify-between gap-6 py-4"
                >
                  <ItemTools path="sanVicente.unlockRows" index={i} />
                  <T path={`sanVicente.unlockRows.${i}.label`} />
                  <T
                    path={`sanVicente.unlockRows.${i}.value`}
                    className="shrink-0 font-display text-lg"
                  />
                </div>
              ))}
            </div>
            <AddItem path="sanVicente.unlockRows" label="row" className="mt-3" />
            <T
              path="sanVicente.unlockNote"
              as="p"
              className="mt-6 text-[13px] leading-[1.8] text-clay-600"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Future() {
  const c = useContent().future;
  if (!c.enabled) return null;
  return (
    <Section className="bg-sand-50">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="future.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="future.title" className="block whitespace-pre-line" />
        </SectionTitle>
      </Reveal>
      <div className="mt-14 grid gap-px border border-bark-900/10 bg-bark-900/10 sm:grid-cols-2 lg:grid-cols-3">
        {c.items.map((_, i) => (
          <Reveal
            key={i}
            delay={i * 55}
            className="group/item relative flex items-baseline justify-between gap-4 bg-sand-50 px-7 py-8 transition-colors duration-500 hover:bg-sand-100"
          >
            <ItemTools path="future.items" index={i} />
            <div>
              <T
                path={`future.items.${i}.name`}
                as="div"
                className="font-display text-2xl font-light"
              />
              <T
                path={`future.items.${i}.region`}
                as="div"
                className="mt-1 text-[11px] tracking-wide text-clay-600"
              />
            </div>
            <T
              path={`future.items.${i}.status`}
              className="shrink-0 text-[9px] tracking-[0.18em] text-bark-700/60 uppercase"
            />
          </Reveal>
        ))}
      </div>
      <AddItem path="future.items" label="destination" className="mt-4" />
    </Section>
  );
}

export function Roadmap() {
  const c = useContent().roadmap;
  if (!c.enabled) return null;
  return (
    <Section id="roadmap" dark>
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-sand-300">
          <T path="roadmap.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="roadmap.title" className="block whitespace-pre-line" />
        </SectionTitle>
      </Reveal>

      <div className="relative mt-16 pl-8 sm:pl-0">
        <div className="absolute top-0 bottom-0 left-[3px] w-px bg-sand-100/20 sm:left-[112px]" />
        {c.items.map((_, i) => (
          <Reveal
            key={i}
            delay={i * 60}
            className="group/item relative flex gap-8 pb-12 sm:gap-12"
          >
            <ItemTools path="roadmap.items" index={i} />
            <T
              path={`roadmap.items.${i}.year`}
              as="div"
              className="hidden w-[96px] shrink-0 pt-1 text-right font-display text-2xl font-light text-sand-200 sm:block"
            />
            <span className="absolute top-2.5 -left-8 h-[7px] w-[7px] rounded-full bg-sand-300 sm:left-[112px] sm:-translate-x-1/2" />
            <div className="sm:pl-12">
              <T
                path={`roadmap.items.${i}.year`}
                as="div"
                className="font-display text-xl text-sand-200 sm:hidden"
              />
              <T
                path={`roadmap.items.${i}.title`}
                as="h3"
                className="font-display text-2xl font-light"
              />
              <T
                path={`roadmap.items.${i}.body`}
                as="p"
                className="mt-2 max-w-lg text-[14px] leading-[1.8] text-sand-200/70"
              />
            </div>
          </Reveal>
        ))}
        <AddItem path="roadmap.items" label="milestone" />
      </div>
    </Section>
  );
}

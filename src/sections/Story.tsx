import { useState } from "react";
import { Img, useContent, useSite } from "../store";
import { Eyebrow, Reveal, Rule, Section, SectionTitle } from "../components/site-ui";
import { AddItem, EImg, ItemTools, T } from "../admin/Editable";

export function Vision() {
  const c = useContent().vision;
  if (!c.enabled) return null;
  return (
    <Section id="vision" className="bg-sand-50">
      <div className="grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Eyebrow className="text-clay-600">
            <T path="vision.eyebrow" />
          </Eyebrow>
          <SectionTitle className="mt-7">
            <T path="vision.title" className="block whitespace-pre-line" />
          </SectionTitle>
        </Reveal>
        <div className="space-y-7 text-[15px] leading-[1.9] text-bark-700 md:col-span-6 md:col-start-7">
          <Reveal delay={80}>
            <T path="vision.p1" as="p" />
          </Reveal>
          <Reveal delay={160}>
            <T
              path="vision.quote"
              as="p"
              className="font-display text-[1.6rem] leading-[1.5] font-light text-bark-800 italic"
            />
          </Reveal>
          <Reveal delay={240}>
            <T path="vision.p2" as="p" />
          </Reveal>
        </div>
      </div>

      <Reveal
        delay={200}
        className="mt-20 grid grid-cols-2 gap-px overflow-hidden border border-bark-900/10 bg-bark-900/10 sm:grid-cols-4"
      >
        {c.stats.map((_, i) => (
          <div key={i} className="group/item relative bg-sand-50 px-6 py-8 text-center">
            <ItemTools path="vision.stats" index={i} />
            <T
              path={`vision.stats.${i}.value`}
              as="div"
              className="font-display text-3xl font-light md:text-4xl"
            />
            <T
              path={`vision.stats.${i}.label`}
              as="div"
              className="mt-2 text-[10px] tracking-[0.16em] text-clay-600 uppercase"
            />
          </div>
        ))}
      </Reveal>
      <AddItem path="vision.stats" label="stat" className="mt-3" />
    </Section>
  );
}

export function Meaning() {
  const c = useContent().meaning;
  if (!c.enabled) return null;
  return (
    <Section dark className="overflow-hidden">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <Reveal>
          <Eyebrow className="text-sand-300">
            <T path="meaning.eyebrow" />
          </Eyebrow>
          <div className="mt-10">
            <T
              path="meaning.word"
              as="div"
              className="t-brand font-display leading-none"
              style={{
                fontSize:
                  "clamp(calc(3rem * var(--heading-scale)), calc(9vw * var(--heading-scale)), calc(6rem * var(--heading-scale)))",
              }}
            />
            <div className="mt-6 h-px w-24 bg-sand-300/50" />
            <T
              path="meaning.pronunciation"
              as="div"
              className="mt-6 text-[10px] tracking-luxe text-sand-300 uppercase"
            />
          </div>
        </Reveal>
        <div className="space-y-7 text-[15px] leading-[1.9] text-sand-200/85">
          <Reveal delay={80}>
            <T path="meaning.p1" as="p" />
          </Reveal>
          <Reveal delay={160}>
            <T path="meaning.p2" as="p" />
          </Reveal>
          <Reveal delay={240}>
            <Rule className="my-8" />
            <T path="meaning.p3" as="p" />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Circle() {
  const c = useContent().circle;
  if (!c.enabled) return null;
  return (
    <Section id="circle" className="bg-sand-100">
      <Reveal className="max-w-3xl">
        <Eyebrow className="text-clay-600">
          <T path="circle.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="circle.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T path="circle.intro" as="p" className="mt-8 text-[15px] leading-[1.9] text-bark-700" />
      </Reveal>

      <div className="mt-16 grid gap-px bg-bark-900/10 md:grid-cols-3">
        {c.cards.map((_, i) => (
          <Reveal key={i} delay={i * 90} className="group/item relative bg-sand-100 p-9">
            <ItemTools path="circle.cards" index={i} />
            <T
              path={`circle.cards.${i}.title`}
              as="div"
              className="font-display text-[2rem] leading-none font-light"
            />
            <T
              path={`circle.cards.${i}.body`}
              as="p"
              className="mt-5 text-[14px] leading-[1.85] text-bark-700"
            />
          </Reveal>
        ))}
      </div>
      <AddItem path="circle.cards" label="card" className="mt-3" />

      <div className="mt-24 grid gap-14 md:grid-cols-2">
        <Reveal className="border-t border-bark-900/15 pt-8">
          <Eyebrow className="text-clay-600">
            <T path="circle.unitsEyebrow" />
          </Eyebrow>
          <T path="circle.unitsTitle" as="h3" className="mt-6 font-display text-3xl font-light" />
          <T
            path="circle.unitsBody"
            as="p"
            className="mt-5 text-[14px] leading-[1.85] text-bark-700"
          />
          <ul className="mt-6 space-y-3 text-[14px]">
            {c.unitsBullets.map((_, i) => (
              <li key={i} className="group/item relative flex gap-3">
                <span className="text-clay-500">—</span>
                <T path={`circle.unitsBullets.${i}`} />
                <ItemTools path="circle.unitsBullets" index={i} />
              </li>
            ))}
          </ul>
          <AddItem path="circle.unitsBullets" label="bullet" className="mt-4" />
        </Reveal>

        <Reveal delay={120} className="border-t border-bark-900/15 pt-8">
          <Eyebrow className="text-clay-600">
            <T path="circle.pebblesEyebrow" />
          </Eyebrow>
          <T path="circle.pebblesTitle" as="h3" className="mt-6 font-display text-3xl font-light" />
          <T
            path="circle.pebblesBody"
            as="p"
            className="mt-5 text-[14px] leading-[1.85] text-bark-700"
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {c.pebblesChips.map((_, i) => (
              <span
                key={i}
                className="group/item relative rounded-full border border-bark-900/15 px-4 py-1.5 text-[11px] tracking-wide"
              >
                <T path={`circle.pebblesChips.${i}`} />
                <ItemTools path="circle.pebblesChips" index={i} />
              </span>
            ))}
          </div>
          <AddItem path="circle.pebblesChips" label="tag" className="mt-4" />
          <T
            path="circle.pebblesNote"
            as="p"
            className="mt-6 text-[12px] tracking-wide text-clay-600"
          />
        </Reveal>
      </div>
    </Section>
  );
}

export function Experience() {
  const c = useContent().experience;
  const { editMode } = useSite();
  const [active, setActive] = useState(0);
  if (!c.enabled) return null;
  const items = c.items;
  const idx = Math.min(active, Math.max(0, items.length - 1));

  return (
    <Section dark>
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-sand-300">
          <T path="experience.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="experience.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T
          path="experience.intro"
          as="p"
          className="mt-7 text-[15px] leading-[1.9] text-sand-200/80"
        />
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {items.map((_, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`group/item relative block w-full border-b border-sand-100/15 py-6 text-left transition-colors ${
                idx === i ? "text-sand-50" : "text-sand-200/55"
              }`}
            >
              <ItemTools path="experience.items" index={i} />
              <div className="flex items-baseline gap-4">
                <span className="text-[10px] tracking-widest opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <T
                  path={`experience.items.${i}.title`}
                  className="font-display text-2xl font-light md:text-[1.75rem]"
                />
              </div>
              <div
                className={`grid transition-all duration-500 ${
                  idx === i || editMode
                    ? "mt-3 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <T
                  path={`experience.items.${i}.body`}
                  as="p"
                  className="overflow-hidden pl-8 text-[13.5px] leading-[1.8] text-sand-200/75"
                />
              </div>
            </div>
          ))}
          <AddItem path="experience.items" label="experience" className="mt-5" />
        </div>

        <div className="relative aspect-[4/5] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[520px]">
          {editMode ? (
            items[idx] && (
              <EImg
                path={`experience.items.${idx}.image`}
                alt={items[idx].title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )
          ) : (
            items.map((e, i) => (
              <Img
                key={i}
                src={e.image}
                alt={e.title}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out ${
                  idx === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark-900/50 to-transparent" />
        </div>
      </div>
    </Section>
  );
}

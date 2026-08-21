import { useState } from "react";
import { useContent, useSite } from "../store";
import { Eyebrow, Reveal, Section, SectionTitle } from "../components/site-ui";
import { AddItem, EImg, ItemTools, T } from "../admin/Editable";

export function Team() {
  const c = useContent().team;
  if (!c.enabled) return null;
  return (
    <Section id="team" className="bg-sand-50">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="team.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="team.title" className="block whitespace-pre-line" />
        </SectionTitle>
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {c.members.map((_, i) => (
          <Reveal key={i} delay={i * 100} className="group/item relative">
            <ItemTools path="team.members" index={i} />
            <div className="relative aspect-[3/4] overflow-hidden bg-sand-200">
              <EImg
                path={`team.members.${i}.image`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all duration-[1200ms] hover:scale-[1.04] hover:grayscale-0"
              />
            </div>
            <T
              path={`team.members.${i}.name`}
              as="h3"
              className="mt-6 font-display text-2xl font-light"
            />
            <T
              path={`team.members.${i}.role`}
              as="div"
              className="mt-1.5 text-[10px] tracking-[0.2em] text-clay-600 uppercase"
            />
            <T
              path={`team.members.${i}.bio`}
              as="p"
              className="mt-4 text-[13.5px] leading-[1.85] text-bark-700"
            />
          </Reveal>
        ))}
      </div>
      <AddItem path="team.members" label="team member" className="mt-8" />
    </Section>
  );
}

export function Portal() {
  const c = useContent().portal;
  if (!c.enabled) return null;
  return (
    <Section dark>
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-sand-300">
          <T path="portal.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="portal.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T path="portal.intro" as="p" className="mt-7 text-[15px] leading-[1.9] text-sand-200/80" />
      </Reveal>

      <div className="mt-14 grid gap-px bg-sand-100/15 md:grid-cols-2">
        {c.columns.map((col, ci) => (
          <Reveal key={ci} delay={ci * 100} className="group/item relative bg-bark-900 p-9">
            <ItemTools path="portal.columns" index={ci} />
            <T path={`portal.columns.${ci}.title`} as="h3" className="font-display text-2xl font-light" />
            <ul className="mt-6 space-y-4 text-[13.5px] leading-relaxed text-sand-200/80">
              {col.items.map((_, i) => (
                <li key={i} className="group/item relative flex gap-3">
                  <span className="text-sand-400">—</span>
                  <T path={`portal.columns.${ci}.items.${i}`} />
                  <ItemTools path={`portal.columns.${ci}.items`} index={i} />
                </li>
              ))}
            </ul>
            <AddItem path={`portal.columns.${ci}.items`} label="line" className="mt-5" />
          </Reveal>
        ))}
      </div>
      <Reveal delay={140}>
        <T
          path="portal.closing"
          as="p"
          className="mt-10 font-display text-2xl font-light text-sand-200/90 italic"
        />
      </Reveal>
    </Section>
  );
}

export function Join() {
  const site = useContent();
  const c = site.join;
  const tiers = site.tiers.items;
  const brand = site.nav.brand;
  const { editMode } = useSite();
  const [sent, setSent] = useState(false);
  if (!c.enabled) return null;

  const field =
    "w-full border-b border-bark-900/20 bg-transparent py-3 text-[14px] outline-none transition-colors placeholder:text-bark-700/40 focus:border-bark-800";
  const label = "block text-[10px] tracking-[0.2em] text-clay-600 uppercase";

  return (
    <Section id="join" className="bg-sand-100">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow className="text-clay-600">
              <T path="join.eyebrow" />
            </Eyebrow>
            <SectionTitle className="mt-7">
              <T path="join.title" className="block whitespace-pre-line" />
            </SectionTitle>
            <T path="join.intro" as="p" className="mt-6 text-[15px] leading-[1.9] text-bark-700" />
          </Reveal>

          <Reveal delay={80} className="mt-10 space-y-3.5 text-[14px]">
            {c.bullets.map((_, i) => (
              <div key={i} className="group/item relative flex gap-3">
                <span className="text-clay-500">—</span>
                <T path={`join.bullets.${i}`} />
                <ItemTools path="join.bullets" index={i} />
              </div>
            ))}
            <AddItem path="join.bullets" label="bullet" />
          </Reveal>

          <Reveal
            delay={140}
            className="mt-10 flex items-center gap-4 border border-bark-900/15 px-6 py-5"
          >
            <T path="join.spots" as="div" className="font-display text-4xl font-light" />
            <T
              path="join.spotsLabel"
              as="div"
              className="text-[11px] tracking-[0.18em] text-clay-600 uppercase"
            />
          </Reveal>

          <Reveal delay={180} className="mt-12">
            <T path="join.benefitsTitle" as="h3" className="font-display text-2xl font-light" />
            <ul className="mt-6 space-y-3.5 text-[13.5px] leading-relaxed text-bark-700">
              {c.benefits.map((_, i) => (
                <li key={i} className="group/item relative flex gap-3">
                  <span className="text-clay-500">—</span>
                  <T path={`join.benefits.${i}`} />
                  <ItemTools path="join.benefits" index={i} />
                </li>
              ))}
            </ul>
            <AddItem path="join.benefits" label="benefit" className="mt-5" />
          </Reveal>
        </div>

        <Reveal delay={100} className="border border-bark-900/12 bg-sand-50 p-8 sm:p-10">
          {sent && !editMode ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
              <div className="t-brand font-display text-4xl">{brand}</div>
              <T path="join.thanksTitle" as="h3" className="mt-10 font-display text-3xl font-light" />
              <T
                path="join.thanksBody"
                as="p"
                className="mt-4 max-w-xs text-[14px] leading-relaxed text-bark-700"
              />
              <button
                onClick={() => setSent(false)}
                className="mt-8 text-[10px] tracking-[0.22em] text-clay-600 uppercase underline underline-offset-4"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-7"
            >
              <T path="join.formTitle" as="div" className="text-[10px] tracking-luxe text-clay-600 uppercase" />
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="fn">First name *</label>
                  <input id="fn" required className={field} placeholder="Juan" />
                </div>
                <div>
                  <label className={label} htmlFor="ln">Last name *</label>
                  <input id="ln" required className={field} placeholder="Dela Cruz" />
                </div>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="em">Email *</label>
                  <input id="em" type="email" required className={field} placeholder="you@email.com" />
                </div>
                <div>
                  <label className={label} htmlFor="ph">Phone *</label>
                  <input id="ph" required className={field} placeholder="+63 900 000 0000" />
                </div>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="co">Country *</label>
                  <input id="co" required className={field} placeholder="Philippines" />
                </div>
                <div>
                  <label className={label} htmlFor="ti">Tier of interest</label>
                  <select id="ti" className={`${field} appearance-none`}>
                    {[...tiers.map((t) => t.name), "Undecided"].map((t, i) => (
                      <option key={i}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={label} htmlFor="hd">How did you hear about us?</label>
                <input id="hd" className={field} placeholder="A friend, Instagram, an article…" />
              </div>
              <div>
                <label className={label} htmlFor="ms">Message (optional)</label>
                <textarea
                  id="ms"
                  rows={3}
                  className={`${field} resize-none`}
                  placeholder="Tell us about the way you travel."
                />
              </div>
              <button
                type="submit"
                className="t-btn w-full border border-bark-800 bg-bark-800 py-4 text-sand-50 transition-colors duration-300 hover:bg-transparent hover:text-bark-800"
              >
                <T path="join.submitLabel" />
              </button>
              <T path="join.formNote" as="p" className="text-[11px] leading-relaxed text-bark-700/55" />
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

export function Faq() {
  const c = useContent().faq;
  const { editMode } = useSite();
  const [open, setOpen] = useState<number | null>(0);
  if (!c.enabled) return null;
  return (
    <Section className="bg-sand-50">
      <div className="grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <Eyebrow className="text-clay-600">
            <T path="faq.eyebrow" />
          </Eyebrow>
          <SectionTitle className="mt-7">
            <T path="faq.title" className="block whitespace-pre-line" />
          </SectionTitle>
        </Reveal>
        <div className="md:col-span-8">
          {c.items.map((_, i) => (
            <Reveal key={i} delay={i * 40} className="group/item relative border-b border-bark-900/12">
              <ItemTools path="faq.items" index={i} />
              <div className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <T
                  path={`faq.items.${i}.q`}
                  className="flex-1 font-display text-xl font-light md:text-[1.4rem]"
                />
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className={`relative h-3 w-3 shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-45" : ""
                  }`}
                  aria-label="Toggle"
                >
                  <span className="absolute top-1/2 left-0 h-px w-3 bg-bark-800" />
                  <span className="absolute top-0 left-1/2 h-3 w-px bg-bark-800" />
                </button>
              </div>
              <div
                className={`grid transition-all duration-500 ${
                  open === i || editMode
                    ? "grid-rows-[1fr] pb-7 opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <T
                  path={`faq.items.${i}.a`}
                  as="p"
                  className="overflow-hidden pr-10 text-[14px] leading-[1.9] text-bark-700"
                />
              </div>
            </Reveal>
          ))}
          <AddItem path="faq.items" label="question" className="mt-5" />
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  const c = useContent().footer;
  const { editMode } = useSite();
  return (
    <footer id="legal" className="bg-bark-900 px-6 pt-24 pb-12 text-sand-200/70 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <T
              path="footer.brand"
              as="div"
              className="t-brand font-display text-3xl text-sand-100"
            />
            <T
              path="footer.tagline"
              as="div"
              className="mt-4 text-[9px] tracking-[0.4em] indent-[0.4em] uppercase opacity-70"
            />
          </div>
          {c.groups.map((g, gi) => (
            <div key={gi} className="group/item relative md:col-span-2">
              <ItemTools path="footer.groups" index={gi} />
              <T
                path={`footer.groups.${gi}.title`}
                as="div"
                className="text-[10px] tracking-[0.22em] text-sand-300 uppercase"
              />
              <ul className="mt-5 space-y-3 text-[13px]">
                {g.items.map((it, i) => (
                  <li key={i} className="group/item relative">
                    <a
                      href={editMode ? undefined : it.href}
                      className="transition-colors hover:text-sand-100"
                    >
                      <T path={`footer.groups.${gi}.items.${i}.label`} />
                    </a>
                    <ItemTools path={`footer.groups.${gi}.items`} index={i} />
                  </li>
                ))}
              </ul>
              <AddItem path={`footer.groups.${gi}.items`} label="link" className="mt-4" />
            </div>
          ))}
          <div className="md:col-span-3">
            <T
              path="footer.contactTitle"
              as="div"
              className="text-[10px] tracking-[0.22em] text-sand-300 uppercase"
            />
            <ul className="mt-5 space-y-3 text-[13px]">
              {c.contacts.map((x, i) => (
                <li key={i} className="group/item relative">
                  {!editMode && x.includes("@") ? (
                    <a href={`mailto:${x}`} className="hover:text-sand-100">
                      {x}
                    </a>
                  ) : (
                    <T path={`footer.contacts.${i}`} />
                  )}
                  <ItemTools path="footer.contacts" index={i} />
                </li>
              ))}
            </ul>
            <AddItem path="footer.contacts" label="contact" className="mt-4" />
          </div>
        </div>

        <div className="mt-20 space-y-5 border-t border-sand-100/15 pt-10 text-[11px] leading-[1.85] text-sand-200/45">
          {c.legal.map((_, i) => (
            <p key={i} className="group/item relative">
              <T
                path={`footer.legal.${i}.label`}
                className="text-sand-200/70"
                placeholder="label…"
              />{" "}
              <T path={`footer.legal.${i}.body`} />
              <ItemTools path="footer.legal" index={i} />
            </p>
          ))}
          <AddItem path="footer.legal" label="legal paragraph" />
        </div>

        <div className="mt-10 flex flex-col gap-3 text-[11px] tracking-wide text-sand-200/45 sm:flex-row sm:items-center sm:justify-between">
          <T path="footer.bottomLeft" />
          <T path="footer.bottomRight" />
        </div>
      </div>
    </footer>
  );
}

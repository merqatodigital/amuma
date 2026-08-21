import { useState } from "react";
import { peso } from "../content";
import { useContent, useSite } from "../store";
import { Eyebrow, Reveal, Section, SectionTitle } from "../components/site-ui";
import { AddItem, ItemTools, T } from "../admin/Editable";

/** Number that becomes an input in edit mode. */
function N({
  path,
  className = "",
  format,
}: {
  path: string;
  className?: string;
  format?: (n: number) => string;
}) {
  const { content, update, editMode } = useSite();
  const raw = path.split(".").reduce<unknown>((a, k) => (a == null ? a : (a as never)[k]), content);
  const num = Number(raw ?? 0);
  if (!editMode)
    return <span className={className}>{format ? format(num) : num.toLocaleString()}</span>;
  return (
    <input
      type="number"
      value={num}
      onChange={(e) => update(path, Number(e.target.value))}
      className={`${className} w-full max-w-[9ch] rounded-[2px] bg-sky-500/10 text-inherit outline-dashed outline-1 outline-offset-2 outline-sky-500/60 focus:outline-2 focus:outline-sky-500`}
    />
  );
}

export function Tiers() {
  const c = useContent().tiers;
  const memberUnits = useContent().calculator.memberUnits || 1;
  const { editMode } = useSite();
  if (!c.enabled) return null;
  return (
    <Section id="model" className="bg-sand-100">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="tiers.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="tiers.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T path="tiers.intro" as="p" className="mt-7 text-[15px] leading-[1.9] text-bark-700" />
      </Reveal>

      <div className="mt-14 grid gap-px bg-bark-900/10 md:grid-cols-2 lg:grid-cols-4">
        {c.items.map((t, i) => (
          <Reveal
            key={i}
            delay={i * 80}
            className="group/item relative flex flex-col bg-sand-50 p-8 transition-colors duration-500 hover:bg-white"
          >
            <ItemTools path="tiers.items" index={i} />
            {(t.note || editMode) && (
              <T
                path={`tiers.items.${i}.note`}
                className="absolute top-0 right-0 bg-bark-800 px-3 py-1.5 text-[9px] tracking-[0.18em] text-sand-100 uppercase"
                placeholder="badge…"
              />
            )}
            <div className="text-[10px] tracking-luxe text-clay-600 uppercase">Tier</div>
            <T
              path={`tiers.items.${i}.name`}
              as="div"
              className="mt-3 font-display text-4xl font-light"
            />
            <div className="mt-6 font-display text-2xl">
              <N path={`tiers.items.${i}.investment`} format={peso} />
            </div>
            <div className="mt-8 space-y-3 border-t border-bark-900/10 pt-6 text-[13px]">
              <div className="flex justify-between gap-3">
                <span className="text-bark-700/70">Circle Units</span>
                <N path={`tiers.items.${i}.units`} className="text-right" />
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-bark-700/70">Annual Pebbles</span>
                <N path={`tiers.items.${i}.pebbles`} className="text-right" />
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-bark-700/70">Member pool share</span>
                <span>{((t.units / memberUnits) * 100).toFixed(2)}%</span>
              </div>
            </div>
            <a
              href={editMode ? undefined : "#join"}
              className="t-btn mt-8 border border-bark-800/30 py-3 text-center transition-colors duration-300 hover:border-bark-800 hover:bg-bark-800 hover:text-sand-50"
            >
              <T path="tiers.ctaLabel" />
            </a>
          </Reveal>
        ))}
      </div>
      <AddItem path="tiers.items" label="tier" className="mt-4" />
    </Section>
  );
}

function SeasonTable({
  titlePath,
  base,
  head,
  format,
}: {
  titlePath: string;
  base: string;
  head: string;
  format?: (n: number) => string;
}) {
  return (
    <div>
      <T path={titlePath} as="h3" className="font-display text-2xl font-light" />
      <table className="mt-5 w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-current/20 text-[10px] tracking-[0.18em] uppercase opacity-60">
            <th className="pb-3 text-left font-normal">Season</th>
            <th className="pb-3 text-right font-normal">{head}</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Low season", "Low"],
            ["High season", "High"],
            ["Peak season", "Peak"],
          ].map(([label, key]) => (
            <tr key={key} className="border-b border-current/10">
              <td className="py-4 text-left">{label}</td>
              <td className="py-4 text-right font-display text-lg">
                <N path={`${base}${key}`} format={format} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Usage() {
  const c = useContent().usage;
  if (!c.enabled) return null;
  return (
    <Section className="bg-sand-50">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="usage.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="usage.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T path="usage.intro" as="p" className="mt-7 text-[15px] leading-[1.9] text-bark-700" />
      </Reveal>

      <div className="mt-14 grid gap-14 md:grid-cols-2">
        <Reveal>
          <SeasonTable titlePath="usage.suiteTitle" base="usage.suite" head="Pebbles / night" />
        </Reveal>
        <Reveal delay={100}>
          <SeasonTable titlePath="usage.villaTitle" base="usage.villa" head="Pebbles / night" />
        </Reveal>
      </div>
    </Section>
  );
}

export function Revenue() {
  const c = useContent().revenue;
  if (!c.enabled) return null;
  return (
    <Section dark>
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-sand-300">
          <T path="revenue.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="revenue.title" className="block whitespace-pre-line" />
        </SectionTitle>
        <T
          path="revenue.intro"
          as="p"
          className="mt-7 text-[15px] leading-[1.9] text-sand-200/80"
        />
      </Reveal>

      <Reveal delay={80} className="mt-14">
        <T path="revenue.ratesTitle" as="h3" className="font-display text-2xl font-light" />
        <table className="mt-5 w-full text-[13.5px]">
          <thead>
            <tr className="border-b border-current/20 text-[10px] tracking-[0.18em] uppercase opacity-60">
              {["", "Low season", "High season", "Peak season"].map((h, i) => (
                <th key={i} className={`pb-3 font-normal ${i === 0 ? "text-left" : "text-right"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Suite", "suite"],
              ["Villa", "villa"],
            ].map(([label, key]) => (
              <tr key={key} className="border-b border-current/10">
                <td className="py-4 text-left">{label}</td>
                {["Low", "High", "Peak"].map((s) => (
                  <td key={s} className="py-4 text-right font-display text-lg">
                    <N path={`revenue.${key}${s}`} format={peso} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <T path="revenue.ratesNote" as="p" className="mt-4 text-[12px] text-sand-200/60" />
      </Reveal>

      <div className="mt-16 grid gap-px bg-sand-100/15 md:grid-cols-3">
        {c.splits.map((_, i) => (
          <Reveal key={i} delay={i * 90} className="group/item relative bg-bark-900 p-9">
            <ItemTools path="revenue.splits" index={i} />
            <T
              path={`revenue.splits.${i}.value`}
              as="div"
              className="font-display text-6xl font-light"
            />
            <T
              path={`revenue.splits.${i}.label`}
              as="div"
              className="mt-3 text-[11px] tracking-[0.2em] text-sand-300 uppercase"
            />
            <T
              path={`revenue.splits.${i}.note`}
              as="p"
              className="mt-4 text-[12.5px] leading-relaxed text-sand-200/60"
              placeholder="optional note…"
            />
          </Reveal>
        ))}
      </div>
      <AddItem path="revenue.splits" label="split" className="mt-4" />

      <Reveal
        delay={120}
        className="mt-16 border-t border-sand-100/20 pt-10 md:flex md:items-end md:justify-between"
      >
        <div>
          <Eyebrow className="text-sand-300">
            <T path="revenue.returnsEyebrow" />
          </Eyebrow>
          <T
            path="revenue.returnsBody"
            as="p"
            className="mt-5 max-w-md text-[14px] leading-[1.85] text-sand-200/70"
          />
        </div>
        <div className="mt-8 md:mt-0 md:text-right">
          <T
            path="revenue.roi"
            as="div"
            className="font-display text-[clamp(3.5rem,10vw,6.5rem)] leading-none font-light"
          />
          <T
            path="revenue.roiLabel"
            as="div"
            className="mt-2 text-[11px] tracking-[0.22em] text-sand-300 uppercase"
          />
        </div>
      </Reveal>
    </Section>
  );
}

export function Flywheel() {
  const c = useContent().flywheel;
  if (!c.enabled) return null;
  return (
    <Section className="bg-sand-100">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="flywheel.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="flywheel.title" className="block whitespace-pre-line" />
        </SectionTitle>
      </Reveal>
      <div className="mt-14 flex flex-wrap items-stretch gap-3">
        {c.steps.map((_, i) => (
          <Reveal
            key={i}
            delay={i * 80}
            className="group/item relative flex flex-1 basis-[240px] items-center gap-4 border border-bark-900/12 bg-sand-50 px-6 py-6"
          >
            <ItemTools path="flywheel.steps" index={i} />
            <span className="font-display text-2xl text-clay-500">{i + 1}</span>
            <T path={`flywheel.steps.${i}`} className="text-[13.5px] leading-snug" />
          </Reveal>
        ))}
      </div>
      <AddItem path="flywheel.steps" label="step" className="mt-4" />
      <Reveal delay={200}>
        <T path="flywheel.note" as="p" className="mt-8 text-[14px] text-bark-700" />
      </Reveal>
    </Section>
  );
}

export function Calculator() {
  const { calculator: c, tiers } = useContent();
  const [idx, setIdx] = useState(0);
  if (!c.enabled || tiers.items.length === 0) return null;

  const tier = tiers.items[Math.min(idx, tiers.items.length - 1)];
  const ownership = (tier.units / (c.memberUnits || 1)) * 100;
  const low = Math.round((tier.investment * c.roiLow) / 100);
  const high = Math.round((tier.investment * c.roiHigh) / 100);
  const nights = Math.round(tier.pebbles / (c.avgNightPebbles || 200));

  return (
    <Section id="calculator" className="bg-sand-50">
      <Reveal className="max-w-2xl">
        <Eyebrow className="text-clay-600">
          <T path="calculator.eyebrow" />
        </Eyebrow>
        <SectionTitle className="mt-7">
          <T path="calculator.title" className="block whitespace-pre-line" />
        </SectionTitle>
      </Reveal>

      <Reveal delay={80} className="mt-12 flex flex-wrap gap-3">
        {tiers.items.map((t, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`t-btn border px-7 py-3 transition-all duration-300 ${
              i === idx
                ? "border-bark-800 bg-bark-800 text-sand-50"
                : "border-bark-900/20 hover:border-bark-800"
            }`}
          >
            {t.name}
          </button>
        ))}
      </Reveal>

      <div className="mt-10 grid gap-px bg-bark-900/10 lg:grid-cols-3">
        <div className="bg-sand-100 p-9 lg:col-span-1">
          <div className="text-[10px] tracking-luxe text-clay-600 uppercase">Investment</div>
          <div className="mt-4 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-none font-light">
            {peso(tier.investment)}
          </div>
          <div className="mt-8 space-y-5 border-t border-bark-900/10 pt-7 text-[13px]">
            <div className="flex items-baseline justify-between">
              <span className="text-bark-700/70">Circle Units</span>
              <span className="font-display text-2xl">{tier.units}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-bark-700/70">Ownership of member pool</span>
              <span className="font-display text-2xl">{ownership.toFixed(2)}%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-bark-700/70">Annual Pebbles</span>
              <span className="font-display text-2xl">{Number(tier.pebbles).toLocaleString()}</span>
            </div>
          </div>
          <p className="mt-7 flex flex-wrap items-baseline gap-x-1 text-[11.5px] leading-relaxed text-bark-700/60">
            Total: <N path="calculator.totalUnits" /> units · Available to members:{" "}
            <N path="calculator.memberUnits" /> units.
          </p>
        </div>

        <div className="grid gap-px bg-bark-900/10 sm:grid-cols-2 lg:col-span-2">
          <div className="bg-sand-100 p-9">
            <div className="text-[10px] tracking-luxe text-clay-600 uppercase">
              Est. annual return (low)
            </div>
            <div className="mt-4 font-display text-4xl font-light">{peso(low)}</div>
          </div>
          <div className="bg-sand-100 p-9">
            <div className="text-[10px] tracking-luxe text-clay-600 uppercase">
              Est. annual return (high)
            </div>
            <div className="mt-4 font-display text-4xl font-light">{peso(high)}</div>
          </div>
          <div className="bg-sand-100 p-9">
            <div className="text-[10px] tracking-luxe text-clay-600 uppercase">
              Experience value
            </div>
            <div className="mt-4 font-display text-4xl font-light">~{nights} nights</div>
            <T
              path="calculator.experienceNote"
              as="p"
              className="mt-4 text-[12.5px] leading-relaxed text-bark-700/70"
            />
          </div>
          <div className="bg-bark-800 p-9 text-sand-100">
            <div className="text-[10px] tracking-luxe text-sand-300 uppercase">Projected ROI</div>
            <div className="mt-4 flex items-baseline gap-1 font-display text-4xl font-light">
              <N path="calculator.roiLow" />–<N path="calculator.roiHigh" />%
            </div>
            <T
              path="calculator.roiNote"
              as="p"
              className="mt-4 text-[12.5px] leading-relaxed text-sand-200/70"
            />
          </div>
        </div>
      </div>

      <Reveal delay={100} className="mt-10 border border-bark-900/12 bg-sand-100 p-9">
        <T
          path="calculator.summaryTitle"
          as="div"
          className="text-[10px] tracking-luxe text-clay-600 uppercase"
        />
        <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Investment", peso(tier.investment)],
            ["Circle Units", String(tier.units)],
            ["Annual Pebbles", Number(tier.pebbles).toLocaleString()],
            ["Projected return", `${peso(low)} – ${peso(high)}`],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[10px] tracking-[0.18em] text-bark-700/60 uppercase">{l}</div>
              <div className="mt-2 font-display text-2xl font-light">{v}</div>
            </div>
          ))}
        </div>
        <T
          path="calculator.disclaimer"
          as="p"
          className="mt-8 text-[12px] leading-relaxed text-bark-700/60"
        />
      </Reveal>
    </Section>
  );
}

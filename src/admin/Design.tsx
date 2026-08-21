import { useEffect, useMemo, useState } from "react";
import { useSite } from "../store";
import { FONTS, loadFontPreviews } from "./fonts";

/* --------------------------------------------------------------- presets */

type Palette = Record<string, string>;

export const PALETTES: { name: string; note: string; colors: Palette }[] = [
  {
    name: "Amuma Sand",
    note: "Original · ivory & bark",
    colors: {
      sand50: "#fbf9f5", sand100: "#f5f0e7", sand200: "#ebe3d5", sand300: "#dbcfba",
      sand400: "#c4b092", clay500: "#a08863", clay600: "#7d6748",
      bark700: "#4a4034", bark800: "#332d25", bark900: "#221e19",
    },
  },
  {
    name: "Lagoon",
    note: "Cool sea greens",
    colors: {
      sand50: "#f6faf9", sand100: "#e9f2f0", sand200: "#d6e6e3", sand300: "#b3d1cc",
      sand400: "#84b3ac", clay500: "#4e8b84", clay600: "#376d67",
      bark700: "#2b4b47", bark800: "#1d3532", bark900: "#122320",
    },
  },
  {
    name: "Volcanic",
    note: "Charcoal & warm ash",
    colors: {
      sand50: "#f7f6f4", sand100: "#eceae6", sand200: "#dcd8d2", sand300: "#c2bcb3",
      sand400: "#a09890", clay500: "#7d746c", clay600: "#5d554e",
      bark700: "#3d3833", bark800: "#272320", bark900: "#171412",
    },
  },
  {
    name: "Sunset Clay",
    note: "Terracotta & rose",
    colors: {
      sand50: "#fdf8f5", sand100: "#f8ebe4", sand200: "#f0d9cd", sand300: "#e0b8a4",
      sand400: "#cd9077", clay500: "#b06a4d", clay600: "#8d4f36",
      bark700: "#5f3626", bark800: "#40251a", bark900: "#2a1811",
    },
  },
  {
    name: "Midnight Palm",
    note: "Deep green & gold",
    colors: {
      sand50: "#f8faf6", sand100: "#eef2e9", sand200: "#dde5d4", sand300: "#bfcdb0",
      sand400: "#9aae86", clay500: "#c2a15c", clay600: "#96793e",
      bark700: "#2f4030", bark800: "#1d2a1f", bark900: "#111a13",
    },
  },
  {
    name: "Pearl",
    note: "Cool minimal greys",
    colors: {
      sand50: "#fafafa", sand100: "#f2f2f3", sand200: "#e5e5e7", sand300: "#cbcbd0",
      sand400: "#a6a6ad", clay500: "#7c7c85", clay600: "#5c5c65",
      bark700: "#3c3c44", bark800: "#26262c", bark900: "#151518",
    },
  },
];

export const FONT_PAIRS = [
  { name: "Classic Coastal", display: "Cormorant Garamond", body: "Jost" },
  { name: "Editorial", display: "Playfair Display", body: "Inter" },
  { name: "Couture", display: "Italiana", body: "Montserrat" },
  { name: "Gallery", display: "Tenor Sans", body: "Work Sans" },
  { name: "Modern Luxe", display: "Bodoni Moda", body: "DM Sans" },
  { name: "Contemporary", display: "Instrument Serif", body: "Manrope" },
  { name: "Carved Stone", display: "Cinzel", body: "Urbanist" },
  { name: "Soft Warmth", display: "Fraunces", body: "Figtree" },
];

/* ----------------------------------------------------------------- atoms */

const box =
  "rounded-md border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white outline-none focus:border-white/45";

const read = (obj: unknown, path: string) =>
  path.split(".").reduce<unknown>((a, k) => (a == null ? a : (a as never)[k]), obj);

function Slider({
  label,
  path,
  min,
  max,
  step = 1,
  suffix = "",
}: {
  label: string;
  path: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  const { content, update } = useSite();
  const v = Number(read(content, path) ?? 0);
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[10px] tracking-[0.14em] text-white/40 uppercase">
        {label}
        <span className="text-white/70">
          {v}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => update(path, Number(e.target.value))}
        className="w-full accent-sky-400"
      />
    </label>
  );
}

function Choice({
  label,
  path,
  options,
}: {
  label: string;
  path: string;
  options: { value: string | number; label: string }[];
}) {
  const { content, update } = useSite();
  const v = read(content, path);
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-white/40 uppercase">
        {label}
      </span>
      <select
        value={String(v)}
        onChange={(e) => {
          const raw = e.target.value;
          update(path, /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw);
        }}
        className={`${box} w-full`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#191612]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const WEIGHTS = [200, 300, 400, 500, 600, 700].map((w) => ({ value: w, label: String(w) }));
const TRANSFORMS = [
  { value: "none", label: "Normal" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

function FontSelect({ path }: { path: string }) {
  const { content, update } = useSite();
  const value = String(read(content, path) ?? "");
  const [open, setOpen] = useState(false);
  useEffect(() => loadFontPreviews(), []);
  const groups = useMemo(() => {
    const g: Record<string, typeof FONTS> = {};
    FONTS.forEach((f) => (g[f.group] = [...(g[f.group] || []), f]));
    return g;
  }, []);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-left hover:border-white/35"
      >
        <span className="text-[17px] text-white" style={{ fontFamily: `"${value}"` }}>
          {value}
        </span>
        <span className="text-[9px] text-white/40">{open ? "CLOSE" : "CHANGE"}</span>
      </button>
      {open && (
        <div className="mt-2 max-h-72 overflow-y-auto rounded-md border border-white/15 bg-black/40">
          {Object.entries(groups).map(([group, list]) => (
            <div key={group}>
              <div className="sticky top-0 bg-[#151311] px-3 py-2 text-[9px] tracking-[0.2em] text-white/35 uppercase">
                {group}
              </div>
              {list.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    update(path, f.name);
                    setOpen(false);
                  }}
                  className={`flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left hover:bg-white/10 ${
                    f.name === value ? "bg-white/10" : ""
                  }`}
                >
                  <span className="text-[18px] text-white" style={{ fontFamily: `"${f.name}"` }}>
                    {f.name}
                  </span>
                  <span className="shrink-0 text-[9px] text-white/30">{f.note}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-white/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-[10px] tracking-[0.18em] text-white/50 uppercase">{title}</span>
        <span className="text-[9px] text-white/30">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="space-y-3 border-t border-white/10 p-3">{children}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------- panel */

export default function Design() {
  const { content, update } = useSite();
  const theme = content.theme;

  return (
    <div className="space-y-4">
      <Group title="Colour palette">
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((p) => {
            const active = p.colors.bark900 === theme.colors.bark900;
            return (
              <button
                key={p.name}
                onClick={() => update("theme.colors", { ...theme.colors, ...p.colors })}
                className={`rounded-md border p-2 text-left transition-colors ${
                  active ? "border-sky-400 bg-sky-500/10" : "border-white/12 hover:border-white/35"
                }`}
              >
                <div className="flex gap-1">
                  {["sand100", "sand300", "clay500", "bark700", "bark900"].map((k) => (
                    <span
                      key={k}
                      className="h-5 flex-1 rounded-[2px]"
                      style={{ background: p.colors[k] }}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-white/85">{p.name}</div>
                <div className="text-[9px] text-white/35">{p.note}</div>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Fine-tune colours">
        {Object.entries(theme.colors).map(([k, v]) => (
          <label key={k} className="flex items-center gap-3">
            <input
              type="color"
              value={v as string}
              onChange={(e) => update(`theme.colors.${k}`, e.target.value)}
              className="h-8 w-10 shrink-0 cursor-pointer rounded border border-white/15 bg-transparent"
            />
            <span className="w-16 shrink-0 text-[10px] tracking-wide text-white/45 uppercase">
              {k}
            </span>
            <input
              className={`${box} flex-1`}
              value={v as string}
              onChange={(e) => update(`theme.colors.${k}`, e.target.value)}
            />
          </label>
        ))}
        <p className="text-[10px] leading-relaxed text-white/30">
          Sand = backgrounds · Clay = accents and labels · Bark = text and dark sections.
        </p>
      </Group>

      <Group title="Font pairing">
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIRS.map((p) => {
            const active = p.display === theme.displayFont && p.body === theme.bodyFont;
            return (
              <button
                key={p.name}
                onClick={() => {
                  update("theme.displayFont", p.display);
                  update("theme.bodyFont", p.body);
                }}
                className={`rounded-md border p-2.5 text-left transition-colors ${
                  active ? "border-sky-400 bg-sky-500/10" : "border-white/12 hover:border-white/35"
                }`}
              >
                <div
                  className="text-[20px] leading-tight text-white"
                  style={{ fontFamily: `"${p.display}"` }}
                >
                  Aa
                </div>
                <div
                  className="mt-1 text-[10px] text-white/60"
                  style={{ fontFamily: `"${p.body}"` }}
                >
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Headings — display font">
        <FontSelect path="theme.displayFont" />
        <Slider label="Size" path="theme.headingScale" min={0.7} max={1.6} step={0.05} suffix="×" />
        <Choice label="Weight" path="theme.type.heading.weight" options={WEIGHTS} />
        <Slider
          label="Letter-spacing"
          path="theme.type.heading.tracking"
          min={-0.05}
          max={0.3}
          step={0.01}
          suffix="em"
        />
        <Choice label="Case" path="theme.type.heading.transform" options={TRANSFORMS} />
      </Group>

      <Group title="Brand wordmark — nav, hero, footer">
        <Choice label="Weight" path="theme.type.brand.weight" options={WEIGHTS} />
        <Slider
          label="Letter-spacing"
          path="theme.type.brand.tracking"
          min={0}
          max={0.6}
          step={0.01}
          suffix="em"
        />
        <Choice label="Case" path="theme.type.brand.transform" options={TRANSFORMS} />
      </Group>

      <Group title="Body text">
        <FontSelect path="theme.bodyFont" />
        <Choice label="Weight" path="theme.type.body.weight" options={WEIGHTS} />
        <Slider label="Line height" path="theme.type.body.lineHeight" min={1.3} max={2.4} step={0.05} />
      </Group>

      <Group title="Eyebrow labels">
        <Slider label="Size" path="theme.type.eyebrow.size" min={8} max={16} suffix="px" />
        <Choice label="Weight" path="theme.type.eyebrow.weight" options={WEIGHTS} />
        <Slider
          label="Letter-spacing"
          path="theme.type.eyebrow.tracking"
          min={0}
          max={0.6}
          step={0.01}
          suffix="em"
        />
        <Choice label="Case" path="theme.type.eyebrow.transform" options={TRANSFORMS} />
      </Group>

      <Group title="Buttons">
        <Slider label="Size" path="theme.type.button.size" min={9} max={18} suffix="px" />
        <Choice label="Weight" path="theme.type.button.weight" options={WEIGHTS} />
        <Slider
          label="Letter-spacing"
          path="theme.type.button.tracking"
          min={0}
          max={0.5}
          step={0.01}
          suffix="em"
        />
        <Choice label="Case" path="theme.type.button.transform" options={TRANSFORMS} />
      </Group>

      <Group title="Navigation links">
        <Slider label="Size" path="theme.type.nav.size" min={9} max={18} suffix="px" />
        <Choice label="Weight" path="theme.type.nav.weight" options={WEIGHTS} />
        <Slider
          label="Letter-spacing"
          path="theme.type.nav.tracking"
          min={0}
          max={0.5}
          step={0.01}
          suffix="em"
        />
        <Choice label="Case" path="theme.type.nav.transform" options={TRANSFORMS} />
      </Group>

      {/* live preview */}
      <div
        className="rounded-lg border border-white/10 p-4"
        style={{ background: theme.colors.sand50 }}
      >
        <div className="t-eyebrow" style={{ color: theme.colors.clay600 }}>
          01 — Preview
        </div>
        <div
          className="t-heading mt-3 text-3xl"
          style={{ color: theme.colors.bark900, fontFamily: `"${theme.displayFont}"` }}
        >
          A new way of traveling
        </div>
        <p
          className="t-body mt-3 text-[13px]"
          style={{ color: theme.colors.bark700, fontFamily: `"${theme.bodyFont}"` }}
        >
          Hidden coastlines and untouched islands, where beauty is discovered rather than
          manufactured.
        </p>
        <span
          className="t-btn mt-4 inline-block border px-6 py-2.5"
          style={{ borderColor: theme.colors.bark800, color: theme.colors.bark800 }}
        >
          Join the Circle
        </span>
      </div>
    </div>
  );
}

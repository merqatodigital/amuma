import { useState } from "react";
import { useSite } from "../store";
import { blankCustom, defaultContent, type SectionRef } from "../content";

const BUILT_IN: { type: string; label: string }[] = [
  { type: "vision", label: "Vision" },
  { type: "meaning", label: "Meaning" },
  { type: "circle", label: "The Circle" },
  { type: "hidden", label: "Hidden Destinations" },
  { type: "palawan", label: "First Chapter" },
  { type: "sanVicente", label: "San Vicente" },
  { type: "experience", label: "Experience" },
  { type: "future", label: "Future Destinations" },
  { type: "roadmap", label: "Roadmap" },
  { type: "tiers", label: "Investment Tiers" },
  { type: "usage", label: "Accommodation Usage" },
  { type: "revenue", label: "Revenue Model" },
  { type: "flywheel", label: "Flywheel" },
  { type: "calculator", label: "Calculator" },
  { type: "team", label: "Team" },
  { type: "portal", label: "Member Portal" },
  { type: "join", label: "Join / Form" },
  { type: "faq", label: "FAQ" },
];

const LAYOUTS = [
  { value: "imageRight", label: "Text + image right" },
  { value: "imageLeft", label: "Text + image left" },
  { value: "text", label: "Text only" },
  { value: "banner", label: "Full-width banner" },
  { value: "cards", label: "Card grid" },
];

const TONES = [
  { value: "light", label: "Light" },
  { value: "muted", label: "Muted" },
  { value: "dark", label: "Dark" },
];

export default function SectionsManager({ onJump }: { onJump: (tab: string) => void }) {
  const { content, update, editMode, setEditMode } = useSite();
  const list = content.sections;
  const [adding, setAdding] = useState(false);

  const set = (next: SectionRef[]) => update("sections", next);

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const n = [...list];
    [n[i], n[j]] = [n[j], n[i]];
    set(n);
  };

  const remove = (i: number) => {
    const s = list[i];
    const msg =
      s.type === "custom"
        ? "Delete this section and its content permanently?"
        : "Remove this section from the page? You can add it back later — its content is kept.";
    if (!confirm(msg)) return;
    set(list.filter((_, x) => x !== i));
    if (s.type === "custom") {
      const nextCustom = { ...content.custom };
      delete nextCustom[s.id];
      update("custom", nextCustom);
    }
  };

  const addCustom = () => {
    const n = Object.keys(content.custom).length + 1;
    const id = `custom${Date.now().toString(36).slice(-5)}`;
    update("custom", { ...content.custom, [id]: blankCustom(n) });
    set([...list, { id, type: "custom", label: `New section ${n}`, enabled: true }]);
    setAdding(false);
    if (!editMode) setEditMode(true);
  };

  const addBuiltIn = (type: string, label: string) => {
    set([...list, { id: type, type, label, enabled: true }]);
    setAdding(false);
  };

  const missing = BUILT_IN.filter((b) => !list.some((s) => s.type === b.type));

  const chip =
    "flex h-6 w-6 items-center justify-center rounded border border-white/15 text-[11px] text-white/60 hover:bg-white/10";

  return (
    <div className="space-y-4">
      <p className="text-[10px] leading-relaxed text-white/35">
        Reorder, hide, delete or add sections. Everything renders in this order. Turn on
        <span className="text-sky-300"> Edit page </span>
        to rewrite the text of any section directly on the site.
      </p>

      <div className="space-y-2">
        {list.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-lg border p-3 transition-colors ${
              s.enabled
                ? "border-white/15 bg-white/[0.04]"
                : "border-white/8 bg-transparent opacity-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-[10px] text-white/25">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <input
                  value={s.label}
                  onChange={(e) => update(`sections.${i}.label`, e.target.value)}
                  className="w-full bg-transparent text-[13px] text-white outline-none"
                />
                <div className="text-[9px] tracking-wide text-white/30 uppercase">
                  {s.type === "custom" ? "Custom section" : s.type}
                </div>
              </div>

              <button
                title={s.enabled ? "Hide" : "Show"}
                onClick={() => update(`sections.${i}.enabled`, !s.enabled)}
                className={`h-5 w-9 shrink-0 rounded-full transition-colors ${
                  s.enabled ? "bg-emerald-400/80" : "bg-white/20"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                    s.enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
            </div>

            <div className="mt-2.5 flex items-center gap-1">
              <button title="Move up" className={chip} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button title="Move down" className={chip} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button
                onClick={() => onJump(s.type === "custom" ? `custom.${s.id}` : s.type)}
                className="rounded border border-white/15 px-2.5 py-1 text-[9px] tracking-[0.14em] text-white/70 uppercase hover:bg-white/10"
              >
                Edit content
              </button>
              <button
                onClick={() => remove(i)}
                className="ml-auto rounded border border-red-400/40 px-2.5 py-1 text-[9px] tracking-[0.14em] text-red-300 uppercase hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>

            {s.type === "custom" && content.custom[s.id] && (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <label className="block">
                  <span className="mb-1 block text-[9px] tracking-[0.14em] text-white/35 uppercase">
                    Layout
                  </span>
                  <select
                    value={content.custom[s.id].layout}
                    onChange={(e) => update(`custom.${s.id}.layout`, e.target.value)}
                    className="w-full rounded border border-white/15 bg-white/5 px-2 py-1.5 text-[11px] text-white"
                  >
                    {LAYOUTS.map((l) => (
                      <option key={l.value} value={l.value} className="bg-[#191612]">
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] tracking-[0.14em] text-white/35 uppercase">
                    Tone
                  </span>
                  <select
                    value={content.custom[s.id].tone}
                    onChange={(e) => update(`custom.${s.id}.tone`, e.target.value)}
                    className="w-full rounded border border-white/15 bg-white/5 px-2 py-1.5 text-[11px] text-white"
                  >
                    {TONES.map((l) => (
                      <option key={l.value} value={l.value} className="bg-[#191612]">
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="space-y-2 rounded-lg border border-white/15 p-3">
          <button
            onClick={addCustom}
            className="w-full rounded bg-sky-600 py-2.5 text-[10px] tracking-[0.16em] text-white uppercase hover:bg-sky-500"
          >
            + Blank custom section
          </button>
          {missing.length > 0 && (
            <>
              <div className="pt-1 text-[9px] tracking-[0.18em] text-white/30 uppercase">
                Restore a built-in section
              </div>
              {missing.map((b) => (
                <button
                  key={b.type}
                  onClick={() => addBuiltIn(b.type, b.label)}
                  className="w-full rounded border border-white/15 px-3 py-2 text-left text-[11px] text-white/75 hover:bg-white/10"
                >
                  {b.label}
                </button>
              ))}
            </>
          )}
          <button
            onClick={() => setAdding(false)}
            className="w-full rounded border border-white/12 py-2 text-[10px] tracking-[0.16em] text-white/50 uppercase hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full rounded border border-dashed border-white/25 py-3 text-[10px] tracking-[0.18em] text-white/65 uppercase hover:bg-white/5"
        >
          + Add section
        </button>
      )}

      <button
        onClick={() => {
          if (confirm("Restore the original section order and visibility?"))
            update("sections", defaultContent.sections);
        }}
        className="w-full rounded border border-white/12 py-2 text-[10px] tracking-[0.16em] text-white/45 uppercase hover:bg-white/5"
      >
        Reset section order
      </button>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "../store";
import { defaultContent } from "../content";
import { FONTS, loadFontPreviews } from "./fonts";
import { compressImage, downloadUrl } from "../lib/media";
import Design from "./Design";
import SectionsManager from "./Sections";

const PASSKEY = "5309";

const TABS: { key: string; label: string }[] = [
  { key: "__sections", label: "★ Sections — add / delete / order" },
  { key: "__design", label: "★ Design — colour & typography" },
  { key: "__media", label: "★ Media library" },
  { key: "nav", label: "Header" },
  { key: "hero", label: "Hero" },
  { key: "vision", label: "Vision" },
  { key: "meaning", label: "Meaning" },
  { key: "circle", label: "The Circle" },
  { key: "hidden", label: "Hidden Destinations" },
  { key: "palawan", label: "First Chapter" },
  { key: "sanVicente", label: "San Vicente" },
  { key: "experience", label: "Experience" },
  { key: "future", label: "Future Destinations" },
  { key: "roadmap", label: "Roadmap" },
  { key: "tiers", label: "Investment Tiers" },
  { key: "usage", label: "Accommodation Usage" },
  { key: "revenue", label: "Revenue Model" },
  { key: "flywheel", label: "Flywheel" },
  { key: "calculator", label: "Calculator" },
  { key: "team", label: "Team" },
  { key: "portal", label: "Member Portal" },
  { key: "join", label: "Join / Form" },
  { key: "faq", label: "FAQ" },
  { key: "footer", label: "Footer" },
];

const LABELS: Record<string, string> = {
  p1: "Paragraph 1",
  p2: "Paragraph 2",
  p3: "Paragraph 3",
  q: "Question",
  a: "Answer",
  ctaLabel: "Button label",
  ctaHref: "Button link",
  bannerTitle: "Banner title",
  bannerSub: "Banner subtitle",
  youtube: "YouTube URL",
  roi: "ROI headline",
  displayFont: "Display font",
  bodyFont: "Body font",
};

const pretty = (k: string) =>
  LABELS[k] ??
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const LONG = /body|bio|intro|note|disclaimer|answer|^a$|^p\d$|quote|subline|caption|closing/i;

/* --------------------------------------------------------------- inputs */

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/45";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-white/40 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function FontPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  useEffect(() => loadFontPreviews(), []);
  const groups = useMemo(() => {
    const g: Record<string, typeof FONTS> = {};
    FONTS.forEach((f) => (g[f.group] = [...(g[f.group] || []), f]));
    return g;
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-left hover:border-white/35"
      >
        <span className="text-[17px] text-white" style={{ fontFamily: `"${value}"` }}>
          {value}
        </span>
        <span className="text-[10px] text-white/40">{open ? "CLOSE" : "CHANGE"}</span>
      </button>
      {open && (
        <div className="mt-2 max-h-80 overflow-y-auto rounded-md border border-white/15 bg-black/40">
          {Object.entries(groups).map(([group, list]) => (
            <div key={group}>
              <div className="sticky top-0 bg-[#151311] px-3 py-2 text-[9px] tracking-[0.2em] text-white/35 uppercase">
                {group}
              </div>
              {list.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    onChange(f.name);
                    setOpen(false);
                  }}
                  className={`flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/10 ${
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

function MediaField({
  value,
  onChange,
  accept = "image/*",
  kind = "image",
}: {
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  kind?: "image" | "video";
}) {
  const { addFile, mediaUrl } = useSite();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const url = mediaUrl(value);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    const payload = kind === "image" ? await compressImage(file) : file;
    const blob =
      payload instanceof File ? payload : new File([payload], file.name, { type: payload.type });
    onChange(await addFile(blob));
    setBusy(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-white/15 bg-black/30">
          {url ? (
            kind === "video" ? (
              <video src={url} className="h-full w-full object-cover" muted />
            ) : (
              <img src={url} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-white/25">
              EMPTY
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <button
            onClick={() => ref.current?.click()}
            className="rounded border border-white/25 px-3 py-2 text-[10px] tracking-[0.14em] uppercase hover:bg-white/10"
          >
            {busy ? "Uploading…" : `Upload ${kind} from device`}
          </button>
          <div className="flex gap-2">
            {url && (
              <button
                onClick={() => downloadUrl(url, `amuma-${kind}`)}
                className="flex-1 rounded border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/70 uppercase hover:border-white/40"
              >
                Download
              </button>
            )}
            {value && (
              <button
                onClick={() => onChange("")}
                className="flex-1 rounded border border-white/10 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/50 uppercase hover:border-white/30"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <input
        className={inputCls}
        value={value.startsWith("idb:") ? "" : value}
        placeholder="…or paste an image URL"
        onChange={(e) => onChange(e.target.value)}
      />
      {value.startsWith("idb:") && (
        <p className="text-[10px] text-white/30">Stored on this device ({value})</p>
      )}
    </div>
  );
}

function MediaBlockField({ path, value }: { path: string; value: Record<string, string> }) {
  const { update } = useSite();
  const type = value.type;
  return (
    <div className="space-y-4 rounded-lg border border-white/12 bg-white/[0.03] p-3">
      <div className="flex gap-1.5">
        {(["image", "video", "youtube"] as const).map((t) => (
          <button
            key={t}
            onClick={() => update(`${path}.type`, t)}
            className={`flex-1 rounded border px-2 py-1.5 text-[10px] tracking-[0.12em] uppercase transition-colors ${
              type === t
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/60 hover:border-white/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {type === "image" && (
        <Row label="Image">
          <MediaField value={value.image} onChange={(v) => update(`${path}.image`, v)} />
        </Row>
      )}
      {type === "video" && (
        <Row label="Video file">
          <MediaField
            kind="video"
            accept="video/*"
            value={value.video}
            onChange={(v) => update(`${path}.video`, v)}
          />
        </Row>
      )}
      {type === "youtube" && (
        <Row label="YouTube URL">
          <input
            className={inputCls}
            value={value.youtube}
            placeholder="https://www.youtube.com/watch?v=…"
            onChange={(e) => update(`${path}.youtube`, e.target.value)}
          />
        </Row>
      )}
    </div>
  );
}

/* ------------------------------------------------------- recursive node */

function Node({ path, keyName, value }: { path: string; keyName: string; value: unknown }) {
  const { update } = useSite();
  const label = pretty(keyName);

  if (typeof value === "boolean")
    return (
      <div className="flex items-center justify-between rounded-md border border-white/12 px-3 py-2.5">
        <span className="text-[12px] text-white/80">{label}</span>
        <button
          onClick={() => update(path, !value)}
          className={`h-5 w-9 rounded-full transition-colors ${value ? "bg-emerald-400/80" : "bg-white/20"}`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white transition-transform ${
              value ? "translate-x-[18px]" : "translate-x-[2px]"
            }`}
          />
        </button>
      </div>
    );

  if (typeof value === "number")
    return (
      <Row label={label}>
        <input
          type="number"
          className={inputCls}
          value={value}
          onChange={(e) => update(path, Number(e.target.value))}
        />
      </Row>
    );

  if (typeof value === "string") {
    if (path.startsWith("theme.colors."))
      return (
        <Row label={label}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => update(path, e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-white/15 bg-transparent"
            />
            <input className={inputCls} value={value} onChange={(e) => update(path, e.target.value)} />
          </div>
        </Row>
      );

    if (keyName === "displayFont" || keyName === "bodyFont")
      return (
        <Row label={label}>
          <FontPicker value={value} onChange={(v) => update(path, v)} />
        </Row>
      );

    if (keyName === "image" || /image$/i.test(keyName) || keyName === "photo")
      return (
        <Row label={label}>
          <MediaField value={value} onChange={(v) => update(path, v)} />
        </Row>
      );

    if (LONG.test(keyName) || value.length > 90)
      return (
        <Row label={label}>
          <textarea
            className={`${inputCls} min-h-[92px] resize-y leading-relaxed`}
            value={value}
            onChange={(e) => update(path, e.target.value)}
          />
        </Row>
      );

    return (
      <Row label={label}>
        <input className={inputCls} value={value} onChange={(e) => update(path, e.target.value)} />
      </Row>
    );
  }

  if (Array.isArray(value)) {
    const isStrings = value.every((v) => typeof v === "string");
    const blank = () => {
      if (isStrings) return "";
      const t = value[0] as Record<string, unknown>;
      const o: Record<string, unknown> = {};
      Object.entries(t || {}).forEach(([k, v]) => {
        o[k] = typeof v === "number" ? 0 : typeof v === "boolean" ? true : Array.isArray(v) ? [] : "";
      });
      return o;
    };
    const move = (i: number, d: number) => {
      const next = [...value];
      const j = i + d;
      if (j < 0 || j >= next.length) return;
      [next[i], next[j]] = [next[j], next[i]];
      update(path, next);
    };

    return (
      <div className="space-y-2">
        <div className="text-[10px] tracking-[0.14em] text-white/40 uppercase">{label}</div>
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/12 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] tracking-[0.16em] text-white/30 uppercase">
                {label.replace(/s$/, "")} {i + 1}
              </span>
              <div className="flex gap-1">
                {["↑", "↓", "✕"].map((sym, k) => (
                  <button
                    key={sym}
                    onClick={() =>
                      k === 2
                        ? update(path, value.filter((_, x) => x !== i))
                        : move(i, k === 0 ? -1 : 1)
                    }
                    className="h-6 w-6 rounded border border-white/15 text-[11px] text-white/60 hover:bg-white/10"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
            {isStrings ? (
              <textarea
                className={`${inputCls} min-h-[54px] resize-y`}
                value={item as string}
                onChange={(e) => update(path, value.map((v, x) => (x === i ? e.target.value : v)))}
              />
            ) : (
              <div className="space-y-3">
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <Node key={k} keyName={k} path={`${path}.${i}.${k}`} value={v} />
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => update(path, [...value, blank()])}
          className="w-full rounded border border-dashed border-white/25 py-2 text-[10px] tracking-[0.16em] text-white/60 uppercase hover:bg-white/5"
        >
          + Add {label.replace(/s$/, "").toLowerCase()}
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("youtube" in obj && "video" in obj && "type" in obj)
      return (
        <div className="space-y-2">
          <div className="text-[10px] tracking-[0.14em] text-white/40 uppercase">{label}</div>
          <MediaBlockField path={path} value={obj as Record<string, string>} />
        </div>
      );

    return (
      <div className="space-y-3 rounded-lg border border-white/10 p-3">
        <div className="text-[10px] tracking-[0.16em] text-white/35 uppercase">{label}</div>
        {Object.entries(obj).map(([k, v]) => (
          <Node key={k} keyName={k} path={`${path}.${k}`} value={v} />
        ))}
      </div>
    );
  }

  return null;
}

/* -------------------------------------------------------- media library */

function MediaLibrary() {
  const { library, mediaUrl, addFile, removeFile } = useSite();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(files?: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      const out = await compressImage(f);
      const file =
        out instanceof File ? out : new File([out], f.name.replace(/\.\w+$/, ".jpg"), { type: out.type });
      await addFile(file);
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        onClick={() => ref.current?.click()}
        className="cursor-pointer rounded-lg border border-dashed border-white/25 py-8 text-center hover:bg-white/5"
      >
        <div className="text-[11px] tracking-[0.18em] text-white/70 uppercase">
          {busy ? "Uploading…" : "Upload images from device"}
        </div>
        <div className="mt-1 text-[10px] text-white/35">click or drop files here</div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => upload(e.target.files)}
      />

      <p className="text-[10px] leading-relaxed text-white/35">
        {library.length} file{library.length === 1 ? "" : "s"} stored on this device. Copy a
        reference to paste it into any image field.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {library.map((ref_) => (
          <div key={ref_} className="group relative aspect-square overflow-hidden rounded border border-white/12">
            <img src={mediaUrl(ref_)} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => downloadUrl(mediaUrl(ref_), "amuma-image")}
                className="rounded bg-white/15 px-2 py-1 text-[9px] tracking-wider uppercase hover:bg-white/25"
              >
                Download
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(ref_)}
                className="rounded bg-white/15 px-2 py-1 text-[9px] tracking-wider uppercase hover:bg-white/25"
              >
                Copy ref
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this file? Any section using it will go blank."))
                    removeFile(ref_);
                }}
                className="rounded bg-red-600/80 px-2 py-1 text-[9px] tracking-wider uppercase hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- panel */

export default function Admin() {
  const {
    content,
    admin,
    setAdmin,
    replace,
    reset,
    editMode,
    setEditMode,
    saveState,
    email,
    signIn,
    signUp,
  } = useSite();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busyAuth, setBusyAuth] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState("__sections");
  const [menu, setMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* keyboard shortcut: alt + shift + A */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "a" && e.altKey) {
        admin ? setOpen((v) => !v) : setLogin(true);
      }
      if (e.key === "Escape") {
        setLogin(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [admin]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusyAuth(true);
    setErr(null);
    const message = mode === "in" ? await signIn(mail, pass) : await signUp(mail, pass);
    setBusyAuth(false);
    if (message) {
      setErr(message);
      return;
    }
    setLogin(false);
    setOpen(true);
    setPass("");
  }


  function exportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "amuma-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJson(file?: File) {
    if (!file) return;
    try {
      replace(JSON.parse(await file.text()));
    } catch {
      alert("That file could not be read as AMUMA content JSON.");
    }
  }

  const section =
    (tab.split(".").reduce<unknown>((a, k) => (a == null ? a : (a as never)[k]), content) as Record<
      string,
      unknown
    >) ?? {};

  return (
    <>
      {/* launcher / toolbar */}
      <div className="fixed bottom-5 left-5 z-[70] flex items-center gap-2">
        <button
          onClick={() => (admin ? setOpen((v) => !v) : setLogin(true))}
          title="Admin"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white/70 backdrop-blur-md transition-all hover:scale-105 hover:text-white"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
          </svg>
        </button>

        {admin && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] tracking-[0.18em] uppercase backdrop-blur-md transition-colors ${
              editMode
                ? "border-sky-400 bg-sky-500 text-white"
                : "border-white/25 bg-black/60 text-white/75 hover:text-white"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
            {editMode ? "Editing page" : "Edit page"}
          </button>
        )}
      </div>

      {/* edit-mode helper bar */}
      {admin && editMode && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[65] flex justify-center pt-20">
          <div className="pointer-events-auto rounded-full border border-sky-400/40 bg-sky-950/85 px-5 py-2 text-[10px] tracking-[0.16em] text-sky-100 uppercase shadow-lg backdrop-blur">
            Click text to rewrite · click empty image area or "Upload" to change · "Save" to download
          </div>
        </div>
      )}

      {/* login */}
      {login && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <form
            onSubmit={submit}
            className="w-full max-w-xs rounded-xl border border-white/15 bg-[#191612] p-7 text-white"
          >
            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">AMUMA</div>
            <h3 className="mt-2 font-display text-2xl font-light">Admin access</h3>
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErr(false);
              }}
              placeholder="Pass key"
              className={`${inputCls} mt-6 text-center text-lg tracking-[0.5em]`}
            />
            {err && <p className="mt-2 text-[11px] text-red-400">Incorrect pass key.</p>}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setLogin(false)}
                className="flex-1 rounded border border-white/20 py-2.5 text-[10px] tracking-[0.18em] uppercase hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded bg-white py-2.5 text-[10px] tracking-[0.18em] text-black uppercase hover:bg-white/85"
              >
                Enter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* drawer */}
      {admin && open && (
        <aside className="fixed top-0 right-0 bottom-0 z-[75] flex w-full flex-col border-l border-white/10 bg-[#141210] text-white shadow-2xl sm:w-[440px]">
          <header className="border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase">
                  AMUMA Admin
                </div>
                <div className="font-display text-lg">Site editor</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded border border-white/20 px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase hover:bg-white/10"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setAdmin(false);
                    setOpen(false);
                  }}
                  className="rounded border border-white/20 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/60 uppercase hover:bg-white/10"
                >
                  Lock
                </button>
              </div>
            </div>

            <button
              onClick={() => setMenu((v) => !v)}
              className="mt-4 flex w-full items-center justify-between rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-left text-[12px] hover:border-white/35"
            >
              <span className="truncate">
                {TABS.find((t) => t.key === tab)?.label ??
                  content.sections.find((s) => `custom.${s.id}` === tab)?.label ??
                  tab}
              </span>
              <span className="shrink-0 text-[9px] text-white/40">SECTIONS ▾</span>
            </button>
            {menu && (
              <div className="mt-2 max-h-72 overflow-y-auto rounded-md border border-white/15 bg-black/50">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTab(t.key);
                      setMenu(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-[12px] hover:bg-white/10 ${
                      t.key === tab ? "bg-white/10 text-white" : "text-white/65"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {tab === "__media" ? (
              <MediaLibrary />
            ) : tab === "__design" ? (
              <Design />
            ) : tab === "__sections" ? (
              <SectionsManager
                onJump={(t) => {
                  setTab(t);
                  setMenu(false);
                }}
              />
            ) : (
              Object.entries(section).map(([k, v]) => (
                <Node key={`${tab}.${k}`} keyName={k} path={`${tab}.${k}`} value={v} />
              ))
            )}
          </div>

          <footer className="grid grid-cols-3 gap-2 border-t border-white/10 p-4">
            <button
              onClick={exportJson}
              className="rounded border border-white/20 py-2 text-[10px] tracking-[0.14em] uppercase hover:bg-white/10"
            >
              Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded border border-white/20 py-2 text-[10px] tracking-[0.14em] uppercase hover:bg-white/10"
            >
              Import
            </button>
            <button
              onClick={() => {
                if (confirm("Reset all content to the original site?")) reset();
              }}
              className="rounded border border-red-400/40 py-2 text-[10px] tracking-[0.14em] text-red-300 uppercase hover:bg-red-400/10"
            >
              Reset
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => importJson(e.target.files?.[0])}
            />
            <p className="col-span-3 mt-1 text-[10px] leading-relaxed text-white/30">
              Changes save automatically to this browser. {Object.keys(defaultContent).length}{" "}
              editable groups · Alt+Shift+A toggles this panel.
            </p>
          </footer>
        </aside>
      )}
    </>
  );
}

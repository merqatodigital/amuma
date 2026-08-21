import { useEffect, useRef, useState, type ElementType } from "react";
import { getPath, useSite } from "../store";
import { compressImage, downloadUrl } from "../lib/media";

/* ------------------------------------------------------------------ text */

const EDIT_RING =
  "outline-dashed outline-1 outline-offset-4 outline-sky-500/50 hover:outline-sky-500 hover:bg-sky-500/[0.06] focus:outline-solid focus:outline-2 focus:outline-sky-500 focus:bg-sky-500/[0.08] rounded-[2px] transition-colors cursor-text";

/**
 * Inline-editable text. Renders plain content for visitors; when the admin
 * turns on Edit mode it becomes click-to-type directly on the page.
 */
export function T({
  path,
  as: Tag = "span",
  className = "",
  style,
  placeholder = "Empty — click to write",
}: {
  path: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}) {
  const { content, update, editMode } = useSite();
  const value = String(getPath(content, path) ?? "");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !editMode) return;
    if (document.activeElement !== el && el.innerText !== value) el.innerText = value;
  }, [value, editMode]);

  if (!editMode)
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );

  return (
    <Tag
      ref={ref}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ph={value ? undefined : placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.replace(/\u00a0/g, " ").trimEnd();
        if (next !== value) update(path, next);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
      }}
      className={`${className} ${EDIT_RING} ${value ? "" : "min-w-[7ch] before:text-current/40 before:content-[attr(data-ph)]"}`}
    />
  );
}

/* ----------------------------------------------------------------- image */

/** Image that, in edit mode, can be replaced by a file from the device. */
export function EImg({
  path,
  alt = "",
  className = "",
  style,
  loading,
}: {
  path: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) {
  const { content, update, mediaUrl, addFile, editMode } = useSite();
  const src = String(getPath(content, path) ?? "");
  const url = mediaUrl(src);
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (JPG, PNG, WebP…).");
      return;
    }
    setBusy(true);
    const out = await compressImage(file);
    const asFile =
      out instanceof File
        ? out
        : new File([out], file.name.replace(/\.\w+$/, ".jpg"), { type: out.type });
    update(path, await addFile(asFile));
    setBusy(false);
  }

  const img = url ? (
    <img src={url} alt={alt} className={className} style={style} loading={loading} />
  ) : (
    <div className={`bg-sand-200 ${className}`} style={style} aria-hidden="true" />
  );

  if (!editMode) return img;

  const chip =
    "flex items-center gap-1.5 rounded bg-white/95 px-2.5 py-1.5 text-[9px] font-medium tracking-[0.14em] text-sky-950 uppercase shadow transition-colors hover:bg-white";

  return (
    <>
      {img}

      {/* full-area drop zone + click-to-upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => ref.current?.click()}
        title="Click to upload a new image from your device — or drop a file here"
        className={`group/img absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors ${
          over || busy
            ? "border-sky-400 bg-sky-500/40"
            : "border-sky-500/60 bg-transparent hover:bg-sky-950/45"
        }`}
      >
        <div
          className={`pointer-events-none flex flex-col items-center gap-2 text-white transition-opacity ${
            over || busy ? "opacity-100" : "opacity-0 group-hover/img:opacity-100"
          }`}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M12 16V4M7 9l5-5 5 5" />
            <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
          </svg>
          <span className="text-[10px] tracking-[0.2em] uppercase">
            {busy ? "Uploading…" : over ? "Drop to upload" : "Change image"}
          </span>
          <span className="text-[9px] tracking-wide opacity-80">click or drop a file</span>
        </div>

        {/* action chips */}
        <div
          className="absolute top-2 left-2 flex flex-wrap gap-1.5 opacity-0 transition-opacity group-hover/img:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => ref.current?.click()} className={chip}>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 16V4M7 9l5-5 5 5" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
            </svg>
            Upload
          </button>
          {url && (
            <button
              onClick={() =>
                downloadUrl(url, (alt || "amuma-image").replace(/\s+/g, "-").toLowerCase())
              }
              className={chip}
              title="Download this image to your device"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4v12M7 11l5 5 5-5" />
                <path d="M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
              </svg>
              Save
            </button>
          )}
          {src && (
            <button
              onClick={() => {
                if (confirm("Remove this image?")) update(path, "");
              }}
              className={`${chip} text-red-700`}
              title="Remove image"
            >
              ✕ Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}

/** Non-absolute variant for images that sit in normal flow. */
export function EImgBox({
  path,
  alt,
  className = "",
  wrapClassName = "",
  loading,
}: {
  path: string;
  alt?: string;
  className?: string;
  wrapClassName?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <span className={`relative block ${wrapClassName}`}>
      <EImg path={path} alt={alt} className={className} loading={loading} />
    </span>
  );
}

/* ------------------------------------------------------------ list tools */

function newLike(sample: unknown): unknown {
  if (typeof sample === "string") return "New text";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return true;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(sample)) {
      o[k] =
        typeof v === "number"
          ? 0
          : typeof v === "boolean"
            ? true
            : Array.isArray(v)
              ? []
              : /image|photo/i.test(k)
                ? ""
                : `New ${k}`;
    }
    return o;
  }
  return "";
}

/** Floating ↑ ↓ ⧉ ✕ controls for one item of a list. */
export function ItemTools({
  path,
  index,
  className = "",
}: {
  path: string;
  index: number;
  className?: string;
}) {
  const { content, update, editMode } = useSite();
  if (!editMode) return null;
  const list = (getPath(content, path) as unknown[]) ?? [];

  const set = (next: unknown[]) => update(path, next);
  const move = (d: number) => {
    const j = index + d;
    if (j < 0 || j >= list.length) return;
    const n = [...list];
    [n[index], n[j]] = [n[j], n[index]];
    set(n);
  };

  const btn =
    "flex h-6 w-6 items-center justify-center rounded bg-sky-600 text-[11px] leading-none text-white shadow hover:bg-sky-500";

  return (
    <span
      className={`absolute -top-3 right-1 z-30 flex gap-1 opacity-25 transition-opacity group-hover/item:opacity-100 ${className}`}
    >
      <button title="Move up" className={btn} onClick={() => move(-1)}>
        ↑
      </button>
      <button title="Move down" className={btn} onClick={() => move(1)}>
        ↓
      </button>
      <button
        title="Duplicate"
        className={btn}
        onClick={() =>
          set([...list.slice(0, index + 1), structuredClone(list[index]), ...list.slice(index + 1)])
        }
      >
        ⧉
      </button>
      <button
        title="Delete"
        className={`${btn} bg-red-600 hover:bg-red-500`}
        onClick={() => {
          if (confirm("Delete this item?")) set(list.filter((_, i) => i !== index));
        }}
      >
        ✕
      </button>
    </span>
  );
}

/** "+ Add" button shown at the end of an editable list. */
export function AddItem({
  path,
  label = "item",
  className = "",
}: {
  path: string;
  label?: string;
  className?: string;
}) {
  const { content, update, editMode } = useSite();
  if (!editMode) return null;
  const list = (getPath(content, path) as unknown[]) ?? [];
  return (
    <button
      onClick={() => update(path, [...list, newLike(list[list.length - 1] ?? "")])}
      className={`flex w-full items-center justify-center gap-2 rounded border border-dashed border-sky-500/70 px-4 py-3 text-[10px] tracking-[0.2em] text-sky-600 uppercase transition-colors hover:bg-sky-500/10 ${className}`}
    >
      + Add {label}
    </button>
  );
}

/** Wrapper that marks a hoverable list item (needed for ItemTools). */
export function Item({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const { editMode } = useSite();
  return <Tag className={`${className} ${editMode ? "group/item relative" : ""}`}>{children}</Tag>;
}

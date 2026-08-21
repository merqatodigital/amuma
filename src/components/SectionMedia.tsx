import { useRef, useState } from "react";
import { getPath, useSite } from "../store";
import type { GalleryItem } from "../content";
import { compressImage } from "../lib/media";

/**
 * Universal media strip for any section: the admin can add as many photos and
 * videos from their device as needed, caption them, reorder and delete them.
 * Everything is stored in the cloud (media bucket + site content row), so what
 * you add here is what every visitor sees.
 */
export default function SectionMedia({ id }: { id: string }) {
  const { content, update, editMode, addFile, mediaUrl } = useSite();
  const path = `galleries.${id}`;
  const items = ((getPath(content, path) as GalleryItem[]) ?? []) as GalleryItem[];
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  if (!editMode && items.length === 0) return null;

  const set = (next: GalleryItem[]) => update(path, next);

  async function addFiles(files: FileList | null | undefined) {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    setBusy(true);
    const added: GalleryItem[] = [];
    for (const file of list) {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && !file.type.startsWith("image/")) continue;
      let upload: File = file;
      if (!isVideo) {
        const out = await compressImage(file);
        upload =
          out instanceof File
            ? out
            : new File([out], file.name.replace(/\.\w+$/, ".jpg"), { type: out.type });
      }
      const ref = await addFile(upload);
      if (ref) added.push({ kind: isVideo ? "video" : "image", src: ref, caption: "" });
    }
    if (added.length) set([...items, ...added]);
    setBusy(false);
  }

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    set(n);
  };

  const btn =
    "flex h-6 w-6 items-center justify-center rounded bg-sky-600 text-[11px] leading-none text-white shadow hover:bg-sky-500";

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <figure key={`${it.src}-${i}`} className="group/gi relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
                {it.kind === "video" ? (
                  <video
                    src={mediaUrl(it.src)}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={mediaUrl(it.src)}
                    alt={it.caption || ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {editMode ? (
                <>
                  <span className="absolute top-2 right-2 z-20 flex gap-1 opacity-30 transition-opacity group-hover/gi:opacity-100">
                    <button title="Move left" className={btn} onClick={() => move(i, -1)}>
                      ←
                    </button>
                    <button title="Move right" className={btn} onClick={() => move(i, 1)}>
                      →
                    </button>
                    <button
                      title="Delete"
                      className={`${btn} bg-red-600 hover:bg-red-500`}
                      onClick={() => {
                        if (confirm("Remove this item?")) set(items.filter((_, k) => k !== i));
                      }}
                    >
                      ✕
                    </button>
                  </span>
                  <input
                    value={it.caption}
                    placeholder="Caption (optional)"
                    onChange={(e) =>
                      set(items.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)))
                    }
                    className="mt-2 w-full border border-sky-500/40 bg-white/70 px-2 py-1 text-[12px] text-bark-800 outline-none focus:border-sky-500"
                  />
                </>
              ) : (
                it.caption && (
                  <figcaption className="t-body mt-2 text-[12.5px] text-bark-700">
                    {it.caption}
                  </figcaption>
                )
              )}
            </figure>
          ))}
        </div>
      )}

      {editMode && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              void addFiles(e.dataTransfer.files);
            }}
            onClick={() => input.current?.click()}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-1 rounded border-2 border-dashed px-4 py-6 text-center transition-colors ${
              over || busy ? "border-sky-500 bg-sky-500/10" : "border-sky-500/50 hover:bg-sky-500/5"
            }`}
          >
            <span className="text-[10px] tracking-[0.2em] text-sky-700 uppercase">
              {busy ? "Uploading…" : `+ Add photos or videos to “${id}”`}
            </span>
            <span className="text-[10px] text-sky-700/70">
              choose several files at once, or drop them here
            </span>
          </div>
          <input
            ref={input}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => {
              void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </>
      )}
    </section>
  );
}

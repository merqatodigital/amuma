import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultContent, type Content, type MediaBlock } from "./content";
import { deleteMedia, getAllMedia, putMedia, youtubeId } from "./lib/media";
import { familyParam } from "./admin/fonts";

const LS_KEY = "amuma.content.v1";

/* ------------------------------------------------------------- utilities */

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Deep-merge stored content over defaults so new fields always appear. */
function merge<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) return (over === undefined ? base : (over as T));
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(over)) {
    if (k in (base as Record<string, unknown>)) {
      const b = (base as Record<string, unknown>)[k];
      const o = over[k];
      out[k] = Array.isArray(b) ? (Array.isArray(o) ? o : b) : merge(b, o);
    } else {
      out[k] = over[k];
    }
  }
  return out as T;
}

/** Immutably set a deep value by dotted/indexed path, e.g. "hero.media.type". */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (v: unknown): unknown => (Array.isArray(v) ? [...v] : { ...(v as object) });
  const root = clone(obj) as Record<string, unknown>;
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = clone(cur[k]);
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return root as T;
}

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((a, k) => (a == null ? a : (a as never)[k]), obj);
}

/* --------------------------------------------------------------- context */

type Ctx = {
  content: Content;
  update: (path: string, value: unknown) => void;
  replace: (c: Content) => void;
  reset: () => void;
  mediaUrl: (ref: string) => string;
  addFile: (file: File) => Promise<string>;
  removeFile: (ref: string) => Promise<void>;
  library: string[];
  admin: boolean;
  setAdmin: (v: boolean) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
};

const ContentCtx = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? merge(defaultContent, JSON.parse(raw)) : defaultContent;
    } catch {
      return defaultContent;
    }
  });
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [admin, setAdmin] = useState(
    () => sessionStorage.getItem("amuma.admin") === "1",
  );
  const [editMode, setEditMode] = useState(false);
  const created = useRef<string[]>([]);

  /* load device media once */
  useEffect(() => {
    let alive = true;
    getAllMedia().then((files) => {
      if (!alive) return;
      const map: Record<string, string> = {};
      for (const [id, blob] of Object.entries(files)) {
        const u = URL.createObjectURL(blob);
        created.current.push(u);
        map[id] = u;
      }
      setBlobUrls(map);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () => () => {
      created.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  /* persist */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(content));
    } catch {
      /* quota — ignore */
    }
  }, [content]);

  /* apply theme (fonts, type roles, colors) */
  useEffect(() => {
    const { theme } = content;
    const root = document.documentElement;
    const S = (k: string, v: string | number) => root.style.setProperty(k, String(v));

    S("--font-display", `"${theme.displayFont}", Georgia, serif`);
    S("--font-sans", `"${theme.bodyFont}", system-ui, sans-serif`);
    S("--heading-scale", theme.headingScale ?? 1);

    const t = theme.type;
    if (t) {
      S("--heading-weight", t.heading.weight);
      S("--heading-tracking", `${t.heading.tracking}em`);
      S("--heading-transform", t.heading.transform);
      S("--brand-weight", t.brand.weight);
      S("--brand-tracking", `${t.brand.tracking}em`);
      S("--brand-transform", t.brand.transform);
      S("--eyebrow-size", `${t.eyebrow.size}px`);
      S("--eyebrow-weight", t.eyebrow.weight);
      S("--eyebrow-tracking", `${t.eyebrow.tracking}em`);
      S("--eyebrow-transform", t.eyebrow.transform);
      S("--btn-size", `${t.button.size}px`);
      S("--btn-weight", t.button.weight);
      S("--btn-tracking", `${t.button.tracking}em`);
      S("--btn-transform", t.button.transform);
      S("--nav-size", `${t.nav.size}px`);
      S("--nav-weight", t.nav.weight);
      S("--nav-tracking", `${t.nav.tracking}em`);
      S("--nav-transform", t.nav.transform);
      S("--body-weight", t.body.weight);
      S("--body-line", t.body.lineHeight);
    }

    Object.entries(theme.colors).forEach(([k, v]) => {
      const name = k.replace(/([a-z]+)(\d+)/, "$1-$2");
      S(`--color-${name}`, v as string);
    });
  }, [content.theme]);

  /* load the two chosen Google fonts */
  useEffect(() => {
    const fams = [...new Set([content.theme.displayFont, content.theme.bodyFont])];
    const id = "amuma-fonts";
    const href =
      "https://fonts.googleapis.com/css2?" +
      fams.map(familyParam).join("&") +
      "&display=swap";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [content.theme.displayFont, content.theme.bodyFont]);

  const update = useCallback((path: string, value: unknown) => {
    setContent((c) => setPath(c, path, value));
  }, []);

  const replace = useCallback((c: Content) => setContent(merge(defaultContent, c)), []);
  const reset = useCallback(() => setContent(defaultContent), []);

  const mediaUrl = useCallback(
    (ref: string) => {
      if (!ref) return "";
      if (ref.startsWith("idb:")) return blobUrls[ref.slice(4)] || "";
      return ref;
    },
    [blobUrls],
  );

  const addFile = useCallback(async (file: File) => {
    const id = await putMedia(file);
    const url = URL.createObjectURL(file);
    created.current.push(url);
    setBlobUrls((m) => ({ ...m, [id]: url }));
    return `idb:${id}`;
  }, []);

  const removeFile = useCallback(async (ref: string) => {
    const id = ref.startsWith("idb:") ? ref.slice(4) : ref;
    await deleteMedia(id);
    setBlobUrls((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
  }, []);

  const library = useMemo(() => Object.keys(blobUrls).map((id) => `idb:${id}`), [blobUrls]);

  const setAdminPersist = useCallback((v: boolean) => {
    sessionStorage.setItem("amuma.admin", v ? "1" : "0");
    setAdmin(v);
    if (!v) setEditMode(false);
  }, []);

  const value = useMemo(
    () => ({
      content,
      update,
      replace,
      reset,
      mediaUrl,
      addFile,
      removeFile,
      library,
      admin,
      setAdmin: setAdminPersist,
      editMode: admin && editMode,
      setEditMode,
    }),
    [
      content,
      update,
      replace,
      reset,
      mediaUrl,
      addFile,
      removeFile,
      library,
      admin,
      setAdminPersist,
      editMode,
    ],
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useSite() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useSite must be used inside ContentProvider");
  return ctx;
}

export function useContent() {
  return useSite().content;
}

/* ----------------------------------------------------------- components */

export function Img({
  src,
  alt = "",
  className = "",
  style,
  loading,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) {
  const { mediaUrl } = useSite();
  const url = mediaUrl(src);
  if (!url)
    return <div className={`bg-sand-200 ${className}`} style={style} aria-hidden="true" />;
  return <img src={url} alt={alt} className={className} style={style} loading={loading} />;
}

/** Renders an image, an uploaded video, or a YouTube embed as a cover layer. */
export function MediaLayer({
  block,
  className = "",
  style,
  alt = "",
}: {
  block: MediaBlock;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  const { mediaUrl } = useSite();

  if (block.type === "youtube") {
    const id = youtubeId(block.youtube);
    if (id)
      return (
        <div className={`${className} overflow-hidden`} style={style}>
          <iframe
            title={alt || "video"}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78vh)] -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&modestbranding=1&rel=0&showinfo=0`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
      );
  }

  if (block.type === "video") {
    const url = mediaUrl(block.video);
    if (url)
      return (
        <video
          className={className}
          style={style}
          src={url}
          autoPlay
          muted
          loop
          playsInline
        />
      );
  }

  return <Img src={block.image} alt={alt} className={className} style={style} />;
}

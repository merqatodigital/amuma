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
import { youtubeId } from "./lib/media";
import { familyParam } from "./admin/fonts";
import { supabase } from "@/integrations/supabase/client";

const ROW_ID = "main";
const BUCKET = "site-media";

/* ------------------------------------------------------------- utilities */

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Deep-merge stored content over defaults so new fields always appear. */
function merge<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : (over as T);
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

/** Public URL for a file stored in the cloud media bucket. */
export function mediaSrc(ref: string): string {
  if (!ref) return "";
  if (ref.startsWith("sb:")) return `/api/public/media/${ref.slice(3)}`;
  if (ref.startsWith("idb:")) return ""; // legacy device-only media
  return ref;
}

export type SaveState = "idle" | "saving" | "saved" | "error";

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
  /* cloud */
  loaded: boolean;
  saveState: SaveState;
  email: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const ContentCtx = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(defaultContent);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Build mode: the site is openly editable — no admin login while we build.
  const [admin, setAdminState] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [library, setLibrary] = useState<string[]>([]);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------------- load content */
  useEffect(() => {
    let alive = true;
    supabase
      .from("site_content")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        const stored = (data?.data ?? null) as unknown;
        if (stored && isObj(stored) && Object.keys(stored).length > 0) {
          setContent(merge(defaultContent, stored));
        }
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  /* ------------------------------------------------------------ auto-save */
  useEffect(() => {
    if (!loaded || !admin || !dirty.current) return;
    if (timer.current) clearTimeout(timer.current);
    setSaveState("saving");
    timer.current = setTimeout(async () => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ id: ROW_ID, data: content as never, updated_at: new Date().toISOString() });
      setSaveState(error ? "error" : "saved");
      if (!error) dirty.current = false;
    }, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [content, admin, loaded]);

  /* ------------------------------------- apply theme (fonts, type, colors) */
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
      "https://fonts.googleapis.com/css2?" + fams.map(familyParam).join("&") + "&display=swap";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [content.theme.displayFont, content.theme.bodyFont]);

  /* ------------------------------------------------------------- mutators */
  const update = useCallback((path: string, value: unknown) => {
    dirty.current = true;
    setContent((c) => setPath(c, path, value));
  }, []);

  const replace = useCallback((c: Content) => {
    dirty.current = true;
    setContent(merge(defaultContent, c));
  }, []);

  const reset = useCallback(() => {
    dirty.current = true;
    setContent(defaultContent);
  }, []);

  /* ---------------------------------------------------------------- media */
  const refreshLibrary = useCallback(async () => {
    const { data } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setLibrary((data ?? []).filter((f) => f.id).map((f) => `sb:${f.name}`));
  }, []);

  useEffect(() => {
    if (admin) void refreshLibrary();
    else setLibrary([]);
  }, [admin, refreshLibrary]);

  const addFile = useCallback(async (file: File) => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
    const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "31536000", contentType: file.type || undefined });
    if (error) {
      alert(`Upload failed: ${error.message}`);
      return "";
    }
    setLibrary((l) => [`sb:${path}`, ...l]);
    return `sb:${path}`;
  }, []);

  const removeFile = useCallback(async (ref: string) => {
    const path = ref.startsWith("sb:") ? ref.slice(3) : ref;
    await supabase.storage.from(BUCKET).remove([path]);
    setLibrary((l) => l.filter((r) => r !== ref));
  }, []);

  const mediaUrl = useCallback((ref: string) => mediaSrc(ref), []);

  /* ----------------------------------------------------------------- auth */
  const signIn = useCallback(async (mail: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
    return error ? error.message : null;
  }, []);

  const signUp = useCallback(async (mail: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: mail,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    setEditMode(false);
  }, []);

  const setAdmin = useCallback((v: boolean) => {
    setAdminState(v);
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
      setAdmin,
      editMode: admin && editMode,
      setEditMode,
      loaded,
      saveState,
      email,
      signIn,
      signUp,
      signOut,
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
      setAdmin,
      editMode,
      loaded,
      saveState,
      email,
      signIn,
      signUp,
      signOut,
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
  if (!url) return <div className={`bg-sand-200 ${className}`} style={style} aria-hidden="true" />;
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
        <video className={className} style={style} src={url} autoPlay muted loop playsInline />
      );
  }

  return <Img src={block.image} alt={alt} className={className} style={style} />;
}

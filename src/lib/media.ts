/* Device media storage — files are kept as Blobs in IndexedDB and referenced
   from the content tree as "idb:<id>". This avoids localStorage quota limits. */

const DB_NAME = "amuma-media";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putMedia(blob: Blob): Promise<string> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return id;
}

export async function getAllMedia(): Promise<Record<string, Blob>> {
  try {
    const db = await openDb();
    const out = await new Promise<Record<string, Blob>>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const keysReq = store.getAllKeys();
      const valsReq = store.getAll();
      tx.oncomplete = () => {
        const map: Record<string, Blob> = {};
        (keysReq.result as string[]).forEach((k, i) => {
          map[k] = valsReq.result[i] as Blob;
        });
        resolve(map);
      };
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return out;
  } catch {
    return {};
  }
}

export async function deleteMedia(id: string) {
  const db = await openDb();
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
  });
  db.close();
}

/** Downscale + recompress an image file so uploads stay light. */
export function compressImage(file: File, maxSize = 2200, quality = 0.86): Promise<Blob> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
      resolve(file);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob && blob.size < file.size ? blob : file);
        },
        "image/jpeg",
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

/** Saves a URL (blob: or remote) to the visitor's device. */
export async function downloadUrl(url: string, filename = "amuma-image") {
  if (!url) return;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = (blob.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = /\.\w{3,4}$/.test(filename) ? filename : `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch {
    // cross-origin images that block fetch — open in a new tab so the user can save manually
    window.open(url, "_blank", "noopener");
  }
}

/** Accepts any YouTube URL form and returns the video id. */
export function youtubeId(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return "";
}

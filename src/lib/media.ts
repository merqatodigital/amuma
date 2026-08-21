/* Media helpers for the admin editor. Files live in Lovable Cloud storage. */

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

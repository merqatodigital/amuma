export type FontDef = {
  name: string;
  group: "Serif / Display" | "Sans / Text";
  note: string;
  /** weights actually published on Google Fonts — an invalid weight breaks the request */
  weights?: string;
};

const W_FULL = "200;300;400;500;600;700";
const W_MID = "300;400;500;600;700";
const W_REG = "400";

export const FONTS: FontDef[] = [
  // Serif & display
  {
    name: "Cormorant Garamond",
    group: "Serif / Display",
    note: "Default · airy classical",
    weights: W_MID,
  },
  {
    name: "Playfair Display",
    group: "Serif / Display",
    note: "High-contrast editorial",
    weights: "400;500;600;700",
  },
  {
    name: "EB Garamond",
    group: "Serif / Display",
    note: "Old-style, literary",
    weights: "400;500;600;700",
  },
  {
    name: "Libre Baskerville",
    group: "Serif / Display",
    note: "Sturdy transitional",
    weights: "400;700",
  },
  {
    name: "Lora",
    group: "Serif / Display",
    note: "Warm, brushed curves",
    weights: "400;500;600;700",
  },
  { name: "Spectral", group: "Serif / Display", note: "Screen-first serif", weights: W_FULL },
  { name: "Crimson Pro", group: "Serif / Display", note: "Book-like elegance", weights: W_FULL },
  {
    name: "Bodoni Moda",
    group: "Serif / Display",
    note: "Fashion didone",
    weights: "400;500;600;700",
  },
  { name: "DM Serif Display", group: "Serif / Display", note: "Tight, confident", weights: W_REG },
  { name: "Fraunces", group: "Serif / Display", note: "Soft, characterful", weights: W_MID },
  { name: "Marcellus", group: "Serif / Display", note: "Roman inscriptional", weights: W_REG },
  { name: "Cinzel", group: "Serif / Display", note: "Carved capitals", weights: "400;500;600;700" },
  { name: "Italiana", group: "Serif / Display", note: "Very fine, couture", weights: W_REG },
  { name: "Prata", group: "Serif / Display", note: "Refined didone", weights: W_REG },
  { name: "Gilda Display", group: "Serif / Display", note: "Delicate luxury", weights: W_REG },
  { name: "Instrument Serif", group: "Serif / Display", note: "Modern condensed", weights: W_REG },
  { name: "Tenor Sans", group: "Serif / Display", note: "Humanist, gallery-like", weights: W_REG },
  {
    name: "Syne",
    group: "Serif / Display",
    note: "Contemporary art-house",
    weights: "400;500;600;700;800",
  },

  // Sans & text
  { name: "Jost", group: "Sans / Text", note: "Default · geometric futura", weights: W_FULL },
  { name: "Inter", group: "Sans / Text", note: "Neutral UI workhorse", weights: W_FULL },
  { name: "Manrope", group: "Sans / Text", note: "Rounded geometric", weights: W_FULL },
  { name: "Work Sans", group: "Sans / Text", note: "Friendly grotesque", weights: W_FULL },
  { name: "DM Sans", group: "Sans / Text", note: "Low-contrast geometric", weights: W_FULL },
  { name: "Karla", group: "Sans / Text", note: "Quirky grotesque", weights: W_FULL },
  { name: "Montserrat", group: "Sans / Text", note: "Urban, wide", weights: W_FULL },
  { name: "Raleway", group: "Sans / Text", note: "Elegant thin weights", weights: W_FULL },
  { name: "Lato", group: "Sans / Text", note: "Warm humanist", weights: "300;400;700" },
  { name: "Nunito Sans", group: "Sans / Text", note: "Soft & readable", weights: W_FULL },
  { name: "Outfit", group: "Sans / Text", note: "Clean geometric", weights: W_FULL },
  { name: "Space Grotesk", group: "Sans / Text", note: "Technical character", weights: W_MID },
  { name: "Archivo", group: "Sans / Text", note: "Grotesque, sturdy", weights: W_FULL },
  { name: "Sora", group: "Sans / Text", note: "Modern, slightly quirky", weights: W_FULL },
  { name: "Figtree", group: "Sans / Text", note: "Bright and simple", weights: W_MID },
  { name: "Barlow", group: "Sans / Text", note: "Slightly rounded, low-key", weights: W_FULL },
  { name: "Josefin Sans", group: "Sans / Text", note: "Deco geometric", weights: W_FULL },
  { name: "Urbanist", group: "Sans / Text", note: "Minimal geometric", weights: W_FULL },
  { name: "Public Sans", group: "Sans / Text", note: "Neutral, official", weights: W_FULL },
];

/** Builds a valid `family=` query segment for a chosen font. */
export function familyParam(name: string) {
  const def = FONTS.find((f) => f.name === name);
  const enc = encodeURIComponent(name).replace(/%20/g, "+");
  return `family=${enc}:wght@${def?.weights ?? W_MID}`;
}

/** Loads every font in the list (regular weight) so the picker can preview them. */
export function loadFontPreviews() {
  const id = "amuma-font-previews";
  if (document.getElementById(id)) return;
  const chunks: string[][] = [[], []];
  FONTS.forEach((f, i) => chunks[i % 2].push(f.name));
  chunks.forEach((names, i) => {
    const link = document.createElement("link");
    link.id = i === 0 ? id : `${id}-2`;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?" +
      names.map((n) => `family=${encodeURIComponent(n).replace(/%20/g, "+")}`).join("&") +
      "&display=swap";
    document.head.appendChild(link);
  });
}

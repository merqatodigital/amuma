import { resort } from "./resort";
import { restaurant } from "./restaurant";
import { portfolio } from "./portfolio";
import { agency } from "./agency";
import { blog } from "./blog";

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isPro: boolean;
  price: number;
  sections: { id: string; type: string; label: string; enabled: boolean }[];
  defaultTheme: {
    displayFont: string;
    bodyFont: string;
    headingScale: number;
    type: {
      heading: { weight: number; tracking: number; transform: string };
      brand: { weight: number; tracking: number; transform: string };
      eyebrow: { size: number; weight: number; tracking: number; transform: string };
      button: { size: number; weight: number; tracking: number; transform: string };
      nav: { size: number; weight: number; tracking: number; transform: string };
      body: { weight: number; lineHeight: number };
    };
    colors: {
      sand50: string; sand100: string; sand200: string; sand300: string; sand400: string;
      clay500: string; clay600: string;
      bark700: string; bark800: string; bark900: string;
    };
  };
  defaultNav: {
    brand: string;
    tagline: string;
    links: { label: string; href: string }[];
    ctaLabel: string;
    ctaHref: string;
  };
  defaultHero: {
    enabled: boolean;
    media: { type: string; image: string; video: string; youtube: string };
    overlay: number;
    title: string;
    tagline: string;
    headline: string;
    subline: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    scrollLabel: string;
  };
};

export const TEMPLATES: Record<string, TemplateMeta> = { resort, restaurant, portfolio, agency, blog };

export const FREE_TEMPLATES = Object.values(TEMPLATES).filter((t) => !t.isPro);

export const PRO_TEMPLATES = Object.values(TEMPLATES).filter((t) => t.isPro);

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES[id];
}

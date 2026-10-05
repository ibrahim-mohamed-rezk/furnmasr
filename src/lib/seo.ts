import type { Metadata } from "next";
import { Language } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/locale";

// Canonical origin is non-www (next.config.js 308-redirects www → non-www).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://furnmasr.com";

export const SITE_NAME = "Furnmasr";
const DEFAULT_OG_IMAGE = "/logo.png";

// The site is bilingual; Arabic is the primary/default language. Each page is
// served per-locale under /ar and /en, with hreflang alternates linking them.
const DEFAULT_TITLE =
  "فرنتشر مصر — أثاث يكمّل بيتك | Furnmasr";
const DEFAULT_DESCRIPTION =
  "فرنتشر مصر لأثاث المنزل والفنادق. اختيارات أنيقة وعملية من أطقم الأنتريهات والكنب المودرن وغرف النوم وقطع الديكور، بأسعار مميزة مع شحن سريع ودفع آمن. أثاث يكمّل بيتك مع فرنتشر مصر.";

const DEFAULT_TITLE_EN =
  "Furnmasr — Furniture That Completes Your Home";
const DEFAULT_DESCRIPTION_EN =
  "Furnmasr for home and hotel furniture. Elegant, practical selections of modern sectionals, living room sets, bedrooms and decor pieces at great prices, with fast shipping and secure payment.";

const OG_LOCALE: Record<Language, string> = {
  ar: "ar_EG",
  en: "en_US",
};

interface BuildMetadataInput {
  title?: string;
  description?: string;
  /** Logical path beginning with "/" (WITHOUT the locale prefix), e.g. "/shop". */
  path?: string;
  /** Active locale for this render. Drives canonical + og:locale. */
  lang?: Language;
  /**
   * Per-locale logical paths, used when the same page has different paths per
   * locale (e.g. product slugs). Falls back to `path` for any locale omitted.
   */
  localePaths?: Partial<Record<Language, string>>;
  image?: string | null;
  type?: "website" | "article";
  /** When true, emits noindex (for utility pages). */
  noindex?: boolean;
}

/** Clamp a string to a max length on a word boundary (best-effort). */
function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function absolute(url?: string | null): string {
  if (!url) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Build an absolute, locale-prefixed URL from a logical path. */
function localeUrl(lang: Language, path: string): string {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}/${lang}${clean}`;
}

/**
 * Single source of truth for page metadata: title, description, canonical,
 * hreflang alternates, Open Graph and Twitter card. Use in server components
 * via `generateMetadata({ params })` so the active `lang` (params.lang) can be
 * threaded through. Canonical is self-referencing per locale; `alternates.
 * languages` links ar/en plus an x-default pointing at the Arabic URL.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  lang = DEFAULT_LOCALE,
  localePaths,
  image,
  type = "website",
  noindex = false,
}: BuildMetadataInput = {}): Metadata {
  const pathFor = (l: Language) => localePaths?.[l] ?? path;

  const defaultTitle = lang === "en" ? DEFAULT_TITLE_EN : DEFAULT_TITLE;
  const defaultDescription =
    lang === "en" ? DEFAULT_DESCRIPTION_EN : DEFAULT_DESCRIPTION;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
  const desc = clamp(description || defaultDescription, 160);
  const canonical = localeUrl(lang, pathFor(lang));
  const ogImage = absolute(image);

  // hreflang map: one entry per supported locale + x-default (Arabic).
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localeUrl(l, pathFor(l));
  }
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, pathFor(DEFAULT_LOCALE));

  return {
    title: title ? clamp(title, 60) : defaultTitle,
    description: desc,
    alternates: { canonical, languages },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      type,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

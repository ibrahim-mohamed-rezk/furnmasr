import { Language } from "@/lib/i18n";

export const LOCALES: Language[] = ["ar", "en"];
export const DEFAULT_LOCALE: Language = "ar";

/**
 * Request header the middleware sets so server components (notably the root
 * layout) can read the active locale derived from the URL, without needing the
 * `[lang]` route param.
 */
export const LOCALE_HEADER = "x-furnmasr-locale";

/** Type guard: is `value` one of our supported locales? */
export function isLocale(value: string | undefined | null): value is Language {
  return value === "ar" || value === "en";
}

/**
 * Read the locale from the first path segment, e.g. "/ar/shop" -> "ar".
 * Returns DEFAULT_LOCALE when the path has no (valid) locale segment.
 */
export function getLocaleFromPathname(pathname: string): Language {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Strip a leading locale segment if present, returning the logical path
 * (always starting with "/"). "/ar/shop" -> "/shop", "/ar" -> "/", "/" -> "/".
 */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) {
    segments.shift();
  }
  return "/" + segments.join("/");
}

/**
 * Replace (or insert) the leading locale segment, preserving the rest of the
 * path. "/ar/shop" + "en" -> "/en/shop"; "/shop" + "en" -> "/en/shop".
 */
export function swapLocaleInPath(pathname: string, lang: Language): string {
  return localeHref(stripLocaleFromPathname(pathname), lang);
}

/**
 * Prefix an internal app path with the given locale. Idempotent and safe:
 * - external URLs, mailto/tel, protocol-relative, anchors and query-only hrefs
 *   are returned unchanged
 * - a path that already starts with a valid locale segment is returned unchanged
 * This lets us migrate links incrementally without risking double-prefixing.
 */
export function localeHref(path: string, lang: Language): string {
  if (!path) return path;

  // Leave non-internal or non-path hrefs alone.
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("//") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("#") ||
    path.startsWith("?")
  ) {
    return path;
  }

  // Normalize to a leading slash so "shop" and "/shop" behave the same.
  const normalized = path.startsWith("/") ? path : `/${path}`;

  // Already locale-prefixed -> idempotent no-op.
  const first = normalized.split("/").filter(Boolean)[0];
  if (isLocale(first)) {
    return normalized;
  }

  return normalized === "/" ? `/${lang}` : `/${lang}${normalized}`;
}

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from "@/lib/locale";

/**
 * Locale routing:
 * - `/`, `/shop`, ... (no locale segment)  -> 308 redirect to `/ar/...`
 * - `/fr/shop` (invalid locale segment)     -> 308 redirect to `/ar/shop`
 * - `/ar/...` or `/en/...`                  -> pass through, tagging the request
 *   with the LOCALE_HEADER so the layout can render the right lang/dir.
 *
 * The matcher below already excludes `_next`, API routes, the OAuth/payment
 * callbacks, SEO files and any path with a file extension, so those are never
 * prefixed. The existing www -> non-www redirect in next.config.js runs before
 * this proxy, so the two do not conflict.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (isLocale(first)) {
    // Already locale-prefixed: let it through, but expose the locale to RSCs.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, first);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // No (or invalid) locale segment. If the first segment is an unknown would-be
  // locale we drop it; otherwise we keep the whole path. Then prefix the default.
  const rest = first && first.length === 2 && !isLocale(first)
    ? "/" + segments.slice(1).join("/")
    : pathname;
  const normalizedRest = rest === "/" ? "" : rest;

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${normalizedRest}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on everything except Next internals, API routes, the OAuth/payment
  // callbacks (fixed provider-registered URLs that must stay unprefixed), the
  // SEO files, and any request that looks like a static file (has an extension).
  matcher: [
    "/((?!_next/|api/|auth/social-callback|payment/callback|sitemap.xml|robots.txt|llms.txt|favicon.ico|.*\\..*).*)",
  ],
};

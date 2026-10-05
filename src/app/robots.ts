import { MetadataRoute } from "next";

// Canonical origin is non-www (next.config.js 308-redirects www → non-www).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://furnmasr.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // User-flow pages are non-indexable. They now live under a locale
          // segment (/ar/..., /en/...), so disallow them under any locale as
          // well as the bare paths.
          "/account",
          "/cart",
          "/checkout",
          "/*/account",
          "/*/cart",
          "/*/checkout",
          "/auth/",
          "/payment/",
          "/api/",
          "/*?*", // duplicate/param URLs (filters, search, session_id, etc.)
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

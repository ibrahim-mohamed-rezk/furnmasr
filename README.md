# Furnmasr — فرنتشر مصر

Bilingual (Arabic / English) e-commerce storefront for **Furnmasr**, a home and
hotel furniture retailer. Arabic is the default locale, with full RTL support.

> _أثاث يكمّل بيتك_ — Furniture that completes your home.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 (strict) ·
Tailwind CSS 3 + shadcn/ui · TanStack Query 5 · NextAuth 4 · Zustand

The app is a pure frontend — all catalog, cart, order and account data comes from
an external REST API. The only route handler in the app is NextAuth.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the secrets
npm run dev              # http://localhost:3011
```

| Script             | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Dev server on port 3011               |
| `npm run build`    | Production build (`output: standalone`)|
| `npm run start`    | Serve the production build            |
| `npm run lint`     | ESLint 9, flat config                 |
| `npm run typecheck`| `tsc --noEmit`                        |

There is no test runner configured.

## Outstanding work

This storefront was forked from an existing codebase and rebranded. Three things
are still pointed at the old infrastructure and need swapping before launch:

1. **Backend API** — `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_API_BASE_URL` still
   resolve to the previous project's staging host, as do the fallback defaults in
   `src/constant/Base_Url.ts` and `src/app/sitemap.ts`, and the image
   `remotePatterns` in `next.config.js`.
2. **OAuth apps** — the Google and Facebook client IDs in `.env` belong to the
   previous project. Register Furnmasr apps and replace them.
3. **Photography** — every product, blog and marketing image now renders the
   neutral `public/placeholder-image.png` / `placeholder-wide.png`. Real Furnmasr
   photography needs to replace them (or arrive from the catalog API). Affected
   surfaces: hero slides, blog listings and cards, the home "special year"
   section, and both home pop-ups.

`deploy/README.md` describes the VPS deployment, but its hostnames, cPanel user
and paths are inherited from the previous project and are placeholders here.

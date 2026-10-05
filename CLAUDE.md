# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3011)
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # eslint . (ESLint 9 flat config, eslint-config-next)
npm run typecheck  # tsc --noEmit
```

There is no test runner configured — there are no tests in this repo.

There is no `postinstall` step. ESLint is pinned to **9.x** on purpose: ESLint 10 removed the legacy rule-context API that `eslint-plugin-react` (bundled by `eslint-config-next`) still calls, so linting crashes outright on 10. TypeScript is pinned to **5.9** for the same class of reason — `typescript-eslint` does not support TS 7 yet, and `eslint-config-next` fails to load against it.

## Architecture

Next.js 16 **App Router** e-commerce storefront (TypeScript strict, Tailwind + shadcn/ui). Bilingual Arabic/English with full RTL/LTR. The Next app is a pure frontend — all business data comes from an **external REST API**, not from Next API routes (the only route handler is NextAuth).

### Data flow — everything funnels through `src/lib/api.ts`
- `API_BASE_URL` (`src/constant/Base_Url.ts`) reads `NEXT_PUBLIC_API_BASE_URL`, defaulting to the staging domain.
- `src/lib/api.ts` is the single fetch wrapper. It injects auth (`Authorization: Bearer <token>`), language headers (`Accept-Language`, `X-Language`, `lang`), and parses errors. It also exports **all API response TypeScript interfaces** (`Product`, `Category`, `HomeData`, `CartResponse`, etc.) and a typed `api` object with per-endpoint methods.
- Components never call `fetch` or `api.*` directly. They go through two generic React Query hooks:
  - `useGetData<T>({ endpoint, queryKey, ... })` — GET with caching + error toasts.
  - `useMutate<TData, TVariables>({ endpoint, method, ... })` — POST/PUT/DELETE with success/error toasts.
- Domain hooks in `src/hooks/` (`useCart`, `useWishlist`, `useProducts`, `useCategories`, `useAddresses`, `useHomeData`, …) wrap those two for specific endpoints. Add new server interactions as a domain hook, not inline fetches.
- See `src/hooks/README.md` for the hook option reference.

### Language is part of cache identity
`useGetData` injects the active `language` into the React Query `queryKey`, so switching language refetches automatically. Note: despite exposing a `staleTime` option, the hook hardcodes `staleTime: 0` with `refetchOnMount: true` — **every GET refetches on mount**. Don't rely on cache persistence for freshness assumptions.

### i18n / RTL — locale is in the URL (`/ar`, `/en`)
- Custom JSON i18n: `src/locales/en.json` + `src/locales/ar.json`. Keys are dot-paths resolved by `src/lib/i18n.ts`. **Add every new key to both files.**
- **The active locale is the first URL segment.** All user-facing routes live under `src/app/[lang]/` (`/ar/shop`, `/en/shop`, …). `src/proxy.ts` (the Next 16 rename of `middleware.ts` — it exports `proxy`, not `middleware`) 308-redirects any unprefixed or invalid path to `/ar/...` (Arabic is `DEFAULT_LOCALE`) and tags the request with the `x-furnmasr-locale` header. The **root `src/app/layout.tsx`** reads that header (`await headers()`) and server-renders `<html lang dir className>` — no flash, no localStorage bootstrap script. Using `headers()` makes rendering dynamic for all routes (acceptable here).
- Routes that must **stay outside** `[lang]` (and are excluded by the proxy matcher): `api/`, `auth/social-callback`, `payment/callback`, `sitemap.ts`, `robots.ts`. OAuth/payment callback URLs are externally registered — don't move them under a locale.
- `useTranslation(namespace?)` for `t()`; `useLanguage()` (from `src/contexts/LanguageContext.tsx`) for `language`/`direction`/`setLanguage`. **`language` is derived from the pathname**, and `setLanguage(lang)` is a **navigation** (swaps the locale segment, preserves the query) — it no longer writes localStorage or mutates `document`.
- **Internal links:** use `LocalizedLink` (`@/components/Shared/LocalizedLink`, often imported `as Link`) instead of `next/link` — it prefixes string hrefs with the active locale. For imperative nav, wrap paths with `localeHref(path, language)` from `src/lib/locale.ts`. Both are idempotent. When comparing `usePathname()` against a route, strip the prefix with `stripLocaleFromPathname` first.
- **Metadata:** `buildMetadata({ ..., lang })` (`src/lib/seo.ts`) emits per-locale canonical + `ar`/`en`/`x-default` hreflang. Pages thread the locale via `generateMetadata({ params })`, awaiting it (`const { lang } = await params`) — `params` is a promise in Next 15+, and client pages that take route params unwrap them with React's `use()`; product pages pass `localePaths` (slug_ar/slug_en). `sitemap.ts` emits one entry per locale with `xhtml:link` alternates.
- For directional spacing prefer logical `ms-*`/`me-*` over `ml-*`/`mr-*`; flip directional icons with `rtl:rotate-180`.

### Auth & anonymous sessions (two parallel systems)
- **NextAuth v4** handles OAuth (Google/Facebook) via `src/app/api/auth/[...nextauth]/route.ts`, wired with `NextAuthProvider`.
- **`src/lib/auth.ts`** is a separate hand-rolled token store: the API bearer token lives in a **cookie** named `furnmasr_token` (via `authCookies`), user data in `localStorage` (`furnmasr_user_data`). `api.ts` reads the token from this cookie. `auth.ts` contains a hardcoded `DEFAULT_TOKEN`/`DEFAULT_USER_DATA` block — it is commented out; do not re-enable it.
- **Anonymous users**: `src/lib/simpleSession.ts` generates a `session_id` (localStorage `furnmasr_session_id`). Cart/wishlist API calls pass `session_id` as `additionalData` when no token is present, so guest carts work. Preserve this branching when editing cart/wishlist code.

### Provider nesting (`src/app/layout.tsx`)
`QueryProvider → LanguageProvider → AuthInitializer → NextAuthProvider → ThemeProvider`. Anything needing language/query/auth context must render inside this tree. Header/Footer are wrapped in `<Suspense>` (they use `useSearchParams`-style client hooks).

### State management
- **Server state**: React Query (the default for anything from the API).
- **Client state**: Zustand, used minimally (`src/store/` — `buyNow`, `cartSheet`). No provider is needed; import the store hook directly. Don't introduce a store for data that belongs in React Query. (This replaced Recoil, which reads React internals that React 19 removed and is archived upstream.)

### SEO metadata (server wrappers)
Per-page `<title>`/`<meta>`/OG/canonical require **Server Components** — they can't be emitted from a `"use client"` page. The pattern here: `page.tsx` is a thin Server Component that exports `generateMetadata({ params })` (awaiting it for `lang`) built via `buildMetadata()` in `src/lib/seo.ts`, and renders the actual UI as a `*Client.tsx` child (e.g. `HomeClient`, `ShopClient`, `ContactClient`, static pages' `PageClient.tsx`). **Don't add `"use client"` to a `page.tsx` that exports metadata.** Metadata is now **per-locale**: title/description follow the awaited `lang`, with per-locale canonical and `ar`/`en`/`x-default` hreflang (see the i18n section). `robots.ts` and `sitemap.ts` use the **non-www** canonical origin to match the `next.config.js` www→non-www redirect.

### Routing layout
Pages live under `src/app/<route>/page.tsx`. Feature-local components are colocated (e.g. `src/app/checkout/Components/`, `src/app/account/components/`). Cross-feature/shared components live under `src/components/` (`ui/` = shadcn primitives, `layout/`, `Products/`, `Home/`, `Cart/`, `Wishlist/`, `Auth/`). Product detail is `src/app/shop/[slug]/page.tsx`.

## Conventions

- Import alias `@/*` → `src/*`.
- `"use client"` on any component using hooks/browser APIs/handlers. `page.tsx` = default export; other components = named exports.
- Tailwind only; use `cn()` from `@/lib/utils` for conditional classes. Use semantic color tokens (`bg-primary`, `text-foreground`, `bg-muted`, …) — primary is olive green; never hardcode hex.
- Forms: React Hook Form + Zod + shadcn `Form*` wrappers. Define Zod schemas inside the component when error messages need `t()`.
- Toasts: always `sonner` (`toast.success` / `toast.error`).
- `next/image` requires the remote host be allow-listed in `next.config.js` `images.remotePatterns` — add new image CDNs there.

A fuller conventions/patterns reference (with code snippets) already exists at **`.kiro/skills/project-context.md`** — consult it for component/styling/form details before adding new patterns.

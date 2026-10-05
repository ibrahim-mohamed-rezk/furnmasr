import type { Metadata } from "next";
import { Inter, El_Messiri } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { Header } from "@/components/layout/Header/header";
import { Footer } from "@/components/layout/Footer/footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import QueryProvider from "@/components/Providers/QueryProvider";
import { AuthInitializer } from "@/components/Providers/AuthInitializer";
import NextAuthProvider from "@/components/Providers/NextAuthProvider";
import { Suspense } from "react";
import FloatedSocial from "@/components/Shared/FloatedSocial/FloatedSocial";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from "@/lib/locale";
import { getDirection } from "@/lib/i18n";
import { API_BASE_URL } from "@/constant/Base_Url";

// Origin that serves both the REST API and product/hero images. Preconnecting
// shaves the connection setup off the critical path (the /home fetch and the
// hero LCP image both come from here).
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "https://ghoran.test-domain-devunity.com";
  }
})();

const inter = Inter({ subsets: ["latin"] });

// El Messiri is the primary Arabic font. Self-hosted via next/font (instead of
// a render-blocking @import of Google Fonts in globals.css) so it ships from our
// origin with no extra request chain and no font-swap layout shift.
const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase lets Next resolve relative OG/canonical URLs to absolute ones.
  metadataBase: new URL(SITE_URL),
  // Default metadata for any page that doesn't export its own. Per-page
  // server components override title/description/OG via buildMetadata().
  ...buildMetadata({ path: "/" }),
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale is resolved server-side from a header the middleware sets off the URL
  // (/ar/... or /en/...). This lets us render the correct lang/dir in the initial
  // HTML with no client flash — replacing the old localStorage bootstrap script.
  const headerLang = (await headers()).get(LOCALE_HEADER);
  const lang = isLocale(headerLang) ? headerLang : DEFAULT_LOCALE;
  const dir = getDirection(lang);

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${dir} ${elMessiri.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={API_ORIGIN} />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground dark:bg-gradient-to-br dark:from-background dark:to-muted/20 selection:bg-primary/30 dark:selection:bg-primary/50 transition-colors duration-300 ease-in-out`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5LT74GC8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
          <QueryProvider>
            <LanguageProvider initialLang={lang}>
              <AuthInitializer />
              <NextAuthProvider>
                {/*
                  Dark mode is temporarily disabled: the app is locked to light
                  via `forcedTheme`. All `dark:` utility classes and the
                  ThemeToggle component are intentionally kept in the codebase.
                  To bring dark mode back, drop `forcedTheme`, restore
                  defaultTheme="system" + enableSystem, and re-enable the
                  <ThemeToggle /> in src/components/layout/Header/header.tsx.
                */}
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  forcedTheme="light"
                  enableSystem={false}
                  disableTransitionOnChange
                >
                  <div className="">
                    <Suspense
                      fallback={
                        <div className="h-16 bg-muted animate-pulse"></div>
                    }
                  >
                    <Header />
                    <FloatedSocial />
                  </Suspense>
                  <main className="flex-1">{children}</main>
                  <Suspense
                    fallback={
                      <div className="h-64 bg-muted animate-pulse"></div>
                    }
                  >
                    <Footer />
                  </Suspense>
                </div>
                </ThemeProvider>
              </NextAuthProvider>
            </LanguageProvider>
          </QueryProvider>

        {/*
          Marketing / analytics tags. All loaded with next/script `lazyOnload`
          (after the page is idle) so their main-thread work stays out of the
          critical load window — they are not needed for first paint/interaction
          and were the dominant contributor to Total Blocking Time.
        */}
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5LT74GC8');`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SRNHM165PJ"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SRNHM165PJ');`}
        </Script>

        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w2627au23t");`}
        </Script>

        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`!function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
            ttq.load('D8T6NCBC77U9SPNILDMG');
            ttq.page();
          }(window, document, 'ttq');`}
        </Script>
      </body>
    </html>
  );
}

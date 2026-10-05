import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import type { ApiResponse, HomeData } from "@/lib/api";
import { API_BASE_URL } from "@/constant/Base_Url";
import HomeClient from "./HomeClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Furnmasr — Furniture That Completes Your Home"
    : "فرنتشر مصر — أثاث يكمّل بيتك",
  description: en
    ? "Furnmasr for home and hotel furniture. A wide selection of modern sectionals, living room sets, bedrooms and decor pieces at great prices, with fast shipping and secure payment."
    : "فرنتشر مصر لأثاث المنزل والفنادق. تشكيلة واسعة من الأنتريهات والكنب المودرن وغرف النوم وقطع الديكور بأسعار مميزة مع شحن سريع ودفع آمن.",
  path: "/",
    lang,
  });
}

/**
 * Fetch the home payload on the server so the hero (the mobile LCP element) is in
 * the initial HTML and gets preloaded — instead of waiting for client hydration +
 * a client-side fetch. `no-store` keeps the data correct per locale (the response
 * varies by language header, which Next's fetch cache does not key on). A short
 * timeout means a slow API degrades gracefully to the client-side fetch rather
 * than blocking TTFB.
 */
async function fetchHomeData(
  lang: Language
): Promise<ApiResponse<HomeData> | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/home`, {
      headers: { "Accept-Language": lang, "X-Language": lang, lang },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return undefined;
    return (await res.json()) as ApiResponse<HomeData>;
  } catch {
    return undefined;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const initialData = await fetchHomeData(lang);
  return <HomeClient initialData={initialData} />;
}

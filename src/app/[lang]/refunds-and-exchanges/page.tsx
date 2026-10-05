import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import RefundsAndExchangesPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Refunds & Exchanges — Furnmasr"
    : "الاسترجاع والاستبدال — فرنتشر مصر",
  description: en
    ? "Everything you need to know about refunds and exchanges at Furnmasr for furniture: conditions, timeframes, and how to return or exchange your order."
    : "كل ما تحتاج معرفته عن الاسترجاع والاستبدال في فرنتشر مصر للأثاث: الشروط، المدد، وخطوات إرجاع أو استبدال طلبك.",
  path: "/refunds-and-exchanges",
    lang,
  });
}

export default function Page() {
  return <RefundsAndExchangesPage />;
}

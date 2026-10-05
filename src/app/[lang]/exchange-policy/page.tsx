import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import ExchangePolicyPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Exchange Policy — Furnmasr"
    : "سياسة الاستبدال — فرنتشر مصر",
  description: en
    ? "Read Furnmasr's exchange policy for furniture, including the conditions and timeframes for exchanging products after purchase."
    : "اطلع على سياسة الاستبدال في فرنتشر مصر للأثاث، وشروط ومدد استبدال المنتجات بعد الشراء.",
  path: "/exchange-policy",
    lang,
  });
}

export default function Page() {
  return <ExchangePolicyPage />;
}

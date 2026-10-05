import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import ShippingPolicyPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Shipping Policy — Furnmasr"
    : "سياسة الشحن — فرنتشر مصر",
  description: en
    ? "Furnmasr shipping policy: delivery areas, shipping times, and delivery fees for furniture orders."
    : "تفاصيل سياسة الشحن في فرنتشر مصر: مناطق التوصيل، مدة الشحن، ورسوم التوصيل لطلبات الأثاث.",
  path: "/shipping-policy",
    lang,
  });
}

export default function Page() {
  return <ShippingPolicyPage />;
}

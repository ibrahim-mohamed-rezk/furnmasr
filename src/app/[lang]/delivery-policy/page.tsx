import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import DeliveryPolicyPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Delivery Policy — Furnmasr"
    : "سياسة التوصيل — فرنتشر مصر",
  description: en
    ? "Learn about Furnmasr's delivery policy, expected delivery times, and terms for delivering furniture orders to your address."
    : "تعرف على سياسة التوصيل في فرنتشر مصر، وأوقات التسليم المتوقعة وشروط توصيل طلبات الأثاث إلى عنوانك.",
  path: "/delivery-policy",
    lang,
  });
}

export default function Page() {
  return <DeliveryPolicyPage />;
}

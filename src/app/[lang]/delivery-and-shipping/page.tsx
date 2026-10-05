import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import DeliveryAndShippingPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Delivery & Shipping — Furnmasr"
    : "التوصيل والشحن — فرنتشر مصر",
  description: en
    ? "Delivery and shipping information at Furnmasr: coverage areas, delivery times, and shipping fees for furniture orders."
    : "معلومات التوصيل والشحن في فرنتشر مصر: مناطق التغطية، مدة التوصيل، ورسوم الشحن لطلبات الأثاث.",
  path: "/delivery-and-shipping",
    lang,
  });
}

export default function Page() {
  return <DeliveryAndShippingPage />;
}

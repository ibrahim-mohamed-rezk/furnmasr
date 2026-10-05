import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import ShopClient from "./ShopClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Shop Furniture — Furnmasr"
    : "تسوق الأثاث — فرنتشر مصر",
  description: en
    ? "Browse Furnmasr's full collection of modern sectionals, bedrooms and home decor. Filter by category and price, with fast shipping and secure payment."
    : "تصفح تشكيلة فرنتشر مصر الكاملة من الأنتريهات والكنب المودرن وغرف النوم وقطع الديكور. فلترة حسب الفئة والسعر، مع شحن سريع ودفع آمن.",
  path: "/shop",
    lang,
  });
}

export default function ShopPage() {
  return <ShopClient />;
}

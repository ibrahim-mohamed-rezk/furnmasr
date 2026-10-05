import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import FlashSalePage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Furniture Deals & Discounts — Furnmasr"
    : "عروض وتخفيضات الأثاث — فرنتشر مصر",
  description: en
    ? "Grab Furnmasr's limited-time deals on premium furniture. Exclusive discounts for a limited time — shop before the offer ends."
    : "اغتنم عروض فرنتشر مصر المحدودة على الأثاث المميز. تخفيضات حصرية لفترة محدودة — تسوق قبل انتهاء العرض.",
  path: "/flash-sale",
    lang,
  });
}

export default function Page() {
  return <FlashSalePage />;
}

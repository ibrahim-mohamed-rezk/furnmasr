import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import DataDeletionPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Data Deletion — Furnmasr"
    : "حذف البيانات — فرنتشر مصر",
  description: en
    ? "Learn how to request deletion of your personal data from Furnmasr and the steps we take to protect your privacy."
    : "تعرف على كيفية طلب حذف بياناتك الشخصية من فرنتشر مصر والخطوات المتبعة لحماية خصوصيتك.",
  path: "/data-deletion",
  noindex: true,
    lang,
  });
}

export default function Page() {
  return <DataDeletionPage />;
}

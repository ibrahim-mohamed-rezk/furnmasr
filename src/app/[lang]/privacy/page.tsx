import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import PrivacyPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Privacy Policy — Furnmasr"
    : "سياسة الخصوصية — فرنتشر مصر",
  description: en
    ? "Learn how Furnmasr collects, uses, and protects your personal data when you shop for furniture."
    : "تعرف على سياسة الخصوصية في فرنتشر مصر وكيفية جمع بياناتك واستخدامها وحمايتها عند التسوق من متجرنا للأثاث.",
  path: "/privacy",
    lang,
  });
}


export default function Page() {
  return <PrivacyPage />;
}

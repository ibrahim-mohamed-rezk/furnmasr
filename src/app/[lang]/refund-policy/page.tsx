import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import RefundPolicyPage from "./PageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Refund Policy — Furnmasr"
    : "سياسة الاسترجاع — فرنتشر مصر",
  description: en
    ? "Read Furnmasr's refund policy for furniture, including the conditions and timeframes for returning products."
    : "اطلع على سياسة الاسترجاع واسترداد المبالغ في فرنتشر مصر للأثاث، والشروط والمدد الخاصة بإرجاع المنتجات.",
  path: "/refund-policy",
    lang,
  });
}

export default function Page() {
  return <RefundPolicyPage />;
}

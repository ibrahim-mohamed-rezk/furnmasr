import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import ContactClient from "./ContactClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Contact Us — Furnmasr"
    : "تواصل معنا — فرنتشر مصر",
  description: en
    ? "Get in touch with Furnmasr for furniture. Send your inquiry via our contact form or visit our store. We're happy to help and answer all your questions."
    : "تواصل مع فرنتشر مصر للأثاث. أرسل استفسارك عبر نموذج التواصل أو زر متجرنا. نسعد بخدمتك والإجابة على جميع أسئلتك.",
  path: "/contact",
    lang,
  });
}

export default function ContactPage() {
  return <ContactClient />;
}

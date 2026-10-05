import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import BlogsPage from "./BlogsPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return buildMetadata({
  title: en
    ? "Blog — Furniture & Interior Articles | Furnmasr"
    : "المدونة — مقالات عن الأثاث والديكور | فرنتشر مصر",
  description: en
    ? "Explore Furnmasr's articles about furniture, interior styling, and how to choose pieces that fit your space. Tips and insights from our design team."
    : "اكتشف مقالات فرنتشر مصر عن الأثاث والديكور وطرق اختيار القطع المناسبة لمساحتك. نصائح ومعلومات من فريق التصميم لدينا.",
  path: "/blogs",
    lang,
  });
}

export default function Blogs() {
  return (
    <section>
      <BlogsPage />
    </section>
  );
}

import type { Metadata } from "next";
import { api } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/lib/i18n";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{
    lang: Language;
    slug: string;
  }>;
}

/**
 * Build per-product metadata from API data, in the URL's locale. Emits per-locale
 * hreflang alternates using the product's localized slugs (slug_ar / slug_en) so
 * /ar and /en point at the correct slug for each language. Falls back to a generic
 * product title on error.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const path = `/shop/${slug}`;
  try {
    const res = await api.getSingleProduct(slug, lang);
    const product = res?.data?.product;

    if (!product) {
      return buildMetadata({ path, lang });
    }

    const description =
      product.meta_description ||
      product.short_description ||
      product.description ||
      undefined;

    const image = Array.isArray(product.image)
      ? product.image[0]
      : product.image;

    // Per-locale slugs so each hreflang alternate resolves to the right URL.
    const arSlug = product.slug_ar || slug;
    const enSlug = product.slug_en || slug;

    return buildMetadata({
      title: product.meta_title || product.name,
      description: description ?? undefined,
      path,
      lang,
      localePaths: {
        ar: `/shop/${arSlug}`,
        en: `/shop/${enSlug}`,
      },
      image: image ?? undefined,
      type: "article",
    });
  } catch {
    return buildMetadata({ path, lang });
  }
}

export default function ProductPage(_props: ProductPageProps) {
  return <ProductPageClient />;
}

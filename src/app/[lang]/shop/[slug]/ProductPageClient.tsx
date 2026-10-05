"use client";
import ProductInfoPage from "@/components/Products/ProductDetails/ProductInfoPage";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";

export default function ProductPageClient() {
  const { t } = useTranslation("shop");
  return (
    <section className="relative">
      <FloatedShapes height="800px" />
      <div className="head py-10 border-b border-black flex justify-center items-center">
        <h3 className="text-2xl md:text-3xl font-[800] font-title max-w-5xl mx-auto px-6 uppercase">
          <Link
            href="/"
            className="hover:text-primary transition-all duration-300"
          >
            {t("home")}
          </Link>
          <span className="mx-4">/</span>
          <span className="cursor-default">{t("product")}</span>
        </h3>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <ProductInfoPage t={t} />
      </div>
    </section>
  );
}

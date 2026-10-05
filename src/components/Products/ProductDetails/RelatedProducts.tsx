import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "@/hooks/useTranslation";
import { Product } from "@/lib/api";

interface RelatedProductsProps {
  products: Product[];
}

function RelatedProducts({ products }: RelatedProductsProps) {
  const { t } = useTranslation("shop");

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="related-products mb-12 md:mb-20 px-4 sm:px-6">
      <div className="head flex items-center justify-center mb-6 md:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center">
          {t("explore_related_products")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products
          .map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product as any,
                rating:
                  product?.reviews?.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product?.reviews?.length || 0,
              }}
            />
          ))
          .slice(0, 4)}
      </div>
    </section>
  );
}

export default RelatedProducts;

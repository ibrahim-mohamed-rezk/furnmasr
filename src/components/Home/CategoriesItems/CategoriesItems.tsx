import React from "react";
import HomeProductsSection from "../HomeProductsSection/HomeProductsSection";
import { Product } from "@/lib/api";
import { getProductMainImage, getProductHoverImage } from "@/lib/productImages";
// import { useTranslation } from "@/hooks/useTranslation";

interface BestSellerProps {
  translatedTitle?: boolean;
  title?: string;
  productsData?: Product[];
  tab?: number;
}

function CategoriesItems({
  translatedTitle = false,
  title,
  productsData,
  tab,
}: BestSellerProps) {
  // const { t } = useTranslation("home");

  // Transform API products to match the expected format
  const products =
    productsData && productsData.length > 0
      ? productsData.map((product) => {
          const image = getProductMainImage(product);
          return {
          id: product.id,
          name: product.name,
          price: product.price,
          sale_price: product.sale_price,
          image,
          hoverImage: getProductHoverImage(product, image),
          gallery: product.gallery,
          category: product.category?.name || "Category",
          qty: product.stock,
          slug: product.slug,
          rating:
            product.reviews && product.reviews.length > 0
              ? product.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / product.reviews.length
              : 4.5,
          // Only set oldPrice if there's an actual sale price (not null/undefined)
          oldPrice:
            product.sale_price && product.sale_price !== null
              ? parseFloat(product.sale_price)
              : undefined,
        };
        })
      : [];

  if (products.length === 0) {
    return null;
  }

  return (
    <HomeProductsSection
      title={translatedTitle ? title || "" : "best_seller"}
      translatedTitle={translatedTitle}
      products={products}
      btnClass={`best-seller-${tab}`}
      tab={tab}
    />
  );
}

export default CategoriesItems;

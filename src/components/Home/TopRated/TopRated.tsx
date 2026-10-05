import React from "react";
import HomeProductsSection from "../HomeProductsSection/HomeProductsSection";
import { Product } from "@/lib/api";
import { getProductMainImage, getProductHoverImage } from "@/lib/productImages";

interface TopRatedProps {
  productsData?: Product[];
}

function TopRated({ productsData }: TopRatedProps) {
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
          category: product.category?.name,
          qty: product.stock,
          slug: product.slug,
          rating:
            product.reviews && product.reviews.length > 0
              ? product.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / product.reviews.length
              : 0,
          // Only set oldPrice if there's an actual sale price (not null/undefined)
          oldPrice:
            product.sale_price && product.sale_price !== null
              ? parseFloat(product.sale_price)
              : undefined,
        };
        })
      : [];

  return (
    <HomeProductsSection
      title="top_rated"
      products={products}
      btnClass="top-rated"
    />
  );
}

export default TopRated;

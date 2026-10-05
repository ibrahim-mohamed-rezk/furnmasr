import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import React from "react";

function ViewedProducts() {
  const { data: products } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-2 px-6 pb-20 pt-10">
      <div className="head flex justify-center items-center mb-14">
        <h3 className="text-2xl md:text-3xl font-[800] font-title text-center">
          Explore Recently Viewed Products
        </h3>
      </div>

      <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.data?.products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product as any}
          />
        )).slice(0, 4)}
      </div>
    </div>
  );
}

export default ViewedProducts;

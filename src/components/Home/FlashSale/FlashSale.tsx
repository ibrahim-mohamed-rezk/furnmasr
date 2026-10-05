"use client";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { flashSaleProducts } from "@/components/Products/DummyProductsData/DummyProductsData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FlashSaleItem } from "@/lib/api";

function FlashSale({ flashSaleData }: { flashSaleData?: FlashSaleItem[] }) {
  const { t } = useTranslation("home");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Calculate time based on valid_to date from API
    const calculateTimeLeft = () => {
      if (!flashSaleData || flashSaleData.length === 0) return;

      // Use the first flash sale item's valid_to date
      const endDate = new Date(flashSaleData[0].valid_to);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Flash sale has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSaleData]);

  // Transform API flash sale data to match the expected format
  const products =
    flashSaleData && flashSaleData.length > 0
      ? flashSaleData.map((flashItem) => {
          const product = flashItem.product;
          const originalPrice = parseFloat(product.price);
          let salePrice = originalPrice;
          let oldPrice: string | null = null;

          // Calculate sale price based on discount type
          if (flashItem.discount_type === "percent") {
            const discountPercent = parseFloat(flashItem.value);
            const discountAmount = (originalPrice * discountPercent) / 100;
            salePrice = originalPrice - discountAmount;
            oldPrice = product.price; // Use original price as old price
          } else if (flashItem.discount_type === "fixed") {
            const discountAmount = parseFloat(flashItem.value);
            salePrice = originalPrice - discountAmount;
            oldPrice = product.price; // Use original price as old price
          }

          const image =
            (typeof product.image === "string" ? product.image : "") ||
            product.gallery?.[0] ||
            "";
          const hoverImage =
            product.gallery?.[1] ||
            (Array.isArray(product.image) ? product.image[1] : "") ||
            "";

          return {
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            price: product.price,
            sale_price: product.sale_price,
            stock: product.stock,
            min_stock: product.min_stock,
            manage_stock: product.manage_stock,
            stock_status: product.stock_status,
            status: product.status,
            image,
            hoverImage,
            gallery: product.gallery,
            weight: product.weight,
            dimensions: product.dimensions,
            featured: product.featured,
            attributes: product.attributes,
            category_id: product.category_id,
            name: product.name,
            rating: product.reviews?.length > 0 ? product.reviews.reduce((acc: any, review: { rating: any; } ) => acc + review.rating, 0) / product.reviews.length : 0,
            description: product.description,
            short_description: product.short_description,
            meta_title: product.meta_title,
            meta_description: product.meta_description,
            category:
              product.category?.name || product.category || product.slug || "Uncategorized",
            product_offers: [], // Not available in flash sale product data
            reviews: [], // Not available in flash sale product data
          };
        })
      : [];

  // Hide the section if no flash sale products or if flash sale has ended
  if (!flashSaleData || flashSaleData.length === 0) {
    return null;
  }

  // Check if flash sale has ended
  const hasEnded =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <section className="flash-sale max-w-7xl mx-auto px-6 py-20">
      {products?.length >= 5 && (
        <div className="head mb-10 flex flex-col items-center gap-2">
          <h2 className="md:text-4xl text-3xl font-bold flex items-center gap-2">
            {t("flash_sale")}{" "}
            <Image
              src="/fire.png"
              alt="flash-sale"
              width={700}
              height={700}
              className="w-8 h-8 object-contain"
            />
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground font-bold capitalize text-center">
            {hasEnded ? (
              <span className="text-red-500">{t("flash_sale_ended")}</span>
            ) : (
              <>
                {t("ends_in")}{" "}
                <span className="text-red-500">
                  {timeLeft.days > 0 && `${timeLeft.days}${t("d")} `}
                  {String(timeLeft.hours).padStart(2, "0")}
                  {t("h")} {String(timeLeft.minutes).padStart(2, "0")}
                  {t("m")} {String(timeLeft.seconds).padStart(2, "0")}
                  {t("s")}
                </span>{" "}
                — {t("dont_miss_out")}
              </>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">
        {products?.length >= 5 && (
          <div className="p-left w-full lg:flex-1 lg:min-w-0">
            <div className="products lg:space-y-10 grid grid-cols-2 lg:grid-cols-1 gap-4">
              {products
                .slice(1, 3) // Skip first item, take items 2-3
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    cardSlug={"flash-sale"}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="main w-full lg:flex-[2] lg:min-w-0">
          {products?.length < 5 && (
            <div className="head mb-10 flex flex-col items-center gap-2">
              <h2 className="md:text-4xl text-3xl font-bold flex items-center gap-2">
                {t("flash_sale")}{" "}
                <Image
                  src="/fire.png"
                  alt="flash-sale"
                  width={700}
                  height={700}
                  className="w-8 h-8 object-contain"
                />
              </h2>
              <p className="text-lg md:text-2xl text-muted-foreground font-bold capitalize text-center">
                {hasEnded ? (
                  <span className="text-red-500">{t("flash_sale_ended")}</span>
                ) : (
                  <>
                    {t("ends_in")}{" "}
                    <span className="text-red-500">
                      {timeLeft.days > 0 && `${timeLeft.days}${t("d")} `}
                      {String(timeLeft.hours).padStart(2, "0")}
                      {t("h")} {String(timeLeft.minutes).padStart(2, "0")}
                      {t("m")} {String(timeLeft.seconds).padStart(2, "0")}
                      {t("s")}
                    </span>{" "}
                    — {t("dont_miss_out")}
                  </>
                )}
              </p>
            </div>
          )}
          <div
            className={`products ${
              products?.length < 5
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                : "space-y-10"
            }`}
          >
            {products
              .slice(0, products?.length >= 5 ? 1 : 4) // Show only the first item in center
              .map((product) => (
                <ProductCard
                  key={product.id}
                  isSpecial={true}
                  product={product as any}
                  cardSlug={"flash-sale"}
                />
              ))}
          </div>

          <div className="all-products flex justify-center items-center mt-5">
            <Link href="/flash-sale">
              <Button className="bg-black text-white rounded-sm transition-all duration-300 capitalize md:h-11 rounded-none">
                {t("view_all_products")}
              </Button>
            </Link>
          </div>
        </div>

        {products?.length >= 5 && (
          <div className="pro-right w-full lg:flex-1 lg:min-w-0">
            <div className="products lg:space-y-10 grid grid-cols-2 lg:grid-cols-1 gap-4">
              {products
                .slice(3, 5) // Take items 4-5 (if they exist)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    cardSlug={"flash-sale"}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FlashSale;

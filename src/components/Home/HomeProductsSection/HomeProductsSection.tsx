"use client";

import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { canLoop } from "@/lib/swiper";

function HomeProductsSection({
  title,
  products = [],
  btnClass = "",
  translatedTitle = false,
  tab,
}: {
  title: string;
  products?: any[];
  btnClass?: string;
  translatedTitle?: boolean;
  tab?: number | string;
}) {
  const { direction } = useLanguage();
  const { t } = useTranslation("home");

  // Ensure we always have at least 4 products for the slider
  // Distribute products evenly with disabled duplicates
  const getDisplayProducts = () => {
    if (products.length >= 4) {
      return products.map((product) => ({ ...product, isOriginal: true }));
    }

    if (products.length === 0) {
      return [];
    }

    // For 3 products, duplicate the first one to make 4 (disabled)
    if (products.length === 3) {
      return [
        ...products.map((product) => ({ ...product, isOriginal: true })),
        {
          ...products[0],
          id: `${products[0].id}-duplicate`,
          isOriginal: false,
        },
      ];
    }

    // For 2 products, duplicate both to make 4 (disabled)
    if (products.length === 2) {
      return [
        ...products.map((product) => ({ ...product, isOriginal: true })),
        {
          ...products[0],
          id: `${products[0].id}-duplicate1`,
          isOriginal: false,
        },
        {
          ...products[1],
          id: `${products[1].id}-duplicate1`,
          isOriginal: false,
        },
      ];
    }

    // For 1 product, duplicate it 3 times to make 4 (disabled)
    if (products.length === 1) {
      return [
        { ...products[0], isOriginal: true },
        {
          ...products[0],
          id: `${products[0].id}-duplicate1`,
          isOriginal: false,
        },
        {
          ...products[0],
          id: `${products[0].id}-duplicate2`,
          isOriginal: false,
        },
        {
          ...products[0],
          id: `${products[0].id}-duplicate3`,
          isOriginal: false,
        },
      ];
    }

    return products.map((product) => ({ ...product, isOriginal: true }));
  };

  const displayProducts = getDisplayProducts();

  // The padding above tops out at exactly 4 slides, but the widest breakpoint
  // also shows 4 — loop mode needs a 5th. Below that, loop is a no-op anyway
  // since every slide is already on screen.
  const shouldLoop = canLoop(displayProducts.length, 4);

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      <div className="head flex justify-between items-center mb-14">
        <div className="">
          <h2 className="text-3xl font-[700]">
            {translatedTitle ? title : t(title)}
          </h2>
        </div>

        <div className="swiper-button flex items-center gap-2">
          <PrevButton className={`${btnClass}-swiper-prev-btn`} />
          <NextButton className={`${btnClass}-swiper-next-btn`} />
        </div>
      </div>

      {/* Reserve the slider's height so the section doesn't grow (and shove the
          rest of the page down) when products arrive from the API — this was the
          main Cumulative Layout Shift culprit on the homepage. */}
      <div className="swiper-container min-h-[360px] md:min-h-[460px]">
        <div className="swiper-wrapper">
          <Swiper
            key={`${direction}-swiper`} // Force re-initialization when direction changes
            dir={direction}
            slidesPerView={4}
            spaceBetween={30}
            navigation={{
              prevEl: `.${btnClass}-swiper-prev-btn`,
              nextEl: `.${btnClass}-swiper-next-btn`,
            }}
            autoplay={
              shouldLoop ? { delay: 5000, disableOnInteraction: true } : false
            }
            loop={shouldLoop}
            modules={[Navigation, Autoplay]}
            className="mySwiper"
            style={{ direction: direction }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            {displayProducts.map((product, index) => (
              <SwiperSlide key={`${product.id}-${index}`}>
                <div
                  className={`${
                    !product.isOriginal ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="all-products flex justify-center items-center mt-16">
        <Link href={`/shop?${tab ? "category=" + tab : ""}`}>
          <Button
            size="lg"
            className="bg-black text-white rounded-sm transition-all duration-300 capitalize md:h-12"
          >
            {t("view_all_products")}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default HomeProductsSection;

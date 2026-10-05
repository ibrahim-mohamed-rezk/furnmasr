"use client";

import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Category } from "@/lib/api";
import { canLoop } from "@/lib/swiper";

interface CategoriesProps {
  categoriesData?: Category[];
}

function Categories({ categoriesData }: CategoriesProps) {
  const { direction } = useLanguage();
  const { t } = useTranslation("home");

  // Use API data if available, otherwise use default data
  const categories =
    categoriesData && categoriesData.length > 0
      ? categoriesData?.map((category, index) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image || `/categories/${(index % 5) + 1}.png`, // Use default images based on index
          custom: false, // Alternate custom styling
        }))
      : [];

  // The mobile slider peaks at 6 slides per view (768px breakpoint).
  const shouldLoop = canLoop(categories.length, 6);

  return (
    <section className="bg-[#EDE7E080] dark:bg-[#101f16] py-5 text-center">
      <div className="px-10 xl:px-28 hidden lg:block">
        <h2 className="text-4xl font-[700] mb-10">{t("top_categories")}</h2>
        <div className="w-full flex items-center justify-center">
          <ul
            className={`w-full flex items-center ${
              categories.length > 4 ? "justify-center" : "justify-center"
            } gap-5 lg:gap-10`}
          >
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/shop?category=${category.id}`}>
                  <div className=" bg-background w-[144px] h-[144px] overflow-hidden flex items-center justify-center rounded-full shadow-lg dark:shadow-none dark:border-2 dark:border-[#3a4d3d] mb-2">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className={`w-full h-full ${
                        category.custom ? "px-5" : ""
                      } object-cover`}
                    />
                  </div>
                </Link>

                <Link href={`/shop?category=${category.id}`}>
                  <p className="text-lg font-[700] uppercase">
                    {category.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="slider lg:hidden">
        <div className="head mb-2 flex flex-col items-center justify-center gap-5">
          <h2 className="md:text-4xl text-2xl font-[700]">
            {t("top_categories")}
          </h2>
        </div>

        <div className="relative">
          <PrevButton className={`categories-prev-button absolute top-[40px] -translate-y-1/2 z-10 ${direction === "rtl" ? "right-2" : "left-2"}`} />
          <NextButton className={`categories-next-button absolute top-[40px] -translate-y-1/2 z-10 ${direction === "rtl" ? "left-2" : "right-2"}`} />

        <Swiper
          key={direction} // Force re-initialization when direction changes
          dir={direction}
          navigation={{
            prevEl: ".categories-prev-button",
            nextEl: ".categories-next-button",
          }}
          slidesPerView={3}
          autoplay={
            shouldLoop ? { delay: 5000, disableOnInteraction: false } : false
          }
          loop={shouldLoop}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          style={{ direction: direction }}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            320: {
              slidesPerView: 3,
            },
            460: {
              slidesPerView: 4,
            },
            576: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 6,
            },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="">
              <div className="flex flex-col items-center justify-center">
                <Link href={`/shop?category=${category.id}`}>
                  <div className=" bg-background rounded-full overflow-hidden flex items-center justify-center w-[80px] h-[80px] shadow-lg dark:shadow-none dark:border-2 dark:border-[#3a4d3d] mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className={`w-full h-full object-cover ${
                        category.custom ? "px-5" : ""
                      } `}
                    />
                  </div>
                </Link>

                <Link href={`/shop?category=${category.id}`}>
                  <p className="sm:text-sm text-[12px] lg:text-lg font-[700] uppercase">
                    {category.name}
                  </p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Categories;

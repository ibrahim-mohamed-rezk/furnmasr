"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeSlider } from "@/lib/api";

interface HeroSwiperProps {
  sliderData?: HomeSlider[];
}

function HeroSwiper({ sliderData }: HeroSwiperProps) {
  const { direction } = useLanguage();
  const swiperRef = useRef<SwiperType | null>(null);

  const heroData = useMemo(() => {
    const processedSlides =
      sliderData && sliderData.length > 0
        ? sliderData.map((slide) => {
            // Ensure image src is valid for next/image: must start with "/" or "http(s)://"
            let imageSrc = slide.image || "/placeholder-wide.png";
            if (
              imageSrc &&
              !imageSrc.startsWith("/") &&
              !imageSrc.startsWith("http://") &&
              !imageSrc.startsWith("https://")
            ) {
              imageSrc = "/" + imageSrc.replace(/^\.?\//, "");
            }
            return {
              id: slide.id,
              title: slide.title || slide.name,
              image: imageSrc,
            };
          })
        : [];

    return processedSlides;
  }, [sliderData]);

  const hasSlides = heroData.length > 0;
  const shouldLoop = heroData.length > 1;

  useEffect(() => {
    if (!swiperRef.current || !shouldLoop) return;
    swiperRef.current.autoplay?.stop();
    swiperRef.current.autoplay?.start();
  }, [shouldLoop, direction, heroData.length]);

  if (!hasSlides) {
    return (
      <section className="relative w-full pb-5">
        <div className=" bg-[#FEFAF3] animate-pulse rounded-lg" />
      </section>
    );
  }

  return (
    <section className="relative w-full pb-0  ">
      <Swiper
        key={direction} // Force re-initialization when direction changes
        dir={direction}
        pagination={
          shouldLoop
            ? {
                clickable: true,
                renderBullet: function (index, className) {
                  return `<span class="${className} custom-pagination-bullet"></span>`;
                },
              }
            : false
        }
        navigation={
          shouldLoop
            ? {
                prevEl: ".hero-prev-button",
                nextEl: ".hero-next-button",
              }
            : false
        }
        autoplay={
          shouldLoop
            ? {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        loop={shouldLoop}
        allowTouchMove={shouldLoop}
        modules={[Navigation, Pagination, Autoplay]}
        className="mySwiper mb-[15px] md:mb-[30px] "
        style={{ direction: direction }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (shouldLoop) {
            swiper.autoplay?.start();
          }
        }}
      >
        {heroData.map((item, index) => (
          <SwiperSlide key={item.id} className=" w-full !aspect-[640/357] pb-10">
            <div className="relative w-full !aspect-[640/357]">
              <Image
                src={item.image}
                alt={item.title || "Furnmasr"}
                fill
                // First slide is the LCP element: preload it and skip lazy-load.
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styles - Responsive */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 10px !important;
          position: absolute !important;
          left: 0px !important;
          z-index: 1000 !important;
        }

        .custom-pagination-bullet {
          width: 30px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background-color: hsl(var(--primary)) !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
          margin: 0 3px !important;
        }

        .custom-pagination-bullet.swiper-pagination-bullet-active {
          background-color: #000000 !important;
          opacity: 1 !important;
          transform: scale(1.1) !important;
        }

        .custom-pagination-bullet:hover {
          opacity: 0.8 !important;
          transform: scale(1.05) !important;
        }

        /* Tablet styles */
        @media (min-width: 768px) {
          .custom-pagination-bullet {
            width: 35px !important;
            height: 4px !important;
            margin: 0 4px !important;
          }
        }

        /* Desktop styles */
        @media (min-width: 1024px) {
          .custom-pagination-bullet {
            width: 40px !important;
            height: 5px !important;
            border-radius: 5px !important;
            margin: 0 4px !important;
          }
        }

        /* Large Desktop styles */
        @media (min-width: 1280px) {
          .custom-pagination-bullet {
            width: 45px !important;
            height: 5px !important;
            margin: 0 5px !important;
          }
        }

        [dir="rtl"] .swiper {
          direction: rtl;
        }

        [dir="rtl"] .swiper-wrapper {
          flex-direction: row-reverse;
        }
      `}</style>

      {shouldLoop &&
        (direction === "ltr" ? (
          <>
            <PrevButton className="hero-prev-button absolute left-2 md:left-3 lg:left-4 bottom-[60%] lg:bottom-[50%] lg:-translate-y-[50%] w-4 h-4 p-2 md:p-0 md:w-8 md:h-8" />
            <NextButton className="hero-next-button absolute right-2 md:right-3 lg:right-4 bottom-[60%] lg:bottom-[50%] lg:-translate-y-[50%] w-4 h-4 p-2 md:p-0 md:w-8 md:h-8" />
          </>
        ) : (
          <>
            <PrevButton className="hero-prev-button absolute right-2 md:right-3 lg:right-4 bottom-[60%] lg:bottom-[50%] lg:-translate-y-[50%] w-4 h-4 p-2 md:p-0 md:w-8 md:h-8" />
            <NextButton className="hero-next-button absolute left-2 md:left-3 lg:left-4 bottom-[60%] lg:bottom-[50%] lg:-translate-y-[50%] w-4 h-4 p-2 md:p-0 md:w-8 md:h-8" />
          </>
        ))}
    </section>
  );
}

export default HeroSwiper;

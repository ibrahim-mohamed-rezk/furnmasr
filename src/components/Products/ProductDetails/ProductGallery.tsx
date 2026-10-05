"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { Swiper as SwiperType } from "swiper/types";
import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileIcon, HeartIcon, Loader2, ShareIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { useWishlist } from "@/hooks/useWishlist";
import { useTranslation } from "@/hooks/useTranslation";
import { SocialShare } from "./SocialShare";
import { canLoop } from "@/lib/swiper";

export default function ProductGallery({
  product,
  activeSizeImage = null,
}: {
  product: any;
  activeSizeImage?: string | null;
}) {
  const { t: tShop } = useTranslation("shop");
  const { direction } = useLanguage();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();
  const mainGallerySwiperRef = useRef<SwiperType | null>(null);

  const playActiveGalleryVideo = useCallback((swiper: SwiperType) => {
    if (!swiper?.el) return;

    swiper.el.querySelectorAll("video").forEach((video) => {
      video.pause();
    });

    const activeVideo = swiper.el.querySelector(
      ".swiper-slide-active video",
    ) as HTMLVideoElement | null;

    if (activeVideo) {
      activeVideo.currentTime = 0;
      void activeVideo.play().catch(() => {});
    }
  }, []);

  const scheduleActiveVideoPlayback = useCallback(
    (swiper: SwiperType) => {
      playActiveGalleryVideo(swiper);
      window.setTimeout(() => playActiveGalleryVideo(swiper), 200);
    },
    [playActiveGalleryVideo],
  );

  useEffect(() => {
    return () => {
      mainGallerySwiperRef.current?.slides?.forEach((slide) => {
        slide.querySelector("video")?.pause();
      });
    };
  }, []);

  const {
    addToWishlist,
    addToWishlistLoading,
    isProductInWishlist,
    removeFromWishlist,
    removeFromWishlistLoading,
  } = useWishlist();

  // Check if product has offers
  const hasOffers =
    product?.product_offers && product.product_offers.length > 0;
  const activeOffer = hasOffers ? product.product_offers[0] : null;

  // Countdown timer for offers
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!activeOffer) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(activeOffer.valid_to).getTime();
      const difference = endTime - now;

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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  // The picked size may carry its own image. Show it in the gallery (prepended
  // when it isn't already one of the slides) and jump to it on every change.
  const galleryItems = useMemo(() => {
    const items = [...(product.gallery || [])];
    if (activeSizeImage && !items.some((item: any) => item.url === activeSizeImage)) {
      items.unshift({
        id: `size-${activeSizeImage}`,
        url: activeSizeImage,
        type: "image",
      });
    }
    return items;
  }, [product.gallery, activeSizeImage]);

  const imageItems = useMemo(() => {
    const items: string[] = [...(product.image || [])];
    if (activeSizeImage && !items.includes(activeSizeImage)) {
      items.unshift(activeSizeImage);
    }
    return items;
  }, [product.image, activeSizeImage]);

  useEffect(() => {
    if (!activeSizeImage) return;

    const index =
      galleryItems.length > 0
        ? galleryItems.findIndex((item: any) => item.url === activeSizeImage)
        : imageItems.indexOf(activeSizeImage);

    if (index < 0) return;

    const swiper = mainGallerySwiperRef.current;
    if (!swiper || swiper.destroyed) return;

    if (swiper.params.loop) {
      swiper.slideToLoop(index);
    } else {
      swiper.slideTo(index);
    }
  }, [activeSizeImage, galleryItems, imageItems]);

  // Main viewers show 1 slide, thumb strips show 4. Loop needs one spare slide
  // beyond what's visible, so the two strips have different thresholds.
  const galleryCount = galleryItems.length;
  const imageCount = imageItems.length;
  const loopGalleryMain = canLoop(galleryCount, 1);
  const loopGalleryThumbs = canLoop(galleryCount, 4);
  const loopImageMain = canLoop(imageCount, 1);
  const loopImageThumbs = canLoop(imageCount, 4);

  return (
    <div className="relative space-y-2 md:space-y-5 md:sticky md:top-24 lg:top-28 left-0 ">
      <div className="info space-y-4 block md:hidden">
        {activeOffer && (
          <p className="text-lg md:text-2xl text-muted-foreground font-bold capitalize">
            {tShop("ends_in")}{" "}
            <span className="text-red-500">
              {String(timeLeft.hours).padStart(2, "0")}
              {tShop("h")} {String(timeLeft.minutes).padStart(2, "0")}
              {tShop("m")} {String(timeLeft.seconds).padStart(2, "0")}
              {tShop("s")}
            </span>{" "}
            — {tShop("dont_miss_out")}
          </p>
        )}

        <div className="category">
          <p className="text-xl capitalize font-semibold text-muted-foreground">
            {product?.category?.name}
          </p>
        </div>

        <div className="title flex items-center gap-4 flex-wrap">
          <h2 className="text-3xl font-bold uppercase">{product?.name}</h2>

          <div className="new">
            <p
              className={`text-sm ${
                activeOffer ? "bg-black" : "bg-yellow-600"
              } text-white px-4 py-1 rounded-sm`}
            >
              {activeOffer ? "🔥Flash Sale" : "New"}
            </p>
          </div>
        </div>

        <div className="actions flex items-center gap-4 flex-wrap">
          <div className="wishlist">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={handleWishlistToggle}
              disabled={addToWishlistLoading || removeFromWishlistLoading}
            >
              {addToWishlistLoading || removeFromWishlistLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <HeartIcon
                  className={`w-6 h-6 ${
                    isProductInWishlist(product.id)
                      ? "fill-primary text-primary"
                      : ""
                  }`}
                />
              )}
            </Button>
          </div>

          <div className="share">
            <SocialShare product={product} />
          </div>
        </div>
      </div>

      {galleryItems.length > 0 ? (
        <>
          <div className="relative">
          <Swiper
            dir={direction}
            loop={loopGalleryMain}
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation={{
              prevEl: `.product-gallery-prev-button`,
              nextEl: `.product-gallery-next-button`,
            }}
            className="mySwiper2 aspect-square md:h-[600px]"
            style={{ direction: direction }}
            onSwiper={(swiper) => {
              mainGallerySwiperRef.current = swiper;
              scheduleActiveVideoPlayback(swiper);
            }}
            onSlideChange={scheduleActiveVideoPlayback}
            onSlideChangeTransitionEnd={playActiveGalleryVideo}
          >
            {galleryItems.map((image: any, index: number) => (
              <SwiperSlide
                key={image.id}
                className={`rounded-sm overflow-hidden w-full ${
                  image.type === "video"
                    ? "flex items-center justify-center bg-muted/20"
                    : ""
                }`}
              >
                {image.type === "image" || image.type === "gif" ? (
                  <Image
                    src={image.url}
                    alt={product?.name || "product image"}
                    width={1000}
                    height={1000}
                    className="w-full border border-gray-100 rounded-sm object-cover "
                    {...(index === 0 ? { priority: true } : {})}
                  />
                ) : image.type === "video" ? (
                  <video
                    src={image.url}
                    controls
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    className="w-full h-auto max-h-full object-contain border border-border rounded-sm"
                  />
                ) : (
                  <a
                    href={image.url}
                    download
                    className="w-full h-full flex items-center justify-center border border-gray-100 rounded-sm bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2 p-8">
                      <FileIcon className="w-24 h-24 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center">
                        {tShop("click_to_download")}
                      </p>
                    </div>
                  </a>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
            <PrevButton className="product-gallery-prev-button absolute top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-3 left-0 z-10" />
            <NextButton className="product-gallery-next-button absolute top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-3 right-0 z-10" />
          </div>
          <Swiper
            dir={direction}
            onSwiper={(swiper) => setThumbsSwiper(swiper as SwiperType)}
            loop={loopGalleryThumbs}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            slideToClickedSlide={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper relative !mx-0 md:!mx-12"
            style={{ direction: direction }}
            onClick={() => {
              if (mainGallerySwiperRef.current) {
                scheduleActiveVideoPlayback(mainGallerySwiperRef.current);
              }
            }}
          >
            {galleryItems.map((image: any, index: number) => {
              return (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer transition-all duration-300 relative rounded-sm overflow-hidden"
                >
                  <div className="overlay absolute top-0 left-0 w-full h-full bg-black/0 z-10 transition-all duration-300"></div>

                  {image.type === "image" || image.type === "gif" ? (
                    <Image
                      src={image.url}
                      alt={product?.name || "product image"}
                      width={1000}
                      height={1000}
                      className="w-full border border-gray-100 rounded-sm object-cover h-28 md:h-40"
                    />
                  ) : image.type === "video" ? (
                    <video
                      src={image.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-28 md:h-40 object-cover border border-border rounded-sm"
                    />
                  ) : (
                    <a
                      href={image.url}
                      download
                      className="w-full h-28 md:h-40 flex items-center justify-center border border-gray-100 rounded-sm bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <FileIcon className="w-12 h-12 text-muted-foreground" />
                    </a>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      ) : imageItems.length > 0 ? (
        <>
          <div className="relative">
          <Swiper
            dir={direction}
            loop={loopImageMain}
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation={{
              prevEl: `.product-gallery-prev-button`,
              nextEl: `.product-gallery-next-button`,
            }}
            className="mySwiper2 aspect-square md:h-[600px]"
            style={{ direction: direction }}
            onSwiper={(swiper) => {
              mainGallerySwiperRef.current = swiper;
            }}
          >
            {imageItems.map((image: any, index: number) => (
              <SwiperSlide
                key={image.id}
                className="rounded-sm overflow-hidden w-full"
              >
                <Image
                  src={image}
                  alt={product?.name || "product image"}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover border border-border rounded-sm"
                  {...(index === 0 ? { priority: true } : {})}
                />
              </SwiperSlide>
            ))}
          </Swiper>
            <PrevButton className="product-gallery-prev-button absolute top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-3 left-0 z-10" />
            <NextButton className="product-gallery-next-button absolute top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-3 right-0 z-10" />
          </div>
          <Swiper
            dir={direction}
            onSwiper={(swiper) => setThumbsSwiper(swiper as SwiperType)}
            loop={loopImageThumbs}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper relative !mx-0 md:!mx-12"
            style={{ direction: direction }}
          >
            {imageItems.map((image: string, index: number) => {
              return (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer transition-all duration-300 relative rounded-sm overflow-hidden"
                >
                  <div className="overlay absolute top-0 left-0 w-full h-full bg-black/0 z-10 transition-all duration-300"></div>
                  <Image
                    src={image}
                    alt={product?.name || "product image"}
                    width={1000}
                    height={1000}
                    className="w-full border border-border rounded-sm object-cover h-28 md:h-40"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      ) : (
        <div className="cover w-full overflow-hidden h-[600px]">
          <PlaceholderImage
            src={product.image}
            alt={product.name}
            className="object-cover bg-muted rounded-sm"
          />
        </div>
      )}
    </div>
  );
}

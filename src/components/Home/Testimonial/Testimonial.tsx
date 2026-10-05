"use client";
import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { UserReview } from "@/lib/api";
import { cn } from "@/lib/utils";
import { canLoop } from "@/lib/swiper";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface TestimonialProps {
  userReviewsData?: UserReview[];
  className?: string;
}

/** Match video carousel slide proportions. */
const REVIEW_SLIDE_ASPECT = "aspect-[9/16]";

function ReviewSlideCard({
  imgSrc,
  onZoom,
  className,
}: {
  imgSrc: string;
  onZoom: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm",
        REVIEW_SLIDE_ASPECT,
        className,
      )}
    >
      <button
        type="button"
        className="group relative block h-full w-full cursor-zoom-in"
        onClick={onZoom}
      >
        <Image
          src={imgSrc}
          alt="testimonial"
          fill
          sizes="(max-width: 576px) 72vw, (max-width: 768px) 33vw, (max-width: 1280px) 24vw, 20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <div className="rounded-full bg-white/80 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-6 w-6 text-black" />
          </div>
        </div>
      </button>
    </div>
  );
}

function Testimonial({ userReviewsData, className }: TestimonialProps) {
  const { direction } = useLanguage();
  const { t } = useTranslation("home");
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Calculate the previous index (swiper - 1)
  const getPreviousIndex = () => {
    if (!userReviewsData || userReviewsData.length === 0) return 0;
    const prevIndex = activeIndex - 1;
    return prevIndex < 0 ? userReviewsData.length - 1 : prevIndex;
  };

  const previousIndex = getPreviousIndex();

  if (!userReviewsData || userReviewsData.length === 0) return null;

  const showNavigation = userReviewsData.length > 1;
  const capSlides = (count: number) => Math.min(count, userReviewsData.length);
  // Widest breakpoint shows 3.5 slides — see canLoop for why that's the input.
  const shouldLoop = canLoop(userReviewsData.length, capSlides(3.5));

  return (
    <section
      className={`flex flex-col md:flex-row md:items-stretch gap-6 md:gap-10 py-8 md:py-10 px-10 sm:px-6 lg:px-8 xl:px-10 ${className ?? ""}`}
    >
      {/* Image zoom dialog */}
      <Dialog
        open={!!zoomImage}
        onOpenChange={(open) => !open && setZoomImage(null)}
      >
        <DialogContent className="max-w-3xl w-full p-2 bg-black/90 border-none flex items-center justify-center">
          {zoomImage && (
            <div className="relative w-full flex items-center justify-center">
              <Image
                src={zoomImage}
                alt="testimonial zoom"
                width={1000}
                height={1000}
                className="w-full max-h-[80vh] object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="relative hidden shrink-0 self-stretch overflow-hidden rounded-sm md:block md:w-[34%] lg:w-[32%] xl:w-[30%]">
        {userReviewsData?.[previousIndex]?.image ? (
          <Image
            src={userReviewsData[previousIndex].image}
            alt="testimonial"
            fill
            sizes="(max-width: 1280px) 34vw, 30vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="w-full min-w-0 md:w-[66%] lg:w-[68%] xl:w-[70%]">
        <div className="head mb-6 md:mb-10 lg:mb-14 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-10 md:gap-10 lg:gap-16">
          <div className="max-w-lg">
            <div className="title">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-[700] mb-2 lg:mb-5">
                {t("what_our_customers_say")}
              </h2>
            </div>
            <div className="desc">
              <p className="text-muted-foreground font-semibold text-base sm:text-lg lg:text-[22px]">
                {t(
                  "real_reviews_from_happy_shoppers_who_love_furnmasrs_quality_and_service",
                )}
              </p>
            </div>
          </div>
          <div className={`flex gap-2 sm:shrink-0`}>
            {showNavigation ? (
              <>
                <PrevButton className="testimonial-swiper-prev-btn" />
                <NextButton className="testimonial-swiper-next-btn" />
              </>
            ) : (
              <div className="w-20" />
            )}
          </div>
        </div>

        {userReviewsData.length === 1 ? (
          <div className="flex justify-start">
            <ReviewSlideCard
              imgSrc={userReviewsData[0].image || "/placeholder-image.png"}
              onZoom={() =>
                setZoomImage(userReviewsData[0].image || "/placeholder-image.png")
              }
              className="w-[72vw] max-w-[320px] sm:w-full md:max-w-[260px] lg:max-w-[300px]"
            />
          </div>
        ) : (
        <Swiper
          key={`${direction}-${userReviewsData.length}`}
          dir={direction}
          slidesPerView={capSlides(3.5)}
          spaceBetween={20}
          navigation={
            showNavigation
              ? {
                  prevEl: `.testimonial-swiper-prev-btn`,
                  nextEl: `.testimonial-swiper-next-btn`,
                }
              : undefined
          }
          autoplay={
            showNavigation
              ? {
                  delay: 5000,
                  disableOnInteraction: true,
                }
              : false
          }
          loop={shouldLoop}
          centeredSlides={false}
          initialSlide={0}
          modules={[Navigation, Autoplay]}
          className="mySwiper media-carousel-swiper w-full"
          style={{ direction }}
          onInit={(swiper: SwiperType) => {
            setActiveIndex(swiper.realIndex);
          }}
          onSlideChange={(swiper: SwiperType) => {
            setActiveIndex(swiper.realIndex);
          }}
          breakpoints={{
            0: {
              slidesPerView: capSlides(1.4),
              spaceBetween: 12,
            },
            576: {
              slidesPerView: capSlides(2),
              spaceBetween: 24,
            },
            668: {
              slidesPerView: capSlides(3),
              spaceBetween: 32,
            },
            // From md up the side preview takes ~34%, so the carousel gets a
            // narrower track — fewer slides keeps each card readable.
            768: {
              slidesPerView: capSlides(2.5),
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: capSlides(3),
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: capSlides(3.5),
              spaceBetween: 32,
            },
          }}
        >
          {userReviewsData?.map((testimonial) => {
            const imgSrc = testimonial.image || "/placeholder-image.png";
            return (
              <SwiperSlide key={testimonial.id} className="!h-auto">
                <ReviewSlideCard
                  imgSrc={imgSrc}
                  onZoom={() => setZoomImage(imgSrc)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        )}
      </div>
    </section>
  );
}

export default Testimonial;

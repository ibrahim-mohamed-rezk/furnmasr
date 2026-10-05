"use client";
import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import { VideoDialouge } from "./VideoDialouge/VideoDialouge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Video, VideoProduct } from "@/lib/api";
import { cn } from "@/lib/utils";
import { canLoop } from "@/lib/swiper";

/** Facebook vertical video ratio (Reels / mobile feed). */
const FB_VIDEO_ASPECT = "aspect-[9/16]";

type VideoItem = {
  id: number;
  image: string;
  title: string;
  videoUrl: string;
  product?: VideoProduct | null;
};

function VideoSlideCard({
  video,
  className,
}: {
  video: VideoItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm",
        FB_VIDEO_ASPECT,
        className,
      )}
    >
      {video.image ? (
        <Image
          src={video.image}
          alt={video.title || "video"}
          fill
          sizes="(max-width: 576px) 72vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <VideoDialouge
          videoUrl={video.videoUrl}
          product={video.product}
          videoTitle={video.title}
        />
      </div>
    </div>
  );
}

function OurVideos({
  title,
  heading,
  shapes = true,
  videosData,
}: {
  title: string;
  heading?: string;
  shapes?: boolean;
  videosData?: Video[];
}) {
  const { direction } = useLanguage();
  const { t } = useTranslation("home");

  const videos: VideoItem[] =
    videosData
      ?.filter((video) => Boolean(video?.url?.trim()))
      .map((video) => ({
        id: video.id,
        image: video.image || "",
        title: video.title,
        videoUrl: video.url,
        product: video.product ?? null,
      })) ?? [];

  if (videos.length === 0) return null;

  const headingText = heading ?? t(title);
  const showNavigation = videos.length > 1;
  const capSlides = (count: number) => Math.min(count, videos.length);
  // Widest breakpoint shows 4 slides — see canLoop for why that's the input.
  const shouldLoop = canLoop(videos.length, capSlides(4));

  return (
    <section className="relative">
      {shapes && <div className="cover" />}

      <div className="max-w-7xl mx-auto py-8 md:py-10 px-4 sm:px-6 z-10">
        <div className="head flex justify-between items-center mb-6 md:mb-14 gap-4">
          {showNavigation ? (
            <PrevButton className="our-videos-prev-button shrink-0" />
          ) : (
            <div className="w-10 shrink-0" />
          )}

          <div className="px-4 sm:px-10 flex-1">
            <h2 className="text-2xl sm:text-3xl font-[700] text-center">
              {headingText}
            </h2>
          </div>

          {showNavigation ? (
            <NextButton className="our-videos-next-button shrink-0" />
          ) : (
            <div className="w-10 shrink-0" />
          )}
        </div>

        {videos.length === 1 ? (
          <div className="flex justify-start">
            <VideoSlideCard
              video={videos[0]}
              className="w-[72vw] max-w-[320px] sm:w-full"
            />
          </div>
        ) : (
          <Swiper
            key={`${direction}-${videos.length}`}
            dir={direction}
            slidesPerView={capSlides(4)}
            spaceBetween={40}
            navigation={
              showNavigation
                ? {
                    prevEl: `.our-videos-prev-button`,
                    nextEl: `.our-videos-next-button`,
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
              1280: {
                slidesPerView: capSlides(4),
                spaceBetween: 40,
              },
            }}
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id} className="!h-auto">
                <VideoSlideCard video={video} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default OurVideos;

"use client";

import NextButton from "@/components/Shared/SwiprerButtons/NextButton";
import PrevButton from "@/components/Shared/SwiprerButtons/PrevButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { VideoReview } from "@/lib/api";
import { cn } from "@/lib/utils";
import { canLoop } from "@/lib/swiper";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

interface VideoReviewsProps {
  videoReviews?: VideoReview[];
}

/** Facebook vertical video ratio (Reels / mobile feed). */
const FB_VIDEO_ASPECT = "aspect-[9/16]";

const toFacebookEmbedUrl = (url: string): string => {
  const cleanUrl = url.trim();

  if (cleanUrl.includes("facebook.com/plugins/video.php")) {
    return cleanUrl;
  }

  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
    const params = new URLSearchParams({
      href: cleanUrl,
      show_text: "false",
      width: "400",
    });
    return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
  }

  return cleanUrl;
};

const isFacebookUrl = (url: string) =>
  url.includes("facebook.com") || url.includes("fb.watch");

const isYouTubeUrl = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const getYouTubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }

    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
};

const toYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const getYouTubeThumbnail = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

function VideoReviewPreview({ url, title }: { url: string; title: string }) {
  if (isFacebookUrl(url)) {
    return (
      <iframe
        src={toFacebookEmbedUrl(url)}
        title={title}
        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        tabIndex={-1}
        loading="lazy"
      />
    );
  }

  if (isYouTubeUrl(url)) {
    const thumbnail = getYouTubeThumbnail(url);
    if (!thumbnail) return <div className="absolute inset-0 bg-black" />;

    return (
      <Image
        src={thumbnail}
        alt={title}
        fill
        unoptimized
        className="object-cover"
      />
    );
  }

  return (
    <video
      src={url}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  );
}

function ReviewVideoPlayer({ url, title }: { url: string; title: string }) {
  if (isFacebookUrl(url)) {
    return (
      <div className="relative w-full max-w-[400px] aspect-[9/16] mx-auto">
        <iframe
          src={toFacebookEmbedUrl(url)}
          title={title}
          className="absolute inset-0 h-full w-full rounded-xl border-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
    );
  }

  if (isYouTubeUrl(url)) {
    return (
      <iframe
        src={toYouTubeEmbedUrl(url)}
        title={title}
        className="w-full aspect-video max-w-4xl border-0 rounded-sm bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={url}
      controls
      autoPlay
      playsInline
      preload="metadata"
      title={title}
      className="w-full max-w-4xl max-h-[80vh] object-contain bg-black rounded-sm"
    />
  );
}

function VideoReviewDialog({
  review,
  className,
}: {
  review: VideoReview;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative w-full overflow-hidden rounded-sm bg-black text-left cursor-pointer group",
            FB_VIDEO_ASPECT,
            className,
          )}
        >
          <VideoReviewPreview url={review.url} title={review.title} />

          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 bg-black/70">
            <div className="bg-background text-foreground rounded-full p-4 sm:p-6 group-hover:scale-105 group-hover:bg-primary transition-all duration-300">
              <PlayIcon className="w-8 h-8 sm:w-10 sm:h-10 fill-black" />
            </div>
          </div>

          {review.title && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 pointer-events-none">
              <p className="text-white text-sm sm:text-base font-semibold text-center line-clamp-2">
                {review.title}
              </p>
            </div>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-5xl px-1 py-1 rounded-sm sm:p-4 md:p-6 sm:mx-4 max-h-[85vh] sm:max-h-none overflow-hidden [&>button]:top-3 [&>button]:left-1/2 [&>button]:right-auto [&>button]:start-auto [&>button]:end-auto [&>button]:-translate-x-1/2 md:[&>button]:top-4">
        <div className="w-full flex justify-center items-center">
          {open && (
            <ReviewVideoPlayer url={review.url} title={review.title} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VideoReviews({ videoReviews }: VideoReviewsProps) {
  const { direction } = useLanguage();
  const { t } = useTranslation("shop");

  if (!videoReviews || videoReviews.length === 0) return null;

  const showNavigation = videoReviews.length > 1;
  const capSlides = (count: number) => Math.min(count, videoReviews.length);
  // Widest breakpoint shows 4 slides — see canLoop for why that's the input.
  const shouldLoop = canLoop(videoReviews.length, capSlides(4));

  return (
    <section className="relative max-w-7xl mx-auto py-8 md:py-10 px-4 sm:px-6">
      <div className="head flex justify-between items-center mb-6 md:mb-14 gap-4">
        {showNavigation ? (
          <PrevButton className="video-reviews-prev-button shrink-0" />
        ) : (
          <div className="w-10 shrink-0" />
        )}

        <div className="px-4 sm:px-10 flex-1">
          <h2 className="text-2xl sm:text-3xl font-[700] text-center">
            {t("video_reviews")}
          </h2>
        </div>

        {showNavigation ? (
          <NextButton className="video-reviews-next-button shrink-0" />
        ) : (
          <div className="w-10 shrink-0" />
        )}
      </div>

      {videoReviews.length === 1 ? (
        <div className="flex justify-start">
          <VideoReviewDialog
            review={videoReviews[0]}
            className="w-[72vw] !max-w-[320px] sm:w-full"
          />
        </div>
      ) : (
        <Swiper
          key={`${direction}-${videoReviews.length}`}
          dir={direction}
          slidesPerView={capSlides(4)}
          spaceBetween={40}
          navigation={
            showNavigation
              ? {
                  prevEl: `.video-reviews-prev-button`,
                  nextEl: `.video-reviews-next-button`,
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
          {videoReviews.map((review) => (
            <SwiperSlide key={review.id} className="!h-auto">
              <VideoReviewDialog review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default VideoReviews;

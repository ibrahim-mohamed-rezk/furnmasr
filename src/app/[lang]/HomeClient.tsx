"use client";

import dynamic from "next/dynamic";
import Categories from "@/components/Home/Categories/Categories";
import FlashSale from "@/components/Home/FlashSale/FlashSale";
import HeroSwiper from "@/components/Home/Hero/HeroSwiper";

import { useHomeData } from "@/hooks/useHomeData";
import { Suspense } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import type { ApiResponse, HomeData } from "@/lib/api";

// Below-the-fold sections are client-only (ssr: false) and code-split so their
// JS doesn't parse/hydrate during the initial load — this is the main lever for
// Total Blocking Time on the long homepage. Each gets a height placeholder so
// deferring them doesn't reintroduce layout shift (CLS stays ~0).
const placeholder = (className: string) => {
  const P = () => <div className={className} aria-hidden="true" />;
  P.displayName = "SectionPlaceholder";
  return P;
};

const OurVideos = dynamic(() => import("@/components/Home/OurVideos/OurVideos"), {
  ssr: false,
  loading: placeholder("min-h-[450px]"),
});
const BestSeller = dynamic(
  () => import("@/components/Home/BestSeller/BestSeller"),
  { ssr: false, loading: placeholder("min-h-[640px]") }
);
const CategoriesItems = dynamic(
  () => import("@/components/Home/CategoriesItems/CategoriesItems"),
  { ssr: false, loading: placeholder("min-h-[640px]") }
);
const SpecialYear = dynamic(
  () => import("@/components/Home/SpecialYear/SpecialYear"),
  { ssr: false, loading: placeholder("hidden lg:block min-h-[600px]") }
);
const Testimonial = dynamic(
  () => import("@/components/Home/Testimonial/Testimonial"),
  { ssr: false, loading: placeholder("min-h-[400px]") }
);
const NewArrival = dynamic(
  () => import("@/components/Home/NewArrival/NewArrival"),
  { ssr: false, loading: placeholder("min-h-[640px]") }
);
const TopRated = dynamic(() => import("@/components/Home/TopRated/TopRated"), {
  ssr: false,
  loading: placeholder("min-h-[640px]"),
});
const Gallery = dynamic(() => import("@/components/Home/Gallery/Gallery"), {
  ssr: false,
  loading: placeholder("min-h-[400px]"),
});

function HomePageContent({
  initialData,
}: {
  initialData?: ApiResponse<HomeData>;
}) {
  const { data, error, refetch } = useHomeData(initialData);
  const { t } = useTranslation("home");

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-muted-foreground mb-4">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* <Subscribe /> */}
      {/* <NewProduct /> */}
      {/* Visible but understated page H1, pinned to the banner's bottom inline-start
          corner (logical start flips for RTL). Kept small so it reads as a caption
          while still serving as the single page <h1> for SEO. */}
      <div className="relative">
        <h1 className="absolute bottom-3 start-3 z-20 max-w-[70%] text-xs sm:text-sm font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] pointer-events-none">
          {t("page_heading")}
        </h1>
        <HeroSwiper sliderData={data?.data.slider} />
      </div>
      <Categories categoriesData={data?.data.categories} />
      <FlashSale flashSaleData={data?.data.flash_sale} />
      <OurVideos
        title="our_videos"
        shapes={true}
        videosData={data?.data.videos}
      />
      <BestSeller productsData={data?.data.best_seller} />
      {data?.data.categories?.map((category) => (
        <CategoriesItems
          key={category.id}
          translatedTitle={true}
          title={category.name}
          productsData={category.products}
          tab={category.id}
        />
      ))}
      <SpecialYear />
      <Testimonial
        className="max-w-7xl mx-auto"
        userReviewsData={data?.data.user_reviews}
      />
      <NewArrival productsData={data?.data.products} />
      <TopRated productsData={data?.data.top_rated} />
      <Gallery
        banner_main={data?.data.banner_main}
        banner_one={data?.data.banner_one}
        banner_two={data?.data.banner_two}
        banner_three={data?.data.banner_three}
        banner_four={data?.data.banner_four}
      />
    </div>
  );
}

export default function HomeClient({
  initialData,
}: {
  initialData?: ApiResponse<HomeData>;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <HomePageContent initialData={initialData} />
    </Suspense>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import { useParams } from "next/navigation";
import ShowTabs from "./TabsComponents/ShowTabs";
import RelatedProducts from "./RelatedProducts";
import OurVideos from "@/components/Home/OurVideos/OurVideos";
import VideoReviews from "./VideoReviews";
import FAQsSection from "./FAQsSection";
import { useSingleProduct } from "@/hooks/useProducts";
import { ProductPageSkeleton } from "@/components/ui/blog-skeleton";
import Testimonial from "@/components/Home/Testimonial/Testimonial";
import { ProductLanguageSwitcher } from "@/components/Shared/LanguageSwitcher/ProductLanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { trackViewContent } from "@/lib/tiktokPixel";

function ProductInfoPage({ t }: { t: any }) {
  const params = useParams();
  const productSlug = params.slug as string;

  const { language } = useTranslation("shop");
  // Image of the size the shopper picked, shown in the gallery (see ProductDetails)
  const [activeSizeImage, setActiveSizeImage] = useState<string | null>(null);
  const { data, isLoading, error } = useSingleProduct(productSlug);
  const product = data?.data?.product;
  const relatedProducts = data?.data?.related_products || [];

  const videosData = product?.videos || [];
  const videoReviews = product?.video_reviews || [];

  // TikTok ViewContent — fire once per product view (keyed on id only).
  useEffect(() => {
    if (!product?.id) return;
    trackViewContent({
      content_id: String(product.id),
      content_name: product.name,
      price: Number(product.sale_price ?? product.price) || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: one event per product id
  }, [product?.id]);

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (error || !product) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {t("error_loading_product") || "Error loading product"}
        </h2>
        <p className="text-muted-foreground">
          {t("please_try_again_later") || "Please try again later."}
        </p>
      </section>
    );
  }

  return (
    <section className="pb-24 lg:pb-0">
      {/* Keeps the URL slug in sync with the active language */}
      <ProductLanguageSwitcher
        slugEn={product.slug_en}
        slugAr={product.slug_ar}
        currentSlug={productSlug}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 py-[20px] md:py-10 relative">
        <div className="gallery md:sticky top-0 left-0">
          <ProductGallery product={product} activeSizeImage={activeSizeImage} />
        </div>
        <div className="info">
          <ProductDetails
            product={product}
            onSizeChange={(size) => setActiveSizeImage(size.image ?? null)}
          />
        </div>
      </div>
      <VideoReviews videoReviews={videoReviews} />

      <OurVideos
        title="hair_products_reviews"
        heading={
          product.category?.name
            ? language === "ar"
              ? `مراجع ${product.category.name}`
              : `${product.category.name} Reviews`
            : undefined
        }
        shapes={false}
        videosData={videosData}
      />
      <Testimonial userReviewsData={product?.user_reviews} />

      <ShowTabs product={product} />

      <RelatedProducts products={relatedProducts} />


      {product?.faqs && product?.faqs?.length > 0 && (
        <FAQsSection faqs={product?.faqs} />
      )}
    </section>
  );
}

export default ProductInfoPage;
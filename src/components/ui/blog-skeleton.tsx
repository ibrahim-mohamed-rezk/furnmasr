import { Skeleton } from "@/components/ui/skeleton";

// Blog card skeleton
export const BlogCardSkeleton = () => (
  <div className="blog">
    <div className="card">
      <div className="group img relative">
        <Skeleton className="w-full h-64" />
      </div>
      <div className="content mt-5 px-6 space-y-4 text-center">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Category skeleton
export const CategorySkeleton = () => (
  <li className="group relative">
    <Skeleton className="h-32 w-full rounded-lg" />
    <div className="absolute inset-0 bottom-0 bg-black/30 flex justify-center items-center p-4">
      <Skeleton className="h-8 w-24 bg-background" />
    </div>
  </li>
);

// Blog banner skeleton
export const BlogBannerSkeleton = () => (
  <div className="head-banner space-y-6 text-center">
    <div className="img">
      <Skeleton className="w-full h-[300px] sm:h-full" />
    </div>
    <div className="px-5 xl:px-28 space-y-4">
      <div className="title">
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </div>
      <div className="desc">
        <Skeleton className="h-4 w-full mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto mt-2" />
      </div>
    </div>
  </div>
);

// Side card skeleton
export const SideCardSkeleton = () => (
  <div className="bg-[#EDE7E0] p-6 lg:p-10 space-y-6 text-center">
    <div className="img">
      <Skeleton className="w-full h-32" />
    </div>
    <div className="title capitalize">
      <Skeleton className="h-5 w-3/4 mx-auto" />
    </div>
    <div className="desc">
      <Skeleton className="h-4 w-full mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto mt-2" />
    </div>
    <div className="link">
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  </div>
);

// Latest blog skeleton
export const LatestBlogSkeleton = () => (
  <li className="flex gap-4">
    <Skeleton className="w-[80px] h-[80px] rounded" />
    <div className="content flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3 mt-1" />
    </div>
  </li>
);

// Facebook section skeleton
export const FacebookSkeleton = () => (
  <div className="find-on-facebook relative">
    <Skeleton className="w-full h-48" />
    <div className="cover absolute inset-0 bottom-5 flex justify-center items-end">
      <Skeleton className="h-8 w-32 bg-[#1877F2]" />
    </div>
  </div>
);

// Pagination skeleton
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-2">
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
  </div>
);

// Breadcrumb skeleton
export const BreadcrumbSkeleton = () => (
  <div className="flex items-center gap-2">
    <Skeleton className="h-6 w-20" />
    <Skeleton className="h-4 w-4" />
    <Skeleton className="h-6 w-32" />
  </div>
);

// Single blog hero skeleton
export const SingleBlogHeroSkeleton = () => (
  <div className="col-span-1 w-full h-full">
    <Skeleton className="w-full sm:h-[400px] md:h-[500px] lg:h-[600px]" />
    <div className="date mt-3">
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

// Single blog content skeleton
export const SingleBlogContentSkeleton = () => (
  <div className="blog-content space-y-10">
    <div className="head space-y-2 text-center max-w-xl mx-auto">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <div className="description">
        <Skeleton className="h-4 w-full mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto mt-2" />
      </div>
    </div>

    <div className="content space-y-10">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />

      <div className="order-list">
        <ul className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="space-y-2">
              <div className="head flex items-center gap-2">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="desc">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6 mt-1" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bottom-desc">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-2/3 mt-2" />
      </div>
    </div>
  </div>
);

// Related blogs section skeleton
export const RelatedBlogsSkeleton = () => (
  <div className="related-blogs">
    <div className="flex items-center justify-center mb-10">
      <Skeleton className="h-8 w-48" />
    </div>

    <div className="blogs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 3 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Product details skeleton
export const ProductDetailsSkeleton = () => (
  <div className="space-y-6 py-10">
    {/* Info section */}
    <div className="space-y-4 hidden md:block">
      {/* Flash sale countdown */}
      <Skeleton className="h-8 w-3/4" />

      {/* Category */}
      <Skeleton className="h-6 w-32" />

      {/* Title and badge */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Rating section */}
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-6" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>

    {/* Price section */}
    <div className="mb-3 flex flex-wrap items-center gap-20 gap-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>

    {/* Description */}
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />

    {/* Availability */}
    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
    </div>

    {/* Size selection */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-24" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
      </div>
    </div>

    {/* Payment options */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>

    {/* Add to cart section */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap justify-center lg:flex-nowrap">
        <div className="flex items-center gap-2 border border-border justify-between rounded-2xl overflow-hidden w-full lg:w-[450px] bg-background">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-12 w-16" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>

    {/* Divider */}
    <div className="my-5">
      <Skeleton className="h-0.5 w-full" />
    </div>

    {/* Shipping info */}
    <div className="space-y-6">
      <ul className="flex flex-wrap gap-8 gap-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-48" />
          </li>
        ))}
      </ul>
    </div>

    {/* Divider */}
    <div className="my-5">
      <Skeleton className="h-0.5 w-full" />
    </div>

    {/* Delivery info */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-4 w-80" />
    </div>
  </div>
);

// Product gallery skeleton
export const ProductGallerySkeleton = () => (
  <div className="space-y-4">
    {/* Main image */}
    <div className="main-image">
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>

    {/* Thumbnail gallery */}
    <div className="thumbnails flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-20 rounded-lg" />
      ))}
    </div>

    {/* Category badge */}
    <div className="category-badge">
      <Skeleton className="h-8 w-24 rounded-sm" />
    </div>
  </div>
);

// Product tabs skeleton
export const ProductTabsSkeleton = () => (
  <div className="space-y-6">
    {/* Tab headers */}
    <div className="tabs flex justify-between gap-10 border-b pb-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>

    {/* Tab content */}
    <div className="tab-content space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />

      {/* Reviews section */}
      <div className="reviews space-y-4 mt-8">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="review-item space-y-2 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-4" />
                ))}
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Related products skeleton
export const RelatedProductsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-center">
      <Skeleton className="h-8 w-48" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="product-card space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  </div>
);

// Complete product page skeleton
export const ProductPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left column - Gallery */}
      <ProductGallerySkeleton />

      {/* Right column - Details */}
      <ProductDetailsSkeleton />
    </div>

    {/* Tabs section */}
    <div className="mt-16">
      <ProductTabsSkeleton />
    </div>

    {/* Related products */}
    <div className="mt-16">
      <RelatedProductsSkeleton />
    </div>
  </div>
);

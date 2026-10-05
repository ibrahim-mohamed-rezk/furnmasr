"use client";

import { ChevronRight } from "lucide-react";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import BlogCard from "../../components/BLogCard/BlogCard";
import { SimplePagination } from "@/components/Shared/Pagination/Pagination";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { useBlogs } from "@/hooks/useBlogs";
import { use, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  BlogCardSkeleton,
  PaginationSkeleton,
  BreadcrumbSkeleton,
} from "@/components/ui/blog-skeleton";
import { useSearchParams } from "next/navigation";

interface BlogCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

function BlogCategoryContent({ params }: BlogCategoryPageProps) {
  const { t, language } = useTranslation("blog");
  const [currentPage, setCurrentPage] = useState(1);

  // Parse category ID from URL params. `params` is a promise in Next 15+;
  // unwrapping it here (inside the Suspense boundary) rather than in the page
  // export keeps the fallback rendering while it resolves.
  const { id } = use(params);
  const categoryId = parseInt(id);
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name");

  // Fetch blogs filtered by category ID
  const { blogs, pagination, loading, error, goToPage, refetch } = useBlogs({
    category_id: categoryId,
    page: currentPage,
    language,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Show error if category ID is invalid
  if (isNaN(categoryId)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {t("invalid_category_id")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("invalid_category_id_message")}
          </p>
          <Link href="/blogs">
            <Button>{t("back_to_blogs")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show error if blogs failed to load
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {t("error_loading_blogs")}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <FloatedShapes height="700px" />

      <div className="border-b">
        <div className="head py-10 max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/blogs">
              <h3 className="text-xl md:text-3xl font-[800] font-title">
                {t("blogs")}
              </h3>
            </Link>

            <ChevronRight />

            <h3 className="text-2xl md:text-3xl font-[800] font-title capitalize">
              {t("category_blogs")} ({categoryName})
            </h3>
          </div>

          {/* <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? t("loading") : t("retry")}
          </Button> */}
        </div>
      </div>

      {loading ? (
        // Show loading state with skeletons
        <>
          <div className="border-b">
            <BreadcrumbSkeleton />
          </div>
          <div className="blogs max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-16 px-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-muted-foreground mb-4">
            {t("no_blogs_in_category")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("no_blogs_in_category_message")}
          </p>
          <Link href="/blogs">
            <Button>{t("back_to_all_blogs")}</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="blogs max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-16 px-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="pagination mb-20 flex justify-center">
              <SimplePagination
                totalPages={pagination.last_page}
                currentPage={pagination.current_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <BlogCategoryContent params={params} />
    </Suspense>
  );
}

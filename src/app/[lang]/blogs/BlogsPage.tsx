"use client";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { SimplePagination } from "@/components/Shared/Pagination/Pagination";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { useBlogs, useBlogCategories } from "@/hooks/useBlogs";
import BlogCard from "./components/BLogCard/BlogCard";
import { useState } from "react";
import {
  BlogCardSkeleton,
  CategorySkeleton,
  BlogBannerSkeleton,
  SideCardSkeleton,
  LatestBlogSkeleton,
  FacebookSkeleton,
  PaginationSkeleton,
} from "@/components/ui/blog-skeleton";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export default function BlogsPage() {
  const { t, language } = useTranslation("blog");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch blogs with pagination
  const { blogs, pagination, banner, loading, error, data, goToPage } =
    useBlogs({
      page: currentPage,
      language,
    });

  // Fetch categories
  const { categories, loading: categoriesLoading } =
    useBlogCategories(language);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
  };

  // const handleRefresh = () => {
  //   refetch();
  // };

  // Static data for banner and cards (keeping these as they're design elements)
  const staticData = {
    headBanner: {
      title: t("theSecrete"),
      description:
        t("Discover"),
      image: "/placeholder-wide.png",
    },
    fristCard: {
      title: t("newArrivals"),
      description:
        t("Discover"),
      image: "/placeholder-image.png",
    },
    secondCard: {
      title: t("newArrivals"),
      description:
        t("Discover"),
      image: "/placeholder-image.png",
    },
    findOnFacebook: {
      title: "find_us_on_facebook",
      image: "/placeholder-image.png",
    },
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Blogs
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <FloatedShapes height="1500px" />

      <div className="head py-10 border-b">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <h3 className="text-2xl md:text-3xl font-[800] font-title">
            {t("blogs")}
          </h3>
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
            {loading ? t("loading") : t("refresh")}
          </Button> */}
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-2 px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="left border-b pb-10 lg:pb-0 lg:border-b-0 lg:w-[70%] space-y-10 lg:space-y-16">
            {/* Banner Section */}
            {loading ? (
              <BlogBannerSkeleton />
            ) : (
              <div className="head-banner space-y-6 text-center">
                <div className="img">
                  <PlaceholderImage
                    src={banner?.image}
                    alt="blog-1"
                    // width={1000}
                    // height={1000}
                    className="w-full !h-[300px] sm:!h-[400px] object-cover bg-muted"
                  />
                </div>

                <div className="px-5 xl:px-28  space-y-4">
                  <div className="title">
                    <h4 className="md:text-2xl text-lg font-bold uppercase">
                      {banner?.[0]?.title}
                    </h4>
                  </div>

                  <div className="desc">
                    <p className="text-[16px] text-muted-foreground">
                      {banner?.[0]?.content}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Blogs Grid */}
            <div className="blogs grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading
                ? // Show skeleton cards while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <BlogCardSkeleton key={index} />
                  ))
                : blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
            </div>

            {/* Pagination */}
            {loading ? (
              <PaginationSkeleton />
            ) : (
              pagination &&
              pagination.last_page > 1 && (
                <div className="pagination flex justify-center items-center w-full">
                  <SimplePagination
                    totalPages={pagination.last_page}
                    currentPage={pagination.current_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )
            )}
          </div>

          <div className="right-side lg:space-y-10 lg:w-[30%] space-y-6">
            <div className="right-cards grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* First Card */}
              {loading ? (
                <SideCardSkeleton />
              ) : (
                <div className="frist-card bg-[#EDE7E0] p-6 lg:p-10 space-y-6 text-center">
                  <div className="img">
                    <Image
                      src={data?.banner_one.image || staticData.fristCard.image}
                      alt="blog-1"
                      width={1000}
                      height={1000}
                      className="w-full h-[200px] object-cover rounded-lg bg-muted"
                    />
                  </div>

                  <div className="title capitalize">
                    <h4 className="text-[17px] font-bold">
                      {staticData.fristCard.title}
                    </h4>
                  </div>

                  <div className="desc">
                    <p className="text-[14px] text-muted-foreground">
                      {staticData.fristCard.description}
                    </p>
                  </div>

                  <div className="link">
                    <Link
                      href={`/blogs`}
                      className="text-[14px] font-bold underline"
                    >
                      {t("read_more_to_unlock_your_best_hair_yet")}
                    </Link>
                  </div>
                </div>
              )}

              {/* Second Card */}
              {loading ? (
                <SideCardSkeleton />
              ) : (
                <div className="second-card bg-[#EDE7E0] p-10 space-y-6 text-center">
                  <div className="img">
                    <Image
                      src={data?.banner_two.image || staticData.secondCard.image}
                      alt="blog-2"
                      width={1000}
                      height={1000}
                      className="w-full h-[200px] object-cover rounded-lg bg-muted"
                    />
                  </div>

                  <div className="title capitalize">
                    <h4 className="text-[17px] font-bold">
                      {staticData.secondCard.title}
                    </h4>
                  </div>

                  <div className="link text-center flex justify-center">
                    <Link href={`/blogs`}>
                      <Button
                        size="lg"
                        className="flex items-center gap-2 bg-black text-white"
                      >
                        {t("go_to_shop")}
                        <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="categories space-y-4">
              {categoriesLoading ? (
                <ul className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CategorySkeleton key={index} />
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  {categories.map((category) => (
                    <li key={category.id} className="group relative">
                      <div className="bg-muted h-32 flex items-center justify-center">
                        <Image
                          src={category.image || "/placeholder-image.png"}
                          alt="category"
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover bg-muted"
                        />
                      </div>
                      <div className="absolute inset-0 bottom-0 bg-black/30 group-hover:bg-black/50 flex justify-center items-center p-4 transition-all duration-300">
                        <Link
                          href={`/blogs/category/${category.id}?name=${category.name}`}
                          className="text-[16px] font-semibold bg-background px-6 py-2 hover:bg-black hover:text-white transition-all duration-300"
                        >
                          {category.name}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Facebook Section */}
            {loading ? (
              <FacebookSkeleton />
            ) : (
              <div className="find-on-facebook relative">
                <Image
                  src={staticData.findOnFacebook.image}
                  alt="facebook"
                  width={1000}
                  height={1000}
                  className="w-full h-[200px] object-cover rounded-lg bg-muted"
                />
                <div className="cover absolute inset-0 bottom-5 flex justify-center items-end">
                  <Link
                    href={`https://www.facebook.com/furnmasr`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold bg-[#1877F2] px-6 py-2 text-white hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <FaFacebook className="w-4 h-4" />
                    <span>{t(staticData.findOnFacebook.title)}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Latest Blogs */}
            <div className="latest-blog">
              <div className="head flex justify-center items-center mb-5">
                <h4 className="text-[17px] font-bold text-primary">
                  {t("latest_blog")}
                </h4>
              </div>
              <ul className="space-y-6">
                {loading
                  ? // Show skeleton latest blogs while loading
                    Array.from({ length: 3 }).map((_, index) => (
                      <LatestBlogSkeleton key={index} />
                    ))
                  : blogs.slice(0, 3).map((blog) => (
                      <li key={blog.id} className="flex gap-4">
                        <Link
                          href={`/blogs/${blog.id}`}
                          className="flex gap-4 items-center"
                        >
                          <PlaceholderImage
                            src={blog.image || "/placeholder-wide.png"}
                            alt={blog.title || "Blog"}
                            className="w-[90px] h-[90px] object-cover rounded bg-muted object-center"
                            width="90"
                            height="90"
                          />
                          <div className="content">
                            <h4 className="text-[14px] font-bold mb-2">
                              {(blog.title || "Untitled Blog").slice(0, 30)}...
                            </h4>
                            <p
                              className="text-[13px] text-muted-foreground"
                              dangerouslySetInnerHTML={{
                                __html: (
                                  blog.description || "No description available"
                                ).slice(0, 100),
                              }}
                            />
                          </div>
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

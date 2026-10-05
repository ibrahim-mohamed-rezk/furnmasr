"use client";
import { use } from "react";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import BlogCard from "../components/BLogCard/BlogCard";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { useSingleBlog } from "@/hooks/useBlogs";
import {
  SingleBlogHeroSkeleton,
  SingleBlogContentSkeleton,
  RelatedBlogsSkeleton,
} from "@/components/ui/blog-skeleton";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { t, language } = useTranslation("blog");
  const { id } = use(params);
  const blogId = parseInt(id);

  const { blog, relatedBlogs, loading, error } = useSingleBlog(
    blogId,
    language
  );

  // Show skeleton loading while fetching data
  if (loading) {
    return (
      <section className="relative">
        <FloatedShapes height="1400px" />

        <div className="head py-10 border-b">
          <h3 className="text-2xl md:text-3xl font-[800] font-title max-w-5xl mx-auto px-6">
            {t("blogs")}
          </h3>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-6 space-y-16">
          <SingleBlogHeroSkeleton />
          <SingleBlogContentSkeleton />
          <RelatedBlogsSkeleton />
        </div>
      </section>
    );
  }

  // Show error state
  if (error || !blog) {
    return (
      <section className="relative">
        <FloatedShapes height="1400px" />

        <div className="head py-10 border-b">
          <h3 className="text-2xl md:text-3xl font-[800] font-title max-w-5xl mx-auto px-6">
            {t("blogs")}
          </h3>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-6 text-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-[800] font-title text-red-600">
              {error || t("error_loading_blogs")}
            </h3>
            <p className="text-muted-foreground">{t("error_loading_blogs")}</p>
            <Link
              href="/blogs"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t("back_to_blogs")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <FloatedShapes height="1400px" />

      <div className="head py-10 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/blogs" className="hover:text-foreground transition-colors">
              {t("blogs")}
            </Link>
            <span>/</span>
            <span>{blog.title || t("no_title")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-[800] font-title">
            {t("blogs")}
          </h3>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6 space-y-16">
        <div className="col-span-1 w-full h-full">
          <Image
            src={blog.image || "/placeholder-wide.png"}
            alt={blog.title || "blog-image"}
            width={1000}
            height={1000}
            className="w-full sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg bg-muted"
            onError={(e) => {
              // Fallback to default image if the blog image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-wide.png";
            }}
          />

          <div className="date mt-3">
            <p className="text-md text-muted-foreground">
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : t("no_date")}
            </p>
          </div>
        </div>

        <div className="blog-content space-y-10">
          <div className="head space-y-2 text-center max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-[800] font-title">
              {blog.title || t("no_title")}
            </h3>

            {/* <div className="description">
              <p className="text-md text-muted-foreground px-16">
                {blog.description || t("no_description")}
              </p>
            </div> */}
          </div>

          <div className="content space-y-10">
            {blog.description && (
              <p
                className="text-md text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}

            {/* {blog.keywords && (
              <div className="keywords">
                <h4 className="text-lg font-semibold mb-3">{t("keywords")}:</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-muted px-3 py-1 rounded-full text-sm text-foreground"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <div className="related-blogs">
            <div className="flex items-center justify-center mb-10">
              <h3 className="text-2xl md:text-3xl font-[800] font-title">
                {t("related_blogs")}
              </h3>
            </div>

            <div className="blogs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

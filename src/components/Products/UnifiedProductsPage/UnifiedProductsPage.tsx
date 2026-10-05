"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import ProductsPage from "@/components/Products/ProductsPage/ProdductsPage";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { usePagination } from "@/components/Shared/Pagination";
import { localeHref } from "@/lib/locale";
import Image from "next/image";

interface UnifiedProductsPageProps {
  mode: "products" | "flash-sale";
  title: string;
  showCountdown?: boolean;
}

export default function UnifiedProductsPage({
  mode,
  title,
  showCountdown = false,
}: UnifiedProductsPageProps) {
  const { t, language } = useTranslation("shop");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentPage } = usePagination();

  // Get category and search from URL parameters
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [filters, setFilters] = useState({
    category_id: categoryParam ? parseInt(categoryParam) : null,
    price: undefined as "asc" | "desc" | undefined,
    created: undefined as "asc" | "desc" | undefined,
    search: searchParam || "",
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );

  // Countdown timer for flash sale
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 19,
    minutes: 56,
    seconds: 47,
  });

  // Update filters when URL parameters change
  useEffect(() => {
    setFilters({
      category_id: categoryParam ? parseInt(categoryParam) : null,
      price: undefined as "asc" | "desc" | undefined,
      created: undefined as "asc" | "desc" | undefined,
      search: searchParam || "",
    });
    setSelectedCategory(categoryParam ? parseInt(categoryParam) : null);
  }, [categoryParam, searchParam]);

  // Countdown timer effect
  useEffect(() => {
    if (!showCountdown) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Reset to 24 hours when countdown reaches zero
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown]);

  // Update URL when category changes (preserve search parameter and page)
  const updateURL = (categoryId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId.toString());
    } else {
      params.delete("category");
    }
    // Keep search parameter if it exists
    if (searchParam) {
      params.set("search", searchParam);
    }
    // Reset to page 1 when category changes
    params.delete("page");
    router.push(
      localeHref(
        `/${mode === "flash-sale" ? "flash-sale" : "shop"}?${params.toString()}`,
        language
      )
    );
  };

  // Fetch products with filters and pagination
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    ...filters,
    category_id: filters.category_id === null ? undefined : filters.category_id,
    page: currentPage,
    enabled: true,
    offer: mode === "flash-sale" ? 1 : undefined,
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const isLoading = productsLoading;
  const error = productsError || categoriesError;

  // Handle category selection
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({
      ...prev,
      category_id: categoryId || null,
    }));
    updateURL(categoryId);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    switch (value) {
      case "default":
      case "":
        setFilters((prev) => ({
          ...prev,
          price: undefined,
          created: undefined,
        }));
        break;
      case "newest":
        setFilters((prev) => ({ ...prev, created: "desc", price: undefined }));
        break;
      case "oldest":
        setFilters((prev) => ({ ...prev, created: "asc", price: undefined }));
        break;
      case "price-asc":
        setFilters((prev) => ({ ...prev, price: "asc", created: undefined }));
        break;
      case "price-desc":
        setFilters((prev) => ({ ...prev, price: "desc", created: undefined }));
        break;
      default:
        setFilters((prev) => ({
          ...prev,
          price: undefined,
          created: undefined,
        }));
    }
  };

  // Transform API products and filter for flash sale if needed
  const transformedProducts = (productsData?.data?.products || [])
    .filter((product) => {
      // For flash sale, only show products with product_offers
      if (mode === "flash-sale") {
        return product.product_offers && product.product_offers.length > 0;
      }
      // For regular products, show all products
      return true;
    })
    .map((product) => {
      const image =
        (typeof product.image === "string" ? product.image : "") ||
        (Array.isArray(product.image) ? product.image[0] : "") ||
        product.gallery?.[0] ||
        "";
      const hoverImage =
        product.gallery?.[1] ||
        (Array.isArray(product.image) ? product.image[1] : "") ||
        "";

      return {
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image,
      hoverImage,
      gallery: product.gallery,
      category: product.category?.name || "",
      slug: product.slug,
      rating:
        product.reviews?.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0,
      qty: product.stock,
      default_size: product.default_size,
      sizes: product.sizes,
      product_size: product.product_size,
    };
    });

  const categories = categoriesData?.data?.category || [];

  // Get pagination data from API response
  const pagination = productsData?.data?.pagination || {
    current_page: currentPage,
    last_page: 1,
    total: 0,
    per_page: 12,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <FloatedShapes height="800px" />
      <div className="head py-10 border-b flex justify-center items-center">
        <div className="head flex flex-col items-center gap-2">
          <h2 className="md:text-4xl text-3xl font-bold flex items-center gap-2">
            {title}
            {mode === "flash-sale" && (
              <Image
                src="/fire.png"
                alt="flash-sale"
                width={700}
                height={700}
                className="w-8 h-8 object-contain"
              />
            )}
          </h2>
          {showCountdown && mode === "flash-sale" && (
            <p className="text-lg md:text-2xl text-muted-foreground font-bold capitalize">
              {t("ends_in")}{" "}
              <span className="text-red-500">
                {timeLeft.days > 0 && `${timeLeft.days}${t("d")} `}
                {String(timeLeft.hours).padStart(2, "0")} {t("h")}{" "}
                {String(timeLeft.minutes).padStart(2, "0")} {t("m")}{" "}
                {String(timeLeft.seconds).padStart(2, "0")} {t("s")}
              </span>{" "}
              — {t("dont_miss_out")}
            </p>
          )}
        </div>
      </div>

      <ProductsPage
        key={`${selectedCategory || "all"}-${currentPage}-${mode}`}
        products={transformedProducts as any}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onSortChange={handleSortChange}
        pagination={{
          current_page: pagination.current_page,
          last_page: pagination.last_page,
        }}
        t={t}
        filters={filters}
        isLoading={isLoading}
        mode={mode}
        categoriesLoading={categoriesLoading}
        searchTerm={searchParam || undefined}
      />
    </section>
  );
}

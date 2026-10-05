import ProductCard from "@/components/Products/ProductCard/ProductCard";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { CustomPagination } from "@/components/Shared/Pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Product {
  id: number;
  slug: string;
  sku: string;
  price: string;
  sale_price: string | null;
  stock: number;
  min_stock: number;
  manage_stock: boolean;
  stock_status: string;
  status: string;
  image: string[];
  gallery: string[];
  weight: string;
  dimensions: any[];
  featured: boolean;
  attributes: any[];
  category_id: number;
  name: string;
  description: string;
  short_description: string;
  meta_title: string;
  meta_description: string;
  category: {
    id: number;
    slug: string;
    status: boolean;
    image: string;
    sort_order: number;
    name: string;
    description: string;
    parent_id: number | null;
  } | null;
  product_offers: any[];
  reviews: Array<{
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    title: string | null;
    comment: string;
    approved: boolean;
    images: string[];
    verified_purchase: boolean;
    approved_at: string | null;
    created_at: string;
  }>;
  default_size?: {
    id: number;
    name: string;
    price: string;
    sale_price: string | null;
    final_price: number;
    image?: string | null;
  } | null;
  sizes?: Array<{
    id: number;
    name: string;
    price: string;
    sale_price: string | null;
    stock: number;
    sku: string;
    is_default?: boolean;
  }>;
  product_size?: Array<{
    id: number;
    name: string;
    price: string;
    sale_price: string | null;
    stock: number;
    sku: string;
    is_default?: boolean;
  }>;
}

interface Category {
  id: number;
  slug: string;
  status: boolean;
  sort_order: number;
  name: string;
  description: string;
  /** Parent category object when this is a subcategory, otherwise null. */
  parent: Category | null;
}

interface Pagination {
  last_page: number;
  current_page: number;
}

interface Filters {
  category_id: number | null;
  price: "asc" | "desc" | undefined;
  created: "asc" | "desc" | undefined;
  search: string;
}

// Skeleton component for product cards
const ProductCardSkeleton = () => (
  <div className="card-cover">
    <div className="card-img flex-1 relative group rounded-lg overflow-hidden">
      <Skeleton className="w-full h-[250px]" />
    </div>
    <div className="card-info flex-1">
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-5 w-3/4 mt-2" />
      <div className="card-price mb-3 flex flex-wrap items-center gap-2 justify-between">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

// Skeleton component for category buttons
const CategorySkeleton = () => <Skeleton className="h-8 w-20" />;

export default function ProductsPage({
  products,
  categories,
  selectedCategory,
  onCategoryClick,
  onSortChange,
  pagination,
  mode,
  t,
  isLoading,
  categoriesLoading,
  searchTerm,
  filters,
}: {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onSortChange: (value: string) => void;
  pagination: Pagination;
  mode: "products" | "flash-sale";
  t: any;
  isLoading: boolean;
  categoriesLoading: boolean;
  searchTerm?: string;
  filters: Filters;
}) {
  const clearFilters = () => {
    onSortChange("");
  };

  const { language } = useTranslation();

  const [selectedCategoryData, setSelectedCategoryData] =
    useState<Category | null>(null);

  useEffect(() => {
    setSelectedCategoryData(
      selectedCategory
        ? (categories.find(
            (category) => category.id === selectedCategory
          ) as Category) || null
        : null
    );
  }, [selectedCategory, categories]);

  return (
    <section className="relative">
      <FloatedShapes height="800px" />

      <div className="cover border-b border-border pb-5">
        <div className="categories&sorted max-w-7xl mx-auto pt-5 flex flex-col md:flex-row justify-between items-center gap-5 px-6">
          {/* Categories */}
          <ul className="flex flex-wrap gap-6 gap-y-2 items-center justify-center md:justify-start">
            <li>
              <Button
                variant="ghost"
                onClick={() => onCategoryClick(null)}
                className={`bg-transparent hover:bg-transparent p-0 h-auto border-b-2 rounded-none font-semibold ${
                  selectedCategory === null
                    ? "border-b-primary text-primary"
                    : "border-b-transparent text-muted-foreground"
                }`}
              >
                {t("all_products")}
              </Button>
            </li>
            {categoriesLoading ? (
              // Show skeleton loading for categories
              Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <CategorySkeleton />
                </li>
              ))
            ) : selectedCategoryData?.parent ? (
              // Selected category is a subcategory: show its parent + siblings
              <>
                <li>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onCategoryClick(selectedCategoryData?.parent?.id as number)
                    }
                    className="text-primary bg-transparent hover:bg-transparent p-0 h-auto rounded-none font-bold"
                  >
                    {selectedCategoryData?.parent?.name}
                    <ChevronRight
                      className={`${language === "ar" ? "rotate-180" : ""}`}
                    />
                  </Button>
                </li>
                {categories
                  .filter(
                    (category) =>
                      category.parent?.id === selectedCategoryData?.parent?.id
                  )
                  .map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        onClick={() => onCategoryClick(category.id)}
                        className={`bg-transparent hover:bg-transparent p-0 h-auto border-b-2 rounded-none font-semibold ${
                          selectedCategory === category.id
                            ? "border-b-primary text-primary"
                            : "border-b-transparent text-muted-foreground"
                        }`}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
              </>
            ) : categories.some(
                (cat) => cat.parent?.id === selectedCategory && selectedCategory
              ) ? (
              // Selected category is a parent that has subcategories: show it + children
              <>
                <li>
                  <Button
                    variant="ghost"
                    onClick={() => onCategoryClick(selectedCategory)}
                    className="text-primary bg-transparent hover:bg-transparent p-0 h-auto rounded-none font-bold"
                  >
                    {categories.find((cat) => cat.id === selectedCategory)?.name}
                    <ChevronRight
                      className={`${language === "ar" ? "rotate-180" : ""}`}
                    />
                  </Button>
                </li>
                {categories
                  .filter((category) => category.parent?.id === selectedCategory)
                  .map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        onClick={() => onCategoryClick(category.id)}
                        className={`bg-transparent hover:bg-transparent p-0 h-auto border-b-2 rounded-none font-semibold ${
                          selectedCategory === category.id
                            ? "border-b-primary text-primary"
                            : "border-b-transparent text-muted-foreground"
                        }`}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
              </>
            ) : (
              // Default: show only top-level categories
              categories
                .filter((category) => category.parent == null)
                .map((category) => (
                  <li key={category.id}>
                    <Button
                      variant="ghost"
                      onClick={() => onCategoryClick(category.id)}
                      className={`bg-transparent hover:bg-transparent p-0 h-auto border-b-2 rounded-none font-semibold ${
                        selectedCategory === category.id
                          ? "border-b-primary text-primary"
                          : "border-b-transparent text-muted-foreground"
                      }`}
                    >
                      {category.name}
                    </Button>
                  </li>
                ))
            )}
          </ul>

          {/* Search Indicator and Sort */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="sort flex items-center gap-2">
              {/* {clear filters} */}
              {(filters.price || filters.created) && (
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => clearFilters()}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Select
                onValueChange={(value) => {
                  onSortChange(value);
                }}
                value={
                  filters.created === "desc"
                    ? "newest"
                    : filters.created === "asc"
                    ? "oldest"
                    : filters.price === "asc"
                    ? "price-asc"
                    : filters.price === "desc"
                    ? "price-desc"
                    : ""
                }
              >
                <SelectTrigger className="w-[200px] bg-transparent shadow-none outline-none focus:ring-0 text-foreground text-sm font-semibold !text-foreground">
                  <SelectValue placeholder={t("sort_by")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="oldest">{t("oldest")}</SelectItem>
                  <SelectItem value="price-asc">
                    {t("price_low_to_high")}
                  </SelectItem>
                  <SelectItem value="price-desc">
                    {t("price_high_to_low")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products max-w-7xl mx-auto pt-20 pb-16 px-6">
        {isLoading ? (
          // Show skeleton loading for products
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {searchTerm ? t("no_products_found") : t("no_products_available")}
            </h3>
            {searchTerm && (
              <p className="text-muted-foreground">{t("try_adjusting_search_terms")}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product as any}
                cardSlug={mode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="pagination max-w-7xl mx-auto pb-20 px-6">
          <CustomPagination
            totalPages={pagination.last_page}
            currentPage={pagination.current_page}
          />
        </div>
      )}
    </section>
  );
}

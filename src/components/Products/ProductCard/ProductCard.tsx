"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { Rating } from "@/components/ui/rating";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { ProductCardProps } from "./ProductTypes";
import {
  getProductHoverImage,
  getProductMainImage,
} from "@/lib/productImages";
import { trackAddToWishlist } from "@/lib/tiktokPixel";
import { cn } from "@/lib/utils";

const ZOOM_DURATION_MS = 500;

function ProductCard({ product, cardSlug, isSpecial }: ProductCardProps) {
  const [showAltImage, setShowAltImage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { t } = useTranslation("shop");
  const { addToCart, addToCartLoading, isProductInCart } = useCart();
  const {
    addToWishlist,
    addToWishlistLoading,
    isProductInWishlist,
    removeFromWishlist,
    removeFromWishlistLoading,
  } = useWishlist();

  const productSizes = product.sizes || product.product_size;
  const defaultSize =
    product.default_size ||
    productSizes?.find((s) => s.is_default) ||
    productSizes?.[0];

  // Parse prices to numbers
  const currentPrice = defaultSize
    ? parseFloat(defaultSize.price || "0")
    : parseFloat(product.price) || 0;
  const oldPrice = defaultSize
    ? defaultSize.sale_price
      ? parseFloat(defaultSize.sale_price)
      : null
    : product.sale_price
      ? parseFloat(product.sale_price)
      : null;

  // Check if there's an actual sale (sale_price exists and is different from current price)
  const hasSale = oldPrice !== null && oldPrice !== currentPrice;
  const savings = hasSale ? currentPrice - oldPrice : 0;

  // Toggle wishlist, firing TikTok AddToWishlist only on the add branch.
  const handleWishlistToggle = () => {
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      trackAddToWishlist({
        content_id: String(product.id),
        content_name: product.name,
        price: currentPrice,
      });
      addToWishlist(product.id);
    }
  };

  // Get category name safely with better fallback
  const categoryName =
    product.category ||
    (product.category && typeof product.category === "object"
      ? (product.category as { name?: string }).name
      : product.slug) ||
    "";

  const image = defaultSize?.image || getProductMainImage(product);

  const hoverImageSrc = getProductHoverImage(product, image);
  const showHoverImage = Boolean(hoverImageSrc);

  const rating = product.rating;

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const handleImageEnter = () => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    setIsZoomed(true);
    if (showHoverImage) setShowAltImage(true);
  };

  const handleImageLeave = () => {
    if (showHoverImage) {
      setIsZoomed(false);
      exitTimerRef.current = setTimeout(() => {
        setShowAltImage(false);
        exitTimerRef.current = null;
      }, ZOOM_DURATION_MS);
    } else {
      setIsZoomed(false);
    }
  };

  const zoomClass = isZoomed ? "scale-[1.08]" : "scale-100";

  return (
    <section
      className="card-cover group"
      onMouseEnter={handleImageEnter}
      onMouseLeave={handleImageLeave}
    >
      <div className="card-img flex-1 relative overflow-hidden">
        <div className="slug absolute top-3 left-3 z-10">
          <p
            className={`text-[10px] md:text-xs font-normal text-muted-foreground bg-primary text-white px-3 py-2 rounded-sm capitalize ${
              cardSlug === "flash-sale" ? "!bg-black" : ""
            }`}
          >
            {cardSlug === "flash-sale"
              ? `🔥${t("flash_sale")}`
              : typeof categoryName === "string"
                ? categoryName
                : categoryName?.name || product.slug}
          </p>
        </div>

        <Link href={`/shop/${product.slug}`}>
          {/* Main Image */}
          <div
            className={`w-full relative bg-background touch-manipulation overflow-hidden rounded-sm border border-border ${
              isSpecial
                ? "!h-[300px] sm:!h-[500px]"
                : "!h-[200px] md:!h-[270px]"
            }`}
            onTouchStart={handleImageEnter}
            onTouchEnd={handleImageLeave}
            onTouchCancel={handleImageLeave}
          >
            {image ? (
              <Image
                src={image}
                alt={product.name}
                width={2400}
                height={2400}
                className={`w-full h-full object-contain will-change-transform transition-[transform,opacity] ease-out ${
                  showHoverImage && showAltImage
                    ? "opacity-0 scale-100 duration-300"
                    : `opacity-100 ${zoomClass} duration-500`
                }`}
              />
            ) : (
              <PlaceholderImage
                src={image}
                alt={product.name}
                className={`w-full h-full object-contain bg-muted transition-transform duration-500 ease-out ${zoomClass}`}
              />
            )}

            {showHoverImage && (
              <Image
                src={hoverImageSrc}
                alt={product.name}
                width={2400}
                height={2400}
                className={`w-full h-full object-contain absolute inset-0 z-[1] pointer-events-none will-change-transform ease-out ${
                  showAltImage
                    ? `opacity-100 ${zoomClass} transition-transform duration-500`
                    : "opacity-0 scale-100 transition-[transform,opacity] duration-300"
                }`}
              />
            )}
          </div>
        </Link>

        <div className="actions relative z-20 pointer-events-none">
          {/* Mobile: icon buttons on image */}
          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 z-30 flex sm:hidden items-center justify-between">
            <Button
              size="icon"
              className={`h-9 w-9 rounded-full shadow-md border border-border/60 ${
                isProductInCart(product.id)
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-900 hover:bg-primary hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({
                  productId: product.id,
                  quantity: 1,
                  sizeId: defaultSize?.id,
                });
              }}
              disabled={addToCartLoading}
            >
              {addToCartLoading ? (
                <LoadingSpinner size="sm" color="black" />
              ) : (
                <ShoppingCartIcon className="w-4 h-4" />
              )}
            </Button>

            <Button
              size="icon"
              className={`h-9 w-9 rounded-full shadow-md border border-border/60 ${
                isProductInWishlist(product.id)
                  ? "bg-primary text-white"
                  : "bg-white text-primary hover:bg-primary hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              disabled={addToWishlistLoading || removeFromWishlistLoading}
            >
              {addToWishlistLoading || removeFromWishlistLoading ? (
                <LoadingSpinner size="sm" color="black" />
              ) : (
                <HeartIcon
                  className={`w-4 h-4 ${
                    isProductInWishlist(product.id)
                      ? "fill-white"
                      : "fill-none"
                  }`}
                />
              )}
            </Button>
          </div>

          {/* Desktop: quick add centered, fit-content width */}
          <div className="add-to-cart pointer-events-auto hidden sm:flex justify-center absolute bottom-5 left-0 right-0 z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Button
              className={`w-auto px-6 text-[13px] font-[600] rounded-sm h-11 shadow-md border border-border/60 ${
                isProductInCart(product.id)
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white text-neutral-900 hover:bg-primary hover:text-white"
              }`}
              onClick={() =>
                addToCart({
                  productId: product.id,
                  quantity: 1,
                  sizeId: defaultSize?.id,
                })
              }
              disabled={addToCartLoading}
            >
              {addToCartLoading ? (
                <LoadingSpinner size="sm" className="" color="black" />
              ) : (
                <ShoppingCartIcon className="w-4 h-4" />
              )}
              <span>
                {isProductInCart(product.id)
                  ? t("added_to_cart")
                  : t("quick_add")}
              </span>
            </Button>
          </div>

          <Button
            size="icon"
            className={`pointer-events-auto absolute top-3 right-3 z-30 hidden sm:inline-flex rounded-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${
              isProductInWishlist(product.id)
                ? "bg-primary text-white"
                : "bg-background text-primary hover:bg-primary hover:text-white"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle();
            }}
            disabled={addToWishlistLoading || removeFromWishlistLoading}
          >
            {addToWishlistLoading || removeFromWishlistLoading ? (
              <LoadingSpinner size="sm" color="black" />
            ) : (
              <HeartIcon
                className={`w-4 h-4 transition-all duration-300 ${
                  isProductInWishlist(product.id) ? "fill-white" : "fill-white"
                }`}
              />
            )}
          </Button>
        </div>
      </div>
      <div className="card-info flex-1">
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs font-normal text-muted-foreground">
            {typeof categoryName === "string"
              ? categoryName
              : categoryName?.name || product.slug}
          </p>

          <div className="rating flex items-center gap-1">
            <Rating
              value={rating}
              size={16}
              readonly
              maxValue={1}
              allowFraction={true}
              fillColor="#FFAC33"
              className="flex items-center gap-1"
            />
            <p className="text-xs font-normal text-muted-foreground">
              {rating?.toFixed(1)}
            </p>
          </div>
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-md sm:text-lg font-bold text-foreground my-2 hover:text-primary transition-all duration-300">
            {defaultSize
              ? `${product.name} - ${defaultSize.name}`
              : product.name}
          </h3>
        </Link>
        <div className="card-price mb-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="prices flex items-center gap-2">
            <div className="price">
              <p
                className={cn(
                  "text-sm sm:text-md font-[800] text-foreground",
                  hasSale && "line-through"
                )}
              >
                {currentPrice.toFixed(2)} {t("egp")}
              </p>
            </div>

            {/* Only show old price if there's an actual sale */}
            {hasSale && oldPrice && (
              <div className="old-price">
                <p className="text-xs sm:text-sm font-normal text-primary ">
                  {oldPrice.toFixed(2)} {t("egp")}
                </p>
              </div>
            )}
          </div>

          {/* Only show savings if there's an actual sale */}
          {hasSale && savings > 0 && (
            <div className="save hidden sm:block">
              <p className="text-xs font-normal text-red-500">
                {t("save")} {savings.toFixed(2)} {t("egp")}
              </p>
            </div>
          )}
        </div>

        <Button
          className={`sm:hidden w-full h-11 mt-2 rounded-md font-semibold flex items-center justify-center gap-2 ${
            isProductInCart(product.id)
              ? "bg-primary text-white"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
          onClick={() =>
            addToCart({
              productId: product.id,
              quantity: 1,
              sizeId: defaultSize?.id,
            })
          }
          disabled={addToCartLoading}
        >
          {addToCartLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            <>
              <span>
                {isProductInCart(product.id)
                  ? t("added_to_cart")
                  : t("quick_add")}
              </span>
              <ShoppingCartIcon className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}

export default ProductCard;
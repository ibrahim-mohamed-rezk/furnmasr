"use client";

import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { VideoProduct } from "@/lib/api";
import { cn, getImageUrl } from "@/lib/utils"; 
import { ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";

type VideoProductOverlayProps = {
  product: VideoProduct;
  videoTitle?: string;
  className?: string;
};

function resolveProductSlug(product: VideoProduct, language: "ar" | "en") {
  if (language === "ar" && product.slug_ar) return product.slug_ar;
  if (language === "en" && product.slug_en) return product.slug_en;
  return product.slug || String(product.id);
}

export function VideoProductOverlay({
  product,
  videoTitle,
  className,
}: VideoProductOverlayProps) {
  const { language } = useLanguage();
  const { t } = useTranslation("shop");
  const { addToCart, addToCartLoading } = useCart();

  const listPrice = Number(product.price) || 0;
  const salePrice = product.sale_price ? Number(product.sale_price) : null;
  const hasSale =
    salePrice !== null && salePrice > 0 && salePrice < listPrice;
  const displayPrice = hasSale ? salePrice : listPrice;
  const productName = product.name?.trim() || videoTitle || t("product");
  const productSlug = resolveProductSlug(product, language);
  const isOutOfStock =
    product.status === "inactive" ||
    (typeof product.stock === "number" && product.stock <= 0);

  return (
    <div
      className={cn("absolute w-[75%] mx-auto inset-x-0 bottom-0 z-20 p-3 sm:p-4", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="overflow-hidden rounded-xl border border-white/20 bg-background/80 shadow-xl backdrop-blur-sm">
        <div className="relative flex items-start gap-3 p-3 sm:p-4">
          <Link
            href={`/shop/${productSlug}`}
            className="absolute end-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={productName}
          >
            <ExternalLink className="h-4 w-4" />
          </Link>

          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-20">
            <Image
              src={getImageUrl(product.image, "/placeholder-image.png")}
              alt={productName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pe-8">
            <p className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
              {productName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-1 text-sm font-bold">
                {displayPrice} {t("egp")}
              </span>
              {hasSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {listPrice} {t("egp")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 pb-3 sm:pb-4">
          <Button
            type="button"
            className="h-10 w-[65vw] max-w-full rounded-full bg-foreground/55 text-background backdrop-blur-sm hover:bg-foreground/70"
            disabled={isOutOfStock || addToCartLoading}
            onClick={() => addToCart({ productId: product.id, quantity: 1 })}
          >
          {addToCartLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isOutOfStock ? (
            t("out_of_stock")
          ) : (
            t("add_to_cart")
          )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { PlaceholderImage } from "../ui/placeholder-image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";

interface CartProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    qty: number;
    oldPrice: number;
    hoverImage?: string;
    slug?: string;
    rating?: number;
  };
  isWishlist?: boolean;
  cartPage?: boolean;
  onRemove?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
  updateCartItemLoading?: boolean;
  addToCartLoading?: boolean;
  isProductInCart?: (productId: number) => boolean;
  addToCart?: (productId: number, quantity: number) => void;
  removeFromCartLoading?: boolean;
  removeFromWishlistLoading?: boolean;
  itemId?: number; // Add itemId for tracking specific item loading
  removingItemId?: number | null; // Add removingItemId for cart
  removingWishlistItemId?: number | null; // Add removingItemId for wishlist
  addingToCartItemId?: number | null; // Add addingToCartItemId for cart
  updatingItemId?: number | null; // Add updatingItemId for cart quantity updates
  itemProductId?: number | null; // Add itemProductId for cart
}

function CartProductCard({
  product,
  isWishlist,
  cartPage,
  onRemove,
  onUpdateQuantity,
  addToCartLoading,
  isProductInCart,
  addToCart,
  updateCartItemLoading,
  removeFromCartLoading,
  removeFromWishlistLoading,
  itemId,
  removingItemId,
  removingWishlistItemId,
  addingToCartItemId,
  updatingItemId,
  itemProductId,
}: CartProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [qty, setQty] = useState(product.qty);
  const { t } = useTranslation("shop");

  return (
    <section className="flex items-center justify-between border-b last:border-0 border-border gap-6 py-4 w-full">
      <Link href={`/shop/${product.slug}`}>
        <div
          className="card-img flex justify-center items-center relative"
          onMouseEnter={() => product.hoverImage && setIsHovered(true)}
          onMouseLeave={() => product.hoverImage && setIsHovered(false)}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt="product"
              width="800"
              height="800"
              className={`w-[120px] h-[120px] object-cover transition-opacity duration-500 bg-muted ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
          ) : (
            <PlaceholderImage
              src={product.image}
              alt="product"
              width="800"
              height="800"
              className={`w-[120px] h-[120px] object-cover transition-opacity duration-500 bg-muted ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {product.hoverImage ? (
            <Image
              src={product.hoverImage}
              alt="product"
              width="800"
              height="800"
              className={`w-[120px] h-[120px] object-cover absolute top-0 left-0 transition-opacity duration-500 bg-black ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <PlaceholderImage
              src={product.hoverImage ?? null}
              alt="product"
              width="800"
              height="800"
              className={`w-[120px] h-[120px] object-cover absolute top-0 left-0 transition-opacity duration-500 bg-black ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </Link>
      <div
        className={`card-info flex-1 ${
          cartPage ? "flex flex-col lg:flex-row lg:items-center lg:gap-8" : ""
        }`}
      >
        <div className="cover">
          <div className="category">
            <p className="text-xs font-normal text-muted-foreground">{product.slug}</p>
          </div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-lg font-bold text-foreground my-2 hover:text-primary transition-all duration-300">
              {product.name}
            </h3>
          </Link>
          <div className="card-price mb-3 flex flex-wrap items-center gap-2">
            <p className="text-md font-[700] text-foreground">
              {product.price} {t("egp")}
            </p>

            {product.oldPrice && product.oldPrice > 0 && (
              <p className="text-sm font-normal text-primary line-through ">
                {product.oldPrice} {t("egp")}
              </p>
            )}

            {cartPage && (
              <div className="save flex items-center gap-2 bg-red-500 px-2 py-1">
                <p className="text-xs font-normal text-white">
                  {t("save")} {product.oldPrice - product.price} {t("egp")}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="actions flex items-center flex-wrap gap-2">
          {isWishlist ? (
            <div className="remove">
              <Button
                size="sm"
                className="bg-black text-white rounded-sm transition-all duration-300 capitalize"
                disabled={addToCartLoading || isProductInCart?.(product.id)}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isProductInCart?.(product.id)) {
                    // Optionally show a message here
                    return;
                  }
                  // Ensure addToCart is a function before calling
                  if (typeof addToCart === "function") {
                    addToCart(product.id, 1);
                  }
                }}
              >
                {addToCartLoading && product.id === addingToCartItemId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[12px]">{t("add_to_cart")}</span>
                  </>
                ) : isProductInCart?.(product.id) ? (
                  t("added_to_cart")
                ) : (
                  t("add_to_cart")
                )}
              </Button>
            </div>
          ) : (
            <div className="qty flex items-center gap-2 border border-border rounded-md justify-between">
              <button
                onClick={() => {
                  const newQty = Math.max(1, qty - 1);
                  setQty(newQty);
                  onUpdateQuantity?.(newQty);
                }}
                className="cursor-pointer p-2 border-r border-border"
                disabled={qty <= 1 || updateCartItemLoading}
              >
                {updateCartItemLoading && itemProductId === updatingItemId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MinusIcon className="w-4 h-4" />
                )}
              </button>
              <p className="text-md font-semibold px-2">{qty}</p>
              <button
                onClick={() => {
                  const newQty = qty + 1;
                  setQty(newQty);
                  onUpdateQuantity?.(newQty);
                }}
                className="cursor-pointer p-2 border-l border-border"
                disabled={
                  updateCartItemLoading && itemProductId === updatingItemId
                }
              >
                {updateCartItemLoading && itemProductId === updatingItemId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          <div className="remove">
            {(removeFromCartLoading && itemId === removingItemId) ||
            (removeFromWishlistLoading && itemId === removingWishlistItemId) ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <span
                className="text-sm text-red-500 cursor-pointer"
                onClick={onRemove}
              >
                {t("remove")}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartProductCard;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { trackInitiateCheckout, TrackedItem } from "@/lib/tiktokPixel";
import { useBuyNowStore } from "@/store/buyNow";
import CouponSection from "./CouponSection";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X, MinusIcon, PlusIcon, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCheckoutShipping } from "@/contexts/CheckoutShippingContext";

function OrderDetails() {
  const [couponData, setCouponData] = useState<any>(null);

  const { t } = useTranslation("checkout");
  const { shippingLocation } = useCheckoutShipping();
  const {
    cartData,
    cartLoading,
    updateCartItem,
    updateCartItemLoading,
    updatingItemId,
    removeFromCart,
    removeFromCartLoading,
    removingItemId,
  } = useCart({
    cityId: shippingLocation.cityId,
    addressId: shippingLocation.addressId,
  });
  const buyNowProduct = useBuyNowStore((s) => s.product);
  const setBuyNowProduct = useBuyNowStore((s) => s.setProduct);

  // Determine which products to show and calculate totals
  const displayItems = buyNowProduct
    ? [buyNowProduct]
    : cartData?.cart?.items || [];
  const displayTotal = buyNowProduct
    ? buyNowProduct.price * buyNowProduct.quantity
    : cartData?.cart?.total_amount || 0;
  const totalItems = buyNowProduct
    ? buyNowProduct.quantity
    : (cartData?.cart?.items || []).reduce(
        (acc, item) => acc + item.quantity,
        0
      );

  const discount = couponData?.discount || 0;
  const totalAfterDiscount = displayTotal - discount;
  const shippingCost = Number(cartData?.shipping_cost ?? 0);
  const finalTotal = Number(totalAfterDiscount) + Number(shippingCost);

  // TikTok InitiateCheckout — fire once when the checkout summary first has
  // items. Ref-guarded so coupon/shipping recomputes don't re-fire.
  const initiateCheckoutFired = useRef(false);
  useEffect(() => {
    if (initiateCheckoutFired.current || cartLoading || displayItems.length === 0)
      return;
    initiateCheckoutFired.current = true;

    const items: TrackedItem[] = buyNowProduct
      ? [
          {
            content_id: String(buyNowProduct.id),
            content_name: buyNowProduct.name,
            quantity: buyNowProduct.quantity,
            price: Number(buyNowProduct.price) || 0,
          },
        ]
      : (cartData?.cart?.items || []).map((it) => ({
          content_id: String(it.product?.id),
          content_name: it.product?.name,
          quantity: it.quantity,
          price:
            Number(it.price ?? it.product?.sale_price ?? it.product?.price) ||
            0,
        }));

    trackInitiateCheckout(items, Number(finalTotal) || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartLoading, displayItems.length, buyNowProduct]);

  return (
    <section className="bg-primary-light dark:bg-card/80 border border-transparent dark:border-border xl:px-20 lg:px-10 px-5 py-10 h-full rounded-lg">
      <div className="title mb-10">
        <div className="flex items-center justify-between border-b border-primary pb-5">
          <h2 className="text-xl font-[800]">{t("order_summary")}</h2>
          {buyNowProduct && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBuyNowProduct(null)}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <X className="w-4 h-4 mr-2" />
              {t("clear_buy_now")}
            </Button>
          )}
        </div>
      </div>

      <div className="products space-y-10">
        {cartLoading ? (
          // Loading skeletons for products
          Array.from({ length: 1 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="product flex items-center flex-wrap justify-between gap-4 border-b border-border pb-10 last:border-b-0"
            >
              <div className="info flex items-center flex-wrap gap-5">
                <div className="image relative">
                  <Skeleton className="w-24 h-24" />
                  <div className="quantity absolute top-[-8px] right-[-8px]">
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </div>
                </div>
                <div className="title">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="price">
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))
        ) : displayItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">{t("no_items_in_cart")}</p>
          </div>
        ) : (
          displayItems.map((item: any) => {
            // Handle both buy now products and cart items
            const isBuyNowProduct =
              buyNowProduct && item.id === buyNowProduct.id;
            const hasProductSize = !isBuyNowProduct && item.product_size;
            const productName = isBuyNowProduct
              ? item.name
              : hasProductSize
                ? `${item.product?.name} - ${item.product_size.name}`
                : item.product?.name;
            const productImage = isBuyNowProduct
              ? item.image
              : hasProductSize && item.product_size.image
                ? item.product_size.image
                : item.product?.image?.[0] || item.image?.[0];
            const productPrice = isBuyNowProduct
              ? item.price
              : hasProductSize
                ? (item.product_size.sale_price || item.product_size.price)
                : item.product?.sale_price;
            const quantity = item.quantity;

            const isUpdating = updatingItemId === item?.product?.id;
            const isRemoving = removingItemId === item.id;

            return (
              <div
                className={`product flex flex-col gap-3 border-b border-border pb-6 mb-4 last:border-b-0 last:mb-0 transition-opacity ${isRemoving ? 'opacity-50' : ''}`}
                key={item.id}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="info flex items-center gap-4 flex-1 min-w-0">
                    <div className="image relative flex-shrink-0">
                      <PlaceholderImage
                        src={productImage || ""}
                        alt={productName || t("product")}
                        width="500"
                        height="500"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3 className="lg:text-base text-sm font-[600] truncate">
                        {productName || t("product")}
                      </h3>
                      <p className="text-sm font-[600] text-primary mt-1">
                        {productPrice || 0} {t("egp")}
                      </p>
                    </div>
                  </div>

                  {/* Delete button */}
                  {!isBuyNowProduct && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0 h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                    <button
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-40"
                      disabled={quantity <= 1 || isUpdating}
                      onClick={() => {
                        if (isBuyNowProduct) {
                          setBuyNowProduct({ ...buyNowProduct!, quantity: Math.max(1, quantity - 1) });
                        } else {
                          updateCartItem({ itemId: item?.product?.id, quantity: quantity - 1 });
                        }
                      }}
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold min-w-[28px] text-center">
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                      ) : (
                        quantity
                      )}
                    </span>
                    <button
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-40"
                      disabled={isUpdating}
                      onClick={() => {
                        if (isBuyNowProduct) {
                          setBuyNowProduct({ ...buyNowProduct!, quantity: quantity + 1 });
                        } else {
                          updateCartItem({ itemId: item?.product?.id, quantity: quantity + 1 });
                        }
                      }}
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-[700]">
                    {((Number(productPrice) || 0) * quantity).toFixed(2)} {t("egp")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CouponSection onCouponApplied={setCouponData} />

      <div className="total py-10">
        {cartLoading ? (
          // Loading skeletons for totals
          <ul className="space-y-5 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-5 w-full">
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">
                {totalItems} {t("items")}
              </h3>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("subtotal")}</h3>
              <p className="text-lg font-[600]">
                {displayTotal} {t("egp")}
              </p>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("discount")}</h3>
              <p className="text-lg font-[600] text-red-500">
                {discount ? `-${discount} ${t("egp")}` : `0.00 ${t("egp")}`}
              </p>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("shipping")}</h3>
              <p className="text-lg font-[600]">
                {shippingCost} {t("egp")}
              </p>
            </li>
            <li className="flex items-center justify-between border-t border-border pt-5">
              <h3 className="text-lg font-[600]">{t("total")}</h3>
              <p className="text-lg font-[600]">
                {finalTotal} {t("egp")}
              </p>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default OrderDetails;

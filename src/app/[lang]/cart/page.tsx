"use client";
import CartProductCard from "@/components/Cart/CartProductCard";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState, Suspense } from "react";
import ViewedProducts from "./ViewedProducts/ViewedProducts";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/useCart";
import { CartItemSkeleton } from "@/components/ui/cart-item-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function CartPageContent() {
  const { t } = useTranslation("cart");
  const [isClient, setIsClient] = useState(false);
  const {
    cartData,
    cartLoading,
    updateCartItem,
    removeFromCart,
    updatingItemId,
    removingItemId,
    updateCartItemLoading,
    removeFromCartLoading,
  } = useCart();

  // Prevent hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems =
    cartData?.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalAmount = cartData?.cart?.total_amount || 0;
  const cartItems = cartData?.cart?.items || [];

  // Don't render anything until client-side
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="header flex justify-center items-center w-full border-b border-black border-t  py-10">
          <h1 className="text-4xl font-bold text-center">{t("your_cart")}</h1>
        </div>
        <div className=" relative flex flex-col md:flex-row justify-between items-start gap-8 max-w-7xl mx-auto px-6 py-20">
          <div className="products w-full md:w-[60%]">
            <div className="">
              {Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          </div>
          <div className="checkout w-full md:w-[40%] sticky top-24">
            <div className="p-8 lg:p-16 border border-primary rounded-xl w-full sticky top-5">
              <div className="items border-b border-border pb-4">
                <Skeleton className="w-full h-8" />
              </div>
              <div className="total flex justify-between items-center my-8 gap-4">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-24 h-8" />
              </div>
              <div className="note mb-10">
                <div className="flex gap-2">
                  <AlertCircle className="w-6 h-6 text-[#C28D2A]" />
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
              <div className="checkout-btn">
                <Skeleton className="w-full h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="header flex justify-center items-center w-full border-b border-black border-t  py-10">
        <h1 className="text-4xl font-bold text-center">{t("your_cart")}</h1>
      </div>

      <div className=" relative flex flex-col md:flex-row justify-between items-start gap-8 max-w-7xl mx-auto px-6 py-20">
        <div className="products w-full md:w-[60%]">
          {cartLoading ? (
            <div className="">
              {Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          ) : cartItems?.length > 0 ? (
            cartItems?.map((item) => (
              <CartProductCard
                key={item.id}
                itemId={item.id}
                itemProductId={item.product.id}
                updatingItemId={updatingItemId}
                removingItemId={removingItemId}
                updateCartItemLoading={updateCartItemLoading}
                removeFromCartLoading={removeFromCartLoading}
                product={{
                  id: item.product.id,
                  name: item.product_size
                    ? `${item.product.name} - ${item.product_size.name}`
                    : item.product.name,
                  price: item.product_size
                    ? Number(
                        item.product_size.sale_price || item.product_size.price,
                      )
                    : Number(
                        item.product.sale_price || item.product.price || 0,
                      ),
                  image:
                    item.product_size?.image || item.product.image?.[0] || "",
                  hoverImage: item.product.image?.[1] || "",
                  category: item.product.category?.name || item.product?.slug,
                  qty: item.quantity,
                  oldPrice: item.product_size
                    ? Number(item.product_size.price || 0)
                    : Number(item.product.price || 0),
                }}
                onUpdateQuantity={(quantity: number) =>
                  updateCartItem({ itemId: item?.product?.id, quantity })
                }
                onRemove={() => removeFromCart(item.id)}
                cartPage={true}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <h1 className="text-2xl font-bold">{t("empty_cart")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("empty_cart_description")}
              </p>
              <Link href="/shop" className="text-sm text-blue-500">
                <Button className="bg-black text-white">
                  {t("go_to_shop")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="checkout w-full md:w-[40%] sticky top-24">
          <div className="p-8 lg:p-16 border border-primary rounded-xl w-full sticky top-5">
            <div className="items border-b border-border pb-4">
              <h3 className="text-2xl font-bold">
                {cartLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  `${totalItems} Items`
                )}
              </h3>
            </div>

            <div className="total flex justify-between items-center my-8 gap-4">
              <h2 className="text-2xl font-bold">{t("total")}</h2>
              <p className="text-2xl font-bold">
                {cartLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  `${totalAmount} ${t("egp")}`
                )}
              </p>
            </div>

            <div className="note mb-10">
              <div className="flex gap-2">
                <AlertCircle className="w-6 h-6 text-[#C28D2A]" />
                <p className="text-[14px] font-normal text-[#C28D2A]">
                  {t(
                    "final_price_including_shipping_and_discounts_appears_at_checkout",
                  )}
                </p>
              </div>
            </div>

            <div className="checkout-btn">
              <Link href="/checkout">
                <Button className="w-full bg-black text-white h-12">
                  {t("checkout")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ViewedProducts />
    </div>
  );
}

function CartPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <CartPageContent />
    </Suspense>
  );
}

export default CartPage;

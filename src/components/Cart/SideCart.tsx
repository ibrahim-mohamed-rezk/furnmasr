"use client";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import CartProductCard from "./CartProductCard";
import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { AlertCircle } from "lucide-react";
import EmptyCart from "./EmptyCart";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/useCart";
import { CartItemSkeleton } from "@/components/ui/cart-item-skeleton";
import { isAuthenticated } from "@/hooks/useAuth";
import { useCartSheetStore } from "@/store/cartSheet";

function SideCart() {
  const isOpen = useCartSheetStore((s) => s.isOpen);
  const setIsOpen = useCartSheetStore((s) => s.setOpen);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation("shop");
  const { direction } = useLanguage();
  const { cartData } = useCart();
  const anonymousCartCount = cartData?.cart?.items?.length || 0;
  const {
    cartLoading,
    updateCartItem,
    removeFromCart,
    updateCartItemLoading,
    addToCartLoading,
    isProductInCart,
    addToCart,
    removeFromCartLoading,
    removingItemId,
    addingToCartItemId,
    updatingItemId,
  } = useCart();

  // Handle hydration - ALWAYS call this hook
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle both authenticated and anonymous cart data structures
  const getCartItems = () => {
    if (isAuthenticated()) {
      // Authenticated: cartData.data.cart.items
      return (cartData as any)?.cart?.items || [];
    } else {
      // Anonymous: cartData.cart.items
      return (cartData as any)?.cart?.items || [];
    }
  };

  const getSubtotal = () => {
    if (isAuthenticated()) {
      // Authenticated: cartData.data.total_cart
      return (cartData as any)?.total_cart || 0;
    } else {
      // Anonymous: cartData.total_cart
      return (cartData as any)?.total_cart || 0;
    }
  };

  const cartItems = getCartItems();
  const subtotal = getSubtotal();

  // Use anonymous count if not authenticated, otherwise use authenticated count
  const displayCartCount = isAuthenticated()
    ? cartItems.length
    : anonymousCartCount;

  // Render content based on client state
  const renderContent = () => {
    if (!isClient) {
      return (
        <div>
          <ShoppingCart className="h-6 w-6" />
        </div>
      );
    }

    

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="flex items-center justify-center relative">
            <div className="absolute bottom-[-2px] right-[-2px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs z-10">
              {displayCartCount}
            </div>
            <ShoppingCart className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side={direction === "ltr" ? "right" : "left"}
          className="p-0 fixed !w-[90%] lg:!max-w-lg !max-w-none h-full"
          style={{
            maxWidth: "90% !important",
          }}
        >
          <SheetHeader className="border-b border-border pb-4 p-4">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              {t("cart")}
              {cartItems.length > 0 ? (
                <span className="text-lg text-muted-foreground font-normal">
                  {`(${cartItems.length})`}
                </span>
              ) : (
                ""
              )}
            </SheetTitle>
          </SheetHeader>

          {cartLoading ? (
            // Show skeleton loading
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          ) : cartItems.length > 0 ? (
            <>
              <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-370px)] sm:max-h-[calc(100vh-315px)] px-6">
                {cartItems.map((item: any) => (
                  <CartProductCard
                    key={item.id.toString()}
                    updateCartItemLoading={updateCartItemLoading}
                    addToCartLoading={addToCartLoading}
                    isProductInCart={isProductInCart}
                    removeFromCartLoading={removeFromCartLoading}
                    removingItemId={removingItemId}
                    addingToCartItemId={addingToCartItemId}
                    updatingItemId={updatingItemId}
                    itemId={item?.id}
                    itemProductId={item?.product?.id}
                    addToCart={(productId: number, quantity: number) =>
                      addToCart({ productId, quantity })
                    }
                    product={{
                      id: item.product.id,
                      name: item.product_size
                        ? `${item.product.name} - ${item.product_size.name}`
                        : item.product.name,
                      price: item.product_size
                        ? parseFloat(
                            item.product_size.sale_price ||
                              item.product_size.price,
                          )
                        : parseFloat(
                            item.product.sale_price ||
                              item.product.price ||
                              "0",
                          ),
                      oldPrice: item.product_size
                        ? parseFloat(item.product_size.price || "0")
                        : item.product.price
                          ? parseFloat(item.product.price)
                          : 0,
                      image:
                        item.product_size?.image ||
                        item.product.image?.[0] ||
                        "",
                      hoverImage: item.product.image?.[1] || "",
                      category: item.product.category?.name || "",
                      slug: item.product.slug,
                      rating:
                        item.product.reviews?.length > 0
                          ? item.product.reviews.reduce(
                              (acc: any, review: any) => acc + review.rating,
                              0,
                            ) / item.product.reviews.length
                          : 0,
                      qty: Number(item.quantity) || 1,
                    }}
                    onUpdateQuantity={(quantity: number) =>
                      updateCartItem({ itemId: item?.product?.id, quantity })
                    }
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>

              <SheetFooter className="block px-6 border-t border-border py-5 absolute bottom-0 left-0 right-0 bg-background z-10 h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold">{t("sub_total")}</p>
                  <p className="text-lg font-bold">
                    {subtotal} {t("egp")}
                  </p>
                </div>

                <ul className="flex flex-col gap-4">
                  <li>
                    <Link href="/checkout">
                      <Button
                        className="w-full capitalize bg-black text-white rounded-sm transition-all duration-300"
                        size="lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("check_out_now")}
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart">
                      <Button
                        className="w-full capitalize rounded-sm hover:bg-black hover:text-white transition-all duration-300"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("view_cart")}
                      </Button>
                    </Link>
                  </li>

                  <li>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-[#C28D2A]" />
                      <p className="text-[14px] font-normal text-[#C28D2A]">
                        {t(
                          "final_price_including_shipping_and_discounts_appears_at_checkout",
                        )}
                      </p>
                    </div>
                  </li>
                </ul>
              </SheetFooter>
            </>
          ) : (
            <EmptyCart setOpen={setIsOpen} />
          )}
        </SheetContent>
      </Sheet>
    );
  };

  return renderContent();
}

export default SideCart;

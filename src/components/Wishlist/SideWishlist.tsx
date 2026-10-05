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
import { Heart } from "lucide-react";
import CartProductCard from "@/components/Cart/CartProductCard";
import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { AlertCircle } from "lucide-react";
import EmptyWishlist from "./EmtyWishlist";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { CartItemSkeleton } from "@/components/ui/cart-item-skeleton";
import { isAuthenticated } from "@/hooks/useAuth";

function SideWishlist() {
  const [open, setOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation("");
  const { direction } = useLanguage();
  const { wishlistData } = useWishlist();
  const anonymousWishlistCount = wishlistData?.data?.length || 0;
  const {
    wishlistLoading,
    removeFromWishlist,
    removeFromWishlistLoading,
    removingItemId,
  } = useWishlist();
  const { addToCart, addToCartLoading, isProductInCart, addingToCartItemId } =
    useCart();

  // Handle hydration - ALWAYS call this hook
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle both authenticated and anonymous wishlist data structures
  const getWishlistItems = () => {
    if (isAuthenticated()) {
      // Authenticated: wishlistData.data
      return (wishlistData as any) || [];
    } else {
      // Anonymous: wishlistData (already transformed)
      return wishlistData || [];
    }
  };

  const wishlistItems = getWishlistItems();

  // Use anonymous count if not authenticated, otherwise use authenticated count
  const displayWishlistCount = wishlistItems.length
    ;

  // Render content based on client state
  const renderContent = () => {
    if (!isClient) {
      return (
        <div>
          <Heart className="h-6 w-6" />
        </div>
      );
    }

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="flex items-center justify-center relative">
            <div className="absolute bottom-[-2px] right-[-2px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs z-10">
              {displayWishlistCount}
            </div>
            <Heart className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side={direction === "ltr" ? "right" : "left"}
          className="p-0 fixed !w-[90%] lg:!max-w-lg"
          style={{
            maxWidth: "90% !important",
          }}
        >
          <SheetHeader className="border-b border-border pb-4 p-4">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              {t("shop.wishlist")}
              {wishlistItems.length > 0 ? (
                <span className="text-lg text-muted-foreground font-normal">
                  {`(${wishlistItems.length})`}
                </span>
              ) : (
                ""
              )}
            </SheetTitle>
          </SheetHeader>

          {wishlistLoading ? (
            // Show skeleton loading
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          ) : (wishlistItems as any[]).length > 0 ? (
            <>
              <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-145px)] px-6">
                {wishlistItems.map((item: any) => (
                  <CartProductCard
                    key={item.id.toString()}
                    isWishlist={true}
                    addToCartLoading={addToCartLoading}
                    isProductInCart={isProductInCart}
                    removeFromWishlistLoading={removeFromWishlistLoading}
                    removingWishlistItemId={removingItemId}
                    addingToCartItemId={addingToCartItemId}
                    itemId={item.product.id}
                    addToCart={(productId: number, quantity: number) =>
                      addToCart({ productId, quantity })
                    }
                    product={{
                      id: item.product.id,
                      name: item.product.name,
                      price: parseFloat(item.product.price),
                      oldPrice: item.product.sale_price
                        ? parseFloat(item.product.sale_price)
                        : 0,
                      image: item.product.image?.[0] || "",
                      hoverImage: item.product.image?.[1] || "",
                      category: item.product.category?.name || "",
                      slug: item.product.slug,
                      rating:
                        item.product.reviews?.length > 0
                          ? item.product.reviews.reduce(
                              (acc: any, review: any) => acc + review.rating,
                              0
                            ) / item.product.reviews.length
                          : 0,
                      qty: 1,
                    }}
                    onRemove={() => removeFromWishlist(item.product.id)}
                  />
                ))}
              </div>

              <SheetFooter className="block px-6 border-t border-border py-5 absolute bottom-0 left-0 right-0 bg-background z-10 h-[80px]">
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link href="/shop">
                      <Button
                        className="w-full capitalize bg-black text-white rounded-sm transition-all duration-300"
                        size="lg"
                        onClick={() => setOpen(false)}
                      >
                        {t("cart.continue_shopping")}
                      </Button>
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="/wishlist">
                      <Button
                        className="w-full capitalize rounded-sm hover:bg-black hover:text-white transition-all duration-300"
                        variant="outline"
                        size="lg"
                        onClick={() => setOpen(false)}
                      >
                        {t("shop.view_wishlist")}
                      </Button>
                    </Link>
                  </li> */}
                </ul>
              </SheetFooter>
            </>
          ) : (
            <EmptyWishlist setOpen={setOpen} />
          )}
        </SheetContent>
      </Sheet>
    );
  };

  return renderContent();
}

export default SideWishlist;

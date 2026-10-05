"use client";
import { Button } from "@/components/ui/button";
import {
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { Product, ProductOffer, ProductSize } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { SocialShare } from "./SocialShare";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { localeHref } from "@/lib/locale";
import { trackAddToWishlist } from "@/lib/tiktokPixel";
import { FixedBottomBar } from "./FixedBottomBar";
import ExtraSections from "./ExtraSections";
import PaymentMethodLogos from "./PaymentMethodLogos";

function ProductDetails({
  product,
  onSizeChange,
}: {
  product: Product;
  onSizeChange?: (size: ProductSize) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [qty, setQty] = useState(1);
  const { t: tShop, language } = useTranslation("shop");
  const { t: tFlashSale } = useTranslation("flash-sale");
  const { paymentMethods } = usePaymentMethods();
  // Cart and wishlist hooks
  const router = useRouter();
  const {
    addToCart,
    addToCartAsync,
    addToCartLoading,
    isProductInCart,
    getCartItemQuantity,
    updateCartItemLoading,
    updateCartItem,
  } = useCart();

  const {
    addToWishlist,
    addToWishlistLoading,
    isProductInWishlist,
    removeFromWishlist,
    removeFromWishlistLoading,
  } = useWishlist();

  // Initialize quantity from cart if product is already in cart
  useEffect(() => {
    const cartQuantity = getCartItemQuantity(product.id);
    if (cartQuantity > 0) {
      setQty(cartQuantity);
    }
  }, [product.id, getCartItemQuantity]);

  // Auto-select default size or first size
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      if (product.default_size) {
        setSelectedSize(product.default_size);
      } else {
        const defaultSize = product.sizes.find((s) => s.is_default);
        setSelectedSize(defaultSize || product.sizes[0]);
      }
    }
  }, [product]);

  const handleSizeClick = (size: ProductSize) => {
    setSelectedSize(size);
    onSizeChange?.(size);
  };

  // Derive effective product values based on selected size
  const hasSizes = product?.sizes && product.sizes.length > 0;
  const effectivePrice = selectedSize ? selectedSize.price : product.price;
  const effectiveSalePrice = selectedSize
    ? selectedSize.sale_price
    : product.sale_price;
  const effectiveStock = selectedSize ? selectedSize.stock : product.stock;
  const effectiveSku = selectedSize ? selectedSize.sku : product.sku;
  const effectiveStockStatus = selectedSize
    ? selectedSize.stock > 0
      ? "in_stock"
      : "out_of_stock"
    : product.stock_status;

  // Check if product has offers
  const hasOffers =
    product?.product_offers && product.product_offers.length > 0;
  const activeOffer = hasOffers ? product.product_offers[0] : null;

  // Countdown timer for offers
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!activeOffer) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(activeOffer.valid_to).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: qty,
      ...(selectedSize ? { sizeId: selectedSize.id } : {}),
    });
  };

  // Handle Pay Now / Buy Now: add to cart then go to checkout
  const [payNowLoading, setPayNowLoading] = useState(false);
  const handlePayNow = async () => {
    setPayNowLoading(true);
    try {
      await addToCartAsync({
        productId: product.id,
        quantity: qty,
        ...(selectedSize ? { sizeId: selectedSize.id } : {}),
      });
      router.push(localeHref("/checkout", language));
    } catch {
      // Toast already shown by useCart
    } finally {
      setPayNowLoading(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      // TikTok AddToWishlist — only on add. useWishlist only has the id, so we
      // fire here where the full product is in scope.
      trackAddToWishlist({
        content_id: String(product.id),
        content_name: product.name,
        price: Number(getCurrentPrice()) || 0,
      });
      addToWishlist(product.id);
    }
  };

  // Get current price (sale price if available, otherwise regular price)
  const getCurrentPrice = () => {
    if (effectiveSalePrice && Number(effectiveSalePrice) > 0) {
      return effectiveSalePrice;
    }
    return effectivePrice;
  };

  // Calculate savings
  const getSavings = () => {
    if (effectiveSalePrice && Number(effectiveSalePrice) > 0) {
      return Number(effectivePrice) - Number(effectiveSalePrice);
    }
    return 0;
  };

  return (
    <section className="space-y-6 pt-0  ">
      <div className="info space-y-4 hidden md:block">
        {activeOffer && (
          <p className="text-lg md:text-2xl text-muted-foreground font-bold capitalize">
            {tShop("ends_in")}{" "}
            <span className="text-red-500">
              {String(timeLeft.hours).padStart(2, "0")}
              {tShop("h")} {String(timeLeft.minutes).padStart(2, "0")}
              {tShop("m")} {String(timeLeft.seconds).padStart(2, "0")}
              {tShop("s")}
            </span>{" "}
            — {tShop("dont_miss_out")}
          </p>
        )}

        <div className="category">
          <p className="text-xl capitalize font-semibold text-muted-foreground">
            {product?.category?.name}
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="title flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-bold uppercase">{product?.name}</h1>

            {activeOffer && (
              <div className="new">
                <p
                  className={`text-sm ${
                    activeOffer ? "bg-black" : "bg-yellow-600"
                  } text-white px-4 py-1 rounded-sm`}
                >
                  🔥Flash Sale
                </p>
              </div>
            )}
          </div>

          <div className="actions flex items-center gap-4">
            <div className="wishlist">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={handleWishlistToggle}
                disabled={addToWishlistLoading || removeFromWishlistLoading}
              >
                {addToWishlistLoading || removeFromWishlistLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <HeartIcon
                    className={`w-6 h-6 ${
                      isProductInWishlist(product.id)
                        ? "fill-primary text-primary"
                        : ""
                    }`}
                  />
                )}
              </Button>
            </div>

            <div className="share">
              <SocialShare product={product} />
            </div>
          </div>
        </div>
      </div>

      {hasSizes && (
        <div className="mb-3">
          <ul className="flex items-center gap-3 flex-wrap">
            {product.sizes!.map((size) => (
              <li key={size.id}>
                <Button
                  variant="outline"
                  className={`rounded-full border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white px-4 py-1 h-auto ${
                    selectedSize?.id === size.id ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-price mb-3 flex items-center flex-nowrap gap-2 sm:gap-3">
        <p className="text-2xl font-[800] whitespace-nowrap">
          {getCurrentPrice()} {tShop("egp")}
        </p>

        {effectiveSalePrice && Number(effectiveSalePrice) > 0 && (
          <p className="text-xl font-normal text-primary line-through whitespace-nowrap">
            {effectivePrice} {tShop("egp")}
          </p>
        )}

        {getSavings() > 0 && (
          <p className="text-sm sm:text-xl font-normal text-red-500 whitespace-nowrap">
            {tShop("save")} {getSavings()} {tShop("egp")}
          </p>
        )}
      </div>

      <div className="description">
        <p
          className="text-md font-normal"
          dangerouslySetInnerHTML={{ __html: product?.short_description || "" }}
        />
      </div>

      <ExtraSections sections={product.extra_sections} />

      <div className="payment-option">
        <div className="flex items-center gap-2 border border-primary rounded-md p-2 px-5 text-primary text-md font-semibold capitalize">
          <p>{tShop("pay_in_installments_with_no_hidden_fees")}</p>
        </div>

        <PaymentMethodLogos methods={paymentMethods} />
      </div>

      {effectiveStockStatus === "in_stock" && (
        <div className="add-buy-qty">
          <div className="actions flex items-center gap-2 flex-wrap justify-center lg:flex-nowrap">
            <div className="qty flex items-center gap-2 border border-border justify-between rounded-2xl overflow-hidden w-full lg:w-[450px] bg-background">
              <button
                onClick={() => {
                  const newQty = Math.max(1, qty - 1);
                  setQty(newQty);
                  updateCartItem({ itemId: product.id, quantity: newQty });
                }}
                className="cursor-pointer p-4 border-r border-border hover:bg-accent"
                disabled={qty <= 1 || updateCartItemLoading}
              >
                {updateCartItemLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MinusIcon className="w-4 h-4" />
                )}
              </button>
              <span className="text-md font-semibold px-2">{qty}</span>
              <button
                onClick={() => {
                  const newQty = qty + 1;
                  setQty(newQty);
                  updateCartItem({ itemId: product.id, quantity: newQty });
                }}
                className="cursor-pointer p-4 border-l border-border hover:bg-accent"
                disabled={updateCartItemLoading}
              >
                {updateCartItemLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="add-to-cart w-full">
              <Button
                size="lg"
                className="bg-black text-white rounded-sm transition-all duration-300 capitalize h-12 w-full"
                onClick={handleAddToCart}
                disabled={addToCartLoading}
              >
                {addToCartLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {tShop("adding_to_cart")}
                  </>
                ) : (
                  <>
                    {isProductInCart(product.id)
                      ? tShop("added_to_cart")
                      : tShop("add_to_cart")}
                  </>
                )}
              </Button>
            </div>
            <div className="buy w-full">
              <Button
                size="lg"
                className="bg-primary text-white rounded-sm transition-all duration-300 capitalize h-12 w-full"
                onClick={handlePayNow}
                disabled={addToCartLoading || payNowLoading}
              >
                {payNowLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {tShop("adding_to_cart")}
                  </>
                ) : (
                  tShop("buy_now")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="divider my-5">
        <div className="line w-full h-[2px] bg-gray-600"></div>
      </div>
      {/* 
      <div className="shipping">
        <ul className="flex flex-wrap gap-8 gap-y-6">
          <li className="flex items-center gap-2">
            <div className="icon">
              <Image
                src="/product-page/icons/box.svg"
                alt="shipping"
                width={20}
                height={20}
              />
            </div>
            <div className="content">
              <p className="text-sm text-foreground">
                {tShop("free_shipping_for_orders_over_1500egp")}
              </p>
            </div>
          </li>
          <li className="flex items-center gap-2">
            <div className="icon">
              <Image
                src="/product-page/icons/gift.svg"
                alt="shipping"
                width={20}
                height={20}
              />
            </div>
            <div className="content">
              <p className="text-sm text-foreground">
                {tShop("buy_2_products_get_1_free")}
              </p>
            </div>
          </li>

          <li className="flex items-center gap-2">
            <div className="icon">
              <Image
                src="/product-page/icons/percent.svg"
                alt="shipping"
                width={20}
                height={20}
              />
            </div>
            <div className="content">
              <p className="text-sm text-foreground">
                {tShop("save_200egp_for_orders_over_1000egp")}
              </p>
            </div>
          </li>
        </ul>
      </div> */}

      {/* <div className="divider my-5">
        <div className="line w-full h-[2px] bg-gray-600"></div>
      </div> */}

      <div className="delivery">
        <div className="flex items-center gap-2">
          <div className="icon">
            <Image
              src="/product-page/icons/delivery.svg"
              alt="shipping"
              width={20}
              height={20}
            />
          </div>
          <div className="content">
            <p className="text-sm text-foreground">
              {tShop("delivers_in")} : {tShop("3_7_working_days")} |{" "}
              <Link href="/" className="text-primary underline">
                {tShop("shipping_and_return")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar for mobile/tablet */}
      <FixedBottomBar
        qty={qty}
        onIncrement={() => {
          const newQty = qty + 1;
          setQty(newQty);
          updateCartItem({ itemId: product.id, quantity: newQty });
        }}
        onDecrement={() => {
          const newQty = Math.max(1, qty - 1);
          setQty(newQty);
          updateCartItem({ itemId: product.id, quantity: newQty });
        }}
        onAddToCart={handleAddToCart}
        isInCart={isProductInCart(product.id)}
        isLoading={addToCartLoading}
        isUpdating={updateCartItemLoading}
        isInStock={effectiveStockStatus === "in_stock"}
      />
    </section>
  );
}

export default ProductDetails;

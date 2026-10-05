"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";

interface FixedBottomBarProps {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  isInCart: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  isInStock: boolean;
}

export function FixedBottomBar({
  qty,
  onIncrement,
  onDecrement,
  onAddToCart,
  isInCart,
  isLoading,
  isUpdating,
  isInStock,
}: FixedBottomBarProps) {
  const { t: tShop } = useTranslation("shop");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the bar after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isInStock) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg lg:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 p-4 max-w-7xl mx-auto">
        {/* Quantity controls */}
        <div className="flex items-center gap-2 border border-border rounded-full overflow-hidden bg-background">
          <button
            onClick={onDecrement}
            className="cursor-pointer p-3 hover:bg-accent transition-colors"
            disabled={qty <= 1 || isUpdating}
            aria-label="Decrease quantity"
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MinusIcon className="w-5 h-5" />
            )}
          </button>
          <span className="text-lg font-bold px-3 min-w-[40px] text-center">
            {qty}
          </span>
          <button
            onClick={onIncrement}
            className="cursor-pointer p-3 hover:bg-accent transition-colors"
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Add to cart button */}
        <Button
          size="lg"
          className="flex-1 bg-primary text-white rounded-full transition-all duration-300 capitalize h-12 font-bold text-base"
          onClick={onAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {tShop("adding_to_cart")}
            </>
          ) : (
            <>{isInCart ? tShop("added_to_cart") : tShop("add_to_cart")}</>
          )}
        </Button>
      </div>
    </div>
  );
}

import { useRouter } from "next/navigation";
import { useBuyNowStore, type BuyNowProduct } from "@/store/buyNow";
import { useLanguage } from "@/contexts/LanguageContext";
import { localeHref } from "@/lib/locale";

export const useBuyNow = () => {
  const buyNowProduct = useBuyNowStore((s) => s.product);
  const setBuyNowProduct = useBuyNowStore((s) => s.setProduct);
  const router = useRouter();
  const { language } = useLanguage();

  const handleBuyNow = (product: BuyNowProduct) => {
    setBuyNowProduct(product);
    router.push(localeHref("/checkout", language));
  };

  const clearBuyNowProduct = () => {
    setBuyNowProduct(null);
  };

  return {
    buyNowProduct,
    handleBuyNow,
    clearBuyNowProduct,
  };
};

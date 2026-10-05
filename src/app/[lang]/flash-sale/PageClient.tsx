"use client";
import UnifiedProductsPage from "@/components/Products/UnifiedProductsPage/UnifiedProductsPage";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

export default function FlashSalePage() {
  const { t } = useTranslation("shop");

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <UnifiedProductsPage
        mode="flash-sale"
        title={t("flash_sale")}
        showCountdown={true}
      />
    </Suspense>
  );
}

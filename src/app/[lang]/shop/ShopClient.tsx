"use client";
import UnifiedProductsPage from "@/components/Products/UnifiedProductsPage/UnifiedProductsPage";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

export default function ShopClient() {
  const { t } = useTranslation("shop");

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <UnifiedProductsPage
        mode="products"
        title={t("all_products")}
        showCountdown={false}
      />
    </Suspense>
  );
}

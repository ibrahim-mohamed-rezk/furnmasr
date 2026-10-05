import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { Product } from "@/lib/api";

interface AdditionalInfoProps {
  product: Product;
}

function AdditionalInfo({ product }: AdditionalInfoProps) {
  const { t } = useTranslation("shop");

  return (
    <section className="space-y-4 flex flex-wrap flex-col gap-4 bg-muted p-6 rounded-lg">
      <div className="product-details space-y-2">
        <h2 className="text-lg font-bold">{t("product_details")} : </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="detail-item">
            <span className="font-semibold text-foreground">{t("sku")} : </span>
            <span className="ml-2 text-foreground">{product.sku}</span>
          </div>
          <div className="detail-item">
            <span className="font-semibold text-foreground">
              {t("stock_status")} :
            </span>
            <span
              className={`ml-2 capitalize ${
                product.stock_status === "in_stock"
                  ? "text-[#01750E]"
                  : "text-[#FF0000]"
              }`}
            >
              {product.stock_status === "in_stock"
                ? t("in_stock")
                : t("out_of_stock")}
            </span>
          </div>
          {product.manage_stock && (
            <div className="detail-item">
              <span className="font-semibold text-foreground">
                {t("stock_quantity")} :
              </span>
              <span className="ml-2 text-foreground">{product.stock}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="font-semibold text-foreground">
              {t("featured")} :
            </span>
            <span className="ml-2 text-foreground">
              {product.featured ? t("yes") : t("no")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start justify-start">
        <div className="category flex items-center gap-2">
          <h2 className="text-lg font-bold">{t("category")} : </h2>
          <p className="text-base font-semibold text-primary">
            {product.category?.name || t("uncategorized")}
          </p>
        </div>

        {product.weight !== null &&
          product.weight !== "0.00" &&
          product.weight !== "" &&
          product.weight !== "0" &&
          product.weight !== undefined && (
            <div className="weight mt-2 flex items-center gap-2">
              <h2 className="text-lg font-bold">{t("weight")} : </h2>
              <p className="text-base tracking-wide text-foreground">
                {product.weight} kg
              </p>
            </div>
          )}
      </div>

      <div className="flex flex-col gap-2 items-start justify-start">
        {product.dimensions && product.dimensions.length > 0 && (
          <div className="dimensions space-y-2">
            <h2 className="text-lg font-bold">{t("dimensions")} : </h2>
            <div className="text-base tracking-wide text-foreground">
              {product.dimensions.map((dimension, index) => (
                <p key={index} className="mb-1">
                  {dimension}
                </p>
              ))}
            </div>
          </div>
        )}

        {product.attributes && product.attributes.length > 0 && (
          <div className="attributes space-y-2">
            <h2 className="text-lg font-bold">{t("attributes")} : </h2>
            <div className="text-base tracking-wide text-foreground">
              {product.attributes.map((attribute, index) => (
                <p key={index} className="mb-1">
                  {attribute}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {!product.weight &&
        !product.dimensions &&
        product.attributes.length === 0 && (
          <div className="no-additional-info text-center py-4">
            <p className="text-muted-foreground text-base">
              {t("no_additional_information_available")}
            </p>
          </div>
        )}
    </section>
  );
}

export default AdditionalInfo;

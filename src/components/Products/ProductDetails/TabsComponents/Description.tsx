import React from "react";
import { Product } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";

interface DescriptionProps {
  product: Product;
}

function Description({ product }: DescriptionProps) {
  const { t } = useTranslation("shop");

  return (
    <section className="space-y-6 bg-muted p-5 sm:p-10 rounded-lg">
      <div className="description-header">
        <h2 className="text-xl sm:text-2xl font-bold">{product.name}</h2>
      </div>

      {/* {product.short_description && (
        <div className="short-description">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {t("short_description")}
          </h3>
          <p className="text-lg tracking-wide text-foreground leading-relaxed">
            {product.short_description}
          </p>
        </div>
      )} */}

      {product.description && (
        <div className="description-content">
          {/* <h3 className="text-lg font-semibold text-foreground mb-3">
            {t("full_description")}
          </h3> */}
          <div
            className="text-lg tracking-wide text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {!product.description && !product.short_description && (
        <div className="no-description text-center py-8">
          <p className="text-muted-foreground text-lg">
            {t("no_description_available")}
          </p>
        </div>
      )}
    </section>
  );
}

export default Description;

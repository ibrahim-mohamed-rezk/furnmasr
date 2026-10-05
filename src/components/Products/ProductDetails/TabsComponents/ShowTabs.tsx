"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import RatingandReviews from "./Reviews/Rating-and-Reviews";
import AdditionalInfo from "./Additional-Info";
import Description from "./Description";
import { useTranslation } from "@/hooks/useTranslation";
import { Product } from "@/lib/api";

interface ShowTabsProps {
  product: Product;
}

function ShowTabs({ product }: ShowTabsProps) {
  const [activeTab, setActiveTab] = useState("rating-and-reviews");
  const { t } = useTranslation("shop");

  return (
    <section className="py-8 md:py-16 px-4 sm:px-6">
      <ul className="flex items-center justify-center lg:justify-between gap-3 sm:gap-4 flex-wrap pb-6 md:pb-10 lg:pb-0">
        <li>
          <Button
            onClick={() => setActiveTab("rating-and-reviews")}
            className={`text-xs sm:text-sm md:text-lg lg:text-2xl font-[800] uppercase bg-transparent p-0 border-b-2 border-gray-500 hover:bg-transparent hover:text-primary rounded-none shadow-none transition-all duration-300 ${
              activeTab === "rating-and-reviews"
                ? "border-b-2 border-primary text-primary"
                : "border-transparent text-foreground"
            }`}
          >
            {t("rating_and_reviews")}
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setActiveTab("description")}
            className={`text-xs sm:text-sm md:text-lg lg:text-2xl font-[800] uppercase bg-transparent p-0 border-b-2 border-gray-500 hover:bg-transparent hover:text-primary rounded-none shadow-none transition-all duration-300 ${
              activeTab === "description"
                ? "border-b-2 border-primary text-primary"
                : "border-transparent text-foreground"
            }`}
          >
            {t("description")}
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setActiveTab("additional-information")}
            className={`text-xs sm:text-sm md:text-lg lg:text-2xl font-[800] uppercase bg-transparent p-0 border-b-2 border-gray-500 hover:bg-transparent hover:text-primary rounded-none shadow-none transition-all duration-300 ${
              activeTab === "additional-information"
                ? "border-b-2 border-primary text-primary"
                : "border-transparent text-foreground"
            }`}
          >
            {t("additional_information")}
          </Button>
        </li>
      </ul>

      <div className="divider w-full lg:w-[1px] h-[1px] lg:h-[300px] bg-gray-300 block lg:hidden"></div>

      <div className="show-tabs py-6 md:py-16 px-0 md:p-16">
        {activeTab === "rating-and-reviews" ? (
          <RatingandReviews product={product} />
        ) : activeTab === "description" ? (
          <Description product={product} />
        ) : activeTab === "additional-information" ? (
          <AdditionalInfo product={product} />
        ) : null}
      </div>
    </section>
  );
}

export default ShowTabs;

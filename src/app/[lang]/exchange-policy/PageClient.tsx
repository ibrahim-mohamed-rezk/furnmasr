"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function ExchangePolicyContent() {
  const { t } = useTranslation("exchange_policy");
  const { t: tContact } = useTranslation("contact");

  return (
    <section className="relative">
      <FloatedShapes height="800px" />

      <div className="head pt-20">
        <h3 className="text-3xl font-[800] font-title max-w-7xl mx-auto px-6">
          {t("title")}
        </h3>
      </div>

      <div className="content max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12">
        <div className="intro">
          <p className="text-muted-foreground text-lg md:text-xl font-medium">
            {t("intro")}
          </p>
        </div>

        {/* First Section: Exchange Conditions */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("first_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("first_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("condition_1")}</li>
            <li>{t("condition_2")}</li>
            <li>{t("condition_3")}</li>
          </ul>

          <p className="text-foreground text-lg font-bold mt-4">
            {t("condition_sub_intro")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("condition_sub_1")}</li>
            <li>{t("condition_sub_2")}</li>
            <li>{t("condition_sub_3")}</li>
          </ul>
        </div>

        {/* Second Section: Non-Exchangeable Products */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("second_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("second_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("non_returnable_1")}</li>
            <li>{t("non_returnable_2")}</li>
            <li>{t("non_returnable_3")}</li>
            <li>{t("non_returnable_4")}</li>
          </ul>
        </div>

        {/* Third Section: Exchange Request Steps */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("third_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("steps_1")}</li>
            <li>{t("steps_2")}</li>
            <li>{t("steps_3")}</li>
          </ul>
        </div>

        {/* Fourth Section: Shipping and Exchange */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fourth_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("shipping_1")}</li>
            <li>{t("shipping_2")}</li>
            <li>{t("shipping_3")}</li>
          </ul>
        </div>

        {/* Fifth Section: Timeframe */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fifth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("duration_intro")}</p>
        </div>

        {/* Sixth Section: Contact Us */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("sixth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("contact_intro")}</p>
        </div>
      </div>

      <ReachUs
        title={tContact("title")}
        description={t(
          "intro"
        )}
        t={tContact}
      />
    </section>
  );
}

export default function ExchangePolicyPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <ExchangePolicyContent />
    </Suspense>
  );
}

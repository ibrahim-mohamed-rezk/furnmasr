"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function ShippingPolicyContent() {
  const { t } = useTranslation("shipping_policy");
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

        {/* First Section: Processing Time */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("first_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("processing_time_1")}</li>
            <li>{t("processing_time_2")}</li>
          </ul>
        </div>

        {/* Second Section: Shipping Time */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("second_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("shipping_time_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("shipping_time_1")}</li>
            <li>{t("shipping_time_2")}</li>
          </ul>
        </div>

        {/* Third Section: Shipping Cost */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("third_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("shipping_cost_1")}</li>
            <li>{t("shipping_cost_2")}</li>
          </ul>
        </div>

        {/* Fourth Section: Tracking */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fourth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("tracking_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("tracking_1")}</li>
            <li>{t("tracking_2")}</li>
            <li>{t("tracking_3")}</li>
          </ul>
          <p className="text-foreground text-lg">{t("tracking_outro")}</p>
        </div>

        {/* Fifth Section: Receiving */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fifth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("receiving_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("receiving_1")}</li>
            <li>{t("receiving_2")}</li>
          </ul>
          <p className="text-foreground text-lg font-bold mt-4">
            {t("receiving_note")}
          </p>
        </div>

        {/* Sixth Section: Address */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("sixth_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("address_1")}</li>
            <li>{t("address_2")}</li>
          </ul>
        </div>

        {/* Seventh Section: Delays */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("seventh_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("delays_intro")}</p>
        </div>

        {/* Eighth Section: Contact Us */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("eighth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("contact_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("contact_whatsapp")}</li>
            <li>{t("contact_email")}</li>
            <li>{t("contact_page")}</li>
          </ul>
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

export default function ShippingPolicyPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <ShippingPolicyContent />
    </Suspense>
  );
}

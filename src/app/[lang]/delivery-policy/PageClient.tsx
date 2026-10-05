"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function DeliveryPolicyContent() {
  const { t } = useTranslation("delivery_policy");
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

        {/* First Section: Delivery Scope */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("first_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("delivery_scope_1")}</li>
            <li>{t("delivery_scope_2")}</li>
          </ul>
        </div>

        {/* Second Section: Delivery Time */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("second_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("delivery_time_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("delivery_time_1")}</li>
            <li>{t("delivery_time_2")}</li>
          </ul>
        </div>

        {/* Third Section: Delivery Attempts */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("third_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("delivery_attempts_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("delivery_attempts_1")}</li>
            <li>{t("delivery_attempts_2")}</li>
          </ul>
        </div>

        {/* Fourth Section: Inspection */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fourth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("inspection_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("inspection_1")}</li>
            <li>{t("inspection_2")}</li>
          </ul>
          <p className="text-foreground text-lg font-bold mt-4">
            {t("inspection_note")}
          </p>
        </div>

        {/* Fifth Section: Delays */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fifth_section_title")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("delays_1")}</li>
            <li>{t("delays_2")}</li>
          </ul>
        </div>

        {/* Sixth Section: Change Address */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("sixth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("change_address_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("change_address_1")}</li>
            <li>{t("change_address_2")}</li>
            <li>{t("change_address_3")}</li>
          </ul>
        </div>

        {/* Seventh Section: Damaged Products */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("seventh_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("damaged_products_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("damaged_products_1")}</li>
            <li>{t("damaged_products_2")}</li>
          </ul>
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

export default function DeliveryPolicyPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <DeliveryPolicyContent />
    </Suspense>
  );
}

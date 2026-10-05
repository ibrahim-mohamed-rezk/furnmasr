"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function RefundPolicyContent() {
  const { t } = useTranslation("refund_policy");
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

        {/* First Section: Return Conditions */}
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
            {t("exceptions_title")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("exception_1")}</li>
            <li>{t("exception_2")}</li>
            <li>{t("exception_3")}</li>
          </ul>
        </div>

        {/* Second Section: How to Submit */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("second_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("second_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("contact_whatsapp")}</li>
            <li>{t("contact_email")}</li>
            <li>{t("contact_page")}</li>
          </ul>
          <p className="text-foreground text-lg">{t("contact_instruction")}</p>
          <p className="text-foreground text-lg">{t("contact_response_time")}</p>
        </div>

        {/* Third Section: Refund Method */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("third_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("third_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("refund_method")}</li>
            <li>{t("refund_duration")}</li>
            <li>{t("refund_shipping_cost")}</li>
          </ul>
        </div>

        {/* Fourth Section: Product Exchange */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fourth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("fourth_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("exchange_step_1")}</li>
            <li>{t("exchange_step_2")}</li>
          </ul>
        </div>
      </div>

      <ReachUs
        title={tContact("reach_us")}
        description={tContact(
          "if_you_have_any_questions_about_this_refunds_and_exchanges_policy_please_contact_us_at_one_of_our_contact_details"
        )}
        t={tContact}
      />
    </section>
  );
}

export default function RefundPolicyPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <RefundPolicyContent />
    </Suspense>
  );
}

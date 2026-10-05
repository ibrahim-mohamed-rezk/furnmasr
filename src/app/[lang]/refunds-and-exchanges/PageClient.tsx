"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function RefundsAndExchangesContent() {
  const { t } = useTranslation("refunds_and_exchanges");
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

        {/* REFUND POLICY SECTIONS */}
        <div className="policy-section space-y-8">
          <h3 className="text-2xl md:text-3xl font-[800] font-title text-foreground border-b-2 border-border pb-3">
            {t("refund_section_title")}
          </h3>

          {/* Return Conditions */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("refund_conditions_title")}
            </h4>
            <p className="text-foreground text-lg">{t("refund_conditions_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("refund_condition_1")}</li>
              <li>{t("refund_condition_2")}</li>
              <li>{t("refund_condition_3")}</li>
            </ul>

            <p className="text-foreground text-lg font-bold mt-4">
              {t("refund_exceptions_title")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("refund_exception_1")}</li>
              <li>{t("refund_exception_2")}</li>
              <li>{t("refund_exception_3")}</li>
            </ul>
          </div>

          {/* How to Submit Return Request */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("refund_submit_title")}
            </h4>
            <p className="text-foreground text-lg">{t("refund_submit_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("refund_contact_whatsapp")}</li>
              <li>{t("refund_contact_email")}</li>
              <li>{t("refund_contact_page")}</li>
            </ul>
            <p className="text-foreground text-lg">{t("refund_contact_instruction")}</p>
            <p className="text-foreground text-lg">{t("refund_contact_response_time")}</p>
          </div>

          {/* Refund Method */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("refund_method_title")}
            </h4>
            <p className="text-foreground text-lg">{t("refund_method_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("refund_method_detail")}</li>
              <li>{t("refund_duration")}</li>
              <li>{t("refund_shipping_cost")}</li>
            </ul>
          </div>
        </div>

        {/* EXCHANGE POLICY SECTIONS */}
        <div className="policy-section space-y-8">
          <h3 className="text-2xl md:text-3xl font-[800] font-title text-foreground border-b-2 border-border pb-3">
            {t("exchange_section_title")}
          </h3>

          {/* Exchange Conditions */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("exchange_conditions_title")}
            </h4>
            <p className="text-foreground text-lg">{t("exchange_conditions_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("exchange_condition_1")}</li>
              <li>{t("exchange_condition_2")}</li>
              <li>{t("exchange_condition_3")}</li>
            </ul>

            <p className="text-foreground text-lg font-bold mt-4">
              {t("exchange_condition_sub_intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("exchange_condition_sub_1")}</li>
              <li>{t("exchange_condition_sub_2")}</li>
              <li>{t("exchange_condition_sub_3")}</li>
            </ul>
          </div>

          {/* Non-Exchangeable Products */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("exchange_non_returnable_title")}
            </h4>
            <p className="text-foreground text-lg">{t("exchange_non_returnable_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("exchange_non_returnable_1")}</li>
              <li>{t("exchange_non_returnable_2")}</li>
              <li>{t("exchange_non_returnable_3")}</li>
              <li>{t("exchange_non_returnable_4")}</li>
            </ul>
          </div>

          {/* Exchange Request Steps */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("exchange_steps_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("exchange_step_1")}</li>
              <li>{t("exchange_step_2")}</li>
              <li>{t("exchange_step_3")}</li>
            </ul>
          </div>

          {/* Shipping and Exchange */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("exchange_shipping_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("exchange_shipping_1")}</li>
              <li>{t("exchange_shipping_2")}</li>
              <li>{t("exchange_shipping_3")}</li>
            </ul>
          </div>

          {/* Timeframe */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("exchange_timeframe_title")}
            </h4>
            <p className="text-foreground text-lg">{t("exchange_duration_intro")}</p>
          </div>
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

export default function RefundsAndExchangesPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <RefundsAndExchangesContent />
    </Suspense>
  );
}

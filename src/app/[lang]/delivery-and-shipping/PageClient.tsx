"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function DeliveryAndShippingContent() {
  const { t } = useTranslation("delivery_and_shipping");
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

        {/* SHIPPING POLICY SECTIONS */}
        <div className="policy-section space-y-8">
          <h3 className="text-2xl md:text-3xl font-[800] font-title text-foreground border-b-2 border-border pb-3">
            {t("shipping_section_title")}
          </h3>

          {/* Order Processing Time */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_processing_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("shipping_processing_1")}</li>
              <li>{t("shipping_processing_2")}</li>
            </ul>
          </div>

          {/* Shipping Time */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_time_title")}
            </h4>
            <p className="text-foreground text-lg">{t("shipping_time_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("shipping_time_1")}</li>
              <li>{t("shipping_time_2")}</li>
            </ul>
          </div>

          {/* Shipping Cost */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_cost_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("shipping_cost_1")}</li>
              <li>{t("shipping_cost_2")}</li>
            </ul>
          </div>

          {/* Order Tracking */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_tracking_title")}
            </h4>
            <p className="text-foreground text-lg">{t("shipping_tracking_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("shipping_tracking_1")}</li>
              <li>{t("shipping_tracking_2")}</li>
              <li>{t("shipping_tracking_3")}</li>
            </ul>
            <p className="text-foreground text-lg">{t("shipping_tracking_outro")}</p>
          </div>

          {/* Shipping Address */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_address_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("shipping_address_1")}</li>
              <li>{t("shipping_address_2")}</li>
            </ul>
          </div>

          {/* Shipping Delays */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("shipping_delays_title")}
            </h4>
            <p className="text-foreground text-lg">{t("shipping_delays_intro")}</p>
          </div>
        </div>

        {/* DELIVERY POLICY SECTIONS */}
        <div className="policy-section space-y-8">
          <h3 className="text-2xl md:text-3xl font-[800] font-title text-foreground border-b-2 border-border pb-3">
            {t("delivery_section_title")}
          </h3>

          {/* Delivery Scope */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_scope_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_scope_1")}</li>
              <li>{t("delivery_scope_2")}</li>
            </ul>
          </div>

          {/* Delivery Time */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_time_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_time_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_time_1")}</li>
              <li>{t("delivery_time_2")}</li>
            </ul>
          </div>

          {/* Delivery Attempts */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_attempts_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_attempts_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_attempts_1")}</li>
              <li>{t("delivery_attempts_2")}</li>
            </ul>
          </div>

          {/* Receiving the Order */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_receiving_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_receiving_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_receiving_1")}</li>
              <li>{t("delivery_receiving_2")}</li>
            </ul>
            <p className="text-foreground text-lg font-bold mt-4">
              {t("delivery_receiving_note")}
            </p>
          </div>

          {/* Inspecting Order upon Receipt */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_inspection_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_inspection_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_inspection_1")}</li>
              <li>{t("delivery_inspection_2")}</li>
            </ul>
            <p className="text-foreground text-lg font-bold mt-4">
              {t("delivery_inspection_note")}
            </p>
          </div>

          {/* Delivery Delays or Issues */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_delays_title")}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_delays_1")}</li>
              <li>{t("delivery_delays_2")}</li>
            </ul>
          </div>

          {/* Changing Delivery Address */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_change_address_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_change_address_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_change_address_1")}</li>
              <li>{t("delivery_change_address_2")}</li>
              <li>{t("delivery_change_address_3")}</li>
            </ul>
          </div>

          {/* Receiving Damaged Products */}
          <div className="section space-y-4">
            <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
              {t("delivery_damaged_title")}
            </h4>
            <p className="text-foreground text-lg">{t("delivery_damaged_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t("delivery_damaged_1")}</li>
              <li>{t("delivery_damaged_2")}</li>
            </ul>
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

export default function DeliveryAndShippingPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <DeliveryAndShippingContent />
    </Suspense>
  );
}

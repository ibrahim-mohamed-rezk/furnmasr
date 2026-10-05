"use client";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React, { useState, Suspense } from "react";
import Tabs from "./components/Tabs";
import Account from "./components/Account/Account";
import OrderTracking from "./components/Orders/ShowPage";
import Adresses from "./components/Addresses/Adresses";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

function AccountContent() {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  const tabs = [
    {
      label: t("account.account"),
      value: "account",
      title: t("account.title"),
    },
    {
      label: t("account.order_tracking"),
      value: "order-tracking",
      title: t("account.order_tracking"),
    },
    {
      label: t("account.addresses"),
      value: "adresses",
      title: t("account.addresses"),
    },
  ];

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "account";
  const orderId = searchParams.get("orderId");

  return (
    <section className="relative">
      <FloatedShapes height="800px" />
      <div className="head py-10 border-b border-black flex justify-center items-center">
        <h3 className="text-xl md:text-2xl font-[800] max-w-5xl mx-auto px-6 uppercase flex items-center flex-wrap justify-center ">
          <Link
            href="/"
            className={`hover:text-primary transition-all duration-300 text-sm md:text-md ${
              direction === "ltr" ? "lg:text-xl" : "lg:text-2xl"
            }`}
          >
            {t("common.home")}
          </Link>
          <span className="mx-2">
            {direction === "ltr" ? (
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </span>
          <span
            className={`cursor-default text-sm md:text-md ${
              direction === "ltr" ? "lg:text-xl" : "lg:text-2xl"
            }`}
          >
            {tabs.find((tab) => tab.value === activeTab)?.title}
          </span>

          {orderId && (
            <>
              <span className="mx-2">
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </span>
              <span className="cursor-default text-sm md:text-md">
                {t("account.order_details")}
              </span>
            </>
          )}
        </h3>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-start gap-10 relative">
        <div className="tabs w-full md:w-[30%]  md:sticky md:top-24 border-b border-border pb-10 md:border-0">
          <Tabs tabs={tabs} activeTab={activeTab} />
        </div>

        <div className="content w-full md:w-[70%]">
          {activeTab === "account" && <Account />}
          {activeTab === "order-tracking" && <OrderTracking />}
          {activeTab === "adresses" && <Adresses />}
        </div>
      </div>
    </section>
  );
}

function Page() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <AccountContent />
    </Suspense>
  );
}

export default Page;

"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function DataDeletionContent() {
  const { t } = useTranslation("data_deletion");
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

        {/* Instructions Section */}
        <div className="section space-y-4">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("step_1")}</li>
            <li>{t("step_2")}</li>
            <li>{t("step_3")}</li>
            <li>{t("step_4")}</li>
          </ul>
          <p className="text-foreground text-lg mt-4">{t("outro")}</p>
        </div>
      </div>

      <ReachUs
        title={tContact("title")}
        description={tContact("description")}
        t={tContact}
      />
    </section>
  );
}

export default function DataDeletionPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <DataDeletionContent />
    </Suspense>
  );
}

"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import { useTranslation } from "@/hooks/useTranslation";
import { Suspense } from "react";

function PrivacyContent() {
  const { t } = useTranslation("privacy_policy");
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

        {/* First Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("first_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("first_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("info_1")}</li>
            <li>{t("info_2")}</li>
            <li>{t("info_3")}</li>
            <li>{t("info_4")}</li>
          </ul>
        </div>

        {/* Second Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("second_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("second_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("usage_1")}</li>
            <li>{t("usage_2")}</li>
            <li>{t("usage_3")}</li>
            <li>{t("usage_4")}</li>
            <li>{t("usage_5")}</li>
          </ul>
        </div>

        {/* Third Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("third_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("third_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("sharing_1")}</li>
            <li>{t("sharing_2")}</li>
            <li>{t("sharing_3")}</li>
          </ul>
          <p className="text-foreground text-lg mt-4">{t("sharing_outro")}</p>
        </div>

        {/* Fourth Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fourth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("fourth_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("protection_1")}</li>
            <li>{t("protection_2")}</li>
            <li>{t("protection_3")}</li>
          </ul>
        </div>

        {/* Fifth Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("fifth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("fifth_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("cookies_1")}</li>
            <li>{t("cookies_2")}</li>
            <li>{t("cookies_3")}</li>
          </ul>
          <p className="text-foreground text-lg mt-4">{t("cookies_outro")}</p>
        </div>

        {/* Sixth Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("sixth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("sixth_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("rights_1")}</li>
            <li>{t("rights_2")}</li>
            <li>{t("rights_3")}</li>
          </ul>
        </div>

        {/* Seventh Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("seventh_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("seventh_section_intro")}</p>
        </div>

        {/* Eighth Section */}
        <div className="section space-y-4">
          <h4 className="text-xl md:text-2xl font-[800] font-title text-foreground">
            {t("eighth_section_title")}
          </h4>
          <p className="text-foreground text-lg">{t("eighth_section_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("contact_page")}</li>
            <li>{t("contact_email")}</li>
            <li>{t("contact_whatsapp")}</li>
          </ul>
        </div>
      </div>

      <ReachUs
        title={tContact("title")}
        description={tContact(
          "if_you_have_any_questions_about_this_privacy_policy_please_contact_us_at_one_of_our_contact_details"
        )}
        t={tContact}
      />
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <PrivacyContent />
    </Suspense>
  );
}

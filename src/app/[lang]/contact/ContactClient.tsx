"use client";
import ReachUs from "@/components/ReachUs/ReachUs";
import FloatedShapes from "@/components/Shared/FloatedTrees/FloatedShapes";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import ContactForm from "./ContactForm";
import { Suspense } from "react";

function ContactContent() {
  const { t } = useTranslation("contact");

  return (
    <section className="relative">
      <FloatedShapes height="800px" />

      <div className="head pt-20">
        <h1 className="text-3xl font-[800] font-title max-w-7xl mx-auto px-6">
          {t("title")}
        </h1>
      </div>

      <div className="content max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 px-6 py-10 md:py-16">
        <div className="form-data">
          <div className="head mb-8">
            <div className="title mb-4">
              <h2 className="text-xl md:text-2xl font-[800] font-title">
                {t("excited")}
              </h2>
            </div>

            <div className="desc">
              <p className="text-muted-foreground text-md">{t("description")}</p>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="map space-y-10">
          <div className="head space-y-4">
            <div className="title">
              <h2 className="text-xl md:text-2xl font-[800] font-title">
                {t("we_d_love_to_welcome_you_in_person")}
              </h2>
            </div>

            <div className="desc">
              <p className="text-muted-foreground text-md">
                {t(
                  "visit_our_space_and_explore_the_world_of_furnmasr_up_close_where_elegance_meets_authenticity"
                )}
              </p>
            </div>
          </div>

          <div className="map-img">
            <a
              href="https://maps.app.goo.gl/1mUgKzqGcJD6ExGJ6"
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src="/map.png"
                alt="map"
                width={500}
                height={500}
                className="w-full h-full"
              />
            </a>
          </div>
        </div>
      </div>

      <ReachUs
        title={t("reach_us")}
        description={t(
          "if_you_have_any_questions_about_this_privacy_policy_please_contact_us_at_one_of_our_contact_details"
        )}
        t={t}
      />
    </section>
  );
}

export default function ContactClient() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <ContactContent />
    </Suspense>
  );
}

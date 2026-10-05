"use client";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

function SpecialYear() {
  const { t } = useTranslation("home");
  const { direction } = useLanguage();
  return (
    <div className="relative hidden lg:block">
      <section className="w-full lg:max-w-5xl mx-auto py-20 px-6 relative overflow-hidden relative">
        <div className="head flex justify-center items-center mb-10 md:mb-20 max-w-lg mx-auto text-center  ">
          <h2 className="md:text-4xl text-2xl font-[700]">
            {t("what_makes_this_year_different")}
          </h2>
        </div>

        <div className="contant hidden lg:block">
          <div className=" gap-16 grid grid-cols-1 md:grid-cols-3 relative">
            <div
              className={`${
                direction === "ltr"
                  ? "card space-y-34 relative h-[510px] absolute top-0 left-0 lg:left-10"
                  : "card space-y-34 relative h-[520px] absolute bottom-[-65px] right-14"
              }`}
            >
              <div
                className={`top-card ${
                  direction === "ltr"
                    ? "bg-[url('/bg-1.png')]"
                    : "bg-[url('/bg-3.png')]"
                } bg-contain bg-center bg-no-repeat p-10 flex flex-col justify-center items-start w-[300px] h-[300px] absolute top-0 left-0`}
              >
                <div className="contant relative z-10">
                  <div className="title">
                    <Link href="/shop">
                      <h3 className="text-[15px] font-[700] text-zinc-900 dark:text-zinc-900 hover:text-primary transition-all duration-300">
                        {t("new_arrivals")}
                      </h3>
                    </Link>
                  </div>
                  <div className="desc">
                    <p className="font-normal text-sm text-zinc-600 dark:text-zinc-600">
                      {t("latest_trends_just_landed")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`bottom-card ${
                  direction === "ltr"
                    ? "bg-[url('/bg-2.png')]"
                    : "bg-[url('/bg-4.png')]"
                } bg-contain bg-center bg-no-repeat p-5 w-[300px] h-[300px] absolute bottom-0 left-0 flex flex-col justify-center items-start`}
              >
                <div className="contant relative z-10">
                  <div className="title">
                    <Link href="/shop">
                      <h3 className="text-[15px] font-[700] text-zinc-900 dark:text-zinc-900 hover:text-primary transition-all duration-300">
                        {t("flexible_payment_options")}
                      </h3>
                    </Link>
                  </div>
                  <div className="desc">
                    <p className="font-normal text-sm text-zinc-600 dark:text-zinc-600">
                      {t("pay_your_way_your_style")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <Image
                src="/placeholder-image.png"
                alt={t("special_year_image_alt")}
                width={2000}
                height={2000}
                loading="lazy"
                sizes="(max-width: 768px) 60vw, 33vw"
                className="w-fit h-full object-fit absolute top-[-20px] left-1/2 -translate-x-1/2"
              />
            </div>
            <div
              className={`${
                direction === "ltr"
                  ? "card space-y-34 relative h-[520px] absolute bottom-[-65px] right-14"
                  : "card space-y-34 relative h-[510px] absolute top-0 left-0 lg:left-10"
              }`}
            >
              <div
                className={`top-card ${
                  direction === "ltr"
                    ? "bg-[url('/bg-3.png')] p-5"
                    : "bg-[url('/bg-1.png')] p-10"
                } bg-contain bg-center bg-no-repeat  w-[300px] h-[300px] absolute top-0 left-0 flex flex-col justify-center items-end`}
              >
                <div className="title">
                  <Link href="/shop">
                    <h3 className="text-[15px] font-[700] text-zinc-900 dark:text-zinc-900 hover:text-primary transition-all duration-300">
                      {t("product_installments")}
                    </h3>
                  </Link>
                </div>
                <div className="desc">
                  <p className="font-normal text-sm text-zinc-600 dark:text-zinc-600">
                    {t("split_the_cost_stress_free")}
                  </p>
                </div>
              </div>
              <div
                className={`bottom-card ${
                  direction === "ltr"
                    ? "bg-[url('/bg-4.png')] p-5"
                    : "bg-[url('/bg-2.png')] p-10"
                } bg-contain bg-center bg-no-repeat  w-[300px] h-[300px] absolute bottom-0 left-0 flex flex-col justify-center items-end`}
              >
                <div className="title">
                  <Link href="/shop">
                    <h3 className="text-[15px] font-[700] text-zinc-900 dark:text-zinc-900 hover:text-primary transition-all duration-300">
                      {t("nationwide_shipping")}
                    </h3>
                  </Link>
                </div>
                <div className="desc">
                  <p className="font-normal text-sm text-zinc-600 dark:text-zinc-600">
                    {t("we_deliver_anywhere_in_egypt")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contant lg:hidden">
          <div className="flex flex-col gap-5">
            <div className="card grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="top-card p-5 bg-muted ">
                <div className="contant relative z-10">
                  <div className="title">
                    <Link href="/shop">
                      <h3 className="text-[15px] font-[700] hover:text-primary transition-all duration-300">
                        {t("new_arrivals")}
                      </h3>
                    </Link>
                  </div>
                  <div className="desc">
                    <p className="text-muted-foreground font-normal text-sm">
                      {t("latest_trends_just_landed")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bottom-card p-5 bg-muted">
                <div className="contant relative z-10">
                  <div className="title">
                    <Link href="/shop">
                      <h3 className="text-[15px] font-[700] hover:text-primary transition-all duration-300">
                        {t("flexible_payment_options")}
                      </h3>
                    </Link>
                  </div>
                  <div className="desc">
                    <p className="text-muted-foreground font-normal text-sm">
                      {t("pay_your_way_your_style")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card flex justify-center items-center bg-muted p-10">
              <Image
                src="/placeholder-image.png"
                alt={t("special_year_image_alt")}
                width={2000}
                height={2000}
                sizes="(max-width: 768px) 60vw, 33vw"
                className="w-[60%] h-full object-fit"
              />
            </div>
            <div className="card grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="top-card p-5 bg-muted">
                <div className="title">
                  <Link href="/shop">
                    <h3 className="text-[15px] font-[700] hover:text-primary transition-all duration-300">
                      {t("product_installments")}
                    </h3>
                  </Link>
                </div>
                <div className="desc">
                  <p className="text-muted-foreground font-normal text-sm">
                    {t("split_the_cost_stress_free")}
                  </p>
                </div>
              </div>
              <div className="bottom-card p-5 bg-muted">
                <div className="title">
                  <Link href="/shop">
                    <h3 className="text-[15px] font-[700] hover:text-primary transition-all duration-300">
                      {t("nationwide_shipping")}
                    </h3>
                  </Link>
                </div>
                <div className="desc">
                  <p className="text-muted-foreground font-normal text-sm">
                    {t("we_deliver_anywhere_in_egypt")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SpecialYear;

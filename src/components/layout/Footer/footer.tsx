"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";
import { useCategories } from "@/hooks/useCategories";
import { stripLocaleFromPathname } from "@/lib/locale";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TikTokIcon from "@/components/icons/TikTokIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import FacebookIcon from "@/components/icons/facebook";
import { useLanguage } from "@/contexts/LanguageContext";

const quickLinks = [
  { name: "home", href: "/", active: false },
  { name: "privacy_policy", href: "/privacy", active: false },
  {
    name: "refunds_and_exchanges",
    href: "/refunds-and-exchanges",
    active: false,
  },
  {
    name: "delivery_and_shipping",
    href: "/delivery-and-shipping",
    active: false,
  },
  { name: "contact", href: "/contact", active: false },
];

export function Footer() {
  const { t } = useTranslation("footer");
  const pathname = stripLocaleFromPathname(usePathname() || "/");
  const searchParams = useSearchParams();
  const { t: headerT } = useTranslation("header");
  const { data: categoriesData } = useCategories();
  const { language } = useLanguage();
  const categories = categoriesData?.data.category.map((category) => ({
    name: category.name,
    id: category.id,
  }));

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/shop") {
      return (
        pathname === "/shop" ||
        pathname.startsWith("/shop/") ||
        (pathname === "/shop" && searchParams.has("category"))
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Function to check if a category is active based on URL parameters
  const isCategoryActive = (categoryId: string) => {
    if (pathname === "/shop" && categoryId) {
      const categoryParam = searchParams.get("category");
      return (
        categoryParam === categoryId || categoryParam === categoryId.toString()
      );
    }
    return false;
  };

  // Update quickLinks with active states
  const activeQuickLinks = quickLinks.map((link) => ({
    ...link,
    active: isActiveLink(link.href),
  }));

  const paymentMethods = [
    {
      name: "Visa",
      src: "/payment/Visa.svg",
    },
    {
      name: "Mastercard",
      src: "/payment/Mastercard.svg",
    },
    {
      name: "Apple Pay",
      src: "/payment/ApplePay.svg",
    },
    {
      name: "Cash",
      src: "/payment/cash.svg",
    },
    {
      name: "Instapay",
      src: "/payment/instapay.svg",
    },
  ];

  const [openAccordion, setOpenAccordion] = useState<string | false>(false);

  const toggleAccordion = (panel: string) => {
    setOpenAccordion((prevOpen) => (prevOpen === panel ? false : panel));
  };

  return (
    <footer className="relative flex flex-col justify-center w-full overflow-hidden border-t border-border bg-background">
      <div className="px-4 sm:px-6 lg:px-10 xl:px-20 py-10 sm:py-15 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 xl:gap-10">
        <div className="first-col space-y-6 relative z-10 lg:col-span-2 col-span-2">
          <div className="logo flex justify-center">
            <Image
              src="/ar-logo.webp"
              alt="logo"
              width={200}
              height={200}
              unoptimized
              className="w-44 h-44 sm:w-40 sm:h-40 object-contain"
            />
          </div>

          <div className="follow space-y-2 text-center">
            <h3 className="text-md font-bold">{t("follow_us")}</h3>
            <ul className="flex items-center gap-3">
              <li>
                <a
                  href="https://www.facebook.com/furnmasr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-0 border-0 m-0 w-9 h-9 rounded-full flex"
                >
                  <FacebookIcon className="w-full h-full" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/furnmasr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-0 border-0 m-0 w-9 h-9 rounded-full flex"
                >
                  <InstagramIcon className="w-full h-full" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@furnmasr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="p-0 border-0 m-0 w-9 h-9 rounded-full flex"
                >
                  <TikTokIcon className="w-full h-full" />
                </a>
              </li>
            </ul>
          </div>

          <div className="call flex items-center gap-2 justify-center">
            <a
              href="tel://+201221661733"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              {language === "en" && (
                <FaPhoneAlt className="text-lg md:text-xl" />
              )}
              <span className="text-[10px] md:text-[12px]">
                {headerT("for_inquiry")} 01221661733
              </span>
              {language === "ar" && (
                <FaPhoneAlt className="text-lg md:text-xl" />
              )}
            </a>
          </div>
        </div>

        <div className="second-col sm:col-span-1 lg:col-span-2 col-span-2 relative z-10">
          <div className="">
            <div className="col-span-1 mb-5 hidden lg:block">
              <h3 className="text-md font-bold">{t("quick_links")}</h3>
            </div>

            {/* Mobile Accordion */}
            <div className="lg:hidden">
              <Accordion>
                <AccordionItem className="border-none">
                  <AccordionTrigger
                    className="py-2 text-md font-bold hover:no-underline"
                    onClick={() => toggleAccordion("quick-links")}
                    isOpen={openAccordion === "quick-links"}
                  >
                    {t("quick_links")}
                  </AccordionTrigger>
                  <AccordionContent isOpen={openAccordion === "quick-links"}>
                    <ul className="flex flex-col gap-3 pl-4">
                      {activeQuickLinks.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`text-md hover:text-primary transition-all duration-300 ${
                              item.active ? "text-primary font-bold" : ""
                            }`}
                          >
                            {t(item.name)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Desktop Regular List */}
            <div className="hidden lg:block links">
              <ul className="flex flex-col gap-5">
                {activeQuickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-md hover:text-primary transition-all duration-300 ${
                        item.active ? "text-primary font-bold" : ""
                      }`}
                    >
                      {t(item.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="third-col sm:col-span-1 lg:col-span-2 col-span-2 relative z-10">
          <div className="">
            <div className="col-span-1 mb-5 hidden lg:block">
              <h3 className="text-md font-bold">{t("categories")}</h3>
            </div>

            {/* Mobile Accordion */}
            <div className="lg:hidden">
              <Accordion>
                <AccordionItem className="border-none">
                  <AccordionTrigger
                    className="py-2 text-md font-bold hover:no-underline"
                    onClick={() => toggleAccordion("categories")}
                    isOpen={openAccordion === "categories"}
                  >
                    {t("categories")}
                  </AccordionTrigger>
                  <AccordionContent isOpen={openAccordion === "categories"}>
                    <ul className="flex flex-col gap-3 pl-4">
                      {categories
                        ?.map((category) => (
                          <li key={category.name}>
                            <Link
                              href={`/shop?category=${category.id}`}
                              className={`text-md hover:text-primary transition-all duration-300 ${
                                isCategoryActive(category.id.toString())
                                  ? "text-primary font-bold"
                                  : ""
                              }`}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))
                        .slice(0, 5)}
                      <li>
                        <Link
                          href="/shop"
                          className={`text-md hover:text-primary transition-all duration-300 ${
                            isActiveLink("/shop")
                              ? "text-primary font-bold"
                              : ""
                          }`}
                        >
                          {t("products")}
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Desktop Regular List */}
            <div className="hidden lg:block">
              <ul className="flex flex-col gap-5">
                {categories
                  ?.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={`/shop?category=${category.id}`}
                        className={`text-md hover:text-primary transition-all duration-300 ${
                          isCategoryActive(category.id.toString())
                            ? "text-primary font-bold"
                            : ""
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                  .slice(0, 5)}
                <li>
                  <Link
                    href="/shop"
                    className={`text-md hover:text-primary transition-all duration-300 ${
                      isActiveLink("/shop") ? "text-primary font-bold" : ""
                    }`}
                  >
                    {t("products")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="fourth-col sm:col-span-1 lg:col-span-3 col-span-2 relative z-10">
          <div className="">
            <div className="col-span-1 space-y-5">
              <h3 className="text-md font-bold">
                {t(
                  "get_your_favorite_products_today_and_enjoy_easy_flexible_installment_plans",
                )}
              </h3>

              <ul className="flex items-center flex-wrap gap-5 gap-y-1">
                {paymentMethods.map((method) => (
                  <li key={method.name}>
                    <Image
                      src={method.src}
                      alt="visa"
                      width={700}
                      height={700}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="fifth-col sm:col-span-1 lg:col-span-3 col-span-2 relative z-10">
          <div className="">
            <div className="col-span-1 space-y-2 mb-5">
              <h3 className="text-xl sm:text-2xl font-bold">
                {t("subscribe")}
              </h3>
              <p className="text-sm">{t("subscribe_description")}</p>
            </div>

            <div className="form">
              <form action="" className="space-y-4">
                <Input
                  type="email"
                  placeholder={t("enter_your_email")}
                  className="h-12 w-full bg-[#F5F5F5] border-none focus-visible:ring-1 focus-visible:ring-offset-0 rounded-sm"
                />
                <Button
                  size="lg"
                  type="submit"
                  className="bg-black text-white rounded-sm w-full sm:w-auto"
                >
                  {t("subscribe")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright bg-black dark:bg-[#08120b] text-white p-5 px-10 z-10 flex justify-center">
        <p className=" text-sm text-center">
          {t("copyright")} | {t("all_rights_reserved")}
        </p>
      </div>
    </footer>
  );
}

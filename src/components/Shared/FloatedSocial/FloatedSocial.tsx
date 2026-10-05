"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { stripLocaleFromPathname } from "@/lib/locale";
import { X } from "lucide-react";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaFacebookMessenger,
} from "react-icons/fa";

const PRODUCT_BOTTOM_BAR_SCROLL = 300;

function FloatedSocial() {
  const [showSocial, setShowSocial] = useState(false);
  const [isAboveProductBar, setIsAboveProductBar] = useState(false);
  const pathname = stripLocaleFromPathname(usePathname() || "/");
  const { language } = useLanguage();

  const isProductPage =
    pathname.startsWith("/shop/") && pathname !== "/shop";

  useEffect(() => {
    if (!isProductPage) {
      setIsAboveProductBar(false);
      return;
    }

    const handleScroll = () => {
      setIsAboveProductBar(window.scrollY > PRODUCT_BOTTOM_BAR_SCROLL);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductPage]);

  const toggleSocial = () => {
    setShowSocial(!showSocial);
  };

  const socialMedia = [
    {
      icon: <FaFacebook className="!size-9 facebookIcon" />,
      url: "https://www.facebook.com/furnmasr",
    },

    {
      icon: <FaInstagram className="!size-8 instagramIcon" />,
      url: "https://www.instagram.com/furnmasr/",
    },

    {
      icon: <FaPhone className="!size-6 phoneIcon" />,
      url: "tel://+201221661733",
    },
    {
      icon: <FaWhatsapp className="!size-8 whatsappIcon" />,
      url: "https://wa.me/201221661733",
    },
    {
      icon: <FaFacebookMessenger className="!size-8 messengerIcon" />,
      url: "https://m.me/679830948882799",
    },
  ];

  return (
    <div
      className={`fixed z-[60] transition-[bottom] duration-300 ${
        language === "ar" ? "left-5" : "right-5"
      } ${
        isAboveProductBar
          ? "bottom-[5.5rem] lg:bottom-5"
          : "bottom-5"
      }`}
    >
      <div className="relative">
        {showSocial && (
          <div className="absolute bottom-full mb-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {socialMedia.map((item, index) => {
            // Define official brand colors for each social media platform
            const getGradientClasses = (iconType: string) => {
              switch (iconType) {
                case "facebook":
                  return "bg-[#1877F2] hover:bg-[#166FE5] text-white";
                case "instagram":
                  return "bg-gradient-to-br from-[#E4405F] via-[#F77737] to-[#FCAF45] hover:from-[#d63384] hover:via-[#fd7e14] hover:to-[#ffc107] text-white";
                case "phone":
                  return "bg-[#34B7F1] hover:bg-[#2A9FD8] text-white";
                case "whatsapp":
                  return "bg-[#25D366] hover:bg-[#1DA851] text-white";
                case "messenger":
                  return "bg-[#0084FF] hover:bg-[#0066CC] text-white";
                default:
                  return "bg-[#6B7280] hover:bg-[#4B5563] text-white";
              }
            };

            const getIconType = (icon: React.ReactElement<{ className?: string }>) => {
              if (icon.props.className?.includes("facebookIcon"))
                return "facebook";
              if (icon.props.className?.includes("instagramIcon"))
                return "instagram";
              if (icon.props.className?.includes("phoneIcon")) return "phone";
              if (icon.props.className?.includes("whatsappIcon"))
                return "whatsapp";
              if (icon.props.className?.includes("messengerIcon"))
                return "messenger";
              return "default";
            };

            const iconType = getIconType(item.icon);
            const gradientClasses = getGradientClasses(iconType);

            return (
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <div
                  className={`group relative overflow-hidden ${gradientClasses} p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm border border-white/10 w-12 h-12 flex items-center justify-center`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transition-transform duration-700 ${
                      language === "ar"
                        ? "translate-x-full group-hover:-translate-x-full"
                        : "-translate-x-full group-hover:translate-x-full"
                    }`}
                  ></div>
                  <div className="relative z-10 drop-shadow-sm flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        )}
        <Button
          size="icon"
          onClick={toggleSocial}
          className="rounded-full w-12 h-12 bg-[#25D366] hover:bg-[#1DA851] transition-all duration-300 flex items-center justify-center relative"
        >
          <div className="relative w-12 h-12">
            <X
              className={`!size-8 absolute inset-[8px] transition-all duration-300 ${
                showSocial === true
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              } transition-all duration-300`}
            />{" "}
            <FaWhatsapp
              className={`!size-8 absolute inset-[8px]  transition-all duration-300 ${
                showSocial === false
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              } transition-all duration-300`}
            />
          </div>
        </Button>
      </div>
    </div>
  );
}

export default FloatedSocial;

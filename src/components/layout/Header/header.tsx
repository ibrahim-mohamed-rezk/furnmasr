"use client";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import {
  ChevronDown,
  ChevronLeft,
  Plus,
  User,
  LogOut,
  Loader2,
  AlignJustify,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { CgSearch } from "react-icons/cg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import SideCart from "@/components/Cart/SideCart";
import SideWishlist from "@/components/Wishlist/SideWishlist";
import { ShowPage } from "@/components/Auth/ShowPage";
import SearchBar from "./SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { localeHref, stripLocaleFromPathname } from "@/lib/locale";
import { useTranslation } from "@/hooks/useTranslation";
import { Label } from "@/components/ui/label";
import { isAuthenticated, useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile, useIsTablet } from "@/hooks/use-resize";
import { ForgotPasswordDialog } from "@/app/[lang]/account/components/Account/ForgotPasswordDialog";
import { OtpVerificationDialog } from "@/app/[lang]/account/components/Account/OtpVerificationDialog";
import { NewPasswordDialog } from "@/app/[lang]/account/components/Account/NewPasswordDialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
// Dark mode temporarily disabled — see src/app/layout.tsx (forcedTheme="light").
// import { ThemeToggle } from "./ThemeToggle";
import FacebookIcon from "@/components/icons/facebook";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";

export function Header() {
  const [activeTab, setActiveTab] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otpVerificationOpen, setOtpVerificationOpen] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const router = useRouter();
  const rawPathname = usePathname();
  // Locale-stripped path ("/ar/shop" -> "/shop") so active-link checks below can
  // compare against unprefixed route paths regardless of the current locale.
  const pathname = stripLocaleFromPathname(rawPathname || "/");
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { t: headerT } = useTranslation("header");
  const logoutMutation = useLogout();
  const { user } = useUserProfile();
  const { cartData } = useCart();
  const { wishlistData } = useWishlist();

  const cartCount = cartData?.cart?.items?.length || 0;
  const wishlistCount = wishlistData?.data?.length || 0;

  // ✅ ALWAYS CALL ALL HOOKS AT TOP LEVEL
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleOtpSent = (email: string) => {
    setResetEmail(email);
    setOtpVerificationOpen(true);
  };

  const handleOtpVerified = () => {
    setNewPasswordOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (pathname !== "/shop") {
      setOpenSearch(false);
    }
  }, [pathname]);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const navigation = [
    { name: "nav.home", href: "/" },
    { name: "nav.categories", href: "/shop?category=" },
    { name: "nav.shop", href: "/shop" },
    { name: "nav.blogs", href: "/blogs" },
    { name: "nav.contact", href: "/contact" },
  ];

  // Function to check if a navigation item is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/shop") {
      // Only active if on /shop and there is NO category param
      return pathname === "/shop" || searchParams.get("category");
    }
    if (href === "/shop?category=") {
      // Only active if on /shop and there IS a category param
      return searchParams.get("category");
    }
    if (href === "/blogs") {
      return pathname === "/blogs" || pathname.startsWith("/blogs/");
    }
    if (href === "/contact") {
      return pathname === "/contact" || pathname.startsWith("/contact/");
    }
    if (href === "/flash-sale") {
      return pathname === "/flash-sale" || pathname.startsWith("/flash-sale/");
    }
    if (href === "/account") {
      return pathname === "/account" || pathname.startsWith("/account/");
    }
    if (href === "/cart") {
      return (
        pathname === "/cart" ||
        pathname.startsWith("/cart/") ||
        pathname === "/checkout" ||
        pathname.startsWith("/checkout/")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Function to check if a category is active based on URL parameters
  const isCategoryActive = (categorySlug: string) => {
    if (pathname === "/shop" && categorySlug) {
      const categoryParam = searchParams.get("category");
      return (
        categoryParam === categorySlug ||
        categoryParam === categorySlug.toString()
      );
    }
    return false;
  };

  // Flat category list from the API; each item carries a `parent` object when it
  // is a subcategory. Split into top-level entries and a per-parent lookup so the
  // dropdown can render a hover flyout of subcategories.
  const categoryList = categoriesData?.data?.category ?? [];
  const topLevelCategories = categoryList.filter((category) => category.parent == null);
  const getSubcategories = (parentId: number) =>
    categoryList.filter((category) => category.parent?.id === parentId);

  // ✅ COMPUTE CONDITIONAL LOGIC AFTER ALL HOOKS ARE CALLED
  const shouldShowAuth = !isMobile && !isTablet;

  return (
    <>
      {/* Top bar - will scroll away */}
      <section className="bg-black dark:bg-[#08120b] text-white p-2">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-2 md:px-6">
          <div className="social">
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
              <li>
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
              </li>
            </ul>
          </div>

          <div className="text-center hidden md:block">
            <p className="text-white text-sm">{headerT("experience_beauty")}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark mode temporarily hidden — restore when re-enabling it. */}
            {/* <ThemeToggle /> */}
            <div className="language flex items-center gap-2 select-none">
              <Label htmlFor="language" className="cursor-pointer">
                <Image
                  src="/icons/World.svg"
                  alt="world"
                  width={20}
                  height={20}
                  className="w-10 h-10"
                />
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  id="language"
                  className="bg-transparent text-white border-none p-0"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent id="language">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main navigation - sticky only this section */}
      <nav
        className="bg-background border-b sticky top-0 z-50 shadow-sm"
        aria-label="Global"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between p-1 px-6">
          <div className="order-1 lg:order-none">
            <Link href="/">
              <span className="text-xl font-bold text-foreground">
                <Image
                  src="/logo.webp"
                  alt="logo"
                  width={200}
                  height={200}
                  priority
                  unoptimized
                  className="h-16 w-auto object-contain sm:h-28 lg:h-auto lg:w-20"
                />
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex gap-10">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.name === "nav.categories" ? (
                  <div className="relative group">
                    <div
                      className={`flex h-full items-center gap-2 cursor-pointer text-sm font-bold leading-6 hover:text-primary group-hover:text-primary transition-colors select-none ${
                        isActiveLink(item.href)
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      <Link href={item.href}>{t(item.name)}</Link>
                      <ChevronDown className="h-5 w-5 group-hover:rotate-180 transition-transform duration-200" />
                    </div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[300px] pt-9 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 h-fit z-10">
                      <ul className="flex flex-col gap-1 p-2 bg-foreground text-background rounded-none shadow-lg w-full">
                        {categoriesLoading ? (
                          <div className="cover flex items-center justify-center">
                            <Loader2 className="h-8 w-20 animate-spin text-primary" />
                          </div>
                        ) : (
                          topLevelCategories.map((category) => {
                            const subcategories = getSubcategories(category.id);
                            return (
                              <li
                                key={category.id}
                                className="relative group/sub flex w-full"
                              >
                                <Link
                                  href={`/shop?category=${category.id}`}
                                  className={`w-full flex items-center justify-between gap-2 hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm ${
                                    isCategoryActive(category.id.toString())
                                      ? "text-primary bg-background/20"
                                      : ""
                                  }`}
                                >
                                  <span>{category.name}</span>
                                  {subcategories.length > 0 && (
                                    <ChevronLeft
                                      className={`h-4 w-4 shrink-0 ${
                                        language === "ar" ? "" : "rotate-180"
                                      }`}
                                    />
                                  )}
                                </Link>
                                {subcategories.length > 0 && (
                                  <div
                                    className={`absolute top-0 w-[250px] invisible group-hover/sub:visible opacity-0 group-hover/sub:opacity-100 transition-all duration-200 z-20 ${
                                      language === "ar"
                                        ? "right-full pr-2"
                                        : "left-full pl-2"
                                    }`}
                                  >
                                    <ul className="flex flex-col gap-1 p-2 bg-foreground text-background rounded-none shadow-lg w-full">
                                      {subcategories.map((sub) => (
                                        <li key={sub.id} className="flex w-full">
                                          <Link
                                            href={`/shop?category=${sub.id}`}
                                            className={`w-full hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm ${
                                              isCategoryActive(sub.id.toString())
                                                ? "text-primary bg-background/20"
                                                : ""
                                            }`}
                                          >
                                            {sub.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-bold leading-6 hover:text-primary transition-colors ${
                      isActiveLink(item.href)
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {t(item.name)}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-none">
            <ul className="flex items-center gap-5">
              {[
                {
                  icon: (
                    <CgSearch
                      className={`h-6 w-6 cursor-pointer`}
                      role="button"
                      tabIndex={0}
                      aria-label={headerT("search")}
                      onClick={() => {
                        router.push(localeHref("/shop", language));
                        setOpenSearch(!openSearch);
                      }}
                    />
                  ),
                  href: "/search",
                  label: headerT("search"),
                },
                ...(shouldShowAuth
                  ? [
                      {
                        label: "auth",
                        component:
                          isClient && isAuthenticated() ? (
                            <Link href="/account" className="">
                              <User
                                className={`h-6 w-6 ${
                                  isActiveLink("/account")
                                    ? "text-primary hover:text-primary transition-colors"
                                    : "text-foreground hover:text-primary transition-colors"
                                }`}
                              />
                            </Link>
                          ) : (
                            <ShowPage
                              setForgotPasswordOpen={setForgotPasswordOpen}
                            />
                          ),
                      },
                    ]
                  : []),
                {
                  label: "Wishlist",
                  component: (
                    <div
                      className={
                        isActiveLink("/wishlist") ? "text-primary" : ""
                      }
                    >
                      <SideWishlist />
                    </div>
                  ),
                },
                {
                  label: "Cart",
                  component: (
                    <div
                      className={isActiveLink("/cart") ? "text-primary" : ""}
                    >
                      <SideCart />
                    </div>
                  ),
                },
              ].map((item, index) => (
                <li key={index}>
                  {isClient && isAuthenticated() && item.label === "auth" ? (
                    <div className="relative group">
                      <span
                        className={`flex h-full items-center gap-2 cursor-pointer text-sm font-semibold leading-6 hover:text-primary group-hover:text-primary transition-colors select-none ${
                          activeTab === item.label ? "text-primary" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.component}
                        </span>
                      </span>
                      <div className="absolute top-5 right-1/2 translate-x-1/2 w-[250px] pt-9 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 h-fit z-10">
                        <ul className="flex flex-col gap-1 p-2 bg-foreground text-background rounded-none shadow-lg w-full">
                          <li className="flex w-full items-center p-1 border-b border-background/20 mb-2">
                            <Link
                              href="/account"
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              <User className="h-10 w-10 bg-background text-foreground rounded-full p-2" />
                              <div className="info">
                                <p className="text-sm font-semibold leading-6 text-background hover:text-primary transition-colors mb-0">
                                  {user?.name || "Guest"}
                                </p>
                                <p className="text-xs font-semibold leading-6 text-background/80 hover:text-primary transition-colors">
                                  {user?.email.slice(0, 15) + "..." ||
                                    "No email"}
                                </p>
                              </div>
                            </Link>
                          </li>
                          {[
                            {
                              name: "my_account",
                              href: "/account",
                              icon: (
                                <User className="h-4 w-4 text-background" />
                              ),
                            },
                            {
                              name: "logout",
                              // href: "/",
                              icon: (
                                <LogOut className="h-4 w-4 text-background" />
                              ),
                            },
                          ].map((item, index) => (
                            <li key={index} className="flex w-full">
                              {item.name === "logout" ? (
                                <Button
                                  variant={"link"}
                                  disabled={logoutMutation.isPending}
                                  className="w-full text-md hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm flex items-center gap-2 text-background hover:no-underline justify-start"
                                  onClick={() => {
                                    logoutMutation.mutate();
                                  }}
                                >
                                  {logoutMutation.isPending ? (
                                    <LoadingSpinner
                                      text={t("auth.logging_out")}
                                      color="white"
                                      size="sm"
                                      className="text-background flex row-reverse"
                                    />
                                  ) : (
                                    <>
                                      {item.icon}
                                      {headerT(item.name)}
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Link
                                  href={item.href || ""}
                                  className={`w-full hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm flex items-center gap-2 ${
                                    isActiveLink(item.href || "")
                                      ? "text-primary bg-background/10"
                                      : "text-background"
                                  }`}
                                >
                                  {item.icon}
                                  {headerT(item.name)}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <span className="bg-transparent text-foreground p-0 hover:text-primary hover:bg-transparent transition-colors shadow-none cursor-pointer flex items-center justify-center">
                      {item.icon || item.component}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden order-0 lg:order-none">
            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={headerT("menu") || "Menu"}
                  className="transition-transform duration-200 hover:text-primary cursor-pointer"
                >
                  <AlignJustify className="h-6 w-6 transition-transform duration-200" />
                </button>
              </SheetTrigger>
              <SheetContent className="bg-background w-[300px] overflow-y-auto left-0 top-0 p-4">
                <SheetContent className="h-full">
                  <div className="cove flex flex-col gap-4 justify-between h-full">
                    <div className="space-y-4">
                      <div className="logo flex justify-center items-center border-b border-foreground/20 pb-4">
                        <Image
                          src="/ar-logo.png"
                          alt="logo"
                          width={700}
                          height={700}
                          className="w-28 h-28 object-contain"
                        />
                      </div>

                      <ul className="flex flex-col gap-4">
                        {navigation.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={item.href}
                              className={`text-sm font-semibold hover:text-primary transition-colors ${
                                isActiveLink(item.href)
                                  ? "text-primary font-bold"
                                  : "text-foreground"
                              }`}
                              onClick={() =>
                                item.name === "nav.categories"
                                  ? ""
                                  : setOpenMenu(false)
                              }
                            >
                              {item.name === "nav.categories" ? (
                                <div className="relative group">
                                  <span
                                    className={`flex h-full items-center gap-2 cursor-pointer text-sm font-semibold leading-6 hover:text-primary group-hover:text-primary transition-colors select-none ${
                                      isActiveLink(item.href)
                                        ? "text-primary"
                                        : ""
                                    } flex justify-between`}
                                    onClick={() => setIsOpen(!isOpen)}
                                  >
                                    <Link href={item.href}>{t(item.name)}</Link>
                                    <Plus className="h-5 w-5 group-hover:rotate-180 transition-transform duration-200" />
                                  </span>
                                  <div
                                    className={` overflow-hidden z-10 transition-all duration-300 ${
                                      isOpen
                                        ? "max-h-[300px] visible mt-3"
                                        : "h-0 invisible mt-0"
                                    }`}
                                  >
                                    <ul className="flex flex-col gap-1 p-2 bg-foreground text-background rounded-none shadow-lg w-full">
                                      {topLevelCategories.map((category) => {
                                        const subcategories = getSubcategories(
                                          category.id,
                                        );
                                        return (
                                          <li
                                            key={category.id}
                                            className="flex w-full flex-col"
                                          >
                                            <Link
                                              href={`/shop?category=${category.id}`}
                                              className={`w-full hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm ${
                                                isCategoryActive(
                                                  category.id.toString(),
                                                )
                                                  ? "text-primary bg-background/20"
                                                  : "text-background"
                                              }`}
                                              onClick={() => {
                                                setIsOpen(false);
                                                setOpenMenu(false);
                                              }}
                                            >
                                              {category.name}
                                            </Link>
                                            {subcategories.length > 0 && (
                                              <ul className="flex flex-col gap-1 ms-4 ps-2 border-s border-background/20">
                                                {subcategories.map((sub) => (
                                                  <li
                                                    key={sub.id}
                                                    className="flex w-full"
                                                  >
                                                    <Link
                                                      href={`/shop?category=${sub.id}`}
                                                      className={`w-full text-sm hover:text-primary transition-colors hover:bg-background/20 p-2 rounded-sm ${
                                                        isCategoryActive(
                                                          sub.id.toString(),
                                                        )
                                                          ? "text-primary bg-background/20"
                                                          : "text-background"
                                                      }`}
                                                      onClick={() => {
                                                        setIsOpen(false);
                                                        setOpenMenu(false);
                                                      }}
                                                    >
                                                      {sub.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              ) : (
                                t(item.name)
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isClient && isAuthenticated() ? (
                      <div className="mt-10">
                        <ul className="w-full">
                          <li className="flex w-full items-center p-1 border-b border-foreground/20 mb-2">
                            <Link
                              href="/account"
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              <User className="h-10 w-10 bg-foreground text-background rounded-full p-2" />
                              <div className="info">
                                <p className="text-sm font-semibold leading-6 hover:text-primary transition-colors mb-0 text-foreground">
                                  {user?.name || "Guest"}
                                </p>
                                <p className="text-xs font-semibold leading-6 hover:text-primary transition-colors text-muted-foreground">
                                  {user?.email || "No email"}
                                </p>
                              </div>
                            </Link>
                          </li>
                          {[
                            {
                              name: "my_account",
                              href: "/account",
                              icon: (
                                <User className="h-4 w-4 text-foreground" />
                              ),
                            },
                            {
                              name: "logout",
                              href: "/",
                              icon: (
                                <LogOut className="h-4 w-4 text-foreground" />
                              ),
                            },
                          ].map((item, index) => (
                            <li key={index} className="flex w-full">
                              {item.name === "logout" ? (
                                <Button
                                  variant={"link"}
                                  disabled={logoutMutation.isPending}
                                  className="w-full text-md hover:text-primary transition-colors hover:bg-muted p-2 rounded-sm flex items-center gap-2 text-foreground hover:no-underline justify-start"
                                  onClick={() => {
                                    logoutMutation.mutate();
                                  }}
                                >
                                  {logoutMutation.isPending ? (
                                    <LoadingSpinner
                                      text={t("auth.logging_out")}
                                      color="primary"
                                      size="sm"
                                      className="text-foreground flex row-reverse"
                                    />
                                  ) : (
                                    <>
                                      {item.icon}
                                      {headerT(item.name)}
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Link
                                  href={item.href}
                                  className={`w-full hover:text-primary transition-colors hover:bg-muted p-2 rounded-sm flex items-center gap-2 ${
                                    isActiveLink(item.href)
                                      ? "text-primary bg-muted"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.icon}
                                  {headerT(item.name)}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ShowPage
                        setForgotPasswordOpen={setForgotPasswordOpen}
                        side={true}
                      />
                    )}
                  </div>
                </SheetContent>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {openSearch && <SearchBar setOpenSearch={setOpenSearch} />}

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onOtpSent={(email) => handleOtpSent(email)}
      />

      {/* OTP Verification Dialog */}
      <OtpVerificationDialog
        open={otpVerificationOpen}
        onOpenChange={setOtpVerificationOpen}
        onOtpVerified={() => handleOtpVerified()}
        email={resetEmail || user?.email || ""}
      />

      {/* New Password Dialog */}
      <NewPasswordDialog
        open={newPasswordOpen}
        onOpenChange={setNewPasswordOpen}
        email={resetEmail || user?.email || ""}
      />
    </>
  );
}

"use client";

/**
 * ProductLanguageSwitcher
 *
 * Mounts on product detail pages. When the active language changes it checks
 * whether the current URL slug matches the slug for that language. If not, it
 * replaces the URL with the correct slug so the address bar always reflects the
 * active locale.
 *
 * Scenario 1 – user clicks the language switcher in the Header:
 *   LanguageContext.setLanguage("ar") fires → this effect runs → detects mismatch
 *   → router.replace("/shop/فيلا")
 *
 * Scenario 2 – user manually types /shop/villa while language is "ar":
 *   Component mounts with language="ar", currentSlug="villa", slugAr="فيلا"
 *   → mismatch detected on first render → redirect to /shop/فيلا
 *
 * No infinite loop: correctedForLocaleRef stores the locale we already
 * corrected for. The effect only runs again when the locale actually changes.
 */

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductLanguageSwitcherProps {
  slugEn?: string;
  slugAr?: string;
  currentSlug: string;
}

export function ProductLanguageSwitcher({
  slugEn,
  slugAr,
  currentSlug,
}: ProductLanguageSwitcherProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const correctedForLocaleRef = useRef<string | null>(null);

  useEffect(() => {
    // Nothing to do if the backend didn't return both slug variants
    if (!slugEn || !slugAr) return;

    const targetSlug = language === "ar" ? slugAr : slugEn;

    // Already corrected for this locale — skip to prevent infinite loop
    if (correctedForLocaleRef.current === language) return;

    // Slug already matches the active language — no redirect needed
    if (currentSlug === targetSlug) {
      correctedForLocaleRef.current = language;
      return;
    }

    // Mismatch: replace the slug segment in the current pathname
    const newPathname = pathname.replace(
      `/shop/${currentSlug}`,
      `/shop/${targetSlug}`,
    );

    if (newPathname !== pathname) {
      correctedForLocaleRef.current = language;
      router.replace(newPathname);
    }
  }, [language, slugEn, slugAr, currentSlug, pathname, router]);

  // This component renders nothing — it's purely a side-effect hook
  return null;
}

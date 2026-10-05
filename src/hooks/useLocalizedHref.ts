"use client";

import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localeHref } from "@/lib/locale";

/**
 * Returns a function that prefixes an internal path with the active locale,
 * e.g. with language "ar": localize("/shop") -> "/ar/shop".
 * Idempotent (see `localeHref`), so it's safe to apply to already-prefixed paths.
 */
export function useLocalizedHref() {
  const { language } = useLanguage();
  return useCallback((path: string) => localeHref(path, language), [language]);
}

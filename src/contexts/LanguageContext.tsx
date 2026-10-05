"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Language, getDirection } from "@/lib/i18n";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  swapLocaleInPath,
} from "@/lib/locale";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: "ltr" | "rtl";
  /**
   * Kept for backwards compatibility with existing consumers. The locale now
   * comes from the URL and is known at first server render, so it is always
   * "loaded" — this is permanently true.
   */
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
  /**
   * Locale resolved server-side from the URL (via the middleware header) and
   * passed down by the root layout. Used as the source of truth so the very
   * first client render already matches the server — no flash, no localStorage.
   */
  initialLang?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLang = DEFAULT_LOCALE,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for the active language. We fall back
  // to the server-provided initialLang while pathname is resolving.
  const language: Language = pathname
    ? getLocaleFromPathname(pathname)
    : initialLang;
  const direction = getDirection(language);

  // Keep the document attributes in sync on client navigations between locales
  // (the server already sets them correctly for the initial load).
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.documentElement.classList.remove("ltr", "rtl");
    document.documentElement.classList.add(direction);
  }, [language, direction]);

  // Switching language is now a navigation: swap the locale segment in the URL
  // and preserve the current query string. React Query re-keys on `language`,
  // so data refetches in the new locale automatically.
  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    const nextPath = swapLocaleInPath(pathname || "/", lang);
    const query = searchParams?.toString();
    router.push(query ? `${nextPath}?${query}` : nextPath);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      direction,
      isLoaded: true,
    }),
    // setLanguage closes over pathname/searchParams; language/direction derive
    // from pathname, so this recomputes whenever the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, direction, pathname, searchParams]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

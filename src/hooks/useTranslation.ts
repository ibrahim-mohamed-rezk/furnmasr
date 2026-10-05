import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export const useTranslation = (namespace?: string) => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getTranslation(fullKey, language);
  };

  return { t, language };
};

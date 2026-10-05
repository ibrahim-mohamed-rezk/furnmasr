export type Language = 'en' | 'ar';

// Import translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

export const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export const getTranslation = (key: string, language: Language): string => {
  if (!key) {
    return "";
  }
  const keys = key.split('.');
  let translation: any = translations[language];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
  }
  
  return translation || key;
};

export const getDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
}; 
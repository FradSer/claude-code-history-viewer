import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enUI from './locales/en/ui.json';
import enCommon from './locales/en/common.json';
import enErrors from './locales/en/errors.json';

import koUI from './locales/ko/ui.json';
import koCommon from './locales/ko/common.json';
import koErrors from './locales/ko/errors.json';

import zhUI from './locales/zh/ui.json';
import zhCommon from './locales/zh/common.json';
import zhErrors from './locales/zh/errors.json';

// Define resources
const resources = {
  en: {
    ui: enUI,
    common: enCommon,
    errors: enErrors,
  },
  ko: {
    ui: koUI,
    common: koCommon,
    errors: koErrors,
  },
  zh: {
    ui: zhUI,
    common: zhCommon,
    errors: zhErrors,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    ns: ['ui', 'common', 'errors'],
    defaultNS: 'ui',
  });

export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";

/** Import Files */
import global_ar from "../src/locales/ar/global.json";
import global_en from "../src/locales/en/global.json";

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources: {
      ar: { global: global_ar },
      en: { global: global_en },
    },
    detection: {
      order: [
        "cookie",
        "htmlTag",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },
    fallbackLng: "ar",
  });

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("language");

i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: savedLanguage ? savedLanguage : "fr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

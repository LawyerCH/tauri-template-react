import { useEffect } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import zhCN from "@/locales/zh-CN.json";
import en from "@/locales/en.json";
import { readSettings, useSettings } from "@/lib/settings/store";

void i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": { translation: zhCN },
    en: { translation: en },
  },
  lng: readSettings().language,
  fallbackLng: "zh-CN",
  interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.language;

export function useLanguageEffect(): void {
  const language = useSettings((state) => state.language);
  const { i18n: instance } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language;
    if (instance.language === language) return;
    void instance.changeLanguage(language);
  }, [instance, language]);
}

export default i18n;

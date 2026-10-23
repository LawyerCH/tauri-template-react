import { useTranslation } from "react-i18next";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Section } from "@/components/ui/Section";
import { APP_VERSION, isTauri } from "@/lib/env";
import {
  LANGUAGES,
  THEME_MODES,
  useSettings,
  type Language,
  type ThemeMode,
} from "@/lib/settings/store";

const LANGUAGE_LABELS: Record<Language, string> = {
  "zh-CN": "简体中文",
  en: "English",
};

export function SettingsPage() {
  const { t } = useTranslation();
  const theme = useSettings((state) => state.theme);
  const language = useSettings((state) => state.language);
  const setTheme = useSettings((state) => state.setTheme);
  const setLanguage = useSettings((state) => state.setLanguage);

  const themeOptions = THEME_MODES.map((mode) => ({ value: mode, label: t(`settings.theme.${mode}`) }));
  const languageOptions = LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] }));

  return (
    <div className="space-y-7">
      <p className="max-w-[64ch] text-sm text-ink-2">{t("settings.subtitle")}</p>

      <Section title={t("settings.appearance")} hint={t("settings.appearanceHint")}>
        <RadioGroup<ThemeMode>
          name="theme"
          value={theme}
          options={themeOptions}
          onChange={setTheme}
        />
      </Section>

      <Section title={t("settings.language")} hint={t("settings.languageHint")}>
        <RadioGroup<Language>
          name="language"
          value={language}
          options={languageOptions}
          onChange={setLanguage}
        />
      </Section>

      <Section title={t("settings.about")} hint={t("settings.aboutHint")}>
        <dl className="grid grid-cols-[6.5rem_1fr] gap-y-2 text-sm">
          <dt className="text-ink-3">{t("common.version")}</dt>
          <dd className="tabular text-ink">v{APP_VERSION}</dd>
          <dt className="text-ink-3">{t("home.runtime")}</dt>
          <dd className="text-ink">
            {isTauri() ? t("home.runtimeDesktop") : t("home.runtimeBrowser")}
          </dd>
        </dl>
      </Section>
    </div>
  );
}

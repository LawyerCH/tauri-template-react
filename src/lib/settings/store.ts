import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type Language = "zh-CN" | "en";

export interface Settings {
  theme: ThemeMode;
  language: Language;
}

export const THEME_MODES = ["light", "dark", "system"] as const satisfies readonly ThemeMode[];
export const LANGUAGES = ["zh-CN", "en"] as const satisfies readonly Language[];

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  language: "zh-CN",
};

export const SETTINGS_VERSION = 1;
const STORAGE_KEY = "app.settings";

interface SettingsState extends Settings {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  reset: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEY,
      version: SETTINGS_VERSION,
      partialize: (state): Settings => ({ theme: state.theme, language: state.language }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<Settings>;
        return {
          ...current,
          theme: THEME_MODES.includes(stored.theme as ThemeMode)
            ? (stored.theme as ThemeMode)
            : DEFAULT_SETTINGS.theme,
          language: LANGUAGES.includes(stored.language as Language)
            ? (stored.language as Language)
            : DEFAULT_SETTINGS.language,
        };
      },
    },
  ),
);

export function readSettings(): Settings {
  const { theme, language } = useSettings.getState();
  return { theme, language };
}

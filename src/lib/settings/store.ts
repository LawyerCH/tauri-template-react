import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type Language = "zh-CN" | "en";

export interface Settings {
  theme: ThemeMode;
  language: Language;
  notifications: boolean;
  autoStart: boolean;
}

export const THEME_MODES = ["light", "dark", "system"] as const satisfies readonly ThemeMode[];
export const LANGUAGES = ["zh-CN", "en"] as const satisfies readonly Language[];

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  language: "zh-CN",
  notifications: false,
  autoStart: false,
};

export const SETTINGS_VERSION = 1;
const STORAGE_KEY = "app.settings";

interface SettingsState extends Settings {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setNotifications: (notifications: boolean) => void;
  setAutoStart: (autoStart: boolean) => void;
  reset: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotifications: (notifications) => set({ notifications }),
      setAutoStart: (autoStart) => set({ autoStart }),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEY,
      version: SETTINGS_VERSION,
      partialize: (state): Settings => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        autoStart: state.autoStart,
      }),
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
          notifications:
            typeof stored.notifications === "boolean"
              ? stored.notifications
              : DEFAULT_SETTINGS.notifications,
          autoStart: typeof stored.autoStart === "boolean" ? stored.autoStart : DEFAULT_SETTINGS.autoStart,
        };
      },
    },
  ),
);

export function readSettings(): Settings {
  const { theme, language, notifications, autoStart } = useSettings.getState();
  return { theme, language, notifications, autoStart };
}

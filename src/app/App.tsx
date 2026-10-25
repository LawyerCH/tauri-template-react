import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { isTauri } from "@/lib/env";
import { useLanguageEffect } from "@/lib/i18n";
import { ipc } from "@/lib/ipc";
import { useSettings } from "@/lib/settings/store";
import { useThemeEffect } from "@/lib/theme";

export function App() {
  useThemeEffect();
  useLanguageEffect();

  const language = useSettings((state) => state.language);

  useEffect(() => {
    if (!isTauri()) return;
    void ipc.setLocale(language).catch(() => {
      // 托盘还没建好时忽略，下次切换语言会重试
    });
  }, [language]);

  return <RouterProvider router={router} />;
}

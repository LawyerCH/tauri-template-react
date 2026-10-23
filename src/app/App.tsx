import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { useLanguageEffect } from "@/lib/i18n";
import { useThemeEffect } from "@/lib/theme";

export function App() {
  useThemeEffect();
  useLanguageEffect();

  return <RouterProvider router={router} />;
}

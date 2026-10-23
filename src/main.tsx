import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { applyTheme } from "@/lib/theme";
import { readSettings } from "@/lib/settings/store";
import "@/lib/i18n";
import "@/styles/index.css";

applyTheme(readSettings().theme);

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

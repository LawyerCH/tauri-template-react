import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// 静态站点：输出纯 HTML，React 组件按需注水（client:visible）
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://example.com",
  server: { port: 1421 },
});

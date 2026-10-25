import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "src-tauri", "node_modules", "**/.astro", "**/dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // registry 原始代码（Velora / shadcn）保留上游写法：
    // 不做 Fast Refresh 约束；上游带 @next/next 的 disable 注释，
    // 本项目没有该插件，注册成空规则避免 "Definition for rule not found"，
    // 同时关掉"多余 disable"报告，免得升级上游后满屏警告。
    files: ["packages/velora/src/**/*.{ts,tsx}"],
    linterOptions: { reportUnusedDisableDirectives: "off" },
    plugins: {
      "@next/next": { rules: { "no-img-element": { meta: { schema: [] }, create: () => ({}) } } },
    },
    rules: {
      "react-refresh/only-export-components": "off",
      "@next/next/no-img-element": "off",
    },
  },
);

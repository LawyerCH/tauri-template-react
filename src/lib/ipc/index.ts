import { invoke } from "@tauri-apps/api/core";
import type { Language } from "@/lib/settings/store";

/**
 * 所有 Rust 命令的唯一入口。组件不得直接 invoke，
 * 这样命令改名、参数调整只需要改一处。
 */
export const ipc = {
  setLocale: (lang: Language) => invoke<void>("set_locale", { lang }),
};

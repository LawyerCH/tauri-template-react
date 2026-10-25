import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { isTauri } from "@/lib/env";
import { readSettings } from "@/lib/settings/store";

export type NotifyResult = "sent" | "disabled" | "denied" | "unsupported" | "error";

/**
 * Tauri 2 的通知 API 在 WebView 里是同步的（`new window.Notification`），
 * 投递结果拿不到回调，所以这里只能保证「调用没有抛错」，不能保证横幅真的弹出。
 * 权限被拒时返回 denied，其余情况一律交给调用方提示用户去系统设置确认。
 */
export async function notify(title: string, body: string): Promise<NotifyResult> {
  if (!isTauri()) return "unsupported";
  if (!readSettings().notifications) return "disabled";

  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      granted = (await requestPermission()) === "granted";
    }
    if (!granted) return "denied";

    sendNotification({ title, body });
    return "sent";
  } catch {
    return "error";
  }
}

export async function notificationPermission(): Promise<"granted" | "denied" | "unknown"> {
  if (!isTauri()) return "unknown";
  try {
    return (await isPermissionGranted()) ? "granted" : "denied";
  } catch {
    return "unknown";
  }
}

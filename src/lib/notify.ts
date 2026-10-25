import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { isTauri } from "@/lib/env";
import { readSettings } from "@/lib/settings/store";

export type NotifyResult = "sent" | "disabled" | "denied" | "unsupported" | "error";

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

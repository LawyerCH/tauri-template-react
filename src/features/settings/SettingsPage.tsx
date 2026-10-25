import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEnabled as isAutoStartEnabled, enable, disable } from "@tauri-apps/plugin-autostart";
import { openUrl } from "@tauri-apps/plugin-opener";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { APP_VERSION, isTauri } from "@/lib/env";
import { notify, type NotifyResult } from "@/lib/notify";
import {
  LANGUAGES,
  THEME_MODES,
  useSettings,
  type Language,
  type ThemeMode,
} from "@/lib/settings/store";
import { cn } from "@template/velora/lib/utils";

const LANGUAGE_LABELS: Record<Language, string> = {
  "zh-CN": "简体中文",
  en: "English",
};

export function SettingsPage() {
  const { t } = useTranslation();
  const theme = useSettings((state) => state.theme);
  const language = useSettings((state) => state.language);
  const notifications = useSettings((state) => state.notifications);
  const autoStart = useSettings((state) => state.autoStart);
  const setTheme = useSettings((state) => state.setTheme);
  const setLanguage = useSettings((state) => state.setLanguage);
  const setNotifications = useSettings((state) => state.setNotifications);
  const setAutoStart = useSettings((state) => state.setAutoStart);

  const [notifyResult, setNotifyResult] = useState<NotifyResult | null>(null);
  const [autoStartNote, setAutoStartNote] = useState<{ kind: "ok" | "error"; text: string } | null>(
    null,
  );
  const desktop = isTauri();

  const themeOptions = THEME_MODES.map((mode) => ({ value: mode, label: t(`settings.theme.${mode}`) }));
  const languageOptions = LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] }));

  useEffect(() => {
    if (!desktop) return;
    let active = true;
    isAutoStartEnabled()
      .then((enabled) => {
        if (!active) return;
        setAutoStart(enabled);
        setAutoStartNote(enabled ? { kind: "ok", text: t("settings.autostartOn") } : null);
      })
      .catch((error: unknown) => {
        if (active) {
          setAutoStartNote({ kind: "error", text: `${t("settings.autoStartFailed")}: ${String(error)}` });
        }
      });
    return () => {
      active = false;
    };
  }, [desktop, setAutoStart, t]);

  async function handleAutoStartChange(next: boolean) {
    setAutoStart(next);
    setAutoStartNote({ kind: "ok", text: t(next ? "settings.autostartOn" : "settings.autostartOff") });
    try {
      await (next ? enable() : disable());
      setAutoStart(await isAutoStartEnabled());
    } catch (error) {
      setAutoStart(!next);
      setAutoStartNote({ kind: "error", text: `${t("settings.autoStartFailed")}: ${String(error)}` });
    }
  }

  async function handleTestNotification() {
    const result = await notify(t("settings.notifyTitle"), t("settings.notifyBody"));
    setNotifyResult(result);
  }

  const openSystemNotificationSettings = () => {
    void openUrl("x-apple.systempreferences:com.apple.Notifications-Settings.extension").catch(() => {
      void openUrl("x-apple.systempreferences:com.apple.preference.notifications").catch(() => {});
    });
  };

  const notifyMessage =
    notifyResult === "sent"
      ? t("settings.notifyOk")
      : notifyResult === "disabled"
        ? t("settings.notifyDisabled")
        : notifyResult === "denied"
          ? t("settings.notifyDenied")
          : notifyResult === "unsupported"
            ? t("settings.notifyUnsupported")
            : notifyResult === "error"
              ? t("settings.notifyError")
              : null;

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border bg-card p-6">
        <p className="text-sm font-medium">{t("settings.appearance")}</p>
        <div className="mt-3">
          <RadioGroup<ThemeMode> name="theme" value={theme} options={themeOptions} onChange={setTheme} />
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <p className="text-sm font-medium">{t("settings.language")}</p>
        <div className="mt-3">
          <RadioGroup<Language>
            name="language"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
        </div>
      </section>

      <section className="divide-y rounded-2xl border bg-card p-6">
        <div className="flex items-start justify-between gap-6 pb-5">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("settings.notifications")}</p>
            {notifyMessage && (
              <p className="mt-2 text-xs text-brand-via" role="status" aria-live="polite">
                {notifyMessage}
                {(notifyResult === "sent" || notifyResult === "denied") && (
                  <button
                    type="button"
                    onClick={openSystemNotificationSettings}
                    className="ml-2 cursor-pointer text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    {t("settings.openNotifySettings")}
                  </button>
                )}
              </p>
            )}
            {notifyResult === "sent" && (
              <p className="mt-1 text-xs text-muted-foreground">{t("settings.notifyHint")}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button size="sm" disabled={!desktop || !notifications} onClick={handleTestNotification}>
              {t("settings.testNotification")}
            </Button>
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label={t("settings.notifications")}
              disabled={!desktop}
            />
          </div>
        </div>

        <div className="flex items-start justify-between gap-6 py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("settings.autoStart")}</p>
            {autoStartNote && (
              <p
                className={`mt-2 text-xs ${autoStartNote.kind === "ok" ? "text-brand-via" : "text-destructive"}`}
                role="status"
                aria-live="polite"
              >
                {autoStartNote.text}
              </p>
            )}
          </div>
          <Toggle
            checked={autoStart}
            onChange={handleAutoStartChange}
            label={t("settings.autoStart")}
            disabled={!desktop}
          />
        </div>

        {!desktop && (
          <p className="pt-5 text-xs text-muted-foreground">{t("settings.desktopOnly")}</p>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <dl className="space-y-3 text-sm">
          <Row label={t("common.version")} value={`v${APP_VERSION}`} mono />
          <Row
            label={t("home.runtime")}
            value={desktop ? t("home.runtimeDesktop") : t("home.runtimeBrowser")}
          />
          <Row label={t("settings.aboutUi")} value="Velora UI · Tailwind 4 · Motion" />
        </dl>
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2.5 last:border-none last:pb-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("truncate text-xs", mono && "font-mono tabular-nums")}>{value}</dd>
    </div>
  );
}

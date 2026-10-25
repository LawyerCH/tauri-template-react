import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { NAV_ITEMS, DEFAULT_NAV_ITEM } from "@/app/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/velora/animated-sidebar";
import { APP_VERSION, isTauri } from "@/lib/env";
import { useSettings } from "@/lib/settings/store";
import { cn } from "@/lib/utils";

const PINNED_KEY = "app.sidebar.pinned";

function readPinned(): boolean {
  try {
    return localStorage.getItem(PINNED_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppShell() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = NAV_ITEMS.find((item) => item.to === pathname) ?? DEFAULT_NAV_ITEM;

  const theme = useSettings((state) => state.theme);
  const setTheme = useSettings((state) => state.setTheme);
  const prefersDark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (!isTauri()) return;

    let disposed = false;
    let unlisten: (() => void) | undefined;

    void listen<string>("navigate", (event) => {
      if (event.payload) navigate(event.payload);
    })
      .then((stop) => {
        if (disposed) stop();
        else unlisten = stop;
      })
      .catch(() => {
        // 托盘事件不可用时静默忽略，不影响页面内导航
      });

    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [navigate]);

  return (
    <Sidebar className="h-full bg-background" defaultPinned={readPinned()} onPinnedChange={(next) => {
      try {
        localStorage.setItem(PINNED_KEY, next ? "1" : "0");
      } catch {
        // 隐私模式下写入失败不影响使用
      }
    }}>
      <SidebarBody
        label={t("nav.label")}
        logo={<BrandMark />}
        title={<span className="text-sm font-medium tracking-tight">{t("app.name")}</span>}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarLink
              key={item.to}
              href={`#${item.to}`}
              icon={<Icon size={18} strokeWidth={1.75} />}
              label={t(item.labelKey)}
              active={item.to === active.to}
            />
          );
        })}
      </SidebarBody>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/70 px-5 backdrop-blur-md">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{t("app.name")}</span>
            <span className="hidden text-xs text-muted-foreground/50 sm:inline">/</span>
            <h1 className="truncate text-sm font-medium tracking-tight">{t(active.labelKey)}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="tabular hidden text-[11px] text-muted-foreground sm:inline">v{APP_VERSION}</span>
            <button
              type="button"
              aria-label={t("common.toggleTheme")}
              title={t("common.toggleTheme")}
              onClick={() => setTheme(prefersDark ? "light" : "dark")}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {prefersDark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-5 py-7 md:px-8 md:py-9">
            <Outlet />
          </div>
        </main>
      </div>
    </Sidebar>
  );
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 place-items-center rounded-lg",
        "bg-[linear-gradient(135deg,var(--brand-from),var(--brand-via),var(--brand-to))]",
        "text-[13px] font-medium text-brand-foreground shadow-sm shadow-brand-via/30",
      )}
    >
      T
    </span>
  );
}

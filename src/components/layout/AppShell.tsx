import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS, DEFAULT_NAV_ITEM } from "@/app/navigation";
import { APP_VERSION } from "@/lib/env";
import { cn } from "@/lib/cn";

export function AppShell() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = NAV_ITEMS.find((item) => item.to === pathname) ?? DEFAULT_NAV_ITEM;

  return (
    <div className="flex h-full">
      <aside className="flex w-14 shrink-0 flex-col border-r border-line bg-paper md:w-56">
        <div className="flex h-14 flex-col justify-center px-3 md:px-5">
          <span className="hidden font-serif text-base text-ink md:block">{t("app.name")}</span>
          <span className="hidden text-[11px] leading-tight text-ink-3 md:block">
            {t("app.tagline")}
          </span>
          <span className="font-serif text-base text-ink md:hidden">{t("app.name").slice(0, 1)}</span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                title={t(item.labelKey)}
                className={({ isActive }) =>
                  cn(
                    "flex h-9 items-center gap-2 rounded-sm border-l-2 px-2 text-sm transition-colors md:px-3",
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-2 hover:text-ink",
                  )
                }
              >
                <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                <span className="hidden truncate md:inline">{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-line px-2 py-3 md:px-5">
          <span className="tabular hidden text-[11px] text-ink-3 md:block">
            v{APP_VERSION}
          </span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-accent px-6 md:px-8">
          <h1 className="text-sm font-medium text-ink">{t(active.labelKey)}</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

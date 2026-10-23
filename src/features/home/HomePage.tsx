import { useTranslation } from "react-i18next";
import { APP_VERSION, isTauri } from "@/lib/env";

export function HomePage() {
  const { t } = useTranslation();

  const facts: { label: string; value: string }[] = [
    {
      label: t("home.runtime"),
      value: isTauri() ? t("home.runtimeDesktop") : t("home.runtimeBrowser"),
    },
    { label: t("common.version"), value: `v${APP_VERSION}` },
    { label: t("home.stack"), value: "Tauri 2 · React 19 · Vite 8 · Tailwind 4" },
  ];

  const nextItems = [t("home.nextItems.system"), t("home.nextItems.update"), t("home.nextItems.job")];

  return (
    <div className="space-y-7">
      <p className="max-w-[64ch] text-sm text-ink-2">{t("home.subtitle")}</p>

      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-3 text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="contents">
            <dt className="text-ink-3">{fact.label}</dt>
            <dd className={fact.label === t("common.version") ? "tabular text-ink" : "text-ink"}>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="border-t border-line pt-5">
        <h2 className="mb-3 text-base text-ink">{t("home.next")}</h2>
        <ul className="space-y-2">
          {nextItems.map((item) => (
            <li key={item} className="flex items-baseline gap-2 text-sm text-ink-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-3" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

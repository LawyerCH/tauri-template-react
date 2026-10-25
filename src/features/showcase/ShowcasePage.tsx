import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BoxesIcon, LayoutTemplateIcon, PuzzleIcon } from "lucide-react";
import { AnimatedTabs } from "@template/velora/velora/animated-tabs";
import { cn } from "@template/velora/lib/utils";
import { BLOCK_GROUPS, COMPONENT_GROUPS, TEMPLATES } from "./catalog";
import { PREVIEWS } from "./previews";

export function ShowcasePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <p className="max-w-[64ch] text-sm text-muted-foreground">{t("showcase.subtitle")}</p>

      <AnimatedTabs
        peek={0}
        tabs={[
          {
            value: "components",
            title: (
              <span className="inline-flex items-center gap-1.5">
                <PuzzleIcon className="size-3.5" aria-hidden />
                {t("showcase.tabs.components")}
              </span>
            ),
            content: <ComponentsPanel />,
          },
          {
            value: "blocks",
            title: (
              <span className="inline-flex items-center gap-1.5">
                <BoxesIcon className="size-3.5" aria-hidden />
                {t("showcase.tabs.blocks")}
              </span>
            ),
            content: <BlocksPanel />,
          },
          {
            value: "templates",
            title: (
              <span className="inline-flex items-center gap-1.5">
                <LayoutTemplateIcon className="size-3.5" aria-hidden />
                {t("showcase.tabs.templates")}
              </span>
            ),
            content: <TemplatesPanel />,
          },
        ]}
      />
    </div>
  );
}

function ComponentsPanel() {
  const { t } = useTranslation();
  const total = COMPONENT_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">{t("showcase.componentsHint", { count: total })}</p>

      {COMPONENT_GROUPS.map((group) => (
        <section key={group.id}>
          <GroupHeading title={t(`showcase.groups.${group.id}`)} count={group.items.length} />
          <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => {
              const render = item.preview ? PREVIEWS[item.name] : undefined;
              return (
                <li
                  key={item.name}
                  className="overflow-hidden rounded-xl border bg-card transition-colors hover:border-brand-via/40"
                >
                  <div className="h-20 border-b bg-muted/30">
                    {render ? (
                      render()
                    ) : (
                      <div className="grid size-full place-items-center text-[11px] text-muted-foreground">
                        {item.label}
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-2 px-2.5 py-2">
                    <span className="truncate text-xs font-medium">{item.label}</span>
                    <code className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {item.name}
                    </code>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BlocksPanel() {
  const { t } = useTranslation();
  const total = BLOCK_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">{t("showcase.blocksHint", { count: total })}</p>

      {BLOCK_GROUPS.map((group) => (
        <section key={group.id}>
          <GroupHeading
            title={t(`showcase.blockGroups.${group.id}`)}
            count={group.items.length}
          />
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between gap-2 rounded-lg border bg-card px-2.5 py-2"
              >
                <code className="truncate font-mono text-[11px]">{name}</code>
                <span className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {group.id}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function TemplatesPanel() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t("showcase.templatesHint")}</p>

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {TEMPLATES.map((item) => {
          const body = (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium">
                  {t(`showcase.pages.${item.name}.label`)}
                </span>
                {item.to && (
                  <span className="shrink-0 text-[11px] text-brand-via">
                    {t("showcase.open")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-pretty text-muted-foreground">
                {t(`showcase.pages.${item.name}.description`)}
              </p>
            </>
          );

          return (
            <li key={item.name}>
              {item.to ? (
                <Link
                  to={item.to}
                  className="block rounded-xl border bg-card p-3 transition-colors hover:border-brand-via/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {body}
                </Link>
              ) : (
                <div className="rounded-xl border bg-card p-3">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GroupHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 flex items-baseline gap-2 border-b pb-1.5">
      <h2 className="text-xs font-medium">{title}</h2>
      <span className={cn("font-mono text-[10px] text-muted-foreground tabular-nums")}>
        {count}
      </span>
    </div>
  );
}

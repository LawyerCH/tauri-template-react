import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BoxesIcon, LayoutTemplateIcon, PuzzleIcon } from "lucide-react";
import { AnimatedTabs } from "@template/velora/velora/animated-tabs";
import { BLOCK_GROUPS, COMPONENT_GROUPS, TEMPLATES, type ShowcaseItem } from "./catalog";
import { PREVIEWS } from "./previews";

/**
 * 组件目录页。内容区不加卡片外壳：外层已有 AppShell 的 5xl 容器与留白，
 * 再套一层卡片会出现「卡片套卡片」，并把内边距压到贴边。
 *
 * 间距只用五档：组间 32 / 组内 16 / 卡片间 12 / 卡内 8 / 名称与 slug 4。
 */
export function ShowcasePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <p className="max-w-[60ch] text-sm text-muted-foreground">{t("showcase.subtitle")}</p>

      <AnimatedTabs
        peek={0}
        panelClassName="border-0 bg-transparent p-0 shadow-none"
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
      <p className="text-xs text-muted-foreground">
        {t("showcase.componentsHint", { count: total })}
      </p>

      {COMPONENT_GROUPS.map((group) => {
        const previews = group.items.filter((item) => item.preview && PREVIEWS[item.name]);
        const rest = group.items.filter((item) => !previews.includes(item));

        return (
          <section key={group.id} className="space-y-4">
            <GroupHeading title={t(`showcase.groups.${group.id}`)} count={group.items.length} />

            {previews.length > 0 && (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {previews.map((item) => (
                  <li key={item.name} className="min-w-0">
                    <PreviewCard item={item} />
                  </li>
                ))}
              </ul>
            )}

            {rest.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {rest.map((item) => (
                  <li
                    key={item.name}
                    className="flex min-w-0 items-baseline gap-1.5 rounded-md border bg-card px-2.5 py-1.5"
                  >
                    <span className="truncate text-xs">{item.label}</span>
                    <code className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {item.name}
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PreviewCard({ item }: { item: ShowcaseItem }) {
  const render = PREVIEWS[item.name];
  if (!render) return null;

  return (
    <figure className="overflow-hidden rounded-lg border bg-card">
      <div className="h-24 overflow-hidden border-b bg-muted/20">{render()}</div>
      <figcaption className="space-y-0.5 px-3 py-2">
        <p className="truncate text-xs font-medium">{item.label}</p>
        <code className="block truncate font-mono text-[11px] text-muted-foreground">
          {item.name}
        </code>
      </figcaption>
    </figure>
  );
}

function BlocksPanel() {
  const { t } = useTranslation();
  const total = BLOCK_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">{t("showcase.blocksHint", { count: total })}</p>
      {BLOCK_GROUPS.map((group) => (
        <section key={group.id} className="space-y-4">
          <GroupHeading
            title={t(`showcase.blockGroups.${group.id}`)}
            count={group.items.length}
          />

          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((name) => (
              <li key={name} className="min-w-0 rounded-md border bg-card px-2.5 py-1.5">
                <code className="block truncate font-mono text-xs">{name}</code>
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
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">{t("showcase.templatesHint")}</p>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEMPLATES.map((item) => {
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">
                  {t(`showcase.pages.${item.name}.label`)}
                </span>
                {item.to && (
                  <span className="shrink-0 text-[11px] text-brand-via">{t("showcase.open")}</span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-pretty text-muted-foreground">
                {t(`showcase.pages.${item.name}.description`)}
              </p>
            </>
          );

          return (
            <li key={item.name} className="min-w-0">
              {item.to ? (
                <Link
                  to={item.to}
                  className="block rounded-lg border bg-card p-4 transition-colors hover:border-brand-via/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {body}
                </Link>
              ) : (
                <div className="rounded-lg border bg-card p-4">{body}</div>
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
    <div className="flex items-baseline justify-between gap-3 border-b pb-2">
      <h2 className="text-[13px] font-medium">{title}</h2>
      <span className="tabular font-mono text-[11px] text-muted-foreground">{count}</span>
    </div>
  );
}

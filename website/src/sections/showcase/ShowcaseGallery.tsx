import { BoxesIcon, LayoutTemplateIcon, PuzzleIcon } from "lucide-react";

import { AnimatedTabs } from "@template/velora/velora/animated-tabs";
import { BLOCK_GROUPS, COMPONENT_GROUPS, TEMPLATES } from "./catalog";
import { PREVIEWS } from "./previews";

/**
 * 三类目录共用一个标签组件。
 * 非激活标签页的内容不会被渲染，因此其中的预览实例也不会挂载。
 */
export function ShowcaseGallery() {
  return (
    <AnimatedTabs
      peek={0}
      tabs={[
        {
          value: "components",
          title: (
            <span className="inline-flex items-center gap-1.5">
              <PuzzleIcon className="size-3.5" aria-hidden />
              组件
            </span>
          ),
          content: <ComponentsPanel />,
        },
        {
          value: "blocks",
          title: (
            <span className="inline-flex items-center gap-1.5">
              <BoxesIcon className="size-3.5" aria-hidden />
              模块
            </span>
          ),
          content: <BlocksPanel />,
        },
        {
          value: "templates",
          title: (
            <span className="inline-flex items-center gap-1.5">
              <LayoutTemplateIcon className="size-3.5" aria-hidden />
              模板
            </span>
          ),
          content: <TemplatesPanel />,
        },
      ]}
    />
  );
}

function ComponentsPanel() {
  const total = COMPONENT_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        精选 {total} 个组件，按功能分组。共享包里另有更多未列出。
      </p>

      {COMPONENT_GROUPS.map((group) => (
        <section key={group.id}>
          <GroupHeading title={group.title} count={group.items.length} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => {
              const render = item.preview ? PREVIEWS[item.name] : undefined;
              return (
                <li
                  key={item.name}
                  className="overflow-hidden rounded-xl border bg-card transition-colors hover:border-brand-via/40"
                >
                  <div className="h-24 border-b bg-muted/30">
                    {render ? render() : <NoPreview label={item.label} />}
                  </div>
                  <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                    <span className="truncate text-sm font-medium">{item.label}</span>
                    <code className="shrink-0 font-mono text-[11px] text-muted-foreground">
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
  const total = BLOCK_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        共 {total} 个成品区块。用 <code className="font-mono text-xs">pnpm velora add &lt;name&gt;</code>{" "}
        拉取，会自动带上它依赖的组件。
      </p>

      {BLOCK_GROUPS.map((group) => (
        <section key={group.id}>
          <GroupHeading title={group.title} count={group.items.length} />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
              >
                <code className="truncate font-mono text-xs">{name}</code>
                <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
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
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        已实际组装的页面。官网页面可直接打开，桌面端页面在应用内查看。
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map((item) => {
          const body = (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{item.label}</span>
                {item.href ? (
                  <span className="shrink-0 text-xs text-brand-via">打开 →</span>
                ) : (
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                    应用内页面
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-pretty text-muted-foreground">{item.description}</p>
            </>
          );

          return (
            <li key={item.name}>
              {item.href ? (
                <a
                  href={item.href}
                  className="block rounded-xl border bg-card p-4 transition-colors hover:border-brand-via/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {body}
                </a>
              ) : (
                <div className="rounded-xl border bg-card p-4">{body}</div>
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
    <div className="mb-4 flex items-baseline gap-2 border-b pb-2">
      <h2 className="text-sm font-medium">{title}</h2>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{count}</span>
    </div>
  );
}

function NoPreview({ label }: { label: string }) {
  return (
    <div className="grid size-full place-items-center text-[11px] text-muted-foreground">
      {label} · 无预览
    </div>
  );
}

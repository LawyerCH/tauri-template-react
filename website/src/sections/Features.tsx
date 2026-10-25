import {
  LanguagesIcon,
  MonitorSmartphoneIcon,
  MoonStarIcon,
  RocketIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from "lucide-react";

import { BlurFade } from "@template/velora/velora/blur-fade";
import { SpotlightCard } from "@template/velora/velora/spotlight-card";

const FEATURES = [
  {
    icon: RocketIcon,
    title: "桌面能力已接好",
    description: "托盘、单实例、系统通知、开机自启都由 Rust 侧实现，前端直接调用。",
  },
  {
    icon: LanguagesIcon,
    title: "中英双语",
    description: "文案集中在 locales，改一处两边同步；语言偏好随设置持久化。",
  },
  {
    icon: MoonStarIcon,
    title: "双主题",
    description: "浅色 / 深色 / 跟随系统，令牌驱动，组件不需要改源码。",
  },
  {
    icon: ShieldCheckIcon,
    title: "一条命令验收",
    description: "pnpm check 跑完 typecheck、lint、test；Rust 侧另有 check:rust。",
  },
  {
    icon: TerminalIcon,
    title: "按需取组件",
    description: "pnpm velora add <name> 自动拉取并改写导入路径。",
  },
  {
    icon: MonitorSmartphoneIcon,
    title: "桌面与官网同源",
    description: "组件放在 workspace 包里，桌面应用与官网站点共用一份。",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <BlurFade>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">能力清单</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              该接的都接好了，你只写业务
            </h2>
          </div>
        </BlurFade>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <BlurFade key={title} delay={index * 0.05}>
              <SpotlightCard className="h-full rounded-2xl border bg-card p-6">
                <Icon className="size-5 text-primary" strokeWidth={1.75} />
                <h3 className="mt-4 text-sm font-medium">{title}</h3>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{description}</p>
              </SpotlightCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

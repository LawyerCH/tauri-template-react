import { ArrowRightIcon } from "lucide-react";

import { BlurFade } from "@template/velora/velora/blur-fade";
import { Terminal } from "@template/velora/velora/terminal";

const COMMANDS = [
  ["pnpm install", "装依赖"],
  ["pnpm tauri dev", "起桌面应用"],
  ["pnpm website:dev", "起官网站点"],
];

export function QuickStart() {
  return (
    <section id="quick-start" className="border-y bg-muted/30 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <BlurFade>
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              三条命令就能跑起来
            </h2>
            <p className="mt-4 text-base text-pretty text-muted-foreground">
              依赖用 pnpm 锁定，运行时由 mise 管理。桌面端与官网站点是同一个 workspace，
              组件改一次两边同时生效。
            </p>

            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {COMMANDS.map(([command, label]) => (
                <li key={command} className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <code className="font-mono text-foreground">{command}</code>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <Terminal
            title="quick-start.sh"
            lines={[
              "$ pnpm install",
              "$ pnpm tauri dev",
              "  VITE ready in 240 ms",
              "$ pnpm website:dev",
              "  Local: http://localhost:1421/",
            ]}
          />
        </BlurFade>
      </div>
    </section>
  );
}

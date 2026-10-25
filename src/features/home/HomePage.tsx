import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BellRing, Boxes, Power, RefreshCw, Settings2, Terminal as TerminalIcon } from "lucide-react";
import { AnimatedGradientText } from "@template/velora/velora/animated-gradient-text";
import { AuroraBackground } from "@template/velora/velora/aurora-background";
import { BlurFade } from "@template/velora/velora/blur-fade";
import { GridPattern } from "@template/velora/velora/grid-pattern";
import { Marquee } from "@template/velora/velora/marquee";
import { MovingBorder } from "@template/velora/velora/moving-border";
import { NumberTicker } from "@template/velora/velora/number-ticker";
import { ShimmerButton } from "@template/velora/velora/shimmer-button";
import { SpotlightCard } from "@template/velora/velora/spotlight-card";
import { Terminal } from "@template/velora/velora/terminal";
import { TextShimmer } from "@template/velora/velora/text-shimmer";
import { APP_VERSION, isTauri } from "@/lib/env";
import { cn } from "@template/velora/lib/utils";

const STACK = [
  "Tauri 2",
  "React 19",
  "Vite 8",
  "Tailwind 4",
  "Motion",
  "shadcn registry",
  "TypeScript",
  "zustand",
  "i18next",
  "Vitest",
];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const desktop = isTauri();

  const stats = [
    { value: 17, label: t("home.stats.components") },
    { value: 4, label: t("home.stats.integrations") },
    { value: 3, label: t("home.stats.pages") },
  ];

  const capabilities = [
    { icon: Boxes, title: t("home.capabilities.tray"), hint: t("home.capabilities.trayHint") },
    { icon: BellRing, title: t("home.capabilities.notify"), hint: t("home.capabilities.notifyHint") },
    { icon: Power, title: t("home.capabilities.autostart"), hint: t("home.capabilities.autostartHint") },
    {
      icon: RefreshCw,
      title: t("home.capabilities.update"),
      hint: t("home.capabilities.updateHint"),
      pending: true,
    },
  ];

  const terminalLines = [
    "$ pnpm tauri dev",
    "  VITE v8.3.5  ready in 214 ms",
    "  ➜  Local:   http://localhost:1420/",
    "  Running `target/debug/tauri-template-react`",
    "[INFO] app started, tray ready",
  ];

  return (
    <div className="space-y-9">
      <section className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-11 md:px-10 md:py-14">
        <AuroraBackground
          intensity="vivid"
          className="opacity-45 [mask-image:radial-gradient(85%_75%_at_62%_-5%,black,transparent)] dark:opacity-60"
        />
        <GridPattern
          width={48}
          height={48}
          className="opacity-60 [mask-image:radial-gradient(460px_circle_at_30%_10%,black,transparent)]"
        />

        <div className="relative">
          <TextShimmer className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] tracking-wide backdrop-blur">
            {t("home.hero.badge")}
          </TextShimmer>

          <h1 className="mt-6 max-w-[24ch] text-[28px] leading-[1.15] font-medium tracking-tight md:text-[38px]">
            {t("home.hero.titleLine1")}
            <br />
            <AnimatedGradientText>{t("home.hero.titleLine2")}</AnimatedGradientText>
          </h1>

          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ShimmerButton className="h-10 px-6 text-[13px]" onClick={() => navigate("/tasks")}>
              {t("home.hero.ctaPrimary")}
              <ArrowRight size={15} strokeWidth={1.75} />
            </ShimmerButton>
            <MovingBorder
              className="h-10"
              radius={10}
              onClick={() => navigate("/settings")}
            >
              <span className="inline-flex items-center gap-2">
                <Settings2 size={15} strokeWidth={1.75} />
                {t("home.hero.ctaSecondary")}
              </span>
            </MovingBorder>
          </div>

          <dl className="mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-mono text-2xl tracking-tight tabular-nums">
                  <NumberTicker value={stat.value} />
                </dd>
                <dt className="mt-1 text-[11px] text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <BlurFade>
          <div className="flex items-center gap-2 pb-3 text-xs text-muted-foreground">
            <TerminalIcon size={14} strokeWidth={1.75} />
            {t("home.terminalLabel")}
          </div>
          <Terminal lines={terminalLines} title="tauri-template-react" speed={12} />
        </BlurFade>

        <BlurFade delay={0.08}>
          <div className="h-full rounded-2xl border bg-card p-5">
            <h2 className="text-sm font-medium">{t("home.facts.title")}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Fact label={t("home.runtime")} value={desktop ? t("home.runtimeDesktop") : t("home.runtimeBrowser")} />
              <Fact label={t("common.version")} value={`v${APP_VERSION}`} mono />
              <Fact label={t("home.stack")} value="Tauri 2 · React 19 · Vite 8" />
              <Fact label={t("home.ui")} value="Velora UI · Tailwind 4 · Motion" />
            </dl>
          </div>
        </BlurFade>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium">{t("home.capabilities.title")}</h2>
          <p className="text-xs text-muted-foreground">{t("home.capabilities.hint")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <BlurFade key={item.title} delay={0.05 * index}>
                <SpotlightCard className="h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-xl border bg-background/60 text-brand-via">
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    {item.pending && (
                      <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                        {t("home.capabilities.planned")}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
                </SpotlightCard>
              </BlurFade>
            );
          })}
        </div>
      </section>

      <section>
        <p className="mb-3 text-[11px] tracking-widest text-muted-foreground uppercase">
          {t("home.marqueeLabel")}
        </p>
        <Marquee className="[--duration:34s] [--gap:0.75rem]" pauseOnHover>
          {STACK.map((item) => (
            <span
              key={item}
              className={cn(
                "rounded-full border bg-card px-3 py-1 text-xs whitespace-nowrap text-muted-foreground",
                "transition-colors hover:text-foreground",
              )}
            >
              {item}
            </span>
          ))}
        </Marquee>
      </section>
    </div>
  );
}

function Fact({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2.5 last:border-none last:pb-0">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("min-w-0 truncate text-right text-xs", mono ? "font-mono tabular-nums" : "text-foreground")}>
        {value}
      </dd>
    </div>
  );
}

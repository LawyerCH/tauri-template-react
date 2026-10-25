import type { ReactElement } from "react";

import { AuroraBackground } from "@template/velora/velora/aurora-background";
import { DotPattern } from "@template/velora/velora/grid-pattern";
import { Ripple } from "@template/velora/velora/ripple";
import { AnimatedGradientText } from "@template/velora/velora/animated-gradient-text";
import { TextShimmer } from "@template/velora/velora/text-shimmer";
import { FlipWords } from "@template/velora/velora/flip-words";
import { NumberTicker } from "@template/velora/velora/number-ticker";
import { ShimmerButton } from "@template/velora/velora/shimmer-button";
import { MovingBorder } from "@template/velora/velora/moving-border";
import { SpotlightCard } from "@template/velora/velora/spotlight-card";
import { AvatarCircles } from "@template/velora/velora/avatar-circles";
import { Marquee } from "@template/velora/velora/marquee";
import { DotsLoader } from "@template/velora/velora/loaders";
import { BlurFade } from "@template/velora/velora/blur-fade";
import { BorderBeam } from "@template/velora/velora/border-beam";
import { Terminal } from "@template/velora/velora/terminal";

/**
 * 预览实例：参数取最小可用值，容器统一 96px 高。
 * 重型组件（globe / world-map / macbook-scroll 等）不放预览，
 * 它们的 canvas 与滚动逻辑会让网格卡住。
 */
export const PREVIEWS: Record<string, () => ReactElement> = {
  "aurora-background": () => (
    <div className="relative size-full overflow-hidden rounded-lg">
      <AuroraBackground intensity="medium" />
    </div>
  ),

  "grid-pattern": () => (
    <div className="relative size-full overflow-hidden rounded-lg">
      <DotPattern className="size-full fill-foreground/25" />
    </div>
  ),

  ripple: () => (
    <div className="grid size-full place-items-center">
      <Ripple className="size-16" />
    </div>
  ),

  "animated-gradient-text": () => (
    <div className="grid size-full place-items-center text-lg font-medium">
      <AnimatedGradientText>Ship faster</AnimatedGradientText>
    </div>
  ),

  "text-shimmer": () => (
    <div className="grid size-full place-items-center">
      <TextShimmer className="text-sm">Thinking…</TextShimmer>
    </div>
  ),

  "flip-words": () => (
    <div className="grid size-full place-items-center text-sm">
      <span className="text-muted-foreground">
        面向 <FlipWords words={["桌面", "官网", "团队"]} />
      </span>
    </div>
  ),

  "number-ticker": () => (
    <div className="grid size-full place-items-center text-2xl font-medium tabular-nums">
      <NumberTicker value={128} suffix="+" />
    </div>
  ),

  "shimmer-button": () => (
    <div className="grid size-full place-items-center">
      <ShimmerButton>Start</ShimmerButton>
    </div>
  ),

  "moving-border": () => (
    <div className="grid size-full place-items-center">
      <MovingBorder className="px-4 py-1.5 text-xs">Moving border</MovingBorder>
    </div>
  ),

  "spotlight-card": () => (
    <SpotlightCard className="grid size-full place-items-center rounded-lg border bg-card text-xs text-muted-foreground">
      移动指针看光斑
    </SpotlightCard>
  ),

  "avatar-circles": () => (
    <div className="grid size-full place-items-center">
      <AvatarCircles people={["Nora", "Luis", "Amara"]} />
    </div>
  ),

  marquee: () => (
    <div className="grid size-full place-items-center overflow-hidden">
      <Marquee className="[--duration:18s]">
        {["React", "Tauri", "Astro"].map((item) => (
          <span key={item} className="mx-3 text-xs whitespace-nowrap text-muted-foreground">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  ),

  loaders: () => (
    <div className="grid size-full place-items-center">
      <DotsLoader size="md" />
    </div>
  ),

  "blur-fade": () => (
    <div className="grid size-full place-items-center text-xs text-muted-foreground">
      <BlurFade>淡入 + 模糊</BlurFade>
    </div>
  ),

  "border-beam": () => (
    <div className="relative grid size-full place-items-center rounded-lg border bg-card text-xs text-muted-foreground">
      边框光束
      <BorderBeam size={60} duration={6} />
    </div>
  ),

  terminal: () => (
    <div className="size-full overflow-hidden rounded-lg">
      <Terminal
        title="demo"
        speed={40}
        lines={["$ pnpm dev", "  ready in 240 ms"]}
        className="h-full text-[10px]"
      />
    </div>
  ),
};

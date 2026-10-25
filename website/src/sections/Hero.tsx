import { ArrowRightIcon, BellIcon } from "lucide-react";

import { Button } from "@template/velora/ui/button";
import { AnimatedGradientText } from "@template/velora/velora/animated-gradient-text";
import { AuroraBackground } from "@template/velora/velora/aurora-background";
import { BlurFade } from "@template/velora/velora/blur-fade";
import { DotPattern } from "@template/velora/velora/grid-pattern";
import { SparklesText } from "@template/velora/velora/sparkles-text";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <AuroraBackground intensity="medium" />
      <DotPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full fill-foreground/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <BlurFade>
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
            <BellIcon className="size-4 text-primary" />
            Tauri 2 · React 19 · Tailwind 4
          </span>
        </BlurFade>

        <h1 className="mt-8 text-4xl font-medium tracking-tight text-balance sm:text-6xl">
          <SparklesText>开箱即可开工</SparklesText>
          <br />
          的桌面应用模板
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
          删掉 <AnimatedGradientText>src/features/</AnimatedGradientText> 下的示例页就能开始写业务，
          而技术债在模板阶段就被挡在外面。
        </p>

        <BlurFade delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-11 rounded-full px-6" asChild>
              <a href="#quick-start">
                开始使用 <ArrowRightIcon />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-11 rounded-full px-6" asChild>
              <a href="#features">看看有什么</a>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

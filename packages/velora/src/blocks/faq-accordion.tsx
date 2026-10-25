import { MessageCircleIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { AvatarCircles } from "../velora/avatar-circles";
import { BlurFade } from "../velora/blur-fade";
import { DotPattern } from "../velora/grid-pattern";

const FAQS = [
  {
    question: "这个模板能直接拿去写业务吗？",
    answer:
      "可以。删掉 src/features/ 下的示例页，改掉导航表与路由，剩下的代码就是你项目的基础。托盘、通知、开机自启、多语言与主题都已经接好，不需要重新搭一遍。",
  },
  {
    question: "为什么组件放在 packages/velora 而不是 src/？",
    answer:
      "因为桌面应用与官网站点要共用同一份组件。放在 workspace 包里改一次两边生效；如果各自拷一份，升级时会逐渐漂移。",
  },
  {
    question: "怎么再加一个 Velora 组件或区块？",
    answer:
      "跑 pnpm velora add <name>。脚本会从 registry 拉条目、递归展开它依赖的组件、把 @/ 别名改写成包内相对路径，并把需要的 keyframes 与动画变量合并进样式表。",
  },
  {
    question: "跟着上游升级会不会覆盖我的改动？",
    answer:
      "默认不会。脚本遇到已存在的文件只提示、不覆盖；确实要拉上游最新版时用 --force。对组件做过的改动记在 docs/tech-notes.md，升级后按记录补回。",
  },
  {
    question: "深色模式为什么改了写法？",
    answer:
      "上游用 .dark 类，本模板用 [data-theme=\"dark\"]，因为主题只有一个来源（settings store）。共享包用 @custom-variant 把 dark: 前缀接到这个属性上，组件源码零改动。",
  },
  {
    question: "怎么验收改完是好的？",
    answer:
      "桌面端跑 pnpm check（typecheck + lint + test），涉及 Rust 再跑 pnpm check:rust，官网跑 pnpm website:build。三项都绿再提交。",
  },
  {
    question: "官网为什么用 Astro 而不是 Next.js？",
    answer:
      "官网需要被搜索引擎抓到，又不想背上第二套构建链。Astro 底层仍是 Vite，把 React 区块预先渲染成 HTML，滚到视口才注水，于是既能整块复用 Velora 区块，又有完整的首屏内容。",
  },
];

const SUPPORT_TEAM = ["模板维护者", "前端", "Rust"];

/**
 * Centered FAQ: a single-open accordion of common questions, then a
 * contact row for anything the list doesn't answer.
 */
export function FaqAccordion() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <DotPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full fill-foreground/10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_55%)]"
      />

      <div className="mx-auto max-w-3xl">
        <BlurFade className="text-center">
          <p className="text-sm font-medium text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            常见问题
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            关于组件复用、升级与验收的说明。还找不到答案可以看 docs/ 目录。
          </p>
        </BlurFade>

        <BlurFade delay={0.1} className="mt-14">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="rounded-2xl border bg-card/80 px-6 shadow-sm backdrop-blur sm:px-8"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger className="py-5 text-base hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pr-8 pb-5 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>

        <BlurFade delay={0.2} className="mt-10">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed bg-muted/40 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
            <AvatarCircles
              people={SUPPORT_TEAM}
              aria-hidden
              className="shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold">还有问题？</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                细则都在 docs/ 里：velora.md 讲组件复用，architecture.md 讲分层，quality.md 讲交付。
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-10 shrink-0 rounded-full px-5"
            >
              <a href="#quick-start">
                <MessageCircleIcon aria-hidden />
                看快速开始
              </a>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

/**
 * 展示页的清单是**手写精选**，不是扫文件系统。
 * 原因：文件名反映不了功能类别，且自动扫描会把未验证的组件也列上去。
 */
export interface ShowcaseItem {
  /** 共享包里的组件名，用作 key */
  name: string;
  /** 展示用短名 */
  label: string;
  /** 是否有预览实例；false 表示只列名 */
  preview?: boolean;
}

export interface ShowcaseGroup {
  id: string;
  title: string;
  items: ShowcaseItem[];
}

/** 组件分组：按功能，不按文件名前缀 */
export const COMPONENT_GROUPS: ShowcaseGroup[] = [
  {
    id: "background",
    title: "背景",
    items: [
      { name: "aurora-background", label: "Aurora", preview: true },
      { name: "grid-pattern", label: "Grid / Dot", preview: true },
      { name: "retro-grid", label: "Retro Grid" },
      { name: "meteors", label: "Meteors" },
      { name: "particles", label: "Particles" },
      { name: "vortex", label: "Vortex" },
      { name: "ripple", label: "Ripple", preview: true },
      { name: "light-rays", label: "Light Rays" },
      { name: "noise-background", label: "Noise" },
      { name: "background-beams", label: "Beams" },
    ],
  },
  {
    id: "text",
    title: "文字",
    items: [
      { name: "animated-gradient-text", label: "Gradient Text", preview: true },
      { name: "text-shimmer", label: "Text Shimmer", preview: true },
      { name: "text-reveal", label: "Text Reveal" },
      { name: "typewriter", label: "Typewriter" },
      { name: "flip-words", label: "Flip Words", preview: true },
      { name: "word-rotate", label: "Word Rotate" },
      { name: "number-ticker", label: "Number Ticker", preview: true },
      { name: "sparkles-text", label: "Sparkles" },
      { name: "text-highlighter", label: "Highlighter" },
      { name: "hyper-text", label: "Hyper Text" },
    ],
  },
  {
    id: "button",
    title: "按钮",
    items: [
      { name: "shimmer-button", label: "Shimmer", preview: true },
      { name: "moving-border", label: "Moving Border", preview: true },
      { name: "rainbow-button", label: "Rainbow" },
      { name: "ripple-button", label: "Ripple Button" },
      { name: "magnetic-button", label: "Magnetic" },
      { name: "stateful-button", label: "Stateful" },
      { name: "confetti", label: "Confetti" },
    ],
  },
  {
    id: "card",
    title: "卡片与布局",
    items: [
      { name: "spotlight-card", label: "Spotlight", preview: true },
      { name: "glare-card", label: "Glare" },
      { name: "tilt-card", label: "Tilt" },
      { name: "bento-grid", label: "Bento" },
      { name: "card-hover-effect", label: "Hover Card" },
      { name: "expandable-card", label: "Expandable" },
      { name: "avatar-circles", label: "Avatar Circles", preview: true },
      { name: "marquee", label: "Marquee", preview: true },
      { name: "orbiting-circles", label: "Orbiting" },
      { name: "dock", label: "Dock" },
    ],
  },
  {
    id: "nav",
    title: "导航",
    items: [
      { name: "animated-tabs", label: "Animated Tabs" },
      { name: "animated-sidebar", label: "Sidebar" },
      { name: "floating-navbar", label: "Floating Navbar" },
      { name: "navbar-menu", label: "Navbar Menu" },
      { name: "sticky-banner", label: "Sticky Banner" },
    ],
  },
  {
    id: "form",
    title: "表单与输入",
    items: [
      { name: "vanish-input", label: "Vanish Input" },
      { name: "file-drop", label: "File Drop" },
      { name: "stepper", label: "Stepper" },
      { name: "compare-slider", label: "Compare Slider" },
    ],
  },
  {
    id: "loader",
    title: "载入与提示",
    items: [
      { name: "loaders", label: "Loaders", preview: true },
      { name: "multi-step-loader", label: "Multi Step" },
      { name: "animated-modal", label: "Modal" },
      { name: "animated-tooltip", label: "Tooltip" },
    ],
  },
  {
    id: "scroll",
    title: "滚动与效果",
    items: [
      { name: "blur-fade", label: "Blur Fade", preview: true },
      { name: "border-beam", label: "Border Beam", preview: true },
      { name: "glowing-effect", label: "Glowing" },
      { name: "animated-beam", label: "Animated Beam" },
      { name: "tracing-beam", label: "Tracing Beam" },
      { name: "scroll-progress", label: "Scroll Progress" },
      { name: "timeline", label: "Timeline" },
      { name: "macbook-scroll", label: "Macbook Scroll" },
      { name: "hero-parallax", label: "Hero Parallax" },
    ],
  },
  {
    id: "data",
    title: "数据与地图",
    items: [
      { name: "globe", label: "Globe" },
      { name: "world-map", label: "World Map" },
      { name: "charts", label: "Charts（recipes）" },
    ],
  },
  {
    id: "mockup",
    title: "窗口与代码",
    items: [
      { name: "terminal", label: "Terminal", preview: true },
      { name: "code-block", label: "Code Block" },
      { name: "browser-mockup", label: "Browser" },
      { name: "iphone-mockup", label: "iPhone" },
    ],
  },
];

/** 模块：31 个成品区块，按上游类别 */
export interface BlockGroup {
  id: string;
  title: string;
  items: string[];
}

export const BLOCK_GROUPS: BlockGroup[] = [
  {
    id: "hero-sections",
    title: "Hero",
    items: [
      "hero-aurora",
      "hero-globe",
      "hero-screenshot",
      "hero-split-phone",
      "hero-waves",
      "hero-grid-minimal",
    ],
  },
  {
    id: "feature-sections",
    title: "功能区",
    items: [
      "features-bento",
      "features-icon-grid",
      "features-tabs",
      "features-split-screenshot",
      "features-steps",
    ],
  },
  {
    id: "pricing-sections",
    title: "定价",
    items: ["pricing-three-tiers", "pricing-single-plan", "pricing-comparison"],
  },
  {
    id: "testimonial-sections",
    title: "用户评价",
    items: ["testimonials-marquee", "testimonials-featured", "testimonials-grid"],
  },
  {
    id: "cta-sections",
    title: "CTA",
    items: ["cta-vortex", "cta-split-image", "cta-newsletter"],
  },
  {
    id: "logo-clouds",
    title: "客户 Logo",
    items: ["logos-marquee", "logos-grid"],
  },
  {
    id: "faq-sections",
    title: "常见问题",
    items: ["faq-accordion", "faq-two-column"],
  },
  {
    id: "navbars",
    title: "导航栏",
    items: ["navbar-floating", "navbar-mega"],
  },
  {
    id: "footers",
    title: "页脚",
    items: ["footer-columns", "footer-wordmark", "footer-newsletter"],
  },
  {
    id: "auth-sections",
    title: "登录注册",
    items: ["auth-login-split", "auth-signup-card"],
  },
];

/** 模板：已实际组装的页面 */
export interface TemplateItem {
  name: string;
  label: string;
  description: string;
  href?: string;
  /** 无 href 表示应用内页面，不可从官网跳转 */
  external?: boolean;
}

export const TEMPLATES: TemplateItem[] = [
  {
    name: "landing",
    label: "产品官网首页",
    description: "Hero + 数据 + 能力卡 + 快速开始 + 技术栈 + FAQ，Astro 静态预渲染。",
    href: "/",
  },
  {
    name: "showcase",
    label: "组件目录",
    description: "当前这一页：按功能分组浏览全部组件与区块。",
    href: "/showcase",
  },
  {
    name: "desktop-shell",
    label: "桌面应用外壳",
    description: "侧栏导航 + 概览 / 任务 / 设置三页，Tauri 内运行。",
  },
  {
    name: "desktop-settings",
    label: "桌面设置页",
    description: "主题、语言、通知、开机自启，单项开关即时生效。",
  },
];

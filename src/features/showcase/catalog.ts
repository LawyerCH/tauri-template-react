/**
 * 组件目录的清单是**手写精选**，不是扫文件系统。
 * 原因：文件名反映不了功能类别，且自动扫描会把未验证的组件也列上去。
 *
 * 本文件只存结构化字段；分组标题、条目标签、页面描述全部走 i18n，
 * 以保证中英双语一致。
 */
export interface ShowcaseItem {
  /** 共享包里的组件名，用作 key */
  name: string;
  /** 展示用短名（组件专名，中英通用） */
  label: string;
  /** 是否有预览实例；false 表示只列名 */
  preview?: boolean;
}

export interface ShowcaseGroup {
  /** 同时作为 i18n key 的最后一段 */
  id: string;
  items: ShowcaseItem[];
}

/** 组件分组：按功能，不按文件名前缀 */
export const COMPONENT_GROUPS: ShowcaseGroup[] = [
  {
    id: "background",
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
    items: [
      { name: "vanish-input", label: "Vanish Input" },
      { name: "file-drop", label: "File Drop" },
      { name: "stepper", label: "Stepper" },
      { name: "compare-slider", label: "Compare Slider" },
    ],
  },
  {
    id: "loader",
    items: [
      { name: "loaders", label: "Loaders", preview: true },
      { name: "multi-step-loader", label: "Multi Step" },
      { name: "animated-modal", label: "Modal" },
      { name: "animated-tooltip", label: "Tooltip" },
    ],
  },
  {
    id: "scroll",
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
    items: [
      { name: "globe", label: "Globe" },
      { name: "world-map", label: "World Map" },
    ],
  },
  {
    id: "mockup",
    items: [
      { name: "terminal", label: "Terminal", preview: true },
      { name: "code-block", label: "Code Block" },
      { name: "browser-mockup", label: "Browser" },
      { name: "iphone-mockup", label: "iPhone" },
    ],
  },
];

/** 区块：31 个成品区块，按上游类别 */
export interface BlockGroup {
  /** 同时作为 i18n key 的最后一段 */
  id: string;
  items: string[];
}

export const BLOCK_GROUPS: BlockGroup[] = [
  {
    id: "hero-sections",
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
    items: ["pricing-three-tiers", "pricing-single-plan", "pricing-comparison"],
  },
  {
    id: "testimonial-sections",
    items: ["testimonials-marquee", "testimonials-featured", "testimonials-grid"],
  },
  {
    id: "cta-sections",
    items: ["cta-vortex", "cta-split-image", "cta-newsletter"],
  },
  {
    id: "logo-clouds",
    items: ["logos-marquee", "logos-grid"],
  },
  {
    id: "faq-sections",
    items: ["faq-accordion", "faq-two-column"],
  },
  {
    id: "navbars",
    items: ["navbar-floating", "navbar-mega"],
  },
  {
    id: "footers",
    items: ["footer-columns", "footer-wordmark", "footer-newsletter"],
  },
  {
    id: "auth-sections",
    items: ["auth-login-split", "auth-signup-card"],
  },
];

/** 模板：桌面应用内已实际组装的页面 */
export interface TemplateItem {
  /** label 与 description 走 i18n：showcase.pages.<name>.* */
  name: string;
  /** 应用内路由，可点击跳转 */
  to?: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    name: "home",
    to: "/",
  },
  {
    name: "tasks",
    to: "/tasks",
  },
  {
    name: "settings",
    to: "/settings",
  },
  {
    name: "app-shell",
  },
];

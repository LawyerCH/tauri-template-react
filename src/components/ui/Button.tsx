import type { ButtonProps as BaseButtonProps } from "@template/velora/ui/button";
import { Button as BaseButton } from "@template/velora/ui/button";
import { cn } from "@template/velora/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

/**
 * 业务侧语义 → shadcn 变体。
 * 视觉差异靠 className 覆盖回来，保证页面外观不因换底层实现而改变。
 */
const VARIANT_MAP = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
  danger: "ghost",
} as const;

const VARIANT_STYLE: Record<Variant, string> = {
  primary: "shadow-sm shadow-primary/25",
  secondary:
    "border bg-card text-foreground shadow-none hover:bg-muted hover:text-foreground",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
};

const SIZE_MAP = {
  sm: "sm",
  md: "default",
} as const;

const SIZE_STYLE: Record<Size, string> = {
  sm: "h-7 gap-1 px-2.5 text-xs",
  md: "h-9 gap-1.5 px-4 text-sm",
};

export interface ButtonProps extends Omit<BaseButtonProps, "variant" | "size"> {
  variant?: Variant;
  size?: Size;
}

/**
 * 业务通用按钮。底层是共享包的 shadcn Button（支持 `asChild`），
 * 因此与区块里的按钮是同一份实现，只是默认变体与圆角按本项目的风格收口。
 */
export function Button({ variant = "secondary", size = "md", className, ...props }: ButtonProps) {
  return (
    <BaseButton
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      className={cn("rounded-lg duration-200", VARIANT_STYLE[variant], SIZE_STYLE[size], className)}
      {...props}
    />
  );
}

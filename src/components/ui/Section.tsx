import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  title?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, hint, children, className }: SectionProps) {
  return (
    <section className={cn("border-t border-line pt-5", className)}>
      {title && (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-base text-ink">{title}</h2>
          {hint && <p className="text-xs text-ink-3">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, hint, children, className }: SectionProps) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5", className)}>
      {title && (
        <div className="mb-4 space-y-1">
          <h2 className="text-sm font-medium text-card-foreground">{title}</h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
import { DotPattern } from "@template/velora/velora/grid-pattern";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-dashed bg-card/40 px-6 py-12">
      <DotPattern className="[mask-image:radial-gradient(280px_circle_at_50%_40%,black,transparent)]" />
      <div className="relative flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="max-w-[52ch] text-xs leading-relaxed text-muted-foreground">{description}</p>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  );
}

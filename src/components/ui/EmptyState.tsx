import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 border border-dashed border-line px-5 py-10">
      <p className="text-sm text-ink">{title}</p>
      <p className="max-w-[52ch] text-xs leading-relaxed text-ink-2">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

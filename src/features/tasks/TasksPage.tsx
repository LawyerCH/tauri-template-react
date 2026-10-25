import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Plus, Trash2 } from "lucide-react";
import { BlurFade } from "@template/velora/velora/blur-fade";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@template/velora/lib/utils";

interface Task {
  id: string;
  title: string;
  done: boolean;
}

export function TasksPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");

  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks]);

  function addTask() {
    const title = draft.trim();
    if (!title) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), title, done: false }, ...prev]);
    setDraft("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="space-y-6">
      <p className="max-w-[64ch] text-sm text-muted-foreground">{t("tasks.subtitle")}</p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addTask();
        }}
        className="flex gap-2"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("tasks.placeholder")}
          aria-label={t("tasks.placeholder")}
          className="h-10 min-w-0 flex-1 rounded-xl border bg-card px-3.5 text-sm transition-shadow outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <Button type="submit" variant="primary" size="md" disabled={!draft.trim()}>
          <Plus size={15} strokeWidth={1.75} />
          {t("common.add")}
        </Button>
      </form>

      {tasks.length === 0 ? (
        <EmptyState title={t("tasks.empty.title")} description={t("tasks.empty.description")} />
      ) : (
        <div>
          <div className="mb-3 flex items-baseline justify-between text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">{t("tasks.count", { count: tasks.length })}</span>
            <span className="font-mono tabular-nums">{t("tasks.remaining", { count: remaining })}</span>
          </div>

          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={task.id}>
                <BlurFade delay={Math.min(index * 0.03, 0.2)} offset={8} duration={0.35}>
                  <div className="group flex items-center gap-3 rounded-xl border bg-card px-3.5 py-2.5 transition-colors hover:border-brand-via/40">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-pressed={task.done}
                      aria-label={task.title}
                      className={cn(
                        "grid size-4.5 shrink-0 place-items-center rounded-md border transition-colors",
                        task.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent hover:border-brand-via/60",
                      )}
                    >
                      <Check size={11} strokeWidth={3} />
                    </button>
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm transition-colors",
                        task.done ? "text-muted-foreground line-through" : "text-foreground",
                      )}
                    >
                      {task.title}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeTask(task.id)}
                      aria-label={`${t("common.delete")} ${task.title}`}
                      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </Button>
                  </div>
                </BlurFade>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

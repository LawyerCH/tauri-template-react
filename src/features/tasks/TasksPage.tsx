import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

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
      <p className="max-w-[64ch] text-sm text-ink-2">{t("tasks.subtitle")}</p>

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
          className="h-9 min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-3 focus-visible:border-accent"
        />
        <Button type="submit" variant="primary" disabled={!draft.trim()}>
          <Plus size={14} strokeWidth={1.5} />
          {t("common.add")}
        </Button>
      </form>

      {tasks.length === 0 ? (
        <EmptyState title={t("tasks.empty.title")} description={t("tasks.empty.description")} />
      ) : (
        <div>
          <div className="mb-2 flex items-baseline justify-between text-xs text-ink-3">
            <span className="tabular">{t("tasks.count", { count: tasks.length })}</span>
            <span className="tabular">{t("tasks.remaining", { count: remaining })}</span>
          </div>
          <ul className="border-t border-line">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 border-b border-line py-2.5"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-pressed={task.done}
                  aria-label={task.title}
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                    task.done ? "border-accent bg-accent text-white" : "border-line text-transparent",
                  )}
                >
                  <Check size={11} strokeWidth={2.5} />
                </button>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    task.done ? "text-ink-3 line-through" : "text-ink",
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
                  <Trash2 size={14} strokeWidth={1.5} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

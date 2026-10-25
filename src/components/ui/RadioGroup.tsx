import { cn } from "@/lib/utils";

interface RadioOption<T extends string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T extends string> {
  name: string;
  value: T;
  options: readonly RadioOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
  className,
}: RadioGroupProps<T>) {
  return (
    <div role="radiogroup" className={cn("inline-flex flex-wrap gap-1 rounded-full border bg-muted/50 p-1", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="relative inline-flex h-7 cursor-pointer items-center rounded-full px-3 text-xs text-muted-foreground transition-colors hover:text-foreground has-[:checked]:bg-card has-[:checked]:font-medium has-[:checked]:text-foreground has-[:checked]:shadow-sm"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

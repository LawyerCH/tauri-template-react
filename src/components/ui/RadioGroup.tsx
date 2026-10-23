import { cn } from "@/lib/cn";

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
    <div role="radiogroup" className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-sm border border-line bg-paper px-3 text-sm text-ink-2 transition-colors hover:text-ink has-[:checked]:border-accent has-[:checked]:text-ink"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="size-3.5 accent-accent"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

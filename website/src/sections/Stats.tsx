import { NumberTicker } from "@template/velora/velora/number-ticker";

const STATS = [
  { value: 100, suffix: "+", label: "可拉取组件" },
  { value: 31, suffix: "", label: "成品区块" },
  { value: 3, suffix: "", label: "条命令跑通" },
];

export function Stats() {
  return (
    <section className="border-y px-6 py-12 lg:px-8">
      <dl className="mx-auto grid max-w-4xl grid-cols-3 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse items-center gap-1 text-center">
            <dt className="text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
            <dd className="text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">
              <NumberTicker value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

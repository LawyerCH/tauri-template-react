import { Marquee } from "@template/velora/velora/marquee";

const STACK = [
  "Tauri 2",
  "React 19",
  "Vite 8",
  "Tailwind CSS 4",
  "TypeScript",
  "Motion",
  "Zustand",
  "i18next",
  "Velora UI",
];

export function StackMarquee() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <p className="mb-8 text-center text-xs tracking-widest text-muted-foreground uppercase">
        技术栈
      </p>
      <Marquee className="[--duration:38s]">
        {STACK.map((item) => (
          <span
            key={item}
            className="mx-4 inline-flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground"
          >
            <span className="size-1 rounded-full bg-primary" aria-hidden />
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

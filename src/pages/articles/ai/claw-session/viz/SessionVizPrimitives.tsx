import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

const tones: Record<Tone, string> = {
  blue: "border-primary/45 [&_[data-step-label]]:text-primary",
  violet: "border-primary/45 [&_[data-step-label]]:text-primary",
  emerald: "border-primary/45 [&_[data-step-label]]:text-primary",
  amber: "border-amber-500/55 [&_[data-step-label]]:text-amber-700 dark:[&_[data-step-label]]:text-amber-300",
  rose: "border-rose-500/55 [&_[data-step-label]]:text-rose-700 dark:[&_[data-step-label]]:text-rose-300",
  slate: "border-border [&_[data-step-label]]:text-muted-foreground",
};

export type SessionStep = {
  label: string;
  title: string;
  body: string;
  tone?: Tone;
};

export function SessionFrame({
  label,
  title,
  description,
  note,
  children,
}: {
  label: string;
  title: string;
  description: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <VizFrame
      eyebrow={label}
      title={title}
      description={description}
      note={note}
      canvasClassName="p-5 sm:p-7"
    >
      {children}
    </VizFrame>
  );
}

export function SessionSteps({
  items,
  columns = 4,
}: {
  items: SessionStep[];
  columns?: 3 | 4;
}) {
  return (
    <ol
      className={`grid gap-x-7 gap-y-7 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
    >
      {items.map((item) => (
        <li
          key={`${item.label}-${item.title}`}
          className={`min-w-0 border-l pl-4 ${tones[item.tone ?? "blue"]}`}
        >
          <p
            data-step-label
            className="font-mono text-[10px] font-bold tracking-[0.08em]"
          >
            {item.label}
          </p>
          <h5 className="mt-3 text-sm font-bold leading-5 text-foreground">
            {item.title}
          </h5>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function SessionRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 border-t border-border pt-5 text-sm font-medium leading-6 text-foreground">
      {children}
    </div>
  );
}

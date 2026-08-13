import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

const tones: Record<Tone, string> = {
  blue: "border-l-blue-500/60",
  violet: "border-l-violet-500/60",
  emerald: "border-l-emerald-500/60",
  amber: "border-l-amber-500/60",
  rose: "border-l-rose-500/60",
  slate: "border-l-border",
};

export type BashStep = {
  label: string;
  title: string;
  body: string;
  tone?: Tone;
};

export function BashFrame({
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
      className="my-8"
      canvasClassName="bg-background"
    >
      <div className="min-w-0">{children}</div>
    </VizFrame>
  );
}

export function BashSteps({
  items,
  columns = 4,
}: {
  items: BashStep[];
  columns?: 2 | 3 | 4 | 5;
}) {
  const grid =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : columns === 5
          ? "sm:grid-cols-2 lg:grid-cols-5"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid min-w-0 gap-4 lg:gap-6 ${grid}`}>
      {items.map((item) => (
        <section
          key={`${item.label}-${item.title}`}
          className={`min-w-0 rounded-lg border border-border/70 border-l bg-background p-4 ${tones[item.tone ?? "blue"]}`}
        >
          <p className="break-words text-[0.68rem] font-bold tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <h4 className="mt-2 break-words text-sm font-semibold leading-5 text-foreground">
            {item.title}
          </h4>
          <p className="mt-2 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            {item.body}
          </p>
        </section>
      ))}
    </div>
  );
}

export function BashRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 grid min-w-0 gap-1 border-t border-border/70 pt-4 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-4">
      <p className="text-xs font-semibold text-foreground">읽는 기준</p>
      <div className="min-w-0 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
        {children}
      </div>
    </div>
  );
}

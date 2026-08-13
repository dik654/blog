import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose";

const styles: Record<Tone, string> = {
  blue: "border-primary/45 [&_[data-step-label]]:text-primary",
  violet: "border-primary/45 [&_[data-step-label]]:text-primary",
  emerald: "border-primary/45 [&_[data-step-label]]:text-primary",
  amber: "border-amber-500/55 [&_[data-step-label]]:text-amber-700 dark:[&_[data-step-label]]:text-amber-300",
  rose: "border-rose-500/55 [&_[data-step-label]]:text-rose-700 dark:[&_[data-step-label]]:text-rose-300",
};

export type CompactStep = {
  label: string;
  title: string;
  body: string;
  tone?: Tone;
};

export function CompactFrame({
  label,
  title,
  description,
  children,
  note,
}: {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
  note: string;
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

export function CompactSteps({
  steps,
  columns = 4,
}: {
  steps: CompactStep[];
  columns?: 2 | 3 | 4;
}) {
  const columnClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <ol className={`grid gap-x-7 gap-y-7 ${columnClass}`}>
      {steps.map((step) => (
        <li
          key={step.label}
          className={`min-w-0 border-l pl-4 ${styles[step.tone ?? "blue"]}`}
        >
          <p
            data-step-label
            className="font-mono text-[10px] font-bold tracking-[0.08em]"
          >
            {step.label}
          </p>
          <h5 className="mt-3 text-sm font-bold leading-5 text-foreground">
            {step.title}
          </h5>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function CompactRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 border-t border-border pt-5 text-sm font-medium leading-6 text-foreground">
      {children}
    </div>
  );
}

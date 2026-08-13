import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

export function DistributedFrame({
  eyebrow,
  title,
  description,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      note={note}
    >
      {children}
    </VizFrame>
  );
}

export function Ledger({
  items,
  columns = 3,
}: {
  items: readonly {
    label: string;
    title: string;
    body: string;
    example?: string;
  }[];
  columns?: 2 | 3 | 4;
}) {
  const grid =
    columns === 4
      ? "lg:grid-cols-4"
      : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";
  return (
    <ol className={`grid min-w-0 gap-x-8 gap-y-7 ${grid}`}>
      {items.map((item, index) => (
        <li key={item.label} className="min-w-0 border-l border-border pl-4">
          <p className="font-mono text-[11px] font-semibold text-primary">
            {String(index + 1).padStart(2, "0")} · {item.label}
          </p>
          <p className="mt-3 text-sm font-bold leading-5">{item.title}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {item.body}
          </p>
          {item.example && (
            <p className="mt-4 break-words border-t border-border pt-3 font-mono text-[11px] leading-5 text-foreground/80 [overflow-wrap:anywhere]">
              {item.example}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function Flow({
  steps,
}: {
  steps: readonly { label: string; title: string; body: string }[];
}) {
  return (
    <ol className="grid min-w-0 gap-5 md:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.label} className="relative min-w-0 border-t border-border pt-4">
          <p className="font-mono text-[11px] font-semibold text-primary">
            {step.label}
          </p>
          <p className="mt-2 text-sm font-bold">{step.title}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {step.body}
          </p>
          {index < steps.length - 1 && (
            <span className="absolute right-1 top-3 hidden text-xs text-muted-foreground md:block">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

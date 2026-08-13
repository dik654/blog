import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

export function MathVizFrame({
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

export function MathFlow({
  steps,
}: {
  steps: readonly {
    label: string;
    title: string;
    body: string;
    code?: string;
  }[];
}) {
  return (
    <ol className="grid min-w-0 gap-5 md:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.label}
          className="relative min-w-0 border-t border-border pt-4"
        >
          <p className="font-mono text-[11px] font-semibold text-primary">
            {step.label}
          </p>
          <p className="mt-2 text-sm font-bold leading-5">{step.title}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {step.body}
          </p>
          {step.code && (
            <p className="mt-3 break-words font-mono text-[11px] leading-5 text-foreground/80 [overflow-wrap:anywhere]">
              {step.code}
            </p>
          )}
          {index < steps.length - 1 && (
            <span className="absolute -right-4 top-3 hidden text-xs text-muted-foreground md:block">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function MathLedger({
  items,
}: {
  items: readonly { label: string; value: string; meaning: string }[];
}) {
  return (
    <dl className="grid min-w-0 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 border-l border-border pl-4">
          <dt className="font-mono text-[11px] font-semibold text-primary">
            {item.label}
          </dt>
          <dd className="mt-2 break-words text-sm font-bold [overflow-wrap:anywhere]">
            {item.value}
          </dd>
          <dd className="mt-2 text-xs leading-5 text-muted-foreground">
            {item.meaning}
          </dd>
        </div>
      ))}
    </dl>
  );
}

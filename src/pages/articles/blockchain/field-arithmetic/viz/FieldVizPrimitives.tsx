import type { ReactNode } from "react";

export function FlowGrid({ children }: { children: ReactNode }) {
  return <div className="grid w-full min-w-0 gap-3 md:grid-cols-3">{children}</div>;
}

export function FlowCard({
  active,
  eyebrow,
  title,
  detail,
}: {
  active: boolean;
  eyebrow: string;
  title: string;
  detail: ReactNode;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border p-4 transition-colors ${
        active ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-foreground">{title}</p>
      <div className="mt-2 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </div>
    </div>
  );
}

export function FormulaChip({ children }: { children: ReactNode }) {
  return (
    <code className="inline-flex max-w-full break-all rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] text-foreground">
      {children}
    </code>
  );
}

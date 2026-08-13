import type { ReactNode } from "react";

export function RethFlow({ children }: { children: ReactNode }) {
  return <ol className="grid min-w-0 gap-5 lg:grid-cols-4">{children}</ol>;
}

export function RethStep({
  index,
  title,
  body,
  accent = false,
}: {
  index: string;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <li
      className={`min-w-0 border-t pt-4 ${accent ? "border-primary" : "border-border"}`}
    >
      <p className="font-mono text-[11px] font-semibold text-primary">
        {index}
      </p>
      <p className="mt-2 break-words text-sm font-bold leading-5">{title}</p>
      <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
        {body}
      </p>
    </li>
  );
}

export function RethReceipt({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 border-l border-border pl-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground">
        {value}
      </p>
    </div>
  );
}

export function RethDecision({
  question,
  yes,
  no,
}: {
  question: string;
  yes: string;
  no: string;
}) {
  return (
    <div className="grid min-w-0 gap-4 border-t border-border pt-5 md:grid-cols-[1.2fr_1fr_1fr]">
      <p className="min-w-0 break-words text-sm font-bold leading-6">
        {question}
      </p>
      <p className="min-w-0 border-l border-emerald-500/60 pl-3 text-xs leading-5">
        <strong>PASS</strong>
        <br />
        <span className="text-muted-foreground">{yes}</span>
      </p>
      <p className="min-w-0 border-l border-rose-500/60 pl-3 text-xs leading-5">
        <strong>FAIL</strong>
        <br />
        <span className="text-muted-foreground">{no}</span>
      </p>
    </div>
  );
}

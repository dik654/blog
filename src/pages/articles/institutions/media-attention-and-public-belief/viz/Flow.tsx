import type { ReactNode } from "react";

/** 이 글의 흐름 장면이 함께 쓰는 상자와 화살표입니다. 좁은 화면에서는 세로로 쌓입니다. */
export function FlowNode({ title, sub, tone = "plain" }: { title: string; sub?: string; tone?: "plain" | "accent" | "muted" }) {
  const border = tone === "accent" ? "border-primary bg-primary/5" : tone === "muted" ? "border-dashed border-border" : "border-border bg-background";
  return (
    <div className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-center ${border}`}>
      <span className={`block text-sm font-semibold leading-5 ${tone === "muted" ? "text-muted-foreground" : ""}`}>{title}</span>
      {sub && <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 flex-row items-center justify-center gap-2 sm:flex-col sm:gap-0 sm:px-1">
      <span aria-hidden className="text-sm text-muted-foreground sm:hidden">↓</span>
      <span aria-hidden className="hidden text-sm text-muted-foreground sm:inline">→</span>
      {label && <span className="text-xs font-semibold leading-4 text-primary sm:max-w-24 sm:text-center">{label}</span>}
    </div>
  );
}

export function FlowLine({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">{children}</div>;
}

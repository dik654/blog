import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";
import { cn } from "@/lib/utils";

const toneClass = {
  neutral: "border-slate-400/55 bg-slate-500/5",
  blue: "border-blue-400/60 bg-blue-500/5",
  violet: "border-violet-400/60 bg-violet-500/5",
  emerald: "border-emerald-400/60 bg-emerald-500/5",
  amber: "border-amber-400/60 bg-amber-500/5",
  rose: "border-rose-400/60 bg-rose-500/5",
} as const;

export function HardwareNode({
  title,
  detail,
  metric,
  tone = "neutral",
}: {
  title: string;
  detail: string;
  metric?: string;
  tone?: keyof typeof toneClass;
}) {
  return (
    <div className={cn("min-w-0 rounded-lg border p-4", toneClass[tone])}>
      <p className="break-words text-sm font-semibold">{title}</p>
      {metric && (
        <p className="mt-1 break-words font-mono text-xs text-foreground/75">
          {metric}
        </p>
      )}
      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

export function HardwareArrow({ label }: { label?: string }) {
  return (
    <div className="flex min-h-6 shrink-0 items-center justify-center gap-1 text-center text-[11px] text-muted-foreground">
      {label && <span className="break-words">{label}</span>}
      <span className="hidden md:inline">→</span>
      <span className="md:hidden">↓</span>
    </div>
  );
}

export function HardwareViz({
  title,
  description,
  children,
  note,
  eyebrow = "하드웨어 경로",
}: {
  title: string;
  description: string;
  children: ReactNode;
  note?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      note={note}
      canvasClassName="p-5 sm:p-7"
    >
      {children}
    </VizFrame>
  );
}

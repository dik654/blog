import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";
import { cn } from "@/lib/utils";

const gpuTone = {
  host: "border-slate-400/55 bg-slate-500/5 text-slate-700 dark:text-slate-200",
  control:
    "border-indigo-400/60 bg-indigo-500/5 text-indigo-700 dark:text-indigo-200",
  compute:
    "border-emerald-400/60 bg-emerald-500/5 text-emerald-700 dark:text-emerald-200",
  memory:
    "border-amber-400/60 bg-amber-500/5 text-amber-800 dark:text-amber-200",
  risk: "border-rose-400/60 bg-rose-500/5 text-rose-700 dark:text-rose-200",
} as const;

export function GpuNode({
  title,
  detail,
  tone = "host",
}: {
  title: string;
  detail: string;
  tone?: keyof typeof gpuTone;
}) {
  return (
    <div className={cn("min-w-0 rounded-lg border p-4", gpuTone[tone])}>
      <p className="break-words text-sm font-semibold">{title}</p>
      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

export function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex min-h-6 shrink-0 items-center justify-center gap-2 text-[11px] text-muted-foreground md:min-w-12">
      {label && <span className="break-words text-center">{label}</span>}
      <span aria-hidden="true" className="hidden md:inline">
        →
      </span>
      <span aria-hidden="true" className="md:hidden">
        ↓
      </span>
    </div>
  );
}

export function GpuFlow({
  title,
  description,
  children,
  note,
}: {
  title: string;
  description: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <VizFrame
      eyebrow="GPU 실행 지도"
      title={title}
      description={description}
      note={note}
      canvasClassName="p-5 sm:p-7"
    >
      {children}
    </VizFrame>
  );
}

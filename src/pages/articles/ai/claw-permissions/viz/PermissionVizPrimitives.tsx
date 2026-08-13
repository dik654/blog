import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

const tones: Record<Tone, string> = {
  blue: "border-blue-500/55 text-blue-700 dark:text-blue-300",
  violet: "border-violet-500/55 text-violet-700 dark:text-violet-300",
  emerald: "border-emerald-500/55 text-emerald-700 dark:text-emerald-300",
  amber: "border-amber-500/55 text-amber-700 dark:text-amber-300",
  rose: "border-rose-500/55 text-rose-700 dark:text-rose-300",
  slate: "border-border text-muted-foreground",
};

export type PermissionStep = {
  label: string;
  title: string;
  body: string;
  tone?: Tone;
};

export function PermissionFrame({
  label,
  title,
  description,
  note,
  children,
}: {
  label: string;
  title: string;
  description: string;
  note: ReactNode;
  children: ReactNode;
}) {
  return (
    <VizFrame
      eyebrow={label}
      title={title}
      description={description}
      note={note}
      className="my-8"
      canvasClassName="p-5 sm:p-6"
    >
      {children}
    </VizFrame>
  );
}

export function PermissionSteps({
  items,
  columns = 4,
}: {
  items: PermissionStep[];
  columns?: 3 | 4;
}) {
  return (
    <ol
      className={`grid min-w-0 gap-6 ${
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((item, index) => (
        <li
          key={`${item.label}-${item.title}`}
          className={`min-w-0 border-t pt-4 ${tones[item.tone ?? "blue"]}`}
        >
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <p className="min-w-0 break-words text-[11px] font-bold tracking-wide">
              {item.label}
            </p>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h4 className="mt-2 min-w-0 break-words text-sm font-bold text-foreground [overflow-wrap:anywhere]">
            {item.title}
          </h4>
          <p className="mt-2 min-w-0 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function PermissionRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 min-w-0 border-l border-primary/60 pl-4 text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

const tones: Record<Tone, string> = {
  blue: "border-blue-500/25 bg-blue-500/5",
  violet: "border-violet-500/25 bg-violet-500/5",
  emerald: "border-emerald-500/25 bg-emerald-500/5",
  amber: "border-amber-500/25 bg-amber-500/5",
  rose: "border-rose-500/25 bg-rose-500/5",
  slate: "border-border/80 bg-muted/35",
};

export type ProviderStep = {
  label: string;
  title: string;
  body: string;
  tone?: Tone;
};

export function ProviderFrame({
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
    <figure data-viz="provider-contract" className="my-10 overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="p-5 sm:p-7">
        <figcaption className="max-w-3xl">
          <span className="inline-flex rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold tracking-wide text-background">
            {label}
          </span>
          <h4 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {title}
          </h4>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </figcaption>
        <div className="mt-7">{children}</div>
      </div>
      <div className="border-t border-border/70 bg-muted/30 px-5 py-3 text-xs leading-5 text-muted-foreground sm:px-7">
        {note}
      </div>
    </figure>
  );
}

export function ProviderSteps({
  items,
  columns = 4,
}: {
  items: ProviderStep[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
    >
      {items.map((item) => (
        <section
          key={`${item.label}-${item.title}`}
          className={`min-w-0 rounded-lg border p-4 ${tones[item.tone ?? "blue"]}`}
        >
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <h5 className="mt-2 text-sm font-bold text-foreground">
            {item.title}
          </h5>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            {item.body}
          </p>
        </section>
      ))}
    </div>
  );
}

export function ProviderRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-lg border border-border/80 bg-background px-4 py-3 text-sm leading-6 text-foreground">
      {children}
    </div>
  );
}

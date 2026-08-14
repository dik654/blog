import type { ReactNode } from "react";

export interface TermBreakdownItem {
  term: ReactNode;
  description: ReactNode;
  example?: ReactNode;
  boundary?: ReactNode;
}

export default function TermBreakdown({
  title,
  description,
  items,
}: {
  title: string;
  description?: ReactNode;
  items: readonly TermBreakdownItem[];
}) {
  return (
    <aside
      data-term-breakdown
      className="not-prose min-w-0 border-y border-border/65 bg-muted/[0.08]"
      aria-label={title}
    >
      <header className="border-b border-border/60 px-5 py-4 sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          One term per line
        </p>
        <h3 className="mt-1 text-lg font-bold leading-7 text-foreground">
          {title}
        </h3>
        {description ? (
          <div className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </div>
        ) : null}
      </header>

      <dl className="divide-y divide-border/55">
        {items.map((item, index) => (
          <div
            key={index}
            data-term-breakdown-item
            className="grid min-w-0 gap-2 px-5 py-5 sm:grid-cols-[2.25rem_minmax(0,12rem)_minmax(0,1fr)] sm:gap-4 sm:px-6"
          >
            <span className="font-mono text-[11px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <dt className="min-w-0 break-words text-sm font-black leading-6 text-foreground">
              {item.term}
            </dt>
            <dd className="min-w-0 space-y-3 text-sm leading-7 text-foreground/80 [overflow-wrap:anywhere]">
              <div>{item.description}</div>
              {item.example ? (
                <div className="border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">
                  <span className="font-bold text-primary">작은 예 · </span>
                  {item.example}
                </div>
              ) : null}
              {item.boundary ? (
                <div className="border-l border-amber-600/45 pl-3 text-xs leading-6 text-muted-foreground">
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    구분할 것 ·
                  </span>
                  {item.boundary}
                </div>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

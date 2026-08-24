export type ConceptGridItem = {
  label: string;
  title: string;
  description: string;
  detail?: string;
};

const TONES = {
  blue: {
    wash: "bg-blue-50/70 dark:bg-blue-950/20",
    label: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200",
  },
  violet: {
    wash: "bg-violet-50/70 dark:bg-violet-950/20",
    label: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-200",
  },
  emerald: {
    wash: "bg-emerald-50/70 dark:bg-emerald-950/20",
    label: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  },
  amber: {
    wash: "bg-amber-50/70 dark:bg-amber-950/20",
    label: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  },
} as const;

export default function ConceptGridViz({
  eyebrow,
  title,
  summary,
  items,
  tone = "blue",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  items: ConceptGridItem[];
  tone?: keyof typeof TONES;
}) {
  const colors = TONES[tone];
  return (
    <figure data-viz="concept-grid" className="not-prose my-8 overflow-hidden rounded-xl border bg-card">
      <figcaption className={`border-b ${colors.wash} px-5 py-5 sm:px-6`}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{summary}</p>
      </figcaption>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {items.map((item, index) => (
          <article key={`${item.label}-${item.title}`} className="min-w-0 rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-md px-2 py-1 text-xs font-bold ${colors.label}`}>{item.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <strong className="mt-4 block text-sm leading-5">{item.title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            {item.detail && <p className="mt-3 break-words rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-5 text-foreground/80">{item.detail}</p>}
          </article>
        ))}
      </div>
    </figure>
  );
}

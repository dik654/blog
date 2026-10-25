export interface MobileStageItem {
  title: string;
  detail: string;
}

export default function MobileStageFlow({
  items,
  active,
  ariaLabel,
}: {
  items: readonly MobileStageItem[];
  active: number;
  ariaLabel: string;
}) {
  return (
    <ol className="mt-5 space-y-2 sm:hidden" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const current = index === active;
        const completed = index < active;
        return (
          <li
            key={item.title}
            aria-current={current ? "step" : undefined}
            className={`grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-2 border-l-2 px-3 py-2 transition-colors duration-300 ${
              current
                ? "border-primary bg-primary/8 text-foreground"
                : completed
                  ? "border-primary/45 text-foreground"
                  : "border-border text-muted-foreground"
            }`}
          >
            <span className="font-mono text-[11px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <strong className="block break-keep text-sm leading-5">{item.title}</strong>
              {current && <span className="mt-1 block break-keep text-xs leading-5 text-muted-foreground">{item.detail}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

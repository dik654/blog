import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

export type JournalCard = {
  label: string;
  title: string;
  body: string;
  example?: string;
  accent?: "sky" | "violet" | "emerald" | "amber";
};

export function JournalFrame({
  label,
  title,
  description,
  children,
  note,
}: {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
  note: string;
}) {
  return (
    <VizFrame
      eyebrow={label}
      title={title}
      description={description}
      note={note}
    >
      {children}
    </VizFrame>
  );
}

export function JournalCards({ cards }: { cards: JournalCard[] }) {
  return (
    <ol className="grid min-w-0 gap-x-8 gap-y-7 md:grid-cols-3">
      {cards.map((card, index) => (
        <li key={card.label} className="min-w-0 border-l border-border pl-4">
          <p className="font-mono text-[11px] font-semibold text-primary">
            {String(index + 1).padStart(2, "0")} · {card.label}
          </p>
          <h5 className="mt-3 text-sm font-bold leading-5 text-foreground">
            {card.title}
          </h5>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {card.body}
          </p>
          {card.example && (
            <p className="mt-4 break-words border-t border-border/70 pt-3 font-mono text-[11px] leading-5 text-foreground/80 [overflow-wrap:anywhere]">
              {card.example}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function LinkRule({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 border-t border-border pt-5 text-sm leading-6 text-foreground">
      {children}
    </div>
  );
}

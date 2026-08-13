import { useState } from "react";
import type { ConceptFlow } from "@/content/article-guidance";

export default function ArticleConceptViz({ flow }: { flow: ConceptFlow }) {
  const [active, setActive] = useState(0);

  return (
    <figure
      data-viz="article-concept-flow"
      className="not-prose mb-10 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
      aria-label="배경에서 적용까지 이어지는 탑다운 글 흐름"
    >
      <figcaption className="border-b border-border/60 bg-muted/20 p-4 sm:p-5">
        <p className="text-sm font-bold text-foreground">{flow.title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {flow.question}
        </p>
      </figcaption>

      <div className="mx-auto grid max-w-3xl gap-2 p-4 sm:p-6">
        {flow.nodes.map((node, index) => {
          const isActive = active === index;
          return (
            <button
              key={node.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(index)}
              className={`group grid min-w-0 cursor-pointer gap-3 rounded-lg border p-4 text-left transition-colors sm:grid-cols-[5.5rem_minmax(0,1fr)] ${
                isActive
                  ? "border-primary/45 bg-primary/[0.055]"
                  : index < active
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border/70 bg-muted/20 hover:border-border hover:bg-muted/40"
              }`}
            >
              <span>
                <span
                  className={`inline-flex rounded-lg px-2 py-1 text-[11px] font-black tracking-[0.12em] ${
                    isActive ? "bg-primary text-primary-foreground" : "border border-border/70 bg-background text-muted-foreground"
                  }`}
                >
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-5 text-foreground">
                  {node.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-foreground/65">
                  {node.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="border-t border-border/60 bg-muted/10 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">
        <strong className="text-foreground/75">핵심:</strong> {flow.takeaway}
      </p>
    </figure>
  );
}

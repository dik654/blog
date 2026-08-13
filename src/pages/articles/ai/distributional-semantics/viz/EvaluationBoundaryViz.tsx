import VizFrame from "@/components/viz/VizFrame";

const checks = [
  ["Intrinsic", "similarity · analogy", "quick geometry probe"],
  ["Extrinsic", "task metric", "actual use value"],
  ["Robustness", "domain · frequency · OOV", "coverage boundary"],
  ["Audit", "neighbors · bias · leakage", "harm and shortcut"],
] as const;

export default function EvaluationBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Evaluation stack"
      title="Embedding 품질은 하나의 analogy 점수로 닫히지 않습니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map(([name, method, question]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {method}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {question}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

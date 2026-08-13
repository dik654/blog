import VizFrame from "@/components/viz/VizFrame";

const graders = [
  ["Code-based", "schema · test · invariant", "deterministic"],
  ["Model-based", "open-ended rubric", "calibrated judge"],
  ["Human", "high risk · subjective", "expert decision"],
  ["Operational", "cost · latency · retries", "system outcome"],
] as const;

export default function EvaluationStackViz() {
  return (
    <VizFrame
      eyebrow="Agent evaluation"
      title="최종 답·trajectory·side effect를 서로 맞는 grader로 평가합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {graders.map(([name, evidence, role]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {evidence}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {role}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

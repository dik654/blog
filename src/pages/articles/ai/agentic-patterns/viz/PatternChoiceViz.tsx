import VizFrame from "@/components/viz/VizFrame";

const patterns = [
  ["Workflow", "known path", "predictability"],
  ["ReAct", "unknown next observation", "adaptive tool use"],
  ["Plan + checkpoints", "long dependent tasks", "coverage · resume"],
  ["Multi-agent", "separable context or authority", "parallelism · isolation"],
] as const;

export default function PatternChoiceViz() {
  return (
    <VizFrame
      eyebrow="Complexity ladder"
      title="구조는 이름이 아니라 실제로 필요한 제어 특성에 맞춰 추가합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {patterns.map(([name, condition, value]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {condition}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

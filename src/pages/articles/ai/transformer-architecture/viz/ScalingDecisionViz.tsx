import VizFrame from "@/components/viz/VizFrame";

const objectives = [
  [
    "Training-optimal",
    "fixed train FLOPs",
    "choose N·D for lowest train-time loss",
  ],
  ["Inference-aware", "repeated serving cost", "smaller N may justify more D"],
  [
    "Data-limited",
    "quality·coverage·reuse",
    "new tokens are not interchangeable",
  ],
] as const;

export default function ScalingDecisionViz() {
  return (
    <VizFrame
      eyebrow="Budget objective"
      title="같은 scaling curve라도 최적점은 무엇을 비용으로 세는지에 따라 달라집니다"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {objectives.map(([name, constraint, decision]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 text-xs font-semibold text-primary">
              {constraint}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {decision}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

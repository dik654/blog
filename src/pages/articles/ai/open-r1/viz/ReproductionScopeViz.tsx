import VizFrame from "@/components/viz/VizFrame";

const tracks = [
  ["Distillation", "teacher traces → verify → SFT", "behavior transfer"],
  ["R1-Zero-like RL", "base policy → rollout → RLVR", "capability elicitation"],
  ["Multi-stage", "cold start → RL → data refresh", "recipe reconstruction"],
] as const;

export default function ReproductionScopeViz() {
  return (
    <VizFrame
      eyebrow="Reproduction contract"
      title="Open-R1에는 서로 다른 세 재현 경로가 있습니다"
      description="같은 Open-R1 저장소를 써도 출발 checkpoint와 학습 신호가 다르면 재현 대상도 달라집니다."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {tracks.map(([title, path, target], index) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {path}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {target}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

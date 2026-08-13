import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["System invariants", "항상 유지", "권한·격리·artifact·rollback"],
  ["Task contract", "task마다 조정", "objective·acceptance·budget"],
  ["Model scaffolding", "model마다 ablation", "세부 순서·예시·self-review prompt"],
] as const;

export default function HarnessWeightViz() {
  return (
    <VizFrame
      eyebrow="Fat harness test"
      title="모델이 강해질수록 먼저 덜어낼 것은 세부 scaffolding이지 시스템 invariant가 아닙니다"
      note="각 층을 제거한 뒤 task success·safety·latency·token을 같은 eval set에서 비교합니다."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {layers.map(([name, cadence, examples]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-2 font-mono text-xs leading-5 text-primary">
              {cadence}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {examples}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

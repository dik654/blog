import VizFrame from "@/components/viz/VizFrame";

const directions = [
  ["σ₁ = 8.0", "keep", "dominant pattern"],
  ["σ₂ = 3.0", "keep", "secondary pattern"],
  ["σ₃ = 0.4", "discard", "error +0.16"],
  ["σ₄ = 0.1", "discard", "error +0.01"],
] as const;

export default function LowRankBudgetViz() {
  return (
    <VizFrame eyebrow="Rank budget" title="k=2이면 큰 두 방향을 남기고 나머지를 reconstruction error로 보냅니다" description="수치는 메커니즘 설명용입니다. 실제 k는 singular spectrum과 downstream evaluation으로 정합니다.">
      <div className="divide-y divide-border/70">
        {directions.map(([value, action, result], index) => (
          <div key={value} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_8rem_6rem_1fr] sm:items-center sm:gap-5">
            <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
            <span className="font-mono text-sm font-semibold">{value}</span>
            <span className="text-xs font-bold text-foreground">{action}</span>
            <span className="text-xs leading-5 text-muted-foreground sm:text-right">{result}</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

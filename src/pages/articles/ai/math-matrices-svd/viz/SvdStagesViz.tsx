import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Vᵀ", "input basis", "orthonormal coordinates"],
  ["Σ", "direction scale", "σ₁ ≥ σ₂ ≥ … ≥ 0"],
  ["U", "output basis", "orthonormal placement"],
] as const;

export default function SvdStagesViz() {
  return (
    <VizFrame eyebrow="SVD execution" title="입력을 돌리고, 축별로 늘리고, output 방향에 놓습니다" note="행렬은 하나지만 SVD는 어떤 input direction이 어떤 output direction으로 얼마나 강하게 전달되는지 분리해서 보여 줍니다.">
      <div className="grid gap-6 md:grid-cols-3">
        {stages.map(([symbol, role, detail]) => (
          <div key={symbol} className="min-w-0 border-t border-border/80 pt-4">
            <p className="font-mono text-base font-bold text-primary">{symbol}</p>
            <p className="mt-3 text-sm font-bold">{role}</p>
            <p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

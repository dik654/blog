import VizFrame from "@/components/viz/VizFrame";

const rows = [
  { expert: "E₁", load: "과다", bias: "낮춤", result: "cutoff 통과가 어려워짐" },
  { expert: "E₂", load: "목표", bias: "유지", result: "현재 순위 유지" },
  { expert: "E₃", load: "부족", bias: "높임", result: "cutoff 통과가 쉬워짐" },
] as const;

export default function QuantileBalancingViz() {
  return (
    <VizFrame
      eyebrow="Router control"
      title="Quantile Balancing은 선택 순위만 고치고 mixture weight는 원 score로 계산한다"
      description="Expert별 목표 load에 맞는 margin quantile로 bias를 갱신합니다. Bias는 Top-k cutoff를 넘을 확률을 조정하지만 최종 output weight에는 섞지 않습니다."
    >
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.expert} className="grid gap-2 border-b border-border/60 py-3 last:border-0 sm:grid-cols-[3rem_4rem_4rem_1fr] sm:items-center sm:gap-5">
            <strong className="font-mono text-xs text-foreground">{row.expert}</strong>
            <span className="text-xs text-muted-foreground">load {row.load}</span>
            <span className={row.bias === "유지" ? "text-xs font-bold text-foreground" : "text-xs font-bold text-primary"}>bias {row.bias}</span>
            <span className="text-xs leading-5 text-muted-foreground">{row.result}</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

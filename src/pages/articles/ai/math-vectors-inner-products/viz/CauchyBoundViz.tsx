import VizFrame from "@/components/viz/VizFrame";

const rows = [
  { relation: "같은 직선 방향", dot: "50", budget: "5 × 10 = 50", result: "등호" },
  { relation: "직각 방향", dot: "0", budget: "5 × 5 = 25", result: "상한보다 작음" },
] as const;

export default function CauchyBoundViz() {
  return (
    <VizFrame
      eyebrow="Upper bound"
      title="길이는 dot product가 사용할 수 있는 최대 예산입니다"
      description="방향이 완전히 맞으면 예산을 전부 쓰고, 직각이면 방향 성분이 상쇄되어 0이 됩니다."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1.1fr_0.75fr_1.15fr_0.9fr] gap-4 border-b border-border/80 pb-2 text-[10px] font-bold text-muted-foreground">
            <span>방향 관계</span><span>|u·v|</span><span>길이 예산</span><span>결과</span>
          </div>
          {rows.map((row) => (
            <div key={row.relation} className="grid grid-cols-[1.1fr_0.75fr_1.15fr_0.9fr] gap-4 border-b border-border/60 py-4 text-xs last:border-0">
              <span className="font-bold text-foreground">{row.relation}</span>
              <span className="font-mono text-foreground">{row.dot}</span>
              <span className="font-mono text-muted-foreground">{row.budget}</span>
              <span className="font-bold text-primary">{row.result}</span>
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}

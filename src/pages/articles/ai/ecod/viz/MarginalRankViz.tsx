import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["거래액", "₩12K · ₩18K · ₩24K · ₩910K", "¼ · ½ · ¾ · 1"],
  ["접속 시간", "2s · 4s · 5s · 39s", "¼ · ½ · ¾ · 1"],
] as const;

export default function MarginalRankViz() {
  return (
    <VizFrame
      eyebrow="Marginal ECDF"
      title="단위가 달라도 feature 내부의 순위는 같은 0~1 좌표로 바뀝니다"
      description="ECOD는 row 전체의 거리를 재지 않고, 각 열을 따로 정렬해 현재 값 이하의 표본 비율을 계산합니다."
      note="단조 변환은 순서를 보존하지만, tie·결측값·중복 열은 ECDF와 최종 score에 직접 영향을 줍니다."
    >
      <div className="space-y-4">
        {rows.map(([feature, raw, rank]) => (
          <div key={feature} className="grid min-w-0 gap-3 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[7rem_1fr_1fr] md:items-center">
            <p className="text-sm font-bold text-foreground">{feature}</p>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground">raw values</p>
              <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">{raw}</p>
            </div>
            <div className="min-w-0 border-t border-border/60 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <p className="text-[11px] font-semibold text-primary">empirical rank</p>
              <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground">{rank}</p>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

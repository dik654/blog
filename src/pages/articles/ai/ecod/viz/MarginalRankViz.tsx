import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["거래액", "₩12K · ₩18K · ₩24K · ₩910K", "¼ · ½ · ¾ · 1", "1 · ¾ · ½ · ¼"],
  ["접속 시간", "2s · 4s · 5s · 39s", "¼ · ½ · ¾ · 1", "1 · ¾ · ½ · ¼"],
] as const;

export default function MarginalRankViz() {
  return (
    <VizFrame
      eyebrow="Marginal ECDF"
      title="넷째 row는 거래액과 접속 시간의 오른쪽 tail에서 모두 1/4입니다"
      description="원화와 초를 직접 더하지 않고 각 feature 안의 왼쪽·오른쪽 경험 비율로 바꿉니다."
      note="단조 변환은 순서를 보존하지만, tie·결측값·중복 열은 ECDF와 최종 score에 직접 영향을 줍니다."
    >
      <div className="space-y-4">
        {rows.map(([feature, raw, leftRank, rightRank]) => (
          <div key={feature} className="grid min-w-0 gap-3 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[7rem_1.4fr_1fr_1fr] md:items-center">
            <p className="text-sm font-bold text-foreground">{feature}</p>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground">raw values</p>
              <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">{raw}</p>
            </div>
            <div className="min-w-0 border-t border-border/60 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <p className="text-[11px] font-semibold text-primary">empirical rank</p>
              <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground">F_L: {leftRank}</p>
            </div>
            <div className="min-w-0 border-t border-border/60 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <p className="text-[11px] font-semibold text-primary">right tail</p>
              <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground">F_R: {rightRank}</p>
            </div>
          </div>
        ))}
        <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          Row 4는 두 feature 모두 min(F_L,F_R)=1/4입니다. 이는 tail evidence이며 fraud 확정값이 아닙니다.
        </p>
      </div>
    </VizFrame>
  );
}

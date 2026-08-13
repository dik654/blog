import VizFrame from "@/components/viz/VizFrame";

const claims = [
  ["구성표", "69 KDA · 24 MLA · 896/16 experts", "재현 가능한 사실"],
  ["방법", "KDA · Block AttnRes · Stable LatentMoE 식", "공개 방법"],
  ["종합 효율", "K2 대비 약 2.5× scaling efficiency", "프로젝트 종합 주장"],
  ["개별 기여", "3:1 비율·KDA만의 full-scale gain", "공개 ablation 부족"],
  ["Benchmark", "model + harness + tool + effort", "조건부 system 측정"],
] as const;

export default function EvidenceLedgerViz() {
  return (
    <VizFrame
      eyebrow="Evidence ledger"
      title="공개된 구성과 관측된 결과 사이에 인과 추론을 한 칸 남긴다"
      description="구성표와 방법은 재현할 수 있지만, 최종 benchmark의 증가분을 각 부품에 나누려면 동일 scale의 controlled ablation이 필요합니다."
    >
      <div className="space-y-1">
        {claims.map(([kind, claim, status]) => (
          <div key={kind} className="grid gap-2 border-b border-border/60 py-4 last:border-0 sm:grid-cols-[5rem_1fr_8rem] sm:items-center sm:gap-5">
            <strong className="text-xs text-foreground">{kind}</strong>
            <span className="text-xs leading-5 text-foreground/75">{claim}</span>
            <span className="text-xs leading-5 text-muted-foreground">{status}</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

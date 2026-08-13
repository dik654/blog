import VizFrame from "@/components/viz/VizFrame";

const axes = [
  {
    axis: "Sequence",
    pressure: "1M token의 상태·interaction",
    mechanism: "KDA + Gated MLA",
    outcome: "고정 recurrent state + 주기적 global read",
  },
  {
    axis: "Depth",
    pressure: "93 layer의 정보 누적",
    mechanism: "Block AttnRes",
    outcome: "9개 block-level source를 선택",
  },
  {
    axis: "Width",
    pressure: "2.8T expert capacity",
    mechanism: "Stable LatentMoE",
    outcome: "104B active path와 안정화 장치",
  },
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="Architecture map"
      title="K3는 sequence·depth·width의 병목을 서로 다른 장치로 푼다"
      description="총 parameter 하나로 읽지 않고, 각 축에서 무엇을 압축하고 무엇을 다시 보강했는지 분리합니다."
      note="세 설계가 함께 들어간 최종 모델의 결과는 공개됐지만, 2.8T 전체 scale에서 각 부품만 제거한 독립 기여도는 같은 수준으로 공개되지 않았습니다."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {axes.map((item, index) => (
          <section key={item.axis} className="min-w-0 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{item.axis}</p>
              <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">{item.pressure}</p>
            <div className="my-4 flex items-center gap-3 text-xs">
              <span className="h-px flex-1 bg-border" />
              <span className="font-bold text-primary">{item.mechanism}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs font-semibold leading-5 text-foreground">{item.outcome}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}

import VizFrame from "@/components/viz/VizFrame";

const stages = [
  {
    index: "01",
    title: "Surprisal",
    formula: "−log Q(x)",
    body: "모델이 실제 사건 x를 얼마나 뜻밖이라고 평가했는지 잽니다.",
  },
  {
    index: "02",
    title: "Expectation",
    formula: "Eₚ[·]",
    body: "한 사건의 값을 실제 데이터 분포 P로 평균냅니다.",
  },
  {
    index: "03",
    title: "Cross-entropy",
    formula: "Eₚ[−log Q]",
    body: "실제 데이터에 모델 Q의 코드 길이를 적용했을 때의 평균 비용입니다.",
  },
  {
    index: "04",
    title: "Learning objective",
    formula: "minθ empirical mean",
    body: "알 수 없는 P의 기대값을 유한한 training set 평균으로 근사합니다.",
  },
];

export default function InformationObjectiveMapViz() {
  return (
    <VizFrame
      eyebrow="Information → objective"
      title="Cross-entropy는 별개의 공식이 아니라 정보량을 평균낸 결과입니다"
      description="한 사건의 surprisal에서 시작해 모집단 기대값과 실제 training objective까지 내려갑니다."
      note="P는 실제 데이터 분포이고 Q는 모델이 예측한 분포입니다. 학습 중에는 P 자체가 아니라 training sample만 관찰합니다."
    >
      <div className="grid gap-3 md:grid-cols-4">
        {stages.map((stage) => (
          <div key={stage.title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">{stage.index}</p>
              <p className="truncate font-mono text-[11px] text-primary">{stage.formula}</p>
            </div>
            <p className="mt-5 font-semibold text-foreground">{stage.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.body}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

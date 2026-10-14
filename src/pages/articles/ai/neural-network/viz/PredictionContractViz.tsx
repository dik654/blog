import VizFrame from "@/components/viz/VizFrame";

const contracts = [
  [
    "실수 하나 예측",
    "연속값",
    "제한 없는 값 또는 분포 매개변수",
    "가정한 잡음에 맞는 손실",
  ],
  [
    "0/1 또는 여러 독립 표지",
    "표지마다 별도 사건",
    "표지마다 로짓 하나",
    "로짓 결합 이진 교차 엔트로피",
  ],
  [
    "서로 배타적인 K개 답",
    "K개 중 하나",
    "K개 로짓",
    "소프트맥스 교차 엔트로피",
  ],
  [
    "양수·개수·구간 안의 값",
    "값의 범위가 제한됨",
    "범위를 지키는 분포 매개변수",
    "가정한 가능도",
  ],
] as const;

export default function PredictionContractViz() {
  return (
    <VizFrame
      eyebrow="출력 약속"
      title="출력층은 답의 모양과 손실을 한 묶음으로 정합니다"
      description="답이 서로 경쟁하는지, 동시에 참일 수 있는지, 연속값인지부터 확인합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map(([task, event, output, loss]) => (
          <article
            key={task}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="text-sm font-bold text-foreground">{task}</p>
            <dl className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="text-muted-foreground">사건</dt>
              <dd className="min-w-0 break-words text-foreground/80">
                {event}
              </dd>
              <dt className="text-muted-foreground">출력</dt>
              <dd className="min-w-0 break-words text-primary">{output}</dd>
              <dt className="text-muted-foreground">채점</dt>
              <dd className="min-w-0 break-words text-foreground/80">{loss}</dd>
            </dl>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}

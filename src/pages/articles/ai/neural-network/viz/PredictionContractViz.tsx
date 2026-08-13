import VizFrame from "@/components/viz/VizFrame";

const contracts = [
  ["실수 회귀", "ℝ", "identity / distribution parameter", "Gaussian NLL·MSE 등"],
  ["Binary·multi-label", "각 label이 독립 Bernoulli", "label별 logit", "BCE with logits"],
  ["서로 배타적 K-class", "하나의 categorical event", "K개 logits", "softmax cross-entropy"],
  ["양수·count·구간값", "support가 제한된 분포", "softplus·exp·분포 parameter", "가정한 likelihood"],
];

export default function PredictionContractViz() {
  return (
    <VizFrame
      eyebrow="Prediction contract"
      title="출력층은 값의 범위보다 target이 어떤 확률 사건인지부터 정합니다"
      description="Activation과 loss를 독립적인 메뉴처럼 고르지 않고, target support와 class 관계에서 함께 결정합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map(([task, event, output, loss]) => (
          <article key={task} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-bold text-foreground">{task}</p>
            <dl className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="text-muted-foreground">사건</dt><dd className="min-w-0 break-words text-foreground/80">{event}</dd>
              <dt className="text-muted-foreground">모델 출력</dt><dd className="min-w-0 break-words font-mono text-primary">{output}</dd>
              <dt className="text-muted-foreground">Objective</dt><dd className="min-w-0 break-words text-foreground/80">{loss}</dd>
            </dl>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}

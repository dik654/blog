import VizFrame from "@/components/viz/VizFrame";

const choices = [
  {
    observation: "연속값 y",
    assumption: "y | x ~ Gaussian(μθ(x), σ²)",
    output: "평균 μθ(x)",
    loss: "MSE (σ가 고정일 때)",
    caution: "outlier에 제곱으로 민감",
  },
  {
    observation: "둘 중 하나",
    assumption: "y | x ~ Bernoulli(pθ(x))",
    output: "sigmoid probability",
    loss: "binary cross-entropy",
    caution: "logit 입력 함수 사용",
  },
  {
    observation: "K개 중 하나",
    assumption: "y | x ~ Categorical(πθ(x))",
    output: "softmax probabilities",
    loss: "categorical cross-entropy",
    caution: "class index 또는 soft label",
  },
];

export default function LikelihoodChoiceViz() {
  return (
    <VizFrame
      eyebrow="Loss selection"
      title="Loss는 문제 이름보다 관측 분포의 가정에서 결정됩니다"
      description="출력 layer와 loss를 한 쌍으로 보고, 실제 배포 지표와 calibration은 별도로 검증합니다."
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {choices.map((choice) => (
          <article key={choice.observation} className="min-w-0 rounded-lg border border-border/70 bg-background p-4 sm:p-5">
            <p className="text-xs font-bold text-primary">{choice.observation}</p>
            <dl className="mt-5 space-y-4 text-sm">
              <Row term="분포 가정" detail={choice.assumption} mono />
              <Row term="모델 출력" detail={choice.output} />
              <Row term="NLL" detail={choice.loss} />
              <Row term="확인할 점" detail={choice.caution} />
            </dl>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}

function Row({ term, detail, mono = false }: { term: string; detail: string; mono?: boolean }) {
  return (
    <div className="border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
      <dt className="text-xs text-muted-foreground">{term}</dt>
      <dd className={`mt-1 break-words font-medium leading-6 text-foreground ${mono ? "font-mono text-xs" : ""}`}>{detail}</dd>
    </div>
  );
}

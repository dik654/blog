import ExplainedFormula from "@/components/ui/explained-formula";
import ScalingDecisionViz from "./viz/ScalingDecisionViz";

export default function ScalingLaws() {
  return (
    <section id="scaling-laws" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Scaling law는 model 크기 정답표가 아니라 관측 범위 안에서 예산을
        배분하는 경험 모델이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Language-model validation loss는 일정 범위에서 parameter 수와 training
          token 수에 대해 매끄러운 power-law 경향을 보였습니다. 이 곡선은 작은
          pilot run에서 큰 run의 loss를 추정하고 고정 compute를 model과 data에
          나누는 데 유용하지만, architecture·data mixture·optimizer·evaluation
          domain이 바뀌면 coefficient도 다시 추정해야 합니다.
        </p>
      </div>

      <div id="paper-scaling-laws" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Scaling Laws for Neural Language Models</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Kaplan 등은 고정된 실험 family에서 loss가 model size·data·compute에 대해 power-law로 변하는 경향과 compute allocation을 분석했습니다. Fitted exponent는 architecture·data·optimization 범위에 의존하며, 특정 capability나 serving cost까지 직접 예측하는 universal law가 아닙니다.</p>
      </div>
      <div id="paper-chinchilla" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Training Compute-Optimal Large Language Models</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Chinchilla 연구는 고정 training compute에서 model parameter와 training token을 함께 늘려야 한다는 배분을 재추정하고 70B model을 1.4T token으로 학습해 비교했습니다. 이 비율은 당시 model family·data·FLOP 회계의 training-optimal 결과이며 inference traffic과 latency까지 포함한 product optimum은 아닙니다.</p>
      </div>

      <ScalingDecisionViz />

      <ExplainedFormula
        question="Parameter N과 training token D가 늘어날 때 reducible loss를 어떻게 근사하는가?"
        idea={
          <>
            무한한 model·data에서도 남는 irreducible term에 parameter-limited
            term과 data-limited term을 더합니다. 각 term은 power law로 줄어들며
            exponent와 coefficient는 실험 family에 fit합니다.
          </>
        }
        formula={String.raw`L(N,D)\approx L_\infty+aN^{-\alpha}+bD^{-\beta}`}
        terms={[
          {
            symbol: "L_\infty",
            name: "irreducible floor",
            description:
              "주어진 data distribution과 objective에서 scale만으로 없애기 어려운 loss floor입니다.",
          },
          {
            symbol: "N",
            name: "model parameters",
            description:
              "연구마다 non-embedding parameter 등 counting contract가 다를 수 있습니다.",
          },
          {
            symbol: "D",
            name: "training tokens",
            description:
              "Deduplication·quality·epoch reuse를 포함한 실제 학습 token budget입니다.",
          },
          {
            symbol: "\\alpha,\\beta",
            name: "empirical exponents",
            description:
              "Observed range의 run에 fit한 감소율이며 universal constant가 아닙니다.",
          },
        ]}
        assumptions={[
          "같은 model family·data distribution·training recipe 안에서의 근사입니다.",
          "FLOPs budget·inference cost·memory·latency constraint는 이 두-variable 식 밖에서 별도로 고려합니다.",
        ]}
        interpretation="Chinchilla의 parameter당 약 20 token은 해당 실험 범위의 compute-optimal 근사입니다. 반복 serving 비용이나 data scarcity가 중요하면 training-optimal 지점과 product-optimal 지점은 달라질 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Aggregate loss가 매끄럽게 감소해도 특정 benchmark capability가 언제
          나타날지는 바로 나오지 않습니다. Metric threshold, prompt format,
          sampling variance와 contamination이 겉보기의 emergent jump를 만들 수
          있으므로 scale claim에는 evaluation protocol과 confidence interval을
          함께 남깁니다.
        </p>
      </div>
    </section>
  );
}

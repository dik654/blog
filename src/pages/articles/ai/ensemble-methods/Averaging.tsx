import ExplainedFormula from "@/components/ui/explained-formula";
import AveragingViz from "./viz/AveragingViz";

export default function Averaging() {
  return (
    <section id="averaging" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 뜻의 prediction은 평균하고, scale이 다르면 먼저 무엇을 보존할지 정합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Regression prediction이나 같은 class order의 calibrated probability처럼 숫자의 의미가 같다면 arithmetic mean이 가장
          해석하기 쉬운 baseline입니다. Probability를 합칠 때는 각 row에서 class 합이 1인지 확인하고, regression에서 log target을
          썼다면 원래 단위로 inverse transform한 뒤 결합할지 log 공간에서 결합할지 loss 의미에 맞춰 정합니다.
        </p>
        <p>
          Weighted average는 OOF objective에서 weight를 정합니다. 음수 weight까지 자유롭게 허용하면 cancellation으로 OOF noise를
          과도하게 맞출 수 있으므로 처음에는 non-negative simplex 제약을 사용합니다. Weight를 찾는 과정 자체도 model selection이므로
          여러 weight search를 비교했다면 별도 outer evaluation이 필요합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Prediction scale을 보존하면서 여러 모델에 서로 다른 비중을 주려면 어떤 제약이 단순한 출발점일까요?"
        idea={<>각 row의 prediction을 non-negative weights로 평균하고 weight 합을 1로 둡니다. 그러면 결합값이 base predictions의 범위 안에 남습니다.</>}
        formula={String.raw`\widehat y_i^{\mathrm{ens}}=\sum_{m=1}^{M}w_m\widehat y_{im},\qquad w_m\ge0,\quad \sum_{m=1}^{M}w_m=1`}
        terms={[
          { symbol: "y-hat_im", name: "aligned prediction", description: "동일 row i와 동일 output/class 의미에 맞춘 m번째 model prediction입니다." },
          { symbol: "w_m", name: "simplex weight", description: "0 이상이고 전체 합이 1인 model별 비중입니다." },
          { symbol: "y-hat_i^ens", name: "ensemble prediction", description: "Base prediction들의 convex combination으로 얻은 결합 결과입니다." },
        ]}
        assumptions={[
          "Row ID·class order·target inverse transform·missing-value 처리가 모든 prediction artifact에서 같습니다.",
          "Weight는 OOF/validation prediction으로 선택하고 test prediction으로 조정하지 않습니다.",
          "Probability average 뒤 calibration은 별도의 held-out calibration data에서 확인합니다.",
        ]}
        interpretation="두 모델 prediction이 .2와 .8이고 weights가 .25와 .75라면 ensemble은 .65입니다. Simplex 안에서는 .2–.8 범위를 벗어나지 않습니다."
      />

      <ExplainedFormula
        question="점수 scale을 믿을 수 없고 순서만 결합하려면 각 모델의 rank를 어떻게 같은 범위로 맞출까요?"
        idea={<>각 model 안에서 prediction보다 작거나 같은 OOF 값의 비율을 구해 0–1 percentile rank로 바꾼 뒤 평균합니다.</>}
        formula={String.raw`r_{im}=\frac{1}{n}\sum_{j=1}^{n}\mathbf 1[\widehat y_{jm}\le \widehat y_{im}],\qquad r_i^{\mathrm{ens}}=\sum_m w_m r_{im}`}
        terms={[
          { symbol: "r_im", name: "empirical percentile rank", description: "Model m에서 row i prediction이 OOF sample 중 어느 percentile인지 나타냅니다." },
          { symbol: "indicator", name: "ordering comparison", description: "j번째 prediction이 i번째 이하이면 1, 아니면 0입니다." },
          { symbol: "n", name: "reference rows", description: "Rank mapping을 만든 OOF/validation rows 수입니다." },
        ]}
        assumptions={[
          "Tie 처리와 test-time empirical-CDF mapping 방법을 미리 고정합니다.",
          "Rank average는 score 간 거리와 probability calibration 정보를 버립니다.",
          "Log loss·expected cost·fixed probability threshold가 목적이면 rank output을 그대로 probability로 쓰지 않습니다.",
        ]}
        interpretation="한 모델의 score가 0–1이고 다른 모델이 −20–80이어도 percentile은 같은 0–1 범위가 됩니다. 대신 0.51과 0.99의 confidence 차이는 사라집니다."
      />

      <div className="not-prose my-8"><AveragingViz /></div>
    </section>
  );
}

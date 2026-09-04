import ExplainedFormula from "@/components/ui/explained-formula";
import AveragingViz from "./viz/AveragingViz";

export default function Averaging() {
  return (
    <section id="averaging" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 뜻의 prediction은 평균하고, scale이 다르면 먼저 무엇을 보존할지 정합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Regression prediction이나 같은 class order의 calibrated probability처럼 숫자의 의미가 같다면 arithmetic mean이 가장
          해석하기 쉬운 baseline입니다. Probability를 합칠 때는 각 row에서 class 합이 1인지 확인합니다. log target을 쓴 regression이라면 원래
          단위로 inverse transform한 뒤 결합할지, log 공간에서 결합할지를 loss 의미에 맞춰 정합니다.
        </p>
        <p>
          Weighted average는 OOF objective에서 weight를 정합니다. 음수 weight까지 자유롭게 허용하면 cancellation으로 OOF noise를 과도하게
          맞출 수 있으므로 처음에는 non-negative simplex 제약을 씁니다. Weight를 찾는 과정 자체도 model selection입니다. 여러 weight search를
          비교했다면 그 비교는 별도 outer evaluation에서 판정합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Prediction scale을 보존하면서 여러 모델에 서로 다른 비중을 주려면 어떤 제약이 단순한 출발점일까요?"
        idea={<>각 row의 prediction을 non-negative weights로 평균하고 weight 합을 1로 둡니다. 그러면 결합값이 base predictions의 범위 안에 남습니다.</>}
        formula={String.raw`\begin{aligned}
          \widehat y_i^{\mathrm{ens}}&=\sum_{m=1}^{M}w_m\widehat y_{im} \\
          w_m&\ge 0 \\
          \sum_{m=1}^{M}w_m&=1
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          \widehat y_i^{\mathrm{ens}}&=\underbrace{\sum_{m=\underbrace{1}_{\text{simplex weight 계산}}}^{M}w_m\widehat y_{im}}_{\text{simplex weight 계산}} \\
          w_m&\ge \underbrace{0}_{\text{simplex weight 계산}} \\
          \sum_{m=1}^{M}w_m&=1
        \end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{m=1}^{M}w_m\widehat y_{im}`, annotation: ["simplex weight이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 row의 prediction을 non-negative","weights로 평균하고 weight 합을 1로 둡니다."] },
          { expression: String.raw`0`, annotation: ["simplex weight이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 row의 prediction을 non-negative","weights로 평균하고 weight 합을 1로 둡니다."] },
          { expression: String.raw`1`, annotation: ["simplex weight이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 row의 prediction을 non-negative","weights로 평균하고 weight 합을 1로 둡니다."] },
        ]}
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
        formula={String.raw`\begin{aligned}
          r_{im}&=\frac{1}{n}\sum_{j=1}^{n}
          \mathbf 1(\widehat y_{jm}\le\widehat y_{im}) \\
          r_i^{\mathrm{ens}}&=\sum_m w_m r_{im}
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          r_{im}&=\underbrace{\frac{1}{n}\sum_{j=1}^{n}
          \mathbf 1(\widehat y_{jm}\le\widehat y_{im})}_{\text{기준량당 비율}} \\
          r_i^{\mathrm{ens}}&=\underbrace{\sum_m w_m r_{im}}_{\text{오른쪽 항으로 결과 계산}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\frac{1}{n}\sum_{j=1}^{n}
          \mathbf 1(\widehat y_{jm}\le\widehat y_{im})`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 model 안에서 prediction보다"] },
          { expression: String.raw`\sum_m w_m r_{im}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","각 model 안에서 prediction보다"] },
        ]}
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
        interpretation="OOF score가 [0.10, 0.40, 0.40, 0.90]이고 ‘현재 값 이하’를 세면 0.40의 rank는 3/4=.75입니다. 모델마다 score 범위가 달라도 0–1 순서 척도로 맞출 수 있지만, 원래 값 사이의 거리와 probability calibration은 사라지므로 tie 규칙과 test-time mapping을 고정해야 합니다."
      />

      <div className="not-prose my-8"><AveragingViz /></div>
    </section>
  );
}

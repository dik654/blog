import ExplainedFormula from "@/components/ui/explained-formula";
import RegressionMetricsViz from "./viz/RegressionMetricsViz";

export default function Regression() {
  return (
    <section id="regression" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">회귀에서는 residual의 크기뿐 아니라, 어떤 중심값을 예측하게 만드는지도 확인합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          실제값이 <code>y</code>, 예측값이 <code>ŷ</code>라면 residual은 <code>r = y − ŷ</code>입니다. MAE와 RMSE는 같은 residual을
          사용하지만 비용 곡선이 다릅니다. MAE는 오차가 두 배면 비용도 두 배가 되고, RMSE의 바탕인 squared error는 오차가 두 배면
          제곱 비용이 네 배가 됩니다. 그래서 outlier가 있는 상황에서 두 지표의 model 순위가 달라질 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 residual 목록에서 MAE와 RMSE는 큰 오차를 얼마나 다르게 취급할까요?"
        idea={<>MAE는 절댓값을, RMSE는 제곱의 평균에 다시 제곱근을 취합니다. 제곱근은 원래 단위로 돌아오게 하지만 큰 residual에 이미 부여된 큰 가중치는 되돌리지 않습니다.</>}
        formula={String.raw`r_i=y_i-\hat y_i,\qquad \operatorname{MAE}=\frac{1}{n}\sum_{i=1}^{n}|r_i|,\qquad \operatorname{RMSE}=\sqrt{\frac{1}{n}\sum_{i=1}^{n}r_i^2}`}
        terms={[
          { symbol: "r_i", name: "residual", description: "i번째 실제값에서 예측값을 뺀 signed error입니다." },
          { symbol: "absolute value", name: "absolute penalty", description: "오차 방향을 없애되 크기에는 선형으로 비례합니다." },
          { symbol: "squared residual", name: "quadratic penalty", description: "큰 오차가 평균에 훨씬 크게 기여하게 만듭니다." },
          { symbol: "n", name: "evaluation count", description: "이 식에서 동일 weight로 평균낸 evaluation unit 수입니다." },
        ]}
        assumptions={[
          "Target 단위와 evaluation unit이 모든 candidate에서 같습니다.",
          "Sample weight가 있으면 분모도 weight 합으로 바꾸고, entity별 반복 행은 reducer를 먼저 적용합니다.",
          "RMSE가 큰 오차를 강조하는 것이 실제 비용과 맞는지 확인합니다.",
        ]}
        interpretation="Residual이 [1,1,1,9]이면 MAE는 3이지만 RMSE는 약 4.58입니다. 마지막 오차 하나가 치명적이라면 RMSE가 의도에 가깝고, 단위당 비용이 일정하다면 MAE가 더 자연스럽습니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          더 중요한 차이는 population에서 이 loss를 최소화하는 예측값입니다. Squared loss는 조건부 평균을, absolute loss는 조건부
          중앙값을 목표로 합니다. 즉 label distribution이 한쪽으로 길게 늘어진 경우 metric을 바꾸면 같은 model의 점수만 바뀌는 것이
          아니라 학습이 지향하는 답 자체가 달라집니다.
        </p>
      </div>

      <ExplainedFormula
        question="왜 squared loss model은 평균을, absolute loss model은 중앙값을 예측하게 될까요?"
        idea={<>Squared risk를 예측값 a로 미분하면 양쪽 signed residual의 합이 0이 되는 평균에서 멈춥니다. Absolute risk는 a의 왼쪽과 오른쪽 probability mass가 균형을 이루는 중앙값에서 기울기 부호가 바뀝니다.</>}
        formula={String.raw`a_2^*(x)=\arg\min_a\mathbb E[(Y-a)^2\mid X=x]=\mathbb E[Y\mid X=x],\qquad a_1^*(x)\in\arg\min_a\mathbb E[|Y-a|\mid X=x]=\operatorname{Median}(Y\mid X=x)`}
        terms={[
          { symbol: "a", name: "candidate point prediction", description: "입력 x에서 하나의 수로 내놓을 예측 후보입니다." },
          { symbol: "a2*", name: "squared-risk Bayes act", description: "조건부 squared error를 가장 작게 하는 population 예측값입니다." },
          { symbol: "a1*", name: "absolute-risk Bayes act", description: "조건부 absolute error를 가장 작게 하는 population 예측값입니다." },
          { symbol: "conditional expectation", name: "conditional mean", description: "입력 x가 주어졌을 때 Y 분포의 평균입니다." },
        ]}
        assumptions={[
          "Squared loss에는 조건부 2차 moment가 존재해야 합니다.",
          "Median이 여러 개이면 absolute-risk minimizer도 구간으로 여러 개일 수 있습니다.",
          "Finite evaluation score의 우열과 population minimizer 정리는 구분합니다.",
        ]}
        interpretation="Y가 0일 확률 0.9, 100일 확률 0.1이면 평균은 10이고 중앙값은 0입니다. 드문 큰 값을 어느 정도 따라가야 하는지가 곧 metric 선택입니다."
      />

      <div className="not-prose my-8"><RegressionMetricsViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Percentage error는 scale이 다른 대상을 비교하기 편해 보이지만 실제값이 0에 가까우면 폭발하고, 음수에서는 직관이 무너집니다.
          RMSLE는 양수 target의 비율 차이에 가깝지만 log 변환 domain과 원래 단위로 되돌릴 때의 bias를 확인해야 합니다. R²는 상수 평균
          baseline과 비교한 squared error 비율이므로 실제 오차 단위를 대신하지 않으며 test에서 음수가 될 수도 있습니다.
        </p>
        <p>
          Point prediction 하나로 부족한 문제라면 interval을 함께 평가합니다. 넓은 interval은 coverage를 쉽게 높일 수 있으므로
          coverage와 width를 한 숫자로 뭉치지 않습니다. 먼저 목표 coverage를 guardrail로 정하고, 그 조건을 만족하는 후보 사이에서
          interval width와 subgroup별 miss를 비교합니다.
        </p>
      </div>

      <ExplainedFormula
        question="예측 구간은 정답을 많이 포함하기만 하면 좋은 것일까요?"
        idea={<>구간 포함률과 평균 폭을 함께 기록합니다. 모든 실수를 덮는 무한히 넓은 구간은 coverage는 높지만 아무 결정에도 도움이 되지 않습니다.</>}
        formula={String.raw`\widehat{\operatorname{Cov}}=\frac{1}{n}\sum_{i=1}^{n}\mathbf 1\{L_i\le y_i\le U_i\},\qquad \widehat W=\frac{1}{n}\sum_{i=1}^{n}(U_i-L_i)`}
        terms={[
          { symbol: "Li, Ui", name: "prediction interval", description: "i번째 입력에서 model이 제시한 아래·위 경계입니다." },
          { symbol: "indicator", name: "coverage indicator", description: "실제값이 구간 안에 있으면 1, 아니면 0입니다." },
          { symbol: "Cov hat", name: "empirical coverage", description: "Evaluation units 중 실제값을 포함한 비율입니다." },
          { symbol: "W hat", name: "mean interval width", description: "같은 target 단위로 측정한 구간 폭의 평균입니다." },
        ]}
        assumptions={[
          "Nominal coverage와 finite-sample 또는 asymptotic 보장은 interval construction method의 전제에 따라 별도로 확인합니다.",
          "전체 coverage가 맞아도 subgroup·horizon·target magnitude별 conditional coverage는 다를 수 있습니다.",
          "비교 후보는 같은 target transform과 evaluation population을 사용합니다.",
        ]}
        interpretation="90% interval이 실제로 91%를 포함하더라도 평균 폭이 target 범위 전체와 같다면 유용성이 낮습니다. Coverage guardrail을 지키면서 더 좁은 후보를 찾습니다."
      />

      <div id="paper-regression-quantiles" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">기반 논문 · Regression Quantiles</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Koenker와 Bassett는 squared error로 조건부 평균 하나만 추정하는 대신 asymmetric absolute loss로 조건부 quantile을 추정하는
          regression을 제시했습니다. 이 글은 그 아이디어를 point prediction과 interval 경계의 출발점으로 사용하지만, 어떤 두 quantile을
          고르기만 하면 distribution shift에서도 coverage가 보장된다고 확대해서 해석하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.2307/1913643" target="_blank" rel="noreferrer">논문 출판 정보 보기</a>
      </div>
    </section>
  );
}

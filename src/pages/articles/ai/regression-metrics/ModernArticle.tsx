import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  RegressionMetricLocator,
  RegressionMetricReturn,
} from "../shared/MetricDecisionPathLocator";
import RegressionMetricDecisionViz from "./RegressionMetricDecisionViz";

export default function RegressionMetricsArticle() {
  return (
    <div className="space-y-16">
      <RegressionMetricLocator />
      <RegressionMetricDecisionViz />

      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">오차를 비용으로 바꾸면 좋은 예측의 기준도 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            배송 지연 네 건이 <code>[0, 0, 0, 100]</code>분이라고 하겠습니다.
            세 건은 제시간에 도착했고 한 건만 100분 늦은 설명용 사례입니다.
            이 글의 모든 수치는 계산을 연결하기 위한 가정이며 실제 서비스 측정값이 아닙니다.
          </p>
          <p>
            예측값을 0분으로 두면 세 건을 정확히 맞히지만 마지막 한 건에서 100분을
            틀립니다. 25분으로 두면 네 건을 모두 조금씩 틀리지만 가장 큰 오차가
            75분으로 줄어듭니다. MAE는 첫 예측을, RMSE는 둘째 예측을 더 좋게 봅니다.
            두 지표가 같은 잔차에 서로 다른 비용을 붙이기 때문입니다.
          </p>
        </div>
        <ContentBoundary article="regression-metrics" />
        <TermBreakdown
          title="한 수치 예측을 평가하는 네 요소"
          items={[
            {
              term: "실제값 y",
              description: "관측된 결과와 그 단위입니다.",
              example: "배송 지연 100분",
              boundary: "검열이나 늦은 정답 확정이 있으면 관측값의 의미부터 다시 고정합니다.",
            },
            {
              term: "예측값 ŷ",
              description: "모델이 같은 단위로 내놓은 하나의 수입니다.",
              example: "예상 지연 25분",
              boundary: "로그값을 예측했다면 원래 단위로 되돌리는 규칙도 평가 계약에 포함합니다.",
            },
            {
              term: "잔차 r",
              description: "실제값에서 예측값을 뺀 방향 있는 오차입니다.",
              example: "100−25=+75분",
              boundary: "절댓값과 제곱은 잔차 자체가 아니라 잔차에 붙인 비용입니다.",
            },
            {
              term: "예측 구간 [L,U]",
              description: "결과 하나가 들어올 것으로 제시한 아래·위 경계입니다.",
              example: "지연 [0분, 30분]",
              boundary: "모수의 신뢰구간과 개별 결과의 예측 구간을 구분합니다.",
            },
          ]}
        />
      </section>

      <section id="residual-penalty" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">MAE는 오차 크기를 더하고, RMSE는 큰 오차를 먼저 제곱합니다</h2>
        <ExplainedFormula
          question="예측값을 0분에서 25분으로 바꾸면 두 지표는 어떻게 달라집니까?"
          idea={
            <p>
              먼저 각 배송의 잔차를 만듭니다. MAE는 절댓값을 평균하고, RMSE는
              제곱값을 평균한 뒤 제곱근을 취합니다. 따라서 100분짜리 오차 하나는
              MAE 합에서 100만큼, 제곱 오차 합에서는 10,000만큼 기여합니다.
            </p>
          }
          formula={String.raw`r_i=y_i-\hat y_i,\quad \mathrm{MAE}=\frac1n\sum_i|r_i|,\quad \mathrm{RMSE}=\sqrt{\frac1n\sum_i r_i^2}`}
          annotatedFormula={String.raw`\begin{aligned}r_i&=\underbrace{y_i-\hat y_i}_{\text{방향 있는 오차}}\\a_i&=\underbrace{|r_i|}_{\text{오차 크기에 선형인 비용}}\\q_i&=\underbrace{r_i^2}_{\text{큰 오차를 더 키운 비용}}\\\mathrm{MAE}&=\underbrace{\frac1n\sum_i a_i}_{\text{절댓값 비용의 평균}}\\\mathrm{RMSE}&=\underbrace{\sqrt{\frac1n\sum_i q_i}}_{\text{원래 단위로 돌아온 제곱 비용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`y_i-\hat y_i`,
              annotation: ["실제값에서 예측값을 빼", "오차의 방향과 크기를 보존"],
            },
            {
              expression: String.raw`|r_i|`,
              annotation: ["부호만 없애", "오차 크기에 비례하는 비용을 계산"],
            },
            {
              expression: String.raw`r_i^2`,
              annotation: ["오차를 제곱해", "멀리 틀린 한 건의 비중을 확대"],
            },
            {
              expression: String.raw`\sqrt{n^{-1}\sum_i q_i}`,
              annotation: ["제곱 비용의 평균에 제곱근을 취해", "분 단위로 결과를 복원"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_i`,
              name: "잔차",
              description: "i번째 실제값과 예측값의 방향 있는 차이입니다.",
            },
            {
              symbol: String.raw`a_i`,
              name: "절댓값 비용",
              description: "오차가 1분 늘 때마다 같은 크기로 증가합니다.",
            },
            {
              symbol: String.raw`q_i`,
              name: "제곱 비용",
              description: "오차가 클수록 더 빠르게 증가합니다.",
            },
            {
              symbol: "n",
              name: "평가 단위 수",
              description: "여기서는 같은 가중치를 둔 배송 네 건입니다.",
            },
          ]}
          assumptions={[
            "네 배송을 서로 비교할 수 있는 같은 평가 단위로 봅니다.",
            "모든 후보는 분이라는 같은 목표 단위를 사용합니다.",
            "표본 가중치가 있다면 분모와 각 비용에 같은 가중 규칙을 적용합니다.",
          ]}
          interpretation="예측 0분의 잔차는 [0,0,0,100]이므로 MAE=25, RMSE=50입니다. 예측 25분의 잔차는 [-25,-25,-25,75]이므로 MAE=37.5, MSE=1875, RMSE≈43.30입니다. MAE는 0분을, RMSE는 25분을 고릅니다."
        />
      </section>

      <section id="bayes-act" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">절댓값 비용은 중앙값을, 제곱 비용은 평균을 고릅니다</h2>
        <ExplainedFormula
          question="같은 네 값에서 최적 예측이 0분과 25분으로 갈리는 이유는 무엇입니까?"
          idea={
            <p>
              절댓값 비용은 예측값 왼쪽과 오른쪽에 놓인 값의 수가 균형을 이루는
              중앙값에서 가장 작아집니다. 제곱 비용은 방향 있는 잔차의 합이 0이 되는
              평균에서 가장 작아집니다.
            </p>
          }
          formula={String.raw`\hat a_{\rm MAE}\in\operatorname{Median}(y_1,\ldots,y_n),\quad \hat a_{\rm MSE}=\bar y=\frac1n\sum_i y_i`}
          annotatedFormula={String.raw`\begin{aligned}\hat a_{\rm MAE}&\in\underbrace{\operatorname{Median}(0,0,0,100)}_{0\text{분}}\\\hat a_{\rm MSE}&=\underbrace{\frac{0+0+0+100}{4}}_{25\text{분}}\\\sum_i(y_i-\hat a_{\rm MSE})&=\underbrace{-25-25-25+75}_{0}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{Median}(0,0,0,100)`,
              annotation: ["정렬한 가운데 두 값이 모두 0이므로", "표본 중앙값 0을 선택"],
            },
            {
              expression: String.raw`(0+0+0+100)/4`,
              annotation: ["네 결과를 더해 네 건으로 나눠", "표본 평균 25를 계산"],
            },
            {
              expression: String.raw`\sum_i(y_i-25)=0`,
              annotation: ["25에서 양쪽 잔차를 더해", "제곱 비용의 기울기가 0임을 확인"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\hat a_{\rm MAE}`,
              name: "절댓값 비용의 최적점",
              description: "표본에서는 중앙값이 절댓값 비용의 합을 최소화합니다.",
            },
            {
              symbol: String.raw`\hat a_{\rm MSE}`,
              name: "제곱 비용의 최적점",
              description: "표본에서는 평균이 제곱 비용의 합을 최소화합니다.",
            },
            {
              symbol: String.raw`\bar y`,
              name: "표본 평균",
              description: "모든 실제값의 합을 평가 단위 수로 나눈 값입니다.",
            },
          ]}
          assumptions={[
            "지금 계산은 네 관측값에 대한 표본 최적점입니다.",
            "모집단에서는 입력이 주어졌을 때의 조건부 중앙값과 조건부 평균으로 일반화합니다.",
            "지표 선택은 드문 큰 지연을 따라갈 비용과 평소 오차 비용 중 무엇이 중요한지에 맞춥니다.",
          ]}
          interpretation="세 건의 정상 배송을 그대로 맞히는 일이 중요하면 MAE가 고른 0분이 유리합니다. 큰 지연 한 건의 오차를 더 강하게 줄여야 하면 제곱 비용이 고른 25분이 유리합니다. 어느 쪽이 옳은지는 지표가 아니라 실제 업무 비용이 결정합니다."
        />
      </section>

      <section id="interval" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">예측 구간은 목표 포함률을 통과한 뒤 폭을 비교합니다</h2>
        <ExplainedFormula
          question="[0,30]과 [0,100] 중 어느 예측 구간이 더 좋습니까?"
          idea={
            <p>
              실제값이 구간 안에 든 비율과 구간의 폭을 따로 계산합니다. 먼저 필요한
              포함률을 통과하는지 확인하고, 통과한 후보끼리 더 좁은 구간을 고릅니다.
              포함률만 높이려면 모든 값을 덮는 쓸모없이 넓은 구간도 만들 수 있기 때문입니다.
            </p>
          }
          formula={String.raw`\widehat{\mathrm{Cov}}=\frac1n\sum_i\mathbf1[L_i\le y_i\le U_i],\quad \widehat W=\frac1n\sum_i(U_i-L_i)`}
          annotatedFormula={String.raw`\begin{aligned}h_i&=\underbrace{\mathbf1[L_i\le y_i\le U_i]}_{\text{실제값이 구간 안이면 1}}\\\widehat{\mathrm{Cov}}&=\underbrace{\frac1n\sum_i h_i}_{\text{포함한 평가 단위의 비율}}\\w_i&=\underbrace{U_i-L_i}_{\text{한 구간의 폭}}\\\widehat W&=\underbrace{\frac1n\sum_i w_i}_{\text{평균 구간 폭}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[L_i\le y_i\le U_i]`,
              annotation: ["실제값을 두 경계와 비교해", "포함 여부를 0 또는 1로 기록"],
            },
            {
              expression: String.raw`n^{-1}\sum_i h_i`,
              annotation: ["포함 표시를 더해 평가 단위 수로 나눠", "경험적 포함률을 계산"],
            },
            {
              expression: String.raw`U_i-L_i`,
              annotation: ["위 경계에서 아래 경계를 빼", "같은 목표 단위의 폭을 계산"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`L_i,U_i`,
              name: "구간 경계",
              description: "i번째 예측 구간의 아래·위 값입니다.",
            },
            {
              symbol: String.raw`h_i`,
              name: "포함 표시",
              description: "실제값이 구간 안에 있으면 1, 아니면 0입니다.",
            },
            {
              symbol: String.raw`\widehat{\mathrm{Cov}}`,
              name: "경험적 포함률",
              description: "실제값을 포함한 평가 단위의 비율입니다.",
            },
            {
              symbol: String.raw`\widehat W`,
              name: "평균 폭",
              description: "같은 목표 단위로 계산한 구간 폭의 평균입니다.",
            },
          ]}
          assumptions={[
            "모든 배송에 같은 구간을 적용하는 설명용 계산입니다.",
            "목표 포함률은 결과를 보기 전에 정합니다.",
            "전체뿐 아니라 지역·시간대·배송 유형별 포함률도 따로 확인합니다.",
          ]}
          interpretation="[0,30]은 0분 세 건만 포함해 3/4=75%이고 폭은 30분입니다. [0,100]은 4/4=100%이고 폭은 100분입니다. 목표가 90%라면 이 네 건에서는 넓은 후보만 통과하지만, 표본이 네 건뿐이라 포함률이 25% 단위로 움직입니다. 이 결과만으로 실제 90% 보장을 확정할 수는 없습니다."
        />

        <div className="not-prose mt-8 grid gap-5 lg:grid-cols-2">
          <CitationBlock
            type="code"
            citeKey={1}
            source="scikit-learn 1.9.1 — Metrics and scoring"
            href="https://scikit-learn.org/1.9/modules/model_evaluation.html"
          >
            <p className="text-sm leading-6">
              공식 문서는 평균·중앙값·분위수가 서로 다른 예측 대상을 나타내며,
              목표와 일치하는 점수 함수를 사용해야 한다고 구분합니다. MAE, MSE,
              RMSE와 분위수 손실의 정의를 2026년 10월 26일에 다시 확인했습니다.
            </p>
          </CitationBlock>
          <div id="paper-regression-quantiles" className="scroll-mt-24">
            <CitationBlock
              type="paper"
              citeKey={2}
              source="Koenker & Bassett — Regression Quantiles"
              href="https://doi.org/10.2307/1913643"
            >
              <p className="text-sm leading-6">
                이 논문은 비대칭 절댓값 손실로 조건부 분위수를 추정하는 회귀를
                정식화합니다. 임의의 두 분위수만 고르면 분포가 바뀐 뒤에도 목표
                포함률이 자동으로 보장된다는 뜻은 아닙니다.
              </p>
            </CitationBlock>
          </div>
        </div>
      </section>

      <RegressionMetricReturn />
    </div>
  );
}

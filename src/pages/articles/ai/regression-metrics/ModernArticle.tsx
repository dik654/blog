import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { RegressionMetricViz } from "../evaluation-metrics/viz/ModernEvaluationViz";

export default function RegressionMetricsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          숫자 예측은 residual부터 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Residual</strong>은 실제값 <code>y</code>에서 예측값
            <code>ŷ</code>를 뺀 signed error입니다. 양수이면 model이 낮게
            예측했고 음수이면 높게 예측했습니다. MAE와 RMSE는 이 residual 목록은
            공유하지만, 크기에 붙이는 비용 곡선이 다릅니다.
          </p>
          <p>
            Metric을 바꾸면 report 숫자만 바뀌는 것이 아닙니다. 같은 loss로
            학습할 경우 model이 향하는 population target도 조건부 평균 또는
            중앙값으로 달라집니다. 먼저 residual의 모양을 보고, 그다음 비용
            곡선과 예측 target을 조합합니다.
          </p>
        </div>
        <TermBreakdown
          title="회귀 평가에서 먼저 구분할 형태"
          items={[
            {
              term: "Actual y",
              description: "관측된 실제 target 값과 그 단위입니다.",
              example: "배송시간 42분",
              boundary:
                "Label delay와 censoring이 있으면 관측값 자체의 의미가 달라집니다.",
            },
            {
              term: "Prediction ŷ",
              description:
                "같은 target 단위로 model이 내놓은 point estimate입니다.",
              example: "배송시간 35분",
              boundary:
                "Log target을 예측했다면 원래 단위로 되돌리는 규칙을 고정합니다.",
            },
            {
              term: "Residual r",
              description: "y−ŷ로 계산한 방향 있는 오차입니다.",
              example: "42−35=+7분",
              boundary:
                "Absolute error |r|과 squared error r²는 residual 자체가 아니라 penalty입니다.",
            },
            {
              term: "Prediction interval [L,U]",
              description:
                "Point 하나가 아니라 outcome을 포함할 것으로 제시한 범위입니다.",
              example: "[28분, 51분]",
              boundary:
                "Confidence interval for a parameter와 개별 outcome prediction interval을 구분합니다.",
            },
          ]}
        />
        <RegressionMetricViz />
        <ContentBoundary article="regression-metrics" />
      </section>

      <section id="residual-penalty" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Absolute는 선형으로, squared는 큰 오류를 빠르게 키웁니다
        </h2>
        <ExplainedFormula
          question="Residual [1,1,1,9]에서 MAE와 RMSE가 왜 다르게 반응하나요?"
          idea={
            <p>
              먼저 각 residual의 방향을 없앱니다. MAE는 절댓값을 그대로
              평균하고, RMSE는 제곱으로 큰 오류를 확대한 평균에 마지막으로
              제곱근을 씌워 원래 단위로 돌아옵니다.
            </p>
          }
          formula={String.raw`r_i=y_i-\hat y_i,\quad \mathrm{MAE}=n^{-1}\sum_i|r_i|,\quad \mathrm{RMSE}=\sqrt{n^{-1}\sum_i r_i^2}`}
          annotatedFormula={String.raw`\begin{aligned}r_i&=\underbrace{y_i-\hat y_i}_{\substack{\text{actual에서 prediction을 빼}\\\text{signed error 생성}}}\\a_i&=\underbrace{|r_i|}_{\substack{\text{방향을 없애고}\\\text{크기는 선형 유지}}}\\q_i&=\underbrace{r_i^2}_{\substack{\text{큰 residual을}\\\text{제곱으로 확대}}}\\\mathrm{MAE}&=\underbrace{\frac1n\sum_i a_i}_{\text{absolute costs 평균}}\\\mathrm{RMSE}&=\underbrace{\sqrt{\frac1n\sum_iq_i}}_{\substack{\text{squared costs 평균 뒤}\\\text{target 단위 복원}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`y_i-\hat y_i`,
              annotation: [
                "actual에서 prediction을 빼",
                "오류 방향과 크기를 함께 보존",
              ],
            },
            {
              expression: String.raw`|r_i|`,
              annotation: [
                "residual의 부호를 제거해",
                "크기에 선형인 비용을 생성",
              ],
            },
            {
              expression: String.raw`r_i^2`,
              annotation: [
                "residual을 자기 자신과 곱해",
                "큰 오류의 기여를 빠르게 확대",
              ],
            },
            {
              expression: String.raw`\sqrt{n^{-1}\sum_iq_i}`,
              annotation: [
                "제곱 비용을 평균하고 제곱근을 취해",
                "원래 target 단위의 summary를 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_i`,
              name: "Residual",
              description: "i번째 실제값과 예측값의 signed difference입니다.",
            },
            {
              symbol: String.raw`a_i`,
              name: "Absolute penalty",
              description: "오차 크기에 선형으로 비례하는 비용입니다.",
            },
            {
              symbol: String.raw`q_i`,
              name: "Squared penalty",
              description: "큰 오차를 더 강하게 강조하는 제곱 비용입니다.",
            },
            {
              symbol: "n",
              name: "Evaluation units",
              description: "같은 weight로 평균하는 독립 평가 단위 수입니다.",
            },
          ]}
          assumptions={[
            "모든 후보가 같은 target 단위와 evaluation units를 씁니다.",
            "Sample weight가 있으면 분모도 weight 합으로 바꿉니다.",
            "큰 오류의 제곱 비용이 실제 문제의 결과와 맞는지 확인합니다.",
          ]}
          interpretation="[1,1,1,9]에서 MAE=(1+1+1+9)/4=3이고 RMSE=√21≈4.58입니다. 9의 제곱 81이 합을 지배하기 때문입니다."
        />
      </section>

      <section id="bayes-act" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Penalty 곡선은 model이 향하는 중심값도 바꿉니다
        </h2>
        <ExplainedFormula
          question="왜 squared risk는 평균을, absolute risk는 중앙값을 선택하나요?"
          idea={
            <p>
              Squared risk의 derivative는 signed residual이 상쇄되는 평균에서
              0이 됩니다. Absolute risk의 slope는 예측값 왼쪽과 오른쪽
              probability mass가 균형인 중앙값에서 방향을 바꿉니다.
            </p>
          }
          formula={String.raw`a_2^*=\arg\min_a\mathbb E[(Y-a)^2|X=x]=\mathbb E[Y|X=x],\quad a_1^*\in\operatorname{Median}(Y|X=x)`}
          annotatedFormula={String.raw`\begin{aligned}R_2(a)&=\underbrace{\mathbb E[(Y-a)^2\mid X=x]}_{\text{squared conditional risk}}\\\frac{dR_2}{da}&=\underbrace{2(a-\mathbb E[Y\mid X=x])}_{\text{평균과의 차이를 derivative로 계산}}\\a_2^*&=\underbrace{\mathbb E[Y\mid X=x]}_{\text{derivative가 0인 조건부 평균}}\\R_1(a)&=\underbrace{\mathbb E[|Y-a|\mid X=x]}_{\text{absolute conditional risk}}\\a_1^*&\in\underbrace{\operatorname{Median}(Y\mid X=x)}_{\text{좌우 probability mass가 균형인 지점}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbb E[(Y-a)^2\mid X=x]`,
              annotation: [
                "입력 x에서 가능한 outcomes의 squared costs를",
                "조건부 probability로 평균",
              ],
            },
            {
              expression: String.raw`2(a-\mathbb E[Y\mid X=x])`,
              annotation: [
                "candidate a 방향으로 미분해",
                "평균에서 얼마나 벗어났는지 측정",
              ],
            },
            {
              expression: String.raw`\operatorname{Median}(Y\mid X=x)`,
              annotation: [
                "candidate 양쪽 probability mass를 비교해",
                "absolute slope가 방향을 바꾸는 지점 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a",
              name: "Candidate point prediction",
              description: "입력 x에서 내놓을 한 개의 수입니다.",
            },
            {
              symbol: String.raw`R_2`,
              name: "Squared conditional risk",
              description: "x에서 squared costs를 평균한 함수입니다.",
            },
            {
              symbol: String.raw`R_1`,
              name: "Absolute conditional risk",
              description: "x에서 absolute costs를 평균한 함수입니다.",
            },
            {
              symbol: String.raw`a_1^*,a_2^*`,
              name: "Bayes acts",
              description:
                "각 population risk를 가장 작게 만드는 point predictions입니다.",
            },
          ]}
          assumptions={[
            "Squared risk에는 조건부 2차 moment가 존재합니다.",
            "Median이 구간이면 absolute minimizer도 여러 개일 수 있습니다.",
            "Population 결과와 finite evaluation model 순위를 구분합니다.",
          ]}
          interpretation="Y가 0일 확률 .9, 100일 확률 .1이면 mean은 10이고 median은 0입니다. 드문 큰 outcome을 얼마나 따라갈지가 metric 선택에 들어 있습니다."
        />
      </section>

      <section id="interval" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Interval은 포함률과 폭을 두 축으로 평가합니다
        </h2>
        <ExplainedFormula
          question="모든 정답을 덮는 아주 넓은 interval이 좋은 예측이 아닌 이유는 무엇인가요?"
          idea={
            <p>
              정답 포함 여부를 평균한 coverage와 같은 target 단위의 width를 따로
              계산합니다. 목표 coverage를 guardrail로 지킨 후보끼리 폭을
              비교합니다.
            </p>
          }
          formula={String.raw`\widehat{\rm Cov}=n^{-1}\sum_i\mathbf1[L_i\le y_i\le U_i],\quad \widehat W=n^{-1}\sum_i(U_i-L_i)`}
          annotatedFormula={String.raw`\begin{aligned}h_i&=\underbrace{\mathbf1[L_i\le y_i\le U_i]}_{\text{actual이 interval 안이면 1}}\\\widehat{\rm Cov}&=\underbrace{\frac1n\sum_i h_i}_{\text{포함한 evaluation units의 비율}}\\w_i&=\underbrace{U_i-L_i}_{\text{upper에서 lower를 빼 interval 폭 계산}}\\\widehat W&=\underbrace{\frac1n\sum_iw_i}_{\text{같은 target 단위의 평균 폭}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[L_i\le y_i\le U_i]`,
              annotation: [
                "actual을 두 interval 경계와 비교해",
                "포함 여부를 0 또는 1로 표시",
              ],
            },
            {
              expression: String.raw`n^{-1}\sum_i h_i`,
              annotation: [
                "포함 indicators를 더하고 unit 수로 나눠",
                "empirical coverage를 계산",
              ],
            },
            {
              expression: String.raw`U_i-L_i`,
              annotation: [
                "upper endpoint에서 lower endpoint를 빼",
                "한 interval의 정보 폭을 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`L_i,U_i`,
              name: "Interval endpoints",
              description: "i번째 prediction interval의 아래·위 경계입니다.",
            },
            {
              symbol: String.raw`h_i`,
              name: "Coverage indicator",
              description: "실제값 포함 여부입니다.",
            },
            {
              symbol: String.raw`\widehat{\rm Cov}`,
              name: "Empirical coverage",
              description: "실제값을 포함한 evaluation unit 비율입니다.",
            },
            {
              symbol: String.raw`\widehat W`,
              name: "Mean width",
              description: "같은 target 단위로 계산한 interval 폭 평균입니다.",
            },
          ]}
          assumptions={[
            "Nominal coverage 보장은 interval construction의 별도 전제에 따릅니다.",
            "전체 coverage와 subgroup·horizon별 coverage를 함께 봅니다.",
            "후보들은 같은 target transform과 population을 사용합니다.",
          ]}
          interpretation="두 90% interval 후보의 empirical coverage가 .91로 같다면 평균 폭 12인 후보가 폭 30인 후보보다 더 많은 정보를 제공합니다."
        />
        <div
          id="paper-regression-quantiles"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Koenker & Bassett — Regression Quantiles"
            href="https://doi.org/10.2307/1913643"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 조건부 평균 하나를 넘어 outcome
                distribution의 여러 conditional quantile을 추정합니다.
              </p>
              <p>
                <strong>기여.</strong> Asymmetric absolute loss로 linear
                regression quantile을 정의하고 estimation과 이론을 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 linear specification·quantile
                loss·error 조건을 전제로 합니다.
              </p>
              <p>
                <strong>증거 범위.</strong> 논문이 제시한 quantile-regression
                정의·이론·examples입니다.
              </p>
              <p>
                <strong>말하지 않는 것.</strong> 임의의 두 quantile을 고르면
                distribution shift에서도 nominal interval coverage가 자동
                보장된다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          집계 단위와 오류 비용의 출발점은{" "}
          <Link to="/ai/evaluation-metrics">평가 설계 글</Link>에서 연결합니다.
        </p>
      </section>
    </div>
  );
}

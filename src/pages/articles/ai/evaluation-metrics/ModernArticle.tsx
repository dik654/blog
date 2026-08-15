import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { MetricContractViz } from "./viz/ModernEvaluationViz";

export default function EvaluationMetricsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Metric 이름보다 먼저 실제로 내릴 결정을 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>평가 지표</strong>는 model을 칭찬하는 점수가 아니라,
            배포에서 내릴 decision을 작은 evaluation data로 미리 시험하는 측정
            규칙입니다. 따라서 accuracy·MAE·NDCG라는 이름부터 고르면 안 됩니다.
            먼저 누구에게 어떤 action을 내리고, 틀린 action이 어떤 결과를
            만드는지 정해야 합니다.
          </p>
          <p>
            연체 예측을 예로 들면 model이 내놓은 <code>0.73</code>은 아직
            prediction일 뿐입니다. <code>0.70</code> 이상을 수동 심사로 보낸다는
            policy를 적용해야 action이 됩니다. 그 action이 틀렸을 때의 비용까지
            붙인 뒤에야 offline metric이 무엇을 근사하는지 말할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="평가 계약을 이루는 네 용어"
          items={[
            {
              term: "Decision unit",
              description:
                "한 번의 독립적인 업무 판단이 내려지는 대상입니다. 환자·query·고객·주문처럼 정의합니다.",
              example:
                "환자 한 명에게 영상이 1,000장이어도 decision unit은 환자 한 명일 수 있습니다.",
              boundary:
                "Dataset row 수와 decision unit 수는 같지 않을 수 있습니다.",
            },
            {
              term: "Prediction",
              description:
                "Model이 내놓는 score·probability·수치·ranked list입니다. 아직 업무 행동은 아닙니다.",
              example:
                "연체 probability 0.73 또는 검색 결과 문서 10개의 순서입니다.",
              boundary:
                "Probability의 수치 의미와 score의 정렬 능력도 구분합니다.",
            },
            {
              term: "Decision policy",
              description:
                "Prediction을 threshold·top-k·예약량 같은 실제 action으로 바꾸는 규칙입니다.",
              example: "p≥.70이면 review queue, 아니면 자동 승인으로 보냅니다.",
              boundary:
                "Policy parameter를 test에서 다시 고르면 test는 더 이상 최종 평가가 아닙니다.",
            },
            {
              term: "Error cost",
              description:
                "Action과 실제 outcome이 만났을 때 생기는 금전·안전·기회·처리량 손실입니다.",
              example:
                "False negative를 20, false positive를 1의 비용으로 둘 수 있습니다.",
              boundary:
                "모르는 비용을 임의의 숫자로 채우면 metric이 business outcome을 보장하지 않습니다.",
            },
          ]}
        />
        <MetricContractViz />
        <ContentBoundary article="evaluation-metrics" />
      </section>

      <section id="action-cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Prediction을 action으로 바꾼 뒤 결과별 비용을 평균냅니다
        </h2>
        <ExplainedFormula
          question="Offline metric은 배포에서 생길 어떤 값을 근사해야 하나요?"
          idea={
            <p>
              배포 사례를 하나 뽑고, model prediction에 policy를 적용한 action과
              실제 outcome의 비용을 계산한 뒤 그 비용을 평균냅니다.
            </p>
          }
          formula={String.raw`R(f,a)=\mathbb E_{Z\sim P_{\rm deploy}}[c(a(f(X)),Y,Z)]`}
          annotatedFormula={String.raw`\begin{aligned}\widehat y&=\underbrace{f(X)}_{\text{입력에서 prediction 생성}}\\u&=\underbrace{a(\widehat y)}_{\text{prediction을 action으로 변환}}\\\ell&=\underbrace{c(u,Y,Z)}_{\substack{\text{action과 실제 outcome을 비교해}\\\text{업무 비용 계산}}}\\R(f,a)&=\underbrace{\mathbb E_{Z\sim P_{\rm deploy}}[\ell]}_{\text{배포 population에서 평균 비용}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`f(X)`,
              annotation: [
                "입력 X를 model에 통과시켜",
                "score·probability·수치·순서를 생성",
              ],
            },
            {
              expression: String.raw`a(\widehat y)`,
              annotation: [
                "prediction에 threshold·top-k 정책을 적용해",
                "실제 action을 결정",
              ],
            },
            {
              expression: String.raw`c(u,Y,Z)`,
              annotation: [
                "action과 outcome을 비교하고 context Z를 반영해",
                "한 decision의 비용을 계산",
              ],
            },
            {
              expression: String.raw`\mathbb E_{P_{\rm deploy}}[\ell]`,
              annotation: [
                "배포에서 만날 사례들의 비용을 평균해",
                "model과 policy의 population risk를 정의",
              ],
            },
          ]}
          terms={[
            {
              symbol: "f",
              name: "Prediction function",
              description: "입력에서 model output을 만드는 함수입니다.",
            },
            {
              symbol: "a",
              name: "Action policy",
              description: "Prediction을 업무 action으로 바꾸는 규칙입니다.",
            },
            {
              symbol: "c",
              name: "Outcome cost",
              description: "Action·실제 outcome·context가 만든 손실입니다.",
            },
            {
              symbol: String.raw`P_{\rm deploy}`,
              name: "Deployment population",
              description: "운영에서 실제로 만날 사례의 분포입니다.",
            },
          ]}
          assumptions={[
            "Evaluation unit과 배포 decision unit이 일치합니다.",
            "Cost 방향과 상대 크기를 candidate 결과를 보기 전에 정합니다.",
            "Evaluation distribution이 배포 분포와 다르면 별도 slice 또는 weighting이 필요합니다.",
          ]}
          interpretation="False negative 비용 20, false positive 비용 1이라면 accuracy가 조금 높은 model보다 놓치는 positive를 줄이는 model의 expected cost가 낮을 수 있습니다."
        />
      </section>

      <section id="reducer" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          관측 행을 바로 평균하지 않고 unit에서 slice로 올라갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Reducer</strong>는 여러 loss를 하나의 report로 줄이는
            순서입니다. 환자 A에 영상 100개, B와 C에 영상 1개씩 있다면 행을 바로
            평균할 경우 A가 거의 모든 표를 갖습니다. 환자별 결정을 평가하려면
            먼저 각 환자 안에서 줄이고, 환자 세 명을 평균해야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="반복 관측이 많은 unit이 전체 점수를 독점하지 않게 어떻게 집계하나요?"
          idea={
            <p>
              관측 loss를 unit별로 먼저 줄이고, unit을 slice 안에서 평균한 다음,
              사전에 정한 slice weight로 global 값을 만듭니다.
            </p>
          }
          formula={String.raw`m_u=\operatorname{reduce}_{i\in I_u}\ell_i,\quad M_s=|U_s|^{-1}\sum_{u\in U_s}m_u,\quad M=\sum_s\omega_sM_s`}
          annotatedFormula={String.raw`\begin{aligned}m_u&=\underbrace{\operatorname{reduce}_{i\in I_u}\ell_i}_{\text{같은 decision unit 안의 관측을 먼저 결합}}\\M_s&=\underbrace{\frac1{|U_s|}\sum_{u\in U_s}m_u}_{\text{slice 안의 units에 한 표씩 부여}}\\M&=\underbrace{\sum_s\omega_sM_s}_{\substack{\text{사전 slice weights로 결합해}\\\text{global report 생성}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{reduce}_{i\in I_u}\ell_i`,
              annotation: [
                "같은 환자·query에 속한 losses를 묶어",
                "한 decision unit의 metric을 생성",
              ],
            },
            {
              expression: String.raw`|U_s|^{-1}\sum_um_u`,
              annotation: [
                "slice의 unit metrics를 더하고 unit 수로 나눠",
                "unit-macro slice score를 계산",
              ],
            },
            {
              expression: String.raw`\sum_s\omega_sM_s`,
              annotation: [
                "각 slice score에 목표 population weight를 곱해 더해",
                "global report를 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`I_u`,
              name: "Observations in unit",
              description: "Unit u에 속한 반복 관측 index입니다.",
            },
            {
              symbol: String.raw`m_u`,
              name: "Unit metric",
              description: "한 decision unit 안에서 먼저 만든 값입니다.",
            },
            {
              symbol: String.raw`U_s`,
              name: "Units in slice",
              description: "언어·지역·시간대 slice에 속한 units입니다.",
            },
            {
              symbol: String.raw`\omega_s`,
              name: "Slice weight",
              description:
                "배포 비중 또는 안전 정책으로 사전에 정한 가중치입니다.",
            },
          ]}
          assumptions={[
            "Unit identity와 deduplication 규칙이 고정되어 있습니다.",
            "Macro와 traffic-weighted 평균 중 목표 population을 명시합니다.",
            "Worst-slice minimum은 global 평균과 별도 guardrail로 남깁니다.",
          ]}
          interpretation="A의 100개 loss가 1, B와 C의 한 개 loss가 0이면 row 평균은 100/102≈.98이지만 patient macro는 (1+0+0)/3=.33입니다."
        />
      </section>

      <section id="map" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Output 형태가 달라지면 다음 metric 수업도 갈라집니다
        </h2>
        <TermBreakdown
          title="여기서 이어지는 네 개의 독립 수업"
          items={[
            {
              term: <Link to="/ai/regression-metrics">Regression metrics</Link>,
              description:
                "숫자 residual에 선형·제곱 비용을 붙이고 point와 interval을 평가합니다.",
            },
            {
              term: (
                <Link to="/ai/classification-metrics">
                  Classification metrics
                </Link>
              ),
              description:
                "Score ordering, probability 의미와 threshold action을 분리합니다.",
            },
            {
              term: <Link to="/ai/ranking-metrics">Ranking metrics</Link>,
              description:
                "Query별 relevance·rank position·judgment coverage와 query population을 평가합니다.",
            },
            {
              term: (
                <Link to="/ai/metric-selection-protocol">
                  Selection protocol
                </Link>
              ),
              description:
                "Training loss, validation selection, hard guardrail과 untouched test의 정보 경계를 고정합니다.",
            },
          ]}
        />
        <div
          id="standard-sklearn-metrics"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="scikit-learn — Metrics and scoring"
            href="https://scikit-learn.org/stable/modules/model_evaluation.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Estimator score·metric
                함수·cross-validation scorer의 방향과 parameter를 일관되게
                다뤄야 합니다.
              </p>
              <p>
                <strong>기여.</strong> Classification·regression·ranking metric
                API와 scorer의 greater-is-better convention을 문서화합니다.
              </p>
              <p>
                <strong>가정.</strong> 설치한 stable version과
                label·sample-weight·shape semantics를 전제로 합니다.
              </p>
              <p>
                <strong>증거 범위.</strong> 공식 문서가 명시한 metric 정의와
                현재 API behavior입니다.
              </p>
              <p>
                <strong>말하지 않는 것.</strong> Default scorer가 조직의 오류
                비용·unit reducer·slice guardrail을 자동으로 정하지는 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}

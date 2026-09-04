import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ClassificationMetricViz } from "../evaluation-metrics/viz/ModernEvaluationViz";

export default function ClassificationMetricsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          분류 output을 score·probability·action으로 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Score</strong>는 사례의 순서를 세우는 실수이고,
            <strong>probability</strong>는 같은 숫자를 보고한 집단의 장기 빈도에
            대한 주장입니다. <strong>Action</strong>은 threshold를 적용해 alert,
            reject, review 같은 결정을 내린 결과입니다. 하나의 model output에서
            나오지만 서로 다른 질문입니다.
          </p>
          <p>
            모든 positive가 negative보다 높은 model은 ranking이 완벽할 수
            있습니다. 그래도 score가 .51과 .49에 몰려 있다면 .51을 실제 51%
            probability로 믿어도 되는지는 별도 문제입니다. Threshold까지
            선택해야 비로소 업무 비용과 처리량을 평가할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="한 model을 평가하는 세 층"
          items={[
            {
              term: "Ranking layer",
              description:
                "Positive가 negative보다 높은 score를 받는지 봅니다.",
              example: "ROC-AUC·PR-AUC",
              boundary: "Score 간격이 probability로 맞는지는 답하지 않습니다.",
            },
            {
              term: "Probability layer",
              description:
                "0.8을 보고한 사례가 반복해서 약 80% positive인지 봅니다.",
              example: "Log loss·Brier score·reliability",
              boundary:
                "좋은 probability가 업무 threshold를 자동으로 정하지 않습니다.",
            },
            {
              term: "Decision layer",
              description:
                "고정 threshold에서 실제 hard actions와 오류를 셉니다.",
              example: "Precision·recall·specificity·expected cost",
              boundary:
                "Threshold를 움직이면 confusion counts와 처리량도 함께 바뀝니다.",
            },
          ]}
        />
        <ClassificationMetricViz />
        <ContentBoundary article="classification-metrics" />
      </section>

      <section id="proper-score" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Proper score는 probability를 정직하게 보고하게 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Strictly proper scoring rule</strong>은 실제 positive
            probability가 <code>p</code>일 때 다른 값 <code>q</code>를 보고해서
            기대 loss를 더 낮출 수 없고, 오직 <code>q=p</code>에서만 최솟값이
            되는 채점 규칙입니다. Accuracy처럼 threshold 뒤의 0/1만 보면 이
            성질을 잃습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Brier loss는 왜 실제 probability p를 그대로 보고하도록 유도하나요?"
          idea={
            <p>
              Bernoulli outcome의 두 경우를 probability로 평균하고 q=p일 때의 loss를 빼면 남는 값이 정확히 두 probability 차이의 제곱입니다.
            </p>
          }
          formula={String.raw`\mathbb E[(Y-q)^2|X=x]-\mathbb E[(Y-p)^2|X=x]=(q-p)^2\ge0`}
          annotatedFormula={String.raw`\begin{aligned}A_+&=\underbrace{p(1-q)^2}_{\substack{\text{positive 확률}\times\text{positive일 때 오류}}}\\A_-&=\underbrace{(1-p)q^2}_{\substack{\text{negative 확률}\times\text{negative일 때 오류}}}\\R(q)&=\underbrace{A_++A_-}_{\text{두 outcome branch 합산}}\\\Delta R&=\underbrace{R(q)-R(p)}_{\substack{\text{정직한 report보다}\\\text{늘어난 expected loss}}}\\&=\underbrace{(q-p)^2}_{\substack{\text{misreport 제곱이므로}\\\text{0보다 작을 수 없음}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p(1-q)^2`,
              annotation: [
                "Y=1이 될 probability에 positive일 때 오류를 곱해",
                "positive branch의 expected cost를 계산",
              ],
            },
            {
              expression: String.raw`(1-p)q^2`,
              annotation: [
                "Y=0이 될 probability에 negative일 때 오류를 곱해",
                "negative branch의 expected cost를 계산",
              ],
            },
            {
              expression: String.raw`R(q)-R(p)`,
              annotation: [
                "임의 report의 risk에서 truthful risk를 빼",
                "과장·축소로 생긴 regret만 분리",
              ],
            },
            {
              expression: String.raw`(q-p)^2`,
              annotation: [
                "두 probabilities의 차이를 제곱해",
                "q=p에서만 0인 penalty를 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: "Y",
              name: "Binary outcome",
              description: "Positive면 1, negative면 0인 실제 결과입니다.",
            },
            {
              symbol: "p",
              name: "True conditional probability",
              description: "입력 x에서 실제 positive가 될 probability입니다.",
            },
            {
              symbol: "q",
              name: "Reported probability",
              description: "Model이 positive probability라고 내놓은 값입니다.",
            },
            {
              symbol: String.raw`\Delta R`,
              name: "Expected regret",
              description:
                "Truthful report보다 추가로 부담하는 expected Brier loss입니다.",
            },
          ]}
          assumptions={[
            "Y는 같은 evaluation population의 binary outcome입니다.",
            "Model이 p를 표현할 수 있다는 보장이 아니라 scoring rule의 population 성질입니다.",
            "Finite sample과 distribution shift에서는 uncertainty와 recalibration을 별도로 봅니다.",
          ]}
          interpretation="실제 p=.7인데 q=.9를 보고하면 expected regret는 (.9−.7)²=.04입니다. q=.7일 때만 추가 loss가 0입니다."
        />
      </section>

      <section id="threshold" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Threshold는 probability를 비용이 있는 action으로 바꿉니다
        </h2>
        <ExplainedFormula
          question="False negative와 false positive 비용이 다를 때 threshold를 어떻게 비교하나요?"
          idea={
            <p>
              각 probability를 threshold와 비교해 hard action을 만들고 실제 outcome과 만난 confusion branch마다 정한 비용을 합산합니다.
            </p>
          }
          formula={String.raw`\hat y_i(\tau)=\mathbf1[p_i\ge\tau],\quad \widehat C(\tau)=n^{-1}\sum_i(c_{FN}\mathbf1[y_i=1,\hat y_i=0]+c_{FP}\mathbf1[y_i=0,\hat y_i=1])`}
          annotatedFormula={String.raw`\begin{aligned}\widehat y_i(\tau)&=\underbrace{\mathbf1[p_i\ge\tau]}_{\substack{\text{probability와 threshold를 비교해}\\\text{action 생성}}}\\e_i^{FN}&=\underbrace{\mathbf1[y_i=1,\widehat y_i=0]}_{\text{놓친 positive 표시}}\\e_i^{FP}&=\underbrace{\mathbf1[y_i=0,\widehat y_i=1]}_{\text{잘못 울린 negative 표시}}\\c_i&=\underbrace{c_{FN}e_i^{FN}+c_{FP}e_i^{FP}}_{\text{발생한 오류 비용 합산}}\\\widehat C(\tau)&=\underbrace{\frac1n\sum_i c_i}_{\text{unit당 평균 비용 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[p_i\ge\tau]`,
              annotation: [
                "probability를 operating threshold와 비교해",
                "positive 또는 negative action을 생성",
              ],
            },
            {
              expression: String.raw`c_{FN}e_i^{FN}+c_{FP}e_i^{FP}`,
              annotation: [
                "실제로 발생한 오류 indicator에 종류별 비용을 곱해",
                "한 사례의 action cost를 계산",
              ],
            },
            {
              expression: String.raw`n^{-1}\sum_i`,
              annotation: [
                "모든 decision unit의 costs를 더해",
                "unit당 empirical expected cost를 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p_i`,
              name: "Predicted probability",
              description: "i번째 사례의 positive probability입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Operating threshold",
              description: "Positive action을 시작하는 probability 경계입니다.",
            },
            {
              symbol: String.raw`c_{FN},c_{FP}`,
              name: "Error costs",
              description: "False negative와 false positive에 붙인 비용입니다.",
            },
            {
              symbol: String.raw`\widehat C`,
              name: "Empirical decision cost",
              description: "평가 units에서 관측한 평균 action cost입니다.",
            },
          ]}
          assumptions={[
            "Threshold와 비용은 validation/OOF에서 선택하고 test에서는 고정합니다.",
            "Class prevalence와 처리 용량이 배포 환경과 맞습니다.",
            "전체 cost와 subgroup confusion counts를 함께 보고합니다.",
          ]}
          interpretation="False negative 비용이 20배라면 threshold를 낮춰 alert 수를 늘리는 편이 총비용을 줄일 수 있습니다. 다만 review capacity를 초과하면 별도 guardrail이 필요합니다."
        />
      </section>

      <section id="report" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          세 층을 한 report에 두되 서로 대체하지 않습니다
        </h2>
        <TermBreakdown
          title="Release report의 독립 열"
          items={[
            {
              term: "Ordering",
              description: "ROC-AUC·PR-AUC와 prevalence를 기록합니다.",
            },
            {
              term: "Probability",
              description:
                "Log loss·Brier·reliability와 calibration split revision을 기록합니다.",
            },
            {
              term: "Operating point",
              description:
                "Threshold, confusion counts, expected cost와 alert volume을 기록합니다.",
            },
            {
              term: "Slices",
              description:
                "Class·지역·장비·시간별 sample count와 guardrail을 기록합니다.",
            },
          ]}
        />
        <div
          id="paper-proper-scoring-rules"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Gneiting & Raftery — Strictly Proper Scoring Rules, Prediction, and Estimation"
            href="https://doi.org/10.1198/016214506000001437"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Probabilistic forecast가 실제 belief
                distribution을 정직하게 보고하도록 평가합니다.
              </p>
              <p>
                <strong>기여.</strong> Proper scoring rules의 일반 이론과 convex
                function·entropy·Bregman divergence의 관계를 정리합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의
                probability-space·regularity·orientation convention을 전제로
                합니다.
              </p>
              <p>
                <strong>증거 범위.</strong> 논문이 제시한
                theorem·representation·examples입니다.
              </p>
              <p>
                <strong>말하지 않는 것.</strong> Proper score 하나가 finite
                sample의 calibration·ranking·subgroup·decision cost를 모두
                보장하지는 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Class prevalence와 sampling·focal loss는{" "}
          <Link to="/ai/imbalanced-data">불균형 데이터 글</Link>, logit
          calibration과 serving order는{" "}
          <Link to="/ai/image-probability-decisions">
            이미지 probability decision 글
          </Link>
          에서 이어집니다.
        </p>
      </section>
    </div>
  );
}

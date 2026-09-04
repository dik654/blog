import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ThresholdPolicyViz } from "../imbalanced-data/viz/ModernImbalanceViz";

export default function CostSensitiveThresholdingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Threshold는 score를 실제 행동으로 바꾸는 versioned policy입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Cost-sensitive threshold</strong>는 false positive와 false
            negative의 비용, 필요한 recall, 하루 처리 capacity를 보고 어느
            probability부터 positive action을 할지 정하는 경계입니다.
          </p>
          <p>
            0.5는 기본값이 아닙니다. Probability가 calibrated되고 두 오류 비용이
            특정 비율일 때만 한 후보가 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="Threshold policy의 네 입력"
          items={[
            {
              term: "Calibrated probability",
              description:
                "p라고 말한 집단의 실제 positive frequency가 p에 가까운 예측입니다.",
              example: "0.1 bin 1,000건 중 약 100건이 positive입니다.",
              boundary:
                "Raw margin·logit·ranking score를 probability처럼 비용식에 넣지 않습니다.",
            },
            {
              term: "False-positive cost",
              description:
                "실제 negative에 positive action을 했을 때 생기는 비용입니다.",
              example: "Manual review 8분, 사용자 마찰, 조사 비용입니다.",
              boundary:
                "모든 sample에서 상수인지 segment별로 다른지 명시합니다.",
            },
            {
              term: "False-negative cost",
              description:
                "실제 positive를 negative로 놓쳤을 때 생기는 비용입니다.",
              example: "Fraud loss·안전 사고·missed diagnosis입니다.",
              boundary: "관찰 지연과 censored label을 고려해야 합니다.",
            },
            {
              term: "Capacity",
              description: "시간당 처리 가능한 positive action의 상한입니다.",
              example: "Analyst가 하루 2,000 alerts를 검토할 수 있습니다.",
              boundary:
                "비용 최적 threshold가 capacity를 넘으면 feasible policy가 아닙니다.",
            },
          ]}
        />
        <ThresholdPolicyViz />
        <ContentBoundary article="cost-sensitive-thresholding" />
      </section>
      <section id="expected-cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          두 action의 expected cost가 같은 지점이 Bayes threshold입니다
        </h2>
        <ExplainedFormula
          question="CFP=1, CFN=9이면 왜 threshold가 .1인가요?"
          idea={
            <p>
              Positive action은 실제 negative일 확률 1−p에 FP 비용을 곱하고 negative action은 positive일 확률 p에 FN 비용을 곱합니다. 첫
              비용이 더 작을 때 alert합니다.
            </p>
          }
          formula={String.raw`\tau^*=\frac{C_{\rm FP}}{C_{\rm FP}+C_{\rm FN}}`}
          annotatedFormula={String.raw`\begin{aligned}R_+(p)&=\underbrace{(1-p)C_{\rm FP}}_{\text{positive action의 FP expected cost}}\\R_-(p)&=\underbrace{pC_{\rm FN}}_{\text{negative action의 FN expected cost}}\\\tau^*&=\underbrace{C_{\rm FP}/(C_{\rm FP}+C_{\rm FN})}_{\text{두 비용이 같은 probability 경계}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(1-p)C_{\rm FP}`,
              annotation: [
                "negative일 확률에 FP 비용을 곱해",
                "positive action의 평균 손실 계산",
              ],
            },
            {
              expression: String.raw`pC_{\rm FN}`,
              annotation: [
                "positive일 확률에 FN 비용을 곱해",
                "negative action의 평균 손실 계산",
              ],
            },
            {
              expression: String.raw`C_{\rm FP}/(C_{\rm FP}+C_{\rm FN})`,
              annotation: [
                "FP 비용을 두 오류 비용 합으로 나눠",
                "expected costs가 교차하는 threshold 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "Positive probability",
              description:
                "현재 sample이 실제 positive일 calibrated posterior입니다.",
            },
            {
              symbol: String.raw`C_{\rm FP}`,
              name: "False-positive cost",
              description: "잘못된 positive action의 비용입니다.",
            },
            {
              symbol: String.raw`C_{\rm FN}`,
              name: "False-negative cost",
              description: "놓친 positive의 비용입니다.",
            },
            {
              symbol: String.raw`\tau^*`,
              name: "Cost threshold",
              description:
                "두 action의 expected costs가 같은 probability입니다.",
            },
          ]}
          assumptions={[
            "Correct action의 추가 비용은 0으로 두었습니다.",
            "Probability는 deployment prevalence에서 calibrated되어 있습니다.",
            "두 오류 비용은 현재 policy window에서 고정되어 있습니다.",
          ]}
          interpretation="1/(1+9)=.1입니다. FN 비용이 커지면 분모가 커져 threshold가 낮아지고 더 많은 sample을 positive로 처리합니다."
        />
      </section>
      <section id="capacity-policy" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Capacity가 있으면 validation candidates 중 feasible threshold를
          고릅니다
        </h2>
        <ExplainedFormula
          question="하루 alert K개와 minimum recall rmin을 동시에 지키는 threshold는 어떻게 고르나요?"
          idea={
            <p>
              각 candidate threshold의 alert count와 recall을 indicator로 검사하고 둘 다 통과한 집합에서 expected cost가 가장 작은 값을
              선택합니다.
            </p>
          }
          formula={String.raw`\tau^*=\arg\min_{\tau:\,A(\tau)\le K,\,R(\tau)\ge r_{\min}}\widehat C(\tau)`}
          annotatedFormula={String.raw`\begin{aligned}q_A(\tau)&=\underbrace{\mathbf1[A(\tau)\le K]}_{\text{alert count가 capacity 안인지 검사}}\\q_R(\tau)&=\underbrace{\mathbf1[R(\tau)\ge r_{\min}]}_{\text{minimum recall을 지키는지 검사}}\\\tau^*&=\underbrace{\arg\min_{\tau:q_A\land q_R}\widehat C(\tau)}_{\text{feasible 후보 중 validation cost 최소 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[A(\tau)\le K]`,
              annotation: [
                "threshold별 alert 수를 capacity와 비교해",
                "운영 가능한 후보만 남김",
              ],
            },
            {
              expression: String.raw`\mathbf1[R(\tau)\ge r_{\min}]`,
              annotation: [
                "threshold별 recall을 minimum과 비교해",
                "critical miss가 많은 후보를 제거",
              ],
            },
            {
              expression: String.raw`\arg\min_{\tau:q_A\land q_R}`,
              annotation: [
                "두 gate를 AND한 후보에서 cost argmin을 구해",
                "제약을 평균으로 상쇄하지 않는 policy 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`A(\tau)`,
              name: "Alert count",
              description:
                "Threshold τ에서 positive action이 되는 validation 수입니다.",
            },
            {
              symbol: "K",
              name: "Capacity",
              description: "같은 window에서 처리 가능한 최대 alert 수입니다.",
            },
            {
              symbol: String.raw`R(\tau)`,
              name: "Recall",
              description: "Threshold τ가 찾는 actual positive 비율입니다.",
            },
            {
              symbol: String.raw`\widehat C(\tau)`,
              name: "Validation cost",
              description: "Observed FP·FN count에 비용을 적용한 추정값입니다.",
            },
          ]}
          assumptions={[
            "Threshold candidates와 constraints는 test를 보기 전에 고정합니다.",
            "Validation population이 deployment mix를 대표합니다.",
            "Capacity와 cost unit이 같은 time window를 씁니다.",
          ]}
          interpretation="제약을 penalty 평균에 섞지 않고 먼저 AND하는 이유는 recall을 크게 어긴 싼 policy나 capacity를 넘긴 좋은 policy가 선택되는 것을 막기 위해서입니다."
        />
      </section>
      <section id="release-receipt" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Threshold 변경은 model 변경과 별도의 release event입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Receipt에는 model·calibrator digest, validation window·prevalence,
            cost matrix, capacity, selected threshold, confusion counts·slice
            intervals와 rollback threshold를 남깁니다. Production에서
            prevalence·calibration·alert volume이 drift하면 같은 model이라도
            policy를 재검증합니다.
          </p>
        </div>
        <div id="paper-cost-sensitive" className="scroll-mt-24">
          <CitationBlock
            source="The Foundations of Cost-Sensitive Learning"
            citeKey={1}
            href="https://cseweb.ucsd.edu/~elkan/rescale.pdf"
          >
            <strong>문제:</strong> Classification error마다 비용이 다를 때
            learning과 decision을 다루는 원칙이 필요함. <strong>기여:</strong>{" "}
            Cost matrix와 probability·decision threshold 관계를 구조화.{" "}
            <strong>전제:</strong> 논문이 두는 cost·probability·classification
            setting. <strong>근거 범위:</strong> Cost-sensitive classification의
            이론적 변환과 논의. <strong>과장 금지:</strong> 현실의 지연
            label·capacity·nonstationary cost까지 자동 해결한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}

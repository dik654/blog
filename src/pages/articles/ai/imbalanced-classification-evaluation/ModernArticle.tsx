import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ImbalanceEvaluationViz } from "../imbalanced-data/viz/ModernImbalanceViz";

export default function ImbalancedClassificationEvaluationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          불균형 평가 보고서는 decision count·prevalence·probability를 세 층으로
          분리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 한 threshold에서 TP·FP·FN·TN을 셉니다. 그 count로
            precision·recall을 계산하고, population prevalence가 바뀌면
            precision이 어떻게 달라지는지 봅니다. 마지막으로 probability bin의
            예측값과 실제 빈도를 비교합니다.
          </p>
          <p>ROC-AUC나 PR-AUC 하나는 이 세 층을 대체하지 않습니다.</p>
        </div>
        <TermBreakdown
          title="평가 report의 네 대상"
          items={[
            {
              term: "Evaluation unit",
              description:
                "한 prediction과 한 outcome을 연결하는 count 단위입니다.",
              example: "Transaction, patient, video 중 하나를 고정합니다.",
              boundary:
                "Frame와 video count를 같은 confusion matrix에 섞지 않습니다.",
            },
            {
              term: "Confusion counts",
              description:
                "선택한 threshold에서 TP·FP·FN·TN으로 나눈 수입니다.",
              example: "TP=40, FP=10, FN=10, TN=940입니다.",
              boundary:
                "Window·deduplication·label delay가 같아야 비교할 수 있습니다.",
            },
            {
              term: "Precision · recall",
              description:
                "Alert purity와 actual-positive coverage라는 서로 다른 분모의 비율입니다.",
              example: "위 count에서 둘 다 .8입니다.",
              boundary: "Prevalence와 threshold를 함께 기록합니다.",
            },
            {
              term: "Calibration bin",
              description:
                "비슷한 predicted probability를 묶어 실제 positive frequency를 보는 집단입니다.",
              example:
                "0.7–0.8 bin 100건 중 55건 positive면 overconfident입니다.",
              boundary: "Bin 평균은 subgroup calibration을 숨길 수 있습니다.",
            },
          ]}
        />
        <ImbalanceEvaluationViz />
        <ContentBoundary article="imbalanced-classification-evaluation" />
      </section>
      <section id="confusion-matrix" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Precision과 recall은 같은 네 count에서 다른 분모를 만듭니다
        </h2>
        <ExplainedFormula
          question="TP=40, FP=10, FN=10이면 precision과 recall이 왜 둘 다 .8인가요?"
          idea={
            <p>
              Precision 분모는 alert 수 TP+FP, recall 분모는 actual positive 수
              TP+FN입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}P&=TP/(TP+FP)\\R&=TP/(TP+FN)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}N_{\rm alert}&=\underbrace{TP+FP}_{\text{positive action 전체를 합산}}\\N_+&=\underbrace{TP+FN}_{\text{actual positive 전체를 합산}}\\P&=\underbrace{TP/N_{\rm alert}}_{\text{alert 중 맞은 비율}}\\R&=\underbrace{TP/N_+}_{\text{positive 중 찾은 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`TP+FP`,
              annotation: [
                "맞은 alert와 틀린 alert를 더해",
                "precision의 action 분모 생성",
              ],
            },
            {
              expression: String.raw`TP+FN`,
              annotation: [
                "찾은 positive와 놓친 positive를 더해",
                "recall의 target 분모 생성",
              ],
            },
            {
              expression: String.raw`TP/N`,
              annotation: [
                "true positives를 각기 다른 분모로 나눠",
                "purity와 coverage를 별도 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "TP",
              name: "True positives",
              description: "Positive를 올바르게 action한 수입니다.",
            },
            {
              symbol: "FP",
              name: "False positives",
              description: "실제 negative에 positive action을 한 수입니다.",
            },
            {
              symbol: "FN",
              name: "False negatives",
              description: "실제 positive를 놓친 수입니다.",
            },
            {
              symbol: "P,R",
              name: "Precision · recall",
              description: "Alert purity와 actual-positive coverage입니다.",
            },
          ]}
          assumptions={[
            "같은 threshold와 time window의 counts입니다.",
            "Positive label과 evaluation unit이 명확합니다.",
            "Zero denominator policy가 선언되어 있습니다.",
          ]}
          interpretation="40/(40+10)=.8이 두 번 나오지만 우연히 분모가 같습니다. Threshold를 낮추면 보통 alert 분모와 찾은 positive가 함께 변해 두 지표가 다른 방향으로 움직입니다."
        />
      </section>
      <section id="prevalence-shift" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          TPR·FPR이 같아도 prevalence가 낮아지면 precision은 내려갑니다
        </h2>
        <ExplainedFormula
          question="TPR=.8, FPR=.1일 때 prevalence .5와 .01의 precision이 왜 달라지나요?"
          idea={
            <p>
              Population을 1로 정규화하면 expected TP는 π·TPR, FP는
              (1−π)·FPR입니다. 두 count를 precision 식에 넣습니다.
            </p>
          }
          formula={String.raw`P(\pi)=\frac{\pi\,TPR}{\pi\,TPR+(1-\pi)FPR}`}
          annotatedFormula={String.raw`\begin{aligned}TP(\pi)&=\underbrace{\pi\,TPR}_{\text{positive base rate에 탐지율 적용}}\\FP(\pi)&=\underbrace{(1-\pi)FPR}_{\text{negative base rate에 오탐률 적용}}\\P(\pi)&=\underbrace{TP(\pi)/(TP(\pi)+FP(\pi))}_{\text{예상 alert 중 true 비율 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\pi\,TPR`,
              annotation: [
                "positive population 비율에 true-positive rate를 곱해",
                "정규화된 expected TP count 계산",
              ],
            },
            {
              expression: String.raw`(1-\pi)FPR`,
              annotation: [
                "negative population 비율에 false-positive rate를 곱해",
                "정규화된 expected FP count 계산",
              ],
            },
            {
              expression: String.raw`TP/(TP+FP)`,
              annotation: [
                "expected TP를 전체 alerts로 나눠",
                "새 prevalence에서 precision 재계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\pi`,
              name: "Prevalence",
              description: "Deployment population의 positive 비율입니다.",
            },
            {
              symbol: "TPR",
              name: "True-positive rate",
              description: "Actual positive 중 positive action 비율입니다.",
            },
            {
              symbol: "FPR",
              name: "False-positive rate",
              description: "Actual negative 중 positive action 비율입니다.",
            },
            {
              symbol: String.raw`P(\pi)`,
              name: "Precision at prevalence",
              description: "주어진 base rate에서 예상되는 alert purity입니다.",
            },
          ]}
          assumptions={[
            "TPR·FPR이 두 populations에서 유지된다고 가정합니다.",
            "같은 threshold와 target definition을 씁니다.",
            "Sampling uncertainty와 slice drift를 별도 interval로 보고합니다.",
          ]}
          interpretation="π=.5이면 .4/(.4+.05)≈.89, π=.01이면 .008/(.008+.099)≈.075입니다. Negative가 많아지며 작은 FPR도 큰 FP count가 되기 때문입니다."
        />
        <div id="paper-pr-roc" className="scroll-mt-24">
          <CitationBlock
            source="The Relationship Between Precision-Recall and ROC Curves"
            citeKey={1}
            href="https://doi.org/10.1145/1143844.1143874"
          >
            <strong>문제:</strong> Skewed binary data에서 ROC와 PR curve의
            관계·interpolation을 정확히 해석해야 함. <strong>기여:</strong>{" "}
            Fixed dataset의 dominance 관계와 achievable PR curve 분석.{" "}
            <strong>전제:</strong> 같은 positive·negative set과 binary ranking
            curve. <strong>근거 범위:</strong> ROC/PR 공간의 이론적 관계와 실험.{" "}
            <strong>과장 금지:</strong> 서로 다른 prevalence의 PR-AUC를 그대로
            비교하거나 calibration을 대체한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
      <section id="calibration" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Calibration은 probability bin의 예측과 실제 빈도를 맞춥니다
        </h2>
        <ExplainedFormula
          question="Bin별 calibration error는 어떤 두 값을 비교하나요?"
          idea={
            <p>
              각 bin의 평균 predicted probability와 actual positive frequency를
              빼고 절댓값을 취한 뒤 bin 비중으로 평균합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}d_b&=|\operatorname{acc}(B_b)-\operatorname{conf}(B_b)|\\w_b&=|B_b|/N\\ECE&=\sum_b w_b d_b\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}d_b&=\underbrace{|\operatorname{freq}_+(B_b)-\operatorname{mean}_{i\in B_b}\hat p_i|}_{\substack{\text{actual frequency와}\\\text{predicted probability 차이}}}\\w_b&=\underbrace{|B_b|/N}_{\text{bin이 population에서 차지하는 비율}}\\ECE&=\underbrace{\sum_bw_bd_b}_{\text{bin gap을 population weight로 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`|\operatorname{freq}_+-\operatorname{mean}\hat p|`,
              annotation: [
                "실제 positive 빈도에서 평균 예측값을 빼고 절댓값을 취해",
                "bin의 over·under confidence 크기 계산",
              ],
            },
            {
              expression: String.raw`|B_b|/N`,
              annotation: [
                "bin sample 수를 전체 수로 나눠",
                "큰 bin이 report에 기여할 비중 계산",
              ],
            },
            {
              expression: String.raw`\sum_bw_bd_b`,
              annotation: [
                "각 bin gap에 비중을 곱해 더해",
                "population 평균 calibration gap 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B_b`,
              name: "Probability bin",
              description:
                "비슷한 predicted probability를 가진 sample 집합입니다.",
            },
            {
              symbol: String.raw`\operatorname{freq}_+`,
              name: "Positive frequency",
              description: "Bin 안의 actual positive 비율입니다.",
            },
            {
              symbol: String.raw`\hat p_i`,
              name: "Predicted probability",
              description: "Sample i의 positive probability입니다.",
            },
            {
              symbol: "ECE",
              name: "Expected calibration error",
              description: "Bin gap의 weighted summary입니다.",
            },
          ]}
          assumptions={[
            "Bin boundary와 minimum count를 사전 고정합니다.",
            "Confidence interval과 reliability diagram을 함께 봅니다.",
            "Aggregate ECE가 subgroup calibration을 보장하지 않습니다.",
          ]}
          interpretation="절댓값은 overconfidence와 underconfidence가 서로 상쇄되지 않게 하고, bin 비중 곱은 작은 bin 하나가 전체 report를 지배하지 않게 합니다."
        />
        <div id="paper-calibration" className="scroll-mt-24">
          <CitationBlock
            source="On Calibration of Modern Neural Networks"
            citeKey={2}
            href="https://proceedings.mlr.press/v70/guo17a.html"
          >
            <strong>문제:</strong> Modern neural-network confidence가 empirical
            accuracy와 일치하지 않음. <strong>기여:</strong> Calibration 측정
            비교와 held-out temperature scaling 평가. <strong>전제:</strong>{" "}
            Labeled calibration split·논문 architectures·evaluation
            distribution. <strong>근거 범위:</strong> Image·document
            classification 실험. <strong>과장 금지:</strong> Distribution shift
            뒤나 모든 subgroup에서 calibration이 유지된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
      <section id="report" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          최종 report는 ranking·decision·calibration을 나란히 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            ROC/PR curve는 ordering, confusion counts·precision·recall·cost는
            선택된 action, reliability diagram·proper score는 probability를
            보고합니다. 모든 표에 prevalence, threshold, evaluation
            unit·window와 uncertainty interval을 붙입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

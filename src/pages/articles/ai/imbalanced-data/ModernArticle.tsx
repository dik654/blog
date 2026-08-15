import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ImbalanceDecisionViz } from "./viz/ModernImbalanceViz";

export default function ImbalancedDataArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          불균형은 먼저 population의 positive base rate가 작은 상태입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Class prevalence</strong>는 평가 population 전체에서
            positive가 차지하는 비율입니다. 1,000명 중 positive가 50명이면
            5%입니다. 모두 negative라고 답해도 accuracy는 95%지만 positive
            recall은 0입니다.
          </p>
          <p>
            이 숫자를 본 뒤에야 model output을 세 층으로 나눕니다. Score의 순서,
            probability의 의미, threshold 뒤 action은 같은 것이 아닙니다.
          </p>
        </div>
        <TermBreakdown
          title="불균형 문제를 읽는 네 대상"
          items={[
            {
              term: "Population",
              description:
                "Model이 실제 결정을 내릴 사람·transaction·event의 집합입니다.",
              example:
                "하루 card transaction 100만 건을 evaluation unit으로 둡니다.",
              boundary:
                "Training sampler가 만든 50:50 batch를 production population으로 읽지 않습니다.",
            },
            {
              term: "Prevalence",
              description:
                "Population에서 positive event가 차지하는 비율 π입니다.",
              example: "Fraud 10,000건 / 전체 1,000,000건 = 1%입니다.",
              boundary:
                "Time·region·customer slice마다 달라질 수 있어 timestamp와 unit을 고정합니다.",
            },
            {
              term: "Score",
              description:
                "Sample을 positive에 가까운 순서로 세우는 연속 출력입니다.",
              example: "0.91이 0.63보다 먼저 review됩니다.",
              boundary: "Score 0.8이 곧 80% probability라는 뜻은 아닙니다.",
            },
            {
              term: "Action",
              description:
                "Threshold와 policy를 통과해 실제 alert·block·review로 바뀐 결과입니다.",
              example:
                "p≥0.12이고 하루 capacity 안이면 manual review로 보냅니다.",
              boundary:
                "Model training과 별도로 운영 비용·capacity·rollback을 소유합니다.",
            },
          ]}
        />
        <ImbalanceDecisionViz />
        <ContentBoundary article="imbalanced-data" />
      </section>
      <section id="prevalence-baseline" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Accuracy는 prevalence가 만든 쉬운 baseline과 먼저 비교합니다
        </h2>
        <ExplainedFormula
          question="All-negative classifier가 왜 높은 accuracy를 얻을 수 있나요?"
          idea={
            <p>
              Negative 비율 1−π를 그대로 맞히기 때문입니다. 동시에 positive를
              하나도 찾지 못하므로 recall은 0입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\operatorname{Acc}_{-}&=1-\pi\\\operatorname{Recall}_{-}&=0\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\pi&=\underbrace{N_+/N}_{\substack{\text{positive 수를}\\\text{population으로 나눔}}}\\\operatorname{Acc}_{-}&=\underbrace{1-\pi}_{\substack{\text{negative 비율을}\\\text{baseline accuracy로 사용}}}\\\operatorname{Recall}_{-}&=\underbrace{0/N_+}_{\text{찾은 positive가 없음을 확인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`N_+/N`,
              annotation: [
                "positive count를 전체 count로 나눠",
                "evaluation population의 base rate 계산",
              ],
            },
            {
              expression: String.raw`1-\pi`,
              annotation: [
                "전체 비율에서 positive 비율을 빼",
                "all-negative가 맞히는 negative 비율 계산",
              ],
            },
            {
              expression: String.raw`0/N_+`,
              annotation: [
                "찾은 positive 0을 실제 positive로 나눠",
                "높은 accuracy가 숨긴 recall failure 노출",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`N_+`,
              name: "Positive count",
              description: "평가 population의 실제 positive 수입니다.",
            },
            {
              symbol: "N",
              name: "Population size",
              description: "같은 unit·window의 전체 평가 수입니다.",
            },
            {
              symbol: String.raw`\pi`,
              name: "Prevalence",
              description: "Positive event의 base rate입니다.",
            },
          ]}
          assumptions={[
            "Positive label과 evaluation unit이 고정되어 있습니다.",
            "중복 event를 세는 deduplication rule이 같습니다.",
            "Training prevalence가 아니라 held-out deployment-like prevalence를 씁니다.",
          ]}
          interpretation="π=.05이면 all-negative accuracy는 .95입니다. 1−π를 계산하는 이유는 model 성능이 아니라 class 비율만으로 얻는 baseline을 먼저 빼내기 위해서입니다."
        />
      </section>
      <section id="three-layers" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Ranking·probability·decision은 각각 다른 질문입니다
        </h2>
        <ExplainedFormula
          question="한 score가 좋은지 세 층으로 어떻게 분리하나요?"
          idea={
            <p>
              Pair ordering은 ranking, probability bin의 실제 빈도는
              calibration, threshold indicator는 decision을 나타냅니다.
            </p>
          }
          formula={String.raw`R=\mathbf1[s^+>s^-],\quad C(p)=\Pr(Y=1\mid \hat p=p),\quad \hat y_\tau=\mathbf1[\hat p\ge\tau]`}
          annotatedFormula={String.raw`\begin{aligned}R&=\underbrace{\mathbf1[s^+>s^-]}_{\text{positive가 위에 있는지 판정}}\\C(p)&=\underbrace{\Pr(Y=1\mid\hat p=p)}_{\text{같은 예측값 집단의 실제 빈도}}\\\hat y_\tau&=\underbrace{\mathbf1[\hat p\ge\tau]}_{\text{threshold를 넘어야 action 생성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[s^+>s^-]`,
              annotation: [
                "positive·negative score를 비교해",
                "순서가 맞으면 1로 기록",
              ],
            },
            {
              expression: String.raw`\Pr(Y=1\mid\hat p=p)`,
              annotation: [
                "같은 predicted probability를 조건으로 묶어",
                "그 집단의 실제 positive frequency 계산",
              ],
            },
            {
              expression: String.raw`\mathbf1[\hat p\ge\tau]`,
              annotation: [
                "Probability를 policy threshold와 비교해",
                "연속 예측을 hard action으로 변환",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`s^+,s^-`,
              name: "Positive · negative scores",
              description: "Ranking comparison에 쓰는 두 class의 score입니다.",
            },
            {
              symbol: String.raw`\hat p`,
              name: "Predicted probability",
              description: "Calibration을 주장하는 positive probability입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Decision threshold",
              description: "운영 action이 시작되는 policy 경계입니다.",
            },
          ]}
          assumptions={[
            "Ranking pair와 probability bin은 같은 target definition을 씁니다.",
            "Calibration은 충분한 sample과 uncertainty interval로 평가합니다.",
            "Threshold는 validation에서 선택하고 test는 마지막 보고에 남깁니다.",
          ]}
          interpretation="AUC가 좋아도 C(.8)=.5일 수 있고, calibrated probability도 잘못된 threshold에서 큰 비용을 냅니다. 세 연산을 분리해야 어느 층을 고칠지 알 수 있습니다."
        />
        <p className="mt-6 leading-7 text-muted-foreground">
          다음 수업은 training data의 노출을 바꾸는{" "}
          <Link
            className="text-primary underline-offset-4 hover:underline"
            to="/ai/imbalance-resampling"
          >
            resampling
          </Link>
          입니다.
        </p>
        <div id="paper-pr-guide" className="scroll-mt-24">
          <CitationBlock
            source="The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets"
            citeKey={1}
            href="https://doi.org/10.1371/journal.pone.0118432"
          >
            <strong>문제:</strong> Class imbalance에서 ROC plot이 실사용 성능
            차이를 낙관적으로 보일 수 있음. <strong>기여:</strong> 여러
            bioinformatics dataset에서 ROC와 PR 해석을 비교.{" "}
            <strong>전제:</strong> 논문의 dataset·classifier·evaluation
            protocol. <strong>근거 범위:</strong> Imbalanced binary evaluation의
            curve 선택 사례. <strong>과장 금지:</strong> PR curve 하나가
            calibration·cost·threshold를 대신한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}

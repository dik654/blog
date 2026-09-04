import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { OofRiskViz } from "../cross-validation/viz/ModernCrossValidationViz";

export default function OofRiskEstimationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OOF prediction은 각 training row가 자신을 보지 않은 model에게서 받은 답입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">K-fold는 K개의 score를 얻는 절차이기 전에 training rows 전체에 <strong>unseen prediction vector</strong>를 만드는 절차입니다. Row i가 fold k에 있으면 i의 prediction은 나머지 K−1 folds로 학습한 model에서만 나옵니다.</p></div>
        <TermBreakdown title="OOF table의 네 열" items={[
          { term: "Row ID", description: "원래 target과 prediction을 다시 정렬할 안정된 key입니다." },
          { term: "Fold ID", description: "해당 prediction을 만들 때 제외된 partition입니다." },
          { term: "OOF prediction", description: "그 row를 학습하지 않은 fold model의 출력입니다." },
          { term: "OOF loss", description: "OOF prediction과 target을 metric 규칙으로 비교한 행별 실패입니다.", boundary: "In-sample prediction을 섞으면 더는 OOF가 아닙니다." },
        ]} />
        <OofRiskViz />
        <ContentBoundary article="oof-risk-estimation" />
      </section>
      <section id="pooling" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">모든 OOF row를 원래 weight로 모은 뒤 risk를 한 번 계산합니다</h2>
        <ExplainedFormula
          question="왜 fold score의 단순 평균보다 pooled OOF risk가 필요한가요?"
          idea={<p>
            Fold 크기가 다르면 fold 평균에 같은 weight를 주는 순간 작은 fold의 행이 더 큰 영향력을 얻습니다. 행별 loss와 업무 weight는 원래 단위로 합칩니다.
          </p>}
          formula={String.raw`\widehat R_{\mathrm{OOF}}=\frac{\sum_i w_i\ell(y_i,\widehat y_i^{(-f(i))})}{\sum_i w_i}`}
          annotatedFormula={String.raw`\begin{aligned}\widehat y_i^{\mathrm{OOF}}&=\underbrace{A(D\setminus V_{f(i)})(x_i)}_{\text{row i의 fold를 제외해 prediction}}\\e_i&=\underbrace{\ell(y_i,\widehat y_i^{\mathrm{OOF}})}_{\text{같은 row의 target과 비교}}\\\widehat R_{\mathrm{OOF}}&=\underbrace{\frac{\sum_i w_ie_i}{\sum_iw_i}}_{\text{원래 row weight로 pooled 평균}}
\end{aligned}`}
          operations={[
            { expression: String.raw`D\setminus V_{f(i)}`, annotation: ["row i가 속한 fold 전체를 빼", "unseen training set을 생성"] },
            { expression: String.raw`\ell(y_i,\widehat y_i^{\mathrm{OOF}})`, annotation: ["OOF prediction을 target과 비교해", "행별 loss로 변환"] },
            { expression: String.raw`\sum_iw_ie_i/\sum_iw_i`, annotation: ["업무 weight를 적용하고", "전체 held-out rows로 정규화"] },
          ]}
          terms={[
            { symbol: String.raw`f(i)`, name: "Fold assignment", description: "Row i가 validation이 되는 fold 번호입니다." },
            { symbol: String.raw`\widehat y_i^{\mathrm{OOF}}`, name: "OOF prediction", description: "Row i를 보지 않은 model의 prediction입니다." },
            { symbol: String.raw`w_i`, name: "Evaluation weight", description: "Metric이 row i에 주는 업무 weight입니다." },
          ]}
          assumptions={["모든 eligible row에 OOF prediction이 정확히 하나 있습니다.", "Non-decomposable metric은 전체 OOF vector에서 metric 자체를 다시 계산합니다."]}
          interpretation="20행 평균 .2와 80행 평균 .4이면 equal-fold 평균은 .3, pooled row 평균은 (.2×20+.4×80)/100=.36입니다."
        />
      </section>
      <section id="estimand" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">CV는 완성된 model 한 개보다 다시 실행할 learning procedure를 평가합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Fold마다 training subset과 fitted model이 다릅니다. OOF loss는 full data로 마지막에 fit한 model 하나의 conditional
            error와 정확히 같지 않습니다. 비슷한 training sample에서 같은 procedure를 반복했을 때의 평균 risk에 더 가깝습니다.
          </p></div>
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Fold score는 서로 독립 반복이 아니므로 단순 표준오차를 과신하지 않습니다</h2>
        <div id="paper-cv-estimand" className="not-prose"><CitationBlock source="Bates, Hastie, Tibshirani — Cross-Validation: What Does It Estimate and How Well Does It Do It?" citeKey={1} type="paper" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/">
          CV estimand와 fold dependence에 따른 uncertainty 문제를 OLS theorem과 broader analysis로 다룹니다. 모든 learner에 같은 finite-sample equality가 성립한다는 뜻은 아닙니다.
        </CitationBlock></div>
      </section>
    </div>
  );
}

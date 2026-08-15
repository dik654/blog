import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { FoldLocalViz } from "../cross-validation/viz/ModernCrossValidationViz";

export default function FoldLocalValidationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fold는 row 묶음이고 fitted state는 그 묶음에서 배운 기억입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Model weight만 training data에서 배워지는 것은 아닙니다. 평균·분산·결측 대치값·vocabulary·feature 선택도 data에서 배운 <strong>fitted state</strong>입니다. Validation row는 이 상태를 만들 때 보이지 않아야 합니다.</p></div>
        <TermBreakdown title="Data와 state를 한 줄씩 구분" items={[
          { term: "Fold manifest", description: "Row ID가 어느 fold에 속하는지 고정한 versioned 표입니다.", example: "row_104→fold_2처럼 seed만이 아니라 실제 membership을 저장합니다." },
          { term: "Fit", description: "Training rows에서 parameter나 statistic을 추정해 state를 만드는 동작입니다." },
          { term: "Transform", description: "이미 고정된 state를 새 rows에 적용하는 동작입니다.", boundary: "Validation을 보며 state를 다시 갱신하면 transform이 아니라 재학습입니다." },
          { term: "Pipeline", description: "Fold 선택→fit→transform→model→prediction 순서를 한 artifact로 묶은 실행 경로입니다." },
        ]} />
        <FoldLocalViz />
        <ContentBoundary article="fold-local-validation" />
      </section>
      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Train 평균을 저장하고 validation에는 빼기만 합니다</h2>
        <ExplainedFormula
          question="왜 scaler 평균을 전체 data가 아니라 train fold에서만 계산하나요?"
          idea={<p>평균과 scale도 data distribution에 대한 추정값입니다. Validation row를 포함하면 시험 분포의 위치를 미리 fitted state에 넣게 됩니다.</p>}
          formula={String.raw`\mu_{-k}=\frac{1}{|T_k|}\sum_{i\in T_k}x_i,\quad \widetilde x_j=\frac{x_j-\mu_{-k}}{s_{-k}}\;(j\in V_k)`}
          annotatedFormula={String.raw`\begin{aligned}\mu_{-k}&=\underbrace{|T_k|^{-1}\sum_{i\in T_k}x_i}_{\text{train fold에서만 중심을 fit}}\\s_{-k}&=\underbrace{\operatorname{scale}(\{x_i:i\in T_k\})}_{\text{train fold에서만 scale을 fit}}\\\widetilde x_j&=\underbrace{(x_j-\mu_{-k})/s_{-k}}_{\text{validation row에는 저장 state만 적용}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{i\in T_k}x_i/|T_k|`, annotation: ["validation fold를 제외하고", "training 중심을 추정"] },
            { expression: String.raw`x_j-\mu_{-k}`, annotation: ["validation 값에서", "training 중심을 제거"] },
            { expression: String.raw`(x_j-\mu_{-k})/s_{-k}`, annotation: ["training scale로 나눠", "고정 coordinate에 배치"] },
          ]}
          terms={[
            { symbol: String.raw`T_k`, name: "Training rows for fold k", description: "k번째 validation fold를 제외한 row 집합입니다." },
            { symbol: String.raw`V_k`, name: "Validation rows for fold k", description: "현재 model과 transform을 fit할 때 보이지 않는 row 집합입니다." },
            { symbol: String.raw`\mu_{-k},s_{-k}`, name: "Fold-local state", description: "Training rows에서 추정한 중심과 scale입니다." },
          ]}
          assumptions={["Fold manifest는 model 비교 동안 고정합니다.", "Missing·category fallback도 train fold에서 정의합니다."]}
          interpretation="Fold 2의 validation 값이 크더라도 μ₋₂와 s₋₂에는 반영하지 않습니다."
        />
      </section>
      <section id="manifest" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Prediction마다 fold ID와 state checksum을 남깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>OOF row에는 row ID, fold ID, train-row manifest hash, transform revision, fitted-state checksum, model checkpoint, prediction을 연결합니다. Candidate 선택이 끝나면 같은 recipe를 전체 training data에 다시 fit하되 final holdout은 계속 닫아 둡니다.</p></div>
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">External pretrained transform도 source와 overlap을 기록합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>공개 corpus에서 미리 학습한 tokenizer나 embedding은 fold마다 다시 fit하지 않을 수 있습니다. 대신 source revision, 목적, evaluation entity와의 overlap을 기록해야 외부 정보 사용 범위를 판단할 수 있습니다.</p></div>
        <div id="paper-fold-local" className="not-prose mt-8"><CitationBlock source="scikit-learn — Pipeline and cross-validation" citeKey={1} type="documentation" href="https://scikit-learn.org/stable/modules/compose.html#pipeline-chaining-estimators">
          Pipeline이 transform fit과 estimator fit을 같은 cross-validation 경계 안에서 실행하는 현재 API 근거입니다. 임의 custom code가 자동으로 leakage-safe하다는 뜻은 아닙니다.
        </CitationBlock></div>
      </section>
    </div>
  );
}

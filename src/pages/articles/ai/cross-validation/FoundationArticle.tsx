import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ValidationRiskViz } from "./viz/ModernCrossValidationViz";

export default function CrossValidationFoundationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Split 이름보다 먼저 배포에서 무엇이 새로 나타나는지 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            교차검증은 data를 K조각으로 자르는 기술이 아닙니다. 실제 사용 시점에 새 <strong>row</strong>를 만나는지,
            새 <strong>entity</strong>를 만나는지, 미래 <strong>time period</strong>를 만나는지부터 묻고 그 상황의 loss를
            과거 data로 재연하는 실험입니다.
          </p>
        </div>
        <TermBreakdown
          title="질문을 구성하는 네 용어"
          items={[
            { term: "Deployment unit", description: "배포에서 prediction 하나를 받을 새 물체입니다.", example: "한 row, 한 환자, 한 병원, 다음 달 가운데 무엇이 새로 나타나는지 씁니다." },
            { term: "Deployment distribution", description: "그 물체가 실제 운영에서 나타나는 빈도와 조건의 분포입니다.", boundary: "과거 training 분포와 같다고 자동 가정하지 않습니다." },
            { term: "Loss", description: "Prediction 하나의 실패를 수치로 바꾸는 규칙입니다.", example: "환자별 평균 log loss와 patch별 평균 log loss는 다른 질문입니다." },
            { term: "Estimand", description: "어느 분포에서 어떤 단위의 loss를 평균내려는지까지 포함한 추정 목표입니다." },
          ]}
        />
        <ValidationRiskViz />
        <ContentBoundary article="cross-validation" />
      </section>

      <section id="risk" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Validation risk는 새 배포 단위의 loss를 평균낸 값입니다</h2>
        <ExplainedFormula
          question="왜 validation risk 식에는 training data와 새 배포 단위가 모두 들어가나요?"
          idea={<p>학습 절차 A는 training sample D를 model로 바꿉니다. 그 model을 배포 분포에서 새로 뽑은 Z에 적용해 loss를 계산하고, D와 Z가 달라질 때의 평균을 냅니다.</p>}
          formula={String.raw`R_{\mathrm{deploy}}(A)=\mathbb E_{D,Z}[\ell(A(D),Z)]`}
          annotatedFormula={String.raw`\begin{aligned}f_D&=\underbrace{A(D)}_{\text{training data로 model을 학습}}\\e_{D,Z}&=\underbrace{\ell(f_D,Z)}_{\text{새 배포 단위에서 실패를 측정}}\\R_{\mathrm{deploy}}(A)&=\underbrace{\mathbb E_{D,Z}[e_{D,Z}]}_{\text{D와 Z의 변동을 평균}}
\end{aligned}`}
          operations={[
            { expression: String.raw`A(D)`, annotation: ["training sample을 입력해", "평가할 model을 생성"] },
            { expression: String.raw`\ell(f_D,Z)`, annotation: ["새 배포 단위의 prediction을", "업무 loss로 변환"] },
            { expression: String.raw`\mathbb E_{D,Z}`, annotation: ["가능한 학습 data와 배포 단위에 걸쳐", "절차의 평균 risk를 정의"] },
          ]}
          terms={[
            { symbol: "A", name: "Learning procedure", description: "전처리·학습·선택 규칙을 포함한 재실행 가능한 절차입니다." },
            { symbol: "D", name: "Training sample", description: "과거 분포에서 관측한 학습 data입니다." },
            { symbol: "Z", name: "Deployment unit", description: "운영에서 새로 예측할 row·entity·period·site입니다." },
          ]}
          assumptions={["Loss와 averaging unit을 split 전에 고정합니다.", "Historical data가 미래 배포 분포를 어느 정도 재현할 수 있어야 합니다."]}
          interpretation="새 환자 배포라면 Z는 patch가 아니라 환자이고, 환자별 loss를 평균내는 group split이 출발점입니다."
        />
      </section>

      <section id="split-family" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">배포 질문을 적은 뒤에 split family를 고릅니다</h2>
        <TermBreakdown
          title="질문과 split의 첫 대응"
          items={[
            { term: "새 exchangeable row", description: "행 순서를 바꾸어도 같은 분포의 독립 표본으로 볼 수 있을 때 K-fold를 시작점으로 씁니다." },
            { term: "새 entity 또는 site", description: "같은 원인의 파생 row를 group 단위로 통째로 이동합니다." },
            { term: "다음 시간 구간", description: "과거로 학습하고 미래를 평가하는 walk-forward 순서를 씁니다." },
            { term: "새 site의 미래", description: "Group 격리와 시간 방향을 동시에 만족하는 group×time 설계가 필요합니다." },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">배포 분포가 바뀌면 과거 CV는 새 환경을 보장하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>좋은 split은 알려진 배포 질문을 재연할 뿐입니다. 새 국가·새 sensor·정책 변경처럼 분포가 바뀌면 새 기간이나 site에서 다시 검증하고 monitoring을 연결해야 합니다.</p></div>
        <div id="paper-cv-foundation" className="not-prose mt-8">
          <CitationBlock source="scikit-learn — Cross-validation: evaluating estimator performance" citeKey={1} type="documentation" href="https://scikit-learn.org/stable/modules/cross_validation.html">
            KFold·GroupKFold·TimeSeriesSplit의 현재 splitter semantics를 확인하는 공식 문서입니다. Class 이름 선택만으로 deployment unit과 leakage boundary가 자동 결정된다는 근거는 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}

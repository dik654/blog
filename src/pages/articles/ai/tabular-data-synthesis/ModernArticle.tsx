import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { TabularSynthesisViz } from "../data-augmentation/viz/ModernAugmentationViz";

export default function TabularDataSynthesisArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Synthetic table은 정상 범위의 값 모음이 아니라 가능한 row를 만들어야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">나이와 금액이 각각 정상 범위여도 계약 종료일이 시작일보다 빠르거나 부분합이 총액과 다르면 현실에 존재할 수 없는 row입니다. Tabular synthesis는 column histogram뿐 아니라 <strong>row 관계·entity 상태·시간 순서</strong>를 함께 보존해야 합니다.</p></div><TermBreakdown title="Synthetic row가 통과할 네 경계" items={[
      {term:"Schema",description:"Column type·unit·range·category vocabulary를 고정합니다."},
      {term:"Constraint ledger",description:"여러 column과 row를 묶는 식·순서·entity 규칙을 실행 가능한 목록으로 둡니다.",example:"start_date≤end_date, subtotal sum=total."},
      {term:"Split-local synthesis",description:"Neighbor·generator·statistics를 split 이후 training fold에만 fit합니다."},
      {term:"Utility–privacy audit",description:"Downstream usefulness와 duplicate·membership leakage를 같은 release 표에서 평가합니다."},
    ]}/><TabularSynthesisViz/><ContentBoundary article="tabular-data-synthesis"/></section>

    <section id="constraints" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Constraint ledger는 invalid row를 만든 뒤 눈으로 찾는 일을 실행 규칙으로 바꿉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            각 rule에는 식, 적용 entity, 허용 오차, failure action을 둡니다. range rule이 보는 것은 column 하나, relational rule은
            여러 column, temporal rule은 같은 entity의 row sequence입니다. generator score가 높아도 hard constraint를 어긴
            row는 training input으로 release하지 않습니다.
          </p></div></section>

    <section id="split-local" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">먼저 split하고, training fold의 정보만으로 fit하고 sample합니다</h2><ExplainedFormula question="SMOTE형 interpolation을 하더라도 왜 neighbor와 λ가 training fold 안에 갇혀야 하나요?" idea={<p>
            같은 training index set에서 anchor와 neighbor를 고르고 그 사이를 보간합니다. 이후 constraint indicator가 1인 row만 후보로
            남깁니다.
          </p>} formula={String.raw`i,j\in I_{\rm train},\quad \tilde x=x_i+\lambda(x_j-x_i),\quad a(\tilde x)=\prod_{r=1}^{R}\mathbf1[c_r(\tilde x)=1]`} annotatedFormula={String.raw`\begin{aligned}i,j&\in\underbrace{I_{\rm train}}_{\text{training fold source만 선택}}\\d&=\underbrace{x_j-x_i}_{\text{neighbor 방향 계산}}\\\widetilde x&=\underbrace{x_i+\lambda d}_{\text{anchor에서 }\lambda\text{ 만큼 이동}}\\a(\widetilde x)&=\underbrace{\prod_{r=1}^{R}\mathbf1[c_r(\widetilde x)=1]}_{\text{모든 constraint pass 시 승인}}\end{aligned}`} operations={[
      {expression:String.raw`i,j\in I_{\rm train}`,annotation:["source와 neighbor를 train set으로 제한해","validation 위치 정보 유입을 차단"]},
      {expression:String.raw`x_j-x_i`,annotation:["neighbor와 anchor의 차이를 구해","interpolation 방향 생성"]},
      {expression:String.raw`x_i+\lambda d`,annotation:["anchor에서 방향의 lambda 비율만큼 이동해","synthetic candidate row 생성"]},
      {expression:String.raw`\prod_r\mathbf1[c_r=1]`,annotation:["각 constraint pass 값을 곱해","하나라도 실패하면 최종 admission을 0으로 설정"]},
    ]} terms={[
      {symbol:String.raw`I_{\rm train}`,name:"Training index set",description:"Split이 끝난 뒤 model fitting에 허용된 row ID 집합입니다."},{symbol:String.raw`\lambda`,name:"Interpolation position",description:"0과 1 사이에서 anchor와 neighbor 사이 위치를 정합니다."},{symbol:String.raw`c_r`,name:"Constraint rule",description:"Range·relation·entity·time 조건 중 r번째 검사입니다."},{symbol:String.raw`a(\widetilde x)`,name:"Admission result",description:"모든 hard constraint를 통과할 때 1인 release 판정입니다."},
    ]} assumptions={["두 source row가 같은 semantic feature space에 있습니다.","Categorical·date·ID column은 단순 Euclidean 보간 대상으로 두지 않습니다.","Constraint ledger와 split digest가 versioned artifact입니다."]} interpretation="각 column 범위를 통과해도 relational constraint가 실패하면 row를 거부합니다. Split 전에 neighbor를 찾으면 validation geometry가 training data에 누출됩니다."/></section>

    <section id="audit" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">유용한 synthetic data가 곧 안전한 synthetic data는 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>평가는 schema pass rate, relational pass rate, subgroup distribution, downstream metric뿐 아니라 nearest-real distance, exact duplicate, rare-category memorization, membership attack slice를 분리합니다. 높은 utility 때문에 privacy failure를 평균내 버리지 않습니다.</p><p>
            SMOTE는 minority neighbor 사이 보간의 한 방법입니다. class imbalance의 threshold·resampling 평가는 별도 정본에서 다룹니다.
            여기서는 어떤 generator든 split-local fit과 row admission을 거쳐야 한다는 공통 경계를 소유합니다.
          </p></div><div id="paper-smote" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Chawla et al. — SMOTE" href="https://www.jair.org/index.php/jair/article/view/10302">Minority examples와 이웃 사이를 보간하는 oversampling 방법입니다. Mixed feature·temporal constraint·privacy를 자동으로 해결한다는 뜻은 아닙니다.</CitationBlock></div><div id="paper-ctgan" className="not-prose mt-5 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Xu et al. — Modeling Tabular data using Conditional GAN" href="https://arxiv.org/abs/1907.00503">Mixed continuous/discrete tabular distribution을 conditional generation으로 다룹니다. 논문 benchmark utility가 현재 schema의 business constraint나 privacy를 보장하지는 않습니다.</CitationBlock></div></section>
  </div>;
}

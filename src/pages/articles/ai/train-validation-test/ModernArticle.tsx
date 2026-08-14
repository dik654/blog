import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import SplitBoundaryViz from "./SplitBoundaryViz";

const ESL = "https://hastie.su.domains/ElemStatLearn/";
const CV_PAPER = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/";

export default function TrainValidationTestArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">00 · 세 이름을 따로</p><h2 className="mt-2 text-2xl font-bold">Train·validation·test는 크기가 아니라 의사결정 역할로 구분한다</h2></header>
        <Role name="Train set" owns="Model parameter 학습" may="Gradient update·fitted preprocessing statistic" mustNot="최종 성능의 독립 증거로 재사용" />
        <Role name="Validation set" owns="후보 선택과 tuning" may="Learning rate·architecture·checkpoint 비교" mustNot="직접 gradient update하거나 선택 편향을 무시" />
        <Role name="Test set" owns="선택이 끝난 뒤 최종 보고" may="동결된 procedure의 독립 평가" mustNot="결과를 보고 model·threshold·prompt를 다시 변경" />
        <SplitBoundaryViz />
      </section>

      <section id="selection-feedback" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · feedback의 방향</p><h2 className="mt-2 text-2xl font-bold">Validation은 weight를 직접 바꾸지 않아도 선택을 통해 procedure를 바꾼다</h2></header>
        <p>Validation score를 보고 learning rate나 checkpoint를 고르는 순간 그 data는 선택 과정에 영향을 줍니다. 이것이 validation의 정상 역할입니다.</p>
        <p>같은 validation을 수백 번 보며 candidate를 만들면 그 score의 우연한 noise에도 맞출 수 있습니다. 시도 횟수·선택 규칙·seed를 기록하고, 마지막에는 보지 않은 test가 필요합니다.</p>
        <Term term="Validation selection feedback" description="Validation 결과가 model weight가 아니라 candidate·hyperparameter·stopping decision으로 돌아가는 경로입니다." boundary="‘Gradient에 안 썼으니 독립’이라는 주장은 틀립니다." />
        <Term term="Test-set reuse contamination" description="Test 결과를 보고 어떤 설정이든 바꾸면 test가 사실상 validation 역할을 하게 되는 상태입니다." boundary="이미 본 test를 다시 독립 final evidence로 부를 수 없습니다." />
      </section>

      <section id="generalization" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 무엇을 보고 싶은가</p><h2 className="mt-2 text-2xl font-bold">Generalization은 학습에 없던 같은 목표의 example에서 성능을 유지하는 능력이다</h2></header>
        <p>Training score가 높은 것은 학습 data를 잘 맞혔다는 관측입니다. 새 data에서도 같은 규칙이 작동하는지는 validation·test처럼 학습 밖의 example로 따로 확인해야 합니다.</p>
        <ExplainedFormula
          question="Train과 validation loss의 차이는 무엇을 먼저 경고할까요?"
          idea={<>같은 metric과 reduction으로 잰 validation loss에서 train loss를 빼, 학습 밖에서 추가로 생긴 오차를 봅니다.</>}
          formula={String.raw`G=\mathcal L_{validation}-\mathcal L_{train}`}
          annotatedFormula={String.raw`G=\underbrace{\mathcal L_{validation}}_{\substack{\text{선택용 새 data의}\text{관측 오차}}}-\underbrace{\mathcal L_{train}}_{\substack{\text{parameter 학습에 쓴}\text{data의 관측 오차}}}`}
          operations={[
            { expression: String.raw`\mathcal L_{validation}-\mathcal L_{train}`, annotation: ["학습 밖 오차에서", "학습 안 오차를 빼 gap 계산"] },
          ]}
          terms={[
            { symbol: String.raw`\mathcal L_{train}`, name: "Training loss", description: "Parameter update에 사용한 split의 loss입니다." },
            { symbol: String.raw`\mathcal L_{validation}`, name: "Validation loss", description: "Candidate 선택에 사용한 학습 밖 split의 loss입니다." },
            { symbol: "G", name: "Observed generalization gap", description: "두 관측 loss의 차이이며 population guarantee가 아닙니다." },
          ]}
          assumptions={["두 loss는 같은 target, metric, reduction과 comparable distribution에서 계산합니다.", "Gap이 크면 overfitting뿐 아니라 split shift·leakage·pipeline mismatch도 함께 조사합니다."]}
          interpretation="G가 크다는 사실은 진단의 출발점입니다. 원인을 자동으로 overfitting 하나로 확정하지 않습니다."
        />
      </section>

      <section id="next-protocol" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 비율 뒤의 실제 경계</p><h2 className="mt-2 text-2xl font-bold">같은 사람·미래 시점이 양쪽에 섞이지 않게 evaluation unit을 정한다</h2></header>
        <div className="grid gap-4 md:grid-cols-3">
          <Case title="새 row" detail="독립·동일분포에 가까울 때 random split 후보" />
          <Case title="새 사람·site" detail="같은 entity 파생 row를 group 단위로 분리" />
          <Case title="미래" detail="Prediction 시점 이후 data가 train으로 새지 않게 time split" />
        </div>
        <p>여러 fold로 procedure risk를 추정하고 group·time boundary를 설계하는 방법은 <a className="font-semibold text-primary underline" href="/ai/cross-validation">Cross-validation</a> 글로 이어집니다. 이 글은 그 전에 필요한 세 역할과 final test 경계만 소유합니다.</p>
        <div id="paper-train-test"><CitationBlock source="The Elements of Statistical Learning · Model Assessment and Selection" citeKey={1} href={ESL}><Evidence problem="Training error와 generalization error, model selection과 assessment를 구분" contribution="Training·validation·test 역할과 bias–variance 관점을 정리" assumptions="명시된 statistical learning setting과 sampling·loss 조건" scope="교과서의 model assessment·selection 원리" notClaim="고정 비율 random split이 모든 group·time deployment에 맞는다는 뜻이 아님" /></CitationBlock></div>
        <div id="paper-cv-estimand"><CitationBlock source="Cross-Validation: What Does It Estimate and How Well Does It Do It?" citeKey={2} href={CV_PAPER}><Evidence problem="CV가 특정 fitted model과 learning procedure 중 무엇의 error를 추정하는지 구분" contribution="CV estimand와 uncertainty를 이론·simulation으로 분석" assumptions="논문의 OLS theorem과 CV construction 조건" scope="논문이 분석한 estimand·coverage 범위" notClaim="모든 learner에서 finite-sample equality나 독립 test 대체를 보장하지 않음" /></CitationBlock></div>
        <ContentBoundary article="train-validation-test" />
      </section>
    </article>
  );
}

function Role({ name, owns, may, mustNot }: { name: string; owns: string; may: string; mustNot: string }) { return <div className="grid gap-3 border-l border-primary/70 pl-5 md:grid-cols-[9rem_1fr]"><div><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 font-bold">{name}</h3></div><div className="space-y-2 text-sm leading-6"><p><strong>소유:</strong> {owns}</p><p><strong>사용:</strong> {may}</p><p className="text-muted-foreground"><strong className="text-foreground">금지:</strong> {mustNot}</p></div></div>; }
function Term({ term, description, boundary }: { term: string; description: string; boundary: string }) { return <div className="border border-border p-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 font-bold">{term}</h3><p className="mt-3 leading-7">{description}</p><p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Case({ title, detail }: { title: string; detail: string }) { return <div className="border border-border p-5"><p className="font-bold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import SplitBoundaryViz from "./SplitBoundaryViz";

const ESL = "https://hastie.su.domains/ElemStatLearn/";
const CV_PAPER = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function TrainValidationTestArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 연습에 쓴 문제로 마지막 성적까지 매기면 무엇이 빠질까요</h2>
<p className="leading-8">새 사람의 사진을 보고 상태를 구분하는 계산을 만든다고 합시다. 서로 다른 1,200명의 사진이 한 장씩 있고, 모든 사진에는 확인된 정답이 있습니다 (가정). 이 사진을 모두 보면서 계산을 고친 다음 같은 사진으로 점수를 매기면, 처음 보는 사람에게도 잘 작동하는지는 알 수 없습니다.</p><p className="leading-8">새 사람에 대한 성능을 확인하려면 아직 결정을 바꾸는 데 쓰지 않은 사진이 필요합니다. 또한 여러 계산 규칙 중 무엇을 사용할지도 골라야 합니다. 배우는 자료, 후보를 고르는 자료, 마지막 성적을 매기는 자료에 서로 다른 일을 맡기는 이유입니다.</p><p className="leading-8">이 글에서는 800명으로 규칙을 배우고, 200명으로 두 후보를 고른 뒤, 남은 200명으로 선택이 끝난 결과를 평가합니다 (가정). 800:200:200은 설명을 위한 수이며 모든 문제에 권장하는 비율은 아닙니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 배우기, 고르기, 보고하기의 순서를 고정합니다</h2>
<p className="leading-8">첫 묶음의 정답은 계산에 쓰는 숫자를 고칩니다. 둘째 묶음의 성적은 어느 후보를 선택할지 고칩니다. 셋째 묶음의 성적은 선택을 끝낸 뒤 결과를 보고하는 데 씁니다. 마지막 성적을 보고 후보를 다시 고르면 그 묶음도 이미 선택에 참여한 것입니다.</p><NumericPath title="세 묶음은 크기보다 바꿀 수 있는 결정으로 구분합니다" steps={[{label:"규칙을 배웁니다",value:"800명"},{label:"후보를 고릅니다",value:"200명"},{label:"선택 후 평가합니다",value:"200명"}]} /><p className="leading-8">화살표는 한 방향으로 진행합니다. 마지막 200명의 결과가 앞의 선택으로 돌아오지 않는지 확인하는 것이 단순히 파일을 세 개 만드는 것보다 중요합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 연습 성적이 좋은 후보와 새 자료 성적이 좋은 후보가 다릅니다</h2>
<p className="leading-8">후보 A는 처음 800명에서 80번 틀리고, 둘째 200명에서는 40번 틀렸습니다. 후보 B는 처음 800명에서 120번, 둘째 200명에서는 30번 틀렸습니다 (가정). 첫 묶음의 오답률은 A가 10%, B가 15%지만, 둘째 묶음에서는 A가 20%, B가 15%입니다.</p><p className="leading-8">둘째 묶음의 오답률로 고르겠다고 미리 정했다면 B를 선택합니다. B가 첫 묶음에서 덜 정확하다는 이유만으로 A를 고르면 처음 정한 선택 기준을 바꾼 셈입니다. 마지막 200명의 정답은 이 결정이 끝날 때까지 열지 않습니다.</p><p className="leading-8">여기에는 아직 마지막 성적이 없습니다. 현재 아는 것은 정해진 선택용 자료에서 B가 더 나았다는 사실입니다. 세 묶음 안을 열어 어떤 값이 어디로 되돌아가는지 보겠습니다.</p>
</section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 자료 묶음마다 나갈 수 있는 정보가 다릅니다</h2>
<p className="leading-8">첫 묶음에서는 사진과 정답을 반복해서 읽고 계산에 쓰는 숫자를 바꿉니다. 둘째 묶음에서는 이미 학습된 후보들의 답을 비교해 A 또는 B를 고릅니다. 셋째 묶음은 선택한 B의 답을 한 번 평가해 보고할 수치를 만듭니다.</p><p className="leading-8">독립성을 유지하려면 사진뿐 아니라 같은 사람을 가리키는 식별자도 함께 묶어야 합니다. 한 사람의 사진을 복사하거나 잘라 만든 자료가 여러 묶음에 들어가면, 새 사진을 평가해도 새 사람을 평가한 것은 아닐 수 있습니다. 이 예에서는 한 사람당 사진 한 장을 가정했으므로 사람 경계와 행 경계가 같습니다.</p><p className="leading-8">자료의 경계와 정보가 돌아가는 경로가 보입니다. 다음으로 마지막 묶음을 따로 남겨야 하는 이유를 점수의 우연성에서 확인하겠습니다.</p>
</section>
<section id="why-holdout" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 선택에 쓰인 점수에는 선택한 흔적이 남습니다</h2>
<p className="leading-8">A와 B를 둘째 묶음에서 비교한 순간, 200명의 결과가 B를 선택하는 데 사용됐습니다. 둘째 묶음의 15%는 이 자료에서 후보를 고른 뒤 보고한 최솟값입니다. 두 후보의 실제 새 사람 성능이 같아도 유한한 사진에서 우연히 한 후보의 점수가 더 좋게 나올 수 있습니다.</p><p className="leading-8">후보를 100번 바꿔 같은 자료를 확인하면 그 우연에 맞는 설정을 찾을 기회도 늘어납니다 (가정). 그래서 선택용 점수를 최종 독립 성적으로 쓰지 않고, 끝까지 선택에 참여하지 않은 마지막 200명으로 B를 평가합니다. 큰 마지막 묶음도 이미 선택에 썼다면 이 역할을 회복하지 못합니다.</p><p className="leading-8">이유는 자료를 직접 미분에 썼는지 여부보다 넓습니다. 점수가 어떤 결정을 바꾸었는지에 이름을 붙이면 숨어 있는 되먹임도 추적할 수 있습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 세 자료의 표준 이름은 역할을 나타냅니다</h2>
<p className="leading-8">Parameter를 배우는 첫 800명이 train set입니다. 후보를 고르는 다음 200명이 validation set이며, 선택 종료 뒤 최종 평가에 쓰는 마지막 200명이 test set입니다. Validation으로 학습 속도나 계산 구조, 저장 시점 중 무엇을 쓸지 고르는 것도 정상적인 선택입니다.</p><SplitBoundaryViz /><p className="leading-8">비율이 아니라 어떤 의사결정에 정보를 주는지가 이름을 정합니다. 이제 처음의 A와 B를 이 이름으로 부르며 최종 보고까지 이어 보겠습니다.</p>
</section>
<section id="selection-feedback" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. B를 선택한 뒤 마지막 200명에서 44번 틀렸습니다</h2>
<p className="leading-8">Train의 오답률 A=10%, B=15%, validation의 오답률 A=20%, B=15%를 보고 B를 선택합니다. 이 결과가 후보 선택으로 돌아간 경로를 validation selection feedback이라고 부릅니다. B를 고른 뒤 구조, 학습 절차, 판정 기준을 고정하고 test를 열었더니 200명 중 44명을 틀렸습니다 (가정). 최종 관측 오답률은 22%입니다.</p><p className="leading-8">여기서 test의 22%가 마음에 들지 않아 판정 기준을 조절하면 test-set reuse contamination, 최종 평가 자료의 재사용 문제가 생깁니다. 조정 자체를 금지하는 뜻은 아닙니다. 그 자료를 이제 선택에 사용했다고 기록하고, 새로 고친 규칙의 독립 평가에는 별도의 보지 않은 자료를 남겨야 합니다.</p><p className="leading-8">최초 test 열람 시각, 본 지표, 그 뒤 바꾼 설정과 수정 이유를 기록하면 최종 보고가 어느 규칙을 평가한 것인지 추적할 수 있습니다. 오류 수정이라도 test 결과를 계기로 바꾸었다면 그 의존 관계를 남깁니다. 선택용 자료에서는 시도 횟수, 후보의 변경 내역, 무작위 시작값, 마지막으로 동결한 선택 규칙도 함께 기록합니다.</p><AlgorithmBlock title="학습·후보 선택·최종 보고 분리 (의사코드)" input={["서로 다른 1,200명, 사람 ID별 800/200/200 분리 (가정)","후보 A와 B, 사전 선택 기준: validation 오답률 최소"]} steps={[{code:"train 800명으로 A와 B를 각각 학습"},{code:"validation 200명에서 A의 오답 40, B의 오답 30을 계산"},{code:"B를 선택하고 전처리·학습·판정 규칙을 고정"},{code:"test 200명에서 고정한 B의 오답 44를 집계"},{code:"44 / 200 = 0.22를 보고; 이후 적응이 있으면 새 평가 자료 확보"}]} output="선택 기록 B, 고정된 평가 대상, 관측 test 오답률 22%" /><p className="leading-8">처음 사진 수에서 최종 오답률까지 같은 사례가 이어졌습니다. 이 경계를 공식 문서의 실제 문구에 적용해 보겠습니다.</p>
</section>
<section id="source-choice" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 공식 문서의 ‘모델 선택에 쓰지 않는다’를 사례에 적용합니다</h2>
<p className="leading-8">
            scikit-learn 공식 문서 12.2절 Data leakage는 최종 평가 자료를 모델 선택에 쓰지 말라고 명시합니다. 2026-10-04에 확인한 문서의 실제 문장은
            다음과 같습니다.
          </p><blockquote className="border-l-2 border-primary pl-5 leading-8">Test data should never be used to make choices about the model.</blockquote><p className="leading-8">우리 사례에서 22%를 본 뒤 B의 판정 기준을 바꾸는 행동이 이 문구가 제한하는 선택에 해당합니다. θ를 직접 갱신하지 않았더라도 예측 결과를 만드는 규칙이 test 정보에 반응했기 때문입니다. 원래 선택이 끝난 B의 22%와, test를 보며 수정한 새 규칙의 점수를 같은 독립 평가로 합치지 않습니다.</p><a href="https://scikit-learn.org/stable/common_pitfalls.html#data-leakage" target="_blank" rel="noreferrer" className="text-primary underline">원문: Common pitfalls, 12.2 Data leakage</a><p className="leading-8">정답을 이용한 선택뿐 아니라 입력을 변환하는 준비 과정에서도 정보가 샐 수 있습니다. 같은 800/200/200 경계를 그 준비 과정까지 따라갑니다.</p>
</section>
<section id="source-preprocessing" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 입력의 평균을 구할 때도 같은 경계를 유지합니다</h2>
<p className="leading-8">사진에서 구한 한 숫자의 train 평균이 10, validation 평균이 20, test 평균이 30이라고 합시다 (가정). 각 입력에서 평균을 빼기로 했다면, 학습 때 쓸 평균은 첫 800명의 10입니다. 세 묶음을 합쳐 평균을 구하면 (800×10+200×20+200×30)/1,200=15가 되어 test의 분포가 학습 준비에 이미 영향을 줍니다.</p><p className="leading-8">같은 공식 문서 12.2절의 짧은 규칙은 “never call fit on the test data”입니다. 여기서 fit은 자료에서 변환 규칙이나 모델 숫자를 배우는 호출입니다. Test 값 30을 변환할 때 train에서 구한 평균 10을 적용하면 20이고, test를 포함해 다시 배운 평균 15를 적용하면 15입니다. 후자는 원래의 독립 평가 절차와 다른 계산입니다.</p><p className="leading-8">Validation이나 test에는 train에서 배운 같은 변환을 적용합니다. 변환 자체를 생략하면 학습 때와 입력 좌표가 달라집니다. 공식 문서 12.1절과 12.2.1절이 구분하는 fit_transform과 transform의 역할도 각각 규칙을 배우며 적용하기, 배운 규칙만 적용하기입니다.</p><a href="https://scikit-learn.org/stable/common_pitfalls.html#how-to-avoid-data-leakage" target="_blank" rel="noreferrer" className="text-primary underline">원문: 12.1 전처리 일관성, 12.2.1 정보 누출 방지</a><p className="leading-8">파일 경계만 지키면 충분하지 않은 이유가 드러났습니다. 마지막으로 관측 점수의 차이가 무엇을 말하고 무엇을 말하지 않는지 살펴봅니다.</p>
</section>
<section id="generalization" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">10. 점수 차이는 진단의 출발점이고 원인의 증명은 아닙니다</h2>
<p className="leading-8">학습에 없던 같은 목표의 새 자료에도 규칙이 작동하는 능력을 generalization, 일반화라고 부릅니다. A의 train 10%와 validation 20%의 차이는 10%포인트입니다. B의 두 점수 차이는 0이지만 test에서는 22%였습니다. Validation 점수 차이가 작다는 조건만으로 미래 성능까지 보장되지는 않습니다.</p><ExplainedFormula
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
        /><p className="leading-8">오답률과 다른 손실을 쓰더라도 같은 단위끼리 비교합니다. 예를 들어 validation loss 0.4와 train loss 0.25의 차이는 0.15입니다 (가정). 이것은 원래 예의 오답률이나 %포인트와 같은 단위가 아닙니다. 차이가 크면 학습을 반복하며 나타난 변화, 두 자료의 분포, 사람·시점 중복, 전처리 일관성을 각각 확인합니다.</p><div id="next-protocol" className="space-y-5"><h3 className="text-xl font-semibold">새 사람인지, 새 행인지, 미래인지를 먼저 정합니다</h3><p className="leading-8">독립이고 같은 분포에 가까운 새 행을 예측하려면 무작위 분리가 후보가 됩니다. 새 사람이나 새 병원에 적용하려면 해당 집단 전체를 묶어 나눕니다. 미래를 예측하려면 예측 시점 뒤 정보를 과거 학습에 섞지 않습니다. 이 선택이 달라지면 같은 800/200/200도 다른 질문을 평가합니다.</p><p className="leading-8">여러 묶음을 교대로 평가하는 <a href="/cs/ai/cross-validation" className="text-primary underline">교차 검증</a>에서도 각 회차의 전처리는 그 회차의 학습 자료로만 배웁니다. 후보 선택과 절차 비교를 마친 뒤 최종 평가 자료를 남기는 경계는 계속 필요합니다.</p></div>        <div id="paper-train-test"><CitationBlock source="The Elements of Statistical Learning · Model Assessment and Selection" citeKey={1} href={ESL}><Evidence problem="Training error와 generalization error, model selection과 assessment를 구분" contribution="Training·validation·test 역할과 bias–variance 관점을 정리" assumptions="명시된 statistical learning setting과 sampling·loss 조건" scope="교과서의 model assessment·selection 원리" notClaim="고정 비율 random split이 모든 group·time deployment에 맞는다는 뜻이 아님" /></CitationBlock></div>
        <div id="paper-cv-estimand"><CitationBlock source="Cross-Validation: What Does It Estimate and How Well Does It Do It?" citeKey={2} href={CV_PAPER}><Evidence problem="CV가 특정 fitted model과 learning procedure 중 무엇의 error를 추정하는지 구분" contribution="CV estimand와 uncertainty를 이론·simulation으로 분석" assumptions="논문의 OLS theorem과 CV construction 조건" scope="논문이 분석한 estimand·coverage 범위" notClaim="모든 learner에서 finite-sample equality나 독립 test 대체를 보장하지 않음" /></CitationBlock></div>
<ContentBoundary article="train-validation-test" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>A의 train 성적이 더 좋은데도 B를 고른 이유는 무엇일까요? (답: 7절)</li><li>마지막 200명의 22%를 보고 판정 기준을 바꾸면 그 자료는 어떤 역할을 맡게 될까요? (답: 7절)</li><li>800/200/200 묶음을 합쳐 평균 15를 배우면 최종 평가 경계는 어디에서 깨질까요? (답: 9절)</li></ol>
</section>
</article>;}
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

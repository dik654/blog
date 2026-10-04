import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import PaperReading from "./research-audit-sources/PaperReading";
import { codeRefs, fileTrees, projectMetas } from "./world-model-latent-planning/codeRefs";

import WorldPlanningViz from "./research-audit-sources/WorldPlanningViz";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 실행하기 전에 후보를 비교하고 실행 뒤 다시 관측한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">물체가 위치 0에 있고 목표는 2라고 합시다 (가정). 왼쪽 −1 또는 오른쪽 +1의 두 번 이동을 미리 비교하면 [+1,+1]이 목표에 닿습니다. 그러나 실제로는 한 번에 0.8만 움직였다면 계획을 새 관측에서 다시 계산해야 합니다.</p>
        <p className="leading-8">행동에 따른 다음 상태를 먼저 예상하면 실제로 움직이기 전에 후보를 비교할 수 있습니다. 예측을 만드는 모델, 후보를 고르는 계획기, 실제 행동을 실행하는 환경을 나누어 보면 이미지 생성과 로봇 행동 사이에 필요한 조건이 드러납니다. 이 숫자는 물리 단위를 생략한 설명용 1차원 가정입니다.</p>
      </div>


      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 가지 목표와 네 후보를 고정했습니다. 먼저 모델의 입력과 출력을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 현재 관측과 행동을 받아 다음 관측의 표현을 예측한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">실제 시스템의 입력은 이미지나 센서 관측과 행동입니다. 관측을 숫자 묶음 z로 바꾸는 부품이 있고, 그 숫자와 행동 a로 다음 숫자를 예상하는 부품이 있습니다. 이 표현이 목표 비교에 충분한 정보를 담아야 계획에 쓸 수 있습니다.</p>
        <p className="leading-8">계획기는 여러 행동 열을 모델 안에서 실행해 비용이 작은 후보를 고릅니다. 실제 환경은 선택한 행동을 실행하고 새로운 관측을 돌려줍니다. 모델 안의 예측값과 센서가 관측한 값은 서로 다른 출처입니다.</p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예측과 실제 관측을 구분했습니다. 네 후보를 숫자로 비교합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 두 번 오른쪽으로 가는 후보의 예측 비용은 0이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">가정 모형 x′=x+a에서 시작 0, 목표 2입니다. [−1,−1]의 마지막 위치는 −2라서 제곱거리 (−2−2)²=16입니다. [−1,+1]과 [+1,−1]은 마지막 0이므로 비용 4입니다. [+1,+1]은 마지막 2이므로 비용 0입니다.</p>
        <p className="leading-8">이 계산에서 가장 좋은 후보는 [+1,+1]입니다. 아직 실제 물체를 움직이지는 않았습니다. 후보 수와 예측 길이를 늘리면 더 많은 미래를 비교할 수 있지만 모델 호출과 메모리, 계획 시간이 함께 늘어납니다.</p>
      </div>
<NumericPath title="관측·예측·선택·실행의 순서" steps={[{"label": "시작 관측", "value": "x=0", "detail": "목표 x=2"}, {"label": "후보 예측", "value": "마지막 −2, 0, 0, 2", "detail": "두 행동을 모델 안에서 반복"}, {"label": "비용 비교", "value": "16, 4, 4, 0", "detail": "최소 후보 [+1,+1]"}, {"label": "실행과 재관측", "value": "첫 행동의 실제 결과 0.8", "detail": "예측 1.0과 다르면 다시 계획"}]} />
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">후보들의 비용을 구했습니다. 이제 한 행동만 실행하고 모델과 관측을 비교합니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 모델의 1.0을 실제 관측 0.8로 교체한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 행동 +1 뒤 모델은 위치 1.0을 예상하지만 가정한 실제 환경은 0.8을 돌려줍니다. 두 번째 행동까지 눈을 감고 실행하면 실제 위치는 1.6입니다. 처음 예측한 2와 0.4만큼 차이가 납니다.</p>
        <p className="leading-8">새 관측 0.8을 다시 관측을 숫자로 바꾸는 부품에 넣으면 다음 계획은 그곳에서 시작합니다. 아래 표는 같은 네 후보를 새 출발점에서 다시 비교합니다. 피드백이 오차를 드러내지만 모델의 편향이나 부족한 후보를 저절로 없애지는 않습니다.</p>
      </div>
<WorldPlanningViz />
      <p className="leading-8">출발점이 0.8로 바뀌면 같은 네 후보의 마지막 예측은 −1.2, 0.8, 0.8, 2.8입니다. 목표 2와의 제곱거리는 10.24, 1.44, 1.44, 0.64입니다. 네 후보 안에서는 두 번 오른쪽이 여전히 가장 작지만 비용은 더 이상 0이 아닙니다. 다시 보는 것만으로 편향된 예측 규칙이나 제한된 후보가 완벽해지지 않습니다.</p><p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">관측으로 끊어야 할 위치를 찾았습니다. 미래 표현이 왜 필요한지 봅니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5 · 그럴듯한 다음 화면만으로 좋은 행동을 고를 수는 없다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">움직이지 않아도 배경과 색을 잘 복원하는 영상은 예측 오차가 작을 수 있습니다. 하지만 왼쪽과 오른쪽 행동의 차이를 구별하지 못하면 목표로 갈 후보를 고를 수 없습니다. 행동에 민감한 상태 정보가 필요합니다.</p>
        <p className="leading-8">픽셀 하나하나를 재구성하지 않고 계획에 필요한 표현을 예측하면 계산을 줄일 수 있습니다. 대신 관측을 숫자로 바꾸는 부품이 물체 위치·가림·접촉처럼 후속 행동에 필요한 정보를 버리지 않는지 검사해야 합니다. <Link to="/cs/ai/visual-representation-tokenizers#world-state">표현이 남겨야 할 상태</Link>가 이 입력 조건을 다룹니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예쁜 출력과 유용한 상태 표현의 차이를 확인했습니다. 각 부품의 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6 · JEPA는 표현을 예측하고 계획기는 행동을 고른다</h2>
      <div className="overflow-x-auto"><table className="min-w-[640px] w-full text-left text-sm"><thead><tr><th>이미 본 역할</th><th>이름과 뜻</th><th>이 글의 값·조건</th></tr></thead><tbody><tr><td className="min-w-[180px] p-3">관측을 숫자 묶음으로 바꾸는 부품</td><td className="min-w-[180px] p-3">Encoder, 표현 변환기</td><td className="min-w-[180px] p-3">이미지에서 표현 z</td></tr><tr><td className="min-w-[180px] p-3">표현과 행동으로 다음 표현을 예상</td><td className="min-w-[180px] p-3">Predictor, 예측기</td><td className="min-w-[180px] p-3">이번 가정은 z=x, x′=x+a</td></tr><tr><td className="min-w-[180px] p-3">원래 관측 대신 계산에 쓰는 숫자 묶음</td><td className="min-w-[180px] p-3">Latent representation, 잠재 표현</td><td className="min-w-[180px] p-3">실제 학습값은 위치 단위와 다름</td></tr><tr><td className="min-w-[180px] p-3">행동에 따른 다음 상태를 예상하는 모델</td><td className="min-w-[180px] p-3">World model, 환경 변화 예측 모형</td><td className="min-w-[180px] p-3">실제 실행 전 후보 비교</td></tr><tr><td className="min-w-[180px] p-3">관측 표현에서 다른 표현을 예측하는 구조</td><td className="min-w-[180px] p-3">JEPA: Joint-Embedding Predictive Architecture</td><td className="min-w-[180px] p-3">이름만으로 행동 조건은 보장되지 않음</td></tr><tr><td className="min-w-[180px] p-3">예측 결과를 다음 예측 입력으로 사용</td><td className="min-w-[180px] p-3">Rollout, 여러 단계 펼쳐 보기</td><td className="min-w-[180px] p-3">0→1→2</td></tr><tr><td className="min-w-[180px] p-3">좋은 후보 통계로 다음 표본 분포를 좁힘</td><td className="min-w-[180px] p-3">CEM: Cross-Entropy Method</td><td className="min-w-[180px] p-3">네 후보 전수 열거와는 다른 탐색</td></tr><tr><td className="min-w-[180px] p-3">일부 행동 뒤 다시 관측하고 계획</td><td className="min-w-[180px] p-3">MPC: Model Predictive Control</td><td className="min-w-[180px] p-3">이번 가정 H=2, K=1</td></tr></tbody></table></div><div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Joint-Embedding Predictive Architecture는 관측을 latent 표현으로 바꾸고 다른 시점·부분의 표현을 예측하는 구조입니다. World model로 행동을 비교하려면 predictor에 action을 넣고 그 결과를 다시 입력하는 rollout이 필요합니다. JEPA라는 이름만으로 행동 조건이나 제어 성능이 보장되지는 않습니다.</p>
        <p className="leading-8">CEM은 후보 행동을 표본으로 만들고 비용이 작은 후보들의 통계로 다음 표본 분포를 좁히는 계획 방법입니다. MPC는 계획 일부를 실행한 뒤 관측을 받아 다시 계획하는 운영 방식입니다. 모델 학습, 후보 탐색, 재관측 주기는 서로 다른 선택입니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예측 구조와 행동 선택의 이름을 구분했습니다. 비용과 탐색을 같은 예로 계산합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7 · 후보를 고르는 동안 모델 가중치는 고정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">먼저 현재 관측과 목표를 같은 encoder로 표현합니다. 각 후보를 predictor에 순서대로 넣고 마지막 표현과 목표 표현의 제곱거리를 비교합니다. 네 후보를 전부 센 우리의 가정 사례와 달리 큰 연속 행동 공간에서는 일부 후보만 표본으로 뽑습니다.</p>
        <p className="leading-8">예를 들어 비용이 낮은 후보 두 개가 [+1,+1]과 [+1,−1]이라면 두 행동 좌표의 평균은 [+1,0]입니다. CEM은 이런 elite 통계를 다음 표본 분포에 사용합니다. 비용이 같은 후보를 고르는 방식과 탐색 분산도 결과를 바꾸며 전역 최적해를 보장하지 않습니다.</p>
        <p className="leading-8">계획 중 고치는 것은 행동 열의 후보 분포입니다. Predictor의 학습된 parameter를 매 후보마다 다시 학습하는 것이 아닙니다. 계획을 실행할 때 몇 행동을 먼저 쓸지 K와 미래를 몇 단계 볼지 H를 구별합니다. 이 글의 상호작용은 H=2, K=1입니다.</p>
      </div>
<ExplainedFormula question={"왜 두 행동을 실행하기 전에 비교할 수 있을까?"} idea={"현재 상태에 후보 행동을 차례로 넣어 미래 상태를 예측한 뒤, 마지막 상태와 목표의 거리를 비용으로 삼습니다."} formula={"\\hat z_{t+1}=f(\\hat z_t,a_t),\\quad J(a_{0:H-1})=\\|\\hat z_H-z_g\\|_2^2"} annotatedFormula={"J=\\underbrace{\\|\\hat z_H-z_g\\|_2^2}_{\\text{예측한 마지막 상태와 목표의 제곱거리}}"} operations={[{"expression": "f(\\hat z_t,a_t)", "annotation": ["현재 예측과 이번 행동으로 다음 상태를 만듭니다. 다음 단계는 실제 관측이 아니라 이 예측에서 이어집니다."]}, {"expression": "\\|\\hat z_H-z_g\\|_2^2", "annotation": ["목표와 각 좌표의 차이를 제곱해 더합니다. 이 비용이 실제 성공을 잘 반영하는지는 별도 조건입니다."]}]} terms={[{"symbol": "z_0,z_g", "name": "시작·목표 표현", "description": "이 글의 가정 모형은 z=x인 1차원 표현입니다."}, {"symbol": "a_t", "name": "행동", "description": "후보당 두 번의 −1 또는 +1 이동을 비교합니다."}, {"symbol": "H", "name": "예측 길이", "description": "H=2이며 실제 제어에서는 시간 간격과 action block을 함께 지정합니다."}]} assumptions={["가정 모형 f(x,a)=x+a를 사용합니다. 실제 LeWM의 학습된 latent는 미터 좌표가 아닙니다.", "후보 선택은 관측된 환경 밖의 정확성이나 제약 만족을 자동으로 보장하지 않습니다."]} interpretation={"시작 0, 목표 2에서 [−1,−1]은 마지막 −2와 비용 16, [−1,+1]과 [+1,−1]은 마지막 0과 비용 4, [+1,+1]은 마지막 2와 비용 0입니다."} />
<AlgorithmBlock title={"두 행동을 비교하고 첫 행동 뒤 다시 관측합니다 (의사코드)"} input={["관측 x=0, 목표 g=2, 예측 f(x,a)=x+a", "행동은 −1 또는 +1, 예측 길이 H=2, 실제 실행 길이 K=1"]} steps={[{"code": "candidates = [(-1,-1), (-1,+1), (+1,-1), (+1,+1)]", "note": "작은 사례이므로 전부 열거합니다. 실제 CEM 코드는 뒤 절에서 따로 봅니다."}, {"code": "for sequence in candidates: z=x; for a in sequence: z=f(z,a)", "note": "후보마다 현재 관측에서 시작해 두 행동을 순서대로 예측합니다."}, {"code": "  cost[sequence] = (z−g)^2", "note": "첫 관측에서는 비용이 차례로 16, 4, 4, 0입니다."}, {"code": "best = argmin(cost); execute_in_real_environment(best[0:K])", "note": "선택한 (+1,+1) 중 첫 +1만 실행합니다."}, {"code": "x = observe_real_environment()", "note": "실제 관측 0.8을 사용합니다. 예측했던 1로 덮어쓰지 않습니다."}, {"code": "replan from x within the remaining execution budget", "note": "다음 네 비용은 10.24, 1.44, 1.44, .64입니다."}]} output={"첫 실제 위치는 0.8이며, 갱신한 관측을 다음 계획의 입력으로 사용합니다."} repeatUntil={"관측으로 정한 도착 조건을 만족하거나 실행 예산을 소진할 때까지 반복합니다. 도착 자체가 보장되는 것은 아닙니다."} />
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">모델 안의 탐색과 실제 행동 수를 분리했습니다. 공식 원문의 rollout과 cost를 봅니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 rollout은 예측 표현을 다음 입력에 붙인다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">논문 저자의 le-wm commit 8edfeb3에서 rollout은 predictor의 다음 latent를 emb에 이어 붙입니다. criterion은 마지막 예측과 목표의 좌표별 제곱 차이를 합해 후보마다 비용 하나를 만듭니다. 이름이 mse_loss여도 reduction="none" 뒤 sum을 하므로 단순 평균이라고 읽지 않습니다.</p>
        <p className="leading-8">이 API의 의미를 확인하려고 latent를 z=x 한 차원으로 줄인 우리 가정을 넣으면 [+1,+1]의 마지막 예측 2와 목표 2에서 비용은 0입니다. [−1,−1]의 마지막 −2에서는 비용 16입니다. 실제 학습된 LeWM의 192차원 표현을 이 자리 숫자로 대체했다는 뜻은 아닙니다.</p>
        <p className="leading-8">별도 사이드바의 stable-worldmodel commit 21446f1은 cost가 작은 top-k 후보를 골라 평균·표준편차를 갱신하는 실제 solver입니다. 2026-10-02의 framework 코드이며 논문 발표 때 dependency와 동일하다고 주장하지 않습니다.</p>
      </div>
<CodeViewButton label="LeWM · 예측 이어 붙이기 87–107행" onClick={() => sidebar.open("world-rollout", codeRefs["world-rollout"])} /><CodeViewButton label="LeWM · 비용 합산 112–124행" onClick={() => sidebar.open("world-cost", codeRefs["world-cost"])} /><CodeViewButton label="CEM · 좋은 후보 선택 215–231행" onClick={() => sidebar.open("cem-select", codeRefs["cem-select"])} /><CodeViewButton label="CEM · 다음 분포 244–253행" onClick={() => sidebar.open("cem-update", codeRefs["cem-update"])} /><SourceApplication source={"LeWM criterion의 실제 연산"} excerpt={"reduction=\"none\""} application={"한 차원 가정에서 (−2−2)²=16이고 (2−2)²=0입니다. 실제 원문은 feature와 시간의 해당 축을 합산합니다."} /><CitationBlock source={"LeWM criterion의 실제 연산"} citeKey={2} href={"https://github.com/lucas-maes/le-wm/blob/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/jepa.py"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-lewm-code" title={"LeWM official implementation · 8edfeb3"} href={"https://github.com/lucas-maes/le-wm/blob/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/jepa.py"} problem={"관측·action 후보를 latent rollout과 cost로 연결"} idea={"예측을 다음 입력으로 연결하고 마지막 표현을 목표와 비교"} assumption={"encoder·action 간 시간 정렬과 학습된 표현을 유지"} experiment={"공식 코드 경로를 대조했으며 이 작업에서 학습·로봇 실행은 재현하지 않음"} boundary={"1차원 수치는 API 역할을 검산하는 가정이다. 학습된 encoder 출력이나 실측 성공률이 아니다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공식 함수의 상태 연결과 제곱거리 합을 확인했습니다. 모델이 모두 같은 표현을 내면 생기는 문제를 봅니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · 예측 오차 0도 모든 표현이 같다면 쓸모없다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">서로 다른 위치 −1, 0, 1을 encoder가 모두 z=0으로 바꾸고 predictor도 0을 내면 다음 표현의 예측 오차는 0입니다. 그러나 어느 행동과 목표도 구별할 수 없습니다. 표현 붕괴라고 부르는 실패이며 예측 loss만 최소화하면 이런 쉬운 해법이 생길 수 있습니다.</p>
        <p className="leading-8">LeWM은 latent prediction loss에 SIGReg를 더해 표현 분포가 등방 Gaussian과 맞도록 제약합니다. 모두 0이면 관측별 변화가 없으므로 이 분포 조건을 충족하지 않습니다. 단순히 분산만 크게 만드는 것과 같지 않으며 finite batch·projection으로 계산하는 실제 regularizer의 가정을 확인해야 합니다.</p>
        <p className="leading-8">V-JEPA 2의 비디오 표현 학습과 V-JEPA 2-AC의 action-conditioned 후속 학습은 구별됩니다. LeWM의 작은 환경별 end-to-end 학습과도 같은 훈련 설정이 아닙니다. 둘은 표현을 예측해 행동을 비교한다는 연결은 공유하지만 데이터·구조·붕괴 방지 방법을 그대로 교환할 수 없습니다.</p>
      </div>
<SourceApplication source={"LeWM 식 (3)의 학습 목적"} excerpt={"L_pred + λ SIGReg(Z)"} application={"−1·0·1을 전부 0으로 압축하면 prediction loss는 0이 될 수 있지만 Gaussian 분포 제약은 충족하지 못합니다."} /><CitationBlock source={"LeWM 식 (3)의 학습 목적"} citeKey={2} href={"https://arxiv.org/html/2603.19312v1"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-lewm" title={"LeWorldModel · arXiv 2603.19312v1"} href={"https://arxiv.org/html/2603.19312v1"} problem={"end-to-end latent prediction의 표현 붕괴와 복잡한 loss 설계"} idea={"prediction loss와 Gaussian 분포 regularizer의 결합"} assumption={"offline 데이터가 담은 상태·행동과 표현 차원·정규화 조건"} experiment={"Two-Room·Reacher·Push-T·OGBench-Cube, 단일 L40S의 저자 실험"} boundary={"본문은 일부 행동 후 재계획을 일반적으로 설명하지만 부록 D의 Planning solver 설정은 H=5개 행동 block 전체를 실행한다. 한 block은 환경 행동 5개여서 총 25환경 timestep에 해당한다. 이 글의 H=2·K=1 가정과 다르다."} /><PaperReading id="paper-vjepa2" title={"V-JEPA 2 · arXiv 2506.09985"} href={"https://arxiv.org/abs/2506.09985"} problem={"관측 중심 표현을 이해·예측·행동에 연결"} idea={"비디오 표현을 학습하고 action-conditioned 모델로 후속 학습"} assumption={"action과 관측의 대응, 배포 환경의 시각·동역학 조건"} experiment={"공식 논문에 보고된 비디오·로봇 과제의 저자 실험"} boundary={"비디오 예측 성능 자체가 모든 로봇의 closed-loop 성공을 보장하지 않는다."} />
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예측이 쉬운 표현과 계획에 유용한 표현을 구분했습니다. 실제 평가의 시간 범위를 점검합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10 · 예측이 정확해도 너무 먼 목표의 순위를 못 매길 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">1단계 예측 오차, 긴 rollout 오차, 후보 행동의 순위, 실제 closed-loop 성공률을 따로 잽니다. 시작·목표 분포, 카메라 변화, action 시간 간격, H·K, 후보 수·반복 수와 계획 wall-clock도 함께 기록합니다.</p>
        <p className="leading-8">2026-09-30의 The Planning Limits of Latent World Models는 예측 정확도뿐 아니라 목표가 계획 범위 안에 있는지 따져 봅니다. 짧은 예측이 완벽하다고 합시다. 그래도 먼 목표를 향해 지금 우회해야 하는 행동의 가치를 못 드러낼 수 있습니다. 논문의 특정 환경 결과를 모든 world model의 불가능성으로 확대하지 않습니다.</p>
        <p className="leading-8">우리의 2단계 모델이 틀림없이 정확하다고 합시다. 목표가 20단계 뒤 장애물 너머에 있습니다. 이때 네 후보의 마지막 거리만으로 최선 경로를 고르지 못할 수 있습니다. 이 경계에서 더 긴 예측이 필요한지 판단합니다. 가까운 subgoal이나 별도 value, 제약 모델이 필요한지도 살핍니다.</p>
        <p className="leading-8">예측해 보세요. K를 H와 같게 두면 언제 다시 관측할까요? 이번 계획 전체를 실행한 뒤입니다. 도중 오차를 반영하는 빈도와 계획 비용의 교환을 7절의 H·K 구분으로 설명할 수 있어야 합니다.</p>
      </div>
<PaperReading id="paper-planning-limits" title={"The Planning Limits of Latent World Models · arXiv 2609.39235"} href={"https://arxiv.org/abs/2609.39235"} problem={"예측이 계획의 행동 순위에 유용한 거리와 실패 범위"} idea={"목표 거리·rollout 길이·표현과 피드백을 나눠 비교"} assumption={"해당 frozen backbone·predictor·목표 분포에 한정"} experiment={"Meta-World·BridgeData V2 기반의 저자 실험; 2026-09-30 공개 preprint"} boundary={"다른 제약·subgoal·value를 쓴 계획기까지 같은 수치 한계라고 단정하지 않는다."} />
      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">모델의 예측 능력과 계획·실행 성공의 조건을 따로 확인하면 추적이 끝납니다.</p>
    </section>
    <ContentBoundary article="world-model-latent-planning" />
    <ReviewPrompts questions={["예측상 목표에 도착한 계획을 실행해도 실제 위치가 달라지는 이유는 무엇일까요? (답: 4절)", "모든 이미지를 0으로 바꾸면 예측 loss가 작아도 왜 쓸모없는 모델일까요? (답: 9절)", "완벽한 2단계 예측이 있어도 20단계 뒤 목표의 최선 경로를 알 수 있을까요? (답: 10절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}

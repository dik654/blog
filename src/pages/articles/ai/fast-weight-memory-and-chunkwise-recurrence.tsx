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
import { codeRefs, fileTrees, projectMetas } from "./fast-weight-memory-and-chunkwise-recurrence/codeRefs";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 작은 행렬 하나에 기억을 쓰면 서로 섞일 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">두 쌍을 기억하겠습니다. 주소 k₁=(1,0)의 값은 (2,0), k₂=(0.6,0.8)의 값은 (0,3)입니다. 이 값들은 설명을 위한 숫자입니다 (가정). 네 숫자짜리 행렬에 둘을 넣으면 첫 주소를 읽을 때 원래 없던 1.8이 함께 나옵니다.</p>
        <p className="leading-8">이 글은 그 간섭을 확인하고 같은 주소의 값을 (5,0)으로 고칩니다. 수정 규칙을 이해한 뒤, 입력 조각을 하나씩 처리하는 계산을 여러 개씩 병렬로 바꾸는 방법과 기존 값을 지우는 양과 새로 쓰는 양을 따로 정하는 방법을 연결합니다.</p>
      </div>


      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">무엇을 기억하고 바꿀지 정했습니다. 먼저 상태의 입출력을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 현재 기억과 새 주소·값을 받아 기억을 고친다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">입력은 이전 상태 M과 현재 주소·저장할 값·질의 주소, 쓰기·망각 계수입니다. 출력은 갱신한 M과 질의 주소로 읽은 값입니다. 문맥을 원문 배열로 계속 쌓는 대신 정해진 크기의 M을 계속 고칩니다.</p>
        <p className="leading-8">고정된 것은 독립된 기억 하나의 상태 크기입니다. 새 입력 조각을 주소·값으로 바꾸는 일과 기억 갱신은 계속 계산해야 하며, 내용이 무한히 정확하게 저장된다는 뜻은 아닙니다. 여러 입력열의 상태도 서로 섞지 않아야 합니다.</p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">저장 크기와 기억 품질을 구분했습니다. 작은 행렬을 직접 만듭니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <span id="associative-memory" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">3 · 첫 주소를 읽으면 (2, 1.8)이 나온다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">저장할 값의 각 숫자와 주소의 각 숫자를 하나씩 곱하고 두 쌍의 결과를 더하면 M=[[2,0],[1.8,2.4]]입니다. 첫 열은 k₁로 읽는 결과이므로 Mk₁=(2,1.8)입니다. 두 번째 쌍의 주소가 첫 주소와 0.6만큼 겹쳐 0.6×3=1.8이 섞였습니다.</p>
        <p className="leading-8">k₂로 읽으면 (1.2,3)입니다. 두 주소가 서로 겹치는 방향이 없을 때에는 서로의 값이 섞이지 않지만 실제로는 제한된 차원에 많은 정보를 넣습니다. 작은 행렬의 절약과 간섭은 같은 설계에서 함께 생깁니다.</p>
      </div>
<NumericPath title="기억의 쓰기와 읽기" steps={[{"label": "두 쌍", "value": "k₁→(2,0), k₂→(0,3)", "detail": "주소 내적 0.6"}, {"label": "기억", "value": "[[2,0],[1.8,2.4]]", "detail": "값×주소 배치"}, {"label": "첫 주소 질의", "value": "(2,1.8)", "detail": "다른 값의 일부가 섞임"}, {"label": "수정 목표", "value": "(5,0)", "detail": "현재 읽기와 목표의 차이를 기록"}]} />
      <p className="leading-8">첫 쌍은 (2,0)과 (1,0)을 곱해 [[2,0],[0,0]]을 남깁니다. 둘째 쌍은 (0,3)과 (0.6,0.8)을 곱해 [[0,0],[1.8,2.4]]를 남깁니다. 같은 위치의 숫자를 더했으므로 저장 공간을 늘리지 않았고, 그 대신 두 기억의 영향이 같은 칸에 겹칩니다.</p><p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">섞인 값을 계산했습니다. 수정 요청이 행렬을 통과하는 길을 그립니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 현재 읽기와 목표의 차이만 다시 쓴다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">k₁의 새 목표가 (5,0)이면 현재 읽기 (2,1.8)을 빼 오차 (3,−1.8)을 얻습니다. 이 오차를 k₁ 방향에 더하면 첫 열만 바뀌어 M=[[5,0],[0,2.4]]가 됩니다.</p>
        <p className="leading-8">이후 k₁은 정확히 (5,0)을 읽습니다. 그러나 k₂는 (3,1.92)를 읽습니다. 첫 주소를 고친 영향이 내적 0.6만큼 두 번째 읽기에도 전해졌기 때문입니다. 선택적으로 쓴다는 말이 다른 기억을 모두 보존한다는 보장은 아닙니다.</p>
      </div>

      <p className="leading-8">두 번째 주소로 읽는 계산도 직접 확인할 수 있습니다. 수정 전에는 첫 행에서 2×0.6+0×0.8=1.2, 둘째 행에서 1.8×0.6+2.4×0.8=3을 얻습니다. 수정 후에는 첫 행이 5×0.6=3, 둘째 행이 2.4×0.8=1.92입니다. 첫 주소의 수정 요청에 정확히 답해도 두 번째 답은 달라졌습니다.</p><p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수정이 어디로 새는지 알았습니다. 왜 단순 덧셈만으로 부족한지 확인합니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <span id="problem" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">5 · 새 값을 그냥 더하면 옛 값이 남는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">기존 M에 새 값 (5,0)과 주소 (1,0)의 곱을 그대로 더하면 k₁의 읽기는 (7,1.8)이 됩니다. 수정하려던 (5,0)과 다릅니다. 현재 이미 기억한 값을 먼저 읽고 빼야 이 중복을 피할 수 있습니다.</p>
        <p className="leading-8">그 대가로 이번 오차가 이전 M에 의존합니다. 입력 조각마다 주소와 값을 곱한 표를 독립적으로 만들어 한 번에 합치던 방식과 달리, 순서가 생깁니다. 학습에서 여러 숫자를 한꺼번에 곱하는 장치를 활용하려면 이 의존성을 다시 묶어 표현해야 합니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정확한 쓰기와 병렬성의 충돌을 찾았습니다. 이제 상태와 계수의 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="memory-gate" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · Fast weight는 매 문맥에서 바뀌는 기억 행렬이다</h2>
      <div className="overflow-x-auto"><table className="min-w-[640px] w-full text-left text-sm"><thead><tr><th>이미 본 역할</th><th>이름과 뜻</th><th>이 글의 값·조건</th></tr></thead><tbody><tr><td className="min-w-[180px] p-3">찾아갈 방향·그때 꺼낼 내용</td><td className="min-w-[180px] p-3">Key k · value v</td><td className="min-w-[180px] p-3">(1,0) · (2,0)</td></tr><tr><td className="min-w-[180px] p-3">읽을 때 묻는 방향</td><td className="min-w-[180px] p-3">Query q</td><td className="min-w-[180px] p-3">이번에는 q=k₁</td></tr><tr><td className="min-w-[180px] p-3">두 숫자 묶음의 모든 짝을 곱한 표</td><td className="min-w-[180px] p-3">Outer product, 외적 vkᵀ</td><td className="min-w-[180px] p-3">(0,3)(0.6,0.8)ᵀ</td></tr><tr><td className="min-w-[180px] p-3">문맥 중 계속 고치는 기억</td><td className="min-w-[180px] p-3">Fast weight memory M</td><td className="min-w-[180px] p-3">2×2 행렬</td></tr><tr><td className="min-w-[180px] p-3">주소와 갱신 계수를 만드는 고정 학습값</td><td className="min-w-[180px] p-3">Fast weight programmer의 느린 parameter</td><td className="min-w-[180px] p-3">추론 중 M과 구분</td></tr><tr><td className="min-w-[180px] p-3">현재 읽기와 목표의 차이를 쓰기</td><td className="min-w-[180px] p-3">Delta rule, 차이 갱신</td><td className="min-w-[180px] p-3">(5,0)−(2,1.8)</td></tr><tr><td className="min-w-[180px] p-3">이번 수정 강도·이전 기억 보존량</td><td className="min-w-[180px] p-3">Gate β · decay α</td><td className="min-w-[180px] p-3">기본 β=1, α=1</td></tr><tr><td className="min-w-[180px] p-3">여러 입력을 묶어 계산하는 묶음</td><td className="min-w-[180px] p-3">Chunk · chunkwise recurrence</td><td className="min-w-[180px] p-3">의존성은 묶음 안과 사이에 남음</td></tr></tbody></table></div><div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">M처럼 forward 중 갱신되는 상태를 fast weight memory라고 부릅니다. 학습이 끝난 고정 parameter와 구별되는 이름입니다. 느린 parameter가 key·value와 계수를 만들고 빠른 상태의 갱신을 지시하는 구도를 fast weight programmer라고 합니다.</p>
        <p className="leading-8">현재 읽기와 목표의 차이를 쓰는 규칙이 delta rule입니다. 수정 강도 β는 해당 key 방향을 얼마나 고칠지, decay α는 그 전에 기존 기억을 얼마나 남길지 정합니다. 문맥별 상태를 갱신한다고 모든 모델 parameter를 추론 때 gradient로 학습하는 것은 아닙니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">어떤 숫자가 고정 parameter이고 어떤 것이 상태인지 구분했습니다. 갱신식과 병렬화를 유도합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="delta-rule" className="scroll-mt-20" />
      <span id="chunkwise-scan" className="scroll-mt-20" />
      <span id="prefix-scan" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 의존성을 작은 삼각 연립방정식으로 묶는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">단위 key에 β=1을 쓰면 목표값으로 대체됩니다. 먼저 α=0.1을 적용한다면 기존 읽기 (2,1.8)이 (0.2,0.18)로 줄고 그 상태에 대한 새 오차를 계산해야 합니다. decay 전의 읽기를 빼면 다른 식이 됩니다.</p>
        <p className="leading-8">병렬화 계산에서는 같은 두 쌍을 초기 기억 M₀=0부터 순서대로 쓴다고 둡니다. decay 없이 실제 correction을 u₁,u₂라고 합시다. u₁=β₁v₁이고 u₂=β₂v₂−β₂(k₂·k₁)u₁입니다. β=1인 위 사례는 u₁=(2,0), u₂=(−1.2,3)입니다. 따라서 u₂+0.6u₁=v₂라는 하삼각 연립식으로 한 chunk의 corrections를 구할 수 있습니다.</p>
        <p className="leading-8">대각선 아래만 채우고 나머지는 0인 행렬 L의 항을 Lᵢⱼ=βᵢ(kᵢ·kⱼ)로 놓으면 (I+L)U=diag(β)V입니다. 부호는 더하기입니다. 역행렬을 명시적으로 만들 필요 없이 앞서 구한 행부터 대입해 푸는 삼각 해법이나 같은 의존성을 행렬곱으로 묶는 변환으로 풀고 chunk 사이에서 상태를 넘깁니다. 초기 기억이 0이 아니면 그 읽기 항도 반영합니다. gate가 있으면 누적 decay와 축 배치까지 포함해야 합니다.</p>
        <p className="leading-8">4096 token을 64개씩 묶으면 chunk는 64개입니다 (가정). 각 chunk의 끝상태를 64번 계산하며, 다음 chunk로 넘기는 내부 경계는 63개입니다. chunk 내부 연산과 동기화도 남습니다. 전체 길이는 n으로 둡니다. 묶음 크기는 C=64이고 기억 폭은 d=128입니다. 이때 단순 비용 항 nCd와 nd²의 비는 C/d=0.5입니다 (가정). 이는 두 항의 규모 비교이며 실제 FLOPs가 정확히 50% 증가하거나 64배 빨라진다는 실측 결과가 아닙니다.</p>
      </div>
<ExplainedFormula question={"기존 값 위에 더하지 않고 목표값으로 바꾸려면?"} idea={"현재 key로 읽힌 값과 목표값의 차이만 같은 key 방향으로 씁니다. 단위 key에 다시 질의하면 이 차이가 그대로 더해집니다."} formula={"M^+=M+\\beta(v-Mk)k^\\top"} annotatedFormula={"M^+=M+\\beta\\underbrace{(v-Mk)}_{\\text{목표와 현재 읽기의 차이}}\\underbrace{k^\\top}_{\\text{고칠 key 방향}}"} operations={[{"expression": "Mk", "annotation": ["지금 기억이 반환하는 값을 읽습니다."]}, {"expression": "(v-Mk)k^\\top", "annotation": ["값의 오차를 key 방향의 외적으로 기록합니다."]}]} terms={[{"symbol": "M", "name": "기억 행렬", "description": "이 글은 값×key 배치의 2×2 행렬입니다."}, {"symbol": "k,v", "name": "주소와 목표값", "description": "k=(1,0), v=(5,0)인 사례를 유지합니다."}, {"symbol": "\\beta", "name": "수정 강도", "description": "0이면 유지, 단위 key와 β=1이면 그 key의 읽기를 대체합니다."}]} assumptions={["k의 norm이 1인 사례입니다.", "다른 key와의 내적이 0이 아니면 그 읽기에도 수정이 새어듭니다."]} interpretation={"Mk=(2,1.8), 오차=(3,−1.8)이므로 새 M=[[5,0],[0,2.4]]입니다. 같은 key는 (5,0)을, 다른 key (0.6,0.8)는 (3,1.92)를 읽습니다."} />
<AlgorithmBlock title={"현재 읽기를 지운 양만큼 새 값을 씁니다 (의사코드)"} input={["M=[[2,0],[1.8,2.4]], k=[1,0], v=[5,0], α=1", "erase b=[1,1], write w=[1,1]; M은 값×key 배치입니다."]} steps={[{"code": "M_decay = α * M", "note": "먼저 기존 상태에 감쇠를 적용합니다. 이번에는 α=1입니다."}, {"code": "erase_read = M_decay @ (b * k)", "note": "지울 방향으로 읽으면 [2,1.8]입니다."}, {"code": "correction = w * v − erase_read", "note": "목표 [5,0]에서 기존 읽기를 빼 [3,−1.8]을 만듭니다."}, {"code": "M_next = M_decay + outer(correction, k)", "note": "첫 key 방향만 갱신합니다."}, {"code": "return M_next, M_next @ k", "note": "행렬 갱신과 읽기 결과를 함께 확인합니다."}]} output={"M_next=[[5,0],[0,2.4]], 읽기=[5,0]. b=[.25,1], w=[.5,1]이면 읽기=[4,1.35]입니다."} />
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">갱신의 부호와 상태 전달 위치를 정했습니다. 공식 kernel에 같은 숫자를 넣습니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="paper-schlag" className="scroll-mt-20" />
      <span id="paper-gated-deltanet" className="scroll-mt-20" />
      <span id="paper-deltanet-parallel" className="scroll-mt-20" />
      <span id="paper-blelloch" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 kernel에서 기존 읽기를 빼고 새 목표를 쓴다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">공식 GDN2 원문의 218–243행에서 b_h가 상태이고 b_b_tile은 key축 erase gate, b_w_tile은 value축 write gate입니다. 먼저 decay를 곱하고 기존 값을 읽은 뒤, 조절한 새 값에서 그 읽기를 뺍니다. 마지막 외적을 상태에 더합니다.</p>
        <p className="leading-8">우리의 M을 쓰는 값×key 배치는 실제 원문의 TRANSPOSE_STATE=True 분기에 대응합니다. 여기서는 입력 key를 kernel 안에서 다시 정규화하지 않고 query의 scale=1, decay=1인 산술 조건을 고정합니다 (가정).</p><p className="leading-8">α=1, erase와 write를 모두 1로 두면 erase_d=(2,1.8), 새 값=(5,0), correction=(3,−1.8)입니다. 결과 M과 읽기는 7절 계산과 같습니다. 원문에는 반대 전치 배치도 있으므로 축을 먼저 맞춥니다.</p><p className="leading-8">같은 원문에서 erase=0, write=1만 바꾸면 erase_d=0이고 correction=(5,0)입니다 (가정). 이를 기존 첫 열 (2,1.8)에 더하면 (7,1.8)이 됩니다. 현재 값을 지우는 항이 없으면 교체가 아니라 덧셈이 된다는 것을 실제 뺄셈 행에서 확인할 수 있습니다.</p>
      </div>
<CodeViewButton label="공식 소스 · decay와 읽기 218–235행" onClick={() => sidebar.open("delta-read", codeRefs["delta-read"])} /><CodeViewButton label="공식 소스 · 쓰기와 출력 233–243행" onClick={() => sidebar.open("delta-write", codeRefs["delta-write"])} /><SourceApplication source={"GDN2 공식 kernel"} excerpt={"b_v_new = b_w_tile * b_v - erase_d"} application={"erase=write=1이면 (5,0)−(2,1.8)=(3,−1.8)입니다."} /><CitationBlock source={"GDN2 공식 kernel"} citeKey={2} href={"https://github.com/NVlabs/GatedDeltaNet-2/blob/a5552fe3c67e0ebc7ef1220df68ae8896ec62d56/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-delta-reading" title={"Parallelizing Linear Transformers with the Delta Rule · 2024"} href={"https://arxiv.org/abs/2406.06484"} problem={"상태 의존적인 delta update의 병렬화"} idea={"순차 correction을 chunk별 삼각 계산과 행렬곱으로 바꿈"} assumption={"state와 key/value의 축 및 gate를 동일하게 유지"} experiment={"원 논문의 모델 크기·token budget·GPU 조건의 저자 실험"} boundary={"단순 prefix sum은 교환 가능한 합의 사례다. delta update를 같은 스캔 코드로 바꿀 수 있다는 뜻은 아니다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 수치가 실제 뺄셈과 외적을 통과했습니다. 두 gate를 다르게 두면 무엇이 달라지는지 봅니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · GDN2는 지울 성분과 쓸 성분을 다른 축에서 조절한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">같은 M과 k₁, 목표 (5,0)에 α=1, erase b=(0.25,1), write w=(0.5,1)을 넣습니다. 지울 읽기는 M(b⊙k₁)=(0.5,0.45), 넣을 값은 w⊙v=(2.5,0)입니다. correction=(2,−0.45)을 쓰면 k₁의 결과는 (4,1.35)입니다.</p>
        <p className="leading-8">기존 scalar β=0.5는 지우기와 쓰기 둘 다 절반으로 묶어 결과 (3.5,0.9)를 만듭니다. GDN2는 두 일을 서로 다른 channel에서 정할 수 있습니다. 더 자유로운 표현이 생긴 것이며 모든 과제에서 더 좋거나 다른 key의 간섭이 없어졌다는 보장은 아닙니다.</p>
        <p className="leading-8">원 논문의 S는 key×value 배치입니다. 이 글의 M=Sᵀ로 전치하면 원문의 갱신식은 M′=M D(I−e kᵀ)+z kᵀ가 됩니다. e=b⊙k, z=w⊙v이며 D는 key축 decay입니다. 행렬곱의 순서를 바꾸면 다른 연산이 됩니다.</p>
      </div>
<SourceApplication source={"GDN2 식 (29) · 원문의 key×value 배치"} excerpt={"S=(I−keᵀ)Diag(α)S_prev+kzᵀ"} application={"M=Sᵀ로 전치해 우리 사례를 대입하면 첫 key의 읽기는 (4,1.35)입니다."} /><CitationBlock source={"GDN2 식 (29) · 원문의 key×value 배치"} citeKey={2} href={"https://arxiv.org/html/2605.22791v1"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-gdn2" title={"Gated DeltaNet-2 · arXiv 2605.22791v1"} href={"https://arxiv.org/html/2605.22791v1"} problem={"하나의 scalar gate가 지우기와 쓰기를 함께 제한"} idea={"key축 erase와 value축 write 분리"} assumption={"상태 배치와 gate 축, fp32 decay·누적 조건"} experiment={"1.3B, FineWeb-Edu 100B token, 학습 길이 4K, recurrent·hybrid 비교의 저자 실험"} boundary={"표의 순위는 그 조건의 결과다. 고정 크기 상태가 임의 길이의 정보를 무손실 저장하는 보장은 아니다."} />
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">독립 gate의 숫자 효과와 축을 확인했습니다. 마지막으로 기억의 한계를 점검합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <span id="boundary" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">10 · 같은 key의 수정과 전체 기억 보존은 다른 조건이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">M의 크기는 고정되어도 많은 key가 겹치면 회상 정보가 손실됩니다. β=1에서 정확한 대체라는 설명도 단위 key로 쓰고 같은 key로 다시 읽는 조건입니다. 다른 query, 낮은 정밀도, decay, 비단위 norm에서는 조건을 다시 계산해야 합니다.</p>
        <p className="leading-8">Prefix scan은 결합법칙이 있는 연산을 트리로 묶는 일반 기법입니다. 64개 합의 up/down sweep이 각 6단계라는 사실만으로 위 delta kernel의 실행시간을 예측할 수 없습니다. state update와 triangular solve의 실제 GPU 비용을 재야 합니다.</p>
        <p className="leading-8"><Link to="/cs/ai/linear-attention-and-state-space-models">고정 크기 상태의 표현 한계</Link>와 <Link to="/cs/ai/agent-memory-lifecycle">에이전트의 외부 기억</Link>은 다른 층입니다. MLA도 token당 KV를 압축하지만 context 전체 상태를 고정 크기로 만드는 것은 아닙니다.</p>
        <p className="leading-8">예측해 보세요. erase=0이고 write=1이면 k₁의 읽기는 어떻게 될까요? 같은 α=1 사례에서는 옛 (2,1.8)에 (5,0)이 더해져 (7,1.8)입니다. 8절의 실제 뺄셈에서 확인할 수 있습니다.</p>
      </div>

      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">저장 크기, 수정 규칙, 병렬 실행과 회상 품질을 각각 검증하면 추적이 끝납니다.</p>
    </section>
    <ContentBoundary article="fast-weight-memory-and-chunkwise-recurrence" />
    <ReviewPrompts questions={["첫 key의 값을 정확히 고쳐도 두 번째 key의 읽기가 바뀌는 이유는 무엇일까요? (답: 4절)", "두 token의 삼각 연립식에 왜 I−L이 아닌 I+L이 나올까요? (답: 7절)", "erase=0·write=1이면 같은 key의 읽기는 어떻게 될까요? (답: 8절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}

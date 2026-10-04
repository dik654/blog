import TermBreakdown from "@/components/articles/term-breakdown";
import BasisTraceViz from "./flash-attention-io-aware-kernel/viz/BasisTraceViz";
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
import { codeRefs, fileTrees, projectMetas } from "./flash-attention-io-aware-kernel/codeRefs";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 같은 답을 더 적은 왕복으로 구한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">(가정) 문장 속 한 위치가 앞의 네 위치를 얼마나 참고할지 정한다고 해 봅시다. 이미 계산한 점수는 [1, 3, 2, 5]이고 가져올 값은 [2, 4, 6, 8]입니다. 이 글은 가중평균 7.376113을 구하는 과정을 끝까지 따라갑니다.</p>
        <p className="leading-8">핵심은 점수 전체를 메모리에 적어 두지 않아도, 지금까지의 기준값과 두 합만 고쳐 가면 답을 구할 수 있다는 것입니다. 이후 같은 계산이 GPU에서 어디를 기다리는지 살펴봅니다.</p>
      </div>


      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">출력 숫자 하나를 고정했습니다. 먼저 입력과 출력의 계약을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 점수와 값을 받아 가중평균을 돌려준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">입력은 네 위치의 점수와 각 위치에서 가져올 값입니다. 점수를 양수인 가중치로 바꾼 뒤, 값에 곱한 합을 가중치의 합으로 나눕니다. 출력은 여러 값이 섞인 숫자 하나입니다. 실제 모델은 같은 일을 여러 위치와 값의 여러 성분에 반복합니다.</p>
        <p className="leading-8">
            이번 사례에서는 네 위치를 모두 참고하고 가져온 값을 임의로 버리지 않습니다. 구현을 바꿔도 같은 가중평균을 계산해야 합니다. 아직 볼 수 없는 미래 위치를 허용하거나 일부
            연결을 생략하면 입력의 의미부터 달라집니다. 숫자를 저장하며 생기는 반올림 오차는 이 수학적 계약과 따로 검사합니다.
          </p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 출력이라는 조건을 정했습니다. 이제 네 항을 직접 더합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 네 항을 한 번에 계산하면 7.376113이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">가장 큰 점수 5를 빼고 지수를 취하면 약 [0.018316, 0.135335, 0.049787, 1]입니다. 합은 1.203438이고 각 항에 [2, 4, 6, 8]을 곱한 합은 8.876695입니다. 둘을 나누면 7.376113입니다.</p>
        <p className="leading-8">모든 지수에 같은 e⁻⁵를 곱했으므로 분자와 분모의 비율은 유지됩니다. 큰 지수로 넘치지 않게 기준을 옮기는 이유이며 뒤에서 조각을 합칠 때도 같은 원리를 씁니다.</p>
      </div>
<NumericPath title="한 행의 값이 출력이 되는 길" steps={[{"label": "점수", "value": "1, 3, 2, 5", "detail": "크기 조정이 끝난 점수 네 개"}, {"label": "공통 기준", "value": "최대 5", "detail": "지수에서 같은 값을 뺌"}, {"label": "두 합", "value": "8.876695 / 1.203438", "detail": "값의 가중합 / 지수합"}, {"label": "출력", "value": "7.376113", "detail": "반올림한 가중평균"}]} />
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">전체 계산의 답을 얻었습니다. 조각마다 무엇을 보관할지 그려봅니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <span id="tiling" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">4 · 조각을 버리고 기준값과 두 합만 남긴다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 조각 [1, 3]을 읽으면 기준은 3, 지수합은 1.135335, 값의 가중합은 4.270671입니다. 다음 조각 [2, 5]에서는 최대가 5로 바뀝니다. 옛 두 합을 e⁻²만큼 줄이고 새 조각의 합을 더하면 됩니다.</p>
        <p className="leading-8">전체 구조는 큰 저장 공간, 계산기 가까이의 작은 작업 공간, 다음 조각까지 남기는 상태로 나뉩니다. 작은 공간에서 점수 두 개를 처리하고 버립니다. 기준과 두 합만 남긴 채 다음 값을 가져오면, 모든 점수를 큰 저장 공간에 써 두는 왕복을 피할 수 있습니다.</p>
      </div>
<NumericPath title="두 조각이 하나의 기준을 공유하는 과정" steps={[{"label": "첫 조각", "value": "기준 3 · 합 1.135335", "detail": "가중합 4.270671"}, {"label": "기준 이동", "value": "이전 합 × e⁻²", "detail": "분자와 분모에 같은 배율"}, {"label": "둘째 조각", "value": "e⁻³와 1 추가", "detail": "값 6과 8도 함께 반영"}, {"label": "최종 상태", "value": "기준 5 · 출력 7.376113", "detail": "점수 전체를 보관하지 않음"}]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">각 조각에서 평균을 먼저 내고 두 평균을 반씩 섞으면 어떨까요? 첫 평균은 약 3.761594, 둘째는 7.905148이므로 약 5.833371이 됩니다. 정답 7.376113과 다릅니다. 두 조각이 전체에서 차지하는 가중치가 같지 않기 때문입니다.</p><p className="leading-8">기준값도 버릴 수 없습니다. 첫 합은 점수에서 3을 뺀 결과이고 둘째 합은 5를 뺀 결과입니다. 3에서 5로 기준을 옮기는 e⁻²를 곱해야 두 합의 크기를 직접 비교할 수 있습니다. 따라서 남길 것은 평균 하나가 아니라 기준값과 정규화 전의 두 합입니다.</p></div>
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">조각을 합칠 자리를 찾았습니다. 왜 이 구조가 필요한지 바이트로 확인합니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <span id="problem" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">5 · 계산보다 중간 행렬의 왕복이 커질 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">(가정) 크기 효과를 따로 봅니다. 위치 4,096개에 성분 64개를 두고 숫자 하나를 2바이트에 저장합니다. 위치를 가리거나 무작위로 연결을 끊지 않습니다. 점수를 만들고 값을 가져오는 입력 배열 세 개는 각각 4,096×64×2=512KiB, 합계 1.5MiB입니다.</p>
        <p className="leading-8">위치마다 4,096개 위치와 비교하면 점수가 4,096²개 생깁니다. 점수 배열과 정규화한 가중치 배열은 각각 32MiB입니다. 각각 한 번 쓰고 한 번 읽으면 32×2×2=128MiB가 이동합니다. 필요한 두 조각을 계산한 뒤 바로 소비하면 이 전체 배열의 저장을 피할 수 있습니다.</p>
        <p className="leading-8">128MiB는 입력 세 배열 합의 약 85.33배입니다. 출력 배열까지 포함한 네 배열 합 2MiB를 분모로 삼아야 64배가 됩니다. 독립 계산 묶음 32개·입력 8건이면 32GiB이고 가정한 2TB/s로 나눈 17.18ms는 이 왕복만의 처리량 하한입니다. 실제 실행시간이나 모든 attention의 병목을 단정하는 숫자가 아닙니다.</p>
        <p className="leading-8">이 숫자는 점수와 가중치를 별도 배열에 남기는 설명용 구현의 장부입니다. 실제 라이브러리는 이미 여러 계산을 합쳐 중간 저장을 피할 수 있습니다. 함수 이름만 보고 모든 호출에 128MiB의 왕복을 붙이지 않습니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">왕복을 줄일 동기가 생겼습니다. 각 저장물과 알고리즘에 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="io-aware" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · FlashAttention은 attention 행렬의 저장을 피하는 구현이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">이제 먼저 해 본 계산에 이름을 붙입니다. 관심 위치가 다른 위치의 값을 가중평균하는 연산이 attention입니다. 역할과 이름을 한 줄씩 연결하면 코드의 약자가 무엇을 저장하는지 읽을 수 있습니다.</p>
      </div>
      <TermBreakdown title="이미 계산한 역할에 이름을 붙입니다" items={[
        {term:"관심 위치와 비교 대상 → query Q · key K",description:"두 배열을 곱해 위치 사이 점수를 만듭니다. 점수 크기를 √d로 나누는 조정까지 끝난 사례가 [1,3,2,5]입니다.",example:"각 행의 성분 개수가 d입니다. 허용하지 않는 위치는 mask로 가립니다."},
        {term:"섞을 값 → value V",description:"가중치에 곱할 값입니다. 여기서는 각 위치의 한 성분 [2,4,6,8]만 추적합니다."},
        {term:"양수 가중치를 합 1로 바꾸기 → softmax",description:"점수 S에 지수를 취해 합으로 나눈 확률 P를 만듭니다. 최종 출력 O는 P와 V의 곱입니다."},
        {term:"중간 배열 남기기 → materialization",description:"점수 S와 확률 P를 큰 저장 공간인 HBM에 써 두고 다음 계산에서 읽는 방식입니다."},
        {term:"한 번에 처리할 조각 → tile",description:"가까운 작업 공간에 들어오는 만큼 읽고 계산합니다. 둘씩 나눈 네 점수 사례가 이 역할을 보여 줍니다."},
        {term:"기준과 합을 이어 갱신하기 → online softmax",description:"기준 m, 지수합 ℓ, 가중합 u를 남깁니다. 마지막에 O=u/ℓ를 계산합니다."},
        {term:"이동 비용까지 세기 → IO-aware 설계",description:"계산 횟수와 함께 저장 공간 사이를 오가는 양을 셉니다. 128MiB 왕복을 없앨 수 있는지가 한 질문입니다."},
        {term:"칩 내부의 작은 저장 공간 → SRAM",description:"논문의 모형은 가까운 저장 공간을 묶어 셉니다. 실제 shared memory와 register는 쓰는 방법과 한도가 다른 자원입니다.",boundary:"SM이라는 실행 단위 한 개의 용량을 GPU 전체의 대역폭과 직접 짝지어 비교하지 않습니다."},
        {term:"숫자의 저장 형식 → dtype",description:"앞의 2바이트 가정은 FP16 같은 형식에 해당합니다. 합을 쌓는 형식은 입력 형식과 다를 수 있습니다."}
      ]}/>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">FlashAttention의 exact는 sparse·저차원 근사로 attention 연결을 줄이지 않는다는 뜻입니다. 덧셈 순서와 지수 구현, dtype가 달라 수치 오차는 생길 수 있습니다.</p>
        <p className="leading-8">원 논문 정리 2는 위치 수 N, 성분 수 d, 가까운 저장 용량 M을 원소 개수로 두고 d≤M≤Nd에서 접근량을 Θ(N²d²/M)로 분석합니다. 작은 공간에 조각을 놓고 반복해서 읽는 횟수를 세는 모형입니다. 이 점근식에 숫자를 넣은 비율은 실제 바이트나 실측 가속비가 아닙니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">용어가 같은 네 점수 계산을 가리키는지 확인했습니다. 이제 갱신식을 유도합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="online-softmax" className="scroll-mt-20" />
      <span id="backward" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 옛 합의 기준을 옮기면 중간 행렬이 필요 없다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">점수 s에 대해 e^(s−m)=e^(s−m_old)×e^(m_old−m)입니다. 따라서 이전 조각의 개별 점수를 다시 읽을 필요 없이 이미 쌓은 합 전체에 같은 배율을 곱할 수 있습니다. 값의 가중합에도 동일하게 적용됩니다.</p>
        <p className="leading-8">분모만 바꾸면 충분하지 않습니다. 첫 가중합 4.270671을 그대로 둔 채 둘째의 가중합만 더하면 약 12.569393입니다. 올바른 분모 1.203438로 나누어도 출력은 10.444571로 틀립니다. 옛 분자에도 e⁻²를 곱해야 출력 7.376113을 되찾습니다.</p>
      </div>
<ExplainedFormula question={"점수 네 개를 둘씩 읽어도 어떻게 같은 가중평균이 나올까?"} idea={"옛 합과 새 항을 같은 기준점으로 바꾸면 덧셈이 가능해집니다. 분자와 분모에 같은 배율을 적용하면 비율도 보존됩니다."} formula={"m=\\max(m_o,\\max S_j),\\ a=e^{m_o-m},\\ \\ell=a\\ell_o+\\sum e^{S_j-m},\\ u=au_o+\\sum e^{S_j-m}V_j,\\ O=u/\\ell"} annotatedFormula={"\\begin{aligned}m&=\\max(m_o,\\max S_j),\\quad a=e^{m_o-m}\\\\\\ell&=\\underbrace{a\\ell_o}_{\\text{옛 합 보정}}+\\sum e^{S_j-m}\\\\u&=\\underbrace{au_o}_{\\text{옛 가중합 보정}}+\\sum e^{S_j-m}V_j\\\\O&=u/\\ell\\end{aligned}"} operations={[{"expression": "e^{m_o-m}", "annotation": ["옛 기준에서 새 기준으로 지수합과 분자를 함께 옮깁니다."]}, {"expression": "\\sum e^{S_j-m}V_j", "annotation": ["같은 기준으로 계산한 현재 조각의 가중값을 더합니다."]}]} terms={[{"symbol": "m_o,m", "name": "이전·현재 기준", "description": "지수 overflow를 막기 위한 행의 최대 점수입니다."}, {"symbol": "\\ell,u", "name": "분모·분자", "description": "지수합과 값의 가중합을 정규화하지 않은 채 보관합니다."}, {"symbol": "S_j,V_j", "name": "현재 tile", "description": "이미 scale·mask를 적용한 점수와 그 위치의 값입니다."}]} assumptions={["여기서는 dropout이 없고 적어도 하나의 유효 key가 있는 행을 다룹니다.", "실수 산술의 동치이며 실제 부동소수점 결과의 bit 단위 동일성은 보장하지 않습니다."]} interpretation={"[1,3] 뒤 m=3, ℓ=1.135335, u=4.270671입니다. [2,5]를 읽으면 m=5, ℓ=1.203438, u=8.876695이 되어 O≈7.376113입니다."} />
<AlgorithmBlock title={"두 조각의 분자와 분모를 같은 기준으로 합칩니다 (의사코드)"} input={["점수 S=[1,3,2,5], 값 V=[2,4,6,8], tile 크기 2", "점수에는 scale과 mask를 이미 적용했다고 가정합니다."]} steps={[{"code": "m = −∞; l = 0; u = 0", "note": "최댓값, 지수 합, 가중합을 보관합니다."}, {"code": "for (scores, values) in paired_tiles(S, V, 2):", "note": "점수와 값의 같은 위치를 둘씩 읽습니다."}, {"code": "  new_m = max(m, max(scores)); a = 0 if l == 0 else exp(m − new_m)", "note": "첫 조각에서는 옛 합이 없으므로 0을 씁니다."}, {"code": "  p = exp(scores − new_m)", "note": "새 조각을 새 기준점에 맞춥니다."}, {"code": "  l = a * l + sum(p); u = a * u + sum(p * values); m = new_m", "note": "옛 합도 같은 배율로 바꾼 뒤 새 항을 더합니다."}, {"code": "return u / l", "note": "분자와 분모의 공통 배율이 사라집니다."}]} output={"u≈8.876695, l≈1.203438, O≈7.376113; 실제 커널의 병렬 실행 순서는 별도입니다."} />
      <BasisTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">학습에서는 출력에서 입력으로 변화량을 되돌리는 역전파가 이어집니다. 필요한 점수와 확률을 Q·K에서 다시 만들면 N×N 배열 전체를 보관하지 않아도 됩니다. 이 선택을 재계산이라고 부릅니다. N=4096이면 FP16 확률 배열은 32MiB지만 행마다 FP32 통계 한 개는 16KiB입니다.</p><p className="leading-8">16KiB만으로 학습을 끝낸다는 뜻은 아닙니다. 입력과 출력, 필요한 행 통계를 남겨야 합니다. 무작위로 연결을 끊는 dropout을 적용했다면 같은 선택을 재현할 난수 상태도 필요합니다. 저장량을 줄인 대신 추가한 계산이 시간을 얼마나 바꾸는지는 별도 측정입니다.</p></div>
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">식에서 보관할 상태가 정해졌습니다. 공식 코드의 실제 변수와 대조합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="paper-online-softmax" className="scroll-mt-20" />
      <span id="paper-flashattention" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 코드의 row_scale에 e⁻²를 넣는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">공식 소스 e9515d5의 Softmax.online_softmax는 row_max_prev와 row_max_cur의 차이에 scale_log2를 곱한 뒤 exp2를 호출합니다. 이미 scale한 네 점수 사례에서는 log₂e를 곱하므로 2^((3−5)log₂e)=e⁻²입니다.</p>
        <p className="leading-8">이어 옛 부분합에 이 배율을 곱해 현재 조각의 합에 더합니다. 여기서 코드의 row_sum 하나를 곧바로 행 전체의 ℓ로 읽으면 안 됩니다.</p>
        <p className="leading-8">사이드바는 고정한 commit의 파일 원문 전체입니다. 이 일반 함수에서는 한 행을 네 실행 스레드가 나누어 처리합니다. 스레드 하나의 몫을 lane이라고 부릅니다. online_softmax 안의 최대값은 네 lane 사이에서 합치지만 합계는 아직 각 lane의 부분합입니다. 다음 절의 FA4 특수 경로는 이 배치를 그대로 사용하지 않습니다.</p>
      </div>
<CodeViewButton label="공식 소스 · online_softmax 213–251행" onClick={() => sidebar.open("softmax", codeRefs.softmax)} /><SourceApplication source={"공식 코드의 갱신식"} excerpt={"row_sum[r] * row_scale[r]"} application={"이 식은 lane별 부분합에 적용됩니다. 네 부분합을 마지막에 더하면 1.135335×e⁻²+e⁻³+1≈1.203438입니다."} /><CitationBlock source={"공식 코드의 갱신식"} citeKey={2} href={"https://github.com/Dao-AILab/flash-attention/blob/e9515d5dee6ade134a33d6020d38d01ef0596996/flash_attn/cute/softmax.py"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">(가정) 산술을 확인하려고 각 조각의 첫 항을 lane 0, 둘째 항을 lane 1에 두고 나머지 두 lane의 합은 0으로 둡니다. 첫 부분합은 [e⁻²,1,0,0]입니다. 둘째까지 처리하면 [e⁻⁴+e⁻³,e⁻²+1,0,0], 약 [0.068103,1.135335,0,0]이 됩니다. 이는 부분합의 논리적 배정이며 실제로 지원되는 작은 GPU 배열 배치를 실행한 결과는 아닙니다.</p>
        <p className="leading-8">finalize의 width=4 합산이 이 네 값을 합쳐 1.203438을 만듭니다. 추가 가중치와 별도 배율을 쓰지 않는 이번 조건에서 반환값은 그 역수입니다. 이후 row_sum 저장 칸은 로그 지수합으로 덮어씁니다. 같은 변수도 함수 진입 전의 부분합과 종료 뒤의 통계가 다릅니다.</p>
        <p className="leading-8">
            분자 보정은 rescale_O가 맡습니다. 이 함수에 e⁻²를 넘기면 첫 가중합 4.270671이 약 0.577972로 줄어듭니다. 새 값의 가중합 6e⁻³+8을 더하면
            8.876695입니다. 값을 곱하고 더하는 행렬 연산은 이 보조 함수 바깥에서 수행하므로 softmax.py만으로 전체 attention 커널이 끝났다고 읽지 않습니다.
          </p>
      </div>
      <div className="flex flex-wrap gap-3"><CodeViewButton label="부분합을 합치는 finalize" onClick={() => sidebar.open("finalize",codeRefs.finalize)}/><CodeViewButton label="분자에도 배율을 곱하는 rescale_O" onClick={() => sidebar.open("rescale",codeRefs.rescale)}/></div>
<PaperReading id="paper-flashattention-reading" title={"FlashAttention · 2022"} href={"https://arxiv.org/html/2205.14135v2"} problem={"N×N 점수와 확률 중간값을 HBM에 쓰고 읽는 비용"} idea={"tile과 online softmax, backward 재계산"} assumption={"온칩 저장량과 dtype에 맞는 tile이 필요"} experiment={"원 논문의 모델·GPU 구성에서 저자 측정"} boundary={"FLOPs가 같아도 시간은 달라지며 모든 shape에서 같은 이득은 아니다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">실물 코드와 3→5 계산이 맞았습니다. Blackwell에서 새로 남는 병목을 비교합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · FA4는 지수 계산과 온칩 이동도 함께 겹친다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">같은 네 점수에서 둘째 조각을 반드시 기준 5로 옮길 필요는 없습니다. 기준 3을 유지하면 ℓ=1.135335+e⁻¹+e²≈8.892271이고 u≈65.590396입니다. 비율은 여전히 7.376113입니다. 다만 큰 지수를 계속 허용하면 overflow가 생기므로 기준 갱신 조건과 dtype의 범위를 함께 지켜야 합니다.</p>
        <p className="leading-8">고정 원문의 SoftmaxSm100.update_row_max_from_local은 실제 조건을 보여 줍니다. 점수를 이미 조정한 이 사례에서는 (3−5)log₂e≈−2.885390을 계산합니다. 임계값을 가정상 3으로 두면 −2.885390≥−3이므로 기준 3과 배율 1을 유지합니다. 임계값 2에서는 조건이 거짓이어서 기준 5와 배율 e⁻²를 반환합니다.</p>
        <p className="leading-8">이 임계값은 2의 지수 단위입니다. 자연지수 점수의 차이 2와 곧바로 비교하지 않습니다. 기본값 0에서는 양의 임계값 검사 자체를 끕니다. 양의 임계값과 차이가 정확히 같으면 코드의 ≥ 때문에 유지 분기로 갑니다. 논문의 식 (6)만 볼 때 빠지기 쉬운 단위와 경계입니다.</p>
        <p className="leading-8">이 분기는 원문 함수 몸체를 그대로 추출해 타입 표기와 컴파일 장식만 제거하고 실행했습니다. 컴파일 시 조건은 보통의 참·거짓 값으로, 지수 함수는 Python의 2의 거듭제곱으로 대신했습니다. 기준 3·5의 분기는 확인했지만 GPU의 근사 지수, 병렬 실행이나 전체 커널 속도를 재현한 검사는 아닙니다.</p>
        <p className="leading-8">FA4는 이런 조건부 기준 갱신과 지수 계산, 행렬곱, 가까운 저장 공간의 이동을 함께 설계합니다. 각 역할의 이름은 아래에서 따로 연결합니다. <Link to="/cs/ai/sionic-glm-b300#tmem-official-source">tcgen05·TMEM 실제 명령</Link>과 <Link to="/cs/gpu/warp-specialization-and-async-pipelines">Hopper의 TMA·WGMMA</Link>는 각 정본에서 이어집니다.</p>
        <p className="leading-8">행렬 연산 장치만 빨라졌다고 전체 attention이 같은 배율로 빨라지지 않습니다. 가정상 10시간 중 행렬곱 5시간을 절반으로 줄여도 총 7.5시간, 약 1.33배입니다. FA4의 질문은 나머지 지수·이동·동기화가 실행 경로에서 얼마나 남는가입니다.</p>
      </div>
<CodeViewButton label="기준 3을 유지할지 고르는 실제 분기" onClick={() => sidebar.open("conditional",codeRefs.conditional)}/>
      <TermBreakdown title="FA4가 함께 배치하는 작업" items={[
        {term:"행렬곱 누적 → MMA",description:"점수와 값의 가중합을 계산합니다. 이 장치만 빨라져도 지수 계산과 데이터 이동이 남습니다."},
        {term:"곱한 뒤 더하기 → FMA",description:"지수의 일부를 다항식으로 근사하는 데 사용합니다. 별도 지수 장치와 일을 나누지만 레지스터와 명령 비용도 생깁니다."},
        {term:"행렬 누적값의 전용 저장 공간 → TMEM",description:"Blackwell에서 중간 점수와 출력의 배치를 바꾸어 서로 다른 작업의 실행을 겹칠 여지를 만듭니다."},
        {term:"두 실행 블록의 협력 → 2-CTA MMA",description:"두 블록이 행렬곱을 나누어 맡습니다. FA4 역전파의 조합에서는 가까운 메모리 이동과 원자적 누적 부담을 줄입니다.",boundary:"블록 두 개라는 사실만으로 모든 저장량과 시간이 절반이 되지는 않습니다."}
      ]}/>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">같은 기준에서 분자와 분모에 곱해진 공통 배율은 나눗셈에서 사라집니다. 하지만 이미 overflow로 잃은 값이나 항마다 다른 근사 오차까지 마지막 나눗셈이 복구해 주지는 않습니다. 기준을 유지하는 수학적 동치와 실제 형식의 안전성은 각각 검사해야 합니다.</p></div>
<SourceApplication source={"FA4 식 (6) · 기준을 유지하는 분기"} excerpt={"O_{j-1}+e^{S_j−m_{j-1}}V_j"} application={"기준 3을 유지해도 분자·분모를 같은 기준으로 누적하면 65.590396/8.892271≈7.376113입니다."} /><CitationBlock source={"FA4 식 (6) · 기준을 유지하는 분기"} citeKey={2} href={"https://arxiv.org/html/2603.05451v1"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-flashattention4" title={"FlashAttention-4 · arXiv 2603.05451v1"} href={"https://arxiv.org/html/2603.05451v1"} problem={"Blackwell에서 행렬곱 외 자원이 병목으로 남음"} idea={"지수·MMA·이동 겹침, 조건부 rescaling, TMEM·2CTA"} assumption={"지원 target·tile·dtype의 오차와 자원 조건을 지켜야 함"} experiment={"저자 비교는 BF16, head dim·sequence length와 baseline version별 kernel 측정"} boundary={"v1 본문은 B200, 부록 A.1은 B100으로 표기가 불일치한다. 이 글은 최고 가속비를 제품 성능 보장으로 인용하지 않는다."} />
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 수학과 서로 다른 실행 비용을 분리했습니다. 마지막으로 측정과 실패 조건을 정합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <span id="boundary" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">10 · 같은 shape와 오차 기준으로 시간을 재야 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">비교할 때 batch·head·sequence·head dim, causal mask, dtype, dropout, forward/backward와 backend 버전을 고정합니다. warmup·동기화·반복 측정도 같아야 합니다. 네 점수의 CPU 계산 검산은 GPU 성능 재현이 아닙니다.</p>
        <p className="leading-8">긴 prefill과 query 한 개의 decode는 활용할 병렬성과 KV 이동이 다릅니다. <Link to="/cs/ai/attention-kernel-anatomy-and-backends">backend 선택 정본</Link>에서 지원 shape를 확인하고 <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline">메모리와 연산 상한</Link>을 실제 counter와 비교합니다.</p>
        <p className="leading-8">예측해 보세요. 모든 점수에 100을 더하면 출력은 변할까요? 같은 mask와 정확한 실수 계산에서는 변하지 않습니다. 왜 그런지는 7절의 공통 기준 이동식으로 돌아가 설명할 수 있어야 합니다.</p>
      </div>

      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">출력의 동치, 수치 오차, 실제 시간을 각각 검증하면 이 글의 추적이 끝납니다.</p>
    </section>
    <ReviewPrompts questions={["모든 점수에 같은 100을 더하면 출력이 바뀔까요? (답: 7절)", "128MiB가 입력 세 배열의 64배라는 주장은 왜 틀릴까요? (답: 5절)", "행렬곱만 두 배 빨라져도 전체 시간이 두 배 줄지 않는 이유는 무엇일까요? (답: 9절)"]} />
    <ContentBoundary article="flash-attention-io-aware-kernel" />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}

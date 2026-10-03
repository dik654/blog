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
import { codeRefs, fileTrees, projectMetas } from "./research-audit-sources/codeRefs";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 같은 답을 더 적은 왕복으로 구한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">문장 속 한 위치가 앞의 네 위치를 얼마나 참고할지 정한다고 해 봅시다. 이미 계산한 점수는 [1, 3, 2, 5]이고 가져올 값은 [2, 4, 6, 8]입니다. 이 글은 가중평균 7.376113을 구하는 과정을 끝까지 따라갑니다.</p>
        <p className="leading-8">핵심은 점수 전체를 메모리에 적어 두지 않아도, 지금까지의 기준값과 두 합만 고쳐 가면 답을 구할 수 있다는 것입니다. 이후 같은 계산이 GPU에서 어디를 기다리는지 살펴봅니다.</p>
      </div>

      <ContentBoundary article="flash-attention-io-aware-kernel" />
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">출력 숫자 하나를 고정했습니다. 먼저 입력과 출력의 계약을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 점수와 값을 받아 가중평균을 돌려준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">입력은 query·key·value 배열과 scale·mask입니다. 점수 S=QKᵀ/√d를 만든 뒤 softmax 가중치를 값 V에 곱해 출력 O를 구합니다. 네 점수 사례는 이미 scale을 적용한 한 행이며 실제 attention은 이 작업을 여러 행과 head에 수행합니다.</p>
        <p className="leading-8">구현을 바꿔도 허용한 dtype 오차 안에서 같은 수학적 연산을 해야 합니다. 인과 mask를 빼거나 attention을 sparse 근사로 바꾸면 계산 대상 자체가 달라집니다. 속도를 비교하기 전에 이 계약을 맞춥니다.</p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 출력이라는 조건을 정했습니다. 이제 네 항을 직접 더합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 네 항을 한 번에 계산하면 7.376113이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">가장 큰 점수 5를 빼면 지수는 약 [0.018316, 0.135335, 0.049787, 1]입니다. 합은 1.203438이고 각 항에 [2, 4, 6, 8]을 곱한 합은 8.876695입니다. 둘을 나누면 7.376113입니다.</p>
        <p className="leading-8">모든 지수에 같은 e⁻⁵를 곱했으므로 분자와 분모의 비율은 유지됩니다. 큰 지수로 넘치지 않게 기준을 옮기는 이유이며 뒤에서 조각을 합칠 때도 같은 원리를 씁니다.</p>
      </div>
<NumericPath title="한 행의 값이 출력이 되는 길" steps={[{"label": "점수", "value": "1, 3, 2, 5", "detail": "이미 scale을 적용한 한 행"}, {"label": "공통 기준", "value": "최대 5", "detail": "지수에서 같은 값을 뺌"}, {"label": "두 합", "value": "8.876695 / 1.203438", "detail": "값의 가중합 / 지수합"}, {"label": "출력", "value": "7.376113", "detail": "반올림한 가중평균"}]} />
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">전체 계산의 답을 얻었습니다. 조각마다 무엇을 보관할지 그려봅니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <span id="tiling" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">4 · 조각을 버리고 기준값과 두 합만 남긴다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 조각 [1, 3]을 읽으면 기준 m=3, 지수합 ℓ=1.135335, 값의 합 u=4.270671입니다. 다음 조각 [2, 5]에서는 최대가 5로 바뀝니다. 옛 두 합을 e⁻²만큼 줄이고 새 조각의 합을 더하면 됩니다.</p>
        <p className="leading-8">GPU에서는 Q의 행 묶음과 K·V의 조각을 작은 온칩 저장 공간에서 만납니다. 점수 조각을 소비한 뒤 버리고 다음 K·V를 가져옵니다. HBM에 모든 N×N 점수와 확률을 저장할 필요가 사라집니다.</p>
      </div>
<NumericPath title="두 조각이 하나의 기준을 공유하는 과정" steps={[{"label": "첫 조각", "value": "m=3, ℓ=1.135335", "detail": "u=4.270671"}, {"label": "기준 이동", "value": "이전 합 × e⁻²", "detail": "분자와 분모에 같은 배율"}, {"label": "둘째 조각", "value": "e⁻³와 1 추가", "detail": "값 6과 8도 함께 반영"}, {"label": "최종 상태", "value": "m=5, O≈7.376113", "detail": "점수 전체를 보관하지 않음"}]} />
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">조각을 합칠 자리를 찾았습니다. 왜 이 구조가 필요한지 바이트로 확인합니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <span id="problem" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">5 · 계산보다 중간 행렬의 왕복이 커질 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">크기 효과를 따로 보기 위해 N=4096, d=64, FP16, mask·dropout 없는 예를 둡니다. Q·K·V는 각각 512KiB이고 합은 1.5MiB입니다. 점수 S와 확률 P는 각각 32MiB입니다. 두 행렬을 한 번씩 쓰고 읽으면 중간 왕복만 128MiB입니다.</p>
        <p className="leading-8">128MiB는 입력 세 배열 합의 약 85.33배입니다. 출력 O까지 포함한 네 배열 합 2MiB를 분모로 삼아야 64배가 됩니다. head 32개·batch 8이면 32GiB이고 가정한 2TB/s로 나눈 17.18ms는 이 왕복만의 처리량 하한입니다. 실제 실행시간이나 모든 attention의 병목을 단정하는 숫자가 아닙니다.</p>
        <p className="leading-8">PyTorch의 attention API도 backend에 따라 이미 fused kernel을 선택합니다. 여기서 비교하는 대상은 S·P를 따로 저장하는 설명용 구현입니다. 라이브러리 이름만 보고 같은 왕복이 발생한다고 가정하지 않습니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">왕복을 줄일 동기가 생겼습니다. 각 저장물과 알고리즘에 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="io-aware" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · FlashAttention은 attention 행렬의 저장을 피하는 구현이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">점수와 확률을 큰 행렬로 남기는 일을 materialization, HBM과 온칩 공간 사이의 이동량을 함께 설계하는 일을 IO-aware 설계라고 부릅니다. Tile은 한 번에 처리하는 조각이고 online softmax는 조각을 읽으며 기준과 합을 갱신하는 규칙입니다.</p>
        <p className="leading-8">FlashAttention의 exact는 sparse·저차원 근사로 attention 연결을 줄이지 않는다는 뜻입니다. 덧셈 순서와 지수 구현, dtype가 달라 수치 오차는 생길 수 있습니다. SRAM도 shared memory와 register 등 서로 다른 자원을 묶어 부르는 말이므로, SM 한 개의 용량을 GPU 전체 대역폭과 직접 짝지어 비교하지 않습니다.</p>
        <p className="leading-8">고전적인 IO 모델은 온칩 저장량 M을 원소 개수로 두고 해당 가정 범위에서 FlashAttention의 HBM 접근을 O(N²d²/M)로 분석합니다. 이는 점근식입니다. 차수에 숫자를 넣은 비율은 kernel의 정확한 바이트나 실측 가속비가 아닙니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">용어가 같은 네 점수 계산을 가리키는지 확인했습니다. 이제 갱신식을 유도합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="online-softmax" className="scroll-mt-20" />
      <span id="backward" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 옛 합의 기준을 옮기면 중간 행렬이 필요 없다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">점수 s에 대해 e^(s−m)=e^(s−m_old)×e^(m_old−m)입니다. 따라서 이전 조각의 개별 점수를 다시 읽을 필요 없이 이미 쌓은 합 전체에 같은 배율을 곱할 수 있습니다. 값의 가중합에도 동일하게 적용됩니다.</p>
        <p className="leading-8">학습의 backward에서는 Q·K를 다시 곱해 점수와 확률을 필요한 조각만 재계산할 수 있습니다. 저장했던 O와 행 통계, 입력 및 dropout을 썼다면 동일 난수 상태를 이용합니다. 계산을 추가하는 대가로 큰 중간 행렬을 저장·읽는 비용을 피하는 선택입니다.</p>
      </div>
<ExplainedFormula question={"점수 네 개를 둘씩 읽어도 어떻게 같은 가중평균이 나올까?"} idea={"옛 합과 새 항을 같은 기준점으로 바꾸면 덧셈이 가능해집니다. 분자와 분모에 같은 배율을 적용하면 비율도 보존됩니다."} formula={"m=\\max(m_o,\\max S_j),\\ a=e^{m_o-m},\\ \\ell=a\\ell_o+\\sum e^{S_j-m},\\ u=au_o+\\sum e^{S_j-m}V_j,\\ O=u/\\ell"} annotatedFormula={"\\ell=\\underbrace{e^{m_o-m}\\ell_o}_{\\text{옛 합의 기준 이동}}+\\underbrace{\\sum e^{S_j-m}}_{\\text{새 조각의 합}},\\quad O=\\underbrace{u/\\ell}_{\\text{마지막 정규화}}"} operations={[{"expression": "e^{m_o-m}", "annotation": ["옛 기준에서 새 기준으로 지수합과 분자를 함께 옮깁니다."]}, {"expression": "\\sum e^{S_j-m}V_j", "annotation": ["같은 기준으로 계산한 현재 조각의 가중값을 더합니다."]}]} terms={[{"symbol": "m_o,m", "name": "이전·현재 기준", "description": "지수 overflow를 막기 위한 행의 최대 점수입니다."}, {"symbol": "\\ell,u", "name": "분모·분자", "description": "지수합과 값의 가중합을 정규화하지 않은 채 보관합니다."}, {"symbol": "S_j,V_j", "name": "현재 tile", "description": "이미 scale·mask를 적용한 점수와 그 위치의 값입니다."}]} assumptions={["여기서는 dropout이 없고 적어도 하나의 유효 key가 있는 행을 다룹니다.", "실수 산술의 동치이며 실제 부동소수점 결과의 bit 단위 동일성은 보장하지 않습니다."]} interpretation={"[1,3] 뒤 m=3, ℓ=1.135335, u=4.270671입니다. [2,5]를 읽으면 m=5, ℓ=1.203438, u=8.876695이 되어 O≈7.376113입니다."} />
<AlgorithmBlock title={"두 조각의 분자와 분모를 같은 기준으로 합칩니다 (의사코드)"} input={["점수 S=[1,3,2,5], 값 V=[2,4,6,8], tile 크기 2", "점수에는 scale과 mask를 이미 적용했다고 가정합니다."]} steps={[{"code": "m = −∞; l = 0; u = 0", "note": "최댓값, 지수 합, 가중합을 보관합니다."}, {"code": "for (scores, values) in paired_tiles(S, V, 2):", "note": "점수와 값의 같은 위치를 둘씩 읽습니다."}, {"code": "  new_m = max(m, max(scores)); a = 0 if l == 0 else exp(m − new_m)", "note": "첫 조각에서는 옛 합이 없으므로 0을 씁니다."}, {"code": "  p = exp(scores − new_m)", "note": "새 조각을 새 기준점에 맞춥니다."}, {"code": "  l = a * l + sum(p); u = a * u + sum(p * values); m = new_m", "note": "옛 합도 같은 배율로 바꾼 뒤 새 항을 더합니다."}, {"code": "return u / l", "note": "분자와 분모의 공통 배율이 사라집니다."}]} output={"u≈8.876695, l≈1.203438, O≈7.376113; 실제 커널의 병렬 실행 순서는 별도입니다."} />
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">식에서 보관할 상태가 정해졌습니다. 공식 코드의 실제 변수와 대조합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="paper-online-softmax" className="scroll-mt-20" />
      <span id="paper-flashattention" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 코드의 row_scale에 e⁻²를 넣는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">공식 소스 e9515d5의 Softmax.online_softmax는 row_max_prev와 row_max_cur의 차이에 scale_log2를 곱한 뒤 exp2를 호출합니다. 이미 scale한 네 점수 사례에서는 log₂e를 곱하므로 2^((3−5)log₂e)=e⁻²입니다. 이어 옛 row_sum에 이 배율을 곱해 현재 조각의 합에 더합니다.</p>
        <p className="leading-8">사이드바는 2026-10-03 commit의 파일 원문 전체입니다. 이 일반 online-softmax 함수는 갱신 원리를 확인하는 경로이며 다음 절의 FA4 특수 경로 전체를 대표하지 않습니다. 공식 구현도 무효 행과 dtype·architecture에 따른 별도 분기를 갖습니다.</p>
      </div>
<CodeViewButton label="공식 소스 · online_softmax 213–251행" onClick={() => sidebar.open("softmax", codeRefs.softmax)} /><SourceApplication source={"공식 코드의 갱신식"} excerpt={"row_sum[r] * row_scale[r]"} application={"1.135335 × e⁻²에 e⁻³+1을 더해 1.203438을 얻습니다."} /><CitationBlock source={"공식 코드의 갱신식"} citeKey={2} href={"https://github.com/Dao-AILab/flash-attention/blob/e9515d5dee6ade134a33d6020d38d01ef0596996/flash_attn/cute/softmax.py"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-flashattention-reading" title={"FlashAttention · 2022"} href={"https://arxiv.org/abs/2205.14135"} problem={"N×N 점수와 확률 중간값을 HBM에 쓰고 읽는 비용"} idea={"tile과 online softmax, backward 재계산"} assumption={"온칩 저장량과 dtype에 맞는 tile이 필요"} experiment={"원 논문의 모델·GPU 구성에서 저자 측정"} boundary={"FLOPs가 같아도 시간은 달라지며 모든 shape에서 같은 이득은 아니다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">실물 코드와 3→5 계산이 맞았습니다. Blackwell에서 새로 남는 병목을 비교합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · FA4는 지수 계산과 온칩 이동도 함께 겹친다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">같은 네 점수에서 둘째 조각을 반드시 기준 5로 옮길 필요는 없습니다. 기준 3을 유지하면 ℓ=1.135335+e⁻¹+e²≈8.892271이고 u≈65.590396입니다. 비율은 여전히 7.376113입니다. 다만 큰 지수를 계속 허용하면 overflow가 생기므로 기준 갱신 조건과 dtype의 범위를 함께 지켜야 합니다.</p>
        <p className="leading-8">FA4는 이런 조건부 rescaling과 FMA를 이용한 지수 근사, 비동기 MMA·softmax 겹침을 함께 설계합니다. backward에서는 TMEM과 2-CTA MMA로 shared-memory 이동·원자적 누적 부담을 줄입니다. <Link to="/cs/ai/sionic-glm-b300#tmem-official-source">tcgen05·TMEM 실제 명령</Link>과 <Link to="/cs/gpu/warp-specialization-and-async-pipelines">Hopper의 TMA·WGMMA</Link>는 각 정본에서 이어집니다.</p>
        <p className="leading-8">행렬 연산 장치만 빨라졌다고 전체 attention이 같은 배율로 빨라지지 않습니다. 가정상 10시간 중 행렬곱 5시간을 절반으로 줄여도 총 7.5시간, 약 1.33배입니다. FA4의 질문은 나머지 지수·이동·동기화가 실행 경로에서 얼마나 남는가입니다.</p>
      </div>
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
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}

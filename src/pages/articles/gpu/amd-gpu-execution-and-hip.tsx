import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees } from "@/pages/articles/gpu/gpu-execution-sources/codeRefs";

/** teach-system S→B→0…7. Same 64-element trace; official source snapshots pinned. */
export default function Article() {
  const sidebar = useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 같은 64개 덧셈을 다른 칩에 옮겨도 같은 방식으로 실행될까요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">다른 회사의 장치에서 같은 프로그램을 실행하려면 먼저 답이 같아야 합니다. 그다음 어느 작업들이 함께 움직이고 어느 저장 공간을 나누는지 다시 확인합니다. 함수 이름을 바꾸는 일과 빠르게 실행되게 만드는 일에는 서로 다른 검사가 필요합니다.</p>
        <p className="leading-8">이 글은 두 배열의 64개 원소를 더하는 요청을 AMD 장치 안으로 보냅니다. 작업 수는 유지하면서 실행 묶음과 명령, 저장 공간의 차이를 따라갑니다. 공식 구현 두 개를 비교하되 특정 제품의 성능 순위를 만들지는 않습니다.</p>
      </div>
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            이식의 질문을 정확성과 실행 구조로 나눴습니다. 먼저 변하지 않는 입출력을 봅니다.
          </p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 입력과 답 사이에는 번역과 실행이 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">주 프로그램이 입력 두 개를 보내고 계산할 함수를 제출합니다. 개발 도구는 함수를 해당 칩의 명령으로 바꿉니다. 장치는 작업들을 묶어 읽기·덧셈·쓰기를 진행합니다.</p>
        <p className="leading-8">두 회사의 도구가 같은 덧셈을 표현해도 명령의 형태와 작업 묶음의 크기는 다를 수 있습니다. 답이 같은지 확인한 뒤 각 장치가 실제로 기다리는 지점을 찾아야 합니다.</p>
      </div>
      <NumericPath title="같은 작업을 두 실행 환경에 제출하기" steps={[{"label": "입력", "value": "64개씩 2개"}, {"label": "번역과 배치", "value": "해당 칩 명령"}, {"label": "출력", "value": "64개"}]} />
      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">입출력이 같아도 내부 배치가 달라질 수 있습니다. 숫자를 정해 그 차이를 봅니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 64명을 32명씩 묶으면 둘이고 64명씩 묶으면 하나입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">원소 하나가 4바이트인 64개 배열 두 개를 더합니다(가정). 두 입력 512바이트를 읽고 결과 256바이트를 써서 유효 데이터 768바이트와 덧셈 64번이 필요합니다. 64개 작업을 한 협력 묶음으로 제출합니다.</p>
        <p className="leading-8">명령을 함께 진행할 단위가 32개면 두 묶음, 64개면 한 묶음입니다. 32개 단위에서 37번은 둘째 묶음의 5번입니다. 64개 단위에서는 첫째 묶음의 37번입니다. 묶음 수가 절반이라는 사실은 실행 시간이 절반이라는 증거가 아닙니다.</p>
      </div>
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 37번 작업의 이웃이 달라졌습니다. 그 이웃이 같은 명령에 참여하는 모습을 봅니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 함께 진행하는 범위가 바뀌면 서로 값을 건네는 규칙도 바뀝니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">각 작업이 자기 입력만 더하는 이번 사례에서는 묶음이 달라도 답이 같습니다. 그러나 이웃 값을 합치거나 어느 작업이 조건을 만족했는지 모으는 코드는 함께 진행하는 범위에 의존합니다.</p>
        <p className="leading-8">0부터 31까지의 참여만 표현하는 32비트 표식을 그대로 쓰면 32부터 63까지를 표현할 자리가 없습니다. 64개를 한 묶음으로 쓰는 장치에 옮길 때 이런 숨은 가정을 찾아야 합니다.</p>
      </div>
      <NumericPath title="37번 작업이 속하는 명령 묶음" steps={[{"label": "작업 번호", "value": "37"}, {"label": "32개 단위", "value": "묶음 1·위치 5"}, {"label": "64개 단위", "value": "묶음 0·위치 37"}]} />
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">단순한 덧셈은 안전해도 작업 사이 통신은 재검토해야 합니다. 이 구조가 필요한 이유를 살핍니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5 · 공통 명령은 공유하고 값은 각자 보관합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">한 묶음이 같은 동작을 수행하면 명령을 가져오고 해석하는 일을 함께할 수 있습니다. 대신 각 작업은 서로 다른 입력과 중간값을 갖습니다. 모든 작업에 같은 값과 작업마다 다른 값의 저장소를 구별하면 불필요한 복제를 줄일 수 있습니다.</p>
        <p className="leading-8">
            협력 묶음이 같은 입력 조각을 여러 번 사용하려면 함께 쓰는 공간도 필요합니다. 다만 이번 덧셈은 재사용이 없습니다. 중간 공간에 옮기는 명령과 대기만 더할 가능성이 있어 바로
            읽고 쓰는 경로를 먼저 측정합니다.
          </p>
      </div>
      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공유할 명령과 따로 보관할 값의 역할을 구분했습니다. AMD에서 쓰는 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6 · CU와 wavefront는 서로 다른 크기의 부품입니다</h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table data-role-name-table className="w-full table-fixed text-left text-sm leading-7">
          <caption className="sr-only">앞에서 본 역할에 이름 붙이기</caption>
          <thead className="hidden bg-neutral-50 sm:table-header-group dark:bg-neutral-900"><tr><th scope="col" className="w-[30%] p-3 align-top">앞에서 본 역할</th><th scope="col" className="p-3 align-top">이름과 이 사례에서의 뜻</th></tr></thead>
          <tbody>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">명령을 함께 진행하는 묶음</th><td className="block break-words p-3 align-top sm:table-cell">AMD에서는 wavefront라고 부릅니다. CDNA 계열의 계산은 64개가 기본 단위이고, lane은 이 묶음 안의 작업 위치입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">묶음을 실행하는 처리 구역</th><td className="block break-words p-3 align-top sm:table-cell">Compute Unit, 줄여서 CU입니다. CUDA의 SM과 역할을 비교할 수 있지만 수와 배치를 그대로 환산할 수는 없습니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">각자의 값과 공통 값</th><td className="block break-words p-3 align-top sm:table-cell">각 작업의 벡터 값은 VGPR에, 묶음이 공통으로 쓰는 스칼라 값은 SGPR에 둡니다. CUDA register와 비교할 때도 종류별 역할을 먼저 맞춥니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">작업들이 직접 공유하는 공간</th><td className="block break-words p-3 align-top sm:table-cell">Local Data Share, 줄여서 LDS입니다. CUDA shared memory에 대응하는 역할입니다. LDS는 cache가 아니므로 내용을 채우고 사용하는 순서를 프로그램이 관리합니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">코드를 표현하고 실행하는 층</th><td className="block break-words p-3 align-top sm:table-cell">HIP은 CUDA와 비슷한 소스 표현과 실행 API를 제공합니다. ROCm은 compiler·runtime·수학 라이브러리·분석 도구를 포함하는 더 큰 소프트웨어 묶음입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">계산용 구조와 그래픽을 함께 고려한 구조</th><td className="block break-words p-3 align-top sm:table-cell">CDNA는 데이터센터 계산 구조이고 RDNA는 그래픽과 계산을 함께 고려한 구조입니다. 제품명 하나로 OS와 라이브러리 지원까지 보장하지 않습니다.</td></tr>
          </tbody>
        </table>
      </div>
      <p className="leading-8">실행 폭은 대상 환경에서 확인해야 합니다. ROCm 7.0의 HIP 문서는 gfx9의 warpSize를 64, gfx10 이상을 32로 설명하며 gfx10 이상에서 64를 지원하지 않는다고 명시합니다. RDNA ISA가 표현할 수 있는 wave64와 이 HIP runtime의 지원 범위는 구별해야 합니다. 이식 코드에서는 상수 대신 장치의 warpSize를 확인합니다.</p>
      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            대응하는 역할과 실제 자원 배치의 차이를 구별했습니다. 실제 64개 요청을 CU 안으로 보냅니다.
          </p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7 · CDNA4에서는 37번이 64개 wavefront의 37번 lane입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">MI350X·MI355X의 CDNA4를 대상으로 64 threads block 1개를 제출한다고 놓습니다. 이 block은 64개 lane으로 이루어진 wavefront 1개를 이룹니다. 37번 lane은 입력 A와 B의 148바이트 위치를 읽습니다. 각 lane의 load 결과는 VGPR에 놓이고 벡터 덧셈 뒤 결과를 씁니다. 공통 주소의 일부나 동일한 제어 값에는 스칼라 경로를 사용할 수 있지만 실제 배정은 compiler 결과로 확인합니다.</p>
        <p className="leading-8">CDNA4에서는 CU의 L1 뒤에 XCD별 L2가 있습니다. 그다음 메모리 쪽 Infinity Cache와 제어기를 지나 HBM으로 갑니다. Cache에서 찾으면 다음 단계의 읽기를 줄입니다. NVIDIA의 32바이트 sector 계산을 AMD의 실제 전송 규칙이라고 옮겨 적지 않습니다. 64개 유효 읽기 256바이트와 특정 계층의 거래량은 다른 수치입니다.</p>
        <p className="leading-8">CDNA4 백서 2258402-C의 9쪽은 LDS를 160KB라고 명시합니다. CDNA3의 64KB·32 banks와 같은 값이 아닙니다. 서로 다른 주소가 동시에 같은 bank 자원을 요구하면 접근이 나뉠 수 있습니다. bank 수와 명령별 읽기 묶음은 target별로 확인해야 하며 단순히 CUDA용 padding 하나를 복사해서 끝내지 않습니다.</p>
        <p className="leading-8">VGPR 사용량이 커지면 동시에 머물 수 있는 wave 수가 줄거나 private scratch로 spill될 수 있습니다. LDS를 많이 쓰는 block도 상주 자원을 제한합니다. 64개를 더하는 코드에 불필요한 임시 배열을 추가하면 덧셈 수가 그대로여도 느려질 수 있습니다.</p>
        <p className="leading-8">공유 공간을 사용하는 변형에서는 모든 필요 thread가 block barrier에 참여해야 합니다. 한 wave라는 이유로 동기화와 메모리 가시성 규칙을 생략하지 않습니다. 비동기 copy도 제출·완료·소비를 구별하며 target이 제공하는 명령과 runtime의 의미를 확인합니다.</p>
      </div>
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 64개가 어느 실행 단위와 저장소를 지나는지 확인했습니다. 이제 공식 코드의 번호 계산에 대입합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8 · AMD 예제의 2차원 번호도 64×1로 놓으면 37을 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">고정 commit cdf9d101…의 HIP-Examples vectoradd_float는 x와 y를 계산합니다. 이어 i = y×width + x로 1차원 주소를 만듭니다. 이 글의 64개를 width 64·height 1, block 64×1로 놓으면 37번은 x=37·y=0, 따라서 i = 37입니다. 입력 b[37]과 c[37]을 더해 출력 a[37]에 씁니다.</p>
        <p className="leading-8">원본 예제의 기본 입력은 1024×1024이고 block은 16×16입니다. 64×1은 함수 규칙에 대입한 학습 사례입니다. 원본은 i&lt;width×height를 검사합니다. 일반적인 2차원 비정렬 폭에서는 x&lt;width와 y&lt;height를 각각 검사하는 것과 다릅니다. 바뀐 크기로 실제로 수정할 때는 축별 경계와 launch를 함께 검증해야 합니다.</p>
        <p className="leading-8">사이드바에는 소스를 변경하지 않고 보관했습니다. HIP의 include·할당·복사·launch 표현도 함께 확인할 수 있습니다. 오래된 예제 commit의 동작 표현을 현재 모든 ROCm 지원 장치의 성능 보장으로 확대하지 않습니다.</p>
      </div>
      <CodeViewButton label="AMD vectoradd_hip.cpp · 46–61행" onClick={() => sidebar.open("hip-kernel", codeRefs["hip-kernel"])} /><SourceApplication source="ROCm HIP-Examples ·cdf9d101 ·54–56행" excerpt="int i = y * width + x;" application="width 64·height 1·x=37·y=0이면 i = 37입니다. 입력과 출력의 이름이 CUDA 샘플과 다르므로 배열 역할을 먼저 맞춥니다." /><CitationBlock source="ROCm HIP-Examples ·cdf9d101 ·54–56행" citeKey={1} href="https://github.com/ROCm/HIP-Examples/blob/cdf9d101acd9a3fc89ee750f73c1f1958cbd5cc3/vectorAdd/vectoradd_hip.cpp">ROCm HIP-Examples ·cdf9d101 ·54 –56 행</CitationBlock>
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">AMD 원문의 번호가 37로 확인됐습니다. 같은 번호를 만드는 CUDA 원문과 이식 시 검사할 가정을 대조합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · 이름을 바꿔도 32개라는 가정은 자동으로 바뀌지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">CUDA 원문의 64×0 + 37과 HIP 원문의 0×64 + 37은 같은 위치를 가리킵니다. 독립적인 덧셈이라 답을 보존하기 쉽습니다.</p>
        <p className="leading-8">HIPIFY 문서는 “HIPIFY does not automatically convert all CUDA code into HIP code seamlessly”라고 적어, 지원 목록 밖의 구문은 사람이 검사해야 한다고 밝힙니다. 이 글은 inline PTX와 상수 32에 기댄 lane mask를 그 검사 후보로 꼽지만, HIPIFY 문서에서 inline PTX를 명시한 문장은 2026-10-09 기준 확인하지 못했습니다. 특정 라이브러리 구현의 성능까지 자동 변환하지는 않습니다.</p>
        <p className="leading-8">이식할 때는 먼저 할당·복사·launch·완료 확인을 맞추고 CPU 결과와 비교합니다. 다음에는 상수 32 대신 target의 warpSize와 지원되는 mask 형식이 필요한 곳을 검사합니다. 마지막으로 장치별 register·LDS·메모리 counter를 보고 block 크기와 데이터 배치를 측정합니다. 64개 단순 덧셈과 wave 안 reduction을 같은 난이도의 이식으로 보지 않습니다.</p>
        <p className="leading-8">행렬 연산에서는 CDNA의 MFMA와 RDNA3 이후의 WMMA 명령군을 구별합니다. Dtype·shape·target에 따라 실제 명령은 달라집니다. 이번 64개 덧셈은 행렬곱이 아니어서 MFMA를 넣을 이유가 없습니다.</p>
        <p className="leading-8">두 명령군을 함께 다루는 상위 라이브러리가 rocWMMA입니다. rocWMMA 문서는 “The API is seamless across the supported CDNA and RDNA architectures.”라고 적습니다. 다만 세대별 지원 GPU 표는 2026-10-09 기준 확인하지 못했으므로 선택한 ROCm 릴리스의 지원표로 target을 확인합니다.</p>
        <p className="leading-8">문서 기준은 ROCm 7.0.0의 HIP 문법·실행 모델과 CDNA4 ISA입니다. 제품 내부 구성은 2025-10-01 개정 백서에 고정했습니다. CDNA5 같은 후속 발표를 이 글의 실제 검증 target으로 섞지 않습니다. 설치할 때는 선택한 ROCm 릴리스의 GPU·OS 지원표를 따로 확인합니다.</p>
      </div>
      <CodeViewButton label="NVIDIA vectorAdd.cu ·같은 37번 계산" onClick={() => sidebar.open("cuda-kernel", codeRefs["cuda-kernel"])} /><SourceApplication source="NVIDIA vectorAdd ·3f1c509 ·49행" excerpt="int i = blockDim.x * blockIdx.x + threadIdx.x;" application="64×0 + 37 = 37은 HIP의 0×64 +37과 같습니다. 주소가 같다는 검증은 실행 묶음 크기와 속도까지 같다는 검증이 아닙니다." /><CitationBlock source="NVIDIA vectorAdd ·3f1c509 ·49행" citeKey={2} href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu">NVIDIA vectorAdd ·3f1c509 ·49 행</CitationBlock><CitationBlock source="AMD HIP7.0.0 ·hardware implementation" citeKey={3} href="https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/understand/hardware_implementation.html">CU·wavefront와 실행 계층. 특정 SKU의 성능 수치는 아닙니다.</CitationBlock><CitationBlock source="AMD CDNA4 Architecture 2258402-C ·9쪽" citeKey={4} href="https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf">LDS 160KB와 메모리 계층의 세대별 구성.</CitationBlock><CitationBlock source="AMD CDNA4 ISA ·Matrix Arithmetic" citeKey={5} href="https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/instruction-set-architectures/amd-instinct-cdna4-instruction-set-architecture.pdf">MFMA 명령의 target·operand·shape는 해당 ISA로 확인합니다.</CitationBlock>
      <CitationBlock source="HIP 7.0.0 · warpSize" citeKey={6} href="https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/how-to/hip_cpp_language_extensions.html#warpsize">장치별 warpSize와 HIP의 지원 범위를 확인합니다.</CitationBlock>
      <CitationBlock source="AMD HIPIFY · documentation" citeKey={7} href="https://rocm.docs.amd.com/projects/HIPIFY/en/latest/index.html">자동 변환의 한계 문장만 확인했습니다. inline PTX를 명시한 unsupported 목록은 확인하지 못했습니다.</CitationBlock>
      <CitationBlock source="AMD rocWMMA · What is rocWMMA" citeKey={8} href="https://rocm.docs.amd.com/projects/rocWMMA/en/latest/what-is-rocwmma.html">CDNA·RDNA 공통 API 문장만 확인했습니다. 세대별 지원 GPU 표는 확인하지 못했습니다.</CitationBlock>
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">소스 수준의 같은 답과 장치별 성능을 따로 검사하는 순서를 얻었습니다. 남는 한계를 정리합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10 · 큰 묶음 하나가 작은 묶음 둘보다 빠르다는 결론은 나오지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">한 명령에 참여하는 논리적 작업 수를 실행 묶음의 폭이라고 합니다. 실제 명령 처리량·메모리 대기·분기 경로·동시 상주 자원이 실행 시간을 정합니다. 64개로 묶인다고 32개보다 2배 빠르거나 느리다고 단정할 수 없습니다.</p>
        <p className="leading-8">같은 GPU라도 compute·memory partition 설정과 대상 compiler 옵션을 확인합니다. 설정이 달라지면 보이는 자원과 주소 접근 경로도 달라질 수 있습니다. GPU의 정확한 SKU, gfx target, ROCm·driver 버전, dtype, 배열 크기와 device 완료 기준을 기록하고 비교합니다.</p>
        <p className="leading-8">이번 환경에서는 AMD 장치 실행이나 HIP compile을 수행하지 않았습니다. 원문 보존과 주소·바이트 계산만 검증했습니다. 실제 이식은 경계 입력에서도 답이 맞고 동기화 오류가 없어야 끝납니다. 전체 완료 시간과 counter도 같은 조건에서 확인합니다.</p>
      </div>
      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이식할 때 보존할 답과 다시 측정할 실행 조건을 분리했습니다.</p>
    </section>
    <ReviewPrompts questions={["64개로 묶인 CDNA wavefront에서 37번의 lane은 몇 번입니까? (답: 7절)", "32비트 참여 mask를 CDNA의 64개 wave에 그대로 쓰면 무엇을 놓칩니까? (답: 4·9절)", "CDNA3의 LDS 64KB 규칙을 MI355X에 그대로 대입해도 될까요? (답: 7절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ cuda: { id: "cuda", label: "NVIDIA cuda-samples · v13.0", badgeClass: "bg-sky-50 border-sky-300 text-sky-800" }, hip: { id: "hip", label: "ROCm HIP-Examples · pinned source", badgeClass: "bg-amber-50 border-amber-300 text-amber-800" } }} />
  </div>;
}

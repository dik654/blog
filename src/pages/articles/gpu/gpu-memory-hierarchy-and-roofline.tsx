import { RooflineArithmeticViz } from "@/components/articles/calculation-structure-gallery";
import { Link } from "react-router-dom";
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
      <h2 className="mb-6 text-2xl font-bold">1 · 계산기는 놀고 있는데 왜 프로그램은 끝나지 않을까요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">같은 덧셈 수를 가진 프로그램도 데이터가 오는 길과 요청 순서가 다르면 시간이 달라집니다. 계산 속도와 데이터를 옮기는 속도를 먼저 구별합니다. 다음 요청을 낼 수 없어 기다리는지도 확인합니다. 이 구분이 개선 방향을 정합니다.</p>
        <p className="leading-8">이 글은 64개 덧셈에 필요한 768바이트를 유지한 채 저장 계층과 접근 간격, 시간당 처리량을 차례로 계산합니다. 계산한 상한과 측정한 성능을 비교합니다. 상한 아래에 있다는 사실만으로 원인을 확정하지는 않습니다.</p>
      </div>
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">병목을 한 수치로 이름 붙이기 전에 데이터가 지나가는 경로를 펼칩니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 가까운 곳에서 찾으면 먼 저장 장치로 가지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">계산 직전 값은 가장 가까운 공간에 둡니다. 거기에 없는 값은 더 크고 멀리 있는 저장 공간에서 찾습니다. 가까운 공간이 최근 값을 보관하고 있으면 큰 저장 장치에서 다시 가져올 필요가 없습니다.</p>
        <p className="leading-8">따라서 프로그램이 읽으라고 요구한 양과 실제로 바깥 통로를 지난 양은 다를 수 있습니다. 시간당 처리량을 계산할 때는 어느 지점의 바이트를 세는지 먼저 고정해야 합니다.</p>
      </div>
      <NumericPath title="한 값이 없는 경우에만 다음 단계로 내려갑니다" steps={[{"label": "계산 직전", "value": "작은 값"}, {"label": "가까운 보관", "value": "최근 데이터"}, {"label": "큰 저장소", "value": "원본 배열"}]} />
      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">요청량과 실제 전송량을 구별했습니다. 두 양이 같다고 가정할 수 있는 작은 계산부터 시작합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 64번 더하려고 유효 768바이트를 읽고 씁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">원소 64개짜리 배열 두 개를 더하며 각 원소는 4바이트라고 놓습니다(가정). 입력 512바이트와 출력 256바이트를 합한 유효량은 768바이트입니다. 덧셈은 64번이므로 유효량 기준으로 1바이트당 1/12번 계산합니다.</p>
        <p className="leading-8">성능 상한을 연습하기 위해 해당 덧셈의 계산 능력을 초당 1조 회, 해당 메모리 경계의 대역폭을 초당 1조 바이트로 놓습니다(가정). 이 숫자는 실제 GPU의 사양이 아니며 복사와 요청 시작 비용을 포함하지 않습니다.</p>
      </div>
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">64회·768바이트와 두 상한을 고정했습니다. 첫 32개 요청이 어떻게 모이는지 확대합니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 연속 128바이트는 32바이트 조각 4개에 들어갑니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 32개 작업이 각각 4바이트를 읽으면 유효량은 128바이트입니다. 시작 주소가 128바이트 경계에 맞으면 32바이트씩 4 조각에 걸립니다. 시작 위치가 4바이트 어긋나면 5 조각 160바이트 범위에 걸려 128/160=80%가 유효한 부분입니다.</p>
        <p className="leading-8">각 작업이 원소 하나씩 건너뛰는 간격 2이면 조각 8개, 256바이트 범위입니다. 간격 8이면 조각 32개, 1024바이트 범위입니다. 같은 128바이트를 사용해도 주소가 흩어질수록 요청에 걸리는 조각이 늘어납니다. 아래 계층에서 실제로 읽는 양은 아직 계산하지 않았습니다. 간격 8의 변형에는 최소 249개 원소가 있는 입력이 필요합니다. 64개짜리 원본 배열 밖을 읽으라는 뜻은 아닙니다.</p>
      </div>
      <NumericPath title="32개 작업이 유효 128B를 요청하는 세 가지 주소 배치" steps={[{"label": "연속·정렬", "value": "4×32B"}, {"label": "간격 2", "value": "8×32B"}, {"label": "간격 8", "value": "32×32B"}]} />
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">4·5·8·32는 주소 분포에 따른 요청 조각 수입니다. 왜 이 조각을 따로 세는지 살펴봅니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5 · 같은 요청을 합치고 중간값을 재사용하면 이동을 줄일 수 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
            가까운 주소들을 한 번에 가져오면 전송한 값을 더 많이 씁니다. 여러 계산이 같은 입력을 반복해서 쓸 때는 가까운 공간에 보관하는 것도 도움이 됩니다. 이 두 방법은 주소를
            모으는 일과 재사용을 늘리는 일로 역할이 다릅니다.
          </p>
        <p className="leading-8">이번 64개 덧셈은 각 입력을 한 번만 읽습니다. 별도의 공동 작업 공간에 복사하고 기다리는 절차를 추가해도 원본 읽기가 줄지 않을 수 있습니다. 최적화를 선택할 때는 절약되는 이동량에서 새 복사와 대기 비용을 빼야 합니다.</p>
      </div>
      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이번 예의 재사용이 없다는 조건을 정했습니다. 저장소와 측정 지표의 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="hierarchy" className="scroll-mt-20" />
      <span id="paper-hopper-h100-memory" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · 저장 계층과 주소 공간은 다른 분류입니다</h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table data-role-name-table className="w-full table-fixed text-left text-sm leading-7">
          <caption className="sr-only">앞에서 본 역할에 이름 붙이기</caption>
          <thead className="hidden bg-neutral-50 sm:table-header-group dark:bg-neutral-900"><tr><th scope="col" className="w-[30%] p-3 align-top">앞에서 본 역할</th><th scope="col" className="p-3 align-top">이름과 이 사례에서의 뜻</th></tr></thead>
          <tbody>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">계산값과 명시적으로 공유하는 값</th><td className="block break-words p-3 align-top sm:table-cell">Thread의 계산값은 register에 둡니다. Block이 직접 공유하는 공간은 shared memory입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">최근 데이터의 자동 보관</th><td className="block break-words p-3 align-top sm:table-cell">Cache는 L1·L2처럼 계층 이름을 갖습니다. NVIDIA에서는 L1이 SM 단위이고 L2가 더 넓은 범위의 요청을 받습니다. 정확한 크기와 경로는 GPU 세대에 따릅니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">작업 하나에 속하는 주소</th><td className="block break-words p-3 align-top sm:table-cell">CUDA local memory는 thread 전용 주소 공간입니다. Register에서 넘친 spill이나 동적 배열이 놓일 수 있고 실제 장치 메모리를 cache해서 접근합니다. 이름의 local이 낮은 지연을 보장하지 않습니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">읽기 전용 주소</th><td className="block break-words p-3 align-top sm:table-cell">Constant memory입니다. 한 warp가 같은 주소를 읽으면 broadcast할 수 있지만 서로 다른 주소는 요청이 분리됩니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">돌아오는 시간과 시간당 전송량</th><td className="block break-words p-3 align-top sm:table-cell">한 요청이 돌아오는 시간은 latency이고 시간당 전송량은 bandwidth입니다. 두 값은 단위부터 다릅니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">가까운 주소를 적은 요청으로 묶기</th><td className="block break-words p-3 align-top sm:table-cell">Coalescing입니다. 여기서 쓰는 NVIDIA의 32바이트 요청 조각은 sector입니다. Sector는 HBM의 row나 명령 하나와 같은 개념이 아닙니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">옮긴 양에 비해 얼마나 계산했는가</th><td className="block break-words p-3 align-top sm:table-cell">선택한 메모리 경계의 1바이트당 연산 수가 arithmetic intensity입니다. FLOP은 부동소수점 연산 횟수이며 덧셈 하나를 1로 셉니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">계산과 이동으로 정해지는 상한</th><td className="block break-words p-3 align-top sm:table-cell">이 두 능력으로 성능 상한을 그린 것이 roofline입니다. 다른 dtype나 행렬 전용 명령의 peak를 이번 덧셈에 대입하지 않습니다.</td></tr>
          </tbody>
        </table>
      </div>
      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주소 공간·물리 계층·측정 단위를 분리했습니다. 같은 64개 사례에서 상한을 계산합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
      <span id="transactions" className="scroll-mt-20" />
      <span id="latency-bandwidth" className="scroll-mt-20" />
      <span id="roofline-bound" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 1/12 FLOP/B에 1TB/s를 곱하면 약 83.3GFLOP/s입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">같은 64개 덧셈에서 계산량은 64 FLOP이고 유효 읽기·쓰기는 768바이트입니다. 따라서 연산 강도는 64 FLOP ÷ 768바이트 = 1/12 FLOP/B입니다. 이 유효량이 실제 DRAM 이동량과 같다고 가정하겠습니다.</p><p className="leading-8">대역폭 상한 1TB/s는 초당 10¹²바이트입니다. 여기에 바이트마다 1/12 FLOP를 곱하면 초당 계산 상한은 10¹² byte/s × 1/12 FLOP/byte = 약 83.3GFLOP/s입니다. 계산 상한 1TFLOP/s보다 낮으므로 이상적인 정상 상태에서는 이동이 먼저 제한합니다.</p>
        <p className="leading-8">같은 계산을 시간으로 보면 64÷10¹² =0.064ns의 계산 물량과 768÷10¹² =0.768ns의 이동 물량을 비교합니다. 더 큰 0.768ns는 포화된 장치의 처리량 모델입니다. 64개만 제출한 실제 kernel이 그 시간에 완료된다는 예측은 아닙니다. 요청 시작과 메모리 응답을 기다리는 시간이 남습니다.</p>
        <p className="leading-8">
            계산 상한과 이동 상한이 만나는 점은 1TFLOP/s÷1TB/s =1FLOP/B입니다. 이를 ridge point라고 부릅니다. 같은 경계의 실제 byte가 늘면 연산 강도는
            왼쪽으로 이동합니다. Cache 재사용으로 HBM byte가 줄면 HBM 기준의 연산 강도는 오른쪽으로 이동할 수 있습니다.
          </p>
        <p className="leading-8">한 요청의 평균 왕복 시간을 500ns로 가정합니다. 1TB/s를 지속하려면 평균 500000바이트, 즉 500KB가 처리 중이어야 합니다. 처리량 × 평균 대기 시간으로 구한 평균 진행 중 데이터량입니다. 64개 예의 768바이트만으로는 이 정상 상태를 채울 수 없습니다. 독립 요청을 늘리지 못하면 지연이 성능을 제한합니다.</p>
        <p className="leading-8">실측 유효 768바이트를 1μs에 처리했다면 유효 대역폭은 0.768GB/s입니다(시간 가정). 이것은 유효 요청 기준입니다. DRAM counter가 읽기와 쓰기에 다른 byte를 보고하면 그 값을 같은 구간 시간으로 나눈 물리 대역폭을 별도로 표시해야 합니다.</p>
      </div>
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">83.3GFLOP/s 상한과 64개 작업의 실제 완료 시간을 구별했습니다. 공식 문서의 바이트 정의에 대입합니다.</p>
    <RooflineArithmeticViz mode="intensity" />
</section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="paper-cuda-best-practices-memory" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 대역폭 식의 읽기와 쓰기에 512와 256을 넣습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">CUDA Best Practices Guide 13.0.2의 Effective Bandwidth Calculation은 읽은 바이트와 쓴 바이트를 더한 뒤 시간으로 나눕니다. 이 글에서는 유효 읽기 512와 쓰기 256을 넣습니다. 1μs라면 768/10⁻⁶=768000000B/s, 즉 0.768GB/s입니다.</p>
        <p className="leading-8">문서의 coalesced access 설명은 compute capability 6.0 이상을 다룹니다. 이 범위에서는 warp 요청을 32바이트 transaction 단위로 합칩니다. 앞의 연속 128바이트는 4개, 4바이트 어긋난 경우 5개에 걸립니다. Cache에서 재사용되는 조각이 있으면 HBM까지 추가 읽기가 내려가지 않을 수 있습니다.</p>
        <p className="leading-8">요청 범위에서 32 sectors는 4 sectors의 8배입니다. 이 계산으로 HBM 전송량과 한 load의 latency가 모두 8배라고 결론 내릴 수는 없습니다. 병합과 cache, 다른 요청과의 겹침을 확인해야 합니다.</p>
      </div>
      <SourceApplication source="CUDA Best Practices13.0.2 ·Effective Bandwidth Calculation" excerpt="effective bandwidth" application="(512B +256B)/1μs =0.768GB/s. 유효 바이트 기준 값과 DRAM counter 기준 값을 섞지 않습니다." /><CitationBlock source="CUDA Best Practices13.0.2 ·Effective Bandwidth Calculation" citeKey={1} href="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html">CUDA Best Practices13.0.2 ·Effective Bandwidth Calculation</CitationBlock>
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">바이트 식과 sector 규칙을 각자의 관측 위치에 두었습니다. 실제 코드가 내는 읽기·쓰기를 다시 확인합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
      <span id="paper-roofline-williams" className="scroll-mt-20" />
      <span id="paper-nsight-compute-roofline" className="scroll-mt-20" />
      <span id="evidence" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">9 · 실제 코드의 한 덧셈과 분석 도구의 여러 자원을 대조합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">고정 vectorAdd 소스의 C[i]=A[i]+B[i]+0.0f는 입력 둘과 출력 하나를 보여 줍니다. Compiler가 불필요한 0.0f를 제거한 일반 덧셈 경로를 가정하면 64개는 64FLOP입니다. 특정 빌드의 실제 명령은 SASS로 확인합니다. 소스에 한 줄이라는 이유로 memory 명령도 하나라고 세지 않습니다.</p>
        <p className="leading-8">계산 상한에 가까운지 보려면 실제로 사용한 실행 pipe의 throughput과 명령 구성을 확인합니다. Scalar FP32 덧셈에 FP16 Tensor peak를 대입하면 다른 계산기의 능력을 비교하게 됩니다. 어느 pipe가 80%를 넘었다는 임의 문턱만으로 compute-bound를 확정하지 않습니다.</p>
        <p className="leading-8">DRAM throughput이 높다고 놓습니다. Byte를 줄였을 때 시간도 줄면 메모리 대역폭이 병목이라는 증거가 쌓입니다. DRAM과 계산 pipe가 둘 다 낮다면 ready warp 부족이나 직렬 의존, 작은 grid, launch 사이 공백을 더 확인합니다. Profiler의 eligible warp는 실행 가능한 warp를 보는 지표입니다. 한 counter가 모든 원인을 대표하지는 않습니다.</p>
        <p className="leading-8">Roofline 원논문 3절은 cache를 거친 뒤 DRAM과 오간 바이트당 연산 수를 operational intensity라고 정의합니다. 본문의 1/12 FLOP/B를 그 식에 넣으려면 실제 DRAM 전송량도 768바이트라는 가정이 필요합니다. 원문의 대역폭도 메모리 핀의 명목 수치가 아니라 지속 가능한 전송량을 기준으로 합니다.</p>
        <p className="leading-8">실제 측정점이 선 아래에 있다는 사실만으로 어느 동기화나 주소 의존이 원인인지는 설명하지 않습니다. <Link to="/cs/gpu/sm-warp-scheduling-and-issue#issue-scoreboard">SM의 준비된 명령과 scoreboard</Link>가 그다음 질문을 다룹니다.</p>
      </div>
      <CodeViewButton label="vectorAdd의 실제 읽기 2회·쓰기 1회" onClick={() => sidebar.open("cuda-kernel", codeRefs["cuda-kernel"])} /><SourceApplication source="NVIDIA vectorAdd · 3f1c509 · 52행" excerpt="C[i] = A[i] + B[i] + 0.0f;" application="Compiler가 추가 0.0f를 제거한 64개 덧셈 모델에서 64FLOP·유효 768B입니다. Tensor 행렬 peak를 이 scalar 계산 상한으로 쓰지 않습니다." /><CitationBlock source="NVIDIA vectorAdd · 3f1c509 · 52행" citeKey={2} href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu">NVIDIA vectorAdd · 3f1c509 · 52행</CitationBlock><CitationBlock source="Williams 외 ·Roofline(2009)" citeKey={3} href="https://escholarship.org/uc/item/78h8v7mr">연산 강도와 대역폭·계산 상한을 결합하는 모델. 실제 병목 원인의 완전한 진단은 아닙니다.</CitationBlock><CitationBlock source="NVIDIA Nsight Compute ·2026-10-04 확인 ·Profiling Guide" citeKey={4} href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html">메모리 계층·실행 pipe·scheduler counter의 정의를 함께 확인합니다.</CitationBlock>
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">상한과 counter를 같은 연산 종류에 맞췄습니다. 서로 다른 병목을 개선하는 방법을 마지막으로 나눕니다.</p>
    <RooflineArithmeticViz mode="boundary" />
</section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <span id="latency-launch-bound" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">10 · 상한에 못 미치는 이유에 따라 다음 실험을 고릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">작은 kernel 1000개를 순차 제출하고 각각의 추가 launch 비용이 4μs라면 시작 비용만 4ms입니다(가정). 이 경우 요청 byte를 조금 줄이는 것보다 launch 수를 줄이는 실험이 유용할 수 있습니다. 다만 fusion은 register와 shared memory를 늘릴 수 있습니다. Spill이나 상주 자원 감소도 생길 수 있으므로 전체 시간을 다시 잽니다.</p>
        <p className="leading-8">다음 주소가 이전 읽기 값에 달려 있으면 넓은 메모리 통로도 놀 수 있습니다. 이때 독립 작업을 늘리거나 의존 경로를 바꾸는 실험을 합니다. 반대로 이미 대역폭을 채웠다면 작업 수를 더 늘리는 것만으로 바이트당 시간이 줄지 않습니다.</p>
        <p className="leading-8">H100 같은 제품의 실제 수치를 쓸 때는 SKU·clock·dtype·sparsity와 문서 버전을 같이 기록합니다. 이 글의 1TFLOP/s와 1TB/s는 서로 맞춘 가정이며 제품 벤치마크가 아닙니다. 물리 HBM의 층·channel·행 동작은 <Link to="/cs/gpu/hbm-stack-and-memory-requests#mechanism">메모리 제어기 뒤의 경로</Link>에서 이어집니다.</p>
      </div>
      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 64개 사례로 요청 효율·처리량 상한·지연과 launch 비용을 구별했습니다.</p>
    </section>
    <ReviewPrompts questions={["유효 768B를 1μs에 처리하면 대역폭은 얼마입니까? (답: 7·8절)", "32 sectors라는 수치만으로 HBM 거래량과 지연 시간이 8배라고 말할 수 있습니까? (답: 8절)", "scalar 덧셈에 Tensor FP16 최대 처리량을 넣으면 왜 잘못됩니까? (답: 9절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ cuda: { id: "cuda", label: "NVIDIA cuda-samples · v13.0", badgeClass: "bg-sky-50 border-sky-300 text-sky-800" }, hip: { id: "hip", label: "ROCm HIP-Examples · pinned source", badgeClass: "bg-amber-50 border-amber-300 text-amber-800" } }} />
  </div>;
}

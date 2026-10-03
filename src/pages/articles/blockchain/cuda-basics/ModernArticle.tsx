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
      <h2 className="mb-6 text-2xl font-bold">1 · 배열의 한 칸을 더할 때 실제로 무엇이 움직일까요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">화면에 적은 덧셈 한 줄이 빨라지려면 일을 나누는 비용보다 동시에 처리해서 아끼는 시간이 커야 합니다. 계산하는 칩이 아무리 빨라도 입력을 보내고 답을 기다리는 시간이 길면 작은 작업은 늦어집니다.</p>
        <p className="leading-8">이 글에서는 같은 크기의 두 배열을 더하는 작업 하나를 끝까지 따라갑니다. 번호를 나누는 규칙에서 시작해 실제 명령과 저장 공간에 도달한 뒤, 어느 시간을 측정해야 하는지 판단합니다.</p>
      </div>
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">질문은 덧셈 속도에서 전체 완료 시간으로 넓어졌습니다. 먼저 일을 보내고 돌려받는 흐름을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 준비하고 보내고 기다린 뒤 결과를 받습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">주 프로그램은 입력 두 개와 결과를 담을 자리를 준비합니다. 계산할 장치에 입력을 보내고 같은 동작을 여러 번호에 적용하라고 요청합니다. 장치는 번호마다 답을 쓴 뒤 완료를 알립니다.</p>
        <p className="leading-8">요청을 제출했다는 응답과 답이 준비됐다는 응답은 다른 사건입니다. 결과를 확인하는 쪽은 계산 완료 이후의 데이터를 읽어야 합니다.</p>
      </div>
      <NumericPath title="한 번의 요청이 돌아오는 길" steps={[{"label": "입력 준비", "value": "두 배열"}, {"label": "계산 요청", "value": "각 칸 더하기"}, {"label": "완료 확인", "value": "결과 회수"}]} />
      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">제출과 완료를 나눴습니다. 이제 번호와 데이터 크기를 고정합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 64 칸을 더하면 입력 512바이트와 출력 256바이트가 필요합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">원소 64개짜리 배열 두 개를 더한다고 놓습니다(가정). 원소 하나는 4바이트이고 결과도 64개입니다. 두 입력의 크기는 64×4×2 =512 바이트, 출력은 64×4 =256 바이트입니다. 유효 데이터의 읽기와 쓰기를 합하면 768바이트이고 덧셈은 64번입니다.</p>
        <p className="leading-8">64개 작업을 한 묶음으로 제출합니다. 배열 번호는 0부터 63까지입니다. 37번 작업은 첫 배열 37번과 둘째 배열 37번을 읽어 결과 37번을 씁니다. 이 예는 경로를 눈으로 따라가기 위한 크기이며 장치를 충분히 바쁘게 하는 성능 시험은 아닙니다.</p>
      </div>
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">64개·768바이트를 이후 절에서도 그대로 사용합니다. 번호가 주소로 바뀌는 곳을 펼칩니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 37번은 시작 위치에서 148바이트 떨어져 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">4바이트 원소의 37번을 찾으려면 배열 시작 위치에 37×4 =148바이트를 더합니다. 같은 규칙으로 이웃 작업 38번은 152바이트, 39번은 156바이트를 읽습니다. 번호가 이어지면 필요한 주소도 이어집니다.</p>
        <p className="leading-8">장치 안에서는 여러 작업이 같은 동작을 함께 진행합니다. 각 작업이 다른 번호를 갖더라도 읽기 명령의 종류는 같습니다. 주소들을 한꺼번에 모으면 가까운 데이터를 묶어서 가져올 수 있습니다.</p>
      </div>
      <NumericPath title="37번 작업의 데이터 경로" steps={[{"label": "배열 번호", "value": "37"}, {"label": "원소 크기 곱하기", "value": "37×4=148B"}, {"label": "결과 위치", "value": "C+148B"}]} />
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">번호와 실제 위치의 연결을 얻었습니다. 일을 묶는 이유는 주소와 명령을 함께 처리하기 위해서입니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5 · 저장 공간을 여러 겹 두는 이유는 기다림을 줄이기 위해서입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">계산 직전의 작은 값은 연산기 가까이에 있어야 합니다. 모든 값을 가장 가까운 곳에 둘 수는 없어서, 곧 다시 쓸 값과 큰 원본을 다른 곳에 둡니다. 가까운 곳에서 찾으면 먼 곳까지 기다릴 필요가 없습니다.</p>
        <p className="leading-8">여러 작업이 같은 입력을 반복해서 쓸 때는 중간 공간에 한 번 받아 함께 쓰는 편이 유리할 수 있습니다. 이번 덧셈은 각 입력을 한 번씩만 읽습니다. 중간 복사와 서로 기다리는 절차를 추가해도 줄어드는 읽기가 없어 오히려 비용이 늘 수 있습니다.</p>
      </div>
      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이번 64개 덧셈에는 공동 재사용이 없다는 점을 확인했습니다. 이제 역할마다 쓰는 이름을 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="memory-model" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · 작업 번호와 실제 실행 묶음은 다른 층에 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">요청을 보내는 주 프로그램 쪽을 host, 계산 장치를 device라고 부릅니다. 장치에서 실행할 함수가 kernel입니다. CUDA는 NVIDIA 장치에 이런 함수를 제출하는 프로그램 모델과 도구를 제공합니다.</p>
        <p className="leading-8">각 번호의 논리적 작업이 thread입니다. 협력하는 thread 묶음이 block이고 한 번 제출한 block 전체가 grid입니다. 사례는 grid 1개 안에 block 1개, 그 안에 thread 64개를 둡니다.</p>
        <p className="leading-8">NVIDIA가 명령을 함께 진행시키는 32개 thread 묶음은 warp입니다. 따라서 thread 64개가 들어 있는 block 하나는 warp 2개로 나뉩니다. 이들을 배치하고 명령을 발행하는 칩 내부 처리 구역이 SM입니다. Thread 하나가 물리 연산기 하나에 영구 고정되는 구조는 아닙니다. Warp 안에서 각 thread의 위치를 lane 번호라고 하며 0부터 31까지 셉니다.</p>
        <p className="leading-8">각 thread가 계산 중인 값을 붙잡는 작은 저장소는 register입니다. Block이 명시적으로 공유하는 공간은 shared memory입니다. 자동으로 최근 데이터를 보관하는 cache와 프로그램이 직접 채우는 shared memory는 책임이 다릅니다.</p>
        <p className="leading-8">큰 배열의 저장 공간을 global memory라고 부릅니다. 데이터센터 GPU에서는 그 저장 장치로 HBM을 쓰기도 합니다. Global은 프로그램의 주소 공간이고 HBM은 물리 메모리 제품입니다. 모든 CUDA GPU가 HBM을 쓰는 것은 아닙니다.</p>
      </div>
      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이름은 실행 범위와 저장 책임에 붙었습니다. 37번 thread의 요청을 실제로 추적합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="execution-path" className="scroll-mt-20" />
      <span id="indexing" className="scroll-mt-20" />
      <span id="memory" className="scroll-mt-20" />
      <span id="paper-cuda-best-practices" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 37번 thread가 읽고 더하고 쓸 때 두 종류의 경로를 지납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Host는 두 입력 512바이트를 device에 복사하고 block 1개 × 64 threads를 제출합니다. Block은 실행 자원에 여유가 있는 SM에 배치되며 32개씩 warp 2개로 진행합니다. 37번은 두 번째 warp의 lane 5입니다. Block 내부 번호 32 + 5 = 37을 주소 계산에 씁니다.</p>
        <p className="leading-8">Load 명령은 각 lane의 주소를 모아 memory 요청을 만듭니다. Cache에서 찾지 못한 요청이 아래 계층으로 내려갑니다. 데이터가 돌아오면 register에 놓이고 덧셈 명령이 결과를 만든 뒤 store 명령이 C의 148바이트 위치에 씁니다. 요청·계산·저장은 서로 다른 명령이며 C++ 한 줄과 기계 명령 한 개가 대응하지 않습니다.</p>
        <p className="leading-8">첫 warp의 입력 한 개는 32×4 = 128바이트입니다. 시작 주소가 128바이트 경계에 맞고 현대 NVIDIA의 32바이트 sector 규칙을 적용하면 4 sectors에 걸칩니다. 두 warps의 두 입력은 총 16 sectors, 출력은 8 sectors에 걸쳐 유효 768바이트를 다룹니다. 이것은 요청의 주소 범위 계산입니다. Cache 적중과 쓰기 정책이 개입하므로 곧바로 HBM 실측 768바이트라고 부르지 않습니다.</p>
        <p className="leading-8">Compiler는 register 수를 배정합니다. 값이 많아 register에서 넘치면 thread 전용 주소 공간인 local memory로 일부를 보낼 수 있습니다. 이것이 spill이며 cache를 거쳐 장치 메모리를 사용할 수 있습니다. 반대로 shared memory에 올린다고 자동으로 register 부족이 해결되지는 않습니다.</p>
        <p className="leading-8">계산이 끝난 뒤 host가 결과 256바이트를 회수합니다. 예를 들어 H2D 0.3ms, kernel 0.1ms, D2H 0.2ms, 추가 완료 대기 0.1ms라면 겹치지 않는 전체 시간은 0.7ms입니다(시간은 가정). CPU가 0.5ms에 끝냈다면 kernel만 0.1ms라는 이유로 GPU를 채택할 수 없습니다. 구간이 겹치면 합이 아니라 실제 완료 경로의 시간을 잽니다.</p>
      </div>
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">37번의 주소와 64개 전체의 이동량이 이어졌습니다. 실제 CUDA 샘플에서 같은 계산을 확인합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="paper-cuda-samples" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 vectorAdd의 49번째 줄이 37을 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">NVIDIA cuda-samples v13.0의 고정 commit 3f1c509…에서 vectorAdd 함수는 blockDim.x×blockIdx.x + threadIdx.x를 계산합니다. 사례를 넣으면 64×0 + 37 = 37입니다. 다음 if는 37이 원소 수 64보다 작은지 확인한 뒤 두 입력을 더합니다.</p>
        <p className="leading-8">원본 샘플은 원소 50000개와 다른 launch 설정을 사용합니다. 64개·64 threads는 함수 규칙에 넣은 학습용 값입니다. 원본의 기본 설정은 아닙니다. 사이드바에는 저작권과 license를 포함한 파일 원문을 그대로 보관했습니다.</p>
        <p className="leading-8">원본 host 부분은 메모리를 할당하고 복사한 뒤 launch합니다. 추가 0.0f가 남아 있는 C++식도 최적화에 따라 다른 기계 명령이 될 수 있습니다. 실제 명령을 확인할 때는 compile target과 compiler 옵션을 고정하고 <Link to="/cs/gpu/cuda-compilation-and-isa-analysis#isa-analysis">PTX와 SASS 대조</Link>를 이용합니다.</p>
      </div>
      <CodeViewButton label="vectorAdd.cu ·47 –54 행" onClick={() => sidebar.open("cuda-kernel", codeRefs["cuda-kernel"])} /><CodeViewButton label="vectorAdd.cu ·host launch" onClick={() => sidebar.open("cuda-launch", codeRefs["cuda-launch"])} /><SourceApplication source="NVIDIA cuda-samples v13.0 ·3f1c509 ·49–52행" excerpt="int i = blockDim.x * blockIdx.x + threadIdx.x;" application="64×0 + 37 = 37. i<64를 통과한 thread만 C[37]을 씁니다." /><CitationBlock source="NVIDIA cuda-samples v13.0 ·3f1c509 ·49–52행" citeKey={1} href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu">NVIDIA cuda-samples v13.0 ·3f1c509 ·49 –52 행</CitationBlock>
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문을 64개 사례의 숫자에 대입했습니다. 다음에는 세대가 달라도 유지되는 규칙과 바뀌는 기능을 나눕니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <span id="paper-cuda-programming-guide" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">9 · 32개 묶음 규칙과 최신 행렬 명령의 지원 범위를 구분합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">CUDA C++ Programming Guide 13.0.2의 SIMT 설명은 warp가 32 threads로 구성된다고 정합니다. 사례 64개는 warp 2개입니다. Blackwell은 제품군 이름입니다. 그 이름 때문에 64개 덧셈이 자동으로 행렬 연산으로 바뀌지는 않습니다.</p>
        <p className="leading-8">Hopper의 TMA는 큰 다차원 데이터 조각을 shared memory로 옮기는 요청을 줄이고, WGMMA는 128threads가 협력하는 행렬 명령 경로를 제공합니다. 둘은 역할이 다릅니다. 비동기 복사를 제출했다는 것만으로 읽어도 되는 상태는 아니며 완료 barrier 와 버퍼 재사용 순서를 맞춰야 합니다. <Link to="/cs/gpu/warp-specialization-and-async-pipelines#mbarrier-handshake">실제 producer·consumer 경로</Link>에서 이어집니다.</p>
        <p className="leading-8">Blackwell의 tcgen05 계열과 TMEM은 특정 지원 target의 행렬 누산 경로입니다. TMEM은 전용 칩 내부 저장소이고 TMA는 복사 장치이므로 같은 말이 아닙니다. Data center Blackwell의 compute capability 10.x와 GeForce 계열 12.x에 동일 명령을 가정하지 않습니다. <Link to="/cs/ai/sionic-glm-b300#kernel">tcgen05와 TMEM 정본</Link> 및 고정 PTX ISA 9.0의 target notes에서 명령별 지원 target을 확인합니다.</p>
        <p className="leading-8">이 글의 수치 경로는 CUDA 13.0.2 문서를 기준으로 고정했습니다. AMD의 64개 실행 묶음과 HIP 이식은 <Link to="/cs/gpu/amd-gpu-execution-and-hip#mechanism">같은 64개 배열을 AMD에서 실행하기</Link>로 넘어갑니다. 제품 공개·출하·compiler 지원은 각각 따로 확인할 상태입니다.</p>
      </div>
      <SourceApplication source="CUDA C++ Programming Guide 13.0.2 ·SIMT architecture" excerpt="groups of 32 parallel threads called warps" application="64 threads를 32개씩 묶으면 2warps입니다. 이는 물리 연산기 64개가 동시에 전용 배정된다는 뜻이 아닙니다." /><CitationBlock source="CUDA C++ Programming Guide 13.0.2 ·SIMT architecture" citeKey={2} href="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html">CUDA C++ Programming Guide 13.0.2 ·SIMT architecture</CitationBlock><CitationBlock source="NVIDIA Blackwell Tuning Guide 13.0.2" citeKey={3} href="https://docs.nvidia.com/cuda/archive/13.0.2/blackwell-tuning-guide/index.html">Data center Blackwell과 compute capability별 자원·지원 조건을 확인합니다.</CitationBlock>
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공통 규칙과 세대별 명령을 구별했습니다. 마지막으로 이 작은 예로 판단할 수 없는 성능을 정리합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <span id="workload-fit" className="scroll-mt-20" />
      <span id="blockchain-gpu" className="scroll-mt-20" />
      <span id="release-gate" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">10 · 64개가 맞게 계산됐다는 사실로 큰 작업의 속도를 예측할 수는 없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">64개는 한 block이므로 GPU 전체를 채우지 못합니다. 많은 SM을 바쁘게 하려면 충분한 block이 필요합니다. 데이터 규모가 작을수록 launch와 복사가 계산보다 커질 수 있습니다. 입력이 이미 device에 있다고 놓습니다. 다음 계산도 그 결과를 쓴다면 매 단계 host 왕복을 생략할 수 있습니다.</p>
        <p className="leading-8">독립 hash 후보나 서명 여러 개는 번호를 나누기 쉽습니다. 한 결과가 다음 입력인 긴 직렬 사슬은 같은 방법으로 나눌 수 없습니다. 분야 이름보다 의존 관계와 재사용량을 먼저 봅니다. Thread끼리 shared memory로 값을 주고받는 경우도 있습니다. 이때는 필요한 모든thread가 같은 규칙으로barrier를 통과해야 합니다.</p>
        <p className="leading-8">먼저 CPU 기준 결과와 비교하고 길이 63·64·65에서 경계 검사를 확인합니다. 이후 같은 GPU·driver·Toolkit·옵션을 기록하고 준비 운동 뒤 device event로 kernel을 잽니다. Host가 완료를 확인하는 전체 시간도 따로 잽니다. 이번 환경에는 CUDA 장치가 없어 실행 성능을 측정하지 않았습니다. 64개 주소와 바이트 계산만 검산했습니다.</p>
      </div>
      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이제 한 줄의 덧셈을 실행 경로와 측정 경계로 나누어 설명할 수 있습니다.</p>
    </section>
    <ReviewPrompts questions={["37번 thread는 어느 warp의 몇 번째 lane입니까? (답: 7절)", "kernel이 0.1ms인데 전체가 0.7ms라면 CPU의 0.5ms보다 빠릅니까? (답: 7절)", "64개 덧셈에 TMA·TMEM을 추가하면 항상 빨라질까요? (답: 9·10절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ cuda: { id: "cuda", label: "NVIDIA cuda-samples · v13.0", badgeClass: "bg-sky-50 border-sky-300 text-sky-800" }, hip: { id: "hip", label: "ROCm HIP-Examples · pinned source", badgeClass: "bg-amber-50 border-amber-300 text-amber-800" } }} />
  </div>;
}

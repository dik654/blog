import type { CodeRef } from "@/components/code/types";
import ThreadAssignmentViz from "./viz/ThreadAssignmentViz";
import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs as baseCodeRefs, fileTrees } from "@/pages/articles/gpu/gpu-execution-sources/codeRefs";
const layoutCode = "// N개의 원소, block당 B threads\nint B = 256;\nint G = (N + B - 1) / B;\nkernel<<<G, B>>>(data, N);\n\n// kernel 안에서 현재 위치와 launch shape를 읽는다.\nthreadIdx.x;  // block 안 thread 좌표\nblockIdx.x;   // grid 안 block 좌표\nblockDim.x;   // block의 x 크기\ngridDim.x;    // grid의 x 크기\n\n// device마다 resource limit이 다르므로 query한다.\ncudaDeviceProp prop{};\ncudaGetDeviceProperties(&prop, 0);\nprintf(\"maxThreadsPerBlock=%d\\n\", prop.maxThreadsPerBlock);";
const vecAddCode = "__global__ void vecAdd(const float* a, const float* b,\n                       float* c, size_t n) {\n  size_t i = static_cast<size_t>(blockIdx.x) * blockDim.x + threadIdx.x;\n  if (i < n) c[i] = a[i] + b[i];\n}\n\nint block = 256;\nint grid = static_cast<int>((n + block - 1) / block);\nvecAdd<<<grid, block>>>(d_a, d_b, d_c, n);\n\n// Launch error와 비동기 실행 error를 분리해 확인한다.\ncudaError_t launchStatus = cudaGetLastError();\ncudaError_t executionStatus = cudaDeviceSynchronize();";
const imageCode = "__global__ void brighten(float* image, int width, int height) {\n  int col = blockIdx.x * blockDim.x + threadIdx.x;\n  int row = blockIdx.y * blockDim.y + threadIdx.y;\n  if (row < height && col < width) {\n    size_t offset = static_cast<size_t>(row) * width + col;\n    image[offset] = fminf(image[offset] + 0.1f, 1.0f);\n  }\n}\n\ndim3 block(32, 8); // 256 threads; x축 인접 lane이 인접 pixel을 읽는다.\ndim3 grid((width + block.x - 1) / block.x,\n          (height + block.y - 1) / block.y);\nbrighten<<<grid, block>>>(d_image, width, height);";


const codeRefs: Record<string, CodeRef> = {
  ...baseCodeRefs,
  "cuda-kernel": { ...baseCodeRefs["cuda-kernel"], desc: "NVIDIA cuda-samples v13.0 · 3f1c50965017932fc81e6d94a3fc9e04c105b312. 원본 기본 길이는 50000입니다. 이 글은 함수 규칙에 길이 10·block 크기 4를 대입합니다.", annotations: [{lines:[49,49] as [number,number],color:"sky",note:"4×2+1=9: 앞선 두 block의 길이 8에 내부 위치 1을 더합니다."},{lines:[51,52] as [number,number],color:"emerald",note:"9<10은 참, 내부 위치 2의 i=10은 거짓입니다. A[9]=9, B[9]=90일 때 C[9]=99입니다."}] },
  "cuda-launch": { ...baseCodeRefs["cuda-launch"], desc: "원본은 길이 50000·block당 256 threads이며 올림한 block 수를 제출합니다. 본문의 길이 10·크기 4는 원본 launch 기본값이 아닌 학습 가정입니다." }
};

export default function Article(){const sidebar=useCodeSidebar();return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1. 작업을 맡길 자리를 만드는 일과 실제 계산기를 배정하는 일은 다릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">배열을 한 칸씩 더하는 일을 여러 작업으로 나누려면 각 작업이 읽을 위치를 알아야 합니다. 같은 칸을 두 번 쓰거나 마지막 칸을 빠뜨리지 않는 것이 출발점입니다.</p>
        <p className="leading-8">
            이 글에서는 열 칸의 덧셈을 네 자리씩 나눕니다. 만들어진 자리에서 실제 데이터가 없는 자리를 제외하고, 이 작업표가 칩 안에서 어떻게 실행되는지 따라갑니다.
          </p>
      </div>

    </section>
    <section id="outside" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2. 주 프로그램은 작업표를 보내고 장치가 답을 기록합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">주 프로그램은 입력 두 배열과 결과를 담을 공간을 준비합니다. 장치에는 할 일, 묶음 수, 묶음마다 만들 자리 수를 보냅니다. 장치는 자리가 가리키는 입력을 읽고 답을 씁니다.</p>
        <p className="leading-8">
            작업을 제출했다고 모든 계산이 끝난 것은 아닙니다. 결과를 사용하는 쪽은 완료를 확인합니다. 여기서는 먼저 자리 번호와 배열 위치가 맞는지 확인합니다.
          </p>
      </div>
<NumericPath title="요청 하나의 경계" steps={[{label:"준비",value:"입력 두 배열"},{label:"제출",value:"묶음과 자리 수"},{label:"완료 확인",value:"결과 배열"}]} />
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3. 열 칸을 네 자리씩 맡기면 열두 자리가 생깁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
            두 배열에 각각 열 개의 값이 있다고 놓습니다(가정). 첫 입력의 9번 값은 9, 둘째 입력의 9번 값은 90입니다. 결과 9번에 쓸 값은 99입니다. 번호는 0부터 9까지이며
            원소 하나는 4바이트입니다.
          </p>
        <p className="leading-8">한 묶음에 네 자리를 만들면 두 묶음으로는 여덟 칸만 덮습니다. 세 묶음을 만들어야 열 칸을 모두 맡길 수 있습니다. 만들어진 자리는 열두 개이고, 마지막 두 자리는 읽을 데이터가 없습니다.</p>
      </div>

    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4. 묶음 번호에 네 칸을 곱한 뒤 그 안의 번호를 더합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 묶음 번호는 0입니다. 이 묶음은 배열 0–3번을 맡습니다. 묶음 1은 4–7번을, 묶음 2는 8–11번을 후보로 만듭니다. 각 묶음 안의 번호는 다시 0부터 시작합니다.</p>
        <p className="leading-8">원하는 9번을 맡은 자리는 묶음 2의 내부 번호 1입니다. 앞선 두 묶음의 길이 2×4에 내부 번호 1을 더하면 9입니다. 10번과 11번 후보는 배열 길이보다 크거나 같으므로 읽거나 쓰지 않습니다.</p>
      </div>
<ThreadAssignmentViz /><NumericPath title="같은 9번을 찾는 길" steps={[{label:"앞선 묶음",value:"2 × 4 = 8칸"},{label:"묶음 안 위치",value:"8 + 1 = 9번"},{label:"두 입력 더하기",value:"9 + 90 = 99"}]} />
    </section>
    <section id="why" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5. 고정된 크기로 나누면 장치가 남은 자원에 맞춰 배치할 수 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
            모든 일을 하나의 거대한 묶음으로 만들면 함께 쓸 공간과 동시에 기다리는 작업 범위도 커집니다. 적당한 묶음 여러 개로 나누면 장치가 자원에 여유가 생길 때마다 다음 묶음을
            실행할 수 있습니다.
          </p>
        <p className="leading-8">대신 묶음끼리 어느 순서로 실행될지는 가정하지 않습니다. 이번 덧셈은 각자 다른 결과 칸을 쓰므로 서로의 완료 순서를 기다릴 필요가 없습니다. 한 묶음 안에서 값을 주고받는 작업은 따로 동기화해야 합니다.</p>
      </div>

    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6. 작업표와 실행 장치의 역할에 이름을 붙입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
      </div>
<div className="my-6 overflow-x-auto rounded-xl border"><table className="w-full table-fixed text-left text-sm leading-7"><caption className="sr-only">작업표와 실행 장치의 역할</caption><thead className="hidden sm:table-header-group"><tr><th className="w-[30%] p-3">앞에서 본 역할</th><th className="p-3">이름과 사례</th></tr></thead><tbody><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">배열 위치를 맡는 자리</th><td className="block break-words p-3 align-top sm:table-cell">논리적 작업 하나가 thread입니다. 이번에는 열두 thread를 만들고 열 개만 배열에 접근합니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">
            함께 배치되어 협력하는 묶음
          </th><td className="block break-words p-3 align-top sm:table-cell">Thread block, 줄여서 block입니다. 같은 block의 thread는 shared memory라는 공동 공간과 block barrier라는 대기 지점을 사용할 수 있습니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">한 번 제출한 작업표 전체</th><td className="block break-words p-3 align-top sm:table-cell">Grid입니다. 이번 grid는 block 3개이며 각 block은 thread 4개입니다. 장치에서 실행하는 함수는 kernel입니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">명령을 함께 진행하는 실행 묶음</th><td className="block break-words p-3 align-top sm:table-cell">NVIDIA의 warp는 같은 block 안의 thread를 32개 단위로 묶습니다. Warp 안의 위치를 lane이라고 합니다. 같은 명령을 여러 thread에 적용하는 실행 방식을 SIMT라고 부릅니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">묶음을 실제로 실행하는 처리 구역</th><td className="block break-words p-3 align-top sm:table-cell">SM입니다. Block을 실행할 자원에 여유가 있는 SM에 배치하는 주체는 장치의 scheduler입니다. Thread가 물리 연산기 하나에 영구 고정되는 구조는 아닙니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">좌표와 크기를 읽는 이름</th><td className="block break-words p-3 align-top sm:table-cell">threadIdx는 block 안 좌표, blockIdx는 grid 안 block 좌표입니다. blockDim은 block의 크기, gridDim은 grid의 크기입니다. 뒤의 x·y·z는 각 축을 고릅니다.</td></tr><tr className="block border-t sm:table-row"><th scope="row" className="block px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">계산 중인 값과 자원 점유</th><td className="block break-words p-3 align-top sm:table-cell">계산 중인 값은 register를 사용합니다. 필요한 값이 많으면 컴파일러가 일부를 local memory로 내보낼 수 있습니다. SM에 머무는 block을 resident block이라고 하며 register·shared memory·thread 수 등의 한도를 함께 만족해야 합니다.</td></tr></tbody></table></div>
    </section>
    <section id="trace" data-teach-level="4" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7. 묶음 2의 thread 1은 9번을 계산하고 10번·11번은 멈춥니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">주 프로그램이 block 3개와 block당 thread 4개를 제출합니다. 어느 SM에 block 2가 배치되든 blockIdx.x는 2이고 blockDim.x는 4입니다. Thread 1은 2×4+1=9를 계산합니다.</p>
        <p className="leading-8">9는 배열 길이 10보다 작으므로 두 입력의 9번 값을 읽습니다. 시작 주소에서 9×4=36바이트 떨어진 위치입니다. 9와 90을 더한 99를 결과 배열 9번에 씁니다. 내부 번호 2와 3은 각각 10과 11을 만들므로 배열 접근을 건너뜁니다.</p>
        <p className="leading-8">Warp는 block 경계를 넘어서 합치지 않습니다. 따라서 thread 4개짜리 block 세 개는 각각 부분 warp 하나씩, 총 warp 3개로 실행됩니다. 전체 thread가 12개라는 이유로 warp 하나에 합쳐지지 않습니다. 작은 수는 위치를 설명하기 위한 가정이며 성능에 좋은 설정이라는 뜻은 아닙니다.</p>
      </div>

    </section>
    <section id="builtin-vars" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8. 작업 수를 올림하고 내장 변수로 같은 작업표를 읽습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">한 번의 launch에서 blockDim은 모든 block에 같은 크기를 줍니다. 10개 사례의 gridDim.x는 3, blockDim.x는 4입니다. 이 수치는 물리 core를 몇 개 켜는지 지정하는 값이 아닙니다.</p>
        <p className="leading-8">다음 식은 빈자리를 포함해 원소를 덮는 방법입니다. 가장 빠른 block 크기를 정하는 식은 아닙니다. 아래 코드는 내장 변수와 자원 조회 API를 묶은 학습용 CUDA 조각으로, 입력 선언과 할당은 생략했습니다.</p>
      </div>
<ExplainedFormula question="마지막 원소까지 덮으려면 block이 몇 개 필요할까요?" idea="N을 B로 나눈 몫만 쓰면 남은 원소가 빠집니다. 나머지가 있을 때 block 하나를 추가합니다." formula={String.raw`G=\left\lceil\frac{N}{B}\right\rceil=\left\lfloor\frac{N+B-1}{B}\right\rfloor`} annotatedFormula={String.raw`G=\underbrace{\left\lceil N/B\right\rceil}_{\text{남는 원소가 있으면 한 묶음 추가}}`} operations={[{expression:String.raw`\lceil N/B\rceil`,annotation:["완전히 채운 block 수에 남은 원소를 맡을 block 하나를 더합니다.","10÷4는 몫 2·나머지 2이므로 3개입니다."]}]} terms={[{symbol:"N",name:"원소 수",description:"실제 입력의 길이입니다."},{symbol:"B",name:"묶음 크기",description:"1차원 block의 thread 수입니다."},{symbol:"G",name:"묶음 수",description:"grid 안에 만드는 block 수입니다."}]} assumptions={["N·B는 양의 정수이고 B는 장치의 thread 한도 안에 있어야 합니다.","N+B−1 계산이 정수형 범위를 넘지 않아야 합니다. 그렇지 않으면 몫과 나머지로 올림을 계산합니다.","N=0은 launch를 생략하는 등 별도 처리합니다."]} interpretation="10개를 4개씩 덮으면 3 blocks·12 threads입니다. 1000개를 256개씩 덮으면 4 blocks·1024 threads이고 마지막 24개는 경계 검사에서 빠집니다." /><CodePanel title="학습용 CUDA 조각: launch와 장치 한도 조회" code={layoutCode} />
    </section>
    <section id="source-1d" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9. 실제 vectorAdd의 번호 계산에 2·4·1을 넣습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">NVIDIA cuda-samples v13.0의 고정 commit 3f1c509…에서 vectorAdd.cu 49행은 blockDim.x×blockIdx.x+threadIdx.x로 i를 만듭니다. 4×2+1=9입니다. 51행의 i&lt;numElements에 9&lt;10을 넣으면 52행의 쓰기가 실행됩니다.</p>
        <p className="leading-8">같은 원문에 내부 번호 2를 넣으면 i=10입니다. 10&lt;10은 거짓이므로 입력도 읽지 않고 결과도 쓰지 않습니다. 원문의 추가 0.0f를 포함해 9+90+0.0f는 이번 정수 값에서 99입니다.</p>
        <p className="leading-8">원본 기본값은 원소 50000개와 block당 256 threads입니다. 본문의 10개·4 threads·입력 9와 90은 함수에 대입한 학습 가정입니다. 원본 파일과 라이선스는 수정하지 않았으며 사이드바에서 host의 복사·launch·결과 확인까지 펼칠 수 있습니다.</p>
      </div>
<CodeViewButton label="vectorAdd.cu · 47–54행" onClick={()=>sidebar.open("cuda-kernel",codeRefs["cuda-kernel"])} /><CodeViewButton label="원본 host의 256-thread launch" onClick={()=>sidebar.open("cuda-launch",codeRefs["cuda-launch"])} /><SourceApplication source="NVIDIA cuda-samples v13.0 · 3f1c509 · 49–52행" excerpt="int i = blockDim.x * blockIdx.x + threadIdx.x;" application="4×2+1=9, 9<10을 확인한 뒤 C[9]에 99를 씁니다. 같은 block의 내부 번호 2는 i=10이라 접근하지 않습니다." /><CitationBlock source="NVIDIA vectorAdd · 고정 원문" citeKey={1} href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu">번호 계산·경계 검사·원본 launch를 대조합니다.</CitationBlock>
    </section>
    <section id="indexing-1d" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10. 범위를 담는 정수형과 실행 오류도 함께 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">배열이 커져도 번호를 만드는 규칙은 같습니다. 예를 들어 block 3·크기 128·내부 번호 17은 401을 만듭니다. Block 2·크기 256·내부 번호 5는 517을 만들지만 배열 길이가 515면 접근해서는 안 됩니다.</p>
        <p className="leading-8">원본 샘플은 int로 충분한 작은 입력을 씁니다. 더 큰 입력에 맞춘 학습용 변형에서는 곱셈 전에 size_t처럼 충분히 넓은 형으로 바꿉니다. 곱한 뒤 형을 바꾸면 이미 생긴 정수 넘침을 되돌릴 수 없습니다.</p>
        <p className="leading-8">Launch 직후의 cudaGetLastError는 잘못된 실행 설정 같은 오류를 확인하는 데 씁니다. 비동기 계산 중의 접근 오류는 cudaDeviceSynchronize처럼 완료를 기다리는 지점에서도 확인해야 합니다. 앞선 비동기 오류가 뒤의 API에서 관측될 수 있으므로 각 호출의 반환값과 실행 순서를 함께 기록합니다.</p>
      </div>
<ExplainedFormula question="다른 block의 같은 내부 번호를 어떻게 구별할까요?" idea="앞선 block들이 맡은 전체 길이를 건너뛴 뒤 현재 block 안의 위치를 더합니다." formula={String.raw`i=\mathrm{blockIdx}.x\times\mathrm{blockDim}.x+\mathrm{threadIdx}.x`} annotatedFormula={String.raw`i=\underbrace{bB}_{\text{앞선 묶음의 길이}}+\underbrace{t}_{\text{묶음 안 위치}}`} operations={[{expression:"bB",annotation:["현재 block 앞에 b개가 있고 각각 B개 자리를 맡습니다."]},{expression:"+t",annotation:["그 시작 위치에서 t칸 더 이동합니다."]}]} terms={[{symbol:"b",name:"blockIdx.x",description:"현재 block의 번호입니다."},{symbol:"B",name:"blockDim.x",description:"각 block의 thread 수입니다."},{symbol:"t",name:"threadIdx.x",description:"block 안 thread 번호입니다."}]} assumptions={["1차원 작업표를 전제로 합니다.","곱셈과 덧셈을 담을 충분히 넓은 정수형을 사용해야 합니다.","계산한 후보 i가 배열 길이보다 작은지 따로 확인합니다."]} interpretation="주 사례는 2×4+1=9입니다. 확장 예에서 3×128+17=401이고, 2×256+5=517은 배열 길이 515의 밖입니다." /><CodePanel title="학습용 CUDA 조각: 넓은 번호형과 두 오류 확인 지점" code={vecAddCode} />
    </section>
    <section id="indexing-2d" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">11. 두 축의 범위를 확인한 뒤 행 우선 주소를 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">한 줄을 여러 행으로 넓혀도 앞선 구역의 길이를 건너뛴다는 규칙은 같습니다. 너비 5·높이 3의 배열에서 행 2·열 3은 원소 13번입니다. 둘 다 0부터 세며, 먼저 행 2&lt;3과 열 3&lt;5를 각각 검사합니다.</p>
        <p className="leading-8">원소 번호 13과 바이트 위치는 다릅니다. 4바이트 원소라면 시작점에서 52바이트 떨어져 있습니다. cudaMallocPitch처럼 행마다 여백이 있으면 너비에 원소 크기를 곱한 값 대신 반환된 실제 행 간격을 사용해야 합니다.</p>
        <p className="leading-8">아래는 밝기를 바꾸는 학습용 코드입니다. 1920×1080 입력을 32×8 block으로 덮으면 grid는 60×135이고 두 축 모두 남는 thread가 없습니다. 비정렬 크기도 다루려면 올림한 두 grid 축과 두 좌표의 경계 검사를 함께 유지합니다.</p>
        <p className="leading-8">16×16과 32×8은 모두 256 threads지만 같은 warp가 지나는 행은 달라질 수 있습니다. 한 행의 이웃 값을 읽는 데 유리한 모양과 주변 경계까지 복사하는 데 유리한 모양은 다를 수 있습니다. 직사각형·비배수 입력에서 정답을 먼저 확인한 뒤 실제 요청량과 시간을 비교합니다.</p>
      </div>
<ExplainedFormula question="행과 열을 한 줄의 배열 위치로 어떻게 바꿀까요?" idea="먼저 각 축의 block 시작점에 내부 좌표를 더합니다. 그런 다음 지나온 행 전체의 길이에 현재 열을 더합니다." formula={String.raw`\begin{aligned}\mathrm{col}&=b_x B_x+t_x,\\\mathrm{row}&=b_y B_y+t_y,\\\mathrm{offset}&=\mathrm{row}\times W+\mathrm{col}.\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}\mathrm{col}&=\underbrace{b_x B_x+t_x}_{\text{가로 시작점 + 가로 이동}},\\\mathrm{row}&=\underbrace{b_y B_y+t_y}_{\text{세로 시작점 + 세로 이동}},\\\mathrm{offset}&=\underbrace{\mathrm{row}\times W}_{\text{앞선 행의 원소 수}}+\mathrm{col}.\end{aligned}`} operations={[{expression:"b_xB_x+t_x",annotation:["가로 block 시작점에 block 안 가로 좌표를 더합니다."]},{expression:"b_yB_y+t_y",annotation:["세로 block 시작점에 block 안 세로 좌표를 더합니다."]},{expression:String.raw`\mathrm{row}\times W+\mathrm{col}`,annotation:["앞선 행마다 W개를 건너뛴 뒤 현재 열만큼 이동합니다."]}]} terms={[{symbol:"b_x,b_y",name:"block 좌표",description:"grid 안의 가로·세로 위치입니다."},{symbol:"B_x,B_y",name:"block 크기",description:"각 축의 thread 수입니다."},{symbol:"t_x,t_y",name:"thread 좌표",description:"block 안의 위치입니다."},{symbol:"W",name:"행 너비",description:"한 행에 연속 저장한 원소 수입니다."}]} assumptions={["같은 크기의 원소를 행 우선으로 연속 저장한 배열입니다.","row<H와 col<W를 각각 확인한 뒤 접근합니다.","행마다 빈 바이트가 있는 pitched allocation은 row×pitch+col×원소크기로 바이트 주소를 구합니다."]} interpretation="너비 5·높이 3에서 행 2·열 3은 2×5+3=13번입니다. 너비와 높이를 바꾸면 2×3+3=9로 잘못 찾습니다." /><CodePanel title="학습용 CUDA 조각: 행·열 경계와 밝기 변경" code={imageCode} />
    </section>
    <section id="warp-runtime" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">12. 같은 warp의 조건이 갈려도 정답이 자동으로 틀리는 것은 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">명령을 함께 진행해도 lane마다 자기 값과 주소를 갖습니다. 같은 warp에서 짝수 번호만 덧셈을 한다면 홀수 lane은 그 명령에 참여하지 않습니다. 갈라진 경로를 나눠 실행하는 비용이 생길 수 있지만 각자의 조건을 지킨 결과는 올바를 수 있습니다.</p>
        <p className="leading-8">예를 들어 block 64 threads는 warp 두 개입니다. 그 block의 thread 37은 두 번째 warp의 lane 5입니다. 이 규칙은 block 안의 선형 번호에 적용하며, 서로 다른 block의 전체 배열 번호를 합쳐 warp를 만들지 않습니다.</p>
        <p className="leading-8">Warp 내부가 언제나 같은 박자로 움직인다고 가정해 필요한 동기화를 생략해서는 안 됩니다. 독립적인 thread 진행을 지원하는 세대도 있으므로 필요한 참여 범위에 맞는 동기화를 사용합니다. Block 전체에 공유한 값은 모든 필요한 thread의 쓰기와 대기 완료 뒤에 읽습니다.</p>
      </div>

    </section>
    <section id="placement" data-teach-level="6" className="scroll-mt-20">
      <span id="paper-cuda-thread-model" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">13. 묶음을 올릴 때는 thread 수와 저장 공간을 함께 셉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">256-thread block이 장치 한도 안에 있어도 register나 shared memory를 많이 쓰면 같은 SM에 머무는 block 수가 줄 수 있습니다. 반대로 아주 작은 block은 SM이 수용할 수 있는 block 개수 한도에 먼저 걸릴 수 있습니다.</p>
        <p className="leading-8">동시에 머무는 warp의 비율을 occupancy라고 부릅니다. 이 비율이 높아도 다음 명령의 입력을 기다리는 warp만 많다면 일을 내보내지 못합니다. Profiler의 eligible warps는 다음 명령을 실행할 준비가 된 warp를 확인하는 데 씁니다.</p>
        <p className="leading-8">장치에서 허용하는 block 크기 128·256·512를 비교한다면 같은 입력과 정답 조건을 씁니다. GPU와 compiler를 고정하고 컴파일 옵션도 같게 맞춥니다.</p>
        <p className="leading-8">먼저 register 수와 shared memory 사용량으로 자원 점유를 확인합니다. 이어서 달성한 occupancy와 eligible warps를 보고 메모리 처리량과 kernel 시간을 기록합니다. 실제 프로그램의 전송·완료 대기까지 포함한 시간도 비교합니다.</p>
        <p className="leading-8">Compute capability 9.0부터는 선택적인 thread block cluster 계층도 있습니다. 같은 cluster의 block들은 같은 GPC에 함께 배치되도록 보장되지만 한 SM에 모두 놓인다는 뜻은 아닙니다. GridDim은 여전히 block 수를 나타냅니다.</p>
        <p className="leading-8">공식 문서의 portable cluster 크기는 최대 block 8개이며 작은 장치나 분할 설정은 더 작을 수 있습니다. 장치와 해당 kernel에서 가능한 크기를 조회해야 합니다. Cluster의 distributed shared memory를 사용할 때는 cluster 동기화로 다른 block의 공유 공간 수명과 접근 순서를 맞춰야 합니다. 이 기능을 모든 CUDA GPU의 기본 능력으로 가정하지 않습니다.</p>
      </div>
<CitationBlock source="CUDA C++ Programming Guide 13.0.2 · Thread Hierarchy·SIMT·Thread Block Clusters" citeKey={2} href="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html">Block별 독립 배치와 warp의 구성, cluster 지원·크기·공유 공간 조건을 확인합니다.</CitationBlock>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">14. 자리 배분의 정답과 실제 속도를 따로 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">열 칸 사례는 마지막 두 후보가 접근하지 않는지와 원소 9번이 99가 되는지를 확인하는 모델입니다. 네 thread짜리 block이 장치를 효율적으로 채운다는 주장은 아닙니다.</p>
        <p className="leading-8">실제 kernel은 길이 0·1·block 크기 전후, 직사각형과 각 축의 비배수 입력을 확인합니다. 주소 계산형의 범위, 행 간격, thread 사이의 의존 관계도 입력 조건입니다. 장치 실행을 측정할 때는 준비 실행 뒤 같은 조건에서 반복하고 완료를 확인한 시간을 사용합니다.</p>
        <p className="leading-8">이번 환경에서는 CUDA 장치 실행을 측정하지 않았습니다. 고정 원문의 번호·경계 식에 사례를 대입하고 정수 계산을 검산했습니다. 값을 함께 쓰는 경로는 <Link to="/cs/gpu/cuda-shared-memory">공유 메모리</Link>, 요청 순서와 완료는 <Link to="/cs/gpu/cuda-sync-streams">동기화·스트림</Link> 글에서 이어집니다.</p>
      </div>

    </section>
    <ReviewPrompts questions={["열 원소를 block당 네 thread로 맡기면 몇 개의 후보가 배열에 접근하지 않습니까? (답: 7·8절)","Thread 네 개짜리 block 세 개를 warp 하나로 합칠 수 있습니까? (답: 7·12절)","너비 5·높이 3의 행 2·열 3은 원소 번호와 4바이트 기준 위치가 각각 얼마입니까? (답: 11절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{cuda:{id:"cuda",label:"NVIDIA cuda-samples · v13.0",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},hip:{id:"hip",label:"ROCm HIP-Examples · pinned source",badgeClass:"bg-amber-50 border-amber-300 text-amber-800"}}} />
  </div>;}

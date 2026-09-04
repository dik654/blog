import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CudaExecutionPathViz, CudaIndexMappingViz, CudaMemoryPathViz } from "./viz/ModernCudaBasicsViz";

const PROGRAMMING_GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const BEST_PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const SAMPLES = "https://github.com/NVIDIA/cuda-samples/tree/v12.8";

export default function ModernCudaBasicsArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">CUDA를 실행 경로부터</p>
          <h2 className="text-3xl font-bold tracking-tight">GPU는 큰 일을 잘게 나누기만 하면 빨라지는 장치가 아니다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          CUDA는 CPU가 준비한 data와 함수를 NVIDIA GPU에서 많은 thread로 실행하는 programming model입니다. GPU가 유리하려면 각 thread가 처리할
          일이 충분히 독립적이고 같은 instruction을 비슷한 흐름으로 실행해야 하며, host↔device 복사 비용보다 병렬 계산에서 아끼는 시간이 커야 합니다.
        </p>
        <p>
          이 글은 길이 10인 vector를 더하는 작은 예로 host·device·kernel, grid·block·thread, global index와 memory traffic을
          바닥부터 연결합니다. 마지막에는 이 구조를 hash candidate, signature batch, MSM·NTT 같은 blockchain workload에 적용합니다. 다만
          특정 GPU의 고정 speedup을 일반 법칙처럼 제시하지는 않습니다.
        </p>
        <CudaExecutionPathViz />
        <ContentBoundary article="cuda-basics" />
      </section>

      <section id="execution-path" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Host와 device</p><h2 className="mt-2 text-2xl font-bold">CPU가 launch를 제출하고 GPU가 kernel threads를 scheduling한다</h2></header>
        <p>
          <strong>Host</strong>는 일반적으로 CPU와 그 process를, <strong>device</strong>는 CUDA GPU를 뜻합니다. Host code는 device memory를 할당하고 input을 복사한 뒤 kernel launch를 queue에 넣습니다. Kernel은 GPU에서 실행되는 함수이며 같은 code를 여러 logical thread가 서로 다른 index로 수행합니다. Launch가 비동기일 수 있으므로 host API가 돌아왔다는 사실과 GPU 계산 완료도 구분해야 합니다.
        </p>
        <p>
          Pinned CUDA guide의 software hierarchy는 grid &gt; block &gt; thread입니다. Grid는 launch 전체, block은 같은
          SM에 함께 배치되어 shared memory와 block barrier를 공유할 수 있는 협력 단위, thread는 자기 register·index를 가진 logical
          worker입니다. 반면 hardware는 block threads를 32-lane warp로 묶어 instruction을 발행합니다. Thread 하나가 physical core
          하나에 영구 고정돼 있다고 보는 순간 scheduling과 latency hiding이 어긋나기 시작합니다.
        </p>
        <div id="paper-cuda-programming-guide">
          <CitationBlock type="code" citeKey={1} source="NVIDIA CUDA C++ Programming Guide 12.8.1" href={PROGRAMMING_GUIDE}>
            <p><strong>문제:</strong> CUDA의 host/device execution, thread hierarchy, memory space와 synchronization semantics를 정확히 정의해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> Kernel을 grid·block·thread로 조직하고 block을 SM에 배치하며 warp 단위로 instruction을 실행하는 programming model을 제공합니다.</p>
            <p><strong>중요 가정:</strong> CUDA Toolkit 12.8.1 문서와 target GPU의 compute capability·device property를 함께 확인합니다.</p>
            <p><strong>근거 범위:</strong> 해당 archive version의 language·runtime·hardware execution semantics입니다.</p>
            <p><strong>일반화 금지:</strong> 특정 block size, latency, bandwidth 또는 speedup이 모든 architecture와 kernel에서 같다는 결론은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="indexing" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Index mapping</p><h2 className="mt-2 text-2xl font-bold">Logical thread 좌표를 data index로 바꾸고 끝을 검사한다</h2></header>
        <p>
          길이 <code>N=10</code>인 vector를 block당 4 threads로 처리하면 block은 3개가 필요합니다. 앞의 8 threads는 두 block을 채우고 마지막 block에서는 2 threads만 실제 data를 가집니다. Grid 크기를 내림하면 원소 8·9를 놓치고, 올림만 한 뒤 boundary check를 빼면 배열 밖을 읽거나 씁니다.
        </p>
        <CudaIndexMappingViz />
        <ExplainedFormula
          question="N개 원소를 B개 thread의 block으로 빠짐없이 처리하려면 block 수와 global index를 어떻게 계산할까?"
          idea={<>N을 B로 나눈 값을 올림해 마지막 partial block까지 만들고, block 시작 offset에 block 안의 thread index를 더합니다. 마지막에는 i&lt;N을 검사합니다.</>}
          formula={String.raw`\begin{aligned}G&=\left\lceil\frac{N}{B}\right\rceil=\frac{N+B-1}{B}\\[3pt]i&=\mathrm{blockIdx.x}\,B+\mathrm{threadIdx.x}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}G&=\underbrace{\left\lceil\frac{N}{B}\right\rceil=\frac{N+B-1}{B}}_{\text{기준량당 비율}}\\[3pt]i&=\underbrace{\mathrm{blockIdx.x}\,B+\mathrm{threadIdx.x}}_{\text{Block당 thread 수 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`\left\lceil\frac{N}{B}\right\rceil=\frac{N+B-1}{B}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","N을 B로 나눈 값을 올림해 마지막 partial","block까지 만들고, block 시작 offset에","block 안의 thread index를 더합니다."] },
            { expression: String.raw`\mathrm{blockIdx.x}\,B+\mathrm{threadIdx.x}`, annotation: ["Block당 thread 수이(가) 식의 결과에 기여하는","방식을 계산합니다.","N을 B로 나눈 값을 올림해 마지막 partial","block까지 만들고, block 시작 offset에"] },
          ]}
          terms={[
            { symbol: "N", name: "원소 수", description: "이번 launch에서 처리할 1차원 data의 logical 길이입니다." },
            { symbol: "B", name: "Block당 thread 수", description: "launch의 blockDim.x이며 target GPU limit와 kernel resource 사용 안에서 정합니다." },
            { symbol: "G", name: "Grid의 block 수", description: "N=10, B=4이면 3 blocks이며 총 12 logical threads를 만듭니다." },
            { symbol: "i", name: "Global data index", description: "현재 thread가 담당할 원소 위치이며 i<N일 때만 memory에 접근합니다." },
          ]}
          assumptions={["N과 B는 양의 정수이며 식의 나눗셈은 integer ceiling을 구현합니다.", "1차원 row-major data와 1차원 launch를 설명하며 2D·3D mapping은 각 축의 stride를 추가해야 합니다."]}
          interpretation="N=10, B=4이면 G=3이고 마지막 block의 i=10,11 threads는 guard에서 멈춥니다. 이 식은 좋은 block size나 memory coalescing을 자동으로 보장하지 않습니다."
        />
      </section>

      <section id="memory" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Memory traffic</p><h2 className="mt-2 text-2xl font-bold">계산 시간보다 옮기는 bytes와 재사용 범위를 먼저 센다</h2></header>
        <p>
          Register는 thread가, shared memory는 block이 직접 사용하는 on-chip storage이며 global memory는 device 전체의 큰 data를
          담습니다. Shared memory에 올린다고 무조건 빨라지지는 않습니다. 여러 threads가 같은 data를 재사용하거나 access 순서를 바꿔 global
          transaction을 줄일 때 비로소 이득이 납니다. 그 대신 staging load, barrier, bank conflict와 block당 capacity가 추가됩니다.
        </p>
        <CudaMemoryPathViz />
        <ExplainedFormula
          question="GPU kernel이 CPU 구현보다 빨라도 end-to-end 실행이 느릴 수 있는 이유를 어떻게 계산할까?"
          idea={<>GPU 경로에는 input 전송, kernel, output 전송과 synchronization이 모두 들어갑니다. CPU 시간과 비교할 때 kernel time 하나만 떼어 보지 않습니다.</>}
          formula={String.raw`\begin{aligned}T_{GPU}&=T_{H\to D}+T_{kernel}\\&\quad+T_{D\to H}+T_{sync}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T_{GPU}&=\underbrace{T_{H\to D}+T_{kernel}}_{\text{Host-to-device 시간 계산}}\\&\quad+T_{D\to H}+T_{sync}\end{aligned}`}
          operations={[
            { expression: String.raw`T_{H\to D}+T_{kernel}`, annotation: ["Host-to-device 시간이(가) 식의 결과에 기여하는","방식을 계산합니다.","GPU 경로에는 input 전송, kernel, output","전송과 synchronization이 모두 들어갑니다."] },
          ]}
          terms={[
            { symbol: "T_{H\\to D}", name: "Host-to-device 시간", description: "Input bytes를 host memory에서 device memory로 옮기는 시간입니다." },
            { symbol: "T_{kernel}", name: "Kernel 시간", description: "GPU timeline에서 kernel이 실제 실행된 elapsed time입니다." },
            { symbol: "T_{D\\to H}", name: "Device-to-host 시간", description: "필요한 결과 bytes를 host로 회수하는 시간입니다." },
            { symbol: "T_{sync}", name: "동기화·queue 비용", description: "Dependency wait, launch overhead와 완료 확인에 드는 나머지 시간을 묶습니다." },
          ]}
          assumptions={["CPU와 GPU가 같은 입력에서 같은 정확도의 결과를 만든다고 먼저 검증합니다.", "전송과 kernel이 겹친다면 단순 합 대신 실제 timeline의 critical path를 사용합니다."]}
          interpretation="작은 batch에서는 transfer와 launch가 계산 절약분보다 클 수 있습니다. 반대로 device에 data를 오래 유지하고 여러 kernel에서 재사용하면 전송 비용을 amortize할 수 있습니다."
        />
        <div id="paper-cuda-best-practices">
          <CitationBlock type="code" citeKey={2} source="NVIDIA CUDA C++ Best Practices Guide 12.8.1" href={BEST_PRACTICES}>
            <p><strong>문제:</strong> Correct kernel을 실제 hardware에서 효율적으로 만들 때 measurement·memory access·execution configuration을 판단해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> APOD cycle, effective bandwidth, coalescing, pinned transfer와 occupancy를 측정 가능한 최적화 항목으로 정리합니다.</p>
            <p><strong>중요 가정:</strong> CUDA 12.8.1과 target architecture에서 같은 workload·compiler·clock·input을 고정합니다.</p>
            <p><strong>근거 범위:</strong> NVIDIA가 제시하는 공식 optimization 방법과 metric 정의입니다.</p>
            <p><strong>일반화 금지:</strong> Occupancy 최대화나 shared memory 사용이 단독으로 성능 향상을 보장한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="workload-fit" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Blockchain workload</p><h2 className="mt-2 text-2xl font-bold">독립성·batch·branch·data layout이 맞을 때 GPU 후보가 된다</h2></header>
        <p>
          Nonce 후보나 많은 독립 hash처럼 같은 연산을 서로 다른 input에 반복하는 작업은 thread mapping이 직관적입니다. Batch signature
          verification도 여러 서명 사이 독립성을 활용할 수 있지만 각 thread의 branch와 field-arithmetic cost가 다르면 warp divergence가
          생깁니다. MSM에서는 point bucket을 모으는 과정의 memory contention과 reduction이 설계를 좌우합니다. NTT 쪽 관건은 stage별
          butterfly dependency와 global synchronization입니다.
        </p>
        <p>
          Signature 형식이나 validation path가 여러 종류라면 같은 warp에 임의로 섞기보다 control flow와 cost가 비슷한 input을 먼저
          grouping하는 후보를 시험할 수 있습니다. 다만 grouping을 위한 host preprocessing과 추가 memory 이동이 생기므로 branch
          efficiency·warp stall의 개선뿐 아니라 end-to-end 시간까지 같이 놓고 비교하는 게 순서입니다.
        </p>
        <p>
          “cryptography라 GPU”라고 결정할 일이 아닙니다. 병렬 단위와 batch 크기, input residency와 field representation, branch
          분포, device memory footprint, 그리고 CPU reference를 먼저 고정합니다. 그다음 kernel time만이 아니라 end-to-end
          latency·throughput·energy·correctness를 같은 dataset에서 비교합니다.
        </p>
        <div id="paper-cuda-samples">
          <CitationBlock type="code" citeKey={3} source="NVIDIA cuda-samples v12.8" href={SAMPLES}>
            <p><strong>문제:</strong> Vector addition, reduction, matrix multiplication과 stream 같은 CUDA pattern을 build 가능한 reference로 확인해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> Toolkit API를 사용하는 작은 official sample과 target별 build 구성을 제공합니다.</p>
            <p><strong>중요 가정:</strong> Tag v12.8 source, 지원 compiler·driver와 sample별 요구 compute capability를 확인합니다.</p>
            <p><strong>근거 범위:</strong> 해당 tag의 example code와 correctness demonstration입니다.</p>
            <p><strong>일반화 금지:</strong> Sample kernel이 production blockchain workload에 최적이거나 특정 GPU speedup을 보장하는 benchmark는 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">05 · 역검사와 채택</p><h2 className="mt-2 text-2xl font-bold">결과 parity를 먼저 확인한 뒤 병목이 실제로 줄었는지 본다</h2></header>
        <p>
          기초 여섯 문제가 다루는 범위는 host/device/kernel 경로, grid·block·thread와 warp, ceiling launch, boundary guard,
          memory scope, end-to-end 시간입니다. 심화 네 문제는 divergence, shared-memory trade-off, blockchain batch
          mapping과 paired release gate를 이 글의 식과 예시만으로 설계하는 과제입니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> 같은 input·precision·compiler·driver·GPU에서 CPU reference와 output을 비교하고 invalid index·odd size·large batch를 포함합니다. 그 뒤 H2D·kernel·D2H·sync timeline, achieved bandwidth, warp stall, occupancy와 end-to-end throughput을 기록하며, correctness mismatch나 목표 latency regression이 있으면 채택하지 않습니다.
        </aside>
      </section>
    </article>
  );
}

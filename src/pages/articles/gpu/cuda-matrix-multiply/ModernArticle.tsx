import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { GemmDataflowViz, GemmMeasurementViz, TileReuseViz } from "./viz/ModernGemmViz";

const GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const SAMPLE = "https://github.com/NVIDIA/cuda-samples/tree/v12.8/Samples/0_Introduction/matrixMul";

export default function ModernCudaMatrixMultiplyArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">행렬 곱을 memory traffic 문제로 읽기</p><h2 className="text-3xl font-bold tracking-tight">모든 thread가 정답 하나를 계산해도, 같은 값을 계속 다시 읽으면 GPU는 기다린다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">행렬 곱셈 <code>C=A×B</code>에서 output 원소 하나는 A의 한 row와 B의 한 column을 곱해 더한 값입니다. 수학적 정의는 <a className="text-primary hover:underline" href="/ai/math-matrices-svd#multiplication">행렬 곱 정본</a>이 소유하며, 여기서는 그 계산을 CUDA thread에 배치했을 때 왜 나이브 kernel이 global memory traffic에 막히고 shared-memory tiling이 언제 이를 줄이는지 추적합니다.</p>
        <p>핵심은 “shared memory가 빠르다”가 아니라 <strong>한 번 가져온 A·B 값을 block 안의 여러 output이 재사용한다</strong>는 데 있습니다. 그 대가로 tile load, block barrier, edge predication, register·shared-memory 사용량이 생기므로 correctness와 measured throughput을 함께 확인해야 합니다.</p>
        <GemmDataflowViz />
        <ContentBoundary article="cuda-matrix-multiply" />
      </section>

      <section id="naive" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Output mapping</p><h2 className="mt-2 text-2xl font-bold">2차원 thread 하나가 C의 원소 하나를 맡는다</h2></header>
        <p>M×K 행렬 A와 K×N 행렬 B를 곱하면 C는 M×N입니다. 2차원 global index로 <code>row</code>와 <code>col</code>을 만들고, 유효한 thread만 K축을 순회합니다. Grid·block·index의 정의와 ceiling launch는 <a className="text-primary hover:underline" href="/gpu/cuda-thread-hierarchy#indexing-2d">CUDA thread hierarchy</a>에서 재사용합니다.</p>
        <ExplainedFormula question="한 output C[row,col]을 어떤 값들로 계산하고 전체 계산량은 얼마일까?" idea={<>A의 row에서 K개, B의 column에서 K개를 같은 k로 짝지어 곱하고 누산합니다. 곱과 덧셈을 각각 한 FLOP로 세는 관례라면 대략 2MNK FLOPs입니다.</>} formula={String.raw`C_{ij}=\sum_{k=0}^{K-1}A_{ik}B_{kj},\qquad F\approx2MNK`}
        annotatedFormula={String.raw`C_{ij}=\underbrace{\sum_{k=0}^{K-1}A_{ik}B_{kj},\qquad F\approx2MNK}_{\text{Output 원소 계산}}`}
        operations={[
          { expression: String.raw`\sum_{k=0}^{K-1}A_{ik}B_{kj},\qquad F\approx2MNK`, annotation: ["Output 원소이(가) 식의 결과에 기여하는 방식을","계산합니다.","A의 row에서 K개, B의 column에서 K개를 같은 k로","짝지어 곱하고 누산합니다."] },
        ]} terms={[
          { symbol: "A,B", name: "Input matrices", description: "A는 M×K, B는 K×N이며 reduction 축 K의 크기가 같아야 합니다." },
          { symbol: "C_{ij}", name: "Output 원소", description: "Output row i와 column j가 만나는 한 scalar입니다." },
          { symbol: "i,j,k", name: "Index 역할", description: "i·j는 output 좌표이고 k는 곱해 더하는 reduction 좌표입니다." },
          { symbol: "M", name: "Output row 수", description: "A와 C의 row 수입니다." },
          { symbol: "N", name: "Output column 수", description: "B와 C의 column 수입니다." },
          { symbol: "K", name: "Reduction 길이", description: "각 output이 수행하는 multiply-accumulate 횟수입니다." },
          { symbol: "F", name: "정의한 FLOP 수", description: "일반 dense GEMM의 대략적 연산량이며 FMA를 2 FLOPs로 셉니다." },
        ]} assumptions={["A·B·C는 row-major dense matrix이고 shape가 M×K, K×N, M×N으로 맞습니다.", "FMA를 2 FLOPs로 세며 padding·epilogue·index 연산은 제외합니다."]} interpretation="M=N=K=4이면 output 16개가 각각 4번 곱하고 더해 약 128 FLOPs입니다. 이 수는 실제 실행 instruction 수나 Tensor Core throughput을 그대로 뜻하지 않습니다." />
        <p>
            나이브 kernel에서는 각 output thread가 A row와 B column을 global memory에서 읽습니다. Cache가 일부 중복을 흡수하기는 해도 재사용을
            명시적으로 보장하지는 않습니다. B의 column access는 data layout에 따라 coalescing도 나빠지기 쉽습니다. 코드는 단순하지만 큰 K에서
            requested bytes와 실제 memory transactions가 불어나기도 합니다.
          </p>
      </section>

      <section id="tiled" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Shared-memory tiling</p><h2 className="mt-2 text-2xl font-bold">K축을 tile로 나누고 load·barrier·reuse·barrier를 반복한다</h2></header>
        <p><strong>Tiling</strong>은 큰 행렬을 block이 다룰 작은 조각으로 나누는 방법입니다. Threads가 A tile과 B tile을 coalesced하게 shared memory로 옮긴 뒤 <code>__syncthreads()</code>로 load 완료를 맞추고, tile 내부의 값을 여러 output 계산에 재사용합니다. 다음 tile을 덮어쓰기 전에도 barrier가 필요합니다. Shared memory의 scope·bank와 barrier 의미는 각각 <a className="text-primary hover:underline" href="/gpu/cuda-shared-memory">shared-memory 정본</a>, <a className="text-primary hover:underline" href="/gpu/cuda-sync-streams#overview">동기화 정본</a>을 따릅니다.</p>
        <TileReuseViz />
        <ExplainedFormula question="T×T tile에서 global load 한 번이 얼마나 재사용되는지 어떻게 근사할까?" idea={<>한 K tile마다 A와 B에서 각각 T² values를 load하고 T² output threads가 T번 MAC합니다. 따라서 tile이 커질수록 global byte당 계산이 늘지만 resource 비용도 함께 늘어납니다.</>} formula={String.raw`I_{tile}\approx\frac{2T^3\ \mathrm{FLOP}}{2T^2s\ \mathrm{byte}}=\frac{T}{s}\ \mathrm{FLOP/byte}`}
        annotatedFormula={String.raw`I_{tile}\approx\frac{2T^3\ \mathrm{FLOP}}{2T^2s\ \mathrm{byte}}=\underbrace{\frac{T}{s}\ \mathrm{FLOP/byte}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{T}{s}\ \mathrm{FLOP/byte}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","한 K tile마다"] },
        ]} terms={[
          { symbol: "T", name: "정사각 tile 한 변", description: "교육용 block tile의 row·column 길이입니다." },
          { symbol: "s", name: "원소 byte 수", description: "FP32라면 4 bytes입니다." },
          { symbol: "I_{tile}", name: "Tile-level arithmetic intensity 근사", description: "해당 stage의 requested global bytes 대비 계산량입니다." },
        ]} assumptions={["A·B tile을 각 K stage에서 한 번씩 global memory에서 읽고 C store·cache·edge overhead를 생략합니다.", "각 loaded value가 block 안에서 T번 유효하게 재사용된다고 가정합니다."]} interpretation="T=4, FP32이면 약 1 FLOP/byte이고 T=32이면 약 8 FLOP/byte입니다. 실제 arithmetic intensity는 cache, C read/write, partial tile, data type과 compiler lowering 때문에 profiler traffic으로 다시 계산해야 합니다." />
        <p>행렬 크기가 T의 배수가 아니면 마지막 block의 일부 load와 output은 범위를 벗어납니다. 각 load를 predicate하고 out-of-range shared slot에는 0을 넣은 뒤, store도 <code>row&lt;M && col&lt;N</code>일 때만 수행해야 합니다. 단순히 block 전체를 건너뛰면 유효한 edge output까지 잃고, 일부 thread만 barrier에 도달하면 block이 진행하지 못할 수 있습니다.</p>
        <div id="paper-cuda-programming-guide"><CitationBlock type="code" citeKey={1} source="NVIDIA CUDA C++ Programming Guide 12.8.1" href={GUIDE}><p><strong>문제:</strong> CUDA block cooperation, shared memory, barrier와 execution configuration의 정확한 의미가 필요합니다.</p><p><strong>핵심 아이디어:</strong> Block 안 threads가 shared storage를 사용하고 명시적 synchronization으로 producer–consumer 단계를 맞춥니다.</p><p><strong>중요 가정:</strong> Toolkit 12.8.1과 target compute capability·device limits를 함께 확인합니다.</p><p><strong>근거 범위:</strong> 해당 archive의 CUDA programming semantics입니다.</p><p><strong>일반화 금지:</strong> 특정 tile 크기나 shared-memory kernel이 모든 GPU·shape에서 빠르다는 보장은 아닙니다.</p></CitationBlock></div>
      </section>

      <section id="performance" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Measurement</p><h2 className="mt-2 text-2xl font-bold">Warm-up·동기화·연산량·bytes의 경계를 고정하고 비교한다</h2></header>
        <p>
            첫 실행에는 context 초기화, module load와 cache cold effect가 섞일 수 있으므로 결과를 먼저 reference와 비교하고 여러 번 warm-
            up합니다. Kernel-only 시간은 같은 stream에 CUDA start/stop event를 기록하고 stop을 synchronize한 뒤 반복 분포를 보고합니다.
            CPU wall-clock으로 end-to-end를 잴 때는 측정 구간 앞뒤 GPU completion을 명시해야 비동기 launch 반환 시간만 재는 실수를 피합니다.
          </p>
        <GemmMeasurementViz />
        <ExplainedFormula question="GEMM에서 achieved FLOP/s와 achieved bandwidth를 같은 실행에서 어떻게 계산할까?" idea={<>정의한 useful FLOPs와 requested bytes를 동일한 elapsed time으로 나눕니다. Profiler가 보고한 actual DRAM bytes도 별도로 보존해 coalescing·cache 효과와 algorithmic traffic을 구분합니다.</>} formula={String.raw`\begin{aligned}P_{ach}&=\frac{2MNK}{t}\\[3pt]B_{eff}&=\frac{B_{read}+B_{write}}{t}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}P_{ach}&=\underbrace{\frac{2MNK}{t}}_{\text{기준량당 비율}}\\[3pt]B_{eff}&=\underbrace{\frac{B_{read}+B_{write}}{t}}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{2MNK}{t}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","정의한 useful FLOPs와 requested bytes를","동일한 elapsed time으로 나눕니다."] },
          { expression: String.raw`\frac{B_{read}+B_{write}}{t}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","정의한 useful FLOPs와 requested bytes를","동일한 elapsed time으로 나눕니다."] },
        ]} terms={[
          { symbol: "M,N,K", name: "GEMM shape", description: "동일 후보끼리 고정하는 output row·column과 reduction 길이입니다." },
          { symbol: "t", name: "Kernel elapsed time", description: "Warm-up 뒤 동일 stream CUDA events로 잰 seconds입니다." },
          { symbol: "P_{ach}", name: "Achieved FLOP/s", description: "FMA=2 FLOPs 관례의 useful GEMM work를 시간으로 나눈 값입니다." },
          { symbol: "B_{eff}", name: "Effective bandwidth", description: "정의한 requested read/write bytes를 시간으로 나눈 값입니다." },
          { symbol: "B_{read},B_{write}", name: "분석 경계의 bytes", description: "Naive/tiled에서 같은 의미로 세고 profiler actual traffic과 구분합니다." },
        ]} assumptions={["같은 M/N/K·dtype·result tolerance·compiler·clock 상태에서 후보를 비교합니다.", "Elapsed time에 포함된 kernel과 stream을 명시하며 H2D/D2H는 end-to-end 표에 별도로 포함합니다."]} interpretation="2MNK/t가 커져도 end-to-end가 느려질 수 있고, effective bandwidth가 peak보다 낮다고 항상 memory access만 문제인 것도 아닙니다. Roofline과 stalls·occupancy를 함께 봐야 합니다." />
        <p>예를 들어 M=N=K=1024, FP32이면 useful work는 약 2.15 GFLOPs입니다. Median kernel time이 0.20 ms라면 약 10.7 TFLOP/s지만 이는 교육용 계산일 뿐 target에서 측정한 값이 아닙니다. 이 값을 제품 peak와 비교하려면 precision·sparsity·clock·Tensor Core 경로를 맞춰야 합니다.</p>
        <div id="paper-cuda-best-practices"><CitationBlock type="code" citeKey={2} source="NVIDIA CUDA C++ Best Practices Guide 12.8.1" href={PRACTICES}><p><strong>문제:</strong> 비동기 CUDA 실행을 정확히 timing하고 effective bandwidth와 matrix-tiling 효과를 평가해야 합니다.</p><p><strong>핵심 아이디어:</strong> CUDA events, reference comparison, requested/effective bandwidth와 shared-memory matrix multiplication 사례를 제공합니다.</p><p><strong>중요 가정:</strong> 같은 workload·precision·GPU·software stack에서 측정 구간과 byte 계산을 고정합니다.</p><p><strong>근거 범위:</strong> NVIDIA의 공식 measurement·optimization guidance입니다.</p><p><strong>일반화 금지:</strong> 예제 수치와 tile 선택이 다른 architecture·shape의 최적값이라는 뜻은 아닙니다.</p></CitationBlock></div>
        <div id="paper-cuda-matrix-sample"><CitationBlock type="code" citeKey={3} source="NVIDIA cuda-samples v12.8 · matrixMul" href={SAMPLE}><p><strong>문제:</strong> CUDA matrix multiplication의 build 가능한 최소 API·kernel pattern을 확인합니다.</p><p><strong>핵심 아이디어:</strong> Block tiling과 shared-memory reuse를 작은 sample로 보여 줍니다.</p><p><strong>중요 가정:</strong> v12.8 tag의 sample 조건과 지원 architecture를 확인합니다.</p><p><strong>근거 범위:</strong> 교육용 correctness demonstration과 API 사용 예입니다.</p><p><strong>일반화 금지:</strong> 임의 shape·production GEMM에서 cuBLAS보다 빠르거나 완전한 benchmark라는 뜻은 아닙니다.</p></CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 채택 기준</p><h2 className="mt-2 text-2xl font-bold">Tile 크기는 occupancy 최대값이 아니라 병목과 end-to-end 결과로 고른다</h2></header>
        <p>
            Tile을 키우면 재사용은 늘지만 block당 threads·shared bytes·thread당 registers가 커져 resident blocks가 줄 수 있습니다. 아주
            작은 matrix는 launch·barrier 비용이 더 큽니다. 극단적으로 가는 K나 skinny shape은 정사각 tile이 맞지 않습니다. Vendor library는
            Tensor Core·pipeline·epilogue를 더 잘 활용하기도 합니다.
          </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Release gate:</strong> 0·1·odd·non-multiple M/N/K와 여러 magnitude에서 CPU 또는 library reference tolerance를 통과한 뒤, 같은 seed·dtype·compiler·driver·clock에서 warm-up 횟수와 반복수를 고정합니다. Naive·tiled·cuBLAS 후보의 median/p95 kernel time, end-to-end time, achieved FLOP/s·bandwidth, actual DRAM traffic, occupancy·stall을 저장하고 목표 workload에서만 채택합니다.</aside>
      </section>
    </article>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MetricBoundaryViz, PerfLoopViz } from "./viz/ModernPerfViz";
import { FusionMegakernelViz, RegisterResidencyViz } from "./viz/FusionResourceViz";

const PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const PROGRAMMING = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const NSYS = "https://docs.nvidia.com/nsight-systems/2025.1/UserGuide/index.html";
const NCU = "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html";
const FLASH_ATTENTION = "https://arxiv.org/abs/2205.14135";
const PERSISTENT_THREADS = "https://doi.org/10.1109/InPar.2012.6339596";

export default function ModernCudaPerfAnalysisArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">느리다는 말을 측정 가능한 질문으로</p><h2 className="text-3xl font-bold tracking-tight">CUDA 최적화는 occupancy 숫자를 올리는 일이 아니라 병목 가설을 좁히는 일이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">프로그램이 느릴 때 먼저 구분할 것은 사용자가 기다린 end-to-end 시간, host↔device copy, launch queue, 개별 kernel과 synchronization입니다. 그다음에야 해당 kernel이 memory bandwidth, compute issue, dependency, insufficient parallelism 중 어디에 가까운지 묻습니다.</p>
      <p>이 글은 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-peak-achieved-boundary">Roofline·peak/achieved 정본</a>과 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-latency-hiding-occupancy">occupancy 정본</a>을 재사용해, warm-up부터 CUDA event timing, achieved bandwidth/FLOP/s, Nsight counter, ablation까지 하나의 재현 가능한 분석 loop로 묶습니다.</p>
      <TermBreakdown
        title="Fusion을 이해하기 전에 구분할 여섯 가지"
        description="먼저 실행 단위와 저장 위치를 하나씩 고정합니다. 이 용어를 구분해야 ‘launch를 줄였다’와 ‘GPU가 실제로 빨라졌다’를 같은 말로 오해하지 않습니다."
        items={[
          {
            term: "GPU kernel",
            description: "CPU가 GPU에 실행을 요청하는 device 함수와 그 grid 전체입니다. Kernel마다 block 크기, register·shared-memory 사용량과 최적 scheduling 조건을 따로 가질 수 있습니다.",
            example: "A, B, C를 각각 launch하면 세 kernel은 서로 다른 block 구성과 resource budget을 사용할 수 있습니다.",
            boundary: "운영체제의 kernel이나 convolution kernel이라는 수학 용어와 다릅니다.",
          },
          {
            term: "Kernel launch",
            description: "Host가 grid와 인자를 GPU 실행 queue에 제출하는 사건입니다. 호출은 GPU 완료보다 먼저 반환될 수 있으므로 launch 횟수와 완료 시간은 다른 측정량입니다.",
            example: "3 μs 계산을 수백 번 제출하면 각 launch·dependency·synchronization 비용이 계산과 비슷해질 수 있습니다.",
            boundary: "큰 GEMM 100 ms에서 launch 하나를 없앤 효과와 작은 kernel 수천 개의 launch를 없앤 효과는 같지 않습니다.",
          },
          {
            term: "HBM · device memory",
            description: "GPU 전체가 접근하는 큰 off-chip memory입니다. 중간 tensor를 kernel A가 쓰고 B가 다시 읽으면 register보다 훨씬 먼 계층으로 byte가 왕복합니다.",
            example: "A→HBM→B→HBM→C에서 fusion은 중간 write와 read를 없앨 후보가 됩니다.",
            boundary: "HBM에 기록됐다는 사실만으로 실제 DRAM transaction 수나 cache hit가 결정되지는 않습니다.",
          },
          {
            term: "Thread register",
            description: "한 thread가 계산 중인 scalar·pointer·partial result를 보관하는 on-chip slot입니다. Compiler가 live variable과 target architecture를 보고 배정합니다.",
            example: "double 하나는 register file이 32-bit 단위이므로 최소 두 개의 32-bit register를 요구합니다.",
            boundary: "255 근처 숫자는 여러 NVIDIA architecture의 thread당 한도이며 kernel 전체나 SM 전체 register 수가 아닙니다.",
          },
          {
            term: "Warp · SM",
            description: "Warp는 함께 issue되는 32 threads 묶음이고, SM은 여러 resident warp의 register context와 block shared memory를 보유하며 ready warp를 골라 실행합니다.",
            example: "Warp A가 memory를 기다릴 때 ready Warp B를 issue하면 latency가 가려집니다.",
            boundary: "Resident warp가 많다는 occupancy 숫자와 실제 ready·eligible warp 수는 같지 않습니다.",
          },
          {
            term: "Live range",
            description: "어떤 값이 만들어진 뒤 마지막 사용까지 보존되어야 하는 코드 구간입니다. A·B·C를 합치면 각 단계의 값이 동시에 살아 있어 register pressure가 커질 수 있습니다.",
            example: "A의 partial result를 C까지 보존하면서 B temporaries도 필요하면 합산 register 수가 단순한 max(A,B,C)보다 커질 수 있습니다.",
            boundary: "Source 변수 개수만으로 최종 register 수를 알 수 없으며 compiler의 ptxas/cubin 결과를 확인해야 합니다.",
          },
        ]}
      />
      <PerfLoopViz />
      <ContentBoundary article="cuda-perf-analysis" />
    </section>

    <section id="measurement-protocol" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Measurement protocol</p><h2 className="mt-2 text-2xl font-bold">비동기 실행에서는 시작과 끝의 completion 의미부터 고정한다</h2></header>
      <p>CUDA kernel launch는 CPU에 control을 돌려준 뒤 GPU에서 실행될 수 있습니다. 따라서 CPU timer로 launch 호출만 감싸면 GPU 계산 시간이 아니라 queue에 넣는 시간을 잴 수 있습니다. End-to-end는 측정 전 이전 작업을 끝내고 입력 준비부터 필요한 출력까지의 critical path를 재며, kernel-only는 같은 stream에 CUDA events를 기록합니다.</p>
      <MetricBoundaryViz />
      <p>첫 iteration에는 runtime context, module loading, memory page와 cache 상태가 섞일 수 있으므로 별도의 warm-up을 수행합니다. 그 뒤 같은 input·shape로 충분히 반복하고 median과 p95 또는 분포를 보존합니다. 고정 clock 여부, power/thermal 상태, concurrent workload, compiler flags, driver·Toolkit·GPU identity도 receipt에 남겨야 비교가 재현됩니다.</p>
      <div id="paper-cuda-performance-guide"><CitationBlock type="code" citeKey={1} source="NVIDIA CUDA C++ Best Practices Guide 12.8.1" href={PRACTICES}><p><strong>문제:</strong> CUDA의 비동기 실행을 올바르게 timing하고 bandwidth·scaling·correctness를 같은 최적화 과정에서 다뤄야 합니다.</p><p><strong>핵심 아이디어:</strong> APOD, CPU/GPU timer 경계, effective bandwidth, Amdahl scaling과 reference comparison을 제공합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1, 동일 target·workload·precision·measurement region을 고정합니다.</p><p><strong>근거 범위:</strong> NVIDIA의 공식 performance measurement와 optimization guidance입니다.</p><p><strong>일반화 금지:</strong> 예제 bandwidth·occupancy·speedup을 다른 GPU나 workload의 결과로 옮길 수 없습니다.</p></CitationBlock></div>
    </section>

    <section id="amdahl" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Amdahl과 Roofline</p><h2 className="mt-2 text-2xl font-bold">고칠 구간의 비중과 resource 상한을 먼저 계산한다</h2></header>
      <p><strong>Amdahl&apos;s law</strong>는 전체 시간에서 개선할 수 있는 비율이 작으면 그 부분을 무한히 빠르게 해도 전체 speedup이 제한된다는 식입니다. 예를 들어 전체 100 ms 중 kernel이 20 ms뿐이라면 kernel을 없애도 1.25×가 상한입니다. 따라서 hotspot의 absolute time과 전체 비중을 먼저 봅니다.</p>
      <ExplainedFormula question="전체 시간의 일부만 r배 빠르게 할 때 end-to-end speedup의 상한은 얼마일까?" idea={<>기존 시간을 개선하지 않는 부분 1-p와 개선되는 부분 p/r로 나눠 새 시간을 만든 뒤 기존 시간 1을 나눕니다.</>} formula={String.raw`S=\frac{1}{(1-p)+p/r}`} terms={[
        {symbol:"p",name:"개선 대상 시간 비율",description:"Baseline 전체 elapsed time 중 실제로 빨라지는 구간의 비율입니다."},
        {symbol:"r",name:"구간 speedup",description:"그 구간만 baseline보다 몇 배 빨라지는지 나타냅니다."},
        {symbol:"S",name:"전체 speedup",description:"Baseline end-to-end time을 candidate end-to-end time으로 나눈 값입니다."},
      ]} assumptions={["같은 workload 크기와 correctness에서 strong scaling을 비교합니다.", "개선으로 다른 구간의 시간·overlap·resource contention이 바뀌지 않는 단순 분해입니다."]} interpretation="p=0.2, r=10이면 S≈1.22입니다. 이 식은 workload를 키우는 weak scaling이나 개선 때문에 copy와 kernel overlap이 바뀌는 경우를 자동으로 설명하지 않습니다." />
      <p>Hot kernel 안에서는 arithmetic intensity와 compute·bandwidth roof를 비교합니다. 하지만 peak는 spec 상한이고 achieved는 실제 elapsed time과 traffic에서 계산한 관측값입니다. Roofline상 memory-bound라고 판단해도 uncoalesced access, latency, insufficient warps, synchronization이 각각 다른 원인일 수 있으므로 counter로 가설을 나눠야 합니다.</p>
      <ExplainedFormula question="같은 kernel의 useful work가 memory roof와 compute roof 중 어디에 먼저 닿을까?" idea={<>Useful FLOPs를 실제 DRAM bytes로 나눈 arithmetic intensity I에 achieved 가능한 bandwidth를 곱하고, 해당 precision의 compute ceiling과 작은 쪽을 고릅니다.</>} formula={String.raw`\begin{aligned}I&=F/Q\\[3pt]P&\le\min(P_{compute},\ I\,B_{memory})\end{aligned}`} terms={[
        {symbol:"F",name:"Useful FLOPs",description:"명시한 counting convention의 kernel 연산량입니다."},
        {symbol:"Q",name:"Memory traffic",description:"같은 경계에서 profiler로 관찰하거나 정의한 bytes입니다."},
        {symbol:"I",name:"Arithmetic intensity",description:"Memory byte 하나당 수행한 useful FLOPs입니다."},
        {symbol:"P",name:"Performance",description:"동일 elapsed time으로 계산한 achieved FLOP/s입니다."},
        {symbol:"P_{compute}",name:"Compute roof",description:"해당 precision·instruction path·clock 조건의 compute ceiling입니다."},
        {symbol:"B_{memory}",name:"Memory bandwidth roof",description:"같은 memory level과 access 조건에서 사용할 bandwidth ceiling입니다."},
      ]} assumptions={["Precision·sparsity·instruction path에 맞는 compute roof를 사용합니다.", "Bandwidth와 traffic은 같은 memory level·ECC·clock·access 조건의 값입니다."]} interpretation="I가 낮으면 bandwidth roof가 먼저 낮아질 가능성이 큽니다. 다만 점이 roof 아래에 있다는 사실만으로 정확한 stall 원인이 결정되지는 않습니다." />
    </section>

    <section id="register-pressure" className="space-y-6">
      <div id="occupancy" className="scroll-mt-24" />
      <header><p className="text-sm font-semibold text-primary">03 · Register pressure부터 occupancy까지</p><h2 className="mt-2 text-2xl font-bold">값을 오래 붙잡을수록 resident warp가 먼저 줄고, 그 다음에는 spill이 생길 수 있다</h2></header>
      <p><strong>Register pressure</strong>는 지금 실행 지점에서 동시에 살아 있어야 하는 값들이 요구하는 thread당 register 수입니다. Compiler는 source 변수 개수를 그대로 세지 않고, 값이 만들어진 뒤 마지막으로 쓰일 때까지의 <strong>live range</strong>가 겹치는지를 보고 physical register를 배정합니다. 따라서 A·B·C를 한 kernel로 합치면 A의 결과와 B·C의 temporary가 겹쳐 각 kernel의 register 수를 단순히 더하거나 최댓값만 취한 것과 다른 결과가 나옵니다.</p>
      <p><strong>Register spill</strong>은 배정할 register가 부족해 compiler가 일부 값을 CUDA의 local address space로 내리는 일입니다. 이름은 local이지만 thread마다 가까운 CPU stack이라는 뜻이 아닙니다. 이 storage는 device memory에 놓이며 지원 architecture에서는 L2 cache의 도움을 받을 수 있습니다. 그래서 source만 보고 추측하지 말고 build의 <code>ptxas -v</code> register·local-memory 보고와 SASS의 local load/store, profiler traffic을 함께 확인합니다.</p>
      <RegisterResidencyViz />
      <ExplainedFormula
        question="Register만 고려한 단순 상한에서 SM에 resident할 수 있는 warp 수는 어떻게 줄어들까?"
        idea={<>한 warp는 32 threads이므로 thread당 register 수에 32를 곱해 warp 하나의 요구량을 만듭니다. SM register file을 그 요구량으로 나눈 뒤 hardware warp 한도와 더 작은 값을 택합니다.</>}
        formula={String.raw`\begin{aligned}D_w&=32R_{thread}\\W_{reg}&=\left\lfloor R_{SM}/D_w\right\rfloor\\W&\le\min(W_{hw},W_{reg})\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}D_w&=\underbrace{32}_{\text{warp의 thread}}\,\underbrace{R_{thread}}_{\text{thread당 reg}}\\[3pt]W_{reg}&=\lfloor\underbrace{R_{SM}}_{\text{SM reg}}/\underbrace{D_w}_{\text{warp당 reg}}\rfloor\\[3pt]W&\le\min(\underbrace{W_{hw}}_{\text{SM 한도}},\underbrace{W_{reg}}_{\text{reg 한도}})\end{aligned}`}
        operations={[
          { expression: String.raw`32R_{thread}`, annotation: ["한 warp의 32 threads가", "동시에 점유할 register를 합산"] },
          { expression: String.raw`\frac{R_{SM}}{32R_{thread}}`, annotation: ["SM 전체 register 예산에", "그 warp가 몇 묶음 들어가는지 계산"] },
          { expression: String.raw`\min(W_{hw},W_{reg})`, annotation: ["register 계산과 hardware 한도 중", "먼저 막히는 residency 제약을 선택"] },
        ]}
        terms={[
          { symbol: "W_{reg}", name: "Register-limited resident warps", description: "Register 예산만 고려했을 때 동시에 resident할 수 있는 warp 수의 상한입니다." },
          { symbol: "W_{hw}", name: "Hardware warp limit", description: "해당 SM architecture가 허용하는 resident warp 수 상한입니다." },
          { symbol: "R_{SM}", name: "SM register file", description: "SM 전체가 보유한 32-bit register slot 수입니다." },
          { symbol: "R_{thread}", name: "Registers per thread", description: "Compiler가 해당 kernel의 thread 하나에 배정한 32-bit register 수입니다." },
          { symbol: "D_w", name: "Registers per warp", description: "32 threads가 resident하기 위해 한 warp 전체에서 요구하는 register 수입니다." },
        ]}
        assumptions={[
          "작은 계산은 CC 7.0 예시의 SM당 65,536 registers와 최대 64 warps를 사용합니다.",
          "실제 allocation granularity, block 크기, shared memory, architecture별 block·warp 제한은 생략한 register-only 상한입니다.",
          "Compiler의 register cap을 강제로 낮추면 occupancy가 오르는 대신 spill과 instruction 수가 늘 수 있습니다.",
        ]}
        interpretation="Thread당 64 registers면 register-only 상한은 32 warps, 128이면 16 warps입니다. Spill이 0이어도 이미 resident warp가 줄 수 있으므로 ‘spill만 없으면 안전하다’는 결론은 성립하지 않습니다."
      />
      <p><strong>Occupancy</strong>는 최대 active warps 대비 resident active warps 비율입니다. Resident warp가 많으면 Warp A가 memory를 기다리는 동안 ready Warp B를 issue할 기회가 늘지만, 높은 occupancy 자체가 빠르다는 뜻은 아닙니다. Reuse와 instruction-level parallelism이 충분하면 낮은 occupancy가 더 빠를 수도 있고, resident warp가 많아도 같은 dependency를 기다리면 latency가 가려지지 않습니다.</p>
      <div id="paper-cuda-register-memory"><CitationBlock type="code" citeKey={4} source="NVIDIA CUDA C++ Programming Guide 12.8.1 · registers and local memory" href={PROGRAMMING}><p><strong>문제:</strong> Thread register allocation, SM residency와 local memory가 실제 CUDA execution에서 어떤 경계를 갖는지 확인해야 합니다.</p><p><strong>핵심 아이디어:</strong> Register file은 warp context에 배분되고, 자동 변수나 spill이 local address space를 사용할 수 있으며 local memory는 device memory에 놓인다는 구현 경계를 설명합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1과 실제 target compute capability를 고정하고 compiler·cubin resource report를 확인합니다.</p><p><strong>근거 범위:</strong> NVIDIA CUDA의 register·local memory semantics와 compiler inspection 방법입니다.</p><p><strong>일반화 금지:</strong> 255/256 근처 수를 kernel 전체 한도나 모든 GPU의 동일한 배정량으로 일반화할 수 없습니다.</p></CitationBlock></div>
      <p>먼저 timeline에서 대상 kernel을 찾고, launch statistics와 resource limit을 확인합니다. Memory 가설이면 requested/actual transactions, cache hit와 DRAM throughput을, dependency 가설이면 warp stall reasons와 issue activity를 봅니다. Counter 수집 자체가 실행을 replay하거나 overhead를 만들 수 있으므로 pass와 tool version을 기록하고, 최종 latency는 counter가 없는 반복에서도 다시 측정합니다.</p>
      <div id="paper-nsight-compute"><CitationBlock type="code" citeKey={2} source="NVIDIA Nsight Compute 2025.1 User Guide" href={NCU}><p><strong>문제:</strong> 개별 CUDA kernel의 launch, memory workload, scheduler·warp stall과 source-level metric을 해석해야 합니다.</p><p><strong>핵심 아이디어:</strong> Section 기반 metric collection과 kernel replay·comparison workflow를 제공합니다.</p><p><strong>중요 가정:</strong> Nsight Compute 2025.1, 지원 GPU·driver와 metric availability를 확인합니다.</p><p><strong>근거 범위:</strong> 해당 profiler release의 수집·표시 semantics입니다.</p><p><strong>일반화 금지:</strong> 특정 stall metric 하나가 root cause를 증명하거나 occupancy 최대화가 최적화를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="fusion-megakernel" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 작은 fusion과 Megakernel</p><h2 className="mt-2 text-2xl font-bold">HBM 왕복을 줄인 이익과 합치면서 생긴 자원 손실을 같은 식에서 비교한다</h2></header>
      <p><strong>Kernel fusion</strong>은 원래 따로 launch하던 연산의 중간값을 HBM에 썼다가 다시 읽지 않도록 한 kernel 안에서 이어 계산하는 최적화입니다. Bias→activation→multiply처럼 같은 element를 짧게 변환하는 연산은 data layout과 launch configuration이 비슷하고 live value도 제한적이어서 fusion 이익이 큰 편입니다.</p>
      <TermBreakdown
        title="작은 fusion에서 Megakernel로 넘어갈 때 바뀌는 것"
        description="세 용어는 크기만 다른 동의어가 아닙니다. 무엇을 합치고, 어떤 자원 예산과 scheduler 선택을 포기하는지가 다릅니다."
        items={[
          { term: "Small kernel fusion", description: "서로 인접하고 data shape·thread mapping이 비슷한 몇 연산을 한 kernel로 묶습니다.", example: "Bias + GELU + residual multiply는 intermediate HBM write/read와 launch를 줄일 수 있습니다.", boundary: "Bitwise·numerical parity, extra registers와 achieved bandwidth를 함께 재측정합니다." },
          { term: "Megakernel", description: "GEMM·softmax·Top-K·sampling·KV update처럼 여러 stage와 control path를 하나의 큰 scheduling envelope 안에 넣는 설계입니다.", example: "Launch와 global intermediate는 줄지만 서로 다른 block size·warp 역할·shared-memory layout을 하나의 자원 배치로 타협할 수 있습니다.", boundary: "큰 source file이라는 뜻이 아니라 여러 heterogeneous stage의 lifetime과 scheduling을 한 kernel이 소유하는 경계입니다." },
          { term: "Fusion boundary", description: "중간값을 on-chip에 남길 이익이 register·shared-memory·divergence·instruction-cache·scheduling 손실보다 큰 지점까지만 묶는 선택입니다.", example: "LLM에서는 GEMM epilogue, attention 내부, norm+elementwise, quant/dequant처럼 ROI가 높은 경계를 먼저 실험합니다.", boundary: "Model 전체를 합치는 것이 목표가 아니며 end-to-end slice에서 candidate를 비교해야 합니다." },
        ]}
      />
      <FusionMegakernelViz />
      <ExplainedFormula
        question="Fusion으로 줄인 launch·HBM 시간은 새 resource 비용을 이기고 실제 end-to-end 이득이 되는가?"
        idea={<>왼쪽에는 없어진 launch와 intermediate memory 왕복을 더하고, 오른쪽에는 합친 뒤 늘어난 occupancy·spill·divergence·scheduling 비용을 더해 뺍니다. 결과가 양수일 때만 이 workload에서 fusion 후보가 이득입니다.</>}
        formula={String.raw`\begin{aligned}G_L&=(N_L-1)t_L\\C_R&=T_{occ}+T_{spill}+T_{div}+T_{sched}\\\Delta T&=G_L+T_{HBM,saved}-C_R\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}G_L&=\underbrace{(N_L-1)}_{\text{없앤 launch 수}}\,\underbrace{t_L}_{\text{launch당 시간}}\\[3pt]C_R&=\underbrace{T_{occ}+T_{spill}}_{\text{residency·spill}}+\underbrace{T_{div}+T_{sched}}_{\text{control·배치 손실}}\\[3pt]\Delta T&=\underbrace{G_L+T_{HBM,saved}}_{\text{줄인 시간}}-\underbrace{C_R}_{\text{새 resource 비용}}\end{aligned}`}
        operations={[
          { expression: String.raw`(N_L-1)t_L`, annotation: ["여러 launch 중 하나만 남기고", "없어진 횟수에 launch 비용을 곱함"] },
          { expression: String.raw`T_{HBM,saved}`, annotation: ["중간값을 HBM에 쓰고 읽던", "실제 절감 시간을 더함"] },
          { expression: String.raw`T_{occ}+T_{spill}+T_{div}+T_{sched}`, annotation: ["합치면서 새로 생긴 손실을", "중복 없이 같은 시간 경계로 합산"] },
          { expression: String.raw`\Delta T>0`, annotation: ["절감이 손실보다 클 때만", "fusion candidate를 채택"] },
        ]}
        terms={[
          { symbol: "N_L", name: "Baseline launches", description: "Fusion 전에 같은 구간을 처리하던 kernel launch 수입니다." },
          { symbol: "t_L", name: "Launch cost", description: "고정 workload와 submission 조건에서 관측한 launch·dependency 비용입니다." },
          { symbol: "G_L", name: "Saved launch time", description: "Fusion으로 없어진 launch 횟수에 launch당 시간을 곱한 절감입니다." },
          { symbol: "T_{HBM,saved}", name: "Saved memory time", description: "없어진 intermediate write/read로 줄어든 시간을 뜻합니다." },
          { symbol: "T_{occ}", name: "Occupancy loss", description: "Register·shared-memory 증가로 latency hiding 기회가 줄어든 시간입니다." },
          { symbol: "T_{spill}", name: "Spill cost", description: "Local load/store와 그 cache·device-memory traffic이 추가한 시간입니다." },
          { symbol: "T_{div}", name: "Divergence cost", description: "Warp 안의 서로 다른 control path를 serial하게 처리한 비용입니다." },
          { symbol: "T_{sched}", name: "Scheduling cost", description: "각 stage의 최적 block·warp 구성과 독립 scheduling을 포기한 비용입니다." },
          { symbol: "C_R", name: "New resource cost", description: "Fusion이 새로 만든 occupancy·spill·control·scheduling 손실의 시간 경계입니다." },
          { symbol: "ΔT", name: "Net saved time", description: "Baseline 시간에서 fused candidate 시간을 뺀 end-to-end 절감입니다." },
        ]}
        assumptions={[
          "Baseline과 candidate는 같은 input, output tolerance, precision, GPU, clocks와 warm-up 조건에서 측정합니다.",
          "각 항은 설명용 분해이며 profiler counter를 그대로 시간으로 중복 합산하지 않습니다.",
          "작은 kernel 수백 개와 큰 GEMM 중심 workload는 N_L과 hotspot 비중이 달라 별도 판단합니다.",
        ]}
        interpretation="100 ms inference에서 5 μs를 줄이면 end-to-end 개선은 0.005%입니다. 반대로 2~5 μs kernel이 수백 번 반복되면 launch와 synchronization이 큰 비중이 될 수 있으므로 같은 fusion도 가치가 달라집니다."
      />
      <p>Megakernel의 위험은 register 하나로 끝나지 않습니다. Live range와 shared memory가 늘어 occupancy가 먼저 내려갈 수 있고, 더 심하면 spill이 생깁니다. 서로 다른 stage를 한 launch configuration으로 묶으면 instruction-cache pressure, dependency chain, divergence와 load balancing도 나빠질 수 있습니다. 그래서 <strong>spill이 0인가</strong>와 <strong>occupancy가 높은가</strong>는 각각 필요한 관측일 뿐 충분한 채택 조건이 아닙니다.</p>
      <p><strong>FlashAttention</strong>은 이 차이를 보여 주는 좋은 예입니다. 전체 attention matrix를 HBM에 materialize하지 않고 Q·K·V tile을 on-chip SRAM/register budget에 맞춰 읽어 QKᵀ, online softmax와 V accumulation을 이어 수행합니다. 즉 model 전체를 하나의 거대한 kernel에 넣은 것이 아니라, exact attention의 IO를 줄이도록 tile size·warp 역할·resource budget을 함께 설계한 fusion boundary입니다.</p>
      <div id="paper-flashattention-io-fusion"><CitationBlock type="paper" citeKey={5} source="FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness" href={FLASH_ATTENTION}><p><strong>문제:</strong> Standard attention이 full attention matrix를 HBM에 materialize하면서 많은 HBM↔on-chip memory IO를 발생시킵니다.</p><p><strong>핵심 아이디어:</strong> Tiling과 online softmax로 exact attention을 계산하면서 HBM access를 줄이는 IO-aware algorithm을 제시합니다.</p><p><strong>중요 가정:</strong> 논문의 memory hierarchy model, exact attention semantics와 실험한 GPU·sequence shape 범위를 고정합니다.</p><p><strong>근거 범위:</strong> Attention 내부에서 tile 단위 fusion과 IO complexity가 어떻게 연결되는지를 뒷받침합니다.</p><p><strong>일반화 금지:</strong> 이 결과가 모든 연산을 model-wide Megakernel로 합치면 빨라진다는 주장은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="persistent-kernel" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">05 · Persistent kernel</p><h2 className="mt-2 text-2xl font-bold">오래 살아 있는 worker가 queue를 소비하는 모델은 큰 kernel과 별도의 설계다</h2></header>
      <p><strong>Persistent kernel</strong>은 GPU에 resident한 worker block이 종료하지 않고 work queue에서 다음 task를 가져오는 실행 방식입니다. Host가 A·B·C를 매번 launch하는 대신 queue에 일을 게시하고, GPU worker가 dequeue→execute→publish를 반복해 launch와 host-device synchronization을 줄일 수 있습니다.</p>
      <TermBreakdown
        title="Persistent kernel이 추가로 소유해야 하는 세 계약"
        items={[
          { term: "Work queue", description: "Task type, input pointer, dependency와 completion 위치를 담는 bounded queue입니다.", example: "짧고 반복적인 decoding task를 host launch 대신 resident worker가 가져갑니다.", boundary: "Producer·consumer memory ordering, full/empty 상태와 backpressure를 명시해야 합니다." },
          { term: "Resource partition", description: "몇 개 SM·block을 persistent worker에 남기고 다른 kernel과 어떻게 공존할지 정하는 자원 경계입니다.", example: "모든 SM을 점유하면 별도 copy·collective·latency-sensitive kernel의 scheduling을 막을 수 있습니다.", boundary: "Queue가 비어도 resident resource를 보유하므로 utilization과 fairness를 따로 측정합니다." },
          { term: "Termination protocol", description: "마지막 task, error, cancellation과 shutdown을 worker 모두에게 전달하고 안전하게 빠져나오는 규칙입니다.", example: "Sentinel을 한 worker만 소비하면 다른 block이 barrier에서 영원히 기다릴 수 있습니다.", boundary: "Deadlock·starvation·load imbalance와 restart idempotency가 correctness 문제입니다." },
        ]}
      />
      <p>Megakernel은 여러 stage를 한 scheduling envelope에 묶는 범위이고, persistent kernel은 kernel의 수명과 work 공급 방식을 바꾸는 모델입니다. 둘을 함께 쓸 수는 있지만 동의어가 아닙니다. LLM에서도 작은 task가 반복되고 host launch가 병목일 때 후보가 되며, 큰 GEMM·attention이 이미 대부분의 시간을 차지하면 queue와 resource partition 복잡도가 이득을 압도할 수 있습니다.</p>
      <div id="paper-persistent-threads"><CitationBlock type="paper" citeKey={6} source="A Study of Persistent Threads Style GPU Programming for GPGPU Workloads" href={PERSISTENT_THREADS}><p><strong>문제:</strong> GPU work를 매 launch마다 새 thread grid로 공급하는 방식과 long-lived persistent workers의 trade-off를 비교해야 합니다.</p><p><strong>핵심 아이디어:</strong> Persistent Threads style과 여러 사용 사례를 분류하고 workload에 따라 성능이 좋아지거나 나빠질 수 있음을 실험합니다.</p><p><strong>중요 가정:</strong> 2012년 논문의 GPU, runtime과 평가 workload 범위를 역사적 근거로 사용합니다.</p><p><strong>근거 범위:</strong> Persistent worker·work distribution이라는 실행 모델과 workload-dependent trade-off를 뒷받침합니다.</p><p><strong>일반화 금지:</strong> 현대 GPU·LLM workload에서 동일한 speedup이나 최적 resource partition을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="profiling" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">06 · Nsight 분석 loop</p><h2 className="mt-2 text-2xl font-bold">Systems로 시간 구간을 찾고 Compute로 kernel 내부 가설을 검사한다</h2></header>
      <p>Nsight Systems는 CPU thread, CUDA API, copy, kernel, synchronization을 timeline에서 연결해 어떤 구간이 end-to-end critical path인지 찾는 데 적합합니다. Nsight Compute는 선택한 kernel의 resource와 hardware counter를 깊게 봅니다. 먼저 Systems로 hotspot을 고르지 않고 모든 kernel counter를 모으면 분석 비용만 커지고 전체 병목과 무관한 작은 kernel을 최적화할 수 있습니다.</p>
      <div id="paper-nsight-systems"><CitationBlock type="code" citeKey={3} source="NVIDIA Nsight Systems 2025.1 User Guide" href={NSYS}><p><strong>문제:</strong> Host API·GPU work·copy·synchronization이 얽힌 application critical path를 찾아야 합니다.</p><p><strong>핵심 아이디어:</strong> System-wide timeline과 CUDA trace로 CPU 제출과 GPU 실행의 간격을 연결합니다.</p><p><strong>중요 가정:</strong> Nsight Systems 2025.1, capture option·duration·target environment를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 release의 trace collection·analysis 기능입니다.</p><p><strong>일반화 금지:</strong> Timeline correlation 자체가 kernel 내부의 정확한 stall 원인을 증명하지 않습니다.</p></CitationBlock></div>
      <p>변경은 한 번에 하나의 가설만 검증하도록 작게 만듭니다. 예를 들어 “load가 흩어져 actual bytes가 많다”면 layout만 바꾸고 correctness, actual/requested bytes, kernel time과 end-to-end를 paired 비교합니다. 시간이 줄었지만 예상 counter가 움직이지 않았다면 원인 설명을 수정해야 하며, counter는 사후 이야기를 꾸미는 장식이 아닙니다.</p>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">07 · 역검사와 채택</p><h2 className="mt-2 text-2xl font-bold">성능 회귀와 정확도 회귀를 같은 evidence bundle에서 판정한다</h2></header>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Performance gate:</strong> 같은 input·seed·precision·compiler·driver·GPU·clock/power profile에서 reference parity를 먼저 확인합니다. Warm-up과 반복수를 고정하고 unfused·small fusion·Megakernel·persistent candidate의 end-to-end median/p95와 단계별 CUDA event time을 paired 비교합니다. Receipt에는 registers/thread, spill load/store와 local-memory traffic, shared bytes/block, resident·eligible warps, stall·branch efficiency, achieved FLOP/s·GB/s와 실제 HBM traffic을 저장합니다. 목표 workload slice 모두에서 tolerance와 latency·throughput budget을 지키고, 가설 counter와 absolute time이 같은 방향으로 움직일 때만 변경을 채택합니다.</aside>
    </section>
  </article>;
}

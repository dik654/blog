import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MetricBoundaryViz, PerfLoopViz } from "./viz/ModernPerfViz";

const PRACTICES = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const NSYS = "https://docs.nvidia.com/nsight-systems/2025.1/UserGuide/index.html";
const NCU = "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html";

export default function ModernCudaPerfAnalysisArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">느리다는 말을 측정 가능한 질문으로</p><h2 className="text-3xl font-bold tracking-tight">CUDA 최적화는 occupancy 숫자를 올리는 일이 아니라 병목 가설을 좁히는 일이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">프로그램이 느릴 때 먼저 구분할 것은 사용자가 기다린 end-to-end 시간, host↔device copy, launch queue, 개별 kernel과 synchronization입니다. 그다음에야 해당 kernel이 memory bandwidth, compute issue, dependency, insufficient parallelism 중 어디에 가까운지 묻습니다.</p>
      <p>이 글은 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-peak-achieved-boundary">Roofline·peak/achieved 정본</a>과 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-latency-hiding-occupancy">occupancy 정본</a>을 재사용해, warm-up부터 CUDA event timing, achieved bandwidth/FLOP/s, Nsight counter, ablation까지 하나의 재현 가능한 분석 loop로 묶습니다.</p>
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

    <section id="occupancy" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Occupancy와 counter</p><h2 className="mt-2 text-2xl font-bold">Resident warp 수는 latency hiding의 기회이지 성능 점수가 아니다</h2></header>
      <p><strong>Occupancy</strong>는 SM이 지원하는 최대 active warps 대비 resident active warps 비율입니다. Block당 threads, registers, shared memory와 architecture limit 중 가장 빡빡한 자원이 residency를 정합니다. Occupancy가 낮아도 instruction-level parallelism과 reuse가 충분하면 빠를 수 있고, 높아도 모든 warp가 같은 memory dependency에서 기다리면 느릴 수 있습니다.</p>
      <p>먼저 timeline에서 대상 kernel을 찾고, launch statistics와 resource limit을 확인합니다. Memory 가설이면 requested/actual transactions, cache hit와 DRAM throughput을, dependency 가설이면 warp stall reasons와 issue activity를 봅니다. Counter 수집 자체가 실행을 replay하거나 overhead를 만들 수 있으므로 pass와 tool version을 기록하고, 최종 latency는 counter가 없는 반복에서도 다시 측정합니다.</p>
      <div id="paper-nsight-compute"><CitationBlock type="code" citeKey={2} source="NVIDIA Nsight Compute 2025.1 User Guide" href={NCU}><p><strong>문제:</strong> 개별 CUDA kernel의 launch, memory workload, scheduler·warp stall과 source-level metric을 해석해야 합니다.</p><p><strong>핵심 아이디어:</strong> Section 기반 metric collection과 kernel replay·comparison workflow를 제공합니다.</p><p><strong>중요 가정:</strong> Nsight Compute 2025.1, 지원 GPU·driver와 metric availability를 확인합니다.</p><p><strong>근거 범위:</strong> 해당 profiler release의 수집·표시 semantics입니다.</p><p><strong>일반화 금지:</strong> 특정 stall metric 하나가 root cause를 증명하거나 occupancy 최대화가 최적화를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="profiling" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Nsight 분석 loop</p><h2 className="mt-2 text-2xl font-bold">Systems로 시간 구간을 찾고 Compute로 kernel 내부 가설을 검사한다</h2></header>
      <p>Nsight Systems는 CPU thread, CUDA API, copy, kernel, synchronization을 timeline에서 연결해 어떤 구간이 end-to-end critical path인지 찾는 데 적합합니다. Nsight Compute는 선택한 kernel의 resource와 hardware counter를 깊게 봅니다. 먼저 Systems로 hotspot을 고르지 않고 모든 kernel counter를 모으면 분석 비용만 커지고 전체 병목과 무관한 작은 kernel을 최적화할 수 있습니다.</p>
      <div id="paper-nsight-systems"><CitationBlock type="code" citeKey={3} source="NVIDIA Nsight Systems 2025.1 User Guide" href={NSYS}><p><strong>문제:</strong> Host API·GPU work·copy·synchronization이 얽힌 application critical path를 찾아야 합니다.</p><p><strong>핵심 아이디어:</strong> System-wide timeline과 CUDA trace로 CPU 제출과 GPU 실행의 간격을 연결합니다.</p><p><strong>중요 가정:</strong> Nsight Systems 2025.1, capture option·duration·target environment를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 release의 trace collection·analysis 기능입니다.</p><p><strong>일반화 금지:</strong> Timeline correlation 자체가 kernel 내부의 정확한 stall 원인을 증명하지 않습니다.</p></CitationBlock></div>
      <p>변경은 한 번에 하나의 가설만 검증하도록 작게 만듭니다. 예를 들어 “load가 흩어져 actual bytes가 많다”면 layout만 바꾸고 correctness, actual/requested bytes, kernel time과 end-to-end를 paired 비교합니다. 시간이 줄었지만 예상 counter가 움직이지 않았다면 원인 설명을 수정해야 하며, counter는 사후 이야기를 꾸미는 장식이 아닙니다.</p>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">05 · 역검사와 채택</p><h2 className="mt-2 text-2xl font-bold">성능 회귀와 정확도 회귀를 같은 evidence bundle에서 판정한다</h2></header>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Performance gate:</strong> 같은 input·seed·precision·compiler·driver·GPU·clock/power profile에서 reference parity를 먼저 확인합니다. Warm-up과 반복수를 고정하고 end-to-end median/p95, 단계별 GPU event time, achieved FLOP/s·GB/s, actual traffic, occupancy·stall을 저장합니다. 목표 workload slice 모두에서 tolerance를 지키고 latency·throughput budget을 충족하며 가설 counter가 같은 방향으로 움직일 때만 변경을 채택합니다.</aside>
    </section>
  </article>;
}

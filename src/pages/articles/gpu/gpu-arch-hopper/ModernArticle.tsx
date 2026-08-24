import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ClusterScopeViz, HopperPipelineViz } from "./viz/ModernHopperViz";

const TUNING = "https://docs.nvidia.com/cuda/archive/12.8.1/hopper-tuning-guide/index.html";
const GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const WHITEPAPER = "https://resources.nvidia.com/en-us-tensor-core/nvidia-hopper-architecture-whitepaper";

export default function ModernHopperArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6">
    <header className="space-y-3"><p className="text-sm font-semibold text-primary">Hopper를 기능 목록이 아니라 실행 경로로</p><h2 className="text-3xl font-bold tracking-tight">Hopper는 더 많은 FLOPS만 제공한 세대가 아니라, data 이동과 협력 범위를 다시 나눴다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">NVIDIA Hopper 계열은 기존 grid·block·warp 위에 optional <strong>thread block cluster</strong>를 추가하고, <strong>TMA(Tensor Memory Accelerator)</strong>로 다차원 tensor 이동을 계산 threads와 분리합니다. Tensor Cores와 Transformer Engine은 낮은 precision의 matrix 연산을 가속하지만 정확도와 scaling contract가 함께 필요합니다.</p>
    <p>이 글은 일반적인 SM·warp·memory hierarchy를 <a className="text-primary hover:underline" href="/gpu/gpu-architecture">GPU architecture 정본</a>에서 재사용하고, Hopper에서 달라진 producer–consumer pipeline과 deployment gate만 소유합니다. H100의 peak 수치를 모든 Hopper SKU나 실제 kernel 성능으로 확대하지 않습니다.</p>
    <HopperPipelineViz />
    <ContentBoundary article="gpu-arch-hopper" />
  </section>

  <section id="sm-structure" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">01 · SM에서 먼저 볼 것</p><h2 className="mt-2 text-2xl font-bold">계산 unit보다 어떤 warp가 무엇을 기다리는지 추적한다</h2></header>
    <p><strong>SM(Streaming Multiprocessor)</strong>은 block이 배치되고 warps가 instruction을 발행하는 실행 자원입니다. Thread 수, registers, shared memory와 blocks limit이 동시에 resident work를 제한합니다. Hopper에도 이 원리는 그대로이므로 Tensor Core가 많다는 사실만으로 kernel이 빨라지지 않으며, tiles가 제때 도착하지 않으면 compute unit은 기다립니다.</p>
    <p>따라서 architecture 분석은 HBM/L2에서 shared memory로 데이터를 누가 옮기는지, arrival을 어떤 barrier로 알리는지, consumer warp가 얼마나 계산하는지, 다음 tile transfer와 겹치는지를 봅니다. Occupancy는 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-latency-hiding-occupancy">latency hiding 정본</a>대로 resource bound와 stall 감소를 분리해 해석합니다.</p>
  </section>

  <section id="tma" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">02 · TMA</p><h2 className="mt-2 text-2xl font-bold">한 thread가 transfer를 시작하고 나머지는 계산을 이어 간다</h2></header>
    <p>TMA는 global↔shared memory 사이의 1D부터 다차원 tensor transfer를 descriptor로 기술하고 asynchronous하게 실행하는 Hopper mechanism입니다. 주소 계산과 element-wise copy instruction을 많은 threads가 직접 수행하는 대신 작은 producer 역할이 transfer를 발행하고, consumer는 completion barrier 이후 shared tile을 사용합니다.</p>
    <ExplainedFormula question="두 단계 pipeline이 steady state에서 tile 하나당 얼마나 걸리는지 어떻게 근사할까?" idea={<>Load와 compute를 겹치면 매 tile마다 둘을 더하지 않고 더 느린 단계가 cadence를 정합니다. 처음 채우기와 마지막 비우기 비용은 별도로 남습니다.</>} formula={String.raw`\begin{aligned}T_{stage}&=\max(T_{copy},T_{compute})\\[3pt]T_{pipe}&\approx T_{fill}+(L-1)T_{stage}+T_{drain}\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}T_{stage}&=\underbrace{\max(T_{copy},T_{compute})}_{\text{경계 후보 선택}}\\[3pt]T_{pipe}&\approx T_{fill}+(L-1)T_{stage}+T_{drain}\end{aligned}`}
    operations={[
      { expression: String.raw`\max(T_{copy},T_{compute})`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Load와 compute를 겹치면 매 tile마다"] },
    ]} terms={[
      {symbol:"L",name:"Tile stage 수",description:"K축 또는 workload를 따라 처리하는 tile 개수입니다."},
      {symbol:"T_{pipe}",name:"전체 pipeline 시간",description:"Fill부터 마지막 drain까지 L tiles를 완료하는 근사 elapsed time입니다."},
      {symbol:"T_{copy}",name:"Tile transfer 시간",description:"TMA가 source에서 shared/DSM으로 옮기고 arrival을 알릴 때까지의 시간입니다."},
      {symbol:"T_{compute}",name:"Tile 계산 시간",description:"Consumer가 현재 tile에서 수행하는 matrix 또는 일반 계산 시간입니다."},
      {symbol:"T_{stage}",name:"Steady-state cadence",description:"Overlap이 성립할 때 copy와 compute 중 더 느린 단계가 정하는 tile 간격입니다."},
      {symbol:"T_{fill},T_{drain}",name:"Pipeline 경계 비용",description:"첫 data가 준비되고 마지막 작업이 끝나는 비중첩 구간입니다."},
    ]} assumptions={["독립 buffer stage가 있어 producer가 다음 tile을 consumer와 겹칠 수 있습니다.", "Bandwidth contention, descriptor setup, barrier와 tail imbalance는 경계 항에 포함하거나 실측합니다."]} interpretation="copy 3µs, compute 5µs라면 steady cadence는 약 5µs지만 전체가 정확히 L×5µs인 것은 아닙니다. Tile 하나뿐이거나 dependency가 겹침을 막으면 합에 가까워집니다." />
    <p>TMA를 호출했다고 overlap이 자동으로 생기지는 않습니다. Buffer를 최소 두 stage로 운영하고, 이전 consumer가 끝나기 전에 producer가 같은 shared region을 덮어쓰지 않도록 barrier phase를 맞춰야 합니다. 작은·불규칙 transfer는 descriptor와 synchronization 비용 때문에 일반 load보다 불리할 수 있습니다.</p>
    <div id="paper-hopper-tuning"><CitationBlock type="code" citeKey={1} source="NVIDIA Hopper Tuning Guide · CUDA 12.8.1" href={TUNING}><p><strong>문제:</strong> Compute capability 9.0의 resource, TMA, asynchronous execution과 thread block cluster를 최적화에 적용해야 합니다.</p><p><strong>핵심 아이디어:</strong> Hopper-specific execution·memory 기능과 programming considerations를 제공합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1, compute capability 9.0 target과 실제 device properties를 확인합니다.</p><p><strong>근거 범위:</strong> Hopper tuning behavior와 공식 programming guidance입니다.</p><p><strong>일반화 금지:</strong> TMA·cluster 사용이 모든 kernel에서 speedup을 보장하거나 이후 architecture와 완전히 동일하다는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="cluster" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">03 · Thread block cluster와 DSM</p><h2 className="mt-2 text-2xl font-bold">Block-local shared memory를 인접 blocks의 명시적 협력으로 확장한다</h2></header>
    <p><strong>Thread block cluster</strong>는 여러 blocks를 같은 GPC 안에서 함께 scheduling할 수 있는 optional hierarchy입니다. Cluster 안의 block은 자신의 shared-memory 주소를 다른 block의 rank로 mapping해 접근하는 <strong>DSM(Distributed Shared Memory)</strong>을 사용할 수 있습니다. 이는 chip 전체가 공유하는 cache가 아니라, 정해진 cluster와 lifetime 안의 협력 범위입니다.</p>
    <ClusterScopeViz />
    <p>Histogram bin이나 working set이 block shared memory 하나에는 크지만 cluster 합산 capacity에는 맞는 경우가 후보입니다. 반대로 remote DSM access와 cluster synchronization이 local shared access보다 비싸고 cluster residency 조건이 scheduling을 제한할 수 있으므로, global-memory baseline과 traffic·stall·occupancy·end-to-end를 비교해야 합니다.</p>
    <div id="paper-cuda-clusters"><CitationBlock type="code" citeKey={2} source="NVIDIA CUDA C++ Programming Guide 12.8.1 · Thread Block Clusters" href={GUIDE}><p><strong>문제:</strong> Cluster launch, synchronization과 distributed shared-memory address space의 semantics를 정의해야 합니다.</p><p><strong>핵심 아이디어:</strong> Grid와 block 사이의 optional cluster hierarchy와 cluster group primitives를 제공합니다.</p><p><strong>중요 가정:</strong> Compute capability 9.0 이상, portable/architecture-specific cluster size와 launch API를 확인합니다.</p><p><strong>근거 범위:</strong> CUDA 12.8.1의 programming model·API semantics입니다.</p><p><strong>일반화 금지:</strong> Cluster 크기나 DSM latency가 모든 device에서 고정이라는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="transformer-engine" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">04 · Transformer Engine</p><h2 className="mt-2 text-2xl font-bold">FP8 throughput은 format·scale·accumulation·quality를 함께 고정해야 비교할 수 있다</h2></header>
    <p>Hopper Transformer Engine은 Tensor Core matrix 연산에서 FP8과 더 높은 precision을 workload에 맞게 사용하도록 지원하는 hardware/software 경로입니다. 여기서 FP8은 숫자 저장 format만이 아니라 tensor별 scaling, overflow/underflow 관리, accumulation precision과 model quality evaluation을 포함한 contract입니다.</p>
    <p>Peak Tensor Core 수치는 dense/sparse 여부, input·accumulator precision, clock과 특정 instruction path에 따라 다른 ceiling입니다. 일반 FP32 CUDA core peak와 FP8 Tensor Core peak를 한 열에서 직접 나누거나, peak 비율을 training time speedup으로 읽으면 data movement·non-GEMM·collective·optimizer와 convergence 차이를 놓칩니다.</p>
    <div id="paper-hopper-whitepaper"><CitationBlock citeKey={3} source="NVIDIA Hopper Architecture In-Depth / Whitepaper" href={WHITEPAPER}><p><strong>문제:</strong> Hopper의 Tensor Core, Transformer Engine, TMA·cluster와 system interconnect 설계 의도를 설명합니다.</p><p><strong>핵심 아이디어:</strong> AI·HPC workload를 위한 precision·data movement·scaling 기능을 architecture 수준에서 통합합니다.</p><p><strong>중요 가정:</strong> 발표된 Hopper/H100 product configuration과 문서 revision의 peak 조건을 따릅니다.</p><p><strong>근거 범위:</strong> NVIDIA가 공개한 architecture 기능과 명시된 benchmark 조건입니다.</p><p><strong>일반화 금지:</strong> Marketing peak 또는 특정 benchmark 배수가 임의 application의 achieved speedup을 보장하지 않습니다.</p></CitationBlock></div>
  </section>

  <section id="release-gate" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">05 · 호환성과 채택</p><h2 className="mt-2 text-2xl font-bold">Feature path와 fallback을 모두 검증한 뒤 deployment를 연다</h2></header>
    <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Hopper gate:</strong> GPU UUID·compute capability, driver·Toolkit·compiler, resolved kernel과 dtype/scale policy를 고정합니다. TMA/cluster candidate는 unsupported target fallback과 odd/edge shape parity를 먼저 통과하고 warm-up 뒤 kernel/end-to-end median·p95, achieved bandwidth/FLOP/s, actual traffic, occupancy·stall과 quality metric을 baseline에 paired 비교합니다. 기능 존재만 확인했거나 peak만 높으면 채택하지 않습니다.</aside>
  </section>
</article>}

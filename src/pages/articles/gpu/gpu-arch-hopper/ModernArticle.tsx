import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ClusterScopeViz, HopperPipelineViz } from "./viz/ModernHopperViz";

const TUNING = "https://docs.nvidia.com/cuda/archive/12.8.1/hopper-tuning-guide/index.html";
const GUIDE = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";
const PTX = "https://docs.nvidia.com/cuda/archive/12.8.1/parallel-thread-execution/index.html#asynchronous-warpgroup-level-matrix-instructions";
const WHITEPAPER = "https://resources.nvidia.com/en-us-tensor-core/nvidia-hopper-architecture-whitepaper";

export default function ModernHopperArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6">
    <header className="space-y-3"><p className="text-sm font-semibold text-primary">Hopper를 기능 목록이 아니라 실행 경로로</p><h2 className="text-3xl font-bold tracking-tight">다음 tile을 옮기는 동안 현재 tile을 계산한다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">행렬곱 하나를 생각해 보겠습니다. A·B 원본은 HBM에 있고, Tensor Core가 쓸 조각은 더 가까운 shared memory에 있어야 합니다.</p>
    <p>여러 thread가 주소를 계산하며 조각을 옮기면 계산에 쓸 thread와 instruction이 줄어듭니다. Hopper에서는 <strong>TMA(Tensor Memory Accelerator)</strong>가 이동을 맡고 <strong>transaction barrier</strong>가 도착을 알립니다. 그러면 네 warp의 <strong>WGMMA</strong>가 도착한 tile을 계산할 수 있습니다.</p>
    <p>그래서 질문도 자연스럽게 이어집니다. 복사를 시작한 뒤 언제 읽어도 되는가? 다음 tile이 현재 tile을 덮어쓰지 않게 하려면 무엇이 필요한가? 여러 block까지 협력하면 같은 방법을 그대로 쓸 수 있는가? 아래에서는 이 세 질문을 한 tile의 이동 경로로 답합니다.</p>
    <p>이 글은 일반적인 SM·warp·memory hierarchy를 <a className="text-primary hover:underline" href="/cs/gpu/gpu-architecture">GPU architecture 정본</a>에서 재사용하고, Hopper에서 달라진 producer–consumer pipeline과 deployment gate만 소유합니다. H100의 peak 수치를 모든 Hopper SKU나 실제 kernel 성능으로 확대하지 않습니다.</p>
    <HopperPipelineViz />
    <aside className="rounded-lg border border-primary/25 bg-primary/5 p-5 text-sm leading-6"><strong>먼저 범위를 고정합니다.</strong> 위 그림은 한 thread block 안의 가장 단순한 HBM → shared memory → WGMMA 경로입니다. <strong>DSM은 이 경로의 필수 단계가 아닙니다.</strong> 여러 block이 cluster로 협력할 때만 각 block의 shared memory를 rank로 찾아가는 별도 경로가 생깁니다.</aside>
    <ContentBoundary article="gpu-arch-hopper" />
  </section>

  <section id="sm-structure" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">01 · SM에서 먼저 볼 것</p><h2 className="mt-2 text-2xl font-bold">계산 unit보다 어떤 warp가 무엇을 기다리는지 추적한다</h2></header>
    <p><strong>SM(Streaming Multiprocessor)</strong>은 block이 배치되고 warps가 instruction을 발행하는 실행 자원입니다. Thread 수, registers, shared memory와 blocks limit이 동시에 resident work를 제한합니다. Hopper에도 이 원리는 그대로이므로 Tensor Core가 많다는 사실만으로 kernel이 빨라지지 않으며, tiles가 제때 도착하지 않으면 compute unit은 기다립니다.</p>
    <p>따라서 architecture 분석은 HBM/L2에서 shared memory로 데이터를 누가 옮기는지, arrival을 어떤 barrier로 알리는지, consumer warp가 얼마나 계산하는지, 다음 tile transfer와 겹치는지를 봅니다. Occupancy는 <a className="text-primary hover:underline" href="/cs/gpu/gpu-architecture#gpu-latency-hiding-occupancy">latency hiding 정본</a>대로 resource bound와 stall 감소를 분리해 해석합니다.</p>
  </section>

  <section id="tma" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">02 · TMA에서 WGMMA까지</p><h2 className="mt-2 text-2xl font-bold">한 thread가 tile을 부르고, barrier가 문을 열면 네 warp가 계산한다</h2></header>
    <p>
            TMA는 global↔shared memory 사이의 큰 block 또는 tensor tile을 asynchronous하게 옮기는 Hopper mechanism입니다.
            1D bulk copy와 달리 다차원 bulk tensor copy는 host가 만든 <strong>tensor map</strong>에 1~5차원 크기·stride·box와 layout을 담습니다.
          </p>
    <p>선출된 한 thread가 tile 좌표와 함께 transfer를 발행하면 hardware가 주소 생성과 data movement를 진행합니다. Consumer는 transaction barrier가 약속된 byte의 도착을 알린 뒤 shared tile을 사용합니다.</p>
    <p><strong>WGMMA</strong>는 이 tile을 소비하는 Hopper의 warpgroup-level matrix instruction입니다. 연속한 네 warp, 즉 128 threads가 함께 <code>D = A × B + C</code>를 발행합니다.</p>
    <p>B operand는 shared memory descriptor에서 읽고 A는 shared memory 또는 registers에서 올 수 있습니다. Accumulator C·D는 warpgroup의 registers에 나뉘어 놓입니다. 즉 TMA가 Tensor Core 안으로 data를 직접 밀어 넣는 것이 아닙니다. <strong>TMA가 shared tile을 준비하고 barrier가 소유권을 넘긴 뒤 WGMMA가 그 tile을 읽습니다.</strong></p>
    <ExplainedFormula question="두 단계 pipeline이 steady state에서 tile 하나당 얼마나 걸리는지 어떻게 근사할까?" idea={<>Load와 compute를 겹치면 매 tile마다 둘을 더하지 않고 더 느린 단계가 cadence를 정합니다. 처음 채우기와 마지막 비우기 비용은 별도로 남습니다.</>} formula={String.raw`\begin{aligned}T_{stage}&=\max(T_{copy},T_{compute})\\[3pt]T_{pipe}&\approx T_{fill}+(L-1)T_{stage}+T_{drain}\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}T_{stage}&=\underbrace{\max(T_{copy},T_{compute})}_{\text{느린 단계가 cadence}}\\[3pt]T_{pipe}&\approx\underbrace{T_{fill}}_{\text{처음 채우기}}+\underbrace{(L-1)T_{stage}}_{\text{나머지 tile}}+\underbrace{T_{drain}}_{\text{마지막 비우기}}\end{aligned}`}
    operations={[
          { expression: String.raw`\max(T_{copy},T_{compute})`, annotation: ["load와 compute를 겹치면 둘의 합이 아니라", "느린 쪽이 tile 하나의 cadence를 정함", "copy 3µs, compute 5µs → 약 5µs"] },
          { expression: String.raw`(L-1)T_{stage}`, annotation: ["첫 tile 뒤 L−1개가 이 cadence로 흐름", "fill·drain이 따로 남아 L×5µs와 다름", "겹침이 막히면 합에 가까워집니다"] },
        ]} terms={[
      {symbol:"L",name:"Tile stage 수",description:"K축 또는 workload를 따라 처리하는 tile 개수입니다."},
      {symbol:"T_{pipe}",name:"전체 pipeline 시간",description:"Fill부터 마지막 drain까지 L tiles를 완료하는 근사 elapsed time입니다."},
      {symbol:"T_{copy}",name:"Tile transfer 시간",description:"TMA가 source에서 shared/DSM으로 옮기고 arrival을 알릴 때까지의 시간입니다."},
      {symbol:"T_{compute}",name:"Tile 계산 시간",description:"Consumer가 현재 tile에서 수행하는 matrix 또는 일반 계산 시간입니다."},
      {symbol:"T_{stage}",name:"Steady-state cadence",description:"Overlap이 성립할 때 copy와 compute 중 더 느린 단계가 정하는 tile 간격입니다."},
      {symbol:"T_{fill},T_{drain}",name:"Pipeline 경계 비용",description:"첫 data가 준비되고 마지막 작업이 끝나는 비중첩 구간입니다."},
    ]} assumptions={["독립 buffer stage가 있어 producer가 다음 tile을 consumer와 겹칠 수 있습니다.", "Bandwidth contention, descriptor setup, barrier와 tail imbalance는 경계 항에 포함하거나 실측합니다."]} interpretation="copy 3µs, compute 5µs라면 steady cadence는 약 5µs지만 전체가 정확히 L×5µs인 것은 아닙니다. Tile 하나뿐이거나 dependency가 겹침을 막으면 합에 가까워집니다." />
    <p>
            TMA를 호출했다고 overlap이 자동으로 생기지는 않습니다. Buffer를 최소 두 stage로 운영하고 이전 consumer가 끝나기 전에 producer가 같은
            shared region을 덮어쓰지 않도록 barrier phase를 맞춰야 합니다. 작은·불규칙 transfer는 descriptor와 synchronization 비용
            때문에 일반 load보다 불리할 수 있습니다.
          </p>
    <div id="paper-hopper-wgmma"><CitationBlock type="code" citeKey={2} source="NVIDIA PTX ISA 12.8.1 · Asynchronous Warpgroup-level Matrix Instructions" href={PTX}><p><strong>문제:</strong> Hopper의 warpgroup이 shared-memory operand와 register accumulator로 비동기 matrix multiply를 수행하는 정확한 instruction contract가 필요합니다.</p><p><strong>핵심 아이디어:</strong> <code>wgmma.mma_async</code>의 128-thread scope, operand source·descriptor·ordering과 completion semantics를 정의합니다.</p><p><strong>중요 가정:</strong> 해당 instruction을 지원하는 architecture target과 PTX ISA 12.8.1의 shape·type·alignment 제약을 따릅니다.</p><p><strong>근거 범위:</strong> WGMMA가 읽는 memory와 accumulator 위치, warpgroup 실행 범위입니다.</p><p><strong>일반화 금지:</strong> WGMMA를 발행하면 TMA overlap이나 end-to-end speedup이 자동으로 생긴다는 뜻은 아닙니다.</p></CitationBlock></div>
    <div id="paper-hopper-tuning"><CitationBlock type="code" citeKey={1} source="NVIDIA Hopper Tuning Guide · CUDA 12.8.1" href={TUNING}><p><strong>문제:</strong> Compute capability 9.0의 resource, TMA, asynchronous execution과 thread block cluster를 최적화에 적용해야 합니다.</p><p><strong>핵심 아이디어:</strong> Hopper-specific execution·memory 기능과 programming considerations를 제공합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1, compute capability 9.0 target과 실제 device properties를 확인합니다.</p><p><strong>근거 범위:</strong> Hopper tuning behavior와 공식 programming guidance입니다.</p><p><strong>일반화 금지:</strong> TMA·cluster 사용이 모든 kernel에서 speedup을 보장하거나 이후 architecture와 완전히 동일하다는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="cluster" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">03 · Thread block cluster와 DSM</p><h2 className="mt-2 text-2xl font-bold">Block-local shared memory를 인접 blocks의 명시적 협력으로 확장한다</h2></header>
    <p><strong>Thread block cluster</strong>는 여러 blocks를 같은 GPC 안에서 함께 scheduling할 수 있는 optional hierarchy입니다. Cluster 안의 block은 다른 block의 shared-memory 주소를 rank로 mapping해 접근할 수 있습니다.</p>
    <p>이 주소 공간이 <strong>DSM(Distributed Shared Memory)</strong>입니다. Chip 전체가 공유하는 cache가 아니라, 정해진 cluster와 lifetime 안에서만 쓰는 협력 범위입니다.</p>
    <ClusterScopeViz />
    <p>
            Histogram bin이나 working set이 block shared memory 하나에는 크지만 cluster 합산 capacity에는 맞는 경우가 후보입니다.
          </p>
    <p>하지만 remote DSM access와 cluster synchronization은 local shared access보다 비쌉니다. Cluster residency가 scheduling을 제한할 수도 있습니다. 따라서 global-memory baseline과 traffic·stall·occupancy·end-to-end를 함께 비교해야 합니다.</p>
    <div id="paper-cuda-clusters"><CitationBlock type="code" citeKey={3} source="NVIDIA CUDA C++ Programming Guide 12.8.1 · Thread Block Clusters" href={GUIDE}><p><strong>문제:</strong> Cluster launch, synchronization과 distributed shared-memory address space의 semantics를 정의해야 합니다.</p><p><strong>핵심 아이디어:</strong> Grid와 block 사이의 optional cluster hierarchy와 cluster group primitives를 제공합니다.</p><p><strong>중요 가정:</strong> Compute capability 9.0 이상, portable/architecture-specific cluster size와 launch API를 확인합니다.</p><p><strong>근거 범위:</strong> CUDA 12.8.1의 programming model·API semantics입니다.</p><p><strong>일반화 금지:</strong> Cluster 크기나 DSM latency가 모든 device에서 고정이라는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="transformer-engine" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">04 · Transformer Engine</p><h2 className="mt-2 text-2xl font-bold">FP8은 숫자 형식·범위·누산·품질을 함께 본다</h2></header>
    <p>Hopper Transformer Engine은 Tensor Core matrix 연산에서 FP8과 더 높은 precision을 workload에 맞게 사용하도록 지원하는 hardware/software 경로입니다. 여기서 FP8은 숫자 저장 format만이 아니라 tensor별 scaling, overflow/underflow 관리, accumulation precision과 model quality evaluation을 포함한 contract입니다.</p>
    <p>
            Peak Tensor Core 수치는 dense/sparse 여부, input·accumulator precision, clock과 특정 instruction path에 따라
            다른 ceiling입니다.
          </p>
    <p>일반 FP32 CUDA core peak와 FP8 Tensor Core peak를 한 열에서 직접 나누면 안 됩니다. 그 비율을 training time speedup으로 읽어도 안 됩니다. Data movement·non-GEMM·collective·optimizer와 convergence 차이가 빠지기 때문입니다.</p>
    <div id="paper-hopper-whitepaper"><CitationBlock citeKey={4} source="NVIDIA Hopper Architecture In-Depth / Whitepaper" href={WHITEPAPER}><p><strong>문제:</strong> Hopper의 Tensor Core, Transformer Engine, TMA·cluster와 system interconnect 설계 의도를 설명합니다.</p><p><strong>핵심 아이디어:</strong> AI·HPC workload를 위한 precision·data movement·scaling 기능을 architecture 수준에서 통합합니다.</p><p><strong>중요 가정:</strong> 발표된 Hopper/H100 product configuration과 문서 revision의 peak 조건을 따릅니다.</p><p><strong>근거 범위:</strong> NVIDIA가 공개한 architecture 기능과 명시된 benchmark 조건입니다.</p><p><strong>일반화 금지:</strong> Marketing peak 또는 특정 benchmark 배수가 임의 application의 achieved speedup을 보장하지 않습니다.</p></CitationBlock></div>
  </section>

  <section id="release-gate" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">05 · 호환성과 채택</p><h2 className="mt-2 text-2xl font-bold">Feature path와 fallback을 모두 검증한 뒤 deployment를 연다</h2></header>
    <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Hopper gate:</strong> GPU UUID·compute capability, architecture target, driver·Toolkit·compiler, resolved kernel과 dtype/scale policy를 고정합니다. TMA·WGMMA·cluster candidate는 unsupported target fallback과 odd/edge shape parity를 먼저 통과하고 warm-up 뒤 kernel/end-to-end median·p95, achieved bandwidth/FLOP/s, actual traffic, occupancy·stall과 quality metric을 baseline에 paired 비교합니다. 기능 존재만 확인했거나 peak만 높으면 채택하지 않습니다.</aside>
  </section>
</article>}

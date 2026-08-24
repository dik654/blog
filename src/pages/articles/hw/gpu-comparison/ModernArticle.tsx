import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FitAxesViz, GpuChoiceFlowViz } from "./viz/ModernGpuComparisonViz";

const RTX5090="https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/";
const RTX4090="https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/";
const A100="https://www.nvidia.com/en-us/data-center/a100/";
const H100="https://www.nvidia.com/en-us/data-center/h100/";

export default function ModernGpuComparisonArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6">
    <header className="space-y-3"><p className="text-sm font-semibold text-primary">RTX 4090·5090·A100·H100을 고르는 순서</p><h2 className="text-3xl font-bold tracking-tight">GPU 비교는 TFLOPS 순위표가 아니라 workload가 끝까지 통과할 경로를 고르는 일이다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">같은 “GPU”라도 GeForce RTX 4090·5090은 workstation/consumer board이고, A100·H100은 server platform에서 ECC memory, enterprise software·support, multi-GPU fabric과 운영 기능을 제공하는 datacenter accelerator입니다. 제품명만 놓고 peak 숫자를 비교하면 memory capacity, precision 조건, form factor와 scale-out 비용을 놓칩니다.</p>
    <p>먼저 model·dataset·batch·precision·latency SLA와 concurrency를 고정하고 후보가 memory와 software 조건을 만족하는지 확인합니다. 그 뒤 같은 implementation에서 achieved throughput·latency·power를 측정합니다. 일반적인 Roofline은 <a className="text-primary hover:underline" href="/gpu/gpu-architecture#gpu-peak-achieved-boundary">GPU architecture 정본</a>, PCIe·NVLink 경계는 <a className="text-primary hover:underline" href="/gpu/gpu-interconnects">GPU interconnect 정본</a>, GPU–HCA direct path는 <a className="text-primary hover:underline" href="/gpu/rdma-roce#gpudirect-topology">RDMA·RoCE 정본</a>을 재사용합니다.</p>
    <GpuChoiceFlowViz />
    <ContentBoundary article="hw-gpu-comparison" />
  </section>

  <section id="workload-envelope" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">01 · Workload envelope</p><h2 className="mt-2 text-2xl font-bold">평균 하나 대신 shape·batch·precision·동시 실행 범위를 적는다</h2></header>
    <p><strong>Workload envelope</strong>는 GPU가 실제로 처리해야 할 입력 범위와 운영 조건입니다. LLM inference라면 model revision, weight dtype, context/prefill/decode 길이, KV-cache dtype, batch·concurrency와 TTFT/TPOT SLA가 들어갑니다. CUDA kernel이라면 M/N/K 또는 input size, data layout, precision, correctness tolerance와 transfer 포함 여부가 필요합니다.</p>
    <p>예를 들어 24GB board에 weight가 22GB 들어간다는 사실만으로 서비스가 가능한 것은 아닙니다. Runtime workspace, KV cache, graph capture, allocator fragmentation과 동시 request headroom을 더해야 합니다. 반대로 training에 필요한 memory를 inference 요구에 그대로 적용해서도 안 됩니다.</p>
    <ExplainedFormula question="후보 GPU가 workload를 안정적으로 담을 수 있는지 어떤 예산으로 검사할까?" idea={<>고정 weight뿐 아니라 request마다 늘어나는 state와 runtime workspace, fragmentation·운영 headroom을 합쳐 usable device memory보다 작은지 봅니다.</>} formula={String.raw`\begin{aligned}M_{need}&=M_{weight}+C\,M_{state}\\&\quad+M_{workspace}+M_{headroom}\\[3pt]M_{need}&\le M_{usable}\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}M_{need}&=\underbrace{M_{weight}+C\,M_{state}}_{\text{고정 memory 계산}}\\&\quad+M_{workspace}+M_{headroom}\\[3pt]M_{need}&\le \underbrace{M_{usable}}_{\text{실사용 가능 capacity 계산}}\end{aligned}`}
    operations={[
      { expression: String.raw`M_{weight}+C\,M_{state}`, annotation: ["고정 memory이(가) 식의 결과에 기여하는 방식을","계산합니다.","고정 weight뿐 아니라 request마다"] },
      { expression: String.raw`M_{usable}`, annotation: ["실사용 가능 capacity이(가) 식의 결과에 기여하는","방식을 계산합니다.","고정 weight뿐 아니라 request마다"] },
    ]} terms={[
      {symbol:"M_{need}",name:"필요한 총 memory",description:"Workload profile을 실행하기 위해 동시에 resident해야 할 allocation의 합입니다."},
      {symbol:"M_{weight}",name:"고정 memory",description:"Model weight·constant table처럼 request와 무관한 allocation입니다."},
      {symbol:"C",name:"동시 작업 수",description:"동시에 resident한 request·batch slot 수입니다."},
      {symbol:"M_{state}",name:"작업당 state",description:"KV cache·activation·temporary처럼 concurrency에 따라 늘어나는 memory입니다."},
      {symbol:"M_{workspace}",name:"Runtime workspace",description:"Kernel workspace·graph capture·library temporary allocation입니다."},
      {symbol:"M_{headroom}",name:"운영 여유",description:"Fragmentation·변동 input·runtime reserve와 성장 여유입니다."},
      {symbol:"M_{usable}",name:"실사용 가능 capacity",description:"제품 표기 capacity에서 runtime·display/OS·reserved allocation을 고려한 값입니다."},
    ]} assumptions={["동일 model/runtime revision과 실제 allocator behavior를 사용합니다.", "State가 길이·batch에 비례하지 않거나 shared되는 경우에는 profile별 실제 allocation으로 바꿉니다."]} interpretation="Weight만 fit해도 C가 늘면 OOM이 날 수 있습니다. 이 부등식은 latency SLA나 memory bandwidth가 충분하다는 뜻은 아닙니다." />
    <FitAxesViz />
  </section>

  <section id="consumer" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">02 · RTX 4090과 RTX 5090</p><h2 className="mt-2 text-2xl font-bold">큰 local memory bandwidth와 낮은 도입 장벽 대신 운영 경계를 직접 책임진다</h2></header>
    <p>NVIDIA 공식 제품 페이지 기준 RTX 4090은 Ada Lovelace와 24GB GDDR6X, RTX 5090은 Blackwell과 32GB GDDR7을 제공합니다. 이 값은 product page를 확인한 시점의 board-level specification이며 partner board, driver와 power limit에 따라 실제 동작이 달라질 수 있습니다.</p>
    <p>Single-node prototyping, rendering, local inference처럼 한 board에서 workload가 fit하고 GeForce software/support 경계가 허용되면 강한 후보입니다. 그러나 memory가 부족해 tensor parallel을 강제하거나 24/7 rack 운영, validated server platform, MIG-style isolation, enterprise support가 필수라면 board 가격만으로 비교할 수 없습니다. 특히 display가 붙은 workstation과 headless server의 usable memory·cooling·power 조건은 다릅니다.</p>
    <div id="paper-geforce-specs"><CitationBlock type="code" citeKey={1} source="NVIDIA GeForce RTX 5090 / RTX 4090 official specifications" href={RTX5090}><p><strong>문제:</strong> 두 GeForce 후보의 architecture, memory configuration·bandwidth와 board 요구를 공식 제품 기준으로 확인합니다.</p><p><strong>핵심 아이디어:</strong> 동일 vendor product page에서 세대·memory·feature를 비교하되 workload 실측과 분리합니다.</p><p><strong>중요 가정:</strong> NVIDIA product page 확인 시점과 Founders Edition/reference specification을 기록하며 RTX 4090 원문도 함께 확인합니다: <a className="text-primary underline" href={RTX4090}>RTX 4090 공식 페이지</a>.</p><p><strong>근거 범위:</strong> 공개된 product specifications와 명시된 feature 조건입니다.</p><p><strong>일반화 금지:</strong> AI TOPS·bandwidth 비율이 임의 model의 latency·throughput 배수라는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="datacenter" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">03 · A100과 H100</p><h2 className="mt-2 text-2xl font-bold">SKU·form factor·precision 조건과 fabric을 함께 읽는다</h2></header>
    <p>A100은 Ampere 세대, H100은 Hopper 세대 datacenter GPU입니다. 같은 이름 안에도 PCIe·SXM, memory capacity와 power가 다른 SKU가 있으므로 “H100 80GB” 같은 축약만으로 platform을 고르면 안 됩니다. H100의 TMA·Transformer Engine·cluster는 <a className="text-primary hover:underline" href="/gpu/gpu-arch-hopper">Hopper 글</a>에서 execution path와 fallback 조건을 자세히 다룹니다.</p>
    <p>Multi-GPU training·large inference에서는 GPU 한 장의 HBM뿐 아니라 GPU↔GPU fabric topology, host PCIe root, collective library와 node network가 step/token critical path를 만듭니다. NVLink peak를 application all-reduce bandwidth로 읽지 말고 payload·topology·collective algorithm을 고정해 achieved bus bandwidth와 elapsed time을 측정합니다.</p>
    <div id="paper-a100-datasheet"><CitationBlock type="code" citeKey={2} source="NVIDIA A100 Tensor Core GPU official product material" href={A100}><p><strong>문제:</strong> A100의 Ampere architecture, memory·MIG·form-factor별 capability를 공식 범위에서 확인합니다.</p><p><strong>핵심 아이디어:</strong> Datacenter accelerator의 compute뿐 아니라 capacity, bandwidth, partitioning과 platform integration을 함께 제시합니다.</p><p><strong>중요 가정:</strong> 비교하려는 정확한 PCIe/SXM SKU와 공식 datasheet revision을 기록합니다.</p><p><strong>근거 범위:</strong> NVIDIA가 게시한 A100 product specifications와 feature입니다.</p><p><strong>일반화 금지:</strong> Peak tensor throughput이나 MIG 존재가 target service throughput·격리를 자동 보장하지 않습니다.</p></CitationBlock></div>
    <div id="paper-h100-datasheet"><CitationBlock type="code" citeKey={3} source="NVIDIA H100 Tensor Core GPU official product specifications" href={H100}><p><strong>문제:</strong> H100 SKU별 precision peak, HBM capacity/bandwidth, power와 interconnect를 확인합니다.</p><p><strong>핵심 아이디어:</strong> Hopper architecture의 accelerator·fabric capability를 form factor별로 구분합니다.</p><p><strong>중요 가정:</strong> H100 SXM/NVL/PCIe variant, sparsity 표기, precision과 system configuration을 고정합니다.</p><p><strong>근거 범위:</strong> NVIDIA 공식 H100 제품 페이지에 명시된 specs와 benchmark 조건입니다.</p><p><strong>일반화 금지:</strong> FP8/TF32 peak나 특정 training 배수를 다른 model·software·quality 조건의 결과로 확대하지 않습니다.</p></CitationBlock></div>
  </section>

  <section id="blockchain" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">04 · Workload별 선택과 실측</p><h2 className="mt-2 text-2xl font-bold">Hash·MSM·NTT·LLM은 같은 GPU 비교표를 쓰지 않는다</h2></header>
    <p>Hash batch는 integer/bit operation과 memory access, MSM은 field arithmetic·bucket contention·reduction, NTT는 stage별 global synchronization과 traffic이 병목일 수 있습니다. LLM decode는 weight·KV traffic과 batch에 민감하고 training은 matrix throughput·collective·optimizer memory가 중요합니다. 따라서 한 benchmark의 순위를 다른 workload에 옮기지 않습니다.</p>
    <ExplainedFormula question="구매 비용이 아니라 실제 처리량 기준 비용을 어떻게 비교할까?" idea={<>같은 SLA와 quality를 만족한 후보만 대상으로 일정 기간의 장비·전력·운영비를 그 기간 완료한 유효 작업 수로 나눕니다.</>} formula={String.raw`C_{work}=\frac{C_{hardware}+C_{energy}+C_{ops}}{N_{valid\ work}}`}
    annotatedFormula={String.raw`C_{work}=\underbrace{\frac{C_{hardware}+C_{energy}+C_{ops}}{N_{valid\ work}}}_{\text{기준량당 비율}}`}
    operations={[
      { expression: String.raw`\frac{C_{hardware}+C_{energy}+C_{ops}}{N_{valid\ work}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","같은 SLA와 quality를 만족한 후보만 대상으로 일정","기간의 장비·전력·운영비를 그 기간 완료한 유효 작업 수로","나눕니다."] },
    ]} terms={[
      {symbol:"C_{work}",name:"유효 작업당 비용",description:"선택한 기간에 SLA와 quality를 통과한 output 하나를 만드는 총비용입니다."},
      {symbol:"C_{hardware}",name:"기간 환산 장비비",description:"구매·임대·감가와 필요한 server 부품을 포함합니다."},
      {symbol:"C_{energy}",name:"전력·냉각 비용",description:"Wall-power measurement와 시설 PUE 경계를 명시합니다."},
      {symbol:"C_{ops}",name:"운영 비용",description:"Support, downtime, engineer time과 capacity reserve입니다."},
      {symbol:"N_{valid\\ work}",name:"유효 완료 작업 수",description:"Correctness·quality·latency SLA를 모두 통과한 outputs입니다."},
    ]} assumptions={["같은 workload trace·quality threshold·기간과 availability target을 사용합니다.", "중고가·지역 전력·세금처럼 변하는 값은 결정 시점 견적으로 다시 넣습니다."]} interpretation="싼 board가 OOM·downtime·scale-out overhead로 유효 처리량이 낮으면 작업당 비용은 높을 수 있습니다. 반대로 enterprise feature가 필요 없는 단일 사용자 workload에서는 datacenter premium이 회수되지 않을 수 있습니다." />
  </section>

  <section id="release-gate" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">05 · 조달 gate</p><h2 className="mt-2 text-2xl font-bold">공식 spec은 후보를 거르는 입력이고 최종 선택은 paired benchmark다</h2></header>
    <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Procurement gate:</strong> 정확한 SKU·board/system·driver·runtime·power limit과 workload trace를 고정합니다. Capacity/OOM, correctness·quality, software/support와 form-factor 조건을 먼저 통과시킨 뒤 warm-up과 synchronization 경계를 맞춰 median/p95 latency, throughput, achieved bandwidth/FLOP/s, occupancy·traffic, wall power, multi-GPU scaling과 failure recovery를 측정합니다. 견적일·전력단가·support를 포함한 유효 작업당 비용과 성장 headroom으로 결정합니다.</aside>
  </section>
</article>}

import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ProofPipelineDagViz } from "./viz/ModernProofPipelineViz";

const GROTH16 = "https://eprint.iacr.org/2016/260";
const PLONK = "https://eprint.iacr.org/2019/953";
const BELLPERSON = "https://github.com/filecoin-project/bellperson/tree/728306c8ee52f53dbd55ea02557affcdfb546ae7";
const ICICLE = "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2";

export default function ModernGpuProofPipelineArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Kernel을 proof dependency에 맞춰 잇기</p><h2 className="text-3xl font-bold tracking-tight">GPU proof pipeline은 NTT와 MSM의 합이 아니라, transcript와 buffer lifetime이 제한하는 실행 DAG다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">증명 생성에는 witness 계산, polynomial 변환, commitment, transcript challenge, quotient/opening과 proof 조립이 이어집니다. 일부 NTT와 MSM은 GPU에서 크게 병렬화되지만, 다음 round의 challenge가 나오기 전에는 후속 polynomial을 만들 수 없고 아직 소비되지 않은 buffer를 재사용할 수도 없습니다. 따라서 kernel을 많이 겹치는 것보다 <strong>허용된 dependency 안에서 데이터 이동과 계산을 겹치고 검증 가능한 receipt를 남기는 일</strong>이 먼저입니다.</p>
      <p>Groth16의 QAP·proof equation은 <a className="text-primary hover:underline" href="/crypto/groth16">Groth16 정본</a>, PLONK의 gate·permutation·transcript는 <a className="text-primary hover:underline" href="/crypto/plonk">PLONK 정본</a>이 소유합니다. MSM·NTT의 계산 의미는 <a className="text-primary hover:underline" href="/gpu/msm-ntt">MSM/NTT workload 글</a>에서 재사용하고, 여기서는 proof round를 device jobs와 buffers로 내리는 orchestration만 다룹니다.</p>
      <ProofPipelineDagViz />
      <ContentBoundary article="gpu-proof-pipeline" />
    </section>

    <section id="stage-dag" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Stage DAG</p><h2 className="mt-2 text-2xl font-bold">고정 proof workload를 producer·consumer·barrier로 그린다</h2></header>
      <p>먼저 protocol, curve/field, circuit revision, SRS digest, domain size, public/private input seed, transcript hash와 backend SHA를 고정합니다. 각 stage에는 input buffers, output buffers, device, stream, completion event와 verifier-visible result를 적습니다. Edge는 단순한 실행 순서가 아니라 “이 output 또는 transcript challenge가 있어야 다음 stage가 유효하다”는 dependency입니다.</p>
      <p>Groth16에서는 witness와 QAP quotient가 proving-key MSM inputs를 만들고 A·B·C group elements로 이어집니다. PLONKish prover는 wire commitments를 transcript에 흡수한 뒤 challenges로 permutation·quotient·opening work를 만듭니다. 이름이 같은 NTT나 MSM이라도 round별 size, coset, curve group, input residency가 다르므로 고정 호출 횟수를 보편 법칙처럼 쓰지 않습니다.</p>
      <ExplainedFormula question="Pipeline stage들의 dependency를 어떤 실행 가능 조건으로 표현할까?" idea={<>Stage v는 모든 predecessor가 completion receipt를 냈고 필요한 buffers와 transcript state가 같은 generation일 때만 enqueue합니다.</>} formula={String.raw`\begin{aligned}D_v&=\bigwedge_{u\prec v}done(u)\\g_i&=gen(inputs_v)\\g_t&=gen(transcript_v)\\ready(v)&=D_v\land[g_i=g_t]\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}D_v&=\underbrace{\bigwedge_{u\prec v}done(u)}_{\text{Predecessor relation 계산}}\\g_i&=\underbrace{gen(inputs_v)}_{\text{Candidate stage 계산}}\\g_t&=\underbrace{gen(transcript_v)}_{\text{Candidate stage 계산}}\\ready(v)&=D_v\land[g_i=g_t]\end{aligned}`}
      operations={[
        { expression: String.raw`\bigwedge_{u\prec v}done(u)`, annotation: ["Predecessor relation이(가) 식의 결과에","기여하는 방식을 계산합니다.","Stage v는 모든 predecessor가","completion receipt를 냈고 필요한"] },
        { expression: String.raw`gen(inputs_v)`, annotation: ["Candidate stage이(가) 식의 결과에 기여하는","방식을 계산합니다.","Stage v는 모든 predecessor가","completion receipt를 냈고 필요한"] },
        { expression: String.raw`gen(transcript_v)`, annotation: ["Candidate stage이(가) 식의 결과에 기여하는","방식을 계산합니다.","Stage v는 모든 predecessor가","completion receipt를 냈고 필요한"] },
      ]} terms={[
        {symbol:"v",name:"Candidate stage",description:"NTT, MSM, transfer, transcript update 또는 proof assembly 작업입니다."},
        {symbol:"pred(v)",name:"Predecessors",description:"v의 input이나 challenge를 생산하는 선행 stages 집합입니다."},
        {symbol:"done(u)",name:"Completion receipt",description:"선행 stage u의 device event와 success/failure 결과입니다."},
        {symbol:"gen(\\cdot)",name:"Generation identity",description:"Circuit/SRS/input/transcript가 같은 proof attempt에 속함을 나타냅니다."},
        {symbol:"D_v",name:"Dependency predicate",description:"모든 선행 stage가 완료됐을 때만 참인 조건입니다."},
        {symbol:"u\\prec v",name:"Predecessor relation",description:"Stage u가 v보다 먼저 완료돼야 한다는 dependency edge입니다."},
        {symbol:"g_i,g_t",name:"Input·transcript generation",description:"두 값이 같아야 같은 proof attempt의 data와 challenge를 사용합니다."},
        {symbol:"ready(v)",name:"Enqueue permission",description:"v를 실행 queue에 넣어도 dependency가 깨지지 않는 조건입니다."},
      ]} assumptions={["DAG에는 모든 data·transcript·host/device dependency가 포함되고 cycle이 없습니다.","Event 완료는 kernel 성공과 output validation을 구분하며 실패는 downstream enqueue를 막습니다."]} interpretation="NTT가 끝났어도 다른 proof attempt의 transcript challenge를 붙이면 ready=false입니다. 이 조건은 scheduler 효율이나 cryptographic soundness 전체를 자동 증명하지 않습니다." />
      <div id="paper-groth16-pipeline"><CitationBlock type="paper" citeKey={1} source="Groth16 · On the Size of Pairing-based Non-interactive Arguments (2016/260)" href={GROTH16}><p><strong>문제:</strong> QAP relation을 작은 pairing-based non-interactive proof로 만드는 prover/verifier 구성이 필요합니다.</p><p><strong>핵심 기여:</strong> Relation-specific setup과 A∈G1, B∈G2, C∈G1 proof construction·verification equation을 제시합니다.</p><p><strong>중요 가정:</strong> 논문의 bilinear group, knowledge/soundness model, trusted setup과 relation을 전제로 합니다.</p><p><strong>근거 범위:</strong> Protocol dependency와 proof objects의 수학적 구성입니다.</p><p><strong>일반화 금지:</strong> 특정 GPU stage 비율·호출 횟수·속도를 제공하는 논문은 아닙니다.</p></CitationBlock></div>
      <div id="paper-plonk-pipeline"><CitationBlock type="paper" citeKey={2} source="PLONK · Permutations over Lagrange-bases (2019/953)" href={PLONK}><p><strong>문제:</strong> Universal/updatable setup 아래 arithmetic circuit와 copy constraints를 succinct proof로 검증해야 합니다.</p><p><strong>핵심 기여:</strong> Selector/permutation polynomial identities, transcript rounds와 polynomial commitments의 연결을 제공합니다.</p><p><strong>중요 가정:</strong> 논문의 polynomial commitment, random-oracle transcript, field/domain과 setup model을 고정합니다.</p><p><strong>근거 범위:</strong> PLONK protocol round dependency와 polynomial objects입니다.</p><p><strong>일반화 금지:</strong> 모든 PLONKish 구현의 round 수·NTT/MSM 호출 형태가 같다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="buffer-liveness" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Buffer liveness</p><h2 className="mt-2 text-2xl font-bold">VRAM은 전체 bytes가 아니라 같은 순간 살아 있는 buffers의 합으로 예산한다</h2></header>
      <p>Buffer는 생성 직후부터 마지막 consumer completion까지 살아 있습니다. Polynomial 하나를 마지막 MSM이 읽기 전에 workspace로 덮어쓰면 race가 나며, host가 비동기 copy 중인 pinned page를 수정해도 같은 문제가 생깁니다. Allocation pool은 size만 재사용할 뿐 generation·event가 끝나기 전에는 ownership을 넘기지 않습니다.</p>
      <ExplainedFormula question="시간 τ에서 필요한 VRAM과 pipeline 전체 peak를 어떻게 계산할까?" idea={<>각 buffer b의 생존 구간에 τ가 들어갈 때만 size를 더하고, 모든 τ 중 가장 큰 합을 peak live bytes로 잡습니다.</>} formula={String.raw`\begin{aligned}I_b(\tau)&=[birth_b\le\tau<death_b]\\B(\tau)&=\sum_b size(b)I_b(\tau)\\B_{peak}&=\max_\tau B(\tau)\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}I_b(\tau)&=\underbrace{[birth_b\le\tau<death_b]}_{\text{허용 경계 판정}}\\B(\tau)&=\underbrace{\sum_b size(b)I_b(\tau)}_{\text{Indicator 계산}}\\B_{peak}&=\underbrace{\max_\tau B(\tau)}_{\text{경계 후보 선택}}\end{aligned}`}
      operations={[
        { expression: String.raw`[birth_b\le\tau<death_b]`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","각 buffer b의 생존 구간에 τ가 들어갈 때만 size를","더하고, 모든 τ 중 가장 큰 합을 peak live","bytes로 잡습니다."] },
        { expression: String.raw`\sum_b size(b)I_b(\tau)`, annotation: ["Indicator이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 buffer b의 생존 구간에 τ가 들어갈 때만 size를","더하고, 모든 τ 중 가장 큰 합을 peak live"] },
        { expression: String.raw`\max_\tau B(\tau)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","각 buffer b의 생존 구간에 τ가 들어갈 때만 size를","더하고, 모든 τ 중 가장 큰 합을 peak live","bytes로 잡습니다."] },
      ]} terms={[
        {symbol:"b",name:"Buffer",description:"Witness, polynomial, twiddle, bases, scalars, buckets 또는 proof partial입니다."},
        {symbol:"size(b)",name:"Allocated bytes",description:"Alignment·padding·backend workspace를 포함한 실제 allocation 크기입니다."},
        {symbol:"birth_b",name:"생성 시점",description:"Producer가 storage를 점유하기 시작한 event입니다."},
        {symbol:"death_b",name:"마지막 소비 완료",description:"마지막 consumer event 뒤 안전하게 재사용할 수 있는 시점입니다."},
        {symbol:"I_b(\\tau)",name:"Indicator",description:"τ가 buffer b의 live interval 안이면 1, 아니면 0입니다."},
        {symbol:"B_{peak}",name:"Peak live bytes",description:"Pipeline이 요구하는 최대 동시 device allocation입니다."},
      ]} assumptions={["Asynchronous transfer와 kernels의 event timestamp·ownership을 DAG에 반영합니다.","Allocator fragmentation, context/module memory와 safety margin은 B_peak 밖에 별도 더합니다."]} interpretation="8GB buffer가 [0,5], 6GB가 [3,8], 4GB가 [6,9]에 살면 peak는 3~5 구간의 14GB입니다. 전체 18GB를 항상 필요하다고 보거나 최대 단일 8GB만 보면 둘 다 틀립니다." />
      <p>고정 SRS bases와 twiddles를 여러 proofs에서 재사용하면 transfer를 줄일 수 있지만 cache key에 curve/domain/SRS digest를 포함해야 합니다. OOM 때 chunking을 선택하면 NTT stage와 MSM reduction이 chunk 경계를 넘어 어떻게 합쳐지는지 correctness proof와 extra traffic을 같이 기록합니다.</p>
    </section>

    <section id="overlap" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Overlap</p><h2 className="mt-2 text-2xl font-bold">서로 독립인 transfer·kernel만 stream으로 겹치고 critical path를 측정한다</h2></header>
      <p>Double buffering은 chunk k의 kernel 동안 chunk k+1을 전송할 수 있을 때 유효합니다. 같은 buffer를 쓰거나 transcript barrier 뒤에만 생성되는 data는 겹칠 수 없습니다. Device copy engines, pageable/pinned host memory, stream ordering과 kernel resource contention도 실제 overlap을 제한하므로 API enqueue 시각이 아니라 profiler timeline과 completion events를 확인합니다.</p>
      <ExplainedFormula question="겹침이 있는 pipeline 시간을 단순 stage 합과 어떻게 구분할까?" idea={<>DAG의 각 stage 완료 시각은 predecessor 중 가장 늦은 완료 뒤 자신의 measured duration을 더해 구합니다. 전체 시간은 sink 중 가장 늦은 완료입니다.</>} formula={String.raw`\begin{aligned}E(v)&=d(v)+\max_{u\in pred(v)}E(u)\\T_{critical}&=\max_{v\in sinks}E(v)\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}E(v)&=\underbrace{d(v)+\max_{u\in pred(v)}E(u)}_{\text{경계 후보 선택}}\\T_{critical}&=\underbrace{\max_{v\in sinks}E(v)}_{\text{경계 후보 선택}}\end{aligned}`}
      operations={[
        { expression: String.raw`d(v)+\max_{u\in pred(v)}E(u)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","DAG의 각 stage 완료 시각은 predecessor 중","가장 늦은 완료 뒤 자신의 measured duration을","더해 구합니다."] },
        { expression: String.raw`\max_{v\in sinks}E(v)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","DAG의 각 stage 완료 시각은 predecessor 중","가장 늦은 완료 뒤 자신의 measured duration을","더해 구합니다."] },
      ]} terms={[
        {symbol:"E(v)",name:"Earliest completion",description:"Dependency와 measured duration을 고려한 stage v의 완료 시각입니다."},
        {symbol:"d(v)",name:"Stage duration",description:"고정 workload에서 event/trace로 측정한 transfer·kernel·host work 시간입니다."},
        {symbol:"pred(v)",name:"Predecessors",description:"v가 기다려야 하는 stages입니다."},
        {symbol:"sinks",name:"Final stages",description:"Proof assembly·D2H·verification처럼 pipeline 완료를 정의하는 끝 nodes입니다."},
        {symbol:"T_{critical}",name:"Critical-path time",description:"허용된 overlap 뒤 end-to-end 완료 시간입니다."},
      ]} assumptions={["독립 branches의 resource contention이 d(v)에 반영되고 host enqueue overhead도 측정 경계에 포함합니다.","Protocol상 필요한 transcript barrier를 삭제하지 않고 DAG에 보존합니다."]} interpretation="A=4ms 뒤 B=6ms와 C=3ms가 병렬이고 둘 뒤 D=2ms라면 4+max(6,3)+2=12ms입니다. 단순 합 15ms와도, 무조건 max 6ms와도 다릅니다." />
      <div id="paper-bellperson-proof-pipeline"><CitationBlock type="code" citeKey={3} source="bellperson · commit 728306c" href={BELLPERSON}><p><strong>문제:</strong> Groth16 prover의 FFT와 multiexponentiation을 CPU/GPU backend에 연결해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned implementation은 CUDA/OpenCL features, CPU utilization/fallback, device locking과 consistency test 경계를 제공합니다.</p><p><strong>중요 가정:</strong> Commit 728306c의 BLS12-381 backend, enabled features, environment와 device set을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 source revision의 prover integration과 documented controls입니다.</p><p><strong>일반화 금지:</strong> 특정 hardware에서 고정 speedup·stage 비율 또는 모든 concurrent execution의 안전성을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Independent verifier가 같은 statement를 승인한 뒤 성능과 회복을 본다</h2></header>
      <p>Correctness suite는 valid proof뿐 아니라 wrong witness/public input, SRS mismatch, transcript reorder, invalid field/point encoding, NTT round-trip failure, GPU OOM·kernel error·timeout과 restart를 포함합니다. Candidate proof는 pinned independent verifier가 같은 public input에서 승인해야 하고 negative fixtures는 baseline과 같은 failure class로 거절해야 합니다.</p>
      <p>Warm-up에는 context·module/JIT·allocator pool을 분리하고 cold start도 별도 표에 남깁니다. Stage별 CUDA events와 end-to-end wall time, H2D/D2H, peak live bytes, achieved bandwidth, useful MSM/NTT units, occupancy·stall, median/p95, proofs/hour와 energy를 기록합니다. 같은 circuit·batch·SRS·backend SHA·clock에서 CPU/hybrid/GPU 후보를 paired 비교합니다.</p>
      <ExplainedFormula question="Pipeline throughput과 speedup을 어떤 end-to-end 경계에서 계산해야 할까?" idea={<>검증을 통과한 proofs 수만 useful output으로 세고, baseline과 candidate 모두 같은 input 준비부터 verifier receipt까지 시간을 사용합니다.</>} formula={String.raw`R_{proof}=\frac{N_{verified}}{T_{wall}},\qquad S=\frac{T_{baseline}^{e2e}}{T_{candidate}^{e2e}}`}
      annotatedFormula={String.raw`R_{proof}=\underbrace{\frac{N_{verified}}{T_{wall}},\qquad S=\frac{T_{baseline}^{e2e}}{T_{candidate}^{e2e}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{N_{verified}}{T_{wall}},\qquad S=\frac{T_{baseline}^{e2e}}{T_{candidate}^{e2e}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","검증을 통과한 proofs 수만 useful output으로","세고, baseline과 candidate 모두 같은","input 준비부터 verifier receipt까지 시간을"] },
      ]} terms={[
        {symbol:"N_{verified}",name:"Verified proofs",description:"같은 pinned verifier가 승인한 proof 개수입니다."},
        {symbol:"T_{wall}",name:"Wall-clock interval",description:"정한 arrival/input boundary부터 마지막 verification receipt까지의 시간입니다."},
        {symbol:"R_{proof}",name:"Useful throughput",description:"초당 또는 시간당 verified proofs입니다."},
        {symbol:"T_{baseline}^{e2e}",name:"Baseline time",description:"같은 workload의 CPU 또는 기존 pipeline end-to-end 시간입니다."},
        {symbol:"T_{candidate}^{e2e}",name:"Candidate time",description:"Transfer·sync·fallback·assembly·verification을 같은 경계로 포함한 시간입니다."},
        {symbol:"S",name:"End-to-end speedup",description:"동일 correctness gate를 통과한 두 전체 경로의 시간 비율입니다."},
      ]} assumptions={["Warm/cold, single/batch와 queueing boundary를 섞지 않고 같은 circuit·inputs·SRS를 사용합니다.","Invalid proofs, retries와 fallback cost를 성공 output 수에서 숨기지 않습니다."]} interpretation="Kernel chain이 10배 빨라도 전체 baseline 100ms 중 20ms만 가속되고 나머지가 80ms면 candidate는 최소 82ms여서 speedup은 약 1.22배입니다." />
      <div id="paper-icicle-pipeline"><CitationBlock type="code" citeKey={4} source="ICICLE v3.9.0 · commit 6b451e6" href={ICICLE}><p><strong>문제:</strong> Proof systems가 MSM·NTT와 memory/device abstractions를 여러 backend에서 호출해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned framework source가 primitives, runtime/backend와 integration surface를 제공합니다.</p><p><strong>중요 가정:</strong> v3.9.0 commit, supported curve/field/backend와 caller-owned dependency를 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 implementation/API 범위입니다.</p><p><strong>일반화 금지:</strong> Framework가 protocol transcript ordering, verifier correctness 또는 모든 workload speedup을 대신 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> Reader는 protocol DAG의 ready 조건을 판정하고 18GB buffers의 14GB live peak와 12ms critical path를 계산하며, independent verifier·negative parity·warm/cold·recovery를 포함한 pipeline release gate를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

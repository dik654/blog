import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MsmNttWorkloadViz } from "./viz/ModernMsmNttViz";

const ICICLE = "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2";
const SPPARK = "https://github.com/supranational/sppark/tree/17278d74295392f9813f009300b257a688422b7a";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";

export default function ModernMsmNttArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">ZK workload를 GPU 작업으로 번역하기</p><h2 className="text-3xl font-bold tracking-tight">MSM과 NTT는 모두 크지만, 나눌 수 있는 방향과 기다려야 하는 지점이 다르다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">증명기가 느릴 때 “MSM과 NTT를 GPU로 보낸다”는 말만으로는 구현을 정할 수 없습니다. <strong>MSM</strong>(multi-scalar multiplication, 여러 곡선점의 scalar multiple을 더하는 연산)은 bucket 충돌과 reduction이 있고, <strong>NTT</strong>(number theoretic transform, 유한체 위의 FFT)는 한 stage 안 butterfly는 독립이지만 다음 stage가 이전 결과를 기다립니다. 이 글은 고정된 proof workload에서 두 dependency를 식별하고 routing·resident memory·측정 경계를 정하는 법을 다룹니다.</p>
      <p>타원곡선 group law와 scalar multiplication은 <a className="text-primary hover:underline" href="/crypto/elliptic-curves#g1-curve">타원곡선 정본</a>, roots of unity와 butterfly 유도는 <a className="text-primary hover:underline" href="/crypto/fft#butterfly">NTT 정본</a>이 소유합니다. 여기서는 그 수학을 반복하지 않고, 같은 입력을 CPU reference와 GPU candidate에 넣어 어느 단계가 병렬화되고 어디서 barrier가 필요한지 연결합니다.</p>
      <MsmNttWorkloadViz />
      <ContentBoundary article="msm-ntt" />
    </section>

    <section id="workload-contract" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Fixed workload</p><h2 className="mt-2 text-2xl font-bold">먼저 points·scalars·polynomials와 representation을 고정한다</h2></header>
      <p>측정 단위는 “한 proof”처럼 모호하면 안 됩니다. Curve·field·domain size <code>N</code>, MSM 항 수 <code>m</code>, scalar bit length, point coordinate format, batch 수, input seed, SRS와 backend revision을 receipt에 남깁니다. Affine point를 GPU에서 Jacobian으로 바꾸거나 field 값을 Montgomery domain으로 바꾸는 비용도 어느 구간에 포함하는지 밝혀야 합니다.</p>
      <ExplainedFormula question="MSM이 계산하는 값과 window 분해는 GPU 작업을 어떻게 만든다고 볼 수 있을까?" idea={<>각 scalar를 w-bit digits로 나누면 같은 digit을 가진 points를 bucket에 모을 수 있습니다. Window들은 부분적으로 병렬화할 수 있지만 같은 bucket update와 마지막 weighted reduction은 dependency를 갖습니다.</>} formula={String.raw`\begin{aligned}Q&=\sum_{i=0}^{m-1}[s_i]P_i\\s_i&=\sum_{j=0}^{J-1}d_{i,j}2^{jw}\\J&=\lceil b/w\rceil\end{aligned}`} terms={[
        {symbol:"Q",name:"MSM output",description:"모든 scalar-point 항을 group law로 더한 곡선점입니다."},
        {symbol:"P_i",name:"Input point",description:"선택한 curve와 subgroup의 i번째 point입니다."},
        {symbol:"s_i",name:"Scalar",description:"Subgroup order 아래의 i번째 integer scalar입니다."},
        {symbol:"m",name:"항 수",description:"MSM에 들어가는 point-scalar pair 수입니다."},
        {symbol:"b",name:"Scalar bit length",description:"분해할 유효 bit 수입니다."},
        {symbol:"w",name:"Window width",description:"한 digit이 담는 bit 수이며 bucket 수와 window 수를 맞바꿉니다."},
        {symbol:"d_{i,j}",name:"Window digit",description:"Scalar i의 window j에서 읽은 0 이상 2^w 미만 값입니다."},
        {symbol:"J",name:"Window 수",description:"b bits를 w-bit 조각으로 덮는 개수입니다."},
      ]} assumptions={["모든 points는 같은 prime-order subgroup에 있고 scalars는 같은 subgroup order로 해석합니다.","Digit encoding, signed-window 여부와 point-at-infinity 처리는 backend와 reference에서 같아야 합니다."]} interpretation="b=8,w=2이면 scalar마다 4 digits가 생기고 window마다 최대 3개 nonzero bucket이 필요합니다. w를 키우면 window는 줄지만 bucket 공간과 sparse work가 늘므로 고정 최적값은 없습니다." />
      <p>NTT 입력도 단순한 숫자 배열이 아닙니다. Field modulus가 N-th root of unity를 지원해야 하고 coefficient order, forward/inverse direction, coset 여부, in-place layout과 inverse normalization을 고정해야 합니다. 이 계약이 다르면 두 구현의 output이 우연히 같은 길이여도 같은 transform을 계산한 것이 아닙니다.</p>
    </section>

    <section id="parallel-frontier" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Parallel frontier</p><h2 className="mt-2 text-2xl font-bold">MSM은 bucket ownership, NTT는 stage boundary가 병렬화의 경계다</h2></header>
      <p>MSM에서 thread마다 point를 처리하면 여러 thread가 같은 bucket을 갱신할 수 있습니다. Atomic update, thread-local buckets 뒤 merge, sort·segmented reduction 같은 선택지는 충돌·workspace·extra passes를 서로 바꿉니다. Bucket 합을 만든 뒤에는 큰 digit부터 running sum을 누적하는 weighted reduction이 필요하므로 “point가 독립”이라는 설명만으로 전체 MSM이 embarrassingly parallel이라고 할 수 없습니다.</p>
      <p>Radix-2 NTT의 한 stage에서는 서로 겹치지 않는 pair가 동시에 butterfly를 수행하지만, stage <code>k+1</code>의 입력은 stage <code>k</code>의 output입니다. Block 안에서 끝나는 작은 stage는 shared memory와 block barrier로 묶을 수 있지만 여러 blocks가 참여하는 경계는 kernel launch를 나누거나 cooperative 조건을 검증해야 합니다.</p>
      <ExplainedFormula question="한 NTT butterfly가 어떤 두 값을 만들며 왜 stage 사이에 synchronization이 필요할까?" idea={<>Pair의 두 input에서 하나는 그대로, 다른 하나는 stage별 twiddle로 곱한 뒤 합과 차를 만듭니다. 다음 stage가 이 두 output을 다시 섞으므로 이전 stage 완료가 선행되어야 합니다.</>} formula={String.raw`u'=u+\omega^k v,\qquad v'=u-\omega^k v`} terms={[
        {symbol:"u,v",name:"Butterfly inputs",description:"현재 stage에서 짝지어진 두 field elements입니다."},
        {symbol:"\omega",name:"Root of unity",description:"Transform domain을 생성하는 N-th root입니다."},
        {symbol:"k",name:"Twiddle exponent",description:"Stage와 pair index가 정하는 exponent입니다."},
        {symbol:"u',v'",name:"Butterfly outputs",description:"다음 stage가 읽는 두 field elements입니다."},
      ]} assumptions={["Field가 요구한 N-th root를 가지며 addition·subtraction·multiplication은 modulus 안에서 정확합니다.","Index permutation과 twiddle table이 선택한 decimation convention과 일치합니다."]} interpretation="한 stage의 disjoint pairs는 병렬 실행할 수 있지만 같은 buffer의 다음 stage가 먼저 읽으면 race가 생깁니다. 이 식만으로 optimal radix나 memory layout이 결정되지는 않습니다." />
      <p>구체적인 bucket kernel과 butterfly layout은 각각 <a className="text-primary hover:underline" href="/gpu/msm-gpu-impl">MSM GPU 구현</a>, <a className="text-primary hover:underline" href="/gpu/ntt-gpu-impl">NTT GPU 구현</a>에서 이어집니다. 이 글의 역할은 두 구현을 한 proof workload 안에서 같은 비교축에 놓는 것입니다.</p>
      <div id="paper-icicle-msm-ntt"><CitationBlock type="code" citeKey={1} source="ICICLE v3.9.0 source tree · commit 6b451e6" href={ICICLE}><p><strong>문제:</strong> 여러 curve·field에서 MSM과 NTT를 device backend로 제공해야 합니다.</p><p><strong>핵심 기여:</strong> Version-pinned implementation이 backend abstraction, field/curve specialization과 MSM·NTT API를 함께 보여 줍니다.</p><p><strong>중요 가정:</strong> v3.9.0 commit, 지원 curve·device·configuration과 호출자의 memory ownership을 고정합니다.</p><p><strong>근거 범위:</strong> 링크한 revision의 source structure와 API에 한정합니다.</p><p><strong>일반화 금지:</strong> 모든 GPU·size에서 특정 backend가 빠르거나 production correctness가 자동 보장된다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="residency-budget" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Residency</p><h2 className="mt-2 text-2xl font-bold">VRAM 용량보다 동시에 살아 있는 buffer와 transfer critical path를 계산한다</h2></header>
      <p>MSM은 bases·scalars·buckets·partials, NTT는 coefficients·twiddles·workspace가 필요합니다. 이들을 모두 더한 최대 live set이 VRAM을 넘으면 chunking이 필요하지만, chunk마다 immutable bases나 twiddles를 다시 보내면 PCIe traffic이 kernel 이득을 삼킬 수 있습니다. 반대로 다음 chunk transfer와 현재 kernel이 서로 다른 copy engine/stream에서 진짜 overlap되는 경우에는 단순 합이 아니라 timeline의 가장 긴 경로를 봅니다.</p>
      <ExplainedFormula question="Proof workload의 device resident byte와 겹친 실행 시간을 어떻게 상한으로 잡을까?" idea={<>동시에 살아 있는 allocations만 합하고, 겹치지 않는 dependency 경로는 더하되 transfer와 compute가 실제로 겹치는 구간은 더 큰 쪽을 critical path로 둡니다.</>} formula={String.raw`\begin{aligned}B_{live}&=B_P+B_s+B_{poly}\\&\quad+B_{tw}+B_{work}\\T_{chunk}&\approx\max(T_{H2D},T_{kernel})\\&\quad+T_{barrier}\end{aligned}`} terms={[
        {symbol:"B_P",name:"Point bytes",description:"현재 resident MSM bases와 point partials입니다."},
        {symbol:"B_s",name:"Scalar bytes",description:"현재 batch의 scalar digits 또는 원본 scalars입니다."},
        {symbol:"B_{poly}",name:"Polynomial bytes",description:"현재 round의 input/output field buffers입니다."},
        {symbol:"B_{tw}",name:"Twiddle bytes",description:"NTT roots table과 indexing metadata입니다."},
        {symbol:"B_{work}",name:"Workspace bytes",description:"Buckets, temporary reductions와 backend scratch입니다."},
        {symbol:"T_{H2D}",name:"Host-to-device time",description:"Pinned 여부와 link 상태를 포함한 chunk input transfer 시간입니다."},
        {symbol:"T_{kernel}",name:"Device compute time",description:"같은 chunk의 measured kernel chain입니다."},
        {symbol:"T_{barrier}",name:"직렬 경계",description:"Dependency·sync·final reduction 때문에 overlap되지 않는 시간입니다."},
      ]} assumptions={["실제로 동시 생존하는 allocations와 stream dependency를 trace에서 확인합니다.","max 근사는 copy engine과 kernel overlap이 가능한 경우에만 쓰며 contention과 launch overhead는 따로 측정합니다."]} interpretation="H2D 4ms와 kernel 7ms가 완전히 겹치고 barrier가 1ms라면 약 8ms이지만, 같은 resource를 써 직렬이면 12ms입니다. 이 식은 profiler timeline을 대신하지 않습니다." />
      <div id="paper-sppark-primitives"><CitationBlock type="code" citeKey={2} source="sppark source tree · commit 17278d7" href={SPPARK}><p><strong>문제:</strong> ZK proving의 MSM·NTT·field/curve primitives를 CUDA templates로 구현해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned tree가 <code>msm</code>, <code>ntt</code>, <code>ec</code>, <code>ff</code>, <code>memory</code> 경계를 분리합니다.</p><p><strong>중요 가정:</strong> 링크한 commit의 supported platforms, instantiated field/curve와 FFI layout을 확인합니다.</p><p><strong>근거 범위:</strong> Repository의 구현 구조와 명시된 status에 한정합니다.</p><p><strong>일반화 금지:</strong> PoC benchmark나 passing tests가 application integration의 FFI·memory safety·성능을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Reference parity를 통과한 뒤 stage별 achieved traffic과 end-to-end proof를 잰다</h2></header>
      <p>0·1·odd 항 수, zero scalar, identity point, repeated bucket, 최대 scalar, NTT impulse, forward→inverse round trip과 unsupported domain을 먼저 검사합니다. 그다음 context/module warm-up 뒤 같은 stream events로 kernel chain을 측정하고, end-to-end에는 H2D·D2H·synchronization·proof assembly를 포함합니다. Occupancy 하나가 높아졌다는 이유로 채택하지 않고 achieved bandwidth, useful field/point operations, actual bytes, stalls와 median/p95를 함께 보존합니다.</p>
      <p>예를 들어 MSM candidate가 kernel-only 2배 빨라도 bases를 매번 옮겨 proof latency가 같다면 residency나 batch 전략이 먼저입니다. NTT candidate가 한 size에서 빨라도 unsupported root, inverse normalization 또는 coset fixture에서 틀리면 즉시 탈락합니다. GPU OOM·driver error·backend mismatch 때 CPU fallback이 같은 output을 내는지와 timeout·rollback도 운영 계약에 포함합니다.</p>
      <div id="paper-cuda-execution-model"><CitationBlock type="code" citeKey={3} source="NVIDIA CUDA C++ Programming Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> Kernel launch, memory hierarchy, synchronization과 concurrent execution의 공식 의미가 필요합니다.</p><p><strong>핵심 기여:</strong> Grid·block·thread, memory scope, stream ordering과 device capability 계약을 제공합니다.</p><p><strong>중요 가정:</strong> CUDA Toolkit 12.8.1 archive와 실제 compute capability·driver를 함께 고정합니다.</p><p><strong>근거 범위:</strong> CUDA programming semantics와 documented capabilities입니다.</p><p><strong>일반화 금지:</strong> 규격이 특정 MSM·NTT mapping의 정확성이나 성능 우위를 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> 이 글만으로 reader는 두 연산의 입력·dependency를 구분하고, b=8,w=2 window 수와 butterfly pair를 설명하며, live bytes·overlap 반례를 계산하고, correctness-first paired benchmark와 fallback gate를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

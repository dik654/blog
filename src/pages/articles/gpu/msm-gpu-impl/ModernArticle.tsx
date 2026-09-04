import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ModernMsmGpuViz } from "./ModernMsmGpuViz";

const SPPARK = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/pippenger.cuh";
const SPPARK_SORT = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/sort.cuh";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";

export default function ModernMsmGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Scalar-point pairs를 device 작업표로 바꾸기</p><h2 className="text-3xl font-bold tracking-tight">GPU MSM은 점을 많이 더하는 문제가 아니라, window digit의 충돌과 bucket reduction을 재현 가능하게 배치하는 문제다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Multi-scalar multiplication(MSM)은 여러 scalar와 curve point를 받아 하나의 point를 만듭니다. 수학적 정의와 Pippenger의 원리는 <a className="text-primary hover:underline" href="/crypto/elliptic-curves#g1-curve">타원곡선 정본</a>이 소유하고, 이 글은 고정된 curve·scalar encoding·입력 길이를 pinned sppark CUDA 작업으로 내리는 경계만 다룹니다.</p>
      <p>
            공통 예제는 coefficient polynomial에서 나온 scalar 8개와 같은 길이의 SRS points입니다. 먼저 scalar를 signed window
            digits로 나눈 뒤 같은 digit을 가진 point를 bucket에 모으고 running sum으로 window 결과를 만든 다음 높은 window부터 결합합니다.
            “GPU니까 모두 독립”인 것이 아니라 같은 bucket을 갱신하는 충돌을 누가 소유할지 정해야 합니다.
          </p>
      <ModernMsmGpuViz />
      <ContentBoundary article="msm-gpu-impl" />
    </section>

    <section id="work-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Work plan</p><h2 className="mt-2 text-2xl font-bold">Window 폭은 계산량·bucket memory·digit extraction을 함께 바꾼다</h2></header>
      <p>Pinned sppark의 <code>breakdown</code> kernel은 scalar를 Booth-encoded signed digits로 만들며, <code>window_size</code>는 입력 수에 따라 폭을 고릅니다. 따라서 c=16 같은 숫자를 보편 최적값으로 두지 않고 scalar bit length, points 수, available memory, implementation SHA와 함께 receipt로 남깁니다.</p>
      <ExplainedFormula question="Scalar를 c-bit window 작업으로 어떻게 나눌까?" idea={<>각 scalar를 radix 2^c의 signed digits로 나타내면 window마다 같은 절댓값 digit을 bucket 하나에 모을 수 있습니다.</>} formula={String.raw`s_i=\sum_{j=0}^{W-1}d_{i,j}2^{cj},\qquad W=\left\lceil\frac{\ell}{c}\right\rceil`}
      annotatedFormula={String.raw`s_i=\underbrace{\sum_{j=0}^{W-1}d_{i,j}2^{cj},\qquad W=\left\lceil\frac{\ell}{c}\right\rceil}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\sum_{j=0}^{W-1}d_{i,j}2^{cj},\qquad W=\left\lceil\frac{\ell}{c}\right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 scalar를 radix 2^c의 signed","digits로 나타내면 window마다"] },
      ]} terms={[
        {symbol:"s_i",name:"i번째 scalar",description:"Point P_i에 곱하는 canonical scalar입니다."},
        {symbol:"i",name:"입력 index",description:"0부터 n−1까지 scalar-point pair를 가리킵니다."},
        {symbol:"d_{i,j}",name:"Signed digit",description:"i번째 scalar의 j번째 window digit이며 sign은 point negation에 반영됩니다."},
        {symbol:"j",name:"Window index",description:"낮은 bit window부터 높은 window까지의 위치입니다."},
        {symbol:"c",name:"Window bits",description:"한 digit이 소비하는 bit 폭입니다."},
        {symbol:"W",name:"Window count",description:"scalar 전체를 덮는 window 수입니다."},
        {symbol:String.raw`\ell`,name:"Scalar bit length",description:"고정한 scalar encoding에서 사용하는 bit 수입니다."},
      ]} assumptions={["Scalar encoding·endianness·top-bit 처리와 signed-digit 규칙을 backend revision에 고정합니다.","마지막 window의 유효 bit 수가 c보다 작을 수 있음을 extraction과 bucket mask가 처리합니다."]} interpretation="ℓ=13,c=4이면 W=4입니다. 마지막 window에 1 bit만 있어도 별도 mask가 필요하며, 단순 4-bit digit으로 읽으면 범위를 벗어납니다." />
    </section>

    <section id="bucket-ownership" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Bucket ownership</p><h2 className="mt-2 text-2xl font-bold">같은 bucket을 여러 thread가 동시에 갱신하지 않도록 작업을 묶는다</h2></header>
      <p>Point addition은 단일 scalar atomic add가 아닙니다. sppark snapshot은 custom sort가 digit과 원래 index를 정렬하고, <code>accumulate</code>가 정렬된 구간을 읽어 bucket을 만듭니다. 다른 구현은 thread-local buckets나 partition 후 merge를 택할 수 있지만, 그 선택을 sppark의 사실로 섞지 않습니다.</p>
      <ExplainedFormula question="Bucket workspace의 상한을 어떻게 예산할까?" idea={<>Window와 partition마다 non-zero bucket point를 보관한다고 가정하면 bucket 수와 내부 point bytes의 곱으로 기본 storage를 잡습니다.</>} formula={String.raw`B_{bucket}=W\,G\,(2^{c-1})\,s_P`}
      annotatedFormula={String.raw`B_{bucket}=\underbrace{W\,G\,(2^{c-1})\,s_P}_{\text{Bucket bytes 계산}}`}
      operations={[
        { expression: String.raw`W\,G\,(2^{c-1})\,s_P`, annotation: ["Bucket bytes이(가) 식의 결과에 기여하는 방식을","계산합니다.","Window와 partition마다"] },
      ]} terms={[
        {symbol:"B_{bucket}",name:"Bucket bytes",description:"Alignment와 sort workspace를 제외한 bucket point storage 상한입니다."},
        {symbol:"W",name:"Window count",description:"Scalar decomposition의 window 수입니다."},
        {symbol:"G",name:"Partition count",description:"충돌을 피하려고 복제한 독립 bucket groups 수입니다."},
        {symbol:"c",name:"Window bits",description:"Booth signed representation에서 magnitude bucket index 폭을 정합니다."},
        {symbol:"2^{c-1}",name:"Buckets per group",description:"Pinned signed-digit layout이 잡는 magnitude bucket slots 수입니다."},
        {symbol:"s_P",name:"Internal point bytes",description:"Device bucket point의 실제 aligned representation 크기입니다."},
      ]} assumptions={["이 식은 pinned sppark signed bucket allocation의 단순 상한이며 sort/digit/scratch bytes를 별도 더합니다.","G와 s_P는 launch configuration·curve type·compiler layout에서 실측합니다."]} interpretation="W=4,G=2,c=4,sP=96B이면 bucket storage는 4×2×8×96=6,144B입니다. 외부 compressed point 크기를 넣으면 device memory를 과소계산합니다." />
      <div id="paper-sppark-sort"><CitationBlock type="code" citeKey={1} source="sppark sort.cuh · commit 17278d7" href={SPPARK_SORT}><p><strong>문제:</strong> 같은 signed digit을 가진 point indices를 bucket 작업으로 묶어야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 digit counting·upper/lower sort와 index output 경로를 구현합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7의 digit layout, block constants와 supported scalar sizes를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 custom sort implementation의 dataflow에 한정합니다.</p><p><strong>일반화 금지:</strong> 모든 GPU MSM이 sort를 쓰거나 이 전략이 모든 분포에서 최적이라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="reduction" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Reduction</p><h2 className="mt-2 text-2xl font-bold">Bucket을 running sum으로 적분한 뒤 window weight를 복원한다</h2></header>
      <p>Bucket B_b에는 digit magnitude가 b인 points가 들어 있습니다. bB_b를 각각 scalar multiplication하지 않고 큰 bucket부터 누적한 running sum을 다시 더하면 같은 가중합을 point addition만으로 계산할 수 있습니다. Window 결과끼리는 c번 doubling하고 다음 window를 더합니다.</p>
      <ExplainedFormula question="왜 backward running sum이 bucket index 가중치를 복원할까?" idea={<>B_b가 내부 누적합에 정확히 b번 등장하도록 suffix sums를 모두 더합니다.</>} formula={String.raw`R_j=\sum_{b=1}^{M}bB_{j,b}=\sum_{r=1}^{M}\left(\sum_{b=r}^{M}B_{j,b}\right),\qquad M=2^{c-1}`}
      annotatedFormula={String.raw`R_j=\underbrace{\sum_{b=1}^{M}bB_{j,b}=\sum_{r=1}^{M}\left(\sum_{b=r}^{M}B_{j,b}\right),\qquad M=2^{c-1}}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`\sum_{b=1}^{M}bB_{j,b}=\sum_{r=1}^{M}\left(\sum_{b=r}^{M}B_{j,b}\right),\qquad M=2^{c-1}`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","B_b가 내부 누적합에 정확히 b번 등장하도록 suffix","sums를 모두 더합니다."] },
      ]} terms={[
        {symbol:"R_j",name:"Window result",description:"j번째 window의 weighted point sum입니다."},
        {symbol:"B_{j,b}",name:"Bucket point",description:"Window j에서 magnitude b인 입력 points의 합입니다."},
        {symbol:"b",name:"Bucket magnitude",description:"해당 bucket이 결과에 기여해야 하는 정수 가중치입니다."},
        {symbol:"r",name:"Suffix start",description:"Backward running sum을 시작하는 bucket index입니다."},
        {symbol:"M",name:"Maximum bucket slot",description:"Pinned signed-digit bucket 배열의 magnitude 범위 상한입니다."},
        {symbol:"c",name:"Window bits",description:"Magnitude bucket 범위를 정한 digit 폭입니다."},
      ]} assumptions={["Point들은 같은 prime-order subgroup에 있고 identity·negation 처리가 backend와 CPU reference에서 일치합니다.","식은 group addition 표기이며 integer multiplication은 반복 덧셈의 계수를 뜻합니다."]} interpretation="M=3이면 suffix sums는 (B1+B2+B3)+(B2+B3)+B3=B1+2B2+3B3입니다." />
      <div id="paper-sppark-msm"><CitationBlock type="code" citeKey={2} source="sppark pippenger.cuh · commit 17278d7" href={SPPARK}><p><strong>문제:</strong> Signed digits를 GPU buckets에 누적하고 window sums로 통합해야 합니다.</p><p><strong>핵심 기여:</strong> <code>breakdown</code>, <code>accumulate</code>, <code>integrate</code> kernels와 launch constraints를 제공합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7, chosen curve/scalar templates, nbits·wbits와 input representation을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned sppark MSM implementation snapshot입니다.</p><p><strong>일반화 금지:</strong> 보편 복잡도·고정 point-op count·production speedup을 증명하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">CPU reference와 edge cases가 맞은 뒤 useful point/s와 end-to-end를 잰다</h2></header>
      <p>0·1·최대 scalar, identity, P와 −P, subgroup-invalid point, n=0/1, 마지막 partial window와 skewed digits를 CPU reference와 비교합니다. Warm-up, CUDA events, completion sync, H2D·digit/sort·bucket·reduction·D2H를 분리하고 actual bytes, registers/spills, occupancy와 stall reason을 진단값으로 남깁니다.</p>
      <ExplainedFormula question="GPU MSM 후보의 처리량과 채택 speedup을 어떻게 계산할까?" idea={<>Correct output에 실제로 반영된 pair만 세고 baseline과 candidate의 같은 end-to-end 경계를 비교합니다.</>} formula={String.raw`R_{pair}=\frac{n_{valid}}{t_{kernel}},\qquad S=\frac{T_{CPU}^{e2e}}{T_{GPU}^{e2e}}`}
      annotatedFormula={String.raw`R_{pair}=\underbrace{\frac{n_{valid}}{t_{kernel}},\qquad S=\frac{T_{CPU}^{e2e}}{T_{GPU}^{e2e}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{n_{valid}}{t_{kernel}},\qquad S=\frac{T_{CPU}^{e2e}}{T_{GPU}^{e2e}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Correct output에 실제로 반영된 pair만 세고","baseline과 candidate의 같은 end-to-end","경계를 비교합니다."] },
      ]} terms={[
        {symbol:"R_{pair}",name:"Useful pair rate",description:"Kernel 초당 유효 scalar-point pairs입니다."},
        {symbol:"n_{valid}",name:"Validated pairs",description:"독립 CPU reference와 같은 MSM result에 포함된 입력 수입니다."},
        {symbol:"t_{kernel}",name:"Kernel-chain time",description:"Digit breakdown부터 final reduction completion event까지의 시간입니다."},
        {symbol:"S",name:"End-to-end speedup",description:"동일 입력·검증 경계의 CPU 대비 GPU 시간 비율입니다."},
        {symbol:"T_{CPU}^{e2e}",name:"CPU baseline time",description:"같은 decoding·validation·MSM·serialization 경계의 wall time입니다."},
        {symbol:"T_{GPU}^{e2e}",name:"GPU candidate time",description:"Transfer·allocation·sync·fallback을 포함한 wall time입니다."},
      ]} assumptions={["Curve·n·scalar distribution·threading·clock·software SHA를 고정하고 warm/cold 결과를 분리합니다.","Invalid inputs, retries와 fallback 시간을 숨기지 않습니다."]} interpretation="Kernel이 2ms여도 H2D 3ms, D2H·validation 2ms이면 GPU end-to-end는 최소 7ms입니다. 10ms CPU 대비 speedup은 5배가 아니라 약 1.43배입니다." />
      <div id="paper-cuda-msm"><CitationBlock type="paper" citeKey={3} source="CUDA C++ Best Practices Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> 비동기 GPU kernel과 transfer를 재현 가능하게 측정해야 합니다.</p><p><strong>핵심 기여:</strong> CUDA event timing, effective bandwidth와 correctness-first optimization 지침을 제공합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1 semantics와 target device properties를 함께 기록합니다.</p><p><strong>근거 범위:</strong> Timing·bandwidth·optimization methodology입니다.</p><p><strong>일반화 금지:</strong> 높은 occupancy나 특정 window 폭이 더 빠르다는 보장은 아닙니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> digit 분해, partial top window, workspace, collision ownership, running sum, implementation scope, edge fixtures, timing boundary, end-to-end speedup과 rollback을 이 글만으로 설명·계산할 수 있어야 합니다. Parity나 p95가 나빠지면 이전 artifact로 되돌리고 실패한 curve·size·SHA를 격리합니다.</aside>
    </section>
  </article>;
}

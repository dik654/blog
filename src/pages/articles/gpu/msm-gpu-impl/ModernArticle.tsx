import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ModernMsmGpuViz } from "./ModernMsmGpuViz";
import WindowSplitViz from "./viz/WindowSplitViz";
import BucketWorkspaceViz from "./viz/BucketWorkspaceViz";

const SPPARK = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/pippenger.cuh";
const SPPARK_SORT = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/sort.cuh";
const CUDA = "https://docs.nvidia.com/cuda/archive/13.2.1/pdf/CUDA_C_Best_Practices_Guide.pdf";

export default function ModernMsmGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">8개 scalar-point 입력을 끝까지 따라가기</p><h2 className="text-3xl font-bold tracking-tight">GPU MSM의 핵심은 같은 통을 함께 갱신하지 않게 만드는 것이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>긴 수를 작은 자리로 나누고, 같은 자리값의 점을 한 owner에게 모은 뒤, 뒤에서부터 누적하면 됩니다.</strong> 이 결과가 CPU와 같을 때만 전체 처리 시간을 비교합니다.</p>
      <p>이 방식을 multi-scalar multiplication(MSM)의 Pippenger GPU 구현이라고 부릅니다. 여러 scalar와 curve point를 받아 하나의 point를 만드는 수학적 정의는 <a className="text-primary hover:underline" href="/cs/crypto/elliptic-curves#g1-curve">타원곡선 정본</a>이 소유하고, 이 글은 고정된 curve·scalar encoding·입력 길이를 pinned sppark CUDA 작업으로 내리는 경계만 다룹니다.</p>
      <p>
            공통 예제는 scalar 8개와 같은 길이의 points입니다. 낮은 3비트 자리만 잘라 보면 digit은
            <code>[1, 2, 3, 1, 0, 2, 3, 1]</code>입니다. 같은 digit을 가진 point를 bucket에 모으고 running sum으로 window 결과를 만든 다음 높은 window부터 결합합니다.
            “GPU니까 모두 독립”인 것이 아니라 같은 bucket을 갱신하는 충돌을 누가 소유할지 정해야 합니다. 실제 signed digit에서는 부호가 음수인 항의 point를 먼저 뒤집어 같은 magnitude bucket에 넣습니다.
          </p>
      <ModernMsmGpuViz />
      <ContentBoundary article="msm-gpu-impl" />
    </section>

    <section id="work-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Work plan</p><h2 className="mt-2 text-2xl font-bold">Scalar를 window 작업표로 바꾼다</h2></header>
      <p>Pinned sppark의 <code>breakdown</code> kernel은 scalar를 Booth-encoded signed digits로 만들며, <code>window_size</code>는 입력 수에 따라 폭을 고릅니다. 따라서 c=16 같은 숫자를 보편 최적값으로 두지 않고 scalar bit length, points 수, available memory, implementation SHA와 함께 receipt로 남깁니다.</p>
      <WindowSplitViz />
      <ExplainedFormula question="Scalar를 c-bit window 작업으로 어떻게 나눌까?" idea={<>각 scalar를 radix 2^c의 signed digits로 나타내면 window마다 같은 절댓값 digit을 bucket 하나에 모을 수 있습니다.</>} formula={String.raw`s_i=\sum_{j=0}^{W-1}d_{i,j}2^{cj},\qquad W=\left\lceil\frac{\ell}{c}\right\rceil`}
      annotatedFormula={String.raw`s_i=\sum_{j=0}^{W-1}\underbrace{d_{i,j}}_{\text{signed digit}}\underbrace{2^{cj}}_{\text{window 자리값}},\qquad W=\underbrace{\left\lceil\frac{\ell}{c}\right\rceil}_{\text{scalar를 덮는 window 수}}`}
      operations={[
  { expression: String.raw`\sum_{j=0}^{W-1}d_{i,j}2^{cj}`, annotation: ["scalar를 radix 2^c의 signed digit으로","나눠 window마다 같은 digit을 bucket에 모음","digit의 sign은 point negation으로"] },
  { expression: String.raw`\left\lceil\frac{\ell}{c}\right\rceil`, annotation: ["scalar bit 수를 window 폭으로 나눠 올림","ℓ=13, c=4 → W=4","마지막 window는 1 bit뿐이라 mask 필요"] },
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
      <header><p className="text-sm font-semibold text-primary">02 · Bucket ownership</p><h2 className="mt-2 text-2xl font-bold">같은 bucket에는 owner 하나만 둔다</h2></header>
      <p>Point addition은 단일 scalar atomic add가 아닙니다. sppark snapshot은 custom sort가 digit과 원래 index를 정렬하고, <code>accumulate</code>가 정렬된 구간을 읽어 bucket을 만듭니다. 다른 구현은 thread-local buckets나 partition 후 merge를 택할 수 있지만, 그 선택을 sppark의 사실로 섞지 않습니다.</p>
      <BucketWorkspaceViz />
      <ExplainedFormula question="Bucket workspace의 상한을 어떻게 예산할까?" idea={<>Window와 partition마다 non-zero bucket point를 보관한다고 가정하면 bucket 수와 내부 point bytes의 곱으로 기본 storage를 잡습니다.</>} formula={String.raw`B_{bucket}=W\,G\,(2^{c-1})\,s_P`}
      annotatedFormula={String.raw`B_{bucket}=\underbrace{W\,G}_{\text{window×partition}}\,\underbrace{(2^{c-1})}_{\text{group당 bucket}}\,\underbrace{s_P}_{\text{device point bytes}}`}
      operations={[
  { expression: String.raw`W\,G`, annotation: ["window마다, 충돌을 피하려 복제한","partition마다 bucket 묶음을 따로 둡니다","W=4, G=2 → 8묶음"] },
  { expression: String.raw`(2^{c-1})`, annotation: ["signed digit이라 절댓값 bucket만","c=4면 8개"] },
  { expression: String.raw`s_P`, annotation: ["compressed 크기가 아닌 device","point 크기 96B → 4×2×8×96 = 6,144B"] },
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
      annotatedFormula={String.raw`R_j=\underbrace{\sum_{b=1}^{M}bB_{j,b}}_{\text{원하는 가중합}}=\underbrace{\sum_{r=1}^{M}\left(\sum_{b=r}^{M}B_{j,b}\right)}_{\text{running sum의 합}},\qquad \underbrace{M=2^{c-1}}_{\text{최대 magnitude}}`}
      operations={[
  { expression: String.raw`\sum_{b=1}^{M}bB_{j,b}`, annotation: ["bucket b를 b배 하는 scalar 곱셈은 비쌉니다"] },
  { expression: String.raw`\sum_{r=1}^{M}\left(\sum_{b=r}^{M}B_{j,b}\right)`, annotation: ["큰 bucket부터 누적한 suffix sum을 더하면","B_b가 정확히 b번 등장해 덧셈만으로 복원","M=3: (B1+B2+B3)+(B2+B3)+B3"] },
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
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">정답이 같아야 속도를 잰다</h2></header>
      <div className="space-y-3">
        <p>먼저 0·1·최대 scalar, identity, P와 −P, subgroup-invalid point를 CPU reference와 비교합니다. 입력 수 0·1, 마지막 partial window, 한 digit에 쏠린 입력도 따로 검사합니다.</p>
        <p>그다음 warm-up 뒤 CUDA event로 kernel chain을 재고, host-to-device·digit/sort·bucket·reduction·device-to-host 시간을 나눠 기록합니다. 실제 이동 bytes, register spill, occupancy와 stall reason은 원인을 찾는 진단값으로 남깁니다.</p>
      </div>
      <ExplainedFormula question="GPU MSM 후보의 처리량과 채택 speedup을 어떻게 계산할까?" idea={<>Correct output에 실제로 반영된 pair만 세고 baseline과 candidate의 같은 end-to-end 경계를 비교합니다.</>} formula={String.raw`R_{pair}=\frac{n_{valid}}{t_{kernel}},\qquad S=\frac{T_{CPU}^{e2e}}{T_{GPU}^{e2e}}`}
      annotatedFormula={String.raw`R_{pair}=\frac{\underbrace{n_{valid}}_{\text{결과 반영 pair}}}{\underbrace{t_{kernel}}_{\text{digit→reduction}}},\qquad S=\frac{\underbrace{T_{CPU}^{e2e}}_{\text{CPU 전체}}}{\underbrace{T_{GPU}^{e2e}}_{\text{전송 포함 GPU 전체}}}`}
      operations={[
  { expression: String.raw`\frac{n_{valid}}{t_{kernel}}`, annotation: ["CPU reference와 같은 결과에 포함된 pair만","kernel chain 시간으로 나눈 진단값"] },
  { expression: String.raw`\frac{T_{CPU}^{e2e}}{T_{GPU}^{e2e}}`, annotation: ["GPU: kernel 2+H2D 3+D2H·검증 2=7ms","10/7 ≈ 1.43배, kernel 기준 5배가 아님"] },
]} terms={[
        {symbol:"R_{pair}",name:"Useful pair rate",description:"Kernel 초당 유효 scalar-point pairs입니다."},
        {symbol:"n_{valid}",name:"Validated pairs",description:"독립 CPU reference와 같은 MSM result에 포함된 입력 수입니다."},
        {symbol:"t_{kernel}",name:"Kernel-chain time",description:"Digit breakdown부터 final reduction completion event까지의 시간입니다."},
        {symbol:"S",name:"End-to-end speedup",description:"동일 입력·검증 경계의 CPU 대비 GPU 시간 비율입니다."},
        {symbol:"T_{CPU}^{e2e}",name:"CPU baseline time",description:"같은 decoding·validation·MSM·serialization 경계의 wall time입니다."},
        {symbol:"T_{GPU}^{e2e}",name:"GPU candidate time",description:"Transfer·allocation·sync·fallback을 포함한 wall time입니다."},
      ]} assumptions={["Curve·n·scalar distribution·threading·clock·software SHA를 고정하고 warm/cold 결과를 분리합니다.","Invalid inputs, retries와 fallback 시간을 숨기지 않습니다."]} interpretation="Kernel이 2ms여도 H2D 3ms, D2H·validation 2ms이면 GPU end-to-end는 최소 7ms입니다. 10ms CPU 대비 speedup은 5배가 아니라 약 1.43배입니다." />
      <div id="paper-cuda-msm"><CitationBlock type="paper" citeKey={3} source="CUDA C++ Best Practices Guide 13.2.1" href={CUDA}><p><strong>문제:</strong> 비동기 GPU kernel과 transfer를 재현 가능하게 측정해야 합니다.</p><p><strong>핵심 기여:</strong> CUDA event timing, effective bandwidth와 correctness-first optimization 지침을 제공합니다.</p><p><strong>중요 가정:</strong> CUDA 13.2.1 semantics와 target device properties를 함께 기록합니다.</p><p><strong>근거 범위:</strong> Timing·bandwidth·optimization methodology입니다.</p><p><strong>일반화 금지:</strong> 높은 occupancy나 특정 window 폭이 더 빠르다는 보장은 아닙니다.</p></CitationBlock></div>
      <p className="text-sm leading-6 text-muted-foreground">고정한 sppark commit 17278d7의 <code>pippenger.cuh</code>와 <code>sort.cuh</code>는 2026-11-02의 upstream HEAD 69440fd와 SHA-256이 각각 일치했습니다. 이 확인은 source dataflow가 유지됐다는 뜻이며, 새 GPU에서 같은 성능이 난다는 뜻은 아닙니다.</p>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> digit 분해, partial top window, workspace, collision ownership, running sum, implementation scope, edge fixtures, timing boundary, end-to-end speedup과 rollback을 이 글만으로 설명·계산할 수 있어야 합니다. Parity나 p95가 나빠지면 이전 artifact로 되돌리고 실패한 curve·size·SHA를 격리합니다.</aside>
    </section>
  </article>;
}

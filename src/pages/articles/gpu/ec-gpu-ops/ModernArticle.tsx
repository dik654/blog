import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EcGpuOpsMappingViz } from "./viz/ModernEcGpuOpsViz";

const ECGPU = "https://github.com/filecoin-project/ec-gpu/tree/16d38ef6715fb1a4968986d3a5635f8bcac6c984";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";

export default function ModernEcGpuOpsArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">큰 정수와 곡선점을 CUDA에 배치하기</p><h2 className="text-3xl font-bold tracking-tight">타원곡선 GPU kernel의 첫 문제는 공식이 아니라 representation과 dependency다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">ZK prover의 MSM은 많은 곡선점 덧셈을 요구하지만 GPU lane이 254-bit나 381-bit field element를 한 instruction으로 곱해 주지는 않습니다. 값을 여러 <strong>limb</strong>(machine word 단위 조각)로 나누고 wide product·carry·modular reduction을 정확한 순서로 수행한 뒤, 그 field 연산으로 Jacobian point add/double을 구성해야 합니다.</p>
      <p>소수체·Montgomery reduction·canonical encoding은 <a className="text-primary hover:underline" href="/crypto/field-arithmetic#montgomery">field arithmetic 정본</a>, 곡선 group law와 Jacobian equivalence는 <a className="text-primary hover:underline" href="/crypto/elliptic-curves#g1-curve">elliptic-curve 정본</a>을 재사용합니다. 이 글은 그것을 CUDA thread/lane에 배치하면서 생기는 carry dependency, point batch mapping과 release gate만 소유합니다.</p>
      <EcGpuOpsMappingViz />
      <ContentBoundary article="ec-gpu-ops" />
    </section>

    <section id="field-layout" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Limb mapping</p><h2 className="mt-2 text-2xl font-bold">한 thread가 모든 limbs를 들지, warp lanes가 나눠 들지 먼저 정한다</h2></header>
      <p>Field element는 radix <code>2^w</code> digits로 표현합니다. Pinned ec-gpu CUDA source는 한 logical work item이 field/point의 fixed limbs 전체를 소유하고 32-bit limbs로 연산합니다. 따라서 BN254는 8 limbs, BLS12-381은 12 limbs이며, 4/6개의 64-bit CUDA limbs라고 설명하면 이 구현과 다릅니다. OpenCL 생성 경로는 64-bit limbs를 사용합니다. 여러 warp lanes가 limbs를 나누는 방식은 가능한 대안이지만 ec-gpu의 현재 mapping이라고 부르지 않습니다.</p>
      <ExplainedFormula question="큰 field element를 L개 limbs로 나눈다는 것은 각 lane이 어떤 값을 소유한다는 뜻일까?" idea={<>Radix 2^w 자리값을 사용하면 limb l은 <code>x_l·2^(w·l)</code>의 계수를 담습니다. 이 표기와 endian order를 host serialization, CPU reference와 kernel이 동일하게 써야 합니다.</>} formula={String.raw`x=\sum_{\ell=0}^{L-1}x_\ell 2^{w\ell},\qquad 0\le x_\ell<2^w`} terms={[
        {symbol:"x",name:"Field representative",description:"Decode 뒤 0≤x<p인 canonical residue 또는 명시한 Montgomery-domain value입니다."},
        {symbol:"L",name:"Limb count",description:"Field 값을 저장하는 machine words 개수입니다."},
        {symbol:"w",name:"Limb width",description:"한 limb의 bits이며 backend와 multiplication primitive가 지원해야 합니다."},
        {symbol:"x_\ell",name:"Limb value",description:"Little-endian radix에서 index ℓ가 소유한 digit입니다."},
      ]} assumptions={["Limb order, w, modulus p와 internal Montgomery domain이 host·device에서 같습니다.","Unused top bits와 noncanonical x≥p 입력을 decode boundary에서 처리합니다."]} interpretation="w=8,L=4에서 limbs [1,2,0,0]은 1+2·256=513입니다. 배열 bytes를 반대 endian으로 읽으면 같은 memory가 전혀 다른 field value가 됩니다." />
      <p>한 work item이 많은 limbs와 point temporaries를 가지면 compiler가 정한 register 수와 spill이 occupancy를 제한할 수 있습니다. Array-of-structs와 structure-of-arrays는 동일한 limbs라도 warp address를 다르게 만들므로 actual DRAM transactions와 alignment를 profiler로 확인합니다. Warp-cooperative 대안을 비교할 때도 별도 kernel로 구현해 같은 fixtures와 workload에서 측정합니다.</p>
    </section>

    <section id="fp-montgomery" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Carry schedule</p><h2 className="mt-2 text-2xl font-bold">곱셈의 병렬 partial products와 순차 carry를 분리한다</h2></header>
      <p>L×L limb multiplication은 여러 partial products를 동시에 만들 수 있지만 같은 output column으로 모이는 합과 carry에는 순서가 있습니다. Wide accumulator가 넘치지 않는 범위를 증명하거나 중간 reduction을 넣고, CUDA의 <code>add.cc</code>/<code>addc</code> 계열 또는 explicit high-half 연산이 compiler target에서 어떻게 lowering되는지 disassembly와 vector test로 확인합니다.</p>
      <ExplainedFormula question="한 output limb와 다음 carry는 이전 carry에 어떻게 의존할까?" idea={<>같은 radix column의 partial products와 이전 carry를 합한 t에서 낮은 w bits를 현재 limb로 남기고 나머지를 다음 column으로 넘깁니다. 따라서 carry chain을 무시한 lane-parallel add는 틀립니다.</>} formula={String.raw`\begin{aligned}t_k&=c_k+\sum_{i+j=k}a_i b_j\\z_k&=t_k\bmod 2^w\\c_{k+1}&=\left\lfloor t_k/2^w\right\rfloor\end{aligned}`} terms={[
        {symbol:"a_i,b_j",name:"Input limbs",description:"두 wide integer의 radix-2^w digits입니다."},
        {symbol:"k",name:"Product column",description:"i+j가 같은 partial products가 모이는 위치입니다."},
        {symbol:"c_k",name:"Incoming carry",description:"이전 column에서 넘어온 상위 값입니다."},
        {symbol:"t_k",name:"Wide accumulator",description:"Column partial products와 incoming carry의 합입니다."},
        {symbol:"z_k",name:"Output limb",description:"Accumulator의 낮은 w bits입니다."},
        {symbol:"c_{k+1}",name:"Outgoing carry",description:"다음 column이 반드시 소비해야 하는 나머지 상위 값입니다."},
      ]} assumptions={["Accumulator type 또는 multiword schedule이 t_k의 최대값을 overflow 없이 보존합니다.","Signedness와 high-half multiply, carry flag semantics를 target instruction에서 고정합니다."]} interpretation="w=8에서 t_k=700이면 z_k=188, c_{k+1}=2입니다. 다음 column이 carry 2를 받기 전에 실행 결과를 확정하면 CPU reference와 달라집니다." />
      <p>Montgomery constants와 final conditional subtraction은 이 글에서 새로 유도하지 않습니다. 다만 kernel은 input/output이 normal residue인지 R-domain인지 API boundary에 명시하고, 0·1·p−1·p·2p−1과 cross-domain 입력을 reference와 대조해야 합니다.</p>
      <div id="paper-ec-gpu-field-kernel"><CitationBlock type="code" citeKey={1} source="ec-gpu field.cl · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/cl/field.cl`}><p><strong>문제:</strong> Fixed limbs의 wide product와 modular reduction을 CUDA/OpenCL source로 내려야 합니다.</p><p><strong>핵심 기여:</strong> Pinned implementation의 CUDA carry-chain path와 default CIOS-style field operations를 보여 줍니다.</p><p><strong>중요 가정:</strong> Generated constants, backend limb width와 README의 prime top-bit 전제를 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 field kernel functions입니다.</p><p><strong>일반화 금지:</strong> Instruction cycle 수·register 수·occupancy·speedup을 고정하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="point-ops" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Point batch</p><h2 className="mt-2 text-2xl font-bold">Jacobian은 inversion을 미루지만 예외 처리와 register budget을 없애지 않는다</h2></header>
      <p>Affine addition은 slope를 구하려고 field inversion을 쓰므로 대량 add에서 비쌉니다. Jacobian coordinates는 같은 affine point를 여러 triples로 표현하고 multiplication/square로 addition을 진행한 뒤 마지막에 normalize합니다. 하지만 identity, equal points, inverse points와 mixed-add input format은 formula variant마다 precondition이 다르므로 complete formula인지 exceptional branch가 필요한지 정해야 합니다.</p>
      <ExplainedFormula question="Jacobian triple이 어떤 affine point를 나타내며 normalization은 무엇을 계산할까?" idea={<>Z의 powers를 coordinate scale로 흡수해 매 add마다 inverse를 하지 않고, batch가 끝날 때 Z inverse를 한 번 사용해 affine coordinates로 돌아갑니다.</>} formula={String.raw`\begin{aligned}x&=XZ^{-2}\\y&=YZ^{-3},\qquad Z\ne0\end{aligned}`} terms={[
        {symbol:"X,Y,Z",name:"Jacobian coordinates",description:"GPU point kernel이 내부에서 보존하는 projective triple입니다."},
        {symbol:"x,y",name:"Affine coordinates",description:"Canonical output 또는 CPU reference가 비교하는 curve coordinates입니다."},
        {symbol:"Z^{-1}",name:"Field inverse",description:"Normalization에서 구하며 zero/infinity encoding은 별도 규칙을 따릅니다."},
        {symbol:"\sim",name:"같은 point 관계",description:"서로 다른 nonzero scale triples가 같은 affine point를 표현합니다."},
      ]} assumptions={["Coordinates는 같은 base field와 curve parameter를 사용하고 Z≠0인 finite point 식입니다.","Point at infinity의 internal representation과 encode policy는 backend contract로 별도 정의합니다."]} interpretation="Z=2라면 x=X/4, y=Y/8입니다. Jacobian이 field operation 수를 항상 최소화하거나 모든 formula가 complete하다는 결론은 아닙니다." />
      <p>한 thread-per-point는 여러 X/Y/Z temporaries를 들기 때문에 register pressure가 큽니다. Warp-cooperative point는 lane communication과 divergence가 늘 수 있습니다. Fixed batch에서 register count, spills, resident warps, branch efficiency와 point/s를 함께 보고, point normalization·serialization 비용을 end-to-end 구간에서 빼지 않습니다.</p>
      <div id="paper-ec-gpu-point-kernel"><CitationBlock type="code" citeKey={2} source="ec-gpu ec.cl · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/cl/ec.cl`}><p><strong>문제:</strong> 매 point add마다 inverse하지 않고 a=0 short-Weierstrass points를 처리해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned Jacobian double, mixed/full add와 infinity·same-point branches를 concrete field operations로 내립니다.</p><p><strong>중요 가정:</strong> 지원 curve parameter, field domain과 internal point representation을 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision에 구현된 formulas와 branches입니다.</p><p><strong>일반화 금지:</strong> 모든 curve에서 complete formula이거나 untrusted point validation을 대신한다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="msm-mapping" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · MSM consumer</p><h2 className="mt-2 text-2xl font-bold">한 work item은 window와 group을 고르고 자기 bucket slice를 누적한다</h2></header>
      <p>Pinned multiexp kernel은 global work-item ID를 window와 group으로 풀어 해당 point/scalar range와 bucket slice를 처리합니다. 각 scalar의 digit이 0이면 건너뛰고, nonzero digit이면 대응 bucket에 mixed add한 뒤 뒤에서 앞으로 running sum을 누적해 window partial을 만듭니다. 이 ownership이 buffer size와 coalescing, work-group count를 정합니다.</p>
      <ExplainedFormula question="Global work-item ID가 어떤 MSM window와 group을 맡는지 어떻게 풀어낼까?" idea={<>Windows를 빠르게 변하는 축으로 두면 나머지가 window, 몫이 같은 point chunk를 처리할 group이 됩니다. Host와 kernel이 같은 num_windows를 써야 bucket slice가 겹치지 않습니다.</>} formula={String.raw`\begin{aligned}window&=gid\bmod W\\group&=\left\lfloor gid/W\right\rfloor\\B&=2^c-1\end{aligned}`} terms={[
        {symbol:"gid",name:"Global work-item ID",description:"Kernel launch가 부여한 logical task index입니다."},
        {symbol:"W",name:"Number of windows",description:"Scalar bit length와 window width가 정한 window 수입니다."},
        {symbol:"window",name:"Window index",description:"이 work item이 읽을 scalar digit 위치입니다."},
        {symbol:"group",name:"Point group index",description:"입력 point/scalar range와 private bucket slice를 고릅니다."},
        {symbol:"c",name:"Window bits",description:"한 digit의 bit width입니다."},
        {symbol:"B",name:"Nonzero buckets",description:"0 digit을 제외한 window별 bucket 개수입니다."},
      ]} assumptions={["Host allocation, launch dimensions와 kernel의 W·c·group size가 같습니다.","Bucket slices는 서로 겹치지 않고 point/scalar arrays는 합의한 canonical layout을 사용합니다."]} interpretation="W=4,gid=6이면 window=2, group=1입니다. c=3이면 nonzero buckets는 7개입니다. 이 mapping이 모든 size에서 최적이라는 뜻은 아닙니다." />
      <div id="paper-ec-gpu-msm-kernel"><CitationBlock type="code" citeKey={3} source="ec-gpu multiexp.cl · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/cl/multiexp.cl`}><p><strong>문제:</strong> Pippenger windows, point groups와 bucket partials를 GPU work items에 배치해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned kernel의 gid decomposition, bucket ownership, mixed additions와 summation-by-parts 흐름을 제공합니다.</p><p><strong>중요 가정:</strong> Host가 같은 sizes와 non-overlapping buffers를 할당하고 supported curve source를 생성합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 multiexp kernel mapping입니다.</p><p><strong>일반화 금지:</strong> 모든 GPU·MSM size에서 최적인 Pippenger mapping이라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Field parity와 point parity를 통과한 candidate만 throughput을 비교한다</h2></header>
      <p>Field fixture는 0·1·p−1·carry chain·wide maximum·noncanonical input·normal/R-domain mismatch를 포함합니다. Point fixture는 infinity, P+O, P+(−P), P+P, subgroup edge, invalid encoding과 random CPU reference vectors를 포함합니다. 중간 Jacobian triples를 byte-for-byte 비교하지 않고 둘 다 normalize해 같은 affine point인지 확인해야 합니다.</p>
      <p>성능은 같은 curve·batch·input distribution·compiler flags·GPU clock에서 context/module warm-up 후 CUDA events로 kernel-only median/p95를 재고, H2D·conversion·normalization·D2H·sync를 포함한 end-to-end도 따로 잽니다. Achieved bandwidth, integer instruction mix, register/thread, occupancy, spills, branch/warp stalls를 같은 receipt에 남겨 원인을 설명합니다.</p>
      <ExplainedFormula question="Point kernel의 useful throughput과 memory traffic을 어떤 경계로 기록할까?" idea={<>정확히 normalize된 output point 수를 같은 elapsed time으로 나누고, 요청 bytes와 profiler의 actual DRAM bytes를 분리해 저장합니다.</>} formula={String.raw`\begin{aligned}R_{point}&=\frac{N_{valid}}{t_{kernel}}\\B_{dram}&=\frac{B_{read}^{actual}+B_{write}^{actual}}{t_{kernel}}\end{aligned}`} terms={[
        {symbol:"N_{valid}",name:"Validated outputs",description:"Reference와 같은 affine point로 확인된 output 개수입니다."},
        {symbol:"t_{kernel}",name:"Device elapsed",description:"Warm-up 뒤 같은 stream event 경계의 seconds입니다."},
        {symbol:"R_{point}",name:"Point throughput",description:"초당 correct point operations이며 operation 종류를 함께 표시합니다."},
        {symbol:"B_{dram}",name:"Achieved DRAM bandwidth",description:"Profiler actual transactions 기준 read/write bytes per second입니다."},
      ]} assumptions={["Add·double·normalize를 섞지 않고 operation mix 또는 pipeline 경계를 명시합니다.","Reference parity 실패 output은 useful count에 포함하지 않으며 clocks·software revision을 고정합니다."]} interpretation="100만 add가 2ms이고 모두 맞으면 5억 add/s이지만 conversion 8ms가 더 들면 end-to-end는 1억/s입니다. Peak bandwidth나 occupancy만으로 throughput 원인을 단정할 수 없습니다." />
      <div id="paper-cuda-ec-ops"><CitationBlock type="code" citeKey={4} source="NVIDIA CUDA C++ Programming Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> Warp execution, register/shared/global memory와 synchronization semantics가 필요합니다.</p><p><strong>핵심 기여:</strong> CUDA execution·memory model과 device capability 조회 방법을 정의합니다.</p><p><strong>중요 가정:</strong> Toolkit 12.8.1 archive, target compute capability와 compiler output을 함께 확인합니다.</p><p><strong>근거 범위:</strong> 공식 CUDA semantics에 한정합니다.</p><p><strong>일반화 금지:</strong> 높은 occupancy가 EC arithmetic에서 자동으로 빠르다는 보장은 아닙니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> Reader는 513의 limb 표현과 t=700 carry를 계산하고, thread-per-element와 limb-per-lane을 비교하며, Jacobian normalize·예외 fixture·kernel/end-to-end benchmark를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

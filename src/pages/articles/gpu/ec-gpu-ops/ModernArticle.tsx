import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EcGpuOpsMappingViz } from "./viz/ModernEcGpuOpsViz";

const ECGPU = "https://github.com/filecoin-project/ec-gpu/tree/16d38ef6715fb1a4968986d3a5635f8bcac6c984";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html";

export default function ModernEcGpuOpsArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">큰 정수와 곡선점을 GPU에 배치하기</p><h2 className="text-3xl font-bold tracking-tight">한 GPU work item은 한 MSM 조각의 field 연산을 처음부터 끝까지 맡는다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정한 ec-gpu 커널에서 warp lane 하나가 큰 정수 limb 하나만 맡는 것이 아닙니다. <strong>논리 work item 하나가 field와 point의 limb 전체를 들고</strong>, 자기 window·point group·bucket 구간을 처리합니다.</p>
      <p>아래에서 <code>gid=6</code>, window 수 <code>W=4</code>, window 폭 <code>c=3</code>인 작업 하나를 따라갑니다. 이 작업은 window 2, group 1, global bucket 42..48을 맡습니다. scalar digit이 3이면 자기 세 번째 bucket에 point를 더하고, 뒤에서부터 누적해 <code>results[6]</code>을 씁니다.</p>
      <p>그러면 두 질문이 남습니다. 큰 field 값의 carry는 work item 안에서 어떤 순서로 흐르는가? Jacobian 중간값이 달라도 최종 point가 같은지는 어떻게 확인하는가? 이후 절은 이 경로 안으로 한 단계씩 들어갑니다.</p>
      <EcGpuOpsMappingViz />
      <ContentBoundary article="ec-gpu-ops" />
    </section>

    <section id="field-layout" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Limb 소유권</p><h2 className="mt-2 text-2xl font-bold">먼저 누가 큰 정수 전체를 들고 있는지 정한다</h2></header>
      <p>Field 값은 radix <code>2^w</code>의 여러 자리로 나눕니다. 고정 ec-gpu CUDA source에서는 한 logical work item이 이 자리 전체를 소유하고 32-bit limbs로 계산합니다.</p>
      <p>Bellperson 사례의 BLS12-381 base field <code>Fp</code>는 CUDA source에서 12개, scalar field는 8개 u32 limbs로 표현됩니다. OpenCL 생성 경로는 같은 word를 64-bit limbs로 묶습니다. 여러 warp lanes가 limbs를 하나씩 나누는 방식은 가능한 대안이지만 이 ec-gpu mapping은 아닙니다.</p>
      <ExplainedFormula question="큰 field element를 L개 limbs로 나눈다는 것은 각 lane이 어떤 값을 소유한다는 뜻일까?" idea={<>Radix 2^w 자리값을 사용하면 limb l은 <code>x_l·2^(w·l)</code>의 계수를 담습니다. 이 표기와 endian order를 host serialization, CPU reference와 kernel이 동일하게 써야 합니다.</>} formula={String.raw`x=\sum_{\ell=0}^{L-1}x_\ell 2^{w\ell},\qquad 0\le x_\ell<2^w`}
      annotatedFormula={String.raw`x=\sum_{\ell=0}^{L-1}\underbrace{x_\ell}_{\text{limb ℓ의 digit}}\underbrace{2^{w\ell}}_{\text{자리값}},\qquad \underbrace{0\le x_\ell<2^w}_{\text{한 word에 들어감}}`}
      operations={[
  { expression: String.raw`\sum_{\ell=0}^{L-1}x_\ell 2^{w\ell}`, annotation: ["limb ℓ은 radix 2^w의 ℓ번째 자리 계수","little-endian 순서로 L개를 더하면 x","w=8, [1,2,0,0] → 1+2·256 = 513"] },
  { expression: String.raw`0\le x_\ell<2^w`, annotation: ["각 limb는 w-bit word 하나에 담깁니다","CUDA는 w=32라 BN254 8 limbs","endian을 뒤집으면 다른 field 값"] },
]} terms={[
        {symbol:"x",name:"Field representative",description:"Decode 뒤 0≤x<p인 canonical residue 또는 명시한 Montgomery-domain value입니다."},
        {symbol:"L",name:"Limb count",description:"Field 값을 저장하는 machine words 개수입니다."},
        {symbol:"w",name:"Limb width",description:"한 limb의 bits이며 backend와 multiplication primitive가 지원해야 합니다."},
        {symbol:"x_\\ell",name:"Limb value",description:"Little-endian radix에서 index ℓ가 소유한 digit입니다."},
      ]} assumptions={["Limb order, w, modulus p와 internal Montgomery domain이 host·device에서 같습니다.","Unused top bits와 noncanonical x≥p 입력을 decode boundary에서 처리합니다."]} interpretation="w=8,L=4에서 limbs [1,2,0,0]은 1+2·256=513입니다. 배열 bytes를 반대 endian으로 읽으면 같은 memory가 전혀 다른 field value가 됩니다." />
      <p>한 work item이 많은 limbs와 point 임시값을 가지면 register 사용량이 늘어납니다. Register가 부족하면 일부 값이 local memory로 밀려날 수 있습니다.</p>
      <p>AoS와 SoA는 같은 값을 담아도 warp가 읽는 주소가 달라집니다. 그래서 실제 DRAM transaction과 alignment를 profiler로 확인합니다. Warp-cooperative 대안은 별도 kernel로 구현해 같은 입력에서 비교합니다.</p>
    </section>

    <section id="fp-montgomery" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Carry 순서</p><h2 className="mt-2 text-2xl font-bold">부분곱은 함께 만들 수 있어도 carry는 다음 자리로 이어진다</h2></header>
      <p>L×L limb 곱셈은 여러 부분곱을 만들지만, 같은 output column의 합은 앞 column carry를 받아야 확정됩니다. Accumulator가 넘치지 않는 범위를 확인하고 필요하면 중간 reduction을 넣습니다.</p>
      <p>CUDA의 <code>add.cc</code>/<code>addc</code> 계열이나 high-half 곱셈이 target에서 어떻게 내려갔는지도 확인합니다. 소스 이름만 믿지 않고 disassembly와 경계 입력 벡터를 함께 봅니다.</p>
      <ExplainedFormula question="한 output limb와 다음 carry는 이전 carry에 어떻게 의존할까?" idea={<>같은 radix column의 partial products와 이전 carry를 합한 t에서 낮은 w bits를 현재 limb로 남기고 나머지를 다음 column으로 넘깁니다. 따라서 carry chain을 무시한 lane-parallel add는 틀립니다.</>} formula={String.raw`\begin{aligned}t_k&=c_k+\sum_{i+j=k}a_i b_j\\z_k&=t_k\bmod 2^w\\c_{k+1}&=\left\lfloor t_k/2^w\right\rfloor\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}t_k&=\underbrace{c_k}_{\text{앞 column carry}}+\underbrace{\sum_{i+j=k}a_i b_j}_{\text{같은 column 부분곱}}\\z_k&=\underbrace{t_k\bmod 2^w}_{\text{남길 낮은 w bit}}\\c_{k+1}&=\underbrace{\left\lfloor t_k/2^w\right\rfloor}_{\text{다음 column으로}}\end{aligned}`}
      operations={[
  { expression: String.raw`c_k+\sum_{i+j=k}a_i b_j`, annotation: ["w=8, a=[250,1], b=[3,0]","column 0은 250×3=750"] },
  { expression: String.raw`t_k\bmod 2^w`, annotation: ["750 mod 256=238이 낮은 limb","z₀=238"] },
  { expression: String.raw`\left\lfloor t_k/2^w\right\rfloor`, annotation: ["carry는 floor(750/256)=2","column 1은 1×3+2=5","결과 [238,5]=1518"] },
]} terms={[
        {symbol:"a_i,b_j",name:"Input limbs",description:"두 wide integer의 radix-2^w digits입니다."},
        {symbol:"k",name:"Product column",description:"i+j가 같은 partial products가 모이는 위치입니다."},
        {symbol:"c_k",name:"Incoming carry",description:"이전 column에서 넘어온 상위 값입니다."},
        {symbol:"t_k",name:"Wide accumulator",description:"Column partial products와 incoming carry의 합입니다."},
        {symbol:"z_k",name:"Output limb",description:"Accumulator의 낮은 w bits입니다."},
        {symbol:"c_{k+1}",name:"Outgoing carry",description:"다음 column이 반드시 소비해야 하는 나머지 상위 값입니다."},
      ]} assumptions={["Accumulator type 또는 multiword schedule이 t_k의 최대값을 overflow 없이 보존합니다.","Signedness와 high-half multiply, carry flag semantics를 target instruction에서 고정합니다."]} interpretation="506=[250,1]과 3=[3,0]을 곱하면 첫 column은 750에서 limb 238과 carry 2로 갈라집니다. 다음 column은 1×3+2=5이므로 결과 [238,5]는 238+5×256=1518입니다." />
      <p>
            Montgomery constants와 final conditional subtraction은 이 글에서 새로 유도하지 않습니다. 다만 kernel은 input/output이
            normal residue인지 R-domain인지 API boundary에 명시하고 0·1·p−1·p·2p−1과 cross-domain 입력을 reference와 대조해야
            합니다.
          </p>
      <div id="paper-ec-gpu-field-kernel"><CitationBlock type="code" citeKey={1} source="ec-gpu field.cl · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/cl/field.cl`}><p><strong>문제:</strong> Fixed limbs의 wide product와 modular reduction을 CUDA/OpenCL source로 내려야 합니다.</p><p><strong>핵심 기여:</strong> Pinned implementation의 CUDA carry-chain path와 default CIOS-style field operations를 보여 줍니다.</p><p><strong>중요 가정:</strong> Generated constants, backend limb width와 README의 prime top-bit 전제를 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 field kernel functions입니다.</p><p><strong>일반화 금지:</strong> Instruction cycle 수·register 수·occupancy·speedup을 고정하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="point-ops" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Point batch</p><h2 className="mt-2 text-2xl font-bold">Jacobian은 역원을 뒤로 미루지만 예외를 없애지는 않는다</h2></header>
      <p>Affine 덧셈은 기울기를 구할 때 field inverse가 필요합니다. Jacobian 좌표는 scale을 Z에 흡수해 곱셈과 제곱으로 덧셈을 진행하고 마지막에 normalize합니다.</p>
      <p>그러나 무한원점, 같은 점, 서로 반대인 점은 따로 확인해야 합니다. Mixed-add의 입력 형식도 고정해야 합니다. 사용한 공식이 complete formula인지, 별도 branch가 필요한지 source를 기준으로 판정합니다.</p>
      <ExplainedFormula question="Jacobian triple이 어떤 affine point를 나타내며 normalization은 무엇을 계산할까?" idea={<>Z의 powers를 coordinate scale로 흡수해 매 add마다 inverse를 하지 않고, batch가 끝날 때 Z inverse를 한 번 사용해 affine coordinates로 돌아갑니다.</>} formula={String.raw`\begin{aligned}x&=XZ^{-2}\\y&=YZ^{-3},\qquad Z\ne0\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}x&=X\underbrace{Z^{-2}}_{\text{x 축척 되돌림}}\\y&=Y\underbrace{Z^{-3}}_{\text{y 축척 되돌림}},\qquad \underbrace{Z\ne0}_{\text{유한 point}}\end{aligned}`}
      operations={[
  { expression: String.raw`XZ^{-2}`, annotation: ["add 동안 Z²로 흡수한 scale을","batch 끝에 inverse 한 번으로 풉니다","Z=2면 x = X/4"] },
  { expression: String.raw`YZ^{-3}`, annotation: ["y는 Z³ scale이므로 같은 inverse로","Z=2면 y = Y/8"] },
  { expression: String.raw`Z\ne0`, annotation: ["Z=0인 infinity는 이 식 밖의","별도 encoding 규칙으로 처리합니다"] },
]} terms={[
        {symbol:"X,Y,Z",name:"Jacobian coordinates",description:"GPU point kernel이 내부에서 보존하는 projective triple입니다."},
        {symbol:"x,y",name:"Affine coordinates",description:"Canonical output 또는 CPU reference가 비교하는 curve coordinates입니다."},
        {symbol:"Z^{-1}",name:"Field inverse",description:"Normalization에서 구하며 zero/infinity encoding은 별도 규칙을 따릅니다."},
        {symbol:String.raw`\sim`,name:"같은 point 관계",description:"서로 다른 nonzero scale triples가 같은 affine point를 표현합니다."},
      ]} assumptions={["Coordinates는 같은 base field와 curve parameter를 사용하고 Z≠0인 finite point 식입니다.","Point at infinity의 internal representation과 encode policy는 backend contract로 별도 정의합니다."]} interpretation="Z=2라면 x=X/4, y=Y/8입니다. Jacobian이 field operation 수를 항상 최소화하거나 모든 formula가 complete하다는 결론은 아닙니다." />
      <p>한 thread가 point 하나를 처리하면 X/Y/Z 임시값 때문에 register 사용량이 커질 수 있습니다. 반대로 warp-cooperative 방식은 lane 통신과 분기 비용이 늘 수 있습니다.</p>
      <p>같은 batch에서 register 수, spill, resident warp, branch efficiency와 point/s를 함께 봅니다. Normalize와 serialization 비용도 end-to-end 시간에서 빼지 않습니다.</p>
      <div id="paper-ec-gpu-point-kernel"><CitationBlock type="code" citeKey={2} source="ec-gpu ec.cl · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/cl/ec.cl`}><p><strong>문제:</strong> 매 point add마다 inverse하지 않고 a=0 short-Weierstrass points를 처리해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned Jacobian double, mixed/full add와 infinity·same-point branches를 concrete field operations로 내립니다.</p><p><strong>중요 가정:</strong> 지원 curve parameter, field domain과 internal point representation을 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision에 구현된 formulas와 branches입니다.</p><p><strong>일반화 금지:</strong> 모든 curve에서 complete formula이거나 untrusted point validation을 대신한다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="msm-mapping" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · MSM 작업 배치</p><h2 className="mt-2 text-2xl font-bold">한 work item은 자기 window와 bucket 구간만 갱신한다</h2></header>
      <p>고정 multiexp kernel은 global ID를 window와 point group으로 풉니다. 이 두 값으로 읽을 scalar bit 위치, point 범위, bucket slice가 정해집니다.</p>
      <p>Scalar digit이 0이면 건너뜁니다. 0이 아니면 index를 1 줄여 대응 bucket에 mixed-add합니다. 마지막에는 bucket을 뒤에서부터 누적해 이 window와 group의 partial result를 만듭니다.</p>
      <ExplainedFormula question="Global work-item ID가 어떤 MSM window와 group을 맡는지 어떻게 풀어낼까?" idea={<>Windows를 빠르게 변하는 축으로 두면 나머지가 window, 몫이 같은 point chunk를 처리할 group이 됩니다. Host와 kernel이 같은 num_windows를 써야 bucket slice가 겹치지 않습니다.</>} formula={String.raw`\begin{aligned}window&=gid\bmod W\\group&=\left\lfloor gid/W\right\rfloor\\B&=2^c-1\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}window&=\underbrace{gid\bmod W}_{\text{읽을 digit 위치}}\\group&=\underbrace{\left\lfloor gid/W\right\rfloor}_{\text{맡을 point 묶음}}\\B&=\underbrace{2^c-1}_{\text{0 제외 bucket 수}}\end{aligned}`}
      operations={[
  { expression: String.raw`gid\bmod W`, annotation: ["window를 빠르게 변하는 축으로 두어","나머지가 scalar digit 위치가 됩니다","W=4, gid=6 → window 2"] },
  { expression: String.raw`\left\lfloor gid/W\right\rfloor`, annotation: ["몫은 같은 point/scalar range와","겹치지 않는 bucket slice를 고릅니다","6/4 → group 1"] },
  { expression: String.raw`2^c-1`, annotation: ["c-bit digit의 값 중 0은 건너뛰므로","bucket은 2^c-1개","c=3이면 7개"] },
]} terms={[
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
      <header><p className="text-sm font-semibold text-primary">05 · Release gate</p><h2 className="mt-2 text-2xl font-bold">정답을 통과한 kernel만 속도를 비교한다</h2></header>
      <p>먼저 field 경계값을 확인합니다.</p>
      <ul className="list-disc space-y-2 pl-6"><li>0, 1, p−1과 긴 carry</li><li>넓은 곱의 최댓값과 canonical 범위 밖 입력</li><li>normal residue와 Montgomery-domain 값을 뒤섞은 입력</li></ul>
      <p>그다음 point 경계를 확인합니다.</p>
      <ul className="list-disc space-y-2 pl-6"><li>무한원점, P+O, P+(−P), P+P</li><li>subgroup 경계와 잘못된 encoding</li><li>무작위 CPU reference vector</li></ul>
      <p>중간 Jacobian triple은 byte-for-byte 같을 필요가 없습니다. 둘 다 normalize한 뒤 같은 affine point인지 비교합니다.</p>
      <p>성능은 curve, batch, 입력 분포, compiler flag와 GPU clock을 고정합니다. Warm-up 뒤 CUDA event로 kernel-only median/p95를 재고, H2D·변환·normalize·D2H·sync를 포함한 end-to-end도 따로 잽니다.</p>
      <p>실제 bandwidth, integer instruction, register/thread, occupancy, spill, branch·warp stall을 같은 영수증에 남깁니다. 그래야 빨라지거나 느려진 이유를 설명할 수 있습니다.</p>
      <ExplainedFormula question="Point kernel의 useful throughput과 memory traffic을 어떤 경계로 기록할까?" idea={<>정확히 normalize된 output point 수를 같은 elapsed time으로 나누고, 요청 bytes와 profiler의 actual DRAM bytes를 분리해 저장합니다.</>} formula={String.raw`\begin{aligned}R_{point}&=\frac{N_{valid}}{t_{kernel}}\\B_{dram}&=\frac{B_{read}^{actual}+B_{write}^{actual}}{t_{kernel}}\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}R_{point}&=\frac{\underbrace{N_{valid}}_{\text{검증 통과 output}}}{\underbrace{t_{kernel}}_{\text{warm kernel 시간}}}\\B_{dram}&=\frac{\underbrace{B_{read}^{actual}+B_{write}^{actual}}_{\text{profiler 실측 bytes}}}{t_{kernel}}\end{aligned}`}
      operations={[
  { expression: String.raw`\frac{N_{valid}}{t_{kernel}}`, annotation: ["reference와 같은 affine point로 확인된","output만 세어 kernel 시간으로 나눕니다","100만 add / 2ms = 5억 add/s"] },
  { expression: String.raw`\frac{B_{read}^{actual}+B_{write}^{actual}}{t_{kernel}}`, annotation: ["요청 bytes가 아니라 profiler가 본","실제 DRAM traffic을 같은 t로 나눕니다","conversion 8ms 더하면 전체 1억/s"] },
]} terms={[
        {symbol:"N_{valid}",name:"Validated outputs",description:"Reference와 같은 affine point로 확인된 output 개수입니다."},
        {symbol:"t_{kernel}",name:"Device elapsed",description:"Warm-up 뒤 같은 stream event 경계의 seconds입니다."},
        {symbol:"R_{point}",name:"Point throughput",description:"초당 correct point operations이며 operation 종류를 함께 표시합니다."},
        {symbol:"B_{dram}",name:"Achieved DRAM bandwidth",description:"Profiler actual transactions 기준 read/write bytes per second입니다."},
      ]} assumptions={["Add·double·normalize를 섞지 않고 operation mix 또는 pipeline 경계를 명시합니다.","Reference parity 실패 output은 useful count에 포함하지 않으며 clocks·software revision을 고정합니다."]} interpretation="100만 add가 2ms이고 모두 맞으면 5억 add/s이지만 conversion 8ms가 더 들면 end-to-end는 1억/s입니다. Peak bandwidth나 occupancy만으로 throughput 원인을 단정할 수 없습니다." />
      <div id="paper-cuda-ec-ops"><CitationBlock type="code" citeKey={4} source="NVIDIA CUDA C++ Programming Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> Warp execution, register/shared/global memory와 synchronization semantics가 필요합니다.</p><p><strong>핵심 기여:</strong> CUDA execution·memory model과 device capability 조회 방법을 정의합니다.</p><p><strong>중요 가정:</strong> Toolkit 12.8.1 archive, target compute capability와 compiler output을 함께 확인합니다.</p><p><strong>근거 범위:</strong> 공식 CUDA semantics에 한정합니다.</p><p><strong>일반화 금지:</strong> 높은 occupancy가 EC arithmetic에서 자동으로 빠르다는 보장은 아닙니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> Reader는 513의 limb 표현과 506×3 carry를 계산하고, gid=6의 window·group·bucket slice를 구하며, Jacobian normalize·예외 fixture·kernel/end-to-end benchmark를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

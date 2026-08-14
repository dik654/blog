import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EcGpuGenArtifactViz } from "./viz/ModernEcGpuGenViz";

const ECGPU = "https://github.com/filecoin-project/ec-gpu/tree/16d38ef6715fb1a4968986d3a5635f8bcac6c984";
const BELLPERSON = "https://github.com/filecoin-project/bellperson/tree/728306c8ee52f53dbd55ea02557affcdfb546ae7";
const OPENCL = "https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html";

export default function ModernEcGpuGenArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Field type에서 실행 artifact까지</p><h2 className="text-3xl font-bold tracking-tight">ec-gpu-gen은 곡선 공식을 발명하는 도구가 아니라, 검증된 parameter를 backend source에 특수화하는 build pipeline이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>ec-gpu-gen</strong>은 Rust field/curve type을 받아 CUDA 또는 OpenCL용 finite-field·elliptic-curve kernel을 생성합니다. 같은 add·multiply·FFT·multiexponentiation template라도 modulus, limb count, Montgomery constants와 curve type이 달라지므로, 사람이 복사한 상수를 여러 kernel에 흩뿌리는 대신 한 typed source에서 artifact를 만듭니다.</p>
      <p>Field arithmetic의 정확성 자체는 <a className="text-primary hover:underline" href="/crypto/field-arithmetic">field 정본</a>, GPU point mapping은 <a className="text-primary hover:underline" href="/gpu/ec-gpu-ops">EC GPU ops</a>가 소유합니다. 이 글은 parameter specialization, generated artifact provenance, CUDA/OpenCL parity와 codegen release gate에 집중합니다.</p>
      <EcGpuGenArtifactViz />
      <ContentBoundary article="ec-gpu-gen" />
    </section>

    <section id="parameter-contract" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Parameter contract</p><h2 className="mt-2 text-2xl font-bold">GpuField adapter가 제공하는 값과 generator가 유도하는 값을 구분한다</h2></header>
      <p>Pinned interface의 <code>GpuName</code>/<code>GpuField</code> boundary는 GPU-safe type 이름과 little-endian u32 words의 <code>one</code>, <code>r2</code>, <code>modulus</code>, optional subfield를 제공합니다. Curve coefficient나 generator 좌표까지 trait가 모두 제공한다고 설명하면 실제 API와 다릅니다. Generator는 이 snapshot과 backend limb width에서 필요한 derived constants를 만듭니다.</p>
      <p>CUDA와 OpenCL이 허용하는 limb width도 같다고 가정하면 안 됩니다. Pinned source에서 CUDA는 32-bit limbs, OpenCL generated source는 64-bit limbs를 사용하며, prime의 most-significant bit가 unset이라는 reduction 전제를 둡니다. 따라서 새 field를 추가할 때 modulus만 바꾸는 것이 아니라 top-bit, limb packing, derived constants와 reference vectors를 함께 검증합니다.</p>
      <ExplainedFormula question="Modulus p와 backend limb width w에서 representation constants는 어떻게 정해질까?" idea={<>p를 담을 최소 limb 수 L을 정한 뒤 radix R을 limb capacity로 두고, normal residue를 Montgomery domain으로 옮길 R²와 낮은 word cancellation constant를 준비합니다.</>} formula={String.raw`\begin{aligned}L&=\left\lceil\frac{\operatorname{bitlen}(p)}{w}\right\rceil\\R&=2^{wL}\\R_2&=R^2\bmod p\\p'&=-p_0^{-1}\bmod 2^w\end{aligned}`} terms={[
        {symbol:"p",name:"Prime modulus",description:"GpuField가 제공하는 field identity의 modulus입니다."},
        {symbol:"w",name:"Backend limb width",description:"CUDA path는 32, OpenCL generated path는 64 bits를 사용합니다."},
        {symbol:"L",name:"Limb count",description:"p를 담는 backend words 개수입니다."},
        {symbol:"R",name:"Montgomery radix",description:"전체 limb capacity의 2의 거듭제곱입니다."},
        {symbol:"R_2",name:"Conversion constant",description:"Normal residue를 Montgomery representation으로 옮길 때 쓰는 R² mod p입니다."},
        {symbol:"p_0",name:"Low modulus limb",description:"p의 가장 낮은 w-bit word입니다."},
        {symbol:"p'",name:"Cancellation constant",description:"Word-by-word reduction에서 low limb를 없애는 modular inverse constant입니다."},
      ]} assumptions={["p는 odd prime이고 inverse가 존재하며 pinned implementation의 top-bit 전제를 만족합니다.","Montgomery 유도 자체는 field 정본을 재사용하고 여기서는 generator input/output contract만 다룹니다."]} interpretation="bitlen(p)=254이면 CUDA w=32에서 L=8, OpenCL w=64에서 L=4입니다. 같은 field라도 backend source layout이 다르며 constants를 손으로 복사하지 않습니다." />
      <div id="paper-ec-gpu-interface"><CitationBlock type="code" citeKey={1} source="ec-gpu GpuField interface · commit 16d38ef" href={`${ECGPU}/ec-gpu/src/lib.rs`}><p><strong>문제:</strong> Rust field type과 generator 사이의 최소 parameter boundary가 필요합니다.</p><p><strong>핵심 기여:</strong> Pinned <code>GpuName</code>/<code>GpuField</code> methods와 word serialization contract를 정의합니다.</p><p><strong>중요 가정:</strong> Commit 16d38ef의 interface와 implementing field revision을 고정합니다.</p><p><strong>근거 범위:</strong> Trait가 실제 제공하는 parameter surface입니다.</p><p><strong>일반화 금지:</strong> Trait 구현이 constants의 정확성·curve security를 자동 증명하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="codegen" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Source specialization</p><h2 className="mt-2 text-2xl font-bold">SourceBuilder가 field·FFT·multiexp capability를 중복 없이 조립한다</h2></header>
      <p>공식 revision의 quickstart는 <code>SourceBuilder::new().add_field::&lt;Scalar&gt;().build_64_bit_limbs()</code>처럼 field type을 등록합니다. Integration에서는 <code>build.rs</code>가 <code>add_fft</code>·<code>add_multiexp</code> 같은 capability를 고른 뒤 <code>generate</code>를 호출합니다. 즉 “curve 이름 문자열” 하나가 아니라 어떤 base/extension field와 operation family를 생성했는지가 artifact interface입니다.</p>
      <ExplainedFormula question="생성된 kernel artifact의 identity에는 어떤 입력이 모두 들어가야 할까?" idea={<>Field 값뿐 아니라 template revision, operation set, backend, compiler flags와 target architecture가 달라지면 실행 artifact도 달라집니다. 이 tuple을 hash해 cache와 benchmark의 key로 사용합니다.</>} formula={String.raw`K=H(F,\,C,\,O,\,R_t,\,B,\,V_c,\,A,\,\Phi)`} terms={[
        {symbol:"K",name:"Artifact key",description:"Build output·cache·measurement receipt를 연결하는 digest입니다."},
        {symbol:"F",name:"Field parameters",description:"Modulus, limb width/count, Montgomery constants와 field identity입니다."},
        {symbol:"C",name:"Curve parameters",description:"필요한 경우 curve ID, coefficients와 point representation입니다."},
        {symbol:"O",name:"Operation set",description:"Field, FFT, multiexp 등 SourceBuilder에 등록한 capability입니다."},
        {symbol:"R_t",name:"Template revision",description:"ec-gpu source commit과 local patch identity입니다."},
        {symbol:"B",name:"Backend",description:"CUDA 또는 OpenCL path입니다."},
        {symbol:"V_c",name:"Compiler version",description:"nvcc 또는 OpenCL compiler/driver revision입니다."},
        {symbol:"A",name:"Target architecture",description:"예: CUDA compute capability와 generated code target입니다."},
        {symbol:String.raw`\Phi`,name:"Build flags",description:"Optimization, feature flags와 backend-specific arguments입니다."},
      ]} assumptions={["H는 collision-resistant build digest이고 모든 serialized fields는 순서와 encoding이 고정됩니다.","Runtime driver와 device identity처럼 build 뒤 달라질 값은 별도 execution receipt에 남깁니다."]} interpretation="Field와 source가 같아도 sm_80과 sm_90 target 또는 compiler flags가 다르면 K가 달라집니다. Hash 일치는 correctness 증명이 아니라 동일 artifact를 재현했다는 provenance입니다." />
      <div id="paper-ec-gpu-source-builder"><CitationBlock type="code" citeKey={2} source="ec-gpu SourceBuilder · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/source.rs`}><p><strong>문제:</strong> Base/extension fields와 field·FFT·MSM templates를 deterministic source로 조립해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned SourceBuilder의 deduplication, naming과 operation-family assembly를 보여 줍니다.</p><p><strong>중요 가정:</strong> Commit 16d38ef, selected features와 ordered builder inputs를 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 source construction path입니다.</p><p><strong>일반화 금지:</strong> 임의 curve formula의 지원이나 backend compiler parity를 자동 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="artifact-lifecycle" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Artifact lifecycle</p><h2 className="mt-2 text-2xl font-bold">Generated source뿐 아니라 compiler output과 resolved configuration을 보존한다</h2></header>
      <p>공식 integration에서 CUDA는 build 과정에 fatbin을 만들고, OpenCL은 source를 생성해 runtime에 compile합니다. 생성 경로는 내부 환경 변수로 artifact 위치를 전달하고 <code>program!</code> macro가 device별 program을 만듭니다. 그러므로 “같은 Rust binary”만 기록하면 OpenCL driver가 만든 binary, 선택된 device와 runtime options를 재현할 수 없습니다.</p>
      <p>Build log에는 field/curve type, ec-gpu commit, Cargo feature set, generated source digest, compiler command·stderr와 artifact digest를 남깁니다. Runtime log에는 backend, device UUID/name, driver, loaded artifact key, kernel entry names와 fallback reason을 남깁니다. Build 실패를 빈 source나 오래된 cache로 조용히 대체하지 않고 명시적으로 fail하거나 승인된 CPU fallback으로 전환합니다.</p>
      <ExplainedFormula question="Codegen 변경이 전체 실행 시간에 이득인지 build·startup·steady-state를 어떻게 나눌까?" idea={<>Build-time compile, 첫 program creation, 반복 kernel 실행은 서로 다른 사용자가 지불합니다. 배포 빈도와 process lifetime을 고정해 amortized cost를 계산합니다.</>} formula={String.raw`T_{amort}=\frac{T_{build}}{D}+\frac{T_{startup}}{R}+T_{steady}`} terms={[
        {symbol:"T_{amort}",name:"Amortized per-run time",description:"배포와 process 재시작 비용을 평균해 한 workload 실행에 배분한 값입니다."},
        {symbol:"T_{build}",name:"Build cost",description:"Source generation과 backend compilation 시간입니다."},
        {symbol:"D",name:"Runs per build",description:"동일 artifact가 재사용되는 workload 실행 수입니다."},
        {symbol:"T_{startup}",name:"Runtime initialization",description:"Device discovery, OpenCL compile 또는 program/module load 시간입니다."},
        {symbol:"R",name:"Runs per process",description:"동일 initialized process에서 수행하는 실행 수입니다."},
        {symbol:"T_{steady}",name:"Steady-state execution",description:"Warm 상태에서 transfer·kernel·sync의 target workload 시간입니다."},
      ]} assumptions={["Build와 startup cache hit/miss policy를 명시하고 동일한 artifact를 재사용합니다.","D와 R은 실제 deployment lifecycle에서 관찰한 값이며 임의의 큰 수로 startup을 숨기지 않습니다."]} interpretation="Build 60s를 600 runs에, startup 2s를 100 runs에 나누고 steady 30ms라면 run당 150ms입니다. Kernel 30ms만 보고 운영 latency를 주장하면 안 됩니다." />
      <div id="paper-ec-gpu-artifact-lifecycle"><CitationBlock type="code" citeKey={3} source="ec-gpu artifact generation · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/source.rs`}><p><strong>문제:</strong> Generated sources를 reproducible CUDA/OpenCL build outputs로 전달해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned path는 CUDA source→nvcc fatbin과 OpenCL source embedding, digest·environment handoff를 구현합니다.</p><p><strong>중요 가정:</strong> Feature set, nvcc arguments, compiler와 target architecture를 고정합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 artifact lifecycle입니다.</p><p><strong>일반화 금지:</strong> 새로운 SM 지원, runtime cache hit 또는 빠른 startup을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="runtime-dispatch" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Runtime dispatch</p><h2 className="mt-2 text-2xl font-bold">CUDA와 OpenCL은 unified Program 뒤에 있지만 artifact lifecycle은 다르다</h2></header>
      <p>ec-gpu는 <code>cuda</code>와 <code>opencl</code> feature를 지원하고, 둘 다 활성화되면 runtime framework selection을 제공합니다. 그러나 CUDA fatbin과 OpenCL runtime source compile은 artifact lifecycle이 다르며, integer overflow·shift·address-space·work-group semantics가 source 언어와 compiler에서 같다는 보장도 없습니다.</p>
      <p>Parity test는 CPU reference, CUDA, OpenCL에 같은 canonical field/point vectors를 넣고 output을 canonical form으로 decode해 비교합니다. 0·p−1·carry chain, invalid/noncanonical input, infinity·doubling, FFT round trip, MSM zero/repeated points와 unsupported device를 포함합니다. Backend별 work-group/block size가 달라도 결과와 failure class는 같아야 하며, 하나가 성공하고 다른 하나가 silently truncates하면 release하지 않습니다.</p>
      <div id="paper-ec-gpu-program-dispatch"><CitationBlock type="code" citeKey={4} source="ec-gpu program dispatch · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/program.rs`}><p><strong>문제:</strong> Feature-supported backend를 고르고 embedded artifact로 device program을 만들어야 합니다.</p><p><strong>핵심 기여:</strong> Pinned <code>program!</code> path의 environment/device selection과 CUDA load·OpenCL compile branches를 보여 줍니다.</p><p><strong>중요 가정:</strong> Embedded artifacts, enabled features와 available device/backend가 일치합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 runtime dispatch behavior입니다.</p><p><strong>일반화 금지:</strong> CUDA/OpenCL numerical parity, driver quality나 같은 성능을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-opencl-api"><CitationBlock type="code" citeKey={5} source="Khronos OpenCL 3.0 Unified Specification" href={OPENCL}><p><strong>문제:</strong> OpenCL program build, kernel, memory와 command-queue semantics가 필요합니다.</p><p><strong>핵심 기여:</strong> OpenCL 3.0 API contract와 feature query boundary를 정의합니다.</p><p><strong>중요 가정:</strong> 실제 platform이 광고한 version과 optional features를 runtime에 조회합니다.</p><p><strong>근거 범위:</strong> OpenCL API와 execution semantics입니다.</p><p><strong>일반화 금지:</strong> CUDA와 bit-identical code generation이나 같은 성능을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-bellperson-ec-gpu-build"><CitationBlock type="code" citeKey={6} source="bellperson build integration · commit 728306c" href={`${BELLPERSON}/build.rs`}><p><strong>문제:</strong> Consumer prover가 Scalar FFT와 G1/G2 multiexp sources를 build에 포함해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned build script의 실제 SourceBuilder integration을 보여 줍니다.</p><p><strong>중요 가정:</strong> Commit 728306c, selected Cargo features와 matching ec-gpu dependency를 고정합니다.</p><p><strong>근거 범위:</strong> Bellperson의 build-time capability registration입니다.</p><p><strong>일반화 금지:</strong> Prover 시간 비율, 고정 speedup이나 현재 production deployment를 주장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Parameter diff에서 proof parity·rollback까지 한 변경 단위로 검증한다</h2></header>
      <p>새 field/curve 또는 compiler flag를 넣으면 먼저 generated constants와 source digest를 review하고 CPU vectors를 통과시킵니다. 그다음 지원 GPU마다 clean build와 cache-hit build를 나누고 CUDA/OpenCL/CPU output과 failure parity를 검사합니다. Finally fixed proof workload에서 build, cold startup, warm kernel, H2D/D2H, synchronization, peak memory와 end-to-end median/p95를 기록합니다.</p>
      <p>Release artifact에는 crate/source SHA, compiler·driver, target architecture, generated source/fatbin digest와 proof verification receipt를 붙입니다. Unknown device, compiler error, OOM, concurrent program conflict에서는 typed error와 승인된 CPU fallback을 사용하고, 이전 artifact key로 되돌릴 수 있어야 합니다. 코드 생성 성공은 proof correctness가 아니며 independent verifier 성공이 마지막 gate입니다.</p>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> Reader는 SourceBuilder→artifact→program 흐름을 설명하고, artifact key와 amortized 150ms 예를 계산하며, CUDA/OpenCL parity fixture와 provenance·fallback·rollback release gate를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

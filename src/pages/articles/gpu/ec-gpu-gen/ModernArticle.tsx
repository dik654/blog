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
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Field type에서 실행 artifact까지</p><h2 className="text-3xl font-bold tracking-tight">한 번 고른 field 값을 CUDA와 OpenCL 커널에 똑같이 넣는 빌드 파이프라인</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>ec-gpu-gen</strong>은 새로운 곡선 공식을 만드는 도구가 아닙니다. Rust 타입이 건넨 field 값을 이미 검토된 연산 틀에 채우고, CUDA 또는 OpenCL이 실행할 소스로 바꾸는 도구입니다.</p>
      <p>Bellperson의 실제 <code>build.rs</code> 한 건을 보겠습니다. 이 파일은 Scalar FFT, G1 MSM, G2 MSM을 요청합니다. ec-gpu-gen은 필요한 field를 한 번씩만 모으고, 같은 요청에서 CUDA fatbin과 OpenCL source를 만듭니다. 아래 그림의 다섯 단계를 따라가면 이 글의 결론이 먼저 잡힙니다.</p>
      <p>여기서 곧 꼬리 질문이 생깁니다. “같은 field인데 왜 backend마다 배열 모양이 달라지는가?”, “같은 Program API라면 결과도 같은가?”, “코드가 생성됐다는 사실만으로 증명이 맞다고 할 수 있는가?” 이후 절은 이 세 질문에 답합니다.</p>
      <EcGpuGenArtifactViz />
      <ContentBoundary article="ec-gpu-gen" />
    </section>

    <section id="parameter-contract" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 입력 계약</p><h2 className="mt-2 text-2xl font-bold">입력으로 받은 값과 생성기가 계산한 값을 먼저 나눈다</h2></header>
      <p>고정한 소스의 <code>GpuField</code>는 이름과 <code>one</code>, <code>r2</code>, <code>modulus</code>를 little-endian <code>u32</code> 배열로 제공합니다. 확장 field라면 하위 field 이름도 줍니다. 곡선 계수나 생성점 좌표까지 이 trait가 모두 준다고 말하면 실제 API와 다릅니다.</p>
      <p>더 중요한 경계가 있습니다. 생성기는 <code>R²</code>를 다시 계산하지 않습니다. 입력의 <code>r2</code> 배열을 그대로 32-bit word로 쓰거나 두 개씩 묶어 64-bit word로 만듭니다. 반면 Montgomery reduction에 쓰는 <code>INV</code>는 modulus의 낮은 word에서 backend 폭마다 계산합니다.</p>
      <ExplainedFormula question="u32 word 8개인 입력은 두 backend에서 어떻게 달라질까?" idea={<>CUDA 경로는 32-bit word를 그대로 쓰고, OpenCL 경로는 인접한 두 word를 little-endian 64-bit limb 하나로 묶습니다. 값은 같고 source의 배열 모양만 달라집니다.</>} formula={String.raw`\begin{aligned}L_{32}&=n=8\\L_{64}&=n/2=4\\q_j&=m_{2j}+2^{32}m_{2j+1}\\\operatorname{INV}_w&=-p_0^{-1}\bmod 2^w\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}L_{32}&=\underbrace{n}_{\text{입력 u32 word 수}}=8\\L_{64}&=\underbrace{n/2}_{\text{두 word를 한 limb로}}=4\\q_j&=\underbrace{m_{2j}+2^{32}m_{2j+1}}_{\text{little-endian pair packing}}\\\operatorname{INV}_w&=\underbrace{-p_0^{-1}\bmod 2^w}_{\text{backend 폭별로 계산}}\end{aligned}`}
      operations={[
  { expression: String.raw`L_{32}=n=8`, annotation: ["GpuField가 준 u32 배열 길이 n을","32-bit limb 수로 그대로 씁니다"] },
  { expression: String.raw`L_{64}=n/2=4`, annotation: ["u32 두 개를 u64 하나로 묶으므로","입력 길이는 짝수여야 합니다"] },
  { expression: String.raw`m_{2j}+2^{32}m_{2j+1}`, annotation: ["낮은 word를 아래 32bit에 두고","다음 word를 위 32bit에 둡니다"] },
  { expression: String.raw`-p_0^{-1}\bmod 2^w`, annotation: ["낮은 modulus limb의 역원으로","reduction에서 low limb를 없앱니다","w=32와 w=64는 각각 다시 계산합니다"] },
]} terms={[
        {symbol:"n",name:"Input word count",description:"GpuField가 돌려준 u32 배열의 길이입니다."},
        {symbol:"m_i",name:"Input word",description:"Little-endian 순서의 i번째 32-bit word입니다."},
        {symbol:"q_j",name:"Packed limb",description:"인접한 u32 두 개를 묶은 j번째 64-bit limb입니다."},
        {symbol:"L_w",name:"Backend limb count",description:"폭 w인 source가 사용하는 limb 수입니다."},
        {symbol:"p_0",name:"Low modulus limb",description:"폭 w로 포장한 modulus의 가장 낮은 limb입니다."},
        {symbol:String.raw`\operatorname{INV}_w`,name:"Cancellation constant",description:"Word별 Montgomery reduction에서 낮은 limb를 없애는 값입니다."},
      ]} assumptions={["one·r2·modulus 배열 길이가 서로 같고 64-bit 경로에서는 짝수입니다.","p는 홀수라서 낮은 limb의 2^w에 대한 역원이 존재합니다.","이 식은 commit 16d38ef의 packing 경로를 설명하며 임의 구현의 최소 limb 계산식이 아닙니다."]} interpretation="이 예에서는 CUDA source가 32-bit limb 8개를, OpenCL source가 같은 256bit를 64-bit limb 4개로 표현합니다. R² 값은 입력에서 왔고 INV만 backend 폭에 맞춰 새로 계산됩니다." />
      <div id="paper-ec-gpu-interface"><CitationBlock type="code" citeKey={1} source="ec-gpu GpuField interface · commit 16d38ef" href={`${ECGPU}/ec-gpu/src/lib.rs`}><p><strong>문제:</strong> Rust field type과 generator 사이의 최소 parameter boundary가 필요합니다.</p><p><strong>핵심 기여:</strong> Pinned <code>GpuName</code>/<code>GpuField</code> methods와 word serialization contract를 정의합니다.</p><p><strong>중요 가정:</strong> Commit 16d38ef의 interface와 implementing field revision을 고정합니다.</p><p><strong>근거 범위:</strong> Trait가 실제 제공하는 parameter surface입니다.</p><p><strong>일반화 금지:</strong> Trait 구현이 constants의 정확성·curve security를 자동 증명하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="codegen" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Source 조립</p><h2 className="mt-2 text-2xl font-bold">요청한 연산만 넣고, 겹치는 field는 한 번만 만든다</h2></header>
      <p>Bellperson의 고정 <code>build.rs</code>는 <code>add_fft::&lt;Scalar&gt;()</code>, <code>add_multiexp::&lt;G1Affine, Fp&gt;()</code>, <code>add_multiexp::&lt;G2Affine, Fp2&gt;()</code>를 차례로 호출합니다. <code>add_multiexp</code>는 좌표 field와 scalar field도 함께 등록합니다. 이미 들어간 field는 이름 기준 집합에서 중복이 제거됩니다.</p>
      <pre className="overflow-x-auto rounded-xl border border-border bg-muted/35 p-4 text-sm leading-6"><code>{`let source_builder = SourceBuilder::new()
    .add_fft::<Scalar>()
    .add_multiexp::<G1Affine, Fp>()
    .add_multiexp::<G2Affine, Fp2>();

ec_gpu_gen::generate(&source_builder);`}</code></pre>
      <p>따라서 artifact의 입력은 “BLS12-381” 같은 이름 하나가 아닙니다. 어떤 field와 연산 묶음을 등록했는지, 어느 ec-gpu revision의 template을 썼는지, 어떤 compiler와 target을 골랐는지가 모두 결과를 바꿉니다.</p>
      <ExplainedFormula question="생성된 kernel artifact의 identity에는 어떤 입력이 모두 들어가야 할까?" idea={<>Field 값뿐 아니라 template revision, operation set, backend, compiler flags와 target architecture가 달라지면 실행 artifact도 달라집니다. 이 tuple을 hash해 cache와 benchmark의 key로 사용합니다.</>} formula={String.raw`K=H(F,\,C,\,O,\,R_t,\,B,\,V_c,\,A,\,\Phi)`}
      annotatedFormula={String.raw`K=H(\underbrace{F,\,C}_{\text{field·curve 값}},\,\underbrace{O,\,R_t}_{\text{연산 set·template}},\,\underbrace{B,\,V_c,\,A,\,\Phi}_{\text{backend·compiler·target·flags}})`}
      operations={[
  { expression: String.raw`F,\,C`, annotation: ["modulus·limb·Montgomery 상수와","curve 값이 field identity를 정합니다"] },
  { expression: String.raw`O,\,R_t`, annotation: ["등록한 field·FFT·multiexp와","ec-gpu revision이 생성 source를 정함"] },
  { expression: String.raw`B,\,V_c,\,A,\,\Phi`, annotation: ["같은 source도 CUDA/OpenCL, nvcc 버전,","sm_80/sm_90·flags가 달라도 다른 결과물","모두 hash해 cache·benchmark key K로"] },
]} terms={[
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
      <header><p className="text-sm font-semibold text-primary">03 · Artifact 생애주기</p><h2 className="mt-2 text-2xl font-bold">생성 소스와 컴파일 결과를 함께 보존한다</h2></header>
      <p>공식 integration에서 CUDA는 build 과정에 fatbin을 만들고, OpenCL은 source를 생성해 runtime에 compile합니다. 생성 경로는 내부 환경 변수로 artifact 위치를 전달하고 <code>program!</code> macro가 device별 program을 만듭니다. 그러므로 “같은 Rust binary”만 기록하면 OpenCL driver가 만든 binary, 선택된 device와 runtime options를 재현할 수 없습니다.</p>
      <p>Build log에는 field/curve type, ec-gpu commit, Cargo feature set을 남깁니다. 생성한 source digest, compiler command·stderr, artifact digest도 같은 기록에 묶습니다.</p>
      <p>Runtime log에는 backend, device UUID/name, driver, loaded artifact key를 남깁니다. Kernel entry와 fallback 이유도 기록합니다. Build 실패를 빈 source나 오래된 cache로 숨기지 않고, 실패시키거나 승인된 CPU 경로로 전환합니다.</p>
      <ExplainedFormula question="Codegen 변경이 전체 실행 시간에 이득인지 build·startup·steady-state를 어떻게 나눌까?" idea={<>Build-time compile, 첫 program creation, 반복 kernel 실행은 서로 다른 사용자가 지불합니다. 배포 빈도와 process lifetime을 고정해 amortized cost를 계산합니다.</>} formula={String.raw`T_{amort}=\frac{T_{build}}{D}+\frac{T_{startup}}{R}+T_{steady}`}
      annotatedFormula={String.raw`T_{amort}=\underbrace{\frac{T_{build}}{D}}_{\text{build 비용 분담}}+\underbrace{\frac{T_{startup}}{R}}_{\text{초기화 비용 분담}}+\underbrace{T_{steady}}_{\text{warm 실행}}`}
      operations={[
  { expression: String.raw`\frac{T_{build}}{D}`, annotation: ["source 생성·compile 시간을","그 artifact로 돈 실행 수로 나눕니다","60s / 600 runs = 100ms"] },
  { expression: String.raw`\frac{T_{startup}}{R}`, annotation: ["device 탐색·program load 시간을","process 하나의 실행 수로 나눕니다","2s / 100 runs = 20ms"] },
  { expression: String.raw`+T_{steady}`, annotation: ["warm 상태 transfer·kernel·sync 시간","30ms를 더하면 run당 150ms","kernel 30ms만 보면 운영 latency 과소평가"] },
]} terms={[
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
      <header><p className="text-sm font-semibold text-primary">04 · Runtime 선택</p><h2 className="mt-2 text-2xl font-bold">같은 Program API라도 검증은 backend마다 따로 한다</h2></header>
      <p>ec-gpu는 <code>cuda</code>와 <code>opencl</code> feature를 지원하고, 둘 다 활성화되면 runtime framework selection을 제공합니다. 그러나 CUDA fatbin과 OpenCL runtime source compile은 artifact lifecycle이 다르며, integer overflow·shift·address-space·work-group semantics가 source 언어와 compiler에서 같다는 보장도 없습니다.</p>
      <p>Parity test는 CPU, CUDA, OpenCL에 같은 field와 point 입력을 넣습니다. 출력은 canonical form으로 되돌린 뒤 비교합니다.</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Field: 0, p−1, 긴 carry, canonical 범위 밖의 입력</li>
        <li>Point: 무한원점, doubling, 같은 점과 반대점</li>
        <li>연산: FFT 왕복, MSM의 0 scalar와 반복 point</li>
        <li>실패: 지원하지 않는 device, compile 오류, 메모리 부족</li>
      </ul>
      <p>Block과 work-group 크기가 달라도 값과 실패 종류는 같아야 합니다. 한 backend만 성공하거나 값을 조용히 잘라 내면 release하지 않습니다.</p>
      <div id="paper-ec-gpu-program-dispatch"><CitationBlock type="code" citeKey={4} source="ec-gpu program dispatch · commit 16d38ef" href={`${ECGPU}/ec-gpu-gen/src/program.rs`}><p><strong>문제:</strong> Feature-supported backend를 고르고 embedded artifact로 device program을 만들어야 합니다.</p><p><strong>핵심 기여:</strong> Pinned <code>program!</code> path의 environment/device selection과 CUDA load·OpenCL compile branches를 보여 줍니다.</p><p><strong>중요 가정:</strong> Embedded artifacts, enabled features와 available device/backend가 일치합니다.</p><p><strong>근거 범위:</strong> 링크 revision의 runtime dispatch behavior입니다.</p><p><strong>일반화 금지:</strong> CUDA/OpenCL numerical parity, driver quality나 같은 성능을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-opencl-api"><CitationBlock type="code" citeKey={5} source="Khronos OpenCL 3.0 Unified Specification" href={OPENCL}><p><strong>문제:</strong> OpenCL program build, kernel, memory와 command-queue semantics가 필요합니다.</p><p><strong>핵심 기여:</strong> OpenCL 3.0 API contract와 feature query boundary를 정의합니다.</p><p><strong>중요 가정:</strong> 실제 platform이 광고한 version과 optional features를 runtime에 조회합니다.</p><p><strong>근거 범위:</strong> OpenCL API와 execution semantics입니다.</p><p><strong>일반화 금지:</strong> CUDA와 bit-identical code generation이나 같은 성능을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-bellperson-ec-gpu-build"><CitationBlock type="code" citeKey={6} source="bellperson build integration · commit 728306c" href={`${BELLPERSON}/build.rs`}><p><strong>문제:</strong> Consumer prover가 Scalar FFT와 G1/G2 multiexp sources를 build에 포함해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned build script의 실제 SourceBuilder integration을 보여 줍니다.</p><p><strong>중요 가정:</strong> Commit 728306c, selected Cargo features와 matching ec-gpu dependency를 고정합니다.</p><p><strong>근거 범위:</strong> Bellperson의 build-time capability registration입니다.</p><p><strong>일반화 금지:</strong> Prover 시간 비율, 고정 speedup이나 현재 production deployment를 주장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">05 · Release gate</p><h2 className="mt-2 text-2xl font-bold">값 변경부터 proof 검증과 rollback까지 한 묶음으로 확인한다</h2></header>
      <p>새 field나 compiler flag를 넣으면 먼저 생성된 상수와 source digest를 검토합니다. CPU 기준 벡터를 통과한 다음, 지원 GPU마다 clean build와 cache-hit build를 나눠 확인합니다.</p>
      <p>고정 proof workload에서는 build, cold startup, warm kernel을 따로 잽니다. H2D/D2H, synchronization, peak memory, end-to-end median과 p95도 기록합니다.</p>
      <p>Release artifact에는 crate/source SHA, compiler·driver, target architecture를 붙입니다. 생성 source/fatbin digest와 proof verification 영수증도 포함합니다.</p>
      <p>지원하지 않는 device, compiler 오류, OOM, 동시 실행 충돌에는 구분 가능한 오류를 반환합니다. 승인된 CPU fallback과 이전 artifact key로 되돌리는 경로도 둡니다. 코드 생성 성공이 아니라 독립 verifier 성공이 마지막 관문입니다.</p>
      <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">역검사:</strong> Reader는 SourceBuilder→artifact→program 흐름을 설명하고, artifact key와 amortized 150ms 예를 계산하며, CUDA/OpenCL parity fixture와 provenance·fallback·rollback release gate를 설계할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

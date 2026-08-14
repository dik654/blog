import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { IcicleRuntimeViz } from "./IcicleRuntimeViz";

const SHA = "6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2";
const RUNTIME = `https://github.com/ingonyama-zk/icicle/blob/${SHA}/icicle/src/runtime.cpp`;
const MEMORY = `https://github.com/ingonyama-zk/icicle/blob/${SHA}/wrappers/rust/icicle-runtime/src/memory.rs`;
const PRIMITIVES = `https://github.com/ingonyama-zk/icicle/blob/${SHA}/docs/docs/icicle/primitives/overview.md`;

export default function ModernIcicleArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">MSM·NTT·Poseidon을 같은 runtime 경계로 호출하기</p><h2 className="text-3xl font-bold tracking-tight">ICICLE은 수학을 대체하는 마법 상자가 아니라 device·memory·primitive backend를 연결하는 accelerator runtime이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정 proof workload에서 witness와 field/hash outputs가 만들어지면 <a className="text-primary hover:underline" href="/gpu/msm-gpu-impl">MSM</a>, <a className="text-primary hover:underline" href="/gpu/ntt-gpu-impl">NTT</a>, <a className="text-primary hover:underline" href="/gpu/poseidon-gpu">Poseidon</a> jobs가 이어집니다. 각 알고리즘의 수학은 연결 글이 소유하며, 여기서는 ICICLE v3.9.0 snapshot에서 호출이 backend로 dispatch되고 memory·stream·config가 보존되는 경계만 다룹니다.</p>
      <p>공통 API가 있어도 curve/field, input representation, device pointer, stream 완료 시점은 자동으로 안전해지지 않습니다. 특히 unsupported backend를 조용히 CPU로 바꾸면 latency와 결과 provenance가 달라지므로 명시적 오류 또는 caller가 기록한 fallback으로 처리합니다.</p>
      <IcicleRuntimeViz />
      <ContentBoundary article="icicle-framework" />
    </section>

    <section id="backend-dispatch" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Backend dispatch</p><h2 className="mt-2 text-2xl font-bold">Active device와 primitive identity를 registry key로 묶고 exact implementation을 선택한다</h2></header>
      <p>Pinned runtime은 thread-local active device를 관리하며 dynamically loaded backend가 제공하는 device API를 통해 allocate/copy/sync를 호출합니다. Primitive registry는 별도 field·curve registration과 함께 보아야 하며, “CUDA가 설치되어 있다”와 “이 field의 이 primitive 구현이 등록되어 있다”는 다른 조건입니다.</p>
      <ExplainedFormula question="한 ICICLE 호출이 어느 구현으로 가야 하는지 어떻게 표현할까?" idea={<>Device type, primitive, field/curve와 implementation revision을 하나의 lookup identity로 고정합니다.</>} formula={String.raw`I=\mathcal{R}[d,\,p,\,f,\,r]`} terms={[
        {symbol:"I",name:"Implementation",description:"호출할 concrete backend function 또는 명시적 unsupported 결과입니다."},
        {symbol:"\\mathcal{R}",name:"Registry",description:"Backend registration으로 채워진 runtime mapping입니다."},
        {symbol:"d",name:"Device type",description:"CPU, CUDA 또는 설치된 custom accelerator type입니다."},
        {symbol:"p",name:"Primitive",description:"MSM, NTT, Poseidon 등 요청한 operation입니다."},
        {symbol:"f",name:"Field or curve",description:"Scalar field 또는 elliptic-curve implementation identity입니다."},
        {symbol:"r",name:"Revision",description:"ICICLE core/backend binary와 config schema revision입니다."},
      ]} assumptions={["Backend library가 성공적으로 load·register됐고 active device id가 유효합니다.","Missing key는 silent fallback이 아니라 typed error이며 fallback은 caller가 새 receipt로 선택합니다."]} interpretation="CUDA+NTT+BN254가 등록돼도 CUDA+MSM+BLS12-381은 별도 key입니다. 하나의 성공을 모든 primitive 지원으로 일반화할 수 없습니다." />
      <div id="paper-icicle-runtime"><CitationBlock type="code" citeKey={1} source="ICICLE v3.9.0 runtime.cpp · commit 6b451e6" href={RUNTIME}><p><strong>문제:</strong> Process가 active accelerator를 고르고 backend별 memory·stream operations를 같은 runtime API로 호출해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 active/default device, device API, allocation tracking과 dynamic backend loading 경계를 구현합니다.</p><p><strong>중요 가정:</strong> Core와 backend가 commit 6b451e6의 ABI·installation layout과 호환됩니다.</p><p><strong>근거 범위:</strong> 해당 revision의 runtime/device dispatch implementation입니다.</p><p><strong>일반화 금지:</strong> 모든 primitive 지원·automatic fallback·backend numerical parity·고정 speedup을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="memory-stream" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Memory and stream</p><h2 className="mt-2 text-2xl font-bold">Pointer의 device owner와 asynchronous completion이 끝날 때까지 buffer lifetime을 유지한다</h2></header>
      <p>Rust wrapper의 HostSlice·DeviceSlice는 위치를 구분하고 copy/copy_async 경로를 제공합니다. Async 함수가 반환됐다는 사실은 GPU가 buffer 사용을 끝냈다는 뜻이 아닙니다. Event 또는 stream synchronization이 완료되기 전에 input을 덮거나 output을 읽거나 allocation을 해제하면 race가 생깁니다.</p>
      <ExplainedFormula question="Async buffer를 언제 재사용할 수 있을까?" idea={<>마지막 write와 모든 consumers가 같은 stream order 또는 event dependency로 완료된 뒤에만 재사용합니다.</>} formula={String.raw`t_{reuse}(b)\ge\max_{o\in C(b)}t_{done}(o)`} terms={[
        {symbol:"t_{reuse}(b)",name:"Reuse time",description:"Buffer b를 overwrite하거나 free할 수 있는 가장 이른 시점입니다."},
        {symbol:"b",name:"Buffer",description:"Host 또는 특정 device가 소유한 input/output allocation입니다."},
        {symbol:"C(b)",name:"Consumers",description:"Buffer b를 읽거나 쓰도록 제출된 모든 async operation 집합입니다."},
        {symbol:"o",name:"Operation",description:"Copy, kernel 또는 backend primitive call 하나입니다."},
        {symbol:"t_{done}(o)",name:"Completion time",description:"Event/query/synchronize가 operation 완료를 관측한 시점입니다."},
        {symbol:"\\max",name:"Latest completion",description:"모든 consumer 가운데 가장 늦게 끝나는 시점을 택합니다."},
      ]} assumptions={["Streams 간 dependency는 explicit event/wait로 연결하고 host return time을 completion으로 보지 않습니다.","Pointer가 active device와 일치하고 slice length·alignment가 primitive contract를 만족합니다."]} interpretation="copy 2ms, kernel 5ms, D2H 1ms가 같은 dependency chain이면 submit 직후가 아니라 마지막 D2H 완료 뒤에 output buffer를 재사용합니다." />
      <div id="paper-icicle-memory"><CitationBlock type="code" citeKey={2} source="ICICLE v3.9.0 Rust memory.rs · commit 6b451e6" href={MEMORY}><p><strong>문제:</strong> Rust에서 host/device slices를 구분하고 synchronous/asynchronous copies를 runtime ABI로 전달해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned wrapper는 HostOrDeviceSlice, device allocation과 copy/copy_async ownership surface를 제공합니다.</p><p><strong>중요 가정:</strong> Active device, stream handle, lengths와 lifetimes를 caller가 올바르게 유지합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 Rust memory wrapper API입니다.</p><p><strong>일반화 금지:</strong> Async borrow의 compile-time completion 증명·cross-device pointer safety·zero-copy 성능을 자동 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="primitive-config" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Primitive config</p><h2 className="mt-2 text-2xl font-bold">같은 function 이름 아래 숨은 representation·ordering·residency options를 artifact로 남긴다</h2></header>
      <p>MSM은 point/scalar representation과 window plan, NTT는 domain·direction·ordering, Poseidon은 field·arity/width·parameter constants가 필요합니다. Config와 input artifact가 맞지 않으면 kernel이 성공해도 다른 수학 문제를 계산합니다. Wrapper version이 바뀌면 defaults도 artifact identity에 포함합니다.</p>
      <ExplainedFormula question="한 primitive job을 재현할 수 있는 identity는 무엇일까?" idea={<>Input digest와 primitive config, device/backend revision, output digest를 length-delimited receipt로 결속합니다.</>} formula={String.raw`J=H(p\|f\|H(x)\|H(c)\|d\|r\|H(y))`} terms={[
        {symbol:"J",name:"Job receipt",description:"재현·비교·rollback에 쓰는 primitive job identity입니다."},
        {symbol:"H",name:"Digest",description:"Canonical length-delimited encoding에 적용한 pinned hash입니다."},
        {symbol:"p",name:"Primitive",description:"MSM, NTT 또는 Poseidon operation 이름입니다."},
        {symbol:"f",name:"Field/curve",description:"입출력이 속한 exact algebraic profile입니다."},
        {symbol:"x,y",name:"Input/output",description:"Canonicalized input과 검증된 output buffers입니다."},
        {symbol:"c",name:"Config",description:"Direction, ordering, residency, batch와 algorithm options입니다."},
        {symbol:"d",name:"Device",description:"Device type/id와 relevant hardware identity입니다."},
        {symbol:"r",name:"Revision",description:"Core, backend, wrapper, driver와 schema revisions입니다."},
      ]} assumptions={["H inputs는 type·length가 명확한 canonical encoding이며 output은 reference parity 뒤 digest합니다.","Receipt는 cryptographic proof verification이나 primitive correctness를 대신하지 않습니다."]} interpretation="같은 NTT bytes라도 inverse flag나 domain digest가 바뀌면 J가 달라집니다. Cache key를 input bytes만으로 만들면 안 됩니다." />
      <div id="paper-icicle-primitives"><CitationBlock type="code" citeKey={3} source="ICICLE v3.9.0 primitive documentation · commit 6b451e6" href={PRIMITIVES}><p><strong>문제:</strong> 여러 ZK primitives와 hardware backends를 일관된 API·configuration surface로 제공해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned documentation/source tree는 MSM·NTT·hash 등 primitive entry와 backend-oriented architecture를 정리합니다.</p><p><strong>중요 가정:</strong> v3.9.0에 실제로 포함된 primitive/field/backend 조합과 해당 config를 확인합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 public surface와 documented capability입니다.</p><p><strong>일반화 금지:</strong> 모든 조합 지원, representation 자동 변환, protocol-level soundness를 뜻하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Backend별 parity와 failure semantics를 먼저 맞춘 뒤 verified jobs/s와 end-to-end를 비교한다</h2></header>
      <p>Zero/one/random/boundary field values, unsupported field·size·device, wrong pointer owner, short buffer, missing backend, async early read, OOM과 injected kernel error를 포함합니다. CPU reference와 normalized output을 비교하고 최종 proof verifier를 통과한 뒤 cold load, warm steady state, H2D/kernel/D2H/sync, peak memory, median/p95를 기록합니다.</p>
      <ExplainedFormula question="Backend 교체의 end-to-end speedup은 어떻게 계산할까?" idea={<>같은 verified workload에서 load·transfer·sync·fallback을 포함한 전체 시간을 reference와 candidate에 동일하게 적용합니다.</>} formula={String.raw`S_{e2e}=\frac{T_{ref}^{load}+T_{ref}^{run}+T_{ref}^{verify}}{T_{cand}^{load}+T_{H2D}+T_{kernel}+T_{D2H}+T_{sync}+T_{verify}}`} terms={[
        {symbol:"S_{e2e}",name:"End-to-end speedup",description:"같은 검증 경계를 쓴 reference/candidate 전체 시간 비율입니다."},
        {symbol:"T_{ref}^{load}",name:"Reference load",description:"Reference artifact/backend 준비 시간입니다."},
        {symbol:"T_{ref}^{run}",name:"Reference run",description:"Reference primitive 실행 시간입니다."},
        {symbol:"T_{H2D},T_{D2H}",name:"Transfer times",description:"Host-device 입력·출력 전송 시간입니다."},
        {symbol:"T_{kernel}",name:"Kernel time",description:"Pinned backend primitive의 event-measured 실행 시간입니다."},
        {symbol:"T_{sync}",name:"Synchronization",description:"Completion과 errors를 관측하는 시간입니다."},
        {symbol:"T_{verify}",name:"Verification",description:"같은 independent correctness gate 시간입니다."},
      ]} assumptions={["같은 input/profile/batch/concurrency와 cold/warm 상태를 비교합니다.","Invalid·retry·fallback jobs는 성공 수와 wall time에서 숨기지 않습니다."]} interpretation="Kernel 1ms라도 load2+H2D2+D2H1+sync1+verify2면 candidate는 9ms입니다. Reference가 12ms라면 speedup은 1.33배이지 12배가 아닙니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> framework 역할, registry key, unsupported 처리, pointer owner, async lifetime, config identity, 작은 시간 계산, parity matrix, measurement boundary, rollback receipt까지 이 글만으로 답할 수 있어야 합니다.</aside>
    </section>
  </article>;
}

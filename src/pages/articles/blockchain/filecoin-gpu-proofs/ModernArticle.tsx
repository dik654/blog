import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FilecoinProofFlowViz } from "./FilecoinProofFlowViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { bellpersonTree } from "./fileTrees";

const FIL = "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/seal.rs";
const PARAMS = "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/fil-proofs-param/parameters.json";
const BELL = "https://github.com/filecoin-project/bellperson/blob/728306c8ee52f53dbd55ea02557affcdfb546ae7/src/groth16/prover/native.rs";

export default function ModernFilecoinGpuProofsArticle() {
  const sidebar = useCodeSidebar();
  return <>
  <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Sector input에서 independently verified proof artifact까지</p><h2 className="text-3xl font-bold tracking-tight">Filecoin proof GPU 가속은 커널 목록이 아니라 phase artifact와 cache identity가 이어지는 전체 job이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정 workload는 sector data·ticket·prover identity에서 replica와 cache를 만들고, vanilla proof와 Groth16 proof artifact를 거쳐 verification receipt로 끝납니다. <a className="text-primary hover:underline" href="/gpu/gpu-proof-pipeline">일반 GPU proof DAG</a>, <a className="text-primary hover:underline" href="/gpu/msm-ntt">MSM·NTT</a>, field/hash 정본은 연결 글을 재사용합니다. 이 글은 rust-fil-proofs snapshot의 Filecoin phase boundary와 bellperson accelerator integration만 소유합니다.</p>
      <p>PC1·PC2·C1·C2라는 이름은 “GPU kernel 네 개”가 아닙니다. Disk-backed tree/cache, public commitments, vanilla proof, circuit inputs와 SNARK proof가 서로 다른 단계에서 만들어집니다. GPU는 내부 일부 연산을 가속할 수 있지만, 잘못된 cache를 올바른 proof로 바꾸지는 못합니다.</p>
      <FilecoinProofFlowViz />
      <ContentBoundary article="filecoin-gpu-proofs" />
    </section>

    <section id="phase-chain" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Phase artifact chain</p><h2 className="mt-2 text-2xl font-bold">각 phase가 읽는 cache·commitment와 쓰는 output을 같은 sector generation으로 연결한다</h2></header>
      <p>Pinned rust-fil-proofs API의 seal_pre_commit_phase1은 sector/cache paths와 prover·sector·ticket·piece inputs를 받고 replica/tree artifacts를 준비합니다. 후속 phases는 그 outputs와 commitments를 소비합니다. Stage 이름만 같은 다른 sector나 재시도 generation의 cache를 섞으면 안 됩니다.</p>
      <ExplainedFormula question="다음 Filecoin phase가 실행 가능하다는 조건은 무엇일까?" idea={<>필요한 predecessor artifacts가 모두 검증됐고 job generation·parameter identity가 현재 요청과 같아야 합니다.</>} formula={String.raw`ready(v)\iff\bigwedge_{u\in pred(v)}\left(done(u)\land g_u=g_v\land A_u\in inputs(v)\right)`}
      annotatedFormula={String.raw`\underbrace{ready(v)}_{\text{Stage readiness 계산}}\iff\bigwedge_{u\in \underbrace{pred(v)}_{\text{Predecessors 계산}}}\left(done(u)\land g_u=g_v\land A_u\in \underbrace{inputs(v)}_{\text{Declared inputs 계산}}\right)`}
      operations={[
        { expression: String.raw`inputs(v)`, annotation: ["Declared inputs이(가) 식의 결과에 기여하는","방식을 계산합니다.","필요한 predecessor artifacts가 모두 검증됐고","job generation·parameter identity가"] },
        { expression: String.raw`ready(v)`, annotation: ["Stage readiness이(가) 식의 결과에 기여하는","방식을 계산합니다.","필요한 predecessor artifacts가 모두 검증됐고","job generation·parameter identity가"] },
        { expression: String.raw`pred(v)`, annotation: ["Predecessors이(가) 식의 결과에 기여하는 방식을","계산합니다.","필요한 predecessor artifacts가 모두 검증됐고","job generation·parameter identity가"] },
      ]} terms={[
        {symbol:"ready(v)",name:"Stage readiness",description:"Phase v를 submit해도 되는지 나타내는 조건입니다."},
        {symbol:"v",name:"Consumer phase",description:"PC2, C1, C2 또는 verification 단계입니다."},
        {symbol:"u",name:"Producer phase",description:"v가 필요로 하는 artifact를 만든 선행 단계입니다."},
        {symbol:"pred(v)",name:"Predecessors",description:"Consumer가 요구하는 producer phase 집합입니다."},
        {symbol:"done(u)",name:"Validated completion",description:"Producer가 성공했고 output size/digest/schema 검사가 끝났다는 뜻입니다."},
        {symbol:"g_u,g_v",name:"Generation IDs",description:"Producer와 consumer가 같은 sector job/retry 세대인지 표시합니다."},
        {symbol:"A_u",name:"Producer artifact",description:"Cache, commitment, vanilla proof 또는 circuit inputs입니다."},
        {symbol:"inputs(v)",name:"Declared inputs",description:"Consumer manifest가 허용한 exact artifact identities입니다."},
      ]} assumptions={["Phase graph와 required artifacts는 pinned API/proof profile에서 가져오고 이름만으로 dependency를 추측하지 않습니다.","done은 process exit가 아니라 artifact validation 완료를 뜻합니다."]} interpretation="PC1 process가 끝났어도 tree cache digest가 다르거나 이전 retry generation이면 PC2는 ready가 아닙니다." />
      <div id="paper-fil-seal-api"><CitationBlock type="code" citeKey={1} source="rust-fil-proofs seal API · commit d451d23" href={FIL}><p><strong>문제:</strong> Sector sealing을 pre-commit·commit phases로 나누고 disk/cache artifacts와 public commitments를 일관되게 전달해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 seal phase APIs, inputs/outputs, cache checks와 bellperson Groth16 integration을 구현합니다.</p><p><strong>중요 가정:</strong> Commit d451d23의 PoRep config, sector size, API feature와 parameter files를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 Filecoin proof orchestration implementation입니다.</p><p><strong>일반화 금지:</strong> 현재 network policy·모든 PoSt/update path·고정 GPU 비율이나 phase 시간을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="parameter-binding" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Parameter and cache binding</p><h2 className="mt-2 text-2xl font-bold">Proof type·sector size·API version·parameter/cache digests를 job identity에 봉인한다</h2></header>
      <p>같은 filename이나 “32GiB용” 같은 label만으로 artifact를 재사용하지 않습니다. Proof config, sector/pieces, ticket/seed, prover/sector IDs, parameter manifest와 cache outputs의 canonical digests를 기록합니다. Network 규칙과 library snapshot은 별도 version fields로 둡니다.</p>
      <ExplainedFormula question="한 sealing job의 artifact identity를 어떻게 만들까?" idea={<>Statement를 정하는 inputs, proof profile과 단계별 cache digests를 하나의 length-delimited manifest hash에 결속합니다.</>} formula={String.raw`G=H(q\|s\|a\|H(P)\|H(I)\|H(K)\|r)`}
      annotatedFormula={String.raw`G=\underbrace{H(q\|s\|a\|H(P)\|H(I)\|H(K)\|r)}_{\text{Job generation 계산}}`}
      operations={[
        { expression: String.raw`H(q\|s\|a\|H(P)\|H(I)\|H(K)\|r)`, annotation: ["Job generation이(가) 식의 결과에 기여하는 방식을","계산합니다.","Statement를 정하는 inputs, proof","profile과 단계별 cache digests를 하나의"] },
      ]} terms={[
        {symbol:"G",name:"Job generation",description:"모든 phase outputs에 붙는 immutable job identity입니다."},
        {symbol:"H",name:"Digest",description:"Canonical typed encoding에 적용한 pinned hash입니다."},
        {symbol:"q",name:"Proof type",description:"PoRep/PoSt와 concrete variant identity입니다."},
        {symbol:"s",name:"Sector size/profile",description:"Sector size와 partition/feature profile입니다."},
        {symbol:"a",name:"API version",description:"Proof API semantics와 enabled features revision입니다."},
        {symbol:"P",name:"Parameter manifest",description:"Verifying/proving parameters와 metadata bytes입니다."},
        {symbol:"I",name:"Public/private inputs",description:"Piece commitments, ticket/seed, prover/sector identity 등의 exact inputs입니다."},
        {symbol:"K",name:"Cache manifest",description:"Phase별 files의 path-independent schema·size·digest 목록입니다."},
        {symbol:"r",name:"Implementation revision",description:"rust-fil-proofs, bellperson/backend와 config schema revisions입니다."},
      ]} assumptions={["Secrets는 digest/logging policy를 따르고 raw private inputs를 receipt에 노출하지 않습니다.","H inputs는 type·length가 명확하며 manifest verification 뒤 cache를 엽니다."]} interpretation="Sector bytes가 같아도 ticket이나 parameter manifest가 바뀌면 G가 달라집니다. Old cache directory 이름만 같다고 hit로 처리하지 않습니다." />
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="generate_random_parameters()" onClick={() => sidebar.open("bp-generator", codeRefs["bp-generator"])} />
      </div>
      <div id="paper-fil-parameters"><CitationBlock type="code" citeKey={2} source="rust-fil-proofs parameter manifest · commit d451d23" href={PARAMS}><p><strong>문제:</strong> 여러 sector/proof configurations의 parameter artifacts를 identifier·digest·size와 연결해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned manifest는 concrete parameter files의 cache identifiers와 integrity metadata를 제공합니다.</p><p><strong>중요 가정:</strong> 같은 repository commit, release process와 proof configuration을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 snapshot의 parameter artifact inventory입니다.</p><p><strong>일반화 금지:</strong> Manifest presence가 trusted setup ceremony·network activation·local file correctness를 단독으로 증명하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="accelerator-split" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Accelerator work split</p><h2 className="mt-2 text-2xl font-bold">Bellperson의 FFT·MSM 후보를 가속하되 CPU preparation·locking·fallback과 verifier를 전체 경계에 남긴다</h2></header>
      <p>Pinned bellperson prover는 GPU multiexponentiation과 FFT 경로를 CPU work와 함께 orchestration하고, 환경·device failure에 따른 fallback 경계를 가집니다. 따라서 “Filecoin proof가 GPU에서 실행된다”보다 어느 stage의 어떤 buffers가 accelerator에 갔는지 기록해야 합니다. GPU kernel timing은 C2 proof artifact latency와 같지 않습니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="CpuGpuMultiexpKernel" onClick={() => sidebar.open("bp-gpu-multiexp", codeRefs["bp-gpu-multiexp"])} />
        <CodeViewButton label="create_proof_batch_priority_inner" onClick={() => sidebar.open("bp-groth16-prover", codeRefs["bp-groth16-prover"])} />
      </div>
      <ExplainedFormula question="일부만 가속한 Filecoin proof의 최대 speedup을 어떻게 제한할까?" idea={<>가속하지 못한 전체 시간 비율은 GPU kernel을 아무리 빠르게 해도 남습니다.</>} formula={String.raw`S\le\frac{1}{(1-f)+f/s}`}
      annotatedFormula={String.raw`S\le\underbrace{\frac{1}{(1-f)+f/s}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{1}{(1-f)+f/s}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","가속하지 못한 전체 시간 비율은 GPU kernel을 아무리","빠르게 해도 남습니다."] },
      ]} terms={[
        {symbol:"S",name:"Overall speedup",description:"같은 verified Filecoin job의 reference/candidate end-to-end 시간 비율입니다."},
        {symbol:"f",name:"Accelerated fraction",description:"Reference 시간 중 실제로 GPU 후보가 대체하는 비율입니다."},
        {symbol:"s",name:"Stage speedup",description:"그 후보 stage의 같은-boundary CPU/GPU 시간 비율입니다."},
        {symbol:"1-f",name:"Serial/non-accelerated fraction",description:"Cache I/O, circuit synthesis, orchestration, verification 등 남는 비율입니다."},
      ]} assumptions={["f는 추측한 연산량이 아니라 같은 workload의 measured reference wall-time 비율입니다.","GPU 쪽 transfer·sync·fallback overhead는 stage 또는 non-accelerated 시간에 포함합니다."]} interpretation="Reference의 40%만 4배 빨라지면 전체 상한은 1/(0.6+0.1)=1.43배입니다. 이 숫자는 설명용이며 Filecoin 고정 비율이 아닙니다." />
      <div id="paper-bellperson-accelerator"><CitationBlock type="code" citeKey={3} source="bellperson Groth16 prover · commit 728306c" href={BELL}><p><strong>문제:</strong> Groth16 prover의 FFT·multiexponentiation work를 CPU/GPU resources와 오류 경계 안에서 조정해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 prover orchestration, GPU priority/locking·fallback과 multiexp/FFT integration을 보여줍니다.</p><p><strong>중요 가정:</strong> Commit 728306c, enabled GPU features, supported curve/device와 caller inputs를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 bellperson accelerator integration입니다.</p><p><strong>일반화 금지:</strong> Filecoin 전체 phase의 고정 speedup·모든 device parity·현재 mainnet dependency를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Deadline release gate</p><h2 className="mt-2 text-2xl font-bold">독립 verification과 deadline slack을 함께 통과한 artifact만 배포하고 실패 generation은 격리한다</h2></header>
      <p>Wrong ticket/seed/prover/sector, piece/CommD mismatch, parameter digest mismatch, missing/truncated/stale cache, phase reorder, GPU OOM·timeout·wrong result, crash와 retry를 포함합니다. CPU/reference commitments와 final proof verifier parity를 먼저 통과한 뒤 cold/warm cache, disk I/O, queue, GPU stages, p50/p95, peak host/VRAM과 retry rate를 기록합니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="verify_proof()" onClick={() => sidebar.open("bp-verifier", codeRefs["bp-verifier"])} />
        <CodeViewButton label="Proof<E> struct" onClick={() => sidebar.open("bp-proof", codeRefs["bp-proof"])} />
      </div>
      <ExplainedFormula question="한 job이 운영 deadline 안에 retry 여유까지 갖는지 어떻게 판단할까?" idea={<>Deadline에서 queue·p95 execution·검증과 최소 retry/운영 reserve를 모두 빼고 남은 slack을 봅니다.</>} formula={String.raw`\Delta=D-(T_{queue}+T_{p95}+T_{verify}+B_{retry}+B_{ops})`}
      annotatedFormula={String.raw`\Delta=\underbrace{D-(T_{queue}+T_{p95}+T_{verify}+B_{retry}+B_{ops})}_{\text{변화량 계산}}`}
      operations={[
        { expression: String.raw`D-(T_{queue}+T_{p95}+T_{verify}+B_{retry}+B_{ops})`, annotation: ["Verification time이(가) 식의 결과에 기여하는","방식을 계산합니다.","Deadline에서 queue·p95 execution·검증과","최소 retry/운영 reserve를 모두 빼고 남은"] },
      ]} terms={[
        {symbol:"\\Delta",name:"Deadline slack",description:"모든 예산을 뺀 뒤 남는 시간이며 양수여야 합니다."},
        {symbol:"D",name:"Deadline budget",description:"해당 operation/profile이 허용한 end-to-end 시간입니다."},
        {symbol:"T_{queue}",name:"Queue time",description:"Resource를 기다린 p95 또는 운영상 선택한 percentile입니다."},
        {symbol:"T_{p95}",name:"Execution p95",description:"I/O, phase orchestration와 accelerator를 포함한 job 실행 시간입니다."},
        {symbol:"T_{verify}",name:"Verification time",description:"Independent verifier와 receipt persistence 시간입니다."},
        {symbol:"B_{retry}",name:"Retry reserve",description:"한 번 이상의 controlled fallback/retry를 위한 시간 예산입니다."},
        {symbol:"B_{ops}",name:"Operations reserve",description:"Jitter, draining, checkpoint와 rollback을 위한 운영 여유입니다."},
      ]} assumptions={["D와 phase set은 실제 network/operator profile에서 versioned config로 가져오며 이 글은 고정 deadline 숫자를 주장하지 않습니다.","Failed/invalid jobs와 queue saturation을 p95 sample에서 제거하지 않습니다."]} interpretation="D=100, queue10, execution60, verify5, retry15, ops5분이면 slack은 5분입니다. Candidate p95가 66분이면 slack이 -1분이므로 kernel 평균이 좋아도 release하지 않습니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> phase outputs, generation readiness, parameter/cache binding, accelerator 범위, Amdahl 계산, stale artifact 반례, verification, deadline slack, paired measurement, fallback·rollback까지 이 글만으로 답할 수 있어야 합니다.</aside>
    </section>
  </article>
  <CodeSidebar
    codeRefKey={sidebar.codeRefKey}
    codeRef={sidebar.codeRef}
    onClose={sidebar.close}
    onNavigate={sidebar.navigate}
    codeRefs={codeRefs}
    fileTrees={{ bellperson: bellpersonTree }}
    projectMetas={{
      bellperson: {
        id: "bellperson",
        label: "bellperson · Rust",
        badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
      },
    }}
  />
  </>;
}

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
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Sector input에서 검증된 proof bytes까지</p><h2 className="text-3xl font-bold tracking-tight">GPU는 sealing 단계를 대신하지 않고, 단계 안의 병렬 연산을 가속한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Filecoin sealing은 PC1→PC2→C1→C2로 artifact를 넘기는 작업입니다. GPU는 PC2의 tree 작업이나 C2의 FFT·MSM 같은 내부 연산을 빠르게 할 수 있지만, phase 사이의 cache와 commitment 계약은 그대로 남습니다.</p>
      <p>Sector 41의 retry generation 3을 예로 들겠습니다. PC1은 <code>labels·StoreConfig·CommD</code>를 만들고, PC2는 <code>CommR·CommD</code>를 냅니다. C1은 vanilla proof와 public identity를 묶고, C2는 Groth16 proof bytes를 만듭니다. 마지막에는 같은 public inputs로 다시 검증합니다.</p>
      <p>따라서 “GPU kernel이 빨랐다”만으로 job이 빨라졌다고 할 수 없습니다. 다른 retry의 cache를 섞지 않았는지, C2 밖의 I/O와 synthesis가 얼마나 남았는지, proof가 실제로 검증됐는지를 함께 봐야 합니다.</p>
      <p><a className="text-primary hover:underline" href="/cs/gpu/gpu-proof-pipeline">일반 GPU proof DAG</a>와 <a className="text-primary hover:underline" href="/cs/gpu/msm-ntt">MSM·NTT</a> 원리는 연결 글을 재사용합니다. 이 글은 고정 rust-fil-proofs의 Filecoin phase boundary와 Bellperson accelerator integration에 집중합니다.</p>
      <FilecoinProofFlowViz />
      <ContentBoundary article="filecoin-gpu-proofs" />
    </section>

    <section id="phase-chain" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Phase artifact chain</p><h2 className="mt-2 text-2xl font-bold">각 phase의 실제 output을 같은 sector 세대로 묶는다</h2></header>
      <p>고정 API의 <code>seal_pre_commit_phase1</code>은 PoRep config와 sector/cache paths를 받습니다. Prover ID, sector ID, ticket, piece 정보도 입력입니다.</p>
      <p>출력 <code>SealPreCommitPhase1Output</code>에는 labels, StoreConfig, CommD가 들어갑니다. PC2는 이 struct와 replica/cache paths를 받아 CommR·CommD를 만듭니다. 이름만 같은 다른 sector나 이전 retry의 cache를 섞으면 안 됩니다.</p>
      <ExplainedFormula question="다음 Filecoin phase가 실행 가능하다는 조건은 무엇일까?" idea={<>필요한 predecessor artifacts가 모두 검증됐고 job generation·parameter identity가 현재 요청과 같아야 합니다.</>} formula={String.raw`ready(v)\iff\bigwedge_{u\in pred(v)}\left(done(u)\land g_u=g_v\land A_u\in inputs(v)\right)`}
      annotatedFormula={String.raw`\underbrace{ready(v)}_{\text{phase 제출 가능}}\iff\bigwedge_{u\in \underbrace{pred(v)}_{\text{필요한 선행 phase}}}\left(\underbrace{done(u)}_{\text{artifact 검증 완료}}\land \underbrace{g_u=g_v}_{\text{같은 retry 세대}}\land \underbrace{A_u\in inputs(v)}_{\text{선언된 input}}\right)`}
      operations={[
          { expression: String.raw`\bigwedge_{u\in pred(v)}`, annotation: ["PC2·C1·C2가 요구하는 선행 phase 전부가","아래 세 조건을 모두 만족해야 ready"] },
          { expression: String.raw`done(u)`, annotation: ["process exit가 아니라 output size·","digest·schema 검사가 끝났다는 뜻","PC1이 끝나도 cache digest 다르면 false"] },
          { expression: String.raw`g_u=g_v`, annotation: ["producer와 consumer가 같은 job 세대","이전 retry generation 산출물은 거부"] },
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
      <header><p className="text-sm font-semibold text-primary">02 · Parameter와 cache binding</p><h2 className="mt-2 text-2xl font-bold">파일 이름이 아니라 입력과 digest로 job identity를 만든다</h2></header>
      <p>같은 filename이나 “32GiB용”이라는 label만으로 artifact를 재사용하지 않습니다. Proof config, sector와 pieces, ticket와 seed, prover/sector ID를 기록합니다.</p>
      <p>Parameter manifest와 cache output의 canonical digest도 묶습니다. Network 규칙과 library snapshot은 별도 version field로 둡니다. 아래 <code>G</code>는 고정 소스의 struct가 아니라, 이런 값을 안전하게 묶기 위한 운영 manifest 설계입니다.</p>
      <ExplainedFormula question="한 sealing job의 artifact identity를 어떻게 만들까?" idea={<>Statement를 정하는 inputs, proof profile과 단계별 cache digests를 하나의 length-delimited manifest hash에 결속합니다.</>} formula={String.raw`G=H(q\|s\|a\|H(P)\|H(I)\|H(K)\|r)`}
      annotatedFormula={String.raw`\underbrace{G}_{\text{job identity}}=H(\underbrace{q\|s\|a}_{\text{proof·sector·API}}\|\underbrace{H(P)}_{\text{parameter}}\|\underbrace{H(I)}_{\text{exact inputs}}\|\underbrace{H(K)}_{\text{phase cache}}\|\underbrace{r}_{\text{구현 revision}})`}
      operations={[
          { expression: String.raw`H(q\|s\|a\|H(P)\|H(I)\|H(K)\|r)`, annotation: ["statement·profile·cache를","length-delimited manifest 하나로 결속","ticket·parameter만 바뀌어도 G가 바뀜"] },
          { expression: String.raw`H(K)`, annotation: ["phase별 파일의 schema·size·digest 목록","directory 이름이 같아도 hit로 안 봄"] },
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
      <header><p className="text-sm font-semibold text-primary">03 · Accelerator work split</p><h2 className="mt-2 text-2xl font-bold">GPU로 간 일과 CPU에 남은 일을 따로 잰다</h2></header>
      <p>고정 Bellperson prover는 GPU multiexponentiation과 FFT를 CPU 작업과 함께 조정합니다. GPU 우선순위와 lock, device 오류 뒤 fallback 경계도 있습니다.</p>
      <p>기록에는 “Filecoin proof가 GPU에서 실행됐다”가 아니라 어느 stage의 어떤 buffer가 accelerator로 갔는지를 남깁니다. GPU kernel 시간은 C2 proof artifact 전체 시간과 다릅니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="CpuGpuMultiexpKernel" onClick={() => sidebar.open("bp-gpu-multiexp", codeRefs["bp-gpu-multiexp"])} />
        <CodeViewButton label="create_proof_batch_priority_inner" onClick={() => sidebar.open("bp-groth16-prover", codeRefs["bp-groth16-prover"])} />
      </div>
      <ExplainedFormula question="일부만 가속한 Filecoin proof의 최대 speedup을 어떻게 제한할까?" idea={<>가속하지 못한 전체 시간 비율은 GPU kernel을 아무리 빠르게 해도 남습니다.</>} formula={String.raw`S\le\frac{1}{(1-f)+f/s}`}
      annotatedFormula={String.raw`\underbrace{S}_{\text{전체 speedup}}\le\frac{1}{\underbrace{(1-f)}_{\text{가속 못 한 비율}}+\underbrace{f/s}_{\text{가속 구간 남은 시간}}}`}
      operations={[
          { expression: String.raw`(1-f)`, annotation: ["cache I/O·synthesis·검증처럼","GPU가 아무리 빨라도 그대로 남는 몫","f=0.4면 0.6"] },
          { expression: String.raw`f/s`, annotation: ["가속한 40%가 4배 빨라져 0.1로 줄어듦"] },
          { expression: String.raw`\frac{1}{(1-f)+f/s}`, annotation: ["남은 시간 비율의 역수가 상한","1/(0.6+0.1)=1.43배(설명용 수치)"] },
        ]} terms={[
        {symbol:"S",name:"Overall speedup",description:"같은 verified Filecoin job의 reference/candidate end-to-end 시간 비율입니다."},
        {symbol:"f",name:"Accelerated fraction",description:"Reference 시간 중 실제로 GPU 후보가 대체하는 비율입니다."},
        {symbol:"s",name:"Stage speedup",description:"그 후보 stage의 같은-boundary CPU/GPU 시간 비율입니다."},
        {symbol:"1-f",name:"Serial/non-accelerated fraction",description:"Cache I/O, circuit synthesis, orchestration, verification 등 남는 비율입니다."},
      ]} assumptions={["f는 추측한 연산량이 아니라 같은 workload의 measured reference wall-time 비율입니다.","GPU 쪽 transfer·sync·fallback overhead는 stage 또는 non-accelerated 시간에 포함합니다."]} interpretation="Reference의 40%만 4배 빨라지면 전체 상한은 1/(0.6+0.1)=1.43배입니다. 이 숫자는 설명용이며 Filecoin 고정 비율이 아닙니다." />
      <div id="paper-bellperson-accelerator"><CitationBlock type="code" citeKey={3} source="bellperson Groth16 prover · commit 728306c" href={BELL}><p><strong>문제:</strong> Groth16 prover의 FFT·multiexponentiation work를 CPU/GPU resources와 오류 경계 안에서 조정해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 prover orchestration, GPU priority/locking·fallback과 multiexp/FFT integration을 보여줍니다.</p><p><strong>중요 가정:</strong> Commit 728306c, enabled GPU features, supported curve/device와 caller inputs를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 bellperson accelerator integration입니다.</p><p><strong>일반화 금지:</strong> Filecoin 전체 phase의 고정 speedup·모든 device parity·현재 mainnet dependency를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Deadline release gate</p><h2 className="mt-2 text-2xl font-bold">Proof 검증과 deadline 여유를 모두 통과해야 배포한다</h2></header>
      <p>고정 <code>seal_commit_phase2</code>도 proof를 반환하기 전에 <code>verify_seal</code>로 sanity check합니다. Release gate에서는 그 확인에 더해 별도 process나 reference 경로로 같은 public inputs를 다시 검증합니다.</p>
      <p>실패 fixture는 다음처럼 나눕니다.</p>
      <ul className="list-disc space-y-2 pl-6"><li>다른 ticket·seed·prover·sector 또는 piece/CommD mismatch</li><li>Parameter digest mismatch와 missing·truncated·stale cache</li><li>Phase 순서 뒤바뀜, GPU OOM·timeout·wrong result</li><li>Process crash, 같은 generation 재사용, 새 generation retry</li></ul>
      <p>정답을 통과한 다음 cold/warm cache, disk I/O, queue와 GPU stage를 잽니다. p50/p95, peak host memory·VRAM, retry rate도 남깁니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="verify_proof()" onClick={() => sidebar.open("bp-verifier", codeRefs["bp-verifier"])} />
        <CodeViewButton label="Proof<E> struct" onClick={() => sidebar.open("bp-proof", codeRefs["bp-proof"])} />
      </div>
      <ExplainedFormula question="한 job이 운영 deadline 안에 retry 여유까지 갖는지 어떻게 판단할까?" idea={<>Deadline에서 queue·p95 execution·검증과 최소 retry/운영 reserve를 모두 빼고 남은 slack을 봅니다.</>} formula={String.raw`\Delta=D-(T_{queue}+T_{p95}+T_{verify}+B_{retry}+B_{ops})`}
      annotatedFormula={String.raw`\underbrace{\Delta}_{\text{남는 slack}}=\underbrace{D}_{\text{deadline}}-(\underbrace{T_{queue}+T_{p95}+T_{verify}}_{\text{대기·실행·검증}}+\underbrace{B_{retry}+B_{ops}}_{\text{retry·운영 reserve}})`}
      operations={[
          { expression: String.raw`T_{queue}+T_{p95}+T_{verify}`, annotation: ["queue p95, I/O 포함 실행 p95, 검증","10+60+5=75분"] },
          { expression: String.raw`B_{retry}+B_{ops}`, annotation: ["한 번 이상 fallback할 시간과 jitter 여유","15+5=20분"] },
          { expression: String.raw`D-(T_{queue}+T_{p95}+T_{verify}+B_{retry}+B_{ops})`, annotation: ["100−95=5분 slack, 양수라 통과","p95가 66분이면 −1분이라 release 안 함"] },
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

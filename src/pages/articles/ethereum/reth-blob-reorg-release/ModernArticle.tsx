import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { BlobReorgReleaseViz } from "../reth-eip4844/viz/ModernEip4844Viz";
import { codeRefs } from "./codeRefs";
import { rethBlobReorgReleaseTree } from "./fileTree";

const RETH_SOURCE = "https://github.com/paradigmxyz/reth";
const RETH_PROJECT_META = {
  reth: { id: "reth", label: "Reth · Rust", badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700" },
};

export default function ModernBlobReorgRelease() {
  const sidebar = useCodeSidebar();
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Canonical chain이 바뀌어도 blob transaction을 다시 실행 가능하게 만들기</p><h2 className="text-3xl font-bold tracking-tight">Reorg는 transaction과 sidecar의 생명주기를 다시 결합합니다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>Reorg</strong>는 이전 canonical branch의 block이 빠지고 다른 branch가 canonical이 되는 사건입니다. Orphaned 일반 transaction은 body를 pool에 되돌릴 수 있지만, blob transaction은 대응 sidecar도 다시 확보해야 완전한 후보가 됩니다.</p>
      <TermBreakdown title="Reorg에서 따로 추적할 네 상태" items={[
        { term: "Orphaned transaction", description: "Old canonical block에서 빠져 다시 pool 후보가 될 type-3 transaction body입니다." },
        { term: "Sidecar receipt", description: "Local store에 같은 transaction의 검증된 blob artifact가 남아 있다는 기록입니다." },
        { term: "Fetch outcome", description: "Local miss 뒤 network에서 sidecar를 다시 얻었는지 또는 unavailable인지 나타냅니다." },
        { term: "Reinsert outcome", description: "새 head의 nonce·fee·fork·pool budget에서 다시 admission됐는지 기록합니다.", boundary: "Old block에서 유효했다는 사실이 새 head admission을 보장하지 않습니다." },
      ]} />
      <BlobReorgReleaseViz />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("canon-tracker", codeRefs["canon-tracker"])} />
        <span className="text-xs text-muted-foreground">BlobStoreCanonTracker — 블록별 blob TX 추적</span>
      </div>
      <ContentBoundary article="reth-blob-reorg-release" />
    </section>
    <section id="reinsert" className="space-y-6">
      <h2 className="text-2xl font-bold">Body, sidecar, receipt가 모두 있어야 fast reinsert가 열립니다</h2>
      <ExplainedFormula question="어떤 orphaned blob transaction을 network fetch 없이 바로 재주입할 수 있나요?" idea={<p>Old chain에서 빠진 body, local sidecar, 같은 generation의 verified receipt를 별도로 확인합니다. 세 조건을 모두 통과한 경우에만 fast path를 엽니다.</p>} formula={String.raw`I_{fast}=I_{orphan}\land I_{sidecar}\land I_{receipt}`} annotatedFormula={String.raw`\begin{aligned}I_{artifact}&=\underbrace{I_{sidecar}\land I_{receipt}}_{\text{local bytes와 검증 provenance를 함께 확인}}\\I_{fast}&=\underbrace{I_{orphan}\land I_{artifact}}_{\text{old-chain body와 reusable artifact를 결합}}\\I_{miss}&=\underbrace{1-I_{artifact}}_{\text{fast path 없으면 fetch·failure로 전환}}
\end{aligned}`} operations={[
        { expression: String.raw`I_{sidecar}\land I_{receipt}`, annotation: ["sidecar 존재와 receipt 일치를 AND해", "재사용 가능한 artifact를 판정"] },
        { expression: String.raw`I_{orphan}\land I_{artifact}`, annotation: ["orphaned body와 artifact를 결합해", "fast reinsert eligibility를 생성"] },
        { expression: String.raw`1-I_{artifact}`, annotation: ["artifact 판정을 뒤집어", "fetch/failure path를 선택"] },
      ]} terms={[
        { symbol: String.raw`I_{orphan}`, name: "Orphan indicator", description: "Transaction이 old canonical branch에서 빠졌으면 1입니다." },
        { symbol: String.raw`I_{sidecar}`, name: "Sidecar indicator", description: "Local store에 대응 bytes가 있으면 1입니다." },
        { symbol: String.raw`I_{receipt}`, name: "Receipt indicator", description: "Digest·fork·validator generation이 재사용 조건과 맞으면 1입니다." },
      ]} assumptions={["세 indicator는 같은 transaction hash와 reorg generation을 가리킵니다.", "Fast path 뒤에도 새 head-relative nonce·fee·pool admission을 다시 검사합니다."]} interpretation="Body만 있고 sidecar가 없으면 I_fast=0입니다. Versioned hash에서 blob을 복원하지 않고 fetch 성공 또는 unavailable failure를 명시합니다." />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("reinsert-sidecar-check", codeRefs["reinsert-sidecar-check"])} />
        <span className="text-xs text-muted-foreground">blob_store.contains() — I_sidecar의 실제 구현</span>
      </div>
    </section>
    <section id="release-gate" className="space-y-6">
      <h2 className="text-2xl font-bold">Release gate는 빠른 후보보다 같은 실패 결정을 먼저 요구합니다</h2>
      <p>새 store나 admission 최적화를 배포할 때 happy path throughput부터 보지 않습니다. 동일 transaction·sidecar·fork·reorg schedule에 wrong hash, bad proof, fee boundary, local corruption, cache miss, cleanup crash를 주입하고 baseline과 candidate의 결과를 비교합니다.</p>
      <TermBreakdown title="승인 전에 맞춰야 하는 결과" items={[
        { term: "Admission parity", description: "같은 입력이 같은 reason code로 accept 또는 reject됩니다." },
        { term: "Artifact parity", description: "Stored bytes, digest, generation과 cleanup 결과가 같습니다." },
        { term: "Restart parity", description: "각 crash point 뒤 같은 terminal state와 retry decision으로 수렴합니다." },
        { term: "Performance result", description: "위 parity를 통과한 뒤 p95 latency, memory, disk를 비교합니다.", boundary: "평균 처리량만 좋아진 candidate를 승인하지 않습니다." },
      ]} />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("header-blob-gas", codeRefs["header-blob-gas"])} />
        <span className="text-xs text-muted-foreground">validate_cancun_gas() — reorg 뒤에도 유지돼야 할 parity</span>
      </div>
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("header-4844-standalone", codeRefs["header-4844-standalone"])} />
        <span className="text-xs text-muted-foreground">validate_4844_header_standalone() — 네 가지 독립 불변식</span>
      </div>
    </section>
    <section id="paper-reth-blob-reorg" className="space-y-5"><h2 className="text-2xl font-bold">구현 근거</h2><CitationBlock type="code" citeKey={1} source="Reth repository · blob pool lifecycle" href={RETH_SOURCE}><p><strong>문제:</strong> Canonical reorg와 finalization 사이에서 blob transaction body와 sidecar retention을 일관되게 관리해야 합니다.</p><p><strong>핵심 기여:</strong> Reth node, pool, chain notification과 storage implementation을 end-to-end source로 제공합니다.</p><p><strong>중요 가정:</strong> 같은 release/SHA, ChainSpec, KZG backend와 storage schema를 고정합니다.</p><p><strong>근거 범위:</strong> 선택한 Reth snapshot의 local reinsert·cleanup behavior입니다.</p><p><strong>일반화 금지:</strong> EL pool retention을 CL availability·archive retention이나 network fetch SLA로 확대하지 않습니다.</p></CitationBlock></section>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ reth: rethBlobReorgReleaseTree }}
      projectMetas={RETH_PROJECT_META}
    />
  </article>;
}

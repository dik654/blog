import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { BlobAdmissionViz } from "../reth-eip4844/viz/ModernEip4844Viz";
import { codeRefs } from "./codeRefs";
import { rethBlobAdmissionTree } from "./fileTree";

const RETH_BLOB = "https://github.com/paradigmxyz/reth/tree/main/crates/transaction-pool";
const RETH_PROJECT_META = {
  reth: { id: "reth", label: "Reth · Rust", badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700" },
};

export default function ModernRethBlobAdmission() {
  const sidebar = useCodeSidebar();
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">큰 입력에 비싼 검사를 바로 실행하지 않기</p><h2 className="text-3xl font-bold tracking-tight">Admission은 “pool에 받아도 되는가”를 싼 질문부터 판정합니다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>Admission</strong>은 network에서 받은 blob transaction과 sidecar를 local pool의 후보로 받아들이는 판정입니다. Block inclusion이나 finality가 아니라, 다음 검사를 수행하고 보관할 자격을 정하는 경계입니다.</p>
      <TermBreakdown title="Admission이 분리하는 네 gate" items={[
        { term: "Bounded decode", description: "입력 전체를 할당하기 전에 길이와 개수 상한을 적용합니다.", boundary: "Malformed bytes에 KZG부터 실행하지 않습니다." },
        { term: "Shape gate", description: "Fork, blob size, list count와 versioned-hash binding을 확인합니다.", example: "hash 2개인데 commitment가 1개면 즉시 거부합니다." },
        { term: "State gate", description: "Sender nonce·balance와 execution fee·blob fee를 현재 head state에서 확인합니다.", boundary: "두 gas 단위를 더해 하나의 budget으로 만들지 않습니다." },
        { term: "Resource gate", description: "KZG 성공 뒤에도 memory, disk, per-account 정책이 pool 수용 여부를 정합니다.", boundary: "Cryptographically valid와 locally admitted는 다른 결과입니다." },
      ]} />
      <BlobAdmissionViz />
      <ContentBoundary article="reth-blob-admission" />
    </section>
    <section id="cheap-checks" className="space-y-6">
      <h2 className="text-2xl font-bold">Cheap checks는 공격자가 강제할 수 있는 실패 비용을 제한합니다</h2>
      <p>검사 순서는 단순한 최적화가 아닙니다. 10-byte header만 읽고 거부할 수 있는 입력에 pairing work와 큰 allocation을 수행하면, invalid traffic이 CPU와 memory를 독점할 수 있습니다.</p>
      <TermBreakdown title="싼 것부터 읽는 이유" items={[
        { term: "Size", description: "Blob 하나가 정확한 고정 크기인지 확인합니다.", example: "131,071-byte와 131,073-byte payload는 둘 다 거부합니다." },
        { term: "Count", description: "Transaction hashes와 blobs·commitments·proofs의 길이를 맞춥니다." },
        { term: "Binding", description: "각 commitment에서 계산한 versioned hash가 같은 index의 reference와 같은지 확인합니다." },
        { term: "Reason code", description: "Fork mismatch, bad shape, fee failure, bad proof, capacity failure를 구분해 반환합니다.", boundary: "모든 실패를 invalid transaction 하나로 뭉개지 않습니다." },
      ]} />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("tx-validate-stateless", codeRefs["tx-validate-stateless"])} />
        <span className="text-xs text-muted-foreground">validate_stateless() — fork·크기·개수 검사</span>
      </div>
    </section>
    <section id="state-kzg" className="space-y-6">
      <h2 className="text-2xl font-bold">모든 독립 gate가 참일 때만 admission이 열립니다</h2>
      <ExplainedFormula question="왜 shape가 맞는 것만으로 pool에 넣을 수 없나요?" idea={<p>Structure, current state, binding, KZG proof, resource budget은 서로 다른 failure를 막습니다. 하나라도 거짓이면 저장하지 않습니다.</p>} formula={String.raw`A=I_{shape}\land I_{state}\land I_{bind}\land I_{KZG}\land I_{budget}`} annotatedFormula={String.raw`\begin{aligned}I_{cheap}&=\underbrace{I_{shape}\land I_{bind}}_{\text{구조와 reference를 먼저 싼 비용으로 확인}}\\I_{valid}&=\underbrace{I_{state}\land I_{KZG}}_{\text{현재 head 조건과 blob proof를 확인}}\\A&=\underbrace{I_{cheap}\land I_{valid}\land I_{budget}}_{\text{모든 gate 통과 때만 pool admission}}
\end{aligned}`} operations={[
        { expression: String.raw`I_{shape}\land I_{bind}`, annotation: ["byte shape와 reference를 AND해", "비싼 검사 전 malformed input 차단"] },
        { expression: String.raw`I_{state}\land I_{KZG}`, annotation: ["head-relative validity와 proof를 AND해", "protocol-valid 후보만 남김"] },
        { expression: String.raw`I_{cheap}\land I_{valid}\land I_{budget}`, annotation: ["세 gate group을 모두 결합해", "local admission 결과 생성"] },
      ]} terms={[
        { symbol: "A", name: "Admission decision", description: "Local pool에 저장할 수 있으면 1입니다." },
        { symbol: String.raw`I_{state}`, name: "State gate", description: "Nonce·balance·두 fee 조건의 판정입니다." },
        { symbol: String.raw`I_{budget}`, name: "Resource gate", description: "Pool memory·disk·account quota 판정입니다." },
      ]} assumptions={["모든 indicator는 같은 transaction·sidecar와 head snapshot에서 계산합니다.", "Gate 순서가 reason code와 비용 budget에 기록됩니다."]} interpretation="Shape·state·KZG가 모두 맞아도 pool disk quota가 0이면 A=0입니다. 이는 proof failure가 아니라 capacity rejection입니다." />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("tx-validate-eip4844", codeRefs["tx-validate-eip4844"])} />
        <span className="text-xs text-muted-foreground">validate_eip4844() — None/Missing/Present 분기</span>
      </div>
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("blob-validate", codeRefs["blob-validate"])} />
        <span className="text-xs text-muted-foreground">validate_blob_sidecar() — binding·KZG proof 검증</span>
      </div>
    </section>
    <section id="paper-reth-blob-validation" className="space-y-5"><h2 className="text-2xl font-bold">구현 근거를 고정합니다</h2><CitationBlock type="code" citeKey={1} source="Reth transaction-pool source" href={RETH_BLOB}><p><strong>문제:</strong> Untrusted transaction을 값싼 검사부터 stateful·cryptographic 검사로 단계화해야 합니다.</p><p><strong>핵심 기여:</strong> Reth transaction-pool의 validator와 subpool boundary를 구현 근거로 사용합니다.</p><p><strong>중요 가정:</strong> 검사한 commit SHA, feature, ChainSpec과 KZG backend를 함께 고정합니다.</p><p><strong>근거 범위:</strong> 선택한 Reth source의 admission ordering과 typed outcome입니다.</p><p><strong>일반화 금지:</strong> Main branch의 현재 함수명·limit을 모든 release와 deployment의 고정값으로 일반화하지 않습니다.</p></CitationBlock></section>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ reth: rethBlobAdmissionTree }}
      projectMetas={RETH_PROJECT_META}
    />
  </article>;
}

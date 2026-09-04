import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { BlobBoundaryViz } from "./viz/ModernEip4844Viz";
import { modernCodeRefs } from "./modernCodeRefs";
import { modernRethEip4844Tree } from "./modernFileTree";

const EIP_4844 = "https://eips.ethereum.org/EIPS/eip-4844";
const RETH_PROJECT_META = {
  reth: { id: "reth", label: "Reth · Rust", badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700" },
};

export default function ModernRethEip4844() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">큰 data를 transaction에 직접 넣지 않는 이유</p>
          <h2 className="text-3xl font-bold tracking-tight">먼저 blob, commitment, transaction, sidecar를 한 줄씩 분리합니다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
            Rollup이 큰 data를 Ethereum에 게시하려고 합니다. 실행 노드가 그 bytes를 영원히 state로 보관하게 하지 않으면서도 block이 어떤 data를
            약속했는지는 검증해야 합니다. EIP-4844는 큰 bytes와 실행 reference를 서로 다른 artifact로 나누고 commitment로 다시 묶습니다.
          </p>
        <TermBreakdown title="제출을 이루는 네 artifact" description="각 줄은 하나의 역할만 소유합니다. 아직 네 용어를 한 문장으로 합치지 않습니다." items={[
          { term: "Blob", description: "4096개의 32-byte field-element slot으로 구성된 131,072-byte data 묶음입니다.", example: "Rollup batch bytes를 한 blob의 slot에 맞춰 encode합니다.", boundary: "EVM contract가 blob bytes를 직접 읽는 영구 storage가 아닙니다." },
          { term: "KZG commitment", description: "특정 blob을 나중에 같은 data인지 검증할 수 있게 약속하는 48-byte 값입니다.", example: "Blob B에서 commitment C를 계산합니다.", boundary: "압축 파일이 아니므로 C에서 B를 복원할 수 없습니다." },
          { term: "Type-3 transaction", description: "Sender, fee와 blob을 가리키는 versioned hash를 execution payload에 남기는 transaction입니다.", example: "Transaction은 h_v를 담지만 128 KiB B는 담지 않습니다.", boundary: "Transaction body가 유효해도 대응 sidecar가 없으면 blob 제출은 완전하지 않습니다." },
          { term: "Blob sidecar", description: "Blob B, commitment C, proof를 transaction body와 별도 경로로 운반하는 data artifact입니다.", example: "세 list의 같은 index가 같은 blob 제출을 나타냅니다.", boundary: "별도 경로라는 말은 결속이 없다는 뜻이 아닙니다." },
        ]} />
        <BlobBoundaryViz />
        <ContentBoundary article="reth-eip4844" />
      </section>

      <section id="body-sidecar" className="space-y-6">
        <h2 className="text-2xl font-bold">Transaction body와 sidecar는 서로 다른 질문에 답합니다</h2>
        <p><strong>Transaction body</strong>는 누가 얼마의 fee 조건으로 어떤 blob commitment를 참조했는지 execution consensus에 남깁니다. <strong>Sidecar</strong>는 그 reference가 가리키는 실제 data와 proof를 network·pool·storage에 전달합니다.</p>
        <TermBreakdown title="두 경로를 읽는 순서" items={[
          { term: "Execution reference", description: "Transaction의 blob_versioned_hashes 배열입니다.", example: "hash가 두 개면 sidecar에도 두 blob·commitment·proof가 같은 순서로 있어야 합니다." },
          { term: "Availability payload", description: "Sidecar의 실제 blob bytes와 cryptographic witness입니다.", boundary: "Hash만 받은 상태를 data available로 표시하지 않습니다." },
          { term: "Index binding", description: "같은 index의 hash, blob, commitment, proof가 한 제출임을 뜻합니다.", boundary: "개수만 같고 순서가 바뀐 sidecar도 거부합니다." },
        ]} />
      </section>

      <section id="versioned-binding" className="space-y-6">
        <h2 className="text-2xl font-bold">Versioned hash는 commitment에 scheme 이름표를 붙입니다</h2>
        <p>
            먼저 commitment를 SHA-256으로 digest한 뒤 첫 byte를 현재 KZG scheme version으로 교체합니다. 나머지 31 bytes는 digest의
            뒤쪽을 보존하므로 transaction reference가 어느 scheme의 어떤 commitment를 가리키는지 함께 표현합니다.
          </p>
        <ExplainedFormula
          question="Commitment C에서 transaction에 넣을 32-byte reference를 어떻게 만드나요?"
          idea={<p>
            Commitment를 고정 길이 digest로 바꾸고 첫 byte를 scheme version으로 덮어써 해석 규칙과 payload binding을 함께 남깁니다.
          </p>}
          formula={String.raw`h_v=v\,\|\,\operatorname{SHA256}(C)[1{:}32]`}
          annotatedFormula={String.raw`\begin{aligned}d&=\underbrace{\operatorname{SHA256}(C)}_{\text{48-byte commitment를 32-byte digest로 변환}}\\s&=\underbrace{d[1{:}32]}_{\text{version 자리를 비우고 뒤 31 bytes를 보존}}\\h_v&=\underbrace{v\,\|\,s}_{\text{scheme version과 digest suffix를 연결}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{SHA256}(C)`, annotation: ["commitment bytes를 hash해", "고정 길이 digest를 생성"] },
            { expression: String.raw`d[1{:}32]`, annotation: ["첫 byte를 제외해", "scheme version 자리를 확보"] },
            { expression: String.raw`v\,\|\,s`, annotation: ["version byte와 suffix를 이어 붙여", "transaction reference를 생성"] },
          ]}
          terms={[
            { symbol: "C", name: "KZG commitment", description: "Sidecar blob에 대한 48-byte commitment입니다." },
            { symbol: "v", name: "Scheme version", description: "Reference의 검증 scheme을 나타내는 1 byte입니다." },
            { symbol: String.raw`h_v`, name: "Versioned hash", description: "Transaction body에 저장되는 32-byte blob reference입니다." },
          ]}
          assumptions={["C의 byte encoding과 SHA-256 입력 순서를 고정합니다.", "현재 활성 fork가 기대하는 version byte를 사용합니다.", "이 binding은 proof 검증이나 data availability를 대신하지 않습니다."]}
          interpretation="예를 들어 digest 첫 byte가 0xab여도 version v=0x01이면 결과 첫 byte는 0x01이고 뒤 31 bytes만 digest에서 이어집니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("versioned-hash-check", modernCodeRefs["versioned-hash-check"])} />
          <span className="text-xs text-muted-foreground">kzg_to_versioned_hash() — 이 식이 실제로 검증되는 지점</span>
        </div>
      </section>

      <section id="paper-eip4844" className="space-y-5">
        <h2 className="text-2xl font-bold">규격이 보장하는 범위</h2>
        <CitationBlock type="paper" citeKey={1} source="EIP-4844 · Shard Blob Transactions" href={EIP_4844}>
          <p><strong>문제:</strong> Rollup data를 execution state에 영구 적재하지 않으면서 consensus가 commitment와 fee를 검증해야 합니다.</p>
          <p><strong>핵심 기여:</strong> Type-3 transaction, blob sidecar, versioned hash, KZG 검증과 별도 blob gas market을 정의합니다.</p>
          <p><strong>중요 가정:</strong> 활성 fork parameter, canonical serialization과 KZG trusted setup을 고정합니다.</p>
          <p><strong>근거 범위:</strong> Blob transaction과 sidecar의 규범적 구조 및 검증 조건입니다.</p>
          <p><strong>일반화 금지:</strong> Blob의 영구 보존, rollup execution correctness나 특정 client의 pool/storage 정책까지 보장하지 않습니다.</p>
        </CitationBlock>
      </section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={modernCodeRefs}
        fileTrees={{ reth: modernRethEip4844Tree }}
        projectMetas={RETH_PROJECT_META}
      />
    </article>
  );
}

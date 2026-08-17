import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { BlobStoreLifecycleViz } from "../reth-eip4844/viz/ModernEip4844Viz";

const RETH_BLOBSTORE = "https://github.com/paradigmxyz/reth/tree/main/crates/transaction-pool";

export default function ModernRethBlobStorage() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">검증한 큰 bytes를 다시 찾을 수 있게 만들기</p><h2 className="text-3xl font-bold tracking-tight">BlobStore는 sidecar bytes와 검증 영수증의 생명주기를 소유합니다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>BlobStore</strong>는 transaction hash로 sidecar를 쓰고 읽고 지우는 storage 경계입니다. 단순한 byte map이 아니라, 어떤 bytes를 어느 검증 generation에서 받았는지 재현할 artifact receipt가 필요합니다.</p>
      <TermBreakdown title="저장 artifact를 이루는 네 항목" items={[
        { term: "Storage key", description: "Transaction hash처럼 sidecar를 다시 찾는 stable identity입니다.", boundary: "Block number만 쓰면 reorg branch를 구분할 수 없습니다." },
        { term: "Sidecar bytes", description: "Blob, commitment, proof의 canonical serialized payload입니다." },
        { term: "Digest", description: "Read 뒤 bytes가 write 때와 같은지 확인하는 integrity 값입니다.", boundary: "Digest 일치는 KZG validity와 다른 검사입니다." },
        { term: "Generation receipt", description: "Schema·fork·validator revision과 write/cleanup generation을 기록합니다.", example: "Restart가 partial write인지 이미 완료된 write인지 판별합니다." },
      ]} />
      <BlobStoreLifecycleViz />
      <ContentBoundary article="reth-blob-storage" />
    </section>
    <section id="write-read" className="space-y-6">
      <h2 className="text-2xl font-bold">Write와 read는 bytes만이 아니라 outcome을 보존합니다</h2>
      <TermBreakdown title="Read outcome 세 가지" items={[
        { term: "Hit", description: "Key의 bytes가 있고 digest·generation도 기대값과 맞습니다.", example: "Reorg 재주입이 검증 receipt를 재사용할 수 있습니다." },
        { term: "Miss", description: "현재 store에 key가 없습니다.", boundary: "빈 blob을 반환하지 않고 fetch 또는 typed failure로 넘깁니다." },
        { term: "Corrupt", description: "Key는 있지만 bytes, digest, metadata 중 하나가 맞지 않습니다.", boundary: "단순 miss와 같은 retry policy로 숨기지 않습니다." },
      ]} />
      <ExplainedFormula question="저장된 sidecar를 언제 verified hit로 읽나요?" idea={<p>존재 여부만 보지 않습니다. Bytes digest와 검증 generation이 write receipt와 모두 같아야 hit입니다.</p>} formula={String.raw`H=I_{present}\land I_{digest}\land I_{generation}`} annotatedFormula={String.raw`\begin{aligned}I_{present}&=\underbrace{\mathbf1[B_H\neq\varnothing]}_{\text{key H에 sidecar bytes가 있는지 확인}}\\I_{digest}&=\underbrace{\mathbf1[\operatorname{hash}(B_H)=d_H]}_{\text{read bytes가 write digest와 같은지 확인}}\\H&=\underbrace{I_{present}\land I_{digest}\land I_{generation}}_{\text{존재·integrity·revision 모두 맞을 때 verified hit}}
\end{aligned}`} operations={[
        { expression: String.raw`\mathbf1[B_H\neq\varnothing]`, annotation: ["storage key를 조회해", "bytes 존재 여부를 표시"] },
        { expression: String.raw`\operatorname{hash}(B_H)=d_H`, annotation: ["read bytes를 다시 hash해", "write receipt digest와 비교"] },
        { expression: String.raw`I_{present}\land I_{digest}\land I_{generation}`, annotation: ["세 condition을 AND해", "verified hit를 결정"] },
      ]} terms={[
        { symbol: "H", name: "Verified hit", description: "안전하게 재사용할 수 있는 read 결과입니다." },
        { symbol: String.raw`B_H`, name: "Stored sidecar", description: "Key H에서 읽은 serialized sidecar bytes입니다." },
        { symbol: String.raw`d_H`, name: "Write digest", description: "Atomic write receipt에 기록한 expected digest입니다." },
      ]} assumptions={["Key·bytes·digest·generation write가 atomic하거나 recovery log를 가집니다.", "Digest algorithm과 serialization revision을 고정합니다."]} interpretation="Bytes가 있어도 digest가 다르면 H=0이며 결과는 corrupt입니다. Network miss처럼 조용히 다시 받기 전에 local corruption을 기록합니다." />
    </section>
    <section id="failure-cleanup" className="space-y-6">
      <h2 className="text-2xl font-bold">Cleanup은 finality signal과 local retention policy를 연결하는 별도 작업입니다</h2>
      <p>Finalized block을 기준으로 pool이 더 이상 재주입에 쓰지 않을 sidecar를 지울 수 있습니다. 그러나 이것은 execution pool의 local cleanup입니다. Consensus sidecar availability 기간, archival storage, rollup의 별도 data service까지 지웠다는 뜻이 아닙니다.</p>
      <TermBreakdown title="Cleanup 전에 남길 것" items={[
        { term: "Finalized boundary", description: "어느 canonical block까지 local reorg 재주입 대상에서 제외할지 정합니다." },
        { term: "Cleanup generation", description: "어느 scan이 어떤 key를 삭제했는지 남깁니다." },
        { term: "Crash cursor", description: "Delete 중 restart했을 때 재개할 stable position입니다." },
        { term: "Retention owner", description: "EL pool, CL node, archive가 각자 소유한 기간을 구분합니다." },
      ]} />
    </section>
    <section id="paper-reth-blobstore" className="space-y-5"><h2 className="text-2xl font-bold">구현 근거</h2><CitationBlock type="code" citeKey={1} source="Reth blob-store source" href={RETH_BLOBSTORE}><p><strong>문제:</strong> 큰 sidecar를 pool entry와 분리해 저장하면서 reorg·restart·cleanup에 안전하게 다시 연결해야 합니다.</p><p><strong>핵심 기여:</strong> Reth transaction-pool storage abstraction과 blob artifact lifecycle 구현을 제공합니다.</p><p><strong>중요 가정:</strong> Source SHA, storage backend, schema, fsync와 cleanup policy를 고정합니다.</p><p><strong>근거 범위:</strong> 선택한 implementation snapshot의 read/write/delete boundary입니다.</p><p><strong>일반화 금지:</strong> Local retention을 Ethereum 전체의 data availability나 영구 보관으로 확대하지 않습니다.</p></CitationBlock></section>
  </article>;
}

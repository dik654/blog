import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import RethStorageBoundaryViz from "../reth-storage-boundary-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Provider는 여러 저장소를 숨기는 wrapper가 아니라 한 시점의 state를 고정하는 read boundary다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          RPC가 block 1,000의 account를 읽는 동안 head가 1,001로 바뀌면 header는 옛 branch, balance는 새 branch에서 가져오는 mixed
          result가 생길 수 있습니다. Provider는 먼저 block hash·state root·storage generation을 고정하고 그 view 안에서 DB,
          in-memory BundleState와 historical changeset을 조합해야 합니다.
        </p>
        <p>
          이 글은 <strong>address A의 block 1,000 balance 조회가 view를 pin하고 overlay→latest DB→history를 읽어 provenance와 함께
          반환하는 과정</strong>을 따라갑니다. 상위의 consistent-view 정의는 <Link to="/blockchain/reth#overview">Reth architecture</Link>,
          physical storage transaction은 <Link to="/blockchain/reth-db">Reth DB</Link>가 소유합니다.
        </p>
      </div>
      <ContentBoundary article="reth-provider" />
      <RethStorageBoundaryViz mode="provider" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 query의 receipt</h3>
        <p>
          Request가 latest인지 특정 hash/number인지 먼저 해석하고 canonical hash와 state root를 고정합니다. 이어 DB read transaction,
          storage generation, BundleState revision과 history coverage를 하나의 view ID에 연결합니다. Lookup 결과에는 source tier와
          missing·pruned·stale-view를 구분한 outcome을 남겨 caller가 retry와 “값 없음”을 혼동하지 않게 합니다.
        </p>
        <p>
          Trait method와 physical route는 pinned Reth source의 현재 사실이지만, generation mismatch 때 fail-closed retry, reorg/crash
          fixture와 cross-tier parity는 별도의 hardening contract입니다. Provider abstraction이 존재한다는 사실만으로 snapshot isolation,
          archive availability나 proof validity가 자동 보장되지는 않습니다.
        </p>
        <p>
          Schema migration에서는 old/new provider를 같은 pinned query로 dual-read해 value·root·typed outcome을 비교한 뒤
          storage manifest의 active generation을 원자적으로 전환합니다. 이미 열린 old view는 끝까지 old generation을 읽거나 StaleView로
          전체 query를 재시도하며 old header와 new state를 조용히 합치지 않습니다. Rollback 가능한 binary·schema·snapshot은 전환
          receipt에 묶습니다.
        </p>
      </div>
      <div id="paper-reth-provider-source" className="scroll-mt-24">
        <CitationBlock source="Reth v2.2.0 provider source" href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage/provider" citeKey={1} type="code">
          Pinned source는 StateProvider trait, latest/historical provider와 storage routing의 implementation 근거입니다. Trait surface와
          backend 조합은 release·feature에 귀속하며 모든 Reth 2.x에 고정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-db-api-source" className="scroll-mt-24">
        <CitationBlock source="Reth v2.2.0 database API" href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage/db-api" citeKey={2} type="code">
          Database API source는 read transaction·cursor·typed table이 provider view 아래에서 제공하는 capability를 보여 줍니다.
          Provider의 block identity와 overlay ordering은 이 low-level API만으로 정해지지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-provider-hardening" className="scroll-mt-24">
        <CitationBlock source="Reth v2.2.0 release and storage compatibility" href="https://github.com/paradigmxyz/reth/releases/tag/v2.2.0" citeKey={3}>
          Release·migration 정보는 storage version과 compatible reader를 고정하는 provenance입니다. 이 글의 fail-closed view receipt와
          adversarial replay matrix는 source fact가 아니라 그 사실을 안전하게 운영하기 위한 검증 계약입니다.
        </CitationBlock>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import RethStorageBoundaryViz from "../reth-storage-boundary-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Reth DB는 record를 저장하는 곳이 아니라 schema·transaction·durability를 함께 지키는 경계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Block 1,000을 저장할 때 header 한 줄만 쓰는 것으로 끝나지 않습니다. Canonical hash, body·receipt, latest state, change
          history와 index가 같은 block identity를 가리켜야 하며 crash가 나면 전부 보이거나 전부 보이지 않는 일관된 generation으로 복구돼야 합니다.
        </p>
        <p>
          이 글은 <strong>block 1,000의 header·receipt·state change를 typed key/value로 encode하고 transaction commit 뒤 immutable
          history로 옮기는 과정</strong>을 따라갑니다. B+tree와 MVCC의 일반 원리는 <Link to="/blockchain/mdbx-internals">MDBX 정본</Link>,
          Reth 전체 storage owner는 <Link to="/blockchain/reth">Reth architecture</Link>를 재사용합니다.
        </p>
      </div>
      <ContentBoundary article="reth-db" />
      <RethStorageBoundaryViz mode="db" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Storage V1/V2 이름보다 먼저 볼 것</h3>
        <p>
          어느 engine을 쓰는지보다 logical table의 key/value codec, single-writer transaction, canonical marker가 갱신되는 순서,
          commit이 OS page cache와 stable media 중 어디까지 갔는지를 먼저 봅니다. Static file로 옮긴 immutable range도 coverage
          manifest와 checksum이 mutable DB generation과 맞아야 provider가 같은 history를 읽습니다.
        </p>
        <p>
          Commit receipt에는 transaction ID, visible generation, engine/backend version, sync flag·fsync outcome과 filesystem/OS 조건을
          남깁니다. Commit 반환은 다른 transaction에 보이는 atomicity일 수 있지만 전원 장애 뒤 stable media에 남는 durability는
          sync policy에 달려 있으므로 두 성공을 같은 말로 기록하지 않습니다.
        </p>
        <p>
          현재 Reth release의 backend·table·migration 경로는 pinned source의 사실이고 crash injection·fsync policy·schema
          migration parity와 rollback snapshot은 운영 hardening 계약입니다. Storage V2가 새 node의 default라는 사실만으로 기존 V1
          DB가 자동 변환되거나 모든 write가 즉시 전원 장애에 durable하다고 추론하지 않습니다.
        </p>
      </div>
      <div id="paper-reth-db-source" className="scroll-mt-24">
        <CitationBlock source="Reth v2.2.0 storage source" href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage" citeKey={1} type="code">
          Pinned Reth source는 typed table·provider·static-file·Storage V2 route의 implementation 근거입니다. 이 글의 table/trait 이름은
          v2.2.0에 귀속하며 moving main이나 과거 V1 snapshot을 현재 전체 구조로 일반화하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-libmdbx-transactions" className="scroll-mt-24">
        <CitationBlock source="libmdbx — transactions and durability" href="https://libmdbx.dqdkfa.ru/" citeKey={2}>
          libmdbx 문서와 source는 MVCC read transaction·single writer·commit/durability option의 engine 경계를 설명합니다. Reth의
          logical schema·static-file ownership·migration policy는 별도 Reth 계층이 정합니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-storage-v2-release" className="scroll-mt-24">
        <CitationBlock source="Reth v2.2.0 release" href="https://github.com/paradigmxyz/reth/releases/tag/v2.2.0" citeKey={3}>
          Release note는 새 node의 Storage V2 default와 migration·compatibility 범위를 특정 release에 고정합니다. Release note의
          성능·default를 custom build나 이후 schema의 영구 계약으로 읽지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import PrysmStorageViz from "../prysm-storage-viz";

export default function Overview({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        BeaconDB는 객체를 저장하는 폴더가 아니라 root·index·checkpoint를 한
        snapshot으로 맞추는 장부다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Beacon node는 block root로 원본을 찾고, slot으로 후보를 열거하며,
          finalized checkpoint와 state를 restart 뒤 복원해야 합니다. 하나의
          object가 primary bucket에는 있지만 secondary index에는 없거나
          checkpoint가 먼저 움직이면 reader마다 다른 chain view를 보게 됩니다.
          그래서 저장의 핵심은 bucket 수가 아니라 atomic write와 recoverable
          ownership입니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            logical record→primary/index mappings→write transaction→read
            snapshot→pruning fence→recovery
          </strong>{" "}
          순서로 진행합니다.{" "}
          <Link to="/blockchain/prysm-beacon-state">BeaconState 값</Link>과{" "}
          <Link to="/blockchain/prysm-finality">finality 규칙</Link>은
          재사용하고 DB schema·atomicity·retention만 소유합니다.
        </p>
      </div>
      <ContentBoundary article="prysm-beacon-db" />
      <PrysmStorageViz mode="database" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 block 저장의 최소 불변식</h3>
        <p>
          Block root <code>r</code>에 SSZ bytes를 저장하고 slot→r, parent→child
          또는 parent metadata 같은 index를 같은 logical transaction에서
          갱신합니다. Commit 뒤에는 primary와 모든 declared index가 함께 보이고,
          abort/crash 뒤에는 전부 보이지 않아야 합니다. Cache는 committed DB보다
          먼저 성공을 외부에 알리지 않습니다.
        </p>
        <p>
          Run receipt에는 Prysm release/SHA, database backend/version,
          schema/migration version, network/genesis, sync/fsync policy, cache
          config와 data-dir identity를 남깁니다. 이 글의 BoltDB/bbolt 명칭과
          bucket 예시는 고정 source snapshot에 귀속하며 current implementation을
          영구 schema로 선언하지 않습니다.
        </p>
      </div>
      <div id="paper-prysm-beacon-db-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs Prysm v7.1.5 — Beacon DB source"
          href="https://github.com/OffchainLabs/prysm/tree/v7.1.5/beacon-chain/db/kv"
          citeKey={1}
          type="code"
        >
          Prysm v7.1.5의 pinned source는 bucket·transaction·cache·migration과
          pruning 호출의 구현 근거입니다. Protocol 정본이나 모든 release의 동일
          schema를 뜻하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-bbolt-contract" className="scroll-mt-24">
        <CitationBlock
          source="go.etcd.io/bbolt v1.4.3 — official repository and documentation"
          href="https://github.com/etcd-io/bbolt/tree/v1.4.3"
          citeKey={2}
        >
          bbolt 문서는 read/write transaction, single-writer와 page lifecycle의
          storage-engine contract를 제공합니다. Prysm의 logical
          schema·durability policy·복구 성공을 대신 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}

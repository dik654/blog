import StorageSystemViz from './viz/StorageSystemViz';
import MKVSTreeViz from './viz/MKVSTreeViz';
import MkvsNodeTypesViz from './viz/MkvsNodeTypesViz';
import MkvsInsertViz from './viz/MkvsInsertViz';
import MerkleProofViz from './viz/MerkleProofViz';
import CheckpointSystemViz from './viz/CheckpointSystemViz';

export default function StorageSystem() {
  return (
    <section id="storage-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스토리지 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>MKVS</strong>(Merklized Key-Value Store): Runtime 상태의 저장·증명 구조<br />
          <strong>Merkle Patricia Trie</strong> 변형 — 모든 키에 대해 암호학적 inclusion proof<br />
          <strong>BadgerDB</strong> 백엔드 + LRU 캐시 + Write-through 로그<br />
          <strong>Checkpoint</strong> 시스템 — 주기적 스냅샷으로 새 노드 빠른 sync
        </p>
      </div>

      <StorageSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">MKVS 트리 구조</h3>
      </div>
      <MKVSTreeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mb-4"><MkvsNodeTypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Insert 연산</h3>
      </div>
      <div className="not-prose mb-4"><MkvsInsertViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Merkle Proof 생성</h3>
      </div>
      <div className="not-prose mb-4"><MerkleProofViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Checkpoint 시스템</h3>
      </div>
      <div className="not-prose mb-4"><CheckpointSystemViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MKVS vs MPT vs IAVL</p>
          <p>
            <strong>Ethereum MPT</strong>: 16-ary (radix 16), RLP 인코딩, 깊이 큼<br />
            <strong>Cosmos IAVL</strong>: AVL-balanced binary, 회전 연산, 버전 branching<br />
            <strong>Oasis MKVS</strong>: binary trie with path compression
          </p>
          <p className="mt-2">
            <strong>MKVS 선택 이유</strong>:<br />
            ✓ 단순 구조 — 구현·검증 용이<br />
            ✓ Proof 크기 작음 — binary + compression<br />
            ✓ 데이터베이스 백엔드 비의존적 (BadgerDB 교체 가능)<br />
            ✓ 동시성 — COW(Copy-on-Write)로 여러 version 병렬
          </p>
          <p className="mt-2">
            <strong>성능</strong>:<br />
            - Insert: O(log n) with path compression<br />
            - Proof: O(log n) entries<br />
            - Checkpoint: O(n) but 주기적이라 amortized
          </p>
        </div>

      </div>
    </section>
  );
}

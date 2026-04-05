import StorageViz from './viz/StorageViz';

export default function Storage() {
  return (
    <section id="storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저장 프리미티브 (MMR · ADB · QMDB)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>Merkle Mountain Range</strong>(MMR) — 감소하는 높이의 트리 리스트
          <br />
          Merkle Tree와 달리 append-only, O(1) 순차 쓰기, SSD 친화적, GC 불필요
          <br />
          블록체인 상태 저장에 최적화된 구조
        </p>
        <p className="leading-7">
          <strong>storage::adb</strong>(Authenticated Database) — MMR 기반 인증 데이터베이스 제품군
          <br />
          <strong>adb::any</strong> — "어떤 시점에 키가 특정 값을 가졌음"을 증명
          <br />
          <strong>adb::current</strong> — "키의 현재 값"을 증명. Activity Merkle Tree와 Grafting 기법 사용
        </p>
        <p className="leading-7">
          <strong>QMDB</strong>(Quick Merkle Database) — LayerZero와 협력 개발
          <br />
          상태 읽기: 1 SSD read · 상태 업데이트: O(1) SSD I/O · Merkleization: 메모리 내(0 SSD I/O)
          <br />
          메모리: 2.3 bytes/entry · 처리량: 최대 2.28M 상태 업데이트/초
        </p>
      </div>
      <div className="not-prose mb-8"><StorageViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MMR (Merkle Mountain Range) 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// MMR: Append-only authenticated structure
// Originally for Open Timestamps & Grin

// 구조
// 여러 Merkle tree를 크기 내림차순으로 배열
// 새 leaf 추가 → 같은 크기 트리 병합

// Example: 7 leaves
//
//         [14]                  (peak of rightmost tree)
//        /    \\
//      [10]   [11]
//      /  \\   /  \\
//     1    2  3    4  [15]    (peak 2)
//                      /  \\
//                     5    6  [13] (peak 3)
//                              |
//                              7 (single leaf)
//
// Peaks: [14, 15, 13] (decreasing size: 4, 2, 1)
// Root = hash(peaks)

// Append 알고리즘
fn append(mmr: &mut Vec<Hash>, new_leaf: Hash):
    mmr.push(new_leaf);

    // 같은 크기 트리 merge
    while can_merge(mmr):
        right = mmr.pop();
        left = mmr.pop();
        parent = hash(left, right);
        mmr.push(parent);

// 특성
// - O(log n) amortized append
// - Append-only (no delete, no modify)
// - Proofs: O(log n) size
// - SSD friendly (sequential write)

// 용도
// - Beacon chain history (Ethereum)
// - Timestamp protocols
// - Ordered event logs
// - Oracle data feeds`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">QMDB 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// QMDB: Quick Merkle Database
// LayerZero & Commonware collaboration

// 성능 목표
// - 1 SSD read per state query
// - O(1) SSD I/O per update
// - 0 SSD I/O for Merkleization
// - 2.28M updates/sec

// 핵심 아이디어
// 1) In-memory Merkle tree
//    - 모든 tree node가 RAM에 상주
//    - Hash 재계산 instant
//    - 2.3 bytes/entry overhead

// 2) SSD-backed values
//    - Values만 SSD에 저장
//    - Key → SSD offset mapping
//    - 1 SSD read per get_value

// 3) Append-only log
//    - Updates는 log에 기록
//    - No random SSD writes
//    - Compaction 주기적

// 4) Radix Patricia tree
//    - Ethereum MPT와 유사
//    - 16-way branching (hex)
//    - Path compression

// 메모리 사용량
// 1B entries × 2.3B = ~2.3 GB RAM
// 일반 MPT: ~40 GB (metadata overhead)

// 사용 사례
// - L1 state storage
// - High-throughput chains
// - Real-time analytics
// - Privacy-preserving DB`}</pre>

      </div>
    </section>
  );
}

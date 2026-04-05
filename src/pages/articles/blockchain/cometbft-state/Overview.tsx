import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 관리 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT는 합의 진행 상태를 State · BlockStore · EvidencePool 세 계층으로 영구 저장.<br />
          각 계층의 Go 구조체와 저장/조회 경로를 코드 수준으로 추적한다.
        </p>

        {/* ── 3 계층 storage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3 계층 Storage — 각 계층의 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT의 3개 독립 DB:

// 1. state.db (State 저장)
//    - 합의 상태: validator sets, params
//    - Height별 snapshot
//    - 필수 (crash recovery)
//
// 2. blockstore.db (Block 저장)
//    - 블록 원본 + meta
//    - Height → Block 매핑
//    - Part 단위 저장 (65KB chunks)
//
// 3. evidence.db (Evidence 저장)
//    - 비잔틴 증거
//    - 만료 후 자동 삭제
//    - 상대적으로 작음

// State 전이:
// Block N 처리:
// 1. loadState(N-1)    → state.db 읽기
// 2. executeBlock(state, block)
// 3. updateState(block, results)
// 4. saveState(state)  → state.db 쓰기
// 5. saveBlock(block)  → blockstore.db 쓰기

// 분리 설계 이유:
// - 각 DB가 다른 access pattern
// - state: 최신만 활발, 과거는 archive
// - blockstore: sequential read-heavy
// - evidence: short-lived, write-heavy

// DB Backend 옵션:
// - goleveldb (기본, pure Go)
// - cleveldb (C binding, 빠름)
// - boltdb (key-value, simple)
// - rocksdb (performance, complex setup)
// - badgerdb (modern, LSM-tree)

// 각 체인 운영자가 선택:
// - 작은 체인: goleveldb
// - 큰 체인 (Cosmos Hub): cleveldb/rocksdb`}
        </pre>
        <p className="leading-7">
          CometBFT는 <strong>3개 독립 DB</strong>로 state 관리.<br />
          State/Block/Evidence 각각 access pattern 맞춤 설계.<br />
          Backend DB 선택 가능 (goleveldb/rocksdb 등).
        </p>
      </div>
    </section>
  );
}

import TrieDBViz from './viz/TrieDBViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function TrieDB({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="triedb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TrieDB 상태 관리 & 비동기 I/O</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MonadDB — Merkle Patricia Trie + io_uring 비동기 I/O<br />
          동기 I/O 대비 4.17배 처리량, 가중치 기반 LRU 캐시
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-triedb-node', codeRefs['monad-triedb-node'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              node.hpp
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('monad-io-uring', codeRefs['monad-io-uring'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              async_io.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <TrieDBViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">MonadDB 설계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MonadDB: Custom State Database
//
// 왜 custom DB?
//
//   기존 솔루션 (Geth + LevelDB):
//     - General-purpose KV store
//     - Sync I/O
//     - 범용성 중시
//
//   Monad 요구:
//     - Merkle Patricia Trie 특화
//     - 병렬 읽기 최적화
//     - io_uring 활용
//     - Low-latency paths

// MonadDB Architecture:
//
//   ┌────────────────────────┐
//   │ EVM State Access       │
//   │ (account, storage, code)│
//   └─────────┬──────────────┘
//             │
//   ┌─────────▼──────────────┐
//   │ MPT Layer              │
//   │ (Merkle Patricia Trie) │
//   └─────────┬──────────────┘
//             │
//   ┌─────────▼──────────────┐
//   │ Page Cache (LRU)       │
//   │ (weighted by access)   │
//   └─────────┬──────────────┘
//             │
//   ┌─────────▼──────────────┐
//   │ io_uring I/O Engine    │
//   └─────────┬──────────────┘
//             │
//   ┌─────────▼──────────────┐
//   │ NVMe Storage           │
//   └────────────────────────┘

// io_uring Usage:
//
//   Submission Queue (SQ):
//     Batch I/O requests
//     Kernel processes async
//
//   Completion Queue (CQ):
//     Completed I/Os polled
//     User code notified
//
//   Benefits:
//     - No syscall per I/O
//     - Zero-copy possible
//     - Batching automatic
//     - Async I/O real
//
//   Monad 사용:
//     - Trie node reads (batched)
//     - Multi-block prefetch
//     - Concurrent state queries

// Weighted LRU Cache:
//
//   단순 LRU:
//     Recently used = most valuable
//
//   Weighted LRU:
//     frequency × recency × size
//     Hot nodes (e.g., root)
//     가중치 높게 유지
//
//   효과:
//     Trie upper levels 캐시 고정
//     Leaf는 churn 허용
//     80/20 법칙 활용

// MPT Optimizations:
//
//   Batch hashing:
//     여러 nodes 한꺼번에 hash
//     SIMD 활용
//
//   Parallel updates:
//     서로 다른 subtrees 병렬
//     Final merge step
//
//   Lazy hashing:
//     중간 상태 hash 생략
//     Final commit에만 hash 계산`}
        </pre>
      </div>
    </section>
  );
}

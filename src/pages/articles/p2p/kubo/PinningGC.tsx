import CodePanel from '@/components/ui/code-panel';
import BlockstoreViz from './viz/BlockstoreViz';
import { GC_CODE, GC_ANNOTATIONS } from './PinningGCData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function PinningGC({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pinning-gc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pinning & GC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Pinning</strong>은 특정 블록이 GC(Garbage Collection)에 의해
          삭제되지 않도록 보호하는 메커니즘입니다.<br />
          Pin되지 않은 블록은 <strong>Mark-and-Sweep GC</strong>로 정리됩니다.
        </p>
        <h3>Pin 타입</h3>
        <ul>
          <li><strong>Recursive Pin</strong> -- 루트 CID와 모든 하위 블록을 보호</li>
          <li><strong>Direct Pin</strong> -- 단일 블록만 보호 (하위 불포함)</li>
          <li><strong>Indirect Pin</strong> -- 재귀 핀의 하위로 자동 보호</li>
        </ul>
        <h3>Blockstore 계층 구조</h3>
        <p>
          Kubo의 블록 저장소는 6계층으로 구성됩니다.<br />
          캐싱(Two-Queue), 검증(해시 무결성), GC(락 기반 동시성 제어)를 각각 담당합니다.<br />
          실제 저장은 Badger, LevelDB, Flatfs 중 선택 가능합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-gc-main', codeRefs['kubo-gc-main'])} />
            <span className="text-[10px] text-muted-foreground self-center">GC Mark-and-Sweep</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-colored-set', codeRefs['kubo-colored-set'])} />
            <span className="text-[10px] text-muted-foreground self-center">ColoredSet (마킹)</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-pin-add', codeRefs['kubo-pin-add'])} />
            <span className="text-[10px] text-muted-foreground self-center">Pin.Add API</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-storage-ctor', codeRefs['kubo-storage-ctor'])} />
            <span className="text-[10px] text-muted-foreground self-center">Blockstore 생성</span>
          </div>
        )}
        <CodePanel title="GC Mark-and-Sweep" code={GC_CODE} annotations={GC_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Mark-and-Sweep GC 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPFS Garbage Collection
//
// Mark-and-Sweep algorithm (Dijkstra-Lamport 1978):
//
//   Phase 1 (Mark):
//     Root set = {pinned CIDs, MFS root, ...}
//     colored = {}
//     for each root:
//       DFS traverse DAG
//       Add reached CIDs to colored
//
//   Phase 2 (Sweep):
//     for each block in blockstore:
//       if block.cid not in colored:
//         delete block

// Kubo's ColoredSet:
//   Efficient set representation
//   Bloom filter + explicit set
//   Reduces memory during mark phase

// Root Sources:
//
//   1. Pinset
//      User-pinned CIDs (recursive, direct)
//
//   2. MFS (Mutable FileSystem)
//      Files visible via ipfs files API
//      /ipfs/xxx path roots
//
//   3. Bitswap active requests
//      In-flight blocks
//
//   4. Provider records
//      Announced content

// Pin Types:
//
//   Recursive (-r):
//     Root + all descendants
//     Default pin type
//
//   Direct:
//     Only this specific block
//     Doesn't pin children
//
//   Indirect:
//     Child of a recursive pin
//     Automatically protected

// GC Process:
//
//   ipfs repo gc:
//     1. Lock blockstore (write lock)
//     2. Collect roots (pins, MFS, etc.)
//     3. Traverse DAG, mark reachable
//     4. Sweep unmarked blocks
//     5. Release lock
//     6. Return removed CIDs

// Performance:
//
//   Time: O(N) where N = total blocks
//   Memory: O(reachable blocks)
//   Blocks GC during scan (서비스 영향)
//
//   Alternatives:
//     Concurrent GC (in development)
//     Reference counting (복잡)
//     Generation GC (future)

// 실무 팁:
//   - GC 빈도: 주 1회~월 1회
//   - 노드 off-peak 시간에 실행
//   - Datastore 여유 공간 확인
//   - 중요 content는 pin

// Auto-GC:
//   Kubo 설정: Datastore.GCPeriod
//   HighWater 도달 시 자동 GC
//   Production에서는 수동 실행 권장`}
        </pre>
      </div>
      <div className="mt-8"><BlockstoreViz /></div>
    </section>
  );
}

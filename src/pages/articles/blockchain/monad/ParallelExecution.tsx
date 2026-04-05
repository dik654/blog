import ParallelExecViz from './viz/ParallelExecViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ParallelExecution({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="parallel-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 실행 & Optimistic Concurrency</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Boost.Fiber 기반 경량 스레드로 모든 TX 동시 실행<br />
          Promise 체인으로 머지 순서 보장, 재실행 비율 10% 미만
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-parallel-exec', codeRefs['monad-parallel-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              execute_block.cpp — 병렬 실행 코어
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <ParallelExecViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Optimistic Concurrency Control</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Optimistic Concurrency in EVM
//
// 문제:
//   EVM은 순차 실행 전제
//   Account state 공유 → data race
//   Same contract 여러 tx = 의존성
//
// Solution: Speculative Parallelism
//
//   All transactions 동시 실행 (낙관적)
//   Each tx: read/write sets 추적
//   충돌 감지 시 재실행

// 실행 흐름:
//
//   1. Block receives N transactions
//
//   2. Launch N fibers (lightweight threads)
//      - Boost.Fiber context
//      - User-space scheduling
//      - ~microseconds switching
//
//   3. Each fiber executes:
//      - Read state from snapshot
//      - Execute EVM bytecode
//      - Record write set
//
//   4. Sequential merge phase:
//      - Apply writes in tx order
//      - Check conflicts:
//        tx_j reads something tx_i wrote (i<j)?
//        → tx_j conflict, retry
//
//   5. Retry conflicts:
//      - Re-execute with updated state
//      - Repeat merge

// Write-Write Conflict:
//   tx_i writes account A
//   tx_j writes account A
//   → tx_j sees updated value
//   → Usually fine (just ordering)
//
// Read-Write Conflict:
//   tx_j reads account A
//   tx_i later writes A (in order)
//   → tx_j stale read
//   → Retry tx_j with new value

// Promise Chain 설계:
//
//   Account A dependencies:
//     tx_1 → writes A
//     tx_3 → reads A
//     tx_5 → writes A
//     tx_7 → reads A
//
//   Promise chain:
//     A: tx_1 --> tx_3 --> tx_5 --> tx_7
//
//   tx_3 waits for tx_1 promise
//   tx_5 waits for tx_3 promise
//   ...
//
//   → Sequential deps, parallel rest

// 성능:
//   Retry rate < 10% (typical)
//   5.56x speedup vs sequential
//   CPU cores scaling

// Compare to:
//   - Block-STM (Aptos): similar approach
//   - Sealevel (Solana): 명시적 access lists
//   - ParEx (이론): formal model
//   - Monad: Boost.Fiber + optimistic`}
        </pre>
      </div>
    </section>
  );
}

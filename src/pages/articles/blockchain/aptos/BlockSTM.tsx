import BlockSTMViz from './viz/BlockSTMViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BlockSTM({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="block-stm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block-STM 병렬 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Block-STM — Software Transactional Memory 기반 낙관적 병렬 실행<br />
          Solana Sealevel과 달리 사전 계정 선언 없이 모든 TX 동시 실행, 충돌 시 재실행
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-blockstm-exec', codeRefs['apt-blockstm-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              executor.rs
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('apt-mvhashmap', codeRefs['apt-mvhashmap'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              MVHashMap
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <BlockSTMViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Block-STM 알고리즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Block-STM (Software Transactional Memory)
//
// Paper: "Block-STM: Scaling Blockchain Execution by
//         Turning Ordering Curse to a Performance Blessing"
// Authors: Gelashvili, Spiegelman, et al. (2022)
//
// Key insight:
//   Use serialized block order as a conflict-resolution
//   oracle, NOT as an execution order.
//
//   Txs execute OPTIMISTICALLY in parallel.
//   Validate against serialized order.
//   Re-execute if conflict detected.

// Core components:
//
//   1) MVHashMap (Multi-Version HashMap):
//      Key → List<(tx_id, version, value)>
//      Reads return most recent earlier tx's write
//      Allows "phantom reads" of speculated values
//
//   2) Scheduler:
//      Wait-free task assignment
//      Workers pick ExecTask or ValidateTask
//      Priority: earlier tx_id first
//
//   3) TxnLastInputOutput:
//      Per-tx: read_set, write_set, estimated_deps
//      Used for incremental validation

// Execution algorithm:
//
//   Phase 1 - Parallel speculation:
//     Worker picks tx_i
//     Executes with current MVHashMap snapshot
//     Records reads (version ids)
//     Writes with speculated values
//
//   Phase 2 - Validation:
//     Worker validates tx_j (tx_j < i where i was just written)
//     For each read in tx_j:
//       Check: read.version == MVHashMap.latest(key) ?
//     If any stale → mark tx_j as INVALID
//
//   Phase 3 - Re-execution:
//     INVALID tx → back to execute queue
//     With updated MVHashMap reads
//     Loop until no more invalidations

// Pseudocode:
//
//   while scheduler has work:
//     task = scheduler.next_task()
//     match task:
//       Execute(tx_id, incarnation):
//         output = vm_execute(tx_id, mv_memory)
//         mv_memory.record(output)
//         scheduler.finish_execution(tx_id, incarnation)
//
//       Validate(tx_id, incarnation):
//         if validate_read_set(tx_id, mv_memory):
//           scheduler.finish_validation(tx_id, incarnation, valid=true)
//         else:
//           scheduler.finish_validation(tx_id, incarnation, valid=false)
//           // triggers re-execution

// Correctness guarantees:
//
//   Serializability: output equivalent to sequential execution
//     in block-order
//
//   Progress: worst case O(n^2) but typical O(n)
//     where n = number of txs
//
//   Under high contention:
//     degrades to near-sequential (fallback)
//     still correct

// Performance:
//
//   Low contention (random transfers):
//     8 threads → 6-8x speedup
//     ~50K TPS measured
//
//   Medium contention (DEX swaps):
//     8 threads → 3-5x speedup
//
//   High contention (NFT mint, single popular account):
//     8 threads → 1.5-2x speedup
//
//   Auction-like hotspots:
//     nearly sequential (few writes succeed)

// vs Solana Sealevel:
//
//   Sealevel:
//     Tx declares accounts upfront (read/write list)
//     Scheduler groups non-conflicting txs
//     No re-execution needed
//     BUT: requires static analysis, less flexibility
//
//   Block-STM:
//     No upfront declaration
//     Dynamic conflict detection
//     Can handle dynamic dispatch, recursion
//     Cost: speculative re-execution

// Implementation in Aptos:
//   aptos-core/aptos-move/block-executor/src/:
//     executor.rs              // main execution loop
//     scheduler.rs             // task scheduling
//     mv_hashmap.rs            // multi-version memory
//     txn_last_input_output.rs // read/write sets`}
        </pre>
      </div>
    </section>
  );
}

import SectorDetailViz from './viz/SectorDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SectorLifecycle({ onCodeRef }: Props) {
  return (
    <section id="sector-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">섹터 라이프사이클 — 8단계 상태 머신</h2>
      <p className="text-sm text-muted-foreground mb-4">
        각 섹터가 Empty → Proving까지 독립적으로 상태 전이<br />
        PC1은 CPU 3-5시간, PC2와 Commit은 GPU 가속
      </p>
      <div className="not-prose mb-8">
        <SectorDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── 8-state lifecycle ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sector 8-State Lifecycle</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sector Lifecycle 8 states:

// State 1: Empty
// - sector number assigned
// - no data yet
// - waiting for pieces

// State 2: WaitDeals
// - deals being added
// - piece collection
// - padding with zero pieces
// - until full (32 GiB)

// State 3: Packing
// - data assembly
// - piece arrangement
// - CID tree computation

// State 4: PreCommit1 (PC1)
// - Stacked DRG computation
// - 11 layers (128 MiB each)
// - CPU-intensive (~3-5 hours)
// - ~352 GiB intermediate data

// State 5: PreCommit2 (PC2)
// - Merkle tree (tree C)
// - column commitments
// - GPU acceleration (~30 min)
// - proof-of-replication partial

// State 6: PreCommitted
// - on-chain PreCommit message
// - deposit initial pledge (4 FIL)
// - wait for random seed
// - ~150 epochs wait (1.25h)

// State 7: Committing (C1 + C2)
// - C1: challenge response (<1 min)
// - C2: SNARK proof (~30-90 min)
// - Groth16 proof generation
// - GPU-accelerated

// State 8: Proving
// - sector active
// - earning block rewards
// - WindowPoSt 의무
// - ~540 days lifetime

// Other states:
// - Faulty: missed PoSt
// - Terminated: voluntary end
// - Removed: proven invalid

// FSM transitions:
// go-statemachine package
// - Scheduled transitions
// - Event-driven
// - Crash recovery (durable state)
// - Parallel processing

// Persistence:
// - sector state in leveldb/badger
// - recovery on restart
// - transaction log
// - state consistency

// Worker assignments:
// - PC1: CPU worker
// - PC2: GPU worker
// - C1/C2: GPU worker
// - WindowPoSt: GPU worker
// - specialized for efficiency`}
        </pre>
        <p className="leading-7">
          8 states: <strong>Empty → WaitDeals → Packing → PC1 → PC2 → PreCommitted → Committing → Proving</strong>.<br />
          go-statemachine으로 FSM 관리.<br />
          crash recovery + parallel sectors.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 sector 단위 (32 GiB)인가</strong> — proof efficiency.<br />
          smaller sectors: more proofs needed → overhead.<br />
          larger sectors: slower sealing + less flexibility.<br />
          32 GiB = optimal balance (Filecoin 분석 결과).
        </p>
      </div>
    </section>
  );
}

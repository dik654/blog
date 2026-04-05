import DSMRViz from './viz/DSMRViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DSMR({ onCodeRef }: Props) {
  return (
    <section id="dsmr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DSMR: Replicate → Sequence → Execute</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 SMR — Replicate · Sequence · Execute가 결합. 가장 느린 단계(합의)가 전체 병목
          <br />
          <strong>Decoupled SMR</strong> — 세 단계를 독립 파이프라인으로 분리
        </p>
        <p className="leading-7">
          <strong>Replicate</strong>(<code>broadcast::buffered::Engine</code>) — ordered_broadcast로 데이터 전파. 합의 불필요
          <br />
          <strong>Sequence</strong>(<code>consensus::simplex</code>) — 시퀀서 tip의 순서만 결정. 소량 데이터(해시)
          <br />
          <strong>Execute</strong>(vm) — 확정된 순서로 트랜잭션 실행
        </p>
        <p className="leading-7">
          핵심: 합의는 tip 순서만 결정 — 실제 데이터 전파량과 디커플링. 처리량이 합의 대역폭에 제한되지 않음
        </p>
      </div>
      <div className="not-prose mb-8">
        <DSMRViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Decoupled SMR 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Decoupled State Machine Replication (DSMR)
//
// Traditional SMR (Paxos, Raft, PBFT):
//   Replicate ∥ Sequence ∥ Execute
//     ALL BUNDLED into consensus layer
//
//   Problems:
//     - Consensus bandwidth = block data size
//     - All validators transmit full blocks
//     - Slowest step (usually consensus) dominates
//     - Hard to scale throughput
//
// DSMR: decouple into 3 pipelines:
//
//   Replicate (propagate data):
//     High bandwidth requirement
//     Independent scaling
//     No consensus needed
//     Just needs delivery guarantees
//
//   Sequence (order tips):
//     Low bandwidth (small hashes)
//     Consensus-heavy
//     Orders opaque identifiers
//     Cheap per-unit cost
//
//   Execute (apply state transitions):
//     CPU-bound
//     Deterministic
//     Per-validator task
//     Can be pipelined

// Architecture:
//
//   ┌─────────────────────────────┐
//   │   Replicate Layer           │ ← Broadcast engine
//   │   (ordered_broadcast)       │   High bandwidth
//   │   Data → Certificates       │   Non-blocking
//   └────────────┬────────────────┘
//                │ tips
//                v
//   ┌─────────────────────────────┐
//   │   Sequence Layer            │ ← Consensus engine
//   │   (consensus::simplex)      │   Low bandwidth
//   │   Orders tips via BFT       │   Fast finality
//   └────────────┬────────────────┘
//                │ ordered tips
//                v
//   ┌─────────────────────────────┐
//   │   Execute Layer             │ ← State machine
//   │   (vm)                       │   CPU-bound
//   │   Apply txs to state        │   Deterministic
//   └─────────────────────────────┘

// Concrete example:
//
//   Step 1 (Replicate):
//     Sequencer Alice broadcasts Chunk(h=1, payload=tx1)
//     Network propagates via ordered_broadcast
//     2f+1 validators sign, Certificate_A1 formed
//     Alice's tip = (h=1, cert_hash)
//
//     Similarly Bob broadcasts Chunk(h=1, payload=tx2)
//     Bob's tip = (h=1, cert_hash)
//
//     Both happen CONCURRENTLY
//
//   Step 2 (Sequence):
//     Consensus leader proposes:
//       "Order this batch: [Alice_tip, Bob_tip]"
//     Small payload: just sequencer PKs + heights + hashes
//     Consensus round finalizes this ordering
//
//   Step 3 (Execute):
//     Validators:
//       Fetch tx1 from Alice's chain (already have)
//       Fetch tx2 from Bob's chain (already have)
//       Apply in order: tx1 then tx2
//       Update state

// Why this is better:
//
//   Traditional SMR bandwidth per block:
//     Each validator receives block from leader: 1x block
//     Leader sends to N validators: N x block
//     Total per block: (N+1) x block_size
//
//   DSMR bandwidth:
//     Each sequencer broadcasts own chunks
//     With K sequencers: total bandwidth = K x chunk_size
//     Better parallelism, better utilization
//     Consensus only transfers (K * tip_size) where tip_size << chunk_size

// Performance comparison:
//
//   Metric                SMR        DSMR
//   ------------------------------------------------
//   Consensus bw:         O(block)   O(K * tip)
//   Data bw:              O(block)   O(block/N)
//   Throughput limit:     consensus  per-sequencer
//   Parallelism:          none       K sequencers
//   Finality:             consensus  same
//   Leader dependency:    high       lower

// Challenges:
//
//   1. Chunk availability:
//      Consensus orders tips, but do validators HAVE the data?
//      Need availability guarantees via broadcast layer
//
//   2. Equivocation:
//      Byzantine sequencer might produce fork (Chunk1', Chunk1'')
//      Ordered_broadcast's cert mechanism handles this
//
//   3. Liveness:
//      If sequencer stalls, its chain halts
//      But other sequencers keep going
//      Consensus can skip non-progressing sequencers

// Related systems:
//   Narwhal + Bullshark (Mysten): DAG-based DSMR
//   DiemBFT v4 → moved toward DSMR
//   EigenLayer DA: decoupled availability
//   Celestia: DA layer only (no execution)

// Implementation in commonware:
//
//   Replicate: commonware-broadcast::ordered_broadcast
//   Sequence: commonware-consensus::simplex (or other)
//   Execute: application-specific VM

// Commonware composability:
//   User assembles their own blockchain from these primitives
//   Can swap consensus, broadcast, VM independently
//   Different trade-offs per application`}
        </pre>
      </div>
    </section>
  );
}

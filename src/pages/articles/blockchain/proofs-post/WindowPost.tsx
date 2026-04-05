import { codeRefs } from './codeRefs';
import WindowPostViz from './viz/WindowPostViz';
import type { CodeRef } from '@/components/code/types';

export default function WindowPost({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="window-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WindowPoSt: 데드라인 & 파티션</h2>
      <div className="not-prose mb-8">
        <WindowPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 파티션 구조</strong> — GPU가 파티션 단위로 증명 병렬 생성
          <br />
          GPU 수에 비례해 처리량 증가
        </p>

        {/* ── WindowPoSt 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">WindowPoSt 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WindowPoSt Timing & Partitions:

// 24-hour Proving Period:
// - 48 deadlines × 30 min each
// - each deadline: challenge random sectors
// - all active sectors proved every 24h

// Partition Size:
// - 2349 sectors per partition (mainnet)
// - fits in GPU memory
// - 1 proof per partition

// Challenge Window:
// - deadline at specific epoch
// - ~30 min to submit
// - late submission = miss
// - must be within 180 epochs

// Process:
// 1. Await deadline epoch
// 2. Compute challenge:
//    rand = drand(deadline_epoch)
//    challenges = deriveChallenges(rand, partition)
// 3. For each challenged sector:
//    - 10 random leaf indices
//    - open Merkle proofs (tree R)
// 4. Construct SNARK witness
// 5. Generate Groth16 proof
//    - ~10-30 min per partition (GPU)
// 6. Submit SubmitWindowedPoSt message
// 7. Wait for on-chain confirmation

// Proof Parameters (2349 sectors):
// - constraints: ~10^9
// - witness: large
// - proof: 192 bytes
// - verification: ~200ms on-chain

// Parallelism:
// - partitions parallel (multi-GPU)
// - 10 partitions × 20 min = 200 GPU-min
// - 4 GPUs: 50 min
// - typical SP: 100-1000 sectors → 1-4 partitions

// Challenge Generation:
// - per-partition deadline randomness
// - deterministic given randomness
// - avoids predictable challenges
// - forces real-time sector access

// SubmitWindowedPoSt message:
// type SubmitWindowedPoStParams struct {
//     Deadline: uint64
//     Partitions: []PoStPartition
//     Proofs: []PoStProof
//     ChainCommitEpoch: ChainEpoch
//     ChainCommitRand: Randomness
// }

// Gas cost:
// - variable per partition
// - ~100M gas per partition
// - batched with other partitions
// - profitability: reward > cost

// Optimization:
// - pre-generate trees (PC2)
// - cached on NVMe
// - parallel partition proving
// - GPU batching
// - bellperson / SupraSeal`}
        </pre>
        <p className="leading-7">
          WindowPoSt: <strong>48 deadlines × 30min × partitions of 2349 sectors</strong>.<br />
          10 challenges per sector, Groth16 SNARK.<br />
          multi-GPU parallelism → 1-4 hours per 24h cycle.
        </p>
      </div>
    </section>
  );
}

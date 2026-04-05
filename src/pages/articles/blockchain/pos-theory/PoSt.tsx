import PoStFlowViz from './viz/PoStFlowViz';

export default function PoSt() {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Spacetime (PoSt)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          합의된 기간 동안 지속적으로 데이터를 저장하고 있음을 증명.<br />
          주기적 챌린지를 통해 "시간 축"을 따라 저장 지속성을 검증
        </p>
      </div>
      <div className="not-prose"><PoStFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PoSt 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof of Spacetime (PoSt):

// Definition (Benet-Dalrymple-Greco 2017):
// "Continuous proof that data is stored
//  over a specified time period"

// Extends PoRep:
// - PoRep: single moment
// - PoSt: multiple moments over time
// - proving persistence

// Core idea:
// - regular challenges
// - periodic proofs
// - verifier checks time-indexed
// - cumulative guarantee

// Types in Filecoin:
//
// WindowPoSt:
// - 24-hour proving period
// - all sectors
// - partition-based
// - ~30 min per partition
// - regular penalty for miss
//
// WinningPoSt:
// - block election time
// - 1 sampled sector
// - fast (20-40s)
// - part of block creation

// Mathematical foundation:
// - random challenges (time-indexed)
// - Merkle proof opening
// - sector-specific
// - SNARK compression

// Security:
// - if SP deletes data
// - can't produce correct proofs
// - economic penalty (slash)
// - incentive to retain

// Time-binding:
// - challenges use fresh randomness
// - drand beacon
// - prover can't pre-compute
// - real-time proof required

// Proof generation:
// 1. get challenge randomness
// 2. sample sectors
// 3. open Merkle proofs
// 4. SNARK wrap
// 5. submit on-chain

// Why SNARK?
// - raw Merkle proofs: large
// - constant-size after SNARK
// - cheap verification
// - essential for blockchain

// Variants:
// - Rational PoSt (incentive-aware)
// - Incremental PoSt
// - Batch PoSt (multiple sectors)
// - Aggregated PoSt (cross-sector)

// Applications:
// - Filecoin (primary)
// - Chia (PoSpace variant)
// - SpaceMesh (PoET + PoST)
// - Storj (audits)

// Economic model:
// - honest proof: rewards
// - missed proof: fault fee
// - invalid proof: slashing
// - long fault: termination`}
        </pre>
        <p className="leading-7">
          PoSt: <strong>temporal extension of PoRep (persistence proof)</strong>.<br />
          Filecoin: WindowPoSt (24h) + WinningPoSt (election).<br />
          time-indexed challenges → real-time proof required.
        </p>
      </div>
    </section>
  );
}

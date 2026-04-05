import ProofFlowViz from './viz/ProofFlowViz';

export default function ProofPipeline() {
  return (
    <section id="proof-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK 증명 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Trace Commit &rarr; Constraint Composition &rarr; FRI &rarr; Query &rarr; Verify. 5단계 파이프라인.
        </p>
      </div>
      <div className="not-prose"><ProofFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">STARK 증명 파이프라인 5단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// STARK Proof Generation Pipeline
//
// Phase 1: Trace Generation & Commitment
//   - 연산 실행 → trace table
//   - Column별 polynomial interpolation
//   - LDE (Reed-Solomon 확장)
//   - Merkle commit to trace LDE
//   - Send root to verifier
//
// Phase 2: Constraint Composition
//   - AIR 제약 다항식 생성
//   - Verifier challenges α_i (Fiat-Shamir)
//   - Composition polynomial:
//     C(x) = Σ α_i · C_i(x) / V(x)
//   - LDE composition polynomial
//   - Merkle commit C LDE
//
// Phase 3: Deep Composition
//   - Verifier samples random z
//   - Prover sends trace values at z
//   - Combine into DEEP composition poly
//   - Reduce to single low-degree test
//
// Phase 4: FRI Low-Degree Test
//   - Recursively halve polynomial
//   - log(n) rounds of commit/challenge
//   - Each round: commit folded polynomial
//   - Final round: reveal constant
//
// Phase 5: Queries & Verification
//   - Verifier samples random positions
//   - Prover sends:
//     * Trace evaluations at queried positions
//     * Merkle proofs
//     * FRI consistency values
//   - Verifier checks:
//     * All Merkle proofs valid
//     * FRI folding consistent
//     * Constraint evaluation correct

// Verifier 체크 (복잡도 O(log² n)):
//   1. Sample query positions (random)
//   2. Verify Merkle proofs
//   3. Check AIR constraint at sampled points
//   4. Verify FRI halving consistency
//   5. Verify final polynomial degree

// Proof Components:
//   - Trace Merkle roots
//   - Composition Merkle roots
//   - FRI commitments (each layer)
//   - Query answers + Merkle paths
//   - Final FRI polynomial

// 전형적인 STARK proof:
//   50 KB ~ 200 KB
//   Verifier: 10-100 ms
//   Prover: secs to mins

// Cairo VM 예시:
//   10^6 step trace
//   Proof: ~80 KB
//   Verify: ~80ms on L1 Ethereum
//   Prover: ~10s on good HW`}
        </pre>
      </div>
    </section>
  );
}

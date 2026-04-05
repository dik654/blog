import ProofSystemsViz from './viz/ProofSystemsViz';

export default function ProofSystems() {
  return (
    <section id="proof-systems" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARKs vs STARKs vs IOP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          증명 크기, 검증 속도, 셋업, 양자 내성 &mdash; 시스템별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ProofSystemsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">zkSNARK vs zkSTARK vs IOP</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof Systems 비교
//
// ┌─────────────────┬─────────┬──────────┬──────────┬──────────┐
// │    시스템       │ Trusted │ Proof    │ Verify   │ Quantum  │
// │                 │ Setup?  │ Size     │ Time     │ Resistant│
// ├─────────────────┼─────────┼──────────┼──────────┼──────────┤
// │ Groth16         │ Yes     │ ~200 B   │ ~3 ms    │ No       │
// │ PLONK           │ 1x univ │ ~500 B   │ ~5 ms    │ No       │
// │ Halo2           │ No      │ ~1 KB    │ ~10 ms   │ No       │
// │ STARK           │ No      │ 50-200 KB│ ~50 ms   │ Yes      │
// │ Bulletproofs    │ No      │ O(log n) │ O(n)     │ No       │
// └─────────────────┴─────────┴──────────┴──────────┴──────────┘

// zkSNARK (Zero-Knowledge Succinct NIARK)
//
// S: Succinct (증명 작음)
// N: Non-interactive
// AR: ARgument (computational soundness)
// K: Knowledge (지식 추출 가능)
//
// 특징:
//   - 증명 크기: 상수 or polylog
//   - 검증 빠름: 밀리초
//   - 암호학적 가정: pairing, DLP
//
// 변형:
//   Groth16: 최소 증명 크기 (3 group elements)
//            per-circuit trusted setup
//   PLONK:   Universal trusted setup
//   Marlin:  Universal, 다양한 상호작용
//   Halo:    Recursion, no trusted setup

// zkSTARK (Scalable Transparent ARK)
//
// S: Scalable (prover 준선형)
// T: Transparent (no trusted setup)
// AR: ARgument
// K: Knowledge
//
// 특징:
//   - 증명 큼 (수십~수백 KB)
//   - Post-quantum secure
//   - No trusted setup
//   - 해시 기반
//
// 프로젝트:
//   StarkWare, Risc0, Polygon Miden

// Interactive Oracle Proofs (IOP)
//
// - 이론적 프레임워크
// - Prover가 oracle 제공
// - Verifier가 position 쿼리
// - Fiat-Shamir로 non-interactive 변환
//
// Building Block of:
//   - STARKs (FRI-based IOP)
//   - Polynomial IOP + PCS → SNARK

// 선택 가이드:
//
// 증명 크기 최우선:
//   → Groth16 (가장 작음)
//
// 유연한 setup:
//   → PLONK (1 trusted setup)
//
// No trusted setup:
//   → Halo2 (small proof)
//   → STARK (large proof, post-quantum)
//
// Recursion 필요:
//   → Halo2, Nova, Plonky2
//
// High performance:
//   → Plonky3 (latest, 2024)`}
        </pre>
      </div>
    </section>
  );
}

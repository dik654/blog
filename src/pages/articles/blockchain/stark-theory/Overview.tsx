import STARKPropertyViz from './viz/STARKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Scalable Transparent ARgument of Knowledge &mdash; 해시 함수만으로 동작, trusted setup 불필요.
        </p>
      </div>
      <div className="not-prose"><STARKPropertyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">STARK 핵심 속성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// zkSTARK (Ben-Sasson et al. 2018)
// Scalable Transparent ARgument of Knowledge
//
// 4 properties:
//
// S - Scalable
//   Prover: quasi-linear O(n log² n)
//   Verifier: polylogarithmic O(log² n)
//   → 대규모 computation 가능
//
// T - Transparent
//   No trusted setup
//   Public randomness만 사용 (hash)
//   Post-ceremony 없음
//
// AR - ARgument
//   Computational soundness
//   (cryptographic assumptions)
//
// K - Knowledge
//   Witness extraction 가능

// vs zkSNARK:
//
// ┌──────────────┬──────────────┬──────────────┐
// │   측면       │    SNARK     │    STARK     │
// ├──────────────┼──────────────┼──────────────┤
// │ Proof size   │ 200-500 B    │ 50-200 KB    │
// │ Verify time  │ ~ms          │ ~10-100 ms   │
// │ Prove time   │ O(n log n)   │ O(n log² n)  │
// │ Setup        │ Trusted      │ Transparent  │
// │ Crypto       │ Pairing/ECC  │ Hash only    │
// │ Post-quantum │ No           │ Yes          │
// └──────────────┴──────────────┴──────────────┘

// 사용 프로젝트:
//   StarkWare: Cairo VM, StarkNet, StarkEx
//   Risc0: RISC-V zkVM
//   Polygon Miden: TurboVM
//   Plonky2: STARK + PLONK hybrid
//   Winterfell: Rust STARK library
//   Stone: Latest Cairo prover

// 역사:
//   2018: STARK paper (Ben-Sasson)
//   2020: StarkEx production
//   2021: StarkNet mainnet
//   2022: Risc0 launch
//   2023: zkVM 경쟁 시작
//   2024: Stone prover open source

// STARK의 5 phases:
//   1. Execution Trace: 연산을 테이블로
//   2. AIR: 제약을 다항식 등식으로
//   3. LDE: Reed-Solomon으로 확장
//   4. FRI: low-degree proof
//   5. Query: verifier가 random sampling`}
        </pre>
      </div>
    </section>
  );
}

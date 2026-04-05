import LDEViz from './viz/LDEViz';

export default function LowDegreeExtension() {
  return (
    <section id="low-degree-extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저차 확장 (Low-Degree Extension)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          유효한 trace = 저차 다항식, 잘못된 trace = 고차 &mdash; Reed-Solomon LDE로 차이 증폭.
        </p>
      </div>
      <div className="not-prose"><LDEViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LDE와 Reed-Solomon 코드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Low-Degree Extension (LDE)
//
// 개념:
//   Trace polynomial (차수 T-1)을
//   더 큰 domain으로 확장하여 평가
//
// Domain 크기:
//   trace domain |D| = T
//   LDE domain |D'| = T · blowup_factor
//
//   blowup_factor: 2, 4, 8, 16, ...
//   → 증명 크기 vs 보안 trade-off
//
// Process:
//   1. Trace values over D → polynomial P(x)
//   2. Evaluate P(x) on larger domain D'
//   3. Commit Merkle tree of evaluations

// Reed-Solomon Encoding:
//
// 원본 메시지 (정보):
//   m = (m_0, m_1, ..., m_{T-1})
//
// Encode as polynomial:
//   P(x) = m_0 + m_1·x + m_2·x² + ... + m_{T-1}·x^(T-1)
//
// Codeword:
//   (P(α_0), P(α_1), ..., P(α_{N-1}))
//   where N = T · blowup
//
// 특성:
//   - Minimum distance: N - T + 1
//   - Error correcting capability
//   - Low-degree polynomial ⟺ valid codeword

// 왜 LDE?:
//
// 공격자가 trace를 위조 시:
//   - 모든 row 만족 어려움
//   - 일부만 맞추고 나머지 랜덤
//   - → 결과: high-degree polynomial
//
// 정직한 prover:
//   - 모든 row 정확히 만족
//   - P(x)는 low-degree (차수 T-1)
//
// Verifier:
//   - Random point 샘플링
//   - Low-degree test (FRI)
//   - 고차수 → reject

// Rate:
//   ρ = T / N = 1 / blowup_factor
//
//   낮은 rate = 더 안전 + 더 큰 proof
//   일반: ρ = 1/4 (blowup=4) or 1/8
//
// Soundness:
//   ε ≈ (1 - ρ)^(queries)
//
//   예: blowup=4, queries=40
//       ε ≈ 0.75^40 ≈ 10^-5
//       → 128-bit security 위해 ~100 queries

// 실무 파라미터:
//   StarkWare Cairo: blowup=16, queries=40
//   Risc0: blowup=4, queries=50
//   Plonky2: various configs`}
        </pre>
      </div>
    </section>
  );
}

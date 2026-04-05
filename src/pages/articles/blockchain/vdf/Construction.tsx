import ConstructionViz from './viz/ConstructionViz';

export default function Construction() {
  return (
    <section id="construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구성: 순차 계산 + 빠른 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RSA 그룹 위 반복 제곱이 핵심. phi(N)을 모르면 x^(2^T)를 T번 제곱으로만 계산 가능
        </p>
      </div>
      <div className="not-prose"><ConstructionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VDF Construction 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VDF Construction (Pietrzak / Wesolowski 2018):

// RSA-based VDF:
// Setup:
// - N = p*q (RSA modulus)
// - phi(N) = (p-1)(q-1) [secret]
// - group Z_N*

// Evaluation:
// y = x^(2^T) mod N
// - T squarings
// - 각 squaring: x → x^2 mod N
// - must be sequential
// - no shortcut without phi(N)

// Why sequential?
// - each step depends on previous
// - can't parallelize
// - BBS (Blum-Blum-Shub) assumption
// - well-studied crypto

// Key insight:
// - phi(N)을 모르면:
//   y = x^(2^T) mod N
//   - T squarings 필수
//   - linear time
//
// - phi(N)을 알면:
//   e = 2^T mod phi(N)
//   y = x^e mod N
//   - fast exponentiation
//   - polylog(T) time

// Proof (Wesolowski 2018):
// prover provides π such that:
// - short (O(1) group element)
// - verifier can check quickly
// - polylog(T) verify

// Wesolowski's proof:
// 1. verifier gives random prime l
// 2. prover computes:
//    q = (2^T) div l
//    r = (2^T) mod l
//    π = x^q mod N
// 3. verifier checks:
//    π^l * x^r ≡ y (mod N)

// Pietrzak's proof:
// - recursive halving
// - log(T) proof elements
// - different trade-offs

// Security:
// - RSA assumption
// - adaptive root assumption
// - repeated squaring hard

// Parameters (typical):
// - N: 2048 bits RSA
// - T: 2^30 to 2^40
// - 실제: 시간 = T * ~microseconds
// - T=2^30: 17 min

// Class Group VDF (VDF Alliance):
// - replaces RSA with class groups
// - no trusted setup
// - imaginary quadratic fields
// - current research

// Chia implementation:
// - "time lord" = VDF server
// - produces VDF outputs
// - continuous computation
// - accelerated by ASIC`}
        </pre>
        <p className="leading-7">
          RSA VDF: <strong>x^(2^T) mod N, T squarings</strong>.<br />
          Wesolowski proof (O(1)), Pietrzak proof (log T).<br />
          Class group variant (trustless setup), Chia "time lord".
        </p>
      </div>
    </section>
  );
}

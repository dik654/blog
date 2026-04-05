import PolyFFTViz from './viz/PolyFFTViz';

export default function PolynomialArithmetic() {
  return (
    <section id="polynomial-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다항식 산술 & FFT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식은 ZKP의 핵심 데이터 구조 — 회로 제약, 증명, 검증 모두 다항식 연산으로 환원.
        </p>
      </div>
      <div className="not-prose"><PolyFFTViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다항식 연산과 NTT</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Polynomial Operations
//
// 두 가지 표현:
//
// 1. Coefficient Form (계수 형태)
//    p(x) = a_0 + a_1·x + a_2·x² + ... + a_d·x^d
//    저장: [a_0, a_1, ..., a_d]
//
// 2. Evaluation Form (평가 형태)
//    도메인 D = {ω^0, ω^1, ..., ω^(n-1)}
//    저장: [p(ω^0), p(ω^1), ..., p(ω^(n-1))]
//
// 변환:
//   Coefficient → Evaluation: FFT/NTT (O(n log n))
//   Evaluation → Coefficient: IFFT/INTT

// 복잡도 비교:
//
// Coefficient form:
//   Add: O(n)
//   Multiply: O(n²) naive
//   Divide: O(n²)
//
// Evaluation form:
//   Add: O(n)
//   Multiply: O(n) pointwise!
//   Divide: O(n) pointwise
//
// → 곱셈이 많으면 evaluation form 유리

// NTT (Number Theoretic Transform):
//
// FFT의 finite field 버전
//   Root of unity: ω ∈ F_p
//   ω^n = 1, ω^k ≠ 1 for k < n
//
// 필요 조건:
//   n | (p-1)  (p-1이 n의 배수)
//
// 주요 ZK fields:
//   BN254 Fr: p-1 = 2^28 · 5 · 11 · ...
//              → 2^28까지 NTT 가능
//   Goldilocks: p-1 = 2^32 · (2^32 - 1)
//              → 2^32까지 매우 큰 NTT

// Polynomial 사용 예:
//
// 1. FRI (STARK)
//    Reed-Solomon encoding
//    Low-degree testing
//
// 2. KZG commitments
//    P(x) 커밋 → constant-size proof
//
// 3. PLONK
//    Gate polynomial
//    Permutation polynomial
//    Lookup polynomial
//
// 4. Groth16
//    QAP (Quadratic Arithmetic Program)
//    A(x), B(x), C(x) polynomials

// Lagrange Interpolation:
//   n개 점 → 차수 (n-1) 다항식
//   L_i(x) = ∏_{j≠i} (x - x_j)/(x_i - x_j)
//   p(x) = Σ y_i · L_i(x)
//
// Barycentric form:
//   더 효율적 평가
//   Numerical stability`}
        </pre>
      </div>
    </section>
  );
}

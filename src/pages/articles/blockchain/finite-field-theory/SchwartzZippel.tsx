import SchwartzZippelViz from './viz/SchwartzZippelViz';

export default function SchwartzZippel() {
  return (
    <section id="schwartz-zippel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schwartz-Zippel 보조정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          두 다항식이 같은지 랜덤 점에서 확인 — PLONK, STARK 건전성의 기반.
        </p>
      </div>
      <div className="not-prose"><SchwartzZippelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Schwartz-Zippel Lemma</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Schwartz-Zippel Lemma (1979)
//
// 보조정리:
//   P ∈ F[x_1, ..., x_n] 차수 d인 non-zero 다항식
//   S ⊆ F: 유한 부분집합
//   (r_1, ..., r_n) ∈ S^n 랜덤 샘플링
//
//   Pr[P(r_1, ..., r_n) = 0] ≤ d / |S|
//
// 핵심 결과:
//   Non-zero 다항식의 random point 값이
//   0일 확률은 매우 작다
//
// 1-variable 경우:
//   차수 d 다항식은 최대 d개의 root
//   |S|에서 랜덤 선택 → root일 확률 ≤ d/|S|

// 응용: Polynomial Identity Testing
//
// 목표: P(x) =? Q(x) 확인
//
// Method 1 (직접):
//   모든 계수 비교: O(d)
//
// Method 2 (SZ):
//   차이 다항식 D(x) = P(x) - Q(x)
//   r ← random ∈ S
//   Check: D(r) = 0?
//
//   만약 P = Q → D = 0 → 항상 true
//   만약 P ≠ Q → D는 non-zero
//                → Pr[D(r) = 0] ≤ d/|S|
//
//   |S| = 2^256 이면 소수점 반올림 0

// ZKP에서 활용:
//
// 1. PLONK
//    Grand product argument
//    Σ A_i·B_i - C_i = 0 (mod p)
//    → random challenge로 한 점에서만 검증
//
// 2. STARK
//    AIR constraints
//    composition polynomial = 0 on trace domain
//    → DEEP composition으로 single point
//
// 3. Sumcheck Protocol
//    Σ f(x) over {0,1}^n
//    → log n rounds of random challenges
//
// 4. Multi-linear extension
//    평가 via random challenges

// 보안 분석:
//
// Soundness error:
//   single query: d / |F|
//   k queries: (d / |F|)^k
//
// Practical:
//   BN254 Fr: |F| ~ 2^254
//   d = 10^6 (million)
//   error ~ 2^-230
//   → 매우 안전
//
// Quality parameters:
//   - Field size vs degree
//   - Number of queries
//   - Honest-verifier vs malicious

// Variants:
//   - DeMillo-Lipton-Schwartz-Zippel
//   - Multi-variate extension
//   - Low-degree testing (core of STARK)`}
        </pre>
      </div>
    </section>
  );
}

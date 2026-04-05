import VanishingViz from './viz/VanishingViz';

export default function Vanishing() {
  return (
    <section id="vanishing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vanishing Polynomial</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          도메인 모든 점에서 0인 다항식 &mdash; 제약 검증을 한 번의 다항식 나눗셈으로 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><VanishingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Vanishing Polynomial 심층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Vanishing Polynomial Z_H(x)
//
// Definition:
//   Given domain H = {h_0, h_1, ..., h_{n-1}}
//   The vanishing polynomial:
//     Z_H(x) = prod_{i=0}^{n-1} (x - h_i)
//
// Properties:
//   1. Z_H(h_i) = 0 for all h_i in H
//   2. deg(Z_H) = n = |H|
//   3. Z_H is monic (leading coefficient 1)
//   4. For any polynomial p(x):
//        p(h_i) = 0 for all h_i in H
//        ⟺ Z_H(x) divides p(x)

// Use in proof systems:
//
//   Constraint check via divisibility:
//     C(x) = 0 on all h_i in H
//     ⟺ C(x) = Z_H(x) * Q(x) for some polynomial Q
//
//   Prover sends Q(x); verifier checks
//     C(x) == Z_H(x) * Q(x)
//   at random point x (Schwartz-Zippel)
//
//   This converts "check n constraints" → "check 1 poly equation"
//   This is the foundation of SNARK/STARK soundness

// Computing Z_H(x):
//
//   General domain H:
//     O(n) multiplications to compute product
//     Storage: n+1 coefficients
//     Evaluation: O(n) per point
//
//   Unity roots domain H = {omega^i}:
//     Z_H(x) = x^n - 1
//     O(1) storage (just n)
//     Evaluation: O(log n) via fast exp

// Unity roots magic:
//
//   H = {omega^0, omega^1, ..., omega^{n-1}}
//   where omega^n = 1 (primitive n-th root)
//
//   Then:
//     prod_{i=0}^{n-1}(x - omega^i) = x^n - 1
//
//   Proof:
//     x^n - 1 = 0 has exactly n roots in F_p
//     (fundamental theorem of algebra extended to finite fields)
//     These roots are precisely the n-th roots of unity
//     So factoring: x^n - 1 = prod(x - omega^i)
//
//   Evaluation at z: O(log n) via binary exponentiation
//
//   This is WHY production systems use unity roots!

// Alternative: coset domain
//
//   H' = g * H = {g * omega^i : i = 0..n-1}
//   Vanishing: Z_H'(x) = x^n - g^n
//
//   Used for "blinding" in ZK systems
//   Prevent direct evaluation attacks

// Role in PLONK:
//
//   Gate constraint polynomial:
//     P(x) = q_L(x)*a(x) + q_R(x)*b(x) + q_M(x)*a(x)*b(x)
//          + q_O(x)*c(x) + q_C(x)
//
//   For witness to be valid:
//     P(h_i) = 0 for all h_i in H (each row)
//
//   So: P(x) = Z_H(x) * T(x) for some T
//
//   Prover sends T(x), verifier:
//     1. Pick random z
//     2. Compute P(z) from openings
//     3. Compute Z_H(z) = z^n - 1
//     4. Verify P(z) == Z_H(z) * T(z)

// Quotient polynomial T(x):
//
//   T(x) = P(x) / Z_H(x)
//
//   Computed by prover:
//     Know P(x) in coefficient form
//     Polynomial long division
//     Or: evaluate on larger domain, divide pointwise
//
//   For unity roots: div by x^n - 1 is easy
//     Just reduce higher powers modulo x^n - 1
//
//   Quotient degree: deg(P) - n
//   Often bounded to 3n or similar

// Barycentric evaluation (alternative):
//
//   f(x) at any x in F:
//     f(x) = (Z_H(x) / n) * sum_i (omega^i * y_i / (x - omega^i))
//
//   If f already known on H (i.e., values y_i):
//     O(n) to evaluate at any point outside H
//     More stable than direct Lagrange

// Vanishing at subsets:
//
//   Sub-vanishing:
//     H_1 subset of H
//     Z_{H_1}(x) = prod_{h in H_1}(x - h)
//
//   Useful for partial constraints
//   Used in Plookup, zk-EVM arguments

// Vanishing polynomial derivative:
//
//   Z_H'(x) = formal derivative
//   For unity roots: Z_H'(omega^i) = n * omega^{-i}
//   Used in barycentric formula denominator`}
        </pre>
      </div>
    </section>
  );
}

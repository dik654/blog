import LagrangeConceptViz from './viz/LagrangeConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 점이 주어지면 그 점들을 모두 지나는 유일한 n-1차 다항식 복원.
          <br />
          INTT의 핵심 원리.
        </p>
      </div>
      <div className="not-prose"><LagrangeConceptViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 보간 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lagrange Interpolation
//
// Fundamental theorem:
//   Given n distinct points (x_0, y_0), ..., (x_{n-1}, y_{n-1})
//   There exists a UNIQUE polynomial f(x) of degree < n
//   Such that f(x_i) = y_i for all i
//
// History:
//   Joseph-Louis Lagrange (1795)
//   Actually earlier: Edward Waring (1779)
//   Fundamental result in polynomial interpolation

// Why unique?
//
//   Suppose f and g both interpolate the points
//   Then (f - g)(x_i) = 0 for all n points
//   But (f - g) has degree < n
//   A nonzero degree-d polynomial has at most d roots
//   → (f - g) must be the zero polynomial
//   → f = g

// Applications across fields:
//
//   1. Numerical analysis:
//      - Function approximation
//      - Numerical integration (Gauss quadrature)
//
//   2. Cryptography:
//      - Shamir secret sharing
//      - Polynomial commitments
//      - Threshold signatures
//
//   3. ZK proofs:
//      - Convert witness to polynomial
//      - Lagrange basis for constraint systems
//      - Inverse NTT (INTT)
//
//   4. Error correction:
//      - Reed-Solomon codes
//      - Decoding via interpolation

// Two dual problems:
//
//   Evaluation: given poly → compute values at n points
//     Direct: O(n) per point, O(n^2) total
//     Fast: FFT/NTT, O(n log n)
//
//   Interpolation (Lagrange): given values → compute poly
//     Direct: O(n^2) for naive Lagrange
//     Fast: Inverse FFT (IFFT/INTT), O(n log n)
//       (only works on structured points like unity roots)

// Polynomial representation forms:
//
//   Coefficient form:
//     f(x) = a_0 + a_1*x + ... + a_{n-1}*x^{n-1}
//     Good for: algebraic operations
//
//   Evaluation form:
//     f = [f(x_0), f(x_1), ..., f(x_{n-1})]
//     Good for: pointwise ops (mult, add)
//
//   Lagrange basis form:
//     f = sum_i c_i * L_i(x)
//       where L_i is 1 at x_i, 0 at other points
//     c_i = f(x_i) = y_i
//     Good for: interpolation, proofs
//
// Converting between forms:
//   coefficients ↔ evaluations: via FFT/INTT
//   evaluations ↔ Lagrange: trivially c_i = y_i

// Why Lagrange is fundamental for ZK:
//
//   Witness of size n → evaluations
//   Interpolate to polynomial
//   Verify relations via polynomial identities
//   Query poly at random point for soundness
//
//   Examples:
//     PLONK: constraints over H = {omega^i}
//       witness vectors become polynomials via interp
//     STARK: execution trace as polynomial
//       trace values indexed by time step
//       interpolated to polynomial for LDE

// Complexity of Lagrange interpolation:
//
//   Direct formula: O(n^2) multiplications
//     (computing each L_i(x) * y_i takes O(n) divides)
//
//   Newton form: O(n^2) but incremental
//     Add new point: O(n) instead of recomputing
//
//   Fast Lagrange (structured points):
//     Unity roots: INTT in O(n log n)
//     Equally spaced: O(n) with barycentric
//
//   Barycentric Lagrange:
//     L(x) = prod(x - x_i)
//     f(x) = L(x) * sum_i (w_i * y_i / (x - x_i))
//       where w_i = 1 / prod_{j!=i}(x_i - x_j)
//     Compute w_i once: O(n^2)
//     Then each eval: O(n)
//     Numerically stable`}
        </pre>
      </div>
    </section>
  );
}

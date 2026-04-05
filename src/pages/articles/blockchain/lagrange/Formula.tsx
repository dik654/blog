import LagrangeFormulaViz from './viz/LagrangeFormulaViz';

export default function Formula() {
  return (
    <section id="formula" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간 공식</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          각 점에서만 1이고 나머지에서 0인 &ldquo;선택 함수&rdquo;를 만들어 가중합.
        </p>
      </div>
      <div className="not-prose"><LagrangeFormulaViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 공식 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lagrange Interpolation Formula
//
// Standard form:
//
//   f(x) = sum_{i=0}^{n-1} y_i * L_i(x)
//
//   where L_i(x) is the i-th Lagrange basis polynomial:
//     L_i(x) = prod_{j != i} (x - x_j) / (x_i - x_j)
//
// Properties of L_i(x):
//   1. L_i is a polynomial of degree n-1
//   2. L_i(x_i) = 1
//   3. L_i(x_j) = 0 for j != i
//
// Verification that f(x_k) = y_k:
//   f(x_k) = sum_i y_i * L_i(x_k)
//          = y_k * L_k(x_k) + sum_{i!=k} y_i * L_i(x_k)
//          = y_k * 1 + sum_{i!=k} y_i * 0
//          = y_k ✓

// Derivation from first principles:
//
//   Need: polynomial f with f(x_i) = y_i for n points
//
//   Idea: construct "indicator" polynomials L_i
//         that pick out exactly the i-th point
//
//   To make L_i(x_j) = 0 for j != i:
//     L_i(x) must have roots at all x_j, j != i
//     → L_i(x) = c * prod_{j!=i}(x - x_j)
//
//   To make L_i(x_i) = 1:
//     1 = c * prod_{j!=i}(x_i - x_j)
//     c = 1 / prod_{j!=i}(x_i - x_j)
//
//   Hence: L_i(x) = prod_{j!=i} (x - x_j) / (x_i - x_j)
//
//   Then f(x) = sum y_i * L_i(x) interpolates!

// Example: 3 points
//
//   Points: (0, 1), (1, 3), (2, 2)
//
//   L_0(x) = (x-1)(x-2) / (0-1)(0-2)
//         = (x^2 - 3x + 2) / 2
//
//   L_1(x) = (x-0)(x-2) / (1-0)(1-2)
//         = x(x-2) / (-1)
//         = -x^2 + 2x
//
//   L_2(x) = (x-0)(x-1) / (2-0)(2-1)
//         = x(x-1) / 2
//         = (x^2 - x) / 2
//
//   f(x) = 1 * L_0 + 3 * L_1 + 2 * L_2
//        = (x^2-3x+2)/2 - 3x^2+6x + (x^2-x)
//        = (x^2-3x+2)/2 - 3x^2+6x + x^2-x
//        = (1/2)x^2 - (3/2)x + 1 - 2x^2 + 5x
//        = (-3/2)x^2 + (7/2)x + 1
//
//   Verify:
//     f(0) = 1 ✓
//     f(1) = -1.5 + 3.5 + 1 = 3 ✓
//     f(2) = -6 + 7 + 1 = 2 ✓

// Computational aspects:
//
//   Naive: O(n^2) multiplications per evaluation
//
//   Precompute denominators:
//     den_i = prod_{j!=i}(x_i - x_j)
//     O(n^2) total precomputation
//     Then each L_i(x) is O(n)
//
//   Barycentric form:
//     f(x) = (sum w_i*y_i/(x-x_i)) / (sum w_i/(x-x_i))
//       where w_i = 1/den_i
//     More stable, still O(n) per eval

// Special case: unity roots domain
//
//   Points: {1, omega, omega^2, ..., omega^{n-1}}
//
//   den_i = prod_{j!=i}(omega^i - omega^j)
//         = n * omega^{-i}  (after simplification)
//
//   L_i(x) = (x^n - 1) / (n * omega^{-i} * (x - omega^i))
//          = omega^i * (x^n - 1) / (n * (x - omega^i))
//
//   Compact form used in PLONK/STARK!

// Matrix form:
//
//   Lagrange interpolation solves Vandermonde system:
//     V * a = y
//     where V[i][j] = x_i^j
//           a = coefficients vector
//           y = evaluation vector
//
//   a = V^{-1} * y
//
//   For unity roots: V is the FFT matrix
//   V^{-1} is (1/n) * conjugate(V)
//   → FFT/IFFT gives O(n log n) interpolation

// In ZK circuits:
//
//   Selector polynomials:
//     q(x) = sum_i q_i * L_i(x)
//     q_i = value at gate i
//     L_i(x) = evaluates to 1 only at omega^i
//
//   Copy constraints (PLONK):
//     permutation polynomial sigma(X)
//     expressed as multiple Lagrange polynomials
//
//   Trace column (STARK):
//     trace[j] at step j
//     interpolated over execution domain

// Numerical stability (floating point):
//
//   Naive formula: can be unstable
//   Barycentric formula: more stable
//   Modified Lagrange (Higham): best stability
//
//   In finite fields: no floating point issues
//   All exact arithmetic in F_p`}
        </pre>
      </div>
    </section>
  );
}

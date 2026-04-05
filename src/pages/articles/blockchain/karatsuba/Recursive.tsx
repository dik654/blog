import RecursiveViz from './viz/RecursiveViz';

export default function Recursive() {
  return (
    <section id="recursive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        재귀 적용: Fp2 &rarr; Fp6 &rarr; Fp12 타워
      </h2>
      <div className="not-prose mb-8"><RecursiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Karatsuba는 한 층에서만 적용되는 기법이 아니다.
          <br />
          확장체 타워의 <strong>각 층</strong>에서 재귀적으로 적용된다.
        </p>
        <p>
          Fp2 곱셈에서 Fp 곱셈 4회 &rarr; 3회. Fp6 곱셈에서 Fp2 곱셈 9회 &rarr; 6회.
          <br />
          Fp12 곱셈에서 Fp6 곱셈 4회 &rarr; 3회.
          <br />
          각 단계의 절감이 곱해져서, 최종적으로 Fp12 곱셈 한 번에 필요한 Fp 곱셈이
          <strong> 144회에서 54회</strong>로 줄어든다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 타워 재귀 적용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tower Field Karatsuba Application
//
// BN254 tower:
//   Fp → Fp2 = Fp[u]/(u^2 + 1)
//   Fp2 → Fp6 = Fp2[v]/(v^3 - (u+9))
//   Fp6 → Fp12 = Fp6[w]/(w^2 - v)
//
// BLS12-381 tower:
//   Fp → Fp2 = Fp[u]/(u^2 + 1)
//   Fp2 → Fp6 = Fp2[v]/(v^3 - (u+1))
//   Fp6 → Fp12 = Fp6[w]/(w^2 - v)

// Level 1: Fp2 Karatsuba
//   Fp2 mult = 3 Fp mults + adds (vs 4 naive)
//   Fp2 square = 2 Fp squares + adds

// Level 2: Fp6 Karatsuba
//   Fp6 element: (a, b, c) where each is Fp2
//   Fp6 mult = multiply (a+bv+cv^2)(d+ev+fv^2)
//
//   Naive: 9 Fp2 mults
//     a*d, a*e, a*f, b*d, b*e, b*f, c*d, c*e, c*f
//     Then combine with v^2 reduction (v^3 = u+1)
//
//   Karatsuba-Toom:
//     v0 = a*d
//     v1 = b*e
//     v2 = c*f
//     v3 = (a+b)(d+e) - v0 - v1  // gives a*e + b*d
//     v4 = (b+c)(e+f) - v1 - v2  // gives b*f + c*e
//     v5 = (a+c)(d+f) - v0 - v2  // gives a*f + c*d
//     6 mults total!
//     Then: c0 = v0 + (v4)(u+1)
//           c1 = v3 + v2*(u+1)
//           c2 = v1 + v5
//     (multiply-by-(u+1) is cheap, just a permutation)
//
//   Saved: 9 → 6 Fp2 mults

// Level 3: Fp12 Karatsuba
//   Fp12 element: (a, b) where each is Fp6
//   Fp12 mult = multiply (a + b*w)(c + d*w)
//   w^2 = v, so (bw)(dw) = bd*v (scale by v)
//
//   Naive: 4 Fp6 mults
//     ac, ad, bc, bd
//
//   Karatsuba:
//     v0 = a*c
//     v1 = b*d
//     v2 = (a+b)(c+d) - v0 - v1  // a*d + b*c
//     c0 = v0 + v1 * v   // multiply by v (cheap, shift)
//     c1 = v2
//     3 Fp6 mults total
//
//   Saved: 4 → 3 Fp6 mults

// Total savings (multiplicative):
//
//   Fp12 mult (naive):
//     4 Fp6 mults
//     × 9 Fp2 mults per Fp6
//     × 4 Fp mults per Fp2
//     = 144 Fp mults
//
//   Fp12 mult (Karatsuba at all levels):
//     3 Fp6 mults
//     × 6 Fp2 mults per Fp6
//     × 3 Fp mults per Fp2
//     = 54 Fp mults
//
//   Improvement: 144 / 54 = 2.67x

// Squaring savings:
//
//   Fp12 squaring (naive): 144 Fp mults
//   Fp12 squaring (Karatsuba): ~36 Fp mults
//     (special formulas for squaring)
//   Improvement: 4x
//
//   Used in:
//     Final exponentiation (~200 squarings in BN254)
//     Massive cumulative savings

// Fp12 multiplication in Miller loop:
//
//   BN254 Miller loop: 254 iterations
//   Each iteration:
//     - 1 line function eval (sparse Fp12)
//     - 1 Fp12 mult (full)
//     - 1 Fp12 squaring
//
//   Naive cost: 254 * (144 + 144 + sparse_cost) ≈ 80000 Fp mults
//   Karatsuba cost: 254 * (54 + 36 + sparse_cost) ≈ 28000 Fp mults
//   Factor: ~2.8x speedup

// Sparse multiplication (line functions):
//
//   Line function L = l0 + l1*w (only 2 Fp6 parts out of 2)
//   Sparse * Full mult:
//     Normal Fp12 mult: 3 Fp6 mults
//     Sparse mult: 2 Fp6 mults (l0 * f0 skipped or zero)
//
//   Additional 33% speedup in Miller loop

// Actual BLST performance (BLS12-381):
//
//   Fp mult:      ~80 ns (256-bit)
//   Fp2 mult:     ~250 ns (3 Fp mults + adds)
//   Fp6 mult:     ~1700 ns (6 Fp2 mults)
//   Fp12 mult:    ~5300 ns (3 Fp6 mults)
//   Fp12 square:  ~3500 ns (fewer mults)
//
//   Single pairing: ~1.5 ms on modern x86
//   With MSM optimizations: ~0.8 ms possible

// Further optimizations:
//
//   1. Lazy reduction
//      Keep intermediate values unreduced
//      Reduce only at final result
//      Saves 20-30% more
//
//   2. Cyclotomic subgroup squaring
//      For final exponentiation
//      Fp12 cyclotomic squaring: 9 Fp mults
//      vs 36 generic → 4x more savings
//
//   3. Frobenius precomputation
//      Powers of Frobenius operator
//      Used in final exponentiation`}
        </pre>
      </div>
    </section>
  );
}

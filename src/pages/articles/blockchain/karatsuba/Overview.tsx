import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 Karatsuba인가?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fp2 곱셈을 4번 &rarr; 3번으로 25% 절감. 타워에서 재귀 적용하면 144 &rarr; 54.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba 알고리즘 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Karatsuba Multiplication
//
// History:
//   1960: Anatoly Karatsuba (Soviet mathematician)
//   Proved O(n^log2(3)) ≈ O(n^1.585) integer multiplication
//   First proven sub-quadratic algorithm for multiplication
//   Overturned Kolmogorov's conjecture that O(n^2) was optimal
//
// Applications:
//   1. Big integer multiplication (GMP library)
//   2. Polynomial multiplication
//   3. Finite field extension multiplications
//   4. Elliptic curve pairings (BN254, BLS12-381)
//   5. Post-quantum crypto (lattice schemes)

// Core idea:
//
//   Naive multiplication of two 2-digit numbers:
//     (a + b*10) * (c + d*10)
//     = a*c + (a*d + b*c)*10 + b*d*100
//     → 4 single-digit multiplications
//
//   Karatsuba trick:
//     (a+b) * (c+d) = a*c + a*d + b*c + b*d
//     Therefore: a*d + b*c = (a+b)(c+d) - a*c - b*d
//     Replace 4 mults with 3 mults + extra adds
//
//   Saved: 1 multiplication (25% reduction per level)
//   Added: 2 additions, 2 subtractions (small cost)

// Recursive version for n-digit numbers:
//
//   T(n) = 3*T(n/2) + O(n)     [Karatsuba]
//        = O(n^log2(3))
//        ≈ O(n^1.585)
//
//   vs naive:
//     T(n) = 4*T(n/2) + O(n)
//          = O(n^2)

// For pairings in BN254/BLS12-381:
//
//   Extension field tower:
//     Fp → Fp2 → Fp6 → Fp12
//
//   Each level: multiply via naive vs Karatsuba
//
//   Without Karatsuba:
//     Fp12 = 2*Fp6 components, each naive → 4 Fp6 mults
//     Fp6  = 3*Fp2 components, each naive → 9 Fp2 mults
//     Fp2  = 2*Fp  components, each naive → 4 Fp mults
//     Total: 4 * 9 * 4 = 144 Fp multiplications
//
//   With Karatsuba:
//     Fp12: 3 Fp6 mults (vs 4)
//     Fp6:  6 Fp2 mults (vs 9)
//     Fp2:  3 Fp  mults (vs 4)
//     Total: 3 * 6 * 3 = 54 Fp multiplications
//
//   Savings: 144 → 54, i.e., 62% reduction
//   Key to fast pairing-based cryptography

// When Karatsuba wins:
//
//   Small inputs (n=2,3): barely any benefit
//     overhead of adds dominates
//
//   Medium inputs (n=8-32): big win
//     typical for field multiplication
//
//   Large inputs (n=1000+): overtaken by:
//     Toom-Cook (n^log_k(2k-1))
//     Schönhage-Strassen (n log n log log n)
//     Fürer's algorithm (n log n 2^O(log* n))

// Variants of Karatsuba:
//
//   Standard Karatsuba: 3 mults per 2-split
//
//   Toom-3 (Toom-Cook 3-way):
//     5 mults per 3-split instead of 9
//     Better for very large inputs
//
//   Toom-4:
//     7 mults per 4-split instead of 16
//     Used in production GMP for huge numbers

// Practical issues:
//
//   1. Overflow during intermediate adds
//      (a+b) may exceed 2^n for n-bit inputs
//      Solution: reserve 1 extra bit
//
//   2. Cache behavior
//      Recursive algorithm may thrash
//      Inline small base cases (n < 16 typical)
//
//   3. Negative intermediates
//      (a+b)(c+d) - ac - bd can underflow
//      Use signed arithmetic or careful unsigned`}
        </pre>
      </div>
    </section>
  );
}

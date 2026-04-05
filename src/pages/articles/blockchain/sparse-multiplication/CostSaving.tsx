import CostViz from './viz/CostViz';

export default function CostSaving() {
  return (
    <section id="cost-saving" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full vs Sparse 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 번의 Fp12 곱셈에서 Full은 54 Fp곱, Sparse는 18 Fp곱이다.<br />
          차이는 <strong>36 Fp곱</strong>이고, 절감률은 67%다.
        </p>
        <p>
          이 절감은 단순 이론이 아니다.<br />
          실제 구현체(gnark, arkworks, py_ecc)에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          함수는 Full{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul
          </code>{' '}
          대비 약 3배 빠르다.
        </p>
        <p>
          Karatsuba가 곱셈 횟수를 144에서 54로 줄였다면,
          sparse 구조는 54에서 18로 한 번 더 줄인다.<br />
          두 최적화는 독립적으로 작동하며, 함께 적용된다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">비용 비교 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Full vs Sparse Fp12 Multiplication
//
// Reference: cost in Fp multiplications (m)
//
// Level 1: Fp2 operations
//   Fp2 mult:  3m (Karatsuba)
//   Fp2 sq:    2m (special squaring)
//   Fp2 add:   1s (addition)
//
// Level 2: Fp6 operations
//   Fp6 mult (dense):  6 * Fp2_mult = 18m (Karatsuba-Toom)
//   Fp6 sq (dense):    ~15m (slightly cheaper than mult)
//   Fp6 mul_by_01:     13m (partially sparse)
//   Fp6 mul_by_1:      7m (very sparse, only v coefficient)
//
// Level 3: Fp12 operations
//   Fp12 mult (dense):   ~54m (3 Fp6 mults)
//   Fp12 sq (cyclotomic): ~18m (in GT subgroup)
//   Fp12 sq (generic):    ~36m (2 Fp6 squares)
//   Fp12 mul_by_034:     ~39m (sparse line mult)
//   Fp12 mul_by_014:     ~39m (alt sparse pattern)
//   Fp12 mul_034_by_034: ~46m (two sparse combined)

// Cost per Miller loop iteration:
//
//   Doubling step (always):
//     f = f^2 * l_{T,T}(P)
//     Costs:
//       f^2 (cyclotomic sq): 18m
//       compute line: 15m (depends on curve)
//       f * line (sparse): 39m
//     Total: ~72m
//
//   Addition step (at 1-bits of loop counter):
//     f = f * l_{T,Q}(P)
//     Costs:
//       compute line: 20m
//       f * line (sparse): 39m
//     Total: ~59m

// Complete BN254 pairing cost:
//
//   Miller loop parameters:
//     Loop counter: 6*x + 2 where x = 4965661367192848881
//     Hamming weight: ~30 (approximate)
//     Total iterations: ~64
//
//   Cost breakdown (using sparse optimization):
//     64 doublings × 72m = 4608m
//     30 additions × 59m = 1770m
//     Total Miller loop: ~6400m
//
//   Final exponentiation:
//     easy part: ~100m
//     hard part: ~3000m (cyclotomic squares)
//
//   Total pairing: ~9500m = ~0.19 ms @ 20ns/Fp mult

// Without sparse optimization (imaginary scenario):
//
//   64 doublings × (18 + 15 + 54) = 5568m
//   30 additions × (20 + 54) = 2220m
//   Total Miller loop: ~7800m
//
//   Savings from sparse: ~1400m
//   Percentage: ~18% on Miller loop
//   Percentage on total pairing: ~15%

// Real benchmark numbers:
//
//   BLS12-381 pairing on x86:
//     blst (C + asm): 0.7 ms
//     arkworks (Rust): 1.2 ms
//     Go crypto (native): 1.4 ms
//     py_ecc (Python): 600 ms
//
//   BN254 on geth (EVM precompile):
//     Gas cost: 34,000 + 34,000*k
//     Corresponds to: ~0.5 ms per pairing
//
//   Pairing dominates ZK-SNARK verification:
//     Groth16 verify: 3 pairings = ~2 ms
//     BLS signature verify: 2 pairings = ~1.5 ms

// Algorithm choices affecting sparse:
//
//   Ate pairing (standard):
//     Uses standard Miller loop
//     Sparse line functions apply
//     Dominant in practice
//
//   Optimal ate pairing:
//     Shorter loop
//     Still uses sparse mults
//     Faster overall
//
//   R-ate pairing:
//     Even shorter
//     Complex structure
//     Research-only typically

// Sparse mult research directions:
//
//   Lazy reduction:
//     Delay modular reduction
//     Avoids intermediate mods
//     +10-20% speedup
//
//   SIMD sparse mults:
//     Parallel Fp2 ops
//     AVX-512 pipelines
//     Implementation-specific
//
//   GPU batching:
//     Many independent pairings
//     Amortize sparse loop over batch
//     CUDA implementations (ICICLE)`}
        </pre>
      </div>
    </section>
  );
}

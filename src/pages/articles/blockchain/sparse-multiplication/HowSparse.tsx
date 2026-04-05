import HowSparseViz from './viz/HowSparseViz';

export default function HowSparse() {
  return (
    <section id="how-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        어떤 슬롯끼리 곱해지는가
      </h2>
      <div className="not-prose mb-8"><HowSparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Full Fp12 곱셈은 12개 슬롯 x 12개 슬롯 = 144개 항을 계산한다.<br />
          Karatsuba 최적화를 적용해도 <strong>54 Fp곱</strong>이 필요하다.
        </p>
        <p>
          Sparse 곱셈에서는 l(P)의 non-zero 슬롯이 3개뿐이다.
          0인 슬롯과의 곱은 항상 0이므로 건너뛸 수 있다.<br />
          실제 계산해야 할 항은 <strong>12 x 3 = 36개</strong>다.
        </p>
        <p>
          이 36개 항에 Karatsuba 트릭을 추가 적용하면{' '}
          <strong>18 Fp곱</strong>까지 줄어든다.<br />
          구현 코드에서는{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          같은 이름으로 sparse 곱셈 전용 함수를 제공한다.
          "034"는 non-zero인 슬롯 인덱스를 뜻한다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">mul_by_034 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sparse Fp12 Multiplication (mul_by_034)
//
// Fp12 element structure:
//   f = c0 + c1*w  (Fp6 + Fp6*w)
//     where w^2 = v (degree-2 extension)
//
//   c0 = a0 + a1*v + a2*v^2   (Fp2 + Fp2*v + Fp2*v^2)
//   c1 = b0 + b1*v + b2*v^2
//
//   Total: 12 Fp coefficients (6 Fp2 elements)
//
// Sparse line function:
//   l = l0 + l3*w + l4*w*v
//   (only these 3 Fp2 components nonzero)
//
//   Naming: "034" from positions 0, 3, 4 in Fp12 array

// Dense Fp12 * Dense Fp12:
//
//   (a0 + a1*w)(b0 + b1*w)
//   = (a0*b0 + a1*b1*v) + (a0*b1 + a1*b0)*w
//
//   Needs:
//     a0*b0: Fp6 mult = 6 Fp2 mults
//     a1*b1: Fp6 mult = 6 Fp2 mults
//     (a0+a1)*(b0+b1) - ...: 6 Fp2 mults (Karatsuba)
//
//   Total: 18 Fp2 mults = 54 Fp mults

// Sparse multiply (l has only 3 nonzero Fp2):
//
//   l = l0 + l3*w + l4*w*v = (l0 + l4*w*v) + l3*w
//
//   Match structure with Fp12 element:
//     Split as: l_c0 = l0 + l4*v, l_c1 = l3
//       (but l_c0 has only 2 nonzero Fp2 positions out of 3)
//       (and l_c1 has only 1 nonzero Fp2 position)
//
//   f * l = (f_c0 * l_c0 + f_c1 * l_c1 * v)
//         + (f_c0 * l_c1 + f_c1 * l_c0) * w
//
//   Each term computed with knowledge of sparsity

// Specific computation:
//
//   Given f = (f00, f01, f02, f10, f11, f12) (Fp2 components)
//   Given l = (l00, 0, 0, 0, l10, l11) [the 034 pattern]
//     or equivalent: l_c0 = (l00, 0, 0), l_c1 = (0, l10, l11)
//
//   f_c0 * l_c0:
//     Only l00 nonzero → result = (f00*l00, f01*l00, f02*l00)
//     3 Fp2 mults
//
//   f_c1 * l_c1:
//     l10, l11 nonzero (2 of 3)
//     5 Fp2 mults (with Karatsuba)
//
//   f_c0 * l_c1:
//     Sparse mult → 5 Fp2 mults
//
//   f_c1 * l_c0:
//     Only l00 nonzero → 3 Fp2 mults
//
//   Total: 3 + 5 + 5 + 3 = 16 Fp2 mults? Hmm.
//   With more clever Karatsuba: can hit 13 Fp2 mults
//   = ~39 Fp mults (better than 54 dense)

// Industry-standard implementations:
//
//   arkworks/algebra/ec/models/bn/pairing.rs:
//     fn mul_by_034(self, c0, c3, c4) -> Self {
//       let a = self.c0 * Fp6::new(c0, 0, 0);
//       let b = self.c1 * Fp6::new(c3, c4, 0);
//       let c0 = Fp6::mul_by_nonresidue(b) + a;
//       let c1 = (self.c0 + self.c1) * Fp6::new(c0 + c3, c4, 0) - a - b;
//       Self { c0, c1 }
//     }
//
//   Uses Karatsuba at Fp12 level with sparse inputs

// Further optimization: 01234:
//
//   When multiplying TWO sparse elements
//   Result has 5 nonzero positions (01234)
//   Even cheaper than sparse * dense
//
//   Used when computing:
//     l_1 * l_2  before multiplying with f
//
//   Saves one extra multiplication cost

// Precomputation for G_2:
//
//   Line coefficients precomputed once per pairing
//   Can store them as Fp2 triples (not Fp12)
//
//   Saves memory + enables cache-friendly access
//
//   struct PrecomputedG2 {
//       lines: Vec<(Fp2, Fp2, Fp2)>,  // (l0, l1, l2) per iter
//   }
//
//   Total precompute: ~64 entries for BN254 pairing

// Performance impact:
//
//   Dense line mult: ~55 ns (CPU, BN254)
//   Sparse mul_by_034: ~20 ns
//   Speedup: 2.7x per mult
//
//   Over full Miller loop:
//     64 iterations × 2 mults = 128 line mults
//     Savings: 128 × 35 ns = 4.5 ms? (too much)
//     Realistic: 1-2 ms savings per pairing

// Asymmetric pairings use special forms:
//
//   Type-3 pairing (asymmetric):
//     P in G_1 (Fp), Q in G_2 (Fp2)
//     Line function sparse in Fp12
//
//   Type-1 pairing (symmetric, unused in practice):
//     P, Q both in G_1
//     Line function NOT sparse
//     → Type-3 is always preferred`}
        </pre>
      </div>
    </section>
  );
}

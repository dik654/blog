import TrickViz from './viz/TrickViz';

export default function KaratsubaTrick() {
  return (
    <section id="karatsuba-trick" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Karatsuba 트릭: 3회로 줄이기</h2>
      <div className="not-prose mb-8"><TrickViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핵심 관찰: ad + bc = (a+b)(c+d) - ac - bd.
          <br />
          ac와 bd는 실수부 계산에 이미 필요하므로 <strong>재사용</strong>할 수 있다.
        </p>
        <p>
          곱셈은 3번(ac, bd, (a+b)(c+d))만 수행하고,
          나머지는 덧셈과 뺄셈으로 해결한다.
          <br />
          덧셈이 2회 더 늘어나지만, 곱셈 1회를 절약하는 것이 훨씬 이득이다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba Fp2 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Karatsuba Fp2 Multiplication (3-mult)
//
// Starting point:
//   z1 = a1 + b1*u
//   z2 = a2 + b2*u
//   Want: z1 * z2 = real + imag*u
//
// Naive (4 mults):
//   real = a1*a2 - b1*b2
//   imag = a1*b2 + a2*b1
//
// Karatsuba observation:
//   (a1 + b1)(a2 + b2) = a1*a2 + a1*b2 + a2*b1 + b1*b2
//
//   Rearrange to isolate the "cross" terms:
//   a1*b2 + a2*b1 = (a1+b1)(a2+b2) - a1*a2 - b1*b2
//
//   So if we already have a1*a2 and b1*b2, we get
//   (a1*b2 + a2*b1) "for free" using one more mult and some subs.

// Algorithm (3 mults):
//
//   fn fp2_mul_karatsuba(
//       a1: Fp, b1: Fp,
//       a2: Fp, b2: Fp
//   ) -> (Fp, Fp) {
//       let t1 = a1 * a2;         // mult #1 (call it v0)
//       let t2 = b1 * b2;         // mult #2 (call it v1)
//       let s1 = a1 + b1;
//       let s2 = a2 + b2;
//       let t3 = s1 * s2;         // mult #3 (expensive)
//
//       let real = t1 - t2;       // a1*a2 - b1*b2
//       let imag = t3 - t1 - t2;  // (a1+b1)(a2+b2) - a1*a2 - b1*b2
//                                 // = a1*b2 + a2*b1
//
//       (real, imag)
//   }

// Cost accounting:
//
//   Naive: 4 mults, 2 add/sub
//   Karatsuba: 3 mults, 2 add + 3 sub = 5 add/sub
//
//   Net savings per Fp2 mult:
//     -1 mult (~20 cycles)
//     +3 add/sub (~9 cycles)
//   Net: ~11 cycles saved per Fp2 mult

// Squaring optimization (even better):
//
//   When z1 = z2, we can do SPECIAL squaring:
//     z^2 = (a + b*u)^2
//         = a^2 + 2*a*b*u + b^2*u^2
//         = (a^2 - b^2) + 2*a*b*u
//
//   Only 2 mults needed!
//     t1 = a + b
//     t2 = a - b
//     t3 = t1 * t2 = a^2 - b^2  (1 mult)
//     imag = 2 * a * b          (1 mult)
//     real = t3
//
//   Or Karatsuba-style squaring:
//     t1 = a*a
//     t2 = b*b
//     t3 = (a+b)^2 = a^2 + 2ab + b^2
//     imag = t3 - t1 - t2 = 2ab
//   (3 squares, no mults)
//
//   Squares are ~15% faster than mults on modern CPUs

// Full implementation (arkworks-like):
//
//   impl Fp2 {
//       fn mul(&self, other: &Self) -> Self {
//           // Karatsuba
//           let v0 = self.c0 * other.c0;
//           let v1 = self.c1 * other.c1;
//
//           let c0 = v0 - v1;  // note: u^2 = -1
//           let c1 = (self.c0 + self.c1) * (other.c0 + other.c1)
//                    - v0 - v1;
//
//           Self { c0, c1 }
//       }
//   }

// Generalization to different u^2:
//
//   Fp2 = Fp[u] / (u^2 - beta)
//   where beta could be -1, -2, -5, etc.
//
//   For beta = -1 (BN254, BLS12-381):
//     c0 = v0 - v1
//
//   For beta = -5 (some curves):
//     c0 = v0 + 5*v1  (after sign flip)
//     Mult by small constant is cheap
//
//   For beta = NQR (non-quadratic residue):
//     Construction depends on field choice

// Karatsuba in assembly:
//
//   hand-written .asm for critical paths
//   BLST library (Supranational):
//     ~20% faster Fp2 mult than Rust intrinsics
//     Careful register allocation
//     Pipelined Montgomery reduction`}
        </pre>
      </div>
    </section>
  );
}

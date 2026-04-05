import NaiveViz from './viz/NaiveViz';

export default function NaiveMul() {
  return (
    <section id="naive-mul" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Naive 곱셈: 4회 방식</h2>
      <div className="not-prose mb-8"><NaiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          (a+bu)(c+du)를 전개하면 ac + adu + bcu + bdu²가 된다.
          <br />
          여기서 u² = -1을 대입하면 실수부는 ac - bd, 허수부는 ad + bc다.
        </p>
        <p>
          총 <strong>4번의 Fp 곱셈</strong>과 2번의 Fp 덧셈/뺄셈이 필요하다.
          <br />
          Fp 곱셈 한 번은 256-bit 정수의 Montgomery 곱셈이므로 비용이 크다.
          <br />
          덧셈은 곱셈 대비 약 1/10의 비용이다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Naive Fp2 곱셈 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Naive Fp2 Multiplication (4-mult schoolbook)
//
// Fp2 = Fp[u] / (u^2 + 1)
//   where Fp is the base prime field
//   u^2 = -1 (imaginary unit)
//
// Element representation:
//   z = a + b*u  where a, b in Fp
//   z1 = a1 + b1*u
//   z2 = a2 + b2*u
//
// Product:
//   z1 * z2 = (a1 + b1*u)(a2 + b2*u)
//           = a1*a2 + a1*b2*u + a2*b1*u + b1*b2*u^2
//           = a1*a2 + (a1*b2 + a2*b1)*u + b1*b2*(-1)
//           = (a1*a2 - b1*b2) + (a1*b2 + a2*b1)*u
//
// Result:
//   real part: a1*a2 - b1*b2   (1 sub + 2 mults)
//   imag part: a1*b2 + a2*b1   (1 add + 2 mults)
//   Total: 4 mults + 2 add/sub

// Rust pseudocode (naive):
//
//   fn fp2_mul_naive(
//       a1: Fp, b1: Fp,
//       a2: Fp, b2: Fp
//   ) -> (Fp, Fp) {
//       let t1 = a1 * a2;  // mult #1
//       let t2 = b1 * b2;  // mult #2
//       let t3 = a1 * b2;  // mult #3
//       let t4 = a2 * b1;  // mult #4
//
//       let real = t1 - t2;
//       let imag = t3 + t4;
//
//       (real, imag)
//   }

// Performance on modern CPU:
//
//   Fp multiplication (256-bit field):
//     ~18-25 cycles on x86_64 (with BMI2, ADX)
//     Uses Montgomery multiplication
//     Eliminates division with specific field reduction
//
//   Fp addition/subtraction (256-bit field):
//     ~2-3 cycles
//     Add + conditional subtract for reduction
//
//   Ratio: 1 Fp mult = 8-10 Fp adds
//   Therefore: reducing mults is THE key optimization

// Why Montgomery multiplication?
//
//   Traditional: a * b then reduce mod p
//     Division is ~100 cycles (very slow)
//
//   Montgomery: represent x as x*R mod p
//     where R = 2^256 for 256-bit fields
//     Multiplication becomes add-and-shift
//     No division needed!
//
//   Fp mult via Montgomery:
//     1. schoolbook 256-bit * 256-bit = 512-bit
//     2. Montgomery reduction (shifts + mults)
//     3. Conditional subtract to stay < p
//
//   Total: ~18 cycles (vs 100+ for naive)

// Impact on pairings:
//
//   Miller loop in BN254:
//     254 iterations
//     Each iteration: multiple Fp12 multiplications
//
//   Fp12 = (Fp6)^2 = (Fp2^3)^2
//
//   Naive chain:
//     Fp12 mult = 4 * Fp6 mult
//                = 4 * 9 * Fp2 mult
//                = 4 * 9 * 4 * Fp mult
//                = 144 Fp mults
//
//   Per iteration: ~2-3 Fp12 mults + sq
//   Total mults in pairing: ~300-400 Fp12 = ~50,000 Fp mults
//   At 20 cycles each: ~1ms pairing time
//
//   With Karatsuba: 3x fewer mults → 0.35ms

// SIMD vectorization (Fp2-level):
//
//   AVX-512 can process 8 x 64-bit ops per instruction
//   BN254 modulus = 4 limbs (64-bit each)
//   → 2 Fp elements fit in one AVX-512 register
//
//   Fp2 mult can use parallel schoolbook:
//     compute a1*a2, b1*b2 in parallel
//     compute a1*b2, a2*b1 in parallel
//
//   Practical speedup: 1.5-2x over scalar
//   Used in: arkworks, Geth BN254 precompile`}
        </pre>
      </div>
    </section>
  );
}

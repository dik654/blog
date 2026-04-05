import ScalarViz from './viz/ScalarViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Scalar({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="scalar" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fr 스칼라 필드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Fr은 BN254 곡선의 위수(order) r로 정의된 필드
          <br />
          Fp와 100% 동일한 구조 — 다른 것은 모듈러스(p vs r) 하나뿐
          <br />
          define_prime_field! 매크로에 상수만 넣으면 전체 산술 자동 생성
        </p>
        <p className="leading-7">
          ZK 증명에서 Fr의 역할: R1CS witness, QAP 다항식 계수, 증명 원소
          <br />
          Groth16/PLONK 프로버가 수행하는 모든 다항식 연산이 Fr 위에서 이루어짐
        </p>
      </div>
      <div className="not-prose mb-8">
        <ScalarViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Fp를 수동 구현(학습용)하고, Fr은 매크로로 재사용 — 코드 400줄 → 40줄
          <br />
          다른 곡선(BLS12-381 등)으로 전환 시 상수만 교체하면 됨
          <br />
          매크로 내부에서 INV를 Newton법으로 컴파일 타임 자동 계산 — 수동 계산 불필요
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Scalar Field와 Base Field 구분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Scalar Field (Fr) vs Base Field (Fp)
//
// Elliptic curve basics:
//   Curve E defined over base field F_p
//     Points P = (x, y) with x, y in F_p
//   Curve has order #E(F_p) = N (approximately p)
//   Largest prime factor of N: r (= curve order)
//   Scalar field F_r has r elements
//
// For BN254:
//   Base field: F_p where p ≈ 2^254
//   Scalar field: F_r where r ≈ 2^254
//   p != r (but similar magnitude)

// Two fields, two uses:
//
//   F_p (base field):
//     Coordinate arithmetic
//     Point addition, doubling
//     Line function evaluation
//     Pairing intermediate results (via Fp2/6/12)
//
//   F_r (scalar field):
//     Scalar multiplication: s * P
//     Group order of curve
//     Witness values in ZK circuits
//     Polynomial coefficients

// Why two fields?
//
//   Elliptic curve group:
//     (E, +) has prime order r
//     Scalars live in F_r (act on curve points)
//
//   Field for coordinates:
//     Separate from the group order
//     Determined by curve equation

// BN254 concrete values:
//
//   p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
//   r = 21888242871839275222246405745257275088548364400416034343698204186575808495617
//
//   Note:
//     Both ~2^254
//     p-1 has 2-adicity 1 (only divisible by 2 once)
//     r-1 has 2-adicity 28 (highly 2-smooth!)
//
//   → r-1 is FFT-friendly (large power-of-2 subgroup)
//   → r is the "scalar field for ZK"

// Why r-1 must be 2-smooth (for ZK):
//
//   NTT needs n | (p-1) where n is transform size
//   For ZK circuits with m constraints:
//     Need n = m rounded up to power of 2
//     Typically n = 2^20 to 2^28
//   r-1 = 2^28 * 3^2 * 13 * ... enables NTT up to 2^28

// Macro-based reuse:
//
//   // Once: generate Fp via macro
//   define_prime_field! {
//     struct Fp(pub [u64; 4]);
//     P = [0x3c208c16d87cfd47, 0x97816a916871ca8d,
//          0xb85045b68181585d, 0x30644e72e131a029];
//     INV = 0x87d20782e4866389;
//     R2 = [...];
//   }
//
//   // Also: Fr reuses macro with different constants
//   define_prime_field! {
//     struct Fr(pub [u64; 4]);
//     P = [0x43e1f593f0000001, 0x2833e84879b97091,
//          0xb85045b68181585d, 0x30644e72e131a029];
//     INV = 0xc2e1f593efffffff;
//     R2 = [...];
//   }

// Generic implementation (arkworks pattern):
//
//   trait Field:
//     + Add<Output = Self>
//     + Mul<Output = Self>
//     + Neg<Output = Self>
//     + Inv<Output = Option<Self>>
//     + From<u64>
//     { ... }
//
//   impl Field for Fp { ... }
//   impl Field for Fr { ... }
//
//   // Higher-level algorithms generic over field
//   fn polynomial_evaluate<F: Field>(
//     coeffs: &[F],
//     x: F
//   ) -> F { ... }

// Switching curves (BLS12-381):
//   struct BlsFp(pub [u64; 6]);  // 381-bit, 6 limbs
//   struct BlsFr(pub [u64; 4]);  // 255-bit, 4 limbs
//
//   Same macro, different constants
//   Everything else works automatically

// Critical invariants to enforce:
//   - Values always reduced mod p (or r)
//   - Constant-time operations (no branches on secrets)
//   - Montgomery form consistency
//   - Type safety: can't mix Fp and Fr values

// Common pitfalls:
//   1. Scalar mult with wrong field:
//      s * P where s is in Fp instead of Fr
//      Result might still compute, but mathematically wrong
//   2. Forgetting to reduce:
//      After subtraction, could be > p
//      Must do conditional subtract
//   3. Montgomery form confusion:
//      Mixing Mont-form and normal values
//      Type-level distinction helps

// Benchmarks (single thread, AMD Zen 3):
//
//   Fp (BN254, 254-bit):
//     add:   ~2 ns
//     mult:  ~18 ns
//     inv:   ~4000 ns (via pow)
//
//   Fr (BN254, 254-bit):
//     Same performance as Fp (same limb count)
//
//   BLS12-381 Fp (381-bit, 6 limbs):
//     add:   ~3 ns
//     mult:  ~35 ns (larger limbs)
//     inv:   ~10000 ns`}
        </pre>
      </div>
    </section>
  );
}

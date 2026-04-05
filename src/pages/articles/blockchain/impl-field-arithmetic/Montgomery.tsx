import MontViz from './viz/MontViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Montgomery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">몽고메리 곱셈</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          일반 모듈러 곱셈: (a * b) mod p — 나눗셈이 필요해 느림
          <br />
          Montgomery 해법: 수를 a * R mod p 형태로 저장하면 나눗셈을 시프트로 대체
          <br />
          R = 2^256이므로 "R로 나누기" = 256비트 오른쪽 시프트
        </p>
        <p className="leading-7">
          mont_mul = schoolbook 4x4 곱셈 + REDC(Montgomery reduction)
          <br />
          REDC의 핵심: INV 상수로 하위 limb을 0으로 만들어 제거
          <br />
          4회 반복 후 8-limb을 4-limb으로 축소 — 결과는 자동으로 mod p
        </p>
      </div>
      <div className="not-prose mb-8">
        <MontViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          INV = -p^(-1) mod 2^64 — Newton법으로 컴파일 타임에 6회 반복으로 계산
          <br />
          각 반복마다 정밀도 2배: 1 → 2 → 4 → 8 → 16 → 32 → 64비트
          <br />
          inv()가 pow(p-2)로 구현된 것도 핵심 — 확장 유클리드 없이 한 줄로 역원
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Montgomery 알고리즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Montgomery Multiplication - Detailed
//
// Problem:
//   Compute (a * b) mod p efficiently
//   Direct: multiply then divide by p (slow!)
//   Division on CPU: ~20-40 cycles
//
// Montgomery insight:
//   Work in "Montgomery form" where values are scaled by R
//   Avoid division entirely, use shifts instead

// Montgomery form:
//
//   Original value: x in [0, p)
//   Montgomery form: x_mont = x * R mod p
//     where R = 2^k (typically 2^256 for 256-bit fields)
//
//   Conversion:
//     To Mont: x_mont = mont_mul(x, R^2 mod p)
//     From Mont: x = mont_mul(x_mont, 1)
//     (both use Montgomery multiplication)

// Key algorithm: REDC (Montgomery reduction)
//
//   REDC(T) computes T * R^{-1} mod p
//     where T is a 2n-limb input (0 <= T < p * R)
//   Returns n-limb result in [0, p)
//
//   Algorithm (CIOS - Coarsely Integrated Operand Scanning):
//     for i = 0..n:
//       q = (T[i] * INV) mod 2^64     // INV = -p^{-1} mod 2^64
//       T += q * p * 2^{64*i}          // makes lower limb 0
//     result = T / R                   // discard low limbs
//     if result >= p: result -= p

// Why does REDC work?
//
//   After each iteration: T's next lower limb becomes 0
//   After n iterations: lower n limbs all 0
//   So T = (something) * R
//   Dividing by R = shift right 256 bits = discard lower limbs
//
//   Key congruence:
//     T + q*p ≡ T (mod p)  // adding multiple of p
//     T + q*p ≡ 0 (mod R)  // by choice of q = T*INV mod R

// Montgomery multiplication:
//
//   fn mont_mul(a: Fp, b: Fp) -> Fp {
//     // Step 1: schoolbook multiply
//     // Produces 2n-limb result T = a * b (< p^2 < p*R)
//     let T = big_mul(a.0, b.0);
//
//     // Step 2: Montgomery reduction
//     // Computes T * R^{-1} mod p
//     REDC(T)  // returns a*b*R^{-1} mod p
//   }
//
//   If a, b are in Montgomery form (a*R, b*R):
//     mont_mul gives (a*R) * (b*R) * R^{-1} = (a*b)*R
//     Which is (a*b) in Montgomery form!

// Computing INV constant:
//
//   INV = -p^{-1} mod 2^64
//   Used in REDC inner loop
//
//   Newton's method (doubling precision each step):
//     inv = 1
//     inv = inv * (2 - p * inv)  // mod 2^2
//     inv = inv * (2 - p * inv)  // mod 2^4
//     inv = inv * (2 - p * inv)  // mod 2^8
//     inv = inv * (2 - p * inv)  // mod 2^16
//     inv = inv * (2 - p * inv)  // mod 2^32
//     inv = inv * (2 - p * inv)  // mod 2^64
//     return -inv
//
//   Precomputed as const at compile time

// Inverse via Fermat's little theorem:
//
//   For a in F_p*: a^{p-1} = 1 (mod p)
//   Therefore: a^{p-2} = a^{-1} (mod p)
//
//   fn inv(&self) -> Self {
//     self.pow(&(P - 2))  // P is the prime
//   }
//
//   Cost: ~256 squarings + ~128 multiplications
//   = ~384 Montgomery mults
//   Constant time (good for crypto)

// Alternative: extended Euclidean
//
//   Compute gcd(a, p) = 1 and coefficients s, t
//   such that s*a + t*p = 1
//   Then s = a^{-1} (mod p)
//
//   Faster: O(log p) instead of O(log p) multiplications
//   But: NOT constant time (branches on intermediate values)

// Performance comparison:
//
//   Operation        Cycles (x86_64)
//   ------------------------------------
//   mont_mul:        ~18 (with adx/bmi2)
//   mont_sq:         ~15
//   add/sub:         ~2-3
//   inv (pow):       ~7000 (384 * 18)
//   inv (bin ext):   ~1500 (not constant-time)
//
//   Batch inversion (Montgomery trick):
//     inv(a_1), ..., inv(a_n) in one batch
//     Cost: 3(n-1) mults + 1 inv
//     ~3x speedup for n > 10

// Memory layout optimization:
//
//   Align Fp structs to 32 bytes
//   Fits in single cache line
//   Enables SIMD load instructions
//
//   #[repr(align(32))]
//   struct Fp([u64; 4]);`}
        </pre>
      </div>
    </section>
  );
}

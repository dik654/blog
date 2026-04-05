import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp 소수체 표현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254의 소수 p는 254비트 — u64 하나(64비트)로는 표현 불가
          <br />
          [u64; 4] 배열로 분할: 4 x 64 = 256비트 공간에 254비트 수를 저장
          <br />
          little-endian 배치 — limbs[0]이 최하위, limbs[3]이 최상위
        </p>
        <p className="leading-7">
          기본 빌딩 블록 세 가지: adc(add-with-carry), sbb(subtract-with-borrow), mac(multiply-accumulate)
          <br />
          이 세 함수 위에 모든 유한체 연산(+, -, *, inv, pow)을 쌓아 올림
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          sub_if_gte의 branchless 패턴 — "일단 빼보고 borrow면 원래 값"
          <br />
          조건 분기 없이 상수 시간 실행 — 타이밍 사이드채널 공격 방지
          <br />
          ZK 증명에서 필드 연산은 초당 수백만 회 — 이 수준의 최적화가 전체 성능 좌우
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Big Integer 표현 및 연산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Big Integer Field Representation
//
// Problem:
//   Cryptographic primes are 128-512 bits
//   Native CPU registers are 32 or 64 bits
//   Need to represent and compute with "big numbers"
//
// Solution: limb-based arithmetic
//   Represent 256-bit number as array of 4 x 64-bit limbs
//   Array [a0, a1, a2, a3] means:
//     N = a0 + a1*2^64 + a2*2^128 + a3*2^192

// Primitive operations:
//
//   adc (add-with-carry):
//     (sum, carry) = a + b + carry_in
//     Uses CPU's addc instruction (x86) or manual
//     Output: 64-bit sum + 1-bit carry
//
//   sbb (subtract-with-borrow):
//     (diff, borrow) = a - b - borrow_in
//     Uses CPU's sbb instruction
//     Output: 64-bit difference + 1-bit borrow
//
//   mac (multiply-accumulate):
//     (hi, lo) = a * b + c + d
//     64x64 = 128-bit product, then add c, d
//     Essential for multi-precision multiplication

// Basic field operations:
//
//   Addition (mod p):
//     sum = add_limbs(a, b)    // full add with carry chain
//     if sum >= p: sum -= p     // conditional subtract
//
//   Subtraction (mod p):
//     diff = sub_limbs(a, b)   // full sub with borrow chain
//     if borrow: diff += p      // wrap around
//
//   Multiplication (mod p):
//     product = full_mult(a, b)  // 4x4 = 8 limbs schoolbook
//     result = mod_reduce(product, p)  // Montgomery or Barrett
//
// Performance: ~20-30 CPU cycles per Fp multiplication

// Constant-time considerations:
//
//   BAD (branching):
//     if carry { result -= p; }
//
//   GOOD (branchless):
//     let mask = (borrow as i64).wrapping_neg() as u64;
//     for i in 0..4: result[i] = result[i].wrapping_add(p[i] & mask);
//
//   Why constant-time?
//     Timing attacks can leak secret keys
//     CPU branch predictor reveals conditional outcomes
//     crypto MUST NOT depend on secret values via timing

// Rust implementation pattern:
//
//   #[derive(Copy, Clone, PartialEq, Eq)]
//   pub struct Fp(pub [u64; 4]);
//
//   impl Fp {
//     pub fn add(&self, other: &Self) -> Self {
//       let mut result = [0u64; 4];
//       let mut carry = 0u64;
//       for i in 0..4 {
//         let (sum, c) = adc(self.0[i], other.0[i], carry);
//         result[i] = sum;
//         carry = c;
//       }
//       // Conditional subtract
//       Self::sub_if_gte(Self(result), &P)
//     }
//
//     fn sub_if_gte(a: Self, p: &[u64; 4]) -> Self {
//       // "Subtract p, keep original if underflow"
//       let mut result = [0u64; 4];
//       let mut borrow = 0u64;
//       for i in 0..4 {
//         let (diff, b) = sbb(a.0[i], p[i], borrow);
//         result[i] = diff;
//         borrow = b;
//       }
//       // If borrow, return original a
//       let mask = (borrow as i64).wrapping_neg() as u64;
//       for i in 0..4 {
//         result[i] = (result[i] & !mask) | (a.0[i] & mask);
//       }
//       Self(result)
//     }
//   }

// Montgomery form (the real magic):
//   All values stored as x * R mod p where R = 2^256
//   Multiplication reduces automatically without division
//   Addition/subtraction unchanged
//   Conversion at boundary (input/output)

// Production libraries use assembly:
//   BLST (Supranational): hand-tuned AVX/NEON asm
//   BoringSSL (Google): constant-time curve ops
//   ark-ff (Arkworks): pure Rust with #[asm]

// ZK prover hot path:
//
//   Typical proof computation:
//     10^6 - 10^9 Fp multiplications
//     At 20ns each: ~100 ms - 20 sec
//
//   Speed ups:
//     SIMD (AVX-512): 2-3x for batched ops
//     GPU: 10-100x for MSMs
//     ASIC: 1000x+ for repeated workloads

// Curve-specific considerations:
//
//   BN254: p ≈ 2^254 (4 limbs)
//   BLS12-381: p ≈ 2^381 (6 limbs)
//   secp256k1: p ≈ 2^256 (4 limbs)
//   Pasta/Vesta: p ≈ 2^255 (4 limbs)
//
//   Limb count affects performance:
//     6-limb fields ~2.5x slower than 4-limb
//     Due to quadratic mult, O(n^2) limb ops`}
        </pre>
      </div>
    </section>
  );
}

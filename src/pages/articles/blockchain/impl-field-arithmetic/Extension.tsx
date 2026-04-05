import ExtViz from './viz/ExtViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Extension({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 Fp2 → Fp6 → Fp12</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254 G2 점의 좌표는 Fp 하나로 표현 불가 — Fp2(이차 확장체)가 필요
          <br />
          Fp2 = a0 + a1*u (u^2 = -1) — 복소수와 동일한 구조
          <br />
          Fp6 = Fp2 위의 3차 확장, Fp12 = Fp6 위의 2차 확장
        </p>
        <p className="leading-7">
          타워 구조: Fp → Fp2 → Fp6 → Fp12 (2 x 3 x 2 = 12차)
          <br />
          모든 레벨에서 Karatsuba 트릭으로 곱셈 횟수를 절감
          <br />
          페어링(pairing) e(G1, G2)의 결과가 Fp12 원소
        </p>
      </div>
      <div className="not-prose mb-8">
        <ExtViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          역원 계산의 연쇄 위임: Fp12 → Fp6 → Fp2 → Fp
          <br />
          각 층에서 conjugate + norm으로 차원을 하나씩 내림
          <br />
          최종적으로 Fp의 Fermat 역원(a^(p-2))에 도달 — 복잡한 12차 역원이 소수체 역원으로 환원
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 타워 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Extension Field Tower Implementation
//
// BN254 tower structure:
//   Fp (base prime field)
//   Fp2 = Fp[u] / (u^2 + 1)         (degree 2)
//   Fp6 = Fp2[v] / (v^3 - (u + 9))   (degree 3)
//   Fp12 = Fp6[w] / (w^2 - v)        (degree 2)
//
//   Total: 2 * 3 * 2 = 12 dim over Fp

// Fp2 implementation:
//
//   struct Fp2 { c0: Fp, c1: Fp }  // c0 + c1*u
//
//   Addition: trivially componentwise
//     (a + bi) + (c + di) = (a+c) + (b+d)i
//
//   Multiplication: Karatsuba
//     (a + bi)(c + di) = (ac - bd) + (ad + bc)i
//     Karatsuba: 3 Fp mults instead of 4
//
//   Squaring:
//     (a + bi)^2 = (a^2 - b^2) + 2ab*i
//                = (a+b)(a-b) + 2ab*i
//     2 Fp mults (optimal)
//
//   Inverse:
//     (a + bi)^{-1} = (a - bi) / (a^2 + b^2)
//     2 Fp mults + 1 Fp inverse
//
//   Conjugate:
//     conj(a + bi) = a - bi
//     Used for inverse computation

// Fp6 implementation:
//
//   struct Fp6 { c0: Fp2, c1: Fp2, c2: Fp2 }
//   represents c0 + c1*v + c2*v^2
//   where v^3 = u + 9
//
//   Multiplication: Karatsuba-Toom (6 Fp2 mults, not 9)
//     c0 * c0': 1 mult
//     c1 * c1': 1 mult
//     c2 * c2': 1 mult
//     (c0+c1)*(c0'+c1') - previous: 1 mult
//     (c1+c2)*(c1'+c2') - previous: 1 mult
//     (c0+c2)*(c0'+c2') - previous: 1 mult
//     Combine with v reduction
//
//   Multiplication by nonresidue (v):
//     v * (a + bv + cv^2) = c*(u+9) + av + bv^2
//     Cheap: just a permutation + mult by (u+9)
//
//   Inverse: via norm to Fp2
//     Requires 1 Fp2 inverse + multiple mults

// Fp12 implementation:
//
//   struct Fp12 { c0: Fp6, c1: Fp6 }
//   represents c0 + c1*w
//   where w^2 = v
//
//   Multiplication: Karatsuba (3 Fp6 mults, not 4)
//     c0 * c0'
//     c1 * c1'
//     (c0+c1)*(c0'+c1') - above
//     Combine with v scaling
//
//   Squaring: 2 special Fp6 squarings
//     Cyclotomic squaring (for GT): only 9 Fp mults!
//     (much faster than generic 36 Fp mults)
//
//   Frobenius: x -> x^p
//     Cheap via precomputed constants
//     Used in final exponentiation

// Inverse of Fp12:
//
//   a in Fp12, inverse = a^{-1}
//
//   Approach: norm down the tower
//     norm_Fp6(x) = x * conj_Fp2(x)  // in Fp6
//                                      but actually Fp2
//     norm_Fp2(x) = x * conj_Fp(x)   // in Fp2
//                                      but actually Fp
//
//   Then: inv(a) = conj(a) / norm(a)

// Multi-level Karatsuba savings:
//
//   Level 1 (Fp2): 4 → 3 Fp mults (25% saving)
//   Level 2 (Fp6): 9 → 6 Fp2 mults (33% saving)
//   Level 3 (Fp12): 4 → 3 Fp6 mults (25% saving)
//
//   Combined: 4*9*4 = 144 → 3*6*3 = 54 Fp mults
//   2.67x speedup!

// Pairing use of extension fields:
//
//   e: G1 x G2 -> Fp12
//     G1 in E(Fp) (coordinates in Fp)
//     G2 in E'(Fp2) (coordinates in Fp2 via twist)
//     Result in Fp12 (GT subgroup of roots of unity)
//
//   Miller loop: Fp12 multiply + square
//   Final exp: Fp12 operations + Frobenius

// Code structure:
//
//   fp.rs       // base Fp
//   fp2.rs      // Fp2 operations
//   fp6.rs      // Fp6 operations
//   fp12.rs     // Fp12 operations
//   pairing.rs  // bilinear pairing on all these
//
//   Each higher level delegates to lower level
//   Inverse: Fp12 -> Fp6 -> Fp2 -> Fp

// Performance (BN254, single thread):
//
//   Fp mult:   ~18 ns
//   Fp2 mult:  ~60 ns (3 Fp mults + adds)
//   Fp6 mult:  ~400 ns (6 Fp2 mults)
//   Fp12 mult: ~1500 ns (3 Fp6 mults)
//   Fp12 squaring (cyclotomic): ~500 ns

// Libraries:
//   ark-bn254 (Rust, arkworks): generic
//   bn256 (Go, cloudflare): Ethereum precompile
//   blst (C, Supranational): BLS12-381 focused, fastest
//   py_ecc (Python): reference, slow`}
        </pre>
      </div>
    </section>
  );
}

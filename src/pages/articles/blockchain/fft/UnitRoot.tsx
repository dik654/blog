import UnitRootViz from './viz/UnitRootViz';

export default function UnitRoot() {
  return (
    <section id="unit-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">유한체 단위근 (Root of Unity)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          NTT의 핵심 &mdash; 재귀적으로 반씩 나눌 수 있는 단위근이 butterfly 분할을 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><UnitRootViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">단위근의 수학적 성질</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Roots of Unity in Finite Fields
//
// Definition:
//   omega is an n-th root of unity in F_p iff:
//     omega^n = 1  AND  omega^k != 1  for 0 < k < n
//
//   Called "primitive" n-th root
//
// Existence condition:
//   F_p has n-th root of unity iff n | (p - 1)
//   i.e., n divides the order of F_p*
//
// F_p* is cyclic of order p-1
//   Has generator g
//   omega = g^((p-1)/n) is primitive n-th root

// Key properties:
//
//   1. omega^n = 1
//      (omega cycles back after n steps)
//
//   2. omega^{n/2} = -1
//      (half-rotation gives sign flip)
//
//   3. omega^i = omega^{i mod n}
//      (all powers live in {omega^0, ..., omega^{n-1}})
//
//   4. omega_n = (omega_{2n})^2
//      n-th root is square of 2n-th root
//      → enables recursive halving in FFT
//
//   5. Sum identity:
//      sum_{j=0}^{n-1} (omega^j)^k = 0 for k != 0 (mod n)
//                                    n for k = 0 (mod n)
//      → basis for FFT orthogonality

// Why these properties matter for FFT:
//
//   Cooley-Tukey divides n-size problem into 2 n/2-size problems
//   Requires: omega_n^2 = omega_{n/2}
//   → Need 2-smooth domain (n = 2^k)
//
//   For odd/general n:
//     Mixed-radix FFT (Bluestein, Rader)
//     Less common in crypto
//
//   Most ZK systems: n = 2^k, 2-smooth fields

// Example: F_17
//
//   p = 17, p-1 = 16 = 2^4
//   Generator of F_17*: g = 3
//     Check: 3^1=3, 3^2=9, 3^4=81≡13, 3^8=169≡16, 3^16≡1
//
//   Primitive n-th roots:
//     n=2: omega = 3^8 = 16 = -1
//     n=4: omega = 3^4 = 13
//     n=8: omega = 3^2 = 9
//     n=16: omega = 3^1 = 3
//
//   Verify n=4: 13^4 = 28561 = 1680*17+1 ≡ 1 (mod 17) ✓
//   Verify n=4: 13^2 = 169 ≡ 16 = -1 (mod 17) ✓

// Finding primitive roots:
//
//   Algorithm:
//     1. Find any generator g of F_p*
//     2. omega = g^((p-1)/n) is primitive n-th root
//
//   Generator finding:
//     Pick random x in {2, ..., p-1}
//     Check: x^((p-1)/q) != 1 for each prime q | (p-1)
//     If all pass, x is a generator

// 2-adic decomposition:
//
//   Any prime p > 2: p-1 = 2^s * t (t odd)
//   2-adic value: s
//   Max FFT size: 2^s
//
//   Common primes:
//     BN254: s = 28
//     BLS12-381: s = 32
//     Goldilocks: s = 32
//     Pallas: s = 32

// NTT-friendly primes:
//
//   p = k * 2^s + 1 for large s
//   Examples:
//     Solinas (pseudo-Mersenne): p = 2^s - delta
//     Proth: p = k * 2^s + 1 with k < 2^s
//
//   Small NTT primes:
//     2^61 + 2^25 + 1 (used in polymath)
//     2^32 - 2^20 + 1 (field for Risc0)
//     M31 = 2^31 - 1 (Circle STARKs)

// Bit-reversal and canonical ordering:
//
//   Standard FFT uses bit-reversed output
//     Input: [a_0, a_1, a_2, a_3] (natural)
//     Output: [f(w^0), f(w^2), f(w^1), f(w^3)] (bit-rev)
//
//   Why? Butterfly pattern operates on pairs
//     Bit-rev puts them adjacent
//
//   Post-process: bit-reversal permutation
//     Or: use bit-rev NTT (inverts the pattern)

// Frobenius endomorphism and roots of unity:
//
//   Frobenius: phi(x) = x^p
//   Acts on roots of unity: phi(omega) = omega^p = omega^{p mod n}
//
//   For n | (p-1): omega^p = omega
//   → Roots of unity fixed by Frobenius
//   → All in base field F_p (not extension)`}
        </pre>
      </div>
    </section>
  );
}

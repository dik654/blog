import PrimeFieldViz from './viz/PrimeFieldViz';
import PrimeFieldDefViz from './viz/PrimeFieldDefViz';
import MultiplicativeGroupViz from './viz/MultiplicativeGroupViz';
import PrimitiveRootViz from './viz/PrimitiveRootViz';

export default function PrimeField() {
  return (
    <section id="prime-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소수체 & 원시근</h2>
      <div className="not-prose mb-8"><PrimeFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>소수체 정의</h3>
      </div>
      <div className="not-prose mb-8"><PrimeFieldDefViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>곱셈군 Fp*</h3>
      </div>
      <div className="not-prose mb-8"><MultiplicativeGroupViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>원시근 (Primitive Root)</h3>
      </div>
      <div className="not-prose mb-8"><PrimitiveRootViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>ZKP에서의 활용</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'NTT 단위근', desc: 'p-1이 2의 거듭제곱을 인수로 가지면 NTT 가능 (BN254: p-1 = 2²⁸ · ...)' },
            { name: 'Pedersen 생성원', desc: 'g, h를 이산로그 관계 미지인 두 생성원으로 선택' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-semibold text-sm text-indigo-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">소수체 및 원시근 심층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prime Fields and Primitive Roots
//
// Prime field F_p:
//   Set: {0, 1, 2, ..., p-1}
//   Addition: (a + b) mod p
//   Multiplication: (a * b) mod p
//   Additive identity: 0
//   Multiplicative identity: 1
//
// Requirements:
//   p must be prime (otherwise not a field)
//   Every nonzero element has multiplicative inverse
//
// Fundamental theorems:
//   Fermat's little theorem: a^(p-1) = 1 (mod p) for a != 0
//   Euler's theorem: a^phi(n) = 1 (mod n) if gcd(a,n)=1
//   Lagrange's theorem: subgroup order divides group order

// Multiplicative group F_p*:
//   Set: {1, 2, ..., p-1} (p-1 elements)
//   Operation: multiplication mod p
//   Always CYCLIC (isomorphic to Z/(p-1)Z)
//
//   Subgroup structure:
//     For every divisor d of (p-1):
//       Unique subgroup of order d
//     F_p* has exactly phi(d) elements of order d
//
// Generators (primitive roots):
//   Element g is primitive root iff order(g) = p-1
//   Number of generators: phi(p-1)
//   Every generator generates all of F_p*
//
//   Example F_17:
//     p = 17, p-1 = 16
//     phi(16) = 8 generators
//     Generators: {3, 5, 6, 7, 10, 11, 12, 14}

// Finding primitive roots:
//
//   Algorithm:
//     1. Factor p-1: p-1 = prod(q_i^e_i)
//     2. Pick random x in {2, ..., p-1}
//     3. For each prime q_i dividing p-1:
//          If x^((p-1)/q_i) = 1 (mod p), reject x
//     4. If all pass, x is primitive root
//
//   Expected trials: O(log log p) since density ~ 1/log log p

// Popular ZK fields:
//
//   BN254 scalar field:
//     p = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
//     p-1 = 2^28 * 3^2 * 13 * ... (large 2-adicity)
//     Max NTT size: 2^28
//     Used: Ethereum BN254 precompile
//
//   BLS12-381 scalar field:
//     p = 52435875175126190479447740508185965837690552500527637822603658699938581184513
//     p-1 has 2-adicity 32
//     Max NTT size: 2^32
//     Used: Zcash, Filecoin, Ethereum 2.0
//
//   Goldilocks prime:
//     p = 2^64 - 2^32 + 1
//     Small enough for fast arithmetic (single u64)
//     2-adicity: 32
//     Used: Plonky2, Risc0
//
//   Mersenne 31:
//     p = 2^31 - 1
//     Super fast reduction (add high bits to low)
//     2-adicity: 1 (small!) → uses extension for FFT
//     Used: Stwo (Circle STARKs), Plonky3

// Field arithmetic optimization:
//
//   Montgomery form:
//     Represent x as x*R mod p (R = 2^256 typically)
//     Multiply: (xR * yR) * R^-1 = (xy)R mod p
//     No division needed, uses shifts
//     ~50% faster than naive
//
//   Barrett reduction:
//     Alternative to Montgomery
//     Precomputes (2^k)/p for fast mod
//     Similar performance
//
//   Solinas primes:
//     p = 2^a - 2^b - ... ± 1
//     Special reduction via shifts only
//     Very fast, used in ECDSA (secp256k1)
//
//   NIST primes (P-256, P-384):
//     Specific sparse binary forms
//     Optimized hardware support

// Inverse computation:
//
//   Extended Euclidean algorithm:
//     O(log p) iterations
//     Used in most implementations
//
//   Fermat's little theorem:
//     a^-1 = a^(p-2) mod p
//     O(log p) multiplications
//     Constant-time, good for crypto
//
//   Batch inversion (Montgomery trick):
//     Invert n elements at once
//     Cost: 3(n-1) mults + 1 inversion
//     ~3x faster than n separate inversions

// Field size considerations:
//
//   128-bit security typically needs:
//     ECC: 256-bit prime
//     RSA: 3072-bit modulus
//     Pairing: 256-500 bit prime
//
//   Smaller fields = faster arithmetic
//   But may need extension for full security
//
//   Trade-off in ZK:
//     Large field: native RSA/ECDSA
//     Small field: fast prover, need extension`}
        </pre>
      </div>
    </section>
  );
}

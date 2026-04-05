import NTTConceptViz from './viz/NTTConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFT / NTT란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식 곱셈을 O(n2) &rarr; O(n log n)으로 가속.
          <br />
          ZKP는 유한체 위에서 동작하므로 NTT(Number Theoretic Transform) 사용.
        </p>
      </div>
      <div className="not-prose"><NTTConceptViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FFT/NTT 전체 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FFT / NTT Overview
//
// Fast Fourier Transform (FFT):
//   Compute DFT in O(n log n) instead of O(n^2)
//   Discovered: Gauss (1805), popularized Cooley-Tukey (1965)
//
// Number Theoretic Transform (NTT):
//   FFT over finite field F_p instead of complex numbers
//   Uses root of unity in F_p
//   Required field property: n | (p-1)
//     where n is transform size
//
// Why NTT instead of FFT in ZK?
//   FFT: complex numbers, floating point, rounding errors
//   NTT: exact arithmetic, no precision issues
//   Perfect for polynomial commitments, ZK proofs

// Applications in cryptography:
//
//   1. Polynomial multiplication:
//      Multiply degree-n polys in O(n log n)
//      Critical for: ZK-SNARKs, lattice crypto
//
//   2. Polynomial commitment schemes:
//      KZG setup: O(n log n) NTT
//      FRI: uses evaluation basis
//
//   3. Homomorphic encryption:
//      CKKS, BFV, BGV all use NTT
//      Fast ciphertext multiplication
//
//   4. Post-quantum crypto:
//      Kyber, Dilithium use NTT
//      Lattice key exchange

// Field selection for NTT:
//
//   Need: n | (p-1) where n is transform size
//   Common choices:
//
//   Goldilocks (Plonky2):
//     p = 2^64 - 2^32 + 1
//     p - 1 = 2^32 * 3 * 5 * 17 * ...
//     Max NTT size: 2^32
//
//   BN254 scalar field:
//     p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
//     p - 1 = 2^28 * ...
//     Max NTT size: 2^28
//
//   BLS12-381 scalar field:
//     p = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001
//     p - 1 has factor 2^32
//     Max NTT size: 2^32
//
//   M31 (Stwo):
//     p = 2^31 - 1
//     No 2^k factor! Uses extension field
//     CFFT (Circle FFT) alternative

// Three fundamental operations:
//
//   NTT (forward):
//     input: coefficients [a_0, a_1, ..., a_{n-1}]
//     output: evaluations [f(w^0), f(w^1), ..., f(w^{n-1})]
//     O(n log n)
//
//   INTT (inverse):
//     input: evaluations
//     output: coefficients
//     O(n log n)
//
//   Pointwise multiply:
//     input: two evaluation vectors of length n
//     output: pointwise product
//     O(n)

// Polynomial multiplication via NTT:
//
//   f(x), g(x): polynomials of degree < n
//   f * g has degree < 2n
//
//   Algorithm:
//     1. Pad f, g to length 2n (add zeros)
//     2. f_evals = NTT(f)      [O(n log n)]
//     3. g_evals = NTT(g)      [O(n log n)]
//     4. h_evals[i] = f_evals[i] * g_evals[i]  [O(n)]
//     5. h = INTT(h_evals)     [O(n log n)]
//     6. Return h              [polynomial of degree < 2n]
//
//   Total: O(n log n) vs O(n^2) schoolbook

// Performance on modern CPUs:
//
//   NTT size 2^20 (1M coefficients):
//     Naive: (10^6)^2 = 10^12 ops (~1000 seconds)
//     FFT: 10^6 * 20 = 2*10^7 ops (~20 ms)
//     Speedup: 50000x
//
//   NTT size 2^24 (16M):
//     Key in large zkSNARK circuits
//     Time: ~500 ms on single core
//     With GPU: ~50 ms

// Memory access patterns:
//
//   Naive implementation: cache-unfriendly
//   Optimized:
//     - Bit-reversal permutation
//     - Radix-r butterflies
//     - Six-step NTT (for very large n)
//     - Cache-oblivious version

// Implementations:
//
//   icicle (CUDA, GPU):
//     Batched NTT, multi-GPU
//     Used: Filecoin, Aleo
//
//   ark-poly (Rust CPU):
//     Arkworks reference
//     Generic over fields
//
//   plonky2 goldilocks:
//     Radix-2 NTT
//     Multi-threaded
//
//   circl / gnark:
//     Go implementations
//     Production quality`}
        </pre>
      </div>
    </section>
  );
}

import CostViz from './viz/CostViz';

export default function CostComparison() {
  return (
    <section id="cost-comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BN254 페어링에서 Fp12 곱셈은 가장 빈번한 연산이다.
          <br />
          Miller Loop 254회 반복마다 Fp12 곱셈이 등장한다.
        </p>
        <p>
          Karatsuba 타워로 한 번의 Fp12 곱셈이 <strong>144 &rarr; 54</strong> Fp 곱셈으로 줄어든다.
          <br />
          2.7배의 절감이 254번 반복되므로, 페어링 전체 성능에 결정적인 차이를 만든다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BN254 페어링 비용 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BN254 Pairing Cost Analysis
//
// Pairing: e(P, Q): G1 x G2 → GT
//   P in G1 (curve over Fp)
//   Q in G2 (curve over Fp2)
//   result in GT (subgroup of Fp12)
//
// Algorithm: ate pairing (optimal variant)
//   Two phases:
//     1. Miller loop
//     2. Final exponentiation

// Phase 1: Miller loop (main cost)
//
//   for i = log2(r) down to 0:
//     f = f^2 * l_{Q,Q}(P)       [doubling step]
//     if bit_i of t set:
//       f = f * l_{Q,T}(P)        [addition step]
//
//   BN254: t = 6x + 2, log2(t) ≈ 64
//   Iterations: ~64
//
//   Per iteration:
//     1 Fp12 squaring
//     1 Fp12 mult with sparse line
//     Maybe 1 additional mult

// Cost per iteration:
//
//   Fp12 squaring (cyclotomic): 9 Fp mults
//   Fp12 sparse mult: 13 Fp mults
//     (sparse: line has only 6 of 12 coefficients nonzero)
//
//   Line evaluation (doubling): ~6 Fp mults + adds
//   Line evaluation (addition): ~10 Fp mults + adds
//
//   Total per iter: ~38 Fp mults (doubling)
//                   ~47 Fp mults (addition, when bit set)
//
//   64 doublings + ~33 additions (Hamming weight):
//     64*38 + 33*47 = 2432 + 1551 = ~4000 Fp mults
//
// Phase 2: Final exponentiation
//
//   Raise f to (p^12 - 1) / r
//   Factored as: f^((p^12-1)/r) = f^((p^6-1))^((p^2+1))^((p^4-p^2+1)/r)
//
//   Parts:
//     (p^6-1): 1 inversion, 1 Fp6 mult, 1 Fp6 inversion
//     (p^2+1): 1 Frobenius, 1 Fp12 mult
//     hard exponent ((p^4-p^2+1)/r): ~400 cyclotomic squarings
//                                    + ~30 Fp12 mults
//
//   Total final exp: ~3600 Fp mults

// Complete BN254 pairing cost:
//
//   Miller loop: ~4000 Fp mults
//   Final exp:   ~3600 Fp mults
//   Total:       ~7600 Fp mults
//
//   With 20ns per Fp mult: 0.15 ms per pairing

// Impact of Karatsuba optimization:
//
//   Without Karatsuba (naive Fp12 = 144 Fp):
//     Miller loop: 64 * 144 = ~9200 Fp mults (rough)
//     Total: ~18000 Fp mults
//     0.36 ms per pairing
//
//   With Karatsuba (Fp12 = 54 Fp):
//     Miller loop: 64 * 54 = ~3500 Fp mults
//     Total: ~7600 Fp mults
//     0.15 ms per pairing
//
//   Speedup: 2.4x (not full 2.7x due to squarings, sparse ops)

// Benchmarks (Go: cloudflare/bn256):
//
//   Single pairing: ~1.5 ms
//   Batch of 10:    ~12 ms (not 15 due to shared exp)
//   Multi-pairing check: much faster per pairing

// Benchmarks (Rust: arkworks-bn254):
//
//   Single pairing: ~0.8 ms
//   Miller loop only: ~0.35 ms
//   Final exp only:   ~0.45 ms
//
//   With BLST (Rust/asm): ~0.4 ms per pairing

// Applications that drive this optimization:
//
//   1. ZK proof verification:
//      Groth16: 3 pairings per proof
//      BLS signatures: 1 pairing per signature check
//      Batch verification: N+1 pairings for N sigs
//
//   2. Ethereum EIP-196/197 precompile:
//      BN254 pairing: 181,000 gas per pairing
//      Used by: zkSNARK verifiers, Tornado Cash, ZK rollups
//
//   3. BLS signatures (Ethereum consensus):
//      ~1M BLS signatures aggregated per epoch
//      Verification: 2 pairings + aggregate
//
//   4. zk-Rollups:
//      Groth16 proofs verified on-chain
//      Gas optimization critical for L2 economics

// Curve-specific notes:
//
//   BN254:
//     128-bit security (pre-2015 estimate)
//     Attacks lowered to ~100-110 bit security
//     Still used due to Ethereum precompile
//
//   BLS12-381:
//     128-bit security (current standard)
//     Larger field (381 bits vs 254)
//     Used by: Zcash Sapling, Filecoin, Ethereum 2.0
//     Slightly slower (larger fields)
//
//   BLS12-377:
//     Curve FOR ZK proofs (arithmetic-friendly)
//     Used by Aleo, Celo, some zkVMs`}
        </pre>
      </div>
    </section>
  );
}

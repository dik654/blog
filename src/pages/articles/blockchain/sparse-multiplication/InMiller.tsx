import InMillerViz from './viz/InMillerViz';

export default function InMiller() {
  return (
    <section id="in-miller" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">254회 반복의 누적 효과</h2>
      <div className="not-prose mb-8"><InMillerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Miller Loop는 약 254번 반복한다.<br />
          매 반복마다 f = f² * l(P) 연산이 있으므로,
          sparse 곱셈은 254번 적용된다.
        </p>
        <p>
          Full로 계산하면 254 x 54 = 약 <strong>13,700 Fp곱</strong>이다.<br />
          Sparse로 계산하면 254 x 18 = 약 <strong>4,600 Fp곱</strong>이다.<br />
          절감량은 약 <strong>9,100 Fp곱</strong>이다.
        </p>
        <p>
          전체 페어링 연산(Miller Loop + Final Exp)은 약 20,000 Fp곱이다.
          sparse 곱셈 최적화 하나로 전체의 약 <strong>45%</strong>를 절약한다.
        </p>
        <p>
          twist가 sparse를 만들고, sparse가 페어링을 실용적으로 만든다.<br />
          이 최적화 없이는 ZK-SNARK 검증이 현실적인 시간 내에 불가능하다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Miller Loop 누적 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Miller Loop + Sparse Optimization
//
// Miller's algorithm:
//   Computes pairing e(P, Q) by iterating through bits
//   of the loop counter (embedding degree related)
//
// For BN254:
//   loop_counter = 6*x + 2
//     where x = 4965661367192848881 (BN254 parameter)
//   Binary: ~64 bits
//   Hamming weight: ~30
//
// For BLS12-381:
//   loop_counter = x (shorter!)
//     where x = -0xd201000000010000
//   Binary: ~64 bits
//   Hamming weight: ~6
//
//   → BLS12-381 Miller loop is much shorter (fewer adds)

// Pseudocode:
//
//   fn miller_loop(P, Q) -> Fp12 {
//       let mut f = Fp12::ONE;
//       let mut T = Q;  // working point
//       let L = loop_counter_bits();
//       for i in (0..L.len()-1).rev() {
//           // Doubling step
//           line = tangent_line(T);
//           T = 2 * T;
//           f = f * f;
//           f = mul_by_034(f, line.coeffs);  // sparse!
//
//           if L.get_bit(i) {
//               // Addition step
//               line = chord_line(T, Q);
//               T = T + Q;
//               f = mul_by_034(f, line.coeffs);  // sparse!
//           }
//       }
//       f  // needs final exponentiation
//   }

// Per-iteration cost accounting:
//
//   Doubling (every iteration):
//     f^2 (cyclotomic): 18 Fp mults
//     Compute tangent line: 12 Fp mults
//     Double T: 5 Fp mults
//     f * line_sparse: 39 Fp mults
//     Total: ~74 Fp mults
//
//   Addition (conditional):
//     Compute chord line: 15 Fp mults
//     Add Q to T: 10 Fp mults
//     f * line_sparse: 39 Fp mults
//     Total: ~64 Fp mults

// Total Miller loop (BN254):
//
//   ~64 doublings × 74 = 4736 Fp mults
//   ~30 additions × 64 = 1920 Fp mults
//   TOTAL: ~6700 Fp mults

// Sparse contribution:
//
//   Without sparse:
//     94 iterations × (full 54 mult) = 5076 extra ops saved
//
//   With sparse:
//     Saved ~5000 Fp mults per pairing
//     That's ~40% of Miller loop cost

// Multi-pairing verification:
//
//   Groth16 verify: e(A, B) * e(-C, D) * e(-IC, γ) == 1
//     3 pairings needed
//     BUT: share final exponentiation!
//     Compute all Miller loops, THEN one final exp
//
//   Saves: 2 final exps (~6000 mults each = 12000 saved)
//   vs 3 separate pairings

// Aggregate verification:
//
//   BLS multisig verify: e(G1, pk_aggr) == e(H(m), sig)
//     Aggregate public keys into one pk_aggr
//     Single pairing equality check
//     2 pairings (with shared final exp)

// Pairing cost in Ethereum:
//
//   EIP-196/197 precompile:
//     BN254 pairing check
//     Gas: 34000 + 34000*k  (k = num pairings)
//   EIP-2537 (BLS12-381):
//     Not yet on mainnet
//     Would enable BLS signatures, ZK upgrades

// Full pairing cost summary:
//
//   Miller loop: ~6700 Fp mults (~1.3 ms)
//   Final exp:   ~3500 Fp mults (~0.7 ms)
//   Total:       ~10200 Fp mults (~2 ms @ 200ns/mult)
//
//   Optimized (blst, asm):
//     ~0.5 ms total per BLS12-381 pairing
//     ~0.3 ms per BN254 pairing

// Why pairings are ZK-critical:
//
//   Groth16 verifier: 3 pairings
//   PLONK verifier: 2 pairings + polynomial opens
//   KZG commitments: pairing equality checks
//   Recursive SNARKs: pairings inside circuits
//
//   Even 1.5x speedup in pairing = 1.5x faster
//   block verification, signature checking, ZK rollup

// Implementation comparison:
//
//   arkworks-ec:
//     Full generic pairing support
//     Sparse optimization included
//
//   blst (Supranational):
//     Hand-written assembly
//     Cyclotomic + sparse + lazy reduction
//     Fastest production BLS12-381
//
//   gnark:
//     Go implementation
//     zkSNARK-focused
//     Includes pairing precompile
//
//   py_ecc:
//     Pure Python
//     ~100x slower but readable
//     Used in Ethereum research`}
        </pre>
      </div>
    </section>
  );
}

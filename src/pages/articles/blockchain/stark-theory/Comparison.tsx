import ComparisonViz from './viz/ComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK vs STARK</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SNARK = 작은 proof + 타원곡선 의존. STARK = 큰 proof + 양자 내성 + 투명 셋업.
        </p>
      </div>
      <div className="not-prose"><ComparisonViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SNARK vs STARK 상세 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SNARK vs STARK 기술 비교
//
// Proof Size:
//   Groth16:  ~200 bytes (최소)
//   PLONK:    ~500 bytes
//   Halo2:    ~1 KB
//   STARK:    50-200 KB
//   → SNARK가 1000배 작음
//
// Verify Time:
//   SNARK:    3-10 ms
//   STARK:    10-100 ms
//   → SNARK가 약 10배 빠름
//
// Prove Time:
//   SNARK:    O(n log n), linear in constraints
//   STARK:    O(n log² n), slightly worse
//   → 비슷하지만 STARK가 약간 느림
//
// Cryptographic Assumption:
//   SNARK:    DLP, ECC, Pairing
//            → Post-quantum: BROKEN
//   STARK:    Hash functions (SHA-256, BLAKE)
//            → Post-quantum: SECURE
//
// Trusted Setup:
//   SNARK:    Required (MPC ceremony)
//            - Groth16: per-circuit
//            - PLONK: universal
//   STARK:    Not required (transparent)
//            → "매력적인 특성"

// 실무 선택 기준:
//
// SNARK 선호:
//   ✓ 온체인 검증 비용 최소화
//   ✓ Ethereum L1 (gas 제약)
//   ✓ 짧은 proof 필수
//   → zkSync, Scroll, Polygon zkEVM
//
// STARK 선호:
//   ✓ Trusted setup 회피
//   ✓ Post-quantum 보안
//   ✓ 대규모 computation
//   ✓ 투명성 중요
//   → StarkNet, Risc0, Polygon Miden
//
// 하이브리드:
//   ✓ Plonky2: FRI + PLONK
//   ✓ Groth16 wrapper for STARK
//   ✓ Recursive composition

// 생태계 주요 프로젝트:
//
// SNARK 기반:
//   - zkSync (PLONK)
//   - Scroll (zkEVM, PLONK)
//   - Polygon zkEVM (Plonky + FRI)
//   - Aztec (PLONK)
//   - Aleo (Marlin)
//   - Mina (Pickles)
//
// STARK 기반:
//   - StarkNet (Cairo)
//   - Polygon Miden
//   - Risc0 (RISC-V zkVM)
//   - Plonky2 (Polygon)
//   - Winterfell
//   - Kimchi (Mina newer)

// 미래 방향:
//   - ZK Accelerators (GPU, FPGA, ASIC)
//   - Folding schemes (Nova, HyperNova, ProtoStar)
//   - Lookup-based optimization
//   - Post-quantum SNARKs (Lattice)
//   - zkML (AI + ZK)`}
        </pre>
      </div>
    </section>
  );
}

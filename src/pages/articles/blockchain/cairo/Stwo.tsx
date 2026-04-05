import CodePanel from '@/components/ui/code-panel';
import StwoProveViz from './viz/StwoProveViz';
import {
  PROVE_CODE, PROVE_ANNOTATIONS,
  VERIFY_CODE, VERIFY_ANNOTATIONS,
} from './StwoData';

export default function Stwo({ title }: { title?: string }) {
  return (
    <section id="stwo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'S-two 증명 시스템 연동'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>S-two Cairo</strong>는 StarkWare의 차세대 영지식 증명 시스템으로,
          Circle STARKs 기반의 혁신적인 암호학 기술을 사용합니다.<br />
          Cairo 프로그램의 실행을 증명하고 검증하는 핵심 컴포넌트입니다.
        </p>
      </div>

      <StwoProveViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 생성 파이프라인</h3>
        <CodePanel title="cairo-prove → adapter → prove" code={PROVE_CODE}
          annotations={PROVE_ANNOTATIONS} />

        <h3>검증 & 보안 설정</h3>
        <CodePanel title="PcsConfig & 온체인 검증기" code={VERIFY_CODE}
          annotations={VERIFY_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Stwo / Circle STARKs</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stwo: StarkWare TWO (next-gen STARK prover)
//
// Successor to:
//   StoneProver (Stone) — production Cairo prover
//   Cairo0 → StoneProver pipeline
//
// Stwo innovations:
//   - Circle STARKs (new arithmetization)
//   - Mersenne prime field M31 (p = 2^31 - 1)
//   - SIMD-friendly (AVX-512, NEON, GPU-ready)
//   - GKR protocol for builtin evaluation
//
// Research: "Circle STARKs" (Habock, Levi, Papini 2024)

// Why Mersenne 31?
//
//   p = 2^31 - 1 = 2,147,483,647
//   Fits in a u32 (single word)
//
//   Compared to Starknet Prime (251 bits):
//     Multiplication: 1 CPU cycle vs 10+ cycles
//     Field ops 8-16x faster
//     AVX-512 packs 16 elements per 512-bit register
//
//   Trade-off:
//     Smaller field → needs extension field for soundness
//     Stwo uses M31^4 (128-bit extension)
//     Queries in extension, commits in base

// Circle curve arithmetization:
//
//   Standard STARK: polynomial constraints over omega^i roots
//   Circle STARK: constraints over points on circle:
//     C = {(x, y) : x^2 + y^2 = 1}
//
//   Circle group structure:
//     (x1, y1) * (x2, y2) = (x1*x2 - y1*y2, x1*y2 + x2*y1)
//
//   Doubling map:
//     2P = (2x^2 - 1, 2xy)
//
//   Enables circle FFT:
//     Similar to standard FFT
//     Works over Mersenne prime
//     Radix-2 decomposition via doubling

// Prover pipeline:
//
//   1. Run Cairo program → trace
//   2. Extract component traces:
//      - Execution trace
//      - Memory trace
//      - Builtin traces
//   3. Commit to trace (Merkle + FRI)
//   4. Compute AIR constraints per component
//   5. GKR protocol for builtin reductions
//   6. FRI low-degree testing
//   7. Output proof

// GKR for builtins:
//
//   Traditional: builtin uses own AIR
//   Stwo approach: GKR sum-check
//     Reduces builtin verification to 1 polynomial check
//     At cost of O(log n) verifier rounds
//   Massive prover savings for pedersen, poseidon, range_check

// Performance claims:
//
//   Cairo0 Stone: 1x baseline
//   Stwo:         100x prover speedup
//
//   Ultimate target: prove 1B Cairo steps in <1 hour
//   On consumer GPU: billions of constraints/sec

// Proof sizes:
//
//   Stwo proof: ~100-200 KB
//   Depends on:
//     - Trace size
//     - FRI queries (security parameter)
//     - Component count
//
//   vs Groth16: 256 bytes
//   vs Plonk: ~500 bytes
//   STARKs trade size for:
//     transparent setup
//     post-quantum security
//     prover speed

// Verification:
//
//   On-chain (L1):
//     Stwo L1 verifier (in Solidity/Cairo)
//     Cost: ~5M gas (Starknet settles on L1)
//     Recursive verifier coming (proof of proofs)
//
//   On-chain (L2 recursive):
//     Stwo can verify Stwo
//     Enables bootstrapping, checkpoints

// PcsConfig (Polynomial Commitment Scheme):
//
//   struct PcsConfig {
//     pow_bits: u32,        // proof-of-work bits (hash puzzle)
//     fri_config: FriConfig,
//   }
//
//   struct FriConfig {
//     log_blowup_factor: u32,  // rate = 1/(2^blowup)
//     log_last_layer_degree_bound: u32,
//     n_queries: u32,          // FRI queries for soundness
//   }
//
//   Typical: blowup=1 (rate 1/2), queries=20-80

// Production status:
//   Starknet v0.13.3+: Stwo adopted
//   StarkNet Foundation investing heavily
//   Expected to power all StarkNet proofs by 2025`}
        </pre>
      </div>
    </section>
  );
}

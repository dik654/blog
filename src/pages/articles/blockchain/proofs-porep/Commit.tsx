import { codeRefs } from './codeRefs';
import CommitViz from './viz/CommitViz';
import type { CodeRef } from '@/components/code/types';

export default function Commit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">C1/C2: Groth16 증명 생성</h2>
      <div className="not-prose mb-8">
        <CommitViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} GPU MSM 가속</strong> — C2 병목은 Multi-Scalar Multiplication
          <br />
          bellperson CUDA/OpenCL로 CPU 대비 10~50배 속도 향상
          <br />
          SupraSeal은 프리페치 + 윈도우 NAF로 추가 최적화
        </p>

        {/* ── C1/C2 Detail ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">C1/C2: Groth16 Proof 생성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// C1 (Challenge Response):

// Input:
// - seed (on-chain randomness after PreCommit)
// - tree R, tree C from PC2

// Algorithm:
// 1. compute challenges using seed
//    num_challenges = 180 (default)
//    per challenge: random leaf index
// 2. for each challenge:
//    - open leaf in tree R (Merkle proof)
//    - open leaf in tree C (Merkle proof)
//    - read DRG parents labels
//    - compile proof data
// 3. output: vanilla_proof
//    - Merkle paths
//    - parent labels
//    - column data

// C1 is fast (<1 min) because:
// - just reads existing trees
// - 180 challenges × O(tree_depth) I/O
// - sequential disk access
// - SSD/NVMe beneficial

// C2 (SNARK Proof Generation):

// Input:
// - vanilla_proof from C1
// - proving key (~100 GiB, pre-generated)

// Groth16 Proof:
// - circuit: ~10^8 constraints
// - witness: ~10^8 elements
// - steps:
//   1. witness generation
//   2. A, B, C polynomial evaluation
//   3. MSM for A, B, C coefficients
//   4. pairing combinations
//   5. proof π = (A, B, C) ∈ G1, G2, G1

// MSM Bottleneck:
// - Multi-Scalar Multiplication
// - largest computation
// - ~95% of C2 time
// - heavily optimized

// GPU Acceleration:
// - bellperson (Filecoin's Groth16)
// - Bellperson CUDA/OpenCL
// - Pippenger's algorithm
// - windowed NAF (Non-Adjacent Form)
// - batch multiplication

// Hardware:
// - NVIDIA A100: ~20-30 min
// - NVIDIA A6000: ~45-90 min
// - RTX 4090: ~30-60 min
// - Apple M2: ~60 min (limited)
// - CPU only: 4-8 hours

// SupraSeal optimization:
// - prefetch memory access
// - windowed NAF
// - improved GPU kernels
// - ~2-3x faster than bellperson

// Output:
// - Groth16 proof (192 bytes!)
// - sealed_cid
// - submitted on-chain via ProveCommit

// On-chain verification:
// - 3 pairing operations
// - ~200ms in Filecoin VM
// - constant size proof
// - scales well

// Memory:
// - C2 peak: ~100-200 GiB
// - GPU VRAM: 24+ GB needed
// - bellperson chunks work
// - disk spill if needed`}
        </pre>
        <p className="leading-7">
          C1: challenge Merkle proofs (&lt;1min).<br />
          C2: <strong>Groth16 SNARK, MSM bottleneck (95% time)</strong>.<br />
          SupraSeal이 bellperson 대비 2-3x 빠름.
        </p>
      </div>
    </section>
  );
}

import { codeRefs } from './codeRefs';
import PC1DetailViz from './viz/PC1DetailViz';
import type { CodeRef } from '@/components/code/types';

export default function PC1({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pc1" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreCommit1: SDR 그래프 생성</h2>
      <div className="not-prose mb-8">
        <PC1DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} replica_id의 역할</strong> — prover_id + sector_id + ticket + comm_d를 결합
          <br />
          동일 원본 데이터라도 SP마다, 섹터마다 완전히 다른 봉인 결과
        </p>

        {/* ── PC1 Detail ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PC1 Algorithm 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PC1 Algorithm (Stacked DRG encoding):

// Input:
// - replica_id = SHA256(prover_id || sector_id || ticket || comm_d)
//   prover_id: storage provider ID (32 bytes)
//   sector_id: sector number
//   ticket: on-chain randomness
//   comm_d: data commitment (original data)

// 11 layer encoding:
// for i in 0..11:
//     for node in layer[i]:
//         parents = get_parents(node)
//         // 6 DRG parents (from same layer)
//         // 8 Expander parents (from layer i-1)
//
//         label = SHA256(
//             replica_id ||
//             i (layer) ||
//             node (index) ||
//             parents[0..14] labels
//         )
//         layer[i][node] = label

// SHA256 optimization:
// - SHA-NI instructions (Intel/AMD)
// - AVX2/AVX512 batching
// - parallel windows within layer
// - critical path: inter-layer dependency

// Parallelism:
// - within layer: ~N parallel windows
// - between layers: strict sequential
// - 4-thread pipelining per window
// - 64-core EPYC: ~60% utilization

// Memory requirements:
// - layer i's data: ~32 GiB
// - parent layer cache: ~32 GiB
// - DRG window cache: ~1 GiB
// - total: ~64-100 GiB RAM recommended

// Output:
// - 11 layers × 32 GiB = 352 GiB
// - written to NVMe SSD
// - used by PC2, C1

// Performance targets:
// - Intel i9-13900K: 3-4 hours
// - AMD EPYC 7B13: 2.5-3 hours
// - AMD EPYC 9654 (96c): 2 hours
// - typical: 3-5 hours

// Attacks prevented:
// 1. Parallel attack:
//    - precompute all layers in parallel
//    - SDR makes this impossible
//    - DRG depth-robust property
//
// 2. Time-space trade-off:
//    - store compressed + recompute
//    - SDR makes recomputation expensive
//    - economically infeasible
//
// 3. Deduplication attack:
//    - multiple miners share sealed sector
//    - replica_id includes prover_id
//    - each miner has unique seal
//    - no deduplication possible

// replica_id 역할:
// - unique per (prover, sector)
// - encrypts with prover identity
// - prevents ciphertext sharing
// - physical storage enforced`}
        </pre>
        <p className="leading-7">
          PC1: <strong>11 layers × SHA256 + 14 parents, sequential</strong>.<br />
          replica_id가 per-prover 고유화 — deduplication 불가.<br />
          3-5h on modern CPU, 352 GiB intermediate data.
        </p>
      </div>
    </section>
  );
}

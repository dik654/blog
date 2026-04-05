import { codeRefs } from './codeRefs';
import PC2DetailViz from './viz/PC2DetailViz';
import type { CodeRef } from '@/components/code/types';

export default function PC2({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pc2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreCommit2: 칼럼 해시 + 트리 R</h2>
      <div className="not-prose mb-8">
        <PC2DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 왜 Poseidon인가?</strong> — SHA256은 비트 연산 → ZK 회로 비효율
          <br />
          Poseidon은 유한체 산술 연산 → SNARK 회로 크기 수백 배 감소
        </p>

        {/* ── PC2 Algorithm ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PC2 Algorithm 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PC2 Algorithm (Column hashing + Tree R):

// Input:
// - 11 layers from PC1 (352 GiB)
// - original data D (32 GiB)

// Step 1: Column hashing
// for each column (leaf position):
//     column = [layer_0[j], layer_1[j], ..., layer_10[j]]
//     column_hash = Poseidon(column)
//     column_tree[j] = column_hash
//
// - 11 values per column
// - ~10^9 columns
// - Poseidon hash per column
// - parallelizable

// Step 2: Encoded data
// for each node j:
//     encoded[j] = D[j] + layer_10[j]  (mod BLS12-381 scalar field)
// - original + last layer label
// - "encryption" of original data

// Step 3: Tree D (original data)
// - binary Merkle tree over D
// - Poseidon hash
// - root: comm_d

// Step 4: Tree R_last (encoded data)
// - binary Merkle tree over encoded
// - Poseidon hash
// - root: comm_r_last

// Step 5: Tree C (column tree)
// - Merkle tree over column hashes
// - root: comm_c

// Step 6: comm_r computation
// comm_r = Poseidon(comm_c || comm_r_last)
// - final replica commitment
// - committed on-chain (PreCommit)

// GPU Acceleration:
// - Poseidon on GPU (CUDA)
// - column hashing batched
// - ~1024 columns per kernel
// - A100: ~5-10 min for PC2
// - A6000: ~15-30 min

// Memory:
// - stream process columns
// - chunked Merkle construction
// - peak: ~32 GiB VRAM needed
// - tree nodes written to disk incrementally

// Output:
// - tree R_last (~32 GiB)
// - tree C (~30 GiB)
// - comm_r (32 bytes, on-chain)

// Why Poseidon for SNARK:
// - SHA256: bit operations (expensive in ZK)
// - Poseidon: field operations (cheap)
// - 100-1000x fewer constraints
// - enables efficient SNARK proofs

// Poseidon details:
// - width: 2, 4, 8, 11+ (input arity)
// - rounds: 57-65 (optimized)
// - MDS matrix
// - S-box: x^5
// - BLS12-381 scalar field
// - 128-bit security`}
        </pre>
        <p className="leading-7">
          PC2: <strong>column hash → tree R → tree C → comm_r</strong>.<br />
          Poseidon hash (SNARK-friendly, 100-1000x SHA256 constraint ratio).<br />
          GPU acceleration: A100 5-10min, A6000 15-30min.
        </p>
      </div>
    </section>
  );
}

import TwoDErasureViz from './viz/TwoDErasureViz';

export default function TwoDimensional() {
  return (
    <section id="two-dimensional">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        2D 이레이저 코딩 &amp; DAS
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          k x k 매트릭스에 행/열 독립 RS 코딩 &rarr; 2k x 2k 확장. DAS의 기반 기술.
        </p>
      </div>
      <div className="not-prose"><TwoDErasureViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">2D Erasure Coding &amp; DAS</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2D Erasure Coding:

// Construction:
// 1. data → k×k matrix
// 2. RS encode each row → 2k symbols
// 3. RS encode each column → 2k symbols
// 4. result: 2k × 2k matrix
// 5. total: 4k² symbols
// 6. original: k² symbols
// 7. overhead: 3x (4x total)

// 복구 가능성:
// - any k complete rows/cols → reconstruct
// - partial rows/cols → iterative solving
// - 75% loss 견딤 (MDS-like)

// DAS (Data Availability Sampling):
// - light client verification
// - sample random cells from 2D grid
// - check cell authenticity (Merkle)
// - if all samples valid → data available (probably)

// DAS security:
// - 1 sample: ~50% detect bad data
// - 10 samples: 99.9% detection
// - 30 samples: 99.9999999999% detection
// - exponential security

// Matrix structure:
// 2k columns x 2k rows
// ┌─────────┬─────────┐
// │ Original│ Col RS  │
// │  k × k  │ Parity  │
// ├─────────┼─────────┤
// │ Row RS  │ Parity  │
// │ Parity  │ of Parity│
// └─────────┴─────────┘

// Commitment:
// - each row: Merkle root
// - each column: Merkle root
// - row roots + column roots → tree
// - final: DA root (32 bytes)

// Ethereum (EIP-4844):
// - blob transactions
// - 2D erasure coded
// - DAS for light clients
// - scalability boost (blob sidecars)

// Celestia:
// - extensible data availability layer
// - 2D RS coding
// - modular blockchain infrastructure
// - light client friendly

// EigenDA:
// - EigenLayer data availability
// - uses 2D RS
// - restaking economics

// Technical challenges:
// - encoding throughput
// - computation cost
// - sampling efficiency
// - fraud proofs (bad encoding)

// Optimization:
// - SIMD RS
// - parallel row/column
// - GPU acceleration
// - polynomial commitment schemes (KZG)

// Comparison:
// 1D EC: simple, k of n, single dimension
// 2D EC: stronger DAS, 4x overhead, complex
// 3D+ EC: theoretical (diminishing returns)`}
        </pre>
        <p className="leading-7">
          2D EC: <strong>k×k → 2k×2k matrix, row+column RS coding</strong>.<br />
          DAS = sampling cells으로 availability 확률적 verify.<br />
          Ethereum EIP-4844, Celestia, EigenDA 사용.
        </p>
      </div>
    </section>
  );
}

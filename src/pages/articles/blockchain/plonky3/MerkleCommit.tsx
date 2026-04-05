import CodePanel from '@/components/ui/code-panel';
import MerkleMMCSViz from './viz/MerkleMMCSViz';
import {
  MERKLE_TREE_CODE, MERKLE_TREE_ANNOTATIONS,
  MMCS_CODE, MMCS_ANNOTATIONS,
} from './MerkleCommitData';

export default function MerkleCommit({ title }: { title?: string }) {
  return (
    <section id="merkle-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Merkle 커밋먼트 스킴'}</h2>
      <div className="not-prose mb-8"><MerkleMMCSViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3의 <strong>MMCS(Mixed Matrix Commitment Scheme)</strong>는
          서로 다른 높이의 행렬들을 하나의 Merkle 트리에 통합합니다.<br />
          Poseidon2로 리프를 해시하고, 비트 시프트 인덱싱으로 다중 높이를 처리합니다.
        </p>

        <h3>MerkleTree 구조</h3>
        <CodePanel title="일반화된 Merkle 트리" code={MERKLE_TREE_CODE}
          annotations={MERKLE_TREE_ANNOTATIONS} />

        <h3>MerkleTreeMmcs</h3>
        <CodePanel title="MMCS 커밋 & 배치 오픈" code={MMCS_CODE}
          annotations={MMCS_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Mixed-Matrix Commitment</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 문제: STARK에서 서로 다른 size의 polynomial 여러 개
// - Trace polynomials: 2^20 rows
// - Quotient polynomial: 2^22 rows (extended)
// - Different heights → separate Merkle trees 비효율

// MMCS 해결책
// 모든 polynomial을 single unified Merkle tree에 담기
// - 각 matrix는 자기 height에서 start
// - 작은 matrix는 "virtual zeros"로 확장
// - 하나의 root로 모두 커밋

// 구조
//                 Root
//              /        \\
//          Inner        Inner
//         /      \\    /      \\
//      Leaf_2^22   ...
//         |
//     [matrix 2^22 row]

// 효율성
// - 하나의 commit operation (root 계산)
// - Batch opening: 여러 matrix 동시 증명
// - Single transcript interaction

// Query complexity
// k queries × log(2^22) hashes per query
// = k × 22 Poseidon2 hashes
// Typical k = 60-100

// vs 여러 개 tree 유지 시
// - 각 tree마다 별도 query
// - Transcript interaction 증가
// - 약 2-3x overhead`}</pre>

      </div>
    </section>
  );
}

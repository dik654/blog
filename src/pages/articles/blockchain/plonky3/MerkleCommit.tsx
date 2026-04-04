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
      </div>
    </section>
  );
}

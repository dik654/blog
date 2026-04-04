import MerkleTreeViz from './viz/MerkleTreeViz';
import SMTViz from './viz/SMTViz';

export default function MerkleTree() {
  return (
    <section id="merkle-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle Tree & 희소 트리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          루트 해시 하나로 전체 데이터 무결성 증명. 증명 크기 O(log n).
        </p>
      </div>
      <div className="not-prose mb-8"><MerkleTreeViz /></div>

      <h3 className="text-xl font-semibold mb-3">희소 머클 트리 (SMT)</h3>
      <div className="not-prose"><SMTViz /></div>
    </section>
  );
}

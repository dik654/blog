import MerkleProofViz from './viz/MerkleProofViz';

export default function MerkleProof() {
  return (
    <section id="merkle-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">머클 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          전체 트라이 없이 특정 키-값 쌍의 존재를 검증 가능.<br />
          라이트 클라이언트는 블록 헤더의 stateRoot만 신뢰하면 됨
        </p>
      </div>
      <div className="not-prose"><MerkleProofViz /></div>
    </section>
  );
}

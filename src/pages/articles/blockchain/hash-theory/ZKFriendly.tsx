import ZKHashViz from './viz/ZKHashViz';

export default function ZKFriendly() {
  return (
    <section id="zk-friendly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK 친화 해시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SHA-256은 비트 연산 기반 &rarr; R1CS 제약 ~25,000.
          Poseidon은 체 연산만 사용 &rarr; ~300 제약(80배 효율).
        </p>
      </div>
      <div className="not-prose"><ZKHashViz /></div>
    </section>
  );
}

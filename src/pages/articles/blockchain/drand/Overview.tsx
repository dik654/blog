import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DRAND 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          DRAND(Distributed Randomness Beacon) — 여러 노드가 협력하여 편향 불가능한 랜덤을 생성하는 프로토콜.<br />
          League of Entropy: Cloudflare, EPFL, Protocol Labs 등이 운영하는 실제 분산 비콘
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}

import QuorumViz from './viz/QuorumViz';

export default function Quorum({ title }: { title: string }) {
  return (
    <section id="quorum" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          512명 중 342명(2/3) 이상이 서명해야 유효하다.
          <br />
          이 임계값은 BFT 안전성 조건에서 도출된다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth의 Casper FFG도 2/3 투표를 요구한다.
          <br />
          같은 BFT 원리, 다른 주체 — Reth는 전체 검증자, Helios는 512명 위원회.
        </p>
      </div>
      <div className="not-prose"><QuorumViz /></div>
    </section>
  );
}

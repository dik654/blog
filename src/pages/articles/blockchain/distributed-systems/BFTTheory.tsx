import ByzantineViz from './viz/ByzantineViz';

export default function BFTTheory() {
  return (
    <section id="bft-theory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Byzantine 장군 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lamport, Shostak, Pease(1982) — 배신자가 있는 분산 합의의 형식화. n명 중 f명이 악의적일 때 합의 가능 조건.
        </p>
      </div>
      <div className="not-prose"><ByzantineViz /></div>
    </section>
  );
}

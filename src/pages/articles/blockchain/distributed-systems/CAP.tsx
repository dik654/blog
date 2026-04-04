import CAPViz from './viz/CAPViz';

export default function CAP() {
  return (
    <section id="cap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CAP 정리 & PACELC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Brewer(2000) — 분산 시스템은 C, A, P 중 최대 2가지만 동시 보장. 네트워크 분할은 불가피 &rarr; C vs A 선택.
        </p>
      </div>
      <div className="not-prose"><CAPViz /></div>
    </section>
  );
}

import UnitRootViz from './viz/UnitRootViz';

export default function UnitRoot() {
  return (
    <section id="unit-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">유한체 단위근 (Root of Unity)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          NTT의 핵심 &mdash; 재귀적으로 반씩 나눌 수 있는 단위근이 butterfly 분할을 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><UnitRootViz /></div>
    </section>
  );
}

import FaultyThresholdViz from './viz/FaultyThresholdViz';

export default function FaultyThreshold() {
  return (
    <section id="faulty-threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">f {'<'} n/3 한계 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n=3f 노드에서 합의 불가 귀류법 증명. 정직 2f+1 필요.
        </p>
      </div>
      <div className="not-prose"><FaultyThresholdViz /></div>
    </section>
  );
}

import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff → Jolteon → DiemBFT 진화</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          HotStuff의 O(n) 통신은 혁신적이었지만 정상 경로 지연이 높았음.<br />
          Jolteon은 낙관적 fast path를 추가하여 정상 시 2단계로 축소.<br />
          Ditto는 DAG fallback을 결합하고,<br />
          DiemBFT v4는 리더 평판으로 이를 실전에 투입
        </p>
        <p>
          이 아티클에서는 Jolteon의 이중 경로,<br />
          DiemBFT v4의 리더 평판 시스템을 분석
        </p>
      </div>
    </section>
  );
}

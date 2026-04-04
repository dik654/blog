import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Avalanche 합의: Snowball/Snowflake</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Avalanche 합의 프로토콜은 결정론적 BFT와 완전히 다른 접근입니다.<br />
          무작위 서브샘플링으로 O(k log n) 통신만에 합의를 달성합니다
        </p>
        <h3>확률적 합의</h3>
        <p className="leading-7">
          PBFT나 HotStuff는 결정론적으로 합의를 보장합니다.<br />
          Avalanche는 확률적으로 보장합니다. 충분한 라운드 후 번복 확률이 무시 가능 수준.<br />
          💡 트레이드오프: 절대적 안전성 대신 확장성을 얻음
        </p>
      </div>
    </section>
  );
}

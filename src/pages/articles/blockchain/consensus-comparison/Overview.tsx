import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 프로토콜 종합 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 주요 합의 프로토콜을 한눈에 비교합니다.<br />
          처리량, 지연, 안전성, 활성, 통신복잡도를 기준으로 분석합니다
        </p>
        <h3>비교 대상</h3>
        <p className="leading-7">
          PBFT, HotStuff, Tendermint, Narwhal/Bullshark,<br />
          Avalanche, Nakamoto 최장 체인 — 6가지 프로토콜.<br />
          💡 각각 다른 시대, 다른 목적으로 설계 — 절대적 우열은 없음
        </p>
      </div>
    </section>
  );
}

import ContextViz from './viz/ContextViz';
import TopologyCompareViz from './viz/TopologyCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BFT 합의 프로토콜 진화</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 PBFT → HotStuff → Autobahn으로 이어지는<br />
          BFT 합의 프로토콜의 진화 과정을 코드 수준으로 추적
        </p>
        <TopologyCompareViz />
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 프로토콜 계보</h3>
        <p>
          <strong>1999: PBFT</strong> (Castro & Liskov) — 최초의 실용적 BFT, O(n²) 통신<br />
          <strong>2018: Tendermint BFT</strong> — 블록체인 최적화 PBFT 변형 → CometBFT로 발전<br />
          <strong>2019: HotStuff</strong> (Yin et al.) — 선형 통신 복잡도, 파이프라이닝 → Libra(Diem) 채택<br />
          <strong>2023: Bullshark / Narwhal</strong> — DAG 기반 비동기 합의<br />
          <strong>2024: Autobahn</strong> (SOSP) — DAG + 선형 합의 결합, 저지연 + 빠른 복구
        </p>
      </div>
    </section>
  );
}

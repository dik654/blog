import TopologyCompareViz from './viz/TopologyCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BFT 합의 프로토콜 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          비잔틴 장애 허용(BFT) 합의 프로토콜은 분산 시스템에서 악의적 노드가 존재해도
          정상적으로 합의에 도달하는 알고리즘입니다.
          이더리움의 Casper FFG도 BFT 계열이지만, 전통적 BFT 프로토콜과는
          다른 접근 방식을 취합니다. PBFT → HotStuff → Autobahn으로 이어지는
          진화 과정을 이더리움과 비교하며 살펴봅니다.
        </p>

        <TopologyCompareViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 프로토콜 계보</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`1999: PBFT (Castro & Liskov)
  │   → 최초의 실용적 BFT, O(n²) 통신
  │
2018: Tendermint BFT
  │   → 블록체인에 최적화된 PBFT 변형
  │   → CometBFT로 발전
  │
2019: HotStuff (Yin et al.)
  │   → 선형 통신 복잡도, 파이프라이닝
  │   → Facebook Libra(Diem)에 채택
  │
2020: 이더리움 Casper FFG
  │   → PoS + BFT hybrid, 대규모 검증자
  │
2023: Bullshark / Narwhal
  │   → DAG 기반 비동기 합의
  │
2024: Autobahn (SOSP)
      → DAG + 선형 합의 결합, low latency + 빠른 복구

이더리움 위치:
  Casper FFG는 "traditional BFT"가 아닌 "PoS overlay"
  → 수백만 검증자를 지원하기 위해 위원회 기반 설계
  → 최종성 지연(~12.8분)을 감수하고 확장성 확보`}</code>
        </pre>
      </div>
    </section>
  );
}

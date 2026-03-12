export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CometBFT 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT(구 Tendermint Core)는 블록체인 애플리케이션을 위한
          <strong> BFT(Byzantine Fault Tolerant) 합의 엔진</strong>입니다.
          이더리움이 EL(Execution Layer) + CL(Consensus Layer)로 분리된 것처럼,
          CometBFT는 <strong>합의</strong>와 <strong>애플리케이션 로직</strong>을
          ABCI(Application BlockChain Interface)라는 인터페이스로 분리합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움과의 구조 비교</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 (Post-Merge)          CometBFT + Cosmos SDK
┌────────────────────┐       ┌────────────────────┐
│  Consensus Layer   │       │     CometBFT       │
│  (Lighthouse 등)   │       │  (합의 + P2P + 멤풀) │
│  - Casper FFG      │       │  - Tendermint BFT   │
│  - LMD-GHOST       │       │  - Gossip P2P       │
├────────────────────┤       ├────────────────────┤
│   Engine API       │       │      ABCI           │
├────────────────────┤       ├────────────────────┤
│  Execution Layer   │       │   Application       │
│  (reth/geth)       │       │  (Cosmos SDK 등)    │
│  - EVM 실행        │       │  - 모듈 기반 상태머신 │
│  - 상태 관리       │       │  - 키퍼 패턴         │
└────────────────────┘       └────────────────────┘`}</code>
        </pre>
        <p>
          핵심 차이: 이더리움은 <strong>PoS + fork choice rule</strong>(확률적 최종성)을
          사용하지만, CometBFT는 <strong>단일 슬롯 최종성(instant finality)</strong>을
          제공합니다. 블록이 커밋되면 즉시 되돌릴 수 없습니다.
        </p>
      </div>
    </section>
  );
}

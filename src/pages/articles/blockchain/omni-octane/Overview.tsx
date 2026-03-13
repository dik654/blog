export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Omni Octane 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Omni Network는 이더리움 롤업들을 연결하는 크로스체인 프로토콜입니다.
          핵심 혁신인 <strong>Octane</strong>은 CometBFT 합의 엔진 위에서
          <strong>EVM 실행 환경</strong>을 통합하는 엔진으로,
          이더리움의 EL+CL 분리 구조를 Cosmos 생태계에서 재현합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Octane = CometBFT + EVM (Engine API)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 (Post-Merge)              Omni (Octane)
┌────────────────────┐          ┌────────────────────┐
│  Consensus Layer   │          │     CometBFT        │
│  (Beacon Chain)    │          │  (Cosmos 합의)       │
├────────────────────┤          ├────────────────────┤
│   Engine API       │          │   Engine API (!)     │
│  (JSON-RPC)        │          │  (동일한 인터페이스)   │
├────────────────────┤          ├────────────────────┤
│  Execution Layer   │          │   EVM (go-ethereum)  │
│  (geth/reth)       │          │  (geth 기반 실행)     │
└────────────────────┘          └────────────────────┘

핵심 인사이트:
  Octane은 이더리움의 Engine API를 그대로 활용하여
  CometBFT와 geth를 연결합니다.
  → 이더리움의 EL 클라이언트를 거의 수정 없이 재활용!`}</code>
        </pre>
      </div>
    </section>
  );
}

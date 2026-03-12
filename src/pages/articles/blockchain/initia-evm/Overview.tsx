export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initia MiniEVM 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Initia의 MiniEVM은 Cosmos SDK 모듈로 구현된 <strong>경량 EVM</strong>입니다.
          Omni Octane이 Engine API로 외부 geth를 연결하는 반면,
          MiniEVM은 <strong>EVM을 Cosmos 모듈 내부에 직접 임베딩</strong>합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 통합 방식 비교</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`EVM 통합의 세 가지 접근법:

1. 이더리움 네이티브:
   ┌─────────┐
   │   CL    │ ← Engine API → │   EL (geth)   │
   └─────────┘                 │   EVM 내장     │
                               └───────────────┘

2. Omni Octane (외부 연결):
   ┌─────────────┐
   │  CometBFT   │ ← ABCI → │ Cosmos App │ ← Engine API → │ geth │
   └─────────────┘           └────────────┘                 │ EVM  │
                                                            └──────┘

3. Initia MiniEVM (내부 임베딩):
   ┌─────────────┐
   │  CometBFT   │ ← ABCI → │ Cosmos App      │
   └─────────────┘           │ ┌──────────────┐│
                             │ │ x/evm 모듈   ││  ← EVM이 모듈 안에!
                             │ │ (MiniEVM)     ││
                             │ └──────────────┘│
                             │ ┌──────────────┐│
                             │ │ x/bank 등    ││
                             │ └──────────────┘│
                             └─────────────────┘

트레이드오프:
  외부 연결: 이더리움 클라이언트 재활용, 하지만 IPC 오버헤드
  내부 임베딩: 낮은 지연, 하지만 EVM 업데이트를 직접 추적해야 함`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Initia Interwoven Rollup 구조</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Initia 생태계 구조:

┌─────────────────────────────────────────┐
│         Initia L1 (Cosmos SDK)          │
│  합의 + 결산 + IBC 허브                   │
├─────────────────────────────────────────┤
│              OPinit Stack               │
│  (Optimistic Rollup 보안 레이어)         │
├──────────┬──────────┬───────────────────┤
│ Minitia  │ Minitia  │ Minitia           │
│ (EVM)    │ (Wasm)   │ (MoveVM)          │
│ MiniEVM  │ MiniWasm │ MiniMove          │
│ ~500ms   │          │                   │
│ ~10k TPS │          │                   │
└──────────┴──────────┴───────────────────┘

MiniEVM = EVM 타입 Minitia (Optimistic Rollup L2)
  - L2에 별도 검증자 불필요 (L1에서 보안 파생)
  - CometBFT 합의로 빠른 최종성
  - IBC로 L1 및 다른 Minitia와 통신`}</code>
        </pre>
      </div>
    </section>
  );
}

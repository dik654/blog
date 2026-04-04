export const EVM_APPROACHES_CODE = `EVM 통합의 세 가지 접근법:

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
  내부 임베딩: 낮은 지연, 하지만 EVM 업데이트를 직접 추적해야 함`;

export const EVM_APPROACHES_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '이더리움 네이티브' },
  { lines: [9, 13] as [number, number], color: 'emerald' as const, note: 'Octane: 외부 연결' },
  { lines: [15, 25] as [number, number], color: 'amber' as const, note: 'MiniEVM: 내부 임베딩' },
];

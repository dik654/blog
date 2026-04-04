export const OCTANE_ARCH_CODE = `이더리움 (Post-Merge)              Omni (Octane)
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
  → 이더리움의 EL 클라이언트를 거의 수정 없이 재활용!`;

export const OCTANE_ARCH_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '합의 레이어' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'Engine API (동일!)' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: 'EVM 실행 레이어' },
];

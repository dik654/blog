export const BEACON_COMPARE_CODE = `이더리움 (Post-Merge)              Berachain (BeaconKit)
┌────────────────────┐          ┌────────────────────┐
│  Beacon Chain      │          │  BeaconKit          │
│  (Lighthouse 등)   │          │  (Cosmos SDK 모듈)   │
│  - Casper FFG      │          │  - CometBFT (합의)   │
│  - LMD-GHOST       │          │  - Beacon 스펙 구현   │
│  - 검증자 관리     │          │  - PoL 검증자 관리    │
├────────────────────┤          ├────────────────────┤
│   Engine API       │          │   Engine API (동일!)  │
├────────────────────┤          ├────────────────────┤
│  Execution Layer   │          │  Execution Layer     │
│  (geth/reth)       │          │  (geth/reth 재활용!)  │
│  - EVM             │          │  - 동일한 EVM         │
└────────────────────┘          └────────────────────┘

핵심 포인트:
  1. Engine API를 통해 이더리움 EL 클라이언트를 그대로 사용
  2. Beacon Chain 스펙(검증자, 슬롯, 에폭)을 Cosmos SDK 모듈로 구현
  3. Casper FFG 대신 CometBFT의 즉시 최종성 사용
  4. PoS 대신 PoL(Proof of Liquidity)로 경제적 보안 확보`;

export const BEACON_COMPARE_ANNOTATIONS = [
  { lines: [2, 7] as [number, number], color: 'sky' as const, note: '합의 레이어 비교' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: 'Engine API 동일 사용' },
  { lines: [10, 13] as [number, number], color: 'amber' as const, note: 'EL 클라이언트 재활용' },
];

export const archCode = `World Chain 전체 아키텍처:

┌─────────────────── Sequencer Infrastructure ────────────┐
│  ┌──────────────────────────────────────────────────┐   │
│  │  Consensus Layer (op-node)                       │   │
│  │  Engine API (OP Stack 표준)                       │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                       │
│           rollup-boost (Engine API 멀티플렉서)          │
│                 │                                       │
│    ┌────────────┴──────────────┐                        │
│    ▼                           ▼                        │
│  Execution Layer            External Builders           │
│  (World Chain Node)         ┌─────────────────┐        │
│  - reth 기반                │ World Chain     │        │
│  - OpEvmConfig              │ Builder (PBH)   │        │
│  - PBH 트랜잭션 풀          │ - PayloadBuilder│        │
│  - WorldChainOrdering       │ - PBH Validator │        │
│                             └─────────────────┘        │
└─────────────────────────────────────────────────────────┘

핵심: PBH(Priority Blockspace for Humans) 메커니즘으로
      검증된 World ID 보유자에게 블록 상단 우선순위 부여`;

export const archAnnotations = [
  { lines: [4, 7] as [number, number], color: 'sky' as const, note: 'OP Stack Consensus Layer' },
  { lines: [9, 9] as [number, number], color: 'emerald' as const, note: 'rollup-boost 프록시' },
  { lines: [13, 18] as [number, number], color: 'amber' as const, note: 'EL + External Builder' },
  { lines: [22, 23] as [number, number], color: 'rose' as const, note: 'PBH 핵심 가치' },
];

export const problemCode = `기존 블록체인의 문제점 vs World Chain 해결책:

기존 블록체인 (가스비 기준 정렬):
  1. 봇 트래픽 지배 → 네트워크 트래픽의 대부분 차지
  2. 높은 가스비 → 가스비 경쟁으로 비용 급증
  3. 불공정한 우선순위 → 높은 수수료 = 높은 우선순위
  4. 실제 사용자 소외 → 일반 사용자가 밀려남

World Chain (PBH 정렬):
  1순위: World ID 검증 여부 (인간 우선)
  2순위: 가스비 (검증된 사용자 내에서)
  → 실제 사용자 우선 보장
  → 예측 가능한 트랜잭션 비용
  → 네트워크 혼잡 시에도 접근성 보장`;

export const problemAnnotations = [
  { lines: [3, 7] as [number, number], color: 'rose' as const, note: '기존 문제점' },
  { lines: [9, 14] as [number, number], color: 'emerald' as const, note: 'PBH 해결책' },
];

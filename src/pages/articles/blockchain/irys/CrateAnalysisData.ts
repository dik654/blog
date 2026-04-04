export const CRATE_TREE_CODE = `irys/
├── irys-chain/           # 메인 바이너리 & 체인 코어
│   ├── src/main.rs       # 진입점, 노드 부트스트랩
│   └── src/node.rs       # 컴포넌트 조립 & 초기화
├── irys-actors/          # Actix 기반 비동기 액터 시스템
│   ├── mining_actor.rs   # 마이닝 루프
│   └── block_actor.rs    # 블록 처리 액터
├── irys-vdf/             # SHA256 순차 VDF 합의
├── irys-packing/         # 매트릭스 패킹 (CPU + CUDA)
├── irys-storage/         # 청킹, Merkle 인덱싱
├── irys-reth-node-bridge/ # Reth EVM 실행 계층 브릿지
├── irys-gossip/          # P2P 가십 프로토콜
├── irys-api-server/      # REST API + JSON-RPC
└── irys-types/           # 공유 타입 정의`;

export const CRATE_TREE_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '체인 코어 & 노드 조립' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: '비동기 액터 시스템' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: 'VDF + 패킹 합의 레이어' },
];

export const DEP_GRAPH_CODE = `// 의존성 방향: 하위 → 상위
irys-types           ← 모든 크레이트가 참조
irys-storage         ← irys-chain, irys-packing
irys-vdf             ← irys-chain (합의 스케줄링)
irys-packing         ← irys-chain (패킹 서비스)
irys-actors          ← irys-chain (액터 라우팅)
irys-gossip          ← irys-chain (P2P 통신)
irys-reth-node-bridge ← irys-chain (EVM 실행)
irys-api-server      ← irys-chain (HTTP 엔드포인트)

// 외부 의존성
reth         → Ethereum 실행 계층 (EVM, 트랜잭션, 상태)
actix-web    → HTTP 서버 & 액터 프레임워크
tokio        → 비동기 런타임`;

export const DEP_GRAPH_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '코어 크레이트 의존 관계' },
  { lines: [11, 14] as [number, number], color: 'violet' as const, note: '주요 외부 의존성' },
];

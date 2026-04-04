export const STATE_SYNC_CODE = `State Sync 흐름:

이더리움 snap sync              CometBFT State Sync
─────────────────────          ─────────────────────
1. 피벗 블록 선택               1. 신뢰할 수 있는 높이 선택
2. 헤더 체인 다운로드            2. Light Client 검증
3. 상태 트라이 청크 다운로드      3. 스냅샷 청크 다운로드
4. 상태 치유(healing)           4. ABCI OfferSnapshot/ApplySnapshotChunk
5. 나머지 블록 실행              5. 나머지 블록부터 정상 합의

핵심: 두 방식 모두 "전체 히스토리 리플레이" 없이
      최신 상태에서 시작할 수 있게 해줌

State Sync 설정 요구사항:
  - 신뢰할 수 있는 RPC 서버 (2개 이상 권장)
  - 신뢰할 수 있는 height + block hash
  - Trust Period (~unbonding 기간의 2/3)
  → Light Client로 app hash를 체인에 대해 검증 후 합의 전환

주의: State Sync는 과거 블록을 백필하지 않음
  → 잘린 히스토리(truncated history)로 시작
  → 전체 히스토리가 필요하면 Block Sync 사용`;

export const STATE_SYNC_ANNOTATIONS = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: '이더리움 vs CometBFT 동기화 비교' },
  { lines: [14, 18] as [number, number], color: 'emerald' as const, note: 'State Sync 설정 요구사항' },
];

export const REPO_CODE = `cometbft/
├── abci/          # ABCI 인터페이스 정의
├── consensus/     # Tendermint BFT 상태 머신
├── mempool/       # ClistMempool, CAT Mempool
├── p2p/           # MConnection, PEX, 피어 관리
├── state/         # 블록 실행 & 상태 저장
├── statesync/     # 상태 스냅샷 동기화
├── blockchain/    # 블록 저장소 & Blockchain Reactor
├── evidence/      # 이중 서명 증거 관리
├── light/         # Light Client 검증
├── proxy/         # ABCI 프록시 (앱 연결)
└── rpc/           # JSON-RPC & WebSocket API`;

export const REPO_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '핵심 모듈 (합의, 멤풀, P2P)' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '동기화 모듈' },
];

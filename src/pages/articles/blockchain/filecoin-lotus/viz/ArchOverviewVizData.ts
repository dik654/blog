export const LAYERS = [
  { label: 'JSON-RPC', sub: 'lotus daemon API', color: '#6366f1', y: 10 },
  { label: 'Consensus', sub: 'FilecoinEC · VRF 선출', color: '#8b5cf6', y: 52 },
  { label: 'ChainStore', sub: 'Blockstore · TipSet 캐시', color: '#3b82f6', y: 94 },
  { label: 'StateManager', sub: 'FVM 실행 · 마이그레이션', color: '#10b981', y: 136 },
  { label: 'Storage', sub: 'Sealing · PoSt 증명', color: '#f59e0b', y: 178 },
  { label: 'libp2p', sub: 'GossipSub · Bitswap', color: '#ef4444', y: 220 },
];

export const STEPS = [
  {
    label: 'lotus daemon — JSON-RPC 진입점',
    body: 'node/impl/full/ 하위에 Chain, State, Gas API 구현\n외부 요청이 이 레이어를 통해 내부 모듈에 접근',
  },
  {
    label: 'FilecoinEC — Expected Consensus 엔진',
    body: 'VRF 리더 선출 → ValidateBlock() → WinningPoSt 검증\nstore, beacon, sm, verifier 4개 의존성 조합',
  },
  {
    label: 'ChainStore — 블록 저장소 + 캐시',
    body: 'chain/state 2개 Blockstore 분리\nARC 캐시(TipSet 8192 + MsgMeta 2048)로 디스크 접근 최소화',
  },
  {
    label: 'StateManager — 상태 쿼리 + 마이그레이션',
    body: 'Executor.ExecuteTipSet()으로 FVM 실행\n네트워크 버전별 stateMigrations 맵으로 업그레이드 관리',
  },
  {
    label: 'Storage — Sealing + PoSt 파이프라인',
    body: 'PC1(SDR) → PC2(Merkle) → C1/C2(Groth16) → WindowPoSt\nCPU/GPU 하드웨어 분리 설계',
  },
  {
    label: 'libp2p — P2P 네트워크 레이어',
    body: '/fil/blocks + /fil/msgs GossipSub 토픽\nHello → BlockSync → GraphSync → CHAIN_FOLLOW 모드',
  },
];

export const STEP_REFS: Record<number, string> = {
  1: 'lotus-filecoin-ec',
  2: 'lotus-chainstore',
  3: 'lotus-statemgr',
};

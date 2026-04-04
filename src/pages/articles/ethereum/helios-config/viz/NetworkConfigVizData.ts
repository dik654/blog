/** NetworkConfig Viz — 색상 + step 정의 */

export const C = {
  mainnet: '#6366f1',   // 인디고 — Mainnet
  sepolia: '#10b981',   // 에메랄드 — Sepolia
  holesky: '#f59e0b',   // 앰버 — Holesky
  spec: '#8b5cf6',      // 보라 — ConsensusSpec
  cl: '#3b82f6',        // 파랑 — CL (Beacon API)
  el: '#10b981',        // 에메랄드 — EL (JSON-RPC)
  helios: '#6366f1',    // 인디고 — Helios 노드
  muted: '#94a3b8',     // 회색 — 비활성
  alert: '#ef4444',     // 빨강 — 오류
};

export const STEPS = [
  {
    label: 'Network enum — Mainnet · Sepolia · Holesky 세 변형',
    body: '각 variant마다 genesis_validators_root, fork_versions, 기본 체크포인트가 결정된다.\n네트워크를 잘못 선택하면 genesis_root 불일치 → 부트스트랩 실패.',
  },
  {
    label: 'ConsensusSpec — 슬롯/에폭/period 시간 계산',
    body: '1 slot = 12초, 1 epoch = 32 slots = 6.4분, 1 period = 256 epochs ≈ 27시간.\nReth(EL)에는 이 파라미터가 없다 — Helios가 CL을 직접 구현하기 때문에 필수.',
  },
  {
    label: 'CL + EL 이중 RPC 연결 — Helios의 외부 의존',
    body: 'consensus_rpc: Beacon API 서버 (/eth/v1/beacon/*) → 헤더·업데이트 수신.\nexecution_rpc: JSON-RPC 서버 (eth_getProof 등) → 상태 증명 요청.\nReth는 자체 API를 제공하지만, Helios는 외부 RPC에 의존한다.',
  },
];

export const C = {
  cl: '#8b5cf6', extract: '#6366f1', newpay: '#10b981',
  fork: '#f59e0b', get: '#ec4899', mev: '#06b6d4',
};

export const STEPS = [
  { label: '왜 CL이 EL을 구동하는가', body: 'PoS 이후 CL이 타이밍과 포크 선택 결정, Engine API가 유일한 연결점' },
  { label: '① 비콘 블록 도착', body: 'Gossipsub으로 수신한 블록 내 ExecutionPayload를 추출' },
  { label: '② NewPayloadV3 호출', body: 'EL이 페이로드를 실행하고 VALID/INVALID 상태를 반환' },
  { label: '③ ForkchoiceUpdatedV3', body: 'head/safe/finalized 해시를 EL에 전달하여 캐노니컬 체인 갱신' },
  { label: '④ GetPayloadV3 (블록 빌드)', body: 'FCU에 payloadAttributes 포함 → EL 빌드 → 완성 페이로드 회수' },
  { label: '⑤ MEV-Boost 비드 비교', body: '로컬 빌드 vs 릴레이 비드의 가치를 비교하여 높은 쪽을 선택' },
];

export const NODES = [
  { id: 'gossip', label: '블록 수신', x: 15, y: 20 },
  { id: 'extract', label: '페이로드 추출', x: 225, y: 20 },
  { id: 'newpay', label: 'NewPayloadV3', x: 435, y: 20 },
  { id: 'el', label: 'EL (Geth)', x: 435, y: 110 },
  { id: 'fork', label: 'ForkchoiceUpd', x: 15, y: 110 },
  { id: 'getpay', label: 'GetPayloadV3', x: 225, y: 110 },
  { id: 'mev', label: 'MEV-Boost', x: 225, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '블록 파싱' },
  { from: 1, to: 2, label: 'Engine API' },
  { from: 2, to: 3, label: '실행 검증' },
  { from: 4, to: 3, label: 'head 갱신' },
  { from: 4, to: 5, label: 'attributes' },
  { from: 5, to: 6, label: '비드 비교' },
];

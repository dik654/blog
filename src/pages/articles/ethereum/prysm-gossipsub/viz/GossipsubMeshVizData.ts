export const C = { mesh: '#8b5cf6', topic: '#3b82f6', fork: '#10b981', msg: '#f59e0b', valid: '#ef4444', fwd: '#ec4899' };

export const STEPS = [
  { label: '왜 메시 기반 전파인가', body: 'Flood 대비 GossipSub는 메시 토폴로지로 연결 피어에만 전파' },
  { label: '① 토픽 구독', body: 'beacon_block, attestation_{subnet} 등 토픽별 독립 메시 형성' },
  { label: '② 포크 다이제스트 프리픽스', body: 'fork_digest를 토픽명에 부여하여 다른 네트워크/포크 메시지 격리' },
  { label: '③ 메시지 수신 & 디코딩', body: 'Snappy 해제 → SSZ 디코딩, 무효 포맷은 즉시 폐기' },
  { label: '④ 검증 파이프라인', body: '서명→슬롯→제안자→이중 제안 확인 후 Accept/Reject/Ignore' },
  { label: '⑤ 메시 피어에게 전파', body: 'Accept만 전파, Reject은 피어 감점, Ignore는 무시' },
];

export const NODES = [
  { id: 'gossip', label: 'GossipSub', x: 240, y: 10 },
  { id: 'block', label: 'beacon_block', x: 30, y: 80 },
  { id: 'attest', label: 'attestation', x: 240, y: 80 },
  { id: 'sync', label: 'sync_committee', x: 450, y: 80 },
  { id: 'decode', label: 'SSZ-Snappy', x: 130, y: 170 },
  { id: 'validate', label: '검증 파이프라인', x: 340, y: 170 },
  { id: 'forward', label: '메시 전파', x: 240, y: 250 },
];

export const EDGES = [
  { from: 0, to: 1, label: '구독' },
  { from: 0, to: 2, label: '구독' },
  { from: 0, to: 3, label: '구독' },
  { from: 1, to: 4, label: '수신' },
  { from: 4, to: 5, label: '디코딩' },
  { from: 5, to: 6, label: 'Accept' },
];

export const MESH_VS_FLOOD = [
  { method: 'Flood', peers: 'ALL', bw: 'O(n)', cons: '대역폭 폭발', color: '#ef4444' },
  { method: 'GossipSub', peers: 'D=6', bw: 'O(D)', cons: '메시 유지 필요', color: '#10b981' },
];

export const CORE_FIELDS = [
  { name: 'mesh', desc: '토픽별 메시 피어 (D=6 목표)', color: '#10b981' },
  { name: 'fanout', desc: '구독 없이 발행만 하는 토픽의 피어', color: '#f59e0b' },
  { name: 'mcache', desc: '최근 메시지 캐시 (IHAVE/IWANT 교환용)', color: '#8b5cf6' },
  { name: 'peer_score', desc: '피어 스코어링 시스템', color: '#06b6d4' },
  { name: 'duplicate_cache', desc: '이미 본 메시지 필터 (LRU)', color: '#ec4899' },
];

export const GOSSIP_MSGS = [
  { name: 'GRAFT', desc: '메시에 추가 요청', color: '#10b981' },
  { name: 'PRUNE', desc: '메시에서 제거 통보', color: '#ef4444' },
  { name: 'IHAVE', desc: '보유 메시지 ID 목록 광고', color: '#f59e0b' },
  { name: 'IWANT', desc: '특정 메시지 요청', color: '#8b5cf6' },
  { name: 'IDONTWANT', desc: '이미 가진 메시지 거부 (v1.2)', color: '#06b6d4' },
];

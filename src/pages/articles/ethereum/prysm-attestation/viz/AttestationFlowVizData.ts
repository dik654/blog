export const C = { why: '#8b5cf6', commit: '#6366f1', data: '#10b981', sign: '#f59e0b', agg: '#ef4444', block: '#3b82f6' };

export const STEPS = [
  { label: '왜 어테스테이션이 합의의 핵심인가', body: '매 에폭 1회 투표가 LMD-GHOST 가중치와 Casper FFG finality를 결정' },
  { label: '① 위원회 할당', body: '에폭 시작 시 검증자를 위원회에 배정, 슬롯에 매핑하여 투표' },
  { label: '② AttestationData 생성', body: 'source(이전 justified CP) + target(현재 에폭 CP) + head(블록 루트)' },
  { label: '③ BLS 서명', body: '슬래싱 방지 DB로 이중 투표 확인 후 BLS 서명 생성' },
  { label: '④ 서브넷 + 집계', body: 'CommitteeIndex로 서브넷 결정, gossip 전파 후 BLS aggregate' },
  { label: '⑤ 블록에 포함', body: '블록 제안자가 풀에서 최대 128개 집계 어테스테이션 선택' },
];

export const NODES = [
  { id: 'validator', label: 'Validator #N', x: 15, y: 20 },
  { id: 'committee', label: '위원회 (64개)', x: 220, y: 20 },
  { id: 'data', label: 'AttestData', x: 425, y: 20 },
  { id: 'sign', label: 'BLS 서명', x: 100, y: 110 },
  { id: 'subnet', label: 'Subnet 0~63', x: 310, y: 110 },
  { id: 'aggregate', label: 'BLS Aggregate', x: 120, y: 200 },
  { id: 'block', label: '블록 (128개)', x: 340, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '에폭 시작' },
  { from: 1, to: 2, label: 'slot 도달' },
  { from: 2, to: 3, label: '서명 요청' },
  { from: 3, to: 4, label: 'gossip' },
  { from: 4, to: 5, label: '집계' },
  { from: 5, to: 6, label: '제안자 선택' },
];

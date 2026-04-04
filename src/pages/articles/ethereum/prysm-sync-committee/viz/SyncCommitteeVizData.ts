export const C = { why: '#8b5cf6', select: '#6366f1', sign: '#10b981', agg: '#f59e0b', block: '#ef4444', reward: '#3b82f6' };

export const STEPS = [
  { label: '왜 싱크 위원회가 필요한가', body: 'Altair 도입, 라이트 클라이언트가 512명 서명으로 헤드를 검증' },
  { label: '① 512명 선정', body: '전체 활성 검증자에서 무작위 512명, 256 에폭(~27시간) 고정' },
  { label: '② SubmitSyncCommitteeMessage', body: '매 슬롯 헤드 블록 루트에 BLS 서명, DomainSyncCommittee 사용' },
  { label: '③ 블록 루트 서명', body: 'HeadBlockRoot 조회 후 어테스테이션과 별도 도메인으로 서명' },
  { label: '④ Contribution 집계', body: '서브넷별 BLS aggregate — 비트필드 + 집계 서명' },
  { label: '⑤ SyncAggregate → 블록 포함', body: '블록 제안자가 SyncAggregate 포함, 참여 보상 + 불참 패널티' },
];

export const NODES = [
  { id: 'validators', label: '전체 검증자', x: 15, y: 20 },
  { id: 'committee', label: '512명 선정', x: 225, y: 20 },
  { id: 'slot', label: '매 슬롯 서명', x: 435, y: 20 },
  { id: 'headroot', label: 'HeadBlockRoot', x: 80, y: 110 },
  { id: 'contrib', label: 'Contribution', x: 290, y: 110 },
  { id: 'aggregate', label: 'SyncAggregate', x: 100, y: 200 },
  { id: 'block', label: '블록 포함', x: 310, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '256 에폭' },
  { from: 1, to: 2, label: '매 슬롯' },
  { from: 2, to: 3, label: '루트 조회' },
  { from: 3, to: 4, label: 'BLS 서명' },
  { from: 4, to: 5, label: '집계' },
  { from: 5, to: 6, label: '제안자' },
];

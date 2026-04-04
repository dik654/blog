export const C = { hot: '#8b5cf6', epoch: '#3b82f6', save: '#10b981', summary: '#f59e0b', replay: '#ef4444', cold: '#ec4899' };

export const STEPS = [
  { label: '왜 매 슬롯 상태를 저장할 수 없는가', body: '수백 MB × 12초마다 저장하면 하루 TB 초과, 전략적 저장 필수' },
  { label: '① Hot Region: 인메모리 캐시', body: '최근 수 에폭 상태를 메모리에 유지하여 즉시 접근' },
  { label: '② 에폭 경계 상태 저장', body: '32슬롯마다 에폭 전환 시점 상태만 DB에 저장' },
  { label: '③ StateSummary로 빈 슬롯 처리', body: '미저장 슬롯은 (슬롯, 블록 루트)만 기록, 필요 시 가까운 상태에서 재생' },
  { label: '④ 가장 가까운 상태에서 재생', body: 'ReplayBlocks — 저장 상태 기점으로 블록을 순차 적용하여 계산' },
  { label: '⑤ Cold Archive: 오래된 상태', body: 'Finalized 이후 K 슬롯마다 아카이브, Hot→Cold 전환으로 메모리 해제' },
];

export const NODES = [
  { id: 'slots', label: '슬롯 스트림', x: 240, y: 10 },
  { id: 'hot', label: 'Hot Cache', x: 30, y: 80 },
  { id: 'epoch', label: '에폭 경계', x: 240, y: 80 },
  { id: 'summary', label: 'StateSummary', x: 450, y: 80 },
  { id: 'replay', label: 'ReplayBlocks', x: 130, y: 170 },
  { id: 'cold', label: 'Cold Archive', x: 340, y: 170 },
  { id: 'db', label: 'BoltDB', x: 240, y: 250 },
];

export const EDGES = [
  { from: 0, to: 1, label: '최근' },
  { from: 0, to: 2, label: '32슬롯' },
  { from: 0, to: 3, label: '나머지' },
  { from: 3, to: 4, label: '필요 시' },
  { from: 2, to: 5, label: 'finalized' },
  { from: 4, to: 6, label: '계산' },
  { from: 5, to: 6, label: '저장' },
];

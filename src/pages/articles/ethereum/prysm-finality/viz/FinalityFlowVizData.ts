export const C = { why: '#8b5cf6', cp: '#6366f1', vote: '#10b981', just: '#f59e0b', final: '#ef4444', prune: '#3b82f6' };

export const STEPS = [
  { label: '왜 Finality가 필요한가', body: '포크 선택만으로는 체인이 뒤집힐 수 있어 "절대 불가역" 확정 필요' },
  { label: '① Checkpoint 구조', body: 'Checkpoint = {Epoch, Root}, 에폭 경계 첫 슬롯 블록 지칭' },
  { label: '② 슈퍼마조리티 투표', body: '전체 활성 밸런스의 2/3 이상이 같은 타겟에 투표해야 함' },
  { label: '③ Justified', body: '2/3 투표 달성 → justified (아직 가역)' },
  { label: '④ Finalized', body: '연속 2 에폭 justified 유지 → finalized (슬래싱 없이 불가역)' },
  { label: '⑤ Prune', body: 'finalized 아래 모든 포크 노드 삭제, 메모리 확보' },
];

export const NODES = [
  { id: 'epoch-n', label: 'Epoch 150', x: 15, y: 20 },
  { id: 'cp-n', label: 'CP (Slot 4800)', x: 220, y: 20 },
  { id: 'vote', label: '2/3 투표', x: 425, y: 20 },
  { id: 'justified', label: 'Just (Ep 150)', x: 110, y: 110 },
  { id: 'epoch-n1', label: 'Epoch 151', x: 320, y: 110 },
  { id: 'finalized', label: 'Final (Ep 149)', x: 110, y: 200 },
  { id: 'prune', label: 'Prune 완료', x: 320, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '경계 블록' },
  { from: 1, to: 2, label: '타겟 투표' },
  { from: 2, to: 3, label: '≥ 2/3' },
  { from: 3, to: 4, label: '다음 에폭' },
  { from: 4, to: 5, label: '연속 justified' },
  { from: 5, to: 6, label: '하위 삭제' },
];

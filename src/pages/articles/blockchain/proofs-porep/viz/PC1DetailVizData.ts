export const C = { node: '#6366f1', sha: '#f59e0b', drg: '#10b981', exp: '#8b5cf6', seq: '#ef4444' };

export const STEPS = [
  {
    label: 'DRG + Expander 그래프 구조',
    body: '각 노드는 두 종류의 부모를 가짐: — DRG 부모 — 직전 6개 노드 (순차 의존성)',
  },
  {
    label: '노드 레이블 계산 (순차 필수)',
    body: 'label[i] = SHA256(replica_id || parent_labels)',
  },
  {
    label: '레이어 반복 (11회)',
    body: 'Layer 1: 원본 데이터 + DRG 부모',
  },
];

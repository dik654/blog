import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  view1: '#6366f1',   // indigo
  view2: '#10b981',   // emerald
  query: '#6366f1',   // indigo — Query
  key: '#10b981',     // emerald — Key
  value: '#f59e0b',   // amber — Value
  attn: '#ec4899',    // pink — attention weight
  head: '#8b5cf6',    // violet — multi-head
  cls: '#ef4444',     // red — 분류
};

export const STEPS: StepDef[] = [
  {
    label: 'Cross-Attention: 뷰 간 정보 교환',
    body: 'View 1의 피처를 Query로, View 2의 피처를 Key/Value로 사용. "View 1의 어떤 영역이 View 2의 어떤 영역과 관련 있는지" 자동 학습.',
  },
  {
    label: 'Attention Score 계산',
    body: 'Q(View 1) · K(View 2)^T / sqrt(d_k) → softmax → 확률 분포.\n각 View 1 패치가 View 2의 어떤 패치에 집중할지 결정하는 가중치.',
  },
  {
    label: 'Multi-Head Cross-Attention',
    body: '여러 헤드가 서로 다른 관계를 병렬 학습: 질감 매칭, 구조적 대응, 색상 일관성 등.\n양방향 교차 어텐션으로 View 1→2, View 2→1 모두 수행하면 더욱 풍부한 표현.',
  },
  {
    label: 'Attention Fusion 장단점',
    body: '장점: 어떤 뷰의 어떤 영역이 중요한지 동적으로 결정. 뷰 간 관계를 명시적으로 모델링.\n단점: O(n^2) 복잡도. 학습 데이터가 적으면 과적합 위험.',
  },
];

/** attention score 예시 (4x4) — View1 패치 → View2 패치 */
export const ATTN_SCORES = [
  [0.6, 0.2, 0.1, 0.1],
  [0.1, 0.5, 0.3, 0.1],
  [0.1, 0.1, 0.6, 0.2],
  [0.2, 0.1, 0.1, 0.6],
];

export const STEPS = [
  {
    label: '① 대조 학습의 핵심 원리',
    body: '유사한 샘플의 임베딩은 가깝게(attract), 다른 샘플의 임베딩은 멀게(repel) 배치하는 학습 방식.\n기존 분류: "이것은 고양이" → 직접 클래스 예측. 대조 학습: "이 둘은 비슷하다/다르다" → 관계 학습.\n임베딩 공간의 구조 자체를 학습하므로, 검색·클러스터링·이상탐지 등 거리 기반 태스크에 범용 적용.',
  },
  {
    label: '② Anchor / Positive / Negative 삼중 구조',
    body: 'Anchor(기준 샘플)에 대해 Positive(유사 샘플)는 당기고, Negative(다른 샘플)는 밀어내는 구조.\n학습 목표: d(anchor, positive) << d(anchor, negative). d는 유클리드 거리 또는 1 - cosine similarity.\n이 구조가 Triplet Loss, InfoNCE, SupCon Loss 등 모든 대조 학습 손실 함수의 공통 기반.',
  },
  {
    label: '③ Self-supervised vs Supervised Contrastive',
    body: 'Self-supervised: 라벨 없이 augmentation으로 positive pair 생성. 같은 이미지의 두 변환 = positive.\nSupervised: 라벨 활용. 같은 클래스의 모든 샘플 = positive. 더 강한 학습 신호.\nSelf-supervised는 대규모 비라벨 데이터에 적합, Supervised는 라벨이 있을 때 downstream 정확도 우위.',
  },
  {
    label: '④ 대조 학습의 활용 범위',
    body: '시각: 같은 image의 augmentation 또는 같은 원인의 defect pair.\nNLP: 같은 의미를 가진 sentence pair.\n유전체: 같은 기능을 보존하는 sequence pair와 기능이 다른 hard negative.\n추천: 같은 intent를 반영하는 user-item sequence pair.\n각 분야의 benchmark 수치는 서로 옮겨 비교하지 않고 pair 정의와 split을 먼저 확인한다.',
  },
];

export const C = {
  anchor: '#6366f1',
  positive: '#10b981',
  negative: '#ef4444',
  self: '#8b5cf6',
  sup: '#f59e0b',
  muted: '#94a3b8',
  bg: '#f8fafc',
};

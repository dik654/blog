export const STEPS = [
  {
    label: '① Triplet 구조: Anchor-Positive-Negative 임베딩 공간',
    body: 'Anchor(a), Positive(p), Negative(n) 세 점이 임베딩 공간에 배치.\n학습 목표: d(a,p) + margin < d(a,n). positive가 negative보다 최소 margin만큼 더 가까워야 함.\n거리 d(x,y) = ||f(x) - f(y)||₂. margin α는 보통 0.2~1.0 범위.',
  },
  {
    label: '② Triplet Loss 수식과 Margin 역할',
    body: 'L = max(0, d(a,p) - d(a,n) + α). max(0, ·)로 이미 조건 충족 시 loss=0.\nd(a,p)=0.3, d(a,n)=0.8, α=0.2 → L = max(0, 0.3-0.8+0.2) = max(0, -0.3) = 0 (easy).\nd(a,p)=0.4, d(a,n)=0.5, α=0.2 → L = max(0, 0.4-0.5+0.2) = 0.1 (semi-hard).\nmargin이 클수록 positive-negative 간 더 넓은 간격 강제 → 임베딩 품질 향상, 학습 난이도 증가.',
  },
  {
    label: '③ 삼중항 유형: Easy / Semi-hard / Hard',
    body: 'Easy: d(a,n) > d(a,p) + α. 이미 충분히 분리. loss=0. 학습에 기여 안 함.\nSemi-hard: d(a,p) < d(a,n) < d(a,p) + α. 분리되었지만 margin 미달. 적절한 학습 신호.\nHard: d(a,n) < d(a,p). negative가 positive보다 더 가까움. loss 최대. 불안정 위험.\nFaceNet 권장: semi-hard mining. 초기 warm-up 후 점진적 hard 비율 증가.',
  },
  {
    label: '④ Online Hard Negative Mining (Batch Hard)',
    body: 'PK 샘플링: P개 클래스 × K개 샘플. P=18, K=4 → 배치 72개.\n각 anchor에 대해 배치 내 가장 먼 positive + 가장 가까운 negative 선택.\nOffline mining(전체 데이터 탐색) 대비 계산 효율적. 매 배치마다 새로운 hard triplet 자동 구성.\n주의: hard negative만 쓰면 학습 초기 collapsed embedding 위험 → semi-hard 혼합 권장.',
  },
];

export const C = {
  anchor: '#6366f1',
  pos: '#10b981',
  neg: '#ef4444',
  margin: '#f59e0b',
  semi: '#8b5cf6',
  muted: '#94a3b8',
};

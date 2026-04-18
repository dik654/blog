export const STEPS = [
  {
    label: '① SupCon vs SimCLR: Positive 선택 차이',
    body: 'SimCLR: positive = 같은 이미지의 다른 augmentation. 1쌍. 라벨 불필요.\nSupCon: positive = 같은 클래스의 모든 샘플. 배치 내 같은 클래스 K개 전부.\n더 많은 positive = 더 강한 학습 신호. 클래스 내 분산(intra-class variance)을 효과적으로 줄임.',
  },
  {
    label: '② SupCon Loss 수식: 클래스별 평균',
    body: 'L_i = -1/|P(i)| · Σ_{p∈P(i)} log( exp(sim(z_i,z_p)/τ) / Σ_{k≠i} exp(sim(z_i,z_k)/τ) ).\nP(i) = 배치에서 i와 같은 클래스인 샘플 집합. 분모는 i 제외 모든 샘플.\n핵심: 각 positive에 대해 개별 log를 취한 뒤 평균. 모든 positive를 균등하게 당김.',
  },
  {
    label: '③ CE vs SupCon: 라벨 노이즈 강건성',
    body: 'CrossEntropy: 잘못된 라벨 → gradient 직접 오염. 노이즈 40%에서 정확도 급락.\nSupCon: 같은 클래스 여러 positive의 평균 → 개별 노이즈 희석. 노이즈 40%에서도 8%+ 우위.\nCIFAR-10: CE 95.0% vs SupCon 96.0%. CIFAR-100: CE 75.3% vs SupCon 76.5%.',
  },
  {
    label: '④ 2단계 파이프라인: Encoder 학습 → Linear Classifier',
    body: 'Stage 1: SupCon loss로 인코더(ResNet) + projection head 학습. 표현 최적화.\nStage 2: projection head 제거, frozen encoder 위에 linear classifier(CE)로 분류 학습.\n표현과 분류를 분리하는 것이 핵심 — 인코더가 task에 과적합하지 않고 범용 표현 유지.\nBalanced sampling(클래스당 K=4~8) + temperature τ=0.07~0.1이 실전 권장 설정.',
  },
];

export const C = {
  sup: '#f59e0b',
  self: '#8b5cf6',
  ce: '#ef4444',
  pos: '#10b981',
  neg: '#ef4444',
  enc: '#3b82f6',
  muted: '#94a3b8',
};

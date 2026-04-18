export const STEPS = [
  {
    label: '① 유전체 임베딩 개선: 사전학습 → 대조 학습 Fine-tuning',
    body: '기본: gLM(ESM-2 등)으로 시퀀스 임베딩 → cosine similarity로 wild-type과 변이 비교.\n문제: MLM 사전학습은 변이 민감도에 최적화되지 않음 → benign/pathogenic 변이 구분 어려움.\n해법: 대조 학습으로 fine-tuning → wild-type+benign=positive, wild-type+pathogenic=hard negative.',
  },
  {
    label: '② Cosine Distance로 변이 민감도 측정',
    body: 'd(wt, mut) = 1 - cos(f(wt), f(mut)). d가 클수록 기능 영향 큼 → 병원성 가능성 높음.\n대조 학습 전: benign 평균 d=0.12, pathogenic 평균 d=0.15 → 겹침이 심함.\n대조 학습 후: benign 평균 d=0.05, pathogenic 평균 d=0.23 → 명확한 분리.\nSpearman 상관(DMS 벤치마크): 0.45 → 0.62로 향상.',
  },
  {
    label: '③ 3단계 Fine-tuning 파이프라인',
    body: 'Stage 1 — Contrastive Pre-training: 인코더 + projection head. positive=같은 유전자/benign 쌍.\nStage 2 — Task Head: projection head 제거, frozen encoder + regression head. DMS score 예측(MSE).\nStage 3 — Joint Fine-tuning: contrastive loss + regression loss 가중합. λ_cl=0.3, λ_reg=0.7.\n3단계 파이프라인이 단일 objective보다 일관되게 우수 — 표현 품질과 task 성능 동시 최적화.',
  },
  {
    label: '④ 범용 적용 패턴 4단계',
    body: '1) 도메인 사전학습 모델 확보 (BERT, ESM-2, ProtTrans 등).\n2) 도메인 pair 정의 — positive/negative 기준이 가장 중요한 설계 결정.\n3) Contrastive fine-tuning → 임베딩 품질 검증 (t-SNE, kNN accuracy, silhouette score).\n4) Downstream head 추가 → task 성능 측정.\n핵심: "모델을 바꾸는 것"이 아니라 "학습 신호를 바꾸는 것". pair 설계가 도메인 전문성이 필요한 유일한 지점.',
  },
];

export const C = {
  wt: '#3b82f6',
  benign: '#10b981',
  pathogenic: '#ef4444',
  stage: '#8b5cf6',
  enc: '#6366f1',
  loss: '#f59e0b',
  muted: '#94a3b8',
};

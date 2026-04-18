export const C = {
  linear: '#6366f1',
  soft: '#10b981',
  loss: '#ef4444',
  gen: '#f59e0b',
  tie: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Linear + Softmax -- logits에서 확률로',
    body: '입력: decoder output h (d_model 차원 벡터).\nLinear: logits = h · W_out + b_out, W_out: (d_model, vocab_size).\nd_model=4096, vocab=32000 → W_out만 131M 파라미터.\nSoftmax: p_i = exp(logits_i) / sum_j exp(logits_j).\n모든 확률의 합 = 1, 다음 토큰 확률 분포 완성.\n학습 시 Cross-Entropy, 추론 시 sampling/argmax.',
  },
  {
    label: '② Weight Tying -- 임베딩과 출력 공유',
    body: '입력 임베딩 E: (vocab_size, d_model).\n출력 가중치 W_out: (d_model, vocab_size) = E의 전치.\nW_out = E^T — 같은 행렬을 공유.\n파라미터 절반 감소 (131M → 0, 이미 E에 포함).\n임베딩과 출력의 의미 공간 일치 — 정규화 효과.\nGPT-2, BERT, LLaMA 모두 채택한 표준 기법.',
  },
  {
    label: '③ 생성 전략 -- Greedy부터 Nucleus까지',
    body: 'Greedy (argmax): deterministic, 보수적, 반복 경향.\nTemperature: logits/T 후 softmax. T<1 sharp, T>1 flat.\nTop-k: 상위 k개만 유지, 나머지 확률 0.\nTop-p (Nucleus): 누적 확률 p 이내 토큰만 유지.\nBeam Search: top-k 경로 유지, 번역에서 인기.\n실무: Temperature + Top-p 조합이 가장 흔한 설정.',
  },
  {
    label: '④ Loss 변형 -- Label Smoothing과 최적화',
    body: 'Cross-Entropy: L = -log(p_target). 정답 확률 높을수록 0 수렴.\nLabel Smoothing: 0.9 정답 + 0.1 uniform 분산.\n과신(overconfidence) 방지, 일반화 성능 향상.\nFocal Loss: 어려운 샘플에 가중 — 불균형 대응.\nSpeculative Decoding: 작은 모델로 초안, 큰 모델로 검증.\n추론 속도 2~3배 향상 — 품질 동일.',
  },
];

export const C = {
  ln: '#6366f1',
  bn: '#ef4444',
  pre: '#10b981',
  post: '#f59e0b',
  rms: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① LayerNorm vs BatchNorm -- 정규화 방향 차이',
    body: '입력 shape: (B, N, d_model). B=배치, N=시퀀스, d=특징.\nBatchNorm: B 방향(배치 차원) 정규화 — CNN에서 유리.\n패딩된 가변 시퀀스에서 불안정, 배치 크기 의존.\nLayerNorm: d_model 방향(특징 차원) 정규화.\n각 토큰의 모든 특징에 걸쳐 평균·분산 계산.\n배치 크기 무관, 가변 길이 시퀀스 OK — Transformer 표준.',
  },
  {
    label: '② Pre-LN vs Post-LN -- 정규화 위치 차이',
    body: 'Post-LN (원 Transformer): y = LN(x + SubLayer(x)).\n서브레이어 출력에 잔차 더한 뒤 정규화.\n학습 불안정 — warmup 필수, 하지만 최종 성능 약간 좋음.\nPre-LN (GPT-2 이후): y = x + SubLayer(LN(x)).\n잔차 연결 전에 정규화 — gradient flow 균일.\n학습 안정적, warmup 선택, 현대 LLM 표준.',
  },
  {
    label: '③ RMSNorm -- LayerNorm 단순화',
    body: 'RMSNorm: 평균 제거(mean subtraction) 생략.\nRMS(x) = sqrt(mean(x^2)), y_i = gamma · x_i / RMS(x).\nLayerNorm 대비 약 7% 속도 향상, 성능 유사.\nLLaMA, Mistral, T5가 채택.\n평균 중심화가 실질적 성능 차이를 만들지 않는다는 관찰.\n계산량 절감이 대규모 모델에서 누적 효과.',
  },
  {
    label: '④ 위치 변형 총정리 -- 모델별 선택',
    body: 'Pre-LN: GPT-2, GPT-3, LLaMA — 안정 학습 우선.\nPost-LN: 원 Transformer, BERT — 최종 성능 우선.\nSandwich-LN: PaLM — attention 전후 양쪽 정규화.\nDeepNorm: 1000층 가능 — 잔차 스케일링 기법.\nRMSNorm: LLaMA, Mistral — 속도 최적화.\n모델 규모가 커질수록 Pre-LN + RMSNorm 조합이 지배적.',
  },
];

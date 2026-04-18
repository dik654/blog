export const C = {
  ffn: '#6366f1',
  relu: '#ef4444',
  gelu: '#10b981',
  swi: '#f59e0b',
  param: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Position-wise FFN 수식 -- 확장 후 압축',
    body: 'FFN(x) = max(0, x·W1 + b1)·W2 + b2.\n입력 x: (n, d_model), d_model=512.\nW1: (512, 2048) → 4배 확장, W2: (2048, 512) → 원래 복원.\n각 토큰이 독립적으로 FFN 통과 — position-wise.\n토큰 간 상호작용은 이미 attention에서 처리 완료.\n"고차원에서 비선형 변환 후 압축" 전략.',
  },
  {
    label: '② 활성화 함수 진화 -- ReLU → GELU → SwiGLU',
    body: 'ReLU (2017 원본): max(0, x). 단순하지만 음수 완전 차단.\nGELU (BERT, GPT): x·Phi(x). 작은 음수 일부 통과, 매끄러움.\n근사: 0.5x(1 + tanh(sqrt(2/pi)(x + 0.044715x^3))).\nSwiGLU (LLaMA, PaLM): Swish(xW) 직곱 (xV + c).\nSwish(x) = x·sigmoid(x). 게이트 메커니즘 추가.\nLLaMA, Mistral 기본 — 성능 개선 확인.',
  },
  {
    label: '③ 파라미터 비중 -- FFN이 2/3 차지',
    body: 'd_model=512, d_ff=2048 기준:\nFFN: 2 x 512 x 2048 = 2.1M 파라미터.\nAttention: 4 x 512^2 = 1.05M 파라미터.\nFFN이 Attention의 약 2배.\nLLaMA-7B: Attention 33%, FFN(SwiGLU) 66%, 기타 1%.\n모델 용량의 핵심이 FFN에 집중 — "지식 저장소" 역할.',
  },
];

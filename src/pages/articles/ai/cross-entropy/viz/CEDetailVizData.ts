import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Cross-Entropy 수학적 의미 — P의 확률로 Q의 놀라움을 측정',
    body: 'H(P,Q) = -Σ P(x)·log Q(x) — P가 실제 분포, Q가 모델 예측 분포\n분해: H(P,Q) = H(P) + D_KL(P‖Q)\nH(P)는 데이터 고유 엔트로피(상수), D_KL은 모델 비효율(학습으로 줄일 수 있는 부분)\n예: P=[0.7,0.2,0.1], Q=[0.6,0.3,0.1] → H(P,Q)≈1.08 nats, H(P)≈0.80, KL≈0.28\nGibbs 부등식: H(P,Q) ≥ H(P), 등호는 Q=P일 때만 — CE 최소화 = 최적 모델',
  },
  {
    label: '분류에서 CE Loss — one-hot이면 정답 확률만 중요',
    body: 'P가 one-hot [0,...,1,...,0]이면 H(P)=0 → CE = -log Q(y_correct)\none-hot에서는 정답 클래스의 예측 확률 하나만 loss에 기여\n예: 3-class, 정답=1, Q=[0.1, 0.8, 0.1] → CE = -ln(0.8) ≈ 0.22\n예: Q=[0.1, 0.01, 0.89] → CE = -ln(0.01) ≈ 4.61 (예측 틀리면 loss 폭발)\nQ(y)→0이면 -logQ→∞ — 완전히 틀린 예측에 무한 페널티',
  },
  {
    label: 'PyTorch 구현 — softmax + log + NLL을 한 번에',
    body: 'nn.CrossEntropyLoss(logits, targets) — logits를 직접 입력 (softmax 적용 전)\n내부: log_softmax(logits) → NLLLoss 적용\n왜 분리하면 위험한가: softmax([100,101,102]) → [0.09,0.24,0.67] → log(0.09)=-2.4\nlog_softmax는 log(exp(x)/Σexp)=x-log(Σexp)로 계산 — exp 오버플로 방지\n추가로 max 빼기 트릭: log_softmax(x) = (x-max) - log Σ exp(x-max)',
  },
  {
    label: 'Binary Cross-Entropy — 2-class와 multi-label',
    body: 'BCE = -[y·log(ŷ) + (1-y)·log(1-ŷ)], y∈{0,1}, ŷ=σ(z)∈(0,1)\ny=1이면 -log(ŷ)만 남음, y=0이면 -log(1-ŷ)만 남음\n예: y=1, ŷ=0.9 → BCE=-ln(0.9)≈0.11 / ŷ=0.1 → BCE=-ln(0.1)≈2.30\nMulti-class: softmax+CE (클래스 하나만 선택) vs Multi-label: sigmoid+BCE (각 독립 판정)\n예: 이미지 태깅 "고양이+실내" → 각 태그에 독립 sigmoid+BCE 적용',
  },
  {
    label: 'Perplexity — LM이 몇 개 후보 중 고민하는가',
    body: 'PPL = exp(H(P,Q)) = exp(-1/N Σ log Q(wᵢ)) — 토큰당 평균 CE의 지수\n직관: PPL=33이면 "매 토큰마다 33개 단어 중에서 균등하게 고르는 수준의 불확실성"\n예: CE=3.5 nats → PPL=e^3.5≈33, CE=2.3 → PPL≈10, CE=1.8 → PPL≈6\n모델 비교: GPT-2: PPL≈30, GPT-3: PPL≈20, GPT-4: PPL≈10(추정)\n인간 텍스트 PPL≈6-7 — 이것이 LM 성능의 이론적 하한',
  },
];

export const COLORS = {
  ce: '#ef4444',
  p: '#6366f1',
  q: '#f59e0b',
  ok: '#10b981',
  code: '#8b5cf6',
  dim: '#94a3b8',
};

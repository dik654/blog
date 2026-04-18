import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'McCulloch-Pitts 뉴런 (1943)',
    body: '최초의 인공 뉴런 모델. 수식: y = step(Σ wᵢxᵢ − θ).\nxᵢ는 이진 입력(0 또는 1), wᵢ는 가중치, θ는 임계값(threshold).\n가중합이 θ를 넘으면 y=1(발화), 아니면 y=0(억제).\n예: AND 게이트 — w₁=w₂=1, θ=1.5 → 둘 다 1일 때만 합=2 > 1.5 → 출력 1.\nOR 게이트 — w₁=w₂=1, θ=0.5 → 하나만 1이어도 합=1 > 0.5 → 출력 1.\n한계: 가중치가 사전 고정 — 데이터에서 학습하는 메커니즘이 없었다.',
  },
  {
    label: 'XOR 한계 → AI 겨울',
    body: 'Minsky & Papert(1969) "Perceptrons" — 단일 뉴런의 한계를 수학적으로 증명.\n단일 뉴런은 입력 공간을 하나의 초평면(hyperplane)으로만 분리 가능 → 선형 분리 한정.\nXOR 진리표: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0 — 직선 하나로 분리 불가능.\n이 증명이 학계에 충격 → 1969~1986 "AI 겨울" — 미 국방부·정부 연구비 급감.\n해결 열쇠: 은닉층(hidden layer)을 쌓으면 XOR 해결 가능 — 하지만 step function의\n미분 불가 문제 때문에 다층 학습 알고리즘(backprop)을 적용할 수 없었다.',
  },
  {
    label: 'Perceptron 학습 규칙 (1958)',
    body: 'Frank Rosenblatt — McCulloch-Pitts 뉴런에 학습 알고리즘을 추가한 최초의 모델.\n업데이트 규칙: wᵢ ← wᵢ + η·(y − ŷ)·xᵢ.\nη는 학습률(보통 0.01~0.1), y는 정답, ŷ는 예측값, xᵢ는 i번째 입력.\n예: 정답 y=1인데 ŷ=0이면 오차=1 → wᵢ가 xᵢ 방향으로 η만큼 증가.\nNovikoff 수렴 정리: 데이터가 선형 분리 가능하면, 유한 스텝 안에 수렴 보장.\n그러나 내부 활성화가 step function이므로 다층 구조에서 gradient 전파 불가.',
  },
  {
    label: '미분 불가 → 학습 불가',
    body: "Step function f(x) = 0 (x<0), 1 (x≥0) — 모든 x≠0에서 f'(x)=0.\nx=0에서는 불연속이라 미분 자체가 정의되지 않는다.\nChain rule: ∂L/∂w = (∂L/∂f) · f'(z) · x. 여기서 z = Σwᵢxᵢ+b.\nf'(z)=0이므로 ∂L/∂w=0 → 가중치 w가 전혀 업데이트되지 않는다.\n예: L=0.5, ∂L/∂f=−0.3, x=2.0이어도 f'(z)=0이면 ∂L/∂w=0.\n이것이 backpropagation의 근본적 전제 — 활성화 함수는 반드시 미분 가능해야 한다.",
  },
  {
    label: '해결법 4가지',
    body: '① Smooth Approximation — Step을 sigmoid σ(x)=1/(1+e⁻ˣ)로 연속 근사.\nσ는 step의 S자 완화 버전, 전 구간 미분 가능 → backprop 작동.\n② Relaxation (Gumbel-Softmax) — 학습 시 smooth(τ→0에서 hard에 수렴), 추론 시 hard.\nτ는 온도 파라미터 — τ=1이면 부드럽고, τ→0이면 step에 가까워진다.\n③ STE(Straight-Through Estimator) — forward는 step 그대로, backward만 f\'(x)=1로 대체.\n양자화 네트워크(BinaryConnect 등)에서 핵심 — 이산 연산을 미분 가능하게 우회.\n④ Reparameterization — z = g(ε, θ). 확률 변수를 결정론적 함수 g + noise ε로 분리.\nVAE의 z = μ + σ·ε가 대표적 — gradient가 μ, σ로 직접 전달된다.',
  },
];

export const COLORS = {
  hist: '#3b82f6',
  limit: '#ef4444',
  learn: '#10b981',
  dead: '#94a3b8',
  solve: '#8b5cf6',
};

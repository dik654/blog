import type { StepDef } from '@/components/ui/step-viz';

export const AXIOM_C = '#6366f1';   // 공리 / 이론 (indigo)
export const FUNC_C = '#10b981';    // 함수 / 결과 (emerald)
export const ML_C = '#f59e0b';      // ML 연결 (amber)
export const LOSS_C = '#ef4444';    // 손실 / 비용 (red)
export const INFO_C = '#8b5cf6';    // 정보 (violet)

export const SHANNON_STEPS: StepDef[] = [
  {
    label: '정보량 I(x)가 만족해야 할 4가지 공리',
    body: '① I(x) ≥ 0 — 정보량은 음수가 될 수 없음\n② P(x)=1이면 I(x)=0 — 반드시 일어나는 사건은 놀라움 0\n③ P(x₁) < P(x₂)이면 I(x₁) > I(x₂) — 드문 사건일수록 정보 큼\n④ x,y 독립이면 I(xy) = I(x)+I(y) — 독립 사건의 정보는 합산\n이 4개를 동시에 만족하는 함수 형태를 찾는 것이 출발점',
  },
  {
    label: 'I(x) = -log P(x) — 공리를 만족하는 유일한 함수',
    body: '공리 ④에서 I(xy)=I(x)+I(y)이고 P(xy)=P(x)·P(y)\n곱셈→덧셈 변환 함수는 로그뿐 → I(x) = -log P(x)\n예: 동전 앞면 P=0.5 → I = -log₂(0.5) = 1 bit\n예: 주사위 1 P=1/6 → I = -log₂(1/6) ≈ 2.58 bits\n마이너스 부호는 P∈(0,1]에서 log가 음수이므로 양수로 만들기 위함',
  },
  {
    label: 'log base 선택 — 단위가 달라짐',
    body: 'base 2 → bit (정보이론 표준), base e → nat (ML 표준), base 10 → hartley\n변환: 1 nat = 1/ln2 ≈ 1.443 bit\n예: P=0.25 → log₂=2 bits, ln=1.386 nats, log₁₀=0.602 hartleys\nML에서는 자연로그(nat)를 사용 — exp/log 미분이 깔끔하고 PyTorch 기본값\n어떤 base든 정보의 순서 관계는 동일, 스케일만 달라짐',
  },
  {
    label: 'Shannon (1948) — 정보이론 창시',
    body: '"A Mathematical Theory of Communication" — 두 가지 핵심 정리 제시\n① 소스 코딩 정리: 데이터 압축 한계 = 엔트로피 H(P) bits/symbol\n② 채널 코딩 정리: 채널 용량 C까지 오류 없는 전송 가능\nML과의 연결: 분류 loss(CE)는 코딩 비용, KL은 모델 비효율의 측정\n정보이론의 엔트로피·CE·KL이 곧 현대 딥러닝 손실 함수의 수학적 토대',
  },
];

export const ML_STEPS: StepDef[] = [
  {
    label: 'Cross-Entropy — 모델 Q로 데이터 P를 인코딩하는 비용',
    body: 'H(P,Q) = -Σ P(x) log Q(x), P=실제 분포, Q=모델 예측 분포\n분해: H(P,Q) = H(P) + D_KL(P‖Q) — 최적 코딩 비용 + 모델 비효율\n예: P=[0.7, 0.2, 0.1], Q=[0.6, 0.3, 0.1]\nH(P,Q) = -(0.7·ln0.6 + 0.2·ln0.3 + 0.1·ln0.1) ≈ 1.08 nats\nQ=P이면 CE=H(P)로 최소 — Gibbs 부등식에 의해 그 이하로 내려갈 수 없음',
  },
  {
    label: 'KL Divergence — P 대신 Q를 쓸 때의 추가 비트',
    body: 'D_KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) = H(P,Q) - H(P)\nP=실제 분포, Q=근사 분포 — Q가 P와 다를수록 값이 커짐\nGibbs 부등식: D_KL ≥ 0, 등호는 P=Q일 때만 (Jensen 부등식으로 증명)\n비대칭: D_KL(P‖Q) ≠ D_KL(Q‖P) — 거리 함수(metric)가 아님\nCE 최소화 ≡ KL 최소화 (H(P)는 상수이므로 학습에 영향 없음)',
  },
  {
    label: 'MLE ≡ Cross-Entropy 최소화',
    body: 'MLE: θ* = argmax Π P(xᵢ|θ) → log 취하면 argmax Σ log P(xᵢ|θ)\n부호 반전: argmin -1/N Σ log P(xᵢ|θ) = argmin H(P_data, P_θ)\nP_data는 경험적 분포(empirical distribution), P_θ는 모델의 확률 분포\n세 표현 MLE / NLL 최소화 / CE 최소화는 수학적으로 동치\n따라서 CE loss를 쓰는 것은 곧 MLE를 수행하는 것',
  },
  {
    label: 'Perplexity · Mutual Information · Information Bottleneck',
    body: 'PPL = 2^H(P,Q) 또는 exp(CE) — 모델이 "몇 개 중에서 고르나" 직관적 해석\n예: CE=3.5 nats → PPL=e^3.5≈33 "33개 후보 중 고민"\nI(X;Y) = H(X) - H(X|Y) — X를 알면 Y의 불확실성이 얼마나 줄어드나\nInformation Bottleneck: min I(X;Z) - βI(Z;Y) — 표현 Z의 압축과 정보 보존 균형\nGPT-2: PPL≈30, GPT-4: PPL≈10(추정), 인간: PPL≈6-7',
  },
  {
    label: 'log를 쓰는 5가지 이유',
    body: '① 독립 이벤트 합산: log(P(A)·P(B)) = logP(A)+logP(B)\n② 수치 안정성: 0.001^100 = 10^-300(언더플로) → log 합산으로 해결\n③ 곱→덧 변환: Π를 Σ로 바꿔 GPU 병렬 연산에 유리\n④ backprop 기울기: d/dx(-logx) = -1/x — 예측이 틀릴수록(x→0) 기울기 ↑\n⑤ 정보이론 해석: -logP(x)는 정보량, 손실 함수에 물리적 의미 부여',
  },
];

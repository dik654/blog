import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Sigmoid 수식과 특성',
    body: '수식: σ(x) = 1 / (1 + e⁻ˣ). 출력 범위 (0, 1) — 확률로 직접 해석 가능.\n도함수: σ\'(x) = σ(x)·(1 − σ(x)). 이 곱 형태가 핵심 성질.\nx=0일 때 σ(0)=0.5, σ\'(0)=0.5×0.5=0.25 → 미분 최댓값이 겨우 0.25.\nx=5일 때 σ(5)≈0.993, σ\'(5)≈0.007 → 입력이 크면 기울기가 거의 사라진다.\nx=−5일 때 σ(−5)≈0.007, σ\'(−5)≈0.007 → 음수 쪽도 마찬가지.\n이 양쪽 포화(saturation)가 깊은 네트워크에서 vanishing gradient를 유발하는 근본 원인.',
  },
  {
    label: '비영점 출력 → Zig-zag 경사 문제',
    body: 'σ(x)의 출력은 항상 (0, 1) → 다음 층 입력이 전부 양수(positive).\n∂L/∂wᵢ = δ · xᵢ에서 xᵢ > 0이면, gradient 부호가 δ 하나에 의해 결정.\n결과: 모든 weight의 gradient가 같은 부호 — 동시에 증가하거나 동시에 감소.\nw₁↑ w₂↑ 또는 w₁↓ w₂↓만 가능 → 최적점으로 가려면 지그재그 경로를 거침.\n예: 최적이 (w₁↑, w₂↓)인 경우 → 대각선 이동 불가 → 수렴 속도 2~5배 저하.\n해결책: Tanh(출력 −1~+1, zero-centered) 또는 BatchNorm(입력을 평균 0으로 정규화).',
  },
  {
    label: '현대 사용처 — Hidden 퇴출, Output/Gate 필수',
    body: 'Hidden layer에서 퇴출된 이유: vanishing gradient + exp 연산 비용 + non-zero-centered.\nReLU(2012~)와 GELU(2016~)가 hidden layer 표준을 대체.\n그러나 출력이 (0,1)인 특성 덕에 4가지 영역에서 여전히 필수:\n① BCE output — 이진 분류 최종 출력. P(y=1|x) = σ(logit)으로 확률 직접 출력.\n② LSTM/GRU gate — forget gate fₜ=σ(Wf·[hₜ₋₁,xₜ]+bf). 0이면 잊고 1이면 기억.\n③ Attention gating — 2019+ Gated Attention 등에서 σ로 정보량 조절.\n④ Multi-label 분류 — 각 라벨이 독립적 이진 판단 → softmax 대신 sigmoid 사용.',
  },
  {
    label: 'PyTorch 패턴 — 수치 안정성',
    body: 'Bad 패턴: prob = torch.sigmoid(logit); loss = F.binary_cross_entropy(prob, target).\nσ(x)가 0 또는 1에 극히 가까우면 log(σ) → −∞ → NaN 발생.\n예: logit=100 → σ≈1.0 → log(1−σ)=log(≈0) → −∞ → loss 폭발.\nGood 패턴: loss = F.binary_cross_entropy_with_logits(logit, target).\n내부에서 log-sum-exp 트릭 적용: −max(0,z) + z·y + log(1+exp(−|z|)).\nz가 아무리 커도 exp(−|z|)만 계산 → overflow/underflow 방지.\n이 패턴은 PyTorch 공식 문서에서도 강력 권장하는 best practice.',
  },
];

export const COLORS = {
  sig: '#3b82f6',
  problem: '#ef4444',
  gate: '#10b981',
  code: '#8b5cf6',
  dim: '#94a3b8',
};

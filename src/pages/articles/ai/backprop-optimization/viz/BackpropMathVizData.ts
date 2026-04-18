export const STEPS = [
  {
    label: 'Softmax + CE 유도 — 4단계',
    body: '① Softmax 정의: ŷᵢ = exp(hᵢ) / S, where S = Σⱼ exp(hⱼ)\n② log 전개: log(ŷᵢ) = log(exp(hᵢ)/S) = hᵢ − log(S)\n  분수의 log → 뺄셈으로 변환되어 계산이 단순해짐\n③ CE Loss 대입: L = −Σᵢ yᵢ·log(ŷᵢ) = −Σᵢ yᵢ·hᵢ + log(S)\n  one-hot y에서 Σyᵢ=1이므로 log(S) 항이 하나만 남음\n④ hₖ에 대해 미분: ∂L/∂hₖ = −yₖ + exp(hₖ)/S = ŷₖ − yₖ\n결과: dL/dh = ŷ − y (예측 확률 − 정답 one-hot, element-wise).',
  },
  {
    label: '놀라운 단순함 — ŷ - y',
    body: '유도 과정에서 exp, log, 분수, 합 연산이 모두 등장하지만\n최종 결과는 element-wise 뺄셈 한 줄: grad = ŷ − y\n예: 3-class, 정답=class 0, ŷ=[0.7, 0.2, 0.1], y=[1,0,0]\ngrad = [0.7−1, 0.2−0, 0.1−0] = [−0.3, 0.2, 0.1]\n해석: 정답 클래스(0번)는 확률을 높이는 방향(−0.3), 오답 클래스는 낮추는 방향(+0.2, +0.1)\n구현: grad = softmax(logits) - one_hot(target) — O(C) 연산.\n이 단순함이 softmax+CE 조합을 분류 표준으로 만든 핵심 이유.',
  },
  {
    label: 'Softmax Jacobian — diag(ŷ) - ŷŷᵀ',
    body: 'Softmax 단독 미분은 i=j와 i≠j 두 케이스:\n① i=j (대각선): ∂ŷᵢ/∂hᵢ = ŷᵢ(1 − ŷᵢ) — sigmoid 미분과 동일 형태\n② i≠j (비대각선): ∂ŷᵢ/∂hⱼ = −ŷᵢ · ŷⱼ — 다른 클래스 간 음의 상관\n행렬 형태: J = diag(ŷ) − ŷŷᵀ ∈ R^(C×C)\n명시적 Jacobian: C=1000이면 100만 원소 → O(C²) 연산.\nCE와 합치면: dL/dŷ = −y/ŷ 대입 → 상쇄 발생 → dL/dh = ŷ−y\nO(C²) → O(C)로 복잡도 급감. 합쳐서 계산하는 결정적 이유.',
  },
  {
    label: 'PyTorch 실전 — Bad vs Good',
    body: 'Bad: softmax() → log() → NLLLoss() 분리 구현\n문제: softmax 출력이 0에 가까우면 log(0)=-inf → NaN 전파\ngradient도 1/softmax(x) 형태라 수치 폭발 위험.\nGood: F.cross_entropy(logits, targets) — 내부 처리:\nlog_softmax(x) = x − max(x) − log(Σexp(x − max(x)))\nmax(x)를 빼서 exp 입력을 0 근처로 → overflow 방지.\nlog 공간에서 직접 계산 → log(0) 회피.\n실전 규칙: 모델 출력은 항상 logits(raw scores)로 두고,\nloss function이 softmax를 내부 처리하게 위임.',
  },
];

export const C = {
  loss: '#ef4444',
  grad: '#8b5cf6',
  softmax: '#3b82f6',
  safe: '#10b981',
  jac: '#f59e0b',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: '합성 함수의 미분 — 핵심 공식',
    body: '연쇄 법칙(chain rule): f(g(x))의 미분\ndf/dx = (df/dg) · (dg/dx)\n각 단계의 "local gradient"를 곱하면 전체 미분 완성.\n예: f(u)=u², g(x)=3x+1 → f(g(x))=(3x+1)²\ndf/dg=2u, dg/dx=3 → df/dx=2(3x+1)·3=6(3x+1)\n신경망에서: 수백 층의 합성 함수를 한번에 미분하지 않고\n각 층의 local gradient를 역방향으로 곱해서 O(층수) 시간에 처리.',
  },
  {
    label: '2층 네트워크 예시 — 구체 계산',
    body: 'Forward 3단계: h=W₁x+b₁ → y=relu(h) → L=MSE(y,t)=(y-t)²\nBackward에서 각 local gradient를 역순으로 곱하기:\n① dL/dy = 2(y-t) — MSE의 도함수\n② dy/dh = relu\'(h) = {1 if h>0, 0 if h≤0} — ReLU의 도함수\n③ dh/dW₁ = xᵀ — 선형 변환의 도함수\n결과: dL/dW₁ = dL/dy · dy/dh · dh/dW₁\n= 2(y-t) · relu\'(h) · xᵀ\n이 gradient로 W₁을 업데이트하면 loss가 감소하는 방향으로 이동.',
  },
  {
    label: '벡터/행렬 — Jacobian 일반화',
    body: '스칼라 연쇄 법칙을 벡터로 확장:\ny=f(x)에서 x∈Rⁿ, y∈Rᵐ일 때 Jacobian J ∈ R^(m×n)\nJ[i,j] = ∂yᵢ/∂xⱼ — i번째 출력의 j번째 입력에 대한 편미분\n벡터 연쇄 법칙: ∂z/∂x = (∂z/∂y) · J\n예: x∈R⁷⁸⁴, y∈R¹²⁸ → J는 128×784 행렬 (100K+ 원소)\nBackprop 흐름: upstream(∂z/∂y) × local Jacobian(∂y/∂x) = downstream(∂z/∂x)\n각 층에서 이 곱셈을 반복하며 gradient를 역방향으로 전파.',
  },
  {
    label: 'VJP — autograd의 핵심',
    body: 'Jacobian J(m×n) 전체를 메모리에 올리면 O(mn) — 비실용적.\nVJP(Vector-Jacobian Product): upstream 벡터(1×m)와 J(m×n)의 곱만 계산.\n결과는 1×n 벡터 — O(n) 메모리로 충분.\n예: Linear layer y = Wx일 때\nJacobian ∂y/∂x = W → VJP: downstream = upstream · W\n행렬곱 한 번이면 끝. J를 명시적으로 만들 필요가 없음.\nPyTorch autograd 엔진의 본질: 각 연산마다 VJP 함수를 등록하고\nbackward 시 upstream gradient와 순서대로 곱해 나감.',
  },
];

export const C = {
  loss: '#ef4444',
  grad: '#8b5cf6',
  layer: '#3b82f6',
  act: '#10b981',
  jac: '#f59e0b',
  dim: '#94a3b8',
};

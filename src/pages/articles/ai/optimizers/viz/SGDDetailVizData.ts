import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '업데이트 규칙: θ = θ - η · ∇L(θ; xᵢ)',
    body: '수식: θ_(t+1) = θ_t − η · ∇L(θ_t; xᵢ)\nθ = 파라미터 벡터, η = 학습률(예: 0.01), ∇L = 손실의 그래디언트, xᵢ = 랜덤 샘플 1개.\nBatch GD는 N개 전체 평균 ∇L = (1/N)Σ∇L(xᵢ)를 계산하지만, SGD는 1개 샘플로 추정 → O(N) 대신 O(1).\n노이즈 σ²가 크지만, 이 노이즈가 오히려 얕은 local minima 탈출을 돕는 암묵적 정규화(implicit regularization) 역할.\n예: CIFAR-10(5만 장) 기준 Batch GD는 1 업데이트에 5만 샘플 연산, SGD는 1개 → 5만 배 빠른 스텝.\n수렴 속도: O(1/√T)로, T 스텝 후 기대 오차가 1/√T에 비례.',
  },
  {
    label: 'SGD의 4가지 문제',
    body: '① 진동(oscillation): Hessian 고유값 비 κ = λ_max/λ_min이 클 때(예: κ=100) 좁은 골짜기 방향은 빠르고, 넓은 방향은 느려서 지그재그.\n② 안장점(saddle point): ∇L≈0이지만 Hessian 고유값이 양·음 혼재 — 고차원(d>100)에서는 local minima보다 안장점이 지수적으로 많음.\n③ 지역 최솟값(local minima): 비볼록 손실 지형에서 차선해에 갇힘. 단, 고차원에서는 대부분 안장점이 더 큰 문제.\n④ 비등방성(ill-conditioning): 파라미터 θ₁ 범위가 [0,1]이고 θ₂ 범위가 [0,1000]이면, 고정 η=0.01은 θ₂에는 너무 작고 θ₁에는 적절 → 파라미터별 적응 불가.\n이 4가지 문제가 Momentum(①②③ 완화)과 Adam(④ 해결)의 동기.',
  },
  {
    label: 'LR 스케줄: step · cosine · warmup',
    body: 'Step decay: N 에폭마다 η ← η × γ (γ=0.1). 예: η₀=0.1 → 30에폭 후 0.01 → 60에폭 후 0.001. ResNet 논문 표준.\nCosine annealing: η_t = η_min + ½(η₀ − η_min)(1 + cos(πt/T)). 예: η₀=0.1, η_min=1e-6, T=200에폭 → 부드럽게 감소하여 fine-grained 수렴.\nWarmup: 초반 W 스텝 동안 η를 0에서 η₀까지 선형 증가. 이유: 초기 파라미터가 랜덤이라 큰 η는 발산 유발.\nWarmup + cosine 조합이 Transformer 표준 — GPT-3: warmup 375M 토큰 + cosine decay to η₀/10.\n왜 스케줄이 필요한가: 고정 η로는 "초반 빠른 탐색 + 후반 정밀 수렴"을 동시에 달성 불가.',
  },
  {
    label: 'SGD 장단점 · 사용 시점',
    body: '장점: 파라미터당 상태 0개(Adam은 2개) → 메모리 = θ 크기만. 볼록 함수에서 O(1/T) 수렴 보장.\n일반화: SGD의 노이즈가 넓고 평탄한 minima로 수렴 → 테스트 성능이 Adam보다 우수한 경우 다수(특히 CNN).\n단점: η 튜닝 민감 — η=0.1 vs 0.01로 결과 크게 변동. 안장점에서 ∇L→0이 되면 사실상 정체.\n적응적 조절 없음: θ₁과 θ₂의 스케일이 달라도 같은 η 적용 → 비효율.\n실무 표준: SGD + Momentum(β=0.9) + weight_decay(5e-4) + cosine schedule. ResNet, EfficientNet 등 이미지 분류에서 Adam보다 선호.\nNLP/Transformer에서는 Adam 계열이 표준 — SGD는 이미지 도메인의 선택지.',
  },
];

export const COLORS = {
  sgd: '#3b82f6',
  problem: '#ef4444',
  schedule: '#10b981',
  dim: '#94a3b8',
};

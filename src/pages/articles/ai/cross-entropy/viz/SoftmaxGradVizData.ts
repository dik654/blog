export const STEPS = [
  {
    label: '완전한 수학적 유도',
    body: 'L = -Σ yᵢ·log(softmax(hᵢ)) = -Σ yᵢ·hᵢ + log(Σ exp(hⱼ))\n∂L/∂hₖ = -yₖ + exp(hₖ)/Σexp(hⱼ) = -yₖ + ŷₖ = ŷₖ - yₖ\n여기서 hₖ=logit(스코어), ŷₖ=softmax(hₖ)=예측 확률, yₖ=정답(one-hot)\n예: logits=[2.0,1.0,0.1], 정답=0 → ŷ=[0.659,0.242,0.099]\n기울기 = [0.659-1, 0.242-0, 0.099-0] = [-0.341, 0.242, 0.099]',
  },
  {
    label: '왜 이렇게 간단한가 (직관)',
    body: 'CE 기울기: ∂L/∂ŷₖ = -yₖ/ŷₖ (one-hot이므로 정답 클래스만 -1/ŷₖ)\nSoftmax Jacobian: ∂ŷᵢ/∂hⱼ = ŷᵢ(δᵢⱼ-ŷⱼ), δ=Kronecker delta\n체인룰: ∂L/∂hₖ = Σᵢ (∂L/∂ŷᵢ)·(∂ŷᵢ/∂hₖ) = Σᵢ(-yᵢ/ŷᵢ)·ŷᵢ(δᵢₖ-ŷₖ)\n정리하면: -Σyᵢ(δᵢₖ-ŷₖ) = -yₖ+ŷₖΣyᵢ = ŷₖ-yₖ (Σyᵢ=1이므로)\n핵심: ŷ(1-ŷ)와 1/ŷ가 상쇄 → 복잡한 Jacobian이 단순한 ŷ-y로 축소',
  },
  {
    label: 'Element-wise 해석',
    body: '정답 클래스(yₖ=1): 기울기 = ŷₖ-1 — 항상 음수(ŷ<1이므로) → logit 증가 방향\n오답 클래스(yₖ=0): 기울기 = ŷₖ-0 = ŷₖ — 항상 양수 → logit 감소 방향\n예: ŷ=[0.2, 0.7, 0.1], 정답=1 → 기울기=[0.2, -0.3, 0.1]\n정답 logit은 올리고 오답 logit은 내리는 직관적 동작\n기울기 합 = 0: Σ(ŷₖ-yₖ) = Σŷₖ-Σyₖ = 1-1 = 0 — 보존 법칙 성립',
  },
  {
    label: 'PyTorch autograd 검증',
    body: 'logits = torch.tensor([2.0, 1.0, 0.1], requires_grad=True)\nloss = F.cross_entropy(logits.unsqueeze(0), torch.tensor([0]))\nloss.backward() → logits.grad = [-0.341, 0.242, 0.099]\n수동 검증: softmax([2,1,0.1])=[0.659,0.242,0.099], one_hot=[1,0,0]\nsoftmax - one_hot = [-0.341, 0.242, 0.099] — autograd와 정확히 일치',
  },
  {
    label: '일반화: Sigmoid + BCE',
    body: 'BCE = -[y·log(ŷ)+(1-y)·log(1-ŷ)], ŷ=σ(z)\n∂BCE/∂ŷ = (ŷ-y)/[ŷ(1-ŷ)], ∂ŷ/∂z = ŷ(1-ŷ)\n체인룰: ∂BCE/∂z = (ŷ-y)/[ŷ(1-ŷ)] · ŷ(1-ŷ) = ŷ-y — 동일한 상쇄 구조\n예: y=1, z=0 → ŷ=0.5 → 기울기=0.5-1=-0.5 (z를 키우는 방향)\nSoftmax+CE와 Sigmoid+BCE는 같은 수학 구조: 활성함수 미분이 loss 미분과 상쇄',
  },
];

// Colors
export const BLUE = '#3b82f6';
export const RED = '#ef4444';
export const GREEN = '#10b981';
export const PURPLE = '#8b5cf6';
export const AMBER = '#f59e0b';
export const GRAY = '#6b7280';

import CodePanel from '@/components/ui/code-panel';

const CODE = `# Forward process — reparameterization trick
# x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon
# epsilon ~ N(0, I)

import torch

def forward_sample(x_0, t, alpha_bar):
    """임의 시점 t의 노이즈 이미지를 직접 샘플링"""
    sqrt_ab = torch.sqrt(alpha_bar[t])        # signal 비율
    sqrt_1_ab = torch.sqrt(1 - alpha_bar[t])  # noise 비율
    epsilon = torch.randn_like(x_0)           # 순수 가우시안
    x_t = sqrt_ab * x_0 + sqrt_1_ab * epsilon
    return x_t, epsilon

# 학습 목표 (Simple Loss)
# L_simple = E[||epsilon - epsilon_theta(x_t, t)||^2]
# 네트워크가 추가된 노이즈 epsilon을 예측하도록 학습`;

const ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'Closed-form 공식' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: 'Reparameterization' },
  { lines: [16, 17] as [number, number], color: 'amber' as const, note: 'Simple Loss' },
];

export default function ForwardMathSection() {
  return (
    <div className="not-prose mt-4">
      <CodePanel title="Forward Process 수학적 정의" code={CODE} annotations={ANNOTATIONS} />
    </div>
  );
}

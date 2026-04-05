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
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Noise Schedule 비교
//
// Linear Schedule (원본 DDPM):
//   β_1 = 0.0001, β_T = 0.02, T = 1000
//   β_t = 0.0001 + (t-1) · (0.02-0.0001)/(T-1)
//
//   문제: 초기 스텝에서 노이즈 추가가 너무 빠름
//         최종 x_T가 "너무 노이즈"
//
// Cosine Schedule (Improved DDPM, 2021):
//   f(t) = cos²(π/2 · (t/T + s) / (1+s))
//   ᾱ_t = f(t) / f(0)
//   s = 0.008 (small offset)
//
//   장점:
//   - 초기 노이즈 추가 부드러움
//   - x_T가 적당히 노이즈
//   - 품질 개선
//
// Sigmoid Schedule (Flow Matching):
//   더 부드러운 전환
//
// 실무 기본값:
//   Stable Diffusion: linear (학습), DDIM (추론)
//   GLIDE, Imagen: cosine
//   최근 연구: 다양한 스케줄 실험 중`}
        </pre>
      </div>
    </div>
  );
}

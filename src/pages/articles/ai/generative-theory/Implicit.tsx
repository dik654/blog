import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import ImplicitViz from './viz/ImplicitViz';

const implicitCode = `암시적 생성 모델:

1. GAN (Generative Adversarial Network):
   min_G max_D V(D,G) = E[log D(x)] + E[log(1-D(G(z)))]
   내쉬 균형: P_G = P_data, D(x) = 0.5
   → 분포를 명시하지 않고 적대적 학습으로 암시적 생성

2. Score Matching:
   s_theta(x) ≈ grad_x log P_data(x)
   DSM: L = E[||s_theta(x~) - grad_x~ log q(x~|x)||^2]
   Langevin Dynamics로 샘플링: x' = x + eta*s(x) + noise

3. Diffusion (Score-based + Denoising):
   Forward:  q(x_t|x_{t-1}) = N(sqrt(1-beta_t) x_{t-1}, beta_t I)
   Reverse:  p_theta(x_{t-1}|x_t) = N(mu_theta(x_t,t), sigma_t^2 I)
   Loss:     E[||epsilon - epsilon_theta(x_t, t)||^2]`;

const annotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'GAN: 적대적 학습' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'Score Matching' },
  { lines: [13, 16] as [number, number], color: 'amber' as const, note: 'Diffusion 노이즈 예측' },
];

export default function Implicit() {
  return (
    <section id="implicit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GAN, Score Matching, Diffusion</h2>
      <div className="not-prose mb-8"><ImplicitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          암시적 모델 — P(x)를 직접 정의하지 않음.<br />
          GAN(적대적 학습), Score Matching(밀도 기울기), Diffusion(둘의 결합).
        </p>

        <CitationBlock source="Ho et al., 2020 — Denoising Diffusion Probabilistic Models"
          citeKey={4} type="paper" href="https://arxiv.org/abs/2006.11239">
          <p className="italic">"We present high quality image synthesis results using diffusion
          probabilistic models — a class of latent variable models inspired by nonequilibrium thermodynamics."</p>
        </CitationBlock>

        <CodePanel title="암시적 생성 모델 수식" code={implicitCode} annotations={annotations} />
      </div>
    </section>
  );
}

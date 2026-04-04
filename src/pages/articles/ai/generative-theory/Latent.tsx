import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import LatentViz from './viz/LatentViz';

const latentCode = `잠재 변수 생성 모델:

1. VAE (Variational Autoencoder):
   P(x) = Integral P(x|z) P(z) dz  (intractable)
   → ELBO 최대화로 우회:
   ELBO = E_q[log P(x|z)] - KL(q(z|x) || P(z))
   Reparameterization: z = mu + sigma * epsilon (epsilon ~ N(0,1))

2. Normalizing Flow:
   z_K = f_K ∘ ... ∘ f_1(z_0),  z_0 ~ N(0,I)
   log P(x) = log P(z_0) - Sum log |det(df_k/dz_{k-1})|
   가역 변환 f_k: 야코비 행렬식 계산이 핵심 비용

3. Flow 변형:
   RealNVP: 채널 분할 커플링 (O(d) 야코비)
   Glow:    1x1 Conv + affine coupling
   IAF:     Inverse Autoregressive (빠른 샘플링)`;

const annotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: 'VAE: ELBO + Reparam' },
  { lines: [9, 12] as [number, number], color: 'emerald' as const, note: 'Flow: 가역 변환 체인' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'Flow 변형' },
];

export default function Latent() {
  return (
    <section id="latent" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">잠재 변수 모델 (VAE, Flow)</h2>
      <div className="not-prose mb-8"><LatentViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          관측 불가능한 z를 도입하여 P(x) 모델링.<br />
          VAE = ELBO 최대화. Flow = 가역 변환 체인으로 분포 변환.
        </p>

        <CitationBlock source="Kingma & Welling, 2014 — Auto-Encoding Variational Bayes"
          citeKey={3} type="paper" href="https://arxiv.org/abs/1312.6114">
          <p className="italic">"We introduce a stochastic variational inference and learning
          algorithm that scales to large datasets — the Variational Autoencoder."</p>
        </CitationBlock>

        <CodePanel title="잠재 변수 모델 수식" code={latentCode} annotations={annotations} />
      </div>
    </section>
  );
}

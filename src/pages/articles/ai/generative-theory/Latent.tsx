import M from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import LatentViz from './viz/LatentViz';

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

        <h3 className="text-xl font-semibold mt-6 mb-3">잠재 변수 모델 수식</h3>

        <M display>
          {`\\text{ELBO} = \\underbrace{\\mathbb{E}_{q}[\\log P(x|z)]}_{\\text{재구성 (Reconstruction)}} - \\underbrace{\\text{KL}\\bigl(q(z|x) \\,\\|\\, P(z)\\bigr)}_{\\text{정규화 (Regularization)}}`}
        </M>

        <M display>
          {`\\log P(x) = \\underbrace{\\log P(z_0)}_{\\text{기저 분포}} - \\underbrace{\\sum_{k=1}^{K} \\log \\bigl|\\det\\bigl(\\tfrac{df_k}{dz_{k-1}}\\bigr)\\bigr|}_{\\text{가역 변환 체인의 야코비 행렬식 합}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">VAE</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <M>{'P(x) = \\int P(x|z)P(z)\\,dz'}</M>가 intractable — ELBO 최대화로 우회. Reparameterization trick: <M>{'z = \\mu + \\sigma \\cdot \\epsilon'}</M> (<M>{'\\epsilon \\sim \\mathcal{N}(0,1)'}</M>)으로 역전파 가능
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Normalizing Flow</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <M>{'z_K = f_K \\circ \\cdots \\circ f_1(z_0)'}</M>, <M>{'z_0 \\sim \\mathcal{N}(0, I)'}</M>. 가역 변환 <M>{'f_k'}</M>의 야코비 행렬식 계산이 핵심 비용 — 정확한 우도 계산 가능
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Flow 변형</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <strong>RealNVP</strong> — 채널 분할 커플링으로 <M>{'O(d)'}</M> 야코비. <strong>Glow</strong> — 1x1 Conv + affine coupling. <strong>IAF</strong> — Inverse Autoregressive로 빠른 샘플링
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

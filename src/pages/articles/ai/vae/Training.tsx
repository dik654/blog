import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import TrainingLoopViz from './viz/TrainingLoopViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습: ELBO와 Reparameterization</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        ELBO = 재구성 손실 + KL Divergence.<br />
        Reparameterization: z = μ + ε·σ로 샘플링을 미분 가능하게 변환.
      </p>

      {/* ELBO 수식 */}
      <div className="rounded-xl border bg-card p-6 mb-6 space-y-6">
        <h3 className="text-lg font-semibold">ELBO (Evidence Lower Bound)</h3>
        <M display>{String.raw`\text{ELBO} = \underbrace{\mathbb{E}_{q}[\log p(x|z)]}_{\text{재구성 손실}} - \underbrace{\text{KL}(q(z|x) \| p(z))}_{\text{잠재 공간 정규화}}`}</M>

        <h3 className="text-lg font-semibold">KL Divergence (해석적 해)</h3>
        <M display>{String.raw`\text{KL} = -\frac{1}{2}\sum_{j=1}^{J}\bigl(\underbrace{1 + \log\sigma_j^2}_{\text{엔트로피}} - \underbrace{\mu_j^2}_{\text{평균 페널티}} - \underbrace{\sigma_j^2}_{\text{분산 페널티}}\bigr)`}</M>

        <h3 className="text-lg font-semibold">Reparameterization Trick</h3>
        <M display>{String.raw`z = \underbrace{\mu}_{\text{인코더 출력}} + \underbrace{\sigma \odot \epsilon}_{\text{노이즈 주입}}, \quad \epsilon \sim \mathcal{N}(0, I)`}</M>

        {/* 설명 카드 */}
        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <div className="rounded-lg border-l-4 border-sky-500 bg-sky-500/5 p-4">
            <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">재구성 손실</p>
            <p className="text-sm text-muted-foreground">
              입력 <M>{String.raw`x`}</M>와 복원 <M>{String.raw`\hat{x}`}</M>의 차이.<br />
              이미지 → BCE, 연속값 → MSE.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
            <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">KL Divergence</p>
            <p className="text-sm text-muted-foreground">
              <M>{String.raw`q(z|x)`}</M>를 <M>{String.raw`\mathcal{N}(0,I)`}</M>에 정규화.<br />
              가우시안이면 해석적 해(closed-form)로 계산.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 p-4">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Reparameterization</p>
            <p className="text-sm text-muted-foreground">
              확률적 샘플링 <M>{String.raw`z \sim q`}</M>를 결정적 연산으로 변환.<br />
              <M>{String.raw`\mu, \sigma`}</M>로 역전파 가능.
            </p>
          </div>
        </div>
      </div>

      <CitationBlock source="Kingma & Welling, 2014 — Section 2.4"
        citeKey={3} type="paper" href="https://arxiv.org/abs/1312.6114">
        <p className="italic">
          "We reparameterize z as a deterministic variable z = g(eps, x)."
        </p>
      </CitationBlock>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VAE 전체 학습 루프</h3>
        <div className="not-prose"><TrainingLoopViz /></div>
        <p className="leading-7">
          요약 1: VAE 학습은 <strong>encode → reparam → decode → loss → backprop</strong> 단순 파이프라인.<br />
          요약 2: <strong>KL collapse·blurry output</strong>이 주요 문제 — annealing·GAN 조합으로 해결.<br />
          요약 3: 평가는 <strong>재구성·FID·latent traversal</strong> 다각도로.
        </p>
      </div>
    </section>
  );
}

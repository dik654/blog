import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, InternalLink, SourceNotes } from '@/components/learning/ArticleLearning';

const variants = [
  { title: 'Denoising AE', change: '손상된 x-tilde → 깨끗한 x', learns: '지정한 corruption에 불변인 복원', boundary: '학습 noise와 실제 noise가 다르면 약해진다.' },
  { title: 'Sparse AE', change: 'latent activation penalty', learns: '적은 수의 feature만 켜지는 code', boundary: 'sparsity 자체가 의미 해석을 보장하지 않는다.' },
  { title: 'Variational AE', change: 'q(z|x) 분포 + KL + sampling', learns: 'sampling 가능한 연속 latent distribution', boundary: 'deterministic AE와 목적 함수가 다르다.' },
  { title: 'VQ-VAE', change: 'discrete codebook quantization', learns: 'token처럼 선택되는 이산 latent', boundary: 'codebook collapse와 별도 prior가 과제다.' },
  { title: 'Masked AE', change: '가려진 patch만 복원', learns: '보이는 문맥에서 빠진 구조 예측', boundary: '일반적인 pixel AE와 encoder 입력이 다르다.' },
];

export default function VariantHandoff() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복사 문제를 바꾸면 어떤 표현을 유도할 수 있을까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          현대 변형들은 단순히 layer를 더 깊게 만드는 것이 아니라 입력, latent, loss 중 하나에 학습 압력을 추가한다. 어떤
          변형이 좋은지는 “어떤 정보를 버리고 어떤 정보를 보존해야 하는가”라는 task 정의에서 결정된다.
        </p>
      </div>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {variants.map((variant) => (
          <div key={variant.title} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.2fr)] lg:gap-4">
            <p className="text-sm font-bold">{variant.title}</p><p className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">{variant.change}</p><p className="text-xs leading-relaxed">{variant.learns}</p><p className="text-xs leading-relaxed text-muted-foreground">{variant.boundary}</p>
          </div>
        ))}
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3 sm:col-span-2"><Math display className="my-0 text-sm sm:text-base">{String.raw`-\mathrm{ELBO}=\underbrace{\mathcal{L}_{rec}}_{\text{입력을 설명하는 비용}}+\underbrace{\mathcal{L}_{KL}}_{\text{latent 분포를 prior와 정렬}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-[11px] sm:text-sm">{String.raw`\mathcal{L}_{rec}=\underbrace{\mathbb{E}_{q(z\mid x)}[-\log p(x\mid z)]}_{\text{sample한 code로 입력을 복원}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal{L}_{KL}=\underbrace{D_{KL}(q(z\mid x)\Vert p(z))}_{\text{입력별 posterior의 이탈 비용}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-violet-500/40 bg-violet-500/[0.05] p-3 sm:col-span-2"><Math display className="my-0 text-sm sm:text-base">{String.raw`\mathcal{L}_{\beta\text{-VAE}}=\underbrace{\mathcal{L}_{rec}}_{\text{정보를 보존}}+\underbrace{\beta\mathcal{L}_{KL}}_{\text{prior 정렬 압력을 조절}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="VAE는 한 점 z를 외우는 대신 encoder가 latent distribution을 내고 prior p(z)와 너무 멀어지지 않게 한다. Reconstruction과 latent regularization의 균형 덕분에 prior에서 sample해 생성하는 경로가 생긴다."
        symbols={[
          [String.raw`q_\phi(z\mid x)`, '입력 x를 보고 encoder가 추론한 approximate posterior'],
          [String.raw`p_\psi(x\mid z)`, 'latent z에서 데이터를 생성하는 decoder likelihood'],
          [String.raw`p(z)`, 'sampling의 기준이 되는 latent prior'],
          [String.raw`D_{KL}`, 'posterior를 prior와 정렬하는 regularization 비용'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Diffusion과의 연결은 어디까지인가?</h3>
        <p>
          Latent diffusion은 별도 autoencoder가 이미지를 작은 latent로 압축한 뒤 그 공간에서 diffusion을 수행한다. 따라서
          autoencoder는 계산 공간을 제공하지만 diffusion의 noise prediction 과정 자체와 동일하지 않다. 이 구분을 잡으면
          다음 생성 모델 글에서 encoder·decoder와 denoiser의 역할을 섞지 않게 된다. 확률분포를 학습하는 변형의 정식 유도는
          <InternalLink slug="vae"> VAE 글</InternalLink>에서, 압축 latent 위에 denoiser를 올리는 구조는
          <InternalLink slug="diffusion-models"> Diffusion 글</InternalLink>에서 이어서 본다.
        </p>
        <p>
          VAE에서 decoder가 latent 없이도 입력을 잘 설명하면 KL을 0으로 줄이고 code를 무시하는 posterior collapse가 생길 수
          있다. <Math>{String.raw`\beta`}</Math>는 보존과 정렬의 균형을 바꾸지만, 무조건 크게 한다고 좋은 표현이 되는 것은
          아니다. 또한 latent diffusion의 image autoencoder는 pixel MSE만으로 생기는 흐림을 줄이기 위해 perceptual loss와
          adversarial loss를 함께 쓰는 경우가 많다. 압축률뿐 아니라 재구성 충실도와 downstream 생성 품질을 같이 봐야 한다.
        </p>
        <p>
          여기의 Sparse AE는 입력 reconstruction에 sparsity를 거는 고전 변형이다. Transformer residual stream을 overcomplete
          dictionary로 분해하는 현대 해석용 <InternalLink slug="sparse-autoencoder">Sparse Autoencoder 글</InternalLink>과는
          데이터와 평가 목적이 다르다. 복원하지 않고 pair 관계로 표현을 학습하는 갈래는
          <InternalLink slug="contrastive-learning">Contrastive Learning 글</InternalLink>에서 비교한다.
        </p>
      </div>
      <CapabilityCheck
        items={[
          '입력 x, latent z, reconstruction x-hat의 shape와 역할을 구분할 수 있다.',
          '2→1→2 오토인코더의 forward와 MSE를 숫자로 계산할 수 있다.',
          'decoder의 출력 오차가 encoder weight gradient까지 전달되는 순서를 설명할 수 있다.',
          '낮은 reconstruction loss가 좋은 representation을 보장하지 않는 반례를 들 수 있다.',
          'vanilla AE, denoising AE, VAE, VQ-VAE, masked AE의 학습 압력을 구분할 수 있다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Reducing the Dimensionality of Data with Neural Networks', href: 'https://www.science.org/doi/10.1126/science.1127647', note: 'deep autoencoder를 이용한 비선형 차원 축소의 대표 연구' },
          { label: 'Denoising Autoencoders', href: 'https://www.cs.toronto.edu/~larocheh/publications/icml-2008-denoising-autoencoders.pdf', note: 'corrupted input에서 clean target을 복원하는 학습 기준' },
          { label: 'Auto-Encoding Variational Bayes', href: 'https://arxiv.org/abs/1312.6114', note: 'VAE의 variational objective와 reparameterization' },
          { label: 'Masked Autoencoders Are Scalable Vision Learners', href: 'https://arxiv.org/abs/2111.06377', note: '높은 masking ratio의 image reconstruction pretraining' },
          { label: 'High-Resolution Image Synthesis with Latent Diffusion Models', href: 'https://arxiv.org/abs/2112.10752', note: 'Perceptual·adversarial objective로 학습한 image autoencoder와 latent-space diffusion의 원 연구' },
        ]}
      />
    </section>
  );
}

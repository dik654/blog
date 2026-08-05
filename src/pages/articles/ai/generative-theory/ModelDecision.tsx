import { CapabilityCheck, LearningHandoff, SourceNotes } from '@/components/learning/ArticleLearning';

const models = [
  { name: 'Autoregressive', signal: 'Token/pixel NLL', density: '정확히 계산', sample: '요소별 순차 생성', failure: '느린 긴 시퀀스 생성', use: '텍스트·코드처럼 자연스러운 순서가 있을 때' },
  { name: 'VAE', signal: 'ELBO', density: 'Lower bound', sample: 'Latent 1회 decode', failure: 'posterior collapse·흐린 출력', use: '표현 학습과 빠른 latent sampling이 중요할 때' },
  { name: 'Flow', signal: 'Exact NLL', density: '정확히 계산', sample: '가역 변환', failure: '가역 구조와 Jacobian 제약', use: '정확한 density와 역변환이 모두 필요할 때' },
  { name: 'GAN', signal: 'Discriminator', density: '직접 계산 불가', sample: 'Generator 1회', failure: 'mode collapse·불안정성', use: '빠르고 선명한 sampling이 중요할 때' },
  { name: 'Diffusion', signal: 'Noise/velocity target', density: '보통 직접 쓰지 않음', sample: '반복 solver step', failure: 'sampling 비용·조건 과잉', use: 'mode coverage와 조건부 품질이 중요할 때' },
];

export default function ModelDecision() {
  return (
    <section id="decision" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델 이름 대신 네 가지 질문으로 선택한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          생성 모델 계보는 이전 모델이 완전히 사라지는 진화도가 아니다. 각 계열은 분포를 계산 가능하게 만들기 위해 서로 다른
          제약을 선택하고, 그 대가로 sampling 속도나 학습 안정성, density 평가 가능성을 교환한다. 아래 행을 모델 선택표이자
          다음 세 글에서 반복할 체크리스트로 사용한다.
        </p>
      </div>
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {models.map((model) => (
          <article key={model.name} className="py-5">
            <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
              <h3 className="text-base font-bold">{model.name}</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-xs font-semibold text-muted-foreground">학습 신호</dt><dd className="mt-1 font-medium">{model.signal}</dd></div>
                <div><dt className="text-xs font-semibold text-muted-foreground">Density</dt><dd className="mt-1 font-medium">{model.density}</dd></div>
                <div><dt className="text-xs font-semibold text-muted-foreground">Sampling</dt><dd className="mt-1 font-medium">{model.sample}</dd></div>
                <div><dt className="text-xs font-semibold text-muted-foreground">대표 실패</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{model.failure}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs font-semibold text-muted-foreground">선택 기준</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{model.use}</dd></div>
              </dl>
            </div>
          </article>
        ))}
      </div>
      <CapabilityCheck
        items={[
          'p_data와 pθ를 학습 데이터와 모델 자체로 구분한다.',
          'Autoregressive factorization이 정확한 likelihood와 순차 sampling을 함께 만드는 이유를 설명한다.',
          'VAE, GAN, Diffusion에서 gradient를 만드는 정답 신호가 무엇인지 구분한다.',
          'Sample 품질, mode coverage, density, 속도를 별도 평가 축으로 사용한다.',
        ]}
      />
      <LearningHandoff
        description="생성 모델을 연도순으로 전부 읽지 않는다. 관측 가능한 학습 신호, density 계산 가능성, sampling 절차와 실패 형태 중 지금 풀 질문에 필요한 한 경로만 연다."
        items={[
          { label: '이어 읽기', slug: 'vae', title: 'VAE', reason: '명시적 latent posterior와 ELBO를 통해 likelihood 하한, reconstruction과 prior regularization의 교환을 계산한다.' },
          { label: '이어 읽기', slug: 'gan', title: 'GAN', reason: 'Likelihood를 직접 계산하지 않고 real·generated sample 차이를 discriminator가 학습 신호로 만드는 adversarial game을 본다.' },
          { label: '이어 읽기', slug: 'diffusion-models', title: 'Diffusion Models', reason: 'Noise level별 denoising objective와 반복 sampling이 mode coverage·품질·속도 trade-off를 어떻게 바꾸는지 추적한다.' },
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Kingma & Welling · Auto-Encoding Variational Bayes', href: 'https://arxiv.org/abs/1312.6114', note: 'VAE와 reparameterized variational bound의 원 논문' },
          { label: 'Goodfellow et al. · Generative Adversarial Nets', href: 'https://arxiv.org/abs/1406.2661', note: 'Adversarial distribution learning의 원 논문' },
          { label: 'Ho et al. · Denoising Diffusion Probabilistic Models', href: 'https://arxiv.org/abs/2006.11239', note: 'DDPM과 simplified noise-prediction objective' },
        ]}
      />
    </section>
  );
}

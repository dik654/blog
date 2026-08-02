import { CapabilityCheck, LearningHandoff, SourceNotes } from '@/components/learning/ArticleLearning';

const failures = [
  ['Posterior collapse', 'KL이 거의 0이고 z를 바꿔도 출력이 비슷하다.', '강한 decoder가 z 없이 x를 예측해 qφ가 prior로 붕괴한다.', 'KL warm-up, free bits, decoder 용량 조절, mutual-information 관찰'],
  ['불안정한 variance', 'logvar가 매우 크거나 작아 loss와 gradient가 폭주한다.', '분포 scale의 수치 범위가 제한되지 않았다.', 'logvar clamp, 안정적 likelihood scale, gradient·KL 모니터링'],
  ['좋은 복원·나쁜 생성', '입력 reconstruction은 선명하지만 prior sample이 깨진다.', '학습 posterior들의 aggregate가 prior와 충분히 맞지 않는다.', 'Prior sample을 매 epoch 고정 seed로 기록하고 aggregate posterior 검사'],
  ['평균화된 출력', '여러 가능한 결과가 흐린 평균으로 합쳐진다.', '단순 Gaussian/Bernoulli likelihood가 multimodal output을 표현하지 못한다.', '더 나은 decoder likelihood, hierarchical latent, diffusion decoder 검토'],
];

export default function LimitsAndHandoff() {
  return (
    <section id="limits" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Loss 하나가 아니라 실패의 위치를 진단한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          VAE의 실패는 encoder, latent regularization, decoder likelihood, evaluation 경로 중 서로 다른 위치에서 생긴다. 총 loss만
          보면 reconstruction이 좋아지면서 KL이 무너지는 상황을 놓칠 수 있다. 최소한 reconstruction term, latent 차원별 KL,
          active unit 수, posterior 평균·분산, 고정 prior sample을 함께 기록한다.
        </p>
      </div>
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {failures.map(([name, symptom, cause, response]) => (
          <article key={name} className="py-5">
            <h3 className="text-base font-bold">{name}</h3>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-xs font-semibold text-muted-foreground">관측 증상</dt><dd className="mt-1 leading-relaxed">{symptom}</dd></div>
              <div><dt className="text-xs font-semibold text-muted-foreground">구조적 원인</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{cause}</dd></div>
              <div><dt className="text-xs font-semibold text-muted-foreground">확인·대응</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{response}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <CapabilityCheck items={['μ와 logvar에서 posterior sample을 계산한다.', 'Reparameterization이 random node의 위치를 옮기는 이유를 설명한다.', 'ELBO의 reconstruction과 KL 항을 각각 진단한다.', '학습·복원·prior generation의 데이터 흐름을 구분한다.']} />
      <LearningHandoff
        description="VAE가 만든 산출물은 sample 하나가 아니라 encoder posterior, prior와 decoder를 잇는 latent-variable likelihood 경로다. Blur나 posterior collapse가 보이면 어느 가정이 만든 실패인지 확인한 뒤 다른 생성 신호와 비교한다."
        items={[
          { label: '막히면', slug: 'generative-theory', title: '생성 모델의 공통 질문', reason: 'p_data와 pθ, density·sampling·coverage·quality 네 축 중 무엇을 비교하는지 다시 고정한다.' },
          { label: '이어 읽기', slug: 'gan', title: 'GAN', reason: 'Likelihood 가정 대신 decoder sample과 real data를 직접 비교하는 신호를 배우고, 안정성 대신 생기는 game imbalance를 본다.' },
          { label: '적용하기', slug: 'diffusion-models', title: 'Diffusion Models', reason: 'VAE의 한 번짜리 latent reconstruction과 noise level별 반복 denoising을 같은 평가 축에서 비교한다.' },
        ]}
      />
      <SourceNotes sources={[
        { label: 'Kingma & Welling · Auto-Encoding Variational Bayes', href: 'https://arxiv.org/abs/1312.6114', note: 'Reparameterization과 stochastic variational lower bound' },
        { label: 'Higgins et al. · beta-VAE', href: 'https://openreview.net/forum?id=Sy2fzU9gl', note: 'KL weight를 통한 representation capacity 조절' },
        { label: 'Lucas et al. · Understanding Posterior Collapse', href: 'https://openreview.net/forum?id=r1xaVLUYuE', note: 'Posterior collapse를 linear VAE 관점에서 분석' },
      ]} />
    </section>
  );
}

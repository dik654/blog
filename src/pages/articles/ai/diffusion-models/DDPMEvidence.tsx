import {
  CapabilityCheck,
  InternalLink,
  Misconception,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';

const receipts = [
  {
    label: '재현 recipe',
    result: 'T=1000 · linear β 10⁻⁴→0.02',
    detail: 'PixelCNN++-style U-Net, group normalization, sinusoidal timestep embedding, 16×16 self-attention. CIFAR-10에는 dropout 0.1, EMA에는 0.9999를 사용했다.',
  },
  {
    label: 'CIFAR-10 sample',
    result: 'IS 9.46±0.11 · FID 3.17',
    detail: 'FID 3.17은 training set 기준이다. Test set을 기준으로 다시 계산한 FID는 5.24였다.',
  },
  {
    label: 'Objective ablation',
    result: 'L: FID 13.51 · L simple: FID 3.17',
    detail: 'Fixed isotropic variance 조건에서 exact bound는 NLL 3.70, reweighted L simple은 NLL ≤3.75였다. Sample과 codelength의 우승자가 달랐다.',
  },
] as const;

export default function DDPMEvidence() {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2020 DDPM의 숫자는 설계 영수증이지 영구 기본값이 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이제 수식이 실제 논문의 구현과 결과로 닫히는지 확인한다. Ho et al.은 모든 실험에서 1,000 step과 선형 beta schedule을 썼다.
          Reverse variance는 학습하지 않고 <code>beta_t</code> 또는 posterior variance <code>beta-tilde_t</code>로 고정했으며 두 극단이 비슷한 결과를 보였다고 보고했다.
        </p>
        <p>
          아래 수치는 “오늘도 이 설정이 최선”이라는 주장이 아니다. Posterior, objective와 sampler를 재현했을 때 논문의 artifact와 같은 실험을 읽고 있는지 확인하는 영수증이다.
        </p>
      </div>
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {receipts.map((receipt) => (
          <article key={receipt.label} className="grid gap-3 py-5 sm:grid-cols-[9rem_16rem_minmax(0,1fr)] sm:gap-6">
            <p className="text-sm font-bold">{receipt.label}</p>
            <p className="text-sm font-black leading-relaxed">{receipt.result}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{receipt.detail}</p>
          </article>
        ))}
      </div>
      <Misconception>
        1,000 step을 논문이 sweep해 최적이라고 증명한 것은 아니다. 당시 선행 연구와 neural network evaluation 수를 맞춘 실험 선택이다. 또한 FID 3.17과 NLL 3.70은 서로 다른 objective 조건에서 나온 지표라 하나의 “성능 점수”로 합치면 안 된다.
      </Misconception>
      <StopRule>
        Exact posterior, <code>L simple</code>의 reweighting, Algorithm 2의 마지막-step 분기와 원문 evidence boundary를 설명할 수 있으면 DDPM 바닥은 끝이다. Backbone·path·solver가 바뀐 현재 계열은 <InternalLink slug="dit-flow-matching-evaluation">DiT와 Flow Matching</InternalLink>에서 이어 간다.
      </StopRule>
      <CapabilityCheck items={[
        'xₜ와 x₀가 주어졌을 때 q(xₜ₋₁|xₜ,x₀)가 Gaussian closed form이 되는 이유를 말한다.',
        'Exact variational bound와 L simple이 같은 오차에 다른 timestep weight를 주는 이유를 설명한다.',
        'Algorithm 2에서 ε 예측, mean correction, variance noise와 t=1 분기를 순서대로 계산한다.',
        'FID 3.17이 training-set 기준이며 NLL과 sample quality가 같은 목표가 아님을 구분한다.',
        '2020 recipe와 현재 latent·DiT·flow·few-step 설계를 분리해 읽는다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Ho et al. · Denoising Diffusion Probabilistic Models', href: 'https://arxiv.org/abs/2006.11239', note: 'Forward posterior, noise parameterization, Algorithm 1·2, CIFAR-10 evidence와 appendix의 1차 출처.' },
        { label: 'Official DDPM implementation', href: 'https://github.com/hojonathanho/diffusion', note: '원 논문이 공개한 TensorFlow implementation과 configuration을 재현할 때 확인한다.' },
        { label: 'NeurIPS 2020 proceedings', href: 'https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html', note: '출판본과 supplemental material의 고정 기록.' },
      ]} />
    </section>
  );
}

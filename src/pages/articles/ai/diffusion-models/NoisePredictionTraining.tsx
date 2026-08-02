import { useState } from 'react';
import { InternalLink, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';
import SourceFormula from './SourceFormula';
import { ObjectiveTradeoffLab, PosteriorBalanceLab } from './viz/DDPMSourceLabs';

function TrainingExample() {
  const [timestep, setTimestep] = useState(400);
  const [prediction, setPrediction] = useState(0.15);
  const x0 = 0.8;
  const epsilon = -0.6;
  const alphaBar = globalThis.Math.exp(-4.6 * timestep / 1000);
  const xt = globalThis.Math.sqrt(alphaBar) * x0 + globalThis.Math.sqrt(1 - alphaBar) * epsilon;
  const loss = (epsilon - prediction) ** 2;
  const estimatedX0 = (xt - globalThis.Math.sqrt(1 - alphaBar) * prediction) / globalThis.Math.max(0.001, globalThis.Math.sqrt(alphaBar));

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="training-t" className="block text-xs font-semibold text-muted-foreground">timestep · {timestep}<input id="training-t" type="range" min="20" max="980" step="20" value={timestep} onChange={(event) => setTimestep(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="noise-prediction" className="block text-xs font-semibold text-muted-foreground">모델의 ε̂ · {prediction.toFixed(2)}<input id="noise-prediction" type="range" min="-1.5" max="1.5" step="0.05" value={prediction} onChange={(event) => setPrediction(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
          {[
            ['clean x₀', x0.toFixed(3)],
            ['true ε', epsilon.toFixed(3)],
            ['noisy xₜ', xt.toFixed(3)],
            ['estimated x̂₀', estimatedX0.toFixed(3)],
            ['MSE', loss.toFixed(4)],
          ].map(([term, value], index) => <div key={term} className={`p-3 ${index === 4 ? 'bg-blue-600 text-white' : 'bg-background'}`}><p className={`text-xs font-semibold ${index === 4 ? 'text-white/75' : 'text-muted-foreground'}`}>{term}</p><p className="mt-1 font-mono text-lg font-bold">{value}</p></div>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">ε̂를 실제 -0.60에 맞추면 MSE가 0이 되고, 같은 예측에서 x̂₀도 0.80으로 복원된다. t가 클수록 x₀ coefficient가 작아져 같은 noise 예측 오차가 x̂₀에 더 크게 증폭될 수 있다.</p>
      </div>
    </div>
  );
}

export default function NoisePredictionTraining() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델은 이미지를 직접 맞히지 않고 넣었던 noise를 맞힌다</h2>
      <QuestionLead
        question="왜 직전 이미지 xₜ₋₁를 직접 저장하지 않고도 reverse model을 학습할 수 있을까?"
        answer="Forward process는 Gaussian이라 xₜ와 clean x₀가 주어지면 직전 state의 posterior 평균과 분산을 정확히 계산할 수 있다. 그 평균을 noise ε로 다시 parameterize하면 코드가 noising에 사용한 ε 자체가 무료 label이 된다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          먼저 빠진 다리를 복원한다. Forward process가 <code>x0 → x1 → ... → xt</code>의 Markov chain이어도 학습 때는 clean
          sample <code>x0</code>를 알고 있다. 따라서 현재 noisy state <code>xt</code>와 시작점 <code>x0</code>를 함께 조건으로 주면
          직전 state <code>x(t-1)</code>의 분포가 아래 Gaussian으로 닫힌다.
        </p>
      </div>
      <SourceFormula
        latex={String.raw`\begin{aligned}
q(x_{t-1}\mid x_t,x_0)&=\mathcal N(x_{t-1};\widetilde\mu_t,\widetilde\beta_t I)\\
c_{0,\text{시작점}}&=\frac{\sqrt{\bar\alpha_{t-1}}\beta_t}{1-\bar\alpha_t}\\
c_{t,\text{현재값}}&=\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\\
\widetilde\mu_t&=c_{0,\text{시작점}}x_0+c_{t,\text{현재값}}x_t\\
\widetilde\beta_t&=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t
\end{aligned}`}
        meaning="두 관측을 한 평균으로 섞는다. x₀ 항은 시작점이 직전 state를 어디로 당기는지, xₜ 항은 바로 다음 관측이 어디에 가까워야 하는지를 나타낸다. 분모 1-ᾱₜ는 누적 noise scale로 두 계수를 같은 조건부 분포 안에서 정규화한다. x₀라는 추가 단서를 봤으므로 posterior variance β̃ₜ는 새로 넣은 noise βₜ보다 크지 않다."
        symbols={[
          [String.raw`q(x_{t-1}\mid x_t,x_0)`, 'Forward chain이 알려 주는 exact one-step posterior'],
          [String.raw`\widetilde\mu_t`, 'clean 시작점과 현재 noisy 관측을 precision에 맞춰 섞은 평균'],
          [String.raw`\widetilde\beta_t`, '두 관측을 조건으로 본 뒤 남은 불확실성'],
          [String.raw`\bar\alpha_{t-1},\bar\alpha_t`, '시작 signal이 직전·현재 timestep까지 남은 누적 비율'],
          ['Gaussian closure', 'Gaussian transition에 Gaussian 관측을 조건으로 걸면 posterior도 Gaussian이라 KL을 closed form으로 계산할 수 있다.'],
        ]}
      />
      <PosteriorBalanceLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Reverse model은 inference에서 <code>x0</code>를 볼 수 없다. 논문은 network가 posterior mean을 바로 예측하는 대신,
          <code>xt</code>를 만들 때 사용한 noise를 예측하도록 mean을 다시 썼다. 같은 Gaussian KL이 coefficient가 붙은 noise MSE로 바뀌며,
          target noise는 data loader가 직접 뽑았기 때문에 사람이 label을 만들 필요가 없다.
        </p>
      </div>
      <TrainingExample />
      <SourceFormula
        latex={String.raw`\begin{aligned}
\widehat\epsilon&=\epsilon_\theta(x_t,t,c)\\
\mathcal L_{\mathrm{simple}}&=\mathbb E_{x_0,t,\epsilon}\!\left[\|\epsilon-\widehat\epsilon\|_2^2\right]\\
\widehat x_0&=\frac{x_t-\sqrt{1-\bar\alpha_t}\widehat\epsilon}{\sqrt{\bar\alpha_t}}
\end{aligned}`}
        meaning="Network는 noisy input, timestep과 선택 조건에서 넣었던 noise를 예측한다. 제곱은 양·음 오차가 상쇄되지 않게 하고 L2 합은 모든 좌표의 noise mismatch를 하나의 scalar loss로 만든다. 같은 식을 x₀에 대해 풀면 clean estimate도 얻는다. 다만 원 논문의 L simple은 exact variational bound의 timestep weight를 의도적으로 버린 reweighted objective다."
        symbols={[
          [String.raw`x_t`, 'Forward closed form으로 만든 noisy training input'],
          [String.raw`t`, 'Network가 현재 noise scale을 구분하기 위한 timestep embedding'],
          [String.raw`c`, 'Text, class, image처럼 선택적인 생성 조건. Unconditional DDPM에서는 없다.'],
          [String.raw`\widehat\epsilon`, 'Network가 예측한 Gaussian noise'],
          [String.raw`\|\epsilon-\widehat\epsilon\|_2^2`, '실제와 예측 noise의 좌표별 차이를 제곱해 합한 오차'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 true variational bound를 그대로 쓰지 않았을까?</h3>
        <p>
          DDPM Eq. 12의 noise MSE에는 timestep별 coefficient가 붙는다. Ho et al.은 Eq. 14에서 이 weight를 버리고 timestep을 균등하게 뽑았다.
          작은 noise의 쉬운 복원 항을 상대적으로 낮추고 큰 noise의 어려운 denoising에 더 집중한 것이다. 논문 Table 2에서 이 선택은
          codelength를 조금 양보하는 대신 sample quality를 크게 개선했다.
        </p>
      </div>
      <ObjectiveTradeoffLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 training step의 구현 순서</h3>
        <ol>
          <li>Data batch <code>x0</code>, random timestep <code>t</code>, Gaussian <code>eps</code>를 뽑는다.</li>
          <li>Schedule에서 coefficient를 gather해 <code>xt</code>를 만든다.</li>
          <li>Network가 <code>xt, t, condition</code>에서 target을 예측한다.</li>
          <li>선택한 objective가 exact bound면 timestep coefficient를 적용하고, 원 논문의 <code>L simple</code>이면 unweighted MSE를 평균해 optimizer를 update한다.</li>
        </ol>
        <p>
          마지막 문장의 “update” 사이에는 계산 단계가 하나 더 있다. Scalar MSE에서 시작한 gradient가
          U-Net의 convolution, attention과 skip path를 계산 그래프의 역순으로 통과해 모든
          <code>θ</code>의 gradient를 만든다. 이 reverse-mode 계산은
          <InternalLink slug="backprop-optimization">역전파와 최적화 글</InternalLink>의
          계산 그래프 → chain rule → backward 순서로 이어서 확인한다.
        </p>
      </div>
      <Misconception>
        <code>L simple</code>은 모든 diffusion 모델의 유일한 정답 objective가 아니다. 2020 논문은 fixed forward variance에서 sample quality를 위해
        VLB의 weighting을 바꿨다. Learned variance, v-prediction과 modern weighting은 이 원문 선택 위의 별도 설계다.
      </Misconception>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";

const processes = [
  ["Forward q", "설계로 고정", "Data에 Gaussian noise를 더해 xₜ를 만듭니다."],
  ["Denoiser εθ", "학습 대상", "xₜ와 t에서 추가된 noise를 예측합니다."],
  ["Sampler", "추론 algorithm", "예측값과 schedule로 다음 state를 계산합니다."],
];

export default function ForwardReverse() {
  return (
    <section id="forward-reverse" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Forward process는 고정하고 reverse direction만 학습합니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DDPM의 forward transition은 작은 Gaussian noise를 단계별로 더하는
          Markov chain입니다. <code>αₜ=1−βₜ</code>, <code>ᾱₜ=∏ₛ₌₁ᵗαₛ</code>로
          두면 중간 단계를 모두 거치지 않고 clean sample <code>x₀</code>에서
          임의의
          <code>xₜ</code>를 직접 만들 수 있습니다. 이 closed form 덕분에
          training batch의 서로 다른 timestep을 병렬로 학습합니다.
        </p>
        <p>
          Original DDPM의 simple objective는 network가 <code>xₜ</code>와
          <code>t</code>에서 noise <code>ε</code>를 예측하도록 합니다. 이 MSE는
          variational bound의 weighted form과 연결됩니다. Timestep weighting을
          생략한 “그냥 MSE”라는 설명만으로는 likelihood와 schedule의 역할을
          놓치게 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="clean sample에서 임의의 noise level xₜ를 중간 단계를 밟지 않고 어떻게 만들까?"
        idea={
          <>
            각 step의 Gaussian transition을 합성하면 평균은 signal scale의
            곱으로, variance는 남은 noise budget으로 정리됩니다. 그래서
            training은 timestep마다 순차 corruption을 실행할 필요가 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          q(x_t\mid x_0)&=\mathcal N\!\left(\sqrt{\bar\alpha_t}x_0,(1-\bar\alpha_t)I\right) \\
          x_t&=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon
        \end{aligned}`}
        terms={[
          {
            symbol: "\alpha_t=1-\beta_t",
            name: "signal retention",
            description: "t번째 transition이 이전 signal을 남기는 비율입니다.",
          },
          {
            symbol: "\bar\alpha_t=\prod_{s=1}^{t}\alpha_s",
            name: "cumulative signal",
            description: "x₀가 t시점까지 남는 전체 scale입니다.",
          },
          {
            symbol: "\epsilon\sim\mathcal N(0,I)",
            name: "sampled noise",
            description: "reparameterization에 쓰는 standard Gaussian입니다.",
          },
        ]}
        assumptions={[
          "forward transition이 isotropic Gaussian인 DDPM formulation입니다.",
          "β schedule은 학습 전에 정해져 있으며 network parameter가 아닙니다.",
        ]}
        interpretation="t가 커져 ᾱₜ가 작아질수록 x₀ contribution은 줄고 noise contribution은 커집니다. 이 closed form은 training corruption을 병렬화하지만 reverse sampling까지 한 번에 끝낸다는 뜻은 아닙니다."
      />
      <ExplainedFormula
        question="denoiser가 각 noise level에서 어떤 supervised target을 맞출까?"
        idea={
          <>
            xₜ를 만들 때 실제로 사용한 Gaussian noise를 알고 있으므로, network가
            그 noise를 복원하도록 regression target을 구성합니다.
          </>
        }
        formula={String.raw`\mathcal L_{\mathrm{simple}}=\mathbb E_{x_0,t,\epsilon}\!\left[\left\lVert\epsilon-\epsilon_\theta(x_t,t)\right\rVert_2^2\right]`}
        terms={[
          {
            symbol: "\epsilon_\theta(x_t,t)",
            name: "noise predictor",
            description:
              "noisy sample과 noise level에서 추가된 noise를 예측합니다.",
          },
          {
            symbol: "t",
            name: "sampled timestep",
            description:
              "한 batch 안에서 서로 다른 noise level을 학습하게 합니다.",
          },
          {
            symbol: "\mathbb E",
            name: "training expectation",
            description: "data, timestep과 noise sampling 전체의 평균입니다.",
          },
        ]}
        assumptions={[
          "original DDPM의 simplified ε-prediction objective를 기준으로 합니다.",
          "ELBO의 timestep-dependent weighting을 단순화한 objective이므로 likelihood 그 자체와 같다고 읽지 않습니다.",
        ]}
        interpretation="loss는 noise prediction error를 줄입니다. x₀-prediction이나 v-prediction은 같은 model family의 다른 parameterization이며 noise level별 numerical weighting이 달라집니다."
      />

      <ExplainedFormula
        question="Noise predictor가 왜 noisy distribution의 score를 알려 줄까요?"
        idea={
          <>
            x₀가 고정된 Gaussian conditional density의 log를 xₜ로 미분하면
            평균에서 벗어난 거리를 variance로 나눈 값이 나옵니다. Forward 식에서
            그 거리는 noise scale×ε이므로 score와 ε가 알려진 배율로 연결됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          \nabla_{x_t}\log q(x_t\mid x_0)
          &=-\frac{x_t-\sqrt{\bar\alpha_t}x_0}{1-\bar\alpha_t} \\
          &=-\frac{\epsilon}{\sqrt{1-\bar\alpha_t}}
        \end{aligned}`}
        terms={[
          {
            symbol: "\nabla_{x_t}\log q",
            name: "conditional score",
            description:
              "현재 noisy point에서 conditional log density가 커지는 방향입니다.",
          },
          {
            symbol: "\sqrt{1-\bar\alpha_t}",
            name: "noise standard deviation",
            description: "Timestep t에서 추가된 Gaussian noise의 scale입니다.",
          },
          {
            symbol: "\epsilon",
            name: "noise target",
            description:
              "Forward sample을 만들 때 실제 사용해 training에서 아는 표준 Gaussian입니다.",
          },
        ]}
        assumptions={[
          "첫 score는 x₀에 조건부인 isotropic Gaussian q(xₜ|x₀)의 정확한 값입니다.",
          "Marginal score는 여러 x₀의 conditional score를 posterior weight로 평균한 값이며 MSE optimum과 연결됩니다.",
        ]}
        interpretation="Noise prediction과 score prediction은 완전히 다른 model family가 아니라 known time-dependent scale로 바꿀 수 있는 parameterization입니다. 다만 finite network·loss weighting·numerical precision에서는 optimization behavior가 달라질 수 있습니다."
      />

      <figure className="not-prose my-8 grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-3 md:p-6">
        {processes.map(([title, state, body]) => (
          <div key={title} className="min-w-0 border-t border-border pt-4">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 font-mono text-xs text-primary">{state}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Reverse process와 sampler는 분리해서 봅니다</h3>
        <p>
          Network prediction을 이용해 <code>xₜ</code>에서 <code>xₜ₋₁</code>로
          가는 mean을 구성하고 필요하면 variance noise를 더합니다. DDPM
          sampler는 stochastic reverse transition을 따르지만, DDIM이나 ODE
          solver처럼 다른 경로로 같은 trained network를 사용할 수도 있습니다.
          따라서 “모델이 T번 denoising한다”는 표현에는 network, schedule과
          sampler라는 세 요소가 함께 들어 있습니다.
        </p>
        <p>
          <code>ε</code> prediction 외에도 clean sample <code>x₀</code>, score
          또는 velocity <code>v</code>를 예측하는 parameterization이 있으며,
          noise level과 guidance에 따른 numerical behavior가 달라집니다.
        </p>
      </div>
    </section>
  );
}

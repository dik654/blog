import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

const concepts = [
  [
    "Forward SDE",
    "data → noise",
    "Drift와 Gaussian increment로 distribution을 단순한 prior 쪽으로 보냅니다.",
  ],
  [
    "Reverse-time SDE",
    "noise → data",
    "Score correction을 더한 stochastic dynamics로 시간을 거슬러 옵니다.",
  ],
  [
    "Probability-flow ODE",
    "같은 marginals",
    "Random increment 없이 같은 시간별 distribution을 만드는 deterministic path입니다.",
  ],
  [
    "Flow Matching",
    "velocity regression",
    "선택한 probability path의 conditional velocity를 직접 학습합니다.",
  ],
] as const;

const solvers = [
  [
    "Euler",
    "1회",
    "1차",
    "한 slope만 사용해 싸지만 큰 step에서 error가 큽니다.",
  ],
  [
    "Heun",
    "2회",
    "2차",
    "예상 끝점 slope로 보정하므로 step 수와 NFE가 다릅니다.",
  ],
  [
    "Adaptive RK",
    "가변",
    "가변",
    "Error estimate로 step을 수락·거절하며 tolerance가 NFE를 바꿉니다.",
  ],
] as const;

export default function ContinuousTime() {
  return (
    <section id="continuous-time" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Continuous time은 diffusion·score·flow를 같은 dynamics 언어로 연결합니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DDPM의 timestep을 아주 잘게 나누면 distribution의 변화는 연속시간
          stochastic differential equation(SDE)으로 표현할 수 있습니다. 여기서
          ODE·SDE·Euler·Heun이 낯설다면 먼저{" "}
          <Link to="/ai/math-differential-equations-numerical-solvers">
            미분방정식·수치적분 정본
          </Link>
          의 scalar decay와 Brownian increment 예제를 읽으면 됩니다. 이 절에서는
          그 도구가 time-dependent score와 결합하는 부분만 확장합니다.
        </p>
      </div>

      <div
        id="paper-score-sde"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Continuous score dynamics
        </p>
        <p className="mt-2 text-sm font-semibold">
          Score-Based Generative Modeling through Stochastic Differential
          Equations
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Discrete score model과 diffusion을 forward SDE·reverse-time SDE로
          통합하고, predictor-corrector와 같은 marginals를 갖는 probability-flow
          ODE를 제시합니다. SDE와 ODE의 개별 sample path가 같다는 주장이 아니라
          시간별 marginal distribution이 같다는 정리입니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2011.13456"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 reverse SDE·ODE 유도 보기
        </a>
      </div>

      <figure
        data-viz="continuous-dynamics"
        className="not-prose my-8 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 sm:p-6"
      >
        {concepts.map(([title, route, body]) => (
          <div key={title} className="min-w-0 border-t border-border pt-4">
            <p className="font-semibold">{title}</p>
            <p className="mt-2 break-words font-mono text-xs text-primary">
              {route}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <ExplainedFormula
        question="Forward SDE를 data에서 noise로 보냈다면 어떤 식이 시간을 거꾸로 돌릴까요?"
        idea={
          <>
            Forward drift만 부호를 바꾸는 것으로는 퍼진 probability mass를 모을
            수 없습니다. 현재 noisy distribution의 log-density gradient인
            score를 diffusion variance만큼 보정해 reverse drift에 넣습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          d x={}&\left[f(x,t)-g(t)^2\nabla_x\log p_t(x)\right]dt \\
          &+g(t)d\overline W_t \qquad \text{(reverse time)}
        \end{aligned}`}
        terms={[
          {
            symbol: "f(x,t)",
            name: "forward drift",
            description: "Forward process의 평균적인 deterministic 이동입니다.",
          },
          {
            symbol: "g(t)^2\\nabla_x\\log p_t(x)",
            name: "score correction",
            description:
              "퍼진 mass를 현재 perturbed data density가 높은 방향으로 되모읍니다.",
          },
          {
            symbol: "d\\overline W_t",
            name: "reverse Brownian increment",
            description:
              "Reverse-time stochastic path에 남는 random increment입니다.",
          },
        ]}
        assumptions={[
          "Forward SDE가 필요한 regularity와 density를 가지며 reverse time은 terminal T에서 0 방향으로 적분합니다.",
          "식의 true score는 알 수 없어 neural score estimate로 대체하므로 실제 sampler에는 model error와 discretization error가 함께 있습니다.",
        ]}
        interpretation="Score가 틀리면 reverse transition도 틀립니다. Solver step을 무한히 작게 줄여도 network의 score approximation error는 사라지지 않으므로 model과 solver를 따로 평가해야 합니다."
      />

      <ExplainedFormula
        question="Random path를 없애면서 같은 시간별 distribution을 유지할 수 있을까요?"
        idea={
          <>
            Stochastic diffusion이 distribution을 퍼뜨리는 효과 중 절반을 score
            drift로 옮기면 noise term 없이도 같은 Fokker–Planck marginal
            evolution을 만드는 deterministic ODE를 구성할 수 있습니다.
          </>
        }
        formula={String.raw`\frac{dx}{dt}=f(x,t)-\frac12 g(t)^2\nabla_x\log p_t(x)`}
        terms={[
          {
            symbol: "dx/dt",
            name: "deterministic velocity",
            description:
              "Initial noise가 정해지면 하나의 trajectory를 만드는 ODE field입니다.",
          },
          {
            symbol: String.raw`\tfrac12 g(t)^2`,
            name: "half score coefficient",
            description:
              "Random diffusion term을 제거하며 marginal evolution을 보존하는 계수입니다.",
          },
          {
            symbol: "p_t",
            name: "time marginal density",
            description:
              "각 t에서 forward SDE와 probability-flow ODE가 공유하는 distribution입니다.",
          },
        ]}
        assumptions={[
          "정확한 score와 exact integration이라는 이론적 조건에서 time marginal이 같습니다.",
          "SDE와 ODE가 같은 random trajectory·coupling·finite-step output을 만든다는 뜻은 아닙니다.",
        ]}
        interpretation="Probability-flow ODE는 trained score model을 deterministic solver와 likelihood path에 사용할 수 있게 합니다. 그러나 같은 marginal 정리는 finite NFE에서 sample-by-sample equality를 보장하지 않습니다."
      />

      <div
        id="paper-flow-matching"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Direct velocity training
        </p>
        <p className="mt-2 text-sm font-semibold">
          Flow Matching for Generative Modeling
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continuous normalizing flow를 simulation 없이 학습하기 위해,
          sample하기 쉬운 conditional probability path의 vector field를
          regression하는 objective를 제안합니다. Diffusion path도 포함하지만
          score-SDE에서 자동으로 파생되는 동일한 training objective라는 뜻은
          아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2210.02747"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 conditional flow matching 정리 보기
        </a>
      </div>

      <ExplainedFormula
        question="ODE trajectory를 만들 velocity field를 simulation 없이 어떻게 학습할까요?"
        idea={
          <>
            Data endpoint를 조건으로 삼으면 중간 state와 그 순간의 target
            velocity를 직접 sample할 수 있는 path를 고릅니다. Network가 이
            conditional velocity를 MSE로 맞추면 같은 x,t에 가능한 target들의
            conditional mean을 배우며 marginal flow field와 연결됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          \mathcal L_{\mathrm{CFM}}(\theta)
          =\mathbb E_{t,x_1,x_t}\big[&\lVert v_\theta(x_t,t) \\
          &-u_t(x_t\mid x_1)\rVert_2^2\big]
        \end{aligned}`}
        terms={[
          {
            symbol: "x_1",
            name: "data endpoint",
            description:
              "Conditional probability path를 정하는 data sample입니다.",
          },
          {
            symbol: "x_t",
            name: "intermediate state",
            description:
              "Chosen conditional path에서 직접 sample한 시간 t의 state입니다.",
          },
          {
            symbol: "u_t(x_t\\mid x_1)",
            name: "conditional target velocity",
            description:
              "선택한 path가 제공해 simulation 없이 계산할 수 있는 supervision입니다.",
          },
        ]}
        assumptions={[
          "Conditional path의 sample과 velocity를 tractably 계산할 수 있고 필요한 regularity가 있습니다.",
          "Path 선택이 arbitrary하게 공짜인 것은 아니며 trajectory curvature·endpoint coupling이 sampling NFE와 generalization을 바꿉니다.",
        ]}
        interpretation="Flow Matching은 단순히 diffusion sampler의 이름을 바꾼 것이 아닙니다. 어떤 probability path와 coupling을 고르고 어떤 velocity를 직접 regression하는지가 model contract입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Step 수와 NFE를 구분합니다</h3>
        <p>
          “4-step generation”은 네 번의 state update를 뜻할 수 있지만 Heun처럼
          한 step에서 network를 두 번 호출하면 NFE는 8입니다. Classifier-free
          guidance도 conditional·unconditional prediction을 별도로 계산하면
          NFE나 한 evaluation의 batch cost를 바꿉니다. 따라서 latency를 비교할
          때는 step 수만 적지 말고 실제 NFE, wall-clock, batch, precision과
          hardware를 함께 기록해야 합니다.
        </p>
      </div>

      <figure
        data-viz="solver-nfe"
        className="not-prose my-8 rounded-xl border border-border bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          Solver step과 network 호출 비용을 분리한 비교
        </figcaption>
        <div className="grid gap-4 md:grid-cols-3">
          {solvers.map(([name, nfe, order, note]) => (
            <div key={name} className="min-w-0 border-t border-border pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{name}</p>
                <span className="font-mono text-xs text-primary">
                  NFE/step {nfe}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                명목 order · {order}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}

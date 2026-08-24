import ExplainedFormula from "@/components/ui/explained-formula";

const comparison = [
  [
    "ODE",
    "dx=f(x,t)dt",
    "초기값과 vector field가 정해지면 한 deterministic path",
  ],
  [
    "SDE",
    "dx=f(x,t)dt+g(x,t)dWₜ",
    "같은 초기값에서도 noise realization마다 다른 path",
  ],
] as const;

export default function OdeSdeBoundary() {
  return (
    <section id="ode-sde-boundary" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SDE는 매 순간 들어오는 random fluctuation까지 변화 법칙에 넣습니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ODE의 다음 변화량은 현재 state와 시간으로 정해집니다. SDE에는 Brownian
          motion의 작은 increment <code>dWₜ</code>가 더해져 같은 출발점에서도
          여러 sample path가 나옵니다. <code>dWₜ</code>는 보통 시간 간격
          <code>Δt</code>에서 평균 0, 분산 <code>Δt</code>인 Gaussian
          increment로 이해할 수 있으며, 크기가 <code>Δt</code>가 아니라
          <code>√Δt</code> scale이라는 점이 중요합니다.
        </p>
      </div>

      <figure
        data-viz="ode-sde-boundary"
        className="not-prose my-8 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 sm:p-6"
      >
        {comparison.map(([kind, equation, meaning]) => (
          <div key={kind} className="min-w-0 border-t border-border pt-4">
            <p className="font-semibold">{kind}</p>
            <p className="mt-3 break-words font-mono text-sm text-primary">
              {equation}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </div>
        ))}
      </figure>

      <ExplainedFormula
        question="짧은 시간 Δt 동안 SDE의 변화량은 어떻게 근사할까요?"
        idea={
          <>
            Deterministic drift는 시간에 비례하고, Brownian increment는 분산이
            시간에 비례하므로 표준편차가 √Δt에 비례합니다. 두 항을 더한 가장
            단순한 Euler–Maruyama step을 만듭니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          x_{n+1}={}&x_n+f(x_n,t_n)\Delta t \\
          &+g(x_n,t_n)\sqrt{\Delta t}\,\epsilon_n \\
          \epsilon_n&\sim\mathcal N(0,I)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          x_{n+1}={}&x_n+\underbrace{f(x_n,t_n)\Delta t}_{\text{시간에 비례하는 drift}} \\
          &+\underbrace{g(x_n,t_n)\sqrt{\Delta t}\,\epsilon_n}_{\text{Brownian scaling을 보존하는 diffusion}} \\
          \epsilon_n&\sim\underbrace{\mathcal N(0,I)}_{\text{step마다 독립인 Gaussian draw}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`f(x_n,t_n)\Delta t`, annotation: ["현재 state의 deterministic 속도에", "step 길이를 곱해 평균 이동량을 만듭니다"] },
          { expression: String.raw`g(x_n,t_n)\sqrt{\Delta t}\,\epsilon_n`, annotation: ["Noise direction에 √Δt를 곱해", "한 step 분산이 Δt가 되게 합니다"] },
          { expression: String.raw`\epsilon_n\sim\mathcal N(0,I)`, annotation: ["각 step에서 평균 0·단위 공분산인", "새 random increment를 뽑습니다"] },
        ]}
        terms={[
          {
            symbol: "f\\Delta t",
            name: "drift increment",
            description: "평균적인 deterministic 이동량입니다.",
          },
          {
            symbol: "g\\sqrt{\\Delta t}\\epsilon_n",
            name: "diffusion increment",
            description: "Step마다 새로 뽑는 random fluctuation입니다.",
          },
          {
            symbol: "g(x,t)",
            name: "diffusion coefficient",
            description:
              "Noise가 state 각 방향에 들어오는 scale과 구조를 정합니다.",
          },
        ]}
        assumptions={[
          "Itô SDE의 Euler–Maruyama discretization을 설명합니다.",
          "Strong·weak convergence order와 stiff SDE 안정성은 별도 분석이 필요합니다.",
        ]}
        interpretation="Noise 항을 Δt·ε로 쓰면 분산이 Δt²가 되어 Brownian scaling을 보존하지 못합니다. Diffusion model의 forward SDE를 읽을 때 drift와 diffusion coefficient를 분리하는 이유입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Noise scale은 한 step이 아니라 전체 시간에서 검산합니다</h3>
        <p>
          전체 시간을 <code>T</code>, step을 <code>Δt</code>라고 하면
          독립 increment가 <code>T/Δt</code>개 생깁니다. 올바른
          <code>√Δt·ε</code>의 한 step 분산은 <code>Δt</code>이므로
          전체 분산은 <code>(T/Δt)Δt=T</code>로 유지됩니다. 반면
          <code>Δt·ε</code>로 구현하면 한 step 분산이 <code>Δt²</code>이어서
          전체 분산이 <code>TΔt</code>로 줄어듭니다. Step을 잘게 할수록
          random path가 deterministic path로 붕괴하는 구현 반례입니다.
        </p>
      </div>
    </section>
  );
}

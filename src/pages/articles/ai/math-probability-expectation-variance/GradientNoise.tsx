import ExplainedFormula from "@/components/ui/explained-formula";

export default function GradientNoise() {
  return (
    <section id="gradient-noise" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Mini-batch gradient: 전체 gradient를 추정하는 random vector</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Dataset에서 어떤 example을 뽑느냐가 무작위이므로 sample gradient도 random vector입니다. Mini-batch gradient는 이 vector들의 평균입니다. 균등 sampling과 적절한 weighting 아래에서는 전체 empirical gradient에 대해 unbiased지만, sampling 방식·중복·data correlation이 바뀌면 variance와 bias도 달라집니다.</p></div>
      <ExplainedFormula
        question="전체 N개 example 대신 B개만 보고 계산한 gradient는 무엇을 추정할까요?"
        idea={<>Example별 loss gradient를 random vector로 보고 mini-batch 안에서 평균냅니다. 균등 sampling이면 그 expectation은 전체 dataset gradient와 같습니다.</>}
        formula={String.raw`\begin{aligned}
g_B(\theta)&=\frac1B\sum_{b=1}^B\nabla_\theta\ell_{I_b}(\theta),\qquad I_b\sim\operatorname{Unif}\{1,\ldots,N\},\\
\mathbb E[g_B(\theta)]&=\frac1B\sum_{b=1}^B\frac1N\sum_{i=1}^N\nabla_\theta\ell_i(\theta)
=\nabla_\theta\frac1N\sum_{i=1}^N\ell_i(\theta)
\end{aligned}`}
        terms={[{symbol:"\\ell_i",name:"sample loss",description:"Dataset example i 하나가 만드는 scalar loss입니다."},{symbol:"I_b",name:"sample index",description:"Mini-batch의 b번째 자리에서 균등하게 뽑은 dataset index입니다."},{symbol:"g_B",name:"stochastic gradient estimate",description:"전체 empirical gradient 대신 update에 쓰는 random vector입니다."}]}
        assumptions={["Dataset에서 균등하게 sampling하고 reduction과 sample weight가 전체 objective와 맞아야 합니다.","Unbiasedness는 variance가 작거나 한 step마다 loss가 감소한다는 보장이 아닙니다."]}
        interpretation="같은 θ에서도 batch가 바뀌면 g_B가 달라집니다. Batch size를 늘리면 보통 방향의 noise는 줄지만 memory·throughput·update 횟수의 trade-off가 생깁니다."
      />
      <ExplainedFormula
        question="Batch 자리를 늘렸는데 모두 같은 sample을 가리키면 variance도 1/B로 줄까요?"
        idea={<>Dataset index J를 한 번만 균등하게 뽑아 batch의 모든 자리에 복제하는 반례를 만듭니다. 각 자리는 주변적으로는 균등하지만 서로 완전히 상관되어 있어 평균에 새 정보가 추가되지 않습니다.</>}
        formula={String.raw`J\sim\operatorname{Unif}\{1,\ldots,N\},\quad I_1=\cdots=I_B=J\quad\Longrightarrow\quad g_B=\frac1B\sum_{b=1}^B\nabla\ell_{I_b}=\nabla\ell_J`}
        terms={[
          { symbol: "J", name: "shared random index", description: "Batch 전체가 함께 사용하는 하나의 균등 sample index입니다." },
          { symbol: "I_b", name: "batch-slot index", description: "b번째 자리가 가리키는 index이며 이 반례에서는 모두 J와 같습니다." },
          { symbol: "g_B", name: "correlated batch estimate", description: "B개를 평균낸 모양이지만 실제로는 sample gradient 하나와 같은 estimate입니다." },
        ]}
        assumptions={["J가 균등하므로 g_B의 expectation은 여전히 full empirical gradient와 같습니다.", "Variance는 gradient의 각 좌표나 고정 방향으로 투영한 scalar에서 비교합니다."]}
        interpretation="이 estimate는 unbiased이지만 한 sample gradient와 variance가 같습니다. 따라서 1/B 감소는 batch 크기만의 결과가 아니라 독립성 또는 covariance를 통제하는 sampling 설계의 결과입니다."
      />
      <div id="paper-robbins-monro" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20">
        <h3>Robbins–Monro가 연 문제</h3>
        <p>
          1951년 Robbins와 Monro는 함수 자체를 정확히 보지 못하고 noise가 섞인 관측만
          얻을 수 있을 때, expectation이 목표값과 일치하는 지점을 반복 update로 찾는
          stochastic approximation을 제안했습니다. 현대 mini-batch SGD와 식이 완전히
          같은 논문은 아니지만, noisy estimate와 감소하는 step size를 이용해 expectation으로
          정의된 목표에 접근한다는 이론적 출발점입니다.
        </p>
        <p>
          원 논문의 수렴 결론은 관측의 조건부 expectation·분산, 목표 함수의 단조성,
          step-size sequence 같은 전제 아래에서 읽어야 합니다. 따라서 “noise가 있으면
          언제나 더 좋은 minimum을 찾는다”거나 현대 nonconvex deep network의 수렴을
          자동으로 보장한다는 근거로 사용할 수는 없습니다.
        </p>
      </div>
    </section>
  );
}

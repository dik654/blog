export default function ConstitutionalAI() {
  return (
    <section id="constitutional-ai" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Constitutional AI는 feedback 기준을 자연어 원칙으로 드러낸다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Constitutional AI(CAI)는 model이 constitution을 기준으로 자신의 응답을
          critique하고 revise한 data를 만든 뒤, AI-generated preference를 활용하는
          방법을 제시했다. Human label을 전혀 쓰지 않는다는 뜻으로 넓히기보다,
          harmfulness feedback의 일부를 explicit principles와 AI feedback으로
          대체한 설계로 읽는 편이 정확하다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>RLAIF는 label cost를 없애는 마법이 아니다</h3>
        <p>
          Reinforcement Learning from AI Feedback(RLAIF)은 AI evaluator의
          preference를 reward model이나 direct preference objective에 사용할 수
          있게 한다. 그러나 constitution 작성, principle 충돌 순서, evaluator
          calibration, seed prompt와 final evaluation에는 여전히 사람의 판단이
          필요하다. <a href="https://arxiv.org/abs/2212.08073" target="_blank" rel="noreferrer">CAI 원 논문</a>도
          self-critique·revision의 supervised phase와 AI preference model을 사용하는
          RL phase를 구분한다. 따라서 CAI를 loss 하나로 보거나 “human oversight가
          없는 학습”으로 넓혀 이해하면 실제 pipeline을 놓치게 된다.
        </p>
        <p>
          Evaluator와 policy가 같은 blind spot이나 문체 선호를 공유할 수도 있으므로
          principle별 violation set, 여러 judge의 disagreement와 independent human
          audit을 함께 둔다. Constitution을 공개하는 것은 기준의 provenance를
          개선하지만 그 기준이 완전하거나 일관적이라는 보장은 아니다.
        </p>
      </div>

      <div
        id="paper-cai"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Constitutional AI</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          핵심 기여는 판단 기준의 provenance를 자연어 원칙으로 드러낸 것이다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Supervised phase에서는 model이 원칙에 따라 harmful response를 critique하고
          revise하며, RL phase에서는 AI가 만든 preference signal을 사용합니다.
          Constitution은 기준을 추적 가능하게 만들지만 principle 충돌, evaluator
          bias와 최종 human oversight까지 자동으로 해결하지는 않습니다.
        </p>
      </div>
    </section>
  );
}

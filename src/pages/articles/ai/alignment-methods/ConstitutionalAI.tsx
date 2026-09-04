import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function ConstitutionalAI() {
  return (
    <section id="constitutional-ai" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Constitutional AI는 feedback 기준을 자연어 원칙으로 드러낸다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Constitutional AI(CAI)는 model이 constitution을 기준으로 자신의 응답을 critique하고 revise한 data를 만든 뒤, AI-
          generated preference를 활용하는 방법을 제시했다. Human label을 전혀 쓰지 않는다는 뜻으로 넓히기보다 harmfulness feedback의 일부를
          explicit principles와 AI feedback으로 대체한 설계로 읽는 편이 정확하다.
        </p>
      </div>

      <AlgorithmBlock
        title="SL-CAI — critique·revise를 반복해 supervised data를 만든다"
        input={[
          "Red-team prompt(harmful하거나 애매한 요청)",
          "Constitution(원칙 목록)",
          "Helpful-only로 먼저 학습된 초기 model",
        ]}
        steps={[
          {
            code: "response = initial_model.sample(prompt)",
            note: "아직 harmlessness 학습이 안 된 초기 model이 red-team prompt에 처음 응답을 만듭니다.",
          },
          {
            code: "principle = sample(constitution)\ncritique = model.generate(prompt, response, principle, mode='critique')",
            note: "Constitution에서 원칙 하나를 뽑아, 그 원칙 기준으로 방금 응답의 문제를 model 스스로 지적하게 합니다.",
          },
          {
            code: "response = model.generate(prompt, response, critique, mode='revise')",
            note: "지적된 critique를 반영해 같은 응답을 수정합니다.",
          },
          {
            code: "repeat critique→revise for several principles",
            note: "원칙을 바꿔가며 critique·revise를 여러 차례 사슬처럼 반복해, 한 번에 못 잡는 위반도 누적으로 줄입니다.",
          },
          {
            code: "sl_cai_model = finetune(pretrained_model, pairs=(prompt, final_revision))",
            note: "최종 수정본과 원래 prompt를 pair로 삼아, 아직 harmlessness가 없는 pretrained model을 supervised fine-tuning합니다.",
          },
        ]}
        output="SL-CAI model — critique·revise 데이터로 harmlessness를 어느 정도 학습한 policy"
        repeatUntil="정해둔 principle·prompt 조합을 모두 소진할 때까지 반복합니다."
      />
      <AlgorithmBlock
        title="RL-CAI — AI preference로 reward model을 만들어 policy를 RL로 개선한다"
        input={[
          "SL-CAI model(위 단계의 출력)",
          "Constitution",
          "새 prompt set",
        ]}
        steps={[
          {
            code: "response_a, response_b = sl_cai_model.sample(prompt), sl_cai_model.sample(prompt)",
            note: "SL-CAI model에서 같은 prompt에 대해 서로 다른 응답 두 개를 뽑습니다.",
          },
          {
            code: "principle = sample(constitution)\nlabel = feedback_model.compare(prompt, response_a, response_b, principle)",
            note: "사람이 아니라 별도 AI feedback model이 원칙을 기준으로 어느 응답이 더 나은지 선택합니다 — 이 라벨이 사람이 만든 preference label을 대체합니다.",
          },
          {
            code: "preference_data.append((prompt, response_a, response_b, label))",
            note: "AI가 만든 (선호 응답, 비선호 응답) pair를 preference dataset에 누적합니다.",
          },
          {
            code: "reward_model = train_reward_model(preference_data)",
            note: "사람 preference로 RLHF reward model을 학습하던 것과 같은 방식으로, 이번엔 AI-labeled preference data로 reward model을 학습합니다.",
          },
          {
            code: "policy = RL_finetune(sl_cai_model, reward_model)",
            note: "SL-CAI model을 policy 초기값으로 삼아, 이 reward model을 보상으로 PPO 등 RL 알고리즘으로 추가 학습합니다.",
          },
        ]}
        output="최종 policy — supervised critique·revise와 AI-feedback 기반 RL을 모두 거친 model"
        repeatUntil="Reward model 학습과 RL fine-tuning을 목표 성능에 도달할 때까지 반복·재수집합니다."
      />

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
          Supervised phase에서는 model이 원칙에 따라 harmful response를 critique하고 revise하며 RL phase에서는 AI가 만든
          preference signal을 사용합니다. Constitution은 기준을 추적 가능하게 만들지만 principle 충돌, evaluator bias와 최종 human
          oversight까지 자동으로 해결하지는 않습니다.
        </p>
      </div>
    </section>
  );
}

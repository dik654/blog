import FeedbackContractViz from "./viz/FeedbackContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        핵심 아이디어: feedback의 모양이 학습 경로를 결정한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          같은 질문에 사실을 잘 설명한 답과 그럴듯한 거짓말이 함께 가능하다면,
          next-token likelihood만으로는 어느 쪽을 제품이 선택해야 하는지 정할 수
          없다. Pretraining은 text distribution을 학습하지만 사용자의 의도,
          사실성, 도움됨과 안전성 사이의 우선순위를 하나의 정답으로 제공하지 않기
          때문이다. Post-training은 이 모호한 목표를 사람이 관찰하고 label을 남길
          수 있는 behavior로 바꾼 뒤, 그 feedback을 policy update에 연결한다.
        </p>
        <p className="leading-7">
          이 글에서 <strong>policy</strong>는 prompt와 지금까지 생성한 token을
          조건으로 다음 token의 확률을 내는 language model을 뜻한다. SFT는 사람이
          작성하거나 선별한 정답 response의 token likelihood를 높이는 단계이고,
          preference optimization은 정답 하나를 모방하는 대신 여러 response의
          상대적 좋고 나쁨을 update에 사용한다. 따라서 RLHF·DPO 같은 약어를 보기
          전에 “어떤 feedback을 모았는가, 그 feedback을 어떤 loss로 바꾸는가,
          학습 중 새 response를 생성하는가”라는 세 질문부터 잡아야 한다.
        </p>
        <p>
          <a href="https://arxiv.org/abs/2203.02155" target="_blank" rel="noreferrer">InstructGPT</a>가
          정리한 대표 경로는 demonstration으로 SFT를 한 뒤, response ranking으로
          reward model을 학습하고 PPO로 현재 policy를 갱신하는 세 단계다. 이후
          DPO·ORPO·KTO는 같은 문제를 offline classification 형태의 objective로
          다시 구성했고, Constitutional AI는 feedback을 만드는 기준을 자연어
          principle과 AI critique로 드러냈다. 이름은 비슷하지만 대체하는 층이
          서로 다르므로, 이 글은 방법을 연대순으로 나열하지 않고 data contract,
          score model, online sampling, evaluation의 네 축으로 비교한다.
        </p>
      </div>

      <FeedbackContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Feedback은 목표 그 자체가 아니라 관측 가능한 proxy다</h3>
        <p>
          Pairwise preference는 “A가 B보다 낫다”는 상대 판단이고 binary feedback은
          개별 응답의 승인·비승인을 기록한다. Constitution은 판단 기준을
          명시하지만, principle의 충돌 순서와 evaluator의 해석이 다시 label에
          들어간다. 어느 경우든 학습되는 것은 인간 가치 전체가 아니라 수집
          protocol에서 관측한 proxy이므로, alignment objective를 낮췄다는 사실과
          실제 alignment가 좋아졌다는 결론을 구분해야 한다.
        </p>
        <p>
          따라서 held-out preference win rate 하나로 끝내지 않고, base capability
          regression, 사실성, over-refusal, calibration과 adversarial prompt를
          각각 측정한다. 특히 model judge를 쓴다면 policy와 judge가 같은 style
          shortcut을 공유할 수 있으므로 blind pairwise human audit을 독립된
          evaluation layer로 남겨야 한다.
        </p>
      </div>

      <div
        id="paper-instructgpt"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · InstructGPT</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          핵심 기여는 새 loss 하나가 아니라 세 종류의 data를 잇는 pipeline이다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문은 labeler demonstration으로 SFT를 만들고, 같은 prompt의 여러
          output ranking으로 reward model을 학습한 뒤, 그 proxy reward와 KL
          penalty를 사용해 PPO policy를 갱신했습니다. 이 결과는 특정 model·labeler
          pool·evaluation에서 보고된 것이며, preference가 인간 가치 전체를
          측정한다거나 PPO가 유일한 최적화 경로라는 결론은 아닙니다.
        </p>
      </div>
    </section>
  );
}

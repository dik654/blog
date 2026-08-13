import { Link } from "react-router-dom";

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SFT loss가 내려갔다는 사실과 제품 행동이 좋아졌다는 결론을 분리한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Held-out NLL은 demonstration distribution을 얼마나 잘 모방하는지 보여 주지만, 사실성·도움됨·안전성·새 task 일반화를 한 숫자로 보장하지 않습니다. Base checkpoint와 같은 decoding·prompt suite로 비교하고, task success·format validity·factuality·refusal·base capability regression을 각각 측정합니다.</p>
        <p>SFT는 원하는 response의 absolute likelihood를 높입니다. 두 response의 상대 선호, reference policy에서의 drift, 현재 policy가 새로 만든 rollout을 다루려면 <Link to="/ai/rlhf">RLHF·DPO 정본 글</Link>로 넘어갑니다. Preference stage가 SFT의 data 품질 문제를 자동으로 고쳐 주지는 않으므로 demonstration provenance와 독립 평가는 계속 유지합니다.</p>
      </div>
      <div id="paper-instructgpt-sft" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · InstructGPT의 SFT 단계</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">InstructGPT는 labeler-written demonstration으로 GPT-3를 supervised fine-tune한 checkpoint를 reward-model·PPO 단계의 출발점으로 사용했습니다. 논문의 SFT 결과는 해당 prompt distribution·labeler pool·model family에 대한 pipeline evidence이며, SFT 하나만으로 alignment가 끝났거나 demonstration이 인간 의도 전체를 대표한다는 뜻은 아닙니다.</p>
      </div>
    </section>
  );
}

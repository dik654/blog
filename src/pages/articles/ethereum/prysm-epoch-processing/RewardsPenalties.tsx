import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import RewardDetailViz from "./viz/RewardDetailViz";

export default function RewardsPenalties({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rewards-penalties" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reward는 validator의 base reward와 network participation을 함께 반영한다</h2>
      <RewardDetailViz />
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("process-rewards", codeRefs["process-rewards"])} /><span className="text-xs text-muted-foreground">Prysm reward accounting seam</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Altair 계열 회계는 source·target·head participation flag를 따로 봅니다. Eligible validator마다 base reward를 구하고, 참여한 flag에는 해당 참여 balance 비율을 곱한 reward를 주며, 참여하지 않은 source·target에는 penalty를 적용합니다. Head는 같은 대칭 penalty 규칙이 아니므로 “놓친 reward = 동일한 penalty”로 단순화하면 안 됩니다.</p></div>
      <ExplainedFormula
        question="Validator i의 한 participation flag reward는 어떤 세 요인의 곱일까요?"
        idea={<>개인 effective balance가 만드는 base reward에 flag 중요도와 그 flag에 참여한 전체 active balance 비율을 곱합니다. Spec은 overflow를 피하기 위해 increment와 integer division으로 계산합니다.</>}
        formula={String.raw`r_{i,f}=b_i\,\frac{w_f}{W}\,\frac{A_f}{A}`}
        terms={[
          { symbol: "b_i", name: "base reward", description: "Validator i의 effective-balance increments와 전체 active balance 제곱근에서 계산한 기준 Gwei입니다." },
          { symbol: "w_f/W", name: "flag weight share", description: "Fork가 정한 participation flag weight를 denominator로 나눈 무차원 비율입니다." },
          { symbol: "A_f/A", name: "participation share", description: "해당 flag의 unslashed participating effective balance를 전체 active balance로 나눈 비율입니다." },
        ]}
        assumptions={["실제 spec은 uint64 integer division 순서로 계산하므로 이 실수식은 아이디어를 보여 주는 등가 해석입니다.", "Inactivity leak, proposer·sync committee reward와 fork별 constant는 별도 rule입니다."]}
        interpretation="b=100, flag weight share=1/4, participation share=3/4인 toy example은 18.75 Gwei지만 실제 integer result와 mainnet 값은 spec의 increment·rounding을 따라야 합니다. 이 값을 고정 APR로 읽으면 안 됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Inactivity leak은 finality 회복을 위한 별도 feedback입니다</h3>
        <p>Finality가 지연되면 timely target에 참여하지 않은 validator의 inactivity score가 올라가고 추가 penalty가 커집니다. 참여한 validator는 score가 회복되며, 비참여 weight가 줄어 남은 참여 weight가 다시 threshold를 만들 수 있게 합니다. 특정 validator를 즉시 퇴출하는 timer가 아니라 network state·score·balance가 연결된 feedback입니다.</p>
        <h3>Precompute는 값의 소유권을 바꾸지 않습니다</h3>
        <p>Active balance와 flag별 participating set을 한 번 집계해 validator loop에서 재사용하면 반복 scan을 줄일 수 있습니다. 하지만 cache key에 epoch·fork·state root·flag를 빠뜨리면 빠르지만 다른 state의 reward를 적용합니다. Full reference transition과 per-validator delta parity를 correctness oracle로 둡니다.</p>
      </div>
    </section>
  );
}

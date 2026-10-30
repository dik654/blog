import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function VoteHandling({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="vote-handling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Vote power가 문턱을 넘는 순간 다음 state 함수가 호출됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
      <p>
        B의 prevote가 마지막으로 추가돼 B41의 power가 75가 되는 순간 <code>addVote</code>는 단순 count를 반환하지 않습니다.
        현재 round이고 proposal이 완성됐다면 <code>enterPrecommit</code>을 호출합니다. 미래 round에서 +2/3-any를 먼저 봤다면
        해당 round로 건너뛰어 뒤처진 node가 따라잡게 합니다.
      </p>
      <p>
        Precommit에서도 A와 B의 B41 power가 75가 되면 <code>enterCommit</code>을 호출합니다. Commit certificate가 있어도 B41의
        block bytes를 아직 가지고 있지 않다면 즉시 실행하지 않고 expected PartSet을 설정해 먼저 block을 받습니다. 결정 증거와 실행할 data를
        모두 가져야 <code>tryFinalizeCommit</code>이 다음 높이로 진행할 수 있습니다.
      </p>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="addVote() transition" onClick={() => onCodeRef("add-vote", codeRefs["add-vote"])} />
        <CodeViewButton label="enterCommit()" onClick={() => onCodeRef("enter-commit", codeRefs["enter-commit"])} />
      </div>
      <h3>Count보다 power와 BlockID를 함께 봐야 합니다</h3>
      <p>
        A와 B 두 명만 서명했지만 power는 75라서 문턱을 넘습니다. 반대로 validator 수가 많아도 같은 BlockID에 모인 power가 2/3를 넘지
        못하면 Commit이 아닙니다. Nil, absent, 다른 round, 다른 BlockID를 한 합계에 넣지 않는 이유도 여기에 있습니다.
      </p>
      </div>
    </section>
  );
}

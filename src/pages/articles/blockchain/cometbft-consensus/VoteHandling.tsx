import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function VoteHandling({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="prose prose-neutral mb-16 max-w-none dark:prose-invert">
      <h3>Vote handler는 signature보다 앞뒤 context를 더 많이 확인합니다</h3>
      <p>
        유효한 signature라도 다른 chain·height·round·phase의 vote이면 현재 threshold에 더할 수 없습니다. Handler는
        validator index와 address가 historical set에서 일치하는지, 같은 validator slot이 이미 채워졌는지, BlockID가
        known proposal/part set과 연결되는지 확인합니다. 같은 좌표의 conflicting BlockID 두 개는 하나를 덮어쓰지 않고
        equivocation evidence 후보로 보존해야 합니다.
      </p>
      <p>
        VoteSet에 추가됐다는 사실과 state transition도 분리합니다. 예를 들어 +2/3 prevote는 precommit 조건을 만들고 +2/3 precommit은
        commit 조건을 만듭니다. 다만 현재 node가 block parts를 아직 받지 못했다면 필요한 data를 먼저 복구해야 합니다. 따라서 metric에는 vote count뿐
        아니라 voting power, block availability, validation failure, transition latency를 함께 둡니다.
      </p>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="addVote()" onClick={() => onCodeRef("add-vote", codeRefs["add-vote"])} />
      </div>
    </div>
  );
}

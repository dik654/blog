import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Byzantine({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="byzantine" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">상충 vote는 Commit을 덮어쓰지 않고 Evidence 경로로 분리합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          A가 h41/r1/precommit에서 B41과 다른 BlockID에 모두 서명했다면 <code>addVote</code>는
          <code>ErrVoteConflictingVotes</code>를 돌려줍니다. <code>tryAddVote</code>는 두 signed vote를 evidence pool로 보내고 기존
          VoteSet 항목을 다른 값으로 교체하지 않습니다. Evidence의 두 signature와 historical validator set을 다시 검증하는 구조는
          <Link to="/cs/blockchain/cometbft-types#evidence"> CometBFT 데이터 구조</Link>에서 이어집니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="tryAddVote()" onClick={() => onCodeRef("try-add-vote", codeRefs["try-add-vote"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>다른 round의 vote가 다르다는 사실만으로 이중 서명은 아닙니다</h3>
        <p>
          Validator는 더 높은 round에서 적법한 POL을 보고 lock을 바꿀 수 있습니다. Duplicate vote의 좌표에는 height뿐 아니라 round와 type도
          들어갑니다. 반대로 signature가 유효해도 다른 ChainID의 canonical bytes에 대한 서명이면 이 chain의 evidence가 아닙니다.
        </p>
        <h3>Consensus가 증거를 발견하는 일과 application이 처벌하는 일도 분리됩니다</h3>
        <p>
          Consensus node는 상충 서명을 보존하고 gossip과 block inclusion 경로로 넘깁니다. 실제 slashing이나 jailing 정책은
          <code>FinalizeBlock</code>에서 misbehavior를 받은 application이 정합니다. 따라서 evidence 탐지 수와 처벌 결과를 같은 metric으로 보면
          어느 단계에서 누락됐는지 알 수 없습니다.
        </p>
      </div>
    </section>
  );
}

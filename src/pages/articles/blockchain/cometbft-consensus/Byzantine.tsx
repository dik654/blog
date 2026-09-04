import { EvidenceLedgerViz } from "../cometbft-core-viz";
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
      <h2 className="mb-6 text-2xl font-bold">Consensus가 탐지한 equivocation과 application의 처벌은 같은 동작이 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Duplicate vote는 같은 validator가 같은 height·round·type에서 서로 다른 BlockID에 서명한 객관적 conflict입니다. Consensus
          node는 두 signed object를 보존하고 historical validator set과 signature를 검증해 evidence pool에 넣습니다. 이후
          gossip·block inclusion·FinalizeBlock misbehavior 전달을 거쳐야 application이 penalty 정책을 적용합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="tryAddVote()" onClick={() => onCodeRef("try-add-vote", codeRefs["try-add-vote"])} />
      </div>
      <EvidenceLedgerViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>놓치면 안 되는 반례</h3>
        <p>
          같은 validator가 round 2와 round 3에 다른 block을 vote한 것만으로 duplicate vote는 아닙니다. Lock-change rule에 맞는
          higher-round evidence가 있을 수 있기 때문입니다. 반대로 signature가 유효해도 다른 ChainID라면 이 chain의 evidence가 아닙니다.
          Evidence age나 이미 포함된 hash를 확인하지 않으면 stale·duplicate submission으로 resource를 소모합니다.
        </p>
        <h3>Release gate는 공격뿐 아니라 복구도 포함합니다</h3>
        <p>
          Equivocating proposer, duplicate prevote/precommit, vote omission, delayed parts, stale timeout,
          crash와 WAL replay를 같은 seed로 주입합니다. 같은 height의 conflicting committed block은 0건이어야 하고 honest node의
          evidence identity·committed height·AppHash가 수렴해야 합니다. Detection count만 높고 progress가 멈추는 candidate도
          채택할 수 없습니다.
        </p>
      </div>
    </section>
  );
}

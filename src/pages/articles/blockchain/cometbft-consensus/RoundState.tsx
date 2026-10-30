import { Link } from "react-router-dom";

import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function RoundState({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="round-state" className="mb-10 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Round 0의 nil과 round 1의 B41은 같은 VoteSet에 섞이지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Round 0에서 A의 proposal을 받지 못한 validator는 nil에 prevote합니다. A와 B의 nil prevote가 75/100이 되어도
          B41 같은 block을 lock하지는 않습니다. 이어 nil precommit이 75가 되고 timeout이 발생하면
          <code>enterNewRound(41, 1)</code>이 proposer priority를 전진시키고 proposal 관련 상태를 비웁니다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton label="enterNewRound()" onClick={() => onCodeRef("enter-new-round", codeRefs["enter-new-round"])} />
          <CodeViewButton label="defaultDoPrevote()" onClick={() => onCodeRef("enter-prevote", codeRefs["enter-prevote"])} />
        </div>
        <h3>Round 1에서 B41을 받아도 먼저 검증한 뒤 prevote합니다</h3>
        <p>
          B가 B41을 제안하면 consensus의 <code>ValidateBlock</code>과 application의 <code>ProcessProposal</code>을 모두 통과해야
          B41에 prevote합니다. Proposal이 없거나 어느 검증에서든 거부되면 nil에 prevote합니다. 이미 다른 block을 lock한 node라면 새 proposal보다
          LockedBlock을 우선합니다.
        </p>
        <h3>+2/3 prevote가 생긴 BlockID에 따라 lock 동작이 달라집니다</h3>
        <p>
          Majority가 없으면 nil에 precommit합니다. +2/3 nil이면 기존 lock을 해제하고 nil에 precommit합니다. +2/3가 현재 B41을 가리키면
          LockedRound와 LockedBlock과 BlockParts를 함께 저장하고 B41에 precommit합니다. 단순히 round 번호가 커졌다는 이유만으로 lock을 버리지
          않는 이유는 <Link to="/cs/blockchain/bft-theory#safety-liveness">BFT lock과 view change</Link>에서 이어서 설명합니다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton label="enterPrecommit()" onClick={() => onCodeRef("enter-precommit", codeRefs["enter-precommit"])} />
        </div>
      </div>
    </section>
  );
}

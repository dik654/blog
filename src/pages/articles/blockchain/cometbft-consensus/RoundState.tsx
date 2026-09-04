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
      <h2 className="mb-6 text-2xl font-bold">Prevote는 후보를 관찰한 증거이고 Precommit은 lock을 갱신한 증거다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Propose에서 validator는 proposal과 block parts를 받아 basic·application validity를 확인합니다. Prevote에서는 현재
          lock과 proposal의 valid-round evidence를 고려해 block 또는 nil에 서명합니다. 같은 round에 특정 block의 prevote power가
          +2/3이면 proof-of-lock-change(PoLC)가 생기고 validator는 lock을 갱신해 그 block에 precommit합니다. 같은 block의
          precommit power가 +2/3이면 commit으로 이동합니다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton label="enterNewRound()" onClick={() => onCodeRef("enter-new-round", codeRefs["enter-new-round"])} />
          <CodeViewButton label="enterPropose()" onClick={() => onCodeRef("enter-propose", codeRefs["enter-propose"])} />
        </div>
        <h3>Nil vote는 error가 아니라 안전한 progress 신호일 수 있습니다</h3>
        <p>
          Proposal을 받지 못했거나 invalid하거나 현재 lock과 호환되는 evidence가 없으면 validator는 nil에 prevote합니다. +2/3 nil
          prevote는 그 round에서 block lock을 만들 수 없다는 신호고 nil precommit은 다음 round로 넘어가게 합니다. Nil과 absent를 섞으면
          network loss와 protocol decision을 구분하지 못합니다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton label="defaultDoPrevote()" onClick={() => onCodeRef("enter-prevote", codeRefs["enter-prevote"])} />
        </div>
        <h3>Lock을 해제하는 근거도 signed evidence여야 합니다</h3>
        <p>
          더 높은 round proposer는 자신이 아는 valid/POL round를 proposal에 포함합니다. Locked validator는 단순히 round가
          커졌다는 이유로 lock을 지우지 않고, 더 높은 round의 sufficient prevote evidence가 기존 lock과 호환될 때만
          transition합니다. 이 규칙이 왜 conflicting quorum을 막는지는 <Link to="/blockchain/bft-theory#safety-liveness">BFT lock·view-change</Link>에서
          일반화해 설명합니다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-3">
          <CodeViewButton label="enterPrecommit()" onClick={() => onCodeRef("enter-precommit", codeRefs["enter-precommit"])} />
          <CodeViewButton label="enterCommit()" onClick={() => onCodeRef("enter-commit", codeRefs["enter-commit"])} />
        </div>
      </div>
    </section>
  );
}

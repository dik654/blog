import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz from "../cometbft-core-viz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function VoteCommit({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="vote-commit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Vote는 좌표가 붙은 서명이고 Commit은 같은 좌표의 power certificate다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Prevote와 Precommit은 “찬성”이라는 한 bit가 아닙니다. Type·height·round·BlockID와 validator identity를
          가진 signed message이며 BlockID는 특정 block 또는 <code>nil</code>을 가리킵니다. CanonicalVote는 network
          object를 그대로 서명하지 않고 ChainID까지 포함한 안정된 sign bytes를 만듭니다. 이 domain binding이
          없으면 다른 chain이나 phase의 서명을 재사용하는 위험이 생깁니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="Vote struct" onClick={() => onCodeRef("vote-struct", codeRefs["vote-struct"])} />
        <CodeViewButton label="VoteSet struct" onClick={() => onCodeRef("voteset-struct", codeRefs["voteset-struct"])} />
      </div>
      <CometBFTCoreViz mode="votes" />
      <ExplainedFormula
        question="어느 precommit 집합이 특정 block의 Commit이 될까요?"
        idea={<>유효한 서명을 validator별 한 번만 세고, 같은 height·round·BlockID를 가리키는 voting power만 합합니다. 개수가 아니라 당시 validator snapshot의 weight가 기준입니다.</>}
        formula={String.raw`\begin{aligned}W&=\sum_{i\in V_h}w_i,\\ W_B&=\sum_{i\in S_B}w_i>\frac{2}{3}W\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}W&=\underbrace{\sum_{i\in V_h}w_i,}_{\text{Historical validator set 계산}}\\ W_B&=\underbrace{\sum_{i\in S_B}w_i>\frac{2}{3}W}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{i\in V_h}w_i,`, annotation: ["Historical validator set이(가) 식의","결과에 기여하는 방식을 계산합니다.","유효한 서명을 validator별 한 번만 세고, 같은","height·round·BlockID를 가리키는 voting"] },
          { expression: String.raw`\sum_{i\in S_B}w_i>\frac{2}{3}W`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","유효한 서명을 validator별 한 번만 세고, 같은","height·round·BlockID를 가리키는 voting","power만 합합니다."] },
        ]}
        terms={[
          { symbol: "V_h", name: "Historical validator set", description: "Height h에서 유효한 validator set snapshot입니다." },
          { symbol: "S_B", name: "Block signer set", description: "같은 block B에 유효한 precommit을 낸 validator 집합입니다." },
          { symbol: "w_i", name: "Voting power", description: "Validator i의 당시 voting power입니다." },
          { symbol: "W_B, W", name: "Signed / total power", description: "Block B에 모인 power와 전체 power입니다." },
        ]}
        assumptions={["각 signature·validator index·height·round·type·BlockID를 먼저 검증합니다.", "한 validator의 중복 vote는 한 번만 집계하고 conflicting vote는 evidence 후보로 분리합니다.", "Safety의 honest-intersection 결론은 Byzantine power가 1/3 미만이라는 BFT 전제와 함께 읽습니다."]}
        interpretation="Power 100 중 같은 block precommit이 67이면 2/3보다 크므로 threshold를 넘습니다. 66은 넘지 못하고, nil이나 absent signature를 block power에 더할 수 없습니다."
      />
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="AddVote() → addVote()" onClick={() => onCodeRef("addvote", codeRefs["addvote"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Absent·nil·commit을 구분합니다</h3>
        <p>
          CommitSig의 absent는 vote를 받지 못했다는 뜻이고, nil은 validator가 명시적으로 nil BlockID에 투표했다는
          뜻이며, commit flag는 majority block에 투표한 signature입니다. 이 셋을 모두 “반대표”로 합치면 participation과
          protocol intent를 잃습니다. Vote extension도 non-nil precommit에 붙는 별도 application bytes이므로 base vote
          signature와 extension signature의 검증 결과를 따로 기록합니다.
        </p>
        <p>
          왜 두 quorum이 honest validator에서 겹치는지는 <Link to="/blockchain/bft-theory#faulty-threshold">BFT의
          3f+1·2f+1 정본</Link>에서 증명합니다. 여기서는 그 수학을 반복하지 않고, 실제 certificate 검증에 어떤
          coordinates·snapshot·signature가 필요한지를 소유합니다.
        </p>
      </div>
    </section>
  );
}

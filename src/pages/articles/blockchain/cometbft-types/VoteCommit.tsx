import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
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
      <h2 className="mb-6 text-2xl font-bold">A와 B의 같은 precommit이 75/100 Commit을 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          A가 서명하는 대상은 단순한 “찬성”이 아닙니다. <code>demo-1 · height 41 · round 0 · PRECOMMIT · HB41</code>이라는
          좌표를 canonical bytes로 만든 것입니다. B도 같은 좌표와 BlockID에 서명해야 두 power를 한 묶음으로 더할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="실제 Vote · canonical sign bytes" onClick={() => onCodeRef("vote-sign-bytes", codeRefs["vote-sign-bytes"])} />
      </div>
      <ExplainedFormula
        question="어느 precommit 집합이 특정 block의 Commit이 될까요?"
        idea={<>유효한 서명을 validator별 한 번만 세고, 같은 height·round·BlockID를 가리키는 voting power만 합합니다. 개수가 아니라 당시 validator snapshot의 weight가 기준입니다.</>}
        formula={String.raw`\begin{aligned}W&=\sum_{i\in V_h}w_i,\\ W_B&=\sum_{i\in S_B}w_i>\frac{2}{3}W\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}W&=\underbrace{\sum_{i\in V_h}w_i}_{\text{height h 전체 power}},\\ W_B&=\underbrace{\sum_{i\in S_B}w_i}_{\text{같은 BlockID power}}>\underbrace{\frac{2}{3}W}_{\text{Commit 문턱}}\end{aligned}`}
        operations={[
          { expression: String.raw`40+35+25=100`, annotation: ["높이 41의 historical ValidatorSet", "A·B·C의 전체 voting power", "현재 set이 아니라 당시 snapshot"] },
          { expression: String.raw`40+35=75`, annotation: ["A와 B가 같은 HB41에 precommit", "C의 absent는 0으로 처리", "validator별 한 번만 계산"] },
          { expression: String.raw`75>\frac{2}{3}\times100`, annotation: ["2/3은 약 66.67", "75가 이를 넘으므로 Commit 성립", "66이면 미달"] },
        ]}
        terms={[
          { symbol: "V_h", name: "Historical validator set", description: "Height h에서 유효한 validator set snapshot입니다." },
          { symbol: "S_B", name: "Block signer set", description: "같은 block B에 유효한 precommit을 낸 validator 집합입니다." },
          { symbol: "w_i", name: "Voting power", description: "Validator i의 당시 voting power입니다." },
          { symbol: "W_B, W", name: "Signed / total power", description: "Block B에 모인 power와 전체 power입니다." },
        ]}
        assumptions={["각 signature·validator index·height·round·type·BlockID를 먼저 검증합니다.", "한 validator의 중복 vote는 한 번만 집계하고 conflicting vote는 evidence 후보로 분리합니다.", "Safety의 honest-intersection 결론은 Byzantine power가 1/3 미만이라는 BFT 전제와 함께 읽습니다."]}
        interpretation="A 40과 B 35가 같은 HB41에 유효한 precommit을 내면 75/100입니다. C가 absent여도 75는 2/3보다 크므로 Commit이 성립합니다. Nil·absent·다른 round의 vote는 HB41의 power에 더하지 않습니다."
      />
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="실제 VerifyCommit()" onClick={() => onCodeRef("verify-commit", codeRefs["verify-commit"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Absent·nil·commit을 구분합니다</h3>
        <p>
          CommitSig의 absent는 vote를 받지 못했다는 뜻입니다. nil은 validator가 명시적으로 nil BlockID에 투표했다는 뜻이고,
          commit flag는 majority block에 투표한 signature입니다. 이 셋을 모두 “반대표”로 합치면 participation과 protocol intent를 잃습니다.
        </p>
        <p>
          Vote extension은 non-nil precommit에 붙는 별도 application bytes입니다. 따라서 base vote signature와 extension signature의
          검증 결과를 따로 기록합니다.
        </p>
        <p>
          왜 두 quorum이 honest validator에서 겹치는지는 <Link to="/cs/blockchain/bft-theory#faulty-threshold">BFT의
          3f+1·2f+1 정본</Link>에서 증명합니다. 여기서는 그 수학을 반복하지 않고, 실제 certificate 검증에 어떤
          coordinates·snapshot·signature가 필요한지를 소유합니다.
        </p>
      </div>
    </section>
  );
}

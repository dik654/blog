import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function GetHead({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="get-head" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">GetHead는 eligible tree를 만든 뒤 가장 무거운 자식을 반복 선택한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("get-head", codeRefs["get-head"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 head traversal 확인</span>
      </div>

      <ExplainedFormula
        question="한 node의 child 가운데 다음에 내려갈 branch를 어떤 score로 정할까요?"
        idea="각 eligible child의 subtree를 지지하는 active·unslashed validator 최신 balance를 합하고, 조건을 만족한 현재 slot의 proposer boost가 그 subtree에 있으면 임시 score를 더합니다."
        formula={String.raw`\begin{aligned}W(n)&=\sum_{i\in A\setminus E}b_i\,\mathbf{1}[n\preceq r_i]\\&\qquad+B\,\mathbf{1}[n\preceq r_{boost}]\end{aligned}`}
        terms={[
          { symbol: "A", name: "활성 검증자 집합", description: "기준 checkpoint state의 active validator 집합" },
          { symbol: "E", name: "이중 투표 검증자 집합", description: "확인된 equivocating validator 집합" },
          { symbol: "b_i", name: "검증자 잔액", description: "validator i의 effective balance(Gwei)" },
          { symbol: "r_i", name: "최신 투표 루트", description: "validator i의 최신 message가 지지하는 root" },
          { symbol: "B", name: "제안자 부스트", description: "현재 slot에만 적용되는 proposer-boost score(Gwei)" },
        ]}
        assumptions={[
          "후보 node는 justified·finalized checkpoint와 양립하는 filtered tree에 포함됩니다.",
          "모든 node가 같은 store time, balance snapshot, latest messages와 equivocation evidence를 봅니다.",
          "동률은 규격이 정한 deterministic root ordering으로 해결합니다.",
        ]}
        interpretation="A=64, B=48이고 A 아래 A1=24, A2=40이면 J에서 A, 이어 A2를 고릅니다. Boost 20이 B subtree에 임시 적용되면 첫 선택은 B=68이 될 수 있지만 다음 slot에 boost가 사라지면 같은 결론을 보장하지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Eligibility가 weight보다 먼저입니다</h3>
        <p>
          GetHead는 finalized checkpoint의 descendant가 아니거나 voting source가 현재 justified checkpoint와 양립하지 않는
          leaf를 먼저 제거합니다. 그 뒤 justified root에서 시작해 child score를 비교합니다. 따라서 100 ETH가 지지하는
          conflicting branch와 60 ETH가 지지하는 eligible branch가 있어도 100 ETH branch를 선택하지 않습니다.
        </p>

        <h3>Reorg와 prune은 같은 동작이 아닙니다</h3>
        <p>
          Head reorg는 아직 retained tree 안에서 canonical head가 다른 branch로 이동하는 일입니다. Prune은 finalized boundary
          이전 또는 양립하지 않는 node와 cache를 더 이상 fork-choice 후보로 유지하지 않는 저장 수명 관리입니다. Reorg가
          일어날 때마다 곧바로 과거를 삭제하면 late attestation 검증과 recovery에 필요한 evidence를 잃을 수 있습니다.
        </p>
        <p>
          Release 비교에서는 full recomputation oracle과 optimized store가 같은 head를 내는지 먼저 봅니다. Equal-weight tie,
          delayed attestation, validator vote 이동, equivocation, proposer boost expiry, checkpoint update, execution INVALID와 restart를
          같은 event order로 재생해 event별 head·weight·eligible set parity를 검사한 뒤 처리량과 memory를 비교합니다.
        </p>

        <h3>읽으면 안 되는 과도한 결론</h3>
        <p>
          LMD-GHOST가 Byzantine network에서 어떤 조건 없이 최종성을 보장하는 것은 아닙니다. Head 선택은 Casper FFG finality와
          validator slashing assumptions, message timing에 결합됩니다. 또한 optimized 자료구조의 benchmark는 특정 tree shape와
          attestation churn에 좌우되므로 하나의 O 표기나 평균 latency를 production 전체로 확대하지 않습니다.
        </p>
      </div>
    </section>
  );
}

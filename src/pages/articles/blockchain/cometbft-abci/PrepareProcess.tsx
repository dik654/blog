import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function PrepareProcess({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="prepare-process" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Prepare는 후보를 만들고 Process는 같은 후보를 판정합니다</h2>
      <div className="not-prose mb-6 grid gap-px bg-border p-px sm:grid-cols-2" aria-label="PrepareProposal과 ProcessProposal의 입력과 출력 비교">
        <div className="bg-background p-4">
          <span className="text-[9px] font-black text-primary">PROPOSER · PREPARE</span>
          <p className="mt-2 break-keep text-sm font-bold leading-6">raw [T지급, T만료, T스테이킹]</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">필터·추가·재배열 가능 → [T스테이킹, T지급]</p>
          <p className="mt-3 border-t border-border pt-3 text-xs font-bold">출력: B41에 넣을 transaction bytes</p>
        </div>
        <div className="bg-background p-4">
          <span className="text-[9px] font-black text-primary">ALL VALIDATORS · PROCESS</span>
          <p className="mt-2 break-keep text-sm font-bold leading-6">같은 S40 + 같은 B41</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">node-local clock·randomness·remote API 제외</p>
          <p className="mt-3 border-t border-border pt-3 text-xs font-bold">출력: 모두 같은 ACCEPT 또는 REJECT</p>
        </div>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proposer application은 raw proposal에서 T만료를 빼고 T스테이킹을 앞으로 옮기거나 새로운 transaction을 추가할 수 있습니다.
          이 선택은 node-local policy를 사용할 수 있어 결정적일 필요가 없습니다. 다만 반환한 transaction bytes의 합은
          <code>max_tx_bytes</code>를 넘으면 안 됩니다.
        </p>
        <p>
          반대로 validator들이 같은 B41과 S40을 검사하는 ProcessProposal은 ACCEPT와 REJECT가 갈리지 않도록 결정적이어야 합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="CreateProposalBlock"
          onClick={() => onCodeRef("create-proposal-block", codeRefs["create-proposal-block"])}
        />
      </div>
      <ExplainedFormula
        question="Correct validator 둘이 같은 proposal을 받았을 때 왜 같은 판정을 내야 할까요?"
        idea={<>판정 함수의 입력을 committed state, proposal bytes, protocol context로 닫고 local clock·randomness·remote API처럼 node마다 달라지는 값을 제거합니다.</>}
        formula={String.raw`d=G(S_h,B,C_h)`}
        annotatedFormula={String.raw`\underbrace{d}_{\text{ACCEPT 또는 REJECT}}=G(\underbrace{S_h}_{\text{committed state}},\underbrace{B}_{\text{같은 proposal bytes}},\underbrace{C_h}_{\text{height·time 등 context}})`}
        operations={[
          { expression: String.raw`G(S_h,B,C_h)`, annotation: ["모든 node가 공유하는 세 입력만으로","ProcessProposal 판정을 계산합니다","local clock·remote API는 입력에서 제외"] },
        ]}
        terms={[
          { symbol: "S_h", name: "Committed state", description: "Height h 직전의 committed application state입니다." },
          { symbol: "B", name: "Proposal", description: "검사하는 동일 proposal block bytes입니다." },
          { symbol: "C_h", name: "Protocol context", description: "Request가 제공한 height·time·last commit·proposer 등 context입니다." },
          { symbol: "G", name: "Validation function", description: "ProcessProposal의 deterministic validation function입니다." },
        ]}
        assumptions={["Correct node가 같은 application binary·configuration과 동일한 committed input을 사용합니다.", "Local clock·unordered iteration·remote service response처럼 합의 입력 밖의 값을 판정에 사용하지 않습니다.", "ACCEPT는 block commit이나 transaction success가 아니라 prevote 가능한 candidate라는 뜻입니다."]}
        interpretation="같은 S_h·B·C_h에는 같은 d가 나와야 합니다. 일부 node만 REJECT하면 safety보다 먼저 liveness가 무너져 quorum을 만들지 못할 수 있습니다."
      />
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="ProcessProposal"
          onClick={() => onCodeRef("process-proposal", codeRefs["process-proposal"])}
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>정상 proposer가 만든 B41은 정상 validator가 받아들여야 합니다</h3>
        <p>
          공식 요구사항은 correct proposer가 준비한 proposal을 correct receiver가 ProcessProposal에서 ACCEPT하도록 요구합니다. 같은 버그를
          많은 validator가 공유하면 모두 nil에 prevote해 liveness가 깨질 수 있기 때문입니다.
        </p>
        <p>
          Proposer 자신도 ProcessProposal을 호출할 수 있지만, failure 상황에서는 이전 Prepare 결과가 도착하거나 Process가 호출되지 않을 수도
          있습니다. 따라서 “Prepare 직후 Process가 정확히 한 번 온다”는 순서에 correctness를 의존하면 안 됩니다.
        </p>
        <h3>Candidate state는 block hash로 격리한 cache입니다</h3>
        <p>
          Prepare나 Process에서 B41을 미리 실행하면 FinalizeBlock을 빠르게 끝낼 수 있습니다. 그러나 한 height에서 여러 round와 proposal이 생길 수
          있으므로 각 candidate를 block hash로 격리하고 메모리 상한을 둬야 합니다.
        </p>
        <p>
          결정된 block과 같은 candidate만 FinalizeBlock에서 ExecuteTxState로 승격하며, 이미 버렸다면 다시 실행합니다. Candidate path는
          durable S40을 덮어쓰거나 외부 side effect를 실행하면 안 됩니다.
        </p>
        <h3>REJECT는 단순한 validation 오류가 아니라 합의 입력입니다</h3>
        <p>
          Validator가 REJECT를 반환하면 CometBFT는 그 proposal 대신 nil에 prevote합니다. 일부 node만 다른 값을 반환하면 quorum 형성이 늦어지거나
          멈출 수 있습니다. 판정 함수에서 wall clock, 순서가 고정되지 않은 iteration, node별 configuration, remote service 응답을 빼야 하는 이유입니다.
        </p>
      </div>
    </section>
  );
}

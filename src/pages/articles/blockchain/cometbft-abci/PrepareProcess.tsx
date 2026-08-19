import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz from "../cometbft-core-viz";
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
      <h2 className="mb-6 text-2xl font-bold">PrepareProposal은 선택하고 ProcessProposal은 모든 correct node가 같은 후보를 판정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proposer application은 mempool candidate에서 transaction을 제거·재배치하거나 새 bytes를 넣을 수 있지만 응답의
          총 transaction bytes가 request의 <code>max_tx_bytes</code>를 넘지 않게 해야 합니다. 이 구성은 local state나
          policy에 따라 달라질 수 있어 deterministic일 필요가 없습니다. 반면 다른 validator가 같은 proposal bytes와
          같은 committed state를 검사하는 ProcessProposal은 ACCEPT/REJECT가 갈리지 않도록 deterministic해야 합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="CreateProposalBlock"
          onClick={() => onCodeRef("create-proposal-block", codeRefs["create-proposal-block"])}
        />
        <CodeViewButton
          label="proxy · PrepareProposal"
          onClick={() => onCodeRef("proxy-prepare", codeRefs["proxy-prepare"])}
        />
        <CodeViewButton
          label="localClient · PrepareProposal"
          onClick={() => onCodeRef("local-prepare", codeRefs["local-prepare"])}
        />
      </div>
      <CometBFTCoreViz mode="abci" />
      <ExplainedFormula
        question="Correct validator 둘이 같은 proposal을 받았을 때 왜 같은 판정을 내야 할까요?"
        idea={<>판정 함수의 입력을 committed state, proposal bytes, protocol context로 닫고 local clock·randomness·remote API처럼 node마다 달라지는 값을 제거합니다.</>}
        formula={String.raw`d=G(S_h,B,C_h)`}
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
        <CodeViewButton
          label="proxy · ProcessProposal"
          onClick={() => onCodeRef("proxy-process", codeRefs["proxy-process"])}
        />
        <CodeViewButton
          label="localClient · ProcessProposal"
          onClick={() => onCodeRef("local-process", codeRefs["local-process"])}
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Coherence는 proposer 자신도 검사 대상이라는 뜻입니다</h3>
        <p>
          정상 proposer가 PrepareProposal로 만든 candidate는 correct validator의 ProcessProposal에서 ACCEPT돼야 progress할
          수 있습니다. Proposer에서도 ProcessProposal이 호출될 수 있고 failure 상황에서는 이전 invocation의 candidate가
          도착하거나 호출되지 않을 수 있으므로, “Prepare 직후 Process가 정확히 한 번 이어진다”는 local call sequence에
          state correctness를 의존하면 안 됩니다.
        </p>
        <h3>Candidate execution은 cache이지 commit이 아닙니다</h3>
        <p>
          Prepare/Process에서 block을 미리 실행해 FinalizeBlock을 빠르게 만들 수 있지만 각 candidate state는 block hash로
          격리합니다. 여러 round candidate를 덮어쓰지 않고, decided block과 일치하는 결과만 FinalizeBlock에서 승격하며
          나머지는 안전하게 폐기합니다. External side effect는 candidate path에서 실행하지 않습니다.
        </p>
      </div>
    </section>
  );
}

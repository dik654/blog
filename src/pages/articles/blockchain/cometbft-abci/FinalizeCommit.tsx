import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz from "../cometbft-core-viz";
export default function FinalizeCommit() {
  return (
    <section id="finalize-commit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">FinalizeBlock은 결정된 state를 계산하고 Commit은 그 state를 durable하게 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Consensus가 decided block을 넘기면 application은 transaction을 deterministic하게 실행하고 transaction results,
          validator·consensus parameter updates, AppHash를 반환합니다. 이 결과는 CometBFT가 저장하지만 application state의
          영속화는 아직 끝나지 않았습니다. 뒤따르는 Commit이 반환돼야 application이 그 height를 durable하게 저장했다고
          판단할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="모든 correct node가 같은 다음 state와 AppHash를 만들기 위한 최소 식은 무엇일까요?"
        idea={<>결정된 block과 이전 committed state만 deterministic transition에 넣고, 결과 state의 commitment를 계산합니다. Node-local 입력과 external effect는 함수 밖으로 분리합니다.</>}
        formula={String.raw`\begin{aligned}S_{h+1}&=F(S_h,B_h),\\ A_{h+1}&=C(S_{h+1})\end{aligned}`}
        terms={[
          { symbol: "S_h", name: "Previous state", description: "FinalizeBlock 전에 durable하게 commit된 application state입니다." },
          { symbol: "B_h", name: "Decided block", description: "Consensus가 height h에서 결정한 block과 protocol context입니다." },
          { symbol: "F", name: "State transition", description: "Application의 deterministic state-transition function입니다." },
          { symbol: "A_{h+1}", name: "AppHash", description: "결과 state를 식별하며 다음 block header에 연결되는 commitment입니다." },
        ]}
        assumptions={["모든 correct node가 같은 ordered input과 application version/configuration을 사용합니다.", "Map iteration·floating behavior·clock·randomness·remote API처럼 결과가 갈리는 입력을 제거하거나 consensus input에 포함합니다.", "Commitment collision resistance를 가정하며 AppHash가 비어 있거나 application-specific일 수 있는 protocol 범위를 따릅니다."]}
        interpretation="같은 S_h와 B_h인데 A가 다르면 consensus order는 같아도 replicated application state가 갈라진 것입니다. AppHash 일치는 external notification이 exactly once 실행됐다는 뜻은 아닙니다."
      />
      <CometBFTCoreViz mode="recovery" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>AppHash의 한-height 연결을 확인합니다</h3>
        <p>
          FinalizeBlock이 반환한 AppHash는 다음 block header의 AppHash로 들어갑니다. 따라서 장애 로그는 decided block
          height, FinalizeBlock result AppHash, application committed height, 다음 header의 AppHash를 분리해 남겨야 합니다.
          같은 이름만 보고 현재 block payload의 hash나 CometBFT 자체 database root로 해석하면 안 됩니다.
        </p>
        <h3>Crash point별 replay 결정을 표로 만듭니다</h3>
        <p>
          Block만 저장됐으면 FinalizeBlock 이후를 replay하고, CometBFT result/state가 저장됐지만 application Commit이
          끝나지 않았으면 FinalizeBlock 결과를 재현해 저장된 결과와 대조한 뒤 Commit합니다. Application이 더 높은 height를
          보고하면 blindly 진행하지 않고 handshake·recovery invariant를 실패시킵니다. Replay 가능한 transition과
          idempotent Commit이 필요하며 payment·webhook 같은 external effect는 state outbox에서 별도로 reconcile합니다.
        </p>
      </div>
      <div id="paper-cometbft-app-requirements-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · application requirements</p>
        <p className="mt-2 text-sm font-semibold">Requirements for the ABCI Application</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 proposal coherence·determinism·candidate state·connection ordering·crash recovery를 application 의무로 명시하는 것입니다. 규격은 올바른 integration 조건을 설명하지만 특정 database의 atomicity나 외부 시스템 side effect를 자동 보장하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/v0.40.0/spec/abci/abci%2B%2B_app_requirements.md" target="_blank" rel="noreferrer">v0.40.0 application requirements 보기</a>
      </div>
    </section>
  );
}

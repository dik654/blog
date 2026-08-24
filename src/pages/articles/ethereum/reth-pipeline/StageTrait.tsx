import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function StageTrait({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="stage-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Stage 계약은 bounded progress·checkpoint·unwind를 한 상태 기계로 묶는다
      </h2>
      <ExplainedFormula
        question="Checkpoint c에서 target t로 갈 때 limit L인 다음 batch는 어디까지일까요?"
        idea={
          <>
            이미 commit한 c 다음 block부터 시작하고, 한 번에 L개를 넘지 않도록
            target과 batch 상한 중 작은 높이에서 멈춥니다.
          </>
        }
        formula={"b_{\\rm start}=c+1,\\qquad b_{\\rm end}=\\min(c+L,t)"}
        annotatedFormula={String.raw`b_{\rm start}=\underbrace{c+1,\qquad b_{\rm end}=\min(c+L,t)}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`c+1,\qquad b_{\rm end}=\min(c+L,t)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","이미 commit한 c 다음 block부터 시작하고, 한 번에","L개를 넘지 않도록 target과 batch 상한 중 작은","높이에서 멈춥니다."] },
        ]}
        terms={[
          {
            symbol: "c",
            name: "Committed checkpoint",
            description:
              "이 stage가 durable하게 완료한 마지막 block number입니다.",
          },
          {
            symbol: "t",
            name: "Target",
            description: "이번 pipeline run이 도달하려는 block number입니다.",
          },
          {
            symbol: "L",
            name: "Batch limit",
            description: "한 transaction에서 시도할 최대 block 수입니다.",
          },
          {
            symbol: "b_{\\rm start},b_{\\rm end}",
            name: "Inclusive range",
            description: "다음 execute가 처리할 inclusive block 범위입니다.",
          },
        ]}
        assumptions={[
          "Checkpoint c의 output과 dependency가 durable하고 검증됐습니다.",
          "L은 운영 tuning 값이며 protocol 상수가 아닙니다.",
          "Missing input이나 resource limit으로 end 전에 멈추면 실제 committed end만 checkpoint로 씁니다.",
        ]}
        interpretation="c=99,t=250,L=64이면 첫 batch는 100…163입니다. 다음은 164…227, 마지막은 228…250이며 각 commit 뒤에만 checkpoint를 옮깁니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Crash receipt와 idempotent restart</h3>
        <p>
          Receipt에는 stage ID, input checkpoint, dependency checkpoint, target,
          attempted/committed range, output checkpoint, transaction ID와 phase를
          남깁니다. Commit 전 crash는 c에서 다시 시작하고 commit 후 marker 전
          crash는 DB output과 checkpoint를 reconcile한 뒤 동일 범위를 중복
          적용하지 않습니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Missing header/body, invalid sender, execution failure, root mismatch,
          stage 중간 crash, checkpoint corruption, reorg/unwind와 restart를
          base/candidate에 주입합니다. Header/body/sender/receipt/state-root와
          각 checkpoint parity를 통과한 뒤 blocks/s, commit latency, write
          amplification과 recovery time을 비교합니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() => onCodeRef("pipeline-run", codeRefs["pipeline-run"])}
        />
      </div>
    </section>
  );
}

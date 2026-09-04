import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RunContractViz } from "../llm-harness/viz/ModernHarnessViz";

export default function AgentRunContractArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="contract" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Run contract는 “무엇을 하면 끝인가”를 실행 전에 고정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            큰 지시 한 줄은 방향만 주고 완료를 관측할 수 없습니다.{" "}
            <strong>Agent run contract</strong>는
            objective·acceptance·context·capability·artifact·verifier·recovery를
            한 run identity에 묶습니다.
          </p>
        </div>
        <TermBreakdown
          title="한 줄씩 읽는 run contract"
          items={[
            {
              term: "Objective",
              description: "달성하려는 변화입니다.",
              example: "결제 화면의 mobile overflow를 없앱니다.",
            },
            {
              term: "Acceptance",
              description: "완료를 관측할 조건입니다.",
              example: "390/1440 width, test와 screenshot을 통과합니다.",
            },
            {
              term: "Context path",
              description: "현재 task가 읽을 정본의 발견 경로입니다.",
              example:
                "짧은 entry 문서에서 design rule과 route source로 이동합니다.",
            },
            {
              term: "Capability",
              description: "실제로 허용된 identity·resource·operation입니다.",
              example: "지정 workspace write만 허용합니다.",
            },
            {
              term: "Artifact",
              description: "Session 밖에 남는 versioned 상태입니다.",
              example: "Patch·commit·screenshot·test receipt입니다.",
            },
            {
              term: "Verifier & recovery",
              description: "판정과 실패 후 retry·rollback·escalation입니다.",
              example: "Build failure면 원인을 남기고 deploy하지 않습니다.",
            },
          ]}
        />
        <RunContractViz />
        <ContentBoundary article="agent-run-contract" />
      </section>
      <section id="context-capability" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Context는 발견 경로이고 capability는 실행 열쇠입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 문서를 prompt에 복제하지 않고 current task가 필요한 source로
            찾아갑니다. 문서를 읽었다는 사실은 그 resource를 바꿀 권한과
            별개입니다. Tool schema보다 좁은 runtime capability를 target
            identity와 함께 binding합니다.
          </p>
        </div>
      </section>
      <section id="artifact-continuity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          대화 대신 versioned artifact가 session을 건넙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Plan status, decision, changed file, checksum, verifier result와
            unfinished item을 artifact에 남깁니다. 새 session은 “완료했다”는
            요약을 믿는 대신 실제 artifact와 receipt를 다시 검증합니다.
          </p>
        </div>
        <ExplainedFormula
          question="필수 contract field가 하나라도 비면 run을 시작해도 되나요?"
          idea={
            <p>
              필수 항목의 존재 여부를 AND로 묶어 목표만 있고 verifier나 recovery가 없는 run을 admission 전에 막습니다.
            </p>
          }
          formula={String.raw`C=I_O\land I_A\land I_X\land I_P\land I_R`}
          annotatedFormula={String.raw`\begin{aligned}C&=\underbrace{I_O\land I_A}_{\text{목표와 완료 조건}}\\&\quad\land\underbrace{I_X\land I_P}_{\text{context와 권한}}\\&\quad\land\underbrace{I_R}_{\text{artifact·검증·복구 receipt}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I_O\land I_A`,
              annotation: ["방향과 관측 가능한 완료를", "둘 다 요구"],
            },
            {
              expression: String.raw`I_X\land I_P`,
              annotation: ["읽을 범위와 실행 권한을", "서로 분리해 요구"],
            },
            {
              expression: String.raw`\land I_R`,
              annotation: [
                "상태·검증·복구 receipt 없으면",
                "run admission 거절",
              ],
            },
          ]}
          terms={[
            {
              symbol: "C",
              name: "Contract admission",
              description: "필수 run contract가 완전하면 1입니다.",
            },
            {
              symbol: "I_O,I_A",
              name: "Intent checks",
              description: "Objective와 acceptance가 있으면 각각 1입니다.",
            },
            {
              symbol: "I_X,I_P",
              name: "Access checks",
              description: "Context path와 capability가 명시되면 각각 1입니다.",
            },
            {
              symbol: "I_R",
              name: "Receipt plan",
              description: "Artifact·verifier·recovery 경로가 있으면 1입니다.",
            },
          ]}
          assumptions={[
            "각 field의 identity와 owner가 명시돼 있습니다.",
            "자연어 존재가 아니라 runtime이 읽을 수 있는 contract로 고정합니다.",
            "고위험 action은 별도 human approval을 추가합니다.",
          ]}
          interpretation="Objective와 context만 있어도 verifier·recovery receipt가 없으면 C=0이므로 run을 시작하지 않습니다."
        />
      </section>
      <section id="recovery-handoff" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Failure를 retry·rollback·escalation 중 하나로 분류합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Timeout은 effect가 없었다는 뜻이 아닙니다. Receipt를 조회해 unknown outcome을 해소하고 idempotent retry인지 rollback인지 사람
            escalation인지 결정합니다. 다음 session에는 완료·미완료와 안전한 next action을 함께 넘깁니다.
          </p>
        </div>
      </section>
    </div>
  );
}

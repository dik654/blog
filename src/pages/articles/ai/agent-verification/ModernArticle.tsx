import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { VerificationLayersViz } from "../llm-harness/viz/ModernHarnessViz";

export default function AgentVerificationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="layers" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Verifier는 확실한 검사부터 불확실한 판단 순으로 쌓습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Compiler·test처럼 정답이 명확한 일을 LLM judge에게 먼저 묻지
            않습니다. <strong>Layered verification</strong>은 deterministic
            check, environment oracle, rubric judge, human review를 위험과
            불확실성에 맞춰 올립니다.
          </p>
        </div>
        <TermBreakdown
          title="서로 대체하지 않는 네 검증층"
          items={[
            {
              term: "Deterministic check",
              description: "같은 input에 명확한 pass/fail을 내는 검사입니다.",
              example: "Typecheck·unit test·schema·database invariant입니다.",
            },
            {
              term: "Environment oracle",
              description: "실제 외부 상태를 직접 읽는 관측입니다.",
              example: "Browser overflow, API state, file hash와 metric입니다.",
            },
            {
              term: "Rubric judge",
              description:
                "기계적 oracle이 약한 품질을 versioned rubric으로 비교합니다.",
              example: "설명 hierarchy를 blind pairwise로 평가합니다.",
            },
            {
              term: "Human checkpoint",
              description: "되돌리기 어려운 effect와 불일치를 승인합니다.",
              example:
                "Production deploy·delete·payment 전에 diff와 rollback을 봅니다.",
            },
          ]}
        />
        <VerificationLayersViz />
        <ContentBoundary article="agent-verification" />
      </section>
      <section id="trajectory-effect" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          최종 artifact와 trajectory·effect·budget을 따로 채점합니다
        </h2>
        <ExplainedFormula
          question="Artifact가 맞아도 위험한 경로나 중복 effect가 있으면 run을 통과시키나요?"
          idea={
            <p>
              필수 네 gate를 평균내지 않고 AND로 묶어 하나의 성공이 다른 실패를
              상쇄하지 못하게 합니다.
            </p>
          }
          formula={String.raw`A=A_a\land A_t\land A_e\land A_b`}
          annotatedFormula={String.raw`\begin{aligned}A&=\underbrace{A_a}_{\text{artifact 맞음}}\land\underbrace{A_t}_{\text{허용 경로}}\\&\quad\land\underbrace{A_e}_{\text{effect 일치}}\land\underbrace{A_b}_{\text{budget 이내}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`A_a\land A_t`,
              annotation: ["결과와 실행 경로를", "둘 다 통과"],
            },
            {
              expression: String.raw`A_e\land A_b`,
              annotation: ["외부 상태와 비용까지", "독립 gate로 통과"],
            },
          ]}
          terms={[
            {
              symbol: "A_a",
              name: "Artifact gate",
              description: "산출물이 acceptance를 만족하면 1입니다.",
            },
            {
              symbol: "A_t",
              name: "Trajectory gate",
              description: "허용 tool·resource·approval 경로를 지키면 1입니다.",
            },
            {
              symbol: "A_e",
              name: "Effect gate",
              description:
                "외부 write가 의도한 identity·횟수·상태와 같으면 1입니다.",
            },
            {
              symbol: "A_b",
              name: "Budget gate",
              description: "Token·tool call·time·retry가 한도 안이면 1입니다.",
            },
          ]}
          assumptions={[
            "각 gate와 oracle이 run 시작 전에 정의됩니다.",
            "External effect는 receipt로 관측할 수 있습니다.",
            "필수 gate를 평균 score로 상쇄하지 않습니다.",
          ]}
          interpretation="코드가 맞아도 secret 전송이나 중복 deploy가 있으면 trajectory/effect가 0이라 전체 run은 실패합니다."
        />
      </section>
      <section id="regression" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          운영 trace를 재현 가능한 regression fixture로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Private chain-of-thought가 아니라 observable input, tool calls,
            artifact, effect receipts와 metrics를 고정합니다. 실패 case만
            추가하면 과도한 거부를 놓치므로 같은 유형의 기존 success case도 함께
            실행합니다.
          </p>
        </div>
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Judge는 version과 calibration을 가진 보조 판정입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Worker와 judge가 같은 오류를 공유할 수 있습니다. Rubric·judge
            version·input order를 고정하고 사람 label과 calibration하며, 고위험
            invariant는 deterministic oracle이나 독립 검토로 교차 확인합니다.
          </p>
        </div>
      </section>
    </div>
  );
}

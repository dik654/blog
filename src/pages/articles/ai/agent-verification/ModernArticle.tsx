import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
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
      <section id="verifier-truth-source" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Verifier는 진실이 어디서 오는지로도 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Compiler exit code나 test 실행 결과처럼 시스템 밖에서 그대로
            확정되는 값을 <strong>external ground truth</strong>라 부릅니다.
            반대로 rubric judge나 LLM이 설명·구조·톤을 읽고 점수를 매기는
            판정은 <strong>semantic verifier</strong>입니다.
          </p>
          <p>
            External ground truth는 채점자가 바뀌어도 값이 그대로입니다. 27개
            test case 중 compiler가 확정하는 통과 개수는 항상 같은
            26/27입니다. 반면 같은 코드 설명의 품질을 semantic verifier
            셋이 각각 매기면 0.6, 0.7, 0.8처럼 흔들릴 수 있습니다.
          </p>
          <p>
            이 구분이 앞서 본 deterministic check·environment oracle이 rubric judge보다 먼저 오는 이유입니다. Test-based
            verification·compiler feedback·runtime feedback은 전부 external ground truth의 구체적인 형태이고 해석 없이
            pass·fail을 내는 쪽부터 통과시키는 편이 judge 예산을 아낍니다.
          </p>
          <p>
            다만 external ground truth도 test coverage가 좁으면 실제 실패를 그냥 통과시키고 semantic verifier도 calibration 없이
            배포하면 같은 실수를 매번 놓칠 수 있습니다. 둘 중 하나만으로 verifier layer 전체를 대체할 수는 없습니다.
          </p>
        </div>
      </section>
      <section id="critic-architecture" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Critic이 분리된 model인지 generator 자신인지가 신뢰 범위를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Generator-critic 구조는 결과를 만든 model과 다른 critic model이
            따로 채점합니다. Generator-verifier 구조는 같은 model이 생성과
            검증을 모두 맡습니다.
          </p>
          <p>
            가령 7B model이 만든 코드를 70B critic model이 다시 채점하면 generator 혼자 판정할 때보다 놓치던 오류를 더 잡지만 critic 호출 자체가
            token을 한 번 더 씁니다. 같은 model이 자기 출력을 다시 보는 generator-verifier는 별도 호출 비용은 없지만 처음에 놓친 가정을 검증 단계에서도 같은
            이유로 놓치기 쉽습니다.
          </p>
          <p>
            그래서 되돌리기 어려운 effect일수록 critic model을 generator와 분리하거나 앞 절의 external ground truth로 교차 확인하는 쪽을 택합니다.
            Generator-verifier만으로 충분한 경우는 실수의 대가가 작고 재시도 비용이 낮을 때로 좁혀 둡니다.
          </p>
        </div>
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
      <section id="plan-execute-verify" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Verifier-guided agent는 매 단계마다 plan-execute-verify를 반복합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Plan-execute-verify loop는 다음 action을 계획해 실행하고 그 결과를 앞서 정한 verifier로 확인한 뒤에야 다음 plan을 세웁니다. Verify를
            건너뛰면 한 단계의 부분 실패가 다음 plan의 잘못된 전제로 그대로 넘어갑니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Plan-execute-verify loop"
          input={[
            "objective와 이번 run의 verifier 정의(gate A_a·A_t·A_e·A_b)",
            "현재 observable state",
          ]}
          steps={[
            {
              code: "plan ← propose_next_action(objective, state)",
              note: "현재 state에서 다음 action 하나를 제안합니다.",
            },
            {
              code: "result ← execute(plan)",
              note: "Runtime이 허가한 범위 안에서만 실행합니다.",
            },
            {
              code: "verdict ← verify(result, gate)",
              note: "External ground truth와 semantic verifier를 상황에 맞게 적용합니다.",
            },
            {
              code: "state ← update(state, result, verdict)",
              note: "통과·실패 여부를 다음 plan의 입력에 반영합니다.",
            },
          ]}
          repeatUntil="A_a∧A_t∧A_e∧A_b가 모두 통과하거나 budget이 끝나 human checkpoint로 넘길 때까지 반복합니다."
          output="검증된 artifact 또는 실패 사유가 붙은 중단 상태"
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
            Worker와 judge가 같은 오류를 공유할 수 있습니다. Rubric·judge version·input order를 고정하고 사람 label과 calibration하며
            고위험 invariant는 deterministic oracle이나 독립 검토로 교차 확인합니다.
          </p>
        </div>
      </section>
    </div>
  );
}

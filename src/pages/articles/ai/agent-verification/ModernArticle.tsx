import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { VerificationLayersViz } from "../llm-harness/viz/ModernHarnessViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 잘했다는 말과 실제 성공을 구분합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            코드를 고친 프로그램이 모든 문제가 해결됐다고 답해도 테스트가 실패할
            수 있습니다. 테스트가 통과해도 허용하지 않은 파일을 건드렸거나 같은
            외부 요청을 두 번 실행했을 수 있습니다.
          </p>
          <p>
            결과의 정확성, 실행한 경로, 실제로 바뀐 상태, 쓴 비용을 각각
            확인하면 한 가지 성공으로 다른 실패를 덮지 않게 됩니다. 무엇을
            기계적으로 확인하고 무엇을 사람이 해석해야 하는지도 함께 나눕니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 결과와 실행 기록을 서로 다른 검사에 넣습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            결과 파일과 실행 기록을 모읍니다. 명확한 조건은 직접 검사하고 실제 환경의 상태를 읽어 그 기록과 맞춥니다. 설명의 품질처럼 정답을 단순하게 정하기 어려운 항목은 별도
            기준으로 판단합니다.
          </p>
          <p>
            검사 결과는 다음 수정의 입력입니다. 실패 원인을 찾고 수정한 뒤 같은
            조건을 다시 확인해야 이전 실패가 없어졌는지 알 수 있습니다. 검사자를
            많이 부르기 전에 각 검사가 어떤 질문을 맡는지부터 정합니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>결과와 실행 기록을 모은다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>정해진 조건을 검사한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>실제 환경과 맞춘다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>판단이 필요한 품질을 검토한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 27개 검사 중 1개가 실패했습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            코드 수정 뒤 검사 27개 중 26개가 통과했습니다. 문서 설명의 품질은
            별도 평가자 3명이 0.6, 0.7, 0.8로 판단했다고 합시다. 이 수치와 평가
            조건은 가정입니다. (가정)
          </p>
          <p>
            설명 점수 평균은 0.7이지만 실패한 필수 검사 1개가 없어지는 것은 아닙니다. 허용 파일만 바꾸었는지, 외부 변경 횟수가 맞는지, 예산 안에서 끝났는지도 따로 확인합니다.
            평균으로 볼 항목과 반드시 통과해야 할 항목을 먼저 정합니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-verification"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 무엇을 사실로 읽고 무엇을 평가할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            검사 프로그램의 반환값은 이번 실행에서 어떤 조건이 통과했는지 알려
            줍니다. 실제 파일과 외부 서비스 상태를 읽으면 실행 기록이 그 상태와
            맞는지 확인할 수 있습니다. 설명의 명료함은 미리 정한 기준과 평가자의
            판단이 필요합니다.
          </p>
          <p>
            세 결과는 서로 대체되지 않습니다. 파일이 존재해도 요구한 내용인지 확인해야 하고 문장이 읽기 쉬워도 잘못된 사실을 담을 수 있습니다. 어떤 값이 무엇을 입증하는지 나누어야
            다음 수정도 올바른 곳을 향합니다.
          </p>
        </div>
      </section>

      <section
        id="why-verification"
        data-teach-level="2"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          5. 같은 오류를 다시 믿지 않으려면 확인 경로가 달라야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            생성한 모델에게 자기 답이 맞는지만 다시 물으면 처음의 잘못된 가정을
            그대로 사용할 수 있습니다. 다른 모델을 쓰더라도 같은 자료와 편향을
            공유하면 같은 오류를 놓칩니다. 모델 크기만으로 독립성이나 정확성이
            보장되지 않습니다.
          </p>
          <p>
            기계 검사도 작성한 조건 밖의 실패를 보지 못합니다. 26/27이라는 값은
            그 27개 검사에 관한 관측이지 제품 전체의 정확도를 뜻하지 않습니다.
            실제 환경, 명시적 검사, 품질 판단이 맡는 범위를 나누는 이유입니다.
            (가정)
          </p>
        </div>
      </section>

      <section id="layers" data-teach-level="3" className="scroll-mt-20">
        <span id="verifier-truth-source" className="scroll-mt-20" />
        <span id="critic-architecture" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 검사 방식과 진실의 출처에 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            확인하는 도구를 통틀어 verifier라고 부릅니다. 여러 확인 수단을 순서대로 결합하는 방식이 layered verification입니다. 먼저 값과 조건을 직접 확인하고
            해석이 필요한 품질은 평가 기준을 붙여 검토합니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Deterministic check",
              description:
                "고정한 입력과 환경에서 명시된 조건의 통과 여부를 검사합니다.",
              boundary:
                "비결정적 테스트나 불안정한 환경에서는 재현 조건도 확인해야 합니다.",
            },
            {
              term: "Environment oracle",
              description: "실제 파일·화면·외부 서비스 상태를 읽는 관측입니다.",
              boundary:
                "관측 시점과 접근 권한, 오래된 값의 가능성을 확인합니다.",
            },
            {
              term: "Rubric judge / semantic verifier",
              description:
                "설명 품질처럼 의미 해석이 필요한 항목을 명시적 기준으로 평가합니다.",
              boundary: "평가자·입력 순서·기준에 따라 값이 흔들릴 수 있습니다.",
            },
            {
              term: "Human checkpoint",
              description:
                "사람의 판단이 필요한 변경이나 불일치를 검토하는 지점입니다.",
              boundary:
                "모든 변경에 새 승인을 요구한다는 보편 규칙은 아닙니다.",
            },
            {
              term: "External ground truth",
              description:
                "모델의 자기 보고 밖에서 확인한 테스트·실행·환경의 사실입니다.",
              boundary:
                "검사의 범위와 환경이 틀리면 전체 정답의 보증은 아닙니다.",
            },
            {
              term: "Generator / critic",
              description: "결과를 만드는 역할과 평가하는 역할입니다.",
              boundary:
                "두 역할이 같은 모델일 수도 다른 모델일 수도 있어 이름만으로 구조를 단정하지 않습니다.",
            },
            {
              term: "Trajectory / effect / budget",
              description: "실행 경로, 실제 외부 변경, 사용한 자원입니다.",
              boundary:
                "좋은 최종 문장만으로 세 항목이 올바르다고 추정하지 않습니다.",
            },
          ]}
        />
        <VerificationLayersViz />
      </section>

      <section
        id="plan-execute-verify"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <span id="regression" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          7. 실패한 1개를 고친 뒤 같은 27개를 다시 검사합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 관측은 tests=26/27입니다. 실패 위치를 확인해 수정하고 같은
            조건에서 다시 검사합니다. tests=27/27을 얻어야 필수 테스트 조건을
            충족합니다. 그와 별개로 허용 파일 변경, 의도한 외부 변경, 비용
            한도도 각각 통과해야 합니다. (가정)
          </p>
          <p>
            평가자 점수 0.6·0.7·0.8은 설명 품질의 의견 차이를 드러냅니다. 평균
            0.7만 남기지 않고 기준과 원문을 함께 남겨 불일치를 확인합니다. 같은
            모델을 다시 호출해 평가하더라도 입력·출력 처리 비용과 시간이
            추가됩니다. (가정)
          </p>
          <p>
            결과를 고칠 때는 새 검사와 함께 이전에 통과했던 조건도 다시
            확인합니다. 실패 사례만 모으면 과도한 거부나 정상 작업의 회귀를 놓칠
            수 있습니다. 이제 필수 조건을 결합하는 식과 공식 평가 문서의 예를
            맞춰 보겠습니다.
          </p>
        </div>
      </section>

      <section
        id="trajectory-effect"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 필수 실패는 다른 점수로 상쇄하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 산출물·경로·외부 변경·예산을 필수 조건으로 정하고 AND로 묶습니다. 테스트가 아직 26/27이면 산출물 조건은 0이고 다른 세 항목이 1이어도
            0∧1∧1∧1=0입니다. 27/27이어도 외부 변경이 두 번 중복됐다면 그 항목이 0이 됩니다. (가정)
          </p>
          <p>
            품질 항목의 가중 평균은 별도 설계 선택입니다. 이 식은 모든 평가가
            AND여야 한다는 법칙이 아니라 이번 실행의 필수 요구를 표현합니다.
          </p>
        </div>
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
        <div id="paper-agent-evals" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Anthropic — Demystifying evals for AI agents, Types of graders"
            citeKey={1}
            href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
          >
            <q>binary (all graders must pass)</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              원문은 가중 점수, 모두 통과해야 하는 판정, 둘의 혼합을 구분합니다.
              이 사례에서 필수 테스트와 실행 권한은 모두 통과해야 하는 쪽에
              둡니다. 설명 점수 0.7을 평균낸다는 선택이 실패한 테스트를 보상하지
              않도록 두 판정을 분리합니다. (가정)
            </p>
          </div>
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

      <section id="release" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          9. 평가도 바뀌고 틀릴 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            고정한 코드와 데이터에서도 시간·난수·외부 서비스가 달라지면 실행
            결과가 달라질 수 있습니다. 검사 조건과 버전, 실제 로그를 보존하고
            불안정한 테스트를 별도로 진단합니다. 외부에서 나온 값이라는 이유로
            불변의 진실이라고 부르지 않습니다.
          </p>
          <p>
            같은 모델의 자기 검토와 별도 critic 호출은 모두 추가 계산을 쓸 수 있습니다. 큰 모델이나 다른 모델이 더 잘 잡는지는 같은 오류 표본에서 확인합니다. 사람 판정과
            비교해 평가 기준을 조정하고 중요한 조건은 가능한 직접 검사합니다.
          </p>
          <p>
            검증을 통과했다는 말에는 검사한 범위가 따라야 합니다. 관측 가능한
            입력·호출·결과·비용은 재현 자료로 남기되 비공개 사고 과정을
            복원하거나 공개할 필요는 없습니다.
          </p>
        </div>
        <ContentBoundary article="agent-verification" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 어떤 성공이 다른 실패를 가리지 못하나요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            설명 점수 평균이 0.7인데 테스트는 26/27입니다. 필수 테스트 조건은
            통과인가요? (답: 8절)
          </p>
          <p>
            같은 모델에게 답을 다시 검사시키면 호출 비용과 오류 상관관계가
            사라지나요? (답: 9절)
          </p>
          <p>
            27개 테스트를 모두 통과했습니다. 그 숫자가 검사하지 않은 모든 사용자
            환경도 보장하나요? (답: 5절)
          </p>
        </div>
      </section>
    </div>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AgentLoopViz } from "./viz/ModernAgentPatternViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 답을 쓰기 전에 실제로 고쳐졌는지 알아야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            화면이 옆으로 밀리는 문제를 고쳐 달라고 맡겼다고 합시다. 파일을
            어디서 찾을지, 바꾼 뒤 무엇을 확인할지까지 처음부터 알기는
            어렵습니다. 한 번 답을 생성하는 것만으로는 수정과 검사를 끝낼 수
            없습니다.
          </p>
          <p>
            현재 결과를 보고 다음 일을 고르는 과정을 반복해야 합니다. 다만 다음에 하고 싶다는 말과 실제로 할 수 있다는 권한은 분리합니다. 이 글은 파일을 찾고 고친 뒤 검사 결과를
            다시 읽는 한 작업을 끝까지 따라갑니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 보고 고르고 실행하고 다시 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일을 맡은 쪽은 먼저 현재 상황을 읽습니다. 이어서 다음 행동을 제안하고 실행 담당자가 허용된 행동만 수행합니다. 돌아온 결과는 다음 판단에 넣습니다. 네 자리가 연결되면 작업
            중 새로 발견한 사실에 따라 경로를 바꿀 수 있습니다.
          </p>
          <p>
            결과가 없거나 읽을 수 없었다면 그 사실도 되돌려 줍니다. 실패를 빈 성공처럼 보관하면 다음 판단이 잘못된 전제에서 시작합니다. 지금은 이 큰 순환만 잡고 실제로 바뀌는 값을
            넣어 보겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>현재 상황을 읽는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>다음 일을 고른다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>허용 범위에서 실행한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>실제 결과를 기록한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 폭 390에서 430이 되는 페이지를 고칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            화면 폭은 390px인데 문서 폭은 430px입니다. 따라서 오른쪽으로 40px가 넘칩니다. 수정할 파일은 1개이고 실행은 최대 6번 허용한다고 정합니다. 이 숫자와 파일명은
            이해를 위한 가정이며 실제 측정 보고가 아닙니다. (가정)
          </p>
          <p>
            처음에는 원인을 모릅니다. 파일을 읽은 결과 고정 폭 430px가
            발견됐다고 합시다. 이를 고친 뒤 같은 화면을 다시 재어 문서 폭이
            390px인지 확인해야 끝입니다. 바꿨다는 말만으로는 처음의 40px 문제가
            없어졌는지 알 수 없습니다. (가정)
          </p>
          <p>
            이제 목표·현재 값·남은 실행 횟수가 생겼습니다. 다음에는 이 셋을 잃지
            않으려면 어떤 자리가 필요한지 살펴봅니다.
          </p>
        </div>
      </section>

      <section id="inside-loop" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 다음 판단에 무엇을 남겨야 할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            읽을 기록에는 목표, 수정할 파일, 마지막 측정, 남은 횟수가
            들어갑니다. 행동 제안에는 파일을 읽을지 수정할지와 대상 경로가
            필요합니다. 실행 담당자는 그 경로와 작업이 허용됐는지 확인합니다.
          </p>
          <p>
            결과 기록은 성공 여부와 실제 값, 관측 시점, 실행 식별자를 보존합니다. 파일이 없었다면 없었다고 남기고 읽기 권한이 없었다면 거부됐다고 남깁니다. 둘을 같게 쓰면 같은
            실패를 계속 반복하기 쉽습니다.
          </p>
          <p>
            40px를 줄이는 작업에서도 판단 기록과 실행 결과는 별개라는 점이
            보입니다. 그 구분이 왜 필요한지 실패 한 번을 넣어 보겠습니다.
          </p>
        </div>
      </section>

      <section id="why-runtime" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 말로 고쳤다고 해도 파일은 그대로일 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 행동을 고르는 쪽이 수정 내용을 제안했어도 실행 담당자가 쓰기를
            거부하면 파일은 바뀌지 않습니다. 이때 다음 기록에 수정 완료라고
            적으면 이어지는 검사와 최종 답도 거짓 전제를 물려받습니다.
          </p>
          <p>
            반대로 파일을 바꾼 뒤 응답을 받지 못한 경우에는 변경이 있었는지 아직
            모릅니다. 재실행하기 전에 실제 파일과 실행 기록을 확인해야 합니다.
            성공·거부·응답 없음이라는 차이를 보존하는 이유입니다.
          </p>
          <p>
            행동을 고르는 능력, 행동할 권한, 실제 결과를 나눴습니다. 이제 이
            역할에 쓰는 표준 이름을 붙일 수 있습니다.
          </p>
        </div>
      </section>

      <section
        id="agent-definition"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="agent-step-and-horizon" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 같은 순환의 역할에 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            관측에 따라 모델이 다음 행동을 고르는 시스템을 AI agent라고 부릅니다. 다음 경로가 미리 정한 코드로 결정되는 구간은 agentic workflow입니다. 둘은 섞어 쓸
            수 있고 자율적으로 반복한다고 실행 권한이 무제한인 것은 아닙니다.
          </p>
          <p>
            한 바퀴가 agent step이며 작업이 요구하는 단계·시간·비용의 길이를
            agent horizon이라고 부릅니다. Long-horizon agent는 긴 작업에서
            기록과 재검증을 유지해야 합니다. 반복 상한을 높이는 것만으로 이
            성질이 생기지는 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Observable state",
              description:
                "다음 판단에 허용된 목표·대상·관측·남은 예산의 현재 기록입니다.",
              boundary:
                "비밀 인증정보나 전체 메모리를 모두 보여 준다는 뜻은 아닙니다.",
            },
            {
              term: "Action proposal",
              description: "모델이 제안한 도구 이름과 인자입니다.",
              boundary: "제안 자체는 실행 결과가 아닙니다.",
            },
            {
              term: "Runtime gate",
              description:
                "실행 환경이 자원·작업·권한·예산을 검사하는 자리입니다.",
              boundary:
                "입력 문서에 허용됐다고 써 있어도 권한이 생기지 않습니다.",
            },
            {
              term: "Typed observation",
              description:
                "성공·빈 결과·거부·시간 초과·부분 실행을 구분한 반환 기록입니다.",
              boundary: "모든 실패를 빈 문자열 하나로 합치지 않습니다.",
            },
            {
              term: "Agent policy",
              description:
                "현재 기록을 다음 행동의 분포로 바꾸는 선택 규칙입니다.",
              boundary:
                "학습 방법과 실행 권한은 이 규칙만으로 결정되지 않습니다.",
            },
            {
              term: "Tool-augmented LLM",
              description:
                "외부 도구를 사용할 수 있도록 연결한 언어 모델입니다.",
              boundary:
                "도구 호출 능력만으로 반복 수행이 자동으로 생기지 않습니다.",
            },
            {
              term: "ReAct",
              description:
                "Reasoning과 Acting을 엮어 관측에 따라 행동을 갱신하는 논문의 방식입니다.",
              boundary: "생성한 추론 문장은 권한 검사나 정답 증명이 아닙니다.",
            },
          ]}
        />
        <AgentLoopViz />
      </section>

      <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 읽기·수정·측정 세 번을 같은 기록으로 잇습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            처음 state에는 viewport=390, document=430, remaining=6을 둡니다. 첫
            proposal은 read_file(path=/repo/page.css)입니다. Runtime이 읽기를
            허용하고 width:430px를 반환하면 remaining=5가 됩니다. (가정)
          </p>
          <p>
            두 번째 proposal은 그 파일의 폭 규칙 수정입니다. 쓰기 범위와 현재 파일 버전을 확인한 뒤 실제 저장 결과를 기록합니다. remaining=4이며 이 시점에는 화면이
            고쳐졌다고 결론내리지 않습니다. (가정)
          </p>
          <p>
            세 번째 proposal은 같은 390px 화면의 측정입니다. 반환 값
            document=390을 얻어 390−390=0px임을 확인하면 remaining=3입니다. 파일
            변경과 이 측정이 일치할 때 작업을 완료로 판정합니다. 거부됐다면 값을
            그대로 두고 거부 이유로 다음 행동을 고릅니다. (가정)
          </p>
          <p>
            세 번의 요청에서 달라진 것은 파일, 관측값, 남은 횟수입니다. 이
            기록의 갱신을 식과 원 논문의 표기에 대응시켜 보겠습니다.
          </p>
        </div>
      </section>

      <section id="transition" data-teach-level="5" className="scroll-mt-20">
        <span id="observation-contract" className="scroll-mt-20" />
        <span id="react-and-tool-augmented-llm" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          8. 관측을 다음 선택의 입력에 넣습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 식은 제안·허가·실행·기록을 분리한 이 글의 설계 표기입니다. 성공
            확률을 예측하는 법칙이 아닙니다. 390px 측정의 반환값은 마지막 갱신
            단계에서 다음 state에 들어갑니다.
          </p>
          <p>
            Observation에는 status와 값의 위치, 도구·호출 식별자·시각, 실제 변경
            기록을 남깁니다. 큰 결과를 줄였다면 생략 여부도 적습니다. 다음
            판단이 읽지 못한 부분을 모두 확인했다고 오해하지 않게 하기
            위해서입니다.
          </p>
        </div>
        <ExplainedFormula
          question="현재 state에서 다음 state까지 어떤 순서로 책임을 넘길까요?"
          idea={
            <p>
              Model proposal을 authorization이 좁히고 executor가 만든
              observation을 state update가 commit합니다. 각 함수는 서로 다른
              실패 owner입니다.
            </p>
          }
          formula={String.raw`a_t\sim\pi_\theta(\cdot\mid s_t),\quad \tilde a_t=\mathcal A(a_t),\quad o_t=\mathcal E(\tilde a_t),\quad s_{t+1}=\mathcal U(s_t,a_t,o_t)`}
          annotatedFormula={String.raw`\begin{aligned}
a_t&\sim\underbrace{\pi_\theta(\cdot\mid s_t)}_{\text{현재 state에서 action을 제안}}\\
\tilde a_t&=\underbrace{\mathcal A(a_t)}_{\text{권한·resource·approval로 허용 범위를 축소}}\\
o_t&=\underbrace{\mathcal E(\tilde a_t)}_{\text{허용된 action만 실행해 observation 생성}}\\
s_{t+1}&=\underbrace{\mathcal U(s_t,a_t,o_t)}_{\text{결과·receipt·budget을 다음 state에 반영}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\pi_\theta(\cdot\mid s_t)`,
              annotation: [
                "현재 보이는 state를 조건으로",
                "다음 action 후보를 생성",
              ],
            },
            {
              expression: String.raw`\mathcal A(a_t)`,
              annotation: [
                "제안을 곧바로 실행하지 않고",
                "runtime policy로 좁힘",
              ],
            },
            {
              expression: String.raw`\mathcal E(\tilde a_t)`,
              annotation: [
                "허용된 action을 실행해",
                "성공·실패·partial receipt를 관찰",
              ],
            },
            {
              expression: String.raw`\mathcal U(s_t,a_t,o_t)`,
              annotation: [
                "이전 state와 실제 결과를 함께 써서",
                "다음 판단의 state를 commit",
              ],
            },
          ]}
          terms={[
            {
              symbol: "s_t",
              name: "Observable state",
              description:
                "t번째 decision이 읽을 수 있는 versioned run state입니다.",
            },
            {
              symbol: "\\pi_\\theta",
              name: "Agent policy",
              description:
                "Observable state를 다음 action의 확률 분포로 바꾸는 model 함수입니다.",
            },
            {
              symbol: "a_t",
              name: "Action proposal",
              description:
                "Model이 제안한 tool call·response·plan update입니다.",
            },
            {
              symbol: "\\mathcal A",
              name: "Authorization gate",
              description:
                "실행 전에 identity·capability·approval·budget을 판정합니다.",
            },
            {
              symbol: "o_t",
              name: "Typed observation",
              description: "Executor가 반환한 status·payload·receipt입니다.",
            },
          ]}
          assumptions={[
            "Model proposal과 runtime execution 권한은 분리되어 있습니다.",
            "Denied·timeout·empty·partial effect는 서로 다른 observation status입니다.",
            "State update는 artifact version과 effect receipt를 잃지 않습니다.",
          ]}
          interpretation="이 식은 성공 확률을 계산하지 않습니다. 한 action의 제안·허가·실행·기록 책임을 순서대로 분리하는 실행 계약입니다."
        />
        <div id="paper-react" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="ReAct §2, arXiv:2210.03629v3"
            citeKey={1}
            href="https://arxiv.org/html/2210.03629v3#S2"
          >
            <q>cₜ = (o₁, a₁, …, oₜ₋₁, aₜ₋₁, oₜ)</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              원문의 cₜ는 지금까지의 관측과 행동을 연결합니다. 이 사례를 넣으면
              첫 관측인 430px, 파일 읽기 행동, width:430px라는 결과, 수정 행동,
              390px라는 새 관측이 차례로 다음 선택의 입력이 됩니다. ReAct의 이
              표기가 파일 쓰기 권한이나 중복 실행 방지를 제공하는 것은 아닙니다.
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="한 행동을 기록에 반영하는 절차 (의사코드)"
          input={["현재 state와 남은 실행 횟수", "도구별 권한·완료 검사"]}
          steps={[
            {
              code: "proposal ← choose(state)",
              note: "현재 관측에서 다음 행동을 하나 고릅니다.",
            },
            {
              code: "if not allowed(proposal): record(denied); return",
              note: "거부를 성공처럼 기록하지 않습니다.",
            },
            {
              code: "result ← execute(proposal)",
              note: "허가된 행동만 실행합니다.",
            },
            {
              code: "state ← append(state, proposal, result)",
              note: "결과·실제 변경·남은 횟수를 함께 갱신합니다.",
            },
            {
              code: "if acceptance(state): status ← completed",
              note: "모델의 종료 문장과 별개로 결과를 판정합니다.",
            },
          ]}
          output="다음 판단에 쓸 기록과 완료 또는 계속 상태"
        />
      </section>

      <section id="exit-states" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          9. 끝냈다·지쳤다·기다린다는 다른 결과입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Completed는 정해 둔 완료 검사를 통과한 경우입니다. Exhausted는 6번의 예산을 모두 쓴 경우이고 stalled는 같은 행동만 반복해 진전이 없는 경우입니다.
            예산 소진을 완료로 바꾸어 보고하지 않습니다.
          </p>
          <p>
            승인이 필요한 경우 awaiting_approval, 실행 실패는 failed, 담당자에게
            넘기는 경우 escalated처럼 구분할 수 있습니다. 이 이름은 애플리케이션
            설계이며 보편적으로 고정된 표준 상태 목록은 아닙니다.
          </p>
          <p>
            390px에서 넘침이 없어도 다른 화면이나 다른 페이지가 올바르다는
            증거는 아닙니다. 이 작업의 완료 범위를 넓히려면 그 범위를 검사에
            먼저 넣습니다. 긴 작업의 신뢰도는 반복 횟수보다 관측의 정확성과 완료
            조건에 달려 있습니다.
          </p>
        </div>
        <ContentBoundary article="agent-loop-foundations" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 다음 결과를 먼저 예상해 보세요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수정 제안 뒤 쓰기 권한이 거부됐습니다. 다음 state의 파일이
            바뀌었다고 기록해도 될까요? (답: 5절)
          </p>
          <p>
            파일 수정이 성공했지만 화면을 다시 재지 않았습니다. 처음의 40px
            넘침이 없어졌다고 완료해도 될까요? (답: 7절)
          </p>
          <p>
            6번의 실행을 모두 썼지만 문서 폭이 여전히 430px입니다. 어떤 종료
            상태이며 무엇을 남겨야 할까요? (답: 9절)
          </p>
        </div>
      </section>
    </div>
  );
}

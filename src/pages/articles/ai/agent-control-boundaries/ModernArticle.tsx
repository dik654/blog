import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { ControlBoundaryViz } from "../llm-harness/viz/ModernHarnessViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 어디까지 스스로 고르게 할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            고장 난 화면의 원인 파일은 미리 알 수 없지만 고친 결과를 검사하고 배포하는 순서는 정해 둘 수 있습니다. 모든 과정을 자유롭게 맡기면 확인해야 할 경우가 늘고 모든 순서를
            고정하면 예상 밖 원인을 찾기 어렵습니다.
          </p>
          <p>
            한 작업 안에서도 자유롭게 탐색할 구간과 규칙대로 진행할 구간을
            나눕니다. 그 경계를 위험한 행동 직전에 다시 확인하면 탐색의 유연성과
            실행의 통제를 함께 얻을 수 있습니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 탐색한 결과를 정해진 검사에 넘깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 원인을 찾고 수정안을 만듭니다. 정해 둔 검사는 그 결과를 받아 통과 여부를 돌려줍니다. 실제 사용자가 보는 곳에 반영하는 마지막 자리는 대상과 허용 범위를 따로
            확인합니다.
          </p>
          <p>
            이 연결에서 각 자리는 서로 다른 질문에 답합니다. 원인을 찾는 자리는 무엇을 더 볼지 고르고 검사하는 자리는 이미 정한 기준을 적용합니다. 마지막 자리는 지금 이 변경을 이
            대상에 실행해도 되는지 묻습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>원인을 찾는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>수정안을 만든다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>정한 조건으로 검사한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>허용된 대상에 반영한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 20개 파일을 살펴보고 1곳에만 반영합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            파일 20개 중 문제 원인은 1개에 있다고 합시다. 한 번의 작업에 읽기
            최대 6회, 검사는 2개, 반영 대상은 시험용 서비스 1개로 제한합니다.
            숫자와 작업 조건은 설명을 위한 가정입니다. (가정)
          </p>
          <p>
            첫 파일을 읽었는데 원인이 없다면 다음 파일 선택은 그 결과에 따라
            달라집니다. 그러나 검사 2개가 통과해야 반영한다는 조건은 중간
            판단으로 바뀌지 않습니다. 탐색 경로와 실행 허용 조건이 서로 다른
            이유가 여기에 있습니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-control"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 다음 경로와 허용 여부를 각각 결정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            탐색 담당자는 지금까지 읽은 파일과 남은 6회 중 사용한 횟수를 봅니다.
            검사 담당자는 수정된 파일과 정해 둔 검사 2개를 받습니다. 반영
            담당자는 검사 결과에 더해 대상 1개와 변경 버전이 승인 범위인지
            확인합니다. (가정)
          </p>
          <p>
            검사를 통과한 수정안도 다른 대상에 반영하면 잘못된 실행입니다.
            결과의 품질만 검사해서는 실행 권한을 대신할 수 없습니다. 다음
            절에서는 이 차이를 실제로 없앴을 때 생기는 문제를 봅니다.
          </p>
        </div>
      </section>

      <section id="why-control" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 잘 찾았다는 사실이 넓은 권한을 주지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원인을 찾는 도중 운영 서비스도 수정하는 것이 더 빠르다고 판단할 수
            있습니다. 읽기와 시험용 반영만 허용된 작업에서는 그 판단이 타당해
            보여도 운영 반영을 실행할 수 없습니다.
          </p>
          <p>
            실행 권한을 대상 1개로 좁히면 실수가 번지는 범위도 줄어듭니다. 다만
            그 1개 안의 잘못된 변경까지 사라지는 것은 아닙니다. 실행 전 조건
            확인과 실행 후 복구 경로가 모두 필요합니다. (가정)
          </p>
          <p>
            이렇게 경로를 정하는 주체와 피해 범위를 제한하는 수단을 나눠 놓아야
            다음 이름들이 구체적인 역할을 가집니다.
          </p>
        </div>
      </section>

      <section
        id="workflow-agent"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          6. 미리 정한 경로와 관측에 따른 선택을 구분합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            개발자가 다음 단계와 분기를 미리 정하는 구조가 workflow입니다.
            관측을 읽은 모델이 다음 행동을 선택하는 구간이 agent loop입니다.
            위험한 변경 직전의 검사 지점을 checkpoint라고 부릅니다. 이 세 가지를
            한 작업 안에서 조합할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Workflow",
              description:
                "개발자가 정의한 순서와 조건에 따라 실행하는 경로입니다.",
              boundary: "모델을 호출해도 경로 선택을 코드가 맡을 수 있습니다.",
            },
            {
              term: "Agent loop",
              description:
                "새 관측에 따라 모델이 다음 행동을 선택하는 반복입니다.",
              boundary:
                "높은 자율성이 높은 품질이나 넓은 실행 권한을 뜻하지 않습니다.",
            },
            {
              term: "Checkpoint",
              description:
                "실행 전에 대상·변경·허용 조건을 확인하는 지점입니다.",
              boundary:
                "모든 checkpoint가 매번 사람의 새 승인을 요구하는 것은 아닙니다.",
            },
            {
              term: "Blast radius",
              description:
                "한 번의 잘못된 행동이 영향을 줄 수 있는 범위입니다.",
              boundary: "좁혀도 범위 안의 피해는 남습니다.",
            },
            {
              term: "Least privilege",
              description:
                "이번 작업에 필요한 최소 자원과 작업만 허용하는 원칙입니다.",
              boundary: "검사·기록·복구를 대체하지 않습니다.",
            },
          ]}
        />
        <ControlBoundaryViz />
      </section>

      <section id="selection" data-teach-level="4" className="scroll-mt-20">
        <span id="blast-radius" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          7. 6회 탐색과 2개 검사를 지나 대상 1개를 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            읽기 1회째에서 연결 파일을 발견하고 2회째에서 원인을 찾았다고 합시다. Agent loop는 관측에 따라 두 번째 파일을 골랐고 읽기 예산은 6−2=4회 남습니다. 수정 뒤
            workflow가 검사 2개를 순서대로 실행합니다. (가정)
          </p>
          <p>
            검사 결과가 모두 통과여도 checkpoint는 target=test-1,
            revision=수정안의 버전인지 다시 확인합니다. 운영 대상 prod-1을
            제안하면 허용 범위와 다르므로 거부합니다. 허가된 test-1에 반영한 뒤
            실제 버전도 기록합니다. (가정)
          </p>
          <p>
            이 사례에서 경로 불확실성은 탐색 방식의 선택 기준이고 실패 영향은 checkpoint와 권한 범위를 정하는 기준입니다. 불확실성이 낮은 반복 작업도 영향이 크면 실행 확인이
            필요합니다.
          </p>
        </div>
      </section>

      <section
        id="paper-loop-control"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 공식 설명의 구분을 이 작업에 적용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Anthropic의 Building effective agents는 Where to use agents에서 경로를 미리 고정하기 어려운 작업에 자율적 선택을 쓰고 관측과 종료
            조건으로 실행을 통제하도록 설명합니다. 다음 짧은 원문은 경로 선택의 기준을 압축합니다.
          </p>
        </div>
        <div id="source-control-boundary" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Anthropic — Building effective agents, When to use agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/building-effective-agents"
          >
            <q>hardcode a fixed path</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              20개 파일 중 두 번째로 읽을 파일을 첫 결과로 정하는 구간은 고정
              경로로 쓰기 어렵습니다. 반면 검사 2개를 실행하는 경로는 미리 정할
              수 있습니다. 같은 작업을 둘로 나눈 것은 이 기준을 적용한 설계
              예이며 제품 성능 실측이 아닙니다. (가정)
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="구간별 제어를 조합하는 절차 (의사코드)"
          input={["읽기 예산 6회, 필수 검사 2개, 허용 대상 test-1"]}
          steps={[
            {
              code: "while cause unknown and reads < 6: inspect(choose_next())",
              note: "탐색의 다음 대상을 새 관측으로 정합니다.",
            },
            {
              code: "patch ← create_fix(cause)",
              note: "수정안 버전을 고정합니다.",
            },
            {
              code: "if not all(required_checks(patch)): return failed",
              note: "정해진 두 검사를 임의로 생략하지 않습니다.",
            },
            {
              code: "if target != test-1: return denied",
              note: "결과 품질과 별개로 반영 대상을 제한합니다.",
            },
            {
              code: "apply(patch); record(actual_revision)",
              note: "실제 결과를 기록합니다.",
            },
          ]}
          output="검증된 반영 또는 사유가 명시된 중단"
        />
      </section>

      <section
        id="loop-authority"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 한 번의 성공으로 전체 운영 규칙을 바꾸지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 작업 안의 반복은 이번 작업의 예산과 권한만 사용합니다. 여러
            작업의 결과를 보고 전체 지시나 실행 규칙을 바꾸는 개선 과정은 별도의
            검토와 비교 실행이 필요합니다. 한 번의 모델 평가로 공통 권한 규칙을
            즉시 넓히지 않습니다.
          </p>
          <p>
            최소 권한은 피해 가능 범위를 줄이고 checkpoint는 이번 행동의 적합성을 검사합니다. 둘 모두 복구를 보장하지는 않습니다. 반영 전 이전 버전과 되돌리는 방법을 확인하고
            되돌릴 수 없는 외부 변경은 그 조건에 맞게 다룹니다.
          </p>
        </div>
        <ContentBoundary article="agent-control-boundaries" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 경계를 바꾸면 무엇이 달라질까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            파일을 찾는 순서를 항상 고정하면 예상 밖 원인에 어떻게 대응할까요?
            관측에 따라 다음 파일을 고를 자리는 어디인가요? (답: 6절)
          </p>
          <p>
            검사 2개가 통과했지만 반영 대상이 prod-1입니다. 왜 실행을
            거부하나요? (답: 7절)
          </p>
          <p>
            권한을 대상 1개로 줄였습니다. 잘못된 변경의 피해가 0이 되나요? (답:
            9절)
          </p>
        </div>
      </section>
    </div>
  );
}

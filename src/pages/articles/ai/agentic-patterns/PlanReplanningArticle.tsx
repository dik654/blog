import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { PlanReplanningViz } from "./viz/ModernAgentPatternViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 작업 중 전제가 바뀌면 어디부터 다시 할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            자료를 읽고 코드를 만들고 검사까지 마쳤는데 처음 읽은 자료가 바뀌었다면 무엇을 다시 해야 할까요. 모든 작업을 처음부터 반복하면 비용이 크고 이미 완료했다는 표시만 믿으면
            낡은 결과를 제출합니다.
          </p>
          <p>
            각 작업이 무엇을 읽어 무엇을 만드는지 연결해 두면 변경의 영향을
            따라갈 수 있습니다. 이 글에서는 자료 버전이 바뀌는 한 사례로 계획을
            만드는 일과 계획을 고치는 일을 함께 살펴봅니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 입력이 결과로 넘어가는 연결을 보관합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            계획을 만드는 자리는 최종 목표를 검사 가능한 작은 결과로 나눕니다. 실행하는 자리는 준비된 입력을 받아 결과를 만들고 확인하는 자리는 그 결과가 조건을 만족하는지 검사합니다.
            새 사실이 들어오면 영향을 받는 연결만 다시 엽니다.
          </p>
          <p>
            문서에 적힌 순서만으로는 부족합니다. 앞 결과가 바뀌었을 때 어느 뒤
            결과가 낡아지는지 알 수 있어야 합니다. 네 자리의 연결을 작은 작업 네
            개로 펼쳐 보겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>작은 결과로 나눈다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>입력 버전을 고정한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>실행하고 검사한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>바뀐 입력의 영향을 따라간다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 네 작업 중 세 작업만 새 자료에 의존합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작업 A는 자료 버전 3을 읽고 B는 그 자료로 client.ts를 만들며 C는 그 파일을 검사합니다. D는 이 자료와 무관한 고정 안내 화면을 찍습니다. A→B→C와 별도의
            D, 총 4개 작업입니다. 모두 설명용 가정입니다. (가정)
          </p>
          <p>
            A·B·C·D가 끝난 뒤 자료 버전 4를 발견했습니다. B와 C는 다시 해야
            하지만 D는 입력과 검사 조건이 같다면 보존할 수 있습니다. 이 판단을
            말로만 기억하지 않고 각 작업의 입력과 결과 버전에 남깁니다. (가정)
          </p>
        </div>
      </section>

      <section id="inside-plan" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 각 작업에는 입력·담당·결과·완료 근거가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A의 결과를 받기 전 B는 기다립니다. B에는 읽을 자료 버전과 담당자,
            만들 파일, 통과해야 할 검사를 적습니다. C에는 B가 만든 파일의 정확한
            버전을 넣습니다. 끝났다는 상태는 이 검사 결과와 함께 바뀝니다.
          </p>
          <p>
            작업이 너무 크면 더 작은 결과로 다시 나눕니다. 상위 작업은 필요한
            하위 결과가 모두 준비됐을 때 끝납니다. 나누는 깊이보다 각 경계에서
            무엇을 검증하는지가 중요합니다. 이 구조를 갖추면 중단 뒤에도 같은
            지점으로 돌아올 수 있습니다.
          </p>
        </div>
      </section>

      <section id="why-plan" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 끝났다는 표시가 낡은 근거를 숨기지 않게 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            B가 완료됐다는 표시만 있으면 버전 3으로 만든 파일인지 버전 4로 만든
            파일인지 알 수 없습니다. C의 통과 결과도 어느 파일을 검사했는지
            없으면 재사용 여부를 판정할 수 없습니다.
          </p>
          <p>
            계획을 실행하기 전에는 연결이 순환하지 않는지, 필요한 입력과 자원이
            있는지 확인합니다. 실행 뒤에는 실제 입력이 달라졌는지 확인합니다.
            같은 계획을 읽지만 질문이 다릅니다. 이제 미리 확인하는 일과 새
            관측으로 고치는 일에 이름을 붙입니다.
          </p>
        </div>
      </section>

      <section
        id="planning-and-plan-mode"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="task-decomposition-and-subgoal" className="scroll-mt-20" />
        <span id="hierarchical-planning" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 계획·분해·재계획의 역할을 구분합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행 전에 여러 행동의 순서와 의존 관계를 만드는 일이 planning입니다.
            계획을 검토하는 단계와 실행 권한을 분리하는 운영 방식을 흔히 plan
            mode라고 부릅니다. 실제로 어떤 행동을 허용하고 승인을 요구하는지는
            제품과 설정마다 다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Task decomposition / subgoal",
              description:
                "큰 목표를 독립적으로 검사할 수 있는 작은 목표와 작업으로 나눕니다.",
              boundary: "할 일 문장만 나눠서는 완료 조건이 생기지 않습니다.",
            },
            {
              term: "Hierarchical planning",
              description:
                "작은 목표를 다시 나누어 여러 깊이의 계획을 만듭니다.",
              boundary: "깊이가 늘어날수록 상하위 완료 조건도 연결해야 합니다.",
            },
            {
              term: "Executable plan",
              description:
                "입력 버전·담당·출력·상태와 완료 근거를 함께 가진 실행 계획입니다.",
              boundary: "표준 제품 공통 형식을 뜻하는 이름은 아닙니다.",
            },
            {
              term: "Plan validation",
              description: "실행 전에 의존 관계·입력·자원 조건을 확인합니다.",
              boundary: "실행 뒤 모든 사실이 그대로라는 보장은 아닙니다.",
            },
            {
              term: "Replanning",
              description:
                "새 관측으로 깨진 전제와 영향을 계산해 계획을 바꿉니다.",
              boundary: "실패를 숨기며 무조건 재시도하는 것과 다릅니다.",
            },
            {
              term: "Reflection",
              description:
                "실패 관측을 다음 시도의 구체적인 수정 지침으로 정리합니다.",
              boundary:
                "자기 설명을 다시 읽는 것만으로 독립된 오류 증거가 생기지 않습니다.",
            },
          ]}
        />
        <PlanReplanningViz />
      </section>

      <section
        id="executable-plan"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <span id="replanning" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          7. 버전 3을 4로 바꾸며 연결된 결과만 다시 엽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 기록은 A(output=schema:v3), B(input=schema:v3, output=client:r1), C(input=client:r1, pass),
            D(input=guide:r1, pass)입니다. 새 관측 schema:v4를 발견하면 A의 출력 기록을 갱신합니다. B의 입력 v3이 새 요구와 다르므로 B를 다시 열고 B의
            결과를 읽은 C도 무효로 표시합니다. (가정)
          </p>
          <p>
            B가 client:r2를 만들고 C가 r2를 통과시키면 A→B→C는 새 자료에
            맞습니다. D의 guide:r1과 완료 조건은 바뀌지 않아 기존 결과를
            유지합니다. 만약 안내 화면도 자료에 의존했다면 D를 보존할 수
            없습니다. 연결을 생략하면 보존 판단도 틀립니다. (가정)
          </p>
          <p>
            계획 변경에는 깨진 전제, 다시 열린 작업, 보존한 결과, 남은 예산을
            함께 기록합니다. C가 잘못된 경로를 보고하면 그 관측을 다음 수정과
            재검사에 연결합니다. 다음 절은 이 실패 기록이 실제 연구의 반복
            구조에서 어떤 자리를 갖는지 보여 줍니다.
          </p>
        </div>
      </section>

      <section id="reflection" data-teach-level="5" className="scroll-mt-20">
        <span id="plan-validation" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          8. 실패 설명을 다음 시도의 입력으로 넣습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원 논문 Reflexion은 실패를 평가한 뒤 언어로 정리한 피드백을 다음
            시도가 읽는 기억에 추가합니다. 다음 줄은 논문의 Algorithm 1에서
            기억을 갱신하는 동작입니다.
          </p>
        </div>
        <div id="paper-reflexion" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Reflexion §3 Algorithm 1, arXiv:2303.11366v4"
            citeKey={1}
            href="https://arxiv.org/html/2303.11366v4#S3"
          >
            <q>Append srₜ to mem</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              C가 client:r1의 경로 불일치를 보고했다면 srₜ에 그 관측과 수정
              대상, 다시 돌릴 검사를 적습니다. 다음 B 실행은 이 기록을 읽고 r2를
              만들며 C가 다시 검사합니다. 이는 논문의 기억 갱신을 이 예에
              대응시킨 설계입니다. 논문 자체가 버전 의존성 추적이나 파일
              무효화를 구현했다는 주장은 아닙니다. (가정)
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="입력 변경의 영향을 따라가는 절차 (의사코드)"
          input={[
            "작업별 입력·출력 버전과 의존 관계",
            "schema:v3 → schema:v4라는 새 관측",
          ]}
          steps={[
            {
              code: "changed ← tasks_with_changed_input(observation)",
              note: "바뀐 자료를 직접 읽는 작업을 찾습니다.",
            },
            {
              code: "invalid ← changed ∪ descendants(changed)",
              note: "그 결과에 의존하는 뒤 작업도 다시 엽니다.",
            },
            {
              code: "preserve ← verified_tasks − invalid",
              note: "입력과 완료 조건이 그대로인 결과만 보존합니다.",
            },
            {
              code: "validate(plan); execute_ready(invalid)",
              note: "순환·입력·예산을 확인하고 준비된 작업부터 다시 실행합니다.",
            },
            {
              code: "record(new_outputs, verification, reason)",
              note: "새 결과와 검사 이유를 기록합니다.",
            },
          ]}
          output="r2를 검사한 새 완료 기록과 보존된 D 결과"
        />
      </section>

      <section
        id="plan-boundaries"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 계획의 연결이 틀리면 재계획도 틀립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            어떤 작업이 어느 자료를 읽었는지 빠뜨리면 영향을 받는 결과를
            놓칩니다. 반대로 모든 작업을 서로 연결하면 작은 변경도 전체
            재실행으로 번집니다. 연결은 문서에 쓰인 순서보다 실제 읽은 입력에서
            확인합니다.
          </p>
          <p>
            피드백도 오류가 있을 수 있습니다. 모델이 추측한 원인을 확정 사실처럼
            기억하면 다음 시도를 같은 방향으로 잘못 유도합니다. 관측된 실패와
            원인 가설을 구분하고 실제 검사로 확인합니다. 재시도 횟수와 비용
            상한도 계획에 포함합니다.
          </p>
        </div>
        <ContentBoundary article="agent-plan-replanning" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 어느 작업을 다시 열어야 할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            schema:v4를 발견했지만 D의 guide:r1은 그대로입니다. B·C·D 중 무엇을
            다시 실행하나요? (답: 7절)
          </p>
          <p>
            C의 검사 결과에 client 파일 버전이 없습니다. 기존 통과 기록을 새
            결과에 붙여도 될까요? (답: 5절)
          </p>
          <p>
            다음에는 주의하자는 문장만 저장했습니다. 어떤 관측과 재검사 정보가
            더 필요할까요? (답: 8절)
          </p>
        </div>
      </section>
    </div>
  );
}

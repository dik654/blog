import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RunContractViz } from "../llm-harness/viz/ModernHarnessViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 무엇을 보면 끝났다고 할 수 있을까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            화면을 보기 좋게 고쳐 달라는 요청만으로는 언제 멈출지 결정하기 어렵습니다. 색을 바꾸거나 간격을 줄인 뒤 잘 됐다고 말할 수는 있지만 처음 문제가 해결됐는지 확인할 기준이
            없기 때문입니다.
          </p>
          <p>
            작업 전에 원하는 변화와 그 변화를 확인할 방법을 함께 적습니다. 읽을
            자료, 바꿀 수 있는 범위, 남길 결과, 실패했을 때 이어갈 위치까지
            있으면 다른 실행이 작업을 이어받아도 같은 끝을 향해 갈 수 있습니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 요청을 실행 조건과 결과 확인으로 연결합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청을 받은 자리는 목표와 완료 조건을 정합니다. 다음 자리는 읽을
            자료와 변경 범위를 확인하고 일을 진행합니다. 마지막 자리는 결과를
            검사해 완료 또는 미완료를 기록합니다.
          </p>
          <p>
            이 기록은 대화가 끝나도 남아 있어야 합니다. 다음 실행이 시작하면
            지난 설명만 읽는 대신 실제 변경과 검사 결과를 맞춰 봅니다. 이제 작은
            화면 수정 작업에 이 흐름을 넣어 보겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>목표와 끝을 정한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>자료와 허용 범위를 찾는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>결과를 만들고 검사한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>다음 실행에 기록을 남긴다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 두 화면에서 넘침이 없어야 끝입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            폭 390px에서 문서가 430px여서 40px가 넘칩니다. 1440px에서도 정상인지
            함께 확인한다고 정합니다. 파일 1개만 수정하고 검사 재시도는 최대 2회
            허용합니다. 이 값들은 학습용 가정입니다. (가정)
          </p>
          <p>
            완료 조건은 두 화면에서 문서 폭이 각각 화면 폭을 넘지 않고 기존 버튼 동작도 유지하는 것입니다. 허용된 파일은 /repo/page.css이며 결과로 변경 파일과 두 화면
            측정값을 남깁니다. 모호한 개선 요청을 확인할 수 있는 결과로 바꿨습니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-contract"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 목표와 검사 대상은 같은 변경을 가리켜야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원하는 변화에는 가로 넘침 제거를 적습니다. 완료 조건에는 두 화면 폭과 버튼 동작을 적고 읽을 자료에는 화면 규칙과 해당 파일 경로를 둡니다. 쓸 수 있는 범위는 그 파일
            1개입니다. (가정)
          </p>
          <p>
            결과 기록은 파일의 어느 버전을 검사했는지 연결합니다. 검사 뒤 파일이 바뀌면 이전 통과 기록을 새 결과에 붙일 수 없습니다. 실행 조건과 결과 기록은 같은 대상과 버전을
            가리켜야 합니다.
          </p>
        </div>
      </section>

      <section id="why-contract" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 기록이 비면 이어받은 작업이 추측합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작업이 중단됐는데 파일만 남아 있으면 다음 실행은 수정이 끝났는지, 두
            화면 검사를 했는지 알 수 없습니다. 반대로 검사 통과라는 문장만
            남으면 어떤 파일을 확인했는지 알 수 없습니다.
          </p>
          <p>
            그래서 변경과 검사를 하나의 실행에 묶고 실패 이유와 다음 행동도 남깁니다. 파일 1개라는 범위가 있어야 다른 곳을 임의로 바꾸는 일도 막을 수 있습니다. 각 항목이 맡는 일을
            알았으니 이름을 붙여 보겠습니다. (가정)
          </p>
        </div>
      </section>

      <section id="contract" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 한 작업의 목표·권한·증거를 함께 기록합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 번의 실행이 지켜야 할 조건을 agent run contract라고 부릅니다. 이 글에서 쓰는 설계 이름이며 모든 제품이 동일한 형식을 제공한다는 뜻은 아닙니다. 다음
            항목들이 같은 실행과 결과를 가리키는지 확인합니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Objective",
              description: "달성하려는 변화입니다.",
              boundary: "좋아진다는 말만으로 완료 여부를 판단할 수 없습니다.",
            },
            {
              term: "Acceptance",
              description: "변화가 이루어졌는지 확인하는 조건입니다.",
              boundary: "검사하지 않은 범위까지 성공으로 확대하지 않습니다.",
            },
            {
              term: "Context path",
              description: "이번 작업이 읽을 정본 자료의 위치입니다.",
              boundary: "문서를 읽는 권한과 변경 권한은 다릅니다.",
            },
            {
              term: "Capability",
              description: "실행 주체에게 실제로 허용된 자원과 작업입니다.",
              boundary:
                "도구 이름을 알고 있다는 사실로 권한이 생기지 않습니다.",
            },
            {
              term: "Artifact",
              description: "실행 밖에도 보존되는 변경 파일과 결과입니다.",
              boundary: "현재 파일과 다른 버전의 검사 결과를 섞지 않습니다.",
            },
            {
              term: "Verifier and recovery",
              description: "완료 판정과 실패 뒤 재시도·복구·인계 방법입니다.",
              boundary: "그럴듯한 완료 문장은 검사 결과가 아닙니다.",
            },
          ]}
        />
        <RunContractViz />
      </section>

      <section
        id="context-capability"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          7. 같은 파일을 고치고 두 폭을 검사해 넘깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행 기록 run=layout-1에 목표와 /repo/page.css의 시작 버전을 넣습니다. 문서 읽기는 자료를 찾는 행동이고 파일 쓰기는 별도 capability 검사
            대상입니다. 자료를 읽었어도 다른 파일을 쓸 권한은 생기지 않습니다. (가정)
          </p>
          <p>
            수정 결과를 patch=v2로 저장한 뒤 390px와 1440px에서 그 버전을
            검사합니다. 반환값이 document=390과 document=1440이고 버튼도
            동작하면 acceptance를 충족합니다. 결과에는 v2, 두 측정값, 검사
            시각을 연결합니다. (가정)
          </p>
          <p>
            390px에서 여전히 410px이면 넘침은 20px가 남습니다. 완료 대신
            미완료로 기록하고 남은 재시도 1회와 수정 대상 위치를 넘깁니다.
            기록을 읽는 다음 실행은 이 결과를 다시 확인한 뒤 이어갑니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="artifact-continuity"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 완료 문장과 실제 환경의 결과를 분리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 AND 식은 필수 조건을 한꺼번에 요구하는 이 글의 설계 검사입니다.
            목표·완료 조건·자료·권한이 있어도 검사와 복구 기록 계획이 비면
            마지막 항은 0입니다. 1∧1∧1∧1∧0=0이므로 준비가 끝났다고 보지
            않습니다.
          </p>
          <p>
            항목이 적혔는지 검사하는 것과 내용이 타당한지 확인하는 것은
            다릅니다. 전부 1이어도 화면 검사 자체가 잘못됐으면 결과를 신뢰할 수
            없습니다.
          </p>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>자료를 찾는 진입 문서에는 정본 위치와 관리 담당자, 갱신 시점, 정본을 읽지 못했을 때의 대체 경로를 둡니다. 자료의 버전이 현재 작업과 맞지 않으면 확인한 범위까지만 쓰고 담당자나 대체 자료로 다시 검증합니다. 찾지 못한 내용을 추측으로 채우지 않습니다.</p>
        </div>
        <ExplainedFormula
          question="필수 contract field가 하나라도 비면 run을 시작해도 되나요?"
          idea={
            <p>
              필수 항목의 존재 여부를 AND로 묶어 목표만 있고 verifier나
              recovery가 없는 run을 admission 전에 막습니다.
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
        <div id="paper-run-outcome" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Anthropic — Demystifying evals for AI agents, The structure of an evaluation"
            citeKey={1}
            href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
          >
            <q>the final state in the environment</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              공식 문서는 outcome을 실행 뒤 환경의 실제 상태로 정의합니다. 이
              사례의 outcome은 완료됐다는 마지막 문장이 아니라 v2 페이지의 두
              폭과 버튼 동작입니다. 같은 원칙을 인계에도 적용해 다음 실행이 파일
              버전과 결과를 다시 확인하게 합니다. (가정)
            </p>
          </div>
        </div>
      </section>

      <section
        id="recovery-handoff"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 시간 초과만으로 다시 실행하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시간 초과는 결과를 제때 받지 못했다는 사실입니다. 파일 저장이 실제로
            실패했는지는 별도로 확인합니다. 현재 버전과 기록을 조회한 뒤 같은
            변경을 다시 해도 안전한지, 이전 상태로 되돌려야 하는지, 다른
            담당자의 판단이 필요한지 결정합니다.
          </p>
          <p>
            완료 조건도 바뀔 수 있습니다. 새 요구가 생기면 조건의 버전을 바꾸고
            기존 검사가 무엇을 보장하는지 다시 판단합니다. 조건을 몰래 바꾸어
            이미 실패한 결과를 통과로 만들지는 않습니다.
          </p>
          <p>
            이 글의 두 폭·2회 재시도는 설명용 선택입니다. 실제 기준은 서비스의
            화면 범위와 변경 위험에 맞춰 정합니다.
          </p>
        </div>
        <ContentBoundary article="agent-run-contract" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 기록에서 빠진 항목을 찾아보세요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            390px에서 문서가 410px입니다. 넘침은 얼마이며 완료로 기록할 수
            있나요? (답: 7절)
          </p>
          <p>
            검사는 v2에서 통과했지만 지금 파일은 v3입니다. 어떤 연결을 다시
            확인해야 하나요? (답: 4절)
          </p>
          <p>
            목표와 권한은 있지만 실패 뒤 이어갈 기록 계획이 없습니다. AND 검사와
            실제 품질 검사는 각각 무엇을 말하나요? (답: 8절)
          </p>
        </div>
      </section>
    </div>
  );
}

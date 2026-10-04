import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { HarnessBoundaryViz } from "./viz/ModernHarnessViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 답을 잘 만드는 능력과 일을 제대로 끝내는 구조를 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            특정 문구를 정해진 횟수만큼 출력해 달라는 간단한 요청도 한 번 더
            쓰거나 설명을 덧붙이면 실패합니다. 더 복잡한 작업에서는 잘못된
            대상에 쓰거나, 실행되지 않은 일을 끝났다고 말하는 오류도 생깁니다.
          </p>
          <p>
            모델이 다음 행동을 제안하더라도 실제 권한과 결과를 확인하는 실행
            구조가 필요합니다. 모델에게 판단을 맡길 부분과 정해진 규칙대로
            처리할 부분을 나누면 무엇이 실패했고 어느 부분을 고칠지 더
            분명해집니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 목표를 읽고 실행을 통제하며 실제 결과를 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청을 읽어 원하는 결과와 조건을 정합니다. 필요한 자료를 찾아 다음
            행동을 제안하고 실행 담당자가 권한과 대상을 확인해 처리합니다.
            마지막으로 결과를 검사하고 미완료 부분을 다음 시도에 돌려줍니다.
          </p>
          <p>
            정확히 정해진 결과를 만드는 간단한 요청은 불확실한 생성 과정 없이
            처리할 수도 있습니다. 그렇다고 모든 요청을 고정 규칙에 밀어 넣으면
            사용자가 원한 내용을 잃습니다. 어느 경로를 고를지 작은 반복 출력
            사례로 보겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>원하는 결과와 조건을 읽는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>판단이 필요한 일을 제안한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>허용된 범위에서 실행한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>실제 결과를 검사하고 기록한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. PING을 정확히 32번 출력합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청은 PING이라는 문자열을 공백으로 구분해 정확히 32번 출력하라는
            것입니다. 다른 설명은 붙이지 않습니다. 작은 문자열을 따라가는 이
            요청은 프로젝트 측정 기록의 exact-32 조건과 같습니다. 출력 검산의
            전개는 설명을 위한 예입니다.
          </p>
          <p>
            PING은 4글자이므로 문자열 부분은 4×32=128글자입니다. 사이의 공백은
            31개라서 전체 길이는 159글자입니다. 마지막에 공백이나 설명을
            덧붙이면 이 형식과 달라집니다. 개수뿐 아니라 실제 문자열과 구분
            방식도 함께 확인해야 합니다.
          </p>
          <p>
            반복할 내용과 횟수가 전부 정해졌다는 점이 핵심입니다. 32개 문장의
            사실 여부를 조사하라는 요청이라면 같은 방식으로 내용까지 만들어 낼
            수 없습니다.
          </p>
        </div>
      </section>

      <section
        id="inside-harness"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 판단·권한·실행·결과 기록이 서로 다른 자리입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청을 읽는 자리는 문자열·횟수·구분자가 완전히 정해졌는지 봅니다.
            정해졌다면 반복 결과를 만들고 조건에 맞는지 검사합니다. 그렇지 않은
            부분이 있으면 필요한 자료와 함께 모델이 판단하게 합니다.
          </p>
          <p>
            파일 변경이나 외부 호출이 필요한 요청이라면 현재 주체와 대상에 대한
            권한 검사가 추가됩니다. 결과에는 실행한 작업과 실제 반환값을
            남깁니다. 마지막 문장을 쓰는 과정에서도 이미 확인한 숫자와 식별자가
            바뀌지 않아야 합니다.
          </p>
        </div>
      </section>

      <section id="why-harness" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 계산 성공은 입력 사실의 정확성을 보장하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            반복할 문자열과 32라는 수를 이미 확인했다면 프로그램이 그 형태를
            정확히 만들 수 있습니다. 반대로 무엇을 32개 골라야 하는지 판단해야
            한다면 개수만 맞춰서는 요청을 해결한 것이 아닙니다.
          </p>
          <p>
            금액 계산도 같습니다. 덧셈이 맞더라도 잘못된 문서에서 가져온
            금액이면 결과는 틀립니다. 관측한 사실, 계산한 값, 생성한 설명, 외부
            상태 변경을 나누어야 각 단계가 무엇을 보장하는지 알 수 있습니다.
            이제 이 실행 구조의 이름을 붙입니다.
          </p>
        </div>
      </section>

      <section
        id="agent-scaffold"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="operation-roles" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 모델 밖에서 실행을 이어 주는 하네스입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력을 준비하고 도구 호출과 결과 처리를 이어 주는 실행 시스템을 LLM
            harness라고 부릅니다. 반복과 상태 관리를 강조할 때 agent
            scaffold라는 이름도 씁니다. 구체적인 구조와 용어 경계는 제품마다
            다를 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Model",
              description: "현재 입력에서 다음 행동과 내용을 제안합니다.",
              boundary: "제안이 권한이나 실제 실행 결과를 뜻하지 않습니다.",
            },
            {
              term: "Runtime",
              description: "실행 주체·대상·작업·현재 허용 조건을 확인합니다.",
              boundary: "형식이 올바른 요청도 권한이 없으면 실행하지 않습니다.",
            },
            {
              term: "Executor",
              description: "허용된 작업을 파일·함수·외부 서비스에 적용합니다.",
              boundary:
                "서버의 응답 실패만으로 외부 변경 여부를 알 수는 없습니다.",
            },
            {
              term: "Observation",
              description:
                "성공·오류·실제 변경·검사 결과를 다음 판단에 돌려줍니다.",
              boundary: "모든 실패를 빈 문자열 하나로 합치지 않습니다.",
            },
            {
              term: "Observation selector",
              description:
                "허용된 자료에서 현재 상태와 근거를 읽는 역할입니다.",
              boundary: "관측하지 않은 사실을 임의로 채우지 않습니다.",
            },
            {
              term: "Deterministic transform",
              description: "확인한 입력을 계산·정렬·형식화하는 역할입니다.",
              boundary: "계산 성공은 입력의 사실성을 증명하지 않습니다.",
            },
            {
              term: "Creative artifact",
              description:
                "여러 표현이 가능한 문서·설명 같은 결과를 만드는 역할입니다.",
              boundary: "독립된 품질·사실 검사가 필요합니다.",
            },
            {
              term: "State mutation",
              description:
                "파일이나 외부 자원의 상태를 실제로 바꾸는 역할입니다.",
              boundary: "권한·대상·중복 효과·복구 조건을 확인합니다.",
            },
            {
              term: "Harness quality",
              description:
                "도구 설명·오류 전달·검사·복구가 작업을 얼마나 정확하게 지원하는지입니다.",
              boundary:
                "같은 모델이어도 구조가 달라지면 성능과 비용이 달라질 수 있습니다.",
            },
          ]}
        />
        <HarnessBoundaryViz />
      </section>

      <section
        id="proposal-runtime"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <span id="feedback-loop" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          7. 32개가 정해졌을 때만 고정된 출력 경로를 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력을 literal=PING, expected_count=32, separator=공백으로
            해석했다고 합시다. 요청 전체가 이 동작만 요구하는지 먼저 확인합니다.
            일부 단어만 맞는다고 사용자의 다른 요구를 버리지 않습니다. 해석
            방식의 설명은 가정입니다. (가정)
          </p>
          <p>
            조건이 맞으면 PING 32개 사이에 공백 31개를 넣습니다. 결과의 항목 수
            32와 각 항목 PING, 전체 길이 159를 검사하고 추가 문장이 없는지
            확인합니다. 여기서는 내용 자체가 정해져 있어 별도의 모델 호출이 필요
            없습니다.
          </p>
          <p>
            반복 조건이 맞지 않으면 일반 생성 경로로 돌아갑니다. 출력 개수만
            고정해도 내용 판단이 남아 있는 요청은 모델과 근거 검사를 계속
            사용합니다. 모델을 덜 부르는 것보다 요청의 뜻을 보존하는 것이
            먼저입니다.
          </p>
        </div>
      </section>

      <section
        id="artifact-repair"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 독립 검사에서 실패한 부분만 고칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공개 Anthropic 하네스 글의 feature list 예제는 기능에 필요한 동작을
            steps로 적고 passes를 false로 시작합니다. 다음 짧은 원문은 모델의
            완료 선언과 별개로 검사 상태를 남기는 항목입니다.
          </p>
        </div>
        <div id="paper-effective-agents" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Anthropic — Effective harnesses for long-running agents, Feature list"
            citeKey={1}
            href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
          >
            <q>"passes": false</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              이 반복 출력 사례에서는 32개·PING 일치·공백 31개·추가 설명
              없음이라는 검사를 통과하기 전까지 passes를 false로 둡니다. 원문
              예제 자체는 채팅 기능 검사이며 이 글은 같은 완료 기록 원칙을 반복
              출력에 적용한 것입니다. 원문 코드를 이 예로 바꾸어 인용하지
              않았습니다.
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="Typed artifact를 독립 검사와 targeted patch로 교정하는 절차"
          input={[
            "사용자 목표와 acceptance condition",
            "현재 source·artifact·environment observation",
            "typed artifact schema와 independent validators",
            "허용된 patch scope·retry budget·effect policy",
          ]}
          steps={[
            {
              code: "contract ← clarify(goal, acceptance, missing_inputs)",
              note: "완료 조건과 비어 있는 입력을 먼저 고정합니다.",
            },
            {
              code: "evidence ← observe(allowed_sources, current_artifact)",
              note: "추측 대신 현재 상태를 읽고 source identity를 보존합니다.",
            },
            {
              code: "artifact ← write_typed(contract, evidence)",
              note: "자유문자열만 넘기지 않고 필수 field와 역할을 구조화합니다.",
            },
            {
              code: "violations ← validate_independently(artifact, contract)",
              note: "Writer의 self-report와 분리된 schema·render·test·reader 검사를 실행합니다.",
            },
            {
              code: "patch ← repair_only(artifact, violations, observed_context)",
              note: "전체를 다시 생성하지 않고 실패한 field·구간만 수정합니다.",
            },
            {
              code: "receipt ← revalidate(patch, unchanged_invariants)",
              note: "고친 위반과 기존에 통과한 항목의 회귀를 함께 확인합니다.",
            },
          ]}
          repeatUntil="필수 validator가 모두 통과하거나 retry budget이 끝나 사람에게 근거·미완료 항목과 함께 넘길 때까지 반복합니다."
          output="versioned artifact + validator receipt + unresolved violations"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            반복 결과가 31개라면 실패한 개수 조건을 고치고 문자열·구분자·추가
            설명 조건도 다시 확인합니다. 복잡한 문서에서는 형식과 사실, 화면
            검사를 별도로 적용합니다. 같은 모델이 초안을 다시 읽는 것만으로
            독립적인 확인이 되지는 않습니다.
          </p>
        </div>
      </section>

      <section id="model-change" data-teach-level="7" className="scroll-mt-20">
        <span id="harness-quality" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          9. 하나의 측정으로 모델 전체를 평가하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            프로젝트의 2026-08-21 기록에서 raw model의 exact-32 검사는
            qwen36-27b-fp8이 27/27, qwen35-9b가 0/27입니다. 반복 출력 경로를
            고정 규칙으로 옮긴 뒤 9B 구성도 같은 exact case 27/27과 표현 변형
            135/135를 통과했다고 기록됐습니다. 이 수치는 기존 측정 기록이며 이번
            글 수정에서 새로 실험한 결과가 아닙니다.
          </p>
          <p>
            두 모델은 크기뿐 아니라 세대와 정밀도도 다릅니다. 고정된 문자열
            출력을 모델 밖에서 처리한 결과는 작은 모델의 일반 추론이 더 좋다는
            뜻이 아닙니다. 이 사례에서 보이는 변화는 판단이 필요 없는 형식
            작업의 담당을 바꿨다는 것입니다.
          </p>
          <p>
            모델이 개선되면 불필요한 보정이 되었는지도 검토합니다. 같은 입력에서
            장치 하나를 제거하고 정확성·호출 수·시간·새 실패를 비교합니다. 실행
            권한과 실제 변경 확인은 모델의 언어 능력과 별개이므로 그 책임을
            모델의 말에 넘기지 않습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Office Secretary의 9B·27B 실측은 무엇을 보여 주고, 무엇은 말하지 않나요?"
          preview="Raw model의 우위와 agent system의 최종 품질은 다르며, 결정적인 형식 문제는 runtime으로 옮길 수 있었습니다."
        >
          <p>
            2026-08-21의 strict-count fixture에서 <code>qwen36-27b-fp8</code>은
            27/27, <code>qwen35-9b</code>은 0/27이었습니다. 두 checkpoint는
            크기뿐 아니라 세대와 FP8 여부도 달라 “27B가 항상 낫다”는 비교로 읽을
            수 없습니다.
          </p>
          <p>
            같은 exact-32 요구를 deterministic renderer로 옮기자 9B 구성의
            agent도 exact case 27/27과 표현 변형 135/135를 통과했고 그 slice의
            model call, tool call과 token은 0이 됐습니다. 이는 작은 model의 일반
            추론 우위를 뜻하지 않습니다. Model이 판단할 필요가 없는
            cardinality·serialization을 runtime owner에게 옮기면 해당 실패
            class를 model scale과 분리할 수 있다는 한 controlled fixture입니다.
          </p>
          <p>
            원문 환경과 표는{" "}
            <a href="https://github.com/dik654/ojs-agents/blob/c6b0fb756aa66a33e9f0b1cd4a53c2ee1202a618/products/office-secretary/experiments/MODEL_SIZE_DECISION.md">
              project measurement record
            </a>
            에 고정돼 있습니다. 원 저장소는 접근 권한이 필요할 수 있습니다. 이
            글에서는 2026-10-04에 인증된 원문을 확인했으며 측정을 새로 실행한
            것은 아닙니다.
          </p>
        </ProgressiveDetail>
        <ContentBoundary article="llm-harness" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 어디까지 고정 규칙으로 처리할 수 있을까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PING 32개를 공백 하나로 연결하면 공백 수와 전체 글자 수는 각각
            얼마인가요? (답: 3절)
          </p>
          <p>
            32개의 사실을 조사해 쓰라는 요청도 같은 반복 출력 규칙으로 처리할 수
            있나요? (답: 5절)
          </p>
          <p>
            고정 출력 경로에서 27/27을 통과했다는 결과가 9B 모델의 일반 추론
            우위를 뜻하나요? (답: 9절)
          </p>
        </div>
      </section>
    </div>
  );
}

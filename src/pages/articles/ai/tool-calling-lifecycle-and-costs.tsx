import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ToolCallingLifecycleAndCostsViz from "./tool-calling-lifecycle-and-costs/viz/ToolCallingLifecycleAndCostsViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import {
  codeRefs,
  fileTrees,
} from "./tool-calling-lifecycle-and-costs/codeRefs";

export default function Article() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 답을 만들기 위해 외부에서 실제 값을 가져옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금 세 도시의 날씨를 비교해 달라는 요청에는 최신 관측이 필요합니다.
            모델이 문장을 잘 만들어도 현재 기온을 스스로 관측한 것은 아닙니다.
            필요한 조회를 선택하고 외부 실행 결과를 받아야 합니다.
          </p>
          <p>
            이 왕복에는 작업 선택, 입력값 작성, 실제 실행, 결과 연결이 있습니다.
            왕복이 늘면 기다리는 시간과 다시 읽는 정보도 늘어납니다. 이 글은 세
            도시를 조회하면서 정확성·시간·입력 길이를 함께 셉니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 필요한 조회를 골라 실행하고 결과를 다시 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모델에게 가능한 조회의 이름과 사용법을 알려 줍니다. 모델은 어느
            조회를 어떤 값으로 부를지 제안합니다. 실행 담당자는 요청을 확인해
            외부 기능을 실행하고 그 결과를 원래 요청에 연결해 돌려줍니다.
          </p>
          <p>
            돌아온 정보가 부족하면 다음 조회를 고릅니다. 처음 질문에 이미 답할
            수 있으면 조회 없이 답할 수도 있습니다. 이 큰 흐름에서 실제 일을
            하는 자리와 제안을 만드는 자리를 구분해 둡니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>가능한 기능을 알린다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>조회와 입력값을 고른다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>허용된 조회를 실행한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>결과를 원래 요청에 연결한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 세 도시를 각각 400ms 동안 조회합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            서울·부산·제주의 조회가 각각 400ms 걸리고 세 조회가 서로
            독립적이라고 합시다. 하나씩 실행하면 조회 시간 합은 1,200ms, 동시에
            실행하면 마지막 조회가 끝나는 약 400ms를 기다립니다. 실제 측정이
            아닌 가정이며 모델의 생성 시간과 통신·정리 비용은 여기서 뺐습니다.
            (가정)
          </p>
          <p>
            가능한 기능은 10개이고 이름·설명에 40단위, 입력 형식에 160단위를
            쓴다고 합시다. 기능 설명만 10×(40+160)=2,000단위입니다. 앞서 받은
            결과 2개가 각각 150단위이고 별도 실행 안내가 354단위면 부분합은
            2,654단위입니다. 이 길이도 가정입니다. (가정)
          </p>
          <p>
            세 조회를 빠르게 실행하는 일과 다음 요청에서 읽을 양을 줄이는 일은
            다른 최적화입니다. 이제 왕복 안에서 누가 이 값들을 보관하는지
            살펴봅니다.
          </p>
        </div>
      </section>

      <section
        id="inside-tool-call"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 선택된 이름과 실행 결과를 식별자로 연결합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기능 목록에는 이름, 언제 쓰는지, 어떤 입력이 필요한지를 둡니다.
            모델이 고른 이름은 실행할 함수나 서버에 연결합니다. 입력값은 형식과
            권한을 검사한 뒤 그 함수에 전달합니다.
          </p>
          <p>
            실행 결과에는 원래 요청의 식별자가 붙습니다. 세 도시가 다른 순서로
            끝나도 서울의 결과가 부산 요청에 붙지 않게 하기 위해서입니다. 성공
            결과뿐 아니라 실행하지 못한 이유도 같은 요청에 연결합니다.
          </p>
        </div>
      </section>

      <section id="why-tool-call" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 맞는 모양과 맞는 대상은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            도시 이름이 문자열이어야 한다는 조건을 지켜도 부산을 요청받고 서울을
            넣을 수 있습니다. 형식이 맞는지 검사하는 것과 사용자의 의도에 맞는지
            확인하는 것은 별개입니다. 실행 권한은 그 뒤에도 따로 확인합니다.
          </p>
          <p>
            세 조회가 서로 독립적이면 동시에 실행할 수 있지만 첫 결과에서 얻은
            주소로 두 번째 조회를 해야 한다면 순서가 필요합니다. 여러 호출이 한
            응답에 들어왔다는 사실만으로 동시에 실행해도 된다는 보장은 없습니다.
            이름과 실행의 역할을 나눴으니 표준 용어로 연결합니다.
          </p>
        </div>
      </section>

      <section
        id="selection-and-routing"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="problem" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 선택·인자·실행·반환의 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            외부 기능을 고르고 구조화된 입력으로 실행을 요청하는 방식을 tool
            calling 또는 function calling이라고 부릅니다. 여기서 모델이 하는
            일은 제안이며 실제 기능은 애플리케이션이나 서비스 제공자의 실행
            환경에서 수행합니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Tool selection",
              description:
                "기능 이름과 설명을 보고 현재 요청에 맞는 도구를 선택합니다.",
              boundary: "필요한 정보가 이미 있으면 호출하지 않을 수 있습니다.",
            },
            {
              term: "Routing",
              description: "선택한 이름을 실제 함수·서버에 연결합니다.",
              boundary:
                "동일 이름의 서로 다른 구현은 애플리케이션에서 구분해야 합니다.",
            },
            {
              term: "Argument generation / schema",
              description:
                "요구된 입력 형식에 맞추어 도시 같은 값을 작성합니다.",
              boundary:
                "형식 준수는 값의 사실성이나 사용자 의도를 보장하지 않습니다.",
            },
            {
              term: "Invocation",
              description: "실제 기능을 실행하는 단계입니다.",
              boundary: "실행 전에 현재 주체와 자원 권한을 확인합니다.",
            },
            {
              term: "Tool-use loop / multi-step tool use",
              description:
                "돌아온 결과를 다음 선택의 입력으로 쓰는 반복과 여러 단계 실행입니다.",
              boundary: "반복 자체가 오류를 자동으로 고치지는 않습니다.",
            },
            {
              term: "Parallel tool calling",
              description: "한 응답에서 여러 호출을 요청하는 방식입니다.",
              boundary:
                "동시 실행 여부와 의존 관계 확인은 실행 환경의 책임입니다.",
            },
            {
              term: "Dynamic tool loading",
              description:
                "이름·설명으로 후보를 좁힌 뒤 필요한 상세 형식만 불러옵니다.",
              boundary: "후보 검색이 틀리면 필요한 도구를 놓칠 수 있습니다.",
            },
            {
              term: "Token / context cost",
              description:
                "모델이 처리하는 입력 단위와 그 입력이 차지하는 양입니다.",
              boundary:
                "문자 수와 항상 같지 않고 입력 길이 부분합이 최종 청구액도 아닙니다.",
            },
            {
              term: "Client tool / server tool",
              description:
                "사용자 애플리케이션에서 실행하는 도구와 제공자 환경에서 실행하는 도구입니다.",
              boundary:
                "항상 사용자 host가 직접 실행한다는 일반화는 맞지 않습니다.",
            },
            {
              term: "Retry policy / exponential backoff",
              description:
                "재시도 가능한 실패·상한·대기 간격을 정하는 규칙입니다.",
              boundary:
                "권한 거부나 잘못된 인자를 기다리기만 해서는 고칠 수 없습니다.",
            },
          ]}
        />
        <ToolCallingLifecycleAndCostsViz />
      </section>

      <section id="tool-use-loop" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 세 호출의 결과가 다른 순서로 돌아와도 맞게 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모델이 get_weather(location=Seoul), get_weather(location=Busan),
            get_weather(location=Jeju)를 각각 c1·c2·c3이라는 식별자로 제안했다고
            합시다. 실행 환경은 각 입력과 권한을 확인한 뒤 세 조회를 시작합니다.
            (가정)
          </p>
          <p>
            부산 결과가 먼저 와도 c2에, 서울 결과는 c1에, 제주 결과는 c3에
            연결합니다. 모두 약 400ms에 끝난다는 가정에서는 조회 구간이 약
            400ms입니다. 전체 응답 시간에는 모델의 호출 생성과 결과 읽기,
            통신·스케줄링 시간도 더해집니다. (가정)
          </p>
          <p>
            서울 조회가 권한 거부였다면 c1에 거부 결과를 남깁니다. 부산과 제주
            결과를 서울 값처럼 돌려주지 않습니다. 필요한 조건을 새로 확인하거나
            그 도시를 조회하지 못했다고 알려 줍니다. 원래 요청과 결과가
            연결되어야 다음 판단도 올바르게 바뀝니다.
          </p>
        </div>
      </section>

      <section
        id="argument-generation-and-invocation"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 공식 반환 코드에서 호출 ID의 자리를 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Claude 공식 문서의 client tool 예제는 원 assistant 응답을 보존하고
            tool_result에 tool_use_id를 넣습니다. 아래 원문 9줄에서 변수
            이름이나 순서를 바꾸지 않았습니다. 전체 실행 프로그램은 아니며
            messages·response·tool_use·weather는 앞 코드에서 준비하는 값입니다.
          </p>
          <p>
            사례의 서울 호출에서는 tool_use.id=c1, weather=서울 조회 결과를
            넣습니다. 그러면 여섯 번째 줄의 반환 객체가 c1에 그 결과를
            연결합니다. 나머지 도시도 각 ID를 유지합니다. 세 결과를 한꺼번에
            반환할 때의 메시지 묶음은 병렬 호출 규칙에 맞춰 구성합니다. (가정)
          </p>
        </div>
        <CodeViewButton
          label="공식 tool_result 반환 코드 9줄"
          onClick={() => sidebar.open("result", codeRefs.result)}
        />
        <div id="paper-anthropic-tool-use" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Claude Platform Docs — Tool use with Claude, How tool use works"
            citeKey={1}
            href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
          >
            <q>tool_use_id</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              이 필드에 c1을 넣으면 실행 결과가 서울 요청에 연결됩니다. Client
              tool은 애플리케이션이 실행하고 server tool은 제공자 환경이
              실행하므로 같은 실행 위치로 묶지 않습니다. 공식 문서의 반환 구조를
              2026-10-04에 확인했습니다. (가정)
            </p>
          </div>
        </div>
        <div
          id="paper-openai-function-calling"
          className="prose prose-neutral max-w-none dark:prose-invert"
        >
          <p>
            OpenAI의{" "}
            <a href="https://developers.openai.com/api/docs/guides/function-calling">
              Function calling 문서
            </a>
            도 모델의 함수 호출 제안과 애플리케이션 실행, 결과 재입력을
            구분합니다. 제공자마다 메시지 필드 이름은 다르므로 서로 그대로
            복사하지 않습니다.
          </p>
        </div>
        <div
          id="paper-anthropic-parallel-tool-use"
          className="prose prose-neutral max-w-none dark:prose-invert"
        >
          <p>
            <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use">
              Claude 병렬 호출 문서
            </a>
            는 반환 결과를 각각의 호출 ID에 연결하도록 설명합니다. 실행하지 않은
            호출도 누락하지 말고 실패 상태를 해당 ID에 반환합니다.
          </p>
        </div>
      </section>

      <section id="context-cost" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          9. 2,654는 입력의 부분합이며 최종 요금이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작은 사례의 10개 기능 설명은 2,000 token, 이전 결과 2개는 300 token,
            별도 안내는 354 token입니다. 식에 넣으면 354+2,000+300=2,654
            token입니다. 도구 사용이 입력에 보태는 일부를 센 가정이며 사용자
            질문과 다른 대화 내용은 별도입니다. (가정)
          </p>
          <p>
            아래 식에는 생성한 호출·최종 답변의 출력 token, 다시 입력에 포함하는
            호출 이력, 서버 도구 자체의 사용료가 모두 들어 있지 않습니다. 캐시가
            적용된 입력의 요금도 별도로 볼 수 있습니다. 실제 비용은 제공자의
            usage와 가격 규칙을 확인합니다.
          </p>
          <p>
            2026-10-04 확인한 Claude 문서의 Sonnet 5 행은 도구가 하나 이상 있을
            때 auto·none의 추가 안내 354 token, any·tool의 474 token을
            제시합니다. 이 값은 도구 schema 크기를 포함하지 않는 별도 항이며
            다른 모델의 값으로 일반화하지 않습니다. 이 실제 문서 행을 작은
            사례의 추가 안내 값에 대응한 것입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Tool 10개를 등록한 요청에서 tool 자체가 차지하는 context token 은 어떻게 늘어날까요?"
          idea="이번 요청에 실제로 포함한 도구 설명과 이전 결과에, 선택한 서비스가 요구하는 별도 안내를 더합니다. 이 식은 그 입력 부분합만 셉니다."
          formula={String.raw`C_{tool}=C_{sys}+\sum_{i=1}^{n} s_i+\sum_{j=1}^{m} r_j`}
          annotatedFormula={String.raw`C_{tool}=\underbrace{C_{sys}}_{\text{고정 오버헤드}}+\underbrace{\sum_{i=1}^{n} s_i}_{\text{tool schema}}+\underbrace{\sum_{j=1}^{m} r_j}_{\text{이미 쌓인 결과}}`}
          operations={[
            {
              expression: String.raw`C_{sys}`,
              annotation: [
                "Tool 을 하나라도 등록하면 provider 가 추가하는",
                "model·tool_choice 별 고정 system-prompt token",
              ],
            },
            {
              expression: String.raw`\sum_{i=1}^{n} s_i`,
              annotation: [
                "등록한 tool n 개 각각의 이름·description·parameter",
                "JSON schema 가 차지하는 token 을 모두 더함",
              ],
            },
            {
              expression: String.raw`\sum_{j=1}^{m} r_j`,
              annotation: [
                "이전 단계에서 이미 받은 tool 결과 m 개가",
                "다음 요청에 다시 포함한 만큼 더함",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`C_{sys}`,
              name: "고정 system-prompt 오버헤드",
              description:
                "Tool 을 하나라도 등록하면 provider 가 추가하는 model 별 고정 token 입니다.",
            },
            {
              symbol: "n",
              name: "등록한 tool 개수",
              description: "이번 요청에 실을 tool 정의의 개수입니다.",
            },
            {
              symbol: "s_i",
              name: "i 번째 tool 의 schema token",
              description:
                "i 번째 tool 의 이름·description·parameter schema 가 차지하는 token 수입니다.",
            },
            {
              symbol: "m",
              name: "이미 쌓인 tool 결과 개수",
              description:
                "이전 단계까지 실행해 context 에 남아 있는 tool 결과의 개수입니다.",
            },
            {
              symbol: "r_j",
              name: "j 번째 tool 결과의 token",
              description:
                "j 번째 tool 결과가 다음 요청 context 에서 차지하는 token 수입니다.",
            },
          ]}
          assumptions={[
            String.raw`C_{sys}는 Anthropic 공식 가격표처럼 provider·model·tool_choice별로 고정된 값이며 이 글이 추정한 값이 아닙니다.`,
            String.raw`s_i·r_j는 tool마다 다르며, 이 글의 200 token/tool·150 token/결과 예시는 mechanism을 보여주는 계산된 가정입니다.`,
          ]}
          interpretation="n 이나 m 이 커질수록 사용자 질문과 무관한 tool 부기 token 이 늘어나고, 그만큼 지침·근거에 쓸 수 있는 실제 budget 은 줄어듭니다."
        />
        <p className="mt-4 text-sm text-muted-foreground">
          원문 표 위치:{" "}
          <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview#pricing">
            Pricing → Tool use system prompt tokens → Claude Sonnet 5
          </a>
          . 354 또는 474에 해당 요청의 schema·이력·출력 등을 별도로 더합니다.
        </p>
      </section>

      <section
        id="error-handling-and-retry"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 대기 간격을 늘리기 전에 반복해도 안전한지 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            인자가 잘못됐으면 인자를 고치고 권한이 없으면 권한 범위에 맞는
            행동을 선택합니다. 시간 초과나 일부 서버 오류는 일시적일 수 있지만
            외부 변경이 있었다면 실제 결과와 중복 실행 방지 조건을 먼저
            확인합니다. 오류 코드만으로 재시도를 허용하지 않습니다.
          </p>
          <p>
            대기 시작값 0.5초, 최대 2초, 최대 재시도 4회를 가정하면 k=0·1·2·3의
            대기는 0.5·1·2·2초입니다. 대기 합은 5.5초이며 실제 호출 시간은
            별도입니다. 혼잡한 환경에서는 무작위 지연을 섞거나 서버의 재시도
            안내를 따르는 정책도 필요합니다. (가정)
          </p>
        </div>
        <ExplainedFormula
          question="안전하게 반복할 수 있는 일시적 실패에서 대기 간격은 어떻게 늘어날까요?"
          idea="재시도할 때마다 대기 시간을 두 배로 늘리는 exponential backoff 로 연속 실패가 짧은 간격으로 계속 부딪히는 것을 막고, 상한과 최대 횟수로 무한 대기를 막습니다."
          formula={String.raw`d(k)=\min\left(b\cdot 2^{k},\ d_{max}\right),\quad k=0,\dots,k_{max}-1`}
          annotatedFormula={String.raw`d(k)=\min\Big(\underbrace{b\cdot 2^{k}}_{\text{지수적으로 늘어나는 대기}},\ \underbrace{d_{max}}_{\text{상한}}\Big)`}
          operations={[
            {
              expression: String.raw`b\cdot 2^{k}`,
              annotation: [
                "k 번째 재시도 전 대기 시간이",
                "실패할 때마다 두 배씩 늘어남",
              ],
            },
            {
              expression: String.raw`\min(\cdot,\ d_{max})`,
              annotation: [
                "아무리 늘어나도 상한 d_max 를 넘지 않게",
                "잘라 무한정 길어지는 것을 막음",
              ],
            },
            {
              expression: String.raw`k_{max}`,
              annotation: [
                "k 가 k_max 에 이르면 재시도를 멈추고",
                "typed error 로 다음 판단에 넘김",
              ],
            },
          ]}
          terms={[
            {
              symbol: "b",
              name: "기본 대기 시간",
              description: "첫 재시도 전 최소 대기 시간입니다.",
            },
            {
              symbol: "k",
              name: "재시도 순번",
              description: "0 부터 시작하는 재시도 횟수입니다.",
            },
            {
              symbol: String.raw`d_{max}`,
              name: "대기 시간 상한",
              description: "재시도가 반복돼도 넘지 않는 최대 대기 시간입니다.",
            },
            {
              symbol: String.raw`k_{max}`,
              name: "최대 재시도 횟수",
              description:
                "이 횟수에 이르면 자동 재시도를 멈춥니다. 외부 실행 여부가 불명확하면 그 상태를 보존합니다.",
            },
          ]}
          assumptions={[
            "Jitter(무작위 지연)를 더하는 구현도 흔하지만 이 글은 핵심 성장 규칙만 다룹니다.",
            String.raw`b, d_max, k_max 값은 시스템마다 다르며 이 글의 500ms · 2000ms · 4회 예시는 설명용 가정입니다.`,
          ]}
          interpretation="재시도 4번이면 대기 시간이 500 · 1,000 · 2,000 · 2,000ms이며 합은 5.5초입니다. 이 값은 호출 실행 시간을 포함하지 않습니다. 상한에 도달하면 중단하고 실행 결과의 확인 여부까지 반환합니다."
        />
        <AlgorithmBlock
          title="도구 호출을 처리하는 절차 (의사코드)"
          input={[
            "등록된 도구·권한·원래 호출 ID·입력값",
            "재시도 가능한 오류와 최대 횟수",
          ]}
          steps={[
            {
              code: "validate_arguments_and_permission(call)",
              note: "형식과 실행 허용 여부를 먼저 확인합니다.",
            },
            {
              code: "if denied: return_error_with_original_id",
              note: "다른 도구로 우회해 같은 금지 행동을 실행하지 않습니다.",
            },
            {
              code: "result ← invoke(call)",
              note: "실제 담당 환경에서 실행합니다.",
            },
            {
              code: "if transient_error and safe_to_repeat and retries_remain: wait(backoff); retry_same_operation",
              note: "변경 결과와 중복 방지를 확인한 안전한 경우만 반복합니다.",
            },
            {
              code: "return result attached to call.id",
              note: "성공·실패 모두 원래 호출과 연결합니다.",
            },
          ]}
          output="다음 모델 입력에 넣을 결과 또는 명시적 오류"
        />
      </section>

      <section id="sources" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          11. 형식 보장과 작업 성공은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OpenAI의 2024년 Structured Outputs 발표는 정해진 복잡한 schema
            평가에서 gpt-4-0613이 40% 미만, strict를 사용한 gpt-4o-2024-08-06이
            100%를 기록했다고 보고합니다. 이는 그 평가의 형식 준수 결과이며 모든
            모델·입력의 의미 정확도나 도구 권한 보장이 아닙니다.
          </p>
          <p>
            ReAct의 논문 결과는 관측을 다음 판단에 넣는 반복의 근거입니다.
            ALFWorld·WebShop의 보고된 성공률 개선을 이 세 도시 조회의 성능
            향상으로 옮겨 쓰지 않습니다. 이 글의 400ms와 token 길이는 계산을
            위한 가정이며 실제 호출을 측정하지 않았습니다.
          </p>
          <p>
            정확한 호출 ID와 권한, 입력 길이, 실행 시간을 나누어 보면 무엇을
            개선했는지 알 수 있습니다. 필요한 schema만 불러오면 입력을 줄일 수
            있지만 후보를 잘못 고를 위험이 남고 결과를 줄이면 다음 판단에 필요한
            근거를 잃을 수 있습니다.
          </p>
        </div>
        <div id="paper-openai-structured-outputs">
          <CitationBlock
            source="OpenAI — Introducing Structured Outputs in the API (2024)"
            citeKey={4}
            href="https://openai.com/index/introducing-structured-outputs-in-the-api/"
          >
            발표문의 schema 준수 평가 결과를 모델·기능·평가 조건과 함께
            읽습니다. 형식 준수는 실제 값과 실행 권한의 검증을 대신하지
            않습니다.
          </CitationBlock>
        </div>
        <div id="paper-react">
          <CitationBlock
            source="ReAct: Synergizing Reasoning and Acting in Language Models"
            citeKey={5}
            href="https://arxiv.org/abs/2210.03629"
          >
            외부 관측을 다음 행동 선택에 반영하는 연구입니다. 실험 조건의
            성공률과 이 글의 가정한 지연시간 계산은 별개입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="tool-calling-lifecycle-and-costs" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          12. 부분합과 전체 결과를 구분해 보세요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            400ms 조회 3개를 동시에 실행하면 왜 전체 사용자 응답도 반드시
            400ms라고 말할 수 없나요? (답: 7절)
          </p>
          <p>
            354+10×(40+160)+2×150은 얼마이며 그 값에 어떤 비용은 포함되지
            않았나요? (답: 9절)
          </p>
          <p>
            0.5초에서 시작해 2초로 제한한 4회 재시도의 대기 합은 얼마이며 권한
            거부에도 이 정책을 쓰나요? (답: 10절)
          </p>
        </div>
      </section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={fileTrees}
      />
    </div>
  );
}

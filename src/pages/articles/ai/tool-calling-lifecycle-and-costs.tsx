import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ToolCallingLifecycleAndCostsViz from "./tool-calling-lifecycle-and-costs/viz/ToolCallingLifecycleAndCostsViz";

/**
 * Tool calling 수명주기: 선택·인자 생성·호출 오류와 context 비용
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function ToolCallingLifecycleAndCostsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool calling 은 model 제안을 등록된 tool 실행 요청으로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool calling 은 model 이 다음에 할 일을 자유 텍스트 대신, 미리 등록해 둔 tool 하나를
            골라 그 tool 의 schema 에 맞는 인자로 실행을 요청하는 것입니다. Model 은 실행 권한이
            없고 제안만 하며, 그 제안을 실제로 실행해 결과를 돌려주는 것은 항상 host application 의
            역할입니다.
          </p>
          <p>
            OpenAI 는 이 메커니즘을 function calling 이라 부르고, Anthropic 은 tool use(또는 tool
            calling)라 부릅니다. 이름은 달라도 계약은 같습니다. Tool 마다 이름·설명·JSON schema 로
            된 parameter 를 등록해 두면, model 이 요청을 보고 tool 을 고르거나(selection) 아무
            tool 도 필요 없다고 판단해 그대로 답합니다.
          </p>
          <p>
            이 글은 그 다음부터를 순서대로 다룹니다. Tool 을 고르고 실제 handler 로 연결하는
            selection·routing, 고른 tool 의 schema 에 인자를 채워 호출하는 argument generation·
            invocation, 결과를 다시 다음 판단에 반영하는 tool-use loop, 그 등록·결과가 매 요청마다
            내는 context token 비용, 그리고 실패했을 때의 error handling·retry policy 까지입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Tool calling 수명주기: 선택부터 다음 step 까지"
          input={[
            "사용자 요청과 현재까지의 대화 state",
            "등록된 tool 목록(이름·설명·JSON schema)",
            "각 tool 의 실행 handler",
            "재시도 정책(backoff, 최대 횟수)",
          ]}
          steps={[
            { code: "candidate = select(request, tool_registry)", note: "이름·설명을 보고 필요한 tool 을 고르거나, 필요 없으면 tool 없이 답합니다." },
            { code: "if candidate is null: return direct_answer", note: "Tool 이 필요 없다고 판단하면 여기서 끝납니다." },
            { code: "args = generate_arguments(candidate.schema)", note: "고른 tool 의 JSON schema 에 맞춰 인자 값을 채웁니다." },
            { code: "result = invoke(candidate, args)", note: "Host application 이 실제 handler 로 실행합니다. Model 은 이 단계를 실행하지 않습니다." },
            { code: "if not valid(result): attempt += 1", note: "실행이 실패하거나 schema 를 어긴 결과면 실패로 기록합니다." },
            { code: "  if attempt < max_retries: wait(backoff(attempt)); retry invoke", note: "최대 횟수 안이면 backoff 뒤 재시도합니다." },
            { code: "  else: observation = typed_error(result)", note: "최대 횟수를 넘으면 재시도를 멈추고 typed error 로 다음 판단에 넘깁니다." },
            { code: "else: observation = typed_success(result)", note: "성공하면 typed 결과로 만듭니다." },
            { code: "state = state ∪ observation; candidate = select(state, tool_registry)", note: "관측을 state 에 더하고 다음 tool 선택으로 돌아갑니다." },
          ]}
          output="더 이상 tool 이 필요 없다고 판단될 때의 최종 응답"
          repeatUntil="select 가 tool 없음을 반환하거나 budget(최대 step 수)을 넘김"
        />
        <ToolCallingLifecycleAndCostsViz />
        <ContentBoundary article="tool-calling-lifecycle-and-costs" />
      </section>

      <section id="selection-and-routing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool selection 은 후보를 고르고 routing 은 그 결과를 handler 로 보냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool selection 은 model 이 등록된 tool 이름·설명을 보고 지금 요청에 맞는 tool 을
            고르는 판단입니다. 이 판단은 tool 의 description 문장 품질에 크게 좌우됩니다. 이름만
            보고는 구분되지 않는 두 tool 이 있다면, model 은 description 에 적힌 사용 시점과
            입력 형태로만 그 차이를 압니다.
          </p>
          <p>
            선택된 tool 이 실제로 어떤 코드나 서버로 실행되는지는 model 의 관심사가 아닙니다.
            Host application 이 tool 이름을 실제 handler·MCP server·내부 함수로 연결하는 과정이
            routing 입니다. 같은 이름의 tool 이 plugin 과 MCP 양쪽에 있으면 routing 규칙이 어느
            instance 로 보낼지 정해야 충돌이 나지 않습니다.
          </p>
          <p>
            등록된 tool 수가 많아지면 전체 schema 를 매 요청마다 context 에 넣는 대신, 이름·설명
            index 에서 후보를 먼저 좁히고 실제로 고른 tool 의 schema 만 그때그때 불러오는
            dynamic tool loading 을 씁니다.{" "}
            <Link to="/ai/agent-code-mode#tool-discovery">Code Mode 글</Link>이 이 선택적 schema
            loading 을 program 실행 맥락으로 확장한 사례를 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="선택·routing·dynamic loading 의 역할 차이"
          items={[
            { term: "Tool selection", description: "요청에 맞는 tool 후보를 이름·설명으로 고르거나, 필요 없으면 아무 tool 도 고르지 않습니다.", example: "\"서울 날씨\" 요청에서 get_weather 를 고르고 send_email 은 고르지 않습니다.", boundary: "Description 이 모호하면 비슷한 tool 두 개 중 잘못된 쪽을 고를 수 있습니다." },
            { term: "Tool routing", description: "선택된 tool 이름을 실제 handler·서버 instance 로 연결합니다.", example: "같은 이름의 tool 이 plugin 과 MCP 양쪽에 있으면 어느 instance 로 보낼지 정합니다.", boundary: "Routing 은 model 판단이 아니라 host application 의 배선입니다." },
            { term: "Dynamic tool loading", description: "전체 schema 대신 이름·설명 index 로 후보를 좁힌 뒤 선택된 tool 의 schema 만 불러옵니다.", example: "tool 200 개 중 이름 index 로 3개만 남기고 그 3개의 schema 만 context 에 넣습니다.", boundary: "Index 자체가 부정확하면 필요한 tool 후보가 처음부터 빠질 수 있습니다." },
          ]}
        />
      </section>

      <section id="argument-generation-and-invocation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool argument generation 은 JSON schema 에 맞춰 인자를 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool 을 고른 뒤 model 은 그 tool 의 JSON schema(type·required·enum 등)에 맞는 값을
            채워 인자를 만듭니다. 이 인자를 실제 함수·API·서버 호출로 전달해 실행하는 단계가
            invocation 이며, 이 실행도 model 이 아니라 host application 이 합니다.
          </p>
          <p>
            인자 생성은 항상 schema 를 완벽히 지키지는 않습니다. OpenAI 는 Structured Outputs 를
            발표하며, 복잡한 JSON schema 를 따르는 평가에서 기존 gpt-4-0613 의 function calling
            은 40 % 에도 못 미치는 정확도를 보였고, schema 준수를 강제하는 Structured Outputs 를
            쓴 gpt-4o-2024-08-06 은 100 % 를 기록했다고 보고했습니다.
          </p>
          <p>
            이 격차는 strict schema 강제 기능이 없거나 꺼져 있을 때, 필수 필드 누락·타입 불일치·
            존재하지 않는 enum 값 같은 실패가 드물지 않다는 뜻입니다. 그런 실패를 어떻게
            재시도하고 언제 포기할지는{" "}
            <Link to="#error-handling-and-retry">error handling·retry policy 절</Link>에서
            다룹니다.
          </p>
          <p>
            Invocation 자체가 성공해도 끝이 아닙니다.{" "}
            <Link to="/ai/claw-permissions#policy">Tool permission model 글</Link>이 다루듯,
            생성된 인자가 아무리 schema 에 맞아도 permission policy 가 그 호출을 deny 하면
            실행은 일어나지 않습니다.
          </p>
        </div>
      </section>

      <section id="tool-use-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool-use loop 은 이전 결과로 다음 tool 선택을 바꾸는 반복입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool 을 한 번만 부르고 끝나는 요청도 있지만, 여러 tool 을 거쳐야 답이 나오는 요청도
            있습니다. Tool-use loop 은 한 tool 의 결과를 다음 tool 선택의 입력으로 되먹이는
            반복이며, 여러 단계를 거치는 경우를 multi-step tool use 라 부릅니다.
          </p>
          <p>
            ReAct 논문은 이 되먹임이 왜 필요한지 보여 줍니다. Reasoning trace 와 tool action 을
            번갈아 생성하게 하자, HotpotQA·Fever 에서 hallucination 과 오류 전파가 줄었고,
            ALFWorld 는 강화학습 방법 대비 34 %p, WebShop 은 모방학습 방법 대비 10 %p 의 절대
            성공률 개선을 소량의 예시만으로 얻었다고 보고합니다.
          </p>
          <p>
            이전 결과가 다음 선택을 바꾸는 예를 보면, 파일을 읽는 tool 이 "파일 없음" 오류를
            돌려주면 같은 경로로 read_file 을 다시 부르는 대신 list_directory 를 먼저 불러 실제
            파일명을 확인하는 쪽으로 다음 tool 선택이 바뀝니다. 결과가 성공/실패 중 무엇인지가
            아니라 무엇을 몰랐는지를 알려 주기 때문입니다.
          </p>
          <p>
            서로 의존하지 않는 tool 여러 개는 한 단계씩 순차로 부를 필요가 없습니다. Model 이 한
            턴에 tool_use 블록 여러 개를 함께 돌려주면, host application 은 그 실행을 동시에
            돌릴지 순서대로 돌릴지 스스로 정할 수 있고 이것이 parallel tool calling 입니다.
          </p>
          <p>
            독립된 read 전용 tool 3개를 실행 1회당 400ms 가 걸린다고 하면, 순차 호출은 3 × RTT ≈
            1,200ms 가 걸립니다. Model 이 세 tool_use 블록을 한 턴에 함께 반환해 host 가 세 실행을
            동시에 돌리면 가장 늦게 끝나는 하나만 기다리면 되어 1 × RTT ≈ 400ms 로 줄어듭니다.
          </p>
        </div>
        <TermBreakdown
          title="한 번·여러 단계·동시 호출의 구분"
          items={[
            { term: "Tool-use loop", description: "한 tool 결과를 다음 tool 선택의 입력으로 되먹이는 반복 구조 자체입니다.", example: "read_file 결과의 오류 코드가 다음에 부를 tool 을 바꿉니다.", boundary: "결과를 typed 로 구분하지 못하면 되먹임이 다음 선택에 쓸모없는 신호가 됩니다." },
            { term: "Multi-step tool use", description: "여러 단계의 tool 호출을 거쳐야 최종 답이 나오는 경우입니다.", example: "파일 목록 조회 → 대상 파일 읽기 → 내용 요약 3단계.", boundary: "단계가 늘수록 각 단계 오류가 다음 단계로 전파될 위험도 커집니다." },
            { term: "Parallel tool calling", description: "서로 의존하지 않는 tool 여러 개를 한 model 턴에서 함께 요청합니다.", example: "날씨·환율·뉴스 조회 3개를 한 턴에 함께 반환.", boundary: "Side effect 가 있거나 순서에 의존하는 tool 은 병렬로 돌리면 안전하지 않습니다." },
          ]}
        />
      </section>

      <section id="context-cost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool schema 와 result 는 매 요청마다 context token 비용을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool 을 등록해 두면 그 tool 을 이번 턴에 쓰든 안 쓰든, 이름·description·parameter
            schema 가 매 요청 context 에 그대로 들어갑니다. 이 tool schema context cost 와, 이전
            단계에서 이미 받은 결과가 다음 요청에도 남아 차지하는 tool result context cost 를
            합친 것이 tool 사용의 전체 token 비용입니다.
          </p>
          <p>
            Anthropic 공식 가격 안내는 tool 을 하나라도 등록하면 model·tool_choice 별로 고정된
            system prompt token 이 추가된다고 밝힙니다. Claude Sonnet 5 는 tool_choice가 auto·
            none 이면 354 token, any·tool 로 특정 tool 호출을 강제하면 474 token 이 더해집니다.
            이 수치는 tools 파라미터 자체의 schema 크기는 포함하지 않은 별도 고정분입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Tool 10개를 등록한 요청에서 tool 자체가 차지하는 context token 은 어떻게 늘어날까요?"
          idea="Tool 사용을 켜면 고정된 system-prompt 오버헤드에, 등록한 tool 마다의 schema token 과, 이전 단계에서 이미 받은 tool 결과 token 이 그대로 매 요청에 더해집니다."
          formula={String.raw`C_{tool}=C_{sys}+\sum_{i=1}^{n} s_i+\sum_{j=1}^{m} r_j`}
          annotatedFormula={String.raw`C_{tool}=\underbrace{C_{sys}}_{\text{고정 오버헤드}}+\underbrace{\sum_{i=1}^{n} s_i}_{\text{tool schema}}+\underbrace{\sum_{j=1}^{m} r_j}_{\text{이미 쌓인 결과}}`}
          operations={[
            { expression: String.raw`C_{sys}`, annotation: ["Tool 을 하나라도 등록하면 provider 가 추가하는", "model·tool_choice 별 고정 system-prompt token"] },
            { expression: String.raw`\sum_{i=1}^{n} s_i`, annotation: ["등록한 tool n 개 각각의 이름·description·parameter", "JSON schema 가 차지하는 token 을 모두 더함"] },
            { expression: String.raw`\sum_{j=1}^{m} r_j`, annotation: ["이전 단계에서 이미 받은 tool 결과 m 개가", "다음 요청에도 그대로 남아 누적됨"] },
          ]}
          terms={[
            { symbol: String.raw`C_{sys}`, name: "고정 system-prompt 오버헤드", description: "Tool 을 하나라도 등록하면 provider 가 추가하는 model 별 고정 token 입니다." },
            { symbol: "n", name: "등록한 tool 개수", description: "이번 요청에 실을 tool 정의의 개수입니다." },
            { symbol: "s_i", name: "i 번째 tool 의 schema token", description: "i 번째 tool 의 이름·description·parameter schema 가 차지하는 token 수입니다." },
            { symbol: "m", name: "이미 쌓인 tool 결과 개수", description: "이전 단계까지 실행해 context 에 남아 있는 tool 결과의 개수입니다." },
            { symbol: "r_j", name: "j 번째 tool 결과의 token", description: "j 번째 tool 결과가 다음 요청 context 에서 차지하는 token 수입니다." },
          ]}
          assumptions={[
            String.raw`C_{sys}는 Anthropic 공식 가격표처럼 provider·model·tool_choice별로 고정된 값이며 이 글이 추정한 값이 아닙니다.`,
            String.raw`s_i·r_j는 tool마다 다르며, 이 글의 200 token/tool·150 token/결과 예시는 mechanism을 보여주는 계산된 가정입니다.`,
          ]}
          interpretation="n 이나 m 이 커질수록 사용자 질문과 무관한 tool 부기 token 이 늘어나고, 그만큼 지침·근거에 쓸 수 있는 실제 budget 은 줄어듭니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            숫자로 보면, tool 10개의 이름+description 에 평균 40 token, parameter schema 에 평균
            160 token 이 쓰인다고 가정하면 schema 합만 약 2,000 token 입니다. 여기에 Claude
            Sonnet 5 의 고정 354 token 과, 이전 두 단계에서 받은 결과(각 150 token)가 더해지면
            tool 관련 token 만 약 2,650 token 에 이릅니다.
          </p>
          <p>
            이 2,650 token 은 사용자 질문 내용과 무관하게 tool 을 등록하고 지금까지 실행한
            이력만으로 채워지는 몫입니다.{" "}
            <Link to="/ai/context-window-optimization#budget">Context window 최적화 글</Link>이
            다루는 source 별 token 장부에서, tool 은 system·retrieval·history 와 나란히 자기 몫을
            차지하는 또 하나의 source 입니다.
          </p>
        </div>
      </section>

      <section id="error-handling-and-retry" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tool 실패는 유형별로 나뉘고 retry policy 가 재시도 여부를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tool 실패는 한 가지가 아닙니다. 인자가 schema 를 못 맞춘 경우, 호출은 됐지만 실행
            자체가 오류를 낸 경우, 응답이 오지 않는 timeout, 그리고 permission policy 가 막은
            경우는 원인이 다르고 다음 대응도 달라야 합니다.{" "}
            <Link to="/ai/agent-loop-foundations#observation-contract">Agent loop 기초 글</Link>
            이 이 구분을 empty·denied·timeout·partial 같은 typed observation 으로 만드는
            계약을 다룹니다.
          </p>
          <p>
            재시도가 의미 있는 실패(일시적 timeout, 서버 500 오류)와 재시도해도 똑같이 실패할
            실패(잘못된 인자, permission denied)를 구분하지 않으면 재시도는 그저 같은 실패를
            반복할 뿐입니다. Retry policy 는 재시도할 실패 종류, 대기 간격을 늘리는 방식(exponential
            backoff), 그리고 포기하는 최대 횟수를 함께 정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="인자 생성이 schema 오류로 실패했을 때 재시도 간격은 어떻게 늘어날까요?"
          idea="재시도할 때마다 대기 시간을 두 배로 늘리는 exponential backoff 로 연속 실패가 짧은 간격으로 계속 부딪히는 것을 막고, 상한과 최대 횟수로 무한 대기를 막습니다."
          formula={String.raw`d(k)=\min\left(b\cdot 2^{k},\ d_{max}\right),\quad k=0,\dots,k_{max}-1`}
          annotatedFormula={String.raw`d(k)=\min\Big(\underbrace{b\cdot 2^{k}}_{\text{지수적으로 늘어나는 대기}},\ \underbrace{d_{max}}_{\text{상한}}\Big)`}
          operations={[
            { expression: String.raw`b\cdot 2^{k}`, annotation: ["k 번째 재시도 전 대기 시간이", "실패할 때마다 두 배씩 늘어남"] },
            { expression: String.raw`\min(\cdot,\ d_{max})`, annotation: ["아무리 늘어나도 상한 d_max 를 넘지 않게", "잘라 무한정 길어지는 것을 막음"] },
            { expression: String.raw`k_{max}`, annotation: ["k 가 k_max 에 이르면 재시도를 멈추고", "typed error 로 다음 판단에 넘김"] },
          ]}
          terms={[
            { symbol: "b", name: "기본 대기 시간", description: "첫 재시도 전 최소 대기 시간입니다." },
            { symbol: "k", name: "재시도 순번", description: "0 부터 시작하는 재시도 횟수입니다." },
            { symbol: String.raw`d_{max}`, name: "대기 시간 상한", description: "재시도가 반복돼도 넘지 않는 최대 대기 시간입니다." },
            { symbol: String.raw`k_{max}`, name: "최대 재시도 횟수", description: "이 횟수에 이르면 재시도를 멈추고 실패로 확정합니다." },
          ]}
          assumptions={[
            "Jitter(무작위 지연)를 더하는 구현도 흔하지만 이 글은 핵심 성장 규칙만 다룹니다.",
            String.raw`b, d_max, k_max 값은 시스템마다 다르며 이 글의 500ms · 8000ms · 4회 예시는 설명용 가정입니다.`,
          ]}
          interpretation="재시도 4번이면 대기 시간이 500 · 1,000 · 2,000 · 4,000ms 로 늘어나 최악의 경우 약 7.5초를 기다린 뒤에도 실패하면 더 반복하지 않고 typed error 로 확정합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Schema 오류나 permission denied 처럼 같은 인자로 다시 불러도 결과가 바뀌지 않는
            실패는 이 backoff 를 적용해도 소용이 없습니다. 그런 실패는 재시도 대신 model 에게
            바로 typed error 로 알려 인자를 고치거나 다른 tool 을 고르게 하는 쪽이 낫습니다.
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 OpenAI·Anthropic 공식 문서와 ReAct 논문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tool 정의·왕복 루프·가격은 OpenAI·Anthropic 공식 API 문서에서, tool-use loop 이 왜
            되먹임 구조여야 하는지는 ReAct 논문에서, JSON schema 준수 실패율은 OpenAI 의
            Structured Outputs 발표에서 가져왔습니다.
          </p>
        </div>
        <div id="paper-openai-function-calling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="OpenAI · Function calling (API 공식 문서)"
            citeKey={1}
            href="https://developers.openai.com/api/docs/guides/function-calling"
            type="code"
          >
            name·description·parameters(JSON Schema)·strict 로 구성된 tool 정의와, 요청→model
            의 tool call→application 실행→tool 결과 재입력→최종 응답이라는 5단계 왕복 루프,
            그리고 parallel_tool_calls 로 한 턴에 여러 함수를 호출하는 방식을 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-anthropic-tool-use" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Anthropic · Tool use overview (API 공식 문서)"
            citeKey={2}
            href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
            type="code"
          >
            input_schema 로 정의한 tool, tool_use·tool_result 블록으로 이어지는 왕복, strict
            tool use 로 schema 준수를 보장하는 방법을 정의하고, model 별 고정 system-prompt
            token 비용을 포함한 tool 사용 가격표를 제공합니다.
          </CitationBlock>
        </div>
        <div id="paper-anthropic-parallel-tool-use" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Anthropic · Parallel tool use (API 공식 문서)"
            citeKey={3}
            href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use"
            type="code"
          >
            한 assistant 턴에 여러 tool_use 블록이 담길 수 있고 실행 순서(동시·순차)는 호출자가
            정하며, 각 결과를 tool_use_id 로 맞춰 한 user 메시지에 모두 돌려주고 실행하지 않은
            호출도 is_error tool_result 로 채워야 한다는 계약을 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-react" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yao et al. · ReAct: Synergizing Reasoning and Acting in Language Models (2022)"
            citeKey={4}
            href="https://arxiv.org/abs/2210.03629"
          >
            Reasoning trace 와 tool action 을 번갈아 생성하는 ReAct 패턴을 제시하고,
            HotpotQA·Fever 에서 hallucination·오류 전파를 줄이며 ALFWorld·WebShop 에서 각각
            34%p·10%p 의 절대 성공률 개선을 소량의 in-context 예시만으로 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-openai-structured-outputs" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="OpenAI · Introducing Structured Outputs in the API (2024)"
            citeKey={5}
            href="https://openai.com/index/introducing-structured-outputs-in-the-api/"
            type="code"
          >
            복잡한 JSON schema 를 따르는 평가에서 기존 function calling(gpt-4-0613)은 40% 미만의
            정확도를 보인 반면, strict schema 를 강제하는 Structured Outputs(gpt-4o-2024-08-06)
            는 100%를 기록했다고 보고합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Model proposal 과 runtime 실행의 역할 분리, typed observation 계약은{" "}
          <Link to="/ai/agent-loop-foundations#overview">Agent loop 기초 글</Link>이 정본이고,
          여러 tool 왕복을 sandbox program 으로 접는 실행 패턴은{" "}
          <Link to="/ai/agent-code-mode#overview">Code Mode 글</Link>이 정본입니다. Tool 등록이
          만드는 context 예산 전체 계산은{" "}
          <Link to="/ai/context-window-optimization#budget">Context window 최적화 글</Link>이,
          tool 호출 자체의 승인·거부 정책은{" "}
          <Link to="/ai/claw-permissions#policy">Tool permission model 글</Link>이 정본입니다.
        </p>
      </section>
    </div>
  );
}

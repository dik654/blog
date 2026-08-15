import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { AgentLoopViz } from "./viz/ModernAgentPatternViz";

export default function AgentLoopArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Agent의 최소 단위는 답변이 아니라 상태 전이입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            일반 LLM 호출은 입력에서 출력을 한 번 만듭니다. Agent는 현재 작업 상태를 읽고 다음 action을 <strong>제안</strong>하며, runtime이 그 제안을 검사·실행한 결과를 다시 state에 넣습니다. 그래서 먼저 “무슨 pattern을 쓸까?”가 아니라 한 번의 transition에 누가 무엇을 소유하는지 고정해야 합니다.
          </p>
        </div>
        <TermBreakdown title="한 transition의 네 대상을 하나씩 정의합니다" description="용어를 먼저 분리한 뒤 아래 Viz에서 하나의 loop로 조합합니다." items={[
          { term: "Observable state", description: "현재 goal·plan status·artifact identity·최근 observation 중 model의 다음 판단에 허용된 snapshot입니다.", example: "수정 대상 파일, 마지막 test result, 남은 budget이 들어갑니다.", boundary: "전체 process memory나 비밀 credential을 그대로 뜻하지 않습니다." },
          { term: "Action proposal", description: "Model이 만든 tool name과 schema-valid arguments입니다.", example: "read_file(path=/repo/a.ts)를 제안합니다.", boundary: "제안만으로 파일이 읽히거나 바뀌지 않습니다." },
          { term: "Runtime gate", description: "Identity·resource·operation·budget·approval을 검사해 action을 허용하거나 거부합니다.", example: "쓰기 권한이 없는 path는 denied observation으로 바꿉니다.", boundary: "Prompt의 ‘허용됨’ 문장은 authorization이 아닙니다." },
          { term: "Typed observation", description: "실행 결과의 status·payload·source·time·truncation·effect receipt를 담은 다음 입력입니다.", example: "timeout과 empty search는 다른 status를 가집니다.", boundary: "자유 형식 문자열 하나로 모든 실패를 뭉치지 않습니다." },
        ]} />
        <AgentLoopViz />
        <ContentBoundary article="agent-loop-foundations" />
      </section>

      <section id="transition" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Proposal과 effect 사이에 runtime을 둡니다</h2>
        <ExplainedFormula
          question="현재 state에서 다음 state까지 어떤 순서로 책임을 넘길까요?"
          idea={<p>Model proposal을 authorization이 좁히고, executor가 만든 observation을 state update가 commit합니다. 각 함수는 서로 다른 실패 owner입니다.</p>}
          formula={String.raw`a_t\sim\pi_\theta(\cdot\mid s_t),\quad \tilde a_t=\mathcal A(a_t),\quad o_t=\mathcal E(\tilde a_t),\quad s_{t+1}=\mathcal U(s_t,a_t,o_t)`}
          annotatedFormula={String.raw`\begin{aligned}
a_t&\sim\underbrace{\pi_\theta(\cdot\mid s_t)}_{\text{현재 state에서 action을 제안}}\\
\tilde a_t&=\underbrace{\mathcal A(a_t)}_{\text{권한·resource·approval로 허용 범위를 축소}}\\
o_t&=\underbrace{\mathcal E(\tilde a_t)}_{\text{허용된 action만 실행해 observation 생성}}\\
s_{t+1}&=\underbrace{\mathcal U(s_t,a_t,o_t)}_{\text{결과·receipt·budget을 다음 state에 반영}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\pi_\theta(\cdot\mid s_t)`, annotation: ["현재 보이는 state를 조건으로", "다음 action 후보를 생성"] },
            { expression: String.raw`\mathcal A(a_t)`, annotation: ["제안을 곧바로 실행하지 않고", "runtime policy로 좁힘"] },
            { expression: String.raw`\mathcal E(\tilde a_t)`, annotation: ["허용된 action을 실행해", "성공·실패·partial receipt를 관찰"] },
            { expression: String.raw`\mathcal U(s_t,a_t,o_t)`, annotation: ["이전 state와 실제 결과를 함께 써서", "다음 판단의 state를 commit"] },
          ]}
          terms={[
            { symbol: "s_t", name: "Observable state", description: "t번째 decision이 읽을 수 있는 versioned run state입니다." },
            { symbol: "a_t", name: "Action proposal", description: "Model이 제안한 tool call·response·plan update입니다." },
            { symbol: "\\mathcal A", name: "Authorization gate", description: "실행 전에 identity·capability·approval·budget을 판정합니다." },
            { symbol: "o_t", name: "Typed observation", description: "Executor가 반환한 status·payload·receipt입니다." },
          ]}
          assumptions={["Model proposal과 runtime execution 권한은 분리되어 있습니다.", "Denied·timeout·empty·partial effect는 서로 다른 observation status입니다.", "State update는 artifact version과 effect receipt를 잃지 않습니다."]}
          interpretation="이 식은 성공 확률을 계산하지 않습니다. 한 action의 제안·허가·실행·기록 책임을 순서대로 분리하는 실행 계약입니다."
        />
      </section>

      <section id="observation-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Observation은 다음 decision이 실패를 구분할 수 있는 형태여야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>검색 결과가 비었다는 사실과 권한이 없어 검색하지 못했다는 사실은 다릅니다. 최소한 아래 필드를 서로 다른 줄로 남깁니다.</p>
          <ul>
            <li><strong>Status</strong><br />success · empty · denied · timeout · partial · failed</li>
            <li><strong>Payload identity</strong><br />inline value 또는 큰 artifact의 URI·checksum</li>
            <li><strong>Provenance</strong><br />tool revision · call ID · observed time · truncation</li>
            <li><strong>Effect receipt</strong><br />외부 상태를 바꿨다면 operation ID·committed target·retryability</li>
          </ul>
        </div>
      </section>

      <section id="exit-states" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Loop 종료도 하나의 boolean이 아니라 state machine입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>completed</strong>는 verifier가 acceptance를 확인한 상태입니다. <strong>exhausted</strong>는 turn·time·cost budget을 쓴 상태이고, <strong>stalled</strong>는 같은 action이 반복되는 상태입니다. 여기에 <strong>awaiting_approval</strong>·<strong>failed</strong>·<strong>escalated</strong>를 분리해야 재개와 partial artifact 처리 정책을 정할 수 있습니다.</p>
          <p>Model이 final answer를 생성했다는 사실은 completed evidence가 아닙니다. 결과 schema·test·environment invariant처럼 독립된 verifier를 통과해야 합니다.</p>
        </div>
        <div id="paper-react" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock source="ReAct: Synergizing Reasoning and Acting in Language Models" citeKey={1} href="https://arxiv.org/abs/2210.03629">Reasoning trace와 task-specific action을 번갈아 생성해 외부 observation으로 판단을 갱신하는 패턴을 제안합니다. 논문의 task 결과를 production authorization·exactly-once effect·private reasoning 공개 보장으로 확대하지 않습니다.</CitationBlock>
        </div>
      </section>
    </div>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { CodeModeProgramViz } from "../code-mode-viz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";

export default function AgentCodeModeArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="먼저 왕복 한 번"
          title="Code Mode는 코딩 에이전트의 별명이 아니라 tool workflow를 program으로 표현하는 실행 패턴이다"
        >
          Tool result마다 model로 돌아오는 경로와, model이 program을 한 번 만든
          뒤 runtime이 반복하는 경로를 먼저 나눕니다.
        </LessonHeader>
        <TermLesson
          name="Agent tool-call round trip"
          oneLine="Model이 다음 tool과 인자를 만들고, 실행 결과를 context로 받아 다음 판단을 하는 inference→execution→observation 한 바퀴입니다."
          shape="model → tool → result → model"
          example="Issue 목록을 받은 뒤 getIssue를 고르기 위해 model이 다시 inference하면 왕복이 하나 더 생깁니다."
          boundary="Framework가 여러 call을 한 response에 묶을 수 있으므로 tool 하나가 언제나 model round 하나라는 뜻은 아닙니다."
        />
        <TermLesson
          name="Code Mode program IR"
          oneLine="여러 tool call·변수·loop·branch·error handling을 sandbox가 실행할 짧은 program으로 표현한 중간 실행 형식입니다."
          shape="model → program IR → sandbox runtime → final result"
          example="listIssues 결과를 filter하고 team별 count로 reduce하는 TypeScript program을 한 번 생성합니다."
          boundary="단일 표준 protocol이 아니며 language·sandbox·tool binding은 product마다 다릅니다."
        />
        <CodeModeProgramViz />
      </section>

      <section id="tool-discovery" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="필요한 API만 펼치기"
          title="Tool discovery는 후보를 찾는 단계이고 schema loading은 선택한 signature를 여는 단계다"
        >
          수천 개 schema를 prompt에 모두 넣지 않고, 작은 index에서 후보를 고른
          뒤 현재 program에 필요한 API만 load합니다.
        </LessonHeader>
        <TermLesson
          name="Tool discovery · selective schema loading"
          oneLine="Name·description index에서 후보 tool을 찾고 선택된 signature·policy만 current context와 program API에 넣는 방법입니다."
          shape="tool index → 후보 3개 → signature·scope load"
          example="GitHub read 분석이면 listIssues·getIssue와 target organization scope만 펼칩니다."
          boundary="Discovery miss·악성 description·authorization 문제는 schema token 절감만으로 해결되지 않습니다."
        />
      </section>

      <section id="data-reduction" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="원본은 작업실에 남기기"
          title="절감의 핵심은 program 길이가 아니라 중간 data와 반복 판단이 model context로 되돌아오지 않는 것이다"
        >
          Sandbox-local intermediate data를 먼저 정의하고, 그 다음 program
          비용과 제거되는 왕복 비용을 같은 장부에서 비교합니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox-local intermediate data"
          oneLine="Tool의 대량 row·file·response를 sandbox memory에서 filter·aggregate하고 제한된 final result만 model로 반환하는 data boundary입니다."
          shape="100,000 rows → local filter·group → 20 aggregates"
          example="Security label·unassigned 조건으로 issue를 줄여 team별 count만 반환합니다."
          boundary="Model 노출은 줄어도 sandbox log·exception·trace에서 민감정보가 새어 나갈 수 있습니다."
        />
        <ExplainedFormula
          question="Program token을 추가하고도 Code Mode의 model token 이동이 더 작아지는 조건은 무엇일까요?"
          idea="반복 loop는 매 round의 prompt·schema·result·다음 판단을 더합니다. Code Mode는 discovery·program·final result를 한 번 내고 중간 data를 runtime 안에 둡니다."
          formula={String.raw`C_{\mathrm{code}}<C_{\mathrm{loop}}`}
          annotatedFormula={String.raw`\begin{aligned}c_i&=\underbrace{P_i+S_i+R_i+D_i}_{\text{왕복 i의 model token}}\\C_{\mathrm{loop}}&=\underbrace{\sum_{i=1}^{n}c_i}_{\text{모든 왕복 비용을 누적}}\\c_{\mathrm{fixed}}&=\underbrace{P_{\mathrm{find}}+P_{\mathrm{prog}}}_{\text{discovery와 program 생성}}\\C_{\mathrm{code}}&=\underbrace{c_{\mathrm{fixed}}+R_{\mathrm{final}}}_{\text{bounded result만 추가}}\\\mathrm{choose\ code}&\iff\underbrace{C_{\mathrm{code}}<C_{\mathrm{loop}}}_{\text{같은 품질에서 더 작은 경로}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{i=1}^{n}(P_i+S_i+R_i+D_i)`,
              annotation: [
                "각 model 왕복에 다시 실리는 항을 더해",
                "tool-loop token 이동량 계산",
              ],
            },
            {
              expression: String.raw`P_{\mathrm{find}}+P_{\mathrm{prog}}+R_{\mathrm{final}}`,
              annotation: [
                "중간 rows를 제외하고",
                "Code Mode 경계를 건너는 token만 합산",
              ],
            },
            {
              expression: String.raw`C_{\mathrm{code}}<C_{\mathrm{loop}}`,
              annotation: [
                "같은 task·quality 조건에서 비교해",
                "program 작성 overhead를 회수하는지 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "n",
              name: "Model rounds",
              description: "Tool 전후로 model이 다시 추론하는 횟수입니다.",
            },
            {
              symbol: "R_i",
              name: "Intermediate result",
              description:
                "i번째 tool 결과로 model context에 들어가는 token입니다.",
            },
            {
              symbol: String.raw`P_{\mathrm{prog}}`,
              name: "Program tokens",
              description: "Sandbox program을 생성하는 token입니다.",
            },
            {
              symbol: String.raw`R_{\mathrm{final}}`,
              name: "Bounded result",
              description:
                "Local reduction 뒤 model에 반환하는 최종 결과입니다.",
            },
          ]}
          assumptions={[
            "두 경로가 같은 task와 final quality를 만족합니다.",
            "Provider cache·tool billing·CPU·cold start·compile failure는 별도 장부로 측정합니다.",
          ]}
          interpretation="세 round가 각각 670 token이면 loop는 2,010 token입니다. Discovery 100·program 200·result 100이면 Code Mode는 400 token이지만, 이는 latency나 tool 요금까지 포함한 청구 공식은 아닙니다."
        />
      </section>

      <section id="decision" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="실행 방식 선택"
          title="한 번 조회·의미 판단·대량 계산·고위험 effect를 같은 runtime에 넣지 않는다"
        >
          Direct call, agent loop, Code Mode, deterministic workflow는 상하
          관계가 아니라 작업 모양에 따른 선택입니다.
        </LessonHeader>
        <TermLesson
          name="Code Mode decision boundary"
          oneLine="반복·분기·data volume·parallelism·semantic judgment·external effect 위험을 비교해 실행 패턴을 고르는 기준입니다."
          shape="단일 조회 / 대화형 판단 / 대량 계산 / 승인된 effect"
          example="날씨는 direct call, 조사 중 판단은 agent loop, 10만 rows 집계는 Code Mode, 결제는 승인 workflow를 씁니다."
          boundary="Tool latency·data size·model capability가 바뀌면 같은 task의 최적 선택도 바뀝니다."
        />
        <div id="paper-anthropic-code-execution" className="scroll-mt-24">
          <CitationBlock
            source="Anthropic — Code execution with MCP"
            citeKey={1}
            href="https://www.anthropic.com/engineering/code-execution-with-mcp"
          >
            <EvidenceGrid
              problem="많은 MCP schema와 대량 중간 result가 context와 왕복을 늘리는 문제"
              contribution="Code environment에서 tool을 조합하고 중간 data를 local 처리하는 pattern"
              assumptions="Anthropic이 설명한 architecture·binding·sandbox와 example workload"
              scope="Programmatic orchestration과 context 이동 감소의 설계 rationale"
              notClaim="모든 단순 call·provider에서 token·latency가 줄거나 안전성이 자동 보장된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-cloudflare-code-mode" className="scroll-mt-24">
          <CitationBlock
            source="Cloudflare — Code Mode for MCP"
            citeKey={2}
            href="https://blog.cloudflare.com/code-mode-mcp/"
          >
            <EvidenceGrid
              problem="MCP tools를 model round마다 조합할 때 생기는 schema·data overhead"
              contribution="MCP server를 typed sandbox binding으로 노출하는 Code Mode 구현"
              assumptions="Cloudflare runtime·binding·supported language와 문서 example"
              scope="Cloudflare가 Code Mode라 부르는 execution surface"
              notClaim="Code Mode가 단일 산업 표준이거나 다른 runtime도 같은 성능·보안을 갖는다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="Code Mode 선택 흐름"
          description="왕복·data volume·effect risk를 순서대로 확인합니다."
          steps={[
            {
              label: "Round trip",
              detail: "Model이 다시 판단할 횟수를 셉니다.",
            },
            {
              label: "Program IR",
              detail: "명시적 loop·branch를 runtime으로 옮깁니다.",
            },
            {
              label: "Local data",
              detail: "중간 rows를 sandbox 안에서 줄입니다.",
            },
            {
              label: "Decision",
              detail: "비용과 risk에 맞는 실행 방식을 고릅니다.",
            },
          ]}
        />
        <ContentBoundary article="agent-code-mode" />
      </section>
    </article>
  );
}

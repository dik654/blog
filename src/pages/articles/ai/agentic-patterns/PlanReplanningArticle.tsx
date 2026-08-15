import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { PlanReplanningViz } from "./viz/ModernAgentPatternViz";

export default function PlanReplanningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Plan은 할 일 문장이 아니라 실행 가능한 state입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">장기 작업에서 “조사하기 → 구현하기 → 테스트하기”만 적으면 무엇이 완료됐고 다음 task가 어떤 결과를 읽어야 하는지 알 수 없습니다. Executable plan은 task dependency와 artifact identity, owner, status, completion evidence를 함께 저장합니다.</p>
        </div>
        <TermBreakdown title="Plan record의 네 부분을 따로 고정합니다" description="각 항을 이해한 뒤 dependency graph와 replanning으로 조합합니다." items={[
          { term: "Task node", description: "명확한 input과 output schema를 가진 실행 단위입니다.", example: "GenerateClient(input=schema:v3) → client.ts", boundary: "‘조사한다’처럼 제출물이 없는 문장은 task state가 아닙니다." },
          { term: "Dependency edge", description: "어느 task가 어느 artifact version을 기다리는지 나타냅니다.", example: "IntegrationTest는 client.ts checksum abc에 의존합니다.", boundary: "문서에 적힌 순서와 실제 data dependency는 다를 수 있습니다." },
          { term: "Artifact receipt", description: "Output URI·schema·checksum·validator result를 묶은 완료 근거입니다.", example: "client.ts · sha256:abc · tsc:pass", boundary: "Worker의 ‘done’ message만으로 대체하지 않습니다." },
          { term: "Plan transition", description: "Evidence에 따라 blocked·running·verified·invalidated를 바꾸는 versioned event입니다.", example: "schema v4 관측 뒤 client와 integration test만 pending으로 되돌립니다.", boundary: "전체 plan을 무조건 처음부터 다시 만들지 않습니다." },
        ]} />
        <PlanReplanningViz />
        <ContentBoundary article="agent-plan-replanning" />
      </section>

      <section id="executable-plan" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Task는 dependency·owner·artifact·evidence를 가집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Task B가 A의 schema artifact를 읽는다면 아래 필드를 한 record로 보존합니다.</p>
          <ul>
            <li><strong>Identity</strong><br />task ID · plan version · attempt ID</li>
            <li><strong>Input</strong><br />dependency artifact URI · revision · checksum</li>
            <li><strong>Execution owner</strong><br />worker identity · capability scope · deadline</li>
            <li><strong>Output</strong><br />artifact schema · destination · validator</li>
            <li><strong>Status evidence</strong><br />blocked/running/verified와 transition reason</li>
          </ul>
          <p>이 구조가 있으면 process가 재시작되어도 model의 자연어 요약이 아니라 registry state에서 정확한 재개 위치를 찾을 수 있습니다.</p>
        </div>
      </section>

      <section id="replanning" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Replanning은 깨진 assumption의 영향 범위를 계산하는 일입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>API schema v3를 기준으로 만든 client가 있고 새 observation이 v4를 가리킨다고 합시다. Schema와 직접 연결된 generation task, 그 client를 읽는 integration test는 invalidated가 됩니다. 반면 source revision과 무관한 UI screenshot은 checksum·acceptance가 그대로라면 보존할 수 있습니다.</p>
          <p>따라서 replan record에는 <strong>깨진 assumption</strong>, <strong>영향받은 edge</strong>, <strong>다시 열 task</strong>, <strong>보존 artifact</strong>, <strong>retry budget</strong>, <strong>새 acceptance</strong>를 각각 적습니다. 실패를 숨기는 무한 retry는 replanning이 아닙니다.</p>
        </div>
      </section>

      <section id="reflection" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Reflection은 외부 feedback을 다음 trial의 수정 계약으로 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“다음에는 더 주의하자”는 실행 가능한 reflection이 아닙니다. Compiler가 missing import를 보고했다면 source=compiler, cause=wrong module path, change=target import, verify=같은 compile command와 regression test처럼 관측과 수정·재검증을 연결합니다.</p>
          <p>Model이 자기 답을 다시 읽는 self-review는 feedback source가 아닐 수 있습니다. Compiler·test·environment·retrieval citation·domain rubric·human review처럼 독립된 관측이 먼저 있어야 합니다.</p>
        </div>
        <div id="paper-reflexion" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock source="Reflexion: Language Agents with Verbal Reinforcement Learning" citeKey={2} href="https://arxiv.org/abs/2303.11366">Environment·heuristic·self-evaluation feedback을 언어적 reflection과 episodic memory로 바꿔 다음 trial에 사용합니다. 근거 없는 self-review가 자동으로 오류를 찾는다는 보편 주장으로 읽지 않습니다.</CitationBlock>
        </div>
      </section>
    </div>
  );
}

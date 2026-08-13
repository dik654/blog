import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import SubAgentTreeViz from "./viz/SubAgentTreeViz";
import AgentLoopSequenceViz from "./viz/AgentLoopSequenceViz";
import ContextManagement from "./ContextManagement";
import MCPIntegration from "./MCPIntegration";
import HooksSystem from "./HooksSystem";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function AgentArchitecture({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="agent-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 번의 답변이 아니라 상태를 갱신하는 실행으로 추적한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          로그인 버그 요청의 시작 state에는 사용자 요구, working directory,
          현재 branch와 변경 파일, 상위 디렉터리의 지침이 들어갑니다. 모델이
          <code>rg</code>로 오류 문구를 찾자고 제안하면 호스트는 Bash 호출의
          permission과 hook을 검사하고, 허용된 경우에만 명령을 실행합니다. 검색
          결과는 observation으로 state에 추가되며, 이후 Read→Edit→test도 같은
          전이를 반복합니다.
        </p>
        <p>
          여기서 <strong>Decide</strong>는 다음 행동을 고르는 model proposal,
          <strong> Act</strong>는 호스트가 허용한 tool execution,
          <strong> Observe</strong>는 파일 내용과 명령 결과를 되돌려 받는 단계,
          <strong> Verify</strong>는 테스트처럼 합격 조건을 기계적으로 확인하는
          단계입니다. 이 표기는 ReAct를 이해하기 위한 관찰 가능한 요약이며,
          모델에게 내부 chain-of-thought를 공개하라고 요구하는 방식이 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AgentLoopSequenceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>서브에이전트는 사람 수를 늘리는 기능이 아니라 context와 책임을 분리하는 기능이다</h3>
        <p>
          서브에이전트(subagent)는 별도의 context, system prompt, tools와
          permissions를 가진 작업자입니다. 메인 대화의 모든 내용을 자동으로 아는
          것이 아니므로, “로그인 문제 조사해 줘”처럼 모호하게 넘기면 결과를
          합치기 어렵습니다. 위임할 때는 입력 파일과 질문, 읽어도 되는 범위,
          변경 소유권, 반환할 artifact와 검증 기준을 함께 적어야 합니다.
        </p>
        <p>
          이번 예시에서는 메인 에이전트가 수정과 최종 테스트를 소유하고,
          서브에이전트에는 “읽기 전용으로 로그인 실패 재현 경로를 조사하고,
          관련 파일·재현 명령·가장 작은 원인 가설·근거를 표 형태로 반환”하도록
          맡길 수 있습니다. 반환값은 자유로운 대화 요약보다 다음 필드가 있는
          <strong> typed handoff artifact</strong>가 낫습니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">필드</th>
              <th className="border-b border-border px-4 py-3">로그인 버그 위임 계약</th>
              <th className="border-b border-border px-4 py-3">소유권</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Input", "오류 문구, 재현 절차, auth 관련 경로", "메인이 전달"],
              ["Allowed tools", "Read·Glob·Grep와 read-only Bash", "호스트가 강제"],
              ["Output", "후보 파일, 근거 line, 재현 test, 불확실성", "서브에이전트가 반환"],
              ["Mutation", "파일 수정·commit 금지", "메인이 유지"],
              ["Verification", "수정 전 실패를 재현하는 명령", "메인이 다시 실행"],
            ].map(([field, contract, owner]) => (
              <tr key={field} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">{field}</th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {contract}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {owner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose my-8">
        <SubAgentTreeViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          병렬 실행은 검색 경로가 서로 독립적일 때만 이득이 있습니다. 한 agent가
          원인을 확인하기 전에 다른 agent가 같은 파일을 수정하게 만들면 conflict와
          검증 책임이 모호해집니다. 예를 들어 “UI 오류 메시지 경로 조사”와 “서버
          인증 로그 경로 조사”는 읽기 전용으로 병렬화할 수 있지만, 두 agent가
          <code>auth.ts</code>를 동시에 편집하게 해서는 안 됩니다. multi-agent
          구현의 join과 ownership은 <a href="/ai/multi-agent-implementation">멀티
          에이전트 구현</a>에서 이어집니다.
        </p>

        <div id="paper-claude-code-subagents" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Anthropic — Create custom subagents"
            citeKey={2}
            href="https://code.claude.com/docs/en/sub-agents"
          >
            문제: 긴 작업에서 조사 결과와 도구 권한이 한 context에 섞이면 집중도와
            책임 추적이 어려워집니다. 현재 기여: 공식 문서는 subagent마다 별도
            context, system prompt, tool access와 permissions를 구성하고 결과를
            상위 대화에 반환하는 동작을 설명합니다. 전제: 현재 Claude Code의
            subagent 설정과 선택한 context mode·client입니다. 근거 범위: 제품이
            공개한 context 및 도구 분리와 delegation interface입니다. 하지 않는
            주장: agent를 늘리면 품질이 자동으로 오르거나, 병렬 agent가 같은 파일을
            안전하게 합치고, subagent의 모든 중간 context가 부모에게 보존된다는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
        <p>
          아래 버튼 역시 이 블로그에 포함된 illustrative example입니다. 실제 Claude
          Code 내부 코드가 아니라, 입력·출력·소유권을 갖춘 위임 workflow를 읽는
          연습 자료입니다.
        </p>
      </div>
      <div className="not-prose mt-3 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("agent-1", codeRefs["agent-1"])} />
        <span className="text-xs leading-5 text-muted-foreground">
          블로그 프로젝트의 delegation 학습 예시
        </span>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ContextManagement />
        <MCPIntegration />
        <HooksSystem onCodeRef={onCodeRef} />
      </div>
    </section>
  );
}

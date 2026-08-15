import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import AgentLoopViz from "./viz/AgentLoopViz";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const LOOP_STEPS = [
  ["1. 요청", "로그인 실패 버그를 찾아 최소 수정하고 테스트로 검증해 달라는 완료 조건을 받습니다."],
  ["2. Workspace 발견", "저장소 구조, git 상태, CLAUDE.md, 관련 파일과 테스트 명령을 읽어 현재 상태를 확인합니다."],
  ["3. Model proposal", "모델은 다음에 읽을 파일, 적용할 patch, 실행할 명령을 제안합니다. 이 제안 자체에는 실행 권한이 없습니다."],
  ["4. Host decision", "Claude Code가 permission rule과 hook을 적용하고, 필요한 경우 사용자에게 승인을 요청합니다."],
  ["5. Tool execution", "허용된 Read·Edit·Bash 같은 tool만 실제 workspace나 외부 시스템에 영향을 줍니다."],
  ["6. Observation", "파일 내용, 명령의 exit code와 stdout·stderr가 다음 판단을 위한 관찰값으로 돌아옵니다."],
  ["7. Verification", "재현 테스트가 수정 전에는 실패하고 수정 후에는 통과하는지처럼 결정론적인 증거를 확인합니다."],
  ["8. Checkpoint·응답", "되돌릴 수 있는 파일 변경과 되돌릴 수 없는 외부 효과를 구분한 뒤 변경 범위와 검증 결과를 보고합니다."],
] as const;

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Claude Code는 모델 이름이 아니라 코딩 작업을 실행하는 하네스다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Claude Code를 “코드를 잘 쓰는 모델”로 이해하면 permission과 checkpoint가
          왜 필요한지 설명하기 어렵습니다. Claude Code는 모델을 workspace,
          terminal, tools, permissions, context, extensions와 연결하는
          <strong> coding-agent harness</strong>입니다. 모델은 다음 행동을
          <em> 제안</em>하고, 호스트 프로그램은 그 행동을 허용하고 실행할지
          <em> 강제</em>합니다. 따라서 좋은 제안과 안전한 실행은 서로 다른
          책임입니다.
        </p>
        <p className="leading-7">
          이 글에서는 “로그인 실패 버그를 찾아 최소 수정하고 테스트로 검증”하는
          한 가지 요청을 끝까지 따라갑니다. 사용자는 파일 위치나 고칠 줄을 이미
          알 필요가 없지만, 에이전트는 곧바로 편집부터 해서는 안 됩니다. 먼저
          workspace의 현재 상태와 프로젝트 지침을 발견하고, 수정 후보를 제안한
          뒤, 호스트의 권한 판정과 실제 tool 실행을 거쳐 테스트 증거를 남겨야
          합니다.
        </p>
        <ContentBoundary article="claude-code" />
        <p className="leading-7">
          일반적인 agent loop는 <a href="/ai/agent-loop-foundations">Agent loop 기초</a>,
          하네스의 설계 원리는 <a href="/ai/llm-harness">LLM 하네스</a>에서
          다룹니다. 이 글은 그 개념을 다시 정의하지 않고, Claude Code라는 제품이
          workspace 발견, tool 실행, permission, hook, memory, checkpoint와 IDE
          surface로 구체화하는 경계만 설명합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AgentLoopViz />
      </div>

      <div className="not-prose overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-44 border-b border-border px-4 py-3 font-semibold">
                전이
              </th>
              <th className="border-b border-border px-4 py-3 font-semibold">
                로그인 버그 예시에서 확인할 상태
              </th>
            </tr>
          </thead>
          <tbody>
            {LOOP_STEPS.map(([step, description]) => (
              <tr key={step} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">
                  {step}
                </th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>루프는 숨은 추론이 아니라 관찰 가능한 state transition으로 읽는다</h3>
        <p>
          제품 내부에서 모델이 어떤 생각을 했는지 재현하려 하기보다, 요청과
          관찰값이 무엇이었고 어떤 tool call이 제안·허용·실행되었으며 검증이
          어떤 exit code로 끝났는지를 기록해야 합니다. 예를 들어 모델이
          <code>auth.ts</code>를 고치자고 제안해도, 실제 변경은 Edit tool이
          허용되어 실행된 뒤에만 생깁니다. 테스트가 실패했다면 그 stderr는 다음
          시도의 입력이지 완료의 근거가 아닙니다.
        </p>

        <div
          id="paper-claude-code-how-it-works"
          className="not-prose scroll-mt-24"
        >
          <CitationBlock
            source="Anthropic — How Claude Code works"
            citeKey={1}
            href="https://code.claude.com/docs/en/how-claude-code-works"
          >
            문제: 언어 모델의 제안을 실제 파일·terminal 작업으로 연결하면서도
            진행 상태와 검증 근거를 잃지 않아야 합니다. 현재 기여: 공식 문서는
            context 수집, action, verification이 반복되는 agentic loop와 도구,
            실행 환경, permission을 포함한 harness를 설명합니다. 전제: 현재
            Claude Code 문서와 선택한 client·model·workspace 설정입니다. 근거
            범위: 공개된 제품 동작과 사용자에게 보이는 실행 경계입니다. 하지 않는
            주장: 모든 코드 변경이 정확하거나 이 순서가 매번 엄격히 한 번씩만
            실행되고, 모델의 숨은 추론이 공개된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <h3>코드 버튼은 공식 내부 구현이 아니라 학습용 예시다</h3>
        <p>
          아래 코드는 이 블로그 프로젝트에 함께 넣은 illustrative example입니다.
          tool loop에서 상태를 어떻게 전달하는지 살펴보기 위한 자료이며, Anthropic의
          비공개 Claude Code source나 현재 제품의 정확한 구현이라고 해석해서는 안
          됩니다.
        </p>
      </div>
      <div className="not-prose mt-3 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("agent-0", codeRefs["agent-0"])} />
        <span className="text-xs leading-5 text-muted-foreground">
          sweep.ts — 이 블로그가 만든 tool-loop 학습 예시
        </span>
      </div>
    </section>
  );
}

import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import PermissionModeViz from "./viz/PermissionModeViz";
import IDEIntegration from "./IDEIntegration";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const ENFORCEMENT_LAYERS = [
  {
    layer: "Tool registry",
    question: "모델이 어떤 action schema를 제안할 수 있는가?",
    loginExample: "Read·Grep·Edit·Bash와 연결한 MCP tool을 목록에 노출",
    guarantee: "목록과 input shape를 제공할 뿐 실행 권한을 보장하지 않음",
  },
  {
    layer: "Permission",
    question: "이 concrete tool call을 현재 scope에서 실행해도 되는가?",
    loginExample: "src/auth 읽기는 허용하고 production credential 접근은 거부",
    guarantee: "호스트가 deny·ask·allow rule과 mode를 적용",
  },
  {
    layer: "Hook",
    question: "Lifecycle 전후에 어떤 policy·audit·검사를 연결할 것인가?",
    loginExample: "위험한 Bash 인자를 차단하고 성공한 edit 뒤 formatter 실행",
    guarantee: "Event/type별 동작이며 permission을 우회하지 못함",
  },
  {
    layer: "Verification",
    question: "실행 결과가 사용자의 완료 조건을 만족했는가?",
    loginExample: "재현 test와 관련 regression suite의 exit code 확인",
    guarantee: "테스트가 관찰한 범위의 증거이며 전체 correctness 보장은 아님",
  },
] as const;

export default function ToolsPermissions({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="tools-permissions" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Tool을 볼 수 있는 것과 실행할 수 있는 것은 다르다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델은 tool registry에 등록된 이름과 schema를 보고 “이 파일을 읽자”거나
          “이 테스트를 실행하자”는 호출을 생성합니다. 그러나 제안된 호출은 아직
          효과가 없습니다. Claude Code 호스트가 permission rule과 hook을 적용하고
          필요한 승인을 받은 다음 실제 tool을 실행해야 파일·process·network 상태가
          바뀝니다. 이 분리를 놓치면 tool description을 security policy로 착각하게
          됩니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[940px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">계층</th>
              <th className="border-b border-border px-4 py-3">답하는 질문</th>
              <th className="border-b border-border px-4 py-3">로그인 버그 예시</th>
              <th className="border-b border-border px-4 py-3">보장 경계</th>
            </tr>
          </thead>
          <tbody>
            {ENFORCEMENT_LAYERS.map((item) => (
              <tr key={item.layer} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">
                  {item.layer}
                </th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.question}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.loginExample}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.guarantee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Tool 이름을 외우기보다 capability와 effect를 분류한다</h3>
        <p>
          현재 공식 tool reference에는 file read·search·edit, shell execution,
          subagent와 web·MCP integration 등 여러 tool이 소개됩니다. 제품이 바뀔 때
          이름과 수는 달라질 수 있으므로 고정 카탈로그를 외우기보다
          <strong> read-only observation</strong>, <strong>workspace mutation</strong>,
          <strong> process·network side effect</strong>, <strong>delegation</strong>으로
          나누어 permission과 rollback 요구를 정하는 편이 안전합니다.
        </p>

        <div id="paper-claude-code-tools" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Anthropic — Tools available to Claude"
            citeKey={4}
            href="https://code.claude.com/docs/en/tools-reference"
          >
            문제: model이 workspace를 조사·수정·검증하려면 text response 밖의
            concrete action interface가 필요합니다. 현재 기여: 공식 reference는
            Claude Code가 노출하는 tool, 주요 input과 permission 요구를 설명합니다.
            전제: 현재 client version, 실행 directory, 연결한 extension과 조직
            settings입니다. 근거 범위: 공개된 tool interface와 기본 permission
            동작입니다. 하지 않는 주장: tool 목록이 고정되어 있거나 registry에
            나타난 tool이 자동 허용되고, tool result가 신뢰할 수 있으며 개별 호출이
            task correctness를 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-8">
        <PermissionModeViz />
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          위 시각화는 “자동 실행·사용자 확인·차단”이라는 개념적 분기를 보여 줍니다.
          실제 mode 이름과 제공 범위는 client·version·managed policy에 따라 현재
          공식 문서를 확인해야 합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Permission precedence는 deny → ask → allow 순서로 계산한다</h3>
        <p>
          현재 permission 문서에서 rule category의 우선순위는
          <strong> deny, ask, allow</strong>입니다. 각 category 안에서는 먼저 match한
          rule이 적용되며, 더 구체적인 allow가 넓은 deny를 뒤집지 않습니다. 예를
          들어 <code>Bash(*)</code>를 deny하고 <code>Bash(npm test:*)</code>를
          allow해도 npm test는 거부됩니다. 테스트만 허용하고 싶다면 겹치는 broad
          deny를 제거하거나 scope를 다시 설계해야 합니다.
        </p>
        <p>
          Hook과 permission의 순서도 중요합니다. <code>PreToolUse</code> hook이
          allow decision을 반환하더라도 matching deny나 ask를 우회할 수 없고,
          반대로 permission상 허용된 call도 blocking hook이 막을 수 있습니다.
          CLAUDE.md의 “이 명령은 안전하다”는 문장은 어느 쪽의 enforcement도
          변경하지 않습니다. Sandbox까지 포함한 위협 모델은
          <a href="/ai/agent-sandbox-security"> agent sandbox security</a>에서
          이어집니다.
        </p>

        <div id="paper-claude-code-permissions" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Anthropic — Configure permissions"
            citeKey={5}
            href="https://code.claude.com/docs/en/permissions"
          >
            문제: model이 제안한 file·shell·network action을 project와 조직의
            policy에 맞게 차단하거나 승인받아야 합니다. 현재 기여: 공식 문서는
            deny→ask→allow precedence, rule matching, permission mode와 hook decision의
            관계를 설명합니다. 전제: 현재 Claude Code version, settings scope,
            managed policy와 실행 환경입니다. 근거 범위: Claude Code 호스트가
            강제하는 permission decision입니다. 하지 않는 주장: allow가 명령의
            안전성과 정확성을 보증하거나, 더 구체적인 rule이 항상 이기고,
            PreToolUse allow가 deny·ask를 우회하며 permission만으로 OS·network 격리가
            완성된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <h3>Checkpoint는 direct edit 복구 장치이지 transaction이나 version control이 아니다</h3>
        <p>
          Claude Code checkpoint는 세션 중 direct file-edit tool로 바뀐 파일을 빠르게
          복원하는 데 유용합니다. 그러나 Bash로 실행한 migration, 외부 API 호출,
          deploy, 보낸 메시지와 git operation까지 되돌리는 transaction은 아닙니다.
          Subagent나 외부 process가 만든 변경도 현재 session checkpoint에 같은 방식으로
          잡힌다고 가정해서는 안 됩니다. 공식 문서가 명시하듯 symlink와 hard link
          경로도 rewind가 건너뛰므로, package manager나 dotfile manager가 만든
          연결 파일은 별도 복구 절차가 필요합니다.
        </p>
        <p>
          로그인 버그에서 Edit tool로 <code>auth.ts</code>를 바꾼 뒤 checkpoint를
          되돌리면 direct edit는 복구 대상으로 볼 수 있지만,
          <code>npm test</code>가 만든 database fixture나 Bash script가 수정한 파일은
          별도로 정리해야 합니다. 그래서 destructive side effect 전에는 git branch,
          database transaction, idempotency key나 dry-run 같은 해당 시스템의 복구
          수단을 사용합니다.
        </p>

        <div id="paper-claude-code-checkpointing" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Anthropic — Rewind changes with checkpointing"
            citeKey={7}
            href="https://code.claude.com/docs/en/checkpointing"
          >
            문제: agent가 여러 파일을 편집한 뒤 잘못된 방향을 빠르게 되돌릴 수
            있어야 합니다. 현재 기여: 공식 문서는 direct file edit에 대한 session
            checkpoint와 rewind 범위, 제외되는 Bash·external effect·version control
            경계를 설명합니다. 전제: 현재 Claude Code client, 동일 session과
            지원되는 direct edit 경로입니다. 근거 범위: 제품 checkpoint가 캡처하는
            파일 변경입니다. 하지 않는 주장: checkpoint가 git을 대체하거나 Bash,
            subagent, manual edit와 외부 API 효과를 원자적으로 rollback하고,
            distributed transaction이나 exactly-once execution을 보장한다는 뜻은
            아닙니다.
          </CitationBlock>
        </div>

        <p>
          아래 permission 관련 코드도 이 블로그 프로젝트의 illustrative example이며
          공식 Claude Code 내부 source가 아닙니다. 개념을 읽는 데 사용하고 실제
          settings schema는 현재 공식 문서와 대조해야 합니다.
        </p>
      </div>

      <div className="not-prose mt-3 flex flex-wrap items-center gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("permissions-0", codeRefs["permissions-0"])}
        />
        <span className="text-xs text-muted-foreground">정책 설정 학습 예시</span>
        <CodeViewButton
          onClick={() => onCodeRef("permissions-1", codeRefs["permissions-1"])}
        />
        <span className="text-xs text-muted-foreground">rule matcher 학습 예시</span>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <IDEIntegration />
      </div>
    </section>
  );
}

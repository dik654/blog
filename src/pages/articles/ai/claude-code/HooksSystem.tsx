import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const HOOK_MATRIX = [
  ["PreToolUse", "tool 실행 전 인자 검사·차단·승인 decision 보조", "command · http · mcp_tool · prompt · agent"],
  ["PermissionRequest", "사용자 승인 요청이 생겼을 때 외부 policy와 연결", "command · http · mcp_tool · prompt · agent"],
  ["PostToolUse", "성공한 실행 결과 뒤 formatter·audit·후속 검사", "command · http · mcp_tool · prompt · agent"],
  ["PostToolUseFailure", "실패한 tool의 stderr·원인을 관측 시스템에 기록", "command · http · mcp_tool · prompt · agent"],
  ["Stop · TaskCompleted", "완료를 받아들이기 전 마지막 조건 검사", "command · http · mcp_tool · prompt · agent"],
] as const;

export default function HooksSystem({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-10 text-xl font-semibold">
        Hook은 lifecycle에 붙는 handler이지 permission의 우회로가 아니다
      </h3>
      <p>
        Hook은 Claude Code의 특정 lifecycle event에서 command, HTTP endpoint,
        MCP tool 또는 model-based evaluator를 실행하는 확장점입니다. Permission이
        “이 tool call을 실행할 권한이 있는가”를 판정한다면, hook은 “실행 전후에
        어떤 조직 정책·검사·관측을 연결할 것인가”를 담당합니다. 둘은 겹쳐
        보이지만 대체 관계가 아닙니다.
      </p>
      <p>
        로그인 버그 예시에서는 <code>PreToolUse</code> command hook이 production
        credential이나 보호 경로를 건드리는 Bash 인자를 차단하고,
        <code>PostToolUse</code>가 수정 파일을 format할 수 있습니다. 하지만
        “테스트가 통과했는가”라는 완료 조건은 model-based prompt hook의 느낌이
        아니라, 실제 test command의 exit code와 결과를 관찰해 판정해야 합니다.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">대표 event</th>
              <th className="border-b border-border px-4 py-3">이 workflow에서의 책임</th>
              <th className="border-b border-border px-4 py-3">지원 type을 읽는 법</th>
            </tr>
          </thead>
          <tbody>
            {HOOK_MATRIX.map(([event, role, types]) => (
              <tr key={event} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">{event}</th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {role}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {types}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        현재 handler type에는 <code>command</code>, <code>http</code>,
        <code>mcp_tool</code>, <code>prompt</code>, <code>agent</code>가 있지만 모든
        event가 모든 type을 지원하지는 않습니다. Event나 type의 총개수를 제품의
        고정 계약처럼 외우기보다, 설치한 version의 event/type matrix를 확인해야
        합니다. 위 표의 event들은 현재 문서에서 다섯 type을 모두 지원하지만,
        SessionStart·Setup은 command와 mcp_tool만 지원하는 식으로 차이가 납니다.
        특히 command hook의 exit status처럼 결정론적인 값과 prompt·agent hook의
        model judgment를 같은 보장으로 취급해서는 안 되며, agent handler는 현재
        experimental 기능이라는 version 전제도 남겨야 합니다.
      </p>

      <h4>현재 설정 형태에서는 matcher 아래에 handler 목록을 둔다</h4>
      <pre className="not-prose my-4 overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 text-xs leading-6">{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-bash.sh"
          }
        ]
      }
    ]
  }
}`}</pre>
      <p>
        위 예시는 구조를 보여 주기 위한 최소 형태입니다. Script는 stdin으로 받은
        event payload를 parse하고 tool input을 allowlist와 대조한 뒤 명시적인 exit
        status와 메시지를 반환해야 합니다. 문자열 포함 여부만으로 명령을 승인하면
        quoting, shell operator와 경로 변형을 놓칠 수 있으므로 실제 조직 policy는
        parser와 test fixture로 검증합니다.
      </p>

      <div id="paper-claude-code-hooks" className="not-prose scroll-mt-24">
        <CitationBlock
          source="Anthropic — Automate workflows with hooks"
          citeKey={6}
          href="https://code.claude.com/docs/en/hooks"
        >
          문제: model prompt만으로는 tool 실행 전 차단, 실행 후 format, 실패 audit와
          완료 gate를 일관되게 적용하기 어렵습니다. 현재 기여: 공식 문서는
          lifecycle event, matcher와 command·http·mcp_tool·prompt·agent handler 및
          event별 decision 동작을 설명합니다. 전제: 현재 Claude Code version과 각
          event가 지원하는 handler type, 로컬 script·endpoint의 신뢰 경계입니다.
          근거 범위: 공개 hook configuration과 event semantics입니다. 하지 않는
          주장: hook allow가 deny·ask permission을 우회하거나 model-based hook이
          결정론적 검증이고, 모든 event가 모든 handler type을 지원하며 hook script가
          자동으로 안전하다는 뜻은 아닙니다.
        </CitationBlock>
      </div>

      <p>
        아래 세 코드 버튼은 이 블로그 프로젝트가 제공하는 illustrative example로,
        공식 Claude Code 내부 source가 아닙니다. 현재 문서의 JSON schema와 다를 수
        있으므로 실행 전에 설치 version의 공식 문서와 대조해야 합니다.
      </p>
      <div className="not-prose mt-3 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("hooks-0", codeRefs["hooks-0"])} />
        <span className="text-xs text-muted-foreground">검증 hook 학습 예시</span>
        <CodeViewButton onClick={() => onCodeRef("hooks-1", codeRefs["hooks-1"])} />
        <span className="text-xs text-muted-foreground">규칙 평가 학습 예시</span>
        <CodeViewButton onClick={() => onCodeRef("hooks-2", codeRefs["hooks-2"])} />
        <span className="text-xs text-muted-foreground">설정 loader 학습 예시</span>
      </div>
    </>
  );
}

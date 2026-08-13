import { CitationBlock } from "@/components/ui/citation";

const CONTEXT_LAYERS = [
  {
    name: "CLAUDE.md",
    writer: "사람·팀",
    purpose: "빌드 명령, 코드 규칙, repository 구조처럼 검토 가능한 지속 지침",
    loginExample: "인증 테스트 명령과 ‘최소 수정’ 규칙",
  },
  {
    name: "Auto memory",
    writer: "Claude Code",
    purpose: "반복해서 유용했던 project-local 관찰을 machine-local memory에 정리",
    loginExample: "이 저장소에서 auth fixture가 놓이는 위치에 대한 재사용 가능한 메모",
  },
  {
    name: "Session context",
    writer: "현재 실행",
    purpose: "대화, tool result, 현재 계획과 직전 오류처럼 이번 작업에서만 필요한 상태",
    loginExample: "방금 실패한 테스트의 stderr와 수정한 line",
  },
  {
    name: "Compaction",
    writer: "제품 runtime",
    purpose: "context가 길어질 때 오래된 세부 결과를 지우고 요약해 현재 작업을 이어 감",
    loginExample: "원인·수정 파일·남은 검증을 보존하되 오래된 검색 출력은 축약",
  },
] as const;

export default function ContextManagement() {
  return (
    <>
      <h3 className="mt-10 text-xl font-semibold">
        CLAUDE.md, auto memory와 compaction은 서로 다른 문제를 푼다
      </h3>
      <p>
        세 기능을 모두 “기억”이라고 부르면 무엇을 신뢰해야 할지 흐려집니다.
        <strong> CLAUDE.md</strong>는 사람이 작성하고 version control로 검토할 수
        있는 지침이고, <strong>auto memory</strong>는 Claude Code가 반복 작업에서
        얻은 유용한 메모를 저장하는 기능입니다. <strong>session context</strong>는
        현재 대화의 작업 메모이며, <strong>compaction</strong>은 그 session이 길어질
        때 일부 세부 내용을 요약하는 손실 있는 변환입니다.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[900px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">계층</th>
              <th className="border-b border-border px-4 py-3">누가 쓰는가</th>
              <th className="border-b border-border px-4 py-3">무엇을 보존하는가</th>
              <th className="border-b border-border px-4 py-3">로그인 버그 예시</th>
            </tr>
          </thead>
          <tbody>
            {CONTEXT_LAYERS.map((layer) => (
              <tr key={layer.name} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">
                  {layer.name}
                </th>
                <td className="border-b border-border px-4 py-3 text-muted-foreground">
                  {layer.writer}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {layer.purpose}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {layer.loginExample}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>CLAUDE.md는 넓은 범위에서 좁은 범위 순으로 적용된다</h4>
      <p>
        현재 문서는 managed policy, user, project, local scope를 구분합니다. 세션을
        시작하면 filesystem의 상위 디렉터리에서 working directory까지 발견한
        CLAUDE.md가 넓은 범위부터 로드되고, 더 아래 디렉터리의 nested CLAUDE.md는
        Claude가 그 경로의 파일을 읽을 때 필요에 따라 들어옵니다. 따라서
        <code>src/auth/CLAUDE.md</code>에 인증 테스트 규칙이 있어도 세션 시작부터
        항상 들어오는 것이 아니라, auth 파일을 탐색할 때 적용될 수 있습니다.
      </p>
      <p>
        지침과 enforcement도 구분해야 합니다. “production DB를 건드리지 말라”는
        문장을 CLAUDE.md에 쓰는 것은 모델에게 주는 context이며, 실제 차단은
        settings의 deny rule이나 hook·sandbox 같은 호스트 장치로 구성해야 합니다.
        자세한 context 선택과 오염 방지는 <a href="/ai/context-engineering">context
        engineering</a> 정본에서 다룹니다.
      </p>

      <h4>Compaction 뒤 무엇이 다시 들어오는지까지 설계한다</h4>
      <p>
        Compaction은 무한한 context를 만드는 기능이 아닙니다. 오래된 tool output과
        대화의 세부를 정리해 제한된 context 안에서 작업을 계속하도록 돕지만,
        경로·error code·미검증 가설이 요약 과정에서 빠질 수 있습니다. 현재 공식
        문서에 따르면 project root의 CLAUDE.md는 compaction 뒤 다시 주입되지만,
        nested 파일은 관련 경로를 다시 읽을 때 로드됩니다. 그래서 완료 조건과
        테스트 명령처럼 반드시 살아남아야 할 규칙은 root 지침이나 별도의 tracked
        artifact에 두고, 직전 오류는 다시 재현할 수 있어야 합니다.
      </p>
      <p>
        Auto memory는 현재 문서 기준 Claude Code v2.1.59 이상에서 제공되고 기본
        활성화되어 있습니다. Startup에는 MEMORY.md의 첫 200줄 또는 첫 25KB 중
        먼저 도달하는 범위만 들어오고, topic file은 필요할 때 읽습니다. 이 수치와
        동작은 version 전제이므로 설치된 version의 문서를 확인해야 하며, memory를
        permission policy나 정확한 사실 DB로 취급해서는 안 됩니다.
      </p>

      <div id="paper-claude-code-memory" className="not-prose scroll-mt-24">
        <CitationBlock
          source="Anthropic — How Claude remembers your project"
          citeKey={3}
          href="https://code.claude.com/docs/en/memory"
        >
          문제: project 지침, 반복해서 유용한 memory와 현재 session의 작업 상태를
          서로 다른 수명과 scope로 관리해야 합니다. 현재 기여: 공식 문서는
          managed·user·project·local CLAUDE.md의 load order, nested on-demand load,
          auto memory와 compaction 뒤 project 지침 재주입을 설명합니다. 전제: auto
          memory는 문서가 명시한 Claude Code v2.1.59+ 및 현재 client 설정을
          기준으로 하며 startup memory limit도 version에 따라 확인해야 합니다.
          근거 범위: 공개된 memory·instruction loading 동작입니다. 하지 않는 주장:
          CLAUDE.md가 보안 policy를 강제하거나 compaction이 모든 세부를 보존하고,
          auto memory가 여러 사람·machine에 자동으로 동기화되거나 무한 context를
          제공한다는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </>
  );
}

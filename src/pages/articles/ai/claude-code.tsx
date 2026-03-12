import Overview from './claude-code/Overview';
import AgentArchitecture from './claude-code/AgentArchitecture';
import ToolsPermissions from './claude-code/ToolsPermissions';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[Claude Code 공식 문서]</strong> docs.anthropic.com/en/docs/claude-code
            — 에이전트 루프, 도구 카탈로그, 권한 모델 (Ask/Auto-Allow/YOLO), MCP 통합
          </li>
          <li>
            <strong>[Claude Code 시스템 프롬프트]</strong> Claude Code CLI 내장 시스템 프롬프트 (공개)
            — 평균 21.2회 도구 호출, ~200K 토큰 컨텍스트, 서브에이전트 최대 7개 동시 실행 수치
          </li>
          <li>
            <strong>[Claude Code GitHub]</strong> github.com/anthropics/claude-code
            — Hooks 18개 라이프사이클 이벤트, 4가지 핸들러 타입 (command/http/prompt/agent)
          </li>
          <li>
            <strong>[Anthropic 보안 문서]</strong> docs.anthropic.com/en/docs/claude-code/security
            — Seatbelt (macOS) / bwrap (Linux) 샌드박싱, 프롬프트 인젝션 방어 98%, 권한 프롬프트 84% 감소
          </li>
          <li>
            <strong>[Claude Code DeepWiki]</strong> deepwiki.com/anthropics/claude-code
            — 컴팩션 메커니즘 (75-92% 트리거, 60-80% 토큰 감소), 코드 리뷰 4 병렬 에이전트
          </li>
          <li>
            <strong>[claude-code-action]</strong> github.com/anthropics/claude-code-action
            — GitHub PR/이슈 통합, @claude 멘션 기능
          </li>
          <li>
            <strong>[MCP 사양]</strong> modelcontextprotocol.io — Model Context Protocol 표준, JSON-RPC 기반 도구/리소스 프로토콜
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function ClaudeCodeArticle() {
  return (
    <>
      <Overview />
      <AgentArchitecture />
      <ToolsPermissions />
      <References />
    </>
  );
}

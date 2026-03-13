import { CitationBlock } from '../../../../components/ui/citation';

export default function AgentArchitecture() {
  return (
    <section id="agent-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전트 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 시스템</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`서브에이전트 아키텍처:

Main Agent (사용자 대화)
├── Agent("Explore") — 코드베이스 탐색 전문
│   도구: Read, Glob, Grep, Bash(읽기), WebFetch, WebSearch
│   용도: 파일 검색, 패턴 매칭, 코드 이해
│
├── Agent("Plan") — 구현 계획 설계
│   도구: Read, Glob, Grep, Bash(읽기), WebFetch, WebSearch
│   용도: 아키텍처 분석, 구현 전략 수립
│
├── Agent("general-purpose") — 범용 작업
│   도구: 전체 도구 세트
│   용도: 복잡한 멀티스텝 작업 자율 수행
│
└── 사용자 정의 에이전트
    .claude/agents/my-agent.md 파일로 정의

병렬 실행:
  Main Agent가 독립적인 서브에이전트를 동시에 실행
  예) 3개 파일을 동시에 탐색:
    Agent 1: "src/auth/ 인증 로직 분석"
    Agent 2: "src/api/ API 엔드포인트 분석"
    Agent 3: "tests/ 테스트 구조 파악"
  → 결과를 Main Agent가 종합하여 응답

백그라운드 에이전트:
  run_in_background=true로 비동기 실행
  → Main Agent는 다른 작업 계속 진행
  → 완료 시 자동 알림

제약:
  - 서브에이전트는 자신의 서브에이전트를 생성 불가 (무한 재귀 방지)
  - 부모 ↔ 자식 통신: 프롬프트 문자열 → 최종 메시지 반환만
  - 최대 7개 동시 실행 → 3개 × 200K = 600K 토큰 컨텍스트 활용`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">컨텍스트 관리</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`컨텍스트 윈도우 관리:

문제: 긴 대화에서 컨텍스트 윈도우 초과
해결: 자동 컴팩션 (compaction)

컴팩션 과정:
  1. 토큰 사용량이 ~75-92%에 도달하면 자동 트리거
  2. 대화 히스토리를 핵심 결정/컨텍스트로 요약
  3. 상세 도구 출력 삭제, 요약만 유지
  4. 60-80% 토큰 감소 (150K → 30-50K)

주의: 컴팩션은 손실 있음 (lossy)
  → 특정 파일 경로, 에러 코드, 아키텍처 결정이 소실될 수 있음

→ 무한한 대화가 가능 (컨텍스트 윈도우 제한 없음)

CLAUDE.md (프로젝트 컨텍스트):
  프로젝트 루트에 CLAUDE.md 파일로 영구 컨텍스트 제공
  - 프로젝트 구조 설명
  - 코딩 규칙
  - 빌드/테스트 명령어
  - 커스텀 지시사항
  → 매 대화 시작 시 자동 로드`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">MCP (Model Context Protocol)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`MCP 서버 통합:

MCP = 표준화된 도구/리소스 프로토콜

Claude Code ←→ MCP Server ←→ 외부 서비스
             JSON-RPC          (DB, API 등)

예시 MCP 서버:
  - GitHub MCP: PR/이슈 관리
  - PostgreSQL MCP: 데이터베이스 쿼리
  - Filesystem MCP: 파일 시스템 접근
  - Brave Search MCP: 웹 검색

설정 (.claude/settings.json):
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-github"],
        "env": { "GITHUB_TOKEN": "..." }
      }
    }
  }

→ MCP 서버의 도구가 Claude Code 도구로 등록
→ 에이전트가 자연스럽게 외부 서비스와 상호작용`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Hooks 시스템</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Hooks = 이벤트 기반 커스텀 셸 명령

18개 라이프사이클 이벤트:
  SessionStart, UserPromptSubmit,
  PreToolUse, PermissionRequest, PostToolUse, PostToolUseFailure,
  Notification, SubagentStart, SubagentStop, Stop,
  TeammateIdle, TaskCompleted, InstructionsLoaded, ConfigChange,
  WorktreeCreate, WorktreeRemove, PreCompact, SessionEnd

4가지 핸들러 타입:
  command — 셸 명령 (stdin/stdout/exit code로 통신)
  http    — URL 엔드포인트에 POST
  prompt  — 단일 턴 LLM 평가 (Haiku, ok/not-ok 반환)
  agent   — 서브에이전트 스폰 (최대 50 도구 턴)

설정 예시:
  {
    "hooks": {
      "PreToolUse": [{
        "matcher": "Bash",
        "command": "~/scripts/validate-bash.sh"
      }],
      "PostToolUse": [{
        "matcher": "Write",
        "command": "~/scripts/lint-on-write.sh"
      }]
    }
  }

활용 사례:
  - 코드 작성 후 자동 린팅
  - 위험한 명령어 차단
  - 파일 수정 시 자동 포매팅
  - 커밋 전 테스트 자동 실행`}</code>
        </pre>
        <CitationBlock source="Claude Code 공식 문서 - Hooks" citeKey={2} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/hooks">
          <p className="italic text-muted-foreground">"Hooks allow you to execute shell commands at specific points in Claude Code's lifecycle. They enable customizing behavior without modifying the core tool, running validation, formatting, notifications, and more."</p>
          <p className="mt-2 text-xs">Hooks는 18개 라이프사이클 이벤트와 4가지 핸들러 타입(command, http, prompt, agent)을 제공하여 Claude Code의 동작을 세밀하게 커스터마이징할 수 있습니다.</p>
        </CitationBlock>
        <CitationBlock source=".claude/settings.json Hook 설정 예시" citeKey={3} type="code">
          <pre className="text-xs overflow-x-auto"><code>{`{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "command": "~/scripts/validate-bash.sh"
    }],
    "PostToolUse": [{
      "matcher": "Write",
      "command": "~/scripts/lint-on-write.sh"
    }]
  }
}`}</code></pre>
          <p className="mt-2 text-xs">PreToolUse 훅으로 Bash 실행 전 검증, PostToolUse 훅으로 파일 작성 후 자동 린팅을 설정한 예시입니다. matcher로 특정 도구에만 훅을 적용할 수 있습니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}

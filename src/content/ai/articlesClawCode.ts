import type { Article } from "../types";

export const clawCodeArticles: Article[] = [
  /* ── 코어 아키텍처 ── */
  {
    slug: "claw-overview",
    title: "Claw Code 전체 아키텍처: 코딩 에이전트 하네스를 읽는 법",
    subcategory: "ai-agents-claw-core",
    sections: [
      { id: "overview", title: "프로젝트 범위와 요청 흐름" },
      { id: "crate-map", title: "Crate 수보다 책임과 의존 방향 읽기" },
      {
        id: "python-layer",
        title: "Python reference layer를 비교 기준으로 사용하기",
      },
      {
        id: "parity-harness",
        title: "Deterministic parity harness의 범위",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-overview"),
  },
  {
    slug: "claw-tool-system",
    title: "도구 시스템과 디스패치: 등록부터 권한 판정까지",
    subcategory: "ai-agents-claw-core",
    sections: [
      { id: "overview", title: "도구 시스템의 책임과 전체 흐름" },
      { id: "dispatch", title: "공통 tool dispatch 계약" },
      {
        id: "permission-gating",
        title: "권한 판정 결과를 실행 앞에서 강제하기",
      },
      { id: "plugin-tools", title: "Plugin·MCP를 공통 registry에 연결하기" },
    ],
    component: () => import("@/pages/articles/ai/claw-tool-system"),
  },
  {
    slug: "claw-session",
    title: "세션과 대화 런타임: 멀티턴 작업 상태 관리",
    subcategory: "ai-agents-claw-core",
    sections: [
      { id: "overview", title: "세션이 관리하는 네 가지 상태" },
      {
        id: "conversation-runtime",
        title: "한 turn의 commit 경계",
      },
      { id: "fork-compaction", title: "Fork·rewind와 branch merge" },
      { id: "session-control", title: "Pause·resume·shutdown lifecycle" },
    ],
    component: () => import("@/pages/articles/ai/claw-session"),
  },
  {
    slug: "claw-compaction",
    title: "컨텍스트 Compaction: 토큰 예산 안에서 작업 이어가기",
    subcategory: "ai-agents-claw-core",
    sections: [
      { id: "overview", title: "Compaction의 목적과 정보 손실" },
      { id: "compact-pipeline", title: "세션을 안전하게 줄이는 파이프라인" },
      { id: "summary-merge", title: "연속 compaction에서 이전 요약 병합하기" },
      { id: "summary-compression", title: "summary가 다시 커질 때의 2차 압축" },
    ],
    component: () => import("@/pages/articles/ai/claw-compaction"),
  },

  /* ── 보안 & 검증 ── */
  {
    slug: "claw-permissions",
    title: "권한 모델: tool call을 실행 권한으로 바꾸는 경계",
    subcategory: "ai-agents-claw-security",
    sections: [
      { id: "overview", title: "권한 판정의 전체 흐름" },
      { id: "policy", title: "Canonical action을 규칙으로 판정하기" },
      { id: "enforcer", title: "Executor 앞에서 permission 강제하기" },
      { id: "context-override", title: "범위와 만료가 있는 예외 승인" },
    ],
    component: () => import("@/pages/articles/ai/claw-permissions"),
  },
  {
    slug: "claw-bash",
    title: "Bash 실행과 검증: 셸을 안전하게 연결하는 방법",
    subcategory: "ai-agents-claw-security",
    sections: [
      { id: "overview", title: "문자열 검사와 샌드박스의 차이" },
      {
        id: "validation-pipeline",
        title: "검증 파이프라인은 입력을 줄이고 정책으로 넘긴다",
      },
      {
        id: "command-intent",
        title: "Command intent는 승인과 로깅을 돕는 분류다",
      },
      {
        id: "sandbox",
        title: "Sandbox가 실제 side effect를 제한하는 법",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-bash"),
  },
  {
    slug: "claw-file-ops",
    title: "파일 연산과 워크스페이스 경계: 안전한 I/O",
    subcategory: "ai-agents-claw-security",
    sections: [
      { id: "overview", title: "탐색·변경·경계 검사의 흐름" },
      { id: "read-write", title: "Version을 확인하는 읽기·쓰기·수정" },
      { id: "search", title: "Glob에서 grep으로 좁히는 저장소 탐색" },
      { id: "boundary", title: "실제 file open 기준의 workspace 경계" },
    ],
    component: () => import("@/pages/articles/ai/claw-file-ops"),
  },

  /* ── 라이프사이클 ── */
  {
    slug: "claw-worker-boot",
    title: "Worker 부트와 신뢰 판정: 준비 상태를 확인하는 법",
    subcategory: "ai-agents-claw-lifecycle",
    sections: [
      { id: "overview", title: "Worker 부트 상태와 불변식" },
      {
        id: "trust-resolver",
        title: "Workspace 신뢰를 실행 capability로 변환하기",
      },
      {
        id: "observe",
        title: "Process·protocol·terminal 신호로 worker 관찰하기",
      },
      {
        id: "misdelivery",
        title: "Message identity와 acknowledgement로 전달 확인하기",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-worker-boot"),
  },
  {
    slug: "claw-hooks",
    title: "Hook 시스템: Tool 실행 전후에 규칙 연결하기",
    subcategory: "ai-agents-claw-lifecycle",
    sections: [
      { id: "overview", title: "Hook의 역할과 신뢰 경계" },
      { id: "pre-post", title: "Pre 제한과 Post 관찰의 실행 순서" },
      { id: "shell-execution", title: "Hook subprocess와 JSON 프로토콜" },
      { id: "permission-override", title: "Permission을 더 엄격하게 결합하기" },
    ],
    component: () => import("@/pages/articles/ai/claw-hooks"),
  },
  {
    slug: "claw-plugin",
    title: "Plugin 시스템: 외부 기능의 등록과 생명주기",
    subcategory: "ai-agents-claw-lifecycle",
    sections: [
      { id: "overview", title: "Plugin 종류와 실행 계약" },
      { id: "registry", title: "발견·검증·활성화의 분리" },
      { id: "tool-execution", title: "제한된 subprocess protocol" },
      { id: "lifecycle", title: "Ready·Draining·Quarantined lifecycle" },
    ],
    component: () => import("@/pages/articles/ai/claw-plugin"),
  },

  /* ── 인프라 & 통합 ── */
  {
    slug: "claw-mcp",
    title: "MCP 라이프사이클: 외부 서버를 도구로 연결하기",
    subcategory: "ai-agents-claw-infra",
    sections: [
      { id: "overview", title: "MCP 연결과 tool bridge의 경계" },
      { id: "lifecycle", title: "Legacy lifecycle과 현재 specification" },
      { id: "stdio", title: "stdio transport: process와 JSON-RPC 경계" },
      { id: "tool-bridge", title: "MCP tool을 내부 실행 계약으로 바꾸기" },
    ],
    component: () => import("@/pages/articles/ai/claw-mcp"),
  },
  {
    slug: "claw-api-client",
    title: "멀티 프로바이더 API: 요청과 스트리밍 차이 흡수하기",
    subcategory: "ai-agents-claw-infra",
    sections: [
      { id: "overview", title: "Provider client의 공통 계약" },
      { id: "anthropic", title: "Anthropic block stream adapter" },
      {
        id: "openai-compat",
        title: "OpenAI-compatible을 contract test로 검증하기",
      },
      {
        id: "prompt-cache",
        title: "Stable prefix를 재사용하는 prompt caching",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-api-client"),
  },
  {
    slug: "claw-config",
    title: "설정 Cascade와 부트스트랩: 출처와 우선순위 관리",
    subcategory: "ai-agents-claw-infra",
    sections: [
      { id: "overview", title: "설정 출처·병합·검증" },
      { id: "bootstrap", title: "신뢰 경계와 bootstrap 순서" },
      { id: "oauth", title: "OAuth 2.0 + PKCE를 CLI에 연결하기" },
      { id: "remote", title: "원격 세션의 인증·권한·재연결" },
    ],
    component: () => import("@/pages/articles/ai/claw-config"),
  },
  {
    slug: "claw-cli",
    title: "CLI와 터미널 렌더링: 에이전트 런타임의 제어면",
    subcategory: "ai-agents-claw-infra",
    sections: [
      { id: "overview", title: "입력부터 다음 턴까지의 흐름" },
      { id: "slash-commands", title: "Slash command의 로컬 실행 계약" },
      { id: "rendering", title: "스트리밍 이벤트와 터미널 화면" },
      { id: "init", title: "충돌 없는 프로젝트 초기화" },
    ],
    component: () => import("@/pages/articles/ai/claw-cli"),
  },

  /* ── 오케스트레이션 ── */
  {
    slug: "claw-policy-engine",
    title: "Policy engine과 작업 Lane: 자율 실행에 규칙 넣기",
    subcategory: "ai-agents-claw-ops",
    sections: [
      { id: "overview", title: "상태 평가와 결정론적 전이" },
      { id: "rules", title: "선언적 rule과 deterministic arbitration" },
      { id: "lane-context", title: "LaneContext: 평가용 상태 snapshot" },
      {
        id: "green-contract",
        title: "GreenContract: evidence 기반 품질 게이트",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-policy-engine"),
  },
  {
    slug: "claw-recovery",
    title: "Recovery와 브랜치 관리: 재시도에서 에스컬레이션까지",
    subcategory: "ai-agents-claw-ops",
    sections: [
      { id: "overview", title: "실패 분류와 복구 흐름" },
      {
        id: "recipes",
        title: "전제·checkpoint·검증을 가진 recovery recipe",
      },
      {
        id: "stale-branch",
        title: "Stale branch를 안전하게 검토하는 법",
      },
      {
        id: "escalation",
        title: "Evidence와 선택지를 전달하는 escalation",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-recovery"),
  },
  {
    slug: "claw-task-team",
    title: "Task와 Team 관리: 검증 가능한 작업 계약 만들기",
    subcategory: "ai-agents-claw-ops",
    sections: [
      { id: "overview", title: "TaskPacket의 목적과 구성" },
      {
        id: "registry",
        title: "Task registry가 상태 전이와 evidence를 소유하는 법",
      },
      {
        id: "team-cron",
        title: "Team routing과 cron task 생성",
      },
      {
        id: "validation",
        title: "등록·실행·완료의 task validation",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-task-team"),
  },
  {
    slug: "claw-subagent-orchestration",
    title: "Sub-agent 오케스트레이션: 분해·격리·검증",
    subcategory: "ai-agents-claw-ops",
    sections: [
      { id: "overview", title: "Sub-agent가 유용한 조건" },
      {
        id: "team-lead-workers",
        title: "Main·coordinator·worker의 책임 분리",
      },
      {
        id: "agent-selection",
        title: "작업 경계와 capability로 agent 선택하기",
      },
      {
        id: "guardrails",
        title: "Runtime이 강제하는 guardrail",
      },
    ],
    component: () => import("@/pages/articles/ai/claw-subagent-orchestration"),
  },
  {
    slug: "claw-telemetry",
    title: "Telemetry와 모니터링: 세션 실행 증거 남기기",
    subcategory: "ai-agents-claw-ops",
    sections: [
      { id: "overview", title: "관측 신호와 개인정보 경계" },
      { id: "session-tracer", title: "Session trace와 집계 설계" },
      { id: "usage", title: "Token usage와 비용 원장" },
    ],
    component: () => import("@/pages/articles/ai/claw-telemetry"),
  },
];

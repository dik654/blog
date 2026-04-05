import type { Article } from '../types';

export const clawCodeArticles: Article[] = [
  /* ── 코어 아키텍처 ── */
  {
    slug: 'claw-overview',
    title: 'Claw Code 전체 아키텍처: Claude Code 하네스의 클린룸 재구현',
    subcategory: 'ai-agents-claw-core',
    sections: [
      { id: 'overview', title: '프로젝트 배경 & 코드베이스 구조' },
      { id: 'crate-map', title: '9개 크레이트 맵' },
      { id: 'python-layer', title: 'Python 레이어: 패리티 추적 엔진' },
      { id: 'parity-harness', title: 'Mock 패리티 하네스' },
    ],
    component: () => import('@/pages/articles/ai/claw-overview'),
  },
  {
    slug: 'claw-tool-system',
    title: '도구 시스템 & 디스패치: 40개 도구의 등록·실행·게이팅',
    subcategory: 'ai-agents-claw-core',
    sections: [
      { id: 'overview', title: '도구 스펙 & 레지스트리' },
      { id: 'dispatch', title: 'execute_tool() 디스패치 파이프라인' },
      { id: 'permission-gating', title: '도구별 권한 게이팅' },
      { id: 'plugin-tools', title: '플러그인 도구 통합' },
    ],
    component: () => import('@/pages/articles/ai/claw-tool-system'),
  },
  {
    slug: 'claw-session',
    title: '세션 & 대화 런타임: 멀티턴 에이전트 상태 관리',
    subcategory: 'ai-agents-claw-core',
    sections: [
      { id: 'overview', title: 'Session 구조 & 메시지 모델' },
      { id: 'conversation-runtime', title: 'ConversationRuntime 오케스트레이션' },
      { id: 'fork-compaction', title: '세션 포크 & 컴팩션' },
      { id: 'session-control', title: 'SessionController 라이프사이클' },
    ],
    component: () => import('@/pages/articles/ai/claw-session'),
  },
  {
    slug: 'claw-compaction',
    title: '컨텍스트 압축: 토큰 예산 관리 & 요약 생성',
    subcategory: 'ai-agents-claw-core',
    sections: [
      { id: 'overview', title: '압축이 필요한 이유 & 전략' },
      { id: 'compact-pipeline', title: 'compact_session() 파이프라인' },
      { id: 'summary-merge', title: '요약 병합 & 연속 압축' },
      { id: 'summary-compression', title: 'SummaryCompressor 보조 압축' },
    ],
    component: () => import('@/pages/articles/ai/claw-compaction'),
  },

  /* ── 보안 & 검증 ── */
  {
    slug: 'claw-permissions',
    title: '권한 모델 & 정책 엔진: 다층 권한 게이팅',
    subcategory: 'ai-agents-claw-security',
    sections: [
      { id: 'overview', title: 'PermissionMode & 권한 계층' },
      { id: 'policy', title: 'PermissionPolicy: 규칙 기반 판정' },
      { id: 'enforcer', title: 'PermissionEnforcer: 런타임 강제' },
      { id: 'context-override', title: '컨텍스트 오버라이드 & 훅 연동' },
    ],
    component: () => import('@/pages/articles/ai/claw-permissions'),
  },
  {
    slug: 'claw-bash',
    title: 'Bash 실행 & 검증: 6단계 안전 파이프라인',
    subcategory: 'ai-agents-claw-security',
    sections: [
      { id: 'overview', title: 'Bash 실행 흐름 & 샌드박스' },
      { id: 'validation-pipeline', title: '6단계 검증 파이프라인' },
      { id: 'command-intent', title: 'CommandIntent 분류 & 파괴적 명령어 탐지' },
      { id: 'sandbox', title: 'Linux 샌드박스: bubblewrap & 컨테이너 감지' },
    ],
    component: () => import('@/pages/articles/ai/claw-bash'),
  },
  {
    slug: 'claw-file-ops',
    title: '파일 연산 & 워크스페이스 경계: 안전한 I/O',
    subcategory: 'ai-agents-claw-security',
    sections: [
      { id: 'overview', title: '파일 연산 개요 & 보안 모델' },
      { id: 'read-write', title: 'read_file / write_file / edit_file 구현' },
      { id: 'search', title: 'glob_search & grep_search' },
      { id: 'boundary', title: '워크스페이스 경계 검증 & 심링크 이스케이프' },
    ],
    component: () => import('@/pages/articles/ai/claw-file-ops'),
  },

  /* ── 라이프사이클 ── */
  {
    slug: 'claw-worker-boot',
    title: '워커 부트 & 신뢰 해결: 8단계 상태 머신',
    subcategory: 'ai-agents-claw-lifecycle',
    sections: [
      { id: 'overview', title: 'WorkerStatus 상태 머신' },
      { id: 'trust-resolver', title: 'TrustResolver: 경로 기반 신뢰 판정' },
      { id: 'observe', title: 'observe(): 화면 텍스트 기반 상태 추론' },
      { id: 'misdelivery', title: '프롬프트 미스딜리버리 탐지 & 복구' },
    ],
    component: () => import('@/pages/articles/ai/claw-worker-boot'),
  },
  {
    slug: 'claw-hooks',
    title: '훅 시스템: Pre/Post Tool 실행 미들웨어',
    subcategory: 'ai-agents-claw-lifecycle',
    sections: [
      { id: 'overview', title: 'HookRunner 아키텍처' },
      { id: 'pre-post', title: 'PreToolUse / PostToolUse 흐름' },
      { id: 'shell-execution', title: '셸 프로세스 실행 & JSON 프로토콜' },
      { id: 'permission-override', title: '권한 오버라이드 & 중단 시그널' },
    ],
    component: () => import('@/pages/articles/ai/claw-hooks'),
  },
  {
    slug: 'claw-plugin',
    title: '플러그인 시스템: 서브프로세스 격리 & 라이프사이클',
    subcategory: 'ai-agents-claw-lifecycle',
    sections: [
      { id: 'overview', title: 'PluginKind & 매니페스트 구조' },
      { id: 'registry', title: 'PluginRegistry: 발견·등록·활성화' },
      { id: 'tool-execution', title: '플러그인 도구 서브프로세스 실행' },
      { id: 'lifecycle', title: 'PluginLifecycle: 상태 & 헬스체크' },
    ],
    component: () => import('@/pages/articles/ai/claw-plugin'),
  },

  /* ── 인프라 & 통합 ── */
  {
    slug: 'claw-mcp',
    title: 'MCP 라이프사이클: 11단계 상태 머신 & stdio JSON-RPC',
    subcategory: 'ai-agents-claw-infra',
    sections: [
      { id: 'overview', title: 'MCP 모듈 전체 구조' },
      { id: 'lifecycle', title: 'McpLifecycleValidator: 11단계 상태 전이' },
      { id: 'stdio', title: 'McpStdioProcess: 프로세스 관리 & JSON-RPC' },
      { id: 'tool-bridge', title: 'McpToolRegistry: 도구 브릿지' },
    ],
    component: () => import('@/pages/articles/ai/claw-mcp'),
  },
  {
    slug: 'claw-api-client',
    title: '멀티 프로바이더 API: Anthropic·OpenAI·Xai 통합',
    subcategory: 'ai-agents-claw-infra',
    sections: [
      { id: 'overview', title: 'ProviderClient 추상화' },
      { id: 'anthropic', title: 'AnthropicClient: OAuth & 스트리밍' },
      { id: 'openai-compat', title: 'OpenAI 호환 클라이언트 & 포맷 변환' },
      { id: 'prompt-cache', title: 'PromptCache: 토큰 절약 전략' },
    ],
    component: () => import('@/pages/articles/ai/claw-api-client'),
  },
  {
    slug: 'claw-config',
    title: '설정 캐스케이드 & 부트스트랩: 12단계 시작 시퀀스',
    subcategory: 'ai-agents-claw-infra',
    sections: [
      { id: 'overview', title: 'ConfigLoader & 3단계 캐스케이드' },
      { id: 'bootstrap', title: 'BootstrapPhase: 12단계 시작 시퀀스' },
      { id: 'oauth', title: 'OAuth 2.0 + PKCE 인증 흐름' },
      { id: 'remote', title: '원격 세션 & 업스트림 프록시' },
    ],
    component: () => import('@/pages/articles/ai/claw-config'),
  },
  {
    slug: 'claw-cli',
    title: 'CLI & 터미널 렌더링: REPL·슬래시 명령·마크다운',
    subcategory: 'ai-agents-claw-infra',
    sections: [
      { id: 'overview', title: 'CLI 진입점 & REPL 루프' },
      { id: 'slash-commands', title: '슬래시 명령 시스템' },
      { id: 'rendering', title: '마크다운 → ANSI 렌더링' },
      { id: 'init', title: '프로젝트 초기화 & 감지' },
    ],
    component: () => import('@/pages/articles/ai/claw-cli'),
  },

  /* ── 오케스트레이션 ── */
  {
    slug: 'claw-policy-engine',
    title: '정책 엔진 & 레인 관리: 자율 코딩 자동화',
    subcategory: 'ai-agents-claw-ops',
    sections: [
      { id: 'overview', title: 'PolicyEngine 아키텍처' },
      { id: 'rules', title: 'PolicyRule & PolicyCondition 선언적 규칙' },
      { id: 'lane-context', title: 'LaneContext: 레인 상태 평가' },
      { id: 'green-contract', title: 'GreenContract: 빌드 품질 게이트' },
    ],
    component: () => import('@/pages/articles/ai/claw-policy-engine'),
  },
  {
    slug: 'claw-recovery',
    title: '복구 레시피 & 브랜치 관리: 자동 회복 전략',
    subcategory: 'ai-agents-claw-ops',
    sections: [
      { id: 'overview', title: '복구 시스템 개요' },
      { id: 'recipes', title: 'RecoveryRecipe: 시나리오별 복구 절차' },
      { id: 'stale-branch', title: 'StaleBranch: 브랜치 신선도 관리' },
      { id: 'escalation', title: '에스컬레이션 정책 & 이벤트' },
    ],
    component: () => import('@/pages/articles/ai/claw-recovery'),
  },
  {
    slug: 'claw-task-team',
    title: '태스크 & 팀 관리: 구조화된 작업 명세 & 크론',
    subcategory: 'ai-agents-claw-ops',
    sections: [
      { id: 'overview', title: 'TaskPacket 구조화된 작업 명세' },
      { id: 'registry', title: 'TaskRegistry: 인메모리 태스크 CRUD' },
      { id: 'team-cron', title: 'TeamCronRegistry: 팀 & 크론 관리' },
      { id: 'validation', title: '패킷 검증 & 스코프 해석' },
    ],
    component: () => import('@/pages/articles/ai/claw-task-team'),
  },
  {
    slug: 'claw-subagent-orchestration',
    title: '서브에이전트 오케스트레이션: 팀리드·워커·일탈 방지',
    subcategory: 'ai-agents-claw-ops',
    sections: [
      { id: 'overview', title: '에이전틱 AI 오케스트레이션 개요' },
      { id: 'team-lead-workers', title: '팀리드 코디네이터 & 워커 구조' },
      { id: 'agent-selection', title: '베스트11 — 태스크별 에이전트 선택' },
      { id: 'guardrails', title: '가드레일 — 일탈 방지 & 권한 회수' },
    ],
    component: () => import('@/pages/articles/ai/claw-subagent-orchestration'),
  },
  {
    slug: 'claw-telemetry',
    title: '텔레메트리 & 모니터링: 세션 추적·비용 추정·SSE',
    subcategory: 'ai-agents-claw-ops',
    sections: [
      { id: 'overview', title: '텔레메트리 아키텍처' },
      { id: 'session-tracer', title: 'SessionTracer & TelemetrySink' },
      { id: 'usage', title: 'UsageTracker: 토큰 사용량 & 비용 추정' },
      { id: 'sse', title: 'SSE 파서: 서버 전송 이벤트 처리' },
    ],
    component: () => import('@/pages/articles/ai/claw-telemetry'),
  },
];

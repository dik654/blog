import type { Article } from "../types";

export const agentArticles: Article[] = [
  /* ── 1. 프롬프트 기초 ── */
  {
    slug: "prompt-engineering",
    title: "프롬프트 엔지니어링: 패턴과 안티패턴",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "요청의 조건과 출력 형식 설계하기" },
      { id: "chain-of-thought", title: "Chain-of-Thought & 추론 유도" },
      { id: "structured-output", title: "구조화된 출력" },
      { id: "few-shot", title: "Few-shot 예시 설계" },
      { id: "anti-patterns", title: "안티패턴 & 트러블슈팅" },
    ],
    component: () => import("@/pages/articles/ai/prompt-engineering"),
  },
  {
    slug: "xml-prompting",
    title: "XML 프롬프팅: 역할 경계·파싱·보안",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "XML 태그가 해결하는 문제와 한계" },
      { id: "basic-tags", title: "Root·중첩·escaping부터 시작하기" },
      { id: "advanced-tags", title: "여러 문서·예시와 runtime 경계" },
      { id: "parsing", title: "Parser·schema·의미 검증" },
      { id: "best-practices", title: "형식 비교와 배포 전 평가" },
    ],
    component: () => import("@/pages/articles/ai/xml-prompting"),
  },

  /* ── 2. 컨텍스트 & 도구 연결 ── */
  {
    slug: "context-engineering",
    title: "컨텍스트 엔지니어링: LLM 성능의 진짜 레버",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "필요한 정보를 골라 배치하기" },
      { id: "system-prompt", title: "시스템 프롬프트 설계" },
      { id: "rag", title: "RAG: 검색 증강 생성" },
      { id: "memory", title: "대화 메모리 패턴" },
      { id: "optimization", title: "컨텍스트 윈도우 최적화" },
    ],
    component: () => import("@/pages/articles/ai/context-engineering"),
  },
  {
    slug: "mcp-protocol",
    title: "MCP 기초: Host · Client · Server와 Stateless Core",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "MCP가 해결하는 연결 문제" },
      { id: "roles", title: "Host · Client · Server 한 역할씩" },
      { id: "request-envelope", title: "Stateless request와 explicit handle" },
      { id: "next-map", title: "Primitive · transport · 운영으로 확장" },
    ],
    component: () => import("@/pages/articles/ai/mcp-protocol"),
  },
  {
    slug: "mcp-primitives",
    title: "MCP Primitives: Tool · Resource · Prompt",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Primitive를 control 방식으로 구분" },
      { id: "three-primitives", title: "Tool · Resource · Prompt의 형태" },
      { id: "tool-contract", title: "Schema · result · input required" },
      { id: "list-cache", title: "목록 cache와 실행 권한 분리" },
    ],
    component: () => import("@/pages/articles/ai/mcp-primitives"),
  },
  {
    slug: "mcp-transports",
    title: "MCP Transports: stdio · Streamable HTTP",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Message와 운반 경로 분리" },
      { id: "stdio", title: "Local child process와 pipe" },
      { id: "streamable-http", title: "Remote endpoint와 routing" },
      { id: "lifetimes", title: "Response · cancel · subscription 수명" },
    ],
    component: () => import("@/pages/articles/ai/mcp-transports"),
  },
  {
    slug: "mcp-server-operations",
    title: "MCP Server 운영: Authorization · Retry · Receipt",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Proposal에서 effect까지" },
      { id: "authorization", title: "네 단계 trust gate" },
      { id: "retry-receipt", title: "Operation ID와 effect receipt" },
      { id: "release", title: "Extension · failure · rollback" },
    ],
    component: () => import("@/pages/articles/ai/mcp-server-operations"),
  },

  /* ── 3. 에이전트 패턴 & 하네스 ── */
  {
    slug: "agentic-patterns",
    title: "에이전틱 패턴: ReAct에서 멀티에이전트까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Agent run·state·패턴 선택" },
      { id: "react", title: "Observation loop·tool 경계" },
      { id: "plan-execute", title: "Plan state·verification·reflection" },
      { id: "multi-agent", title: "Delegation·ownership·merge" },
      { id: "hooks-skills", title: "Hook·Skill·Guardrail·평가" },
    ],
    component: () => import("@/pages/articles/ai/agentic-patterns"),
  },
  {
    slug: "llm-harness",
    title: "LLM 하네스 엔지니어링: 모델을 제품으로",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "모델과 하네스의 책임 경계" },
      { id: "composition", title: "실행 가능한 run contract" },
      { id: "evaluation", title: "Artifact·trajectory·side effect 평가" },
      { id: "iteration", title: "Trace에서 회귀 테스트까지" },
      { id: "patterns", title: "Workflow·loop·checkpoint graph 선택" },
    ],
    component: () => import("@/pages/articles/ai/llm-harness"),
  },
  {
    slug: "agent-code-mode",
    title: "Code Mode: 도구 호출을 프로그램으로 묶는 에이전트 실행 패턴",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Code Mode란 무엇인가" },
      { id: "cost-model", title: "왜 토큰이 줄어드는가" },
      { id: "execution", title: "실행 파이프라인" },
      { id: "security", title: "샌드박스와 권한 경계" },
      { id: "decision", title: "언제 쓰고 언제 쓰지 않는가" },
    ],
    component: () => import("@/pages/articles/ai/agent-code-mode"),
  },
  {
    slug: "agent-sandbox-security",
    title: "AI 에이전트 샌드박스: egress·credential·kernel 경계 설계",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "경고보다 공격 경로를 본다" },
      { id: "threat-signals", title: "신호와 실제 영향 구분" },
      { id: "runtime", title: "runc·seccomp·gVisor·Kata" },
      { id: "kubernetes", title: "Kubernetes 기본 경계" },
      { id: "egress", title: "Egress와 FQDN 정책" },
      { id: "gpu", title: "GPU 격리의 예외" },
      { id: "decision", title: "워크로드별 선택" },
    ],
    component: () => import("@/pages/articles/ai/agent-sandbox-security"),
  },
  {
    slug: "skills-anatomy",
    title: "Agent Skills 해부: Trigger에서 Distribution까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Tool · Skill · Plugin 역할" },
      { id: "format", title: "SKILL.md와 선택 resource" },
      { id: "loading", title: "Progressive disclosure와 trigger" },
      { id: "execution", title: "Permission을 보존하는 실행 흐름" },
      { id: "registry", title: "Codex scope와 plugin distribution" },
    ],
    component: () => import("@/pages/articles/ai/skills-anatomy"),
  },

  /* ── 4. 프레임워크 & 실제 구현체 ── */
  {
    slug: "agent-frameworks",
    title: "에이전트 프레임워크: 직접 구현부터 Durable Runtime까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "직접 Tool Loop와 Framework 경계" },
      { id: "langchain", title: "State·Checkpoint·Interrupt" },
      { id: "comparison", title: "요구사항과 복구 비용으로 비교하기" },
    ],
    component: () => import("@/pages/articles/ai/agent-frameworks"),
  },
  {
    slug: "claude-code",
    title: "Claude Code: Workspace·Context·Permission·Hooks",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Coding Agent Harness와 실행 Loop" },
      { id: "agent-architecture", title: "Context·Delegation·Extension 경계" },
      { id: "tools-permissions", title: "Tool·Permission·Hook·Checkpoint" },
    ],
    component: () => import("@/pages/articles/ai/claude-code"),
  },
  {
    slug: "qwen-korean-consistency",
    title: "Qwen 한국어 일관성: 진단·Smoothing·Post-training",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "언어 혼용을 먼저 진단하기" },
      { id: "prompt-level", title: "Prompt policy의 역할과 한계" },
      {
        id: "smoothie-qwen",
        title: "Smoothie-Qwen: lm_head row scaling",
      },
      { id: "rl-approach", title: "SFT와 Oracle-guided Dr.GRPO" },
      { id: "runtime-guard", title: "Checker·Judge·Bounded retry" },
      { id: "decision-matrix", title: "Paired evaluation과 배포 결정" },
    ],
    component: () => import("@/pages/articles/ai/qwen-korean-consistency"),
  },
  {
    slug: "openclaw-assistant",
    title: "OpenClaw: Gateway·Session·Runtime·Sandbox 경계",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Inbound event와 Gateway 책임" },
      { id: "routing-sessions", title: "Binding·Agent·Session 격리" },
      { id: "runtime-resources", title: "Provider·Model·Runtime·Resource" },
      { id: "security-reply", title: "Tool policy·Sandbox·Reply route" },
    ],
    component: () => import("@/pages/articles/ai/openclaw-assistant"),
  },
];

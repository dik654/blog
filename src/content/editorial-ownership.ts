export type EvidenceClass =
  "standard" | "primary-source" | "project-measurement" | "project-claim";

export interface ConceptLink {
  label: string;
  href: string;
}

export interface EditorialBoundary {
  title: string;
  owns: readonly string[];
  reuses: readonly ConceptLink[];
  evidence: readonly {
    kind: EvidenceClass;
    rule: string;
  }[];
}

/**
 * 새 글이 기존 개념을 다시 정의하지 않도록 콘텐츠 소유권을 한곳에 둔다.
 * 신규 주제가 추가되면 먼저 이 manifest에서 소유 글과 참조 글을 정한 뒤 본문을 확장한다.
 */
export const EDITORIAL_BOUNDARIES = {
  "cuda-thread-hierarchy": {
    title: "CUDA thread hierarchy 글이 소유하는 범위",
    owns: [
      "Grid·block·thread launch hierarchy와 warp·SIMT hardware execution 경계",
      "Block resource usage와 SM placement·resident warp trade-off",
      "1D·2D global index, ceiling division, boundary-safe row-major mapping",
    ],
    reuses: [
      {
        label: "Shared-memory transaction과 data layout",
        href: "/gpu/cuda-shared-memory",
      },
      {
        label: "Barrier·stream·event ordering",
        href: "/gpu/cuda-sync-streams",
      },
      {
        label: "Hopper cluster·TMA architecture",
        href: "/gpu/gpu-arch-hopper",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Warp size·block/cluster limit·built-in variable semantics는 확인 시점 CUDA Programming Guide와 target device property를 함께 기록한다.",
      },
      {
        kind: "project-measurement",
        rule: "Block size 우위는 같은 kernel·input·compiler·GPU에서 occupancy·warp stall·memory throughput·kernel time을 paired 비교한 결과에만 귀속한다.",
      },
    ],
  },
  "cuda-shared-memory": {
    title: "CUDA shared memory 글이 소유하는 범위",
    owns: [
      "Block-shared scratchpad의 stage·barrier·reuse·capacity 비용",
      "Global coalescing의 32-byte transaction·useful-byte 해석",
      "Shared-memory bank mapping·broadcast·padding과 AoS·SoA layout 선택",
    ],
    reuses: [
      {
        label: "Grid·block·warp·global index",
        href: "/gpu/cuda-thread-hierarchy",
      },
      {
        label: "Block barrier와 memory visibility",
        href: "/gpu/cuda-sync-streams#overview",
      },
      {
        label: "Tiled matrix multiplication 적용",
        href: "/gpu/cuda-matrix-multiply",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Transaction segment와 bank mapping은 CUDA Programming Guide의 current architecture 범위로 제한하고 고정 latency·speedup 수치를 보편 법칙으로 쓰지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Padding·SoA·tiling 이득은 target GPU에서 transaction·bank-conflict·occupancy·kernel/end-to-end time을 함께 비교한다.",
      },
    ],
  },
  "cuda-sync-streams": {
    title: "CUDA synchronization·streams 글이 소유하는 범위",
    owns: [
      "Warp·block·stream·device synchronization scope와 visibility·atomicity 경계",
      "Stream in-order queue·pinned transfer·hardware overlap과 pipeline 하한",
      "Event dependency·timing semantics와 multi-GPU resource ownership·P2P capability",
    ],
    reuses: [
      {
        label: "Thread block과 warp execution",
        href: "/gpu/cuda-thread-hierarchy",
      },
      {
        label: "Shared-memory staging과 bank conflict",
        href: "/gpu/cuda-shared-memory",
      },
      {
        label: "GPU–HCA·collective topology",
        href: "/gpu/hw-network#gpudirect-topology",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Default stream·event·multi-GPU API semantics는 CUDA version·creation flag·owning device와 함께 기록한다.",
      },
      {
        kind: "project-measurement",
        rule: "Overlap과 scale-out은 Nsight timeline·copy/compute/idle time·link counter·correctness reference로 실측한다.",
      },
    ],
  },
  "math-differential-equations-numerical-solvers": {
    title: "미분방정식·수치적분 글이 소유하는 범위",
    owns: [
      "초기값 문제·vector field·trajectory의 구분",
      "Euler·Heun method의 update와 local/global discretization error",
      "Linear test equation에서 step size가 만드는 numerical stability 조건",
      "ODE와 Itô SDE의 경계·Brownian increment·Euler–Maruyama의 최소 해석",
    ],
    reuses: [
      {
        label: "함수·미분·local linearity",
        href: "/ai/math-functions-derivatives-gradients",
      },
      {
        label: "확률변수·Gaussian variance",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "지수함수", href: "/ai/math-exponents-logarithms" },
      {
        label: "Diffusion·score·flow의 적용",
        href: "/ai/diffusion-models",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "수치해석의 order와 stability는 method·regularity·norm·step-size 조건을 함께 적고 보편적 정확도 보장으로 확대하지 않는다.",
      },
      {
        kind: "standard",
        rule: "ODE·Itô SDE·discretization의 시간·state 단위와 deterministic/stochastic trajectory를 구분한다.",
      },
    ],
  },
  "agentic-patterns": {
    title: "에이전틱 패턴 글이 소유하는 범위",
    owns: [
      "Model proposal·runtime authorization·tool execution·observation·exit로 이어지는 agent run state",
      "ReAct observation loop와 plan/checkpoint/replanning/reflection의 control-flow 경계",
      "Multi-agent delegation contract·state ownership·manager/handoff/parallel merge 선택",
      "Hook·Skill·Guardrail·Verifier의 실행 시점과 answer·trajectory·side-effect 평가 층",
    ],
    reuses: [
      { label: "하네스 실행 계약과 개선 loop", href: "/ai/llm-harness" },
      {
        label: "Multi-agent runtime 구현",
        href: "/ai/multi-agent-implementation",
      },
      { label: "Skill authoring format", href: "/ai/skills-anatomy" },
      { label: "Agent sandbox 보안", href: "/ai/agent-sandbox-security" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "ReAct·Reflexion claim은 각 논문의 task·feedback·evaluation 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Tool schema·permission·state transition·artifact·exit condition은 runtime에서 검증 가능한 계약으로 표현한다.",
      },
    ],
  },
  "agent-frameworks": {
    title: "Agent framework 글이 소유하는 범위",
    owns: [
      "직접 SDK·작은 tool loop와 framework runtime을 workload 요구사항으로 나누는 선택 경계",
      "Durable execution state·checkpoint/replay·interrupt/resume를 framework runtime 관점에서 비교하는 기준",
      "LangGraph·LlamaIndex·AutoGen AgentChat·CrewAI Crew/Flow의 capability requirement matrix",
      "Framework·state schema·serializer·checkpointer version migration과 paired eval·canary·rollback 계약",
    ],
    reuses: [
      {
        label: "ReAct state·action·observation과 exit state",
        href: "/ai/agentic-patterns#react",
      },
      {
        label: "Objective·authority·artifact·verifier·workflow/checkpoint 경계",
        href: "/ai/llm-harness",
      },
      {
        label: "LangGraph state/node/edge/reducer와 replay-safe side effect",
        href: "/ai/multi-agent-implementation#langgraph",
      },
      {
        label: "Multi-agent delegation·join·Crew/Flow 구현",
        href: "/ai/multi-agent-implementation",
      },
      {
        label: "RAG data source·citation·retrieval pipeline",
        href: "/ai/rag-pipeline",
      },
      {
        label: "Tool permission·credential·egress·sandbox",
        href: "/ai/agent-sandbox-security",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "ReAct claim은 원 논문의 task·model·prompt 조건으로, framework 기능은 확인 시점 공식 문서와 설치 version으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Framework API가 제공하는 persistence와 application이 보장해야 하는 idempotency·authorization·domain verification을 구분한다.",
      },
      {
        kind: "project-measurement",
        rule: "Framework 우위는 동일 workload·model·tool·validator에서 quality·completion·latency·token·effect duplication을 paired 비교한 결과에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "Capability matrix는 현재 version snapshot이며 LangGraph·CrewAI를 포함한 각 runtime의 persistence·resume 기능을 정기적으로 다시 확인한다.",
      },
    ],
  },
  "claude-code": {
    title: "Claude Code 글이 소유하는 범위",
    owns: [
      "Claude model과 repository workspace를 잇는 Claude Code 제품 하네스·session·tool 실행 경계",
      "Managed·user·project·local CLAUDE.md와 ancestor·lazy descendant·auto memory·compaction의 제품별 발견 순서",
      "Main/subagent의 별도 context·tool authority·permission·summary·artifact handoff 계약",
      "Built-in tool registry와 deny→ask→allow permission·PreToolUse hook decision의 현재 판정 순서",
      "Claude Code lifecycle event·matcher·handler·JSON input/output·timeout을 포함한 hook 계약",
      "Direct file-edit snapshot·conversation rewind와 Bash·subagent·external effect를 나누는 checkpoint 경계",
    ],
    reuses: [
      {
        label: "Agent observation/action loop·delegation·hook taxonomy",
        href: "/ai/agentic-patterns",
      },
      {
        label:
          "하네스 objective·context·capability·artifact·verifier·recovery 계약",
        href: "/ai/llm-harness",
      },
      {
        label:
          "Context discovery·memory·compaction·instruction/data/enforcement",
        href: "/ai/context-engineering",
      },
      {
        label:
          "Skill authoring·progressive disclosure·permission non-escalation",
        href: "/ai/skills-anatomy",
      },
      {
        label: "MCP tool·resource·prompt·runtime capability 경계",
        href: "/ai/mcp-protocol",
      },
      {
        label: "OS·container·credential·egress·network sandbox",
        href: "/ai/agent-sandbox-security",
      },
      {
        label: "Claude Code IDE integration",
        href: "https://code.claude.com/docs/en/vs-code",
      },
      {
        label: "Claude Code GitHub Actions integration",
        href: "https://code.claude.com/docs/en/github-actions",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "제품의 instruction loading·subagent·tool·permission·hook·checkpoint 동작은 확인 시점의 code.claude.com 공식 문서와 실제 설치 version에만 귀속한다.",
      },
      {
        kind: "standard",
        rule: "CLAUDE.md·auto memory는 context이고 permission enforcement가 아니며, checkpoint는 direct file edit 복구이지 Git·transaction·external effect rollback이 아님을 항상 함께 밝힌다.",
      },
      {
        kind: "project-measurement",
        rule: "CLAUDE.md·subagent·permission·hook의 개선 효과는 같은 model/version·repository snapshot·bug fixture·test oracle에서 최소 diff·성공률·unauthorized effect·trajectory·latency·token을 paired 비교한다.",
      },
      {
        kind: "project-claim",
        rule: "Auto memory는 v2.1.59+ 경계를 기록하고 hook event/type 지원은 동적 version surface로 다루며, 고정된 hook 개수나 보편적 성능 향상을 주장하지 않는다.",
      },
    ],
  },
  "qwen-korean-consistency": {
    title: "Qwen 한국어 일관성 글이 소유하는 범위",
    owns: [
      "Qwen의 한국어 reasoning/final language mismatch와 정상 번역·원문·고유명사 예외를 나누는 적용 진단",
      "한국어 기본 출력과 code·수식·인용·사용자 지정 번역 예외를 함께 둔 Qwen prompt policy",
      "Smoothie-Qwen의 Unicode·broken-token risk score와 lm_head row scaling 식·부작용·재현 범위",
      "Qwen3 14B Korean reasoning SFT→Oracle-Guided Dr.GRPO 사례의 stage·reward·oracle 적용 경계",
      "Korean language checker·judge threshold calibration과 base/candidate paired canary·rollback 계약",
    ],
    reuses: [
      {
        label: "Code point·grapheme·UTF-8·Unicode normalization",
        href: "/ai/text-unicode-encoding",
      },
      {
        label: "Tokenizer pipeline·vocabulary·checkpoint compatibility",
        href: "/ai/tokenizer",
      },
      {
        label: "lm_head language-model policy와 output projection",
        href: "/ai/transformer-architecture#output-head",
      },
      {
        label: "Logit·softmax normalization과 class coupling",
        href: "/ai/backprop-optimization#softmax",
      },
      {
        label: "Prompt contract·few-shot·model-version regression",
        href: "/ai/prompt-engineering",
      },
      {
        label: "SFT demonstration·response-only loss·data contract",
        href: "/ai/supervised-fine-tuning",
      },
      {
        label: "Online rollout·reward·reference/KL와 RLHF 경계",
        href: "/ai/rlhf",
      },
      {
        label: "GRPO·Dr.GRPO·verifier·sampling evaluation",
        href: "/ai/open-r1",
      },
      {
        label: "Metric·threshold·guardrail·uncertainty",
        href: "/ai/evaluation-metrics",
      },
      {
        label: "Run·artifact provenance와 reproducibility",
        href: "/ai/experiment-tracking",
      },
      {
        label: "Layered deterministic·judge·human verification",
        href: "/ai/llm-harness#evaluation",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Qwen3 제품 범위는 Qwen 공식 release에, Smoothie와 Korean SFT/RL algorithm·수치는 각 논문과 공개 code의 checkpoint·data·reward·evaluation 조건에만 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Unicode/script·token ID·language intent·lm_head logit·softmax probability를 서로 다른 관측으로 유지하고, row scaling을 probability 직접 scaling이나 language-confusion root-cause 증명으로 표현하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Intervention은 같은 immutable base/tokenizer/template/thinking mode·prompt·sampling에서 reasoning/final mismatch·정상 번역 보존·task quality·latency/cost를 pair별로 비교하고 human-labeled exception slice로 checker/judge를 calibration한다.",
      },
      {
        kind: "project-claim",
        rule: "배포 주장은 base/candidate artifact·prompt·checker·judge·dataset provenance가 있는 canary에 한하며 hard guardrail 회귀 시 이전 version으로 rollback할 수 있어야 한다.",
      },
    ],
  },
  "openclaw-assistant": {
    title: "OpenClaw assistant 글이 소유하는 범위",
    owns: [
      "Channel event를 Gateway envelope로 받아 deterministic binding·default agent로 연결하는 OpenClaw 제품 routing",
      "Agent가 소유하는 session key·dmScope·identity link·reply route와 authorization·tenant isolation의 경계",
      "Provider·model resolution 뒤 model/provider-scoped policy로 built-in 또는 plugin agent runtime을 고르는 현재 순서",
      "OpenClaw runtime generation의 extension·tool·Skill·prompt·theme discovery와 workspace/package resource loading",
      "Tool allow/deny→sandbox mode/scope/backend→elevated host/node escape path의 제품별 판정 경계",
      "Gateway reply route·idempotency key·outbound terminal state·ack/dead-letter/reconciliation·bounded audit·rejected request non-replay 경계",
      "Legacy `pi` config와 `runEmbeddedPiAgent(...)` plugin helper를 현행 public OpenClaw 표기로 이관하는 계약",
    ],
    reuses: [
      {
        label: "Agent state·action·observation loop와 exit state",
        href: "/ai/agentic-patterns#react",
      },
      {
        label:
          "Harness objective·context·capability·artifact·verification 경계",
        href: "/ai/llm-harness",
      },
      {
        label: "Working state·memory·compaction·context provenance",
        href: "/ai/context-engineering",
      },
      {
        label: "Tool·Skill·Plugin과 scope·permission non-escalation",
        href: "/ai/skills-anatomy",
      },
      {
        label: "MCP Tool·Resource·Prompt와 authorization·retry",
        href: "/ai/mcp-protocol",
      },
      {
        label: "OS/container·credential·egress·filesystem sandbox 정본",
        href: "/ai/agent-sandbox-security",
      },
      {
        label: "Replay idempotency·checkpoint·external effect 경계",
        href: "/ai/multi-agent-implementation#langgraph",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "OpenClaw routing·session·runtime·Skill·sandbox·Gateway protocol·plugin SDK 동작은 2026-08-13에 확인한 docs.openclaw.ai 공식 문서와 실제 설치 version·config·plugin/resource inventory에만 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Binding은 authorization이 아니고 sessionKey는 routing selector이며 sandbox는 tool execution만 옮기고 elevated는 명시적으로 이를 우회한다는 경계를 항상 함께 밝힌다.",
      },
      {
        kind: "project-measurement",
        rule: "제품 변경 효과는 같은 Gateway/channel fixture·provider/model·workspace·message에서 route winner·session isolation·runtime trace·tool effect·outbound terminal state·latency를 paired 비교하고 ack 유실·dead-letter·unknown·reconnect failure injection으로 검증한다.",
      },
      {
        kind: "project-claim",
        rule: "Legacy `pi`는 `openclaw`로 normalize되는 alias이고 `runEmbeddedPiAgent(...)`는 deprecated compatibility alias이므로 새 config·code는 `openclaw`와 `runEmbeddedAgent(...)`를 사용하며 지원 수명은 고정된 보장이 아니다.",
      },
      {
        kind: "standard",
        rule: "OpenClaw의 기본 보안 모델은 gateway당 신뢰하는 한 operator 경계이며 서로 신뢰하지 않는 tenant는 별도 gateway·credential, 가능하면 별도 OS user/host로 나눈다.",
      },
      {
        kind: "standard",
        rule: "Durable outbound terminal state를 external side effect의 exactly-once 보장으로 확대하지 않고 activity audit은 bounded/best-effort evidence이며 reconnect 전에 거절된 pending request는 자동 replay하지 않는다.",
      },
    ],
  },
  "agent-devlog-patterns": {
    title: "Agent 개발 기록 패턴 글이 소유하는 범위",
    owns: [
      "Raw artifact·Changelog·ADR·Lessons가 각각 답하는 질문과 정본 소유권",
      "검증된 변화, architecturally significant decision, 재사용 가능한 현재 원칙을 서로 다른 문서로 승격하는 기준",
      "Postmortem의 사건·영향·원인·action item과 Lessons의 현재 rule을 분리하는 경계",
      "Agent가 기록 초안을 만들 때 evidence 존재·접근 권한·redaction·사람 승인을 확인하는 계약",
    ],
    reuses: [
      {
        label: "Run artifact provenance와 stable artifact identity",
        href: "/ai/experiment-tracking",
      },
      {
        label: "Agent objective·artifact·verification 계약",
        href: "/ai/llm-harness",
      },
      {
        label: "Working state·memory·compaction의 수명 경계",
        href: "/ai/context-engineering",
      },
      {
        label: "Checkpoint·replay·external effect 경계",
        href: "/ai/agent-frameworks",
      },
      {
        label: "Log·secret·tool effect의 보안 경계",
        href: "/ai/agent-sandbox-security",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Changelog 목적과 형식은 Keep a Changelog 1.1.0, ADR의 원형은 Michael Nygard의 글, blameless postmortem은 Google SRE Workbook의 공개 범위에만 귀속한다.",
      },
      {
        kind: "standard",
        rule: "세 문서를 모든 작업에 강제하지 않고 artifact에서 시작해 독자의 질문과 승격 조건에 맞는 정본 하나만 만들며 나머지는 stable link로 연결한다.",
      },
      {
        kind: "project-measurement",
        rule: "이 글의 Changelog·ADR·Lessons 3층 구조와 고정 사례는 개인 context-manager 개발 기록에서 사용한 pattern이며 보편 표준으로 일반화하지 않는다.",
      },
      {
        kind: "project-claim",
        rule: "Agent가 만든 causal claim·수치·완료 상태는 원 artifact와 verifier receipt가 존재하고 접근·redaction 조건을 통과한 뒤 owner가 승인한 범위에서만 publish한다.",
      },
    ],
  },
  "claw-overview": {
    title: "Claw Code 전체 아키텍처 글이 소유하는 범위",
    owns: [
      "독립 공개 Claw Code repository snapshot의 CLI→runtime→provider/tool→permission→workspace→verification 요청 경로",
      "Cargo workspace crate의 상태 소유권·adapter 책임·의존 방향을 읽는 project-specific architecture map",
      "Project가 canonical이라고 밝힌 Rust runtime surface와 companion Python/reference workspace 사이의 observable behavioral-parity 경계",
      "Deterministic mock fixture·canonicalization·parity harness와 실제 provider·sandbox integration test의 보장 범위",
    ],
    reuses: [
      {
        label:
          "Model proposal과 runtime authorization을 나누는 LLM harness 정본",
        href: "/ai/llm-harness",
      },
      {
        label: "Agent state·action·typed observation·exit state",
        href: "/ai/agentic-patterns",
      },
      {
        label: "Direct loop와 framework runtime 선택",
        href: "/ai/agent-frameworks",
      },
      {
        label: "Claw session·turn commit·resume 경계",
        href: "/ai/claw-session",
      },
      {
        label: "Claw provider request·SSE parsing",
        href: "/ai/claw-api-client",
      },
      {
        label: "Claw tool registry·schema·dispatch",
        href: "/ai/claw-tool-system",
      },
      {
        label: "Claw permission policy와 executor enforcement",
        href: "/ai/claw-permissions",
      },
      {
        label: "Claw workspace file operation과 boundary",
        href: "/ai/claw-file-ops",
      },
      {
        label: "Layered verification과 run provenance",
        href: "/ai/experiment-tracking",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Crate·Python reference·parity 구현 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 repository artifact에만 귀속하며 main branch의 움직이는 숫자로 일반화하지 않는다.",
      },
      {
        kind: "standard",
        rule: "Cargo 공식 문서는 workspace의 package 관리 semantics만 뒷받침하며 Claw Code의 crate 책임·의존 방향을 설계하거나 보증한 근거로 사용하지 않는다.",
      },
      {
        kind: "primary-source",
        rule: "OpenAI Agents SDK의 guardrails·human review 문서는 자동 tool 검사와 side effect 전 approval이라는 일반 runtime control 경계만 보충하며 Claw Code나 Claude Code의 내부 구현 근거가 아니다.",
      },
      {
        kind: "project-measurement",
        rule: "Behavioral parity는 pinned fixture가 관찰하는 event·permission·tool result·session snapshot에 한하며 인증·실제 provider drift·OS·sandbox·production 품질은 별도 integration evidence가 필요하다.",
      },
      {
        kind: "project-claim",
        rule: "Claw Code는 Anthropic·OpenAI의 비공개 source나 공식 내부 구조가 아니라 독립 공개 재구현 project이며 이름·surface 유사성을 implementation identity·affiliation·검증된 clean-room 절차·production readiness로 확대하지 않는다.",
      },
    ],
  },
  "claw-session": {
    title: "Claw Code 세션·turn·복구 글이 소유하는 범위",
    owns: [
      "Pinned Claw Session의 typed message/content block·tool call/result correlation·compaction·fork·workspace/model/prompt-history field와 JSONL record/snapshot 범위",
      "Pinned ConversationRuntime에서 user→assistant/tool-use→permission·tool execution→tool-result가 session에 반영되는 실제 turn persistence 순서",
      "Pinned SessionStore의 workspace fingerprint namespace·explicit/latest reference resolution·workspace validation·load/fork/delete 흐름",
      "Pinned source에서 확인되지 않은 revisioned event/view, effect receipt reconciliation, artifact/workspace branch merge, pause·resume·shutdown state machine을 구현 사실과 분리해 평가하는 project hardening gap",
    ],
    reuses: [
      {
        label: "Agent working state와 durable artifact continuity",
        href: "/ai/llm-harness#composition",
      },
      {
        label: "Typed tool observation과 turn exit state",
        href: "/ai/agentic-patterns#react",
      },
      {
        label: "Checkpoint·replay·interrupt/resume의 정본",
        href: "/ai/agent-frameworks#langchain",
      },
      {
        label: "External effect partial success·idempotency·compensation",
        href: "/ai/agent-code-mode#effect-atomicity",
      },
      {
        label: "Context compaction fidelity",
        href: "/ai/context-engineering#memory",
      },
      {
        label: "Artifact content digest와 run lineage",
        href: "/ai/experiment-tracking#overview",
      },
      {
        label: "Claw tool dispatch·permission·result contract",
        href: "/ai/claw-tool-system",
      },
      {
        label: "Claw file operation expected digest·workspace boundary",
        href: "/ai/claw-file-ops",
      },
      {
        label: "Pinned Claw repository architecture·runtime owner",
        href: "/ai/claw-overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Session field·JSONL append/snapshot·turn order·workspace store·fork 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 session.rs·conversation.rs·session_control.rs와 같은 commit tests에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "Pinned source에 없는 revision CAS·full event store/materialized view·planned-operation outbox/effect receipt·workspace branch/merge·durable pause/drain/shutdown은 이미 구현된 기능이 아니라 보강 계약과 gap으로 표시한다.",
      },
      {
        kind: "standard",
        rule: "Azure Event Sourcing 문서는 append-only system of record·projection·snapshot/replay trade-off만 뒷받침하며 Claw JSONL이 event sourcing 구현이라는 증거로 사용하지 않는다.",
      },
      {
        kind: "standard",
        rule: "AWS Transactional Outbox와 LangGraph Persistence는 dual-write·checkpoint/replay의 일반 비교 근거이며 Claw에 해당 mechanism이 내장됐거나 exactly-once가 보장된다는 근거가 아니다.",
      },
      {
        kind: "project-measurement",
        rule: "같은 login fixture에서 base/candidate SHA와 workspace·model·tool·policy를 고정하고 torn/corrupt persistence·wrong-workspace resume·effect/result crash·duplicate replay·fork conflict·pause timeout을 주입해 canary와 rollback을 판정한다.",
      },
      {
        kind: "project-claim",
        rule: "Source의 session version·rotation threshold·field limit·command count 같은 움직일 수 있는 숫자는 snapshot detail로만 다루고 제품 불변식이나 production readiness로 일반화하지 않는다.",
      },
    ],
  },
  "claw-tool-system": {
    title: "Claw Code 도구 시스템 글이 소유하는 범위",
    owns: [
      "Pinned Claw snapshot의 built-in·plugin·runtime tool definition registry 구성, canonical name과 충돌 거부 경계",
      "ToolSpec 노출부터 input parse·argument별 effect 분류·permission enforcement·executor·result 반환까지의 project dispatch 경로",
      "Plugin·MCP tool을 model-facing definition으로 합칠 때 source·version·instance identity와 lifecycle 차이를 보존하는 adapter 경계",
      "Registry reload generation pin, effect receipt가 있는 result envelope, dependency-aware parallel scheduling을 현재 구현 사실과 분리해 평가하는 hardening contract",
    ],
    reuses: [
      {
        label: "JSON Schema 구조 계약과 syntax·domain validity 경계",
        href: "/ai/prompt-engineering#structured-output",
      },
      {
        label: "Model proposal과 runtime capability·authorization 경계",
        href: "/ai/llm-harness#composition",
      },
      {
        label: "Typed tool observation과 exit state",
        href: "/ai/agentic-patterns#react",
      },
      {
        label: "Claw permission mode·rule·override의 정본",
        href: "/ai/claw-permissions",
      },
      {
        label: "Claw Bash command validation·sandbox 경계",
        href: "/ai/claw-bash",
      },
      {
        label: "Claw plugin discovery·install·health lifecycle",
        href: "/ai/claw-plugin",
      },
      {
        label: "MCP Tool schema·result·authorization·retry 계약",
        href: "/ai/mcp-protocol",
      },
      {
        label: "여러 external effect의 partial success·idempotency",
        href: "/ai/agent-code-mode#effect-atomicity",
      },
      {
        label: "Pinned Claw repository 전체 architecture와 parity test",
        href: "/ai/claw-overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Registry·ToolSpec·collision·dispatch·permission call path 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 tools/runtime/plugins source와 test artifact에만 귀속하며 moving main의 tool 수나 구조로 일반화하지 않는다.",
      },
      {
        kind: "standard",
        rule: "JSON Schema 2020-12 Validation은 JSON instance의 structural assertion만 뒷받침하며 workspace path·command semantics·caller authorization·side-effect safety를 보증하지 않는다.",
      },
      {
        kind: "standard",
        rule: "MCP Tools specification은 external tool discovery·schema·result contract를 설명하지만 Claw의 GlobalToolRegistry·plugin process·permission implementation 근거가 아니다.",
      },
      {
        kind: "project-claim",
        rule: "Pinned source에서 확인되지 않은 rich result envelope·registry generation enforcement·generic parallel executor는 구현 완료 사실로 쓰지 않고 필요한 hardening/evaluation contract와 gap으로 명시한다.",
      },
      {
        kind: "project-measurement",
        rule: "Release 평가는 같은 login fixture에서 base/candidate SHA·registry/schema/permission config를 고정하고 collision·schema drift·deny·timeout·partial effect·test failure를 주입해 effect receipt·canary·rollback까지 검증한다.",
      },
    ],
  },
  "claw-bash": {
    title:
      "Claw Code Bash shell·validation·process boundary 글이 소유하는 범위",
    owns: [
      "Pinned Claw snapshot의 BashCommandInput, host current directory와 Linux launcher 또는 `sh -lc`로 이어지는 shell-string dispatch 및 direct argv와의 의미 차이",
      "Pinned tools first-token/path permission classifier와 별도 runtime/bash_validation.rs의 lexical validator를 구분하고 production validate_command callsite가 확인되지 않는 integration gap",
      "Pinned optional PermissionEnforcer seam이 Bash executor 전에 소비되는 조건을 permission policy 자체와 구분해 추적하는 Bash-specific dispatch 경계",
      "Pinned Linux util-linux unshare namespace launcher·status/fallback과 filesystem mode metadata를 실제 mount/seccomp/cgroup enforcement와 구분하는 sandbox 경계",
      "Pinned timeout·16 KiB stdout/stderr truncation·background child PID 반환과 process-group cleanup·full output·atomic rollback·durable effect receipt가 미증명인 lifecycle 경계",
      "Login 401 command의 shell/argv·expansion·canonical path/TOCTOU·permission·sandbox·timeout/cleanup·idempotency를 같은 fixture로 검증하는 desired Bash hardening과 paired release gate",
    ],
    reuses: [
      {
        label: "Pinned Claw repository architecture·runtime ownership",
        href: "/ai/claw-overview",
      },
      {
        label: "Tool schema·registry·argument effect·typed result envelope",
        href: "/ai/claw-tool-system",
      },
      {
        label: "PermissionMode·rule·approval·enforcer 정책 정본",
        href: "/ai/claw-permissions",
      },
      {
        label:
          "Direct file operation의 canonical path·digest·atomic write 경계",
        href: "/ai/claw-file-ops",
      },
      {
        label:
          "Process/container·namespace·filesystem·network·resource sandbox 정본",
        href: "/ai/agent-sandbox-security",
      },
      {
        label:
          "External effect partial success·receipt·idempotency·compensation",
        href: "/ai/agent-code-mode#effect-atomicity",
      },
      {
        label: "Run·artifact·command·verifier receipt provenance",
        href: "/ai/experiment-tracking#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Bash schema·classifier·optional enforcer·`sh -lc`·timeout/truncation/background·unshare·validation module 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 tools/src/lib.rs와 runtime의 bash.rs·bash_validation.rs·permission_enforcer.rs·sandbox.rs 및 같은 commit tests에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "Pinned source에서 확인되지 않은 bash_validation production integration, full shell AST/effect authorization, descriptor-bound TOCTOU 방지, mandatory enforcer, fail-closed sandbox, process-group cleanup, atomic rollback·durable effect receipt는 구현 사실이 아니라 hardening gap으로 표시한다.",
      },
      {
        kind: "standard",
        rule: "POSIX Shell Command Language는 quoting·expansion·redirection·pipeline semantics만, CWE-367은 check-use race의 일반 경계만, Linux setpgid(2)는 process group semantics만 뒷받침하며 각각 Claw 구현 완료나 취약점 재현의 증거가 아니다.",
      },
      {
        kind: "standard",
        rule: "Permission policy·file mutation·sandbox isolation·effect idempotency·artifact provenance의 일반 정의와 canonical ownership은 연결 글을 재사용하며 Bash 글에서 같은 정의를 다시 소유하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Release 평가는 같은 login 401 request·workspace·host cwd·environment·model·tools·policy·sandbox request에서 base/candidate full SHA를 고정하고 shell/argv·expansion/path race·missing enforcer·fallback·timeout/truncation·descendant linger·crash/retry를 주입해 unauthorized execution 0, minimal diff·deterministic test·cleanup/effect receipt와 canary·rollback artifact를 확인한다.",
      },
    ],
  },
  "claw-permissions": {
    title:
      "Claw Code permission policy·approval·enforcement 글이 소유하는 범위",
    owns: [
      "Pinned Claw snapshot의 PermissionMode·tool requirement·denied tool·deny/ask/allow rule·context override·interactive prompt 판정 순서",
      "Pinned subject string matcher와 optional PermissionEnforcer·tools dispatch가 actual path·command required mode를 executor 전에 적용하는 범위 및 Prompt deferral·missing-enforcer 경계",
      "Pinned standalone in-memory approval token ledger의 action/resource·actor·executor·expiry·use-count lifecycle과 runtime integration 부재를 함께 기록하는 구현 경계",
      "Deployment authority ceiling, canonical argument와 policy generation을 묶는 authorization receipt, crash/retry effect reconciliation을 현재 구현 사실과 분리하는 hardening contract",
      "같은 login 401 fixture의 read/search→edit approval→deterministic test에 deny 충돌·unknown input·approval replay·reload·missing enforcer를 주입하는 paired release 평가",
    ],
    reuses: [
      {
        label: "Model proposal과 runtime capability·host enforcement 경계",
        href: "/ai/llm-harness#composition",
      },
      {
        label:
          "Claw tool registry·argument effect classification·executor·result",
        href: "/ai/claw-tool-system",
      },
      {
        label: "Claw Bash command validation과 process effect",
        href: "/ai/claw-bash",
      },
      {
        label: "Claw hook lifecycle과 permission override source",
        href: "/ai/claw-hooks",
      },
      {
        label: "Session effect receipt·crash reconciliation·replay idempotency",
        href: "/ai/claw-session",
      },
      {
        label: "Agent sandbox·filesystem·network·credential outer boundary",
        href: "/ai/agent-sandbox-security",
      },
      {
        label: "Run artifact·policy generation provenance",
        href: "/ai/experiment-tracking#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Mode·rule·override·prompt, enforcer·dispatch, approval token lifecycle 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 permissions.rs·permission_enforcer.rs·approval_tokens.rs·tools/src/lib.rs와 같은 commit tests에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "Pinned source에서 확인되지 않은 outer authority ceiling·canonical semantic matcher·durable approval integration·policy generation pin·authorization/effect receipt는 구현 완료 사실이 아니라 필요한 hardening gap으로 표시한다.",
      },
      {
        kind: "standard",
        rule: "OpenAI Agents guardrails/approvals 문서는 tool guardrail과 side-effect approval을 host execution boundary에 두는 일반 근거이며 Claw approval ledger·permission semantics나 모든 tool type coverage의 증거가 아니다.",
      },
      {
        kind: "standard",
        rule: "OWASP Authorization Cheat Sheet는 least privilege·deny by default·every-request enforcement·safe failure·negative test의 일반 기준이며 Claw가 준수 인증을 받았거나 pinned implementation이 완전하다는 근거가 아니다.",
      },
      {
        kind: "project-measurement",
        rule: "Release 평가는 base/candidate full SHA와 login request·workspace·model·tools·policy fixture를 고정하고 충돌·unknown/malformed subject·path escape·expired/replayed approval·missing enforcer·reload·crash를 주입해 unauthorized execution 0, deterministic test receipt, canary·rollback artifact를 확인한다.",
      },
    ],
  },
  "claw-compaction": {
    title: "Claw Code compaction 구현·상태 보존 글이 소유하는 범위",
    owns: [
      "Pinned Claw snapshot의 수동 `/compact`·누적 input-token auto trigger·context 오류 recovery와 recent-tail schedule의 실제 control flow",
      "Pinned `compact_session`의 recent message·ToolUse/ToolResult 경계, deterministic summary projection, synthetic system continuation과 반복 summary flattening",
      "Pinned `summary_compression.rs`의 line normalize·dedupe·priority·char/line budget을 session semantic compaction과 구분하는 구현 경계",
      "Login 401 사례의 goal·auth evidence·permission·edit/test receipt·unresolved failure·next action 보존과 stale trace 제거를 실제 heuristic과 분리해 정의하는 hardening contract",
      "Context 교체가 permission·filesystem·process·network effect를 rollback하지 않는 경계와 base/candidate multi-cycle fidelity release 평가",
    ],
    reuses: [
      {
        label: "Inference context·selection·compaction lifecycle 정본",
        href: "/ai/context-engineering#overview",
      },
      {
        label: "Compaction state fidelity와 working-memory 경계",
        href: "/ai/context-engineering#memory",
      },
      {
        label: "Output reserve를 포함한 context token budget",
        href: "/ai/context-engineering#optimization",
      },
      {
        label: "Claw session message·tool correlation·effect reconciliation",
        href: "/ai/claw-session",
      },
      {
        label: "Claw tool permission·result·effect receipt",
        href: "/ai/claw-tool-system",
      },
      {
        label: "Permission mode·rule·approval의 정본",
        href: "/ai/claw-permissions",
      },
      {
        label: "Layered verification과 recovery gate",
        href: "/ai/llm-harness#evaluation",
      },
      {
        label: "Run artifact provenance·versioned verifier",
        href: "/ai/experiment-tracking#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Trigger·tail boundary·summary projection·merge·retry·line compression 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2의 compact.rs·conversation.rs·rusty-claude-cli/main.rs·summary_compression.rs와 같은 commit tests에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "Pinned heuristic에 없는 typed login-state schema·semantic invariant check·candidate fail-closed commit·versioned migration·effect receipt reconciliation은 이미 구현된 기능이 아니라 필요한 hardening gap으로 표시한다.",
      },
      {
        kind: "project-claim",
        rule: "Line-based summary compressor는 실제 caller와 책임을 확인해 설명하며 session compaction의 `SummaryCompressor` class·fact extractor·LLM summarizer로 바꾸어 말하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Release 평가는 같은 login transcript·workspace·policy·token estimator에서 base/candidate SHA를 1·3·5 cycle paired replay하고 goal·evidence·permission·receipt·latest failure·next action·tool pair·repeat effect·token·latency를 함께 기록한다.",
      },
      {
        kind: "standard",
        rule: "Context fidelity·token budget·artifact provenance·layered verification의 일반 정의는 각 canonical 글을 재사용하며 pinned Claw 구현이나 고정 threshold를 보편 표준으로 확대하지 않는다.",
      },
    ],
  },
  "distributional-semantics": {
    title: "분산 의미론 글이 소유하는 범위",
    owns: [
      "Distributional hypothesis를 corpus context measurement로 바꾸는 가정과 한계",
      "Word–context count·PMI/PPMI weighting과 정본 SVD를 distributional data에 적용하는 경로",
      "Count-based·SGNS·GloVe의 연결과 static·contextual representation 경계",
      "Cosine proximity에서 lexical relation·downstream·bias audit로 이어지는 평가 층",
    ],
    reuses: [
      { label: "CBOW·Skip-gram·negative sampling", href: "/ai/word2vec" },
      { label: "Tokenizer와 vocabulary", href: "/ai/tokenizer" },
      {
        label: "Matrix·rank·SVD·Eckart–Young 정리",
        href: "/ai/math-matrices-svd",
      },
      { label: "BERT contextual representation", href: "/ai/bert" },
      {
        label: "Sentence embedding과 retrieval",
        href: "/ai/sentence-embeddings",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Distributional 가정·LSA·SGNS·GloVe claim은 원 논문과 후속 분석이 성립시킨 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Context·window·weighting·dimension·similarity를 representation 재현에 필요한 측정 계약으로 명시한다.",
      },
    ],
  },
  word2vec: {
    title: "Word2Vec 글이 소유하는 범위",
    owns: [
      "Corpus token에서 dynamic window로 CBOW·Skip-gram training example을 만드는 절차",
      "Input·output embedding table과 full·hierarchical softmax의 prediction 계산",
      "SGNS의 positive·noise pair objective와 sparse parameter update",
      "Frequent-word subsampling·noise distribution·fastText 확장의 실무 경계",
    ],
    reuses: [
      { label: "Tokenizer와 vocabulary 계약", href: "/ai/tokenizer" },
      {
        label: "분산 가정·PMI·shifted-PMI·cosine",
        href: "/ai/distributional-semantics",
      },
      { label: "Sigmoid·softmax activation", href: "/ai/activation-functions" },
      { label: "문장 임베딩과 retrieval", href: "/ai/sentence-embeddings" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "CBOW·Skip-gram·negative sampling·subsampling·fastText claim은 원 논문의 corpus·objective·평가 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Vocabulary·window·noise distribution·sample 수·subsampling·seed를 재현 가능한 training artifact로 기록한다.",
      },
    ],
  },
  bert: {
    title: "BERT 글이 소유하는 범위",
    owns: [
      "Encoder의 양방향 visibility와 token·position·segment·padding 입력 계약",
      "MLM selected position·80/10/10 corruption·loss target의 구분",
      "NSP를 RoBERTa·ALBERT·ELECTRA가 바꾼 목적과 비교 증거의 경계",
      "Sequence·token·span task head와 cross-encoder·bi-encoder transfer interface",
    ],
    reuses: [
      { label: "WordPiece·special token·ID 호환성", href: "/ai/tokenizer" },
      {
        label: "Transformer block·position·visibility",
        href: "/ai/transformer-architecture",
      },
      { label: "Q·K·V와 self-attention 계산", href: "/ai/attention-theory" },
      {
        label: "Static·contextual representation 경계",
        href: "/ai/distributional-semantics",
      },
      {
        label: "Sentence embedding과 retrieval 평가",
        href: "/ai/sentence-embeddings",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "BERT·RoBERTa·ALBERT·ELECTRA·Sentence-BERT claim은 각 논문의 data·compute·task와 동시 변경 사항 안에서 해석한다.",
      },
      {
        kind: "standard",
        rule: "Input ID·mask·type·position shape와 checkpoint 호환성은 현재 library의 공식 API 계약까지 함께 확인한다.",
      },
    ],
  },
  cnn: {
    title: "CNN 글이 소유하는 범위",
    owns: [
      "Image tensor의 channel·spatial axes와 local cross-correlation 계산",
      "Kernel weight sharing·output geometry·translation equivariance의 전제와 경계",
      "Theoretical·effective receptive field와 dilation·downsampling 선택",
      "Dense·depthwise separable convolution 및 task별 spatial-output 계약",
    ],
    reuses: [
      {
        label: "Vector·dot product와 tensor 기본기",
        href: "/ai/math-vectors-inner-products",
      },
      { label: "Sampling·Nyquist·aliasing", href: "/ai/fft" },
      { label: "Activation function", href: "/ai/activation-functions" },
      { label: "ResNet residual path", href: "/ai/resnet" },
      { label: "Vision Transformer", href: "/ai/vision-transformer" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "LeNet·AlexNet·effective receptive field·dilation·MobileNet·ConvNeXt·ViT claim은 각 논문의 dataset·architecture·compute 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Tensor layout·padding convention·groups·stride와 parameter·MAC·latency를 재현 가능한 실행 계약으로 기록한다.",
      },
    ],
  },
  "transformer-architecture": {
    title: "Transformer architecture 글이 소유하는 범위",
    owns: [
      "Token ID·position·attention mask·loss mask에서 hidden state로 이어지는 tensor 계약",
      "Encoder self·causal self·cross-attention의 source와 visibility 차이",
      "Attention token mixer·FFN feature mixer·residual·normalization의 block 경계",
      "LM head·training objective·decoding policy와 training recipe·scaling 예산의 연결",
    ],
    reuses: [
      { label: "Tokenizer algorithm과 ID 호환성", href: "/ai/tokenizer" },
      {
        label: "Attention score와 multi-head 유도",
        href: "/ai/attention-theory",
      },
      { label: "Activation과 gated FFN", href: "/ai/activation-functions" },
      { label: "RoPE·YaRN context 확장", href: "/ai/yarn-rope-extension" },
      { label: "Cross-entropy", href: "/ai/cross-entropy" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "원 architecture와 training claim은 Transformer 원 논문과 각 후속 연구가 보고한 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Tensor shape·mask axis·norm 위치·objective는 checkpoint와 framework config에서 확인할 실행 계약으로 쓴다.",
      },
    ],
  },
  resnet: {
    title: "ResNet 글이 소유하는 범위",
    owns: [
      "Plain deep network의 optimization degradation과 residual parameterization",
      "Identity shortcut의 forward transport·I+J_F gradient path·addition shape 계약",
      "BasicBlock·Bottleneck·projection·pre-activation의 구조와 비용 비교",
      "Residual network 후속 해석의 근거 경계와 backbone 선택 기준",
    ],
    reuses: [
      { label: "Convolution·receptive field", href: "/ai/cnn" },
      { label: "Activation function", href: "/ai/activation-functions" },
      { label: "Chain rule과 역전파", href: "/ai/backprop-optimization" },
      { label: "Vision Transformer", href: "/ai/vision-transformer" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Degradation·identity mapping·pre-activation claim은 원 ResNet과 후속 논문이 보고한 실험 범위로 제한한다.",
      },
      {
        kind: "primary-source",
        rule: "구현의 stride·expansion·initialization은 현재 framework source와 checkpoint recipe를 기준으로 한다.",
      },
    ],
  },
  "generative-theory": {
    title: "생성 모델 이론 글이 소유하는 범위",
    owns: [
      "관측 sample·data distribution·conditional generation의 문제 정의",
      "Likelihood 계산 가능성·sampling path·inference·evaluation을 나눈 공통 비교 축",
      "Autoregressive factorization·latent marginalization·ELBO·change of variables의 연결",
      "Adversarial comparison·score field·diffusion parameterization의 전제와 이론적 경계",
    ],
    reuses: [
      {
        label: "확률분포·조건부확률·기대값",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Logarithm·곱의 합 변환",
        href: "/ai/math-exponents-logarithms",
      },
      { label: "Likelihood·entropy·KL divergence", href: "/ai/cross-entropy" },
      { label: "VAE 세부 유도와 구현", href: "/ai/vae" },
      { label: "GAN objective와 안정화", href: "/ai/gan" },
      {
        label: "Diffusion·SDE·ODE·flow matching",
        href: "/ai/diffusion-models",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "VAE·GAN·Real NVP·DDPM·NCSN·Score-SDE claim은 각 논문의 objective·architecture·dataset·sampling 조건 안에서 읽는다.",
      },
      {
        kind: "standard",
        rule: "Likelihood·sample quality·coverage·condition adherence·latency는 하나의 점수로 합치지 않고 model output과 deployment 계약에 맞게 따로 평가한다.",
      },
    ],
  },
  "feature-engineering": {
    title: "피처 엔지니어링 글이 소유하는 범위",
    owns: [
      "Prediction entity·cutoff·available time·source·단위·fallback의 feature contract",
      "Target·temporal·split leakage와 fold-local preprocessing 경계",
      "Cross-fitted target encoding·interaction·point-in-time aggregation의 계산 원리",
      "Importance 진단·재학습 ablation·training-serving parity의 선택·배포 절차",
    ],
    reuses: [
      {
        label: "Input feature·target와 train·validation·test",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Expectation·variance·conditional probability",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "EDA의 분포·결측·가설", href: "/ai/eda-workflow" },
      {
        label: "Tabular augmentation의 split 경계",
        href: "/ai/data-augmentation#tabular",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Leakage·ordered target statistics·feature selection claim은 각 논문의 problem definition·algorithm·dataset·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Entity·cutoff·event/available time·source·unit·fit scope·fallback·version·parity fixture·ablation을 재현 가능한 feature contract로 기록한다.",
      },
    ],
  },
  "gradient-boosting": {
    title: "Gradient boosting 글이 소유하는 범위",
    owns: [
      "Piecewise-constant decision tree와 functional negative-gradient boosting의 공통 계산",
      "Shrinkage·tree capacity·early stopping의 ensemble length 선택",
      "XGBoost 2차 gain·histogram, LightGBM GOSS/EFB·leaf-wise, CatBoost ordered boosting·symmetric tree의 차이",
      "동일 feature·split·search·hardware budget의 GBM 비교 계약",
    ],
    reuses: [
      {
        label: "Loss·gradient·validation",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Derivative와 gradient",
        href: "/ai/math-functions-derivatives-gradients",
      },
      {
        label: "Feature availability와 leakage",
        href: "/ai/feature-engineering#overview",
      },
      {
        label: "Cross-fitted target encoding",
        href: "/ai/feature-engineering#categorical",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Gradient Boosting·XGBoost·LightGBM·CatBoost claim은 각 논문의 objective·algorithm·dataset·hardware·baseline 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Loss·score/link·tree growth·leaf/depth·learning rate·round·sampling·bin·category/missing·split·search budget·hardware를 비교 계약으로 기록한다.",
      },
    ],
  },
  "tabular-deep-learning": {
    title: "테이블 딥러닝 글이 소유하는 범위",
    owns: [
      "Heterogeneous row를 neural representation으로 바꾸는 schema·encoder·head 경계",
      "TabNet의 row별 sequential mask·reuse prior·masked-feature pretraining",
      "FT-Transformer의 numerical·categorical feature tokenizer와 column attention",
      "Representation 기회·OOF error correlation·system cost를 포함한 GBDT 대비 선택 절차",
    ],
    reuses: [
      {
        label: "Prediction cutoff·누출·serving parity",
        href: "/ai/feature-engineering",
      },
      { label: "GBDT 원리와 공정 비교 계약", href: "/ai/gradient-boosting" },
      {
        label: "Self-attention의 Q·K·V 계산",
        href: "/ai/attention-theory#self-attention",
      },
      {
        label: "Embedding lookup과 Transformer block",
        href: "/ai/transformer-architecture",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "TabNet·FT-Transformer claim은 원 논문의 architecture·dataset·split·tuning·baseline 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Entity·cutoff·schema artifact·split·search budget·seed·calibration·latency·memory를 GBDT와 neural model에 동일하게 기록한다.",
      },
    ],
  },
  "time-features": {
    title: "시계열 feature 글이 소유하는 범위",
    owns: [
      "Entity·forecast origin·horizon으로 정의하는 forecast row contract",
      "Observation/duration lag·difference·history availability의 인덱스 의미",
      "Rolling window 양끝·count·freshness와 EMA state의 계산 계약",
      "Cyclic/harmonic time coordinates와 rolling-origin·gap/purge 평가",
    ],
    reuses: [
      {
        label: "Feature available time·point-in-time aggregation",
        href: "/ai/feature-engineering#aggregation",
      },
      {
        label: "Radian·sin·cos·complex rotation",
        href: "/ai/math-complex-numbers-oscillations",
      },
      { label: "Fourier basis와 frequency", href: "/ai/fft" },
      {
        label: "Time-series modeling의 stationarity·forecasting",
        href: "/ai/time-series-overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Rolling-origin·Time2Vec claim은 원 논문의 forecast design·dataset·model 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Entity·timezone·event/available time·cutoff·horizon·window boundary·minimum periods·late arrival·split gap을 재현 가능한 계약으로 기록한다.",
      },
    ],
  },
  "sequence-modeling-tabular": {
    title: "이벤트 시퀀스 모델링 글이 소유하는 범위",
    owns: [
      "Entity·cutoff·available time·stable ordering으로 정의하는 event-sequence sample contract",
      "Event type·numerical attributes·position·elapsed time의 heterogeneous token과 padding·truncation 정책",
      "Transition statistic·summary collision을 통한 order-aware flat baseline의 정보 경계",
      "Whole-history·next-event visibility, sequence pooling과 within-entity order-shuffle 검증",
    ],
    reuses: [
      {
        label: "Forecast origin·lag·rolling·Time2Vec",
        href: "/ai/time-features",
      },
      {
        label: "Feature available time·point-in-time aggregation",
        href: "/ai/feature-engineering#aggregation",
      },
      {
        label: "Q·K·V와 self-attention 계산",
        href: "/ai/attention-theory#self-attention",
      },
      {
        label: "Transformer block·position·attention complexity",
        href: "/ai/transformer-architecture",
      },
      {
        label: "GBDT와 neural model의 공정 비교",
        href: "/ai/tabular-deep-learning#when-dl-wins",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Transformer·Time2Vec claim은 원 논문의 task·architecture·dataset·objective 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Entity·timezone·event/available time·cutoff·horizon·tie-break·vocabulary·max length·truncation·mask·pooling·split을 재현 가능한 artifact로 기록한다.",
      },
    ],
  },
  "training-pipeline": {
    title: "PyTorch 학습 파이프라인 글이 소유하는 범위",
    owns: [
      "Dataset·sampler·collate·worker·device copy로 이어지는 sample-to-batch 책임과 input wait 측정",
      "Train/validation state boundary, micro-batch·accumulation·world-size와 optimizer update clock",
      "Autocast·GradScaler·unscale·clip·update의 mixed-precision 실행 순서",
      "Inference artifact와 resume checkpoint의 state closure·atomic publish·new-process equivalence test",
      "Batch·rank별 metric sufficient statistics와 run-to-artifact provenance",
    ],
    reuses: [
      {
        label: "Feature·target와 train/validation/test",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Backpropagation·gradient clipping",
        href: "/ai/backprop-optimization",
      },
      { label: "SGD·momentum·Adam optimizer state", href: "/ai/optimizers" },
      {
        label: "Schedule 종류와 learning-rate 변화",
        href: "/ai/lr-scheduling",
      },
      {
        label: "Early stopping과 regularization 선택",
        href: "/ai/regularization-practice#early-stopping",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Dataset/DataLoader·AMP·checkpoint·reproducibility behavior는 현재 PyTorch stable 공식 문서와 사용 version을 기준으로 한다.",
      },
      {
        kind: "standard",
        rule: "Run ID·code·data·split·config·environment·sample order·update clock·checkpoint schema·metric reduction·artifact digest를 재현 가능한 manifest로 기록한다.",
      },
    ],
  },
  "transfer-learning-practice": {
    title: "Transfer learning 실전 글이 소유하는 범위",
    owns: [
      "Source pretrained parameter·architecture·preprocessing을 target task로 넘기는 handoff contract",
      "Fixed·partial·full의 trainable mask와 BatchNorm 등 frozen module buffer 상태",
      "Discriminative LR의 layerwise relative update 진단과 adaptation scope 공정 비교",
      "Covariate·label·concept shift에 따른 continued pretraining·domain alignment·negative-transfer 판정",
    ],
    reuses: [
      {
        label: "Training phase·effective batch·checkpoint",
        href: "/ai/training-pipeline",
      },
      { label: "Optimizer state와 learning rate", href: "/ai/optimizers" },
      { label: "Warmup·linear·cosine schedule", href: "/ai/lr-scheduling" },
      {
        label: "Representation learning과 generalization",
        href: "/ai/deep-learning-overview",
      },
      { label: "Normalization layer의 계산", href: "/ai/normalization" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "ULMFiT·DAPT/TAPT·DANN claim은 각 논문의 architecture·data domain·objective·benchmark 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Pretrained revision·preprocessing·trainable scope·module mode·optimizer groups·update ratios·split·seed·budget·target/source regression·rollback을 기록한다.",
      },
    ],
  },
  "lr-scheduling": {
    title: "Learning-rate scheduling 글이 소유하는 범위",
    owns: [
      "Optimizer update clock·total budget·scheduler state를 묶는 schedule contract",
      "Step·exponential의 open-loop decay와 validation-driven plateau trigger의 차이",
      "Cosine progress·warm restart·OneCycle phase와 range-test 해석",
      "Warmup과 본 schedule의 boundary·local clock, adaptive update magnitude 진단",
    ],
    reuses: [
      {
        label: "Gradient descent와 smoothness",
        href: "/ai/math-optimization-convexity",
      },
      { label: "SGD·momentum·Adam optimizer state", href: "/ai/optimizers" },
      {
        label: "Effective batch·update clock·resume state",
        href: "/ai/training-pipeline",
      },
      {
        label: "Early stopping과 best checkpoint",
        href: "/ai/regularization-practice#early-stopping",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SGDR·Super-Convergence·untuned warmup의 효과는 각 논문의 optimizer·architecture·dataset·budget 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Scheduler class·version·initial/peak/final LR·warmup·total updates·call event·state·resume trace를 함께 기록한다.",
      },
    ],
  },
  "regularization-practice": {
    title: "Regularization 실전 글이 소유하는 범위",
    owns: [
      "Observed train–validation gap의 원인 audit와 one-axis regularization ablation",
      "Inverted dropout의 expectation·variance·drop unit·train/eval state",
      "Plain SGD의 L2–decay 등가와 AdamW decoupling·parameter-group coverage",
      "Early-stopping state와 best artifact 분리, uniform label smoothing과 soft-target composition",
    ],
    reuses: [
      {
        label: "Train·validation·test와 empirical risk",
        href: "/ai/deep-learning-overview",
      },
      {
        label: "Expectation·variance",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "SGD·Adam optimizer state", href: "/ai/optimizers" },
      { label: "Learning-rate scheduler와 plateau", href: "/ai/lr-scheduling" },
      { label: "Mixup·CutMix target", href: "/ai/data-augmentation" },
      { label: "Softmax cross-entropy", href: "/ai/cross-entropy" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Dropout·AdamW·early stopping·label smoothing claim은 각 논문의 architecture·data·objective·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Split·baseline·regularizer scope/strength·seed·update budget·best/last artifact·calibration·slice·system cost를 기록한다.",
      },
    ],
  },
  "image-classification-pipeline": {
    title: "이미지 분류 파이프라인 글이 소유하는 범위",
    owns: [
      "같은 원본·대상·촬영 세션의 sample identity와 deployment 단위 group split",
      "Pretrained image input contract와 architecture 후보의 paired quality·runtime budget 비교",
      "Resolution stage와 confidence-gated pseudo-label의 class별 precision·coverage audit",
      "Logit→calibrated probability→TTA/ensemble→decision으로 이어지는 versioned inference contract",
    ],
    reuses: [
      { label: "Image tensor·convolution·spatial prior", href: "/ai/cnn" },
      {
        label: "Train·validation·test와 empirical risk",
        href: "/ai/deep-learning-overview",
      },
      {
        label: "Augmentation distribution과 target transform",
        href: "/ai/data-augmentation",
      },
      {
        label: "Pretrained handoff와 fine-tuning scope",
        href: "/ai/transfer-learning-practice",
      },
      {
        label: "Calibration·threshold·precision/recall",
        href: "/ai/imbalanced-data",
      },
      {
        label: "Out-of-fold ensemble과 error diversity",
        href: "/ai/ensemble-methods",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "EfficientNet·ConvNeXt·ViT·RandAugment·FixMatch·temperature-scaling claim은 각 논문의 data·architecture·pretraining·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Identity·split manifest·class mapping·input transform·weight revision·seed·metric·slice·latency·calibration·decision parameter를 함께 기록한다.",
      },
    ],
  },
  "vision-transformer": {
    title: "Vision Transformer 글이 소유하는 범위",
    owns: [
      "Image tensor를 non-overlapping patch sequence로 바꾸는 projection·position·special-token shape contract",
      "Patch projection matrix와 kernel=stride=P Conv2d 사이의 계산 동치와 position-grid resize",
      "DeiT distillation·Swin shifted window·MAE visible-only encoder가 해결하는 서로 다른 병목",
      "CNN–ViT paired quality–runtime 비교와 registry→token→logit parity→export checkpoint handoff",
    ],
    reuses: [
      {
        label: "Image tensor·convolution·translation equivariance",
        href: "/ai/cnn",
      },
      { label: "Q·K·V와 self-attention", href: "/ai/attention-theory" },
      {
        label: "Transformer block·position·output",
        href: "/ai/transformer-architecture",
      },
      {
        label: "Pretrained handoff·fine-tuning scope",
        href: "/ai/transfer-learning-practice",
      },
      {
        label: "Image pipeline split·resolution·decision",
        href: "/ai/image-classification-pipeline",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "ViT·DeiT·Swin·MAE claim은 각 논문의 pretraining data·teacher·architecture·task·compute 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Checkpoint revision·license·input transform·patch/grid·special token·position resize·class map·dtype·logit tolerance·runtime receipt를 함께 저장한다.",
      },
    ],
  },
  "multiview-fusion": {
    title: "멀티뷰 Fusion 글이 소유하는 범위",
    owns: [
      "같은 대상의 관측을 identity·coordinate·availability·order metadata와 묶는 episode sample contract",
      "Registered raw input concat과 explicit missingness mask를 사용하는 early-fusion 경계",
      "View별 encoder sharing·masked set aggregation·permutation invariance의 조건",
      "Pose-aware cross-view token·joint-attention cost와 missing-view paired intervention 평가",
    ],
    reuses: [
      { label: "Image tensor와 convolutional encoder", href: "/ai/cnn" },
      { label: "Q·K·V와 self-attention", href: "/ai/attention-theory" },
      {
        label: "Identity group split",
        href: "/ai/image-classification-pipeline",
      },
      {
        label: "Pretrained encoder handoff",
        href: "/ai/transfer-learning-practice",
      },
      {
        label: "Expectation과 paired average",
        href: "/ai/math-probability-expectation-variance",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "MVCNN·Set Transformer claim은 각 논문의 input representation·architecture·dataset·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Episode identity·view metadata·registration revision·mask·ordering·encoder sharing·fusion point·drop pattern·runtime을 함께 기록한다.",
      },
    ],
  },
  "deepfake-detection": {
    title: "딥페이크 탐지 글이 소유하는 범위",
    owns: [
      "Source clip·identity·generator·codec을 분리한 unseen-manipulation evaluation boundary와 worst-domain risk",
      "Face detection·tracking·alignment failure를 coverage와 lineage로 detector input에 전달하는 전처리 계약",
      "Spatial·frequency evidence의 corruption-conditional validity와 out-of-fold joint-error 비교",
      "Frame score의 video aggregation·calibration·abstention과 provenance·consent·coverage manifest",
    ],
    reuses: [
      {
        label: "Identity group split과 image pipeline",
        href: "/ai/image-classification-pipeline",
      },
      { label: "FFT와 spectrum", href: "/ai/fft" },
      {
        label: "Video sampling과 temporal model",
        href: "/ai/video-understanding",
      },
      {
        label: "Calibration과 decision threshold",
        href: "/ai/imbalanced-data",
      },
      { label: "Ensemble error diversity", href: "/ai/ensemble-methods" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "FaceForensics++·DFDC·DeepfakeBench·CNNDetection·Fourier discrepancy claim은 각 manipulation·source·codec·benchmark 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Source·identity·consent·generator·codec·crop/track revision·coverage·aggregation·calibration·threshold·abstention을 함께 기록한다.",
      },
    ],
  },
  "video-understanding": {
    title: "비디오 이해 글이 소유하는 범위",
    owns: [
      "Event duration·source FPS·temporal stride에서 관측 구간과 effective sampling rate를 정하는 계약",
      "Clip interval union coverage·train randomization·deterministic multi-clip evaluation",
      "3D temporal receptive field·I3D inflation·R(2+1)D factorization·SlowFast dual-rate allocation",
      "Tubelet token count와 joint/divided/factorized attention budget, VideoMAE visible-token pretraining 경계",
    ],
    reuses: [
      { label: "Sampling·aliasing·FFT", href: "/ai/fft" },
      { label: "Image tensor와 convolution geometry", href: "/ai/cnn" },
      { label: "Patch token과 position", href: "/ai/vision-transformer" },
      { label: "Q·K·V와 self-attention", href: "/ai/attention-theory" },
      {
        label: "Video score aggregation의 forensic 적용",
        href: "/ai/deepfake-detection",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "I3D·R(2+1)D·SlowFast·TimeSformer·ViViT·VideoMAE claim은 각 data·pretraining·clip·architecture·task 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Source FPS/timestamps·frames·stride·clip intervals·crop·tubelet·token·test clips·pretraining·latency·memory를 함께 기록한다.",
      },
    ],
  },
  "contrastive-learning": {
    title: "대조 학습 글이 소유하는 범위",
    owns: [
      "Positive·negative·unknown pair가 보존하거나 구분하는 의미와 불변성 계약",
      "Encoder representation·projection embedding·normalization·NT-Xent temperature의 연결",
      "Triplet relative margin과 easy·semi-hard·hard mining, false-negative filtering 경계",
      "Supervised multi-positive batch 조건과 pair audit→downstream evaluation feedback loop",
    ],
    reuses: [
      {
        label: "벡터·norm·내적·cosine",
        href: "/ai/math-vectors-inner-products",
      },
      { label: "Softmax와 cross-entropy", href: "/ai/cross-entropy" },
      {
        label: "Augmentation과 label preservation",
        href: "/ai/data-augmentation",
      },
      {
        label: "Train·validation·test와 empirical risk",
        href: "/ai/deep-learning-overview",
      },
      { label: "문장 embedding과 retrieval", href: "/ai/sentence-embeddings" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SimCLR·FaceNet·Supervised Contrastive Learning의 주장은 각 논문의 data·architecture·batch·mining·evaluation 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Pair relation·augmentation·normalization·temperature·margin·sampler·miner/index revision·seed·downstream metric을 함께 기록한다.",
      },
    ],
  },
  "domain-finetuning": {
    title: "도메인 적응 글이 소유하는 범위",
    owns: [
      "Language/style·fact freshness·task behavior·system constraint를 분리하고 최소 개입을 고르는 진단",
      "DAPT/TAPT corpus boundary·domain/general mixture·token budget과 checkpoint gain–forgetting 선택",
      "Task demonstration의 input·target·loss·update·evaluation 계약과 full/PEFT 비교",
      "유전체·의료·제조의 family/entity/time split과 license·consent·deletion provenance·coverage",
    ],
    reuses: [
      {
        label: "Pretrained handoff·distribution shift·negative transfer",
        href: "/ai/transfer-learning-practice",
      },
      {
        label: "Response-only SFT·packing·chat template",
        href: "/ai/supervised-fine-tuning",
      },
      { label: "RAG retrieval·citation·freshness", href: "/ai/rag-pipeline" },
      {
        label: "LoRA parameterization과 target modules",
        href: "/ai/lora-finetuning",
      },
      { label: "Perplexity와 next-token LM", href: "/ai/rnn#language-model" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "DAPT/TAPT·catastrophic forgetting claim은 각 논문의 model·corpus·objective·task·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Base checkpoint·tokenizer·corpus provenance·dedup/decontamination·mixture·token/update budget·loss mask·split·general regression·system cost를 함께 기록한다.",
      },
    ],
  },
  "sentence-embeddings": {
    title: "문장 임베딩 글이 소유하는 범위",
    owns: [
      "Token hidden state에서 padding을 제외해 sentence vector로 만드는 pooling·normalization 계약",
      "Relation objective와 cross/bi encoder 계산 경계, offline document reuse와 candidate-recall 상한",
      "Role instruction·token budget·truncation·dimension·precision·ANN index storage의 checkpoint/serving 계약",
      "Multi-positive Recall/NDCG와 language·length·query-style slice, 품질–latency–resource–storage frontier",
    ],
    reuses: [
      {
        label: "BERT token visibility와 cross/bi encoder 경계",
        href: "/ai/bert",
      },
      {
        label: "Pair semantics·cosine·hard negative",
        href: "/ai/contrastive-learning",
      },
      { label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" },
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/deep-learning-overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SBERT·E5·MTEB 주장은 각 논문의 encoder·data·objective·task·metric·benchmark snapshot 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Checkpoint/tokenizer revision·prefix·pooling·normalization·max length·truncation·dimension/dtype·corpus/index revision·multi-positive label·latency/storage를 함께 기록한다.",
      },
    ],
  },
  quantization: {
    title: "양자화 글이 소유하는 범위",
    owns: [
      "Affine INT quantizer의 scale·zero-point·round·clip과 rounding/clipping error 경계",
      "Per-tensor·channel·group scale, static/dynamic calibration, PTQ saturation·mixed-precision 판단",
      "QAT fake quantization·STE와 GPTQ/AWQ layer-output reconstruction의 서로 다른 보정 경로",
      "Numerical format·tensor dtype 조합·method·GGUF container·runtime kernel의 추상화 경계",
      "Weight·activation·KV·workspace resident memory와 Amdahl 기반 end-to-end speedup 검증",
    ],
    reuses: [
      {
        label: "Bit·byte와 code pattern",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      {
        label: "Matrix multiplication과 Frobenius norm",
        href: "/ai/math-matrices-svd",
      },
      { label: "Training loss와 gradient", href: "/ai/backprop-optimization" },
      {
        label: "통합 compression stage와 benchmark",
        href: "/ai/compression-pipeline",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Integer QAT·SmoothQuant·GPTQ·AWQ claim은 각 논문의 model·data·bit/group·kernel·hardware·task 범위로 제한한다.",
      },
      {
        kind: "primary-source",
        rule: "GGUF는 현재 공식 specification revision의 container·metadata·tensor encoding 규격으로만 설명한다.",
      },
      {
        kind: "standard",
        rule: "Base hash·target tensor·codebook·scale granularity/dtype·calibration·compute/accumulation/KV dtype·engine/kernel/fallback·quality·latency·memory를 함께 기록한다.",
      },
    ],
  },
  pruning: {
    title: "프루닝 글이 소유하는 범위",
    owns: [
      "Binary mask·density·sparsity의 정확한 분모와 zero value·removed connection의 구분",
      "Unstructured sparse value/index 손익분기와 magnitude·movement importance의 선택 경계",
      "Channel·head·block의 graph shape propagation과 N:M local pattern 제약",
      "SparseGPT layer reconstruction과 Wanda activation-aware score의 계산·calibration 경계",
      "Fixed-mask recovery 불변식과 artifact·quality·target-runtime을 함께 보는 승인 기준",
    ],
    reuses: [
      { label: "Matrix multiplication·norm", href: "/ai/math-matrices-svd" },
      {
        label: "Gradient와 optimizer state",
        href: "/ai/backprop-optimization",
      },
      {
        label: "Bit·byte 저장량 계산",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      {
        label: "양자화의 artifact/kernel 및 Amdahl 경계",
        href: "/ai/quantization#practice",
      },
      { label: "통합 compression pipeline", href: "/ai/compression-pipeline" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Movement Pruning·SparseGPT·Wanda claim은 각 논문의 model·data·sparsity pattern·calibration·task 범위로 제한한다.",
      },
      {
        kind: "primary-source",
        rule: "2:4 지원은 현재 target TensorRT/cuSPARSELt 문서의 axis·dtype·operator·shape·tactic 조건으로 확인한다.",
      },
      {
        kind: "standard",
        rule: "Base hash·target tensor·mask scope·score·sparsity schedule·calibration/recovery data·artifact format·engine build log·kernel coverage·quality·memory·latency를 함께 기록한다.",
      },
    ],
  },
  "knowledge-distillation": {
    title: "지식 증류 글이 소유하는 범위",
    owns: [
      "Teacher signal을 logit·feature·sequence·self-teacher interface로 구분하는 선택 경계",
      "Temperature soft target·class odds·hard/soft mixture·T² gradient scale과 KL 방향",
      "서로 다른 hidden dimension·layer·position 사이 feature projection과 alignment 계약",
      "Cross-tokenizer sequence distillation의 serialization·loss mask와 synthetic slice coverage",
      "Autoregressive state-distribution mismatch와 fixed/on-policy sequence mixture의 구분",
      "Student-visited prefix의 dense teacher feedback과 multi-teacher policy-space capability 통합",
      "Self-distillation generation별 teacher agreement·ground-truth quality·bias inheritance 진단",
    ],
    reuses: [
      {
        label: "Probability·softmax·cross-entropy·KL",
        href: "/ai/cross-entropy",
      },
      { label: "Gradient와 optimization", href: "/ai/backprop-optimization" },
      { label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" },
      { label: "SFT response-only loss와 data contract", href: "/ai/sft" },
      { label: "Train·validation·test", href: "/ai/deep-learning-overview" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Hinton KD·FitNets·Sequence KD·GKD·MOPD·Born-Again claim은 각 논문의 architecture·data·objective·task·metric 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Teacher/base hash·tokenizer·temperature·KL direction/reduction·alpha·feature layer/projection·prompt provenance·generation policy·on/off-policy mixture·domain routing·filter/template/loss mask·split·student-only runtime을 함께 기록한다.",
      },
    ],
  },
  "compression-pipeline": {
    title: "모델 압축 파이프라인 글이 소유하는 범위",
    owns: [
      "배포 병목에서 quantization·pruning·distillation·LoRA lever를 선택하는 경계",
      "Quality·memory·latency·compatibility hard guardrail과 최소 운영 복잡도 선택",
      "고정 resident와 요청별 KV/state를 분리한 memory-concurrency 1차 상한",
      "Compression stage의 non-commutative order effect와 중간 artifact receipt",
      "Baseline·단일 stage·결합 artifact의 interaction과 quality-gated Pareto frontier",
    ],
    reuses: [
      {
        label: "양자화 method·artifact·kernel·memory",
        href: "/ai/quantization",
      },
      { label: "프루닝 mask·pattern·runtime", href: "/ai/pruning" },
      {
        label: "지식 증류 signal·student evaluation",
        href: "/ai/knowledge-distillation",
      },
      { label: "LoRA adaptation·merge", href: "/ai/lora-finetuning" },
      { label: "Train·validation·test", href: "/ai/deep-learning-overview" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Compiler claim은 survey가 다루는 graph/IR/frontend/backend taxonomy 범위로 제한하고 실제 성능은 target engine trace로 확인한다.",
      },
      {
        kind: "primary-source",
        rule: "MLPerf는 scenario·accuracy/performance 분리·LoadGen 재현 원칙의 참고이며 내부 측정을 공식 submission으로 표현하지 않는다.",
      },
      {
        kind: "standard",
        rule: "Baseline/model/tokenizer·data/split·artifact chain·hardware/driver/engine/kernel·batch/length/arrival/concurrency·quality slice·memory·prefill/decode latency·throughput·load time를 함께 기록한다.",
      },
    ],
  },
  "rag-pipeline": {
    title: "RAG 파이프라인 글이 소유하는 범위",
    owns: [
      "Answer claim에서 source revision까지 이어지는 retrieval–generation trace와 stage별 실패 분리",
      "검색 child와 generation parent를 분리한 chunk boundary·answer-span coverage·source offset 계약",
      "Encoder·tokenizer·input·vector·corpus·ANN을 묶은 index version과 shadow switch·rollback",
      "Dense/sparse rank fusion·pre-retrieval ACL·candidate-recall 상한·reranking 경계",
      "Context token budget·untrusted retrieved data·citation validation·abstention policy",
      "Retrieval·context·answer·citation·system을 분리한 end-to-end evaluation trace",
    ],
    reuses: [
      {
        label: "문장 embedding·multi-positive retrieval metric",
        href: "/ai/sentence-embeddings",
      },
      {
        label: "Vector·cosine·normalization",
        href: "/ai/math-vectors-inner-products",
      },
      { label: "Tokenizer와 truncation", href: "/ai/tokenizer" },
      { label: "Train·validation·test", href: "/ai/deep-learning-overview" },
      {
        label: "도메인 적응과 RAG/fine-tuning 선택",
        href: "/ai/domain-finetuning",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "RAG·DPR·RRF·lost-in-the-middle·NDCG·Ragas claim은 각 논문의 corpus·task·model·metric·시대 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Source/ACL/valid-time·parser/chunk/offset·encoder/tokenizer/input/vector/index·candidate/rerank/context/prompt/model·claim/citation trace와 query-level metric을 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Formula의 stage indicator·index tuple·context ledger·citation contract는 운영 진단을 위한 이 글의 명시적 계약이며 특정 framework 표준으로 표현하지 않는다.",
      },
    ],
  },
  "lora-finetuning": {
    title: "LoRA·QLoRA 글이 소유하는 범위",
    owns: [
      "Frozen base와 trainable adapter·modules_to_save의 parameter/optimizer/checkpoint 경계",
      "Low-rank update BA의 shape·rank 상한·parameter budget과 target-module capacity 배분",
      "QLoRA의 quantized base storage·dequant compute·adapter training precision·memory ledger",
      "Chat template serialization·response-only loss mask·packing/truncation data contract",
      "Unmerged·merged·merged-requantized artifact의 algebra·호환성·parity·배포 승인 경로",
    ],
    reuses: [
      {
        label: "행렬 rank·SVD·low-rank approximation",
        href: "/ai/math-matrices-svd",
      },
      {
        label: "SFT demonstration·response loss mask",
        href: "/ai/supervised-fine-tuning",
      },
      { label: "Quantizer·metadata·kernel·memory", href: "/ai/quantization" },
      {
        label: "Domain adaptation intervention 선택",
        href: "/ai/domain-finetuning",
      },
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/deep-learning-overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "LoRA·QLoRA의 품질·parameter·memory claim은 각 논문의 model·target module·optimizer·data·hardware·evaluation 범위로 제한한다.",
      },
      {
        kind: "primary-source",
        rule: "PEFT API/default는 현재 설치 version의 공식 문서·config·checkpoint format으로 pin하고 영구 표준처럼 쓰지 않는다.",
      },
      {
        kind: "standard",
        rule: "Base/tokenizer/template·target/rank/alpha/dropout/init/bias/modules_to_save·quant/storage/compute dtype·data/split/mask·optimizer/batch/sequence/peak·adapter/merge/requant checksum·quality/latency를 함께 기록한다.",
      },
    ],
  },
  "multi-agent-implementation": {
    title: "멀티에이전트 구현 글이 소유하는 범위",
    owns: [
      "Single-agent baseline 대비 end-to-end time·cost·quality gain과 분리 타당성 판정",
      "Worker input snapshot·artifact/checksum·evidence·validation·uncertainty·idempotency receipt와 join 완료 조건",
      "병렬 state channel의 reducer 의미·순서 독립 조건·checkpoint/replay-safe side effect",
      "LangGraph state/node/edge/Send와 CrewAI Crew/Flow를 구현 예로 연결하는 현재 API 경계",
      "제조 advisory artifact와 deterministic rule·human approval·PLC interlock control path의 분리",
    ],
    reuses: [
      {
        label: "Agent run·delegation pattern·verification",
        href: "/ai/agentic-patterns",
      },
      { label: "Harness·loop·graph vocabulary", href: "/ai/llm-harness" },
      {
        label: "Tool permission과 sandbox",
        href: "/ai/agent-sandbox-security",
      },
      { label: "RAG source·citation trace", href: "/ai/rag-pipeline" },
      { label: "Serving concurrency·latency", href: "/ai/llm-serving-ops" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "LangGraph·CrewAI component/API claim은 현재 공식 문서와 설치 version 범위로 제한하고 framework 일반 우위로 확대하지 않는다.",
      },
      {
        kind: "standard",
        rule: "Task/input/model/tool/authority·artifact/checksum/schema/evidence·timeout/retry/idempotency·state/reducer/checkpoint·join/validator·cost/latency/quality/failure trace를 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Gain·join·reducer·manufacturing formulas는 implementation audit를 위한 이 글의 계약이며 framework가 보장하는 theorem으로 표현하지 않는다.",
      },
    ],
  },
  "competition-workflow": {
    title: "대회 워크플로우 글이 소유하는 범위",
    owns: [
      "Row·prediction cutoff·metric unit/direction과 local/public/private 역할을 고정한 평가 계약",
      "Entity/group·available time·shift를 추적하는 EDA 위험표와 leakage 판정",
      "Naive predictor에서 OOF·test prediction·submission까지 이어지는 baseline artifact chain",
      "한 가설·한 변경·paired fold/slice delta·cost gate로 구성한 실험 decision log",
      "Adaptive leaderboard feedback budget과 최종 candidate·retrain·submission provenance",
    ],
    reuses: [
      {
        label: "Train·validation·test의 역할",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Group·time split과 CV–LB mismatch",
        href: "/ai/cross-validation",
      },
      { label: "Metric 정의와 계산", href: "/ai/evaluation-metrics" },
      {
        label: "Run·artifact provenance",
        href: "/ai/training-pipeline#logging",
      },
      { label: "OOF ensemble·error diversity", href: "/ai/ensemble-methods" },
      { label: "실험 tracking과 비교", href: "/ai/experiment-tracking" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Model-selection bias·Ladder·ML technical-debt claim은 각 논문의 finite-sample/adaptive setting과 system 사례 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Data/row/group/time·split/fold·metric/weight·code/config/seed/environment·OOF/test/submission checksum·feedback/decision을 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Evaluation contract·OOF coverage·paired delta·feedback budget 수식은 대회 참가자의 audit를 위한 이 글의 계약이며 플랫폼 보장으로 표현하지 않는다.",
      },
    ],
  },
  "cross-validation": {
    title: "교차검증 글이 소유하는 범위",
    owns: [
      "배포에서 새로 나타나는 row·entity·time/site 단위에서 validation estimand와 split family를 선택하는 기준",
      "K-fold exact partition·fold-local transform·pooled OOF risk와 CV procedure estimand의 해석 경계",
      "Group disjointness·상위 dependency·independent-unit count와 fold별 group/class coverage",
      "Walk-forward origin·label available time·feature/target overlap에 따른 gap·purge 조건",
      "CV–leaderboard parity·pairwise direction agreement·adaptive protocol 변경 audit",
    ],
    reuses: [
      {
        label: "Train·validation·test와 loss",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Expectation·variance",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Competition evaluation contract와 selection bias",
        href: "/ai/competition-workflow",
      },
      {
        label: "Prediction cutoff와 available time",
        href: "/ai/competition-workflow#eda-phase",
      },
      {
        label: "Fold manifest를 포함한 training run",
        href: "/ai/training-pipeline#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "CV estimand·variance/interval claim은 Bates·Hastie·Tibshirani 논문의 OLS theorem·broader analysis·simulation 범위로 제한한다.",
      },
      {
        kind: "primary-source",
        rule: "Splitter semantics와 parameter는 현재 scikit-learn 공식 문서·설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Deployment unit/distribution·row/group/time metadata·fold manifest·fold-local fit·OOF row coverage·metric weight·origin/gap·candidate/leaderboard adaptation을 함께 기록한다.",
      },
    ],
  },
  "hyperparameter-tuning": {
    title: "하이퍼파라미터 튜닝 글이 소유하는 범위",
    owns: [
      "Parameter와 hyperparameter의 구분 및 search·selection·independent evaluation 계약",
      "Grid·random·sequential proposal의 차이와 random-search hit probability",
      "Optuna Study·Trial·sampler·pruner·storage의 역할 및 TPE density-ratio 직관",
      "Type·scale·conditional dependency·resource constraint를 포함한 versioned search space",
      "Comparable fidelity·successive halving·slow-starter bias·full-budget 재평가",
      "Multi-objective Pareto dominance와 complete/pruned/failed trial lineage",
    ],
    reuses: [
      {
        label: "Train·validation·test의 역할",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "확률분포·기댓값",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "지수·로그와 orders of magnitude",
        href: "/ai/math-exponents-logarithms",
      },
      { label: "배포를 모사하는 교차검증", href: "/ai/cross-validation" },
      {
        label: "Maximum-selection optimism",
        href: "/ai/competition-workflow#overview",
      },
      {
        label: "재현 가능한 training run",
        href: "/ai/training-pipeline#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Random search·TPE·Hyperband·Optuna claim은 각 원 논문의 search domain·task·resource·software version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "현재 Optuna Study API semantics는 stable 공식 문서와 설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Data/split/metric·space version·sampler/pruner/storage·trial state/resource/seed·code/environment/artifact·outer evaluation을 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Hit probability·feasible set·Pareto 식은 탐색 계약을 설명하기 위한 일반 수학이며 특정 sampler의 성능 보장으로 표현하지 않는다.",
      },
    ],
  },
  "ensemble-methods": {
    title: "앙상블 글이 소유하는 범위",
    owns: [
      "같은 OOF 행에서 error covariance를 측정해 model count와 diversity를 구분하는 기준",
      "Mean·simplex-weighted·percentile-rank prediction fusion의 보존 정보와 사용 경계",
      "Cross-fitted OOF matrix·meta-model·fold-test aggregation을 포함한 leakage-safe stacking",
      "Super Learner oracle 비교의 asymptotic 전제와 finite-sample 해석 한계",
      "Holdout blending의 base/meta data allocation과 group/time split trade-off",
      "Greedy marginal gain·serving cost·failure policy·ensemble artifact lineage",
    ],
    reuses: [
      {
        label: "Expectation·variance·covariance",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Train·validation·test의 역할",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "OOF prediction과 fold-local 경계",
        href: "/ai/cross-validation#kfold",
      },
      {
        label: "Hyperparameter selection·outer evaluation",
        href: "/ai/hyperparameter-tuning",
      },
      {
        label: "Probability calibration과 threshold",
        href: "/ai/imbalanced-data#evaluation",
      },
      {
        label: "Run·artifact provenance",
        href: "/ai/training-pipeline#overview",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Stacked Generalization·Super Learner·Ensemble Selection claim은 원 논문의 learner library·loss·CV·asymptotic/benchmark 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "scikit-learn StackingClassifier의 CV·prefit·final-estimator semantics는 현재 stable 문서와 설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Row/class/target mapping·OOF coverage·fold/base/meta revisions·weights·test aggregation·latency/memory/failure policy를 하나의 ensemble manifest로 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Error covariance·data allocation·marginal gain 수식은 결합 의사결정을 위한 일반 계약이며 특정 model 조합의 개선을 보장하지 않는다.",
      },
    ],
  },
  "evaluation-metrics": {
    title: "평가 지표 글이 소유하는 범위",
    owns: [
      "배포 decision unit·prediction-to-action policy·오류 비용·weight로 구성한 metric 계약",
      "관측·entity/query·slice·global의 hierarchical reducer와 macro·traffic population의 구분",
      "MAE·RMSE의 residual penalty와 absolute/squared risk가 목표로 하는 중앙값·평균",
      "Prediction interval의 empirical coverage·width 및 전체·conditional coverage 경계",
      "Classification ranking·probability·decision 층과 strictly proper probability score의 의미",
      "Recall·MRR·MAP·NDCG의 질문, graded relevance·rank discount·incomplete judgment 경계",
      "Training surrogate·validation selection·policy tuning·outer test와 hard guardrail 선택",
    ],
    reuses: [
      {
        label: "기댓값·조건부확률",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Train·validation·test의 역할",
        href: "/ai/deep-learning-overview#learning-loop",
      },
      {
        label: "Class prevalence·PR/ROC·confusion matrix·threshold·calibration",
        href: "/ai/imbalanced-data",
      },
      {
        label: "Multi-positive retrieval의 Recall@k·NDCG@k",
        href: "/ai/sentence-embeddings#evaluation",
      },
      {
        label: "Fold·OOF와 deployment-matched validation",
        href: "/ai/cross-validation",
      },
      {
        label: "Configuration selection과 outer evaluation",
        href: "/ai/hyperparameter-tuning",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Regression quantile·proper scoring rule·NDCG claim은 각 원 논문의 loss·probability-space·relevance/discount 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "scikit-learn metric·scorer 이름과 parameter semantics는 현재 stable 공식 문서와 설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Decision unit/distribution·prediction/action·cost·target/positive/relevance·k/threshold·weight/reducer/slice·candidate/data checksum을 metric receipt에 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Decision-risk·hierarchical reducer·feasible guardrail 수식은 평가 설계를 감사하기 위한 일반 계약이며 특정 metric이나 model의 성능 보장이 아니다.",
      },
    ],
  },
  "experiment-tracking": {
    title: "실험 추적 글이 소유하는 범위",
    owns: [
      "Experiment specification digest와 seed·retry·worker별 execution attempt identity의 분리",
      "URI·content digest·schema·size·producer를 포함한 immutable artifact reference",
      "Optimizer update·processed sample/token·wall time을 함께 보존하는 metric progress 좌표",
      "W&B artifact version·mutable alias와 승인 시점 resolution receipt의 경계",
      "MLflow backend metadata·artifact object store의 backup·retention·access·integrity lifecycle",
      "Registry alias·immutable model version과 실제 deployment revision의 parity",
      "Bitwise·numerical·statistical·behavioral reproduction acceptance와 hierarchical random streams",
      "Clean environment에서 first divergence·artifact·metric을 검사하는 reproduction test",
    ],
    reuses: [
      {
        label: "Training run·checkpoint·metric provenance",
        href: "/ai/training-pipeline",
      },
      {
        label: "확률분포·기댓값·분산",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Evaluation metric reducer·guardrail",
        href: "/ai/evaluation-metrics",
      },
      {
        label: "Hyperparameter study history·outer evaluation",
        href: "/ai/hyperparameter-tuning",
      },
      {
        label: "Competition experiment decision log",
        href: "/ai/competition-workflow#iteration",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "MLflow component와 reproducibility-program claim은 초기 project paper와 JMLR report의 시대·program·observational 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "W&B step/alias와 MLflow store/registry semantics는 현재 공식 문서와 설치 version 범위로 제한하고 stage deprecation을 반영한다.",
      },
      {
        kind: "standard",
        rule: "Spec/attempt ID·input/output digest/schema·progress axes·status/failure·alias/version event·store backup/access·reproduction level/tolerance를 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Digest tuple·replayable predicate·seed derivation·acceptance 식은 추적 계약을 설명하는 일반 설계이며 tool이 자동으로 보장하는 theorem이 아니다.",
      },
    ],
  },
  "imbalanced-data": {
    title: "불균형 데이터 글이 소유하는 범위",
    owns: [
      "Prevalence·score ranking·probability calibration·threshold decision의 분리",
      "Training-fold resampling과 SMOTE interpolation의 geometry·leakage 경계",
      "Class weight와 focal loss가 바꾸는 gradient signal의 차이",
      "Precision·recall·PR/ROC·cost threshold·slice monitoring의 운영 평가 계약",
    ],
    reuses: [
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/deep-learning-overview",
      },
      {
        label: "Probability·conditional probability",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Cross-entropy와 softmax probability",
        href: "/ai/cross-entropy",
      },
      { label: "Augmentation과 split leakage", href: "/ai/data-augmentation" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SMOTE·focal loss·PR/ROC·temperature scaling claim은 각 논문의 feature geometry·task·dataset·evaluation 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Prevalence·split·resampler·loss weight·score definition·threshold·cost·capacity·calibration·slice를 재현 가능한 decision contract로 기록한다.",
      },
    ],
  },
  "data-augmentation": {
    title: "Data augmentation 글이 소유하는 범위",
    owns: [
      "Augmentation distribution·target transform·label-preservation의 data contract",
      "Affine image 좌표와 box·mask·keypoint annotation 동기화",
      "Mixup soft target·CutMix area target·Mosaic annotation의 서로 다른 가정",
      "Tabular synthesis validity와 train·validation·robustness·TTA pipeline 경계",
    ],
    reuses: [
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/deep-learning-overview",
      },
      { label: "Image tensor와 translation equivariance", href: "/ai/cnn" },
      { label: "Soft target cross-entropy", href: "/ai/cross-entropy" },
      {
        label: "SMOTE·class imbalance와 threshold",
        href: "/ai/imbalanced-data",
      },
      {
        label: "Regularization 선택과 validation",
        href: "/ai/regularization-practice",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Mixup·CutMix·RandAugment claim은 각 논문의 dataset·model·operation·target 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Transform·parameter range·probability·order·input unit·annotation map·split·seed·evaluation slice를 재현 가능한 data contract로 기록한다.",
      },
    ],
  },
  "cross-entropy": {
    title: "Cross-entropy 글이 소유하는 범위",
    owns: [
      "Surprisal에서 entropy·cross-entropy·KL divergence로 이어지는 정보 비용 분해",
      "Categorical negative log-likelihood와 maximum likelihood의 연결 조건",
      "관측 분포에 따른 CE·MSE 선택과 likelihood contract",
      "Softmax–cross-entropy의 fused gradient와 log-sum-exp 수치 안정성",
    ],
    reuses: [
      {
        label: "지수·로그와 곱셈을 합으로 바꾸는 법칙",
        href: "/ai/math-exponents-logarithms",
      },
      {
        label: "확률분포·기댓값·표본평균",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Chain rule·backpropagation",
        href: "/ai/backprop-optimization",
      },
      {
        label: "분류 output과 prediction contract",
        href: "/ai/neural-network",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Entropy와 coding claim은 Shannon의 source alphabet·probability·coding 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Loss·likelihood·reduction·logarithm base·target support·numerical dtype을 함께 기록한다.",
      },
    ],
  },
  "supervised-fine-tuning": {
    title: "Supervised fine-tuning 글이 소유하는 범위",
    owns: [
      "Prompt·response·role·chat template·provenance를 포함한 demonstration 계약",
      "Response-only token NLL과 token/example reduction의 gradient weight 경계",
      "Teacher forcing prefix와 autoregressive inference prefix의 차이",
      "Sequence packing의 attention·position·label-shift boundary와 독립 behavior evaluation",
    ],
    reuses: [
      {
        label: "Language-model policy·attention/loss mask",
        href: "/ai/transformer-architecture",
      },
      { label: "Cross-entropy NLL·empirical risk", href: "/ai/cross-entropy" },
      { label: "Tokenizer·chat-template compatibility", href: "/ai/tokenizer" },
      { label: "Preference optimization·RLHF·DPO", href: "/ai/rlhf" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "FLAN·Self-Instruct·InstructGPT의 SFT claim은 각 task mixture·generator/filter·labeler·model 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Data provenance·chat template·tokenizer·loss mask·reduction·packing boundary·checkpoint·decoding·evaluation suite를 함께 기록한다.",
      },
    ],
  },
  autoencoder: {
    title: "Autoencoder 글이 소유하는 범위",
    owns: [
      "Deterministic encoder–latent–decoder 계산 계약과 reconstruction objective",
      "Undercomplete·overcomplete bottleneck과 identity solution을 막는 제약",
      "Linear autoencoder와 PCA가 연결되는 정리의 전제와 basis 비식별성",
      "Denoising·sparse·anomaly detection·masked autoencoder의 목적과 평가 경계",
    ],
    reuses: [
      {
        label: "신경망 학습 loop와 representation",
        href: "/ai/deep-learning-overview",
      },
      {
        label: "Chain rule·backpropagation",
        href: "/ai/backprop-optimization",
      },
      {
        label: "Matrix·rank·SVD·Eckart–Young 정리",
        href: "/ai/math-matrices-svd",
      },
      { label: "Likelihood와 reconstruction loss", href: "/ai/cross-entropy" },
      { label: "확률적 latent model로의 확장", href: "/ai/vae" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Deep AE·linear AE/PCA·denoising AE·MAE claim은 논문의 architecture·objective·dataset·evaluation 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Input·target·latent dimension·corruption·loss reduction·capacity·threshold·downstream metric을 재현 가능한 계약으로 기록한다.",
      },
    ],
  },
  vae: {
    title: "VAE 글이 소유하는 범위",
    owns: [
      "Amortized approximate posterior와 diagonal Gaussian encoder의 tensor 계약",
      "Gaussian pathwise reparameterization과 gradient estimator의 적용 범위",
      "Decoder likelihood에 따른 reconstruction NLL과 analytic Gaussian KL 구현",
      "Posterior collapse·active latent 진단·IWAE·β-VAE·VQ-VAE의 차이",
    ],
    reuses: [
      {
        label: "생성 모델 family의 공통 비교 지도",
        href: "/ai/generative-theory",
      },
      { label: "Deterministic autoencoder", href: "/ai/autoencoder" },
      {
        label: "Probability·expectation·variance",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "Likelihood·entropy·KL divergence", href: "/ai/cross-entropy" },
      { label: "Diffusion과 latent diffusion", href: "/ai/diffusion-models" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "AEVB·IWAE·posterior-collapse·VQ-VAE claim은 각 논문의 posterior family·decoder·dataset·estimator 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Encoder output·latent sample·decoder distribution·reduction·KL scale과 평가 metric을 재현 가능한 training contract로 기록한다.",
      },
    ],
  },
  gan: {
    title: "GAN 글이 소유하는 범위",
    owns: [
      "Generator pushforward distribution·discriminator density-ratio·non-saturating gradient의 연결",
      "두 optimizer의 alternating game·detach boundary·mode collapse 진단",
      "Wasserstein critic·Lipschitz constraint·gradient penalty·spectral normalization의 차이",
      "Conditional generation과 FID·precision/recall·latency를 분리한 평가 계약",
    ],
    reuses: [
      {
        label: "생성 모델 family의 공통 비교 지도",
        href: "/ai/generative-theory",
      },
      {
        label: "Probability·expectation",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Chain rule·VJP·backpropagation",
        href: "/ai/backprop-optimization",
      },
      { label: "Matrix·singular value", href: "/ai/math-matrices-svd" },
      { label: "Diffusion sampling path", href: "/ai/diffusion-models" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "GAN·WGAN·WGAN-GP·spectral normalization·TTUR/FID·precision/recall claim은 각 정리의 function class와 논문 실험 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "G·D loss·update ratio·detach 위치·regularizer·sample count·feature extractor·hardware를 재현 가능한 game과 evaluation 계약으로 기록한다.",
      },
    ],
  },
  "diffusion-models": {
    title: "Diffusion model 글이 소유하는 범위",
    owns: [
      "Gaussian forward noising·cumulative schedule·임의 timestep sampling의 연결",
      "Reverse parameterization·noise/score/x0/v target과 sampler의 분리",
      "Forward SDE·reverse-time SDE·probability-flow ODE·flow matching의 수학적 관계와 차이",
      "NFE·solver error·U-Net/DiT·latent diffusion·CFG를 포함한 생성 pipeline의 재현 계약",
    ],
    reuses: [
      {
        label: "생성 모델 family의 공통 비교 지도",
        href: "/ai/generative-theory",
      },
      {
        label: "Probability·expectation·variance",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "VAE·latent representation", href: "/ai/vae" },
      { label: "CNN·receptive field", href: "/ai/cnn" },
      { label: "Attention·cross-attention", href: "/ai/attention-theory" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "DDPM·score-SDE·flow matching·latent diffusion·CFG claim은 각 논문의 process·objective·solver·dataset 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Prediction target·noise schedule·sampler·step·NFE·guidance·autoencoder·precision을 분리해 재현 가능한 inference contract로 기록한다.",
      },
    ],
  },
  "open-r1": {
    title: "Open-R1 글이 소유하는 범위",
    owns: [
      "Distillation·R1-Zero-like RL·multi-stage reasoning recipe의 재현 claim 구분",
      "Reasoning trace SFT의 supervision·verifier-accessible output·template·EOS·length boundary",
      "GRPO within-prompt advantage·policy-ratio update·long-CoT normalization·sampler–trainer mismatch",
      "Versioned verifier의 측정 경계와 synthetic reasoning data lineage·sampling evaluation",
    ],
    reuses: [
      { label: "Feedback alignment의 공통 구조", href: "/ai/rlhf" },
      {
        label: "Knowledge distillation 일반론",
        href: "/ai/knowledge-distillation",
      },
      { label: "Code 실행 sandbox", href: "/ai/agent-sandbox-security" },
      {
        label: "Run·artifact provenance와 재현 acceptance",
        href: "/ai/experiment-tracking",
      },
      {
        label: "Metric reducer·sampling uncertainty·guardrail",
        href: "/ai/evaluation-metrics",
      },
      { label: "Production serving SLO", href: "/ai/llm-serving-ops" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Open-R1 기능·현재 default는 저장소와 TRL 공식 문서의 versioned 동작을 기준으로 한다.",
      },
      {
        kind: "primary-source",
        rule: "DeepSeek-R1·DeepSeekMath·DAPO·Dr. GRPO의 claim은 각 논문이 보고한 범위로 한정한다.",
      },
      {
        kind: "standard",
        rule: "Recipe scope·checkpoint/data/template·rollout/trainer/reward versions·loss normalization·sampling/evaluation protocol을 하나의 실행 receipt로 기록한다.",
      },
    ],
  },
  "llm-serving-ops": {
    title: "LLM 서빙 운영 글이 소유하는 범위",
    owns: [
      "Workload별 TTFT·TPOT·완료율·비용 SLO와 end-to-end latency 분해",
      "Gateway capability filtering·deadline·retry·fallback과 route provenance",
      "GPU Pod가 Ready capacity가 되는 cold-start 경로와 probe·rollout·HPA 계약",
      "사용자 SLI·error-budget burn rate에서 scale·route·rollback으로 이어지는 closed loop",
    ],
    reuses: [
      { label: "vLLM engine과 continuous batching", href: "/ai/vllm-serving" },
      { label: "vLLM scheduling", href: "/ai/vllm-scheduler" },
      { label: "PagedAttention과 KV cache", href: "/ai/vllm-paged-attention" },
      {
        label: "Hybrid attention 모델의 KV capacity",
        href: "/ai/hybrid-attention-serving",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Gateway·vLLM·Kubernetes·GPU Operator 동작은 각 프로젝트의 현재 공식 문서를 기준으로 한다.",
      },
      {
        kind: "standard",
        rule: "SLO·burn rate·closed-loop는 표준 용어를 유지하고 처음 등장할 때 운영 의미를 설명한다.",
      },
    ],
  },
  "llm-harness": {
    title: "하네스 글이 소유하는 범위",
    owns: [
      "Objective·context·authority·artifact·verifier·recovery를 하나의 run contract로 보는 관점",
      "경로 불확실성과 side-effect 위험으로 workflow·agent loop·checkpoint graph를 선택하는 기준",
      "trace에서 재현 case·회귀 테스트·canary 하네스 변경으로 이어지는 개선 loop",
    ],
    reuses: [
      {
        label: "컨텍스트 선택·메모리·compaction",
        href: "/ai/context-engineering",
      },
      { label: "ReAct·plan-execute·multi-agent", href: "/ai/agentic-patterns" },
      { label: "Skill의 포맷과 동적 로딩", href: "/ai/skills-anatomy" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "공개 사례는 OpenAI·Anthropic·LangChain이 실제로 설명한 범위까지만 쓴다.",
      },
      {
        kind: "project-claim",
        rule: "“loop·graph engineering”은 고정된 표준 계층이 아니라 최근의 설계 어휘로 표시한다.",
      },
    ],
  },
  "skills-anatomy": {
    title: "Agent Skill 글이 소유하는 범위",
    owns: [
      "Tool·Skill·Plugin의 authoring·execution·distribution 책임 경계",
      "SKILL.md trigger metadata와 scripts·references·assets resource layout",
      "Progressive disclosure·explicit/implicit invocation·Codex scope discovery",
      "Skill permission non-escalation과 trigger precision·recall 평가",
    ],
    reuses: [
      {
        label: "Hook·Skill·Guardrail·Verifier의 실행 경계",
        href: "/ai/agentic-patterns#hooks-skills",
      },
      {
        label: "Context selection과 progressive loading",
        href: "/ai/context-engineering",
      },
      {
        label: "Runtime capability와 approval 계약",
        href: "/ai/llm-harness#composition",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Codex 경로·budget·invocation·plugin 동작은 확인일의 OpenAI 공식 Build skills 문서 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "일반 Agent Skill 개념과 OpenAI 제품의 현재 directory·UI·loader 규약을 구분한다.",
      },
    ],
  },
  "context-engineering": {
    title: "컨텍스트 엔지니어링 글이 소유하는 범위",
    owns: [
      "한 generation이 실제로 읽는 context state와 selection·injection·compaction·isolation lifecycle",
      "Working state와 long-term memory의 수명·provenance·삭제 경계",
      "Source별 token budget·lost-in-the-middle position 평가·stable-prefix cache의 운영 경계",
    ],
    reuses: [
      {
        label: "RAG indexing·retrieval·reranking·citation 평가",
        href: "/ai/rag-pipeline",
      },
      { label: "하네스의 run contract·권한·검증", href: "/ai/llm-harness" },
      { label: "Compaction 구현과 상태 보존", href: "/ai/claw-compaction" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Lost in the Middle·MemGPT는 논문의 task·model·system 조건 안에서만 해석한다.",
      },
      {
        kind: "primary-source",
        rule: "Anthropic의 context engineering·context management 내용은 해당 제품 사례와 공개일을 표시하고 보편 법칙으로 확대하지 않는다.",
      },
    ],
  },
  "sionic-eureka": {
    title: "EUREKA가 소유하는 범위",
    owns: [
      "SionicAI의 코퍼스·합성 쿼리·multi-positive 학습 데이터 구성",
      "positive-aware hard negative와 scalar teacher score 파이프라인",
      "동일 조건 loss ablation과 프로젝트 평가 결과",
    ],
    reuses: [
      { label: "문장 임베딩의 기본 구조", href: "/ai/sentence-embeddings" },
      { label: "대조 학습과 hard negative", href: "/ai/contrastive-learning" },
      { label: "지식 증류의 일반 원리", href: "/ai/knowledge-distillation" },
      { label: "RAG 검색·평가 경계", href: "/ai/rag-pipeline" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "외부 방법론은 논문·공식 저장소의 용어와 조건을 따른다.",
      },
      {
        kind: "project-measurement",
        rule: "데이터 수, hyperparameter와 점수는 Sionic 내부 실험으로 표시한다.",
      },
    ],
  },
  "sionic-glm-b300": {
    title: "GLM-5.2/B300 최적화 글이 소유하는 범위",
    owns: [
      "Sionic이 관찰한 kernel·runtime 병목과 측정 조건",
      "Split-K·PQ-GEMM·TMEM·runtime patch의 조합 순서",
      "MTP acceptance length와 end-to-end throughput의 연결",
    ],
    reuses: [
      { label: "양자화의 일반 원리", href: "/ai/quantization" },
      { label: "Speculative decoding·MTP", href: "/ai/vllm-spec-decode" },
      { label: "LLM 서빙 운영 계층", href: "/ai/llm-serving-ops" },
      { label: "GPU memory·network 기초", href: "/gpu/hw-network" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "GPU 명령·제품 사양은 NVIDIA와 모델 공식 문서를 기준으로 한다.",
      },
      {
        kind: "project-measurement",
        rule: "µs, TB/s, tok/s와 acceptance length는 장비·batch·software 조건을 함께 표시한다.",
      },
      {
        kind: "project-claim",
        rule: "재현 자료가 없는 구현 효과는 Sionic의 해석·주장으로 분리한다.",
      },
    ],
  },
  "hw-memory": {
    title: "서버 메모리 정본 글이 소유하는 범위",
    owns: [
      "Working set·capacity·channel bandwidth·CAS/NUMA latency의 측정 경계",
      "DDR5 subchannel·ECC syndrome·on-die/system 보호 범위",
      "UDIMM·RDIMM·3DS·MRDIMM electrical path와 population acceptance",
    ],
    reuses: [
      {
        label: "Bit·byte 단위 변환",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "DDR·DIMM 구조는 JEDEC 규격, channel·DPC·MT/s는 target CPU·server population guide를 함께 고정한다.",
      },
      {
        kind: "project-measurement",
        rule: "Bandwidth·latency·ECC 안정성은 같은 firmware·population·NUMA 배치에서 단위와 workload를 표시해 측정한다.",
      },
    ],
  },
  "gpu-architecture": {
    title: "GPU architecture 정본 글이 소유하는 범위",
    owns: [
      "CPU launch에서 block placement·warp issue·completion으로 내려가는 hardware trace",
      "Register·shared/L1·L2·HBM의 scope·spill·traffic hierarchy",
      "Resource-limited residency, latency hiding과 Roofline peak/achieved 경계",
    ],
    reuses: [
      {
        label: "CUDA grid·block·thread·warp",
        href: "/gpu/cuda-thread-hierarchy",
      },
      {
        label: "Shared-memory transaction·bank",
        href: "/gpu/cuda-shared-memory",
      },
      { label: "Stream·event ordering", href: "/gpu/cuda-sync-streams" },
      {
        label: "PCIe·NVLink·network path",
        href: "/gpu/hw-network#interconnect",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Warp·SM·memory semantics는 CUDA Programming Guide와 target compute capability를 함께 기록한다.",
      },
      {
        kind: "project-measurement",
        rule: "Peak 사양과 achieved FLOP/s·byte/s·kernel time을 분리하고 같은 input·precision·compiler에서 paired 비교한다.",
      },
    ],
  },
  "hw-network": {
    title: "서버 네트워크 정본 글이 소유하는 범위",
    owns: [
      "PCIe raw/payload·latency 경계와 GPU–NIC peer topology, NVLink node-local 범위",
      "Workload traffic matrix와 line rate·payload goodput 측정 경계",
      "Ethernet link compatibility·leaf-spine oversubscription·failure state",
      "RDMA memory/queue path·RoCE v2 GID·GPUDirect topology·collective bandwidth 기초",
    ],
    reuses: [
      {
        label: "Bit·byte와 단위 변환",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      {
        label: "GPU SM·memory traffic 기초",
        href: "/gpu/gpu-architecture",
      },
      {
        label: "CUDA stream·multi-GPU resource ownership",
        href: "/gpu/cuda-sync-streams",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Ethernet·RoCE·InfiniBand·GPUDirect·NCCL 정의는 IEEE·IBTA·NVIDIA 공식 문서와 공개 코드를 기준으로 한다.",
      },
      {
        kind: "standard",
        rule: "Line rate·goodput·algbw·busbw·wire counter는 단위·방향·rank·operation 조건과 함께 분리한다.",
      },
    ],
  },
  "b300-switchless-network": {
    title: "스위치리스 B300 글이 소유하는 범위",
    owns: [
      "ConnectX-8 split 전후 physical·logical endpoint identity",
      "Full-mesh port/cable 예산과 /30 topology manifest",
      "Peer-aware GID·NCCL direct rail 선택과 switchless failure domain",
      "B300 2-node collective 실측의 line-rate·busbw 해석 경계",
    ],
    reuses: [
      {
        label: "Ethernet·RDMA·RoCE·InfiniBand 기본기",
        href: "/gpu/hw-network",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "NIC mode·link capability·NCCL 동작은 NVIDIA 공식 문서와 공개 patch를 기준으로 한다.",
      },
      {
        kind: "project-measurement",
        rule: "케이블 호환성과 collective bandwidth는 테스트한 장비·firmware·NCCL 버전에만 귀속한다.",
      },
      {
        kind: "project-claim",
        rule: "주소 규칙·custom patch·4–8 node 확장은 공개 코드와 실측 범위를 넘어 일반 표준으로 표현하지 않는다.",
      },
    ],
  },
  "agent-sandbox-security": {
    title: "에이전트 샌드박스 글이 소유하는 범위",
    owns: [
      "위협을 signal·egress·credential·kernel boundary로 나누는 판단법",
      "runc·seccomp·gVisor·Kata 선택 기준",
      "Kubernetes RBAC·NetworkPolicy·RuntimeClass를 결합한 배포 패턴",
    ],
    reuses: [
      { label: "Claude Code 도구·권한 모델", href: "/ai/claude-code" },
      { label: "MCP 경계와 capability", href: "/ai/mcp-protocol" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "보안 보장은 Kubernetes·gVisor·Kata·Cilium 공식 문서와 CVE advisory로 제한한다.",
      },
      {
        kind: "project-claim",
        rule: "회사 사용 사례와 성능 수치는 출처·환경이 없으면 일반 결론으로 쓰지 않는다.",
      },
    ],
  },
  "prompt-engineering": {
    title: "Prompt engineering 글이 소유하는 범위",
    owns: [
      "Objective·evidence·constraints·output·abstention·completion criteria의 request contract",
      "Chain-of-thought elicitation·faithfulness 경계와 self-consistency estimator",
      "Zero/few-shot·demonstration selection·ordering과 in-context learning의 사용 경계",
      "Structured output 소비자 계약과 prompt·model·template·decoding regression loop",
    ],
    reuses: [
      {
        label: "System instruction·untrusted data·runtime enforcement",
        href: "/ai/context-engineering#system-prompt",
      },
      {
        label: "CFG·token mask와 syntax/semantic validity",
        href: "/ai/grammar-constrained-generation",
      },
      {
        label: "Fine-tuning과 response loss",
        href: "/ai/supervised-fine-tuning",
      },
      { label: "XML delimiter의 구체적 작성법", href: "/ai/xml-prompting" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Few-shot·CoT·self-consistency·calibration·faithfulness claim은 각 논문의 model·task·prompt·decoding 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Prompt instruction과 runtime authorization·schema validation·domain verification을 서로 대체 가능한 안전장치로 표현하지 않는다.",
      },
    ],
  },
  "xml-prompting": {
    title: "XML prompting 글이 소유하는 범위",
    owns: [
      "Instruction·context·example·input을 구분하는 XML delimiter와 role tag vocabulary",
      "Well-formed nesting·dynamic character escaping·반복 record identity를 포함한 XML authoring 규칙",
      "Model XML output의 extraction·parse·schema·domain·policy validator pipeline",
      "Well-formed·DTD/schema-valid·semantic validity의 판정 경계와 XXE·entity expansion parser hardening",
      "XML·JSON·Markdown·plain text를 task·model별 quality·validity·cost로 비교하는 format evaluation",
    ],
    reuses: [
      {
        label: "Objective·evidence·output의 prompt request contract",
        href: "/ai/prompt-engineering#overview",
      },
      {
        label: "Instruction과 untrusted evidence의 경계",
        href: "/ai/prompt-engineering#overview",
      },
      {
        label: "CFG·token mask와 syntax/semantic validity",
        href: "/ai/grammar-constrained-generation",
      },
      {
        label: "Tool permission·egress·credential·sandbox enforcement",
        href: "/ai/agent-sandbox-security",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Claude에서 XML tag를 쓰는 효과와 작성법은 Anthropic의 현재 best-practice 문서 범위로 제한하고 다른 model의 보편 법칙으로 확대하지 않는다.",
      },
      {
        kind: "standard",
        rule: "XML syntax·well-formedness·DTD validity·entity 용어는 W3C XML 1.0 규격의 정의를 따르며 schema-valid·domain-valid·factually correct를 구분한다.",
      },
      {
        kind: "primary-source",
        rule: "XXE·entity expansion·parser default는 Python·OWASP 문서와 실제 library·underlying parser version을 함께 확인하고 prompt delimiter 보안과 혼동하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "XML이 대안 형식보다 낫다는 결론은 model snapshot·task set·prompt·parser·decoding을 고정한 quality·validity·token·latency 비교에만 귀속한다.",
      },
    ],
  },
  "mcp-protocol": {
    title: "MCP protocol 글이 소유하는 범위",
    owns: [
      "MCP 2026-07-28 stateless request·discovery·explicit handle 계약",
      "Tool·Resource·Prompt와 schema·resultType·list cache의 primitive 경계",
      "stdio·Streamable HTTP·routing header·MRTR·cancel·subscription wire semantics",
      "Authorization·retry·extension·deprecation을 production enforcement에 연결하는 방법",
    ],
    reuses: [
      {
        label: "Agent의 tool proposal·runtime authorization",
        href: "/ai/agentic-patterns",
      },
      {
        label: "하네스의 capability·verifier·recovery 계약",
        href: "/ai/llm-harness",
      },
      {
        label: "Code Mode의 MCP tool orchestration",
        href: "/ai/agent-code-mode",
      },
      {
        label: "Sandbox·egress·credential 격리",
        href: "/ai/agent-sandbox-security",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Protocol requirement와 deprecation은 MCP 2026-07-28 specification·changelog의 MUST·SHOULD·MAY 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Discovery metadata·model proposal·opaque handle과 실제 authentication·authorization·user consent를 구분한다.",
      },
    ],
  },
  "agent-code-mode": {
    title: "Code Mode 글이 소유하는 범위",
    owns: [
      "tool call 연속과 sandbox program 실행의 차이",
      "반복·분기·중간 데이터가 context 밖에서 처리될 때의 비용 모델",
      "MCP capability·grammar·sandbox를 결합한 실행 경계",
    ],
    reuses: [
      { label: "MCP의 tool·resource 계약", href: "/ai/mcp-protocol" },
      { label: "하네스의 검증·권한 계층", href: "/ai/llm-harness" },
      { label: "Structured output 사용 패턴", href: "/ai/prompt-engineering" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Code Mode라는 이름을 쓰는 구현의 실제 실행 모델을 공식 문서와 구분해 인용한다.",
      },
    ],
  },
  "grammar-constrained-generation": {
    title: "문법 제약 생성 글이 소유하는 범위",
    owns: [
      "CFG·PDA·parser state가 token mask로 이어지는 경로",
      "Tree-sitter의 incremental parsing과 LLM decoding의 차이",
      "schema compiler·tokenizer·decoder가 만나는 구현 경계",
    ],
    reuses: [
      {
        label: "프롬프트 수준 structured output",
        href: "/ai/prompt-engineering",
      },
      { label: "Code Mode의 program 실행", href: "/ai/agent-code-mode" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "XGrammar·Tree-sitter·JSON Schema 동작은 각 프로젝트 공식 문서를 따른다.",
      },
    ],
  },
  "mixture-of-experts": {
    title: "Mixture-of-Experts 정본이 소유하는 범위",
    owns: [
      "Dense FFN과 conditional expert FFN의 기본 계산 경로",
      "Token router·Top-k·weighted mixture와 load·capacity·overflow 계약",
      "Total/active parameter·expert-parallel dispatch를 분리하는 system cost ledger",
      "Sparsely-Gated MoE·GShard·Switch·DeepSeekMoE의 문제와 claim 경계",
    ],
    reuses: [
      {
        label: "Transformer block과 dense FFN",
        href: "/ai/transformer-architecture#transformer-block",
      },
      {
        label: "Softmax 계산과 gradient",
        href: "/ai/backprop-optimization#softmax",
      },
      {
        label: "Kimi K3의 LatentMoE 확장",
        href: "/ai/kimi-k3-architecture#stable-latent-moe",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Router·capacity·balancing·specialization claim은 각 원 논문의 architecture·task·hardware 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Active parameter를 FLOPs·memory·latency와 동일시하지 않고 shared compute·dispatch·imbalance를 별도 장부로 기록한다.",
      },
    ],
  },
  "kimi-k3-architecture": {
    title: "Kimi K3 구조 글이 소유하는 범위",
    owns: [
      "KDA recurrence·bounded decay와 23×(3 KDA+1 MLA)+final MLA sequence schedule",
      "Full Attention Residuals에서 K3의 8-block state bound로 내려가는 depth 경로",
      "LatentMoE·RMSNorm·SiTU-GLU·Quantile Balancing의 width·activation·load 계산",
      "공개 configuration·component method·종합 scaling·harness benchmark의 evidence boundary",
    ],
    reuses: [
      { label: "Attention 기본 원리", href: "/ai/attention-theory" },
      { label: "MoE router·load·system cost", href: "/ai/mixture-of-experts" },
      { label: "YaRN·RoPE 확장", href: "/ai/yarn-rope-extension" },
      { label: "증류의 일반 분류", href: "/ai/knowledge-distillation" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "크기·layer·expert·context와 KDA·AttnRes·Stable LatentMoE 식은 Kimi K3·Kimi Linear·Attention Residuals 원문을 따른다.",
      },
      {
        kind: "project-claim",
        rule: "왜 3:1인지, 특정 구성의 기여도처럼 ablation이 없는 해석은 추론으로 표시한다.",
      },
    ],
  },
  "hybrid-attention-serving": {
    title: "Hybrid attention 서빙 비교 글이 소유하는 범위",
    owns: [
      "MHA·GQA·MQA의 KV head 공유와 token당 KV byte 계산",
      "Qwen 27B 배포본·Muse Glimmer 30B·Gemma 4 31B의 KV shape와 실측 capacity 비교",
      "layer별 KV 보존 길이와 hybrid allocator에서 serving capacity로 내려가는 계산 순서",
      "망분리 환경의 artifact·quality·capacity 반입 체크리스트",
    ],
    reuses: [
      { label: "Attention 기본 원리", href: "/ai/attention-theory" },
      { label: "PagedAttention과 KV block", href: "/ai/vllm-paged-attention" },
      { label: "양자화와 VRAM budget", href: "/ai/quantization" },
      { label: "LLM 서빙 운영 지표", href: "/ai/llm-serving-ops" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "구조·context·artifact는 각 모델의 공식 model card와 config를 기준으로 한다.",
      },
      {
        kind: "project-measurement",
        rule: "97,216·88,824·352,736 KV token과 5.17×·1.36×·5.38× concurrency는 runtime build·TP·cache dtype 조건을 붙인 프로젝트 관측으로만 해석한다.",
      },
    ],
  },
  "vllm-serving": {
    title: "vLLM serving 입문 정본이 소유하는 범위",
    owns: [
      "Online generation request의 validation·waiting·prefill·decode·stream·completion lifecycle",
      "Iteration-level continuous batching과 token·sequence·KV hard feasibility",
      "TTFT·ITL·TPOT·E2E latency decomposition과 SLO goodput 승인 기준",
      "Frontend·engine core·executor·worker 책임 경계와 DP·TP·PP regular topology",
    ],
    reuses: [
      { label: "Autoregressive decoding", href: "/ai/seq2seq#decoder" },
      {
        label: "Scheduler priority·chunking·preemption",
        href: "/ai/vllm-scheduler",
      },
      {
        label: "PagedAttention block manager",
        href: "/ai/vllm-paged-attention",
      },
      {
        label: "KV cache shape와 capacity",
        href: "/ai/hybrid-attention-serving",
      },
      {
        label: "Production readiness·autoscaling·rollout",
        href: "/ai/llm-serving-ops",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Iteration-level scheduling과 PagedAttention claim은 Orca·vLLM 원 논문의 system·model·hardware·workload 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "현재 engine·metric·parallelism semantics는 vLLM 공식 문서와 runtime revision을 고정해 기록한다.",
      },
    ],
  },
  "vllm-scheduler": {
    title: "vLLM scheduler 정본 글이 소유하는 범위",
    owns: [
      "Request target·computed progress gap과 iteration token-budget 배정",
      "RUNNING·WAITING admission order, FCFS·priority semantics와 starvation 경계",
      "Chunked prefill의 decode interleaving·overhead tradeoff와 workload replay",
      "KV pressure preemption·requeue·prefix reuse·recomputation 비용과 진단 순서",
    ],
    reuses: [
      {
        label: "Online request lifecycle과 hard feasibility",
        href: "/ai/vllm-serving",
      },
      {
        label: "KV block mapping과 prefix cache",
        href: "/ai/vllm-paged-attention",
      },
      {
        label: "KV tensor shape와 runtime capacity",
        href: "/ai/hybrid-attention-serving",
      },
      {
        label: "Speculative verification과 state commit",
        href: "/ai/vllm-spec-decode",
      },
      { label: "Serving rollout과 SLO", href: "/ai/llm-serving-ops" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Chunked prefill과 preemptive scheduling의 연구 claim은 Sarathi-Serve·FastServe의 system·hardware·workload 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "RUNNING·WAITING order, priority, preemption state reset과 config 이름은 확인한 vLLM V1 source revision과 date를 고정한다.",
      },
    ],
  },
  "vllm-paged-attention": {
    title: "PagedAttention·KV block manager 정본 글이 소유하는 범위",
    owns: [
      "Variable-length KV state의 fixed-size logical·physical block allocation과 내부 fragmentation",
      "Request block table의 logical-token→physical-block address translation과 paged kernel 경계",
      "BlockPool reference count·free queue·cached block eviction의 ownership 불변식",
      "KVCacheManager의 cache lookup·slot demand·allocation 실패 계약과 hybrid cache group 경계",
      "Automatic Prefix Caching의 chained full-block hash·재사용 범위·운영 지표",
    ],
    reuses: [
      {
        label: "Autoregressive decoding과 KV state",
        href: "/ai/seq2seq#decoder",
      },
      {
        label: "Scheduler token budget과 preemption",
        href: "/ai/vllm-scheduler",
      },
      {
        label: "MHA·GQA·MQA와 KV byte·hybrid capacity",
        href: "/ai/hybrid-attention-serving",
      },
      {
        label: "Serving request lifecycle과 latency",
        href: "/ai/vllm-serving",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "PagedAttention·RadixAttention claim은 각 논문의 model·hardware·workload·runtime 설계와 평가 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "BlockPool·KVCacheManager·APC hash semantics는 현재 vLLM V1 source·design revision과 확인 날짜를 고정한다.",
      },
    ],
  },
  "vllm-spec-decode": {
    title: "Speculative decoding 정본 글이 소유하는 범위",
    owns: [
      "Draft·target verification·acceptance·KV/state commit으로 이어지는 speculative cycle",
      "Rejection sampling의 target-distribution 보존 조건과 첫 거부 이후 suffix causality",
      "Acceptance length·committed length·target weight-read amortization의 측정 정의",
      "Draft model·EAGLE·native MTP·N-gram proposer와 production serving 손익분기점",
    ],
    reuses: [
      { label: "Autoregressive decoding", href: "/ai/seq2seq#decoder" },
      {
        label: "확률분포·조건부확률·기댓값",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "KV cache와 serving capacity",
        href: "/ai/hybrid-attention-serving#kv-shape",
      },
      {
        label: "GLM-5.2·B300의 MTP 적용과 프로젝트 실측",
        href: "/ai/sionic-glm-b300#mtp",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "분포 보존·EAGLE feature proposal·tree verification claim은 각 원 논문의 algorithm·model·workload 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "vLLM의 지원 방식과 dynamic policy는 문서 version·target/draft artifact·sampler·K·runtime trace를 함께 고정한다.",
      },
      {
        kind: "project-measurement",
        rule: "GLM/B300 acceptance·throughput·kernel 수치는 적용 사례 글이 소유하며 일반 이론의 보편적 speedup으로 확대하지 않는다.",
      },
    ],
  },
  "distributed-systems": {
    title: "분산 시스템 기초 글이 소유하는 범위",
    owns: [
      "Process·local state·message·event·execution의 최소 system model",
      "Synchronous·asynchronous·partial timing과 crash·omission·Byzantine failure의 분류",
      "Consensus safety·liveness의 분리와 failure-injection oracle",
      "FLP bivalence·CAP partition execution·partial synchrony GST의 전제와 결론 경계",
      "Timing·randomness·failure detector·약한 문제 정의를 추가하는 assumption escape hatch",
    ],
    reuses: [
      {
        label: "상태 머신 복제·total-order log·Paxos·Raft",
        href: "/blockchain/smr-theory",
      },
      {
        label: "Byzantine quorum과 protocol별 fault threshold",
        href: "/blockchain/bft-theory",
      },
      {
        label: "공개 membership의 PoW·PoS와 fork choice",
        href: "/blockchain/consensus-mechanisms",
      },
      {
        label: "Retry 뒤 중복 side effect를 막는 idempotency",
        href: "/ai/agentic-patterns#react",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "FLP·CAP·DLS·Byzantine·failure-detector claim은 각 논문의 process·timing·failure·channel model과 conclusion 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Safety와 liveness, consistency model과 SLA, authentication과 honesty를 서로 다른 계약으로 유지한다.",
      },
      {
        kind: "project-measurement",
        rule: "Protocol 비교는 같은 binary·config·membership·schedule·fault trace에서 conflicting decision 0건과 recovery time을 paired 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "Timeout·throughput·validator 수 같은 배포 수치를 theorem의 보편적 결론으로 쓰지 않는다.",
      },
    ],
  },
  "smr-theory": {
    title: "상태 머신 복제 글이 소유하는 범위",
    owns: [
      "같은 initial state·ordered command·deterministic transition으로 replica state를 맞추는 SMR 계약",
      "Network receive와 total-order delivery, append·commit·apply·reply의 상태 경계",
      "Crash-majority quorum과 Raft term·log-prefix safety의 연결",
      "Paxos promise·highest accepted value adoption·chosen invariant",
      "Client retry dedupe와 external effect를 replicated-log commit에서 분리하는 경계",
    ],
    reuses: [
      {
        label: "Process·execution·failure·safety/liveness 기초",
        href: "/blockchain/distributed-systems",
      },
      {
        label: "Byzantine quorum과 authenticated protocol",
        href: "/blockchain/bft-theory",
      },
      {
        label: "Retry idempotency와 effect receipt",
        href: "/ai/agentic-patterns#react",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SMR·Raft·Paxos claim은 각 논문의 crash model·durable state·quorum·determinism 전제로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Local append, quorum commit, state-machine apply, client reply, external side effect를 서로 다른 상태로 기록한다.",
      },
      {
        kind: "project-measurement",
        rule: "채택 전 crash cut별 committed-prefix·state digest·reply dedupe·effect receipt를 같은 fixture에서 검증한다.",
      },
      {
        kind: "project-claim",
        rule: "Replicated log를 external API까지의 exactly-once 또는 Byzantine tolerance로 확대 해석하지 않는다.",
      },
    ],
  },
  "consensus-mechanisms": {
    title: "PoW·PoS 합의 메커니즘 글이 소유하는 범위",
    owns: [
      "Permissionless membership의 Sybil influence를 hash work·bonded stake에 연결하는 경계",
      "PoW hash-target lottery와 cumulative-work fork choice·probabilistic confirmation",
      "PoS stake-weighted selection·attestation·slashing evidence의 역할",
      "Canonical head를 고르는 fork choice와 history를 확정하는 finality의 분리",
      "같은 fault trace에서 security·resource·concentration을 비교하는 paired release gate",
    ],
    reuses: [
      {
        label: "Process·failure·safety/liveness 전제",
        href: "/blockchain/distributed-systems",
      },
      {
        label: "고정 membership의 log agreement",
        href: "/blockchain/smr-theory",
      },
      {
        label: "Byzantine quorum과 partial synchrony",
        href: "/blockchain/bft-theory",
      },
      {
        label: "Hash function·preimage resistance",
        href: "/crypto/hash-theory",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "PoW·Gasper claim은 원 논문의 network·resource·honesty·timing 전제와 분석 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "현재 Ethereum constant·fork·handler는 배포 client와 stable consensus-spec version에 귀속한다.",
      },
      {
        kind: "project-measurement",
        rule: "Protocol 비교는 동일 binary·config·membership·workload·fault schedule에서 paired 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "다른 chain·layer의 TPS·finality 숫자를 consensus family의 고정 성능으로 일반화하지 않는다.",
      },
    ],
  },
  "bft-theory": {
    title: "Byzantine fault tolerance 이론 글이 소유하는 범위",
    owns: [
      "Authenticated equivocation과 signature의 출처·무결성·honesty 경계",
      "Equal-weight 3f+1 membership·2f+1 certificate의 honest quorum intersection",
      "Phase certificate·lock·view-change evidence를 잇는 safety 규칙",
      "Partial synchrony GST와 pacemaker·honest leader에 따른 조건부 liveness",
      "Membership/weight snapshot과 adversarial failure-injection release gate",
    ],
    reuses: [
      {
        label: "Process·timing·failure·safety/liveness",
        href: "/blockchain/distributed-systems",
      },
      {
        label: "Crash-majority log replication",
        href: "/blockchain/smr-theory",
      },
      {
        label: "Permissionless resource weighting·PoS attestation",
        href: "/blockchain/consensus-mechanisms",
      },
      { label: "Digital signature 기초", href: "/crypto/digital-signature" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Threshold·safety·liveness claim은 oral/signed message·timing·membership·fault model을 함께 고정한다.",
      },
      {
        kind: "standard",
        rule: "Certificate는 signer uniqueness·domain·phase·view·height·value digest·membership version을 검증한다.",
      },
      {
        kind: "project-measurement",
        rule: "동일 schedule에서 conflicting commit 0건과 GST 뒤 recovery를 별도 oracle로 paired 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "논문의 message complexity·latency를 임의 구현·WAN·weighted deployment의 고정 성능으로 확대하지 않는다.",
      },
    ],
  },
  "pos-theory": {
    title: "Proof of Storage 이론 글이 소유하는 범위",
    owns: [
      "PoR retrievability·PoRep replica-specific encoding·PoSt time-window evidence의 claim 분리",
      "PoR challenge·extractor와 sampling detection probability의 전제",
      "PoRep data/replica commitment와 replica identity·parameter binding",
      "PoSt fresh randomness·window·sector snapshot과 restart/reorg evidence ledger",
      "Cryptographic storage proof와 retrieval·availability·privacy·placement SLO의 경계",
    ],
    reuses: [
      {
        label: "Content digest와 address integrity",
        href: "/p2p/content-addressing",
      },
      {
        label: "Hash function과 collision/preimage 경계",
        href: "/crypto/hash-theory",
      },
      {
        label: "Erasure coding과 복구 threshold",
        href: "/crypto/erasure-coding",
      },
      {
        label: "SNARK statement·witness·verification",
        href: "/crypto/snark-theory",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "PoR·PoRep·PoSt claim은 원 논문과 표시한 공식 specification의 challenge·extractor·commitment·timing 전제에 제한한다.",
      },
      {
        kind: "standard",
        rule: "Sector size·window·parameter·proof variant 같은 현재 constant는 배포 network와 actor/proof version에 귀속한다.",
      },
      {
        kind: "project-measurement",
        rule: "Proof 성공과 retrieval SLO는 같은 data·replica에서 별도 receipt·failure oracle로 paired 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "Proof acceptance를 낮은 latency·상시 availability·confidentiality·geographic placement의 증명으로 확대하지 않는다.",
      },
    ],
  },
  "cometbft-types": {
    title: "CometBFT protocol type 글이 소유하는 범위",
    owns: [
      "Wire evidence와 local runtime state의 구분",
      "Header commitment와 previous execution result의 높이 연결",
      "Canonical vote sign bytes와 voting-power Commit 검증",
      "Validator proposer-priority scheduler와 historical set snapshot",
      "Duplicate-vote evidence의 탐지·검증·전달 pipeline",
    ],
    reuses: [
      { label: "CometBFT 전체 owner·transaction lifecycle", href: "/blockchain/cometbft" },
      { label: "BFT quorum intersection·lock", href: "/blockchain/bft-theory" },
      { label: "Hash·content identity", href: "/p2p/content-addressing" },
      { label: "Consensus H/R/S transition", href: "/blockchain/cometbft-consensus" },
      { label: "ABCI FinalizeBlock·AppHash", href: "/blockchain/cometbft-abci" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Field·encoding·validation·sign-byte claim은 CometBFT v0.40.0 tag의 data-structure specification과 source에 귀속한다." },
      { kind: "standard", rule: "Production에서는 semver·git SHA·chain ID·height와 historical validator-set hash를 함께 고정한다." },
      { kind: "project-measurement", rule: "Malformed field·wrong chain/round·duplicate signature·wrong set·stale evidence fixture를 valid oracle과 paired 검증한다." },
      { kind: "project-claim", rule: "Commitment·signature acceptance를 application validity나 economic penalty 완료로 확대하지 않는다." },
    ],
  },
  "cometbft-consensus": {
    title: "CometBFT consensus state-machine 글이 소유하는 범위",
    owns: [
      "Height·round·step 좌표와 consensus event serialization",
      "Proposal·prevote·precommit·nil vote의 transition semantics",
      "PoLC·valid round·lock 갱신 규칙",
      "Round timeout schedule과 stale-event suppression",
      "Equivocation detection과 application penalty의 구분",
    ],
    reuses: [
      { label: "BFT quorum·lock·partial synchrony", href: "/blockchain/bft-theory" },
      { label: "Vote·Commit·ValidatorSet wire verification", href: "/blockchain/cometbft-types" },
      { label: "ABCI proposal validation·execution", href: "/blockchain/cometbft-abci" },
      { label: "CometBFT architecture owner map", href: "/blockchain/cometbft" },
    ],
    evidence: [
      { kind: "primary-source", rule: "State transition·PoLC·timeout·proof claim은 CometBFT v0.40.0 consensus specification과 pinned source에 제한한다." },
      { kind: "standard", rule: "Safety·liveness는 validator power·authentication·partial-synchrony 전제를 함께 표시한다." },
      { kind: "project-measurement", rule: "Equivocation·nil vote·delayed parts·stale timer·crash/WAL replay를 같은 seed와 schedule로 candidate/base에 주입한다." },
      { kind: "project-claim", rule: "Queue arrival·timeout expiry·vote count를 commit이나 fixed latency 보장으로 읽지 않는다." },
    ],
  },
  "cometbft-abci": {
    title: "CometBFT ABCI++ integration 글이 소유하는 범위",
    owns: [
      "Consensus·mempool·query·snapshot logical connection과 state ordering",
      "PrepareProposal·ProcessProposal coherence와 determinism 경계",
      "Candidate execution과 committed application state의 격리",
      "FinalizeBlock deterministic transition과 AppHash next-header 연결",
      "Commit durability·height handshake·crash replay",
    ],
    reuses: [
      { label: "Consensus/application top-level boundary", href: "/blockchain/cometbft" },
      { label: "H/R/S·proposal·vote decision", href: "/blockchain/cometbft-consensus" },
      { label: "Header·Commit·AppHash wire objects", href: "/blockchain/cometbft-types" },
      { label: "Deterministic SMR·external effect boundary", href: "/blockchain/smr-theory" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Method field·call timing·determinism·crash recovery claim은 CometBFT v0.40.0 ABCI++ method와 application-requirement spec에 귀속한다." },
      { kind: "standard", rule: "Transport·application binary/config·ABCI protocol·database schema·chain height를 같은 deployment snapshot으로 기록한다." },
      { kind: "project-measurement", rule: "Multi-round candidate·Process divergence·Finalize/Commit crash·restart·state sync를 deterministic result·AppHash·height oracle로 검사한다." },
      { kind: "project-claim", rule: "CheckTx·Prepare·Process ACCEPT·Finalize response를 durable Commit이나 external exactly-once receipt로 확대하지 않는다." },
    ],
  },
  cometbft: {
    title: "CometBFT architecture overview가 소유하는 범위",
    owns: [
      "CometBFT consensus engine과 deterministic ABCI++ application의 top-down owner 경계",
      "Receive·CheckTx·proposal·commit·FinalizeBlock·app hash transaction lifecycle trace",
      "Admission·proposal hook·authoritative finalization·persistence status의 분리",
      "CometBFT·ABCI·application·chain·database version snapshot receipt",
      "External effect reconciliation과 adversarial architecture release gate",
    ],
    reuses: [
      { label: "Process·failure·timing model", href: "/blockchain/distributed-systems" },
      { label: "Deterministic SMR·commit/apply·client retry", href: "/blockchain/smr-theory" },
      { label: "Byzantine quorum·lock·view change", href: "/blockchain/bft-theory" },
      { label: "CometBFT type·consensus·ABCI·execution·state 세부", href: "/blockchain/cometbft-types" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Package·method·field·lifecycle claim은 표시한 CometBFT release 또는 git SHA와 official ABCI/consensus specification에 귀속한다." },
      { kind: "standard", rule: "Moving main과 latest docs를 production binary의 고정 동작으로 읽지 않고 semver·ABCI version·application version을 함께 기록한다." },
      { kind: "project-measurement", rule: "Candidate 채택은 같은 genesis·validator set·application·transaction·network schedule의 paired fault matrix로 검증한다." },
      { kind: "project-claim", rule: "CheckTx·P2P receive·consensus commit을 application disk commit이나 external effect exactly-once로 확대하지 않는다." },
    ],
  },
  "reth-cli": {
    title: "Reth CLI·NodeBuilder 글이 소유하는 범위",
    owns: [
      "CLI·config file·default precedence와 normalized config provenance",
      "NodeBuilder typestate와 component dependency DAG",
      "Core component와 RPC·ExEx·lifecycle hook add-on 경계",
      "Launch state·readiness·crash cleanup supervision receipt",
      "Node assembly adversarial release·rollback gate",
    ],
    reuses: [
      { label: "Reth execution-client·block lifecycle", href: "/blockchain/reth" },
      { label: "Chain identity·fork activation", href: "/blockchain/reth-chainspec" },
      { label: "Provider pinned view·storage ownership", href: "/blockchain/reth-provider" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Flag·default·type·method·trait claim은 실행한 Reth 2.x semver/SHA와 official CLI/crate docs·source에 귀속한다." },
      { kind: "standard", rule: "CLI parse success와 compile-time assembly success를 runtime readiness·chain correctness로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 normalized config·chain spec·storage snapshot에서 failure matrix와 lifecycle receipt parity를 먼저 비교한다." },
      { kind: "project-claim", rule: "Moving main·old crate layout·README 성능을 모든 release·custom node의 고정 동작으로 일반화하지 않는다." },
    ],
  },
  "reth-chainspec": {
    title: "Reth ChainSpec·genesis 글이 소유하는 범위",
    owns: [
      "Chain ID·genesis hash·fork schedule·protocol parameter의 chain identity bundle",
      "Block·Timestamp·TTD·Never activation predicate와 boundary context",
      "Genesis alloc→state root→conditional header→sealed hash derivation",
      "Fork ID compatibility filter와 validator·EVM·payload·network consumer parity",
      "Genesis·fork boundary release gate",
    ],
    reuses: [
      { label: "Reth execution block lifecycle", href: "/blockchain/reth" },
      { label: "Ethereum execution·consensus architecture", href: "/blockchain/ethereum-architecture" },
      { label: "Reth peer/session compatibility path", href: "/blockchain/reth-net" },
    ],
    evidence: [
      { kind: "primary-source", rule: "ChainSpec field·ForkCondition·genesis builder claim은 pinned Reth 2.x crate docs/source와 EIP에 귀속한다." },
      { kind: "standard", rule: "Fork ID를 peer honesty·block validity 증명으로, chain ID 일치를 동일 genesis·ruleset 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Raw genesis·spec bytes가 같은 paired boundary fixture에서 derived root·hash·consumer decision parity를 검사한다." },
      { kind: "project-claim", rule: "Current mainnet fork list·field·activation을 custom chain이나 future release의 영구 상수로 일반화하지 않는다." },
    ],
  },
  "reth-net": {
    title: "Reth discovery·RLPx·ETH network 글이 소유하는 범위",
    owns: [
      "Discovery candidate·pending transport·authenticated session·active peer 상태 분리",
      "Signed record freshness·diversity와 session outcome feedback",
      "RLPx capability intersection·ETH Status compatibility gate",
      "Announcement·request/response·bounded channel backpressure",
      "Reason-coded close·reputation과 adversarial network release gate",
    ],
    reuses: [
      { label: "Reth execution network-input boundary", href: "/blockchain/reth" },
      { label: "ChainSpec fork ID·genesis compatibility", href: "/blockchain/reth-chainspec" },
      { label: "Distributed process·message·failure model", href: "/blockchain/distributed-systems" },
    ],
    evidence: [
      { kind: "primary-source", rule: "RLPx·ETH·Discv5 wire claim은 official devp2p specification과 pinned Reth 2.x source에 귀속한다." },
      { kind: "standard", rule: "Address discovery·signature·TCP·encrypted channel·Status를 peer honesty나 block validity로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 signed record·DNS·clock·seed·fault schedule에서 state·cleanup·message parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "특정 ETH version·queue size·peer limit·Discv5 default를 모든 release·deployment의 고정값으로 일반화하지 않는다." },
    ],
  },
  reth: {
    title: "Reth architecture overview가 소유하는 범위",
    owns: [
      "Execution client와 consensus client의 Engine API owner 경계",
      "Block input→validation→EVM execution→canonicalization→storage→provider trace",
      "Historical stage pipeline과 live Engine path의 cursor·retry·shared invariant 분리",
      "Mutable state·immutable history·index의 storage ownership과 pinned provider view",
      "Reth·chain spec·Engine fork·storage schema provenance와 reorg/release gate",
    ],
    reuses: [
      { label: "Ethereum execution·consensus architecture", href: "/blockchain/ethereum-architecture" },
      { label: "EVM deterministic transition", href: "/blockchain/evm" },
      { label: "SMR commit·apply·retry boundary", href: "/blockchain/smr-theory" },
      { label: "Reth CLI·network·pipeline·execution·storage·RPC 상세", href: "/blockchain/reth-cli" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Crate·trait·pipeline·storage claim은 표시한 Reth semver 또는 git SHA와 official docs/source에 귀속한다." },
      { kind: "standard", rule: "Ethereum execution·Engine fork behavior는 chain spec과 protocol version을 함께 고정하며 Reth 문서를 protocol 정본 전체로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Node 후보는 같은 chain snapshot·peer fixture·Engine sequence·chain spec의 paired correctness gate 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Repository marketing·moving main·특정 benchmark를 모든 network·hardware·storage profile의 고정 성능으로 일반화하지 않는다." },
    ],
  },
  prysm: {
    title: "Prysm consensus-client overview가 소유하는 범위",
    owns: [
      "Beacon node·validator client·execution client의 consensus·signing·Engine API owner 경계",
      "SSZ wire object→검증→beacon state→fork-choice head·finality→duty/signature lifecycle trace",
      "Decode·topic·fork·signature·stateless·stateful validation의 단계별 failure 분리",
      "Post-state·head·justified/finalized checkpoint와 validator signing authority의 identity 경계",
      "Prysm·consensus spec·network·database·execution-client version receipt와 release gate",
    ],
    reuses: [
      { label: "PoS consensus와 validator 역할", href: "/blockchain/consensus-mechanisms" },
      { label: "Byzantine quorum·safety·liveness", href: "/blockchain/bft-theory" },
      { label: "Reth execution-client·Engine 경계", href: "/blockchain/reth" },
      { label: "Prysm SSZ·BLS·state·fork choice·validator·Engine 세부", href: "/blockchain/prysm-ssz" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Package·object·validation·runtime claim은 표시한 Prysm release 또는 git SHA와 official Ethereum consensus-spec commit·fork에 귀속한다." },
      { kind: "standard", rule: "Stable·unstable fork와 master·develop branch를 구분하고 future specification을 현재 production rule로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Candidate는 같은 genesis·fork·object·peer·Engine fixture에서 state·head·finality·duty parity를 통과한 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Gossip accept·state transition·head selection·finality·execution validity·signature를 하나의 success로 합치거나 repository 설명을 모든 deployment의 성능·안전으로 일반화하지 않는다." },
    ],
  },
  "prysm-ssz": {
    title: "Prysm SSZ serialization·Merkle proof 글이 소유하는 범위",
    owns: [
      "SSZ fork schema에서 static/dynamic wire layout과 bounded canonical decode",
      "Basic packing·composite child root·zero padding·mix-in-length를 잇는 hash-tree-root 계산",
      "Generalized index와 single/multiproof의 helper-node 검증 경계",
      "Type·fork·byte length·root·decode result를 잇는 SSZ receipt와 release fixture",
    ],
    reuses: [
      { label: "Consensus object의 wire→state lifecycle", href: "/blockchain/prysm" },
      { label: "BeaconState value와 incremental root cache", href: "/blockchain/prysm-beacon-state" },
      { label: "유한체 arithmetic와 algebraic proof 기초", href: "/crypto/finite-field-theory" },
    ],
    evidence: [
      { kind: "standard", rule: "Type·encoding·Merkle proof 규칙은 고정한 consensus-spec release/commit과 fork schema에 귀속한다." },
      { kind: "primary-source", rule: "Prysm package·generated method·cache 동작은 분석한 release/SHA의 actual source에만 귀속한다." },
      { kind: "project-measurement", rule: "Official vector·round trip·root/proof parity·bounded malformed input을 통과한 뒤 bytes/s와 allocation을 비교한다." },
      { kind: "project-claim", rule: "Decode·proof 성공을 signature·canonical chain·state transition validity로 확대하지 않는다." },
    ],
  },
  "prysm-bls": {
    title: "Prysm BLS authorization·aggregation 글이 소유하는 범위",
    owns: [
      "BLS12-381 G1 public key·G2 signature·pairing의 Ethereum group 역할",
      "Consensus signing root와 BLS ciphersuite DST의 서로 다른 domain-separation 경계",
      "Point validation·PoP·same/distinct-message API와 rogue-key 방어 전제",
      "Native BLST binding·randomized batch·failure isolation·deadline release gate",
    ],
    reuses: [
      { label: "SSZ object root와 schema commitment", href: "/blockchain/prysm-ssz" },
      { label: "Validator duty·slashing signing boundary", href: "/blockchain/prysm" },
      { label: "Prime-field modular arithmetic", href: "/crypto/finite-field-theory" },
    ],
    evidence: [
      { kind: "standard", rule: "BLS API·PoP·validation 전제는 표시한 CFRG draft revision과 Ethereum consensus-spec fork를 함께 고정한다." },
      { kind: "primary-source", rule: "Prysm wrapper·BLST native behavior는 실제 dependency commit·compiler·CPU feature에 귀속한다." },
      { kind: "project-measurement", rule: "Malformed point·wrong domain·rogue key·batch failure의 판정 parity 뒤 throughput·tail·fallback을 비교한다." },
      { kind: "project-claim", rule: "Aggregate 96 bytes를 public-key/participant evidence나 protocol authorization 전체가 96 bytes라는 뜻으로 읽지 않는다." },
    ],
  },
  "prysm-beacon-state": {
    title: "Prysm BeaconState value·cache·fork 글이 소유하는 범위",
    owns: [
      "Fork별 BeaconState protocol snapshot과 state-root identity",
      "Read interface·controlled setter·Copy-on-Write의 backing owner와 alias isolation",
      "Dirty field/chunk tracking과 FieldTrie incremental-root cache invariant",
      "Fork upgrade·reorg·restart에서 full-root parity를 먼저 보는 versioned release gate",
    ],
    reuses: [
      { label: "SSZ packing·Merkleization·mix-in-length", href: "/blockchain/prysm-ssz" },
      { label: "Post-state·fork-choice head·finality 분리", href: "/blockchain/prysm" },
      { label: "Slot·epoch·block transition 상세", href: "/blockchain/prysm-slot-processing" },
    ],
    evidence: [
      { kind: "standard", rule: "State field·upgrade·transition은 고정한 consensus-spec release/commit·fork·network preset에 귀속한다." },
      { kind: "primary-source", rule: "COW·FieldTrie·interface·cache claim은 표시한 Prysm release/SHA의 source에만 귀속한다." },
      { kind: "project-measurement", rule: "Full SSZ root를 oracle로 COW branch·dirty path·fork boundary·reorg·restart parity 뒤 memory/hash/latency를 비교한다." },
      { kind: "project-claim", rule: "Post-state 계산을 canonical head·finality로, reference count를 state 전체 thread safety로 확대하지 않는다." },
    ],
  },
  libp2p: {
    title: "libp2p connection·Swarm 아키텍처 글이 소유하는 범위",
    owns: [
      "Transport→security→multiplexer→Swarm으로 이어지는 connection output 조립",
      "NetworkBehaviour의 peer-global state와 ConnectionHandler의 connection-local state 경계",
      "Swarm command/event 왕복과 poll progress·fairness·backpressure",
      "Stream multiplexing과 substream application protocol negotiation의 구분",
      "한 connection의 phase별 trace·failure cleanup·release gate",
    ],
    reuses: [
      {
        label: "TLS 1.3 authenticated secure channel",
        href: "/p2p/tls-fundamentals",
      },
      {
        label: "QUIC packet·stream·migration state",
        href: "/p2p/quic-fundamentals",
      },
      {
        label: "Content-addressed byte integrity",
        href: "/p2p/content-addressing",
      },
      { label: "TCP raw connection 구현", href: "/p2p/libp2p-tcp" },
      { label: "Noise PeerId binding 구현", href: "/p2p/libp2p-noise" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Wire bootstrap·negotiation 주장은 libp2p connection specification의 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Rust trait·variant·poll semantics는 표시한 rust-libp2p crate version과 feature에 귀속한다.",
      },
      {
        kind: "project-measurement",
        rule: "Fairness·buffer·latency 판단은 같은 binary·runtime·workload에서 queue·CPU·event delay·cleanup을 함께 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "Layer 수나 추상화만으로 고정 성능·remote 처리 완료·delivery guarantee를 일반화하지 않는다.",
      },
    ],
  },
  "libp2p-noise": {
    title: "noise-libp2p secure-channel 글이 소유하는 범위",
    owns: [
      "Noise XX 세 message의 token·DH·handshake-state 변화",
      "Noise static DH key와 libp2p identity key의 역할 분리",
      "Identity signature·derived PeerId·expected PeerId의 binding 검증",
      "2-byte length·bounded ciphertext·AEAD tag의 framed transport lifecycle",
      "Malformed payload·identity mismatch·counter 수명에서 fail-closed release gate",
    ],
    reuses: [
      {
        label: "TLS 1.3 secure-channel 비교 기준",
        href: "/p2p/tls-fundamentals",
      },
      { label: "libp2p 전체 connection upgrade", href: "/p2p/libp2p" },
      { label: "TCP raw byte stream", href: "/p2p/libp2p-tcp" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "XX profile·identity payload·cipher suite·wire frame은 noise-libp2p active specification에 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Token·SymmetricState·CipherState 일반 규칙은 Noise Framework revision 34와 libp2p profile을 구분한다.",
      },
      {
        kind: "project-measurement",
        rule: "채택 전 정상·변조·truncation·oversize·timeout trace와 key/counter lifecycle을 같은 implementation version에서 검증한다.",
      },
      {
        kind: "project-claim",
        rule: "PeerId authentication을 application authorization·신뢰도·traffic-analysis 저항으로 확대하지 않는다.",
      },
    ],
  },
  "libp2p-tcp": {
    title: "libp2p TCP Transport 글이 소유하는 범위",
    owns: [
      "TCP multiaddr parsing과 lazy nonblocking dial·listener event",
      "TCP_NODELAY·backlog·TTL·per-dial port reuse의 option trade-off",
      "Address·connect·accept·timeout·cancellation·close의 socket lifecycle",
      "TCP success와 Noise·muxer·Swarm success를 나눈 upgrade trace",
      "TCP+Noise+Yamux와 QUIC의 동일 조건 release comparison",
    ],
    reuses: [
      { label: "libp2p connection upgrade pipeline", href: "/p2p/libp2p" },
      { label: "Noise identity binding", href: "/p2p/libp2p-noise" },
      { label: "QUIC transport state", href: "/p2p/quic-fundamentals" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Transport lazy future와 output semantics는 rust-libp2p current public trait에 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Socket option default와 port reuse API는 crate version·OS·runtime provider를 함께 기록한다.",
      },
      {
        kind: "project-measurement",
        rule: "Latency·throughput·NAT·backpressure 주장은 같은 network·workload에서 address·phase timing·CPU·wire bytes·memory를 측정한다.",
      },
      {
        kind: "project-claim",
        rule: "TCP 단계 수나 NODELAY 이름으로 고정 지연·성능 배수·NAT 성공을 일반화하지 않는다.",
      },
    ],
  },
  "tls-fundamentals": {
    title: "TLS 1.3 기초 글이 소유하는 범위",
    owns: [
      "TLS 1.3 handshake와 record protocol의 책임 분리",
      "CertificateVerify·Finished·transcript hash가 협상과 identity를 묶는 경계",
      "AEAD record의 방향별 traffic key·sequence number·nonce 수명",
      "HKDF key schedule의 early·handshake·master secret과 용도 분리",
      "0-RTT latency와 replay·forward-secrecy trade-off의 application 경계",
    ],
    reuses: [
      {
        label: "Bit·byte와 직렬화의 출발점",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      {
        label: "Diffie–Hellman key exchange와 unauthenticated MITM",
        href: "/crypto/diffie-hellman",
      },
      {
        label: "TLS를 transport에 결합하는 QUIC",
        href: "/p2p/quic-fundamentals",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Handshake·record·key schedule·0-RTT 속성은 RFC 8446 상태 기계와 security considerations 범위에만 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Generic HKDF의 Extract·Expand는 RFC 5869, TLS-specific label·transcript tree는 RFC 8446의 별도 책임으로 구분한다.",
      },
      {
        kind: "project-claim",
        rule: "1-RTT·0-RTT는 protocol flight 표현이며 실제 wall-clock latency, replay 안전성이나 hostname 정책의 자동 보장을 뜻하지 않는다.",
      },
    ],
  },
  "quic-fundamentals": {
    title: "QUIC transport 기초 글이 소유하는 범위",
    owns: [
      "UDP datagram 위 QUIC packet·frame·ACK·loss-recovery의 관측 가능한 경로",
      "Packet-number space와 TLS CRYPTO frame·encryption level의 결합",
      "Stream offset·stream/connection flow control과 cross-stream HOL 경계",
      "Connection ID·path validation·migration·linkability의 책임 분리",
      "TLS authentication·packet protection·transport protocol error의 실패 경계",
    ],
    reuses: [
      { label: "TLS 1.3 handshake·AEAD·HKDF", href: "/p2p/tls-fundamentals" },
      {
        label: "Bit·byte와 wire encoding",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      { label: "libp2p에서 QUIC을 쓰는 구현", href: "/p2p/libp2p-quic" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Transport·stream·migration은 RFC 9000, TLS mapping은 RFC 9001, loss와 congestion 기준은 RFC 9002에 각각 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Initial protection·Retry address validation·certificate authentication·path validation을 서로 다른 보안 주장으로 유지한다.",
      },
      {
        kind: "project-claim",
        rule: "QUIC이 TCP보다 항상 빠르거나 한 stream의 loss가 connection 전체 자원에 아무 영향도 주지 않는다고 일반화하지 않는다.",
      },
    ],
  },
  "content-addressing": {
    title: "Content addressing·CID·Merkle DAG 글이 소유하는 범위",
    owns: [
      "Location address와 content address가 답하는 질문의 차이",
      "Canonical bytes·cryptographic digest·integrity와 availability·identity의 경계",
      "CIDv1 version·content multicodec·multihash·string multibase 구조",
      "Child CID가 parent와 root로 전파되는 Merkle DAG 계산 경로",
      "IPNS·DNSLink mutable pointer의 authority·freshness·resolution 경계",
    ],
    reuses: [
      {
        label: "Bit·byte와 encoding",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      { label: "Kademlia routing과 provider discovery", href: "/p2p/kademlia" },
      { label: "Kubo의 blockstore·Bitswap·pinning 구현", href: "/p2p/kubo" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "CID binary/string format과 decoder rejection은 current IPFS CID specification, IPNS field와 verification은 IPNS specification에 귀속한다.",
      },
      {
        kind: "standard",
        rule: "Digest equality는 canonical bytes의 integrity만 말하며 availability·publisher identity·semantic safety를 자동 보장하지 않는다.",
      },
      {
        kind: "project-claim",
        rule: "Chunking·codec·metadata가 다르면 같은 사용자-visible file도 다른 DAG root가 될 수 있음을 비교 조건에 포함한다.",
      },
    ],
  },
  arima: {
    title: "ARIMA 시계열 예측 글이 소유하는 범위",
    owns: [
      "Weak stationarity와 차분 order를 forecast contract 안에서 선택하는 경계",
      "AR(p) 관측 기억과 MA(q) innovation 기억을 분리한 ARMA filter",
      "AIC·BIC 후보 비교와 residual·Ljung–Box·rolling-origin 검증의 역할 분담",
      "SARIMA·dynamic regression 확장과 future covariate availability 경계",
    ],
    reuses: [
      {
        label: "Forecast row·lag·rolling-origin 정본",
        href: "/ai/time-features",
      },
      {
        label: "확률변수·평균·분산",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "LSTM forecasting pipeline", href: "/ai/lstm-timeseries" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Dickey–Fuller·Ljung–Box·Hyndman–Khandakar 결과는 각 모형 가정·candidate space·sample 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "ACF·PACF·AIC·unit-root test는 candidate와 diagnostic이며 원하는 horizon의 out-of-sample 우위를 자동으로 보장하지 않는다.",
      },
    ],
  },
  ecod: {
    title: "ECOD 이상 탐지 글이 소유하는 범위",
    owns: [
      "Feature별 left·right empirical CDF와 negative-log tail contribution",
      "Sample skewness를 이용한 tail 방향 선택과 independence approximation의 한계",
      "ECOD 원 논문의 max-after-sum과 PyOD 3.6.4 max-before-sum 재현 경계",
      "Continuous anomaly score·contamination threshold·binary alert·evaluation의 분리",
    ],
    reuses: [
      {
        label: "확률분포·random variable·평균·분산",
        href: "/ai/math-probability-expectation-variance",
      },
      {
        label: "Ranking·threshold·calibration 경계",
        href: "/ai/imbalanced-data#overview",
      },
      { label: "EDA·reference population·split", href: "/ai/eda-workflow" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "ECOD score·복잡도·benchmark claim은 원 논문의 aggregation 식과 dataset 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "PyOD API와 score 경로는 확인한 package version을 고정하고 논문 식과 같은 것으로 이름만 보고 가정하지 않는다.",
      },
      {
        kind: "project-claim",
        rule: "Unlabeled detector의 success는 blind review·delayed label·drift slice 없이는 확정하지 않으며 score를 사건 probability로 표현하지 않는다.",
      },
    ],
  },
  "lstm-timeseries": {
    title: "LSTM 시계열 예측 글이 소유하는 범위",
    owns: [
      "Forecast origin에서 L-step input과 H-step target을 만드는 supervised window 계약",
      "Batch·entity·session에 따른 hidden·cell state reset·carry·detach lifecycle",
      "Direct multi-output과 recursive horizon 전략의 exposure·shape·latency trade-off",
      "Train-only transform·pinball loss·MASE·rolling-origin을 잇는 학습·평가 계약",
    ],
    reuses: [
      { label: "LSTM gate와 cell-state 수학", href: "/ai/lstm" },
      {
        label: "Forecast row·temporal leakage·rolling-origin",
        href: "/ai/time-features",
      },
      { label: "ARIMA 선형 기준선", href: "/ai/arima" },
      { label: "Attention 계산", href: "/ai/attention-theory" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "MASE·Tashman evaluation·DLinear·PatchTST claim은 각 metric 정의와 dataset·horizon·normalization·training 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "PyTorch tensor shape는 공식 API version에 귀속하고 state reset·feature availability·forecast cutoff는 application이 별도로 보장한다.",
      },
      {
        kind: "project-measurement",
        rule: "LSTM 채택은 같은 origin·horizon·feature·refit·hardware budget에서 naive·seasonal naive·ARIMA·단순 learned baseline과 비교한 결과에만 귀속한다.",
      },
    ],
  },
  "finite-field-theory": {
    title: "유한체 이론 글이 소유하는 범위",
    owns: [
      "Field operation contract와 prime-field modular inverse",
      "Finite-field multiplicative order·generator·subgroup",
      "Polynomial coefficient/evaluation form·root-degree bound·Schwartz–Zippel",
      "Irreducible polynomial quotient를 이용한 extension field 구성",
    ],
    reuses: [],
    evidence: [
      {
        kind: "primary-source",
        rule: "Schwartz–Zippel bound는 고정된 nonzero polynomial·degree·uniform independent challenge 조건과 함께 제시한다.",
      },
      {
        kind: "standard",
        rule: "실제 암호 parameter 주장은 확인한 표준의 algorithm·field·validation 범위로 제한한다.",
      },
    ],
  },
  lagrange: {
    title: "Lagrange 보간 글이 소유하는 범위",
    owns: [
      "Selector basis를 이용한 polynomial interpolation 구성과 유일성",
      "Evaluation domain의 vanishing polynomial과 divisibility equivalence",
      "Barycentric weight precomputation과 query-point branch",
    ],
    reuses: [
      {
        label: "Prime-field inverse·polynomial root bound",
        href: "/crypto/finite-field-theory",
      },
      {
        label: "Roots-of-unity domain의 fast interpolation",
        href: "/crypto/fft",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Interpolation은 distinct x와 explicit degree bound를 전제로 하며 arbitrary-point와 roots-of-unity algorithm을 구분한다.",
      },
      {
        kind: "primary-source",
        rule: "Barycentric 논문의 floating-point stability 결론과 finite-field algebraic reuse 범위를 분리한다.",
      },
    ],
  },
  "crypto-fft": {
    title: "유한체 NTT 글이 소유하는 범위",
    owns: [
      "Finite-field NTT matrix와 primitive-root domain·2-adicity",
      "Radix-2 even/odd butterfly와 O(n log n) recurrence",
      "Inverse root·n inverse를 이용한 INTT",
      "Padding된 linear polynomial product와 implementation 검증 계약",
    ],
    reuses: [
      {
        label: "Prime-field arithmetic와 multiplicative order",
        href: "/crypto/finite-field-theory",
      },
      {
        label: "Arbitrary-point Lagrange interpolation",
        href: "/crypto/lagrange",
      },
      { label: "Complex DFT·sampling·signal spectrum", href: "/ai/fft" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Finite-field transform과 Cooley–Tukey factorization의 전제·대수 domain을 원 논문별로 분리한다.",
      },
      {
        kind: "project-measurement",
        rule: "구현 성능은 같은 field·length·direction·batch에서 direct oracle·round trip·product correctness 뒤 kernel과 end-to-end를 함께 측정한다.",
      },
    ],
  },
} as const satisfies Record<string, EditorialBoundary>;

export type EditorialBoundaryKey = keyof typeof EDITORIAL_BOUNDARIES;

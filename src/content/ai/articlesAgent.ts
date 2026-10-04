import type { Article } from "../types";

export const agentArticles: Article[] = [
  /* ── 1. 프롬프트 기초 ── */
  {
    slug: "prompt-engineering",
    title: "프롬프트 요청 계약: 목표·근거·검증·회귀 평가",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "요청의 조건과 출력 형식 설계하기" },
      { id: "anti-patterns", title: "안티패턴 & 트러블슈팅" },
    ],
    component: () => import("@/pages/articles/ai/prompt-engineering"),
  },
  {
    slug: "prompt-reasoning",
    title: "Reasoning prompting: CoT·Self-consistency·Verifier",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Reasoning·answer·verifier 경계" },
      { id: "chain-of-thought", title: "Reasoning path와 외부 검증" },
      { id: "paper-chain-of-thought", title: "Chain-of-Thought 원 논문" },
      { id: "paper-self-consistency", title: "Self-consistency 원 논문" },
      { id: "paper-cot-faithfulness", title: "Faithfulness 경계" },
    ],
    component: () => import("@/pages/articles/ai/prompt-reasoning"),
  },
  {
    slug: "prompt-few-shot",
    title: "Few-shot prompting: Demonstration·순서·Context 비용",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Demonstration 한 개의 형태" },
      { id: "few-shot", title: "In-context demonstration의 형태" },
      { id: "paper-gpt3-few-shot", title: "GPT-3 few-shot 원 논문" },
      { id: "paper-calibrate-before-use", title: "순서·label bias 보정" },
    ],
    component: () => import("@/pages/articles/ai/prompt-few-shot"),
  },
  {
    slug: "prompt-structured-output",
    title: "Structured output: Parse·Schema·Domain·Fallback",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "문자열에서 record로" },
      { id: "structured-output", title: "Output record와 네 단계 validator" },
      { id: "output-paths", title: "Prompt·constraint·repair 경로" },
      { id: "output-measurement", title: "실패율·tail latency 측정" },
      { id: "output-release", title: "Bounded fallback과 release" },
    ],
    component: () => import("@/pages/articles/ai/prompt-structured-output"),
  },
  {
    slug: "evaluation-datasets-and-pipelines",
    title: "평가는 golden set을 채우고 offline·shadow·A/B를 통과해야 신뢰됩니다",
    subcategory: "ai-agents",
    sections: [
      { id: "problem", title: "Golden set 하나로 평가가 끝나지 않는 이유" },
      { id: "golden-set", title: "Golden dataset, evaluation example, coverage" },
      { id: "edge-case", title: "Edge case, adversarial example, OOD, distribution shift" },
      { id: "slice-analysis", title: "Slice-based evaluation, failure slice, regression test" },
      { id: "pipeline", title: "Evaluation harness와 automated pipeline, continuous evaluation" },
      { id: "deployment", title: "Offline, online, shadow, A/B, feedback loop" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-helm", title: "HELM" },
          { id: "paper-openai-evals", title: "OpenAI Evals" },
          { id: "paper-checklist", title: "CheckList" },
          { id: "paper-wilds", title: "WILDS" },
          { id: "paper-ml-test-score", title: "The ML Test Score" },
          { id: "paper-kohavi", title: "Online RCTs at Scale" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/evaluation-datasets-and-pipelines"),
  },
  {
    slug: "llm-evaluation-criteria-and-methods",
    title: "LLM 평가는 criteria·metric·비교 방식 세 층으로 나뉩니다",
    subcategory: "ai-agents",
    sections: [
      { id: "problem", title: "세 층의 질문: criteria·metric·비교 단위" },
      {
        id: "criteria-metric",
        title: "Criteria 는 잴 대상, Metric 은 숫자로 바꾸는 함수",
        subsections: [{ id: "paper-helm", title: "HELM 논문의 문제와 기여" }],
      },
      {
        id: "functional-vs-semantic",
        title: "Functional correctness 대 semantic similarity",
        subsections: [
          { id: "paper-bertscore", title: "BERTScore 논문의 문제와 기여" },
          { id: "paper-codex", title: "Codex pass@k 정의와 수치" },
        ],
      },
      {
        id: "reference-based-vs-free",
        title: "Reference-based 대 reference-free, exact match",
        subsections: [{ id: "paper-big-bench", title: "BIG-bench 논문의 문제와 기여" }],
      },
      { id: "pointwise-pairwise-ranking", title: "Pointwise·pairwise·ranking 비교와 집계" },
    ],
    component: () => import("@/pages/articles/ai/llm-evaluation-criteria-and-methods"),
  },
  {
    slug: "llm-as-a-judge",
    title: "LLM-as-a-judge 는 rubric 과 순서로 판정이 갈립니다",
    subcategory: "ai-agents",
    sections: [
      { id: "problem", title: "Human evaluation 을 대체하는 judge model" },
      {
        id: "rubric",
        title: "Evaluation rubric 의 설계와 효과",
        subsections: [{ id: "paper-geval", title: "G-Eval 논문의 문제와 기여" }],
      },
      {
        id: "position-bias",
        title: "Judge bias 와 position bias 실측치",
        subsections: [{ id: "paper-mtbench", title: "MT-Bench 논문의 문제와 기여" }],
      },
      { id: "verbosity-self-preference", title: "Verbosity bias 와 self-preference bias" },
      { id: "calibration", title: "Judge calibration: 세 조각의 조합" },
    ],
    component: () => import("@/pages/articles/ai/llm-as-a-judge"),
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
    title: "Context state 기초: 저장소에서 이번 generation까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Context와 저장소 구분" },
      { id: "context-state", title: "Select와 serialize" },
      { id: "curation", title: "Curation lifecycle" },
      { id: "boundary", title: "다음 학습 경계" },
    ],
    component: () => import("@/pages/articles/ai/context-engineering"),
  },
  {
    slug: "context-instruction-boundaries",
    title: "Context 권한 경계: Instruction · Data · Runtime",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 읽은 문장이 실행 권한으로 바뀌면 안 됩니다"
  },
  {
    "id": "black-box",
    "title": "2. 문서는 분석으로, 행동 제안은 권한 검사로 보냅니다"
  },
  {
    "id": "small-case",
    "title": "3. 이메일 한 통과 고객 정보 100건이 있습니다"
  },
  {
    "id": "inside-boundary",
    "title": "4. 모양·권한·현재 조건을 따로 묻습니다"
  },
  {
    "id": "why-boundary",
    "title": "5. 문장을 잘 따르는 능력만으로는 전송을 막지 못합니다"
  },
  {
    "id": "three-layers",
    "title": "6. 지시·외부 자료·실행 검사는 역할이 다릅니다"
  },
  {
    "id": "request-trace",
    "title": "7. 형식이 맞아도 권한이 없으면 100건은 나가지 않습니다"
  },
  {
    "id": "attack-path",
    "title": "8. 독립된 세 조건을 모두 통과해야 실행합니다"
  },
  {
    "id": "release",
    "title": "9. 재시도와 다른 실행 경로도 같은 검사를 거쳐야 합니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 어느 값이 실행을 막을까요"
  }
],
    component: () =>
      import("@/pages/articles/ai/context-instruction-boundaries"),
  },
  {
    slug: "context-provenance-freshness",
    title: "Context provenance: Source · Revision · Freshness",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Fragment receipt 정의" },
      { id: "fragment-shape", title: "Typed fragment 형태" },
      { id: "conflict", title: "Version conflict 해결" },
      { id: "release", title: "Reverse trace와 stale fixture" },
    ],
    component: () => import("@/pages/articles/ai/context-provenance-freshness"),
  },
  {
    slug: "agent-memory-lifecycle",
    title: "Agent memory lifecycle: State · Memory · Artifact",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "상태 수명 분리" },
      { id: "lifetimes", title: "Owner·source·expiry·delete" },
      { id: "compaction", title: "Compaction fidelity" },
      { id: "resume", title: "Resume test" },
      { id: "memory-action-evaluation", title: "기억 회상과 후속 행동의 성공을 따로 평가한다" },
    ],
    component: () => import("@/pages/articles/ai/agent-memory-lifecycle"),
  },
  {
    slug: "context-window-optimization",
    title: "Context window: Token budget · Position · Cache",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Capacity와 utilization 구분" },
      { id: "budget", title: "Source별 token 장부" },
      { id: "position", title: "Position evaluation" },
      { id: "cache", title: "Stable prefix cache" },
    ],
    component: () => import("@/pages/articles/ai/context-window-optimization"),
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
    slug: "agent-loop-foundations",
    title: "Agent Loop 기초: State · Action · Observation · Exit",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 답을 쓰기 전에 실제로 고쳐졌는지 알아야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 보고 고르고 실행하고 다시 봅니다"
  },
  {
    "id": "small-case",
    "title": "3. 폭 390에서 430이 되는 페이지를 고칩니다"
  },
  {
    "id": "inside-loop",
    "title": "4. 다음 판단에 무엇을 남겨야 할까요"
  },
  {
    "id": "why-runtime",
    "title": "5. 말로 고쳤다고 해도 파일은 그대로일 수 있습니다"
  },
  {
    "id": "agent-definition",
    "title": "6. 같은 순환의 역할에 이름을 붙입니다"
  },
  {
    "id": "request-trace",
    "title": "7. 읽기·수정·측정 세 번을 같은 기록으로 잇습니다"
  },
  {
    "id": "transition",
    "title": "8. 관측을 다음 선택의 입력에 넣습니다"
  },
  {
    "id": "exit-states",
    "title": "9. 끝냈다·지쳤다·기다린다는 다른 결과입니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 다음 결과를 먼저 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/agent-loop-foundations"),
  },
  {
    slug: "tool-calling-lifecycle-and-costs",
    title: "Tool calling 수명주기: 선택·인자 생성·호출 오류와 context 비용",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 답을 만들기 위해 외부에서 실제 값을 가져옵니다"
  },
  {
    "id": "black-box",
    "title": "2. 필요한 조회를 골라 실행하고 결과를 다시 읽습니다"
  },
  {
    "id": "small-case",
    "title": "3. 세 도시를 각각 400ms 동안 조회합니다"
  },
  {
    "id": "inside-tool-call",
    "title": "4. 선택된 이름과 실행 결과를 식별자로 연결합니다"
  },
  {
    "id": "why-tool-call",
    "title": "5. 맞는 모양과 맞는 대상은 다릅니다"
  },
  {
    "id": "selection-and-routing",
    "title": "6. 선택·인자·실행·반환의 이름을 붙입니다"
  },
  {
    "id": "tool-use-loop",
    "title": "7. 세 호출의 결과가 다른 순서로 돌아와도 맞게 붙입니다"
  },
  {
    "id": "argument-generation-and-invocation",
    "title": "8. 공식 반환 코드에서 호출 ID의 자리를 확인합니다"
  },
  {
    "id": "context-cost",
    "title": "9. 2,654는 입력의 부분합이며 최종 요금이 아닙니다"
  },
  {
    "id": "error-handling-and-retry",
    "title": "10. 대기 간격을 늘리기 전에 반복해도 안전한지 봅니다"
  },
  {
    "id": "sources",
    "title": "11. 형식 보장과 작업 성공은 다릅니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 부분합과 전체 결과를 구분해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/tool-calling-lifecycle-and-costs"),
  },
  {
    slug: "agent-plan-replanning",
    title: "Agent Plan: Artifact · Replanning · Reflection",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 작업 중 전제가 바뀌면 어디부터 다시 할까요"
  },
  {
    "id": "black-box",
    "title": "2. 입력이 결과로 넘어가는 연결을 보관합니다"
  },
  {
    "id": "small-case",
    "title": "3. 네 작업 중 세 작업만 새 자료에 의존합니다"
  },
  {
    "id": "inside-plan",
    "title": "4. 각 작업에는 입력·담당·결과·완료 근거가 있습니다"
  },
  {
    "id": "why-plan",
    "title": "5. 끝났다는 표시가 낡은 근거를 숨기지 않게 합니다"
  },
  {
    "id": "planning-and-plan-mode",
    "title": "6. 계획·분해·재계획의 역할을 구분합니다"
  },
  {
    "id": "executable-plan",
    "title": "7. 버전 3을 4로 바꾸며 연결된 결과만 다시 엽니다"
  },
  {
    "id": "reflection",
    "title": "8. 실패 설명을 다음 시도의 입력으로 넣습니다"
  },
  {
    "id": "plan-boundaries",
    "title": "9. 계획의 연결이 틀리면 재계획도 틀립니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 어느 작업을 다시 열어야 할까요"
  }
],
    component: () => import("@/pages/articles/ai/agent-plan-replanning"),
  },
  {
    slug: "search-based-reasoning-and-test-time-compute",
    title: "Test-time compute 는 후보 여러 개를 만들고 검증·탐색으로 고릅니다",
    subcategory: "ai-agents",
    sections: [
      { id: "problem", title: "Search-based reasoning: 후보를 만들고 검증·탐색으로 답을 고름" },
      { id: "best-of-n", title: "Best-of-N 의 기대 정답률: pass@N 과 verifier 정확도", subsections: [{ id: "paper-lets-verify-step-by-step", title: "Lightman 외 PRM 논문의 문제와 기여" }] },
      { id: "tree-search", title: "Tree search 의 평가 후보 수: branching·유지 폭·depth", subsections: [{ id: "paper-tree-of-thoughts", title: "Tree of Thoughts 논문의 문제와 기여" }] },
      {
        id: "self-correction",
        title: "Self-correction 의 경계: 외부 신호 없이는 개선이 불확실",
        subsections: [
          { id: "paper-self-refine", title: "Self-Refine 논문의 문제와 기여" },
          { id: "paper-self-correction-limits", title: "Huang 외 self-correction 한계 논문의 문제와 기여" },
        ],
      },
      { id: "boundary", title: "세 전략의 verifier 의존도와 선택 기준" },
    ],
    component: () => import("@/pages/articles/ai/search-based-reasoning-and-test-time-compute"),
  },
  {
    slug: "agent-delegation-contracts",
    title: "Agent Delegation: Artifact · Manager · Handoff",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 여러 작업자가 만든 결과를 어떻게 믿고 합칠까요"
  },
  {
    "id": "black-box",
    "title": "2. 나눠 읽고 따로 제출한 뒤 한곳에서 합칩니다"
  },
  {
    "id": "small-case",
    "title": "3. 두 문서의 3건과 2건을 합칩니다"
  },
  {
    "id": "inside-delegation",
    "title": "4. 입력·쓰기·합치기·대화의 책임을 나눕니다"
  },
  {
    "id": "why-delegation",
    "title": "5. 같은 결과를 두 번 받거나 다른 판본을 읽을 수 있습니다"
  },
  {
    "id": "delegation-contract",
    "title": "6. 일을 맡기는 요청에도 입력과 반환 조건이 있습니다"
  },
  {
    "id": "manager-handoff",
    "title": "7. 제출 식별자로 중복을 빼고 네 문제를 남깁니다"
  },
  {
    "id": "parallel-merge",
    "title": "8. 공식 위임 구조를 제출물에 적용합니다"
  },
  {
    "id": "delegation-boundaries",
    "title": "9. 병렬 실행의 비용과 상관된 오류가 남습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 도착 순서가 달라져도 결과가 같을까요"
  }
],
    component: () => import("@/pages/articles/ai/agent-delegation-contracts"),
  },
  {
    slug: "agent-extension-boundaries",
    title: "Agent 확장 경계: Hook · Skill · Guardrail · Verifier",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "네 decision owner" },
      { id: "hook", title: "Event callback 경계" },
      { id: "skill-guardrail", title: "지식과 권한 분리" },
      { id: "verifier", title: "Artifact·trajectory·effect" },
    ],
    component: () => import("@/pages/articles/ai/agent-extension-boundaries"),
  },
  {
    slug: "llm-harness",
    title: "LLM harness: model proposal과 runtime enforcement",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 답을 잘 만드는 능력과 일을 제대로 끝내는 구조를 나눕니다"
  },
  {
    "id": "black-box",
    "title": "2. 목표를 읽고 실행을 통제하며 실제 결과를 확인합니다"
  },
  {
    "id": "small-case",
    "title": "3. PING을 정확히 32번 출력합니다"
  },
  {
    "id": "inside-harness",
    "title": "4. 판단·권한·실행·결과 기록이 서로 다른 자리입니다"
  },
  {
    "id": "why-harness",
    "title": "5. 계산 성공은 입력 사실의 정확성을 보장하지 않습니다"
  },
  {
    "id": "agent-scaffold",
    "title": "6. 모델 밖에서 실행을 이어 주는 하네스입니다"
  },
  {
    "id": "proposal-runtime",
    "title": "7. 32개가 정해졌을 때만 고정된 출력 경로를 고릅니다"
  },
  {
    "id": "artifact-repair",
    "title": "8. 독립 검사에서 실패한 부분만 고칩니다"
  },
  {
    "id": "model-change",
    "title": "9. 하나의 측정으로 모델 전체를 평가하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 어디까지 고정 규칙으로 처리할 수 있을까요"
  }
],
    component: () => import("@/pages/articles/ai/llm-harness"),
  },
  {
    slug: "agent-run-contract",
    title: "Agent run contract: context·capability·artifact·recovery",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 무엇을 보면 끝났다고 할 수 있을까요"
  },
  {
    "id": "black-box",
    "title": "2. 요청을 실행 조건과 결과 확인으로 연결합니다"
  },
  {
    "id": "small-case",
    "title": "3. 두 화면에서 넘침이 없어야 끝입니다"
  },
  {
    "id": "inside-contract",
    "title": "4. 목표와 검사 대상은 같은 변경을 가리켜야 합니다"
  },
  {
    "id": "why-contract",
    "title": "5. 기록이 비면 이어받은 작업이 추측합니다"
  },
  {
    "id": "contract",
    "title": "6. 한 작업의 목표·권한·증거를 함께 기록합니다"
  },
  {
    "id": "context-capability",
    "title": "7. 같은 파일을 고치고 두 폭을 검사해 넘깁니다"
  },
  {
    "id": "artifact-continuity",
    "title": "8. 완료 문장과 실제 환경의 결과를 분리합니다"
  },
  {
    "id": "recovery-handoff",
    "title": "9. 시간 초과만으로 다시 실행하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 기록에서 빠진 항목을 찾아보세요"
  }
],
    component: () => import("@/pages/articles/ai/agent-run-contract"),
  },
  {
    slug: "agent-verification",
    title: "Agent verification: artifact·trajectory·effect gate",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 잘했다는 말과 실제 성공을 구분합니다"
  },
  {
    "id": "black-box",
    "title": "2. 결과와 실행 기록을 서로 다른 검사에 넣습니다"
  },
  {
    "id": "small-case",
    "title": "3. 27개 검사 중 1개가 실패했습니다"
  },
  {
    "id": "inside-verification",
    "title": "4. 무엇을 사실로 읽고 무엇을 평가할까요"
  },
  {
    "id": "why-verification",
    "title": "5. 같은 오류를 다시 믿지 않으려면 확인 경로가 달라야 합니다"
  },
  {
    "id": "layers",
    "title": "6. 검사 방식과 진실의 출처에 이름을 붙입니다"
  },
  {
    "id": "plan-execute-verify",
    "title": "7. 실패한 1개를 고친 뒤 같은 27개를 다시 검사합니다"
  },
  {
    "id": "trajectory-effect",
    "title": "8. 필수 실패는 다른 점수로 상쇄하지 않습니다"
  },
  {
    "id": "release",
    "title": "9. 평가도 바뀌고 틀릴 수 있습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 어떤 성공이 다른 실패를 가리지 못하나요"
  }
],
    component: () => import("@/pages/articles/ai/agent-verification"),
  },
  {
    slug: "agent-failure-modes-and-recovery",
    title: "복구는 idempotent 여부로 retry 나 escalation 으로 갈립니다",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 응답을 못 받았다고 실행이 없었던 것은 아닙니다"
  },
  {
    "id": "black-box",
    "title": "2. 감지하고 확인한 뒤 다시 할지 멈출지 고릅니다"
  },
  {
    "id": "small-case",
    "title": "3. 1만 원 청구 뒤 응답이 끊겼습니다"
  },
  {
    "id": "inside-recovery",
    "title": "4. 요청의 뜻과 실행 결과를 같이 보관합니다"
  },
  {
    "id": "why-recovery",
    "title": "5. 잘못된 목적과 불확실한 결과는 복구법이 다릅니다"
  },
  {
    "id": "failure-taxonomy",
    "title": "6. 실패의 모습과 복구 수단에 이름을 붙입니다"
  },
  {
    "id": "retry-idempotent",
    "title": "7. 같은 pay-42의 실제 결과를 확인합니다"
  },
  {
    "id": "recovery-checkpointing",
    "title": "8. 서버의 반복 요청 계약을 그대로 확인합니다"
  },
  {
    "id": "side-effect-control",
    "title": "9. 복원할 수 있는 상태와 없는 효과를 나눕니다"
  },
  {
    "id": "human-in-the-loop-escalation",
    "title": "10. 확인할 수 없는 결과는 근거와 함께 넘깁니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 재시도 전에 무엇을 알아야 할까요"
  }
],
    component: () => import("@/pages/articles/ai/agent-failure-modes-and-recovery"),
  },
  {
    slug: "harness-failure-ablation",
    title: "Harness failure ablation: 고장 난 layer 찾기",
    subcategory: "ai-agents",
    sections: [
      { id: "failure-layer", title: "Replay fixture와 failure layer" },
      { id: "classify", title: "실패 원인 분류" },
      { id: "ablation", title: "Single-change paired test" },
      { id: "paper-harness-ablation", title: "Long-running harness 근거" },
    ],
    component: () => import("@/pages/articles/ai/harness-failure-ablation"),
  },
  {
    slug: "agent-control-boundaries",
    title: "Agent control boundary: workflow·loop·checkpoint",
    subcategory: "ai-agents",
    sections: [
  {
    "id": "overview",
    "title": "1. 어디까지 스스로 고르게 할까요"
  },
  {
    "id": "black-box",
    "title": "2. 탐색한 결과를 정해진 검사에 넘깁니다"
  },
  {
    "id": "small-case",
    "title": "3. 20개 파일을 살펴보고 1곳에만 반영합니다"
  },
  {
    "id": "inside-control",
    "title": "4. 다음 경로와 허용 여부를 각각 결정합니다"
  },
  {
    "id": "why-control",
    "title": "5. 잘 찾았다는 사실이 넓은 권한을 주지는 않습니다"
  },
  {
    "id": "workflow-agent",
    "title": "6. 미리 정한 경로와 관측에 따른 선택을 구분합니다"
  },
  {
    "id": "selection",
    "title": "7. 6회 탐색과 2개 검사를 지나 대상 1개를 확인합니다"
  },
  {
    "id": "paper-loop-control",
    "title": "8. 공식 설명의 구분을 이 작업에 적용합니다"
  },
  {
    "id": "loop-authority",
    "title": "9. 한 번의 성공으로 전체 운영 규칙을 바꾸지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 경계를 바꾸면 무엇이 달라질까요"
  }
],
    component: () => import("@/pages/articles/ai/agent-control-boundaries"),
  },
  {
    slug: "llm-guardrails-and-output-validation",
    title: "Guardrail은 두는 위치와 판정 방식으로 정확도·지연을 맞바꿉니다",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Input·output·tool guardrail 위치" },
      { id: "rule-vs-model", title: "Rule-based와 model-based 판정" },
      { id: "fp-fn-tradeoff", title: "False positive·false negative 트레이드오프" },
      { id: "validation-methods", title: "Schema·semantic·action validation" },
      { id: "human-approval-gate", title: "Human approval gate" },
    ],
    component: () => import("@/pages/articles/ai/llm-guardrails-and-output-validation"),
  },
  {
    slug: "prompt-injection-poisoning-and-data-protection",
    title: "Injection은 지시 경로로, poisoning은 오염 시점으로 나뉩니다",
    subcategory: "ai-agents",
    sections: [
      { id: "injection-vectors", title: "Direct와 indirect prompt injection" },
      { id: "tool-retrieval-injection", title: "Tool injection과 retrieval poisoning" },
      { id: "data-poisoning", title: "Data poisoning: 학습 시점 오염" },
      { id: "secret-leakage", title: "Secret leakage와 credential isolation" },
      { id: "pii-detection", title: "PII detection과 data minimization" },
    ],
    component: () => import("@/pages/articles/ai/prompt-injection-poisoning-and-data-protection"),
  },
  {
    slug: "agent-code-mode",
    title: "Code Mode: Tool 왕복을 Program으로 접는 실행 패턴",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Tool 왕복과 Program IR" },
      { id: "tool-discovery", title: "선택적 Schema Loading" },
      { id: "data-reduction", title: "Local Data와 Token 경계" },
      { id: "decision", title: "실행 방식 선택" },
    ],
    component: () => import("@/pages/articles/ai/agent-code-mode"),
  },
  {
    slug: "code-mode-runtime-contracts",
    title: "Code Mode Runtime: Capability·Result·Effect 계약",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Deterministic Control Flow" },
      { id: "capability", title: "Capability Binding" },
      { id: "result-contract", title: "Result Disclosure" },
      { id: "effects", title: "Partial Effect와 Retry" },
    ],
    component: () => import("@/pages/articles/ai/code-mode-runtime-contracts"),
  },
  {
    slug: "agent-sandbox-security",
    title: "Container 보안 기초: Process · Namespace · Cgroup · Attack Path",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Container보다 먼저 Process" },
      { id: "namespace", title: "보이는 자원: Namespace" },
      { id: "cgroup", title: "쓸 수 있는 양: Cgroup" },
      { id: "attack-path", title: "Signal에서 Impact까지" },
      { id: "container-root", title: "Container Root 경계" },
    ],
    component: () => import("@/pages/articles/ai/agent-sandbox-security"),
  },
  {
    slug: "sandbox-runtime-isolation",
    title: "Sandbox Runtime 격리: Syscall · Seccomp · gVisor · Kata",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "System Call 처리 경로" },
      { id: "seccomp", title: "Seccomp는 Filter" },
      { id: "application-kernel", title: "gVisor Application Kernel" },
      { id: "guest-kernel", title: "Kata Guest Kernel" },
      { id: "runtime-spectrum", title: "Runtime Acceptance Gate" },
    ],
    component: () => import("@/pages/articles/ai/sandbox-runtime-isolation"),
  },
  {
    slug: "sandbox-gpu-isolation",
    title: "GPU Sandbox 격리: Ioctl Proxy · VFIO · IOMMU",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "GPU Device 경계" },
      { id: "ioctl-proxy", title: "nvproxy Ioctl 중개" },
      { id: "vfio", title: "VFIO Device 할당" },
      { id: "compatibility", title: "Support Generation과 Release" },
    ],
    component: () => import("@/pages/articles/ai/sandbox-gpu-isolation"),
  },
  {
    slug: "sandbox-deployment-controls",
    title: "Sandbox 배포 통제: Identity · Egress · Storage · Release",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "서로 대신하지 않는 네 Gate" },
      { id: "service-account-token", title: "ServiceAccount와 Token" },
      { id: "rbac", title: "RBAC Authorization" },
      { id: "egress", title: "Egress Allowlist" },
      { id: "writable-surface", title: "Writable Surface 수명" },
      { id: "control-matrix", title: "Workload Control Matrix" },
    ],
    component: () => import("@/pages/articles/ai/sandbox-deployment-controls"),
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
    title: "Claude Code 기초: Model과 Workspace Harness",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Model과 Harness 경계" },
      { id: "agent-loop", title: "Gather · Act · Verify" },
      { id: "tool-effect", title: "Tool과 Effect 분류" },
      { id: "paper-how-claude-code-works", title: "공식 동작 범위" },
    ],
    component: () => import("@/pages/articles/ai/claude-code"),
  },
  {
    slug: "claude-code-instructions-memory",
    title: "Claude Code Context: CLAUDE.md · Rules · Auto Memory",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Instruction과 Memory" },
      { id: "load-order", title: "Scope와 Load Order" },
      { id: "memory-compaction", title: "Memory · Compaction 경계" },
      { id: "paper-claude-memory", title: "공식 Context 계약" },
    ],
    component: () =>
      import("@/pages/articles/ai/claude-code-instructions-memory"),
  },
  {
    slug: "claude-code-subagents",
    title: "Claude Code Subagents: Context · Handoff · Verification",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "별도 Context" },
      { id: "handoff-contract", title: "Typed Handoff" },
      { id: "merge-boundary", title: "Parallel Merge 경계" },
      { id: "paper-claude-subagents", title: "공식 Subagent 계약" },
    ],
    component: () => import("@/pages/articles/ai/claude-code-subagents"),
  },
  {
    slug: "claude-code-permissions",
    title: "Claude Code Permissions: Deny · Ask · Allow",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Registry와 Permission" },
      { id: "precedence", title: "Deny → Ask → Allow" },
      { id: "sandbox-boundary", title: "Sandbox와의 경계" },
      { id: "paper-claude-permissions", title: "공식 Permission 계약" },
    ],
    component: () => import("@/pages/articles/ai/claude-code-permissions"),
  },
  {
    slug: "claude-code-hooks",
    title: "Claude Code Hooks: Event · Matcher · Handler",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Hook Event 계약" },
      { id: "resolution", title: "Matcher · If · Handler" },
      { id: "security", title: "Hook Code 신뢰 경계" },
      { id: "paper-claude-hooks", title: "공식 Hook 계약" },
    ],
    component: () => import("@/pages/articles/ai/claude-code-hooks"),
  },
  {
    slug: "claude-code-checkpointing",
    title: "Claude Code Checkpoints: File Snapshot과 Effect 경계",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "File Snapshot" },
      { id: "coverage", title: "Recoverable Set" },
      { id: "recovery-plan", title: "Effect별 Rollback" },
      { id: "paper-claude-checkpointing", title: "공식 복구 범위" },
    ],
    component: () => import("@/pages/articles/ai/claude-code-checkpointing"),
  },
  {
    slug: "qwen-korean-consistency",
    title: "Qwen 한국어 일관성: 현상 진단에서 배포 개입 선택까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "언어 혼용을 먼저 진단하기" },
      { id: "prompt-level", title: "Prompt policy의 역할과 한계" },
      {
        id: "smoothie-qwen",
        title: "출력층 개입 선택과 독립 글 연결",
      },
      { id: "rl-approach", title: "학습 개입 선택과 독립 글 연결" },
      { id: "runtime-guard", title: "Checker·Judge·Bounded retry" },
      { id: "decision-matrix", title: "Paired evaluation과 배포 결정" },
    ],
    component: () => import("@/pages/articles/ai/qwen-korean-consistency"),
  },
  {
    slug: "smoothie-qwen-weight-editing",
    title: "Smoothie-Qwen: Token Risk에서 lm_head Weight Editing까지",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Post-hoc weight 편집 경계" },
      { id: "smoothie-qwen", title: "Risk·scale·logit·paired evaluation" },
    ],
    component: () => import("@/pages/articles/ai/smoothie-qwen-weight-editing"),
  },
  {
    slug: "qwen-korean-reasoning-posttraining",
    title: "Qwen 한국어 Reasoning Post-Training: SFT·Dr.GRPO·Oracle Reward",
    subcategory: "ai-agents",
    sections: [
      { id: "overview", title: "Policy update와 평가 경계" },
      { id: "rl-approach", title: "SFT·Dr.GRPO·oracle-guided reward" },
    ],
    component: () => import("@/pages/articles/ai/qwen-korean-reasoning-posttraining"),
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

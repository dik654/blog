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
  "llm-training-stages": {
    title: "LLM 학습 단계 글이 소유하는 범위",
    owns: [
      "Pretraining·continued/mid-training·post-training·serving/agent harness의 objective와 update-authority 경계",
      "PTQ의 Post-Training과 LLM post-training, LoRA라는 update mechanism의 용어 분리",
      "Agent trajectory 학습 loop와 soft limit·hard limit을 판정하는 evidence boundary",
    ],
    reuses: [
      {
        label: "Continued pretraining의 data·objective 경계",
        href: "/ai/continued-pretraining",
      },
      {
        label: "SFT의 demonstration likelihood",
        href: "/ai/supervised-fine-tuning",
      },
      {
        label: "RLVR·GRPO 실험 pipeline",
        href: "/ai/open-r1",
      },
      {
        label: "On-policy distillation의 일반 정의",
        href: "/ai/on-policy-distillation",
      },
      {
        label: "Agent observation·action runtime loop",
        href: "/ai/agent-loop-foundations",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "각 training stage는 원 논문·공식 model report의 objective와 data-generation 절차로 확인하고, 연구 관심의 이동을 pretraining·architecture의 중요성 소멸로 표현하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Agentic training 개선은 동일 base model·tool environment·budget에서 task success·rollout cost·failure recovery를 함께 비교한 결과에만 귀속한다.",
      },
    ],
  },
  "motif-3-architecture": {
    title: "Motif 3 구조 글이 소유하는 범위",
    owns: [
      "Motif 3 technical report v1의 exact 314B total·13.2B active configuration과 base/instruction checkpoint 경계",
      "MLA compression과 Grouped Differential Attention이 만나는 GDLA, modified mHC, Expert-Specific PolyNorm의 Motif-specific composition",
      "Motif 3 chosen-token scalar MOPD와 ICE-POP filter 및 full-vocab OPD와의 차이",
    ],
    reuses: [
      {
        label: "MoE total·active parameter와 routing 장부",
        href: "/ai/mixture-of-experts",
      },
      {
        label: "MTP를 이용한 speculative decoding lifecycle",
        href: "/ai/vllm-spec-decode",
      },
      {
        label: "일반 GKD·MOPD와 teacher signal",
        href: "/ai/on-policy-distillation",
      },
      {
        label: "Residual·normalization의 기본 경계",
        href: "/ai/transformer-architecture#transformer-block",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "구조명·layer/head/expert/context 수치는 Motif 3 technical report의 exact version과 official model card에 귀속하고 MDLA 같은 비공식 명칭으로 바꾸지 않는다.",
      },
      {
        kind: "project-claim",
        rule: "GDLA·mHC·PolyNorm ablation은 보고서가 명시한 약 10B controlled models의 결과로만 표현하며 314B full-model 전체의 causal attribution으로 확대하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Serving·training 비용은 exact checkpoint·MTP head 포함 여부·runtime·GPU topology가 고정된 측정 없이 공개 architecture 수치에서 추정하지 않는다.",
      },
    ],
  },
  "spiking-neural-networks": {
    title: "Spiking Neural Network 글이 소유하는 범위",
    owns: [
      "LIF membrane dynamics·hard spike threshold·surrogate derivative의 forward/backward 분리",
      "시간축 SNN unroll과 BPTT, Hebbian local plasticity, standard backprop의 category boundary",
      "SNN algorithm과 digital·analog·mixed-signal hardware 및 PVT·energy claim의 evidence boundary",
    ],
    reuses: [
      {
        label: "Backprop은 gradient 계산, optimizer는 update라는 경계",
        href: "/ai/backprop-optimization",
      },
      {
        label: "Recurrent graph를 시간축으로 펼치는 BPTT",
        href: "/ai/bptt",
      },
      {
        label: "Step function과 differentiability",
        href: "/ai/activation-functions",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Surrogate-gradient와 neuromorphic hardware 설명은 original paper·official chip document에 귀속하고 SNN을 인간 뇌의 완전한 model로 표현하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "저전력 배수는 chip·process node·task·accuracy·latency·batch·encoding overhead가 같은 비교에만 귀속하며 1000배·10000배를 일반 사실로 쓰지 않는다.",
      },
    ],
  },
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
        href: "/gpu/rdma-roce#gpudirect-topology",
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
        label: "Variance·standard deviation",
        href: "/ai/math-variance-sampling",
      },
      { label: "지수함수", href: "/ai/math-exponents-logarithms" },
      {
        label: "Diffusion·score·flow의 적용",
        href: "/ai/diffusion-continuous-time",
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
  "agent-loop-foundations": {
    title: "Agent loop 기초 글이 소유하는 범위",
    owns: [
      "Model proposal·runtime authorization·tool execution·observation·exit로 이어지는 agent run state",
      "ReAct observation loop와 typed tool result·terminal state의 control-flow 경계",
    ],
    reuses: [
      { label: "하네스 실행 계약과 개선 loop", href: "/ai/llm-harness" },
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
  "agent-plan-replanning": {
    title: "Agent plan·replanning 글이 소유하는 범위",
    owns: ["Executable task dependency·artifact receipt·plan transition", "Evidence-driven invalidation과 feedback-grounded reflection"],
    reuses: [{ label: "Agent state·observation·exit", href: "/ai/agent-loop-foundations" }, { label: "Durable checkpoint runtime", href: "/ai/agent-frameworks" }],
    evidence: [{ kind: "primary-source", rule: "Reflexion claim은 논문의 feedback source·task·evaluation 조건으로 제한한다." }],
  },
  "agent-delegation-contracts": {
    title: "Agent delegation 글이 소유하는 범위",
    owns: ["Delegate input·capability·artifact·verification contract", "Manager·handoff user-facing state ownership과 parallel merge 조건"],
    reuses: [{ label: "Multi-agent runtime 구현", href: "/ai/multi-agent-implementation" }, { label: "Agent plan artifact", href: "/ai/agent-plan-replanning" }],
    evidence: [{ kind: "standard", rule: "Multi-agent 이득은 동일 model·tool·budget과 독립 task·merge 조건에서 평가한다." }],
  },
  "agent-extension-boundaries": {
    title: "Agent extension authority 글이 소유하는 범위",
    owns: ["Hook·Skill·Guardrail·Verifier의 실행 시점·지식·policy·acceptance decision owner"],
    reuses: [{ label: "Skill authoring format", href: "/ai/skills-anatomy" }, { label: "하네스 검증 stack", href: "/ai/llm-harness" }],
    evidence: [{ kind: "standard", rule: "Hook·Skill은 runtime capability를 넓히지 않고 policy pass와 artifact acceptance를 분리한다." }],
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
        href: "/ai/agent-loop-foundations#exit-states",
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
    title: "Claude Code workspace harness 글이 소유하는 범위",
    owns: [
      "Claude model의 proposal과 Claude Code runtime의 context·authorization·tool execution·observation 경계",
      "Read-only observation·workspace mutation·process·network effect를 나누는 첫 분류",
      "Gather context→act→verify loop에서 완료 claim과 독립 verifier receipt를 분리하는 방법",
    ],
    reuses: [
      { label: "일반 LLM harness boundary", href: "/ai/llm-harness" },
      { label: "Instruction과 auto memory", href: "/ai/claude-code-instructions-memory" },
      { label: "Permission 판정", href: "/ai/claude-code-permissions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "제품 loop와 tool 역할은 확인 시점의 code.claude.com 공식 문서에만 귀속한다." },
      { kind: "standard", rule: "Model proposal·runtime execution·typed observation·verifier를 서로 다른 owner로 표현한다." },
      { kind: "project-measurement", rule: "완료는 실제 diff·test·effect receipt로 확인한다." },
      { kind: "project-claim", rule: "Claude Code 사용이 생성 코드의 정확성이나 외부 effect 복구를 보장한다고 주장하지 않는다." },
    ],
  },
  "claude-code-instructions-memory": {
    title: "Claude Code instruction·memory 글이 소유하는 범위",
    owns: [
      "Managed·user·project·path-specific CLAUDE.md의 owner·scope·발견 시점",
      "Auto memory와 user-authored instruction의 소유권·load boundary",
      "Compaction 뒤 지속 규칙을 보존하고 실제 loaded context를 감사하는 방법",
    ],
    reuses: [
      { label: "Workspace harness", href: "/ai/claude-code" },
      { label: "Context engineering", href: "/ai/context-engineering" },
      { label: "Permission enforcement", href: "/ai/claude-code-permissions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Instruction scope·nested loading·auto memory 한계는 현재 공식 memory 문서와 client version으로 제한한다." },
      { kind: "standard", rule: "Instruction context와 runtime enforcement를 구분한다." },
      { kind: "project-measurement", rule: "실제 loaded source·revision·path를 inspection trace로 확인한다." },
      { kind: "project-claim", rule: "Auto memory를 검토된 project 정본이나 보안 정책 저장소로 표현하지 않는다." },
    ],
  },
  "claude-code-subagents": {
    title: "Claude Code subagent handoff 글이 소유하는 범위",
    owns: [
      "Main과 subagent의 별도 context·objective·input snapshot 경계",
      "Tool·resource·mutation scope와 반환 artifact owner",
      "Summary를 원자료·command receipt로 재검증하는 main verifier 책임",
    ],
    reuses: [
      { label: "Agent run contract", href: "/ai/agent-run-contract" },
      { label: "Workspace harness", href: "/ai/claude-code" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Subagent context·tool·permission·return behavior는 현재 공식 문서에만 귀속한다." },
      { kind: "standard", rule: "병렬화는 independent input·artifact와 single merge owner가 있을 때만 권한다." },
      { kind: "project-measurement", rule: "반환 summary는 실제 source·line·command receipt로 다시 확인한다." },
      { kind: "project-claim", rule: "Subagent 수 증가가 품질 향상이나 안전한 병렬 merge를 자동 보장한다고 주장하지 않는다." },
    ],
  },
  "claude-code-permissions": {
    title: "Claude Code permission 판정 글이 소유하는 범위",
    owns: [
      "Tool registry와 concrete call authorization의 차이",
      "Deny→ask→allow rule category의 current decision order",
      "Permission·blocking hook·OS sandbox·credential·network policy의 서로 다른 enforcement owner",
    ],
    reuses: [
      { label: "Workspace harness", href: "/ai/claude-code" },
      { label: "Hook event contract", href: "/ai/claude-code-hooks" },
      { label: "Sandbox security", href: "/ai/agent-sandbox-security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Rule syntax·precedence·permission mode는 현재 공식 permissions 문서와 resolved settings에 귀속한다." },
      { kind: "standard", rule: "Call identity·arguments·target과 fresh approval를 함께 binding한다." },
      { kind: "project-measurement", rule: "Overlap·Bash 우회·stale approval를 failure fixture로 확인한다." },
      { kind: "project-claim", rule: "Permission이 OS·container·network 격리를 대체한다고 표현하지 않는다." },
    ],
  },
  "claude-code-hooks": {
    title: "Claude Code hook lifecycle 글이 소유하는 범위",
    owns: [
      "Lifecycle event·matcher·optional argument filter의 resolution",
      "Handler type·versioned JSON input/output·exit status·timeout·audit log",
      "Hook code owner·secret scope·fail-open/fail-closed security boundary",
    ],
    reuses: [
      { label: "Permission 판정", href: "/ai/claude-code-permissions" },
      { label: "일반 hook·skill·verifier 구분", href: "/ai/agent-loop-foundations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Event·matcher·handler surface는 현재 공식 hooks reference와 installed version에 귀속한다." },
      { kind: "standard", rule: "Exit success와 permission allow를 구분하고 빈 output을 no-decision으로 다룬다." },
      { kind: "project-measurement", rule: "Matcher bypass·timeout·failure policy를 canary event로 재현한다." },
      { kind: "project-claim", rule: "Hook가 본질적으로 신뢰되거나 모든 file·effect 경로를 관찰한다고 주장하지 않는다." },
    ],
  },
  "claude-code-checkpointing": {
    title: "Claude Code checkpoint 복구 글이 소유하는 범위",
    owns: [
      "Conversation checkpoint와 direct file-edit snapshot의 복구 대상",
      "Bash·subagent·external editor·symlink/hardlink의 추적 경계",
      "Database·API·deploy effect의 operation receipt·compensation·rollback owner",
    ],
    reuses: [
      { label: "Artifact continuity", href: "/ai/agent-run-contract" },
      { label: "Workspace harness", href: "/ai/claude-code" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Checkpoint 포함·제외 범위는 현재 공식 checkpoint 문서와 같은 session에서 확인한다." },
      { kind: "standard", rule: "File snapshot과 Git·backup·transaction·distributed rollback을 구분한다." },
      { kind: "project-measurement", rule: "Direct edit·Bash·link·remote effect를 작은 recovery drill로 확인한다." },
      { kind: "project-claim", rule: "Checkpoint가 external effect나 exactly-once semantics를 제공한다고 표현하지 않는다." },
    ],
  },
  "qwen-korean-consistency": {
    title: "Qwen 한국어 일관성 글이 소유하는 범위",
    owns: [
      "Qwen의 한국어 reasoning/final language mismatch와 정상 번역·원문·고유명사 예외를 나누는 적용 진단",
      "한국어 기본 출력과 code·수식·인용·사용자 지정 번역 예외를 함께 둔 Qwen prompt policy",
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
        href: "/ai/softmax#overview",
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
        href: "/ai/agent-verification#overview",
      },
      { label: "Smoothie-Qwen output-weight 편집", href: "/ai/smoothie-qwen-weight-editing" },
      { label: "Qwen Korean reasoning SFT·RL", href: "/ai/qwen-korean-reasoning-posttraining" },
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
  "smoothie-qwen-weight-editing": {
    title: "Smoothie-Qwen weight-editing 글이 소유하는 범위",
    owns: ["Unicode·broken-token n-gram risk procedure", "Logarithmic lm_head row scaling·softmax coupling·artifact release"],
    reuses: [{ label: "Qwen language failure taxonomy", href: "/ai/qwen-korean-consistency#overview" }, { label: "Tokenizer contract", href: "/ai/tokenizer" }, { label: "Softmax", href: "/ai/softmax#overview" }],
    evidence: [{ kind: "primary-source", rule: "Algorithm·수치는 Smoothie-Qwen 논문과 공개 구현의 checkpoint·tokenizer·Unicode·evaluation 범위로 제한한다." }, { kind: "project-measurement", rule: "원본/변환본을 같은 prompt에서 suppression·정상 번역·task quality로 paired 비교한다." }, { kind: "project-claim", rule: "Risk를 language oracle이나 row scale을 probability 직접 배율로 표현하지 않는다." }],
  },
  "qwen-korean-reasoning-posttraining": {
    title: "Qwen Korean reasoning post-training 글이 소유하는 범위",
    owns: ["Korean reasoning SFT와 current-policy group RL의 stage 경계", "Accuracy·format·language·length reward와 frozen oracle correction receipt"],
    reuses: [{ label: "Qwen language failure taxonomy", href: "/ai/qwen-korean-consistency#overview" }, { label: "SFT", href: "/ai/supervised-fine-tuning" }, { label: "GRPO·Dr.GRPO", href: "/ai/open-r1" }],
    evidence: [{ kind: "primary-source", rule: "학습 recipe와 benchmark는 Making Qwen3 Think in Korean 논문의 model·data·reward·compute 조건에 한정한다." }, { kind: "project-measurement", rule: "Base→SFT→RL checkpoint를 같은 independent slices에서 stage ablation한다." }, { kind: "project-claim", rule: "Oracle을 ground truth로, 한국어 출력 reasoning을 내부 인과 추론의 증명으로 표현하지 않는다." }],
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
        href: "/ai/agent-loop-foundations#exit-states",
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
    title: "개발 기록 라우팅 글이 소유하는 범위",
    owns: [
      "Raw evidence와 원인·완료 claim을 분리하는 경계",
      "관찰·변화·결정·현재 규칙 질문마다 정본 하나를 고르는 routing",
      "Artifact에서 Changelog·ADR·Lesson으로 조건부 승격하는 write path",
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
        rule: "Provenance 관계는 W3C PROV의 entity·activity·agent 범위에만 귀속하고 이 글의 문서 routing은 project pattern으로 구분한다.",
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
  "agent-changelog-evidence": {
    title: "Changelog evidence 글이 소유하는 범위",
    owns: ["Curated Changelog entry의 필드", "Audience와 observable impact로 notable change를 고르는 경계", "Verified·merged·deployed publication 상태", "Entry에서 run·commit·test·ADR로 돌아가는 stable evidence link"],
    reuses: [{ label: "Raw evidence와 claim 경계", href: "/ai/agent-devlog-patterns#overview" }],
    evidence: [
      { kind: "primary-source", rule: "Changelog 목적·Unreleased·category는 Keep a Changelog 1.1.0의 공개 범위에만 귀속한다." },
      { kind: "project-claim", rule: "내부 agent project의 notable 기준과 run-1842 사례는 설명 fixture이며 보편 release 표준이 아니다." },
    ],
  },
  "architecture-decision-records": {
    title: "Architecture Decision Record 글이 소유하는 범위",
    owns: ["ADR 한 건의 context·options·decision·consequences", "같은 decision driver로 option을 비교하는 계약", "Accepted와 implementation·deployment 상태의 분리", "과거 ADR을 보존하는 supersession history"],
    reuses: [{ label: "질문별 정본 routing", href: "/ai/agent-devlog-patterns#question-owner" }],
    evidence: [
      { kind: "primary-source", rule: "ADR의 원형 template과 status history는 Michael Nygard의 공개 글 범위에만 귀속한다." },
      { kind: "project-claim", rule: "Profile storage A/B/C 선택은 고정 학습 fixture이며 모든 project의 최적 decision이 아니다." },
    ],
  },
  "engineering-lessons-ledger": {
    title: "Engineering Lessons 글이 소유하는 범위",
    owns: ["현재 재사용할 rule의 정본", "Scope·exception·test triad", "좁은 provisional lesson의 evidence threshold", "Postmortem incident와 Lesson current rule의 소유권 경계"],
    reuses: [{ label: "조건부 기록 승격", href: "/ai/agent-devlog-patterns#promotion" }],
    evidence: [
      { kind: "primary-source", rule: "Blameless incident analysis와 measurable action은 Google SRE Workbook의 공개 범위에만 귀속한다." },
      { kind: "project-claim", rule: "Derived empty state guardrail은 학습 fixture이며 모든 output·storage에 적용하는 보편 rule이 아니다." },
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
        href: "/ai/agent-loop-foundations",
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
        href: "/ai/agent-run-contract#overview",
      },
      {
        label: "Typed tool observation과 turn exit state",
        href: "/ai/agent-loop-foundations#observation-contract",
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
        href: "/ai/agent-memory-lifecycle#compaction",
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
        href: "/ai/agent-run-contract#overview",
      },
      {
        label: "Typed tool observation과 exit state",
        href: "/ai/agent-loop-foundations#observation-contract",
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
  "claw-api-client": {
    title: "Claw Code provider API·stream·cache 글이 소유하는 범위",
    owns: [
      "Pinned ProviderClient·MessageRequest·StreamEvent와 provider adapter의 실제 semantic 변환 범위",
      "Pinned SSE frame assembly와 Anthropic block lifecycle의 current behavior·buffer/unknown-event/EOF gap",
      "OpenAI-compatible provider·model별 capability matrix와 unsupported downgrade release contract",
      "Pinned local completion response cache와 provider prompt-prefix cache의 비용·정합성·side-effect 경계",
    ],
    reuses: [
      { label: "Claw 전체 crate·runtime architecture snapshot", href: "/ai/claw-overview" },
      { label: "Session turn·tool result persistence", href: "/ai/claw-session" },
      { label: "Tool identity·schema·dispatch", href: "/ai/claw-tool-system" },
    ],
    evidence: [
      { kind: "primary-source", rule: "API type·parser·adapter·local cache 주장은 ultraworkers/claw-code commit b71afddae100ced324457337925a694686b8fef2 source와 같은 commit test에만 귀속한다." },
      { kind: "standard", rule: "Anthropic streaming·prompt caching 공식 문서는 provider wire/cache semantics만 뒷받침하며 pinned client correctness를 인증하지 않는다." },
      { kind: "project-claim", rule: "Unknown event tolerance·bounded frame·all-compatible parity·side-effect-safe response replay는 확인된 구현이 아니라 hardening gap으로 표시한다." },
    ],
  },
  "claw-cli": {
    title: "Claw Code CLI command·render·init 글이 소유하는 범위",
    owns: [
      "Pinned REPL·one-shot input에서 local command 또는 runtime·renderer로 이어지는 dispatch 경계",
      "Pinned SlashCommandSpec registry와 handler별 split parser의 실제 grammar 한계",
      "Pinned Markdown StreamRenderBuffer와 normalized event reducer hardening의 구분",
      "Pinned repository init create-if-missing·gitignore idempotency와 transactional init gap",
    ],
    reuses: [
      { label: "Provider common event와 streaming parser", href: "/ai/claw-api-client" },
      { label: "Session persistence·resume", href: "/ai/claw-session" },
      { label: "File mutation·workspace boundary", href: "/ai/claw-file-ops" },
    ],
    evidence: [
      { kind: "primary-source", rule: "CLI entry·command registry·renderer·init 주장은 pinned b71afdd source와 unit test에만 귀속한다." },
      { kind: "project-claim", rule: "일반 quote grammar·network exactly-once·Unicode 전체·inspect-plan-atomic-apply는 현재 구현이 아니라 별도 hardening contract다." },
      { kind: "project-measurement", rule: "Release는 같은 input event log와 repository fixture에서 TTY/JSONL parity·duplicate/gap·concurrent/crash init을 base/candidate로 비교한다." },
    ],
  },
  "claw-config": {
    title: "Claw Code config·bootstrap·OAuth·remote 글이 소유하는 범위",
    owns: [
      "Pinned USER·PROJECT·LOCAL deep merge와 field winner·shadowed provenance",
      "Pinned BootstrapPlan order·dedupe와 trust/readiness/cleanup 미구현 범위",
      "Pinned OAuth PKCE·state·request·callback parsing·credentials JSON persistence helper 경계",
      "Pinned remote proxy environment·token·CA·URL 조립과 authenticated session protocol gap",
    ],
    reuses: [
      { label: "Claw 전체 runtime owner와 pinned snapshot", href: "/ai/claw-overview" },
      { label: "Permission·approval policy owner", href: "/ai/claw-permissions" },
      { label: "Remote event reducer·resume state", href: "/ai/claw-cli#rendering" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Config·bootstrap·OAuth·remote behavior는 pinned commit의 각 runtime source와 test에만 귀속한다." },
      { kind: "standard", rule: "RFC 7636·8252는 PKCE와 native app profile을 설명하지만 Claw listener·storage implementation의 인증 근거가 아니다." },
      { kind: "project-claim", rule: "OS keychain·state single-use listener·readiness cleanup·ack/replay permission protocol은 구현 사실이 아니라 명시적 gap이다." },
    ],
  },
  "claw-file-ops": {
    title: "Claw Code file read·mutation·search·boundary 글이 소유하는 범위",
    owns: [
      "Pinned 10 MB·NUL guard·line range read와 byte snapshot 한계",
      "Pinned direct write·first/all edit와 expected digest·unique count·atomic replacement gap",
      "Pinned glob ignore·modified-time 100 cap과 regex grep limit·offset semantics",
      "Pinned canonical Path containment wrapper와 missing target·TOCTOU·handle-bound open gap",
    ],
    reuses: [
      { label: "Bash path·effect TOCTOU owner", href: "/ai/claw-bash#validation-pipeline" },
      { label: "Permission decision·executor enforcement", href: "/ai/claw-permissions" },
      { label: "Run artifact·digest provenance", href: "/ai/experiment-tracking#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Read·write·edit·glob·grep·boundary 주장은 pinned file_ops.rs와 same-commit tests에만 귀속한다." },
      { kind: "standard", rule: "openat2와 CWE-367은 Linux resolution·TOCTOU 일반 근거이며 Claw hardening 완료나 portable solution의 증거가 아니다." },
      { kind: "project-claim", rule: "Expected digest·atomic rename·stable snapshot cursor·handle-bound open은 현재 구현이 아니라 검증할 hardening gap이다." },
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
        href: "/ai/agent-run-contract#overview",
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
        href: "/ai/agent-memory-lifecycle#compaction",
      },
      {
        label: "Output reserve를 포함한 context token budget",
        href: "/ai/context-window-optimization#budget",
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
        href: "/ai/agent-verification#overview",
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
    title: "Word2Vec 입력·pair 생성 글이 소유하는 범위",
    owns: [
      "Vocabulary ID가 input·output embedding table의 역할별 row를 고르는 절차",
      "Dynamic window와 versioned receipt가 local word–context pair를 만드는 경계",
    ],
    reuses: [
      { label: "Tokenizer와 vocabulary 계약", href: "/ai/tokenizer" },
      {
        label: "분산 가정·PMI·shifted-PMI·cosine",
        href: "/ai/distributional-semantics",
      },
      { label: "CBOW·Skip-gram·hierarchical softmax", href: "/ai/word2vec-prediction-objectives" },
      { label: "SGNS와 sampling", href: "/ai/word2vec-negative-sampling" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Word ID·dual table·window claim은 원 논문의 corpus·architecture·sampling 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Corpus·vocabulary·sentence boundary·window draw·frequency filter·seed를 pair receipt로 기록한다.",
      },
    ],
  },
  "word2vec-prediction-objectives": {
    title: "Word2Vec prediction objectives 글이 소유하는 범위",
    owns: ["같은 window를 CBOW·Skip-gram examples로 바꾸고 hierarchical tree path로 target probability를 구성하는 계산"],
    reuses: [
      { label: "Word ID·dual table·pair receipt", href: "/ai/word2vec" },
      { label: "Softmax activation", href: "/ai/activation-functions" },
    ],
    evidence: [{ kind: "primary-source", rule: "Objective 비교는 원 Word2Vec 논문의 corpus·tree·evaluation 조건으로 제한한다." }],
  },
  "word2vec-negative-sampling": {
    title: "Word2Vec negative sampling 글이 소유하는 범위",
    owns: ["Positive·noise pair의 SGNS logistic objective, noise distribution과 frequent-token subsampling의 서로 다른 적용 경계"],
    reuses: [
      { label: "Word–context pair receipt", href: "/ai/word2vec" },
      { label: "Shifted-PMI 해석", href: "/ai/distributional-semantics" },
    ],
    evidence: [{ kind: "primary-source", rule: "3/4 noise·subsampling·k claim은 원 논문의 recipe와 평가 범위로 제한한다." }],
  },
  "subword-static-embeddings": {
    title: "Subword static embeddings 글이 소유하는 범위",
    owns: ["Character n-gram hash rows로 OOV vector를 합성하고 문자열-to-vector artifact를 호환 가능하게 release하는 계약"],
    reuses: [
      { label: "Word lookup foundation", href: "/ai/word2vec" },
      { label: "Static과 contextual representation", href: "/ai/distributional-semantics" },
    ],
    evidence: [{ kind: "primary-source", rule: "Subword composition과 OOV claim은 fastText 논문의 n-gram·hash·language setting으로 제한한다." }],
  },
  bert: {
    title: "BERT encoder visibility 글이 소유하는 범위",
    owns: ["Query가 양쪽 실제 token을 읽고 PAD key를 닫아 contextual state를 만드는 visibility 계약"],
    reuses: [{ label: "Q·K·V와 attention score", href: "/ai/attention-theory" }],
    evidence: [{ kind: "primary-source", rule: "BERT encoder claim은 원 논문의 입력·architecture 범위에서 해석한다." }],
  },
  "bert-input-packing": {
    title: "BERT input packing 글이 소유하는 범위",
    owns: ["CLS·SEP·PAD와 token·position·segment·attention-mask tensor의 slot 정렬 계약"],
    reuses: [{ label: "Tokenizer vocabulary와 checkpoint 호환성", href: "/ai/tokenizer" }],
    evidence: [{ kind: "standard", rule: "Tensor shape와 optional input은 선택한 library·checkpoint version으로 확인한다." }],
  },
  "bert-mlm-corruption": {
    title: "BERT MLM corruption 글이 소유하는 범위",
    owns: ["Target selection, 80·10·10 input corruption과 selected-position original-token loss"],
    reuses: [{ label: "Categorical negative log-likelihood", href: "/ai/cross-entropy" }],
    evidence: [{ kind: "primary-source", rule: "Selection·branch 비율은 원 BERT recipe와 후속 변경을 구분한다." }],
  },
  "bert-pretraining-objectives": {
    title: "BERT 후속 objective 글이 소유하는 범위",
    owns: ["NSP·SOP·RTD의 example construction, prediction unit, compute 비교 경계"],
    reuses: [{ label: "BERT MLM baseline", href: "/ai/bert-mlm-corruption" }],
    evidence: [{ kind: "primary-source", rule: "RoBERTa·ALBERT·ELECTRA 결과는 동시 변경된 data·architecture·compute 안에서 해석한다." }],
  },
  "bert-task-heads": {
    title: "BERT task head 글이 소유하는 범위",
    owns: ["Sequence·token·span output shape와 cross-encoder·bi-encoder retrieval 경계"],
    reuses: [{ label: "BERT contextual state", href: "/ai/bert" }],
    evidence: [{ kind: "primary-source", rule: "Sentence embedding claim은 pooling·supervision·retrieval setting을 함께 기록한다." }],
  },
 cnn: {
    title: "CNN local operator 글이 소유하는 범위",
    owns: ["Image tensor axes, local cross-correlation, shared kernel과 output geometry"],
    reuses: [{ label: "Tensor와 dot product 기초", href: "/ai/linear-algebra" }],
    evidence: [{ kind: "primary-source", rule: "역사·system claim은 LeNet 논문의 document-recognition 조건에 귀속한다." }],
  },
  "cnn-translation-equivariance": {
    title: "CNN translation equivariance 글이 소유하는 범위",
    owns: ["Input/output translation 대응, invariance 경계와 stride·padding 반례"],
    reuses: [{ label: "Shared local operator", href: "/ai/cnn" }],
    evidence: [{ kind: "primary-source", rule: "Shift-stability 개선 claim은 논문의 architecture·filter·shift protocol 안에서 해석한다." }],
  },
  "cnn-receptive-fields": {
    title: "CNN receptive field 글이 소유하는 범위",
    owns: ["Theoretical jump/span 누적, effective influence 측정과 dilation·gridding 경계"],
    reuses: [{ label: "Convolution geometry", href: "/ai/cnn#output-geometry" }],
    evidence: [{ kind: "primary-source", rule: "ERF shape와 dilation 결과는 각 논문의 network·measurement·dense-task 범위에 귀속한다." }],
  },
  "depthwise-separable-convolution": {
    title: "Depthwise separable convolution 글이 소유하는 범위",
    owns: ["Depthwise spatial filtering·pointwise channel mixing과 MAC·runtime 경계"],
    reuses: [{ label: "Shared cross-correlation", href: "/ai/cnn#local-operator" }],
    evidence: [{ kind: "project-measurement", rule: "MAC 계산 뒤 target device의 latency·traffic·energy·quality를 별도로 측정한다." }],
  },
  "vision-task-spatial-contracts": {
    title: "Vision task spatial contract 글이 소유하는 범위",
    owns: ["Classification·detection·segmentation·restoration prediction unit와 output coordinate 보존 계약"],
    reuses: [{ label: "Receptive field와 output geometry", href: "/ai/cnn-receptive-fields" }],
    evidence: [{ kind: "primary-source", rule: "Dense prediction claim은 FCN의 dataset·architecture·metric 범위에서 해석하고 task별 release evidence를 별도 수집한다." }],
  },
  "vla-embodiment-gap": {
    title: "VLA embodiment gap 글이 소유하는 범위",
    owns: [
      "Semantic grounding에서 3D geometry·action interface·controller·closed-loop verification으로 이어지는 embodiment gap",
      "Action token·pose·chunk·diffusion/flow head를 robot execution contract로 비교하는 경계",
      "Cross-embodiment pretraining과 target-robot adaptation을 observation·action·data·adaptation receipt로 분리하는 방법",
      "Monolithic VLA와 hierarchical VLM·geometry·planner·controller system boundary",
      "Pixel-to-3D waypoint의 coordinate transform·error composition과 embodied closed-loop release gate",
    ],
    reuses: [
      { label: "Vision task의 output coordinate 보존", href: "/ai/vision-task-spatial-contracts" },
      { label: "Conditional flow-matching objective", href: "/ai/diffusion-continuous-time#flow-matching" },
      { label: "Agent observation·action loop", href: "/ai/agent-loop-foundations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "VLA 구조·data 규모·성공률은 각 paper의 robot·action space·benchmark·revision과 저자 자기보고 범위로 제한한다." },
      { kind: "project-measurement", rule: "현장 경험은 robot·sensor·controller·model/runtime revision·action rate·perturbation·반복 횟수를 갖춘 trajectory receipt가 있을 때만 공개 비교로 승격한다." },
      { kind: "project-claim", rule: "최신 preprint와 branded model family를 하나의 통합 system처럼 합치지 않고, 독립 평가 없는 결과를 physical generalization의 확정 증거로 쓰지 않는다." },
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
      { label: "Activation과 gated FFN", href: "/ai/gated-activations" },
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
    "title": "생성 문제와 평가 지도가 소유하는 범위",
    "owns": [
      "Observation·condition·support의 생성 계약",
      "Density·inference·sampling의 tractability 구분",
      "Likelihood·quality·coverage·조건·latency의 평가 경계"
    ],
    "reuses": [
      {
        "label": "확률분포·조건부확률",
        "href": "/ai/math-probability-expectation-variance"
      },
      {
        "label": "Likelihood·KL",
        "href": "/ai/cross-entropy"
      }
    ],
    "evidence": [
      {
        "kind": "standard",
        "rule": "생성 family는 하나의 metric으로 총서열화하지 않고 동일 data·preprocessing·hardware에서 필요한 양을 따로 측정한다."
      }
    ]
  },
  "autoregressive-generative-models": {
    "title": "자기회귀 factorization 글이 소유하는 범위",
    "owns": [
      "Token·prefix·conditional의 정의",
      "Chain-rule joint factorization",
      "Teacher forcing과 sequential sampling 경계"
    ],
    "reuses": [
      {
        "label": "확률 chain rule",
        "href": "/ai/math-probability-expectation-variance"
      },
      {
        "label": "Transformer와 KV cache",
        "href": "/ai/transformer-architecture"
      }
    ],
    "evidence": [
      {
        "kind": "standard",
        "rule": "Factorization의 exactness와 learned conditional·ordering·decode latency를 분리한다."
      }
    ]
  },
  "latent-variable-generative-models": {
    "title": "잠재변수와 ELBO 글이 소유하는 범위",
    "owns": [
      "Prior·decoder·marginal·posterior 정의",
      "Latent marginalization",
      "ELBO와 inference gap"
    ],
    "reuses": [
      {
        "label": "Expectation·KL",
        "href": "/ai/cross-entropy"
      },
      {
        "label": "VAE 구현",
        "href": "/ai/vae"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "ELBO·reparameterization claim은 AEVB의 estimator와 latent family 전제 안에서 읽는다."
      }
    ]
  },
  "normalizing-flows": {
    "title": "Normalizing flow 글이 소유하는 범위",
    "owns": [
      "Base density와 bijection",
      "Jacobian volume correction",
      "Exact likelihood와 가역성 경계"
    ],
    "reuses": [
      {
        "label": "Jacobian",
        "href": "/ai/multivariable-calculus"
      },
      {
        "label": "확률분포",
        "href": "/ai/math-probability-expectation-variance"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "Real NVP claim은 affine coupling·같은 dimension·tractable determinant 조건 안에서 읽는다."
      }
    ]
  },
  "adversarial-density-ratios": {
    "title": "GAN density-ratio 글이 소유하는 범위",
    "owns": [
      "Real·generated source 구분",
      "Optimal discriminator ratio",
      "이상적 optimum과 finite training 경계"
    ],
    "reuses": [
      {
        "label": "GAN objective와 training",
        "href": "/ai/gan"
      },
      {
        "label": "Jensen–Shannon divergence",
        "href": "/ai/cross-entropy"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "Optimal ratio와 equilibrium은 original GAN의 capacity·pointwise optimum 전제와 실제 alternating dynamics를 구분한다."
      }
    ]
  },
  "score-based-generative-models": {
    "title": "Score와 diffusion parameterization 글이 소유하는 범위",
    "owns": [
      "Log-density local score",
      "Gaussian score의 방향",
      "VP noise predictor와 score의 scale 변환"
    ],
    "reuses": [
      {
        "label": "Gradient",
        "href": "/ai/math-derivatives"
      },
      {
        "label": "Diffusion 구현·sampling",
        "href": "/ai/diffusion-models"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "NCSN·DDPM claim은 noise process·target convention·sampling schedule을 함께 고정한다."
      }
    ]
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
        href: "/ai/supervised-learning-loop",
      },
      {
        label: "Conditional probability",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "Expectation", href: "/ai/math-random-variables-expectation" },
      { label: "Variance", href: "/ai/math-variance-sampling" },
      { label: "EDA의 분포·결측·가설", href: "/ai/eda-workflow" },
      {
        label: "Tabular augmentation의 split 경계",
        href: "/ai/tabular-data-synthesis#split-local",
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
    title:"Gradient boosting 기초 글이 소유하는 범위",
    owns:["Piecewise-constant tree 함수","Negative functional gradient와 additive update","Shrinkage·early stopping과 공정 GBM 비교 계약"],
    reuses:[{label:"Loss·gradient·validation",href:"/ai/supervised-learning-loop"},{label:"세 구현의 상세 차이",href:"/ai/xgboost-tree-objective"}],
    evidence:[{kind:"primary-source",rule:"Friedman 원문의 differentiable-loss·base-learner 조건으로 제한한다."},{kind:"standard",rule:"Split·feature·search·hardware budget을 같은 비교 장부에 기록한다."}],
  },
  "xgboost-tree-objective": {
    title:"XGBoost objective 글이 소유하는 범위",
    owns:["G·H·λ leaf update","Parent·children·γ split gain","Histogram threshold approximation"],
    reuses:[{label:"Functional gradient boosting",href:"/ai/gradient-boosting"},{label:"공정 비교 계약",href:"/ai/gradient-boosting#comparison"}],
    evidence:[{kind:"primary-source",rule:"XGBoost 논문의 objective·builder·hardware 조건으로 제한한다."},{kind:"project-claim",rule:"Current version·device의 speed와 determinism은 별도 재측정한다."}],
  },
  "lightgbm-efficient-trees": {
    title:"LightGBM 효율 글이 소유하는 범위",
    owns:["GOSS row sampling과 보정","EFB sparse-column bundling","Leaf-wise growth와 depth 경계"],
    reuses:[{label:"Functional gradient boosting",href:"/ai/gradient-boosting"},{label:"Histogram split",href:"/ai/xgboost-tree-objective#histogram"}],
    evidence:[{kind:"primary-source",rule:"LightGBM 논문의 dataset·implementation·hardware 조건으로 제한한다."},{kind:"project-claim",rule:"GOSS variance·EFB collision·leaf depth를 별도 metric으로 재검증한다."}],
  },
  "catboost-ordered-learning": {
    title:"CatBoost ordered learning 글이 소유하는 범위",
    owns:["Permutation-prefix prediction과 pseudo-residual","Ordered statistic과 ordered boosting 경계","Oblivious symmetric tree shape"],
    reuses:[{label:"Functional gradient boosting",href:"/ai/gradient-boosting"},{label:"Cross-fitted categorical encoding",href:"/ai/feature-engineering#categorical"}],
    evidence:[{kind:"primary-source",rule:"CatBoost 논문의 permutation·dataset·baseline 조건으로 제한한다."},{kind:"standard",rule:"External validation·time/group split은 ordered training과 별도로 유지한다."}],
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
        href: "/ai/supervised-learning-loop",
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
        href: "/ai/early-stopping#state-machine",
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
        label: "Representation learning과 depth",
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
    title: "Learning-rate schedule contract 글이 소유하는 범위",
    owns: [
      "Optimizer update clock·total budget·scheduler state를 묶는 schedule contract",
      "Parameter-group LR·call order·continuous versus resumed trajectory parity",
    ],
    reuses: [
      {
        label: "Gradient descent와 smoothness",
        href: "/ai/math-gradient-descent-convergence",
      },
      { label: "SGD update state", href: "/ai/optimizers" },
      {
        label: "Effective batch·update clock·resume state",
        href: "/ai/training-pipeline",
      },
      {
        label: "Early stopping과 best checkpoint",
        href: "/ai/early-stopping#state-machine",
      },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Scheduler call order와 state semantics는 사용 중인 PyTorch version의 공식 문서로 고정한다.",
      },
      {
        kind: "standard",
        rule: "Scheduler class·version·param group·total updates·call event·state·resume trace를 함께 기록한다.",
      },
    ],
  },
  "lr-decay-policies": {
    title: "Learning-rate decay policy 글이 소유하는 범위",
    owns: [
      "Step·exponential open-loop decay의 clock과 factor semantics",
      "Validation metric·threshold·patience·cooldown 기반 plateau state machine",
      "Decay와 early stopping의 event ordering",
    ],
    reuses: [
      { label: "Update clock과 scheduler state", href: "/ai/lr-scheduling" },
      { label: "Validation split", href: "/ai/train-validation-test" },
    ],
    evidence: [
      { kind: "standard", rule: "Scheduler class·call unit·metric direction·threshold mode·patience·cooldown·state를 기록한다." },
      { kind: "primary-source", rule: "API 동작은 사용 중인 PyTorch stable 공식 문서 범위로 제한한다." },
    ],
  },
  "cosine-restart-scheduling": {
    title: "Cosine annealing·warm restart 글이 소유하는 범위",
    owns: [
      "Cycle-local progress의 cosine interpolation",
      "LR phase reset과 model·optimizer state 보존 경계",
      "Single cosine과 restart의 equal-compute comparison",
    ],
    reuses: [{ label: "Schedule clock·resume", href: "/ai/lr-scheduling" }],
    evidence: [
      { kind: "primary-source", rule: "SGDR 효과는 원 논문의 SGD·architecture·dataset·budget 범위로 제한한다." },
      { kind: "standard", rule: "Peak/min LR·cycle length·multiplier·cursor·optimizer-state policy를 기록한다." },
    ],
  },
  "one-cycle-scheduling": {
    title: "LR range test·OneCycle 글이 소유하는 범위",
    owns: [
      "Log-scale range-test trace와 instability boundary",
      "Total budget의 rise·decay phase와 inverse momentum",
      "Divergence rollback과 diagnostic-state disposal",
    ],
    reuses: [
      { label: "Schedule update clock", href: "/ai/lr-scheduling" },
      { label: "Momentum state", href: "/ai/momentum-optimizer" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Super-convergence claim은 논문의 optimizer·vision benchmark·regularization 조건으로 제한한다." },
      { kind: "standard", rule: "Range-test fixture·smoothing·max candidates·phase parameters·rollback을 기록한다." },
    ],
  },
  "warmup-scheduling": {
    title: "Learning-rate warmup 글이 소유하는 범위",
    owns: [
      "Warmup W와 main T−W의 peak boundary·local clock composition",
      "Actual displacement와 parameter norm의 relative-update diagnostic",
      "Warmup이 가리지 못하는 data·normalization·loss-scale failure",
    ],
    reuses: [
      { label: "Schedule clock·resume", href: "/ai/lr-scheduling" },
      { label: "Adam moment state", href: "/ai/adam-optimizer" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Untuned warmup의 rule of thumb은 논문의 Adam·β₂·architecture·dataset 범위로 제한한다." },
      { kind: "standard", rule: "W·start/peak LR·main length·local cursor·relative update·overflow를 기록한다." },
    ],
  },
  "regularization-practice": {
    title: "Generalization gap 진단 글이 소유하는 범위",
    owns: [
      "Observed train–validation gap의 원인 audit와 one-axis regularization ablation",
    ],
    reuses: [
      {
        label: "Train·validation·test와 empirical risk",
        href: "/ai/train-validation-test",
      },
      {
        label: "Expectation",
        href: "/ai/math-random-variables-expectation",
      },
      { label: "Variance", href: "/ai/math-variance-sampling" },
      { label: "Dropout", href: "/ai/dropout-regularization" },
      { label: "Weight decay", href: "/ai/weight-decay" },
      { label: "Early stopping", href: "/ai/early-stopping" },
      { label: "Label smoothing", href: "/ai/label-smoothing" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Regularization 분류와 selection claim은 인용한 교재·논문의 objective·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Split·baseline·regularizer scope/strength·seed·update budget·best/last artifact·calibration·slice·system cost를 기록한다.",
      },
    ],
  },
  "dropout-regularization": {
    title: "Dropout 글이 소유하는 범위",
    owns: ["Bernoulli activation mask와 inverted scaling", "Dropout train·eval mode와 mask-sharing 경계"],
    reuses: [{ label: "Expectation·variance", href: "/ai/math-random-variables-expectation" }, { label: "Regularizer 선택", href: "/ai/regularization-practice" }],
    evidence: [{ kind: "primary-source", rule: "Dropout 효과는 원 논문의 architecture·dataset·training 조건으로 제한한다." }, { kind: "standard", rule: "p·mask axis·module mode·RNG·MC inference 여부를 기록한다." }],
  },
  "weight-decay": {
    title: "Weight decay 글이 소유하는 범위",
    owns: ["Plain SGD의 L2–decay 등가", "AdamW decoupling과 parameter-group exact coverage"],
    reuses: [{ label: "SGD·Adam state", href: "/ai/optimizers" }, { label: "Learning-rate schedule", href: "/ai/lr-scheduling" }],
    evidence: [{ kind: "primary-source", rule: "AdamW의 등가·분리 주장은 논문의 optimizer 정의와 실험 범위로 제한한다." }, { kind: "standard", rule: "Optimizer·LR schedule·λ·update 수·group identity·resume test를 함께 기록한다." }],
  },
  "early-stopping": {
    title: "Early stopping 글이 소유하는 범위",
    owns: ["Validation best·counter·patience state machine", "Stop event와 immutable best artifact의 분리"],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }, { label: "Scheduler와 evaluation cadence", href: "/ai/lr-scheduling" }],
    evidence: [{ kind: "primary-source", rule: "Stopping criterion의 효과는 논문의 task·metric·cadence 조건으로 제한한다." }, { kind: "standard", rule: "Metric direction·δ·patience·cadence·best/stop index·artifact digest를 기록한다." }],
  },
  "label-smoothing": {
    title: "Label smoothing 글이 소유하는 범위",
    owns: ["One-hot과 K-class uniform distribution의 ε mixture", "Mixup 등 soft-target 조합의 최종 probability audit"],
    reuses: [{ label: "Cross-entropy", href: "/ai/cross-entropy" }, { label: "Mixup·CutMix", href: "/ai/mixup-cutmix" }],
    evidence: [{ kind: "primary-source", rule: "Label smoothing claim은 Inception 논문의 formulation·ImageNet recipe 범위로 제한한다." }, { kind: "standard", rule: "K·ε·target formula·class weight·ignore index·reduction·calibration을 기록한다." }],
  },
  "image-classification-pipeline": {
    title: "이미지 분류 데이터 경계 글이 소유하는 범위",
    owns: [
      "같은 원본·대상·촬영 세션의 sample identity와 deployment 단위 group split",
      "Split·class map·input·model·quality·runtime을 묶은 baseline receipt와 reproduction gate",
    ],
    reuses: [
      {
        label: "Train·validation·test와 empirical risk",
        href: "/ai/train-validation-test",
      },
      { label: "Image tensor와 source lineage", href: "/ai/cnn" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Group-aware split은 GroupKFold의 non-overlap semantics와 caller-provided group 가정 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Identity rule·split digest·class map·input transform·weight·seed·metric·runtime을 함께 기록한다.",
      },
    ],
  },
  "image-backbone-scaling": {
    title: "이미지 backbone scaling 글이 소유하는 범위",
    owns: [
      "Resolution이 CNN spatial area와 global-attention pair cost에 미치는 차수",
      "Depth·width·resolution compound scaling heuristic과 target runtime frontier",
      "같은 input·fine-tuning budget에서 backbone quality·latency·memory를 고르는 절차",
    ],
    reuses: [
      { label: "CNN spatial geometry", href: "/ai/cnn" },
      { label: "ViT patch와 attention", href: "/ai/vision-transformer" },
      { label: "Pretrained handoff", href: "/ai/transfer-learning-practice" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "EfficientNet·ConvNeXt·ViT claim은 각 논문의 data·pretraining·architecture·evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "FLOPs와 실측 p50/p95·throughput·memory를 분리하고 target runtime 조건을 고정한다.",
      },
    ],
  },
  "image-training-stages": {
    title: "이미지 training stage 글이 소유하는 범위",
    owns: [
      "Resolution 변경 시 batch·crop·optimizer clock·position state를 넘기는 stage boundary",
      "Weak-view confidence gate와 strong-view consistency의 pseudo-label objective",
      "Class별 pseudo-label precision·coverage와 rollback release gate",
    ],
    reuses: [
      {
        label: "Augmentation distribution과 target transform",
        href: "/ai/data-augmentation",
      },
      {
        label: "Pretrained handoff와 fine-tuning scope",
        href: "/ai/transfer-learning-practice",
      },
      { label: "Cross-entropy", href: "/ai/cross-entropy" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "RandAugment·FixMatch claim은 논문의 operation set·label regime·benchmark·unlabeled distribution 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Stage handoff와 teacher·pool·threshold·class별 precision·coverage·rollback을 generation별로 기록한다.",
      },
    ],
  },
  "image-probability-decisions": {
    title: "이미지 probability·decision 글이 소유하는 범위",
    owns: [
      "Logit·probability·hard action을 분리하는 inference state boundary",
      "Scalar temperature scaling과 calibration split selection",
      "Calibration→TTA→ensemble→threshold 순서와 versioned serving contract",
    ],
    reuses: [
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
        rule: "Temperature-scaling claim은 Guo et al.의 base models·held-out validation·in-distribution evaluation 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Class mapping·calibration split·temperature·TTA·model weights·threshold·latency·rollback을 적용 순서와 함께 기록한다.",
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
        href: "/ai/math-random-variables-expectation",
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
    title: "딥페이크 평가 분리 글이 소유하는 범위",
    owns: [
      "Source clip·identity·generator·codec을 분리한 unseen-manipulation evaluation boundary와 worst-domain risk",
    ],
    reuses: [
      {
        label: "Identity group split과 image pipeline",
        href: "/ai/image-classification-pipeline",
      },
      {
        label: "얼굴 전처리의 관측 coverage와 lineage",
        href: "/ai/deepfake-preprocessing-lineage",
      },
      {
        label: "Dataset provenance와 coverage matrix",
        href: "/ai/deepfake-dataset-governance",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "FaceForensics++와 CNNDetection claim은 각 source·manipulation·codec·benchmark 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Source·person·generator·codec group checksum과 domain support·risk·threshold를 함께 기록한다.",
      },
    ],
  },
  "deepfake-preprocessing-lineage": {
    title: "딥페이크 전처리 lineage 글이 소유하는 범위",
    owns: [
      "Decode·face detection·identity tracking·alignment·crop의 typed state와 source-frame lineage",
      "Eligible frame을 고정 분모로 쓰는 stage별 face-track coverage와 silent-deletion 방지",
    ],
    reuses: [
      { label: "Source-independent split", href: "/ai/deepfake-detection" },
      { label: "Video timestamp와 sampling", href: "/ai/video-understanding" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DeepfakeBench 전처리 claim은 공개 benchmark revision과 포함된 detector 범위로 제한한다." },
      { kind: "standard", rule: "Decoder·detector·track·alignment·crop revision과 실패 이유·coverage를 같은 receipt에 기록한다." },
    ],
  },
  "deepfake-frequency-evidence": {
    title: "딥페이크 주파수 근거 글이 소유하는 범위",
    owns: [
      "Generator·codec·resize·blur cell에 조건부인 spectrum forensic signal",
      "같은 held-out sample에서 spatial·frequency branch가 함께 틀리는 joint-error 비교",
    ],
    reuses: [
      { label: "FFT와 spectrum", href: "/ai/fft" },
      { label: "Source-independent evaluation", href: "/ai/deepfake-detection" },
      { label: "Ensemble error diversity", href: "/ai/ensemble-methods" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Fourier discrepancy claim은 논문의 generator·spectral measure·post-processing 조건으로 제한한다." },
      { kind: "standard", rule: "Branch별 error set과 intersection·union을 동일 sample IDs와 corruption cell에서 계산한다." },
    ],
  },
  "deepfake-video-decisions": {
    title: "딥페이크 비디오 판정 글이 소유하는 범위",
    owns: [
      "Frame·clip·track score의 mean·max·top-k aggregation과 coverage abstention",
      "Source split·crop·frame budget·calibration·metric·hardware를 맞춘 detector parity",
    ],
    reuses: [
      { label: "Video clip sampling과 replay", href: "/ai/video-clip-sampling" },
      { label: "Temporal convolution candidates", href: "/ai/video-convolution-architectures" },
      { label: "Calibration과 threshold", href: "/ai/imbalanced-data" },
      { label: "Preprocessing coverage", href: "/ai/deepfake-preprocessing-lineage" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DeepfakeBench 순위는 포함된 datasets·methods·pipeline·revision 범위로 제한한다." },
      { kind: "standard", rule: "Temporal unit·reducer·calibration split·threshold·abstention·runtime target을 함께 고정한다." },
    ],
  },
  "deepfake-dataset-governance": {
    title: "딥페이크 데이터 거버넌스 글이 소유하는 범위",
    owns: [
      "Source asset·person·consent와 generator·codec derivatives를 잇는 provenance manifest",
      "Generator×codec×resolution cell별 독립 source-group coverage와 claim boundary",
    ],
    reuses: [
      { label: "Source-independent split", href: "/ai/deepfake-detection" },
      { label: "Data leakage와 lineage", href: "/ai/image-classification-pipeline" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DFDC의 consent·scale·challenge claim은 논문 actor population과 construction 범위로 제한한다." },
      { kind: "standard", rule: "Consent revision·allowed uses·expiry·deletion scope와 모든 derivative parent links를 보존한다." },
    ],
  },
  "video-understanding": {
    title: "비디오 시간 관측 글이 소유하는 범위",
    owns: [
      "Event duration·source FPS·temporal stride에서 관측 구간과 effective sampling rate를 정하는 계약",
      "Ideal band-limited motion에서 effective sample rate가 만드는 aliasing 필요조건과 반례",
    ],
    reuses: [
      { label: "Sampling·aliasing·FFT", href: "/ai/fft" },
      {
        label: "Clip interval coverage와 replay",
        href: "/ai/video-clip-sampling",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Nyquist sampling 경계는 논문의 signal·bandwidth 가정과 video에 적용한 근사 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Source FPS와 실제 timestamps·decode drop·T·stride·duration·effective rate를 함께 기록한다.",
      },
    ],
  },
  "video-clip-sampling": {
    title: "비디오 clip sampling 글이 소유하는 범위",
    owns: [
      "Clip timestamp interval union으로 overlap을 제거한 temporal coverage",
      "Train random sampling과 분리된 deterministic multi-clip evaluation receipt와 replay",
    ],
    reuses: [
      { label: "Duration·sample rate·aliasing", href: "/ai/video-understanding" },
      { label: "Video score aggregation", href: "/ai/deepfake-video-decisions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "TSN sampling claim은 논문의 action datasets·segments·two-stream recipe 범위로 제한한다." },
      { kind: "standard", rule: "Source checksum·clip starts·duration·stride·decode·crop·reducer·model revision을 한 receipt에 기록한다." },
    ],
  },
  "video-convolution-architectures": {
    title: "비디오 convolution architecture 글이 소유하는 범위",
    owns: [
      "Temporal kernel·dilation·input stride를 source timestamp seconds로 환산한 receptive span",
      "I3D inflation·R(2+1)D factorization·SlowFast rate-capacity allocation의 서로 다른 design axis",
    ],
    reuses: [
      { label: "Image tensor와 spatial convolution", href: "/ai/cnn" },
      { label: "Video time observation", href: "/ai/video-understanding" },
      { label: "Clip replay와 budget parity", href: "/ai/video-clip-sampling" },
    ],
    evidence: [
      { kind: "primary-source", rule: "I3D·R(2+1)D·SlowFast claim은 각 논문의 data·pretraining·architecture·task 범위로 제한한다." },
      { kind: "standard", rule: "Input timestamps·kernel geometry·weight handoff·alpha/beta·lateral path·FLOPs·latency·memory를 함께 기록한다." },
    ],
  },
  "video-transformers": {
    title: "Video transformer 글이 소유하는 범위",
    owns: [
      "T×H×W clip을 tubelet coordinates와 token sequence로 바꾸는 input contract",
      "Joint·divided space-time pair cost와 VideoMAE visible-token pretraining 경계",
    ],
    reuses: [
      { label: "Patch token과 position", href: "/ai/vision-transformer" },
      { label: "Q·K·V와 self-attention", href: "/ai/attention-theory" },
      { label: "Deterministic clip shape", href: "/ai/video-clip-sampling" },
    ],
    evidence: [
      { kind: "primary-source", rule: "TimeSformer·VideoMAE claim은 각 논문의 clip·resolution·pretraining·dataset 범위로 제한한다." },
      { kind: "standard", rule: "T·H·W·tubelet·position revision·attention pattern·mask seed·decoder·test clips·latency·memory를 함께 기록한다." },
    ],
  },
  "contrastive-learning": {
    title: "Contrastive pair contract 글이 소유하는 범위",
    owns: [
      "Positive·negative·unknown pair가 보존하거나 구분하는 의미와 불변성 계약",
      "Encoder representation h와 projection embedding z의 handoff·normalization 경계",
    ],
    reuses: [
      {
        label: "벡터·norm·내적·cosine",
        href: "/ai/math-vectors-inner-products",
      },
      {
        label: "Augmentation과 label preservation",
        href: "/ai/data-augmentation",
      },
    ],
    evidence: [
      { kind: "primary-source", rule: "Alignment·uniformity 분석은 논문의 normalized representation·objective 가정 안에서 해석한다." },
      { kind: "standard", rule: "Pair relation·relation source·augmentation revision·encoder/projection handoff를 함께 기록한다." },
    ],
  },
  "simclr-infonce": { title: "SimCLR·NT-Xent 글이 소유하는 범위", owns: ["두 augmentation view와 2B in-batch candidate shape", "NT-Xent 분자·분모·self mask와 temperature weighting"], reuses: [{ label: "Pair 의미와 projection", href: "/ai/contrastive-learning" }, { label: "Softmax와 cross-entropy", href: "/ai/cross-entropy" }], evidence: [{ kind: "primary-source", rule: "SimCLR claim은 ImageNet·ResNet·논문의 augmentation·batch·schedule 범위로 제한한다." }, { kind: "standard", rule: "Augmentation·sampler·batch·temperature·projection revision과 downstream probe를 함께 기록한다." }] },
  "triplet-metric-learning": { title: "Triplet metric learning 글이 소유하는 범위", owns: ["Unit embedding의 cosine–squared-distance 동치", "Triplet relative margin과 versioned hard-negative mining"], reuses: [{ label: "Pair 의미", href: "/ai/contrastive-learning" }, { label: "벡터·norm·내적", href: "/ai/math-vectors-inner-products" }], evidence: [{ kind: "primary-source", rule: "FaceNet margin·mining 결과는 얼굴 identity data와 해당 architecture 범위로 제한한다." }, { kind: "standard", rule: "Distance·normalization·margin·miner encoder·index snapshot·filter revision을 함께 기록한다." }] },
  "supervised-contrastive-learning": { title: "Supervised contrastive 글이 소유하는 범위", owns: ["Label을 anchor별 positive set P(i)로 바꾸는 관계", "Multi-positive 평균 loss·valid-anchor·sampler 경계"], reuses: [{ label: "Pair 의미와 projection", href: "/ai/contrastive-learning" }, { label: "Softmax와 cross-entropy", href: "/ai/cross-entropy" }], evidence: [{ kind: "primary-source", rule: "Supervised contrastive 결과는 논문의 label·dataset·augmentation·batch recipe 범위로 제한한다." }, { kind: "standard", rule: "Positive relation·label hierarchy·sampler·valid-anchor count·subgroup metric을 기록한다." }] },
  "contrastive-evaluation": { title: "Contrastive evaluation 글이 소유하는 범위", owns: ["Bucket별 false-negative pair audit", "동일 split·seed downstream paired evaluation과 data revision loop"], reuses: [{ label: "Triplet miner receipt", href: "/ai/triplet-metric-learning#mining" }, { label: "Train·validation·test", href: "/ai/train-validation-test" }], evidence: [{ kind: "primary-source", rule: "False-negative bias 연구의 objective 가정과 실험 범위를 human audit 결과로 오인하지 않는다." }, { kind: "standard", rule: "Bucket·rubric·agreement·split·seed·metric·artifact revision을 함께 기록한다." }] },
  "domain-finetuning": {
    title: "도메인 적응 선택 글이 소유하는 범위",
    owns: ["Language·fresh fact·behavior·system gap 진단", "Retrieval–weight 저장 경계와 최소 개입 release"],
    reuses: [{ label: "Distribution shift", href: "/ai/transfer-learning-practice#domain-shift" }, { label: "RAG pipeline", href: "/ai/rag-pipeline" }, { label: "LoRA", href: "/ai/lora-finetuning" }],
    evidence: [{ kind: "primary-source", rule: "RAG·LoRA claim은 논문의 model·data·task 범위로 제한한다." }, { kind: "standard", rule: "실패 slice·candidate·target/general/system metric·threshold·rollback을 함께 기록한다." }],
  },
  "continued-pretraining": {
    title: "Continued pretraining 글이 소유하는 범위",
    owns: ["Domain corpus preparation manifest와 domain/general mixture", "Comparable perplexity와 gain–forgetting checkpoint 선택"],
    reuses: [{ label: "DAPT·TAPT 경계", href: "/ai/transfer-learning-practice" }, { label: "NLL과 perplexity", href: "/ai/rnn-language-model" }],
    evidence: [{ kind: "primary-source", rule: "DAPT/TAPT·forgetting claim은 각 논문의 corpus·objective·task 범위로 제한한다." }, { kind: "standard", rule: "Source·rights·dedup·overlap·mixture·token budget·checkpoint metric을 기록한다." }],
  },
  "domain-task-finetuning": {
    title: "Domain task fine-tuning 글이 소유하는 범위",
    owns: ["Input·target·loss·evaluation demonstration contract", "Full·LoRA·frozen update scope와 비보상 행동 release gate"],
    reuses: [{ label: "SFT·response-only loss", href: "/ai/supervised-fine-tuning" }, { label: "LoRA parameterization", href: "/ai/lora-finetuning" }],
    evidence: [{ kind: "primary-source", rule: "Instruction SFT와 LoRA 결과는 각 논문의 prompt·annotator·model·target-module 범위로 제한한다." }, { kind: "standard", rule: "Template·mask·scope·optimizer·format·factuality·abstention·regression을 기록한다." }],
  },
  "domain-data-governance": {
    title: "Domain data governance 글이 소유하는 범위",
    owns: ["Entity·family·time split과 rights/deletion lineage", "독립 slice evidence coverage와 deployment claim boundary"],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }, { label: "Run artifact provenance", href: "/ai/mlops" }],
    evidence: [{ kind: "primary-source", rule: "Datasheet·model-card framework가 실제 consent·independence·runtime enforcement를 보장한다고 과장하지 않는다." }, { kind: "standard", rule: "Group key·time cutoff·rights·derivative·required cell·fallback을 기록한다." }],
  },
  "sentence-embeddings": {
    title: "문장 임베딩 기초 글이 소유하는 범위",
    owns: [
      "Token hidden state에서 padding을 제외해 sentence vector로 만드는 pooling·normalization 계약",
      "Pooling 결과와 relation objective를 구분하고 cosine score의 의미·사실성 경계를 설명",
    ],
    reuses: [
      {
        label: "BERT token visibility와 cross/bi encoder 경계",
        href: "/ai/bert",
      },
      { label: "Contrastive pair semantics", href: "/ai/contrastive-learning" },
      { label: "Cosine·triplet·hard negative", href: "/ai/triplet-metric-learning" },
      { label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" },
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/train-validation-test",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "SBERT·E5·MTEB 주장은 각 논문의 encoder·data·objective·task·metric·benchmark snapshot 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Token state·mask·pooling·normalization·pair relation과 similarity 해석을 한 계산 예로 기록한다.",
      },
    ],
  },
  "bi-encoder-retrieval": {
    title: "Bi-encoder retrieval 글이 소유하는 범위",
    owns: ["Cross-encoder와 bi-encoder의 online·offline 계산 경계", "Candidate recall 상한과 retrieve-then-rerank composition"],
    reuses: [{ label: "Sentence embedding artifact", href: "/ai/sentence-embeddings" }, { label: "ANN index", href: "/ai/approximate-nearest-neighbor" }],
    evidence: [{ kind: "primary-source", rule: "SBERT 계산 비교는 논문의 encoder·task·hardware 범위로 제한한다." }, { kind: "standard", rule: "Corpus generation·candidate k·Recall@k·reranking latency와 hybrid candidate source를 함께 기록한다." }],
  },
  "embedding-serving-contract": {
    title: "Embedding serving contract 글이 소유하는 범위",
    owns: ["Role instruction·tokenizer·truncation·pooling의 입력 artifact 계약", "Dimension·dtype·ANN overhead와 compatible index generation receipt"],
    reuses: [{ label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" }, { label: "Sequence truncation", href: "/ai/sequence-length" }],
    evidence: [{ kind: "primary-source", rule: "E5 prefix·multi-stage recipe는 해당 checkpoints와 paper 범위로 제한한다." }, { kind: "standard", rule: "Checkpoint·tokenizer·serialization·pooling·normalization·length·dimension·dtype·corpus·ANN settings를 같은 generation에 묶는다." }],
  },
  "embedding-evaluation": {
    title: "Embedding evaluation 글이 소유하는 범위",
    owns: ["Corpus와 multi-positive label snapshot, Recall·NDCG 계산 계약", "Required slice와 품질–latency–memory–storage Pareto release"],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }, { label: "Hard-negative snapshot", href: "/ai/triplet-metric-learning" }],
    evidence: [{ kind: "primary-source", rule: "MTEB 결과는 benchmark snapshot·task·language·metric 범위로 제한한다." }, { kind: "standard", rule: "Corpus·labels·tie convention·slice thresholds·ANN settings·hardware·concurrency·actual cost를 함께 기록한다." }],
  },
  quantization: {
    title: "양자화 기초 글이 소유하는 범위",
    owns: [
      "Affine INT quantizer의 scale·zero-point·round·clip과 rounding/clipping error 경계",
      "Affine integer codebook과 FP8 exponent·mantissa format의 경계",
    ],
    reuses: [
      {
        label: "Bit·byte와 code pattern",
        href: "/ai/text-unicode-encoding#bits-bytes",
      },
      { label: "후속 PTQ calibration", href: "/ai/ptq-calibration" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "FP8 format·scaling claim은 Transformer Engine의 해당 version·GPU·shape 범위로 제한한다.",
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
  "ptq-calibration": {
    title: "PTQ calibration 글이 소유하는 범위",
    owns: ["Per-tensor·channel·group scale 공유 범위", "Calibration set과 validation slice의 saturation·artifact release 경계"],
    reuses: [{ label: "Quantizer의 scale·clipping", href: "/ai/quantization" }, { label: "Train·validation·test", href: "/ai/train-validation-test" }],
    evidence: [{ kind: "primary-source", rule: "SmoothQuant claim은 논문의 model·calibration·INT8 kernel·hardware 범위로 제한한다." }],
  },
  "quantization-aware-training": {
    title: "QAT 글이 소유하는 범위",
    owns: ["Float master·fake-quant forward·STE backward의 학습 graph", "Converted artifact와 실제 low-bit kernel의 release 경계"],
    reuses: [{ label: "Quantizer의 round·clip", href: "/ai/quantization" }, { label: "Loss와 backpropagation", href: "/ai/backprop-optimization" }],
    evidence: [{ kind: "primary-source", rule: "Integer QAT 결과는 논문의 model·data·hardware와 surrogate recipe 범위로 제한한다." }],
  },
  "weight-only-quantization": {
    title: "Weight-only quantization 글이 소유하는 범위",
    owns: ["Calibration activation 기반 layer-output reconstruction", "GPTQ·AWQ method와 numerical format·execution profile·container 경계"],
    reuses: [{ label: "Matrix multiplication과 Frobenius norm", href: "/ai/math-matrices-svd" }, { label: "PTQ calibration", href: "/ai/ptq-calibration" }],
    evidence: [{ kind: "primary-source", rule: "GPTQ·AWQ 품질·속도 claim은 논문의 model·bit/group·kernel·hardware 범위로 제한한다." }],
  },
  "quantized-model-deployment": {
    title: "Quantized model 배포 글이 소유하는 범위",
    owns: ["Quantized weights·metadata·activation·request state·workspace의 resident-memory 장부", "Low-bit kernel fraction과 end-to-end speedup release gate"],
    reuses: [{ label: "Dtype별 exact weight payload", href: "/ai/model-vram-budgeting" }, { label: "Qwen hybrid request state", href: "/ai/qwen36-hybrid-runtime" }, { label: "통합 compression pipeline", href: "/ai/compression-pipeline" }],
    evidence: [{ kind: "primary-source", rule: "Low-precision kernel 지원 claim은 exact engine·GPU·operator·shape와 측정 trace에 제한한다." }, { kind: "project-measurement", rule: "같은 workload·quality·concurrency에서 startup peak·fallback·p50/p95·throughput을 기록한다." }],
  },
  "pruning": {
    "title": "Pruning foundations 글이 소유하는 범위",
    "owns": [
      "Binary mask·density·sparsity의 분모와 dense zero의 경계",
      "Weight·N:M group·channel removal unit에서 runtime consumer로의 handoff"
    ],
    "reuses": [
      {
        "label": "Unstructured importance와 payload",
        "href": "/ai/unstructured-pruning"
      },
      {
        "label": "Structured shape와 N:M",
        "href": "/ai/structured-pruning"
      }
    ],
    "evidence": [
      {
        "kind": "project-measurement",
        "rule": "Sparsity는 target tensor·분모·mask hash·artifact consumer와 함께 기록한다."
      }
    ]
  },
  "unstructured-pruning": {
    "title": "Unstructured pruning 글이 소유하는 범위",
    "owns": [
      "Magnitude·movement 기반 individual-weight selection",
      "Value·index·metadata sparse payload 손익분기"
    ],
    "reuses": [
      {
        "label": "Mask와 removal unit",
        "href": "/ai/pruning"
      },
      {
        "label": "Recovery와 runtime release",
        "href": "/ai/pruning-recovery-deployment"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "Movement claim은 논문의 model·task·schedule 범위로 제한한다."
      },
      {
        "kind": "project-measurement",
        "rule": "Sparse storage와 latency는 실제 format·kernel에서 별도로 측정한다."
      }
    ]
  },
  "structured-pruning": {
    "title": "Structured pruning 글이 소유하는 범위",
    "owns": [
      "Channel·head 제거의 graph shape propagation",
      "N:M local-group eligibility와 chosen tactic 경계"
    ],
    "reuses": [
      {
        "label": "Mask와 removal unit",
        "href": "/ai/pruning"
      },
      {
        "label": "Runtime release frontier",
        "href": "/ai/pruning-recovery-deployment"
      }
    ],
    "evidence": [
      {
        "kind": "standard",
        "rule": "N:M 지원은 target runtime·GPU·axis·dtype·operator 문서로 확인한다."
      },
      {
        "kind": "project-measurement",
        "rule": "Export shape·build log·latency를 같은 workload에서 함께 검증한다."
      }
    ]
  },
  "one-shot-llm-pruning": {
    "title": "One-shot LLM pruning 글이 소유하는 범위",
    "owns": [
      "LLM calibration prompt와 layer activation coverage",
      "SparseGPT reconstruction과 Wanda activation-aware score의 다른 method boundary"
    ],
    "reuses": [
      {
        "label": "Pruning mask",
        "href": "/ai/pruning"
      },
      {
        "label": "Train·validation·test 분리",
        "href": "/ai/train-validation-test-split"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "SparseGPT·Wanda 결과는 각 논문의 checkpoint·calibration·pattern·metric 범위로 제한한다."
      }
    ]
  },
  "pruning-recovery-deployment": {
    "title": "Pruning recovery·deployment 글이 소유하는 범위",
    "owns": [
      "Fixed mask를 parameter와 optimizer state에 유지하는 불변식",
      "Artifact·quality·chosen tactic·memory·latency의 release frontier"
    ],
    "reuses": [
      {
        "label": "Removal unit과 mask",
        "href": "/ai/pruning"
      },
      {
        "label": "Amdahl runtime 상한",
        "href": "/ai/quantized-model-deployment#runtime-release"
      }
    ],
    "evidence": [
      {
        "kind": "project-measurement",
        "rule": "같은 base·workload·engine에서 artifact byte·slice quality·build trace·p50/p95·throughput을 기록한다."
      }
    ]
  },
  "knowledge-distillation": {
    title: "고전 지식 증류 글이 소유하는 범위",
    owns: [
      "Teacher signal을 class logit과 aligned hidden feature interface로 구분하는 선택 경계",
      "Temperature soft target·class odds·hard/soft mixture·T² gradient scale과 KL 방향",
      "서로 다른 hidden dimension·layer·position 사이 feature projection과 alignment 계약",
    ],
    reuses: [
      {
        label: "Probability·softmax·cross-entropy·KL",
        href: "/ai/cross-entropy",
      },
      { label: "Gradient와 optimization", href: "/ai/backprop-optimization" },
      { label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" },
      { label: "SFT response-only loss와 data contract", href: "/ai/sft" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Hinton KD·FitNets claim은 각 논문의 architecture·data·objective·task·metric 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Teacher/base hash·class order·temperature·KL direction/reduction·alpha·feature layer/projection·split·student-only runtime을 함께 기록한다.",
      },
    ],
  },
  "sequence-distillation": {
    title: "Sequence distillation 글이 소유하는 범위",
    owns: [
      "Tokenizer가 다른 teacher text를 student target token으로 다시 serialize하는 경계",
      "Prompt·teacher revision·sampling·filter·student mask를 묶은 generation provenance receipt",
      "Accepted synthetic data의 target slice coverage·rejection bias·contamination release gate",
    ],
    reuses: [
      { label: "고전 distillation signal 선택", href: "/ai/knowledge-distillation" },
      { label: "Tokenizer/checkpoint compatibility", href: "/ai/tokenizer" },
      { label: "SFT response-only loss", href: "/ai/sft" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Sequence KD claim은 논문의 machine-translation data·teacher decode·student training 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Prompt source/rights·teacher revision·system prompt·sampling·filter/reject reason·student tokenizer/template/mask·slice mixture·decontamination을 함께 기록한다.",
      },
    ],
  },
  "on-policy-distillation": {
    title: "On-policy distillation 글이 소유하는 범위",
    owns: [
      "Teacher-forced prefix와 student-visited prefix 사이 state-distribution mismatch",
      "Student rollout에서 teacher token feedback을 받는 on/off-policy mixture와 divergence 방향",
      "Specialist teacher를 domain routing과 policy-space feedback으로 통합하는 경계",
    ],
    reuses: [
      { label: "고전 distillation objective", href: "/ai/knowledge-distillation" },
      { label: "Sequence target과 provenance", href: "/ai/sequence-distillation" },
      { label: "Autoregressive language modeling", href: "/ai/transformer-architecture" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "GKD·MOPD claim은 각 논문의 rollout policy·teacher access·domain·model·metric 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Student checkpoint·rollout seed/prefix·teacher revision·mixture coefficient·KL direction·domain router·cost·independent quality를 함께 기록한다.",
      },
    ],
  },
  "self-distillation": {
    title: "Self-distillation 글이 소유하는 범위",
    owns: [
      "직전 generation artifact를 frozen teacher로 승격하는 세대 계약",
      "Teacher agreement와 ground-truth quality를 분리한 bias inheritance audit",
      "평균 gain·worst-slice regression·inheritance gap을 결합한 반복 중단·rollback gate",
    ],
    reuses: [
      { label: "고전 hard·soft distillation", href: "/ai/knowledge-distillation" },
      { label: "Synthetic sequence provenance", href: "/ai/sequence-distillation" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Born-Again claim은 논문의 동일 architecture generation·dataset·metric 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Generation ID·teacher/student hash·data split·seed·teacher agreement·independent quality·worst slice·compute·rollback checkpoint를 함께 기록한다.",
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
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
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
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
      {
        label: "도메인 적응과 RAG/fine-tuning 선택",
        href: "/ai/domain-finetuning",
      },
      { label: "Candidate retrieval·fusion·reranking funnel", href: "/ai/retrieval-ranking-funnel" },
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
  "retrieval-ranking-funnel": {
    title: "Retrieval ranking funnel 글이 소유하는 범위",
    owns: ["BM25 lexical·HNSW dense ANN·RRF fusion·cross-encoder candidate funnel", "Pre-retrieval ACL과 GraphRAG provenance lane·candidate recall ceiling"],
    reuses: [{ label: "RAG ingestion→answer lifecycle", href: "/ai/rag-pipeline" }, { label: "Sentence embedding과 multi-positive metric", href: "/ai/sentence-embeddings" }],
    evidence: [{ kind: "primary-source", rule: "DPR·HNSW·RRF·BERT reranking claim은 각 원 논문의 corpus·metric·model 범위로 제한한다." }, { kind: "standard", rule: "Authorized universe·candidate IDs·ranker revision·cutoff·latency·memory·recall을 같은 trace에 남긴다." }, { kind: "project-measurement", rule: "Exact scan ablation과 candidate Recall@k 뒤 rerank NDCG·p95를 측정한다." }],
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
        href: "/ai/train-validation-test",
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
        label: "Agent run의 proposal·observation·exit",
        href: "/ai/agent-loop-foundations",
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
    title: "Prediction evaluation contract 글이 소유하는 범위",
    owns: [
      "Prediction row·cutoff·target horizon의 identity와 time boundary",
      "Metric unit·reducer·weight·direction 계약",
      "Local selection·public feedback·private final evaluation의 역할 분리",
    ],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }],
    evidence: [{ kind: "standard", rule: "Row key·cutoff·target window·metric reducer·evaluation role을 함께 versioning한다." }],
  },
  "model-selection-bias": {
    title: "Maximum-selection optimism 글이 소유하는 범위",
    owns: ["True score·validation noise·observed score의 분리", "여러 noisy candidates의 argmax가 만드는 selection optimism", "Candidate budget·adaptive search·fresh final evaluation 경계"],
    reuses: [{ label: "Expectation", href: "/ai/math-random-variables-expectation" }],
    evidence: [{ kind: "primary-source", rule: "Selection-bias claim은 Cawley·Talbot의 finite validation·model-selection setting 범위로 제한한다." }],
  },
  "prediction-time-feature-availability": {
    title: "Prediction-time feature availability 글이 소유하는 범위",
    owns: ["Event time·available time·prediction cutoff의 구분", "Feature에서 source record·join·window·revision으로 이어지는 lineage", "Latest source arrival과 cutoff를 비교하는 admission fixture"],
    reuses: [{ label: "Fold-local fitted state", href: "/ai/fold-local-validation" }],
    evidence: [{ kind: "standard", rule: "Source ID·event/available time·timezone·join/window/fallback revision을 함께 기록한다." }],
  },
  "competition-baseline": {
    title: "Competition baseline artifact 글이 소유하는 범위",
    owns: ["Data snapshot에서 split·OOF·test·metric·submission으로 이어지는 첫 완결 chain", "표준 partition K-fold의 row별 OOF coverage invariant", "Run·prediction·metric·file checksum의 replayable lineage"],
    reuses: [{ label: "OOF risk", href: "/ai/oof-risk-estimation" }, { label: "Run provenance", href: "/ai/training-pipeline#logging" }],
    evidence: [{ kind: "primary-source", rule: "System debt claim은 Hidden Technical Debt의 taxonomy·사례 범위로 제한한다." }],
  },
  "paired-experiment-design": {
    title: "One-hypothesis paired experiment 글이 소유하는 범위",
    owns: ["Failure slice·원인 가설·한 축의 변경·예상 결과·adoption gate", "같은 fold에서 candidate와 baseline을 빼는 paired delta", "Fold·slice·latency·memory·interaction의 채택 경계"],
    reuses: [{ label: "Baseline artifact", href: "/ai/competition-baseline" }],
    evidence: [{ kind: "project-claim", rule: "Paired delta와 adoption gate는 동일 protocol의 실험 audit 규칙이며 독립 표본 theorem으로 확대하지 않는다." }],
  },
  "competition-submission-control": {
    title: "Competition submission control 글이 소유하는 범위",
    owns: ["Submission 수와 decision-changing external feedback 수의 구분", "사전 feedback budget·freeze·새 holdout 종료 조건", "Candidate·retrain·inference·row order·checksum·rollback manifest"],
    reuses: [{ label: "Validation feedback audit", href: "/ai/validation-feedback-audit" }],
    evidence: [{ kind: "primary-source", rule: "Adaptive leaderboard claim은 The Ladder의 model·mechanism·experiment 범위로 제한한다." }],
  },
  "cross-validation": {
    title: "배포 질문과 validation estimand 글이 소유하는 범위",
    owns: [
      "배포에서 새로 나타나는 row·entity·time/site 단위와 averaging loss를 먼저 정하는 기준",
      "Deployment-matched validation risk의 형태와 질문에서 split family로 가는 첫 mapping",
      "Historical distribution 밖의 새 site·정책·기간에 대한 재검증 경계",
    ],
    reuses: [
      {
        label: "Train·validation·test와 loss",
        href: "/ai/train-validation-test",
      },
      {
        label: "Competition evaluation contract",
        href: "/ai/competition-workflow",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Splitter semantics와 parameter는 현재 scikit-learn 공식 문서·설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Deployment unit·distribution·loss와 선택한 split family를 함께 기록한다.",
      },
    ],
  },
  "fold-local-validation": {
    title: "Fold-local fitted state 글이 소유하는 범위",
    owns: [
      "Fold manifest와 fitted state·fit·transform의 구분",
      "Scaler·imputer·vocabulary·feature selection을 train fold에서만 fit하는 실행 경계",
      "선택 뒤 full-data refit과 external pretrained transform의 provenance 경계",
    ],
    reuses: [
      { label: "Fold-local preprocessing statistic", href: "/ai/feature-engineering#numeric" },
      { label: "배포 질문", href: "/ai/cross-validation" },
    ],
    evidence: [{ kind: "primary-source", rule: "Pipeline 동작은 현재 scikit-learn 공식 문서 범위로 제한한다." }],
  },
  "oof-risk-estimation": {
    title: "OOF prediction과 CV estimand 글이 소유하는 범위",
    owns: [
      "각 row를 보지 않은 fold model의 OOF prediction 생성과 row-order 복원",
      "Fold 평균과 pooled row·weight risk의 구분",
      "Full-data model conditional error와 learning-procedure estimand의 해석 경계",
    ],
    reuses: [
      { label: "Fold-local validation", href: "/ai/fold-local-validation" },
      { label: "Expectation", href: "/ai/math-random-variables-expectation" },
    ],
    evidence: [{ kind: "primary-source", rule: "CV estimand·uncertainty claim은 Bates·Hastie·Tibshirani의 이론·실험 범위로 제한한다." }],
  },
  "grouped-validation": {
    title: "Group-disjoint validation 글이 소유하는 범위",
    owns: [
      "Row·entity·shared cause·group key의 구분",
      "Train과 validation group ID 교집합을 비우는 split 조건",
      "행 수와 independent evaluation-unit count, 중첩 household·site dependency의 경계",
    ],
    reuses: [{ label: "배포 질문", href: "/ai/cross-validation" }],
    evidence: [{ kind: "primary-source", rule: "Group splitter semantics는 현재 scikit-learn 공식 문서 범위로 제한한다." }],
  },
  "walk-forward-validation": {
    title: "Walk-forward와 label availability 글이 소유하는 범위",
    owns: [
      "Event·feature available·label available time과 forecast origin의 구분",
      "Target horizon과 reporting delay를 포함한 training-row admission 조건",
      "Gap·purge·rolling origin 및 expanding·rolling production policy 경계",
    ],
    reuses: [
      { label: "Prediction cutoff와 feature availability", href: "/ai/feature-engineering#overview" },
      { label: "Temporal gap·purge", href: "/ai/time-features#leakage" },
    ],
    evidence: [{ kind: "primary-source", rule: "TimeSeriesSplit API는 현재 scikit-learn 문서 범위로 제한하고 delayed labels 자동 처리로 확대하지 않는다." }],
  },
  "validation-feedback-audit": {
    title: "Adaptive validation feedback 글이 소유하는 범위",
    owns: [
      "Local·public score offset과 candidate pair rank agreement의 구분",
      "External feedback 뒤 split·metric·feature·candidate filter 변경 receipt",
      "Feedback budget·protocol freeze·unused final holdout 종료 조건",
    ],
    reuses: [
      { label: "OOF risk", href: "/ai/oof-risk-estimation" },
      { label: "Selection optimism", href: "/ai/model-selection-bias" },
    ],
    evidence: [{ kind: "primary-source", rule: "Adaptive leaderboard claim은 The Ladder의 문제 설정과 보장 범위로 제한한다." }],
  },
  "hyperparameter-tuning": {
    title: "튜닝 계약과 trial budget 글이 소유하는 범위",
    owns: [
      "Parameter·hyperparameter와 configuration·trial·study·outer evaluation의 구분",
      "동일 split·metric·resource·seed policy를 쓰는 selection contract",
      "Random-search hit probability와 trial·wall-clock 종료 조건",
      "선택이 끝난 procedure의 independent outer report",
    ],
    reuses: [
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
      { label: "Selection optimism", href: "/ai/model-selection-bias" },
    ],
    evidence: [{ kind: "primary-source", rule: "Random-search claim은 논문의 domains·tasks와 확률 가정 범위로 제한한다." }],
  },
  "adaptive-hyperparameter-search": {
    title: "적응형 탐색 글이 소유하는 범위",
    owns: ["Trial history·surrogate·acquisition·proposal의 구분", "TPE good/other density ratio", "COMPLETE·PRUNED·FAIL·PENDING과 parallel proposal boundary"],
    reuses: [{ label: "Tuning contract", href: "/ai/hyperparameter-tuning" }, { label: "Probability distribution", href: "/ai/math-probability-expectation-variance" }],
    evidence: [{ kind: "primary-source", rule: "Optuna·TPE claim은 원 논문과 해당 API version의 설계 범위로 제한한다." }],
  },
  "search-space-design": {
    title: "Search space 설계 글이 소유하는 범위",
    owns: ["Parameter type·scale·bounds", "Log-uniform sampling", "Conditional branch와 feasible resource constraint", "Search-space revision 경계"],
    reuses: [{ label: "Logarithm", href: "/ai/math-exponents-logarithms" }, { label: "Trial budget", href: "/ai/hyperparameter-tuning#trial-budget" }],
    evidence: [{ kind: "primary-source", rule: "Define-by-run은 conditional-space 표현 근거이며 좋은 bounds의 자동 보장으로 표현하지 않는다." }],
  },
  "multi-fidelity-pruning": {
    title: "Multi-fidelity pruning 글이 소유하는 범위",
    owns: ["Comparable resource coordinate와 rung", "Successive-halving candidate/resource schedule", "False-prune late-bloomer audit", "Full-budget 재평가와 pruning receipt"],
    reuses: [{ label: "Tuning contract", href: "/ai/hyperparameter-tuning" }, { label: "Trial history", href: "/ai/adaptive-hyperparameter-search" }],
    evidence: [{ kind: "primary-source", rule: "Hyperband speedup은 논문의 fidelity 구조·tasks·resource 전제 범위로 제한한다." }],
  },
  "multi-objective-hpo": {
    title: "Multi-objective HPO 글이 소유하는 범위",
    owns: ["Objective와 hard constraint의 분리", "Tolerance-aware Pareto dominance", "Repeated-measurement frontier stability", "최종 configuration·rollback selection receipt"],
    reuses: [{ label: "Feasible search space", href: "/ai/search-space-design#conditional-space" }, { label: "Outer evaluation", href: "/ai/hyperparameter-tuning#outer-evaluation" }],
    evidence: [{ kind: "standard", rule: "Optuna API는 frontier 계산 도구이며 business preference·안전 constraint의 자동 결정으로 표현하지 않는다." }],
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
        href: "/ai/math-variance-sampling",
      },
      {
        label: "Train·validation·test의 역할",
        href: "/ai/train-validation-test",
      },
      {
        label: "OOF prediction과 fold-local 경계",
        href: "/ai/oof-risk-estimation#pooling",
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
    title: "평가 설계 글이 소유하는 범위",
    owns: [
      "배포 decision unit·prediction-to-action policy·오류 비용·weight로 구성한 metric 계약",
      "관측·decision unit·slice·global의 hierarchical reducer와 목표 population의 구분",
    ],
    reuses: [
      { label: "기댓값", href: "/ai/math-random-variables-expectation" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Metric API와 scorer semantics는 공식 문서가 명시한 version·parameter 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "scikit-learn metric·scorer 이름과 parameter semantics는 현재 stable 공식 문서와 설치 version 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Decision unit/distribution·prediction/action·cost·weight/reducer/slice를 metric receipt에 함께 기록한다.",
      },
      {
        kind: "project-claim",
        rule: "Decision-risk와 hierarchical reducer 수식은 평가 설계를 감사하기 위한 일반 계약이며 특정 metric이나 model의 성능 보장이 아니다.",
      },
    ],
  },
  "regression-metrics": {
    title: "회귀 평가 글이 소유하는 범위",
    owns: [
      "Residual·absolute/squared penalty와 MAE·RMSE 계산",
      "Absolute/squared conditional risk가 목표로 하는 중앙값·평균",
      "Prediction interval의 empirical coverage·width 및 conditional coverage 경계",
    ],
    reuses: [
      { label: "평가 decision unit과 reducer", href: "/ai/evaluation-metrics" },
      { label: "기댓값", href: "/ai/math-random-variables-expectation" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Regression quantile claim은 원 논문의 loss·linear specification·distribution 조건으로 제한한다." },
      { kind: "project-claim", rule: "Residual·coverage 계산 예는 metric 동작을 설명하며 특정 model 우월성을 보장하지 않는다." },
    ],
  },
  "classification-metrics": {
    title: "분류 평가 글이 소유하는 범위",
    owns: [
      "Score ranking·probability semantics·threshold action이라는 세 evaluation layer",
      "Strictly proper binary Brier score와 probability misreport regret",
      "Threshold별 false-negative/false-positive expected decision cost",
    ],
    reuses: [
      { label: "평가 decision cost", href: "/ai/evaluation-metrics" },
      { label: "Class prevalence·PR/ROC·confusion matrix", href: "/ai/imbalanced-data" },
      { label: "Probability calibration", href: "/ai/image-probability-decisions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Proper scoring rule claim은 원 논문의 probability-space·regularity·orientation 조건으로 제한한다." },
      { kind: "project-claim", rule: "Threshold cost 식은 사전에 비용과 population을 정한 binary decision에만 적용한다." },
    ],
  },
  "ranking-metrics": {
    title: "검색·추천 평가 글이 소유하는 범위",
    owns: [
      "Query·candidate·relevance·depth k의 ranked-list evaluation unit",
      "NDCG의 graded gain·position discount·ideal normalization",
      "Query macro·traffic-weighted population reducer와 incomplete judgment audit",
    ],
    reuses: [
      { label: "평가 unit과 reducer", href: "/ai/evaluation-metrics" },
      { label: "Multi-positive retrieval", href: "/ai/sentence-embeddings#evaluation" },
    ],
    evidence: [
      { kind: "primary-source", rule: "NDCG claim은 원 논문의 relevance scale·discount interpretation·test collection 범위로 제한한다." },
      { kind: "project-claim", rule: "Query macro와 traffic 예시는 서로 다른 population 정의를 보일 뿐 하나를 보편적으로 권하지 않는다." },
    ],
  },
  "metric-selection-protocol": {
    title: "Metric selection protocol 글이 소유하는 범위",
    owns: [
      "Training surrogate·validation configuration·decision policy·outer test의 정보 경계",
      "Hard guardrail의 feasible set을 만든 뒤 primary metric으로 선택하는 절차",
      "Data·candidate·metric·release rule을 묶은 selection receipt",
    ],
    reuses: [
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
      { label: "Hyperparameter selection", href: "/ai/hyperparameter-tuning" },
      { label: "Metric decision contract", href: "/ai/evaluation-metrics" },
    ],
    evidence: [
      { kind: "standard", rule: "Metric·scorer API claim은 현재 stable scikit-learn 문서와 설치 version으로 제한한다." },
      { kind: "project-claim", rule: "Feasible-set 수식은 감사 가능한 selection 계약이며 generalization guarantee가 아니다." },
    ],
  },
  "experiment-tracking": {
    title: "실험 provenance 글이 소유하는 범위",
    owns: ["Experiment specification digest와 execution attempt identity의 분리", "URI·digest·schema·size·producer를 포함한 immutable artifact reference", "실패 attempt까지 보존하는 provenance receipt"],
    reuses: [{ label: "Training run lineage", href: "/ai/training-pipeline" }, { label: "Evaluation selection receipt", href: "/ai/metric-selection-protocol" }],
    evidence: [
      { kind: "primary-source", rule: "MLflow 초기 component claim은 project paper의 시대·design 범위로 제한한다." },
      { kind: "project-claim", rule: "Digest tuple과 provenance DAG는 일반 추적 설계이며 특정 tool의 자동 보장이 아니다." },
    ],
  },
  "learning-curve-tracking": {
    title: "Learning curve 추적 글이 소유하는 범위",
    owns: ["Metric observation의 update·processed-unit·wall-time 좌표", "서로 다른 logging 간격을 같은 자원 budget에 정렬하는 비교 경계", "Checkpoint·evaluation fixture·metric definition을 묶은 point receipt"],
    reuses: [{ label: "Effective batch update clock", href: "/ai/batch-size#effective-batch" }, { label: "Evaluation metric definition", href: "/ai/evaluation-metrics" }],
    evidence: [
      { kind: "standard", rule: "W&B logging과 step semantics는 현재 공식 문서와 설치 SDK version 범위로 제한한다." },
      { kind: "project-claim", rule: "Nearest-point alignment 식은 비교 protocol이며 unbiased model comparison theorem이 아니다." },
    ],
  },
  "model-artifact-registry": {
    title: "Model artifact registry 글이 소유하는 범위",
    owns: ["Backend metadata와 artifact object store의 공동 integrity lifecycle", "Mutable alias를 immutable version으로 고정하는 promotion receipt", "Registry version과 실제 endpoint artifact·serving config parity"],
    reuses: [{ label: "Content-addressed artifact", href: "/ai/experiment-tracking#artifact-reference" }, { label: "Deployment release gate", href: "/ai/model-deployment" }],
    evidence: [
      { kind: "standard", rule: "MLflow store·registry·alias semantics는 현재 공식 문서와 배포 mode 범위로 제한한다." },
      { kind: "project-claim", rule: "Replayable predicate와 promotion receipt는 일반 운영 계약이며 registry가 자동 제공하는 보안 theorem이 아니다." },
    ],
  },
  "reproducible-ml-execution": {
    title: "ML 재현 실행 글이 소유하는 범위",
    owns: ["Bitwise·numeric·statistical·behavioral reproduction equivalence", "Root seed에서 병렬 좌표별 child stream을 만드는 계층적 derivation", "빈 environment의 first-divergence clean-room test"],
    reuses: [{ label: "확률분포와 분산", href: "/ai/math-variance-sampling" }, { label: "Metric guardrail", href: "/ai/metric-selection-protocol#guardrails" }],
    evidence: [
      { kind: "primary-source", rule: "ML technical-debt claim은 해당 position paper의 production-system framing으로 제한한다." },
      { kind: "standard", rule: "PyTorch determinism claim은 공식 문서가 명시한 release·platform·device 범위를 넘기지 않는다." },
      { kind: "project-claim", rule: "Tolerance·seed derivation·clean-room gate는 명시적 재현 protocol이지 영구 동일성 보장이 아니다." },
    ],
  },
  "imbalanced-data": {
    title: "불균형 분류 출발점 글이 소유하는 범위",
    owns: [
      "Class prevalence와 all-negative accuracy baseline",
      "Score ranking·probability meaning·hard action의 세 층 분리",
    ],
    reuses: [
      {
        label: "Probability·conditional probability",
        href: "/ai/math-probability-expectation-variance",
      },
    ],
    evidence: [
      { kind: "primary-source", rule: "PR·imbalance claim은 binary labeled evaluation population이라는 논문 범위로 제한한다." },
      { kind: "standard", rule: "Training sample ratio와 deployment prevalence를 별도 값으로 기록한다." },
    ],
  },
  "imbalance-resampling": {
    title: "불균형 resampling 글이 소유하는 범위",
    owns: ["Training-fold 안으로 제한한 sampler lifecycle", "SMOTE interpolation의 neighbor geometry와 leakage 경계"],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }, { label: "Synthetic row", href: "/ai/tabular-data-synthesis#split-local" }],
    evidence: [{ kind: "primary-source", rule: "SMOTE claim은 논문의 feature metric·neighbor·classifier 조건으로 제한한다." }, { kind: "standard", rule: "Split·fold·sampler fit·seed와 validation prevalence를 기록한다." }],
  },
  "imbalance-loss-weighting": {
    title: "불균형 loss weighting 글이 소유하는 범위",
    owns: ["Class별 고정 weighted risk", "Focal modulation과 noisy hard-example 경계"],
    reuses: [{ label: "Cross-entropy", href: "/ai/cross-entropy" }],
    evidence: [{ kind: "primary-source", rule: "Focal-loss claim은 dense detection·α·γ·recipe의 논문 범위로 제한한다." }, { kind: "standard", rule: "Weight·γ·label audit·calibration ablation을 함께 기록한다." }],
  },
  "cost-sensitive-thresholding": {
    title: "비용 민감 threshold 글이 소유하는 범위",
    owns: ["Calibrated probability와 오류 비용의 Bayes action", "Capacity·recall constraint를 포함한 threshold release receipt"],
    reuses: [{ label: "Probability expectation", href: "/ai/math-probability-expectation-variance" }],
    evidence: [{ kind: "primary-source", rule: "Cost-sensitive rule은 posterior와 cost matrix를 명시할 수 있는 decision setting으로 제한한다." }, { kind: "standard", rule: "Cost·capacity·threshold·alert volume·rollback을 함께 기록한다." }],
  },
  "imbalanced-classification-evaluation": {
    title: "불균형 분류 평가 글이 소유하는 범위",
    owns: ["Threshold별 TP·FP·FN·TN ledger", "Prevalence-sensitive precision·recall과 probability calibration report"],
    reuses: [{ label: "Class prevalence", href: "/ai/imbalanced-data#prevalence-baseline" }],
    evidence: [{ kind: "primary-source", rule: "PR/ROC와 calibration claim은 각 논문의 고정 dataset·distribution 조건으로 제한한다." }, { kind: "standard", rule: "Evaluation unit·window·threshold·prevalence·slice support를 함께 기록한다." }],
  },
  "data-augmentation": {
    title: "Data augmentation 기초 글이 소유하는 범위",
    owns: [
      "Augmentation distribution·target transform·label-preservation의 data contract",
      "Random transform expectation을 포함한 augmented empirical risk",
    ],
    reuses: [
      {
        label: "Train·validation·test와 generalization",
        href: "/ai/train-validation-test",
      },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "RandAugment claim은 논문의 dataset·model·operation·target 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Transform·parameter range·probability·target map·split·seed를 재현 가능한 pair contract로 기록한다.",
      },
    ],
  },
  "image-augmentation-transforms": {
    title: "Image augmentation transform 글이 소유하는 범위",
    owns: ["Affine annotation과 clip 뒤 visibility rule", "Photometric label boundary와 deterministic normalization"],
    reuses: [{ label: "Image tensor와 spatial geometry", href: "/ai/cnn" }, { label: "Augmentation target map", href: "/ai/data-augmentation#target-map" }],
    evidence: [{ kind: "primary-source", rule: "Albumentations claim은 논문 version의 API·target type·benchmark 범위로 제한한다." }, { kind: "standard", rule: "Coordinate convention·A·t·visibility threshold·color range·input unit·normalization revision을 기록한다." }],
  },
  "mixup-cutmix": {
    title: "Sample mixing 글이 소유하는 범위",
    owns: ["Mixup convex input·target interpolation", "CutMix visible-area target", "Mosaic structured annotation composition"],
    reuses: [{ label: "Soft-target cross-entropy", href: "/ai/cross-entropy" }, { label: "Target map 기초", href: "/ai/data-augmentation#target-map" }],
    evidence: [{ kind: "primary-source", rule: "Mixup·CutMix claim은 논문의 tensor space·area approximation·dataset 조건으로 제한한다." }, { kind: "standard", rule: "Source IDs·λ·mask·tile map·target mass·clip/filter result를 저장한다." }],
  },
  "tabular-data-synthesis": {
    title: "Tabular data synthesis 글이 소유하는 범위",
    owns: ["Schema·relation·entity·time constraint ledger", "Training-fold-only fitting과 utility·privacy gate"],
    reuses: [{ label: "Train·validation·test", href: "/ai/train-validation-test" }, { label: "Class imbalance와 threshold", href: "/ai/imbalanced-data" }],
    evidence: [{ kind: "primary-source", rule: "SMOTE·CTGAN claim은 각 논문의 feature geometry·schema·dataset·evaluation 범위로 제한한다." }, { kind: "standard", rule: "Schema·constraint ledger·split digest·source lineage·utility·privacy metric을 기록한다." }],
  },
  "augmentation-evaluation": {
    title: "Augmentation evaluation 글이 소유하는 범위",
    owns: ["Versioned policy artifact와 clean·robustness 평가 분리", "TTA inverse mapping과 paired release·rollback gate"],
    reuses: [{ label: "Augmentation objective", href: "/ai/data-augmentation#objective" }, { label: "Image target geometry", href: "/ai/image-augmentation-transforms#visibility" }],
    evidence: [{ kind: "primary-source", rule: "AugMix claim은 논문의 operation set·corruption benchmark·architecture 범위로 제한한다." }, { kind: "standard", rule: "Policy revision·clean/shift fixture·inverse map·paired seeds·latency·rollback을 기록한다." }],
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
        label: "확률분포",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "기댓값", href: "/ai/math-random-variables-expectation" },
      { label: "표본평균", href: "/ai/math-variance-sampling" },
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
    title: "Autoencoder foundation 글이 소유하는 범위",
    owns: [
      "Deterministic encoder–latent–decoder 계산 계약과 reconstruction objective",
      "Undercomplete bottleneck의 coordinate 경계와 bit·semantic 오해",
      "Identity-like reconstruction failure와 held-out representation 평가 분리",
    ],
    reuses: [
      {
        label: "신경망 학습 loop와 representation",
        href: "/ai/supervised-learning-loop",
      },
      {
        label: "Chain rule·backpropagation",
        href: "/ai/backprop-optimization",
      },
      { label: "Likelihood와 reconstruction loss", href: "/ai/cross-entropy" },
      { label: "Linear AE–PCA 정리", href: "/ai/linear-autoencoder-pca" },
      { label: "Denoising·masked objective", href: "/ai/denoising-masked-autoencoders" },
      { label: "Sparse dictionary 평가", href: "/ai/sparse-autoencoder" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Deep AE claim은 논문의 architecture·objective·dataset·evaluation 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Input·target·latent dimension·loss reduction·capacity·held-out reconstruction·downstream metric을 재현 가능한 계약으로 기록한다.",
      },
    ],
  },
  "linear-autoencoder-pca": {
    title: "Linear autoencoder–PCA 정리 글이 소유하는 범위",
    owns: ["Centering·linear map·rank-k·squared-error 전제", "Eckart–Young을 통한 principal subspace equivalence", "Latent basis의 rotation·scale 비식별성과 nonlinear 반례"],
    reuses: [
      { label: "Autoencoder reconstruction 계약", href: "/ai/autoencoder" },
      { label: "Matrix·rank·SVD·Eckart–Young", href: "/ai/math-matrices-svd" },
    ],
    evidence: [
      { kind: "primary-source", rule: "PCA equivalence는 Baldi–Hornik의 linear auto-associative quadratic-error 조건에만 귀속한다." },
      { kind: "project-measurement", rule: "Numeric 검증은 centered fixture·rank k·SVD baseline·subspace angle·multiple seeds를 기록한다." },
    ],
  },
  "denoising-masked-autoencoders": {
    title: "Denoising·masked autoencoder 글이 소유하는 범위",
    owns: ["Clean target과 corruption distribution의 분리", "Visible·masked patch와 asymmetric encoder–decoder 계산", "Corruption·mask ratio·target region의 선택 경계"],
    reuses: [
      { label: "Deterministic autoencoder 계약", href: "/ai/autoencoder" },
      { label: "Sparse activation 제약", href: "/ai/sparse-autoencoder" },
      { label: "확률적 latent model", href: "/ai/vae" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Denoising과 MAE 결과는 각 논문의 corruption·masking·architecture·dataset·transfer protocol로 제한한다." },
      { kind: "project-measurement", rule: "Candidate는 corruption·mask sampler·seed·encoder FLOPs·held-out reconstruction·downstream transfer를 paired 비교한다." },
    ],
  },
  "reconstruction-anomaly-detection": {
    title: "Reconstruction anomaly detection 글이 소유하는 범위",
    owns: ["Sample별 reconstruction score와 feature reduction", "Validation cost 기반 threshold calibration", "Capacity failure·missing normal mode·score drift 운영 gate"],
    reuses: [
      { label: "Autoencoder reconstruction objective", href: "/ai/autoencoder#reconstruction" },
      { label: "Train·validation·test split", href: "/ai/train-validation-test-split" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Reconstruction anomaly 결과는 논문의 dataset·feature·architecture·threshold protocol 범위로 제한한다." },
      { kind: "project-measurement", rule: "Checkpoint·scaler·score reduction·validation window·threshold·precision/recall·false alarms/day·drift를 한 receipt로 기록한다." },
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
        label: "Probability",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "Expectation", href: "/ai/math-random-variables-expectation" },
      { label: "Variance", href: "/ai/math-variance-sampling" },
      { label: "Likelihood·entropy·KL divergence", href: "/ai/cross-entropy" },
      { label: "Latent diffusion과 CFG", href: "/ai/latent-diffusion-guidance" },
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
  "gan": {
    "title": "GAN foundation 글이 소유하는 범위",
    "owns": [
      "Latent prior를 generator로 보낸 implicit sample distribution",
      "Ideal discriminator density-ratio의 전제와 finite D 경계",
      "Non-saturating generator signal과 sampling·density·inverse 구분"
    ],
    "reuses": [
      {
        "label": "생성 모델 family 지도",
        "href": "/ai/generative-theory"
      },
      {
        "label": "Probability",
        "href": "/ai/math-probability-expectation-variance"
      },
      {
        "label": "Expectation",
        "href": "/ai/math-random-variables-expectation"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "Original GAN의 optimal-D·equilibrium claim은 arbitrary capacity와 ideal optimization 전제로 제한한다."
      },
      {
        "kind": "standard",
        "rule": "Latent·generated tensor shape와 sampling·likelihood·inverse 제공 여부를 분리 기록한다."
      }
    ]
  },
  "gan-training-dynamics": {
    "title": "GAN training dynamics 글이 소유하는 범위",
    "owns": [
      "D/G alternating step·optimizer·detach 경계",
      "Discriminator data-space signal의 generator parameter pullback",
      "Bilinear rotation·TTUR local convergence 전제",
      "Mode collapse의 quality·coverage·dynamics 진단"
    ],
    "reuses": [
      {
        "label": "GAN generator·objective",
        "href": "/ai/gan"
      },
      {
        "label": "Chain rule·VJP",
        "href": "/ai/backprop-optimization"
      },
      {
        "label": "Optimizer update",
        "href": "/ai/optimizers"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "TTUR claim은 감소 step-size·noise·boundedness·local stability 전제로 제한한다."
      },
      {
        "kind": "standard",
        "rule": "D/G loss·update ratio·detach 위치·mode count·sample budget을 같은 training receipt에 기록한다."
      }
    ]
  },
  "gan-wasserstein-critics": {
    "title": "Wasserstein critic 글이 소유하는 범위",
    "owns": [
      "Lipschitz function constraint와 critic score scale",
      "Kantorovich–Rubinstein dual의 transport interpretation",
      "WGAN-GP sampled input-gradient penalty",
      "Spectral normalization의 layer operator-norm 경계"
    ],
    "reuses": [
      {
        "label": "GAN training failure",
        "href": "/ai/gan-training-dynamics"
      },
      {
        "label": "Expectation",
        "href": "/ai/math-random-variables-expectation"
      },
      {
        "label": "Matrix·singular value",
        "href": "/ai/math-matrices-svd"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "WGAN·GP·SN claim은 각 논문의 function class·sampling path·operator approximation으로 제한한다."
      },
      {
        "kind": "standard",
        "rule": "Critic output semantics·constraint 위치·λ·power iteration·extra backward 비용을 기록한다."
      }
    ]
  },
  "gan-conditional-evaluation": {
    "title": "Conditional GAN 평가 글이 소유하는 범위",
    "owns": [
      "Condition을 G와 D 양쪽에 연결한 p(x|c) game",
      "Fixed feature mean·covariance의 FID protocol",
      "Generative precision과 target coverage recall의 분리",
      "Condition correctness·diversity·latency를 포함한 evaluation contract"
    ],
    "reuses": [
      {
        "label": "GAN sample distribution",
        "href": "/ai/gan"
      },
      {
        "label": "Mode collapse",
        "href": "/ai/gan-training-dynamics"
      },
      {
        "label": "생성 모델 공통 평가 경계",
        "href": "/ai/generative-theory"
      }
    ],
    "evidence": [
      {
        "kind": "primary-source",
        "rule": "Conditional GAN·FID·precision/recall claim은 각 representation·sample count·dataset 조건으로 제한한다."
      },
      {
        "kind": "standard",
        "rule": "Feature extractor·resize·reference split·seed·condition distribution·hardware를 고정한다."
      }
    ]
  },
  "diffusion-models": {
    title: "Discrete diffusion 기초 글이 소유하는 범위",
    owns: [
      "Training pair 생성과 iterative sampling loop의 경계",
      "Gaussian forward noising·cumulative schedule·임의 timestep sampling",
      "Noise·x0·v·score prediction target과 backbone tensor interface",
      "Gaussian conditional noise–score identity와 marginal score 경계",
    ],
    reuses: [
      {
        label: "생성 모델 family의 공통 비교 지도",
        href: "/ai/generative-theory",
      },
      {
        label: "Probability",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "Expectation", href: "/ai/math-random-variables-expectation" },
      { label: "Variance", href: "/ai/math-variance-sampling" },
      { label: "CNN·receptive field", href: "/ai/cnn" },
      { label: "Attention·cross-attention", href: "/ai/attention-theory" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "DDPM·U-Net claim은 각 논문의 corruption·target·architecture·dataset 조건으로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Prediction target·noise schedule·backbone shape와 sampler steps·NFE를 분리해 기록한다.",
      },
    ],
  },
  "diffusion-continuous-time": {
    title: "Continuous diffusion 글이 소유하는 범위",
    owns: [
      "Reverse-time SDE의 score correction과 stochastic path",
      "Probability-flow ODE의 same-marginal·different-path 경계",
      "Conditional flow-matching path·coupling·velocity objective",
      "Learned-field error·solver discretization·NFE·wall-clock ledger",
    ],
    reuses: [
      { label: "Discrete diffusion과 noise–score identity", href: "/ai/diffusion-models" },
      { label: "ODE·SDE와 numerical solver", href: "/ai/math-differential-equations-numerical-solvers" },
      { label: "Score function field", href: "/ai/score-based-modeling" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Score-SDE·flow-matching claim은 각 theorem의 regularity·path·coupling·experiment 범위로 제한한다." },
      { kind: "standard", rule: "Field checkpoint·time grid·solver·precision·NFE·wall-clock을 하나의 versioned sampler receipt로 기록한다." },
    ],
  },
  "latent-diffusion-guidance": {
    title: "Latent diffusion·CFG 글이 소유하는 범위",
    owns: [
      "Pixel↔latent lossy bottleneck과 reconstruction ceiling",
      "Autoencoder·conditioner·denoiser·sampler·decoder component contract",
      "Classifier-free guidance의 conditional direction과 compute trade-off",
      "Reconstruction·quality·coverage·condition·latency release gate",
    ],
    reuses: [
      { label: "Discrete diffusion target와 backbone", href: "/ai/diffusion-models" },
      { label: "VAE·latent representation", href: "/ai/vae" },
      { label: "생성 모델 평가 경계", href: "/ai/generative-theory" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Latent diffusion·CFG claim은 autoencoder·condition dropout·dataset·metric 조건으로 제한한다." },
      { kind: "standard", rule: "Component revision·latent shape·scale·target·sampler·guidance·precision·evaluator를 release receipt에 함께 기록한다." },
    ],
  },
  "visual-representation-tokenizers": {
    title: "Visual representation·tokenizer 글이 소유하는 범위",
    owns: [
      "Reconstruction latent와 semantic visual feature의 objective·consumer 경계",
      "Spatial compression·channel payload·decoder reconstruction ceiling 장부",
      "World-state representation으로 넘어가기 위한 motion·action-sensitivity·object-permanence gate",
    ],
    reuses: [
      { label: "Latent diffusion bottleneck", href: "/ai/latent-diffusion-guidance#pipeline" },
      { label: "Representation objective bias", href: "/ai/representation-learning" },
    ],
    evidence: [
      { kind: "primary-source", rule: "VAE·RAE claim은 해당 encoder·decoder·dataset·downstream consumer 조건으로 제한한다." },
      { kind: "standard", rule: "Latent shape·compression·reconstruction·semantic·action-conditioned metric을 분리 기록한다." },
      { kind: "project-claim", rule: "RAE는 2025년 preprint로 표시하고 modern image stack의 확정 표준이나 VAE의 보편 대체재로 표현하지 않는다." },
    ],
  },
  "diffusion-transformer-architecture": {
    title: "Diffusion Transformer architecture 글이 소유하는 범위",
    owns: [
      "Latent grid를 patch token sequence로 바꾸는 shape·attention-cost 계산",
      "Time-conditioned normalization·residual gate를 포함한 한 DiT block의 tensor contract",
      "Single·dual·multimodal stream의 parameter sharing과 information-exchange 경계",
    ],
    reuses: [
      { label: "Diffusion denoiser target", href: "/ai/diffusion-models#prediction-targets" },
      { label: "Latent component pipeline", href: "/ai/latent-diffusion-guidance#pipeline" },
      { label: "Self-attention", href: "/ai/attention-theory#self-attention" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DiT·MMDiT 구조와 scaling claim은 원 논문의 model·data·compute·evaluation 조건으로 제한한다." },
      { kind: "project-claim", rule: "Krea 2 구성과 ablation은 제작사 technical report의 자기보고 범위로만 표현한다." },
      { kind: "standard", rule: "Latent shape·patch size·token count·stream layout·prediction target·NFE를 함께 기록한다." },
    ],
  },
  "modern-image-model-stack": {
    title: "Modern image model stack 글이 소유하는 범위",
    owns: [
      "Prompt expander·text/VLM encoder·autoencoder·DiT·solver·decoder·post-training의 end-to-end component map",
      "Checkpoint·latent scale·condition dimension·prediction target·scheduler의 compatibility contract",
      "Image generator에서 action-conditioned temporal world model로 넘어갈 때 추가되는 state·time·action·closed-loop gate",
    ],
    reuses: [
      { label: "Visual representation objective", href: "/ai/visual-representation-tokenizers" },
      { label: "DiT block과 multimodal stream", href: "/ai/diffusion-transformer-architecture" },
      { label: "Latent diffusion·CFG", href: "/ai/latent-diffusion-guidance" },
    ],
    evidence: [
      { kind: "primary-source", rule: "공통 stack과 특정 제품 구성을 구분하고 architecture claim은 원 논문·공식 technical report에 귀속한다." },
      { kind: "project-claim", rule: "Krea 2의 realism·data·caption·post-training 설명은 제작사 자기보고이며 다른 model family의 보편 recipe로 확대하지 않는다." },
      { kind: "standard", rule: "Component revision·shape·scale·prompt transform·sampler·precision·evaluator를 하나의 release receipt로 기록한다." },
    ],
  },
  "diffusion-language-models": {
    title: "Diffusion Language Model 글이 소유하는 범위",
    owns: [
      "Absorbing MASK forward process와 weighted masked-token objective",
      "Parallel unmasking·confidence remasking reverse sampler",
      "Autoregressive·full diffusion·block diffusion의 factorization·KV cache·latency 경계",
      "Diffusion LLM을 곧바로 world model·planning model로 부르지 않는 transition gate",
    ],
    reuses: [
      { label: "Diffusion training·sampling contract", href: "/ai/diffusion-models" },
      { label: "Autoregressive factorization", href: "/ai/autoregressive-language-model" },
      { label: "Modern image diffusion stack", href: "/ai/modern-image-model-stack" },
    ],
    evidence: [
      { kind: "primary-source", rule: "MDLM·LLaDA·Block Diffusion 결과는 각 objective·initialization·data·sampler·evaluation 범위로 분리한다." },
      { kind: "project-claim", rule: "Dream 등 preprint의 benchmark를 diffusion language model 전체나 robot planning 성능으로 일반화하지 않는다." },
      { kind: "standard", rule: "Output length·sampling steps·block size·forward calls·KV memory·quality·p50/p95 latency를 같은 receipt에 기록한다." },
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
        href: "/ai/llm-serving-capacity",
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
    title: "LLM 하네스 실행 경계 글이 소유하는 범위",
    owns: [
      "Model proposal과 runtime authorization·execution·observation의 책임 분리",
      "Tool schema와 실제 identity·resource capability의 차이",
      "Typed observation과 terminal decision으로 이어지는 최소 feedback loop",
      "Observation·deterministic transform·creative artifact·state mutation의 역할별 권한 경계",
      "Contract→observe→typed artifact→independent check→targeted patch→recheck 교정 loop",
      "모델 교체 시 하네스 불변식과 model-dependent heuristic을 ablation으로 분리하는 방법",
    ],
    reuses: [
      { label: "Run contract와 artifact continuity", href: "/ai/agent-run-contract" },
      { label: "검증층과 effect evaluation", href: "/ai/agent-verification" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Workflow·agent 용어는 Anthropic이 공개한 범위까지만 쓰고 runtime boundary는 구현 계약으로 분리한다.",
      },
      {
        kind: "project-claim",
        rule: "Model의 자연어 주장과 외부 effect receipt를 같은 증거로 취급하지 않는다.",
      },
      {
        kind: "project-measurement",
        rule: "Office Secretary 수치는 2026-08-21~25 frozen fixture와 기록된 Qwen endpoint·runtime 범위에만 귀속하며 model size의 보편 우위로 일반화하지 않는다.",
      },
    ],
  },
  "agent-run-contract": {
    title: "Agent run contract 글이 소유하는 범위",
    owns: ["Objective·acceptance·context·capability·artifact·verifier·recovery의 run admission 계약", "계층적 context discovery와 runtime capability 분리", "Versioned artifact·checksum·receipt 기반 session continuity와 recovery"],
    reuses: [{ label: "Model과 runtime의 최소 경계", href: "/ai/llm-harness" }, { label: "Plan·replanning·reflection", href: "/ai/agent-plan-replanning" }],
    evidence: [{ kind: "project-claim", rule: "자연어 field가 있다는 사실과 runtime이 owner·identity·version을 강제하는 것을 구분한다." }],
  },
  "agent-verification": {
    title: "Agent verification 글이 소유하는 범위",
    owns: ["Deterministic check·environment oracle·rubric judge·human review의 검증층", "Artifact·trajectory·effect·budget의 독립 acceptance gate", "Observable production trace의 regression fixture·judge calibration·release"],
    reuses: [{ label: "Run contract의 verifier field", href: "/ai/agent-run-contract" }],
    evidence: [{ kind: "project-measurement", rule: "Judge score는 deterministic invariant나 external effect receipt를 대체하지 않는다." }],
  },
  "harness-failure-ablation": {
    title: "Harness failure ablation 글이 소유하는 범위",
    owns: ["Context·schema·capability·verifier failure layer 분류", "같은 fixture에서 한 장치만 바꾸는 paired ablation", "Target recovery와 기존 success regression을 결합한 release gate"],
    reuses: [{ label: "Agent verification fixture", href: "/ai/agent-verification" }],
    evidence: [{ kind: "primary-source", rule: "Component 기여 주장은 Anthropic이 공개한 장기 app-building ablation 범위를 넘겨 일반화하지 않는다." }],
  },
  "agent-control-boundaries": {
    title: "Agent control boundary 글이 소유하는 범위",
    owns: ["경로 불확실성에 따른 workflow·agent 선택", "Side-effect 위험에 따른 deterministic checkpoint", "한 run의 action loop와 여러 run 기반 harness 개선 loop의 주기·권한 분리"],
    reuses: [{ label: "하네스 runtime boundary", href: "/ai/llm-harness" }, { label: "Failure ablation", href: "/ai/harness-failure-ablation" }],
    evidence: [{ kind: "primary-source", rule: "Workflow·agent 선택과 loop vocabulary는 각 공개 문서 범위로 한정하고 표준 성숙도 계층으로 표현하지 않는다." }],
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
        href: "/ai/agent-extension-boundaries",
      },
      {
        label: "Context selection과 progressive loading",
        href: "/ai/context-engineering",
      },
      {
        label: "Runtime capability와 approval 계약",
        href: "/ai/agent-run-contract#overview",
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
    title: "Context state 기초 글이 소유하는 범위",
    owns: [
      "Model weight·external store·candidate·이번 generation token state의 구분",
      "Select·inject·compact·isolate curation lifecycle의 공통 흐름",
    ],
    reuses: [
      { label: "Instruction·data·runtime 권한 경계", href: "/ai/context-instruction-boundaries" },
      { label: "Fragment provenance와 freshness", href: "/ai/context-provenance-freshness" },
      { label: "Memory 수명과 compaction fidelity", href: "/ai/agent-memory-lifecycle" },
      { label: "Token budget·position·cache", href: "/ai/context-window-optimization" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Anthropic context engineering의 curation pattern은 공개된 제품 경험과 시점 범위로 제한하고 보편 정량 법칙으로 확대하지 않는다.",
      },
    ],
  },
  "context-instruction-boundaries": {
    title: "Instruction·data·runtime 경계 글이 소유하는 범위",
    owns: ["Instruction·untrusted data·runtime enforcement의 책임 분리", "Schema·authorization·policy gate와 effect receipt release test"],
    reuses: [{ label: "현재 generation의 context state", href: "/ai/context-engineering" }, { label: "하네스 capability와 verifier", href: "/ai/llm-harness" }],
    evidence: [{ kind: "standard", rule: "OWASP guidance를 application threat model과 runtime capability에 맞게 적용하며 완전한 injection 방어로 주장하지 않는다." }],
  },
  "context-provenance-freshness": {
    title: "Context provenance 글이 소유하는 범위",
    owns: ["Retrieved fragment의 source·revision·validity·ACL·derivation receipt", "Canonical source와 version rule에 따른 stale conflict 해결"],
    reuses: [{ label: "RAG indexing·retrieval·reranking 구현", href: "/ai/rag-pipeline" }, { label: "Context selection lifecycle", href: "/ai/context-engineering#curation" }],
    evidence: [{ kind: "standard", rule: "W3C PROV-O는 provenance 표현 model로만 재사용하며 truth·relevance·ACL 판정기로 확대하지 않는다." }],
  },
  "agent-memory-lifecycle": {
    title: "Agent memory lifecycle 글이 소유하는 범위",
    owns: ["Working state·long-term memory·artifact·procedure의 수명·source·delete 경계", "Compaction fidelity schema와 fresh-context resume replay"],
    reuses: [{ label: "Fragment provenance와 freshness", href: "/ai/context-provenance-freshness" }, { label: "Claw compaction 구현", href: "/ai/claw-compaction" }],
    evidence: [{ kind: "primary-source", rule: "MemGPT·Anthropic context management 결과는 각 model·task·product 조건 안에서만 해석한다." }],
  },
  "context-window-optimization": {
    title: "Context window 최적화 글이 소유하는 범위",
    owns: ["Output reserve를 포함한 source별 serialized token ledger", "Evidence position utilization 평가와 stable-prefix cache invalidation"],
    reuses: [{ label: "Context curation lifecycle", href: "/ai/context-engineering#curation" }, { label: "Compaction fidelity", href: "/ai/agent-memory-lifecycle#compaction" }],
    evidence: [{ kind: "primary-source", rule: "Lost in the Middle의 위치 민감도는 논문의 model·task·context 조건으로 제한하고 고정된 U자 법칙으로 일반화하지 않는다." }],
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
      { label: "대조 학습 pair 의미", href: "/ai/contrastive-learning" },
      { label: "Hard-negative mining", href: "/ai/triplet-metric-learning#mining" },
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
        href: "/gpu/gpu-interconnects",
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
    title: "서버 network workload·Ethernet fabric 정본이 소유하는 범위",
    owns: [
      "Workload traffic matrix와 line rate·payload goodput 측정 경계",
      "Ethernet link compatibility·leaf-spine oversubscription·failure state",
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
        rule: "Ethernet link·PHY·media·fabric 정의는 IEEE 802.3과 장비의 qualified configuration을 함께 기준으로 한다.",
      },
      {
        kind: "standard",
        rule: "Line rate와 payload goodput은 단위·방향·flow·completion boundary를 함께 기록해 분리한다.",
      },
    ],
  },
  "gpu-interconnects": {
    title: "GPU PCIe·NVLink device path 글이 소유하는 범위",
    owns: ["PCIe lane raw-rate와 transaction payload·small-transfer latency 경계", "GPU·NIC pair의 switch·root complex·NUMA·ACS/IOMMU path", "NVLink/NVSwitch node-local 범위와 node-external HCA 경계"],
    reuses: [
      { label: "Bit·byte 단위 변환", href: "/ai/text-unicode-encoding#bits-bytes" },
      { label: "GPU memory hierarchy", href: "/gpu/gpu-architecture" },
      { label: "Network workload와 goodput", href: "/gpu/hw-network" },
    ],
    evidence: [
      { kind: "primary-source", rule: "PCIe·NVLink generation·width·aggregate rate는 PCI-SIG와 target NVIDIA system 문서에 귀속한다." },
      { kind: "project-measurement", rule: "실제 peer path는 inventory·P2P capability·pair별 bandwidth/latency로 확인하고 사양표로 대체하지 않는다." },
    ],
  },
  "rdma-roce": {
    title: "RDMA·RoCE·GPUDirect data path 글이 소유하는 범위",
    owns: ["Host setup·NIC DMA·completion으로 나눈 RDMA control/data path", "Registered memory range·key·access·lifetime capability", "RoCE v2 netdev·GID·QP route와 GPU–HCA direct DMA topology"],
    reuses: [
      { label: "Server network traffic와 Ethernet fabric", href: "/gpu/hw-network" },
      { label: "GPU PCIe topology", href: "/gpu/gpu-interconnects" },
      { label: "CUDA stream·multi-GPU ownership", href: "/gpu/cuda-sync-streams" },
    ],
    evidence: [
      { kind: "primary-source", rule: "RoCE GID·QP와 GPUDirect requirement는 pinned driver·firmware·CUDA 문서 범위로 제한한다." },
      { kind: "project-measurement", rule: "Registration cache·GDR 이득은 range lifetime·GPU-HCA pair·message bucket별 control과 비교한다." },
    ],
  },
  "gpu-collective-network": {
    title: "GPU collective network와 NCCL measurement 글이 소유하는 범위",
    owns: ["Rank·operation·count·datatype·call-order collective contract", "Node-local과 node-external 합성 path", "NCCL operation time·algbw·busbw와 hardware counter 경계"],
    reuses: [
      { label: "GPU PCIe·NVLink topology", href: "/gpu/gpu-interconnects" },
      { label: "RDMA·RoCE·GPUDirect path", href: "/gpu/rdma-roce" },
      { label: "Network workload·goodput", href: "/gpu/hw-network" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Collective semantics와 metric formula는 NCCL·nccl-tests·IBTA 공식 자료의 versioned 범위로 제한한다." },
      { kind: "project-measurement", rule: "algbw·busbw를 wire payload로 간주하지 않고 rank placement·algorithm·counter·failure recovery와 함께 측정한다." },
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
        href: "/gpu/rdma-roce",
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
    title: "Container 보안 기초 글이 소유하는 범위",
    owns: [
      "Process·namespace·cgroup의 서로 다른 resource boundary",
      "Signal에서 impact까지 열린 attack path를 추적하는 방법",
      "Container root와 host root의 privilege 경계",
    ],
    reuses: [
      {
        label: "Claude Code concrete call 권한 판정",
        href: "/ai/claude-code-permissions",
      },
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
  "sandbox-runtime-isolation": {
    title: "Sandbox runtime 격리 글이 소유하는 범위",
    owns: [
      "Application에서 kernel로 가는 system-call 처리 경로",
      "Seccomp filter·gVisor application kernel·Kata guest kernel의 차이",
      "Isolation·compatibility·startup·memory acceptance gate",
    ],
    reuses: [
      { label: "Container process·namespace·cgroup 기초", href: "/ai/agent-sandbox-security" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Runtime boundary와 지원 범위는 gVisor·Kata 공식 architecture 문서로 제한한다.",
      },
      {
        kind: "project-measurement",
        rule: "호환성·기동·memory 결과는 image·kernel·runtime revision이 있는 fixture에 귀속한다.",
      },
    ],
  },
  "sandbox-gpu-isolation": {
    title: "GPU sandbox 격리 글이 소유하는 범위",
    owns: [
      "GPU device request가 추가하는 driver·DMA·reset 경계",
      "nvproxy ioctl mediation과 VFIO·IOMMU device assignment의 차이",
      "GPU·driver·runtime·VMM·lifecycle generation release",
    ],
    reuses: [
      { label: "Sandbox runtime 처리 경로", href: "/ai/sandbox-runtime-isolation" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "GPU support는 gVisor·Kata 공식 support matrix와 deployment 문서 범위로 제한한다.",
      },
      {
        kind: "project-measurement",
        rule: "기능·isolation·reset 결과는 GPU·driver·runtime·operator generation에 귀속한다.",
      },
    ],
  },
  "sandbox-deployment-controls": {
    title: "Sandbox Kubernetes 배포 통제 글이 소유하는 범위",
    owns: [
      "ServiceAccount token projection과 RBAC authorization의 분리",
      "Egress allowlist의 실제 enforcement와 writable surface lifetime",
      "Identity·network·runtime·storage·lifecycle workload control matrix",
    ],
    reuses: [
      { label: "Container attack-path 기초", href: "/ai/agent-sandbox-security" },
      { label: "Runtime isolation 선택", href: "/ai/sandbox-runtime-isolation" },
      { label: "GPU device isolation", href: "/ai/sandbox-gpu-isolation" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Identity·NetworkPolicy·Pod Security semantics는 Kubernetes·Cilium 공식 문서로 제한한다.",
      },
      {
        kind: "project-measurement",
        rule: "실제 차단 여부는 deployment identity·CNI·flow log·negative test receipt에 귀속한다.",
      },
    ],
  },
  "prompt-engineering": {
    title: "Prompt request contract 글이 소유하는 범위",
    owns: [
      "Objective·evidence·constraints·output·abstention·completion criteria의 request contract",
      "Instruction과 untrusted evidence의 역할 경계",
      "Completion criteria와 validator 책임 연결",
      "Prompt·model·template·decoding regression loop와 portability gate",
    ],
    reuses: [
      {
        label: "System instruction·untrusted data·runtime enforcement",
        href: "/ai/context-instruction-boundaries#overview",
      },
      {
        label: "CFG·token mask와 syntax/semantic validity",
        href: "/ai/prompt-structured-output",
      },
      {
        label: "Reasoning path와 verifier",
        href: "/ai/prompt-reasoning",
      },
      { label: "Few-shot demonstration", href: "/ai/prompt-few-shot" },
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
  "prompt-reasoning": {
    title: "Reasoning prompting 글이 소유하는 범위",
    owns: [
      "Chain-of-thought elicitation과 task 선택 경계",
      "출력 reasoning과 causal faithfulness의 해석 경계",
      "Self-consistency answer marginalization과 tie·correlated-error 비용",
      "계산·검색·tool action별 external verifier 선택",
    ],
    reuses: [
      { label: "Prompt request contract", href: "/ai/prompt-engineering" },
      { label: "Few-shot worked demonstration", href: "/ai/prompt-few-shot" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "CoT·self-consistency·faithfulness claim은 각 논문의 model·task·prompt·decoding과 intervention 범위로 제한한다.",
      },
    ],
  },
  "prompt-few-shot": {
    title: "Few-shot prompting 글이 소유하는 범위",
    owns: [
      "Weight update 없는 in-context demonstration의 형태",
      "Zero-shot·few-shot·fine-tuning 선택 경계",
      "Demonstration selection·order·label prior 민감도",
      "Request마다 반복되는 example token·prefill 비용 경계",
    ],
    reuses: [
      { label: "Prompt request contract", href: "/ai/prompt-engineering" },
      { label: "Fine-tuning과 response loss", href: "/ai/supervised-fine-tuning" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Few-shot와 calibration 결과는 해당 model·classification task·example·ordering 조건을 벗어나 일반화하지 않는다.",
      },
    ],
  },
  "prompt-structured-output": {
    title: "Structured output 글이 소유하는 범위",
    owns: [
      "Consumer field·type·null·error를 정의하는 output contract",
      "Parse→schema→domain validation ladder",
      "Prompt-only·constrained decoding·post-hoc repair 선택 경계",
      "Bounded retry·typed fallback·release measurement",
    ],
    reuses: [
      { label: "Prompt request contract", href: "/ai/prompt-engineering" },
      { label: "CFG·token mask 구현", href: "/ai/grammar-constrained-generation" },
      { label: "XML output parsing", href: "/ai/xml-prompting#parsing" },
    ],
    evidence: [
      {
        kind: "standard",
        rule: "Syntax·schema·domain validity를 구분하고 constrained decoding이 실제 ID·권한·사실성까지 보장한다고 표현하지 않는다.",
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
    title: "MCP core 기초 글이 소유하는 범위",
    owns: [
      "MCP 2026-07-28 stateless request·discovery·explicit handle 계약",
      "Host·client·server의 protocol 역할과 process topology의 차이",
      "공통 wire contract와 domain·security 책임의 경계",
    ],
    reuses: [
      {
        label: "Agent의 tool proposal·runtime authorization",
        href: "/ai/agent-loop-foundations#transition",
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
  "mcp-primitives": {
    title: "MCP primitive 글이 소유하는 범위",
    owns: [
      "Tool·Resource·Prompt의 control·identity·lifecycle 구분",
      "Tool input/output schema와 complete·tool error·input required 결과",
      "Deterministic list cache와 call-time authorization의 분리",
    ],
    reuses: [
      { label: "MCP host·client·server와 request envelope", href: "/ai/mcp-protocol" },
      { label: "Agent의 tool proposal과 observation loop", href: "/ai/agent-loop-foundations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Primitive와 result field는 MCP 2026-07-28 Tool·Resource·Prompt 문서의 normative 범위로 제한한다." },
      { kind: "standard", rule: "JSON Schema-valid·domain-valid·authorized·factually correct를 서로 다른 판정으로 유지한다." },
    ],
  },
  "mcp-transports": {
    title: "MCP transport 글이 소유하는 범위",
    owns: [
      "stdio child process·stdin·stdout·stderr의 local lifecycle",
      "Streamable HTTP의 POST·routing header·body consistency·Origin 경계",
      "Request response·cancellation·subscription의 서로 다른 수명",
    ],
    reuses: [
      { label: "MCP stateless request envelope", href: "/ai/mcp-protocol" },
      { label: "MCP Tool 결과와 input-required", href: "/ai/mcp-primitives" },
      { label: "Sandbox·egress·credential 격리", href: "/ai/agent-sandbox-security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Wire와 lifecycle 주장은 MCP 2026-07-28 transport·Streamable HTTP normative 문서에 고정한다." },
      { kind: "standard", rule: "현행 request-scoped SSE와 deprecated legacy HTTP+SSE를 같은 transport로 합치지 않는다." },
    ],
  },
  "mcp-server-operations": {
    title: "MCP production 운영 글이 소유하는 범위",
    owns: [
      "Discovery·model proposal·user consent·server authorization의 trust gate",
      "Operation identity·attempt·effect receipt·status lookup의 retry contract",
      "Core·extension·legacy compatibility와 failure-injection release gate",
    ],
    reuses: [
      { label: "MCP primitive schema와 result", href: "/ai/mcp-primitives" },
      { label: "MCP transport timeout·cancel 경계", href: "/ai/mcp-transports" },
      { label: "Agent runtime authorization", href: "/ai/agent-loop-foundations#transition" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Authorization과 lifecycle은 MCP 2026-07-28 specification·changelog·공식 OAuth profile 범위로 제한한다." },
      { kind: "project-measurement", rule: "Idempotency와 retry 안전성은 duplicate effect·late response·receipt loss fixture 실측으로만 주장한다." },
    ],
  },
  "agent-code-mode": {
    title: "Code Mode 실행 패턴 글이 소유하는 범위",
    owns: [
      "tool call 연속과 sandbox program 실행의 차이",
      "반복·분기·중간 데이터가 context 밖에서 처리될 때의 비용 모델",
      "tool discovery·local reduction과 direct call·agent loop·program 선택 경계",
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
  "code-mode-runtime-contracts": {
    title: "Code Mode runtime 계약 글이 소유하는 범위",
    owns: [
      "Program의 deterministic control flow와 외부 상태 비결정성 경계",
      "요청별 typed tool·resource·account capability binding",
      "Final result의 schema·크기·redaction·provenance disclosure 계약",
      "여러 external write의 partial success·receipt·retry·compensation 경계",
    ],
    reuses: [
      { label: "Code Mode program IR와 local data", href: "/ai/agent-code-mode" },
      { label: "Process·container resource boundary", href: "/ai/agent-sandbox-security" },
      { label: "하네스의 승인·검증 계층", href: "/ai/llm-harness" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Typed program surface의 기능과 authorization·atomicity 보장을 분리해, 각 구현의 공식 문서 범위로만 주장한다.",
      },
    ],
  },
  "grammar-constrained-generation": {
    title: "Formal language 기초 글이 소유하는 범위",
    owns: [
      "Symbol·alphabet·string·language의 최소 정의",
      "Terminal·nonterminal·production derivation의 출발점",
    ],
    reuses: [],
    evidence: [
      {
        kind: "standard",
        rule: "이 글은 formal language의 보편 정의만 소유하고 parser 구현 주장은 뒤 글로 넘긴다.",
      },
    ],
  },
  "cfg-pushdown-automata": {
    title: "CFG와 PDA 글이 소유하는 범위",
    owns: ["Finite-state memory 한계", "Recursive CFG와 PDA stack의 대응", "Depth accept·reject와 구현 경계"],
    reuses: [{ label: "Formal language 기초", href: "/ai/grammar-constrained-generation" }],
    evidence: [{ kind: "standard", rule: "PDA는 계산 모델로 설명하며 특정 parser 제품의 내부 자료구조라고 단정하지 않는다." }],
  },
  "incremental-parsing-tree-sitter": {
    title: "Incremental parsing 글이 소유하는 범위",
    owns: ["Source·CST·edit range의 형태", "Unchanged subtree reuse와 error recovery", "Tree-sitter와 generation matcher의 입출력 경계"],
    reuses: [{ label: "CFG와 stack memory", href: "/ai/cfg-pushdown-automata" }],
    evidence: [{ kind: "primary-source", rule: "Tree-sitter의 기능은 공식 문서에 확인되는 incremental parsing 범위로만 주장한다." }],
  },
  "grammar-tokenizer-decoding": {
    title: "Grammar token mask 글이 소유하는 범위",
    owns: ["Grammar와 tokenizer vocabulary의 compilation", "Allowed-token bitmask와 logit masking", "Matcher accept·EOS·dead-end 경계"],
    reuses: [{ label: "Formal language 기초", href: "/ai/grammar-constrained-generation" }, { label: "CFG와 PDA", href: "/ai/cfg-pushdown-automata" }],
    evidence: [{ kind: "primary-source", rule: "XGrammar의 compile·matcher·mask workflow는 공식 문서 범위로만 주장한다." }],
  },
  "structured-generation-serving": {
    title: "Structured generation serving 글이 소유하는 범위",
    owns: ["Dynamic schema compile cache identity", "Sequence별 matcher state lifetime", "Syntax-valid와 semantic execution policy 경계"],
    reuses: [{ label: "Grammar token masking", href: "/ai/grammar-tokenizer-decoding" }, { label: "Code Mode program 실행", href: "/ai/agent-code-mode" }],
    evidence: [{ kind: "primary-source", rule: "Dynamic schema·cache 성능 주장은 XGrammar 2의 engine·model·workload 범위와 함께 표시한다." }],
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
        href: "/ai/softmax#overview",
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
    title: "Kimi K3 전체 구조 글이 소유하는 범위",
    owns: [
      "Sequence·depth·width를 독립 정보 이동 축으로 분해하는 전체 지도",
      "69 KDA·24 MLA·93 main layer configuration 장부",
      "Configuration·component·통합 scaling·benchmark evidence boundary",
    ],
    reuses: [
      { label: "KDA와 Gated MLA", href: "/ai/kimi-k3-sequence-mixer" },
      { label: "Block Attention Residuals", href: "/ai/kimi-k3-depth-routing" },
      { label: "Stable LatentMoE", href: "/ai/kimi-k3-latent-moe" },
    ],
    evidence: [
      { kind: "primary-source", rule: "공식 report·repository의 versioned configuration을 사용한다." },
      { kind: "project-claim", rule: "약 2.5×는 통합 claim이며 component별 인과로 재분배하지 않는다." },
    ],
  },
  "kimi-k3-sequence-mixer": {
    title: "K3 sequence mixer 글이 소유하는 범위",
    owns: [
      "KDA retain·delta correction·read state",
      "Lower-bounded decay와 cumulative retention 경계",
      "3 KDA+1 Gated MLA schedule·latent cache·NoPE 경계",
    ],
    reuses: [
      { label: "K3 전체 축 지도", href: "/ai/kimi-k3-architecture" },
      { label: "Attention 기본 원리", href: "/ai/attention-theory" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Kimi Linear의 식·실험 조건과 K3의 실제 layer count를 분리한다." },
      { kind: "project-claim", rule: "KV·throughput 수치를 model scale·kernel·hardware 밖으로 일반화하지 않는다." },
    ],
  },
  "kimi-k3-depth-routing": {
    title: "K3 depth routing 글이 소유하는 범위",
    owns: [
      "Layer pseudo-query와 depth key/value weighted read",
      "Full·Block AttnRes source granularity",
      "93 layer·12-layer block·8 block source-state 경계",
    ],
    reuses: [
      { label: "K3 전체 축 지도", href: "/ai/kimi-k3-architecture" },
      { label: "Residual과 normalization", href: "/ai/transformer-architecture#transformer-block" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Attention Residuals의 method·complexity·experiment 범위를 따른다." },
      { kind: "project-claim", rule: "Depth weight를 semantic causality나 total-memory 절감률로 해석하지 않는다." },
    ],
  },
  "kimi-k3-latent-moe": {
    title: "K3 Stable LatentMoE 글이 소유하는 범위",
    owns: [
      "7168→3584→7168 routed width factorization과 shared path",
      "SiTU-GLU coordinate soft cap과 RMSNorm 경계",
      "Quantile Balancing target·next-step bias·histogram approximation",
    ],
    reuses: [
      { label: "K3 전체 축 지도", href: "/ai/kimi-k3-architecture" },
      { label: "MoE router와 system cost", href: "/ai/mixture-of-experts" },
    ],
    evidence: [
      { kind: "primary-source", rule: "K3 report의 Stable LatentMoE 식·configuration을 따른다." },
      { kind: "project-claim", rule: "Width·activation·load 장치를 전체 scaling의 독립 원인으로 과장하지 않는다." },
    ],
  },
  "kv-cache-fundamentals": {
    title: "KV cache 기초 글이 소유하는 범위",
    owns: [
      "MHA·GQA·MQA의 KV head 공유와 token당 KV byte 계산",
      "Autoregressive decode에서 현재 Query와 보존되는 과거 K/V의 역할 경계",
    ],
    reuses: [
      { label: "Attention 기본 원리", href: "/ai/attention-theory" },
      { label: "Bit·byte", href: "/blockchain/bit-byte" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "MHA·MQA·GQA의 공유 구조와 비교 결과는 원 논문의 model·training·decode 조건으로 제한한다.",
      },
    ],
  },
  "hybrid-kv-cache-allocation": {
    title: "Hybrid KV cache allocator 글이 소유하는 범위",
    owns: [
      "Global T와 local min(T,W)의 layer별 KV 보존 길이",
      "Attention visibility와 physical KV block 회수를 분리하는 runtime 계약",
    ],
    reuses: [
      { label: "KV cache byte 기초", href: "/ai/kv-cache-fundamentals" },
      { label: "PagedAttention과 KV block", href: "/ai/vllm-paged-attention" },
    ],
    evidence: [
      { kind: "primary-source", rule: "PagedAttention과 vLLM hybrid allocator의 block·grouping 주장은 pinned 논문과 구현 문서에 귀속한다." },
      { kind: "project-measurement", rule: "Local block 회수 여부는 runtime revision·cache spec·context별 allocated-byte 기울기를 함께 기록한 실행에서만 주장한다." },
    ],
  },
  "llm-serving-capacity": {
    title: "LLM serving capacity 글이 소유하는 범위",
    owns: [
      "Replica memory에서 KV pool과 logical token capacity를 계산하는 예산",
      "Startup log의 token·concurrency 단위를 직접 나눠 검산하는 절차",
      "실제 request 길이·latency·preemption을 사용한 admission 상한",
      "망분리 환경의 artifact·quality·capacity 반입 체크리스트",
    ],
    reuses: [
      { label: "KV cache byte 기초", href: "/ai/kv-cache-fundamentals" },
      { label: "Hybrid KV block 회수", href: "/ai/hybrid-kv-cache-allocation" },
      { label: "모델 VRAM 예산", href: "/ai/model-vram-budgeting" },
      { label: "LLM 서빙 운영 지표", href: "/ai/llm-serving-ops" },
    ],
    evidence: [
      { kind: "primary-source", rule: "모델 shape·context·artifact는 각 공식 model card와 config를 기준으로 한다." },
      { kind: "project-measurement", rule: "97,216·88,824·352,736 token과 5.17×·1.36×·5.38×은 runtime build·TP·cache dtype을 붙인 프로젝트 관측으로만 해석한다." },
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
        href: "/ai/kv-cache-fundamentals",
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
        href: "/ai/kv-cache-fundamentals",
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
        href: "/ai/kv-cache-fundamentals",
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
        label: "확률분포·조건부확률",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "기댓값", href: "/ai/math-random-variables-expectation" },
      {
        label: "KV cache와 serving capacity",
        href: "/ai/llm-serving-capacity#capacity",
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
        href: "/ai/agent-loop-foundations#observation-contract",
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
        href: "/ai/agent-loop-foundations#observation-contract",
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
  "reth-rpc": {
    title: "Reth RPC·Engine endpoint 글이 소유하는 범위",
    owns: [
      "Public RPC transport·namespace·method-cost exposure policy",
      "Block selector를 pinned provider view와 typed availability outcome에 연결하는 조회 경계",
      "Listener·auth·body·concurrency·rate·timeout을 겹치는 middleware budget",
      "RPC request/error/view/auth failure release gate",
    ],
    reuses: [
      { label: "Reth provider consistent snapshot", href: "/blockchain/reth-provider" },
      { label: "Engine API version·status·JWT contract", href: "/blockchain/prysm-engine-api" },
      { label: "Reth payloadId handoff", href: "/blockchain/reth-payload-builder#engine-api" },
    ],
    evidence: [
      { kind: "standard", rule: "JSON-RPC·Engine method·field·error semantics는 pinned execution-apis revision과 active fork에 귀속한다." },
      { kind: "primary-source", rule: "Module·middleware·provider wiring과 default는 pinned Reth SHA·features·runtime config에 귀속한다." },
      { kind: "project-measurement", rule: "Snapshot·auth·quota·timeout·restart parity 뒤 latency와 throughput을 비교한다." },
      { kind: "project-claim", rule: "CORS·JWT·rate limit 하나를 confidentiality·authorization·bounded resource 전체 보장으로 확대하지 않는다." },
    ],
  },
  "reth-exex": {
    title: "Reth Execution Extensions 글이 소유하는 범위",
    owns: [
      "Canonical commit·revert·reorg notification consumer lifecycle",
      "Derived-state transaction·checkpoint·WAL replay와 external-effect idempotency",
      "Finished-height aggregation·bounded backpressure·pruning coordination",
      "Reorg·crash·slow consumer·external ambiguity release gate",
    ],
    reuses: [
      { label: "Reth live-sync·ExEx producer boundary", href: "/blockchain/reth-sync#live-sync" },
      { label: "Reth provider pinned view", href: "/blockchain/reth-provider" },
      { label: "Reth reorg·unwind reconciliation", href: "/blockchain/reth#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Notification·WAL·finished-height claim은 pinned Reth SHA와 ExEx documentation에 귀속한다." },
      { kind: "standard", rule: "Canonical notification과 derived DB/external effect commit을 하나의 exactly-once transaction으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Duplicate·gap·reorg·crash·slow consumer·restart에서 derived state와 receipt parity 뒤 throughput을 비교한다." },
      { kind: "project-claim", rule: "In-process access를 무손실 event·낮은 latency·node failure isolation의 자동 보장으로 일반화하지 않는다." },
    ],
  },
  "reth-mev": {
    title: "Reth local payload·external builder·MEV 경계 글이 소유하는 범위",
    owns: [
      "Local payload와 external PBS bid의 병렬 readiness·fallback 경계",
      "Builder API caller·relay·blinded block·payload delivery lifecycle",
      "Context·signature·fork·value·deadline 기반 bid validation과 proposer selection",
      "Private bundle intake와 proposer Builder API의 trust-surface 분리",
      "No-bid·invalid-bid·non-delivery·deadline release gate",
    ],
    reuses: [
      { label: "Reth local payload build lifecycle", href: "/blockchain/reth-payload-builder" },
      { label: "Engine API payload handoff", href: "/blockchain/prysm-engine-api" },
      { label: "Validator proposal deadline", href: "/blockchain/prysm-block-proposal" },
    ],
    evidence: [
      { kind: "standard", rule: "Builder endpoints·messages·signatures는 pinned builder-specs revision에 귀속한다." },
      { kind: "primary-source", rule: "Relay aggregation·external builder implementation은 pinned mev-boost·rbuilder SHA에 귀속한다." },
      { kind: "project-measurement", rule: "같은 slot·parent·relay schedule에서 validation·selection·delivery·fallback parity 뒤 value와 latency를 비교한다." },
      { kind: "project-claim", rule: "Highest advertised bid를 valid payload·actual payment·neutral relay·on-time delivery 보장으로 확대하지 않는다." },
    ],
  },
  "reth-precompiles": {
    title: "Reth precompile 글이 소유하는 범위",
    owns: [
      "Fork별 precompile address registry와 CALL dispatch",
      "입력별 protocol gas 선계산과 out-of-gas 경계",
      "EIP ABI·오류·출력과 native backend parity",
      "Pinned registry snapshot과 adversarial release gate",
    ],
    reuses: [
      { label: "EVM deterministic execution", href: "/blockchain/evm" },
      { label: "Reth block execution lifecycle", href: "/blockchain/reth-block-execution" },
      { label: "ChainSpec fork activation", href: "/blockchain/reth-chainspec" },
    ],
    evidence: [
      { kind: "standard", rule: "주소·입력·gas·실패·출력은 활성 fork의 EIP와 execution rule에 귀속한다." },
      { kind: "primary-source", rule: "Registry·crate·backend claim은 pinned Reth git SHA와 dependency snapshot에 귀속한다." },
      { kind: "project-measurement", rule: "Backend 후보는 official vector·differential output·gas·panic isolation parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Native 연산이라는 이유로 gas를 wall-clock 비용이나 library safety 보장으로 확대하지 않는다." },
    ],
  },
  "helios-update": {
    title: "Helios light-client update 글이 소유하는 범위",
    owns: [
      "Optimistic·finalized dual-header store와 서로 다른 전진 조건",
      "Network·fork·slot·period·branch·BLS를 묶는 update validation context",
      "Specification tie-break에 따른 best valid update ordering",
      "Finalized evidence에 묶인 sync-committee handoff와 release gate",
    ],
    reuses: [
      { label: "Sync committee membership·aggregate signature", href: "/blockchain/prysm-sync-committee" },
      { label: "BLS aggregate verification", href: "/blockchain/prysm-bls" },
      { label: "SSZ Merkle branch", href: "/blockchain/prysm-ssz" },
      { label: "Weak-subjectivity checkpoint", href: "/blockchain/prysm-finality#weak-subjectivity" },
    ],
    evidence: [
      { kind: "standard", rule: "Update field·validation·selection·processing은 consensus-spec v1.6.1의 활성 fork와 network preset에 귀속한다." },
      { kind: "primary-source", rule: "Store·best update·force update 구현 claim은 Helios 0.11.1 tag의 consensus-core source에 제한한다." },
      { kind: "project-measurement", rule: "Participation·period·branch·domain·competing update·reorg/restart fixture에서 header·committee parity 뒤 polling 성능을 비교한다." },
      { kind: "project-claim", rule: "Force update와 release/rollback receipt는 hardening 경계이며 update verification을 full-state transition과 같다고 하지 않는다." },
    ],
  },
  "helios-state": {
    title: "Helios state proof·cache 글이 소유하는 범위",
    owns: [
      "Checkpoint→execution block→state root→storage root의 proof anchor chain",
      "MPT existence·absence proof와 malformed/truncated proof 구분",
      "Block hash·storage root·code hash별 cache validity key",
      "Proof·RLP·root·reorg·cache release gate",
    ],
    reuses: [
      { label: "MPT secure nibble·node·nested commitment", href: "/blockchain/reth-trie" },
      { label: "Canonical RLP encoding", href: "/blockchain/reth-alloy-primitives#rlp" },
      { label: "Light-client optimistic/finalized header", href: "/blockchain/helios-update" },
    ],
    evidence: [
      { kind: "standard", rule: "eth_getProof envelope은 EIP-1186과 pinned execution-apis schema를 함께 확인하고 MPT·account commitment는 Yellow Paper snapshot에 귀속한다." },
      { kind: "primary-source", rule: "Empty-value handling·proof verification·cache key claim은 Helios 0.11.1 source에 제한한다." },
      { kind: "project-measurement", rule: "Existence/absence·node encoding·wrong root·malformed RLP·reorg fixture에서 value·error·cache identity parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Proof 성공을 current head·finality·provider availability의 보장으로 확대하지 않는다." },
    ],
  },
  "helios-execution": {
    title: "Helios proof-backed execution RPC 글이 소유하는 범위",
    owns: [
      "ProofDB synchronous miss→async proof→same-input replay adapter",
      "Pinned block·state·environment·fork의 proof-backed local execution",
      "Receipt-root log membership과 Bloom candidate filter의 구분",
      "Broadcast acknowledgement·verified inclusion boundary와 execution release gate",
    ],
    reuses: [
      { label: "Account·storage proof와 cache identity", href: "/blockchain/helios-state" },
      { label: "Fork-aware EVM environment", href: "/blockchain/reth-block-execution" },
      { label: "Ethereum JSON-RPC interface", href: "/blockchain/ethereum-architecture" },
    ],
    evidence: [
      { kind: "standard", rule: "RPC field·result·error는 pinned execution-apis, EVM transition은 pinned execution-specs와 active fork에 귀속한다." },
      { kind: "primary-source", rule: "ProofDB replay·gas_used·receipt/log verification·broadcast forwarding claim은 Helios 0.11.1 source에 제한한다." },
      { kind: "project-measurement", rule: "Proof/root/code/receipt mutation·cache miss·reorg·broadcast ambiguity에서 output·root·status parity 뒤 latency·RPC 수를 비교한다." },
      { kind: "project-claim", rule: "Local call을 transaction inclusion으로, Bloom을 membership proof로, provider acknowledgement를 propagation 보장으로 확대하지 않는다." },
    ],
  },
  "reth-trie": {
    title: "Reth Merkle Patricia trie·state-root 글이 소유하는 범위",
    owns: [
      "Secure key의 nibble path와 branch·extension·leaf의 canonical encoding",
      "Account trie 안에 contract storage root를 넣는 nested commitment",
      "Dirty prefix·overlay·clean sibling reuse와 deterministic parallel merge",
      "State-root parity를 먼저 확인하는 trie optimization release gate",
    ],
    reuses: [
      { label: "BundleState 변경·revert journal", href: "/blockchain/reth-provider#bundle-state" },
      { label: "Provider pinned state view", href: "/blockchain/reth-provider" },
      { label: "DB transaction commit boundary", href: "/blockchain/reth-db" },
    ],
    evidence: [
      { kind: "standard", rule: "Node encoding·secure key·state-root semantics는 pinned Yellow Paper와 활성 Ethereum execution specification에 귀속한다." },
      { kind: "primary-source", rule: "Prefix set·cursor·parallel root implementation claim은 Reth v2.2.0 source snapshot에 제한한다." },
      { kind: "project-measurement", rule: "Candidate는 create/delete·storage wipe·shared prefix·inline/hash·reorg fixture에서 sequential oracle과 root·node-set parity를 먼저 통과한다." },
      { kind: "project-claim", rule: "Dirty prefix 수나 worker 수를 실제 DB read·latency·speedup의 보편적 대리값으로 확대하지 않는다." },
    ],
  },
  "reth-pipeline": {
    title: "Reth staged sync·checkpoint 글이 소유하는 범위",
    owns: [
      "Headers→Bodies→Senders→Execution→Merkle dependency order",
      "Stage별 durable checkpoint와 bounded forward progress",
      "Common ancestor까지의 reverse-dependency unwind",
      "Crash/restart receipt와 execution-root recovery release gate",
    ],
    reuses: [
      { label: "Historical·live sync 경계", href: "/blockchain/reth-sync" },
      { label: "Ordered block transition", href: "/blockchain/reth-block-execution" },
      { label: "State-root 계산", href: "/blockchain/reth-trie" },
      { label: "DB atomic commit", href: "/blockchain/reth-db" },
    ],
    evidence: [
      { kind: "standard", rule: "Block·receipt·state-root validity는 pinned Ethereum execution specification과 활성 fork에 귀속한다." },
      { kind: "primary-source", rule: "Stage 이름·checkpoint·execute/unwind seam은 Reth v2.2.0 source snapshot에 제한한다." },
      { kind: "project-measurement", rule: "Missing input·root mismatch·commit 전후 crash·checkpoint corruption·reorg에서 output과 cursor parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "현재 stage 순서·batch size·sync throughput을 모든 release·storage·network의 고정 동작으로 일반화하지 않는다." },
    ],
  },
  "reth-block-execution": {
    title: "Reth EVM block transition 글이 소유하는 범위",
    owns: [
      "Parent state·block·fork를 묶는 authoritative pre-state context",
      "Fork-aware EVM environment와 pre/transaction/post ordered transition",
      "Receipt·gas·logs·receipts root·post-state root의 block postcondition",
      "Execution parity와 rollback을 먼저 확인하는 release gate",
    ],
    reuses: [
      { label: "EVM opcode·gas semantics", href: "/blockchain/evm" },
      { label: "ChainSpec fork activation", href: "/blockchain/reth-chainspec" },
      { label: "Provider overlay·BundleState journal", href: "/blockchain/reth-provider" },
      { label: "State-root calculation", href: "/blockchain/reth-trie" },
    ],
    evidence: [
      { kind: "standard", rule: "Transaction·system operation·receipt·root semantics는 pinned Yellow Paper와 Ethereum execution specification의 활성 fork에 귀속한다." },
      { kind: "primary-source", rule: "Executor·EVM adapter·state-change ownership claim은 Reth v2.2.0 source snapshot에 제한한다." },
      { kind: "project-measurement", rule: "Invalid/revert/halt·create/delete/wipe·fork boundary·root mismatch·reorg를 base/candidate에 주입해 receipt·root·journal parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "로컬 execute 성공을 canonical 채택·durable commit·finality로 확대하지 않는다." },
    ],
  },
  "reth-eip1559": {
    title: "Reth EIP-1559 글이 소유하는 범위",
    owns: [
      "Parent target 기반 next base fee 정수 계산과 변화 bound",
      "Max fee·priority cap·effective tip과 fee eligibility",
      "Base-fee burn·beneficiary tip의 단위별 accounting",
      "ChainSpec parameter와 fork-boundary release gate",
    ],
    reuses: [
      { label: "EVM gas accounting", href: "/blockchain/evm-gas" },
      { label: "ChainSpec fork activation", href: "/blockchain/reth-chainspec" },
      { label: "Payload transaction selection", href: "/blockchain/reth-payload-builder" },
    ],
    evidence: [
      { kind: "standard", rule: "Base fee arithmetic·transaction validity·burn은 EIP-1559와 활성 execution rules에 귀속한다." },
      { kind: "primary-source", rule: "함수·integer type·ChainSpec 연결은 pinned Reth SHA에 귀속한다." },
      { kind: "project-measurement", rule: "Fork boundary·target±1·zero·overflow fixture의 header/result parity 뒤 최적화를 비교한다." },
      { kind: "project-claim", rule: "Tip을 transaction의 유일한 ordering 기준이나 max fee 전액 지불로 해석하지 않는다." },
    ],
  },
  "reth-txpool": {
    title: "Reth transaction pool 글이 소유하는 범위",
    owns: [
      "Admission reject와 보관 가능한 dependency 상태 분리",
      "Sender nonce chain·replacement·subpool·resource eviction 정책",
      "Eligible sender-head ordering과 builder consumption 경계",
      "Canonical update·mined removal·reorg reinjection lifecycle",
      "Pinned policy provenance와 adversarial release gate",
    ],
    reuses: [
      { label: "EIP-1559 base fee·effective tip", href: "/blockchain/reth-eip1559" },
      { label: "Reth provider pinned state view", href: "/blockchain/reth-provider" },
      { label: "Payload builder constraints", href: "/blockchain/reth-payload-builder" },
    ],
    evidence: [
      { kind: "standard", rule: "Envelope·signature·nonce·balance·fee validity는 해당 transaction EIP와 execution rules에 귀속한다." },
      { kind: "primary-source", rule: "Subpool 이름·default·replacement·maintenance behavior는 pinned Reth SHA와 runtime config에 귀속한다." },
      { kind: "project-measurement", rule: "Admission flood·replacement·nonce gap·repricing·reorg·restart parity 뒤 throughput을 비교한다." },
      { kind: "project-claim", rule: "Local pool membership·ordering·retention을 consensus나 eventual inclusion 보장으로 확대하지 않는다." },
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
  "reth-alloy-primitives": {
    title: "Reth Alloy primitive·RLP 글이 소유하는 범위",
    owns: [
      "Address·B256·U256의 fixed width·semantic type·checked conversion 경계",
      "RLP byte string/list prefix와 minimal integer canonical form",
      "U256 limb/value mapping과 checked·wrapping overflow 선택",
      "Bounded exact RLP decode와 typed error·trailing-byte rejection",
      "CREATE·CREATE2·bloom hash domain과 paired type/codec release gate",
    ],
    reuses: [
      { label: "Bit·byte의 기초", href: "/ai/text-unicode-encoding#bits-bytes" },
      { label: "Reth block·storage lifecycle", href: "/blockchain/reth" },
      { label: "Typed DB codec 소비자", href: "/blockchain/reth-db" },
    ],
    evidence: [
      { kind: "standard", rule: "RLP canonical form·Ethereum hash/address derivation은 고정한 protocol specification·schema에 귀속한다." },
      { kind: "primary-source", rule: "Primitive layout·trait·method·codec claim은 표시한 Alloy/Reth crate semver 또는 SHA와 feature에 귀속한다." },
      { kind: "project-measurement", rule: "Boundary value·wrong width·malformed encoding·hash domain fixture의 typed value·bytes·error·digest parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "같은 width·round-trip·hash collision resistance를 semantic schema·canonical input·application validity 전체로 확대하지 않는다." },
    ],
  },
  "reth-db": {
    title: "Reth typed DB·static history 글이 소유하는 범위",
    owns: [
      "Typed table의 key/value codec·ordering·duplicate policy·schema version",
      "Mutable latest·immutable history·secondary index의 physical route와 lifetime",
      "Block write set·canonical marker·commit/sync/stable-media durability 경계",
      "Transaction snapshot cursor ordering·borrow lifetime",
      "Static segment coverage manifest와 crash/migration release gate",
    ],
    reuses: [
      { label: "Reth storage-tier owner", href: "/blockchain/reth" },
      { label: "Alloy typed value·canonical bytes", href: "/blockchain/reth-alloy-primitives" },
      { label: "MDBX B+tree·MVCC·mmap", href: "/blockchain/mdbx-internals" },
      { label: "Provider pinned read view", href: "/blockchain/reth-provider" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Table·transaction·cursor·static-file·Storage V2 claim은 표시한 Reth release/SHA와 backend version에 귀속한다." },
      { kind: "standard", rule: "Engine commit·sync semantics는 해당 DB engine·OS/filesystem·flags 범위로 제한하고 Reth logical schema와 구분한다." },
      { kind: "project-measurement", rule: "같은 chain snapshot·schema에서 crash·corruption·migration·reorg parity를 먼저 통과한 뒤 amplification·disk·latency를 비교한다." },
      { kind: "project-claim", rule: "Storage V2 default·commit return·segment 존재를 자동 migration·power-loss durability·complete history로 확대하지 않는다." },
    ],
  },
  "reth-provider": {
    title: "Reth provider consistent read 글이 소유하는 범위",
    owns: [
      "Block hash·state root·storage generation·overlay revision의 provider view identity",
      "Overlay value/tombstone과 pinned base snapshot의 read precedence",
      "Valid absence·unknown·pruned·corrupt·stale-view·backend error의 typed outcome",
      "Bundle post-state·original/revert journal과 historical reconstruction",
      "Reorg·migration·crash·concurrent query provider release gate",
    ],
    reuses: [
      { label: "Reth provider consistent-view 상위 invariant", href: "/blockchain/reth#overview" },
      { label: "Reth typed transaction·storage route", href: "/blockchain/reth-db" },
      { label: "Reth reorg·unwind reconciliation", href: "/blockchain/reth#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Provider trait·overlay·historical route claim은 표시한 Reth release/SHA·features·storage/prune config에 귀속한다." },
      { kind: "standard", rule: "DB transaction capability를 provider의 block/root identity·archive completeness·proof validity로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 query·chain fixture에서 reorg·tombstone·prune·corruption·generation switch·crash outcome parity 뒤 latency를 비교한다." },
      { kind: "project-claim", rule: "Trait compile·cache hit·None·latest label을 consistent snapshot·valid absence·canonical answer의 보장으로 일반화하지 않는다." },
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
  "reth-eip4844": {
    title: "EIP-4844 blob·commitment·transaction·sidecar 글이 소유하는 범위",
    owns: [
      "Blob·KZG commitment·type-3 transaction·sidecar 네 artifact의 역할 분리",
      "Versioned hash로 transaction reference와 sidecar commitment를 결속하는 방법",
    ],
    reuses: [
      { label: "KZG commitment와 polynomial opening", href: "/crypto/polycommit#kzg10" },
      { label: "Reth blob pool admission gate", href: "/blockchain/reth-blob-admission" },
      { label: "Reth BlobStore artifact 수명주기", href: "/blockchain/reth-blob-storage" },
      { label: "Blob fee excess feedback 계산", href: "/blockchain/eip4844-blob-fee" },
      { label: "Reorg reinsert와 release gate", href: "/blockchain/reth-blob-reorg-release" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Blob·commitment·transaction·sidecar 구조 claim은 활성 fork의 EIP-4844 spec에 귀속한다." },
      { kind: "standard", rule: "Versioned hash reference를 KZG proof 검증이나 data availability 보장으로 확대하지 않는다." },
      { kind: "project-claim", rule: "Sidecar 분리를 특정 client의 pool·store 정책이나 blob의 영구 가용성으로 일반화하지 않는다." },
    ],
  },
  "reth-blob-admission": {
    title: "Reth blob pool admission 글이 소유하는 범위",
    owns: [
      "Bounded decode·shape·state·KZG·resource gate로 나눈 admission 순서",
      "Cryptographically valid와 locally admitted를 구분하는 경계",
    ],
    reuses: [
      { label: "Blob·sidecar·versioned hash 정의", href: "/blockchain/reth-eip4844" },
      { label: "KZG commitment와 polynomial opening", href: "/crypto/polycommit#kzg10" },
      { label: "EIP-1559 execution fee market", href: "/blockchain/reth-eip1559" },
      { label: "Reth transaction pool ordering과 admission", href: "/blockchain/reth-txpool" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Admission gate claim은 pinned Reth transaction-pool source snapshot에 귀속한다." },
      { kind: "standard", rule: "Pool admission을 block inclusion이나 finality 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 fork parameter·tx/sidecar·KZG fixture에서 admission reason-code parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "특정 gate 순서·resource limit을 모든 Reth release의 고정값으로 일반화하지 않는다." },
    ],
  },
  "reth-blob-storage": {
    title: "Reth BlobStore 글이 소유하는 범위",
    owns: [
      "Storage key·sidecar bytes·digest·generation receipt로 이루어진 artifact 형태",
      "Hit·miss·corrupt read outcome과 crash-safe cleanup 경계",
    ],
    reuses: [
      { label: "Blob·sidecar·versioned hash 정의", href: "/blockchain/reth-eip4844" },
      { label: "Reth blob pool admission gate", href: "/blockchain/reth-blob-admission" },
    ],
    evidence: [
      { kind: "primary-source", rule: "BlobStore artifact·lifecycle claim은 pinned Reth transaction-pool source snapshot에 귀속한다." },
      { kind: "standard", rule: "Execution txpool sidecar retention을 consensus-layer data-availability 기간이나 장기 archive 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 schema·backend·durability fixture에서 hit/miss/corrupt·cleanup parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "Local store hit를 protocol availability나 영구 보존 보장으로 확대하지 않는다." },
    ],
  },
  "eip4844-blob-fee": {
    title: "EIP-4844 blob fee feedback 글이 소유하는 범위",
    owns: [
      "Fork-aware excess blob gas 계산과 정수 fake-exponential fee",
    ],
    reuses: [
      { label: "Blob·sidecar·versioned hash 정의", href: "/blockchain/reth-eip4844" },
      { label: "EIP-1559 execution fee market", href: "/blockchain/reth-eip1559" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Excess update·정수 fee claim은 활성 fork의 EIP-4844 execution spec에 귀속한다." },
      { kind: "standard", rule: "Blob gas와 execution gas를 같은 budget으로 합치지 않는다." },
      { kind: "project-claim", rule: "Blob fee 감소를 rollup 총비용의 고정 배수 감소로 일반화하지 않는다." },
    ],
  },
  "reth-blob-reorg-release": {
    title: "Reth blob reorg·release gate 글이 소유하는 범위",
    owns: [
      "Orphaned body와 local sidecar receipt를 결합하는 fast reinsert 경계",
      "Blob artifact lifecycle correctness·availability release gate",
    ],
    reuses: [
      { label: "Blob·sidecar·versioned hash 정의", href: "/blockchain/reth-eip4844" },
      { label: "Reth BlobStore artifact 수명주기", href: "/blockchain/reth-blob-storage" },
      { label: "Prysm blob sidecar consensus path", href: "/blockchain/prysm-blob-sidecar" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Reorg reinsert claim은 pinned Reth source snapshot에 귀속한다." },
      { kind: "standard", rule: "Execution 재주입 재사용을 consensus-layer data-availability 기간이나 finality 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 fork parameter·tx/sidecar fixture와 reorg schedule에서 admission·artifact·restart parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "Finalized cleanup 시점을 consensus retention이나 장기 archive 보장과 합치지 않는다." },
    ],
  },
  "reth-payload-builder": {
    title: "Reth payload builder 글이 소유하는 범위",
    owns: [
      "Payload attributes·parent state·pool generation을 묶은 build identity",
      "Build job snapshot·deadline·cancellation과 candidate overlay 경계",
      "Gas·blob·dependency budget 안의 transaction selection과 best payload 교체",
      "Engine payload ID 조회·restart·fork mismatch와 payload release gate",
    ],
    reuses: [
      { label: "Reth transaction pool ordering", href: "/blockchain/reth-txpool" },
      { label: "Reth block execution과 state transition", href: "/blockchain/reth-block-execution" },
      { label: "Engine API execution/consensus handoff", href: "/blockchain/prysm-engine-api" },
      { label: "Blob gas와 sidecar boundary", href: "/blockchain/reth-eip4844" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Payload job·attribute·builder API claim은 pinned Reth release/source와 활성 Engine API fork specification에 귀속한다." },
      { kind: "standard", rule: "Local candidate value·payload ID·job completion을 canonical block이나 proposer 채택 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 parent/state/pool snapshot·attributes·deadline에서 payload bytes·receipts·value·terminal status parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "특정 ordering·timeout·parallelism을 모든 Reth release와 builder customization의 고정 동작으로 일반화하지 않는다." },
    ],
  },
  "reth-sync": {
    title: "Reth staged·backfill·live sync 글이 소유하는 범위",
    owns: [
      "Sync anchor·target·source와 검증된 contiguous commit cursor",
      "Staged pipeline checkpoint의 ordering·atomic commit·unwind 경계",
      "Backfill과 live canonical notification 사이의 handoff fence",
      "Reorg·crash·gap recovery와 sync release gate",
    ],
    reuses: [
      { label: "Reth pipeline stage와 checkpoint", href: "/blockchain/reth-pipeline" },
      { label: "Reth network peer/session boundary", href: "/blockchain/reth-net" },
      { label: "Reth provider pinned view", href: "/blockchain/reth-provider" },
      { label: "ExEx external consumer boundary", href: "/blockchain/reth-exex" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Stage·checkpoint·notification claim은 pinned Reth source와 실행한 release의 storage schema에 귀속한다." },
      { kind: "standard", rule: "Downloaded range·peer majority·process liveness를 executed canonical prefix나 finalized correctness로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 chain snapshot·peer ranges·reorg/crash schedule에서 stage cursor·state root·handoff receipt parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "Batch size·stage order detail·sync 속도를 모든 network·database·hardware profile의 상수로 일반화하지 않는다." },
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
  "prysm-p2p-libp2p": {
    title: "Prysm libp2p peer lifecycle 글이 소유하는 범위",
    owns: [
      "ENR 후보에서 transport·Noise identity·mux·Status-compatible active peer까지의 단계별 권한",
      "ENR freshness·fork/subnet·endpoint diversity admission과 candidate/active 분리",
      "Peer outcome score·decay와 remote fault/local overload reason feedback",
      "Candidate·pending·active connection·stream·byte budget과 cleanup",
      "Prysm/libp2p/spec provenance와 adversarial P2P release gate",
    ],
    reuses: [
      { label: "Prysm consensus client owner 경계", href: "/blockchain/prysm" },
      { label: "libp2p transport upgrade pipeline", href: "/p2p/libp2p" },
      { label: "TCP socket lifecycle", href: "/p2p/libp2p-tcp" },
      { label: "Noise identity binding", href: "/p2p/libp2p-noise" },
    ],
    evidence: [
      { kind: "standard", rule: "Fork digest·Status·transport requirement는 고정한 Ethereum consensus P2P spec commit·fork·network에 귀속한다." },
      { kind: "primary-source", rule: "Peer manager·discovery·score·gate 구현은 표시한 Prysm release/SHA와 libp2p version 범위에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 ENR·clock·peer·fault schedule에서 active set·failure reason·resource cleanup parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Discovery·socket·encrypted session을 active consensus peer로 확대하거나 peer count를 network safety로 일반화하지 않는다." },
    ],
  },
  "prysm-gossipsub": {
    title: "Prysm Gossipsub validation 글이 소유하는 범위",
    owns: [
      "Fork digest·message name·encoding으로 구성한 Ethereum gossip topic identity",
      "Snappy compressed/decompressed bound와 fork-specific SSZ envelope",
      "Cheap-first stateless·signature·stateful validation과 accept/reject/ignore semantics",
      "Topic·peer·stage별 dedupe·backpressure·fairness budget",
      "Gossipsub/Prysm/spec provenance와 adversarial gossip release gate",
    ],
    reuses: [
      { label: "Prysm active peer lifecycle", href: "/blockchain/prysm-p2p-libp2p" },
      { label: "SSZ typed bounded decoding", href: "/blockchain/prysm-ssz" },
      { label: "BLS signature validation", href: "/blockchain/prysm-bls" },
      { label: "Beacon block state transition", href: "/blockchain/prysm-block-processing" },
    ],
    evidence: [
      { kind: "standard", rule: "Topic·encoding·message validation은 고정한 Ethereum consensus spec commit·fork·preset에 귀속한다." },
      { kind: "primary-source", rule: "Mesh/scoring mechanics와 Prysm validator·queue 동작은 Gossipsub version과 표시한 Prysm release/SHA에 귀속한다." },
      { kind: "project-measurement", rule: "같은 bytes·topic·peer·clock·overload fixture에서 decision·score·memory·fairness parity 뒤 throughput을 비교한다." },
      { kind: "project-claim", rule: "Topic match·decode·signature·gossip accept·state validity를 하나의 success로 합치지 않는다." },
    ],
  },
  "prysm-sync": {
    title: "Prysm beacon sync 글이 소유하는 범위",
    owns: [
      "Genesis·weak-subjectivity checkpoint·local-finalized anchor와 sync mode 경계",
      "BlocksByRange의 start/count/step·empty-slot omission·server branch semantics",
      "병렬 range fetch·ordered transition과 contiguous durable commit cursor",
      "Range와 live gossip의 block-root dedupe·gap·reorg handoff",
      "Prysm/spec/database provenance와 fault·crash recovery release gate",
    ],
    reuses: [
      { label: "Prysm peer lifecycle·req/resp transport", href: "/blockchain/prysm-p2p-libp2p" },
      { label: "Prysm gossip validation decisions", href: "/blockchain/prysm-gossipsub" },
      { label: "Weak-subjectivity·finalized checkpoint", href: "/blockchain/prysm-finality" },
      { label: "Beacon block state transition", href: "/blockchain/prysm-block-processing" },
    ],
    evidence: [
      { kind: "standard", rule: "Req/resp·checkpoint·state-transition semantics는 고정한 Ethereum consensus spec commit·fork·network에 귀속한다." },
      { kind: "primary-source", rule: "Range scheduler·peer selection·DB commit·handoff 동작은 표시한 Prysm release/SHA 범위에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 anchor·peer·clock·range·reorg·crash fixture에서 cursor root·state/head·restart parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Highest downloaded/seen slot을 committed progress로, download endpoint를 checkpoint trust source로 일반화하지 않는다." },
    ],
  },
  "prysm-forkchoice": {
    title: "Prysm LMD-GHOST fork-choice 글이 소유하는 범위",
    owns: [
      "Block·attestation·tick·slashing event를 원자적으로 반영하는 fork-choice store",
      "Validator별 latest-message effective-balance와 old/new ancestor delta 계산",
      "Justified·finalized-compatible tree에서 수행하는 greedy heaviest-child head walk",
      "Current-slot proposer boost의 timeliness·expiry와 deterministic tie-break",
      "Doubly-linked tree·best-child cache의 oracle parity와 restart release gate",
    ],
    reuses: [
      { label: "Prysm consensus object·state·head·finality 구분", href: "/blockchain/prysm" },
      { label: "SSZ bounded decode와 object root", href: "/blockchain/prysm-ssz" },
      { label: "BLS signing root와 signature validation", href: "/blockchain/prysm-bls" },
      { label: "Casper FFG checkpoint finality", href: "/blockchain/prysm-finality" },
    ],
    evidence: [
      { kind: "standard", rule: "Latest message·weight·proposer boost·branch viability·get_head는 고정한 consensus-spec commit과 active fork에 귀속한다." },
      { kind: "primary-source", rule: "Prysm store·tree·cache·handler 이름과 동작은 분석한 release 또는 git SHA의 actual import path에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 event order·balance·checkpoint·Engine fixture에서 full oracle과 event별 eligible set·weight·head parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Head를 finality로, proposer boost를 영구 stake로, 평균 benchmark를 모든 tree shape의 성능으로 일반화하지 않는다." },
    ],
  },
  "prysm-finality": {
    title: "Prysm Casper FFG finality 글이 소유하는 범위",
    owns: [
      "Source→target checkpoint link와 eligible effective-balance 집계",
      "3W≥2T 정수 supermajority 판정과 justification-bit update",
      "Epoch-gap finalization pattern과 1/3 accountable-safety overlap bound",
      "Finalized fork-choice prune와 historical evidence retention의 owner 분리",
      "Weak-subjectivity checkpoint 신뢰·만료·bootstrap과 crash-safe release gate",
    ],
    reuses: [
      { label: "Prysm state·head·finality evidence 분리", href: "/blockchain/prysm" },
      { label: "현재 head를 고르는 LMD-GHOST", href: "/blockchain/prysm-forkchoice" },
      { label: "Byzantine quorum·safety·liveness", href: "/blockchain/bft-theory" },
      { label: "BeaconState checkpoint와 epoch transition", href: "/blockchain/prysm-beacon-state" },
    ],
    evidence: [
      { kind: "standard", rule: "Checkpoint·attestation·justification/finalization·weak-subjectivity 규칙은 고정한 Ethereum consensus-spec commit·fork·preset에 귀속한다." },
      { kind: "primary-source", rule: "Prysm epoch/fork-choice/prune 구현과 storage 동작은 표시한 release·SHA 범위에만 귀속한다." },
      { kind: "project-measurement", rule: "Exact-threshold·duplicate·skipped epoch·conflict·prune crash·expired checkpoint fixture의 state/head parity를 먼저 검사한다." },
      { kind: "project-claim", rule: "Finality를 data availability·영구 archive·application success로 확대하거나 예시 weak-subjectivity 기간을 protocol 상수로 쓰지 않는다." },
    ],
  },
  "prysm-validator-client": {
    title: "Prysm validator-client signing safety 글이 소유하는 범위",
    owns: [
      "Epoch duty·dependent root를 slot phase·deadline·cancellation으로 바꾸는 실행 loop",
      "Key·role·slot/epoch·fork domain·signing root·stable duty ID 요청 문맥",
      "Local keystore·derived wallet·remote signer의 custody·authorization·timeout 경계",
      "Proposal conflict·double vote·surround vote와 atomic signing-intent 기록",
      "EIP-3076 migration fencing·timeout reconciliation과 safety-first release gate",
    ],
    reuses: [
      { label: "Prysm beacon·validator·execution owner 경계", href: "/blockchain/prysm" },
      { label: "BLS domain·signing-root·key validation", href: "/blockchain/prysm-bls" },
      { label: "Fork-choice head와 reorg timing", href: "/blockchain/prysm-forkchoice" },
      { label: "Casper checkpoint·slashing quorum", href: "/blockchain/prysm-finality" },
    ],
    evidence: [
      { kind: "standard", rule: "Duty timing·domain·slashing condition·interchange format은 고정한 consensus-spec fork·network config와 EIP revision에 귀속한다." },
      { kind: "primary-source", rule: "Prysm duty loop·keymanager backend·DB schema·flag는 분석한 release 또는 SHA의 source에 귀속한다." },
      { kind: "project-measurement", rule: "동시 request·timeout-after-success·crash·migration에서 allow/deny·intent·signature-count parity를 통과한 뒤 missed-duty와 latency를 비교한다." },
      { kind: "project-claim", rule: "Keystore 복호화나 valid BLS signature를 duty authorization·slashing safety로 확대하고 remote signer를 무조건 안전하다고 일반화하지 않는다." },
    ],
  },
  "prysm-engine-api": {
    title: "Prysm Engine API coordination 글이 소유하는 범위",
    owns: [
      "Engine method·structure의 독립 versioning과 active-fork capability 선택",
      "PayloadStatus와 latestValidHash의 확정·미완료·invalid-branch 복구 경계",
      "Head·safe·finalized pointer의 ordered atomic update와 payload build 시작 조건",
      "Opaque payloadId의 build·get·unknown·restart lifecycle",
      "JWT caller authentication과 transport·payload validity 분리, paired release gate",
    ],
    reuses: [
      { label: "Prysm consensus/execution owner 경계", href: "/blockchain/prysm" },
      { label: "Reth execution client의 Engine owner", href: "/blockchain/reth" },
      { label: "Beacon block의 execution payload 적용", href: "/blockchain/prysm-block-processing#execution-payload" },
    ],
    evidence: [
      { kind: "standard", rule: "Method version·status·latestValidHash·payloadId·JWT claim은 고정한 execution-apis commit과 active execution fork에 귀속한다." },
      { kind: "primary-source", rule: "Prysm 호출·timeout·optimistic-state behavior는 표시한 release/SHA source에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 CL/EL·payload tree·clock/JWT fixture에서 status·pointer·build receipt parity 뒤 latency를 비교한다." },
      { kind: "project-claim", rule: "JSON-RPC 성공·JWT 성공·payload VALID·canonical head·build 완료를 하나의 success로 합치지 않는다." },
    ],
  },
  "prysm-block-processing": {
    title: "Prysm beacon-block transition 글이 소유하는 범위",
    owns: [
      "Signed block과 fork-specific pre-state에서 post-state/root를 만드는 deterministic transition",
      "Header·withdrawals/execution·RANDAO·operations·sync aggregate의 fork별 ordered dependency",
      "Slot·parent·proposer header와 RANDAO reveal/mix transition",
      "Operation family별 권한·SSZ limit·state precondition",
      "Execution payload consistency·optimistic marker·post-state-root release gate",
    ],
    reuses: [
      { label: "SSZ schema·bounded decode·hash-tree-root", href: "/blockchain/prysm-ssz" },
      { label: "BLS signing root·domain", href: "/blockchain/prysm-bls" },
      { label: "BeaconState fork schema·root cache", href: "/blockchain/prysm-beacon-state" },
      { label: "Engine payload status와 latestValidHash", href: "/blockchain/prysm-engine-api" },
    ],
    evidence: [
      { kind: "standard", rule: "Handler order·operation limit·state transition은 consensus-spec v1.6.1의 활성 stable fork와 reference vector에 귀속한다." },
      { kind: "primary-source", rule: "Prysm package·cache·Engine seam은 표시한 release/SHA implementation에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 pre-state·signed block·Engine fixture에서 reject·post-state bytes/root·optimistic parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Valid transition을 fork-choice head·finality로, moving function list를 모든 fork의 고정 order로 확대하지 않는다." },
    ],
  },
  "prysm-epoch-processing": {
    title: "Prysm epoch accounting·membership 글이 소유하는 범위",
    owns: [
      "Epoch-boundary trigger와 fork별 process_epoch ordered dependency",
      "Target effective-balance threshold·justification bits·finalization pattern",
      "Participation flag·base reward·network share의 validator 회계",
      "Inactivity leak과 validator registry·pending queue·churn lifecycle",
      "Correlation slashing penalty와 epoch-transition release gate",
    ],
    reuses: [
      { label: "PoS attestation·slashing evidence", href: "/blockchain/consensus-mechanisms" },
      { label: "Post-state·head·justified/finalized 분리", href: "/blockchain/prysm" },
      { label: "BeaconState fork schema와 validator fields", href: "/blockchain/prysm-beacon-state" },
      { label: "Validator duty·slashing protection", href: "/blockchain/prysm-validator-client" },
    ],
    evidence: [
      { kind: "standard", rule: "Threshold·integer reward·queue·slashing rule은 consensus-spec v1.6.1의 fork·network preset에 귀속한다." },
      { kind: "primary-source", rule: "Prysm precompute·mutation·cache behavior는 표시한 release/SHA source에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 participation·queue·slashing·fork-boundary fixture에서 checkpoint·delta·post-root parity 뒤 p99를 비교한다." },
      { kind: "project-claim", rule: "Toy reward를 APR로, 2/3 justification을 즉시 finalization으로, slashed flag를 최종 손실 전체로 일반화하지 않는다." },
    ],
  },
  "prysm-block-proposal": {
    title: "Prysm block proposal 글이 소유하는 범위",
    owns: [
      "State-dependent proposer duty identity와 effective-balance sampling",
      "Parent·payload·operation snapshot·deadline proposal build receipt",
      "Fork-specific BeaconBlockBody 조립과 post-state-root backfill",
      "완성 block의 single sign·durable publish commit 경계",
      "Duty reorg·builder timeout·crash를 포함한 proposal release gate",
    ],
    reuses: [
      { label: "Fork-choice head 선택", href: "/blockchain/prysm-forkchoice" },
      { label: "Engine payload build lifecycle", href: "/blockchain/prysm-engine-api" },
      { label: "Block state transition과 root", href: "/blockchain/prysm-block-processing" },
      { label: "Validator duty·slashing protection", href: "/blockchain/prysm-validator-client" },
    ],
    evidence: [
      { kind: "standard", rule: "Proposer selection·block schema·domain은 consensus-spec v1.6.1의 활성 fork와 preset에 귀속한다." },
      { kind: "primary-source", rule: "Prysm RPC·pool·assembly behavior는 표시한 SHA source에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 duty·parent·payload·pool fixture에서 root·signed bytes·restart parity 뒤 latency를 비교한다." },
      { kind: "project-claim", rule: "Receipt·deadline fencing은 hardening 제안이며 publish 성공을 canonical head나 finality로 확대하지 않는다." },
    ],
  },
  "prysm-attestation": {
    title: "Prysm attestation lifecycle 글이 소유하는 범위",
    owns: [
      "Attestation head·source·target triple과 dependent-root duty",
      "Block observation·slashing check·sign/publish deadline",
      "Fork-specific committee-to-subnet routing과 aggregator selection",
      "같은-data bitlist/BLS aggregation과 pool subsumption",
      "Reorg·conflict·restart를 포함한 attestation release gate",
    ],
    reuses: [
      { label: "LMD-GHOST weight", href: "/blockchain/prysm-forkchoice" },
      { label: "Casper checkpoint finality", href: "/blockchain/prysm-finality" },
      { label: "BLS domain과 aggregate verification", href: "/blockchain/prysm-bls" },
      { label: "Validator slashing protection", href: "/blockchain/prysm-validator-client#slashing-protection" },
    ],
    evidence: [
      { kind: "standard", rule: "Attestation schema·timing·subnet·selection proof는 consensus-spec v1.6.1의 활성 fork/preset에 귀속한다." },
      { kind: "primary-source", rule: "Prysm validator·gossip·pool behavior는 표시한 SHA source에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 duty/data/signature fixture에서 accept·aggregate·pool·restart parity 뒤 처리량을 비교한다." },
      { kind: "project-claim", rule: "Pool receipt와 release fixture는 hardening 제안이며 subnet이나 aggregate를 finality로 일반화하지 않는다." },
    ],
  },
  "prysm-sync-committee": {
    title: "Prysm sync committee 글이 소유하는 범위",
    owns: [
      "Period membership과 effective-balance sampling with replacement",
      "Sync message의 role-separated signing domain",
      "Subcommittee contribution과 global participant-position binding",
      "Trusted checkpoint에서 light-client update까지의 신뢰 경계",
      "Participant/proposer reward 분리와 sync release gate",
    ],
    reuses: [
      { label: "BLS aggregate signature", href: "/blockchain/prysm-bls" },
      { label: "SSZ Merkle branch", href: "/blockchain/prysm-ssz" },
      { label: "BeaconState current/next committee", href: "/blockchain/prysm-beacon-state" },
      { label: "Casper finalized checkpoint", href: "/blockchain/prysm-finality" },
    ],
    evidence: [
      { kind: "standard", rule: "Committee·message·contribution·light-client rule은 consensus-spec v1.6.1 Altair+와 preset에 귀속한다." },
      { kind: "primary-source", rule: "Prysm validator·sync aggregate behavior는 표시한 SHA source에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 membership·positions·root·branch fixture에서 contribution/update/restart parity 뒤 성능을 비교한다." },
      { kind: "project-claim", rule: "Release gate는 hardening 제안이며 sync aggregate를 full-node 검증이나 자동 finality와 같다고 하지 않는다." },
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
  "prysm-slot-processing": {
    title: "Prysm slot processing ordered replay 글이 소유하는 범위",
    owns: [
      "현재 slot에서 target slot까지 빈 slot도 빠뜨리지 않는 ordered replay",
      "Per-slot root backfill과 epoch-boundary trigger의 정확한 실행 순서",
      "Historical-root ring index와 slot generation을 함께 확인하는 조회 경계",
      "Replay receipt·full-transition oracle·fork/restart를 포함한 release gate",
    ],
    reuses: [
      { label: "BeaconState value·root·fork schema", href: "/blockchain/prysm-beacon-state" },
      { label: "Epoch boundary의 fork별 transition", href: "/blockchain/prysm-epoch-processing" },
      { label: "Target slot 뒤 block transition", href: "/blockchain/prysm-block-processing" },
    ],
    evidence: [
      { kind: "standard", rule: "Slot·epoch 순서는 고정한 Ethereum consensus-spec release/commit·fork·network preset에 귀속한다." },
      { kind: "primary-source", rule: "Loop·cache·error path는 표시한 Prysm release/SHA의 source snapshot에만 귀속한다." },
      { kind: "project-measurement", rule: "Empty slot·epoch/fork boundary·reorg·restart에서 full transition의 post-state/root와 일치한 뒤 latency를 비교한다." },
      { kind: "project-claim", rule: "Target slot 도달을 block validity·canonical head·finality로, ring entry를 영구 archive로 확대하지 않는다." },
    ],
  },
  "prysm-beacon-db": {
    title: "Prysm Beacon DB schema·atomicity·pruning 글이 소유하는 범위",
    owns: [
      "Root-addressed primary record와 slot·parent 등 secondary index의 cardinality",
      "Primary·index·checkpoint를 함께 공개하는 atomic write와 consistent read snapshot",
      "Commit 전후 crash를 구분하는 idempotent recovery receipt",
      "Finality fence·logical delete·compaction·retention replay budget과 release gate",
    ],
    reuses: [
      { label: "SSZ canonical bytes와 root", href: "/blockchain/prysm-ssz" },
      { label: "BeaconState value와 state-root identity", href: "/blockchain/prysm-beacon-state" },
      { label: "Finalized checkpoint와 prune 하한", href: "/blockchain/prysm-finality" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Bucket·transaction·cache·migration·pruning 동작은 표시한 Prysm release/SHA에만 귀속한다." },
      { kind: "standard", rule: "bbolt transaction·single-writer·page lifecycle은 고정한 official release/documentation에 귀속한다." },
      { kind: "project-measurement", rule: "Commit 전후 crash injection, reopen, index/primary/root parity와 backup reader를 통과한 뒤 bytes·latency를 비교한다." },
      { kind: "project-claim", rule: "Transaction commit을 remote replica의 exactly-once나 disk 물리 overwrite로, finality를 모든 historical evidence 삭제 허가로 읽지 않는다." },
    ],
  },
  "prysm-state-cache": {
    title: "Prysm state retrieval·cache 글이 소유하는 범위",
    owns: [
      "Root·slot·fork/schema를 함께 고정하는 state identity와 cache-generation receipt",
      "Hot state의 immutable return·copy boundary와 cache/DB/replay lookup order",
      "State summary에서 anchor와 ordered slot/block replay plan을 만드는 경계",
      "Replay distance·transition cost와 cold-state retention trade-off",
      "Reorg·corruption·restart를 포함한 state-cache parity release gate",
    ],
    reuses: [
      { label: "BeaconState value·Copy-on-Write·incremental root", href: "/blockchain/prysm-beacon-state" },
      { label: "Slot·epoch transition", href: "/blockchain/prysm-slot-processing" },
      { label: "Beacon block transition", href: "/blockchain/prysm-block-processing" },
      { label: "Finalized checkpoint와 weak-subjectivity anchor", href: "/blockchain/prysm-finality" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Cache·stategen·DB path와 copy/replay behavior는 표시한 Prysm release 또는 git SHA에만 귀속한다." },
      { kind: "standard", rule: "State transition·root·finality 전제는 고정한 consensus-spec commit·fork·network preset에 귀속한다." },
      { kind: "project-measurement", rule: "같은 root/slot/fork fixture에서 full transition oracle과 bytes/root parity를 먼저 확인한 뒤 hit rate·replay p95·memory를 비교한다." },
      { kind: "project-claim", rule: "Cache hit를 canonical head·finality로, pruning을 historical evidence 전체 삭제로, 평균 hit rate를 모든 workload의 지연으로 일반화하지 않는다." },
    ],
  },
  "prysm-beacon-api": {
    title: "Prysm Beacon API transport·duty 글이 소유하는 범위",
    owns: [
      "REST/gRPC transport adapter와 공통 consensus service owner 경계",
      "JSON·SSZ content negotiation, endpoint별 version과 typed error mapping",
      "State identifier·dependent root·optimistic/finalized metadata consistency",
      "Duty 조회→unsigned object→local signing→publish의 deadline·retry lifecycle",
      "SSE gap reconciliation, exposure/authorization와 API release gate",
    ],
    reuses: [
      { label: "Validator duty·key·slashing protection", href: "/blockchain/prysm-validator-client" },
      { label: "Block proposal assembly", href: "/blockchain/prysm-block-proposal" },
      { label: "Attestation creation·aggregation", href: "/blockchain/prysm-attestation" },
      { label: "SSZ wire schema", href: "/blockchain/prysm-ssz" },
    ],
    evidence: [
      { kind: "standard", rule: "Endpoint·field·media type·status claim은 고정한 Beacon API OpenAPI commit과 endpoint version에 귀속한다." },
      { kind: "primary-source", rule: "Prysm gRPC/REST package·interceptor·handler wiring은 표시한 release/SHA에만 귀속한다." },
      { kind: "project-measurement", rule: "같은 state/duty fixture에서 REST·gRPC schema/status/effect parity와 reconnect reconciliation을 통과한 뒤 latency를 비교한다." },
      { kind: "project-claim", rule: "HTTP 2xx를 duty inclusion·finality로, SSE를 durable log로, bind address를 caller authorization으로 일반화하지 않는다." },
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
        label: "확률변수·평균",
        href: "/ai/math-random-variables-expectation",
      },
      { label: "분산·표본평균", href: "/ai/math-variance-sampling" },
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
        label: "확률분포",
        href: "/ai/math-probability-expectation-variance",
      },
      { label: "Random variable·평균", href: "/ai/math-random-variables-expectation" },
      { label: "분산", href: "/ai/math-variance-sampling" },
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
  "crypto-primitives": {
    title: "암호 프리미티브 조합 글이 소유하는 범위",
    owns: [
      "Poseidon field-native permutation과 sponge security/circuit-cost 경계",
      "Merkle selective opening과 commitment binding·hiding 분리",
      "Schnorr Fiat–Shamir transcript와 Ed25519 instance 계약",
      "Point·scalar·field·protocol domain의 구현 타입 분리",
    ],
    reuses: [
      { label: "유한체 arithmetic·multiplicative order", href: "/crypto/finite-field-theory" },
      { label: "DLP와 generic square-root attacks", href: "/crypto/discrete-log" },
      { label: "Elliptic-curve point·subgroup 구현", href: "/crypto/elliptic-curves" },
      { label: "CSPRNG·nonce lifecycle", href: "/crypto/csprng" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Poseidon 비용·보안 주장은 논문의 field·width·S-box·matrix·round parameter 범위에만 귀속한다." },
      { kind: "standard", rule: "Schnorr BIP 340과 RFC 8032 Ed25519의 curve·transcript·encoding·variant를 서로 바꾸어 일반화하지 않는다." },
      { kind: "project-measurement", rule: "회로 constraint·proof time·verification time은 같은 field·arity·input·backend에서 vector parity 뒤 비교한다." },
    ],
  },
  csprng: {
    title: "CSPRNG entropy·state lifecycle 글이 소유하는 범위",
    owns: [
      "Entropy source→health/conditioning→DRBG state→reseed pipeline",
      "Next-output unpredictability와 min-entropy guessing bound",
      "State compromise의 backtracking·future recovery 분리",
      "Key·nonce·token consumer와 fork/clone/snapshot release gate",
    ],
    reuses: [],
    evidence: [
      { kind: "standard", rule: "DRBG mechanism과 entropy-source validation은 NIST SP 800-90A/90B의 서로 다른 책임과 version에 귀속한다." },
      { kind: "primary-source", rule: "Weak-key 수치는 Heninger et al.의 2012 corpus·device population·분석 범위를 벗어나 일반화하지 않는다." },
      { kind: "project-measurement", rule: "Boot·fork·clone·snapshot·state disclosure·reseed failure parity 뒤 duplicate와 throughput을 비교한다." },
    ],
  },
  "discrete-log": {
    title: "이산로그 문제·공격 비용 글이 소유하는 범위",
    owns: [
      "Known-order cyclic subgroup의 DLP 해와 forward/reverse 비용 비대칭",
      "Small-order·outside-subgroup 해 존재 경계",
      "BSGS meet-in-the-middle와 Pollard rho square-root cost",
      "DLP·CDH·DDH 가정 분리와 parameter release gate",
    ],
    reuses: [
      { label: "Finite-field multiplicative order·generator", href: "/crypto/finite-field-theory#prime-field" },
      { label: "Elliptic-curve subgroup와 scalar multiplication", href: "/crypto/elliptic-curves" },
    ],
    evidence: [
      { kind: "primary-source", rule: "BSGS·Pollard rho cost는 논문이 분석한 group model·order·expected/probabilistic 조건과 함께 제시한다." },
      { kind: "project-measurement", rule: "Security bits는 group-specific attacks·multi-target·hardware·implementation leakage와 quantum horizon을 고정한 budget에서만 보고한다." },
    ],
  },
  "uniswap-v2": {
    title: "Uniswap V2 글이 소유하는 범위",
    owns: [
      "Constant-product reserve invariant·30-bp fee-adjusted balance settlement",
      "LP share mint·optional protocol fee와 Router quote/execution boundary",
      "Flash callback atomic repayment·cumulative-price TWAP·release gate",
    ],
    reuses: [
      { label: "Concentrated-liquidity range 확장", href: "/blockchain/uniswap-v3" },
      { label: "MEV ordering·private path 일반 경계", href: "/blockchain/reth-mev" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Invariant·fee·LP·flash·TWAP claim은 Uniswap V2 whitepaper와 v2-core v1.0.1 commit d2bfbb3649b2에 귀속한다." },
      { kind: "project-measurement", rule: "Quote·gas·slippage·TWAP 안정성은 factory/pair/router·token behavior·block range를 고정한 replay에만 귀속한다." },
    ],
  },
  "uniswap-v3": {
    title: "Uniswap V3 글이 소유하는 범위",
    owns: [
      "Concentrated-liquidity virtual reserve·range별 token amount",
      "Tick·sqrtPriceX96·tick spacing·inside fee-growth accounting",
      "Initialized tick crossing·exact-in/out swap step·release gate",
    ],
    reuses: [
      { label: "Constant-product invariant·input fee settlement", href: "/blockchain/uniswap-v2#overview" },
      { label: "Router min/max·deadline 실행 경계", href: "/blockchain/uniswap-v2#router-swap" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Range·tick·rounding·fee·swap claim은 V3 whitepaper와 v3-core v1.0.0 commit ef64f51d0f0d에 귀속한다." },
      { kind: "project-measurement", rule: "Capital efficiency·gas는 같은 pool state·range·fee·path·token decimals에서 amounts/state parity 뒤 비교한다." },
    ],
  },
  "aave-v3": {
    title: "Aave V3 글이 소유하는 범위",
    owns: [
      "Reserve utilization·optimal kink variable/liquidity rate strategy",
      "Scaled aToken·variable debt와 liquidity/borrow index 회계",
      "Health factor·close factor liquidation·E-Mode/isolation release boundary",
    ],
    reuses: [
      { label: "Compound single-base·signed principal 비교", href: "/blockchain/compound-v3" },
      { label: "On-chain cumulative price·window 경계 비교", href: "/blockchain/uniswap-v2#flash-swap" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Index·rate·HF·liquidation claim은 aave-v3-origin commit cff15de6d127의 executable logic에 귀속한다." },
      { kind: "project-measurement", rule: "Risk parameter·rate·gas는 chain·proxy/implementation·reserve config·oracle snapshot을 고정한 결과에만 귀속한다." },
    ],
  },
  "compound-v3": {
    title: "Compound V3 · Comet 글이 소유하는 범위",
    owns: [
      "Single-base market·signed principal과 supply/borrow index rounding",
      "독립 supply/borrow kink curve·borrow/liquidation factor 분리",
      "Reserve-funded absorb·collateral sale gate·release receipt",
    ],
    reuses: [
      { label: "Lending utilization·indexed balance 정본", href: "/blockchain/aave-v3#interest-rate" },
      { label: "Health factor 방식과의 비교", href: "/blockchain/aave-v3#liquidation" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Principal·rate·factor·absorb·sale claim은 Comet commit f766f51583c2와 official Compound III docs에 귀속한다." },
      { kind: "project-measurement", rule: "Market parameter·reserves·gas는 proxy/implementation·deployment artifact·oracle·config snapshot을 함께 기록한다." },
    ],
  },
  "diffie-hellman": {
    title: "Diffie–Hellman 배포 경계 글이 소유하는 범위",
    owns: [
      "Ephemeral public-value 교환에서 raw shared group element까지의 key-agreement flow",
      "Primitive-specific public-value validation과 authenticated transcript 경계",
      "Raw DH output의 transcript-bound KDF·direction/purpose key schedule",
      "Ephemeral secret 폐기·forward secrecy lifecycle과 adversarial release gate",
    ],
    reuses: [
      { label: "Cyclic subgroup와 DLP·CDH·DDH 가정", href: "/crypto/discrete-log" },
      { label: "Elliptic-curve point·subgroup validation", href: "/crypto/elliptic-curves" },
      { label: "CSPRNG entropy·clone·reseed lifecycle", href: "/crypto/csprng" },
    ],
    evidence: [
      { kind: "primary-source", rule: "원래 public-key distribution 아이디어는 Diffie–Hellman 1976 논문의 문제·group model 범위에만 귀속한다." },
      { kind: "standard", rule: "X25519 acceptance·encoding은 RFC 7748, extract/expand는 RFC 5869, key-establishment validation은 NIST SP 800-56A Rev. 3의 서로 다른 계약으로 표시한다." },
      { kind: "project-claim", rule: "Raw DH equality를 peer authentication·application key·forward secrecy·post-quantum security의 자동 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Malformed/all-zero·MITM·role swap·downgrade·RNG clone·restart와 derived-key parity 뒤 handshake 비용을 비교한다." },
    ],
  },
  "elliptic-curves": {
    title: "타원곡선군·BN254 구현 글이 소유하는 범위",
    owns: [
      "Nonsingular finite-field curve point group과 scalar multiplication",
      "Canonical decode·on-curve·identity·prime-subgroup validation",
      "Affine/Jacobian equivalence와 inversion 비용 trade-off",
      "BN254 G1·G2 twist·GT pairing boundary와 implementation release gate",
    ],
    reuses: [
      { label: "Prime-field inverse와 extension-field quotient", href: "/crypto/finite-field-theory" },
      { label: "DLP·generic square-root attack", href: "/crypto/discrete-log" },
      { label: "Miller loop·final exponentiation", href: "/crypto/pairing" },
    ],
    evidence: [
      { kind: "standard", rule: "Point encoding·validation은 SEC 1 또는 EIP-196/197의 구체 curve·fork·input contract에 귀속한다." },
      { kind: "project-measurement", rule: "Coordinate/window 최적화는 malformed point·subgroup·official vector·independent parity·constant-time gate 뒤 비교한다." },
      { kind: "project-claim", rule: "Pairing equation 성공을 proof statement provenance·trusted setup·application authorization 전체로 확대하지 않는다." },
    ],
  },
  "field-arithmetic": {
    title: "유한체 산술 구현 글이 소유하는 범위",
    owns: [
      "Canonical bytes·residue·little-endian limb·internal Montgomery representation 경계",
      "Montgomery REDC와 word-scanning implementation 조건",
      "Field operator API·zero inverse·constant-time 검토·differential test",
      "BN254 base/scalar type separation과 correctness-first release gate",
    ],
    reuses: [
      { label: "Field 공리·prime-field inverse", href: "/crypto/finite-field-theory" },
      { label: "Point coordinate·scalar subgroup 의미", href: "/crypto/elliptic-curves" },
      { label: "Point·scalar·field domain type 분리", href: "/crypto/crypto-primitives#abelian-group" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Montgomery reduction의 대수는 1985 원 논문의 coprime radix·operand bound 범위에 귀속한다." },
      { kind: "primary-source", rule: "Rust field trait·backend claim은 ark-ff 0.5.0 tag commit 7ad88c46…에 고정하고 교육용 의사코드와 분리한다." },
      { kind: "standard", rule: "BN254 Fp/Fp²·group-order 경계는 EIP-197의 protocol-visible parameter 범위로 제한한다." },
      { kind: "project-measurement", rule: "Canonical·boundary·inverse·cross-field·independent parity·side-channel gate 뒤 target별 throughput을 비교한다." },
    ],
  },
  "extension-fields": {
    title: "확장체 tower 구현 글이 소유하는 범위",
    owns: [
      "Fp→Fp²→Fp⁶→Fp¹² coefficient layout과 pinned non-residue/tower identity",
      "Quadratic Karatsuba·denominator inversion과 cubic reduction schedule",
      "Tower-basis Frobenius coefficient table과 비용 장부",
      "Irreducibility·basis·cycle·serialization·G2/pairing parity release gate",
    ],
    reuses: [
      { label: "Irreducible quotient extension field", href: "/crypto/finite-field-theory#extension-field" },
      { label: "BN254 G2 twist·subgroup", href: "/crypto/elliptic-curves#g1-g2-bn254" },
      { label: "Miller loop·final exponentiation", href: "/crypto/pairing" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Concrete coefficient order·non-residue·Frobenius table은 ark-bn254 0.5.0과 curves SHA e2d16a27… snapshot에 귀속한다." },
      { kind: "standard", rule: "EIP-197은 G2/Fp² wire와 pairing contract 근거이며 내부 Fp⁶/Fp¹² layout 표준으로 확대하지 않는다." },
      { kind: "project-claim", rule: "Subfield multiplication count를 end-to-end speedup·constant-time·모든 BN254 implementation의 보편 비용으로 표현하지 않는다." },
      { kind: "project-measurement", rule: "Wrong basis/non-residue/order·Frobenius cycle·independent pairing parity 뒤 mul/square/map 비용을 비교한다." },
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
  helios: {
    title: "Helios architecture overview가 소유하는 범위",
    owns: [
      "Consensus checkpoint→verified header→execution state proof→local RPC response의 end-to-end join",
      "Proof-bound response와 unsupported·unavailable·invalid outcome의 구분",
      "Network·block·root·endpoint·Helios SHA verification receipt",
      "Adversarial end-to-end parity 뒤 성능을 비교하는 release gate",
    ],
    reuses: [
      { label: "Helios fork별 type과 Store transition", href: "/blockchain/helios-types" },
      { label: "Helios network·checkpoint config", href: "/blockchain/helios-config" },
      { label: "Sync committee protocol", href: "/blockchain/prysm-sync-committee" },
      { label: "EIP-1186 state proof", href: "/blockchain/helios-state" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Crate·RPC·verification path는 표시한 Helios SHA와 supported method/provider capability에 귀속한다." },
      { kind: "standard", rule: "Consensus light-client와 execution proof 규칙은 고정 consensus-specs fork/preset 및 EIP-1186 범위로 제한한다." },
      { kind: "project-claim", rule: "Local verified RPC를 full-node 동등성·모든 method 검증·endpoint availability로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Wrong root/proof·reorg·provider failure parity 뒤 같은 hardware/network에서 latency를 비교한다." },
    ],
  },
  "helios-bootstrap": {
    title: "Helios bootstrap 글이 소유하는 범위",
    owns: [
      "Approved network·checkpoint를 고정한 bootstrap request identity",
      "Checkpoint header root와 current committee branch의 trust transfer",
      "Initial LightClientStore generation의 atomic initialization",
      "첫 update handoff·failure taxonomy·restart release gate",
    ],
    reuses: [
      { label: "Checkpoint source·age·fallback 정책", href: "/blockchain/helios-config#persistence" },
      { label: "Fork-specific SSZ proof receipt", href: "/blockchain/helios-types#ssz-internal" },
      { label: "Weak-subjectivity trust anchor", href: "/blockchain/prysm-finality#weak-subjectivity" },
      { label: "Light-client Store transition", href: "/blockchain/helios-types#core-types" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Checkpoint input/cache/fallback과 HTTP/Store implementation은 표시한 Helios SHA에 귀속한다." },
      { kind: "standard", rule: "Bootstrap container·branch·initialization은 고정 consensus-specs v1.6.1·fork·preset에 귀속한다." },
      { kind: "project-claim", rule: "Fallback plurality·freshness·HTTP success를 trusted checkpoint나 valid Store로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Wrong source/root/branch·stale·truncation·crash parity 뒤 startup latency를 비교한다." },
    ],
  },
  "helios-consensus": {
    title: "Helios consensus update 글이 소유하는 범위",
    owns: [
      "Slot·period·branch·participant·domain·BLS의 cheap-first validation order",
      "2/3 supermajority와 signature·optimistic·finality decision의 분리",
      "Current/next committee period handoff와 missing-next recovery",
      "Fetch·rank·apply·persist reconciliation과 consensus release gate",
    ],
    reuses: [
      { label: "SyncAggregate와 Store type", href: "/blockchain/helios-types#core-types" },
      { label: "BLS point·domain·pairing 정본", href: "/blockchain/prysm-bls" },
      { label: "Sync committee membership", href: "/blockchain/prysm-sync-committee" },
      { label: "SSZ generalized index", href: "/blockchain/prysm-ssz" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Sync integration·Store persistence·runtime behavior는 표시한 Helios SHA와 build/config에 귀속한다." },
      { kind: "standard", rule: "Participation threshold·update validation·committee period는 고정 consensus-specs v1.6.1과 network preset에 귀속한다." },
      { kind: "project-claim", rule: "BLS PASS·342 positions·higher slot을 automatic finality나 execution validity로 확대하지 않는다." },
      { kind: "project-measurement", rule: "341/342·wrong bit/domain/branch·period·reorg·clock·crash parity 뒤 BLS latency와 sync lag를 비교한다." },
    ],
  },
  "helios-types": {
    title: "Helios light-client 타입 글이 소유하는 범위",
    owns: [
      "Pinned Helios snapshot의 fork별 LightClientHeader·Update·Store type 배치",
      "Update validation 결과를 optimistic/finalized header와 current/next committee에 적용하는 typed transition",
      "Helios type release에서 bytes·root·branch·pre/post Store를 비교하는 검증 계약",
    ],
    reuses: [
      { label: "SSZ schema·canonical decode·Merkleization", href: "/blockchain/prysm-ssz" },
      { label: "Sync committee membership·signature 역할", href: "/blockchain/prysm-sync-committee" },
      { label: "Weak-subjectivity checkpoint", href: "/blockchain/prysm-finality#weak-subjectivity" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Type field·variant·size는 Helios commit 43a8c9f3과 consensus-spec commit 2359a5e3·fork·preset을 함께 고정한다." },
      { kind: "standard", rule: "SSZ decode·object root·Merkle branch·BLS/domain·Store transition을 서로 다른 검증 단계로 표시한다." },
      { kind: "project-claim", rule: "Rust type 존재를 runtime validation·memory size·network response size·production safety 보장으로 확대하지 않는다." },
    ],
  },
  "helios-config": {
    title: "Helios 설정·checkpoint lifecycle 글이 소유하는 범위",
    owns: [
      "Pinned Helios의 network default·TOML·CLI·builder normalization과 config provenance",
      "Network identity bundle·CL/EL endpoint role·checkpoint source/age policy",
      "FileDB 32-byte checkpoint cache의 current 동작과 crash-safe hardening·release gate의 분리",
    ],
    reuses: [
      { label: "일반 설정 precedence·launch receipt", href: "/blockchain/reth-cli#overview" },
      { label: "Weak-subjectivity trust anchor", href: "/blockchain/prysm-finality#weak-subjectivity" },
      { label: "Light-client update와 Store", href: "/blockchain/helios-types" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Default·merge·builder·FileDB 동작은 Helios commit 43a8c9f3의 source와 pinned config 문서에만 귀속한다." },
      { kind: "standard", rule: "Checkpoint freshness·source trust·bootstrap verification·endpoint availability·local RPC exposure를 별도 경계로 둔다." },
      { kind: "project-claim", rule: "External checkpoint fallback이나 endpoint 다수결을 trustless·safe로 표현하지 않고 atomic replace는 source fact가 아닌 hardening 요구로 표시한다." },
    ],
  },
  "erasure-coding": {
    title: "Erasure coding 기초 글이 소유하는 범위",
    owns: [
      "(n,k) symbol identity·rate·overhead·erasure/error recovery contract",
      "Reed–Solomon evaluation·interpolation·distance budget의 초심자 수치 경로",
      "2D extension·DAS sampling bound와 Celestia 계열·Ethereum PeerDAS 구현 경계",
      "RS·RaptorQ·LDPC workload 선택과 correctness-first release gate",
    ],
    reuses: [
      { label: "Field 연산·polynomial root bound", href: "/crypto/finite-field-theory" },
      { label: "Lagrange interpolation", href: "/crypto/lagrange" },
      { label: "Ethereum blob·KZG·PeerDAS", href: "/blockchain/da-theory" },
    ],
    evidence: [
      { kind: "standard", rule: "RS·RaptorQ·LDPC의 protocol profile은 RFC 5510·6330·5170에 각각 귀속하고 family 전체의 보편 성능으로 확대하지 않는다." },
      { kind: "primary-source", rule: "2D DAS construction은 Al-Bassam et al. 논문에, Ethereum의 current 1D row extension·column sampling은 EIP-7594에 분리해 귀속한다." },
      { kind: "project-claim", rule: "Sample 성공·MDS·commitment를 availability·integrity·confidentiality·production safety의 자동 보장으로 확대하지 않는다." },
    ],
  },
  "reed-solomon": {
    title: "Reed–Solomon 구현·ZK 연결 글이 소유하는 범위",
    owns: [
      "Field·points·n,k·source/systematic mapping·symbol encoding의 code profile identity",
      "Profile-bound encoding과 object digest·shard index artifact 경로",
      "Berlekamp–Welch reconstruction과 typed decoder outcome",
      "Exact membership·proximity 경계와 adversarial implementation release gate",
    ],
    reuses: [
      { label: "RS evaluation code·MDS distance budget", href: "/blockchain/erasure-coding#reed-solomon" },
      { label: "Field arithmetic·polynomial root bound", href: "/crypto/finite-field-theory" },
      { label: "k-point Lagrange interpolation", href: "/crypto/lagrange" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Polynomial evaluation construction은 Reed–Solomon 1960 원 논문의 finite-field code 범위에 귀속한다." },
      { kind: "standard", rule: "Systematic GF(2^m) packet profile은 RFC 5510에만 귀속하고 모든 RS wire layout으로 확대하지 않는다." },
      { kind: "primary-source", rule: "FRI proximity와 complexity claim은 ICALP 2018 논문의 field·rate·oracle·randomness 조건과 함께 제시한다." },
      { kind: "project-measurement", rule: "Distance 경계·wrong index/profile/object·malformed·timeout·restart parity 뒤 encode/decode 비용을 비교한다." },
    ],
  },
  "aa-fundamentals": {
    title: "Account Abstraction 기초 글이 소유하는 범위",
    owns: [
      "고정 EOA validation과 programmable smart-account policy의 책임 경계",
      "ERC-4337 UserOperation·Bundler·EntryPoint·Paymaster의 end-to-end lifecycle",
      "EIP-7702 Final delegation과 Withdrawn native-AA proposal의 현재 상태 구분",
      "Session capability·recovery governance·paymaster budget의 release gate",
    ],
    reuses: [
      { label: "Ethereum transaction·nonce·receipt", href: "/blockchain/evm-fundamentals" },
      { label: "EIP-1559 fee market", href: "/blockchain/reth-eip1559" },
      { label: "Elliptic-curve signature 기초", href: "/crypto/elliptic-curves" },
    ],
    evidence: [
      { kind: "standard", rule: "ERC-4337·ERC-7562·EIP-7702·EIP-7701의 status와 version을 2026-08-14 현재 공식 EIP 문서에 귀속한다." },
      { kind: "project-claim", rule: "Smart account·passkey·batch·paymaster를 자동 보안·무료 gas·inclusion guarantee로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Replay·mutable-state invalidation·budget exhaustion·timeout·recovery conflict parity 뒤 gas·latency를 비교한다." },
    ],
  },
  "isms-overview": {
    title: "ISMS-P 관리체계 개요 글이 소유하는 범위",
    owns: [
      "인증범위·서비스 의존성에서 위험 시나리오·잔여위험까지의 관리체계 입구",
      "정책·구현·운영·효과검증을 잇는 control-evidence chain",
      "표본심사·근본원인·영향 모집단·재검증·사후관리의 개선 loop",
    ],
    reuses: [
      { label: "VASP control·evidence 실전", href: "/isms-aml/isms-practical-guide" },
      { label: "Access decision과 DB audit", href: "/isms-aml/isms-access-control" },
      { label: "MFA·password·계정 lifecycle", href: "/isms-aml/isms-auth-management" },
    ],
    evidence: [
      { kind: "standard", rule: "의무대상·유효기간·사후관리는 2026-08-14 현재 시행 중인 대한민국 법령과 KISA 안내를 구분해 표시한다." },
      { kind: "primary-source", rule: "인증기준 해설은 KISA 2023.11 안내서에 귀속하고 이후 법령·고시 개정과 충돌하면 현행 규정을 우선한다." },
      { kind: "project-claim", rule: "인증·점수·표본 적합을 침해 방지·범위 밖 안전·향후 변경의 보장으로 확대하지 않는다." },
    ],
  },
  "isms-practical-guide": {
    title: "VASP ISMS 실전 글이 소유하는 범위",
    owns: [
      "고객 요청·원장·wallet·chain을 잇는 VASP service-control trace",
      "Crypto parameter lifecycle·secure-SDLC release evidence·wallet signing receipt",
      "모집단·표본·source provenance를 가진 재현 가능한 audit evidence",
    ],
    reuses: [
      { label: "ISMS 범위·위험·심사 loop", href: "/isms-aml/isms-overview" },
      { label: "DB JIT session·entitlement review", href: "/isms-aml/isms-access-control#db-access-control" },
      { label: "Password hash·MFA·credential lifecycle", href: "/isms-aml/isms-auth-management" },
    ],
    evidence: [
      { kind: "standard", rule: "VASP 신고와 개인정보 안전조치는 2026-08-14 현재 시행 조문·관할·대상 범위를 함께 표시한다." },
      { kind: "primary-source", rule: "ISMS 결함·증적 해설은 KISA 안내서에 귀속하고 익명 경험담을 보편 심사 규칙으로 만들지 않는다." },
      { kind: "project-claim", rule: "제품 도입·scanner pass·wallet 이름·캡처 한 장을 통제 효과나 신고 수리 보장으로 확대하지 않는다." },
    ],
  },
  "isms-access-control": {
    title: "접근통제 글이 소유하는 범위",
    owns: [
      "Identity·session·policy decision·enforcement·audit·revocation의 request path",
      "직접·역할 grant와 조건·deny를 적용한 effective permission set",
      "Network reachability 경계와 privileged DB session·entitlement reconciliation",
    ],
    reuses: [
      { label: "인증 factor와 account lifecycle", href: "/isms-aml/isms-auth-management" },
      { label: "ISMS control-evidence chain", href: "/isms-aml/isms-overview#protection-measures" },
      { label: "VASP DB·wallet trace 적용", href: "/isms-aml/isms-practical-guide" },
    ],
    evidence: [
      { kind: "standard", rule: "국내 최소 권한·기록 요구는 제2026-9호 고시에, zero-trust 설계는 별도 NIST 기술 reference에 귀속한다." },
      { kind: "primary-source", rule: "KISA 2023.11 접근통제 해설은 2026-08-14 시행 법령·실제 위험평가와 함께 적용한다." },
      { kind: "project-claim", rule: "VPN·동일 zone·RBAC role·접근제어 제품을 identity·업무 authorization·감사 효과의 보장으로 확대하지 않는다." },
    ],
  },
  "isms-auth-management": {
    title: "인증·계정관리 글이 소유하는 범위",
    owns: [
      "Authentication·authorization 경계와 factor 독립성·phishing resistance",
      "Online rate limit와 offline password-hash 비용·migration·reset 경로",
      "Joiner·mover·leaver에서 account·authenticator·token·grant를 회수하는 lifecycle",
    ],
    reuses: [
      { label: "Resource-action 권한과 JIT session", href: "/isms-aml/isms-access-control" },
      { label: "ISMS 위험·control evidence loop", href: "/isms-aml/isms-overview" },
      { label: "VASP crypto·wallet 적용", href: "/isms-aml/isms-practical-guide#crypto-auth" },
    ],
    evidence: [
      { kind: "standard", rule: "국내 계정·인증 최소선과 NIST SP 800-63B-4의 미국 기술 지침을 관할·적용 범위가 다른 근거로 분리한다." },
      { kind: "primary-source", rule: "KISA password 심사 해설은 확인 시점 시행 규정·계정 위험·계약 의무와 함께 versioning한다." },
      { kind: "project-claim", rule: "MFA·biometric·OTP·주기 변경·hash algorithm 이름을 phishing resistance·권한 정당성·credential 전수회수로 확대하지 않는다." },
    ],
  },
  "kademlia": {
    title: "Kademlia XOR distance와 routing table 글이 소유하는 범위",
    owns: [
      "XOR ID distance와 LogDist의 prefix 해석",
      "거리 구간별 bounded k-bucket 표본과 구현 parameter 경계",
      "Live entry·replacement·revalidation의 routing table 수명 주기",
    ],
    reuses: [
      { label: "반복 FIND_NODE shortlist와 종료", href: "/p2p/kad-lookup" },
      { label: "Sybil·Eclipse 위협과 diversity 방어", href: "/p2p/dht-security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "XOR metric·k-bucket 분석은 Kademlia 원 논문에, bucketSize·IP quota·replacement는 확인한 geth source revision에 분리해 귀속한다." },
      { kind: "project-claim", rule: "XOR proximity·old-node preference·IP quota를 낮은 latency·정직성·Sybil 방지의 보장으로 확대하지 않는다." },
    ],
  },
  "kad-lookup": {
    title: "Kademlia iterative lookup 글이 소유하는 범위",
    owns: [
      "Target distance shortlist와 후보별 query 상태",
      "Alpha 병렬 FIND_NODE round·unique merge·bounded termination",
      "Bootstrap·refresh·timeout·late response lookup receipt",
    ],
    reuses: [
      { label: "XOR distance와 k-bucket seed", href: "/p2p/kademlia" },
      { label: "Adversarial response와 view capture", href: "/p2p/dht-security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Iterative algorithm은 Kademlia paper에, geth scheduling·wire·validation behavior는 배포 SHA의 공식 source에 각각 귀속한다." },
      { kind: "project-claim", rule: "기대 logarithmic path를 partition·high churn·adversarial topology의 고정 round·메시지 SLO로 확대하지 않는다." },
    ],
  },
  "dht-security": {
    title: "DHT Sybil·Eclipse 방어 글이 소유하는 범위",
    owns: [
      "Entity와 identity 독립성의 Sybil 경계",
      "Bootstrap·neighbor·lookup view capture의 Eclipse 경로",
      "Network diversity와 honest availability를 함께 검증하는 release gate",
    ],
    reuses: [
      { label: "Kademlia routing slot과 entry lifecycle", href: "/p2p/kademlia" },
      { label: "Kademlia query shortlist와 timeout", href: "/p2p/kad-lookup" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Sybil 개념은 Douceur paper, Eclipse 구현 수치는 당시 Bitcoin paper, geth quota는 current source에 범위를 나눠 귀속한다." },
      { kind: "project-claim", rule: "IP·ASN diversity·peer score·replacement를 identity 독립성이나 공격 불가능성의 증명으로 확대하지 않는다." },
    ],
  },
  "gossip-fundamentals": {
    title: "Epidemic dissemination과 GossipSub 글이 소유하는 범위",
    owns: [
      "Push·pull epidemic 전파의 직관·평균장 전제·한계",
      "Membership·overlay·broadcast protocol의 역할 분리",
      "GossipSub topic mesh·IHAVE/IWANT·validation·peer score 운영",
    ],
    reuses: [
      { label: "Sybil identity와 network diversity 경계", href: "/p2p/dht-security" },
      { label: "rust-libp2p Swarm의 protocol state owner", href: "/p2p/libp2p" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Epidemic·SWIM 결과는 각 논문 model에, GossipSub parameter·control action은 명시한 specification version에 귀속한다." },
      { kind: "project-measurement", rule: "Delivery SLO는 topology·traffic·loss·churn·validator·version을 고정해 latency·미전달·duplicate bytes·CPU를 함께 측정한다." },
      { kind: "project-claim", rule: "Peer score를 정직성 확률·Sybil 제거·application validity의 자동 보장으로 확대하지 않는다." },
    ],
  },
  "bittorrent": {
    title: "BitTorrent metainfo·discovery·peer-wire 글이 소유하는 범위",
    owns: [
      "BEP 3 v1 metainfo·info-hash·piece hash의 payload 식별과 무결성 경계",
      "Tracker·BEP 5 DHT endpoint discovery와 peer handshake·transport의 분리",
      "Block request·piece 조립·typed timeout/hash-failure retry 운영",
    ],
    reuses: [
      { label: "Kademlia XOR routing과 k-bucket", href: "/p2p/kademlia" },
      { label: "Kademlia iterative shortlist·timeout", href: "/p2p/kad-lookup" },
      { label: "DHT Sybil·Eclipse와 peer 독립성", href: "/p2p/dht-security" },
    ],
    evidence: [
      { kind: "standard", rule: "Metainfo·wire는 BEP 3 v1에, trackerless discovery는 Accepted BEP 5에 귀속하고 BEP 52 v2·extension profile을 섞지 않는다." },
      { kind: "project-claim", rule: "Tracker·DHT endpoint 수, peer ID, piece hash 성공을 seeder 존재·독립 operator·안전한 content·고정 completion time으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Scheduler·retry 변경은 같은 torrent·peer fixture에서 completion time·duplicate/hash-failure bytes·timeout·resource를 paired 비교한다." },
    ],
  },
  "discv4": {
    title: "Ethereum Node Discovery v4 글이 소유하는 범위",
    owns: [
      "Signed plaintext UDP packet envelope와 1280-byte wire validation",
      "Recent PING/PONG endpoint proof와 amplification reply gating",
      "FINDNODE·NEIGHBORS discovery와 signed ENR sequence update",
    ],
    reuses: [
      { label: "Kademlia XOR distance와 routing table", href: "/p2p/kademlia" },
      { label: "Iterative lookup shortlist와 종료 receipt", href: "/p2p/kad-lookup" },
      { label: "DHT view capture와 diversity boundary", href: "/p2p/dht-security" },
    ],
    evidence: [
      { kind: "standard", rule: "Packet·endpoint proof·lookup은 current devp2p discv4 specification에, ENR record는 ENR specification과 identity scheme에 분리해 귀속한다." },
      { kind: "project-claim", rule: "Packet signature·최근 PONG·높은 ENR sequence를 confidentiality·peer honesty·chain compatibility·영구 reachability로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Timeout·clock·multi-datagram·amplification 동작은 protocol version과 client SHA를 고정한 packet fixture에서 traffic·accept/reject를 측정한다." },
    ],
  },
  "discv5": {
    title: "Ethereum Node Discovery v5.1 글이 소유하는 범위",
    owns: [
      "WHOAREYOU challenge·identity proof·optional ENR handshake lifecycle",
      "Ephemeral-static ECDH와 transcript-bound directional AES-GCM key schedule",
      "Distance-list FINDNODE·multi-packet NODES와 bounded TALK extension",
    ],
    reuses: [
      { label: "Ethereum Node Record structure", href: "/p2p/discv4#enr" },
      { label: "Kademlia iterative shortlist와 timeout", href: "/p2p/kad-lookup" },
      { label: "Discv4 signed plaintext 비교", href: "/p2p/discv4#wire" },
    ],
    evidence: [
      { kind: "standard", rule: "Packet·message semantics는 devp2p v5.1 wire에, handshake·key cache·lookup algorithm은 같은 revision의 theory 문서에 귀속한다." },
      { kind: "project-claim", rule: "Encrypted discovery session을 상위 transport security·application compatibility·Sybil resistance·고정 lookup success로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Reorder·cache eviction·nonce·partial NODES·TALK resource 동작은 spec revision과 client SHA를 고정해 typed outcome으로 비교한다." },
    ],
  },
  "nat-traversal": {
    title: "NAT traversal·ICE·DCUtR 글이 소유하는 범위",
    owns: [
      "NAT mapping·filtering separation과 STUN observed address evidence",
      "TURN allocation·permission·refresh lifecycle과 ICE checklist·nomination",
      "libp2p DCUtR relay-coordinated simultaneous dial·retry·migration",
    ],
    reuses: [
      { label: "libp2p Circuit Relay·Swarm 상태 owner", href: "/p2p/libp2p" },
      { label: "분산 failure·timeout model", href: "/blockchain/distributed-systems" },
      { label: "Peer identity·Sybil 독립성 경계", href: "/p2p/dht-security#sybil" },
    ],
    evidence: [
      { kind: "standard", rule: "STUN·TURN·ICE는 각각 RFC 8489·8656·8445에, DCUtR는 Active revision r1 libp2p specification에 귀속한다." },
      { kind: "project-claim", rule: "Cone 이름·STUN address·높은 ICE priority·simultaneous dial을 direct success·peer identity·relay-free liveness 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Direct·relay 선택은 mapping/filtering fixture와 같은 peers·payload에서 connection time·loss·relay bytes·lifecycle·security parity로 비교한다." },
    ],
  },
  "rollup-fundamentals": {
    title: "Rollup fundamentals 글이 소유하는 범위",
    owns: [
      "L2 execution·L1 data availability·settlement의 책임과 finality 분리",
      "L1 input에서 L2 payload를 재현하는 deterministic derivation·reorg reset",
      "Optimistic fault proof와 validity proof의 검증 경계·운영 비교",
    ],
    reuses: [
      { label: "Consensus fork choice와 finality 분리", href: "/blockchain/consensus-mechanisms#pow" },
      { label: "Data availability sampling의 증거 경계", href: "/blockchain/erasure-coding#two-dimensional" },
      { label: "EIP-4844 transaction·sidecar binding", href: "/blockchain/reth-eip4844#overview" },
    ],
    evidence: [
      { kind: "standard", rule: "Derivation·fault-proof 단계는 대상 OP Stack fork와 spec version을 고정하고 다른 rollup으로 일반화하지 않는다." },
      { kind: "primary-source", rule: "Optimistic·validity 비교는 공식 protocol spec의 claim·proof·DA·finality 의미에 귀속한다." },
      { kind: "project-claim", rule: "Proof 방식 이름을 privacy·availability·sequencer liveness·고정 withdrawal latency의 보장으로 확대하지 않는다." },
    ],
  },
  "da-theory": {
    title: "Data availability theory 글이 소유하는 범위",
    owns: [
      "Authenticity·encoding validity·network availability의 proof·receipt 분리",
      "EIP-4844 full sidecar download와 PeerDAS 1D column sampling 경계",
      "Celestia 2D extended data square와 sampling 전제의 비교",
    ],
    reuses: [
      { label: "Reed–Solomon·rate·2D extension", href: "/blockchain/erasure-coding" },
      { label: "Finite-field polynomial 표현", href: "/crypto/finite-field-theory#polynomial" },
      { label: "EIP-4844 versioned-hash binding", href: "/blockchain/reth-eip4844#versioned-binding" },
    ],
    evidence: [
      { kind: "standard", rule: "EIP-4844·EIP-7594와 Celestia app의 encoding·sample 단위를 버전별 공식 규격에 귀속한다." },
      { kind: "primary-source", rule: "2D DAS와 KZG의 보장은 원 논문의 model·setup·network assumptions 안에서만 해석한다." },
      { kind: "project-claim", rule: "KZG proof 성공이나 sample 성공을 전체 availability·valid encoding·application validity로 확대하지 않는다." },
    ],
  },
  "longest-chain": {
    title: "PoW longest-chain 글이 소유하는 범위",
    owns: [
      "Valid branch의 target-derived block work와 cumulative chainwork 선택",
      "Deficit·hash share 기반 catch-up 확률과 whitepaper 모델의 차이",
      "Common prefix theorem의 proof idea·timing assumptions·failure counterexample",
    ],
    reuses: [
      { label: "Permissionless Sybil resource·PoW 기초", href: "/blockchain/consensus-mechanisms#pow" },
      { label: "분산 timing·failure model", href: "/blockchain/distributed-systems" },
      { label: "Safety·liveness와 quorum 기초", href: "/blockchain/smr-theory" },
    ],
    evidence: [
      { kind: "standard", rule: "Chainwork 구현식은 Bitcoin Core의 exact commit·target encoding·difficulty rule을 함께 pin한다." },
      { kind: "primary-source", rule: "Catch-up·common-prefix bound는 whitepaper와 Backbone 논문의 서로 다른 시작 상태·network model에 귀속한다." },
      { kind: "project-claim", rule: "고정 confirmation 수를 모든 hash share·partition·eclipse·금액에서 deterministic finality로 표현하지 않는다." },
    ],
  },
  "dezero-autodiff": {
    title: "DeZero Rust 자동미분 글이 소유하는 범위",
    owns: [
      "DeZero 교육 흐름을 Rust Variable·Function·generation graph로 옮긴 구현 계약",
      "Fan-out gradient 누적·retain_grad·고차미분 recording mode의 수명 경계",
      "Rc·RefCell·Weak graph 소유권과 중첩·panic-safe recording guard",
    ],
    reuses: [
      { label: "Chain rule·reverse-mode autodiff 수학", href: "/ai/reverse-mode-autodiff#reverse-mode" },
      { label: "함수 합성 기초", href: "/ai/math-functions-composition" },
      { label: "Derivative·chain rule", href: "/ai/math-functions-derivatives-gradients" },
      { label: "Gradient·Jacobian", href: "/ai/math-gradients-jacobians" },
      { label: "DeZero Layer·optimizer 확장", href: "/ai/dezero-nn" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DeZero 기능 계보는 원 프로젝트에, production autograd 동작은 해당 framework 공식 문서와 version에 각각 귀속한다." },
      { kind: "project-claim", rule: "이 Rust 예제의 API·ownership·수치 결과를 공식 DeZero port나 production 안정성 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Forward·gradient·수명·panic 복원은 고정 analytic·finite-difference·reference-count fixture에서 비교한다." },
    ],
  },
  "dezero-nn": {
    title: "DeZero Rust 신경망 기본 글이 소유하는 범위",
    owns: [
      "Layer 재귀 parameter 등록·stable identity와 optimizer state binding",
      "Linear shape·broadcast·초기화와 activation forward/backward parity",
      "Training step·checkpoint state closure·continuous/resume release gate",
    ],
    reuses: [
      { label: "Variable·Function 자동미분", href: "/ai/dezero-autodiff" },
      { label: "Optimizer·Adam·AdamW 정본", href: "/ai/optimizers" },
      { label: "Regularization 비교", href: "/ai/regularization-practice" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Xavier·Adam·AdamW claim은 각 원 논문의 architecture·optimizer·실험 조건으로 제한한다." },
      { kind: "project-claim", rule: "교육용 RNG·API·toy loss 감소를 production framework의 재현성·품질·성능으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Shape·gradient·parameter coverage·resume parity를 같은 seed·batch·precision·manifest에서 비교한다." },
    ],
  },
  "dezero-advanced": {
    title: "DeZero Rust 상태형 Layer 글이 소유하는 범위",
    owns: [
      "RNN·LSTM state의 reset·carry·detach 수명과 분리·fused gate parity",
      "LayerNorm feature 축·backward cache와 constant-input 수치 경계",
      "Dropout mode·RNG checkpoint와 Embedding lookup·scatter-add 규칙",
    ],
    reuses: [
      { label: "RNN state·time unrolling", href: "/ai/rnn" },
      { label: "BPTT·Jacobian·truncation", href: "/ai/bptt" },
      { label: "LSTM gate와 cell-state 수학", href: "/ai/lstm" },
      { label: "Dropout 정본", href: "/ai/dropout-regularization" },
      { label: "DeZero parameter·optimizer 기반", href: "/ai/dezero-nn" },
    ],
    evidence: [
      { kind: "primary-source", rule: "LSTM·LayerNorm·Dropout 구조와 효과는 각 원 논문의 정의·task·실험 범위로 제한한다." },
      { kind: "project-claim", rule: "교육용 구현의 state·mode API를 특정 production framework와 동일하거나 보편적 최적 설계로 표현하지 않는다." },
      { kind: "project-measurement", rule: "Gate fusion·normalization·dropout·embedding은 동일 weight·state·RNG·fixture의 forward·gradient·resume parity로 검증한다." },
    ],
  },
  "eda-workflow": {
    title: "EDA workflow 글이 소유하는 범위",
    owns: [
      "Analysis unit·reference population·target 시점과 group·time split 입구",
      "Distribution·outlier·association·missingness를 slice와 생성 과정에 연결하는 진단",
      "Fold-local transform과 가설·effect·uncertainty·holdout evidence ledger",
    ],
    reuses: [
      { label: "확률변수·평균", href: "/ai/math-random-variables-expectation" },
      { label: "분산·표본평균", href: "/ai/math-variance-sampling" },
      { label: "Train·validation·test 기초", href: "/ai/train-validation-test" },
      { label: "Feature engineering 적용", href: "/ai/feature-engineering" },
      { label: "Time cutoff·rolling-origin", href: "/ai/time-features" },
    ],
    evidence: [
      { kind: "primary-source", rule: "EDA 기법은 NIST handbook의 통계 가정과 scikit-learn 공식 preprocessing boundary에 귀속한다." },
      { kind: "project-claim", rule: "Plot·correlation·missing-rate·p-value를 causal conclusion, 자동 삭제·대체 규칙이나 production 성능으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "모든 변환·가설은 고정 data version·unit·split·slice·metric·holdout과 변경 행 receipt로 비교한다." },
    ],
  },
  "claw-recovery": {
    title: "Claw Code recovery·stale branch 글이 소유하는 범위",
    owns: [
      "Pinned recovery recipe·attempt ledger와 실제 enum·attempt-state snapshot",
      "Pinned ahead·behind 기반 stale/diverged 판정과 policy action의 실제 범위",
      "Recovery effect reconciliation·escalation evidence·paired release hardening 계약",
    ],
    reuses: [
      { label: "Agent run·artifact·verifier 계약", href: "/ai/llm-harness" },
      { label: "Checkpoint·replay·external effect 경계", href: "/ai/agent-frameworks#langchain" },
      { label: "Permission·approval enforcement", href: "/ai/claw-permissions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Recipe·ledger·branch freshness 주장은 pinned b71afdd recovery_recipes.rs와 stale_branch.rs 범위에만 귀속한다." },
      { kind: "project-claim", rule: "Checkpoint·rollback·durable lease·incident acknowledgement는 pinned 구현 완료가 아니라 필요한 hardening contract다." },
      { kind: "project-measurement", rule: "같은 failure fixture에서 attempt·effect receipt·verifier·escalation과 base/candidate rollback artifact를 비교한다." },
    ],
  },
  "claw-task-team": {
    title: "Claw Code task packet·registry·team cron 글이 소유하는 범위",
    owns: [
      "Pinned TaskPacket schema·validation과 legacy-compatible field contract",
      "Pinned task registry·lane status projection과 in-memory/durable boundary",
      "Pinned team cron registry snapshot과 idempotent scheduling·verification hardening",
    ],
    reuses: [
      { label: "Executable plan·dependency graph", href: "/ai/agent-plan-replanning#executable-plan" },
      { label: "Delegation artifact ownership", href: "/ai/agent-delegation-contracts#delegation-contract" },
      { label: "Layered verification", href: "/ai/agent-verification#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "TaskPacket·registry·cron behavior는 pinned b71afdd source와 same-commit tests에만 귀속한다." },
      { kind: "project-claim", rule: "Distributed CAS·transactional outbox·durable lease·exactly-once cron은 구현 사실이 아니라 gap으로 표시한다." },
      { kind: "project-measurement", rule: "중복 create·cycle·stale lease·overlap·crash·partial verifier fixture에서 state와 effect를 재검사한다." },
    ],
  },
  "claw-subagent-orchestration": {
    title: "Claw Code sub-agent orchestration 글이 소유하는 범위",
    owns: [
      "Pinned claw-analog sequential split-session agent runner의 실제 source 범위",
      "Main·coordinator·worker artifact join과 hard-constraint-first selection 계약",
      "Delegation budget·capability·cancellation·late-result release gate",
    ],
    reuses: [
      { label: "Agent delegation·artifact ownership", href: "/ai/agent-delegation-contracts#delegation-contract" },
      { label: "Task packet·registry", href: "/ai/claw-task-team" },
      { label: "Permission·authority ceiling", href: "/ai/claw-permissions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Pinned agents.rs는 agent spec·permission default·split session과 순차 run만 뒷받침하며 generic parallel team runtime을 증명하지 않는다." },
      { kind: "standard", rule: "Anthropic multi-agent research 사례는 orchestrator-worker 설계와 평가 경험을 제공하지만 Claw 구현 근거가 아니다." },
      { kind: "project-measurement", rule: "Single-agent baseline과 같은 task graph의 parallel candidate를 품질·latency·token·merge conflict·permission violation으로 paired 비교한다." },
    ],
  },
  "claw-telemetry": {
    title: "Claw Code telemetry·usage ledger 글이 소유하는 범위",
    owns: [
      "Pinned TelemetryEvent·sink·JSONL/memory surface와 실제 trace-record snapshot",
      "Pinned usage counter·provider response identity와 estimate/observed 경계",
      "Trace identity·metric cardinality·versioned pricing·observability-loss release 계약",
    ],
    reuses: [
      { label: "Run artifact provenance", href: "/ai/experiment-tracking" },
      { label: "Agent trajectory·effect evaluation", href: "/ai/agent-verification#trajectory-effect" },
      { label: "Provider request·stream identity", href: "/ai/claw-api-client" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Telemetry/usage claim은 pinned telemetry crate와 runtime usage.rs source 범위에만 귀속한다." },
      { kind: "standard", rule: "OpenTelemetry trace·metric·log와 GenAI semantic convention은 표준 signal vocabulary만 뒷받침하고 Claw exporter correctness를 인증하지 않는다." },
      { kind: "project-measurement", rule: "Drop·duplicate·retry·high-cardinality·pricing drift·flush failure를 주입해 execution non-blocking과 ledger reconciliation을 확인한다." },
    ],
  },
  "claw-hooks": {
    title: "Claw Code hook event·subprocess·override 글이 소유하는 범위",
    owns: [
      "Pinned PreToolUse·PostToolUse·PostToolUseFailure event와 matcher·순차 runner",
      "Pinned shell·JSON stdin·environment·stdout·exit status protocol과 결과 합성",
      "Updated input 재승인, deadline·process-tree·effect cleanup hardening gap",
    ],
    reuses: [
      { label: "Permission policy·context override", href: "/ai/claw-permissions" },
      { label: "Tool schema·effect enforcement", href: "/ai/claw-tool-system" },
      { label: "Shell process lifecycle", href: "/ai/claw-bash" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Hook event·protocol·합성·cancel 주장은 pinned b71afdd hooks.rs와 같은 commit test 범위에만 귀속한다." },
      { kind: "project-claim", rule: "Monotonic permission merge·malformed-output fail-closed·timeout·sandbox·descendant cleanup·updatedInput 재승인은 확인된 구현이 아니라 gap으로 표시한다." },
      { kind: "project-measurement", rule: "같은 hook·tool·environment에서 output·exit·cancel을 주입해 executor count와 decision·input·cleanup receipt를 base/candidate로 비교한다." },
    ],
  },
  "claw-mcp": {
    title: "Claw Code MCP lifecycle·transport·tool bridge 글이 소유하는 범위",
    owns: [
      "Pinned server bootstrap·stdio manager·discovery·call·shutdown lifecycle",
      "Pinned Content-Length frame·JSON-RPC version/ID correlation과 revision 경계",
      "Qualified tool identity·server generation과 degraded retry hardening",
    ],
    reuses: [
      { label: "MCP schema·result 일반 계약", href: "/ai/mcp" },
      { label: "Extension tool adapter identity", href: "/ai/claw-tool-system#plugin-tools" },
      { label: "Replay·external effect 경계", href: "/ai/agent-code-mode#effect-atomicity" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Claw MCP 동작은 pinned b71afdd mcp*.rs source와 같은 commit test 범위에만 귀속한다." },
      { kind: "standard", rule: "MCP 공식 문서는 링크된 revision의 transport·tool contract만 뒷받침하며 pinned Claw 호환을 인증하지 않는다." },
      { kind: "project-claim", rule: "Hardened lifecycle full integration·schema generation pin·write exactly-once retry는 구현 사실이 아니라 gap으로 표시한다." },
    ],
  },
  "claw-plugin": {
    title: "Claw Code plugin manifest·registry·process·lifecycle 글이 소유하는 범위",
    owns: [
      "Pinned Builtin·Bundled·External discovery, manifest validation과 enabled tool collision",
      "Pinned PluginTool process protocol과 requiredPermission enforcement gap",
      "Pinned init/shutdown 순서와 supply-chain·generation·degraded hardening",
    ],
    reuses: [
      { label: "Plugin distribution·permission 일반 경계", href: "/ai/agent-skills#plugins" },
      { label: "Claw permission executor seam", href: "/ai/claw-permissions#enforcer" },
      { label: "Claw hook lifecycle", href: "/ai/claw-hooks" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Plugin kind·manifest·registry·process·lifecycle 주장은 pinned b71afdd plugins crate와 같은 commit test에만 귀속한다." },
      { kind: "standard", rule: "SLSA는 일반 build provenance vocabulary만 제공하며 Claw external plugin의 준수를 인증하지 않는다." },
      { kind: "project-claim", rule: "Publisher signature·mandatory permission enforcement·sandbox·partial-init rollback·generation drain은 확인된 구현이 아니라 gap이다." },
    ],
  },
  "claw-policy-engine": {
    title: "Claw Code policy rule·lane context·green contract 글이 소유하는 범위",
    owns: [
      "Pinned boolean condition·stable priority·matching action·Chain expansion",
      "다중 action conflict arbitration과 LaneContext provenance gap",
      "Pinned GreenLevel·test/base/recovery/flake evidence conjunction",
    ],
    reuses: [
      { label: "Permission authorization decision", href: "/ai/claw-permissions" },
      { label: "Layered verifier·release gate", href: "/ai/agent-verification#release" },
      { label: "Run·test artifact provenance", href: "/ai/experiment-tracking#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Policy·green 동작은 pinned b71afdd policy_engine.rs·green_contract.rs와 같은 commit tests에만 귀속한다." },
      { kind: "project-claim", rule: "Unknown 3값 logic·deny-first arbitration·immutable provenance·executor generation binding은 확인된 구현이 아니라 gap으로 표시한다." },
      { kind: "project-measurement", rule: "같은 lane·rules·SHA·green evidence에 conflict·stale·forged outcome을 주입해 decision event와 executor effect를 비교한다." },
    ],
  },
  "hw-security": {
    title: "Hardware security threat model·Root of Trust·resilience 글이 소유하는 범위",
    owns: ["공격자·자산·property·비보장 threat-model 경계", "Root of Trust에서 protect·detect·recover로 이어지는 resilience", "Memory·Secure Boot·attestation을 결합한 evidence release gate"],
    reuses: [
      { label: "TCB·Measured Boot·PCR", href: "/tee/tee-tcb" },
      { label: "TEE private/shared memory", href: "/tee/tee-memory" },
      { label: "Remote attestation roles", href: "/tee/tee-attestation" },
    ],
    evidence: [
      { kind: "standard", rule: "Firmware protection·detection·recovery 주장은 NIST SP 800-193 범위에 한정한다." },
      { kind: "project-claim", rule: "제품 이름만으로 confidentiality·integrity·freshness·availability를 묶어 보장하지 않는다." },
      { kind: "project-measurement", rule: "Altered image·old TCB·reused nonce·debug·malformed evidence·host pause를 secret-release gate에 주입한다." },
    ],
  },
  "tee-tcb": {
    title: "Property-specific TCB·Secure/Measured Boot·PCR appraisal 글이 소유하는 범위",
    owns: ["보안 property별 TCB dependency closure", "Secure Boot와 Measured Boot의 동작 분리", "PCR extend·event-log replay·reference manifest appraisal"],
    reuses: [
      { label: "Hardware threat model·Root of Trust", href: "/tee/hw-security" },
      { label: "Attestation result와 authorization", href: "/tee/tee-attestation" },
    ],
    evidence: [
      { kind: "standard", rule: "PCR·event log 순서는 TCG PC Client Platform Firmware Profile 범위에 귀속한다." },
      { kind: "standard", rule: "Reference value는 TCG PC Client RIM의 boot-cycle 범위를 넘어 runtime correctness로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Reorder·omission·altered PCR·new/revoked reference fixture로 replay와 policy를 함께 검증한다." },
    ],
  },
  "tee-memory": {
    title: "TEE private/shared page·memory confidentiality/integrity 글이 소유하는 범위",
    owns: ["Private/shared page copy·validation lifecycle", "Address-tweaked encryption의 제한된 직관", "Integrity·ownership·freshness와 platform별 보호 단위·release gate"],
    reuses: [
      { label: "Security property와 threat model", href: "/tee/hw-security#threat-properties" },
      { label: "TCB component closure", href: "/tee/tee-tcb#tcb-closure" },
    ],
    evidence: [
      { kind: "primary-source", rule: "SEV-SNP field·state 주장은 AMD ABI 1.58에, TDX 주장은 선택한 Intel official revision에 한정한다." },
      { kind: "project-claim", rule: "단순화 XEX 식을 모든 vendor의 실제 algorithm·integrity structure로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Malicious shared input·page flip·conversion crash·counter replay에서 unauthorized private commit을 검사한다." },
    ],
  },
  "tee-attestation": {
    title: "RATS roles·freshness·vendor appraisal·secret release 글이 소유하는 범위",
    owns: ["Attester·Verifier·Relying Party와 evidence artifact 구분", "Nonce freshness와 workload/channel binding", "Vendor report normalization·collateral·policy release gate"],
    reuses: [
      { label: "Hardware threat/property boundary", href: "/tee/hw-security#threat-properties" },
      { label: "TCB·reference-value appraisal", href: "/tee/tee-tcb#pcr-log-appraisal" },
      { label: "TEE memory protection boundary", href: "/tee/tee-memory" },
    ],
    evidence: [
      { kind: "standard", rule: "Role·artifact·freshness vocabulary는 RFC 9334 범위이며 특정 wire protocol을 주장하지 않는다." },
      { kind: "primary-source", rule: "SNP report field 주장은 AMD ABI 1.58에 한정하고 타 vendor semantics로 일반화하지 않는다." },
      { kind: "project-measurement", rule: "Bad signature·replay·altered measurement·old TCB·debug·expired collateral·unknown field에서 false accept 0을 hard gate로 둔다." },
    ],
  },
  "hash-theory": {
    title: "Hash input·security game·construction 글이 소유하는 범위",
    owns: ["Canonical bit/byte input과 tuple ambiguity", "Preimage·second-preimage·collision generic boundary", "Merkle–Damgård·sponge construction과 hash release gate"],
    reuses: [{ label: "Merkle selective opening", href: "/crypto/merkle-tree" }, { label: "Poseidon field permutation", href: "/crypto/poseidon-hash" }],
    evidence: [{ kind: "standard", rule: "SHA-2/SHA-3 normative claim은 FIPS 180-4/202에 한정한다." }, { kind: "primary-source", rule: "Rust API claim은 pinned RustCrypto source에 한정한다." }, { kind: "project-measurement", rule: "Known vectors와 boundary/differential parity 뒤 성능을 비교한다." }],
  },
  "poseidon-hash": {
    title: "Poseidon profile·HADES round·field sponge 글이 소유하는 범위",
    owns: ["Poseidon parameter profile", "Power S-box permutation 조건과 MDS diffusion", "Full/partial HADES schedule과 release gate"],
    reuses: [{ label: "Prime field", href: "/crypto/finite-field" }, { label: "Sponge construction", href: "/crypto/hash-theory#constructions" }],
    evidence: [{ kind: "primary-source", rule: "Security·constraint claim은 Poseidon 원문 parameter model에 귀속한다." }, { kind: "primary-source", rule: "Poseidon2 source claim은 pinned commit에 한정한다." }, { kind: "project-measurement", rule: "Official vector·inverse·native/circuit parity 뒤 비용을 측정한다." }],
  },
  "impl-hash-commitment": {
    title: "Hash·Poseidon·Merkle 구현 경계 글이 소유하는 범위",
    owns: ["Rust streaming update/finalize contract", "Byte-to-field serialization boundary", "Merkle leaf/node prefix·index/direction implementation release gate"],
    reuses: [{ label: "Hash construction", href: "/crypto/hash-theory" }, { label: "Poseidon profile", href: "/crypto/poseidon-hash" }, { label: "Merkle selective opening", href: "/crypto/merkle-tree" }],
    evidence: [{ kind: "standard", rule: "SHA-2 semantics는 FIPS 180-4에 한정한다." }, { kind: "primary-source", rule: "구현 claim은 pinned arkworks source에 한정한다." }, { kind: "project-measurement", rule: "Malformed encoding/path parity와 reference differential 뒤 비용을 비교한다." }],
  },
  proofofsql: {
    title: "SQL relation·snapshot·opening·transcript 글이 소유하는 범위",
    owns: ["Typed SQL arithmetization", "Table snapshot schema와 Dory opening boundary", "SQL proof transcript와 correctness/performance release gate"],
    reuses: [{ label: "Multilinear extension와 sumcheck", href: "/crypto/hyperplonk" }, { label: "Fiat–Shamir", href: "/crypto/zk-theory#noninteractive-boundary" }, { label: "Commitment properties", href: "/crypto/crypto-primitives#merkle-commitment" }],
    evidence: [{ kind: "primary-source", rule: "지원 SQL/source claim은 pinned Proof-of-SQL commit에 한정한다." }, { kind: "primary-source", rule: "Dory opening claim은 원 논문의 group model에 한정한다." }, { kind: "project-claim", rule: "Proof를 privacy·data availability·freshness 보장으로 확대하지 않는다." }, { kind: "project-measurement", rule: "Wrong semantics/snapshot/result/opening/replay parity 뒤 단계별 비용을 측정한다." }],
  },
  bulletproofs: {
    title: "Bulletproofs range relation·IPA·aggregation 글이 소유하는 범위",
    owns: ["Committed value bit decomposition과 range relation", "Bulletproofs vector IPA와 logarithmic folding bound", "Aggregation transcript·range-proof release gate"],
    reuses: [{ label: "Pedersen hiding·binding", href: "/crypto/zk-theory#simulation" }, { label: "Dot product", href: "/ai/math-vectors-inner-products#dot-product" }, { label: "Fiat–Shamir statement binding", href: "/crypto/zk-theory#noninteractive-boundary" }],
    evidence: [{ kind: "primary-source", rule: "Protocol/security/benchmark claim은 Bulletproofs 원문 범위에 귀속한다." }, { kind: "primary-source", rule: "구현 claim은 pinned dalek commit의 Ristretto·transcript source에 한정한다." }, { kind: "project-measurement", rule: "Out-of-range·wrong commitment/domain/generator parity 뒤 prove/verify/bytes/RSS를 비교한다." }],
  },
  halo2: {
    title: "Halo2 columns·regions·proof profile 글이 소유하는 범위",
    owns: ["Typed columns·regions·rotations layout", "Gate·copy·lookup constraint boundary", "Pinned Zcash IPA keygen/prove/verify profile과 release gate"],
    reuses: [{ label: "PLONK selector·permutation", href: "/crypto/plonk" }, { label: "IPA PCS", href: "/crypto/polycommit#schemes" }, { label: "KZG profile contrast", href: "/crypto/polycommit#commit-open" }],
    evidence: [{ kind: "primary-source", rule: "Accumulation 배경은 Halo 원문, API/source claim은 pinned zcash/halo2 commit에 각각 귀속한다." }, { kind: "project-claim", rule: "Halo2 이름만으로 IPA/KZG·curve·proof format을 일반화하지 않는다." }, { kind: "project-measurement", rule: "Selector/copy/range/instance/key failure와 MockProver/real verifier parity 뒤 비용을 측정한다." }],
  },
  hyperplonk: {
    title: "HyperPlonk MLE·sumcheck·custom-gate 글이 소유하는 범위",
    owns: ["Boolean hypercube multilinear extension", "Sumcheck round와 degree/field soundness", "HyperPlonk gate/permutation/PCS boundary와 release gate"],
    reuses: [{ label: "PLONK gate·copy", href: "/crypto/plonk" }, { label: "Polynomial root bound", href: "/crypto/polynomial" }, { label: "Polynomial commitment", href: "/crypto/polycommit" }],
    evidence: [{ kind: "primary-source", rule: "Linear-time·custom gate·security claim은 HyperPlonk 원문 model에 귀속한다." }, { kind: "primary-source", rule: "구현 claim은 pinned Espresso source와 unaudited disclaimer에 한정한다." }, { kind: "project-measurement", rule: "Wrong round/degree/copy/opening parity 뒤 MLE/sumcheck/PCS phase와 RSS를 비교한다." }],
  },
  nova: {
    title: "Nova relaxed R1CS·NIFS·IVC 글이 소유하는 범위",
    owns: ["IVC state/step relation", "Relaxed R1CS cross term과 NIFS folding", "Folding·compression·ZK boundary와 resume release gate"],
    reuses: [{ label: "R1CS row", href: "/crypto/constraint-systems#r1cs" }, { label: "Commitment binding/hiding", href: "/crypto/zk-theory#simulation" }, { label: "SNARK succinctness cost", href: "/crypto/snark-overview#selection" }],
    evidence: [{ kind: "primary-source", rule: "Relaxed R1CS·NIFS·IVC claim은 Nova 원문 model에 귀속한다." }, { kind: "primary-source", rule: "Backend/source claim은 pinned microsoft/Nova commit에 한정한다." }, { kind: "project-measurement", rule: "Wrong state/index/T/E/challenge/resume parity 뒤 per-step과 final compression costs를 분리한다." }],
  },
  polycommit: {
    title: "Polynomial commitment interface·KZG·IPA 선택 글이 소유하는 범위",
    owns: ["Commit·Open·Verify와 evaluation claim의 소유권", "KZG quotient·pairing opening과 IPA inner-product opening", "Binding·hiding·degree·setup 분리와 PCS release gate"],
    reuses: [
      { label: "Prime-field polynomial과 root bound", href: "/crypto/polynomial" },
      { label: "Pairing bilinearity", href: "/crypto/elliptic-curves#g1-g2-bn254" },
      { label: "Commitment binding·hiding", href: "/crypto/crypto-primitives#merkle-commitment" },
    ],
    evidence: [
      { kind: "primary-source", rule: "KZG claim은 KZG 원문, IPA claim은 Halo 원문의 setup·group·security model 범위에 각각 귀속한다." },
      { kind: "project-claim", rule: "PCS라는 이름을 hiding·transparent setup·post-quantum·외부 statement validity로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Wrong value·point·degree·key·subgroup parity 뒤 setup/commit/open/verify·bytes·RSS를 같은 workload에서 비교한다." },
    ],
  },
  fri: {
    title: "FRI Reed–Solomon proximity·folding·query 글이 소유하는 범위",
    owns: ["RS oracle membership과 proximity claim", "Even/odd folding·Merkle query transcript", "Sampling intuition과 FRI 전체 soundness 경계·release gate"],
    reuses: [
      { label: "Polynomial coefficient·evaluation form", href: "/crypto/polynomial" },
      { label: "Reed–Solomon encoding", href: "/crypto/reed-solomon" },
      { label: "Merkle selective opening", href: "/crypto/crypto-primitives#merkle-commitment" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Folding·proximity·soundness claim은 FRI 원문의 field·domain·distance·oracle model 범위에 귀속한다." },
      { kind: "project-claim", rule: "FRI accept를 AIR completeness·program semantics·STARK 전체 zero knowledge로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Wrong pair·fold·root·path·final degree·round order parity 뒤 hash/query/proof 비용을 비교한다." },
    ],
  },
  "stark-theory": {
    title: "STARK trace·AIR·composition·LDE 파이프라인 글이 소유하는 범위",
    owns: ["Execution trace와 transition·boundary AIR", "Composition polynomial과 LDE·Merkle·FRI 연결", "Transparent/hash/ZK assumption 경계와 STARK release gate"],
    reuses: [
      { label: "Finite-field NTT·evaluation domain", href: "/crypto/fft#fft-domain" },
      { label: "FRI low-degree proximity", href: "/crypto/fri" },
      { label: "Relation·public input·witness", href: "/crypto/constraint-systems#overview" },
    ],
    evidence: [
      { kind: "primary-source", rule: "STARK pipeline claim은 STARK 원문, low-degree test claim은 FRI 원문의 모델과 parameter 범위에 각각 귀속한다." },
      { kind: "project-claim", rule: "Transparent를 assumption-free로, STARK를 자동 zero knowledge나 모든 구현의 post-quantum 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Trace·AIR·composition·domain·Merkle·FRI·transcript failure parity 뒤 phase time·RSS·proof bytes·verify cost를 측정한다." },
    ],
  },
  "zk-theory": {
    title: "Zero knowledge 정의·Sigma·simulation·Fiat–Shamir 글이 소유하는 범위",
    owns: ["Completeness·soundness·zero knowledge의 속성 분리", "Sigma special soundness와 simulator 정의", "Pedersen hiding/binding·Fiat–Shamir transcript·ZK release gate"],
    reuses: [
      { label: "Cyclic group·DLP", href: "/crypto/elliptic-curves" },
      { label: "Commitment binding·hiding", href: "/crypto/crypto-primitives#merkle-commitment" },
      { label: "SNARK property와 statement", href: "/crypto/snark-overview#security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Simulator 기반 ZK 정의는 GMR, hash challenge 변환은 Fiat–Shamir 원문의 protocol·model 범위에 귀속한다." },
      { kind: "project-claim", rule: "ZK theorem을 side channel·broken randomness·malformed encoding·context replay 방지로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Wrong witness·statement·subgroup·nonce reuse·context·round order·replay와 simulator distribution을 release 전에 검사한다." },
    ],
  },
  "constraint-systems": {
    title: "R1CS·QAP 제약 시스템 글이 소유하는 범위",
    owns: ["Relation의 public instance·private witness와 R1CS bilinear row", "Bit·range·integer gadget semantic boundary", "R1CS column interpolation과 QAP divisibility·semantic release gate"],
    reuses: [
      { label: "Prime-field arithmetic", href: "/crypto/finite-field-theory#prime-field" },
      { label: "Lagrange interpolation", href: "/crypto/lagrange#formula" },
      { label: "Vanishing polynomial·NTT domain", href: "/crypto/fft#fft-domain" },
    ],
    evidence: [
      { kind: "primary-source", rule: "QAP reduction과 performance claim은 Pinocchio 논문의 construction·application·당시 구현 범위에 귀속한다." },
      { kind: "project-claim", rule: "R1CS/QAP 만족을 원 program 의미·range·provenance나 zero knowledge로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Valid·invalid·boundary·public-order·remainder parity 뒤 constraints·memory·latency를 비교한다." },
    ],
  },
  "snark-overview": {
    title: "SNARK 공통 인터페이스·보안·선택 글이 소유하는 범위",
    owns: ["Setup·Prove·Verify와 relation/instance/witness 소유권", "Completeness·soundness·zero knowledge와 Fiat–Shamir statement binding", "Setup trust·succinctness·prover/verifier 비용의 계열 선택 envelope"],
    reuses: [
      { label: "R1CS·QAP relation", href: "/crypto/constraint-systems" },
      { label: "Commitment binding·hiding", href: "/crypto/crypto-primitives#merkle-commitment" },
      { label: "Fiat–Shamir commit-first 원리", href: "/crypto/crypto-primitives#schnorr" },
    ],
    evidence: [
      { kind: "primary-source", rule: "SNARK definition·construction claim은 SNARKs for C와 각 concrete system 원문의 model에 귀속한다." },
      { kind: "project-claim", rule: "Verifier accept를 external data provenance·authorization·회로 semantic completeness로 확대하지 않는다." },
      { kind: "project-measurement", rule: "같은 relation·security target·negative corpus에서 setup·prover·verifier·bytes를 함께 비교한다." },
    ],
  },
  groth16: {
    title: "Groth16 QAP·CRS·proof·pairing 글이 소유하는 범위",
    owns: ["Relation-specific CRS와 τ·α·β·γ·δ setup boundary", "QAP quotient와 A∈G1·B∈G2·C∈G1 proof", "Public-input IC linear combination·pairing equation·setup release gate"],
    reuses: [
      { label: "R1CS→QAP divisibility", href: "/crypto/constraint-systems#qap" },
      { label: "SNARK security properties", href: "/crypto/snark-overview#security" },
      { label: "G1·G2·pairing bilinearity", href: "/crypto/elliptic-curves#g1-g2-bn254" },
    ],
    evidence: [
      { kind: "primary-source", rule: "세-element proof·security·cost claim은 Groth16 원문의 CRS·group·model 범위에 귀속한다." },
      { kind: "primary-source", rule: "Verifier code path는 링크한 ark-groth16 crate/version source에만 고정하고 production audit로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Circuit/key hash·ceremony·point/input failure parity 뒤 setup/prove/verify breakdown을 측정한다." },
    ],
  },
  plonk: {
    title: "PLONK selector·permutation·quotient·opening 글이 소유하는 범위",
    owns: ["PLONKish selector gate와 witness table", "Copy constraint permutation grand product와 quotient identity", "PCS opening 분리·Fiat–Shamir round order·PLONK release gate"],
    reuses: [
      { label: "Finite-field roots-of-unity·NTT", href: "/crypto/fft#fft-domain" },
      { label: "Commitment binding·hiding", href: "/crypto/crypto-primitives#merkle-commitment" },
      { label: "KZG polynomial commitment", href: "/crypto/polycommit#kzg10" },
      { label: "SNARK statement-bound transcript", href: "/crypto/snark-overview#security" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Gate·permutation·universal SRS claim은 PLONK 원문, PCS claim은 KZG 원문의 assumptions 범위에 각각 귀속한다." },
      { kind: "project-claim", rule: "PLONKish라는 이름을 동일 lookup·PCS·round·proof size·보안 reduction으로 일반화하지 않는다." },
      { kind: "project-measurement", rule: "Wrong wire·copy·opening·subgroup·round-order failure parity 뒤 rows·degree·FFT/MSM·memory·verify를 비교한다." },
    ],
  },
  crt: {
    title: "CRT 글이 소유하는 범위",
    owns: [
      "정수 congruence·pairwise-coprime CRT의 존재와 modulo-product 유일성",
      "부분 곱·modular inverse selector를 이용한 구성과 non-coprime 반례",
      "RSA-CRT 재결합의 correctness·fault·side-channel·benchmark 경계",
    ],
    reuses: [
      { label: "Prime-field modular arithmetic와 inverse", href: "/crypto/finite-field-theory#prime-field" },
      { label: "Lagrange selector와 interpolation 유일성", href: "/crypto/lagrange#formula" },
      { label: "Finite-field implementation release gate", href: "/crypto/field-arithmetic#fr-scalar" },
    ],
    evidence: [
      { kind: "standard", rule: "RSA CRT parameter와 primitive 입력 범위는 RFC 8017 PKCS #1 v2.2에 귀속한다." },
      { kind: "project-claim", rule: "Pairwise-coprime 정리에서 RSA constant-time·fault resistance나 고정 speedup을 유도하지 않는다." },
      { kind: "project-measurement", rule: "Direct/CRT parity와 fault·timing gate 뒤 같은 key·backend·target에서 latency를 비교한다." },
    ],
  },
  karatsuba: {
    title: "Karatsuba 글이 소유하는 범위",
    owns: [
      "일반 high/low operand 분할과 네 곱→세 곱 bilinear 재결합",
      "T(n)=3T(n/2)+Theta(n)의 recurrence tree와 n^log2(3) bound",
      "Addition·carry·temporary·cache를 포함한 target별 crossover 선택",
    ],
    reuses: [
      { label: "Polynomial coefficient 표현", href: "/crypto/finite-field-theory#polynomial" },
      { label: "Fp² Karatsuba·inverse와 tower reduction", href: "/crypto/extension-fields#fp2" },
      { label: "더 큰 polynomial의 NTT product", href: "/crypto/fft#zk-usage" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Subquadratic multiplication의 역사적·점근적 주장은 Karatsuba–Ofman 원문 범위에 귀속한다." },
      { kind: "primary-source", rule: "Odd limb·sign·threshold 구현 설명은 GNU MP 6.3.0 manual 범위에 고정한다." },
      { kind: "project-measurement", rule: "Cutoff는 target·compiler·limb·allocation을 고정한 paired benchmark로 다시 측정한다." },
    ],
  },
  "sparse-multiplication": {
    title: "Sparse multiplication 글이 소유하는 범위",
    owns: [
      "Coefficient support와 support-aware convolution의 계산 경로",
      "Miller line의 profile-pinned Fp¹² slot을 sparse helper로 내리는 경계",
      "Partial-product 장부·Amdahl 상한·generic parity release gate",
    ],
    reuses: [
      { label: "Polynomial coefficient와 quotient arithmetic", href: "/crypto/finite-field-theory#polynomial" },
      { label: "Fp²→Fp¹² tower layout·non-residue", href: "/crypto/extension-fields#overview" },
      { label: "Miller loop와 pairing 전체 경로", href: "/crypto/pairing#miller-loop" },
    ],
    evidence: [
      { kind: "primary-source", rule: "구체 slot·helper claim은 ark-ff 0.5.0 commit 7ad88c46…의 Fp12 source에 고정한다." },
      { kind: "primary-source", rule: "Pairing sparse multiplication 성능 주장은 인용 논문의 curve·tower·platform 범위로 제한한다." },
      { kind: "project-measurement", rule: "Generic parity·wrong-slot negative fixture 뒤 operation·memory·Miller/pairing latency를 비교한다." },
    ],
  },
  "frobenius-optimization": {
    title: "Frobenius 최적화 글이 소유하는 범위",
    owns: [
      "Characteristic-p Frobenius automorphism의 직관·증명과 Fp^k cycle",
      "Embedding-degree 12 final exponent의 easy/hard factorization과 적용 전제",
      "무료라는 표현을 coefficient transform의 상대 비용으로 제한하는 경계",
    ],
    reuses: [
      { label: "Irreducible quotient extension field", href: "/crypto/finite-field-theory#extension-field" },
      { label: "Tower-basis Frobenius coefficient table", href: "/crypto/extension-fields#frobenius-optimization" },
      { label: "Pairing final exponentiation 전체 경로", href: "/crypto/pairing#final-exp" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Final exponent 최적화는 Scott et al.의 curve·factorization 범위에 귀속한다." },
      { kind: "primary-source", rule: "Degree·table dispatch 주장은 ark-ff 0.5.0 commit 7ad88c46… source에 고정한다." },
      { kind: "project-measurement", rule: "Basis·cycle·independent exponent parity 뒤 constant mul·load·cycle과 end-to-end final-exp를 측정한다." },
    ],
  },
  "claw-worker-boot": {
    title: "Claw worker boot·trust·prompt delivery 글이 소유하는 범위",
    owns: [
      "Pinned WorkerStatus·Ready-only send·terminal cue와 StartupEvidenceBundle의 actual snapshot",
      "Pinned path trust matcher와 repository identity·capability approval의 경계",
      "Prompt misdelivery·replay와 generation·deduplication hardening의 구분",
    ],
    reuses: [
      { label: "Subagent task·artifact join", href: "/ai/claw-subagent-orchestration#team-lead-workers" },
      { label: "Claw permission enforcement", href: "/ai/claw-permissions" },
      { label: "Recovery effect reconciliation", href: "/ai/claw-recovery" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Status·cue·replay·timeout 주장은 pinned b71afdd worker_boot.rs·trust_resolver.rs와 같은 commit test에만 귀속한다." },
      { kind: "project-claim", rule: "Repository identity, process generation, durable registry, real health probe와 exactly-once effect는 확인된 구현이 아니라 hardening gap이다." },
      { kind: "project-measurement", rule: "같은 terminal fixture·cwd·receipt에서 gate·wrong target·timeout·late result를 주입해 unauthorized send와 state receipt를 비교한다." },
    ],
  },
  "sparse-autoencoder": {
    title: "Sparse autoencoder 해석·평가 글이 소유하는 범위",
    owns: [
      "Activation hook measurement와 overcomplete sparse dictionary의 해석 계약",
      "Reconstruction·sparsity·dead latent·LM behavior의 quality frontier",
      "Feature observation·held-out control·steering intervention의 증거 ladder",
    ],
    reuses: [
      { label: "Autoencoder reconstruction 정본", href: "/ai/autoencoder#reconstruction" },
      { label: "Transformer residual 계산 경로", href: "/ai/transformer-architecture" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Superposition·Top-K·JumpReLU·steering 주장은 각 원 연구의 model·hook·corpus·SAE·intervention 조건으로 제한한다." },
      { kind: "standard", rule: "FVE·active count·LM loss recovery·held-out explanation·causal behavior를 서로 대체하지 않는 별도 평가 축으로 기록한다." },
      { kind: "project-measurement", rule: "SAE 후보는 같은 activation fixture에서 seed·width·sparsity frontier와 controlled steering side effect를 paired 비교한다." },
    ],
  },
  "yarn-rope-extension": {
    title: "RoPE·Position Interpolation·YaRN context 확장 글이 소유하는 범위",
    owns: [
      "RoPE 상대 회전 geometry와 dimension pair별 frequency·wavelength spectrum",
      "PI·NTK-aware·YaRN의 scaling 대상과 YaRN frequency ramp·attention compensation",
      "Long-context 위치·길이·task·serving paired release gate",
    ],
    reuses: [
      { label: "Scaled dot-product attention", href: "/ai/transformer-architecture#attention-boundary" },
      { label: "Lost in the middle 평가", href: "/ai/context-window-optimization#position" },
      { label: "Hybrid KV block 회수", href: "/ai/hybrid-kv-cache-allocation#kv-cache" },
    ],
    evidence: [
      { kind: "primary-source", rule: "RoPE·PI·YaRN 결과는 각 논문의 checkpoint·data·extension factor·evaluation 범위에만 귀속한다." },
      { kind: "standard", rule: "Runtime config는 model revision과 library version을 고정하고 resolved factor·original length·attention factor를 기록한다." },
      { kind: "project-measurement", rule: "Base/candidate를 위치·길이·task·short regression·KV·TTFT·concurrency의 같은 matrix에서 비교한다." },
    ],
  },
  "cuda-basics": {
    title: "CUDA host·kernel·thread·memory 입문 글이 소유하는 범위",
    owns: [
      "Host allocation·transfer·kernel launch·completion·result 회수 lifecycle",
      "Host↔device transfer를 포함한 end-to-end amortization과 workload 적합성",
      "CPU correctness parity 뒤 timeline·traffic·stall·throughput release gate",
    ],
    reuses: [
      { label: "CUDA grid·block·thread·warp 정본", href: "/gpu/cuda-thread-hierarchy" },
      { label: "Shared memory·coalescing·bank 정본", href: "/gpu/cuda-shared-memory" },
      { label: "Stream·event synchronization 정본", href: "/gpu/cuda-sync-streams" },
    ],
    evidence: [
      { kind: "standard", rule: "CUDA semantics와 optimization guidance는 Toolkit 12.8.1 archive와 target compute capability·device property를 함께 기록한다." },
      { kind: "primary-source", rule: "Sample code 주장은 NVIDIA cuda-samples v12.8 tag의 build 가능한 API demonstration 범위로 제한한다." },
      { kind: "project-measurement", rule: "Speedup은 같은 input·precision·compiler·driver·GPU에서 CPU parity와 H2D/kernel/D2H critical path를 paired 측정한 결과에만 귀속한다." },
    ],
  },
  "cuda-matrix-multiply": {
    title: "CUDA tiled GEMM 적용·측정 글이 소유하는 범위",
    owns: [
      "Matrix output의 2D thread mapping과 K reduction 실행 경로",
      "Shared tile reuse의 arithmetic-intensity budget과 partial-edge predication",
      "Naive·tiled·library 후보의 correctness-first kernel measurement gate",
    ],
    reuses: [
      { label: "Matrix multiplication 수학 정본", href: "/ai/math-matrices-svd#multiplication" },
      { label: "CUDA grid·block·2D index", href: "/gpu/cuda-thread-hierarchy#indexing-2d" },
      { label: "Shared memory·coalescing·bank", href: "/gpu/cuda-shared-memory" },
      { label: "Block barrier semantics", href: "/gpu/cuda-sync-streams#overview" },
      { label: "GPU Roofline·occupancy", href: "/gpu/gpu-architecture#gpu-peak-achieved-boundary" },
    ],
    evidence: [
      { kind: "standard", rule: "CUDA execution·barrier semantics는 Toolkit 12.8.1 archive와 target compute capability에 고정한다." },
      { kind: "primary-source", rule: "matrixMul sample은 v12.8 교육용 source 범위이며 production GEMM benchmark로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Tile 우위는 edge parity 뒤 동일 M/N/K·dtype·GPU에서 event time·traffic·FLOP/s·occupancy·end-to-end로 비교한다." },
    ],
  },
  "cuda-perf-analysis": {
    title: "CUDA 측정·병목 가설·ablation 글이 소유하는 범위",
    owns: [
      "Warm-up·CUDA event·CPU completion과 반복 분포의 timing protocol",
      "Achieved FLOP/s·bandwidth·actual traffic을 같은 경계에 둔 ledger",
      "Systems→Roofline/Amdahl→Compute counter→single change→release loop",
    ],
    reuses: [
      { label: "Host·device·kernel lifecycle", href: "/gpu/cuda-basics#execution-path" },
      { label: "GPU occupancy와 Roofline 정본", href: "/gpu/gpu-architecture#gpu-latency-hiding-occupancy" },
      { label: "GPU HBM·L2·shared·register hierarchy", href: "/gpu/gpu-architecture#gpu-memory-traffic-hierarchy" },
      { label: "Warp·SM SIMT 실행 정본", href: "/gpu/cuda-thread-hierarchy#overview" },
      { label: "Stream·event ordering", href: "/gpu/cuda-sync-streams#events" },
    ],
    evidence: [
      { kind: "standard", rule: "Timing·effective bandwidth는 CUDA Best Practices 12.8.1의 measurement semantics에 고정한다." },
      { kind: "primary-source", rule: "Profiler counter·replay 의미는 Nsight Systems/Compute 2025.1 guide와 supported target 범위에 귀속한다." },
      { kind: "project-measurement", rule: "Optimization candidate는 pinned workload·software·clock에서 parity, median/p95와 예상 counter 방향을 paired 비교한다." },
    ],
  },
  "cuda-register-pressure": {
    title: "CUDA register live range·residency·spill 글이 소유하는 범위",
    owns: [
      "Thread-local value의 live range overlap과 compiler register allocation",
      "Thread·warp·SM register 예산에서 resident warp 상한으로 가는 계산",
      "Residency 감소 뒤 local-address spill·cache·device-memory로 이어지는 경로",
    ],
    reuses: [
      { label: "GPU occupancy 정본", href: "/gpu/gpu-architecture#gpu-latency-hiding-occupancy" },
      { label: "GPU memory hierarchy", href: "/gpu/gpu-architecture#gpu-memory-traffic-hierarchy" },
      { label: "Warp·SM 실행 정본", href: "/gpu/cuda-thread-hierarchy#overview" },
      { label: "CUDA measurement protocol", href: "/gpu/cuda-perf-analysis#measurement-protocol" },
    ],
    evidence: [
      { kind: "standard", rule: "Register·local memory·residency 표현은 CUDA Programming Guide 12.8.1과 target compute capability·compiler report에 고정한다." },
      { kind: "primary-source", rule: "Profiler resource·scheduler·memory metric은 Nsight Compute 2025.1 semantics에 귀속한다." },
      { kind: "project-measurement", rule: "Registers/thread·spill·resident/eligible warps와 kernel·end-to-end elapsed를 같은 candidate receipt에서 비교한다." },
    ],
  },
  "cuda-kernel-fusion": {
    title: "CUDA small fusion·Megakernel 글이 소유하는 범위",
    owns: [
      "Intermediate HBM write/read를 없애는 small-fusion IO boundary",
      "이질적 stages의 live resource와 scheduling을 한 kernel이 소유하는 Megakernel trade-off",
      "FlashAttention의 tile-budgeted fusion과 model-wide Megakernel의 구분",
      "CUDA·CUTLASS/CuTe·Triton authoring layer의 책임 분리와 target별 선택 gate",
    ],
    reuses: [
      { label: "CUDA performance measurement", href: "/gpu/cuda-perf-analysis" },
      { label: "Register pressure", href: "/gpu/cuda-register-pressure" },
      { label: "GPU memory hierarchy", href: "/gpu/gpu-architecture#gpu-memory-traffic-hierarchy" },
    ],
    evidence: [
      { kind: "primary-source", rule: "FlashAttention은 attention 내부 IO-aware exact tile fusion 범위에만 귀속한다." },
      { kind: "standard", rule: "Fusion 후보의 timing·traffic·reference comparison은 CUDA Best Practices 12.8.1 경계에 고정한다." },
      { kind: "standard", rule: "CUTLASS/CuTe와 Triton의 programming-model 설명은 각 official documentation revision에 고정한다." },
      { kind: "project-measurement", rule: "Unfused·small fusion·Megakernel을 parity, median/p95, register·spill·shared·traffic·eligible-warp로 비교한다." },
    ],
  },
  "cfd-finite-volume-gpu": {
    title: "CFD finite-volume·GPU mapping 글이 소유하는 범위",
    owns: [
      "Mass·momentum·energy conservation을 control-volume flux balance로 읽는 출발점",
      "Shared face numerical flux의 finite-volume cell update와 CFL time-step budget",
      "Mesh stencil·connectivity·halo·linear-solver를 GPU memory/communication path에 연결하는 경계",
      "Code/solution verification·physical validation과 GPU performance를 분리한 release gate",
    ],
    reuses: [
      { label: "GPU memory hierarchy", href: "/gpu/gpu-architecture#gpu-memory-traffic-hierarchy" },
      { label: "CUDA kernel fusion", href: "/gpu/cuda-kernel-fusion" },
      { label: "CUDA register pressure", href: "/gpu/cuda-register-pressure" },
      { label: "CUDA performance measurement", href: "/gpu/cuda-perf-analysis" },
    ],
    evidence: [
      { kind: "primary-source", rule: "보존식 구성과 CFD 정의는 NASA Glenn의 공개 설명에 귀속하고 특정 closure·solver의 보편 타당성으로 확대하지 않는다." },
      { kind: "standard", rule: "Finite-volume implementation guidance는 확인한 OpenFOAM Foundation 문서 revision과 선택 scheme profile에 고정한다." },
      { kind: "project-measurement", rule: "GPU 후보는 conservation·manufactured/analytic refinement·experiment validation을 통과한 뒤 같은 residual 기준의 physical-time wall time과 memory·communication으로 비교한다." },
    ],
  },
  "cuda-persistent-kernels": {
    title: "CUDA persistent worker·queue·shutdown 글이 소유하는 범위",
    owns: [
      "Long-lived resident worker의 resource partition과 다른 GPU work progress 경계",
      "Bounded queue의 task ticket·backpressure·completion protocol",
      "Input close→in-flight drain→all-worker exit의 shutdown·failure contract",
    ],
    reuses: [
      { label: "CUDA kernel lifecycle", href: "/gpu/cuda-basics#execution-path" },
      { label: "CUDA atomic·synchronization", href: "/gpu/cuda-sync-streams" },
      { label: "Register·residency budget", href: "/gpu/cuda-register-pressure#residency" },
      { label: "Fusion과 Megakernel", href: "/gpu/cuda-kernel-fusion" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Persistent Threads 성능 결과는 2012년 평가 GPU·runtime·workload에 귀속한다." },
      { kind: "standard", rule: "Grid·block·atomic·memory-order semantics는 CUDA Programming Guide 12.8.1에 고정한다." },
      { kind: "project-measurement", rule: "Task loss·duplicate·ordering, queue depth·tail, 다른 stream progress와 clean shutdown을 launch 절감과 함께 검증한다." },
    ],
  },
  "gpu-arch-hopper": {
    title: "Hopper TMA·cluster·precision 적용 글이 소유하는 범위",
    owns: [
      "TMA descriptor·arrival barrier·multi-buffer producer–consumer pipeline",
      "Thread block cluster·DSM의 scope·residency·remote-access 경계",
      "Transformer Engine precision contract와 Hopper feature compatibility gate",
    ],
    reuses: [
      { label: "GPU SM·memory·occupancy 정본", href: "/gpu/gpu-architecture" },
      { label: "CUDA block·warp placement", href: "/gpu/cuda-thread-hierarchy" },
      { label: "Shared memory와 synchronization", href: "/gpu/cuda-shared-memory" },
    ],
    evidence: [
      { kind: "standard", rule: "TMA·cluster semantics는 CUDA/Hopper Tuning Guide 12.8.1과 actual compute capability에 고정한다." },
      { kind: "primary-source", rule: "Hopper peak·feature 주장은 NVIDIA whitepaper의 exact SKU·precision·sparsity 조건에 귀속한다." },
      { kind: "project-measurement", rule: "Feature path는 fallback·edge parity·quality 뒤 traffic·FLOP/s·occupancy·stall·end-to-end로 baseline과 비교한다." },
    ],
  },
  "hw-gpu-comparison": {
    title: "RTX 4090·5090·A100·H100 workload 선택 글이 소유하는 범위",
    owns: [
      "GPU 후보 비교용 workload envelope와 exact-SKU normalization",
      "Weight·state·workspace·headroom capacity와 multi-GPU fabric fit",
      "Quality·SLA·power·recovery·유효 작업당 비용의 procurement gate",
    ],
    reuses: [
      { label: "GPU Roofline·memory hierarchy", href: "/gpu/gpu-architecture#gpu-peak-achieved-boundary" },
      { label: "PCIe·NVLink·collective topology", href: "/gpu/gpu-collective-network" },
      { label: "Hopper TMA·Transformer Engine", href: "/gpu/gpu-arch-hopper" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Capacity·bandwidth·precision·power는 확인 시점 NVIDIA official page의 exact SKU·form factor에 고정한다." },
      { kind: "project-claim", rule: "AI TOPS·TFLOPS·link peak 비율을 application throughput·training speedup으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "구매 후보는 동일 trace·quality·runtime에서 achieved latency/throughput·power·fabric·failure와 시점별 비용을 비교한다." },
    ],
  },
  "bft-comparison": {
    title: "PBFT·HotStuff·Autobahn 비교 글이 소유하는 범위",
    owns: ["PBFT prepared/view-change, HotStuff chained-QC/pacemaker, Autobahn lane/cut의 같은 상태축 비교", "Membership·fault·workload를 고정한 BFT comparison envelope와 blip recovery 판단"],
    reuses: [{ label: "Process·failure·partial synchrony", href: "/blockchain/distributed-systems" }, { label: "BFT quorum·lock·view-change 정본", href: "/blockchain/bft-theory" }, { label: "DAG data/order 상세", href: "/blockchain/dag-consensus" }],
    evidence: [{ kind: "primary-source", rule: "PBFT·HotStuff·Autobahn 구조와 성능 주장은 각 원 논문의 model·implementation·evaluation 범위에 귀속한다." }, { kind: "project-measurement", rule: "우위 주장은 동일 membership·payload·arrival·fault trace에서 conflict 0 뒤 latency·throughput·bytes·CPU·recovery를 paired 측정한다." }, { kind: "project-claim", rule: "논문 간 TPS나 asymptotic authenticator 수를 end-to-end product 성능으로 확대하지 않는다." }],
  },
  "consensus-comparison": {
    title: "합의 protocol 종합 비교 글이 소유하는 범위",
    owns: ["Classical/DAG BFT·Nakamoto·sampling 계열의 membership·evidence·finality assumption matrix", "Client latency 분해와 같은 workload/fault의 protocol 선택 release gate"],
    reuses: [{ label: "Consensus safety·liveness", href: "/blockchain/distributed-systems#overview" }, { label: "SMR total order·apply", href: "/blockchain/smr-theory" }, { label: "Permissionless fork choice", href: "/blockchain/consensus-mechanisms" }],
    evidence: [{ kind: "primary-source", rule: "Partial synchrony와 Nakamoto confirmation은 DLS·Bitcoin 원문의 서로 다른 model 범위로 인용한다." }, { kind: "project-measurement", rule: "동일 client endpoint·payload·offered load·fault schedule에서 finality endpoint를 명시하고 paired 측정한다." }, { kind: "project-claim", rule: "결정적 certificate와 확률적 confirmation·sampling error를 동일 confidence 값으로 환산하지 않는다." }],
  },
  "dag-consensus": {
    title: "Narwhal·Bullshark DAG consensus 글이 소유하는 범위",
    owns: ["Certified DAG data availability, parent quorum overlap과 non-guarantee", "Bullshark anchor causal history·deterministic linearization과 certified/ordered/executed state separation"],
    reuses: [{ label: "BFT quorum certificate", href: "/blockchain/bft-theory#overview" }, { label: "Total-order broadcast와 deterministic SMR", href: "/blockchain/smr-theory" }, { label: "Protocol-wide 비교 envelope", href: "/blockchain/bft-comparison" }],
    evidence: [{ kind: "primary-source", rule: "Narwhal/Tusk·Bullshark 구성과 성능은 각 논문의 variant·synchrony·worker·WAN workload 범위에 귀속한다." }, { kind: "project-measurement", rule: "Offered·certified·committed·executed rate, arrival-order independence와 state-root parity 뒤 network·CPU·storage·GC를 비교한다." }, { kind: "project-claim", rule: "DAG width·certificate를 committed TPS·fair order·application validity로 확대하지 않는다." }],
  },
  "tendermint-bft": {
    title: "역사적 Tendermint round·lock 글이 소유하는 범위",
    owns: ["Height·round·step, weighted +2/3 prevote/precommit과 PoLC higher-round lock transition", "2014 Tendermint draft와 version-pinned CometBFT specification의 역사·현재 경계"],
    reuses: [{ label: "일반 BFT lock·partial-synchrony 정본", href: "/blockchain/bft-theory" }, { label: "현재 CometBFT runtime state machine", href: "/blockchain/cometbft-consensus" }, { label: "ABCI++ application 경계", href: "/blockchain/cometbft-abci" }],
    evidence: [{ kind: "primary-source", rule: "초기 설계는 outdated 표기의 2014 draft에, 현재 state-machine semantics는 링크한 CometBFT v0.38 spec에 귀속한다." }, { kind: "project-measurement", rule: "Release·SHA·genesis·historical voting power를 고정하고 equivocation·stale POLRound·timeout·restart에서 conflict 0·state parity·recovery를 검사한다." }, { kind: "project-claim", rule: "Consensus commit을 deterministic application·external exactly-once나 모든 CometBFT release의 동일 동작으로 확대하지 않는다." }],
  },
  "intel-sgx": {
    title: "Intel SGX vendor 적용 글이 소유하는 범위",
    owns: ["Enclave·EPC page lifecycle과 MRENCLAVE 중심 초기 identity", "ECALL/OCALL copy·validation·commit 및 SGX-specific release gate"],
    reuses: [{ label: "Hardware threat model", href: "/tee/hw-security" }, { label: "TEE memory property", href: "/tee/tee-memory" }, { label: "RATS attestation", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "EPC·ECALL/OCALL·DCAP semantics는 current Intel guide와 attestation service 문서 범위에 귀속한다." }, { kind: "project-measurement", rule: "같은 enclave·SDK·driver·CPU·collateral에서 bounds·OCALL 변조·replay·EPC pressure를 paired 검사한다." }, { kind: "project-claim", rule: "SGX를 application correctness·side-channel resistance·availability 보장으로 확대하지 않는다." }],
  },
  "amd-sev": {
    title: "AMD SEV-SNP vendor 적용 글이 소유하는 범위",
    owns: ["SEV→ES→SNP property 추가분과 guest/hypervisor boundary", "RMP page state·PVALIDATE·SNP report/TCB binding과 release gate"],
    reuses: [{ label: "TEE private/shared memory", href: "/tee/tee-memory" }, { label: "Vendor appraisal", href: "/tee/tee-attestation" }, { label: "TCB와 reference value", href: "/tee/tee-tcb" }],
    evidence: [{ kind: "primary-source", rule: "RMP·guest message·report field는 AMD SEV page와 SNP Firmware ABI 1.58 범위에 귀속한다." }, { kind: "project-measurement", rule: "CPU·firmware·guest·VMM·policy를 고정하고 wrong-owner·shared confusion·old TCB·transition crash를 paired 검사한다." }, { kind: "project-claim", rule: "SEV 세대별 property를 혼합하거나 memory encryption을 device·side-channel·DoS 방어로 확대하지 않는다." }],
  },
  "intel-tdx": {
    title: "Intel TDX vendor 적용 글이 소유하는 범위",
    owns: ["TD·host·SEAM/TDX module 책임과 private/shared GPA contract", "MRTD/RTMR·TDREPORT·module/CPU TCB binding과 release gate"],
    reuses: [{ label: "TEE TCB closure", href: "/tee/tee-tcb" }, { label: "TEE memory property", href: "/tee/tee-memory" }, { label: "RATS attestation", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "TDX architecture·ABI·attestation은 배포 module과 맞는 Intel baselined 문서 revision에 귀속한다." }, { kind: "project-measurement", rule: "Module·loader·CPU·firmware·guest·verifier를 고정하고 owner/shared/TCB/exit fixture를 paired 검사한다." }, { kind: "project-claim", rule: "Moving latest spec이나 TD quote를 배포 일치·application correctness·side-channel 안전 증명으로 쓰지 않는다." }],
  },
  "arm-cca": {
    title: "Arm CCA vendor 적용 글이 소유하는 범위",
    owns: ["Normal·Realm·RMM·EL3 responsibility와 RMI/RSI boundary", "GPT granule transition·Realm/platform token binding과 release gate"],
    reuses: [{ label: "TEE TCB closure", href: "/tee/tee-tcb" }, { label: "TEE memory lifecycle", href: "/tee/tee-memory" }, { label: "RATS 역할과 artifact", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "RME·GPT·RMM·token semantics는 링크한 Arm architecture/revision 범위에 귀속한다." }, { kind: "project-measurement", rule: "RMM·EL3·host·Realm·policy를 고정하고 granule·DMA·challenge·version drift를 paired 검사한다." }, { kind: "project-claim", rule: "Realm token을 device isolation·application correctness·side-channel·availability 보장으로 확대하지 않는다." }],
  },
  keylime: {
    title: "Keylime agent·verifier·IMA/boot policy·release 글이 소유하는 범위",
    owns: ["Keylime registrar/agent/verifier/tenant evidence flow", "Fresh TPM quote와 IMA·measured-boot policy appraisal", "Keylime-specific release·revocation gate"],
    reuses: [{ label: "TPM PCR·event log", href: "/tee/tee-tcb" }, { label: "RATS roles·channel binding", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "Keylime 동작은 current official architecture·verifier API·runtime IMA·measured-boot docs 범위에 귀속한다." }, { kind: "project-measurement", rule: "같은 agent·policy에서 replay·IMA drift·unknown boot image·recipient substitution을 검사한다." }, { kind: "project-claim", rule: "Quote/PCR replay 성공을 reference policy 적합성·business authorization으로 확대하지 않는다." }],
  },
  "tee-sealing": {
    title: "TEE sealing identity·blob·migration 글이 소유하는 범위",
    owns: ["MRENCLAVE/MRSIGNER identity policy와 SVN·purpose scope", "Sealing key context·AEAD blob·upgrade migration gate"],
    reuses: [{ label: "TEE memory·replay boundary", href: "/tee/tee-memory" }, { label: "Intel SGX identity", href: "/tee/intel-sgx" }],
    evidence: [{ kind: "primary-source", rule: "SGX sealing policy는 Intel official sealing 문서, AEAD는 NIST SP 800-38D 범위에 귀속한다." }, { kind: "project-measurement", rule: "Tag 변조·old blob·wrong signer/SVN·migration crash를 paired 검사한다." }, { kind: "project-claim", rule: "Sealing을 rollback protection·backup availability·side-channel defense로 확대하지 않는다." }],
  },
  "tee-sidechannel": {
    title: "TEE side-channel observable·mitigation 측정 글이 소유하는 범위",
    owns: ["Secret→microarchitectural state→measurement→inference leakage model", "Cache·transient execution 경계와 measurement release gate"],
    reuses: [{ label: "TEE private/shared memory", href: "/tee/tee-memory" }, { label: "Hardware threat model", href: "/tee/hw-security" }],
    evidence: [{ kind: "primary-source", rule: "Spectre와 cache-AES 주장은 원 논문의 공격 조건·실험 범위에 한정한다." }, { kind: "primary-source", rule: "Mitigation guidance는 current Intel secure-coding guidance 범위에 귀속한다." }, { kind: "project-measurement", rule: "Binary·CPU·microcode·clock·corpus를 고정하고 holdout leakage와 performance를 비교한다." }],
  },
  "isms-encryption": {
    title: "ISMS 데이터 보호·password hash·key lifecycle 글이 소유하는 범위",
    owns: ["Reversible data와 password primitive 선택", "DEK/KEK envelope와 rotation·backup·revoke·recovery gate"],
    reuses: [{ label: "암호학 기초", href: "/crypto/crypto-basics" }, { label: "인증 관리", href: "/isms-aml/isms-auth-management" }],
    evidence: [{ kind: "standard", rule: "Key lifecycle은 NIST SP 800-57 Part 1 Rev.5 범위에 귀속한다." }, { kind: "standard", rule: "Password·storage 권고는 검증 시점의 OWASP guidance로 versioning한다." }, { kind: "project-measurement", rule: "DB/hash 유출·unauthorized decrypt·partial rotation·backup loss를 재생한다." }],
  },
  "op-tee": {
    title: "OP-TEE TA runtime·storage 적용 글이 소유하는 범위",
    owns: ["TA context·session·command lifecycle과 shared-parameter validation", "Key purpose·secure-storage outcome과 OP-TEE-specific release gate"],
    reuses: [{ label: "TEE private/shared memory", href: "/tee/tee-memory" }, { label: "TEE TCB closure", href: "/tee/tee-tcb" }, { label: "Attestation 역할과 key release", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "Core·GlobalPlatform API·secure storage 동작은 링크한 OP-TEE 문서 revision과 platform/backend 범위에 귀속한다." }, { kind: "project-measurement", rule: "같은 TA·platform·input에서 stale session·buffer 변조·power loss·privilege drift를 paired 검사한다." }, { kind: "project-claim", rule: "Secure World entry를 business authorization·rollback freshness·side-channel 안전으로 확대하지 않는다." }],
  },
  "oasis": {
    title: "Oasis consensus·ParaTime·key-manager 연결 글이 소유하는 범위",
    owns: ["Consensus ordering과 runtime compute/storage responsibility의 분리", "Roothash commitment·key-manager epoch policy와 confidential-runtime release gate"],
    reuses: [{ label: "Deterministic SMR", href: "/blockchain/smr-theory" }, { label: "CometBFT application boundary", href: "/blockchain/cometbft-abci" }, { label: "TEE attestation", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "Runtime·roothash·key-manager semantics는 링크한 Oasis Core current docs와 network revision에 귀속한다." }, { kind: "project-measurement", rule: "같은 runtime batch·committee·policy에서 executor mismatch·storage omission·stale identity·epoch retry를 paired 검사한다." }, { kind: "project-claim", rule: "Consensus commit·root equality·key release를 external exactly-once·application authorization으로 확대하지 않는다." }],
  },
  "phala": {
    title: "Phala worker·gatekeeper·Phat Contract 연결 글이 소유하는 범위",
    owns: ["Worker registration/attestation과 gatekeeper scoped-key distribution", "Contract state와 off-chain effect receipt 및 worker release gate"],
    reuses: [{ label: "RATS 역할과 artifact", href: "/tee/tee-attestation" }, { label: "SGX vendor boundary", href: "/tee/intel-sgx" }, { label: "External-effect recovery", href: "/ai/agent-devlog-patterns" }],
    evidence: [{ kind: "primary-source", rule: "Entity·message·key hierarchy는 링크한 Phala technical-spec snapshot과 deployed runtime/chain revision에 귀속한다." }, { kind: "project-measurement", rule: "같은 contract/input에서 replay·stale worker·wrong target·HTTP timeout-after-send를 paired 검사한다." }, { kind: "project-claim", rule: "Worker 등록·TEE execution·scoped key를 remote service honesty·governance·exactly-once로 확대하지 않는다." }],
  },
  "dstack": {
    title: "dstack CVM·manifest·KMS·gateway 연결 글이 소유하는 범위",
    owns: ["Compose/image manifest와 CVM·OS/event measurement의 workload identity", "App/purpose/epoch key derivation·RA-TLS endpoint와 dstack release gate"],
    reuses: [{ label: "Intel TDX identity", href: "/tee/intel-tdx" }, { label: "TEE TCB/reference values", href: "/tee/tee-tcb" }, { label: "Fresh attestation channel binding", href: "/tee/tee-attestation" }],
    evidence: [{ kind: "primary-source", rule: "VMM·guest agent·KMS·gateway와 stated trust path는 링크한 dstack docs/repository release에 귀속한다." }, { kind: "project-measurement", rule: "같은 manifest·platform·policy에서 image drift·quote replay·wrong purpose·KMS crash cut을 paired 검사한다." }, { kind: "project-claim", rule: "Valid TDX quote·tutorial deploy·deterministic derivation을 application correctness·governance·anti-cloning 보장으로 확대하지 않는다." }],
  },
  "cometbft-p2p": {
    title: "CometBFT v0.40.0 P2P stack 글이 소유하는 범위",
    owns: ["Transport·MConnection·Switch·Reactor의 message delivery owner와 local receipt", "Channel queue·priority·peer lifecycle의 backpressure release gate"],
    reuses: [{ label: "일반 process·message·failure model", href: "/blockchain/distributed-systems" }, { label: "CometBFT transaction lifecycle", href: "/blockchain/cometbft" }, { label: "Consensus safety·liveness", href: "/blockchain/smr-theory" }],
    evidence: [{ kind: "primary-source", rule: "Channel·scheduler·peer/reactor 동작은 CometBFT v0.40.0 p2p source에만 귀속한다." }, { kind: "project-measurement", rule: "Slow·malformed peer와 queue pressure를 고정하고 bounded memory·isolation·GST 뒤 progress를 함께 측정한다." }, { kind: "project-claim", rule: "Send·Receive 성공을 remote processing·CheckTx·commit으로 확대하지 않는다." }],
  },
  "cometbft-mempool": {
    title: "CometBFT v0.40.0 CListMempool 글이 소유하는 범위",
    owns: ["Capacity·cache·CheckTx·postCheck의 local admission과 reap/availability semantics", "Commit lock·Update·recheck가 application state generation을 넘기는 경계"],
    reuses: [{ label: "Admission과 commit 분리", href: "/blockchain/cometbft#overview" }, { label: "ABCI CheckTx·Commit authority", href: "/blockchain/cometbft-abci" }, { label: "Block execution ordering", href: "/blockchain/cometbft-execution" }],
    evidence: [{ kind: "primary-source", rule: "CList·cache·recheck와 Commit lock 순서는 CometBFT v0.40.0 mempool/state source에 귀속한다." }, { kind: "project-measurement", rule: "같은 arrival trace에서 duplicate·capacity race·recheck timeout·late response를 주입해 active candidate와 commit 결과를 검사한다." }, { kind: "project-claim", rule: "CheckTx OK·cache membership·TxsAvailable signal을 inclusion·global order·execution success로 확대하지 않는다." }],
  },
  "cometbft-state": {
    title: "CometBFT v0.40.0 State·BlockStore 글이 소유하는 범위",
    owns: ["BlockStore·State/validator/params·Finalize response·application durable receipt의 구분", "State sync trust bootstrap, evidence-aware retention과 height/AppHash crash replay"],
    reuses: [{ label: "Protocol type와 header lag", href: "/blockchain/cometbft-types" }, { label: "ABCI crash recovery", href: "/blockchain/cometbft-abci#finalize-commit" }, { label: "Evidence lifecycle", href: "/blockchain/cometbft-types#evidence" }],
    evidence: [{ kind: "primary-source", rule: "State field·storage·pruning·state-sync/replay는 CometBFT v0.40.0 source와 guide에 귀속한다." }, { kind: "project-measurement", rule: "Snapshot corruption·trust mismatch·prune·crash cut에서 height/AppHash/state parity와 evidence verification을 검사한다." }, { kind: "project-claim", rule: "Snapshot chunk 수신·가장 높은 height·BlockStore 존재를 trusted application state로 확대하지 않는다." }],
  },
  "cometbft-execution": {
    title: "CometBFT v0.40.0 BlockExecutor 글이 소유하는 범위",
    owns: ["Current State에 대한 block validation context와 ApplyBlock orchestration", "Finalize result→application Commit→State persistence order와 crash-cut replay"],
    reuses: [{ label: "ABCI deterministic transition", href: "/blockchain/cometbft-abci#finalize-commit" }, { label: "Commit certificate와 type", href: "/blockchain/cometbft-types" }, { label: "Durable store와 state sync", href: "/blockchain/cometbft-state" }],
    evidence: [{ kind: "primary-source", rule: "Validation·ApplyBlock·Commit·replay ordering은 CometBFT v0.40.0 state/consensus source에 귀속한다." }, { kind: "project-measurement", rule: "잘못된 history/commitment와 네 crash cut을 재생해 height·AppHash·tx result·balance once parity를 통과시킨다." }, { kind: "project-claim", rule: "Consensus decision·Finalize return·timeout을 application durability나 external exactly-once로 확대하지 않는다." }],
  },
  "msm-ntt": {
    title: "MSM·NTT GPU workload routing 글이 소유하는 범위",
    owns: ["고정 proof workload에서 MSM bucket과 NTT stage dependency를 비교하는 경계", "Points·scalars·polynomials·workspace residency와 correctness-first routing gate"],
    reuses: [{ label: "타원곡선 scalar multiplication", href: "/crypto/elliptic-curves#g1-curve" }, { label: "Finite-field NTT·butterfly", href: "/crypto/fft#butterfly" }, { label: "CUDA lifecycle·measurement", href: "/gpu/cuda-basics#release-gate" }],
    evidence: [{ kind: "primary-source", rule: "MSM·NTT implementation surface는 pinned ICICLE/sppark revisions와 CUDA 12.8.1 semantics에만 귀속한다." }, { kind: "project-measurement", rule: "Curve·field·domain·representation·batch를 고정하고 CPU parity 뒤 kernel/end-to-end·traffic·stalls를 paired 측정한다." }, { kind: "project-claim", rule: "큰 병렬 workload나 높은 occupancy를 고정 speedup·모든 proof의 병목으로 확대하지 않는다." }],
  },
  "ec-gpu-ops": {
    title: "ec-gpu field·point kernel lowering 글이 소유하는 범위",
    owns: ["Pinned ec-gpu의 one-work-item 32-bit limb·carry-chain Montgomery lowering", "a=0 Jacobian point kernels와 MSM window/group bucket mapping"],
    reuses: [{ label: "Field limb·Montgomery 정본", href: "/crypto/field-arithmetic" }, { label: "Jacobian point equivalence", href: "/crypto/elliptic-curves#g1-curve" }, { label: "CUDA warp·memory·timing", href: "/gpu/cuda-basics" }],
    evidence: [{ kind: "primary-source", rule: "Limb width·carry·point branches·gid mapping은 ec-gpu commit 16d38ef source에만 귀속한다." }, { kind: "project-measurement", rule: "Field/point CPU parity 뒤 valid ops/s·actual DRAM·register/spill·stalls·end-to-end를 같은 workload에서 측정한다." }, { kind: "project-claim", rule: "Warp-cooperative bigint·cycle/register 고정값·occupancy 우위를 pinned ec-gpu 사실로 주장하지 않는다." }],
  },
  "ec-gpu-gen": {
    title: "ec-gpu-gen source·artifact·dispatch 글이 소유하는 범위",
    owns: ["GpuField parameter snapshot과 SourceBuilder specialization pipeline", "CUDA fatbin/OpenCL source artifact provenance와 unified Program dispatch"],
    reuses: [{ label: "Finite-field representation", href: "/crypto/field-arithmetic" }, { label: "EC GPU operation lowering", href: "/gpu/ec-gpu-ops" }, { label: "CUDA host/device lifecycle", href: "/gpu/cuda-basics#execution-path" }],
    evidence: [{ kind: "primary-source", rule: "Trait·SourceBuilder·artifact·Program behavior는 ec-gpu commit 16d38ef와 bellperson commit 728306c에 귀속한다." }, { kind: "project-measurement", rule: "Clean/cache build·cold startup·warm run과 CPU/CUDA/OpenCL parity를 compiler·driver·artifact digest와 함께 측정한다." }, { kind: "project-claim", rule: "Codegen 성공·unified API·feature 지원을 proof correctness·backend parity·current production 상태로 확대하지 않는다." }],
  },
  "gpu-proof-pipeline": {
    title: "GPU proof dependency·memory orchestration 글이 소유하는 범위",
    owns: ["Protocol stages·transcript·buffers·events의 generation-bound DAG", "Buffer live intervals·stream critical path와 independent-verifier release gate"],
    reuses: [{ label: "Groth16 protocol", href: "/crypto/groth16" }, { label: "PLONK protocol", href: "/crypto/plonk" }, { label: "MSM·NTT GPU workload", href: "/gpu/msm-ntt" }],
    evidence: [{ kind: "primary-source", rule: "Protocol dependencies는 Groth16/PLONK 원문, implementation surface는 pinned bellperson/ICICLE revisions에 귀속한다." }, { kind: "project-measurement", rule: "같은 circuit·SRS·input에서 negative parity 뒤 cold/warm·stage/end-to-end·peak live bytes·recovery를 paired 측정한다." }, { kind: "project-claim", rule: "MSM/NTT kernel speedup을 proof 전체 speedup·cryptographic soundness·모든 protocol의 호출 횟수로 확대하지 않는다." }],
  },
  "cometbft-crypto": {
    title: "CometBFT v0.40.0 crypto implementation 글이 소유하는 범위",
    owns: ["Validator/user crypto role과 Ed25519 verifier instance contract", "Prefix Merkle proof와 TMHash full/truncated length 경계"],
    reuses: [{ label: "Ed25519·Merkle 일반 primitive", href: "/crypto/crypto-primitives" }, { label: "Canonical vote sign bytes", href: "/blockchain/cometbft-types#vote-commit" }],
    evidence: [{ kind: "primary-source", rule: "Key length·verify option·prefix tree·hash length은 CometBFT v0.40.0 crypto source에만 귀속한다." }, { kind: "project-measurement", rule: "Canonical fixtures·bad length/domain/proof·batch parity를 release별로 재생한다." }, { kind: "project-claim", rule: "Validator signature를 user authorization·application validity로, root/address를 hiding·availability로 확대하지 않는다." }],
  },
  "cosmos-sdk": {
    title: "Cosmos SDK v0.55.0 transaction execution 글이 소유하는 범위",
    owns: ["BaseApp mode/branch와 ante→message pipeline", "Keeper capability와 CacheMultiStore child/parent/Commit 경계"],
    reuses: [{ label: "ABCI candidate·committed authority", href: "/blockchain/cometbft-abci" }, { label: "CometBFT block execution", href: "/blockchain/cometbft-execution" }],
    evidence: [{ kind: "primary-source", rule: "Mode·ante·bank·cache semantics는 Cosmos SDK v0.55.0 source에 귀속한다." }, { kind: "project-measurement", rule: "Check/Finalize/Simulate, child failure, conflict/retry, result/event/root parity를 pinned wiring에서 재생한다." }, { kind: "project-claim", rule: "CheckTx·child Write·handler return을 inclusion·durable commit·external rollback으로 확대하지 않는다." }],
  },
  "evmos": {
    title: "Evmos v20.0.0 Ethereum/Cosmos bridge 글이 소유하는 범위",
    owns: ["Ethereum ante에서 Cosmos execution으로의 bridge", "EVM StateDB/revert·token representation·IBC callback 경계"],
    reuses: [{ label: "Cosmos SDK transaction/cache", href: "/blockchain/cosmos-sdk" }, { label: "CometBFT consensus/application", href: "/blockchain/cometbft" }],
    evidence: [{ kind: "primary-source", rule: "Evmos 구현 사실은 historical v20.0.0 tag에 귀속하며 current cosmos/evm으로 확대하지 않는다." }, { kind: "project-measurement", rule: "Signer·fee·fork·revert·receipt/state·supply·ack/timeout parity를 같은 config에서 재생한다." }, { kind: "project-claim", rule: "Ante/EVM return/send receipt를 call success·commit·remote finality로 확대하지 않는다." }],
  },
  "dydx": {
    title: "dYdX protocol/v9.6.3 CLOB·settlement 글이 소유하는 범위",
    owns: ["Short-term/stateful order persistence와 proposer match validation", "Risk settlement와 rebuildable indexer projection 경계"],
    reuses: [{ label: "CometBFT proposal authority", href: "/blockchain/cometbft-abci#prepare-process" }, { label: "Cosmos SDK state branch", href: "/blockchain/cosmos-sdk#baseapp" }],
    evidence: [{ kind: "primary-source", rule: "Order flag·MemClob·match/risk·indexer semantics는 dYdX protocol/v9.6.3 source에 귀속한다." }, { kind: "project-measurement", rule: "같은 orders·oracle·subaccounts에서 operations/state/events parity와 duplicate/out-of-order indexer replay를 검사한다." }, { kind: "project-claim", rule: "Local book·proposer operation·indexer API를 global fairness·committed fill·consensus receipt로 확대하지 않는다." }],
  },
  "iroh": {
    title: "Iroh endpoint·ALPN·path selection 글이 소유하는 범위",
    owns: ["Iroh v1.0.3 EndpointAddr identity/address와 ALPN handler 경계", "Direct·relay tier, biased RTT path selection과 failure/retry release gate"],
    reuses: [{ label: "Content address integrity", href: "/p2p/content-addressing#overview" }, { label: "Kademlia provider routing", href: "/p2p/kademlia#overview" }, { label: "QUIC transport semantics", href: "/p2p/quic-fundamentals#overview" }],
    evidence: [{ kind: "primary-source", rule: "Endpoint·ALPN·path state와 selector constants는 iroh v1.0.3 source에만 귀속한다." }, { kind: "project-measurement", rule: "Direct/relay RTT·switch count·fallback·identity/ALPN failure와 CID verification을 같은 trace에서 측정한다." }, { kind: "project-claim", rule: "Iroh connection success를 CID provider discovery·content possession·application authorization으로 확대하지 않는다." }],
  },
  "kubo": {
    title: "Kubo provider·Bitswap·pin/GC 글이 소유하는 범위",
    owns: ["Kubo v0.43.0 provider candidate와 Bitswap block receipt 경계", "Local pin roots·GC protection과 gateway content release gate"],
    reuses: [{ label: "CID·Merkle DAG", href: "/p2p/content-addressing#overview" }, { label: "Kademlia lookup", href: "/p2p/kademlia#overview" }, { label: "libp2p transport", href: "/p2p/libp2p#overview" }],
    evidence: [{ kind: "primary-source", rule: "Provider/route·Bitswap wiring·pin/GC behavior는 Kubo v0.43.0 source에 귀속한다." }, { kind: "project-measurement", rule: "Stale provider·partial DAG·hash mismatch·shared pin·GC survival을 two-node fixture에서 측정한다." }, { kind: "project-claim", rule: "Provider record·pin·HTTP 200을 current possession·replication·content integrity로 확대하지 않는다." }],
  },
  "libp2p-gossipsub": {
    title: "rust-libp2p GossipSub implementation 글이 소유하는 범위",
    owns: ["0.56.0 publish cache·heartbeat mesh/gossip promise lifecycle", "Local peer score thresholds와 application validation/retry gate"],
    reuses: [{ label: "Generic GossipSub dual path", href: "/p2p/gossip-fundamentals#gossipsub" }, { label: "CID integrity", href: "/p2p/content-addressing#overview" }],
    evidence: [{ kind: "primary-source", rule: "Publish·heartbeat·score·validation behavior는 rust-libp2p 0.56.0 source에 귀속한다." }, { kind: "project-measurement", rule: "Duplicate·promise timeout·validation delay·score decay·mesh partition을 pinned config에서 재생한다." }, { kind: "project-claim", rule: "Publish success·message ID·peer score를 durable delivery·content integrity·global reputation으로 확대하지 않는다." }],
  },
  "libp2p-quic": {
    title: "rust-libp2p QUIC transport implementation 글이 소유하는 범위",
    owns: ["0.56.0 multiaddr→TLS PeerId binding과 native QUIC stream adapter", "UDP socket reuse hole punch와 stream/connection release gate"],
    reuses: [{ label: "QUIC ACK·loss·flow control", href: "/p2p/quic-fundamentals#overview" }, { label: "TCP transport", href: "/p2p/libp2p-tcp#overview" }, { label: "Noise identity", href: "/p2p/libp2p-noise#overview" }, { label: "Yamux streams", href: "/p2p/libp2p-yamux#overview" }],
    evidence: [{ kind: "primary-source", rule: "PeerId binding·stream·socket reuse·hole punch는 rust-libp2p 0.56.0 QUIC source에 귀속한다." }, { kind: "project-measurement", rule: "Identity mismatch·flow-control stall·stream reset·connection close·hole-punch fallback을 같은 workload에서 측정한다." }, { kind: "project-claim", rule: "QUIC handshake·stream open을 application authorization·durable processing·CID integrity로 확대하지 않는다." }],
  },
  "isms-backup-recovery": {
    title: "ISMS backup·recovery 운영 글이 소유하는 범위",
    owns: ["BIA에서 목표·실제 RPO/RTO를 분리하는 방법", "Backup failure domain·dependency consistency·restore acceptance와 drill release gate"],
    reuses: [{ label: "KMS key lifecycle", href: "/isms-aml/isms-encryption#key-lifecycle" }, { label: "Run artifact provenance", href: "/ai/agent-devlog-patterns" }],
    evidence: [{ kind: "standard", rule: "Contingency-planning lifecycle은 NIST SP 800-34 Rev.1 범위에 귀속한다." }, { kind: "primary-source", rule: "국내 인증 확인사항은 2023 KISA 안내서와 2026-08-14 현행 법령을 구분한다." }, { kind: "project-measurement", rule: "삭제·손상·region outage·KMS deny에서 실제 RPO/RTO·업무 oracle·rollback을 측정한다." }],
  },
  "isms-incident-response": {
    title: "ISMS incident-response 운영 글이 소유하는 범위",
    owns: ["Alert→incident severity·scope·owner 승격과 containment evidence", "Eradication·identity·service·monitoring recovery acceptance와 post-incident control verification"],
    reuses: [{ label: "Postmortem·lesson 경계", href: "/ai/agent-devlog-patterns" }, { label: "Identity lifecycle", href: "/isms-aml/isms-auth-management" }],
    evidence: [{ kind: "standard", rule: "Incident-response lifecycle은 NIST SP 800-61 Rev.3 범위에 귀속한다." }, { kind: "primary-source", rule: "국내 인증 확인사항은 KISA 안내서와 incident별 법적 통지 의무를 구분한다." }, { kind: "project-measurement", rule: "False negative·volatile evidence loss·credential residue·recovery relapse를 재생한다." }],
  },
  "isms-dev-security": {
    title: "ISMS secure-development·change 글이 소유하는 범위",
    owns: ["Threat scenario를 test 가능한 change contract로 바꾸는 방법", "Layered verification·artifact provenance·canary·rollback release gate"],
    reuses: [{ label: "Run artifact provenance", href: "/ai/agent-devlog-patterns" }, { label: "Application authorization", href: "/isms-aml/isms-access-control" }],
    evidence: [{ kind: "standard", rule: "Secure-SDLC practice는 NIST SSDF v1.1과 pinned OWASP ASVS release 범위에 귀속한다." }, { kind: "primary-source", rule: "국내 개발·변경관리 확인사항은 KISA 안내서와 현행 조직 policy를 구분한다." }, { kind: "project-measurement", rule: "SAST pass/IDOR fail·artifact mismatch·schema rollback·canary auth failure를 paired 검사한다." }],
  },
  "isms-security-infra": {
    title: "ISMS security-infrastructure 운영 글이 소유하는 범위",
    owns: ["Firewall·WAF·IDS/IPS·VPN·SIEM의 local decision과 비보장", "Zone·flow policy, telemetry correlation과 paired traffic release gate"],
    reuses: [{ label: "Network zone·flow policy", href: "/isms-aml/isms-access-control#network-segmentation" }, { label: "Application authorization", href: "/isms-aml/isms-access-control" }],
    evidence: [{ kind: "standard", rule: "Firewall·log-management 원칙은 NIST SP 800-41 Rev.1·SP 800-92 범위에 귀속한다." }, { kind: "primary-source", rule: "국내 보안시스템 확인사항은 KISA 안내서와 현행 architecture를 구분한다." }, { kind: "project-measurement", rule: "허용·금지·attack·sensor failure traffic에서 signal·action·receipt·latency를 paired 검사한다." }],
  },
  "aml-compliance": {
    title: "AML/CFT control-chain 운영 글이 소유하는 범위",
    owns: ["이사회·준법·영업·analyst·감사의 책임 사슬과 customer→transaction→case linkage", "법적 의무·detector·거래 조치·STR 판단 분리와 AML program release gate"],
    reuses: [{ label: "CDD·실제소유자 정본", href: "/isms-aml/aml-cdd-deep" }, { label: "RBA 정본", href: "/isms-aml/aml-rba-deep" }, { label: "STR 정본", href: "/isms-aml/aml-str-reporting" }],
    evidence: [{ kind: "standard", rule: "국제 AML/CFT 상위 기준은 FATF Recommendations의 current consolidated version에 귀속한다." }, { kind: "primary-source", rule: "국내 의무는 KoFIU 공식 안내와 2026-08-14 현행 법령·감독 규정을 구분해 확인한다." }, { kind: "project-measurement", rule: "같은 customer·transaction fixture에서 CDD·alert·case·report·receipt와 forbidden effect를 paired 재생한다." }],
  },
  "aml-cdd-deep": {
    title: "CDD·beneficial-owner·EDD 운영 글이 소유하는 범위",
    owns: ["고객 주장과 독립 verification source를 분리한 identity record", "실제소유자 resolution, 목적·자금 원천 profile과 refresh·EDD 판단", "VASP on-chain 이전과 Travel Rule identity message·receipt 경계"],
    reuses: [{ label: "AML 전체 통제 사슬", href: "/isms-aml/aml-compliance" }, { label: "위험기반 통제", href: "/isms-aml/aml-rba-deep" }, { label: "STR 판단", href: "/isms-aml/aml-str-reporting" }],
    evidence: [{ kind: "primary-source", rule: "국내 CDD·실제소유자·확인 불가 절차는 KoFIU 공식 안내와 현행 법령에 귀속한다." }, { kind: "standard", rule: "Digital-ID 사용 원칙은 FATF guidance에 귀속하고 특정 vendor assurance를 일반화하지 않는다." }, { kind: "project-measurement", rule: "Stale source·간접 지분·정보 거부·EDD 누락을 같은 기준일 fixture에서 재생한다." }],
  },
  "aml-rba-deep": {
    title: "AML risk-based approach 글이 소유하는 범위",
    owns: ["AML scenario·factor·uncertainty와 inherent/control/residual risk의 구분", "비례 통제 선택, calibration·holdout·capacity와 RBA release gate"],
    reuses: [{ label: "ISMS 위험·잔여위험 정본", href: "/isms-aml/isms-overview#asset-risk" }, { label: "CDD risk profile", href: "/isms-aml/aml-cdd-deep#risk-refresh-edd" }],
    evidence: [{ kind: "standard", rule: "Risk-based·proportionate measure의 상위 원칙은 FATF Recommendation 1과 current revision에 귀속한다." }, { kind: "primary-source", rule: "국내 mandatory floor·simplified/EDD 허용 조건은 현행 KoFIU 법령·감독 지침으로 확인한다." }, { kind: "project-measurement", rule: "Calibration/holdout 분리, high-risk miss·case age·friction·override·drift를 paired 측정한다." }],
  },
  "aml-str-reporting": {
    title: "STR case·narrative·filing 운영 글이 소유하는 범위",
    owns: ["Alert·case·합리적 의심·STR의 상태와 authority 경계", "Narrative·evidence·confidentiality와 idempotent filing reconciliation gate"],
    reuses: [{ label: "CDD profile", href: "/isms-aml/aml-cdd-deep" }, { label: "FDS detector", href: "/isms-aml/aml-fds-deep" }, { label: "Incident evidence 원칙", href: "/isms-aml/isms-incident-response" }],
    evidence: [{ kind: "primary-source", rule: "국내 STR 요건·흐름·보존·비밀유지는 KoFIU 공식 안내와 2026-08-14 현행 법령에 귀속한다." }, { kind: "project-measurement", rule: "Narrative 누락·duplicate submit·unknown receipt·권한 노출·evidence loss를 failure fixture로 재생한다." }, { kind: "project-claim", rule: "Detector score·STR 제출을 거래 동결·고객 유죄·FIU 수사 착수로 확대하지 않는다." }],
  },
  "aml-fds-deep": {
    title: "FDS feature·alert·case·capacity 글이 소유하는 범위",
    owns: ["Point-in-time transaction feature lineage와 rule/model/tag signal", "Alert→human case boundary, threshold capacity와 detector release gate"],
    reuses: [{ label: "CDD profile", href: "/isms-aml/aml-cdd-deep" }, { label: "STR 판단", href: "/isms-aml/aml-str-reporting" }],
    evidence: [{ kind: "primary-source", rule: "Monitoring·STR 원칙은 FATF·KoFIU 공식 자료와 2026-08-14 현행 법령에 귀속한다." }, { kind: "project-measurement", rule: "Event-time replay·holdout·queue·shadow canary를 같은 fixture에서 측정한다." }, { kind: "project-claim", rule: "Rule/model/tag score를 identity·범죄·STR·거래 effect로 확대하지 않는다." }],
  },
  "isms-audit-checklist": {
    title: "ISMS scope·population·sample·finding·retest 글이 소유하는 범위",
    owns: ["Service-dependency scope와 재현 가능한 population·sampling evidence", "Finding root cause·affected population과 independent remediation retest"],
    reuses: [{ label: "ISMS scope·risk", href: "/isms-aml/isms-overview" }, { label: "운영 evidence", href: "/isms-aml/isms-practical-guide#audit-evidence" }],
    evidence: [{ kind: "primary-source", rule: "국내 심사 확인사항은 KISA 안내서·적용 공지와 현행 법령에 귀속한다." }, { kind: "project-measurement", rule: "Population query·sample trace·negative retest와 rollback을 같은 기간에 재현한다." }, { kind: "project-claim", rule: "정책 문서·정상 표본·backup success log 하나를 operating effectiveness 전체로 확대하지 않는다." }],
  },
  "isms-privacy-lifecycle": {
    title: "개인정보 purpose·retention·derivative deletion 글이 소유하는 범위",
    owns: ["개인정보 목적·법적근거·보유시계와 legal-hold ledger", "Primary·파생물·backup restore의 deletion closure와 privacy release gate"],
    reuses: [{ label: "Backup·restore", href: "/isms-aml/isms-backup-recovery" }, { label: "ISMS-P privacy evidence", href: "/isms-aml/isms-overview" }],
    evidence: [{ kind: "primary-source", rule: "국내 보유·파기 의무는 2026-08-14 현행 개인정보 보호법·KISA 안내서에 귀속한다." }, { kind: "project-measurement", rule: "Deadline·legal hold·artifact deletion·restore resurrection을 fixed subjects로 재생한다." }, { kind: "project-claim", rule: "분리보관·암호화·가명처리·primary 404를 완전 파기로 확대하지 않는다." }],
  },
  "isms-privacy-policy": {
    title: "개인정보 notice·choice·sharing·runtime parity 글이 소유하는 범위",
    owns: ["Data inventory와 처리방침 notice·consent receipt의 version parity", "제3자/processor·cookie/SDK flow와 browser/backend release gate"],
    reuses: [{ label: "개인정보 생명주기", href: "/isms-aml/isms-privacy-lifecycle" }, { label: "Access control", href: "/isms-aml/isms-access-control" }],
    evidence: [{ kind: "primary-source", rule: "처리방침·행태정보 의무는 현행 개인정보 보호법·표준지침·개인정보위 자료에 귀속한다." }, { kind: "project-measurement", rule: "Accept·reject·withdraw·unknown SDK를 browser network와 backend receipt에서 paired 검사한다." }, { kind: "project-claim", rule: "처리방침 공개·동의 한 번·cookie 명칭을 모든 처리의 적법성으로 확대하지 않는다." }],
  },
  "msm-gpu-impl": {
    title: "GPU MSM window·bucket·reduction 구현 글이 소유하는 범위",
    owns: ["Signed-window digit 작업표와 partial top-window 처리", "Bucket 충돌 ownership·running-sum reduction과 MSM kernel release gate"],
    reuses: [{ label: "EC scalar multiplication", href: "/crypto/elliptic-curves#g1-curve" }, { label: "CUDA memory·timing", href: "/gpu/cuda-basics" }, { label: "Proof workload routing", href: "/gpu/msm-ntt" }],
    evidence: [{ kind: "primary-source", rule: "Digit·sort·accumulate·integrate 동작은 sppark commit 17278d7 source에만 귀속한다." }, { kind: "project-measurement", rule: "같은 curve·n·scalar 분포에서 reference parity 뒤 stage/end-to-end·traffic·stalls를 paired 측정한다." }, { kind: "project-claim", rule: "Window 폭·sort 전략·occupancy·kernel speedup을 보편 최적값이나 proof 전체 speedup으로 확대하지 않는다." }],
  },
  "ntt-gpu-impl": {
    title: "GPU NTT stage·twiddle·order 구현 글이 소유하는 범위",
    owns: ["Butterfly stage-tile mapping과 twiddle artifact contract", "CT/GS order·bit-reversal buffer plan과 NTT kernel release gate"],
    reuses: [{ label: "Finite-field NTT", href: "/crypto/fft" }, { label: "CUDA shared memory", href: "/gpu/cuda-shared-memory" }, { label: "CUDA timing", href: "/gpu/cuda-perf-analysis" }],
    evidence: [{ kind: "primary-source", rule: "CT/GS·bit reversal·coset placement은 sppark commit 17278d7 source에 귀속한다." }, { kind: "project-measurement", rule: "Field/domain/order를 고정하고 DFT·round-trip·convolution parity 뒤 traffic·stalls·end-to-end를 측정한다." }, { kind: "project-claim", rule: "특정 radix·tile·shared-memory fusion·occupancy를 모든 domain의 우위로 일반화하지 않는다." }],
  },
  "poly-ops-gpu": {
    title: "GPU polynomial representation·recurrence 글이 소유하는 범위",
    owns: ["Form/domain/order/generation이 붙은 device polynomial artifact", "Coset twist·NTT plan과 Horner/synthetic-division recurrence batch mapping"],
    reuses: [{ label: "Polynomial coefficient·evaluation", href: "/crypto/polynomials" }, { label: "NTT", href: "/crypto/fft" }, { label: "GPU NTT implementation", href: "/gpu/ntt-gpu-impl" }],
    evidence: [{ kind: "primary-source", rule: "Coset pass 위치와 reference behavior는 pinned sppark·c-kzg·ICICLE revisions에 귀속한다." }, { kind: "project-measurement", rule: "Form/domain mismatch와 exact identities 뒤 requested/actual traffic·element/s·end-to-end를 비교한다." }, { kind: "project-claim", rule: "한 polynomial의 Horner/division coefficients가 독립이라는 주장이나 element/s를 proof/s로 확대하지 않는다." }],
  },
  "kzg-gpu": {
    title: "GPU KZG SRS·MSM·opening artifact 글이 소유하는 범위",
    owns: ["SRS validation·device residency artifact와 coefficient-SRS MSM binding", "Opening job DAG·verifier receipt와 GPU KZG release/rollback gate"],
    reuses: [{ label: "KZG commitment 정본", href: "/crypto/polycommit#kzg" }, { label: "GPU polynomial operations", href: "/gpu/poly-ops-gpu" }, { label: "GPU MSM implementation", href: "/gpu/msm-gpu-impl" }],
    evidence: [{ kind: "primary-source", rule: "KZG 수학은 원 논문, EIP-4844 reference는 c-kzg v2.1.6, MSM은 sppark commit 17278d7에 귀속한다." }, { kind: "project-measurement", rule: "SRS·form·claim·backend를 고정하고 independent verifier·negative parity 뒤 cold/warm·memory·end-to-end를 비교한다." }, { kind: "project-claim", rule: "MSM kernel time을 KZG/proof speedup으로, c-kzg profile을 모든 KZG batch protocol로 일반화하지 않는다." }],
  },
  "gpu-witness-gen": {
    title: "GPU witness dataflow·frontier·release 글이 소유하는 범위",
    owns: ["Witness signal producer DAG와 dependency-safe level frontier schedule", "Live signal/instruction/scratch residency와 verifier-first GPU witness release gate"],
    reuses: [{ label: "R1CS instance·witness relation", href: "/crypto/r1cs" }, { label: "CUDA execution·timing", href: "/gpu/cuda-basics" }, { label: "GPU proof pipeline", href: "/gpu/gpu-proof-pipeline" }],
    evidence: [{ kind: "primary-source", rule: "Current witness compiler behavior는 Circom v2.2.3, dependency parallelization은 Ou 2023/657에 각각 귀속하며 둘을 이미 통합된 GPU 구현으로 합치지 않는다." }, { kind: "project-measurement", rule: "같은 circuit/input에서 witness bytes·constraint·proof parity 뒤 work/span·live bytes·stage/end-to-end·p95를 비교한다." }, { kind: "project-claim", rule: "Frontier GPU lowering은 desired implementation contract이며 current Circom fact나 보편 speedup이 아니다." }],
  },
  "icicle-framework": {
    title: "ICICLE backend·memory·primitive runtime 글이 소유하는 범위",
    owns: ["Pinned active-device/backend registration dispatch와 explicit unsupported boundary", "Host/device pointer·stream completion·primitive config receipt와 backend release gate"],
    reuses: [{ label: "GPU MSM implementation", href: "/gpu/msm-gpu-impl" }, { label: "GPU NTT implementation", href: "/gpu/ntt-gpu-impl" }, { label: "GPU Poseidon implementation", href: "/gpu/poseidon-gpu" }],
    evidence: [{ kind: "primary-source", rule: "Runtime·memory·primitive behavior는 ICICLE v3.9.0 commit 6b451e6 source/docs에만 귀속한다." }, { kind: "project-measurement", rule: "같은 primitive/profile/input에서 CPU/backend parity·missing/invalid pointer/async/OOM failure 뒤 load·transfer·kernel·sync·verify를 비교한다." }, { kind: "project-claim", rule: "Common API를 모든 field/backend 지원·automatic representation safety·protocol soundness·silent fallback으로 확대하지 않는다." }],
  },
  "poseidon-gpu": {
    title: "GPU Poseidon parameter·round·batch mapping 글이 소유하는 범위",
    owns: ["Poseidon field/width/round/constants/matrix GPU parameter artifact", "Round lane/barrier mapping, batch-tree frontier와 parity-first kernel release gate"],
    reuses: [{ label: "Poseidon parameter·round·security 정본", href: "/crypto/poseidon-hash" }, { label: "Prime-field arithmetic", href: "/crypto/field-arithmetic" }, { label: "CUDA synchronization", href: "/gpu/cuda-sync" }],
    evidence: [{ kind: "primary-source", rule: "Poseidon theory는 원 논문, Filecoin transform은 official spec, ICICLE API는 v3.9.0 pinned page에 각각 귀속한다." }, { kind: "project-measurement", rule: "Parameter digest·field·batch/tree shape를 고정하고 reference/circuit/root/proof parity 뒤 transfer·kernel·sync·verified states/s·p95를 비교한다." }, { kind: "project-claim", rule: "Lane mapping은 measured candidate이며 α·round 수·sparse transform·throughput을 모든 profile의 고정값으로 일반화하지 않는다." }],
  },
  "filecoin-gpu-proofs": {
    title: "Filecoin proof phase·cache·accelerator release 글이 소유하는 범위",
    owns: ["Pinned seal phase producer/consumer artifact chain과 parameter/cache generation binding", "Bellperson accelerator work split과 independent verifier·deadline rollback gate"],
    reuses: [{ label: "Generic GPU proof DAG", href: "/gpu/gpu-proof-pipeline" }, { label: "MSM·NTT workload", href: "/gpu/msm-ntt" }, { label: "GPU KZG artifact", href: "/gpu/kzg-gpu" }],
    evidence: [{ kind: "primary-source", rule: "Filecoin phases/parameters는 rust-fil-proofs commit d451d23, Groth16 accelerator integration은 bellperson commit 728306c에 귀속한다." }, { kind: "project-measurement", rule: "같은 sector/proof/profile/cache generation에서 reference commitments·independent verification 뒤 cold/warm I/O·queue·stage·p95·deadline slack을 비교한다." }, { kind: "project-claim", rule: "Kernel/FFT/MSM speedup을 Filecoin 전체 proof speedup·network deadline·current mainnet dependency로 확대하지 않는다." }],
  },
  "libp2p-yamux": {
    title: "rust-libp2p Yamux stream credit·buffer·failure 글이 소유하는 범위",
    owns: ["libp2p-yamux 0.47.0의 internal adapter·inbound buffer boundary", "Yamux stream credit와 stream/connection failure-scope release gate"],
    reuses: [{ label: "libp2p TCP upgrade", href: "/p2p/libp2p-tcp" }, { label: "libp2p Noise identity", href: "/p2p/libp2p-noise" }, { label: "libp2p substream negotiation", href: "/p2p/libp2p#substream" }],
    evidence: [{ kind: "primary-source", rule: "Wire semantics는 Yamux specification, wrapper facts는 rust-libp2p 0.56.0·libp2p-yamux 0.47.0 source에 귀속한다." }, { kind: "project-measurement", rule: "Slow reader·inbound overflow·adapter branch·reset/close에서 memory·progress·receipt를 paired 재현한다." }, { kind: "project-claim", rule: "Current 256 buffer constant와 stream flush를 SLA·remote delivery·application receipt로 확대하지 않는다." }],
  },
  "rqbit": {
    title: "rqbit peer owner·piece admission·range readiness 글이 소유하는 범위",
    owns: ["rqbit v8.1.1 peer candidate queue와 in-flight piece owner lifecycle", "Piece hash admission·restart validation·verified range release"],
    reuses: [{ label: "BitTorrent metainfo·wire 정본", href: "/p2p/bittorrent" }, { label: "Kademlia lookup 정본", href: "/p2p/kademlia" }],
    evidence: [{ kind: "primary-source", rule: "Scheduling·hash·streaming behavior는 rqbit stable v8.1.1 exact source revision에만 귀속한다." }, { kind: "project-measurement", rule: "Steal race·mismatch·restart·multi-file range에서 owner generation·digest·released bytes를 검증한다." }, { kind: "project-claim", rule: "Peer candidate를 possession proof로, resume bitfield를 absolute integrity proof로, SHA-1을 신규 설계 권고로 확대하지 않는다." }],
  },
  "commonware-crypto-p2p": {
    title: "Commonware authenticated handshake·channel quota 글이 소유하는 범위",
    owns: ["v2026.7.0 Syn·SynAck·Ack transcript와 directional AEAD counter", "Authenticated channel quota·bounded mux·priority mailbox local admission"],
    reuses: [{ label: "Authenticated Diffie–Hellman", href: "/crypto/diffie-hellman" }, { label: "Commonware consensus", href: "/blockchain/commonware-consensus" }],
    evidence: [{ kind: "primary-source", rule: "Handshake·lookup·mux·relay 구현 사실은 Commonware monorepo v2026.7.0 source에만 귀속한다." }, { kind: "project-measurement", rule: "Replay·counter rollback·oversize·slow channel·overflow에서 session·local feedback·application receipt를 분리 측정한다." }, { kind: "project-claim", rule: "Authenticated peer·priority·Feedback::Ok를 payload correctness·remote receipt·consensus ordering으로 확대하지 않는다." }],
  },
  "hw-server-vs-desktop": {
    title: "서버·데스크톱 platform 선택 글이 소유하는 범위",
    owns: ["Workload resource envelope와 lane·memory·NUMA topology", "BMC/Redfish·serviceability 경계와 fault-injection release gate"],
    reuses: [{ label: "Memory sizing·ECC·population", href: "/gpu/hw-memory" }, { label: "PCIe bandwidth·topology", href: "/gpu/gpu-interconnects#pcie-transaction-bandwidth-latency" }],
    evidence: [{ kind: "primary-source", rule: "관리 semantics는 pinned DMTF Redfish release, server energy 분류는 ENERGY STAR v4.0에 귀속한다." }, { kind: "project-measurement", rule: "Exact BOM·firmware·trace에서 boot·stress·fault·remote recovery를 paired 측정한다." }, { kind: "project-claim", rule: "Server label·Redfish 지원을 무중단·성능 우위로 확대하지 않는다." }],
  },
  "hw-nvme-storage": {
    title: "NVMe protocol·form-factor·device path 글이 소유하는 범위",
    owns: ["NVMe protocol과 M.2·U.2/U.3·E1.S mechanical/service 경계", "Controller-to-root lane·thermal·hot-plug release gate"],
    reuses: [{ label: "PCIe bit/byte·goodput", href: "/gpu/gpu-interconnects#pcie-transaction-bandwidth-latency" }, { label: "Storage tier placement", href: "/gpu/hw-storage-comparison" }],
    evidence: [{ kind: "standard", rule: "Protocol은 NVMe Base 2.2, E1.S mechanical claim은 SFF-TA-1006 Rev 2.0에 고정한다." }, { kind: "project-measurement", rule: "Exact drive·backplane·firmware에서 precondition·steady state·thermal·fault parity를 측정한다." }, { kind: "project-claim", rule: "Form factor나 link peak를 fixed performance·endurance·hot-plug 보장으로 확대하지 않는다." }],
  },
  "hw-storage-comparison": {
    title: "SATA·SAS·NVMe workload tier 비교 글이 소유하는 범위",
    owns: ["Command·transport·topology 비교와 DWPD/capacity reserve", "Scratch·metadata·durable data의 failure-domain placement와 tier release gate"],
    reuses: [{ label: "NVMe form factor·lane path", href: "/gpu/hw-nvme-storage" }, { label: "Bit·byte와 PCIe", href: "/gpu/hw-network" }],
    evidence: [{ kind: "standard", rule: "SATA·SAS naming/spec owner와 SNIA PTS revision을 exact source에 귀속한다." }, { kind: "project-measurement", rule: "Preconditioned steady state와 power-loss·media-error·rebuild 중 integrity/SLO를 비교한다." }, { kind: "project-claim", rule: "Interface peak·RAID·DWPD 하나를 application 성능·backup·durability로 확대하지 않는다." }],
  },
  "hw-power-cooling": {
    title: "서버 입력 전력·rack 냉각 글이 소유하는 범위",
    owns: ["Wall input과 heat balance, A/B feed N−1 headroom", "Chip-to-facility heat path와 synchronized telemetry fault release gate"],
    reuses: [{ label: "GPU workload·power procurement", href: "/gpu/hw-gpu-comparison#release-gate" }, { label: "Server workload envelope", href: "/gpu/hw-server-vs-desktop#workload-envelope" }],
    evidence: [{ kind: "standard", rule: "Server energy measurement은 ENERGY STAR v4.0, PUE는 The Green Grid 정의 범위에 둔다." }, { kind: "project-measurement", rule: "Meter·ambient·firmware·trace를 pin하고 feed/fan/pump 상실의 valid work와 thermal state를 측정한다." }, { kind: "project-claim", rule: "TDP·nameplate·PUE를 target wall power·server efficiency·reliability로 확대하지 않는다." }],
  },
  "commonware-broadcast": {
    title: "Commonware buffered broadcast·digest cache 글이 소유하는 범위",
    owns: ["v2026.7.0 broadcast local Feedback와 digest subscription receipt", "Primary-eligible peer deque·shared item refcount cache lifecycle"],
    reuses: [{ label: "Commonware authenticated P2P", href: "/blockchain/commonware-crypto-p2p" }, { label: "Total-order broadcast", href: "/blockchain/smr-theory#total-order" }, { label: "Erasure coding", href: "/blockchain/erasure-coding" }],
    evidence: [{ kind: "primary-source", rule: "Broadcaster·ingress·engine 동작은 commonware-broadcast v2026.7.0 pinned source에만 귀속한다." }, { kind: "project-measurement", rule: "Mailbox·decode·duplicate·deque overflow·primary update·waiter cancel에서 refcount와 typed receipt를 검증한다." }, { kind: "project-claim", rule: "Feedback·subscribe completion·cache refcount를 recipient acknowledgement·quorum·total order·durability로 확대하지 않는다." }],
  },
  "avalanche-consensus": {
    title: "Avalanche sampling·Snowflake·Snowball 글이 소유하는 범위",
    owns: ["Random subsample poll과 alpha 성공 판정", "Snowflake consecutive confidence·Snowball cumulative preference와 probabilistic release envelope"],
    reuses: [{ label: "Consensus safety·liveness", href: "/blockchain/bft-theory" }, { label: "Finality semantics boundary", href: "/blockchain/consensus-comparison" }],
    evidence: [{ kind: "primary-source", rule: "Protocol construction은 Snow paper, implementation state는 AvalancheGo v1.14.2 source에 각각 귀속한다." }, { kind: "project-measurement", rule: "Parameter·sampler·fault·network trace를 고정하고 conflict 0과 GST 뒤 progress를 분리 검사한다." }, { kind: "project-claim", rule: "한 poll 확률·default parameter·local decision을 universal finality SLA로 확대하지 않는다." }],
  },
  "expected-consensus": {
    title: "Filecoin EC sortition·tipset·weighted head 글이 소유하는 범위",
    owns: ["QAP 비례 Poisson win count와 compatible tipset candidate", "Full block validation 뒤 EC chain-weight head selection"],
    reuses: [{ label: "Fork choice와 finality", href: "/blockchain/consensus-comparison" }, { label: "F3 finalized prefix", href: "/blockchain/filecoin-f3" }],
    evidence: [{ kind: "primary-source", rule: "EC semantics는 Filecoin spec, exact win/weight 산술은 Lotus v1.36.2 source에 귀속한다." }, { kind: "project-measurement", rule: "Invalid-heavy branch·incompatible tipset·reorg에서 validation receipt와 head transition을 재생한다." }, { kind: "project-claim", rule: "EC head를 irreversible finality나 F3 certificate로 표현하지 않는다." }],
  },
  "gossipbft": {
    title: "GPBFT weighted phases·recovery 글이 소유하는 범위",
    owns: ["Historical-power strict strong quorum과 phase justification transition", "Base·bottom recovery와 partial-synchrony timeout·rebroadcast"],
    reuses: [{ label: "Gossipsub dissemination", href: "/p2p/libp2p-gossipsub" }, { label: "BFT quorum intersection", href: "/blockchain/bft-theory" }, { label: "F3 integration", href: "/blockchain/filecoin-f3" }],
    evidence: [{ kind: "primary-source", rule: "Protocol properties는 FIP-0086, local phase implementation은 go-f3 v0.8.14 source에 귀속한다." }, { kind: "project-measurement", rule: "Wrong domain·80/81 power·partition/GST trace에서 safety와 liveness를 별도 판정한다." }, { kind: "project-claim", rule: "Gossipsub publish·message receipt를 GPBFT decision certificate로 확대하지 않는다." }],
  },
  "filecoin-f3": {
    title: "Filecoin F3 EC integration·certificate sync 글이 소유하는 범위",
    owns: ["EC proposal·finalized base·versioned power-table instance binding", "Certificate-chain catch-up과 finalized-prefix fork-choice fence"],
    reuses: [{ label: "Expected Consensus head", href: "/blockchain/expected-consensus" }, { label: "GPBFT quorum·phases", href: "/blockchain/gossipbft" }],
    evidence: [{ kind: "primary-source", rule: "F3 semantics는 FIP-0086, certificate exchange는 go-f3 v0.8.14, Lotus adapter는 v1.36.2에 각각 귀속한다." }, { kind: "project-measurement", rule: "Stale table·skipped instance·wrong network·F3 halt·conflicting heavy branch를 재생한다." }, { kind: "project-claim", rule: "EC progress나 latest certificate 한 장을 trusted finality·application release로 확대하지 않는다." }],
  },
  "narwhal-deep": {
    title: "Narwhal worker·certificate DAG 글이 소유하는 범위",
    owns: ["Worker payload와 primary header metadata 경계", "Header vote·certificate lifecycle과 causal payload retrieval·GC release"],
    reuses: [{ label: "Generic certified DAG availability", href: "/blockchain/dag-consensus" }, { label: "Order·execution state separation", href: "/blockchain/consensus-comparison" }],
    evidence: [{ kind: "primary-source", rule: "Protocol은 Narwhal/Tusk paper, 구현은 archived exact commit e67f915에 각각 귀속한다." }, { kind: "project-measurement", rule: "Wrong domain·missing parent·withheld payload·crash/GC를 certificate-to-execution trace로 재생한다." }, { kind: "project-claim", rule: "Availability certificate를 total order·execution·permanent retention으로 확대하지 않는다." }],
  },
  "bullshark-deep": {
    title: "Bullshark wave·sub-DAG ordering 글이 소유하는 범위",
    owns: ["Wave leader support와 reachable prior-leader recovery", "Duplicate-free deterministic sub-DAG flatten과 variant release"],
    reuses: [{ label: "Narwhal certificate DAG", href: "/blockchain/narwhal-deep" }, { label: "Generic DAG anchor linearization", href: "/blockchain/dag-consensus" }],
    evidence: [{ kind: "primary-source", rule: "Variants는 Bullshark paper, standalone behavior는 archived exact commit e67f915에 귀속한다." }, { kind: "project-measurement", rule: "Causal-link·arrival-order·partition·restart fixtures에서 output digest와 liveness를 분리 검사한다." }, { kind: "project-claim", rule: "Archived f+1 support를 모든 Bullshark variants나 current Sui 상수로 일반화하지 않는다." }],
  },
  "autobahn-deep": {
    title: "Autobahn lane·cut·recovery 글이 소유하는 범위",
    owns: ["Car PoA lane chain과 certified-tip cut zipper", "Prepare·Confirm fast/slow evidence, TC recovery와 backlog release"],
    reuses: [{ label: "Partial synchrony", href: "/blockchain/bft-theory" }, { label: "Generic lane-cut recovery", href: "/blockchain/dag-consensus" }],
    evidence: [{ kind: "primary-source", rule: "Threshold·safety·liveness·seamless 주장은 Autobahn 2401.10369의 model에 귀속한다." }, { kind: "project-measurement", rule: "PoA equivocation·view change·non-monotonic cuts·blip backlog를 payload와 execution까지 재생한다." }, { kind: "project-claim", rule: "PoA를 non-equivocation QC로, cut latency를 end-to-end zero hangover로 확대하지 않는다." }],
  },
  "mysticeti": {
    title: "Mysticeti uncertified vote·decision prefix 글이 소유하는 범위",
    owns: ["First-support vote와 direct·indirect slot decisions", "UniversalCommitter decided prefix, Sui sub-DAG·FPC release boundary"],
    reuses: [{ label: "Generic parent-quorum overlap", href: "/blockchain/dag-consensus" }, { label: "Consensus safety·liveness", href: "/blockchain/bft-theory" }],
    evidence: [{ kind: "primary-source", rule: "Protocol은 Mysticeti paper, current behavior는 Sui mainnet-v1.77.2 exact source에 귀속한다." }, { kind: "project-measurement", rule: "Equivocation·undecided barrier·partition/GST·restart와 feature config를 고정해 재생한다." }, { kind: "project-claim", rule: "Uncertified를 unvalidated로, FPC execution을 checkpoint finality로 표현하지 않는다." }],
  },
  "impl-field-arithmetic": {
    title: "Rust field parameter·serialization·execution 글이 소유하는 범위",
    owns: ["Versioned field parameter artifact와 canonical/internal serialization boundary", "Carry/reduction execution profile과 parity/codegen release gate"],
    reuses: [{ label: "Prime field·Montgomery", href: "/crypto/field-arithmetic" }, { label: "Extension field implementation", href: "/crypto/extension-fields" }],
    evidence: [{ kind: "primary-source", rule: "Implementation 사실은 arkworks algebra commit 6a28df5 source에 귀속한다." }, { kind: "project-measurement", rule: "Exact artifact/compiler/target에서 reference parity·boundary vectors·timing/RSS를 비교한다." }, { kind: "project-claim", rule: "Source-level branchless·microbenchmark를 production constant-time·proof speed로 확대하지 않는다." }],
  },
  "impl-elliptic-curve": {
    title: "Rust curve profile·point admission·pairing release 글이 소유하는 범위",
    owns: ["Curve/pairing profile artifact와 untrusted point admission", "Coordinate operation profile과 negative-vector pairing release gate"],
    reuses: [{ label: "Elliptic-curve group", href: "/crypto/elliptic-curves" }, { label: "Field implementation", href: "/blockchain/impl-field-arithmetic" }],
    evidence: [{ kind: "primary-source", rule: "BN254와 point operation facts는 arkworks commits e2d16a2·6a28df5에 귀속한다." }, { kind: "project-measurement", rule: "Official/reference vectors와 malformed/off-curve/subgroup failures 뒤 stage timings를 비교한다." }, { kind: "project-claim", rule: "On-curve·formula 이름·bilinearity 몇 건을 complete formula·security audit로 확대하지 않는다." }],
  },
  "impl-groth16": {
    title: "Rust Groth16 artifact·prover plan·release 글이 소유하는 범위",
    owns: ["Relation/witness/domain/key artifact profile과 setup-key admission", "Dependency-aware QAP/MSM execution과 independent-verifier release gate"],
    reuses: [{ label: "Groth16 protocol", href: "/crypto/groth16" }, { label: "R1CS", href: "/crypto/r1cs" }],
    evidence: [{ kind: "primary-source", rule: "Protocol은 ePrint 2016/260, Rust layout/prover는 ark-groth16 commit 8f0904a에 귀속한다." }, { kind: "project-measurement", rule: "Same circuit/key/witness에서 negative fixtures·independent verification 뒤 stage/end-to-end·RSS를 측정한다." }, { kind: "project-claim", rule: "Deserialize·proof 생성·MSM speed를 setup provenance·valid proof·end-to-end improvement로 확대하지 않는다." }],
  },
  "rapidsnark-gpu": {
    title: "rapidsnark CPU 사실·proposed GPU adapter 글이 소유하는 범위",
    owns: ["Pinned WTNS/zkey admission과 current CPU prover stage map", "별도 GPU NTT/MSM adapter boundary와 hybrid fallback/release gate"],
    reuses: [{ label: "Groth16 implementation", href: "/blockchain/impl-groth16" }, { label: "GPU proof pipeline", href: "/gpu/gpu-proof-pipeline" }, { label: "CUDA timing", href: "/gpu/cuda-basics" }],
    evidence: [{ kind: "primary-source", rule: "Current behavior는 iden3 rapidsnark commit 81eddf1 source에 귀속하며 CUDA backend가 없음을 명시한다." }, { kind: "project-measurement", rule: "Same WTNS/zkey에서 CPU/GPU stage parity·independent verify 뒤 transfer/queue/kernel/sync/end-to-end를 비교한다." }, { kind: "project-claim", rule: "GPU adapter는 desired hardening이며 current rapidsnark feature·fixed speedup으로 표현하지 않는다." }],
  },
  "impl-plonk": {
    title: "Rust PLONK compiler·transcript·receipt 글이 소유하는 범위",
    owns: ["Circuit row/key compiler artifact와 prover transcript execution plan", "Proof/key serialization receipt와 implementation release gate"],
    reuses: [{ label: "PLONK protocol", href: "/crypto/plonk" }, { label: "Polynomial commitment", href: "/crypto/kzg" }],
    evidence: [{ kind: "primary-source", rule: "Protocol은 ePrint 2019/953, 구현은 dusk-network/plonk commit 768cf84에 귀속한다." }, { kind: "project-measurement", rule: "같은 artifact/key/witness에서 independent verify와 stage/end-to-end를 측정한다." }, { kind: "project-claim", rule: "Pinned implementation을 모든 PLONK 변형·lookup·production security로 확대하지 않는다." }],
  },
  "proofs-snark": {
    title: "Bellperson assignment·dispatch·SupraSeal receipt 글이 소유하는 범위",
    owns: ["Assignment density artifact와 feature-selected prover dispatch", "SupraSeal batch FFI receipt와 backend parity release gate"],
    reuses: [{ label: "Groth16", href: "/crypto/groth16" }, { label: "GPU proof pipeline", href: "/gpu/filecoin-gpu-proofs" }],
    evidence: [{ kind: "primary-source", rule: "Current behavior는 bellperson commit 728306c source에 귀속한다." }, { kind: "project-measurement", rule: "같은 circuits/parameters에서 native·GPU·SupraSeal independent verification과 e2e를 비교한다." }, { kind: "project-claim", rule: "FFI path를 memory safety·constant-time·fixed GPU speedup으로 확대하지 않는다." }],
  },
  "risc0": {
    title: "RISC Zero method·session·receipt claim 글이 소유하는 범위",
    owns: ["Guest ELF·ImageID method artifact와 segment session receipt", "Expected ReceiptClaim·journal binding과 zkVM release gate"],
    reuses: [{ label: "STARK", href: "/crypto/stark" }, { label: "Hash commitments", href: "/crypto/hash-functions" }],
    evidence: [{ kind: "primary-source", rule: "Lifecycle과 receipt semantics는 RISC Zero v3.0.6 commit 1cc70cf에 귀속한다." }, { kind: "project-measurement", rule: "같은 guest/ImageID/input에서 native output과 receipt verify 뒤 cycles/e2e를 측정한다." }, { kind: "project-claim", rule: "Journal을 private output으로, ImageID를 source-level identity로, benchmark를 보편 성능으로 확대하지 않는다." }],
  },
  "sp1": {
    title: "SP1 ELF·record·proof-mode receipt 글이 소유하는 범위",
    owns: ["RV64IM ELF/program-key artifact와 ExecutionRecord shard plan", "Core·compressed·PLONK·Groth16 proof receipt와 backend release gate"],
    reuses: [{ label: "STARK", href: "/crypto/stark" }, { label: "PLONK", href: "/crypto/plonk" }, { label: "SNARK", href: "/crypto/snark" }],
    evidence: [{ kind: "primary-source", rule: "Program/record/proof lifecycle은 SP1 v6.4.0 commit f66b4bf에 귀속한다." }, { kind: "project-measurement", rule: "같은 ELF/key/input에서 backend parity와 mode별 verified e2e·bytes·memory를 비교한다." }, { kind: "project-claim", rule: "Proof wrapper validity를 guest correctness·cross-version compatibility·fixed speedup으로 확대하지 않는다." }],
  },
  "vasp-custody-management": {
    title: "VASP asset·liability·custody·PoR 글이 소유하는 범위",
    owns: ["고객 채무와 통제 가능한 자산·external custodian의 daily reconciliation", "PoR liability boundary와 withdrawal/custody release gate"],
    reuses: [{ label: "Cryptographic control lifecycle", href: "/isms-aml/isms-encryption#key-lifecycle" }, { label: "Wallet signing trace", href: "/isms-aml/isms-practical-guide#wallet-signing" }, { label: "Audit population coverage", href: "/isms-aml/isms-audit-checklist" }],
    evidence: [{ kind: "primary-source", rule: "국내 80%·일일 산정은 2026-08-14 현행 금융위 자료에 귀속하고 release마다 재확인한다." }, { kind: "project-measurement", rule: "같은 cutoff·asset·liability population에서 address/custodian/withdrawal/reorg receipts를 재생한다." }, { kind: "project-claim", rule: "PoR ratio·콜드월렛 비율을 solvency·audit·key safety·future withdrawal로 확대하지 않는다." }],
  },
  "vasp-wallet-security": {
    title: "VASP key authority·signing·withdrawal reconciliation 글이 소유하는 범위",
    owns: ["Hot·warm·cold wallet authority tier와 canonical signing policy enforcement", "Withdrawal chain/ledger reconciliation, recovery generation과 wallet release gate"],
    reuses: [{ label: "Key lifecycle", href: "/isms-aml/isms-encryption#key-lifecycle" }, { label: "Generic signing approval trace", href: "/isms-aml/isms-practical-guide#wallet-signing" }, { label: "Incident recovery", href: "/isms-aml/isms-incident-response" }],
    evidence: [{ kind: "primary-source", rule: "국내 이용자 자산 보호 경계는 금융위 현행 자료, risk 원칙은 FATF 공식 guidance에 귀속한다." }, { kind: "project-measurement", rule: "Intent bytes·approval·signer·RPC·confirmation·ledger·recovery를 같은 generation에서 failure replay한다." }, { kind: "project-claim", rule: "HSM·MPC·multisig·signature success를 customer authorization·chain finality·ledger completion으로 확대하지 않는다." }],
  },
  "vasp-unfair-trading": {
    title: "가상자산 market event·surveillance signal·case 글이 소유하는 범위",
    owns: ["미공개정보 접근과 order-event reconstruction의 time·identity boundary", "Manipulation signal→human case authority와 detector release gate"],
    reuses: [{ label: "FDS feature lineage", href: "/isms-aml/aml-fds-deep#signal-case-pipeline" }, { label: "Alert·case boundary", href: "/isms-aml/aml-fds-deep" }, { label: "STR decision", href: "/isms-aml/aml-str-reporting" }],
    evidence: [{ kind: "primary-source", rule: "상시감시·당국 조사 흐름은 2026-08-14 현행 금융위 자료와 법령에 귀속한다." }, { kind: "project-measurement", rule: "Order/access feeds, identity graph, holdout·queue·shadow external effects를 generation별 재생한다." }, { kind: "project-claim", rule: "Cancel ratio·linked account·model score·alert를 위법·유죄·부당이득·자동 고발로 확대하지 않는다." }],
  },
  "pq-account": {
    title: "ERC-4337·ML-DSA verifier·hybrid migration 글이 소유하는 범위",
    owns: ["UserOperation domain·EntryPoint validation-before-effect와 PQ verifier capability boundary", "FIPS 204 signature artifact와 hybrid key/recovery/rollback release gate"],
    reuses: [{ label: "Hash domain separation", href: "/crypto/hash-theory" }, { label: "Key lifecycle", href: "/isms-aml/isms-encryption#key-lifecycle" }, { label: "EVM execution", href: "/blockchain/evm-fundamentals" }],
    evidence: [{ kind: "standard", rule: "AA semantics는 current ERC-4337/7562, ML-DSA는 FIPS 204와 published errata에 각각 귀속한다." }, { kind: "project-measurement", rule: "Exact chain·EntryPoint·bundler·account/verifier bytecode·FIPS profile에서 gas·negative fixture·on-chain receipt를 측정한다." }, { kind: "project-claim", rule: "ERC-4337 signature freedom·FIPS standard 존재를 EVM native precompile·cheap gas·bundler acceptance·PQ security 전체로 확대하지 않는다." }],
  },
  "filecoin-proofs": {
    title: "rust-fil-proofs proof-type·phase·verification stack 글이 소유하는 범위",
    owns: ["PoRep·WindowPoSt·WinningPoSt API router와 typed phase-output envelope", "Expected statement·proof-byte verification router와 stack release gate"],
    reuses: [{ label: "Storage-proof claim decomposition", href: "/blockchain/pos-theory" }, { label: "Filecoin GPU phase artifact chain", href: "/gpu/filecoin-gpu-proofs#phase-chain" }],
    evidence: [{ kind: "primary-source", rule: "API·phase·verification 동작은 rust-fil-proofs commit d451d23와 Filecoin spec commit a950028에 귀속한다." }, { kind: "project-measurement", rule: "Claim/profile/input/cache generation을 고정하고 independent verification 뒤 stage·end-to-end·queue를 측정한다." }, { kind: "project-claim", rule: "API 존재를 current network activation·deadline inclusion·retrieval SLA나 고정 speedup으로 확대하지 않는다." }],
  },
  "proofs-porep": {
    title: "PoRep PC1·PC2·commit artifact 글이 소유하는 범위",
    owns: ["PC1 ReplicaID·label-store artifact와 PC2 replica/tree commitment artifact", "C1/C2 proof receipt와 classic·NI-PoRep 분리 release gate"],
    reuses: [{ label: "PoRep relation", href: "/blockchain/pos-theory#porep" }, { label: "Filecoin proof phase artifact chain", href: "/gpu/filecoin-gpu-proofs#phase-chain" }],
    evidence: [{ kind: "primary-source", rule: "Classic phases는 rust-fil-proofs d451d23·SDR spec a950028, NI-PoRep는 FIP-0090 revision c856d99에 따로 귀속한다." }, { kind: "project-measurement", rule: "같은 sector/profile/generation에서 commitments·proof parity, cache durability·restart와 phase wall time을 확인한다." }, { kind: "project-claim", rule: "NI-PoRep를 classic randomness/artifact와 합치거나 source snapshot을 current activation·고정 sealing time으로 일반화하지 않는다." }],
  },
  "proofs-post": {
    title: "WindowPoSt·WinningPoSt job·submission 글이 소유하는 범위",
    owns: ["WindowPoSt deadline snapshot·partition receipt와 WinningPoSt election job receipt", "Lotus reorg-aware WindowPoSt submission state와 deadline release gate"],
    reuses: [{ label: "PoSt fresh challenge", href: "/blockchain/pos-theory#post" }, { label: "Filecoin deadline release gate", href: "/gpu/filecoin-gpu-proofs#release-gate" }],
    evidence: [{ kind: "primary-source", rule: "Proof API는 rust-fil-proofs d451d23, scheduler·submission은 Lotus v1.36.2 commit c6f4d02에 따로 귀속한다." }, { kind: "project-measurement", rule: "Proof kind·randomness·snapshot·fault policy를 고정하고 independent verify, reorg·deadline·message receipt를 재생한다." }, { kind: "project-claim", rule: "Winning eligibility와 Window maintenance를 섞거나 valid proof를 block/message inclusion·retrieval availability로 확대하지 않는다." }],
  },
  "filecoin-pdp": {
    title: "PDP dataset·challenge·period contract 글이 소유하는 범위",
    owns: ["Ordered pieces의 logical-array dataset artifact와 sampled Merkle proof receipt", "PDP proving-period success/fault state와 contract-provider release gate"],
    reuses: [{ label: "Sampling detection probability", href: "/blockchain/pos-theory#por" }, { label: "Storage proof service boundary", href: "/blockchain/pos-theory#overview" }],
    evidence: [{ kind: "primary-source", rule: "Contract semantics는 FilOzone PDP commit 4d2a930, provider integration은 Curio commit 550f2ee에 각각 귀속한다." }, { kind: "project-measurement", rule: "Dataset revision·seed·period·ABI를 고정하고 local/on-chain parity, deadline·reorg·retry를 재생한다." }, { kind: "project-claim", rule: "Possession receipt를 PoRep encoding·retrieval SLA·future availability 또는 production durability로 확대하지 않는다." }],
  },
  "stablecoin-overview": {
    title: "Stablecoin arrangement·target·backing·stress 글이 소유하는 범위",
    owns: ["Issuance·redemption·stabilization·transfer function map", "Target·market price·redemption claim과 backing risk", "Depeg·run·oracle·bridge recovery release gate"],
    reuses: [{ label: "USDC issuer·CCTP", href: "/blockchain/usdc-circle" }, { label: "DAI collateral debt", href: "/blockchain/dai-maker" }],
    evidence: [{ kind: "primary-source", rule: "Arrangement 경계는 FSB 공식 권고, risk 분류는 BIS 연구에 귀속한다." }, { kind: "project-measurement", rule: "Price·supply·claim·reserve/collateral·queue를 같은 cutoff incident ledger로 재생한다." }, { kind: "project-claim", rule: "Target·market price·유형 이름을 solvency·legal claim·redemption guarantee로 확대하지 않는다." }],
  },
  "usdc-circle": {
    title: "USDC issuer ledger·reserve snapshot·CCTP 글이 소유하는 범위",
    owns: ["Circle Mint fiat settlement↔native USDC mint/redemption ledger", "Reserve disclosure↔circulation cutoff", "CCTP burn·attestation·mint와 replay/domain release gate"],
    reuses: [{ label: "Stablecoin target·claim boundary", href: "/blockchain/stablecoin-overview#overview" }],
    evidence: [{ kind: "primary-source", rule: "Issuer claim은 Circle Transparency/Mint docs, cross-domain behavior는 current CCTP docs와 contract version에 귀속한다." }, { kind: "project-measurement", rule: "Bank·issuer·chain·CCTP receipts를 amount/domain/nonce/block/cutoff로 reconciliation한다." }, { kind: "project-claim", rule: "Assurance·attestation·burn을 audit·instant payout·destination completion·reserve solvency로 확대하지 않는다." }],
  },
  "dai-maker": {
    title: "DAI Vault debt·rate·liquidation·PSM 글이 소유하는 범위",
    owns: ["Vat collateral·normalized debt·rate state", "Oracle unsafe 판정·Dog/Clip auction 경계", "PSM issuer/capacity risk와 DSS parameter release gate"],
    reuses: [{ label: "Stablecoin crypto-collateral risk", href: "/blockchain/stablecoin-overview#stabilization-mechanisms" }],
    evidence: [{ kind: "primary-source", rule: "DSS behavior는 commit fa4f6630, Lite PSM은 dbf00222에 귀속하고 current deployment parameter를 별도 pin한다." }, { kind: "project-measurement", rule: "Vat/Spot/Jug/Dog/Clip/PSM state를 같은 block·deployment manifest에서 failure replay한다." }, { kind: "project-claim", rule: "Historical Maker naming·example threshold·PSM presence를 current Sky 전체·fiat backing·무위험 상환으로 확대하지 않는다." }],
  },
  "uniswap-v4": {
    title: "Uniswap V4 singleton·hook·unlock settlement 글이 소유하는 범위",
    owns: ["PoolManager singleton과 PoolKey identity", "Hook address permission·custom-accounting boundary", "Unlock currency-delta zero settlement와 core/hook/router release gate"],
    reuses: [{ label: "V3 concentrated-liquidity math", href: "/blockchain/uniswap-v3#overview" }, { label: "V2 atomic settlement", href: "/blockchain/uniswap-v2#flash-swap" }],
    evidence: [{ kind: "primary-source", rule: "Runtime semantics는 v4-core v4.0.0 commit e50237c4와 whitepaper에 귀속한다." }, { kind: "project-measurement", rule: "Exact PoolKey·hook codehash/flags·router generation에서 delta/revert/event/gas fixtures를 재생한다." }, { kind: "project-claim", rule: "Valid hook flag·delta zero·singleton을 arbitrary hook safety·price quality·LP return·fixed gas saving으로 확대하지 않는다." }],
  },
  "pbft-hotstuff-lineage": {
    title: "PBFT·HotStuff·HotStuff-2·Jolteon/Ditto protocol-specific ownership",
    owns: ["PBFT slot admission·prepared/committed-local·client reply·stable-checkpoint lifecycle", "HotStuff safeNode·three-chain·pacemaker boundary와 HotStuff-2 double-certificate view entry", "Jolteon one-lock/two-chain·highQC TC와 Ditto state-aware MVBA rejoin"],
    reuses: [{ label: "BFT quorum and partial synchrony", href: "/blockchain/bft-comparison#quorum-safety" }, { label: "State machine replication", href: "/blockchain/consensus-comparison#smr" }, { label: "Generic lock and view-change evidence", href: "/blockchain/bft-comparison#recovery" }],
    evidence: [{ kind: "primary-source", rule: "각 message·threshold·safety/liveness 주장은 PBFT, HotStuff, HotStuff-2, Jolteon/Ditto 원문에 따로 귀속한다." }, { kind: "project-measurement", rule: "동일 request에서 equivocation·partition·timeout·crash를 넣고 conflict 0, GST/fallback progress, state receipt를 분리 측정한다." }, { kind: "project-claim", rule: "Phase 수·QC 이름·historical prototype을 단일 진화 계보, production durability 또는 고정 latency로 확대하지 않는다." }],
  },
  "commonware-primitives-simplex-storage": {
    title: "Commonware primitives·Simplex·storage route-specific ownership",
    owns: ["Commonware runtime context·trait composition과 bridge certificate/application receipt boundary", "Commonware Simplex notarize/nullify/finalize·certification·resolver/journal lifecycle", "Commonware MMR bagging과 QMDB Any/Current·batch/prune recovery boundary"],
    reuses: [{ label: "Generic BFT quorum and partial synchrony", href: "/blockchain/bft-comparison#quorum-safety" }, { label: "State machine replication", href: "/blockchain/consensus-comparison#smr" }, { label: "Existing Commonware crypto P2P", href: "/blockchain/commonware-crypto-p2p" }, { label: "Existing Commonware broadcast", href: "/blockchain/commonware-broadcast" }],
    evidence: [{ kind: "primary-source", rule: "Current implementation facts는 Commonware tag v2026.7.0 commit 5950bf7과 matching docs.rs source에만 귀속한다." }, { kind: "project-measurement", rule: "동일 request·version·config에서 component receipts, deterministic replay, crash/root/proof parity를 비교한다." }, { kind: "project-claim", rule: "Composable primitive·example bridge·candidate root를 completed framework·production safety·durable client effect로 확대하지 않는다." }],
  },
  "tusk-paper-ordering": {
    title: "Tusk paper asynchronous DAG ordering ownership",
    owns: ["Tusk shared-coin leader와 f+1 causal support", "Tusk leader-history traversal, asynchronous randomized liveness와 release boundary"],
    reuses: [{ label: "Narwhal certified DAG", href: "/blockchain/narwhal-deep" }, { label: "Generic DAG linearization", href: "/blockchain/dag-consensus#linearization" }, { label: "Ordering·execution separation", href: "/blockchain/consensus-comparison#smr" }],
    evidence: [{ kind: "primary-source", rule: "Tusk message model·threshold·liveness·evaluation은 Narwhal and Tusk arXiv 2105.11827에만 귀속한다." }, { kind: "project-measurement", rule: "동일 certified DAG에서 coin/support, arrival permutation, missing payload, partition/restart와 order/state receipt를 재생한다." }, { kind: "project-claim", rule: "Zero-message overhead·expected rounds·historical TPS를 zero network traffic·deterministic SLA·current implementation으로 확대하지 않는다." }],
  },
  "filecoin-lotus": {
    title: "Lotus suite process·artifact handoff 글이 소유하는 범위",
    owns: ["Lotus daemon·provider scheduler·worker·Boost process responsibility map", "Tipset·deal·sector·proof·message artifact handoff와 suite release gate"],
    reuses: [{ label: "Expected Consensus", href: "/blockchain/expected-consensus" }, { label: "Filecoin proof API", href: "/blockchain/filecoin-proofs" }, { label: "Deal lifecycle", href: "/blockchain/lotus-market" }],
    evidence: [{ kind: "primary-source", rule: "Process 역할은 current official docs, source behavior는 Lotus v1.36.0 commit 154c0c3에 각각 귀속한다." }, { kind: "project-measurement", rule: "같은 network·actor·proof·service manifest에서 artifact lineage, failure recovery와 e2e receipt를 재생한다." }, { kind: "project-claim", rule: "Component 존재·health를 compatible state·deadline success·retrieval SLA로 확대하지 않는다." }],
  },
  "lotus-chain": {
    title: "Lotus ChainSync·state replay·head application 글이 소유하는 범위",
    owns: ["Header/message stage receipt와 deterministic tipset state replay", "Common-ancestor revert/apply와 ChainSync release gate"],
    reuses: [{ label: "EC valid tipset·weight", href: "/blockchain/expected-consensus#tipset-weight" }, { label: "F3 finalized prefix", href: "/blockchain/filecoin-f3" }],
    evidence: [{ kind: "primary-source", rule: "Sync와 replay 구현은 Lotus v1.36.0 commit 154c0c3, fork-choice semantics는 Filecoin spec에 귀속한다." }, { kind: "project-measurement", rule: "같은 gap·peer fixture·store/hardware에서 header/message/validation/execution/store stage와 root/head parity를 비교한다." }, { kind: "project-claim", rule: "더 높은 candidate·warm sync speed·local head를 더 무거운 valid chain·finality·network SLA로 확대하지 않는다." }],
  },
  "lotus-market": {
    title: "Filecoin deal artifact·activation·retrieval 글이 소유하는 범위",
    owns: ["Proposal·piece·publish/allocation artifact와 sector activation boundary", "Retrieval delivery contract와 legacy/current market migration gate"],
    reuses: [{ label: "PoRep phase artifacts", href: "/blockchain/proofs-porep" }, { label: "Storage proof·service boundary", href: "/blockchain/pos-theory#overview" }],
    evidence: [{ kind: "primary-source", rule: "Current flow는 Filecoin docs와 Boost commit 240aa6e에 귀속하고 legacy Lotus markets와 구분한다." }, { kind: "project-measurement", rule: "같은 proposal/PieceCID/chain profile에서 publish·activation·retrieval receipts와 reorg·retry를 재생한다." }, { kind: "project-claim", rule: "Proposal acceptance·publish·storage proof·index result를 sector activation·delivery·payment success로 확대하지 않는다." }],
  },
  "lotus-miner": {
    title: "Lotus provider sector task·proof duty scheduling 글이 소유하는 범위",
    owns: ["Sector task generation과 sealing artifact→chain milestone bridge", "Winning/Window duty router와 provider scheduler release gate"],
    reuses: [{ label: "PoRep artifacts", href: "/blockchain/proofs-porep" }, { label: "Window·Winning receipts", href: "/blockchain/proofs-post" }],
    evidence: [{ kind: "primary-source", rule: "Legacy paths는 Lotus v1.36.0 commit 154c0c3, current task design은 Curio official docs에 따로 귀속한다." }, { kind: "project-measurement", rule: "Same sector/profile/deadline에서 artifact parity·lease/retry·independent proof verify·chain inclusion과 slack을 측정한다." }, { kind: "project-claim", rule: "Proof generation·worker health·평균 stage time을 active sector·block/message inclusion·deadline success로 확대하지 않는다." }],
  },
  "curve-stable": {
    title: "Curve StableSwap invariant·risk 글이 소유하는 범위",
    owns: ["정규화 balances와 amplification invariant", "A ramp·depeg inventory 경계와 StableSwap release gate"],
    reuses: [{ label: "Constant-product AMM invariant", href: "/blockchain/uniswap-v2#constant-product" }, { label: "Stablecoin target·redemption 경계", href: "/blockchain/stablecoin-overview#overview" }],
    evidence: [{ kind: "primary-source", rule: "Invariant와 A의 주장은 StableSwap whitepaper, 구현 주장은 pinned stableswap-ng commit 2abe778f에 귀속한다." }, { kind: "project-measurement", rule: "같은 token/rate/A generation에서 integer D·output·fee·LP supply와 depeg stress를 paired 비교한다." }, { kind: "project-claim", rule: "낮은 slippage를 peg·issuer solvency·LP 무손실 또는 고정 current parameter로 확대하지 않는다." }],
  },
  "rwa-composition": {
    title: "RWA claim·asset·token composition 글이 소유하는 범위",
    owns: ["Legal claim과 authoritative ownership record의 token linkage", "Issuer/custodian/servicer map·valuation cutoff·DeFi composition release gate"],
    reuses: [{ label: "Stablecoin arrangement functions", href: "/blockchain/stablecoin-overview#overview" }, { label: "VASP custody reconciliation", href: "/isms-aml/vasp-custody-management#proof-withdrawal-boundary" }],
    evidence: [{ kind: "primary-source", rule: "Legal/ownership 위험은 IOSCO 2025, claim/service layer는 BIS tokenisation analysis에 귀속한다." }, { kind: "project-measurement", rule: "Legal register·asset/custody·NAV·token supply·cash queue·oracle를 같은 cutoff에서 대조한다." }, { kind: "project-claim", rule: "Token balance·NAV·allowlist를 직접 title·파산격리·즉시 상환·투자 적합성 또는 법률 자문으로 확대하지 않는다." }],
  },
  "berachain": {
    title: "Berachain PoL incentive·consensus boundary 글이 소유하는 범위",
    owns: ["BERA/BGT/HONEY 기능과 PoL boost·allocation·vault reward lifecycle", "BeaconKit consensus evidence와 reward receipt 분리·release gate"],
    reuses: [{ label: "CometBFT quorum/finality", href: "/blockchain/cometbft-consensus" }, { label: "Stablecoin system boundary", href: "/blockchain/stablecoin-overview" }],
    evidence: [{ kind: "primary-source", rule: "PoL·BGT·Reward Vault current facts는 2026-08-14 공식 docs, BeaconKit 구현은 commit 59c0fd16에 귀속한다." }, { kind: "project-measurement", rule: "같은 height·contract generation에서 BERA stake·BGT boost/allocation·vault accounting·block commit receipts를 분리 대조한다." }, { kind: "project-claim", rule: "BGT incentive·vault TVL을 consensus finality·security 비례 증가·고정 APR/parameter로 확대하지 않는다." }],
  },
  "crypto-theory": {
    title: "암호 primitive security-game 공통 언어 글이 소유하는 범위",
    owns: ["Correctness와 adversarial security 분리·game advantage", "Computational/information-theoretic 경계·assumption reduction·domain artifact release gate"],
    reuses: [{ label: "Hash security games", href: "/crypto/hash-theory#input-security" }, { label: "Key authority lifecycle", href: "/isms-aml/cryptographic-control#key-lifecycle" }, { label: "Finite-field arithmetic", href: "/crypto/finite-field-theory" }],
    evidence: [{ kind: "primary-source", rule: "Semantic encryption security는 Goldwasser–Micali, key lifecycle은 NIST SP 800-57, AEAD interface는 RFC 5116에 귀속한다." }, { kind: "project-measurement", rule: "Exact algorithm/profile/domain/encoding/key/nonce generation에서 vectors·negative oracles·interoperability·migration을 재생한다." }, { kind: "project-claim", rule: "Correct output·algorithm name·key length만으로 security game·composition·side-channel·post-quantum 안전을 보장하지 않는다." }],
  },
  "ethereum-evm-core-advanced": {
    title: "EVM fundamentals·advanced route-specific ownership",
    owns: ["256-bit stack step·execution environment·gas-before-effect와 journaled rollback", "Frame-local memory expansion·CREATE init/runtime address boundary", "CALL·DELEGATECALL·STATICCALL context authority와 nested halt propagation"],
    reuses: [{ label: "Ethereum MPT state commitment", href: "/blockchain/merkle-patricia-trie" }, { label: "Reth fork-aware block execution", href: "/blockchain/reth-block-execution" }, { label: "Reth EIP-1559 fee market", href: "/blockchain/reth-eip1559" }],
    evidence: [{ kind: "primary-source", rule: "EVM semantics는 Yellow Paper Shanghai revision, 활성 EIP와 pinned execution-specs fork에 귀속한다." }, { kind: "project-measurement", rule: "같은 transaction·pre-state·fork에서 status·gas·logs·return data·post-state root parity를 비교한다." }, { kind: "project-claim", rule: "Gas를 wall-clock 비용으로, EVM validity를 canonical finality로, CREATE2 주소를 deployment 보장으로 확대하지 않는다." }],
  },
  "eip2124-fork-id": {
    title: "EIP-2124 generic Fork ID ownership",
    owns: ["Genesis·passed block forks의 CRC32 FORK_HASH와 FORK_NEXT encoding", "Same·remote-subset·remote-superset·incompatible local-head validation", "Fork-boundary·encoding·timestamp-extension release matrix"],
    reuses: [{ label: "Reth ChainSpec implementation", href: "/blockchain/reth-chainspec" }, { label: "Reth peer/session path", href: "/blockchain/reth-net" }, { label: "Ethereum node Engine boundary", href: "/blockchain/node-architecture" }],
    evidence: [{ kind: "standard", rule: "Block-number compatibility는 EIP-2124, timestamp extension은 EIP-6122에 각각 귀속한다." }, { kind: "project-measurement", rule: "Fork 직전·경계·직후와 endian·duplicate·stale-next·sync-direction fixtures의 decision reason parity를 검사한다." }, { kind: "project-claim", rule: "CRC32나 handshake accept를 peer honesty·block validity·finality 증명으로 확대하지 않는다." }],
  },
  "ethereum-engine-node-boundary": {
    title: "Ethereum execution node·Engine API ownership",
    owns: ["Protocol-level EL execution validity와 CL fork-choice/finality authority boundary", "Versioned Engine methods와 payload status lifecycle", "Validated payload·head·safe·finalized·durable state cursor와 reorg/crash release gate"],
    reuses: [{ label: "EVM deterministic execution", href: "/blockchain/evm-fundamentals" }, { label: "Reth concrete architecture", href: "/blockchain/reth" }, { label: "Reth ChainSpec and Fork ID", href: "/blockchain/reth-chainspec" }],
    evidence: [{ kind: "standard", rule: "Engine method·schema·status는 표시한 execution-apis snapshot과 활성 fork version에 귀속한다." }, { kind: "primary-source", rule: "Concrete module·builder·storage path는 pinned Reth v2.2.0에만 귀속하고 generic protocol 경계와 구분한다." }, { kind: "project-measurement", rule: "Exact EL/CL versions·genesis·fork schedule에서 Engine trace·reorg·crash·state-root parity를 검사한다." }, { kind: "project-claim", rule: "EL VALID를 CL finality로, JWT 성공을 correctness로, process health를 compatible node release로 확대하지 않는다." }],
  },
  "lotus-state": {
    title: "Lotus StateTree·actor record·HAMT/AMT ownership",
    owns: ["ID address→actor record→Head CID의 versioned 조회 경계", "HAMT·AMT parameter path와 StateTree snapshot·revert·flush·release gate"],
    reuses: [{ label: "FVM transactional state receipt", href: "/blockchain/filecoin-fvm#state-commit" }, { label: "Content-addressed artifact", href: "/p2p/content-addressing#overview" }, { label: "Lotus deterministic state replay", href: "/blockchain/lotus-chain#state-replay" }],
    evidence: [{ kind: "standard", rule: "StateTree protocol 역할은 Filecoin specification과 actor 공식 문서에 귀속한다." }, { kind: "primary-source", rule: "Load·lookup·snapshot·flush facts는 Lotus v1.36.2 commit c6f4d02와 pinned HAMT dependency에만 귀속한다." }, { kind: "project-measurement", rule: "Exact tree/network/bundle/codec parameters에서 actor fields·root·revert/crash parity를 검사한다." }, { kind: "project-claim", rule: "Root parity를 actor logic 안전·chain finality·database durability·fixed latency로 확대하지 않는다." }],
  },
  "giwa-chain": {
    title: "GIWA OP Stack node·head consumption ownership",
    owns: ["GIWA chain/source/config generation artifact와 op-node·op-reth Engine handoff", "Unsafe·safe·finalized application policy와 node canary·rollback gate"],
    reuses: [{ label: "Rollup execution·DA·settlement and derivation", href: "/blockchain/rollup-fundamentals" }, { label: "Fork choice와 finality 분리", href: "/blockchain/consensus-comparison#finality" }, { label: "Stablecoin reserve·redemption", href: "/blockchain/stablecoin-overview" }],
    evidence: [{ kind: "standard", rule: "Generic batch derivation은 표시한 OP Stack specification revision에 귀속한다." }, { kind: "primary-source", rule: "GIWA network facts는 current official docs, concrete service/version facts는 node v0.6.0 commit 8cabd0d5에만 귀속한다." }, { kind: "project-measurement", rule: "Exact genesis·rollup config·L1 origin·binary generation에서 payload/state/head parity와 reorg·restart를 검사한다." }, { kind: "project-claim", rule: "OP Stack 채택·JWT·process health를 mainnet readiness·security inheritance·sequencer liveness·stablecoin peg/compliance 보장으로 확대하지 않는다." }],
  },
  "filecoin-fvm": {
    title: "FVM message·state·actor-bundle execution ownership",
    owns: ["Message·base state·network version·actor manifest execution envelope", "Nested actor transaction·state-root receipt와 FVM runtime release gate"],
    reuses: [{ label: "Deterministic state transition", href: "/blockchain/consensus-comparison#smr" }, { label: "Content-addressed artifact", href: "/p2p/content-addressing#overview" }],
    evidence: [{ kind: "standard", rule: "Protocol 도입은 Final FIP-0030 revision c856d99에 귀속한다." }, { kind: "primary-source", rule: "Executor·transaction·manifest facts는 ref-fvm commit ef0a993에만 귀속한다." }, { kind: "project-measurement", rule: "Exact message/state/version/bundle에서 state·receipt parity와 crash replay를 측정한다." }, { kind: "project-claim", rule: "Reference source를 current activation·actor safety·fixed gas/throughput 보장으로 확대하지 않는다." }],
  },
  "filecoin-ipc": {
    title: "IPC subnet·top-down·bottom-up receipt ownership",
    owns: ["Subnet genesis·validator-power boot artifact", "Parent-finality top-down과 bottom-up checkpoint·cross-network release receipts"],
    reuses: [{ label: "BFT quorum intersection", href: "/blockchain/bft-comparison#quorum-safety" }, { label: "State transition과 client effect", href: "/blockchain/consensus-comparison#smr" }],
    evidence: [{ kind: "primary-source", rule: "IPC semantics와 contracts는 repository commit bcd7c0d에 귀속한다." }, { kind: "project-measurement", rule: "Local·quorum·relay·parent·destination receipts와 stage latency를 같은 message ID로 측정한다." }, { kind: "project-claim", rule: "Parent 존재·checkpoint·relayer 제출을 inherited safety·destination effect·고정 latency로 확대하지 않는다." }],
  },
  "filecoin-storacha": {
    title: "Storacha capability·blob·index·Filecoin receipt ownership",
    owns: ["Space UCAN capability와 blob effect-chain receipt", "Sharded DAG index artifact와 Filecoin-policy release gate"],
    reuses: [{ label: "Content-address integrity", href: "/p2p/content-addressing#overview" }, { label: "Filecoin proof service boundary", href: "/blockchain/filecoin-proofs#overview" }],
    evidence: [{ kind: "standard", rule: "Protocol facts와 maturity는 Storacha specs commit 3b67918에 귀속한다." }, { kind: "project-measurement", rule: "Capability·allocate/put/accept·index range·CID retrieval·Filecoin stage receipts를 각각 재생한다." }, { kind: "project-claim", rule: "Stable/reliable·upload/offer를 public retrieval·deal success·permanent storage로 확대하지 않는다." }],
  },
  "ipfs-filecoin-storage": {
    title: "IPFS content·Filecoin retention integration ownership",
    owns: ["CID·CAR·Piece/deal identity-map artifact", "Multi-path verified retrieval, retention receipt와 integration release gate"],
    reuses: [{ label: "IPFS content addressing", href: "/p2p/content-addressing#overview" }, { label: "Kubo routing·Bitswap·pin", href: "/p2p/kubo#routing-bitswap" }, { label: "Filecoin proof stack", href: "/blockchain/filecoin-proofs#overview" }],
    evidence: [{ kind: "standard", rule: "Routing·Bitswap semantics는 IPFS specs commit ff7230f에 귀속한다." }, { kind: "primary-source", rule: "Kubo implementation은 stable v0.42.0, Filecoin bridge는 Storacha specs commit 3b67918로 pin한다." }, { kind: "project-measurement", rule: "Mapping digest·CID bytes·path latency·pin/deal/proof status와 correlated outages를 측정한다." }, { kind: "project-claim", rule: "Provider ad·pin·deal·proof 한 항목을 possession·retrieval SLA·영구 보존으로 확대하지 않는다." }],
  },
  "filecoin-onchain-cloud": {
    title: "Filecoin Cloud dataset·proof·payment service ownership",
    owns: ["Dataset-service generation artifact와 proof-gated settlement window", "Payment-rail lockup envelope와 end-to-end service release gate"],
    reuses: [{ label: "PDP dataset·period·fault state", href: "/blockchain/filecoin-pdp#dataset-artifact" }, { label: "Filecoin proof service boundary", href: "/blockchain/filecoin-proofs#overview" }],
    evidence: [{ kind: "primary-source", rule: "Service·contract facts는 filecoin-services commit a391c1c, payment facts는 filecoin-pay commit 04ded6a에 귀속한다." }, { kind: "project-measurement", rule: "Upload·dataset·proof-period·rail·retrieval receipts를 같은 service digest와 chain confidence에서 대조한다." }, { kind: "project-claim", rule: "Store·proof·event·lockup 한 항목을 retrieval SLA·durability·영구 보존·solvency로 확대하지 않는다." }],
  },
  "lotus-mpool": {
    title: "Lotus head-relative admission·nonce·gas lifecycle ownership",
    owns: ["Head-relative message admission과 sender nonce-chain selection", "Gas-estimate context receipt와 head-change/restart release gate"],
    reuses: [{ label: "FVM message execution envelope", href: "/blockchain/filecoin-fvm#message-envelope" }, { label: "Generic mempool local admission", href: "/blockchain/cometbft-mempool#overview" }],
    evidence: [{ kind: "primary-source", rule: "Lotus implementation facts는 v1.36.0 commit 154c0c3, effective-premium semantics는 FIP-0054 revision c856d99에 귀속한다." }, { kind: "project-measurement", rule: "Exact head·actor state·network/config에서 admission reasons, nonce packages, gas receipts와 apply/revert/restart parity를 재생한다." }, { kind: "project-claim", rule: "Local admission·estimate·selection을 inclusion·execution success·finality·optimal ordering으로 확대하지 않는다." }],
  },
  "initia-evm": {
    title: "MiniEVM Ethereum-envelope·Cosmos-state integration ownership",
    owns: ["Ethereum↔Cosmos transaction envelope와 Ante/EVM sequence reconciliation", "Cosmos-backed StateDB overlay·token/precompile keeper boundary와 execution release gate"],
    reuses: [{ label: "EVM execution·gas·journal semantics", href: "/blockchain/evm-fundamentals" }, { label: "Cosmos BaseApp·Ante·keeper·CacheMultiStore", href: "/blockchain/cosmos-sdk#runtx-pipeline" }, { label: "EVM precompile ABI·gas boundary", href: "/blockchain/evm-advanced#precompile" }],
    evidence: [{ kind: "primary-source", rule: "Transaction·sequence·StateDB·token/precompile facts는 MiniEVM v1.2.19 commit 27e60c5에만 귀속한다." }, { kind: "standard", rule: "Compatibility surface는 2026-08-14 확인한 Initia 공식 문서와 deployed exact revision을 함께 확인한다." }, { kind: "project-measurement", rule: "같은 pre-state·block context에서 transaction fields·sequence·status·gas·logs·balance·app hash와 crash replay를 대조한다." }, { kind: "project-claim", rule: "Ethereum tooling 호환·RPC hash·EVM success를 mainnet architecture parity·Cosmos commit·finality로 확대하지 않는다." }],
  },
  "kohaku-provider": {
    title: "Kohaku provider API·method provenance·signer boundary ownership",
    owns: ["Ethers·Viem·Helios·Colibri common provider surface와 result normalization", "Method별 trust provenance·read/signer authority 분리와 adapter release gate"],
    reuses: [{ label: "Helios proof-bound RPC response", href: "/blockchain/helios#verification" }, { label: "Helios fallback trust boundary", href: "/blockchain/helios#trust-boundary" }],
    evidence: [{ kind: "primary-source", rule: "Provider interface·adapter·bypass facts는 Kohaku commit 8d5a29e, package 0.1.0-alpha.8에만 귀속한다." }, { kind: "project-measurement", rule: "같은 chain·block fixture에서 method value/error/provenance, silent downgrade와 duplicate submission을 adapter별로 대조한다." }, { kind: "project-claim", rule: "Common API·type parity를 동일 semantics·light-client verification·privacy·production readiness·audit 완료로 확대하지 않는다." }],
  },
  "omni-octane": {
    title: "Omni Octane ABCI·Engine payload integration ownership",
    owns: ["ABCI proposal의 execution-payload envelope와 proposer build-attempt lifecycle", "Candidate status·CometBFT commit·finalized execution head 분리", "Per-event branch delivery와 pinned integration release gate"],
    reuses: [{ label: "CometBFT proposal·finalize semantics", href: "/blockchain/cometbft-abci" }, { label: "Engine API method·status lifecycle", href: "/blockchain/node-architecture#payload-state" }, { label: "Client effect boundary", href: "/blockchain/consensus-comparison#smr" }],
    evidence: [{ kind: "primary-source", rule: "Octane·Halo·Engine adapter facts는 Omni commit 9864f25와 그 go.mod dependencies에만 귀속한다." }, { kind: "standard", rule: "Engine method·schema·status 의미는 표시한 execution-apis snapshot과 active fork/capability에 귀속한다." }, { kind: "project-measurement", rule: "같은 height·payload·client generation에서 build/status/commit/FCU와 observed·committed·failed event branches를 대조한다." }, { kind: "project-claim", rule: "README goal·payload VALID·CometBFT commit·event branch 한 항목을 all-client compatibility·production readiness·cross-chain success로 확대하지 않는다." }],
  },
  "webcat-frontend-integrity": {
    title: "WEBCAT frontend integrity ownership",
    owns: ["HTTPS 뒤 first-party frontend code integrity gap", "Signed manifest·local verification·transparency enrollment과 alpha release boundary"],
    reuses: [{ label: "Hash input·security contract", href: "/crypto/hash-theory#input-security" }],
    evidence: [{ kind: "primary-source", rule: "Architecture는 WEBCAT concepts/FAQ, maturity는 SecureDrop 2026 alpha 발표에 귀속한다." }, { kind: "project-claim", rule: "Manifest 검증을 code correctness·developer honesty·모든 browser 지원으로 확대하지 않는다." }],
  },
  "binary-field-proving": {
    title: "Binary-field proving ownership",
    owns: ["F₂·binary tower와 Boolean arithmetization fit", "Binius·Flock를 통한 conventional-hash-friendly proving 선택 경계"],
    reuses: [{ label: "Poseidon field-native hash", href: "/crypto/poseidon-hash#overview" }, { label: "FRI·STARK pipeline", href: "/crypto/stark-theory#overview" }],
    evidence: [{ kind: "primary-source", rule: "Binius·Flock construction과 benchmark는 각 논문의 exact field·batch·hardware 조건에 귀속한다." }, { kind: "project-claim", rule: "Reduced-round cryptanalysis를 full-round break로, prototype throughput을 Ethereum 채택으로 확대하지 않는다." }],
  },
  "ethereum-future-roadmap": {
    title: "Ethereum future roadmap ownership",
    owns: ["배포·채택 검토·연구 방향·실험 결과 maturity 분리", "PQ surfaces·proof/execution direction·AI candidate/deterministic verifier 경계"],
    reuses: [{ label: "PQ account migration", href: "/blockchain/pq-account" }, { label: "Binary-field proving", href: "/crypto/binary-field-proving" }],
    evidence: [{ kind: "standard", rule: "Protocol fact는 accepted EIP/spec과 deployment를 확인하고 roadmap·strawmap wording을 채택 완료로 쓰지 않는다." }, { kind: "project-claim", rule: "AI가 만든 proof candidate를 deterministic formal verification 결과로 확대하지 않는다." }],
  },
  "activation-functions": {
    title: "활성화 함수 기초 글이 소유하는 범위",
    owns: [
      "Affine score와 activation output·local slope의 첫 연결",
      "Step·sigmoid·tanh의 출력 의미와 saturation 경계",
    ],
    reuses: [
      { label: "Rectifier와 dying path", href: "/ai/rectifier-activations" },
      { label: "GELU·SiLU·SwiGLU", href: "/ai/gated-activations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Sigmoid·tanh saturation과 scaling claim은 Efficient BackProp과 Glorot 분석 범위로 제한한다." },
      { kind: "standard", rule: "출력 범위·local derivative·불연속 convention을 같은 함수 계약으로 기록한다." },
    ],
  },
  "rectifier-activations": {
    title: "Rectifier 활성화 글이 소유하는 범위",
    owns: [
      "ReLU hinge의 forward·backward mask와 dying-state 진단",
      "Leaky·PReLU의 음수 경로와 SELU recipe의 조건 경계",
    ],
    reuses: [
      { label: "Saturation과 local slope 기초", href: "/ai/activation-functions" },
      { label: "Smooth self-gate", href: "/ai/gated-activations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "ReLU·PReLU·ELU·SELU claim은 각 원 논문의 architecture·초기화·실험 조건으로 제한한다." },
      { kind: "project-measurement", rule: "Dead-unit 판정은 한 sample의 0이 아니라 여러 batch의 pre-activation·mask·update norm으로 측정한다." },
    ],
  },
  "gated-activations": {
    title: "Smooth·gated 활성화 글이 소유하는 범위",
    owns: [
      "GELU·SiLU의 scalar self-gate와 곱셈 의도",
      "SwiGLU gate·value·output projection과 parameter parity",
    ],
    reuses: [
      { label: "Step·sigmoid·tanh 기초", href: "/ai/activation-functions" },
      { label: "ReLU와 negative slope", href: "/ai/rectifier-activations" },
    ],
    evidence: [
      { kind: "primary-source", rule: "GELU·Swish·SwiGLU claim은 원 논문의 search·model·parameter-matching 조건으로 제한한다." },
      { kind: "project-measurement", rule: "Scalar curve와 gated FFN을 구분하고 parameter·FLOP·kernel·latency를 같은 예산에서 비교한다." },
    ],
  },
  "qwen36-hybrid-architecture": {
    title: "Qwen3.6-27B hybrid architecture 글이 소유하는 범위",
    owns: [
      "공식 layer_types를 48 Gated DeltaNet·16 Gated Attention으로 분리하는 3:1 schedule",
      "Qwen3.6 attention KV의 token당 64 KiB와 DeltaNet FP32 core state의 request당 144 MiB shape 계산",
      "Delta-rule prediction-error correction의 감쇠·read·error·key-directed write 연산",
    ],
    reuses: [
      { label: "Attention Q·K·V와 multi-head", href: "/ai/attention-theory" },
      { label: "KV cache·GQA 기초", href: "/ai/kv-cache-fundamentals" },
      { label: "RNN recurrent state와 압축 한계", href: "/ai/rnn" },
    ],
    evidence: [
      { kind: "primary-source", rule: "모델명·3:1 layer pattern과 attention·linear head shape는 Qwen3.6-27B 공식 model card·config revision에 귀속한다." },
      { kind: "primary-source", rule: "Gating·prediction-error correction과 parallel recurrence claim은 Gated Delta Networks 원 논문의 조건에 귀속한다." },
      { kind: "project-claim", rule: "64 KiB/token KV와 144 MiB core state는 명시한 logical shape·dtype 계산이며 allocator·TP·convolution history를 포함한 physical allocation으로 확대하지 않는다." },
    ],
  },
  "qwen36-hybrid-runtime": {
    title: "Qwen3.6 hybrid runtime 글이 소유하는 범위",
    owns: [
      "Attention KV와 Delta recurrent·convolution state를 request별 성장축으로 분리하는 runtime memory",
      "Prefill·decode·MTP에서 세 cache를 같은 accepted prefix에 원자적으로 commit·rollback하는 transaction",
    ],
    reuses: [
      { label: "Qwen3.6의 두 memory shape", href: "/ai/qwen36-hybrid-architecture" },
      { label: "vLLM cache block과 hybrid groups", href: "/ai/vllm-paged-attention" },
      { label: "Speculative draft·verify·commit", href: "/ai/vllm-spec-decode" },
    ],
    evidence: [
      { kind: "standard", rule: "Hybrid cache grouping은 vLLM stable design에, chunk·recurrent path와 fallback은 확인한 Transformers reference revision에 귀속한다." },
      { kind: "project-claim", rule: "Prefix transaction은 KV·Delta·convolution state를 같은 accepted boundary에서 비교하는 lifecycle contract이며 특정 engine의 atomic API 존재를 주장하지 않는다." },
    ],
  },
  "qwen36-long-context-deployment": {
    title: "Qwen3.6 long-context deployment 글이 소유하는 범위",
    owns: [
      "Partial multimodal RoPE와 text·image·video token position axes",
      "Native 262K와 extended 1.01M context의 지원·품질 claim 경계",
      "Qwen official BF16·mixed-FP8 payload를 48 GiB known floor에 적용하는 계산",
      "Architecture·memory·kernel·quality receipt로 context profile을 승인하는 release gate",
    ],
    reuses: [
      { label: "Qwen3.6의 두 memory shape", href: "/ai/qwen36-hybrid-architecture" },
      { label: "Qwen3.6 request state lifecycle", href: "/ai/qwen36-hybrid-runtime" },
      { label: "Model weight·KV·workspace VRAM 계산 정본", href: "/ai/model-vram-budgeting" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Native·extended context와 modality support는 Qwen 공식 model card에, partial mRoPE layout은 official config·Transformers reference에 귀속한다." },
      { kind: "primary-source", rule: "BF16 total_size와 FP8·BF16 histogram은 official safetensors index와 mixed-FP8 checkpoint revision에 귀속한다." },
      { kind: "project-claim", rule: "44.89 GiB known floor와 3.11 GiB 후보 공간은 logical 적용 예이며 physical 262K admission과 retrieval 품질 보장이 아니다." },
    ],
  },
  "model-vram-budgeting": {
    title: "Model VRAM budgeting 글이 소유하는 범위",
    owns: [
      "Parameter headline을 checkpoint dtype별 weight payload로 바꾸는 범용 계산 절차",
      "Attention KV·recurrent state·activation·workspace의 서로 다른 memory growth classes",
      "Known logical floor와 physical runtime peak를 구분하는 device admission 판정",
      "MoE total weight residency·active token path·context/runtime state를 서로 다른 serving ledger로 분리하는 경계",
      "Model identity·geometry·runtime·retention을 묶는 startup memory receipt",
    ],
    reuses: [
      { label: "Quantization과 resident-memory ledger", href: "/ai/quantization" },
      { label: "KV pool과 serving capacity", href: "/ai/llm-serving-capacity" },
      { label: "Qwen3.6 hybrid request state 적용", href: "/ai/qwen36-hybrid-runtime" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Parameter·dtype·payload는 배포할 exact checkpoint index와 tensor metadata revision에 귀속한다." },
      { kind: "standard", rule: "Logical cache shape는 model config에, physical allocation·workspace·peak는 사용한 serving engine·kernel·GPU profile의 startup receipt에 귀속한다." },
      { kind: "project-claim", rule: "Known floor가 device capacity보다 작다는 계산을 load 성공·최대 context 품질·production concurrency 보장으로 확대하지 않는다." },
      { kind: "project-measurement", rule: "Prefill·decode·MTP 병목과 hardware sweet spot은 exact model/runtime/hardware topology/checkpoint quantization·input/output length·context·batch/concurrency·KV dtype·sampling 설정·측정 방법·반복 횟수·허용 오차가 있는 stage receipt에만 귀속한다." },
      { kind: "project-claim", rule: "미공개 model spec·Q8 약어·현장 체감 임계점은 공식 artifact와 재현 receipt 전까지 canonical fact나 구매 권고로 승격하지 않는다." },
    ],
  },
  "dpo": {
    title: "DPO 글이 소유하는 범위",
    owns: [
      "같은 prompt의 chosen·rejected pair contract와 label boundary",
      "Policy/reference log-ratio에서 chosen−rejected margin을 만드는 DPO objective",
      "Offline pair support·length/style shortcut·독립 배포 평가 경계",
    ],
    reuses: [
      { label: "Reward model·online PPO-RLHF", href: "/ai/rlhf" },
      { label: "SFT response-token objective", href: "/ai/supervised-fine-tuning" },
    ],
    evidence: [
      { kind: "primary-source", rule: "DPO 유도와 실험 claim은 원 논문의 KL-regularized objective·Bradley–Terry·dataset 조건에 귀속한다." },
      { kind: "standard", rule: "Reference revision·chat template·loss variant·length aggregation을 구현 receipt에 고정한다." },
      { kind: "project-measurement", rule: "Pair loss와 배포 behavior를 분리해 사실성·안전성·capability·length slice를 paired 비교한다." },
    ],
  },
  "constitutional-ai": {
    title: "Constitutional AI 글이 소유하는 범위",
    owns: [
      "Natural-language constitution의 trigger·principle·priority·audit example 형태",
      "Principle 기반 critique→revision과 AI feedback pipeline",
      "AI judge provenance·shared blind spot·human oversight 경계",
    ],
    reuses: [
      { label: "Reward model·PPO feedback loop", href: "/ai/rlhf" },
      { label: "Direct pair optimization", href: "/ai/dpo" },
    ],
    evidence: [
      { kind: "primary-source", rule: "CAI phase와 RLAIF claim은 원 논문의 constitution·model·prompt·evaluation 범위에만 귀속한다." },
      { kind: "project-measurement", rule: "Principle별 violation·over-refusal·judge disagreement와 blinded human audit을 분리해 측정한다." },
      { kind: "project-claim", rule: "AI feedback 사용을 human oversight 제거·완전한 원칙·value alignment 증명으로 확대하지 않는다." },
    ],
  },
  "orpo": {
    title: "ORPO 글이 소유하는 범위",
    owns: [
      "Chosen NLL과 chosen/rejected sequence-odds separation의 결합",
      "Reference-free와 pair-free를 구분하는 single-stage training contract",
      "Reference forward 절감과 전체 training memory·quality 평가 경계",
    ],
    reuses: [
      { label: "SFT token likelihood", href: "/ai/supervised-fine-tuning" },
      { label: "Pairwise preference contract", href: "/ai/dpo#pair-contract" },
    ],
    evidence: [
      { kind: "primary-source", rule: "ORPO objective와 benchmark는 원 논문의 model 규모·dataset·sequence probability convention에 귀속한다." },
      { kind: "project-measurement", rule: "동일 base·pair·token budget에서 memory·step time·chosen quality·preference margin·safety regression을 함께 측정한다." },
      { kind: "project-claim", rule: "한 stage와 reference-free를 data audit·evaluation 제거 또는 보편적 비용 절반으로 확대하지 않는다." },
    ],
  },
  "kto": {
    title: "KTO 글이 소유하는 범위",
    owns: [
      "Exposure·desirable·undesirable·class balance를 분리한 binary-feedback data contract",
      "Policy/reference log-ratio·KL reference point·비대칭 utility의 KTO objective",
      "Pair-free feedback의 logging bias·independent evaluation 경계",
    ],
    reuses: [
      { label: "Reference policy와 KL drift", href: "/ai/rlhf#ppo" },
      { label: "Pairwise preference와 DPO", href: "/ai/dpo" },
    ],
    evidence: [
      { kind: "primary-source", rule: "KTO utility와 결과는 원 논문의 reference·KL estimate·model·dataset·class imbalance 조건에 귀속한다." },
      { kind: "project-measurement", rule: "노출·무응답·사용자별 click propensity와 class balance를 기록하고 pairwise human audit과 behavior regression을 따로 측정한다." },
      { kind: "project-claim", rule: "Pair가 필요 없다는 장점을 binary log의 무편향·clean label·보편적 우월성으로 확대하지 않는다." },
    ],
  },
  "reverse-mode-autodiff": {
    title: "Reverse-mode autodiff 글이 소유하는 범위",
    owns: [
      "Computational graph·autodiff tape·saved tensor의 실행 의미",
      "Scalar seed에서 VJP와 fan-out sum으로 input 책임을 누적하는 reverse mode",
      "Activation 저장과 checkpoint recomputation의 compute–memory 경계",
    ],
    reuses: [
      { label: "Derivative·chain rule", href: "/ai/math-functions-derivatives-gradients" },
      { label: "Gradient·Jacobian 수학", href: "/ai/math-gradients-jacobians" },
      { label: "신경망 parameter에 적용한 backprop", href: "/ai/backprop-optimization" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Autodiff 비용·동작 claim은 primitive derivative와 추적 가능한 program이라는 survey 전제로 제한한다." },
      { kind: "standard", rule: "Tape 저장과 recompute를 같은 memory·compute·random-state 조건에서 비교한다." },
    ],
  },
  "softmax": {
    title: "Softmax 글이 소유하는 범위",
    owns: [
      "Logit을 categorical 공동 probability로 바꾸는 exponential normalization",
      "Maximum-logit shift invariance와 temperature scaling",
      "서로 배타적인 categorical output과 multi-label sigmoid의 의미 경계",
    ],
    reuses: [
      { label: "Cross-entropy·NLL·likelihood", href: "/ai/cross-entropy" },
      { label: "Fused softmax–CE gradient", href: "/ai/backprop-optimization#tensor-backward" },
    ],
    evidence: [
      { kind: "standard", rule: "Softmax는 mutually-exclusive categorical output 계약 안에서만 공동 class probability로 해석한다." },
      { kind: "project-measurement", rule: "Temperature 효과는 같은 logits·dtype·calibration set에서 probability와 downstream metric을 함께 기록한다." },
    ],
  },
  "backprop-optimization": {
    title: "신경망 backprop 글이 소유하는 범위",
    owns: [
      "Scalar loss에서 neural parameter까지 error derivative를 보내는 application boundary",
      "Fused softmax–cross-entropy logit gradient와 batched linear backward",
      "Gradient 계산과 optimizer·regularization intervention의 책임 분리",
    ],
    reuses: [
      { label: "Reverse-mode autodiff·VJP", href: "/ai/reverse-mode-autodiff" },
      { label: "Softmax normalization", href: "/ai/softmax" },
      { label: "Optimizer update", href: "/ai/optimizers" },
      { label: "Regularization 실무", href: "/ai/regularization-practice" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Backprop 역사·효율 claim은 원 논문의 differentiable supervised network와 사례 범위로 제한한다." },
      { kind: "standard", rule: "Gradient 계산, gradient intervention, optimizer update를 서로 다른 stage로 기록한다." },
    ],
  },
  "rnn": {
    title: "RNN hidden state 글이 소유하는 범위",
    owns: [
      "현재 input과 이전 hidden에서 다음 hidden을 만드는 recurrent transition",
      "고정 크기 hidden state의 lossy compression 경계",
      "공유 cell의 time unrolling과 causal·bidirectional 배포 경계",
    ],
    reuses: [
      { label: "Affine layer와 tanh", href: "/ai/neural-network" },
      { label: "BPTT와 truncation", href: "/ai/bptt" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Elman network의 주장은 원 논문의 작은 synthetic task·network·training 범위로 제한한다." },
      { kind: "standard", rule: "Hidden state를 lossless storage나 임의 길이 기억 보장으로 표현하지 않는다." },
    ],
  },
  "rnn-language-model": {
    title: "RNN language model 글이 소유하는 범위",
    owns: [
      "Input과 target을 한 칸 이동한 token-pair objective",
      "Hidden state를 vocabulary logit으로 투영하는 output head",
      "Recurrent state에서 vocabulary logits·probability를 만드는 경로",
      "동일 tokenizer·corpus·mask 안의 NLL·perplexity 해석",
    ],
    reuses: [
      { label: "RNN hidden state", href: "/ai/rnn" },
      { label: "Cross-entropy와 NLL", href: "/ai/cross-entropy" },
      { label: "Teacher forcing·exposure bias", href: "/ai/supervised-fine-tuning#teacher-forcing" },
    ],
    evidence: [
      { kind: "primary-source", rule: "RNN-LM 결과는 논문의 corpus·vocabulary·architecture·training recipe에 귀속한다." },
      { kind: "standard", rule: "Perplexity는 corpus·tokenizer·mask·log convention이 같은 evaluation contract 안에서만 비교한다." },
    ],
  },
  "bptt": {
    title: "BPTT 글이 소유하는 범위",
    owns: [
      "Finite time graph의 reverse-mode와 공유 weight contribution 합산",
      "Recurrent Jacobian product의 vanishing·exploding 경계",
      "Gradient clipping과 truncated BPTT의 서로 다른 제어 범위",
    ],
    reuses: [
      { label: "Time unrolling", href: "/ai/rnn#architecture" },
      { label: "Chain rule", href: "/ai/math-functions-derivatives-gradients#chain-rule" },
      { label: "Jacobian", href: "/ai/math-gradients-jacobians#jacobian" },
      { label: "LSTM direct retention", href: "/ai/lstm#cell-state" },
    ],
    evidence: [
      { kind: "primary-source", rule: "BPTT·gradient 분석·truncation claim은 각 논문의 differentiability·task·trajectory 조건으로 제한한다." },
      { kind: "standard", rule: "Forward state horizon, derivative graph horizon, empirical memory를 같은 숫자로 합치지 않는다." },
    ],
  },
  "lstm": {
    title: "LSTM cell 글이 소유하는 범위",
    owns: [
      "Cell state와 hidden state의 두 recurrent path",
      "Forget·input·output gate의 channel별 보존·기록·공개 역할",
      "Forget-gate product로 읽는 direct retention contribution",
    ],
    reuses: [
      { label: "RNN transition과 lossy state", href: "/ai/rnn" },
      { label: "BPTT Jacobian product", href: "/ai/bptt" },
      { label: "GRU single-state update", href: "/ai/gru" },
    ],
    evidence: [
      { kind: "primary-source", rule: "원형 LSTM·forget gate·architecture ablation의 서로 다른 논문 범위를 구분한다." },
      { kind: "standard", rule: "Direct cell contribution과 전체 derivative, inference memory와 training horizon을 구분한다." },
    ],
  },
  "gru": {
    title: "GRU state update 글이 소유하는 범위",
    owns: [
      "Reset gate가 candidate용 history를 거르는 위치",
      "Candidate 생성과 update gate의 기존 state·candidate interpolation",
      "LSTM·GRU를 parameter·state·kernel·quality budget에서 비교하는 경계",
    ],
    reuses: [
      { label: "RNN recurrent transition", href: "/ai/rnn" },
      { label: "LSTM dual-state gate", href: "/ai/lstm" },
    ],
    evidence: [
      { kind: "primary-source", rule: "GRU와 architecture 비교 claim은 각 논문의 task·configuration·optimizer 범위로 제한한다." },
      { kind: "project-measurement", rule: "같은 input/output·parameter 또는 FLOP·hardware budget에서 latency·state memory·quality를 함께 측정한다." },
    ],
  },
  "deep-learning-overview": {
    title: "Representation learning·depth 글이 소유하는 범위",
    owns: [
      "원시 input과 중간 representation의 구분",
      "Data·target·loss가 representation을 편향시키는 경계",
      "중간 계산 재사용으로 읽는 depth efficiency와 optimization 비보장",
    ],
    reuses: [
      { label: "지도학습 한 step", href: "/ai/supervised-learning-loop" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
      { label: "Backpropagation", href: "/ai/backprop-optimization" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Representation·depth claim은 2015 review와 Telgarsky의 명시된 함수족·근사 조건으로 제한한다." },
      { kind: "standard", rule: "표현 가능성·optimization·generalization을 서로 다른 주장으로 기록한다." },
    ],
  },
  "supervised-learning-loop": {
    title: "Input·target에서 training step까지 글이 소유하는 범위",
    owns: [
      "Input feature·target example contract와 tensor batch axis",
      "Parameterized model·forward·loss·backward·optimizer update 순서",
      "Training과 parameter-fixed inference의 state 경계",
    ],
    reuses: [
      { label: "Loss·backpropagation", href: "/ai/backprop-optimization" },
      { label: "Optimizer update", href: "/ai/optimizers" },
      { label: "Train·validation·test", href: "/ai/train-validation-test" },
    ],
    evidence: [
      { kind: "primary-source", rule: "지도학습 notation과 autodiff 책임은 교과서·survey 범위에 귀속한다." },
      { kind: "standard", rule: "Batch axis·model parameter·hyperparameter·runtime state를 분리한다." },
    ],
  },
  "train-validation-test": {
    title: "Train·validation·test 역할 글이 소유하는 범위",
    owns: [
      "Parameter 학습·candidate 선택·final assessment의 세 data 역할",
      "Validation selection feedback과 반복 tuning 기록",
      "Test 재사용 contamination과 independent final evidence 경계",
    ],
    reuses: [
      { label: "지도학습 한 step", href: "/ai/supervised-learning-loop" },
      { label: "Cross-validation protocol", href: "/ai/cross-validation" },
      { label: "Regularization 비교", href: "/ai/regularization-practice" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Assessment·selection·CV estimand claim은 ESL과 분석 논문의 sampling·model 조건에 귀속한다." },
      { kind: "standard", rule: "Test 결과를 본 뒤 생긴 변경은 adaptation으로 기록하고 새 untouched holdout 없이는 final claim을 하지 않는다." },
    ],
  },
  "math-functions-composition": {
    title: "함수 input·output과 composition 글이 소유하는 범위",
    owns: [
      "Deterministic function의 input→output mapping과 many-to-one 경계",
      "Domain·codomain·range와 tensor dtype·axis·shape compatibility",
      "Function composition의 실행 순서·중간값·order counterexample",
    ],
    reuses: [
      { label: "Scalar와 vector shape", href: "/ai/math-vectors-inner-products" },
      { label: "Derivative와 chain rule", href: "/ai/math-functions-derivatives-gradients" },
      { label: "Gradient와 Jacobian", href: "/ai/math-gradients-jacobians" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Function composition·domain claim은 공개 교재의 선언과 example 범위에 귀속한다." },
      { kind: "standard", rule: "순수 function 표기와 random·stateful program의 숨은 input state를 구분한다." },
    ],
  },
  "math-functions-derivatives-gradients": {
    title: "Derivative·local linearity·chain rule 글이 소유하는 범위",
    owns: [
      "Difference quotient의 빼기·나눗셈과 limit이 만드는 local rate",
      "Derivative 단위와 local linear approximation의 finite-step error",
      "연속 local rate를 곱하는 chain rule과 branch contribution 합산",
      "표준 derivative·convex subgradient·autodiff convention 경계",
    ],
    reuses: [
      { label: "함수와 composition", href: "/ai/math-functions-composition" },
      { label: "Gradient와 Jacobian", href: "/ai/math-gradients-jacobians" },
      { label: "Activation의 실제 local slope", href: "/ai/activation-functions" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Derivative·chain-rule 설명은 MIT calculus의 differentiability 조건과 공개 problem 범위에 귀속한다." },
      { kind: "standard", rule: "Local approximation을 큰 finite step의 exact equality나 optimizer convergence 보장으로 확대하지 않는다." },
    ],
  },
  "math-gradients-jacobians": {
    title: "Partial derivative·gradient·Jacobian 글이 소유하는 범위",
    owns: [
      "Coordinate 하나를 고정해 재는 partial derivative와 전체 differentiability 경계",
      "Gradient·directional derivative·Euclidean steepest local direction",
      "Output-by-input Jacobian shape와 Jacobian-vector product",
      "Gradient·JVP·VJP의 input/output 방향 차이",
    ],
    reuses: [
      { label: "Vector·dot product·norm", href: "/ai/math-vectors-inner-products" },
      { label: "Derivative와 local linearity", href: "/ai/math-functions-derivatives-gradients" },
      { label: "Reverse-mode VJP", href: "/ai/reverse-mode-autodiff" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Gradient·directional derivative claim은 multivariable calculus의 coordinate·norm·differentiability 조건에 귀속한다." },
      { kind: "standard", rule: "Jacobian row·column convention과 JVP·VJP 곱 방향을 formula shape와 함께 기록한다." },
    ],
  },
  "math-optimization-objectives": {
    title: "Optimization objective·feasible set·minimizer 글이 소유하는 범위",
    owns: [
      "Decision variable과 scalar objective의 선택·평가 경계",
      "Hard constraint와 모든 constraint를 만족하는 feasible set",
      "Argmin 위치·minimum value·constrained minimizer의 구분",
    ],
    reuses: [
      { label: "Function input·output", href: "/ai/math-functions-composition" },
      { label: "Convexity·smoothness", href: "/ai/math-optimization-convexity" },
      { label: "Gradient descent 반복", href: "/ai/math-gradient-descent-convergence" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Problem formulation·optimality claim은 Boyd 교재의 declared domain·constraint 조건에 귀속한다." },
      { kind: "standard", rule: "Proxy objective를 실제 task 가치와 동일시하지 않고 feasible·infeasible 선택을 먼저 분리한다." },
    ],
  },
  "math-optimization-convexity": {
    title: "Convexity·smoothness·curvature range 글이 소유하는 범위",
    owns: [
      "Chord inequality로 정의하는 convex function",
      "L-smooth gradient 변화 상한과 descent lemma의 curvature allowance",
      "Strong convexity·condition number의 lower/upper curvature 경계",
    ],
    reuses: [
      { label: "Objective와 feasible set", href: "/ai/math-optimization-objectives" },
      { label: "Gradient·directional derivative", href: "/ai/math-gradients-jacobians" },
      { label: "Gradient descent convergence", href: "/ai/math-gradient-descent-convergence" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Convexity·smoothness·strong-convexity claim은 Boyd 교재의 theorem 전제에 귀속한다." },
      { kind: "standard", rule: "그릇 모양 그림이나 finite sample만으로 전역 convexity를 주장하지 않는다." },
    ],
  },
  "math-gradient-descent-convergence": {
    title: "Gradient descent·convergence·stopping 글이 소유하는 범위",
    owns: [
      "Negative gradient와 learning rate를 결합한 next-iterate rule",
      "Quadratic의 수축·진동·발산과 smooth strongly-convex convergence bound",
      "Stationary point·stopping signal·release evidence의 분리",
    ],
    reuses: [
      { label: "Gradient와 local linearity", href: "/ai/math-gradients-jacobians" },
      { label: "Convexity·curvature 전제", href: "/ai/math-optimization-convexity" },
      { label: "SGD·Momentum·AdamW", href: "/ai/optimizers" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Quadratic path·first-order bound는 MIT 강의와 Boyd 교재의 stated 조건에 귀속한다." },
      { kind: "standard", rule: "Small gradient·small update·budget stop을 global optimality나 deployment release와 동일시하지 않는다." },
    ],
  },
  "math-probability-expectation-variance": {
    title: "Probability experiment·event·conditioning 글이 소유하는 범위",
    owns: [
      "Experiment·sample space·outcome·probability distribution의 서로 다른 역할",
      "Event를 outcome 부분집합으로 만들고 mass를 합산하는 계산",
      "Conditional probability의 재정규화와 probability chain rule",
      "Independence와 mutually exclusive의 구분 및 zero-mass condition 경계",
    ],
    reuses: [
      { label: "Random variable·expectation", href: "/ai/math-random-variables-expectation" },
      { label: "Variance·sampling", href: "/ai/math-variance-sampling" },
      { label: "Logarithm과 likelihood", href: "/ai/math-exponents-logarithms" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Probability model·conditioning·independence claim은 MIT 6.041SC의 stated sample space와 positive conditioning-mass 조건에 귀속한다." },
      { kind: "standard", rule: "Equally likely·independent·causal 관계를 관측이나 문제 선언 없이 자동 가정하지 않는다." },
    ],
  },
  "math-random-variables-expectation": {
    title: "Random variable·expectation 글이 소유하는 범위",
    owns: [
      "Outcome을 scalar value로 보내는 deterministic random-variable mapping",
      "같은 value로 간 outcome mass를 합치는 induced distribution",
      "Expectation의 probability-weighted center와 unit",
      "Expectation linearity와 nonlinear transform 교환 실패 경계",
    ],
    reuses: [
      { label: "Sample space·probability event", href: "/ai/math-probability-expectation-variance" },
      { label: "Variance·sample estimator", href: "/ai/math-variance-sampling" },
      { label: "Function mapping", href: "/ai/math-functions-composition" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Random-variable mapping·PMF·expectation claim은 MIT 6.041SC의 discrete model과 integrability 범위에 귀속한다." },
      { kind: "standard", rule: "Expectation을 next observation·mode·반드시 가능한 outcome value와 동일시하지 않는다." },
    ],
  },
  "math-variance-sampling": {
    title: "Variance·sample estimator·mini-batch 글이 소유하는 범위",
    owns: [
      "Variance와 standard deviation의 square-unit·original-unit 구분",
      "Sample mean과 n−1 sample-variance estimator의 서로 다른 target",
      "Large-number concentration과 independence·moment 조건",
      "Mini-batch stochastic-gradient estimator의 unbiasedness·variance·sampling boundary",
    ],
    reuses: [
      { label: "Random variable·expectation linearity", href: "/ai/math-random-variables-expectation" },
      { label: "Gradient vector", href: "/ai/math-gradients-jacobians" },
      { label: "Optimizer update", href: "/ai/optimizers" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Variance·LLN claim은 MIT 6.041SC의 independence·finite-moment 조건에, stochastic approximation claim은 Robbins–Monro 원문의 범위에 귀속한다." },
      { kind: "standard", rule: "Unbiasedness·variance 감소·finite-step descent·nonconvex global convergence를 서로 다른 보장으로 기록한다." },
    ],
  },
  optimizers: {
    title: "SGD와 effective-batch 글이 소유하는 범위",
    owns: ["Gradient 계산과 optimizer displacement의 책임 경계", "Mini-batch SGD와 accumulation update clock"],
    reuses: [{ label: "Gradient·backpropagation", href: "/ai/backprop-optimization" }, { label: "Stochastic gradient estimator", href: "/ai/math-variance-sampling#mini-batch" }],
    evidence: [{ kind: "primary-source", rule: "Stochastic approximation claim은 Robbins–Monro의 noise·step 조건 범위로 제한한다." }, { kind: "standard", rule: "Loss reduction·micro-batch·accumulation·world size·LR·update index를 함께 기록한다." }],
  },
  "momentum-optimizer": {
    title: "Momentum optimizer 글이 소유하는 범위",
    owns: ["Exponential moving average의 시간 감쇠", "Momentum velocity의 방향 강화·상쇄와 overshoot 경계"],
    reuses: [{ label: "SGD update", href: "/ai/optimizers#sgd-update" }],
    evidence: [{ kind: "primary-source", rule: "Momentum acceleration claim은 Polyak 원문의 objective·iteration 조건으로 제한한다." }, { kind: "standard", rule: "Momentum convention·β·LR·trajectory·update norm을 함께 기록한다." }],
  },
  "adam-optimizer": {
    title: "Adam optimizer 글이 소유하는 범위",
    owns: ["Gradient first·second raw-moment state", "EMA initialization bias correction과 diagonal preconditioning"],
    reuses: [{ label: "EMA와 momentum", href: "/ai/momentum-optimizer" }, { label: "Decoupled weight decay", href: "/ai/weight-decay#adamw" }],
    evidence: [{ kind: "primary-source", rule: "Adam update·convergence claim은 원 논문과 후속 counterexample의 stated objective·online setting 범위로 제한한다." }, { kind: "standard", rule: "m·v·step·β·ε·dtype·skip order와 parameter identity를 checkpoint에 기록한다." }],
  },
  "image-video-lora-architecture": {
    title: "Image·Video LoRA architecture 정본이 소유하는 범위",
    owns: [
      "Diffusion pipeline의 실제 named module을 host 역할과 LoRA target으로 매핑하는 방법",
      "Image denoiser·선택적 text encoder의 adapter 범위와 frozen component 경계",
      "Video의 spatial·temporal·cross-modal target 범위와 appearance-motion coupling",
      "Clip FPS·frame·resolution·condition metadata와 frame·temporal·motion 분리 평가",
    ],
    reuses: [
      { label: "LoRA low-rank update와 rank 계산", href: "/ai/lora-finetuning#lora" },
      { label: "Modern image generation component stack", href: "/ai/modern-image-model-stack#system-map" },
      { label: "DiT block과 multimodal stream", href: "/ai/diffusion-transformer-architecture" },
      { label: "Video tubelet과 space-time attention", href: "/ai/video-transformers" },
    ],
    evidence: [
      {
        kind: "primary-source",
        rule: "Target module 예시는 Diffusers와 LTX-2의 현재 공식 config 범위로 제한하며 보편 target 목록으로 일반화하지 않는다.",
      },
      {
        kind: "primary-source",
        rule: "Appearance·motion 분리 주장은 MotionDirector의 backbone·dataset·benchmark와 저자 자기보고 범위로 제한한다.",
      },
      {
        kind: "standard",
        rule: "Base revision·full target paths·trainable count·clip preprocessing·held-out frame/temporal/motion metric을 같은 run artifact에 기록한다.",
      },
    ],
  },
  "in-context-lora": {
    title: "In-Context LoRA 정본이 소유하는 범위",
    owns: [
      "Reference·target을 하나의 context로 이어붙이는 IC-LoRA의 정의와 self-attention 재사용 원리",
      "Reference를 clean 상태로 유지하며 target만 노이즈 처리하는 flow-matching 조건화 학습 절차",
      "RoPE 상에서 reference block에 negative temporal position을 부여하는 방법과 그 이유",
      "Identity guidance(reference 유무 비교 delta)와 two-stage(full-guidance→distilled refine) serving 설계",
    ],
    reuses: [
      { label: "LoRA low-rank update", href: "/ai/lora-finetuning#overview" },
      { label: "Flow-matching objective", href: "/ai/diffusion-continuous-time#flow-matching" },
      { label: "Classifier-free guidance", href: "/ai/latent-diffusion-guidance#guidance" },
      { label: "Self-attention", href: "/ai/attention-theory#self-attention" },
      { label: "RoPE relative rotation", href: "/ai/yarn-rope-extension#rope-foundation" },
    ],
    evidence: [
      { kind: "primary-source", rule: "IC-LoRA 원 논문(Huang et al. 2024)의 claim은 그 논문의 DiT·데이터셋·task 범위로 제한한다." },
      { kind: "project-measurement", rule: "ID-LoRA(2026)의 성능·설계 설명은 해당 공개 repo와 논문의 실험 조건(LTX-2/2.3, CelebV-HQ·TalkVid)으로 제한하며, 모든 in-context LoRA 응용이 같은 결과를 낸다고 일반화하지 않는다." },
    ],
  },
  "mpc": {
    title: "MPC real/ideal·DKG release 글이 소유하는 범위",
    owns: ["Real/ideal view와 adversary·network·abort/fairness claim", "Session-bound DKG transcript와 active-failure release gate"],
    reuses: [{ label: "Shamir threshold sharing", href: "/crypto/shamir-secret-sharing" }, { label: "Paillier additive homomorphism", href: "/crypto/paillier-cryptosystem" }],
    evidence: [{ kind: "primary-source", rule: "Concrete DKG behavior는 pinned tss-lib source와 selected protocol profile에만 귀속한다." }, { kind: "project-measurement", rule: "Bad share·cross-session round·complaint·dropout·restart를 replay하고 messages·bytes·latency를 분리한다." }, { kind: "project-claim", rule: "한 primitive의 security를 전체 MPC의 malicious security·fairness로 확대하지 않는다." }],
  },
  "shamir-secret-sharing": {
    title: "Shamir Secret Sharing 글이 소유하는 범위",
    owns: ["Random polynomial share generation과 x=0 Lagrange reconstruction", "t-share perfect privacy와 plain sharing의 active-security/VSS 경계"],
    reuses: [{ label: "Prime-field arithmetic", href: "/crypto/field-arithmetic" }, { label: "MPC composition", href: "/crypto/mpc" }],
    evidence: [{ kind: "primary-source", rule: "Correctness·privacy는 Shamir 1979의 finite-field·distinct-point·uniform-coefficient 조건에 한정한다." }, { kind: "project-measurement", rule: "Zero/duplicate index·insufficient/bad share·RNG replay를 negative fixtures로 둔다." }, { kind: "project-claim", rule: "Plain sharing이 VSS·dealer honesty·malicious DKG를 제공한다고 주장하지 않는다." }],
  },
  "paillier-cryptosystem": {
    title: "Paillier cryptosystem 글이 소유하는 범위",
    owns: ["Valid n·g·lambda·mu key profile과 randomized encryption/L-function decryption", "Additive homomorphism과 ciphertext malleability·integrity 경계"],
    reuses: [{ label: "Prime-field arithmetic", href: "/crypto/finite-field-theory#prime-field" }, { label: "MPC composition", href: "/crypto/mpc" }],
    evidence: [{ kind: "primary-source", rule: "Construction과 security claim은 Paillier 1999의 composite-residuosity·key/randomizer 조건에 한정한다." }, { kind: "project-measurement", rule: "Invalid r/c/key·reuse·wraparound·altered aggregate를 release 전에 재생한다." }, { kind: "project-claim", rule: "Homomorphism을 ciphertext integrity·range proof·malicious MPC 보장으로 확대하지 않는다." }],
  },
  "cuda-graph-capture": {
    title: "CUDA Graphs 정본이 소유하는 범위",
    owns: [
      "Kernel launch overhead가 exec 시간을 압도하는 조건과 capture/replay의 latency 모델",
      "torch.cuda.graph capture/replay의 static input·output 주소 계약",
      "vLLM CUDAGraphWrapper의 batch shape별 capture·dispatch·replay 실제 구현",
      "Dynamic shape 패딩, full·piecewise capture 범위, graph pool 공유의 trade-off",
    ],
    reuses: [
      { label: "CUDA stream ordering", href: "/gpu/cuda-sync-streams#streams" },
      { label: "Model VRAM known floor", href: "/ai/model-vram-budgeting#known-floor" },
    ],
    evidence: [
      { kind: "primary-source", rule: "Capture/replay 실행 계약은 PyTorch torch.cuda.graph의 문서화된 static-address 의미론으로 제한한다." },
      { kind: "project-measurement", rule: "실제 구현 설명은 vllm-project/vllm의 vllm/compilation/cuda_graph.py 코드 범위로 제한하며, latency 배율 예시는 개념 설명용 수치일 뿐 실측값이 아니다." },
    ],
  },
} as const satisfies Record<string, EditorialBoundary>;

export type EditorialBoundaryKey = keyof typeof EDITORIAL_BOUNDARIES;

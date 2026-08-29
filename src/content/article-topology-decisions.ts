export type ArticleTopologyAction = "keep" | "split" | "merge" | "rename" | "delete";
export type ArticleTopologyDecisionStatus = "reviewed" | "planned" | "implemented";

export interface ArticleTopologyDecision {
  action: ArticleTopologyAction;
  status: ArticleTopologyDecisionStatus;
  reviewedAt: string;
  rationale: string;
  sharedGate?: string;
  targetRoutes?: readonly string[];
}

const KEEP = (rationale: string): ArticleTopologyDecision => ({
  action: "keep",
  status: "reviewed",
  reviewedAt: "2026-08-27",
  rationale,
  sharedGate:
    "같은 fixture와 artifact identity에서 stage별 correctness·failure·cost를 비교하고 마지막 acceptance·rollback을 하나의 release/evaluation gate로 판정합니다.",
});

export const ARTICLE_TOPOLOGY_DECISIONS: Readonly<Record<string, ArticleTopologyDecision>> = {
  "ai/claw-bash": KEEP("Parse→classify→authorize→execute→release가 한 Bash effect의 단일 실행 계약을 이룹니다."),
  "ai/claw-cli": KEEP("입력 dispatch→slash parse→stream reducer→초기화가 하나의 CLI control-plane 경로입니다."),
  "ai/claw-compaction": KEEP("Trigger→projection→budget→state 보존→fidelity 검증이 하나의 compaction 수명주기입니다."),
  "ai/claw-overview": KEEP("독립 구현 snapshot을 crate map에서 parity fixture까지 추적하는 의도적인 overview arc입니다."),
  "ai/claw-permissions": KEEP("권한 상한→분류→결정→승인→강제→검증이 하나의 authorization pipeline입니다."),
  "ai/claw-session": KEEP("식별→turn 실행→commit→recovery/fork→control이 같은 session state의 수명주기입니다."),
  "ai/claw-worker-boot": KEEP("Readiness gate→terminal observation→prompt delivery가 한 worker startup trust 판정입니다."),
  "ai/llm-serving-ops": KEEP("Gateway routing·GPU capacity·deployment·SLO control이 한 online serving contract의 연속 단계입니다."),
  "ai/multiview-fusion": KEEP("Episode contract에서 representation fusion과 missing-view intervention까지 하나의 fusion 선택 질문입니다."),
  "ai/open-r1": KEEP("Reasoning data cold start→SFT→online GRPO→evaluation이 하나의 recipe reproduction arc입니다."),
  "ai/openclaw-assistant": KEEP("Inbound event가 route·session·runtime·resource·sandbox를 거쳐 reply receipt가 되는 단일 trace입니다."),
  "ai/qwen-korean-consistency": {
    action: "split",
    status: "implemented",
    reviewedAt: "2026-08-27",
    rationale: "현상 진단·개입 선택과 post-hoc lm_head 편집, SFT/RL policy update는 parameter effect·전제·평가가 다른 독립 학습 단위입니다.",
    targetRoutes: ["ai/qwen-korean-consistency", "ai/smoothie-qwen-weight-editing", "ai/qwen-korean-reasoning-posttraining"],
  },
  "ai/rag-pipeline": {
    action: "split",
    status: "implemented",
    reviewedAt: "2026-08-27",
    rationale: "전체 ingestion→grounded answer lifecycle과 BM25→HNSW→RRF→cross-encoder candidate funnel은 서로 다른 선수 지식·수식·failure mode를 가집니다.",
    targetRoutes: ["ai/rag-pipeline", "ai/retrieval-ranking-funnel"],
  },
  "ai/sequence-modeling-tabular": KEEP("Cutoff-safe sample에서 flat baseline·attention·shuffle diagnostic까지 한 model-necessity 실험입니다."),
  "ai/sionic-eureka": KEEP("Corpus curation→label graph→distillation→slice evaluation이 한 retrieval embedding production pipeline입니다."),
  "ai/sionic-glm-b300": KEEP("Roofline bound에서 kernel·runtime·MTP를 거쳐 end-to-end receipt를 만드는 한 optimization case study입니다."),
  "ai/skills-anatomy": KEEP("Skill boundary→authoring→loading→invocation/evaluation이 하나의 skill 수명주기입니다."),
  "ai/time-features": KEEP("Lag·window·cyclic feature가 같은 forecast-origin contract와 rolling evaluation 아래 결합됩니다."),
  "ai/training-pipeline": KEEP("Dataset input에서 update·resume·metric provenance까지 하나의 reproducible training run입니다."),
  "ai/transfer-learning-practice": KEEP("Pretrained handoff에서 freeze scope·update scale·domain shift adaptation까지 하나의 선택 spectrum입니다."),
  "ai/transformer-architecture": KEEP("Token input→visibility→block→output policy→scaling이 Transformer의 단일 기준 구조를 형성합니다. 2026-08-29 보강으로 concept가 14개로 늘었지만 decoder-only 정의·width/depth·attention logit/matrix·head dim·FFN·residual stream·RMSNorm이 모두 같은 block 구조의 facet이며, causal mask는 attention-visibility, sequence mixer 대안은 linear-attention-and-state-space-models로 이미 분리돼 있습니다."),
  "ai/tokenizer": KEEP("BPE→Unigram→byte-level tokenization에서 token id·embedding matrix lookup까지 텍스트를 모델 입력으로 바꾸는 하나의 전처리 arc입니다."),
  "ai/vae": KEEP("Latent model→pathwise gradient→ELBO→collapse diagnosis→variant 경계가 하나의 VAE 학습 arc입니다."),
  "ai/vllm-paged-attention": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "Variable KV state의 addressing·ownership·allocation·fragmentation·prefix sharing·fork/copy-on-write를 한 block manager mechanism으로 추적합니다. 2026-08-29 coverage 보강으로 concept가 17개로 늘었지만 모두 같은 allocator·block table 위의 facet이며 admission·preemption은 serving-memory-admission-and-preemption, radix prefix caching은 prefix-caching-radix-attention으로 분리했습니다.",
    sharedGate:
      "같은 block size·pool 크기·요청 길이 fixture에서 allocation·fragmentation·sharing·CoW의 block 수와 hit rate를 한 receipt로 비교합니다.",
  },
  "ai/vllm-spec-decode": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "Serial baseline→draft/verify→distribution invariance→acceptance rate·speculation length·rejection point→speedup model→break-even이 하나의 speculative execution contract입니다. 2026-08-29 보강으로 cost model 절이 추가됐지만 변형(self-speculative·MTP·tree·suffix)은 speculative-decoding-variants로 분리합니다.",
    sharedGate:
      "같은 draft/target·α·K·batch fixture에서 accepted length·forward 수·wall-clock을 함께 재어 break-even을 판정합니다.",
  },
  "ai/retrieval-ranking-funnel": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "BM25→HNSW→RRF→cross-encoder의 candidate 생성·병합·재순위 funnel이 하나의 학습 단위입니다. 2026-08-29 보강으로 concept가 9개로 늘었지만 hybrid depth budget·ColBERT late interaction·precision/MRR 평가가 모두 같은 funnel의 각 단계이며, RAG 전체 lifecycle은 rag-pipeline, ingestion/chunking은 rag-ingestion-and-chunking으로 이미 분리돼 있습니다.",
    sharedGate:
      "같은 query·corpus fixture에서 candidate depth·재순위 방식별 recall@k·precision@k·MRR과 latency를 한 receipt로 비교합니다.",
  },
  "ai/vllm-scheduler": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "Static·dynamic·iteration-level batching 세대→request queue 정책·fairness·HOL blocking→scheduler overhead가 하나의 큐 정책 학습 단위입니다. 2026-08-29 보강으로 concept가 14개로 늘었지만 step 내부 token budget 배분은 continuous-batching-step-anatomy, admission·preemption은 serving-memory-admission-and-preemption으로 이미 분리돼 있어 이 글은 queue 자체의 정책·세대·비용만 소유합니다.",
    sharedGate:
      "같은 request-rate·길이 분포 fixture에서 batching 세대별 idle율·HOL 지연·scheduler overhead를 한 receipt로 비교합니다.",
  },
  "ai/xml-prompting": KEEP("Role framing→serialization→parser/schema/security validation→format evaluation이 한 XML prompt contract입니다."),
  "blockchain/cometbft-abci": KEEP("PrepareProposal→ProcessProposal→FinalizeBlock→Commit이 ABCI state transition 순서와 일치합니다."),
  "blockchain/cometbft-consensus": KEEP("Height/round/step 입력에서 safety·liveness·accountability까지 한 consensus state machine입니다."),
  "blockchain/da-theory": KEEP("Availability 분리→erasure encoding→blob transport→sampling 비교가 하나의 DA 질문을 단계적으로 답합니다."),
  "blockchain/helios-bootstrap": KEEP("Checkpoint source→proof 검증→store init→first update→recovery가 한 bootstrap lifecycle입니다."),
  "blockchain/kohaku-provider": KEEP("Provider capability→method provenance→signer authority→release가 한 API trust boundary입니다."),
  "blockchain/prysm-attestation": KEEP("Observe→sign→subnet route→aggregate→pool inclusion이 attestation의 실제 수명주기입니다."),
  "blockchain/prysm-beacon-db": KEEP("Root identity→schema→atomic read/write→pruning→retention이 한 BeaconDB lifecycle입니다."),
  "blockchain/prysm-epoch-processing": KEEP("Finality·reward/penalty·registry update가 protocol-defined epoch transition의 순차 sub-step입니다."),
  "blockchain/reth-alloy-primitives": KEEP("Semantic type→canonical encode/decode→hash/address derivation이 한 Alloy codec 경계입니다."),
  "blockchain/reth-net": KEEP("Discovery→RLPx negotiation→eth activation→exchange→reputation이 한 peer session lifecycle입니다."),
  "blockchain/reth-precompiles": KEEP("Fork registry→gas gate→ABI execution→backend parity가 한 precompile dispatch contract입니다."),
  "blockchain/reth-rpc": KEEP("Transport route→pinned view→answer/error→cost/auth protection이 한 RPC request lifecycle입니다."),
  "blockchain/reth-sync": KEEP("Anchor→pipeline execution/unwind→backfill/live handoff→notification이 한 sync state transition입니다."),
  "blockchain/reth-txpool": KEEP("Admission→nonce chain→subpool→consumption→reorg/eviction이 한 transaction lifecycle입니다."),
  "crypto/mpc": {
    action: "split",
    status: "implemented",
    reviewedAt: "2026-08-27",
    rationale: "Shamir와 Paillier는 DKG의 보편적 순차 단계가 아니며 각각 독립 유도·security assumption·응용 경계를 가진 canonical method입니다.",
    targetRoutes: ["crypto/mpc", "crypto/shamir-secret-sharing", "crypto/paillier-cryptosystem"],
  },
  "gpu/cuda-basics": {
    action: "rename",
    status: "implemented",
    reviewedAt: "2026-08-27",
    rationale: "본문은 generic CUDA lifecycle과 workload-fit을 소유하며 기존 제목의 블록체인 괄호는 실제 소유 범위를 과장합니다.",
    targetRoutes: ["gpu/cuda-basics"],
  },
  "gpu/gpu-arch-hopper": KEEP("TMA·cluster·precision feature를 같은 Hopper compatibility gate 아래 비교하는 generation overview입니다."),
  "gpu/cuda-persistent-kernels": KEEP("Persistent thread 정의→work queue 계약→static/dynamic 배분→release gate가 하나의 device-side scheduling 학습 단위입니다. CUTLASS tile scheduler는 이 정의의 구체 사례로만 링크하며 별도 prerequisite로 만들지 않아 순환을 피합니다."),
  "gpu/cuda-register-pressure": KEEP("Register file 예산→allocation granularity→spill/rematerialization→theoretical/achieved occupancy가 하나의 register 자원 판정 arc입니다."),
  "isms-aml/isms-security-infra": {
    action: "rename",
    status: "implemented",
    reviewedAt: "2026-08-27",
    rationale: "UTM·firewall·IDS/IPS·SIEM 제품 나열보다 zone enforcement→detection/observation→correlation→release라는 실제 arc가 제목의 중심이어야 합니다.",
    targetRoutes: ["isms-aml/isms-security-infra"],
  },
};

/**
 * Review 당시 title·learning ownership·source closure의 digest입니다. 본문 구조나
 * 개념 소유권이 바뀌면 topology audit가 stale decision으로 되돌립니다.
 */
export const ARTICLE_TOPOLOGY_FINGERPRINTS: Readonly<Record<string, string>> = {
  "ai/claw-bash": "d3ec03f41aa635ae",
  "ai/claw-cli": "085e65b3b3de27cd",
  "ai/claw-compaction": "8286beaab27c0693",
  "ai/claw-overview": "a0202ce5f0ae304a",
  "ai/claw-permissions": "adf7d2e7a5764dc5",
  "ai/claw-session": "61962e903430a194",
  "ai/claw-worker-boot": "2703d3fe2f6295b1",
  "ai/llm-serving-ops": "3e6961f275cf01c6",
  "ai/multiview-fusion": "b8830c270f51c8bc",
  "ai/open-r1": "e635761fc3c1d371",
  "ai/openclaw-assistant": "2ac6c31bce49af09",
  "ai/qwen-korean-consistency": "28703cf32620721b",
  "ai/rag-pipeline": "ea1e5a0cf9b8d13d",
  "ai/sequence-modeling-tabular": "c3bd6f97f16088ca",
  "ai/sionic-eureka": "5c06113df7dc929f",
  "ai/sionic-glm-b300": "23e6852b1b80cce5",
  "ai/skills-anatomy": "a26e912d9a77607b",
  "ai/time-features": "360919174b2e40e3",
  "ai/training-pipeline": "e1330211215a8e78",
  "ai/transfer-learning-practice": "2cbdcdc7079650ed",
  "ai/transformer-architecture": "9d722355ad76f6f3",
  "ai/tokenizer": "4a7970fdaa62df4f",
  "ai/vae": "41e2e0c24bd2879f",
  "ai/vllm-paged-attention": "d9f43052865ba377",
  "ai/vllm-spec-decode": "033ea8067d38760d",
  "ai/vllm-scheduler": "3388fbba0894a8a1",
  "ai/retrieval-ranking-funnel": "6f8840ae50720a9e",
  "ai/xml-prompting": "a8fe599b80c579e6",
  "blockchain/cometbft-abci": "95ca71232816d16a",
  "blockchain/cometbft-consensus": "9bb6fd231f8bb08f",
  "blockchain/da-theory": "0a8168b6d8d160d3",
  "blockchain/helios-bootstrap": "92af6e5e3bea5a7f",
  "blockchain/kohaku-provider": "ef6e31b888752748",
  "blockchain/prysm-attestation": "bdc3fd2e2fad83a8",
  "blockchain/prysm-beacon-db": "5abb71625921073e",
  "blockchain/prysm-epoch-processing": "e4da38fe206d7c44",
  "blockchain/reth-alloy-primitives": "71ba31b74fde219a",
  "blockchain/reth-net": "5dc76702eb0ccad7",
  "blockchain/reth-precompiles": "5424819e052e63da",
  "blockchain/reth-rpc": "0e46c594594e9bcf",
  "blockchain/reth-sync": "3b99943278e15465",
  "blockchain/reth-txpool": "5c2695ce63705301",
  "crypto/mpc": "487961f55cafda95",
  "gpu/cuda-basics": "1cb2c76d985028b5",
  "gpu/gpu-arch-hopper": "2e359a85e0b08225",
  "gpu/cuda-persistent-kernels": "0993e126d9521089",
  "gpu/cuda-register-pressure": "bb8de1b5a0f91f2c",
  "isms-aml/isms-security-infra": "3c313e4c01bcc569",
};

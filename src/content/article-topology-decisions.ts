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
  "circuits/lumped-circuit-and-conservation": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-10-03",
    rationale: "전압·전류의 뜻에서 갈림길·고리·풀이·전력 검산·근사 경계까지 같은 12 V 저항망 하나를 따라가므로 독립 글로 자르면 예제의 연결이 끊깁니다.",
    sharedGate: "12 V·1 kΩ·2 kΩ·2 kΩ 예제와 한 갈래를 1 kΩ으로 바꾼 예제에서 KCL·KVL·전력 합이 모두 일치해야 합니다.",
  },
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
  "ai/smoothie-qwen-weight-editing": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-09-12",
    rationale:
      "260줄·concept 2개로 merge 임계선에 걸리지만, ai/qwen-korean-consistency에서 이미 implemented 상태로 갈라 낸 분할의 산출물입니다. post-hoc lm_head weight 편집은 재학습 없이 checkpoint를 고치는 개입이라 전제(학습 종료)·비용·평가 방법이 SFT/RL 경로와 다르고, 되돌리면 그 분할 근거가 무효가 됩니다. 주제가 좁아 짧은 것이지 미완성이 아닙니다.",
    sharedGate:
      "tokenizer에서 고른 token 집합과 scaling 계수를 고정하고, 편집 전후 checkpoint를 같은 프롬프트 집합에 돌려 목표 문자 억제율과 일반 성능 회귀를 함께 판정합니다.",
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
  "ai/lora-finetuning": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "Frozen base→rank/alpha/target module 설계→data→adapter 배포까지 하나의 PEFT 학습·서빙 단위입니다. 2026-08-29 보강으로 concept가 12개로 늘었지만 full FT vs PEFT 대비, hyperparameter(alpha·scaling·dropout), multi-LoRA serving·adapter switching, 메모리·연산 예산이 모두 같은 adapter contract의 설계→배포 단계이며, fine-tuning의 목적별 데이터·forgetting·model merging은 fine-tuning-tradeoffs-forgetting-and-merging으로 이미 분리돼 있습니다.",
    sharedGate:
      "같은 base model·rank 설정에서 trainable parameter ratio·메모리 절감·adapter 서빙 처리량을 한 receipt로 비교합니다.",
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
  "ai/model-vram-budgeting": {
    action: "keep",
    status: "reviewed",
    reviewedAt: "2026-08-29",
    rationale:
      "Weight footprint에서 KV cache, runtime headroom을 거쳐 device sweet spot 판정까지가 하나의 VRAM 예산 계산 절차입니다. 2026-08-29 보강으로 owned concept가 9개, section이 10개로 늘었지만 quantization level tradeoff·2-way GPU 분배·dense vs MoE decode bandwidth는 모두 같은 예산 계산의 서로 다른 입력 축이며, tensor/pipeline parallel 세부 구현은 ai/tensor-and-pipeline-parallel-inference, MoE routing 세부는 ai/moe-routing-and-load-balancing으로 이미 분리돼 있습니다.",
    sharedGate:
      "같은 model config·hardware profile에서 quantization level·GPU 구성별 VRAM 소요와 device capacity 대비 여유를 한 receipt로 비교합니다.",
  },
  "ai/qwen38-flash-next-architecture": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-24",
    rationale:
      "closure 1,715줄 중 808줄이 6개 Viz이고 본문은 6 section·concept 7개로 keep 범위다. 선택·배선·조회·회계·요청 상태는 같은 공개 config 하나를 읽는 연속된 질문이라 나누면 각 글이 config 설명을 중복하게 된다. 2026-09-24 재검토에서 줄 수 변화는 JSX 단어 중간 줄바꿈 정리 1줄뿐임을 확인했다.",
    sharedGate:
      "Qwen3.8-Flash-Next 공개 config revision과 transformers qwen4_exp f62dc9bf2c90 스냅샷 하나만 근거로 삼는다. 서빙 런타임 구현과 실측이 필요한 주제는 이 글에 넣지 않고 별도 글로 분리한다.",
  },
  "gpu/modded-rtx4090-moe-serving": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "closure 4,727줄의 대부분이 6개 section에 딸린 Viz step 파일이고 본문은 concept 7개·section 6개로 keep 범위다. 개조·인터커넥트·MoE 통신·완화 기법은 '48GB 4090으로 MoE를 서빙한다면'이라는 질문 하나의 연속 단계라 나누면 각 글이 같은 전제를 다시 세워야 한다.",
    sharedGate:
      "카드 스펙과 링크 대역폭은 벤더 공식 스펙과 PCIe 규격 공식으로만 계산하고, 개조 카드의 안정성·수율·실측 처리량은 이 글에서 주장하지 않는다.",
  },
  "ai/dinov3-self-supervised-backbone": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-24",
    rationale:
      "closure 1,495줄 중 절반 이상이 6개 Viz이고 본문은 6 section·concept 7개로 keep 범위다. 두 학습 목표·붕괴·Gram anchoring은 '라벨 없이 학습할 때 무엇이 무너지는가'라는 한 질문의 연속 단계라 나누면 각 글이 손실 구성을 다시 세워야 한다. 2026-09-24 재검토에서 줄 수 변화는 JSX 단어 중간 줄바꿈 정리 2줄뿐임을 확인했다.",
    sharedGate:
      "DINOv3 기술 보고서와 facebookresearch/dinov3 커밋 11c58638 스냅샷만 근거로 삼는다. 다른 자기지도 방법과의 벤치마크 비교나 재현 실측은 이 글에 넣지 않는다.",
  },
  "ai/sam3-promptable-concept-segmentation": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위이며 closure 대부분이 6개 Viz다. 과제 정의·채점·구조·영상·데이터는 '개념 이름으로 분할한다'는 한 질문의 연속 단계라 나누면 각 글이 과제 정의를 다시 세워야 한다.",
    sharedGate:
      "SAM 3 논문과 facebookresearch/sam3 커밋 660a5e9e 스냅샷만 근거로 삼는다. 다른 분할 모델과의 벤치마크 비교나 자체 실측은 이 글에 넣지 않는다.",
  },
  "ai/image-embedding-pipeline": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위이며 closure 대부분이 6개 Viz다. 전처리·풀링·거리·계약·평가는 '사진이 벡터가 되는 구간'이라는 한 경로의 연속 단계라 나누면 각 글이 같은 파이프라인을 다시 세워야 한다.",
    sharedGate:
      "reference 구현 스냅샷과 공개 논문만 근거로 삼고, 특정 데이터셋의 검색 성능 실측은 이 글에서 주장하지 않는다.",
  },
  "ai/image-text-contrastive-pretraining": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 두 손실은 같은 유사도 행렬을 다르게 읽는 한 쌍이라 따로 떼면 비교 자체가 사라지고, 배치·zero-shot 절이 그 비교의 귀결을 담당한다.",
    sharedGate:
      "원 논문 두 편과 transformers 커밋 f62dc9bf2c90 구현만 근거로 삼고, 두 손실의 성능 우열을 자체 실측으로 주장하지 않는다.",
  },
  "ai/vision-backbone-selection": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 능력 프로필·과제 매핑·실측·비용·순서는 하나의 판단 절차를 이루는 단계라 나누면 각 글이 같은 전제를 다시 세워야 한다.",
    sharedGate:
      "계열 비교는 각 원 논문의 자기보고를 정성 요약한 범위로만 쓰고, 특정 모델 간 벤치마크 수치나 자체 실측을 이 글에서 주장하지 않는다.",
  },
  "ai/multi-component-finetuning-vram": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 상주 집합·원장·어댑터 한계·사전계산·판정은 하나의 예산 계산 절차를 이루는 단계라 나누면 각 글이 같은 네 갈래 구분을 다시 세워야 한다.",
    sharedGate:
      "diffusers 커밋 82f175e0 학습 예제와 명시한 예시 구성의 산술만 근거로 삼고, 특정 모델의 실측 VRAM 수치를 주장하지 않는다.",
  },
  "gpu/ai-accelerator-vendor-comparison": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 네 축은 앞이 뒤를 좁히는 종속 관계라 나누면 각 글이 같은 비교 틀을 다시 세워야 하고 종속이 사라진다.",
    sharedGate:
      "각 벤더의 공개 제품 문서와 명시한 가정의 산술만 근거로 삼고, 연산 성능 비교나 자체 실측 순위는 이 글에서 주장하지 않는다.",
  },
  "gpu/server-cpu-lineup-comparison": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 레인·채널·코어·계열은 하나의 구성 계산 절차를 이루는 단계라 나누면 각 글이 같은 역할 규정을 다시 세워야 한다.",
    sharedGate:
      "제조사 공개 사양과 명시한 가정의 산술만 근거로 삼고, 개별 제품의 성능 비교나 벤치마크는 이 글에서 주장하지 않는다.",
  },
  "gpu/datacenter-site-readiness": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 냉각·전력·하중·내진은 한 노드를 들이기 전 확인 절차의 네 항목이라 나누면 각 글이 같은 확인 틀을 다시 세워야 한다.",
    sharedGate:
      "공개 규격과 제조사 시험 사양, 명시한 예시 산술만 근거로 삼고 구체적 허용치와 규정 해석은 이 글에서 확정하지 않는다.",
  },
  "saas/edge-request-defense-pipeline": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 층별 비용 기울기가 글 전체의 단일 논지라 층을 나누면 각 글이 같은 비용 논증을 다시 세워야 한다.",
    sharedGate:
      "사업자 공개 문서와 프로토콜 규격에 적힌 범위만 근거로 삼고, 비공개 모델·신호와 제품별 설정값은 이 글에서 확정하지 않는다.",
  },
  "saas/anycast-delivery-continuity": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 경로·서버·판정·변경 네 층이 하나의 장애 시간 합을 나눠 갖는 구조라 나누면 각 글이 같은 시간 분해를 다시 세워야 한다.",
    sharedGate:
      "인용 논문의 측정 대상과 사업자 공개 문서의 범위를 벗어난 일반화를 하지 않고 검사 주기·단계 비율의 구체 값을 권고하지 않는다.",
  },
  "saas/private-access-inbound-closure": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 두 축이 서로를 보완해야 결론이 서는 구조라 나누면 각 글이 나머지 축을 다시 세워야 한다.",
    sharedGate:
      "사업자 공개 문서와 인용 문헌의 범위를 벗어난 제품 일반화를 하지 않고 자격 증명 수명·판정 신호의 구체 값을 권고하지 않는다.",
  },
  "ai/onprem-k8s-inference-platform": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 선택의 자리·복제 단위·고정 총량이 하나의 이전 결정을 함께 떠받치는 구조라 나누면 각 글이 같은 전제를 다시 세워야 한다.",
    sharedGate:
      "공개 프로젝트 문서에 적힌 구조까지만 근거로 삼고 구현별 성능·성숙도 평가와 구체 설정값 권고를 하지 않는다.",
  },
  "ai/generative-measurement-controls": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 네 가지 검증이 하나의 절차를 이루고 서로를 근거로 삼아 나누면 각 글이 같은 검증 틀을 다시 세워야 한다.",
    sharedGate:
      "수치는 한 장비의 프로젝트 실측이며 다른 모델 조합으로 일반화하지 않고, 임계값은 표본 규모의 한계를 함께 밝힌다.",
  },
  "ai/masked-edit-verb-routing": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 동작 분류·모델 성향·마스크 극성·지표 스케일이 하나의 라우팅 결정을 함께 떠받치므로 나누면 각 글이 같은 표를 다시 세워야 한다.",
    sharedGate:
      "수치는 한 장비·한 회차·한 프롬프트 문체의 실측이며 절대 임계값과 모델 실력 평가로 일반화하지 않는다.",
  },
  "ai/removal-is-not-inpainting": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 범주 판정·대체 도구·도구 계약·조합 기각이 하나의 결론을 함께 떠받치므로 나누면 각 글이 같은 실패 사례를 다시 세워야 한다.",
    sharedGate:
      "자동 판정기가 없는 회차이므로 정량 실패율을 주장하지 않고, 실패한 모델 목록과 기각 범위를 측정 조건까지로 한정한다.",
  },
  "ai/roi-resolution-identity-budget": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 토큰 예산·유효 구간·크롭·마스크·확대 지표가 모두 하나의 해상도 결정을 떠받치므로 나누면 각 글이 같은 예산 논증을 다시 세워야 한다.",
    sharedGate:
      "수치는 한 장비·한 소스의 실측이며 토큰 계산은 관계만 보이고 확대 순위는 소스 의존임을 밝힌다.",
  },
  "ai/reference-identity-pose-separation": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 결합 발견·대체 경로·자세 신호 한계·역할 분리가 하나의 구성을 함께 만들므로 나누면 각 글이 같은 제거 실험을 다시 세워야 한다.",
    sharedGate:
      "세기·구간의 구체 값은 이 모델 조합의 실측이며 한 인물·한 의상에서의 결과임을 밝힌다.",
  },
  "ai/generative-identity-diversity": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 세 번의 정정이 하나의 서사로 이어지고 각 절이 앞 절의 결론을 뒤집는 구조라 나누면 그 연결이 끊긴다.",
    sharedGate:
      "수치는 한 장비·특정 모델 조합의 실측이며 증류 결론은 한 가족에서 한 번 잰 것임을 밝힌다.",
  },
  "ai/negative-result-3d-face-control": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 세 라운드가 하나의 합격 기준을 공유하고 각 절이 앞 절의 결과를 재해석하는 구조라 나누면 그 연결이 끊긴다.",
    sharedGate:
      "실패한 것은 이 세 방법이며 수치는 한 장비·네 얼굴 표본의 실측임을 밝힌다.",
  },
  "firms/why-firms-exist": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "시장을 쓰는 값에서 출발해 약속의 대체·경계 조건·경계를 옮기는 조건까지가 조직은 왜 생기고 왜 멈추는가라는 하나의 질문을 푸는 한 묶음이다. 쪼개면 경계 조건이 자기 근거를 잃는다.",
    sharedGate:
      "같은 여섯 단계 예시에서 안쪽 값과 바깥쪽 값을 같은 단위로 세고, 두 값이 만나는 단계 수와 합계가 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "firms/scale-and-cost-structure": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "돌아가는 방법·최소 수량·시장 크기의 되먹임·산업의 분화·따라 나오지 않는 결론까지가 왜 싸지는가라는 하나의 질문을 푸는 한 묶음이다. 특히 마지막 부품은 앞 네 부품이 세운 것을 근거로만 설 수 있어 떼어 낼 수 없다.",
    sharedGate:
      "같은 숫자 예시에서 먼저 들이는 몫과 단위당 값을 같은 단위로 세고, 최소 수량과 갈아타는 자리가 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "firms/market-power-and-markup": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "마주하는 것·늘어나는 돈·멈추는 조건·틈의 크기·사라지는 몫까지가 혼자 팔면 값이 어디에 멈추는가라는 하나의 질문을 푸는 한 묶음이다. 틈의 크기를 떼면 Cournot의 조건이 왜 중요한지가 남지 않는다.",
    sharedGate:
      "같은 수요와 한계비용에서 멈추는 수량·읽히는 값·틈의 비율·사라지는 삼각형이 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "devices/pn-junction-and-rectification": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "붙인 직후 확산부터 내장 전기장, 외부 바이어스, 이상 전류와 모델 한계까지가 한 접합의 작동 질문을 이룹니다. 도핑의 정본 정의는 앞 글에 남기고 다음 게이트 소자는 분리합니다.", sharedGate: "300 K, Is=1 pA, VT=25.85 mV라는 같은 가정에서 −0.5·0·+0.5·+0.6 V의 본문·식·Viz·문제 수치가 일치하는지 확인합니다." },
  "devices/mos-capacitor-and-inversion": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "절연 전극 구조에서 표면 상태, 전압 기준, 반전 전하 계산, 산화막 경계까지가 하나의 MOS 축전기 질문을 풉니다. 양단자 전류를 조절하는 MOSFET은 다음 글로 분리합니다.", sharedGate: "10 nm·100 µm²·평탄띠 0 V·문턱 0.5 V·전극 1.0 V의 가정에서 0.345 pF·0.173 pC·전자 약 108만 개가 본문·식·Viz·연습문제에서 일치하는지 확인합니다." },
  "devices/mosfet-regions-and-transfer": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "한 긴 채널 소자의 네 단자와 채널에서 세 전류 영역·실제 모델 경계까지를 같은 전압 가정으로 추적합니다. 축전기의 표면 전하 정의는 앞 글, 스위칭 에너지는 다음 글이 소유합니다.", sharedGate: "Vth=0.5 V·k=1 mA/V²·VGS=1.5 V의 가정에서 VDS=0.2/1.0/1.5 V의 0.18/0.5/0.5 mA가 본문·식·Viz·연습문제에 일치하는지 확인합니다." },
  "devices/switching-energy-and-leakage": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "가상 CMOS 출력 하나에서 충전·방전 장부, 활동률, 누설, 전압 변경의 경계까지 같은 10 pF·3.3 V 사례로 따라갑니다. MOSFET 영역은 앞 글, 제조는 다음 글이 소유합니다.", sharedGate: "0→1→0 한 쌍당 108.9 pJ, 10%·1 MHz의 10.89 µW, 누설 3.3 µW와 합 14.19 µW가 본문·식·Viz·연습문제에 일치하는지 확인합니다." },
  "circuits/resistance-and-power-dissipation": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "같은 12 V 망의 등가 계산에서 각 부품 발열과 실제 부품표 정격을 이어 답합니다. 보존 법칙은 앞 글, 시간 변화는 다음 글이 소유합니다.", sharedGate: "오른쪽 2→1 kΩ 변경 전후의 6→7.2 mA, 갈림길 6→4.8 V, 첫 부품 36→51.84 mW, 공급 72→86.4 mW가 본문·식·Viz·문제에 일치하는지 확인합니다." },
  "circuits/storage-elements-and-transients": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "저항 회로에 저장 요소 하나를 넣을 때 이어지는 상태와 지수 시간 상수를 RC·RL 쌍으로 설명합니다. 정상 상태 저항은 앞 글, 반복 입력은 다음 글이 소유합니다.", sharedGate: "5 V·1 kΩ에서 1 µF의 RC와 1 H의 RL이 모두 1 ms, 1τ에 3.16 V와 3.16 mA, 최종 저장 에너지가 각각 12.5 µJ라는 가정이 본문·식·Viz·문제에 일치하는지 확인합니다." },
  "circuits/steady-state-and-impedance": { action: "keep" as const, status: "reviewed" as const, reviewedAt: "2026-10-03", rationale: "한 RC 회로의 반복 입력에서 진폭·위상 읽기, 복소 임피던스, 분압, 정상 상태 경계까지를 한 질문으로 설명합니다. 스위치 과도는 앞 글, 폭넓은 주파수 그림은 다음 글이 소유합니다.", sharedGate: "1 kΩ·1 µF·5 V 최대 진폭에서 ω=1000 rad/s이면 −j1000 Ω, H=0.707∠−45°, 출력 3.54 V가 본문·식·Viz·문제에 일치하는지 확인합니다." },
  "circuits/frequency-shaping-and-bode": {action:"keep" as const,status:"reviewed" as const,reviewedAt:"2026-10-03",rationale:"한 RC의 주파수 범위를 다루며 경계·dB·기울기를 연결합니다. 복소 임피던스 한 점은 앞 글, 피드백의 안정성은 다음 글이 다룹니다.",sharedGate:"1 kΩ·1 µF·5 V 최대 진폭: fc≈159.15 Hz, 0.1/1/10fc의 출력 4.98/3.54/0.50 V, fc→10fc 변화 −17.03 dB를 본문·Viz·문제에서 맞춥니다."},
  "circuits/feedback-gain-and-stability": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "1 V를 넣은 증폭기의 오차에서 폐루프 이득, 두 극 지연, 루프 교차·위상 여유와 부하 경계까지 한 되먹임 질문으로 풉니다. 필터 자체의 진폭 지도는 앞 글에 남깁니다.",
    "sharedGate": "A0=100·극10/100 rad/s·β=0.1/0.5에서 폐루프 9.09/1.96, 교차 78.2/212.6 rad/s, 여유 59.3°/27.9°가 본문·Viz·문제에 일치하는지 확인합니다."
  },
  "semiconductors/wafer-and-planar-process": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "선택 확산과 접합 보호라는 하나의 평면 공정 질문을 웨이퍼→막 창→확산→접촉 순서로 풉니다. 노광 해상도·정렬과 도핑 열 예산은 다음 글이 소유합니다.",
    "sharedGate": "가상 창100 µm·옆 확산 각2 µm·접촉 창80 µm에서 p형 폭104 µm·한쪽 명목 거리12 µm가 본문·Viz·문제에 일치하고 특허 실측과 구분되는지 확인합니다."
  },
  "semiconductors/lithography-and-resolution": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "한 층에 무늬를 얼마나 작게 찍는지와 여러 층을 어디에 맞춰 찍는지를 같은 접촉 창 사례로 구분합니다. 확산 온도·시간은 다음 글이 소유합니다.",
    "sharedGate": "가상 λ193 nm·NA0.8·k1 .4/.3에서 CD96.5/72.4 nm, 선200 nm·창120 nm·이동0/30/50 nm에서 최소 여유40/10/−10 nm가 본문·Viz·문제에 일치하는지 확인합니다."
  },
  "semiconductors/doping-and-thermal-budget": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "한 번 넣은 불순물이 두 열 단계에서 얼마나 퍼지는지 농도 모양→폭→누적 Dt→접합 한계로 풉니다. 창의 광학 해상도는 앞 글, 완성 배선 지연은 다음 글이 소유합니다.",
    "sharedGate": "가상 D1=10^-14 cm²/s·3600s, D2=4×10^-14 cm²/s·1800s에서 B=1.08×10^-10 cm²·a1=120nm·a2≈208nm·표면 비≈0.58이 본문·Viz·문제에 일치하는지 확인합니다."
  },
  "semiconductors/interconnect-and-rc-delay": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "한 가상 배선을 π 회로→74 ps→길이 두 배 158 ps→금속·절연막 변경→실제 타이밍 경계 순서로 추적합니다. 제조 결함과 패키징 수율은 다음 글의 범위입니다.",
    "sharedGate": "500 Ω·20 fF·200 Ω·100 fF에서 60+14=74 ps, 길이 두 배 110+48=158 ps, 저항만 69.8 ps, 용량만 44 ps, 둘 다 41.3 ps가 본문·Viz·문제에서 일치하는지 확인합니다."
  },
  "semiconductors/yield-defect-and-packaging": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "결함이 해로운 위치→포아송 0개 확률→면적·밀도 민감도→패키징 조건부 생존으로 한 후보 다이를 추적합니다. 다음 임베디드 글은 완성 칩을 사용하는 단계입니다.",
    "sharedGate": "D0=.1개/cm²·Ac=1cm²에서 e^-.1≈90.48%, Ac=4에서 e^-.4≈67.03%, D0=.2에서 e^-.2≈81.87%, 1000×.904837×.98≈886.7개가 본문·Viz·문제에서 일치하는지 확인합니다."
  },
  "embedded/mcu-memory-map-and-registers": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "GPIO5 하나를 통해 주소→오프셋→비트 마스크→핀 기능·방향→물리 핀 확인 순서로 추적합니다. 인터럽트 시점과 타이머는 후속 글에 남깁니다.",
    "sharedGate": "SIO 0xD0000000+0x014/0x018/0x024=0xD0000014/18/24, GPIO5 1<<5=0x20, IO_BANK0+0x02C=0x4001402C가 본문·Viz·문제에서 일치하는지 확인합니다."
  },
  "embedded/interrupts-and-latency-budget": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "GPIO2 사건→주변 장치와 NVIC→짧은 ISR→작업→1 ms 마감까지 한 경로를 추적합니다. 10 ms 주기 샘플링은 다음 글에서 따로 다룹니다.",
    "sharedGate": "검출5+대기40+진입8+ISR20=73 µs, 작업40+I²C300+계산80을 더한 전체493 µs, 여유507 µs, 대기600이면1053 µs·53 µs 초과가 본문·Viz·문제에서 일치해야 합니다."
  },
  "embedded/timers-and-sampling": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "10 ms 타이머 목표→실제 ADC 시각→100 Hz 저장→70 Hz가 30 Hz로 겹침→ADC 전 필터 순서로 한 신호를 추적합니다. I²C 버스 거래는 다음 글에서 다룹니다.",
    "sharedGate": "10ms=10000 timer ticks, fs=100Hz, half=50Hz, |100−70|=30Hz, 처리10.4ms 뒤 다음 절대 목표20ms가 본문·Viz·문제에서 일치하는지 확인합니다."
  },
  "embedded/serial-buses-and-tradeoffs": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "외부 센서 네 바이트라는 사례에서 I²C 주소·ACK→63클록→SPI·UART 대안→실제 완료 시간 경계로 흐릅니다. 여러 작업의 우선순위 배분은 다음 글에서 다룹니다.",
    "sharedGate": "I²C 7×9=63클록·400kHz 157.5µs·100kHz 630µs, SPI 5×8/1MHz=40µs, UART 4×10/115200≈347.2µs가 본문·Viz·문제에서 일치해야 합니다."
  },
  "embedded/scheduling-and-real-time": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "주기·실행·마감→기본 고정 우선순위 시간표→46% 평균→뮤텍스 대기로 센서가 늦는 한 사례를 추적합니다. 펌웨어 갱신 실패의 복구는 다음 글이 소유합니다.",
    "sharedGate": "제어1/5=20%, 센서2/10=20%, 로그3/50=6%, U46%; 기본 센서0–3ms 완료·마감4ms 여유1ms, 로그 뮤텍스2ms 뒤 센서5ms 완료·초과1ms가 본문·Viz·문제에서 일치해야 합니다."
  },
  "embedded/firmware-update-and-recovery": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-03",
    "rationale": "v1 작동 중인 보드에서 플래시 배치→v2 검증→시험 swap→확정 또는 복귀→전원 차단 지점별 결과를 추적합니다. 칩 내장 BOOTSEL과 사용자 부트로더 책임을 구분합니다.",
    "sharedGate": "4096=256+1536+1536+768 KiB, 미완성·서명 실패 후보는 v1 유지, TEST 미확정 재부팅은 v1 복귀, image OK 뒤는 v2 유지가 본문·Viz·문제에서 일치해야 합니다."
  },
  "labor/wage-floor-natural-experiment": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "얻는 몫·두 가지 멈추는 자리·갈라지는 예측·재는 방법·읽는 규율까지가 임금이 어디서 멈추는가라는 하나의 질문을 푸는 한 묶음이다. 측정을 떼어 내면 앞의 분기가 왜 중요한지가 남지 않고, 분기를 떼어 내면 측정 결과를 한쪽 증거로 오독하게 된다.",
    sharedGate:
      "같은 숫자 묶음(더 파는 몫 13−n, 부르는 임금 n+3, 바닥 9)에서 멈추는 사람 수·임금·틈과, 원문 표 3·표 7의 값이 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "labor/measuring-the-spread": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "표의 한계·그리는 방법·읽는 규칙·한 숫자로 줄이기·그 숫자가 틀리는 자리·벌어짐의 출처까지가 벌어진 정도를 어떻게 재는가라는 하나의 질문을 푸는 한 묶음이다. 요약 숫자를 떼어 내면 곡선을 그릴 이유가 약해지고, 교차 반례를 떼어 내면 그 숫자를 무조건 믿게 된다.",
    sharedGate:
      "Lorenz 218쪽의 열 사람 두 경우에서 누적값·교차 지점·넓이 비(0.120과 0.144)와 214쪽 프로이센 표의 누적값·넓이 비(0.357과 0.394)가 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "macro/why-per-head-stalls": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "두 줄의 늘어남·나눗셈·되먹임·깨진 가정·남는 힘까지가 총량과 살림이 왜 갈리는가라는 하나의 질문을 푸는 한 묶음이다. 되먹임을 떼면 나눗셈이 왜 중요한지가 남지 않고, 깨진 가정을 떼면 빗나간 예측을 그대로 결론처럼 읽게 된다.",
    sharedGate:
      "Malthus 초판의 같은 숫자 묶음(700만 시작, 25년마다 두 배, 25년마다 700만분 추가)에서 100년 뒤 인구·식량·한 사람 몫과 7,700만이라는 모자람이 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "macro/what-the-price-level-hides": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "등식의 성립·돈 쪽을 세는 법·네 자리의 묶임·원인을 말하지 못함·남는 쓸모까지가 값이 올랐다는 말을 어떻게 읽어야 하는가라는 하나의 질문을 푸는 한 묶음이다. 경고를 떼면 항등식이 인과처럼 읽히고, 등식을 떼면 경고가 설 자리가 없다.",
    sharedGate:
      "Fisher 개정판 2장의 같은 숫자 묶음(가진 돈 500만·손 바뀜 20·빵 2억×0.1·석탄 1,000만×5·옷감 3,000만×1)에서 양변 1억 달러와 세 가지 변형의 값이 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "macro/who-counts-as-unemployed": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "세 조건·분모의 성질·네 지표·눈금 이동·읽는 법까지가 실업률이라는 숫자가 어떻게 만들어지는가라는 하나의 질문을 푸는 한 묶음이다. 분모의 성질을 떼면 왜 지표가 넷인지가 남지 않고, 지표를 떼면 분모의 성질이 경고로만 끝난다.",
    sharedGate:
      "같은 100명 보기(일하는 사람 60·실업자 9·시간 모자람 7·잠재 8)에서 LU1~LU4의 분자·분모·백분율과 세 조건에서 걸러지는 인원이 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "macro/what-ricardo-assumed": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "안과 밖의 구분·전제·반사실·전제의 근거까지가 이 논증이 무엇 위에 서 있는가라는 하나의 질문을 푸는 한 묶음이다. 반사실을 떼면 전제의 위치가 드러나지 않고, 전제를 떼면 안과 밖의 구분이 설명되지 않는다.",
    sharedGate:
      "Ricardo 7장의 같은 네 숫자(영국 100·120, 포르투갈 90·80)에서 두 나라 안의 맞바꿈 비율과 자본이 움직일 때의 절대 비교가 본문·식·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "testimony/speeches-were-reconstructed": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "한 문단에 적힌 두 방법과 그 뒤의 두 어긋남이 '이 책의 어느 문장을 어디까지 믿을 수 있는가'라는 한 질문을 푼다. 연설 쪽만 떼면 재구성이 예외처럼 보이고, 사건 쪽만 떼면 저자가 왜 두 방법을 나눠 썼는지가 사라진다.",
    sharedGate:
      "1권 22절의 같은 문단에서 연설 칸의 두 제약과 사건 칸의 세 단계, 어긋남의 두 원인이 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "testimony/told-but-not-believed": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "세 설명·꼬리표·두 의무·범위 선언이 '믿지 않으면서 적은 문장을 어떻게 읽는가'라는 한 질문의 네 부품이다. 꼬리표를 떼면 세 설명이 모순으로 보이고, 범위 선언을 떼면 두 의무의 분리가 한 대목의 변명과 구별되지 않는다.",
    sharedGate:
      "7권 148~152절의 같은 세 설명과 152절의 두 의무·범위 문장이 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "testimony/the-writer-was-there": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "목격의 한계·치우침 공개·나눠 읽기·증인·독자 제약이 '당사자의 기록을 어디까지 믿을 수 있는가'라는 한 질문의 다섯 부품이다. 목격의 한계를 떼면 나머지 네 장치가 왜 필요한지가 사라지고, 증인과 독자를 떼면 나눠 읽기 요청이 저자의 선의에만 기대게 된다.",
    sharedGate:
      "서문 1·4·8·12절의 같은 진술(두 실패와 동기, 자기 소개, 나눠 읽기 요청, 티투스 증언, 겪어 아는 독자)이 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "record-numbers/how-the-army-was-counted": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "숫자의 출처·절차·해상도·단위 오차가 '적힌 수를 어디까지 쓸 수 있는가'라는 한 질문의 네 부품이다. 절차를 떼면 해상도를 계산할 근거가 없고, 단위 오차를 떼면 절차를 아는 것이 곧 신뢰라는 오독이 남는다.",
    sharedGate:
      "7권 60절의 같은 절차(1만 명·원·배꼽 높이 담·채움 되풀이)와 170만이 본문·Viz·연습문제에서 일치하고, 1만 × 170 = 1,700,000의 환산이 어긋나지 않는지로 판정한다.",
  },
  "record-numbers/what-the-total-cannot-tell": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "재료·종류 표시·끝자리·검산이 '계산이 적힌 총계를 어디까지 쓸 수 있는가'라는 한 질문의 네 부품이다. 재료를 떼면 끝자리의 출처를 되짚을 수 없고, 검산을 떼면 계산을 적어 두는 일의 값이 드러나지 않는다.",
    sharedGate:
      "7권 184~187절의 같은 재료와 소계(241,400 · 36,210 · 240,000 · 517,610 · 2,317,610 · 2,641,610 · 5,283,220)가 본문·Viz·연습문제에서 일치하고, 5,283,220 ÷ 48 = 110,067 나머지 4가 어긋나지 않는지로 판정한다.",
  },
  "record-numbers/numbers-that-command": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "답의 꼴·같은 사다리·네 종류·물가 읽기가 '명령하는 숫자에서 무엇을 읽을 수 있는가'라는 한 질문의 네 부품이다. 사다리를 떼면 두 조항의 신분별 금액 기준을 비교할 수 없고, 물가 읽기를 떼면 측정 숫자와 섞어 쓰는 오독이 남는다.",
    sharedGate:
      "196~199·209~217·221~223조의 같은 금액(1마나·값의 절반·10·5·2·5·3·2)과 202조의 채찍 60대, 273조의 하루 품삯이 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "inference-from-sources/ruins-mislead": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "치우친 걸름·방향·규칙·적용이 '남은 것에서 지난 일을 어떻게 추정하는가'라는 한 질문의 네 부품이다. 방향을 떼면 규칙이 한쪽만 막는 것으로 읽히고, 적용을 떼면 같은 규칙이 수를 내려 잡는 데에도 쓰인다는 사실이 사라진다.",
    sharedGate:
      "1권 10절의 같은 사고실험(기초만 남음·두 배)과 같은 수치(1,200척·120명·50명)가 본문·Viz·연습문제에서 일치하고, (120+50)÷2 = 85가 어긋나지 않는지로 판정한다.",
  },
  "inference-from-sources/the-gap-was-made": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "지움·번호·공백의 범위·돌아온 조각이 '사람이 만든 공백에서 무엇을 읽을 수 있는가'라는 한 질문의 네 부품이다. 번호를 떼면 복원 판단이 이름표에 실린다는 사실이 사라지고, 돌아온 조각을 떼면 공백이 메워질 때의 자격 문제가 남지 않는다.",
    sharedGate:
      "Johns 판의 같은 기술(다섯 단 지움·다시 다듬음·열일곱째 단의 첫 글자·35개 조항 추정·아시리아 사본의 세 조항)이 본문·Viz·연습문제에서 일치하고, 65와 100의 차이는 35지만 사이의 빈 번호는 34개임을 구분하는지로 판정한다.",
  },
  "inference-from-sources/naming-the-past": {
    action: "keep" as const,
    status: "reviewed" as const,
    reviewedAt: "2026-10-03",
    rationale:
      "여러 이름·이름에서 떠오른 기대·붙은 구조·번역어가 '읽는 쪽이 무엇을 들여오는가'라는 한 질문의 네 부품이다. 기대를 떼면 이름의 차이가 호칭 문제로만 보이고, 구조와 번역어를 떼면 들여오는 일이 표제에서 끝나는 것처럼 읽힌다.",
    sharedGate:
      "Johns 판의 같은 대목(본문 끝의 '올바름의 판결들', 머리말의 열두 장과 Ninu ilu sirum, 아시리아의 이름, 표제와 1~282조 번호)이 본문·Viz·연습문제에서 일치하는지로 판정한다.",
  },
  "business/business-model-cashflow": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "사업 모델을 비교할 때는 매출 이름보다 비용을 먼저 내는 사람, 고객에게서 돈을 받는 시점, 재고·반품·미수금을 떠안는 주체를 추적해야 합니다.", "sharedGate": "(가정) 주문 100건 × 2만 원, 원가 120만 원, 결제 수수료 6만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "business/shop-unit-economics": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "점포의 손익분기점은 객단가에서 재료·수수료 같은 변동비를 뺀 한 건의 공헌이익으로 고정비를 나눈 결과이며, 점주 노동과 개업비 회수는 별도로 계산해야 합니다.", "sharedGate": "(가정) 한 잔 6천 원, 변동비 2천 원, 월 고정비 800만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "business/shop-site-selection": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "입지는 유동인구 숫자 하나가 아니라 예상 방문자·구매전환·객단가·임대료를 같은 시간대와 동일 업종에서 대조하고 그 건물에서 영업이 가능한지 확인하는 선택입니다.", "sharedGate": "(가정) 하루 통행 1천 명, 입점 5%, 구매 40%, 객단가 8천 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "business/shop-fitout-and-opening": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "점포 공사는 임대인의 사용 동의, 업종에 필요한 설비 확인, 범위가 적힌 견적·변경 승인, 공정 검수, 신고와 개업 준비가 이어지는 계약과 현금의 순서입니다.", "sharedGate": "(가정) 공사 견적 4천만 원, 추가 전기·배기 8백만 원, 무매출 30일의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "property/commercial-lease-and-rent": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "상가 임대차의 경제적 본질은 임차인이 일정 기간 공간을 쓰는 대신 고정 현금흐름과 원상복구 의무를 부담하고, 임대인은 공실·수선·보증금 반환 위험을 지는 교환입니다.", "sharedGate": "(가정) 보증금 3천만 원, 월세 200만 원, 3년, 공실 2개월의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "property/shop-transfer-and-goodwill": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "점포 양도 대금은 시설·재고·고객 관계의 가치와 임대차 지위, 영업 허가·채무 인수 여부가 섞여 보이므로 각각의 소유자와 동의권자, 인도 시점을 분리해야 합니다.", "sharedGate": "(가정) 시설 2천만 원, 재고 3백만 원, 영업상 이점 1천만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "property/shop-closure-and-restoration": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "점포 폐업은 영업 중단, 직원·고객·공급자·세금 채무, 임대차 종료, 시설 철거와 원상복구, 보증금 반환을 서로 다른 상대방과 순서대로 정산하는 과정입니다.", "sharedGate": "(가정) 보증금 3천만 원, 미납 월세 4백만 원, 복구 견적 6백만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "business/franchise-incentives": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "가맹본부의 브랜드·매뉴얼·공급망 수입과 가맹점의 매출·임금·월세·로열티를 별도로 그려야 양쪽의 인센티브와 위험 배분을 볼 수 있습니다.", "sharedGate": "(가정) 월매출 3천만 원, 로열티 5%, 원재료 1천만 원, 월세 300만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "property/land-development-residual": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "개발 가능성은 등기상의 소유와 다르며 허가·용적·기반시설·분양가격·금융비용의 조건을 거꾸로 계산한 잔여액이 토지에 지불할 수 있는 값의 상한을 만듭니다.", "sharedGate": "(가정) 완공 매각 100억 원, 공사·금융·판매 70억 원, 요구 이익 15억 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "business/supply-chain-bargaining": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "국제 공급망에서는 각 나라가 다른 단계를 맡아도 제품 규격·브랜드·고객 접점·교체 가능한 공급자를 통제하는 주체가 협상력을 얻으며, 한 나라의 수출액은 그 나라에 남는 부가가치와 다릅니다.", "sharedGate": "(가정) 완제품 100달러, 부품·조립 60달러, 물류 10달러, 유통·브랜드 30달러의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "markets/funds-etfs-and-etns": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "펀드·ETF는 자산 묶음에 대한 지분이고 ETN은 발행자에 대한 채무 청구권이므로 지수 이름보다 법적 소유, NAV와 거래가격, 발행자 신용과 비용을 먼저 구분해야 합니다.", "sharedGate": "(가정) 자산 순가치 1만 원, ETF 거래가격 1만100원, ETN 발행자 부도의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "markets/forwards-and-futures": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "선도·선물은 미래에 정한 가격으로 거래할 의무를 양쪽에 만들어 가격 변동 손익을 재배분하며, 선물은 거래소·청산과 일별 정산으로 중간 현금흐름이 생깁니다.", "sharedGate": "(가정) 밀 100톤을 톤당 30만 원에 3개월 뒤 사기로 약속의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "markets/options-and-asymmetric-payoffs": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "콜·풋 옵션의 매수자는 행사 여부를 선택할 권리를 얻고 프리미엄을 내며, 매도자는 프리미엄을 받는 대신 불리할 때 계약 이행 의무를 집니다.", "sharedGate": "(가정) 주식 1주, 행사가 100, 콜 프리미엄 8, 만기 주가 120의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "markets/swaps-and-credit-risk": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "금리·통화 스왑은 정해진 명목원금을 기준으로 서로 다른 지급 흐름을 교환하고 CDS는 채무불이행 위험의 보상 의무를 넘기며, 명목원금이 곧 현재 손실은 아닙니다.", "sharedGate": "(가정) 명목원금 10억 원, 고정금리 4%, 변동금리 6%의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "risk/margin-collateral-and-leverage": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "레버리지 거래와 파생상품은 시가 하락 때 증거금을 추가하고 담보 가치를 다시 매기므로 만기의 수익 전망과 별개로 오늘의 현금 부족이 강제 매도를 만들 수 있습니다.", "sharedGate": "(가정) 자기자본 20억 원, 차입 80억 원, 자산 100억 원이 10% 하락의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "macro/global-capital-and-policy": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "정부·중앙은행의 결정권은 환율, 해외 차입, 은행 담보와 투자자 포트폴리오를 거쳐 가격에 전달되며 같은 글로벌 충격도 국가의 부채 통화·제도에 따라 다른 결과를 냅니다.", "sharedGate": "(가정) 달러 부채 1억 달러, 환율 1달러=1천 원에서 1천200원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "macro/narratives-and-market-regimes": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "새로운 기술·정책·국가 서사는 미래 현금흐름에 대한 기대를 바꾸고 매수 주문과 자금조달을 거쳐 가격을 움직이지만, 가격 상승 자체가 다시 서사의 증거처럼 쓰일 때 취약한 순환이 생깁니다.", "sharedGate": "(가정) 기대 매출 100에서 150, 할인율 10%에서 8%, 실제 매출 105의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/insurance-risk-pooling": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "보험은 많은 가입자의 보험료를 모아 일부의 약정 손실을 지급하는 위험 풀이고, 가격에는 예상 사고액뿐 아니라 운영비·자본·불확실성이 포함되며 대형 공통 충격은 다시 밖으로 넘겨야 합니다.", "sharedGate": "(가정) 1천 명이 각 10만 원 보험료, 20명이 평균 300만 원 손해의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/healthcare-payment-systems": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "의료제도는 재원을 누가 모으고 위험을 누가 묶으며 어떤 가격표로 의료기관에 지급하는지를 분리해야 비교할 수 있고, 환자의 진료비 지불액만으로 의료 서비스의 총비용을 알 수 없습니다.", "sharedGate": "(가정) 진료 총지급 10만 원, 환자 2만 원, 보험자 8만 원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/how-to-read-a-country": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "국가를 비교할 때는 이름이나 순위보다 누가 규칙을 바꾸고 세금을 걷는지, 누가 무엇을 생산하며 외화와 에너지를 조달하는지, 대중이 어떤 미래를 믿고 자금을 움직이는지 같은 질문을 반복해야 합니다.", "sharedGate": "(가정) A국 수출 100, 수입 중간재 60, 외화 부채 30, 정부 재정 적자 5의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/electricity-grid-and-power": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "전력 시장은 전기를 생산하는 설비, 같은 순간 수요와 공급을 맞추는 운영자, 송배전망을 소유하는 주체, 요금을 내는 사용자의 장부가 겹칩니다.", "sharedGate": "(가정) 발전 100MWh, 송전 혼잡으로 20MWh를 멀리 보내지 못함의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/food-chain-and-prices": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "식품의 소비자가격은 농가 출하 가격에 가공·저장·운송·소매의 비용과 협상력을 더한 결과이며 각 단계의 재고와 폐기 위험이 다릅니다.", "sharedGate": "(가정) 농가 100원, 선별·저장 30원, 운송 20원, 소매 50원의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/water-utility-and-tariffs": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "수도는 취수한 물의 양뿐 아니라 정수·배관·누수·위생 처리와 저소득층 접근을 함께 지불해야 하는 공공 서비스입니다.", "sharedGate": "(가정) 정수·운영 60, 배관 교체 30, 저소득 지원 10의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/transport-access-and-land-value": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "교통 투자는 차량 속도뿐 아니라 사람이 일자리·학교·서비스에 도달하는 범위와 그 이익이 임대료로 이동하는 과정을 함께 바꿉니다.", "sharedGate": "(가정) 통근 60분에서 35분, 월 절약 20일×25분의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/housing-land-and-supply": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "주택 가격과 임대료는 토지 사용권, 인허가, 기반 시설, 건설비, 금융과 지역 일자리 수요가 서로 제약하면서 형성됩니다.", "sharedGate": "(가정) 새 집 판매가 10억, 공사·금융·허가 7억, 토지 잔여 3억의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "infrastructure/climate-risk-and-exposure": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "홍수·폭염 등 위험을 평가할 때는 자연 현상의 강도, 노출된 사람과 자산, 취약성과 대응 능력을 분리해야 손실과 투자 판단이 가능합니다.", "sharedGate": "(가정) 동일 홍수, A지역 자산 100·취약률 10%, B지역 자산 300·취약률 20%의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/public-budget-and-taxes": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "공공 예산은 세입·차입으로 모은 돈을 서비스와 이전지출, 투자, 이자에 배분한 약속이며 부담자와 수혜자가 다른 시점과 집단에 걸칩니다.", "sharedGate": "(가정) 세금 80, 신규 차입 20, 의료 40·교육 30·도로 20·이자 10의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/education-skills-and-signals": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "교육비 지출은 학습자의 실제 능력 향상, 고용주가 믿는 자격 신호, 직업 연결과 기회 접근에 서로 다른 경로로 영향을 줍니다.", "sharedGate": "(가정) 교육비 1천만 원, 연 임금 증가 200만 원, 취업 지연 1년의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
  "institutions/media-attention-and-public-belief": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-03", "rationale": "플랫폼·언론은 정보를 선택·배치하고 관심을 광고주에게 판매하며, 사람의 믿음은 관측 정보뿐 아니라 반복 노출과 신뢰 관계를 통해 바뀝니다.", "sharedGate": "(가정) 게시물 100개 중 추천 10개, 광고 노출 1천 회의 현금·권리·위험 수치가 본문과 연습문제에서 일치하는지 확인합니다."},
};

/**
 * Review 당시 title·learning ownership·source closure의 digest입니다. 본문 구조나
 * 개념 소유권이 바뀌면 topology audit가 stale decision으로 되돌립니다.
 */
export const ARTICLE_TOPOLOGY_FINGERPRINTS: Readonly<Record<string, string>> = {
  "institutions/public-budget-and-taxes": "858616f20106cac0",
  "institutions/media-attention-and-public-belief": "bc7321e7db566444",
  "institutions/education-skills-and-signals": "b841f26ce41c486f",
  "infrastructure/water-utility-and-tariffs": "ac1d1e0cb8891b5a",
  "infrastructure/transport-access-and-land-value": "24a87e2a7141bf99",
  "infrastructure/housing-land-and-supply": "63bec3fabc784c4e",
  "infrastructure/food-chain-and-prices": "5025197ed934627c",
  "infrastructure/electricity-grid-and-power": "7f737a8bdf71456d",
  "infrastructure/climate-risk-and-exposure": "a722e8692722611a",
  "business/business-model-cashflow": "c272d56683e6bc7b",
  "business/franchise-incentives": "24269b4a14f7667f",
  "business/shop-fitout-and-opening": "6f806e1c01b92732",
  "business/shop-site-selection": "d785f79bbb76f7c8",
  "business/shop-unit-economics": "659b86568b06d19b",
  "business/supply-chain-bargaining": "d7bf7ca40cded5c7",
  "institutions/healthcare-payment-systems": "2ae8411f72576272",
  "institutions/how-to-read-a-country": "7ac6b05c21959279",
  "institutions/insurance-risk-pooling": "eca4bed3ee21a4e5",
  "macro/global-capital-and-policy": "bc21989182ad88de",
  "macro/narratives-and-market-regimes": "0690b5bc99b8474b",
  "markets/forwards-and-futures": "d46341b46a021c8b",
  "markets/funds-etfs-and-etns": "8b87cfba93e0174c",
  "markets/options-and-asymmetric-payoffs": "c772deedce082375",
  "markets/swaps-and-credit-risk": "11d9be758e279454",
  "property/commercial-lease-and-rent": "ededa299e0fb91cd",
  "property/land-development-residual": "fa16ba308c60c722",
  "property/shop-closure-and-restoration": "0992cd6d736252ee",
  "property/shop-transfer-and-goodwill": "e7c4441ec6abfcfe",
  "risk/margin-collateral-and-leverage": "bcbeb3bd34e2e2ff",
  "macro/what-ricardo-assumed": "6566e07f66c31f32",
  "macro/who-counts-as-unemployed": "0e99dde8bd38dd55",
  "macro/what-the-price-level-hides": "a44701dc2ad7feae",
  "macro/why-per-head-stalls": "288664818602d036",
  "labor/measuring-the-spread": "9c6d52345e9d0a9c",
  "labor/wage-floor-natural-experiment": "24f8973f6bfad249",
  "embedded/firmware-update-and-recovery": "11af404968f4feda",
  "embedded/scheduling-and-real-time": "854c44f36c3d7c77",
  "embedded/serial-buses-and-tradeoffs": "1b52a6c0969c064e",
  "embedded/timers-and-sampling": "d65d89abe395b450",
  "embedded/interrupts-and-latency-budget": "c4b9955ab55f378b",
  "embedded/mcu-memory-map-and-registers": "21fe616f12dd3bdb",
  "semiconductors/yield-defect-and-packaging": "163db4ca3af9975d",
  "semiconductors/interconnect-and-rc-delay": "9fe870634104880b",
  "semiconductors/doping-and-thermal-budget": "77caf87831e26635",
  "semiconductors/lithography-and-resolution": "45e896d39b860a36",
  "semiconductors/wafer-and-planar-process": "20fd73be7dfc606d",
  "circuits/feedback-gain-and-stability": "15f097e2dabbb613",
  "circuits/frequency-shaping-and-bode": "38c916fc1b32d16f",
  "circuits/steady-state-and-impedance": "f2cf3866dd83a148",
  "circuits/storage-elements-and-transients": "cc761424ab916184",
  "circuits/resistance-and-power-dissipation": "c6f5fea1f52dda34",
  "devices/switching-energy-and-leakage": "ceb9d7570a210e44",
  "devices/mosfet-regions-and-transfer": "1879d22ab7ea8d40",
  "devices/mos-capacitor-and-inversion": "8cc6ce4600003dae",
  "devices/pn-junction-and-rectification": "4d8acd6a58093d10",
  "ai/negative-result-3d-face-control": "6b146f6ac0e0984c",
  "ai/generative-identity-diversity": "261a9b984c0aa841",
  "ai/reference-identity-pose-separation": "7b3b4e75c366dbf4",
  "ai/roi-resolution-identity-budget": "f3accd1c96fa7c7a",
  "ai/removal-is-not-inpainting": "9f0aa2fc6484243e",
  "ai/masked-edit-verb-routing": "06f1b10542722ab5",
  "ai/generative-measurement-controls": "737a5fab33a6d115",
  "ai/claw-bash": "496c58b56a42b74b",
  "ai/claw-cli": "cc18894dcde0791f",
  "ai/claw-compaction": "b68a0c6ce9c16b01",
  "ai/claw-overview": "d7313312a4d035e0",
  "ai/claw-permissions": "9e52562e28c1df3d",
  "ai/claw-session": "eb5f7c26f594fa09",
  "ai/claw-worker-boot": "b7df07ea1da8f092",
  "ai/llm-serving-ops": "81298c7a1551297d",
  "ai/multiview-fusion": "3781959f74ddda54",
  "ai/open-r1": "478fefd6da1c4f57",
  "ai/openclaw-assistant": "edc4529ce21a5f35",
  "ai/qwen-korean-consistency": "44f39867283e1e94",
  "ai/dinov3-self-supervised-backbone": "23b836bbc712c191",
  "ai/image-embedding-pipeline": "183b7fb7e57921f8",
  "gpu/datacenter-site-readiness": "07b871983667a242",
  "gpu/server-cpu-lineup-comparison": "f8273f0dacbcd008",
  "gpu/ai-accelerator-vendor-comparison": "a95a27113319cc2f",
  "ai/multi-component-finetuning-vram": "c3f7e981c26b48fc",
  "ai/vision-backbone-selection": "cdd9671993dee419",
  "ai/image-text-contrastive-pretraining": "f5b36610fc8dff17",
  "ai/sam3-promptable-concept-segmentation": "fc7656e7ef8d7e3c",
  "ai/qwen38-flash-next-architecture": "990512955da9123f",
  "gpu/modded-rtx4090-moe-serving": "73c84dae6a67f21c",
  "ai/rag-pipeline": "65d41c4a2ba06aed",
  "ai/smoothie-qwen-weight-editing": "68499b22e204f442",
  "ai/sequence-modeling-tabular": "aacb8b5d191a4f55",
  "ai/sionic-eureka": "5e76a02b279d1390",
  "ai/sionic-glm-b300": "e16981193eb189c8",
  "ai/skills-anatomy": "61679abd14267eab",
  "ai/time-features": "36e27f8b4d5ac20f",
  "ai/training-pipeline": "b5b3f8ce59ac29e9",
  "ai/transfer-learning-practice": "2cbdcdc7079650ed",
  "ai/transformer-architecture": "8fc15de1523628d0",
  "ai/tokenizer": "87660ba663da6629",
  "ai/vae": "147d459b37db9ccd",
  "ai/vllm-paged-attention": "7150bf99c717624c",
  "ai/vllm-spec-decode": "4ae6d26832c9fab4",
  "ai/vllm-scheduler": "4721c6f860114ef2",
  "ai/retrieval-ranking-funnel": "a90156ebba994926",
  "ai/model-vram-budgeting": "c4fcc7f16d877504",
  "ai/xml-prompting": "10c4804cd901a1a7",
  "blockchain/cometbft-abci": "e01d405674622a43",
  "blockchain/cometbft-consensus": "71c836005dee4db3",
  "blockchain/da-theory": "39c69d13873e3624",
  "blockchain/helios-bootstrap": "13a19c99b6bba698",
  "blockchain/kohaku-provider": "806e8b018bb57583",
  "blockchain/prysm-attestation": "ff5f3a30e4d7b1dd",
  "blockchain/prysm-beacon-db": "7ecd6e9cf497d958",
  "blockchain/prysm-epoch-processing": "5d8efe4c4130942d",
  "blockchain/reth-alloy-primitives": "d55c99318125f430",
  "blockchain/reth-net": "fb69242dd7a9184d",
  "blockchain/reth-precompiles": "7233ca749293b83f",
  "blockchain/reth-rpc": "a3ee98c5da5ab0f6",
  "blockchain/reth-sync": "da31c51eece15592",
  "blockchain/reth-txpool": "610e2f10b793ae99",
  "crypto/mpc": "487961f55cafda95",
  "gpu/cuda-basics": "65ca6f0e8f4a01a0",
  "gpu/gpu-arch-hopper": "036cadb2e337870a",
  "gpu/cuda-persistent-kernels": "9a0d1ef64c90bed2",
  "gpu/cuda-register-pressure": "de34dcf7cffc5752",
  "isms-aml/isms-security-infra": "3c313e4c01bcc569",
  "ai/lora-finetuning": "7a5496963b41f228",
  "saas/edge-request-defense-pipeline": "7cbe4e65093e80a9",
  "saas/anycast-delivery-continuity": "aff159589f1c6bbb",
  "saas/private-access-inbound-closure": "4ce0f54f2ee45937",
  "ai/onprem-k8s-inference-platform": "acd23d8e4dc14592",
  "firms/why-firms-exist": "63891a70391f81d0",
  "firms/scale-and-cost-structure": "81801244a44eeece",
  "firms/market-power-and-markup": "bd7e2fcb297b90d2",
  "circuits/lumped-circuit-and-conservation": "ae617ac8e7582b07",
  "testimony/speeches-were-reconstructed": "f1adf0d6f339adc2",
  "testimony/told-but-not-believed": "f7b915d7d5618ff8",
  "testimony/the-writer-was-there": "e7af6bbec0f76e44",
  "record-numbers/how-the-army-was-counted": "263d90bff79ae71c",
  "record-numbers/what-the-total-cannot-tell": "4a56414aa5294477",
  "record-numbers/numbers-that-command": "068b1440b780d915",
  "inference-from-sources/ruins-mislead": "00e46e35e3fb93b9",
  "inference-from-sources/the-gap-was-made": "6224616aee8d25d8",
  "inference-from-sources/naming-the-past": "58060787a5f1d221",
};

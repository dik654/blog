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
    reviewedAt: "2026-09-11",
    rationale:
      "closure 1,716줄 중 808줄이 6개 Viz이고 본문은 6 section·concept 7개로 keep 범위다. 선택·배선·조회·회계·요청 상태는 같은 공개 config 하나를 읽는 연속된 질문이라 나누면 각 글이 config 설명을 중복하게 된다.",
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
    reviewedAt: "2026-09-11",
    rationale:
      "closure 1,497줄 중 절반 이상이 6개 Viz이고 본문은 6 section·concept 7개로 keep 범위다. 두 학습 목표·붕괴·Gram anchoring은 '라벨 없이 학습할 때 무엇이 무너지는가'라는 한 질문의 연속 단계라 나누면 각 글이 손실 구성을 다시 세워야 한다.",
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
};

/**
 * Review 당시 title·learning ownership·source closure의 digest입니다. 본문 구조나
 * 개념 소유권이 바뀌면 topology audit가 stale decision으로 되돌립니다.
 */
export const ARTICLE_TOPOLOGY_FINGERPRINTS: Readonly<Record<string, string>> = {
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
  "ai/dinov3-self-supervised-backbone": "1d4f7adb50ed720a",
  "ai/image-embedding-pipeline": "183b7fb7e57921f8",
  "gpu/datacenter-site-readiness": "07b871983667a242",
  "gpu/server-cpu-lineup-comparison": "f8273f0dacbcd008",
  "gpu/ai-accelerator-vendor-comparison": "a95a27113319cc2f",
  "ai/multi-component-finetuning-vram": "c3f7e981c26b48fc",
  "ai/vision-backbone-selection": "cdd9671993dee419",
  "ai/image-text-contrastive-pretraining": "f5b36610fc8dff17",
  "ai/sam3-promptable-concept-segmentation": "fc7656e7ef8d7e3c",
  "ai/qwen38-flash-next-architecture": "fe506f8b67ff5ddf",
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
};

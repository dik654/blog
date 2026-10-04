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
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "전류·전압을 정의한 뒤 같은 세 저항망의 해를 구하고 원문의 보존 법칙과 에너지 검산까지 잇습니다. 여러 절은 이 한 풀이를 점차 여는 단계입니다.",
    "sharedGate": "6 V·6/3/3 mA와 4.8 V·7.2/2.4/4.8 mA의 갈림길·고리 조건을 대조하고 최초 회로의 72=36+18+18 mW를 검산합니다."
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
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 번의 GPU 실행에 들어갈 후보를 같은 예산5 안에서 고르고 부족한 자원을 되돌리는 경로를 따라갑니다. 공정성과 CPU/GPU 중첩은 이 반복을 여러 번 운영할 때의 별도 측정 조건으로 붙어 있으므로 하나의 스케줄링 문제로 유지합니다.",
    "sharedGate": "실행중출력1·1 뒤남은3을입력12에배정하여상한4라도실제4조각이되는것을검산하고선점재계산·큐재삽입·VTC절대차이한계의 단위를 구분합니다."
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
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "이 글에서는 같은 크기의 두 배열을 더하는 작업 하나를 끝까지 따라갑니다. 번호를 나누는 규칙에서 시작해 실제 명령과 저장 공간에 도달한 뒤, 어느 시간을 측정해야 하는지 판단합니다.",
    "sharedGate": "64개 × 4B × 입력 2개 = 512B이고 출력은 256B입니다. 합계 768B와 37번의 offset 148B를 본문·공식 코드·문제에서 일관되게 추적합니다. stride 8 변형은 최소 249개 원소를 가진 입력에서 32개를 선택합니다."
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
  "devices/pn-junction-and-rectification": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 접합에서 확산과 고정 이온의 전기장이 평형을 만든 뒤 같은 장벽에 세 전압을 거는 단일 경로입니다. 전류식과 방향 비대칭은 이 경로의 계산입니다.",
    "sharedGate": "0/.251 mA/12.03 mA/−1 pA와 47.869배를 검산하고 Shockley의 면적당 성분을 총 단자 전류로 옮기는 면적 조건을 확인합니다."
  },
  "devices/mos-capacitor-and-inversion": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "절연된 전극의 전기장과 실리콘의 전자 공급 경로를 분리해 한 표면의 상태와 전하 수를 구합니다. 소자의 명칭은 구조의 역할을 이해한 뒤 붙입니다.",
    "sharedGate": "C0.3453 pF,Q−0.17265 pC,N1.0776×10⁶,5 nm에서0.6906 pF를 계산하고 정적 반전 전하의 공급 조건을 확인합니다."
  },
  "devices/mosfet-regions-and-transfer": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 채널의 입구·출구 전하가 달라지는 이유에서 시작해 선형식과 포화식의 연결 및 근사 한계까지 따라갑니다. 같은 소자의 영역 비교이므로 하나의 글로 유지합니다.",
    "sharedGate": "0.18/.48/.5/.5 mA,0.8Vov에서96%,게이트2 V의1.125 mA를 검산하고 포화 경계의 고전계 근사 한계를 설명합니다."
  },
  "devices/switching-energy-and-leakage": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 출력의 충전·방전 왕복에서 공급·저장·발열을 맞추고 같은 왕복의 초당 횟수로 평균 전력을 구합니다. 누설은 같은 공급선에서 별도 원인의 항으로 더합니다.",
    "sharedGate": "Q33 pC,공급108.9 pJ,충전·방전 각각54.45 pJ,동적10.89 µW·합14.19 µW,5 pF의5.445 µW를 검산합니다."
  },
  "circuits/resistance-and-power-dissipation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "등가저항으로 전체를 계산한 뒤 원래 연결로 돌아와 개별 발열과 실제 부품 정격을 읽는 한 부품 선택 과정입니다.",
    "sharedGate": "회로를 줄여 전원 7.2 mA를 구한 뒤 세 부품의 전력 합 86.4 mW를 검산하고 Vishay 표준 100 mW·확장 125 mW의 조건을 구분합니다."
  },
  "circuits/storage-elements-and-transients": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "저장 상태가 한 번의 스위치 뒤 어떻게 이어지는지 같은 공급·저항 조건으로 비교합니다. 전압과 전류의 서로 다른 연속성을 비교하려고 두 첫 차수 회로를 한 글에서 다룹니다.",
    "sharedGate": "RC 1 ms의 3.16 V와 RL 1 ms의 3.16 mA, 에너지12.5 µJ, RC 1% 도착4.605 ms를 검산하고 R 두 배의 반대 시간 상수 변화를 설명합니다."
  },
  "circuits/steady-state-and-impedance": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 RC의 시간 파형을 복소 진폭으로 옮겨 한 번 계산하고 실제 파형의 크기와 지연으로 돌아오는 단일 경로입니다.",
    "sharedGate": "ZC=−j1000 Ω, 전체 크기1414 Ω, 전류3.54 mA, 출력3.54 V·−45°·지연0.785 ms를 같은 입력에서 대조합니다."
  },
  "circuits/frequency-shaping-and-bode": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 RC의 주파수 응답식을 여러 속도와 로그 눈금에 반복 적용합니다. 출력점 변경은 같은 분배 법칙에서 통과 방향이 바뀌는 경계를 확인합니다.",
    "sharedGate": "fc159.15 Hz, 0.995/0.707/0.0995, 경계→열 배의 −17.03 dB와 고주파 −20 dB/dec 근사를 구분합니다."
  },
  "circuits/feedback-gain-and-stability": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 음의 되먹임 연결에서 안정된 배율과 변하는 입력의 지연을 함께 판단합니다. 두 극은 별도 주제를 확장하는 대신 직류 해만으로 알 수 없는 경계를 보입니다.",
    "sharedGate": "정적 배율100/11·100/51, 교차78.154·212.590 rad/s, 위상 여유59.282°·27.885°와 단극 비교95.739°를 검산합니다."
  },
  "semiconductors/wafer-and-planar-process": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 단면을 만드는 두 개방 단계가 각각 원자 입구와 전극 자리를 맡는 이유를 추적합니다. 원문 보호 조건과 거리 계산을 같은 단면에서 연결하기 위해 단일 글로 유지합니다.",
    "sharedGate": "104µm·12µm,대안110µm·15µm,큰 접촉창2µm에서정렬3µm를뺀−1µm를검산하고 원문 청구항1(e)의 덮개 보존과 대조합니다."
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
  "business/business-model-cashflow": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "사업 모델을 비교할 때는 매출 이름보다 비용을 먼저 내는 사람, 고객에게서 돈을 받는 시점, 재고·반품·미수금을 떠안는 주체를 추적해야 합니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 200만 원 주문에서 중개 플랫폼은 계약상 수수료만 자기 수익일 수 있습니다."
  },
  "business/shop-unit-economics": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "점포의 손익분기점은 객단가에서 재료·수수료 같은 변동비를 뺀 한 건의 공헌이익으로 고정비를 나눈 결과이며, 점주 노동과 개업비 회수는 별도로 계산해야 합니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 잔당 가격 6천 원에서 재료·포장·결제 2천 원을 빼면 4천 원이 남습니다."
  },
  "business/shop-site-selection": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "입지는 유동인구 숫자 하나가 아니라 예상 방문자·구매전환·객단가·임대료를 같은 시간대와 동일 업종에서 대조하고 그 건물에서 영업이 가능한지 확인하는 선택입니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 하루 1천 명 × 5% 입점 × 40% 구매는 하루 20건입니다."
  },
  "business/shop-fitout-and-opening": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "점포 공사는 임대인의 사용 동의, 업종에 필요한 설비 확인, 범위가 적힌 견적·변경 승인, 공정 검수, 신고와 개업 준비가 이어지는 계약과 현금의 순서입니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 4천만 원 공사에 배기 800만 원이 추가되면 예산과 개업일이 함께 바뀝니다."
  },
  "property/commercial-lease-and-rent": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "상가 임대차의 경제적 본질은 임차인이 일정 기간 공간을 쓰는 대신 고정 현금흐름과 원상복구 의무를 부담하고, 임대인은 공실·수선·보증금 반환 위험을 지는 교환입니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 3천만 원을 맡긴 점주는 3년 뒤 정산 잔액을 청구할 수 있습니다."
  },
  "property/shop-transfer-and-goodwill": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "점포 양도 대금은 시설·재고·고객 관계의 가치와 임대차 지위, 영업 허가·채무 인수 여부가 섞여 보이므로 각각의 소유자와 동의권자, 인도 시점을 분리해야 합니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 3천300만 원을 시설·재고·영업 기회로 나눠 실사합니다."
  },
  "property/shop-closure-and-restoration": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "점포 폐업은 영업 중단, 직원·고객·공급자·세금 채무, 임대차 종료, 시설 철거와 원상복구, 보증금 반환을 서로 다른 상대방과 순서대로 정산하는 과정입니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 3천만 원 보증금에서 실제 채무와 복구액을 확인한 뒤 잔액을 받습니다."
  },
  "business/franchise-incentives": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "가맹본부의 브랜드·매뉴얼·공급망 수입과 가맹점의 매출·임금·월세·로열티를 별도로 그려야 양쪽의 인센티브와 위험 배분을 볼 수 있습니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 월매출 3천만 원의 로열티 5%는 본부 150만 원 수입이면서 점주 비용입니다."
  },
  "property/land-development-residual": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "개발 가능성은 등기상의 소유와 다르며 허가·용적·기반시설·분양가격·금융비용의 조건을 거꾸로 계산한 잔여액이 토지에 지불할 수 있는 값의 상한을 만듭니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 100억 원에서 비용 70억 원과 요구 이익 15억 원을 빼면 15억 원입니다."
  },
  "business/supply-chain-bargaining": {
    "action": "keep",
    "status": "reviewed",
    "rationale": "국제 공급망에서는 각 나라가 다른 단계를 맡아도 제품 규격·브랜드·고객 접점·교체 가능한 공급자를 통제하는 주체가 협상력을 얻으며, 한 나라의 수출액은 그 나라에 남는 부가가치와 다릅니다.",
    "reviewedAt": "2026-10-04",
    "sharedGate": "3절의 가정 금액과 단위가 7절의 경로와 8·9절 원문 적용, 연습문제에서 일치하는지 확인합니다. 최종소비100달러와 조립국출하60달러를 구분하고,60 안의 수입부품40을 빼 국내20달러를 계산합니다."
  },
  "markets/funds-etfs-and-etns": {
    "rationale": "하나의 수치 사례에서 ETF와 ETN은 거래 화면이 비슷해도 손에 쥔 청구권이 다르다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "markets/forwards-and-futures": {
    "rationale": "하나의 수치 사례에서 선물은 미래 가격을 고정하면서 반대편에 같은 크기의 위험을 건넨다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "markets/options-and-asymmetric-payoffs": {
    "rationale": "하나의 수치 사례에서 옵션은 손해를 피할 선택권을 사고 그 값으로 프리미엄을 낸다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "markets/swaps-and-credit-risk": {
    "rationale": "하나의 수치 사례에서 스왑은 서로 다른 조건의 현금흐름을 교환한다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "risk/margin-collateral-and-leverage": {
    "rationale": "하나의 수치 사례에서 담보와 증거금은 최종 손익보다 먼저 현금을 요구한다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "macro/global-capital-and-policy": {
    "rationale": "하나의 수치 사례에서 국가 정책은 국제 자금의 제약을 지나 환율·금리·자산값에 닿는다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "macro/narratives-and-market-regimes": {
    "rationale": "하나의 수치 사례에서 대세는 사람들이 믿는 이야기와 실제 자금 제약이 서로를 바꿀 때 생긴다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "institutions/insurance-risk-pooling": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "보험은 많은 가입자의 보험료를 모아 일부의 약정 손실을 지급하는 위험 풀이고, 가격에는 예상 사고액뿐 아니라 운영비·자본·불확실성이 포함되며 대형 공통 충격은 다시 밖으로 넘겨야 합니다.",
    "sharedGate": "1천 명이 한 해 10만 원씩 내면 총 1억 원입니다(가정). 그해 20명에게 각 300만 원을 지급한다면 총 6천만 원이 나갑니다. 돈의 차이는 4천만 원입니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "institutions/healthcare-payment-systems": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "의료제도는 재원을 누가 모으고 위험을 누가 묶으며 어떤 가격표로 의료기관에 지급하는지를 분리해야 비교할 수 있고, 환자의 진료비 지불액만으로 의료 서비스의 총비용을 알 수 없습니다.",
    "sharedGate": "한 번의 진료에 의료기관이 받는 총액을 10만 원, 환자가 내는 금액을 2만 원, 공동 재원에서 지급하는 금액을 8만 원으로 놓습니다(가정). 이는 특정 국가의 본인부담률이 아닙니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "institutions/how-to-read-a-country": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "국가의 생산·자금·생활·권력·정보를 같은 질문으로 추적하고, 통계의 지역 범위와 시점을 확인한 뒤 이야기를 검증합니다.", "sharedGate": "(가정) 수출 100·수입 중간재 60·외화 부채 30·정부 적자 5의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "infrastructure/electricity-grid-and-power": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "전력 시장은 전기를 생산하는 설비, 같은 순간 수요와 공급을 맞추는 운영자, 송배전망을 소유하는 주체, 요금을 내는 사용자의 장부가 겹칩니다.",
    "sharedGate": "오후 한 시간 동안 한 발전소는 100MWh를 만들 수 있고, 먼 공장으로 보내는 길은 그 시간에 80MWh까지만 통과시킨다고 놓습니다(가정). 공장이 원하는 양은 100MWh입니다. 손실과 다른 이용자는 우선 생략합니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "infrastructure/food-chain-and-prices": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "식품의 소비자가격은 농가 출하 가격에 가공·저장·운송·소매의 비용과 협상력을 더한 결과이며 각 단계의 재고와 폐기 위험이 다릅니다.",
    "sharedGate": "같은 품질의 식품 한 단위가 모두 판매된다고 놓습니다(가정). 농가 출하액 100원에 선별·저장 단계 30원, 운송 단계 20원, 소매 단계 50원이 더해져 소비자가 200원을 냅니다. 세금은 생략하고 추가 금액에는 각 단계의 비용과 이익이 함께 들어 있습니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "infrastructure/water-utility-and-tariffs": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "수도는 취수한 물의 양뿐 아니라 정수·배관·누수·위생 처리와 저소득층 접근을 함께 지불해야 하는 공공 서비스입니다.",
    "sharedGate": "한 해 정수·운영에 60, 배관 교체에 30이 필요하다고 놓습니다(가정). 서비스에 필요한 자원은 합계 90입니다. 정부가 취약 가구를 대신해 요금 10을 내면 가구는 80, 정부는 10을 내서 공급자가 90을 받습니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "infrastructure/transport-access-and-land-value": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "교통 투자는 차량 속도뿐 아니라 사람이 일자리·학교·서비스에 도달하는 범위와 그 이익이 임대료로 이동하는 과정을 함께 바꿉니다.",
    "sharedGate": "통근이 편도 60분에서 35분으로 줄고 한 달에 20일 출근한다고 놓습니다(가정). 편도 절약은 25분, 한 달 편도 합계는 500분입니다. 같은 조건으로 귀가한다면 왕복 합계는 1,000분, 약 16시간 40분입니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "infrastructure/housing-land-and-supply": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "주택 가격과 임대료는 토지 사용권, 인허가, 기반 시설, 건설비, 금융과 지역 일자리 수요가 서로 제약하면서 형성됩니다.",
    "sharedGate": "완성한 집의 예상 판매대금을 10억 원으로 놓습니다(가정). 공사 5억 원, 금융·허가·관련 비용 1억 원, 사업자가 요구하는 정상 이익 1억 원이 필요하면 토지에 지불할 수 있는 금액은 3억 원입니다. 세금과 시간 차이를 이 합계에 반영했다고 단순화합니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "infrastructure/climate-risk-and-exposure": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "홍수·폭염 등 위험을 평가할 때는 자연 현상의 강도, 노출된 사람과 자산, 취약성과 대응 능력을 분리해야 손실과 투자 판단이 가능합니다.",
    "sharedGate": "동일한 홍수가 난 두 지역을 가정합니다. A에는 자산가치 100이 놓여 있고 10%가 손상돼 손실은 10입니다. B에는 자산 300이 있고 20%가 손상돼 손실은 60입니다. 모두 설명용 값이며 단위는 같은 금액 단위입니다(가정). 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "institutions/public-budget-and-taxes": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "공공 예산은 세입·차입으로 모은 돈을 서비스와 이전지출, 투자, 이자에 배분한 약속이며 부담자와 수혜자가 다른 시점과 집단에 걸칩니다.",
    "sharedGate": "세금 80, 새로 빌린 돈 20이 들어온다고 놓습니다(가정). 의료 40, 교육 30, 도로 건설 20, 이자 10을 지급하면 총지출은 100입니다. 기존 빚의 원금 상환과 다른 수입은 없다고 단순화합니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "institutions/education-skills-and-signals": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "교육비 지출은 학습자의 실제 능력 향상, 고용주가 믿는 자격 신호, 직업 연결과 기회 접근에 서로 다른 경로로 영향을 줍니다.",
    "sharedGate": "교육비가 1천만 원이고 취업을 1년 늦추며 그동안 받을 수 있었던 소득이 2천만 원이라고 놓습니다(가정). 교육 뒤 연 임금이 200만 원 높아진다면 학비만 나눠 얻은 5년은 비용의 일부만 회수하는 계산입니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "institutions/media-attention-and-public-belief": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "플랫폼·언론은 정보를 선택·배치하고 관심을 광고주에게 판매하며, 사람의 믿음은 관측 정보뿐 아니라 반복 노출과 신뢰 관계를 통해 바뀝니다.",
    "sharedGate": "게시물 100개 가운데 선택된 10개가 이용자 화면에서 반복 노출된다고 놓습니다(가정). 광고주는 그 화면에서 광고 1천 회 노출을 1만 원에 샀다고도 놓습니다. 실제 플랫폼의 선택 방식이나 단가는 아닙니다. 이 사례를 4절에서 재사용하고 5·6절 원문에 적용했는지 확인합니다."
  },
  "business/shop-daily-operations": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "주문 하나의 기록이 재고·급여·결제 정산에서 누락되는 지점을 찾는 하나의 운영 경로입니다. 개업 시설, 장기 투자회수, 양도·폐업은 기존 정본을 재사용합니다.",
    "sharedGate": "동일한 하루20건×8천원, 재료25=판매20+폐기1+잔여4, 수수료3200원과입금156800원, 근무4시간을 본문·의사코드·문제에서 보존합니다."
  },
  "institutions/population-migration-and-care": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "인구의 출입 장부, 연령 구성, 실제 취업과 돌봄시간을 구분해야 노동·소비·공공서비스의 변화를 읽을 수 있습니다.", "sharedGate": "(가정) 인구 100·출생 2·사망 1·전입 3·전출 2, 20/60/20의 연령 구성, 하루 8시간 중 돌봄 4시간의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "institutions/culture-norms-and-coordination": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "문화의 설명은 국적별 성격 분류가 아니라 공유한 기대·관측·규칙·권리가 실제 협력을 만드는 경로를 확인하는 일입니다.", "sharedGate": "(가정) 가게 10곳×월 2만원, 공동청소비 16만원, 잔액 4만원의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "institutions/evidence-measurement-and-causality": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "측정의 신뢰성, 비교 집단의 적절성, 결과를 일반화할 범위는 서로 다른 질문이며 각각의 근거가 필요합니다.", "sharedGate": "(가정) 각 10가구 A10→8·B10→9kWh/가구·일, 반복측정 8.0·8.1·7.9의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "infrastructure/materials-waste-and-circularity": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "수거율과 실제 회수량, 처리비용과 재원 이전, 재생재료와 새 원료 대체를 구분해야 순환의 효과를 계산할 수 있습니다.", "sharedGate": "(가정) 발생 100kg·수거 80kg·수율 75%·회수 60kg, 처리총비용 12만원·판매수입 6만원의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "gpu/amd-gpu-execution-and-hip": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "이 글은 두 배열의 64개 원소를 더하는 요청을 AMD 장치 안으로 보냅니다. 작업 수는 유지하면서 실행 묶음과 명령, 저장 공간의 차이를 따라갑니다. 공식 구현 두 개를 비교하되 특정 제품의 성능 순위를 만들지는 않습니다.",
    "sharedGate": "64개 × 4B × 입력 2개 = 512B이고 출력은 256B입니다. 합계 768B와 37번의 offset 148B를 본문·공식 코드·문제에서 일관되게 추적합니다. stride 8 변형은 최소 249개 원소를 가진 입력에서 32개를 선택합니다."
  },
  "gpu/hbm-stack-and-memory-requests": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "이 글은 64개 덧셈에 필요한 데이터를 저장 장치에서 가져오는 과정을 따라갑니다. 칩을 쌓는 모습에서 출발해 주소를 받는 제어기와 내부 읽기 동작을 연결합니다. 이어 코드의 접근 순서가 그 길을 어떻게 바꾸는지 계산합니다.",
    "sharedGate": "64개 × 4B × 입력 2개 = 512B이고 출력은 256B입니다. 합계 768B와 37번의 offset 148B를 본문·공식 코드·문제에서 일관되게 추적합니다. stride 8 변형은 최소 249개 원소를 가진 입력에서 32개를 선택합니다."
  },
  "gpu/gpu-memory-hierarchy-and-roofline": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "이 글은 64개 덧셈에 필요한 768바이트를 유지한 채 저장 계층과 접근 간격, 시간당 처리량을 차례로 계산합니다. 계산한 상한과 측정한 성능을 비교합니다. 상한 아래에 있다는 사실만으로 원인을 확정하지는 않습니다.",
    "sharedGate": "64개 × 4B × 입력 2개 = 512B이고 출력은 256B입니다. 합계 768B와 37번의 offset 148B를 본문·공식 코드·문제에서 일관되게 추적합니다. stride 8 변형은 최소 249개 원소를 가진 입력에서 32개를 선택합니다."
  },
  "markets/financial-products-and-claims": {
    "rationale": "하나의 수치 사례에서 금융상품은 누가 언제 무엇을 지급하는지로 구별한다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "markets/securitization-and-tranches": {
    "rationale": "하나의 수치 사례에서 유동화는 대출의 현금흐름을 옮기고 손실을 받는 순서를 나눈다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "banking/repo-and-collateral-funding": {
    "rationale": "하나의 수치 사례에서 레포는 증권을 맡겨 짧은 돈을 구하고 만기마다 다시 연결한다의 지급·조건·한계를 순서대로 추적합니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "층위0의 숫자를 층위4와 원문 적용5·6 및 연습문제에서 같은 단위로 계산하고, 손익·현금시점·국가별 범위를 일치시킵니다.",
    "action": "keep"
  },
  "markets/covered-calls-and-income-funds": {
    "rationale": "100주 보유와 콜 매도의 같은 현금흐름에서 손익 상한·분배 재원·매도 비율을 연속해서 검증하는 한 수업입니다.",
    "reviewedAt": "2026-10-04",
    "status": "implemented",
    "sharedGate": "100주 손익과 주당 그래프가 일치하고 NAV 및 분배금을 더한 총수익, 실제 옵션결제와 19a의 잠정 분류가 같은 계산에 대응해야 합니다.",
    "action": "keep"
  },
  "blockchain/hyperliquid": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "한 주문의 서명·체결·수수료·담보·청산과 Core/EVM/외부 자금 이동을 각각의 기록으로 이어야 실제 결과를 알 수 있습니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "blockchain/robinhood-chain-blob-demand": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "블록별 개수·기간 평균·공급 설정·게시자 기여·자료 전송 비용은 다른 계산이며 가정과 관측을 분리해야 합니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "blockchain/rwa-composition": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "기관 토큰의 가치는 발행된 권리, 같은 시각의 자산과 부채, 이전 자격, 실제 매매·상환 경로를 함께 읽어야 설명됩니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "blockchain/ethereum-future-roadmap": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "연구·EIP 문서 상태·업그레이드 포함 단계·네트워크 활성화는 서로 다른 증거로 판정합니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "blockchain/robinhood-chain-settlement": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "빠른 전송 영수증, Ethereum 자료 확정, 브리지 인출 집행, 토큰의 법적 권리를 별도로 연결합니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "blockchain/glamsterdam-block-execution": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "ePBS의 입찰·공개 책임과 BAL의 거래별 상태 자료를 나누어 같은 블록의 지급 조건·가용성·실행 정확성을 검증합니다.",
    "sharedGate": "동일 사례·수량·상태를 본문, 원문 적용, 코드 주석, 기초6·심화4문제에서 보존합니다."
  },
  "ai/flash-attention-io-aware-kernel": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "ai/fast-weight-memory-and-chunkwise-recurrence": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "ai/expert-parallelism-moe-systems": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "ai/reward-design-for-verifiable-rl": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "ai/world-model-latent-planning": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "crypto/snark-overview": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "Prove에는 공개값 (3,12)와 증인 4가 들어가고 Verify에는 (3,12)와 증거가 들어갑니다."
  },
  "crypto/zk-theory": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "23을 법으로 2의 4제곱은 16이며, 첫 값 12 뒤 질문 2에 응답 7을 보냅니다."
  },
  "crypto/constraint-systems": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "z=(1,3,16,4,12)에서 공개 (3,16), 개인 4, 중간 12를 구분합니다."
  },
  "crypto/polycommit": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "f=X²+2X+3에 위치 4와 답 10, opening 증거를 연결합니다."
  },
  "crypto/fri": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "F17의 16개 위치에서 차수 2는 엄격한 경계 3보다 작습니다."
  },
  "crypto/stark-theory": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "입력 4의 Horner 실행은 1→6→10으로 이어집니다."
  },
  "crypto/nova": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "4배 규칙의 3→12→14에서 둘째 시작은 12여야 하며 11이면 다른 실행입니다."
  },
  "crypto/jolt": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "ADD의 3+4=7은 tracer와 마스크를 적용한 lookup 출력에서 일치합니다."
  },
  "crypto/prover-memory-and-verifier-cost": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 수치 사례를 역할·조건·공식 원문·반례·자원 경계까지 열 단계로 이어 설명하는 하나의 학습 단위입니다.",
    "sharedGate": "256MiB 원본, 두 2GiB 평가표, 512MiB−32B 해시가 겹치면 4.75GiB−32B입니다."
  },
  "blockchain/pq-account": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "하나의0.1 ETH 요청을 검증·nonce·실행·비용·서명 교체와 복구까지 추적합니다. 암호 수학은 새 서명 정본을 재사용합니다.",
    "sharedGate": "동일 요청에서 domain·nonce·서명·호출을 바꿔 검증 실패와 실행 실패를 구분하고 잔액·deposit·nonce·요청 receipt를 함께 대조합니다."
  },
  "crypto/quantum-computing-and-cryptographic-risk": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "진폭의 간섭으로 계산을 설계한다는 원리와 논리·물리 자원의 차이를 알아야 Shor·Grover가 암호에 주는 영향을 판단할 수 있습니다.", "sharedGate": "진폭 0.5 네 개와 15의 주기 4의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "crypto/ml-kem-and-noisy-equations": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "공통 곱의 상쇄로 작은 비트를 복원하고 재암호화로 캡슐을 검증한 뒤, 별도 인증된 프로토콜에서 공유 비밀을 사용합니다.", "sharedGate": "A의 두 행 [2,3]·[4,1], u=[6,5], v=6의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "crypto/post-quantum-signatures": {"action": "keep", "status": "reviewed", "reviewedAt": "2026-10-04", "rationale": "메시지에 결속한 응답을 공개 정보로 재구성하되 마스크·거절·힌트의 조건을 지키며, 해시 기반 서명의 다른 비용과 배포 경계까지 비교합니다.", "sharedGate": "z=[3,3], Az−ct=[6,9]의 숫자와 전제를 본문·그림·문제에서 함께 확인합니다."},
  "crypto/quantum-key-distribution": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "PQC 키 합의·서명과 다른 물리적 키 생성 및 인증 조건을 독립 정본으로 소유합니다.",
    "sharedGate": "12→8→6과 패리티 110·출력시연 01·실제키 0비트를 본문·연습문제·근거 해설에서 함께 대조합니다."
  },
  "ai/agent-memory-lifecycle": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "관측에서 기억 쓰기·읽기·망각·행동 평가까지 같은 기록의 수명주기를 따라갑니다. 추가 MemoryArena 해설은 회상 점수와 실제 후속 행동 성과를 구분하는 기존 질문의 검증 단계입니다.",
    "sharedGate": "동일 관측 기록이 장기 기억으로 채택되는 조건과 다음 행동에 쓰이는 경로를 추적하고, 회상 성공만으로 전체 작업 성공을 주장하지 않습니다."
  },
  "ai/deep-learning-overview": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 구체적 사례의 관측부터 계산, 실제 원문, 적용 경계까지 이어지는 순차 학습 질문을 소유합니다. 기존 핵심 유도와 원문 해설 anchor를 보존했습니다.",
    "sharedGate": "네 입력 (0,0),(0,1),(1,0),(1,1)이 같은 중간 계산으로 0,1,1,0을 내는 수치와 선형 계산의 반례를 대조합니다."
  },
  "ai/supervised-learning-loop": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 구체적 사례의 관측부터 계산, 실제 원문, 적용 경계까지 이어지는 순차 학습 질문을 소유합니다. 기존 핵심 유도와 원문 해설 anchor를 보존했습니다.",
    "sharedGate": "두 행의 손실 0.5·2, 평균 gradient −2.5, θ 1→1.25, 새 손실 0.703125를 본문·원문 대입·문제에서 일치시킵니다."
  },
  "ai/train-validation-test": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 구체적 사례의 관측부터 계산, 실제 원문, 적용 경계까지 이어지는 순차 학습 질문을 소유합니다. 기존 핵심 유도와 원문 해설 anchor를 보존했습니다.",
    "sharedGate": "같은 1,200명의 800/200/200 분리, A·B 선택과 test 44/200, 전처리 평균 10 대 전체 평균 15의 누출 경계를 대조합니다."
  },
  "ai/softmax": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 구체적 사례의 관측부터 계산, 실제 원문, 적용 경계까지 이어지는 순차 학습 질문을 소유합니다. 기존 핵심 유도와 원문 해설 anchor를 보존했습니다.",
    "sharedGate": "같은 logits (ln 2,0)에서 확률 (2/3,1/3), max shift와 T=2·1/2 결과가 본문·수식·실제 Viz 계산에서 일치해야 합니다."
  },
  "ai/agent-loop-foundations": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "화면 폭을 고치는 한 요청의 관측·선택·실행·종료가 연결된 하나의 반복입니다. 용어 절과 원문 절을 갈라 별도 글로 만들면 같은 상태의 변화가 끊깁니다.",
    "sharedGate": "390 px 화면에서 430 px 본문을 390 px로 고치는 세 행동과 다음 선택의 관측 이력을 대조합니다."
  },
  "ai/agent-control-boundaries": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 페이지 수정 작업에서 모델이 고를 수 있는 일과 런타임이 허용하는 일의 경계를 하나의 실행으로 설명합니다.",
    "sharedGate": "여섯 번 탐색·두 검사·대상 파일 하나의 예에서 계획과 실제 파일 변경 권한이 일치하는지 확인합니다."
  },
  "ai/agent-run-contract": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 실행의 시작 조건·중간 기록·검사·종료를 같은 완료 기준으로 연결합니다.",
    "sharedGate": "두 화면 검사와 재시도 두 번의 조건을 따라 실제 관측으로 성공·실패·한도 도달을 구분합니다."
  },
  "ai/agent-plan-replanning": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 의존 계획의 한 단계 실패가 뒤의 작업과 독립 작업에 주는 영향을 한 사례로 추적합니다.",
    "sharedGate": "A→B→C와 독립 D에서 v3→v4 변경 후 무효화되는 결과와 재검사 범위를 원문 기억 갱신 단계와 대조합니다."
  },
  "ai/agent-delegation-contracts": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 위임 요청의 분할·결과 반환·검증·병합을 하나의 완료 책임으로 설명합니다.",
    "sharedGate": "두 작업의 3건·2건에서 겹친 1건을 빼 4건을 얻고 책임자가 반환물과 원래 요구를 대조합니다."
  },
  "ai/agent-verification": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 산출물의 검사에서 통과 개수·평균 점수·종료 기준이 서로 다른 판단을 맡는 이유를 추적합니다.",
    "sharedGate": "26/27 검사와 평균0.7의 의미를 구분하고 자기 보고·환경 관측·평가기의 오류 상관관계를 확인합니다."
  },
  "blockchain/crypto-theory": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 송금 지시를 숨기고 변조를 막아도 두 번 처리할 수 있다는 사례에서 암호 주장과 사용처 처리를 단계적으로 구분합니다.",
    "sharedGate": "7번 지시로 30원을 보낼 때 내용 보호·변조 거부·중복 지시·원자적 사용처 기록이 각각 맡는 조건을 확인합니다."
  },
  "crypto/discrete-log": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 작은 군에서 정방향 거듭제곱을 만든 뒤 원문의 역방향 탐색으로 원래 지수를 찾는 하나의 문제입니다.",
    "sharedGate": "mod17, g3, Y5의 표와 HAC Algorithm3.56에서 작은 걸음·큰 걸음의 교차 및 반환 지수를 검산합니다."
  },
  "blockchain/evm-fundamentals": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "하나의 짧은 바이트코드를 읽고 스택·프로그램 위치·남은 비용을 실제 실행 함수까지 따라갑니다.",
    "sharedGate": "60 02 60 03 01 00이 pc0→2→4→5, gas20→17→14→11, 스택 결과5로 이어지는지 고정 execution-specs 원문과 대조합니다."
  },
  "ai/context-instruction-boundaries": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 이메일의 내용이 고객 정보 전송 제안으로 바뀌는 순간에 문서·권한·현재 조건이 담당하는 검사를 따라갑니다.",
    "sharedGate": "문서1통과 고객100건에서 schema1·authorization0이 전송0건으로 이어지는 경로를 공식 OWASP 방어 항목과 대조합니다."
  },
  "ai/agent-failure-modes-and-recovery": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "결제 한 번의 응답 유실을 같은 업무 키로 확인·재시도·인계하는 경로입니다. 일반 실패 분류는 그 결제 복구에 필요한 판단 근거로 연결됩니다.",
    "sharedGate": "order42·10,000원·pay-42에서 응답없음과 미실행을 구분하고 서버의 키 보존 조건을 지켜 중복20,000원 효과를 방지합니다."
  },
  "ai/tool-calling-lifecycle-and-costs": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "세 도시 조회의 제안·권한 확인·실행·결과 반환을 같은 요청으로 추적하며 시간과 토큰 비용을 각 경계에서 셉니다.",
    "sharedGate": "도시3개·조회각400 ms에서 순차1200/병렬실행400 ms와 입력 부분합2654토큰을 검산하고 전체 지연·최종 요금과 구분합니다."
  },
  "ai/llm-harness": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "PING32개를 만드는 한 요구에서 모델 제안과 결정적 생성·검사·완료 기록의 역할을 연결합니다. 실험 결과는 같은 계약을 어떤 구성으로 달성했는지 설명합니다.",
    "sharedGate": "PING32개·공백31개·총159자를 검사하고 27/27·0/27·135/135의 측정 범위와 인증이 필요한 원문 접근 한계를 구분합니다."
  },
  "blockchain/consensus-mechanisms": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 송금 후보를 만들고 유효성을 검사한 뒤 선택·확정하는 과정에서 공개 참여의 영향력 근거를 비교합니다.",
    "sharedGate": "자원10/20/30/40에서70표의정당화와최종확정을구분하고 PoW 성공확률1/16·기대16회를 별도로 검산합니다."
  },
  "blockchain/bft-theory": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 주문의 상충하는 두 표 묶음이 겹치는지를 세어 안전한 결정과 늦은 통신에서의 진행을 연결합니다.",
    "sharedGate": "n4/f1/q3의정직한교집합과q2반례,2q>n+f및q≤n−f를 대조하고 시간 초과가 안전성 증거를 지우지 않는 이유를 설명합니다."
  },
  "blockchain/node-architecture": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "송금이 든 같은 후보 블록의 자료 확보·실행 검증·체인 선택을 두 클라이언트의 원문 경계까지 따라갑니다.",
    "sharedGate": "100−10−0.000042=89.999958 ETH에서 H101검증과 headH101/safeH99/finalizedH96을구분하며 exact Reth 원문의 SYNCING·VALID 분기를 대조합니다."
  },
  "ai/activation-functions": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "출력의 높이와 뒤로 곱할 기울기를 구별하는 것이 중심 질문입니다. Step·sigmoid·tanh를 입력2와 뒤 변화율3으로 비교해야 불연속·포화·부호를 한 기준으로 판단할 수 있으므로 세 곡선의 기초는 한 글로 유지합니다. 음수 경로와 학습하는 조절 구조는 후속 두 글이 소유합니다.",
    "sharedGate": "입력2·뒤 변화율3에서 sigmoid 출력 .880797·기울기 .104994·앞 변화율 .314981을 구하고 step·tanh와 대조합니다 (가정)."
  },
  "ai/rectifier-activations": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "음수 입력−2의 경로를 닫을지, 작은 고정 기울기를 남길지, 기울기 자체를 학습할지를 이어서 비교합니다. ReLU·Leaky·PReLU의 국소 변화율 문제와 SELU의 조건부 분포 문제를 같은 입력으로 구별해야 함수 이름만 보고 대체하지 않으므로 한 비교 글을 유지합니다.",
    "sharedGate": "입력 (−2,3)·뒤 변화율 (4,4)에서 ReLU, 음수 기울기 .01, SELU의 출력과 변화율을 비교합니다. PReLU에서 입력 gradient .04와 a의 gradient −8을 구별합니다 (가정)."
  },
  "ai/gated-activations": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "조절 비율과 원래 값의 곱, 두 projection 경로의 곱, 마지막 출력 행렬까지 입력(1,−1)이 이어집니다. SiLU 하나를 SwiGLU 전체 구조와 혼동하지 않으려면 scalar 곡선·행렬 shape·3개 행렬의 예산을 함께 읽어야 하므로 이 범위를 한 글로 유지합니다.",
    "sharedGate": "입력 (1,−1), Wg=I, Wv=diag(2,3), Wo=[[1,0],[1,0]]에서 SwiGLU 출력 (2.268941,0)을 같은 원문 식에 대입합니다. 폭2와3의 가중치 수12도 계산합니다 (가정)."
  },
  "ai/optimizers": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 갱신에 어떤 자료의 평균을 넣는지가 중심 질문입니다. 유효 개수2·6을 모으는 과정과 θ3→2.6의 실제 이동을 분리하면 잘못된 분모를 잡아내기 어려워, gradient 추정·누적·SGD 적용·갱신 횟수를 하나의 추적으로 유지합니다. 추가 기억 상태는 후속 optimizer 글이 소유합니다.",
    "sharedGate": "유효 개수2·6, 손실합2·18, gradient합4·28을 공통 분모8로 나눠 loss2.5·gradient4, θ3→2.6을 얻습니다. 각 묶음 평균을 반씩 섞는 잘못된 목표와 대조합니다 (가정)."
  },
  "ai/momentum-optimizer": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "방향이 반전돼도 과거 buffer가 이동을 지속시키는 이유를 세 신호1,1,−1로 설명합니다. 정규화한 EMA와 unnormalized velocity의 계수 차이, Nesterov가 같은 buffer에서 최종 방향을 바꾸는 분기를 함께 확인해야 상태의 단위를 섞지 않으므로 한 글로 유지합니다.",
    "sharedGate": "g=[1,1,−1], β=.9, η=.1, θ0=3, v0=0에서 v=[1,1.9,.71], θ=[2.9,2.71,2.639]를 실제 SGD 원문에 대입합니다 (가정)."
  },
  "ai/adam-optimizer": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "두 신호2,−2가 방향 장부에서 상쇄되고 제곱 장부에는 모두 남는 계산이 전체 질문입니다. 두 raw moment·초기 비중 보정·좌표별 분모를 따로 떼면 작은 역방향 이동 .005263의 원인을 잃으므로 실제 Adam 원문까지 한 글로 유지합니다. 별도 weight decay는 연결 글에서 다룹니다.",
    "sharedGate": "g=[2,−2], β1=.9·β2=.999·η=.1·ε=10⁻⁸에서 첫 m=.2,v=.004와 둘째 m=−.02,v=.007996을 만들고 θ≈2.9→2.9052631584까지 실제 원문과 대조합니다 (가정)."
  },
  "semiconductors/bands-and-doping": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 두 조각에서 움직이는 전하와 고정 이온을 나누고 열평형식·중성 조건으로 수를 맞춥니다. 전도도 한계는 같은 농도에서 이동 능력까지 알아야 하는 이유를 설명하므로 이 계산과 함께 유지합니다.",
    "sharedGate": "n≈10¹⁶,p≈10⁴와 보상 도핑 n≈8×10¹⁵,p≈1.25×10⁴,새 ni10¹³의 p≈10¹⁰을 단위와 근사 조건을 포함해 검산합니다."
  },
  "blockchain/rollup-fundamentals": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "두 송금의 자료 공개·재실행·결과 주장 검사를 같은 상태 변화에서 추적합니다. 묶음 프레임과 결과 루트는 서로 다른 검증 단계이므로 함께 읽어 공개된 자료와 옳은 결과를 혼동하지 않게 합니다.",
    "sharedGate": "A100/B0→90/10→95/5,잘못된A96을 비교하고 프레임0누락·1종료·23+100바이트 및 두 프레임247바이트를 실제 OP specs 조건과 대조합니다."
  },
  "blockchain/stablecoin-overview": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "1달러를 목표로 한 같은 토큰의 시장 매수·직접 상환·준비자산 현금화를 하나의 청구 경로로 연결합니다. 담보형과 알고리즘형 비교는 그 청구가 무엇에 기대는지를 구별하는 한계를 맡습니다.",
    "sharedGate": "1만개를9700에사서1만상환·비용100이면조건부200,장부1만에서현금2000+자산매각3800은상환6000에200부족임을 검산하고 Circle의 직접 상환 자격을 적용합니다."
  },
  "ai/vllm-serving": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "세 생성 요청이 한 실행 예산을 나누며 출력이 끝난 자리를 다음 요청에 내주는 과정을 따라갑니다. 입력 처리·다음 출력·메모리·시간 측정은 이 동일 요청의 서로 다른 경계입니다.",
    "sharedGate": "A/B/C의 입력6/2/3·출력3/2/1,예산4·상한2를 원문 scheduler 필드에 넣고 TTFT45ms·E2E65ms·TPOT10ms와 GPU2×4×1=8을 검산합니다."
  },
  "blockchain/uniswap-v2": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 풀의 입력100이 실제 잔액·수수료 조정·불변식 검사를 통과하는 경로에서 지분·일시 인출·누적 가격까지 같은 저장 상태가 담당하는 역할을 나눕니다. 파생 기능을 별도 소개 없이 섞지 않고 원문 함수의 진입점마다 이 풀의 수치를 적용하므로 구현 단위를 유지합니다.",
    "sharedGate": "정수출력90661089와조정곱을고정core4dd5906·periphery원문으로대조하고 선택적 프로토콜 지분발행 및 동일자산 일시인출의상환올림·시간가중누적의단위를검산합니다."
  },
};

/**
 * Review 당시 title·learning ownership·source closure의 digest입니다. 본문 구조나
 * 개념 소유권이 바뀌면 topology audit가 stale decision으로 되돌립니다.
 */
export const ARTICLE_TOPOLOGY_FINGERPRINTS: Readonly<Record<string, string>> = {
  "blockchain/uniswap-v2": "6ca624f8fa914913",
  "ai/activation-functions": "c6f9a3b966843092",
  "ai/adam-optimizer": "b246a49a4f20c77b",
  "ai/gated-activations": "a86f55c09db0d506",
  "ai/momentum-optimizer": "a4569d55fe8e3fb5",
  "ai/optimizers": "b505625de383d39c",
  "ai/rectifier-activations": "e34376d48f9d220e",
  "ai/vllm-serving": "b96090c59bb5b806",
  "blockchain/rollup-fundamentals": "eb9ef0170efde5b7",
  "blockchain/stablecoin-overview": "c2364153df3233b8",
  "semiconductors/bands-and-doping": "f75aa1683e9970ef",
  "ai/agent-failure-modes-and-recovery": "9e9140ad3ac52646",
  "ai/context-instruction-boundaries": "77fed74fd97f4a8d",
  "ai/llm-harness": "66b6a35cf8234076",
  "ai/tool-calling-lifecycle-and-costs": "a07de9803a7bd5eb",
  "blockchain/bft-theory": "d16a5a5ade30b630",
  "blockchain/consensus-mechanisms": "05fc4f3747778112",
  "blockchain/node-architecture": "2face4a74c90cef2",
  "ai/agent-control-boundaries": "09ac3cdb6f297b06",
  "ai/agent-delegation-contracts": "872b22c7db72ecbb",
  "ai/agent-loop-foundations": "1e9173ac2df460c4",
  "ai/agent-plan-replanning": "066b27b1cff27452",
  "ai/agent-run-contract": "c039f76838539f06",
  "ai/agent-verification": "b9bdcdbbf2efdd95",
  "ai/deep-learning-overview": "4e624eab044f92d0",
  "ai/softmax": "a26b8d6cda0822fb",
  "ai/supervised-learning-loop": "3379216184ac4425",
  "ai/train-validation-test": "2f8d22411ae7df5d",
  "blockchain/crypto-theory": "cf4f2e2ae2a5e979",
  "blockchain/evm-fundamentals": "f44e69161afbdef3",
  "crypto/discrete-log": "3a45605b7fb5946c",
  "institutions/public-budget-and-taxes": "c34329142b861ee1",
  "institutions/media-attention-and-public-belief": "e1368345f124f1ac",
  "institutions/education-skills-and-signals": "9853e5435f8204c1",
  "infrastructure/water-utility-and-tariffs": "574f8404067226e8",
  "infrastructure/transport-access-and-land-value": "4b06f3c15f6a78eb",
  "infrastructure/housing-land-and-supply": "6b0cf4f95ee19f9f",
  "infrastructure/food-chain-and-prices": "6111a66d5c2ceefd",
  "infrastructure/electricity-grid-and-power": "d4901083041053ad",
  "infrastructure/climate-risk-and-exposure": "2dfca89c7ec5bb09",
  "business/business-model-cashflow": "815491a924c31787",
  "business/franchise-incentives": "f8215ec3d57de1ac",
  "business/shop-fitout-and-opening": "79930f0f0473d091",
  "business/shop-site-selection": "c234354d4fbdfc7a",
  "business/shop-unit-economics": "05954906d5d9bf37",
  "business/supply-chain-bargaining": "9ac935b509088b19",
  "institutions/healthcare-payment-systems": "2e1ca0897a7b1151",
  "institutions/how-to-read-a-country": "436b348e745e7179",
  "institutions/insurance-risk-pooling": "930b27098a1a795e",
  "macro/global-capital-and-policy": "c169ae992e741ba4",
  "macro/narratives-and-market-regimes": "9b0ab093e34caa58",
  "markets/forwards-and-futures": "e4db4ba88e33dbbf",
  "markets/funds-etfs-and-etns": "d737fae21c67e16f",
  "markets/options-and-asymmetric-payoffs": "e7ea53156ed34514",
  "markets/swaps-and-credit-risk": "c1add7c3c5db9fb9",
  "property/commercial-lease-and-rent": "985d12575d5f4613",
  "property/land-development-residual": "53cae6351af0bb2b",
  "property/shop-closure-and-restoration": "245f0e685b2d2555",
  "property/shop-transfer-and-goodwill": "6726bfcc1b276675",
  "risk/margin-collateral-and-leverage": "9e95bb842afc2ebf",
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
  "semiconductors/wafer-and-planar-process": "8ef30e6f8c1d03e3",
  "circuits/feedback-gain-and-stability": "2bbfa8da24590edd",
  "circuits/frequency-shaping-and-bode": "57bed2f731a22ee4",
  "circuits/steady-state-and-impedance": "a477754ef165a51d",
  "circuits/storage-elements-and-transients": "2c0ad5c1225fe820",
  "circuits/resistance-and-power-dissipation": "661e59ead0e416e7",
  "devices/switching-energy-and-leakage": "1a7b2d6776e60076",
  "devices/mosfet-regions-and-transfer": "1146b8b2b4c5befe",
  "devices/mos-capacitor-and-inversion": "1e5d35dbab253534",
  "devices/pn-junction-and-rectification": "c083be4ff15f1154",
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
  "gpu/ai-accelerator-vendor-comparison": "f82e89ae427c88c0",
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
  "ai/sionic-glm-b300": "c7eaeef55f28947d",
  "ai/skills-anatomy": "61679abd14267eab",
  "ai/time-features": "36e27f8b4d5ac20f",
  "ai/training-pipeline": "b5b3f8ce59ac29e9",
  "ai/transfer-learning-practice": "2cbdcdc7079650ed",
  "ai/transformer-architecture": "8fc15de1523628d0",
  "ai/tokenizer": "87660ba663da6629",
  "ai/vae": "147d459b37db9ccd",
  "ai/vllm-paged-attention": "7150bf99c717624c",
  "ai/vllm-spec-decode": "4ae6d26832c9fab4",
  "ai/vllm-scheduler": "2bde960d9b11b3a0",
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
  "gpu/cuda-basics": "8da354583dfb4cb2",
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
  "circuits/lumped-circuit-and-conservation": "1dc30f31646ad464",
  "testimony/speeches-were-reconstructed": "f1adf0d6f339adc2",
  "testimony/told-but-not-believed": "f7b915d7d5618ff8",
  "testimony/the-writer-was-there": "e7af6bbec0f76e44",
  "record-numbers/how-the-army-was-counted": "263d90bff79ae71c",
  "record-numbers/what-the-total-cannot-tell": "4a56414aa5294477",
  "record-numbers/numbers-that-command": "068b1440b780d915",
  "inference-from-sources/ruins-mislead": "00e46e35e3fb93b9",
  "inference-from-sources/the-gap-was-made": "6224616aee8d25d8",
  "inference-from-sources/naming-the-past": "58060787a5f1d221",

"ai/agent-memory-lifecycle":"e3bb408c931ea9af",
"ai/expert-parallelism-moe-systems":"1025d7f9fa6ef1a6",
"ai/fast-weight-memory-and-chunkwise-recurrence":"4e73bd16767bf7dc",
"ai/flash-attention-io-aware-kernel":"4bc6b3022c566c1f",
"ai/reward-design-for-verifiable-rl":"b82b3190faa642aa",
"ai/world-model-latent-planning":"2c02ff942e6eb395",
"banking/repo-and-collateral-funding":"ef687e7557d1a2b0",
"blockchain/ethereum-future-roadmap":"1f2bb0357f878321",
"blockchain/glamsterdam-block-execution":"e611a92accbeb7da",
"blockchain/hyperliquid":"19e22f5f577fc95f",
"blockchain/pq-account":"652971c258adb08e",
"blockchain/robinhood-chain-blob-demand":"30c5c236fea938b8",
"blockchain/robinhood-chain-settlement":"2bc832f4a623a363",
"blockchain/rwa-composition":"d7b3622726d50ca4",
"business/shop-daily-operations":"c37c9c2b3a26c9f3",
"crypto/constraint-systems":"180451df5e454382",
"crypto/fri":"ac11504ca83c08d9",
"crypto/jolt":"ce2cf82725d8cb32",
"crypto/ml-kem-and-noisy-equations":"329eb227a458992b",
"crypto/nova":"c77c366b260e6985",
"crypto/polycommit":"5c10899d100ec9d1",
"crypto/post-quantum-signatures":"bbd9a75525a1bc9e",
"crypto/prover-memory-and-verifier-cost":"268bbd7ee27658e6",
"crypto/quantum-computing-and-cryptographic-risk":"fdb29244df1b5b98",
"crypto/quantum-key-distribution":"94d23fc15a99243c",
"crypto/snark-overview":"961154e8537ab05f",
"crypto/stark-theory":"544cd9e5420b7914",
"crypto/zk-theory":"d8c8dd6527fe6308",
"gpu/amd-gpu-execution-and-hip":"29a76da9f5ac7b19",
"gpu/gpu-memory-hierarchy-and-roofline":"6e8c4486d9c5d116",
"gpu/hbm-stack-and-memory-requests":"13fdf060d2284abf",
"infrastructure/materials-waste-and-circularity":"89730ed273657bf2",
"institutions/culture-norms-and-coordination":"588ebc2e3eeb88e7",
"institutions/evidence-measurement-and-causality":"e4ce1a8e47b8197d",
"institutions/population-migration-and-care":"ca6733d2216266b0",
"markets/covered-calls-and-income-funds":"b3bf1d0cf748a674",
"markets/financial-products-and-claims":"a2c324243fb9fcee",
"markets/securitization-and-tranches":"112869ad29851ed5",
};

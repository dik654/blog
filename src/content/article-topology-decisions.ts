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
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "요청의KV기록이35→38→49로늘고앞32개를다른요청과공유하는상태를추적합니다. 주소표·추가할당·참조수·hash제거·커널읽기는같은기록의수명과유효성을맞추는역할이므로한글에서원문까지연결합니다.",
    "sharedGate": "block16에서3→3→4개,position37은block2/offset5,공유앞32·tailCoW와ref2→1→0을실제v0.27.1코드의partial-hit확장및해제경계와대조합니다."
  },
  "ai/vllm-spec-decode": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 네 후보가 확률 보정·점수 index·출력과 유효 KV·시간 비용을 통과하는 한 generation cycle을 설명합니다. MTP·EAGLE 구조의 상세는 변형 정본으로 이어가며 이 글은 동일 검증 계약에 필요한 차이를 설명합니다.",
    "sharedGate": "p(.7,.3)/q(.4,.6),후보ABBA·비교값.6/.4/.8/.2·결과ABA와A2/Y 3,history 4→7·computed 3→8→6 및E[Y]2.7731·시간비 1.848733/.840333을 6+4·본문·5장면에 맞춥니다. pinned 전체 5소스와 11패널,5식,390/1440 및 actual TS와 source byte 동일성을 확인합니다."
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
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "실제본문의64개사례와S→B→0…7흐름을확인하고역할표·원문근거·관측경계만보강했습니다. 64개·thread37·lane5·주소148B·유효768B. CC6.0+sector범위와원본50000/256설정을분리.",
    "sharedGate": "기초6·심화4답anchor대조,고정원문SHA,28수치검산,390/1440코드패널및화면실제검수.실측성능을주장하지않습니다."
  },
  "gpu/gpu-arch-hopper": KEEP("TMA·cluster·precision feature를 같은 Hopper compatibility gate 아래 비교하는 generation overview입니다."),
  "gpu/cuda-persistent-kernels": KEEP("Persistent thread 정의→work queue 계약→static/dynamic 배분→release gate가 하나의 device-side scheduling 학습 단위입니다. CUTLASS tile scheduler는 이 정의의 구체 사례로만 링크하며 별도 prerequisite로 만들지 않아 순환을 피합니다."),
  "gpu/cuda-register-pressure": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "보존할값의수요가배치상한과spill경로및실제시간으로이어지는하나의질문입니다.",
    "sharedGate": "같은37/128·320의1280예약·12/4blocks·75/62.5%를본문·Viz·원문대입·문제에서맞추고,96/256·spill바이트·tail분모를독립계산합니다.",
    "targetRoutes": [
      "gpu/cuda-register-pressure"
    ]
  },
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
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 연결 창을 빛으로 기록하고 아래 층에 옮기는 과정에서 크기와 상대 위치를 별도로 검사합니다. 같은 창을 유지해야 CD와 오버레이를 혼동하는 이유와 한계가 드러나므로 한 글로 유지합니다.",
    "sharedGate": "CD96.5·72.375·48.25nm과 정렬여유40/10/−10nm을 검산하고 ASML공식Rayleigh식과 두 층 정렬 정의에 같은 값을 적용합니다."
  },
  "semiconductors/doping-and-thermal-budget": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 원자 분포를 두 번 가열하여 누적 열 예산·폭·깊이별 농도·접합 깊이를 연결합니다. 공급을 유지하는 비교도 같은 경계 조건을 바꿔 무엇을 다시 계산해야 하는지 보여 줍니다.",
    "sharedGate": "B1=3.6e−11,B2=7.2e−11cm²,a120→207.846nm,표면0.57735·240nm깊이0.0183→0.1522·접합257.516→418.585nm를 검산합니다."
  },
  "semiconductors/interconnect-and-rc-delay": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 출력이 시작·끝 용량을 충전하는 두 경로에서 원문의π식과 저항별 합을 비교합니다. 길이·재료 변화는 동일 회로의 항별 민감도이므로 함께 읽어 전체 지연과 한 항의 제곱 증가를 구별합니다.",
    "sharedGate": "25+49=60+14=74ps,무배선10ps,길이2배158ps,저항만69.8·용량만44·둘다41.3ps와 단일극50%시간6.931ps를 검산합니다."
  },
  "semiconductors/yield-defect-and-packaging": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "동일1000개후보에서결함0개확률과뒤단계조건부비율을연결합니다. 면적·밀도변경은첫확률의민감도이며패키지시험은분모가바뀌는지점을보여주므로단일수율흐름으로유지합니다.",
    "sharedGate": "e−0.1=0.904837,면적4의0.67032·밀도0.2의0.818731,기댓값904.837→886.741을 검산하고P(A)P(B|A)의분모를대조합니다."
  },
  "embedded/mcu-memory-map-and-registers": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "주소와 값의 역할, 값 준비·핀 기능·출력 허용의 독립 조건을 먼저 그린 뒤 실제 SDK 함수에 gpio5를 대입합니다. CTRL override를 모두 보존한다는 오해를 고치고 SET/CLR의 한계와 SIO 원자 별칭 예외를 설명했습니다.",
    "sharedGate": "0x20 및 세 SIO 주소·CTRL주소를 검산하고 두 SET 쓰기의0x61과 전체 덮어쓰기 손실을 비교했습니다."
  },
  "embedded/interrupts-and-latency-budget": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "핀 쪽 사건과 NVIC pending을 별도로 그리고 같은 사건을 소거→콜백→일반 작업으로 추적합니다. SDK가 콜백 전에 소거하는 사실과 이중 소거의 새 에지 손실 가능성을 교정했습니다. ISR 카운터로 합쳐진 사건을 복원할 수 없는 한계와 관측 최댓값/보장 상한도 구별했습니다.",
    "sharedGate": "정수몫2/8=0,8<<(4*2)=0x800; ISR73·읽기113·완료493·여유507, 대기600에서1053·초과53을 검산했습니다."
  },
  "embedded/timers-and-sampling": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "정한 목표 시각과 실제 변환 시각을 나누고 aliasing의 두 입력을 같은 샘플에 대응했습니다. 실제 time.c의 부호 분기와 adc_read의 START_ONCE→READY→result에 같은 사례를 넣었습니다.",
    "sharedGate": "10 ms 간격, 중심1.65 V·진폭1 V의30/70 Hz가 같은 이상 샘플을 만듭니다. 목표10000 µs·시작10400·종료10420에서 다음 목표20000/20420을 비교합니다. PicoSDK2.2.0 a1438dff time.c500–509·171–191, adc.h175–182와 RP2040§4.6·4.9; 고정 원문3파일 및 LICENSE 동일. cos12값·전압6값·시각9계산·원문SHA4 동일 가정 수치와 실제 보드 실행은 구분합니다."
  },
  "embedded/serial-buses-and-tradeoffs": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "요청·응답 역할을 먼저 그리고 실제 i2c_write/read의 nostop·restart_on_next·STOP·반환 길이1/4를 따라갑니다. 측정 주기 안의 상승 시간을 중복 가산하던 경계를 바로잡았습니다.",
    "sharedGate": "7비트 센서0x48의 위치0x10에서12/34/56/78을 받는 가정. 주소W90/R91,7묶음63클록,400kHz157.5us,추가스트레칭200→357.5us. NXP UM10204Rev7§3.1.6·3.1.10그림13과 PicoSDK a1438dff i2c.c133–164·218–246·287–315·338–345. 고정원문2파일+LICENSE 동일. 주소비트·클록시간·SPI40us·UART347.2us·쓰기/읽기분기검산 가정 수치와 실제 보드 실행은 구분합니다."
  },
  "embedded/scheduling-and-real-time": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "작업 준비·실행·완료를 먼저 그리고 실제 준비 목록 선택과 절대 목표 계산에 대입했습니다. CPU 실행C와 대기 포함 응답R을 구분하고 우선순위 상속이 남은2ms를 없애지 않는 이유를 설명했습니다.",
    "sharedGate": "한 코어 제어C1/P5/prio3·센서C2/P10/D4/prio2·로그C3/P50/prio1. CPU46%,센서완료3/5ms. 이전목표0/현재3 또는12/증분10. FreeRTOSV11.2.0 commit0adc196d tasks.c194–209·2385–2428·6652–6690, 헤더·MIT라이선스 원본3개 SHA 동일. 실보드 벤치마크/전원차단 실행아님."
  },
  "embedded/firmware-update-and-recovery": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "시험 요청·실제 기능 검사·확정·재시작을 분리했습니다. 실제 MCUboot 상태 표와 pending/confirmed·boot_set_next 및 진행 복원에 같은 v1/v2를 대입했습니다. 기대 해시 신뢰,키 보호,보안 카운터와 복귀 충돌을 보강했습니다.",
    "sharedGate": "가정4MiB4096KiB=256+1536+1536+768. v1보존·v2TEST·미확정REVERT/확정NONE. scratch조각 v2보관→v1이동→v2배치. MCUbootv2.2.0 commit2d61c318 bootutil_public.c105–150·523–570·684–698·729–743,swap_scratch.c50–122·618–778;헤더·설계문서·Apache라이선스 원본5개 SHA 동일. 실보드 벤치마크/전원차단 실행아님."
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
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "실제본문의64개사례와S→B→0…7흐름을확인하고역할표·원문근거·관측경계만보강했습니다. 64개·CDNAwave64·lane37·주소148B. HIP7warpSize32/64근거,CDNA4LDS160KB와원본1024×1024를대조.",
    "sharedGate": "기초6·심화4답anchor대조,고정원문SHA,28수치검산,390/1440코드패널및화면실제검수.실측성능을주장하지않습니다."
  },
  "gpu/hbm-stack-and-memory-requests": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "실제본문의64개사례와S→B→0…7흐름을확인하고역할표·원문근거·관측경계만보강했습니다. HBM3 16×64bit·HBM4 32×64bit, 가정1.024/2.048TB/s·.75ns물량비율.적층높이와데이터폭분리.",
    "sharedGate": "기초6·심화4답anchor대조,고정원문SHA,28수치검산,390/1440코드패널및화면실제검수.실측성능을주장하지않습니다."
  },
  "gpu/gpu-memory-hierarchy-and-roofline": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "실제본문의64개사례와S→B→0…7흐름을확인하고역할표·원문근거·관측경계만보강했습니다. 1/12FLOP/B·83.3GFLOP/s·.768ns물량비율·500KB진행중량.2009Roofline실제논문링크교정 및DRAM경계명시.",
    "sharedGate": "기초6·심화4답anchor대조,고정원문SHA,28수치검산,390/1440코드패널및화면실제검수.실측성능을주장하지않습니다."
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
    "rationale": "두 주소가 같은 2×2 기억을 공유해 간섭하는 사례가 차이 갱신, 그 순서 의존성과 chunk 병렬화, 독립 erase/write를 차례로 요구합니다. 서로 다른 기억 체계의 개론으로 넓히지 않고 같은 행렬의 쓰기·다시 읽기를 원문 끝까지 보존합니다.",
    "sharedGate": "M [[2,0],[1.8,2.4]], k1 (1,0), k2 (.6,.8) → 읽기 (2,1.8)/(1.2,3); 목표 (5,0) 수정 후 k2 (3,1.92); b (.25,1), w (.5,1) → (4,1.35); erase 0 → (7,1.8). 원문 TRANSPOSE_STATE=True와 정규화/scale 조건 고정.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "ai/expert-parallelism-moe-systems": {
    "action": "keep",
    "status": "reviewed",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 숫자 사례의 입력·상태·계산·공식 구현·실패 조건이 하나의 질문을 이룹니다. 최신 결과는 해당 원리를 확장하는 비교 절에 연결했습니다.",
    "sharedGate": "본문 사례를 같은 단위와 축으로 재계산하고, 공식 원문과 코드의 버전·가정·측정 범위를 일치시켜야 합니다."
  },
  "ai/reward-design-for-verifiable-rl": {
    "rationale": "정답 40·오답 60개의 고정 표가 자동 보상의 오류, 검사 빈도와 대상, 실제 학습 신호와 평가 분모를 묶습니다. 작은 원문 형식 함수에 오답 3을 넣어 통과 1을 확인하고 과정 oracle의 적용 범위까지 따져 하나의 보상 설계 질문으로 유지합니다.",
    "sharedGate": "TP 38, FP 12, FN 2, TN 48 → 통과 50%, 정답 40%, precision 76%, recall 95%; [0,0,1,1] 중심화 ±.5; potential 차이 합 0; 고정 format_reward에 형식 준수 오답 3 → 1, 태그 없는 3 → 0.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "ai/world-model-latent-planning": {
    "rationale": "하나의 이동 사례에서 예측·후보 선택·실행·재관측을 분리해야 잠재 표현 오차와 목표 도달을 혼동하지 않습니다. encoder 붕괴와 먼 목표의 한계도 같은 후보의 비교 가능성을 묻는 경계라 같은 글에 유지합니다.",
    "sharedGate": "가정 x 0, 목표 2, H 2, K 1의 4후보 비용 16/4/4/0; 실제 .8 재관측 후 10.24/1.44/1.44/.64, 눈감고 2행동은 1.6으로 예측 2와 .4 차이. LeWM 원문 sum 축·CEM 평균 (1,0)·부록 D의 H 5block/25환경 timestep 전체 실행 조건과 대조.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
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
  "ai/reverse-mode-autodiff": {
    "action": "keep",
    "rationale": "a=6이 제곱과 덧셈의 두 사용처로 갈라졌다가12+1로 합쳐지는 계산을 중심으로 graph·tape·VJP를 연결합니다. 저장해야 할 값과 실제 입력별 backward 반환값을 분리하면26과39의 소유권을 놓치므로 같은 글에서 원문까지 추적합니다. 신경망 손실과 행렬 batch 유도는 연결된 backprop 글이 맡습니다.",
    "sharedGate": "가정 w3,x2,b0→a6→L42, dL/da13, dL/dw26·dx39·db13; 공식 코드 반환 순서(input,weight,bias)는(39,26,13). 원문162–202행과수치차분26.004 및 중앙차분을 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "ai/backprop-optimization": {
    "rationale": "두 선택지의 한 오차에서 공유 가중치·bias·자료별 입력으로 gradient가 갈라지는 하나의 계산을 소유합니다. 출력 신호 p−y와 선형 층의 합산 축을 나누면 같은 사례의 반쪽만 확인하므로 원 논문과 코드의 전치까지 함께 읽습니다. 기록 관리와 fan-out 엔진은 autodiff 글로 연결합니다.",
    "sharedGate": "가정 X(1,2),W[[ln2,0],[0,0]],target(0,1)→p(2/3,1/3),Lln3,G(2/3,−2/3),dW[[2/3,−2/3],[4/3,−4/3]],dbG,dX((2/3)ln2,0). 8변수 중앙차분·중복 batch 합/평균·공식 weight 전치와 원문식(6)(7)을 같이 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "blockchain/aave-v3": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "풀의가용자금과한차입자의담보·부채를함께추적하여인출가능성과상환안전성을구별합니다. 같은계수·시점에서이자·HF·실제청산한도를계산해야하므로원문함수마다동일계정을대응시키는글로유지합니다.",
    "sharedGate": "풀10000중부채8000의사용률80%,C담보10000/부채7000→담보8000의HF0.914와고정원문의공급내림·부채올림·80%분기·0.95청산조건을검산합니다."
  },
  "ai/architecture-decision-records": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "200개 프로필에서 하나만 복구하는 저장 선택을 같은 기준으로 비교하고 작업자가1→4로 바뀐 뒤의 대체 결정을 추적합니다. 선택 내용·구현 상태·이력 연결을 나누어 같은 결정을 검증하는 글로 유지합니다.",
    "sharedGate": "A한개변경/나머지199개유지,작업자1→4에서ADR005를006으로대체하는조건을원문의Context/Decision/Status/Consequences에대응합니다."
  },
  "ai/agent-changelog-evidence": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "12개기록을잃게하던수정을4개검사로확인하고Unreleased에서실제버전공개까지같은항목을따라갑니다. 사용자영향·검증·공개시점을구별해야같은변경을과장하지않으므로한글로유지합니다.",
    "sharedGate": "입력0/5/12/명시삭제0의네결과와run1842를원문의Fixed/Unreleased→v1.4.0에연결하며검사성공과배포완료를구별합니다."
  },
  "ai/engineering-lessons-ledger": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "기록12개손실사건에서한개행동규칙을추출하고적용범위·삭제예외·검사를같은네경우로확인합니다. 사건보고와앞으로따를규칙의구별이재사용판단에필요하므로같은글에둡니다.",
    "sharedGate": "0/5/12/명시삭제0의검사4개와사건postmortem021·run1842를연결하여잠정규칙의승격/재검토조건과비난없는원문postmortem원칙을대조합니다."
  },
  "ai/math-functions-composition": {
    "rationale": "입력 하나가 두 규칙을 지나 결과를 만드는 한 경로에서 함수의 대응, 정의역과 공역, 합성을 차례로 설명합니다. 같은 2→7→49 사례의 연결 가능성과 역순 13을 함께 판단해야 순서와 허용 범위가 결합된다는 질문에 답할 수 있어 한 글로 유지합니다.",
    "sharedGate": "g(x)=3x+1, f(u)=u²에서 2→7→49와 역순 2→4→13을 계산합니다. 공역 ℝ와 치역 [0,∞)를 구별하고, 같은 교재 정의에 x=2를 대입합니다. 결합법칙의 h→g→f 순서, 길이 3 벡터와 실수 하나의 불일치, 외부 상태를 포함하지 않은 입력의 한계를 함께 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "blockchain/aa-fundamentals": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "USDC 40개를 보내는 한 요청에서 임시 열쇠 권한, 요청 전달, 공통 검증, 대납 비용, 실제 실행을 함께 따라가야 각 역할의 차이가 드러납니다. ERC-4337과 EIP-7702 비교도 같은 요청의 처리 경로와 코드 연결을 구분하는 데 필요한 범위로 유지합니다. 양자내성 서명 구현의 별도 심화는 pq-account 글로 연결합니다.",
    "sharedGate": "Alice의 USDC 200→160, Bob의 0→40, 한도 100→남은 60, nonce 7→8, 대납 예치금 0.01→0.009를 본문·그림·의사코드·문제에서 대조합니다. 다섯 gas 항 합계 150,000과 예약 0.003·청구 0.001·환급 0.002를 산술 검산했습니다. 고정한 실제 Solidity에서 검증·nonce·실행·환급 위치를 대조하되 session 정책은 원본 구현에 포함되지 않은 가정이며 실제 배포·송금 검증은 아닙니다."
  },
  "blockchain/eip4844-blob-fee": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "사용량을 다음 초과분으로 바꾸고 그 기록을 정수 가격에 넣는 두 계산은 한 경로입니다. 이를 분리하면 초과분을 요금이나 대기 파일 수로 오해하기 쉬우므로 한 글에서 이어 설명합니다. 기존 2·5·3 사례와 현재 설정의 추가 분기 비교를 유지하면서 체인별 실제 수요 분석은 별도 글로 연결합니다.",
    "sharedGate": "역사적 E=2,U=5,T=3의 결과 4와 실제 단위 524,288을 본문·식·그림·문제에서 대조합니다. 별도 작은 가격 설정 f=1,n=4,d=2의 결과 6, BPO2 E=2,U=18,target=14,max=21의 두 결과 6·8을 검산했습니다. 고정한 Go 원본 fakeExponential 함수는 여섯 입력으로 실제 로컬 실행했으며 전체 노드·메인넷 블록 또는 수요 측정으로 확대하지 않습니다."
  },
  "ai/harness-failure-ablation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "문서 안내 변경 하나의 전후 효과와 기존 성공 회귀를 함께 판정하는 하나의 실험입니다. 실패 분류·전후 비교·원문 ablation·한계를 나누면 개선과 채택 조건을 연결하기 어렵습니다. 용어와 식은 이 한 실험에 필요한 역할만 설명합니다.",
    "sharedGate": "대상 12개 성공 3→9, Δ=0.50=50%p와 기존 성공 20개 중 회귀 1개=5%, 허용 τ=0, G=0이 본문·식·문제에서 같아야 합니다."
  },
  "ai/model-selection-bias": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "세 후보 중 관측 최고값을 고르는 한 동작을 직관·기대값 유도·한계로 올리는 글입니다. 독립 두 후보 모형은 같은 최고값 선택이 반복에서 만드는 효과를 계산하는 심화이며 별개 기법 소개가 아닙니다.",
    "sharedGate": "A/B/C 실제 평균 0.70, 관측 0.69/0.74/0.71, B 선택과 차이 0.04를 고정합니다. 독립 두 후보 ±0.04 심화의 네 최고값 0.66/0.74/0.74/0.74, 평균 0.72와 편향 0.02를 한 시행 보장으로 바꾸지 않습니다."
  },
  "ai/paired-experiment-design": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 다섯 fold에서 표현 변경 한 축의 차이를 구하고 사전 비용 조건으로 채택하는 하나의 비교입니다. 가설·paired 차이·공식 코드·의존성 경계가 그 판단에 함께 필요합니다.",
    "sharedGate": "기존 [0.700,0.720,0.680,0.710,0.690], 새 [0.706,0.724,0.679,0.715,0.693], 차이 합 0.017·평균 0.0034를 맞춥니다. 지연 100→118ms=18%가 상한10%를 넘어 거절함을 유지합니다."
  },
  "ai/competition-baseline": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "다섯 행의 분할에서 OOF 예측·집계·제출을 연결하는 하나의 실행 경로입니다. 예측 개수만으로 누락과 중복을 못 찾는 문제에서 시작해 같은 행 ID와 결과 파일을 끝까지 검증하므로 함께 유지합니다.",
    "sharedGate": "잘못된 coverage [1,1,0,2,1]과 교정 [1,1,1,1,1], Brier 합0.34/5=0.068, fold평균0.0675의 차이, 제출순서[t2,t1]을 본문·식·문제에서 일치시킵니다."
  },
  "ai/cross-validation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "배포의 새 대상과 평균 단위를 정하는 한 평가 질문입니다. 환자 분리 자체의 구현은 후속 grouped 글로 연결하고 여기서는 같은 C/D 예측을 어떻게 집계하는지와 위험의 의미를 잇습니다.",
    "sharedGate": "A/B/C/D 행수2/2/3/1, 학습 A/B·평가 C/D, 평가 손실[0,0,0,1], 행평균0.25와 환자평균0.50을 본문·식·문제에서 유지합니다."
  },
  "ai/grouped-validation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "대상을 통째로 분리하는 단일 메커니즘에서 집합 검사와 독립에 가까운 근거 수를 함께 설명합니다. 분리 조건의 검증과 결과의 근거 크기를 떼면 행수만으로 평가 강도를 과신할 수 있어 함께 유지합니다.",
    "sharedGate": "A/B 학습과 C/D 평가의 교집합 공집합, C 한 행 이동 시 교집합{C}, 평가4행·고유2명, 별도 규모20×5000=100000행·20명을 구별합니다."
  },
  "ai/walk-forward-validation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 사건의 정답이 관찰 종료와 보고를 거쳐 학습 가능해지는 시간 경로입니다. gap/purge/창 정책은 이 경로를 실제 분할기에 적용할 때의 경계를 설명하며 독립 주제를 나열하지 않습니다.",
    "sharedGate": "UTC 2026-10-25+30일=11-24, +7일=12-01, 엄격한 이전 조건에서11-01·12-01동률 제외·12-02통과를 고정합니다. gap37표본과37일을 혼동하지 않습니다."
  },
  "ai/fold-local-validation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "네 숫자에서 평균을 배우고 평가에 적용하는 단일 전처리 경계입니다. 저장상태·원문 API·행 배정·최종 refit의 경계를 나누면 같은 평균이 언제 누수인지 설명이 끊기므로 함께 유지합니다.",
    "sharedGate": "학습[2,4] 평균3·ddof0분산1·평가[8,10]→[5,7], 잘못된 전체fit평균6·분산10·변환[0.63246,1.26491]을 맞춥니다. 선택뒤 독립평가를닫은 refit은 다른 단계임을 유지합니다."
  },
  "ai/competition-workflow": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 방문의 예측 행과 입력 시각·미래 정답·지표·평가 역할을 고정하는 하나의 정의입니다. 개별 metric이나 split 기법은 후속 글 소유로 두고 여기서는 무엇을 평가할지의 전제만 연결합니다.",
    "sharedGate": "UTC2026-04-16 10:00부터 열린시작·닫힌끝24시간창, 다음날09:00사건 y1, 09:00측정·10:05도착값 입력제외, 다음날08:00미완결을 음성으로 확정하지 않는 조건을 맞춥니다."
  },
  "ai/math-functions-derivatives-gradients": {
    "rationale": "하나의 실수 입력 변화가 계산 결과로 전달되는 비율을 구하는 질문입니다. 제곱 함수의 같은 변화 기록에서 평균 비율, 한 점의 극한, 직선 예측을 차례로 만들고 그 제곱을 앞 글의 연결에 넣어 연쇄법칙을 확장합니다. 마지막 모서리 사례는 이 비율이 존재하지 않을 때의 경계이며, 다변수와 최적화의 독립 문제는 다음 정본 글로 넘깁니다.",
    "sharedGate": "제곱 함수의 x=3에서 h=1/.1/.01 및 음수 간격의 차분몫을 계산해 6으로 모이는지 확인합니다. 2→7→49에 Δx=.01을 넣어 예측 .42와 실제 .4209의 오차 .0009를 검산합니다. Δu=0에서도 나눗셈 없는 증명을 유지하고, 분기 합산 7과 ReLU 부분기울기 [0,1]의 PyTorch 선택 0을 구별합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "crypto/diffie-hellman": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 8·19 교환에서 공유값 2를 얻는 정확성과 상대 인증·입력 검사·KDF·비밀 폐기의 필요성을 차례로 연결하므로 한 글로 유지합니다.",
    "sharedGate": "p=23의 6·15→8·19→2와 중간자 공유값 6·15를 검산합니다. 원문 식과 RFC 벡터를 대조하고 Node24.13.0/OpenSSL3.5.4에서 X25519·HKDF 시험값을 실행했으며 실제 통신 인증·비밀 폐기 검증으로 확대하지 않습니다."
  },
  "crypto/elgamal": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "메시지 10을 (17,5)로 가리고 복원하는 같은 사례에 원문 역원 계산과 변조·난수 재사용·메시지 공간 반례를 적용하므로 한 글로 유지합니다.",
    "sharedGate": "17⁶=12, 역원2, 복호10, 변조20, 재사용 비율5로 메시지4 복원, 암호문 곱(9,5)의 복호17을 mod23으로 검산합니다. 제곱 값 목록으로10·4가 구별됨을 확인하며 안전한 매개변수나 실제 배포의 증명으로 읽지 않습니다."
  },
  "ai/math-gradients-jacobians": {
    "rationale": "여러 입력의 작은 변화가 결과로 얼마나 전달되는지를 묻는 하나의 학습 경로입니다. 결과 하나의 좌표별 비율을 모아 방향을 비교한 뒤, 결과가 둘일 때 같은 관계를 행으로 쌓습니다. 좌표 단위, JVP와 VJP의 방향, 축별 미분만으로 부족한 반례를 함께 확인해야 이 변화 표를 올바르게 사용할 수 있어 한 글로 유지합니다.",
    "sharedGate": "f=x²+3y의 (2,−1)에서 비율 4와 3, 단위 방향 변화율 4.8과 최대 5를 계산합니다. F=(x+y,xy)의 (2,3)에서 Jv=(−.01,−.01), 실제 둘째 변화 −.0102, w=(2,−1)의 VJP=(−1,0)을 검산합니다. 실제 등고선 식과 원문 행 방향, 좌표 100배 재표기의 .04, 축별 미분 반례를 함께 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "ai/oof-risk-estimation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "평가에서 제외한 행의 예측을 모아 집계하고 그 점수가 어떤 모델을 평가하는지까지 잇는 하나의 경로입니다. 분할 기법 자체는 선행 글에 맡기고 집계와 추정 대상의 연결을 유지합니다.",
    "sharedGate": "20행과 80행의 평균을 다시 모아 0.36을 구하고 최종 모델과 지표의 경계를 구별합니다. 본문·수식·문제는 등록 fixture와 일치해야 하며 원문 또는 구현의 별도 전제도 유지합니다."
  },
  "ai/validation-feedback-audit": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "다섯 후보의 두 점수표를 비교해 어떤 변경을 했는지 추적하는 한 감사 과정입니다. 지표 구현 검사와 방향 비교, 적응 기록을 함께 두어 값 차이를 곧바로 분포 차이로 단정하지 않게 합니다.",
    "sharedGate": "후보 다섯 개의 두 점수표에서 값의 차이와 8/10 방향 일치를 따로 계산합니다. 본문·수식·문제는 등록 fixture와 일치해야 하며 원문 또는 구현의 별도 전제도 유지합니다."
  },
  "ai/competition-submission-control": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 후보 선택에서 전송·관측·변경·동결·최종 파일을 연결하는 한 운영 과정입니다. 통계적 보장과 구별하면서 끝까지 같은 B 후보를 추적합니다.",
    "sharedGate": "전송 네 번과 선택 변경 두 번을 나누고 동결된 B의 최종 제출 경로를 보존합니다. 본문·수식·문제는 등록 fixture와 일치해야 하며 원문 또는 구현의 별도 전제도 유지합니다."
  },
  "ai/experiment-tracking": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "결과에서 입력까지 역추적하는 한 경로에서 실행 정체와 파일 정체가 모두 필요합니다. 반복 실행을 분리하지 않거나 바이트를 구별하지 않으면 같은 경로가 끊기므로 함께 유지합니다.",
    "sharedGate": "실패 A1과 성공 A2, 같은 평균 0.50인 서로 다른 두 예측 파일을 구별합니다. 본문·수식·문제는 등록 fixture와 일치해야 하며 원문 또는 구현의 별도 전제도 유지합니다."
  },
  "ai/adaptive-hyperparameter-search": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "과거 관측을 다음 제안으로 바꾸는 단일 반복을 일반 구조에서 TPE 수치와 원문·고정 버전 구현으로 올립니다. 다른 탐색 기법의 비교는 이 글의 범위 밖입니다.",
    "sharedGate": "손실 네 개를 좋은 두 개와 나머지로 나누어 후보 P/Q의 밀도비 6과 2를 비교합니다. 본문·수식·문제는 등록 fixture와 일치해야 하며 원문 또는 구현의 별도 전제도 유지합니다."
  },
  "ai/math-optimization-objectives": {
    "rationale": "무엇을 바꿔 어떤 점수를 낮추고 어떤 조건을 지킬지 정하는 하나의 질문입니다. 같은 제곱 점수에서 허용 범위만 바꾸어 위치와 점수가 달라지는 과정을 보이고, 벌점·빈 집합·달성하지 못한 하한을 함께 확인해야 탐색 알고리즘보다 앞선 문제 정의를 이해할 수 있어 한 글로 유지합니다.",
    "sharedGate": "모든 실수의 답 (3,2)와 [0,2]의 답 (2,3), 제곱 벌점의 위반 최소점 2.5와 총점 2.5를 계산합니다. 같은 사례를 실제 식 (4.1)의 f₀·f₁·f₂에 넣고 열린 상한에서 점수 3을 달성할 수 없는 이유와 좌표별 clipping의 결합 제약 반례를 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "crypto/csprng": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "여덟 시작값에서 긴 출력으로 이어지는 한 사례를 원천·생성·상태·사용처까지 따라가며 각 단계의 다른 실패를 이해하도록 한 글로 유지합니다.",
    "sharedGate": "여덟 seed의 두 출력과 상태 복제 뒤 중복을 실제 교육용 구현으로 확인합니다. 최소 엔트로피는 단일 추측 확률로 제한해 설명하고 ECDSA 차분에서 개인키 항이 상쇄됨을 n19 사례로 검산합니다. 실제 운영체제·공식 인증 시험을 수행했다고 주장하지 않습니다."
  },
  "ai/math-optimization-convexity": {
    "rationale": "현재 위치의 정보로 다른 위치의 함수값을 어디까지 예측할 수 있는지를 묻는 하나의 경로입니다. 현과 접선의 방향, 기울기 변화의 상한, 접선 위에 남는 최소 여유를 같은 제곱 함수로 확인하고 두 방향의 차이로 확장해야 볼록성·매끄러움·강한 볼록성을 혼동하지 않아 한 글로 유지합니다.",
    "sharedGate": "x²의 현 높이 2와 곡선 1, 1→1.1의 예측 1.2/실제 1.21/오차 .01을 계산합니다. 원문의 m=M=2 경계와 적분 계수 1/2을 대조하고 (x²+100y²)/2의 (1,1)→(.99,0), z=10y의 κ=1을 검산합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "crypto/shamir-secret-sharing": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 비밀 5의 조각을 생성·복원·변조·갱신까지 추적해야 정확성과 비밀성, 검증의 차이를 볼 수 있어 한 글로 유지합니다.",
    "sharedGate": "14개의 정확한 정수 계산으로 복원·균등 관찰·계수0 금지 반례·재사용·변조·갱신·회차 혼합을 확인합니다. 원문 §2의 기호를 같은 수에 대응하며 실제 VSS나 분산 시스템을 실행했다고 주장하지 않습니다."
  },
  "crypto/crt": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "3·5·7의 나머지에서 같은 수23을 조립한 뒤 RSA의5·7 계산으로 이어져 정리의 구성과 원문 적용을 한 흐름으로 읽도록 유지합니다.",
    "sharedGate": "19개의 정확한 정수 검산으로 선택자·유일성·비서로소 반례·14+18j·RFC 재결합·모든35개 입력의 직접 계산 일치·오류 결과9의 인수 누출을 확인합니다. 실제 라이브러리 부채널·결함 주입·속도 측정은 수행하지 않았습니다."
  },
  "ai/hyperparameter-tuning": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 번의 후보 선택에서 누적 탐색 비용과 선택용 평가·독립 보고가 연결됩니다. 확률식도 같은 탐색 횟수의 의미를 설명하므로 후보 생성 알고리즘의 상세는 별도 글에 맡기고 이 계약을 한 글로 유지합니다.",
    "sharedGate": "세 후보의 비용30과 선택 점수0.20, 독립 평가0.23을 한 경로로 추적합니다. 본문·수식·문제에서 같은 가정을 유지하고 원문 수치와 별도 설명 사례를 구분합니다."
  },
  "ai/search-space-design": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "후보 하나를 생성하는 규칙의 형태·좌표·활성 항목·자원 검사가 하나의 경로입니다. 같은0.001과18/22GB 후보가 생성에서 사전 판정까지 이어져 조건을 쪼개면 실효 분포의 경계가 끊깁니다.",
    "sharedGate": "중간 위치0.5를 로그 좌표로 옮겨0.001을 만들고 분기와20GB 사전 조건을 적용합니다. 본문·수식·문제에서 같은 가정을 유지하고 원문 수치와 별도 설명 사례를 구분합니다."
  },
  "ai/multi-fidelity-pruning": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "후보를 줄여 얻은 자원 절약과 놓친 후보의 감사를 함께 보아야 정책을 판단할 수 있습니다. 9→3→1 배분에서 비용21과 표본4/20으로 이어지는 하나의 의사결정을 유지합니다.",
    "sharedGate": "후보9→3→1의 누적 깊이1→3→9와 재개 비용21을 따로 계산하고 놓침4/20을 확인합니다. 본문·수식·문제에서 같은 가정을 유지하고 원문 수치와 별도 설명 사례를 구분합니다."
  },
  "ai/multi-objective-hpo": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "필수 한도·정확한 지배·반복 흔들림·제품의 선택은 A/B/C/D의 한 승인 과정입니다. 완화 비교의 순환 반례는 같은 정의를 오용하지 않기 위한 경계로 묶습니다.",
    "sharedGate": "A/B/C/D를16GB와100ms로 걸러 A와C를 남기고80ms 내 최소 손실 정책으로C를 고릅니다. 본문·수식·문제에서 같은 가정을 유지하고 원문 수치와 별도 설명 사례를 구분합니다."
  },
  "ai/learning-curve-tracking": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "곡선의 한 점에서 진행 좌표를 보존하고 두 실행을 대응시키는 하나의 추적입니다. API의 가로축과 복구 경계까지 연결해야102만과98만을 정확히 같은 자원량으로 오해하지 않습니다.",
    "sharedGate": "100만 목표 근처의 A102만·B98만 관측을 허용3만 안에서 비교하며 실제 위치 차이를 보존합니다. 본문·수식·문제에서 같은 가정을 유지하고 원문 수치와 별도 설명 사례를 구분합니다."
  },
  "ai/math-gradient-descent-convergence": {
    "rationale": "현재 기울기로 다음 위치를 정하는 같은 반복을 보폭·오차·종료라는 세 관점으로 읽습니다. 같은 4에서 출발한 경로가 수축·왕복·발산하는 이유와 보장의 전제, 작은 이동으로 멈춘 반례를 함께 보아야 반복 종료를 최적점의 증명으로 오해하지 않아 한 글로 유지합니다.",
    "sharedGate": "f=x²/2의 4→2→1→.5, η2의 ±4, η3의 4→−8→16→−32와 점수를 검산합니다. 원문 식 9.17의 상한 2/32, μ2·L8의 네 번 상한81/256과 실제6561/65536, 작은 이동 .000004 및 종료 이유별 잔여 오차를 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "action": "keep"
  },
  "crypto/lagrange": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 세 기록에서 규칙 생성·새 위치 평가·원문 무게식·차수 반례까지 이어져 보간의 의미와 실패 조건을 한 글에서 이해하도록 유지합니다.",
    "sharedGate": "18개의 정확한 산술 검산으로 모든 F17 입력 17개의 직접식·기저·무게 계산을 비교하고 표본 분기·분모 항등식·차수 반례·소멸식의 표본 밖 값을 확인합니다. DLMF와 저자 PDF의 수식을 같은 사례에 대응하며 실제 암호 라이브러리 실행을 주장하지 않습니다."
  },
  "ai/serving-latency-metrics-and-slo": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 요청의 같은 시각 기록을 지표·표본 분포·실제 측정 코드·기간 약속으로 올리는 연속 설명입니다. 원래의 핵심 수식3개와처리량·구간판정절차를 유지하면서 이벤트 단위와분모를 추적하기 위해15절로 나눴습니다. 엔진 병목과용량설계는연결글에맡깁니다.",
    "sharedGate": "다섯토큰1·1.040·1.085·1.285·1.327초→327/4=81.75ms→고정코드적용; 묶음1·1·3과usage1.350초의다른출력;100개표본P95 1.45/1.4625초;288구간예산2개와3개위반을본문·문제·원문패널·도식에서동일하게검사합니다."
  },
  "crypto/finite-field-theory": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 6÷3 요청을 입력·역원·되곱하기·원문 절차까지 추적한 뒤 위수와 다항식, 검사 확률, 확장체에서 무엇이 달라지는지 이어 보도록 유지합니다.",
    "sharedGate": "28개의 정확한 산술 검산으로 F7의 모든 역원, 위수, 다항식 값과 실제 근 비율, 세 번 독립 상한, F3 확장체의 모든 8개 역원을 확인합니다. 원문 절차의 교육용 재현과 실제 라이브러리 실행을 구분합니다."
  },
  "ai/math-vectors-inner-products": {
    "action": "keep",
    "rationale": "하나의 이동 (3,4)에서 좌표·길이·내적·투영을 차례로 계산하고 투영 길이의 제한으로 부등식을 얻습니다. 같은 벡터가 무엇을 남기고 버리는지 함께 보아야 내적을 의미 유사도나 투영을 원본 보존으로 잘못 읽지 않습니다. 퍼셉트론 증명은 이 관계의 실제 재사용을 펼침 영역으로 보존합니다.",
    "sharedGate": "길이 5, 차이 거리 5, 직각 내적 0, 가로 기준 (1,0)/(2,0)의 같은 투영 (3,0), 등호 50과 엄격한 상한 0<25를 검산합니다. 공식 문서의 tiny normalize 길이 .05와 cosine .03/.6, 정리의 R5·γ1 상한25까지 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/reed-solomon": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 네 기록을 생성·소실 복원·오류 교정·원문 행렬·잘못된 성공·근접성까지 추적해야 계산의 보장과 원본 확인을 구분할 수 있어 한 글로 유지합니다.",
    "sharedGate": "F7의 49개 원본에 대해 모든 294개 두 위치 복원과 1176개 한 오류 교정, 49개 무오류 복원, 최소 거리와 행렬 변환을 정확한 정수로 재현했습니다. 패킷 구현이나 FRI 실행은 하지 않았습니다."
  },
  "ai/continuous-batching-step-anatomy": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 실행에 누구의 토큰을 몇 개 넣는지라는 하나의 질문을 작은 배정부터 실제 코드와 진행 예약까지 순서대로 풉니다. 독립적인 정책 최적화와 성능 모델은 연결 글이 소유합니다.",
    "sharedGate": "한도 8에서 A1·B1·C6, 다음 A1·B1·C4·D2, 다음 네 요청 1씩 합계 4를 본문·문제·Viz·고정 원문 적용에서 맞춥니다. 요청 상한 2, 공간 배정 실패, P4로 뒤 A 미배정, 반환 전 C의 computed/in-flight 6을 별도 경계로 검사합니다."
  },
  "gpu/cuda-thread-hierarchy": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "열 개의 덧셈을 네 자리씩 나누는 한 요청에서 논리적 작업표와 실제 실행 묶음을 구별합니다. 같은 번호의 경계 검사와 주소를 실제 원본으로 확인한 다음 2D 및 자원 제약으로 확장하는 연속 설명이므로 유지합니다.",
    "sharedGate": "10개·4 threads·3 blocks에서 후보 12개 중 접근 10개와 건너뜀 2개, 9번의 36바이트 주소와 결과 99, block별 부분 warp 3개를 본문·도식·학습·원문에 함께 대조합니다. 2D의 13번·52바이트 및 N=0 등 경계도 정수 검산합니다."
  },
  "ai/math-matrices-svd": {
    "action": "keep",
    "rationale": "두 입력 (4,2)를 섞는 같은 규칙에서 행렬·합성·rank·SVD·근사를 함께 추적합니다. 출력 평균과 차이의 서로 다른 배율을 보아야 표의 크기와 독립 방향 수, 압축의 오차와 잃는 정보를 구분할 수 있습니다. 모든 후보에 대한 정리 증명은 펼침 영역으로 보존해 주 흐름과 연결합니다.",
    "sharedGate": "A의 (10,8), 큰 방향만 남긴 (9,9), 표 노름 오차 1과 같은 입력 출력 오차 √2를 각각 검산합니다. Reduced의 3×2 rank 1 입력에서 S 길이 2, PyTorch 코드의 행 입력·weight 전치·bias·펼침 경로, 실제 MIT 문제의 동일 행렬까지 확인합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/fft": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 네 계수를 직접 평가·버터플라이·원문 보조 배열·역변환까지 추적한 뒤 곱의 길이와 구현 순서가 깨지는 경우를 이어 보기 위해 한 글로 유지합니다.",
    "sharedGate": "F17 길이 4의 모든 83521개 계수 목록에서 직접 변환과 빠른 변환, 역변환 원복을 대조했습니다. 추가 길이 400건과 다항식 곱 320건, 원문의 역배율과 보조 배열을 정수로 검산했습니다. GPU 커널이나 실제 암호 라이브러리는 실행하지 않았습니다."
  },
  "gpu/cuda-shared-memory": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 전치 값의 입력과 출력 경로에서 global 주소 모으기, shared bank 충돌, padding과 추가 비용을 연결해야 공동 공간을 사용하는 이유를 이해할 수 있어 한 글로 유지합니다. 재사용과 저장 배치는 이 주소 계산의 확장으로 설명합니다.",
    "sharedGate": "64×64의4096개 원소를 실제 원본의32×16 threads·i0/16 식으로 재현하고 값7의2371→tile[5][3]→229, sector32→4와bank stride32/33,추가128B를본문·도식·학습·원문에대조합니다. 실제 GPU 성능은 측정하지 않았습니다."
  },
  "ai/serving-memory-admission-and-preemption": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "C 한 요청의 수용·성장·중단·복원이 같은 공간 장부를 사용하므로 한 글에서 끝까지 추적합니다. allocator와 cache group의 세부 구현은 연결 글이 소유합니다.",
    "sharedGate": "40block에서 A14·B12·C9→A15·B13·C10→A16·B14·C0→B14·C11과 free14·5·2·10·15를 본문·Viz·문제에서 일치시킵니다. V1 full input63 대 free50, V0 CPU 실패 RuntimeError, 복구161token·11block과 두 비용 식을 실제 원문·독립 산술로 검증합니다."
  },
  "ai/math-exponents-logarithms": {
    "action": "keep",
    "rationale": "세 번의 절반 줄이기에서 남은 양 1/8과 횟수 3을 대응해 거듭제곱·역관계·곱의 합 변환·밑 변환을 한 계산으로 연결합니다. 이 네 관계를 함께 보아야 로그의 음수 출력, 확률의 곱 조건, 단위 변경과 수치 표현의 한계를 구별할 수 있습니다.",
    "sharedGate": "같은 1/8의 log₂=−3, 밑 1/2에서 3, 자연로그 −3ln2를 교재와 CPython 분기에 대입합니다. 직접 2000번 곱은 0, 로그 합은 유한하다는 실제 실행과 exp의 재언더플로, 복합 비용 최소 위치 1/2 대 1/(1+ln2)를 확인합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "gpu/cuda-compilation-and-isa-analysis": {
    "action": "keep",
    "rationale": "같은 덧셈의 소스·PTX·SASS를 실제 문서에서 추적하고 배포 이미지 선택·배정·최적화 확인을 이어 갑니다. 자원에 따른 동시 실행 한도와 성능 측정의 상세는 각 정본으로 연결합니다.",
    "sharedGate": "0×4+3=3, 주소+12바이트, 7+5=12를 실제 함수와 별도 문서 출력에 대입합니다. U2/4/8의13/19/31, FMA2^-46 대0, sm80 cubin+compute90 PTX의선택을 검산하며 모든 실제 실행·성능 주장을 구별합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/field-arithmetic": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 7×5 요청이 입력 표현·REDC·실제 원문·외부 바이트 경계를 통과하는 흐름을 유지합니다. 타입 혼용과 실패 조건은 그 흐름이 깨지는 지점으로 이어집니다.",
    "sharedGate": "학습용 p=17, R=32의 544개 REDC 입력과 289개 곱, 실제 고정 ark-ff의 289개 곱·합과 실패 조건을 검산했습니다. 원문과 Cargo.lock을 고정한 호스트 한 limb 실험이며 GPU·어셈블리·상수 시간·성능 검증은 아닙니다. 일반 derive 매크로의 생성 코드와 기본 메서드를 구분하고 실험은 후자를 명시적으로 선택했습니다."
  },
  "gpu/sm-warp-scheduling-and-issue": {
    "action": "keep",
    "rationale": "같은 네 warp의6clock으로 배치·후보·발행과 기다림을 연결합니다. 경로별 활성 lane과 동기화 범위는 명령발행이 유효한 일로 이어지는 조건입니다.",
    "sharedGate": "B지연8이면clock6의준비시점A9/B10/C7/D8·active4 eligible0 issued0, B지연4이면eligible1 issued1입니다. Little의resident하한과eligible,500warp-load의모형/큐한도,40slots·26.5625%와실행시간을 구별합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "ai/math-high-dimensional-geometry": {
    "action": "keep",
    "rationale": "같은 네 칸 직선을 한 칸으로 옮겨 여섯 거리와 복원을 확인한 뒤, 일반적인 거리 보존 정리와 데이터의 자유도, 학습 통로의 폭을 구별합니다. 이 세 크기를 함께 대조해야 낮은 차원이라는 공통 표현에서 잘못된 압축 보장을 끌어내지 않습니다.",
    "sharedGate": "p(t)→2t의 여섯 거리와 x1−x2의 충돌, 독립 이진 제곱거리의 상대SD, JL 4/6 계수의 확률·수치, scikit-learn의319와 올림320을 각 근거의 범위에 맞춰 검산합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "ai/kv-cache-fundamentals": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 요청의 현재 질문과 보존할 기록을 작은 배열부터 실제 코드·모델 설정까지 이어 추적합니다. head 공유·저장 표현·시간 비용을 같은 기록의 수명과 연결하므로 한 글에 유지하고 allocator 세부 구현은 별도 글이 소유합니다.",
    "sharedGate": "3→4위치48→64byte/Q16byte,head0·0·1·1과출력(2.5,5)를본문·원문·Viz·문제에서일치시킵니다. MLA흡수동치·Gemma800+320=1120MiB와대용3840MiB·총전송200→125MB를 독립 검산하고 전체원문pin·3수식·390/1440·9패널·5장면을 검사합니다."
  },
  "crypto/karatsuba": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 네 조각으로 합의 곱·차의 곱·실제 limb 배열을 추적하고 재귀 비용과 구현 경계를 이어 보기 위해 한 글로 유지합니다.",
    "sharedGate": "Python 정수로 재귀 곱 65536쌍과 홀수·불균형 무작위 300쌍, 네 조각 공식 10000건을 대조했습니다. 실제 C 원문에는 같은 조각을 64비트 자리 두 개로 옮겨 적용했으며 네이티브 실행이나 성능 측정은 하지 않았습니다."
  },
  "ai/math-complex-numbers-oscillations": {
    "action": "keep",
    "rationale": "(3,4)를 네 번 돌리는 같은 작업으로 각도 단위, 두 좌표, 회전 곱셈, 절대수렴 급수의 연결을 확인합니다. 이어 같은 네 점의 푸리에 계수를 계산해야 위상과 누적 회전, 계수와 진폭의 차이를 한 흐름에서 검산할 수 있습니다. 전체 FFT 구현과 수치 형식 설계는 연결 글로 넘깁니다.",
    "sharedGate": "네 좌표의 길이 5와 역회전·점 간 제곱거리 50, 실제 _Py_c_prod의 −4/3, M4/M8의 오차와 상한, 복소 DFT의 20/4와 실수 DFT의 2×10/4를 수학과 실행 로그에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/extension-field-theory": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 두 칸 [1,1]과 [2,1]을 곱셈·역원·원문 실행·Frobenius와 기저 변경까지 추적해, 새 규칙의 조건과 실제 표현 경계를 한 흐름으로 이해하도록 유지합니다.",
    "sharedGate": "Python으로 F₉의 729개 세 값 조합에서 결합·분배를 확인하고 F₈₁의 80개 역원 유일성을 검사했습니다. 고정 ark-ff 실제 실행은 F₉ 81개 곱·8개 역원·9개 Frobenius와 두 잘못된 설정을 포함합니다. 원복만으로 잘못된 표를 검출할 수 없다는 반례를 보존합니다."
  },
  "ai/prefill-decode-phase-dynamics": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "새 입력이 기존 답변 지연을 어떻게 바꾸는지 A·B·C의 한 배정에서 시작해 장부·하한·실제 코드·긴 문맥으로 이어집니다. 각 항을 분리한 채 동일 비용 질문을 추적하므로 한 글에 유지하고 scheduler 전체·roofline 정본·분리 배치 구현은 기존 글을 재사용합니다.",
    "sharedGate": "A1+B1+C4=6과 C의20→0 다섯 조각, 하한1.48/1.8/2.2 ms, 실제2.3 ms 반례를 본문·Viz·6+4에서 일치시킵니다. MHA32 GiB·14.4357 ms와 별도448 후보를 분리하고496/2032 GiB를 독립 검산합니다. 전체원문3개·6패널·5장면·5수식·390/1440을 검수합니다."
  },
  "ai/math-differential-equations-numerical-solvers": {
    "action": "keep",
    "rationale": "남은 양 1의 같은 감소 경로를 연속 식·Euler·Heun·원문 반복문에서 대조해야 현재 변화율과 변화량, 내부 단계와 출력 시각을 연결할 수 있습니다. 같은 drift에 작은 잡음을 더해 시간의 h와 √h 및 상태 분산의 차이까지 검산합니다. 전체 SDE 이론과 개별 생성 모델의 변환식은 연결 글로 넘깁니다.",
    "sharedGate": "1→.5→.25와 1→.625→.390625, h=.25 네 단계, |1−hλ| 조건과 Heun 배율, 실제 dy와 y1, .011 오차 기준, .015625 상태 분산을 수식·원문·그림에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/extension-fields": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 A·B의 곱을 열두 계수·실제 층별 연산·Frobenius·바이트 형식까지 연결해 계산과 표현의 관계를 한 흐름에서 설명합니다.",
    "sharedGate": "고정 원문의 실제 Rust 실행과 직접 다항식 전개를 비교했습니다. 144개 기저 곱·16개 추가 곱·15개 직접 p제곱 대조 및 두 잘못된 해석을 검사했습니다. 전체 페어링·EVM·성능은 실행 범위에서 제외합니다."
  },
  "gpu/cuda-sync-streams": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은값의 생산·소비·재사용 순서를 kernel 사이와 안, 장치 사이에 확장하는 하나의 질문입니다. 실행 범위마다 바뀌는 보장을 비교해야 같은 buffer를 안전하게 넘길 수 있습니다.",
    "sharedGate": "가정한 두 작업18/14ms·네작업24ms, event기록세대, 같은7→8의원문대입과 자원별수명을 문제·본문·그림에서 대조합니다."
  },
  "ai/disaggregated-prefill-decode-serving": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "하나의 요청 R이 두 단계 사이에서 상태를 안전하게 넘기고 사용자 출력을 내기까지의 경로를 유지합니다. 목적지·완료·원본 수명·링크·풀 용량은 같은 인계의 정확성과 비용을 결정하므로 한 설명으로 잇고 KV shape·로컬 배정·단계 병목의 정본은 연결해 재사용합니다.",
    "sharedGate": "R의 입력4·두 층·위치당32B·전체128B, 준비4ms·복사2ms·D계산2ms·첫출력8ms를 본문·Viz·6+4에 일치시킵니다. 층별3/5 및6/10ms 반례와512MiB 전송·12:8·2GPU복사본16GPU를 독립 검산합니다. 고정 원문9개·14패널·5장면·4수식·390/1440에서 정확성과 읽기 순서를 검증합니다."
  },
  "crypto/frobenius-optimization": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 1+u를 직접 세제곱하고 기저와 표를 바꾼 뒤 노름 1을 만드는 흐름이 큰 BN254의 마지막 지수를 설명합니다. 증명과 실제 원문 및 잘못된 후보의 반례를 같은 사례로 연결합니다.",
    "sharedGate": "고정 Rust 실행으로 작은 아홉 값·81쌍·기저 변경·비체 반례와 큰 지수 분해를 대조했습니다. 원복·연산 보존 검사만으로 틀린 표를 검출하지 못하는 경우를 명시합니다. 전체 페어링·최적 chain·성능은 실행하지 않았습니다."
  },
  "ai/math-numerical-precision-stability": {
    "action": "keep",
    "rationale": "같은 δ의 저장 자리·괄호 배치·실제 반올림 분기를 한 흐름에서 읽어야 입력 정밀도와 중간 저장의 차이를 확인할 수 있습니다. 같은 확인법을 지수 항·모멘트 차에 적용하고 정확한 정수의 축 반례로 계산 의미의 독립 경계를 마무리합니다. 개별 GPU 커널과 혼합 정밀도 학습 루프의 상세 정책은 연결 글로 넘깁니다.",
    "sharedGate": "δ=2^-11의 양방향 tie와 3c00/01/02, FP32 분산 0/1, 최대값 이동 뒤 exp(0)=1, log 비중 −1000, 같은 아홉 정수 합을 본문·그림·실행·원문에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/sparse-multiplication": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 A·B의 여덟 곱을 실제 탑의 계수·014 함수로 옮기고 빈 칸의 변화와 034의 다른 뜻을 비교합니다. 실제 D형 Miller와 비용 모형까지 이어야 계산 생략의 조건과 한계를 함께 이해할 수 있습니다.",
    "sharedGate": "같은 입력의 직접 다항식·일반 곱·전용 곱과 생성원 Miller 누적을 비교했습니다. 잘못된 위치 두 경우를 검출하며 시간·전체 페어링·선 생성 독립 검증은 실행 범위에 넣지 않습니다."
  },
  "banking/bank-balance-sheet-and-deposit-creation": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "대출로 생긴 지급 의무를 송금·상환하고 이후 지급 부족·손실을 다루는 한 은행의 연속 사례입니다. 별도 분기를 명시해 손실과 상환, 보험과 유동성 공급을 구분합니다.",
    "sharedGate": "같은 장부의 네 상태와 급매·차입 두 분기, 6+4 답 경로 및 공식 PDF 그림을 대조합니다. 시점·대상·제도 조건을 생략하지 않습니다."
  },
  "ai/prefix-caching-radix-attention": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "한 요청의 앞 기록이 어디서 일치하고 어떤 저장 위치를 공유하며 언제 반환되는지 하나의 경로로 설명합니다. 탐색·수명·순서·kernel 주소는 같은 재사용의 정확성을 결정하므로 R 사례를 이어가고 KV shape와 일반 block 배정의 정본은 연결해 재사용합니다.",
    "sharedGate": "R의 8자리·공유 6·hit 0/6/6과 12자리 저장, B=4의 0/4/4와 16자리, 보호 8·요구 5·반환 4를 본문·Viz·6+4에 맞춥니다. 실제 원문 11개·15패널·4장면·2수식과 390/1440을 확인하고 마지막 입력·namespace·hybrid·offline 경계 및 수치를 독립 검산합니다."
  },
  "ai/math-probability-expectation-variance": {
    "action": "keep",
    "rationale": "같은 네 순서 기록에서 질문·정보·곱 관계를 바꾸어야 조건부확률과 연쇄법칙 및 독립의 차이를 한 표로 검산할 수 있습니다. 결과를 숫자로 바꾸는 확률변수와 표본 평균의 흔들림은 기존 두 연결 글에서 이어가며 여기서는 사건과 비중의 계약을 마무리합니다.",
    "sharedGate": "네 기록의 1/4, 정보 B의 1/2과 C의 2/3, HT의 곱 복원, 주변 확률은 반반이나 HH=3/8인 반례, 세 쌍 1/4 대 세 확률의 곱 1/8을 같은 본문·그림·원문에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/elliptic-curves": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 P의 덧셈·비트 반복·좌표 변환을 실제 원문까지 이어야 저장 형태와 점의 유효성을 구분할 수 있습니다. 별도 cofactor 반례와 BN254 적용은 주 사례와 명확히 구별해 같은 글의 입력 경계를 설명합니다.",
    "sharedGate": "19점의 361쌍·20스칼라와 원본 중간값을 정수 계산에 대조했습니다. 실제 G1·G2 반례와 전체 페어링 관계는 실행했으며 EIP 파서 모형·실제 EVM·독립 페어링·상수 시간 검증 범위를 구분했습니다."
  },
  "banking/central-bank-and-policy-transmission": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 은행의 지급 부족에서 자금 조달 조건을 바꾸고 그 의미를 공장의 장기 계약과 지출까지 이어야 현재 금리·미래 기대·장부의 관계를 구분할 수 있습니다. 국가별 틀은 이 연결의 조건을 비교합니다.",
    "sharedGate": "6억의 하루 이자와 거래 상대별 장부, 4.3→4.05%의 기대 경로, 6+4 답 경로와 실제 운영 문서의 조건을 대조합니다."
  },
  "ai/math-random-variables-expectation": {
    "action": "keep",
    "rationale": "같은 네 기록에서 함수·유도분포·기댓값을 차례로 만들고 같은 행의 점수·뒷면 수·제곱을 비교해야 선형성과 비선형 경계가 구체적 계산으로 연결됩니다. 표본평균의 분산과 추정 정확도는 다음 글로 넘기고 여기서는 어떤 평균을 정의했는지와 존재 조건을 마무리합니다.",
    "sharedGate": "X의 2·1·1·0에서 분포 1/4·1/2·1/4와 E[X]=1, 점수 평균 5, E[XY]=1/2 대 평균 곱 1, 제곱 평균 3/2 및 상수일 때 등호를 본문·그림·실제 MIT 식에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "banking/payment-clearing-settlement": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 여섯 지시를 접수·대조·이행·실패와 두 통화 교환으로 이어야 지급량·유동성·신용노출·최종성을 구분할 수 있습니다. 분리 대신 같은 수치의 변화를 유지합니다.",
    "sharedGate": "260·10·120/100·원자적10을 독립 검산하고 실제 문서의 최종성·반환/PvP 조건 및 기초6·심화4를 대조합니다."
  },
  "ai/math-variance-sampling": {
    "action": "keep",
    "rationale": "같은 네 점수에서 원래 퍼짐과 평균의 퍼짐을 비교해야 n−1 교정과 1/B의 서로 다른 분모가 연결됩니다. 그 점수를 같은 위치의 기울기로 재사용하며 표집 방식이 중심과 흔들림, 한 번의 감소에 미치는 차이를 계산하는 하나의 질문입니다. 장기 최적화 정리와 옵티마이저 상태는 연결 정본으로 남깁니다.",
    "sharedGate": "점수 3·2·2·1의 평균 2와 분산 1/2, 관측 1·2·3의 2/3 대 1, 독립 B=2의 분산 1/4와 큰 오차 확률 5/8, B=16의 상한 1/8을 대조합니다. 이어 복사의 분산 1/2, 비복원 분산 1/6, q 보정 평균 2, 손실 3/8→321/800을 본문과 그림, 원문 식, 복습 답에서 확인합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/pairing": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은P와Q의 점 이동·선 값·최종72승을 이어야 원시 값과 마지막 출력의 차이를 이해할 수 있습니다. 실제BN은 별도 곡선·정규화로 명시해 같은 역할에 대응합니다.",
    "sharedGate": "작은 정수 연산16쌍과360개 원소, 실제 고정 Rust의cE 비교와87개 선·두 쌍의 곱을 확인했습니다. 일반정리 증명·독립 페어링 구현·EVM·시간 측정과 검산 범위를 구분합니다."
  },
  "ai/cross-entropy": {
    "action": "keep",
    "rationale": "같은 글자의 코드 길이를 바꾸는 질문에서 한 사건 비용, 원래 평균, 모델 평균과 초과 비용이 차례로 나옵니다. 이 값을 실제 학습 함수로 옮길 때 필요한 로짓 미분과 정답 분모를 같은 네 관측으로 검산하므로 하나의 글로 유지합니다. 로그 법칙·일반 기댓값·역전파 계산 그래프는 연결 정본을 재사용합니다.",
    "sharedGate": "A·A·B·C의 6/7자리, 평균 1.5/1.75 bit, KL 0.25 bit, 우도 1/128, 로짓 Q−y, 실제 mean 7ln2/4와 가중 11ln2/6·11ln2/4, 큰 공통 로짓에서 0 대 ln3을 본문·그림·원문·6+4에서 대조합니다.",
    "status": "implemented",
    "reviewedAt": "2026-10-04"
  },
  "crypto/crypto-primitives": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 C 기록의 바이트·루트·서명을 연결해야 포함 여부와 서명식 및 외부 승인 정책의 차이를 이해할 수 있습니다. 작은 순열과 군은 실제 규격과 다른 모형임을 명시합니다.",
    "sharedGate": "실제 해시·작은 군·289상태 순열·RFC 공식 벡터와 47바이트 서명 및 길이·등록 키 반례를 검산했습니다. 제품 보안과 실제 Poseidon·BIP 실행 범위를 구분합니다."
  },
  "ai/speculative-decoding-variants": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
    "rationale": "같은 RAY를 선택하고 기록하는 요청에서 후보 출처와 검증 모양이 바꾸는 상태·확률·비용을 비교하는 글입니다. 각 방법의 독립 상세가 아니라 동일 경로와 단독 기준을 유지하는 비교가 중심이므로 한 글로 유지합니다. 논문별 실험 조건은 펼침으로 분리했습니다.",
    "sharedGate": "prefix4·7입력·17/10칸·RAY [0,1,4]·KV [4,5,8]→[4,5,6]·글/기록7, MTP 1.85/(v+.016)와 x<.917, suffix score1.875와 전체 시간비80/14를 본문·6+4·4장면·원문13패널에서 맞춥니다. 실제 CPU 실행과 전체 원본 byte, 두 폭과 수식·humanize를 별도 확인합니다."
  },
};

/**
 * Review 당시 title·learning ownership·source closure의 digest입니다. 본문 구조나
 * 개념 소유권이 바뀌면 topology audit가 stale decision으로 되돌립니다.
 */
export const ARTICLE_TOPOLOGY_FINGERPRINTS: Readonly<Record<string, string>> = {
  "ai/cross-entropy": "a23db07aab820d12",
  "ai/speculative-decoding-variants": "c2746d3bfcf6a81c",
  "crypto/crypto-primitives": "33067f5c32a87fc6",
  "ai/math-probability-expectation-variance": "ecfd3995b1373409",
  "ai/math-random-variables-expectation": "2085777462bfb2ff",
  "ai/math-variance-sampling": "e5ce5d929d86a3b6",
  "banking/central-bank-and-policy-transmission": "7f2732e5a01757b9",
  "banking/payment-clearing-settlement": "502add20e5d3e638",
  "crypto/elliptic-curves": "536a045b49354879",
  "crypto/pairing": "4cfa530fa12276cb",
  "ai/math-numerical-precision-stability": "9b9a8b90f50ded78",
  "ai/prefix-caching-radix-attention": "28ef371cafdc6aa0",
  "banking/bank-balance-sheet-and-deposit-creation": "05598a4b186734fa",
  "crypto/sparse-multiplication": "654e9f0cc5bb6ace",
  "ai/disaggregated-prefill-decode-serving": "b4965f72e312bd85",
  "ai/math-complex-numbers-oscillations": "58bea8a0233a0c54",
  "ai/math-differential-equations-numerical-solvers": "39de3be7f1eb97c0",
  "ai/prefill-decode-phase-dynamics": "fe382c9e222d9238",
  "crypto/extension-field-theory": "f9aa83b6e0fca423",
  "crypto/extension-fields": "5af7ff4c6c338153",
  "crypto/frobenius-optimization": "05f920aec7cb1ef0",
  "gpu/cuda-sync-streams": "1e3dd40cdf06c5ba",
  "ai/kv-cache-fundamentals": "489a4b6ceb2047c8",
  "ai/math-exponents-logarithms": "85bb89442054fb35",
  "ai/math-high-dimensional-geometry": "e8b6cd657ce57ef8",
  "ai/math-matrices-svd": "a0a373f5e7b381af",
  "ai/serving-memory-admission-and-preemption": "13f411a93493046f",
  "crypto/fft": "6fb9c0f51c62c5ea",
  "crypto/field-arithmetic": "cf8cd8590d9faf12",
  "crypto/karatsuba": "88bf647bd63498c0",
  "gpu/cuda-compilation-and-isa-analysis": "7176747457f03790",
  "gpu/cuda-shared-memory": "5c94a7374b6a22a6",
  "gpu/sm-warp-scheduling-and-issue": "049edeecb9dfbcbb",
  "ai/continuous-batching-step-anatomy": "f6d631f09b82218c",
  "ai/math-vectors-inner-products": "d035efeae985768b",
  "ai/serving-latency-metrics-and-slo": "78cb5743248b70d4",
  "crypto/finite-field-theory": "307ba9c3fc691586",
  "crypto/lagrange": "03472f07b9810658",
  "crypto/reed-solomon": "ee07dec7d03042cc",
  "gpu/cuda-thread-hierarchy": "be8be5b5ad1806bc",
  "ai/hyperparameter-tuning": "8b86ec3131edeec2",
  "ai/learning-curve-tracking": "43b2d91519960b02",
  "ai/math-gradient-descent-convergence": "f4eee2384a7fa044",
  "ai/math-optimization-convexity": "86024239d24a2046",
  "ai/multi-fidelity-pruning": "ab4455c3e04ecee2",
  "ai/multi-objective-hpo": "8e60977063f7ce3a",
  "ai/search-space-design": "f98ddf63d1ca8923",
  "crypto/crt": "e967e493ce50e904",
  "crypto/csprng": "8b37dc43d4fb5416",
  "crypto/shamir-secret-sharing": "69f9d4cdb8cd7d6b",
  "ai/adaptive-hyperparameter-search": "c7600c0a051a1182",
  "ai/competition-submission-control": "f4a5a60d8694bccf",
  "ai/competition-workflow": "4562393852c386c2",
  "ai/cross-validation": "7ff394a94b7466c2",
  "ai/experiment-tracking": "2caa2c528a37ec23",
  "ai/fold-local-validation": "81c7a08d18185317",
  "ai/grouped-validation": "a28b15a149db340a",
  "ai/math-functions-derivatives-gradients": "b4db0777a94d0663",
  "ai/math-gradients-jacobians": "71df877c644fa3a3",
  "ai/math-optimization-objectives": "9de4f8a7e1859097",
  "ai/oof-risk-estimation": "5de974971729d88e",
  "ai/validation-feedback-audit": "cdf24bb889cba283",
  "ai/walk-forward-validation": "f3dfdc9ae216aea0",
  "crypto/diffie-hellman": "342dd5ed101377c5",
  "crypto/elgamal": "b90c151ef678caf1",
  "ai/competition-baseline": "895a83c1f192f791",
  "ai/harness-failure-ablation": "a2eafca200b3faef",
  "ai/math-functions-composition": "4b3257821a3f8e35",
  "ai/model-selection-bias": "b5325f8612b2f7ce",
  "ai/paired-experiment-design": "f4cdaa22f07a80a0",
  "blockchain/aa-fundamentals": "bee9a48ed669a020",
  "blockchain/eip4844-blob-fee": "49df0187376d0539",
  "ai/agent-changelog-evidence": "d836245b317bf83d",
  "ai/architecture-decision-records": "af6ac91ddada1812",
  "ai/engineering-lessons-ledger": "a47f67e2b082967e",
  "ai/backprop-optimization": "01fefafd8dd962d9",
  "ai/reverse-mode-autodiff": "b583e8474515e655",
  "blockchain/aave-v3": "1ebfddd4c59b21f6",
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
  "business/business-model-cashflow": "a2a19e5897a643d4",
  "business/franchise-incentives": "a9ab37834708e551",
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
  "embedded/firmware-update-and-recovery": "b54e482e0b1c8341",
  "embedded/scheduling-and-real-time": "a2fdefd3408002c7",
  "embedded/serial-buses-and-tradeoffs": "b77cf44426bedb4f",
  "embedded/timers-and-sampling": "e0eaaa84f836f4d3",
  "embedded/interrupts-and-latency-budget": "cfdf6ea3645856a7",
  "embedded/mcu-memory-map-and-registers": "eb97b92a0a3e5249",
  "semiconductors/yield-defect-and-packaging": "e2a487c102874573",
  "semiconductors/interconnect-and-rc-delay": "3996b172fe38d57e",
  "semiconductors/doping-and-thermal-budget": "5bfbe9faf76c12fd",
  "semiconductors/lithography-and-resolution": "3912753ae6c1c36e",
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
  "ai/vllm-paged-attention": "ea303e6227016d05",
  "ai/vllm-spec-decode": "d4e161bdd3651539",
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
  "gpu/cuda-basics": "41615071ec176bec",
  "gpu/gpu-arch-hopper": "036cadb2e337870a",
  "gpu/cuda-persistent-kernels": "9a0d1ef64c90bed2",
  "gpu/cuda-register-pressure": "9fbbf7aee0398c74",
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
"ai/fast-weight-memory-and-chunkwise-recurrence":"7a7c39371c676228",
"ai/flash-attention-io-aware-kernel":"4bc6b3022c566c1f",
"ai/reward-design-for-verifiable-rl":"9945c9823b138b96",
"ai/world-model-latent-planning":"ad27657439f3c92a",
"banking/repo-and-collateral-funding":"8b5c5b3336427561",
"blockchain/ethereum-future-roadmap":"5a7d76a6c5c062c7",
"blockchain/glamsterdam-block-execution":"31ca197e74a5e91a",
"blockchain/hyperliquid":"19e22f5f577fc95f",
"blockchain/pq-account":"f7e365500a6f43eb",
"blockchain/robinhood-chain-blob-demand":"02cf5430aa729ef9",
"blockchain/robinhood-chain-settlement":"a7a8664a0bcb7d32",
"blockchain/rwa-composition":"d7b3622726d50ca4",
"business/shop-daily-operations":"1824fd4a12a34295",
"crypto/constraint-systems":"180451df5e454382",
"crypto/fri":"ac11504ca83c08d9",
"crypto/jolt":"ce2cf82725d8cb32",
"crypto/ml-kem-and-noisy-equations":"329eb227a458992b",
"crypto/nova":"c77c366b260e6985",
"crypto/polycommit":"5c10899d100ec9d1",
"crypto/post-quantum-signatures":"bbd9a75525a1bc9e",
"crypto/prover-memory-and-verifier-cost":"268bbd7ee27658e6",
"crypto/quantum-computing-and-cryptographic-risk":"fdb29244df1b5b98",
"crypto/quantum-key-distribution":"daa73d234fcf8d76",
"crypto/snark-overview":"961154e8537ab05f",
"crypto/stark-theory":"544cd9e5420b7914",
"crypto/zk-theory":"d8c8dd6527fe6308",
"gpu/amd-gpu-execution-and-hip":"e5a60870e047525d",
"gpu/gpu-memory-hierarchy-and-roofline":"3c0d9140fdf925f7",
"gpu/hbm-stack-and-memory-requests":"5a449d78efcc2ad3",
"infrastructure/materials-waste-and-circularity":"89730ed273657bf2",
"institutions/culture-norms-and-coordination":"588ebc2e3eeb88e7",
"institutions/evidence-measurement-and-causality":"e4ce1a8e47b8197d",
"institutions/population-migration-and-care":"ca6733d2216266b0",
"markets/covered-calls-and-income-funds":"b3bf1d0cf748a674",
"markets/financial-products-and-claims":"a2c324243fb9fcee",
"markets/securitization-and-tranches":"112869ad29851ed5",
};

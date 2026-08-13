import type { Article, Category } from "./types";

export type ArticleIntent =
  | "개념 지도"
  | "구현 추적"
  | "비교·선택"
  | "운영 가이드"
  | "사례·실측"
  | "논문·프로젝트 해설";

export interface GuidanceLink {
  label: string;
  href: string;
  reason: string;
}

export interface ConceptFlowNode {
  label: string;
  detail: string;
}

export interface ConceptFlow {
  title: string;
  question: string;
  nodes: readonly ConceptFlowNode[];
  takeaway: string;
}

export const ARTICLE_INTENT_DESCRIPTIONS: Record<ArticleIntent, string> = {
  "개념 지도": "처음 보는 개념의 위치와 핵심 원리를 잡는 글",
  "구현 추적": "구성 요소가 실제 실행 경로에서 만나는 방식을 따라가는 글",
  "비교·선택": "대안의 차이와 선택 기준을 한 축에서 비교하는 글",
  "운영 가이드": "설정·장애·보안에서 바로 확인할 판단 기준을 정리한 글",
  "사례·실측": "구체적인 환경의 수치와 시행착오를 일반 원리로 연결하는 글",
  "논문·프로젝트 해설":
    "공개된 논문·테크 리포트의 사실과 해석을 분리해 읽는 글",
};

const ARTICLE_INTENT_OVERRIDES: Partial<Record<string, ArticleIntent>> = {
  "kimi-k3-architecture": "논문·프로젝트 해설",
  "hybrid-attention-serving": "비교·선택",
  "sionic-eureka": "사례·실측",
  "sionic-glm-b300": "사례·실측",
  "b300-switchless-network": "사례·실측",
};

const CATEGORY_STARTS: Record<string, GuidanceLink> = {
  ai: {
    label: "딥러닝 전체 지도",
    href: "/ai/deep-learning-overview",
    reason: "모델·학습·추론이라는 공통 좌표를 먼저 잡습니다.",
  },
  blockchain: {
    label: "분산 시스템 이론",
    href: "/blockchain/distributed-systems",
    reason: "노드·상태·합의가 왜 분리되는지 먼저 잡습니다.",
  },
  crypto: {
    label: "유한체 이론",
    href: "/crypto/finite-field-theory",
    reason: "ZK와 곡선 연산이 사용하는 산술 세계부터 잡습니다.",
  },
  p2p: {
    label: "TLS 1.3 기초",
    href: "/p2p/tls-fundamentals",
    reason: "연결·신원·암호화가 어느 층에서 일어나는지 구분합니다.",
  },
  gpu: {
    label: "GPU 아키텍처 기초",
    href: "/gpu/gpu-architecture",
    reason: "SM·warp·메모리 계층을 먼저 알면 최적화가 덜 추상적입니다.",
  },
  tee: {
    label: "하드웨어 보안 기초",
    href: "/tee/hw-security",
    reason: "위협 모델·TCB·원격 증명의 공통 경계를 먼저 잡습니다.",
  },
  "isms-aml": {
    label: "ISMS-P 인증 프로세스",
    href: "/isms-aml/isms-overview",
    reason: "통제 항목을 자산·위험·증적이라는 전체 흐름에 놓습니다.",
  },
};

const SUBCATEGORY_STARTS: Record<string, GuidanceLink> = {
  "ai-foundations": {
    label: "딥러닝 전체 지도",
    href: "/ai/deep-learning-overview",
    reason: "퍼셉트론에서 학습·평가까지 공통 좌표를 먼저 잡습니다.",
  },
  "ai-nlp": {
    label: "분포 의미론",
    href: "/ai/distributional-semantics",
    reason: "텍스트를 벡터로 표현하는 출발점부터 잡습니다.",
  },
  "ai-vision": {
    label: "CNN 기초",
    href: "/ai/cnn",
    reason: "이미지의 공간 구조를 모델이 어떻게 읽는지 먼저 봅니다.",
  },
  "ai-timeseries": {
    label: "ARIMA 기초",
    href: "/ai/arima",
    reason: "추세·차분·자기상관이라는 시계열 기준선을 먼저 잡습니다.",
  },
  "ai-generative": {
    label: "생성 모델 전체 지도",
    href: "/ai/generative-theory",
    reason: "VAE·GAN·diffusion이 분포를 배우는 방식부터 비교합니다.",
  },
  "ai-agents": {
    label: "에이전틱 패턴",
    href: "/ai/agentic-patterns",
    reason: "도구 호출·루프·검증이라는 공통 실행 모델을 먼저 봅니다.",
  },
  "ai-llm-serving": {
    label: "vLLM 서빙 구조",
    href: "/ai/vllm-serving",
    reason: "요청·KV cache·scheduler가 만나는 전체 경로를 먼저 봅니다.",
  },
  "ai-llm-theory": {
    label: "Transformer 아키텍처",
    href: "/ai/transformer-architecture",
    reason: "attention·residual·MLP라는 기준 블록을 먼저 잡습니다.",
  },
  "ai-llm-applied": {
    label: "Open-R1 재현 흐름",
    href: "/ai/open-r1",
    reason: "Reasoning data·SFT·GRPO·평가의 전체 경로를 먼저 봅니다.",
  },
  "ai-agents-ops": {
    label: "LLM 하네스",
    href: "/ai/llm-harness",
    reason: "모델 밖의 컨텍스트·도구·검증 루프를 먼저 구분합니다.",
  },
  "ai-agents-claw-core": {
    label: "Claw Code 전체 아키텍처",
    href: "/ai/claw-overview",
    reason: "세션·도구·런타임의 요청 흐름을 먼저 잡습니다.",
  },
  "ai-agents-claw-security": {
    label: "Claw Code 권한 모델",
    href: "/ai/claw-permissions",
    reason: "모델의 tool call과 실제 실행 권한을 먼저 구분합니다.",
  },
  "ai-agents-claw-lifecycle": {
    label: "Worker 부트와 신뢰 판정",
    href: "/ai/claw-worker-boot",
    reason: "외부 프로세스가 작업 가능 상태가 되는 순서를 먼저 봅니다.",
  },
  "ai-agents-claw-infra": {
    label: "MCP 라이프사이클",
    href: "/ai/claw-mcp",
    reason: "외부 서버가 내부 tool registry에 연결되는 경로를 먼저 봅니다.",
  },
  "ai-agents-claw-ops": {
    label: "Policy engine과 작업 Lane",
    href: "/ai/claw-policy-engine",
    reason: "상태·규칙·품질 게이트의 관계를 먼저 잡습니다.",
  },
  "ai-from-scratch": {
    label: "자동 미분 엔진 구현",
    href: "/ai/dezero-autodiff",
    reason: "계산 그래프와 gradient가 이후 레이어 구현의 기반입니다.",
  },
  "ai-practical-data": {
    label: "EDA 워크플로우",
    href: "/ai/eda-workflow",
    reason: "행의 의미·데이터 품질·split 경계를 먼저 확인합니다.",
  },
  "ai-practical-tabular": {
    label: "Gradient Boosting",
    href: "/ai/gradient-boosting",
    reason: "테이블 모델링의 강한 baseline을 먼저 잡습니다.",
  },
  "ai-practical-pipeline": {
    label: "PyTorch 학습 파이프라인",
    href: "/ai/training-pipeline",
    reason: "데이터·학습 루프·checkpoint·관측의 전체 뼈대를 먼저 봅니다.",
  },
  "ai-practical-cv": {
    label: "이미지 분류 파이프라인",
    href: "/ai/image-classification-pipeline",
    reason: "데이터 경계부터 학습·후처리까지 기준 파이프라인을 먼저 봅니다.",
  },
  "ai-practical-embedding": {
    label: "문장 임베딩",
    href: "/ai/sentence-embeddings",
    reason: "pooling·contrastive 학습·retrieval 평가의 기준을 먼저 잡습니다.",
  },
  "ai-practical-compression": {
    label: "모델 압축 파이프라인",
    href: "/ai/compression-pipeline",
    reason: "양자화·pruning·distillation의 역할과 측정 경계를 먼저 봅니다.",
  },
  "ai-practical-llm": {
    label: "LoRA Fine-tuning",
    href: "/ai/lora-finetuning",
    reason: "전체 fine-tuning과 PEFT의 메모리·배포 차이를 먼저 봅니다.",
  },
  "ai-practical-strategy": {
    label: "실험 추적",
    href: "/ai/experiment-tracking",
    reason:
      "재현 가능한 비교 단위를 먼저 만든 뒤 탐색과 ensemble로 확장합니다.",
  },
  "bft-consensus": {
    label: "비잔틴 장애 모델",
    href: "/blockchain/bft-theory",
    reason: "안전성·활성·f<n/3이 각 프로토콜 비교의 기준입니다.",
  },
  "eth-reth": {
    label: "Reth 아키텍처 개요",
    href: "/blockchain/reth",
    reason: "pipeline·provider·DB·EVM의 경계를 먼저 잡습니다.",
  },
  "eth-prysm": {
    label: "Ethereum 노드 아키텍처",
    href: "/blockchain/node-architecture",
    reason: "CL·EL과 Engine API의 역할을 먼저 구분합니다.",
  },
  "cosmos-core": {
    label: "CometBFT 아키텍처",
    href: "/blockchain/cometbft",
    reason: "합의·ABCI·mempool·state의 큰 경계를 먼저 봅니다.",
  },
  "fil-proofs": {
    label: "Filecoin 저장 증명 개요",
    href: "/blockchain/filecoin-proofs",
    reason: "PoRep·PoSt·SNARK가 언제 필요한지 먼저 연결합니다.",
  },
  "fil-lotus": {
    label: "Lotus 아키텍처",
    href: "/blockchain/filecoin-lotus",
    reason: "chain·miner·market·state의 소유권을 먼저 봅니다.",
  },
  "zkp-math": {
    label: "유한체 이론",
    href: "/crypto/finite-field-theory",
    reason: "정수 계산과 체 연산의 차이를 먼저 구분합니다.",
  },
  "zk-acceleration": {
    label: "MSM & NTT 이론",
    href: "/gpu/msm-ntt",
    reason: "커널보다 먼저 병렬화할 수학 연산의 형태를 봅니다.",
  },
  "p2p-discovery": {
    label: "Kademlia DHT",
    href: "/p2p/kademlia",
    reason: "XOR 거리·k-bucket·반복 탐색의 기준을 먼저 잡습니다.",
  },
  "p2p-libp2p": {
    label: "rust-libp2p Swarm",
    href: "/p2p/libp2p",
    reason: "transport·upgrade·muxer·behaviour의 조립 순서를 먼저 봅니다.",
  },
};

export function inferArticleIntent(article: Article): ArticleIntent {
  const override = ARTICLE_INTENT_OVERRIDES[article.slug];
  if (override) return override;
  if (/실측|사내|사례|해보니|B300/.test(article.title)) return "사례·실측";
  if (/비교|vs|선택/i.test(article.title)) return "비교·선택";
  if (/구현|코드|내부|아키텍처|SDK|클라이언트|프레임워크/.test(article.title)) {
    return "구현 추적";
  }
  if (/논문|paper|테크 리포트|technical report/i.test(article.title)) {
    return "논문·프로젝트 해설";
  }
  if (/운영|실전|인프라|보안|체크리스트|관리|대응|배포/.test(article.title)) {
    return "운영 가이드";
  }
  return "개념 지도";
}

export function getBeginnerStart(
  category: Category,
  article: Article,
): GuidanceLink | undefined {
  const candidate =
    SUBCATEGORY_STARTS[article.subcategory] ?? CATEGORY_STARTS[category.slug];
  if (!candidate) return undefined;
  return candidate.href === `/${category.slug}/${article.slug}`
    ? undefined
    : candidate;
}

export const CONCEPT_REUSE: Record<string, readonly GuidanceLink[]> = {
  "ai/llm-harness": [
    {
      label: "Agent pattern의 control flow",
      href: "/ai/agentic-patterns",
      reason:
        "이 글은 전체 실행 계약을 소유하고, ReAct·plan-execute·multi-agent의 세부 control flow는 agent pattern 정본에서 이어집니다.",
    },
    {
      label: "Context 선택·memory·compaction",
      href: "/ai/context-engineering",
      reason:
        "Context discovery 원칙만 여기서 사용하고, retrieval·memory·compaction의 세부 방법은 context engineering 글이 소유합니다.",
    },
    {
      label: "Skill의 포맷과 progressive disclosure",
      href: "/ai/skills-anatomy",
      reason:
        "Skill은 하네스가 불러오는 context·script 자산이며, 디렉터리 구조와 authoring 규칙은 Skills 정본에서 봅니다.",
    },
    {
      label: "Sandbox와 egress 보안",
      href: "/ai/agent-sandbox-security",
      reason:
        "Capability admission보다 아래의 process·network·kernel isolation은 sandbox 보안 글이 소유합니다.",
    },
  ],
  "ai/agentic-patterns": [
    {
      label: "LLM 하네스의 목표·권한·복구",
      href: "/ai/llm-harness",
      reason:
        "이 글은 control-flow 패턴을 소유하고, 전체 실행 계약·평가 개선 loop는 하네스 정본에서 이어집니다.",
    },
    {
      label: "Multi-agent runtime 구현",
      href: "/ai/multi-agent-implementation",
      reason:
        "Delegation·ownership 원리를 실제 context 격리·checkpoint·merge로 내리는 구현은 별도 글이 소유합니다.",
    },
    {
      label: "Skill authoring format",
      href: "/ai/skills-anatomy",
      reason:
        "Skill directory·progressive disclosure·script 구조는 Skills 정본에서 자세히 다룹니다.",
    },
    {
      label: "Sandbox와 egress 보안",
      href: "/ai/agent-sandbox-security",
      reason:
        "Tool capability보다 아래의 process·network·kernel isolation은 sandbox 보안 글에서 이어집니다.",
    },
  ],
  "ai/distributional-semantics": [
    {
      label: "행렬·SVD 선수 개념",
      href: "/ai/math-matrices-svd",
      reason:
        "이 글은 SVD 정의를 다시 소유하지 않고, weighted word–context matrix에 적용하는 선택과 평가 경계만 다룹니다.",
    },
    {
      label: "Word2Vec 학습 objective",
      href: "/ai/word2vec",
      reason:
        "이 글은 count·prediction 방법의 이론적 연결을 소유하고, CBOW·Skip-gram·negative sampling의 실제 update는 Word2Vec 글에서 이어집니다.",
    },
    {
      label: "Tokenizer와 vocabulary 계약",
      href: "/ai/tokenizer",
      reason:
        "Corpus 문자열이 token ID와 vocabulary가 되는 과정은 tokenizer 정본이 소유합니다.",
    },
    {
      label: "Contextual encoder의 visibility",
      href: "/ai/bert",
      reason:
        "문장마다 달라지는 contextual representation과 MLM 학습 계약은 BERT 글에서 이어집니다.",
    },
  ],
  "ai/resnet": [
    {
      label: "CNN의 convolution과 receptive field",
      href: "/ai/cnn",
      reason:
        "이 글은 convolution을 다시 정의하지 않고 residual parameterization과 block 경계에 집중합니다.",
    },
    {
      label: "Activation과 gradient",
      href: "/ai/activation-functions",
      reason:
        "ReLU·pre-activation과 activation Jacobian의 공통 원리는 activation 정본에서 이어집니다.",
    },
    {
      label: "Chain rule과 역전파",
      href: "/ai/backprop-optimization",
      reason:
        "Jacobian-vector product와 gradient 누적의 기본기는 역전파 정본에서 먼저 볼 수 있습니다.",
    },
  ],
  "ai/cnn": [
    {
      label: "Activation function",
      href: "/ai/activation-functions",
      reason:
        "Convolution 뒤의 ReLU·GELU와 gated block은 activation 정본에서 봅니다.",
    },
    {
      label: "ResNet",
      href: "/ai/resnet",
      reason:
        "Identity shortcut과 residual gradient path의 수식은 ResNet 글이 소유합니다.",
    },
    {
      label: "Vision Transformer",
      href: "/ai/vision-transformer",
      reason: "Patch embedding과 image attention은 ViT 글에서 이어집니다.",
    },
  ],
  "ai/bert": [
    {
      label: "Tokenizer와 model ID 계약",
      href: "/ai/tokenizer",
      reason: "WordPiece·special token·ID 호환성은 tokenizer 글이 소유합니다.",
    },
    {
      label: "Transformer block과 self-attention",
      href: "/ai/transformer-architecture",
      reason:
        "이 글은 Q·K·V 계산을 반복하지 않고 BERT의 visibility·objective·transfer recipe에 집중합니다.",
    },
  ],
  "ai/rlhf": [
    {
      label: "Open-R1의 online reasoning 학습",
      href: "/ai/open-r1",
      reason:
        "이 글은 preference alignment의 목적함수와 feedback 계약을 소유하고, reasoning reward·GRPO의 재현 파이프라인은 Open-R1 글에서 이어갑니다.",
    },
  ],
  "ai/open-r1": [
    {
      label: "RLHF와 feedback 계약",
      href: "/ai/rlhf",
      reason:
        "이 글은 preference alignment 전체를 반복하지 않고 verifiable reward·GRPO·reasoning recipe 재현에 집중합니다.",
    },
    {
      label: "지식 증류의 일반 원리",
      href: "/ai/knowledge-distillation",
      reason:
        "Teacher–student distillation의 temperature·loss 일반론은 정본 글에서 보고, 여기서는 reasoning trace SFT의 data boundary를 봅니다.",
    },
  ],
  "ai/claw-mcp": [
    {
      label: "MCP 프로토콜 기초",
      href: "/ai/mcp-protocol",
      reason:
        "이 글은 tools·resources·prompts를 다시 정의하지 않고 Claw Code의 연결 생명주기에 집중합니다.",
    },
  ],
  "ai/claw-subagent-orchestration": [
    {
      label: "에이전틱 패턴의 기본 루프",
      href: "/ai/agentic-patterns",
      reason:
        "여기서는 ReAct를 반복하지 않고 sub-agent의 작업 계약·격리·합류를 설명합니다.",
    },
  ],
  "ai/tabular-deep-learning": [
    {
      label: "Gradient Boosting baseline",
      href: "/ai/gradient-boosting",
      reason:
        "테이블 딥러닝의 가치는 같은 split과 예산의 GBM 기준선 위에서 비교해야 합니다.",
    },
  ],
  "ai/ecod": [
    {
      label: "EDA와 split 경계",
      href: "/ai/eda-workflow",
      reason:
        "결측값·중복 feature·시간 누출과 reference population은 EDA 단계에서 먼저 고정합니다.",
    },
  ],
  "ai/gan": [
    {
      label: "생성 모델 전체 지도",
      href: "/ai/generative-theory",
      reason:
        "Explicit likelihood·latent variable·flow·diffusion과 비교한 GAN의 위치는 정본 지도에서 먼저 봅니다.",
    },
    {
      label: "Diffusion model",
      href: "/ai/diffusion-models",
      reason:
        "Iterative denoising의 objective와 sampling path는 diffusion 정본 글에서 이어집니다.",
    },
  ],
  "ai/llm-serving-ops": [
    {
      label: "vLLM 서빙 구조",
      href: "/ai/vllm-serving",
      reason:
        "이 글은 engine 내부 batching·scheduler·KV cache를 반복하지 않고, 그 결과를 gateway·fleet·SLO 제어로 연결합니다.",
    },
    {
      label: "Hybrid attention의 KV capacity",
      href: "/ai/hybrid-attention-serving",
      reason:
        "KV head·head_dim·local/global layer가 concurrency를 바꾸는 계산과 모델 실측은 이 정본 글에서 이어집니다.",
    },
  ],
  "ai/deepfake-detection": [
    {
      label: "이미지 분류 기준 파이프라인",
      href: "/ai/image-classification-pipeline",
      reason:
        "이 글은 분류 학습을 반복하지 않고 생성기·코덱·영상 출처의 distribution shift에 집중합니다.",
    },
  ],
  "ai/compression-pipeline": [
    {
      label: "양자화",
      href: "/ai/quantization",
      reason: "정밀도와 calibration의 세부 원리는 양자화 글에서 봅니다.",
    },
    {
      label: "Pruning",
      href: "/ai/pruning",
      reason: "가중치 sparsity와 구조 제거의 차이는 pruning 글에서 봅니다.",
    },
    {
      label: "Knowledge Distillation",
      href: "/ai/knowledge-distillation",
      reason:
        "teacher signal과 temperature의 원리는 distillation 글에서 봅니다.",
    },
  ],
  "ai/sionic-eureka": [
    {
      label: "문장 임베딩과 retrieval 평가",
      href: "/ai/sentence-embeddings",
      reason:
        "EUREKA 글은 임베딩 기초를 반복하지 않고 데이터 구성·hard negative·distillation 실험에 집중합니다.",
    },
  ],
  "ai/lstm-timeseries": [
    {
      label: "LSTM gate와 cell state의 기본 원리",
      href: "/ai/lstm",
      reason:
        "이 글은 LSTM 수식을 다시 정의하기보다 시계열 window·학습·평가 파이프라인에 집중합니다.",
    },
  ],
  "ai/sparse-autoencoder": [
    {
      label: "Autoencoder의 encoder·decoder와 reconstruction",
      href: "/ai/autoencoder",
      reason:
        "이 글은 일반 autoencoder를 반복하지 않고 LLM activation에 대한 overcomplete sparse dictionary와 해석 검증을 다룹니다.",
    },
  ],
  "crypto/fft": [
    {
      label: "FFT의 복소수·주파수 직관",
      href: "/ai/fft",
      reason:
        "이 글은 그 설명을 반복하지 않고 유한체 NTT와 ZK 사용에 집중합니다.",
    },
  ],
  "gpu/ntt-gpu-impl": [
    {
      label: "FFT / NTT 수학",
      href: "/crypto/fft",
      reason:
        "여기서는 butterfly를 다시 정의하지 않고 GPU 배치와 메모리 전략을 소유합니다.",
    },
  ],
  "gpu/msm-gpu-impl": [
    {
      label: "MSM & NTT 이론",
      href: "/gpu/msm-ntt",
      reason: "이 글은 Pippenger 설명보다 bucket kernel 구현에 집중합니다.",
    },
  ],
  "blockchain/filecoin-f3": [
    {
      label: "GossiPBFT 프로토콜",
      href: "/blockchain/gossipbft",
      reason:
        "F3 글은 프로토콜 정의를 반복하지 않고 Lotus 통합과 finality 전환을 설명합니다.",
    },
  ],
  "blockchain/cometbft-consensus": [
    {
      label: "Tendermint BFT 원리",
      href: "/blockchain/tendermint-bft",
      reason:
        "이 글은 합의 원리보다 CometBFT 상태 머신과 코드 경로를 소유합니다.",
    },
  ],
  "blockchain/bft-comparison": [
    {
      label: "전체 합의 선택 지도",
      href: "/blockchain/consensus-comparison",
      reason:
        "이 글은 전체 합의를 다시 비교하지 않고 리더 기반 BFT의 진화만 좁게 봅니다.",
    },
  ],
};

const flow = (
  title: string,
  question: string,
  nodes: readonly ConceptFlowNode[],
  takeaway: string,
): ConceptFlow => ({ title, question, nodes, takeaway });

export const ARTICLE_CONCEPT_FLOWS: Record<string, ConceptFlow> = {
  "ai/perceptron": flow(
    "Linear score에서 nonlinear hidden representation까지",
    "Input vector를 직선 하나로 나누는 모델은 어떻게 학습하며, XOR에서 드러난 표현 한계를 다층 network가 어떻게 바꿀까?",
    [
      {
        label: "Score & threshold",
        detail:
          "Weight로 input을 한 방향에 projection하고 bias와 step activation으로 hard prediction을 만듭니다.",
      },
      {
        label: "Decision geometry",
        detail:
          "z=0 hyperplane과 양쪽 half-space를 읽고 논리 gate의 네 점을 직접 검산합니다.",
      },
      {
        label: "Mistake-driven update",
        detail:
          "오분류한 example에서만 경계를 이동하고 positive margin 아래의 convergence 범위를 확인합니다.",
      },
      {
        label: "XOR limitation",
        detail:
          "네 부등식의 모순으로 단층 model class의 linear separability 한계를 증명합니다.",
      },
      {
        label: "Nonlinear remapping",
        detail:
          "Hidden activation이 새 feature 좌표를 만들고 output layer가 그 공간을 다시 선형 분리합니다.",
      },
    ],
    "퍼셉트론의 핵심은 뉴런 비유가 아니라 linear decision boundary와 mistake-driven update이며, MLP의 핵심은 nonlinear intermediate representation입니다.",
  ),
  "ai/deep-learning-overview": flow(
    "입력과 target에서 학습된 모델의 검증까지",
    "데이터 한 batch는 어떤 계산을 거쳐 파라미터 update가 되고, 그 결과가 새 data에서도 유효한지는 어떻게 분리해 확인할까?",
    [
      {
        label: "Problem & data contract",
        detail:
          "Input x, target y, tensor shape와 train·validation·test의 역할을 먼저 고정합니다.",
      },
      {
        label: "Forward representation",
        detail:
          "현재 parameter θ로 prediction과 각 층의 intermediate representation을 계산합니다.",
      },
      {
        label: "Loss & gradient",
        detail:
          "Prediction과 target의 차이를 scalar loss로 만들고 backpropagation으로 parameter별 gradient를 구합니다.",
      },
      {
        label: "Optimizer update",
        detail:
          "Gradient와 optimizer state로 다음 θ를 만들며 이 전체가 한 training step입니다.",
      },
      {
        label: "Generalization & runtime",
        detail:
          "독립 split에서 generalization을 확인하고 학습과 inference의 compute·memory 경계를 나눕니다.",
      },
    ],
    "딥러닝은 모델 이름의 목록이 아니라 data contract → forward → objective → gradient → update → independent evaluation으로 이어지는 계산 시스템입니다.",
  ),
  "ai/llm-harness": flow(
    "자연어 요청에서 검증 가능하고 복구 가능한 run까지",
    "Model이 tool로 실제 환경을 바꾸는 동안 목표·권한·state·검증·복구를 어느 계층에서 보장해야 할까?",
    [
      {
        label: "Responsibility boundary",
        detail:
          "Model proposal과 runtime의 authorization·execution·observation 책임을 분리합니다.",
      },
      {
        label: "Run contract",
        detail:
          "Objective·context·authority·artifact·verifier·recovery를 판정 가능한 필드로 고정합니다.",
      },
      {
        label: "Evaluation stack",
        detail:
          "Final artifact뿐 아니라 trajectory·side effect·cost를 deterministic oracle부터 평가합니다.",
      },
      {
        label: "Improvement loop",
        detail:
          "Failure trace를 재현 case와 regression suite로 만들고 해당 하네스 계층만 수정합니다.",
      },
      {
        label: "Control-flow choice",
        detail:
          "경로 불확실성과 side-effect 위험으로 workflow·agent loop·checkpoint graph를 섞습니다.",
      },
    ],
    "하네스 엔지니어링은 모델에게 지침을 많이 붙이는 일이 아니라, 실행 가능한 자유와 시스템이 강제할 invariant를 분리하는 일입니다.",
  ),
  "ai/agentic-patterns": flow(
    "Model 제안에서 검증 가능한 multi-step run까지",
    "LLM이 tool로 환경을 바꾸는 동안 어떤 state·plan·delegation·verifier 경계를 두어야 run을 안전하게 끝낼 수 있을까?",
    [
      {
        label: "Observable run state",
        detail:
          "User input·tool result·artifact·budget·exit status를 typed state로 두고 model proposal과 runtime execution을 분리합니다.",
      },
      {
        label: "ReAct observation loop",
        detail:
          "Action 뒤 외부 observation으로 판단을 갱신하고 schema·permission·idempotency를 통과시킵니다.",
      },
      {
        label: "Plan & verification",
        detail:
          "Dependency·artifact·evidence가 있는 plan state를 verifier 결과에 따라 checkpoint·replan합니다.",
      },
      {
        label: "Delegation contract",
        detail:
          "Multi-agent는 objective·context·authority·output·acceptance를 나누고 공유 state owner를 고정합니다.",
      },
      {
        label: "Extension & evaluation",
        detail:
          "Hook·Skill·Guardrail·Verifier의 시점과 권한을 나누고 answer·trajectory·side effect를 함께 평가합니다.",
      },
    ],
    "Agent pattern은 모델을 여러 번 부르는 이름이 아니라 observation·permission·artifact·verification·ownership을 연결하는 control flow입니다.",
  ),
  "ai/distributional-semantics": flow(
    "Corpus의 사용 패턴에서 검증 가능한 word vector까지",
    "단어가 나타난 context를 어떻게 세고 압축해야 vector의 거리와 방향을 제한된 의미 evidence로 해석할 수 있을까?",
    [
      {
        label: "Representation contract",
        detail:
          "One-hot identity와 distributional usage evidence를 구분하고 corpus·tokenization 경계를 고정합니다.",
      },
      {
        label: "Context observation",
        detail:
          "Window·direction·dependency·document 중 무엇을 context feature로 세는지 정의합니다.",
      },
      {
        label: "Association weighting",
        detail:
          "Raw frequency를 independence baseline과 비교해 PMI·PPMI로 바꾸고 희귀 pair의 편향을 봅니다.",
      },
      {
        label: "Compression objective",
        detail:
          "SVD·SGNS·GloVe가 explicit 또는 implicit word–context evidence를 어떻게 압축하는지 연결합니다.",
      },
      {
        label: "Evaluation boundary",
        detail:
          "Cosine·analogy 같은 intrinsic probe와 downstream·robustness·bias audit를 분리합니다.",
      },
    ],
    "Embedding은 단어 의미의 정답표가 아니라 corpus·context·weighting·objective·evaluation 계약으로 만든 distributional measurement입니다.",
  ),
  "ai/resnet": flow(
    "Degradation 관찰에서 배포 가능한 residual backbone까지",
    "더 깊은 plain network의 training error가 오히려 커질 때, residual parameterization은 optimization 경로를 어떻게 바꿀까?",
    [
      {
        label: "Optimization observation",
        detail:
          "Overfitting·vanishing gradient와 구분해, depth 증가 뒤 training error가 악화된 degradation 실험부터 봅니다.",
      },
      {
        label: "Residual parameterization",
        detail:
          "전체 mapping H(x) 대신 입력에 더할 update F(x)를 학습해 identity를 직접 표현하는 원리를 세웁니다.",
      },
      {
        label: "Signal & gradient path",
        detail:
          "Forward의 representation transport와 backward의 I+J_F 항을 보되 gradient 보장으로 과장하지 않습니다.",
      },
      {
        label: "Block & shape contract",
        detail:
          "BasicBlock·Bottleneck·projection·pre-activation의 width·stride·addition shape를 계산합니다.",
      },
      {
        label: "Evidence & selection",
        detail:
          "원 논문·후속 해석의 근거 수준을 나누고 stage feature·latency·memory에 맞는 backbone을 고릅니다.",
      },
    ],
    "ResNet의 핵심은 skip line 하나가 아니라 identity를 포함하는 parameterization, 두 branch의 tensor contract, 그리고 실제 training recipe가 함께 만드는 optimization 경로입니다.",
  ),
  "ai/open-r1": flow(
    "공개 claim에서 재현 가능한 reasoning recipe까지",
    "Reasoning model의 weight가 공개돼도 빠져 있는 data·training·verification·evaluation 경로를 어떻게 다시 만들까?",
    [
      {
        label: "Reproduction contract",
        detail:
          "Distillation·R1-Zero-like RL·multi-stage recipe 중 무엇을 재현하는지 먼저 고정합니다.",
      },
      {
        label: "SFT boundary",
        detail:
          "Teacher trace가 어떤 token mask·template·EOS·sequence policy로 student behavior가 되는지 봅니다.",
      },
      {
        label: "On-policy GRPO",
        detail:
          "현재 policy rollout, group-relative advantage, clipped update와 sampler–trainer mismatch를 추적합니다.",
      },
      {
        label: "Verifier boundary",
        detail:
          "Math·code·format reward가 관측하는 outcome과 놓치는 reasoning·security 실패를 분리합니다.",
      },
      {
        label: "Data & evaluation",
        detail:
          "Synthetic trace lineage·decontamination과 sampling·uncertainty·cost를 포함한 평가 계약을 고정합니다.",
      },
    ],
    "Open-R1 재현의 단위는 model weight 하나가 아니라 base checkpoint·data lineage·sampler·verifier·trainer·evaluation protocol이 연결된 executable recipe입니다.",
  ),
  "ai/llm-serving-ops": flow(
    "Workload SLO에서 검증 가능한 운영 제어까지",
    "길이와 실행 시간이 제각각인 LLM 요청을 어떻게 예측 가능한 지연과 실패 범위 안에서 운영할까?",
    [
      {
        label: "Service contract",
        detail:
          "Workload별 TTFT·TPOT·완료율·비용과 context·tool·region capability를 먼저 고정합니다.",
      },
      {
        label: "Gateway policy",
        detail:
          "호환 후보를 먼저 거르고 deadline·retry·fallback과 실행 provenance를 한 경계에서 관리합니다.",
      },
      {
        label: "Ready capacity",
        detail:
          "HPA가 원하는 Pod와 실제 traffic을 받을 GPU model replica 사이의 cold-start 경로를 측정합니다.",
      },
      {
        label: "Traffic lifecycle",
        detail:
          "Artifact·startup·readiness·canary·drain을 분리해 rollout과 autoscaling의 admission을 통제합니다.",
      },
      {
        label: "Closed-loop operations",
        detail:
          "사용자 SLI와 error-budget burn rate를 원인 신호·scale·route·rollback 결과에 다시 연결합니다.",
      },
    ],
    "LLM 서빙 운영은 GPU utilization을 높이는 작업이 아니라 workload contract를 gateway·Ready capacity·deployment lifecycle·error budget에 걸쳐 보존하는 control-plane 설계입니다.",
  ),
  "ai/gan": flow(
    "Latent prior에서 검증 가능한 sample generator까지",
    "Density를 직접 계산하지 않는 generator가 data distribution을 닮도록 어떤 학습 신호를 받을 수 있을까?",
    [
      {
        label: "Generation contract",
        detail:
          "Target distribution·condition·latent prior·sample output과 density가 없는 implicit model의 경계를 고정합니다.",
      },
      {
        label: "Density-ratio game",
        detail:
          "Discriminator가 real/fake 분류를 통해 두 분포의 차이를 추정하는 원리를 봅니다.",
      },
      {
        label: "Generator signal",
        detail:
          "Minimax와 non-saturating loss가 같은 equilibrium을 겨냥하면서 gradient는 왜 다른지 추적합니다.",
      },
      {
        label: "Game dynamics",
        detail:
          "두 optimizer·detach 경계·update ratio·Lipschitz constraint가 상호작용하는 방식을 봅니다.",
      },
      {
        label: "Coverage & evaluation",
        detail:
          "Sample quality와 mode coverage를 분리하고 condition·architecture·objective 변형을 선택합니다.",
      },
    ],
    "GAN은 generator와 discriminator가 단순히 경쟁하는 그림이 아니라, 학습된 critic으로 distribution discrepancy의 gradient를 만들어 implicit generator에 전달하는 two-player optimization system입니다.",
  ),
  "ai/ecod": flow(
    "이상치 질문에서 운영 alert까지",
    "Label이 없는 tabular data에서 어떤 관측값을 먼저 검토할지, marginal rank만으로 어떻게 우선순위를 만들 수 있을까?",
    [
      {
        label: "Detection contract",
        detail:
          "Row·feature·reference population·score와 binary decision의 의미를 먼저 고정합니다.",
      },
      {
        label: "Marginal rank",
        detail:
          "Feature마다 ECDF를 만들어 단위가 다른 값을 0~1의 경험적 순위로 바꿉니다.",
      },
      {
        label: "Tail evidence",
        detail:
          "왼쪽·오른쪽 tail probability에 −log를 적용하고 skewness로 방향을 선택합니다.",
      },
      {
        label: "Aggregation contract",
        detail:
          "원 논문의 sample-level max와 현재 PyOD의 feature-level max가 다른 점을 추적합니다.",
      },
      {
        label: "Decision & evaluation",
        detail:
          "연속 score와 contamination threshold를 분리하고 label·review budget에 맞춰 검증합니다.",
      },
    ],
    "ECOD는 범용 이상 탐지기가 아니라 각 feature의 분포 끝에 나타나는 global anomaly를 빠르게 순위화하는 detector이며, 배포에서는 score 공식·reference population·threshold를 함께 versioning해야 합니다.",
  ),
  "ai/cnn": flow(
    "Image tensor에서 task·hardware 선택까지",
    "Pixel grid의 어떤 구조를 architecture에 미리 넣으면 적은 parameter로 spatial pattern을 학습할 수 있을까?",
    [
      {
        label: "Tensor & task",
        detail:
          "B×C×H×W input과 classification·detection·segmentation의 서로 다른 output contract를 고정합니다.",
      },
      {
        label: "Local operator",
        detail:
          "한 kernel이 local window의 모든 input channel을 읽고 모든 위치에 공유되는 계산을 봅니다.",
      },
      {
        label: "Spatial geometry",
        detail:
          "Kernel·stride·padding·dilation이 output shape와 sampling grid를 어떻게 바꾸는지 추적합니다.",
      },
      {
        label: "Inductive bias",
        detail:
          "Translation equivariance와 receptive field가 주는 이득·경계·aliasing을 구분합니다.",
      },
      {
        label: "System choice",
        detail:
          "Residual·depthwise·large kernel·attention과 task head를 data·latency·memory 기준으로 비교합니다.",
      },
    ],
    "CNN은 edge detector의 목록이 아니라 locality와 translation-equivariant weight sharing을 tensor operator에 넣고, depth를 통해 그 receptive field를 넓히는 model family입니다.",
  ),
  "ai/bert": flow(
    "Bidirectional representation에서 task-specific prediction까지",
    "다음 token을 생성하지 않는 encoder가 unlabeled text에서 어떤 signal을 얻고 downstream task에 어떻게 전달할까?",
    [
      {
        label: "Representation target",
        detail:
          "Token별 contextual representation이 필요한 이해 task와 left-to-right generation을 구분합니다.",
      },
      {
        label: "Visibility contract",
        detail:
          "모든 실제 token이 양쪽 문맥을 보되 padding은 가리는 encoder attention mask를 봅니다.",
      },
      {
        label: "Corruption objective",
        detail:
          "MLM의 selected position·80/10/10 replacement·loss 위치를 서로 구분합니다.",
      },
      {
        label: "Recipe evidence",
        detail:
          "NSP·static mask·data·batch를 RoBERTa·ALBERT·ELECTRA가 어떻게 재검토했는지 봅니다.",
      },
      {
        label: "Transfer interface",
        detail:
          "Sequence·token·span·retrieval task가 어느 hidden representation을 읽는지 정합니다.",
      },
    ],
    "BERT의 정본은 단순히 ‘양방향 Transformer’가 아니라 masked corruption으로 encoder를 사전학습하고 task head와 함께 전체 weight를 transfer하는 recipe입니다.",
  ),
  "ai/tokenizer": flow(
    "Raw text에서 model-compatible token IDs까지",
    "겉으로 같은 문장을 어떻게 안정적으로 integer sequence로 바꾸고, 그 선택의 비용과 손실을 어떻게 측정할까?",
    [
      {
        label: "Text contract",
        detail:
          "Unicode string·byte·정규화·원문 offset 중 무엇을 보존해야 하는지 정합니다.",
      },
      {
        label: "Pipeline",
        detail:
          "Normalizer → pre-tokenizer → subword model → post-processor → ID mapping을 분리합니다.",
      },
      {
        label: "Segmentation model",
        detail:
          "BPE merge·WordPiece greedy match·Unigram probability가 vocabulary를 쓰는 방식을 비교합니다.",
      },
      {
        label: "Model compatibility",
        detail:
          "Token ID·special token·embedding row가 하나의 checkpoint 계약임을 확인합니다.",
      },
      {
        label: "Corpus evaluation",
        detail:
          "언어·code·URL별 length, fallback, truncation, round-trip과 vocabulary parameter를 측정합니다.",
      },
    ],
    "Tokenizer는 문자열을 잘게 자르는 전처리 도구가 아니라 normalization부터 special-token ID까지 model embedding과 묶여 있는 versioned interface입니다.",
  ),
  "ai/sparse-autoencoder": flow(
    "Activation 표본에서 제한된 causal claim까지",
    "Dense activation을 sparse feature로 분해했을 때, 무엇을 관찰했다고 말할 수 있고 어디부터 별도 검증이 필요할까?",
    [
      {
        label: "Measurement target",
        detail:
          "Model·layer·token·hook point와 activation corpus를 먼저 고정합니다.",
      },
      {
        label: "Representation hypothesis",
        detail:
          "Neuron 축보다 많은 sparse feature direction이 activation에 겹쳐 있다는 가설을 분리해 봅니다.",
      },
      {
        label: "Dictionary objective",
        detail:
          "Overcomplete decoder와 L1·JumpReLU·Top-K가 reconstruction–sparsity trade-off를 만드는 방식을 봅니다.",
      },
      {
        label: "Quality frontier",
        detail:
          "FVE·L0·downstream loss recovery·dead latent를 같은 sparsity 조건에서 측정합니다.",
      },
      {
        label: "Interpretation test",
        detail:
          "Activation example·negative control·ablation·steering을 거쳐 feature label의 범위를 제한합니다.",
      },
    ],
    "SAE feature는 모델 안에 원래 붙어 있던 이름표가 아니라 특정 activation 분포를 sparse하게 복원하도록 사후 학습한 좌표이므로, 해석 가능성과 causal role을 따로 검증해야 합니다.",
  ),
  "ai/lstm-timeseries": flow(
    "Forecast origin에서 운영 평가까지",
    "LSTM의 gate를 이미 안다면, 실제 시계열을 어떤 sample과 state 계약으로 바꿔 미래 성능을 검증해야 할까?",
    [
      {
        label: "Forecast contract",
        detail:
          "Target·sampling interval·forecast origin·horizon과 미래에 알 수 있는 covariate를 먼저 고정합니다.",
      },
      {
        label: "Supervised windows",
        detail:
          "연속 시계열을 look-back L의 입력과 horizon H의 target pair로 바꾸되 각 sample의 cutoff를 보존합니다.",
      },
      {
        label: "Tensor & state",
        detail:
          "[batch, sequence, feature] 입력과 hidden·cell state의 수명, reset 경계를 명시합니다.",
      },
      {
        label: "Horizon strategy",
        detail:
          "Direct multi-output과 recursive decode의 병렬성·오차 누적·학습 조건 차이를 비교합니다.",
      },
      {
        label: "Temporal evaluation",
        detail:
          "Train-only transform, rolling origin, horizon별 metric과 동일 baseline으로 운영 조건을 재현합니다.",
      },
    ],
    "LSTM은 시간 구조를 자동으로 알아내는 장치가 아니라, 개발자가 정한 window·cutoff·state lifecycle을 비선형 함수로 학습하는 forecasting model입니다.",
  ),
  "ai/generative-theory": flow(
    "Data distribution에서 sampling algorithm까지",
    "관측한 sample만으로 새로운 sample을 만들려면 distribution을 어떤 형태로 표현하고 학습해야 할까?",
    [
      {
        label: "Distribution target",
        detail:
          "Unconditional p(x)와 condition이 있는 p(x|c), density estimation과 sampling 목적을 구분합니다.",
      },
      {
        label: "Tractability choice",
        detail:
          "Exact likelihood, variational bound, density ratio, score 중 계산 가능한 학습 신호를 선택합니다.",
      },
      {
        label: "Representation",
        detail:
          "Autoregressive order·latent variable·invertible map·noise path가 분포를 표현하는 방식을 봅니다.",
      },
      {
        label: "Sampling path",
        detail:
          "Sequential decode·one-pass generator·inverse flow·iterative denoising의 latency를 비교합니다.",
      },
      {
        label: "Evaluation boundary",
        detail:
          "Likelihood·sample quality·coverage·conditional fidelity가 서로 다른 질문임을 확인합니다.",
      },
    ],
    "VAE·GAN·flow·diffusion은 한 줄 계보가 아니라 tractable objective와 sampling path를 서로 다르게 선택한 model family입니다.",
  ),
  "ai/arima": flow(
    "예측 질문에서 ARIMA 기준선까지",
    "한 시계열의 추세와 시간 의존성을 어떻게 분리하고 미래 구간에서 검증할까?",
    [
      {
        label: "Forecast contract",
        detail:
          "Target·sampling interval·horizon·known-at-forecast-time 정보를 먼저 고정합니다.",
      },
      {
        label: "Stationary representation",
        detail: "차분과 변환으로 평균·분산·공분산이 안정된 표현을 찾습니다.",
      },
      {
        label: "ARMA dynamics",
        detail:
          "과거 관측의 관성과 과거 innovation의 잔여 효과를 서로 다른 항으로 추정합니다.",
      },
      {
        label: "Temporal validation",
        detail:
          "ACF·PACF·AIC는 후보를 만들고 rolling-origin과 residual이 최종 판단을 맡습니다.",
      },
      {
        label: "Extension boundary",
        detail:
          "계절성·외생 변수·구조 변화에 따라 SARIMA·dynamic regression·다른 model로 확장합니다.",
      },
    ],
    "ARIMA는 p·d·q를 맞히는 공식이 아니라 stationary representation을 설계하고 남은 선형 의존성을 진단하는 forecasting baseline입니다.",
  ),
  "ai/rlhf": flow(
    "Feedback을 policy update로 옮기는 네 가지 결정",
    "사람이나 AI가 남긴 판단을 어떤 데이터 계약과 optimization loop로 바꿔야 할까?",
    [
      {
        label: "Behavior target",
        detail:
          "도움됨·정확성·안전성처럼 원하는 behavior를 관측 가능한 rubric으로 정합니다.",
      },
      {
        label: "Feedback contract",
        detail:
          "Demonstration·pairwise preference·binary label·principle 중 실제로 얻을 수 있는 signal을 구분합니다.",
      },
      {
        label: "Score or direct loss",
        detail:
          "Scalar reward를 따로 학습할지, pair·label을 policy loss에 직접 넣을지 선택합니다.",
      },
      {
        label: "Online or offline",
        detail:
          "현재 policy를 sample하며 갱신할지, 고정된 dataset support 안에서 학습할지 결정합니다.",
      },
      {
        label: "Independent evaluation",
        detail:
          "Preference win rate와 capability·safety regression을 분리해 측정합니다.",
      },
    ],
    "PPO·DPO·ORPO·KTO는 하나의 순위표가 아니라 feedback 형태, online sampling, reference와 reward model의 필요성이 다른 학습 계약입니다.",
  ),
  "ai/neural-network": flow(
    "선형 경계에서 학습 가능한 MLP까지",
    "한 개의 affine boundary를 여러 단계의 learned representation으로 어떻게 확장할까?",
    [
      {
        label: "Representation",
        detail: "MLP를 neuron 모음보다 tensor를 바꾸는 함수 합성으로 봅니다.",
      },
      {
        label: "Nonlinearity",
        detail:
          "Affine chain이 한 layer로 접히는 이유와 activation의 역할을 확인합니다.",
      },
      {
        label: "Tensor contract",
        detail:
          "Batch·input·output 축과 initialization의 signal scale을 추적합니다.",
      },
      {
        label: "Prediction contract",
        detail:
          "Target 사건에서 output parameterization과 likelihood를 정합니다.",
      },
      {
        label: "Experiment boundary",
        detail:
          "MNIST에서 train/eval 분리와 underfit·overfit 진단을 연결합니다.",
      },
    ],
    "MLP는 뉴런을 많이 연결한 그림이 아니라, 중간 표현과 예측 분포를 함께 학습하는 parameterized function입니다.",
  ),
  "ai/seq2seq": flow(
    "조건부 sequence 확률에서 attention bridge까지",
    "길이와 순서가 다른 source·target을 하나의 end-to-end objective로 어떻게 연결할까?",
    [
      {
        label: "Conditional model",
        detail: "P(Y|X)를 target prefix별 next-token probability로 분해합니다.",
      },
      {
        label: "State handoff",
        detail:
          "Encoder 마지막 state가 decoder initial state로 넘어가는 interface를 봅니다.",
      },
      {
        label: "Autoregressive decode",
        detail:
          "Token 선택이 다음 prefix·state·sequence score를 바꾸는 과정을 추적합니다.",
      },
      {
        label: "Train/inference gap",
        detail:
          "Teacher forcing과 model-generated prefix의 조건 차이를 구분합니다.",
      },
      {
        label: "Attention bridge",
        detail:
          "Fixed context를 source position별 content-dependent read로 확장합니다.",
      },
    ],
    "Seq2Seq의 정본은 특정 LSTM 구조가 아니라 조건부 sequence factorization과 encoder–decoder 사이의 정보 전달 계약입니다.",
  ),
  "ai/word2vec": flow(
    "Corpus window에서 embedding 경계까지",
    "Local co-occurrence를 어떤 prediction objective로 바꾸면 word vector의 기하가 생길까?",
    [
      {
        label: "Pair sampling",
        detail:
          "Corpus와 window에서 word–context training examples를 만듭니다.",
      },
      {
        label: "Prediction direction",
        detail: "CBOW와 Skip-gram이 context·center를 반대로 예측합니다.",
      },
      {
        label: "Vocabulary bottleneck",
        detail: "Full softmax의 O(V) 계산과 대체 objective를 구분합니다.",
      },
      {
        label: "SGNS geometry",
        detail: "Positive·noise pair update와 shifted-PMI 해석을 연결합니다.",
      },
      {
        label: "Representation boundary",
        detail: "Cosine·analogy의 범위와 subword·contextual 대안을 비교합니다.",
      },
    ],
    "Word2Vec embedding은 의미 좌표를 직접 감독한 결과가 아니라, sampling된 co-occurrence를 noise baseline과 구분하며 생긴 저차원 factor입니다.",
  ),
  "ai/cross-entropy": flow(
    "확률 예측을 training objective로 바꾸는 경로",
    "모델이 정답에 준 확률은 어떻게 정보량, loss와 logit gradient가 될까?",
    [
      {
        label: "Surprisal",
        detail: "정답 확률 Q(x)를 −log Q(x)라는 사건별 비용으로 바꿉니다.",
      },
      {
        label: "Expected information",
        detail: "실제 분포 P로 평균내 entropy와 cross-entropy를 구분합니다.",
      },
      {
        label: "Likelihood choice",
        detail:
          "Gaussian·Bernoulli·Categorical 가정에서 MSE와 CE가 나오는 과정을 봅니다.",
      },
      {
        label: "Fused gradient",
        detail: "Stable log-sum-exp와 softmax–CE gradient p−y까지 내려갑니다.",
      },
    ],
    "Cross-entropy는 외워서 고르는 분류 공식이 아니라 categorical likelihood에서 나온 평균 정보 비용입니다.",
  ),
  "ai/fft": flow(
    "Signal 표현에서 실제 FFT 적용까지",
    "같은 signal을 frequency coordinate로 옮기면 무엇이 보이고, FFT는 그 계산을 어떻게 줄일까?",
    [
      {
        label: "Representation",
        detail:
          "DFT가 sample vector를 complex frequency coefficients로 바꿉니다.",
      },
      {
        label: "Measurement",
        detail:
          "Sample rate·frame·window가 aliasing, resolution과 leakage를 정합니다.",
      },
      {
        label: "Factorization",
        detail: "Cooley–Tukey가 even/odd sub-DFT와 butterfly를 재사용합니다.",
      },
      {
        label: "AI operator",
        detail:
          "STFT feature·large convolution·token mixing의 서로 다른 역할을 구분합니다.",
      },
    ],
    "FFT는 signal을 근사하는 기법이 아니라 DFT의 동일한 결과를 factorization으로 빠르게 계산하는 algorithm family입니다.",
  ),
  "ai/lstm": flow(
    "반복 상태의 병목에서 LSTM 구조 선택까지",
    "Vanilla RNN의 긴 gradient 경로를 LSTM은 어떤 state와 gate로 제어할까?",
    [
      {
        label: "State contract",
        detail:
          "Cell state C와 hidden state h가 맡는 계산 경로를 먼저 분리합니다.",
      },
      {
        label: "Gate policy",
        detail:
          "Forget·input·output gate가 channel별 보존·기록·공개 비율을 정합니다.",
      },
      {
        label: "Gradient retention",
        detail:
          "Direct cell path의 derivative를 forget gate의 시간축 곱으로 읽습니다.",
      },
      {
        label: "Architecture choice",
        detail:
          "GRU·BiLSTM·현대 대안을 state 예산, causality와 parallelism으로 비교합니다.",
      },
    ],
    "LSTM의 핵심은 ‘장기 기억 상자’라는 비유가 아니라, 데이터를 보고 보존율을 정하는 additive recurrent state path입니다.",
  ),
  "ai/vllm-scheduler": flow(
    "Continuous batching의 한 사이클",
    "서로 길이가 다른 요청을 GPU batch로 어떻게 계속 채울까?",
    [
      {
        label: "Waiting",
        detail: "새 prefill 요청과 재개할 요청이 대기합니다.",
      },
      { label: "Budget", detail: "token·sequence·KV block 예산을 계산합니다." },
      {
        label: "Schedule",
        detail: "prefill과 decode를 같은 step에 배치합니다.",
      },
      {
        label: "Preempt",
        detail: "예산이 모자라면 swap 또는 recompute로 자리를 냅니다.",
      },
    ],
    "scheduler는 요청 순서기가 아니라 매 step의 GPU 작업 집합을 다시 만드는 자원 관리자입니다.",
  ),
  "ai/vllm-paged-attention": flow(
    "Paged KV cache 주소 변환",
    "연속하지 않은 KV block을 attention kernel은 어떻게 읽을까?",
    [
      {
        label: "Token",
        detail: "토큰 위치를 logical block과 offset으로 나눕니다.",
      },
      {
        label: "Block table",
        detail: "sequence별 logical→physical 매핑을 조회합니다.",
      },
      {
        label: "KV pool",
        detail: "공유 physical block에서 key·value를 읽습니다.",
      },
      {
        label: "Attention",
        detail: "kernel이 block 단위로 score와 value를 누적합니다.",
      },
    ],
    "핵심은 KV를 연속 배열로 복사하는 대신 작은 block table로 간접 참조하는 것입니다.",
  ),
  "ai/vllm-spec-decode": flow(
    "Speculative decoding 검증 루프",
    "큰 모델 forward 한 번으로 왜 여러 토큰을 확정할 수 있을까?",
    [
      {
        label: "Draft",
        detail: "작은 모델이 미래 토큰 후보를 연속 제안합니다.",
      },
      {
        label: "Verify",
        detail: "target 모델이 후보 prefix를 한 번에 평가합니다.",
      },
      {
        label: "Accept",
        detail: "앞에서부터 일치하는 최대 prefix를 확정합니다.",
      },
      {
        label: "Resume",
        detail: "불일치 지점부터 새 토큰으로 다음 루프를 시작합니다.",
      },
    ],
    "속도는 draft 자체보다 평균 acceptance length와 검증 경로의 비용으로 결정됩니다.",
  ),
  "blockchain/evm-advanced": flow(
    "EVM 하위 실행 컨텍스트",
    "CREATE·DELEGATECALL·STATICCALL은 무엇을 바꾸고 무엇을 물려줄까?",
    [
      {
        label: "Caller",
        detail: "현재 address·storage·value·static 상태를 가집니다.",
      },
      {
        label: "Opcode",
        detail: "호출 종류가 code·context·value 상속 규칙을 정합니다.",
      },
      {
        label: "Child frame",
        detail: "독립 gas와 returndata를 가진 실행 프레임이 생깁니다.",
      },
      {
        label: "Commit/Revert",
        detail: "성공 시 state diff를 합치고 실패 시 되돌립니다.",
      },
    ],
    "opcode 이름보다 실행 프레임의 address·storage·value·write 권한을 표로 추적해야 합니다.",
  ),
  "blockchain/reth": flow(
    "Reth 노드의 큰 데이터 경로",
    "네트워크로 받은 블록은 어디를 지나 조회 가능한 상태가 될까?",
    [
      {
        label: "Network",
        detail: "header·body·transaction을 peer에서 수신합니다.",
      },
      {
        label: "Pipeline",
        detail: "다운로드·검증·execution stage를 순서대로 진행합니다.",
      },
      {
        label: "Storage",
        detail: "MDBX·static files에 hot state와 immutable data를 나눕니다.",
      },
      {
        label: "Provider/RPC",
        detail: "일관된 snapshot으로 상위 조회 API를 제공합니다.",
      },
    ],
    "Reth를 읽을 때는 crate 목록보다 network→pipeline→storage→provider 경계를 먼저 잡습니다.",
  ),
  "blockchain/prysm": flow(
    "Prysm beacon node의 큰 실행 경로",
    "slot마다 들어온 데이터는 어디에서 검증되고 fork choice와 state로 이어질까?",
    [
      {
        label: "P2P / Beacon API",
        detail: "block·attestation·sync message가 노드 경계로 들어옵니다.",
      },
      {
        label: "Validation",
        detail: "SSZ·BLS·state transition 전제와 gossip 규칙을 검사합니다.",
      },
      {
        label: "State / Fork choice",
        detail:
          "beacon state를 전이하고 head·justified·finalized를 갱신합니다.",
      },
      {
        label: "Validator / Engine API",
        detail: "제안·증명 임무와 execution payload 경계를 연결합니다.",
      },
    ],
    "Prysm은 서비스 목록보다 입력→검증→상태 전이→합의 출력의 소유권으로 읽어야 합니다.",
  ),
  "blockchain/cometbft": flow(
    "CometBFT가 애플리케이션 블록을 확정하는 경로",
    "합의 엔진과 애플리케이션은 어디에서 분리되고 다시 만날까?",
    [
      {
        label: "P2P / Mempool",
        detail: "peer message와 transaction 후보를 수신·검증·전파합니다.",
      },
      {
        label: "Consensus",
        detail: "proposal·prevote·precommit으로 하나의 block을 결정합니다.",
      },
      {
        label: "ABCI++",
        detail:
          "PrepareProposal·ProcessProposal·FinalizeBlock으로 앱을 호출합니다.",
      },
      {
        label: "Commit / State",
        detail:
          "app hash와 validator update를 고정하고 다음 height로 이동합니다.",
      },
    ],
    "CometBFT의 핵심 경계는 consensus와 application을 잇는 ABCI++ 계약입니다.",
  ),
  "blockchain/helios": flow(
    "Helios light client의 검증 경로",
    "execution node를 직접 신뢰하지 않고 RPC 결과를 어떻게 검증할까?",
    [
      {
        label: "Consensus checkpoint",
        detail: "신뢰할 시작점에서 beacon header와 committee를 동기화합니다.",
      },
      {
        label: "Execution header",
        detail: "합의로 확정된 execution payload header를 연결합니다.",
      },
      {
        label: "Proof request",
        detail:
          "account·storage·receipt에 필요한 Merkle proof를 RPC에 요청합니다.",
      },
      {
        label: "Local verification",
        detail: "header root와 proof를 대조한 뒤 검증된 결과만 노출합니다.",
      },
    ],
    "Helios는 RPC 대체제가 아니라 합의 header를 신뢰 뿌리로 삼는 검증 계층입니다.",
  ),
  "blockchain/filecoin-lotus": flow(
    "Lotus가 저장 약속을 체인 상태로 만드는 경로",
    "파일 저장 요청은 어떤 경계를 지나 검증 가능한 on-chain 상태가 될까?",
    [
      {
        label: "Deal / Piece",
        detail: "client와 provider가 piece·기간·가격 조건을 합의합니다.",
      },
      {
        label: "Sector pipeline",
        detail: "piece를 sector에 넣고 sealing과 PoRep 계산을 수행합니다.",
      },
      {
        label: "Chain / Actors",
        detail: "message가 FVM actor state와 power·market 상태를 갱신합니다.",
      },
      {
        label: "PoSt / Finality",
        detail: "계속 저장한다는 증명과 F3 finality가 결과를 확정합니다.",
      },
    ],
    "Lotus를 읽을 때는 daemon 목록보다 deal→sector→actor state→proof 경계를 먼저 잡습니다.",
  ),
  "ai/transformer-architecture": flow(
    "입력 tensor에서 scaling decision까지 이어지는 Transformer 계약",
    "Transformer는 어떤 tensor와 visibility를 받아 token·feature를 섞고, 이를 재현 가능한 model output으로 바꿀까?",
    [
      {
        label: "Input contract",
        detail:
          "Token ID·position signal·attention mask·loss mask의 shape와 역할을 분리합니다.",
      },
      {
        label: "Position & visibility",
        detail:
          "Position이 embedding·Q/K·score 중 어디에 들어가고, Q가 어떤 K·V를 읽는지 고정합니다.",
      },
      {
        label: "Two mixers",
        detail:
          "Attention의 token mixing과 FFN의 feature mixing을 residual·normalization 경로에 쌓습니다.",
      },
      {
        label: "Output & objective",
        detail:
          "Hidden state를 logits로 투영하고 loss mask가 있는 training과 decoding policy를 분리합니다.",
      },
      {
        label: "Recipe & scale",
        detail:
          "Optimizer·dtype·parallel topology를 재현 계약에 넣고 scaling curve를 예산 목적에 맞게 해석합니다.",
      },
    ],
    "Transformer는 attention 공식 하나가 아니라 입력·visibility·두 mixer·residual update·objective·training recipe가 연결된 실행 계약입니다.",
  ),
  "crypto/reed-solomon": flow(
    "Reed–Solomon 복구 흐름",
    "일부 조각을 잃어도 원본을 어떻게 되찾을까?",
    [
      {
        label: "Data shards",
        detail: "원본을 k개의 기호 또는 조각으로 나눕니다.",
      },
      {
        label: "Evaluate",
        detail: "다항식을 더 많은 점에서 평가해 parity를 만듭니다.",
      },
      { label: "Erasure", detail: "전송·저장 중 일부 평가값이 사라집니다." },
      {
        label: "Interpolate",
        detail: "충분한 k개 점으로 다항식과 원본을 복원합니다.",
      },
    ],
    "오류 위치를 아는 erasure와 위치도 모르는 error correction을 구분하면 수식이 쉬워집니다.",
  ),
  "crypto/fri": flow(
    "FRI의 저차수 검사",
    "거대한 평가 벡터를 전부 읽지 않고 저차수임을 어떻게 확인할까?",
    [
      {
        label: "Evaluate",
        detail: "다항식의 넓은 도메인 평가값을 커밋합니다.",
      },
      {
        label: "Fold",
        detail: "verifier challenge로 두 점을 한 점으로 반복 접습니다.",
      },
      { label: "Commit", detail: "각 축소 레이어의 Merkle root를 고정합니다." },
      {
        label: "Query",
        detail: "소수 경로의 일관성과 마지막 저차수식을 검사합니다.",
      },
    ],
    "FRI는 다항식을 직접 보내는 증명이 아니라 반복 축소와 무작위 질의로 거짓을 잡는 IOP입니다.",
  ),
  "crypto/snark-overview": flow(
    "SNARK 생성과 검증",
    "복잡한 계산은 어떻게 작은 proof가 될까?",
    [
      {
        label: "Program + witness",
        detail: "공개 입력과 비밀 실행 흔적을 준비합니다.",
      },
      {
        label: "Arithmetize",
        detail: "계산을 constraint와 polynomial 관계로 바꿉니다.",
      },
      {
        label: "Prove",
        detail: "commitment와 challenge로 관계 만족 증명을 만듭니다.",
      },
      {
        label: "Verify",
        detail: "원 계산 대신 짧은 pairing·field 검사를 수행합니다.",
      },
    ],
    "SNARK 계열의 차이는 주로 산술화·커밋먼트·setup·검증 비용의 조합에서 생깁니다.",
  ),
  "p2p/kad-lookup": flow(
    "반복 FIND_NODE",
    "목표를 모르는 노드들이 어떻게 점점 가까운 peer를 찾을까?",
    [
      {
        label: "Seed",
        detail: "routing table에서 XOR 거리가 가까운 후보를 뽑습니다.",
      },
      {
        label: "Parallel query",
        detail: "α개 peer에 FIND_NODE를 병렬 전송합니다.",
      },
      {
        label: "Merge",
        detail: "응답 후보를 거리순 shortlist에 합치고 중복을 뺍니다.",
      },
      {
        label: "Converge",
        detail: "더 가까운 미조회 후보가 없으면 결과를 확정합니다.",
      },
    ],
    "탐색은 한 peer를 따라가는 경로가 아니라 갱신되는 거리순 후보 집합입니다.",
  ),
  "p2p/discv4": flow(
    "discv4 노드 발견",
    "UDP만으로 상대 생존과 이웃 목록을 어떻게 확인할까?",
    [
      {
        label: "Ping",
        detail: "서명된 endpoint 정보를 보내고 bond를 시작합니다.",
      },
      {
        label: "Pong",
        detail: "packet hash를 되돌려 요청과 응답을 연결합니다.",
      },
      {
        label: "FindNode",
        detail: "목표 public key와 가까운 노드를 요청합니다.",
      },
      {
        label: "Neighbours",
        detail: "MTU에 맞춰 여러 packet으로 후보를 반환합니다.",
      },
    ],
    "discv4는 세션 암호화보다 서명 packet과 endpoint proof에 의존하는 발견 프로토콜입니다.",
  ),
  "p2p/libp2p-tcp": flow(
    "libp2p TCP 조립",
    "TCP socket은 어떻게 libp2p connection이 될까?",
    [
      {
        label: "Dial/Listen",
        detail: "multiaddr를 socket address로 바꿉니다.",
      },
      { label: "TCP stream", detail: "OS 연결과 backpressure를 얻습니다." },
      { label: "Upgrade", detail: "security와 multiplexer 협상을 적용합니다." },
      { label: "Swarm", detail: "connection event를 behaviour로 전달합니다." },
    ],
    "TCP transport는 암호화나 protocol 자체가 아니라 상위 upgrade가 올라갈 신뢰성 있는 byte stream입니다.",
  ),
  "p2p/libp2p-quic": flow(
    "libp2p QUIC 조립",
    "QUIC에서는 보안과 multiplexing이 어디에 들어갈까?",
    [
      {
        label: "UDP endpoint",
        detail: "하나의 socket에서 connection ID로 흐름을 나눕니다.",
      },
      {
        label: "QUIC handshake",
        detail: "TLS 1.3과 transport parameter를 함께 협상합니다.",
      },
      {
        label: "Streams",
        detail: "독립 stream이 head-of-line blocking을 줄입니다.",
      },
      {
        label: "Swarm",
        detail: "인증된 peer connection과 stream event를 전달합니다.",
      },
    ],
    "QUIC transport는 security와 multiplexing을 내장하므로 TCP upgrade stack과 조립 위치가 다릅니다.",
  ),
  "p2p/libp2p-noise": flow(
    "Noise XX handshake",
    "서로의 peer identity를 언제 검증할까?",
    [
      {
        label: "Ephemeral keys",
        detail: "양쪽이 일회용 DH 키로 임시 비밀을 만듭니다.",
      },
      { label: "Static reveal", detail: "암호화된 static key를 교환합니다." },
      {
        label: "Identity bind",
        detail: "peer ID 공개키 서명으로 Noise key를 묶습니다.",
      },
      {
        label: "Secure channel",
        detail: "분리된 송수신 cipher state를 사용합니다.",
      },
    ],
    "Noise key 확인과 libp2p peer identity 확인은 같은 단계가 아니므로 binding 검증이 필요합니다.",
  ),
  "p2p/libp2p-yamux": flow(
    "Yamux 다중화",
    "한 connection 안에서 여러 protocol stream을 어떻게 나눌까?",
    [
      {
        label: "Session",
        detail: "하나의 보안 연결 위에 muxer 상태를 둡니다.",
      },
      {
        label: "Stream ID",
        detail: "open frame으로 논리 stream을 식별합니다.",
      },
      { label: "Window", detail: "stream별 flow-control credit을 갱신합니다." },
      { label: "Close/Reset", detail: "다른 stream과 독립적으로 종료합니다." },
    ],
    "Yamux의 핵심은 동시성보다 stream별 순서·흐름 제어·장애 격리입니다.",
  ),
  "p2p/libp2p-gossipsub": flow(
    "GossipSub 전파",
    "모든 peer에 보내지 않고도 메시지를 어떻게 퍼뜨릴까?",
    [
      {
        label: "Publish",
        detail: "topic message ID를 계산하고 중복 캐시에 넣습니다.",
      },
      { label: "Mesh", detail: "선택된 mesh peer에 본문을 즉시 전파합니다." },
      { label: "Gossip", detail: "mesh 밖 peer에는 IHAVE 요약을 보냅니다." },
      { label: "Score", detail: "전달 품질과 위반을 peer score에 반영합니다." },
    ],
    "mesh는 고정 이웃 목록이 아니라 heartbeat와 score로 계속 보정되는 전파 표면입니다.",
  ),
  "gpu/cuda-thread-hierarchy": flow(
    "CUDA 실행 계층",
    "kernel의 thread는 실제 GPU에 어떻게 묶일까?",
    [
      { label: "Grid", detail: "kernel launch 전체 작업 공간입니다." },
      {
        label: "Block",
        detail: "같은 SM에 배치되고 shared memory를 공유합니다.",
      },
      {
        label: "Warp",
        detail: "32개 thread가 같은 명령 발행 단위를 이룹니다.",
      },
      { label: "Thread", detail: "index로 자기 데이터 원소를 선택합니다." },
    ],
    "성능 문제는 thread 수보다 block 배치·warp 분기·메모리 접근 패턴에서 생깁니다.",
  ),
  "gpu/cuda-matrix-multiply": flow(
    "타일 행렬 곱",
    "같은 global memory 값을 어떻게 재사용할까?",
    [
      {
        label: "Tile load",
        detail: "A와 B 조각을 shared memory로 협력 로드합니다.",
      },
      {
        label: "Sync",
        detail: "block의 모든 thread가 로드를 마칠 때까지 기다립니다.",
      },
      { label: "MAC loop", detail: "tile 내부 값을 여러 곱셈에 재사용합니다." },
      { label: "Advance", detail: "K축 다음 tile로 이동해 누산합니다." },
    ],
    "타일링의 이득은 연산 수를 줄이는 것이 아니라 같은 byte당 연산 수를 높이는 데 있습니다.",
  ),
  "gpu/cuda-shared-memory": flow(
    "Coalescing과 bank",
    "global load와 shared access는 각각 무엇을 맞춰야 할까?",
    [
      {
        label: "Global addresses",
        detail: "warp 주소를 연속 segment로 모읍니다.",
      },
      { label: "Shared tile", detail: "재사용할 값을 on-chip 배열에 둡니다." },
      {
        label: "Bank mapping",
        detail: "동시 접근이 같은 bank에 몰리는지 확인합니다.",
      },
      { label: "Padding", detail: "stride를 바꿔 conflict를 분산합니다." },
    ],
    "coalescing은 global transaction 문제이고 bank conflict는 shared memory 병렬 접근 문제입니다.",
  ),
  "gpu/cuda-sync-streams": flow(
    "CUDA 비동기 파이프라인",
    "복사와 kernel을 언제 겹칠 수 있을까?",
    [
      {
        label: "Pinned H2D",
        detail: "비동기 전송 가능한 host buffer를 준비합니다.",
      },
      {
        label: "Stream",
        detail: "독립 명령 큐에 copy와 kernel을 순서대로 넣습니다.",
      },
      {
        label: "Event",
        detail: "전체 device 정지 없이 의존 지점을 표시합니다.",
      },
      {
        label: "Overlap",
        detail: "다른 stream의 transfer·compute를 동시에 실행합니다.",
      },
    ],
    "동시성은 stream 개수만으로 생기지 않고 hardware engine과 데이터 의존성이 허용해야 합니다.",
  ),
  "gpu/gpu-arch-hopper": flow(
    "Hopper 데이터 이동",
    "SM이 tensor core를 기다리지 않게 하려면?",
    [
      { label: "HBM", detail: "큰 tensor tile의 원본이 있습니다." },
      { label: "TMA", detail: "thread 계산과 분리해 다차원 tile을 옮깁니다." },
      {
        label: "Cluster/DSM",
        detail: "여러 block이 인접 shared data를 협력 사용합니다.",
      },
      {
        label: "Tensor Core",
        detail: "FP8·matrix 연산에 compute 시간을 집중합니다.",
      },
    ],
    "Hopper의 핵심은 peak FLOPS보다 데이터 이동과 producer–consumer 동기화를 하드웨어화한 점입니다.",
  ),
  "gpu/cuda-perf-analysis": flow(
    "GPU 병목 판별",
    "느린 kernel에서 무엇을 먼저 측정할까?",
    [
      {
        label: "Timeline",
        detail: "copy·launch·kernel·sync 시간을 분리합니다.",
      },
      {
        label: "Roofline",
        detail: "산술 집약도로 memory/compute 상한을 찾습니다.",
      },
      {
        label: "Occupancy",
        detail: "register·shared memory가 resident warp를 막는지 봅니다.",
      },
      {
        label: "Counter",
        detail: "stall reason과 transaction 효율로 가설을 검증합니다.",
      },
    ],
    "점유율은 목표가 아니라 latency를 숨길 만큼의 병렬성이 있는지 보는 중간 지표입니다.",
  ),
  "gpu/ec-gpu-ops": flow(
    "곡선점 GPU 연산",
    "큰 정수와 점 연산을 warp에 어떻게 나눌까?",
    [
      { label: "Limbs", detail: "체 원소를 여러 machine word로 나눕니다." },
      { label: "Montgomery", detail: "곱셈과 modular reduction을 결합합니다." },
      {
        label: "Point formula",
        detail: "Jacobian 좌표로 inversion을 피합니다.",
      },
      { label: "Batch", detail: "많은 독립 점을 warp·block에 배치합니다." },
    ],
    "GPU 이득은 한 점 계산보다 많은 field·point 연산을 규칙적으로 batch할 때 커집니다.",
  ),
  "gpu/msm-gpu-impl": flow(
    "Pippenger MSM kernel",
    "수백만 scalar-point 쌍을 어떻게 줄일까?",
    [
      { label: "Window", detail: "scalar를 고정 폭 digit으로 분해합니다." },
      { label: "Bucket", detail: "같은 digit의 점을 병렬 누적합니다." },
      {
        label: "Reduce",
        detail: "bucket을 높은 번호부터 running sum으로 합칩니다.",
      },
      {
        label: "Combine",
        detail: "window 결과를 doubling과 addition으로 결합합니다.",
      },
    ],
    "병목은 곱셈 자체보다 불균형 bucket·atomic 충돌·중간 점 메모리입니다.",
  ),
  "gpu/ntt-gpu-impl": flow(
    "NTT kernel 단계",
    "butterfly를 GPU 메모리 계층에 어떻게 배치할까?",
    [
      {
        label: "Twiddle",
        detail: "stage별 단위근을 읽기 좋은 순서로 준비합니다.",
      },
      { label: "Butterfly", detail: "독립 쌍을 thread에 배정합니다." },
      {
        label: "Shared stages",
        detail: "작은 stride 구간을 on-chip에서 연속 처리합니다.",
      },
      {
        label: "Global transpose",
        detail: "큰 stride에서 coalescing을 되찾도록 재배열합니다.",
      },
    ],
    "좋은 NTT kernel은 연산식보다 stage fusion과 global traffic 감소로 결정됩니다.",
  ),
  "gpu/icicle-framework": flow(
    "ICICLE 호출 경로",
    "여러 곡선과 backend를 한 API로 어떻게 실행할까?",
    [
      { label: "Host API", detail: "curve·device·stream 설정을 받습니다." },
      {
        label: "Backend dispatch",
        detail: "CUDA 등 등록된 구현을 선택합니다.",
      },
      {
        label: "Memory",
        detail: "host/device buffer와 async 수명을 관리합니다.",
      },
      {
        label: "Kernel",
        detail: "curve 전용 field·MSM·NTT 코드를 실행합니다.",
      },
    ],
    "프레임워크 가치는 단일 kernel보다 타입·메모리·stream·backend 계약을 일관되게 만드는 데 있습니다.",
  ),
  "gpu/poseidon-gpu": flow(
    "Poseidon batch hash",
    "작은 상태 permutation을 GPU에서 어떻게 채울까?",
    [
      { label: "Batch states", detail: "독립 hash state를 충분히 모읍니다." },
      {
        label: "AddRC/S-box",
        detail: "field addition과 x⁵를 원소별 실행합니다.",
      },
      { label: "MDS", detail: "작은 행렬 곱으로 상태를 확산합니다." },
      {
        label: "Tree levels",
        detail: "출력 hash를 다음 Merkle level 입력으로 재사용합니다.",
      },
    ],
    "한 hash의 병렬성은 작으므로 많은 state와 Merkle node를 batch하는 것이 핵심입니다.",
  ),
  "gpu/poly-ops-gpu": flow(
    "다항식 GPU 작업 흐름",
    "NTT 밖의 연산을 어떻게 같은 buffer 위에서 이어갈까?",
    [
      { label: "Coset scale", detail: "계수에 coset power를 곱합니다." },
      { label: "NTT", detail: "평가 도메인으로 변환합니다." },
      {
        label: "Pointwise op",
        detail: "곱·나눗셈·vanishing 처리를 병렬 실행합니다.",
      },
      {
        label: "INTT/Reduce",
        detail: "계수로 돌아오거나 평가 결과를 축약합니다.",
      },
    ],
    "연산별 최고 kernel보다 중간 buffer를 HBM 밖으로 내보내지 않는 파이프라인이 중요합니다.",
  ),
  "gpu/kzg-gpu": flow(
    "KZG GPU 경로",
    "다항식 commitment와 opening은 어디서 MSM을 쓸까?",
    [
      {
        label: "Polynomial",
        detail: "coefficient 또는 evaluation 형식 입력을 준비합니다.",
      },
      {
        label: "SRS window",
        detail: "필요한 곡선점 구간을 device에 배치합니다.",
      },
      {
        label: "MSM commit",
        detail: "계수와 SRS 점의 선형 결합을 계산합니다.",
      },
      {
        label: "Batch opening",
        detail: "여러 opening polynomial을 묶어 MSM 수를 줄입니다.",
      },
    ],
    "KZG GPU 설계는 SRS residency와 MSM batch 크기가 end-to-end 성능을 좌우합니다.",
  ),
  "gpu/ec-gpu-gen": flow(
    "Curve kernel codegen",
    "곡선마다 다른 상수를 안전하게 kernel에 넣으려면?",
    [
      {
        label: "Curve params",
        detail: "modulus·limb·Montgomery 상수를 입력합니다.",
      },
      {
        label: "Template",
        detail: "field와 point 연산 template을 구체화합니다.",
      },
      {
        label: "Compile",
        detail: "CUDA/OpenCL backend별 source를 빌드합니다.",
      },
      {
        label: "Binding",
        detail: "Rust host 코드가 생성 kernel을 dispatch합니다.",
      },
    ],
    "codegen은 중복 코드를 줄이는 동시에 host 타입과 device 상수의 불일치를 막는 계약입니다.",
  ),
  "gpu/rapidsnark-gpu": flow(
    "Groth16 prover GPU 경로",
    "witness에서 proof까지 어느 연산이 GPU로 갈까?",
    [
      {
        label: "Witness",
        detail: "회로 실행 결과와 polynomial 입력을 준비합니다.",
      },
      { label: "NTT/QAP", detail: "constraint polynomial을 평가·조합합니다." },
      {
        label: "MSM",
        detail: "proving key 점과 scalar를 대규모로 누적합니다.",
      },
      { label: "Proof", detail: "CPU/GPU 결과를 A·B·C 원소로 조립합니다." },
    ],
    "가속률은 MSM kernel뿐 아니라 witness 전송·NTT·CPU 조립 사이의 경계 비용을 포함해야 합니다.",
  ),
  "gpu/gpu-witness-gen": flow(
    "Witness 레벨 병렬화",
    "의존성이 있는 constraint를 GPU에서 어떻게 풀까?",
    [
      {
        label: "Dependency graph",
        detail: "각 신호가 어떤 이전 신호를 요구하는지 만듭니다.",
      },
      {
        label: "Levels",
        detail: "서로 독립인 constraint를 같은 레벨로 묶습니다.",
      },
      { label: "GPU solve", detail: "레벨 내부 field 연산을 병렬 실행합니다." },
      { label: "Barrier", detail: "다음 레벨 전에 결과 가시성을 보장합니다." },
    ],
    "모든 constraint를 병렬화할 수 없으므로 레벨 폭과 kernel launch 비용이 실제 한계를 정합니다.",
  ),
};

const INTENT_QUESTIONS: Record<ArticleIntent, (title: string) => string> = {
  "개념 지도": (title) =>
    `${title}에서 먼저 구분해야 할 대상과 동작은 무엇일까?`,
  "구현 추적": (title) => `${title}의 입력은 어떤 경로를 거쳐 결과가 될까?`,
  "비교·선택": (title) =>
    `${title}의 대안은 어떤 기준에서 갈리고 언제 선택해야 할까?`,
  "운영 가이드": (title) =>
    `운영 관점에서 ${title}의 경계와 실패 조건은 무엇일까?`,
  "사례·실측": (title) =>
    `${title}의 수치는 어떤 조건에서 나왔고 어디까지 일반화할 수 있을까?`,
  "논문·프로젝트 해설": (title) =>
    `${title}의 공개 사실과 해석을 어떤 기준으로 나눠 읽어야 할까?`,
};

const SECTION_STAGE_DETAILS = [
  "배경과 용어를 잡아 뒤의 세부 설명이 놓일 좌표를 만듭니다.",
  "핵심 문제와 구성 요소가 만나는 지점을 좁혀 봅니다.",
  "동작 원리와 구현 선택을 입력에서 출력 순서로 따라갑니다.",
  "한계·비교·운영 판단으로 확장해 어디에 적용할지 정리합니다.",
] as const;

function selectOutlineSections(article: Article): Article["sections"] {
  if (article.sections.length <= 4) return article.sections;
  const last = article.sections.length - 1;
  const indices = [0, Math.round(last / 3), Math.round((last * 2) / 3), last];
  return indices.map((index) => article.sections[index]);
}

/**
 * 모든 레거시 글이 최소한 하나의 inspectable top-down 입구를 갖게 합니다.
 * 개별 글의 명시적 flow가 있으면 그것을 우선하고, 없을 때만 등록된 section
 * metadata에서 생성합니다. 따라서 목차와 입구의 순서가 서로 어긋나지 않습니다.
 */
export function getArticleConceptFlow(
  category: Category,
  article: Article,
): ConceptFlow | undefined {
  const routeKey = `${category.slug}/${article.slug}`;

  const explicit = ARTICLE_CONCEPT_FLOWS[routeKey];
  if (explicit) return explicit;

  const intent = inferArticleIntent(article);
  const selected = selectOutlineSections(article);
  const nodes = selected.map((section, index) => ({
    label: section.title,
    detail:
      section.subsections && section.subsections.length > 0
        ? section.subsections
            .slice(0, 3)
            .map((subsection) => subsection.title)
            .join(" · ")
        : SECTION_STAGE_DETAILS[
            Math.min(index, SECTION_STAGE_DETAILS.length - 1)
          ],
  }));

  if (nodes.length === 1) {
    nodes.push(
      {
        label: "핵심 경계",
        detail: "구성 요소의 역할과 서로 넘겨주는 입력·출력을 구분합니다.",
      },
      {
        label: "실행 흐름",
        detail: "정적 목록이 아니라 실제 동작 순서로 연결해 봅니다.",
      },
      {
        label: "적용 범위",
        detail:
          "현재 구현과 일반 원리를 나누고 다음 글로 이어질 지점을 정리합니다.",
      },
    );
  }

  return flow(
    `${article.title}: 먼저 잡을 흐름`,
    INTENT_QUESTIONS[intent](article.title),
    nodes,
    `${selected[0]?.title ?? article.title}에서 출발해 ${selected.at(-1)?.title ?? "적용 범위"}까지 내려가며 읽는 ${ARTICLE_INTENT_DESCRIPTIONS[intent]}입니다.`,
  );
}

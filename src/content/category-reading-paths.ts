export interface CategoryReadingStage {
  eyebrow: string;
  title: string;
  description: string;
  subcategories: readonly string[];
}

export interface CategoryReadingPath {
  title: string;
  description: string;
  stages: readonly CategoryReadingStage[];
  featuredArticles: readonly string[];
}

/**
 * 카테고리 입구에서 보여 줄 개념 계층만 관리합니다.
 * 실제 글 목록·개수·링크·근거 배지는 각 manifest에서 읽기 때문에 새 글의
 * 정보를 이 파일에 다시 복제하지 않습니다.
 */
export const CATEGORY_READING_PATHS: Readonly<
  Partial<Record<string, CategoryReadingPath>>
> = {
  ai: {
    title: "AI를 위에서 아래로 읽는 네 단계",
    description:
      "먼저 공통 원리를 잡고, 모델 구조와 논문을 읽은 뒤, 서빙·에이전트 시스템과 실제 구현으로 내려갑니다. 이미 아는 단계는 건너뛰어도 됩니다.",
    stages: [
      {
        eyebrow: "01 · 기준선",
        title: "데이터와 모델의 공통 언어",
        description:
          "신경망·attention·시계열·생성 모델이 무엇을 입력받아 무엇을 학습하는지부터 잡습니다.",
        subcategories: [
          "ai-foundations",
          "ai-nlp",
          "ai-vision",
          "ai-timeseries",
          "ai-generative",
        ],
      },
      {
        eyebrow: "02 · 원리와 근거",
        title: "LLM 구조와 논문을 읽는 층",
        description:
          "Transformer를 기준 블록으로 삼고, 정렬·긴 문맥·구조 변경을 원 논문과 함께 확인합니다.",
        subcategories: ["ai-llm-theory", "ai-llm-applied"],
      },
      {
        eyebrow: "03 · 시스템",
        title: "서빙과 에이전트 실행 구조",
        description:
          "KV cache·scheduler·tool loop·sandbox처럼 모델 밖에서 성능과 안전성을 결정하는 계층으로 확장합니다.",
        subcategories: ["ai-llm-serving", "ai-agents", "ai-agents-claw"],
      },
      {
        eyebrow: "04 · 적용",
        title: "구현·실험·운영으로 검증",
        description:
          "직접 구현하고, 데이터와 평가를 고정한 뒤, 재현 가능한 기록과 운영 판단으로 마무리합니다.",
        subcategories: ["ai-from-scratch", "ai-practical", "ai-agents-ops"],
      },
    ],
    featuredArticles: [
      "deep-learning-overview",
      "math-vectors-inner-products",
      "math-functions-composition",
      "math-functions-derivatives-gradients",
      "math-gradients-jacobians",
      "math-exponents-logarithms",
      "math-probability-expectation-variance",
      "math-random-variables-expectation",
      "math-variance-sampling",
      "math-optimization-objectives",
      "math-optimization-convexity",
      "math-gradient-descent-convergence",
      "transformer-architecture",
      "supervised-fine-tuning",
      "grammar-constrained-generation",
      "kimi-k3-architecture",
      "yarn-rope-extension",
      "sionic-eureka",
      "sionic-glm-b300",
      "hybrid-attention-serving",
      "agent-sandbox-security",
    ],
  },
  blockchain: {
    title: "블록체인을 프로토콜에서 운영까지 읽는 네 단계",
    description:
      "분산 시스템과 합의의 공통 전제를 먼저 잡은 뒤, 체인별 실행 구조와 저장·DeFi·ZK 구현으로 내려갑니다. 프로젝트 이름보다 상태가 만들어지고 확정되는 경로를 기준으로 읽습니다.",
    stages: [
      {
        eyebrow: "01 · 공통 전제",
        title: "상태·네트워크·합의",
        description:
          "노드가 서로 다른 정보를 보더라도 하나의 상태에 합의해야 하는 이유와 안전성·활성의 기준을 잡습니다.",
        subcategories: ["fundamentals", "bft-consensus"],
      },
      {
        eyebrow: "02 · 체인 구조",
        title: "Ethereum과 Cosmos의 실행 경계",
        description:
          "실행·합의·mempool·상태 저장이 실제 클라이언트에서 어디까지 분리되는지 비교합니다.",
        subcategories: ["ethereum", "cosmos"],
      },
      {
        eyebrow: "03 · 데이터와 모듈",
        title: "Filecoin과 재사용 가능한 프리미티브",
        description:
          "저장 약속이 증명과 체인 상태로 바뀌는 과정, 그리고 작은 합의·네트워크 부품을 조립하는 방식을 봅니다.",
        subcategories: ["filecoin", "commonware"],
      },
      {
        eyebrow: "04 · 응용과 검증",
        title: "금융 프로토콜과 ZK 구현",
        description:
          "프로토콜의 경제적 불변식과 암호학적 검증을 구현·운영 관점에서 연결합니다.",
        subcategories: ["defi", "zk-from-scratch"],
      },
    ],
    featuredArticles: [
      "distributed-systems",
      "bft-theory",
      "node-architecture",
      "reth",
      "prysm",
      "cometbft",
      "filecoin-lotus",
      "filecoin-proofs",
    ],
  },
  crypto: {
    title: "암호학을 가정에서 증명 시스템까지 읽는 네 단계",
    description:
      "수식을 외우기보다 어떤 가정을 두고 무엇을 숨기거나 검증하는지부터 시작합니다. 유한체·곡선의 연산이 commitment와 proof, 실제 zkVM으로 이어지는 순서입니다.",
    stages: [
      {
        eyebrow: "01 · 산술 기반",
        title: "공개키 암호와 유한체",
        description:
          "정수 연산과 체 연산의 차이, 이산로그 가정, 곡선 위 연산을 먼저 구분합니다.",
        subcategories: ["classical", "zkp-math"],
      },
      {
        eyebrow: "02 · 대표 증명계",
        title: "SNARK와 STARK의 설계 축",
        description:
          "Groth16·PLONK·STARK를 산술화, commitment, setup, verifier 비용이라는 같은 축에서 읽습니다.",
        subcategories: ["zkp-groth16", "zkp-plonk", "zkp-stark"],
      },
      {
        eyebrow: "03 · 재귀와 투명성",
        title: "Folding·IPA·IOP",
        description:
          "재귀 증명과 투명한 setup이 어떤 대수 구조와 상호작용 모델을 선택하는지 비교합니다.",
        subcategories: ["zkp-nova", "zkp-bulletproofs", "zkp-iop"],
      },
      {
        eyebrow: "04 · 시스템",
        title: "zkVM과 다자간 계산",
        description:
          "개별 proof를 프로그램 실행과 여러 참여자의 안전한 계산으로 확장합니다.",
        subcategories: ["zkp-vm", "mpc"],
      },
    ],
    featuredArticles: [
      "finite-field-theory",
      "elliptic-curve",
      "snark-overview",
      "groth16",
      "plonk",
      "stark",
      "fri",
      "nova",
    ],
  },
  p2p: {
    title: "P2P를 발견에서 데이터 전달까지 읽는 네 단계",
    description:
      "연결된 노드 목록부터 외우지 않고, 상대를 찾고 연결하고 신뢰를 확인한 뒤 데이터를 교환하는 실제 경로를 따라갑니다.",
    stages: [
      {
        eyebrow: "01 · 네트워크 모델",
        title: "주소·토폴로지·피어 발견",
        description:
          "중앙 서버가 없을 때 노드가 누구를 알고 어떤 거리 기준으로 새 피어를 찾는지 봅니다.",
        subcategories: ["p2p-fundamentals", "p2p-discovery"],
      },
      {
        eyebrow: "02 · 연결",
        title: "전송·NAT·멀티플렉싱",
        description:
          "발견한 피어와 실제 세션을 만들 때 주소 변환, 보안 연결, stream이 어떻게 조립되는지 봅니다.",
        subcategories: ["p2p-transport"],
      },
      {
        eyebrow: "03 · 범용 프로토콜",
        title: "libp2p와 IPFS",
        description:
          "전송 부품을 조립하는 프레임워크와 콘텐츠 주소 기반 데이터 그래프를 연결합니다.",
        subcategories: ["p2p-libp2p", "p2p-ipfs"],
      },
      {
        eyebrow: "04 · 전송 시스템",
        title: "BitTorrent와 Iroh",
        description:
          "대규모 조각 교환과 QUIC 기반 직접 연결이 처리량·복구·운영 문제를 푸는 방식을 비교합니다.",
        subcategories: ["p2p-bittorrent", "p2p-iroh"],
      },
    ],
    featuredArticles: [
      "tls-fundamentals",
      "kademlia",
      "kad-lookup",
      "libp2p",
      "libp2p-tcp",
      "bittorrent",
      "ipfs",
      "iroh",
    ],
  },
  gpu: {
    title: "GPU를 하드웨어 예산에서 커널 성능까지 읽는 세 단계",
    description:
      "부품 스펙을 나열하기보다 데이터가 메모리 계층을 지나 SM에서 실행되는 경로를 먼저 잡고, CUDA 최적화와 ZK 가속으로 확장합니다.",
    stages: [
      {
        eyebrow: "01 · 시스템 예산",
        title: "연산·메모리·스토리지·인프라",
        description:
          "서버가 감당할 수 있는 전력·대역폭·용량의 상한을 먼저 계산합니다.",
        subcategories: ["hw-compute", "hw-memory", "hw-storage", "hw-infra"],
      },
      {
        eyebrow: "02 · 실행 모델",
        title: "SIMT와 CUDA 메모리 계층",
        description:
          "thread·warp·block·SM의 관계와 coalescing·shared memory·동기화를 한 실행 흐름으로 봅니다.",
        subcategories: ["gpu-fundamentals"],
      },
      {
        eyebrow: "03 · 특화 가속",
        title: "MSM·NTT·증명 파이프라인",
        description:
          "수학 연산의 병렬성을 kernel에 배치하고 CPU·GPU 경계 비용까지 포함해 성능을 측정합니다.",
        subcategories: ["zk-acceleration"],
      },
    ],
    featuredArticles: [
      "gpu-architecture",
      "cuda-thread-hierarchy",
      "cuda-shared-memory",
      "cuda-perf-analysis",
      "cuda-register-pressure",
      "cuda-kernel-fusion",
      "cuda-persistent-kernels",
      "gpu-arch-hopper",
      "msm-ntt",
      "msm-gpu-impl",
      "ntt-gpu-impl",
    ],
  },
  tee: {
    title: "TEE를 위협 모델에서 배포까지 읽는 네 단계",
    description:
      "제품 이름보다 누가 무엇을 신뢰해야 하는지부터 정합니다. 격리 경계와 원격 증명을 이해한 뒤 CPU별 구현과 실제 인프라·네트워크로 내려갑니다.",
    stages: [
      {
        eyebrow: "01 · 신뢰 경계",
        title: "TCB·격리·원격 증명",
        description:
          "호스트·하이퍼바이저·게스트 중 무엇을 공격자로 두고 어떤 측정값을 신뢰하는지 잡습니다.",
        subcategories: ["tee-fundamentals"],
      },
      {
        eyebrow: "02 · 서버 CPU",
        title: "Intel SGX·TDX와 AMD SEV",
        description:
          "process enclave와 confidential VM이 메모리·페이지 테이블·attestation을 다루는 방식을 비교합니다.",
        subcategories: ["tee-intel", "amd-sev"],
      },
      {
        eyebrow: "03 · 모바일과 Realm",
        title: "ARM TrustZone·CCA",
        description:
          "secure world 분리에서 Realm 기반 기밀 VM으로 확장되는 경계를 봅니다.",
        subcategories: ["tee-arm"],
      },
      {
        eyebrow: "04 · 운영",
        title: "배포 인프라와 TEE 네트워크",
        description:
          "키 프로비저닝·정책 검증·오케스트레이션을 서비스와 분산 네트워크에 연결합니다.",
        subcategories: ["tee-infra", "tee-net"],
      },
    ],
    featuredArticles: [
      "hw-security",
      "intel-sgx",
      "intel-tdx",
      "amd-sev",
      "op-tee",
      "dstack",
      "keylime",
      "oasis",
    ],
  },
  "isms-aml": {
    title: "컴플라이언스를 범위에서 증적까지 읽는 네 단계",
    description:
      "통제 항목을 체크리스트처럼 외우지 않고 자산과 위험을 정한 뒤, 예방 통제·탐지와 대응·규제 보고까지 이어지는 운영 흐름으로 읽습니다.",
    stages: [
      {
        eyebrow: "01 · 관리체계",
        title: "범위·자산·위험·책임",
        description:
          "무엇을 보호하고 누가 책임지며 어떤 위험을 수용할지 정한 뒤 증적 구조를 만듭니다.",
        subcategories: ["isms-management"],
      },
      {
        eyebrow: "02 · 보호와 복구",
        title: "접근통제·개발보안·사고 대응",
        description:
          "예방 통제와 탐지, 백업·복구가 하나의 운영 사이클에서 어떻게 증명되는지 봅니다.",
        subcategories: ["isms-protection"],
      },
      {
        eyebrow: "03 · 개인정보와 AML",
        title: "데이터 생명주기와 위험기반 감시",
        description:
          "수집·보유·파기와 CDD·RBA·FDS·STR을 각각의 입력과 판단 책임으로 구분합니다.",
        subcategories: ["isms-privacy", "aml-cft"],
      },
      {
        eyebrow: "04 · VASP 운영",
        title: "수탁·지갑·시장 감시",
        description:
          "가상자산 보관과 내부통제, 불공정거래 탐지를 실제 운영 증적과 연결합니다.",
        subcategories: ["vasp-compliance"],
      },
    ],
    featuredArticles: [
      "isms-overview",
      "isms-audit-checklist",
      "isms-practical-guide",
      "isms-encryption",
      "isms-dev-security",
      "aml-compliance",
      "aml-rba-deep",
      "vasp-wallet-security",
    ],
  },
};

import type { Article } from "../types";

// ── A. 데이터 준비 & 피처 엔지니어링 ──
const dataArticles: Article[] = [
  {
    slug: "eda-workflow",
    title: "EDA 워크플로우: 데이터 가정에서 검증 가설까지",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "EDA의 질문과 산출물" },
      { id: "distribution", title: "분포와 데이터 생성 과정" },
      { id: "correlation", title: "상관관계의 해석 범위" },
      { id: "missing", title: "결측 메커니즘과 처리" },
      { id: "hypothesis", title: "재현 가능한 가설과 다음 실험" },
    ],
    component: () => import("@/pages/articles/ai/eda-workflow"),
  },
  {
    slug: "feature-engineering",
    title: "피처 엔지니어링: 업무 가정을 모델 입력으로",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "예측 시점과 피처 계약" },
      { id: "numeric", title: "Fold-local 수치형 변환" },
      { id: "categorical", title: "Cross-fitted 범주형 인코딩" },
      { id: "interaction", title: "조건에 따라 달라지는 관계" },
      { id: "aggregation", title: "Point-in-time aggregation" },
      { id: "selection", title: "Ablation과 serving parity" },
    ],
    component: () => import("@/pages/articles/ai/feature-engineering"),
  },
  {
    slug: "data-augmentation",
    title: "데이터 증강: Label을 보존하는 변환 설계",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "가능한 변화와 label 보존" },
      { id: "geometric", title: "기하 변환과 annotation 동기화" },
      { id: "color", title: "색상 증강과 입력 전처리" },
      { id: "advanced", title: "Mixup · CutMix · Mosaic" },
      { id: "tabular", title: "테이블형 합성의 현실성 조건" },
      { id: "pipeline", title: "Albumentations pipeline 계약" },
    ],
    component: () => import("@/pages/articles/ai/data-augmentation"),
  },
  {
    slug: "imbalanced-data",
    title: "불균형 데이터: 학습 분포에서 운영 Threshold까지",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "비율보다 의사결정 비용" },
      { id: "sampling", title: "Training-fold resampling" },
      { id: "loss", title: "Class weight와 focal loss" },
      { id: "threshold", title: "운영 정책으로서의 threshold" },
      { id: "evaluation", title: "Ranking · decision · calibration" },
    ],
    component: () => import("@/pages/articles/ai/imbalanced-data"),
  },
];

// ── B. 테이블형 모델링 ──
const tabularArticles: Article[] = [
  {
    slug: "gradient-boosting",
    title: "Gradient Boosting 기초: Tree에서 Functional Gradient까지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "한 Tree의 함수 형태" },
      { id: "functional-gradient", title: "Negative functional gradient" },
      { id: "shrinkage", title: "Shrinkage와 early stopping" },
      { id: "comparison", title: "공정한 library 비교" },
    ],
    component: () => import("@/pages/articles/ai/gradient-boosting"),
  },
  {
    slug: "xgboost-tree-objective",
    title: "XGBoost Tree Objective: G·H Leaf에서 Histogram Split까지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "G·H와 leaf update" },
      { id: "split-gain", title: "Parent·child split gain" },
      { id: "histogram", title: "Histogram approximation" },
      { id: "evidence", title: "Capacity·builder·device 경계" },
    ],
    component: () => import("@/pages/articles/ai/xgboost-tree-objective"),
  },
  {
    slug: "lightgbm-efficient-trees",
    title: "LightGBM: GOSS·EFB·Leaf-wise를 비용 축으로 읽기",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "GOSS row sampling" },
      { id: "bundling", title: "EFB sparse columns" },
      { id: "leaf-growth", title: "Leaf-wise budget" },
      { id: "evidence", title: "세 failure owner" },
    ],
    component: () => import("@/pages/articles/ai/lightgbm-efficient-trees"),
  },
  {
    slug: "catboost-ordered-learning",
    title: "CatBoost Ordered Learning: Prefix Gradient와 Symmetric Tree",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "Prediction shift와 prefix" },
      { id: "prefix-gradient", title: "Ordered pseudo-residual" },
      { id: "symmetric-tree", title: "Oblivious tree shape" },
      { id: "evidence", title: "두 leakage 경로" },
    ],
    component: () => import("@/pages/articles/ai/catboost-ordered-learning"),
  },
  {
    slug: "tabular-deep-learning",
    title: "테이블 딥러닝: Row 표현에서 TabNet·FT-Transformer까지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "Row·Schema와 강한 GBDT 출발점" },
      { id: "tabnet", title: "TabNet: Mask·Prior·사전학습" },
      { id: "ft-transformer", title: "FT-Transformer: Column별 Token" },
      { id: "when-dl-wins", title: "Representation·비용·오류로 선택" },
    ],
    component: () => import("@/pages/articles/ai/tabular-deep-learning"),
  },
  {
    slug: "time-features",
    title: "시계열 피처: Forecast Origin에서 Lag·Window·주기까지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "Entity·Origin·Horizon 계약" },
      { id: "lag", title: "Observation Lag와 Duration Lag" },
      { id: "rolling", title: "Window 양끝·Count·EMA" },
      { id: "cyclic", title: "Unit Circle과 Harmonic" },
      { id: "leakage", title: "Rolling-Origin·Gap·Replay" },
    ],
    component: () => import("@/pages/articles/ai/time-features"),
  },
  {
    slug: "sequence-modeling-tabular",
    title: "이벤트 시퀀스 모델링: Cutoff에서 Token·Summary·Attention까지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "Entity·Cutoff·Available History" },
      { id: "encoding", title: "Event Token·Padding·Truncation" },
      { id: "aggregation", title: "Transition과 Summary Collision" },
      { id: "transformer", title: "Visibility·Pooling·Order 검증" },
    ],
    component: () => import("@/pages/articles/ai/sequence-modeling-tabular"),
  },
];

// ── C. 학습 파이프라인 ──
const pipelineArticles: Article[] = [
  {
    slug: "training-pipeline",
    title: "PyTorch 학습 파이프라인: Data Contract에서 Resume까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "재현 가능한 Run의 네 경계" },
      { id: "dataset", title: "Dataset·Sampler·Collate·Wait" },
      { id: "loop", title: "Phase·Effective Batch·AMP" },
      { id: "checkpoint", title: "State Closure와 Resume Test" },
      { id: "logging", title: "Global Metric과 Provenance" },
    ],
    component: () => import("@/pages/articles/ai/training-pipeline"),
  },
  {
    slug: "transfer-learning-practice",
    title: "Transfer Learning: Fixed Feature에서 Domain Adaptation까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Pretrained Handoff와 Adaptation Ladder" },
      { id: "freezing", title: "Parameter·Optimizer·Buffer Freeze" },
      { id: "lr-strategy", title: "Layer별 Relative Update" },
      {
        id: "feature-vs-finetune",
        title: "Fixed·Partial·Full 공정 비교",
      },
      { id: "domain-shift", title: "Shift·Adaptation·Negative Transfer" },
    ],
    component: () => import("@/pages/articles/ai/transfer-learning-practice"),
  },
  {
    slug: "lr-scheduling",
    title: "Learning Rate Scheduling: Update Clock부터 OneCycle까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Update Clock과 Schedule Contract" },
      { id: "step-exponential", title: "Open-loop Decay와 Plateau Trigger" },
      { id: "cosine", title: "Cosine Progress와 Warm Restart" },
      { id: "onecycle", title: "OneCycle·Range Test·Momentum" },
      { id: "warmup", title: "Warmup 경계와 Update Magnitude" },
    ],
    component: () => import("@/pages/articles/ai/lr-scheduling"),
  },
  {
    slug: "regularization-practice",
    title: "Generalization Gap 진단: Regularizer보다 원인을 먼저 찾기",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "두 Empirical Risk부터 정의" },
      { id: "gap", title: "Observed Gap 계산" },
      { id: "audit", title: "Leakage·Pipeline·Shift 감사" },
      { id: "ablation", title: "한 축 Paired Ablation" },
    ],
    component: () => import("@/pages/articles/ai/regularization-practice"),
  },
  {
    slug: "dropout-regularization",
    title: "Dropout: Bernoulli Mask에서 Train·Eval 경계까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Activation·Mask·Scale" },
      { id: "mask", title: "기댓값과 Noise 분산" },
      { id: "mode", title: "Train·Eval Mode" },
      { id: "boundary", title: "Nonlinearity와 적용 경계" },
    ],
    component: () => import("@/pages/articles/ai/dropout-regularization"),
  },
  {
    slug: "weight-decay",
    title: "Weight Decay: L2·SGD 등가에서 AdamW Group까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Weight·Gradient·LR·Decay" },
      { id: "sgd-equivalence", title: "L2와 SGD Shrink" },
      { id: "adamw", title: "Adaptive Update와 분리" },
      { id: "parameter-groups", title: "Decay Group Coverage" },
    ],
    component: () => import("@/pages/articles/ai/weight-decay"),
  },
  {
    slug: "early-stopping",
    title: "Early Stopping: Validation State에서 Best 복원까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "상태 기계의 다섯 값" },
      { id: "state-machine", title: "Best와 Counter 갱신" },
      { id: "stop-and-restore", title: "Stop과 Best 분리" },
      { id: "artifact", title: "재현 가능한 Artifact" },
    ],
    component: () => import("@/pages/articles/ai/early-stopping"),
  },
  {
    slug: "label-smoothing",
    title: "Label Smoothing: One-hot에서 Soft Target 조합까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "One-hot·Uniform·ε" },
      { id: "target", title: "Probability Mass 재배분" },
      { id: "loss", title: "Soft-target Cross-entropy" },
      { id: "composition", title: "Mixup과 조합 감사" },
    ],
    component: () => import("@/pages/articles/ai/label-smoothing"),
  },
];

// ── D. 실전 컴퓨터 비전 ──
const cvArticles: Article[] = [
  {
    slug: "image-classification-pipeline",
    title: "이미지 분류 파이프라인: Data Boundary에서 Decision까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Identity Group Split과 Baseline Receipt" },
      { id: "backbone", title: "Spatial Prior·Scaling·Runtime Budget" },
      { id: "training", title: "Augmentation·Resolution·Pseudo-label" },
      { id: "postprocess", title: "Logit·Calibration·Decision Contract" },
    ],
    component: () =>
      import("@/pages/articles/ai/image-classification-pipeline"),
  },
  {
    slug: "vision-transformer",
    title: "Vision Transformer: Patch Token에서 Pretrained Handoff까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Spatial Prior와 Token Boundary" },
      { id: "patch-embedding", title: "Patch Projection·Position·Shape" },
      { id: "architecture", title: "DeiT·Swin·MAE의 서로 다른 병목" },
      { id: "tradeoff", title: "Paired Quality–Runtime Selection" },
      { id: "practice", title: "Position Resize와 Logit Parity" },
    ],
    component: () => import("@/pages/articles/ai/vision-transformer"),
  },
  {
    slug: "multiview-fusion",
    title: "멀티뷰 Fusion: Episode Contract에서 Missing-view 평가까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Episode · Identity · Order 계약" },
      { id: "early-fusion", title: "Registration과 Input-level Fusion" },
      { id: "late-fusion", title: "Masked Representation Aggregation" },
      { id: "attention-fusion", title: "Cross-view Token·Cost·Intervention" },
    ],
    component: () => import("@/pages/articles/ai/multiview-fusion"),
  },
  {
    slug: "deepfake-detection",
    title: "딥페이크 탐지: Source Boundary에서 Unseen Manipulation까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Source Independence와 Worst-domain Risk" },
      { id: "face-extraction", title: "Track Coverage와 Failure Lineage" },
      { id: "frequency", title: "Conditional Frequency Evidence" },
      { id: "models", title: "Temporal Aggregation과 Benchmark Contract" },
      { id: "external-data", title: "Provenance·Consent·Coverage Matrix" },
    ],
    component: () => import("@/pages/articles/ai/deepfake-detection"),
  },
  {
    slug: "video-understanding",
    title: "비디오 이해: Event Duration에서 Video Token Budget까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Duration·Sampling Rate·Aliasing" },
      { id: "sampling", title: "Interval Coverage와 Deterministic Replay" },
      { id: "3dcnn", title: "Temporal Receptive Field·I3D·SlowFast" },
      { id: "video-transformer", title: "Tubelet·Factorized Attention·VideoMAE" },
    ],
    component: () => import("@/pages/articles/ai/video-understanding"),
  },
];

// ── E. 도메인 특화 임베딩 ──
const embeddingArticles: Article[] = [
  {
    slug: "contrastive-learning",
    title: "Contrastive Learning: Pair Contract에서 Hard Negative까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Positive·negative가 정의하는 불변식" },
      { id: "simclr", title: "Augmentation pair와 NT-Xent" },
      { id: "triplet", title: "Relative margin과 mining policy" },
      { id: "supervised", title: "Label 기반 multi-positive" },
      { id: "application", title: "Pair audit와 downstream loop" },
    ],
    component: () => import("@/pages/articles/ai/contrastive-learning"),
  },
  {
    slug: "domain-finetuning",
    title: "도메인 적응: Continued Pretraining·RAG·Fine-tuning 선택",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "지식 · 언어 · behavior gap 진단" },
      { id: "continued-pretrain", title: "Corpus 적응과 forgetting 감시" },
      { id: "task-finetune", title: "Input–output · label contract" },
      { id: "genomic", title: "전문 도메인의 split과 provenance" },
    ],
    component: () => import("@/pages/articles/ai/domain-finetuning"),
  },
  {
    slug: "sentence-embeddings",
    title: "문장 임베딩: Pooling Contract에서 Retrieval 평가까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Pooling보다 먼저 볼 학습 관계" },
      { id: "sbert", title: "Bi-encoder 검색과 cross-encoder reranking" },
      { id: "modern", title: "Role instruction과 model-card contract" },
      { id: "evaluation", title: "Benchmark · domain slice · serving cost" },
    ],
    component: () => import("@/pages/articles/ai/sentence-embeddings"),
  },
  {
    slug: "sionic-eureka",
    title: "EUREKA: 견고한 검색 임베딩을 만드는 데이터·증류 파이프라인",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "보편성보다 먼저 정의할 robustness" },
      { id: "data", title: "코퍼스·라벨·누출 경계" },
      { id: "query-generation", title: "쿼리·정답 위치·multi-positive" },
      { id: "hard-negatives", title: "Positive-aware hard negative" },
      { id: "distillation", title: "Scalar teacher score와 KL distillation" },
      { id: "ablation", title: "Loss ablation: 결과와 해석의 경계" },
      { id: "evaluation", title: "전체 점수에서 slice 진단으로" },
    ],
    component: () => import("@/pages/articles/ai/sionic-eureka"),
  },
];

// ── F. 모델 경량화 ──
const compressionArticles: Article[] = [
  {
    slug: "quantization",
    title: "양자화: Scale·Outlier·Kernel에서 Deployment까지",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Bit width 밖의 quantization contract" },
      { id: "ptq", title: "Calibration · scale · operator conversion" },
      { id: "qat", title: "Fake quantization과 실제 export" },
      { id: "gptq-awq", title: "GPTQ·AWQ method와 GGUF format" },
      { id: "practice", title: "Hardware–runtime–quality matrix" },
    ],
    component: () => import("@/pages/articles/ai/quantization"),
  },
  {
    slug: "pruning",
    title: "프루닝: Sparsity Pattern에서 실제 Runtime까지",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "제거 단위와 kernel support" },
      { id: "unstructured", title: "Weight mask와 sparse format" },
      { id: "structured", title: "Channel · head · block shape" },
      { id: "llm", title: "SparseGPT · Wanda one-shot pruning" },
      { id: "recovery", title: "Mask 유지와 quality recovery" },
    ],
    component: () => import("@/pages/articles/ai/pruning"),
  },
  {
    slug: "knowledge-distillation",
    title: "지식 증류 기초: Soft Target · Feature Alignment",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Teacher signal interface" },
      { id: "soft-target", title: "Temperature와 class odds" },
      { id: "hard-soft-loss", title: "Hard·soft target 결합" },
      { id: "feature-alignment", title: "Hidden feature bridge" },
      { id: "release-gate", title: "Student-only 검증" },
    ],
    component: () => import("@/pages/articles/ai/knowledge-distillation"),
  },
  {
    slug: "sequence-distillation",
    title: "Sequence Distillation: Teacher Text에서 Student Dataset까지",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Vocabulary 불일치" },
      { id: "sequence-loss", title: "Retokenize와 loss mask" },
      { id: "provenance", title: "Generation provenance" },
      { id: "coverage-release", title: "Coverage·contamination gate" },
    ],
    component: () => import("@/pages/articles/ai/sequence-distillation"),
  },
  {
    slug: "on-policy-distillation",
    title: "On-Policy Distillation: Student Prefix에서 Teacher Feedback까지",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Student-visited state" },
      { id: "state-mismatch", title: "Fixed·on-policy mixture" },
      { id: "teacher-feedback", title: "Token-level teacher feedback" },
      { id: "multi-teacher", title: "Specialist policy 통합" },
      { id: "release-gate", title: "Rollout·cost·regression gate" },
    ],
    component: () => import("@/pages/articles/ai/on-policy-distillation"),
  },
  {
    slug: "self-distillation",
    title: "Self-Distillation: 세대 계약과 Bias Inheritance",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Frozen generation boundary" },
      { id: "generation-contract", title: "Teacher·student 세대 계약" },
      { id: "inheritance-audit", title: "Agreement·quality gap" },
      { id: "stop-gate", title: "반복 중단 gate" },
    ],
    component: () => import("@/pages/articles/ai/self-distillation"),
  },
  {
    slug: "compression-pipeline",
    title: "모델 경량화 파이프라인: Deployment Budget에서 Benchmark까지",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "병목별 compression lever" },
      { id: "order", title: "Distribution이 바뀌는 stage 순서" },
      { id: "budget", title: "Quality · memory · latency contract" },
      { id: "benchmark", title: "End-to-end serving benchmark" },
    ],
    component: () => import("@/pages/articles/ai/compression-pipeline"),
  },
];

// ── G. LLM 응용 ──
const llmAppArticles: Article[] = [
  {
    slug: "rag-pipeline",
    title: "RAG 파이프라인: Source Ingestion에서 Grounded Answer까지",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "overview", title: "Answer에서 source까지 이어지는 trace" },
      { id: "chunking", title: "검색 단위 · 근거 단위 · metadata" },
      { id: "embedding", title: "Embedding–index version contract" },
      { id: "retrieval", title: "Candidate recall · fusion · reranking" },
      { id: "generation", title: "Context · citation · abstention policy" },
      { id: "evaluation", title: "Retrieval · context · answer 분리 평가" },
    ],
    component: () => import("@/pages/articles/ai/rag-pipeline"),
  },
  {
    slug: "lora-finetuning",
    title: "LoRA·QLoRA: Adapter Contract에서 배포 경로까지",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "overview", title: "Frozen base와 trainable adapter" },
      { id: "lora", title: "Rank · target module · update capacity" },
      { id: "qlora", title: "Quantized storage와 compute precision" },
      { id: "data", title: "Chat template · loss mask · provenance" },
      { id: "practice", title: "Adapter lineage · merge · serving" },
    ],
    component: () => import("@/pages/articles/ai/lora-finetuning"),
  },
  {
    slug: "multi-agent-implementation",
    title: "멀티에이전트 구현: State · Worker · Join Contract",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "overview", title: "작업 계약과 합류 지점" },
      { id: "architecture", title: "분해 패턴과 join contract" },
      { id: "langgraph", title: "LangGraph 공유 state와 병렬 branch" },
      { id: "crewai", title: "CrewAI Crews와 Flows" },
      { id: "manufacturing", title: "제조 사례: 판단과 제어 분리" },
    ],
    component: () => import("@/pages/articles/ai/multi-agent-implementation"),
  },
];

// ── H. 대회 전략 & 실험 관리 ──
const strategyArticles: Article[] = [
  {
    slug: "competition-workflow",
    title: "평가 계약: 예측 한 행과 점수의 역할 고정하기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Prediction row와 cutoff" },
      { id: "target", title: "Target horizon과 label" },
      { id: "metric", title: "Metric unit·reducer·direction" },
      { id: "roles", title: "Local·public·private 역할" },
    ],
    component: () => import("@/pages/articles/ai/competition-workflow"),
  },
  {
    slug: "model-selection-bias",
    title: "Model-selection bias: noisy score의 최대값을 고를 때",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "True score와 observed score" },
      { id: "maximum", title: "Maximum-selection optimism" },
      { id: "budget", title: "Candidate 수와 noise" },
      { id: "boundary", title: "Independent final evaluation" },
    ],
    component: () => import("@/pages/articles/ai/model-selection-bias"),
  },
  {
    slug: "prediction-time-feature-availability",
    title: "Prediction-time feature: 실제로 도착한 정보만 쓰기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Event time과 available time" },
      { id: "lineage", title: "Source record lineage" },
      { id: "fixture", title: "Cutoff admission fixture" },
      { id: "boundary", title: "Transform·join·serving 경계" },
    ],
    component: () => import("@/pages/articles/ai/prediction-time-feature-availability"),
  },
  {
    slug: "competition-baseline",
    title: "Competition baseline: 첫 end-to-end artifact 만들기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "작지만 완결된 baseline" },
      { id: "coverage", title: "OOF row coverage" },
      { id: "artifact", title: "Prediction·metric·submission lineage" },
      { id: "boundary", title: "재현과 품질의 경계" },
    ],
    component: () => import("@/pages/articles/ai/competition-baseline"),
  },
  {
    slug: "paired-experiment-design",
    title: "Paired experiment: 한 가설을 같은 fold에서 비교하기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Failure slice에서 hypothesis까지" },
      { id: "change", title: "한 축의 변경과 gate" },
      { id: "paired-delta", title: "Fold별 paired delta" },
      { id: "boundary", title: "상호작용·비용·불확실성" },
    ],
    component: () => import("@/pages/articles/ai/paired-experiment-design"),
  },
  {
    slug: "competition-submission-control",
    title: "Submission control: feedback budget과 최종 manifest",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Submission과 adaptive feedback 구분" },
      { id: "feedback", title: "Decision-changing feedback budget" },
      { id: "manifest", title: "Final submission manifest" },
      { id: "boundary", title: "Freeze·rollback·새 holdout" },
    ],
    component: () => import("@/pages/articles/ai/competition-submission-control"),
  },
  {
    slug: "cross-validation",
    title: "교차검증: 배포 질문을 먼저 정하는 법",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "배포 질문과 평가 단위" },
      { id: "risk", title: "Validation risk의 형태" },
      { id: "split-family", title: "질문에서 split family 고르기" },
      { id: "boundary", title: "분포 변화와 재검증 경계" },
    ],
    component: () => import("@/pages/articles/ai/cross-validation"),
  },
  {
    slug: "fold-local-validation",
    title: "Fold-local validation: 전처리가 시험을 보지 못하게 하기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Fold와 fitted state" },
      { id: "pipeline", title: "Fit과 transform의 분리" },
      { id: "manifest", title: "Fold manifest와 재학습" },
      { id: "boundary", title: "외부 transform과 누출 경계" },
    ],
    component: () => import("@/pages/articles/ai/fold-local-validation"),
  },
  {
    slug: "oof-risk-estimation",
    title: "OOF prediction: 교차검증 점수가 뜻하는 것",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "행마다 unseen prediction 만들기" },
      { id: "pooling", title: "Pooled OOF risk" },
      { id: "estimand", title: "Model이 아니라 procedure 평가" },
      { id: "boundary", title: "Metric과 uncertainty 경계" },
    ],
    component: () => import("@/pages/articles/ai/oof-risk-estimation"),
  },
  {
    slug: "grouped-validation",
    title: "Group split: 같은 원인의 표본을 함께 묶기",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Row와 entity 구분" },
      { id: "disjoint", title: "Group 교집합을 비우기" },
      { id: "evidence", title: "독립 평가 단위 세기" },
      { id: "boundary", title: "중첩 group과 site 경계" },
    ],
    component: () => import("@/pages/articles/ai/grouped-validation"),
  },
  {
    slug: "walk-forward-validation",
    title: "Walk-forward validation: 미래 정보를 차단하는 시간 분할",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Forecast origin과 available time" },
      { id: "labels", title: "Label 확정 시각" },
      { id: "gap-purge", title: "Gap·purge·rolling origin" },
      { id: "boundary", title: "Expanding·rolling 정책 경계" },
    ],
    component: () => import("@/pages/articles/ai/walk-forward-validation"),
  },
  {
    slug: "validation-feedback-audit",
    title: "검증 피드백 감사: CV와 leaderboard가 어긋날 때",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Score 차이와 순위 차이" },
      { id: "agreement", title: "후보 쌍 방향 일치" },
      { id: "adaptation", title: "Protocol 변경 기록" },
      { id: "boundary", title: "Frozen holdout과 종료 조건" },
    ],
    component: () => import("@/pages/articles/ai/validation-feedback-audit"),
  },
  {
    slug: "hyperparameter-tuning",
    title: "하이퍼파라미터 튜닝: Search Contract와 Trial Budget",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "공정한 trial evaluation contract" },
      { id: "optuna", title: "Study · sampler · storage lineage" },
      { id: "search-space", title: "Type · scale · conditional constraint" },
      { id: "pruning", title: "Comparable step · pruning · Pareto frontier" },
    ],
    component: () => import("@/pages/articles/ai/hyperparameter-tuning"),
  },
  {
    slug: "ensemble-methods",
    title: "앙상블: Out-of-Fold Evidence와 Error Diversity",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Model 수보다 error diversity" },
      { id: "averaging", title: "Mean · weighted · rank average" },
      { id: "stacking", title: "Leakage-safe OOF stacking" },
      { id: "blending", title: "Holdout blending과 data trade-off" },
      { id: "practice", title: "Marginal gain과 serving cost" },
    ],
    component: () => import("@/pages/articles/ai/ensemble-methods"),
  },
  {
    slug: "evaluation-metrics",
    title: "평가 지표: Error Cost에서 운영 Threshold까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "의사결정과 error cost를 수식으로" },
      { id: "regression", title: "Residual 크기 · scale · interval" },
      { id: "classification", title: "Ranking · probability · decision" },
      { id: "ranking", title: "Relevance label · depth k · query slice" },
      { id: "optimization", title: "Loss · selection · policy 분리" },
    ],
    component: () => import("@/pages/articles/ai/evaluation-metrics"),
  },
  {
    slug: "experiment-tracking",
    title: "실험 관리: Run 기록에서 Provenance Graph까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "결과를 다시 만드는 provenance" },
      { id: "wandb", title: "Run · config · artifact lineage" },
      { id: "mlflow", title: "Tracking · artifact · registry 경계" },
      { id: "reproducibility", title: "Input · execution · tolerance contract" },
    ],
    component: () => import("@/pages/articles/ai/experiment-tracking"),
  },
];

export const practicalArticles: Article[] = [
  ...dataArticles,
  ...tabularArticles,
  ...pipelineArticles,
  ...cvArticles,
  ...embeddingArticles,
  ...compressionArticles,
  ...llmAppArticles,
  ...strategyArticles,
];

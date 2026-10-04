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
    title: "Data Augmentation 기초: 허용 변화와 Target Map",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "허용 변화부터 시작하기" },
      { id: "target-map", title: "Input과 target을 함께 바꾸기" },
      { id: "objective", title: "Augmented empirical risk" },
      { id: "boundary", title: "Label counterexample gate" },
    ],
    component: () => import("@/pages/articles/ai/data-augmentation"),
  },
  {
    slug: "image-augmentation-transforms",
    title: "Image Augmentation: 좌표 · 색 · Normalization",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Geometry와 photometry 분리" },
      { id: "visibility", title: "Annotation과 visibility" },
      { id: "photometric", title: "Photometric label boundary" },
      { id: "normalization", title: "고정 input 좌표" },
    ],
    component: () =>
      import("@/pages/articles/ai/image-augmentation-transforms"),
  },
  {
    slug: "mixup-cutmix",
    title: "Mixup · CutMix · Mosaic: Sample과 Target 조합",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "여러 sample을 한 pair로" },
      { id: "mixup", title: "Convex input·target" },
      { id: "cutmix", title: "Visible-area target" },
      { id: "mosaic", title: "Annotation composition" },
    ],
    component: () => import("@/pages/articles/ai/mixup-cutmix"),
  },
  {
    slug: "tabular-data-synthesis",
    title: "Tabular Data Synthesis: Row 제약과 Split 경계",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "가능한 row란 무엇인가" },
      { id: "constraints", title: "Constraint ledger" },
      { id: "split-local", title: "Train-fold synthesis" },
      { id: "audit", title: "Utility와 privacy" },
    ],
    component: () => import("@/pages/articles/ai/tabular-data-synthesis"),
  },
  {
    slug: "augmentation-evaluation",
    title: "Augmentation Evaluation: Clean · Robust · TTA",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Versioned policy artifact" },
      { id: "clean-robust", title: "Clean과 robustness 분리" },
      { id: "tta", title: "TTA inverse mapping" },
      { id: "release", title: "Paired release gate" },
    ],
    component: () => import("@/pages/articles/ai/augmentation-evaluation"),
  },
  {
    slug: "imbalanced-data",
    title: "불균형 분류 기초: Prevalence에서 Action까지",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Population과 prevalence" },
      { id: "prevalence-baseline", title: "All-negative baseline" },
      { id: "three-layers", title: "Ranking · probability · action" },
    ],
    component: () => import("@/pages/articles/ai/imbalanced-data"),
  },
  {
    slug: "imbalance-resampling",
    title: "불균형 Resampling: Fold에서 SMOTE Geometry까지",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Training exposure만 변경" },
      { id: "fold-local", title: "Split-local sampling" },
      { id: "smote-geometry", title: "Minority 선분 보간" },
      { id: "release-boundary", title: "Geometry·lineage gate" },
    ],
    component: () => import("@/pages/articles/ai/imbalance-resampling"),
  },
  {
    slug: "imbalance-loss-weighting",
    title: "불균형 Loss: Class Weight와 Focal Modulation",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Gradient contribution" },
      { id: "class-weight", title: "고정 class 배점" },
      { id: "focal-modulation", title: "현재 난이도 배점" },
      { id: "noise-boundary", title: "Hard noise audit" },
    ],
    component: () => import("@/pages/articles/ai/imbalance-loss-weighting"),
  },
  {
    slug: "cost-sensitive-thresholding",
    title: "비용 민감 Threshold: Probability에서 Action까지",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Threshold policy" },
      { id: "expected-cost", title: "두 action의 expected cost" },
      { id: "capacity-policy", title: "Capacity·recall constraints" },
      { id: "release-receipt", title: "Policy release receipt" },
    ],
    component: () => import("@/pages/articles/ai/cost-sensitive-thresholding"),
  },
  {
    slug: "imbalanced-classification-evaluation",
    title: "불균형 분류 평가: Confusion · PR · Calibration",
    subcategory: "ai-practical-data",
    sections: [
      { id: "overview", title: "Report의 세 평가 층" },
      { id: "confusion-matrix", title: "Precision · recall" },
      { id: "prevalence-shift", title: "Base-rate 이동" },
      { id: "calibration", title: "Probability reliability" },
      { id: "report", title: "통합 evaluation report" },
    ],
    component: () =>
      import("@/pages/articles/ai/imbalanced-classification-evaluation"),
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
    title: "Learning-rate Schedule 기초: Update Clock과 Resume",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Schedule 전에 clock부터" },
      { id: "update-clock", title: "Effective batch에서 total updates로" },
      { id: "schedule-function", title: "Clock·state에서 LR로" },
      { id: "resume-boundary", title: "Trajectory resume" },
    ],
    component: () => import("@/pages/articles/ai/lr-scheduling"),
  },
  {
    slug: "lr-decay-policies",
    title: "Learning-rate Decay: Clock Policy와 Metric Trigger",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "두 policy의 입력" },
      { id: "open-loop", title: "Step·exponential decay" },
      { id: "metric-trigger", title: "Plateau state machine" },
      { id: "selection-boundary", title: "Decay와 stopping 순서" },
    ],
    component: () => import("@/pages/articles/ai/lr-decay-policies"),
  },
  {
    slug: "cosine-restart-scheduling",
    title: "Cosine Annealing: Progress와 Warm Restart",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Cosine cycle의 형태" },
      { id: "cosine-progress", title: "반 주기 보간" },
      { id: "restart-state", title: "Restart state boundary" },
      { id: "comparison-boundary", title: "같은 compute 비교" },
    ],
    component: () => import("@/pages/articles/ai/cosine-restart-scheduling"),
  },
  {
    slug: "one-cycle-scheduling",
    title: "OneCycle: LR Range Test에서 Phase Policy까지",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "진단과 실행 분리" },
      { id: "range-test", title: "LR range test" },
      { id: "one-cycle", title: "Rise·decay phase" },
      { id: "release-boundary", title: "Divergence rollback" },
    ],
    component: () => import("@/pages/articles/ai/one-cycle-scheduling"),
  },
  {
    slug: "warmup-scheduling",
    title: "Learning-rate Warmup: Main Schedule과 Update Magnitude",
    subcategory: "ai-practical-pipeline",
    sections: [
      { id: "overview", title: "Warmup의 네 경계" },
      { id: "composition", title: "Global·local clock" },
      { id: "update-magnitude", title: "Relative update" },
      { id: "failure-boundary", title: "Warmup이 못 고치는 것" },
    ],
    component: () => import("@/pages/articles/ai/warmup-scheduling"),
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
export const cvArticles: Article[] = [
  {
    slug: "image-classification-pipeline",
    title: "이미지 분류 데이터 경계: Identity Split과 Baseline Receipt",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Image Sample과 Deployment Unit" },
      { id: "identity", title: "Identity Group Split" },
      { id: "baseline", title: "Baseline Receipt" },
      { id: "release", title: "Leakage·Reproduction Gate" },
    ],
    component: () =>
      import("@/pages/articles/ai/image-classification-pipeline"),
  },
  {
    slug: "image-backbone-scaling",
    title: "이미지 Backbone 선택: Resolution Cost와 Runtime Budget",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Backbone이 소유하는 변환" },
      { id: "resolution-cost", title: "CNN·ViT Resolution Cost" },
      { id: "compound-scaling", title: "Depth·Width·Resolution 조합" },
      { id: "budget-comparison", title: "Quality–Runtime Frontier" },
    ],
    component: () => import("@/pages/articles/ai/image-backbone-scaling"),
  },
  {
    slug: "image-training-stages",
    title: "이미지 학습 단계: Resolution Handoff와 Pseudo-label",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "한 번에 한 Stage만 변경" },
      { id: "resolution-stage", title: "Progressive Resolution Boundary" },
      { id: "pseudo-label", title: "Weak→Strong Consistency" },
      { id: "release", title: "Precision·Coverage·Rollback" },
    ],
    component: () => import("@/pages/articles/ai/image-training-stages"),
  },
  {
    slug: "image-probability-decisions",
    title: "이미지 확률과 판정: Logit·Calibration·Decision Contract",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Score·Probability·Action 분리" },
      { id: "temperature", title: "Temperature Scaling" },
      { id: "decision-contract", title: "TTA·Ensemble·Threshold" },
      { id: "release", title: "Selection Split과 Release" },
    ],
    component: () => import("@/pages/articles/ai/image-probability-decisions"),
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
    slug: "dinov3-self-supervised-backbone",
    title: "DINOv3는 dense feature 붕괴를 Gram anchoring으로 막습니다",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "라벨 없이 배운 표현을 얼려 두고 씁니다" },
      {
        id: "two-objectives",
        title: "정답은 이전 시점의 자기 자신이 만듭니다",
        subsections: [
          { id: "view-objective", title: "이미지 수준 목표는 크롭 쌍의 분포를 맞춥니다" },
          { id: "patch-objective", title: "패치 수준 목표는 가린 자리의 분포를 맞춥니다" },
        ],
      },
      { id: "dense-collapse", title: "오래 학습할수록 패치 사이 구별이 흐려집니다" },
      {
        id: "gram-anchoring",
        title: "값을 베끼지 않고 패치 사이 관계만 붙잡습니다",
        subsections: [{ id: "gram-teacher", title: "기준 teacher는 언제 세우고 언제 갱신합니까" }],
      },
      { id: "post-hoc", title: "해상도와 크기는 학습을 다시 하지 않고 넓힙니다" },
      {
        id: "use-boundary",
        title: "얼린 backbone에 얇은 head만 올려 판단합니다",
        subsections: [{ id: "paper-dinov3", title: "기술 보고서가 보인 것과 보이지 않은 것" }],
      },
    ],
    component: () => import("@/pages/articles/ai/dinov3-self-supervised-backbone"),
  },
  {
    slug: "vision-backbone-selection",
    title: "무엇으로 학습했는지가 어떤 과제에 맞는지를 정합니다",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "벤치마크 순위표는 선택 기준이 아닙니다" },
      {
        id: "objective-axes",
        title: "학습 목표가 남긴 것과 지운 것을 봅니다",
        subsections: [{ id: "text-aligned", title: "텍스트로 질의할 수 있다는 것은 별도 능력입니다" }],
      },
      { id: "task-mapping", title: "과제가 요구하는 능력부터 한 문장으로 적습니다" },
      {
        id: "measure-first",
        title: "고르기 전에 30분짜리 실측을 돌립니다",
        subsections: [{ id: "probe-protocol", title: "비교 가능하려면 무엇을 고정해야 합니까" }],
      },
      { id: "cost-and-switch", title: "교체 비용을 먼저 계산하고 고릅니다" },
      { id: "decision-gate", title: "판단 순서를 고정하면 논쟁이 줄어듭니다" },
    ],
    component: () => import("@/pages/articles/ai/vision-backbone-selection"),
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
    title: "딥페이크 평가 기초: Source Group과 Unseen Risk",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "파일이 아니라 Source Group" },
      { id: "source-groups", title: "Derivative·Identity 분리" },
      { id: "domain-risk", title: "평균과 Worst-domain Risk" },
      { id: "release", title: "Unseen Claim의 경계" },
    ],
    component: () => import("@/pages/articles/ai/deepfake-detection"),
  },
  {
    slug: "deepfake-preprocessing-lineage",
    title: "딥페이크 전처리: Face Track Coverage와 Lineage",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "전처리도 Model이다" },
      { id: "detection-track", title: "Detect에서 Identity Track까지" },
      { id: "coverage", title: "실패를 분모에 남기기" },
      { id: "lineage", title: "Crop Transform Receipt" },
    ],
    component: () =>
      import("@/pages/articles/ai/deepfake-preprocessing-lineage"),
  },
  {
    slug: "deepfake-frequency-evidence",
    title: "딥페이크 주파수 단서: Spectrum에서 Joint Error까지",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "주파수 단서는 조건부 Evidence" },
      { id: "spectrum", title: "Image에서 Spectrum으로" },
      { id: "corruption", title: "Codec·Resize Corruption Matrix" },
      { id: "joint-error", title: "RGB와 Frequency의 Joint Error" },
    ],
    component: () => import("@/pages/articles/ai/deepfake-frequency-evidence"),
  },
  {
    slug: "deepfake-video-decisions",
    title: "딥페이크 Video Decision: Aggregation과 Benchmark Parity",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Frame Score는 Video Decision이 아니다" },
      { id: "aggregation", title: "Mean·Max·Top-k" },
      { id: "parity", title: "동일 Input·Budget 비교" },
      { id: "release", title: "Calibration·Abstention" },
    ],
    component: () => import("@/pages/articles/ai/deepfake-video-decisions"),
  },
  {
    slug: "deepfake-dataset-governance",
    title: "딥페이크 Dataset Governance: Provenance·Consent·Coverage",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "영상 수보다 Source Identity" },
      { id: "provenance", title: "Source에서 Derivative까지" },
      { id: "coverage", title: "Generator×Codec Coverage" },
      { id: "release", title: "Consent·Deletion·Claim Gate" },
    ],
    component: () => import("@/pages/articles/ai/deepfake-dataset-governance"),
  },
  {
    slug: "video-understanding",
    title: "비디오 시간 관측: Duration · Sampling Rate · Aliasing",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "영상은 시간축 관측" },
      { id: "duration", title: "Frame Index를 Seconds로" },
      { id: "sampling-rate", title: "Stride 뒤 Effective FPS" },
      { id: "aliasing", title: "빠른 Motion이 겹치는 경계" },
    ],
    component: () => import("@/pages/articles/ai/video-understanding"),
  },
  {
    slug: "video-clip-sampling",
    title: "비디오 Clip Sampling: Coverage · Replay · Split",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Frame Budget을 Interval로" },
      { id: "coverage", title: "겹침 없는 시간 Coverage" },
      { id: "replay", title: "Deterministic Multi-clip" },
      { id: "release", title: "Train Randomness와 Eval Receipt" },
    ],
    component: () => import("@/pages/articles/ai/video-clip-sampling"),
  },
  {
    slug: "video-convolution-architectures",
    title: "비디오 Convolution: Receptive Span · I3D · R(2+1)D · SlowFast",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "시간 연산을 넣는 위치" },
      { id: "receptive-span", title: "원본 Seconds로 보는 범위" },
      { id: "inflation-factorization", title: "I3D와 R(2+1)D" },
      { id: "slowfast", title: "Rate와 Capacity 분리" },
    ],
    component: () =>
      import("@/pages/articles/ai/video-convolution-architectures"),
  },
  {
    slug: "video-transformers",
    title: "Video Transformer: Tubelet · Space-Time Attention · VideoMAE",
    subcategory: "ai-practical-cv",
    sections: [
      { id: "overview", title: "Video를 Token으로" },
      { id: "tubelets", title: "Tubelet Count" },
      { id: "attention-cost", title: "Joint와 Factorized Attention" },
      { id: "masked-pretraining", title: "Visible Tubelet Pretraining" },
    ],
    component: () => import("@/pages/articles/ai/video-transformers"),
  },
];

// ── E. 도메인 특화 임베딩 ──
export const embeddingArticles: Article[] = [
  {
    slug: "contrastive-learning",
    title: "Contrastive Learning 기초: Pair Contract와 Projection",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Loss보다 먼저 pair 의미 정의" },
      { id: "pair-contract", title: "Positive·negative·unknown relation" },
      { id: "projection", title: "Encoder h와 projection z" },
      { id: "release", title: "Pair counterexample과 handoff" },
    ],
    component: () => import("@/pages/articles/ai/contrastive-learning"),
  },
  {
    slug: "simclr-infonce",
    title: "SimCLR · NT-Xent: Augmentation Pair에서 In-batch 분류까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "한 원본에서 두 view 만들기" },
      { id: "batch", title: "2B view와 anchor 후보" },
      { id: "objective", title: "NT-Xent in-batch softmax" },
      { id: "temperature", title: "Temperature와 false negative" },
    ],
    component: () => import("@/pages/articles/ai/simclr-infonce"),
  },
  {
    slug: "triplet-metric-learning",
    title: "Triplet Metric Learning: Unit Geometry · Margin · Mining",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Anchor·positive·negative" },
      { id: "geometry", title: "Cosine과 squared distance" },
      { id: "margin", title: "Relative margin hinge" },
      { id: "mining", title: "Versioned hard-negative miner" },
    ],
    component: () => import("@/pages/articles/ai/triplet-metric-learning"),
  },
  {
    slug: "supervised-contrastive-learning",
    title: "Supervised Contrastive Learning: Label을 Multi-positive로",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Label에서 positive relation까지" },
      { id: "positive-set", title: "P(i)와 valid anchor" },
      { id: "objective", title: "Multi-positive 평균 loss" },
      { id: "release", title: "Sampler·subgroup·downstream gate" },
    ],
    component: () =>
      import("@/pages/articles/ai/supervised-contrastive-learning"),
  },
  {
    slug: "contrastive-evaluation",
    title: "Contrastive Evaluation: False-negative Audit와 Downstream Gain",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Candidate·audit·downstream artifact" },
      { id: "pair-audit", title: "Bucket별 false-negative rate" },
      { id: "downstream", title: "Paired seed evaluation" },
      { id: "release", title: "Data revision과 test 경계" },
    ],
    component: () => import("@/pages/articles/ai/contrastive-evaluation"),
  },
  {
    slug: "domain-finetuning",
    title: "도메인 적응 선택: RAG·Pretraining·SFT를 고르는 법",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "네 종류의 domain gap" },
      { id: "evidence", title: "실패를 재현하는 baseline" },
      { id: "candidates", title: "RAG와 weight adaptation 경계" },
      { id: "release", title: "최소 개입 release gate" },
    ],
    component: () => import("@/pages/articles/ai/domain-finetuning"),
  },
  {
    slug: "continued-pretraining",
    title: "Continued Pretraining: Corpus Mixture와 Forgetting",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "DAPT·TAPT·general replay" },
      { id: "corpus-mixture", title: "Corpus manifest와 λ mixture" },
      { id: "comparable-perplexity", title: "비교 가능한 perplexity" },
      { id: "forgetting-release", title: "Gain–forgetting checkpoint" },
    ],
    component: () => import("@/pages/articles/ai/continued-pretraining"),
  },
  {
    slug: "domain-task-finetuning",
    title: "Domain Task Fine-tuning: Demonstration에서 Release까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "행동 example의 네 계약" },
      { id: "demonstration", title: "Response-only loss mask" },
      { id: "update-scope", title: "Full·LoRA·frozen 범위" },
      { id: "evaluation", title: "행동 release gate" },
    ],
    component: () => import("@/pages/articles/ai/domain-task-finetuning"),
  },
  {
    slug: "domain-data-governance",
    title: "Domain Data Governance: Group Split·Rights·Evidence",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Row 뒤의 공유 원인" },
      { id: "group-time-split", title: "Entity·family·time split" },
      { id: "rights-lineage", title: "권리와 삭제 lineage" },
      { id: "coverage-release", title: "Slice evidence와 주장 범위" },
    ],
    component: () => import("@/pages/articles/ai/domain-data-governance"),
  },
  {
    slug: "sentence-embeddings",
    title: "문장 임베딩: Token State에서 Relation Vector까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "문장에서 vector로" },
      { id: "pooling", title: "Mask pooling의 형태" },
      { id: "relation", title: "가까움의 의미를 학습" },
      { id: "similarity", title: "Cosine score의 경계" },
    ],
    component: () => import("@/pages/articles/ai/sentence-embeddings"),
  },
  {
    slug: "bi-encoder-retrieval",
    title: "Bi-encoder Retrieval: 사전 계산에서 Reranking까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "두 검색 구조" },
      { id: "offline-index", title: "문서 vector 사전 계산" },
      { id: "candidate", title: "Candidate set의 상한" },
      { id: "reranking", title: "Recall 뒤의 reranking" },
    ],
    component: () => import("@/pages/articles/ai/bi-encoder-retrieval"),
  },
  {
    slug: "embedding-serving-contract",
    title: "Embedding Serving Contract: 입력에서 Index Generation까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "Checkpoint보다 큰 artifact" },
      { id: "serialization", title: "Query·passage 직렬화" },
      { id: "truncation", title: "Content token 보존" },
      { id: "index-artifact", title: "Index generation receipt" },
    ],
    component: () => import("@/pages/articles/ai/embedding-serving-contract"),
  },
  {
    slug: "image-embedding-pipeline",
    title: "이미지 임베딩은 전처리와 풀링에서 대부분 갈립니다",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "사진 한 장이 벡터가 되기까지 결정이 세 번 있습니다" },
      {
        id: "preprocessing",
        title: "전처리는 정보를 버리는 단계입니다",
        subsections: [{ id: "resize-crop", title: "같은 설정이라도 순서가 다르면 결과가 다릅니다" }],
      },
      {
        id: "pooling",
        title: "출력은 벡터 하나가 아니라 패치 수만큼 나옵니다",
        subsections: [{ id: "dense-vs-global", title: "부분을 찾으려면 벡터를 하나로 줄이면 안 됩니다" }],
      },
      { id: "similarity", title: "거리에는 의미가 아닌 것도 섞여 들어옵니다" },
      { id: "pipeline-contract", title: "네 가지를 묶어야 색인을 다시 만들 시점이 정해집니다" },
      { id: "evaluation", title: "시각적으로 비슷한 것이 정답은 아닙니다" },
    ],
    component: () => import("@/pages/articles/ai/image-embedding-pipeline"),
  },
  {
    slug: "image-text-contrastive-pretraining",
    title: "이미지와 문장을 같은 공간에 맞추는 두 가지 손실",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "캡션을 정답 대신 씁니다" },
      {
        id: "softmax-loss",
        title: "배치 안에서 자기 짝을 골라내게 만듭니다",
        subsections: [{ id: "temperature-scale", title: "온도를 학습시키는 이유" }],
      },
      {
        id: "sigmoid-loss",
        title: "정규화를 없애면 쌍마다 독립이 됩니다",
        subsections: [{ id: "logit-bias", title: "음성 쌍이 N배 많다는 사실을 편향이 흡수합니다" }],
      },
      { id: "batch-and-negatives", title: "배치 크기가 곧 음성 쌍의 개수입니다" },
      { id: "zero-shot", title: "범주 이름을 문장으로 바꾸면 분류기가 됩니다" },
      {
        id: "boundary",
        title: "두 손실은 우열이 아니라 다른 제약을 풉니다",
        subsections: [{ id: "paper-clip", title: "원 논문 두 편이 각각 보인 것" }],
      },
    ],
    component: () => import("@/pages/articles/ai/image-text-contrastive-pretraining"),
  },
  {
    slug: "embedding-evaluation",
    title: "Embedding Evaluation: 정답 집합에서 품질–비용 Frontier까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "overview", title: "무엇을 정답이라 부를까" },
      { id: "labels", title: "Multi-positive label snapshot" },
      { id: "metrics", title: "Recall과 NDCG" },
      { id: "release", title: "Slice와 품질–비용 gate" },
    ],
    component: () => import("@/pages/articles/ai/embedding-evaluation"),
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
    title: "양자화 기초: Scale · Code · Rounding · Clipping",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "실수와 유한 codebook" },
      { id: "affine-map", title: "Scale·zero-point로 code 만들기" },
      { id: "error-shape", title: "Rounding과 clipping 오차" },
      { id: "format-boundary", title: "Affine INT와 FP8의 경계" },
    ],
    component: () => import("@/pages/articles/ai/quantization"),
  },
  {
    slug: "ptq-calibration",
    title: "PTQ Calibration: Scale Granularity · Coverage · Artifact",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "학습 없이 변환하는 PTQ" },
      { id: "quantization-axes", title: "PTQ·QAT, weight·activation의 축" },
      { id: "scale-granularity", title: "Scale 공유 범위와 metadata" },
      { id: "dynamic-static-outliers", title: "Dynamic·static과 outlier handling" },
      { id: "coverage", title: "Layer·traffic slice 포화" },
      { id: "release", title: "Scale 선택과 artifact release" },
    ],
    component: () => import("@/pages/articles/ai/ptq-calibration"),
  },
  {
    slug: "quantization-formats-and-granularity",
    title: "양자화 숫자 형식과 granularity: 비트 폭과 스케일 단위",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "형식 축과 granularity 축" },
      { id: "integer-formats", title: "INT8·INT4 code 개수" },
      { id: "floating-point-formats", title: "FP8·FP4·NVFP4" },
      { id: "extreme-low-bit", title: "Binary·ternary weight" },
      { id: "zero-point-symmetry", title: "Zero-point와 symmetric·asymmetric" },
      { id: "granularity", title: "Per-tensor부터 block까지" },
    ],
    component: () => import("@/pages/articles/ai/quantization-formats-and-granularity"),
  },
  {
    slug: "quantization-aware-training",
    title: "Quantization-Aware Training: Fake Quant · STE · Export",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "배포 오차에 적응하는 재학습" },
      { id: "fake-quant", title: "계단형 forward" },
      { id: "ste", title: "Surrogate backward" },
      { id: "release", title: "Converted artifact 검증" },
    ],
    component: () => import("@/pages/articles/ai/quantization-aware-training"),
  },
  {
    slug: "weight-only-quantization",
    title: "Weight-Only Quantization: GPTQ · AWQ · Artifact Boundary",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Weight-only execution profile" },
      { id: "output-reconstruction", title: "Layer output reconstruction" },
      { id: "gptq-awq", title: "GPTQ와 AWQ의 다른 보정" },
      { id: "artifact-boundary", title: "Method·format·container" },
    ],
    component: () => import("@/pages/articles/ai/weight-only-quantization"),
  },
  {
    slug: "quantized-model-deployment",
    title: "Quantized Model Deployment: Weight Bytes · VRAM · Kernel",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Parameter 수에서 GPU admission까지" },
      { id: "weight-budget", title: "Dtype별 weight payload" },
      { id: "resident-ledger", title: "KV·activation·workspace" },
      { id: "runtime-release", title: "Kernel과 end-to-end speedup" },
    ],
    component: () => import("@/pages/articles/ai/quantized-model-deployment"),
  },
  {
    slug: "pruning",
    title: "Pruning Foundations: Mask · Density · Removal Unit",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Weight와 binary mask" },
      { id: "mask-shape", title: "Density와 sparsity" },
      { id: "removal-unit", title: "Weight · N:M · channel" },
      { id: "handoff", title: "Runtime consumer handoff" },
    ],
    component: () => import("@/pages/articles/ai/pruning"),
  },
  {
    slug: "unstructured-pruning",
    title: "Unstructured Pruning: Importance · Index · Break-even",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "개별 weight 제거" },
      { id: "storage-break-even", title: "Value·index 손익분기" },
      { id: "movement-score", title: "Magnitude와 movement" },
      { id: "paper-movement-pruning", title: "논문 경계" },
    ],
    component: () => import("@/pages/articles/ai/unstructured-pruning"),
  },
  {
    slug: "structured-pruning",
    title: "Structured Pruning: Shape Propagation · N:M",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Channel·head와 N:M" },
      { id: "shape-propagation", title: "Graph dimension 축소" },
      { id: "nm-pattern", title: "Local pattern 적격성" },
      { id: "paper-structured-sparsity", title: "Runtime 문서 경계" },
    ],
    component: () => import("@/pages/articles/ai/structured-pruning"),
  },
  {
    slug: "one-shot-llm-pruning",
    title: "One-Shot LLM Pruning: Calibration · SparseGPT · Wanda",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Calibration prompt와 layer input" },
      { id: "calibration", title: "Wanda activation score" },
      { id: "reconstruction", title: "SparseGPT reconstruction" },
      { id: "papers", title: "두 method의 근거 경계" },
    ],
    component: () => import("@/pages/articles/ai/one-shot-llm-pruning"),
  },
  {
    slug: "pruning-recovery-deployment",
    title: "Pruning Recovery & Deployment: Mask · Kernel · Release",
    subcategory: "ai-practical-compression",
    sections: [
      { id: "overview", title: "Fixed-mask recovery" },
      { id: "mask-invariant", title: "Parameter·state invariant" },
      { id: "runtime-receipt", title: "Sparse tactic와 Amdahl" },
      { id: "release", title: "Quality·memory·latency frontier" },
    ],
    component: () => import("@/pages/articles/ai/pruning-recovery-deployment"),
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
      { id: "motif-mopd-case", title: "Motif 3 chosen-token MOPD" },
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
      { id: "retrieval", title: "검색 funnel 경계와 독립 글 연결" },
      { id: "generation", title: "Context · citation · abstention policy" },
      { id: "evaluation", title: "Retrieval · context · answer 분리 평가" },
    ],
    component: () => import("@/pages/articles/ai/rag-pipeline"),
  },
  {
    slug: "retrieval-ranking-funnel",
    title: "Retrieval Ranking Funnel: BM25·HNSW·RRF·Cross-Encoder",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "overview", title: "Candidate funnel과 recall ceiling" },
      { id: "retrieval", title: "Sparse·dense·fusion·reranking" },
    ],
    component: () => import("@/pages/articles/ai/retrieval-ranking-funnel"),
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
  {
    "id": "overview",
    "title": "1. 무엇을 언제 맞힌다는 것인지 먼저 정합니다"
  },
  {
    "id": "black-box",
    "title": "2. 한 행의 입력과 미래 결과를 연결합니다"
  },
  {
    "id": "small-case",
    "title": "3. 10시에 예측하고 다음 날 10시까지 관찰합니다"
  },
  {
    "id": "inside-contract",
    "title": "4. 방문 식별자와 시간 경계와 결과를 함께 보관합니다"
  },
  {
    "id": "why-complete",
    "title": "5. 아직 사건을 못 봤다는 것과 사건이 없었다는 것은 다릅니다"
  },
  {
    "id": "evaluation-terms",
    "title": "6. 예측 행과 입력 경계와 관찰 길이에 이름을 붙입니다"
  },
  {
    "id": "target",
    "title": "7. 열린 시작점과 닫힌 끝점에 사건을 넣어 봅니다"
  },
  {
    "id": "source-availability",
    "title": "8. 공식 누수 정의를 늦게 도착한 입력에 적용합니다"
  },
  {
    "id": "metric",
    "title": "9. 점수의 평균 단위를 행의 의미와 맞춥니다"
  },
  {
    "id": "roles",
    "title": "10. 점수를 본 뒤 바꿀 수 있는 결정을 미리 나눕니다"
  },
  {
    "id": "boundary",
    "title": "11. 같은 시각의 도착과 지연된 정답까지 규칙에 남깁니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 같은 시험을 재현할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/competition-workflow"),
  },
  {
    slug: "model-selection-bias",
    title: "Model-selection bias: noisy score의 최대값을 고를 때",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 가장 높은 점수에는 실력과 우연이 함께 들어갑니다"
  },
  {
    "id": "black-box",
    "title": "2. 평가하고 고르고 별도 자료에서 다시 확인합니다"
  },
  {
    "id": "small-case",
    "title": "3. 평균이 0.70인 세 후보가 서로 다른 점수를 받습니다"
  },
  {
    "id": "inside-selection",
    "title": "4. 후보별 평균과 이번의 흔들림을 나눕니다"
  },
  {
    "id": "why-fresh",
    "title": "5. 같은 점수를 다시 읽어도 새 검증이 되지 않습니다"
  },
  {
    "id": "selection-terms",
    "title": "6. 평균과 잡음과 최고값에 이름을 붙입니다"
  },
  {
    "id": "maximum",
    "title": "7. 평균이 0인 흔들림도 최고값을 남기면 달라집니다"
  },
  {
    "id": "paper-model-selection-bias",
    "title": "8. 논문이 지적한 선택 기준의 흔들림을 사례에 적용합니다"
  },
  {
    "id": "boundary",
    "title": "9. 후보 수만으로 편향의 크기를 정할 수 없습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 최고값과 평균을 구분할 수 있나요"
  }
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
    component: () =>
      import("@/pages/articles/ai/prediction-time-feature-availability"),
  },
  {
    slug: "competition-baseline",
    title: "Competition baseline: 첫 end-to-end artifact 만들기",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 다섯 행의 예측이 빠짐없이 같은 실행에서 나와야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 입력과 분할과 예측과 제출을 하나로 연결합니다"
  },
  {
    "id": "small-case",
    "title": "3. 예측은 다섯 개지만 3번 행이 빠졌습니다"
  },
  {
    "id": "inside-baseline",
    "title": "4. 행 이름과 학습에 쓴 행을 함께 보관합니다"
  },
  {
    "id": "why-coverage",
    "title": "5. 총개수 검사와 누수 검사는 다른 오류를 찾습니다"
  },
  {
    "id": "baseline-terms",
    "title": "6. 행별 예측과 실행 기록에 이름을 붙입니다"
  },
  {
    "id": "coverage",
    "title": "7. 분할을 고쳐 모든 행의 횟수를 1로 만듭니다"
  },
  {
    "id": "baseline-source",
    "title": "8. 공식 API의 한 번씩 평가하는 조건에 대응합니다"
  },
  {
    "id": "boundary",
    "title": "9. 제출 순서와 환경까지 같은 실행에 연결합니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 예측 개수와 올바른 평가를 구분할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/competition-baseline"),
  },
  {
    slug: "paired-experiment-design",
    title: "Paired experiment: 한 가설을 같은 fold에서 비교하기",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 변경 하나가 좋아졌는지 같은 조건에서 비교합니다"
  },
  {
    "id": "black-box",
    "title": "2. 오류의 가설을 하나 정하고 짝지어 검사합니다"
  },
  {
    "id": "small-case",
    "title": "3. 다섯 차이의 평균은 0.0034입니다"
  },
  {
    "id": "inside-pair",
    "title": "4. 점수 두 개가 같은 평가 행을 가리켜야 합니다"
  },
  {
    "id": "why-one-change",
    "title": "5. 모델과 표현을 같이 바꾸면 원인을 나누기 어렵습니다"
  },
  {
    "id": "experiment-terms",
    "title": "6. 같은 자료의 차이를 paired difference라고 부릅니다"
  },
  {
    "id": "paired-delta",
    "title": "7. 평균 개선과 느려진 비용을 함께 판정합니다"
  },
  {
    "id": "paired-source",
    "title": "8. 공식 예제의 차이 계산에 같은 다섯 값을 넣습니다"
  },
  {
    "id": "boundary",
    "title": "9. 차이를 짝지어도 교란과 선택 편향이 모두 사라지지는 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "10. 짝과 평균과 채택을 구분할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/paired-experiment-design"),
  },
  {
    slug: "competition-submission-control",
    title: "Submission control: feedback budget과 최종 manifest",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 파일을 보낸 횟수와 선택에 쓴 피드백을 나눠 기록합니다"
  },
  {
    "id": "black-box",
    "title": "2. 전송과 관측과 후속 선택을 차례로 잇습니다"
  },
  {
    "id": "small-case",
    "title": "3. 네 번 보내고 두 번 선택을 바꿉니다"
  },
  {
    "id": "inside-submission",
    "title": "4. 파일 내용과 외부 결과와 결정 이유를 연결합니다"
  },
  {
    "id": "why-log",
    "title": "5. 형식 수정이라는 이름만으로 무변경이라 세지 않습니다"
  },
  {
    "id": "submission-terms",
    "title": "6. 전송과 관측과 동결에 이름을 붙입니다"
  },
  {
    "id": "feedback",
    "title": "7. 0과 1을 더하되 모든 정보 사용량이라고 해석하지 않습니다"
  },
  {
    "id": "paper-submission-control",
    "title": "8. Ladder는 평가자가 공개하는 숫자를 제한합니다"
  },
  {
    "id": "manifest",
    "title": "9. 최종 B에서 실행과 입력과 파일을 거슬러 갑니다"
  },
  {
    "id": "boundary",
    "title": "10. 동결과 기록은 좋은 일반화를 보장하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 동결한 내용과 실제 파일이 같은가요"
  }
],
    component: () =>
      import("@/pages/articles/ai/competition-submission-control"),
  },
  {
    slug: "cross-validation",
    title: "교차검증: 배포 질문을 먼저 정하는 법",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 새 대상을 잘 맞히는지부터 물어야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 사용할 장면을 정하고 작은 예행연습을 만듭니다"
  },
  {
    "id": "small-case",
    "title": "3. 기록 4개와 사람 2명은 다른 평균을 만듭니다"
  },
  {
    "id": "inside-evaluation",
    "title": "4. 학습 대상과 평가 대상과 평균의 단위를 연결합니다"
  },
  {
    "id": "why-unit",
    "title": "5. 좋아 보이는 평균을 나중에 고르면 질문이 바뀝니다"
  },
  {
    "id": "validation-terms",
    "title": "6. 예행연습의 대상과 목표에 이름을 붙입니다"
  },
  {
    "id": "risk",
    "title": "7. C와 D를 평균내는 계산을 학습 절차의 식으로 씁니다"
  },
  {
    "id": "paper-cv-foundation",
    "title": "8. 공식 문서의 보지 못한 그룹 조건을 적용합니다"
  },
  {
    "id": "split-family",
    "title": "9. 다음 달과 새 병원은 다른 예행연습이 필요합니다"
  },
  {
    "id": "boundary",
    "title": "10. 과거에 맞춘 질문도 새 환경에서는 다시 확인합니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 평균을 바꾸면 어떤 질문이 바뀌나요"
  }
],
    component: () => import("@/pages/articles/ai/cross-validation"),
  },
  {
    slug: "fold-local-validation",
    title: "Fold-local validation: 전처리가 시험을 보지 못하게 하기",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 평균을 미리 구하는 일도 학습에 포함됩니다"
  },
  {
    "id": "black-box",
    "title": "2. 배울 값과 적용할 값을 먼저 나눕니다"
  },
  {
    "id": "small-case",
    "title": "3. 2와 4에서 배운 평균을 8과 10에 적용합니다"
  },
  {
    "id": "inside-state",
    "title": "4. 행 배정과 저장한 계산 상태를 연결합니다"
  },
  {
    "id": "why-fit",
    "title": "5. 정답 없이도 평가 분포를 미리 읽을 수 있습니다"
  },
  {
    "id": "fold-terms",
    "title": "6. 상태를 배우는 fit과 적용하는 transform을 나눕니다"
  },
  {
    "id": "pipeline",
    "title": "7. 평균 3과 크기 1을 고정한 계산을 추적합니다"
  },
  {
    "id": "paper-fold-local",
    "title": "8. 공식 예제의 학습과 적용 호출을 구분합니다"
  },
  {
    "id": "manifest",
    "title": "9. 예측마다 실제 행 배정과 저장 상태를 연결합니다"
  },
  {
    "id": "boundary",
    "title": "10. 선택 뒤 전체 학습 자료를 다시 쓰는 단계는 구별합니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 어떤 자료에서 배운 상태인가요"
  }
],
    component: () => import("@/pages/articles/ai/fold-local-validation"),
  },
  {
    slug: "oof-risk-estimation",
    title: "OOF prediction: 교차검증 점수가 뜻하는 것",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 배우지 않은 행의 답을 모아 평가합니다"
  },
  {
    "id": "black-box",
    "title": "2. 한 묶음을 빼고 예측한 뒤 자리를 바꿉니다"
  },
  {
    "id": "small-case",
    "title": "3. 20행과 80행의 실패를 합칩니다"
  },
  {
    "id": "inside-oof",
    "title": "4. 예측마다 어느 행과 어느 학습 모델인지 남깁니다"
  },
  {
    "id": "why-weight",
    "title": "5. 묶음 평균을 같은 무게로 세면 작은 묶음이 커집니다"
  },
  {
    "id": "oof-terms",
    "title": "6. 자신을 배우지 않은 답에 이름을 붙입니다"
  },
  {
    "id": "pooling",
    "title": "7. 손실 합 4와 32를 원래 분모 100으로 나눕니다"
  },
  {
    "id": "paper-cv-estimand",
    "title": "8. 논문의 행별 평균 식에 같은 손실을 넣습니다"
  },
  {
    "id": "estimand",
    "title": "9. 전체 자료로 다시 배운 모델 하나와는 구별합니다"
  },
  {
    "id": "boundary",
    "title": "10. 순위 지표에는 행 평균식을 그대로 쓰지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 어느 평균과 어느 모델의 점수인가요"
  }
],
    component: () => import("@/pages/articles/ai/oof-risk-estimation"),
  },
  {
    slug: "grouped-validation",
    title: "Group split: 같은 원인의 표본을 함께 묶기",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 한 사람의 기록을 처음 보는 사람처럼 평가하지 않습니다"
  },
  {
    "id": "black-box",
    "title": "2. 같은 대상의 기록을 함께 옮깁니다"
  },
  {
    "id": "small-case",
    "title": "3. C의 세 기록은 모두 평가 쪽에 둡니다"
  },
  {
    "id": "inside-groups",
    "title": "4. 행 번호와 원래 대상의 번호를 별도로 보존합니다"
  },
  {
    "id": "why-groups",
    "title": "5. 비슷한 기록을 기억한 성과가 섞이는 것을 막습니다"
  },
  {
    "id": "group-terms",
    "title": "6. 기록을 묶는 키와 평가 단위에 이름을 붙입니다"
  },
  {
    "id": "disjoint",
    "title": "7. 집합의 교집합으로 C가 섞였는지 확인합니다"
  },
  {
    "id": "evidence",
    "title": "8. 평가 행 4개를 독립된 사람 4명처럼 세지 않습니다"
  },
  {
    "id": "paper-group-split",
    "title": "9. 공식 API는 그룹을 한 번씩 평가에 넣습니다"
  },
  {
    "id": "boundary",
    "title": "10. 같은 병원이라는 더 큰 공유 원인이 남을 수 있습니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 행 수와 대상 수를 구별할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/grouped-validation"),
  },
  {
    slug: "walk-forward-validation",
    title: "Walk-forward validation: 미래 정보를 차단하는 시간 분할",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 과거에 생긴 사건도 아직 알 수 없을 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 시계를 고정하고 도착한 기록만 학습합니다"
  },
  {
    "id": "small-case",
    "title": "3. 10월 25일 사건의 정답은 12월 1일에 도착합니다"
  },
  {
    "id": "inside-time",
    "title": "4. 사건과 입력과 정답의 시각을 나누어 기록합니다"
  },
  {
    "id": "why-arrival",
    "title": "5. 정답이 일찍 들어오면 미래의 답안을 본 셈입니다"
  },
  {
    "id": "time-terms",
    "title": "6. 발생과 가용성과 예측 시작점에 이름을 붙입니다"
  },
  {
    "id": "labels",
    "title": "7. 30일과 7일을 더하고 엄격한 이전 조건을 적용합니다"
  },
  {
    "id": "paper-walk-forward",
    "title": "8. 공식 gap 인자는 달력의 날짜를 세지 않습니다"
  },
  {
    "id": "gap-purge",
    "title": "9. 거리와 정보 구간의 겹침은 다른 검사입니다"
  },
  {
    "id": "boundary",
    "title": "10. 실제 재학습 범위와 정답 확정 정책을 재현합니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 그 시점에 정말 알 수 있었나요"
  }
],
    component: () => import("@/pages/articles/ai/walk-forward-validation"),
  },
  {
    slug: "validation-feedback-audit",
    title: "검증 피드백 감사: CV와 leaderboard가 어긋날 때",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 점수가 낮아진 것과 후보 순서가 바뀐 것은 다릅니다"
  },
  {
    "id": "black-box",
    "title": "2. 같은 후보를 맞추고 차이의 원인을 검사합니다"
  },
  {
    "id": "small-case",
    "title": "3. 다섯 후보 중 두 쌍의 순서만 바뀝니다"
  },
  {
    "id": "inside-comparison",
    "title": "4. 값의 비교와 방향의 비교를 따로 보관합니다"
  },
  {
    "id": "why-parity",
    "title": "5. 행이 어긋난 점수를 분포 변화로 설명하지 않습니다"
  },
  {
    "id": "feedback-terms",
    "title": "6. 점수 차이와 순위 일치와 적응을 나눕니다"
  },
  {
    "id": "agreement",
    "title": "7. 10쌍에서 동점을 제외하고 8개의 방향 일치를 셉니다"
  },
  {
    "id": "paper-validation-feedback",
    "title": "8. 원문의 점수 공개 규칙에 같은 후보를 넣습니다"
  },
  {
    "id": "adaptation",
    "title": "9. 오류 수정도 어떤 피드백 뒤에 했는지 남깁니다"
  },
  {
    "id": "boundary",
    "title": "10. 좋은 일치율도 마지막 순서를 보장하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 동점과 적응을 숨기지 않았나요"
  }
],
    component: () => import("@/pages/articles/ai/validation-feedback-audit"),
  },
  {
    slug: "hyperparameter-tuning",
    title: "하이퍼파라미터 튜닝: Trial에서 Outer Evaluation까지",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 같은 시험을 거친 설정을 고르고 새 시험으로 확인합니다"
  },
  {
    "id": "black-box",
    "title": "2. 조건을 정하고 시험하고 고른 뒤 별도로 평가합니다"
  },
  {
    "id": "small-case",
    "title": "3. 세 설정 중 B를 고르지만 보고할 숫자는 따로 있습니다"
  },
  {
    "id": "inside-study",
    "title": "4. 설정과 실행과 선택 결과를 다른 기록으로 남깁니다"
  },
  {
    "id": "why-contract",
    "title": "5. 더 오래 학습한 효과가 설정의 효과와 섞이지 않게 합니다"
  },
  {
    "id": "tuning-terms",
    "title": "6. 설정 묶음과 실행과 선택용 평가에 이름을 붙입니다"
  },
  {
    "id": "selection-contract",
    "title": "7. 후보별 10을 누적해 30을 확인한 뒤 B를 고릅니다"
  },
  {
    "id": "trial-budget",
    "title": "8. 좋은 영역을 놓칠 확률에서 탐색 횟수를 계산합니다"
  },
  {
    "id": "paper-random-search",
    "title": "9. 논문이 고르는 것도 실제로 시험한 후보 중 하나입니다"
  },
  {
    "id": "outer-evaluation",
    "title": "10. 마지막 평가를 본 뒤 바꾸면 새 선택 과정이 됩니다"
  },
  {
    "id": "boundary",
    "title": "11. 비교 계약이 맞아도 작은 시험의 불확실성은 남습니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 선택과 보고와 총비용을 구분할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/hyperparameter-tuning"),
  },
  {
    slug: "adaptive-hyperparameter-search",
    title: "적응형 하이퍼파라미터 탐색: History에서 다음 Trial까지",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 앞서 해 본 결과로 다음 시도를 고릅니다"
  },
  {
    "id": "black-box",
    "title": "2. 이력을 읽고 후보를 골라 실제 결과를 되돌립니다"
  },
  {
    "id": "small-case",
    "title": "3. 손실 네 개를 나눈 뒤 두 후보를 비교합니다"
  },
  {
    "id": "inside-history",
    "title": "4. 설정과 점수와 점수가 생긴 상태를 함께 남깁니다"
  },
  {
    "id": "why-state",
    "title": "5. 실패한 실행에 가짜 나쁜 점수를 붙이지 않습니다"
  },
  {
    "id": "search-terms",
    "title": "6. 관측 이력과 근사 모델과 다음 실행 가치에 이름을 붙입니다"
  },
  {
    "id": "proposal-loop",
    "title": "7. 네 완료 관측을 읽은 시점의 제안을 추적합니다"
  },
  {
    "id": "tpe",
    "title": "8. 좋은 관측에서의 밀도를 나머지 밀도로 나눕니다"
  },
  {
    "id": "paper-tpe",
    "title": "9. 원문의 개선 기대값 식에 비율 6과 2를 넣습니다"
  },
  {
    "id": "paper-optuna",
    "title": "10. 공식 구현의 초기 관측과 제약 처리까지 확인합니다"
  },
  {
    "id": "parallel-boundary",
    "title": "11. 제안의 제약과 실제 실행 가능성을 따로 검사합니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 제안 값과 실제 성능을 구분할 수 있나요"
  }
],
    component: () =>
      import("@/pages/articles/ai/adaptive-hyperparameter-search"),
  },
  {
    slug: "search-space-design",
    title: "Search Space 설계: Type · Scale · Condition · Constraint",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 같은 범위에서도 무엇을 자주 뽑을지는 달라집니다"
  },
  {
    "id": "black-box",
    "title": "2. 값의 모양과 뽑는 비중을 정하고 필요한 항목만 붙입니다"
  },
  {
    "id": "small-case",
    "title": "3. 같은 중간 위치가 0.001과 0.050005로 갈립니다"
  },
  {
    "id": "inside-space",
    "title": "4. 한 숫자에도 형태·범위·비중·조건을 붙입니다"
  },
  {
    "id": "why-scale",
    "title": "5. 아무 조합이나 늘리면 같은 예산으로 보는 곳이 바뀝니다"
  },
  {
    "id": "space-terms",
    "title": "6. 값의 형태와 좌표와 존재 조건에 이름을 붙입니다"
  },
  {
    "id": "scale",
    "title": "7. 로그 좌표의 절반을 원래 크기로 돌립니다"
  },
  {
    "id": "conditional-space",
    "title": "8. 활성 분기와 예상 메모리를 모두 통과해야 합니다"
  },
  {
    "id": "paper-optuna-space",
    "title": "9. 공식 예제의 범위와 로그 옵션을 구분해 읽습니다"
  },
  {
    "id": "versioning",
    "title": "10. 실제 코드의 분기는 필요한 항목만 생성합니다"
  },
  {
    "id": "boundary",
    "title": "11. 사전 검사와 실제 실행의 차이도 결과입니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 좌표와 추첨법과 실행 가능성을 구별했나요"
  }
],
    component: () => import("@/pages/articles/ai/search-space-design"),
  },
  {
    slug: "multi-fidelity-pruning",
    title: "Multi-fidelity Pruning: 후보 수와 자원 깊이 교환",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 모든 후보를 끝까지 돌리기 전에 일부에 자원을 더 줍니다"
  },
  {
    "id": "black-box",
    "title": "2. 같은 진척에서 비교하고 일부만 더 학습합니다"
  },
  {
    "id": "small-case",
    "title": "3. 아홉 후보를 1·3·9단위에서 비교합니다"
  },
  {
    "id": "inside-rungs",
    "title": "4. 각 관측에 후보와 진척과 상태를 붙입니다"
  },
  {
    "id": "why-coordinate",
    "title": "5. 같은 epoch라는 이름만으로 비교 기준이 같지는 않습니다"
  },
  {
    "id": "pruning-terms",
    "title": "6. 평가 깊이와 비교 지점과 중단 정책에 이름을 붙입니다"
  },
  {
    "id": "successive-halving",
    "title": "7. 후보 수는 3으로 나누고 목표 깊이는 3배 합니다"
  },
  {
    "id": "resource-accounting",
    "title": "8. 누적 목표 9와 새로 쓰는 6을 구분합니다"
  },
  {
    "id": "paper-hyperband",
    "title": "9. 원문의 안쪽 반복에 같은 후보 수와 자원을 넣습니다"
  },
  {
    "id": "false-prune-audit",
    "title": "10. 멈춘 표본 20개 중 4개를 놓쳤다면 분모는 20입니다"
  },
  {
    "id": "boundary",
    "title": "11. 늦게 좋아지는 후보와 재개 상태를 따로 검사합니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 줄인 후보와 절약한 자원과 놓친 후보를 구별했나요"
  }
],
    component: () => import("@/pages/articles/ai/multi-fidelity-pruning"),
  },
  {
    slug: "multi-objective-hpo",
    title: "Multi-objective HPO: Constraint에서 Pareto 선택까지",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 정확도와 속도와 메모리 사이에서 선택 이유를 남깁니다"
  },
  {
    "id": "black-box",
    "title": "2. 필수 한도를 검사한 뒤 서로 나은 점이 있는 후보를 남깁니다"
  },
  {
    "id": "small-case",
    "title": "3. 메모리로 D를 빼고 A와 C 사이의 선택을 남깁니다"
  },
  {
    "id": "inside-objectives",
    "title": "4. 목표값과 허용 여부와 선호를 다른 칸에 둡니다"
  },
  {
    "id": "why-separate",
    "title": "5. 0.18과 15와 3을 더하면 단위 선택이 결과를 바꿉니다"
  },
  {
    "id": "pareto-terms",
    "title": "6. 목표와 지배와 남은 경계에 이름을 붙입니다"
  },
  {
    "id": "dominance",
    "title": "7. A와 B의 각 축을 비교해 모두 통과하는지 봅니다"
  },
  {
    "id": "paper-multiobjective-optuna",
    "title": "8. 공식 문서도 모든 축과 적어도 한 축을 함께 검사합니다"
  },
  {
    "id": "uncertainty",
    "title": "9. 반복 10회 중 6회인 관계는 관측 0.6으로 보고합니다"
  },
  {
    "id": "tolerance-boundary",
    "title": "10. 허용폭을 넣은 비교는 순환할 수도 있습니다"
  },
  {
    "id": "selection-receipt",
    "title": "11. 남은 A와 C 중 선택한 이유를 따로 적습니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 모든 면의 우열과 실제 선택을 나누어 보았나요"
  }
],
    component: () => import("@/pages/articles/ai/multi-objective-hpo"),
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
    title: "평가 설계: Decision Cost와 집계 단위",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Prediction과 action 구분" },
      { id: "action-cost", title: "Outcome별 decision cost" },
      { id: "reducer", title: "Observation → unit → slice" },
      { id: "map", title: "Output 형태별 metric 수업" },
    ],
    component: () => import("@/pages/articles/ai/evaluation-metrics"),
  },
  {
    slug: "regression-metrics",
    title: "회귀 평가: Residual Cost와 Prediction Interval",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Actual · prediction · residual" },
      { id: "residual-penalty", title: "Absolute와 squared penalty" },
      { id: "bayes-act", title: "평균과 중앙값 target" },
      { id: "interval", title: "Coverage와 interval width" },
    ],
    component: () => import("@/pages/articles/ai/regression-metrics"),
  },
  {
    slug: "classification-metrics",
    title: "분류 평가: Ranking · Probability · Threshold",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "세 evaluation layers" },
      { id: "proper-score", title: "정직한 probability score" },
      { id: "threshold", title: "Cost-aware action" },
      { id: "report", title: "세 층의 release report" },
    ],
    component: () => import("@/pages/articles/ai/classification-metrics"),
  },
  {
    slug: "ranking-metrics",
    title: "검색·추천 평가: Relevance에서 Query Population까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Query와 ranked list" },
      { id: "ndcg", title: "Gain · discount · ideal order" },
      { id: "query-population", title: "Macro와 traffic 평균" },
      { id: "judgment-boundary", title: "Incomplete judgment" },
    ],
    component: () => import("@/pages/articles/ai/ranking-metrics"),
  },
  {
    slug: "metric-selection-protocol",
    title: "Metric Selection Protocol: Loss에서 Outer Test까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Fit · select · policy · report" },
      { id: "information-boundary", title: "Data별 결정 경계" },
      { id: "guardrails", title: "Feasible candidate set" },
      { id: "receipt", title: "Selection receipt" },
    ],
    component: () => import("@/pages/articles/ai/metric-selection-protocol"),
  },
  {
    slug: "experiment-tracking",
    title: "실험 Provenance: Spec에서 Artifact까지",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 점수에서 실제 입력과 실행까지 돌아갈 수 있어야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 조건과 실행과 결과를 화살표로 연결합니다"
  },
  {
    "id": "small-case",
    "title": "3. 실패 A1과 성공 A2를 덮어쓰지 않습니다"
  },
  {
    "id": "inside-provenance",
    "title": "4. 실험 조건과 실제 실행은 서로 다른 대상을 가리킵니다"
  },
  {
    "id": "why-identity",
    "title": "5. 같은 이름과 크기와 평균도 같은 내용을 보장하지 않습니다"
  },
  {
    "id": "tracking-terms",
    "title": "6. 조건과 실행과 결과물에 이름을 붙입니다"
  },
  {
    "id": "spec-attempt",
    "title": "7. 같은 실행 좌표가 반복돼도 ID는 새로 만듭니다"
  },
  {
    "id": "artifact-reference",
    "title": "8. 9바이트의 내용이 바뀌었는지 직접 확인합니다"
  },
  {
    "id": "paper-mlflow-lifecycle",
    "title": "9. 공식 run_id 항목을 실제 실행에 대응시킵니다"
  },
  {
    "id": "provenance-receipt",
    "title": "10. 실패 기록도 다음 선택의 근거입니다"
  },
  {
    "id": "boundary",
    "title": "11. 기록이 있어도 파일과 실행 환경이 사라지면 재생할 수 없습니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 결과에서 입력까지 실제로 돌아갈 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/experiment-tracking"),
  },
  {
    slug: "learning-curve-tracking",
    title: "Learning Curve 추적: Step을 비교 가능한 좌표로",
    subcategory: "ai-practical-strategy",
    sections: [
  {
    "id": "overview",
    "title": "1. 곡선의 높이를 보기 전에 가로축이 무엇인지 확인합니다"
  },
  {
    "id": "black-box",
    "title": "2. 값에 진행 좌표를 붙이고 가까운 관측을 대응시킵니다"
  },
  {
    "id": "small-case",
    "title": "3. 100만토큰까지 필요한 갱신은 1000회와 250회입니다"
  },
  {
    "id": "inside-observation",
    "title": "4. 점 하나에도 진행과 평가와 실행 정체를 붙입니다"
  },
  {
    "id": "why-axes",
    "title": "5. 같은 갱신 번호와 같은 진행률도 같은 자원량은 아닙니다"
  },
  {
    "id": "curve-terms",
    "title": "6. 값과 갱신 수와 처리량을 구별해 부릅니다"
  },
  {
    "id": "progress-coordinate",
    "title": "7. 모델 진척과 소비량과 시간의 세 좌표를 남깁니다"
  },
  {
    "id": "comparison-boundary",
    "title": "8. 가장 가까운 점을 골라도 허용폭 검사는 남습니다"
  },
  {
    "id": "standard-wandb-tracking",
    "title": "9. 실제 API는 사용할 가로축의 이름을 받습니다"
  },
  {
    "id": "logging-receipt",
    "title": "10. 가로축 설정과 실제 평가의 근거를 함께 보관합니다"
  },
  {
    "id": "boundary",
    "title": "11. 과거 상태에서 다시 시작한 실행은 새 경로로 남깁니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 곡선의 같은 위치가 같은 의미인지 확인했나요"
  }
],
    component: () => import("@/pages/articles/ai/learning-curve-tracking"),
  },
  {
    slug: "model-artifact-registry",
    title: "Model Artifact Registry: Store에서 Deployment까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "Registry의 네 대상" },
      { id: "store-integrity", title: "Metadata · object integrity" },
      { id: "alias-promotion", title: "Alias promotion receipt" },
      { id: "deployment-parity", title: "Registry · endpoint parity" },
    ],
    component: () => import("@/pages/articles/ai/model-artifact-registry"),
  },
  {
    slug: "reproducible-ml-execution",
    title: "ML 재현 실행: Equality Level에서 Clean Room까지",
    subcategory: "ai-practical-strategy",
    sections: [
      { id: "overview", title: "재현의 네 수준" },
      { id: "equivalence-level", title: "Numeric equality gate" },
      { id: "seed-tree", title: "Hierarchical seed tree" },
      { id: "clean-room", title: "Clean-room test" },
    ],
    component: () => import("@/pages/articles/ai/reproducible-ml-execution"),
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
  {
    slug: "rag-ingestion-and-chunking",
    title: "RAG ingestion: 문서 파싱·chunking·overlap·contextual retrieval",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "Knowledge base와 ingestion pipeline" },
      { id: "parsing", title: "Document parsing (ingestion 관점)" },
      { id: "chunking", title: "Chunk size, chunk overlap, chunk boundary" },
      { id: "semantic-chunking", title: "Semantic chunking" },
      { id: "contextual-retrieval", title: "Contextual retrieval" },
      { id: "pipeline", title: "Ingestion pipeline 전체" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-anthropic", title: "Anthropic Contextual Retrieval" },
          { id: "paper-langchain", title: "LangChain Text Splitters" },
          { id: "paper-llamaindex", title: "LlamaIndex Node Parser Modules" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/rag-ingestion-and-chunking"),
  },
  {
    slug: "query-transformation-and-adaptive-retrieval",
    title: "Query 변환과 적응형 검색: rewriting·HyDE·Self-RAG·CRAG",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "Query rewriting과 query expansion" },
      { id: "multi-query", title: "Multi-query retrieval과 query decomposition" },
      { id: "hyde", title: "HyDE: 가상 문서 embedding" },
      { id: "step-back", title: "Step-back prompting" },
      { id: "adaptive-loop", title: "Adaptive retrieval trigger와 iterative loop" },
      { id: "self-rag-crag", title: "Self-RAG reflection tokens와 CRAG" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-hyde", title: "HyDE" },
          { id: "paper-selfrag", title: "Self-RAG" },
          { id: "paper-crag", title: "CRAG" },
          { id: "paper-stepback", title: "Step-Back Prompting" },
          { id: "paper-least-to-most", title: "Least-to-Most Prompting" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/query-transformation-and-adaptive-retrieval"),
  },
  {
    slug: "vector-search-and-ann-indexes",
    title: "Vector search: exact NN 에서 IVF·PQ 까지",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "problem", title: "정확도와 비교 횟수의 맞바꿈" },
      { id: "dense-retrieval-embedding-space", title: "Embedding model 과 embedding space" },
      { id: "exact-vs-approximate-nn", title: "Exact NN 과 ANN" },
      {
        id: "vector-database-and-index",
        title: "Vector database 와 vector index",
        subsections: [
          { id: "ivf", title: "IVF: cluster 안에서만 비교" },
          { id: "pq", title: "PQ: subvector 를 code 로 압축" },
        ],
      },
      { id: "embedding-normalization-and-metric", title: "L2 normalize 와 dot product 검색" },
      {
        id: "evidence",
        title: "FAISS 공식 문서와 PQ 논문",
        subsections: [
          { id: "paper-pq", title: "Product quantization 원 논문" },
          { id: "source-faiss-indexes", title: "FAISS index 공식 문서" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vector-search-and-ann-indexes"),
  },
  {
    slug: "lexical-retrieval-bm25-inverted-index",
    title: "Lexical retrieval: TF-IDF·BM25·inverted index",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "problem", title: "Term 일치로 후보를 빠르게 찾는 lexical retrieval" },
      { id: "bag-of-words-tf-idf", title: "Bag of words 와 TF-IDF" },
      { id: "bm25-saturation-and-length-norm", title: "BM25 의 saturation 과 길이 정규화" },
      { id: "inverted-index-posting-list", title: "Inverted index 와 posting list" },
      { id: "lexical-vs-semantic-matching", title: "Lexical matching 과 semantic retrieval 의 경계" },
      {
        id: "evidence",
        title: "Robertson·Zaragoza survey 와 Lucene 공식 문서",
        subsections: [
          { id: "paper-bm25", title: "BM25 survey 논문" },
          { id: "source-lucene-bm25", title: "Lucene BM25Similarity 공식 문서" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/lexical-retrieval-bm25-inverted-index"),
  },
  {
    slug: "knowledge-graph-construction",
    title: "Knowledge Graph 구축: Property Graph · Schema · Extraction · Dedup",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "Chunk 검색의 한계와 knowledge graph 의 답" },
      {
        id: "extraction",
        title: "Entity extraction 이 찾는 mention 후보",
        subsections: [
          { id: "relation-extraction-task", title: "Relation extraction 과 triple" },
          { id: "schema-guided-extraction", title: "Schema-guided extraction 과 Open IE" },
        ],
      },
      {
        id: "property-graph",
        title: "Property graph: node·edge·property·edge type",
        subsections: [{ id: "rdf-ontology", title: "RDF triple 과 ontology 의 표현력 차이" }],
      },
      { id: "dedup", title: "Cosine 유사도 threshold 로 하는 entity dedup" },
      { id: "pipeline", title: "Graph construction pipeline 다섯 단계" },
      {
        id: "evidence",
        title: "Neo4j 문서·Open IE 논문·EDC 논문",
        subsections: [
          { id: "source-neo4j-property-graph", title: "Neo4j property graph 정의" },
          { id: "paper-openie-banko2007", title: "Open IE(TextRunner) 논문" },
          { id: "paper-edc-schema-canonicalization", title: "EDC schema·canonicalization 논문" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/knowledge-graph-construction"),
  },
  {
    slug: "graphrag-community-and-multihop-search",
    title: "GraphRAG: Community Summary · Local/Global Search · Multi-Hop",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "단일 hop 탐색으로 못 푸는 질문" },
      { id: "community", title: "Community detection 과 LLM 요약" },
      {
        id: "search",
        title: "Local search 와 global search 의 비용 차이",
        subsections: [{ id: "graph-traversal", title: "Graph traversal: hop 으로 제한하는 걷기" }],
      },
      { id: "hybrid", title: "Graph-vector hybrid retrieval" },
      { id: "multihop", title: "Multi-hop reasoning 과 vector 검색의 한계" },
      {
        id: "evidence",
        title: "Microsoft GraphRAG 논문",
        subsections: [{ id: "paper-graphrag", title: "GraphRAG 논문(arXiv 2404.16130)" }],
      },
    ],
    component: () => import("@/pages/articles/ai/graphrag-community-and-multihop-search"),
  },
  {
    slug: "embedding-model-fine-tuning",
    title: "Embedding fine-tuning: InfoNCE·asymmetric retrieval·truncation",
    subcategory: "ai-practical-embedding",
    sections: [
      { id: "problem", title: "배치 안 다른 쌍을 negative로 재사용하는 fine-tuning" },
      { id: "objective", title: "In-batch negative와 InfoNCE fine-tuning objective" },
      {
        id: "domain-adaptation",
        title: "도메인 쌍으로 이어 학습하는 domain-specific adaptation",
        subsections: [{ id: "over-specialization", title: "도메인에 맞춘 만큼 생기는 over-specialization" }],
      },
      {
        id: "architecture",
        title: "Asymmetric·symmetric encoder 선택",
        subsections: [{ id: "instruction-tuned", title: "Instruction 접두어로 역할을 나누는 embedding" }],
      },
      {
        id: "compression",
        title: "Matryoshka truncation과 int8 quantization",
        subsections: [{ id: "quantization", title: "Float32→int8 embedding quantization" }],
      },
      {
        id: "evidence",
        title: "SBERT·DPR·Matryoshka·E5·quantization 근거",
        subsections: [
          { id: "paper-sbert", title: "Sentence-BERT 논문" },
          { id: "paper-dpr", title: "DPR 논문" },
          { id: "paper-symmetric-search", title: "Symmetric·asymmetric semantic search 문서" },
          { id: "paper-matryoshka", title: "Matryoshka Representation Learning 논문" },
          { id: "paper-e5", title: "E5 논문" },
          { id: "paper-quantization", title: "Embedding quantization 공식 블로그" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/embedding-model-fine-tuning"),
  },
  {
    slug: "document-parsing-and-table-extraction",
    title: "문서 구조 파싱: layout·reading order·OCR·표 추출과 linearization",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "구조가 있는 문서는 왜 pure text만으로 부족한가" },
      { id: "layout-and-order", title: "Layout parsing, reading order, PDF/HTML parsing, DOM tree" },
      { id: "ocr", title: "OCR과 layout-aware OCR" },
      { id: "table-structure", title: "Table extraction, structure recognition, rowspan/colspan, multi-level header" },
      { id: "table-normalization", title: "Table normalization과 linearization" },
      { id: "metadata-and-chunking", title: "Table metadata, document provenance, structure-preserving chunking" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-unstructured-partition", title: "Unstructured Partitioning" },
          { id: "paper-pdfplumber", title: "pdfplumber" },
          { id: "paper-pymupdf", title: "PyMuPDF" },
          { id: "paper-pubtables1m", title: "PubTables-1M" },
          { id: "paper-tableformer", title: "TableFormer" },
          { id: "paper-unstructured-chunking", title: "Unstructured Chunking" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/document-parsing-and-table-extraction"),
  },
  {
    slug: "rag-context-assembly-and-evaluation",
    title: "RAG context 조립과 평가: packing·groundedness·error attribution",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "problem", title: "Context 조립과 지표 분리가 잡는 두 병목" },
      { id: "context-assembly", title: "Evidence selection, context packing, context ordering" },
      { id: "metrics", title: "Groundedness, answer relevance, context precision, context recall" },
      { id: "failure-taxonomy", title: "Retrieval failure, ranking failure, generation failure" },
      { id: "ablation-oracle", title: "Retrieval ablation, oracle retrieval, retriever upper bound" },
      { id: "pipeline", title: "Hallucination evaluation과 end-to-end 평가 파이프라인" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-ragas", title: "RAGAS" },
          { id: "paper-ragas-precision", title: "RAGAS Context Precision" },
          { id: "paper-ragas-recall", title: "RAGAS Context Recall" },
          { id: "paper-rag-original", title: "RAG (Lewis et al.)" },
          { id: "paper-crux", title: "CRUX" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/rag-context-assembly-and-evaluation"),
  },
  {
    slug: "fine-tuning-tradeoffs-forgetting-and-merging",
    title: "Fine-tuning은 목적별 데이터 분포에 따라 forgetting 위험이 갈린다",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "goal-taxonomy", title: "다섯 가지 fine-tuning 목적 축" },
      { id: "data-tradeoff", title: "데이터 분포와 size–quality tradeoff" },
      { id: "forgetting", title: "Catastrophic forgetting과 capability regression" },
      { id: "mitigation", title: "Forgetting evaluation·replay·regularization" },
      { id: "merging", title: "Model merging·weight interpolation·task arithmetic" },
      { id: "checkpoint-ablation", title: "Checkpoint selection과 ablation" },
    ],
    component: () => import("@/pages/articles/ai/fine-tuning-tradeoffs-forgetting-and-merging"),
  },
  {
    slug: "continual-learning-foundations",
    title: "모델은 배포 후에도 학습 방식과 갱신 주기에 따라 낡는다",
    subcategory: "ai-practical-llm",
    sections: [
      { id: "learning-modes", title: "Online·offline·incremental·continual 학습 방식" },
      { id: "stability-plasticity", title: "Stability–plasticity dilemma" },
      { id: "strategies", title: "Replay·regularization·parameter isolation" },
      { id: "adaptation", title: "Test-time·online adaptation" },
      { id: "cadence-freshness", title: "Update cadence와 knowledge freshness" },
    ],
    component: () => import("@/pages/articles/ai/continual-learning-foundations"),
  },
];

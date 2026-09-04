import { AGENT_SECURITY_SOURCES } from "./agent-sandbox-security";
import { B300_SWITCHLESS_SOURCE_LINKS } from "./b300-switchless-network";
import { EUREKA_SOURCE_LINKS } from "./sionic-eureka";
import { GLM_B300_SOURCE_LINKS } from "./sionic-glm-b300";
import { KIMI_K3_SOURCE } from "./kimi-k3";
import { OFFICIAL_SOURCES } from "./official-sources";

export type ArticleEvidenceKind =
  | "핵심 논문"
  | "선행·비교 논문"
  | "리뷰 논문"
  | "핵심 연구"
  | "Benchmark 논문"
  | "평가 논문"
  | "공식 문서"
  | "공식 구현"
  | "공식 가이드"
  | "공식 OpenAI 문서"
  | "공식 규격"
  | "공식 코드"
  | "공식 연구"
  | "공식 예제"
  | "공식 프로젝트 기록"
  | "구현 이슈"
  | "프로젝트 실측"
  | "공개 강의"
  | "보충 읽기"
  | "후속 분석"
  | "후속 논문"
  | "비판적 읽기";

export interface ArticleEvidenceItem {
  kind: ArticleEvidenceKind;
  label: string;
  href?: string;
  note: string;
}

const source = (
  kind: ArticleEvidenceKind,
  value: { label?: string; source?: string; href: string },
  note: string,
): ArticleEvidenceItem => ({
  kind,
  label: value.label ?? value.source ?? value.href,
  href: value.href,
  note,
});

const CLAW_CODE_SNAPSHOT: ArticleEvidenceItem = {
  kind: "프로젝트 실측",
  label: "Claw Code pinned repository snapshot",
  href: "https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2",
  note: "본문의 crate·상태·protocol 주장은 commit b71afdd…의 독립 공개 재구현 artifact에만 귀속하며 affiliation·clean-room 절차·production readiness를 뜻하지 않음",
};

const CLAW_GUARDRAIL_REFERENCE: ArticleEvidenceItem = {
  kind: "공식 문서",
  label: "OpenAI Agents SDK — Guardrails and human review",
  href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
  note: "입출력·tool guardrail과 side effect 전 human approval의 일반 runtime control 경계이며 Claw 구현 근거는 아님",
};

const clawEvidence = (
  ...items: ArticleEvidenceItem[]
): readonly ArticleEvidenceItem[] => [
  CLAW_CODE_SNAPSHOT,
  CLAW_GUARDRAIL_REFERENCE,
  ...items,
];

const RETH_SERIES_EVIDENCE: readonly ArticleEvidenceItem[] = [
  source(
    "공식 코드",
    OFFICIAL_SOURCES.reth.repository,
    "Reth node·network·pipeline·storage 구현의 현재 원본",
  ),
  source(
    "공식 문서",
    OFFICIAL_SOURCES.reth.layout,
    "crate와 workspace 책임을 확인하는 공식 안내",
  ),
];

const PRYSM_SERIES_EVIDENCE: readonly ArticleEvidenceItem[] = [
  source(
    "공식 코드",
    OFFICIAL_SOURCES.prysm.repository,
    "Prysm beacon node와 validator client 구현의 현재 원본",
  ),
  source(
    "공식 규격",
    OFFICIAL_SOURCES.ethereum.consensusSpecs,
    "state transition·fork choice·validator duty의 프로토콜 기준",
  ),
];

const FILECOIN_PROOFS_SERIES_EVIDENCE: readonly ArticleEvidenceItem[] = [
  {
    kind: "공식 코드",
    label: "filecoin-project/rust-fil-proofs",
    href: "https://github.com/filecoin-project/rust-fil-proofs",
    note: "PoRep·PoSt·SNARK proving 경로의 공식 Rust 구현",
  },
  {
    kind: "공식 규격",
    label: "Filecoin Specification",
    href: "https://spec.filecoin.io/",
    note: "저장 증명과 체인 검증이 따라야 하는 프로토콜 기준",
  },
];

const withSeriesEvidence = (
  series: readonly ArticleEvidenceItem[],
  ...items: ArticleEvidenceItem[]
): readonly ArticleEvidenceItem[] => [...series, ...items];

/**
 * 글의 첫 화면에서 보여 줄 핵심 근거만 둡니다.
 * 세부 문장 인용은 각 섹션 가까이에 남기되, 원문을 찾기 위한 대표 링크를
 * 본문과 Viz에 다시 복제하지 않습니다.
 */
export const ARTICLE_EVIDENCE: Readonly<
  Record<string, readonly ArticleEvidenceItem[]>
> = {
  "ai/llm-training-stages": [
    {
      kind: "핵심 논문",
      label: "Scaling Laws for Neural Language Models",
      href: "https://arxiv.org/abs/2001.08361",
      note: "Autoregressive language-model pretraining loss와 model·data·compute scaling 관계의 기준 연구",
    },
    {
      kind: "핵심 논문",
      label: "Training language models to follow instructions with human feedback",
      href: "https://arxiv.org/abs/2203.02155",
      note: "SFT와 preference-model·RL을 결합한 instruction post-training pipeline의 대표 연구",
    },
    {
      kind: "핵심 논문",
      label: "On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes",
      href: "https://arxiv.org/abs/2306.13649",
      note: "Student가 실제 생성한 prefix에서 teacher token feedback을 받는 on-policy distillation 근거",
    },
    {
      kind: "공식 연구",
      label: "Motif 3 Technical Report v1",
      href: "https://arxiv.org/abs/2608.09119",
      note: "Architecture·pretraining·multi-teacher post-training을 공동 설계한 최신 model-system 사례",
    },
  ],
  "ai/motif-3-architecture": [
    {
      kind: "공식 연구",
      label: "Motif 3 Technical Report v1",
      href: "https://arxiv.org/abs/2608.09119",
      note: "314B total·13.2B active configuration, GDLA·modified mHC·PolyNorm·MOPD와 controlled ablation의 정본",
    },
    {
      kind: "공식 문서",
      label: "Motif-Technologies/Motif-3",
      href: "https://huggingface.co/Motif-Technologies/Motif-3",
      note: "MIT license, instruction checkpoint와 built-in one-layer MTP head의 현재 공개 정보",
    },
    {
      kind: "공식 구현",
      label: "Motif 3 Training Example",
      href: "https://github.com/MotifTechnologies/motif3-training-example",
      note: "B200 train-only reference와 multi-node launch configuration을 공개한 공식 training example",
    },
    {
      kind: "핵심 논문",
      label: "Grouped Differential Attention",
      href: "https://arxiv.org/abs/2510.06949",
      note: "Signal/noise head grouping과 token-dependent differential coefficient의 원 설계",
    },
    {
      kind: "핵심 논문",
      label: "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model",
      href: "https://arxiv.org/abs/2405.04434",
      note: "MLA의 low-rank joint KV compression과 MoE architecture 배경",
    },
  ],
  "ai/spiking-neural-networks": [
    {
      kind: "핵심 논문",
      label: "SuperSpike: Supervised Learning in Multilayer Spiking Neural Networks",
      href: "https://arxiv.org/abs/1705.11146",
      note: "Hard spike nonlinearity를 우회하는 surrogate-gradient 계열 학습의 기준 연구",
    },
    {
      kind: "핵심 논문",
      label: "Dendritic cortical microcircuits approximate the backpropagation algorithm",
      href: "https://arxiv.org/abs/1810.11393",
      note: "Standard backprop의 biological implausibility와 approximate credit-assignment circuit을 구분하는 근거",
    },
    {
      kind: "공식 문서",
      label: "Intel Loihi 2 Technology Brief",
      href: "https://www.intel.com/content/www/us/en/research/neuromorphic-computing-loihi-2-technology-brief.html",
      note: "Digital neuromorphic processor가 제공하는 programmable neuron·event-driven execution의 공식 범위",
    },
    {
      kind: "핵심 논문",
      label: "The BrainScaleS-2 Accelerated Neuromorphic System With Hybrid Plasticity",
      href: "https://arxiv.org/abs/2201.11063",
      note: "Mixed-signal accelerated substrate와 on-chip plasticity의 별도 hardware 사례",
    },
  ],
  "gpu/cuda-thread-hierarchy": [
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide — Programming Model",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html",
      note: "Grid·block·thread hierarchy, 32-thread warp·SIMT, optional thread block cluster의 현재 정본",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide — Writing SIMT Kernels",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html",
      note: "Built-in variables, 1D/2D mapping, boundary-safe vector kernel과 memory-access 입구",
    },
  ],
  "gpu/cuda-shared-memory": [
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide — Memory Performance",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#memory-performance",
      note: "32-byte global transaction, 32-bank shared access, broadcast와 transpose staging의 공식 설명",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA C++ Programming Guide — Shared Memory",
      href: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#shared-memory",
      note: "Shared-memory allocation·scope·architecture-specific performance 조건의 reference",
    },
  ],
  "gpu/cuda-sync-streams": [
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide — Asynchronous Execution",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html",
      note: "Stream ordering, default-stream modes, events, pinned transfer와 실제 concurrency 조건",
    },
    {
      kind: "공식 문서",
      label:
        "NVIDIA CUDA Programming Guide — Programming Systems with Multiple GPUs",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html",
      note: "Current device별 allocation·stream·event ownership과 peer access 경계",
    },
    { kind: "공식 문서", label: "NVIDIA CUDA Programming Guide — Advanced Kernel Programming", href: "https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html", note: "__syncwarp()로 warp subset을 명시적으로 동기화하라는 공식 권고" },
    { kind: "공식 문서", label: "NVIDIA CUDA Programming Guide — Asynchronous Barriers", href: "https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-barriers.html", note: "Cuda::barrier의 arrive/wait 분리와 __syncthreads() 대비 권장 범위" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide — Memory Fence Functions", href: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/#memory-fence-functions", note: "__threadfence 계열이 barrier와 달리 도착을 기다리지 않는다는 공식 구분" },
],
  "ai/arima": [
    {
      kind: "핵심 논문",
      label:
        "Distribution of the Estimators for Autoregressive Time Series with a Unit Root",
      href: "https://doi.org/10.1080/01621459.1979.10482531",
      note: "Dickey–Fuller unit-root 검정에서 일반 t 분포를 쓸 수 없는 이유의 원문",
    },
    {
      kind: "핵심 논문",
      label: "On a Measure of Lack of Fit in Time Series Models",
      href: "https://doi.org/10.1093/biomet/65.2.297",
      note: "Residual autocorrelation을 공동 진단하는 Ljung–Box statistic 원문",
    },
    {
      kind: "핵심 논문",
      label: "Automatic Time Series Forecasting: The forecast Package for R",
      href: "https://www.jstatsoft.org/article/view/v027i03",
      note: "차분과 ARIMA 차수를 자동으로 탐색하는 Hyndman–Khandakar 절차",
    },
    {
      kind: "보충 읽기",
      label: "Forecasting: Principles and Practice — ARIMA models",
      href: "https://otexts.com/fpp3/arima.html",
      note: "정상성·차분·ACF/PACF·잔차 진단을 실무 흐름으로 설명하는 공개 교재",
    },
    {
      kind: "공식 문서",
      label: "statsmodels ARIMA",
      href: "https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html",
      note: "Trend·exogenous regressors·stationarity·invertibility 옵션의 현재 구현 계약",
    },
  ],
  "ai/lstm-timeseries": [
    {
      kind: "공식 문서",
      label: "PyTorch LSTM",
      href: "https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html",
      note: "Input·output·hidden/cell state tensor shape와 batch_first·bidirectional·projection의 현재 API 계약",
    },
    {
      kind: "보충 읽기",
      label: "Recurrent Neural Networks for Time Series Forecasting",
      href: "https://doi.org/10.1016/j.ijforecast.2020.06.008",
      note: "RNN 계열 시계열 예측의 설계·평가·실무 과제를 정리한 survey",
    },
    {
      kind: "핵심 논문",
      label: "Another Look at Measures of Forecast Accuracy",
      href: "https://doi.org/10.1016/j.ijforecast.2006.03.001",
      note: "서로 다른 scale의 series를 naive error로 정규화하는 MASE 제안",
    },
    {
      kind: "핵심 논문",
      label: "Out-of-sample Tests of Forecasting Accuracy",
      href: "https://doi.org/10.1016/S0169-2070(00)00065-0",
      note: "Rolling origin·recalibration·multiple test period를 포함한 시계열 외부 평가 설계",
    },
    {
      kind: "핵심 논문",
      label: "Are Transformers Effective for Time Series Forecasting?",
      href: "https://arxiv.org/abs/2205.13504",
      note: "DLinear baseline을 통해 장기 예측 평가와 Transformer 비교를 재검토",
    },
    {
      kind: "핵심 논문",
      label:
        "A Time Series is Worth 64 Words: Long-term Forecasting with Transformers",
      href: "https://arxiv.org/abs/2211.14730",
      note: "PatchTST의 patching·channel independence와 장기 예측 실험",
    },
  ],
  "ai/ecod": [
    {
      kind: "핵심 논문",
      label: "ECOD: Unsupervised Outlier Detection Using Empirical CDFs",
      href: "https://arxiv.org/abs/2201.00382",
      note: "Tail probability·skewness correction·score aggregation과 원 논문의 평가",
    },
    {
      kind: "공식 문서",
      label: "PyOD ECOD API",
      href: "https://pyod.readthedocs.io/en/latest/pyod.models.html#module-pyod.models.ecod",
      note: "contamination·n_jobs·decision_scores_·threshold_의 현재 API 계약",
    },
    {
      kind: "공식 코드",
      label: "PyOD ECOD source",
      href: "https://pyod.readthedocs.io/en/latest/_modules/pyod/models/ecod.html",
      note: "ECDF·skewness score·새 입력 처리의 실제 구현 경로",
    },
    {
      kind: "공식 코드",
      label: "PyOD BaseDetector source",
      href: "https://pyod.readthedocs.io/en/latest/_modules/pyod/models/base.html",
      note: "contamination quantile·strict threshold 비교·predict interface의 현재 구현",
    },
    {
      kind: "평가 논문",
      label: "On the Evaluation of Unsupervised Outlier Detection",
      href: "https://doi.org/10.1007/s10618-015-0444-8",
      note: "Outlier benchmark 구성과 unsupervised detector 평가의 함정",
    },
    {
      kind: "평가 논문",
      label: "The Precision-Recall Plot Is More Informative than the ROC Plot",
      href: "https://doi.org/10.1371/journal.pone.0118432",
      note: "Rare positive class에서 ROC와 PR이 보여 주는 질문의 차이",
    },
  ],
  "ai/generative-theory": [],
  "ai/autoregressive-generative-models": [],
  "ai/latent-variable-generative-models": [
    {
      "kind": "핵심 논문",
      "label": "Auto-Encoding Variational Bayes",
      "href": "https://arxiv.org/abs/1312.6114",
      "note": "Variational inference와 reparameterization을 이용한 VAE의 출발점"
    }
  ],
  "ai/normalizing-flows": [
    {
      "kind": "핵심 논문",
      "label": "Density Estimation using Real NVP",
      "href": "https://arxiv.org/abs/1605.08803",
      "note": "가역 coupling transform으로 exact likelihood와 sampling을 구성"
    }
  ],
  "ai/adversarial-density-ratios": [
    {
      "kind": "핵심 논문",
      "label": "Generative Adversarial Nets",
      "href": "https://arxiv.org/abs/1406.2661",
      "note": "Generator와 discriminator의 minimax objective 및 optimal ratio 분석"
    }
  ],
  "ai/score-based-generative-models": [
    {
      "kind": "핵심 논문",
      "label": "Generative Modeling by Estimating Gradients of the Data Distribution",
      "href": "https://arxiv.org/abs/1907.05600",
      "note": "여러 noise level의 score estimation과 annealed Langevin sampling"
    },
    {
      "kind": "핵심 논문",
      "label": "Denoising Diffusion Probabilistic Models",
      "href": "https://arxiv.org/abs/2006.11239",
      "note": "Denoising objective와 iterative reverse process의 기준 논문"
    }
  ],
  "ai/transformer-architecture": [
    {
      kind: "핵심 논문",
      label: "Attention Is All You Need",
      href: "https://arxiv.org/abs/1706.03762",
      note: "원 논문의 encoder·decoder와 scaled dot-product attention",
    },
    {
      kind: "핵심 논문",
      label: "Scaling Laws for Neural Language Models",
      href: "https://arxiv.org/abs/2001.08361",
      note: "parameter·data·compute와 language-model loss의 power-law 관계",
    },
    {
      kind: "핵심 논문",
      label: "Training Compute-Optimal Large Language Models",
      href: "https://arxiv.org/abs/2203.15556",
      note: "고정 compute에서 model size와 training token 배분을 재검토한 Chinchilla 연구",
    },
    {
      kind: "핵심 논문",
      label: "On Layer Normalization in the Transformer Architecture",
      href: "https://arxiv.org/abs/2002.04745",
      note: "Post-LN과 Pre-LN의 initialization gradient·warmup 차이를 분석한 연구",
    },
    {
      kind: "핵심 논문",
      label: "GLU Variants Improve Transformer",
      href: "https://arxiv.org/abs/2002.05202",
      note: "Transformer FFN에서 gated activation 변형을 비교한 연구",
    },
    {
      kind: "후속 분석",
      label:
        "Attention is Not All You Need: Pure Attention Loses Rank Doubly Exponentially with Depth",
      href: "https://arxiv.org/abs/2103.03404",
      note: "Pure self-attention의 token uniformity와 skip connection·MLP 역할을 분석한 연구",
    },
    { kind: "핵심 논문", label: "Root Mean Square Layer Normalization", href: "https://arxiv.org/abs/1910.07467", note: "평균을 빼지 않고 제곱평균만으로 재정규화하는 RMSNorm을 제안하고 실행 시간 절감을 보고한 연구" },
],
  "ai/bert": [
    { kind: "핵심 논문", label: "BERT: Pre-training of Deep Bidirectional Transformers", href: "https://arxiv.org/abs/1810.04805", note: "양방향 encoder visibility와 BERT pretraining의 원문" },
  ],
  "ai/bert-input-packing": [
    { kind: "공식 문서", label: "Hugging Face Transformers — BERT inputs", href: "https://huggingface.co/docs/transformers/model_doc/bert", note: "input_ids·attention_mask·token_type_ids·position_ids의 현재 API 계약" },
  ],
  "ai/bert-mlm-corruption": [
    { kind: "핵심 논문", label: "BERT masked language modeling", href: "https://arxiv.org/abs/1810.04805", note: "15% selection과 selected 위치의 80·10·10 corruption 근거" },
  ],
  "ai/bert-pretraining-objectives": [
    { kind: "핵심 논문", label: "RoBERTa", href: "https://arxiv.org/abs/1907.11692", note: "BERT recipe와 NSP 제거를 함께 재검토" },
    { kind: "핵심 논문", label: "ALBERT", href: "https://arxiv.org/abs/1909.11942", note: "Sentence-order prediction과 parameter-efficient architecture" },
    { kind: "핵심 논문", label: "ELECTRA", href: "https://arxiv.org/abs/2003.10555", note: "Replaced-token detection의 generator·discriminator 설계" },
  ],
  "ai/bert-task-heads": [
    { kind: "핵심 논문", label: "Sentence-BERT", href: "https://arxiv.org/abs/1908.10084", note: "Cross-encoder 비용을 independent sentence embedding과 retrieval로 전환" },
  ],
 "ai/resnet": [
    {
      kind: "핵심 논문",
      label: "Deep Residual Learning for Image Recognition",
      href: "https://arxiv.org/abs/1512.03385",
      note: "residual block과 degradation 실험의 원문",
    },
    {
      kind: "핵심 논문",
      label: "Identity Mappings in Deep Residual Networks",
      href: "https://arxiv.org/abs/1603.05027",
      note: "identity propagation 전개와 pre-activation residual unit의 근거",
    },
    {
      kind: "후속 분석",
      label:
        "Residual Networks Behave Like Ensembles of Relatively Shallow Networks",
      href: "https://arxiv.org/abs/1605.06431",
      note: "residual network를 서로 다른 길이의 computational path로 분석한 후속 관점",
    },
    {
      kind: "후속 분석",
      label: "Visualizing the Loss Landscape of Neural Nets",
      href: "https://arxiv.org/abs/1712.09913",
      note: "skip connection이 deep network의 loss landscape에 미치는 차이를 시각화한 연구",
    },
    {
      kind: "공식 구현",
      label: "Torchvision ResNet source",
      href: "https://docs.pytorch.org/vision/stable/_modules/torchvision/models/resnet.html",
      note: "현재 BasicBlock·Bottleneck·stride 위치·zero-init residual 구현 계약",
    },
  ],
  "ai/cnn": [
    { kind: "핵심 논문", label: "Gradient-Based Learning Applied to Document Recognition", href: "https://doi.org/10.1109/5.726791", note: "LeNet convolution·subsampling·classifier를 document recognition에 연결한 근거" },
  ],
  "ai/cnn-translation-equivariance": [
    { kind: "핵심 논문", label: "Making Convolutional Networks Shift-Invariant Again", href: "https://arxiv.org/abs/1904.11486", note: "Downsampling aliasing과 작은 input shift stability를 분석한 근거" },
  ],
  "ai/cnn-receptive-fields": [
    { kind: "핵심 논문", label: "Understanding the Effective Receptive Field", href: "https://arxiv.org/abs/1701.04128", note: "Theoretical connectivity와 measured influence distribution의 차이" },
    { kind: "핵심 논문", label: "Multi-Scale Context Aggregation by Dilated Convolutions", href: "https://arxiv.org/abs/1511.07122", note: "Resolution을 즉시 낮추지 않는 dilated context aggregation" },
  ],
  "ai/depthwise-separable-convolution": [
    { kind: "핵심 논문", label: "MobileNets", href: "https://arxiv.org/abs/1704.04861", note: "Depthwise separable convolution의 accuracy–resource trade-off" },
  ],
  "ai/vision-task-spatial-contracts": [
    { kind: "핵심 논문", label: "Fully Convolutional Networks", href: "https://arxiv.org/abs/1411.4038", note: "Image-level network를 dense spatial output과 skip architecture로 전환" },
  ],
  "ai/vla-embodiment-gap": [
    { kind: "리뷰 논문", label: "The Embodiment Gap in Robot Foundation Models (TMLR, arXiv v1 2026-08-19)", href: "https://arxiv.org/abs/2608.18433", note: "Foundation representation과 target embodiment adaptation 사이의 최신 survey taxonomy이며 2026-09-19에 arXiv revision을 다시 확인하고 합의된 표준으로 취급하지 않음" },
    { kind: "핵심 논문", label: "RT-2 · Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", href: "https://arxiv.org/abs/2307.15818", note: "Web-scale VLM과 robot trajectory를 action token interface로 공동 학습한 monolithic VLA 사례이며 임의 embodiment의 zero-shot control 보장은 아님" },
    { kind: "핵심 논문", label: "ACT · Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", href: "https://arxiv.org/abs/2304.13705", note: "Action chunking과 temporal ensemble의 robot manipulation 근거이며 같은 chunk horizon의 보편 최적성을 뜻하지 않음" },
    { kind: "핵심 논문", label: "Diffusion Policy · Visuomotor Policy Learning via Action Diffusion", href: "https://arxiv.org/abs/2303.04137", note: "Multimodal continuous action trajectory를 diffusion으로 생성한 근거이며 iterative inference 비용과 target control rate를 별도 평가해야 함" },
    { kind: "핵심 논문", label: "Open X-Embodiment · Robotic Learning Datasets and RT-X Models", href: "https://arxiv.org/abs/2310.08864", note: "22 robot·527 skill·160,266 task data mixture와 cross-embodiment 실험의 저자 보고이며 target robot adaptation 소멸을 뜻하지 않음" },
    { kind: "핵심 논문", label: "OpenVLA · An Open-Source Vision-Language-Action Model", href: "https://arxiv.org/abs/2406.09246", note: "7B model·970k real-world demonstrations와 adaptation 결과의 저자 보고이며 모든 action space에 plug-and-play라는 뜻은 아님" },
    { kind: "핵심 논문", label: "Octo · An Open-Source Generalist Robot Policy", href: "https://arxiv.org/abs/2405.12213", note: "800k trajectory pretraining과 새 observation·action space adaptation 사례이며 universal low-level controller 주장이 아님" },
    { kind: "핵심 논문", label: "π0 · A Vision-Language-Action Flow Model for General Robot Control", href: "https://arxiv.org/abs/2410.24164", note: "VLM 위 flow-matching action model을 결합한 continuous action 사례이며 direct/token head에 대한 보편 우위를 뜻하지 않음" },
    { kind: "핵심 논문", label: "OK-Robot · Integrating Open-Knowledge Models for Robotics", href: "https://arxiv.org/abs/2401.12202", note: "VLM·navigation·grasp primitive를 조합한 modular system과 component error composition의 실제 평가" },
    { kind: "후속 논문", label: "Qwen-RobotNav · Agentic Navigation with a Parameterized Interface", href: "https://arxiv.org/abs/2606.18112", note: "Parameterized task/observation interface와 outer planner를 둔 navigation system의 자기보고이며 Qwen-VLA와 별도 artifact·paper로 취급" },
    { kind: "후속 논문", label: "Goal2Pixel · From Language Goals to Pixel-Level Action", href: "https://arxiv.org/abs/2606.01621", note: "2D pixel grounding을 depth·geometry로 3D waypoint에 연결한 navigation 자기보고 결과이며 manipulation transfer 근거는 아님" },
    { kind: "후속 논문", label: "Embodied-Navigator · TAMP-Nav (2026-08-18 preprint)", href: "https://arxiv.org/abs/2608.17512", note: "Pixel pointing·selective reasoning·anchor memory·two-level alignment의 최신 자기보고이며 블로그 편집부가 2026-09-18에 공개 revision을 다시 확인" },
    { kind: "후속 논문", label: "3D Diffuser Actor · Policy Diffusion with 3D Scene Representations", href: "https://arxiv.org/abs/2402.10885", note: "Point-cloud 기반 3D scene representation과 diffusion policy를 결합한 대조 계열로 pixel-to-3D lifting이 유일한 interface가 아님을 보여 줌" },
    { kind: "평가 논문", label: "RADAR · Robustness Assessment of Vision-Language-Action Models", href: "https://arxiv.org/abs/2602.10980", note: "Dynamics·observation perturbation에서 nominal success와 robustness를 분리한 독립 평가" },
    { kind: "평가 논문", label: "SO-101 real-robot VLA failure and recovery benchmark", href: "https://arxiv.org/abs/2606.08881", note: "실제 저비용 robot의 failure taxonomy와 recovery를 final success와 분리한 독립 평가" },
    { kind: "핵심 논문", label: "A Survey of Embodied AI: From Simulators to Research Tasks", href: "https://arxiv.org/abs/2103.04918", note: "인터넷 dataset이 아니라 자기 몸으로 환경과 상호작용하며 배우는 embodied AI 정의의 출처이며 이후 VLA 계열의 성능을 규정하지 않음" },
    { kind: "핵심 논문", label: "LAION-5B", href: "https://arxiv.org/abs/2210.08402", note: "58억 5천만 image-text pair 규모의 공식 artifact이며 robot demonstration data 규모(수십만 trajectory)와의 자릿수 차이를 보여 주는 대표 수치, VLM/RT-2 학습에 직접 쓰였다는 근거는 아님" },
],
  "ai/word2vec": [
    {
      kind: "핵심 논문",
      label: "Efficient Estimation of Word Representations in Vector Space",
      href: "https://arxiv.org/abs/1301.3781",
      note: "Vocabulary row lookup·local context window·CBOW·Skip-gram 입력 경계를 제시한 원 연구",
    },
  ],
  "ai/word2vec-prediction-objectives": [
    {
      kind: "핵심 논문",
      label: "Efficient Estimation of Word Representations in Vector Space",
      href: "https://arxiv.org/abs/1301.3781#page=3",
      note: "CBOW·Skip-gram prediction direction과 hierarchical softmax 비교",
    },
  ],
  "ai/word2vec-negative-sampling": [
    {
      kind: "핵심 논문",
      label: "Distributed Representations of Words and Phrases",
      href: "https://arxiv.org/abs/1310.4546",
      note: "Negative sampling·unigram 3/4 noise·frequent-word subsampling을 확장한 후속 연구",
    },
    {
      kind: "보충 읽기",
      label: "Neural Word Embedding as Implicit Matrix Factorization",
      href: "https://proceedings.neurips.cc/paper_files/paper/2014/hash/b78666971ceae55a8e87efb7cbfd9ad4-Abstract.html",
      note: "SGNS의 dot product를 shifted-PMI word–context matrix factorization으로 분석",
    },
  ],
  "ai/subword-static-embeddings": [
    {
      kind: "핵심 논문",
      label: "Enriching Word Vectors with Subword Information",
      href: "https://aclanthology.org/Q17-1010/",
      note: "Character n-gram 합으로 morphology와 OOV 한계를 보강한 fastText 연구",
    },
  ],
  "ai/distributional-semantics": [
    {
      kind: "핵심 논문",
      label: "Distributional Structure",
      href: "https://doi.org/10.1080/00437956.1954.11659520",
      note: "언어 요소의 분포 구조를 체계화한 Harris의 1954년 논문",
    },
    {
      kind: "핵심 논문",
      label: "Indexing by Latent Semantic Analysis",
      href: "https://doi.org/10.1002/(SICI)1097-4571(199009)41:6%3C391::AID-ASI1%3E3.0.CO;2-9",
      note: "term–document matrix에 truncated SVD를 적용한 LSA 원문",
    },
    {
      kind: "보충 읽기",
      label: "Neural Word Embedding as Implicit Matrix Factorization",
      href: "https://proceedings.neurips.cc/paper_files/paper/2014/hash/b78666971ceae55a8e87efb7cbfd9ad4-Abstract.html",
      note: "SGNS와 shifted PMI matrix factorization의 연결을 분석",
    },
    {
      kind: "핵심 논문",
      label: "GloVe: Global Vectors for Word Representation",
      href: "https://aclanthology.org/D14-1162/",
      note: "Global nonzero co-occurrence count를 쓰는 weighted log-bilinear regression model",
    },
    {
      kind: "후속 분석",
      label:
        "Improving Distributional Similarity with Lessons Learned from Word Embeddings",
      href: "https://aclanthology.org/Q15-1016/",
      note: "Algorithm 이름보다 context·weighting·hyperparameter 선택이 비교 결과에 미치는 영향을 분석",
    },
    {
      kind: "비판적 읽기",
      label: "What company do words keep? Revisiting Firth & Harris",
      href: "https://aclanthology.org/2022.naacl-main.327/",
      note: "현대 NLP가 인용하는 distributional semantics와 Firth·Harris의 서로 다른 context 개념을 재검토",
    },
  ],
  "ai/rnn": [
    {
      kind: "핵심 논문",
      label: "Finding Structure in Time",
      href: "https://doi.org/10.1207/s15516709cog1402_1",
      note: "simple recurrent network가 시간 구조를 학습하는 방식을 보인 Elman의 논문",
    },
  ],
  "ai/rnn-language-model": [
    {
      kind: "핵심 논문",
      label: "Recurrent Neural Network Based Language Model",
      href: "https://www.fit.vut.cz/research/groups/speech/publi/2010/mikolov_interspeech2010_IS100722.pdf",
      note: "hidden state로 이전 문맥을 요약해 다음 단어를 예측하는 RNN language model의 출발점",
    },
  ],
  "ai/bptt": [
    {
      kind: "핵심 논문",
      label: "Backpropagation Through Time: What It Does and How to Do It",
      href: "https://doi.org/10.1109/5.58337",
      note: "순환 시스템에 backpropagation을 적용하는 BPTT를 정리한 논문",
    },
    {
      kind: "핵심 논문",
      label: "On the Difficulty of Training Recurrent Neural Networks",
      href: "https://arxiv.org/abs/1211.5063",
      note: "recurrent Jacobian 곱에서 생기는 vanishing·exploding gradient와 norm clipping 분석",
    },
    {
      kind: "핵심 연구",
      label: "On Training Recurrent Networks with Truncated BPTT",
      href: "https://arxiv.org/abs/1807.03396",
      note: "truncation horizon과 실제로 학습되는 시간 의존성의 관계",
    },
  ],
  "ai/lstm": [
    {
      kind: "핵심 논문",
      label: "Long Short-Term Memory",
      href: "https://doi.org/10.1162/neco.1997.9.8.1735",
      note: "constant error flow와 gated memory cell을 제안한 LSTM 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "Learning to Forget: Continual Prediction with LSTM",
      href: "https://doi.org/10.1162/089976600300015015",
      note: "연속 입력에서 내부 state를 지울 수 있도록 forget gate를 도입한 논문",
    },
    {
      kind: "보충 읽기",
      label: "LSTM: A Search Space Odyssey",
      href: "https://arxiv.org/abs/1503.04069",
      note: "LSTM component와 forget-gate bias를 대규모 조건에서 비교한 연구",
    },
  ],
  "ai/gru": [
    {
      kind: "핵심 논문",
      label: "Learning Phrase Representations using RNN Encoder–Decoder",
      href: "https://arxiv.org/abs/1406.1078",
      note: "encoder–decoder와 GRU 계열의 reset·update gated hidden unit을 제안",
    },
    {
      kind: "보충 읽기",
      label: "An Empirical Exploration of Recurrent Network Architectures",
      href: "https://research.google/pubs/an-empirical-exploration-of-recurrent-network-architectures/",
      note: "LSTM·GRU를 포함한 recurrent architecture를 여러 task에서 비교한 연구",
    },
  ],
  "ai/seq2seq": [
    {
      kind: "핵심 논문",
      label: "Sequence to Sequence Learning with Neural Networks",
      href: "https://proceedings.neurips.cc/paper_files/paper/2014/hash/a14ac55a4f27472c5d894ec1c3c743d2-Abstract.html",
      note: "LSTM encoder–decoder로 가변 길이 sequence mapping을 보인 원 논문",
    },
    {
      kind: "보충 읽기",
      label:
        "Neural Machine Translation by Jointly Learning to Align and Translate",
      href: "https://arxiv.org/abs/1409.0473",
      note: "고정 context bottleneck을 완화한 additive attention 원 논문",
    },
    {
      kind: "보충 읽기",
      label:
        "Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks",
      href: "https://proceedings.neurips.cc/paper/2015/hash/e995f98d56967d946471af29d7bf99f1-Abstract.html",
      note: "Teacher forcing과 inference prefix의 차이를 curriculum sampling으로 다룬 원 논문",
    },
    {
      kind: "보충 읽기",
      label: "Exposure Bias versus Self-Recovery",
      href: "https://aclanthology.org/2021.emnlp-main.415/",
      note: "오류가 항상 누적된다는 exposure-bias 통념의 적용 범위를 실험적으로 재검토",
    },
  ],
  "ai/attention-theory": [
    {
      kind: "핵심 논문",
      label:
        "Neural Machine Translation by Jointly Learning to Align and Translate",
      href: "https://arxiv.org/abs/1409.0473",
      note: "Bahdanau attention과 alignment의 출발점",
    },
    {
      kind: "핵심 논문",
      label:
        "Effective Approaches to Attention-based Neural Machine Translation",
      href: "https://arxiv.org/abs/1508.04025",
      note: "global·local attention과 dot·general·concat score 함수를 비교",
    },
    {
      kind: "핵심 논문",
      label: "Attention Is All You Need",
      href: "https://arxiv.org/abs/1706.03762",
      note: "self-attention으로 확장된 기준 구조",
    },
  ],
  "ai/tokenizer": [
    {
      kind: "공식 규격",
      label: "Unicode Standard Annex #15 — Normalization Forms",
      href: "https://www.unicode.org/reports/tr15/",
      note: "NFC·NFD의 canonical equivalence와 NFKC·NFKD compatibility normalization의 의미·손실 경계",
    },
    {
      kind: "공식 문서",
      label: "Hugging Face Tokenizers — Pipeline",
      href: "https://huggingface.co/docs/tokenizers/python/latest/pipeline.html",
      note: "Normalization·pre-tokenization·model·post-processing을 분리하는 현재 pipeline 계약",
    },
    {
      kind: "핵심 논문",
      label: "Neural Machine Translation of Rare Words with Subword Units",
      href: "https://arxiv.org/abs/1508.07909",
      note: "BPE를 neural machine translation의 subword segmentation에 적용",
    },
    {
      kind: "핵심 논문",
      label: "Fast WordPiece Tokenization",
      href: "https://aclanthology.org/2021.emnlp-main.160/",
      note: "Longest-match-first WordPiece encoding을 trie와 failure link로 선형 시간에 구현",
    },
    {
      kind: "핵심 논문",
      label:
        "SentencePiece: A simple and language independent subword tokenizer and detokenizer",
      href: "https://aclanthology.org/D18-2012/",
      note: "raw sentence에서 학습하는 SentencePiece toolkit을 설명",
    },
    {
      kind: "핵심 논문",
      label:
        "Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates",
      href: "https://aclanthology.org/P18-1007/",
      note: "Unigram language model과 subword sampling을 제안",
    },
    {
      kind: "공식 코드",
      label: "Google SentencePiece",
      href: "https://github.com/google/sentencepiece",
      note: "Raw sentence training·BPE/Unigram·NFKC normalization·byte fallback의 실제 구현",
    },
    {
      kind: "공식 코드",
      label: "OpenAI tiktoken",
      href: "https://github.com/openai/tiktoken",
      note: "Reversible byte-level BPE와 encoding별 vocabulary·special-token 계약의 실제 구현",
    },
    {
      kind: "보충 읽기",
      label:
        "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      href: "https://arxiv.org/abs/1810.04805",
      note: "WordPiece vocabulary를 사용한 대표적인 encoder model",
    },
    { kind: "핵심 논문", label: "Language Models are Unsupervised Multitask Learners (GPT-2)", href: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf", note: "UTF-8 byte 256개를 unicode로 매핑해 BPE를 적용하는 byte-level BPE encoder" },
    { kind: "공식 코드", label: "openai/gpt-2 — src/encoder.py", href: "https://github.com/openai/gpt-2/blob/master/src/encoder.py", note: "bytes_to_unicode()의 256-byte lookup table 구현" },
],
  "ai/math-matrices-svd": [
    {
      kind: "공개 강의",
      label: "MIT 18.06 — Singular Value Decomposition",
      href: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/singular-value-decomposition/",
      note: "A=UΣVᵀ 분해와 orthonormal singular directions를 선형대수 흐름에서 확장",
    },
    {
      kind: "공개 강의",
      label: "MIT 18.065 Lecture 7 — Eckart–Young",
      href: "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/",
      note: "Truncated SVD가 같은 rank budget에서 주는 최적 reconstruction과 PCA 연결",
    },
  ],
  "ai/math-vectors-inner-products": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.06 Linear Algebra",
      href: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/",
      note: "Vector·inner product·orthogonality·projection을 학부 선형대수 흐름에서 확장하는 공개 강의",
    },
  ],
  "ai/math-functions-composition": [
    {
      kind: "보충 읽기",
      label: "OpenStax Precalculus 2e — Composition of Functions",
      href: "https://openstax.org/books/precalculus-2e/pages/1-4-composition-of-functions",
      note: "Function input·output, composition order와 domain restriction을 worked example로 확장",
    },
    {
      kind: "보충 읽기",
      label: "Deep Learning Book — Deep Feedforward Networks",
      href: "https://www.deeplearningbook.org/contents/mlp.html",
      note: "Feedforward network를 parameterized function composition으로 연결",
    },
  ],
  "ai/math-functions-derivatives-gradients": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.01SC — Differentiation",
      href: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/",
      note: "Difference quotient·derivative·chain rule를 단변수 미적분의 문제와 함께 확장하는 공개 강의",
    },
    { kind: "보충 읽기", label: "The Matrix Calculus You Need For Deep Learning", href: "https://arxiv.org/abs/1802.01528", note: "Derivative와 chain rule을 deep-learning calculus convention으로 확장" },
  ],
  "ai/math-gradients-jacobians": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.02SC — Gradient and Directional Derivatives",
      href: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/",
      note: "편미분·gradient·directional derivative를 다변수 함수의 기하학으로 확장",
    },
    { kind: "보충 읽기", label: "The Matrix Calculus You Need For Deep Learning", href: "https://arxiv.org/abs/1802.01528", note: "Gradient·Jacobian·vectorized chain rule의 shape convention을 확장" },
  ],
  "ai/math-probability-expectation-variance": [
    {
      kind: "공개 강의",
      label: "MIT 6.041SC — Probability Models",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/#probability-model",
      note: "Experiment·sample space·outcome·event·probability mass를 하나의 discrete model로 확장",
    },
    {
      kind: "공개 강의",
      label: "MIT 6.041SC — Conditioning and Independence",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/#conditioning",
      note: "Conditioning·multiplication rule·independence를 서로 다른 질문으로 분리",
    },
  ],
  "ai/math-random-variables-expectation": [
    {
      kind: "공개 강의",
      label: "MIT 6.041SC — Discrete Random Variables",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/#random-variables",
      note: "Outcome을 scalar value와 induced distribution으로 보내는 random-variable 관점을 확장",
    },
    {
      kind: "공개 강의",
      label: "MIT 6.041SC — Expectation",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/#expectation",
      note: "Probability-weighted center·linearity와 nonlinear transform 경계를 확장",
    },
  ],
  "ai/math-variance-sampling": [
    {
      kind: "공개 강의",
      label: "MIT 6.041SC — Variance and Laws of Large Numbers",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/#variance-and-lln",
      note: "Population spread·sample estimator·sample-average concentration의 조건을 확장",
    },
    {
      kind: "핵심 논문",
      label: "Robbins–Monro — A Stochastic Approximation Method",
      href: "https://doi.org/10.1214/aoms/1177729586",
      note: "Noise observation으로 expectation-defined target에 접근하는 stochastic approximation의 원형",
    },
  ],
  "ai/math-optimization-objectives": [
    {
      kind: "보충 읽기",
      label: "Convex Optimization — Boyd and Vandenberghe",
      href: "https://web.stanford.edu/~boyd/cvxbook/",
      note: "Decision variable·objective·constraint·feasible set·optimal value를 분리하는 optimization problem 정본",
    },
    {
      kind: "공개 강의",
      label: "MIT 18.065 — Gradient Descent: Downhill to a Minimum",
      href: "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/",
      note: "Quadratic objective의 minimum과 level-set geometry를 작은 예제로 연결하는 공개 강의",
    },
  ],
  "ai/math-optimization-convexity": [
    {
      kind: "공개 강의",
      label: "MIT 18.065 — Gradient Descent: Downhill to a Minimum",
      href: "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/",
      note: "Quadratic objective의 gradient descent와 curvature에 따른 지그재그 경로를 설명하는 공개 강의",
    },
    {
      kind: "보충 읽기",
      label: "Convex Optimization — Boyd and Vandenberghe",
      href: "https://web.stanford.edu/~boyd/cvxbook/",
      note: "Convex set·function·optimality·gradient method의 전제와 보장을 연결하는 공개 교재",
    },
  ],
  "ai/math-gradient-descent-convergence": [
    {
      kind: "공개 강의",
      label: "MIT 18.065 — Gradient Descent: Downhill to a Minimum",
      href: "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-22-gradient-descent-downhill-to-a-minimum/",
      note: "Quadratic gradient descent의 step size·zig-zag·convergence 경계를 설명하는 공개 강의",
    },
    {
      kind: "보충 읽기",
      label: "Convex Optimization — Boyd and Vandenberghe",
      href: "https://web.stanford.edu/~boyd/cvxbook/",
      note: "Convex·smooth objective에서 first-order method의 전제와 convergence bound를 연결하는 공개 교재",
    },
  ],
  "ai/perceptron": [
    {
      kind: "핵심 논문",
      label:
        "The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain",
      href: "https://doi.org/10.1037/h0042519",
      note: "Rosenblatt가 제안한 퍼셉트론 학습 모델의 원문",
    },
    {
      kind: "핵심 논문",
      label: "Approximation by Superpositions of a Sigmoidal Function",
      href: "https://doi.org/10.1007/BF02551274",
      note: "단일 은닉층의 universal approximation 조건",
    },
  ],
  "ai/neural-network": [
    {
      kind: "핵심 논문",
      label: "Learning Representations by Back-propagating Errors",
      href: "https://www.nature.com/articles/323533a0",
      note: "hidden unit의 표현을 error backpropagation으로 학습하는 기준 논문",
    },
    {
      kind: "핵심 논문",
      label: "Approximation by Superpositions of a Sigmoidal Function",
      href: "https://doi.org/10.1007/BF02551274",
      note: "표현 가능성과 실제 학습 가능성을 구분하는 이론적 출발점",
    },
    {
      kind: "보충 읽기",
      label:
        "Understanding the Difficulty of Training Deep Feedforward Neural Networks",
      href: "https://proceedings.mlr.press/v9/glorot10a.html",
      note: "Activation saturation·Jacobian scale·초기화가 깊은 MLP 학습에 미치는 영향을 분석",
    },
    {
      kind: "핵심 논문",
      label: "Gradient-Based Learning Applied to Document Recognition",
      href: "https://doi.org/10.1109/5.726791",
      note: "문서 인식의 end-to-end gradient 학습과 MNIST 계열 실험을 연결한 기준 논문",
    },
    {
      kind: "공식 문서",
      label: "PyTorch CrossEntropyLoss",
      href: "https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html",
      note: "Categorical output에서 raw logits·target·reduction의 실제 tensor contract",
    },
  ],
  "ai/reverse-mode-autodiff": [
    {
      kind: "핵심 연구",
      label: "Automatic Differentiation in Machine Learning: a Survey",
      href: "https://jmlr.org/papers/v18/17-468.html",
      note: "finite difference·symbolic differentiation·forward/reverse-mode autodiff의 계산 차이를 정리한 survey",
    },
  ],
  "ai/softmax": [
    {
      kind: "보충 읽기",
      label: "Deep Learning · Output Units",
      href: "https://www.deeplearningbook.org/contents/mlp.html",
      note: "softmax classifier·categorical likelihood·수치 안정성의 정본 설명",
    },
  ],
  "ai/backprop-optimization": [
    {
      kind: "핵심 논문",
      label: "Learning Representations by Back-propagating Errors",
      href: "https://www.nature.com/articles/323533a0",
      note: "chain rule로 hidden weight의 error contribution을 계산하는 원문",
    },
  ],
  "ai/activation-functions": [
    {
      kind: "핵심 논문",
      label: "Efficient BackProp",
      href: "http://yann.lecun.com/exdb/publis/pdf/lecun-98b.pdf",
      note: "입력 scaling·activation centering·saturation을 함께 다룬 기반 해설",
    },
    {
      kind: "핵심 논문",
      label: "Understanding the Difficulty of Training Deep Feedforward Neural Networks",
      href: "https://proceedings.mlr.press/v9/glorot10a.html",
      note: "Sigmoid·tanh saturation과 initialization scale의 상호작용",
    },
  ],
  "ai/rectifier-activations": [
    {
      kind: "핵심 논문",
      label: "Rectified Linear Units Improve Restricted Boltzmann Machines",
      href: "https://www.cs.toronto.edu/~fritz/absps/reluICML.pdf",
      note: "Rectified unit의 초기 해석과 실험",
    },
    {
      kind: "핵심 논문",
      label: "Delving Deep into Rectifiers",
      href: "https://arxiv.org/abs/1502.01852",
      note: "PReLU와 rectifier-aware initialization을 제안한 원문",
    },
    {
      kind: "핵심 논문",
      label: "Fast and Accurate Deep Network Learning by ELUs",
      href: "https://arxiv.org/abs/1511.07289",
      note: "ELU의 negative saturation과 activation mean shift 설계 근거",
    },
    {
      kind: "핵심 논문",
      label: "Self-Normalizing Neural Networks",
      href: "https://arxiv.org/abs/1706.02515",
      note: "SELU의 fixed point와 자기정규화가 성립하는 조건",
    },
  ],
  "ai/gated-activations": [
    {
      kind: "핵심 논문",
      label: "Gaussian Error Linear Units",
      href: "https://arxiv.org/abs/1606.08415",
      note: "GELU를 입력 크기에 따른 연속 gate로 도입한 원문",
    },
    {
      kind: "핵심 논문",
      label: "Searching for Activation Functions",
      href: "https://arxiv.org/abs/1710.05941",
      note: "Swish 계열의 탐색 과정과 실험 조건",
    },
    {
      kind: "핵심 논문",
      label: "GLU Variants Improve Transformer",
      href: "https://arxiv.org/abs/2002.05202",
      note: "SwiGLU를 scalar activation이 아닌 gated FFN으로 비교하는 기준",
    },
  ],
  "ai/optimizers": [
    {
      kind: "핵심 논문",
      label: "A Stochastic Approximation Method",
      href: "https://doi.org/10.1214/aoms/1177729586",
      note: "Noisy observation과 반복 step을 연결한 stochastic approximation 출발점",
    },
  ],
  "ai/momentum-optimizer": [
    {
      kind: "핵심 논문",
      label: "Some Methods of Speeding Up the Convergence of Iteration Methods",
      href: "https://doi.org/10.1016/0041-5553(64)90137-5",
      note: "이전 iterate를 사용하는 multi-step acceleration의 고전 분석",
    },
  ],
  "ai/adam-optimizer": [
    {
      kind: "핵심 논문",
      label: "Adam: A Method for Stochastic Optimization",
      href: "https://arxiv.org/abs/1412.6980",
      note: "1·2차 raw moment와 bias correction을 결합한 Adam 원문",
    },
    {
      kind: "핵심 논문",
      label: "On the Convergence of Adam and Beyond",
      href: "https://arxiv.org/abs/1904.09237",
      note: "Adaptive history가 만드는 convergence failure example과 경계",
    },
  ],
  "ai/cross-entropy": [
    {
      kind: "핵심 논문",
      label: "A Mathematical Theory of Communication",
      href: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
      note: "entropy와 information measure의 출발점",
    },
  ],
  "ai/fft": [
    {
      kind: "핵심 논문",
      label:
        "An Algorithm for the Machine Calculation of Complex Fourier Series",
      href: "https://research.ibm.com/publications/an-algorithm-for-the-machine-calculation-of-complex-fourier-series",
      note: "Cooley–Tukey 분할과 재사용을 설명한 1965년 논문",
    },
    {
      kind: "공식 연구",
      label: "Robust Speech Recognition via Large-Scale Weak Supervision",
      href: "https://cdn.openai.com/papers/whisper.pdf",
      note: "Whisper의 16kHz·80-channel log-Mel frontend specification",
    },
    {
      kind: "핵심 논문",
      label: "FNet: Mixing Tokens with Fourier Transforms",
      href: "https://arxiv.org/abs/2105.03824",
      note: "Fourier transform을 fixed token mixer로 사용한 encoder 실험",
    },
    {
      kind: "핵심 논문",
      label: "Hyena Hierarchy: Towards Larger Convolutional Language Models",
      href: "https://arxiv.org/abs/2302.10866",
      note: "Implicit long convolution과 gating에서 FFT가 맡는 실행 역할",
    },
  ],
  "ai/deep-learning-overview": [
    {
      kind: "핵심 논문",
      label: "Deep Learning",
      href: "https://www.nature.com/articles/nature14539",
      note: "representation learning과 깊은 architecture의 발전을 정리한 리뷰",
    },
    {
      kind: "핵심 논문",
      label: "Benefits of Depth in Neural Networks",
      href: "https://arxiv.org/abs/1602.04485",
      note: "특정 함수족에서 깊이와 폭 사이의 지수적 표현 격차를 보인 이론 결과",
    },
  ],
  "ai/autoencoder": [
    {
      kind: "핵심 논문",
      label: "Reducing the Dimensionality of Data with Neural Networks",
      href: "https://www.science.org/doi/10.1126/science.1127647",
      note: "깊은 autoencoder로 nonlinear dimensionality reduction을 보인 논문",
    },
  ],
  "ai/linear-autoencoder-pca": [
    {
      kind: "핵심 논문",
      label: "Baldi & Hornik — Neural Networks and Principal Component Analysis",
      href: "https://doi.org/10.1016/0893-6080(89)90014-2",
      note: "Linear auto-associative network의 quadratic error landscape와 principal subspace 정리",
    },
  ],
  "ai/denoising-masked-autoencoders": [
    {
      kind: "핵심 논문",
      label: "Extracting and Composing Robust Features with Denoising Autoencoders",
      href: "https://doi.org/10.1145/1390156.1390294",
      note: "Corrupted input에서 clean target을 복원하는 denoising objective",
    },
    {
      kind: "핵심 논문",
      label: "Masked Autoencoders Are Scalable Vision Learners",
      href: "https://arxiv.org/abs/2111.06377",
      note: "Visible-only encoder와 lightweight decoder를 사용한 vision pretraining",
    },
  ],
  "ai/reconstruction-anomaly-detection": [
    {
      kind: "핵심 논문",
      label: "Anomaly Detection Using Autoencoders with Nonlinear Dimensionality Reduction",
      href: "https://doi.org/10.1145/2689746.2689747",
      note: "Reconstruction error를 anomaly score로 적용한 초기 평가 사례",
    },
  ],
  "ai/eda-workflow": [
    {
      kind: "보충 읽기",
      label: "NIST/SEMATECH — Exploratory Data Analysis",
      href: "https://www.itl.nist.gov/div898/handbook/eda/eda.htm",
      note: "EDA의 목표·가정·그래픽과 정량 기법을 연결한 공개 handbook",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — Common pitfalls and recommended practices",
      href: "https://scikit-learn.org/stable/common_pitfalls.html",
      note: "전처리를 training data에서만 fit하고 pipeline으로 leakage를 막는 기준",
    },
  ],
  "ai/feature-engineering": [
    {
      kind: "핵심 논문",
      label: "Leakage in Data Mining: Formulation, Detection, and Avoidance",
      href: "https://doi.org/10.1145/2382577.2382579",
      note: "prediction 시점에 정당한 정보 경계와 learn–predict separation을 다룬 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "CatBoost: Unbiased Boosting with Categorical Features",
      href: "https://arxiv.org/abs/1706.09516",
      note: "ordered target statistics와 prediction shift를 분석한 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "An Introduction to Variable and Feature Selection",
      href: "https://www.jmlr.org/papers/v3/guyon03a.html",
      note: "feature selection의 목표·ranking·subset·validation을 정리한 JMLR 논문",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — Target Encoder’s Internal Cross Fitting",
      href: "https://scikit-learn.org/stable/auto_examples/preprocessing/plot_target_encoder_cross_val.html",
      note: "training row의 label 누출을 막는 out-of-fold target encoding 예제",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — Permutation Importance with Correlated Features",
      href: "https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance_multicollinear.html",
      note: "상관된 피처에서 개별 permutation importance가 낮게 보이는 사례",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — Common pitfalls and recommended practices",
      href: "https://scikit-learn.org/stable/common_pitfalls.html",
      note: "scaler·imputer·feature selection을 split 안에서 학습하는 원칙",
    },
  ],
  "ai/data-augmentation": [
    {
      kind: "핵심 논문",
      label: "RandAugment",
      href: "https://arxiv.org/abs/1909.13719",
      note: "operation 수와 magnitude로 augmentation policy search를 단순화한 근거",
    },
  ],
  "ai/image-augmentation-transforms": [
    {
      kind: "핵심 논문",
      label: "Albumentations",
      href: "https://doi.org/10.3390/info11020125",
      note: "image와 structured annotation에 같은 transform을 적용하는 library scope",
    },
  ],
  "ai/mixup-cutmix": [
    {
      kind: "핵심 논문",
      label: "mixup: Beyond Empirical Risk Minimization",
      href: "https://arxiv.org/abs/1710.09412",
      note: "input과 target의 convex combination을 사용하는 regularization",
    },
    {
      kind: "핵심 논문",
      label: "CutMix: Regularization Strategy to Train Strong Classifiers",
      href: "https://openaccess.thecvf.com/content_ICCV_2019/html/Yun_CutMix_Regularization_Strategy_to_Train_Strong_Classifiers_With_Localizable_Features_ICCV_2019_paper.html",
      note: "image region과 visible-area target을 함께 섞는 방법",
    },
  ],
  "ai/tabular-data-synthesis": [
    {
      kind: "핵심 논문",
      label: "SMOTE",
      href: "https://www.jair.org/index.php/jair/article/view/10302",
      note: "training-fold minority neighbor 사이 interpolation의 원 방법",
    },
    {
      kind: "핵심 논문",
      label: "CTGAN",
      href: "https://arxiv.org/abs/1907.00503",
      note: "mixed continuous·discrete tabular distribution의 conditional generation",
    },
  ],
  "ai/augmentation-evaluation": [
    {
      kind: "핵심 논문",
      label: "AugMix",
      href: "https://arxiv.org/abs/1912.02781",
      note: "고정 corruption benchmark에서 robustness와 uncertainty를 평가한 방법",
    },
  ],
  "ai/imbalanced-data": [
    {
      kind: "핵심 논문",
      label: "The Precision-Recall Plot Is More Informative than the ROC Plot",
      href: "https://doi.org/10.1371/journal.pone.0118432",
      note: "불균형 population에서 base rate와 평가 관점을 먼저 분리하는 근거",
    },
  ],
  "ai/imbalance-resampling": [
    {
      kind: "핵심 논문",
      label: "SMOTE: Synthetic Minority Over-sampling Technique",
      href: "https://www.jair.org/index.php/jair/article/view/10302",
      note: "minority 이웃 사이를 보간하는 원 방법과 평가",
    },
  ],
  "ai/imbalance-loss-weighting": [
    {
      kind: "핵심 논문",
      label: "Focal Loss for Dense Object Detection",
      href: "https://arxiv.org/abs/1708.02002",
      note: "easy example의 loss 기여를 줄이는 focal loss 원 논문",
    },
  ],
  "ai/cost-sensitive-thresholding": [
    {
      kind: "핵심 논문",
      label: "The Foundations of Cost-Sensitive Learning",
      href: "https://cseweb.ucsd.edu/~elkan/rescale.pdf",
      note: "오류 비용과 posterior probability를 action threshold로 연결하는 기초",
    },
  ],
  "ai/imbalanced-classification-evaluation": [
    {
      kind: "핵심 논문",
      label: "The Relationship Between Precision-Recall and ROC Curves",
      href: "https://doi.org/10.1145/1143844.1143874",
      note: "고정 binary dataset에서 ROC와 PR curve의 관계",
    },
    {
      kind: "핵심 논문",
      label: "On Calibration of Modern Neural Networks",
      href: "https://proceedings.mlr.press/v70/guo17a.html",
      note: "confidence와 empirical frequency를 비교하는 calibration 평가",
    },
  ],
  "ai/gradient-boosting": [
    { kind:"핵심 논문",label:"Greedy Function Approximation",href:"https://doi.org/10.1214/aos/1013203451",note:"함수 공간 negative-gradient boosting 원문" },
  ],
  "ai/xgboost-tree-objective": [
    { kind:"핵심 논문",label:"XGBoost",href:"https://arxiv.org/abs/1603.02754",note:"2차 regularized objective·sparsity-aware split·weighted sketch" },
  ],
  "ai/lightgbm-efficient-trees": [
    { kind:"핵심 논문",label:"LightGBM",href:"https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html",note:"GOSS row sampling과 EFB column bundling" },
  ],
  "ai/catboost-ordered-learning": [
    { kind:"핵심 논문",label:"CatBoost",href:"https://proceedings.neurips.cc/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html",note:"Prediction shift·ordered boosting·categorical statistic 분석" },
  ],
  "ai/tabular-deep-learning": [
    {
      kind: "핵심 논문",
      label: "TabNet: Attentive Interpretable Tabular Learning",
      href: "https://arxiv.org/abs/1908.07442",
      note: "단계별 attentive feature selection을 사용하는 테이블 구조",
    },
    {
      kind: "핵심 논문",
      label: "Revisiting Deep Learning Models for Tabular Data",
      href: "https://arxiv.org/abs/2106.11959",
      note: "FT-Transformer와 GBM·딥러닝 baseline의 공정한 비교",
    },
  ],
  "ai/time-features": [
    {
      kind: "핵심 논문",
      label:
        "Out-of-sample Tests of Forecasting Accuracy: an Analysis and Review",
      href: "https://doi.org/10.1016/S0169-2070(00)00065-0",
      note: "Forecast origin·lead time·estimation window를 이동시키는 out-of-sample evaluation 설계",
    },
    {
      kind: "핵심 논문",
      label: "Time2Vec: Learning a Vector Representation of Time",
      href: "https://arxiv.org/abs/1907.05321",
      note: "Linear coordinate와 학습 가능한 periodic coordinates를 결합한 시간 표현",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — TimeSeriesSplit",
      href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html",
      note: "미래 sample로 과거를 학습하지 않도록 시간 순서를 유지하는 cross-validation",
    },
    {
      kind: "보충 읽기",
      label: "Forecasting: Principles and Practice — Time series features",
      href: "https://otexts.com/fpp3/useful-predictors.html",
      note: "calendar·lag·moving-average 등 예측용 time-series feature의 공개 교재",
    },
  ],
  "ai/sequence-modeling-tabular": [
    {
      kind: "핵심 논문",
      label: "Attention Is All You Need",
      href: "https://arxiv.org/abs/1706.03762",
      note: "self-attention·position encoding·masking을 포함한 Transformer 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "Time2Vec: Learning a Vector Representation of Time",
      href: "https://arxiv.org/abs/1907.05321",
      note: "event sequence에서 주기와 비주기 시간 정보를 학습 가능한 표현으로 구성",
    },
  ],
  "ai/training-pipeline": [
    {
      kind: "공식 문서",
      label: "PyTorch — torch.utils.data",
      href: "https://docs.pytorch.org/docs/stable/data.html",
      note: "Dataset·DataLoader·sampler·collate_fn·multi-process loading의 현재 API 계약",
    },
    {
      kind: "공식 문서",
      label: "PyTorch — Automatic Mixed Precision",
      href: "https://docs.pytorch.org/docs/stable/amp.html",
      note: "torch.amp.autocast와 GradScaler의 dtype별 사용 범위",
    },
    {
      kind: "공식 예제",
      label: "PyTorch — Saving and Loading Models",
      href: "https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html",
      note: "state_dict·general checkpoint·resume을 구분하는 공식 recipe",
    },
    {
      kind: "공식 문서",
      label: "PyTorch — Reproducibility",
      href: "https://docs.pytorch.org/docs/stable/notes/randomness.html",
      note: "RNG·DataLoader worker·deterministic algorithm과 재현성 한계",
    },
  ],
  "ai/transfer-learning-practice": [
    {
      kind: "공식 예제",
      label: "PyTorch — Transfer Learning for Computer Vision",
      href: "https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
      note: "전체 fine-tuning과 fixed feature extractor를 구분한 공식 tutorial",
    },
    {
      kind: "핵심 논문",
      label: "Universal Language Model Fine-tuning for Text Classification",
      href: "https://arxiv.org/abs/1801.06146",
      note: "discriminative fine-tuning·slanted triangular learning rate·gradual unfreezing을 제안한 ULMFiT",
    },
    {
      kind: "핵심 논문",
      label:
        "Don’t Stop Pretraining: Adapt Language Models to Domains and Tasks",
      href: "https://aclanthology.org/2020.acl-main.740/",
      note: "domain-adaptive와 task-adaptive pretraining을 downstream task에서 비교",
    },
    {
      kind: "핵심 논문",
      label: "Domain-Adversarial Training of Neural Networks",
      href: "https://jmlr.org/papers/v17/15-239.html",
      note: "labeled source와 unlabeled target을 이용한 domain-invariant representation 학습",
    },
  ],
  "ai/lr-scheduling": [
    {
      kind: "공식 문서",
      label: "PyTorch — Learning Rate Scheduler",
      href: "https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate",
      note: "Optimizer update 뒤 scheduler 호출과 state·parameter-group LR의 현재 API semantics",
    },
  ],
  "ai/lr-decay-policies": [
    {
      kind: "공식 문서",
      label: "PyTorch — LRScheduler and ReduceLROnPlateau",
      href: "https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate",
      note: "StepLR·ExponentialLR의 clock 입력과 ReduceLROnPlateau의 metric 입력을 구분",
    },
  ],
  "ai/cosine-restart-scheduling": [
    {
      kind: "핵심 논문",
      label: "SGDR: Stochastic Gradient Descent with Warm Restarts",
      href: "https://arxiv.org/abs/1608.03983",
      note: "cosine annealing과 partial warm restart·cycle expansion을 제안",
    },
  ],
  "ai/one-cycle-scheduling": [
    {
      kind: "핵심 논문",
      label: "Super-Convergence: Very Fast Training Using Large Learning Rates",
      href: "https://arxiv.org/abs/1708.07120",
      note: "큰 maximum learning rate와 one-cycle policy·range-test 관찰의 조건부 범위",
    },
  ],
  "ai/warmup-scheduling": [
    {
      kind: "핵심 논문",
      label: "On the Adequacy of Untuned Warmup for Adaptive Optimization",
      href: "https://arxiv.org/abs/1910.04209",
      note: "Adam 초기 update magnitude와 simple untuned linear warmup을 분석",
    },
  ],
  "ai/regularization-practice": [
    {
      kind: "핵심 논문",
      label: "Deep Learning — Regularization for Deep Learning",
      href: "https://www.deeplearningbook.org/contents/regularization.html",
      note: "generalization 진단 뒤 제약과 penalty를 비교하는 넓은 regularization 계보",
    },
  ],
  "ai/dropout-regularization": [
    {
      kind: "핵심 논문",
      label: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
      href: "https://jmlr.org/papers/v15/srivastava14a.html",
      note: "Bernoulli unit removal과 test-time scaled-network 근사의 원 논문",
    },
  ],
  "ai/weight-decay": [
    {
      kind: "핵심 논문",
      label: "Decoupled Weight Decay Regularization",
      href: "https://arxiv.org/abs/1711.05101",
      note: "adaptive task update에서 direct parameter shrink를 분리한 AdamW",
    },
  ],
  "ai/early-stopping": [
    {
      kind: "핵심 논문",
      label: "Early Stopping — but when?",
      href: "https://pubmed.ncbi.nlm.nih.gov/12662814/",
      note: "validation trajectory의 stopping criterion과 training-time trade-off",
    },
  ],
  "ai/label-smoothing": [
    {
      kind: "핵심 논문",
      label: "Rethinking the Inception Architecture for Computer Vision",
      href: "https://arxiv.org/abs/1512.00567",
      note: "one-hot target을 uniform distribution과 섞는 label smoothing formulation",
    },
  ],
  "ai/image-classification-pipeline": [
    {
      kind: "공식 문서",
      label: "scikit-learn GroupKFold",
      href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html",
      note: "non-overlapping group을 cross-validation fold로 배정하는 API contract",
    },
    {
      kind: "핵심 논문",
      label: "Improving Reproducibility in Machine Learning Research",
      href: "https://www.jmlr.org/papers/v22/20-303.html",
      note: "data·code·hyperparameter·result artifact의 reproducibility checklist",
    },
  ],
  "ai/image-backbone-scaling": [
    {
      kind: "핵심 논문",
      label:
        "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
      href: "https://proceedings.mlr.press/v97/tan19a.html",
      note: "depth·width·resolution을 함께 조정하는 compound scaling",
    },
    {
      kind: "핵심 논문",
      label: "A ConvNet for the 2020s",
      href: "https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html",
      note: "Transformer 설계 선택을 convolutional network에 적용한 ConvNeXt",
    },
    {
      kind: "핵심 논문",
      label: "An Image is Worth 16x16 Words",
      href: "https://openreview.net/forum?id=YicbFdNTTy",
      note: "image patch를 token으로 처리하는 Vision Transformer 원 논문",
    },
  ],
  "ai/image-training-stages": [
    {
      kind: "핵심 논문",
      label: "RandAugment: Practical Automated Data Augmentation",
      href: "https://proceedings.neurips.cc/paper/2020/hash/d85b63ef0ccb114d0a3bb7b7d808028f-Abstract.html",
      note: "검색 공간을 단순화한 image augmentation policy",
    },
    {
      kind: "핵심 논문",
      label:
        "FixMatch: Simplifying Semi-Supervised Learning with Consistency and Confidence",
      href: "https://proceedings.neurips.cc/paper/2020/hash/06964dce9addb1c5cb5d6e3d9838f733-Abstract.html",
      note: "weak-view confidence pseudo-label과 strong-view consistency를 결합한 semi-supervised 학습",
    },
  ],
  "ai/image-probability-decisions": [
    {
      kind: "핵심 논문",
      label: "On Calibration of Modern Neural Networks",
      href: "https://proceedings.mlr.press/v70/guo17a.html",
      note: "classifier confidence calibration 분석과 scalar temperature scaling",
    },
  ],
  "ai/multiview-fusion": [
    {
      kind: "핵심 논문",
      label:
        "Multi-view Convolutional Neural Networks for 3D Shape Recognition",
      href: "https://openaccess.thecvf.com/content_iccv_2015/html/Su_Multi-View_Convolutional_Neural_ICCV_2015_paper.html",
      note: "view별 CNN feature를 pooling해 3D object를 분류한 multi-view 기준 연구",
    },
    {
      kind: "핵심 논문",
      label:
        "Set Transformer: A Framework for Attention-based Permutation-Invariant Neural Networks",
      href: "https://proceedings.mlr.press/v97/lee19d.html",
      note: "순서가 없는 set input을 attention과 invariant pooling으로 처리",
    },
  ],
  "ai/deepfake-detection": [
    {
      kind: "Benchmark 논문",
      label: "FaceForensics++: Learning to Detect Manipulated Facial Images",
      href: "https://openaccess.thecvf.com/content_ICCV_2019/html/Rossler_FaceForensics_Learning_to_Detect_Manipulated_Facial_Images_ICCV_2019_paper.html",
      note: "여러 face manipulation과 compression 조건을 제공하는 대표 benchmark",
    },
    {
      kind: "핵심 논문",
      label: "CNN-Generated Images Are Surprisingly Easy to Spot... for Now",
      href: "https://openaccess.thecvf.com/content_CVPR_2020/html/Wang_CNN-Generated_Images_Are_Surprisingly_Easy_to_Spot..._for_Now_CVPR_2020_paper.html",
      note: "생성 모델의 공통 artifact와 새로운 generator로의 일반화를 분석",
    },
  ],
  "ai/deepfake-preprocessing-lineage": [
    {
      kind: "Benchmark 논문",
      label: "DeepfakeBench: preprocessing and evaluation protocol",
      href: "https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html#preprocessing",
      note: "face extraction·crop·data management를 detector 비교 조건과 함께 고정하는 재현 benchmark",
    },
  ],
  "ai/deepfake-frequency-evidence": [
    {
      kind: "비판적 읽기",
      label:
        "A Closer Look at Fourier Spectrum Discrepancies for CNN-Generated Images Detection",
      href: "https://openaccess.thecvf.com/content/CVPR2021/html/Chandrasegaran_A_Closer_Look_at_Fourier_Spectrum_Discrepancies_for_CNN-Generated_Images_CVPR_2021_paper.html",
      note: "고주파 spectrum discrepancy를 보편적이고 robust한 생성 흔적으로 해석하는 주장 재검토",
    },
  ],
  "ai/deepfake-video-decisions": [
    {
      kind: "Benchmark 논문",
      label: "DeepfakeBench: detector comparison parity",
      href: "https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html#comparison",
      note: "동일 data pipeline·metric·implementation boundary에서 detector와 video decision을 비교",
    },
  ],
  "ai/deepfake-dataset-governance": [
    {
      kind: "Benchmark 논문",
      label: "The Deepfake Detection Challenge Dataset",
      href: "https://arxiv.org/abs/2006.07397",
      note: "동의한 참여자 기반의 대규모 face-swap video dataset과 construction boundary",
    },
  ],
  "ai/video-understanding": [
    {
      kind: "핵심 논문",
      label: "Certain Topics in Telegraph Transmission Theory",
      href: "https://doi.org/10.1109/T-AIEE.1928.5055024",
      note: "Video motion aliasing에 재사용하는 signal bandwidth와 sampling-rate 경계",
    },
  ],
  "ai/video-clip-sampling": [
    {
      kind: "핵심 논문",
      label: "Temporal Segment Networks",
      href: "https://arxiv.org/abs/1608.00859",
      note: "긴 video를 segments로 나누고 sparse snippets를 video consensus로 결합",
    },
  ],
  "ai/video-convolution-architectures": [
    {
      kind: "핵심 논문",
      label:
        "Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset",
      href: "https://openaccess.thecvf.com/content_cvpr_2017/html/Carreira_Quo_Vadis_Action_CVPR_2017_paper.html",
      note: "2D image filters를 3D로 inflate한 I3D와 Kinetics video pretraining",
    },
    {
      kind: "핵심 논문",
      label:
        "A Closer Look at Spatiotemporal Convolutions for Action Recognition",
      href: "https://openaccess.thecvf.com/content_cvpr_2018/html/Tran_A_Closer_Look_CVPR_2018_paper.html",
      note: "3D convolution을 spatial·temporal operators로 분해한 R(2+1)D",
    },
    {
      kind: "핵심 논문",
      label: "SlowFast Networks for Video Recognition",
      href: "https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html",
      note: "공간 의미와 빠른 motion을 서로 다른 frame-rate·capacity paths로 처리",
    },
  ],
  "ai/video-transformers": [
    {
      kind: "핵심 논문",
      label: "TimeSformer",
      href: "https://proceedings.mlr.press/v139/bertasius21a.html",
      note: "Video patch token의 joint·factorized space-time attention 비교",
    },
    {
      kind: "핵심 논문",
      label: "VideoMAE",
      href: "https://openreview.net/forum?id=AhccnBXSne",
      note: "높은 tube masking ratio와 visible-token encoder 기반 video pretraining",
    },
  ],
  "ai/competition-workflow": [],
  "ai/model-selection-bias": [
    { kind: "핵심 논문", label: "On Over-fitting in Model Selection and Subsequent Selection Bias", href: "https://www.jmlr.org/papers/v11/cawley10a.html", note: "Finite validation criterion의 variance와 반복 selection이 만드는 편향" },
  ],
  "ai/prediction-time-feature-availability": [],
  "ai/competition-baseline": [
    { kind: "핵심 논문", label: "Hidden Technical Debt in Machine Learning Systems", href: "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems", note: "Data·configuration·feedback dependency를 포함한 ML system risk taxonomy" },
  ],
  "ai/paired-experiment-design": [],
  "ai/competition-submission-control": [
    { kind: "핵심 논문", label: "The Ladder: A Reliable Leaderboard for Machine Learning Competitions", href: "https://proceedings.mlr.press/v37/blum15.html", note: "적응적 submission과 leaderboard holdout overfitting 문제" },
  ],
  "ai/cross-validation": [
    { kind: "공식 문서", label: "scikit-learn: Cross-validation — evaluating estimator performance", href: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "K-fold·group·time splitter의 서로 다른 data assumption과 current API" },
  ],
  "ai/fold-local-validation": [
    { kind: "공식 문서", label: "scikit-learn: Pipeline — chaining estimators", href: "https://scikit-learn.org/stable/modules/compose.html#pipeline-chaining-estimators", note: "Transform fit과 estimator fit을 같은 cross-validation 경계에서 실행하는 current API" },
  ],
  "ai/oof-risk-estimation": [
    { kind: "핵심 논문", label: "Cross-Validation: What Does It Estimate and How Well Does It Do It?", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/", note: "CV procedure estimand와 fold dependence·uncertainty 해석" },
  ],
  "ai/grouped-validation": [
    { kind: "공식 문서", label: "scikit-learn: Cross-validation iterators for grouped data", href: "https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data", note: "GroupKFold·StratifiedGroupKFold의 current semantics" },
  ],
  "ai/walk-forward-validation": [
    { kind: "공식 문서", label: "scikit-learn: TimeSeriesSplit", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html", note: "Successive training windows와 gap parameter의 current behavior" },
  ],
  "ai/validation-feedback-audit": [
    { kind: "핵심 논문", label: "The Ladder: A Reliable Leaderboard for Machine Learning Competitions", href: "https://proceedings.mlr.press/v37/blum15.html", note: "적응적 leaderboard feedback과 holdout overfitting 문제" },
  ],
  "ai/hyperparameter-tuning": [
    {
      kind: "핵심 논문",
      label: "Random Search for Hyper-Parameter Optimization",
      href: "https://www.jmlr.org/papers/v13/bergstra12a.html",
      note: "일부 축만 중요한 공간에서 grid보다 서로 다른 중요 값들을 더 많이 시험하는 random search 분석",
    },
  ],
  "ai/adaptive-hyperparameter-search": [
    { kind: "핵심 논문", label: "Optuna: A Next-generation Hyperparameter Optimization Framework", href: "https://arxiv.org/abs/1907.10902", note: "define-by-run·study·trial·sampler·pruner·storage architecture" },
    { kind: "핵심 논문", label: "Algorithms for Hyper-Parameter Optimization", href: "https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization", note: "TPE의 good/other configuration density model" },
  ],
  "ai/search-space-design": [
    { kind: "핵심 논문", label: "Optuna: A Next-generation Hyperparameter Optimization Framework", href: "https://arxiv.org/abs/1907.10902", note: "Conditional search space를 코드에서 구성하는 define-by-run 설계" },
  ],
  "ai/multi-fidelity-pruning": [
    { kind: "핵심 논문", label: "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization", href: "https://www.jmlr.org/papers/v18/16-558.html", note: "Successive halving과 bracket을 통한 resource allocation" },
  ],
  "ai/multi-objective-hpo": [
    { kind: "공식 문서", label: "Optuna — Multi-objective optimization", href: "https://optuna.readthedocs.io/en/stable/tutorial/20_recipes/002_multi_objective.html", note: "Multiple directions와 Pareto trials의 current API example" },
  ],
  "ai/ensemble-methods": [
    {
      kind: "핵심 논문",
      label: "Stacked Generalization",
      href: "https://doi.org/10.1016/S0893-6080(05)80023-1",
      note: "Base generalizer가 보지 않은 sample의 prediction을 second-level generalizer 입력으로 쓰는 원 아이디어",
    },
    {
      kind: "핵심 논문",
      label: "Super Learner",
      href: "https://biostats.bepress.com/ucbbiostat/paper222/",
      note: "V-fold cross-validated risk로 learner combination을 선택하고 oracle과 비교하는 asymptotic 결과",
    },
    {
      kind: "핵심 논문",
      label: "Ensemble Selection from Libraries of Models",
      href: "https://doi.org/10.1145/1015330.1015432",
      note: "큰 model library에서 목표 metric을 개선하는 후보를 forward stepwise로 추가하는 방법",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — StackingClassifier",
      href: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html",
      note: "cross-validated base prediction으로 final estimator를 학습하는 stacking 구현",
    },
  ],
  "ai/evaluation-metrics": [
    {
      kind: "공식 문서",
      label: "scikit-learn: Metrics and scoring",
      href: "https://scikit-learn.org/stable/modules/model_evaluation.html",
      note: "classification·regression·ranking metric의 정의와 API",
    },
  ],
  "ai/regression-metrics": [
    {
      kind: "핵심 논문",
      label: "Regression Quantiles",
      href: "https://doi.org/10.2307/1913643",
      note: "Absolute-loss 기반 conditional quantile regression과 조건부 평균을 넘어선 회귀 target",
    },
  ],
  "ai/classification-metrics": [
    {
      kind: "핵심 논문",
      label: "Strictly Proper Scoring Rules, Prediction, and Estimation",
      href: "https://doi.org/10.1198/016214506000001437",
      note: "실제 probability distribution의 정직한 보고를 유도하는 proper scoring rule의 일반 이론",
    },
  ],
  "ai/ranking-metrics": [
    {
      kind: "핵심 논문",
      label: "Cumulated Gain-based Evaluation of IR Techniques",
      href: "https://doi.org/10.1145/582415.582418",
      note: "Graded relevance와 rank discount를 반영하는 cumulative gain·normalized evaluation",
    },
  ],
  "ai/metric-selection-protocol": [
    {
      kind: "공식 문서",
      label: "scikit-learn: Metrics and scoring",
      href: "https://scikit-learn.org/stable/modules/model_evaluation.html",
      note: "Scorer 방향·parameter·multi-metric evaluation의 현재 API semantics",
    },
  ],
  "ai/experiment-tracking": [
    {
      kind: "핵심 논문",
      label: "Accelerating the Machine Learning Lifecycle with MLflow",
      href: "https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf",
      note: "Experiment·run·artifact를 공통 lifecycle interface로 연결한 초기 MLflow 설계",
    },
  ],
  "ai/learning-curve-tracking": [
    {
      kind: "공식 문서",
      label: "Weights & Biases: Log data with experiments",
      href: "https://docs.wandb.ai/guides/track/log/",
      note: "metric history·step·custom progress axis를 기록하는 현재 공식 semantics",
    },
  ],
  "ai/model-artifact-registry": [
    {
      kind: "공식 문서",
      label: "MLflow Artifact Stores",
      href: "https://mlflow.org/docs/latest/self-hosting/architecture/artifact-store/",
      note: "Backend metadata와 artifact object store의 현재 책임·access 경계",
    },
    {
      kind: "공식 문서",
      label: "MLflow Model Registry Workflows",
      href: "https://mlflow.org/docs/latest/ml/model-registry/workflow/",
      note: "Immutable versions·tags·mutable aliases와 alias-based loading의 현재 workflow",
    },
  ],
  "ai/reproducible-ml-execution": [
    {
      kind: "핵심 논문",
      label: "Machine Learning: The High Interest Credit Card of Technical Debt",
      href: "https://research.google/pubs/machine-learning-the-high-interest-credit-card-of-technical-debt/",
      note: "Hidden data dependency·configuration·pipeline coupling이 만드는 ML system debt",
    },
    {
      kind: "공식 문서",
      label: "PyTorch Reproducibility",
      href: "https://docs.pytorch.org/docs/stable/notes/randomness.html",
      note: "seed와 deterministic operation의 범위 및 재현성 trade-off",
    },
  ],
  "ai/open-r1": [
    {
      kind: "공식 코드",
      label: "Hugging Face Open-R1",
      href: "https://github.com/huggingface/open-r1",
      note: "데이터 생성·SFT·GRPO·평가 recipe의 현재 공개 구현",
    },
    {
      kind: "핵심 논문",
      label: "DeepSeek-R1 Technical Report",
      href: "https://arxiv.org/abs/2501.12948",
      note: "Open-R1이 재현 대상으로 삼은 reasoning 학습 파이프라인",
    },
    {
      kind: "핵심 논문",
      label: "DeepSeekMath — GRPO",
      href: "https://arxiv.org/abs/2402.03300",
      note: "Value model 없이 group-relative advantage를 사용하는 GRPO의 원 제안",
    },
    {
      kind: "공식 문서",
      label: "TRL — GRPO Trainer",
      href: "https://huggingface.co/docs/trl/grpo_trainer",
      note: "현재 advantage scaling·loss type·KL default·vLLM importance-sampling correction 설정",
    },
    {
      kind: "후속 분석",
      label: "Understanding R1-Zero-Like Training: A Critical Perspective",
      href: "https://arxiv.org/abs/2503.20783",
      note: "Base-model prior와 GRPO response-length·difficulty bias를 분리한 분석",
    },
    {
      kind: "핵심 논문",
      label: "DAPO",
      href: "https://arxiv.org/abs/2503.14476",
      note: "긴 CoT RL의 token-level loss·dynamic sampling·clip 설계와 공개 system",
    },
    {
      kind: "공식 프로젝트 기록",
      label: "Open-R1: Update #1",
      href: "https://huggingface.co/blog/open-r1/update-1",
      note: "TRL GRPO, vLLM rollout과 synthetic data generation의 초기 구현",
    },
    {
      kind: "공식 프로젝트 기록",
      label: "Open-R1: Update #2",
      href: "https://huggingface.co/blog/open-r1/update-2",
      note: "OpenR1-Math-220k의 생성·verification·distillation 결과",
    },
    {
      kind: "공식 프로젝트 기록",
      label: "Open-R1: Update #3",
      href: "https://huggingface.co/blog/open-r1/update-3",
      note: "Reasoning SFT와 data filtering에서 얻은 ablation과 운영 교훈",
    },
  ],
  "ai/vision-transformer": [
    {
      kind: "핵심 논문",
      label: "An Image is Worth 16x16 Words",
      href: "https://openreview.net/forum?id=YicbFdNTTy",
      note: "이미지 패치를 token sequence로 다루는 Vision Transformer의 원문",
    },
    {
      kind: "핵심 논문",
      label:
        "Training data-efficient image transformers & distillation through attention",
      href: "https://proceedings.mlr.press/v139/touvron21a.html",
      note: "DeiT의 distillation token과 data-efficient training recipe",
    },
    {
      kind: "핵심 논문",
      label:
        "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
      href: "https://openaccess.thecvf.com/content/ICCV2021/html/Liu_Swin_Transformer_Hierarchical_Vision_Transformer_Using_Shifted_Windows_ICCV_2021_paper.html",
      note: "shifted-window attention과 hierarchical feature map",
    },
    {
      kind: "핵심 논문",
      label: "Masked Autoencoders Are Scalable Vision Learners",
      href: "https://openaccess.thecvf.com/content/CVPR2022/html/He_Masked_Autoencoders_Are_Scalable_Vision_Learners_CVPR_2022_paper.html",
      note: "높은 masking ratio와 asymmetric encoder–decoder를 사용한 MAE",
    },
  ],
  "ai/contrastive-learning": [
    {
      kind: "핵심 논문",
      label: "Understanding Contrastive Representation Learning through Alignment and Uniformity",
      href: "https://proceedings.mlr.press/v119/wang20k.html",
      note: "positive alignment와 normalized hypersphere uniformity를 분리해 분석",
    },
  ],
  "ai/simclr-infonce": [{ kind: "핵심 논문", label: "A Simple Framework for Contrastive Learning of Visual Representations", href: "https://proceedings.mlr.press/v119/chen20j.html", note: "augmentation·projection head·NT-Xent로 구성한 SimCLR의 기준 논문" }],
  "ai/triplet-metric-learning": [{ kind: "핵심 논문", label: "FaceNet: A Unified Embedding for Face Recognition and Clustering", href: "https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html", note: "unit embedding·triplet loss·online semi-hard mining의 기준 연구" }],
  "ai/supervised-contrastive-learning": [{ kind: "핵심 논문", label: "Supervised Contrastive Learning", href: "https://papers.nips.cc/paper_files/paper/2020/hash/d89a66c7c80a29b1bdbab0f2a1a94af8-Abstract.html", note: "같은 class의 여러 sample을 positive로 사용하는 objective" }],
  "ai/contrastive-evaluation": [{ kind: "핵심 논문", label: "Debiased Contrastive Learning", href: "https://proceedings.neurips.cc/paper/2020/hash/63c3ddcc7b23daa1e42dc41f9a44a873-Abstract.html", note: "Unlabeled negative 안의 hidden positive가 만드는 sampling bias 분석" }],
  "ai/vae": [
    {
      kind: "핵심 논문",
      label: "Auto-Encoding Variational Bayes",
      href: "https://arxiv.org/abs/1312.6114",
      note: "ELBO와 reparameterization trick의 원문",
    },
    {
      kind: "핵심 논문",
      label: "β-VAE: Learning Basic Visual Concepts",
      href: "https://arxiv.org/abs/1606.05579",
      note: "잠재 요인 분리와 KL 가중치 확장의 기준",
    },
    {
      kind: "핵심 논문",
      label: "Neural Discrete Representation Learning",
      href: "https://arxiv.org/abs/1711.00937",
      note: "Discrete codebook과 vector quantization을 사용하는 VQ-VAE 원 논문",
    },
    {
      kind: "보충 읽기",
      label: "Understanding disentangling in β-VAE",
      href: "https://arxiv.org/abs/1804.03599",
      note: "β가 reconstruction·latent capacity·disentanglement에 주는 영향을 분석",
    },
  ],
  "ai/gan": [
    {
      "kind": "핵심 논문",
      "label": "Generative Adversarial Nets",
      "href": "https://arxiv.org/abs/1406.2661",
      "note": "Implicit generator·minimax game·optimal discriminator의 출발점"
    }
  ],
  "ai/gan-training-dynamics": [
    {
      "kind": "핵심 논문",
      "label": "GANs Trained by a Two Time-Scale Update Rule",
      "href": "https://arxiv.org/abs/1706.08500",
      "note": "두 optimizer time scale의 local convergence 조건과 FID 제안"
    }
  ],
  "ai/gan-wasserstein-critics": [
    {
      "kind": "핵심 논문",
      "label": "Wasserstein GAN",
      "href": "https://arxiv.org/abs/1701.07875",
      "note": "Transport topology와 1-Lipschitz critic objective"
    },
    {
      "kind": "핵심 논문",
      "label": "Improved Training of Wasserstein GANs",
      "href": "https://arxiv.org/abs/1704.00028",
      "note": "Weight clipping 대신 sampled gradient penalty"
    },
    {
      "kind": "핵심 논문",
      "label": "Spectral Normalization for GANs",
      "href": "https://arxiv.org/abs/1802.05957",
      "note": "Weight operator norm을 제한하는 discriminator regularization"
    }
  ],
  "ai/gan-conditional-evaluation": [
    {
      "kind": "핵심 논문",
      "label": "Conditional Generative Adversarial Nets",
      "href": "https://arxiv.org/abs/1411.1784",
      "note": "Condition을 generator와 discriminator 양쪽에 제공"
    },
    {
      "kind": "평가 논문",
      "label": "Assessing Generative Models via Precision and Recall",
      "href": "https://arxiv.org/abs/1806.00035",
      "note": "Sample quality와 target coverage를 두 축으로 분리"
    }
  ],
  "ai/diffusion-models": [
    {
      kind: "핵심 논문",
      label: "Denoising Diffusion Probabilistic Models",
      href: "https://arxiv.org/abs/2006.11239",
      note: "DDPM의 forward·reverse process 기준",
    },
    {
      kind: "핵심 논문",
      label: "U-Net: Convolutional Networks for Biomedical Image Segmentation",
      href: "https://arxiv.org/abs/1505.04597",
      note: "Contracting·expanding path와 long skip connection의 원 구조",
    },
  ],
  "ai/diffusion-continuous-time": [
    {
      kind: "핵심 논문",
      label: "Score-Based Generative Modeling through SDEs",
      href: "https://arxiv.org/abs/2011.13456",
      note: "Reverse-time SDE와 probability-flow ODE의 정본",
    },
    {
      kind: "핵심 논문",
      label: "Flow Matching for Generative Modeling",
      href: "https://arxiv.org/abs/2210.02747",
      note: "Conditional velocity regression의 정본",
    },
  ],
  "ai/latent-diffusion-guidance": [
    {
      kind: "핵심 논문",
      label: "High-Resolution Image Synthesis with Latent Diffusion Models",
      href: "https://arxiv.org/abs/2112.10752",
      note: "Autoencoder latent-space denoising의 정본",
    },
    {
      kind: "핵심 논문",
      label: "Classifier-Free Diffusion Guidance",
      href: "https://arxiv.org/abs/2207.12598",
      note: "Conditional·unconditional prediction 결합의 정본",
    },
  ],
  "ai/visual-representation-tokenizers": [
    {
      kind: "핵심 논문",
      label: "High-Resolution Image Synthesis with Latent Diffusion Models",
      href: "https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html",
      note: "Perceptual autoencoder가 만드는 reconstruction latent와 latent-space diffusion의 기준 연구",
    },
    {
      kind: "후속 논문",
      label: "Diffusion Transformers with Representation Autoencoders",
      href: "https://arxiv.org/abs/2510.11690",
      note: "Semantic representation encoder를 diffusion latent로 재사용하는 2025년 preprint이며 production 표준으로 확정하지 않음",
    },
  ],
  "ai/diffusion-transformer-architecture": [
    {
      kind: "핵심 논문",
      label: "Scalable Diffusion Models with Transformers",
      href: "https://arxiv.org/abs/2212.09748",
      note: "Latent patch token·adaptive layer normalization·DiT scaling 실험의 원 연구",
    },
    {
      kind: "핵심 논문",
      label: "Scaling Rectified Flow Transformers for High-Resolution Image Synthesis",
      href: "https://arxiv.org/abs/2403.03206",
      note: "Text·image modality별 weight를 두고 attention으로 교환하는 MMDiT와 rectified-flow recipe의 기준",
    },
    {
      kind: "공식 연구",
      label: "Krea 2 Technical Report",
      href: "https://www.krea.ai/blog/krea-2-technical-report",
      note: "Single-stream·GQA·gated sigmoid attention·3D axial RoPE 등 Krea 2 구성에 대한 제작사 자기보고",
    },
  ],
  "ai/modern-image-model-stack": [
    {
      kind: "공식 연구",
      label: "Krea 2 Technical Report",
      href: "https://www.krea.ai/blog/krea-2-technical-report",
      note: "Prompt expander·encoder·autoencoder·DiT·post-training을 하나의 image system으로 설명한 제작사 보고서",
    },
    {
      kind: "핵심 논문",
      label: "High-Resolution Image Synthesis with Latent Diffusion Models",
      href: "https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html",
      note: "Encoder·latent denoiser·decoder로 분리된 two-stage image generation pipeline의 선행 근거",
    },
    {
      kind: "선행·비교 논문",
      label: "Scaling Rectified Flow Transformers for High-Resolution Image Synthesis",
      href: "https://arxiv.org/abs/2403.03206",
      note: "Modern text-to-image stack의 multimodal backbone·rectified flow·evaluation 비교점",
    },
  ],
  "ai/diffusion-language-models": [
    {
      kind: "핵심 논문",
      label: "Simple and Effective Masked Diffusion Language Models",
      href: "https://arxiv.org/abs/2406.07524",
      note: "Absorbing MASK와 SUBS parameterization으로 discrete diffusion objective를 정리한 NeurIPS 2024 연구",
    },
    {
      kind: "후속 논문",
      label: "Large Language Diffusion Models",
      href: "https://arxiv.org/abs/2502.09992",
      note: "LLaDA의 from-scratch pretraining·SFT·low-confidence remasking을 보고한 연구로 결과는 해당 checkpoint와 sampler 범위",
    },
    {
      kind: "핵심 논문",
      label: "Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models",
      href: "https://openreview.net/pdf?id=tyEyYT267x",
      note: "Block 사이 causal factorization과 block 내부 diffusion을 결합한 ICLR 2025 연구",
    },
    {
      kind: "보충 읽기",
      label: "Dream 7B: Diffusion Large Language Models",
      href: "https://arxiv.org/abs/2508.15487",
      note: "Autoregressive initialization을 쓰는 2025년 preprint로 MDLM·LLaDA와 recipe를 구분해서 읽음",
    },
  ],
  "ai/yarn-rope-extension": [
    {
      kind: "핵심 논문",
      label:
        "YaRN: Efficient Context Window Extension of Large Language Models",
      href: "https://arxiv.org/abs/2309.00071",
      note: "RoPE scaling과 긴 문맥 확장의 원문",
    },
    {
      kind: "핵심 논문",
      label: "RoFormer: Enhanced Transformer with Rotary Position Embedding",
      href: "https://arxiv.org/abs/2104.09864",
      note: "RoPE 회전 표현의 출발점",
    },
    {
      kind: "핵심 논문",
      label:
        "Extending Context Window of Large Language Models via Positional Interpolation",
      href: "https://arxiv.org/abs/2306.15595",
      note: "Position Interpolation으로 기존 위치 범위 안에 긴 sequence를 매핑한 연구",
    },
    {
      kind: "공식 문서",
      label: "Hugging Face Transformers — RoPE utilities",
      href: "https://huggingface.co/docs/transformers/internal/rope_utils",
      note: "현재 지원하는 RoPE 방식과 YaRN config field",
    },
    {
      kind: "공식 예제",
      label: "vLLM — Context Extension",
      href: "https://docs.vllm.ai/en/latest/examples/offline_inference/context_extension/",
      note: "rope_parameters와 hf_overrides를 사용하는 YaRN 예제",
    },
    {
      kind: "공식 문서",
      label: "llama.cpp CLI options",
      href: "https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md",
      note: "YaRN·RoPE scaling의 현재 CLI option",
    },
  ],
  "ai/supervised-fine-tuning": [
    {
      kind: "핵심 논문",
      label: "Finetuned Language Models Are Zero-Shot Learners",
      href: "https://arxiv.org/abs/2109.01652",
      note: "여러 task를 natural-language instruction으로 표현한 FLAN instruction tuning과 ablation",
    },
    {
      kind: "핵심 논문",
      label: "Self-Instruct",
      href: "https://arxiv.org/abs/2212.10560",
      note: "Instruction·input·output 생성과 filtering으로 SFT data를 확장한 pipeline",
    },
    {
      kind: "핵심 논문",
      label:
        "Training language models to follow instructions with human feedback",
      href: "https://arxiv.org/abs/2203.02155",
      note: "InstructGPT의 demonstration SFT를 reward model·PPO의 출발점으로 둔 기준",
    },
  ],
  "ai/rlhf": [
    {
      kind: "핵심 논문",
      label:
        "Training language models to follow instructions with human feedback",
      href: "https://arxiv.org/abs/2203.02155",
      note: "SFT·reward model·PPO로 이어지는 RLHF 기준",
    },
    {
      kind: "핵심 논문",
      label: "Proximal Policy Optimization Algorithms",
      href: "https://arxiv.org/abs/1707.06347",
      note: "Clipped surrogate objective와 alternating policy update를 제안한 PPO 원문",
    },
    {
      kind: "핵심 논문",
      label: "RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback",
      href: "https://arxiv.org/abs/2309.00267",
      note: "사람 대신 AI judge가 preference label을 매기는 RLAIF 변형의 실험 근거",
    },
],
  "ai/dpo": [
    { kind: "핵심 논문", label: "Direct Preference Optimization", href: "https://arxiv.org/abs/2305.18290", note: "KL-regularized reward objective를 chosen·rejected policy log-ratio loss로 재매개화" },
    { kind: "공식 문서", label: "Hugging Face TRL · DPO Trainer", href: "https://huggingface.co/docs/trl/dpo_trainer", note: "Reference handling·loss variant·data format을 확인하는 implementation surface" },
  ],
  "ai/constitutional-ai": [
    { kind: "핵심 논문", label: "Constitutional AI", href: "https://arxiv.org/abs/2212.08073", note: "원칙 기반 self-critique·revision과 RLAIF pipeline" },
  ],
  "ai/orpo": [
    { kind: "핵심 논문", label: "ORPO: Monolithic Preference Optimization", href: "https://arxiv.org/abs/2403.07691", note: "Chosen SFT와 odds-ratio preference objective를 한 단계로 결합" },
  ],
  "ai/kto": [
    { kind: "핵심 논문", label: "KTO: Model Alignment as Prospect Theoretic Optimization", href: "https://arxiv.org/abs/2402.01306", note: "짝 없는 binary feedback을 KL reference point 양쪽에서 학습" },
  ],
  "ai/sentence-embeddings": [
    {
      kind: "핵심 논문",
      label: "Sentence-BERT",
      href: "https://aclanthology.org/D19-1410/",
      note: "siamese·triplet BERT로 독립 sentence embedding을 학습하고 pairwise BERT 계산 구조와 비교",
    },
  ],
  "ai/bi-encoder-retrieval": [
    { kind: "핵심 논문", label: "Sentence-BERT", href: "https://aclanthology.org/D19-1410/", note: "pairwise cross-encoder 비용을 independent sentence embedding과 retrieval로 전환" },
  ],
  "ai/embedding-serving-contract": [
    { kind: "핵심 논문", label: "Text Embeddings by Weakly-Supervised Contrastive Pre-training", href: "https://arxiv.org/abs/2212.03533", note: "query·passage role prefix와 multi-stage contrastive training을 사용한 E5" },
  ],
  "ai/embedding-evaluation": [
    { kind: "Benchmark 논문", label: "MTEB: Massive Text Embedding Benchmark", href: "https://arxiv.org/abs/2210.07316", note: "retrieval·STS·classification·clustering 등 embedding task의 통합 평가" },
  ],
  "ai/domain-finetuning": [
    {
      kind: "핵심 논문",
      label: "Retrieval-Augmented Generation",
      href: "https://arxiv.org/abs/2005.11401",
      note: "외부 retrieval memory와 parametric generation을 결합하는 경계",
    },
    {
      kind: "핵심 논문",
      label: "LoRA",
      href: "https://arxiv.org/abs/2106.09685",
      note: "weight adaptation의 trainable scope를 줄이는 저랭크 update",
    },
  ],
  "ai/continued-pretraining": [
    { kind: "핵심 논문", label: "Don’t Stop Pretraining", href: "https://aclanthology.org/2020.acl-main.740/", note: "DAPT·TAPT corpus와 downstream experiment의 원 연구" },
    { kind: "후속 분석", label: "Catastrophic Forgetting During Continual NMT", href: "https://aclanthology.org/2020.coling-main.381/", note: "순차 domain training의 이전 domain 성능 저하 분석" },
  ],
  "ai/domain-task-finetuning": [
    { kind: "핵심 논문", label: "Training language models to follow instructions with human feedback", href: "https://arxiv.org/abs/2203.02155", note: "Demonstration SFT와 preference pipeline의 학습 경계" },
    { kind: "핵심 논문", label: "LoRA", href: "https://arxiv.org/abs/2106.09685", note: "Full update와 구분되는 low-rank trainable scope" },
  ],
  "ai/domain-data-governance": [
    { kind: "핵심 논문", label: "Datasheets for Datasets", href: "https://arxiv.org/abs/1803.09010", note: "Dataset source·collection·use·maintenance documentation" },
    { kind: "핵심 논문", label: "Model Cards for Model Reporting", href: "https://arxiv.org/abs/1810.03993", note: "Intended use·evaluation slice·limitation reporting" },
  ],
  "ai/compression-pipeline": [
    {
      kind: "보충 읽기",
      label: "The Deep Learning Compiler: A Comprehensive Survey",
      href: "https://arxiv.org/abs/2002.03794",
      note: "model graph 최적화와 hardware backend가 실제 성능에 미치는 영향",
    },
    {
      kind: "공식 가이드",
      label: "MLPerf Inference Benchmark Suite",
      href: "https://docs.mlcommons.org/inference/index_gh/",
      note: "deployment scenario·query scheduling·latency tracking·accuracy validation의 재현 기준",
    },
  ],
  "ai/quantization": [
    {
      kind: "공식 문서",
      label: "Transformer Engine FP8 Current Scaling",
      href: "https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/features/low_precision_training/fp8_current_scaling/fp8_current_scaling.html",
      note: "E4M3·E5M2와 amax 기반 scaling을 affine integer quantizer와 구분하는 공식 설명",
    },
  ],
  "ai/ptq-calibration": [
    { kind: "핵심 논문", label: "SmoothQuant", href: "https://proceedings.mlr.press/v202/xiao23c.html", note: "Activation outlier 난이도를 equivalent scaling으로 이동하는 W8A8 PTQ" },
    { kind: "핵심 논문", label: "AWQ", href: "https://arxiv.org/abs/2306.00978", note: "Activation 크기 기준 channel-wise scaling으로 salient weight를 보호하는 outlier handling" },
],
  "ai/quantization-aware-training": [
    { kind: "핵심 논문", label: "Quantization and Training of Neural Networks", href: "https://arxiv.org/abs/1712.05877", note: "Affine integer quantization과 quantization-aware training의 기준 연구" },
  ],
  "ai/weight-only-quantization": [
    { kind: "핵심 논문", label: "GPTQ", href: "https://arxiv.org/abs/2210.17323", note: "Approximate second-order weight-only PTQ" },
    { kind: "핵심 논문", label: "AWQ", href: "https://arxiv.org/abs/2306.00978", note: "Activation-aware salient weight 보호" },
    { kind: "공식 규격", label: "GGUF specification", href: "https://github.com/ggml-org/ggml/blob/master/docs/gguf.md", note: "Tensor·typed metadata container 규격" },
  ],
  "ai/quantized-model-deployment": [
    { kind: "공식 문서", label: "NVIDIA Transformer Engine FP8 primer", href: "https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/examples/fp8_primer.html", note: "FP8·MXFP8·NVFP4 format과 scaling recipe·지원 경계" },
    { kind: "공식 문서", label: "Safetensors documentation", href: "https://huggingface.co/docs/safetensors/index", note: "Exact tensor dtype·shape·payload ledger를 읽는 checkpoint format" },
  ],
  "ai/pruning": [
    {
      "kind": "공식 가이드",
      "label": "PyTorch Pruning Tutorial",
      "href": "https://docs.pytorch.org/tutorials/intermediate/pruning_tutorial.html",
      "note": "Parameter·mask·pruning reparameterization의 기본 구현 경계"
    }
  ],
  "ai/unstructured-pruning": [
    {
      "kind": "핵심 논문",
      "label": "Movement Pruning",
      "href": "https://arxiv.org/abs/2005.07683",
      "note": "Fine-tuning 중 task-adaptive movement score"
    }
  ],
  "ai/structured-pruning": [
    {
      "kind": "공식 문서",
      "label": "TensorRT Structured Sparsity",
      "href": "https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/advanced.html#structured-sparsity",
      "note": "2:4 eligibility와 실제 tactic 선택 경계"
    },
    { kind: "핵심 논문", label: "Are Sixteen Heads Really Better than One?", href: "https://arxiv.org/abs/1905.10650", note: "Attention head를 20~40%까지 지워도 성능 저하가 크지 않았던 greedy pruning 실험" },
    { kind: "핵심 논문", label: "ShortGPT: Layers in Large Language Models are More Redundant Than You Expect", href: "https://arxiv.org/abs/2403.03853", note: "Block Influence 점수로 25% layer를 지우고 최대 1.49배 속도를 낸 layer pruning" },
    { kind: "핵심 논문", label: "Not All Experts are Equal: Efficient Expert Pruning and Skipping for Mixture-of-Experts Large Language Models", href: "https://arxiv.org/abs/2402.14800", note: "Mixtral 8x7B expert 2~4개 제거의 실제 성능 하락 폭을 보고한 MoE expert pruning" },
    { kind: "핵심 논문", label: "Accelerating Sparse Deep Neural Networks", href: "https://arxiv.org/abs/2104.08378", note: "2:4 structured sparsity에서만 2배 처리량을 내는 Ampere Sparse Tensor Core 조건" },
],
  "ai/one-shot-llm-pruning": [
    {
      "kind": "핵심 논문",
      "label": "SparseGPT",
      "href": "https://arxiv.org/abs/2301.00774",
      "note": "Approximate second-order one-shot layer reconstruction"
    },
    {
      "kind": "핵심 논문",
      "label": "Wanda",
      "href": "https://arxiv.org/abs/2306.11695",
      "note": "Magnitude와 activation norm을 결합한 one-shot score"
    }
  ],
  "ai/pruning-recovery-deployment": [
    {
      "kind": "공식 문서",
      "label": "TensorRT Structured Sparsity",
      "href": "https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/advanced.html#structured-sparsity",
      "note": "Eligible layer·chosen tactic·runtime measurement을 구분하는 배포 근거"
    }
  ],
  "ai/knowledge-distillation": [
    {
      kind: "핵심 논문",
      label: "Distilling the Knowledge in a Neural Network",
      href: "https://arxiv.org/abs/1503.02531",
      note: "temperature를 적용한 teacher soft target 기반 knowledge distillation",
    },
    {
      kind: "핵심 논문",
      label: "FitNets: Hints for Thin Deep Nets",
      href: "https://arxiv.org/abs/1412.6550",
      note: "teacher intermediate representation을 hint로 전달하는 feature distillation",
    },
    { kind: "핵심 논문", label: "Hinton, Vinyals, Dean — Distilling the Knowledge in a Neural Network (MNIST/speech 실험 수치)", href: "https://arxiv.org/abs/1503.02531", note: "MNIST test error 67(large)/146(small baseline)/74(T=20 distilled), speech test frame accuracy 58.9%/61.1%/60.8%·WER 10.9%/10.7%/10.7%" },
],
  "ai/sequence-distillation": [
    {
      kind: "핵심 논문",
      label: "Sequence-Level Knowledge Distillation",
      href: "https://aclanthology.org/D16-1139/",
      note: "teacher가 decoding한 sequence를 student target으로 사용하는 sequence-level distillation",
    },
  ],
  "ai/on-policy-distillation": [
    {
      kind: "핵심 논문",
      label:
        "On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes",
      href: "https://arxiv.org/abs/2306.13649",
      note: "student-generated prefix에서 teacher token distribution을 받는 Generalized KD와 on/off-policy mixture",
    },
    {
      kind: "핵심 논문",
      label:
        "MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training",
      href: "https://arxiv.org/abs/2606.30406",
      note: "domain별 RL teacher를 student on-policy rollout에서 통합하는 multi-teacher distillation",
    },
    {
      kind: "공식 구현",
      label: "Thinking Machines Lab: On-Policy Distillation",
      href: "https://thinkingmachines.ai/blog/on-policy-distillation/",
      note: "student sampling·teacher scoring·per-token reverse KL recipe와 공개 비용 비교",
    },
    {
      kind: "공식 연구",
      label: "Motif 3 Technical Report v1 — Multi-Teacher On-Policy Distillation",
      href: "https://arxiv.org/abs/2608.09119",
      note: "Full-vocabulary teacher distribution 대신 chosen-token log-probability scalar와 ICE-POP filter를 쓰는 Motif-specific MOPD 사례",
    },
  ],
  "ai/self-distillation": [
    {
      kind: "핵심 논문",
      label: "Born Again Neural Networks",
      href: "https://arxiv.org/abs/1805.04770",
      note: "같은 architecture의 teacher–student generation을 반복하는 self-distillation",
    },
  ],
  "ai/rag-pipeline": [
    {
      kind: "핵심 논문",
      label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      href: "https://arxiv.org/abs/2005.11401",
      note: "retriever와 generator를 결합한 RAG의 기준 논문",
    },
    {
      kind: "핵심 논문",
      label: "Lost in the Middle: How Language Models Use Long Contexts",
      href: "https://arxiv.org/abs/2307.03172",
      note: "긴 input의 가운데 놓인 relevant information 활용 저하를 분석",
    },
    {
      kind: "평가 논문",
      label: "Cumulated Gain-based Evaluation of IR Techniques",
      href: "https://doi.org/10.1145/582415.582418",
      note: "Graded relevance와 순위 discount를 결합한 cumulative gain 평가의 정본",
    },
    {
      kind: "평가 논문",
      label: "RAGAS: Automated Evaluation of Retrieval Augmented Generation",
      href: "https://arxiv.org/abs/2309.15217",
      note: "retrieval context와 generated answer를 나눠 평가하는 metric framework",
    },
  ],
  "ai/retrieval-ranking-funnel": [
    { kind: "핵심 논문", label: "Dense Passage Retrieval for Open-Domain Question Answering", href: "https://arxiv.org/abs/2004.04906", note: "질문·passage dual encoder와 dense candidate retrieval의 기준 연구" },
    { kind: "핵심 연구", label: "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods", href: "https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf", note: "서로 다른 ranking을 reciprocal-rank evidence로 합치는 원 연구" },
    { kind: "핵심 논문", label: "Efficient and robust approximate nearest neighbor search using HNSW", href: "https://arxiv.org/abs/1603.09320", note: "Multi-layer proximity graph approximate-neighbor index" },
    { kind: "핵심 논문", label: "Passage Re-ranking with BERT", href: "https://arxiv.org/abs/1901.04085", note: "Query와 passage를 함께 읽는 cross-encoder second-stage reranking" },
    { kind: "핵심 논문", label: "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT", href: "https://arxiv.org/abs/2004.12832", note: "문서 token embedding을 미리 계산해 두고 query token과 MaxSim으로 비교하는 late interaction" },
],
  "ai/lora-finetuning": [
    {
      kind: "핵심 논문",
      label: "LoRA: Low-Rank Adaptation of Large Language Models",
      href: "https://arxiv.org/abs/2106.09685",
      note: "기존 weight를 고정하고 low-rank update만 학습하는 방법",
    },
    {
      kind: "핵심 논문",
      label: "QLoRA: Efficient Finetuning of Quantized LLMs",
      href: "https://arxiv.org/abs/2305.14314",
      note: "4-bit base model과 LoRA를 결합한 메모리 효율적 fine-tuning",
    },
    {
      kind: "공식 문서",
      label: "Hugging Face PEFT — LoRA",
      href: "https://huggingface.co/docs/peft/main/package_reference/lora",
      note: "LoraConfig·target_modules·initialization·merge 관련 현재 구현 옵션",
    },
    {
      kind: "핵심 논문",
      label: "S-LoRA: Serving Thousands of Concurrent LoRA Adapters",
      href: "https://arxiv.org/abs/2311.03285",
      note: "Unified paging과 batched GEMM으로 여러 LoRA adapter를 동시에 서빙하는 방법",
    },
],
  "ai/image-video-lora-architecture": [
    {
      kind: "공식 문서",
      label: "Hugging Face Diffusers — LoRA training",
      href: "https://huggingface.co/docs/diffusers/main/training/lora",
      note: "Text-to-image U-Net 예제의 target module·trainable parameter filtering과 예제 범위",
    },
    {
      kind: "공식 코드",
      label: "LTX-2 trainer — T2V LoRA config",
      href: "https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/configs/t2v_lora.yaml",
      note: "Audio·video·cross-modal attention에 match하는 현재 target pattern과 그 설정의 권장 범위",
    },
    {
      kind: "공식 문서",
      label: "LTX-2 trainer — Training modes guide",
      href: "https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/training-modes.md",
      note: "Generated·frozen modality, clean reference·first-frame condition과 loss 제외 규칙",
    },
    {
      kind: "핵심 논문",
      label: "MotionDirector",
      href: "https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07327.pdf",
      note: "Spatial appearance LoRA와 temporal motion LoRA를 나누는 dual-path 연구",
    },
  ],
  "ai/prompt-engineering": [
    {
      kind: "공식 문서",
      label: "Anthropic — Prompt engineering overview",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
      note: "Success criteria와 empirical test를 prompt tuning보다 먼저 두는 현재 공식 경계",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Prompting best practices",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
      note: "현재 Claude model의 명시적 instruction·example·format guidance와 migration 경계",
    },
  ],
  "ai/prompt-reasoning": [
    {
      kind: "핵심 논문",
      label:
        "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
      href: "https://arxiv.org/abs/2201.11903",
      note: "Worked reasoning demonstration으로 multi-step reasoning을 유도한 조건과 평가 범위",
    },
    {
      kind: "핵심 논문",
      label: "Self-Consistency Improves Chain of Thought Reasoning",
      href: "https://arxiv.org/abs/2203.11171",
      note: "여러 reasoning path를 sampling해 answer frequency로 합치는 decoding estimator",
    },
    {
      kind: "핵심 논문",
      label: "Language Models Don't Always Say What They Think",
      href: "https://arxiv.org/abs/2305.04388",
      note: "Bias intervention으로 Chain-of-Thought explanation의 faithfulness 한계를 측정",
    },
  ],
  "ai/prompt-few-shot": [
    {
      kind: "핵심 논문",
      label: "Language Models are Few-Shot Learners",
      href: "https://arxiv.org/abs/2005.14165",
      note: "in-context learning과 few-shot prompting의 대표 출발점",
    },
    {
      kind: "핵심 논문",
      label: "Calibrate Before Use",
      href: "https://arxiv.org/abs/2102.09690",
      note: "Few-shot prompt format·example·ordering 민감도와 contextual calibration",
    },
  ],
  "ai/prompt-structured-output": [
    {
      kind: "공식 규격",
      label: "JSON Schema Draft 2020-12",
      href: "https://json-schema.org/draft/2020-12",
      note: "JSON document의 구조·type·validation vocabulary를 정의하는 규격 묶음",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Structured outputs",
      href: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
      note: "JSON Schema 기반 constrained decoding의 현재 API·지원 subset·cache 경계",
    },
  ],
  "ai/xml-prompting": [
    {
      kind: "공식 문서",
      label: "Anthropic — Claude prompting best practices",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
      note: "Claude prompt에서 instruction·context·example을 일관된 XML tag로 구획하는 현재 공식 guidance",
    },
    {
      kind: "공식 규격",
      label: "W3C — Extensible Markup Language (XML) 1.0",
      href: "https://www.w3.org/TR/xml/",
      note: "Element·attribute·character data·entity와 well-formedness·DTD validity의 규범적 기준",
    },
    {
      kind: "공식 문서",
      label: "Python documentation — XML vulnerabilities",
      href: "https://docs.python.org/3/library/xml.html#xml-vulnerabilities",
      note: "Python XML parser와 Expat에서 확인해야 할 entity expansion·external entity·resource exhaustion 위험",
    },
    {
      kind: "공식 가이드",
      label: "OWASP — XML External Entity Prevention Cheat Sheet",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html",
      note: "Untrusted XML의 DTD·external entity를 비활성화하는 XXE 방어 원칙과 parser별 설정",
    },
  ],
  "ai/context-engineering": [
    {
      kind: "공식 문서",
      label: "Anthropic — Effective context engineering for AI agents",
      href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      note: "Selection·just-in-time retrieval·compaction·structured note·sub-agent를 context curation 관점에서 설명",
    },
  ],
  "ai/context-instruction-boundaries": [
    {
      kind: "공식 가이드",
      label: "OWASP — LLM Prompt Injection Prevention Cheat Sheet",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html",
      note: "Instruction·external data separation, least privilege, approval와 output monitoring의 defense-in-depth 경계",
    },
  ],
  "ai/context-provenance-freshness": [
    {
      kind: "공식 규격",
      label: "W3C Recommendation — PROV-O",
      href: "https://www.w3.org/TR/prov-o/",
      note: "Entity·Activity·Agent와 generation·use·derivation을 표현하는 provenance interchange model",
    },
  ],
  "ai/agent-memory-lifecycle": [
    {
      kind: "핵심 논문",
      label: "MemGPT: Towards LLMs as Operating Systems",
      href: "https://arxiv.org/abs/2310.08560",
      note: "제한된 context와 외부 storage 사이의 virtual context management",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Managing context on the Claude Developer Platform",
      href: "https://claude.com/blog/context-management",
      note: "Context editing과 file-based memory tool의 제품 경계·내부 평가 조건",
    },
    { kind: "핵심 논문", label: "Generative Agents: Interactive Simulacra of Human Behavior", href: "https://arxiv.org/abs/2304.03442", note: "Memory stream·recency·importance·relevance 가중합 salience scoring과 reflection" },
    { kind: "핵심 논문", label: "Cognitive Architectures for Language Agents", href: "https://arxiv.org/abs/2309.02427", note: "Working·episodic·semantic·procedural memory 구분을 language agent에 대응" },
],
  "ai/context-window-optimization": [
    {
      kind: "핵심 논문",
      label: "Lost in the Middle",
      href: "https://arxiv.org/abs/2307.03172",
      note: "긴 문맥에서 정보 위치에 따라 활용 성능이 달라지는 조건을 측정",
    },
    { kind: "핵심 논문", label: "LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models", href: "https://arxiv.org/abs/2310.05736", note: "작은 model perplexity 기반 token-level 압축, 저자 데이터셋에서 최대 20배 압축·손실 최소 자기보고" },
    { kind: "핵심 논문", label: "LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression", href: "https://arxiv.org/abs/2310.06839", note: "질문 인지 압축·재배치, NaturalQuestions 4배 감소·성능 최대 21.4%↑, LooGLE 비용 94.0%↓ 저자 자기보고" },
],
  "ai/mcp-protocol": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Architecture",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/architecture",
      note: "stateless core와 host·client·server의 현재 책임",
    },
    {
      kind: "공식 연구",
      label: "MCP 2026-07-28 release notes",
      href: "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
      note: "handshake 제거·self-describing request·discovery 변경 요약",
    },
  ],
  "ai/mcp-primitives": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Tools",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools",
      note: "Tool list/call·schema·resultType·MRTR·cache의 현재 계약",
    },
    {
      kind: "공식 규격",
      label: "JSON Schema 2020-12 Core",
      href: "https://json-schema.org/draft/2020-12/json-schema-core",
      note: "MCP schema가 사용하는 JSON instance validation의 구조적 경계",
    },
  ],
  "ai/mcp-transports": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Transports",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports",
      note: "stdio·Streamable HTTP의 배포와 lifecycle 경계",
    },
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Streamable HTTP",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http",
      note: "POST·request-scoped SSE·routing header·cancel·subscription wire semantics",
    },
  ],
  "ai/mcp-server-operations": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Authorization",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization",
      note: "issuer·audience·resource indicator와 remote authorization 경계",
    },
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Changelog",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
      note: "extension·deprecation·migration lifecycle의 revision 근거",
    },
  ],
  "ai/agent-loop-foundations": [
    {
      kind: "핵심 논문",
      label: "ReAct: Synergizing Reasoning and Acting in Language Models",
      href: "https://arxiv.org/abs/2210.03629",
      note: "판단·행동·관찰을 번갈아 수행하는 에이전트 패턴",
    },
  ],
  "ai/agent-plan-replanning": [
    {
      kind: "핵심 논문",
      label: "Reflexion: Language Agents with Verbal Reinforcement Learning",
      href: "https://arxiv.org/abs/2303.11366",
      note: "외부·내부 feedback을 언어적 reflection과 episodic memory로 다음 trial에 전달하는 구조",
    },
  ],
  "ai/agent-delegation-contracts": [
    {
      kind: "공식 가이드",
      label: "Anthropic — Building effective agents",
      href: "https://www.anthropic.com/engineering/building-effective-agents",
      note: "Workflow와 agent의 구분, routing·parallelization·evaluator-optimizer와 단순 구성 원칙",
    },
    {
      kind: "공식 가이드",
      label: "OpenAI — A practical guide to building agents",
      href: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
      note: "Single/multi-agent orchestration·run exit condition·guardrail·human intervention 설계",
    },
  ],
  "ai/agent-extension-boundaries": [
    {
      kind: "공식 가이드",
      label: "Anthropic — Demystifying evals for AI agents",
      href: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      note: "Agent trajectory와 code/model/human grader를 결합하는 평가 경계",
    },
  ],
  "ai/agent-frameworks": [
    {
      kind: "핵심 논문",
      label: "ReAct: Synergizing Reasoning and Acting in Language Models",
      href: "https://arxiv.org/abs/2210.03629",
      note: "tool loop가 따르는 기본 제어 구조",
    },
    {
      kind: "공식 문서",
      label: "LangGraph overview",
      href: "https://docs.langchain.com/oss/python/langgraph/overview",
      note: "durable execution·human-in-the-loop·persistence를 제공하는 현재 runtime",
    },
    {
      kind: "공식 문서",
      label: "LangGraph — Persistence",
      href: "https://docs.langchain.com/oss/python/langgraph/persistence",
      note: "thread별 graph-state checkpoint와 cross-thread application store의 현재 구분",
    },
    {
      kind: "공식 문서",
      label: "LlamaIndex — Agents",
      href: "https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/",
      note: "data·tool·memory를 연결하는 현재 agent workflow",
    },
    {
      kind: "공식 문서",
      label: "AutoGen — AgentChat",
      href: "https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/index.html",
      note: "AgentChat·teams·termination·state의 현재 API 출발점",
    },
    {
      kind: "공식 문서",
      label: "CrewAI — Crews",
      href: "https://docs.crewai.com/en/concepts/crews",
      note: "role-based Crew와 task orchestration의 현재 개념",
    },
    {
      kind: "공식 문서",
      label: "CrewAI — Flows",
      href: "https://docs.crewai.com/en/concepts/flows",
      note: "event-driven state·routing·@persist 기반 resume/fork를 제공하는 현재 Flow runtime",
    },
  ],
  "ai/multi-agent-implementation": [
    {
      kind: "공식 문서",
      label: "LangGraph — Graph API overview",
      href: "https://docs.langchain.com/oss/python/langgraph/graph-api",
      note: "state·node·edge·reducer와 graph runtime의 현재 구성",
    },
    {
      kind: "공식 문서",
      label: "LangGraph — Use the graph API",
      href: "https://docs.langchain.com/oss/python/langgraph/use-graph-api",
      note: "Send 기반 fan-out, parallel branch와 reducer 구현 패턴",
    },
    {
      kind: "공식 문서",
      label: "CrewAI — Crews",
      href: "https://docs.crewai.com/en/concepts/crews",
      note: "agent·task·process로 역할 기반 협업을 구성하는 현재 API",
    },
    {
      kind: "공식 문서",
      label: "CrewAI — Flows",
      href: "https://docs.crewai.com/en/concepts/flows",
      note: "event·state·routing으로 Crew와 일반 코드를 연결하는 workflow 계층",
    },
  ],
  "ai/skills-anatomy": [
    {
      kind: "공식 OpenAI 문서",
      label: "Build skills — Codex",
      href: "https://developers.openai.com/codex/skills/",
      note: "SKILL.md 필수 구조, progressive disclosure, scope와 plugin 배포 규약",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Agent Skills",
      href: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
      note: "SKILL.md·선택적 리소스·progressive disclosure의 공식 구조",
    },
  ],
  "ai/claude-code": [
    {
      kind: "공식 문서",
      label: "Claude Code — How Claude Code works",
      href: "https://code.claude.com/docs/en/how-claude-code-works",
      note: "Model proposal을 context·tool execution·observation·verification에 연결하는 현재 workspace harness 개요",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Tools reference",
      href: "https://code.claude.com/docs/en/tools-reference",
      note: "Built-in tool의 현재 identity·input·effect를 확인하는 reference",
    },
  ],
  "ai/claude-code-instructions-memory": [
    {
      kind: "공식 문서",
      label: "Claude Code — Manage Claude's memory",
      href: "https://code.claude.com/docs/en/memory",
      note: "CLAUDE.md scope·nested loading·auto memory·compaction의 현재 source 계약",
    },
  ],
  "ai/claude-code-subagents": [
    {
      kind: "공식 문서",
      label: "Claude Code — Create custom subagents",
      href: "https://code.claude.com/docs/en/sub-agents",
      note: "별도 context·system prompt·tool scope·permission·main handoff의 현재 계약",
    },
  ],
  "ai/claude-code-permissions": [
    {
      kind: "공식 문서",
      label: "Claude Code — Configure permissions",
      href: "https://code.claude.com/docs/en/permissions",
      note: "Deny→ask→allow rule matching과 hook decision이 결합되는 현재 순서",
    },
  ],
  "ai/claude-code-hooks": [
    {
      kind: "공식 문서",
      label: "Claude Code — Hooks reference",
      href: "https://code.claude.com/docs/en/hooks",
      note: "Lifecycle event·matcher·handler·JSON I/O·exit·timeout의 현재 계약",
    },
  ],
  "ai/claude-code-checkpointing": [
    {
      kind: "공식 문서",
      label: "Claude Code — Checkpointing",
      href: "https://code.claude.com/docs/en/checkpointing",
      note: "Direct file snapshot과 Bash·subagent·remote effect를 구분하는 복구 경계",
    },
  ],
  "ai/qwen-korean-consistency": [
    {
      kind: "공식 문서",
      label: "Qwen3 — Think Deeper, Act Faster",
      href: "https://qwenlm.github.io/blog/qwen3/",
      note: "Qwen3 model family·thinking/non-thinking mode·multilingual capability를 확인하는 공식 release snapshot",
    },
  ],
  "ai/smoothie-qwen-weight-editing": [
    { kind: "핵심 논문", label: "Smoothie-Qwen: Post-Hoc Smoothing to Reduce Language Bias in Multilingual LLMs", href: "https://arxiv.org/abs/2507.05686", note: "Unicode·broken-token risk와 lm_head row scaling을 이용한 post-hoc 방법" },
    { kind: "공식 코드", label: "dnotitia/smoothie-qwen", href: "https://github.com/dnotitia/smoothie-qwen", note: "Risk 분석·scale 설정·weight 변환의 공개 구현" },
  ],
  "ai/qwen-korean-reasoning-posttraining": [
    { kind: "핵심 논문", label: "Making Qwen3 Think in Korean with Reinforcement Learning", href: "https://arxiv.org/abs/2508.10355", note: "한국어 reasoning SFT와 Oracle-Guided Dr.GRPO의 사례 연구" },
  ],
  "ai/claw-overview": clawEvidence(
    {
      kind: "공식 문서",
      label: "Cargo Book — Workspaces",
      href: "https://doc.rust-lang.org/cargo/reference/workspaces.html",
      note: "Workspace member·shared lockfile·target·manifest semantics만 뒷받침하며 Claw의 crate 책임을 보증하지 않음",
    },
    {
      kind: "공식 코드",
      label: "Claw Code companion Python/reference snapshot",
      href: "https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2/src",
      note: "Pinned Python companion/reference artifact이며 canonical Rust runtime의 완전한 명세나 universal oracle은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code deterministic mock parity harness",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/tests/mock_parity_harness.rs",
      note: "Pinned fixture가 관찰하는 deterministic behavior 범위이며 live provider·sandbox·OS·production quality를 보증하지 않음",
    },
  ),
  "ai/claw-cli": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned CLI entry", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/main.rs", note: "REPL·one-shot dispatch와 runtime·renderer 연결의 pinned 범위이며 모든 terminal·crash recovery 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned command registry", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/commands/src/lib.rs", note: "SlashCommandSpec·alias·help와 handler parser surface이며 일반 shell quote grammar 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned terminal renderer", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/render.rs", note: "Markdown parser와 StreamRenderBuffer safe boundary·flush의 실제 source" },
    { kind: "공식 코드", label: "Claw Code pinned repository init", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/init.rs", note: "Create-if-missing·gitignore idempotency artifact이며 transaction·atomic rename·rollback 근거는 아님" },
  ),
  "ai/claw-session": clawEvidence(
    {
      kind: "공식 코드",
      label: "Claw Code pinned session record source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/session.rs",
      note: "Typed message·JSONL append/snapshot·compaction·fork·workspace field의 project artifact이며 완전한 event store 근거는 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned ConversationRuntime source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/conversation.rs",
      note: "User→assistant/tool-use→permission·execution→tool-result의 pinned turn order이며 transactional effect commit 보장은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned SessionStore source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/session_control.rs",
      note: "Workspace namespace·reference resolution·load/fork/delete source이며 durable pause/shutdown·merge 구현 근거는 아님",
    },
    {
      kind: "공식 문서",
      label: "Azure Architecture Center — Event Sourcing pattern",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing",
      note: "Append-only event·derived view·snapshot/replay의 일반 설계 근거이며 Claw JSONL의 구현 인증은 아님",
    },
    {
      kind: "공식 문서",
      label: "AWS Prescriptive Guidance — Transactional outbox",
      href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html",
      note: "Durable record와 external effect의 dual-write crash gap을 다루는 일반 pattern",
    },
    {
      kind: "공식 문서",
      label: "LangGraph — Persistence",
      href: "https://docs.langchain.com/oss/python/langgraph/persistence",
      note: "Checkpoint·pending writes·replay·fork semantics의 비교 근거이며 Claw SessionStore와 같은 구현이라는 뜻은 아님",
    },
  ),
  "ai/claw-tool-system": clawEvidence(
    {
      kind: "공식 코드",
      label: "Claw Code pinned tools registry and dispatch source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs",
      note: "ToolSpec·GlobalToolRegistry·collision·definition·argument-specific permission classification·dispatch의 pinned project artifact",
    },
    {
      kind: "공식 규격",
      label: "JSON Schema Draft 2020-12 — Validation",
      href: "https://json-schema.org/draft/2020-12/json-schema-validation",
      note: "JSON instance의 structural assertion vocabulary이며 domain semantics·authorization·side-effect safety는 별도",
    },
    {
      kind: "공식 규격",
      label: "MCP 2026-07-28 — Tools",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools",
      note: "External Tool discovery·input/output schema·structured result 계약이며 Claw plugin·permission 구현 근거는 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned permission enforcer source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs",
      note: "PermissionEnforcer decision seam의 pinned artifact이며 전체 sandbox·path security 보증은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned plugin tool source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/plugins/src/lib.rs",
      note: "Plugin tool manifest·required permission·command execution source이며 MCP lifecycle·generation pin 보증은 아님",
    },
  ),
  "ai/claw-file-ops": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned file operations", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/file_ops.rs", note: "10 MB·binary·line read, direct write/edit, glob·regex grep와 canonical wrapper의 실제 snapshot" },
    { kind: "공식 문서", label: "Linux man-pages — openat2(2)", href: "https://man7.org/linux/man-pages/man2/openat2.2.html", note: "Dirfd 아래 pathname resolution restrictions의 Linux 근거이며 portable authorization·Claw 구현 완료는 아님" },
    { kind: "공식 문서", label: "MITRE CWE-367 — TOCTOU", href: "https://cwe.mitre.org/data/definitions/367.html", note: "검사와 사용 사이 resource 변경이라는 일반 weakness와 mitigation 경계" },
  ),
  "ai/claw-bash": [
    {
      kind: "공식 코드",
      label: "Claw Code pinned Bash tool dispatch source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs",
      note: "Bash schema·first-token/path permission classifier·optional enforcer·runtime handoff의 pinned artifact이며 full shell semantics나 mandatory enforcement 보증은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned Bash runtime source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/bash.rs",
      note: "Host cwd의 `sh -lc`, timeout·16 KiB truncation·background child PID 구현이며 process-group cleanup·atomic rollback·durable effect receipt는 미증명",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned Bash validation module",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/bash_validation.rs",
      note: "Read-only·destructive·mode·sed·path·intent heuristic module이며 같은 snapshot의 production Bash dispatch integration은 확인되지 않음",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned permission enforcer source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs",
      note: "Policy allowed/denied result와 executor 전 enforcement API의 pinned artifact이며 tools composition에서 optional인 dependency를 필수 보장으로 확대하지 않음",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned Linux sandbox source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/sandbox.rs",
      note: "Util-linux `unshare` probe·namespace launcher·status/fallback 구현이며 filesystem mount enforcement·seccomp·cgroup·VM isolation 근거는 아님",
    },
    {
      kind: "공식 규격",
      label: "POSIX.1-2024 — Shell Command Language",
      href: "https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html",
      note: "Quoting·expansion·redirection·pipeline·compound command가 shell string을 direct argv와 다른 언어로 만드는 표준 semantics",
    },
    {
      kind: "공식 문서",
      label: "MITRE CWE-367 — Time-of-check Time-of-use Race Condition",
      href: "https://cwe.mitre.org/data/definitions/367.html",
      note: "검사한 path/resource와 실제 use 대상이 경쟁 상태에서 달라질 수 있어 canonicalization만으로 부족한 일반 weakness 경계",
    },
    {
      kind: "공식 문서",
      label: "Linux man-pages — setpgid(2)",
      href: "https://man7.org/linux/man-pages/man2/setpgid.2.html",
      note: "Process group·session semantics의 OS 근거이며 pinned Claw timeout path가 descendant signal·wait·cleanup을 구현했다는 증거는 아님",
    },
  ],
  "ai/claw-api-client": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned API client", href: "https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2/rust/crates/api/src", note: "ProviderClient·MessageRequest·StreamEvent·adapter와 cache의 pinned source 범위" },
    { kind: "공식 문서", label: "Anthropic Messages API — Streaming", href: "https://platform.claude.com/docs/en/build-with-claude/streaming", note: "Anthropic SSE event·content block lifecycle의 공식 wire semantics이며 Claw parser 보증은 아님" },
    { kind: "공식 문서", label: "Anthropic — Prompt caching", href: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching", note: "Provider prefix cache와 usage·TTL의 공식 계약이며 local response cache의 안전성 근거는 아님" },
    { kind: "공식 문서", label: "OpenAI — Prompt caching", href: "https://developers.openai.com/api/docs/guides/prompt-caching", note: "OpenAI provider-side prefix reuse와 usage 관찰의 공식 범위" },
  ),
  "ai/claw-config": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned config loader", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/config.rs", note: "USER·PROJECT·LOCAL deep merge와 field provenance의 actual source" },
    { kind: "공식 코드", label: "Claw Code pinned BootstrapPlan", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/bootstrap.rs", note: "Ordered·deduplicated step plan이며 trust-aware execution·readiness·cleanup 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned OAuth helpers", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/oauth.rs", note: "PKCE·state·request·callback parsing과 credentials JSON persistence source" },
    { kind: "공식 코드", label: "Claw Code pinned remote proxy bootstrap", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/remote.rs", note: "Environment·token·CA·URL·proxy subprocess env source이며 session protocol 근거는 아님" },
    { kind: "공식 규격", label: "RFC 7636 — PKCE", href: "https://www.rfc-editor.org/rfc/rfc7636", note: "Verifier·S256 challenge의 protocol 기준" },
    { kind: "공식 규격", label: "RFC 8252 — OAuth 2.0 for Native Apps", href: "https://www.rfc-editor.org/rfc/rfc8252", note: "External browser와 loopback redirect의 native-app profile" },
  ),
  "ai/claw-permissions": clawEvidence(
    {
      kind: "공식 코드",
      label: "Claw Code pinned permission policy source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permissions.rs",
      note: "Mode·rule·context override·prompt 판정 순서의 pinned artifact이며 outer authority ceiling이나 완전한 authorization 보증은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned permission enforcer source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs",
      note: "Allowed·Denied를 executor 앞에서 소비하는 seam이며 optional injection·Prompt deferral·semantic escape 경계를 함께 읽어야 함",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned approval token source",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/approval_tokens.rs",
      note: "Scope·actor·executor·expiry·use count가 있는 in-memory lifecycle이며 runtime dispatch에 연결된 durable approval service라는 뜻은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned tool dispatch permission path",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs",
      note: "Actual argument별 required mode 분류와 optional enforcer 호출의 pinned artifact이며 모든 plugin·MCP path가 같은 enforcement를 거친다는 보장은 아님",
    },
    {
      kind: "공식 문서",
      label: "OpenAI Agents — Guardrails and approvals",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "Tool guardrail과 side-effect approval의 일반 host boundary이며 Claw approval 구현이나 모든 tool type의 동일 coverage를 증명하지 않음",
    },
    {
      kind: "공식 가이드",
      label: "OWASP Cheat Sheet — Authorization",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      note: "Least privilege·deny by default·every-request enforcement·negative test의 일반 기준이며 Claw의 준수 인증은 아님",
    },
  ),
  "ai/claw-hooks": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned hook runner", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/hooks.rs", note: "세 event·matcher·순차 sh -lc subprocess·JSON/stdout/exit 합성·abort polling의 actual source이며 monotonic override·timeout·sandbox·process-tree cleanup 근거는 아님" },
    { kind: "공식 가이드", label: "Linux man-pages — process groups", href: "https://man7.org/linux/man-pages/man2/setpgid.2.html", note: "Descendant job을 group identity로 signal하기 위한 일반 OS lifecycle 근거이며 pinned hook이 이를 구현했다는 뜻은 아님" },
  ),
  "ai/claw-plugin": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned plugins crate", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/plugins/src/lib.rs", note: "PluginKind·manifest validation·registry collision·process execution·init/shutdown의 actual source이며 signature·sandbox·mandatory enforcer·rollback 보장은 아님" },
    { kind: "공식 규격", label: "SLSA v1.2 levels", href: "https://slsa.dev/spec/v1.2/levels", note: "외부 package build provenance의 일반 assurance vocabulary이며 Claw plugin 준수 인증은 아님" },
  ),
  "ai/claw-worker-boot": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned worker boot state machine", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/worker_boot.rs", note: "WorkerStatus·ready gate·prompt attempt·misdelivery replay·StartupEvidenceBundle의 actual snapshot이며 durable registry·real health probe·generation·exactly-once 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned trust resolver", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/trust_resolver.rs", note: "Trust cue·path allow/deny·manual policy의 actual source이며 repository identity·sandbox·capability별 승인 근거는 아님" },
  ),
  "ai/claw-compaction": clawEvidence(
    {
      kind: "공식 코드",
      label: "Claw Code pinned compaction implementation",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/compact.rs",
      note: "메시지 수·근사 token trigger, recent tail과 tool-use/result 경계 보존, 결정적 summary·반복 merge의 실제 snapshot이며 semantic state fidelity 보장은 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned conversation auto-compaction path",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/conversation.rs",
      note: "누적 input-token threshold와 compacted session 교체·health probe의 실제 경로이며 permission·외부 effect rollback이나 summary 의미 검증을 뜻하지 않음",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned context-window recovery path",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/main.rs",
      note: "Context 오류 문자열 분류, reported window의 70% threshold와 4→2→1→0 recent-message retry schedule의 snapshot이며 보편적인 provider 판별법이 아님",
    },
    {
      kind: "공식 코드",
      label: "Claw Code pinned line-based summary compressor",
      href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/summary_compression.rs",
      note: "Whitespace normalization·case-insensitive line dedupe·priority·char/line budget 구현이며 session compaction의 구조화된 fact extractor로 과장하지 않음",
    },
    {
      kind: "공식 연구",
      label: "Anthropic — Effective harnesses for long-running agents",
      href: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      note: "긴 작업에서 상태·artifact·검증 가능한 다음 행동을 남기는 운영 패턴의 공식 사례이며 Claw 구현 근거는 아님",
    },
  ),
  "ai/claw-recovery": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned recovery recipes", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/recovery_recipes.rs", note: "Typed scenario·recipe·attempt ledger의 actual snapshot이며 effect execution·durability·rollback 증거는 아님" },
    { kind: "공식 코드", label: "Claw Code pinned stale branch detector", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/stale_branch.rs", note: "Ahead·behind·missing subject와 policy action의 source 범위" },
    { kind: "공식 가이드", label: "Anthropic — Effective harnesses for long-running agents", href: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "Artifact·progress·verification handoff의 일반 운영 사례이며 Claw 구현 근거는 아님" },
  ),
  "ai/claw-policy-engine": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned policy engine", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/policy_engine.rs", note: "Boolean condition·stable priority·matching action·Chain expansion의 actual source이며 conflict arbitration·immutable provenance·effect enforcement 근거는 아님" },
    { kind: "공식 코드", label: "Claw Code pinned green contract", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/green_contract.rs", note: "Level·passing command·base freshness·recovery context·blocking flake conjunction의 actual source이며 runner·commit provenance 전체를 보증하지 않음" },
  ),
  "ai/claw-task-team": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned TaskPacket", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/task_packet.rs", note: "Task schema·validation·legacy compatibility의 actual source" },
    { kind: "공식 코드", label: "Claw Code pinned task registry", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/task_registry.rs", note: "Registry·lane board·freshness projection이며 distributed transaction 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned team cron registry", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/team_cron_registry.rs", note: "Scheduled record·validation source이며 exactly-once scheduler 근거는 아님" },
    { kind: "공식 가이드", label: "AWS — Transactional outbox", href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html", note: "State·event dual-write 복구의 일반 pattern" },
  ),
  "ai/claw-subagent-orchestration": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned claw-analog agents runner", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/claw-analog/src/agents.rs", note: "Agent spec·permission default·split session·sequential runner actual snapshot" },
    { kind: "공식 가이드", label: "Anthropic multi-agent research system", href: "https://www.anthropic.com/engineering/multi-agent-research-system", note: "Orchestrator-worker research architecture·evaluation 사례이며 Claw parallel runtime 근거는 아님" },
  ),
  "ai/claw-telemetry": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned telemetry crate", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/telemetry/src/lib.rs", note: "Typed event·memory/JSONL sink actual snapshot이며 OTLP·bounded queue·redaction 보장은 아님" },
    { kind: "공식 코드", label: "Claw Code pinned usage ledger", href: "https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/usage.rs", note: "Runtime usage data model source이며 invoice reconciliation 보장은 아님" },
    { kind: "공식 규격", label: "OpenTelemetry specifications", href: "https://opentelemetry.io/docs/specs/", note: "Trace·metric·log과 context propagation 표준" },
    { kind: "공식 규격", label: "OpenTelemetry GenAI semantic conventions", href: "https://opentelemetry.io/docs/specs/semconv/gen-ai/", note: "GenAI attribute vocabulary와 stability/version boundary" },
  ),
  "ai/claw-mcp": clawEvidence(
    { kind: "공식 코드", label: "Claw Code pinned MCP stdio and bridge", href: "https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src", note: "mcp*.rs의 initialize·Content-Length frame·JSON-RPC ID·discovery·bridge·shutdown actual source이며 최신 MCP revision 호환이나 lifecycle full integration 보장은 아님" },
    { kind: "공식 문서", label: "MCP 2026-07-28 specification announcement", href: "https://blog.modelcontextprotocol.io/posts/2026-07-28/", note: "해당 revision의 protocol 변경을 확인하는 공식 기록이며 pinned Claw commit의 구현 근거는 아님" },
    { kind: "공식 규격", label: "MCP 2026-07-28 transports", href: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports", note: "링크된 revision의 standard transport boundary이며 pinned Content-Length helper가 표준이라는 뜻은 아님" },
    { kind: "공식 규격", label: "MCP 2026-07-28 tools", href: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools", note: "링크된 revision의 tool discovery·invocation contract이며 server implementation·permission safety를 보장하지 않음" },
  ),
  "ai/agent-devlog-patterns": [
    {
      kind: "공식 규격",
      label: "W3C PROV Overview",
      href: "https://www.w3.org/TR/prov-overview/",
      note: "Entity·activity·agent와 생성·사용·귀속 관계로 evidence provenance를 표현하는 표준 모델",
    },
    {
      kind: "프로젝트 실측",
      label: "개인 context-manager 개발 기록",
      note: "Changelog·ADR·Lessons의 질문별 정본과 조건부 승격을 운영한 고정 사례이며 보편 표준이 아님",
    },
  ],
  "ai/agent-changelog-evidence": [
    { kind: "공식 가이드", label: "Keep a Changelog 1.1.0", href: "https://keepachangelog.com/en/1.1.0/", note: "사람이 읽는 notable-change 목록, 날짜·version·linkable section·Unreleased convention" },
    { kind: "프로젝트 실측", label: "Empty compaction guard change fixture", note: "run·commit·test·ADR link를 분리해 보여 주는 고정 학습 사례이며 보편 release format은 아님" },
  ],
  "ai/architecture-decision-records": [
    { kind: "보충 읽기", label: "Michael Nygard — Documenting Architecture Decisions", href: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions", note: "Significant decision의 title·status·context·decision·consequences와 superseding history" },
    { kind: "프로젝트 실측", label: "Profile storage ADR fixture", note: "Single JSON·profile files·database를 같은 driver로 비교하는 학습 사례이며 최적 storage 권고는 아님" },
  ],
  "ai/engineering-lessons-ledger": [
    { kind: "공식 가이드", label: "Google SRE Workbook — Postmortem Culture", href: "https://sre.google/workbook/postmortem-culture/", note: "Blameless incident analysis, complete data, measurable preventive action·owner·review" },
    { kind: "프로젝트 실측", label: "Derived empty state guardrail fixture", note: "Scope·exception·test·revisit가 있는 provisional lesson 예시이며 모든 AI output에 적용하는 보편 rule은 아님" },
  ],
  "ai/openclaw-assistant": [
    {
      kind: "공식 문서",
      label: "OpenClaw — Gateway architecture",
      href: "https://docs.openclaw.ai/concepts/architecture",
      note: "Channel·client·node를 한 Gateway가 받는 typed event와 reply/idempotency 경계",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Agent bindings",
      href: "https://docs.openclaw.ai/concepts/agent-bindings",
      note: "Channel/account/peer specificity와 config order로 agent를 고르는 현재 routing 규칙",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Session management",
      href: "https://docs.openclaw.ai/concepts/session",
      note: "DM scope·group/room/cron session·identity link·reply docking과 persistence 경계",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Agent runtimes",
      href: "https://docs.openclaw.ai/concepts/agent-runtimes",
      note: "Provider/model resolution 뒤 runtime policy·plugin claim·generic auto fallback·OpenAI unset/auto Codex 예외·explicit fail-closed 선택",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Agent runtime architecture",
      href: "https://docs.openclaw.ai/agent-runtime-architecture",
      note: "Built-in `openclaw`, legacy `pi` alias, runtime generation과 package resource manifest",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Plugin runtime helpers",
      href: "https://docs.openclaw.ai/plugins/sdk-runtime",
      note: "`runEmbeddedAgent(...)`와 deprecated `runEmbeddedPiAgent(...)` compatibility alias의 현재 SDK 경계",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Skills",
      href: "https://docs.openclaw.ai/tools/skills",
      note: "Skill loading precedence·scope·eligibility·session-start snapshot·next-turn refresh·ClawHub verification·secret/trust 주의",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Sandboxing",
      href: "https://docs.openclaw.ai/gateway/sandboxing",
      note: "Tool policy·sandbox mode/scope/backend·elevated escape path와 Gateway host 경계",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Gateway security",
      href: "https://docs.openclaw.ai/gateway/security",
      note: "한 trusted operator/gateway 보안 모델, sessionKey의 routing-only 의미와 tenant 분리 원칙",
    },
    {
      kind: "공식 문서",
      label: "OpenClaw — Gateway protocol",
      href: "https://docs.openclaw.ai/gateway/protocol",
      note: "Typed WebSocket·side-effect idempotency, outbound sent/failed/unknown·ack/dead-letter/reconciliation, bounded audit와 rejected request non-replay 경계",
    },
  ],
  "ai/mixture-of-experts": [
    {
      kind: "핵심 논문",
      label: "Sparsely-Gated Mixture-of-Experts",
      href: "https://arxiv.org/abs/1701.06538",
      note: "Sparse gate·Top-k mixture·load balancing·expert parallelism의 출발점",
    },
    {
      kind: "핵심 논문",
      label: "GShard",
      href: "https://arxiv.org/abs/2006.16668",
      note: "Transformer MoE와 compiler-driven automatic sharding의 대규모 실험",
    },
    {
      kind: "핵심 논문",
      label: "Switch Transformers",
      href: "https://arxiv.org/abs/2101.03961",
      note: "Top-1 routing·capacity·training stability를 단순화한 sparse Transformer",
    },
    {
      kind: "핵심 논문",
      label: "DeepSeekMoE",
      href: "https://arxiv.org/abs/2401.06066",
      note: "Fine-grained routed expert와 shared expert isolation의 공식 제안",
    },
  ],
  "ai/kimi-k3-architecture": [
    source("공식 코드", KIMI_K3_SOURCE, "model summary·weights·technical report"),
    {
      kind: "핵심 논문",
      label: "Kimi K3: Open Frontier Intelligence",
      href: "https://arxiv.org/abs/2607.24653",
      note: "전체 configuration과 sequence·depth·width 통합 scaling claim",
    },
  ],
  "ai/kimi-k3-sequence-mixer": [
    {
      kind: "핵심 논문",
      label: "Kimi Linear",
      href: "https://arxiv.org/abs/2510.26692",
      note: "KDA recurrence·bounded decay·chunk algorithm·hybrid schedule",
    },
    source("공식 코드", KIMI_K3_SOURCE, "K3 69 KDA·24 Gated MLA configuration"),
  ],
  "ai/kimi-k3-depth-routing": [
    {
      kind: "핵심 논문",
      label: "Attention Residuals",
      href: "https://arxiv.org/abs/2603.15031",
      note: "Depth pseudo-query와 Full·Block AttnRes 방법·복잡도·실험",
    },
    source("공식 코드", KIMI_K3_SOURCE, "K3 93-layer·8-block integration"),
  ],
  "ai/kimi-k3-latent-moe": [
    {
      kind: "핵심 논문",
      label: "Kimi K3: Stable LatentMoE",
      href: "https://arxiv.org/abs/2607.24653",
      note: "Latent width·SiTU-GLU·RMSNorm·Quantile Balancing",
    },
    source("공식 코드", KIMI_K3_SOURCE, "K3 896/16 routed·2 shared expert configuration"),
  ],
  "ai/kv-cache-fundamentals": [
    {
      kind: "핵심 논문",
      label:
        "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints",
      href: "https://arxiv.org/abs/2305.13245",
      note: "여러 query head가 더 적은 KV head를 공유하는 GQA의 정의와 품질·속도 절충",
    },
    {
      kind: "핵심 논문",
      label: "Fast Transformer Decoding: One Write-Head is All You Need",
      href: "https://arxiv.org/abs/1911.02150",
      note: "모든 query head가 하나의 K/V head를 공유하는 MQA와 decode memory-bandwidth 문제",
    },
  ],
  "ai/hybrid-kv-cache-allocation": [
    {
      kind: "핵심 논문",
      label:
        "Efficient Memory Management for Large Language Model Serving with PagedAttention",
      href: "https://arxiv.org/abs/2309.06180",
      note: "KV cache를 fixed-size physical block과 logical block table로 관리해 fragmentation과 sharing을 다루는 vLLM의 핵심 방법",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Hybrid KV Cache Manager",
      href: "https://github.com/vllm-project/vllm/blob/main/docs/design/hybrid_kv_cache_manager.md",
      note: "kv hidden size·page size 정의와 full·sliding-window layer별 block 할당 설계",
    },
    {
      kind: "공식 코드",
      label: "vLLM — KV cache interface",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/kv_cache_interface.py",
      note: "hybrid allocator 비활성 시 sliding-window layer를 full-attention allocation으로 다루는 구현 경로",
    },
  ],
  "ai/llm-serving-capacity": [
    {
      kind: "공식 문서",
      label: "Meta — Muse Glimmer 30B model card",
      href: "https://huggingface.co/meta-models/Muse-Glimmer-30B",
      note: "52-layer Local×3+Global 구조, Q 32·KV 2·head_dim 128, 131,072 context",
    },
    {
      kind: "공식 문서",
      label: "Google DeepMind — Gemma 4 31B IT model card",
      href: "https://huggingface.co/google/gemma-4-31B-it",
      note: "60-layer Local×5+Global 구조, local KV 16·global KV 4와 layer별 head dimension",
    },
    {
      kind: "핵심 논문",
      label: "Gemma 4 Technical Report",
      href: "https://arxiv.org/abs/2607.02770",
      note: "Gemma 4 architecture와 efficiency·reasoning 평가의 공식 기술 보고서",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Benchmarking CLI",
      href: "https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md",
      note: "KV cache size, max model length와 theoretical maximum concurrency의 관계",
    },
    {
      kind: "구현 이슈",
      label: "vLLM — Hybrid model KV cache log discrepancy",
      href: "https://github.com/vllm-project/vllm/issues/40691",
      note: "Qwen3.5에서 표시 token 수와 concurrency가 서로 다른 기준으로 계산된 사례",
    },
    {
      kind: "구현 이슈",
      label: "vLLM — Gemma 4 KV cache capacity reporting",
      href: "https://github.com/vllm-project/vllm/issues/39133",
      note: "Gemma 4 hybrid attention에서 token count가 실제 capacity를 과소 표시한 사례",
    },
    {
      kind: "프로젝트 실측",
      label: "Qwen 27B · Gemma 4 31B · Muse Glimmer 30B KV capacity 관측",
      note: "동일 max_model_len 65,536에서 KV 97,216·88,824·352,736과 concurrency 5.17×·1.36×·5.38×. Qwen 행은 두 로그의 token 단위가 일치하지 않으므로 별도 해석",
    },
  ],
  "ai/grammar-constrained-generation": [
    { kind: "핵심 논문", label: "XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models", href: "https://arxiv.org/abs/2411.15100", note: "Context-independent token 사전 분류와 CFG stack 재사용으로 constrained decoding overhead를 줄이는 엔진" },
],
  "ai/cfg-pushdown-automata": [],
  "ai/incremental-parsing-tree-sitter": [
    {
      kind: "공식 문서",
      label: "Tree-sitter documentation",
      href: "https://tree-sitter.github.io/tree-sitter/",
      note: "incremental parser와 concrete syntax tree의 공식 경계",
    },
  ],
  "ai/grammar-tokenizer-decoding": [
    {
      kind: "공식 문서",
      label: "XGrammar — Constrained Decoding",
      href: "https://xgrammar.mlc.ai/docs/start/constrained_decoding.html",
      note: "grammar compile·matcher state·token mask의 공식 API",
    },
  ],
  "ai/structured-generation-serving": [
    {
      kind: "핵심 논문",
      label: "XGrammar 2",
      href: "https://arxiv.org/abs/2601.04426",
      note: "agentic structured generation의 동적 schema와 cache 경계",
    },
  ],
  "ai/sparse-autoencoder": [
    {
      kind: "핵심 연구",
      label: "Towards Monosemanticity",
      href: "https://transformer-circuits.pub/2023/monosemantic-features",
      note: "Sparse autoencoder로 language model activation feature를 분해한 초기 연구",
    },
    {
      kind: "핵심 연구",
      label: "Toy Models of Superposition",
      href: "https://transformer-circuits.pub/2022/toy_model",
      note: "제한된 dimension에 더 많은 feature가 겹쳐 표현될 수 있다는 가설과 toy model",
    },
    {
      kind: "핵심 연구",
      label: "Scaling Monosemanticity",
      href: "https://transformer-circuits.pub/2024/scaling-monosemanticity",
      note: "Claude 3 Sonnet의 대규모 SAE와 feature steering 실험",
    },
    {
      kind: "공식 연구",
      label: "Google DeepMind — Gemma Scope",
      href: "https://deepmind.google/blog/gemma-scope-helping-the-safety-community-shed-light-on-the-inner-workings-of-language-models/",
      note: "Gemma 2의 layer·sublayer별 SAE 공개와 JumpReLU 설명",
    },
    {
      kind: "공식 연구",
      label: "OpenAI — Extracting Concepts from GPT-4",
      href: "https://openai.com/index/extracting-concepts-from-gpt-4/",
      note: "GPT-4 activation에 학습한 1,600만 latent SAE와 한계",
    },
    {
      kind: "핵심 논문",
      label: "Scaling and Evaluating Sparse Autoencoders",
      href: "https://arxiv.org/abs/2406.04093",
      note: "Top-K sparsity·dead latent 완화·reconstruction과 feature quality scaling 평가",
    },
    {
      kind: "핵심 논문",
      label: "Gemma Scope: Open Sparse Autoencoders Everywhere All At Once",
      href: "https://arxiv.org/abs/2408.05147",
      note: "Gemma 2 layer·sublayer별 JumpReLU SAE와 표준 품질 지표를 공개한 논문",
    },
    {
      kind: "핵심 논문",
      label: "Improving Dictionary Learning with Gated Sparse Autoencoders",
      href: "https://arxiv.org/abs/2404.16014",
      note: "Feature 선택과 activation 크기 추정을 분리해 L1 shrinkage를 줄인 방법",
    },
  ],
  "ai/llm-serving-ops": [
    {
      kind: "핵심 논문",
      label: "A Proof for the Queuing Formula: L = λW",
      href: "https://pubsonline.informs.org/doi/10.1287/opre.9.3.383",
      note: "안정된 queue boundary의 평균 in-flight·effective arrival·sojourn-time 관계와 전제",
    },
    {
      kind: "공식 문서",
      label: "LiteLLM — Reliability와 Router",
      href: "https://docs.litellm.ai/docs/proxy/reliability",
      note: "retry·fallback·context-window fallback과 gateway reliability의 현재 설정 범위",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA GPU Operator",
      href: "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/",
      note: "driver·device plugin·GPU Feature Discovery·DCGM component 경계",
    },
    {
      kind: "공식 문서",
      label: "Kubernetes — Horizontal Pod Autoscaling",
      href: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
      note: "custom metric·readiness·scaling behavior와 stabilization window",
    },
    {
      kind: "공식 문서",
      label: "Kubernetes — Liveness, Readiness, Startup Probes",
      href: "https://kubernetes.io/docs/concepts/workloads/pods/probes/",
      note: "startup gating·readiness EndpointSlice 제외·liveness restart의 서로 다른 의미",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Production Metrics",
      href: "https://docs.vllm.ai/en/stable/usage/metrics/",
      note: "TTFT·queue time·KV cache usage·preemption 등 현재 metric 이름",
    },
    {
      kind: "공식 문서",
      label: "Google SRE Workbook — Alerting on SLOs",
      href: "https://sre.google/workbook/alerting-on-slos/",
      note: "error-budget burn rate와 multiwindow·multi-burn-rate alert 설계",
    },
    {
      kind: "공식 문서",
      label: "Google SRE Workbook — Canarying Releases",
      href: "https://sre.google/workbook/canarying-releases/",
      note: "Canary population·evaluation·rollout과 자동 분석의 운영 경계",
    },
  ],
  "ai/vllm-serving": [
    {
      kind: "선행·비교 논문",
      label:
        "Orca: A Distributed Serving System for Transformer-Based Generative Models",
      href: "https://www.usenix.org/conference/osdi22/presentation/yu",
      note: "vLLM 내부 구성 요소가 아닌 별도 선행 system으로서 iteration-level scheduling과 selective batching의 출발점을 제공",
    },
    {
      kind: "핵심 논문",
      label: "Efficient Memory Management for LLM Serving with PagedAttention",
      href: "https://arxiv.org/abs/2309.06180",
      note: "PagedAttention·continuous batching과 원 논문의 memory-management 문제 정의",
    },
    {
      kind: "공식 문서",
      label: "vLLM V1 Guide",
      href: "https://docs.vllm.ai/en/stable/usage/v1_guide/",
      note: "통합 scheduler와 현재 V1 architecture의 지원·변경 범위",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Parallelism and Scaling",
      href: "https://docs.vllm.ai/en/stable/serving/parallelism_scaling/",
      note: "tensor·pipeline parallel과 single/multi-node 실행 방식",
    },
    {
      kind: "공식 코드",
      label: "vLLM V1 Engine Core",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/engine/core.py",
      note: "scheduler와 model executor를 연결하는 현재 engine loop",
    },
  ],
  "ai/vllm-scheduler": [
    {
      kind: "선행·비교 논문",
      label:
        "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve",
      href: "https://arxiv.org/abs/2403.02310",
      note: "Chunked prefill·stall-free scheduling과 throughput-tail-latency tradeoff",
    },
    {
      kind: "선행·비교 논문",
      label: "Fast Distributed Inference Serving for Large Language Models",
      href: "https://arxiv.org/abs/2305.05920",
      note: "Token-boundary preemption·skip-join MLFQ와 state offload 설계 공간",
    },
    {
      kind: "공식 문서",
      label: "vLLM V1 Guide — Unified Scheduler",
      href: "https://docs.vllm.ai/en/stable/usage/v1_guide/",
      note: "prefill·decode를 token budget으로 통합한 현재 V1 설명",
    },
    {
      kind: "공식 코드",
      label: "vLLM V1 Scheduler",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py",
      note: "RUNNING·WAITING admission, token budget, KV allocation과 preemption 경로",
    },
    {
      kind: "공식 코드",
      label: "vLLM SchedulerConfig",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/config/scheduler.py",
      note: "max_num_batched_tokens·policy·chunked prefill 설정의 현재 계약",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Production Metrics",
      href: "https://docs.vllm.ai/en/stable/usage/metrics/",
      note: "queue time·preemption·KV cache pressure를 검증할 운영 metric",
    },
    { kind: "선행·비교 논문", label: "Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)", href: "https://www.usenix.org/conference/osdi22/presentation/yu", note: "Request-level batching 의 두 대기와 iteration-level scheduling·selective batching, 36.9× 는 저자 자기보고" },
    { kind: "선행·비교 논문", label: "Fairness in Serving Large Language Models (VTC)", href: "https://arxiv.org/abs/2401.00588", note: "Token 단위 fairness 정의, Virtual Token Counter 와 backlogged client 간 2× service 차이 상한" },
    { kind: "공식 문서", label: "vLLM Engine Arguments — --async-scheduling · --scheduling-policy", href: "https://docs.vllm.ai/en/latest/configuration/engine_args.html", note: "Async scheduling 이 GPU 점유의 빈틈을 없앤다는 설명과 fcfs·priority 정책의 계약" },
    { kind: "공식 문서", label: "vLLM Optimization and Performance — engine core CPU starvation", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "Engine core 가 busy loop 라 CPU 를 빼앗기면 크게 느려진다는 경고와 max_num_batched_tokens 의 ITL 안내" },
    { kind: "공식 코드", label: "vLLM V1 request queue: vllm/v1/core/sched/request_queue.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/request_queue.py", note: "FCFS deque 와 priority heap 두 queue discipline 과 preempt 된 요청의 재삽입 규칙" },
],
  "ai/vllm-paged-attention": [
    {
      kind: "핵심 논문",
      label: "Efficient Memory Management for LLM Serving with PagedAttention",
      href: "https://arxiv.org/abs/2309.06180",
      note: "logical·physical KV block mapping과 sharing의 원 논문",
    },
    {
      kind: "선행·비교 논문",
      label:
        "SGLang: Efficient Execution of Structured Language Model Programs",
      href: "https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf",
      note: "RadixAttention의 automatic KV prefix reuse와 cache-aware scheduling 대안",
    },
    {
      kind: "공식 코드",
      label: "vLLM V1 BlockPool",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py",
      note: "free queue·reference count·prefix-cache eviction의 현재 구현",
    },
    {
      kind: "공식 코드",
      label: "vLLM V1 KVCacheManager",
      href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_manager.py",
      note: "scheduler가 사용하는 cache lookup·allocation·free interface",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Automatic Prefix Caching",
      href: "https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/",
      note: "공유 prefix workload와 prefill에만 적용되는 효과 범위",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Automatic Prefix Caching Design",
      href: "https://docs.vllm.ai/en/latest/design/v1/prefix_caching/",
      note: "Parent hash·token block·extra identity와 full-block cache key semantics",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Metrics design (prefix_cache_queries · prefix_cache_hits)",
      href: "https://docs.vllm.ai/en/latest/design/metrics/",
      note: "token 단위 query·hit counter와 최근 1k query 구간 hit rate 정의",
    },
],
  "ai/vllm-spec-decode": [
    {
      kind: "핵심 논문",
      label: "Fast Inference from Transformers via Speculative Decoding",
      href: "https://arxiv.org/abs/2211.17192",
      note: "target 분포를 보존하는 draft·verification·rejection sampling",
    },
    {
      kind: "핵심 논문",
      label:
        "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty",
      href: "https://arxiv.org/abs/2401.15077",
      note: "target hidden state를 이용한 feature-level speculation",
    },
    {
      kind: "핵심 논문",
      label: "Better & Faster Large Language Models via Multi-token Prediction",
      href: "https://arxiv.org/abs/2404.19737",
      note: "shared trunk의 여러 future-token head를 함께 학습하는 MTP objective와 inference 활용",
    },
    {
      kind: "선행·비교 논문",
      label: "SpecInfer: Accelerating LLM Serving with Speculative Inference",
      href: "https://arxiv.org/abs/2305.09781",
      note: "tree 기반 후보 생성과 verification을 서빙 관점에서 확장",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Speculative Decoding",
      href: "https://docs.vllm.ai/en/stable/features/speculative_decoding/",
      note: "EAGLE·MTP·draft·n-gram 등 현재 지원 방식과 적용 조건",
    },
    {
      kind: "공식 문서",
      label: "vLLM — Dynamic Speculative Decoding",
      href: "https://docs.vllm.ai/en/latest/features/speculative_decoding/dynamic_speculative_decoding/",
      note: "동시성 구간에 따라 speculation depth를 조절하는 현재 기능",
    },
    {
      kind: "공식 문서",
      label: "vLLM — MTP speculative decoding",
      href: "https://docs.vllm.ai/en/latest/features/speculative_decoding/mtp/",
      note: "native MTP family 지원 조건과 num_speculative_tokens 설정의 현재 경계",
    },
    {
      kind: "핵심 논문",
      label: "Accelerating Large Language Model Decoding with Speculative Sampling",
      href: "https://arxiv.org/abs/2302.01318",
      note: "K token 병렬 scoring이 한 step과 비슷하다는 memory-bound 근거와 modified rejection sampling 알고리즘",
    },
],
  "ai/llm-harness": [
    {
      kind: "공식 문서",
      label: "Anthropic — Building effective agents",
      href: "https://www.anthropic.com/engineering/building-effective-agents",
      note: "workflow와 agent 구분, 단순한 구조에서 복잡성을 늘리는 선택 기준",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Writing effective tools for AI agents",
      href: "https://www.anthropic.com/engineering/writing-tools-for-agents",
      note: "실제 workload eval, 명확한 tool boundary, high-signal result와 raw transcript 점검",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Demystifying evals for AI agents",
      href: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      note: "Stable environment, grader·transcript·tool-call·latency를 함께 보는 agent eval harness",
    },
    {
      kind: "프로젝트 실측",
      label: "Office Secretary — Claude artifact accuracy methods",
      href: "https://github.com/dik654/ojs-agents/blob/c6b0fb756aa66a33e9f0b1cd4a53c2ee1202a618/products/office-secretary/experiments/CLAUDE_ARTIFACT_ACCURACY_METHODS.md",
      note: "Claude 로컬 산출물에서 추출한 typed artifact·independent check·targeted repair 패턴과 Qwen held-out 적용 범위",
    },
    {
      kind: "프로젝트 실측",
      label: "Office Secretary — Model size decision",
      href: "https://github.com/dik654/ojs-agents/blob/c6b0fb756aa66a33e9f0b1cd4a53c2ee1202a618/products/office-secretary/experiments/MODEL_SIZE_DECISION.md",
      note: "Raw model strict-count와 deterministic agent contract를 분리한 2026-08-21 controlled fixture",
    },
  ],
  "ai/agent-run-contract": [
    {
      kind: "공식 문서",
      label: "OpenAI Agents SDK — Guardrails and human review",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "Input/output/tool guardrail과 side effect 전 human approval의 공식 runtime control 경계",
    },
  ],
  "ai/agent-verification": [
    {
      kind: "공식 문서",
      label: "OpenAI Agents SDK — Guardrails and human review",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "결정적 guardrail·승인·runtime observation을 model 판단과 분리하는 근거",
    },
  ],
  "ai/harness-failure-ablation": [
    {
      kind: "공식 문서",
      label: "Anthropic — Harness design for long-running apps",
      href: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      note: "planner·generator·evaluator 구조와 구성 요소 ablation",
    },
  ],
  "ai/agent-control-boundaries": [
    {
      kind: "공식 문서",
      label: "Anthropic — Building effective agents",
      href: "https://www.anthropic.com/engineering/building-effective-agents",
      note: "workflow와 agent를 성숙도 순서가 아니라 제어 방식으로 구분하는 근거",
    },
    {
      kind: "보충 읽기",
      label: "LangChain — The art of loop engineering",
      href: "https://www.langchain.com/blog/the-art-of-loop-engineering",
      note: "agent·verification·event-driven·hill-climbing loop라는 최근 운영 어휘",
    },
  ],
  "ai/agent-code-mode": [
    {
      kind: "공식 문서",
      label: "Anthropic — Code execution with MCP",
      href: "https://www.anthropic.com/engineering/code-execution-with-mcp",
      note: "중간 tool 결과를 sandbox 안에서 처리하는 패턴",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — Code Mode for MCP",
      href: "https://blog.cloudflare.com/code-mode-mcp/",
      note: "MCP binding과 sandbox program 실행",
    },
    { kind: "핵심 논문", label: "CodeAct: Executable Code Actions Elicit Better LLM Agents", href: "https://arxiv.org/abs/2402.01030", note: "여러 tool 호출을 하나의 실행 가능한 program으로 합성하는 code-as-action 제안" },
],
  "ai/code-mode-runtime-contracts": [
    {
      kind: "공식 문서",
      label: "TanStack AI — Code Mode",
      href: "https://tanstack.com/ai/latest/docs/code-mode/code-mode",
      note: "typed tool program과 runtime integration의 구현 범위",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — Code Mode for MCP",
      href: "https://blog.cloudflare.com/code-mode-mcp/",
      note: "MCP capability를 sandbox binding으로 노출하는 구현 사례",
    },
  ],
  "ai/agent-sandbox-security": [
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.linuxNamespaces,
      "Process별 PID·mount·network·user resource view",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.linuxCgroupV2,
      "CPU·memory·PID·I/O resource budget",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.linuxCapabilities,
      "Container root와 capability privilege 경계",
    ),
  ],
  "ai/sandbox-runtime-isolation": [
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.gvisorSecurity,
      "Sentry application-kernel mediation과 host interface",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.kataVirtualization,
      "Guest-kernel·VMM 기반 runtime isolation",
    ),
  ],
  "ai/sandbox-gpu-isolation": [
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.gvisorGpu,
      "nvproxy GPU ioctl mediation과 support matrix",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.kataGpu,
      "VFIO·IOMMU 기반 Kata GPU assignment",
    ),
  ],
  "ai/sandbox-deployment-controls": [
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.networkPolicy,
      "표준 Kubernetes ingress/egress isolation과 additive allow semantics",
    ),
    source("공식 문서", AGENT_SECURITY_SOURCES.ciliumDns, "FQDN egress policy"),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.serviceAccounts,
      "Workload identity와 token 자동 mount 경계",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.podSecurity,
      "Pod privilege·user·seccomp 기본 경계",
    ),
  ],
  "ai/sionic-eureka": [
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.e5,
      "task taxonomy에서 query-document pair를 합성하는 baseline",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.gecko,
      "LLM-generated passage와 retrieval relabeling 기반 distillation",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.qwen,
      "다국어·다도메인 synthetic data와 multi-stage embedding training",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.positionBias,
      "정답 위치 편향의 근거",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.nvRetriever,
      "positive-aware hard-negative mining",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.multiPositive,
      "query와 positive의 다대다 라벨",
    ),
    source(
      "핵심 논문",
      EUREKA_SOURCE_LINKS.distillation,
      "temperature와 KL 기반 soft-target distillation의 일반 원리",
    ),
    {
      kind: "프로젝트 실측",
      label: "SionicAI EUREKA 내부 ablation",
      note: "공개되지 않은 사내 retrieval 종합 점수와 실험 조건",
    },
  ],
  "ai/sionic-glm-b300": [
    source(
      "핵심 논문",
      GLM_B300_SOURCE_LINKS.roofline,
      "arithmetic intensity와 compute·memory 성능 상한",
    ),
    source(
      "핵심 논문",
      GLM_B300_SOURCE_LINKS.mtpPaper,
      "multi-token prediction과 self-speculative decoding의 일반 원리",
    ),
    source("공식 문서", GLM_B300_SOURCE_LINKS.model, "모델 구조와 배포 가중치"),
    source(
      "공식 문서",
      GLM_B300_SOURCE_LINKS.tcgen05,
      "Blackwell tensor-core programming model",
    ),
    source("공식 문서", GLM_B300_SOURCE_LINKS.sglang, "runtime 통합 기준"),
    {
      kind: "프로젝트 실측",
      label: "SionicAI B300 TP8 · batch 1 측정",
      note: "kernel µs·bandwidth·acceptance length·tok/s는 이 환경에 귀속",
    },
  ],
  "ai/dezero-autodiff": [
    {
      kind: "공식 코드",
      label: "Deep Learning from Scratch 3 — DeZero",
      href: "https://github.com/oreilly-japan/deep-learning-from-scratch-3",
      note: "동적 계산 그래프와 고차 미분을 단계적으로 구현하는 원 프로젝트",
    },
    {
      kind: "공식 문서",
      label: "PyTorch — Autograd mechanics",
      href: "https://docs.pytorch.org/docs/stable/notes/autograd.html",
      note: "동적 그래프, saved tensor, gradient mode의 실제 프레임워크 계약",
    },
    {
      kind: "핵심 논문",
      label:
        "Chainer: A Deep Learning Framework for Accelerating the Research Cycle",
      href: "https://arxiv.org/abs/1710.06789",
      note: "define-by-run 방식의 동적 계산 그래프를 설명하는 대표 연구",
    },
  ],
  "ai/dezero-nn": [
    {
      kind: "핵심 논문",
      label:
        "Understanding the Difficulty of Training Deep Feedforward Neural Networks",
      href: "https://proceedings.mlr.press/v9/glorot10a.html",
      note: "sigmoid 포화와 Xavier initialization을 분석한 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "Adam: A Method for Stochastic Optimization",
      href: "https://arxiv.org/abs/1412.6980",
      note: "1차·2차 모멘트, bias correction과 Adam update 규칙",
    },
    {
      kind: "핵심 논문",
      label: "Decoupled Weight Decay Regularization",
      href: "https://arxiv.org/abs/1711.05101",
      note: "AdamW가 weight decay를 gradient update와 분리하는 이유",
    },
  ],
  "ai/dezero-advanced": [
    {
      kind: "핵심 논문",
      label: "Long Short-Term Memory",
      href: "https://doi.org/10.1162/neco.1997.9.8.1735",
      note: "LSTM의 memory cell과 장기 gradient 경로를 제안한 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "Layer Normalization",
      href: "https://arxiv.org/abs/1607.06450",
      note: "샘플별 hidden-unit 통계로 정규화하는 LayerNorm의 원문",
    },
    {
      kind: "핵심 논문",
      label:
        "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
      href: "https://jmlr.org/papers/v15/srivastava14a.html",
      note: "학습 중 무작위 unit 제거와 추론 시 동작을 정리한 원 논문",
    },
  ],
  "blockchain/reth-alloy-primitives": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    source(
      "공식 문서",
      OFFICIAL_SOURCES.alloy.primitives,
      "Ethereum primitive type과 encoding API의 현재 정의",
    ),
  ),
  "blockchain/reth-block-execution": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    source(
      "공식 문서",
      OFFICIAL_SOURCES.reth.blockExecutor,
      "block executor가 transaction 실행과 state 변경을 소유하는 경계",
    ),
    {
      kind: "공식 규격",
      label: "Ethereum Yellow Paper — pinned snapshot",
      href: "https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex",
      note: "World-state와 transaction state-transition 수식의 고전적 정본이며 Shanghai 이후 fork는 execution-specs로 보완",
    },
    {
      kind: "공식 규격",
      label: "Ethereum execution-specs — pinned snapshot",
      href: "https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227",
      note: "Fork별 block·transaction transition과 receipt/header postcondition의 실행 가능한 규격",
    },
    {
      kind: "공식 구현",
      label: "Reth v2.2.0 — crates/evm",
      href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/evm",
      note: "선택한 release의 executor·EVM environment integration source snapshot",
    },
  ),
  "blockchain/reth-chainspec": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    {
      kind: "공식 문서",
      label: "Reth ChainSpec API",
      href: "https://reth.rs/docs/reth/chainspec/struct.ChainSpec.html",
      note: "선택한 Reth 2.x docs version의 chain·genesis·hardfork·fee/blob parameter 경계",
    },
    {
      kind: "공식 규격",
      label: "EIP-6122 — Fork identifier update",
      href: "https://eips.ethereum.org/EIPS/eip-6122",
      note: "Timestamp fork를 포함한 fork ID 계산과 peer compatibility validation 규칙",
    },
  ),
  "blockchain/reth-cli": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    {
      kind: "공식 문서",
      label: "Reth Book — reth node",
      href: "https://reth.rs/cli/reth/node.html",
      note: "실행한 release에서 operator input과 node option surface를 확인하는 command reference",
    },
    {
      kind: "공식 문서",
      label: "Reth NodeBuilder API",
      href: "https://reth.rs/docs/reth/builder/struct.NodeBuilder.html",
      note: "NodeConfig에서 typed components·hooks·NodeHandle로 이어지는 current builder contract",
    },
    {
      kind: "공식 프로젝트 기록",
      label: "Reth v2.2.0 release",
      href: "https://github.com/paradigmxyz/reth/releases/tag/v2.2.0",
      note: "Discv5 default와 feature·compatibility 변화가 release에 귀속된다는 upgrade 근거",
    },
  ),
  "blockchain/reth-db": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 구현",
    label: "Reth v2.2.0 — storage crates",
    href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage",
    note: "Typed DB·provider·static history·Storage V2 routing의 pinned source",
  }, {
    kind: "공식 문서",
    label: "libmdbx documentation",
    href: "https://libmdbx.dqdkfa.ru/",
    note: "MDBX MVCC transaction·commit·durability의 engine-level 경계",
  }),
  "blockchain/reth-eip1559": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "EIP-1559 — Fee market change for ETH 1.0 chain",
    href: "https://eips.ethereum.org/EIPS/eip-1559",
    note: "base fee update와 transaction fee 계산의 규범적 정의",
  }),
  "blockchain/reth-eip4844": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    {
      kind: "공식 규격",
      label: "EIP-4844 — Shard Blob Transactions",
      href: "https://eips.ethereum.org/EIPS/eip-4844",
      note: "blob transaction·KZG commitment·blob gas의 규범적 정의",
    },
    {
      kind: "공식 규격",
      label: "Ethereum KZG Ceremony Specifications",
      href: "https://github.com/ethereum/kzg-ceremony-specs",
      note: "KZG public parameter contribution과 transcript verification의 보안 경계",
    },
  ),
  "blockchain/reth-exex": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 구현",
    label: "Reth ExEx source @ 4cf0face",
    href: "https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c/crates/exex",
    note: "Notification·WAL·finished-height 구현을 고정한 source snapshot",
  }, {
    kind: "공식 문서",
    label: "Reth Execution Extensions documentation",
    href: "https://reth.rs/exex/overview/",
    note: "ExEx role·notification·use-case의 공식 안내이며 external exactly-once 보장은 아님",
  }),
  "blockchain/reth-mev": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "Ethereum Builder Specifications @ 78a5546d",
    href: "https://github.com/ethereum/builder-specs/tree/78a5546d9d8253beabf7db8baf988a58abdec87f",
    note: "Registration·bid header·blinded block·payload delivery protocol snapshot",
  }, {
    kind: "공식 구현",
    label: "Flashbots mev-boost @ 203bb965",
    href: "https://github.com/flashbots/mev-boost/tree/203bb9659eea613caefd198c67df4c6a8e6bf5d6",
    note: "Proposer-side relay aggregation implementation snapshot",
  }, {
    kind: "공식 구현",
    label: "Flashbots rbuilder @ 6037fa72",
    href: "https://github.com/flashbots/rbuilder/tree/6037fa728b13bf1806e16fff2586414216f6b8fa",
    note: "Reth crates 기반 external builder implementation snapshot",
  }),
  "blockchain/reth-net": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    {
      kind: "공식 규격",
      label: "Ethereum devp2p RLPx specification",
      href: "https://github.com/ethereum/devp2p/blob/master/rlpx.md",
      note: "Peer authentication·encrypted framing·capability negotiation의 wire boundary",
    },
    {
      kind: "공식 규격",
      label: "Ethereum Wire Protocol (eth)",
      href: "https://github.com/ethereum/devp2p/blob/master/caps/eth.md",
      note: "Status와 versioned block·transaction announcement/request/response semantics",
    },
    {
      kind: "공식 규격",
      label: "Ethereum Node Discovery v5",
      href: "https://github.com/ethereum/devp2p/blob/master/discv5/discv5-theory.md",
      note: "Signed node record·discovery session·lookup의 역할과 한계",
    },
  ),
  "blockchain/reth-payload-builder": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    source(
      "공식 문서",
      OFFICIAL_SOURCES.reth.payloadBuilder,
      "local payload construction의 현재 API 경계",
    ),
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.engineApi,
      "forkchoiceUpdated·getPayload·newPayload의 versioned CL/EL handoff",
    ),
  ),
  "blockchain/reth-pipeline": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "Ethereum execution-specs — pinned snapshot",
    href: "https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227",
    note: "Stage가 검증하는 fork별 header·body·transaction·receipt·state transition 정본",
  }, {
    kind: "공식 구현",
    label: "Reth v2.2.0 — crates/stages",
    href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/stages",
    note: "선택한 release의 stage dependency·checkpoint·execute/unwind source snapshot",
  }),
  "blockchain/reth-precompiles": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-provider": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 구현",
    label: "Reth v2.2.0 — storage/provider",
    href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage/provider",
    note: "StateProvider·latest/historical provider·storage routing의 pinned source",
  }, {
    kind: "공식 구현",
    label: "Reth v2.2.0 — storage/db-api",
    href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/storage/db-api",
    note: "Provider 아래 read transaction·cursor·typed table capability",
  }),
  "blockchain/reth-rpc": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "Ethereum Execution APIs @ 742d45db",
    href: "https://github.com/ethereum/execution-apis/tree/742d45db810b31265c8d3c075af324953330d1ed",
    note: "Public JSON-RPC와 versioned Engine API wire contract snapshot",
  }, {
    kind: "공식 구현",
    label: "Reth RPC source @ 4cf0face",
    href: "https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c/crates/rpc",
    note: "Module·middleware·provider wiring의 pinned implementation snapshot",
  }),
  "blockchain/reth-sync": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.engineApi,
      "consensus head·safe·finalized와 execution payload status의 표준 경계",
    ),
  ),
  "blockchain/reth-trie": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "Ethereum Yellow Paper — pinned snapshot",
    href: "https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex",
    note: "Modified Merkle Patricia trie·world-state commitment의 고전적 정본",
  }, {
    kind: "공식 구현",
    label: "Reth v2.2.0 — crates/trie/trie",
    href: "https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/trie/trie",
    note: "선택한 release의 prefix set·state-root·parallel trie source snapshot",
  }),
  "blockchain/reth-txpool": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/prysm-attestation": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-beacon-api": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.beaconApi,
      "beacon node REST endpoint와 request·response schema",
    ),
    {
      kind: "공식 구현",
      label: "OffchainLabs/prysm — beacon-chain/rpc",
      href: "https://github.com/OffchainLabs/prysm/tree/develop/beacon-chain/rpc",
      note: "선택한 source snapshot의 gRPC·REST service wiring과 handler seam",
    },
  ),
  "blockchain/prysm-beacon-db": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    {
      kind: "공식 문서",
      label: "etcd-io/bbolt v1.4.3 — official repository and documentation",
      href: "https://github.com/etcd-io/bbolt/tree/v1.4.3",
      note: "read/write transaction·single-writer·page lifecycle의 storage-engine contract",
    },
  ),
  "blockchain/prysm-beacon-state": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    {
      kind: "공식 규격",
      label: "Ethereum Consensus Specifications — BeaconState",
      href: "https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/beacon-chain.md",
      note: "fork별 protocol state schema·transition과 hash-tree-root의 정본",
    },
  ),
  "blockchain/prysm-block-processing": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
  ),
  "blockchain/prysm-block-proposal": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-bls": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    {
      kind: "핵심 연구",
      label: "CFRG Internet-Draft — BLS Signatures draft-06",
      href: "https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/06/",
      note: "BLS core·aggregate·Proof-of-Possession API와 key-validation 전제; RFC가 아닌 revision 고정 draft",
    },
  ),
  "blockchain/prysm-engine-api": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.engineApi,
      "consensus client와 execution client 사이의 Engine API",
    ),
  ),
  "blockchain/prysm-epoch-processing": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
  ),
  "blockchain/prysm-finality": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-forkchoice": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-gossipsub": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.libp2p.gossipsub,
      "mesh·score·message validation의 GossipSub 기준",
    ),
  ),
  "blockchain/prysm-p2p-libp2p": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.p2p,
      "Ethereum consensus networking의 topic·subnet 규칙",
    ),
  ),
  "blockchain/prysm-slot-processing": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    {
      kind: "공식 규격",
      label: "Ethereum Consensus Specifications v1.6.1 — slot processing",
      href: "https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/beacon-chain.md",
      note: "process_slots·process_slot·process_epoch 실행 순서의 정본",
    },
  ),
  "blockchain/prysm-ssz": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.ssz,
      "serialization과 hash-tree-root의 공식 규칙",
    ),
    {
      kind: "공식 규격",
      label: "Ethereum Consensus Specifications — Merkle proof formats",
      href: "https://github.com/ethereum/consensus-specs/blob/master/ssz/merkle-proofs.md",
      note: "generalized index와 single/multiproof helper-node 계산 형식",
    },
  ),
  "blockchain/prysm-state-cache": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    {
      kind: "공식 구현",
      label: "OffchainLabs/prysm — beacon-chain/state/stategen",
      href: "https://github.com/OffchainLabs/prysm/tree/develop/beacon-chain/state/stategen",
      note: "선택한 source snapshot의 state lookup·summary·ordered replay seam",
    },
    {
      kind: "공식 규격",
      label: "Ethereum Consensus Specifications",
      href: "https://ethereum.github.io/consensus-specs/",
      note: "Fork별 BeaconState·slot/block/epoch transition과 state-root postcondition",
    },
  ),
  "blockchain/prysm-sync": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.p2p,
      "BeaconBlocksByRange·Status·response chunk의 sync wire contract",
    ),
    {
      kind: "공식 규격",
      label: "Ethereum Consensus Specifications — weak subjectivity",
      href: "https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/weak-subjectivity.md",
      note: "Checkpoint sync의 trust anchor·freshness 경계",
    },
  ),
  "blockchain/prysm-sync-committee": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-validator-client": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
  ),
  "blockchain/cometbft-abci": [
    {
      kind: "공식 규격",
      label: "CometBFT v0.40.0 — ABCI++ Methods",
      href: "https://github.com/cometbft/cometbft/blob/v0.40.0/spec/abci/abci%2B%2B_methods.md",
      note: "PrepareProposal·ProcessProposal·FinalizeBlock·Commit의 field와 호출·authority 기준",
    },
    {
      kind: "공식 규격",
      label: "CometBFT v0.40.0 — ABCI Application Requirements",
      href: "https://github.com/cometbft/cometbft/blob/v0.40.0/spec/abci/abci%2B%2B_app_requirements.md",
      note: "Determinism·candidate state·connection ordering·crash recovery에 대한 application 의무",
    },
    {
      kind: "공식 코드",
      label: "CometBFT v0.40.0 — ABCI source snapshot",
      href: "https://github.com/cometbft/cometbft/tree/v0.40.0/abci",
      note: "실제 protobuf type과 client/server adapter를 확인하는 pinned source",
    },
  ],
  "blockchain/cometbft-consensus": [
    {
      kind: "공식 규격",
      label: "CometBFT v0.40.0 — Byzantine Consensus Algorithm",
      href: "https://github.com/cometbft/cometbft/blob/v0.40.0/spec/consensus/consensus.md",
      note: "H/R/S·proposal·prevote·precommit·PoLC·commit과 safety/liveness proof 기준",
    },
    {
      kind: "공식 코드",
      label: "CometBFT v0.40.0 — consensus source snapshot",
      href: "https://github.com/cometbft/cometbft/tree/v0.40.0/consensus",
      note: "Event loop·state transition·timeout·WAL 구현을 확인하는 pinned source",
    },
  ],
  "blockchain/cometbft-crypto": [
    { kind: "공식 코드", label: "CometBFT v0.40.0 — crypto/ed25519", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/crypto/ed25519/ed25519.go", note: "Fixed key/signature length·ZIP-215 verifier·SHA-256-20 address·batch verifier의 pinned implementation" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — crypto/merkle", href: "https://github.com/cometbft/cometbft/tree/v0.40.0/crypto/merkle", note: "Prefix-separated tree·proof·split-point semantics의 pinned source" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — crypto/tmhash", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/crypto/tmhash/hash.go", note: "32-byte full hash와 20-byte truncated address hash 경계" },
  ],
  "blockchain/cosmos-sdk": [
    { kind: "공식 코드", label: "Cosmos SDK v0.55.0 — BaseApp", href: "https://github.com/cosmos/cosmos-sdk/tree/v0.55.0/baseapp", note: "ABCI mode·context·block/transaction execution의 pinned implementation" },
    { kind: "공식 코드", label: "Cosmos SDK v0.55.0 — auth ante · bank MsgServer", href: "https://github.com/cosmos/cosmos-sdk/blob/v0.55.0/x/auth/ante/ante.go", note: "Envelope authorization과 MsgSend business validation의 separation" },
    { kind: "공식 코드", label: "Cosmos SDK v0.55.0 — CacheMultiStore", href: "https://github.com/cosmos/cosmos-sdk/blob/v0.55.0/store/cachemulti/store.go", note: "Nested cache branch와 Write merge semantics; durable root Commit은 별도" },
  ],
  "blockchain/evmos": [
    { kind: "공식 코드", label: "Evmos v20.0.0 — Ethereum ante", href: "https://github.com/evmos/evmos/tree/v20.0.0/app/ante/evm", note: "Sender recovery·fee·nonce·gas·sequence decorator ordering의 historical pinned source" },
    { kind: "공식 코드", label: "Evmos v20.0.0 — x/evm", href: "https://github.com/evmos/evmos/tree/v20.0.0/x/evm", note: "EVM keeper·StateDB journal·state transition의 pinned implementation; current cosmos/evm으로 일반화하지 않음" },
    { kind: "공식 코드", label: "Evmos v20.0.0 — ERC-20 IBC middleware", href: "https://github.com/evmos/evmos/blob/v20.0.0/x/erc20/ibc_middleware.go", note: "Receive·acknowledgement·timeout callback과 token representation 경계" },
  ],
  "blockchain/dydx": [
    { kind: "공식 코드", label: "dYdX v4-chain protocol/v9.6.3 — OrderId", href: "https://github.com/dydxprotocol/v4-chain/blob/protocol/v9.6.3/protocol/x/clob/types/order_id.go", note: "Short-term·stateful·conditional/TWAP flags, state key와 deterministic sort contract" },
    { kind: "공식 코드", label: "dYdX v4-chain protocol/v9.6.3 — CLOB", href: "https://github.com/dydxprotocol/v4-chain/tree/protocol/v9.6.3/protocol/x/clob", note: "MemClob·proposed operations·match/risk processing의 pinned implementation" },
    { kind: "공식 코드", label: "dYdX v4-chain protocol/v9.6.3 — Indexer", href: "https://github.com/dydxprotocol/v4-chain/tree/protocol/v9.6.3/indexer", note: "Versioned chain event에서 rebuildable query projection으로 이어지는 source boundary" },
  ],
  "blockchain/cometbft-execution": [
    { kind: "공식 코드", label: "CometBFT v0.40.0 — state/execution.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/state/execution.go", note: "ApplyBlock·FinalizeBlock·result 저장·Commit·mempool Update·State 저장의 pinned 순서" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — state/validation.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/state/validation.go", note: "Block height·history·commitment·LastCommit·time·evidence 검증 기준" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — consensus/replay.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/consensus/replay.go", note: "BlockStore·State·application height/AppHash 조합별 restart replay 구현" },
  ],
  "blockchain/cometbft-mempool": [
    { kind: "공식 코드", label: "CometBFT v0.40.0 — mempool/clist_mempool.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/mempool/clist_mempool.go", note: "Capacity·cache·CheckTx·reap·Update·recheck의 pinned 구현" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — mempool/mempool.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/mempool/mempool.go", note: "Mempool interface와 Lock·Update·TxsAvailable contract" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — state/execution.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/state/execution.go", note: "Application Commit과 mempool flush/Update 사이 동시성 경계" },
  ],
  "blockchain/cometbft-p2p": [
    { kind: "공식 코드", label: "CometBFT v0.40.0 — p2p/conn/connection.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/p2p/conn/connection.go", note: "MConnection channel queue·priority scheduler·packet framing의 pinned 구현" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — p2p/switch.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/p2p/switch.go", note: "Unique channel owner, peer add/remove와 persistent reconnect lifecycle" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — p2p/base_reactor.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/p2p/base_reactor.go", note: "Reactor GetChannels·Receive·peer callback interface" },
  ],
  "blockchain/cometbft-state": [
    { kind: "공식 코드", label: "CometBFT v0.40.0 — state/state.go · store.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/state/state.go", note: "State field·validator snapshots·AppHash와 synchronous persistence schema" },
    { kind: "공식 코드", label: "CometBFT v0.40.0 — store/store.go", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/store/store.go", note: "BlockStore Base·Height·parts·commit·evidence-aware pruning 구현" },
    { kind: "공식 문서", label: "CometBFT v0.40.0 — State Sync", href: "https://github.com/cometbft/cometbft/blob/v0.40.0/docs/core/state-sync.md", note: "Snapshot 지원과 trust height/hash/period를 포함한 bootstrap 기준" },
  ],
  "blockchain/cometbft-types": [
    {
      kind: "공식 규격",
      label: "CometBFT v0.40.0 — Data Structures",
      href: "https://github.com/cometbft/cometbft/blob/v0.40.0/spec/core/data_structures.md",
      note: "Block·Header·Vote·Commit·ValidatorSet·Evidence field와 validation rule의 pinned 기준",
    },
    {
      kind: "공식 규격",
      label: "CometBFT v0.40.0 — Evidence",
      href: "https://github.com/cometbft/cometbft/blob/v0.40.0/spec/consensus/evidence.md",
      note: "Duplicate vote·light-client attack evidence의 검증·gossip·commit 경계",
    },
    {
      kind: "공식 코드",
      label: "CometBFT v0.40.0 — types source snapshot",
      href: "https://github.com/cometbft/cometbft/tree/v0.40.0/types",
      note: "Canonical sign bytes와 validation implementation을 확인하는 pinned source",
    },
  ],
  "blockchain/filecoin-f3": [
    { kind: "공식 규격", label: "FIP-0086 · revision c856d99", href: "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md", note: "EC/F3 input, GPBFT certificate, power-table evolution과 finalized-prefix fence의 Final 규격이며 고정 latency SLA는 아님" },
    { kind: "공식 코드", label: "go-f3 v0.8.14 certificate exchange", href: "https://github.com/filecoin-project/go-f3/tree/v0.8.14/certexchange", note: "Certificate·power-table catch-up의 pinned source이며 peer availability나 initial trust anchor를 보장하지 않음" },
    { kind: "공식 코드", label: "Lotus v1.36.2 chain/lf3", href: "https://github.com/filecoin-project/lotus/tree/v1.36.2/chain/lf3", note: "EC backend·manifest·power table·certificate API 통합의 pinned source이며 downstream release policy는 별도" },
  ],
  "blockchain/expected-consensus": [
    { kind: "공식 규격", label: "Filecoin Specification — Expected Consensus", href: "https://spec.filecoin.io/algorithms/expected_consensus/", note: "Sortition·compatible tipset·validation·chain-weight fork choice의 protocol 기준이며 F3 finality는 별도" },
    { kind: "공식 코드", label: "Lotus v1.36.2 electionproof.go", href: "https://github.com/filecoin-project/lotus/blob/v1.36.2/chain/types/electionproof.go", note: "Poisson inverse-CDF win count의 pinned implementation이며 randomness·block validity 전체를 보장하지 않음" },
    { kind: "공식 코드", label: "Lotus v1.36.2 filcns weight.go", href: "https://github.com/filecoin-project/lotus/blob/v1.36.2/chain/consensus/filcns/weight.go", note: "EC chain-weight fixed-point integer 산술의 pinned source이며 irreversible finality 근거는 아님" },
  ],
  "blockchain/ipfs-filecoin-storage": [
    { kind: "공식 규격", label: "IPFS Bitswap protocol · commit ff7230f", href: "https://github.com/ipfs/specs/blob/ff7230ffe47f6aa765a105271f6294299e5f233f/src/bitswap-protocol.md", note: "Wantlist·block/presence exchange snapshot이며 provider ad가 possession·durability를 보장하지 않음" },
    { kind: "공식 규격", label: "IPFS HTTP Routing V1 · commit ff7230f", href: "https://github.com/ipfs/specs/blob/ff7230ffe47f6aa765a105271f6294299e5f233f/src/routing/http-routing-v1.md", note: "Provider candidate schema이며 successful transfer·CID integrity는 별도" },
    { kind: "공식 코드", label: "Kubo v0.42.0 stable source", href: "https://github.com/ipfs/kubo/tree/v0.42.0", note: "Pin/GC·routing·Bitswap·gateway implementation snapshot이며 remote replication·SLA는 아님" },
    { kind: "공식 규격", label: "Storacha–Filecoin pipeline · commit 3b67918", href: "https://github.com/storacha/specs/blob/3b6791869635735ddb1a54aed7450ad6ef687c06/w3-filecoin.md", note: "Content/piece/deal receipt bridge이며 offer가 deal·proof·retrieval 성공을 뜻하지 않음" },
  ],
  "blockchain/lotus-chain": [
    { kind: "공식 코드", label: "Lotus ChainSync · v1.36.0 commit 154c0c3", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/chain/sync.go", note: "Header/message 수집·validation·heaviest-tipset refresh의 pinned 구현이며 peer availability·finality 보장은 아님" },
    { kind: "공식 코드", label: "Lotus StateManager · v1.36.0 commit 154c0c3", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/chain/stmgr/execute.go", note: "TipSetState cache·lookup·recompute 경계이며 FVM 전체 semantics·고정 실행 시간은 아님" },
    { kind: "공식 규격", label: "Filecoin Expected Consensus", href: "https://spec.filecoin.io/algorithms/expected_consensus/", note: "Valid tipset·chain-weight fork choice의 protocol 기준이며 Lotus I/O·F3 finality는 별도" },
  ],
  "blockchain/lotus-market": [
    { kind: "공식 문서", label: "Filecoin direct deal-making", href: "https://docs.filecoin.io/smart-contracts/programmatic-storage/direct-deal-making", note: "Proposal·Boost acceptance·publish·sector completion의 current high-level 경계이며 완료 시간 보장은 아님" },
    { kind: "공식 문서", label: "Filecoin serving retrievals", href: "https://docs.filecoin.io/basics/how-retrieval-works/serving-retrievals", note: "IPNI discovery와 Graphsync/Bitswap/HTTP delivery 경계이며 availability·무료 retrieval 보장은 아님" },
    { kind: "공식 코드", label: "Boost · commit 240aa6e", href: "https://github.com/filecoin-project/boost/tree/240aa6e12fbd349a5a3ed702121c3c58050792fc", note: "Current deal/retrieval implementation snapshot이며 모든 provider topology·SLA를 뜻하지 않음" },
  ],
  "blockchain/lotus-miner": [
    { kind: "공식 코드", label: "Lotus sealing pipeline · v1.36.0", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/storage/pipeline/states_sealing.go", note: "Legacy lotus-miner PC1/PC2·precommit/commit state source이며 Curio schema와 동일하지 않음" },
    { kind: "공식 코드", label: "Lotus WindowPoSt runner · v1.36.0", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/storage/wdpost/wdpost_run.go", note: "Window generation·verify·submission의 pinned source이며 Winning·deadline success 전체는 별도" },
    { kind: "공식 코드", label: "Lotus WinningPoSt prover · v1.36.0", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/storage/winning_prover.go", note: "Election challenge/proof adapter이며 block assembly·inclusion을 보장하지 않음" },
    { kind: "공식 문서", label: "Curio sealing design", href: "https://docs.curiostorage.org/design/sealing", note: "HarmonyTasks 기반 current design 설명이며 legacy state 호환·고정 throughput 보장은 아님" },
  ],
  "blockchain/lotus-mpool": [
    { kind: "공식 코드", label: "Lotus messagepool.go · v1.36.0 commit 154c0c3", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/chain/messagepool/messagepool.go", note: "Head-relative admission·nonce/replacement·apply/revert lifecycle의 pinned source이며 inclusion·finality·고정 policy 보장은 아님" },
    { kind: "공식 코드", label: "Lotus selection.go · v1.36.0 commit 154c0c3", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/chain/messagepool/selection.go", note: "Sender nonce packages·effective premium·block-budget selection source이며 global/optimal ordering을 뜻하지 않음" },
    { kind: "공식 코드", label: "Lotus gas.go · v1.36.0 commit 154c0c3", href: "https://github.com/filecoin-project/lotus/blob/154c0c3a46e92006008818bb06aaf959e2e705a9/node/impl/full/gas.go", note: "GasLimit simulation, premium·fee-cap estimators의 pinned source이며 future execution·fee·inclusion 보장은 아님" },
    { kind: "공식 규격", label: "FIP-0054 · revision c856d99", href: "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0054.md", note: "Effective gas premium selection semantics이며 fee predictability·fair ordering·inclusion 보장은 아님" },
  ],
  "blockchain/lotus-state": [
    { kind: "공식 규격", label: "Filecoin Specification · State Tree", href: "https://spec.filecoin.io/systems/filecoin_vm/state_tree/", note: "Address→actor-state HAMT의 protocol 구조이며 current Lotus cache·schema·성능 보장은 아님" },
    { kind: "공식 문서", label: "Filecoin Actors", href: "https://docs.filecoin.io/basics/the-blockchain/actors", note: "Code·state pointer·nonce·balance와 actor model 설명이며 actor bundle·method set의 영구 고정은 아님" },
    { kind: "공식 코드", label: "Lotus StateTree · v1.36.2 commit c6f4d02", href: "https://github.com/filecoin-project/lotus/blob/c6f4d02400dba55ebc5ab3677ef2ae5a5f4d1aef/chain/state/statetree.go", note: "Versioned load, address resolution, snapshot·revert·flush의 pinned 구현이며 database durability·fixed latency 보장은 아님" },
    { kind: "공식 코드", label: "go-hamt-ipld v3.4.1 · commit 0be9a0f", href: "https://github.com/filecoin-project/go-hamt-ipld/tree/0be9a0f6b272246618d22f19f95c28e2e043e890", note: "Parameterized HAMT implementation이며 모든 actor collection의 hash·bit width·bucket이 같다는 뜻은 아님" },
  ],
  "blockchain/giwa-chain": [
    { kind: "공식 문서", label: "Introducing GIWA", href: "https://docs.giwa.io/giwa-chain/en", note: "OP Stack 기반 EVM-compatible L2라는 current 공식 설명이며 decentralization·mainnet·fixed performance 보장은 아님" },
    { kind: "공식 문서", label: "Differences between Ethereum and GIWA", href: "https://docs.giwa.io/giwa-chain/en/network-information/diffs-ethereum-giwa", note: "Sequencer·bridge·mempool과 unsafe/safe/finalized 상태 설명이며 withdrawal 종료·application finality 보장은 아님" },
    { kind: "공식 규격", label: "OP Stack Derivation Specification", href: "https://specs.optimism.io/protocol/derivation.html", note: "L1 batch input에서 L2 payload·safe chain을 재현하는 generic 규칙이며 GIWA-specific config를 대신하지 않음" },
    { kind: "공식 코드", label: "giwa-io/node v0.6.0 · commit 8cabd0d5", href: "https://github.com/giwa-io/node/tree/8cabd0d51e7ed2c2200f9c82e26a9c5ec7301722", note: "op-node v1.19.1·op-reth v2.3.3·JWT·Sepolia env의 pinned bundle이며 future/mainnet 호환 보장은 아님" },
  ],
  "blockchain/proofs-porep": [
    { kind: "공식 코드", label: "rust-fil-proofs seal API · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/seal.rs", note: "PC1·PC2·C1·C2 orchestration snapshot이며 current activation·고정 sealing time은 아님" },
    { kind: "공식 규격", label: "Filecoin SDR specification · commit a950028", href: "https://github.com/filecoin-project/specs/tree/a95002835b34d4042c007feda3fecf5e68e79dfa/content/algorithms/sdr", note: "Replica-specific labels·encoding·commitment construction이며 모든 PoRep/GPU 구현을 뜻하지 않음" },
    { kind: "공식 문서", label: "FIP-0090 NI-PoRep · revision c856d99", href: "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0090.md", note: "NI-PoRep proposal·activation profile이며 classic phase artifacts와 자동 호환된다는 뜻은 아님" },
  ],
  "blockchain/proofs-post": [
    { kind: "공식 코드", label: "rust-fil-proofs WindowPoSt API · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/window_post.rs", note: "WindowPoSt generation·verification orchestration이며 current deadline constants·inclusion은 별도" },
    { kind: "공식 코드", label: "rust-fil-proofs WinningPoSt API · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/winning_post.rs", note: "Election proof API snapshot이며 block election·inclusion을 보장하지 않음" },
    { kind: "공식 코드", label: "Lotus WindowPoSt runner · v1.36.2 commit c6f4d02", href: "https://github.com/filecoin-project/lotus/blob/c6f4d02400dba55ebc5ab3677ef2ae5a5f4d1aef/storage/wdpost/wdpost_run.go", note: "Deadline generation·submission·receipt 흐름이며 모든 reorg·congestion 성공률은 아님" },
  ],
  "blockchain/proofs-snark": FILECOIN_PROOFS_SERIES_EVIDENCE,
  "blockchain/filecoin-fvm": [
    { kind: "공식 규격", label: "FIP-0030 · Final revision c856d99", href: "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0030.md", note: "FVM 도입과 actor model 규격이며 current gas schedule·actor bundle은 별도" },
    { kind: "공식 코드", label: "ref-fvm executor · commit ef0a993", href: "https://github.com/filecoin-project/ref-fvm/blob/ef0a99370839e8e453e2fc7bad07228c8be0bdfb/fvm/src/executor/default.rs", note: "Message execution·receipt·state flush snapshot이며 fixed performance는 아님" },
    { kind: "공식 코드", label: "ref-fvm call manager · commit ef0a993", href: "https://github.com/filecoin-project/ref-fvm/blob/ef0a99370839e8e453e2fc7bad07228c8be0bdfb/fvm/src/call_manager/default.rs", note: "Nested actor transactional state/events 구현 범위이며 outer chain effects 전체를 뜻하지 않음" },
    { kind: "공식 코드", label: "ref-fvm actor manifest · commit ef0a993", href: "https://github.com/filecoin-project/ref-fvm/blob/ef0a99370839e8e453e2fc7bad07228c8be0bdfb/fvm/src/machine/manifest.rs", note: "Manifest version·required actor lookup snapshot이며 actor security audit는 아님" },
  ],
  "blockchain/filecoin-ipc": [
    { kind: "공식 코드", label: "IPC parent–child interactions · commit bcd7c0d", href: "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/docs-gitbook/concepts/subnets/parent-child-interactions.md", note: "Checkpoint·parent finality·top/down roles snapshot이며 inherited safety·fixed latency는 아님" },
    { kind: "공식 규격", label: "IPC validator membership · commit bcd7c0d", href: "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/specs/subnet-validator-membership.md", note: "Power-change round trip 설계이며 모든 deployment liveness를 보장하지 않음" },
    { kind: "공식 코드", label: "IPC TopDownFinalityFacet · commit bcd7c0d", href: "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/TopDownFinalityFacet.sol", note: "Parent-finality gateway transition snapshot이며 child finality 전체는 별도" },
    { kind: "공식 코드", label: "IPC CheckpointingFacet · commit bcd7c0d", href: "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/CheckpointingFacet.sol", note: "Verified checkpoint commit boundary이며 signer quorum·relayer liveness는 별도" },
  ],
  "blockchain/filecoin-onchain-cloud": [
    { kind: "공식 규격", label: "Filecoin Services specification · commit a391c1c", href: "https://github.com/FilOzone/filecoin-services/blob/a391c1cd23c95ee8d8eadec462cdc35569ae486d/SPEC.md", note: "Dataset proving·storage payment lifecycle snapshot이며 example prices·기간·retrieval SLA는 아님" },
    { kind: "공식 코드", label: "FilecoinWarmStorageService.sol · commit a391c1c", href: "https://github.com/FilOzone/filecoin-services/blob/a391c1cd23c95ee8d8eadec462cdc35569ae486d/service_contracts/src/FilecoinWarmStorageService.sol", note: "PDP callbacks·dataset/rail state·termination source이며 off-chain bytes durability를 검증하지 않음" },
    { kind: "공식 규격", label: "Filecoin Pay specification · commit 04ded6a", href: "https://github.com/FilOzone/filecoin-pay/blob/04ded6af6c15c4b5d98545f393dc656004d4aede/SPEC.md", note: "Accounts·rails·rate·lockup·settlement semantics이며 service quality·solvency·fixed yield 보장은 아님" },
    { kind: "공식 코드", label: "Synapse StorageManager · commit 44ffc12", href: "https://github.com/FilOzone/synapse-sdk/blob/44ffc12fd9b5390820d9642148f6a36b9b2baed4/packages/synapse-sdk/src/storage/manager.ts", note: "Primary upload·replication·on-chain commits orchestration이며 proof·payment·fixed speed 보장은 아님" },
  ],
  "blockchain/filecoin-pdp": [
    { kind: "공식 문서", label: "FilOzone PDP design · commit 4d2a930", href: "https://github.com/FilOzone/pdp/blob/4d2a930194367477050302792de89e29275a6047/docs/design.md", note: "Dataset·challenge·period·fault와 detection model의 pinned design이며 retrieval SLA는 아님" },
    { kind: "공식 코드", label: "PDPVerifier.sol · commit 4d2a930", href: "https://github.com/FilOzone/pdp/blob/4d2a930194367477050302792de89e29275a6047/src/PDPVerifier.sol", note: "Challenge derivation·Merkle verification·contract state snapshot이며 provider durability는 별도" },
    { kind: "공식 코드", label: "Curio PDP provider API · commit 550f2ee", href: "https://github.com/filecoin-project/curio/blob/550f2ee0aadd3491da2bc71df13673075a803ccb/pdp/README.md", note: "Provider upload·CommP·dataset lifecycle 통합이며 on-chain proof 성공·fixed speed는 아님" },
  ],
  "blockchain/filecoin-proofs": [
    { kind: "공식 코드", label: "rust-fil-proofs API · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/tree/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api", note: "Typed PoRep·Window·Winning API snapshot이며 current activation·fixed performance는 아님" },
    { kind: "공식 코드", label: "rust-fil-proofs seal verifier · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/seal.rs", note: "Seal phases·verification·aggregation orchestration이며 ceremony trust·deadline inclusion은 별도" },
    { kind: "공식 규격", label: "Filecoin proof-of-storage spec · commit a950028", href: "https://github.com/filecoin-project/specs/tree/a95002835b34d4042c007feda3fecf5e68e79dfa/content/algorithms/pos", note: "PoRep·PoSt claim definitions이며 current Lotus scheduler·PDP·retrieval SLA를 뜻하지 않음" },
  ],
  "blockchain/filecoin-storacha": [
    { kind: "공식 규격", label: "Storacha specs status · commit 3b67918", href: "https://github.com/storacha/specs/blob/3b6791869635735ddb1a54aed7450ad6ef687c06/Readme.md", note: "Stable/reliable/WIP maturity snapshot이며 permanent storage promise는 아님" },
    { kind: "공식 규격", label: "Storacha Space·Blob specs · commit 3b67918", href: "https://github.com/storacha/specs/blob/3b6791869635735ddb1a54aed7450ad6ef687c06/w3-blob.md", note: "Space capability와 allocate/put/accept receipt chain이며 public retrieval은 별도" },
    { kind: "공식 규격", label: "Storacha Sharded DAG Index · commit 3b67918", href: "https://github.com/storacha/specs/blob/3b6791869635735ddb1a54aed7450ad6ef687c06/w3-index.md", note: "Root→shard→range mapping artifact이며 shard availability 보장은 아님" },
    { kind: "공식 규격", label: "Storacha Filecoin pipeline · commit 3b67918", href: "https://github.com/storacha/specs/blob/3b6791869635735ddb1a54aed7450ad6ef687c06/w3-filecoin.md", note: "Offer·aggregation·dealer·tracker protocol이며 deal/proof success·permanence는 아님" },
  ],
  "blockchain/reth": [
    source(
      "공식 코드",
      OFFICIAL_SOURCES.reth.repository,
      "현재 crate와 노드 조립의 원본",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.reth.layout,
      "workspace 경계를 읽는 공식 안내",
    ),
  ],
  "blockchain/prysm": [
    source(
      "공식 코드",
      OFFICIAL_SOURCES.prysm.repository,
      "Prysm beacon node와 validator 구현",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.ethereum.consensusSpecs,
      "state transition과 fork 규칙",
    ),
  ],
  "blockchain/cometbft": [
    source(
      "공식 코드",
      OFFICIAL_SOURCES.cometbft.repository,
      "현재 consensus·state·p2p 구현",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.cometbft.abci,
      "ABCI++ 애플리케이션 계약",
    ),
  ],
  "blockchain/filecoin-lotus": [
    { kind: "공식 문서", label: "Lotus suite components", href: "https://docs.filecoin.io/storage-providers/architecture/lotus-components", note: "Daemon·miner/worker·Boost의 process 책임 경계이며 모든 배포 topology를 뜻하지 않음" },
    { kind: "공식 코드", label: "Lotus v1.36.0 · commit 154c0c3", href: "https://github.com/filecoin-project/lotus/tree/154c0c3a46e92006008818bb06aaf959e2e705a9", note: "2026-08-14 stable source snapshot이며 Curio·Boost 전체와 production SLA를 보장하지 않음" },
  ],
  "gpu/hw-memory": [
    {
      kind: "공식 가이드",
      label: "AMD EPYC 9005 Architecture Overview",
      href: "https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf",
      note: "CPU platform의 memory channel·DIMM type·DPC·data-rate 지원 범위",
    },
    {
      kind: "공식 규격",
      label: "JEDEC JESD79-5 — DDR5 SDRAM",
      href: "https://www.jedec.org/standards-documents/docs/jesd79-5c",
      note: "DDR5 device command·timing·burst·transfer semantics의 정본",
    },
    {
      kind: "공식 연구",
      label: "Micron — DDR5 New Features",
      href: "https://www.micron.com/content/dam/micron/global/public/products/white-paper/ddr5-new-features-white-paper.pdf",
      note: "DDR5 subchannel·on-die ECC의 device-internal 보호 경계",
    },
    {
      kind: "공식 규격",
      label: "JEDEC — DDR5 Registered DIMM Design Specification",
      href: "https://www.jedec.org/standards-documents/docs/jesd82-511",
      note: "RCD와 registered DIMM module interface의 규격 경계",
    },
  ],
  "gpu/gpu-architecture": [
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide — Programming Model",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html",
      note: "Grid·block·thread와 SM·warp execution 경계",
    },
    {
      kind: "공식 가이드",
      label: "NVIDIA CUDA C++ Best Practices Guide",
      href: "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/",
      note: "Memory hierarchy·effective bandwidth·profiling 최적화 지침",
    },
    {
      kind: "핵심 논문",
      label: "Williams et al. — Roofline",
      href: "https://escholarship.org/uc/item/3qf383m0",
      note: "Arithmetic intensity로 compute·memory performance roof를 구분하는 원 연구",
    },
  ],
  "gpu/hw-network": [
    {
      kind: "공식 규격",
      label: "IEEE 802.3 Ethernet Working Group standards map",
      href: "https://www.ieee802.org/3/index.html",
      note: "Ethernet MAC·PHY·media amendment와 표준화 상태의 정본",
    },
    {
      kind: "공식 규격",
      label: "InfiniBand Trade Association — About InfiniBand",
      href: "https://www.infinibandta.org/about-infiniband/",
      note: "Ethernet과 대조할 switched fabric·HCA·link architecture 범위",
    },
  ],
  "gpu/gpu-interconnects": [
    {
      kind: "공식 규격",
      label: "PCI-SIG — PCI Express Base Specification",
      href: "https://pcisig.com/specifications",
      note: "PCIe generation별 signaling·lane·transaction protocol의 공식 범위",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA NVLink and NVSwitch",
      href: "https://www.nvidia.com/en-us/data-center/nvlink/",
      note: "제품 세대별 node-local GPU interconnect와 switch 구성 범위",
    },
  ],
  "gpu/rdma-roce": [
    {
      kind: "공식 문서",
      label: "NVIDIA Networking — RDMA over Converged Ethernet",
      href: "https://docs.nvidia.com/networking/display/mlnxenv23102131201lts/RDMA+over+Converged+Ethernet+(RoCE)",
      note: "IP·GID table·RoCE type·QP source GID 선택의 구현 경계",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA GPUDirect RDMA",
      href: "https://docs.nvidia.com/cuda/gpudirect-rdma/",
      note: "GPU memory와 PCIe peer device 사이 direct DMA의 platform·lifetime 제약",
    },
  ],
  "gpu/gpu-collective-network": [
    {
      kind: "공식 규격",
      label: "InfiniBand Trade Association — About InfiniBand",
      href: "https://www.infinibandta.org/about-infiniband/",
      note: "HCA·switch·link·RDMA를 포함한 InfiniBand fabric의 공식 범위",
    },
    {
      kind: "공식 코드",
      label: "NVIDIA nccl-tests — Performance reported by NCCL tests",
      href: "https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md",
      note: "Collective operation별 algbw·busbw 계산과 해석 경계",
    },
  ],
  "gpu/b300-switchless-network": [
    source(
      "공식 문서",
      B300_SWITCHLESS_SOURCE_LINKS.dgx,
      "DGX B300 장치와 포트 기준",
    ),
    source(
      "공식 문서",
      B300_SWITCHLESS_SOURCE_LINKS.split,
      "ConnectX-8 Ethernet port split의 설정 순서와 cold power-cycle 경계",
    ),
    source(
      "공식 문서",
      B300_SWITCHLESS_SOURCE_LINKS.nccl,
      "NCCL network 환경 변수",
    ),
    source(
      "공식 코드",
      B300_SWITCHLESS_SOURCE_LINKS.patch,
      "peer-aware GID 선택 patch",
    ),
    source(
      "공식 코드",
      B300_SWITCHLESS_SOURCE_LINKS.project,
      "주소 생성기와 재현 가능한 설정 파일",
    ),
    {
      kind: "프로젝트 실측",
      label: "SionicAI 2-node nccl-tests ledger",
      note: "16×400G direct link에서 기록한 bus bandwidth",
    },
    {
      kind: "공식 코드",
      label: "NVIDIA nccl-tests performance semantics",
      href: "https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md",
      note: "algbw와 collective별 busbw correction의 계산·해석 경계",
    },
  ],
  "blockchain/distributed-systems": [
    {
      kind: "핵심 논문",
      label:
        "Fischer·Lynch·Paterson — Impossibility of Distributed Consensus with One Faulty Process",
      href: "https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf",
      note: "완전 비동기 deterministic crash-consensus에서 nonterminating admissible execution이 존재하는 범위",
    },
    {
      kind: "핵심 논문",
      label: "Gilbert·Lynch — Brewer's Conjecture and CAP",
      href: "https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf",
      note: "Partition execution에서 atomic consistency와 formal availability를 함께 보장할 수 없는 model",
    },
    {
      kind: "핵심 논문",
      label:
        "Dwork·Lynch·Stockmeyer — Consensus in the Presence of Partial Synchrony",
      href: "https://research.ibm.com/publications/consensus-in-the-presence-of-partial-synchrony",
      note: "Unknown timing bound·unknown GST의 partial-synchrony model과 fault threshold",
    },
    {
      kind: "핵심 논문",
      label: "Lamport·Shostak·Pease — The Byzantine Generals Problem",
      href: "https://lamport.azurewebsites.net/pubs/byz.pdf",
      note: "Oral·signed message model에서 Byzantine interactive consistency의 조건",
    },
    {
      kind: "핵심 논문",
      label: "Chandra·Toueg — Unreliable Failure Detectors",
      href: "https://www.cs.cornell.edu/home/rvr/papers/UnreliableFD.pdf",
      note: "Asynchronous crash system의 completeness·accuracy failure-detector abstraction",
    },
  ],
  "blockchain/smr-theory": [
    {
      kind: "핵심 논문",
      label:
        "Schneider — Implementing Fault-Tolerant Services Using the State Machine Approach",
      href: "https://www.cs.cornell.edu/fbs/publications/SMSurvey.pdf",
      note: "결정적 state machine과 ordered command를 복제해 fault-tolerant service를 만드는 조건",
    },
    {
      kind: "핵심 논문",
      label:
        "Ongaro·Ousterhout — In Search of an Understandable Consensus Algorithm",
      href: "https://raft.github.io/raft.pdf",
      note: "Raft의 leader election·log replication·safety와 crash-majority 전제",
    },
    {
      kind: "핵심 논문",
      label: "Lamport — Paxos Made Simple",
      href: "https://www.microsoft.com/en-us/research/publication/paxos-made-simple/",
      note: "Prepare·promise·Accept와 quorum 교집합으로 chosen value를 보존하는 invariant",
    },
  ],
  "blockchain/consensus-mechanisms": [
    {
      kind: "핵심 논문",
      label: "Nakamoto — Bitcoin: A Peer-to-Peer Electronic Cash System",
      href: "https://bitcoin.org/bitcoin.pdf",
      note: "Hash-based proof-of-work·cumulative-work chain과 double-spend risk의 원문 범위",
    },
    {
      kind: "핵심 논문",
      label: "Buterin et al. — Combining GHOST and Casper",
      href: "https://arxiv.org/abs/2003.03052",
      note: "Stake-weighted block-tree fork choice와 accountable finality gadget의 결합 분석",
    },
    {
      kind: "공식 규격",
      label: "Ethereum Proof-of-Stake Consensus Specifications",
      href: "https://ethereum.github.io/consensus-specs/",
      note: "현재 PoS state transition·fork choice·validator operation의 versioned 정본",
    },
    {
      kind: "공식 규격",
      label: "EIP-3675 — Upgrade consensus to Proof-of-Stake",
      href: "https://eips.ethereum.org/EIPS/eip-3675",
      note: "Ethereum Mainnet execution layer의 PoW→PoS transition 경계",
    },
  ],
  "blockchain/bft-theory": [
    {
      kind: "핵심 논문",
      label: "Lamport·Shostak·Pease — The Byzantine Generals Problem",
      href: "https://lamport.azurewebsites.net/pubs/byz.pdf",
      note: "Oral·signed message model에서 interactive consistency의 조건과 algorithm",
    },
    {
      kind: "핵심 논문",
      label:
        "Dwork·Lynch·Stockmeyer — Consensus in the Presence of Partial Synchrony",
      href: "https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf",
      note: "Unknown bound·GST의 partial-synchrony model과 Byzantine resilience 범위",
    },
    {
      kind: "핵심 논문",
      label: "Castro·Liskov — Practical Byzantine Fault Tolerance",
      href: "https://pmg.csail.mit.edu/papers/osdi99.pdf",
      note: "PBFT normal case·checkpoint·view change와 구현 평가의 원문 범위",
    },
    {
      kind: "핵심 논문",
      label: "Yin et al. — HotStuff",
      href: "https://arxiv.org/abs/1803.05069",
      note: "Chained quorum certificate·pacemaker·responsiveness의 protocol 조건",
    },
  ],
  "blockchain/pos-theory": [
    {
      kind: "핵심 논문",
      label:
        "Bowers·Juels·Oprea — Proofs of Retrievability: Theory and Implementation",
      href: "https://eprint.iacr.org/2008/175",
      note: "Challenge-response와 extractor를 통해 단순 possession이 아니라 encoded file retrievability를 정의하는 이론 범위",
    },
    {
      kind: "핵심 논문",
      label: "Filecoin: A Decentralized Storage Network",
      href: "https://filecoin.io/filecoin.pdf",
      note: "Proof-of-Replication과 Proof-of-Spacetime을 storage market·chain protocol에 연결한 원 논문",
    },
    {
      kind: "공식 문서",
      label: "Filecoin Docs — Proofs",
      href: "https://docs.filecoin.io/basics/the-blockchain/proofs",
      note: "현재 문서가 설명하는 PoRep·Winning PoSt·Window PoSt의 역할과 versioned implementation 경계",
    },
  ],
  "p2p/libp2p": [
    {
      kind: "공식 규격",
      label: "libp2p Specifications — Connection Establishment",
      href: "https://github.com/libp2p/specs/tree/master/connections",
      note: "Transport upgrade·secure channel·stream multiplexer와 protocol negotiation의 interoperable 경계",
    },
    {
      kind: "공식 문서",
      label: "rust-libp2p 0.56 — Transport trait",
      href: "https://docs.rs/libp2p/latest/libp2p/trait.Transport.html",
      note: "Dial·listen·poll associated future/output과 lazy dial semantics의 current API",
    },
    {
      kind: "공식 문서",
      label: "rust-libp2p 0.56 — Swarm and NetworkBehaviour",
      href: "https://docs.rs/libp2p/latest/libp2p/struct.Swarm.html",
      note: "Swarm progress·event stream·close와 protocol state ownership의 current API",
    },
  ],
  "p2p/libp2p-noise": [
    {
      kind: "공식 규격",
      label: "libp2p Specifications — noise-libp2p",
      href: "https://github.com/libp2p/specs/blob/master/noise/README.md",
      note: "XX profile·identity payload·고정 cipher suite·framing·fail-closed 검증 정본",
    },
    {
      kind: "공식 규격",
      label: "Trevor Perrin — The Noise Protocol Framework, Revision 34",
      href: "https://noiseprotocol.org/noise.html",
      note: "Handshake pattern token·SymmetricState·CipherState 처리의 원 명세",
    },
  ],
  "p2p/libp2p-tcp": [
    {
      kind: "공식 문서",
      label: "rust-libp2p 0.56 — TCP Config and Transport",
      href: "https://docs.rs/libp2p/latest/libp2p/tcp/struct.Config.html",
      note: "TCP_NODELAY·backlog·TTL·per-dial port reuse와 Transport implementation의 current API",
    },
    {
      kind: "공식 문서",
      label: "rust-libp2p 0.56 — Transport trait",
      href: "https://docs.rs/libp2p/latest/libp2p/trait.Transport.html",
      note: "Lazy dial future, listen event와 raw connection output의 상위 contract",
    },
  ],
  "p2p/tls-fundamentals": [
    {
      kind: "공식 규격",
      label: "IETF RFC 8446 — TLS 1.3",
      href: "https://www.rfc-editor.org/rfc/rfc8446.html",
      note: "Handshake·record protocol·key schedule·0-RTT security의 normative 정본",
    },
    {
      kind: "공식 규격",
      label: "IETF RFC 5869 — HKDF",
      href: "https://www.rfc-editor.org/rfc/rfc5869.html",
      note: "Extract·Expand primitive와 input/output keying material의 범위",
    },
  ],
  "p2p/quic-fundamentals": [
    {
      kind: "공식 규격",
      label: "IETF RFC 9000 — QUIC transport",
      href: "https://www.rfc-editor.org/rfc/rfc9000.html",
      note: "Connection·packet·stream·flow control·migration의 normative 정본",
    },
    {
      kind: "공식 규격",
      label: "IETF RFC 9001 — TLS in QUIC",
      href: "https://www.rfc-editor.org/rfc/rfc9001.html",
      note: "TLS CRYPTO mapping과 encryption level별 packet protection",
    },
    {
      kind: "공식 규격",
      label: "IETF RFC 9002 — QUIC recovery",
      href: "https://www.rfc-editor.org/rfc/rfc9002.html",
      note: "Loss detection·PTO·congestion control의 기준 algorithm",
    },
  ],
  "p2p/content-addressing": [
    {
      kind: "공식 규격",
      label: "IPFS Standards — CID",
      href: "https://specs.ipfs.tech/cid/",
      note: "CIDv1 binary·string form과 strict decoding의 current specification",
    },
    {
      kind: "공식 규격",
      label: "IPFS Standards — IPNS Record and Protocol",
      href: "https://specs.ipfs.tech/ipns/ipns-record/",
      note: "Mutable name record의 key·signature·sequence·validity·verification 정본",
    },
    {
      kind: "공식 문서",
      label: "IPLD Data Model — Links",
      href: "https://ipld.io/docs/data-model/kinds/#link-kind",
      note: "IPLD Link와 CID가 data model graph를 연결하는 의미",
    },
  ],
  "blockchain/uniswap-v2": [
    { kind: "핵심 논문", label: "Uniswap v2 Core whitepaper", href: "https://docs.uniswap.org/whitepaper.pdf", note: "Constant product·price accumulator·flash swap·optional protocol fee의 공식 설계" },
    { kind: "공식 코드", label: "Uniswap v2-core v1.0.1 @ d2bfbb3649b2", href: "https://github.com/Uniswap/v2-core/tree/d2bfbb3649b265559bec74a7dd878dc1cf01c63c", note: "Pair mint/burn/swap·adjusted K·sqrt(k) fee mint를 고정한 source snapshot" },
  ],
  "blockchain/uniswap-v3": [
    { kind: "핵심 논문", label: "Uniswap v3 Core whitepaper", href: "https://uniswap.org/whitepaper-v3.pdf", note: "Concentrated liquidity·ticks·fee growth·oracle의 공식 설계" },
    { kind: "공식 코드", label: "Uniswap v3-core v1.0.0 @ ef64f51d0f0d", href: "https://github.com/Uniswap/v3-core/tree/ef64f51d0f0dca5346c903484f3e6a771dd69d59/contracts", note: "Pool·TickMath·SqrtPriceMath·SwapMath의 exact rounding·transition snapshot" },
  ],
  "blockchain/aave-v3": [
    { kind: "공식 코드", label: "Aave DAO aave-v3-origin @ cff15de6d127", href: "https://github.com/aave-dao/aave-v3-origin/tree/cff15de6d1271b0c800fc001f4aea4c263e8a597", note: "V3.1–3.x Pool·reserve index·rate·HF·liquidation·mode source snapshot" },
    { kind: "공식 문서", label: "Aave V3 introduction", href: "https://aave.com/help/aave-101/introduction-to-aave", note: "공급·aToken·utilization·overcollateralized borrow·liquidation의 공식 사용자 경계" },
  ],
  "blockchain/compound-v3": [
    { kind: "공식 코드", label: "Compound Finance Comet @ f766f51583c2", href: "https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804", note: "Signed principal·indexes·rate curves·factors·absorb·collateral sale source snapshot" },
    { kind: "공식 문서", label: "Compound III documentation", href: "https://docs.compound.finance/", note: "Deployment artifact·single-base market·proxy integration의 공식 기준" },
    { kind: "공식 문서", label: "Compound III liquidation", href: "https://docs.compound.finance/liquidation/", note: "Reserve-funded absorb·buyCollateral·discount quote의 공식 interface" },
  ],
  "crypto/crypto-primitives": [
    { kind: "핵심 논문", label: "Poseidon · USENIX Security 2021", href: "https://www.usenix.org/conference/usenixsecurity21/presentation/grassi", note: "Prime-field SPN·HADES round strategy와 회로 비용/공격 분석의 원문" },
    { kind: "공식 규격", label: "RFC 8032 · EdDSA: Ed25519 and Ed448", href: "https://www.rfc-editor.org/rfc/rfc8032.html", note: "Ed25519 curve·seed expansion·encoding·sign/verify·test-vector 계약" },
    { kind: "공식 규격", label: "BIP 340 · Schnorr Signatures for secp256k1", href: "https://bips.dev/340/", note: "Tagged hash·x-only key·auxiliary nonce와 exact Schnorr byte contract" },
  ],
  "crypto/csprng": [
    { kind: "공식 규격", label: "NIST SP 800-90A Rev.1 · DRBG", href: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Hash/HMAC/CTR_DRBG instantiate·generate·reseed state-transition 정본" },
    { kind: "공식 규격", label: "NIST SP 800-90B · Entropy Sources", href: "https://csrc.nist.gov/pubs/sp/800/90/b/final", note: "Noise-source min-entropy·conditioning·health-test validation 정본" },
    { kind: "핵심 논문", label: "Mining Your Ps and Qs · USENIX Security 2012", href: "https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger", note: "낮은 entropy가 실제 TLS·SSH key compromise로 이어진 관측 범위" },
  ],
  "crypto/discrete-log": [
    { kind: "핵심 논문", label: "Pollard · Monte Carlo Methods for Index Computation", href: "https://doi.org/10.1090/S0025-5718-1978-0491431-9", note: "Collision walk로 작은 memory와 expected O(√q)를 만드는 rho 원문" },
    { kind: "핵심 논문", label: "Shanks · Class number, a theory of factorization, and genera", href: "https://www.ams.org/books/pspum/020/", note: "Baby-step/giant-step meet-in-the-middle의 고전적 출처와 범위" },
  ],
  "crypto/diffie-hellman": [
    { kind: "핵심 논문", label: "Diffie & Hellman · New Directions in Cryptography", href: "https://ee.stanford.edu/~hellman/publications/24.pdf", note: "공개 채널의 public-key distribution과 exponentiation key-agreement 아이디어 원문" },
    { kind: "공식 규격", label: "RFC 7748 · X25519 and X448", href: "https://www.rfc-editor.org/rfc/rfc7748.html", note: "Curve·scalar decoding·u-coordinate bytes·DH procedure·test-vector contract" },
    { kind: "공식 규격", label: "RFC 5869 · HKDF", href: "https://www.rfc-editor.org/rfc/rfc5869.html", note: "Raw shared material의 extract-then-expand와 salt/info·test-vector 계약" },
    { kind: "공식 규격", label: "NIST SP 800-56A Rev. 3", href: "https://doi.org/10.6028/NIST.SP.800-56Ar3", note: "Discrete-log key establishment의 domain/key validation·derivation·confirmation 범위; 2026 update planning note와 함께 확인" },
  ],
  "crypto/elliptic-curves": [
    { kind: "공식 규격", label: "SECG SEC 1 v2.0 · Elliptic Curve Cryptography", href: "https://www.secg.org/sec1-v2.pdf", note: "Curve domain·point encoding·public-key validation·ECC primitive 기준" },
    { kind: "공식 규격", label: "EIP-196 · alt_bn128 add and scalar multiplication", href: "https://eips.ethereum.org/EIPS/eip-196", note: "BN254 G1 input·infinity·invalid-point·operation contract" },
    { kind: "공식 규격", label: "EIP-197 · alt_bn128 pairing check", href: "https://eips.ethereum.org/EIPS/eip-197", note: "BN254 G1/G2/GT·Fp² encoding·subgroup·product pairing contract" },
  ],
  "crypto/field-arithmetic": [
    { kind: "핵심 논문", label: "Montgomery · Modular Multiplication Without Trial Division", href: "https://www.ams.org/journals/mcom/1985-44-170/S0025-5718-1985-0777282-X/", note: "Coprime radix representation과 REDC의 대수·operand 조건 원문" },
    { kind: "공식 코드", label: "arkworks algebra v0.5.0 @ 7ad88c46", href: "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src", note: "Field trait·bigint·Montgomery backend 주장을 고정한 ark-ff 0.5.0 source snapshot" },
    { kind: "공식 규격", label: "EIP-197 · BN254 field/group boundary", href: "https://eips.ethereum.org/EIPS/eip-197", note: "Base field p·group order q·Fp/Fp² coordinate와 subgroup 요구의 protocol-visible 경계" },
  ],
  "crypto/extension-fields": [
    { kind: "공식 코드", label: "arkworks curves BN254 @ e2d16a27", href: "https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254/src/fields", note: "ark-bn254 0.5.0 API와 함께 읽는 concrete non-residue·tower·Frobenius coefficient source snapshot" },
    { kind: "공식 문서", label: "ark-bn254 0.5.0 crate documentation", href: "https://docs.rs/ark-bn254/0.5.0/ark_bn254/", note: "Fq/Fq2/Fq6/Fq12/Fr public type와 crate version 확인" },
    { kind: "공식 규격", label: "EIP-197 · BN254 G2 and pairing", href: "https://eips.ethereum.org/EIPS/eip-197", note: "G2 Fp² encoding·subgroup·pairing product의 protocol contract; 내부 Fp12 layout 근거와 구분" },
  ],
  "crypto/finite-field-theory": [
    {
      kind: "공식 규격",
      label: "NIST FIPS 186-5 — Digital Signature Standard",
      href: "https://csrc.nist.gov/pubs/fips/186-5/final",
      note: "실제 암호 규격에서 prime·binary field parameter와 validation을 사용하는 범위",
    },
    {
      kind: "핵심 논문",
      label:
        "Schwartz — Fast Probabilistic Algorithms for Verification of Polynomial Identities",
      href: "https://doi.org/10.1145/322186.322189",
      note: "Random polynomial identity test와 degree 기반 false-acceptance bound의 원문",
    },
  ],
  "crypto/lagrange": [
    {
      kind: "공식 문서",
      label: "NIST DLMF §3.3 — Interpolation",
      href: "https://dlmf.nist.gov/3.3",
      note: "Lagrange form과 polynomial interpolation notation의 표준 reference",
    },
    {
      kind: "핵심 논문",
      label: "Berrut & Trefethen — Barycentric Lagrange Interpolation",
      href: "https://doi.org/10.1137/S0036144502417715",
      note: "Barycentric forms·precomputation·floating-point analysis의 원문 범위",
    },
  ],
  "crypto/fft": [
    {
      kind: "핵심 논문",
      label: "Pollard — The Fast Fourier Transform in a Finite Field",
      href: "https://doi.org/10.1007/BF01934338",
      note: "Finite-field roots-of-unity transform과 fast computation의 초기 원문",
    },
    {
      kind: "핵심 논문",
      label:
        "Cooley & Tukey — An Algorithm for the Machine Calculation of Complex Fourier Series",
      href: "https://doi.org/10.1090/S0025-5718-1965-0178586-1",
      note: "Composite-length DFT factorization과 intermediate reuse의 원 논문",
    },
  ],
  "blockchain/helios": [
    { kind: "공식 코드", label: "a16z/helios source snapshot 43a8c9f", href: "https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1", note: "Consensus light client와 execution proof를 local RPC에 연결한 pinned implementation 근거" },
    { kind: "공식 규격", label: "Ethereum consensus-specs v1.6.1 — Altair light client", href: "https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs/altair/light-client", note: "Trusted checkpoint·bootstrap·update·Store의 consensus protocol 정본" },
    { kind: "공식 규격", label: "EIP-1186 — eth_getProof", href: "https://eips.ethereum.org/EIPS/eip-1186", note: "Account·storage proof를 execution state root에 검증하는 RPC envelope" },
  ],
  "blockchain/helios-bootstrap": [
    { kind: "공식 코드", label: "a16z/helios checkpoint and Ethereum source @ 43a8c9f", href: "https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum", note: "Checkpoint input/cache/fallback과 bootstrap integration의 pinned source" },
    { kind: "공식 규격", label: "Ethereum consensus-specs v1.6.1 — light-client bootstrap", href: "https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs/altair/light-client", note: "LightClientBootstrap container·committee branch·Store initialization 정본" },
    { kind: "공식 규격", label: "Ethereum consensus-specs v1.6.1 — Weak Subjectivity", href: "https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/weak-subjectivity.md", note: "Recent checkpoint trust model과 고정 기간 오해를 구분하는 정본" },
  ],
  "blockchain/helios-consensus": [
    { kind: "공식 코드", label: "a16z/helios Ethereum consensus source @ 43a8c9f", href: "https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum", note: "Light-client fetch·Store·sync integration의 pinned implementation 근거" },
    { kind: "공식 규격", label: "Ethereum consensus-specs v1.6.1 — light-client sync protocol", href: "https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/altair/light-client/sync-protocol.md", note: "Update validation·ranking·optimistic/finalized transition·committee period 규칙" },
    { kind: "공식 규격", label: "Ethereum consensus-specs v1.6.1 — BLS and domains", href: "https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs", note: "Fork·genesis·duty domain과 aggregate signature 검증 context" },
  ],
  "blockchain/helios-update": [
    {
      kind: "공식 규격",
      label: "Ethereum consensus-specs v1.6.1 — light-client sync",
      href: "https://github.com/ethereum/consensus-specs/tree/5fa6edcca8ab4cf548653e6680b17b9d3e04d225/specs/altair/light-client",
      note: "Update validation·selection·processing과 optimistic/finalized store의 pinned protocol 정본",
    },
    {
      kind: "공식 코드",
      label: "Helios 0.11.1 — consensus-core update",
      href: "https://github.com/a16z/helios/blob/0.11.1/ethereum/consensus-core/src/consensus_core.rs",
      note: "Verify·apply·best_valid_update·committee handoff·force_update의 stable source snapshot",
    },
  ],
  "blockchain/helios-state": [
    {
      kind: "공식 규격",
      label: "EIP-1186 — eth_getProof",
      href: "https://eips.ethereum.org/EIPS/eip-1186",
      note: "Account·storage value와 existence/absence proof를 반환하는 RPC envelope",
    },
    {
      kind: "공식 규격",
      label: "Ethereum Yellow Paper — pinned state-trie snapshot",
      href: "https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex",
      note: "Secure MPT와 account/storage-root commitment의 고전적 정본",
    },
    {
      kind: "공식 코드",
      label: "Helios 0.11.1 — execution proof verifier",
      href: "https://github.com/a16z/helios/blob/0.11.1/core/src/execution/proof.rs",
      note: "Account·storage·code·receipt proof와 empty-value 처리의 stable source snapshot",
    },
  ],
  "blockchain/helios-execution": [
    {
      kind: "공식 규격",
      label: "Ethereum execution-apis — pinned JSON-RPC schema",
      href: "https://github.com/ethereum/execution-apis/tree/742d45db810b31265c8d3c075af324953330d1ed",
      note: "Call·state·logs·broadcast method의 공식 interface와 result/error schema",
    },
    {
      kind: "공식 규격",
      label: "Ethereum execution-specs — pinned snapshot",
      href: "https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227",
      note: "Fork-aware EVM·transaction·block-environment semantics",
    },
    {
      kind: "공식 코드",
      label: "Helios 0.11.1 — ProofDB and EVM",
      href: "https://github.com/a16z/helios/tree/0.11.1/revm-utils/src",
      note: "Pinned-block ProofDB miss·proof fetch·same-input revm replay의 stable implementation",
    },
  ],
  "blockchain/helios-types": [
    {
      kind: "공식 코드",
      label: "a16z/helios consensus types @ 43a8c9f3",
      href: "https://github.com/a16z/helios/blob/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum/consensus-core/src/types/mod.rs",
      note: "LightClientHeader·Update·Store·SyncAggregate의 fork별 Rust type snapshot",
    },
    {
      kind: "공식 규격",
      label: "Ethereum light-client sync protocol @ 2359a5e3",
      href: "https://github.com/ethereum/consensus-specs/blob/2359a5e3444635ee2fc2acdea8a759e16391af90/specs/altair/light-client/sync-protocol.md",
      note: "Light-client container·validation·Store transition의 protocol 기준",
    },
    {
      kind: "공식 규격",
      label: "Ethereum SSZ specification @ 2359a5e3",
      href: "https://github.com/ethereum/consensus-specs/blob/2359a5e3444635ee2fc2acdea8a759e16391af90/ssz/simple-serialize.md",
      note: "Schema·canonical bytes·hash-tree-root 규칙",
    },
  ],
  "blockchain/helios-config": [
    {
      kind: "공식 코드",
      label: "a16z/helios Ethereum config @ 43a8c9f3",
      href: "https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum/src/config",
      note: "Network default·Figment merge·checkpoint·endpoint typed config의 source snapshot",
    },
    {
      kind: "공식 코드",
      label: "a16z/helios EthereumClientBuilder @ 43a8c9f3",
      href: "https://github.com/a16z/helios/blob/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum/src/builder.rs",
      note: "Explicit builder value와 config fallback을 client construction에 연결하는 구현",
    },
    {
      kind: "공식 문서",
      label: "a16z/helios operator config @ 43a8c9f3",
      href: "https://github.com/a16z/helios/blob/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/config.md",
      note: "Checkpoint age·fallback risk·endpoint·bind·data directory의 operator surface",
    },
    {
      kind: "공식 코드",
      label: "a16z/helios FileDB @ 43a8c9f3",
      href: "https://github.com/a16z/helios/blob/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum/src/database.rs",
      note: "32-byte checkpoint load/save와 malformed/read-failure fallback의 current 동작",
    },
  ],
  "crypto/reed-solomon": [
    { kind: "핵심 논문", label: "Reed & Solomon · Polynomial Codes over Certain Finite Fields", href: "https://doi.org/10.1137/0108018", note: "Finite-field message polynomial evaluation code의 1960 원문" },
    { kind: "공식 규격", label: "RFC 5510 · Reed-Solomon FEC", href: "https://www.rfc-editor.org/rfc/rfc5510.html", note: "GF(2^m) systematic packet-erasure profile·symbol identity·MDS 복구 범위" },
    { kind: "핵심 논문", label: "Fast Reed-Solomon Interactive Oracle Proofs of Proximity", href: "https://doi.org/10.4230/LIPIcs.ICALP.2018.14", note: "FRI의 RS proximity problem·folding protocol·complexity와 soundness 분석" },
  ],
  "blockchain/erasure-coding": [
    {
      kind: "공식 규격",
      label: "RFC 5510 · Reed-Solomon FEC",
      href: "https://www.rfc-editor.org/rfc/rfc5510.html",
      note: "GF(2^m) packet erasure profile·systematic MDS·symbol identity의 표준 범위",
    },
    {
      kind: "핵심 논문",
      label: "Fraud and Data Availability Proofs",
      href: "https://arxiv.org/abs/1809.09044",
      note: "2D erasure-coded Merkle tree·sampling·invalid-encoding fraud proof construction",
    },
    {
      kind: "공식 규격",
      label: "EIP-7594 · PeerDAS",
      href: "https://eips.ethereum.org/EIPS/eip-7594",
      note: "Ethereum blob row의 1D extension·cell KZG proof·column custody와 sampling",
    },
    {
      kind: "공식 규격",
      label: "RFC 6330 · RaptorQ FEC",
      href: "https://www.rfc-editor.org/rfc/rfc6330.html",
      note: "Rateless source·repair symbol identity와 compliant decoder 요구",
    },
    {
      kind: "공식 규격",
      label: "RFC 5170 · LDPC Staircase and Triangle FEC",
      href: "https://www.rfc-editor.org/rfc/rfc5170.html",
      note: "Sparse graph 기반 large-object FEC의 구체 profile",
    },
  ],
  "blockchain/aa-fundamentals": [
    {
      kind: "공식 규격",
      label: "ERC-4337 · Account Abstraction Using Alt Mempool",
      href: "https://eips.ethereum.org/EIPS/eip-4337",
      note: "UserOperation·Bundler·EntryPoint·Paymaster의 protocol contract",
    },
    {
      kind: "공식 규격",
      label: "ERC-7562 · Validation Scope Rules",
      href: "https://eips.ethereum.org/EIPS/eip-7562",
      note: "Bundler admission의 opcode·storage·reputation·second-validation 경계",
    },
    {
      kind: "공식 규격",
      label: "EIP-7702 · Set Code for EOAs (Final)",
      href: "https://eips.ethereum.org/EIPS/eip-7702",
      note: "Type-4 authorization tuple과 persistent delegation indicator",
    },
    {
      kind: "공식 규격",
      label: "EIP-7701 · Native Account Abstraction (Withdrawn)",
      href: "https://eips.ethereum.org/EIPS/eip-7701",
      note: "Withdrawn proposal의 validation/execution role 설계와 현재 상태",
    },
  ],
  "isms-aml/isms-overview": [
    {
      kind: "공식 규격",
      label: "정보통신망법 제47조 · 2026-07-07 시행",
      href: "https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900628579",
      note: "대한민국 ISMS 의무·3년 유효기간·연 1회 이상 사후관리의 현재 법적 틀(2026-08-14 확인)",
    },
    {
      kind: "공식 문서",
      label: "KISA ISMS-P 인증대상 안내",
      href: "https://www.isms-p.or.kr/cert/aply/selectCertTrgtDetail.do",
      note: "ISP·IDC·매출·이용자 기준과 자율신청을 구분하는 현재 제도 안내(개별 법률판단 아님)",
    },
    {
      kind: "공식 가이드",
      label: "KISA ISMS-P 인증기준 안내서 2023.11",
      href: "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do",
      note: "관리체계·보호대책·개인정보 기준의 확인사항·결함·증적 해설이며 현행 법령과 함께 적용",
    },
  ],
  "isms-aml/isms-practical-guide": [
    {
      kind: "공식 규격",
      label: "특정금융정보법 시행령 제10조의11 · VASP 신고",
      href: "https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=167095",
      note: "VASP 신고 첨부서류에 정보보호 관리체계 인증 자료를 두는 대한민국 현행 조문(2026-08-14 확인)",
    },
    {
      kind: "공식 가이드",
      label: "KISA ISMS-P 인증기준 안내서 2023.11",
      href: "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do",
      note: "Control gap·결함·운영 증적을 해석하는 출발점이며 제품·주기의 유일한 구현 기준은 아님",
    },
    {
      kind: "공식 규격",
      label: "개인정보의 안전성 확보조치 기준 제2026-9호",
      href: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201",
      note: "최소 권한·변경말소·권한 기록·개인별 계정·인증수단의 현재 법정 최소선(2026-08-14 확인)",
    },
  ],
  "isms-aml/isms-access-control": [
    {
      kind: "공식 가이드",
      label: "KISA ISMS-P 인증기준 안내서 · 2.5·2.6",
      href: "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do",
      note: "인증·권한관리와 network·system·application 접근통제의 심사 해설",
    },
    {
      kind: "공식 연구",
      label: "NIST SP 800-207 · Zero Trust Architecture",
      href: "https://csrc.nist.gov/pubs/sp/800/207/final",
      note: "Network 위치와 identity·resource authorization을 분리하는 기술 reference이며 한국 법적 의무의 대체가 아님",
    },
    {
      kind: "공식 규격",
      label: "개인정보의 안전성 확보조치 기준 제2026-9호",
      href: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201",
      note: "개인정보처리시스템 최소 권한·회수·3년 기록·공유 제한의 현재 법정 기준(2026-08-14 확인)",
    },
  ],
  "isms-aml/isms-auth-management": [
    {
      kind: "공식 가이드",
      label: "KISA ISMS-P 인증기준 안내서 · 2.5 인증 및 권한관리",
      href: "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do",
      note: "계정·식별·인증·비밀번호의 심사 해설이며 현행 법령·조직 위험과 함께 적용",
    },
    {
      kind: "공식 규격",
      label: "NIST SP 800-63B-4 · Authenticator Management",
      href: "https://pages.nist.gov/800-63-4/sp800-63b/authenticators/",
      note: "Password·MFA·phishing resistance·recovery의 기술 기준이며 한국 법적 의무의 대체가 아님",
    },
    {
      kind: "공식 규격",
      label: "개인정보의 안전성 확보조치 기준 제2026-9호",
      href: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201",
      note: "개인정보 계정·인증수단·변경말소·기록의 현재 법정 최소선(2026-08-14 확인)",
    },
  ],
  "p2p/kademlia": [
    { kind: "핵심 논문", label: "Maymounkov & Mazières — Kademlia", href: "https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf", note: "XOR metric·k-bucket·iterative lookup 원 설계와 분석 전제" },
    { kind: "공식 코드", label: "go-ethereum — p2p/discover/table.go", href: "https://github.com/ethereum/go-ethereum/blob/master/p2p/discover/table.go", note: "Current bucket·replacement·IP quota·refresh 상수와 구현 경로" },
  ],
  "p2p/kad-lookup": [
    { kind: "핵심 논문", label: "Maymounkov & Mazières — Kademlia lookup", href: "https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf", note: "Alpha 병렬 query·shortlist·closest-node termination의 원 논문 범위" },
    { kind: "공식 코드", label: "go-ethereum — discovery package", href: "https://github.com/ethereum/go-ethereum/tree/master/p2p/discover", note: "Current discv4/v5 lookup scheduling·validation·refresh 구현이며 배포 SHA를 별도 고정" },
  ],
  "p2p/dht-security": [
    { kind: "핵심 논문", label: "Douceur — The Sybil Attack", href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2002/01/IPTPS2002.pdf", note: "Entity와 여러 identity의 독립성 문제 및 trusted identification 경계" },
    { kind: "핵심 논문", label: "Heilman et al. — Eclipse Attacks on Bitcoin’s P2P Network", href: "https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-heilman.pdf", note: "Victim view capture 단계와 방어 평가 방법이며 Bitcoin 당시 구현에 범위를 한정" },
    { kind: "공식 코드", label: "go-ethereum — p2p/discover/table.go", href: "https://github.com/ethereum/go-ethereum/blob/master/p2p/discover/table.go", note: "IP quota·replacement·initialization guard·revalidation의 current 구현 사실" },
  ],
  "p2p/gossip-fundamentals": [
    { kind: "핵심 논문", label: "Demers et al. — Epidemic Algorithms", href: "https://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf", note: "Anti-entropy·rumor mongering의 확률적 dissemination 원 모델" },
    { kind: "핵심 논문", label: "Das, Gupta & Motivala — SWIM", href: "https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf", note: "Failure detection과 infection-style membership dissemination의 분리" },
    { kind: "공식 규격", label: "libp2p GossipSub v1.1 Specification", href: "https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md", note: "Mesh maintenance·IHAVE/IWANT·peer score와 threshold action 정본" },
  ],
  "p2p/bittorrent": [
    { kind: "공식 규격", label: "BEP 3 — The BitTorrent Protocol Specification", href: "https://www.bittorrent.org/beps/bep_0003.html", note: "Final v1 metainfo·tracker·peer handshake·piece hash·choking wire의 정본이며 BEP 52 v2와 구분" },
    { kind: "공식 규격", label: "BEP 5 — DHT Protocol", href: "https://www.bittorrent.org/beps/bep_0005.html", note: "Accepted trackerless peer discovery의 KRPC·get_peers·announce_peer·token 경계" },
  ],
  "p2p/discv4": [
    { kind: "공식 규격", label: "Ethereum devp2p — Node Discovery Protocol v4", href: "https://github.com/ethereum/devp2p/blob/master/discv4.md", note: "Current protocol version 4의 identity·endpoint proof·FINDNODE·1280-byte signed plaintext UDP wire" },
    { kind: "공식 규격", label: "Ethereum devp2p — Ethereum Node Records", href: "https://github.com/ethereum/devp2p/blob/master/enr.md", note: "ENR signature·uint64 sequence·sorted unique key/value와 identity-scheme validation 정본" },
  ],
  "p2p/discv5": [
    { kind: "공식 규격", label: "Ethereum devp2p — Discovery v5.1 Wire Protocol", href: "https://github.com/ethereum/devp2p/blob/master/discv5/discv5-wire.md", note: "Protocol v5.1 packet masking·AES-GCM·WHOAREYOU·FINDNODE/NODES·TALK wire 정본" },
    { kind: "공식 규격", label: "Ethereum devp2p — Discovery v5.1 Theory", href: "https://github.com/ethereum/devp2p/blob/master/discv5/discv5-theory.md", note: "Identity proof·ephemeral-static ECDH·HKDF directional keys·session cache·lookup algorithm 정본" },
    { kind: "공식 규격", label: "Ethereum devp2p — Ethereum Node Records", href: "https://github.com/ethereum/devp2p/blob/master/enr.md", note: "Discv5 handshake와 routing이 재사용하는 signed identity·endpoint record 정본" },
  ],
  "p2p/nat-traversal": [
    { kind: "공식 규격", label: "RFC 8489 — STUN", href: "https://www.rfc-editor.org/rfc/rfc8489.html", note: "Binding transaction과 XOR-MAPPED-ADDRESS의 current Standards Track semantics" },
    { kind: "공식 규격", label: "RFC 8656 — TURN", href: "https://www.rfc-editor.org/rfc/rfc8656.html", note: "Allocation·authentication·permission·channel·refresh·expiry relay lifecycle 정본" },
    { kind: "공식 규격", label: "RFC 8445 — ICE", href: "https://www.rfc-editor.org/rfc/rfc8445.html", note: "Candidate checklist·pair priority·connectivity check·nomination·restart 정본" },
    { kind: "공식 규격", label: "libp2p Specification — DCUtR", href: "https://github.com/libp2p/specs/blob/master/relay/DCUtR.md", note: "Active revision r1 Connect·Sync·relay RTT·simultaneous TCP/QUIC direct upgrade 경계" },
  ],
  "blockchain/rollup-fundamentals": [
    { kind: "공식 규격", label: "OP Stack Specification · L2 Chain Derivation", href: "https://specs.optimism.io/protocol/derivation.html", note: "L1 retrieval·frame·channel·batch·payload와 unsafe/safe/finalized reset의 current 공식 경계" },
    { kind: "공식 규격", label: "OP Stack Specification · Fault Proof", href: "https://specs.optimism.io/fault-proof/index.html", note: "Agreed pre-state·L1 data·preimage oracle에서 disputed transition을 재현하는 공식 fault-proof 범위" },
    { kind: "공식 문서", label: "Ethereum.org · Optimistic rollups", href: "https://ethereum.org/developers/docs/scaling/optimistic-rollups/", note: "Batch data·state commitment·challenge period와 fault proof의 protocol-independent overview" },
  ],
  "blockchain/da-theory": [
    { kind: "공식 규격", label: "EIP-4844 · Shard Blob Transactions", href: "https://eips.ethereum.org/EIPS/eip-4844", note: "Blob transaction·sidecar·KZG commitment·versioned hash와 fixed blob serialization의 공식 경계" },
    { kind: "핵심 논문", label: "Kate–Zaverucha–Goldberg · Polynomial Commitments", href: "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf", note: "Constant-size polynomial commitment와 evaluation opening의 원 논문이며 network availability 근거는 아님" },
    { kind: "공식 규격", label: "EIP-7594 · PeerDAS", href: "https://eips.ethereum.org/EIPS/eip-7594", note: "EIP-4844 blob row의 1D extension·cell proof·data-column custody와 peer sampling 규격" },
    { kind: "공식 문서", label: "Celestia App Specification · Data Structures", href: "https://celestiaorg.github.io/celestia-app/data_structures.html", note: "Celestia data square·2D Reed–Solomon extension·namespaced commitment의 공식 application 구조" },
    { kind: "핵심 논문", label: "Fraud and Data Availability Proofs", href: "https://arxiv.org/abs/1809.09044", note: "2D erasure-coded Merkle tree·sampling·invalid-encoding fraud proof의 원 연구" },
  ],
  "blockchain/longest-chain": [
    { kind: "공식 코드", label: "Bitcoin Core · chainwork implementation", href: "https://github.com/bitcoin/bitcoin/blob/master/src/chain.cpp", note: "Compact target를 integer block work로 바꾸고 CBlockIndex에 누적하는 current 구현이며 재현 시 commit pin 필요" },
    { kind: "핵심 논문", label: "Bitcoin: A Peer-to-Peer Electronic Cash System", href: "https://bitcoin.org/bitcoin.pdf", note: "Cumulative-work chain과 attacker catch-up의 random-walk·Poisson confirmation 모델 원문" },
    { kind: "핵심 논문", label: "The Bitcoin Backbone Protocol", href: "https://eprint.iacr.org/2014/765.pdf", note: "Common prefix·chain growth·chain quality의 명시적 theorem과 network·honest-power assumptions" },
  ],
  "tee/hw-security": [
    { kind: "공식 규격", label: "NIST SP 800-193 · Platform Firmware Resiliency Guidelines", href: "https://csrc.nist.gov/pubs/sp/800/193/final", note: "Platform firmware와 critical data의 protection·detection·recovery 원칙이며 특정 TEE 안전 인증은 아님" },
  ],
  "tee/tee-tcb": [
    { kind: "공식 규격", label: "TCG PC Client Platform Firmware Profile 1.06", href: "https://trustedcomputinggroup.org/resource/pc-client-specific-platform-firmware-profile-specification/", note: "TPM 2.0 PC client boot event·PCR extend·event-log 순서의 정본" },
    { kind: "공식 규격", label: "TCG PC Client Reference Integrity Manifest", href: "https://trustedcomputinggroup.org/resource/tcg-pc-client-reference-integrity-manifest-specification/", note: "Boot-cycle quote와 log를 평가할 reference integrity information 정본" },
  ],
  "tee/tee-memory": [
    { kind: "공식 규격", label: "AMD SEV-SNP Firmware ABI Specification 1.58", href: "https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP", note: "SNP guest request·page state·attestation report의 vendor ABI" },
    { kind: "공식 문서", label: "Intel Trust Domain Extensions Documentation", href: "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/documentation.html", note: "Current TDX architecture·ABI·security guidance·attestation revision 진입점" },
  ],
  "tee/tee-attestation": [
    { kind: "공식 규격", label: "RFC 9334 · RATS Architecture", href: "https://www.rfc-editor.org/rfc/rfc9334.html", note: "Attester·Verifier·Relying Party와 evidence·result·appraisal·freshness의 vendor-neutral 정본" },
    { kind: "공식 규격", label: "AMD SEV-SNP Firmware ABI Specification 1.58", href: "https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP", note: "SNP attestation report request·field·signature interface의 vendor 정본" },
  ],
  "blockchain/bplus-tree": [
    { kind:"핵심 논문", label:"Bayer & McCreight · Organization and Maintenance of Large Ordered Indices", href:"https://doi.org/10.1007/BF00288683", note:"Page-oriented balanced multiway index의 primary paper" },
    { kind:"공식 코드", label:"PostgreSQL nbtree @ eb983d0", href:"https://github.com/postgres/postgres/tree/eb983d0a94f666d91058552117d029939821d648/src/backend/access/nbtree", note:"Production ordered-index implementation의 pinned source" },
  ],
  "blockchain/lsm-tree": [
    { kind:"핵심 논문", label:"O’Neil et al. · The Log-Structured Merge-Tree", href:"https://doi.org/10.1007/s002360050048", note:"LSM architecture·rolling merge의 primary paper" },
    { kind:"공식 코드", label:"facebook/rocksdb @ 2dc6bc5", href:"https://github.com/facebook/rocksdb/tree/2dc6bc51b498c7fcae16e78a54de9058181c8b75", note:"WAL·memtable·SST·compaction·stall의 pinned implementation" },
  ],
  "blockchain/mdbx-internals": [
    { kind:"핵심 논문", label:"Chu · MDB: A Memory-Mapped Database and Backend for OpenLDAP", href:"https://www.openldap.org/pub/hyc/mdb-paper.pdf", note:"mmap·CoW·MVCC design lineage의 primary paper" },
    { kind:"공식 코드", label:"Mithril-mine/libmdbx @ f7a3a93", href:"https://github.com/Mithril-mine/libmdbx/tree/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0", note:"MDBX transaction·page·DUPSORT의 pinned source" },
  ],
  "blockchain/merkle-patricia-trie": [
    { kind:"공식 문서", label:"ethereum.org · Merkle Patricia Trie", href:"https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie/", note:"MPT node/path/root 구조의 official documentation" },
    { kind:"공식 코드", label:"ethereum/go-ethereum trie @ 6bb0588", href:"https://github.com/ethereum/go-ethereum/tree/6bb0588ad8e7f922e4ad5580f51265a4097af08f/trie", note:"MPT update·encoding·proof의 pinned client source" },
  ],
  "crypto/elgamal": [
    { kind: "핵심 논문", label: "ElGamal · A Public-Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms", href: "https://doi.org/10.1109/TIT.1985.1057074", note: "Randomized group encryption construction의 primary paper" },
    { kind: "공식 규격", label: "RFC 6090 · Fundamental Elliptic Curve Cryptography Algorithms", href: "https://www.rfc-editor.org/rfc/rfc6090.html", note: "EC group instance·validation/security considerations의 standard reference" },
  ],
  "crypto/mpc": [
    { kind: "공식 코드", label: "bnb-chain/tss-lib @ 3f677ff", href: "https://github.com/bnb-chain/tss-lib/tree/3f677ff761fcf692edb0243a5d812930844d879a", note: "Threshold DKG/MtA/VSS implementation의 pinned source" },
  ],
  "crypto/shamir-secret-sharing": [
    { kind: "핵심 논문", label: "Shamir · How to Share a Secret", href: "https://doi.org/10.1145/359168.359176", note: "Threshold polynomial sharing의 primary paper" },
  ],
  "crypto/paillier-cryptosystem": [
    { kind: "핵심 논문", label: "Paillier · Public-Key Cryptosystems Based on Composite Degree Residuosity Classes", href: "https://link.springer.com/chapter/10.1007/3-540-48910-X_16", note: "Probabilistic additive-homomorphic encryption의 primary paper" },
  ],
  "crypto/scroll-zkevm": [
    { kind: "공식 문서", label: "Scroll zkEVM Overview", href: "https://docs.scroll.io/en/technology/zkevm/zkevm-overview/", note: "EVM state-transition validity proof의 official architecture boundary" },
    { kind: "공식 코드", label: "scroll-tech/zkevm-circuits @ 18f5bc2", href: "https://github.com/scroll-tech/zkevm-circuits/tree/18f5bc268ca11988690c7cf59fc4615372ce99f2", note: "Halo2 trace/table/gadget implementation의 pinned snapshot" },
  ],
  "blockchain/railgun": [
    { kind: "공식 문서", label: "RAILGUN Protocol Wiki", href: "https://docs.railgun.org/wiki", note: "Shielded note·transaction·relayer architecture의 official documentation" },
    { kind: "공식 코드", label: "Railgun-Privacy/contract @ 30da515", href: "https://github.com/Railgun-Privacy/contract/tree/30da51509975013720529ec146c3cecc0f87088b", note: "Commitment·nullifier·verifier contract state machine의 pinned source" },
  ],
  "crypto/circom": [
    { kind: "핵심 논문", label: "Circom: A Circuit Description Language", href: "https://eprint.iacr.org/2020/1003.pdf", note: "Template·signal·constraint compiler design의 primary paper" },
    { kind: "공식 코드", label: "iden3/circom @ a100fae", href: "https://github.com/iden3/circom/tree/a100faedb1c62d4d3e1463f8a3f88342d82351cd", note: "Compiler·artifact·tests의 pinned official source" },
  ],
  "crypto/jolt": [
    { kind: "핵심 논문", label: "Jolt: SNARKs for Virtual Machines via Lookups", href: "https://eprint.iacr.org/2023/1217.pdf", note: "Lookup-based zkVM arithmetization의 primary paper" },
    { kind: "공식 코드", label: "a16z/jolt @ 915faf4", href: "https://github.com/a16z/jolt/tree/915faf453f36871249615a7fdf2704d77a88f259", note: "Rust implementation·tests의 pinned official source" },
  ],
  "crypto/libiop": [
    { kind: "핵심 논문", label: "Aurora: Transparent Succinct Arguments for R1CS", href: "https://eprint.iacr.org/2018/828.pdf", note: "R1CS-to-IOP reduction과 transparent argument의 primary paper" },
    { kind: "공식 코드", label: "scipr-lab/libiop @ a2ed2ec", href: "https://github.com/scipr-lab/libiop/tree/a2ed2ec2f3e85f29b6035951553b02cb737c817a", note: "IOP·BCS components의 pinned research source" },
  ],
  "crypto/plonky3": [
    { kind: "핵심 논문", label: "Scalable, transparent, and post-quantum secure computational integrity", href: "https://eprint.iacr.org/2018/046.pdf", note: "AIR·FRI·hash-based STARK pipeline의 primary paper" },
    { kind: "공식 코드", label: "Plonky3/Plonky3 @ f5b7977", href: "https://github.com/Plonky3/Plonky3/tree/f5b7977e5c89adc8375b5c63a5a5092985b1f603", note: "Generic config·proof pipeline의 pinned official source" },
  ],
  "crypto/extension-field-theory": [{ kind:"핵심 논문", label:"Lidl & Niederreiter · Finite Fields", href:"https://doi.org/10.1017/CBO9780511525926", note:"Minimal polynomial·tower·Frobenius의 수학적 정본" }],
  "crypto/pairing": [{ kind:"핵심 논문", label:"Miller · Weil Pairing", href:"https://crypto.stanford.edu/miller/miller.pdf", note:"Miller function recurrence 원 연구" },{ kind:"핵심 논문", label:"Hess et al. · Eta Pairing Revisited", href:"https://eprint.iacr.org/2006/110.pdf", note:"Ate-family pairing construction" }],
  "blockchain/vdf": [{ kind:"핵심 논문", label:"Boneh et al. · VDF", href:"https://eprint.iacr.org/2018/601.pdf", note:"VDF definitions and constructions" },{ kind:"핵심 논문", label:"Wesolowski · Efficient VDF", href:"https://eprint.iacr.org/2018/623.pdf", note:"Quotient proof construction" }],
  "blockchain/drand": [{ kind:"공식 문서", label:"drand specification", href:"https://docs.drand.love/docs/specification/", note:"Threshold beacon protocol specification" },{ kind:"공식 코드", label:"drand @ 2363f3b", href:"https://github.com/drand/drand/tree/2363f3b9ba5fd6f14e0b84a096b248479790d75d", note:"Pinned official source" }],
  "crypto/hash-theory": [
    { kind: "공식 규격", label: "NIST FIPS 180-4", href: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-2 padding·compression·digest의 normative standard" },
    { kind: "공식 규격", label: "NIST FIPS 202", href: "https://csrc.nist.gov/pubs/fips/202/final", note: "SHA-3/SHAKE와 KECCAK permutation·suffix의 normative standard" },
    { kind: "공식 코드", label: "RustCrypto/hashes @ f6c786d", href: "https://github.com/RustCrypto/hashes/tree/f6c786d72ed4d37a32dcd32daa2e7277dd4683e1", note: "Streaming hash implementations/tests의 pinned source" },
  ],
  "crypto/poseidon-hash": [
    { kind: "핵심 논문", label: "Grassi et al. · Poseidon", href: "https://eprint.iacr.org/2019/458.pdf", note: "HADES·field S-box·parameter/security/cost analysis의 원 연구" },
    { kind: "후속 분석", label: "Algebraic cryptanalysis of Poseidon", href: "https://eprint.iacr.org/2023/537.pdf", note: "명시된 variant의 reduced-round algebraic attack 분석이며 production full-round Poseidon/Poseidon2 전체가 깨졌다는 뜻은 아님" },
    { kind: "공식 코드", label: "HorizenLabs/poseidon2 @ 055bde3", href: "https://github.com/HorizenLabs/poseidon2/tree/055bde3f4782731ba5f5ce5888a440a94327eaf3", note: "Poseidon2 parameter·Rust implementation의 pinned source" },
  ],
  "blockchain/impl-hash-commitment": [
    { kind: "공식 규격", label: "NIST FIPS 180-4", href: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", note: "SHA-2 known-vector compatible semantics" },
    { kind: "공식 코드", label: "arkworks crypto-primitives @ 7816710", href: "https://github.com/arkworks-rs/crypto-primitives/tree/7816710fc19cd4d18d6239785dac8937d7b9b3ce", note: "Native/circuit hash·Merkle primitives/tests의 pinned source" },
  ],
  "crypto/proofofsql": [
    { kind: "공식 코드", label: "Space and Time Proof of SQL @ 8b0de6b", href: "https://github.com/spaceandtimefdn/sxt-proof-of-sql/tree/8b0de6b9b9c2e2ef6d20e5a9faf833c3ab1d0829", note: "지원 query·protocol·tests·bench의 pinned official source" },
    { kind: "핵심 논문", label: "Lee · Dory", href: "https://eprint.iacr.org/2020/1274.pdf", note: "Transparent generalized inner-product commitment/opening의 원 연구" },
  ],
  "crypto/bulletproofs": [
    { kind: "핵심 논문", label: "Bünz et al. · Bulletproofs", href: "https://eprint.iacr.org/2017/1066.pdf", note: "Logarithmic-size inner-product range proof·aggregation과 security/evaluation의 원 연구" },
    { kind: "공식 코드", label: "dalek-cryptography/bulletproofs @ be67b6d", href: "https://github.com/dalek-cryptography/bulletproofs/tree/be67b6d5f5ad1c1f54d5511b52e6d645a1313d07", note: "Ristretto·Merlin transcript·generator/range implementation의 pinned source" },
  ],
  "crypto/halo2": [
    { kind: "핵심 논문", label: "Bowe et al. · Halo", href: "https://eprint.iacr.org/2019/1021.pdf", note: "IPA commitment·accumulation과 setup-free recursive composition의 원 연구" },
    { kind: "공식 코드", label: "zcash/halo2 @ cafc26e", href: "https://github.com/zcash/halo2/tree/cafc26e269e4b1b123af8f2a0aa36bff6474448e", note: "Zcash Halo2 columns·regions·keygen/prove/verify·IPA profile의 pinned source" },
  ],
  "crypto/hyperplonk": [
    { kind: "핵심 논문", label: "Chen et al. · HyperPlonk", href: "https://eprint.iacr.org/2022/1355.pdf", note: "Boolean hypercube·sumcheck·high-degree custom gate와 linear-time prover 분석의 원 연구" },
    { kind: "공식 코드", label: "EspressoSystems/hyperplonk @ 2a3b55c", href: "https://github.com/EspressoSystems/hyperplonk/tree/2a3b55c97ad8a5d6627108a2e7def2aeccb7f3b9", note: "공식 unaudited Rust reference implementation의 pinned source" },
  ],
  "crypto/nova": [
    { kind: "핵심 논문", label: "Kothapalli et al. · Nova", href: "https://eprint.iacr.org/2021/370.pdf", note: "Relaxed R1CS·NIFS folding·IVC construction과 security의 원 연구" },
    { kind: "공식 코드", label: "microsoft/Nova @ 9092303", href: "https://github.com/microsoft/Nova/tree/909230314a7173b0f96d06e0c810d10f65f599f1", note: "Nova IVC·folding·compression backends의 pinned official source" },
  ],
  "crypto/polycommit": [
    { kind: "핵심 논문", label: "Kate·Zaverucha·Goldberg · Polynomial Commitments", href: "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf", note: "Degree-bounded pairing SRS를 이용한 constant-size polynomial commitment와 evaluation witness의 원 연구" },
    { kind: "핵심 논문", label: "Bowe·Grigg·Hopwood · Halo", href: "https://eprint.iacr.org/2019/1021.pdf", note: "Inner-product polynomial commitment와 setup-free recursive proof composition의 원 연구" },
  ],
  "crypto/fri": [
    { kind: "핵심 논문", label: "Ben-Sasson et al. · Fast Reed–Solomon IOP of Proximity", href: "https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14", note: "Reed–Solomon oracle proximity와 recursive even/odd folding·soundness의 원 연구" },
  ],
  "crypto/stark-theory": [
    { kind: "핵심 논문", label: "Ben-Sasson et al. · Scalable, transparent, and post-quantum secure computational integrity", href: "https://eprint.iacr.org/2018/046.pdf", note: "Trace·AIR·oracle commitment·FRI를 잇는 STARK construction과 당시 evaluation의 원 연구" },
    { kind: "핵심 논문", label: "Ben-Sasson et al. · FRI", href: "https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14", note: "STARK pipeline의 low-degree proximity 구성요소와 별도 soundness 경계" },
  ],
  "crypto/zk-theory": [
    { kind: "핵심 논문", label: "Goldwasser·Micali·Rackoff · Knowledge Complexity", href: "https://doi.org/10.1137/0218012", note: "Interactive proof와 simulator 기반 zero-knowledge 정의의 토대" },
    { kind: "핵심 논문", label: "Fiat·Shamir · How To Prove Yourself", href: "https://doi.org/10.1007/3-540-47721-7_12", note: "Public-coin identification challenge를 hash로 바꾸는 non-interactive 변환의 원 연구" },
  ],
  "crypto/constraint-systems": [
    { kind: "핵심 논문", label: "Parno et al. · Pinocchio", href: "https://eprint.iacr.org/2013/279.pdf", note: "Arithmetic circuit→QAP reduction·pairing 기반 public verification과 당시 implementation evaluation의 원 연구" },
  ],
  "crypto/snark-overview": [
    { kind: "핵심 논문", label: "Ben-Sasson et al. · SNARKs for C", href: "https://eprint.iacr.org/2013/507", note: "Publicly-verifiable non-interactive argument·zero knowledge·knowledge soundness와 TinyRAM/QAP prototype의 원 연구" },
    { kind: "핵심 논문", label: "Groth · Pairing-based Non-interactive Arguments", href: "https://eprint.iacr.org/2016/260.pdf", note: "Groth16의 preprocessing SNARK construction과 proof/verifier size 경계" },
    { kind: "핵심 논문", label: "Gabizon et al. · PLONK", href: "https://eprint.iacr.org/2019/953.pdf", note: "Universal updatable SRS·permutation argument 계열의 비교 원문" },
  ],
  "crypto/groth16": [
    { kind: "핵심 논문", label: "Groth · On the Size of Pairing-based Non-interactive Arguments", href: "https://eprint.iacr.org/2016/260.pdf", note: "세 group element proof·pairing verification·relation-specific CRS와 security model의 원 연구" },
    { kind: "공식 코드", label: "ark-groth16 verifier.rs", href: "https://docs.rs/ark-groth16/latest/src/ark_groth16/verifier.rs.html", note: "Prepared VK·public-input MSM·multi-Miller loop·final exponentiation의 versioned Rust source; crate/version pin 필요" },
  ],
  "crypto/plonk": [
    { kind: "핵심 논문", label: "Gabizon·Williamson·Ciobotaru · PLONK", href: "https://eprint.iacr.org/2019/953.pdf", note: "Lagrange-basis gates·permutation grand product·universal updatable SRS construction의 원 연구" },
    { kind: "핵심 논문", label: "Kate·Zaverucha·Goldberg · Polynomial Commitments", href: "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf", note: "상수 크기 polynomial commitment와 evaluation opening의 원 연구; PLONK arithmetization 보장은 아님" },
  ],
  "crypto/crt": [
    { kind: "공식 규격", label: "RFC 8017 · PKCS #1 v2.2", href: "https://www.rfc-editor.org/rfc/rfc8017.html", note: "Two-prime RSA private key의 p·q·dP·dQ·qInv와 RSA primitive 입력·오류 계약" },
    { kind: "보충 읽기", label: "NIST DLMF §27.15 · Chinese Remainder Theorem", href: "https://dlmf.nist.gov/27.15", note: "Pairwise-coprime congruence system의 구성·유일성 표기 reference" },
  ],
  "crypto/karatsuba": [
    { kind: "핵심 논문", label: "Karatsuba & Ofman · Multiplication of many-digital numbers", href: "https://www.mathnet.ru/eng/dan26729", note: "Operand 분할로 quadratic보다 낮은 multiplication complexity를 구성한 1962 원문" },
    { kind: "공식 문서", label: "GNU MP 6.3.0 · Karatsuba Multiplication", href: "https://gmplib.org/manual/Karatsuba-Multiplication.html", note: "세 곱 공식·odd-size split·carry/addition·target threshold의 production 구현 설명" },
  ],
  "crypto/sparse-multiplication": [
    { kind: "공식 코드", label: "arkworks algebra 0.5.0 Fp12 @ 7ad88c46", href: "https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs", note: "mul_by_034·mul_by_014와 pinned coefficient-layout lowering source" },
    { kind: "핵심 논문", label: "Aranha et al. · Efficient Implementation of Bilinear Pairings", href: "https://eprint.iacr.org/2012/408", note: "BN curve·degree-12 extension에서 sparse multiplication·reduction·platform benchmark의 원 연구" },
  ],
  "crypto/frobenius-optimization": [
    { kind: "핵심 논문", label: "Scott et al. · On the final exponentiation for calculating pairings", href: "https://eprint.iacr.org/2008/490", note: "Pairing-friendly curve의 final exponent factorization과 Frobenius 활용 원 연구" },
    { kind: "공식 코드", label: "arkworks algebra 0.5.0 Fp12 Frobenius @ 7ad88c46", href: "https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs", note: "Degree 12·coefficient table·power modulo dispatch의 pinned implementation source" },
    { kind: "공식 코드", label: "arkworks curves BN254 fields @ e2d16a27", href: "https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254/src/fields", note: "구체 BN254 non-residue·tower·Frobenius coefficient profile source" },
  ],
  "blockchain/bft-comparison": [
    { kind: "핵심 논문", label: "Castro·Liskov — Practical Byzantine Fault Tolerance", href: "https://pmg.csail.mit.edu/papers/osdi99.pdf", note: "PBFT normal phase·checkpoint·view change와 당시 NFS evaluation 범위" },
    { kind: "핵심 논문", label: "Yin et al. — HotStuff", href: "https://arxiv.org/abs/1803.05069", note: "Chained QC·linear authenticator communication·pacemaker의 model과 proof" },
    { kind: "핵심 논문", label: "Giridharan et al. — Autobahn", href: "https://arxiv.org/abs/2401.10369", note: "Parallel lanes·cut consensus와 piece-wise partial-synchrony blip 평가" },
  ],
  "blockchain/consensus-comparison": [
    { kind: "핵심 논문", label: "Dwork·Lynch·Stockmeyer — Consensus in the Presence of Partial Synchrony", href: "https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf", note: "Unknown bound·GST timing model과 fault별 resilience의 원 이론" },
    { kind: "핵심 논문", label: "Nakamoto — Bitcoin", href: "https://bitcoin.org/bitcoin.pdf", note: "PoW cumulative-work chain과 attacker catch-up confirmation model" },
    { kind: "핵심 논문", label: "Lamport·Shostak·Pease — The Byzantine Generals Problem", href: "https://lamport.azurewebsites.net/pubs/byz.pdf", note: "Byzantine interactive consistency의 oral/signed message model 경계" },
  ],
  "blockchain/dag-consensus": [
    { kind: "핵심 논문", label: "Danezis et al. — Narwhal and Tusk", href: "https://arxiv.org/abs/2105.11827", note: "Reliable transaction dissemination과 ordering 분리·DAG mempool evaluation" },
    { kind: "핵심 논문", label: "Spiegelman et al. — Bullshark", href: "https://arxiv.org/abs/2201.05677", note: "DAG anchor·wave ordering과 synchronous fast path·asynchronous property" },
  ],
  "blockchain/tendermint-bft": [
    { kind: "핵심 논문", label: "Jae Kwon — Tendermint: Consensus without Mining", href: "https://tendermint.com/static/docs/tendermint.pdf", note: "2014 draft v0.6의 역사적 Tendermint 설계이며 outdated 표기를 본문에 유지" },
    { kind: "공식 규격", label: "CometBFT v0.38 — Byzantine Consensus Algorithm", href: "https://docs.cometbft.com/v0.38/spec/consensus/consensus", note: "Height·round·step, +2/3, PoLC·lock과 timeout transition의 version-pinned 정본" },
    { kind: "공식 규격", label: "CometBFT v0.38 — Validator Signing", href: "https://docs.cometbft.com/v0.38/spec/consensus/signing", note: "Canonical vote fields·same H/R/type double-sign과 lock-related signing 경계" },
  ],
  "gpu/cuda-basics": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Host/device·kernel·grid/block/thread·warp·memory semantics의 version-pinned 정본이며 특정 speedup·block size 보장은 아님" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "APOD·effective bandwidth·coalescing·transfer·occupancy 측정 기준이며 단일 metric의 성능 보장은 아님" },
    { kind: "공식 코드", label: "NVIDIA cuda-samples v12.8", href: "https://github.com/NVIDIA/cuda-samples/tree/v12.8", note: "Vector·reduction·matrix·stream CUDA API pattern의 pinned example source이며 production blockchain 최적 구현이나 benchmark는 아님" },
  ],
  "gpu/cuda-matrix-multiply": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Block·shared memory·barrier의 pinned semantics이며 특정 tile 선택·speedup 보장은 아님" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Timing·effective bandwidth·shared-memory matrix 사례의 공식 measurement guidance" },
    { kind: "공식 코드", label: "NVIDIA cuda-samples v12.8 · matrixMul", href: "https://github.com/NVIDIA/cuda-samples/tree/v12.8/Samples/0_Introduction/matrixMul", note: "Pinned 교육용 tiled kernel source이며 arbitrary-shape production GEMM benchmark가 아님" },
  ],
  "gpu/cuda-perf-analysis": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "APOD·timing·effective bandwidth·Amdahl과 reference validation의 pinned 정본" },
    { kind: "공식 문서", label: "NVIDIA Nsight Compute 2025.1 User Guide", href: "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html", note: "Kernel metric·section·replay semantics의 release-pinned profiler 문서" },
    { kind: "공식 문서", label: "NVIDIA Nsight Systems 2025.1 User Guide", href: "https://docs.nvidia.com/nsight-systems/2025.1/UserGuide/index.html", note: "CPU/GPU timeline·CUDA trace의 release-pinned profiler 문서" },
    { kind: "공식 문서", label: "NVIDIA Nsight Compute Profiling Guide · GPU Speed Of Light / Memory Workload Analysis / Metrics Reference", href: "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html", note: "Throughput = achieved / peak sustained 백분율, active·elapsed 분모, sector 기준 hit rate 정의의 근거" },
    { kind: "공식 문서", label: "NVIDIA Nsight Systems User Guide · CUDA Trace / Timeline View", href: "https://docs.nvidia.com/nsight-systems/UserGuide/index.html", note: "CUDA API trace 와 workload trace 의 구분, CPU range 에서 launch 된 GPU activity 의 timeline 투영, kernel 에서 Nsight Compute 를 띄우는 연결의 근거" },
],
  "gpu/cuda-register-pressure": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Thread register·SM residency·device-memory-backed local address space와 compiler resource inspection의 pinned semantics" },
    { kind: "공식 문서", label: "NVIDIA Nsight Compute 2025.1 User Guide", href: "https://docs.nvidia.com/nsight-compute/2025.1/NsightCompute/index.html", note: "Launch resource·scheduler·local-memory traffic metric의 release-pinned semantics" },
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1 · Occupancy",
      href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html",
      note: "65,536 registers, 256개 단위 warp 반올림, 37 registers·block 크기별 occupancy 예와 register pressure 옵션",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA Nsight Compute Profiling Guide · Occupancy·Launch Statistics",
      href: "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html",
      note: "Theoretical occupancy metric, achieved와의 차이가 불균형을 뜻한다는 설명, waves per SM과 tail effect",
    },
],
  "gpu/cuda-kernel-fusion": [
    { kind: "핵심 논문", label: "FlashAttention · IO-Aware Exact Attention", href: "https://arxiv.org/abs/2205.14135", note: "Attention 내부의 tile 단위 HBM IO 절감 근거이며 model-wide Megakernel의 보편적 이득을 뜻하지 않음" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Fusion 후보의 timing·effective bandwidth·reference comparison 경계를 고정하는 공식 guide" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS documentation · Overview", href: "https://docs.nvidia.com/cutlass/latest/overview.html", note: "CUTLASS collectives와 CuTe layout·tensor·copy/MMA atom hierarchy의 current official 설명" },
    { kind: "공식 문서", label: "Triton programming guide · Introduction", href: "https://triton-lang.org/main/programming-guide/chapter-1/introduction.html", note: "Blocked program model과 compiler-owned dataflow scheduling의 official 설명" },
    {
      kind: "공식 문서",
      label: "NVIDIA CUDA Programming Guide · CUDA Graphs",
      href: "https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html",
      note: "Graph 정의·실행 분리로 CPU launch 비용을 상각한다는 공식 설명 — traffic 절감을 주장하지 않음",
    },
],
  "gpu/cuda-persistent-kernels": [
    { kind: "핵심 논문", label: "A Study of Persistent Threads Style GPU Programming", href: "https://doi.org/10.1109/InPar.2012.6339596", note: "Persistent worker와 work distribution use cases의 2012 primary study이며 현대 GPU speedup 보장은 아님" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Grid·block residency·atomic·memory ordering과 cooperative execution primitive의 pinned semantics" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · Efficient GEMM in CUDA · Persistent kernels / Tile Scheduler", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md", note: "SM 수만큼의 persistent block 과 Tile Scheduler 의 static 배분, ping-pong 설계의 근거" },
],
  "gpu/cfd-finite-volume-gpu": [
    { kind: "공식 문서", label: "NASA Glenn · Navier–Stokes Equation", href: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/navier-strokes-equation/", note: "Mass·momentum·energy conservation equations와 CFD의 물리적 출발점" },
    { kind: "공식 문서", label: "OpenFOAM Foundation · Technical Guides", href: "https://openfoam.org/guides/", note: "Finite-volume CFD equation·model·solver guidance의 공식 진입점" },
    { kind: "공식 문서", label: "NASA Ames · LAVA CFD framework", href: "https://www.nas.nasa.gov/LAVA/introduction/", note: "Finite difference·finite volume을 포함한 NASA CFD/multiphysics solver family의 공개 scope" },
  ],
  "gpu/gpu-arch-hopper": [
    { kind: "공식 가이드", label: "NVIDIA Hopper Tuning Guide · CUDA 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/hopper-tuning-guide/index.html", note: "Compute capability 9.0 resource·TMA·cluster tuning의 pinned guide" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Thread block cluster·DSM launch/group semantics의 pinned 정본" },
    { kind: "공식 문서", label: "NVIDIA Hopper Architecture Whitepaper", href: "https://resources.nvidia.com/en-us-tensor-core/nvidia-hopper-architecture-whitepaper", note: "Hopper architecture·Transformer Engine·TMA claims이며 exact SKU·benchmark 조건 밖으로 확대하지 않음" },
  ],
  "gpu/hw-gpu-comparison": [
    { kind: "공식 문서", label: "NVIDIA GeForce RTX 5090 / RTX 4090 official specifications", href: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/", note: "확인 시점 GeForce architecture·memory·board specs이며 partner board와 workload achieved result는 별도" },
    { kind: "공식 문서", label: "NVIDIA A100 Tensor Core GPU official product material", href: "https://www.nvidia.com/en-us/data-center/a100/", note: "A100 SKU·memory·MIG·platform capability의 official entry" },
    { kind: "공식 문서", label: "NVIDIA H100 Tensor Core GPU official product specifications", href: "https://www.nvidia.com/en-us/data-center/h100/", note: "H100 form factor별 precision·HBM·power·interconnect specs이며 peak를 application speedup으로 확대하지 않음" },
  ],
  "tee/intel-sgx": [
    { kind: "공식 문서", label: "Intel SGX Developer Guide", href: "https://download.01.org/intel-sgx/latest/linux-latest/docs/Intel_SGX_Developer_Guide.pdf", note: "EPC·enclave lifecycle·trusted/untrusted application model의 current Intel guide이며 application·side-channel 안전 인증은 아님" },
    { kind: "공식 문서", label: "Intel SGX Attestation Services", href: "https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/attestation-services.html", note: "ECDSA DCAP quote·PCS collateral의 current official surface이며 relying-party authorization은 별도" },
  ],
  "tee/amd-sev": [
    { kind: "공식 문서", label: "AMD Secure Encrypted Virtualization", href: "https://www.amd.com/en/developer/sev.html", note: "SEV·ES·SNP·TIO capability와 official specifications의 current 진입점" },
    { kind: "공식 규격", label: "AMD SEV-SNP Firmware ABI 1.58", href: "https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP", note: "SNP page state·guest message·attestation report의 versioned firmware ABI" },
  ],
  "tee/intel-tdx": [
    { kind: "공식 문서", label: "Intel TDX Documentation", href: "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/documentation.html", note: "2026 current baselined module architecture·ABI·source·security·attestation 문서 surface" },
    { kind: "공식 코드", label: "Intel TDX Module", href: "https://www.intel.com/content/www/us/en/download/738875/intel-trust-domain-extension-intel-tdx-module.html", note: "SEAM-hosted module architecture와 reproducible source entry이며 deployed release manifest가 별도 필요" },
  ],
  "tee/arm-cca": [
    { kind: "공식 문서", label: "Arm Realm Management Extension overview", href: "https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/introducing-arms-dynamic-trustzone-technology", note: "RME·GPT·GPC가 granule의 security world assignment를 집행하는 공식 architecture 설명" },
    { kind: "공식 규격", label: "Arm Realm Management Monitor Architecture DEN0137", href: "https://developer.arm.com/-/cdn-downloads/permalink/Architectures/Armv9/DEN0137_1.0-rel0-rc1_rmm-arch_external.pdf", note: "RMM lifecycle·RMI/RSI·Realm/platform token binding의 revision-pinned architecture" },
  ],
  "tee/keylime": [
    { kind: "공식 문서", label: "Keylime architecture", href: "https://keylime.dev/blog/2024/02/07/remote-attestation-blog-part1.html", note: "Agent·verifier·registrar·tenant 역할의 공식 설명이며 배포 안전 인증은 아님" },
    { kind: "공식 문서", label: "Keylime runtime IMA", href: "https://keylime.readthedocs.io/en/latest/user_guide/runtime_ima.html", note: "PCR 10·IMA measurement·runtime policy 경계이며 helper output은 완전한 golden state가 아님" },
    { kind: "공식 문서", label: "Keylime measured boot", href: "https://keylime.readthedocs.io/en/latest/user_guide/use_measured_boot.html", note: "Boot log·reference policy appraisal이며 accept-all policy는 보안 판정이 아님" },
  ],
  "tee/tee-sealing": [
    { kind: "공식 문서", label: "Intel SGX sealing", href: "https://www.intel.com/content/www/us/en/developer/articles/technical/introduction-to-intel-sgx-sealing.html", note: "MRENCLAVE/MRSIGNER sealing policy 공식 개요이며 rollback·migration atomicity는 별도" },
    { kind: "공식 규격", label: "NIST SP 800-38D", href: "https://csrc.nist.gov/pubs/sp/800/38/d/final", note: "GCM AEAD·IV·tag 경계이며 TEE identity binding은 별도" },
  ],
  "tee/tee-sidechannel": [
    { kind: "핵심 논문", label: "Spectre Attacks", href: "https://arxiv.org/abs/1801.01203", note: "Transient execution·cache covert channel의 원 논문 조건" },
    { kind: "핵심 논문", label: "Cache Attacks and Countermeasures", href: "https://eprint.iacr.org/2005/271", note: "AES table cache attack의 원 논문 구현·측정 조건" },
    { kind: "공식 가이드", label: "Intel timing side-channel guidance", href: "https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/secure-coding/mitigate-timing-side-channel-crypto-implementation.html", note: "Current secure-coding guidance이며 특정 binary의 constant-time 인증은 아님" },
  ],
  "isms-aml/isms-encryption": [
    { kind: "공식 규격", label: "NIST SP 800-57 Part 1 Rev.5", href: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Key lifecycle·cryptoperiod·backup/recovery·compromise 지침" },
    { kind: "공식 가이드", label: "OWASP Password Storage", href: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", note: "검증 시점 password hashing guidance이며 parameter는 서비스 환경에서 측정" },
    { kind: "공식 가이드", label: "OWASP Cryptographic Storage", href: "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html", note: "Data minimization·storage layer·key storage 일반 지침" },
  ],
  "tee/op-tee": [
    { kind: "공식 문서", label: "OP-TEE Core architecture", href: "https://optee.readthedocs.io/en/latest/architecture/core.html", note: "World transition·thread·shared-memory runtime의 공식 설명이며 TA 업무 authorization의 증거는 아님" },
    { kind: "공식 규격", label: "OP-TEE GlobalPlatform API", href: "https://optee.readthedocs.io/en/4.0.0/architecture/globalplatform_api.html", note: "Context·session·command lifecycle의 versioned interface" },
    { kind: "공식 문서", label: "OP-TEE Secure Storage", href: "https://optee.readthedocs.io/en/3.13.0/architecture/secure_storage.html", note: "REE FS·RPMB 저장 model과 atomic update 목표이며 freshness property는 backend별 확인" },
  ],
  "tee/oasis": [
    { kind: "공식 문서", label: "Oasis Runtime Layer", href: "https://docs.oasis.io/core/runtime/", note: "Consensus ordering과 runtime compute/storage·discrepancy 경계의 current official entry" },
    { kind: "공식 규격", label: "Oasis Root Hash service", href: "https://docs.oasis.io/core/consensus/services/roothash/", note: "Executor commitment·runtime root·message processing의 official specification" },
    { kind: "공식 규격", label: "Oasis Key Manager", href: "https://docs.oasis.io/core/consensus/services/keymanager/", note: "Runtime policy·status·identity 기반 key-manager surface이며 application access control은 별도" },
  ],
  "tee/phala": [
    { kind: "공식 문서", label: "Phala Blockchain Entities", href: "https://docs.phala.network/tech-specs/blockchain/blockchain-entities", note: "Client·worker·gatekeeper와 from/to/nonce payload의 official entity model" },
    { kind: "공식 문서", label: "Phala Secret Key Hierarchy", href: "https://docs.phala.network/tech-specs/blockchain/secret-key-hierarchy", note: "Worker/gatekeeper identity·communication key hierarchy이며 deployed pRuntime·epoch revision을 별도 고정" },
  ],
  "tee/dstack": [
    { kind: "공식 문서", label: "dstack Getting Started", href: "https://docs.phala.network/dstack/getting-started", note: "dstack-vmm·guest agent·KMS·gateway와 image-build topology의 current entry" },
    { kind: "공식 문서", label: "dstack Design Documents", href: "https://docs.phala.network/dstack/design-documents", note: "OS·KMS·gateway·published digest·authorization trust path이며 production hardening 인증은 아님" },
  ],
  "gpu/msm-ntt": [
    { kind: "공식 코드", label: "ICICLE v3.9.0 · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2", note: "MSM·NTT backend/API의 pinned implementation이며 모든 device·size의 성능·correctness 보장은 아님" },
    { kind: "공식 코드", label: "sppark · commit 17278d7", href: "https://github.com/supranational/sppark/tree/17278d74295392f9813f009300b257a688422b7a", note: "MSM·NTT·EC/FF·memory CUDA templates의 pinned structure이며 PoC benchmark를 production claim으로 확대하지 않음" },
    { kind: "공식 가이드", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Execution·memory·synchronization semantics의 versioned source이며 특정 mapping의 우위는 별도 측정" },
  ],
  "gpu/ec-gpu-ops": [
    { kind: "공식 코드", label: "ec-gpu field.cl · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu-gen/src/cl/field.cl", note: "32-bit CUDA carry-chain/default field path의 pinned source이며 cycle·register·speedup 수치는 주장하지 않음" },
    { kind: "공식 코드", label: "ec-gpu ec.cl · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu-gen/src/cl/ec.cl", note: "a=0 Jacobian double/mixed/full add와 branches의 pinned source이며 모든 curve의 complete formula는 아님" },
    { kind: "공식 코드", label: "ec-gpu multiexp.cl · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu-gen/src/cl/multiexp.cl", note: "MSM gid/window/group/bucket mapping의 pinned source이며 보편 optimal Pippenger mapping은 아님" },
    { kind: "공식 가이드", label: "NVIDIA CUDA C++ Programming Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Warp·register·memory semantics의 versioned source이며 occupancy 우위는 별도 측정" },
  ],
  "gpu/ec-gpu-gen": [
    { kind: "공식 코드", label: "ec-gpu GpuField interface · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu/src/lib.rs", note: "GpuName/GpuField의 실제 parameter surface이며 trait가 constants·curve security를 증명하지 않음" },
    { kind: "공식 코드", label: "ec-gpu SourceBuilder/artifact · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu-gen/src/source.rs", note: "Source assembly와 CUDA fatbin/OpenCL source lifecycle의 pinned implementation" },
    { kind: "공식 코드", label: "ec-gpu Program dispatch · commit 16d38ef", href: "https://github.com/filecoin-project/ec-gpu/blob/16d38ef6715fb1a4968986d3a5635f8bcac6c984/ec-gpu-gen/src/program.rs", note: "Feature/environment/device runtime branch의 pinned source이며 backend parity 보장은 아님" },
    { kind: "공식 규격", label: "Khronos OpenCL 3.0 Unified Specification", href: "https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html", note: "OpenCL program build·queue·memory semantics의 official contract" },
    { kind: "공식 코드", label: "bellperson build.rs · commit 728306c", href: "https://github.com/filecoin-project/bellperson/blob/728306c8ee52f53dbd55ea02557affcdfb546ae7/build.rs", note: "FFT·G1/G2 multiexp SourceBuilder consumer integration이며 prover 비율·speedup 근거는 아님" },
  ],
  "gpu/gpu-proof-pipeline": [
    { kind: "핵심 논문", label: "Groth16 · IACR ePrint 2016/260", href: "https://eprint.iacr.org/2016/260", note: "QAP setup·A/B/C proof·verification dependency의 원문이며 GPU stage 비율을 제공하지 않음" },
    { kind: "핵심 논문", label: "PLONK · IACR ePrint 2019/953", href: "https://eprint.iacr.org/2019/953", note: "Permutation·transcript·PCS round dependency의 원문이며 모든 PLONKish 호출 수가 같다는 뜻은 아님" },
    { kind: "공식 코드", label: "bellperson · commit 728306c", href: "https://github.com/filecoin-project/bellperson/tree/728306c8ee52f53dbd55ea02557affcdfb546ae7", note: "Groth16 FFT/MSM GPU integration·fallback/locking의 pinned source이며 고정 speedup 근거는 아님" },
    { kind: "공식 코드", label: "ICICLE v3.9.0 · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2", note: "MSM·NTT runtime/backend integration surface이며 protocol transcript/verifier를 대신하지 않음" },
  ],
  "p2p/iroh": [
    { kind: "공식 코드", label: "iroh v1.0.3 Endpoint", href: "https://github.com/n0-computer/iroh/tree/v1.0.3/iroh/src", note: "EndpointAddr·TLS identity·ALPN connection의 pinned source이며 CID provider discovery나 payload authorization 근거는 아님" },
    { kind: "공식 코드", label: "iroh v1.0.3 Biased RTT path selector", href: "https://github.com/n0-computer/iroh/blob/v1.0.3/iroh/src/socket/biased_rtt_path_selector.rs", note: "Direct/relay tier·IPv6 bias·switch threshold의 exact 구현이며 모든 network의 optimal constants는 아님" },
    { kind: "공식 코드", label: "iroh v1.0.3 PathState", href: "https://github.com/n0-computer/iroh/blob/v1.0.3/iroh/src/socket/remote_map/remote_state/path_state.rs", note: "Local path state와 failure cleanup의 pinned implementation이며 content availability를 증명하지 않음" },
  ],
  "p2p/kubo": [
    { kind: "공식 코드", label: "Kubo v0.43.0 Routing Composer", href: "https://github.com/ipfs/kubo/tree/v0.43.0/routing", note: "Provide·FindProvidersAsync router composition의 pinned source이며 provider possession proof는 아님" },
    { kind: "공식 코드", label: "Kubo v0.43.0 Provider subsystem", href: "https://github.com/ipfs/kubo/blob/v0.43.0/core/node/provider.go", note: "Local block/pin/DAG source와 reprovider wiring이며 permanent network availability를 보장하지 않음" },
    { kind: "공식 코드", label: "Kubo v0.43.0 Garbage Collection", href: "https://github.com/ipfs/kubo/blob/v0.43.0/gc/gc.go", note: "Protected key marking과 local block sweep의 pinned source이며 replication·backup contract는 아님" },
  ],
  "p2p/libp2p-gossipsub": [
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 GossipSub Behaviour", href: "https://github.com/libp2p/rust-libp2p/tree/libp2p-v0.56.0/protocols/gossipsub/src", note: "Publish cache·mesh·heartbeat implementation이며 durable dissemination 보장은 아님" },
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 Peer Score", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/protocols/gossipsub/src/peer_score.rs", note: "Local weighted score state이며 global identity/reputation이나 보편 threshold는 아님" },
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 GossipSub Config", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/protocols/gossipsub/src/config.rs", note: "Validation·heartbeat·cache configuration surface이며 global rollback·exactly-once delivery를 제공하지 않음" },
  ],
  "p2p/libp2p-quic": [
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 QUIC Transport", href: "https://github.com/libp2p/rust-libp2p/tree/libp2p-v0.56.0/transports/quic/src", note: "Multiaddr·TLS PeerId binding·connection lifecycle의 pinned source이며 payload authorization 근거는 아님" },
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 QUIC Streams", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/transports/quic/src/connection/stream.rs", note: "Bidirectional stream adapter와 reset/close mapping이며 remote durable processing을 보장하지 않음" },
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 QUIC Hole Punching", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/transports/quic/src/hole_punching.rs", note: "UDP socket reuse·attempt dedup·timeout 구현이며 모든 NAT의 direct reachability 보장은 아님" },
  ],
  "isms-aml/isms-backup-recovery": [
    { kind: "공식 규격", label: "NIST SP 800-34 Rev.1", href: "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final", note: "BIA·recovery strategy·testing·maintenance의 일반 contingency-planning 지침이며 특정 RPO/RTO·제품을 정하지 않음" },
    { kind: "공식 가이드", label: "KISA 2023 ISMS-P 인증기준 안내서", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "Backup·복구 확인사항과 결함사례의 국내 인증 해설이며 현행 법령·조직 위험평가를 우선" },
  ],
  "isms-aml/isms-incident-response": [
    { kind: "공식 규격", label: "NIST SP 800-61 Rev.3", href: "https://csrc.nist.gov/pubs/sp/800/61/r3/final", note: "2025 incident-response 권고와 CSF 2.0 통합 범위이며 고정 severity·containment 순서를 정하지 않음" },
    { kind: "공식 가이드", label: "KISA 2023 ISMS-P 인증기준 안내서", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "사고 예방·대응·복구·재발방지의 국내 인증 확인 지점이며 법적 breach 판정을 대신하지 않음" },
  ],
  "isms-aml/isms-dev-security": [
    { kind: "공식 규격", label: "NIST SP 800-218 SSDF v1.1", href: "https://csrc.nist.gov/pubs/sp/800/218/final", note: "Secure software development practice의 final 2022 framework이며 특정 scanner·취약점 0을 보장하지 않음" },
    { kind: "공식 가이드", label: "OWASP ASVS", href: "https://owasp.org/www-project-application-security-verification-standard/", note: "Application security verification 요구사항이며 business logic·운영·host/network 전체 인증은 아님" },
    { kind: "공식 가이드", label: "KISA 2023 ISMS-P 인증기준 안내서", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "개발보안·변경관리의 국내 인증 확인 지점이며 모든 변경에 같은 toolchain을 요구하지 않음" },
  ],
  "isms-aml/isms-security-infra": [
    { kind: "공식 규격", label: "NIST SP 800-41 Rev.1", href: "https://csrc.nist.gov/pubs/sp/800/41/r1/final", note: "Firewall policy·배치·운영 지침이며 application authorization을 대신하지 않음" },
    { kind: "공식 규격", label: "NIST SP 800-92", href: "https://csrc.nist.gov/pubs/sp/800/92/final", note: "Security log management 지침이며 수집 자체가 incident detection·clock 정확성을 보장하지 않음" },
    { kind: "공식 가이드", label: "KISA 2023 ISMS-P 인증기준 안내서", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "Network·보안시스템의 국내 인증 확인 지점이며 특정 UTM·SIEM 제품 구매를 요구하지 않음" },
  ],
  "isms-aml/aml-compliance": [
    { kind: "공식 규격", label: "FATF Recommendations · current consolidated standards", href: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html", note: "CDD·RBA·record keeping·STR·supervision의 국제 상위 기준이며 단일 score·workflow를 요구하지 않음" },
    { kind: "공식 문서", label: "KoFIU 자금세탁방지 법령 체계", href: "https://www.kofiu.go.kr/kor/law/law.do", note: "국내 법률·시행령·규정의 공식 진입점이며 글 요약이 사건별 법률 검토를 대신하지 않음" },
  ],
  "isms-aml/aml-cdd-deep": [
    { kind: "공식 문서", label: "KoFIU 고객확인제도(CDD)", href: "https://www.kofiu.go.kr/kor/policy/amls05.do", note: "CDD·EDD·실제소유자·확인 불가 절차의 국내 공식 안내이며 vendor KYC pass가 전체 의무를 대신하지 않음" },
    { kind: "공식 가이드", label: "FATF Guidance on Digital Identity", href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Guidance-on-Digital-Identity.pdf.coredownload.pdf", note: "Digital identity assurance를 Recommendation 10 CDD에 위험기반으로 적용하는 guidance이며 목적·자금 원천·실제소유자 확인을 대체하지 않음" },
    { kind: "공식 문서", label: "금융위원회 특정금융정보법상 Travel Rule 시행 안내", href: "https://www.fsc.go.kr/po010102/77579", note: "2022 시행 당시 VASP 간 이전정보·보존 구조이며 2026-08-14 current law와 확대 개정 effective date를 별도 확인" },
  ],
  "isms-aml/aml-rba-deep": [
    { kind: "공식 규격", label: "FATF Recommendations · Recommendation 1", href: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html", note: "2025 proportionality 개정을 포함한 risk-based approach 상위 기준이며 보편 score·weight·cutoff를 제공하지 않음" },
    { kind: "공식 가이드", label: "FATF Risk-Based Approach for the Banking Sector", href: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Risk-based-approach-banking-sector.html", note: "위험 식별·평가·mitigation·internal control guidance이며 국내 VASP 의무와 actual effectiveness를 대신하지 않음" },
  ],
  "isms-aml/aml-str-reporting": [
    { kind: "공식 문서", label: "KoFIU 의심거래보고(STR)", href: "https://www.kofiu.go.kr/kor/policy/amls03.do", note: "합리적 의심·보고 정보와 KoFIU 처리 흐름의 공식 안내이며 신고가 동결·유죄·수사 착수를 자동 의미하지 않음" },
    { kind: "공식 문서", label: "KoFIU 특정금융정보법 등 현행 법령", href: "https://www.kofiu.go.kr/kor/law/law.do", note: "보고·보존·비밀유지의 current legal source 진입점이며 기관·사건별 적용은 별도 법률 검토가 필요" },
  ],
  "isms-aml/aml-fds-deep": [
    { kind: "공식 가이드", label: "FATF Updated Guidance for VA and VASPs", href: "https://www.fatf-gafi.org/content/dam/fatf/documents/recommendations/Updated-Guidance-VA-VASP.pdf", note: "Ongoing monitoring·automated alert 뒤 expert analysis·rule integrity 원칙이며 특정 detector·tag·cutoff를 승인하지 않음" },
    { kind: "공식 문서", label: "KoFIU 의심거래보고제도", href: "https://kofiu.go.kr/kor/policy/amls03.do", note: "합리적 의심과 STR 공식 경계이며 alert·case·거래 동결·유죄를 동일시하지 않음" },
  ],
  "isms-aml/isms-audit-checklist": [
    { kind: "공식 가이드", label: "KISA ISMS-P 인증기준 안내서 2023.11", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "확인사항·증거자료·결함사례의 공식 해설이며 한 표본·문서 목록이 인증을 보장하지 않음" },
    { kind: "공식 문서", label: "KISA ISMS-P 공식 자료실", href: "https://pims.kisa.or.kr/", note: "최신 세부점검항목·적용 공지의 공식 진입점이며 신청·심사일의 적용본 재확인 필요" },
  ],
  "isms-aml/isms-privacy-lifecycle": [
    { kind: "공식 문서", label: "개인정보 보호법", href: "https://www.law.go.kr/법령/개인정보보호법", note: "2026-08-14 현행 처리·보유·파기 상위 법률이며 30일 예시는 법정 공통 기간이 아님" },
    { kind: "공식 가이드", label: "KISA ISMS-P 인증기준 안내서 2023.11", href: "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf", note: "보유·파기·분리보관 확인사항이며 DB delete 한 건이 파생물·backup 삭제를 증명하지 않음" },
  ],
  "isms-aml/isms-privacy-policy": [
    { kind: "공식 문서", label: "개인정보 보호법", href: "https://www.law.go.kr/법령/개인정보보호법", note: "처리방침·처리근거·제공·위탁·권리의 현행 상위 법률" },
    { kind: "공식 문서", label: "표준 개인정보 보호지침", href: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000257592&chrClsCd=010201", note: "구체적·명확한 처리방침 작성 일반 기준이며 예시 복사가 runtime parity를 증명하지 않음" },
    { kind: "공식 문서", label: "개인정보위 맞춤형 광고 행태정보 정책 방안", href: "https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=9888", note: "행태정보 고지·적법한 수집·거부 경계이며 후속 guidance와 current flow 재확인 필요" },
  ],
  "gpu/msm-gpu-impl": [
    { kind: "공식 코드", label: "sppark MSM · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/pippenger.cuh", note: "Signed digit breakdown·bucket accumulation·integration의 pinned source이며 고정 point-op count·speedup은 아님" },
    { kind: "공식 코드", label: "sppark custom sort · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/sort.cuh", note: "Digit/index grouping 구현이며 모든 GPU MSM의 보편 필수·최적 전략은 아님" },
    { kind: "공식 가이드", label: "CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Event timing·effective bandwidth·correctness-first 측정 방법이며 occupancy 우위를 보장하지 않음" },
  ],
  "gpu/ntt-gpu-impl": [
    { kind: "공식 코드", label: "sppark NTT dispatch · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/ntt.cuh", note: "CT/GS·direction·bit reversal·coset power placement의 pinned source이며 모든 NTT library ordering은 아님" },
    { kind: "공식 코드", label: "sppark NTT kernels · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/kernels.cu", note: "Bit-reversal·LDE power kernels 구현이며 고정 bandwidth·bank-conflict 수치는 주장하지 않음" },
    { kind: "공식 가이드", label: "CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Timing·requested/actual bandwidth methodology이며 특정 radix·tile의 보편 우위는 아님" },
  ],
  "gpu/poly-ops-gpu": [
    { kind: "공식 코드", label: "sppark coset NTT · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/ntt.cuh", note: "Forward/inverse coset powers의 pinned placement이며 모든 backend의 pass/fusion 구조는 아님" },
    { kind: "공식 구현", label: "ethereum/c-kzg-4844 v2.1.6 · commit 673d93c", href: "https://github.com/ethereum/c-kzg-4844/blob/673d93cdb5b61072f288f08c147c180cf378cb9b/src/ckzg.c", note: "Polynomial/KZG CPU reference와 validation snapshot이며 GPU recurrence parallelization 근거는 아님" },
    { kind: "공식 코드", label: "ICICLE v3.9.0 · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2", note: "Polynomial·NTT accelerator API surface이며 automatic form safety나 proof soundness를 보장하지 않음" },
  ],
  "gpu/kzg-gpu": [
    { kind: "핵심 논문", label: "KZG · ASIACRYPT 2010", href: "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf", note: "Degree-bounded SRS·commit/open/verify construction의 원문이며 GPU layout·fixed speedup 근거는 아님" },
    { kind: "공식 구현", label: "ethereum/c-kzg-4844 v2.1.6 · commit 673d93c", href: "https://github.com/ethereum/c-kzg-4844/tree/673d93cdb5b61072f288f08c147c180cf378cb9b", note: "EIP-4844 BLS12-381 setup·compute·verify·test vector profile이며 임의 KZG batch/GPU를 보장하지 않음" },
    { kind: "공식 코드", label: "sppark MSM · commit 17278d7", href: "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/pippenger.cuh", note: "Commitment/proof MSM에 쓸 수 있는 pinned GPU implementation이며 KZG verifier·SRS validation을 대신하지 않음" },
  ],
  "gpu/gpu-witness-gen": [
    { kind: "공식 코드", label: "Circom v2.2.3 · commit ad44e91", href: "https://github.com/iden3/circom/tree/ad44e915a12bb047b05745c2884aad9cc8326bc6", note: "R1CS와 C++/WASM witness calculator를 생성하는 pinned compiler이며 GPU scheduler 구현 근거는 아님" },
    { kind: "핵심 논문", label: "Automating the Parallelization of Zero-Knowledge Protocols · 2023/657", href: "https://eprint.iacr.org/2023/657", note: "Dependency/live-variable 기반 parallelization 연구이며 모든 circuit의 GPU speedup이나 Circom 통합 완료를 뜻하지 않음" },
    { kind: "공식 가이드", label: "CUDA C++ Best Practices Guide 12.8.1", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Event timing·transfer·bandwidth 측정 방법이며 witness correctness와 고정 occupancy를 보장하지 않음" },
  ],
  "gpu/icicle-framework": [
    { kind: "공식 코드", label: "ICICLE v3.9.0 runtime.cpp · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/blob/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2/icicle/src/runtime.cpp", note: "Active device·memory tracker·dynamic backend runtime 구현이며 모든 primitive 지원이나 automatic fallback 근거는 아님" },
    { kind: "공식 코드", label: "ICICLE v3.9.0 Rust memory wrapper · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/blob/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2/wrappers/rust/icicle-runtime/src/memory.rs", note: "Host/device slice와 sync/async copy API의 pinned source이며 compile-time async completion 증명은 아님" },
    { kind: "공식 문서", label: "ICICLE v3.9.0 primitive overview · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/blob/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2/docs/docs/icicle/primitives/overview.md", note: "Pinned primitive surface이며 모든 field/backend 조합·protocol soundness를 보장하지 않음" },
  ],
  "gpu/poseidon-gpu": [
    { kind: "핵심 논문", label: "Poseidon · USENIX Security 2021", href: "https://www.usenix.org/system/files/sec21-grassi.pdf", note: "HADES rounds와 parameter/security analysis의 원문이며 CUDA mapping·고정 round/speedup 근거는 아님" },
    { kind: "공식 규격", label: "Filecoin Specification · Poseidon", href: "https://spec.filecoin.io/algorithms/crypto/poseidon/", note: "Filecoin optimized constants·sparse matrix 설명이며 페이지의 audit status를 넘어 일반화하지 않음" },
    { kind: "공식 문서", label: "ICICLE v3.9.0 Poseidon · commit 6b451e6", href: "https://github.com/ingonyama-zk/icicle/blob/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2/docs/docs/icicle/primitives/poseidon.md", note: "Pinned hash_many/profile 문서이며 모든 kernel 내부 mapping·고정 throughput 근거는 아님" },
  ],
  "gpu/filecoin-gpu-proofs": [
    { kind: "공식 코드", label: "rust-fil-proofs seal API · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/seal.rs", note: "Filecoin seal phase/cache orchestration snapshot이며 현재 network policy·고정 GPU phase 비율을 뜻하지 않음" },
    { kind: "공식 코드", label: "rust-fil-proofs parameter manifest · commit d451d23", href: "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/fil-proofs-param/parameters.json", note: "Pinned parameter identifiers·digest·size inventory이며 trusted setup ceremony나 local file validity의 단독 증거는 아님" },
    { kind: "공식 코드", label: "bellperson Groth16 prover · commit 728306c", href: "https://github.com/filecoin-project/bellperson/blob/728306c8ee52f53dbd55ea02557affcdfb546ae7/src/groth16/prover/native.rs", note: "FFT/MSM accelerator orchestration snapshot이며 Filecoin 전체 fixed speedup·current mainnet dependency 근거는 아님" },
  ],
  "p2p/libp2p-yamux": [
    { kind: "공식 규격", label: "Yamux specification — stream windows and control frames", href: "https://github.com/hashicorp/yamux/blob/master/spec.md", note: "DATA·WINDOW_UPDATE·PING·GO_AWAY와 stream credit semantics의 primary wire specification이며 peer authentication·payload receipt는 별도" },
    { kind: "공식 코드", label: "libp2p-yamux 0.47.0 · rust-libp2p 0.56.0", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/muxers/yamux/src/lib.rs", note: "0.12·0.13 adapter selection과 bounded inbound buffer의 pinned implementation이며 current constant를 SLA로 일반화하지 않음" },
    { kind: "공식 코드", label: "rust-libp2p 0.56.0 StreamMuxer", href: "https://github.com/libp2p/rust-libp2p/blob/libp2p-v0.56.0/core/src/muxing.rs", note: "Poll 기반 substream·connection lifecycle contract이며 remote handler 성공이나 exactly-once delivery 근거는 아님" },
  ],
  "p2p/rqbit": [
    { kind: "공식 코드", label: "rqbit v8.1.1 live torrent state", href: "https://github.com/ikatson/rqbit/blob/v8.1.1/crates/librqbit/src/torrent_state/live/mod.rs", note: "Peer queue·in-flight piece ownership·steal/cancel·reconnect의 pinned stable implementation이며 swarm availability 보장은 아님" },
    { kind: "공식 코드", label: "rqbit v8.1.1 piece file operations", href: "https://github.com/ikatson/rqbit/blob/v8.1.1/crates/librqbit/src/file_ops.rs", note: "Storage range hashing과 valid/broken piece outcome의 pinned code이며 publisher identity나 SHA-1 신규 security 근거는 아님" },
    { kind: "공식 코드", label: "rqbit v8.1.1 streaming and initialization", href: "https://github.com/ikatson/rqbit/blob/v8.1.1/crates/librqbit/src/torrent_state/streaming.rs", note: "Range-to-piece readiness와 restart path의 pinned implementation이며 HTTP authorization·disk durability는 별도" },
  ],
  "blockchain/commonware-crypto-p2p": [
    { kind: "공식 코드", label: "Commonware v2026.7.0 cryptographic handshake", href: "https://github.com/commonwarexyz/monorepo/blob/v2026.7.0/cryptography/src/handshake.rs", note: "Syn·SynAck·Ack, timestamp·signature·confirmation과 directional AEAD의 pinned implementation이며 application authorization은 별도" },
    { kind: "공식 코드", label: "Commonware v2026.7.0 authenticated lookup P2P", href: "https://github.com/commonwarexyz/monorepo/tree/v2026.7.0/p2p/src/authenticated/lookup", note: "Known peer set의 channel registration·quota·backlog·message limit 구현이며 consensus order나 payload correctness는 보장하지 않음" },
    { kind: "공식 코드", label: "Commonware v2026.7.0 mux and relay", href: "https://github.com/commonwarexyz/monorepo/blob/v2026.7.0/p2p/src/utils/mux.rs", note: "Bounded subchannel route와 priority local admission feedback 구현이며 remote durable acceptance는 별도" },
  ],
  "gpu/hw-server-vs-desktop": [
    { kind: "공식 규격", label: "DMTF Redfish DSP0266 1.23.1 · 2026-01-16", href: "https://www.dmtf.org/standards/redfish", note: "Pinned server management protocol·resource-model 범위이며 hardware redundancy·application availability 보장은 아님" },
    { kind: "공식 규격", label: "ENERGY STAR Computer Servers Version 4.0 · 2023-04-12", href: "https://www.energystar.gov/products/spec/energy_star_computer_servers_version_4_0_pd", note: "Server category·energy test/reporting 경계이며 target workload fit·availability를 대신하지 않음" },
  ],
  "gpu/hw-nvme-storage": [
    { kind: "공식 규격", label: "NVM Express Base Specification 2.2 · 2025-03-11", href: "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.2-2025.03.11-Ratified-1.pdf", note: "NVMe controller·queue·command protocol semantics이며 특정 form factor·성능·hot-plug 보장은 아님" },
    { kind: "공식 규격", label: "SNIA SFF-TA-1006 Rev 2.0 · E1.S", href: "https://members.snia.org/document/dl/26956", note: "E1.S mechanical attributes·thickness의 pinned specification이며 제품 공급·성능·chassis airflow 보장은 아님" },
  ],
  "gpu/hw-storage-comparison": [
    { kind: "공식 문서", label: "SATA-IO SATA Naming Guidelines", href: "https://sata-io.org/developers/sata-naming-guidelines", note: "SATA revision·SATA 6Gb/s naming/rate 범위이며 achieved payload나 device latency 근거는 아님" },
    { kind: "공식 규격", label: "INCITS T10 SCSI Storage Interfaces", href: "https://t10.t10.org/", note: "SCSI·SAS specification family의 공식 owner이며 exact device capability·multipath 보장은 아님" },
    { kind: "공식 규격", label: "SNIA SSS Performance Test Specification 2.0.2", href: "https://www.snia.org/solid-state-sss", note: "SSD preconditioning·steady-state device benchmark 방법이며 filesystem·application durability를 대신하지 않음" },
  ],
  "gpu/hw-power-cooling": [
    { kind: "공식 규격", label: "ENERGY STAR Computer Servers Version 4.0 · 2023-04-12", href: "https://www.energystar.gov/products/spec/energy_star_computer_servers_version_4_0_pd", note: "Server energy certification measurement 경계이며 target workload p95 wall power·thermal fit 보장은 아님" },
    { kind: "공식 문서", label: "The Green Grid · Power Usage Effectiveness", href: "https://www.thegreengrid.org/node/372", note: "Facility/IT energy ratio 정의이며 server compute efficiency·carbon·reliability 지표는 아님" },
  ],
  "blockchain/commonware-broadcast": [
    { kind: "공식 코드", label: "commonware-broadcast v2026.7.0 Broadcaster", href: "https://github.com/commonwarexyz/monorepo/blob/v2026.7.0/broadcast/src/lib.rs", note: "Typed broadcast와 local Feedback 성공 경계의 pinned trait이며 recipient receipt·total order·durability는 제공하지 않음" },
    { kind: "공식 코드", label: "commonware-broadcast v2026.7.0 buffered ingress", href: "https://github.com/commonwarexyz/monorepo/blob/v2026.7.0/broadcast/src/buffered/ingress.rs", note: "Bounded mailbox·digest waiter·cancel lifecycle의 pinned implementation이며 network acknowledgement는 별도" },
    { kind: "공식 코드", label: "commonware-broadcast v2026.7.0 buffered engine", href: "https://github.com/commonwarexyz/monorepo/blob/v2026.7.0/broadcast/src/buffered/engine.rs", note: "Peer deque·digest refcount·primary eligibility cache의 pinned implementation이며 global reliable broadcast는 아님" },
  ],
  "blockchain/avalanche-consensus": [
    { kind: "핵심 논문", label: "Snowflake to Avalanche · arXiv 1906.08936", href: "https://arxiv.org/abs/1906.08936", note: "Repeated random subsampling과 metastable consensus family의 원문이며 특정 chain TPS·고정 finality SLA는 아님" },
    { kind: "공식 코드", label: "AvalancheGo v1.14.2 Snowball parameters", href: "https://github.com/ava-labs/avalanchego/blob/v1.14.2/snow/consensus/snowball/parameters.go", note: "K·alpha·beta parameter validation의 pinned source이며 모든 subnet의 optimal defaults는 아님" },
    { kind: "공식 코드", label: "AvalancheGo v1.14.2 Snow state", href: "https://github.com/ava-labs/avalanchego/tree/v1.14.2/snow/consensus/snowball", note: "Snowflake consecutive confidence와 Snowball cumulative preference 구현이며 sampler/network 보장은 별도" },
  ],
  "blockchain/gossipbft": [
    { kind: "공식 규격", label: "FIP-0086 GossiPBFT · revision c856d99", href: "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md", note: "Weighted phases·best-effort broadcast·partial-synchrony properties의 Final 규격이며 Gossipsub exactly-once 보장은 아님" },
    { kind: "공식 코드", label: "go-f3 v0.8.14 gpbft.go", href: "https://github.com/filecoin-project/go-f3/blob/v0.8.14/gpbft/gpbft.go", note: "QUALITY·CONVERGE·PREPARE·COMMIT·DECIDE와 timeout state의 pinned 구현이며 EC validity는 별도" },
    { kind: "공식 코드", label: "go-f3 v0.8.14 quorum validation", href: "https://github.com/filecoin-project/go-f3/tree/v0.8.14/gpbft", note: "Historical weighted quorum·message validation의 pinned source이며 certificate catch-up 전체는 아님" },
  ],
  "blockchain/narwhal-deep": [
    { kind: "핵심 논문", label: "Narwhal and Tusk · arXiv 2105.11827", href: "https://arxiv.org/abs/2105.11827", note: "Worker/primary 분리와 availability-certificate DAG의 원문이며 논문 TPS·latency를 current Sui 값으로 일반화하지 않음" },
    { kind: "공식 코드", label: "Archived Narwhal primary types · commit e67f915", href: "https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/types/src/primary.rs", note: "Header·vote·certificate validation의 pinned historical source이며 maintained current Sui consensus는 아님" },
    { kind: "공식 코드", label: "Archived Narwhal worker · commit e67f915", href: "https://github.com/MystenLabs/narwhal/tree/e67f91530e6bd4ef7808e42f548f07e58764ec5b/worker/src", note: "Batch dissemination·retrieval implementation이며 permanent retention·total order·execution receipt를 보장하지 않음" },
  ],
  "blockchain/bullshark-deep": [
    { kind: "핵심 논문", label: "Bullshark · arXiv 2201.05677", href: "https://arxiv.org/abs/2201.05677", note: "Wave·leader DAG ordering variants의 원문이며 partial-synchrony와 asynchronous-coin 전제를 서로 바꾸어 쓰지 않음" },
    { kind: "공식 코드", label: "Archived Bullshark · commit e67f915", href: "https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/consensus/src/bullshark.rs", note: "Even-round leader·f+1 support의 historical standalone 구현이며 current Sui 또는 모든 paper variant는 아님" },
    { kind: "공식 코드", label: "Archived Bullshark ordering utils · commit e67f915", href: "https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/consensus/src/utils.rs", note: "Sub-DAG traversal·ordering의 pinned source이며 transaction fairness·application success는 별도" },
  ],
  "blockchain/autobahn-deep": [
    { kind: "핵심 논문", label: "Autobahn · arXiv 2401.10369", href: "https://arxiv.org/abs/2401.10369", note: "Chained lanes·cut consensus·view change의 primary paper이며 legacy fixed timeout·BLS·TPS를 보편값으로 주장하지 않음" },
    { kind: "핵심 논문", label: "Autobahn §5.1 Lanes and Cars", href: "https://arxiv.org/pdf/2401.10369#page=9", note: "f+1 PoA와 tip semantics의 근거이며 PoA를 non-equivocation QC·total order로 확대하지 않음" },
    { kind: "핵심 논문", label: "Autobahn §5.2–5.4 consensus", href: "https://arxiv.org/pdf/2401.10369#page=12", note: "Prepare·Confirm·all-node fast path·TC recovery 근거이며 cut commit이 payload sync·execution 완료를 뜻하지 않음" },
  ],
  "blockchain/mysticeti": [
    { kind: "핵심 논문", label: "Mysticeti · arXiv 2310.14821", href: "https://arxiv.org/abs/2310.14821", note: "Uncertified DAG·direct/indirect decisions·FPC 원문이며 paper 성능과 options를 current deployment 상수로 일반화하지 않음" },
    { kind: "공식 코드", label: "Sui mainnet-v1.77.2 BaseCommitter", href: "https://github.com/MystenLabs/sui/blob/mainnet-v1.77.2/consensus/core/src/base_committer.rs", note: "Exact tag commit 51d177a의 leader-decision source이며 future ProtocolConfig를 고정하지 않음" },
    { kind: "공식 코드", label: "Sui mainnet-v1.77.2 consensus core", href: "https://github.com/MystenLabs/sui/tree/mainnet-v1.77.2/consensus/core/src", note: "UniversalCommitter·Linearizer·transaction vote tracking의 pinned source이며 application checkpoint durability는 별도" },
  ],
  "blockchain/impl-field-arithmetic": [
    { kind: "공식 코드", label: "arkworks algebra prime-field model · commit 6a28df5", href: "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ff/src/fields/models/fp", note: "Prime-field configuration과 big-integer implementation의 pinned source이며 custom constants·side-channel audit 보장은 아님" },
    { kind: "공식 코드", label: "arkworks canonical serialization · commit 6a28df5", href: "https://github.com/arkworks-rs/algebra/blob/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/serialize/src/lib.rs", note: "Serialization·validation trait boundary이며 concrete field range와 cross-language parity는 별도" },
  ],
  "blockchain/impl-elliptic-curve": [
    { kind: "공식 코드", label: "arkworks BN254 parameters · commit e2d16a2", href: "https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254", note: "BN254 fields·G1/G2·pairing configuration의 pinned source이며 다른 curve/profile 보장은 아님" },
    { kind: "공식 코드", label: "arkworks short-Weierstrass model · commit 6a28df5", href: "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ec/src/models/short_weierstrass", note: "Affine/projective types와 operation source이며 모든 formula completeness·constant-time 보장은 아님" },
  ],
  "blockchain/impl-groth16": [
    { kind: "핵심 논문", label: "Groth16 · ePrint 2016/260", href: "https://eprint.iacr.org/2016/260", note: "Relation-specific CRS와 3-element proof construction의 원문이며 Rust artifact/ceremony 운영 보장은 아님" },
    { kind: "공식 코드", label: "arkworks Groth16 data/prover · commit 8f0904a", href: "https://github.com/arkworks-rs/groth16/tree/8f0904a7d7a2c8945bf770bdd3c2081e0be1941a/src", note: "Pinned key/proof structures와 prover path이며 production readiness·fixed speed 보장은 아님" },
  ],
  "gpu/rapidsnark-gpu": [
    { kind: "공식 코드", label: "iden3 rapidsnark · commit 81eddf1", href: "https://github.com/iden3/rapidsnark/tree/81eddf1a536d26497b237c0b8a04fe90baf7e439", note: "Current C++·Intel/ARM CPU prover와 WTNS/zkey stage source이며 GPU backend 근거는 아님" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices · Timing", href: "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#timing", note: "Async CUDA timing과 synchronization 방법이며 rapidsnark GPU implementation·speedup 보장은 아님" },
  ],
  "blockchain/impl-plonk": [
    { kind: "핵심 논문", label: "PLONK · ePrint 2019/953", href: "https://eprint.iacr.org/2019/953", note: "Selector·permutation·polynomial commitment protocol의 원문이며 Rust artifact·lookup·고정 성능 보장은 아님" },
    { kind: "공식 코드", label: "dusk-network/plonk · commit 768cf84", href: "https://github.com/dusk-network/plonk/tree/768cf849826c85441fdb2346c4640239e7b476f5/src", note: "Compiler/prover/key source snapshot이며 모든 PLONK variant·production security를 대표하지 않음" },
  ],
  "crypto/risc0": [
    { kind: "공식 문서", label: "RISC Zero zkVM lifecycle · v3.0.6", href: "https://github.com/risc0/risc0/blob/1cc70cf05033a79ebc90f07c679cb4bd1cd301b9/website/api/zkvm/zkvm-overview.md", note: "Guest ELF→session→receipt→ImageID/journal lifecycle의 pinned 설명이며 고정 성능 보장은 아님" },
    { kind: "공식 코드", label: "RISC Zero receipt/claim · v3.0.6", href: "https://github.com/risc0/risc0/tree/1cc70cf05033a79ebc90f07c679cb4bd1cd301b9/risc0/zkvm/src", note: "Receipt integrity와 expected claim 비교 source이며 guest logic·journal privacy 보장은 아님" },
  ],
  "crypto/sp1": [
    { kind: "공식 코드", label: "SP1 executor Program·ExecutionRecord · v6.4.0", href: "https://github.com/succinctlabs/sp1/tree/f66b4bff51d0ccff51d152e0f7f66b2ffedf3529/crates/core/executor/src", note: "RV64IM ELF parsing과 record/shard source이며 모든 ELF·optimal shard size 보장은 아님" },
    { kind: "공식 코드", label: "SP1 SDK proof/prover · v6.4.0", href: "https://github.com/succinctlabs/sp1/tree/f66b4bff51d0ccff51d152e0f7f66b2ffedf3529/crates/sdk/src", note: "Proof modes·public values·vkey checks와 lifecycle source이며 cross-version compatibility·fixed backend speed 보장은 아님" },
  ],
  "isms-aml/vasp-custody-management": [
    { kind: "공식 문서", label: "금융위원회 · 가상자산이용자보호법 시행 Q&A", href: "https://www.fsc.go.kr/po020201/83937", note: "2026-08-14 확인한 국내 콜드월렛 경제적 가치 80%·일일 산정 경계이며 PoR·지급능력·key safety 보장은 아님" },
    { kind: "공식 가이드", label: "FATF · Updated Guidance for VA and VASPs", href: "https://www.fatf-gafi.org/content/dam/fatf/documents/recommendations/Updated-Guidance-VA-VASP.pdf", note: "VASP와 third-party custody의 risk-based control 원칙이며 특정 wallet·custodian·PoR 제품 승인은 아님" },
  ],
  "isms-aml/vasp-wallet-security": [
    { kind: "공식 문서", label: "금융위원회 · 가상자산이용자보호법 시행 Q&A", href: "https://www.fsc.go.kr/po020201/83937", note: "국내 이용자 자산 보관·손실보호의 현행 상위 경계이며 HSM·MPC·multisig 설계 승인은 아님" },
    { kind: "공식 가이드", label: "FATF · Updated Guidance for VA and VASPs", href: "https://www.fatf-gafi.org/content/dam/fatf/documents/recommendations/Updated-Guidance-VA-VASP.pdf", note: "VASP ongoing monitoring·risk control 원칙이며 특정 signing·finality·recovery policy를 정하지 않음" },
  ],
  "isms-aml/vasp-unfair-trading": [
    { kind: "공식 문서", label: "금융위원회 · 가상자산 이상거래 상시감시 현장점검", href: "https://www.fsc.go.kr/po010101/82943", note: "거래소의 가격·거래량 상시감시·예방·혐의통보 경계이며 alert가 위법·유죄를 확정하지 않음" },
    { kind: "공식 문서", label: "금융위원회 · 불공정거래 조사 2년 성과", href: "https://www.fsc.go.kr/po010105/87357", note: "2026-07 공개된 감시→혐의통보→당국 조사 흐름의 snapshot이며 건수·평균을 detector 성능으로 일반화하지 않음" },
  ],
  "blockchain/pq-account": [
    { kind: "공식 규격", label: "ERC-4337 · Account Abstraction Using Alt Mempool", href: "https://eips.ethereum.org/EIPS/eip-4337", note: "UserOperation·bundler·EntryPoint validation/execution 경계이며 ML-DSA·native verifier·block inclusion 보장은 아님" },
    { kind: "공식 규격", label: "NIST FIPS 204 · ML-DSA", href: "https://csrc.nist.gov/pubs/fips/204/final", note: "ML-DSA algorithm·parameter·encoding의 최종 표준과 errata 진입점이며 EVM integration·gas·recovery 보장은 아님" },
    { kind: "공식 규격", label: "ERC-7562 · Account Abstraction Validation Scope Rules", href: "https://eips.ethereum.org/EIPS/eip-7562", note: "Bundler validation scope·DoS admission 규칙이며 모든 bundler의 PQ verifier 지원을 의미하지 않음" },
  ],
  "blockchain/stablecoin-overview": [
    { kind: "공식 문서", label: "FSB · Global Stablecoin Recommendations", href: "https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/", note: "발행·상환·안정화·transfer·governance 기능을 arrangement로 읽는 2023 공식 권고이며 특정 token safety 보장은 아님" },
    { kind: "핵심 연구", label: "BIS Working Paper 905 · Stablecoins", href: "https://www.bis.org/publ/work905.htm", note: "Backing·governance·settlement·liquidity risk 비교 근거이며 2026 issuer 상태·regulatory approval을 뜻하지 않음" },
  ],
  "blockchain/usdc-circle": [
    { kind: "공식 문서", label: "Circle · Transparency & Stability", href: "https://www.circle.com/transparency", note: "Reserve disclosure·assurance cadence와 issuer redeemability claim의 확인 진입점이며 real-time proof·즉시 상환 보장은 아님" },
    { kind: "공식 문서", label: "Circle Mint · How minting works", href: "https://developers.circle.com/circle-mint/concepts/how-minting-works", note: "Eligible account의 fiat funding·mint·redemption lifecycle이며 모든 holder의 직접 상환 자격을 뜻하지 않음" },
    { kind: "공식 구현", label: "Circle · CCTP Technical Guide", href: "https://developers.circle.com/cctp/references/technical-guide", note: "Burn message·attestation·domain·destination mint protocol이며 reserve solvency·destination app safety 보장은 아님" },
  ],
  "blockchain/dai-maker": [
    { kind: "공식 코드", label: "Sky ecosystem · Multi-Collateral DAI core · fa4f663", href: "https://github.com/sky-ecosystem/dss/tree/fa4f6630afb0624d04a003e920b0d71a00331d98", note: "Vat·Spot·Jug·Dog/Clipper·adapter pinned source이며 current parameter·governance·Sky product 전체를 고정하지 않음" },
    { kind: "공식 코드", label: "Sky ecosystem · Lite PSM · dbf0022", href: "https://github.com/sky-ecosystem/dss-lite-psm/tree/dbf0022225f645f5697e5517d0cf00810471bccf", note: "PSM·Pocket·Mom·fees·capacity pinned source이며 collateral issuer 무위험·unlimited redemption을 뜻하지 않음" },
  ],
  "blockchain/uniswap-v4": [
    { kind: "공식 코드", label: "Uniswap v4-core v4.0.0 · e50237c", href: "https://github.com/Uniswap/v4-core/tree/e50237c43811bd9b526eff40f26772152a42daba", note: "PoolManager·PoolKey·unlock·delta·hook executable source이며 arbitrary hook/router safety 보장은 아님" },
    { kind: "공식 코드", label: "Uniswap v4 Hooks.sol · e50237c", href: "https://github.com/Uniswap/v4-core/blob/e50237c43811bd9b526eff40f26772152a42daba/src/libraries/Hooks.sol", note: "Hook address flags·callback validation source이며 hook economic·upgrade·access-control safety 보장은 아님" },
    { kind: "핵심 논문", label: "Uniswap v4 Core whitepaper", href: "https://app.uniswap.org/whitepaper-v4.pdf", note: "Singleton·hooks·flash accounting architecture 원문이며 fixed gas saving·liquidity·price execution 보장은 아님" },
    { kind: "공식 문서", label: "Uniswap · Permissioned Pools architecture", href: "https://developers.uniswap.org/docs/protocols/v4-hooks/permissioned-pools/architecture", note: "Adapter·permissioned hook·position manager·router 책임과 action flags의 current 공식 구조이며 개별 시장 법률 적합성 보장은 아님" },
    { kind: "공식 프로젝트 기록", label: "Uniswap Labs · Introducing Permissioned Pools", href: "https://blog.uniswap.org/es-ES/introducing-permissioned-pools-on-uniswap-v4", note: "2026 공개 방향과 named integrations 근거이며 planned authorization·deployment를 완료 상태로 확대하지 않음" },
  ],
  "blockchain/pbft-deep": [
    { kind: "핵심 논문", label: "Practical Byzantine Fault Tolerance · OSDI 1999", href: "https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance", note: "PBFT normal case·view change·checkpoint·client protocol의 원문이며 당시 crypto·NFS 수치를 current deployment 상수로 일반화하지 않음" },
    { kind: "핵심 논문", label: "PBFT §4.2 Normal-Case Operation", href: "https://www.usenix.org/legacy/publications/library/proceedings/osdi99/full_papers/castro/castro_html/node4.html#SECTION00042000000000000000", note: "Prepared·committed-local과 ordered execution의 exact 정의이며 단일 message가 client success를 뜻하지 않음" },
    { kind: "핵심 논문", label: "PBFT §4.3–4.4 Checkpoint and View Change", href: "https://www.usenix.org/legacy/publications/library/proceedings/osdi99/full_papers/castro/castro_html/node4.html#SECTION00043000000000000000", note: "Stable checkpoint·watermark·NEW-VIEW reconstruction 근거이며 local snapshot 하나로 global stability를 주장하지 않음" },
  ],
  "blockchain/hotstuff-deep": [
    { kind: "핵심 논문", label: "HotStuff · arXiv 1803.05069", href: "https://arxiv.org/abs/1803.05069", note: "SafeNode·threshold QC·three-chain·pacemaker 원문이며 paper 수치를 current chain 성능으로 일반화하지 않음" },
    { kind: "핵심 논문", label: "HotStuff §4–6 SafeNode and Chaining", href: "https://arxiv.org/pdf/1803.05069#page=8", note: "Lock vote rule과 direct one/two/three-chain의 exact 근거이며 block 높이 세 개만으로 commit을 주장하지 않음" },
    { kind: "공식 구현", label: "libhotstuff prototype · commit 34aa507", href: "https://github.com/hot-stuff/libhotstuff/tree/34aa50796f201aaab91c4db5aae9d3b7aceddb5c", note: "Paper authors의 historical prototype snapshot이며 maintained production support·persistent recovery 보장은 아님" },
  ],
  "blockchain/hotstuff2": [
    { kind: "핵심 논문", label: "HotStuff-2 · ePrint 2023/397", href: "https://eprint.iacr.org/2023/397", note: "Two-phase responsive BFT와 integrated pacemaker 원문이며 모든 view가 wait-free라는 뜻은 아님" },
    { kind: "핵심 논문", label: "HotStuff-2 §4 Steady-State", href: "https://eprint.iacr.org/2023/397.pdf#page=4", note: "Nested/double certificate와 lock transition의 근거이며 application execution·durability certificate는 아님" },
    { kind: "핵심 논문", label: "HotStuff-2 §4 Pacemaker", href: "https://eprint.iacr.org/2023/397.pdf#page=6", note: "Previous-view fast entry와 O(Δ) status recovery 경계이며 Δ wait가 모든 view에 필요하다는 뜻은 아님" },
  ],
  "blockchain/jolteon-ditto": [
    { kind: "핵심 논문", label: "Jolteon and Ditto · arXiv 2106.10362", href: "https://arxiv.org/abs/2106.10362", note: "Two-chain sync path와 state-aware MVBA fallback 원문이며 current Aptos가 paper fallback을 그대로 쓴다고 주장하지 않음" },
    { kind: "핵심 논문", label: "Jolteon and Ditto §3 Jolteon", href: "https://arxiv.org/pdf/2106.10362#page=6", note: "One-chain lock·two-chain commit·highQC TC의 근거이며 TC 자체는 commit certificate가 아님" },
    { kind: "공식 코드", label: "Aptos round manager · aptos-node-v1.48.6", href: "https://github.com/aptos-labs/aptos-core/blob/aptos-node-v1.48.6/consensus/src/round_manager.rs", note: "2026-08-14 pinned Proposal·Vote·QC·TwoChainTimeoutCertificate integration이며 paper Ditto MVBA 구현과 동일시하지 않음" },
  ],
  "blockchain/commonware-deep-dive": [
    { kind: "공식 코드", label: "Commonware monorepo · v2026.7.0 commit 5950bf7", href: "https://github.com/commonwarexyz/monorepo/tree/5950bf7179bb0650a57ed58b9e0478822944b335", note: "2026-08-14 pinned runtime·crypto·P2P·consensus·storage primitives와 stability scope이며 assembled application correctness·fixed SLA 보장은 아님" },
    { kind: "공식 코드", label: "commonware-bridge validator · v2026.7.0", href: "https://docs.rs/crate/commonware-bridge/2026.7.0/source/src/bin/validator.rs", note: "Runtime·network·Simplex·application의 concrete example wiring이며 모든 Commonware deployment의 표준 architecture·운영 policy는 아님" },
  ],
  "blockchain/commonware-simplex": [
    { kind: "공식 문서", label: "commonware-consensus Simplex · v2026.7.0", href: "https://docs.rs/commonware-consensus/2026.7.0/commonware_consensus/simplex/index.html", note: "Notarize·nullify·finalize, certification, recovery와 stated latency의 pinned 설명이며 arbitrary network의 wall-clock SLA는 아님" },
    { kind: "공식 코드", label: "Commonware Simplex source · commit 5950bf7", href: "https://github.com/commonwarexyz/monorepo/blob/5950bf7179bb0650a57ed58b9e0478822944b335/consensus/src/simplex/mod.rs", note: "Batcher·Voter·Resolver·Application, lazy verification과 certificate recovery source이며 original Simplex paper와 완전 동일하다는 주장은 아님" },
  ],
  "blockchain/commonware-storage": [
    { kind: "공식 코드", label: "Commonware MMR · v2026.7.0", href: "https://github.com/commonwarexyz/monorepo/blob/5950bf7179bb0650a57ed58b9e0478822944b335/storage/src/merkle/mmr/mod.rs", note: "Location/position·peaks·proof·bagging의 pinned source이며 inclusion이 current value·finality·durability를 보장하지 않음" },
    { kind: "공식 코드", label: "Commonware QMDB · v2026.7.0", href: "https://github.com/commonwarexyz/monorepo/blob/5950bf7179bb0650a57ed58b9e0478822944b335/storage/src/qmdb/mod.rs", note: "Any·Current variants와 batch→merkleize→apply→sync/prune lifecycle source이며 candidate root를 durable commit으로 확대하지 않음" },
  ],
  "blockchain/tusk": [
    { kind: "핵심 논문", label: "Narwhal and Tusk · arXiv 2105.11827", href: "https://arxiv.org/abs/2105.11827", note: "Certified DAG와 asynchronous shared-coin ordering 원문이며 historical evaluation 수치를 current chain SLA로 일반화하지 않음" },
    { kind: "핵심 논문", label: "Narwhal and Tusk · Tusk protocol", href: "https://arxiv.org/pdf/2105.11827#page=10", note: "Coin-selected leader·f+1 support·causal history ordering의 근거이며 local arrival order나 deterministic latency bound를 뜻하지 않음" },
  ],
  "blockchain/evm-fundamentals": [
    { kind: "공식 규격", label: "Ethereum Yellow Paper · Shanghai version", href: "https://ethereum.github.io/yellowpaper/paper.pdf", note: "256-bit stack machine·execution environment·gas·halt의 형식 정본이며 Shanghai 이후 fork 변화와 client 구현 내부를 고정하지 않음" },
    { kind: "공식 구현", label: "Ethereum execution-specs · tests@v20.0.1", href: "https://github.com/ethereum/execution-specs/tree/87aba1a38a476b31f819a2390eb481527e6dc683", note: "Pinned executable semantics와 tests artifact이며 production client architecture·성능 근거로 확대하지 않음" },
  ],
  "blockchain/evm-advanced": [
    { kind: "공식 규격", label: "EIP-1014 · Skinny CREATE2", href: "https://eips.ethereum.org/EIPS/eip-1014", note: "CREATE2 address derivation·gas·collision 규칙이며 deployment 성공이나 proxy 보안을 보장하지 않음" },
    { kind: "공식 규격", label: "Ethereum Yellow Paper · call and creation", href: "https://ethereum.github.io/yellowpaper/paper.pdf", note: "Nested message-call·creation·memory·rollback semantics의 Shanghai 정본이며 이후 fork나 특정 proxy standard 전체 근거는 아님" },
  ],
  "blockchain/fork-id": [
    { kind: "공식 규격", label: "EIP-2124 · Fork identifier", href: "https://eips.ethereum.org/EIPS/eip-2124", note: "Block-number fork hash·next·four-case compatibility 규칙이며 peer honesty·block validity·finality 증명이 아님" },
    { kind: "공식 규격", label: "EIP-6122 · Fork identifier update", href: "https://eips.ethereum.org/EIPS/eip-6122", note: "Timestamp fork extension의 정본이며 모든 EIP-2124 구현이 자동 호환된다는 뜻은 아님" },
  ],
  "blockchain/node-architecture": [
    { kind: "공식 규격", label: "Ethereum execution-apis · v1.0.0-beta.7", href: "https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85", note: "Pinned Engine API methods·schemas·statuses 근거이며 특정 client module 배치나 finality를 정의하지 않음" },
    { kind: "공식 코드", label: "Reth v2.2.0 · execution client", href: "https://github.com/paradigmxyz/reth/tree/88505c7fcbfdebfd3b56d88c86b62e950043c6c4", note: "Concrete execution-client implementation snapshot이며 Ethereum protocol이나 다른 clients의 내부 구조로 일반화하지 않음" },
  ],
  "blockchain/curve-stable": [
    { kind: "핵심 논문", label: "Curve StableSwap whitepaper", href: "https://curve.fi/files/stableswap-paper.pdf", note: "Amplification invariant와 balanced-region slippage의 원 설계이며 peg·solvency·current parameter 보장은 아님" },
    { kind: "공식 코드", label: "Curve StableSwap-NG · commit 2abe778f", href: "https://github.com/curvefi/stableswap-ng/tree/2abe778f40206a6c0fd108a0a53ad3266cbedeee", note: "Pinned pool/factory·rate·fee implementation이며 모든 historical pool/deployment와 동일하다는 뜻은 아님" },
  ],
  "blockchain/rwa-composition": [
    { kind: "공식 연구", label: "IOSCO · Tokenization of Financial Assets (2025)", href: "https://www.iosco.org/library/pubdocs/pdf/IOSCOPD809.pdf", note: "Authoritative ownership record·legal recognition·custody 위험 분석이며 개별 상품 법률 의견은 아님" },
    { kind: "공식 연구", label: "BIS · The tokenisation continuum", href: "https://www.bis.org/publ/bisbull72.htm", note: "Core claim layer와 service/governance layer의 개념 근거이며 tokenisation 편익·유동성 보장은 아님" },
    { kind: "공식 문서", label: "Uniswap · Permissioned Pools architecture", href: "https://developers.uniswap.org/docs/protocols/v4-hooks/permissioned-pools/architecture", note: "Regulated pool의 compliance execution layer 근거이며 token holder의 법적 권리·issuer solvency·authoritative registry를 만들지는 않음" },
  ],
  "blockchain/berachain": [
    { kind: "공식 문서", label: "Berachain · Proof of Liquidity overview", href: "https://docs.berachain.com/general/proof-of-liquidity/overview", note: "2026-08-14 PoL actor·boost·allocation flow의 current docs이며 parameter·APR를 영구 고정하지 않음" },
    { kind: "공식 문서", label: "Berachain · Reward Vaults", href: "https://docs.berachain.com/general/proof-of-liquidity/reward-vaults", note: "Vault eligibility·stake·reward accounting surface이며 principal·incentive value 보장은 아님" },
    { kind: "공식 코드", label: "BeaconKit · commit 59c0fd16", href: "https://github.com/berachain/beacon-kit/tree/59c0fd169f024e2a0ca95b4d550012eab3e4fee9", note: "Pinned consensus/execution integration source이며 PoL economics의 safety theorem은 아님" },
  ],
  "blockchain/crypto-theory": [
    { kind: "핵심 논문", label: "Goldwasser–Micali · Probabilistic Encryption", href: "https://doi.org/10.1016/0022-0000(84)90070-9", note: "Semantic computational security의 기반이며 임의 implementation·profile 안전 보장은 아님" },
    { kind: "공식 규격", label: "NIST SP 800-57 Part 1 Rev. 5", href: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Key lifecycle·security-strength guidance이며 system compliance 인증은 아님" },
    { kind: "공식 규격", label: "RFC 5116 · Authenticated Encryption interface", href: "https://www.rfc-editor.org/rfc/rfc5116", note: "AEAD key/nonce/AAD/plaintext interface와 nonce 경계이며 key distribution·authorization을 해결하지 않음" },
  ],
  "blockchain/initia-evm": [
    { kind: "공식 코드", label: "MiniEVM x/evm · v1.2.19", href: "https://github.com/initia-labs/minievm/tree/27e60c548f3e2868f6e6b3cf6456fc9289ce7950/x/evm", note: "Ethereum↔Cosmos transaction 변환·message·sequence boundary의 pinned 근거이며 모든 RPC·fork parity나 commit 보장은 아님" },
    { kind: "공식 코드", label: "MiniEVM StateDB · v1.2.19", href: "https://github.com/initia-labs/minievm/blob/27e60c548f3e2868f6e6b3cf6456fc9289ce7950/x/evm/state/statedb.go", note: "Persistent/transient stores·snapshot·balance integration의 pinned 근거이며 transient effect를 durable app commit으로 확대하지 않음" },
    { kind: "공식 문서", label: "Initia · MiniEVM compatibility and changes", href: "https://docs.initia.xyz/home/core-concepts/initia-and-rollups/rollups/vms/minievm/evm-compatibility-and-changes", note: "2026-08-14 current compatibility·known differences 근거이며 future release나 모든 Ethereum tooling 동작을 고정하지 않음" },
  ],
  "blockchain/kohaku-provider": [
    { kind: "공식 코드", label: "Kohaku provider interface · commit 8d5a29e", href: "https://github.com/ethereum/kohaku/blob/8d5a29e3fba806431c881f72c0bc9accb0066ace/packages/provider/src/provider.ts", note: "Common methods·normalized types·TxSigner 분리의 pinned 근거이며 backend semantic·trust parity는 보장하지 않음" },
    { kind: "공식 코드", label: "Kohaku Helios adapter · commit 8d5a29e", href: "https://github.com/ethereum/kohaku/blob/8d5a29e3fba806431c881f72c0bc9accb0066ace/packages/provider/src/helios/index.ts", note: "Sync/read와 explicit getLogs bypass의 pinned 구현 근거이며 bypass 결과를 light-client verified로 해석하지 않음" },
    { kind: "공식 코드", label: "Kohaku repository · commit 8d5a29e", href: "https://github.com/ethereum/kohaku/tree/8d5a29e3fba806431c881f72c0bc9accb0066ace", note: "Package layout·version·WIP/unaudited maturity의 pinned 근거이며 provider가 roadmap 전체 privacy 기능이나 production readiness를 가진다는 뜻은 아님" },
  ],
  "blockchain/omni-octane": [
    { kind: "공식 코드", label: "Omni Octane monorepo · commit 9864f25", href: "https://github.com/omni-network/omni/tree/9864f25fa9bcb473ee34d2442012fc5fbd2683ea", note: "Halo·Octane·Engine client의 pinned integration snapshot이며 moving main·all-client compatibility·production readiness를 뜻하지 않음" },
    { kind: "공식 코드", label: "Octane ABCI proposal bridge · commit 9864f25", href: "https://github.com/omni-network/omni/blob/9864f25fa9bcb473ee34d2442012fc5fbd2683ea/octane/evmengine/keeper/abci.go", note: "PrepareProposal timeout·build/get·single payload transaction source이며 payload ID가 commit·durable identity라는 뜻은 아님" },
    { kind: "공식 코드", label: "Octane finalized payload/event path · commit 9864f25", href: "https://github.com/omni-network/omni/blob/9864f25fa9bcb473ee34d2442012fc5fbd2683ea/octane/evmengine/keeper/msg_server.go", note: "newPayload·finalized FCU·event delivery·head update ordering source이며 bounded retry·all-event atomicity·external delivery 보장은 아님" },
    { kind: "공식 규격", label: "Ethereum execution-apis · snapshot 5aebdfdd", href: "https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85", note: "Versioned Engine methods·schemas·statuses 정본이며 Octane의 ABCI packaging·retry·specific client parity를 정의하지 않음" },
  ],
  "blockchain/webcat-frontend-integrity": [
    { kind: "공식 문서", label: "WEBCAT · Concepts", href: "https://docs.webcat.tech/concepts.html", note: "Signed manifest·bundle·enrollment·transparency log·browser verification 구성 근거이며 code correctness 보장은 아님" },
    { kind: "공식 프로젝트 기록", label: "SecureDrop · WEBCAT alpha", href: "https://securedrop.org/news/webcat-alpha/", note: "2026 Firefox extension alpha와 실행 전 enforcement 공개 범위이며 표준 채택·production 완성은 아님" },
  ],
  "crypto/binary-field-proving": [
    { kind: "핵심 논문", label: "Binius · Succinct Arguments over Towers of Binary Fields", href: "https://eprint.iacr.org/2023/1784.pdf", note: "Binary tower argument construction 근거이며 임의 workload 우위·production audit를 뜻하지 않음" },
    { kind: "핵심 논문", label: "Flock · Fast batched proofs for Boolean computations", href: "https://arxiv.org/abs/2607.27491", note: "Boolean batch proof와 conventional-hash prototype benchmark 근거이며 hardware·batch 조건 밖의 보편 throughput은 아님" },
  ],
  "blockchain/ethereum-future-roadmap": [
    { kind: "공식 문서", label: "Ethereum · Quantum resistance roadmap", href: "https://ethereum.org/roadmap/security/quantum-resistance/", note: "Consensus BLS·KZG·account ECDSA·application ZK migration surface의 공식 방향이며 최종 선택·날짜 확정은 아님" },
    { kind: "공식 연구", label: "Lean Ethereum roadmap", href: "https://leanroadmap.org/", note: "FRI·STIR·WHIR formalization milestones의 공개 연구 방향이며 Ethereum 전체 formal verification 완료는 아님" },
  ],
  "ai/qwen36-hybrid-architecture": [
    { kind: "공식 문서", label: "Qwen/Qwen3.6-27B · official model card", href: "https://huggingface.co/Qwen/Qwen3.6-27B", note: "27B dense·64 layers·3:1 Gated DeltaNet/Attention·native 262,144·extended 1,010,000·multimodal·MTP 공개 범위이며 모든 runtime의 품질·VRAM·latency 보장은 아님" },
    { kind: "공식 코드", label: "Qwen3.6-27B · official config.json", href: "https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/config.json", note: "layer_types·attention/linear head shape·dtype·RoPE·vision·MTP의 machine-readable artifact이며 allocator·kernel physical memory를 단독 확정하지 않음" },
    { kind: "핵심 논문", label: "Gated Delta Networks · arXiv 2412.06464", href: "https://arxiv.org/abs/2412.06464", note: "Gating과 delta-rule correction·parallel algorithm·hybrid evaluation 원문이며 Qwen3.6 3:1 비율의 보편 최적성은 아님" },
  ],
  "ai/qwen36-hybrid-runtime": [
    { kind: "공식 구현", label: "Transformers · Qwen3.5/Qwen3.6 reference", href: "https://huggingface.co/docs/transformers/model_doc/qwen3_5", note: "Hybrid layer_types·fast-kernel/fallback·multimodal RoPE와 cache reference path이며 모든 serving engine의 production 성능을 대표하지 않음" },
    { kind: "공식 문서", label: "vLLM · Hybrid KV Cache Manager", href: "https://docs.vllm.ai/en/stable/design/hybrid_kv_cache_manager/", note: "서로 다른 cache spec의 group·block sizing·padding trade-off 공식 설계이며 logical model bytes와 실제 device allocation이 같다는 뜻은 아님" },
  ],
  "ai/qwen36-long-context-deployment": [
    { kind: "공식 문서", label: "Qwen/Qwen3.6-27B · official model card", href: "https://huggingface.co/Qwen/Qwen3.6-27B", note: "Native 262,144·별도 extended 1,010,000·multimodal 공개 범위이며 target runtime의 품질·VRAM·latency 승인은 아님" },
    { kind: "공식 구현", label: "Transformers · Qwen3.5/Qwen3.6 reference", href: "https://huggingface.co/docs/transformers/model_doc/qwen3_5", note: "Partial multimodal RoPE·visual position axes와 reference path 근거이며 모든 engine의 production 성능을 대표하지 않음" },
    { kind: "공식 코드", label: "Qwen3.6-27B · BF16 safetensors index", href: "https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/model.safetensors.index.json", note: "27,781,427,952 parameters와 total_size 55,562,855,904 bytes의 공식 weight payload이며 KV·activation·runtime peak는 포함하지 않음" },
    { kind: "공식 코드", label: "Qwen/Qwen3.6-27B-FP8 · mixed checkpoint", href: "https://huggingface.co/Qwen/Qwen3.6-27B-FP8/tree/main", note: "24.699B FP8·3.084B BF16 parameters와 약 30.9 GB artifact 근거이며 activation·KV dtype이나 48 GiB 262K admission을 자동 보장하지 않음" },
  ],
  "ai/model-vram-budgeting": [
    { kind: "공식 문서", label: "Hugging Face · Safetensors documentation", href: "https://huggingface.co/docs/safetensors/index", note: "Tensor dtype·shape·contiguous payload metadata를 읽는 format 근거이며 GPU runtime peak를 뜻하지 않음" },
    { kind: "공식 코드", label: "Qwen3.6-27B · BF16 safetensors index", href: "https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/model.safetensors.index.json", note: "total_size 55,562,855,904 bytes의 exact BF16 weight payload 적용 예이며 KV·workspace는 포함하지 않음" },
    { kind: "공식 코드", label: "Qwen3.6-27B-FP8 · mixed checkpoint", href: "https://huggingface.co/Qwen/Qwen3.6-27B-FP8/tree/main", note: "FP8·BF16 tensor가 섞인 official artifact 적용 예이며 activation·KV dtype을 자동 결정하지 않음" },
    { kind: "공식 문서", label: "vLLM · Hybrid KV Cache Manager", href: "https://docs.vllm.ai/en/stable/design/hybrid_kv_cache_manager/", note: "서로 다른 cache spec의 group·page·padding이 physical allocation을 바꾸는 공식 설계 경계" },
    { kind: "공식 문서", label: "Qwen3-Next · official architecture announcement", href: "https://qwen.ai/blog?id=qwen3-next", note: "80B total·약 3B active MoE와 hybrid attention·MTP의 공개 사례이며 active 수만으로 hardware latency·full-context admission을 확정하지 않음" },
    { kind: "공식 문서", label: "NVIDIA Transformer Engine · NVFP4 format", href: "https://docs.nvidia.com/deeplearning/transformer-engine-releases/release-2.15/user-guide/features/low_precision_training/nvfp4/nvfp4.html", note: "Blackwell NVFP4 value·block/tensor scale format 근거이며 특정 model checkpoint·dual-GPU speedup·quality 보장은 아님" },
    { kind: "공식 코드", label: "llama.cpp GGUF quantize tool README (Q8_0 benchmark)", href: "https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md", note: "Q8_0 block-scale overhead가 만드는 8.5bit/weight 평균 폭의 project 실측 근거이며 다른 model·revision의 값을 보장하지 않음" },
],
  "ai/supervised-learning-loop": [
    { kind: "보충 읽기", label: "Deep Learning Book · Machine Learning Basics", href: "https://www.deeplearningbook.org/contents/ml.html", note: "Input·target·model·objective와 generalization의 기본 역할 정본" },
    { kind: "핵심 논문", label: "Automatic Differentiation in Machine Learning: a Survey", href: "https://jmlr.org/papers/v18/17-468.html", note: "Forward·reverse derivative 계산과 optimizer update의 책임 분리" },
  ],
  "ai/train-validation-test": [
    { kind: "보충 읽기", label: "The Elements of Statistical Learning · Model Assessment and Selection", href: "https://hastie.su.domains/ElemStatLearn/", note: "Training error·selection·final assessment와 generalization 역할 구분" },
    { kind: "핵심 논문", label: "Cross-Validation: What Does It Estimate and How Well Does It Do It?", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/", note: "Cross-validation estimand와 독립 final evaluation 경계" },
  ],
  "ai/flash-attention-io-aware-kernel": [
    { kind: "핵심 논문", label: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", href: "https://arxiv.org/abs/2205.14135", note: "IO-aware tiling·recomputation 과 A100 속도·HBM 접근 수치의 출처로 결과는 저자 자기보고 범위" },
    { kind: "핵심 논문", label: "Online normalizer calculation for softmax", href: "https://arxiv.org/abs/1805.02867", note: "Running max·normalizer 갱신식의 원 출처인 2018 년 NVIDIA 기술 보고서" },
    { kind: "후속 논문", label: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning", href: "https://arxiv.org/abs/2307.08691", note: "Loop 순서 교체·지연 정규화·sequence 축 병렬을 다룬 후속으로 이 글은 언급만 하고 다음 글이 정본" },
    { kind: "공식 구현", label: "Dao-AILab/flash-attention", href: "https://github.com/Dao-AILab/flash-attention", note: "논문 저자의 CUDA 구현으로 지원 head dim 과 GPU 세대는 release 마다 확인" },
  ],
  "ai/continuous-batching-step-anatomy": [
    { kind: "공식 코드", label: "vLLM V1 scheduler: vllm/v1/core/sched/scheduler.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py", note: "schedule() 의 running 순회·preemption·waiting admission 순서와 token_budget·long_prefill_token_threshold clipping 의 근거" },
    { kind: "공식 코드", label: "vLLM SchedulerConfig: vllm/config/scheduler.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/config/scheduler.py", note: "max_num_batched_tokens 2048·max_num_seqs 128 기본값과 long_prefill_token_threshold 0 이 상한 없음이라는 docstring 의 근거" },
    { kind: "공식 문서", label: "vLLM Optimization and Performance — Chunked Prefill", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 이 chunked prefill 을 기본으로 켜고 decode 를 먼저 batch 한 뒤 남은 budget 에 prefill 을 넣는다는 설명과 budget 크기의 ITL·TTFT 맞바꿈" },
    { kind: "선행·비교 논문", label: "Orca: A Distributed Serving System for Transformer-Based Generative Models", href: "https://www.usenix.org/conference/osdi22/presentation/yu", note: "Iteration-level scheduling 과 selective batching 의 원 논문(OSDI 2022)" },
    { kind: "핵심 논문", label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve", href: "https://arxiv.org/abs/2403.02310", note: "Chunked prefill 과 stall-free scheduling 으로 mixed batch 를 만드는 근거이며 수치는 저자 자기보고" },
  ],
  "ai/serving-memory-admission-and-preemption": [
    { kind: "핵심 논문", label: "Efficient Memory Management for Large Language Model Serving with PagedAttention", href: "https://arxiv.org/abs/2309.06180", note: "FCFS·all-or-nothing eviction과 recompute·swap 정의, block 크기별 비교, OPT-13B token당 800 KB와 20.4~38.2% 활용률의 출처" },
    { kind: "공식 문서", label: "vLLM Optimization and Tuning — Preemption", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 기본 preemption mode RECOMPUTE와 preemption을 줄이는 설정 조정 방향" },
    { kind: "공식 문서", label: "vLLM v0.6.3 Engine Arguments", href: "https://docs.vllm.ai/en/v0.6.3/models/engine_args.html", note: "swap_space 기본 4 GiB, preemption_mode, block_size 16, gpu_memory_utilization 0.9의 V0 정의" },
    { kind: "공식 구현", label: "vLLM v0.6.3 BlockSpaceManagerV1", href: "https://github.com/vllm-project/vllm/blob/v0.6.3/vllm/core/block_manager_v1.py", note: "watermark 기본 0.01과 can_allocate의 OK·LATER·NEVER 조건" },
    { kind: "공식 문서", label: "SGLang Server Arguments", href: "https://docs.sglang.io/advanced_features/server_arguments.html", note: "mem-fraction-static·max-total-tokens·schedule-conservativeness와 retract 안내" },
    { kind: "공식 문서", label: "TensorRT-LLM KV Cache System", href: "https://nvidia.github.io/TensorRT-LLM/features/kvcache.html", note: "free_gpu_memory_fraction 기본 0.9와 host_cache_size secondary offload" },
  ],
  "ai/inference-runtime-anatomy": [
    { kind: "공식 문서", label: "vLLM Architecture Overview", href: "https://docs.vllm.ai/en/latest/design/arch_overview.html", note: "frontend·engine core·worker·model runner 의 process 구조와 ZMQ 연결의 근거" },
    { kind: "공식 코드", label: "vllm/v1/worker/gpu_worker.py · vllm/v1/engine/core.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/worker/gpu_worker.py", note: "init_device → load_model → determine_available_memory → initialize_from_config → compile_or_warm_up_model 순서와 KV byte 뺄셈의 근거" },
    { kind: "공식 문서", label: "vLLM Engine Arguments", href: "https://docs.vllm.ai/en/latest/configuration/engine_args.html", note: "gpu_memory_utilization·enforce_eager·load_format·distributed_executor_backend·cudagraph_capture_sizes 의 정의" },
    { kind: "공식 문서", label: "PyTorch CUDA semantics · Memory management", href: "https://docs.pytorch.org/docs/stable/notes/cuda.html#memory-management", note: "caching allocator 의 pool·reuse·fragmentation 설명의 근거" },
    { kind: "공식 문서", label: "SGLang Server Arguments", href: "https://docs.sglang.io/advanced_features/server_arguments.html", note: "mem-fraction-static·cuda-graph-max-bs·skip-server-warmup 의 정의" },
    { kind: "공식 코드", label: "sglang/srt/managers/scheduler.py · model_executor/model_runner.py", href: "https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/managers/scheduler.py", note: "TokenizerManager·Scheduler·TpModelWorker·ModelRunner 의 process 대응과 load_model → alloc_memory_pool → init_cuda_graphs 순서" },
  ],
  "ai/serving-latency-metrics-and-slo": [
    { kind: "공식 코드", label: "vLLM · vllm/benchmarks/serve.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/benchmarks/serve.py", note: "TTFT·TPOT·ITL·E2E·request/output token throughput 의 실제 계산식과 보고 percentile 의 근거" },
    { kind: "공식 문서", label: "NVIDIA · GenAI-Perf metrics", href: "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html", note: "Chunk 당 token 수로 나누는 inter token latency 정의와 avg·p99·p90·p75 보고 집합의 근거" },
    { kind: "공식 문서", label: "Google SRE Book · Service Level Objectives", href: "https://sre.google/sre-book/service-level-objectives/", note: "SLI·SLO·SLA 구분, percentile 기반 latency 목표, error budget 과 내부 SLO 여유의 근거" },
    { kind: "공식 문서", label: "vLLM · Benchmarking CLI", href: "https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md", note: "Serving benchmark 의 실행 interface 이며 방법론(warm·cold, rate sweep)은 후속 글 범위" },
  ],
  "ai/prefill-decode-phase-dynamics": [
    { kind: "핵심 논문", label: "Roofline: An Insightful Visual Performance Model for Multicore Architectures", href: "https://doi.org/10.1145/1498765.1498785", note: "Arithmetic intensity 와 ridge point 로 compute·memory 병목을 판정하는 원 model" },
    { kind: "핵심 논문", label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve", href: "https://arxiv.org/abs/2403.02310", note: "Chunked prefill 과 stall-free scheduling 으로 decode 간섭을 다룬 OSDI 2024 연구, 수치는 저자 자기보고" },
    { kind: "핵심 논문", label: "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving", href: "https://arxiv.org/abs/2401.09670", note: "Prefill·decode 간섭을 정량화한 OSDI 2024 연구, 분리 서빙 자체는 이 글 범위 밖" },
    { kind: "공식 문서", label: "vLLM Optimization and Tuning: Chunked Prefill", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 기본 활성화, decode 우선, max_num_batched_tokens 절충의 공식 근거" },
  ],
  "gpu/sm-warp-scheduling-and-issue": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1 · SIMT Architecture / Hardware Multithreading / Multiprocessor Level", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "Warp 32 thread·경로 직렬화·on-chip context·산술 latency 약 4 clock 과 warp 16개 요건의 근거" },
    { kind: "공식 문서", label: "NVIDIA Nsight Compute Profiling Guide · Scheduler Statistics / Warp State Statistics", href: "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html", note: "SM subpartition 4개, active·eligible·issued warp, long/short scoreboard·wait·not selected 분류의 근거" },
    { kind: "공식 문서", label: "NVIDIA Hopper Architecture In-Depth", href: "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/", note: "H100 SXM5 SM 132개와 SM diagram 의 처리 block 4개 구성의 근거" },
  ],
  "gpu/cuda-compilation-and-isa-analysis": [
    { kind: "공식 문서", label: "CUDA Compiler Driver NVCC — GPU Compilation", href: "https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html", note: "cudafe++·cicc·ptxas·fatbinary 단계, compute_XX·sm_XX 의 두 단계 compile, PTX runtime JIT 규칙, cubin 의 same-major 호환의 근거" },
    { kind: "공식 규격", label: "Parallel Thread Execution ISA", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html", note: "PTX 가 세대를 넘는 가상 ISA 라는 목표, .reg 의 무제한 가상 register 와 ptxas allocation, @p opcode.type 문법, sm_80·sm_90 의 ISA version 의 근거" },
    { kind: "공식 문서", label: "CUDA Binary Utilities — cuobjdump·nvdisasm", href: "https://docs.nvidia.com/cuda/cuda-binary-utilities/index.html", note: "cuobjdump -sass·-ptx·-lelf·-res-usage, nvdisasm -cfg·-plr·-g 옵션과 본문 SASS 예제의 근거" },
    { kind: "공식 문서", label: "CUDA C++ Programming Guide — Compute Capabilities", href: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities", note: "major.minor 의미, GPU 별 번호, 8.0·9.0 의 register·shared memory 한도, 9.0 전용 feature 의 근거" },
  ],
  "gpu/triton-kernel-programming-and-compiler": [
    { kind: "핵심 논문", label: "Tillet, Kung, Cox · Triton (MAPL 2019)", href: "https://www.eecs.harvard.edu/~htk/publication/2019-mapl-tillet-kung-cox.pdf", note: "Tile 단위 프로그래밍 모델과 compiler 가 tiling·coalescing·shared memory·synchronization 을 소유한다는 설계의 원 논문" },
    { kind: "공식 문서", label: "Triton programming guide chapter 1·2", href: "https://triton-lang.org/main/programming-guide/chapter-1/introduction.html", note: "Blocked program 대 scalar thread 의 대비와 compiler 자동 최적화 목록, polyhedral·scheduling language 와의 위치" },
    { kind: "공식 문서", label: "Triton tutorial 01 vector add · 03 matrix multiplication", href: "https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html", note: "N=98432·BLOCK_SIZE=1024 예, mask 와 tl.constexpr, matmul 의 grouped ordering·K 루프·autotune config 목록의 근거" },
    { kind: "공식 문서", label: "triton.autotune · triton.jit · triton.Config API reference", href: "https://triton-lang.org/main/python-api/generated/triton.autotune.html", note: "configs·key·prune_configs_by·reset_to_zero·restore_value, do_not_specialize, num_warps·num_stages 정의의 근거" },
    { kind: "공식 코드", label: "triton-lang/triton · python/triton/runtime/jit.py", href: "https://github.com/triton-lang/triton/blob/main/python/triton/runtime/jit.py", note: "Cache key = (specialization, options) 구성과 16 배수·정렬 specialization, do_not_specialize 의 근거" },
    { kind: "공식 코드", label: "triton-lang/triton · third_party/nvidia/backend/compiler.py", href: "https://github.com/triton-lang/triton/blob/main/third_party/nvidia/backend/compiler.py", note: "make_ttir·make_ttgir·make_llir·make_ptx·make_cubin 단계와 coalesce·pipeline·warp-specialize pass 이름의 근거" },
    { kind: "공식 문서", label: "LLVM · MLIR", href: "https://mlir.llvm.org/", note: "Dialect·progressive lowering·재사용 pass 라는 기반 시설 정의의 근거" },
  ],
  "gpu/cutlass-gemm-hierarchy-and-cute-layouts": [
    { kind: "공식 문서", label: "NVIDIA CUTLASS · Efficient GEMM in CUDA", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md", note: "Threadblock·warp·instruction 세 층 tile 구조와 double buffering, epilogue 의 shared memory 재배치 근거" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · CuTe Layouts (01_layout.md)", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/01_layout.md", note: "Layout 을 shape·stride 함수로 정의하고 열·행 우선과 중첩 shape 를 설명하는 근거" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · CuTe Layout Algebra (02_layout_algebra.md)", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/02_layout_algebra.md", note: "Composition·complement·logical divide·product 의 정의와 20:2 ∘ (5,4):(4,1) = (5,4):(8,2) 예" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · CuTe Tensors · MMA atoms · GEMM tutorial", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/0x_gemm_tutorial.md", note: "local_tile·local_partition, TiledCopy·TiledMMA 와 mainloop 의 copy→sync→gemm 구조" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · include/cute/atom/mma_traits_sm80.hpp", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cute/atom/mma_traits_sm80.hpp", note: "SM80_16x8x16_F32F16F16F32_TN 의 ALayout ((4,8),(2,2,2)):((32,1),(16,8,128)) 등 fragment TV layout 의 근거" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · include/cute/swizzle.hpp", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cute/swizzle.hpp", note: "Swizzle<B,M,S>::apply 의 offset ^ ((offset & yyy_mask) >> S) 식과 B·M·S 의 의미" },
    { kind: "공식 규격", label: "PTX ISA · Matrix Fragments for mma.m16n8k16", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-fragment-mma-16816-float", note: "groupID = lane>>2, threadID_in_group = lane%4 의 fragment lane 규칙 원 출처" },
    { kind: "핵심 논문", label: "EVT: Accelerating Deep Learning Training with Epilogue Visitor Tree (ASPLOS 2024)", href: "https://dl.acm.org/doi/10.1145/3620666.3651369", note: "Epilogue visitor tree 의 구조와 compiler 자동 생성 근거이며 수치는 저자 자기보고" },
  ],
  "gpu/gpu-memory-hierarchy-and-roofline": [
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1 · Coalesced Access / Effective Bandwidth / Device Memory Spaces", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "32-byte transaction 규칙, misaligned·strided 예, effective bandwidth 식, local·constant memory 위치 표의 근거" },
    { kind: "공식 문서", label: "NVIDIA Nsight Compute Profiling Guide · Speed Of Light / Roofline Charts / Scheduler Statistics", href: "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html", note: "Pipe utilization·DRAM throughput·eligible warp 와 계층별 roofline chart 의 근거" },
    { kind: "핵심 논문", label: "Williams, Waterman, Patterson · Roofline: An Insightful Visual Performance Model for Multicore Architectures (CACM 2009)", href: "https://escholarship.org/uc/item/3qf383m0", note: "min(peak, bandwidth × intensity) 지붕과 ridge point 의 원 model" },
    { kind: "공식 문서", label: "NVIDIA Hopper Architecture In-Depth", href: "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/", note: "H100 SXM5 SM 132개·L2 50 MB·SM 당 L1/shared 256 KB·HBM3 구성의 근거" },
    { kind: "공식 문서", label: "NVIDIA H100 Tensor Core GPU 제품 명세", href: "https://www.nvidia.com/en-us/data-center/h100/", note: "H100 SXM 의 3.35 TB/s 와 FP32 67 TFLOPS, FP16 Tensor peak 의 근거" },
  ],
  "gpu/cutlass-collectives-and-tile-schedulers": [
    { kind: "핵심 논문", label: "Stream-K: Work-centric Parallel Decomposition for Dense Matrix-Matrix Multiplication on the GPU (PPoPP 2023)", href: "https://arxiv.org/abs/2301.03598", note: "k-iteration 균등 분배·partial fixup·hybrid 와 wave quantization 정의의 근거이며 A100 수치는 저자 자기보고" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · GEMM API 3.x (gemm_api_3x.md)", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/gemm_api_3x.md", note: "다섯 층, CollectiveMma 인자, DispatchPolicy·KernelSchedule 이름, CollectiveBuilder 의 근거" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · Efficient GEMM in CUDA (warp specialization·rasterization)", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md", note: "Producer·consumer warp group, cooperative·ping-pong schedule, threadblock rasterization 설명" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · include/cutlass/gemm/kernel/static_tile_scheduler.hpp", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/kernel/static_tile_scheduler.hpp", note: "current_work_linear_idx_ += total_grid_size_ 의 persistent 증가와 raster·swizzle decode 의 근거" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · include/cutlass/gemm/kernel/sm90_tile_scheduler_stream_k.hpp", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/kernel/sm90_tile_scheduler_stream_k.hpp", note: "Stream-K unit 의 partial store·barrier 증가·final split 의 epilogue 분기와 DecompositionMode 의 근거" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · include/cutlass/gemm/collective/builders/sm90_gmma_builder.inl", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/collective/builders/sm90_gmma_builder.inl", note: "compute_stage_count_or_override 의 (capacity − carveout) / (align(A+B) + barrier) 식의 근거" },
    { kind: "공식 가이드", label: "NVIDIA Hopper Tuning Guide", href: "https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html", note: "Cluster 8·16 상한, SM 228 KB·threadblock 227 KB, TMA multicast 와 DSM 접근 권고" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · Profiler (profiler.md)", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/profiler.md", note: "--operation·--kernels·--cta_m/n/k·--cluster_m/n·--stages·--raster_order·--swizzle_size flag 와 CUTLASS_LIBRARY_KERNELS 의 근거" },
  ],
  "ai/attention-kernel-anatomy-and-backends": [
    { kind: "핵심 논문", label: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning", href: "https://arxiv.org/abs/2307.08691", note: "Warp 분할·sequence 병렬·causal skip 배율의 출처로 A100 자기보고 범위" },
    { kind: "핵심 논문", label: "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision", href: "https://arxiv.org/abs/2407.08608", note: "Warp specialization·pingpong·FP8 과 matmul·지수 처리량 수치의 출처로 H100 자기보고 범위" },
    { kind: "핵심 논문", label: "FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving", href: "https://arxiv.org/abs/2501.01005", note: "Block-sparse KV·JIT template·plan–run scheduler 와 ITL 개선 수치의 출처" },
    { kind: "공식 문서", label: "vLLM · Attention Backend Feature Support", href: "https://docs.vllm.ai/en/latest/design/attention_backends/", note: "Backend 목록, --attention-backend 인자, 우선순위 자동 선택, MLA 의 prefill·decode backend 분리의 근거" },
    { kind: "공식 구현", label: "Dao-AILab/flash-attention", href: "https://github.com/Dao-AILab/flash-attention", note: "FlashAttention-2·3 kernel 과 tile 크기 표의 실제 코드" },
    { kind: "공식 구현", label: "flashinfer-ai/flashinfer", href: "https://github.com/flashinfer-ai/flashinfer", note: "Plan–run API 와 block-sparse KV 형식의 실제 코드" },
  ],
  "ai/serving-benchmark-methodology": [
    { kind: "공식 문서", label: "vLLM · Benchmark CLI (docs/benchmarking/cli.md)", href: "https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md", note: "request-rate·burstiness·max-concurrency·dataset·ramp-up flag 와 보고 지표의 근거" },
    { kind: "공식 문서", label: "NVIDIA · GenAI-Perf load generation 옵션", href: "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html", note: "warmup-request-count·stability-percentage·synthetic 입력 분포 flag 의 근거" },
    { kind: "공식 규격", label: "MLCommons · MLPerf Inference Rules", href: "https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc", note: "Scenario 정의, Server 의 Poisson 도착과 latency 조건 아래 최대 throughput 탐색, 최소 실행 시간·query 수의 근거" },
    { kind: "보충 읽기", label: "Harchol-Balter · Performance Modeling and Design of Computer Systems", href: "https://doi.org/10.1017/CBO9781139226424", note: "Little's law 와 M/M/1 의 W = 1/(μ−λ) 유도, open·closed system 차이의 근거" },
  ],
  "ai/cuda-graph-capture": [
    { kind: "공식 문서", label: "CUDA C++ Programming Guide — CUDA Graphs", href: "https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html", note: "node·edge 정의, 정의·instantiate·실행 세 단계, stream capture 규칙, cudaGraphExecUpdate 제약의 근거" },
    { kind: "공식 문서", label: "Getting Started with CUDA Graphs (NVIDIA Technical Blog)", href: "https://developer.nvidia.com/blog/cuda-graphs/", note: "V100에서 kernel당 9.6·3.8·3.4 µs와 instantiate 약 400 µs라는 저자 자기보고 수치의 출처" },
    { kind: "공식 문서", label: "PyTorch CUDA semantics — CUDA Graphs", href: "https://docs.pytorch.org/docs/stable/notes/cuda.html", note: "capture 전 warmup, CPU 동기화·dynamic control flow 금지, private memory pool과 graph_pool_handle 공유 조건의 근거" },
    { kind: "공식 구현", label: "vLLM vllm/config/compilation.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/config/compilation.py", note: "cudagraph_capture_sizes 기본 생성 규칙과 상한 512·1024, cudagraph_num_of_warmups docstring의 근거" },
    { kind: "공식 구현", label: "vLLM vllm/compilation/cuda_graph.py CUDAGraphWrapper", href: "https://github.com/vllm-project/vllm/blob/main/vllm/compilation/cuda_graph.py", note: "batch_descriptor를 key로 capture·replay를 분기하는 실제 구현" },
  ],
  "ai/disaggregated-prefill-decode-serving": [
    { kind: "핵심 논문", label: "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving", href: "https://arxiv.org/abs/2401.09670", note: "Phase별 parallelism·replica 배치 알고리즘, OPT-66B 512 token KV 1.13 GB와 90 Gbps 계산, NVLink 600 GB/s, 7.4배·12.6배 결과의 출처" },
    { kind: "핵심 논문", label: "Splitwise: Efficient Generative LLM Inference Using Phase Splitting", href: "https://arxiv.org/abs/2311.18677", note: "Layer-wise KV 전송의 64%·16.5%·0.8% overhead, H100 400 Gbps·A100 200 Gbps, 이종 배치의 1.4배·2.35배 throughput" },
    { kind: "핵심 논문", label: "Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving", href: "https://arxiv.org/abs/2407.00079", note: "분산 KV cache, Conductor의 prefix hit·queue·transfer 시간 scoring, decode node 사전 선택, 525%·75% 결과" },
    { kind: "공식 문서", label: "vLLM Disaggregated Prefilling", href: "https://docs.vllm.ai/en/latest/features/disagg_prefill.html", note: "kv_transfer_config·kv_role·connector 목록, prompt_token_ids 전달, throughput은 오르지 않는다는 명시" },
    { kind: "공식 문서", label: "SGLang PD Disaggregation", href: "https://docs.sglang.io/advanced_features/pd_disaggregation.html", note: "disaggregation-mode prefill·decode, Mooncake·NIXL backend, bootstrap port, router pd-disaggregation 인자" },
    { kind: "공식 구현", label: "sglang-router README (PyPI)", href: "https://pypi.org/project/sglang-router/", note: "Cache-aware policy의 근사 radix tree, cache_threshold·balance_abs_threshold·balance_rel_threshold·eviction_interval·max_tree_size" },
  ],
  "ai/tensor-and-pipeline-parallel-inference": [
    { kind: "핵심 논문", label: "Megatron-LM (arXiv 1909.08053)", href: "https://arxiv.org/abs/1909.08053", note: "column 뒤 row 분할, head 단위 attention 분할, layer 당 all-reduce 두 번의 근거" },
    { kind: "핵심 논문", label: "GPipe (arXiv 1811.06965)", href: "https://arxiv.org/abs/1811.06965", note: "micro-batch pipeline schedule 과 bubble O((K−1)/(M+K−1)), M ≥ 4K 기준의 근거" },
    { kind: "핵심 논문", label: "Ring Attention (arXiv 2310.01889)", href: "https://arxiv.org/abs/2310.01889", note: "KV block ring 회전, 조건 c ≥ F/B, A100 NVLink·InfiniBand 최소 block 표의 근거" },
    { kind: "핵심 논문", label: "Reducing Activation Recomputation in Large Transformer Models (arXiv 2205.05198)", href: "https://arxiv.org/abs/2205.05198", note: "sequence parallelism 이 LayerNorm·dropout 을 token 축으로 나누고 all-reduce 를 reduce-scatter·all-gather 로 바꿔도 통신이 늘지 않는다는 근거" },
    { kind: "공식 문서", label: "NCCL User Guide · Collective Operations", href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html", note: "AllReduce·ReduceScatter·AllGather 의 정의와 등식의 근거" },
    { kind: "공식 문서", label: "NVIDIA NVLink", href: "https://www.nvidia.com/en-us/data-center/nvlink/", note: "Hopper 세대 GPU 당 NVLink 900 GB/s 수치의 근거" },
  ],
  "ai/prefix-caching-radix-attention": [
    { kind: "핵심 논문", label: "SGLang: Efficient Execution of Structured Language Model Programs (NeurIPS 2024)", href: "https://arxiv.org/abs/2312.07104", note: "§3 RadixAttention 의 radix tree·LRU eviction·cache-aware scheduling 과 Theorem 3.1, Alg. 1 pseudocode 의 근거. 수치는 저자 자기보고" },
    { kind: "공식 문서", label: "vLLM design docs — Automatic Prefix Caching", href: "https://docs.vllm.ai/en/latest/design/prefix_caching.html", note: "Chained block hash·full block 만 cache·free queue LRU 와 역순 반환의 근거" },
    { kind: "공식 코드", label: "vLLM V1 CommonAttentionMetadata: vllm/v1/attention/backends/utils.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/attention/backends/utils.py", note: "query_start_loc·seq_lens·num_actual_tokens·block_table_tensor·slot_mapping field 와 build_for_cudagraph_capture 의 근거" },
    { kind: "공식 코드", label: "vLLM V1 FlashAttentionMetadata: vllm/v1/attention/backends/flash_attn.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/attention/backends/flash_attn.py", note: "use_cascade·common_prefix_len·prefix_kv_lens·suffix_kv_lens field 와 FlashAttentionMetadataBuilder.build 의 근거" },
    { kind: "공식 코드", label: "vLLM V1 KV cache coordinator: vllm/v1/core/kv_cache_coordinator.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_coordinator.py", note: "HybridKVCacheCoordinator.find_longest_cache_hit 의 고정점 반복과 Unitary·NoPrefixCache coordinator 선택의 근거" },
    { kind: "공식 코드", label: "vLLM V1 KVCacheManager·BlockPool: vllm/v1/core/kv_cache_manager.py · block_pool.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_manager.py", note: "get_computed_blocks 의 prompt_length − 1 규칙, free 의 역순 반환, touch·get_new_blocks 의 hash 제거 근거" },
    { kind: "공식 문서", label: "SGLang — Server Arguments (schedule-policy · radix-eviction-policy)", href: "https://docs.sglang.io/advanced_features/server_arguments.html", note: "lpm·fcfs·dfs-weight 등 schedule-policy 선택지와 lru·lfu·slru·priority eviction 옵션의 근거" },
  ],
  "ai/speculative-decoding-variants": [
    { kind: "핵심 논문", label: "LayerSkip: Enabling Early Exit Inference and Self-Speculative Decoding", href: "https://arxiv.org/abs/2404.16710", note: "Self-speculative decoding 의 KV 공유·학습 recipe 와 배율의 출처" },
    { kind: "핵심 논문", label: "DeepSeek-V3 Technical Report", href: "https://arxiv.org/abs/2412.19437", note: "MTP module 구조(§2.2)와 수락률 85~90 %·TPS 1.8 배(§5.4.3)의 출처" },
    { kind: "핵심 논문", label: "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads", href: "https://arxiv.org/abs/2401.10774", note: "Head 별 Cartesian 곱 tree 와 node 수 식 Σ_k Π s_i 의 출처" },
    { kind: "핵심 논문", label: "SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification", href: "https://arxiv.org/abs/2305.09781", note: "Token tree, topology-aware mask, tree 검증 성공률 표의 출처" },
    { kind: "핵심 논문", label: "SuffixDecoding: Extreme Speculative Decoding for Emerging AI Applications", href: "https://arxiv.org/abs/2411.04975", note: "Suffix tree draft, 20 µs/token, AgenticSQL 배율의 출처" },
    { kind: "선행·비교 논문", label: "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty", href: "https://arxiv.org/abs/2401.15077", note: "Feature 단계 tree draft 의 예로 링크만 하며 정본은 vllm-spec-decode" },
    { kind: "선행·비교 논문", label: "Draft & Verify: Lossless Large Language Model Acceleration via Self-Speculative Decoding", href: "https://arxiv.org/abs/2309.08168", note: "학습 없이 layer 를 건너뛰는 self-speculative 변형의 출처" },
  ],
  "ai/inference-cost-and-capacity-planning": [
    { kind: "공식 문서", label: "Kubernetes · Horizontal Pod Autoscaling", href: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", note: "HPA 계산식, sync 15 초, tolerance 0.1, scale-down 안정화 창 5 분의 근거" },
    { kind: "공식 문서", label: "NVIDIA · GPU Operator GPU sharing (time-slicing·MIG)", href: "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html", note: "Time-slicing 의 격리 부재와 MIG 의 hardware 격리 차이의 근거" },
    { kind: "공식 문서", label: "NVIDIA · MIG User Guide supported profiles", href: "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-mig-profiles.html", note: "80 GB A100·H100 의 MIG profile 과 가능한 instance 수의 근거" },
    { kind: "공식 문서", label: "AWS · Amazon EC2 pricing 구매 옵션", href: "https://aws.amazon.com/ec2/pricing/", note: "On-Demand·Savings Plans·Reserved·Spot·Capacity Reservations 구분의 근거. 단가는 인용하지 않음" },
    { kind: "공식 규격", label: "MLCommons · MLPerf Inference Datacenter power", href: "https://mlcommons.org/benchmarks/inference-datacenter/", note: "System 전체 AC 전력을 벽에서 재는 performance per watt 측정 기준의 근거" },
  ],
  "ai/parallelism-strategy-and-placement": [
    { kind: "공식 문서", label: "NVIDIA NVLink and NVLink Switch", href: "https://www.nvidia.com/en-us/data-center/nvlink/", note: "GPU 당 NVLink 900 GB/s (Hopper) 와 NVSwitch all-to-all 의 근거" },
    { kind: "공식 문서", label: "vLLM Parallelism and Scaling", href: "https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html", note: "TP 는 node 안, PP 는 node 수, NVLink 없으면 PP, node 를 넘는 TP 는 InfiniBand 라는 권고의 근거" },
    { kind: "핵심 논문", label: "Megatron-LM (arXiv 1909.08053) Section 5.1", href: "https://arxiv.org/abs/1909.08053", note: "NVSwitch 300 GB/s·InfiniBand 100 GB/s 구성에서 8-way 77%, 512 GPU 74% weak scaling 의 근거" },
    { kind: "핵심 논문", label: "Ring Attention (arXiv 2310.01889)", href: "https://arxiv.org/abs/2310.01889", note: "communication–compute overlap 의 구체 예와 A100 NVLink·InfiniBand 최소 block 표의 근거" },
    { kind: "공식 문서", label: "NCCL User Guide · Collective Operations", href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html", note: "배치 계산에 쓰는 all-reduce 정의의 근거" },
  ],
  "ai/expert-parallelism-moe-systems": [
    { kind: "핵심 논문", label: "GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding", href: "https://arxiv.org/abs/2006.16668", note: "Expert 하나를 device 하나에 두는 EP, einsum all-to-all dispatch·combine, 2N/E capacity, 2,048 TPU v3 600B 학습" },
    { kind: "핵심 논문", label: "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", href: "https://arxiv.org/abs/2101.03961", note: "Expert capacity = tokens/experts × capacity factor, 초과 token residual 통과, factor 1.0·1.25·2.0, α = 0.01" },
    { kind: "핵심 논문", label: "DeepSpeed-MoE: Advancing Mixture-of-Experts Inference and Training to Power Next-Generation AI Scale", href: "https://arxiv.org/abs/2201.05596", note: "추론용 EP·DP·TP 결합과 hierarchical all-to-all, 7.3배·4.5배·9배 자기보고" },
    { kind: "핵심 논문", label: "DeepSeek-V3 Technical Report", href: "https://arxiv.org/abs/2412.19437", note: "Node-limited routing M = 4, NVLink 160 GB/s 대 IB 50 GB/s, IB→NVLink forwarding kernel 20 SM, bias γ = 0.001, prefill EP 32·decode EP 320 배포" },
    { kind: "공식 구현", label: "DeepEP README", href: "https://github.com/deepseek-ai/DeepEP", note: "Normal·low-latency kernel 구분, node 사이 RDMA dispatch 약 90 GB/s와 node 안 NVLink 700 GB/s대 표, hardware 요구" },
  ],
  "ai/launch-overhead-and-cpu-gpu-synchronization": [
    { kind: "공식 문서", label: "Getting Started with CUDA Graphs (NVIDIA Technical Blog)", href: "https://developer.nvidia.com/blog/cuda-graphs/", note: "V100 에서 kernel 당 9.6·3.8·3.4 µs 와 첫 graph launch 약 33% 추가 비용이라는 저자 자기보고 수치의 출처" },
    { kind: "공식 문서", label: "PyTorch CUDA semantics", href: "https://docs.pytorch.org/docs/stable/notes/cuda.html", note: "비동기 enqueue, .item() 등 동기화 호출 목록, capture 전 warmup 과 capture 제약의 근거" },
    { kind: "공식 문서", label: "CUDA C++ Best Practices Guide — Timing", href: "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html", note: "kernel launch 와 Async copy 가 비동기라는 서술과 CPU–GPU 동기화 지점이 pipeline stall 을 뜻한다는 권고의 근거" },
    { kind: "공식 구현", label: "vLLM vllm/config/compilation.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/config/compilation.py", note: "cudagraph_num_of_warmups docstring 과 capture size 상한을 두는 이유의 근거" },
  ],
  "gpu/warp-stall-reasons-and-issue-utilization": [
    { kind: "공식 문서", label: "NVIDIA Nsight Compute Profiling Guide · Warp Sampling / Warp Stall Reasons / Scheduler Statistics", href: "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html", note: "Sampling 간격 32~2048 clock, active·eligible·issued warp 정의, long/short scoreboard·barrier·not selected·wait·throttle 의 정의와 처방 문장의 근거" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Best Practices Guide 12.8.1 · Profile / Understanding Scaling / Effective Bandwidth", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html", note: "Profiling 을 hotspot 찾기의 첫 단계로 두고 effective bandwidth 를 지표로 쓰라는 우선순위의 근거" },
  ],
  "gpu/megakernel-design-tradeoffs": [
    { kind: "핵심 논문", label: "MPK: A Compiler and Runtime for Mega-Kernelizing Tensor Programs (arXiv 2512.22219)", href: "https://arxiv.org/abs/2512.22219", note: "SM 단위 task graph·worker 128/scheduler 16·register 최대값 고정·32 KB page·Qwen3-8B kernel 293개와 latency 수치의 근거(저자 자기보고)" },
    { kind: "공식 문서", label: "Hazy Research · Look Ma, No Bubbles! (Llama-1B megakernel)", href: "https://hazyresearch.stanford.edu/blog/2025-05-27-no-bubbles", note: "Launch 2.1 µs·graph 1.3 µs·kernel 약 100개·counter 배열·16 KiB page 13개·bandwidth 78% 의 근거(저자 자기보고)" },
    { kind: "핵심 논문", label: "FlashAttention-3 (arXiv 2407.08608)", href: "https://arxiv.org/abs/2407.08608", note: "Producer·consumer warpgroup·setmaxnreg·named barrier pingpong 의 block 내부 동기화 근거" },
    { kind: "공식 문서", label: "NVIDIA CUDA C++ Programming Guide 12.8.1 · Cooperative Groups", href: "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html", note: "grid.sync() 의 co-residency 조건과 stream 안 kernel 순서·가시성의 근거" },
    { kind: "핵심 논문", label: "Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking (arXiv 1804.06826)", href: "https://arxiv.org/abs/1804.06826", note: "L0 instruction cache 약 12 KiB·L1 128 KiB 의 측정 근거(Volta 한정)" },
  ],
  "gpu/warp-specialization-and-async-pipelines": [
    { kind: "공식 규격", label: "PTX ISA · cp.async (cp-size 4·8·16) · Async Proxy", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#data-movement-and-conversion-instructions-cp-async", note: "cp.async 의 크기와 commit_group·wait_group, bulk 계열이 async proxy 로 접근해 fence.proxy.async 가 필요하다는 근거" },
    { kind: "공식 규격", label: "PTX ISA · cp.async.bulk.tensor · tensor-map 128 B · 1D~5D", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#data-movement-and-conversion-instructions-cp-async-bulk-tensor", note: "Thread 하나가 내는 bulk tensor copy 와 mbarrier complete_tx 완료, tensor map 이 128 B opaque 객체라는 근거" },
    { kind: "공식 규격", label: "PTX ISA · Asynchronous Warpgroup Level Matrix Multiply-Accumulate · setmaxnreg", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#asynchronous-warpgroup-level-matrix-instructions", note: "Warpgroup 이 연속한 warp 4개라는 정의, wgmma.m64nNk16 의 N 8~256, fence·commit_group·wait_group, setmaxnreg 24~256·8 의 배수·warpgroup 단위 실행" },
    { kind: "공식 문서", label: "CUDA C++ Programming Guide · Asynchronous Data Copies using TMA", href: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html", note: "Barrier 초기화 뒤 fence.proxy.async, thread 하나의 expect_tx, 1차원 bulk copy 16 B 배수, tensor map 을 __grid_constant__ 또는 constant 로 넘기는 절차" },
    { kind: "공식 문서", label: "CUDA Driver API · cuTensorMapEncodeTiled", href: "https://docs.nvidia.com/cuda/cuda-driver-api/group__CUDA__TENSOR__MEMORY.html", note: "Rank 1~5, boxDim 차원당 256 이하, globalAddress·globalStrides 16 B 정렬, swizzle 32B/64B/128B, oobFill, 128 B·64 B 정렬 객체" },
    { kind: "공식 문서", label: "CUDA Hopper Tuning Guide · shared memory 228 KB/SM · 227 KB/block", href: "https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html", note: "Stage 수 상한을 정하는 threadblock 당 shared memory 227 KB 와 TMA 가 1D~5D tensor 를 옮긴다는 설명" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · sm90_gemm_tma_warpspecialized_pingpong.hpp", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/kernel/sm90_gemm_tma_warpspecialized_pingpong.hpp", note: "MaxThreadsPerBlock 384, NumLoadWarpGroups 1·NumMmaWarpGroups 2, LoadRegisterRequirement 40·MmaRegisterRequirement 232 (heavy 24·240), OrderedSequenceBarrier" },
    { kind: "공식 코드", label: "NVIDIA/cutlass · sm90_mma_tma_gmma_ss_warpspecialized.hpp · media/docs/cpp/pipeline.md", href: "https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/collective/sm90_mma_tma_gmma_ss_warpspecialized.hpp", note: "producer_acquire·producer_get_barrier·TMA copy·producer_tail 과 consumer_wait·warpgroup_arrive·gemm·warpgroup_wait<K_PIPE_MMAS>·consumer_release 경로, Stages ≥ 2" },
    { kind: "공식 문서", label: "NVIDIA CUTLASS · Efficient GEMM in CUDA · Warp Specialization", href: "https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md", note: "Producer warp group 이 TMA 로 채우고 consumer warp group 이 MMA 를 내는 구조, persistent cooperative·ping-pong schedule 의 정의" },
    { kind: "핵심 논문", label: "FlashAttention-3 (arXiv 2407.08608)", href: "https://arxiv.org/abs/2407.08608", note: "Producer·consumer warpgroup 과 ping-pong 을 attention 에 적용한 구조, H100 FP16 740 TFLOP/s 는 저자 자기보고" },
    { kind: "공식 문서", label: "NVIDIA H100 Tensor Core GPU 제품 사양", href: "https://www.nvidia.com/en-us/data-center/h100/", note: "HBM3 3.35 TB/s 와 FP16 dense 989 TFLOP/s (sparsity 1,979) 를 C·L 산수의 입력으로 씀" },
  ],
  "ai/inference-optimization-layers": [
    { kind: "핵심 논문", label: "Amdahl (AFIPS 1967) Validity of the single processor approach", href: "https://dl.acm.org/doi/10.1145/1465482.1465560", note: "end-to-end speedup 상한 식의 원 출처" },
    { kind: "공식 문서", label: "vLLM Optimization and Tuning", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "runtime 층 설정(enforce-eager·cudagraph 수준)이 존재한다는 근거" },
    { kind: "공식 문서", label: "PyTorch CUDA semantics", href: "https://docs.pytorch.org/docs/stable/notes/cuda.html", note: "graph capture 의 호환 조건이 kernel 선택을 제한한다는 층 상호작용의 근거" },
  ],
  "gpu/gpu-data-movement-optimization": [
    { kind: "공식 가이드", label: "NVIDIA CUDA C++ Best Practices Guide · Shared Memory in Matrix Multiplication · Asynchronous and Overlapping Transfers with Computation", href: "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html", note: "Staging의 재사용·재배열 이득과 asynchronous transfer·stream overlap 설명의 출처" },
    { kind: "공식 규격", label: "NVIDIA PTX ISA · ldmatrix · prefetch/prefetchu · cp.async.bulk.prefetch.tensor", href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-load-instruction-ldmatrix", note: "ldmatrix 8x8 .x4 정의, prefetch·bulk prefetch의 L2 목적지 정의" },
    { kind: "공식 문서", label: "NVIDIA CUDA Driver API · cuTensorMapEncodeTiled · l2Promotion", href: "https://docs.nvidia.com/cuda/cuda-driver-api/group__CUDA__TENSOR__MEMORY.html", note: "다차원 tensor copy box·stride와 TMA L2 promotion 옵션의 출처" },
    { kind: "공식 규격", label: "NVIDIA H100 Tensor Core GPU 제품 사양 · Hopper Tuning Guide", href: "https://www.nvidia.com/en-us/data-center/h100/", note: "HBM3 3.35 TB/s, dense bf16 989 TFLOP/s, L2 50 MB, SM당 shared memory 228 KB의 출처 — 본문 산수의 계산 기준" },
  ],
  "ai/llm-sampling-strategies": [
    { kind: "핵심 논문", label: "The Curious Case of Neural Text Degeneration", href: "https://arxiv.org/abs/1904.09751", note: "Nucleus(top-p) sampling 정의와 perplexity·self-BLEU·반복률 표의 출처" },
    { kind: "핵심 논문", label: "Hierarchical Neural Story Generation", href: "https://arxiv.org/abs/1805.04833", note: "Top-k sampling 정의와 k=10 채택 근거의 출처" },
    { kind: "핵심 논문", label: "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters", href: "https://arxiv.org/abs/2408.03314", note: "Test-time compute 정의와 compute-optimal scaling 의 4배·14배 수치의 출처" },
  ],
  "ai/multi-head-latent-attention-mechanics": [
    { kind: "핵심 논문", label: "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model", href: "https://arxiv.org/abs/2405.04434", note: "MLA 의 low-rank KV 압축·decoupled RoPE·dimension 수치의 원 출처, 저자 자기보고 범위" },
    { kind: "후속 논문", label: "DeepSeek-V3 Technical Report", href: "https://arxiv.org/abs/2412.19437", note: "더 큰 규모에서 같은 MLA 설계를 채택했다는 확인" },
    { kind: "공식 구현", label: "vLLM mla_attention 구현 문서", href: "https://docs.vllm.ai/en/v0.22.0/api/vllm/model_executor/layers/attention/mla_attention/", note: "Prefill naive·decode absorbed 두 경로 구분과 캐시된 latent·위치 key 분리 저장의 출처" },
  ],
  "ai/linear-attention-and-state-space-models": [
    { kind: "핵심 논문", label: "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention", href: "https://arxiv.org/abs/2006.16236", note: "Kernel feature map으로 attention을 O(n) recurrent 형태로 재구성한 원 논문" },
    { kind: "핵심 논문", label: "Efficiently Modeling Long Sequences with Structured State Spaces", href: "https://arxiv.org/abs/2111.00396", note: "S4의 구조적 state space model과 LTI 조건의 출처" },
    { kind: "핵심 논문", label: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces", href: "https://arxiv.org/abs/2312.00752", note: "Selective SSM과 hardware-aware scan 알고리즘의 출처" },
    { kind: "핵심 논문", label: "Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality", href: "https://arxiv.org/abs/2405.21060", note: "Linear attention과 selective SSM의 이론적 동등성(SSD)과 Mamba-2의 출처" },
    { kind: "핵심 논문", label: "Jamba: A Hybrid Transformer-Mamba Language Model", href: "https://arxiv.org/abs/2403.19887", note: "Attention:Mamba 1:7 hybrid 배치와 256K context 지원 보고의 출처" },
  ],
  "ai/differential-attention": [
    { kind: "핵심 논문", label: "Differential Transformer", href: "https://arxiv.org/abs/2410.05258", note: "DiffAttn 식·λ 재매개변수화·selectivity/robustness 수치의 출처, 3B 대조군 자기보고 범위" },
    { kind: "선행·비교 논문", label: "Grouped Differential Attention", href: "https://arxiv.org/abs/2510.06949", note: "Signal head 비대칭 grouping 변형으로 이 글은 언급만 하고 ai/motif-3-architecture 가 정본" },
    { kind: "공식 구현", label: "microsoft/unilm (Diff-Transformer)", href: "https://aka.ms/Diff-Transformer", note: "저자 공개 코드로 head 수·GroupNorm 적용 위치를 그대로 확인할 수 있습니다" },
  ],
  "ai/sparse-windowed-attention-patterns": [
    { kind: "핵심 논문", label: "Mistral 7B", href: "https://arxiv.org/abs/2310.06825", note: "Sliding-window attention·rolling buffer cache·수신 범위 131K 의 출처" },
    { kind: "핵심 논문", label: "Longformer: The Long-Document Transformer", href: "https://arxiv.org/abs/2004.05150", note: "Local+global attention 조합과 receptive field ℓ×d×w 의 출처" },
    { kind: "핵심 논문", label: "Big Bird: Transformers for Longer Sequences", href: "https://arxiv.org/abs/2007.14062", note: "Window+global+random sparse attention 의 universal approximation·Turing completeness 증명" },
    { kind: "핵심 논문", label: "Gemma 2: Improving Open Language Models at a Practical Size", href: "https://arxiv.org/abs/2408.00118", note: "Local:global=1:1, window 4096 hybrid 구조의 출처" },
    { kind: "핵심 논문", label: "Gemma 3 Technical Report", href: "https://arxiv.org/abs/2503.19786", note: "Local:global=5:1, window 1024, KV 오버헤드 60%→15% 미만의 출처" },
    { kind: "핵심 논문", label: "Native Sparse Attention", href: "https://arxiv.org/abs/2502.11089", note: "학습된 block 선택과 64K 속도 배율의 출처" },
  ],
  "ai/search-based-reasoning-and-test-time-compute": [
    { kind: "핵심 논문", label: "Let's Verify Step by Step", href: "https://arxiv.org/abs/2305.20050", note: "PRM vs ORM vs 다수결 best-of-1860 재순위화 수치의 출처" },
    { kind: "핵심 논문", label: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models", href: "https://arxiv.org/abs/2305.10601", note: "Tree search 의 b·k·d 설정과 Game of 24 성공률의 출처" },
    { kind: "핵심 논문", label: "Self-Refine: Iterative Refinement with Self-Feedback", href: "https://arxiv.org/abs/2303.17651", note: "외부 verifier 없는 self-correction 의 긍정적 결과의 출처" },
    { kind: "핵심 논문", label: "Large Language Models Cannot Self-Correct Reasoning Yet", href: "https://arxiv.org/abs/2310.01798", note: "Intrinsic self-correction 의 정확도 하락 수치의 출처" },
    { kind: "선행·비교 논문", label: "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters", href: "https://arxiv.org/abs/2408.03314", note: "Revision vs PRM search 의 난이도별 효율 비교 수치의 출처 — 축 정의는 llm-sampling-strategies 가 정본" },
  ],
  "ai/moe-routing-and-load-balancing": [
    { kind: "핵심 논문", label: "GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding", href: "https://arxiv.org/abs/2006.16668", note: "Auxiliary balance loss와 random second-expert routing을 Transformer MoE에 처음 적용" },
    { kind: "핵심 논문", label: "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", href: "https://arxiv.org/abs/2101.03961", note: "f_i·P_i 곱셈 load balancing loss(α=0.01)와 capacity factor 1.0·1.25·2.0 비교" },
    { kind: "핵심 논문", label: "ST-MoE: Designing Stable and Transferable Sparse Expert Models", href: "https://arxiv.org/abs/2202.08906", note: "Router z-loss와 fine-tuning capacity factor 조정으로 학습 불안정 완화" },
    { kind: "핵심 논문", label: "Mixtral of Experts", href: "https://arxiv.org/abs/2401.04088", note: "Top-2·8 expert의 slot 기준 balancing loss 일반화와 routing specialization 분석" },
    { kind: "핵심 논문", label: "DeepSeek-V3 Technical Report", href: "https://arxiv.org/abs/2412.19437", note: "Auxiliary-loss-free bias 갱신(γ=0.001)과 total 671B·active 37B sparsity ratio" },
  ],
  "ai/hyper-connections-residual-streams": [
    { kind: "핵심 논문", label: "Hyper-Connections", href: "https://arxiv.org/abs/2409.19606", note: "Read·write·mix 세 행렬 구조와 확장률 n 실험의 출처, 저자 자기보고 범위" },
    { kind: "핵심 논문", label: "mHC: Manifold-Constrained Hyper-Connections", href: "https://arxiv.org/abs/2512.24880", note: "Doubly-stochastic 투영·Sinkhorn-Knopp·Amax Gain Magnitude 수치의 출처" },
    { kind: "선행·비교 논문", label: "On Layer Normalization in the Transformer Architecture", href: "https://arxiv.org/abs/2002.04745", note: "Post-LN·Pre-LN gradient 크기 증명과 warm-up 실험의 출처" },
    { kind: "선행·비교 논문", label: "Identity Mappings in Deep Residual Networks", href: "https://arxiv.org/abs/1603.05027", note: "Shortcut 항등이 신호 전파를 보존한다는 원 근거" },
  ],
  "ai/fast-weight-memory-and-chunkwise-recurrence": [
    { kind: "핵심 논문", label: "Linear Transformers Are Secretly Fast Weight Programmers", href: "https://arxiv.org/abs/2102.11174", note: "Fast weight memory·delta rule 의 원 출처, 저자 자기보고 범위" },
    { kind: "핵심 논문", label: "Parallelizing Linear Transformers with the Delta Rule over Sequence Length", href: "https://arxiv.org/abs/2406.06484", note: "Chunkwise WY/UT transform 알고리즘과 4~16배 속도 수치의 출처" },
    { kind: "핵심 논문", label: "Gated Delta Networks: Improving Mamba2 with Delta Rule", href: "https://arxiv.org/abs/2412.06464", note: "Gated delta rule 식과 perplexity·retrieval 벤치마크의 출처" },
    { kind: "공식 규격", label: "Blelloch · Prefix Sums and Their Applications (CMU-CS-90-190)", href: "https://www.cs.cmu.edu/~guyb/papers/Ble93.pdf", note: "Up-sweep·down-sweep parallel scan 의 원 출처, 1990년 기술보고서" },
  ],
  "ai/llm-evaluation-criteria-and-methods": [
    { kind: "핵심 논문", label: "Holistic Evaluation of Language Models (HELM)", href: "https://arxiv.org/abs/2211.09110", note: "Criteria·metric 대응과 42개 시나리오 설계의 출처" },
    { kind: "핵심 논문", label: "BERTScore: Evaluating Text Generation with BERT", href: "https://arxiv.org/abs/1904.09675", note: "Semantic similarity evaluation 의 F1 계산식과 WMT18 상관관계 수치의 출처" },
    { kind: "핵심 논문", label: "Evaluating Large Language Models Trained on Code (Codex)", href: "https://arxiv.org/abs/2107.03374", note: "pass@k 정의와 HumanEval pass@1·pass@100 수치의 출처" },
    { kind: "Benchmark 논문", label: "Beyond the Imitation Game (BIG-bench)", href: "https://arxiv.org/abs/2206.04615", note: "204개 task 의 criteria·metric 다양성과 사람 기준선의 출처" },
  ],
  "ai/evaluation-datasets-and-pipelines": [
    { kind: "공식 문서", label: "Stanford CRFM · HELM tutorial", href: "https://crfm-helm.readthedocs.io/en/latest/tutorial/", note: "Scenario·subject 분류와 group 별 coverage 리포트 구조의 근거" },
    { kind: "공식 문서", label: "OpenAI · Evals build-eval 가이드", href: "https://github.com/openai/evals/blob/main/docs/build-eval.md", note: "Eval 등록·harness 자동 실행 방식과 좋은 eval 데이터 기준의 근거" },
    { kind: "핵심 논문", label: "Ribeiro et al. · CheckList (ACL 2020)", href: "https://arxiv.org/abs/2005.04118", note: "Edge case·behavioral test 로 숨은 실패를 찾는 방법과 실측 bug 발견 비율의 근거" },
    { kind: "핵심 논문", label: "Koh et al. · WILDS (ICML 2021)", href: "https://arxiv.org/abs/2012.07421", note: "실제 domain 분포 이동에서 in-distribution·OOD 성능 격차의 근거" },
    { kind: "핵심 논문", label: "Breck et al. · The ML Test Score (IEEE Big Data 2017)", href: "https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/", note: "Slice 별 품질 하한, canary(shadow), offline·online 상관, regression test 항목의 근거" },
    { kind: "핵심 논문", label: "Kohavi, Tang, Xu et al. · Online RCTs at Scale (Trials 2020)", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7007661/", note: "A/B 표본 크기와 감지 효과의 제곱 관계, 대규모 실험 운영 규모의 근거" },
  ],
  "ai/llm-as-a-judge": [
    { kind: "핵심 논문", label: "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", href: "https://arxiv.org/abs/2306.05685", note: "Position·verbosity·self-enhancement bias 실측치와 human agreement rate 의 출처" },
    { kind: "핵심 논문", label: "G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment", href: "https://arxiv.org/abs/2303.16634", note: "Chain-of-thought + form-filling rubric 설계와 Spearman 0.514 의 출처" },
  ],
  "ai/rag-ingestion-and-chunking": [
    { kind: "공식 문서", label: "Anthropic · Introducing Contextual Retrieval", href: "https://www.anthropic.com/news/contextual-retrieval", note: "Contextual retrieval의 방법과 top-20 검색 실패율 5.7→1.9% 수치의 근거" },
    { kind: "공식 문서", label: "LangChain · Text splitters", href: "https://python.langchain.com/docs/concepts/text_splitters/", note: "Chunk size·overlap·구분자 계층형 분할 방식의 근거" },
    { kind: "공식 문서", label: "LlamaIndex · Node Parser Modules", href: "https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/modules/", note: "SentenceSplitter·SemanticSplitterNodeParser의 파라미터와 경계 결정 방식의 근거" },
  ],
  "ai/vector-search-and-ann-indexes": [
    { kind: "핵심 논문", label: "Jégou, Douze, Schmid — Product Quantization for Nearest Neighbor Search (TPAMI 2011)", href: "https://doi.org/10.1109/TPAMI.2010.57", note: "Product quantization·asymmetric distance computation·IVFADC 의 근거. 수치는 저자 자기보고" },
    { kind: "공식 문서", label: "FAISS wiki — Faiss indexes", href: "https://github.com/facebookresearch/faiss/wiki/Faiss-indexes", note: "IndexIVFFlat 의 nlist·nprobe, IndexPQ·IndexIVFPQ 의 m·nbits·code_size 계산의 근거" },
  ],
  "ai/knowledge-graph-construction": [
    { kind: "공식 문서", label: "Neo4j — Graph Database Concepts", href: "https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/", note: "Node·relationship·property·label 정의, edge property·multi-label 지원의 근거" },
    { kind: "핵심 논문", label: "Open Information Extraction from the Web (Banko et al., IJCAI 2007)", href: "https://www.ijcai.org/Proceedings/07/Papers/429.pdf", note: "TextRunner 구조와 Open IE 정밀도(저자 자기보고)의 근거" },
    { kind: "핵심 논문", label: "Extract, Define, Canonicalize: An LLM-based Framework for Knowledge Graph Construction (EMNLP 2024)", href: "https://arxiv.org/abs/2404.03868", note: "Schema-guided extraction·self-canonicalization 3단계와 target alignment/self-canonicalization 구분의 근거" },
  ],
  "ai/embedding-model-fine-tuning": [
    { kind: "핵심 논문", label: "Reimers & Gurevych · Sentence-BERT (EMNLP 2019)", href: "https://arxiv.org/abs/1908.10084", note: "Siamese·triplet bi-encoder로 재사용 가능한 sentence embedding을 학습한 원 논문. In-batch negative는 후속 실무의 확장" },
    { kind: "핵심 논문", label: "Karpukhin et al. · Dense Passage Retrieval (EMNLP 2020)", href: "https://arxiv.org/abs/2004.04906", note: "Asymmetric dual encoder와 in-batch negative 학습의 근거. 수치는 저자 자기보고" },
    { kind: "공식 문서", label: "Sentence-Transformers 공식 문서 · Symmetric vs. Asymmetric Semantic Search", href: "https://www.sbert.net/examples/applications/semantic-search/README.html", note: "Symmetric·asymmetric 용어 구분과 권장 모델의 근거" },
    { kind: "핵심 논문", label: "Kusupati et al. · Matryoshka Representation Learning (NeurIPS 2022)", href: "https://arxiv.org/abs/2205.13147", note: "Nested loss로 embedding truncation을 가능하게 하는 근거. Vision benchmark 자기보고" },
    { kind: "핵심 논문", label: "Wang et al. · Text Embeddings by Weakly-Supervised Contrastive Pre-training (E5)", href: "https://arxiv.org/abs/2212.03533", note: "Instruction 접두어 기반 asymmetric embedding과 in-batch negative pre-training의 근거" },
    { kind: "공식 문서", label: "Shakir, Aarsen & Lee · Binary and Scalar Embedding Quantization (Hugging Face blog)", href: "https://huggingface.co/blog/embedding-quantization", note: "Int8 embedding quantization의 저장 4배 절감과 99%대 정확도 유지 수치 근거" },
  ],
  "ai/document-parsing-and-table-extraction": [
    { kind: "공식 문서", label: "Unstructured.io · Partitioning docs", href: "https://docs.unstructured.io/open-source/core-functionality/partitioning", note: "Layout parsing·OCR 전략(auto/hi_res/ocr_only)·표 HTML 보존의 근거" },
    { kind: "공식 문서", label: "jsvine · pdfplumber", href: "https://github.com/jsvine/pdfplumber", note: "PDF 표 셀 경계 감지(line intersection)와 읽기 순서 보존 옵션의 근거" },
    { kind: "공식 문서", label: "PyMuPDF · Text Extraction Recipes", href: "https://pymupdf.readthedocs.io/en/latest/recipes-text.html", note: "다단 PDF reading order 문제와 sort=True 해결의 근거" },
    { kind: "핵심 논문", label: "Smock, Pesala, Abraham · PubTables-1M (CVPR 2022)", href: "https://arxiv.org/abs/2110.00061", note: "표 구조 인식 GriTS_Top/AccCon 수치의 근거" },
    { kind: "핵심 논문", label: "Nassar et al. · TableFormer (CVPR 2022)", href: "https://arxiv.org/abs/2203.01017", note: "단순·복잡 표 TEDS 수치와 rowspan/colspan HTML 예측의 근거" },
    { kind: "공식 문서", label: "Unstructured.io · Chunking docs", href: "https://docs.unstructured.io/open-source/core-functionality/chunking", note: "Table element 격리(never combined)와 orig_elements provenance 보존의 근거" },
  ],
  "ai/rag-context-assembly-and-evaluation": [
    { kind: "핵심 논문", label: "Es et al. · RAGAS (2023)", href: "https://arxiv.org/abs/2309.15217", note: "Groundedness(faithfulness)·answer relevance 계산식과 WikiEval 사람 판정 일치율의 근거" },
    { kind: "공식 문서", label: "RAGAS docs · Context Precision", href: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/", note: "Context precision 계산식(precision@k 가중 합산)의 근거" },
    { kind: "공식 문서", label: "RAGAS docs · Context Recall", href: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/", note: "Context recall 계산식(reference claim 지지 비율)의 근거" },
    { kind: "핵심 논문", label: "Lewis et al. · RAG (NeurIPS 2020)", href: "https://arxiv.org/abs/2005.11401", note: "Closed-book 대비 RAG 성능 격차 — retrieval ablation 수치 예의 근거" },
    { kind: "핵심 논문", label: "Ju et al. · CRUX (2025)", href: "https://arxiv.org/abs/2506.20051", note: "Oracle retrieval coverage 대비 실제 방법 coverage 격차 — retriever upper bound 수치 예의 근거" },
  ],
  "ai/query-transformation-and-adaptive-retrieval": [
    { kind: "핵심 논문", label: "Gao et al. · HyDE (ACL 2023)", href: "https://arxiv.org/abs/2212.10496", note: "가상 문서 embedding으로 검색하는 HyDE 방법과 정성적 성능 비교의 근거" },
    { kind: "핵심 논문", label: "Asai et al. · Self-RAG (ICLR 2024)", href: "https://arxiv.org/abs/2310.11511", note: "네 reflection token 정의와 PopQA·PubHealth·ARC-Challenge 수치의 근거" },
    { kind: "핵심 논문", label: "Yan et al. · CRAG (2024)", href: "https://arxiv.org/abs/2401.15884", note: "Correct·Ambiguous·Incorrect 세 범주와 baseline 대비 개선 수치의 근거" },
    { kind: "핵심 논문", label: "Zheng et al. · Step-Back Prompting (ICLR 2024)", href: "https://arxiv.org/abs/2310.06117", note: "Step-back 질문 방법과 MMLU·TimeQA·MuSiQue 개선폭의 근거" },
    { kind: "핵심 논문", label: "Zhou et al. · Least-to-Most Prompting (ICLR 2023)", href: "https://arxiv.org/abs/2205.10625", note: "복합 문제를 subproblem으로 나누는 decomposition 원리와 SCAN 수치의 근거" },
  ],
  "ai/lexical-retrieval-bm25-inverted-index": [
    { kind: "핵심 논문", label: "Robertson, Zaragoza — The Probabilistic Relevance Framework: BM25 and Beyond (2009)", href: "https://doi.org/10.1561/1500000019", note: "BM25 scoring 식의 유도와 saturation·length normalization 결합의 근거" },
    { kind: "공식 문서", label: "Apache Lucene — BM25Similarity (javadoc)", href: "https://lucene.apache.org/core/9_11_0/core/org/apache/lucene/search/similarities/BM25Similarity.html", note: "IDF 의 log(1+...) 변형과 k1=1.2, b=0.75 기본값의 근거" },
  ],
  "ai/graphrag-community-and-multihop-search": [
    { kind: "핵심 논문", label: "From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Edge et al., arXiv 2404.16130)", href: "https://arxiv.org/abs/2404.16130", note: "Leiden community detection·계층 summary, local/global search 구분, global search map-reduce 절차, community level 별 성능·token 비율의 근거. 수치는 저자 자기보고" },
  ],
  "ai/vision-language-model-architecture": [
    { kind: "핵심 논문", label: "Liu et al. · Visual Instruction Tuning / LLaVA (NeurIPS 2023)", href: "https://arxiv.org/abs/2304.08485", note: "Linear/MLP projector와 concat-projection 결합 방식의 근거" },
    { kind: "핵심 논문", label: "Alayrac et al. · Flamingo (NeurIPS 2022)", href: "https://arxiv.org/abs/2204.14198", note: "Perceiver Resampler·gated cross-attention·tanh gating 수치의 근거" },
    { kind: "핵심 논문", label: "Li et al. · BLIP-2 (ICML 2023)", href: "https://arxiv.org/abs/2301.12597", note: "Q-Former query bottleneck과 파라미터 효율 수치의 근거" },
  ],
  "ai/tool-calling-lifecycle-and-costs": [
    { kind: "핵심 논문", label: "OpenAI · Function calling (API 공식 문서)", href: "https://developers.openai.com/api/docs/guides/function-calling", note: "Tool 정의 schema·5단계 왕복 루프·parallel_tool_calls의 근거" },
    { kind: "핵심 논문", label: "Anthropic · Tool use overview (API 공식 문서)", href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", note: "tool_use·tool_result 왕복과 model별 고정 token 가격표의 근거" },
    { kind: "핵심 논문", label: "Anthropic · Parallel tool use (API 공식 문서)", href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use", note: "병렬 tool 호출의 실행 순서·결과 매칭 계약의 근거" },
    { kind: "핵심 논문", label: "Yao et al. · ReAct (2022)", href: "https://arxiv.org/abs/2210.03629", note: "Tool-use loop이 되먹임 구조여야 하는 이유의 근거" },
    { kind: "핵심 논문", label: "OpenAI · Introducing Structured Outputs (2024)", href: "https://openai.com/index/introducing-structured-outputs-in-the-api/", note: "JSON schema 준수 실패율(40% 미만 vs 100%) 수치의 근거" },
  ],
  "ai/multimodal-retrieval-and-visual-grounding": [
    { kind: "핵심 논문", label: "Radford et al. · CLIP (ICML 2021)", href: "https://arxiv.org/abs/2103.00020", note: "Image-text 대조학습과 공유 embedding 공간 수치의 근거" },
    { kind: "핵심 논문", label: "Faysse et al. · ColPali (ICLR 2025)", href: "https://arxiv.org/abs/2407.01449", note: "Screenshot retrieval 인덱싱 속도·ViDoRe 성능 수치의 근거" },
    { kind: "핵심 논문", label: "Peng et al. · Kosmos-2 (ICLR 2024)", href: "https://arxiv.org/abs/2306.14824", note: "Bounding box location token 양자화와 GrIT 규모의 근거" },
  ],
  "ai/synthetic-data-and-data-flywheel": [
    { kind: "핵심 논문", label: "Wang et al. · Self-Instruct (2022)", href: "https://arxiv.org/abs/2212.10560", note: "175개 seed task→52,445개 instruction 확장 절차와 ROUGE-L 필터의 근거" },
    { kind: "핵심 논문", label: "Xu et al. · WizardLM/Evol-Instruct (2023)", href: "https://arxiv.org/abs/2304.12244", note: "In-Depth/In-Breadth Evolving과 4 epoch 확장 수치의 근거" },
    { kind: "핵심 논문", label: "Yuan et al. · RFT (2023)", href: "https://arxiv.org/abs/2308.01825", note: "k=100 best-of-N 생성과 verifier filtering GSM8K 수치의 근거" },
    { kind: "핵심 논문", label: "Chen et al. · Codex pass@k (2021)", href: "https://arxiv.org/abs/2107.03374", note: "pass@k 불편추정량 식의 근거" },
    { kind: "공식 문서", label: "NVIDIA · Data Flywheel 용어집", href: "https://www.nvidia.com/en-us/glossary/data-flywheel/", note: "data flywheel 공식 정의의 근거" },
    { kind: "핵심 논문", label: "Luo et al. · Arena Learning (2024)", href: "https://arxiv.org/abs/2407.10627", note: "배틀 기반 failure mining과 data flywheel 사례의 근거" },
  ],
  "ai/llm-dataset-engineering-and-cleaning": [
    { kind: "핵심 논문", label: "Gao et al. · The Pile", href: "https://arxiv.org/abs/2101.00027", note: "22개 domain을 의도적으로 섞은 코퍼스 구성과 다중 source 필요성의 근거" },
    { kind: "핵심 논문", label: "Penedo et al. · The RefinedWeb Dataset for Falcon LLM", href: "https://arxiv.org/abs/2306.01116", note: "필터링·dedup 파이프라인의 단계별 데이터 유지율(Figure 2) 근거" },
    { kind: "핵심 논문", label: "Soldaini et al. · Dolma", href: "https://arxiv.org/abs/2402.00159", note: "source mixing부터 PII/유해 필터링까지 전체 pipeline 구조의 근거" },
    { kind: "핵심 논문", label: "Broder · Identifying and Filtering Near-Duplicate Documents", href: "https://cs.brown.edu/courses/cs253/papers/nearduplicate.pdf", note: "MinHash shingle sketch와 near-duplicate 탐지 원리의 근거" },
    { kind: "리뷰 논문", label: "A Comprehensive Survey of Contamination Detection Methods in LLMs", href: "https://arxiv.org/abs/2404.00699", note: "모델별 contamination 임계값(n-gram·substring) 비교의 근거" },
    { kind: "핵심 논문", label: "Xie et al. · DoReMi", href: "https://arxiv.org/abs/2305.10429", note: "mixture 비율 최적화가 downstream 성능·학습 step에 미치는 수치 근거" },
    { kind: "핵심 논문", label: "Zhou et al. · LIMA", href: "https://arxiv.org/abs/2305.11206", note: "quality·diversity가 데이터 양보다 중요하다는 superficial alignment hypothesis의 근거" },
    { kind: "핵심 논문", label: "Bengio et al. · Curriculum Learning", href: "https://dl.acm.org/doi/10.1145/1553374.1553380", note: "쉬운 예제부터 배치하는 curriculum의 수렴·일반화 효과 근거" },
    { kind: "핵심 논문", label: "Ratner et al. · Snorkel", href: "https://arxiv.org/abs/1711.10160", note: "weak supervision의 labeling function·노이즈 모델 결합 방식과 수치 근거" },
    { kind: "핵심 논문", label: "Lee · Pseudo-Label", href: "http://deeplearning.net/wp-content/uploads/2013/03/pseudo_label_final.pdf", note: "pseudo-labeling의 최초 형태(confident 예측 재사용)의 근거" },
    { kind: "핵심 논문", label: "Gilardi, Alizadeh, Kubli · ChatGPT Outperforms Crowd-Workers", href: "https://arxiv.org/abs/2303.15056", note: "model annotation과 human annotation의 정확도·비용 비교 수치 근거" },
  ],
  "ai/agent-failure-modes-and-recovery": [
    { kind: "핵심 논문", label: "Where LLM Agents Fail and How They can Learn From Failures (arXiv 2509.25370)", href: "https://arxiv.org/abs/2509.25370", note: "Agent failure mode 분류의 근거 taxonomy와 benchmark." },
    { kind: "공식 문서", label: "Stripe · Idempotent requests", href: "https://docs.stripe.com/api/idempotent_requests", note: "Idempotent action·retry loop 안전성의 실제 mechanism." },
    { kind: "공식 문서", label: "Anthropic · Effective harnesses for long-running agents", href: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "Premature termination 관찰과 checkpoint 기반 recovery strategy 근거." },
    { kind: "공식 문서", label: "LangChain · Human-in-the-loop", href: "https://docs.langchain.com/oss/python/langchain/human-in-the-loop", note: "HITL 승인 결정 mechanism과 checkpoint 연계 근거." },
  ],
  "ai/rl-foundations-for-llm-post-training": [
    { kind: "핵심 논문", label: "Policy Gradient Methods for Reinforcement Learning with Function Approximation", href: "https://proceedings.neurips.cc/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html", note: "Policy gradient theorem의 형식적 정의와 증명의 출처" },
    { kind: "공식 문서", label: "Reinforcement Learning: An Introduction (2nd ed.)", href: "https://mitpress.mit.edu/9780262039246/reinforcement-learning/", note: "Return·MDP·REINFORCE 정의의 표준 교과서 출처" },
  ],
  "ai/reward-design-for-verifiable-rl": [
    { kind: "핵심 논문", label: "Let's Verify Step by Step", href: "https://arxiv.org/abs/2305.20050", note: "Outcome/process reward 구분과 MATH 정확도 수치의 출처" },
    { kind: "핵심 논문", label: "Defining and Characterizing Reward Hacking", href: "https://arxiv.org/abs/2209.13085", note: "Reward hacking의 형식적 정의와 unhackable 조건의 출처" },
    { kind: "핵심 논문", label: "Concrete Problems in AI Safety", href: "https://arxiv.org/abs/1606.06565", note: "Specification gaming·reward misspecification 이름의 출처" },
    { kind: "핵심 논문", label: "Policy Invariance Under Reward Transformations", href: "https://dl.acm.org/doi/10.5555/645528.657613", note: "Potential-based reward shaping의 optimal policy 보존 증명 출처" },
  ],
  "ai/fine-tuning-tradeoffs-forgetting-and-merging": [
    { kind: "핵심 논문", label: "Catastrophic Interference in Connectionist Networks: The Sequential Learning Problem", href: "https://doi.org/10.1016/S0079-7421(08)60536-8", note: "Catastrophic forgetting을 처음 정식화한 원 논문" },
    { kind: "핵심 논문", label: "Model soups: averaging weights of multiple fine-tuned models improves accuracy without increasing inference time", href: "https://arxiv.org/abs/2203.05482", note: "Weight interpolation 기반 model merging의 근거" },
    { kind: "핵심 논문", label: "Editing Models with Task Arithmetic", href: "https://arxiv.org/abs/2212.04089", note: "Task vector를 더하고 빼는 task arithmetic model editing의 근거" },
  ],
  "ai/llm-guardrails-and-output-validation": [
    { kind: "공식 문서", label: "NVIDIA NeMo Guardrails — Documentation", href: "https://docs.nvidia.com/nemo/guardrails/latest/index.html", note: "Input/output/dialog/tool rail 위치 축과 rule-based·model-based 조합 구조의 근거." },
    { kind: "공식 문서", label: "JSON Schema — Understanding JSON Schema", href: "https://json-schema.org/understanding-json-schema/about", note: "Schema validation의 구조 검증 범위와 semantic validation이 별도로 필요한 이유의 근거." },
  ],
  "ai/llm-monitoring-observability-and-drift": [
    { kind: "공식 문서", label: "OpenTelemetry · Traces", href: "https://opentelemetry.io/docs/concepts/signals/traces/", note: "distributed tracing·trace span·부모-자식 tree 구조의 근거" },
    { kind: "공식 문서", label: "Langfuse · Observability Data Model", href: "https://langfuse.com/docs/observability/data-model", note: "trace·observation 중첩 구조와 LLM observability 정의의 근거" },
    { kind: "핵심 논문", label: "A Survey on Concept Drift Adaptation (Gama et al., 2014)", href: "https://doi.org/10.1145/2523813", note: "data drift(virtual drift)와 concept drift(real drift) 구분의 근거" },
  ],
  "ai/prompt-injection-poisoning-and-data-protection": [
    { kind: "공식 문서", label: "OWASP — LLM01:2025 Prompt Injection", href: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/", note: "Direct·indirect prompt injection 구분과 완화 전략 목록의 근거." },
    { kind: "핵심 논문", label: "Greshake et al. · Not what you've signed up for (arXiv 2302.12173)", href: "https://arxiv.org/abs/2302.12173", note: "Indirect prompt injection 원 논문과 tool injection·retrieval poisoning 사례의 근거." },
  ],
  "ai/continual-learning-foundations": [
    { kind: "핵심 논문", label: "A continual learning survey: Defying forgetting in classification tasks", href: "https://arxiv.org/abs/1909.08383", note: "Continual learning taxonomy와 stability–plasticity 분석 틀의 근거" },
    { kind: "핵심 논문", label: "Overcoming catastrophic forgetting in neural networks", href: "https://arxiv.org/abs/1612.00796", note: "Regularization-based continual learning(EWC)의 근거" },
    { kind: "핵심 논문", label: "Progressive Neural Networks", href: "https://arxiv.org/abs/1606.04671", note: "Parameter isolation·dynamic architecture expansion의 근거" },
  ],
  "ai/llm-application-caching": [
    { kind: "공식 문서", label: "Zilliz · GPTCache", href: "https://github.com/zilliztech/GPTCache", note: "semantic cache의 similarity search·threshold·hit ratio/recall 정의 근거" },
    { kind: "핵심 논문", label: "A Study of Replacement Algorithms for a Virtual-Storage Computer (Belady, 1966)", href: "https://doi.org/10.1147/sj.52.0078", note: "LRU를 포함한 replacement 알고리즘과 이상적 최적 알고리즘 비교의 근거" },
  ],
  "ai/llm-gateway-and-model-routing": [
    { kind: "공식 문서", label: "LiteLLM · Routing", href: "https://docs.litellm.ai/docs/routing", note: "load/latency/cost 기반 routing 전략 정의의 근거" },
    { kind: "공식 문서", label: "OpenRouter · Quickstart", href: "https://openrouter.ai/docs/quickstart", note: "unified API·자동 fallback·비용 효율적 routing 설명의 근거" },
    { kind: "핵심 논문", label: "FrugalGPT (Chen, Zaharia, Zou, 2023)", href: "https://arxiv.org/abs/2305.05176", note: "cascaded inference·confidence 기반 escalation과 비용 절감 수치의 근거" },
  ],
  "ai/rate-limiting-and-reliability-patterns": [
    { kind: "공식 문서", label: "Martin Fowler · CircuitBreaker", href: "https://martinfowler.com/bliki/CircuitBreaker.html", note: "circuit breaker 패턴과 상태 전이 정의의 근거" },
    { kind: "공식 규격", label: "RFC 2697 · A Single Rate Three Color Marker", href: "https://www.rfc-editor.org/rfc/rfc2697", note: "token bucket의 refill rate·burst capacity 정의의 근거" },
    { kind: "공식 문서", label: "nginx · ngx_http_limit_req_module", href: "https://nginx.org/en/docs/http/ngx_http_limit_req_module.html", note: "leaky bucket rate limiting의 rate·burst 파라미터 근거" },
  ],
  "ai/robot-action-representations": [
    { kind: "핵심 논문", label: "RT-2 · Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", href: "https://arxiv.org/abs/2307.15818", note: "8차원 action의 256 bin discretization과 문자열 token 표현의 저자 자기보고 근거이며 임의 robot의 zero-shot control 보장은 아님" },
    { kind: "핵심 논문", label: "ACT · Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", href: "https://arxiv.org/abs/2304.13705", note: "Chunk 길이 k=100·temporal ensembling의 근거이며 모든 task에 같은 chunk length가 최적이라는 뜻은 아님" },
    { kind: "핵심 논문", label: "Diffusion Policy · Visuomotor Policy Learning via Action Diffusion", href: "https://arxiv.org/abs/2303.04137", note: "Denoising step 수·action horizon의 근거이며 모든 control rate에서 다른 head보다 우월하다는 뜻은 아님" },
    { kind: "핵심 논문", label: "π0 · A Vision-Language-Action Flow Model for General Robot Control", href: "https://arxiv.org/abs/2410.24164", note: "Flow matching chunk 길이·integration step·inference latency의 저자 측정 근거이며 다른 action head에 대한 보편 우위를 뜻하지 않음" },
  ],
  "ai/imitation-learning-and-policy-generalization": [
    { kind: "핵심 논문", label: "Pomerleau · ALVINN: An Autonomous Land Vehicle in a Neural Network", href: "https://proceedings.neurips.cc/paper/1988/hash/812b4ba287f5ee0bc9d43bbf5bbe87fb-Abstract.html", note: "Behavior cloning과 discrete steering action head의 초기 구현 근거이며 현대 환경 재현을 보장하지 않음" },
    { kind: "핵심 논문", label: "Open X-Embodiment · Robotic Learning Datasets and RT-X Models", href: "https://arxiv.org/abs/2310.08864", note: "Embodied data scaling 규모(21 기관·22 robot·100만+ trajectory)의 근거이며 coverage나 품질 보장은 아님" },
    { kind: "핵심 논문", label: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World", href: "https://arxiv.org/abs/1703.06907", note: "무작위화 항목과 real robot 성공률(40회 중 38회)의 근거이며 모든 환경 변화 폭을 덮는다는 뜻은 아님" },
  ],
  "ai/vision-language-navigation": [
    { kind: "핵심 논문", label: "Vision-and-Language Navigation (R2R)", href: "https://arxiv.org/abs/1711.07280", note: "VLN task 정의와 discrete navigation graph·R2R 규모의 근거이며 continuous real robot 성능을 뜻하지 않음" },
    { kind: "핵심 논문", label: "Beyond the Nav-Graph: VLN-CE", href: "https://arxiv.org/abs/2004.02857", note: "Continuous environment에서의 low-level action과 성능 하락의 근거이며 모든 결과가 비례 재현된다는 뜻은 아님" },
    { kind: "핵심 논문", label: "Waypoint Models for Instruction-guided Navigation in Continuous Environments", href: "https://arxiv.org/abs/2110.02207", note: "Waypoint 표현력 spectrum과 경로 효율성의 근거이며 모든 embodiment를 대표하지 않음" },
    { kind: "후속 논문", label: "Embodied-Navigator · TAMP-Nav (2026-08-18 preprint)", href: "https://arxiv.org/abs/2608.17512", note: "Selective reasoning·anchor-trajectory memory·two-level alignment와 R2R-CE 66.2% SR의 최신 자기보고이며 독립 재현은 아님" },
  ],
  "ai/math-high-dimensional-geometry": [
    { kind: "핵심 논문", label: "Dasgupta & Gupta — An Elementary Proof of a Theorem of Johnson and Lindenstrauss", href: "https://doi.org/10.1002/rsa.10073", note: "JL lemma의 명시적 차원 하한 k≥4ln(n)/(ε²/2−ε³/3)의 근거" },
    { kind: "핵심 논문", label: "Pope et al. — The Intrinsic Dimension of Images and Its Impact on Learning", href: "https://arxiv.org/abs/2104.08894", note: "ImageNet 등 자연 이미지의 intrinsic dimension 추정치(26~43)의 근거" },
  ],
  "ai/math-numerical-precision-stability": [
    { kind: "핵심 논문", label: "Goldberg — What Every Computer Scientist Should Know About Floating-Point Arithmetic", href: "https://doi.org/10.1145/103162.103163", note: "IEEE 754 형식·유효숫자·machine epsilon 수치의 근거" },
    { kind: "보충 읽기", label: "Goodfellow, Bengio & Courville — Deep Learning, Chapter 4", href: "https://www.deeplearningbook.org/contents/numerical.html", note: "Softmax max-subtraction 안정화 기법의 근거" },
  ],
  "ai/quantization-formats-and-granularity": [
    { kind: "공식 문서", label: "NVIDIA Transformer Engine · FP8 Current Scaling", href: "https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/features/low_precision_training/fp8_current_scaling/fp8_current_scaling.html", note: "E4M3·E5M2 bit 배치와 amax 기반 scaling의 공식 근거" },
    { kind: "공식 문서", label: "Introducing NVFP4 for Efficient and Accurate Low-Precision Inference", href: "https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/", note: "NVFP4의 E2M1 code와 16-element micro-block + tensor scale two-level scaling 근거" },
    { kind: "핵심 논문", label: "The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits", href: "https://arxiv.org/abs/2402.17764", note: "Ternary weight로 처음부터 학습하는 BitNet b1.58 근거" },
  ],
  "ai/training-memory-budget": [
    { kind: "핵심 논문", label: "Rajbhandari et al. — ZeRO: Memory Optimizations Toward Training Trillion Parameter Models", href: "https://arxiv.org/abs/1910.02054", note: "Model-state memory (2+2+K)Ψ·16byte/param 수치의 근거" },
    { kind: "핵심 논문", label: "Chen et al. — Training Deep Nets with Sublinear Memory Cost", href: "https://arxiv.org/abs/1604.06174", note: "Activation checkpointing의 O(√n) 메모리·48GB→7GB·+30% 시간 수치의 근거" },
  ],
  "gpu/gemmini-pe-mac-dataflow": [
    { kind: "핵심 논문", label: "Gemmini: Enabling Systematic Deep-Learning Architecture Evaluation via Full-Stack Integration", href: "https://arxiv.org/abs/1911.09925", note: "Systolic array 가속기 generator를 제안한 DAC 2021 원 논문, 성능 배수는 저자 자기보고" },
    { kind: "공식 구현", label: "ucb-bar/gemmini — PE.scala", href: "https://github.com/ucb-bar/gemmini/blob/main/src/main/scala/gemmini/PE.scala", note: "이 글이 그대로 인용한 MacUnit·PE의 실제 Chisel 소스" },
    { kind: "공식 문서", label: "Gemmini README — Quick Start", href: "https://github.com/ucb-bar/gemmini#quick-start", note: "Chipyard 설치부터 Verilator·Spike 시뮬레이션까지의 공식 절차, build 절 근거" },
  ],
};

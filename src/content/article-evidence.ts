import { AGENT_SECURITY_SOURCES } from "./agent-sandbox-security";
import { B300_SWITCHLESS_SOURCE_LINKS } from "./b300-switchless-network";
import { EUREKA_SOURCE_LINKS } from "./sionic-eureka";
import { GLM_B300_SOURCE_LINKS } from "./sionic-glm-b300";
import { KIMI_K3_SOURCE } from "./kimi-k3";
import { OFFICIAL_SOURCES } from "./official-sources";

export type ArticleEvidenceKind =
  | "핵심 논문"
  | "핵심 사료"
  | "비교 사료"
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
      "kind": "공식 문서",
      "label": "CUDA C++ Programming Guide 13.0.2 · Thread Hierarchy·SIMT·Thread Block Clusters",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html",
      "note": "Block별 warp 구성과 독립 배치, CC 9.0부터의 cluster와 portable 최대 8 및 작은 구성 예외를 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA cuda-samples v13.0 · vectorAdd.cu",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "49–52행에 block 2·크기 4·내부 번호 1·길이 10을 넣어 i=9와 결과 99를 따라갑니다."
    }
  ],
  "gpu/cuda-shared-memory": [
    {
      "kind": "공식 문서",
      "label": "CUDA C++ Best Practices Guide 13.0.2 · 10.2.1·10.2.3",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html",
      "note": "32바이트 주소 구간과 정렬, 32-bit bank mapping·broadcast를 64×64 전치의 주소에 적용합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA cuda-samples v13.0 · transpose.cu",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/6_Performance/transpose/transpose.cu",
      "note": "124–189행의 세 함수에 입력 2371→tile[5][3]→출력 229를 대입하고 410–433행의 host 조건을 대조합니다."
    }
  ],
  "gpu/cuda-sync-streams": [
    {
      "kind": "공식 문서",
      "label": "CUDA Runtime13.0.2 · API/Stream Synchronization",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-runtime-api/api-sync-behavior.html",
      "note": "공식 API 의미를2·5·2ms의 가정한 시간표와 구별해 적용합니다. Stream 수나 Async 접미사만으로 특정 겹침·14ms를 보장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Runtime13.0.2 · Event Management",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-runtime-api/group__CUDART__EVENT.html",
      "note": "빈 event와 세대1·2의 순서를 공식 규칙에 대입합니다. 미기록 event가 미래 생산을 예약하거나 뒤의 기록이 기존 wait를 바꾸지 않습니다."
    },
    {
      "kind": "공식 코드",
      "label": "NVIDIA cuda-samples v13.0 · simpleMultiCopy",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/simpleMultiCopy/simpleMultiCopy.cu",
      "note": "실제 전체 원문에 입력7과streams_used2를 대입한 추적입니다. 공식 sample 전체의 GPU 실행이나2·5·2ms의 실제 측정을 주장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Guide13.0.2 · Synchronization/Warp Functions",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html#synchronization-functions",
      "note": "thread0이7을 쓰고thread1이8을 만드는 경로에 적용합니다. Shuffle/vote의 sync 접미사를 임의의 메모리 barrier로 취급하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Guide13.0.2 · Memory Fence Functions",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html#memory-fence-functions",
      "note": "data7과 flag의 release/acquire를 조건부 전달 원리로 설명합니다. Fence 하나로 일반 flag의 data race와 모든 재사용 문제가 해결되지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Guide13.0.2 · Asynchronous Barrier / PTX9.0",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html#asynchronous-barrier",
      "note": "C++의2명 카운트와 PTX원문의64명 생산자/소비자를 구별합니다. 분리 barrier가 모든 동기화에서 더 빠르다는 결론을 내리지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Guide13.0.2 · Multi-Device System",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html#multi-device-system",
      "note": "GPU0에서GPU1로 가는8의 생산·복사·소비 경로에 적용합니다. 장치 수나NVLink 명칭으로 접근 가능성·대역폭·속도배수를 보장하지 않습니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "MIT 18.065 · Lecture 7의 정리와 문제 2",
      "href": "https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/",
      "note": "실제 문제의 마지막 행렬 [[2,1],[1,2]]에서 rank 1 근사 1.5ones와 제곱 오차 1을 계산합니다. 추가한 입력 (4,2)의 출력은 (10,8)과 (9,9)입니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT 18.06SC · Lecture 29 요약 1–2쪽",
      "href": "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/d273f75ee2552a5c3c35ccab37e5edce_MIT18_06SCF11_Ses3.5sum.pdf",
      "note": "Avᵢ=σᵢuᵢ에 두 방향을 대입해 배율 3과 1을 확인하고 AᵀA의 고유값 9와 1을 구별합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 · torch.linalg.svd",
      "href": "https://docs.pytorch.org/docs/2.8/generated/torch.linalg.svd.html",
      "note": "U·S·Vh 반환 크기와 full/reduced, q=min(m,n)을 확인했습니다. Rank 1인 3×2 입력도 reduced S에 두 값 (1,0)을 남깁니다."
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 · aten/src/ATen/native/Linear.cpp",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/aten/src/ATen/native/Linear.cpp#L50-L118",
      "note": "전체 고정 파일·라이선스·SHA256을 보존했습니다. 2차원 입력과 존재하는 bias의 addmm 경로에 input=[[4,2]], weight=A를 대입하고 3차원 입력의 펼침 경로를 확인합니다. 실제 장비 실행이나 성능 측정은 아닙니다."
    },
],
  "ai/math-vectors-inner-products": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.06 Linear Algebra",
      href: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/",
      note: "Vector·inner product·orthogonality·projection을 학부 선형대수 흐름에서 확장하는 공개 강의",
    },
    {
      "kind": "공식 문서",
      "label": "OpenStax Calculus Volume 3 §2.3 · 식 (2.3)–(2.7)",
      "href": "https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product",
      "note": "원문의 기준 u=(2,0), 대상 v=(3,4)를 식 (2.6)에 넣어 (6/4)(2,0)=(3,0)을 구합니다. 본문과 원문의 문자 역할 차이를 명시했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 · normalize",
      "href": "https://docs.pytorch.org/docs/2.8/generated/torch.nn.functional.normalize.html",
      "note": "분모에 eps를 더하지 않고 max(노름, eps)를 사용함을 확인했습니다. 아주 작은 입력에서 결과 길이가 .05인 문서식 계산을 제공합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 · cosine_similarity",
      "href": "https://docs.pytorch.org/docs/2.8/generated/torch.nn.functional.cosine_similarity.html",
      "note": "기본 eps=1e−8로 두 노름을 각각 제한합니다. 예제의 계산값 .03과 기하학적 코사인 .6의 차이를 설명합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Cornell CS 4/5780 Spring 2023 · Perceptron Convergence",
      "href": "https://www.cs.cornell.edu/courses/cs4780/2023sp/lectures/lecturenote03.html",
      "note": "원문의 초기값 0과 두 성장식, 단위 길이 입력의 1/γ² 상한을 읽고 R=5·γ=1 사례를 입력 1/5 축소로 연결합니다."
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
    {
      "kind": "공식 문서",
      "label": "OpenStax Calculus Volume 1 §1.1의 같은 합성 사례",
      "href": "https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions",
      "note": "같은 f(x)=x², g(x)=3x+1을 원문에서 확인하고 입력 2로 49와 13을 대조합니다. 식 (1.1)은 g∘f 순서라는 조건까지 본문 9절에 적었습니다."
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
    {
      "kind": "공식 문서",
      "label": "OpenStax Calculus Volume 1 §3.1의 차분몫과 x=3 예제",
      "href": "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative",
      "note": "식 (3.2)와 (3.4), Example 3.2의 제곱 함수에 같은 기준점 3을 대입해 유한 간격 6.1과 극한 6을 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "OpenStax §3.6 연쇄법칙 식 (3.17)",
      "href": "https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule",
      "note": "원문 h′(x)=f′(g(x))g′(x)에 x=2, g(2)=7을 넣어 14×3=42를 계산합니다. 두 미분의 평가 위치와 미분 가능성 조건을 명시했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 비미분 가능 함수의 선택 규칙",
      "href": "https://docs.pytorch.org/docs/2.8/notes/autograd.html#gradients-for-non-differentiable-functions",
      "note": "문서 규칙 2의 최소 크기 부분기울기를 ReLU의 [0,1]에 적용해 0을 선택합니다. 실제 PyTorch 실행을 재현했다는 주장은 하지 않습니다."
    },
],
  "ai/math-gradients-jacobians": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.02SC — Gradient and Directional Derivatives",
      href: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/",
      note: "편미분·gradient·directional derivative를 다변수 함수의 기하학으로 확장",
    },
    { kind: "보충 읽기", label: "The Matrix Calculus You Need For Deep Learning", href: "https://arxiv.org/abs/1802.01528", note: "Gradient·Jacobian·vectorized chain rule의 shape convention을 확장" },
    {
      "kind": "공식 문서",
      "label": "OpenStax Calculus Volume 3 §4.6 방향미분과 최대 변화율",
      "href": "https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient",
      "note": "식 (4.38)에 (4,3)과 단위 방향 (3/5,4/5)를 넣어 24/5를 얻습니다. 정리 4.13의 최대·최소는 이 가정 사례에서 5와 −5입니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Parr·Howard v3 §4.1, 7쪽 야코비안의 실제 행렬",
      "href": "https://arxiv.org/abs/1802.01528v3",
      "note": "원문은 행 기울기를 쌓아 m개 출력과 n개 입력을 m행 n열로 둡니다. 같은 합·곱의 (2,3) 사례를 대입해 [[1,1],[3,2]]와 Jv를 계산하며 열 기울기 표기의 전치를 구별했습니다."
    },
],
  "ai/math-probability-expectation-variance": [
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 1 · PDF 2쪽 확률 공리",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/ff296575da32c406c2e56131e1e38997_MIT6_041SCF13_L01.pdf#page=2",
      "note": "P(Ω)=1과 배타적 사건의 합을 HT·TH에 대입해 1/2을 복원합니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 2 · PDF 1–2쪽 조건부확률과 곱",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/a1462fa23de9d08c0dfd233a57278fed_MIT6_041SCF13_L02.pdf#page=1",
      "note": "P(A|B)의 실제 분모 조건을 읽고 같은 HT에 세 사건 곱을 적용합니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 3 · PDF 1–2쪽 독립과 쌍별 독립",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/a2015627268f4846eb3b1368623ce46f_MIT6_041SCF13_L03.pdf#page=2",
      "note": "첫 H·둘째 H·같은 결과를 원문의 같은 네 칸에 놓아 쌍의 1/4과 세 사건의 1/4을 계산합니다."
    }
  ],
  "ai/math-random-variables-expectation": [
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 5 · PDF 1쪽 함수와 PMF",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/e49cdbaf3129125869700c46aa661fa1_MIT6_041SCF13_L05.pdf#page=1",
      "note": "실제 원문의 역상 사건에 x=1을 넣어 HT와 TH의 비중을 합합니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 5 · PDF 2쪽 함수의 기댓값",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/e49cdbaf3129125869700c46aa661fa1_MIT6_041SCF13_L05.pdf#page=2",
      "note": "같은 pₓ에 g(x)=2x+3과 x²를 넣어 5와 3/2를 계산합니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 7 · PDF 1쪽 합과 곱의 조건",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/c0a406b218730ddb16326d695a895c57_MIT6_041SCF13_L07.pdf#page=1",
      "note": "원문의 두 변수 가중합에 (X,Y)=(2,0),(1,1),(0,2)를 넣어 선형 조합 5를 구합니다."
    }
  ],
  "ai/math-variance-sampling": [
    {
      "kind": "공식 문서",
      "label": "MIT 6.041SC Lecture 19 · PDF 1–2쪽",
      "href": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/d569abb143b22f469a09ff218cb3383c_MIT6_041SCF13_L19.pdf#page=2",
      "note": "원문의 Mₙ 식에 분산 1/2, 오차 폭 1/2, n=2와 n=16을 넣어 상한 1과 1/8을 계산합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NumPy 2.0 · numpy.var",
      "href": "https://numpy.org/doc/2.0/reference/generated/numpy.var.html",
      "note": "원문의 기본 ddof=0과 N−ddof를 [1,2,3]에 대입해 2/3과 ddof=1의 1을 비교합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.14 · torch.var",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.var.html",
      "note": "실제 correction=1 기본값으로 같은 세 값의 분산 추정값 1을 구합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Robbins & Monro (1951), A Stochastic Approximation Method",
      "href": "https://www.columbia.edu/~ww2040/8100F16/RM51.pdf#page=3",
      "note": "원문 식 (7)과 (50)에 같은 위치 −1.5와 뽑은 기울기를 넣어 −1.45와 −1.55를 계산합니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "Boyd·Vandenberghe §4.1.1 식 (4.1) 및 §4.1.2 Example 4.2",
      "href": "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=141",
      "note": "인쇄 127쪽의 실제 문제 형태에 f₀=(x−3)²+2, f₁=−x, f₂=x−2를 넣습니다. 128쪽의 최적점 정의와 129쪽의 구간 조건 변환을 같은 x=2 및 x=3에서 확인합니다. inf와 달성된 min을 구별합니다."
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
    {
      "kind": "공식 문서",
      "label": "Boyd·Vandenberghe 식 (3.1), (3.2), (9.8), (9.13)",
      "href": "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf",
      "note": "인쇄 67·69쪽의 현과 접선 부등식, 459·461쪽의 실제 위아래 이차 경계에 같은 x²의 0/2 및 1→1.1 사례를 대입합니다. 원문 θ·m·M을 λ·μ·L에 대응하고 원문이 둔 두 번 미분 가능성과 관심 집합 조건을 구별합니다."
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
    {
      "kind": "공식 문서",
      "label": "Boyd·Vandenberghe §9.3 식 (9.17), Algorithm 9.3 및 식 (9.18)",
      "href": "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=480",
      "note": "인쇄 466쪽의 실제 보폭별 상한에 x=4,g=4,M=1,t=.5를 넣어 점수 2를 얻고 t=3의 32도 확인합니다. 원문의 선 탐색과 글의 고정 보폭을 구별하며 467쪽 식 (9.18)을 고정 보폭 정리로 잘못 인용하지 않습니다."
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
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 LinearFunction 실제 문서 예제",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/docs/source/notes/extending.rst#L162-L202",
      "note": "전체 고정 RST 원문·LICENSE·SHA256 보존. input2,weight3,grad_output13을 실제 forward·backward에 대입합니다. native nn.Linear 구현과 구분합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 Autograd saved tensor·version 확인",
      "href": "https://docs.pytorch.org/docs/2.8/notes/autograd.html#in-place-correctness-checks",
      "note": "저장한 값과 in-place 변경의 version 검사를 같은 a=6 사례에 적용합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.8 backward의 leaf gradient 누적",
      "href": "https://docs.pytorch.org/docs/2.8/generated/torch.autograd.backward.html",
      "note": "한 graph의 경로 합과 여러 backward 호출의 .grad 저장 정책을 구분합니다."
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
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 LinearFunction의 행렬 backward",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/docs/source/notes/extending.rst#L167-L202",
      "note": "동일 원문을 보존하고167–178·182–202행으로 나누어 엽니다. input(1,2),weight=Wᵀ,G(2/3,−2/3)의 실제 저장 방향과 세 반환값을 대조합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Rumelhart·Hinton·Williams 1986 저자 공개 원문",
      "href": "https://www.cs.toronto.edu/~hinton/absps/naturebp.pdf",
      "note": "실제 스캔534쪽식(6)·535쪽식(7)에 입력2와 뒤 기여−2/3을 대입해 weight gradient−4/3을 얻습니다. 원문 사례는 거울 대칭·가족 관계이며 TTS로 소개한 기존 오기를 교정했습니다."
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
    {
      "kind": "공식 문서",
      "label": "NumPy heaviside 실제 구간 정의",
      "href": "https://numpy.org/doc/stable/reference/generated/numpy.heaviside.html",
      "note": "2026-10-04 확인. 입력2와 경계값 선택을 실제 정의에 대입합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.14 Sigmoid 실제 정의",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.nn.Sigmoid.html",
      "note": "입력2의 forward와 도함수 계산에 대입합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.14 Tanh 실제 정의",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.nn.Tanh.html",
      "note": "입력2의 실제 지수식과 뒤 변화율3을 연결합니다."
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
    {
      "kind": "핵심 논문",
      "label": "PReLU v1 식(1)·(3)",
      "href": "https://arxiv.org/pdf/1502.01852v1",
      "note": "원문의 부호별 함수와 slope gradient를 입력−2에 적용합니다. 임의 학습 a와0<a<1의 max표현을 구분합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "SELU v5 식(2)",
      "href": "https://arxiv.org/pdf/1706.02515v5",
      "note": "원문 상수에(−2,3)을 대입해 출력·기울기·표본 평균을 계산합니다."
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
    {
      "kind": "핵심 논문",
      "label": "GLU Variants v1 §2 식(6)",
      "href": "https://arxiv.org/pdf/2002.05202v1",
      "note": "원문 W,V,W2를 Wg,Wv,Wo에 연결하고 입력(1,−1)을 직접 대입합니다. 중간 폭2/3 조건도 대조합니다."
    },
],
  "ai/optimizers": [
    {
      kind: "핵심 논문",
      label: "A Stochastic Approximation Method",
      href: "https://doi.org/10.1214/aoms/1177729586",
      note: "Noisy observation과 반복 step을 연결한 stochastic approximation 출발점",
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 scalar SGD 원문",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/torch/optim/sgd.py#L369-L375",
      "note": "실제 parameter.add_에3,4,.1을 대입합니다. 보존 원문의 SHA256와 LICENSE를 기록했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "Transformers 고정 loss 합계·공통 분모",
      "href": "https://github.com/huggingface/transformers/blob/469230357aab0f2b303b0d638c1f8d06edb14184/src/transformers/loss/loss_utils.py#L32-L46",
      "note": "2026-10-03 revision. 손실합2·18과 공통 분모8을 대입합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Transformers 고정 누적 창·유효 위치 집계",
      "href": "https://github.com/huggingface/transformers/blob/469230357aab0f2b303b0d638c1f8d06edb14184/src/transformers/trainer.py#L2256-L2317",
      "note": "수집 후 label 이동 조건과−100 제외 집계를 확인합니다."
    },
],
  "ai/momentum-optimizer": [
    {
      kind: "핵심 논문",
      label: "Some Methods of Speeding Up the Convergence of Iteration Methods",
      href: "https://doi.org/10.1016/0041-5553(64)90137-5",
      note: "이전 iterate를 사용하는 multi-step acceleration의 고전 분석",
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 momentum·Nesterov 실제 분기",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/torch/optim/sgd.py#L354-L375",
      "note": "g=[1,1,−1]의 buffer와 같은 마지막 진입 상태의 두 분기를 직접 계산합니다."
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
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 Adam 두 장부 원문",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/torch/optim/adam.py#L446-L464",
      "note": "lerp_와addcmul_에g=2,−2를 대입합니다."
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.8.0 Adam 보정·분모·갱신",
      "href": "https://github.com/pytorch/pytorch/blob/ba56102387ef21a3b04b357e5b183d48f0afefc7/torch/optim/adam.py#L517-L535",
      "note": "둘째 m=−.02,v=.007996,t=2로 .005263 증가량을 복원합니다."
    },
],
  "ai/cross-entropy": [
    {
      "kind": "핵심 논문",
      "label": "A Mathematical Theory of Communication",
      "href": "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
      "note": "entropy와 information measure의 출발점"
    },
    {
      "kind": "핵심 논문",
      "label": "Shannon · 재현 PDF 정리 2와 정리 9",
      "href": "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf",
      "note": "실제 식과 같은 세 확률의 1.5 bit, 6/1.5=4글자/초 적용입니다."
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.14.0 · 실제 cross_entropy 분기와 NLL",
      "href": "https://github.com/pytorch/pytorch/blob/2b3ec34829036a65cd9d1398ea72a0167dc37470/aten/src/ATen/native/LossNLL.cpp",
      "note": "고정 원문의 정답 선택과 클래스 번호·확률 정답의 서로 다른 가중 mean 분모를 추적합니다."
    },
    {
      "kind": "공식 코드",
      "label": "PyTorch v2.14.0 · CPU log_softmax 계산 순서",
      "href": "https://github.com/pytorch/pytorch/blob/2b3ec34829036a65cd9d1398ea72a0167dc37470/aten/src/ATen/native/cpu/LogSoftmaxKernelImpl.h",
      "note": "x−max−log(sum)의 실제 순서와 큰 수에 작은 로그를 먼저 더하지 않는 주석을 읽습니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.14 · CrossEntropyLoss",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html",
      "note": "정답 형식과 가중 mean·제외 정답의 API 조건을 실제 고정 코드와 대조합니다."
    }
  ],
  "ai/fft": [
    {
      "kind": "핵심 논문",
      "label": "An Algorithm for the Machine Calculation of Complex Fourier Series",
      "href": "https://research.ibm.com/publications/an-algorithm-for-the-machine-calculation-of-complex-fourier-series",
      "note": "Cooley–Tukey 분할과 재사용을 설명한 1965년 논문"
    },
    {
      "kind": "공식 연구",
      "label": "Robust Speech Recognition via Large-Scale Weak Supervision",
      "href": "https://cdn.openai.com/papers/whisper.pdf",
      "note": "Whisper의 16kHz·80-channel log-Mel frontend specification"
    },
    {
      "kind": "핵심 논문",
      "label": "FNet: Mixing Tokens with Fourier Transforms",
      "href": "https://arxiv.org/abs/2105.03824",
      "note": "Fourier transform을 fixed token mixer로 사용한 encoder 실험"
    },
    {
      "kind": "핵심 논문",
      "label": "Hyena Hierarchy: Towards Larger Convolutional Language Models",
      "href": "https://arxiv.org/abs/2302.10866",
      "note": "Implicit long convolution과 gating에서 FFT가 맡는 실행 역할"
    },
    {
      "kind": "핵심 논문",
      "label": "An Algorithm for the Machine Calculation of Complex Fourier Series",
      "href": "https://web.stanford.edu/class/cme324/classics/cooley-tukey.pdf",
      "note": "297–298쪽 식 (6)·(7)에 N=4와 같은 네 값을 대입하고 양의 지수 규약의 켤레 출력을 계산합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Robust Speech Recognition via Large-Scale Weak Supervision",
      "href": "https://cdn.openai.com/papers/whisper.pdf",
      "note": "§2.2의 16 kHz·25 ms·10 ms를 400·160 표본으로 계산하고 고정 audio.py의 제곱 크기·Mel·로그 순서를 추적합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "FNet: Mixing Tokens with Fourier Transforms",
      "href": "https://aclanthology.org/2022.naacl-main.319.pdf",
      "note": "4299쪽 식 (3)의 두 축 변환 뒤 실수 투영에 4×1 입력을 대입해 [10,−2,−2,−2]를 구합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Hyena Hierarchy: Towards Larger Convolutional Language Models",
      "href": "https://arxiv.org/pdf/2302.10866v3",
      "note": "6쪽 식 (4)의 한 단계에 같은 입력과 h=[1,−1], g=[1,0,2,1]을 넣어 인과적 출력 [1,0,2,1]을 계산합니다."
    },
    {
      "kind": "공식 코드",
      "label": "KISS FFT · e5e3fac4 고정 원문",
      "href": "https://github.com/mborgerding/kissfft/blob/e5e3fac46e0d94a8f8170c06706b7a4218828333/kiss_fft.c",
      "note": "실제 radix-4 분기와 임시 배열을 같은 네 값의 CPU 실행으로 확인했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "Whisper · 86098128 audio.py",
      "href": "https://github.com/openai/whisper/blob/86098128c0b4f24f0e2aa2994de830614b474227/whisper/audio.py",
      "note": "16 kHz·400·160과 제곱 크기·시간축 절단·80/128 Mel·로그 순서입니다."
    },
    {
      "kind": "공식 문서",
      "label": "PyTorch 2.14 · STFT",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.stft.html",
      "note": "복소 출력의 주파수·시간 축과 기본 인자 계약을 구별합니다."
    }
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
    {
      "kind": "핵심 논문",
      "href": "https://www.deeplearningbook.org/contents/mlp.html",
      "note": "6.1절 식 (6.3)–(6.11)의 중간값을 같은 입력에 적용합니다.",
      "label": "Deep Learning 6.1 · 실제 XOR 계산"
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
  "ai/competition-workflow": [
    {
      "kind": "보충 읽기",
      "label": "competition-workflow — §11.2 Data leakage definition",
      "href": "https://scikit-learn.org/1.7/common_pitfalls.html#data-leakage",
      "note": "2026-10-04 원문 확인. 09:00 측정·10:05 도착 입력을10:00 예측에서 제외"
    },
],
  "ai/model-selection-bias": [
    { kind: "핵심 논문", label: "On Over-fitting in Model Selection and Subsequent Selection Bias", href: "https://www.jmlr.org/papers/v11/cawley10a.html", note: "Finite validation criterion의 variance와 반복 selection이 만드는 편향" },
    {
      "kind": "보충 읽기",
      "label": "model-selection-bias — Abstract: variance and over-fitting in model selection",
      "href": "https://jmlr.org/papers/v11/cawley10a.html",
      "note": "2026-10-04 원문 확인. 평균0.70 후보의 관측0.74 선택과 별도평가, 고정집합 부등식 한계"
    },
],
  "ai/prediction-time-feature-availability": [],
  "ai/competition-baseline": [
    { kind: "핵심 논문", label: "Hidden Technical Debt in Machine Learning Systems", href: "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems", note: "Data·configuration·feedback dependency를 포함한 ML system risk taxonomy" },
    {
      "kind": "보충 읽기",
      "label": "competition-baseline — 1.7.2 cross_val_predict sample partition / metric warning / cv API",
      "href": "https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.cross_val_predict.html",
      "note": "2026-10-04 원문 확인. 5행 coverage 검사와 0-based train/test 인자, 행 평균0.068과 fold 평균0.0675 구분"
    },
    {
      "kind": "보충 읽기",
      "label": "competition-baseline — Abstract: configuration and data dependencies",
      "href": "https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html",
      "note": "2026-10-04 원문 확인. 입력·설정·분할·출력·제출의 run lineage 한계"
    },
],
  "ai/paired-experiment-design": [
    {
      "kind": "보충 읽기",
      "label": "paired-experiment-design — differences array and dependence correction in official 1.7.2 example",
      "href": "https://scikit-learn.org/1.7/auto_examples/model_selection/plot_grid_search_stats.html",
      "note": "2026-10-04 원문 확인. 5개 같은 fold 차이와 평균0.0034, 독립성·유의성 경계"
    },
],
  "ai/competition-submission-control": [
    { kind: "핵심 논문", label: "The Ladder: A Reliable Leaderboard for Machine Learning Competitions", href: "https://proceedings.mlr.press/v37/blum15.html", note: "적응적 submission과 leaderboard holdout overfitting 문제" },
    {
      "kind": "보충 읽기",
      "label": "competition-submission-control — Algorithm 1, PDF p.4",
      "href": "https://proceedings.mlr.press/v37/blum15.pdf",
      "note": "2026-10-04 원문 확인. A/B와 동일B재전송의loss0.26/0.24/0.24 공개규칙 적용"
    },
],
  "ai/cross-validation": [
    { kind: "공식 문서", label: "scikit-learn: Cross-validation — evaluating estimator performance", href: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "K-fold·group·time splitter의 서로 다른 data assumption과 current API" },
    {
      "kind": "보충 읽기",
      "label": "cross-validation — §3.1.2.4 grouped data",
      "href": "https://scikit-learn.org/1.7/modules/cross_validation.html#cross-validation-iterators-for-grouped-data",
      "note": "2026-10-04 원문 확인. C·D 미관측 조건과 집계 단위 분리"
    },
],
  "ai/fold-local-validation": [
    { kind: "공식 문서", label: "scikit-learn: Pipeline — chaining estimators", href: "https://scikit-learn.org/stable/modules/compose.html#pipeline-chaining-estimators", note: "Transform fit과 estimator fit을 같은 cross-validation 경계에서 실행하는 current API" },
    {
      "kind": "보충 읽기",
      "label": "fold-local-validation — §11.1 actual scaler calls and §11.2 leakage",
      "href": "https://scikit-learn.org/1.7/common_pitfalls.html",
      "note": "2026-10-04 원문 확인. [2,4] fit→[8,10] transform 및 pipeline 범위"
    },
    {
      "kind": "보충 읽기",
      "label": "fold-local-validation — Notes ddof=0 and scale_",
      "href": "https://scikit-learn.org/1.7/modules/generated/sklearn.preprocessing.StandardScaler.html",
      "note": "2026-10-04 원문 확인. 표준편차1과 분산0 scale1 경계"
    },
],
  "ai/oof-risk-estimation": [
    { kind: "핵심 논문", label: "Cross-Validation: What Does It Estimate and How Well Does It Do It?", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/", note: "CV procedure estimand와 fold dependence·uncertainty 해석" },
    {
      "kind": "보충 읽기",
      "label": "oof-risk-estimation — v4 §2 equation (2), §3 and §4.1",
      "href": "https://arxiv.org/html/2104.00673v4#S2",
      "note": "2026-10-04 원문 확인. 36/100 OOF 집계·학습크기·추정대상·의존성 조건"
    },
    {
      "kind": "보충 읽기",
      "label": "oof-risk-estimation — cross_val_predict metric caveat",
      "href": "https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.cross_val_predict.html",
      "note": "2026-10-04 원문 확인. non-decomposable metric와 fold 간 점수 비교 경계"
    },
],
  "ai/grouped-validation": [
    { kind: "공식 문서", label: "scikit-learn: Cross-validation iterators for grouped data", href: "https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data", note: "GroupKFold·StratifiedGroupKFold의 current semantics" },
    {
      "kind": "보충 읽기",
      "label": "grouped-validation — GroupKFold class description and Notes",
      "href": "https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.GroupKFold.html",
      "note": "2026-10-04 원문 확인. 그룹4개 분할수2·교집합 검사·행과 대상 수 분리"
    },
    {
      "kind": "보충 읽기",
      "label": "grouped-validation — StratifiedGroupKFold implementation boundary",
      "href": "https://scikit-learn.org/1.7/modules/cross_validation.html#stratifiedgroupkfold",
      "note": "2026-10-04 §3.1.2.4.2 원문 확인. 그룹을 유지하며 클래스 비율을 맞추려 하지만 완벽한 균형을 보장하지 않는 경계."
    },
],
  "ai/walk-forward-validation": [
    { kind: "공식 문서", label: "scikit-learn: TimeSeriesSplit", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html", note: "Successive training windows와 gap parameter의 current behavior" },
    {
      "kind": "보충 읽기",
      "label": "walk-forward-validation — gap parameter / split API",
      "href": "https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.TimeSeriesSplit.html",
      "note": "2026-10-04 원문 확인. 37 samples와37 days 구별·별도 label availability 검사"
    },
],
  "ai/validation-feedback-audit": [
    { kind: "핵심 논문", label: "The Ladder: A Reliable Leaderboard for Machine Learning Competitions", href: "https://proceedings.mlr.press/v37/blum15.html", note: "적응적 leaderboard feedback과 holdout overfitting 문제" },
    {
      "kind": "보충 읽기",
      "label": "validation-feedback-audit — §2 adaptive dependence and Algorithm 1, PDF p.4",
      "href": "https://proceedings.mlr.press/v37/blum15.pdf",
      "note": "2026-10-04 원문 확인. B→A→C의 loss0.26→0.24→0.25에 공개갱신 규칙 적용"
    },
],
  "ai/hyperparameter-tuning": [
    {
      kind: "핵심 논문",
      label: "Random Search for Hyper-Parameter Optimization",
      href: "https://www.jmlr.org/papers/v13/bergstra12a.html",
      note: "일부 축만 중요한 공간에서 grid보다 서로 다른 중요 값들을 더 많이 시험하는 random search 분석",
    },
    {
      "kind": "보충 읽기",
      "label": "hyperparameter-tuning — p.282 equation(4), §2.2 p.285 validation/test definitions",
      "href": "https://jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf",
      "note": "2026-10-04 원문 확인. A/B/C 중B 선택과0.20/0.23 역할 분리"
    },
],
  "ai/adaptive-hyperparameter-search": [
    { kind: "핵심 논문", label: "Optuna: A Next-generation Hyperparameter Optimization Framework", href: "https://arxiv.org/abs/1907.10902", note: "define-by-run·study·trial·sampler·pruner·storage architecture" },
    { kind: "핵심 논문", label: "Algorithms for Hyper-Parameter Optimization", href: "https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization", note: "TPE의 good/other configuration density model" },
    {
      "kind": "보충 읽기",
      "label": "adaptive-hyperparameter-search — §4 equation (2) and §4.1, PDF p.4",
      "href": "https://papers.nips.cc/paper_files/paper/2011/file/86e8f7ab32cfd12577bc2619bc635690-Paper.pdf",
      "note": "2026-10-04 원문 확인. 가정 밀도비6/2→비례EI12/7과4/3"
    },
    {
      "kind": "보충 읽기",
      "label": "adaptive-hyperparameter-search — class description and parameters",
      "href": "https://optuna.readthedocs.io/en/v4.5.0/reference/samplers/generated/optuna.samplers.TPESampler.html",
      "note": "2026-10-04 원문 확인. startup10·running penalty·사후 constraints 구별"
    },
    {
      "kind": "보충 읽기",
      "label": "adaptive-hyperparameter-search — 2019 Abstract",
      "href": "https://arxiv.org/abs/1907.10902",
      "note": "2026-10-04 원문 확인. define-by-run 시스템설계와 고정버전 API 구별"
    },
],
  "ai/search-space-design": [
    { kind: "핵심 논문", label: "Optuna: A Next-generation Hyperparameter Optimization Framework", href: "https://arxiv.org/abs/1907.10902", note: "Conditional search space를 코드에서 구성하는 define-by-run 설계" },
    {
      "kind": "보충 읽기",
      "label": "search-space-design — 4.5.0 floating log example and Branches",
      "href": "https://optuna.readthedocs.io/en/v4.5.0/tutorial/10_key_features/002_configurations.html",
      "note": "2026-10-04 원문 확인. 범위3구간 대4구간과 조건부 child 생성"
    },
    {
      "kind": "보충 읽기",
      "label": "search-space-design — 4.5.0 RandomSampler description",
      "href": "https://optuna.readthedocs.io/en/v4.5.0/reference/samplers/generated/optuna.samplers.RandomSampler.html",
      "note": "2026-10-04 원문 확인. 균등 로그 계산의 sampler 조건"
    },
    {
      "kind": "보충 읽기",
      "label": "search-space-design — 2019 abstract define-by-run",
      "href": "https://arxiv.org/abs/1907.10902",
      "note": "2026-10-04 원문 확인. 원 설계와4.5고정 세부 예제 구분"
    },
],
  "ai/multi-fidelity-pruning": [
    { kind: "핵심 논문", label: "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization", href: "https://www.jmlr.org/papers/v18/16-558.html", note: "Successive halving과 bracket을 통한 resource allocation" },
    {
      "kind": "보충 읽기",
      "label": "multi-fidelity-pruning — Algorithm1 lines5–6 PDF p.8, §3.2 brackets",
      "href": "https://jmlr.org/papers/volume18/16-558/16-558.pdf",
      "note": "2026-10-04 원문 확인. 9→3→1과1→3→9, 한bracket과전체차이"
    },
],
  "ai/multi-objective-hpo": [
    { kind: "공식 문서", label: "Optuna — Multi-objective optimization", href: "https://optuna.readthedocs.io/en/stable/tutorial/20_recipes/002_multi_objective.html", note: "Multiple directions와 Pareto trials의 current API example" },
    {
      "kind": "보충 읽기",
      "label": "multi-objective-hpo — 4.5.0 Study.best_trials exact all/any definition",
      "href": "https://optuna.readthedocs.io/en/v4.5.0/reference/generated/optuna.study.Study.html#optuna.study.Study.best_trials",
      "note": "2026-10-04 원문 확인. A/B지배와A/C상충"
    },
    {
      "kind": "보충 읽기",
      "label": "multi-objective-hpo — 4.5.0 directions example",
      "href": "https://optuna.readthedocs.io/en/v4.5.0/tutorial/20_recipes/002_multi_objective.html",
      "note": "2026-10-04 원문 확인. 원문FLOPS/정확도와본문손실/지연/메모리의방향구분"
    },
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
    {
      "kind": "보충 읽기",
      "label": "experiment-tracking — RunInfo, checked 2026-10-04",
      "href": "https://mlflow.org/docs/latest/api_reference/rest-api.html#runinfo",
      "note": "2026-10-04 원문 확인. 동일좌표 실제실행에 별도고유run ID"
    },
    {
      "kind": "보충 읽기",
      "label": "experiment-tracking — 2018 §3.1, printed p.41",
      "href": "https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf",
      "note": "2026-10-04 원문 확인. 실제 log_artifact 호출의 생산 실행 연결"
    },
],
  "ai/learning-curve-tracking": [
    {
      kind: "공식 문서",
      label: "Weights & Biases: Log data with experiments",
      href: "https://docs.wandb.ai/guides/track/log/",
      note: "metric history·step·custom progress axis를 기록하는 현재 공식 semantics",
    },
    {
      "kind": "공식 코드",
      "label": "learning-curve-tracking — v0.19.11 wandb_run.py define_metric:L2860–2878",
      "href": "https://github.com/wandb/wandb/blob/2a058902a2425bf79e5add34b30d0e9ea5e39951/wandb/sdk/wandb_run.py#L2860-L2878",
      "note": "2026-10-04 원문 확인. step_metric과step_sync에102만/98만 관측 대응"
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
    {
      "kind": "보충 읽기",
      "label": "Agent-Specific Defenses",
      "href": "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html#agent-specific-defenses",
      "note": "2026-10-04 원문 확인. 요약 전용 주체의 고객100건 전송 거부"
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
    {
      "kind": "평가 논문",
      "label": "MemoryArena · arXiv 2602.16313",
      "href": "https://arxiv.org/abs/2602.16313",
      "note": "memory-action-evaluation 절에서 기억 회상 90/100과 후속 과제 성공 8/20을 구분합니다. 숫자는 가정이며 논문 benchmark 결과가 아닙니다."
    },
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
    {
      "kind": "보충 읽기",
      "label": "§2 context equation",
      "href": "https://arxiv.org/html/2210.03629v3#S2",
      "note": "2026-10-04 원문 확인. 390→430→390과 read/patch/measure history"
    },
],
  "ai/agent-plan-replanning": [
    {
      kind: "핵심 논문",
      label: "Reflexion: Language Agents with Verbal Reinforcement Learning",
      href: "https://arxiv.org/abs/2303.11366",
      note: "외부·내부 feedback을 언어적 reflection과 episodic memory로 다음 trial에 전달하는 구조",
    },
    {
      "kind": "보충 읽기",
      "label": "Algorithm 1, Append sr_t to mem",
      "href": "https://arxiv.org/html/2303.11366v4#S3",
      "note": "2026-10-04 원문 확인. C의 실패를 B 다음 시도의 수정·검사 기록에 연결"
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
    {
      "kind": "보충 읽기",
      "label": "Multi-agent systems, Manager",
      "href": "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
      "note": "2026-10-04 원문 확인. A1·B1 검증 후 고유4건 정리"
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
    {
      "kind": "보충 읽기",
      "label": "agent-changelog-evidence — 확인한 원문",
      "href": "https://keepachangelog.com/en/1.1.0/",
      "note": "2026-10-04 원문 확인. 12개 기록의 덮어쓰기 수정과 검사 4개를 Unreleased→v1.4.0 Fixed 항목에 대응"
    },
],
  "ai/architecture-decision-records": [
    { kind: "보충 읽기", label: "Michael Nygard — Documenting Architecture Decisions", href: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions", note: "Significant decision의 title·status·context·decision·consequences와 superseding history" },
    { kind: "프로젝트 실측", label: "Profile storage ADR fixture", note: "Single JSON·profile files·database를 같은 driver로 비교하는 학습 사례이며 최적 storage 권고는 아님" },
    {
      "kind": "보충 읽기",
      "label": "architecture-decision-records — 확인한 원문",
      "href": "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions",
      "note": "2026-10-04 원문 확인. 200개 프로필 중 A만 복구하려는 저장 선택을 다섯 필드와 대체 이력에 적용"
    },
],
  "ai/engineering-lessons-ledger": [
    { kind: "공식 가이드", label: "Google SRE Workbook — Postmortem Culture", href: "https://sre.google/workbook/postmortem-culture/", note: "Blameless incident analysis, complete data, measurable preventive action·owner·review" },
    { kind: "프로젝트 실측", label: "Derived empty state guardrail fixture", note: "Scope·exception·test·revisit가 있는 provisional lesson 예시이며 모든 AI output에 적용하는 보편 rule은 아님" },
    {
      "kind": "보충 읽기",
      "label": "engineering-lessons-ledger — 확인한 원문",
      "href": "https://sre.google/sre-book/postmortem-culture/",
      "note": "2026-10-04 원문 확인. 12개 손실 사건과 4검사 행동 규칙을 분리하고 담당자·재검토 조건에 연결"
    },
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
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — transformers/models/mixtral/modeling_mixtral.py",
      "href": "https://raw.githubusercontent.com/huggingface/transformers/5eddc12edfaf8cafde8c9bae4ccb12f8a139b4f9/src/transformers/models/mixtral/modeling_mixtral.py",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — transformers/cache_utils.py",
      "href": "https://raw.githubusercontent.com/huggingface/transformers/5eddc12edfaf8cafde8c9bae4ccb12f8a139b4f9/src/transformers/cache_utils.py",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — transformers/models/gemma4/modeling_gemma4.py",
      "href": "https://raw.githubusercontent.com/huggingface/transformers/5eddc12edfaf8cafde8c9bae4ccb12f8a139b4f9/src/transformers/models/gemma4/modeling_gemma4.py",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — configs/Qwen3.6-27B/config.json",
      "href": "https://huggingface.co/Qwen/Qwen3.6-27B/resolve/6a9e13bd6fc8f0983b9b99948120bc37f49c13e9/config.json",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — configs/Muse-Glimmer-30B/config.json",
      "href": "https://huggingface.co/meta-models/Muse-Glimmer-30B/resolve/a4e59da52a7bc87ae7251dd5545c0dd437c44b68/config.json",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "공식 코드",
      "label": "KV fundamentals — configs/gemma-4-31B/config.json",
      "href": "https://huggingface.co/google/gemma-4-31B/resolve/5bbc2fb1c1b2c611d06e3d9f23c170ba21659d89/config.json",
      "note": "2026-10-04 확인. 전체파일 SHA256 검증 및 본문 작은사례를 해당 원문에 대입"
    },
    {
      "kind": "핵심 논문",
      "label": "KV fundamentals — Fast Transformer Decoding: One Write-Head is All You Need",
      "href": "https://arxiv.org/html/1911.02150v1",
      "note": "2026-10-04 확인. §2.4의 과거 기록 연결과 §3의 K/V head 축 제거에 3위치·4Q·1KV 사례24byte를 대입합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "KV fundamentals — GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints",
      "href": "https://arxiv.org/html/2305.13245v3",
      "note": "2026-10-04 확인. §2.2 묶음별 변환 가중치 평균과 Table1 XXL의1.51초·47.2 대0.28초·47.1 결과입니다."
    },
    {
      "kind": "핵심 논문",
      "label": "KV fundamentals — DeepSeek-V2 — latent compression and matrix absorption",
      "href": "https://arxiv.org/html/2405.04434v5",
      "note": "2026-10-04 확인. §2.1.2의 행렬 흡수와 §2.1.3의 위치 경로, Table1의(dc+dR)L 저장식을 적용합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "KV fundamentals — The Llama 3 Herd — Table 3 model dimensions",
      "href": "https://arxiv.org/html/2407.21783v3#S3.SS2",
      "note": "2026-10-04 확인. §3.2 Table3의8B열 구조값을 읽었고 gatedHFconfig 대신 공개원논문에 근거합니다."
    },
    {
      "kind": "공식 문서",
      "label": "KV fundamentals — PyTorch2.14 expand",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.Tensor.expand.html",
      "note": "2026-10-04 확인. 기존storage view이며 후속연산은별도할당가능"
    },
    {
      "kind": "공식 문서",
      "label": "KV fundamentals — PyTorch2.14 reshape",
      "href": "https://docs.pytorch.org/docs/2.14/generated/torch.reshape.html",
      "note": "2026-10-04 확인. 호환stride이면view,아니면copy이며 복사여부의존금지"
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
    {
      "kind": "보충 읽기",
      "label": "v0.27.1 Scheduler.schedule, L459–692",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "2026-10-04 원문 확인. A의 남은 token 6−4와 예산 4, KV 할당 및 정책별 preemption"
    },
    {
      "kind": "보충 읽기",
      "label": "Orca iteration-level scheduling",
      "href": "https://www.usenix.org/conference/osdi22/presentation/yu",
      "note": "2026-10-04 원문 확인. 완료한 B의 자리에 다음 계산부터 C 수용"
    },
    {
      "kind": "보충 읽기",
      "label": "PagedAttention §4",
      "href": "https://arxiv.org/abs/2309.06180",
      "note": "2026-10-04 원문 확인. 가변 길이 A·B·C의 KV 저장 공간을 블록으로 할당"
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
    {
      "kind": "보충 읽기",
      "label": "schedule L516–523 / _preempt_request L1274–1314",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "2026-10-04 고정 원문 확인. 5개 예산 중 1·1·3 배정과 선점·재삽입 조건"
    },
    {
      "kind": "보충 읽기",
      "label": "FCFS prepend L92–94 / Priority prepend L160–165",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/request_queue.py",
      "note": "2026-10-04 고정 원문 확인. 선점 요청이 정책에 따라 다른 위치로 복귀"
    },
    {
      "kind": "보충 읽기",
      "label": "VTC Theorem 4.4 / 4.8",
      "href": "https://arxiv.org/pdf/2401.00588",
      "note": "2026-10-04 고정 원문 확인. 2×를 서비스의 절대 차이 상한과 이론 하한의 관계로 교정"
    },
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
    {
      "kind": "보충 읽기",
      "label": "Hash and block design",
      "href": "https://docs.vllm.ai/en/v0.27.1/design/prefix_caching/",
      "note": "2026-10-04 고정 원문 확인. sha256 기본·salt·full-block 기본 모형과 코드의 확장 구분"
    },
    {
      "kind": "보충 읽기",
      "label": "§4 and §6",
      "href": "https://arxiv.org/abs/2309.06180",
      "note": "2026-10-04 고정 원문 확인. 주소 indirection과 fork/beam 공유, 측정 범위 제한"
    },
    {
      "kind": "보충 읽기",
      "label": "§3.1 / Theorem 3.1",
      "href": "https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf",
      "note": "2026-10-04 고정 원문 확인. A/B 앞32 prefix의 다른 표현과 offline 가정"
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 실제 원문 · block_pool.py",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/block_pool.py",
      "note": "2026-10-04 고정 원문 확인. ref=2→1→0와 free/hash eviction 차이"
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 실제 원문 · kv_cache_utils.py",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_utils.py",
      "note": "2026-10-04 고정 원문 확인. 32-token prefix의 chain hash와 첫 parent 초기화"
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 실제 원문 · single_type_kv_cache_manager.py",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/single_type_kv_cache_manager.py",
      "note": "2026-10-04 고정 원문 확인. 35→38→49의 수요 및 partial-hit CoW 추가 ref"
    },
],
  "ai/vllm-spec-decode": [
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 vllm/v1/sample/rejection_sampler.py original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/sample/rejection_sampler.py",
      "note": "commit 6e448d0의 전체 원문과 행 범위를 고정합니다. 본문 가정과 실제 CPU 대역 실행의 범위는 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 vllm/v1/core/sched/scheduler.py original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "commit 6e448d0의 전체 원문과 행 범위를 고정합니다. 본문 가정과 실제 CPU 대역 실행의 범위는 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 vllm/config/speculative.py original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/config/speculative.py",
      "note": "commit 6e448d0의 전체 원문과 행 범위를 고정합니다. 본문 가정과 실제 CPU 대역 실행의 범위는 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 vllm/v1/worker/gpu_model_runner.py original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/worker/gpu_model_runner.py",
      "note": "commit 6e448d0의 전체 원문과 행 범위를 고정합니다. 본문 가정과 실제 CPU 대역 실행의 범위는 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "vLLM v0.27.1 vllm/v1/spec_decode/dynamic/utils.py original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/spec_decode/dynamic/utils.py",
      "note": "commit 6e448d0의 전체 원문과 행 범위를 고정합니다. 본문 가정과 실제 CPU 대역 실행의 범위는 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Fast Inference from Transformers via Speculative Decoding",
      "href": "https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf",
      "note": "작은 (.7,.3)/(.4,.6) 계산과 E[Y]=2.7731을 적용합니다. Table4의 예상 3.2·실험 3.4는 ENDE T5-small 행의 결과입니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Accelerating Large Language Model Decoding with Speculative Sampling",
      "href": "https://arxiv.org/html/2302.01318v1",
      "note": "XSum·HumanEval 조건의 약 2~2.5배 저자 보고를 작은 가정 시간과 구분하고 실제 prefix마다 보정하는 계산을 연결합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty (v3)",
      "href": "https://arxiv.org/html/2401.15077v3",
      "note": "같은 현재 표현에서 A를 선택한 경우와 B를 선택한 경우의 다음 표현이 달라지는 원문 Figure3를 작은 두 token에 대응합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Better & Faster Large Language Models via Multi-token Prediction v1",
      "href": "https://arxiv.org/abs/2404.19737v1",
      "note": "여러 미래를 학습한 부품이 같은 네 후보를 제안해도 검증 결과에 따라 세 개만 확정하는 serving 계약을 적용합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification (v4)",
      "href": "https://arxiv.org/html/2305.09781v4",
      "note": "본문의 직선 K 4와 tree의 여러 가지를 비교해 폭·임시 KV·경로 선택이 추가됨을 설명하고 세부 비교 글로 연결합니다."
    }
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
    {
      "kind": "보충 읽기",
      "label": "Feature list, passes:false",
      "href": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "note": "2026-10-04 원문 확인. 32개·문자열·구분자검사전완료표시금지"
    },
    {
      "kind": "보충 읽기",
      "label": "S027 + H017 summary",
      "href": "https://github.com/dik654/ojs-agents/blob/c6b0fb756aa66a33e9f0b1cd4a53c2ee1202a618/products/office-secretary/experiments/MODEL_SIZE_DECISION.md",
      "note": "2026-10-04 원문 확인. 원문인증열람확인,32PING측정과일반성능한계"
    },
],
  "ai/agent-run-contract": [
    {
      kind: "공식 문서",
      label: "OpenAI Agents SDK — Guardrails and human review",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "Input/output/tool guardrail과 side effect 전 human approval의 공식 runtime control 경계",
    },
    {
      "kind": "보충 읽기",
      "label": "The structure of an evaluation, outcome",
      "href": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      "note": "2026-10-04 원문 확인. v2 페이지의 실제 폭·버튼 상태"
    },
],
  "ai/agent-verification": [
    {
      kind: "공식 문서",
      label: "OpenAI Agents SDK — Guardrails and human review",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "결정적 guardrail·승인·runtime observation을 model 판단과 분리하는 근거",
    },
    {
      "kind": "보충 읽기",
      "label": "Types of graders, binary all graders must pass",
      "href": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      "note": "2026-10-04 원문 확인. 26/27과 0.7의 서로 다른 판정"
    },
],
  "ai/harness-failure-ablation": [
    {
      kind: "공식 문서",
      label: "Anthropic — Harness design for long-running apps",
      href: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      note: "planner·generator·evaluator 구조와 구성 요소 ablation",
    },
    {
      "kind": "보충 읽기",
      "label": "harness-failure-ablation — Iterating on the harness, 2026-03-24",
      "href": "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      "note": "2026-10-04 원문 확인. 같은 fixture에서 문서 안내 변경 하나의 기여와 회귀를 비교"
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
    {
      "kind": "보충 읽기",
      "label": "When to use agents",
      "href": "https://www.anthropic.com/engineering/building-effective-agents",
      "note": "2026-10-04 원문 확인. 파일 선택과 고정 검사·반영 권한 분리"
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
    {
      "kind": "공식 문서",
      "label": "PTX ISA 9.0·CUDA 13.0.2·tcgen05.mma Examples와 Target ISA Notes",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#tcgen05-mma-instructions-mma",
      "note": "본문의 tmem-official-source 절에 공식 MMA와 commit·parity wait 발췌를 CodeSidebar로 보존했습니다. sm_100a 계열의 지원을 sm_120으로 일반화하지 않습니다."
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
  "blockchain/hyperliquid": [
    {
      "kind": "공식 문서",
      "label": "Hyperliquid Python SDK · pinned 2fdb18f",
      "href": "https://github.com/hyperliquid-dex/hyperliquid-python-sdk/tree/2fdb18f9517675ea03695a0962bd19eece9c83f0",
      "note": "원본 파일과 MIT 라이선스를 보존했습니다. 예제 ETH0.2·1100은 testnet이며 이 글의 BTC 사례와 구분합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · Fees",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · HyperEVM",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · USDC",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/usdc",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · Liquidations",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · HIP-3",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · Interacting with HyperCore",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · HIP-4",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-4-outcome-markets",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Hyperliquid · HIP-4 deployer actions",
      "href": "https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/hip-4-deployer-actions",
      "note": "2026-10-04 확인. HIP-4 기능·네트워크·수수료 문구 충돌은 본문에서 한계를 명시합니다."
    }
  ],
  "blockchain/robinhood-chain-blob-demand": [
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Connecting",
      "href": "https://docs.robinhood.com/chain/connecting/",
      "note": "2026-10-04 공식 네트워크와 DA 설명. 사용량 기여 비율의 관측 근거와 구분합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "go-ethereum · pinned c9a2bc7 config.go",
      "href": "https://github.com/ethereum/go-ethereum/blob/c9a2bc73c847319a8faa57de59e42c0efc420682/params/config.go",
      "note": "정확한 commit과 원본 파일을 보존했습니다. 클라이언트 설정은 사용량 측정의 대체물이 아닙니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7892 · BPO",
      "href": "https://eips.ethereum.org/EIPS/eip-7892",
      "note": "BPO 메커니즘. EIP의 예시 timestamp는 실제 메인넷 일정으로 쓰지 않습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-8070 · Sparse Blobpool",
      "href": "https://eips.ethereum.org/EIPS/eip-8070",
      "note": "Review 상태·전체 제공 확률·custody 표본·공격 가정의 원문입니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7773 · Glamsterdam meta",
      "href": "https://eips.ethereum.org/EIPS/eip-7773",
      "note": "2026-10-04 Networking 목록과 메인넷 activation 미정 상태를 확인했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 규격",
      "label": "EIP-7918 · Blob base fee bounded by execution cost",
      "href": "https://eips.ethereum.org/EIPS/eip-7918",
      "note": "2026-10-04 Final 원문. 실행 비용 하한 분기가 작동하지 않을 때만 초과량 0→4→0 계산을 적용하며, 첫 18개에 하한 분기가 작동하면 환산 초과량은 6입니다."
    }
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
    { kind: "핵심 논문", label: "Uniswap v2 Core whitepaper", href: "https://app.uniswap.org/whitepaper.pdf", note: "Constant product·price accumulator·flash swap·optional protocol fee의 공식 설계" },
    { kind: "공식 코드", label: "Uniswap v2-core v1.0.1 @ 4dd59067c76d", href: "https://github.com/Uniswap/v2-core/tree/4dd59067c76dea4a0e8e4bfdda41877a6b16dedc", note: "Pair mint/burn/swap·adjusted K·sqrt(k) fee mint를 고정한 source snapshot" },
    {
      "kind": "보충 읽기",
      "label": "Uniswap v2-core v1.0.1 · resolved commit",
      "href": "https://github.com/Uniswap/v2-core/blob/4dd59067c76dea4a0e8e4bfdda41877a6b16dedc/contracts/UniswapV2Pair.sol",
      "note": "annotated tag object d2bfbb3의 실제 commit은4dd5906입니다. swap·mint·_mintFee·_update를 실제 패널로 대조합니다."
    },
    {
      "kind": "보충 읽기",
      "label": "Uniswap v2-periphery · pinned quote and Router",
      "href": "https://github.com/Uniswap/v2-periphery/tree/ed24991304291297c3b4a52818d02f46a17aa9a2",
      "note": "getAmountOut과 Router02의 입력 전달·최저수령량 검사 경로를 고정했습니다."
    },
    {
      "kind": "보충 읽기",
      "label": "Uniswap v2 Core whitepaper · official PDF",
      "href": "https://app.uniswap.org/whitepaper.pdf",
      "note": "기존 docs.uniswap.org/whitepaper.pdf는404여서 실제 열리는 공식 PDF로 정정합니다."
    },
],
  "blockchain/uniswap-v3": [
    { kind: "핵심 논문", label: "Uniswap v3 Core whitepaper", href: "https://uniswap.org/whitepaper-v3.pdf", note: "Concentrated liquidity·ticks·fee growth·oracle의 공식 설계" },
    { kind: "공식 코드", label: "Uniswap v3-core v1.0.0 @ ef64f51d0f0d", href: "https://github.com/Uniswap/v3-core/tree/ef64f51d0f0dca5346c903484f3e6a771dd69d59/contracts", note: "Pool·TickMath·SqrtPriceMath·SwapMath의 exact rounding·transition snapshot" },
  ],
  "blockchain/aave-v3": [
    { kind: "공식 코드", label: "Aave DAO aave-v3-origin @ cff15de6d127", href: "https://github.com/aave-dao/aave-v3-origin/tree/cff15de6d1271b0c800fc001f4aea4c263e8a597", note: "V3.1–3.x Pool·reserve index·rate·HF·liquidation·mode source snapshot" },
    { kind: "공식 문서", label: "Aave V3 introduction", href: "https://aave.com/help/aave-101/introduction-to-aave", note: "공급·aToken·utilization·overcollateralized borrow·liquidation의 공식 사용자 경계" },
    {
      "kind": "보충 읽기",
      "label": "Aave Origin cff15de6 · TokenMath floor/ceil accounting",
      "href": "https://github.com/aave-dao/aave-v3-origin/blob/cff15de6d1271b0c800fc001f4aea4c263e8a597/src/contracts/protocol/libraries/helpers/TokenMath.sol",
      "note": "getATokenBalance의내림과getVTokenBalance의올림을1050·7560사례와대조합니다."
    },
    {
      "kind": "보충 읽기",
      "label": "Aave Origin cff15de6 · MathUtils actual return",
      "href": "https://github.com/aave-dao/aave-v3-origin/blob/cff15de6d1271b0c800fc001f4aea4c263e8a597/src/contracts/protocol/libraries/math/MathUtils.sol",
      "note": "79–83행의실제3차반환식을ray정수로검산합니다.주석의binomial표현을정확한지수계산으로해석하지않습니다."
    },
],
  "blockchain/compound-v3": [
    { kind: "공식 코드", label: "Compound Finance Comet @ f766f51583c2", href: "https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804", note: "Signed principal·indexes·rate curves·factors·absorb·collateral sale source snapshot" },
    { kind: "공식 문서", label: "Compound III documentation", href: "https://docs.compound.finance/", note: "Deployment artifact·single-base market·proxy integration의 공식 기준" },
    { kind: "공식 문서", label: "Compound III liquidation", href: "https://docs.compound.finance/liquidation/", note: "Reserve-funded absorb·buyCollateral·discount quote의 공식 interface" },
  ],
  "crypto/crypto-primitives": [
    {
      "kind": "공식 문서",
      "label": "RFC 9162 · 2.1절",
      "href": "https://www.rfc-editor.org/rfc/rfc9162.html#section-2.1",
      "note": "원문의 잎·내부 노드 태그와 경로 순서를 읽고 자체 영수증 인코딩에 대입했습니다. 실제 CT 전송 형식 구현과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Poseidon · USENIX Security 2021",
      "href": "https://www.usenix.org/system/files/sec21-grassi.pdf",
      "note": "PDF 522–524쪽의 스펀지·라운드·행렬 조건을 읽었습니다. F₁₇의 한 라운드와 289전수는 별도의 설명 모형입니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIP 340 · 규격 대조",
      "href": "https://bips.dev/340/",
      "note": "서명·검증·메시지 길이 및 용도 구분을 읽었습니다. 참조 구현 실행이나 작은 군과 실제 출력의 동일성을 주장하지 않습니다."
    },
    {
      "kind": "공식 코드",
      "label": "RFC 8032 · 6절 출판본과 공식 벡터",
      "href": "https://www.rfc-editor.org/rfc/rfc8032.html#section-6",
      "note": "원문 코드 문장을 보존하고 공식 벡터와 47바이트 영수증을 Python3.9.6에서 실행했습니다. 원문과 별도 길이·등록 키 정책을 구분합니다."
    },
    {
      "kind": "공식 문서",
      "label": "RFC 8032 · Verified Erratum 5930",
      "href": "https://www.rfc-editor.org/errata/eid5930",
      "note": "공식 HTML과 errata JSON의 Verified 상태 및 missing raise 수정을 읽었습니다. 정상 서명 뒤 00을 붙인 65바이트 입력의 원문 통과와 길이 보완 후 거부를 재현했습니다."
    }
  ],
  "crypto/csprng": [
    { kind: "공식 규격", label: "NIST SP 800-90A Rev.1 · DRBG", href: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final", note: "Hash/HMAC/CTR_DRBG instantiate·generate·reseed state-transition 정본" },
    { kind: "공식 규격", label: "NIST SP 800-90B · Entropy Sources", href: "https://csrc.nist.gov/pubs/sp/800/90/b/final", note: "Noise-source min-entropy·conditioning·health-test validation 정본" },
    { kind: "핵심 논문", label: "Mining Your Ps and Qs · USENIX Security 2012", href: "https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger", note: "낮은 entropy가 실제 TLS·SSH key compromise로 이어진 관측 범위" },
    {
      "kind": "공식 문서",
      "label": "NIST SP 800-90A Rev.1 · Deterministic Random Bit Generators",
      "href": "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final",
      "note": "Rev.1 §§10.1.2.2–10.1.2.5의 K·V 갱신을 한 바이트 입력에 적용해 두 출력을 재현했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "RFC 6979 · Deterministic DSA/ECDSA",
      "href": "https://www.rfc-editor.org/rfc/rfc6979.html",
      "note": "§2.4의 서명식에 작은 곡선의 두 서명을 적용해 같은 k=3과 d=7 복원을 검산합니다."
    },
],
  "crypto/discrete-log": [
    { kind: "핵심 논문", label: "Pollard · Monte Carlo Methods for Index Computation", href: "https://doi.org/10.1090/S0025-5718-1978-0491431-9", note: "Collision walk로 작은 memory와 expected O(√q)를 만드는 rho 원문" },
    { kind: "핵심 논문", label: "Shanks · Class number, a theory of factorization, and genera", href: "https://www.ams.org/books/pspum/020/", note: "Baby-step/giant-step meet-in-the-middle의 고전적 출처와 범위" },
    {
      "kind": "보충 읽기",
      "label": "Handbook of Applied Cryptography §3.6 Algorithm 3.56",
      "href": "https://cacr.uwaterloo.ca/hac/about/chap3.pdf",
      "note": "p.105의 실제 BSGS 반환식에 g=3·Y=5·q=16 사례를 대입합니다."
    },
],
  "crypto/diffie-hellman": [
    {
      "kind": "공식 문서",
      "label": "Diffie & Hellman · New Directions in Cryptography",
      "href": "https://ee.stanford.edu/~hellman/publications/24.pdf",
      "note": "649쪽 식 (7)~(12)에 q=23, α=5, Xᵢ=6, Xⱼ=15를 대입해 공유값 2를 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "RFC 7748 · X25519 and X448",
      "href": "https://www.rfc-editor.org/rfc/rfc7748.html",
      "note": "§§5·6.1·7의 바이트 규칙과 공식 벡터를 확인하고 Node v24.13.0에서 공개값 둘·공유값 양쪽을 재현했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "RFC 5869 · HKDF",
      "href": "https://www.rfc-editor.org/rfc/rfc5869.html",
      "note": "§§2–3의 추출·확장과 info 의미를 확인하고 부록 A.1의 PRK·42바이트 출력을 실제 계산했습니다."
    },
    { kind: "공식 규격", label: "NIST SP 800-56A Rev. 3", href: "https://doi.org/10.6028/NIST.SP.800-56Ar3", note: "Discrete-log key establishment의 domain/key validation·derivation·confirmation 범위; 2026 update planning note와 함께 확인" },
  ],
  "crypto/elliptic-curves": [
    {
      "kind": "공식 문서",
      "label": "SEC 1 v2.0 · 덧셈·점 변환·공개키 검사",
      "href": "https://www.secg.org/sec1-v2.pdf",
      "note": "원문 규칙에 (5,1)과 (6,3), 03 05 및 04 05 01을 대입하고 점 변환과 공개키 항등원 거부를 구분했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "arkworks algebra · 같은 점의 고정 원문 실행",
      "href": "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c",
      "note": "361쌍·20스칼라와 원시 두 배 값을 정수 계산에 대조하고 잘못된 G1·G2, 검사 유무와 두 전체 페어링 관계를 실제 실행했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-196 · G1 덧셈·스칼라 입력 규칙",
      "href": "https://eips.ethereum.org/EIPS/eip-196",
      "note": "직접 작성한 ECADD 모형에 빈 입력·64바이트·초과 바이트·p 좌표를 넣고, 라이브러리 G1의 r+1배를 확인했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-197 · 페어링 입력과 결과",
      "href": "https://eips.ethereum.org/EIPS/eip-197",
      "note": "규격을 읽어 64바이트가 유효한 ECADD 예와 페어링의 길이 실패를 대조했습니다. 두 전체 페어링 수학 관계는 별도 Ark 실행으로 확인했습니다."
    }
  ],
  "crypto/field-arithmetic": [
    {
      "kind": "공식 코드",
      "label": "arkworks algebra v0.5.0 finite-field source snapshot",
      "href": "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src",
      "note": "from_bigint·mul_assign·into_bigint에 같은 7×5를 적용하고 실제 빌드로 확인했습니다. 역원 0·입력 17·교차체 5·reader에 남은 99도 실행했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Montgomery · Modular Multiplication Without Trial Division",
      "href": "https://doi.org/10.1090/S0025-5718-1985-0777282-X",
      "note": "519–520쪽의 REDC에 p=17, R=32, T=21을 넣고 m=27, u=15와 출력 1을 계산했습니다. 범위 증명과 입력 변환도 대조했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-197 · alt_bn128 pairing precompile",
      "href": "https://eips.ethereum.org/EIPS/eip-197",
      "note": "생성점 (1,2)의 좌표식을 대입하고 서로 다른 p와 q, 작은 5의 유효성과 타입 구분, 바이트 순서를 설명했습니다."
    }
  ],
  "crypto/extension-fields": [
    {
      "kind": "공식 코드",
      "label": "arkworks algebra · BN254 설정과 공통 연산",
      "href": "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/curves/bn254/src/fields",
      "note": "A·B의 출력 [6,28], 두 중간 곱과 전용 함수에 실제 값을 넣었습니다. --locked Rust 실행으로 144개 기저 곱·16개 추가 곱·15개 Frobenius 직접 대조와 역원·직렬화를 확인했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-197 · Definition of groups와 Encoding",
      "href": "https://eips.ethereum.org/EIPS/eip-197",
      "note": "6+28u를 a·i+b로 대응시켜28·6의 전송 순서를 만들고 내부6·28순서와 비교했습니다."
    }
  ],
  "crypto/finite-field-theory": [
    {
      "kind": "공식 문서",
      "label": "NIST FIPS 186-5: Digital Signature Standard",
      "href": "https://csrc.nist.gov/pubs/fips/186-5/final",
      "note": "유한체 예제와 승인된 서명 설정을 구분하며 Appendix D의 변경 사항에 따라 기존 범위 설명을 교정했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Fast Probabilistic Algorithms for Verification of Polynomial Identities",
      "href": "https://doi.org/10.1145/322217.322225",
      "note": "원문 Lemma1·Corollary1의 Q와 I에 x²−1과 F7을 대응해 2/7을 계산하고 최고차항 계수에 대한 귀납을 설명했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Handbook of Applied Cryptography · Chapter2",
      "href": "https://cacr.uwaterloo.ca/hac/about/chap2.pdf",
      "note": "3×(−2)+7=1에서 역원 5를 얻고 (u+2)(u+1)+2(u²+1)=1 mod3으로 확장체 역원을 확인합니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "NIST DLMF §3.3: Interpolation",
      "href": "https://dlmf.nist.gov/3.3",
      "note": "식3.3.1·3.3.2에 n=2, 위치 0·1·2, 값 1·4·9를 대입해 같은 2차 식을 만듭니다."
    },
    {
      "kind": "공식 문서",
      "label": "Barycentric Lagrange Interpolation",
      "href": "https://people.maths.ox.ac.uk/trefethen/barycentric.pdf",
      "note": "저자 사이트 원문 식(3.2)·(4.1)·(4.2)에 위치 0·1·2, 값 1·4·9, 새입력 3을 넣어 무게 9·16·9와 분자 14·분모 3의 결과 16을 확인합니다."
    },
],
  "crypto/fft": [
    {
      "kind": "공식 문서",
      "label": "The Fast Fourier Transform in a Finite Field",
      "href": "https://doi.org/10.1090/S0025-5718-1971-0301966-0",
      "note": "원문 식 (1)~(3)의 d4, r4, GF17, d′4와 역배율 −d′13을 같은 네 계수에 대입했습니다. §3(i)의 길이 조건과 §3(ii)의 정수 복원 경계도 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "An Algorithm for the Machine Calculation of Complex Fourier Series",
      "href": "https://doi.org/10.1090/S0025-5718-1965-0178586-1",
      "note": "원문 식 (3), (6), (7)에 N4, r1=r2=2를 넣고 유한체 근 4에서 보조 배열 [[4,6],[15,15]]가 같은 출력으로 결합됨을 계산했습니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "Reed & Solomon · Polynomial Codes over Certain Finite Fields",
      "href": "https://doi.org/10.1137/0108018",
      "note": "원문 300~301쪽의 계수와 평가, Vandermonde 독립성에 같은 2·3과 위치 1·3 복원을 대응했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "RFC 5510 · Reed-Solomon FEC",
      "href": "https://www.rfc-editor.org/rfc/rfc5510.html",
      "note": "§8.2.1의 G=Vkk⁻¹V와 §8.3.1의 받은 열 복원 구조를 F7 사례에서 계산해 같은 [2,5,1,4]를 만들고 [5,4]에서 [2,5]를 복원합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Fast Reed-Solomon Interactive Oracle Proofs of Proximity",
      "href": "https://doi.org/10.4230/LIPIcs.ICALP.2018.14",
      "note": "§1의 RS[F,S,ρ]에 N4, ρ1/2, 같은 네 기록을 대응해 거리 0과 1/4를 구분했습니다."
    },
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
    {
      "kind": "공식 문서",
      "label": "EIP-7701 · Native Account Abstraction",
      "href": "https://eips.ethereum.org/EIPS/eip-7701",
      "note": "Withdrawn proposal의 validation·execution·paymaster frame을 ERC-4337·EIP-7702와 비교하는 설계 범위"
    },
    {
      "kind": "공식 코드",
      "label": "Account abstraction original contracts 1c6b669",
      "href": "https://github.com/eth-infinitism/account-abstraction/tree/1c6b669d0eea734e09a87e095ba15e076151718a/contracts",
      "note": "40개를 보내는 7번 요청과 0.003 ETH 예약을 원문 코드에 대응합니다."
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
    {
      "kind": "공식 문서",
      "label": "HAC · ElGamal 알고리즘 8.17–8.18, 8.26",
      "href": "https://cacr.uwaterloo.ca/hac/about/chap8.pdf",
      "note": "γ=17, δ=5, p−1−a=16을 넣어 역원 2와 메시지 10을 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Boneh–Shoup v0.6 · 연습문제 11.5–11.6",
      "href": "https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf",
      "note": "작은 사례의 제곱 값 구분과 변조를 별도 계산해 가정의 필요성을 설명합니다."
    },
],
  "crypto/mpc": [
    { kind: "공식 코드", label: "bnb-chain/tss-lib @ 3f677ff", href: "https://github.com/bnb-chain/tss-lib/tree/3f677ff761fcf692edb0243a5d812930844d879a", note: "Threshold DKG/MtA/VSS implementation의 pinned source" },
  ],
  "crypto/shamir-secret-sharing": [
    { kind: "핵심 논문", label: "Shamir · How to Share a Secret", href: "https://doi.org/10.1145/359168.359176", note: "Threshold polynomial sharing의 primary paper" },
    {
      "kind": "공식 문서",
      "label": "Shamir (1979) · How to Share a Secret, §2",
      "href": "https://web.mit.edu/6.857/OldStuff/Fall03/ref/Shamir-HowToShareASecret.pdf",
      "note": "§2의 D=5,n=3,k=2,p=17,q(x)=5+3x를 조각 8·11·14와 복원식에 직접 대응합니다."
    },
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
    {
      "kind": "공식 코드",
      "label": "a16z/jolt · ADD LookupQuery, commit47130f3",
      "href": "https://github.com/a16z/jolt/blob/47130f3dc9a51a7ac2754a98ff0aa31981a6b810/crates/jolt-lookup-tables/src/instructions/riscv/add.rs",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "a16z/jolt · read_write_checking_input, commit47130f3",
      "href": "https://github.com/a16z/jolt/blob/47130f3dc9a51a7ac2754a98ff0aa31981a6b810/crates/jolt-claims/src/twist/memory_checking.rs",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Twist and Shout: Faster memory checking arguments via one-hot addressing and increments",
      "href": "https://eprint.iacr.org/2025/105.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Jolt: SNARKs for Virtual Machines via Lookups",
      "href": "https://eprint.iacr.org/2023/1217.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Jolt complete source files · 47130f3dc9a51a7ac2754a98ff0aa31981a6b810, 2026-10-02",
      "href": "https://github.com/a16z/jolt/tree/47130f3dc9a51a7ac2754a98ff0aa31981a6b810",
      "note": "tracer ADD.exec, lookup ADD, Twist read/write check, transcript preamble 네 실제 파일과 함수 줄 범위를 로컬 CodeSidebar에서 열 수 있습니다. 이 머신의 전체 prover 실행 측정은 아닙니다."
    }
  ],
  "crypto/libiop": [
    { kind: "핵심 논문", label: "Aurora: Transparent Succinct Arguments for R1CS", href: "https://eprint.iacr.org/2018/828.pdf", note: "R1CS-to-IOP reduction과 transparent argument의 primary paper" },
    { kind: "공식 코드", label: "scipr-lab/libiop @ a2ed2ec", href: "https://github.com/scipr-lab/libiop/tree/a2ed2ec2f3e85f29b6035951553b02cb737c817a", note: "IOP·BCS components의 pinned research source" },
  ],
  "crypto/plonky3": [
    { kind: "핵심 논문", label: "Scalable, transparent, and post-quantum secure computational integrity", href: "https://eprint.iacr.org/2018/046.pdf", note: "AIR·FRI·hash-based STARK pipeline의 primary paper" },
    { kind: "공식 코드", label: "Plonky3/Plonky3 @ f5b7977", href: "https://github.com/Plonky3/Plonky3/tree/f5b7977e5c89adc8375b5c63a5a5092985b1f603", note: "Generic config·proof pipeline의 pinned official source" },
  ],
  "crypto/extension-field-theory": [
    {
      "kind": "보충 읽기",
      "label": "Lidl & Niederreiter · Finite Fields",
      "href": "https://doi.org/10.1017/CBO9780511525926",
      "note": "교재 전문을 이번 검토에서 직접 열람하지 못했습니다. 아래 실제 열람한 HAC와 고정 ark-ff 원문으로 본문의 계산을 확인했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Handbook of Applied Cryptography · §§2.5–2.6",
      "href": "https://cacr.uwaterloo.ca/hac/about/chap2.pdf",
      "note": "g=X+1,m=X²+1에 s=X+2,t=2를 넣어 sg+tm=1과 같은 역원 2+u를 계산했습니다. 탑 차수와 Frobenius의 부분체 조건도 같은 작은 구성에 적용했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "ark-ff 0.5.0 · quadratic_extension.rs",
      "href": "https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/quadratic_extension.rs",
      "note": "동일 commit 의존성과 자체 F₃/β2 설정으로 81개 곱, 여덟 역원과 아홉 Frobenius를 실제 Rust에서 확인했습니다. β1과 잘못된 표도 별도로 실행했습니다."
    }
  ],
  "crypto/pairing": [
    {
      "kind": "핵심 논문",
      "label": "Miller (1986) · Short Programs for functions on Curves",
      "href": "https://crypto.stanford.edu/miller/miller.pdf",
      "note": "저자 공개 7쪽 PDF의 실제 제목·날짜와2절을 읽었습니다. 현대 BN의 세부 지수를 이 문서에 귀속하지 않습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Ben Lynn (2007) · Tate 반복과 거듭제곱 정규화",
      "href": "https://crypto.stanford.edu/pbc/thesis.pdf",
      "note": "PDF 51–52쪽에 자체 F₁₉의101을 대입했습니다. PDF 113쪽의 서로소 거듭제곱 성질을 고정 BN의c와 연결했습니다. 원문 수치 예제 F₅₉와 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "arkworks algebra · 고정 BN 구현과 실제 CPU 검산",
      "href": "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c",
      "note": "실제 --locked 실행에서 63회 제곱/87개 선, 같은 계수의 밀집 곱, M^(cE) 일치와 M^E 불일치, c의 역수 복원, 두 쌍의 곱과0/항등원 경계를 확인했습니다."
    },
    {
      "kind": "보충 읽기",
      "label": "Hess·Smart·Vercauteren (2006) · The Eta Pairing Revisited",
      "href": "https://eprint.iacr.org/2006/110",
      "note": "공식 landing의 제목·저자·2006년 서지와 abstract만 확인했습니다. PDF 전문은 접근 오류로 읽지 못했으며 이 글의 수치·BN 구현 근거로 사용하지 않습니다."
    }
  ],
  "blockchain/vdf": [{ kind:"핵심 논문", label:"Boneh et al. · VDF", href:"https://eprint.iacr.org/2018/601.pdf", note:"VDF definitions and constructions" },{ kind:"핵심 논문", label:"Wesolowski · Efficient VDF", href:"https://eprint.iacr.org/2018/623.pdf", note:"Quotient proof construction" }],
  "blockchain/drand": [{ kind:"공식 문서", label:"drand specification", href:"https://docs.drand.love/docs/specification/", note:"Threshold beacon protocol specification" },{ kind:"공식 코드", label:"drand @ 2363f3b", href:"https://github.com/drand/drand/tree/2363f3b9ba5fd6f14e0b84a096b248479790d75d", note:"Pinned official source" }],
  "crypto/hash-theory": [
    {
      "kind": "공식 문서",
      "label": "NIST FIPS 180-4 · 2015판",
      "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf",
      "note": "5.1.1절의 abc와 인쇄 13쪽, 6.2절 인쇄 22–23쪽을 읽고 첫 라운드와 출력에 대입했습니다. 임의 프로토콜·secret-prefix 인증·구현 부채널 안전성을 보장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "NIST FIPS 202 · 2015판",
      "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf",
      "note": "3.2절과 Algorithm 7–9, 6.1–6.2절을 읽고 별도 Python 모형을 hashlib와 대조했습니다. capacity를 비밀키로 보거나 임의 매개변수의 안전성을 승인하지 않습니다."
    },
    {
      "kind": "공식 코드",
      "label": "RustCrypto hashes · f6c786d 원문",
      "href": "https://github.com/RustCrypto/hashes/tree/f6c786d72ed4d37a32dcd32daa2e7277dd4683e1",
      "note": "rustc 1.93.0에서 compact를 8입력으로 실행하고 pad/read_state를 명시한 대체 형식으로 실행했습니다. 전체 Cargo/API·CPU dispatch·실제 keccak/cursor 의존성의 실행이나 성능 측정을 주장하지 않습니다."
    }
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
    {
      "kind": "핵심 논문",
      "label": "Nova §4.1, Construction1, PDF p.15",
      "href": "https://eprint.iacr.org/2021/370.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/polycommit": [
    {
      "kind": "핵심 논문",
      "label": "Kate·Zaverucha·Goldberg §3.2, CreateWitness·VerifyEval, PDF p.7",
      "href": "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Bulletproofs (2017/1066) · §3, PDF p.13, inner-product argument",
      "href": "https://eprint.iacr.org/2017/1066.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Halo: Recursive Proof Composition without a Trusted Setup",
      "href": "https://eprint.iacr.org/2019/1021.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/fri": [
    {
      "kind": "핵심 논문",
      "label": "Fast Reed–Solomon IOP of Proximity · §1, PDF p.2",
      "href": "https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "WHIR · Abstract 및 §1, 2024-11-21 개정본",
      "href": "https://eprint.iacr.org/2024/1586.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/stark-theory": [
    {
      "kind": "핵심 논문",
      "label": "Scalable, transparent, and post-quantum secure computational integrity · AIR 정의, PDF p.36",
      "href": "https://eprint.iacr.org/2018/046.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/zk-theory": [
    {
      "kind": "공식 규격",
      "label": "RFC8235 §2.2, pp.4–5 · 원문의 응답·검증 표기",
      "href": "https://www.rfc-editor.org/rfc/rfc8235",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Kate·Zaverucha·Goldberg · Constant-Size Commitments to Polynomials, PDF p.1",
      "href": "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Goldwasser·Micali·Rackoff · The Knowledge Complexity of Interactive Proof Systems",
      "href": "https://doi.org/10.1137/0218012",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Fiat·Shamir · How To Prove Yourself (1986)",
      "href": "https://doi.org/10.1007/3-540-47721-7_12",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/constraint-systems": [
    {
      "kind": "핵심 논문",
      "label": "Pinocchio §2.2.1, Definition2, PDF p.3",
      "href": "https://eprint.iacr.org/2013/279.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Nova §4, Definition10, PDF p.13",
      "href": "https://eprint.iacr.org/2021/370.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/snark-overview": [
    {
      "kind": "핵심 논문",
      "label": "Groth · On the Size of Pairing-based Non-interactive Arguments, §2.2, PDF pp.7–8",
      "href": "https://eprint.iacr.org/2016/260.pdf",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Ben-Sasson et al. · SNARKs for C (2013)",
      "href": "https://eprint.iacr.org/2013/507",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "RFC 8017 §5.1.2 · 두 소수 RSADP",
      "href": "https://www.rfc-editor.org/rfc/rfc8017.html#section-5.1.2",
      "note": "§5.1.2 Step2.b의 m1·m2·h·m에 입력18을 넣어3·2·3·23을 재현했습니다."
    },
],
  "crypto/karatsuba": [
    {
      "kind": "보충 읽기",
      "label": "Karatsuba & Ofman · Multiplication of many-digital numbers",
      "href": "https://www.mathnet.ru/eng/dan26729",
      "note": "1962 논문의 서지 정보만 확인했습니다. PDF 접근 오류로 전문을 읽지 못했으므로 본문의 식·증명·구현 주장은 GMP 공식 문서와 배포 코드에서 확인한 범위로 제한합니다."
    },
    {
      "kind": "공식 문서",
      "label": "GNU MP 6.3.0 · Karatsuba Multiplication",
      "href": "https://gmplib.org/manual/Karatsuba-Multiplication",
      "note": "차의 곱 484를 높은 곱 672와 낮은 곱 2652의 합에서 빼 교차항 2840을 얻습니다. 합의 추가 자리와 실제 전환 크기의 범위를 구분합니다."
    },
    {
      "kind": "공식 코드",
      "label": "GNU MP 6.3.0 공식 배포 · mpn/generic/toom22_mul.c",
      "href": "https://ftp.gnu.org/gnu/gmp/gmp-6.3.0.tar.xz",
      "note": "공식 배포의 전체 C 원문·라이선스·SHA256을 보관했습니다. 두 64비트 자리의 [34,12]와 [78,56]을 분할·부호·세 곱·합산 순서에 대입했습니다. 실제 C 실행은 하지 않았습니다."
    }
  ],
  "crypto/sparse-multiplication": [
    {
      "kind": "공식 코드",
      "label": "arkworks algebra · 고정 희소 곱과 BN Miller 호출",
      "href": "https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs",
      "note": "실제 --locked Rust에서 36개 기저 곱·32개 추가 입력·0과 1 및 틀린 위치를 대조했습니다. 생성원의 같은 준비된 선 87개를 직접 다항식으로 곱한 Miller 누적이 원본과 일치했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Grewal et al. · Efficient Implementation of Bilinear Pairings on ARM Processors",
      "href": "https://eprint.iacr.org/2012/408",
      "note": "공식 PDF 3.1절 Algorithms 5·6을 읽고 5·7·11과 같은 A를 넣어 세 중간 묶음 및 아래 14·50·44를 대조했습니다."
    }
  ],
  "crypto/frobenius-optimization": [
    {
      "kind": "공식 코드",
      "label": "arkworks algebra · 고정 Frobenius와 일반 pow 원문",
      "href": "https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields",
      "note": "보존한 원문 9개 파일을 실제 Cargo checkout과 바이트 비교했습니다. --locked Rust 실행으로 아홉 작은 값·81쌍·기저 변경 및 큰 M의 직접 pʲ제곱과 전체 지수 분해를 확인했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Scott et al. · On the final exponentiation · §§3,5",
      "href": "https://eprint.iacr.org/2008/490",
      "note": "공식 PDF 본문의 3·5절을 읽고 같은 실제 BN254 z를 p·r·λ 다항식에 넣어 H와 대조했습니다. 일반 거듭제곱으로 네 항의 곱과 전체 지수가 같음을 실제 실행했습니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "NVIDIA cuda-samples v13.0·3f1c509·49 –52 행",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "NVIDIA cuda-samples v13.0·3f1c509·49 –52 행"
    },
    {
      "kind": "공식 문서",
      "label": "CUDA C++ Programming Guide13.0.2 ·SIMT architecture",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html",
      "note": "CUDA C++ Programming Guide13.0.2 ·SIMT architecture"
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA Blackwell Tuning Guide13.0.2",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/blackwell-tuning-guide/index.html",
      "note": "Data center Blackwell과 compute capability별 자원·지원 조건을 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "PTX ISA 9.0 · WGMMA·tcgen05",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html",
      "note": "4 warps의 WGMMA 협력 범위, Tensor Memory의 칩 내부 저장 역할, tcgen05 명령별 Target ISA Notes를 대조합니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "CUDA Best Practices13.0.2 §11.1.1",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html#calculating-occupancy",
      "note": "Thread당 저장량이 같아도 block 크기가 배치를 바꾸는 문제입니다. CC 7.0의 37 registers/thread와 두 block 크기에 대한 공식 자원 계산 예제입니다. 다른 세대의 공통 상수나 속도 배수를 보장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Programming Guide13.0.2",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html",
      "note": "저장 자원과 배치 및 local 주소 공간의 경계를 설명합니다. 문서에 명시한 의미와 API의 범위입니다. 모든 local byte를 DRAM 시간으로 바꾸지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Nsight Compute Profiling Guide",
      "href": "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#sections-and-rules",
      "note": "관측한 active 상태가 배치 상한과 다른 이유를 살핍니다. 각 metric의 정의와 수집 조건입니다. 단일 counter만으로 원인을 확정하지 않습니다."
    },
    {
      "kind": "공식 코드",
      "label": "cuda-samples v13.0 simpleOccupancy",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/simpleOccupancy/simpleOccupancy.cu",
      "note": "API의 block 수 출력을 warp 비율로 연결합니다. 고정 원문 전체와 배치 비율·launch·square 함수의 실제 줄 범위입니다. 실제 sample을 37 registers로 컴파일하거나 GPU 시간을 측정한 결과가 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "PTX ISA9.0 shared-memory spilling",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#pragma-strings-enable-smem-spilling",
      "note": "Register 밖에 둔 값의 저장 경로를 선택합니다. 정식 pragma와 적용 범위입니다. CC 7.0 지원이나 속도 개선을 보장하지 않습니다."
    }
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
    {
      "kind": "공식 연구",
      "label": "EF zkEVM · On Formal Verification and a Bug in SP1 Hypercube (2026-05-20)",
      "href": "https://zkevm.ethereum.foundation/blog/sp1-fv",
      "note": "JALR 100+1→100 장난감 사례로 과거 completeness bug와 정리의 h_valid_pc 전제를 구분했습니다. EF 보고서상 v6.1.0 수정 통보이며 현재 고정 v6.4.0에 같은 버그가 남았다는 주장이 아닙니다."
    },
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
    {
      "kind": "공식 규격",
      "label": "ERC-4337 · Account Abstraction Using Alt Mempool",
      "href": "https://eips.ethereum.org/EIPS/eip-4337",
      "note": "현재 원문의 EIP-712·nonce·검증·실행·예치금 정산 범위입니다. ML-DSA 구현·native precompile·bundler 수락과 송금 성공을 제공하지 않습니다."
    },
    {
      "kind": "공식 규격",
      "label": "NIST FIPS 204 · ML-DSA",
      "href": "https://csrc.nist.gov/pubs/fips/204/final",
      "note": "본 글은 ML-DSA-44 공개키1312바이트와 서명2420바이트 및 표준 범위를 사용합니다. EVM 통합·gas·복구 권한·구현 인증과 전체 계정 안전을 보장하지 않습니다."
    },
    {
      "kind": "공식 규격",
      "label": "ERC-7562 · Account Abstraction Validation Scope Rules",
      "href": "https://eips.ethereum.org/EIPS/eip-7562",
      "note": "오프체인 제출 수락과 검증 범위의 조건에 한정한 원문 근거입니다. 모든 verifier의 실행 안전이나 모든 bundler의 PQ 지원을 인증하지 않습니다."
    },
    {
      "kind": "공식 규격",
      "label": "NIST CSWP 39upd1 · Crypto Agility",
      "href": "https://csrc.nist.gov/pubs/cswp/39/upd1/considerations-for-achieving-crypto-agility/final",
      "note": "암호 교체의 운영 원칙과 downgrade 위험을 계정의 같은 송금 사례에 적용합니다. 특정 블록체인 계정의 안전한 이전이나 AND 정책의 보편적 최적성을 증명하지 않습니다."
    },
    {
      "kind": "공식 코드",
      "label": "eth-infinitism/account-abstraction · pinned 1c6b669",
      "href": "https://github.com/eth-infinitism/account-abstraction/tree/1c6b669d0eea734e09a87e095ba15e076151718a",
      "note": "실제 EIP-712·계정 검증·EntryPoint nonce·실행 실패·deposit 환급 경로를 읽었습니다. SimpleAccount는 ECDSA 예제이며 배포된 ML-DSA 계정이 아닙니다."
    }
  ],
  "blockchain/stablecoin-overview": [
    { kind: "공식 문서", label: "FSB · Global Stablecoin Recommendations", href: "https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/", note: "발행·상환·안정화·transfer·governance 기능을 arrangement로 읽는 2023 공식 권고이며 특정 token safety 보장은 아님" },
    { kind: "핵심 연구", label: "BIS Working Paper 905 · Stablecoins", href: "https://www.bis.org/publ/work905.htm", note: "Backing·governance·settlement·liquidity risk 비교 근거이며 2026 issuer 상태·regulatory approval을 뜻하지 않음" },
    {
      "kind": "보충 읽기",
      "label": "Circle USDC Terms · direct redemption eligibility",
      "href": "https://www.circle.com/legal/usdc-terms",
      "note": "2025-12-12 개정, 2026-10-04 확인. §2·§14 Type A/B와 상환 자격을 같은 숫자 사례에 적용합니다. EEA 별도 약관."
    },
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
    {
      "kind": "공식 문서",
      "label": "Securitize · BlackRock BUIDL launch",
      "href": "https://investors.securitize.io/news/news-details/2024/BlackRock-Launches-Its-First-Tokenized-Fund-BUIDL-on-the-Ethereum-Network-03-20-2024/default.aspx",
      "note": "공식 출시 발표의 투자 대상·역할·지급 방식·초기 자격 조건입니다. 현재 청약에는 최신 발행 문서를 다시 확인합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Circle · BUIDL USDC transfer contract, 2024-04-11",
      "href": "https://www.circle.com/pressroom/circle-announces-usdc-smart-contract-for-transfers-by-blackrocks-buidl-fund-investors",
      "note": "지분을 Circle에 넘기고 USDC를 받는 교환 구조입니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Uniswap Labs · BUIDL liquidity, 2026-02-11",
      "href": "https://blog.uniswap.org/unlocking-defi-liquidity-for-buidl",
      "note": "자격·허용 목록·RFQ 상대방·원자적 결제를 확인했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Circle · Tokenizing and redeeming USDC",
      "href": "https://help.circle.com/support/en/tokenizing-and-redeeming-usdc?id=kb_article_view&sysparm_article=KB0010781",
      "note": "USDC 소각과 은행 송금은 별도의 상환 절차입니다. 확인일2026-10-04."
    }
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
    {
      "kind": "공식 문서",
      "label": "EIP-7773 · Glamsterdam",
      "href": "https://eips.ethereum.org/EIPS/eip-7773",
      "note": "2026-10-04 확인: Review 상태, Sepolia 일정과 비어 있는 Hoodi·Mainnet 활성화 항목. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7723 · Network upgrade inclusion stages",
      "href": "https://eips.ethereum.org/EIPS/eip-7723",
      "note": "확인일 Last Call. 문서의 EIP 상태와 특정 업그레이드의 포함 단계가 다름을 설명합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7773 · Scheduled EIPs and activation",
      "href": "https://eips.ethereum.org/EIPS/eip-7773",
      "note": "목록과 활성화 표를 함께 읽어 포함 의도와 실행 여부를 연결합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-8081 · Hegotá",
      "href": "https://eips.ethereum.org/EIPS/eip-8081",
      "note": "Draft와 SFI·CFI·PFI 목록, 비어 있는 활성화 표를 확인했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Ethereum · Hegotá roadmap",
      "href": "https://ethereum.org/roadmap/hegota/",
      "note": "2027년2분기는 예상 일정입니다. 확인일 이후 변경될 수 있습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Lean Consensus R&D Progress",
      "href": "https://leanroadmap.org/",
      "note": "형식 검증의 연구 목표와 개별 작업 범위를 확인하는 자료입니다. 완료된 전체 시스템 증명으로 확대하지 않습니다. 확인일2026-10-04."
    }
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
    {
      "kind": "공식 문서",
      "href": "https://scikit-learn.org/stable/common_pitfalls.html#data-leakage",
      "note": "2026-10-04 확인. Test를 선택에 쓰지 않는 실제 문구와 train-only 전처리 원칙을 800/200/200명 사례에 적용합니다.",
      "label": "scikit-learn · Common pitfalls 12.1–12.2.1"
    },
],
  "ai/flash-attention-io-aware-kernel": [
    {
      "kind": "핵심 논문",
      "label": "FlashAttention · arXiv 2205.14135v2",
      "href": "https://arxiv.org/html/2205.14135v2",
      "note": "정리 2의 d≤M≤Nd와 원소 단위 접근량, 조각 처리 및 역전파 재계산을 확인했습니다. 저자 실험은 이 글의 GPU 재현 측정이 아닙니다."
    },
    {
      "kind": "핵심 논문",
      "label": "FlashAttention-4 · arXiv 2603.05451v1",
      "href": "https://arxiv.org/html/2603.05451v1",
      "note": "저자 비교는 BF16, head dim·sequence length와 baseline version별 kernel 측정. v1 본문은 B200, 부록 A.1은 B100으로 표기가 불일치한다. 이 글은 최고 가속비를 제품 성능 보장으로 인용하지 않는다."
    },
    {
      "kind": "공식 코드",
      "label": "FlashAttention e9515d5 · softmax.py 전체 원문",
      "href": "https://github.com/Dao-AILab/flash-attention/blob/e9515d5dee6ade134a33d6020d38d01ef0596996/flash_attn/cute/softmax.py",
      "note": "online_softmax의 lane별 부분합, finalize의 width=4 합산, rescale_O, SoftmaxSm100의 log2 단위 조건을 같은 네 점수에 대응합니다. 원문 scalar 분기의 CPU 대체 의존성 실행과 전체 GPU 실행을 구별합니다."
    }
  ],
  "ai/continuous-batching-step-anatomy": [
    { kind: "공식 코드", label: "vLLM V1 scheduler: vllm/v1/core/sched/scheduler.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py", note: "schedule() 의 running 순회·preemption·waiting admission 순서와 token_budget·long_prefill_token_threshold clipping 의 근거" },
    { kind: "공식 코드", label: "vLLM SchedulerConfig: vllm/config/scheduler.py", href: "https://github.com/vllm-project/vllm/blob/main/vllm/config/scheduler.py", note: "max_num_batched_tokens 2048·max_num_seqs 128 기본값과 long_prefill_token_threshold 0 이 상한 없음이라는 docstring 의 근거" },
    { kind: "공식 문서", label: "vLLM Optimization and Performance — Chunked Prefill", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 이 chunked prefill 을 기본으로 켜고 decode 를 먼저 batch 한 뒤 남은 budget 에 prefill 을 넣는다는 설명과 budget 크기의 ITL·TTFT 맞바꿈" },
    { kind: "선행·비교 논문", label: "Orca: A Distributed Serving System for Transformer-Based Generative Models", href: "https://www.usenix.org/conference/osdi22/presentation/yu", note: "Iteration-level scheduling 과 selective batching 의 원 논문(OSDI 2022)" },
    { kind: "핵심 논문", label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve", href: "https://arxiv.org/abs/2403.02310", note: "Chunked prefill 과 stall-free scheduling 으로 mixed batch 를 만드는 근거이며 수치는 저자 자기보고" },
    {
      "kind": "공식 코드",
      "label": "Continuous batching — v0.27.1 schedule + _update_after_schedule",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "2026-10-04 확인. 8→7→6→0; A1 B1 C6; progress reserved before forward"
    },
    {
      "kind": "공식 코드",
      "label": "Continuous batching — SchedulerOutput L192–208",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/output.py",
      "note": "2026-10-04 확인. num_scheduled_tokens A1 B1 C6, total8"
    },
    {
      "kind": "공식 코드",
      "label": "Continuous batching — ParentRequest L52–94",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/engine/parallel_sampling.py",
      "note": "2026-10-04 확인. n3 → three children n1"
    },
    {
      "kind": "핵심 논문",
      "label": "Continuous batching — p528 Algorithm1",
      "href": "https://www.usenix.org/system/files/osdi22-yu.pdf",
      "note": "2026-10-04 확인. D enters candidate pool at next iteration; different reservation policy"
    },
    {
      "kind": "핵심 논문",
      "label": "Continuous batching — §4.1 Algorithm3 lines6–20",
      "href": "https://arxiv.org/html/2403.02310v3",
      "note": "2026-10-04 확인. τ8, n_t2, chunk6 then batch total8"
    },
],
  "ai/serving-memory-admission-and-preemption": [
    { kind: "핵심 논문", label: "Efficient Memory Management for Large Language Model Serving with PagedAttention", href: "https://arxiv.org/abs/2309.06180", note: "FCFS·all-or-nothing eviction과 recompute·swap 정의, block 크기별 비교, OPT-13B token당 800 KB와 20.4~38.2% 활용률의 출처" },
    { kind: "공식 문서", label: "vLLM Optimization and Tuning — Preemption", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 기본 preemption mode RECOMPUTE와 preemption을 줄이는 설정 조정 방향" },
    { kind: "공식 문서", label: "vLLM v0.6.3 Engine Arguments", href: "https://docs.vllm.ai/en/v0.6.3/models/engine_args.html", note: "swap_space 기본 4 GiB, preemption_mode, block_size 16, gpu_memory_utilization 0.9의 V0 정의" },
    { kind: "공식 구현", label: "vLLM v0.6.3 BlockSpaceManagerV1", href: "https://github.com/vllm-project/vllm/blob/v0.6.3/vllm/core/block_manager_v1.py", note: "watermark 기본 0.01과 can_allocate의 OK·LATER·NEVER 조건" },
    { kind: "공식 문서", label: "SGLang Server Arguments", href: "https://docs.sglang.io/advanced_features/server_arguments.html", note: "mem-fraction-static·max-total-tokens·schedule-conservativeness와 retract 안내" },
    { kind: "공식 문서", label: "TensorRT-LLM KV Cache System", href: "https://nvidia.github.io/TensorRT-LLM/features/kvcache.html", note: "free_gpu_memory_fraction 기본 0.9와 host_cache_size secondary offload" },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.6.6 block_manager.py — can_allocate / _can_swap",
      "href": "https://github.com/vllm-project/vllm/blob/f49777ba62b4926d0f8c100ab06edb03c5c10098/vllm/core/block_manager.py",
      "note": "2026-10-04 확인. C9:40/14/3→OK; full blocks+append demand for swap-in"
    },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.6.6 scheduler.py — _swap_out",
      "href": "https://github.com/vllm-project/vllm/blob/f49777ba62b4926d0f8c100ab06edb03c5c10098/vllm/core/scheduler.py",
      "note": "2026-10-04 확인. CPU space failure raises RuntimeError, no recompute fallback"
    },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.6.6 arg_utils.py — swap_space",
      "href": "https://github.com/vllm-project/vllm/blob/f49777ba62b4926d0f8c100ab06edb03c5c10098/vllm/engine/arg_utils.py",
      "note": "2026-10-04 확인. 4GiB default, distinct from simultaneous swap capacity policy"
    },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.27.1 kv_cache_manager.py — allocate_slots",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_manager.py",
      "note": "2026-10-04 확인. 1000input63blocks rejects free50 before actual256chunk16 allocation"
    },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.27.1 scheduler.py — _preempt_request",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "2026-10-04 확인. C10 freed, PREEMPTED, computed0, history161 preserved"
    },
    {
      "kind": "공식 코드",
      "label": "Memory admission — v0.27.1 scheduler config — full ISL and watermark",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/config/scheduler.py",
      "note": "2026-10-04 확인. full input fit default True; watermark default0.0"
    },
    {
      "kind": "핵심 논문",
      "label": "Memory admission — PagedAttention §4.5 and §7.3",
      "href": "https://arxiv.org/html/2309.06180v1",
      "note": "2026-10-04 확인. C all-or-nothing eviction; CPU bound depends on no-new-admission policy"
    },
    {
      "kind": "공식 문서",
      "label": "Memory admission — SGLang Server Arguments — memory and scheduling",
      "href": "https://docs.sglang.io/docs/advanced_features/server_arguments",
      "note": "2026-10-04 확인. conservativeness direction; static memory includes weights and KV"
    },
    {
      "kind": "공식 문서",
      "label": "Memory admission — TensorRT-LLM KV Cache System — size and host offload",
      "href": "https://nvidia.github.io/TensorRT-LLM/features/kvcache.html",
      "note": "2026-10-04 확인. free100MiB×0.9 vs token80MiB chooses80MiB; host byte capacity"
    },
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
    {
      "kind": "공식 코드",
      "label": "Latency metrics — v0.27.1 chat streaming L374–425",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/benchmarks/lib/endpoint_request_func.py#L374-L425",
      "note": "2026-10-04 확인. 1·1.040·1.327초 수신 이벤트와 usage1.350초→latency1.350초"
    },
    {
      "kind": "공식 코드",
      "label": "Latency metrics — v0.27.1 calculate_metrics L608–616",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/benchmarks/serve.py#L608-L616",
      "note": "2026-10-04 확인. (1.327−1)/4=.08175 and raw event gaps"
    },
    {
      "kind": "공식 코드",
      "label": "Latency metrics — v0.27.1 goodput conjunction L621–642 and rates L726–754",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/benchmarks/serve.py#L621-L642",
      "note": "2026-10-04 확인. 90/60=1.5 request/s; output400 tokens/s"
    },
    {
      "kind": "보충 읽기",
      "label": "Latency metrics — Metrics table, retrieved2026-10-04",
      "href": "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html#metrics",
      "note": "2026-10-04 확인. 287ms / 3≈95.667ms and legacy tool status"
    },
    {
      "kind": "보충 읽기",
      "label": "Latency metrics — Defining Objectives and Standardize Indicators",
      "href": "https://sre.google/sre-book/service-level-objectives/",
      "note": "2026-10-04 확인. client clock, nearest-rank,5min windows,288denominator,99%"
    },
],
  "ai/prefill-decode-phase-dynamics": [
    { kind: "핵심 논문", label: "Roofline: An Insightful Visual Performance Model for Multicore Architectures", href: "https://doi.org/10.1145/1498765.1498785", note: "Arithmetic intensity 와 ridge point 로 compute·memory 병목을 판정하는 원 model" },
    { kind: "핵심 논문", label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve", href: "https://arxiv.org/abs/2403.02310", note: "Chunked prefill 과 stall-free scheduling 으로 decode 간섭을 다룬 OSDI 2024 연구, 수치는 저자 자기보고" },
    { kind: "핵심 논문", label: "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving", href: "https://arxiv.org/abs/2401.09670", note: "Prefill·decode 간섭을 정량화한 OSDI 2024 연구, 분리 서빙 자체는 이 글 범위 밖" },
    { kind: "공식 문서", label: "vLLM Optimization and Tuning: Chunked Prefill", href: "https://docs.vllm.ai/en/latest/configuration/optimization.html", note: "V1 기본 활성화, decode 우선, max_num_batched_tokens 절충의 공식 근거" },
    {
      "kind": "공식 코드",
      "label": "Prefill/decode — vllm/v1/core/sched/scheduler.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py",
      "note": "2026-10-04 확인. 전체 원문 SHA256과 행 범위를 확인하고 같은 A·B·C 사례를 해당 연산에 대입합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefill/decode — vllm/config/scheduler.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/config/scheduler.py",
      "note": "2026-10-04 확인. 전체 원문 SHA256과 행 범위를 확인하고 같은 A·B·C 사례를 해당 연산에 대입합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefill/decode — transformers/models/mixtral/modeling_mixtral.py",
      "href": "https://raw.githubusercontent.com/huggingface/transformers/5eddc12edfaf8cafde8c9bae4ccb12f8a139b4f9/src/transformers/models/mixtral/modeling_mixtral.py",
      "note": "2026-10-04 확인. 전체 원문 SHA256과 행 범위를 확인하고 같은 A·B·C 사례를 해당 연산에 대입합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Prefill/decode — Roofline — EECS-2008-134 §3",
      "href": "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.pdf",
      "note": "2026-10-04 확인. §3의 byte 경계와 성능 상한 식에 c4의 600 MFLOP·148 MB를 넣어 시간 하한1.48 ms로 바꿉니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Prefill/decode — Sarathi-Serve — Algorithm 3 and §4.3",
      "href": "https://arxiv.org/html/2403.02310v3",
      "note": "2026-10-04 확인. Algorithm3에 A1·B1·C4를 넣고 §4.3의 반복 KV 읽기를 C20의 다섯 조각으로 계산합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Prefill/decode — DistServe — phase placement and communication",
      "href": "https://arxiv.org/html/2401.09670v3",
      "note": "2026-10-04 확인. §3.3의 1.13 GB·10요청/s 전송 사례와 §4 배치를 C의 입력 처리 뒤 기록 전달에 연결합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Prefill/decode — vLLM v0.27.1 — chunked prefill documentation and source",
      "href": "https://docs.vllm.ai/en/v0.27.1/configuration/optimization/",
      "note": "2026-10-04 확인. L483~523에 running 앞 P가 budget6을 쓰는 반례를 넣어 모든 decode 우선이라는 일반화를 검증합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Prefill/decode — NVIDIA H100 SXM specifications",
      "href": "https://www.nvidia.com/en-us/data-center/h100/",
      "note": "2026-10-04 확인. FP16 표의 sparsity 각주와 3.35 TB/s를 확인하며 dense989는 반올림 참조 가정입니다."
    },
],
  "gpu/sm-warp-scheduling-and-issue": [
    {
      "kind": "공식 문서",
      "label": "NVIDIA CUDA C++ Programming Guide 12.8.1 · SIMT Architecture, Hardware Multithreading, Multiprocessor Level",
      "href": "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-programming-guide/index.html",
      "note": "32-thread SIMT와 경로 분기, CC7.x 산술4clock·최대처리량·독립성 조건, __syncwarp와*_sync의 참여 규칙을 제공합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA Nsight Compute Profiling Guide · Scheduler Statistics, Warp State Statistics",
      "href": "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html",
      "note": "Resident·eligible·issued와 명령해독·입력의존·실행pipe 조건, scoreboard·not selected·pipe throttle의 정의를 제공합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA Hopper Architecture In-Depth",
      "href": "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/",
      "note": "H100 SXM5의132SM과 SM당4scheduler 구성을528 warp instruction/clock 발행 모형에 적용합니다."
    }
  ],
  "gpu/cuda-compilation-and-isa-analysis": [
    {
      "kind": "공식 문서",
      "label": "CUDA Compiler Driver NVCC — GPU Compilation",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-compiler-driver-nvcc/index.html",
      "note": "공개 compilation phase와 내부 단계의 경계, 대상 옵션·호환·JIT 경로를 제공합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Parallel Thread Execution ISA",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html",
      "note": "가상 register와 instruction·target 조건을 정의합니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA Binary Utilities (cuobjdump, nvdisasm)",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-binary-utilities/index.html",
      "note": "§2.1의 실제 add PTX·SASS와 별도 test.cubin 자원 출력, 분석 옵션을 제공합니다."
    },
    {
      "kind": "공식 문서",
      "label": "CUDA C++ Programming Guide — Compute Capabilities",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html#compute-capabilities",
      "note": "8.0·9.0의 register와 shared memory 한도를 제공합니다. 명령별 target은 PTX 규격을 함께 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Floating Point and IEEE 754 · §2.3",
      "href": "https://docs.nvidia.com/cuda/floating-point/index.html#the-fused-multiply-add-fma",
      "note": "원문의 이진 A=1+2⁻²³,B=−(1+2⁻²²)에 대해 FMA의2⁻⁴⁶과 분리 연산의0을 대조합니다."
    },
    {
      "kind": "공식 코드",
      "label": "NVIDIA cuda-samples v13.0 · vectorAdd.cu",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "전체 원본과 BSD 3-Clause 라이선스는 gpu-execution-sources에 보존합니다. 문서의 add.o와 별도 자료입니다."
    }
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
    {
      "kind": "공식 문서",
      "label": "CUDA Best Practices13.0.2 ·Effective Bandwidth Calculation",
      "href": "https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html",
      "note": "CUDA Best Practices13.0.2 ·Effective Bandwidth Calculation"
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA vectorAdd·3f1c509·52 행",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "NVIDIA vectorAdd·3f1c509·52 행"
    },
    {
      "kind": "핵심 논문",
      "label": "Williams 외·Roofline(2009)",
      "href": "https://escholarship.org/uc/item/78h8v7mr",
      "note": "2009 CACM 논문의 저자 원고. 3절의 cache 뒤 DRAM 바이트와 지속 가능한 대역폭 정의를 읽고 같은 64 FLOP 사례에 대입합니다. 기존 링크가 2008 Hot Chips 발표였던 오류를 바로잡았습니다."
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA Nsight Compute·2026-10-04 확인·Profiling Guide",
      "href": "https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html",
      "note": "메모리 계층·실행 pipe·scheduler counter의 정의를 함께 확인합니다."
    }
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
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm tests/v1/kv_connector/nixl_integration/toy_proxy_server.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/tests/v1/kv_connector/nixl_integration/toy_proxy_server.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_scheduler.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_scheduler.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_scheduler.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_scheduler.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_scheduler.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_scheduler.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vllm-project/vllm vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_worker.py",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_worker.py",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — sgl-project/sglang sgl-model-gateway/src/policies/cache_aware.rs",
      "href": "https://raw.githubusercontent.com/sgl-project/sglang/35f3c96ff4794a4de15daf12caad371084a037ee/sgl-model-gateway/src/policies/cache_aware.rs",
      "note": "고정 revision 전체 원문과 실제 분기·행 범위 확인. 설명용 숫자를 제어 흐름에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — SGLang CacheAwareConfig",
      "href": "https://github.com/sgl-project/sglang/blob/35f3c96ff4794a4de15daf12caad371084a037ee/sgl-model-gateway/src/policies/mod.rs",
      "note": "고정 원문에서 기본값과 크기 기반 정리의 실제 조건을 확인했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — SGLang tree eviction",
      "href": "https://github.com/sgl-project/sglang/blob/35f3c96ff4794a4de15daf12caad371084a037ee/sgl-model-gateway/src/policies/tree.rs",
      "note": "고정 원문에서 기본값과 크기 기반 정리의 실제 조건을 확인했습니다."
    },
    {
      "kind": "공식 코드",
      "label": "Disaggregation — vLLM scheduler full-prompt recompute",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py#L2671-L2674",
      "note": "입력 전체 hit에서 마지막 입력 위치를 다시 계산하는 경로입니다."
    },
    {
      "kind": "공식 문서",
      "label": "Disaggregation — vLLM v0.27.1 — NIXL pull and toy proxy",
      "href": "https://docs.vllm.ai/en/v0.27.1/features/disagg_prefill/",
      "note": "R의 입력4위치·128B와 P4ms·전송2ms·D2ms 가정을 실제 제어 흐름에 대응합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Disaggregation — SGLang 35f3c96 — cache-aware implementation",
      "href": "https://github.com/sgl-project/sglang/blob/35f3c96ff4794a4de15daf12caad371084a037ee/sgl-model-gateway/src/policies/cache_aware.rs",
      "note": "load40/8·41/8·1000/967을 절대32·상대1.1에 넣어 false·true·false를 확인합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Disaggregation — Splitwise v2 — transfer and provisioning",
      "href": "https://arxiv.org/html/2311.18677v2",
      "note": "Fig.11의 의존 경로에 R의 층별64B·준비2/4ms를 넣고 §VI-A의 두번째토큰64%→16.5%와 E2E0.8%를 원조건으로 한정합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Disaggregation — DistServe v3 — placement algorithms",
      "href": "https://arxiv.org/html/2401.09670v3",
      "note": "Algorithm1의 올림식에 가정10RPS·P5RPS·D4RPS를 넣어2·3복사본을 구합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Disaggregation — Mooncake FAST 2025 — published version",
      "href": "https://www.usenix.org/system/files/fast25-qin.pdf",
      "note": "p.162 Algorithm1 lines14–16에 R의 prefix 복사1ms·대기0.5ms·계산2ms를 넣어3.5ms를 얻습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Disaggregation — NIXL lease renewal v0.27.1",
      "href": "https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/docs/design/nixl_kv_cache_lease.md",
      "note": "완료·heartbeat·만료를 나누고 장기 대기와 실패의 보관 기한을 설명합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Disaggregation — Mooncake arXiv v4 version boundary",
      "href": "https://arxiv.org/html/2407.00079v4",
      "note": "2025-09-03 v4의 모델·평가·Algorithm1을 FAST2025 출판본과 구분합니다."
    }
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
    {
      "kind": "공식 코드",
      "label": "Prefix cache — sglang python/sglang/srt/mem_cache/radix_cache.py pinned original",
      "href": "https://raw.githubusercontent.com/sgl-project/sglang/35f3c96ff4794a4de15daf12caad371084a037ee/python/sglang/srt/mem_cache/radix_cache.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — sglang python/sglang/srt/managers/schedule_policy.py pinned original",
      "href": "https://raw.githubusercontent.com/sgl-project/sglang/35f3c96ff4794a4de15daf12caad371084a037ee/python/sglang/srt/managers/schedule_policy.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — sglang python/sglang/srt/managers/schedule_batch.py pinned original",
      "href": "https://raw.githubusercontent.com/sgl-project/sglang/35f3c96ff4794a4de15daf12caad371084a037ee/python/sglang/srt/managers/schedule_batch.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/core/kv_cache_manager.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_manager.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/core/kv_cache_coordinator.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_coordinator.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/core/single_type_kv_cache_manager.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/single_type_kv_cache_manager.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/core/block_pool.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/block_pool.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/core/kv_cache_utils.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_utils.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/attention/backends/utils.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/attention/backends/utils.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/attention/backends/flash_attn.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/attention/backends/flash_attn.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Prefix cache — vllm vllm/v1/attention/backend.py pinned original",
      "href": "https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/attention/backend.py",
      "note": "고정 revision의 전체 원문. 실제 분기와 행 범위를 읽고 가정한 요청의 위치 수를 적용합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "SGLang arXiv v2 — §3, Theorem 3.1 and Appendix A",
      "href": "https://arxiv.org/html/2312.07104v2",
      "note": "offline 상한과 의사코드를 현재 구현과 구별하고 자기보고 성능은 당시 workload로 한정합니다."
    }
  ],
  "ai/speculative-decoding-variants": [
    {
      "kind": "공식 코드",
      "label": "Medusa e2a5d20c medusa/model/utils.py whole original",
      "href": "https://raw.githubusercontent.com/FasterDecoding/Medusa/e2a5d20c048a9b0a4092e6933c34313687422518/medusa/model/utils.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "Medusa e2a5d20c medusa/model/kv_cache.py whole original",
      "href": "https://raw.githubusercontent.com/FasterDecoding/Medusa/e2a5d20c048a9b0a4092e6933c34313687422518/medusa/model/kv_cache.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "Medusa e2a5d20c medusa/model/medusa_model.py whole original",
      "href": "https://raw.githubusercontent.com/FasterDecoding/Medusa/e2a5d20c048a9b0a4092e6933c34313687422518/medusa/model/medusa_model.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "LayerSkip 494752e5 self_speculation/self_speculation_generator.py whole original",
      "href": "https://raw.githubusercontent.com/facebookresearch/LayerSkip/494752e5fbb0a82989f6cb384841684b1c2ef5c3/self_speculation/self_speculation_generator.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "LayerSkip 494752e5 self_speculation/llama_model_utils.py whole original",
      "href": "https://raw.githubusercontent.com/facebookresearch/LayerSkip/494752e5fbb0a82989f6cb384841684b1c2ef5c3/self_speculation/llama_model_utils.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "ArcticInference aca5d9a8 arctic_inference/suffix_decoding/cache.py whole original",
      "href": "https://raw.githubusercontent.com/snowflakedb/ArcticInference/aca5d9a8a62474035c15d114d40a01abc8c94b51/arctic_inference/suffix_decoding/cache.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "ArcticInference aca5d9a8 csrc/suffix_decoding/suffix_tree.cc whole original",
      "href": "https://raw.githubusercontent.com/snowflakedb/ArcticInference/aca5d9a8a62474035c15d114d40a01abc8c94b51/csrc/suffix_decoding/suffix_tree.cc",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "ArcticInference aca5d9a8 csrc/suffix_decoding/suffix_tree.h whole original",
      "href": "https://raw.githubusercontent.com/snowflakedb/ArcticInference/aca5d9a8a62474035c15d114d40a01abc8c94b51/csrc/suffix_decoding/suffix_tree.h",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "ArcticInference aca5d9a8 csrc/suffix_decoding/int32_map.h whole original",
      "href": "https://raw.githubusercontent.com/snowflakedb/ArcticInference/aca5d9a8a62474035c15d114d40a01abc8c94b51/csrc/suffix_decoding/int32_map.h",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "공식 코드",
      "label": "Medusa e2a5d20c medusa/model/modeling_llama_kv.py whole original",
      "href": "https://raw.githubusercontent.com/FasterDecoding/Medusa/e2a5d20c048a9b0a4092e6933c34313687422518/medusa/model/modeling_llama_kv.py",
      "note": "고정 commit의 전체 파일을 수정 없이 보존했습니다. 실제 native CPU 실행·배열 대역·읽기 전용 대조 범위는 본문에서 따로 밝힙니다."
    },
    {
      "kind": "핵심 논문",
      "label": "LayerSkip: Enabling Early Exit Inference and Self-Speculative Decoding (v4)",
      "href": "https://arxiv.org/html/2404.16710v4",
      "note": "§4의 self-drafting·verification·cache reuse를 R·A·Y에 적용했습니다. 원문의 실험 배율은 24절에서 모델·작업별 저자 보고로 읽습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "DeepSeek-V3 Technical Report (v2)",
      "href": "https://arxiv.org/html/2412.19437v2",
      "note": "§2.2 식 21–23 및 §5.4.3의 추가 token 수락률 85~90%와 TPS 1.8배 보고를 분리해 읽었습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads (v3)",
      "href": "https://arxiv.org/html/2401.10774v3",
      "note": "Algorithm 1·§2.3.1과 Table 2를 읽고 실제 고정 함수의 root 선택·17칸 mask·RAY 행을 CPU 배열 대역으로 확인했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification (v4)",
      "href": "https://arxiv.org/html/2305.09781v4",
      "note": "Algorithm 2와 Table 1의 CIP top-1→top-5 70→89%를 구별했고 폭 3·2·2와 깊이별 .89/.85/.8은 교육용 가정으로 표시했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "SuffixDecoding: Extreme Speculative Decoding for Emerging AI Applications (v3)",
      "href": "https://arxiv.org/html/2411.04975v3",
      "note": "§3의 자료 구조·길이 선택·hybrid와 Figure 4의 batch 1 H100 결과, 별도 OpenHands 전체 실행 비교를 각각 읽었습니다."
    }
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
    {
      "kind": "공식 구현",
      "label": "DeepEP V2.5 · 93eb6eb",
      "href": "https://github.com/deepseek-ai/DeepEP/blob/93eb6eb238127e96c6d7a4a625a6dad158348509/README.md",
      "note": "이 글에서는 공식 API와 README를 대조했으며 GPU benchmark는 수행하지 않음. V1의 normal/low-latency API와 zero-SM 설명을 이 commit에 일반화하지 않는다."
    },
    {
      "kind": "핵심 논문",
      "label": "DeepSeek-V3 Technical Report",
      "href": "https://arxiv.org/abs/2412.19437",
      "note": "보고서의 학습·추론 구성에 대한 저자 측정. 이 글의 64 expert·8GPU 수치는 설명용이며 V3의 실제 제품 구성을 옮긴 것이 아니다."
    },
    {
      "kind": "공식 코드",
      "label": "본문에서 사용하는 고정 commit의 전체 구현",
      "href": "https://github.com/deepseek-ai/DeepEP/blob/93eb6eb238127e96c6d7a4a625a6dad158348509/deep_ep/buffers/ep.py",
      "note": "CodeSidebar에 원문 전체와 LICENSE를 보관했습니다. 주석의 숫자 대입은 설명용 검산이며 GPU 학습·성능 재현을 뜻하지 않습니다."
    }
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
    {
      "kind": "핵심 논문",
      "label": "Parallelizing Linear Transformers with the Delta Rule · 2024",
      "href": "https://arxiv.org/abs/2406.06484",
      "note": "원 논문의 모델 크기·token budget·GPU 조건의 저자 실험. 단순 prefix sum은 교환 가능한 합의 사례다. delta update를 같은 스캔 코드로 바꿀 수 있다는 뜻은 아니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Gated DeltaNet-2 · arXiv 2605.22791v1",
      "href": "https://arxiv.org/html/2605.22791v1",
      "note": "1.3B, FineWeb-Edu 100B token, 학습 길이 4K, recurrent·hybrid 비교의 저자 실험. 표의 순위는 그 조건의 결과다. 고정 크기 상태가 임의 길이의 정보를 무손실 저장하는 보장은 아니다."
    },
    {
      "kind": "공식 코드",
      "label": "본문에서 사용하는 고정 commit의 전체 구현",
      "href": "https://github.com/NVlabs/GatedDeltaNet-2/blob/a5552fe3c67e0ebc7ef1220df68ae8896ec62d56/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py",
      "note": "CodeSidebar에 원문 전체와 LICENSE를 보관했습니다. 주석의 숫자 대입은 설명용 검산이며 GPU 학습·성능 재현을 뜻하지 않습니다."
    }
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
    {
      "kind": "보충 읽기",
      "label": "How tool use works + Pricing",
      "href": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
      "note": "2026-10-04 원문 확인. 원호출ID c1·c2·c3과2,654입력부분합"
    },
    {
      "kind": "보충 읽기",
      "label": "Function calling flow",
      "href": "https://developers.openai.com/api/docs/guides/function-calling",
      "note": "2026-10-04 원문 확인. 모델제안·외부실행·결과재입력분리"
    },
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
    {
      "kind": "보충 읽기",
      "label": "Idempotent requests, storage and pruning conditions",
      "href": "https://docs.stripe.com/api/idempotent_requests",
      "note": "2026-10-04 원문 확인. 같은pay-42 유지와 결과미확인 새키재시도 금지"
    },
    {
      "kind": "보충 읽기",
      "label": "§9.2.2",
      "href": "https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods",
      "note": "2026-10-04 원문 확인. 의도한효과의반복동일성과비멱등재시도조건"
    },
],
  "ai/rl-foundations-for-llm-post-training": [
    { kind: "핵심 논문", label: "Policy Gradient Methods for Reinforcement Learning with Function Approximation", href: "https://proceedings.neurips.cc/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html", note: "Policy gradient theorem의 형식적 정의와 증명의 출처" },
    { kind: "공식 문서", label: "Reinforcement Learning: An Introduction (2nd ed.)", href: "https://mitpress.mit.edu/9780262039246/reinforcement-learning/", note: "Return·MDP·REINFORCE 정의의 표준 교과서 출처" },
  ],
  "ai/reward-design-for-verifiable-rl": [
    {
      "kind": "핵심 논문",
      "label": "Policy invariance under reward transformations · 1999",
      "href": "https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf",
      "note": "정책 보존 정리와 논문이 보고한 제한된 환경 실험. 추가 보상의 합이 언제나 0이라는 주장이 아니다. 적절한 경계 조건에서 행동 선택에 무관한 항으로 남아 정책을 보존한다."
    },
    {
      "kind": "공식 구현",
      "label": "Open-R1 rewards.py · 5b6ff22",
      "href": "https://github.com/huggingface/open-r1/blob/5b6ff22b3fb7aa069c54866e517f39dfc3160e09/src/open_r1/rewards.py",
      "note": "이 글은 공식 코드 경로를 대조했으며 모델 학습을 재현하지 않음. 자동 실행된다는 사실은 verifier가 정답을 완벽하게 판정한다는 보장이 아니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Verifiable Process Rewards · arXiv 2605.10325v1",
      "href": "https://arxiv.org/html/2605.10325v1",
      "note": "Tic-Tac-Toe·Sudoku·Minesweeper와 전이 benchmark의 저자 실험. 과정 verifier의 품질에 의존한다. 열린 환경에서 범용적으로 정확한 oracle을 제공하는 결과는 아니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Reasoning Arena · arXiv 2606.09380v1",
      "href": "https://arxiv.org/html/2606.09380v1",
      "note": "논문의 수학·코드 benchmark 비교에 대한 저자 자기보고. 판정자 점수를 객관적인 정답 증명으로 바꿔 읽지 않는다."
    }
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
    {
      "kind": "핵심 논문",
      "label": "Dasgupta–Gupta · 정리 2.1과 pp.61–62 증명",
      "href": "https://cseweb.ucsd.edu/~dasgupta/papers/jl.pdf",
      "note": "존재 조건과 실패 확률을 같은 n=4에 대입하고 성공 하한 1/n을 보존합니다. 6 계수의 더 강한 충분조건을 구별합니다."
    },
    {
      "kind": "공식 코드",
      "label": "scikit-learn 1.7.2 · random_projection.py, 25dee604",
      "href": "https://github.com/scikit-learn/scikit-learn/blob/25dee604bae18205b01548348388baf7a1cdfe0e/sklearn/random_projection.py",
      "note": "원문 전체·라이선스·SHA256을 보존합니다. 행렬 분산 1/k, X @ components_.T, 정수 자르기와 n4의 auto 거부에 같은 사례를 대입했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Pope et al. · ICLR2021 식(2)와 표1",
      "href": "https://arxiv.org/pdf/2104.08894",
      "note": "ImageNet 26·38·43·43과 이웃 수 3·5·10·20을 함께 읽고 실제 자료의 추정과 별도 생성 자료 검증을 구별합니다."
    },
],
  "ai/math-numerical-precision-stability": [
    {
      "kind": "핵심 논문",
      "label": "Goldberg 1991 · 형식과 정확한 반올림",
      "href": "https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html",
      "note": "정밀도에 선행 1을 포함하고 p=11에 같은 δ와 두 tie를 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "CPython v3.9.6 · binary16 저장 원문",
      "href": "https://github.com/python/cpython/blob/db3ff76da19004f266b62e98a81bdfd322861436/Objects/floatobject.c#L2021-L2122",
      "note": "소수부×1024와 bits의 홀짝에 0.5·1.5를 대입해 3c00·3c02를 추적합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Deep Learning §4.1 · softmax와 작은 분자",
      "href": "https://www.deeplearningbook.org/contents/numerical.html",
      "note": "최대값 이동으로 분모에 1이 남는 조건과 직접 log-softmax가 필요한 작은 분자를 같은 숫자로 계산합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Kalamkar 외 · BFLOAT16 Table 1과 Figure 1",
      "href": "https://arxiv.org/html/1905.12322v3#S3",
      "note": "표의 소수부·지수 bit로 간격과 유한 최대값을 직접 계산하고 입력 BF16·누산 FP32를 구별합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NumPy 2.0 · broadcasting 규칙",
      "href": "https://numpy.org/doc/2.0/user/basics.broadcasting.html",
      "note": "오른쪽 정렬과 같은 크기 또는 1이라는 조건을 (3,1)+(3,)와 (3,4)+(5,)에 적용합니다."
    }
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
  "ai/qwen38-flash-next-architecture": [
    {
      kind: "공식 문서",
      label: "Qwen/Qwen3.8-Flash-Next · official model card",
      href: "https://huggingface.co/Qwen/Qwen3.8-Flash-Next",
      note: "125B backbone·토큰당 6B 활성·51B n-gram 임베딩·native 262,144 문맥의 공개 범위이며 특정 런타임의 품질·VRAM·latency 보장은 아님",
    },
    {
      kind: "공식 코드",
      label: "Qwen3.8-Flash-Next · official config.json",
      href: "https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/config.json",
      note: "layer_types 48개·num_experts 512·num_experts_per_tok 10·indexer_budget 2048·hc_count 4·ple_layer_ids의 machine-readable artifact이며 allocator·kernel의 실제 메모리를 확정하지 않음",
    },
    {
      kind: "공식 코드",
      label: "Qwen3.8-Flash-Next · model.safetensors.index.json",
      href: "https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/model.safetensors.index.json",
      note: "total_size 359,999,963,128 바이트와 층별 텐서 목록의 근거이며 KV·activation·런타임 peak는 포함하지 않음",
    },
    {
      kind: "공식 구현",
      label: "Transformers · qwen4_exp reference implementation",
      href: "https://huggingface.co/docs/transformers/main/en/model_doc/qwen4_exp",
      note: "QSA indexer·GatedResidual·PLE의 계산 경로 근거이며 이 글은 f62dc9bf2c90 스냅샷을 인용함. 서빙 엔진의 production 성능을 대표하지 않음",
    },
    {
      kind: "핵심 논문",
      label: "Native Sparse Attention · arXiv 2502.11089",
      href: "https://arxiv.org/abs/2502.11089",
      note: "블록 압축 후 선택을 사전학습부터 함께 학습하는 설계의 원문이며 Qwen QSA 구현의 성능 근거는 아님",
    },
    {
      kind: "핵심 논문",
      label: "Hyper-Connections · arXiv 2409.19606",
      href: "https://arxiv.org/abs/2409.19606",
      note: "다중 residual stream과 학습 가능한 배합의 원문이며 갈래 4개·랭크 320 선택의 최적성 근거는 아님",
    },
  ],
  "gpu/modded-rtx4090-moe-serving": [
    {
      kind: "공식 문서",
      label: "NVIDIA · GeForce RTX 4090 제품 스펙",
      href: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
      note: "384-bit 버스·GDDR6X·24GB 구성과 NVLink 미제공의 공식 근거이며 개조 제품의 동작을 보증하지 않음",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA · NVLink와 NVSwitch 제품 페이지",
      href: "https://www.nvidia.com/en-us/data-center/nvlink/",
      note: "3090 bridge 112.5GB/s·A100 600GB/s·H100 900GB/s 집계 대역폭의 출처이며 특정 워크로드의 achievable goodput은 아님",
    },
    {
      kind: "공식 규격",
      label: "PCI-SIG · PCI Express Base Specification",
      href: "https://pcisig.com/specifications",
      note: "Gen4 16GT/s와 128b/130b 인코딩으로 raw bandwidth를 계산하는 근거이며 protocol overhead 이후 실측값과는 다름",
    },
  ],
  "ai/dinov3-self-supervised-backbone": [
    {
      kind: "핵심 논문",
      label: "DINOv3 · arXiv 2508.10104",
      href: "https://arxiv.org/abs/2508.10104",
      note: "Gram anchoring·학습 일정·증류 계열의 원문이며 보고된 개선은 논문이 명시한 데이터와 평가 조건 안의 자기보고임",
    },
    {
      kind: "공식 코드",
      label: "facebookresearch/dinov3 · loss 구현",
      href: "https://github.com/facebookresearch/dinov3",
      note: "이 글이 인용한 gram_loss·dino_clstoken_loss·ibot_patch_loss·koleo_loss 스냅샷의 출처이며 커밋 11c58638 기준임",
    },
    {
      kind: "공식 문서",
      label: "Meta AI · DINOv3 모델 공개 페이지",
      href: "https://ai.meta.com/dinov3/",
      note: "공개된 모델 계열과 사용 조건의 근거이며 특정 과제의 성능 보장은 아님",
    },
    {
      kind: "선행·비교 논문",
      label: "Emerging Properties in Self-Supervised Vision Transformers · arXiv 2104.14294",
      href: "https://arxiv.org/abs/2104.14294",
      note: "EMA teacher와 centering·sharpening으로 붕괴를 막는 원형이며 DINOv3의 dense 관련 기여는 포함하지 않음",
    },
  ],
  "ai/sam3-promptable-concept-segmentation": [
    {
      kind: "핵심 논문",
      label: "SAM 3: Segment Anything with Concepts · arXiv 2511.16719",
      href: "https://arxiv.org/abs/2511.16719",
      note: "과제 정의·존재 토큰·데이터 엔진·지표의 원문이며 보고된 수치는 저자 자기보고 범위임",
    },
    {
      kind: "공식 코드",
      label: "facebookresearch/sam3 · decoder·encoder 구현",
      href: "https://github.com/facebookresearch/sam3",
      note: "이 글이 인용한 presence token과 융합 인코더 스냅샷의 출처이며 커밋 660a5e9e 기준임",
    },
    {
      kind: "선행·비교 논문",
      label: "Segment Anything · arXiv 2304.02643",
      href: "https://arxiv.org/abs/2304.02643",
      note: "점·상자 지목 프롬프트로 단일 인스턴스를 분할하는 이전 과제 정의이며 개념 단위 전수 분할은 포함하지 않음",
    },
  ],
  "ai/image-embedding-pipeline": [
    {
      kind: "공식 구현",
      label: "Transformers · DINOv3 ViT image processor와 모델 정의",
      href: "https://github.com/huggingface/transformers/tree/main/src/transformers/models/dinov3_vit",
      note: "기본 전처리 설정·연산 순서와 CLS·register·patch 토큰 배치의 근거이며 커밋 f62dc9bf2c90 스냅샷 기준임",
    },
    {
      kind: "핵심 논문",
      label: "Patch n' Pack: NaViT · arXiv 2307.06304",
      href: "https://arxiv.org/abs/2307.06304",
      note: "고정 해상도 관행의 대안을 제시한 원문이며 기존 백본의 전처리 변경에 그대로 적용되지 않음",
    },
    {
      kind: "보충 읽기",
      label: "DINOv3 · 모델 카드와 공개 계열",
      href: "https://ai.meta.com/dinov3/",
      note: "이 글이 예로 든 백본 계열의 공개 범위이며 특정 검색 과제의 성능 보장은 아님",
    },
  ],
  "ai/image-text-contrastive-pretraining": [
    {
      kind: "핵심 논문",
      label: "CLIP · arXiv 2103.00020",
      href: "https://arxiv.org/abs/2103.00020",
      note: "웹 규모 이미지·캡션 짝과 배치 정규화 대조 손실의 원문이며 보고된 zero-shot 성능은 해당 프롬프트 설정 위의 자기보고임",
    },
    {
      kind: "핵심 논문",
      label: "SigLIP · arXiv 2303.15343",
      href: "https://arxiv.org/abs/2303.15343",
      note: "쌍 단위 시그모이드 손실과 배치 크기 실험의 원문이며 보고된 임계·포화 지점은 해당 데이터·모델 조합의 관측임",
    },
    {
      kind: "공식 구현",
      label: "Transformers · CLIP·SigLIP 손실 구현",
      href: "https://github.com/huggingface/transformers/tree/main/src/transformers/models",
      note: "교차 엔트로피 한 줄과 부호 행렬·로그 시그모이드, 그리고 logit_scale·logit_bias 파라미터의 근거이며 커밋 f62dc9bf2c90 스냅샷 기준임",
    },
  ],
  "ai/vision-backbone-selection": [
    {
      kind: "보충 읽기",
      label: "DINOv3 · arXiv 2508.10104",
      href: "https://arxiv.org/abs/2508.10104",
      note: "자기지도 계열의 dense 능력 경향 근거이며 이 글의 계열 비교는 각 논문의 자기보고를 정성 요약한 것임",
    },
    {
      kind: "보충 읽기",
      label: "CLIP · arXiv 2103.00020",
      href: "https://arxiv.org/abs/2103.00020",
      note: "캡션 정렬 계열의 zero-shot 능력 근거이며 보고된 점수는 해당 프롬프트 설정 위의 값임",
    },
    {
      kind: "보충 읽기",
      label: "SAM 3 · arXiv 2511.16719",
      href: "https://arxiv.org/abs/2511.16719",
      note: "분할 감독 계열이 남기는 경계 능력의 근거이며 검색용 표현으로서의 성능을 주장하지 않음",
    },
  ],
  "ai/multi-component-finetuning-vram": [
    {
      kind: "공식 예제",
      label: "Diffusers · text-to-image LoRA 학습 예제",
      href: "https://github.com/huggingface/diffusers/blob/main/examples/text_to_image/train_text_to_image_lora.py",
      note: "세 부품을 동결한 뒤 모두 장치로 옮기고 매 스텝 호출하는 구조의 근거이며 커밋 82f175e0 스냅샷 기준임",
    },
    {
      kind: "보충 읽기",
      label: "PyTorch · CUDA 메모리 관리 문서",
      href: "https://pytorch.org/docs/stable/notes/cuda.html",
      note: "할당기 동작과 캐시 해제의 근거이며 텐서 합과 실제 사용량이 다른 이유를 설명함",
    },
  ],
  "gpu/ai-accelerator-vendor-comparison": [
    {
      kind: "공식 문서",
      label: "AMD Instinct MI355X · 시스템 수용 문서",
      href: "https://instinct.docs.amd.com/projects/system-acceptance/en/latest/gpus/mi355x.html",
      note: "메모리 용량·대역폭·OAM 폼팩터·Infinity Fabric 링크 구성의 근거이며 2026-09-11 확인 기준임",
    },
    {
      kind: "공식 문서",
      label: "Intel Gaudi 3 · 기술 백서",
      href: "https://cdrdv2-public.intel.com/817486/gaudi-3-ai-accelerator-white-paper.pdf",
      note: "HBM 구성과 패키지 내장 이더넷 포트, OAM·PCIe 폼팩터별 전력의 근거이며 2026-09-11 확인 기준임",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA · NVLink와 NVSwitch 제품 문서",
      href: "https://www.nvidia.com/en-us/data-center/nvlink/",
      note: "전용 링크와 전용 스위치 구조의 근거이며 특정 워크로드의 achievable 성능은 아님",
    },
  ],
  "gpu/server-cpu-lineup-comparison": [
    {
      kind: "공식 문서",
      label: "AMD · EPYC 서버 프로세서 제품 사양",
      href: "https://www.amd.com/en/products/processors/server/epyc.html",
      note: "서버 계열의 소켓·레인·메모리 채널 대표값 근거이며 2026-09-11 확인 기준으로 세대마다 값이 바뀜",
    },
    {
      kind: "공식 문서",
      label: "Intel · Xeon 프로세서 제품 사양",
      href: "https://www.intel.com/content/www/us/en/products/details/processors/xeon.html",
      note: "서버 계열 비교 대상의 사양 근거이며 모델별로 레인·채널이 다르므로 개별 확인이 필요함",
    },
    {
      kind: "공식 규격",
      label: "PCI-SIG · PCI Express Base Specification",
      href: "https://pcisig.com/specifications",
      note: "레인 폭과 세대별 전송률로 대역폭을 계산하는 근거이며 실제 goodput은 이보다 낮음",
    },
  ],
  "gpu/datacenter-site-readiness": [
    {
      kind: "공식 규격",
      label: "Telcordia GR-63-CORE · NEBS 물리적 보호 요건",
      href: "https://telecom-info.njdepot.ericsson.net/site-cgi/ido/docs.cgi?ID=SEARCH&DOCUMENT=GR-63",
      note: "지진 등급 시험 조건의 출처이며 실제 요구 등급과 인정되는 고정 방식은 지역 건축 기준을 따름",
    },
    {
      kind: "공식 문서",
      label: "제조사 공개 내진 랙 시험 사양",
      href: "https://www.hammfg.com/dci/products/cabinet-systems/dcz4",
      note: "수평 0.8 g·수직 1.0 g 시험 조건과 적재 한도 표기의 근거이며 2026-09-11 확인 기준임",
    },
    {
      kind: "보충 읽기",
      label: "ASHRAE · 데이터센터 열 가이드라인",
      href: "https://www.ashrae.org/technical-resources/bookstore/datacom-series",
      note: "흡기 온도 등급과 통로 배치 전제의 배경이며 구체 수치는 해당 판본을 확인해야 함",
    },
  ],
  "saas/edge-request-defense-pipeline": [
    {
      kind: "공식 문서",
      label: "Cloudflare — 자율 엣지 DDoS 방어 구조 설명",
      href: "https://blog.cloudflare.com/deep-dive-cloudflare-autonomous-edge-ddos-protection/",
      note: "커널 앞단 폐기와 표본 기반 지문 생성·규칙 하강 구조의 출처이며 처리량 수치는 자기보고임 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — JA4 지문과 요청 신호",
      href: "https://blog.cloudflare.com/ja4-signals/",
      note: "연결 지문이 규칙과 점수 모델 입력으로 쓰인다는 설명의 출처이며 내부 모델 세부는 비공개임 (2026-09-11 확인)",
    },
    {
      kind: "보충 읽기",
      label: "TLS 1.3 핸드셰이크 규격 · RFC 8446",
      href: "https://www.rfc-editor.org/rfc/rfc8446",
      note: "첫 협상 메시지에 어떤 필드가 담기는지의 규격 근거",
    },
  ],
  "saas/anycast-delivery-continuity": [
    {
      kind: "핵심 논문",
      label: "Wei · Heidemann — Does Anycast Hang Up on You (UDP and TCP)? (IEEE TNSM 15(2), 2018)",
      href: "https://ant.isi.edu/~johnh/PAPERS/Wei18a.pdf",
      note: "약 1% 불안정, 연결 지향 약 0.15%, 불안정 조합 80%가 일주일 이상 지속이라는 수치의 출처이며 측정 대상은 루트 DNS 배치임",
    },
    {
      kind: "핵심 논문",
      label: "Eisenbud et al. — Maglev: A Fast and Reliable Software Network Load Balancer (USENIX NSDI 2016)",
      href: "https://research.google/pubs/maglev-a-fast-and-reliable-software-network-load-balancer/",
      note: "일반 서버에서 일관 해싱과 연결 추적을 함께 쓰는 분배기 구조의 근거이며 보고된 처리량은 논문의 실험 환경 값임",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — Unimog 엣지 부하 분산기",
      href: "https://blog.cloudflare.com/unimog-cloudflares-edge-load-balancer/",
      note: "칸마다 현재와 직전 담당을 두어 기존 연결을 살리는 구조와 부하 제어 루프의 출처 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — 건강 지표 매개 배포",
      href: "https://blog.cloudflare.com/safe-change-at-any-scale/",
      note: "단계별 지표 판정으로 계속·중지·되돌리기를 자동 결정한다는 설명과 오류율 0.1% 미만이라는 기준 예시의 출처 (2026-09-11 확인)",
    },
  ],
  "saas/private-access-inbound-closure": [
    {
      kind: "핵심 논문",
      label: "Ward · Beyer — BeyondCorp: A New Approach to Enterprise Security (;login: 39(6), 2014)",
      href: "https://research.google/pubs/beyondcorp-a-new-approach-to-enterprise-security/",
      note: "특권적 사내망을 없애고 사용자·기기 확인으로 접근을 판정한다는 전환의 출처이며 대규모 기기 관리 체계를 전제한 사례임",
    },
    {
      kind: "공식 문서",
      label: "Cloudflare — Tunnel 커넥터",
      href: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/",
      note: "커넥터가 나가는 연결을 먼저 맺어 들어오는 트래픽을 전부 막을 수 있고 여러 커넥터로 중복을 구성한다는 설명의 출처 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "AWS — PrivateLink 개념",
      href: "https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html",
      note: "소비자 서브넷의 엔드포인트 인터페이스, 공개 인터넷 비경유, 소비자 요청·제공자 수락, 엔드포인트 정책, 위치별 이름 해석의 출처 (2026-09-11 확인)",
    },
  ],
  "ai/onprem-k8s-inference-platform": [
    {
      kind: "공식 문서",
      label: "Kubernetes — Gateway API Inference Extension 소개",
      href: "https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/",
      note: "일반 분배가 모델 서버 지표를 보지 못한다는 문제 제기와 엔드포인트 묶음·선택기 구조의 출처 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "Gateway API Inference Extension 프로젝트 문서",
      href: "https://gateway-api-inference-extension.sigs.k8s.io/",
      note: "엔드포인트 선택기가 모델 서버가 제공하는 성능·가용성·능력 데이터를 써서 고른다는 설명의 출처 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "Kubernetes SIG — LeaderWorkerSet",
      href: "https://github.com/kubernetes-sigs/lws",
      note: "파드 묶음을 복제 단위로 다루는 API, 대표·작업자 이중 템플릿, 토폴로지 배치와 전체 재생성, 그룹 단위 갱신의 출처 (2026-09-11 확인)",
    },
  ],
  "ai/generative-measurement-controls": [
    {
      kind: "프로젝트 실측",
      label: "여섯 인물 × 네 스타일 얼굴 임베딩 검증 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "사진·유화·3D 렌더 각 15쌍에서 0.40 초과 0쌍, 2D 애니 탐지 0/6. 0.28에서는 45쌍 중 6쌍이 초과",
    },
    {
      kind: "프로젝트 실측",
      label: "오토인코더 왕복 바닥값 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "샘플링·프롬프트·마스크 없는 인코딩·디코딩만으로 0.60~2.75, 소스가 바뀌면 같은 오토인코더가 0.49~2.88",
    },
    {
      kind: "공식 문서",
      label: "CCIP — 애니 캐릭터 이미지 대조 사전학습 모델 카드 (2026-09-12 확인)",
      href: "https://huggingface.co/deepghs/ccip",
      note: "임계값이 F1 점수 최대 지점으로 정해진다는 서술과 최고 성능 모델의 정밀도 0.938·재현율 0.944·F1 0.941의 출처. 반환값이 차이값이라 낮을수록 같은 인물이며, 의상 변화에 대한 민감도는 문서에 기재돼 있지 않아 본문에서 주장하지 않음",
    },
    {
      kind: "핵심 논문",
      label: "FLUXSynID — 합성 신원 데이터셋 생성 (ICCVW 2025, arXiv:2505.07530)",
      href: "https://arxiv.org/abs/2505.07530",
      note: "CFD 데이터셋 기반 impostor 34만 건 비교에서 ArcFace 오탐률 0.1%에 해당하는 임계값 0.423을 보고. 같은 표의 AdaFace 값은 0.253이므로 이 수치는 인식기별 값이며, 본문이 ArcFace를 쓰기 때문에 비교가 성립함",
    },
  ],
  "ai/masked-edit-verb-routing": [
    {
      kind: "프로젝트 실측",
      label: "편집 동작 6종 × 모델 7종 매트릭스 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "입력·마스크·프롬프트·시드 고정 49회 실행. 보수형은 여섯 중 넷에서 최저(재질 20.8·더하기 4.5·사실감 6.3·지우기 23.0)이고 색 변경은 0.61 차 2위, 물건 교체만 55.5로 예외. 지우기는 일곱 모델 전부 23~26에서 다른 물건을 생성. 원본 요약의 \"다섯에서 최저\"를 정정함",
    },
    {
      kind: "프로젝트 실측",
      label: "손 힌트 유무 A/B (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "차이 +1.87(절제형), +1.05(보수형, 양쪽 값이 무동작 범위), 나머지 다섯은 −0.13~+0.16. 원본 요약의 \"나머지 ±0.2\"를 정정함",
    },
    {
      kind: "프로젝트 실측",
      label: "마스크 확장 스윕과 그림체 일반화 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "교체 73.3→44.8→32.4(확장 96), 160에서 파편. 지우기는 확장 24에서 아래 레이어 소실. 같은 색 변경이 3D 35.0·애니 63.4",
    },
  ],
  "ai/removal-is-not-inpainting": [
    {
      kind: "프로젝트 실측",
      label: "지우기 요청에 대한 확산 모델 응답 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "배경 프롬프트와 이름 네거티브를 함께 줘도 네 그림체 모두 띠를 재생성. 마스크 안 44.9~93.7. 이 실행의 네거티브는 안내 계수 1.0 탓에 무효였으며 통제 실패로 기록",
    },
    {
      kind: "핵심 논문",
      label: "Suvorov et al. — Resolution-robust Large Mask Inpainting with Fourier Convolutions (WACV 2022, arXiv:2109.07161)",
      href: "https://arxiv.org/abs/2109.07161",
      note: "빠른 푸리에 합성곱이 이미지 전체 크기의 수용 영역을 준다는 구조 설명의 출처이며, 텍스트 조건이나 노이즈 입력이 없는 이미지 전용 방식임. 본문의 마스크 밖 변화 측정을 설명하는 근거로 쓰되 논문이 제거 용도를 주장한 것은 아님",
    },
    {
      kind: "프로젝트 실측",
      label: "제거 전용 망과 세기·확장 스윕 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "네 그림체에서 마스크 안 34.6~61.8·마스크 밖 0.15~1.03·1~3초. 세기 254에서 0.525, 255에서 115.66. 확장 0에서 0.157, 96에서 4.12",
    },
    {
      kind: "프로젝트 실측",
      label: "2단계 조합의 세 가지 게이트 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "열두 칸 전부 단독보다 나은 칸 없음. 구멍 전체와 경계 띠의 마스크 안 변화가 소수점 첫째 자리까지 동일. 다시 그리기에 증류 모델을 썼으므로 기각 범위도 그 조건까지",
    },
  ],
  "ai/roi-resolution-identity-budget": [
    {
      kind: "프로젝트 실측",
      label: "대상 해상도와 정체성 보존 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "같은 리파인 설정에서 전신 1MP 0.265, 전신 4MP 0.318, 얼굴 패널 0.531. 마스크를 넓게 잡은 부위 편집 0.142, 좁은 띠 0.943",
    },
    {
      kind: "프로젝트 실측",
      label: "노이즈 비율 스윕 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "지시 편집 모델은 0.55·0.75에서 무변환·1.0에서만 결과. 일반 생성 모델 둘이 0.25에서 0.531/0.683, 0.40에서 0.237/0.490, 0.55에서 0.090/0.253",
    },
    {
      kind: "프로젝트 실측",
      label: "정답을 아는 확대 비교 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "1184×1744 원본을 1/4로 축소 후 복원. 보간 31.2dB·0.55×·0.979·0초, 확대 전용 29.6·0.73×·0.949·2초, 복원 전용 28.5·1.07×·0.949·16초, 타일 27.2·0.63×·0.781·28초",
    },
  ],
  "ai/reference-identity-pose-separation": [
    {
      kind: "프로젝트 실측",
      label: "참조 조건의 효과와 자세 결합 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "참조 있음/없음 정체성이 얼굴 정면 0.845/0.284, 얼굴 3/4 0.644/0.327, 전신 3/4 0.731/0.227. 문구를 바꿔도 회전각 59.5→59.9, 28.3→28.0",
    },
    {
      kind: "프로젝트 실측",
      label: "정체성 주입 세기와 적용 구간 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "측면 뷰에서 세기1.3 전 구간 22.2도/0.399, 0.3부터 62.7도/0.376, 0.5부터 71.9도/0.100, 세기0.7 전 구간 49.4도/0.464",
    },
    {
      kind: "프로젝트 실측",
      label: "세 신호를 합친 네 각도 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "정면 1.2도/0.637, 3/4 −64.6도/0.510, 측면 52.9도/0.438, 후면 얼굴 미검출. 정체성 주입을 꺼도 후면 얼굴이 정면이었고 좌표에서 얼굴 지점 제거 시에도 동일",
    },
  ],
  "ai/generative-identity-diversity": [
    {
      kind: "프로젝트 실측",
      label: "시드·묘사 축의 기여도 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "의도 고정 시 서른 번에 한 명(축 샘플링·시드 동일, 세 계열). 인구통계를 흔든 열두 묘사는 66쌍 중 27쌍. 형태 지표 세로/가로 15.6% 대 노이즈 3.7%, 광대/턱 3.8% 대 3.1%",
    },
    {
      kind: "프로젝트 실측",
      label: "참조 혼합과 증류 대조 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "예순 번 중 단독 2명·혼합 0명. 같은 72묘사·같은 시드에서 증류 18명(215/2211 충돌, Vendi 28.5), 비증류 61명(8/2145, Vendi 51.2). 구간별 충돌 27~38% → 0~7%",
    },
    {
      kind: "프로젝트 실측",
      label: "주입 세기와 모델 간 다양성 (2026-09-11, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "세기 0.9·1.3·1.8에서 전이 0.376·0.502·0.607, 다양성 0.562·0.457·0.353, 다른 인물 쌍 0·0·5. 사진체 네 모델 간 0.254 대 모델 내 0.686",
    },
    {
      kind: "핵심 논문",
      label: "Ho · Salimans — Classifier-Free Diffusion Guidance (arXiv:2207.12598, 2022)",
      href: "https://arxiv.org/abs/2207.12598",
      note: "안내가 모드 커버리지와 표본 충실도를 맞바꾼다는 본문 서술의 출처. 정체성 다양성을 직접 측정한 연구는 아니며 이 글은 그 맞바꿈이 같은 방향으로 작용한다는 근거로만 인용함",
    },
    {
      kind: "선행·비교 논문",
      label: "1.x-Distill — 증류에서의 다양성·품질·효율 장벽 (arXiv:2604.04018, 2026)",
      href: "https://arxiv.org/abs/2604.04018",
      note: "소수 단계 증류가 모드 붕괴를 일으킨다는 문제 설정의 출처. 분포 정합 증류 계열을 대상으로 하며 본문이 측정한 가중치와 같은 증류 방식이 아님",
    },
    {
      kind: "핵심 논문",
      label: "FLUXSynID — 합성 신원 데이터셋 생성 (ICCVW 2025, arXiv:2505.07530)",
      href: "https://arxiv.org/abs/2505.07530",
      note: "비증류 FLUX.1-dev로 14,889개 생성 후 ArcFace 오탐률 0.1% 기준에서 6,641명 보존(44.6%). 같은 표의 0.01% 행은 9,358명(62.9%)이므로 본문은 임계값이 가까운 0.1% 행을 비교 기준으로 삼음. 모델과 어휘가 달라 직접 비교가 아님",
    },
  ],
  "ai/negative-result-3d-face-control": [
    {
      kind: "프로젝트 실측",
      label: "메쉬 법선 방향 진단 (2026-09-10, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "중심선 최대 깊이 1.181·옆면 0.850으로 형태 존재 확인, 앞쪽 면 5,986개 중 법선이 카메라를 향한 것 0개로 감김 순서 역전 특정",
    },
    {
      kind: "프로젝트 실측",
      label: "형태 신호 전달률과 정체성 (2026-09-10, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "폭 대 높이 비 편차가 3차원 64.8%에서 출력 1.6%로 감소. 결과 네 장의 여섯 쌍 정체성이 0.728~0.910으로 전부 같은 사람 범위",
    },
    {
      kind: "프로젝트 실측",
      label: "제어 강도 스윕과 시드 대조군 (2026-09-10, RTX 4090 48GB)",
      href: "https://github.com/dik654/blog",
      note: "강도 0.60·0.85·1.00에서 0.676·0.376·0.229. 강도 0.85에서 얼굴형 변경 0.376 대 시드만 변경 0.346·0.300. 강도 1.00 대조군은 네 장 중 세 장 얼굴 미검출",
    },
  ],
  "money/money-as-a-claim": [
    {
      kind: "공식 문서",
      label: "Bank of England · Money in the modern economy: an introduction (2014 Q1)",
      href: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-in-the-modern-economy-an-introduction",
      note: "돈을 발행자의 차용증으로 정의하고 현금·예금·지급준비금을 부문 간 채무로 가르는 본문 결론의 근거. 영국 제도 기준이며 예금 창조 메커니즘까지 뒷받침하지는 않음",
    },
    {
      kind: "공식 규격",
      label: "IMF · Monetary and Financial Statistics Manual and Compilation Guide, Ch.6 (2016)",
      href: "https://www.imf.org/external/pubs/ft/mfsmcg/c6.pdf",
      note: "발행 부문·보유 부문을 먼저 가르고 유동성 기준으로 묶는 집계 절차의 근거. 지표 작성 기준이며 통화량과 물가의 관계에 대한 주장은 아님",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 최근 유동성 상황에 대한 이해 (2025-12-16)",
      href: "https://www.bok.or.kr/portal/bbs/B0000347/view.do?nttId=10095141&menuNo=201106",
      note: "M1·M2·Lf·L의 포함 범위 구분에 대한 한국 기준 근거. 발표 시점의 잔액 수치는 본문에 인용하지 않음",
    },
  ],
  "money/time-value-and-discounting": [
    {
      kind: "보충 읽기",
      label: "Irving Fisher · The Theory of Interest (1930)",
      href: "https://oll.libertyfund.org/titles/fisher-the-theory-of-interest",
      note: "명목·실질금리와 예상 물가의 관계식에 대한 근거. 관계식의 정식화이며 반영 정도에 대한 실증은 아님",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 경제금융용어 800선 (2026)",
      href: "https://www.bok.or.kr/portal/bbs/B0000249/view.do?nttId=10096081&menuNo=200765",
      note: "명목금리·실질금리·현재가치 등 본문 용어의 한국어 표준 표기를 맞추는 데 사용한 중앙은행 용어집. 계산식의 근거가 아니라 표기 기준으로만 참조",
    },
  ],
  "banking/bank-balance-sheet-and-deposit-creation": [
    {
      "kind": "공식 문서",
      "label": "Money creation in the modern economy · Figures 1–2",
      "href": "https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2014/money-creation-in-the-modern-economy.pdf",
      "note": "원문 Figure 1·2의 세 부문과 두 은행을 실제 PDF 화면에서 읽었습니다. 숫자와 이후 상환 4는 이 글의 가정입니다. 예금 창조가 은행 자금 조달과 위험 관리를 없애거나 모든 국가의 결제 시점을 정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIS · Unpacking international banks’ deposit funding",
      "href": "https://www.bis.org/publications/qr-202309/unpacking-international-banks-deposit-funding",
      "note": "공식 본문 Graph 1과 넓은 deposit funding의 정의를 본문의 별도 6 거래에 적용합니다. 그 자료의 repo·은행 간 자금까지 포함한 통계를 고객 통장 잔액과 같게 취급하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Bank of England · Bank capital and liquidity",
      "href": "https://www.bankofengland.co.uk/quarterly-bulletin/2013/q3/bank-capital-and-liquidity",
      "note": "공식 2013년 설명의 범위를 같은 A은행의 급매·차입 분기로 계산합니다. 보험과 유동성 공급이 모든 인출이나 자산 손실을 없애지는 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "IFRS Interpretations Committee · November 2018",
      "href": "https://www.ifrs.org/news-and-events/updates/ifric/2018/ifric-update-november-2018/",
      "note": "공식 공개 해석 자료와 ITG의 제각 논의에 따라 손실 3과 상환 4를 별도로 계산합니다. 이 글의 현금 기준 이자 모형이 실제 은행의 발생주의 원장 전체는 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "BCBS · Report on the 2023 banking turmoil",
      "href": "https://www.bis.org/publications/report-2023-banking-turmoil.pdf",
      "note": "사건의 복합 원인이라는 범위를 사용하며 40% 할인은 본문 계산용입니다. 모든 뱅크런이 건전한 은행에 대한 오해이거나 특정 고객의 회수액이 정해졌다고 주장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve · Reserve Requirements",
      "href": "https://www.federalreserve.gov/monetarypolicy/reservereq.htm",
      "note": "0으로 나눌 수 없다는 산술과 제도 경계를 연결합니다. 법정 비율이 0이어도 지급용 준비금·자본·유동성 관리가 필요합니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · 예금보호한도 상향 주요 QA",
      "href": "https://www.fsc.go.kr/po020201/84975",
      "note": "공식 QA의 일반 예금 조건을 0.6억과 0.5억의 가정에 적용합니다. 모든 금융상품을 보호하거나 한도 밖 금액이 반드시 전액 손실이라는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "IFRS ITG · Presentation of loss allowance (2015-12)",
      "href": "https://www.ifrs.org/content/dam/ifrs/meetings/2015/december/itg/impairment-of-financial-instruments/ap10-presentation-of-the-loss-allowance.pdf",
      "note": "5.4.4 제각의 직접 총장부가 감소와 충당금 표시를 논의한 공개 문서입니다. 기준서 자체와 구분합니다."
    }
  ],
  "banking/central-bank-and-policy-transmission": [
    {
      "kind": "공식 문서",
      "label": "한국은행 · 공개시장운영",
      "href": "https://www.bok.or.kr/portal/main/contents.do?menuNo=200294",
      "note": "공식 운영 설명의 수단과 방향을 적용했습니다. 가정한 4%·5%나 6억 원이 실제 거래 금리·규모라는 근거가 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국은행 · 통화신용정책보고서 2026년 3월",
      "href": "https://www.bok.or.kr/portal/bbs/B0000156/view.do?menuNo=200754&nttId=10096935",
      "note": "실제 보고서의 운영 방향과 개편 날짜를 대조했습니다. 모든 은행의 부족분을 같은 수단으로 언제든 메운다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve · IORB FAQ",
      "href": "https://www.federalreserve.gov/monetarypolicy/iorb-faqs.htm",
      "note": "공식 운영 문서의 접근 조건과 목표 관계를 읽었습니다. IORB가 모든 참가자에 대해 비용 없는 절대 하한이라는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve FEDS Notes · Monitoring Reserve Scarcity Through Nonbank Cash Lenders (2025)",
      "href": "https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-reserve-scarcity-through-nonbank-cash-lenders-20250328.html",
      "note": "본문의 거래 동기·비용 논의를 실제 공식 연구에 대조했습니다. 0.15%포인트는 본문 가정이며 연구의 추정값이나 현재 부족 상태가 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Bank of England · About a rate of (general) interest (2024), Figure 1",
      "href": "https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2024/about-a-rate-of-general-interest-how-monetary-policy-transmits.pdf#page=8",
      "note": "실제 PDF 그림 이미지를 읽고 같은 공장의 이자·설비·원가에 연결했습니다. 모든 경로가 같은 순서로 움직이거나 본문의 250만원이 거시경제 효과 추정치라는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve · Three-factor nominal term structure model",
      "href": "https://www.federalreserve.gov/data/three-factor-nominal-term-structure-model.htm",
      "note": "공식 모형 설명의 정의와 추정 경계를 확인했습니다. 관측 금리 하나로 미래 경로나 프리미엄을 유일하게 알 수는 없습니다."
    },
    {
      "kind": "공식 문서",
      "label": "New York Fed · Treasury Term Premia, 1961–Present (2014)",
      "href": "https://libertystreeteconomics.newyorkfed.org/2014/05/treasury-term-premia-1961-present/",
      "note": "부호를 고정하지 않는 경계에만 사용합니다. 프리미엄의 모든 모형과 모든 시점이 같은 값을 준다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Bank of England · Money creation in the modern economy (2014)",
      "href": "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
      "note": "은행 장부 글에서 확인한 부문별 기록 원리를 재사용합니다. 새 대출 수요가 없으면 예금도 절대로 생기지 않는다는 주장이 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "MAS · Monetary Policy Framework",
      "href": "https://www.mas.gov.sg/monetary-policy/Singapores-Monetary-Policy-Framework",
      "note": "공식 운영 틀과 중심 변수를 확인했습니다. 환율과 금리를 독립적으로 아무 수준에나 고정할 수 있다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "ECB · 2024년 운영체계 개편",
      "href": "https://www.ecb.europa.eu/press/pr/date/2024/html/ecb.pr240313~807e240020.en.html",
      "note": "2024년 결정의 예금금리 중심과 적격담보 아래 고정금리 전액 배정을 설명합니다. 이후 매개변수의 현재 값으로 일반화하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Bank of Japan · Monetary policy operating tools",
      "href": "https://www.boj.or.jp/en/about/education/oshiete/seisaku/b42.htm",
      "note": "2024년 3월 정책 틀 변경 이후 단기금리 목표 설명을 읽습니다. 과거 YCC와 현재 운영을 섞지 않습니다."
    }
  ],
  "banking/payment-clearing-settlement": [
    {
      "kind": "공식 문서",
      "label": "CPSS-IOSCO · Principles for financial market infrastructures (2012)",
      "href": "https://www.bis.org/publications/principles-financial-market-infrastructures.pdf",
      "note": "실제PDF 인쇄쪽64·76 이미지를 읽고3.8.1·원칙9각주96·원칙12각주112/113을 확인했습니다. 한국·미국 서비스의 실제 최종성 시각이나 교육용260·10을 이 문서에서 가져온 것은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국은행 · 우리나라의 지급결제제도",
      "href": "https://www.bok.or.kr/portal/main/contents.do?menuNo=200347",
      "note": "공식 본문 및 그림의 소액·거액 시스템 연결을 직접 확인했습니다. 운영 규모·현재 한도·세부 마감 시각이나 미국 제도를 증명하는 자료가 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국은행 · 한은금융망 운영",
      "href": "https://www.bok.or.kr/portal/main/contents.do?menuNo=200727",
      "note": "설명용 묶음 계산의 설계 동기를 실제 운영 설명과 비교했습니다. 본문의 Python을 한은금융망이나 FedNow의 실제 알고리즘이라고 주장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국은행 · 결제완결성 보장대상 지정",
      "href": "https://www.bok.or.kr/portal/main/contents.do?menuNo=200721",
      "note": "법적 근거의 범위와 지정 시스템에 한정된 설명을 직접 읽었습니다. 모든 앱의 완료 표시가 같은 보호를 받거나 착오송금의 반환이 언제나 불가능하다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve Banks · Operating Circular8 (2026-04-01)",
      "href": "https://www.frbservices.org/wp-content/uploads/040126-operating-circular-8.pdf",
      "note": "실제PDF 조문을 읽고 A의10 완료와 별도 반환에 적용했습니다. 반환 요청을 보냈다고 항상 반환이 보장되거나 원이체 기록이 자동 소멸한다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve Banks · FedNow Operating Proceduresv3.6 (2026-04-28)",
      "href": "https://www.frbservices.org/wp-content/uploads/042826-fednow-service-operating-procedures.pdf",
      "note": "실제PDF91~96쪽 반환 과정과 서론을 읽었습니다. 모든 메시지·유동성 관리 송금에 동일한 시간 창이나 고객 자금 가용성 규칙을 적용하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CLS · CLSSettlement 공식 서비스 설명",
      "href": "https://www.cls-group.com/products/settlement/clssettlement/",
      "note": "공식 서비스의 연결 지급 및 자금 효율 설명을 확인했습니다. 모든 통화쌍에 자동 적용되거나 환율·유동성·운영 위험 전체를 없앤다는 뜻은 아닙니다."
    }
  ],
  "markets/bond-pricing-and-yield-curve": [
    {
      kind: "핵심 연구",
      label: "Macaulay · Some Theoretical Problems… (NBER, 1938)",
      href: "https://www.nber.org/books-and-chapters/some-theoretical-problems-suggested-movements-interest-rates-bond-yields-and-stock-prices-united",
      note: "듀레이션 개념의 원전. 수정 듀레이션·볼록성은 이후 확장이므로 이 출처로 함께 인용하지 않음",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 경제금융용어 800선 (2026)",
      href: "https://www.bok.or.kr/portal/bbs/B0000249/view.do?nttId=10096081&menuNo=200765",
      note: "만기수익률·수익률 곡선 등 본문 용어의 한국어 표준 표기를 맞추는 데 사용. 계산식의 근거가 아니라 표기 기준",
    },
  ],
  "markets/equity-claims-and-valuation": [
    {
      kind: "핵심 논문",
      label: "Modigliani·Miller · The Cost of Capital… (AER 48(3), 1958)",
      href: "https://www.aeaweb.org/aer/top20/48.3.261-297.pdf",
      note: "자본구조와 기업 가치의 무관 명제에 대한 근거. 세금·파산 비용·정보 비대칭이 없는 조건에서의 결과이며 현실 자본구조 선택의 정당화 근거가 아님",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 경제금융용어 800선 (2026)",
      href: "https://www.bok.or.kr/portal/bbs/B0000249/view.do?nttId=10096081&menuNo=200765",
      note: "잔여청구권·자기자본수익률·주가수익비율 등 본문 용어의 한국어 표준 표기를 맞추는 데 사용. 계산식의 근거가 아니라 표기 기준",
    },
  ],
  "risk/risk-diversification-and-pricing": [
    {
      kind: "핵심 논문",
      label: "Markowitz · Portfolio Selection (Journal of Finance 7(1), 1952)",
      href: "https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.1952.tb01525.x",
      note: "조합의 분산과 공분산 분해에 대한 근거. 요구 수익률 결정은 이 논문의 범위가 아님. 출판사가 자동 조회를 차단해 서지 사항만 발행처 목록으로 확인",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 경제금융용어 800선 (2026)",
      href: "https://www.bok.or.kr/portal/bbs/B0000249/view.do?nttId=10096081&menuNo=200765",
      note: "체계적 위험·베타·분산투자 등 본문 용어의 한국어 표준 표기를 맞추는 데 사용. 계산식의 근거가 아니라 표기 기준",
    },
  ],
  "risk/capital-requirements-and-systemic-risk": [
    {
      kind: "공식 규격",
      label: "BCBS · Basel III (BIS)",
      href: "https://www.bis.org/bcbs/basel3.htm",
      note: "자본·레버리지·유동성·완충자본 요건의 구성에 대한 근거. 국제 최저 기준이며 특정 국가의 규제 수준이나 효과의 근거는 아님",
    },
    {
      kind: "공식 문서",
      label: "한국은행 · 경제금융용어 800선 (2026)",
      href: "https://www.bok.or.kr/portal/bbs/B0000249/view.do?nttId=10096081&menuNo=200765",
      note: "자기자본비율·위험가중자산·경기순응성 등 본문 용어의 한국어 표준 표기를 맞추는 데 사용. 규제 수치의 근거가 아니라 표기 기준",
    },
  ],
  "polity/collective-choice-problem": [
    {
      kind: "공식 문서",
      label: "Indiana University Ostrom Workshop · Ostrom Design Principles",
      href: "https://ostromworkshop.indiana.edu/courses-teaching/teaching-tools/ostrom-design/index.html",
      note: "자치 관리가 성립하는 조건 목록의 근거. 관찰된 공통점이지 성공의 충분조건이 아니며, 원 저작(Governing the Commons, 1990)은 서지만 확인",
    },
  ],
  "polity/state-and-legitimacy": [
    {
      kind: "보충 읽기",
      label: "Max Weber · Politics as a Vocation (Internet Archive 공개본)",
      href: "https://archive.org/details/weber_max_1864_1920_politics_as_a_vocation",
      note: "영토 내 정당한 강제력 독점이라는 국가 정의의 근거. 개념 규정이며 정당화 논증이 아님",
    },
    {
      kind: "공식 문서",
      label: "Indiana University Ostrom Workshop · Ostrom Design Principles",
      href: "https://ostromworkshop.indiana.edu/courses-teaching/teaching-tools/ostrom-design/index.html",
      note: "앞 글에서 다룬 자치 조건이 규모 때문에 깨진다는 서술을 잇는 참조. 이 글의 주장 자체의 근거는 아님",
    },
  ],
  "constitution/constitutionalism-and-separation": [
    {
      kind: "보충 읽기",
      label: "The Federalist No. 51 (Yale Avalon Project 공개 전문)",
      href: "https://avalon.law.yale.edu/18th_century/fed51.asp",
      note: "권력분립의 근거를 덕성이 아니라 제도적 이해에서 찾는 논증의 출처. 정치 문헌이며 효과에 대한 실증 근거는 아님",
    },
  ],
  "constitution/government-forms": [
    {
      kind: "보충 읽기",
      label: "Linz, The Perils of Presidentialism (Journal of Democracy 1:1, 1990)",
      href: "https://www.journalofdemocracy.org/articles/the-perils-of-presidentialism/",
      note: "대통령제·의원내각제 정의와 이중 정당성·경직성·승자독식 논의의 출처. 비교 논증이며 통제된 실증 연구가 아님",
    },
    {
      kind: "공식 문서",
      label: "대한민국헌법 제63조·제65조·제86조 (한국법제연구원 영문 번역본)",
      href: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG",
      note: "국무총리 임명 동의·해임건의·탄핵소추 조문. 번역본은 참조용이며 법적 효력은 국문 원문에 있음",
    },
  ],
  "elections/electoral-systems": [
    {
      kind: "보충 읽기",
      label:
        "Gallagher, Proportionality, disproportionality and electoral systems (Electoral Studies 10:1, 1991)",
      href: "https://doi.org/10.1016/0261-3794(91)90004-C",
      note: "최소제곱지수의 출처. 저자 본인의 'Election indices' 문서로 귀속을 확인했고 원 논문 전문은 열지 못함",
    },
    {
      kind: "공식 문서",
      label: "대한민국헌법 제41조 (한국법제연구원 영문 번역본)",
      href: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG",
      note: "선거구와 비례대표에 관한 사항을 법률로 정한다는 위임 조항. 번역본은 참조용이며 법적 효력은 국문 원문에 있음",
    },
  ],
  "elections/voting-paradoxes": [
    {
      kind: "보충 읽기",
      label: "Stanford Encyclopedia of Philosophy · Arrow's Theorem",
      href: "https://plato.stanford.edu/entries/arrows-theorem/",
      note: "정리의 진술과 다섯 조건의 정의를 확인한 곳. 2014년 초판, 2025년 12월 7일 개정",
    },
  ],
  "elections/parties-and-interest-groups": [
    {
      kind: "보충 읽기",
      label:
        "Tullock, The Welfare Costs of Tariffs, Monopolies, and Theft (Western Economic Journal 5:3, 1967)",
      href: "https://doi.org/10.1111/j.1465-7295.1967.tb01923.x",
      note: "이전을 얻으려는 지출 자체가 사회적 손실이라는 논증의 출처. 저자 자신이 측정 방법은 제시하지 못한다고 적음",
    },
  ],
  "governance/bureaucracy-and-implementation": [
    {
      kind: "보충 읽기",
      label:
        "Holmström · Milgrom, Multitask Principal–Agent Analyses (JLEO 7 Sp, 1991)",
      href: "https://www.jstor.org/stable/764957",
      note: "한 과업의 보상이 다른 과업에서 주의를 빼 온다는 결과의 출처. 이론 논문이며 실증 검증은 아님",
    },
    {
      kind: "공식 문서",
      label: "대한민국헌법 제75조·제96조 (한국법제연구원 영문 번역본)",
      href: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG",
      note: "위임의 범위 조건과 행정조직 법정주의. 번역본은 참조용이며 법적 효력은 국문 원문에 있음",
    },
  ],
  "governance/international-anarchy": [
    {
      kind: "보충 읽기",
      label: "Jervis, Cooperation Under the Security Dilemma (World Politics 30:2, 1978)",
      href: "https://www.jstor.org/stable/2009958",
      note: "무정부·안보 딜레마 규정과 협력 조건 셋의 출처. 사례를 예시로 든 이론 논문이며 통제된 비교 연구는 아님",
    },
  ],
  "legal-system/what-makes-law-law": [
    {
      kind: "보충 읽기",
      label: "Stanford Encyclopedia of Philosophy · Legal Positivism",
      href: "https://plato.stanford.edu/entries/legal-positivism/",
      note: "승인의 규칙이 관행으로만 존재한다는 구조의 출처. 한 입장의 정리이며 반대 입장도 같은 항목에 있음",
    },
  ],
  "legal-system/rules-standards-and-interpretation": [
    {
      kind: "보충 읽기",
      label: "Kaplow, Rules Versus Standards: An Economic Analysis (Duke L.J. 42:3, 1992)",
      href: "https://doi.org/10.2307/1372840",
      note: "규칙과 기준의 차이를 시점 하나로 좁힌 정의와 비용 비대칭의 출처. 이론 논문이며 실증 검증은 아님",
    },
    {
      kind: "공식 문서",
      label: "대한민국헌법 제12조·제13조 (한국법제연구원 영문 번역본)",
      href: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG",
      note: "처벌의 근거가 법률에 있어야 한다는 것과 그 법률이 행위 시점에 있어야 한다는 것. 번역본은 참조용",
    },
  ],
  "legal-system/precedent-and-legal-change": [
    {
      kind: "보충 읽기",
      label:
        "Stanford Encyclopedia of Philosophy · Precedent and Analogy in Legal Reasoning",
      href: "https://plato.stanford.edu/entries/legal-reas-prec/",
      note: "구속하는 이유와 곁들인 말의 구분, 그리고 따르는 네 이유의 출처. 개념 정리이며 실무 조사는 아님",
    },
  ],
  "private-law/contract-and-enforceable-promise": [
    {
      kind: "보충 읽기",
      label: "Holmes, The Path of the Law (Harvard Law Review 10, 1897)",
      href: "https://en.wikisource.org/wiki/The_Path_of_the_Law",
      note: "계약을 지킬 의무가 배상의 예측을 뜻한다는 규정의 출처. 관점의 제안이며 제도 조사는 아님",
    },
  ],
  "private-law/property-and-entitlement": [
    {
      kind: "보충 읽기",
      label:
        "Calabresi · Melamed, Property Rules, Liability Rules, and Inalienability (Harv. L. Rev. 85:6, 1972)",
      href: "https://www.jstor.org/stable/1340059",
      note: "두 가지 보호 방식의 정의와 구분의 출처. 분석 틀의 제시이며 판례 조사는 아님",
    },
  ],
  "private-law/tort-and-accident-cost": [
    {
      kind: "공식 문서",
      label: "United States v. Carroll Towing Co., 159 F.2d 169 (2d Cir. 1947)",
      href: "https://www.courtlistener.com/opinion/1565896/united-states-v-carroll-towing-co/",
      note: "주의 의무를 확률·손해·부담 세 변수로 적은 판시의 출처. 서지는 확인했고 문장 표현은 참고 문헌으로 대조함",
    },
  ],
  "criminal-law/crime-and-punishment-purpose": [
    {
      kind: "보충 읽기",
      label: "Becker, Crime and Punishment: An Economic Approach (JPE 76:2, 1968)",
      href: "https://www.nber.org/system/files/chapters/c3625/c3625.pdf",
      note: "확률과 형량이 바꿔 쓸 수 있는 값이 아니라는 결과의 출처. 이론 논문이며 정책 효과 측정은 아님",
    },
  ],
  "criminal-law/procedure-and-proof": [
    {
      kind: "공식 문서",
      label: "대한민국헌법 제27조·제12조 (한국법제연구원 영문 번역본)",
      href: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG",
      note: "무죄 추정과 자백의 증거 능력 제한. 번역본은 참조용이며 법적 효력은 국문 원문에 있음",
    },
  ],
  "dispute-resolution/settlement-and-access": [
    {
      kind: "보충 읽기",
      label:
        "Mnookin · Kornhauser, Bargaining in the Shadow of the Law (Yale L.J. 88:950, 1979)",
      href: "https://gretchen.law.nyu.edu/fac-articles/713/",
      note: "법의 역할을 법정 바깥 협상에서 찾는 관점의 출처. 서지와 초록만 확인했고 본문은 열지 못함",
    },
  ],
  "scarcity/scarcity-and-opportunity-cost": [
    {
      kind: "공식 문서",
      label:
        "Lionel Robbins, An Essay on the Nature and Significance of Economic Science (Macmillan, 1932), ch. I, pp. 13–15",
      href: "https://archive.org/details/1932RobbinsEssayOnTheNatureAndSignificanceOfEconomicScienceOCRe",
      note: "고를 일이 생기는 두 조건과 희소성 정의의 출처. 초판 스캔 본문으로 직접 대조함",
    },
  ],
  "scarcity/gains-from-trade": [
    {
      kind: "공식 문서",
      label:
        "David Ricardo, On the Principles of Political Economy, and Taxation (John Murray, 1817), ch. VI",
      href: "https://www.gutenberg.org/ebooks/33310",
      note: "둘 다 절대우위인 쪽이 있어도 교환이 이득이라는 논증의 출처. 초판 본문으로 직접 대조함",
    },
  ],
  "prices/supply-demand-and-equilibrium": [
    {
      kind: "공식 문서",
      label:
        "Alfred Marshall, Principles of Economics, Vol. I, 3rd ed. (Macmillan, 1895), bk. V ch. III, pp. 424·427",
      href: "https://archive.org/details/principlesofecon01marsrich",
      note: "균형의 정의와 안정 조건, 가위의 두 날 비유의 출처. 3판 스캔 본문으로 직접 대조함",
    },
  ],
  "ai/region-agnostic-inference-routing": [
    {
      kind: "공식 문서",
      label:
        "Gateway API Inference Extension — InferencePool (kubernetes-sigs)",
      href: "https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/",
      note: "풀의 정의와 EPP가 보는 지표(KV 사용률·큐 길이·활성 LoRA), GA since v1.0.0 표시. 문서를 직접 열어 확인함",
    },
    {
      kind: "공식 문서",
      label: "OpenRouter Docs — Provider Routing (Load Balancing)",
      href: "https://openrouter.ai/docs/features/provider-routing",
      note: "기본 순서(30초 내 무장애 → 가격 역제곱 가중 → fallback)와 allow_fallbacks 기본값. 문서를 직접 열어 확인함",
    },
    {
      kind: "보충 읽기",
      label:
        "사내 리서치 정리본 — 글로벌 LLM 추론 플랫폼 (2026-09-15, v4)",
      note: "여섯 단계 구분·시간 배분·장애 흡수 사다리의 출처. 6축 딥리서치를 외부 모델과 3라운드 교차 검증해 49건을 반영한 정리본이며, 공개되지 않은 내부 문서라 링크를 걸지 않음",
    },
  ],
  "ai/inference-failure-absorption": [
    {
      kind: "핵심 논문",
      label: "The Llama 3 Herd of Models (arXiv:2407.21783) — 신뢰성 절",
      href: "https://arxiv.org/abs/2407.21783",
      note: "54일 466건·예기치 않은 419건·약 78퍼센트가 하드웨어·CPU 두 건. HTML 본문에서 직접 확인함",
    },
    {
      kind: "보충 읽기",
      label:
        "사내 리서치 정리본 — 글로벌 LLM 추론 플랫폼 (2026-09-15, v4) 및 상세 보고서 04·06",
      note: "계층별 시간 상수·상태별 권위 저장소·포화 처리의 출처. 상세 보고서 초판은 포화를 준비 상태로 표현하라고 적었고 교차 검증에서 뒤집혀 정오표에 실렸으며, 이 글은 정정된 쪽을 따름. 공개 문서가 아니라 링크를 걸지 않음",
    },
  ],
  "ai/own-vs-rent-inference-capacity": [
    {
      kind: "공식 문서",
      label: "Modal — Beyond GPU utilization: a guide to measuring what matters",
      href: "https://modal.com/blog/gpu-utilization-guide",
      note: "가동률 세 정의의 구분. 글을 직접 열어 문구를 확인함",
    },
    {
      kind: "보충 읽기",
      label:
        "사내 리서치 정리본 — 글로벌 LLM 추론 플랫폼 (2026-09-15, v4) 및 상세 보고서 05",
      note: "월 비용·시세·전력 비중 수치의 출처이며 이 글이 모든 산술을 재검산함. 상세 보고서 초판은 소유 60퍼센트와 임대 정가를 직접 견주고 보편 임계값을 제시했으나 교차 검증에서 정정됐고, 이 글은 정정된 쪽을 따름. 공개 문서가 아니라 링크를 걸지 않음",
    },
  ],
  "ai/inference-stack-standard-levels": [
    {
      kind: "공식 문서",
      label:
        "Gateway API Inference Extension — InferencePool (kubernetes-sigs)",
      href: "https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/",
      note: "아래층이 표준이라는 근거와 GA since v1.0.0 표시. 문서를 직접 열어 확인함",
    },
    {
      kind: "핵심 연구",
      label:
        "Red Hat Developer — Intelligent inference scheduling with llm-d (2026-06-11)",
      href: "https://developers.redhat.com/articles/2026/06/11/intelligent-inference-scheduling-llm-d-red-hat-ai",
      note: "16×H100·복제본 8개·60rps에서 첫 토큰 35초→120밀리초, 처리량 +151%, 요청 지연 −35%. 글을 직접 열어 확인함",
    },
    {
      kind: "보충 읽기",
      label:
        "사내 리서치 정리본 — 글로벌 LLM 추론 플랫폼 (2026-09-15, v4) 및 상세 보고서 01",
      note: "세 수준 구분과 버전 조합 규칙의 출처. 상세 보고서 초판은 GA 시점과 엔진 종속 여부를 잘못 적었고 교차 검증에서 정정됐으며, 벤치마크 수치는 원문과 맞지 않아 이 글이 원문 쪽을 씀. 공개 문서가 아니라 링크를 걸지 않음",
    },
  ],
  "ai/cross-review-error-classes": [
    {
      kind: "보충 읽기",
      label:
        "사내 리서치 정리본과 교차 검증 왕복 기록 (2026-09-15, v4)",
      note: "라운드별 지적 수는 기록 파일의 항목 헤딩을 직접 세어 25·17·8이고 그중 철회 2건을 빼면 약 49건으로 정리본의 집계와 맞음. 다만 정리본이 2라운드 구성을 한 곳에서는 11+5, 다른 곳에서는 6+5로 적어 자체 불일치가 있어 본문에는 반올림한 값만 씀. 공개 문서가 아니라 링크를 걸지 않음",
    },
  ],
  "prices/surplus-and-efficiency": [
    {
      kind: "보충 읽기",
      label: "앞 글과 같은 시장의 숫자",
      href: "/economics/prices/supply-demand-and-equilibrium#adjustment",
      note: "낼 수 있는 금액 10·9·8·7·6·5와 드는 값 4·5·6·7·8·9를 그대로 이어받아 채점함. 이 글의 모든 수치는 그 두 줄에서 계산한 것이며 외부 자료가 아님",
    },
  ],
  "prices/prices-as-information": [
    {
      kind: "핵심 논문",
      label:
        "F. A. Hayek, “The Use of Knowledge in Society”, American Economic Review XXXV(4), 1945, pp. 519–530",
      href: "https://www.econlib.org/library/Essays/hykKnw.html",
      note: "지식이 흩어져 있다는 진단과 값 체계를 정보 전달 장치로 보는 기능. 온라인 전문을 직접 열어 세 대목과 서지를 확인함",
    },
    {
      kind: "보충 읽기",
      label: "앞 두 글과 같은 시장의 숫자",
      href: "/economics/prices/surplus-and-efficiency#total-surplus",
      note: "낼 수 있는 금액 10·9·8·7·6·5와 드는 값 4·5·6·7·8·9를 그대로 이어받아 충격 전후를 계산함",
    },
  ],
  "market-failure/externalities-and-social-cost": [
    {
      kind: "핵심 논문",
      label:
        "R. H. Coase, “The Problem of Social Cost”, The Journal of Law and Economics, Volume III, October 1960",
      href: "https://www.law.uchicago.edu/sites/default/files/file/coase-problem.pdf",
      note: "문제의 상호성, 거래비용이 0일 때의 결과, 거래에 드는 것들의 열거, 초기 배치가 효율에 영향을 준다는 §VI 결론. 원문 PDF를 내려받아 직접 대조함",
    },
    {
      kind: "보충 읽기",
      label: "앞 세 글과 같은 시장의 숫자",
      href: "/economics/prices/prices-as-information#sufficient",
      note: "낼 수 있는 금액 10·9·8·7·6·5와 장부에 적히는 값 4·5·6·7·8·9를 그대로 이어받아 빠진 몫 2를 더해 계산함",
    },
  ],
  "market-failure/public-goods-and-commons": [
    {
      kind: "핵심 논문",
      label:
        "Paul A. Samuelson, “The Pure Theory of Public Expenditure”, The Review of Economics and Statistics, Vol. 36, No. 4, November 1954, pp. 387–389",
      href: "https://www.jstor.org/stable/1925895",
      note: "같이 누리는 재화의 정의, 세로 합, 어떤 분권적 가격 체계로도 정할 수 없다는 §3, 거짓 신호 대목. 원문 세 쪽을 내려받아 직접 대조함",
    },
    {
      kind: "핵심 논문",
      label:
        "Garrett Hardin, “The Tragedy of the Commons”, Science, Vol. 162, No. 3859, 13 December 1968, pp. 1243–1248",
      href: "https://doi.org/10.1126/science.162.3859.1243",
      note: "한 마리를 더 들일 때 이득은 혼자 갖고 손해는 나눠 진다는 셈. 인용 두 문장과 서지는 저자 재단 전재본으로 확인했고 학술지 원문은 열지 못함",
    },
    {
      kind: "보충 읽기",
      label: "네 칸 분류와 자치 관리 조건은 정치 쪽 글이 정본",
      href: "/politics/polity/collective-choice-problem#two-kinds-of-choice",
      note: "배제성·경합성의 정의와 무임승차의 유인 구조, Ostrom 설계 원칙은 그쪽에 있고 이 글은 각 칸의 수량만 셈",
    },
  ],
  "market-failure/information-asymmetry": [
    {
      kind: "핵심 논문",
      label:
        "George A. Akerlof, “The Market for ‘Lemons’”, The Quarterly Journal of Economics, Vol. 84, No. 3, August 1970, pp. 488–500",
      href: "https://doi.org/10.2307/1879431",
      note: "정보 비대칭 정의, 좋은 물건 주인이 묶인다는 대목, 악화·양화 비유의 단서, §IV 상쇄 장치 열거. 원문 열세 쪽을 내려받아 직접 대조함",
    },
    {
      kind: "핵심 논문",
      label:
        "Michael Spence, “Job Market Signaling”, The Quarterly Journal of Economics, Vol. 87, No. 3, August 1973, pp. 355–374",
      href: "https://doi.org/10.2307/1882010",
      note: "A Critical Assumption 소절과 논문 자신의 수치에서 모두가 손해가 된다는 계산. 원문을 내려받아 직접 대조함",
    },
    {
      kind: "핵심 논문",
      label:
        "Kenneth J. Arrow, “Uncertainty and the Welfare Economics of Medical Care”, The American Economic Review, Vol. LIII, No. 5, December 1963",
      href: "https://www.jstor.org/stable/1812044",
      note: "§V.C.1의 통제 밖 조건·자기부담 대목과 좋은 위험이 빠져나간다는 대목. 세계보건기구 2004년 전재본으로 대조했고 그 판본은 줄임표가 있는 발췌본임",
    },
    {
      kind: "보충 읽기",
      label: "앞 세 글과 같은 자리에서 이어지는 계산",
      href: "/economics/prices/prices-as-information#sufficient",
      note: "값 하나가 사정을 옳게 전달하기 위한 조건 가운데 양쪽이 같은 물건을 본다는 전제를 이 글이 풂",
    },
  ],
  "macro/aggregation-and-composition": [
    {
      kind: "핵심 논문",
      label:
        "John Maynard Keynes, The General Theory of Employment, Interest and Money (1936) · 프랑스어판 서문, 제7장, 제10장",
      href: "https://gutenberg.net.au/ebooks03/0300071h/printall.html",
      note: "부분의 결론을 전체로 옮기는 오류, 절약이 스스로를 무너뜨린다는 문장, 승수 정의와 누출, 80퍼센트에 크기 5라는 예시. 호주 구텐베르크 전문으로 직접 대조함",
    },
    {
      kind: "보충 읽기",
      label: "총량이 같아도 누구에게 갔는지가 다르다는 앞 글의 지적",
      href: "/economics/prices/surplus-and-efficiency#not-fairness",
      note: "이 글의 마지막 절이 그 지적을 총량을 읽는 쪽의 한계로 옮겨 씀",
    },
    {
      kind: "보충 읽기",
      label: "여럿의 뜻을 하나로 모으는 절차 쪽의 문제",
      href: "/politics/elections/voting-paradoxes",
      note: "여기서는 더하는 일이 잘 정의되어 있고 더한 뒤가 문제인데 그쪽은 더하는 방법 자체가 여럿임",
    },
  ],
  "firms/why-firms-exist": [
    {
      kind: "핵심 논문",
      label:
        "R. H. Coase, “The Nature of the Firm”, Economica, New Series, Vol. 4, No. 16 (Nov. 1937), pp. 386–405",
      href: "https://www.jstor.org/stable/2626876",
      note: "값 기구를 쓰는 데 값이 든다는 출발점, 약속이 하나로 대체된다는 정리, 안팎의 한계값이 같아지는 경계 조건의 출처. JSTOR 스캔본 OCR 본문을 직접 읽어 인용을 대조했고 쪽 번호가 복원되지 않아 문장별 쪽수는 적지 않았음",
    },
  ],
  "firms/scale-and-cost-structure": [
    {
      kind: "핵심 논문",
      label:
        "Allyn A. Young, “Increasing Returns and Economic Progress”, The Economic Journal, Vol. 38, No. 152 (Dec. 1928), pp. 527–542",
      href: "https://www.jstor.org/stable/2224835",
      note: "돌아가는 생산 방법이 수확 체증의 본체라는 출발점(530쪽), 분업이 분업에 달려 있다는 정리와 큰 시장의 정의(533쪽), 회사 크기의 한계와 산업의 분화(539쪽), 수확 체증에서 독점으로 가는 추론이 흔한 오류라는 경고(527쪽)의 출처. 스캔본을 전면 OCR해 읽고 인용 문장은 쪽 이미지로 대조했음",
    },
  ],
  "firms/market-power-and-markup": [
    {
      kind: "핵심 논문",
      label:
        "A. Cournot, 『Researches into the Mathematical Principles of the Theory of Wealth』 (1838), N. T. Bacon 영역 1897, 제5장 Of Monopoly, 56–61쪽",
      href: "https://archive.org/details/researchesintom00fishgoog",
      note: "값을 고르는 쪽의 조건 식 (1)(56쪽), 만드는 값을 넣은 식 (2)(57쪽), 값이 한계비용보다 반드시 높다는 §29(59쪽)의 출처. Internet Archive 스캔을 받아 제5장을 읽고 식과 인용 문장은 쪽 이미지로 대조했음",
    },
    {
      kind: "보충 읽기",
      label:
        "A. P. Lerner, “The Concept of Monopoly and the Measurement of Monopoly Power”, The Review of Economic Studies, Vol. 1, No. 3 (1934), pp. 157–175",
      href: "https://academic.oup.com/restud/article-abstract/1/3/157/1518702",
      note: "값과 한계비용의 틈을 지표로 쓴 출처로 알려진 글. 접근할 수 있는 전문을 찾지 못해 읽지 못했고, 그래서 이 글의 어떤 주장도 여기에 기대지 않는다. 본문의 틈 식은 Cournot 57쪽 식 (2)에서 직접 옮겨 적은 것",
    },
  ],
  "circuits/lumped-circuit-and-conservation": [
    {
      kind: "핵심 논문",
      label: "G. Kirchhoff, ‘Ueber den Durchgang eines elektrischen Stromes durch eine Ebene, insbesondere durch eine kreisförmige’ (1845), 497–514쪽",
      href: "https://zenodo.org/records/2422851",
      note: "원문 스캔의 499쪽에서 정상 상태 금속판의 닫힌 경계로 드나드는 흐름의 합이 0이라는 문장과 적분식을 확인했다. 이 글의 12 V 저항망은 원문 실험이 아니라 교육용 가정이다.",
    },
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 6.002 Circuits and Electronics, Lecture 1 (2007)",
      href: "https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf",
      note: "집중 회로 근사의 전하 축적·변하는 자기 선속 조건, 전하 보존과 패러데이 법칙에서 회로식을 얻는 설명의 출처. 논문 증거와 교육용 모델을 구분한다.",
    },
    {
      "kind": "공개 강의",
      "label": "MIT 6.002 Lecture 2 · 수동 부호 규칙과 vi",
      "href": "https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/99b2a662083d1b1f487c55ea0f0d0220_6002_l2.pdf",
      "note": "9쪽의 실제 소비 전력 부호 규칙을 72=36+18+18 mW 검산에 적용합니다. 사례 숫자는 가정입니다."
    },
],
  "semiconductors/bands-and-doping": [
    {
      kind: "핵심 논문",
      label: "A. H. Wilson, ‘The Theory of Electronic Semi-Conductors,’ Proceedings of the Royal Society A 133 (1931), 458–491",
      href: "https://ethw-images.s3.us-east-va.perf.cloud.ovh.us/ieee/b/b4/P3_Proc._R._Soc._Lond._A-1931-Wilson-458-91.pdf",
      note: "원문 스캔 460쪽에서 허용·금지 에너지띠와 꽉 찬 아래 띠에서 작은 전기장만으로 전류가 나지 않는 논의를 직접 확인했다. 현대 실리콘 농도 수치의 출처는 아니다.",
    },
    {
      kind: "핵심 논문",
      label: "W. Shockley, ‘The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors,’ Bell System Technical Journal 28 (1949), 435–489",
      href: "https://vtda.org/pubs/BSTJ/vol28-1949/articles/bstj28-3-435.pdf",
      note: "435쪽 서론의 도너·억셉터 농도와 n형·p형 접합 출발점을 원문 스캔에서 확인했다. 본문의 10^16 cm^-3 설정은 이 글의 가정이다.",
    },
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 6.012 Lecture 2, Semiconductor Physics (2005)",
      href: "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/e1a94598c1fd641fc15636a9ad14de1a_lec2.pdf",
      note: "실리콘 원자 밀도, 전자·정공 짝 생성, 열평형 곱, 300 K 고유 농도 10^10 cm^-3, 도너·억셉터 계산의 교육용 기준을 확인했다.",
    },
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 6.012 Tutorial 1 (Spring 2009)",
      href: "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/70b3d239e4037abf0856a71f4ef22616_MIT6_012S09_tutor01.pdf",
      note: "300 K의 n_i=10^10 cm^-3와 실리콘 띠틈 1.1 eV를 명시한 예제의 출처. 본문의 10^16 도핑 수치는 별도 가정이다.",
    },
  ],
  "devices/pn-junction-and-rectification": [
    { kind: "핵심 논문", label: "W. Shockley, ‘The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors,’ BSTJ 28 (1949), 461쪽 식 (4.18)–(4.22)", href: "https://vtda.org/pubs/BSTJ/vol28-1949/articles/bstj28-3-435.pdf", note: "원문 스캔 461쪽에서 캐리어별 전류식과 합친 식을 확인했다. 1 pA·300 K·0.5/0.6 V는 이 글의 이상 접합 가정이다." },
    { kind: "공개 강의", label: "MIT OCW 6.720J Lecture 14, p-n Junction Diode I–V Characteristics (2007)", href: "https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/369ddf4748729cfe5fe48c7528fd1d42_lecture14.pdf", note: "현대 표기의 이상 접합 전류식과 순·역방향 장벽 설명을 대조했다." },
  ],
  "devices/mos-capacitor-and-inversion": [
    { kind: "공식 문서", label: "D. Kahng, US Patent 3,102,230, ‘Electric Field Controlled Semiconductor Device’ (1960 출원·1963 등록)", href: "https://patents.google.com/patent/US3102230A/en", note: "명세서 1–2쪽과 도 1A의 산화막 위 전극·전압원 구조를 확인했다. 특허의 다접합 회로와 본문의 두 단자 축전기는 구분한다." },
    { kind: "공개 강의", label: "MIT OCW 6.012 Lecture 9, ‘MOS Capacitors I’ (2009), 23·30쪽", href: "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf", note: "면적당 산화막 용량 εox/tox와 반전 전하식, 축적·공핍·반전 상태를 확인했다. 10 nm·100 µm²·문턱 0.5 V는 본문 가정이다." },
  ],
  "devices/mosfet-regions-and-transfer": [
    { kind: "공개 강의", label: "MIT OCW 6.720J Lecture 25, ‘Long MOSFET’ (2007), 10·13쪽", href: "https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/8ad0e553fbdaed10f6102b04451e547e_lecture25.pdf", note: "국소 반전 전하와 선형 영역 전류 적분을 공식 PDF로 확인했다. k와 전압 수치는 본문의 가정이다." },
    { kind: "공개 강의", label: "MIT OCW 6.720J Lecture 26, ‘Long MOSFET’ (2007), 5·7·8쪽", href: "https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/59850a07f95e9f50d32185eb46503460_lecture26.pdf", note: "핀치오프와 포화 경계·제곱식을 공식 PDF에서 직접 확인했다. 실제 소자의 완전히 평평한 출력 곡선을 주장하지 않는다." },
  ],
  "devices/switching-energy-and-leakage": [
    { kind: "공개 강의", label: "MIT OCW 6.012 Lecture 14, ‘CMOS’ (2005), 22–24쪽", href: "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/6bec6dd1b07b02a1a84098b78f068cc3_lec14.pdf", note: "공급 CV², 저장·방전의 각 ½CV², 완전 주기당 CV²와 평균 전력식을 확인했다. 본문 숫자와 누설은 가정이다." },
  ],
  "circuits/resistance-and-power-dissipation": [
    { kind: "공식 문서", label: "Vishay D/CRCW e3, document 20035 (14-Apr-2026), 1–2쪽", href: "https://www.vishay.com/docs/20035/dcrcwe3.pdf", note: "D11/CRCW0603의 저항 범위, 표준 0.10 W와 확장 0.125 W, 열 조건을 공식 PDF에서 확인했다. 회로 숫자는 가정이다." },
    {
      "kind": "공개 강의",
      "label": "MIT 6.002 Lecture 22 · 저항의 P=VI=V²/R",
      "href": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/62cc78db14ad37dede55c361711ba2ae_6002_l22.pdf",
      "note": "4쪽 Example 1의 부품별 전력식에 가상 12 V 회로의 각 전압·전류를 넣습니다."
    },
],
  "circuits/storage-elements-and-transients": [
    { kind: "공개 강의", label: "MIT OCW 6.002 Lecture 12, ‘Capacitors and First-Order Systems’, 4–5·10–11쪽", href: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/84f4b553fc6a1ddd7007465041c4e213_6002_l12.pdf", note: "축전기 q=Cv, i=C dv/dt와 RC 지수 응답·초기 조건을 공식 강의안에서 확인했다. 수치는 글의 가정이다." },
    { kind: "공개 강의", label: "MIT OCW 8.02 Chapter 11, ‘Inductance’ (2007), 10·17–19쪽", href: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/f5c35823a7faac0d893754ab42804e7e_chap11inductance.pdf", note: "½LI², RL 상승식과 L/R 시간 상수·자기장 에너지 장부를 공식 PDF에서 확인했다. 1 H는 가정이다." },
  ],
  "circuits/steady-state-and-impedance": [
    { kind: "공개 강의", label: "MIT OCW 6.002 Lecture 17, ‘The Impedance Model’, 4–7쪽", href: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf", note: "정현파 정상 상태의 복소 진폭·R/C/L 임피던스·RC 분압을 원본 PDF에서 확인했다. 본문 수치는 가정이다." },
  ],
  "circuits/frequency-shaping-and-bode": [{kind:"공개 강의",label:"MIT OCW 6.002 Lecture 18, ‘Filters’, 2–3·7쪽",href:"https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf",note:"저역·고역 통과 회로 연결을 원본 PDF에서 확인했다. 본문 수치는 가정이다."},{kind:"공개 강의",label:"MIT OCW 6.002 Lecture 17, ‘The Impedance Model’, 4쪽",href:"https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf",note:"RC 전달 함수와 진폭·위상 식을 확인했다."}],
  "circuits/feedback-gain-and-stability": [
    {
      "kind": "공식 문서",
      "label": "TI/Burr-Brown Graeme 1991, ‘Feedback Plots Define Op Amp AC Performance’, 1–2쪽",
      "href": "https://www.ti.com/lit/an/sboa015/sboa015.pdf",
      "note": "폐루프 이득과 루프 교차·위상 여유를 원본에서 확인했다. 본문 증폭기는 가정이다."
    }
  ],
  "semiconductors/wafer-and-planar-process": [
    {
      "kind": "공식 문서",
      "label": "Hoerni 미국 특허 US3025589, 원본 2–4쪽·도 1–10",
      "href": "https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf",
      "note": "산화막 마스크와 접합 보호를 원본 특허로 확인했다. 본문 치수는 가정이다."
    }
  ],
  "semiconductors/lithography-and-resolution": [
    {
      "kind": "공식 문서",
      "label": "ASML, Six crucial steps in semiconductor manufacturing",
      "href": "https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps",
      "note": "Photoresist coating·Lithography·Etch 절에서 기록·현상·아래 층 가공을 구분했다. 본문 치수는 가정이다."
    },
    {
      "kind": "공식 문서",
      "label": "ASML, ‘The Rayleigh criterion for resolution’, CD 식",
      "href": "https://www.asml.com/en/technology/lithography-principles/rayleigh-criterion",
      "note": "CD=k1λ/NA와 인자의 뜻을 확인했다. 값은 가정이다."
    },
    {
      "kind": "공식 문서",
      "label": "ASML, ‘Measuring accuracy’, 오버레이·초점",
      "href": "https://www.asml.com/en/technology/lithography-principles/measuring-accuracy",
      "note": "층 정렬과 계측 표적·식각 뒤 측정을 확인했다."
    }
  ],
  "semiconductors/doping-and-thermal-budget": [
    {
      "kind": "공개 강의",
      "label": "MIT OCW 6.152J Lecture 4, Diffusion, 6–7·14–15쪽",
      "href": "https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/dbad8f442ecf1244e2a257de2671d0e2_lecture4.pdf",
      "note": "가우스·erfc 경계 조건, a=2√Dt, 접합 깊이를 확인했다."
    },
    {
      "kind": "공개 강의",
      "label": "MIT OCW 6.774 Lecture 9 transcript, 2–3쪽",
      "href": "https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/149Phbk_yJVmBm_KPM035Wd40as-4iVuA_transcript.pdf",
      "note": "단계별 Dt 합산과 열 예산의 가정·예외를 확인했다."
    }
  ],
  "semiconductors/interconnect-and-rc-delay": [
    {
      "kind": "공개 강의",
      "label": "MIT OCW 6.884 L04 Wires, 원본 11–13쪽",
      "href": "https://ocw.mit.edu/courses/6-884-complex-digital-systems-spring-2005/fd75994e0ea84378705dd12ee8c16326_l04_wires.pdf",
      "note": "분포 RC, π 배선, Elmore 첫 모멘트 식과 길이 의존성을 확인했다."
    },
    {
      "kind": "공식 문서",
      "label": "Intel Technology Journal 2002 Vol. 6 No. 2, 원본 10–11쪽",
      "href": "https://www.intel.com/content/dam/www/public/us/en/documents/research/2002-vol06-iss-2-intel-technology-journal.pdf",
      "note": "동일 피치 공정 비교의 구리·낮은 유전율 배선 개선을 확인했다."
    }
  ],
  "semiconductors/yield-defect-and-packaging": [
    {
      "kind": "공개 강의",
      "label": "MIT OCW 2.830J Lecture 10 Yield Modeling, 원본 6–7·14·17·30쪽",
      "href": "https://ocw.mit.edu/courses/2-830j-control-of-manufacturing-processes-sma-6303-spring-2008/4aff1e21de13870355ef44dbe71f45c6_lecture10.pdf",
      "note": "기능·파라미터 수율, 임계 면적, 포아송 가정을 확인했다."
    },
    {
      "kind": "공식 문서",
      "label": "Intel Tech 101 How Silicon Die Become Chip Packages, 2025-02-19",
      "href": "https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html",
      "note": "패키징 역할과 조립·시험의 단계별 순서를 확인했다."
    }
  ],
  "embedded/mcu-memory-map-and-registers": [
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi, RP2040 Datasheet, address map and SIO registers",
      "href": "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
      "note": "build 3184e62-clean의 §2.2 주소 맵, §2.3.1 SIO 및 §2.19 IO_BANK0 표에서 주소와 동작을 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi Pico SDK Hardware GPIO API",
      "href": "https://www.raspberrypi.com/documentation/pico-sdk/hardware.html",
      "note": "gpio_set_function과 gpio_set_dir 등의 공식 API 사용 경로를 제시합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Pico SDK 2.2.0 · 고정 commit a1438dff",
      "href": "https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_gpio/gpio.c",
      "note": "gpio_init의 입력 방향→래치 낮음→SIO 선택과 gpio.h의 mask 계산·OE_SET·OUT_SET 쓰기를 연결합니다."
    }
  ],
  "embedded/interrupts-and-latency-budget": [
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi, RP2040 Datasheet, GPIO and interrupt chapters",
      "href": "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
      "note": "build 3184e62-clean §2.3.2·§2.19.3·§2.19.5의 IO_IRQ_BANK0, 코어별 허용, 에지 래치·소거를 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Arm, Cortex-M0+ Devices Generic User Guide",
      "href": "https://documentation-service.arm.com/static/5f04aadfdbdee951c1cdc957",
      "note": "DUI 0662A §4.2.6·§4.2.7, 인쇄 4-6·4-7쪽에서 주변 장치 요청 유지와 비활성 상태에서도 가능한 pending을 구분합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Pico SDK 2.2.0 · GPIO 사건 등록과 기본 처리기",
      "href": "https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_gpio/gpio.c#L153-L203",
      "note": "콜백 등록→사건 허용→IRQ 허용과 기본 처리기의 상태 읽기→소거→콜백 호출을 GPIO2·event 8에 적용합니다."
    }
  ],
  "embedded/timers-and-sampling": [
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi, RP2040 Datasheet, Timer and SAR ADC",
      "href": "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
      "note": "build 3184e62-clean §4.6.1–4.6.3의 64비트 계수기·하위 32비트 알람과 §4.9.2.1의 채널 선택·START_ONCE·96주기 완료를 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "MIT OpenCourseWare RES.6-007, Lecture 16, Sampling (2011)",
      "href": "https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/8708ec068ebdea2c4ee2f38fad39fb83_MITRES_6_007S11_lec16.pdf",
      "note": "원본 1–2쪽의 샘플 빈도 절반 경계와 그 위 입력의 앨리어싱 설명입니다."
    },
    {
      "kind": "공식 코드",
      "label": "Pico SDK 2.2.0 · time.c·time.h·adc.h 고정 원문",
      "href": "https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/common/pico_time/time.c",
      "note": "delay −10000의 첫 등록과 이전 목표 기준 갱신을 추적하고 adc_read의 시작·READY 대기·결과 반환에 연결합니다."
    }
  ],
  "embedded/serial-buses-and-tradeoffs": [
    {
      "kind": "공식 문서",
      "label": "NXP, UM10204 I²C-bus specification and user manual Rev. 7.0 (2021)",
      "href": "https://www.nxp.com/docs/en/user-guide/UM10204.pdf",
      "note": "Rev. 7.0 §3.1.4–3.1.6·3.1.9–3.1.10, 인쇄 9–14쪽에서 시작·종료·응답·스트레칭·결합 거래의 방향 변경을 대조합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi Pico SDK Hardware APIs, I2C/SPI/UART/GPIO",
      "href": "https://www.raspberrypi.com/documentation/pico-sdk/hardware.html",
      "note": "I²C·SPI·UART API와 GPIO 기능 선택 표 및 UART 보율 설정 예를 제공합니다."
    },
    {
      "kind": "공식 코드",
      "label": "Pico SDK 2.2.0 · 고정 commit a1438dff의 i2c.c·i2c.h",
      "href": "https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_i2c/i2c.c",
      "note": "7비트 주소·nostop·restart_on_next·마지막 STOP·읽기 결과와 _until의 절대 시각을 같은 거래에 적용합니다."
    }
  ],
  "embedded/scheduling-and-real-time": [
    {
      "kind": "공식 문서",
      "label": "FreeRTOS, RTOS Fundamentals and Task Priorities",
      "href": "https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals",
      "note": "공식 가이드는 준비된 최고 우선순위 작업의 실행과 실시간 마감의 의미를 설명합니다."
    },
    {
      "kind": "공식 문서",
      "label": "FreeRTOS Reference Manual v10, vTaskDelayUntil()",
      "href": "https://www.freertos.org/media/2018/FreeRTOS_Reference_Manual_V10.0.0.pdf",
      "note": "절대 시각까지 블록하는 vTaskDelayUntil과 상대 vTaskDelay의 차이를 설명합니다."
    },
    {
      "kind": "공식 문서",
      "label": "FreeRTOS, FreeRTOS mutexes",
      "href": "https://freertos.org/Real-time-embedded-RTOS-mutexes.html",
      "note": "뮤텍스의 기본 우선순위 상속과 ISR에서 뮤텍스를 기다리지 않는 이유를 설명합니다."
    },
    {
      "kind": "공식 코드",
      "label": "FreeRTOS Kernel V11.2.0 · tasks.c 원문",
      "href": "https://github.com/FreeRTOS/FreeRTOS-Kernel/blob/0adc196d4bd52a2d91102b525b0aafc1e14a2386/tasks.c",
      "note": "일반 한 코어 준비 목록·xTaskDelayUntil·xTaskPriorityInherit에 동일 우선순위와 시각을 대입합니다."
    },
    {
      "kind": "공식 코드",
      "label": "FreeRTOS Kernel V11.2.0 · tasks.c 원문",
      "href": "https://github.com/FreeRTOS/FreeRTOS-Kernel/blob/0adc196d4bd52a2d91102b525b0aafc1e14a2386/tasks.c",
      "note": "일반 한 코어 준비 목록·xTaskDelayUntil·xTaskPriorityInherit에 동일 우선순위와 시각을 대입합니다."
    }
  ],
  "embedded/firmware-update-and-recovery": [
    {
      "kind": "공식 문서",
      "label": "MCUboot, Bootloader design",
      "href": "https://docs.mcuboot.com/design.html",
      "note": "지원되는 swap의 TEST·REVERT·PERM, image OK와 중단된 swap 재개, 서명·무결성 검사를 설명합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Raspberry Pi, RP2040 Datasheet, XIP flash and Bootrom",
      "href": "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
      "note": "외부 QSPI 플래시 XIP와 bootrom의 다음 단계 부팅, USB BOOTSEL 경로를 설명합니다."
    },
    {
      "kind": "공식 코드",
      "label": "MCUboot v2.2.0 · bootutil_public.c·swap_scratch.c 원문",
      "href": "https://github.com/mcu-tools/mcuboot/tree/2d61c318933819a0f4954fb2a5a957a62c6128ce/boot/bootutil/src",
      "note": "boot_swap_tables와 pending/confirmed API, 세 복사 및 swap_read_status_bytes의 진행 복원을 대조합니다."
    }
  ],
  "labor/wage-floor-natural-experiment": [
    {
      kind: "핵심 논문",
      label:
        "David Card · Alan B. Krueger, “Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania”, The American Economic Review, Vol. 84, No. 4 (Sept. 1994), pp. 772–793",
      href: "https://davidcard.berkeley.edu/papers/njmin-aer.pdf",
      note: "겨루는 예측을 못 박은 772쪽 첫 문단, 고용 변화를 담은 780쪽 표 3, 한 끼 값을 담은 788쪽 표 7, 두 설명 모두로 설명하기 어렵다는 792쪽 맺음 문장의 출처. 저자 공개본 PDF를 읽고 표와 인용 문장은 쪽 이미지로 대조했음",
    },
  ],
  "labor/measuring-the-spread": [
    {
      kind: "핵심 논문",
      label:
        "M. O. Lorenz, “Methods of Measuring the Concentration of Wealth”, Publications of the American Statistical Association, Vol. 9, No. 70 (June 1905), pp. 209–219",
      href: "https://archive.org/details/jstor-2276207",
      note: "계급별 표로는 판정할 수 없다는 210쪽, 그리는 방법과 활의 규칙을 적은 217쪽, 프로이센 자료의 214쪽 표, 곡선이 엇갈리는 반례의 218쪽이 출처. JSTOR Early Journal Content 공개본을 읽고 표와 인용 문장은 쪽 이미지로 대조했음",
    },
  ],
  "macro/why-per-head-stalls": [
    {
      kind: "핵심 논문",
      label:
        "T. R. Malthus, 『An Essay on the Principle of Population』, London: J. Johnson, 1798 (초판), 14·21·25~28쪽",
      href: "https://archive.org/details/essayonprincipl00malt",
      note: "두 비율의 선언(14쪽), 25년마다 두 배의 근거(21쪽), 섬의 100년 셈과 7,700만 명(25~26쪽), 세계로 넓힌 512 대 10(28쪽)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 14·26쪽은 쪽 이미지로 대조, 나머지는 OCR 쪽 머리글로 확인했음",
    },
  ],
  "macro/what-the-price-level-hides": [
    {
      kind: "핵심 논문",
      label:
        "Irving Fisher, 『The Purchasing Power of Money: Its Determination and Relation to Credit, Interest and Crises』, New York: Macmillan, 개정판(1926년 인쇄), 2장 16~21쪽",
      href: "https://archive.org/details/purchasingpower00fish",
      note: "설탕 거래와 교환방정식의 정의(16쪽), 빵·석탄·옷감 1억 달러와 500만×20(17~18쪽), 세 가지 변형(19~20쪽), 돈의 양은 세 요인 중 하나일 뿐이라는 경고(21쪽)의 출처. Internet Archive 공개본 2장을 읽고 21쪽 문장은 쪽 이미지로 대조했음. 1911년 초판이 아니라 개정판 사본",
    },
  ],
  "macro/who-counts-as-unemployed": [
    {
      kind: "공식 규격",
      label:
        "ICLS, 「Resolution concerning statistics of work, employment and labour underutilization」, 19차 결의(2013) · 21차 회의(2023) 개정, 47·51·55·73항",
      href: "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@stat/documents/normativeinstrument/wcms_230304.pdf",
      note: "실업의 세 조건(47항), 잠재 노동력의 정의(51항), 확장 노동력(55항), LU1~LU4의 식과 둘 이상을 쓰라는 요구(73항 c)의 출처. ILO 공개 PDF를 읽고 47항은 쪽 이미지로 대조했음. 본문의 100명 보기와 백분율은 이 글이 만든 설명용 수치",
    },
  ],
  "macro/what-ricardo-assumed": [
    {
      kind: "핵심 논문",
      label:
        "David Ricardo, 『On the Principles of Political Economy, and Taxation』, London: John Murray, 1817 초판, 7장 「On Foreign Trade」",
      href: "https://www.gutenberg.org/ebooks/33310",
      note: "네 숫자(100·120·80·90), 같은 나라 안에서는 그 교환이 성립하지 않는다는 문장, 안과 밖을 가르는 자본 이동의 난이도, 자본이 자유로울 때의 반사실과 이윤율 결론, 전제를 떠받친 불안과 마음에 대한 서술의 출처. Project Gutenberg 1817년 초판 전사본으로 7장 전체를 읽었음. facsimile이 아니어서 쪽 이미지 대조는 하지 못했고 쪽수 대신 장 번호만 적음",
    },
  ],
  "testimony/speeches-were-reconstructed": [
    {
      kind: "핵심 사료",
      label:
        "Thucydides, 『History of the Peloponnesian War』, Richard Crawley 영역, 1권 22절",
      href: "https://www.gutenberg.org/ebooks/7142",
      note: "연설을 저자가 판단해 다시 썼다는 진술, 사건 쪽의 세 단계 절차, 목격자가 갈리는 두 이유의 출처. Project Gutenberg 전사본(eBook 7142)으로 1권을 읽고 22절을 대조했음. facsimile이 아니어서 쪽 이미지 대조는 하지 못했고 쪽수 대신 권·절 번호만 적음",
    },
  ],
  "testimony/told-but-not-believed": [
    {
      kind: "핵심 사료",
      label:
        "Herodotus, 『The History of Herodotus』, G. C. Macaulay 영역, 7권 148~152절",
      href: "https://www.gutenberg.org/ebooks/2456",
      note: "아르고스에 대한 세 설명, 각 설명에 붙은 출처 표시, 전할 의무와 믿을 의무를 가른 문장과 그 범위 선언의 출처. Project Gutenberg 전사본(eBook 2456)으로 7권 148~153절을 읽음. facsimile이 아니어서 쪽 이미지 대조는 하지 못했고 쪽수 대신 권·절 번호만 적음",
    },
    {
      kind: "비교 사료",
      label:
        "Thucydides, 『History of the Peloponnesian War』, Richard Crawley 영역, 1권 22절",
      href: "https://www.gutenberg.org/ebooks/7142",
      note: "같은 시대의 다른 저자가 방법을 밝힌 방식과 비교하는 데 썼음. 두 칸의 만듦새를 밝히는 것과 믿음의 범위를 밝히는 것이 어떻게 다른지의 대조 근거",
    },
  ],
  "testimony/the-writer-was-there": [
    {
      kind: "핵심 사료",
      label:
        "Flavius Josephus, 『The Wars of the Jews』, William Whiston 영역, 서문 1·4·8·12절",
      href: "https://www.gutenberg.org/ebooks/2850",
      note: "두 묶음의 실패와 그 동기, 저자의 자기 소개, 사실과 애도를 나눠 읽으라는 요청, 티투스를 증인으로 댄 대목, 겪어 아는 사람을 독자로 둔 대목의 출처. Project Gutenberg 전사본(eBook 2850)으로 서문 1~12절을 읽음. facsimile이 아니어서 쪽 이미지 대조는 하지 못했고 쪽수 대신 절 번호만 적음",
    },
    {
      kind: "비교 사료",
      label:
        "Herodotus, 『The History of Herodotus』, G. C. Macaulay 영역, 7권 152절",
      href: "https://www.gutenberg.org/ebooks/2456",
      note: "각 보고에 꼬리표를 붙이는 방식과 저자 자신에게 꼬리표를 붙이는 방식을 대조하는 데 썼음",
    },
  ],
  "record-numbers/how-the-army-was-counted": [
    {
      kind: "핵심 사료",
      label:
        "Herodotus, 『The History of Herodotus』, G. C. Macaulay 영역, 7권 60절",
      href: "https://www.gutenberg.org/ebooks/2456",
      note: "민족별 수를 적을 수 없다는 진술, 육군 170만, 1만 명을 빽빽하게 세우고 배꼽 높이의 담을 쌓아 채움을 되풀이한 절차의 출처. 영역자 주석이 170 myriads를 1,700,000으로 풀어 둠. Project Gutenberg 전사본(eBook 2456)으로 읽음. 쪽수 대신 권·절 번호만 적음",
    },
  ],
  "record-numbers/what-the-total-cannot-tell": [
    {
      kind: "핵심 사료",
      label:
        "Herodotus, 『The History of Herodotus』, G. C. Macaulay 영역, 7권 184~187절과 영역자 주석",
      href: "https://www.gutenberg.org/ebooks/2456",
      note: "총계 5,283,220과 그것을 만든 재료, 각 재료에 붙은 가정 표시, 셀 수 없다고 적은 것들, 하루치 식량 계산의 출처. 영역자 주석이 각 소계를 아라비아 숫자로 풀고 1 메딤노스 = 48 코이닉스를 밝히며 110,340이라는 값이 틀렸다고 지적함. Project Gutenberg 전사본(eBook 2456)으로 읽음",
    },
  ],
  "record-numbers/numbers-that-command": [
    {
      kind: "핵심 사료",
      label:
        "함무라비 법전, C. H. W. Johns 영역, 『The Oldest Code of Laws in the World』 (T. & T. Clark, 1903) · 196~204·209~225·268~277조",
      href: "https://www.gutenberg.org/ebooks/17150",
      note: "세 칸의 사다리와 답의 네 꼴, 10·5·2와 5·3·2 금액, 종 값의 절반과 소 값의 4분의 1, 채찍 60대, 품삯과 임차료의 출처. 1마나 = 60세켈 환산은 같은 판 색인의 주. Project Gutenberg 전사본(eBook 17150)으로 읽었고 쪽수 대신 조항 번호만 적음",
    },
  ],
  "inference-from-sources/ruins-mislead": [
    {
      kind: "핵심 사료",
      label:
        "Thucydides, 『History of the Peloponnesian War』, Richard Crawley 영역, 1권 10절",
      href: "https://www.gutenberg.org/ebooks/7142",
      note: "두 도시가 폐허가 되는 사고실험과 '두 배'라는 표현, 겉모습과 힘을 따로 따지라는 규칙, 배 1,200척·120명·50명과 평균을 잡으면 대단치 않다는 결론의 출처. Project Gutenberg 전사본(eBook 7142)으로 읽었고 쪽수 대신 권·절 번호만 적음",
    },
  ],
  "inference-from-sources/the-gap-was-made": [
    {
      kind: "핵심 사료",
      label:
        "C. H. W. Johns 영역, 『The Oldest Code of Laws in the World』 (T. & T. Clark, 1903) · 머리말, 65조 뒤 편집자 주, 본문 끝의 추가 세 조항",
      href: "https://www.gutenberg.org/ebooks/17150",
      note: "돌기둥의 상태와 지워진 다섯 단, 35개 조항이라는 분량 추정과 100조부터의 재시작, 사라진 부분의 주제 목록, 아시리아 사본에서 온 세 조항의 처리, 번역하지 않은 700행과 그 이유의 출처. Project Gutenberg 전사본(eBook 17150)으로 읽음",
    },
    {
      kind: "비교 사료",
      label: "루브르 박물관, The Code of Hammurabi · 현재 소장기관 설명",
      href: "https://www.louvre.fr/en/the-code-of-hammurabi",
      note: "돌을 수사로 옮긴 경위에 관한 현재 소장기관 설명. 1903년 영역본이 지운 자리에 이름이 없다고 적은 사실과 구분함",
    },
  ],
  "inference-from-sources/naming-the-past": [
    {
      kind: "핵심 사료",
      label:
        "C. H. W. Johns 영역, 『The Oldest Code of Laws in the World』 (T. & T. Clark, 1903) · 표제, 본문 끝 문장, 머리말의 전승 서술",
      href: "https://www.gutenberg.org/ebooks/17150",
      note: "글이 자기를 올바름의 판결들이라 부르는 문장, 바빌로니아 학교에서 열두 장으로 나뉘고 Ninu ilu sirum으로 불린 일, 아시리아에서의 이름, 그리고 이 판의 표제와 조항 번호의 출처. Project Gutenberg 전사본(eBook 17150)으로 읽음",
    },
    {
      kind: "비교 사료",
      label:
        "Thucydides, 『History of the Peloponnesian War』, Richard Crawley 영역, 1권 22절",
      href: "https://www.gutenberg.org/ebooks/7142",
      note: "저자가 방법을 적어 두면 독자가 신뢰 범위를 추측하지 않아도 된다는 기준을, 읽는 쪽에도 적용하기 위해 다시 가져온 자리",
    },
    {
      kind: "비교 사료",
      label: "루브르 박물관, The Code of Hammurabi · 현재 소장기관 설명",
      href: "https://www.louvre.fr/en/the-code-of-hammurabi",
      note: "돌의 제작 시기를 약 기원전 1750년으로 설명하고 현대적 의미의 법전과 구분함. 1903년 머리말의 시간 간격은 학교 판본의 연대를 대조하지 않아 채택하지 않음",
    },
  ],
  "business/business-model-cashflow": [
    {
      "kind": "공식 문서",
      "label": "IFRS15 · About, 수익 인식 5단계",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/",
      "note": "공식 About의5단계와 통제 취득 설명을 실제 확인했습니다. 배송일·입금일이 언제나 수익 인식일이거나 모든 자영업자에게 같은 회계기준이 강제된다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "IAS7 · About, 현금흐름과 간접법",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/",
      "note": "공식 원문에서 시차를 직접 다루는 문구로 인용을 맞추었습니다. 완전한 현금흐름표나 전체 순이익을 계산한 것은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "IFRIC · Principal versus Agent: Software Reseller (2022년5월)",
      "href": "https://www.ifrs.org/news-and-events/updates/ifric/2022/ifric-update-april-2022/",
      "note": "최종2022년5월 추가본의 관련 요구사항을 실제 읽었습니다. 가격 재량이나 결제금 보관 하나로 본인·대리인을 자동 판정하거나 본문 결제업체를 곧바로 상품 대리인으로 단정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "IFRS16 · Leases",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/",
      "note": "공식 기준 소개의 목적과 범위를 읽었습니다. 임대료와 상품 매출에 IFRS15를 일괄 적용하거나 개별 리스 회계 처리를 여기서 판정하지 않습니다."
    }
  ],
  "business/shop-unit-economics": [
    {
      "kind": "공식 문서",
      "label": "IAS 2 · 판매 재고와 비용 인식",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/",
      "note": "공식 About의 재고 판매와 손실 인식 설명을 읽고 판매 시점의 짧은 원문을 대조했습니다. 모든 점주에게 IFRS가 적용되거나 전체 2천 원이 IAS 2 재고비라는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Business Queensland · Break-even and profit",
      "href": "https://www.business.qld.gov.au/running-business/finance/essentials/break-even-profit",
      "note": "공식 HTML의 Break-even point 정의와 판매·비용 설명을 읽고 14단어 문장을 인용했습니다. 2천 잔에 점주 노동·세금·투자 회수까지 포함되거나 수요·현금 유동성이 보장된다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "GOV.UK · Business rates overview",
      "href": "https://www.gov.uk/introduction-to-business-rates",
      "note": "공식 Overview의 대상·지역별 처리·감면·면제 설명을 읽었습니다. 영국 모든 점포가 같은 세액을 내거나 현재 특정 점포의 부담을 계산했다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "NSW · What are outgoings?",
      "href": "https://www.smallbusiness.nsw.gov.au/help/common-questions/what-are-outgoings",
      "note": "공식 본문의 정의·계약 및 공개서 명시·직접적이고 합리적인 관련 범위를 읽었습니다. 다른 관할권의 비용 전가를 판정하거나 모든 항목의 청구가 허용된다는 뜻은 아닙니다."
    }
  ],
  "business/shop-site-selection": [
    {
      "kind": "공식 문서",
      "label": "호주 정부 · Choose your business location",
      "href": "https://business.gov.au/planning/new-businesses/choose-your-business-location",
      "note": "Location·Cost·Facilities and utilities·Compliance와 작은 공간 시험 안내의 실제 원문을 읽었습니다. 호주 정부가 5%·40%를 추정하거나 모든 입지에서 반복 구매를 보장한다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "식품위생법 시행규칙 제36조",
      "href": "https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900",
      "note": "실제 HTML에서 별표 14가 업종별 시설기준임을 지정하는 조문을 읽고 짧게 인용했습니다. 별표 전체를 검토해 특정 점포의 적합성을 판정하거나 임대차 분쟁을 해결한 것은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "중소벤처기업부 · 소상공인365 정식 서비스 개시",
      "href": "https://www.mss.go.kr/site/chungbuk/ex/bbs/View.do?bcIdx=1055594&cbIdx=180",
      "note": "공식 HTML의 입지평가·배달정보 리포트와 경영진단·유동인구 설명을 읽었습니다. 현재 특정 계정에 제공되는 모든 기능을 실제 사용했거나 매출 예측 정확도를 검증한 것은 아닙니다."
    }
  ],
  "business/shop-fitout-and-opening": [
    {
      "kind": "공식 문서",
      "label": "국세청 · 사업자등록 신청 절차",
      "href": "https://g.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7777&mi=2444",
      "note": "실제 공식 HTML에서 개업 전 또는 사업 시작일부터 20일 이내 신청 문구를 읽었습니다. 등록증으로 모든 시설·소방·위생 요건이 충족된다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "NSW · Retail Tenancy Guide",
      "href": "https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide",
      "note": "공식 페이지의 검색 색인 본문에서 fit-out과 make good 안내 및 짧은 인용 문장을 확인했습니다. 모든 임대인의 철거 요구가 자동으로 유효하거나 설치비가 양도가치가 된다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "GOV.UK · When is permission required?",
      "href": "https://www.gov.uk/guidance/when-is-permission-required",
      "note": "011·012·012a의 용도변경과 물리적 공사 구분, 공식 지침 모음의 England 범위를 읽었습니다. 같은 용도군의 모든 공사에 허가가 필요하거나 영국 전체에 같은 절차가 적용된다고 단정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "GOV.UK · 상가 임차인의 책임",
      "href": "https://www.gov.uk/renting-business-property-tenant-responsibilities",
      "note": "실제 공식 본문의 repairs와 moving out 설명을 읽었습니다. 한국이나 NSW의 원상복구 범위를 이 안내로 판정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Square · The Build Out 공식 전사",
      "href": "https://squareup.com/us/en/the-bottom-line/videos/making-a-restaurant-with-ggiata/the-build-out",
      "note": "공식 전사에서 공간 인수 후 임대료·가스관 증설·최종 검사와 허가 누락 발언을 읽었습니다. 영상 자체의 시각을 확인한 것이 아니며 모든 매장의 비용이나 독립적인 성과 검증으로 일반화하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "식품위생법 시행규칙 제36조",
      "href": "https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900",
      "note": "2026-09-01 시행본의 실제 HTML에서 별표 14를 업종별 시설기준으로 지정한 조문을 읽었습니다. 별표 전체의 개별 요건이나 점포 적합성을 판정한 것은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 음식점 화재배상책임보험과 안전시설",
      "href": "https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365",
      "note": "2026-08-15 안내의 대상 업종·면적·층·출입구와 예외를 읽었습니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 음식점 건강진단",
      "href": "https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=839&popMenu=ov",
      "note": "2026-09-15 안내의 제40조 대상·시기·예외를 읽었습니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 식품위생교육",
      "href": "https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=4&cciNo=1&cnpClsNo=2",
      "note": "2026-09-15 안내의 제41조 교육·대리·예외를 읽었습니다. 10월8일 예고 내용을 10월4일 현재 규정으로 적용하지 않습니다."
    }
  ],
  "property/commercial-lease-and-rent": [            {
      "kind": "공식 문서",
      "label": "대한민국 상가건물 임대차보호법",
      "href": "https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651",
      "note": "2026-10-03 기준 시행 법령에서 갱신·권리금 관련 조문을 확인합니다."
    },             {
      "kind": "공식 문서",
      "label": "UK Business tenancies: right to renew",
      "href": "https://lawcom.gov.uk/project/business-tenancies-the-right-to-renew/",
      "note": "잉글랜드·웨일스 사업 임차의 갱신권과 계약 전 배제 가능성 안내입니다."
    }, {"kind": "공식 문서", "label": "NSW Retail Tenancy Guide", "href": "https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide", "note": "호주 NSW의 소매 임대차 비용과 종료 의무 안내입니다."},
    {
      "kind": "공식 문서",
      "label": "한국 상가건물 임대차보호법 제3조 제1항",
      "href": "https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1013685403",
      "note": "2026-10-04 원문 확인. 3천만 원을 맡기는 점주는 실제 공간을 인도받은 사실과 등록 신청의 사업장 표시를 맞춥니다. 이 조항의 효력과 보증금을 남보다 먼저 돌려받는 요건은 별개이므로 선순위 권리·확정일자·적용 범위도 함께 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "NSW Retail Tenancy Guide · Make good",
      "href": "https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide",
      "note": "2026-10-04 원문 확인. 한국의 3천만 원·월 200만 원·3년 계약을 NSW 규칙으로 처리할 수는 없습니다. 다만 종료 전 반환 의무를 계약 때 확인한다는 질문을 가져와 사진과 공사 동의, 반환 기준을 대조할 수 있습니다."
    },
],
  "property/shop-transfer-and-goodwill": [
    {
      "kind": "공식 문서",
      "label": "한국 상가건물 임대차보호법 제10조의3·제10조의4",
      "href": "https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651",
      "note": "권리금 정의와 회수 기회 보호의 현재 조문입니다."
    },
    {
      "kind": "공식 문서",
      "label": "NSW Small Business Commissioner: Transferring your lease",
      "href": "https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease",
      "note": "호주 NSW의 retail lease 양도 동의와 공개 절차를 안내합니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 개인정보 보호법 제27조 제1항",
      "href": "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335679",
      "note": "2026-10-04 원문 확인. 3천300만 원 양도계약에는 시설·재고 목록과 별도로 고객정보 이전 여부를 적습니다. 이전 사실, 받는 사람의 연락처, 이전을 원하지 않을 때의 조치 방법을 미리 알리고, 양수자는 원래 목적의 범위 등 법률상 조건을 지킵니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 상가건물 임대차보호법 제10조의4 제1항",
      "href": "https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651",
      "note": "2026-10-04 원문 확인. 시설 2천만 원·재고 300만 원·영업상 이점 1천만 원에 합의해도 법은 임대인의 특정 방해행위와 기간·예외를 다룹니다. 합의된 양도대금만으로 새 임대차가 자동 성립하지 않으므로 장소 사용 조건을 잔금 전에 확인합니다."
    },
  ],
  "property/shop-closure-and-restoration": [
    {
      "kind": "공식 문서",
      "label": "한국 대법원 2002년 건물명도 판례",
      "href": "https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367",
      "note": "특정 사실관계에서 복구비 공제와 실제 복구 의사를 다룬 판례입니다. 일반 규칙으로 확대하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "국세청 폐업 부가가치세 안내",
      "href": "https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393",
      "note": "폐업일이 속한 달 다음 달 25일 신고와 잔존 재화 관련 안내입니다."
    },
    {
      "kind": "공식 문서",
      "label": "NSW Retail Tenancy Guide",
      "href": "https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide",
      "note": "호주 NSW의 임대차 종료 make good와 인도 준비 안내입니다."
    },
    {
      "kind": "공식 문서",
      "label": "국세청 · 사업을 폐업하는 경우의 신고 안내",
      "href": "https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393",
      "note": "2026-10-04 원문 확인. 사례의 3천만 원 보증금 정산과 별도로 폐업일까지의 거래와 남은 재화를 확인합니다. 2026-10-04 확인 기준 위 기한을 세무 달력에 적고, 폐업 신고만으로 부가세·소득세·원천세 등이 모두 끝났다고 처리하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "대법원 2002다52657 · 판결요지 [2]",
      "href": "https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367",
      "note": "2026-10-04 원문 확인. 600만 원 견적을 자동으로 공제하지 않고 실제 반환 합의와 시설 사용을 확인합니다. 이 판결은 특정 사실관계에서 공제를 부정했으므로 모든 복구 의무가 없어진다는 결론으로 확대할 수 없습니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 근로기준법 제36조",
      "href": "https://law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0036&lsiSeq=283457&urlMode=lsScJoRltInfoR",
      "note": "2026-10-04 확인. 퇴직 시 금품 청산 기한과 당사자 합의의 예외입니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 개인정보 보호법 제21조",
      "href": "https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625",
      "note": "2026-09-11 시행 조문을 2026-10-04 확인. 불필요한 정보 파기와 법정 보존 자료의 분리 관리를 구분합니다."
    },
    {
      "kind": "공개 강의",
      "label": "중소벤처기업부 · 2025 소상공인 지원사업 영상",
      "href": "https://www.youtube.com/watch?v=T6KNxj3hawQ&t=230s",
      "note": "2025-01-23 공개 영상의 03:50 화면에서 250만 원→400만 원을 확인했습니다. 아래 게시기관 전사와 대조했으며 당시 발표의 근거로 씁니다."
    },
    {
      "kind": "공식 문서",
      "label": "중소벤처기업부 · 1월 영상 공식 자막",
      "href": "https://www.mss.go.kr/site/smba/brdcststnVod/brdcststnVodView.do?ctgr_code=C03&searchSeq=ST_000000001222422",
      "note": "희망리턴패키지의 점포 철거비 설명을 읽었습니다. 게시기관의 영상 등록일은 2025-01-24입니다."
    },
    {
      "kind": "공개 강의",
      "label": "중소벤처기업부 · 2차 추경 요약 영상",
      "href": "https://www.youtube.com/watch?v=A55z8XrEEdM&t=113s",
      "note": "2025-07-11 공개 영상의 01:53 화면에서 400만 원→600만 원을 확인했습니다. 영상 설명의 경영회복 장은 00:58부터 시작합니다."
    },
    {
      "kind": "공식 문서",
      "label": "중소벤처기업부 · 7월 영상 공식 자막",
      "href": "https://www.mss.go.kr/site/smba/brdcststnVod/brdcststnVodView.do?ctgr_code=C03&searchSeq=ST_000000001231716",
      "note": "지원 확대 설명과 추후 세부 공고 안내를 대조했습니다. 영상 발표만으로 개별 신청의 지급액을 확정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "중소벤처기업부 · 2025-07-30 점포철거비 확대 보도자료",
      "href": "https://www.mss.go.kr/site/smba/ex/bbs/View.do?bcIdx=1060542&cbIdx=86&parentSeq=1060542",
      "note": "영상 뒤에 나온 서면 자료로 적용 폐업일과 변경 공고 일정을 확인했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "소상공인시장진흥공단 · 2026-01-19 원스톱폐업지원 공고",
      "href": "https://ssrf.or.kr/site/kr/html/sub04/0401.html?category=sc04&file_id=3953&mode=D&no=abaae44719e649e9f32b348bdd1d35f0",
      "note": "서천군지속가능지역재단이 게시한 공단 공고 PDF의 3~4쪽입니다. 33㎡ 사례는 이 날짜의 공고에만 적용한 계산이며 이후 변경 여부는 신청할 때 확인합니다."
    },
],
  "business/franchise-incentives": [
    {
      "kind": "공식 문서",
      "label": "US FTC · Consumer Guide, Royalties",
      "href": "https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise",
      "note": "Royalties 설명과 반복 비용 안내를 읽고 여섯 단어를 직접 인용했습니다. 사례 금액이 실제 브랜드 수치이거나 모든 본부가 같은 계산 방식을 쓴다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "US FTC · FDD Item 19와 Item 20 안내",
      "href": "https://www.ftc.gov/business-guidance/blog/2023/05/franchise-fundamentals-taking-deep-dive-franchise-disclosure-document",
      "note": "공식 본문의 Item 19 문장을 대조하고 좁은 예외 존재와 Item 20 설명을 읽었습니다. 다른 나라 공시에 같은 의무가 적용되거나 자료 부재만으로 불법이라고 판정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "16 CFR 436.2(a) · 문서 제공 시기",
      "href": "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-436/subpart-B/section-436.2",
      "note": "2026-10-04 eCFR 본문의 적용 범위와 (a)를 실제 확인했습니다. 14일을 영업일로 읽거나 전 세계 가맹계약에 일괄 적용하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 공정위 · 정보공개서 비교 항목",
      "href": "https://franchise.ftc.go.kr/firHope/comparePopup.do",
      "note": "2026-10-04 실제 HTML의 항목명·단위·산정기준 안내를 확인했습니다. 월 3천만 원을 관측된 평균으로 제시하거나 명의변경을 폐점으로 합산하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EU · Vertical Guidelines 2022, 165~168항",
      "href": "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A52022XC0630%2801%29",
      "note": "EUR-Lex 원문 165~168항에서 기능상 필요성·면제·개별 평가의 구분을 읽었습니다. EU 전체의 FDD 의무나 모든 가격·판매지역 제한의 적법성을 주장하지 않습니다."
    }
  ],
  "property/land-development-residual": [{"kind": "공식 문서", "label": "RICS Valuation of development property", "href": "https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf", "note": "잔여법과 개발 부동산의 현금흐름·민감도를 설명하는 전문 기준입니다."},             {
      "kind": "공식 문서",
      "label": "한국 국토의 계획 및 이용에 관한 법률",
      "href": "https://www.law.go.kr/LSW/lsInfoP.do?efYd=20260701&lsiSeq=284013",
      "note": "2026-10-03 기준 개발행위허가·건폐율·용적률 조문의 출발점입니다."
    },             {
      "kind": "공식 문서",
      "label": "한국 건축법 제11조",
      "href": "https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032199815",
      "note": "건축허가의 법적 출발점입니다."
    },
    {
      "kind": "공식 문서",
      "label": "RICS Valuation of development property · 6.1.1, p.24",
      "href": "https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf",
      "note": "2026-10-04 원문 확인. 100−(70+15)=15억 원입니다. 원문의 total development costs에는 개발업자 이익도 들어가므로 이 글처럼 70억 원과 15억 원을 따로 표시했을 때 둘을 모두 한 번씩 뺍니다. 이익을 두 번 차감하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국 국토계획법 제56조 제1항 제2호",
      "href": "https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016204783",
      "note": "2026-10-04 원문 확인. 100억 원 매각을 기대하며 15억 원을 토지와 취득에 배정해도 땅을 깎고 메우는 행위의 허가 여부를 먼저 확인합니다. 허가 조건 때문에 도로·배수 비용이 10억 원 더 필요하면 다른 가정이 같을 때 잔여는 5억 원으로 줄어듭니다."
    },
],
  "business/supply-chain-bargaining": [{"kind": "공식 문서", "label": "World Bank World Development Report 2020", "href": "https://www.worldbank.org/en/publication/wdr2020", "note": "국제 가치사슬의 분업과 정책 파급을 설명하는 공식 보고서입니다."},             {
      "kind": "공식 문서",
      "label": "World Bank Global Value Chains",
      "href": "https://www.worldbank.org/ext/en/topic/trade/global-value-chains",
      "note": "국가 사이의 생산 단계 분리와 고부가가치 단계 이동을 설명합니다."
    }, {"kind": "공식 문서", "label": "OECD Trade in Value Added", "href": "https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html", "note": "총수출과 국내 부가가치의 차이를 확인할 통계 안내입니다."},
    {
      "kind": "공식 문서",
      "label": "OECD TiVA · About, indicator list",
      "href": "https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html",
      "note": "2026-10-04 원문 확인. 단순 사례의 조립국 총수출 60달러를 외국 부품 40달러와 국내에서 더한 20달러로 나눕니다. 실제 통계는 부품 안에 재수입된 자국 가치 등이 섞이므로 기업 송장 하나의 뺄셈보다 넓은 산업연관 자료가 필요합니다."
    },
    {
      "kind": "공식 문서",
      "label": "World Bank WDR 2020 · About",
      "href": "https://www.worldbank.org/en/publication/wdr2020",
      "note": "2026-10-04 원문 확인. 부품 40달러의 국경 비용이나 조달 기간이 늘면 조립 출하 60달러와 최종가격 100달러의 계약에 압력이 전해집니다. 누가 부담하는지는 재고 소유와 가격 조정 조항, 대체 공급자에 달립니다."
    },
],
  "markets/funds-etfs-and-etns": [
    {
      "kind": "공식 문서",
      "label": "SEC ETF Bulletin · How are ETFs similar to mutual funds?",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC ETN Bulletin · What is an ETN?",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-50",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Leveraged and Inverse ETFs",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-12",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "ProShares · TQQQ Summary Prospectus, 2026-09-28",
      "href": "https://prod.proshares.com/globalassets/proshares/prospectuses/tqqq_summary_prospectus.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "ProShares · SQQQ Summary Prospectus, 2026-09-28",
      "href": "https://prod.proshares.com/globalassets/proshares/prospectuses/sqqq_summary_prospectus.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Global X Europe · QYLD UCITS synthetic structure",
      "href": "https://globalxetfs.eu/funds/qyld",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "markets/forwards-and-futures": [
    {
      "kind": "공식 문서",
      "label": "CME · Contango, Backwardation and Convergence",
      "href": "https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CME · Understanding Margin Changes, margin philosophies",
      "href": "https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CME · Performance Bonds/Margins FAQ",
      "href": "https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIS · Covered interest parity lost",
      "href": "https://www.bis.org/publ/qtrpdf/r_qt1609e.htm",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "markets/options-and-asymmetric-payoffs": [
    {
      "kind": "공식 문서",
      "label": "OIC · Options Basics, Describing Equity Options",
      "href": "https://www.optionseducation.org/optionsoverview/options-basics",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "KRX · KOSPI 200 Options, Final Settlement / Exercise Style",
      "href": "https://global.krx.co.kr/contents/GLB/02/0201/0201040202/GLB0201040202.jsp",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "markets/swaps-and-credit-risk": [
    {
      "kind": "공식 문서",
      "label": "CFTC · Swaps Report Data Dictionary, Fixed-Float",
      "href": "https://www.cftc.gov/MarketReports/SwapsReports/DataDictionary/index.htm",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "ESMA · Clearing obligation and risk mitigation techniques under EMIR",
      "href": "https://www.esma.europa.eu/post-trading/clearing-obligation-and-risk-mitigation-techniques-under-emir",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIS · OTC derivatives statistics",
      "href": "https://data.bis.org/topics/OTC_DER",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "risk/margin-collateral-and-leverage": [
    {
      "kind": "공식 문서",
      "label": "FINRA · Guidance on Margin, risks",
      "href": "https://www.finra.org/sites/default/files/InvestorDocument/p005895.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CME · Performance Bonds/Margins FAQ",
      "href": "https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "CPMI-IOSCO · Principles for Financial Market Infrastructures",
      "href": "https://www.iosco.org/library/pubdocs/pdf/ioscopd377-pfmi.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIS · Market and funding liquidity, overview",
      "href": "https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "macro/global-capital-and-policy": [
    {
      "kind": "공식 문서",
      "label": "BIS GLI · About",
      "href": "https://data.bis.org/topics/GLI",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "ECB · ECB, ESCB and the Eurosystem",
      "href": "https://www.ecb.europa.eu/ecb/orga/escb/html/index.en.html",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "HKMA · Linked Exchange Rate System",
      "href": "https://www.hkma.gov.hk/eng/key-functions/money/linked-exchange-rate-system/",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "macro/narratives-and-market-regimes": [
    {
      "kind": "공식 문서",
      "label": "IFRS · IAS 7, About",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "BIS · Market and funding liquidity, overview",
      "href": "https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "institutions/insurance-risk-pooling": [
    {
      "kind": "공식 문서",
      "label": "NAIC · How Does Insurance Work?",
      "href": "https://content.naic.org/consumer/how-does-insurance-work",
      "note": "미국 보험 입문 안내. 약관의 보장 사건과 자기부담금 구조."
    },
    {
      "kind": "공식 문서",
      "label": "US NFIP · Eligibility, frequently asked questions",
      "href": "https://www.floodsmart.gov/get-insured/eligibility",
      "note": "미국 일반 주택보험과 홍수보험의 구분. 2026-10-04 확인."
    }
  ],
  "institutions/healthcare-payment-systems": [
    {
      "kind": "공식 문서",
      "label": "WHO · Pooling revenues and reducing fragmentation",
      "href": "https://www.who.int/activities/pooling/pooling",
      "note": "의료 재정의 위험 공유 기능을 설명하는 WHO 원문."
    },
    {
      "kind": "공식 문서",
      "label": "US CMS · Fee Schedules, General Information",
      "href": "https://www.cms.gov/medicare/payment/fee-schedules",
      "note": "미국 Original Medicare의 해당 서비스 지급표. 모든 보험에 같은 가격을 적용하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "국민건강보험공단 · 급여의 범위 및 비용부담",
      "href": "https://www.nhis.or.kr/static/html/wbma/c/wbmac0103.html",
      "note": "한국 급여 범위와 비용부담의 공식 안내. 2026-10-04 확인."
    },
    {
      "kind": "공식 문서",
      "label": "NHS England · NHS Payment Scheme",
      "href": "https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/",
      "note": "잉글랜드 대상 서비스 지급 규칙이며 총 NHS 재원을 정하지 않음. 2026-10-04 확인."
    }
  ],
  "institutions/how-to-read-a-country": [{"kind": "공식 문서", "label": "World Bank · WDI DataBank", "href": "https://databank.worldbank.org/home", "note": "WDI의 수집 범위와 원자료 설명. 통계 조회 2026-10-04."}, {"kind": "공식 문서", "label": "UNSD · M49, Countries or Areas와 FAQ", "href": "https://unstats.un.org/unsd/methodology/m49/", "note": "목록 248개, FAQ의 별도 통계 코드 412·158. 확인 2026-10-04."}, {"kind": "공식 문서", "label": "World Bank · API Basic Call Structures", "href": "https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures", "note": "네 지표의 2020–2025 자료를 조회하고 국가별 마지막 비결측 값을 표시합니다. 소득 구간·대륙 합계는 국가 값에서 제외합니다."}],
  "infrastructure/electricity-grid-and-power": [
    {
      "kind": "공식 문서",
      "label": "IEA Electricity 2026 · Grids",
      "href": "https://www.iea.org/reports/electricity-2026/grids",
      "note": "전력망 접속 병목에 관한 2026년 국제 분석. 현지 요금이나 계약을 정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "FERC · Electric Power Markets, National Overview",
      "href": "https://www.ferc.gov/electric-power-markets",
      "note": "미국 내부의 시장 구조 차이와 지역 규제 범위. 2026-10-04 확인."
    },
    {
      "kind": "공식 문서",
      "label": "US EIA · Generation, capacity and sales",
      "href": "https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php",
      "note": "MW 출력과 MWh 에너지 단위를 구분하는 공식 안내."
    }
  ],
  "infrastructure/food-chain-and-prices": [
    {
      "kind": "공식 문서",
      "label": "FAO · Sustainable Food Value Chains, Figure 3",
      "href": "https://www.fao.org/sustainable-food-value-chains/what-is-it/en/",
      "note": "식품 가치사슬의 기능과 거래 연결을 정의하는 FAO 원문."
    },
    {
      "kind": "공식 문서",
      "label": "USDA ERS · Food Dollar, marketing bill",
      "href": "https://www.ers.usda.gov/data-products/food-dollar",
      "note": "미국 국내 생산 식품 지출 통계의 범위와 2026년 방법 개편 주의. 2026-10-04 확인."
    }
  ],
  "infrastructure/water-utility-and-tariffs": [
    {
      "kind": "공식 문서",
      "label": "World Bank · Troubled Tariffs, How Should Costs Be (re)Covered?",
      "href": "https://documents1.worldbank.org/curated/en/568291635871410812/pdf/Troubled-Tariffs-Revisiting-Water-Pricing-for-Affordable-and-Sustainable-Water-Services.pdf",
      "note": "요금·지원·전체 비용을 구분하는 세계은행 연구. 사례는 현금 지출을 단순화했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "PUB Singapore · Water Price, Components of the Water Price",
      "href": "https://www.pub.gov.sg/Public/WaterLoop/Water-Price",
      "note": "싱가포르 급수·절약세·하수처리세의 목적. 2026-10-04 확인."
    }
  ],
  "infrastructure/transport-access-and-land-value": [
    {
      "kind": "공식 문서",
      "label": "World Bank · Leaders in Urban Transport Planning",
      "href": "https://academy.worldbank.org/en/infrastructure/transport/leaders-in-urban-transport-planning",
      "note": "도시별 접근성과 교통 계획의 연결을 다루는 세계은행 자료."
    },
    {
      "kind": "공식 문서",
      "label": "UK MHCLG Appraisal Guide · 4.39",
      "href": "https://www.gov.uk/government/publications/the-mhclg-appraisal-guide/the-mhclg-appraisal-guide",
      "note": "영국 평가 지침의 중복 계산 경계. 2026-10-04 확인."
    }
  ],
  "infrastructure/housing-land-and-supply": [
    {
      "kind": "공식 문서",
      "label": "RICS Valuation of development property · 6.1.1, p.24",
      "href": "https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf",
      "note": "개발 비용에 정상 이익을 포함하는 잔여 평가 설명. 본문5절에서10−7=3과 이익 이중차감 방지 적용."
    },
    {
      "kind": "공식 문서",
      "label": "Singapore Government · Do HDB flat buyers own their flat?",
      "href": "https://www.gov.sg/explainers/do-hdb-flat-buyers-own-their-flat/",
      "note": "싱가포르 HDB 권리의 기간에 대한 정부 설명. 2023년 설명을 2026-10-04 재확인."
    }
  ],
  "infrastructure/climate-risk-and-exposure": [
    {
      "kind": "공식 문서",
      "label": "IPCC AR6 WGII · Chapter 1, Figure 1.4",
      "href": "https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter01.pdf",
      "note": "기후 위험의 세 요소와 상호작용을 설명하는 IPCC 평가."
    },
    {
      "kind": "공식 문서",
      "label": "UNDRR · Exposure terminology",
      "href": "https://www.undrr.org/terminology/exposure",
      "note": "노출의 범위에 관한 국제 재난위험 정의. 2026-10-04 확인."
    }
  ],
  "institutions/public-budget-and-taxes": [
    {
      "kind": "공식 문서",
      "label": "IMF · About GFS, Analytical Framework",
      "href": "https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm",
      "note": "현금·발생주의 구분과 수입/비용/자산 취득의 연결. 사례는 감가상각 등을 생략."
    },
    {
      "kind": "공식 문서",
      "label": "IMF · Quarterly Government Finance Statistics",
      "href": "https://data.imf.org/en/Datasets/QGFS",
      "note": "정부 재정 흐름과 자산·부채 데이터 범위."
    },
    {
      "kind": "공식 문서",
      "label": "US CBO · Introduction to CBO",
      "href": "https://www.cbo.gov/about/overview",
      "note": "미국 의회 예산 과정의 분석 지원 기관. 2026-10-04 확인."
    }
  ],
  "institutions/education-skills-and-signals": [
    {
      "kind": "공식 문서",
      "label": "OECD Education at a Glance 2026 · C1, Distribution by source of funds",
      "href": "https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html",
      "note": "교육 지출의 초기 재원과 최종 지급 구분. 본문 2023 관측자료를 포함하는 2026 보고서."
    },
    {
      "kind": "공식 문서",
      "label": "UK Government · Repaying your student loan, How to repay",
      "href": "https://www.gov.uk/repaying-your-student-loan/how-you-repay",
      "note": "영국 해당 학자금 상환 계획의 소득 조건. 2026-10-04 확인."
    }
  ],
  "institutions/media-attention-and-public-belief": [
    {
      "kind": "공식 문서",
      "label": "EU Regulation 2022/2065 · Article 27(1)",
      "href": "https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng",
      "note": "EU DSA 추천 기준 공개 조항. 적용 대상과 관할 확인, 2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "US FTC · Endorsement Guides update, June 2023",
      "href": "https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements",
      "note": "미국 FTC 추천·후기 광고 가이드의 공개 판단. 2026-10-04 확인."
    }
  ],
  "business/shop-daily-operations": [
    {
      "kind": "공식 문서",
      "label": "IAS 2 · 재고 판매와 손실",
      "href": "https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/",
      "note": "공식 About의 판매 관련 비용과 손실 발생 기간의 비용 인식 설명을 읽었습니다. 모든 소상공인이 IFRS 적용 대상이거나 11만4천800원이 순이익이라는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Stripe · Payout reconciliation report",
      "href": "https://docs.stripe.com/reports/payout-reconciliation",
      "note": "자동 송금 보고서의 범위, Itemized 내역과 수동·즉시 송금의 제한을 실제 문서에서 읽었습니다. 실제 Stripe 요금·일정이나 모든 송금 방식에서 같은 보고서를 쓸 수 있다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "Fair Work Ombudsman · 기록과 임금명세서",
      "href": "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/record-keeping-pay-slips",
      "note": "Overview와 급여·근무시간 기록의 항목별 범위를 읽고 짧은 원문을 인용했습니다. 모든 고용형태의 시간 기록 항목이 같거나 호주의 기간을 다른 나라에 적용한다는 뜻은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "소득세법 제160조의5 · 사업용계좌",
      "href": "https://www.law.go.kr/법령/소득세법/제160조의5",
      "note": "국가법령정보센터의 실제 제160조의5 본문에서 대상 거래와 신고 범위를 읽었습니다. 모든 영세 점주에게 같은 계좌 신고 의무가 있다고 단정하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "개인정보 보호법 제21조 · 파기와 보존",
      "href": "https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625",
      "note": "국가법령정보센터의 제21조 1~3항을 실제 읽었습니다. 모든 고객 연락처를 계속 보관할 근거나 개별 자료의 보존기간을 정한 것은 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "고용노동부 · 5인 미만 사업장 적용 노동법",
      "href": "https://www.moel.go.kr/news/cardinfo/view.do?bbs_seq=20220500493",
      "note": "2022년 안내의 근로조건 명시·교부와 임금명세서 항목을 확인했습니다. 당시 최저임금·보험 요건을 현재 수치로 재사용하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 음식점 화재배상책임보험과 안전시설",
      "href": "https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365",
      "note": "2026-08-15 기준 안내에서 업종·면적·층·주출입구와 예외를 확인했습니다. 실제 점포의 가입 대상 판정은 별도입니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 음식점 건강진단",
      "href": "https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=839&popMenu=ov",
      "note": "2026-09-15 기준 제40조의 대상·시기·예외 설명을 읽었습니다. 특정 질환의 진단이나 식품 안전 판정은 하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "법제처 · 식품위생교육",
      "href": "https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=4&cciNo=1&cnpClsNo=2",
      "note": "2026-09-15 기준 제41조의 교육·대리·면제 범위를 읽었습니다. 안내에 예고된 10월8일 시행 변경을 10월4일 현재 규정으로 적용하지 않습니다."
    }
  ],
  "institutions/population-migration-and-care": [{"kind": "공식 문서", "label": "UN DESA · WPP2024 Methodology, p.1–2 및 II.G", "href": "https://population.un.org/wpp/assets/Files/WPP2024_Methodology.pdf", "note": "2024판은 연령·성별 출생·사망·국제이동으로 매년 인구를 전진시킵니다. 추정과 전망을 구분합니다."}, {"kind": "공식 문서", "label": "ILO · Care economy, What is the care economy?", "href": "https://www.ilo.org/topics-and-sectors/care-economy", "note": "유급·무급, 직접·간접 돌봄과 제공자·수혜자·고용주·서비스 기관의 범위. 확인 2026-10-04."}, {"kind": "공식 문서", "label": "ONS · National population projections methodology", "href": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationprojections/methodologies/methodologyusedtoproducethenationalpopulationprojections", "note": "출생·사망·이동의 가정에 따른 전망이라는 방법적 경계. 한국의 장기 전망이나 다른 나라의 실제 수치를 대신하지 않습니다."}],
  "institutions/culture-norms-and-coordination": [{"kind": "공식 문서", "label": "UNESCO · 문화다양성 선언 제 1조", "href": "https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity", "note": "2001-11-02 채택. 같은 선언의 두 짧은 인용은 합계 21단어입니다. 확인 2026-10-04."}, {"kind": "공식 문서", "label": "UNESCO · 문화다양성 선언 제 4조", "href": "https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity", "note": "문화의 차이를 인권침해의 근거로 사용할 수 없다는 원칙. 선언과 국내법 구제 절차는 구분합니다."}, {"kind": "공식 문서", "label": "Elinor Ostrom · Nobel 인터뷰 원문", "href": "https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/", "note": "원문에서 장기간 유지된 제도의 공통 원리를 실제 적용할 방식은 체계마다 다르다고 설명합니다. 본문 10개 가게 계산은 연구 실측이 아닙니다."}],
  "institutions/evidence-measurement-and-causality": [{"kind": "공식 문서", "label": "NIST · TN1297 Appendix D1, §D.1.1.2", "href": "https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-d1-terminology", "note": "반복성의 측정 조건과 정확도·오차·불확실성을 구분합니다. 계기교체 사례는 설명용 가정입니다."}, {"kind": "공식 문서", "label": "ICH · E9 Statistical Principles, §2.3.2 Randomisation", "href": "https://database.ich.org/sites/default/files/E9_Guideline.pdf", "note": "임상시험 설계의 무작위 배정 원칙. 여기서는 비교 설계의 아이디어를 전력 실험에 적용하며 의학적 효과를 주장하지 않습니다."}, {"kind": "공식 문서", "label": "ICH · E8(R1), §5.3 및 §6", "href": "https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf", "note": "배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙."}],
  "infrastructure/materials-waste-and-circularity": [{"kind": "공식 문서", "label": "OECD · Global Plastics Outlook, Box6.4·Figure6.4", "href": "https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-11.html", "note": "Figure6.4는 물리적 물질 이동과 돈의 흐름을 다른 화살표로 구분합니다.100kg 계산은 본문 가정입니다."}, {"kind": "공식 문서", "label": "OECD · Extended Producer Responsibility, Abstract (2024)", "href": "https://www.oecd.org/en/publications/extended-producer-responsibility_67587b0b-en.html", "note": "제품 사용 후 단계까지 생산자 책임을 확장하는 정책 원리. 품목·부담방식·법적의무는 관할마다 다릅니다."}, {"kind": "공식 문서", "label": "UNEP·IRP · Global Resources Outlook2024", "href": "https://www.unep.org/resources/Global-Resource-Outlook-2024", "note": "2020년 대비 2060년 추출량 증가를 조건부 전망으로 읽습니다. 보고서와 방법론의 범위를 확인하며 사례의 60%회수율과 섞지 않습니다."}],
  "gpu/amd-gpu-execution-and-hip": [
    {
      "kind": "공식 문서",
      "label": "ROCm HIP-Examples·cdf9d101·54 –56 행",
      "href": "https://github.com/ROCm/HIP-Examples/blob/cdf9d101acd9a3fc89ee750f73c1f1958cbd5cc3/vectorAdd/vectoradd_hip.cpp",
      "note": "ROCm HIP-Examples·cdf9d101·54 –56 행"
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA vectorAdd·3f1c509·49 행",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "NVIDIA vectorAdd·3f1c509·49 행"
    },
    {
      "kind": "공식 문서",
      "label": "AMD HIP7.0.0 ·hardware implementation",
      "href": "https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/understand/hardware_implementation.html",
      "note": "CU·wavefront와 실행 계층. 특정 SKU의 성능 수치는 아닙니다."
    },
    {
      "kind": "공식 문서",
      "label": "AMD CDNA4 Architecture 2258402-C·9 쪽",
      "href": "https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf",
      "note": "LDS 160 KB와 메모리 계층의 세대별 구성."
    },
    {
      "kind": "공식 문서",
      "label": "AMD CDNA4 ISA ·Matrix Arithmetic",
      "href": "https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/instruction-set-architectures/amd-instinct-cdna4-instruction-set-architecture.pdf",
      "note": "MFMA 명령의 target·operand·shape는 해당 ISA로 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "HIP 7.0.0 · warpSize",
      "href": "https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/how-to/hip_cpp_language_extensions.html#warpsize",
      "note": "gfx9의 64와 gfx10 이상 HIP의 32 지원을 RDNA ISA의 표현 능력과 분리합니다."
    }
  ],
  "gpu/hbm-stack-and-memory-requests": [
    {
      "kind": "공식 문서",
      "label": "Synopsys HBM3 PHY ·interface features",
      "href": "https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-phy.html",
      "note": "Synopsys HBM3 PHY ·interface features"
    },
    {
      "kind": "공식 문서",
      "label": "NVIDIA vectorAdd·3f1c509·52 행",
      "href": "https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu",
      "note": "NVIDIA vectorAdd·3f1c509·52 행"
    },
    {
      "kind": "공식 문서",
      "label": "Synopsys HBM3 Controller ·command scheduling",
      "href": "https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-controller.html",
      "note": "Controller가 관리하는 channel·bank와 메모리 명령 지원 범위를 확인합니다."
    },
    {
      "kind": "공식 문서",
      "label": "AMD CDNA4 Architecture 2258402-C·11 쪽",
      "href": "https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf",
      "note": "MI350 계열의 메모리 구성은 해당 SKU 공식 수치에 한정합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Synopsys HBM4 PHY·2026-10-04 확인",
      "href": "https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm4-phy.html",
      "note": "HBM4의 2048비트 인터페이스와 64개 32비트 pseudo-channel을 확인합니다."
    }
  ],
  "markets/financial-products-and-claims": [
    {
      "kind": "공식 문서",
      "label": "CFPB · How does paying down a mortgage work?",
      "href": "https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Investor Bulletin: Structured Notes, What are Structured Notes?",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-76",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "US DOL · Types of Retirement Plans",
      "href": "https://www.dol.gov/general/topic/retirement/typesofplans",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "DB증권 · 제92회 ELB 투자설명서, 2026-07-30",
      "href": "https://kind.krx.co.kr/external/2026/07/30/000632/20260730001461/10603.htm",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Target Date Funds, 2025-03-25",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/target-date-funds-investor-bulletin",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "신한투자증권 · ELS/DLS 기초자산 분류",
      "href": "https://www.shinhansec.com/wts/wealth-management/els/els_guide_invest_tab1/contents.do",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · 2025-09-01 예금보호한도 시행",
      "href": "https://www.fsc.go.kr/po010105/85200",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "FDIC · Deposit insurance calculator rules",
      "href": "https://edie.fdic.gov/print.html",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "EBA · Deposit Guarantee Schemes data",
      "href": "https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/depositor-protection/deposit-guarantee-schemes-data",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Publicly Traded REITs",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-65",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Money Market Funds",
      "href": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "markets/securitization-and-tranches": [
    {
      "kind": "공식 문서",
      "label": "IMF F&D · What Is Securitization?, three-tier structure",
      "href": "https://www.imf.org/external/pubs/ft/fandd/2008/09/basics.htm",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "ESMA · Securitisation Regulation Article 6(3)(a)",
      "href": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/secr/article-6-risk-retention",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · 개정 자산유동화법 시행",
      "href": "https://www.fsc.go.kr/po010102/81349",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "banking/repo-and-collateral-funding": [
    {
      "kind": "공식 문서",
      "label": "ICMA · Repo FAQ 21, What is a haircut?",
      "href": "https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/21-what-is-a-haircut/",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "New York Fed · Repo and Reverse Repo Agreements",
      "href": "https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "한국은행 · RP매입을 통한 시장안정화 조치 이해하기",
      "href": "https://www.bok.or.kr/portal/bbs/B0000347/view.do?menuNo=201106&nttId=10088622",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "markets/covered-calls-and-income-funds": [
    {
      "kind": "공식 문서",
      "label": "OIC · Covered Call, Maximum Gain",
      "href": "https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공개 강의",
      "label": "Fidelity/OIC · Exercise and Assignment, transcript pp.6–7,18",
      "href": "https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/learning-center/Exercise_an_%20assignment_TRANSCRIPT.pdf",
      "note": "공식 강의록의 조기 행사와 계약 교체 부분을 직접 확인했습니다."
    },
    {
      "kind": "공개 강의",
      "label": "OIC · The Covered Call Options Strategy, YouTube",
      "href": "https://www.youtube.com/watch?v=5fRa78w8f0k",
      "note": "영상 설명의 장 구분·발행 주체를 확인했습니다. 전체 자막을 확보하거나 영상을 전부 시청했다는 의미는 아닙니다. 관련 주장과 계산은 OIC 정본·공개 강의록으로 대조했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "QYLD · 2026 Summary Prospectus, Principal Investment Strategies",
      "href": "https://www.sec.gov/Archives/edgar/data/1432353/000143235326000239/a497knasdaq100coveredcall.htm",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "QYLD · 19a Notice, 2026-09-24",
      "href": "https://assets.globalxetfs.com/funds/tax_supplements/QYLD_Form-19a_09242026.docx",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "J.P. Morgan · JEPI Fact Sheet, ELN Risk Summary",
      "href": "https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/specialty/fs-epi-c.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Global X Europe · QYLD UCITS, synthetic strategy",
      "href": "https://globalxetfs.eu/funds/qyld",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Global X · QYLD distribution rate definition",
      "href": "https://www.globalxetfs.com/funds/qyld",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "IRS · Publication 515 (2026), Withholding on Specific Income",
      "href": "https://www.irs.gov/publications/p515",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "국세청 · 2026 펀드 외국납부세액공제 안내",
      "href": "https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
  ],
  "blockchain/robinhood-chain-settlement": [
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Connecting",
      "href": "https://docs.robinhood.com/chain/connecting/",
      "note": "현재 네트워크 식별자·RPC·ETH gas·Ethereum blobs 사용을 확인했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Transaction finality",
      "href": "https://docs.robinhood.com/chain/transaction-finality/",
      "note": "단계별 확인과 canonical 인출의7일 대기를 구분합니다. 통상 지연은 장애·혼잡에 따라 달라집니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Bridging",
      "href": "https://docs.robinhood.com/chain/bridging/",
      "note": "입금 재실행과 인출 시작→대기→L1 claim, 서로 다른 체인의 토큰 주소를 확인합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Protocol contracts",
      "href": "https://docs.robinhood.com/chain/protocol-contracts/",
      "note": "Mainnet·Testnet, L1·L2의 inbox·outbox·gateway 목록을 구분합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "OffchainLabs · Arbitrum SDK, pinned cbb96c6",
      "href": "https://github.com/OffchainLabs/arbitrum-sdk/blob/cbb96c6f7f84d71bdef65d0fd9d3d7275a236711/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts",
      "note": "원본과 라이선스를 보존했습니다. 상태 조회와 지급 트랜잭션의 실행을 구분합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Robinhood Chain · Stock Tokens",
      "href": "https://docs.robinhood.com/chain/stock-tokens/",
      "note": "권리·발행자·raw balance와 multiplier·청약 자격·시간 창을 확인했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Robinhood Assets Jersey · Product documents",
      "href": "https://docs.robinhood.com/rhj",
      "note": "상품별 권리와 국가별 제한은 투자설명서·추가 문서·최종 조건의 적용 대상입니다. 확인일2026-10-04."
    }
  ],
  "blockchain/glamsterdam-block-execution": [
    {
      "kind": "공식 문서",
      "label": "EIP-7773 · Glamsterdam",
      "href": "https://eips.ethereum.org/EIPS/eip-7773",
      "note": "7732·7928의 예정 목록과 활성화 상태. 메인넷 적용 여부는 별도로 확인합니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7732 · ePBS",
      "href": "https://eips.ethereum.org/EIPS/eip-7732",
      "note": "제안·제작 분리와 자료 도착 확인, 실행 검증의 시간 분리를 설명합니다. Review 상태의 제안입니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Ethereum consensus-specs · pinned 889a389",
      "href": "https://github.com/ethereum/consensus-specs/blob/889a389f9f95d2aba52aedf233217f370772dd3d/specs/gloas/beacon-chain.md",
      "note": "Gloas의 실제 자료 구조와 bid 처리 원문입니다. 개발 명세의 commit과 라이선스를 보존했습니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "Ethereum execution-specs · pinned a87891f",
      "href": "https://github.com/ethereum/execution-specs/blob/a87891f7e69eab1f903233c61c5514d8c94bd5d1/src/ethereum/forks/amsterdam/fork.py",
      "note": "계산한 목록의hash와 블록 header를 대조하는 참조 구현입니다. 확인일2026-10-04."
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7928 · Block-Level Access Lists",
      "href": "https://eips.ethereum.org/EIPS/eip-7928",
      "note": "실제 접근·변화의 기록, 인덱스와 검증 조건을 설명합니다. 제안의 성능 가능성과 실측은 구분합니다. 확인일2026-10-04."
    }
  ],
  "ai/world-model-latent-planning": [
    {
      "kind": "공식 구현",
      "label": "LeWM official implementation · 8edfeb3",
      "href": "https://github.com/lucas-maes/le-wm/blob/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/jepa.py",
      "note": "공식 코드 경로를 대조했으며 이 작업에서 학습·로봇 실행은 재현하지 않음. 1차원 수치는 API 역할을 검산하는 가정이다. 학습된 encoder 출력이나 실측 성공률이 아니다."
    },
    {
      "kind": "핵심 논문",
      "label": "LeWorldModel · arXiv 2603.19312v1",
      "href": "https://arxiv.org/html/2603.19312v1",
      "note": "Two-Room·Reacher·Push-T·OGBench-Cube, 단일 L40S의 저자 실험. 본문은 일부 행동 후 재계획을 일반적으로 설명하지만 부록 F.1의 설정은 H=5 전체를 실행한다. 이 글의 H=2·K=1 가정과 다르다."
    },
    {
      "kind": "핵심 논문",
      "label": "V-JEPA 2 · arXiv 2506.09985",
      "href": "https://arxiv.org/abs/2506.09985",
      "note": "공식 논문에 보고된 비디오·로봇 과제의 저자 실험. 비디오 예측 성능 자체가 모든 로봇의 closed-loop 성공을 보장하지 않는다."
    },
    {
      "kind": "핵심 논문",
      "label": "The Planning Limits of Latent World Models · arXiv 2609.39235",
      "href": "https://arxiv.org/abs/2609.39235",
      "note": "Meta-World·BridgeData V2 기반의 저자 실험; 2026-09-30 공개 preprint. 다른 제약·subgoal·value를 쓴 계획기까지 같은 수치 한계라고 단정하지 않는다."
    },
    {
      "kind": "공식 코드",
      "label": "본문에서 사용하는 고정 commit의 전체 구현",
      "href": "https://github.com/galilai-group/stable-worldmodel/blob/21446f1ede6d5284e981bd7b47f432b994e6d812/stable_worldmodel/planning/solver/cem.py",
      "note": "CodeSidebar에 원문 전체와 LICENSE를 보관했습니다. 주석의 숫자 대입은 설명용 검산이며 GPU 학습·성능 재현을 뜻하지 않습니다."
    }
  ],
  "crypto/prover-memory-and-verifier-cost": [
    {
      "kind": "공식 문서",
      "label": "ICICLE2.8.0 · MSM / Memory usage estimation",
      "href": "https://dev.ingonyama.com/2.8.0/icicle/primitives/msm",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "공식 규격",
      "label": "EIP1108 · Specification 요율표",
      "href": "https://eips.ethereum.org/EIPS/eip-1108",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    },
    {
      "kind": "공식 규격",
      "label": "EIP197 · Encoding",
      "href": "https://eips.ethereum.org/EIPS/eip-197",
      "note": "2026-10-04 원문 대조. 본문의 작은 수치는 설명용 가정이며 원 논문의 실측 성능과 구별합니다."
    }
  ],
  "crypto/quantum-computing-and-cryptographic-risk": [    {
      "kind": "핵심 논문",
      "label": "Grover · A fast quantum mechanical algorithm for database search",
      "href": "https://arxiv.org/abs/quant-ph/9605043",
      "note": "네 후보의 진폭 [−0.5,0.5,0.5,0.5]와 반사 결과를 원문의 연산에 대입합니다."
    },     {
      "kind": "핵심 논문",
      "label": "Shor · Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms",
      "href": "https://arxiv.org/abs/quant-ph/9508027",
      "note": "15·밑2·첫 공간256에서 주기4와 측정64, 최대공약수3·5를 연결한 교육용 계산입니다."
    }, {"kind": "공식 문서", "label": "Babbush 외 · 2026 ECDLP 자원 추정 · v2", "href": "https://arxiv.org/abs/2603.28846v2", "note": "2026-04-15 수정 v2를 2026-10-04 확인. §II.2의 논리·물리 자원 조건을 대조합니다. v2는 검증 자료의 ZKP 건전성에 영향을 주던 소프트웨어 오류를 수정했습니다."}, {"kind": "공식 문서", "label": "IBM Quantum Learning · Grover introduction", "href": "https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/introduction", "note": "공식 강의의 제곱근 질의 개선과 실제 장치 비용 구별. 본문을 읽었으며 연결된 동영상 전체 시청을 주장하지 않습니다."}, {"kind": "공식 문서", "label": "NIST · Post-Quantum Cryptography", "href": "https://csrc.nist.gov/Projects/Post-Quantum-Cryptography", "note": "2026-10-04 확인. 표준화 상태는 최종 FIPS와 후보 선정·표준 작성 중인 상태를 나눠 읽습니다."}],
  "crypto/ml-kem-and-noisy-equations": [{"kind": "공식 문서", "label": "FIPS 203 · Algorithm 18, Tables 2–3", "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf", "note": "2024 최종 표준 §6·8. 2025-11-17 errata 안내가 있으므로 구현 시 최신 정정표도 확인합니다."}, {"kind": "공식 문서", "label": "PQClean · ML-KEM-768 kem.c · 0586a824", "href": "https://github.com/PQClean/PQClean/blob/0586a824fc0d49df0b6b6e9179d8d15d06d0974f/crypto_kem/ml-kem-768/clean/kem.c", "note": "136–163행의 원문 바이트와 라이선스를 코드 패널에 보존했습니다. 본문 사례의 작은 수는 이 코드의 파라미터가 아닙니다."}, {"kind": "공식 문서", "label": "NIST SP 800-227 · Recommendations for KEMs", "href": "https://csrc.nist.gov/pubs/sp/800/227/final", "note": "2025-09-18 최종 권고. KEM의 기능과 이를 통신 프로토콜에 조합할 때 필요한 검사를 읽습니다."}, {"kind": "공식 문서", "label": "FIPS 203 최종본·정정 안내", "href": "https://csrc.nist.gov/pubs/fips/203/final", "note": "2026-10-04 확인. 정정표 파일은 접근 제한으로 직접 읽지 못했으며 정정 내용을 추측하지 않습니다."}],
  "crypto/post-quantum-signatures": [{"kind": "공식 문서", "label": "FIPS 204 · Algorithms 7–8, Table 2", "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf", "note": "ML-DSA 최종 표준. 서명·검증, domain context와 key/signature 크기를 대조합니다."}, {"kind": "공식 문서", "label": "PQClean · ML-DSA-44 sign.c · 0586a824", "href": "https://github.com/PQClean/PQClean/blob/0586a824fc0d49df0b6b6e9179d8d15d06d0974f/crypto_sign/ml-dsa-44/clean/sign.c", "note": "135–194행 생성과265–328행 검증을 보존했습니다. 난수·인코딩·일치 검사의 실제 순서를 읽습니다."}, {"kind": "공식 문서", "label": "FIPS 205 · §6–10와 Table 2", "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.205.pdf", "note": "SLH-DSA 최종 표준. WOTS+·FORS·hypertree의 역할과12개 파라미터 묶음의 크기를 확인합니다."}, {"kind": "공식 문서", "label": "NIST PQC · 최신 표준화 상태", "href": "https://csrc.nist.gov/Projects/Post-Quantum-Cryptography", "note": "2026-10-04 확인. FIPS203·204·205와 후속 Falcon·HQC 표준화 상태를 구분합니다."}, {"kind": "공식 문서", "label": "FIPS 204 · 최신 정정 안내", "href": "https://csrc.nist.gov/pubs/fips/204/final", "note": "2026-07-31 정정 예정 항목 안내가 추가됐습니다. 정정표 파일은 접근 제한으로 직접 열지 못했으며 구체 정정 내용을 추정하지 않습니다."}],
  "crypto/quantum-key-distribution": [
    {
      "kind": "핵심 논문",
      "label": "BB84 original scan",
      "href": "https://arxiv.org/abs/2003.06557",
      "note": "p.175~177의 두 기저·선별·공개 검사·인증과 조건부 1/4 불일치를 확인했습니다. 12신호는 교육용 가정입니다. 확인일 2026-10-04."
    },
    {
      "kind": "핵심 논문",
      "label": "Tight Finite-Key Analysis for Quantum Cryptography",
      "href": "https://arxiv.org/html/1103.4130v2",
      "note": "Table I, Methods식(6)·(7),Supplementary(S2). 교육표는 원문 비대칭 기저 프로토콜과 달라식(2)을 직접 대입하지 않았습니다. 확인일 2026-10-04."
    },
    {
      "kind": "공식 규격",
      "label": "ITU-T X.1711 (03/2026)",
      "href": "https://www.itu.int/rec/T-REC-X.1711",
      "note": "2026-03-16 승인·05-12 게시·in force를 확인했습니다. 보안 증명과 구현 보안은 이 프레임워크의 규정 범위 밖입니다. 확인일 2026-10-04."
    },
    {
      "kind": "공식 규격",
      "label": "ITU-T X.1711 full text",
      "href": "https://www.itu.int/epublications/publication/itu-t-x-1711-2026-03-framework-of-quantum-key-distribution-qkd-protocols-in-qkd-networks",
      "note": "§7.2.2의 공개 대화 인증·Note4 PQC 서명, §7.4·8.2·AppendixIV의 후처리를 읽었습니다. 확인일 2026-10-04."
    },
    {
      "kind": "선행·비교 논문",
      "label": "Decoy State Quantum Key Distribution",
      "href": "https://arxiv.org/abs/quant-ph/0411004",
      "note": "강도별 검출 통계로 단일 광자 기여와 오류를 제한하는 조건을 확인했습니다. 확인일 2026-10-04."
    },
    {
      "kind": "선행·비교 논문",
      "label": "Measurement-device-independent quantum key distribution",
      "href": "https://arxiv.org/abs/1109.1473",
      "note": "측정 장치의 신뢰 제거와 양끝 광원 가정의 경계를 구분합니다. 확인일 2026-10-04."
    },
    {
      "kind": "선행·비교 논문",
      "label": "A device-independent quantum key distribution system for distant users",
      "href": "https://www.nature.com/articles/s41586-022-04891-y",
      "note": "DIQKD protocol의 난수·격리·인증·후처리 조건을 확인했습니다. 점근적 키율을 실제 유한 블록 산출량으로 바꾸지 않았습니다. 확인일 2026-10-04."
    },
    {
      "kind": "공식 가이드",
      "label": "NSA QKD and Quantum Cryptography",
      "href": "https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/",
      "note": "NSS 관할 권고·장치·중계·가용성 범위로만 사용했습니다. 페이지의 오래된 NIST 표준화 진행 설명은 현재 상태 근거로 사용하지 않았습니다. 확인일 2026-10-04."
    }
  ],
  "blockchain/eip4844-blob-fee": [
    {
      "kind": "공식 문서",
      "label": "EIP-4844 blob gas accounting",
      "href": "https://eips.ethereum.org/EIPS/eip-4844",
      "note": "초과분과 정수 가격 함수"
    },
    {
      "kind": "공식 문서",
      "label": "EIP-7918 reserve-price branch",
      "href": "https://eips.ethereum.org/EIPS/eip-7918",
      "note": "BPO2 사례에서 다음 초과분 6과 8이 나오는 조건을 비교합니다."
    },
    {
      "kind": "공식 코드",
      "label": "go-ethereum c9a2bc7 eip4844.go",
      "href": "https://github.com/ethereum/go-ethereum/blob/c9a2bc73c847319a8faa57de59e42c0efc420682/consensus/misc/eip4844/eip4844.go",
      "note": "원본 fakeExponential 함수를 여섯 입력으로 로컬에서 실행했습니다."
    }
  ],
  "ai/math-exponents-logarithms": [
    {
      "kind": "공식 문서",
      "label": "OpenStax College Algebra 2e · §6.3의 예제 2와 연습문제 27",
      "href": "https://openstax.org/books/college-algebra-2e/pages/6-3-logarithmic-functions",
      "note": "실제 2³=8의 역관계와 log₂x=−3에 같은 1/8을 대입합니다."
    },
    {
      "kind": "공식 문서",
      "label": "OpenStax College Algebra 2e · §6.5의 곱과 밑 변환 유도",
      "href": "https://openstax.org/books/college-algebra-2e/pages/6-5-logarithmic-properties",
      "note": "M=bᵐ, N=bⁿ에 1/2·1/4·밑 2를 넣어 −1−2=−3을 얻습니다. 양수 입력과 밑 조건을 보존합니다."
    },
    {
      "kind": "공식 코드",
      "label": "CPython v3.9.6 · Modules/mathmodule.c",
      "href": "https://github.com/python/cpython/blob/db3ff76da19004f266b62e98a81bdfd322861436/Modules/mathmodule.c#L2340-L2362",
      "note": "전체 원문·PSF 라이선스·SHA256을 보존했습니다. math_log_impl의 num/den에 0.125와 밑 2를 넣고 로그 0의 오류 래퍼도 확인합니다. 시스템 수학 라이브러리의 내부 근사 구현으로 주장하지 않습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Python 3.9 · math의 log, log2, log1p",
      "href": "https://docs.python.org/3.9/library/math.html",
      "note": "밑 변환 규칙과 별도 log2, 작은 증분을 받는 log1p를 확인합니다. 고정 소스 v3.9.6과 현재 3.9 계열 문서를 구별해 기록했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "Python 3.9 · sys.float_info",
      "href": "https://docs.python.org/3.9/library/sys.html#sys.float_info",
      "note": "float_info.min은 정규 최솟값이며 math.ulp(0.0)은 비정규 값을 포함한 최솟값입니다. 로컬 Python3.9.6 실행에서 2⁻¹⁰²²와 2⁻¹⁰⁷⁴를 구별했습니다."
    }
  ],
  "ai/math-complex-numbers-oscillations": [
    {
      "kind": "공식 문서",
      "label": "NIST DLMF · 지수·사인·코사인 급수와 4.2.24",
      "href": "https://dlmf.nist.gov/4.2.E24",
      "note": "절대수렴 항을 나누고 x=0, y=π/2에 같은 회전을 대입합니다. 급수 원문은 본문에서 각각 연결합니다."
    },
    {
      "kind": "공식 문서",
      "label": "OpenStax Precalculus 2e · 8.5 극형식 곱",
      "href": "https://openstax.org/books/precalculus-2e/pages/8-5-polar-form-of-complex-numbers",
      "note": "r=5인 출발점과 크기 1인 1/4바퀴 회전의 합성에 적용합니다."
    },
    {
      "kind": "공식 코드",
      "label": "CPython v3.9.6 · complexobject.c와 complexobject.h",
      "href": "https://github.com/python/cpython/blob/db3ff76da19004f266b62e98a81bdfd322861436/Objects/complexobject.c",
      "note": "전체 파일과 PSF 라이선스·해시를 보존하며 두 좌표와 네 곱을 추적합니다. 작성 예제의 실제 실행은 원문 파일과 구분합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Python 3.9 계열 · cmath",
      "href": "https://docs.python.org/3.9/library/cmath.html",
      "note": "위상의 라디안 단위와 반환 범위를 확인하고 0의 API 반환값을 수학적 유일 위상과 구별합니다."
    }
  ],
  "ai/math-differential-equations-numerical-solvers": [
    {
      "kind": "공식 문서",
      "label": "Driscoll·Braun FNC v1.0 · Euler 방법과 오차",
      "href": "https://fncbook.github.io/v1.0/ivp/euler.html",
      "note": "식 (168)에 −x와 h=.5를 대입해 .5→.25를 추적하고 식 (171)의 h로 나눈 오차 정의를 대조합니다."
    },
    {
      "kind": "공식 코드",
      "label": "torchdiffeq · 657943a의 실제 solver 경로",
      "href": "https://github.com/rtqichen/torchdiffeq/blob/657943acefa826ef04c025ebeb1ff5e9d60dc268/torchdiffeq/_impl/fixed_grid.py",
      "note": "Euler와 Heun2, integrate, rk2 및 오차 비율 함수를 같은 입력으로 읽어 −.5→.5와 −.375→.625를 구합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Higham 2001 · Brownian 증가량과 Euler–Maruyama",
      "href": "https://epubs.siam.org/doi/10.1137/S0036144500378302",
      "note": "§2와 식 (4.3)에 f=−x, g=.2, h=.25를 대입해 .75+.1ε를 구합니다."
    }
  ],
};

import { AGENT_SECURITY_SOURCES } from "./agent-sandbox-security";
import { B300_SWITCHLESS_SOURCE_LINKS } from "./b300-switchless-network";
import { EUREKA_SOURCE_LINKS } from "./sionic-eureka";
import { GLM_B300_SOURCE_LINKS } from "./sionic-glm-b300";
import { KIMI_K3_SOURCE } from "./kimi-k3";
import { OFFICIAL_SOURCES } from "./official-sources";

export type ArticleEvidenceKind =
  | "핵심 논문"
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

const COMETBFT_SERIES_EVIDENCE: readonly ArticleEvidenceItem[] = [
  source(
    "공식 코드",
    OFFICIAL_SOURCES.cometbft.repository,
    "consensus·mempool·state·P2P 구현의 현재 원본",
  ),
  source(
    "공식 규격",
    OFFICIAL_SOURCES.cometbft.abci,
    "consensus engine과 application 사이의 ABCI++ 경계",
  ),
];

const FILECOIN_LOTUS_SERIES_EVIDENCE: readonly ArticleEvidenceItem[] = [
  {
    kind: "공식 코드",
    label: "filecoin-project/lotus",
    href: "https://github.com/filecoin-project/lotus",
    note: "chain·state·message pool·miner 경계를 확인하는 Lotus 구현 원본",
  },
  source(
    "공식 문서",
    OFFICIAL_SOURCES.filecoin.lotusComponents,
    "Lotus daemon·miner·worker·Boost의 현재 프로세스 경계",
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
  "ai/generative-theory": [
    {
      kind: "핵심 논문",
      label: "Auto-Encoding Variational Bayes",
      href: "https://arxiv.org/abs/1312.6114",
      note: "Variational inference와 reparameterization을 이용한 VAE의 출발점",
    },
    {
      kind: "핵심 논문",
      label: "Generative Adversarial Nets",
      href: "https://arxiv.org/abs/1406.2661",
      note: "Generator와 discriminator의 minimax objective를 제안한 GAN 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "Density Estimation using Real NVP",
      href: "https://arxiv.org/abs/1605.08803",
      note: "가역 coupling transform으로 exact likelihood와 sampling을 구성",
    },
    {
      kind: "핵심 논문",
      label: "Denoising Diffusion Probabilistic Models",
      href: "https://arxiv.org/abs/2006.11239",
      note: "Denoising objective와 iterative reverse process의 기준 논문",
    },
    {
      kind: "핵심 논문",
      label:
        "Generative Modeling by Estimating Gradients of the Data Distribution",
      href: "https://arxiv.org/abs/1907.05600",
      note: "여러 noise level의 score estimation과 annealed Langevin sampling",
    },
    {
      kind: "핵심 논문",
      label:
        "Score-Based Generative Modeling through Stochastic Differential Equations",
      href: "https://arxiv.org/abs/2011.13456",
      note: "Reverse-time SDE와 probability-flow ODE를 하나의 continuous-time framework로 연결",
    },
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
  ],
  "ai/bert": [
    {
      kind: "핵심 논문",
      label: "BERT: Pre-training of Deep Bidirectional Transformers",
      href: "https://arxiv.org/abs/1810.04805",
      note: "MLM·NSP와 encoder-only 사전학습의 원문",
    },
    {
      kind: "핵심 논문",
      label: "RoBERTa: A Robustly Optimized BERT Pretraining Approach",
      href: "https://arxiv.org/abs/1907.11692",
      note: "data·batch·dynamic masking과 NSP 제거를 포함해 BERT recipe를 재검토",
    },
    {
      kind: "핵심 논문",
      label:
        "ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators",
      href: "https://arxiv.org/abs/2003.10555",
      note: "replaced-token detection으로 encoder pretraining objective를 바꾼 연구",
    },
    {
      kind: "핵심 논문",
      label: "ALBERT: A Lite BERT for Self-supervised Learning",
      href: "https://arxiv.org/abs/1909.11942",
      note: "Factorized embedding·cross-layer sharing과 sentence-order prediction으로 BERT를 재설계",
    },
    {
      kind: "핵심 논문",
      label: "Sentence-BERT",
      href: "https://arxiv.org/abs/1908.10084",
      note: "문장 pair를 매번 함께 encoding하는 cross-encoder 비용을 siamese sentence embedding으로 바꾼 연구",
    },
    {
      kind: "공식 문서",
      label: "Hugging Face Transformers — BERT",
      href: "https://huggingface.co/docs/transformers/model_doc/bert",
      note: "input_ids·attention_mask·token_type_ids·position_ids와 task head의 현재 API 계약",
    },
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
    {
      kind: "핵심 논문",
      label: "Gradient-Based Learning Applied to Document Recognition",
      href: "https://doi.org/10.1109/5.726791",
      note: "LeNet 계열 convolutional network와 document recognition을 정리한 논문",
    },
    {
      kind: "핵심 논문",
      label: "ImageNet Classification with Deep Convolutional Neural Networks",
      href: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
      note: "GPU로 학습한 AlexNet이 large-scale image classification에서 보인 결과",
    },
    {
      kind: "보충 읽기",
      label: "A ConvNet for the 2020s",
      href: "https://arxiv.org/abs/2201.03545",
      note: "현대 Transformer 설계 선택을 순수 convolutional network에 적용한 ConvNeXt",
    },
    {
      kind: "핵심 논문",
      label: "Understanding the Effective Receptive Field in Deep CNNs",
      href: "https://arxiv.org/abs/1701.04128",
      note: "이론적 receptive field와 실제 gradient 영향이 집중된 effective receptive field의 차이",
    },
    {
      kind: "핵심 논문",
      label: "Multi-Scale Context Aggregation by Dilated Convolutions",
      href: "https://arxiv.org/abs/1511.07122",
      note: "해상도를 유지하면서 dilation으로 receptive field를 넓히는 dense prediction 설계",
    },
    {
      kind: "핵심 논문",
      label: "MobileNets",
      href: "https://arxiv.org/abs/1704.04861",
      note: "Depthwise separable convolution으로 spatial filtering과 channel mixing 비용을 분리",
    },
    {
      kind: "핵심 논문",
      label: "An Image is Worth 16×16 Words",
      href: "https://arxiv.org/abs/2010.11929",
      note: "큰-scale pretraining에서 pure Transformer가 image patch sequence를 처리한 ViT 원 논문",
    },
  ],
  "ai/word2vec": [
    {
      kind: "핵심 논문",
      label: "Efficient Estimation of Word Representations in Vector Space",
      href: "https://arxiv.org/abs/1301.3781",
      note: "CBOW·Skip-gram의 최초 제안",
    },
    {
      kind: "핵심 논문",
      label: "Distributed Representations of Words and Phrases",
      href: "https://arxiv.org/abs/1310.4546",
      note: "negative sampling과 phrase 학습을 확장한 후속 논문",
    },
    {
      kind: "보충 읽기",
      label: "Neural Word Embedding as Implicit Matrix Factorization",
      href: "https://proceedings.neurips.cc/paper_files/paper/2014/hash/b78666971ceae55a8e87efb7cbfd9ad4-Abstract.html",
      note: "SGNS의 dot product를 shifted-PMI word–context matrix factorization으로 분석",
    },
    {
      kind: "보충 읽기",
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
    {
      kind: "핵심 논문",
      label: "Backpropagation Through Time: What It Does and How to Do It",
      href: "https://doi.org/10.1109/5.58337",
      note: "순환 시스템에 backpropagation을 적용하는 BPTT를 정리한 논문",
    },
    {
      kind: "핵심 논문",
      label: "Recurrent Neural Network Based Language Model",
      href: "https://www.fit.vut.cz/research/groups/speech/publi/2010/mikolov_interspeech2010_IS100722.pdf",
      note: "hidden state로 이전 문맥을 요약해 다음 단어를 예측하는 RNN language model의 출발점",
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
      kind: "보충 읽기",
      label: "Learning Phrase Representations using RNN Encoder–Decoder",
      href: "https://arxiv.org/abs/1406.1078",
      note: "encoder–decoder와 GRU 계열의 gated hidden unit을 제안",
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
  "ai/math-functions-derivatives-gradients": [
    {
      kind: "공개 강의",
      label: "MIT OpenCourseWare 18.01SC — Differentiation",
      href: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/",
      note: "Difference quotient·derivative·chain rule를 단변수 미적분의 문제와 함께 확장하는 공개 강의",
    },
    {
      kind: "공개 강의",
      label:
        "MIT OpenCourseWare 18.02SC — Chain Rule, Gradient and Directional Derivatives",
      href: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/",
      note: "편미분·gradient·directional derivative를 다변수 함수의 기하학으로 확장하는 공개 강의",
    },
  ],
  "ai/math-probability-expectation-variance": [
    {
      kind: "공개 강의",
      label:
        "MIT OpenCourseWare 6.041SC — Probability Models and Discrete Random Variables",
      href: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/",
      note: "Outcome·random variable·expectation·variance와 반복 실험을 문제와 함께 확장하는 공개 강의",
    },
    {
      kind: "핵심 논문",
      label: "A Stochastic Approximation Method",
      href: "https://doi.org/10.1214/aoms/1177729586",
      note: "Noise가 있는 관측으로 expectation-defined target에 접근하는 stochastic approximation의 출발점",
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
  "ai/backprop-optimization": [
    {
      kind: "핵심 논문",
      label: "Learning Representations by Back-propagating Errors",
      href: "https://www.nature.com/articles/323533a0",
      note: "chain rule로 hidden weight의 error contribution을 계산하는 원문",
    },
    {
      kind: "핵심 연구",
      label: "Automatic Differentiation in Machine Learning: a Survey",
      href: "https://jmlr.org/papers/v18/17-468.html",
      note: "finite difference·symbolic differentiation·forward/reverse-mode autodiff의 계산 차이를 정리한 survey",
    },
  ],
  "ai/activation-functions": [
    {
      kind: "핵심 논문",
      label: "Rectified Linear Units Improve Restricted Boltzmann Machines",
      href: "https://www.cs.toronto.edu/~fritz/absps/reluICML.pdf",
      note: "ReLU를 깊은 representation 학습에 적용한 초기 기준 논문",
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
      label: "Adam: A Method for Stochastic Optimization",
      href: "https://arxiv.org/abs/1412.6980",
      note: "1·2차 moment와 bias correction을 결합한 Adam 원문",
    },
    {
      kind: "핵심 논문",
      label: "Decoupled Weight Decay Regularization",
      href: "https://arxiv.org/abs/1711.05101",
      note: "L2 penalty와 adaptive optimizer의 weight decay를 구분한 AdamW 원문",
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
    {
      kind: "핵심 논문",
      label: "ImageNet Classification with Deep Convolutional Neural Networks",
      href: "https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
      note: "대규모 image data·깊은 CNN·GPU training recipe를 결합한 AlexNet 실험",
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
      label: "mixup: Beyond Empirical Risk Minimization",
      href: "https://arxiv.org/abs/1710.09412",
      note: "입력과 label의 convex combination을 사용하는 regularization",
    },
    {
      kind: "핵심 논문",
      label: "CutMix: Regularization Strategy to Train Strong Classifiers",
      href: "https://arxiv.org/abs/1905.04899",
      note: "이미지 영역과 label 비율을 함께 섞는 augmentation",
    },
  ],
  "ai/imbalanced-data": [
    {
      kind: "핵심 논문",
      label: "SMOTE: Synthetic Minority Over-sampling Technique",
      href: "https://www.jair.org/index.php/jair/article/view/10302",
      note: "minority 이웃 사이를 보간하는 원 방법과 평가",
    },
    {
      kind: "핵심 논문",
      label: "Focal Loss for Dense Object Detection",
      href: "https://arxiv.org/abs/1708.02002",
      note: "easy example의 loss 기여를 줄이는 focal loss 원 논문",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn — Precision-Recall",
      href: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html",
      note: "precision–recall curve와 average precision의 해석",
    },
  ],
  "ai/gradient-boosting": [
    {
      kind: "핵심 논문",
      label: "Greedy Function Approximation: A Gradient Boosting Machine",
      href: "https://doi.org/10.1214/aos/1013203451",
      note: "함수 공간에서 negative gradient를 근사하는 gradient boosting의 원문",
    },
    {
      kind: "핵심 논문",
      label: "XGBoost: A Scalable Tree Boosting System",
      href: "https://arxiv.org/abs/1603.02754",
      note: "regularized objective·sparsity-aware split·weighted quantile sketch",
    },
    {
      kind: "핵심 논문",
      label: "LightGBM: A Highly Efficient Gradient Boosting Decision Tree",
      href: "https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html",
      note: "GOSS와 EFB를 제안한 LightGBM 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "CatBoost: unbiased boosting with categorical features",
      href: "https://proceedings.neurips.cc/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html",
      note: "prediction shift와 ordered boosting·categorical statistic 분석",
    },
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
      note: "StepLR·ExponentialLR·CosineAnnealingLR·OneCycleLR의 현재 API와 step 순서",
    },
    {
      kind: "핵심 논문",
      label: "SGDR: Stochastic Gradient Descent with Warm Restarts",
      href: "https://arxiv.org/abs/1608.03983",
      note: "cosine annealing과 warm restart를 제안하고 anytime performance를 평가",
    },
    {
      kind: "핵심 논문",
      label: "Super-Convergence: Very Fast Training Using Large Learning Rates",
      href: "https://arxiv.org/abs/1708.07120",
      note: "큰 maximum learning rate와 one-cycle policy의 조건부 빠른 수렴 현상",
    },
    {
      kind: "핵심 논문",
      label: "On the Adequacy of Untuned Warmup for Adaptive Optimization",
      href: "https://arxiv.org/abs/1910.04209",
      note: "adaptive optimizer의 초기 variance와 warmup schedule을 분석",
    },
  ],
  "ai/regularization-practice": [
    {
      kind: "핵심 논문",
      label:
        "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
      href: "https://jmlr.org/papers/v15/srivastava14a.html",
      note: "activation을 stochastic하게 생략하는 dropout과 approximate model averaging",
    },
    {
      kind: "핵심 논문",
      label: "Decoupled Weight Decay Regularization",
      href: "https://arxiv.org/abs/1711.05101",
      note: "adaptive gradient update에서 weight decay를 분리한 AdamW",
    },
    {
      kind: "핵심 논문",
      label: "Early Stopping — but when?",
      href: "https://link.springer.com/chapter/10.1007/3-540-49430-8_3",
      note: "validation trajectory에서 stopping criterion을 선택하는 고전적 분석",
    },
    {
      kind: "핵심 논문",
      label: "Rethinking the Inception Architecture for Computer Vision",
      href: "https://arxiv.org/abs/1512.00567",
      note: "label smoothing regularization을 포함한 Inception-v3 학습 설계",
    },
  ],
  "ai/image-classification-pipeline": [
    {
      kind: "핵심 논문",
      label:
        "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
      href: "https://arxiv.org/abs/1905.11946",
      note: "depth·width·resolution을 함께 조정하는 compound scaling",
    },
    {
      kind: "핵심 논문",
      label: "A ConvNet for the 2020s",
      href: "https://arxiv.org/abs/2201.03545",
      note: "Transformer 설계 선택을 convolutional network에 적용한 ConvNeXt",
    },
    {
      kind: "핵심 논문",
      label: "An Image is Worth 16x16 Words",
      href: "https://arxiv.org/abs/2010.11929",
      note: "image patch를 token으로 처리하는 Vision Transformer 원 논문",
    },
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
      kind: "Benchmark 논문",
      label: "The Deepfake Detection Challenge Dataset",
      href: "https://arxiv.org/abs/2006.07397",
      note: "동의한 참여자 기반의 대규모 face-swap video dataset과 설계 원칙",
    },
    {
      kind: "Benchmark 논문",
      label: "DeepfakeBench: A Comprehensive Benchmark of Deepfake Detection",
      href: "https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html",
      note: "detector와 dataset을 통일된 pipeline에서 비교하는 재현 benchmark",
    },
    {
      kind: "핵심 논문",
      label: "CNN-Generated Images Are Surprisingly Easy to Spot... for Now",
      href: "https://openaccess.thecvf.com/content_CVPR_2020/html/Wang_CNN-Generated_Images_Are_Surprisingly_Easy_to_Spot..._for_Now_CVPR_2020_paper.html",
      note: "생성 모델의 공통 artifact와 새로운 generator로의 일반화를 분석",
    },
    {
      kind: "비판적 읽기",
      label:
        "A Closer Look at Fourier Spectrum Discrepancies for CNN-Generated Images Detection",
      href: "https://openaccess.thecvf.com/content/CVPR2021/html/Chandrasegaran_A_Closer_Look_at_Fourier_Spectrum_Discrepancies_for_CNN-Generated_Images_CVPR_2021_paper.html",
      note: "고주파 spectrum discrepancy를 보편적이고 robust한 생성 흔적으로 해석하는 주장 재검토",
    },
  ],
  "ai/video-understanding": [
    {
      kind: "핵심 논문",
      label:
        "Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset",
      href: "https://openaccess.thecvf.com/content_cvpr_2017/html/Carreira_Quo_Vadis_Action_CVPR_2017_paper.html",
      note: "2D image network를 3D로 확장한 I3D와 Kinetics pretraining",
    },
    {
      kind: "핵심 논문",
      label:
        "A Closer Look at Spatiotemporal Convolutions for Action Recognition",
      href: "https://openaccess.thecvf.com/content_cvpr_2018/html/Tran_A_Closer_Look_CVPR_2018_paper.html",
      note: "3D convolution을 spatial·temporal 연산으로 분해한 R(2+1)D",
    },
    {
      kind: "핵심 논문",
      label: "SlowFast Networks for Video Recognition",
      href: "https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html",
      note: "공간 의미와 빠른 motion을 서로 다른 frame rate 경로로 처리",
    },
    {
      kind: "핵심 논문",
      label: "TimeSformer",
      href: "https://proceedings.mlr.press/v139/bertasius21a.html",
      note: "공간·시간 attention을 분리한 video transformer",
    },
    {
      kind: "핵심 논문",
      label: "ViViT: A Video Vision Transformer",
      href: "https://openaccess.thecvf.com/content/ICCV2021/html/Arnab_ViViT_A_Video_Vision_Transformer_ICCV_2021_paper.html",
      note: "video tokenization과 여러 spatial-temporal factorization 설계",
    },
    {
      kind: "핵심 논문",
      label: "VideoMAE",
      href: "https://arxiv.org/abs/2203.12602",
      note: "tube masking 기반 self-supervised video pretraining",
    },
  ],
  "ai/competition-workflow": [
    {
      kind: "핵심 논문",
      label: "Hidden Technical Debt in Machine Learning Systems",
      href: "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems",
      note: "data dependency·configuration·monitoring을 포함한 ML system risk의 기준 연구",
    },
    {
      kind: "핵심 논문",
      label: "On Over-fitting in Model Selection and Subsequent Selection Bias",
      href: "https://www.jmlr.org/papers/v11/cawley10a.html",
      note: "유한 validation criterion의 variance와 반복 model selection이 만드는 선택 편향",
    },
    {
      kind: "핵심 논문",
      label:
        "The Ladder: A Reliable Leaderboard for Machine Learning Competitions",
      href: "https://proceedings.mlr.press/v37/blum15.html",
      note: "반복적·적응적 submission이 leaderboard holdout에 overfit하는 문제와 제한적 score 공개",
    },
  ],
  "ai/cross-validation": [
    {
      kind: "공식 문서",
      label:
        "scikit-learn: Cross-validation — evaluating estimator performance",
      href: "https://scikit-learn.org/stable/modules/cross_validation.html",
      note: "K-fold·stratified·group·time-series splitter의 가정과 사용법",
    },
    {
      kind: "핵심 논문",
      label:
        "Cross-Validation: What Does It Estimate and How Well Does It Do It?",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/",
      note: "CV가 추정하는 평균 prediction error와 fold-dependent uncertainty의 해석",
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
      kind: "핵심 논문",
      label: "Optuna: A Next-generation Hyperparameter Optimization Framework",
      href: "https://arxiv.org/abs/1907.10902",
      note: "define-by-run search space와 pruning을 포함한 Optuna 설계",
    },
    {
      kind: "핵심 논문",
      label: "Algorithms for Hyper-Parameter Optimization",
      href: "https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization",
      note: "조건부 search space를 다루는 TPE의 p(configuration | score) 밀도 모델",
    },
    {
      kind: "핵심 논문",
      label:
        "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization",
      href: "https://www.jmlr.org/papers/v18/16-558.html",
      note: "Successive halving과 여러 bracket으로 configuration별 resource를 적응적으로 배분하는 방법",
    },
    {
      kind: "공식 문서",
      label: "Optuna — Study API",
      href: "https://optuna.readthedocs.io/en/stable/reference/generated/optuna.study.Study.html",
      note: "study·trial history·sampler·pruner·storage의 현재 API 계약",
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
      kind: "핵심 논문",
      label: "Regression Quantiles",
      href: "https://doi.org/10.2307/1913643",
      note: "Absolute-loss 기반 conditional quantile regression과 조건부 평균을 넘어선 회귀 target",
    },
    {
      kind: "핵심 논문",
      label: "Strictly Proper Scoring Rules, Prediction, and Estimation",
      href: "https://doi.org/10.1198/016214506000001437",
      note: "실제 probability distribution의 정직한 보고를 유도하는 proper scoring rule의 일반 이론",
    },
    {
      kind: "핵심 논문",
      label: "Cumulated Gain-based Evaluation of IR Techniques",
      href: "https://doi.org/10.1145/582415.582418",
      note: "Graded relevance와 rank discount를 반영하는 cumulative gain·normalized evaluation",
    },
    {
      kind: "공식 문서",
      label: "scikit-learn: Metrics and scoring",
      href: "https://scikit-learn.org/stable/modules/model_evaluation.html",
      note: "classification·regression·ranking metric의 정의와 API",
    },
  ],
  "ai/experiment-tracking": [
    {
      kind: "공식 문서",
      label: "Weights & Biases: Metric logging and artifact aliases",
      href: "https://docs.wandb.ai/guides/track/log/",
      note: "log step·custom metric axis와 immutable artifact version·mutable alias의 현재 semantics",
    },
    {
      kind: "핵심 논문",
      label: "Accelerating the Machine Learning Lifecycle with MLflow",
      href: "https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf",
      note: "Experiment tracking·reproducible projects·model packaging을 공통 lifecycle interface로 만든 초기 MLflow 설계",
    },
    {
      kind: "공식 문서",
      label: "MLflow Architecture and Model Registry Workflows",
      href: "https://mlflow.org/docs/latest/self-hosting/architecture/overview/",
      note: "현재 backend/artifact store 경계와 model stages deprecation·version tags/aliases workflow",
    },
    {
      kind: "핵심 논문",
      label: "Improving Reproducibility in Machine Learning Research",
      href: "https://www.jmlr.org/papers/v22/20-303.html",
      note: "NeurIPS reproducibility program의 code policy·challenge·checklist와 관찰",
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
      label:
        "A Simple Framework for Contrastive Learning of Visual Representations",
      href: "https://proceedings.mlr.press/v119/chen20j.html",
      note: "augmentation·projection head·NT-Xent로 구성한 SimCLR의 기준 논문",
    },
    {
      kind: "핵심 논문",
      label: "FaceNet: A Unified Embedding for Face Recognition and Clustering",
      href: "https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html",
      note: "triplet loss와 online triplet mining을 적용한 metric-learning 기준 연구",
    },
    {
      kind: "핵심 논문",
      label: "Supervised Contrastive Learning",
      href: "https://papers.nips.cc/paper_files/paper/2020/hash/d89a66c7c80a29b1bdbab0f2a1a94af8-Abstract.html",
      note: "같은 class의 여러 sample을 positive로 사용하는 supervised contrastive objective",
    },
  ],
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
      kind: "핵심 논문",
      label: "Generative Adversarial Nets",
      href: "https://arxiv.org/abs/1406.2661",
      note: "generator·discriminator minimax game의 원문",
    },
    {
      kind: "핵심 논문",
      label: "Unsupervised Representation Learning with DCGANs",
      href: "https://arxiv.org/abs/1511.06434",
      note: "Convolutional GAN architecture와 training guideline의 기준",
    },
    {
      kind: "핵심 논문",
      label: "Improved Training of Wasserstein GANs",
      href: "https://arxiv.org/abs/1704.00028",
      note: "Weight clipping을 gradient penalty로 바꾼 WGAN-GP",
    },
    {
      kind: "핵심 논문",
      label: "Wasserstein GAN",
      href: "https://arxiv.org/abs/1701.07875",
      note: "Distribution support가 떨어진 상황의 gradient 문제와 Wasserstein critic의 출발점",
    },
    {
      kind: "핵심 논문",
      label: "Spectral Normalization for GANs",
      href: "https://arxiv.org/abs/1802.05957",
      note: "Discriminator linear layer의 operator norm을 제한하는 경량 regularization",
    },
    {
      kind: "평가 논문",
      label: "GANs Trained by a Two Time-Scale Update Rule",
      href: "https://arxiv.org/abs/1706.08500",
      note: "Generator·discriminator의 별도 learning rate와 FID metric 제안",
    },
    {
      kind: "핵심 논문",
      label: "A Style-Based Generator Architecture for GANs",
      href: "https://arxiv.org/abs/1812.04948",
      note: "Mapping network와 layer-wise style control을 제안한 StyleGAN",
    },
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
      label: "Score-Based Generative Modeling through SDEs",
      href: "https://arxiv.org/abs/2011.13456",
      note: "연속시간 SDE와 probability flow ODE",
    },
    {
      kind: "핵심 논문",
      label: "Flow Matching for Generative Modeling",
      href: "https://arxiv.org/abs/2210.02747",
      note: "velocity field를 직접 학습하는 flow matching",
    },
    {
      kind: "핵심 논문",
      label: "High-Resolution Image Synthesis with Latent Diffusion Models",
      href: "https://arxiv.org/abs/2112.10752",
      note: "Stable Diffusion의 latent-space 생성 경로",
    },
    {
      kind: "핵심 논문",
      label: "U-Net: Convolutional Networks for Biomedical Image Segmentation",
      href: "https://arxiv.org/abs/1505.04597",
      note: "Contracting·expanding path와 long skip connection의 원 구조",
    },
    {
      kind: "핵심 논문",
      label: "Classifier-Free Diffusion Guidance",
      href: "https://arxiv.org/abs/2207.12598",
      note: "Conditional·unconditional score를 결합하는 CFG의 원문",
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
      label: "Direct Preference Optimization",
      href: "https://arxiv.org/abs/2305.18290",
      note: "명시적 reward model 없이 preference를 최적화하는 경로",
    },
    {
      kind: "핵심 논문",
      label: "Constitutional AI",
      href: "https://arxiv.org/abs/2212.08073",
      note: "원칙 기반 self-critique와 RLAIF",
    },
    {
      kind: "핵심 논문",
      label: "KTO: Model Alignment as Prospect Theoretic Optimization",
      href: "https://arxiv.org/abs/2402.01306",
      note: "binary feedback를 prospect theory 관점으로 쓰는 목적함수",
    },
    {
      kind: "핵심 논문",
      label: "ORPO: Monolithic Preference Optimization",
      href: "https://arxiv.org/abs/2403.07691",
      note: "SFT와 preference objective를 한 단계로 결합",
    },
  ],
  "ai/sentence-embeddings": [
    {
      kind: "핵심 논문",
      label: "Sentence-BERT",
      href: "https://aclanthology.org/D19-1410/",
      note: "siamese·triplet BERT로 독립 sentence embedding을 학습하고 pairwise BERT 계산 구조와 비교",
    },
    {
      kind: "핵심 논문",
      label: "Text Embeddings by Weakly-Supervised Contrastive Pre-training",
      href: "https://arxiv.org/abs/2212.03533",
      note: "query·passage role prefix와 multi-stage contrastive training을 사용한 E5",
    },
    {
      kind: "Benchmark 논문",
      label: "MTEB: Massive Text Embedding Benchmark",
      href: "https://arxiv.org/abs/2210.07316",
      note: "retrieval·STS·classification·clustering 등 embedding task의 통합 평가",
    },
  ],
  "ai/domain-finetuning": [
    {
      kind: "핵심 논문",
      label:
        "Don’t Stop Pretraining: Adapt Language Models to Domains and Tasks",
      href: "https://aclanthology.org/2020.acl-main.740/",
      note: "domain-adaptive·task-adaptive pretraining의 효과와 단계 비교",
    },
    {
      kind: "후속 분석",
      label:
        "Investigating Catastrophic Forgetting During Continual Training for Neural Machine Translation",
      href: "https://aclanthology.org/2020.coling-main.381/",
      note: "순차 domain adaptation에서 module·parameter 변화와 이전 domain 성능 저하 분석",
    },
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
      kind: "핵심 논문",
      label:
        "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference",
      href: "https://arxiv.org/abs/1712.05877",
      note: "affine integer quantization·integer-only execution과 quantization-aware training의 기준 연구",
    },
    {
      kind: "핵심 논문",
      label:
        "SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models",
      href: "https://proceedings.mlr.press/v202/xiao23c.html",
      note: "activation outlier 난이도를 equivalent channel scaling으로 weight에 이동하는 W8A8 PTQ",
    },
    {
      kind: "핵심 논문",
      label:
        "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers",
      href: "https://arxiv.org/abs/2210.17323",
      note: "Hessian 정보를 이용한 weight-only post-training quantization",
    },
    {
      kind: "핵심 논문",
      label:
        "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration",
      href: "https://arxiv.org/abs/2306.00978",
      note: "activation 분포를 이용해 중요한 weight를 보호하는 양자화",
    },
    {
      kind: "공식 규격",
      label: "GGUF specification",
      href: "https://github.com/ggml-org/ggml/blob/master/docs/gguf.md",
      note: "tensor와 metadata를 저장하는 GGUF file format 규격",
    },
  ],
  "ai/pruning": [
    {
      kind: "핵심 논문",
      label: "Movement Pruning: Adaptive Sparsity by Fine-Tuning",
      href: "https://arxiv.org/abs/2005.07683",
      note: "fine-tuning 중 weight 변화 방향으로 sparsity를 학습하는 기준 논문",
    },
    {
      kind: "핵심 논문",
      label:
        "SparseGPT: Massive Language Models Can Be Accurately Pruned in One-Shot",
      href: "https://arxiv.org/abs/2301.00774",
      note: "layer-wise reconstruction을 이용한 one-shot LLM pruning",
    },
    {
      kind: "핵심 논문",
      label:
        "A Simple and Effective Pruning Approach for Large Language Models",
      href: "https://arxiv.org/abs/2306.11695",
      note: "weight magnitude와 activation norm을 사용하는 Wanda pruning",
    },
    {
      kind: "공식 문서",
      label: "TensorRT structured sparsity requirements",
      href: "https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/data-formats-tensors.html#sparsity",
      note: "2:4 pattern의 검사 축·precision·builder flag와 실제 sparse tactic 선택 조건",
    },
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
    {
      kind: "핵심 논문",
      label: "Sequence-Level Knowledge Distillation",
      href: "https://aclanthology.org/D16-1139/",
      note: "teacher가 decoding한 sequence를 student target으로 사용하는 sequence-level distillation",
    },
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
      label: "Dense Passage Retrieval for Open-Domain Question Answering",
      href: "https://arxiv.org/abs/2004.04906",
      note: "질문·passage dual encoder와 open-domain QA dense retrieval의 기준 연구",
    },
    {
      kind: "핵심 연구",
      label:
        "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods",
      href: "https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf",
      note: "서로 다른 retrieval ranking을 reciprocal rank 합으로 결합하는 방법",
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
  ],
  "ai/prompt-engineering": [
    {
      kind: "핵심 논문",
      label: "Language Models are Few-Shot Learners",
      href: "https://arxiv.org/abs/2005.14165",
      note: "in-context learning과 few-shot prompting의 대표 출발점",
    },
    {
      kind: "핵심 논문",
      label: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
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
      label: "Calibrate Before Use",
      href: "https://arxiv.org/abs/2102.09690",
      note: "Few-shot prompt format·example·ordering 민감도와 contextual calibration",
    },
    {
      kind: "핵심 논문",
      label: "Language Models Don't Always Say What They Think",
      href: "https://arxiv.org/abs/2305.04388",
      note: "Bias intervention으로 Chain-of-Thought explanation의 faithfulness 한계를 측정",
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
    {
      kind: "핵심 논문",
      label: "Lost in the Middle",
      href: "https://arxiv.org/abs/2307.03172",
      note: "긴 문맥에서 정보 위치에 따라 활용 성능이 달라지는 현상",
    },
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
  ],
  "ai/mcp-protocol": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Architecture",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/architecture",
      note: "stateless core와 host·client·server의 현재 책임",
    },
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Transports",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports",
      note: "stdio·Streamable HTTP와 legacy HTTP+SSE 호환 경계",
    },
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 — Tools",
      href: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools",
      note: "inputSchema·outputSchema·structuredContent의 현재 계약",
    },
    {
      kind: "공식 연구",
      label: "MCP 2026-07-28 release notes",
      href: "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
      note: "stateless 전환·MRTR·authorization·deprecation 변경 요약",
    },
  ],
  "ai/agentic-patterns": [
    {
      kind: "핵심 논문",
      label: "ReAct: Synergizing Reasoning and Acting in Language Models",
      href: "https://arxiv.org/abs/2210.03629",
      note: "판단·행동·관찰을 번갈아 수행하는 에이전트 패턴",
    },
    {
      kind: "핵심 논문",
      label: "Reflexion: Language Agents with Verbal Reinforcement Learning",
      href: "https://arxiv.org/abs/2303.11366",
      note: "외부·내부 feedback을 언어적 reflection과 episodic memory로 다음 trial에 전달하는 구조",
    },
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
      note: "Agentic loop·tool·session·extension·permission·checkpoint를 연결하는 현재 제품 runtime 개요",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Manage Claude's memory",
      href: "https://code.claude.com/docs/en/memory",
      note: "CLAUDE.md scope·ancestor/descendant loading·auto memory·compaction의 현재 동작",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Create custom subagents",
      href: "https://code.claude.com/docs/en/sub-agents",
      note: "별도 context·system prompt·tool access·permission·main handoff의 현재 제품 계약",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Tools reference",
      href: "https://code.claude.com/docs/en/tools-reference",
      note: "Built-in tool identity와 permission·subagent·hook configuration에서 쓰는 현재 tool name",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Permissions",
      href: "https://code.claude.com/docs/en/permissions",
      note: "Deny→ask→allow rule evaluation과 PreToolUse hook decision이 결합되는 현재 판정 순서",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Hooks reference",
      href: "https://code.claude.com/docs/en/hooks",
      note: "Version에 따라 달라질 수 있는 lifecycle event·matcher·handler·input/output 계약",
    },
    {
      kind: "공식 문서",
      label: "Claude Code — Checkpointing",
      href: "https://code.claude.com/docs/en/checkpointing",
      note: "Direct file-edit snapshot과 Bash·subagent·external effect를 구분하는 현재 복구 경계",
    },
  ],
  "ai/qwen-korean-consistency": [
    {
      kind: "공식 문서",
      label: "Qwen3 — Think Deeper, Act Faster",
      href: "https://qwenlm.github.io/blog/qwen3/",
      note: "Qwen3 model family·thinking/non-thinking mode·multilingual capability를 확인하는 공식 release snapshot",
    },
    {
      kind: "핵심 논문",
      label: "Smoothie-Qwen: Post-Hoc Smoothing to Reduce Language Bias in Multilingual LLMs",
      href: "https://arxiv.org/abs/2507.05686",
      note: "Unicode·broken-token risk score와 lm_head row scaling을 이용한 post-hoc language suppression 방법",
    },
    {
      kind: "공식 코드",
      label: "dnotitia/smoothie-qwen",
      href: "https://github.com/dnotitia/smoothie-qwen",
      note: "Risk 분석·min_scale/smoothness 변환·공개 checkpoint와 제한된 Qwen 실험의 재현 구현",
    },
    {
      kind: "핵심 논문",
      label: "Making Qwen3 Think in Korean with Reinforcement Learning",
      href: "https://arxiv.org/abs/2508.10355",
      note: "한국어 reasoning SFT와 Oracle-Guided Dr.GRPO의 사례 연구",
    },
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
  "ai/claw-cli": clawEvidence(),
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
  "ai/claw-file-ops": clawEvidence(),
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
  "ai/claw-api-client": clawEvidence(),
  "ai/claw-config": clawEvidence({
    kind: "공식 규격",
    label: "RFC 8252 — OAuth 2.0 for Native Apps",
    href: "https://www.rfc-editor.org/rfc/rfc8252",
    note: "로컬 loopback redirect와 네이티브 앱 인증 흐름의 표준",
  }),
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
  "ai/claw-hooks": clawEvidence(),
  "ai/claw-plugin": clawEvidence(),
  "ai/claw-worker-boot": clawEvidence(),
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
  "ai/claw-recovery": clawEvidence(),
  "ai/claw-policy-engine": clawEvidence(),
  "ai/claw-task-team": clawEvidence(),
  "ai/claw-subagent-orchestration": clawEvidence(),
  "ai/claw-telemetry": clawEvidence({
    kind: "공식 규격",
    label: "OpenTelemetry specifications",
    href: "https://opentelemetry.io/docs/specs/",
    note: "trace·metric·log과 context propagation의 표준 정의",
  }),
  "ai/claw-mcp": [
    {
      kind: "공식 문서",
      label: "MCP 2026-07-28 specification announcement",
      href: "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
      note: "stateless core·server/discover와 legacy handshake 제거를 확인하는 최신 변경점",
    },
    {
      kind: "공식 문서",
      label: "MCP standard transports",
      href: "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports",
      note: "stdio의 subprocess·stdin/stdout·newline-delimited JSON-RPC 규칙",
    },
    {
      kind: "프로젝트 실측",
      label: "Claw Code repository snapshot",
      note: "11개 내부 상태·stdio process·tool registry는 분석 시점의 구현 구조",
    },
  ],
  "ai/agent-devlog-patterns": [
    {
      kind: "공식 가이드",
      label: "Keep a Changelog 1.1.0",
      href: "https://keepachangelog.com/en/1.1.0/",
      note: "Raw commit dump가 아닌 사람이 읽는 notable-change 목록, 날짜·version·linkable section·Unreleased convention",
    },
    {
      kind: "보충 읽기",
      label: "Michael Nygard — Documenting Architecture Decisions",
      href: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions",
      note: "Architecturally significant decision의 title·status·context·decision·consequences와 superseding history",
    },
    {
      kind: "공식 가이드",
      label: "Google SRE Workbook — Postmortem Culture",
      href: "https://sre.google/workbook/postmortem-culture/",
      note: "Blameless incident analysis, objective trigger/data, measurable preventive action·owner·review의 production 운영 범위",
    },
    {
      kind: "프로젝트 실측",
      label: "개인 context-manager 개발 기록",
      note: "Changelog·ADR·Lessons의 질문별 정본과 조건부 승격을 운영한 고정 사례이며 보편 표준이 아님",
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
    source(
      "공식 코드",
      KIMI_K3_SOURCE,
      "model summary·weights·technical report",
    ),
    {
      kind: "핵심 논문",
      label: "Kimi K3: Open Frontier Intelligence",
      href: "https://arxiv.org/abs/2607.24653",
      note: "2.8T configuration과 sequence·depth·width·training·serving의 공식 기술 보고서",
    },
    {
      kind: "핵심 논문",
      label: "Kimi Linear: An Expressive, Efficient Attention Architecture",
      href: "https://arxiv.org/abs/2510.26692",
      note: "KDA의 선행 구조와 recurrent-state 설계",
    },
    {
      kind: "핵심 논문",
      label: "Attention Residuals",
      href: "https://arxiv.org/abs/2603.15031",
      note: "Depth pseudo-query와 Full·Block AttnRes의 공식 방법·복잡도·실험",
    },
  ],
  "ai/hybrid-attention-serving": [
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
      kind: "핵심 논문",
      label:
        "Efficient Memory Management for Large Language Model Serving with PagedAttention",
      href: "https://arxiv.org/abs/2309.06180",
      note: "KV cache를 fixed-size physical block과 logical block table로 관리해 fragmentation과 sharing을 다루는 vLLM의 핵심 방법",
    },
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
    {
      kind: "공식 문서",
      label: "XGrammar — Constrained Decoding",
      href: "https://xgrammar.mlc.ai/docs/start/constrained_decoding.html",
      note: "grammar state와 token mask의 실제 API",
    },
    {
      kind: "핵심 논문",
      label: "XGrammar 2",
      href: "https://arxiv.org/abs/2601.04426",
      note: "agentic structured generation의 동적 제약",
    },
    {
      kind: "공식 문서",
      label: "Tree-sitter documentation",
      href: "https://tree-sitter.github.io/tree-sitter/",
      note: "incremental parser와 concrete syntax tree",
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
      kind: "핵심 논문",
      label: "Orca: A Distributed Serving System for Transformer-Based Generative Models",
      href: "https://www.usenix.org/conference/osdi22/presentation/yu",
      note: "Iteration-level scheduling과 selective batching의 문제 정의·system evaluation",
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
      kind: "핵심 논문",
      label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve",
      href: "https://arxiv.org/abs/2403.02310",
      note: "Chunked prefill·stall-free scheduling과 throughput-tail-latency tradeoff",
    },
    {
      kind: "핵심 논문",
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
  ],
  "ai/vllm-paged-attention": [
    {
      kind: "핵심 논문",
      label: "Efficient Memory Management for LLM Serving with PagedAttention",
      href: "https://arxiv.org/abs/2309.06180",
      note: "logical·physical KV block mapping과 sharing의 원 논문",
    },
    {
      kind: "핵심 논문",
      label: "SGLang: Efficient Execution of Structured Language Model Programs",
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
      kind: "핵심 논문",
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
      label: "OpenAI Agents SDK — Guardrails and human review",
      href: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      note: "Input/output/tool guardrail과 side effect 전 human approval의 공식 runtime control 경계",
    },
    {
      kind: "공식 문서",
      label: "Anthropic — Harness design for long-running apps",
      href: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      note: "planner·generator·evaluator 구조와 구성 요소 ablation",
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
    {
      kind: "공식 문서",
      label: "TanStack AI — Code Mode",
      href: "https://tanstack.com/ai/latest/docs/code-mode/code-mode",
      note: "typed tool program을 만드는 구현 예시",
    },
  ],
  "ai/agent-sandbox-security": [
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.podSecurity,
      "기본 Pod 보안 경계",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.gvisorSecurity,
      "userspace kernel 보안 모델",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.kataVirtualization,
      "guest-kernel VM 경계",
    ),
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
      AGENT_SECURITY_SOURCES.gvisorGpu,
      "nvproxy GPU ioctl mediation과 support matrix",
    ),
    source(
      "공식 문서",
      AGENT_SECURITY_SOURCES.kataGpu,
      "VFIO 기반 Kata GPU passthrough 구성 경계",
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
  ),
  "blockchain/reth-chainspec": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-cli": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-db": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-eip1559": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "EIP-1559 — Fee market change for ETH 1.0 chain",
    href: "https://eips.ethereum.org/EIPS/eip-1559",
    note: "base fee update와 transaction fee 계산의 규범적 정의",
  }),
  "blockchain/reth-eip4844": withSeriesEvidence(RETH_SERIES_EVIDENCE, {
    kind: "공식 규격",
    label: "EIP-4844 — Shard Blob Transactions",
    href: "https://eips.ethereum.org/EIPS/eip-4844",
    note: "blob transaction·KZG commitment·blob gas의 규범적 정의",
  }),
  "blockchain/reth-exex": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-mev": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-net": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-payload-builder": withSeriesEvidence(
    RETH_SERIES_EVIDENCE,
    source(
      "공식 문서",
      OFFICIAL_SOURCES.reth.payloadBuilder,
      "local payload construction의 현재 API 경계",
    ),
  ),
  "blockchain/reth-pipeline": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-precompiles": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-provider": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-rpc": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-sync": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-trie": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/reth-txpool": withSeriesEvidence(RETH_SERIES_EVIDENCE),
  "blockchain/prysm-attestation": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-beacon-api": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.beaconApi,
      "beacon node REST endpoint와 request·response schema",
    ),
  ),
  "blockchain/prysm-beacon-db": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-beacon-state": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-block-processing": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
  ),
  "blockchain/prysm-block-proposal": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-bls": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
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
  "blockchain/prysm-slot-processing": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-ssz": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.ethereum.ssz,
      "serialization과 hash-tree-root의 공식 규칙",
    ),
  ),
  "blockchain/prysm-state-cache": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-sync": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-sync-committee": withSeriesEvidence(PRYSM_SERIES_EVIDENCE),
  "blockchain/prysm-validator-client": withSeriesEvidence(
    PRYSM_SERIES_EVIDENCE,
  ),
  "blockchain/cometbft-abci": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-consensus": withSeriesEvidence(
    COMETBFT_SERIES_EVIDENCE,
    source(
      "공식 규격",
      OFFICIAL_SOURCES.cometbft.consensus,
      "round·proposal·prevote·precommit과 commit 조건",
    ),
  ),
  "blockchain/cometbft-crypto": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-execution": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-mempool": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-p2p": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-state": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/cometbft-types": withSeriesEvidence(COMETBFT_SERIES_EVIDENCE),
  "blockchain/filecoin-f3": [
    {
      kind: "공식 코드",
      label: "filecoin-project/go-f3",
      href: "https://github.com/filecoin-project/go-f3",
      note: "Filecoin Fast Finality의 현재 Go 구현",
    },
    {
      kind: "공식 규격",
      label: "FIP-0086 — Fast Finality in Filecoin",
      href: "https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0086.md",
      note: "F3 도입 목적과 protocol activation의 공식 제안",
    },
  ],
  "blockchain/expected-consensus": [
    ...FILECOIN_LOTUS_SERIES_EVIDENCE,
    {
      kind: "공식 규격",
      label: "Filecoin Specification — Expected Consensus",
      href: "https://spec.filecoin.io/algorithms/expected_consensus/",
      note: "sortition·TipSet·chain weight를 정의하는 합의 규격",
    },
  ],
  "blockchain/ipfs-filecoin-storage": [
    {
      kind: "공식 문서",
      label: "IPFS Docs — How IPFS works",
      href: "https://docs.ipfs.tech/concepts/how-ipfs-works/",
      note: "CID·DHT·Bitswap을 거치는 콘텐츠 검색의 역할 경계",
    },
    {
      kind: "공식 문서",
      label: "Filecoin Docs — How storage works",
      href: "https://docs.filecoin.io/basics/how-storage-works/",
      note: "Filecoin의 장기 보관 계약과 retrieval을 구분하는 기준",
    },
  ],
  "blockchain/lotus-chain": FILECOIN_LOTUS_SERIES_EVIDENCE,
  "blockchain/lotus-market": FILECOIN_LOTUS_SERIES_EVIDENCE,
  "blockchain/lotus-miner": FILECOIN_LOTUS_SERIES_EVIDENCE,
  "blockchain/lotus-mpool": FILECOIN_LOTUS_SERIES_EVIDENCE,
  "blockchain/lotus-state": [
    ...FILECOIN_LOTUS_SERIES_EVIDENCE,
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.actors,
      "chain state와 built-in actor의 책임 경계",
    ),
  ],
  "blockchain/proofs-porep": FILECOIN_PROOFS_SERIES_EVIDENCE,
  "blockchain/proofs-post": FILECOIN_PROOFS_SERIES_EVIDENCE,
  "blockchain/proofs-snark": FILECOIN_PROOFS_SERIES_EVIDENCE,
  "blockchain/filecoin-fvm": [
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.fvm,
      "message execution과 actor runtime의 개념 경계",
    ),
    {
      kind: "공식 코드",
      label: "filecoin-project/ref-fvm",
      href: "https://github.com/filecoin-project/ref-fvm",
      note: "Machine·Executor·Kernel·syscall의 reference implementation",
    },
  ],
  "blockchain/filecoin-ipc": [
    source(
      "공식 문서",
      OFFICIAL_SOURCES.ipc.architecture,
      "subnet과 parent–child 구조의 전체 경계",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.ipc.parentChild,
      "top-down message와 bottom-up checkpoint의 상호작용",
    ),
  ],
  "blockchain/filecoin-onchain-cloud": [
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.onchainCloud,
      "service·PDP·payments를 묶는 현재 architecture",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.pay,
      "Filecoin Pay의 account·rail·settlement 개념",
    ),
  ],
  "blockchain/filecoin-pdp": [
    source(
      "공식 코드",
      OFFICIAL_SOURCES.filecoin.pdp,
      "PDP contract와 proof schedule의 현재 설계",
    ),
  ],
  "blockchain/filecoin-proofs": [
    {
      kind: "공식 코드",
      label: "filecoin-project/rust-fil-proofs",
      href: "https://github.com/filecoin-project/rust-fil-proofs",
      note: "Filecoin sealing·PoRep·PoSt 구현의 공식 Rust 원본",
    },
  ],
  "blockchain/filecoin-storacha": [
    {
      kind: "공식 코드",
      label: "Storacha GitHub organization",
      href: "https://github.com/storacha",
      note: "Storacha client·upload·UCAN 구현을 확인하는 공식 저장소 모음",
    },
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
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.lotusComponents,
      "daemon·miner·worker·Boost의 현재 프로세스 경계",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.actors,
      "chain state와 built-in actor 역할",
    ),
    source(
      "공식 문서",
      OFFICIAL_SOURCES.filecoin.fvm,
      "message 실행과 FVM 경계",
    ),
    {
      kind: "공식 코드",
      label: "filecoin-project/lotus",
      href: "https://github.com/filecoin-project/lotus",
      note: "Lotus daemon·chain·miner 구현의 원본",
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
};

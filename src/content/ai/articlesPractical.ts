import type { Article } from '../types';

// ── A. 데이터 준비 & 피처 엔지니어링 ──
const dataArticles: Article[] = [
  {
    slug: 'eda-workflow',
    title: 'EDA 워크플로우: 데이터를 처음 받았을 때',
    subcategory: 'ai-practical-data',
    sections: [
      { id: 'overview', title: '탐색적 데이터 분석이란' },
      { id: 'distribution', title: '분포 확인 & 타겟 분석' },
      { id: 'correlation', title: '상관관계 & 피처 관계' },
      { id: 'missing', title: '결측치 패턴 분석' },
      { id: 'hypothesis', title: '가설 수립 & 시각화' },
    ],
    component: () => import('@/pages/articles/ai/eda-workflow'),
  },
  {
    slug: 'feature-engineering',
    title: '피처 엔지니어링: 모델보다 피처가 순위를 결정한다',
    subcategory: 'ai-practical-data',
    sections: [
      { id: 'overview', title: '왜 피처 엔지니어링인가' },
      { id: 'numeric', title: '수치형 변환: 스케일링, 구간화, 로그' },
      { id: 'categorical', title: '범주형 인코딩: 타겟, 빈도, 임베딩' },
      { id: 'interaction', title: '인터랙션 & 파생 변수' },
      { id: 'aggregation', title: '집계 피처: groupby 전략' },
      { id: 'selection', title: '피처 선택: 중요도, 상관, Boruta' },
    ],
    component: () => import('@/pages/articles/ai/feature-engineering'),
  },
  {
    slug: 'data-augmentation',
    title: '데이터 증강: 적은 데이터로 일반화하기',
    subcategory: 'ai-practical-data',
    sections: [
      { id: 'overview', title: '증강이 왜 필요한가' },
      { id: 'geometric', title: '기하학적 변환: Flip, Rotate, Crop' },
      { id: 'color', title: '색상 변환: Jitter, Normalize, CLAHE' },
      { id: 'advanced', title: '고급 기법: Mixup, CutMix, Mosaic' },
      { id: 'tabular', title: '테이블형 증강: SMOTE, 노이즈 주입' },
      { id: 'pipeline', title: 'Albumentations 실전 파이프라인' },
    ],
    component: () => import('@/pages/articles/ai/data-augmentation'),
  },
  {
    slug: 'imbalanced-data',
    title: '불균형 데이터: 정상 95% vs 이상 5%',
    subcategory: 'ai-practical-data',
    sections: [
      { id: 'overview', title: '불균형이 왜 문제인가' },
      { id: 'sampling', title: '리샘플링: Over/Under/SMOTE' },
      { id: 'loss', title: '손실 함수: Focal Loss, Class Weight' },
      { id: 'threshold', title: '임계값 최적화' },
      { id: 'evaluation', title: '평가: PR곡선, F1, Cohen Kappa' },
    ],
    component: () => import('@/pages/articles/ai/imbalanced-data'),
  },
];

// ── B. 테이블형 모델링 ──
const tabularArticles: Article[] = [
  {
    slug: 'gradient-boosting',
    title: 'Gradient Boosting: XGBoost에서 CatBoost까지',
    subcategory: 'ai-practical-tabular',
    sections: [
      { id: 'overview', title: 'Decision Tree → Ensemble 진화' },
      { id: 'boosting', title: 'Gradient Boosting 원리' },
      { id: 'xgboost', title: 'XGBoost: histogram-based split' },
      { id: 'lightgbm', title: 'LightGBM: leaf-wise 성장' },
      { id: 'catboost', title: 'CatBoost: 순서형 부스팅' },
      { id: 'comparison', title: '3대 GBM 비교 & 선택 기준' },
    ],
    component: () => import('@/pages/articles/ai/gradient-boosting'),
  },
  {
    slug: 'tabular-deep-learning',
    title: '테이블 딥러닝: TabNet에서 FT-Transformer까지',
    subcategory: 'ai-practical-tabular',
    sections: [
      { id: 'overview', title: 'GBM vs 딥러닝: 테이블에서의 대결' },
      { id: 'tabnet', title: 'TabNet: 어텐션 기반 피처 선택' },
      { id: 'ft-transformer', title: 'FT-Transformer: 피처 토크나이저' },
      { id: 'when-dl-wins', title: '딥러닝이 이기는 조건' },
    ],
    component: () => import('@/pages/articles/ai/tabular-deep-learning'),
  },
  {
    slug: 'time-features',
    title: '시계열 피처: 래그, 롤링, 주기 인코딩',
    subcategory: 'ai-practical-tabular',
    sections: [
      { id: 'overview', title: '시계열 피처가 왜 특별한가' },
      { id: 'lag', title: '래그 피처 & 차분' },
      { id: 'rolling', title: '롤링 통계: 이동 평균, 표준편차' },
      { id: 'cyclic', title: '주기 인코딩: sin/cos 변환' },
      { id: 'leakage', title: '미래 누출 방지 전략' },
    ],
    component: () => import('@/pages/articles/ai/time-features'),
  },
  {
    slug: 'sequence-modeling-tabular',
    title: '시퀀스 모델링: 이벤트 체인을 입력으로',
    subcategory: 'ai-practical-tabular',
    sections: [
      { id: 'overview', title: '이벤트 시퀀스란' },
      { id: 'encoding', title: '시퀀스 인코딩 전략' },
      { id: 'aggregation', title: '시퀀스 집계 피처' },
      { id: 'transformer', title: 'Transformer 기반 시퀀스 입력' },
    ],
    component: () => import('@/pages/articles/ai/sequence-modeling-tabular'),
  },
];

// ── C. 학습 파이프라인 ──
const pipelineArticles: Article[] = [
  {
    slug: 'training-pipeline',
    title: 'PyTorch 학습 파이프라인: 실전 뼈대',
    subcategory: 'ai-practical-pipeline',
    sections: [
      { id: 'overview', title: '학습 루프의 구조' },
      { id: 'dataset', title: 'Dataset & DataLoader 설계' },
      { id: 'loop', title: '학습/검증 루프 구현' },
      { id: 'checkpoint', title: '체크포인트 & 재현성 (시드 고정)' },
      { id: 'logging', title: '로깅 & 모니터링' },
    ],
    component: () => import('@/pages/articles/ai/training-pipeline'),
  },
  {
    slug: 'transfer-learning-practice',
    title: 'Transfer Learning 실전: pretrained → fine-tuning',
    subcategory: 'ai-practical-pipeline',
    sections: [
      { id: 'overview', title: '전이학습이 왜 강력한가' },
      { id: 'freezing', title: '레이어 동결 전략' },
      { id: 'lr-strategy', title: 'Discriminative LR & warmup' },
      { id: 'feature-vs-finetune', title: 'Feature Extraction vs Full Fine-tuning' },
      { id: 'domain-shift', title: '도메인 차이가 클 때의 전략' },
    ],
    component: () => import('@/pages/articles/ai/transfer-learning-practice'),
  },
  {
    slug: 'lr-scheduling',
    title: '학습률 스케줄링: warmup에서 cosine annealing까지',
    subcategory: 'ai-practical-pipeline',
    sections: [
      { id: 'overview', title: '학습률이 왜 중요한가' },
      { id: 'step-exponential', title: 'StepLR & ExponentialLR' },
      { id: 'cosine', title: 'Cosine Annealing & Warm Restart' },
      { id: 'onecycle', title: 'OneCycleLR: Super-Convergence' },
      { id: 'warmup', title: 'Warmup 전략 & 조합' },
    ],
    component: () => import('@/pages/articles/ai/lr-scheduling'),
  },
  {
    slug: 'regularization-practice',
    title: '정규화 실전: 오버피팅 방어 전략',
    subcategory: 'ai-practical-pipeline',
    sections: [
      { id: 'overview', title: '오버피팅 진단법' },
      { id: 'dropout', title: 'Dropout & Spatial Dropout' },
      { id: 'weight-decay', title: 'Weight Decay vs L2' },
      { id: 'early-stopping', title: 'Early Stopping 전략' },
      { id: 'label-smoothing', title: 'Label Smoothing & Mixup' },
    ],
    component: () => import('@/pages/articles/ai/regularization-practice'),
  },
];

// ── D. 실전 컴퓨터 비전 ──
const cvArticles: Article[] = [
  {
    slug: 'image-classification-pipeline',
    title: '이미지 분류 파이프라인: end-to-end 실전',
    subcategory: 'ai-practical-cv',
    sections: [
      { id: 'overview', title: '이미지 분류 대회 접근법' },
      { id: 'backbone', title: '백본 선택: EfficientNet, ConvNeXt, ViT' },
      { id: 'training', title: '학습 전략: Progressive Resizing, TTA' },
      { id: 'postprocess', title: '후처리: Threshold, Ensemble' },
    ],
    component: () => import('@/pages/articles/ai/image-classification-pipeline'),
  },
  {
    slug: 'vision-transformer',
    title: 'Vision Transformer: 패치에서 분류까지',
    subcategory: 'ai-practical-cv',
    sections: [
      { id: 'overview', title: 'CNN의 한계와 ViT의 등장' },
      { id: 'patch-embedding', title: '패치 임베딩 & 위치 인코딩' },
      { id: 'architecture', title: 'ViT / DeiT / Swin 아키텍처' },
      { id: 'tradeoff', title: 'CNN vs ViT: 데이터량별 트레이드오프' },
      { id: 'practice', title: '실전: timm 라이브러리 활용' },
    ],
    component: () => import('@/pages/articles/ai/vision-transformer'),
  },
  {
    slug: 'multiview-fusion',
    title: '멀티뷰 퓨전: 여러 이미지를 하나의 예측으로',
    subcategory: 'ai-practical-cv',
    sections: [
      { id: 'overview', title: '멀티뷰 문제란' },
      { id: 'early-fusion', title: 'Early Fusion: 채널 결합' },
      { id: 'late-fusion', title: 'Late Fusion: 피처 결합' },
      { id: 'attention-fusion', title: 'Attention 기반 퓨전' },
    ],
    component: () => import('@/pages/articles/ai/multiview-fusion'),
  },
  {
    slug: 'deepfake-detection',
    title: '딥페이크 탐지: 얼굴 추출에서 분류까지',
    subcategory: 'ai-practical-cv',
    sections: [
      { id: 'overview', title: '딥페이크 탐지의 어려움' },
      { id: 'face-extraction', title: '얼굴 검출 & 정렬' },
      { id: 'frequency', title: '주파수 분석: FFT 기반 아티팩트' },
      { id: 'models', title: '탐지 모델: XceptionNet, EfficientNet' },
      { id: 'external-data', title: '외부 데이터 구축 전략' },
    ],
    component: () => import('@/pages/articles/ai/deepfake-detection'),
  },
  {
    slug: 'video-understanding',
    title: '비디오 이해: 프레임에서 시공간 추론으로',
    subcategory: 'ai-practical-cv',
    sections: [
      { id: 'overview', title: '비디오 vs 이미지 차이' },
      { id: 'sampling', title: '프레임 샘플링 전략' },
      { id: '3dcnn', title: '3D CNN & SlowFast' },
      { id: 'video-transformer', title: 'VideoMAE & TimeSformer' },
    ],
    component: () => import('@/pages/articles/ai/video-understanding'),
  },
];

// ── E. 도메인 특화 임베딩 ──
const embeddingArticles: Article[] = [
  {
    slug: 'contrastive-learning',
    title: 'Contrastive Learning: 비슷한 건 가깝게, 다른 건 멀게',
    subcategory: 'ai-practical-embedding',
    sections: [
      { id: 'overview', title: '대조 학습의 핵심 아이디어' },
      { id: 'simclr', title: 'SimCLR: 자기지도 대조 학습' },
      { id: 'triplet', title: 'Triplet Loss & Hard Negative Mining' },
      { id: 'supervised', title: 'Supervised Contrastive Loss' },
      { id: 'application', title: '임베딩 품질 향상 실전' },
    ],
    component: () => import('@/pages/articles/ai/contrastive-learning'),
  },
  {
    slug: 'domain-finetuning',
    title: '도메인 Fine-tuning: 사전학습 모델을 내 데이터에',
    subcategory: 'ai-practical-embedding',
    sections: [
      { id: 'overview', title: '도메인 적응이 왜 필요한가' },
      { id: 'continued-pretrain', title: 'Continued Pretraining 전략' },
      { id: 'task-finetune', title: 'Task-specific Fine-tuning' },
      { id: 'genomic', title: '도메인 사례: 유전체, 의료, 제조' },
    ],
    component: () => import('@/pages/articles/ai/domain-finetuning'),
  },
  {
    slug: 'sentence-embeddings',
    title: '문장 임베딩: 시퀀스를 고정 벡터로',
    subcategory: 'ai-practical-embedding',
    sections: [
      { id: 'overview', title: 'CLS 토큰 vs 평균 풀링' },
      { id: 'sbert', title: 'Sentence-BERT: 샴 네트워크' },
      { id: 'modern', title: 'E5, BGE, GTE: 현대 임베딩 모델' },
      { id: 'evaluation', title: '임베딩 품질 평가법' },
    ],
    component: () => import('@/pages/articles/ai/sentence-embeddings'),
  },
];

// ── F. 모델 경량화 ──
const compressionArticles: Article[] = [
  {
    slug: 'quantization',
    title: '양자화: INT8에서 FP4까지, 정밀도와 효율의 균형',
    subcategory: 'ai-practical-compression',
    sections: [
      { id: 'overview', title: '양자화가 왜 필요한가' },
      { id: 'ptq', title: 'PTQ: 학습 없이 양자화' },
      { id: 'qat', title: 'QAT: 양자화 인식 학습' },
      { id: 'gptq-awq', title: 'GPTQ vs AWQ vs GGUF: LLM 양자화' },
      { id: 'practice', title: '실전: VRAM 예산별 최적 정밀도' },
    ],
    component: () => import('@/pages/articles/ai/quantization'),
  },
  {
    slug: 'pruning',
    title: '프루닝: 어떤 뉴런을 날려도 되는가',
    subcategory: 'ai-practical-compression',
    sections: [
      { id: 'overview', title: '프루닝의 원리' },
      { id: 'unstructured', title: 'Magnitude Pruning & Lottery Ticket' },
      { id: 'structured', title: 'Structured Pruning: 채널/헤드 제거' },
      { id: 'llm', title: 'LLM 프루닝: SparseGPT, Wanda' },
      { id: 'recovery', title: '프루닝 후 fine-tuning 전략' },
    ],
    component: () => import('@/pages/articles/ai/pruning'),
  },
  {
    slug: 'knowledge-distillation',
    title: '지식 증류: Teacher에서 Student로',
    subcategory: 'ai-practical-compression',
    sections: [
      { id: 'overview', title: '지식 증류란' },
      { id: 'logit', title: 'Logit Distillation: soft target 학습' },
      { id: 'feature', title: 'Feature Distillation: 중간 표현 전달' },
      { id: 'llm', title: 'LLM 증류: DistilBERT → TinyLlama' },
      { id: 'self', title: 'Self-Distillation & Born-Again Networks' },
    ],
    component: () => import('@/pages/articles/ai/knowledge-distillation'),
  },
  {
    slug: 'compression-pipeline',
    title: '경량화 파이프라인: 양자화+프루닝+증류 조합',
    subcategory: 'ai-practical-compression',
    sections: [
      { id: 'overview', title: '기법 조합의 시너지' },
      { id: 'order', title: '적용 순서: 프루닝→증류→양자화' },
      { id: 'budget', title: 'VRAM 예산별 최적 전략' },
      { id: 'benchmark', title: '벤치마크: 크기 vs 속도 vs 정확도' },
    ],
    component: () => import('@/pages/articles/ai/compression-pipeline'),
  },
];

// ── G. LLM 응용 ──
const llmAppArticles: Article[] = [
  {
    slug: 'rag-pipeline',
    title: 'RAG 파이프라인: 검색 증강 생성 실전 구축',
    subcategory: 'ai-practical-llm',
    sections: [
      { id: 'overview', title: 'RAG가 왜 필요한가' },
      { id: 'chunking', title: '문서 청킹 전략' },
      { id: 'embedding', title: '임베딩 & 벡터 DB (FAISS, Chroma)' },
      { id: 'retrieval', title: '검색 전략: Dense, Sparse, Hybrid' },
      { id: 'generation', title: '생성 & 프롬프트 설계' },
      { id: 'evaluation', title: 'RAG 평가: Faithfulness, Relevance' },
    ],
    component: () => import('@/pages/articles/ai/rag-pipeline'),
  },
  {
    slug: 'lora-finetuning',
    title: 'LoRA & QLoRA: 효율적 파인튜닝',
    subcategory: 'ai-practical-llm',
    sections: [
      { id: 'overview', title: 'Full Fine-tuning의 한계' },
      { id: 'lora', title: 'LoRA: 저랭크 적응 행렬' },
      { id: 'qlora', title: 'QLoRA: 4비트 양자화 + LoRA' },
      { id: 'data', title: '학습 데이터 준비 & 포맷' },
      { id: 'practice', title: '실전: 학습 → 병합 → 배포' },
    ],
    component: () => import('@/pages/articles/ai/lora-finetuning'),
  },
  {
    slug: 'multi-agent-implementation',
    title: '멀티 에이전트 구현: 역할 분담 시스템 만들기',
    subcategory: 'ai-practical-llm',
    sections: [
      { id: 'overview', title: '멀티 에이전트가 왜 필요한가' },
      { id: 'architecture', title: '아키텍처 패턴: 계층형, 수평형' },
      { id: 'langgraph', title: 'LangGraph로 상태 기반 에이전트' },
      { id: 'crewai', title: 'CrewAI로 역할 기반 팀' },
      { id: 'manufacturing', title: '제조 도메인 적용 사례' },
    ],
    component: () => import('@/pages/articles/ai/multi-agent-implementation'),
  },
];

// ── H. 대회 전략 & 실험 관리 ──
const strategyArticles: Article[] = [
  {
    slug: 'competition-workflow',
    title: '대회 워크플로우: 시작부터 제출까지',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '대회 접근 프레임워크' },
      { id: 'eda-phase', title: 'EDA 단계: 첫 24시간' },
      { id: 'baseline', title: '베이스라인 구축' },
      { id: 'iteration', title: '실험 반복: 가설 → 검증 → 기록' },
      { id: 'final', title: '마감 전략: 앙상블 & 선택' },
    ],
    component: () => import('@/pages/articles/ai/competition-workflow'),
  },
  {
    slug: 'cross-validation',
    title: '교차 검증: 리더보드 신뢰도 확보',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '왜 교차 검증인가' },
      { id: 'kfold', title: 'K-Fold & Stratified K-Fold' },
      { id: 'group', title: 'GroupKFold: 그룹 누출 방지' },
      { id: 'timeseries', title: 'TimeSeriesSplit: 시간 순서 보존' },
      { id: 'cv-lb', title: 'CV-LB 상관관계: 신뢰할 수 있는 CV' },
    ],
    component: () => import('@/pages/articles/ai/cross-validation'),
  },
  {
    slug: 'hyperparameter-tuning',
    title: '하이퍼파라미터 튜닝: Optuna 실전',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '탐색 전략 비교' },
      { id: 'optuna', title: 'Optuna: Bayesian 최적화' },
      { id: 'search-space', title: '탐색 공간 설계' },
      { id: 'pruning', title: '조기 종료 & 멀티 목적' },
    ],
    component: () => import('@/pages/articles/ai/hyperparameter-tuning'),
  },
  {
    slug: 'ensemble-methods',
    title: '앙상블: 단일 모델에서 상위권으로',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '앙상블이 왜 효과적인가' },
      { id: 'averaging', title: 'Weighted Average & Rank Average' },
      { id: 'stacking', title: 'Stacking: 메타 모델 학습' },
      { id: 'blending', title: 'Blending & 다양성 확보' },
      { id: 'practice', title: '실전: 최적 조합 찾기' },
    ],
    component: () => import('@/pages/articles/ai/ensemble-methods'),
  },
  {
    slug: 'evaluation-metrics',
    title: '평가 지표: 지표가 모델 선택을 결정한다',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '지표를 왜 깊이 알아야 하는가' },
      { id: 'regression', title: '회귀: RMSE, MAE, RMSLE, R2' },
      { id: 'classification', title: '분류: AUC, F1, LogLoss, MCC' },
      { id: 'ranking', title: '랭킹: MAP, NDCG' },
      { id: 'optimization', title: '지표별 최적화 전략' },
    ],
    component: () => import('@/pages/articles/ai/evaluation-metrics'),
  },
  {
    slug: 'experiment-tracking',
    title: '실험 관리: W&B와 MLflow로 재현성 확보',
    subcategory: 'ai-practical-strategy',
    sections: [
      { id: 'overview', title: '실험 관리가 왜 필수인가' },
      { id: 'wandb', title: 'Weights & Biases 실전' },
      { id: 'mlflow', title: 'MLflow: 셀프 호스팅 추적' },
      { id: 'reproducibility', title: '재현성: 시드, 환경, 버전 관리' },
    ],
    component: () => import('@/pages/articles/ai/experiment-tracking'),
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

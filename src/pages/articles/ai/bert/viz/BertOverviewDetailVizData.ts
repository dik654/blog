export const C = {
  base: '#6366f1',
  large: '#10b981',
  emb: '#f59e0b',
  enc: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① BERT-base vs BERT-large 구조 비교',
    body: 'BERT-base: 12 Transformer 층, hidden 768, 12 attention heads, FFN 3072 → 총 110M params.\nBERT-large: 24층, hidden 1024, 16 heads, FFN 4096 → 총 340M params.\n두 모델 모두 Max Seq Length 512, Vocabulary 30,522(WordPiece) 동일.\nFFN 크기 = hidden x 4 (표준 비율). 파라미터 수 대부분이 attention + FFN에 집중.\nlarge는 base 대비 3.1배 파라미터 — GLUE 벤치마크 +2~3% 성능 향상.',
  },
  {
    label: '② 3종 임베딩 합산 → 입력 벡터',
    body: 'Token Embedding: 30,522 x 768 행렬 — 각 서브워드(WordPiece 토큰)에 학습 가능한 벡터 할당.\nPosition Embedding: 512 x 768 — 원논문 sinusoidal 대신 학습 가능 방식. 최대 512 위치.\nSegment Embedding: 2 x 768 — 문장 A(0번)와 문장 B(1번)를 구분.\nInput = Token + Position + Segment 세 벡터의 원소별 합산.\n왜 학습 가능 Position? sinusoidal은 고정 패턴 — BERT는 데이터에서 최적 위치 표현을 학습.\n512 초과 입력은 truncation 필수 — Longformer(2020)가 이 제한을 4K+ 으로 확장.',
  },
  {
    label: '③ Transformer Encoder Block 구조',
    body: '각 블록은 4단계: Multi-Head Self-Attention → Add&Norm → FFN → Add&Norm.\nAttention: Q,K,V 투영 후 scaled dot-product. 모든 토큰이 모든 토큰 참조(양방향).\nFFN: 768 → 3072(ReLU/GELU) → 768. 비선형 변환으로 표현력 확장.\nResidual Connection: 입력을 출력에 더해 기울기 소실 방지.\nLayerNorm: 각 토큰 벡터를 정규화 — 학습 안정성.\n출력: 각 토큰 위치마다 768차원 contextualized embedding 벡터.',
  },
  {
    label: '④ 사전학습 + 파인튜닝 패러다임',
    body: '기존(2017 이전): 태스크별 전용 아키텍처 설계, 소규모 데이터에서 제로부터 학습, feature engineering 필수.\nBERT 방식: ①대규모 코퍼스(3.3B words) 사전학습 → ②태스크별 가벼운 헤드 추가 → ③전체 파인튜닝.\n양방향성이 핵심 혁신 — ELMo는 좌→우, 우→좌 LSTM concat, GPT는 좌→우만.\nBERT: MLM으로 양방향 동시 학습 — "The [MASK] sat on the mat" → 양쪽 문맥으로 "cat" 예측.\nGLUE 벤치마크: 이전 SOTA 68.9 → BERT-large 80.5(+11.6점). 11개 태스크 동시 SOTA.\n파생: RoBERTa, ALBERT, ELECTRA, DeBERTa | 도메인: BioBERT, FinBERT, LegalBERT.',
  },
];

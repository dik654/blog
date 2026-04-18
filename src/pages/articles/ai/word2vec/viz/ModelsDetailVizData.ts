import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'CBOW 흐름 -- 주변 단어들의 평균으로 중심 단어를 예측',
    body: '입력: 윈도우 크기 c=2일 때 context = [The, cat, on, the] (중심 "sat"의 좌우 2개씩).\n각 단어를 one-hot 벡터(V차원)로 변환 → W(V×D) 행렬에서 임베딩 조회. D=300이 표준.\nh = (1/2c) × Σ v_context — 주변 단어 임베딩의 단순 평균. 순서 정보는 소실(bag of words).\n출력층: score = W\'(V×D)ᵀ · h → softmax로 P(sat|context) 계산. 정답 확률 최대화가 목표.\n손실: L = -log P(w_target|context). 역전파로 W, W\' 동시 업데이트.\nCBOW는 맥락을 평균 내므로 빈도 높은 단어의 표현이 안정적 — 소규모 말뭉치에서 유리.',
  },
  {
    label: 'Skip-gram 흐름 -- 하나의 중심 단어로 여러 맥락 단어를 예측',
    body: '입력: 중심 단어 "sat" → one-hot → W 조회 → h = W[sat] ∈ R^D (D=300).\n출력: 각 context word마다 독립적으로 P(c|w) = softmax(W\'ᵀ · h) 계산.\nwindow=5이면 좌우 5개씩 총 10개의 (center, context) 쌍 생성 — CBOW의 10배 학습 신호.\n목적함수: L = -(1/T) Σ_{t=1}^{T} Σ_{-c≤j≤c, j≠0} log P(w_{t+j}|w_t).\n희귀 단어도 개별 예측 대상이 되므로 저빈도 단어 표현이 CBOW보다 정밀.\nGoogle News 300B 토큰 학습 시 Semantic accuracy 61%, Syntactic accuracy 69% 달성.',
  },
  {
    label: 'CBOW vs Skip-gram 비교 -- 속도 vs 품질 트레이드오프',
    body: 'Google Analogy 벤치마크 결과 (D=300, window=5, 1.6B 토큰):\nSemantic accuracy — CBOW 60.2%, Skip-gram 61.0% (유사). "king:queen = man:woman" 류.\nSyntactic accuracy — CBOW 59.1%, Skip-gram 69.2%로 10%p 차이. "big:bigger = small:smaller" 류.\n학습 속도 — CBOW가 약 5배 빠름. 이유: CBOW는 배치당 1회 예측, Skip-gram은 2c회 예측.\n선택 기준: 데이터 < 100M 토큰이면 CBOW(안정성), > 1B 토큰이면 Skip-gram(희귀어 품질).\n실무에서는 Skip-gram + Negative Sampling 조합이 사실상 표준 — gensim, fastText 기본값.',
  },
  {
    label: '임베딩 추출 -- 학습된 W 행렬이 곧 단어 벡터',
    body: 'W(V×D) 행렬 — V=10만 어휘, D=300이면 3천만 개 파라미터. 각 행 W[i] ∈ R^300이 단어 i의 임베딩.\n입력 행렬 W와 출력 행렬 W\' 중 W만 사용하는 것이 일반적. W+W\' 평균도 가능하나 개선 미미.\n벡터 산술: v(king) - v(man) + v(woman) ≈ v(queen). cosine similarity로 가장 가까운 단어 검색.\n이 산술이 작동하는 이유 — 학습 과정에서 "왕족" 방향과 "성별" 방향이 독립 축으로 분리.\n추출된 벡터를 downstream task의 입력으로 전이(transfer) — 감정 분석, NER, 기계 번역 등.\n사전학습 벡터(pretrained embeddings)로 소규모 데이터에서도 높은 성능. fine-tuning 선택적.',
  },
];

export const COLORS = {
  cbow: '#6366f1',
  skip: '#f59e0b',
  embed: '#10b981',
  matrix: '#8b5cf6',
  dim: '#94a3b8',
  neg: '#ef4444',
};

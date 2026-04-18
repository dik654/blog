import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  hi: '#6366f1',
  ok: '#10b981',
  warn: '#ef4444',
  gold: '#f59e0b',
  m: 'var(--muted-foreground)',
};

export const STEPS: StepDef[] = [
  {
    label: 'CBOW vs Skip-gram: 두 가지 아키텍처',
    body: 'CBOW(Continuous Bag of Words): P(w_t | w_{t-c},...,w_{t+c}). 주변 2c개 단어의 임베딩 평균 → 중심 단어 예측.\n은닉층: h = (1/2c) Σ v_{w_i}. 주변 단어 벡터를 평균 — 순서 정보 소실(bag of words). 빈번한 단어에 안정적.\nSkip-gram: P(w_{t+j} | w_t), -c≤j≤c, j≠0. 중심 단어 하나로 주변 각 단어를 개별 예측.\n은닉층: h = v_{w_t}. 중심 단어 벡터 그대로 사용 — 각 (center, context) 쌍이 독립 학습 샘플.\n예시: "the cat sat on the mat", c=2, center="sat".\nCBOW: [the, cat, on, the] → "sat" 예측. Skip-gram: "sat" → "the", "cat", "on", "the" 각각 예측.',
  },
  {
    label: 'Negative Sampling: softmax의 V차원 문제 해결',
    body: 'Full softmax: P(w|c) = exp(v_w · v_c) / Σ_{w\'=1}^{V} exp(v_{w\'} · v_c). 분모가 V번 내적 — V=10만이면 비현실적.\nNegative Sampling 변환: V-class 분류 → 이진 분류 (k+1)개.\nL = log σ(v_w · v_c) + Σ_{i=1}^{k} E_{w_i~P_n}[log σ(-v_{w_i} · v_c)]. 정답 쌍(+), 랜덤 k개(-) 판별.\nσ(x) = 1/(1+e^{-x}). 정답 내적은 크게(σ→1), 가짜 내적은 작게(σ(-x)→1).\nP_n(w) = f(w)^{3/4} / Z. 지수 3/4가 핵심 — 고빈도 단어의 샘플링 확률을 억제.\nk=5~20. Mikolov(2013): 작은 데이터셋은 k=5~20, 큰 데이터셋은 k=2~5로도 충분.',
  },
  {
    label: 'GloVe & FastText: 확장과 변형',
    body: 'GloVe(Pennington 2014): 목적함수 J = Σ_{i,j} f(X_{ij})(w_iᵀw_j + b_i + b_j - log X_{ij})².\nX_{ij} = 단어 i,j의 동시발생 횟수. f(x) = min(1, (x/x_max)^{0.75}) — 고빈도 쌍의 가중치 제한.\n전역 통계(동시발생 행렬)를 활용하면서 SGD로 효율적 학습 — Word2Vec과 SVD의 장점 결합.\nFastText(Bojanowski 2016): 단어를 character n-gram으로 분해. "where" → "<wh", "whe", "her", "ere", "re>".\n단어 벡터 = 서브워드 벡터의 합. v("where") = Σ v(n-gram). 미등록어(OOV)도 서브워드 조합으로 벡터 생성.\n형태론이 풍부한 언어(터키어, 핀란드어, 한국어)에서 특히 효과적 — "달리다/달린/달리는" 공통 어근 공유.',
  },
  {
    label: '임베딩의 핵심 성질: 벡터 산술',
    body: '벡터 산술: v("king") - v("man") + v("woman") ≈ v("queen"). 코사인 유사도 기준 top-1 정확도.\n작동 원리: "king"-"man" = "royalty" 방향 벡터. "woman" + "royalty" ≈ "queen". 의미 관계가 평행 이동으로 인코딩.\n다른 예시: v("Paris") - v("France") + v("Japan") ≈ v("Tokyo"). 수도-국가 관계.\nGoogle Analogy 벤치마크: 19,544 쌍. Semantic(수도, 통화) + Syntactic(시제, 비교급). Word2Vec 정확도 약 60~70%.\n한계: 다대다 관계(동음이의어), 먼 유추("atom":"molecule"≈"cell":"organism")에서 정확도 급락.\n정적 임베딩 시대(2013~2017) → 문맥 임베딩(2018+): BERT는 12층 Transformer로 문맥별 동적 벡터 생성. 다의어 해결.',
  },
];

export const cbowCode = `목표: P(w_t | w_{t-c}, ..., w_{t-1}, w_{t+1}, ..., w_{t+c})

예) 창문 크기 c=2:
  문장: "나는 [빠른] 갈색 [여우를] 보았다"
  입력: ["나는", "빠른", "여우를", "보았다"] (주변 4단어)
  출력: "갈색" (중심 단어) 예측

은닉층 h = (1/2c) * Σ W[w_i]   ← 입력 벡터 평균
출력 y_j = softmax(W' · h)      ← 어휘 전체에 대한 확률`;

export const cbowAnnotations = [
  { lines: [1, 1] as [number, number], color: 'sky' as const, note: '맥락 → 중심 단어 예측' },
  { lines: [3, 6] as [number, number], color: 'emerald' as const, note: '윈도우 c=2 예시' },
  { lines: [8, 9] as [number, number], color: 'amber' as const, note: '벡터 평균 → 소프트맥스' },
];

export const skipgramCode = `목표: P(w_{t+j} | w_t) for -c ≤ j ≤ c, j ≠ 0

예) 창문 크기 c=2:
  입력: "갈색" (중심 단어)
  출력: ["나는", "빠른", "여우를", "보았다"] (주변 단어들 각각 예측)

각 주변 단어에 대해:
  h = W[w_t]                    ← 중심 단어 벡터
  y_j = softmax(W' · h)         ← j번째 주변 단어 예측`;

export const skipgramAnnotations = [
  { lines: [1, 1] as [number, number], color: 'sky' as const, note: '중심 → 맥락 단어 예측 (CBOW 반대)' },
  { lines: [3, 5] as [number, number], color: 'emerald' as const, note: '하나의 입력으로 여러 예측' },
];

export const objectiveCode = `J(θ) = (1/T) Σ_{t=1}^{T} Σ_{-c ≤ j ≤ c, j≠0} log P(w_{t+j} | w_t; θ)

P(w_O | w_I) = exp(v'_{w_O}ᵀ · v_{w_I}) / Σ_{w=1}^{V} exp(v'_w ᵀ · v_{w_I})

문제: 어휘 V가 수십만 개 → softmax 계산이 O(V)로 너무 느림
해결: Negative Sampling 또는 Hierarchical Softmax`;

export const objectiveAnnotations = [
  { lines: [1, 1] as [number, number], color: 'sky' as const, note: 'Skip-gram 로그 우도 최대화' },
  { lines: [3, 3] as [number, number], color: 'emerald' as const, note: '소프트맥스 확률 정의' },
  { lines: [5, 6] as [number, number], color: 'rose' as const, note: 'O(V) 병목 → 근사법 필요' },
];

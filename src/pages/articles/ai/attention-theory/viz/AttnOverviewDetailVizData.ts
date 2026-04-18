import type { StepDef } from '@/components/ui/step-viz';

export const C = { enc: '#6366f1', dec: '#10b981', bottleneck: '#ef4444', attn: '#f59e0b', muted: '#64748b' };

export const BLEU = [
  { len: '<10', score: 26.5 },
  { len: '10-20', score: 28.1 },
  { len: '20-30', score: 25.8 },
  { len: '30-40', score: 17.3 },
  { len: '>40', score: 12.4 },
];

export const SCORE_FUNCS = [
  { name: 'Additive', formula: 'vᵀ tanh(W[Q;K])', params: 'W, v' },
  { name: 'Dot', formula: 'Qᵀ · K', params: '—' },
  { name: 'Scaled', formula: 'QᵀK / √d', params: '—' },
  { name: 'Bilinear', formula: 'Qᵀ W K', params: 'W' },
];

export const STEPS: StepDef[] = [
  {
    label: 'Seq2Seq — 고정 벡터 압축 문제',
    body: '인코더 마지막 hidden state hᵀ만이 디코더에 전달된다.\n10단어든 100단어든 동일한 d=512 벡터 하나에 압축.\nh₁, h₂, ..., hₜ₋₁ 정보는 반복 누적을 거치며 희석된다.\nCho et al. 2014 실험: 30단어 이상에서 BLEU 점수가 28.1 → 17.3으로 급락.',
  },
  {
    label: 'BLEU 점수 급락 — 정보 병목 실험 근거',
    body: '문장 길이 vs BLEU 바 차트 — 30단어 부근에서 급격한 하락.\n<10: 26.5 | 10-20: 28.1 | 20-30: 25.8 | 30-40: 17.3 | >40: 12.4\n압축률이 높아질수록 초반 단어 정보가 먼저 소실.\nRNN 특성상 마지막 토큰에 가중치 편향 — 어순 주어-동사 관계 놓침.',
  },
  {
    label: 'Attention 3단계: Score → Weight → Aggregate',
    body: 'Step 1: score(Q, Kᵢ) — Query와 각 Key의 유사도 측정.\nStep 2: αᵢ = softmax(scoreᵢ) — 확률 분포로 정규화.\nStep 3: output = Σ αᵢ · Vᵢ — 가중합으로 컨텍스트 생성.\n핵심 직관: 검색 시스템과 동일. Q=검색어, K=인덱스, V=문서 내용.\n단, 단일 선택이 아닌 가중합 — soft retrieval.',
  },
  {
    label: 'Score 함수 종류 비교',
    body: 'Additive: vᵀ tanh(W[Q;K]) — MLP 기반, 다른 차원 Q,K 허용.\nDot: Qᵀ·K — 파라미터 없음, 같은 차원 필수, 가장 빠름.\nScaled: QᵀK/√dₖ — Transformer 표준, softmax 포화 방지.\nBilinear: QᵀWK — 학습 행렬 W로 유사도 함수 자체를 학습.\n3가지 축: Q-K 출처(self/cross), score 방법, 제약(mask 유무).',
  },
];

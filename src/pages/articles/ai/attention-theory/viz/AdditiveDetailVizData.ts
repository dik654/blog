import type { StepDef } from '@/components/ui/step-viz';

export const C = { enc: '#6366f1', dec: '#10b981', score: '#f59e0b', ctx: '#ef4444', muted: '#64748b' };

/* Example vectors for computation trace */
export const S_VEC = [0.4, 0.8];
export const H_VECS = [[0.8, 0.2], [0.1, 0.9], [0.5, 0.5], [0.3, 0.7]];
export const RAW_SCORES = [2.1, 3.5, 1.0, 0.4];
export const ALPHAS = [0.30, 0.50, 0.12, 0.08];
export const CTX = [0.33, 0.56];

/* Alignment matrix for En→Fr */
export const ALIGN_SRC = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
export const ALIGN_TGT = ['Le', 'chat', 'assis', 'sur', 'le', 'tapis'];
export const ALIGN_MATRIX = [
  [0.9, 0.0, 0.0, 0.0, 0.1, 0.0],
  [0.0, 0.9, 0.1, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.8, 0.1, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.9, 0.0, 0.1],
  [0.0, 0.0, 0.0, 0.0, 0.9, 0.1],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.9],
];

export const STEPS: StepDef[] = [
  {
    label: 'MLP 점수 계산: W₁s + W₂h → tanh → vᵀ',
    body: '디코더 s₃=[0.4, 0.8]과 각 인코더 hⱼ를 별도 행렬로 투영.\nW₁·s → (d_attn,), W₂·hⱼ → (d_attn,). 두 벡터를 더한 뒤 tanh 비선형성 적용.\nvᵀ · tanh(·) → 스칼라 점수. e₁=2.1, e₂=3.5, e₃=1.0, e₄=0.4.\n"Additive" 이름 유래: W₁s와 W₂h를 더하기 때문.\nQ와 K의 차원이 달라도 적용 가능 — 각자 d_attn으로 매핑.',
  },
  {
    label: 'Softmax 정규화 → 주의 분포',
    body: '점수 [2.1, 3.5, 1.0, 0.4] → exp → 정규화.\nα = [0.30, 0.50, 0.12, 0.08]. h₂에 50% 집중.\nSoftmax는 점수 차이를 확대하여 sharp한 주의 만들.\n모든 α의 합 = 1.0 — 확률 분포로 해석 가능.\n가장 높은 점수 위치가 번역에 가장 많이 기여.',
  },
  {
    label: '컨텍스트 벡터: c = Σ αᵢ · hᵢ',
    body: 'c = 0.30×[0.8,0.2] + 0.50×[0.1,0.9] + 0.12×[0.5,0.5] + 0.08×[0.3,0.7]\nc = [0.33, 0.56]. h₂ 정보가 지배적.\n디코더 다음 스텝에서는 새로운 α → 새로운 c 생성.\nSeq2Seq는 고정 c 하나, Attention은 매 스텝 다른 c.\n디코더 업데이트: sᵢ = RNN(sᵢ₋₁, concat(yᵢ₋₁, cᵢ)).',
  },
  {
    label: '번역 정렬 학습 — 감독 없이 자동',
    body: 'En→Fr 번역에서 Attention 행렬이 대각선 패턴 발견.\n"The"→"Le" (0.9), "cat"→"chat" (0.9) — 단어 대응 자동 학습.\n언어 어순 차이도 포착: "I want it" → "Je le veux"에서 역순 대응.\n명시적 정렬 레이블 없이 번역 손실 최소화만으로 학습.\n해석 가능성: 어떤 원어 단어에 주목했는지 시각화 가능.',
  },
];

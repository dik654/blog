export const STEPS = [
  {
    label: '① 특징 추출 완료',
    body: 'GemmaScope — Google DeepMind가 Gemma 2B에 400+개 SAE를 적용. 각 특징이 "의문", "확신", "유머" 등 해석 가능한 개념에 대응.',
  },
  {
    label: '② 강도 약하게 조절 (값=100)',
    body: '"의문/불확실성" 특징을 100으로 고정 → 모델이 매우 회의적으로 변함. Claude 3 Sonnet에서도 Golden Gate Bridge 특징이 텍스트·이미지 모두에 반응(멀티모달).',
  },
  {
    label: '③ 강도 과도하게 조절 (값=500) → 붕괴',
    body: '값을 너무 높이면 모델 붕괴 — 의미 없는 출력 생성. 적절한 범위 내에서만 유효한 제어 가능.',
  },
];

export const C = {
  feat: '#10b981',
  mild: '#f59e0b',
  crash: '#ef4444',
  muted: 'var(--muted-foreground)',
};

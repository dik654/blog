export const STEPS = [
  {
    label: '① LLM = 블랙박스',
    body: '수십억 개의 파라미터가 어떤 의미를 갖는지 알 수 없음. "이 단어를 잊어라"라고 해도 내부에서는 여전히 해당 정보를 보유.',
  },
  {
    label: '② 특징(Feature) 추출',
    body: '기계적 해석 가능성(Mechanistic Interpretability) — 모델 내부의 뉴런 출력을 분석하여 "의심", "도시 이름" 같은 해석 가능한 특징을 분리.',
  },
  {
    label: '③ 행동 제어(Steering)',
    body: '추출한 특징의 강도를 조절하면 모델 행동이 변함. 예: "내적 갈등" 특징을 강화하면 단어를 잊지 못하는 모델이 됨.',
  },
];

export const C = {
  box: '#6366f1',
  feat: '#10b981',
  steer: '#f59e0b',
  muted: 'var(--muted-foreground)',
};

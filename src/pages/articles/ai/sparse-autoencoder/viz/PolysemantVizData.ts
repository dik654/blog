export const STEPS = [
  {
    label: '① 단일 뉴런 반응 관찰',
    body: '특정 레이어의 뉴런 #1423이 "의심" 관련 텍스트에 높게 반응 → 이 뉴런이 "의심" 개념을 담당?',
  },
  {
    label: '② 다의성(Polysemanticity) 발견',
    body: '같은 뉴런이 "대문자 약어", "법률 용어" 등 전혀 관련 없는 개념에도 반응. 한 뉴런 = 한 개념이 아님.',
  },
  {
    label: '③ 중첩 가설(Superposition)',
    body: 'Anthropic(2022) — 모델이 뉴런 수보다 더 많은 개념을 표현. 여러 뉴런의 조합으로 개념을 인코딩 → 단일 뉴런 분석 불가.',
  },
];

export const C = {
  neuron: '#6366f1',
  multi: '#ef4444',
  super: '#10b981',
  muted: 'var(--muted-foreground)',
};

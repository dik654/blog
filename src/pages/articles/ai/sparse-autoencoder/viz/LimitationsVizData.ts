export const STEPS = [
  {
    label: '① 해석 가능성의 암흑 물질',
    body: 'Chris Olah — "추출한 특징은 전체의 극히 일부(1% 미만)." 모델이 실제로 사용하는 대다수의 내부 표현은 아직 파악 불가.',
  },
  {
    label: '② 단일 레이어의 한계',
    body: 'SAE는 특정 레이어의 잔차 흐름에만 적용. 여러 레이어에 걸친 복잡한 구조(회로, circuit)를 파악하기 어려움.',
  },
  {
    label: '③ Sparse Crosscoder — 후속 연구',
    body: '레이어 간 관계를 파악하는 후속 연구. 특징 확장성 문제도 존재하지만, SAE는 LLM 블랙박스를 여는 가장 유망한 도구.',
  },
];

export const C = {
  dark: '#6366f1',
  limit: '#ef4444',
  future: '#10b981',
  muted: 'var(--muted-foreground)',
};

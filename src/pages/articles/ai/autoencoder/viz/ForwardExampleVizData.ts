export const STEPS = [
  {
    label: '① 입력: x = [0.8, 0.4]',
    body: '2차원 입력 벡터. 이 값을 1차원 잠재 공간으로 압축할 것.',
  },
  {
    label: '② 인코더: 0.5×0.8 + 0.3×0.4 = 0.52',
    body: '가중치 w_enc=[0.5, 0.3]을 입력에 곱하여 선형 결합. 가중합 = 0.52.',
  },
  {
    label: '③ sigmoid(0.52) = 0.627 → 잠재값 z',
    body: 'sigmoid 활성화로 비선형 변환. z=0.627이 잠재 공간의 유일한 값.',
  },
  {
    label: '④ 디코더: w_dec × z → [0.376, 0.439]',
    body: 'w_dec=[0.6, 0.7] × 0.627 → 각각 0.376, 0.439.',
  },
  {
    label: '⑤ sigmoid → 출력 [0.593, 0.608]',
    body: 'sigmoid(0.376)=0.593, sigmoid(0.439)=0.608. 입력 [0.8, 0.4]와 비교하면 아직 부정확.',
  },
];

export const C = {
  inp: '#3b82f6',
  enc: '#6366f1',
  lat: '#f59e0b',
  dec: '#10b981',
  muted: 'var(--muted-foreground)',
};

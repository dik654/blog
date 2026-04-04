// 잔차 신경망: 3층, w=0.1, x=0.5, 스킵 커넥션 있음
// 순전파: y = sigmoid(w3*h2) + x = 0.5128 + 0.5 = 1.0128 (출력에 x 직접 더함)
// 실제 비교를 위해 sigmoid 출력에 스킵 더한 구조

export const residualGradients = [
  { layer: 'dL/dw3', plain: 0.1148, residual: 0.1213, unit: '' },
  { layer: 'dL/dw2', plain: 0.00311, residual: 0.0030, unit: '(메인)' },
  { layer: 'dL/dw1', plain: 0.000076, residual: 0.003024, unit: '(합산)' },
];

export const compSteps = [
  {
    label: '같은 조건: 3층, w=0.1, x=0.5 + 스킵 커넥션',
    body: '순전파: y = sigmoid(w3*h2) + x = 0.5128 + 0.5 = 1.0128',
  },
  {
    label: 'dL/dw3 = 0.1213 (출력층, 유사)',
    body: '출력층 기울기는 일반/잔차 큰 차이 없음',
  },
  {
    label: 'dL/dw2 = 0.0030 (메인 경로, 유사)',
    body: '메인 경로만의 기울기는 여전히 작음 — 핵심은 스킵 경로',
  },
  {
    label: 'dL/dw1 합산 = 0.003024 (40배 개선!)',
    body: '메인 0.000295 + 스킵 0.002729 = 0.003024. 일반(0.000076) 대비 40배',
  },
];

export const PLAIN_COLOR = '#ef4444';
export const RES_COLOR = '#10b981';

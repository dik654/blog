export const skipSteps = [
  {
    label: '일반 네트워크: 직렬 경로만 존재',
    body: 'dL/dw1 = dL/dy × dy/dh2 × dh2/dh1 × dh1/dw1 — 곱셈이 많아 기울기 소실',
  },
  {
    label: '잔차 블록: y = F(x) + x',
    body: '입력 x를 출력에 직접 더함. 네트워크는 잔차 F(x) = y - x 만 학습하면 됨',
  },
  {
    label: '역전파: 스킵 경로가 기울기를 직접 전달',
    body: 'dy/dx = dF(x)/dx + 1 — "+1"이 기울기가 최소 1 이상임을 보장',
  },
  {
    label: '결과: 두 경로의 기울기가 합산',
    body: '빨간(메인) 경로 기울기 + 파란(스킵) 경로 기울기 → 기울기 소실 방지',
  },
];

export const MAIN_COLOR = '#ef4444';
export const SKIP_COLOR = '#3b82f6';
export const NODE_COLOR = '#10b981';

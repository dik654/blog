export const STEPS = [
  { label: 'ARIMA(p,d,q) 전체 수식', body: 'AR(자기회귀) + I(차분) + MA(이동평균)의 세 요소를 결합합니다.' },
  { label: 'AR(p): 과거 값 의존', body: '이전 p개 관측값에 가중치 φ를 곱해 현재 값을 예측합니다.' },
  { label: 'I(d): 차분으로 정상성 확보', body: 'd번 차분하여 추세를 제거하고 평균이 일정한 시계열로 변환합니다.' },
  { label: 'MA(q): 과거 오차 반영', body: '이전 q개 예측 오차에 가중치 θ를 곱해 현재 값을 보정합니다.' },
];
export const T = [0, 1, 2, 3, 4];
export const CY = 50;
export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

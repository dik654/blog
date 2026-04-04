export const errorData = [
  { label: '20층 (plain)', train: 8.82, test: 10.15, color: '#10b981' },
  { label: '56층 (plain)', train: 9.97, test: 13.63, color: '#ef4444' },
];

export const overviewSteps = [
  {
    label: '직관: 깊을수록 좋다?',
    body: '파라미터가 많을수록, 층이 깊을수록 더 복잡한 패턴을 학습할 수 있다고 기대',
  },
  {
    label: '현실: 56층이 20층보다 나쁘다',
    body: 'CIFAR-10 실험 — 56층 plain 네트워크의 train/test 에러 모두 20층보다 높음',
  },
  {
    label: '원인: 기울기 소실 (Vanishing Gradient)',
    body: '역전파 시 기울기가 층을 거칠수록 지수적으로 작아져 앞쪽 가중치 갱신 불가',
  },
  {
    label: '해결: 스킵 커넥션 (Residual Connection)',
    body: 'y = F(x) + x — 입력을 출력에 직접 더해 기울기가 소실 없이 전달되는 경로 확보',
  },
];

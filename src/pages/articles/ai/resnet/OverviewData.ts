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
    label: '문제: 더 깊은 plain net의 최적화가 어렵다',
    body: 'train error까지 높으므로 단순 과적합이 아니다. 기울기 경로의 조건과 identity 변환 학습 난도가 함께 문제를 만든다.',
  },
  {
    label: '해결: 스킵 커넥션 (Residual Connection)',
    body: 'y = F(x) + x — 입력을 출력에 직접 더해 residual branch와 별개의 짧은 정보·기울기 경로를 확보',
  },
];

import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Degradation Problem의 발견',
    body: 'CIFAR-10 실험: 20층 plain CNN train error=7.5%, 56층 train error=8.7%.\n더 깊은 네트워크가 훈련 에러조차 더 높음 — 과적합이 아니라 최적화 실패.\nBatchNorm/Xavier 초기화로도 해결 불가.\n핵심 통찰: "56층이 20층보다 나쁠 수 없다 — 추가 36층이 항등 함수만 학습해도".\n해결책: F(x) = H(x) - x (잔차 학습). 항등 함수는 skip으로 공짜 제공.\n결과: ResNet-152가 VGG-19보다 8배 깊지만 파라미터 적음. Top-5 error 3.57%.',
  },
  {
    label: '깊이별 성능 변화',
    body: 'Plain Net: 18층 27.94% → 34층 28.54% (악화!).\nResNet: 18층 27.88% → 34층 25.03% → 50층 22.85% → 152층 21.43%.\n1202층 시도: 더 이상 개선 없음 (다른 한계 도달).\nPlain-56 학습곡선: loss 높게 유지. ResNet-56: 부드럽게 감소.\nSkip connection이 Transformer·LLM의 표준 빌딩 블록으로 확장.\n피인용 수 20만+ — NeurIPS 역사상 최다.',
  },
];

export const C = {
  plain: '#ef4444',
  resnet: '#10b981',
  dim: '#94a3b8',
  accent: '#3b82f6',
};

import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Hard Label: 정답에 1, 나머지에 0',
    body: '기존 원-핫 인코딩 — 모델이 정답 클래스에 극단적으로 높은 logit을 출력하도록 강제. 과신(overconfidence) 유발.',
  },
  {
    label: 'Label Smoothing: 정답에 (1-ε), 나머지에 ε/K',
    body: 'ε=0.1, K=5 클래스 → 정답: 0.92, 나머지: 0.02씩. 모델이 "절대적 확신"을 피하게 유도.',
  },
  {
    label: 'Mixup: 두 샘플의 이미지와 라벨을 선형 혼합',
    body: 'x̃ = λ·xᵢ + (1-λ)·xⱼ, ỹ = λ·yᵢ + (1-λ)·yⱼ — λ ~ Beta(α, α). 결정경계를 부드럽게 만듦.',
  },
  {
    label: 'CutMix: 이미지 일부를 다른 이미지로 교체',
    body: '직사각형 영역을 잘라내고 다른 이미지로 대체. 라벨은 면적 비율로 혼합. Mixup보다 지역 정보 보존.',
  },
];

export const COLORS = {
  hard: '#ef4444',
  smooth: '#3b82f6',
  mixup: '#10b981',
  cutmix: '#8b5cf6',
};

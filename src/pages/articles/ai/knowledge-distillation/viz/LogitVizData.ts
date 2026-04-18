import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Teacher의 logit 출력 → softmax(z/T)',
    body: 'Teacher가 입력 x에 대해 logit 벡터 z를 출력.\nsoftmax(zᵢ/T)로 soft probability 생성.\nT=1이면 일반 softmax, T>1이면 분포가 부드러워짐.',
  },
  {
    label: '② Student도 같은 Temperature로 softmax 계산',
    body: 'Student의 logit q를 같은 T로 나눈 뒤 softmax 적용.\nTeacher의 soft target과 Student의 soft prediction을 비교.',
  },
  {
    label: '③ KL Divergence: 두 분포의 차이 측정',
    body: 'L_soft = T² · KL(p_T ∥ q_T)\nTeacher 분포 p_T와 Student 분포 q_T의 차이를 최소화.\nT²를 곱하는 이유: gradient 크기가 1/T²로 줄어드는 것을 보상.',
  },
  {
    label: '④ Hard Loss: 정답 라벨과의 Cross-Entropy',
    body: 'L_hard = CE(y, σ(q))\ny: one-hot 정답, σ(q): Student의 T=1 softmax.\nhard label도 함께 학습해야 정확도가 떨어지지 않음.',
  },
  {
    label: '⑤ 최종 손실 = α·L_hard + (1-α)·L_soft',
    body: 'α: 보통 0.1~0.5 — soft loss 비중이 더 큼.\nα가 작을수록 Teacher 의존도 ↑, 클수록 정답 의존도 ↑.\n실전: α=0.1, T=4~20이 자주 사용됨.',
  },
];

export const C = {
  teacher: '#6366f1',
  student: '#10b981',
  soft: '#f59e0b',
  hard: '#ef4444',
  kl: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

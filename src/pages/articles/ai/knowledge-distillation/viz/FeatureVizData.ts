import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Feature Distillation: 중간 레이어의 표현을 전달',
    body: 'Logit distillation은 최종 출력만 전달.\nFeature distillation은 중간 레이어의 활성화(feature map)도 전달.\nTeacher의 중간 표현에는 계층적 특징 정보가 담겨 있음.',
  },
  {
    label: '② FitNets: Hint Layer Matching',
    body: 'Romero et al.(2015): Teacher의 중간 레이어(hint)를 Student가 모방.\nStudent의 guided layer 출력이 Teacher의 hint layer와 일치하도록 학습.\nL_hint = ∥ W_r · F_S − F_T ∥² — W_r: 차원 맞춤 변환 행렬.',
  },
  {
    label: '③ Attention Transfer: 어텐션 맵 전달',
    body: 'Zagoruyko & Komodakis(2017): feature map 대신 attention map을 전달.\nAttention map = 채널 축 합산 후 L2 정규화.\n장점: 차원 불일치 문제 없음 — 공간 해상도만 맞으면 됨.',
  },
  {
    label: '④ PKT: Probabilistic Knowledge Transfer',
    body: '표현 공간의 확률 분포 자체를 전달.\nTeacher/Student의 feature를 확률 분포로 변환 후 KL divergence 최소화.\n구조적 관계(유사도)를 보존하므로 전이 효율이 높음.',
  },
  {
    label: '⑤ 비교: Logit vs Feature vs Attention',
    body: 'Logit: 구현 단순, 최종 출력만 필요.\nFeature: 정보량 풍부, 차원 맞춤 필요.\nAttention: 차원 불일치 해소, 중간 복잡도.\n실전: 여러 기법 조합 시 성능 극대화.',
  },
];

export const C = {
  teacher: '#6366f1',
  student: '#10b981',
  feature: '#f59e0b',
  attention: '#ec4899',
  pkt: '#06b6d4',
  muted: 'var(--muted-foreground)',
};

import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Teacher 모델: 대규모 파라미터로 높은 정확도',
    body: 'ResNet-152, BERT-large 등 수십억 파라미터의 모델.\n추론 비용이 크지만, 데이터의 미세한 패턴까지 포착.',
  },
  {
    label: '② Hard Label vs Soft Target',
    body: 'Hard label: [0, 1, 0] — 정답 클래스만 1.\nSoft target: [0.05, 0.85, 0.10] — 클래스 간 유사도 정보 포함.\n"고양이 85%, 호랑이 10%" — 이 관계가 dark knowledge.',
  },
  {
    label: '③ Temperature Scaling: 분포를 부드럽게',
    body: 'softmax(zᵢ/T) — T가 높을수록 분포가 균일해짐.\nT=1: 원래 softmax, T=5~20: 부드러운 분포.\n부드러운 분포일수록 클래스 간 관계 정보가 더 드러남.',
  },
  {
    label: '④ Student 모델: 작지만 Teacher의 지식을 흡수',
    body: 'Teacher의 soft target을 학습 신호로 사용.\n같은 hard label만 배울 때보다 일반화 성능이 높음.\n모델 크기 1/4~1/10으로도 Teacher 성능의 95%+ 달성 가능.',
  },
  {
    label: '⑤ 지식 증류의 핵심: Dark Knowledge',
    body: 'Hinton(2015): "soft target에는 hard label에 없는 정보가 있다."\n오답 클래스의 확률 분포 = 클래스 간 유사도 구조.\n이 구조적 정보가 Student의 일반화를 돕는다.',
  },
];

export const C = {
  teacher: '#6366f1',
  student: '#10b981',
  soft: '#f59e0b',
  hard: '#ef4444',
  temp: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

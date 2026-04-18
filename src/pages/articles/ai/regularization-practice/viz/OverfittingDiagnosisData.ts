import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '정상 학습: Train Loss와 Val Loss가 함께 하강',
    body: '두 곡선이 나란히 내려가면 모델이 일반화 패턴을 학습 중. 이상적 상태.',
  },
  {
    label: '오버피팅 시작: Val Loss가 반등하는 순간',
    body: 'Train Loss는 계속 내려가는데 Val Loss가 올라가기 시작 — 학습 데이터의 노이즈를 외우는 중.',
  },
  {
    label: '심한 오버피팅: 두 곡선의 격차가 벌어짐',
    body: 'Train Loss ≈ 0 but Val Loss ↑↑ — 모델이 훈련셋을 완전히 암기. 새 데이터에 무력.',
  },
  {
    label: '정규화 적용 후: 격차 축소, 일반화 향상',
    body: 'Dropout·Weight Decay·Early Stopping 등으로 오버피팅 억제 → Val Loss 안정화.',
  },
];

export const COLORS = {
  train: '#3b82f6',
  val: '#ef4444',
  gap: '#f59e0b',
  reg: '#10b981',
};

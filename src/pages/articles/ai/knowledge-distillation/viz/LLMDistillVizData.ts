import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① DistilBERT: BERT의 40% 크기, 97% 성능',
    body: 'Sanh et al.(2019): BERT-base(110M) → DistilBERT(66M).\n6-layer Student가 12-layer Teacher를 모방.\ntriple loss: MLM + distillation + cosine embedding.',
  },
  {
    label: '② DistilBERT 학습 전략: 레이어 초기화',
    body: 'Student의 6개 레이어를 Teacher의 짝수 레이어(0,2,4,6,8,10)로 초기화.\n무작위 초기화보다 수렴이 빠르고 성능이 높음.\nTeacher의 구조적 지식을 초기 가중치로 직접 전달.',
  },
  {
    label: '③ TinyLlama: 대규모 데이터로 소형 모델 훈련',
    body: 'Zhang et al.(2024): 1.1B 파라미터, 3T 토큰으로 학습.\nLlama-2 아키텍처를 작은 크기로 재현.\nTeacher의 출력이 아닌, Teacher 수준의 데이터로 학습 — 데이터 증류.',
  },
  {
    label: '④ 데이터 증류: Teacher가 학습 데이터를 생성',
    body: 'Teacher(GPT-4 등)가 대량의 합성 데이터를 생성.\nStudent는 이 합성 데이터로 학습 — 직접적 지식 전달 없이 간접 증류.\nAlpaca, Vicuna 등이 이 방식으로 학습.',
  },
  {
    label: '⑤ LLM 증류 비교: 직접 vs 간접',
    body: '직접 증류: Teacher의 logit/feature를 Student가 학습.\n간접 증류(데이터): Teacher 생성 데이터로 Student 학습.\n현대 LLM은 간접 증류가 주류 — 모델 접근 없이 API만으로 가능.',
  },
];

export const C = {
  bert: '#6366f1',
  distil: '#10b981',
  tiny: '#f59e0b',
  data: '#ec4899',
  api: '#06b6d4',
  muted: 'var(--muted-foreground)',
};
